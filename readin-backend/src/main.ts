import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Allow cross-origin requests for frontend-backend communication
  await app.listen(3000); // Application runs on port 3000
  console.log('Backend is running on http://localhost:3000');
}
bootstrap();
