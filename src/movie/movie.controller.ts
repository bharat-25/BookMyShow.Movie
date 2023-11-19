import { Controller,Get , Post, Put, Delete, Body, Param, HttpStatus, Res, Query, ValidationPipe} from '@nestjs/common';
import { MovieService } from './movie.service';
import {KafkaService} from './kafka/kafka.service'
import { Movie } from './schema/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieSearchDto } from './dto/movie-search.dto';

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService,
                private readonly KafkaService:KafkaService) {}
    
    @Get('getAllMovies')
    async getAllMovies(@Res() response) {
      try {
        const movies = await this.movieService.getAllMovies();
        console.log(movies)
        return response.status(HttpStatus.OK).json(movies);
      } catch (error) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Error retrieving movies',
          error: error.message,
        });
      }
    }
  
    @Get(':id')
    async getMovieById(@Param('id') movieId: string, @Res() response) {
      try {
        const movie = await this.movieService.getMovieById(movieId);
        console.log(movie)
        if (!movie) {
          return response.status(HttpStatus.NOT_FOUND).json({ message: 'Movie not found' });
        }
        return response.status(HttpStatus.OK).json(movie);
      } catch (error) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Error retrieving movie',
          error: error.message,
        });
      }
    }

    
    @Post('addMovie')
    async createMovie(@Body() createMovieDto: CreateMovieDto, @Res() response) {
      try {
        const newMovie = await this.KafkaService.createMovie(createMovieDto);
        return response.status(HttpStatus.CREATED).json(newMovie);
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Error creating movie',
          error: error.message,
        });
      }
    }
  
    @Put(':id')
    async updateMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto, @Res() response) {
      try {
        const updatedMovie = await this.movieService.updateMovie(id, updateMovieDto);
        if (!updatedMovie) {
          return response.status(HttpStatus.NOT_FOUND).json({ message: 'Movie not found' });
        }
        return response.status(HttpStatus.OK).json(updatedMovie);
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Error updating movie',
          error: error.message,
        });
      }
    }

    @Delete(':id')
    async deleteMovie(@Param('id') id: string, @Res() response) {
      try {
        const deletedMovie = await this.movieService.deleteMovie(id);
        if (!deletedMovie) {
          return response.status(HttpStatus.NOT_FOUND).json({ message: 'Movie not found' });
        }
        return response.status(HttpStatus.OK).json(deletedMovie);
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Error deleting movie',
          error: error.message,
        });
      }
    }

    @Get('search/:query')
    async searchMovies(@Param('query') query: string,@Res() response) {
      try{
        const results = await this.movieService.searchMovies(query);
        if (!results) {
          return response.status(HttpStatus.NOT_FOUND).json({ message: 'Movie not found' });
        }
        return response.status(HttpStatus.OK).json(results);

      }catch(error){
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Error Movie Not Found',
          error: error.message,
        });
      }
  }
  
}
