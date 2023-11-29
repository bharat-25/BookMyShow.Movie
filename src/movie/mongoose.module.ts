import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../config/config';

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGO.DB_URL),
  ],
})
export class MongooseConfigModule {}
