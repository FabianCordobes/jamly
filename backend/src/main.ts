import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Habilitar CORS si es necesario
  app.setGlobalPrefix('api'); // Opcional: usa '/api' como prefijo para endpoints

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
