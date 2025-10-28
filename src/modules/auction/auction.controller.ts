import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuctionService } from './auction.service';
import { BitHistoryService } from 'src/bit_history/bit_history.service';
import { UpdateBitHistoryDto } from 'src/bit_history/dto/update-bit_history.dto';
import Redis from 'ioredis';
import { LotsService } from 'src/lots/lots.service';

@WebSocketGateway({ namespace: '/auction', cors: { origin: '*' } })
export class AuctionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private redisClient: Redis;

  constructor(
    private readonly auctionService: AuctionService,
    private readonly bitHistoryService: BitHistoryService,
    private readonly lotsService: LotsService,
  ) {
    this.redisClient = new Redis();
  }

  // 🔹 1. Foydalanuvchi ulanadi
  async handleConnection(socket: Socket) {
    const { userId, role, roomId, onseAmount } = socket.handshake.query;
    if (!userId || !role || !roomId) {
      console.log('❌ Missing socket params');
      socket.disconnect();
      return;
    }

    // Lot mavjudligi va isActive tekshirish
    const { data }: any = await this.lotsService.findOne(String(roomId));
    if (!data || !data.isActive) {
      socket.emit('error', { message: '❌ Bu auksion yopilgan!' });
      socket.disconnect();
      return;
    }

    // Admin bo‘lsa, boshlang‘ich bitni yaratish
    if (role === 'admin') {
      await this.bitHistoryService.create({
        lotId: String(roomId),
        lotAction: { buyerId: String(userId), amount: Number(onseAmount) },
      });
    }

    // Socketni roomga qo‘shish va Redis saqlash
    socket.join(String(roomId));
    await this.redisClient.hset(`user:${socket.id}`, {
      userId,
      role,
      roomId,
    });

    console.log(`🟢 ${role} (${userId}) connected to room ${roomId}`);
    this.server.to(String(roomId)).emit('user-joined', { userId, role });
  }

  // 🔹 2. Foydalanuvchi uzildi
  async handleDisconnect(socket: Socket) {
    const userData = await this.redisClient.hgetall(`user:${socket.id}`);
    if (userData?.roomId) {
      console.log(
        `🔴 ${userData.role} (${userData.userId}) left room ${userData.roomId}`,
      );
      this.server.to(userData.roomId).emit('user-left', {
        userId: userData.userId,
        role: userData.role,
      });
    }
    await this.redisClient.del(`user:${socket.id}`);
  }

  // 🔹 3. Bit qo‘yish
  @SubscribeMessage('place-bit')
  async handlePlaceBit(
    @MessageBody() payload: { lotId: string; buyerId: string; amount: number },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userData = await this.redisClient.hgetall(`user:${socket.id}`);
      if (!userData?.roomId) {
        socket.emit('error', { message: '❌ Room not found for this socket.' });
        return;
      }

      // Lot isActive tekshirish
      const { data }: any = await this.lotsService.findOne(
        String(payload.lotId),
      );
      if (!data || !data.isActive) {
        socket.emit('error', { message: '❌ Bu auksion yopilgan!' });
        socket.disconnect();
        return;
      }

      const dto: UpdateBitHistoryDto = {
        lotId: payload.lotId,
        lotAction: {
          buyerId: payload.buyerId,
          amount: Number(payload.amount),
        },
      };

      const updatedBit = await this.bitHistoryService.update(dto);

      console.log(
        `💰 New bit: ${payload.amount} by buyer ${payload.buyerId} in room ${userData.roomId}`,
      );

      this.server.to(userData.roomId).emit('bit-updated', {
        lotId: payload.lotId,
        buyerId: payload.buyerId,
        amount: payload.amount,
        updatedBit,
      });
    } catch (error) {
      console.error('❌ Error handling bit:', error.message);
      socket.emit('error', {
        message: 'Bit update failed',
        error: error.message,
      });
    }
  }

  // 🔹 4. Room yopish
  @SubscribeMessage('close-room')
  async handleCloseRoom(
    @MessageBody() payload: { lotId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const roomId = payload.lotId;
      if (!roomId) {
        socket.emit('error', { message: '❌ LotId kerak' });
        return;
      }
      // 🔹 Lotni isActive = false qilish
      await this.lotsService.update(roomId, { isActive: false });
      
      
      console.log(`🚪 Room ${roomId} closing by ${socket.id}`);
      
      // 🔹 Room’dagi barcha socketlarni olish
     const socketsInRoom = await this.server.in(roomId).fetchSockets();
     for (const s of socketsInRoom) {
       s.leave(roomId);
       const userData = await this.redisClient.hgetall(`user:${s.id}`);
       if (userData?.roomId) {
         await this.redisClient.hdel(`user:${s.id}`, 'roomId');
       }
       s.emit('room-closed-notification', {
         message: '🚨 Auksion tugadi! Room yopildi',
         roomId,
       });
     }
      // 🔹 Admin o‘ziga ham xabar berish
      socket.emit('room-closed-notification', {
        message: '🚪 Room muvaffaqiyatli yopildi',
        roomId,
      });
      
    } catch (error) {
      console.error('❌ Error closing room:', error.message);
      socket.emit('error', {
        message: 'Room close failed',
        error: error.message,
      });
    }
  }
}
