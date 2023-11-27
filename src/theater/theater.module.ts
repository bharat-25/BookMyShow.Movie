import { Module } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TheaterController } from './theater.controller';
import { TheaterSchema } from './schema/theater.schema';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/auth/redis/redis.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Theater', schema: TheaterSchema }]),
  RedisModule,
  AuthModule
],
  controllers: [TheaterController],
  providers: [TheaterService,AuthController]
})
export class TheaterModule {}
