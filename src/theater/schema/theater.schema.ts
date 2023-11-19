import { Document, Schema } from 'mongoose';

// export const TheaterSchema = new Schema({
//   name: { type: String },
//   location: { type: String },
//   capacity: { type: Number },
//   description:{ type: String }
// });

export const TheaterSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  capacity: { type: Number, required: true },
  description: { type: String },
});

// Index for the location field
TheaterSchema.index({ location: '2dsphere' });
