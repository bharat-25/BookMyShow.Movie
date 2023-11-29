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


/**
 * Get all theaters API endpoint.
 * @param {Object} response - The response object.
 * @returns {Promise<ITheater[]>} - A promise that resolves to an array of theater objects.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */
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


/**
 * Get theater by ID API endpoint.
 * @param {string} theaterId - The ID of the theater to retrieve.
 * @param {Object} response - The response object.
 * @returns {Promise<Object>} - A promise that resolves to a JSON response with the theater details.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */
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
  

/**
 * Add a new theater API endpoint.
 * @param {Object} req - The request object.
 * @param {CreateTheaterDto} createTheaterDto - The data to create a new theater.
 * @param {Object} response - The response object.
 * @returns {Promise<Object>} - A promise that resolves to a JSON response with the newly created theater details.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */
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


/**
 * Update theater by ID API endpoint.
 * @param {Object} req - The request object.
 * @param {string} theaterId - The ID of the theater to update.
 * @param {ITheater} updatedTheater - The data to update the theater.
 * @param {Object} response - The response object.
 * @returns {Promise<Object>} - A promise that resolves to a JSON response with the updated theater details.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */
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


/**
 * Delete theater by ID API endpoint.
 * @param {Object} req - The request object.
 * @param {string} theaterId - The ID of the theater to delete.
 * @param {Object} response - The response object.
 * @returns {Promise<Object>} - A promise that resolves to a JSON response indicating the success of the deletion.
 * @throws {Object} - Returns an error response if there's an issue with the request.
 */
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
