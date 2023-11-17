import * as mongoose from 'mongoose';
// import { IMovie } from '../interface/movie.interface';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// @Schema()
// export const MovieSchema = new mongoose.Schema<IMovie>({
//   plot: String,
//   genres: [String],
//   runtime: Number,
//   cast: [String],
//   title: String,
//   fullplot: String,
//   languages: [String],
//   released: Date,
//   rated: String,
//   year: Number,
//   imdb: {
//     rating: Number,
//     votes: Number,
//     id: Number,
//   },
//   countries: [String],
// });
// export { IMovie };

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop()
  plot: string;

  @Prop([String])
  genres: string[];

  @Prop()
  runtime: number;

  @Prop([String])
  cast: string[];

  @Prop()
  title: string;

  @Prop()
  fullplot: string;

  @Prop([String])
  languages: string[];

  @Prop()
  released: Date;

  @Prop()
  rated: string;

  @Prop()
  year: number;

  @Prop({
    rating: Number,
    votes: Number,
    id: Number,
  })
  // imdb: {
  //   rating: number;
  //   votes: number;
  //   id: number;
  // };

  @Prop([String])
  countries: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
