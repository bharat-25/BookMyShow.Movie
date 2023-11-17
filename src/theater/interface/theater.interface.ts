import { Document, Schema } from 'mongoose';

export interface ITheater extends Document {
  name: string;
  location: string;
  capacity: number;
  description:string;
}