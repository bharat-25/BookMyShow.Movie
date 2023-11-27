import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TheaterModule } from './theater/theater.module';
import { MovieRatingModule } from './movie-rating/movie-rating.module';
import { MongooseConfigModule } from './movie/mongoose.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MovieModule,
    MongooseModule.forRoot('mongodb+srv://bharatanand:XLfrrdbmZRqs25hC@cluster0.a5sfuz8.mongodb.net/BookMyShow_movies'),
    TheaterModule,
    MovieRatingModule,
    MongooseConfigModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
