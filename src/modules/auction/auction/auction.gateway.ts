// src/modules/auction/auction.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

import { AucsionService } from '../../../korzinka/aucsion.service';
import { BitHistoryService } from '../../../bit_history/bit_history.service';
import { AucsionResaultsService } from '../../../aucsion_resaults/aucsion_resaults.service';
import { CreateAucsionDto } from '../../../korzinka/dto/create-aucsion.dto';
import { CreateBitHistoryDto } from '../../../bit_history/dto/create-bit_history.dto';
import { BuyerService } from '../../../buyer/buyer.service';
import { handleError } from '../../../helpers/response';

/**
 * Room / Redis structure used by this gateway:
 *
 * - Hash "rooms" => field: roomId -> JSON.stringify(roomMeta)
 * - Key  "room:{roomId}:meta" => JSON.stringify(roomMeta)  (optional, for TTL)
 * - Hash "buyers" => buyerId -> JSON.stringify({ socketId, joinedRooms: [...] })
 * - Hash "admins" => adminId -> JSON.stringify({ socketId, managedRooms: [...] })
 *
 * roomMeta example:
 * {
 *   roomId: string,
 *   auctionId: string,
 *   title: string,
 *   adminId: string,
 *   status: 'active' | 'finished',
 *   createdAt: ISOString
 * }
 */

