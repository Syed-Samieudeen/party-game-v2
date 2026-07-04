import { Module } from '@nestjs/common'

import { RoomsController } from './rooms.controller'
import { RoomsService } from './rooms.service'
import { PrismaModule } from '../prisma/prisma.module'
import { GameGateway } from '../game.gateway'

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    RoomsController,
  ],
  providers: [
    RoomsService,
    GameGateway,
  ],
})
export class RoomsModule {}
