import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://party-game-v2.vercel.app'
    ],
    credentials: true,
  })

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
