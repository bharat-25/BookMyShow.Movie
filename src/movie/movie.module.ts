import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from './schema/movie.schema';
import { KafkaService } from './kafka/kafka.service';
import { RedisModule } from '../auth/redis/redis.module';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]),
    RedisModule,
    AuthModule
  ],
  controllers: [MovieController],
  providers: [MovieService,KafkaService,Object,AuthController],
})
export class MovieModule {}
