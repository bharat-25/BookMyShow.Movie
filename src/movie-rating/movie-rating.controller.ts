import { Controller ,Body, Post, UseGuards, Request,HttpStatus, Res, Put, Param, Delete} from '@nestjs/common';
import { MovieRatingService } from './movie-rating.service';
import { MovieRatingDto } from './dto/movie-rating.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('movie-rating')
export class MovieRatingController {
    constructor(private readonly movieRatingService: MovieRatingService, 
                private readonly jwtService: JwtService) {}

    @Post('addRating')
    @UseGuards(AuthGuard('jwt'))
    async addRating(@Request() req, @Body() ratingDto: MovieRatingDto,@Res() response) {
        
        try{
            const jwt = req.headers.authorization.replace('Bearer ', '');
            const { movieId, rating, comment } = ratingDto;
            const json = this.jwtService.decode(jwt);
            const userId = json.payload.payloadId
            const ratingData =await this.movieRatingService.addRating(movieId, userId, rating, comment);
            return response.status(HttpStatus.OK).json({
                message:'Rating Add Successfully.',
                ratingData
            });
        }
           catch(error){
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Error to Add Rating',
                error: error.message,
              });
           }
    }

    @Put(':id/updateRating')
  @UseGuards(AuthGuard('jwt'))
  async updateRating(@Param('id') id: string, @Body() ratingDto: MovieRatingDto, @Request() req) {
    const jwt = req.headers.authorization.replace('Bearer ', '');
    const json = this.jwtService.decode(jwt);
    const userId = json._id;

    return this.movieRatingService.updateRating(id, userId, ratingDto.rating, ratingDto.comment);
  }


  @Delete(':id/deleteRating')
  @UseGuards(AuthGuard('jwt'))
  async deleteRating(@Param('id') id: string, @Request() req) {
    const jwt = req.headers.authorization.replace('Bearer ', '');
    const json = this.jwtService.decode(jwt);
    const userId = json._id;

    return this.movieRatingService.deleteRating(id, userId);
  }
}
