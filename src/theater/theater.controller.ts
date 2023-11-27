import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Request,
  Put,
  Delete,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TheaterService } from './theater.service';
import { ITheater } from './interface/theater.interface';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { THEATER_RESPONSE } from './constant/constant';
import { AuthGuard } from './guard/auth.guard';
import { AuthController } from 'src/auth/auth.controller';

@Controller('theater')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService,
              private readonly authController: AuthController) {}

  @Get('allTheater')
  async getAllTheaters(@Res() response): Promise<ITheater[]> {
    try {
      const theater = await this.theaterService.getAllTheaters();
      console.log(theater);
      return response.status(HttpStatus.OK).json({
        message:THEATER_RESPONSE.GET_ALL_THEATER,
        theater
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: THEATER_RESPONSE.ERROR_GET_ALL_THEATER,
        error: error.message,
      });
    }
  }

  @Get(':id')
  async getTheaterById(@Param('id') theaterId: string,@Res() response){
    try{
        const theater=await this.theaterService.getTheaterById(theaterId);
        if(!theater){
            return response.status(HttpStatus.NOT_FOUND).json({
              message:THEATER_RESPONSE.THEATER_NOT_FOUND})
        }
        return response.status(HttpStatus.OK).json({
          message:THEATER_RESPONSE.GET_THEATER_BY_ID,
          theater
        })
    }catch(error){
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: THEATER_RESPONSE.ERROR_THEATER_BY_ID,
            error: error.message,
          });
    }
  }
  
  @UseGuards(AuthGuard)
  @Post('addTheater')
  async addTheater(@Request() req,@Body() createTheaterDto: CreateTheaterDto,@Res() response) {
    try {

      const userEmail = req.user.payload.payloadEmail;

      const Isverify=await this.authController.verifyUser(userEmail);
      console.log(Isverify)
      if(!Isverify){
        return response.status(HttpStatus.OK).json({
            message:THEATER_RESPONSE.NOT_AUTHORIZED,
        });
        }
        
      const newTheater = await this.theaterService.addTheater(createTheaterDto);
      return response.status(HttpStatus.CREATED).json({
        message:THEATER_RESPONSE.ADD_THEATER,
        newTheater
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: THEATER_RESPONSE.ERROR_ADD_THEATER,
        error: error.message,
      });
    }
  }

  @Put(':id')
  async updateTheater(@Request() req,@Param('id') theaterId: string,@Body() updatedTheater: ITheater,@Res() response) {
    try{
      
      const userEmail = req.user.payload.payloadEmail;

      const Isverify=await this.authController.verifyUser(userEmail);
      console.log(Isverify)
      if(!Isverify){
        return response.status(HttpStatus.OK).json({
          message:THEATER_RESPONSE.NOT_AUTHORIZED,
        });
      }
        const updateTheater=await this.theaterService.updateTheater(theaterId, updatedTheater);
        if(!updateTheater){
            return response.status(HttpStatus.NOT_FOUND).json({ message: THEATER_RESPONSE.THEATER_NOT_FOUND });
        }
        return response.status(HttpStatus.OK).json({
          message:THEATER_RESPONSE.UPDATE_THEATER,
          updateTheater
        });
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: THEATER_RESPONSE.ERROR_UPDATE_THEATER,
        error: error.message,
      });
    }
  }

  @Delete(':id')
  async deleteTheater(@Request() req,@Param('id') theaterId: string, @Res() response) {
    try{
      const deletedTheater = await this.theaterService.deleteTheater(theaterId);
      return response.status(HttpStatus.OK).json({
        message: THEATER_RESPONSE.DELETE_THEATER
      });

    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: THEATER_RESPONSE.ERROR_DELETE_THEATER,
        error: error.message,
      });
    }
  }
}
