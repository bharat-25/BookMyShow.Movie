import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { TheaterService } from './theater.service';
import { ITheater } from './interface/theater.interface';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { response } from 'express';

@Controller('theater')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Get('allTheater')
  async getAllTheaters(@Res() response): Promise<ITheater[]> {
    try {
      const theater = await this.theaterService.getAllTheaters();
      console.log(theater);
      return response.status(HttpStatus.OK).json(theater);
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error retrieving theater',
        error: error.message,
      });
    }
  }

  @Get(':id')
  async getTheaterById(@Param('id') theaterId: string,@Res() response){
    try{
        const theater=await this.theaterService.getTheaterById(theaterId);
        if(!theater){
            return response.status(HttpStatus.NOT_FOUND).json({message:'Theater Not Found'})
        }
        return response.status(HttpStatus.OK).json(theater)
    }catch(error){
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error retrieving theater',
            error: error.message,
          });
    }
  }

  @Post('addTheater')
  async addTheater(@Body() createTheaterDto: CreateTheaterDto,@Res() response) {
    try {
      const newTheater = await this.theaterService.addTheater(createTheaterDto);
      return response.status(HttpStatus.CREATED).json(newTheater);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error: adding theater',
        error: error.message,
      });
    }
  }

  @Put(':id')
  async updateTheater(@Param('id') theaterId: string,@Body() updatedTheater: ITheater,@Res() response) {
    try{
        const updateTheater=await this.theaterService.updateTheater(theaterId, updatedTheater);
        if(!updateTheater){
            return response.status(HttpStatus.NOT_FOUND).json({ message: 'Theater not found' });
        }
        return response.status(HttpStatus.OK).json(updateTheater);
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error updating theater',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  async deleteTheater(@Param('id') theaterId: string, @Res() response) {
    try{
      const deletedTheater = await this.theaterService.deleteTheater(theaterId);
      return response.status(HttpStatus.OK).json({message: 'Theater Delete Successfully',});
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error deleting theater',
        error: error.message,
      });
    }
  }
}
