import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieRatingController } from './movie-rating.controller';
import { MovieRatingService } from './movie-rating.service';
import { MovieRating, MovieRatingSchema } from './schema/movie-rating.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'MovieRating', schema: MovieRatingSchema }]),
      JwtModule.register({
        secret: 'thesecretkey',
        signOptions: {
          expiresIn: '1h',
        },
      }),
      PassportModule.register({
        defaultStrategy: 'jwt',
      }),
  ],
  controllers: [MovieRatingController],
  providers: [MovieRatingService,JwtStrategy,],
})
export class MovieRatingModule {}