interface RoomMeta {
  roomId: string;
  auctionId: string;
  title?: string;
  adminId?: string;
  status: 'active' | 'finished';
  createdAt: string;
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'auction', // frontend: io("http://.../auction")
})
@Injectable()
export class AuctionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('AuctionGateway');

  // TTL for room meta (seconds) — as a safety in case rooms don't get removed.
  private readonly ROOM_TTL_SECONDS = 60 * 60 * 6; // 6 hours (adjust as needed)

  constructor(
    private readonly resultsService: AucsionResaultsService,
    private readonly bitHistoryService: BitHistoryService,
    @InjectRedis() private readonly redisClient: Redis,
    private readonly auctionService: AucsionService,
    private readonly buyerService: BuyerService,
  ) {}

  afterInit() {
    this.logger.log('✅ AuctionGateway initialized with Redis support');
  }

  /* --------------------
     Redis helper methods
     -------------------- */

  private async saveRoom(roomId: string, meta: RoomMeta) {
    // store in global hash
    await this.redisClient.hset('rooms', roomId, JSON.stringify(meta));
    // store meta key to allow TTL
    await this.redisClient.set(`room:${roomId}:meta`, JSON.stringify(meta));
    await this.redisClient.expire(`room:${roomId}:meta`, this.ROOM_TTL_SECONDS);
  }

  private async getRoom(roomId: string): Promise<RoomMeta | null> {
    const raw = await this.redisClient.hget('rooms', roomId);
    if (raw) return JSON.parse(raw) as RoomMeta;
    // fallback to meta key (in case hashing strategy changed)
    const metaRaw = await this.redisClient.get(`room:${roomId}:meta`);
    return metaRaw ? (JSON.parse(metaRaw) as RoomMeta) : null;
  }

  private async removeRoom(roomId: string) {
    await this.redisClient.hdel('rooms', roomId);
    await this.redisClient.del(`room:${roomId}:meta`);
    // optional: also delete bids list or other room keys if used
    await this.redisClient.del(`room:${roomId}:bids`);
    await this.redisClient.del(`room:${roomId}:state`);
  }

  private async listActiveRooms(): Promise<Record<string, string>> {
    // returns the raw hash (roomId -> metaJSON)
    return await this.redisClient.hgetall('rooms');
  }

  private async saveBuyer(buyerId: string, data: any) {
    await this.redisClient.hset('buyers', buyerId, JSON.stringify(data));
  }

  private async getBuyer(buyerId: string) {
    const raw = await this.redisClient.hget('buyers', buyerId);
    return raw ? JSON.parse(raw) : null;
  }

  private async removeBuyer(buyerId: string) {
    await this.redisClient.hdel('buyers', buyerId);
  }

  private async saveAdmin(adminId: string, data: any) {
    await this.redisClient.hset('admins', adminId, JSON.stringify(data));
  }

  private async getAdmin(adminId: string) {
    const raw = await this.redisClient.hget('admins', adminId);
    return raw ? JSON.parse(raw) : null;
  }

  private async removeAdmin(adminId: string) {
    await this.redisClient.hdel('admins', adminId);
  }

  /* --------------------
     Connection lifecycle
     -------------------- */

  async handleConnection(client: Socket) {
    const buyerId = client.handshake.query?.buyerId as string | undefined;
    const adminId = client.handshake.query?.adminId as string | undefined;
    const roomId = client.handshake.query?.roomId as string | undefined;

    // Admin connect
    if (adminId) {
      await this.saveAdmin(adminId, { socketId: client.id });

      // Admin join specific room if provided
      if (roomId) {
        const meta = await this.getRoom(roomId);
        if (meta && meta.status === 'active') {
          client.join(roomId);
          client.emit('auction_sync', { auction: meta });
        }
      }

      return;
    }

    // Buyer connect
    if (buyerId) {
      // Save latest socketId
      await this.saveBuyer(buyerId, { socketId: client.id });

      // Join room if roomId provided
      if (roomId) {
        const meta = await this.getRoom(roomId);
        if (meta && meta.status === 'active') {
          client.join(roomId);
          client.emit('auction_sync', { auction: meta });
        } else {
          client.emit('error', { message: 'Room not found or not active' });
        }
      }

      return;
    }

    // Reject connection if neither buyer nor admin
    client.disconnect();
  }

  async handleDisconnect(client: Socket) {
    // try to remove buyer/admin by matching socketId
    // check buyers
    const buyers = await this.redisClient.hgetall('buyers');
    for (const [buyerId, raw] of Object.entries(buyers)) {
      try {
        const info = JSON.parse(raw);
        if (info.socketId === client.id) {
          await this.removeBuyer(buyerId);
          this.logger.log(`❌ Buyer ${buyerId} disconnected [${client.id}]`);
          return;
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    // check admins
    const admins = await this.redisClient.hgetall('admins');
    for (const [adminId, raw] of Object.entries(admins)) {
      try {
        const info = JSON.parse(raw);
        if (info.socketId === client.id) {
          await this.removeAdmin(adminId);
          this.logger.log(`❌ Admin ${adminId} disconnected [${client.id}]`);
          return;
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  }

  /* --------------------
     Room lifecycle events
     -------------------- */

  // Admin calls create_auction to create both auction (DB) and room (Redis)
  @SubscribeMessage('create_auction')
  async handleCreateAuction(
    @MessageBody() dto: CreateAucsionDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // 1) create auction in DB via service
      const created: any = await this.auctionService.create(dto);
      // created.data expected to contain saved auction including id
      if (!created?.data?.id) {
        client.emit('error', {
          message: 'Auction creation failed (no id returned)',
        });
        return;
      }

      // 2) Use auction id as roomId (or generate separate uuid)
      const roomId = created.data.id as string;

      // Prevent duplicate: if room exists, just return existing
      const existing = await this.getRoom(roomId);
      if (existing) {
        client.join(roomId);
        client.emit('auction_reconnected', { auction: existing });
        this.logger.log(`♻️ Room ${roomId} already exists — admin rejoined`);
        return;
      }

      // 3) Build room meta and store to Redis
      const meta: RoomMeta = {
        roomId,
        auctionId: created.data.id,
        title: created.data.title || created.data.lotName || 'Auction',
        adminId: dto.adminId,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      await this.saveRoom(roomId, meta);

      // 4) join admin to room and notify all buyers to join
      client.join(roomId);
      client.emit('auction_created', { auction: meta });

      // Try to add all connected buyers into the room and notify them
      const buyers = await this.redisClient.hgetall('buyers');
      for (const [_, value] of Object.entries(buyers)) {
        try {
          const buyerInfo = JSON.parse(value);
          const buyerSocket = this.server.sockets.sockets.get(
            buyerInfo.socketId,
          );
          if (buyerSocket) {
            buyerSocket.join(roomId);
            buyerSocket.emit('new_auction', { auction: meta });
          }
        } catch (e) {
          // ignore
        }
      }

      this.logger.log(
        `✅ Auction & room ${roomId} created and buyers notified`,
      );
    } catch (err) {
      this.logger.error('Auction creation failed', err);
      client.emit('error', {
        message: 'Auction yaratishda xatolik',
        error: err?.message,
      });
    }
  }

  // Buyer or admin explicitly join a room (useful when joining from UI)
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; buyerId?: string; adminId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, buyerId, adminId } = data;
    const meta = await this.getRoom(roomId);
    if (!meta || meta.status !== 'active') {
      client.emit('error', { message: 'Room not found or not active' });
      return;
    }

    client.join(roomId);

    // update buyer/admin mapping to include joined room (optional)
    if (buyerId) {
      const prev = await this.getBuyer(buyerId);
      const newVal = { ...(prev || {}), socketId: client.id };
      await this.saveBuyer(buyerId, newVal);
    }
    if (adminId) {
      const prev = await this.getAdmin(adminId);
      const newVal = { ...(prev || {}), socketId: client.id };
      await this.saveAdmin(adminId, newVal);
    }

    client.emit('joined_room', { room: meta });
    client.broadcast
      .to(roomId)
      .emit('user_joined', { message: 'A user joined', socketId: client.id });
    this.logger.log(`User ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('create_buyer')
  async handleCreateBuyer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { buyerId: string; full_name?: string },
  ) {
    try {
      const { buyerId, full_name } = data;

      // 1️⃣ Buyer DB da mavjudligini tekshirish
      let buyer = await this.buyerService.findOne(buyerId);
      if (!buyer) {
        // Agar DB da yo‘q bo‘lsa, kerak bo‘lsa yaratish ham mumkin
        // buyer = await this.buyerService.create({ id: buyerId, full_name });
        throw new NotFoundException('Buyer not found');
      }

      // 2️⃣ SocketId bilan Redis-ga saqlash
      await this.saveBuyer(buyerId, { socketId: client.id, joinedRooms: [] });

      // 3️⃣ Agar hali room mavjud bo‘lsa, unga join qilish
      // Bu yerda buyer faqat active room-larni avtomatik join qilishi mumkin
      const rooms = await this.listActiveRooms(); // roomId -> metaJSON
      for (const [roomId, metaStr] of Object.entries(rooms)) {
        const meta: RoomMeta = JSON.parse(metaStr);
        if (meta.status === 'active') {
          client.join(roomId);

          // Redisdagi joinedRooms-ni update qilamiz
          const prev = await this.getBuyer(buyerId);
          const newVal = {
            ...prev,
            joinedRooms: [...(prev?.joinedRooms || []), roomId],
          };
          await this.saveBuyer(buyerId, newVal);

          // Buyer-ga xabar yuboramiz
          client.emit('joined_room', { room: meta });
          client.broadcast.to(roomId).emit('user_joined', {
            message: 'Buyer joined',
            socketId: client.id,
          });

          this.logger.log(`Buyer ${buyerId} joined room ${roomId}`);
        }
      }

      // 4️⃣ Frontendga buyerId va joinedRoomsni qaytarish (kerak bo‘lsa)
      return {
        buyerId,
        joinedRooms: (await this.getBuyer(buyerId))?.joinedRooms || [],
      };
    } catch (error) {
      handleError(error);
    }
  }

  // Buyer submits a bid — use roomId inside DTO
  @SubscribeMessage('make_bid')
  async handleMakeBid(
    @MessageBody() data: CreateBitHistoryDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const saved: any = await this.bitHistoryService.create(data);
      // Update room-level highest bid in Redis (simple replacement)
      await this.redisClient.hset(
        `room:${data.auctionId}:state`,
        'highestBid',
        String(data.amount),
      );
      // emit to room
      this.server.to(data.auctionId).emit('new_bid', { bid: saved.data });
    } catch (err) {
      client.emit('error', { message: 'Bid error', error: err?.message });
    }
  }

  // Admin ends the auction and room lifecycle finishes
  @SubscribeMessage('finish_auction')
  async handleFinishAuction(
    @MessageBody() data: { auction_id: string; adminId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // persist result
      const result: any = await this.resultsService.create({
        lot_id: data.auction_id,
        buyer_id: data['winner'] || null,
        final_price: data['final_price'] || null,
      });

      // notify room participants
      this.server
        .to(data.auction_id)
        .emit('auction_finished', { result: result.data });

      // mark room finished and remove from Redis
      const meta = await this.getRoom(data.auction_id);
      if (meta) {
        meta.status = 'finished';
        // update for record (optional)
        await this.redisClient.hset(
          'rooms',
          data.auction_id,
          JSON.stringify(meta),
        );
      }

      // remove room keys (cleanup)
      await this.removeRoom(data.auction_id);

      this.logger.log(
        `✅ Auction ${data.auction_id} finished and room removed`,
      );
    } catch (err) {
      client.emit('error', {
        message: 'Finish auction error',
        error: err?.message,
      });
    }
  }
}
