import { Controller,Get , Post, Request,Put, Delete, Body, Param, HttpStatus, Res, Query, ValidationPipe, UseGuards} from '@nestjs/common';
import { MovieService } from './movie.service';
import {KafkaService} from './kafka/kafka.service'
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MOVIE_RESPONSE } from './constant/constant';
import axios from 'axios';
import { AuthGuard } from './guard/auth.guard';
import { AuthController } from 'src/auth/auth.controller';

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService,
                private readonly KafkaService:KafkaService,
                private readonly authController: AuthController
                ) {}
                private readonly baseUrl = 'http://localhost:3008'
    
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
        console.log("------->",Axiosresponse.data);
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
