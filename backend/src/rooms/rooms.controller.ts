import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { RoomsService } from './rooms.service'

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post()
  create(@Body() body: { hostName: string }) {
    return this.roomsService.createRoom(body.hostName)
  }

  @Get(':code')
  get(@Param('code') code: string) {
    return this.roomsService.getRoom(code)
  }

  @Post(':code/questions')
  questions(@Param('code') code: string, @Body() body: any) {
    return this.roomsService.addQuestions(code, body.questions)
  }

  @Post(':code/candidates')
  candidates(@Param('code') code: string, @Body() body: any) {
    return this.roomsService.addCandidates(code, body.candidates)
  }

  @Post(':code/join')
  join(@Param('code') code: string, @Body() body: any) {
    return this.roomsService.joinRoom(code, body.name)
  }

  @Post(':code/vote')
  vote(@Param('code') code: string, @Body() body: any) {
    return this.roomsService.vote(
      code,
      body.voterId,
      body.questionId,
      body.targetName,
    )
  }

  @Get(':code/results')
  results(@Param('code') code: string) {
    return this.roomsService.getResults(code)
  }
}
