import { Injectable } from '@nestjs/common';

import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from '../schema/movie.schema';
import { Model } from 'mongoose';
import { CreateMovieDto } from '../dto/create-movie.dto';

@Injectable()
export class KafkaService {
    @Client({
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'user-consumer'
          }
        }
      })
      client: ClientKafka;
    
      async onModuleInit() {
        this.client.subscribeToResponseOf('new-movie-topic');
        await this.client.connect();
      }
      constructor(@InjectModel('Movie') private movieModel: Model<Movie>) {}
    
      async createMovie(createMovieDto: CreateMovieDto) {
        console.log(createMovieDto)
        const createdMovie = new this.movieModel(createMovieDto);
        this.client.send('new-movie-topic', { createdMovie }).subscribe(
          (response) => {
            console.log('Kafka message sent successfully:', response);
          },
          (error) => {
            console.error('Error sending Kafka message:', error);
          }
        );
        return createdMovie.save();
      }
    }
