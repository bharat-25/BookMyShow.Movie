import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieRatingController } from './movie-rating.controller';
import { MovieRatingService } from './movie-rating.service';
import { MovieRating, MovieRatingSchema } from './schema/movie-rating.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
// import { JwtStrategy } from './guard/auth.guard';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from './constant/constant';
import { RedisModule } from 'src/auth/redis/redis.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'MovieRating', schema: MovieRatingSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    RedisModule,
    AuthModule
  ],
  controllers: [MovieRatingController],
  providers: [MovieRatingService,AuthController],
})
export class MovieRatingModule {}
