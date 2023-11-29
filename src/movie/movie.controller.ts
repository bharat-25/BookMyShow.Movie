import { Controller,Get , Post, Request,Put, Delete, Body, Param, HttpStatus, Res, Query, ValidationPipe, UseGuards} from '@nestjs/common';
import { MovieService } from './movie.service';
import {KafkaService} from './kafka/kafka.service'
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MOVIE_RESPONSE } from './constant/constant';
import { AuthGuard } from './guard/auth.guard';
import { AuthController } from 'src/auth/auth.controller';
import axios from 'axios';

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService,
                private readonly KafkaService:KafkaService,
                private readonly authController: AuthController
                ) {}
                private readonly baseUrl = 'http://localhost:3008'
    
/**
 * Get all movies API endpoint.
 * @returns {Object} - Returns a JSON response with the list of movies.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */

    @Get('getAllMovies')
    async getAllMovies(@Res() response) {
      try {
        const movies = await this.movieService.getAllMovies();
        // console.log(movies)
        const Axiosresponse = await axios.get(`${this.baseUrl}/users/email-addresses`);
        console.log("------->",Axiosresponse.data);
        return response.status(HttpStatus.OK).json({
          message:MOVIE_RESPONSE.GET_ALL_MOVIE,
          movies
        });
      } catch (error) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: MOVIE_RESPONSE.ERROR_GET_ALL_MOVIE,
          error: error.message,
        });
      }
    }
  

  /**
 * Get movie by ID API endpoint.
 * @param {string} movieId - The ID of the movie to retrieve.
 * @returns {Object} - Returns a JSON response with the movie details.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */
    @Get(':id')
    async getMovieById(@Param('id') movieId: string, @Res() response) {
      try {
        const movie = await this.movieService.getMovieById(movieId);
        console.log(movie)
        if (!movie) {
          return response.status(HttpStatus.NOT_FOUND).json({ message: MOVIE_RESPONSE.MOVIE_NOT_FOUND });
        }
        return response.status(HttpStatus.OK).json({
          message:MOVIE_RESPONSE.GET_MOVIE_BY_ID,
          movie
        });
      } catch (error) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: MOVIE_RESPONSE.ERROR_MOVIE_BY_ID,
          error: error.message,
        });
      }
    }


  /**
 * Create a new movie API endpoint.
 * @param {Object} req - The request object.
 * @param {CreateMovieDto} createMovieDto - The data to create a new movie.
 * @returns {Object} - Returns a JSON response with the newly created movie.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */
    @UseGuards(AuthGuard)
    @Post('addMovie')
    async createMovie(@Request() req,@Body() createMovieDto: CreateMovieDto, @Res() response) {
      try {
        const userEmail = req.user.payload.payloadEmail;

      const Isverify=await this.authController.verifyUser(userEmail);
      console.log(Isverify)
      if(!Isverify){
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message:MOVIE_RESPONSE.NOT_AUTHORIZED,
        });
      }

        const newMovie = await this.KafkaService.createMovie(createMovieDto);
        const Axiosresponse = await axios.get(`${this.baseUrl}/users/email-addresses`);
        console.log("-->",Axiosresponse.data);
        return response.status(HttpStatus.CREATED).json({
          message:MOVIE_RESPONSE.ADD_MOVIE,
          newMovie
        });
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: MOVIE_RESPONSE.ERROR_ADD_MOVIE,
          error: error.message,
        });
      }
    }
  

  /**
 * Update movie by ID API endpoint.
 * @param {Object} req - The request object.
 * @param {string} id - The ID of the movie to update.
 * @param {UpdateMovieDto} updateMovieDto - The data to update the movie.
 * @returns {Object} - Returns a JSON response with the updated movie details.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */
    @UseGuards(AuthGuard)
    @Put(':id')
    async updateMovie(@Request() req,@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto, @Res() response) {
      try {
        const userEmail = req.user.payload.payloadEmail;

        const Isverify=await this.authController.verifyUser(userEmail);
        console.log(Isverify)
        if(!Isverify){
          return response.status(HttpStatus.OK).json({
            message:MOVIE_RESPONSE.NOT_AUTHORIZED,
          });
        }

        const updatedMovie = await this.movieService.updateMovie(id, updateMovieDto);
        if (!updatedMovie) {
          return response.status(HttpStatus.NOT_FOUND).json({ message: MOVIE_RESPONSE.MOVIE_NOT_FOUND });
        }
        return response.status(HttpStatus.OK).json({
          message:MOVIE_RESPONSE.UPDATE_MOVIE,
          updatedMovie
        });
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: MOVIE_RESPONSE.ERROR_UPDATE_MOVIE,
          error: error.message,
        });
      }
    }


  /**
 * Delete movie by ID API endpoint.
 * @param {Object} req - The request object.
 * @param {string} id - The ID of the movie to delete.
 * @returns {Object} - Returns a JSON response with details of the deleted movie.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteMovie(@Request() req,@Param('id') id: string, @Res() response) {
      try {
        const userEmail = req.user.payload.payloadEmail;

        const Isverify=await this.authController.verifyUser(userEmail);
        console.log(Isverify)
        if(!Isverify){
          return response.status(HttpStatus.OK).json({
            message:MOVIE_RESPONSE.NOT_AUTHORIZED,
          });
        }
        console.log("DELETE")
        const deletedMovie = await this.movieService.deleteMovie(id);
        if (!deletedMovie) {
          return response.status(HttpStatus.NOT_FOUND).json({ message: MOVIE_RESPONSE.MOVIE_NOT_FOUND });
        }
        return response.status(HttpStatus.OK).json({
          message:MOVIE_RESPONSE.DELETE_MOVIE,
          deletedMovie
        });
      } catch (error) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: MOVIE_RESPONSE.ERROR_DELETE_MOVIE,
          error: error.message,
        });
      }
    }


  /**
 * Search movies API endpoint.
 * @param {string} query - The search query for movies.
 * @returns {Object} - Returns a JSON response with the search results.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */
    @Get('search/:query')
    async searchMovies(@Param('query') query: string,@Res() response) {
      try{
        const results = await this.movieService.searchMovies(query);
        if (!results) {
          return response.status(HttpStatus.NOT_FOUND).json({ message: MOVIE_RESPONSE.MOVIE_NOT_FOUND});
        }
        return response.status(HttpStatus.OK).json({
          message:MOVIE_RESPONSE.MOVIE_FOUND,
          results
        });

      }catch(error){
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: MOVIE_RESPONSE.MOVIE_NOT_FOUND,
          error: error.message,
        });
      }
  }
  
}
