import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('joinRoom')
  handleJoin(
    @MessageBody() roomCode: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomCode)

    client.emit('joinedRoom', roomCode)
  }

  emitRoomUpdate(roomCode: string) {
    this.server.to(roomCode).emit('roomUpdated')
  }

  emitResultsUpdate(roomCode: string) {
    this.server.to(roomCode).emit('resultsUpdated')
  }
}
