import { Module } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TheaterController } from './theater.controller';
import { TheaterSchema } from './schema/theater.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Theater', schema: TheaterSchema }])],
  controllers: [TheaterController],
  providers: [TheaterService]
})
export class TheaterModule {}
