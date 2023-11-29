import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieRating, MovieRatingSchema } from './schema/movie-rating.schema';

@Injectable()
export class MovieRatingService {constructor(
    @InjectModel(MovieRating.name)private readonly movieRatingModel: Model<MovieRating>,
  ) {}


  /**
 * Add a new rating for a movie.
 * @param {string} movieId - The ID of the movie for which the rating is being added.
 * @param {string} userId - The ID of the user adding the rating.
 * @param {number} rating - The numeric rating value.
 * @param {string} comment - Optional comment associated with the rating.
 * @returns {Promise<MovieRating>} - A promise that resolves to the newly added MovieRating object.
 */
  async addRating(movieId: string, userId: string, rating: number, comment: string) {
    const ratingData = new this.movieRatingModel({ movieId, userId, rating, comment });
    return ratingData.save();
  }


/**
 * Update an existing rating for a movie.
 * @param {string} movieId - The ID of the movie for which the rating is being updated.
 * @param {string} userId - The ID of the user updating the rating.
 * @param {number} rating - The new numeric rating value.
 * @param {string} comment - The new optional comment associated with the rating.
 * @returns {Promise<MovieRating>} - A promise that resolves to the updated MovieRating object.
 * @throws {Error} - Throws an error if the movie rating is not found.
 */
  async updateRating(movieId: string, userId: string, rating: number, comment: string): Promise<MovieRating> {
    const existingRating = await this.movieRatingModel.findOneAndUpdate(
      { movieId, userId },
      { rating, comment },
      { new: true },
    );

    if (!existingRating) {
      throw new Error('Movie rating not found.');
    }

    return existingRating;
  }

/**
 * Delete a rating for a movie.
 * @param {string} movieId - The ID of the movie for which the rating is being deleted.
 * @param {string} userId - The ID of the user deleting the rating.
 * @returns {Promise<void>} - A promise that resolves once the rating is deleted.
 * @throws {Error} - Throws an error if the movie rating is not found.
 */
  async deleteRating(movieId: string, userId: string): Promise<void> {
    const deletedRating = await this.movieRatingModel.findOneAndDelete({ movieId, userId });

    if (!deletedRating) {
      throw new Error('Movie rating not found.');
    }
  }
}
