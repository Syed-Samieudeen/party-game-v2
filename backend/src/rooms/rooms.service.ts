import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { GameGateway } from '../game.gateway'

@Injectable()
export class RoomsService {
  constructor(
    private prisma: PrismaService,
    private gateway: GameGateway,
  ) {}

  async createRoom(hostName: string) {
    return this.prisma.room.create({
      data: {
        hostName,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      },
    })
  }

  async getRoom(code: string) {
    return this.prisma.room.findUnique({
      where: { code },
      include: {
        questions: true,
        candidates: true,
        players: true,
        votes: true,
      },
    })
  }

  async addQuestions(code: string, questions: string[]) {
    const room = await this.prisma.room.findUnique({ where: { code } })
    if (!room) return { success: false }

    await this.prisma.question.deleteMany({
      where: { roomId: room.id },
    })

    await this.prisma.question.createMany({
      data: questions.map((text, i) => ({
        text,
        order: i + 1,
        roomId: room.id,
      })),
    })

    this.gateway.emitRoomUpdate(code)

    return { success: true }
  }

  async addCandidates(code: string, candidates: string[]) {
    const room = await this.prisma.room.findUnique({ where: { code } })
    if (!room) return { success: false }

    await this.prisma.candidate.deleteMany({
      where: { roomId: room.id },
    })

    await this.prisma.candidate.createMany({
      data: candidates.map(name => ({
        name,
        roomId: room.id,
      })),
    })

    this.gateway.emitRoomUpdate(code)

    return { success: true }
  }

  async joinRoom(code: string, name: string) {
    const room = await this.prisma.room.findUnique({
      where: { code },
    })

    if (!room) return { success: false }

    const player = await this.prisma.player.create({
      data: {
        name,
        roomId: room.id,
      },
    })

    this.gateway.emitRoomUpdate(code)

    return {
      success: true,
      playerId: player.id,
    }
  }

  async vote(
    code: string,
    voterId: string,
    questionId: string,
    targetName: string,
  ) {
    const room = await this.prisma.room.findUnique({
      where: { code },
    })

    if (!room) return { success: false }

    await this.prisma.vote.upsert({
      where: {
        questionId_voterId: {
          questionId,
          voterId,
        },
      },
      update: {
        targetName,
      },
      create: {
        roomId: room.id,
        questionId,
        voterId,
        targetName,
      },
    })

    this.gateway.emitResultsUpdate(code)

    return {
      success: true,
    }
  }

  async getResults(code: string) {
    const room = await this.prisma.room.findUnique({
      where: { code },
      include: {
        questions: true,
        votes: {
          include: {
            voter: true,
          },
        },
      },
    })

    if (!room) return { success: false }

    const results = room.questions.map(q => {
      const votes = room.votes.filter(
        v => v.questionId === q.id,
      )

      const tally: Record<string, number> = {}

      for (const v of votes) {
        tally[v.targetName] =
          (tally[v.targetName] || 0) + 1
      }

      let leader: string | null = null
      let max = 0

      for (const name in tally) {
        if (tally[name] > max) {
          max = tally[name]
          leader = name
        }
      }

      return {
        questionId: q.id,
        question: q.text,
        tally,
        leader,
        leaderVotes: max,
        votes: votes.map(v => ({
          voter: v.voter.name,
          target: v.targetName,
        })),
      }
    })

    return {
      success: true,
      results,
    }
  }
}
