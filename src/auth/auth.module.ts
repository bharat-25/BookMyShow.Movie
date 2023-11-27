import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { REDIS_SESSION } from './redis/redis.provider';

@Module({
  imports: [RedisModule],
  providers: [RedisService,REDIS_SESSION],
  controllers: [AuthController],
  // exports:[AuthController]
})
export class AuthModule {}
