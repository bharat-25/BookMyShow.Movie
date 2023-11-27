import { Controller } from '@nestjs/common';
import axios from 'axios';
import { RedisService } from './redis/redis.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly redisService: RedisService) {}

  private readonly baseUrl = 'http://localhost:3008';

    async verifyUser(userEmail){
        try {
          const GetUser=await this.redisService.redisGet(userEmail); 
          if(GetUser){
            return true
          }
        const Axiosresponse = await axios.post(`${this.baseUrl}/users/User-Verify`,{userEmail});
        console.log('------->', Axiosresponse.data);
        const Isverify=Axiosresponse.data
        await this.redisService.redisSet(userEmail, Isverify, 900); 
        return Isverify
        } catch (error) {
          console.error('Error in verifyUser:', error.message);
          throw error;
    }

}
}