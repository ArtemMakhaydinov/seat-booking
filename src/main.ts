import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const configService = new ConfigService();
  const PORT = configService.get('PORT');
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useLogger(logger);

  await app.listen(PORT, () =>
    logger.info(`Server sucessfully started on port ${PORT}`),
  );
}
bootstrap();
