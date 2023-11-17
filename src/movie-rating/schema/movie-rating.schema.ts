import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MovieRating extends Document {
  @Prop({ required: true })
  movieId: string;

  @Prop({ required: false })
  userId: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;
}

export const MovieRatingSchema = SchemaFactory.createForClass(MovieRating);
