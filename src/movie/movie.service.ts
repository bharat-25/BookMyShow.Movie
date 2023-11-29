import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schema/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
// import { KafkaService } from './kafka/kafka.service';
// import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class MovieService {
  // @Client({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: 'user',
  //       brokers: ['localhost:9092'],
  //     },
  //     consumer: {
  //       groupId: 'user-consumer'
  //     }
  //   }
  // })
  // client: ClientKafka;

  // async onModuleInit() {
  //   this.client.subscribeToResponseOf('new-movie-topic');
  //   await this.client.connect();
  // }
  constructor(@InjectModel('Movie') private movieModel: Model<Movie>) {}
  
  async getAllMovies(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }
/**
 * Get a movie by its ID from the database.
 * @param {string} id - The ID of the movie to retrieve.
 * @returns {Promise<Movie>} - A promise that resolves to a Movie object.
 */
  async getMovieById(id: string): Promise<Movie>{
    return this.movieModel.findById(id).exec();
  }

  // async createMovie(createMovieDto: CreateMovieDto) {
  //   const createdMovie = new this.movieModel(createMovieDto);
  //   // const kafkadata=this.client.send('new-movie-topic', { createdMovie });
  //   // console.log(kafkadata)
  //   this.client.send('new-movie-topic', { createdMovie }).subscribe(
  //     (response) => {
  //       console.log('Kafka message sent successfully:', response);
  //     },
  //     (error) => {
  //       console.error('Error sending Kafka message:', error);
  //     }
  //   );
  //   return createdMovie.save();
  // }


/**
 * Update a movie in the database by its ID.
 * @param {string} id - The ID of the movie to update.
 * @param {UpdateMovieDto} updateMovieDto - The data to update the movie.
 * @returns {Promise<Movie>} - A promise that resolves to the updated Movie object.
 */
  async updateMovie(id: string, updateMovieDto: UpdateMovieDto) {
    return this.movieModel.findByIdAndUpdate(id, updateMovieDto, { new: true });
  }


/**
 * Delete a movie from the database by its ID.
 * @param {string} id - The ID of the movie to delete.
 * @returns {Promise<Movie|null>} - A promise that resolves to the deleted Movie object, or null if not found.
 */
  async deleteMovie(id: string): Promise<Movie | null> {
    const deleted = await this.movieModel.findByIdAndRemove(id).exec();
    return deleted;
  }


/**
 * Search movies in the database based on a query using text search.
 * @param {string} query - The search query for movies.
 * @returns {Promise<Movie[]>} - A promise that resolves to an array of matched Movie objects.
 * @throws {Error} - Throws an error if there's an issue searching for movies.
 */
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
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error(error.message);
    }
  }  
}
