import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieRating, MovieRatingSchema } from './schema/movie-rating.schema';

@Injectable()
export class MovieRatingService {constructor(
    @InjectModel(MovieRating.name)private readonly movieRatingModel: Model<MovieRating>,
  ) {}

  async addRating(movieId: string, userId: string, rating: number, comment: string) {
    const ratingData = new this.movieRatingModel({ movieId, userId, rating, comment });
    return ratingData.save();
  }

  async updateRating(movieId: string, userId: string, rating: number, comment: string): Promise<MovieRating> {
    const existingRating = await this.movieRatingModel.findOneAndUpdate(
      { movieId, userId },
      { rating, comment },
      { new: true },
    );

    if (!existingRating) {
      throw new NotFoundException('Movie rating not found.');
    }

    return existingRating;
  }

  async deleteRating(movieId: string, userId: string): Promise<void> {
    const deletedRating = await this.movieRatingModel.findOneAndDelete({ movieId, userId });

    if (!deletedRating) {
      throw new NotFoundException('Movie rating not found.');
    }
  }
}
