import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITheater } from './interface/theater.interface';
import { CreateTheaterDto } from './dto/create-theater.dto';

@Injectable()
export class TheaterService {
  constructor(@InjectModel('Theater') private readonly theaterModel: Model<ITheater>) {}


/**
 * Get all theaters from the database.
 * @returns {Promise<ITheater[]>} - A promise that resolves to an array of theater objects.
 */
  async getAllTheaters(): Promise<ITheater[]> {
    return this.theaterModel.find().exec();
  }


/**
 * Get a theater by its ID from the database.
 * @param {string} id - The ID of the theater to retrieve.
 * @returns {Promise<ITheater>} - A promise that resolves to the theater object.
 * @throws {NotFoundException} - Throws an exception if the theater with the specified ID is not found.
 */
  async getTheaterById(id: string): Promise<ITheater> {
    const theater = await this.theaterModel.findById(id).exec();
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }
    return theater;
  }
/**
 * Add a new theater to the database.
 * @param {CreateTheaterDto} createTheaterDto - The data to create a new theater.
 * @returns {Promise<ITheater>} - A promise that resolves to the newly created theater object.
 */
  async addTheater(createTheaterDto: CreateTheaterDto){
    const newTheater = new this.theaterModel(createTheaterDto);
    console.log(newTheater)
    return newTheater.save();
  }

/**
 * Update a theater by its ID in the database.
 * @param {string} theaterId - The ID of the theater to update.
 * @param {ITheater} updatedTheater - The data to update the theater.
 * @returns {Promise<ITheater>} - A promise that resolves to the updated theater object.
 * @throws {NotFoundException} - Throws an exception if the theater with the specified ID is not found.
 */
  async updateTheater(theaterId: string, updatedTheater: ITheater) {
    const theater = await this.theaterModel.findByIdAndUpdate(theaterId, updatedTheater, { new: true }).exec();
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${theaterId} not found`);
    }
    return theater;
  }


  /**
 * Delete a theater by its ID from the database.
 * @param {string} theaterId - The ID of the theater to delete.
 * @returns {Promise<void>} - A promise that resolves once the theater is deleted.
 * @throws {NotFoundException} - Throws an exception if the theater with the specified ID is not found.
 */
  async deleteTheater(theaterId: string){
    const result = await this.theaterModel.findByIdAndDelete(theaterId).exec();
    if (!result) {
      throw new NotFoundException(`Theater with ID ${theaterId} not found`);
    }
  }
}
