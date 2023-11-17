import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schema/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
// import { KafkaService } from './kafka/kafka.service';
import axios from 'axios';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class MovieService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'user-consumer' // consumer same as in micro service
      }
    }
  })
  client: ClientKafka;

  async onModuleInit() {
    /**
     * Here We need to subscribe to topic,
     * so that we get response back
     */
    this.client.subscribeToResponseOf('new-movie-topic');
    await this.client.connect();
  }
  constructor(@InjectModel('Movie') private movieModel: Model<Movie>) {}
  
  async getAllMovies(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  async getMovieById(id: string): Promise<Movie>{
    return this.movieModel.findById(id).exec();
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    const createdMovie = new this.movieModel(createMovieDto);
    // const kafkadata=this.client.send('new-movie-topic', { createdMovie });
    // console.log(kafkadata)
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

  async updateMovie(id: string, updateMovieDto: UpdateMovieDto) {
    return this.movieModel.findByIdAndUpdate(id, updateMovieDto, { new: true });
  }

  async deleteMovie(id: string): Promise<Movie | null> {
    const deleted = await this.movieModel.findByIdAndRemove(id).exec();
    return deleted;
  }

  async searchMovies(query: string): Promise<Movie[]>{
    try {
      const pipeline = [
        {
          $search: {
            index: 'movieSearch',
            text: {
              query: query,
              path: 'title',
              fuzzy: {
                maxEdits: 1,
                prefixLength: 1,
              },
            },
          },
        },
        {
          $limit: 6,
        },
        {
          $project: {
            title: 1,
            score: { $meta: 'searchScore' },
          },
        },
      ];
      const matchResult = await this.movieModel.aggregate(pipeline);
      return matchResult;
    } catch (e) {
      console.error('Error searching movies:', e);
      throw new Error(e.message);
    }
  }  
}
