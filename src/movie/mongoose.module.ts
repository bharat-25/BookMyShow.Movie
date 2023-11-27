import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://bharatanand:XLfrrdbmZRqs25hC@cluster0.a5sfuz8.mongodb.net/BookMyShow_movies'),
  ],
})
export class MongooseConfigModule {}
