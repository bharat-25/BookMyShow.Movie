import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TheaterModule } from './theater/theater.module';
import { MovieRatingModule } from './movie-rating/movie-rating.module';
import { MongooseConfigModule } from './movie/mongoose.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MovieModule,
    MongooseModule.forRoot(config.MONGO.DB_URL),
    TheaterModule,
    MovieRatingModule,
    MongooseConfigModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
