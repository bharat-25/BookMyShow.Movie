import { ConfigModule } from '@nestjs/config';
import { Module } from "@nestjs/common";
import { REDIS_SESSION } from './redis.provider';
import { RedisService } from './redis.service';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [RedisService,REDIS_SESSION],
    exports:[RedisService]
})
export class RedisModule {}
