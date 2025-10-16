import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { AucsionService } from '../../../aucsion/aucsion.service';
import { BitHistoryService } from '../../../bit_history/bit_history.service';
import { AucsionResaultsService } from '../../../aucsion_resaults/aucsion_resaults.service';
import { CreateAucsionDto } from '../../../aucsion/dto/create-aucsion.dto';
import { CreateBitHistoryDto } from '../../../bit_history/dto/create-bit_history.dto';


  interface CreatedAuctionResponse {
    statusCode: number;
    message: string;
    data: {
      id: string; // DB-generated id
      title: string;
      adminId: string;
      lotId: string;
      [key: string]: any;
    };
  }
  
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/auction',
})
@Injectable()
export class AuctionGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('AuctionGateway');
  private connectedBuyers = new Map<string, any>();

  constructor(
    private readonly auctionService: AucsionService,
    private readonly bitHistoryService: BitHistoryService,
    private readonly resultsService: AucsionResaultsService,
  ) {}

  afterInit() {
    this.logger.log('Gateway initialized');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedBuyers.delete(client.id);
  }

  // ---------- 1) Buyer joins room ----------
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody()
    data: { auctionId: string; buyerId: string; full_name?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { auctionId, buyerId, full_name } = data;
    if (!auctionId || !buyerId) {
      client.emit('error', { message: 'auctionId and buyerId are required' });
      return;
    }

    client.join(auctionId);
    this.connectedBuyers.set(client.id, { buyerId, full_name, auctionId });
    client.emit('joined', { auctionId, message: "Siz roomga qo'shildingiz" });

    const buyersInRoom: any[] = [];
    for (const [, info] of this.connectedBuyers) {
      if (info.auctionId === auctionId) buyersInRoom.push(info);
    }
    this.server.to(auctionId).emit('buyers_list', buyersInRoom);
  }


  // ---------- 2) Admin creates auction (auto join + notification) ----------
  @SubscribeMessage('create_auction')
  async handleCreateAuction(
    @MessageBody() dto: CreateAucsionDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Auctionni DB-ga yaratish
     const created = (await this.auctionService.create(
       dto,
     )) as CreatedAuctionResponse;

     if (!created || !created.data) {
       client.emit('error', {
         message: 'Auction yaratishda xatolik yuz berdi',
       });
       return;
     }

     // Auto join + notify
     this.connectedBuyers.forEach((buyerInfo, socketId) => {
       const buyerSocket = this.server.sockets.sockets.get(socketId);
       if (buyerSocket) {
         buyerSocket.join(created.data.id); // endi id mavjud va tip bilan aniqlangan
         buyerSocket.emit('new_auction', {
           message: 'Yangi auction boshlandi',
           auction: created.data,
         });
       }
     });

      return created;
    } catch (error) {
      client.emit('error', {
        message: 'Auction yaratishda xatolik yuz berdi',
        error,
      });
      this.logger.error('Auction creation failed', error);
    }
  }

  // ---------- 3) Admin starts auction ----------
  @SubscribeMessage('start_auction')
  async handleStartAuction(
    @MessageBody()
    data: { auctionId: string; lotName?: string; allowedBuyers?: string[] },
    @ConnectedSocket() client: Socket,
  ) {
    const { auctionId, lotName, allowedBuyers } = data;

    if (Array.isArray(allowedBuyers) && allowedBuyers.length > 0) {
      for (const [socketId, info] of this.connectedBuyers) {
        if (allowedBuyers.includes(info.buyerId)) {
          this.server
            .to(socketId)
            .emit('auction_started', { auctionId, lotName });
        }
      }
    } else {
      this.server.to(auctionId).emit('auction_started', { auctionId, lotName });
    }

    // ---------- AUTO JOIN + NOTIFY ----------
    // Ensure all connected buyers are in the room and notified
    this.connectedBuyers.forEach((buyerInfo, socketId) => {
      const buyerSocket = this.server.sockets.sockets.get(socketId);
      if (buyerSocket) {
        buyerSocket.join(auctionId);
        buyerSocket.emit('auction_started', { auctionId, lotName });
      }
    });

    const buyersInRoom: any[] = [];
    for (const [, info] of this.connectedBuyers) {
      if (info.auctionId === auctionId) buyersInRoom.push(info);
    }
    this.server.to(auctionId).emit('buyers_list', buyersInRoom);
  }

  // ---------- 4) Buyer places bid ----------
  @SubscribeMessage('newBid')
  async handleNewBid(
    @MessageBody() data: { auctionId: string; buyerId: string; amount: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { auctionId, buyerId, amount } = data;
    if (!auctionId || !buyerId || typeof amount !== 'number') {
      client.emit('error', { message: 'Invalid bid payload' });
      return;
    }

    const bitDto: CreateBitHistoryDto = { buyerId, auctionId, amount };
    await this.bitHistoryService.create(bitDto);

    this.server.to(auctionId).emit('bid_update', {
      buyerId,
      amount,
      createdAt: new Date(),
    });

    const highest = await this.bitHistoryService.getHighestByAuction(auctionId);
    if (highest) {
      this.server.to(auctionId).emit('highest_update', highest);
    }
  }

  // ---------- 5) Admin ends auction ----------
  @SubscribeMessage('end_auction')
  async handleEndAuction(
    @MessageBody() data: { auctionId: string; lotId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { auctionId, lotId } = data;
    const highest = await this.bitHistoryService.getHighestByAuction(auctionId);
    if (!highest) {
      this.server.to(auctionId).emit('auction_ended', { message: 'No bids' });
      return;
    }

    const result = await this.resultsService.create({
      lot_id: lotId || auctionId,
      buyer_id: highest.buyerId,
      final_price: String(highest.amount),
    });

    this.server.to(auctionId).emit('auction_ended', {
      winner: highest.buyerId,
      amount: highest.amount,
      result,
    });
  }
}
