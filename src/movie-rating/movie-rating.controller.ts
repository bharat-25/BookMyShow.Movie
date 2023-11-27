import {Controller,Body,Post,UseGuards,Request,HttpStatus,Res,Put,Param,Delete} from '@nestjs/common';
import { MovieRatingService } from './movie-rating.service';
import { MovieRatingDto } from './dto/movie-rating.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guard/auth.guard';
import { RATING_RESPONSE } from './constant/constant';
import { AuthController } from 'src/auth/auth.controller';

@Controller('movie-rating')
export class MovieRatingController {
  constructor(
    private readonly movieRatingService: MovieRatingService,
    private readonly jwtService: JwtService,
    private readonly authController: AuthController

  ) {}

  @Post('addRating')
  @UseGuards(AuthGuard)
  async addRating(@Request() req,@Body() ratingDto: MovieRatingDto,@Res() response,) {
    try {
      const userId = req.user.payload.payloadId;
      const userEmail = req.user.payload.payloadEmail;

      const Isverify=await this.authController.verifyUser(userEmail);
      console.log(Isverify)
      if(!Isverify){
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message:RATING_RESPONSE.NOT_AUTHORIZED,
        });
      }
      const { movieId, rating, comment } = ratingDto;
      const ratingData = await this.movieRatingService.addRating(movieId,userId,rating,comment);

      return response.status(HttpStatus.OK).json({
        message: RATING_RESPONSE.ADD_RATING,
        ratingData,
      });
    } 
    catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: RATING_RESPONSE.EEROR_ADD_RATING,
        error: error.message,
      });
    }
  }

  @Put(':id/updateRating')
  @UseGuards(AuthGuard)
  async updateRating(@Param('id') id: string,@Body() ratingDto: MovieRatingDto,@Request() req,@Res() response) {
    try {
      const userEmail = req.user.payload.payloadEmail;
      const userId = req.user.payload.payloadId;

      const Isverify=await this.authController.verifyUser(userEmail);
      console.log(Isverify)
      if(!Isverify){
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message:RATING_RESPONSE.NOT_AUTHORIZED,
        });
      }

      const updateData = this.movieRatingService.updateRating(
        id,
        userId,
        ratingDto.rating,
        ratingDto.comment,
      );
      return response.status(HttpStatus.OK).json({
        message: RATING_RESPONSE.UPDATE_RATING,
        updateData,
      });
    }
     catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: RATING_RESPONSE.ERROR_UPDATE_RATING,
        error: error.message,
      });
    }
  }

  @Delete(':id/deleteRating')
  @UseGuards(AuthGuard)
  async deleteRating(@Param('id') id: string, @Request() req, @Res() response) {
    try {
      const userEmail = req.user.payload.payloadEmail;
      const userId = req.user.payload.payloadId;

      const Isverify=await this.authController.verifyUser(userEmail);
      console.log(Isverify)
      if(!Isverify){
        return response.status(HttpStatus.UNAUTHORIZED).json({
          message:RATING_RESPONSE.NOT_AUTHORIZED,
        });
      }

      const deleteData = this.movieRatingService.deleteRating(id, userId);
      return response.status(HttpStatus.OK).json({
        message: RATING_RESPONSE.DELETE_RATING,
        deleteData,
      });
    } 
    catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: RATING_RESPONSE.ERROR_DELETE_RATING,
        error: error.message,
      });
    }
  }
}
