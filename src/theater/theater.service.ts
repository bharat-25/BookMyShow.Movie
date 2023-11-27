import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITheater } from './interface/theater.interface';
import { CreateTheaterDto } from './dto/create-theater.dto';

@Injectable()
export class TheaterService {
  constructor(@InjectModel('Theater') private readonly theaterModel: Model<ITheater>) {}

  async getAllTheaters(): Promise<ITheater[]> {
    return this.theaterModel.find().exec();
  }

  async getTheaterById(id: string): Promise<ITheater> {
    const theater = await this.theaterModel.findById(id).exec();
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }
    return theater;
  }

  async addTheater(createTheaterDto: CreateTheaterDto){
    const newTheater = new this.theaterModel(createTheaterDto);
    console.log(newTheater)
    return newTheater.save();
  }

  async updateTheater(theaterId: string, updatedTheater: ITheater) {
    const theater = await this.theaterModel.findByIdAndUpdate(theaterId, updatedTheater, { new: true }).exec();
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${theaterId} not found`);
    }
    return theater;
  }

  async deleteTheater(theaterId: string){
    const result = await this.theaterModel.findByIdAndDelete(theaterId).exec();
    if (!result) {
      throw new NotFoundException(`Theater with ID ${theaterId} not found`);
    }
  }
}
