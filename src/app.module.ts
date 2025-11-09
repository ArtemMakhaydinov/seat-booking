import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logging/winston.logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./apps/api-gateway/.env', './.env'],
    }),
    WinstonModule.forRoot(winstonConfig),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
