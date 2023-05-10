import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './util/envConfig';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
