import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from './schema/movie.schema';
import { KafkaService } from './kafka/kafka.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]), ],
  controllers: [MovieController],
  providers: [MovieService,KafkaService],
  exports:[MovieService,KafkaService]
})
export class MovieModule {}
