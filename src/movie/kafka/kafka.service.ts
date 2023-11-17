// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import { Kafka, Producer, RecordMetadata } from 'kafkajs';

// @Injectable()
// export class KafkaService {
//   private producer: Producer;

//   constructor() {
//     this.producer = new Kafka({
//       clientId: 'movies-service',
//       brokers: ['localhost:9092'], // Update with your Kafka broker(s) information
//     }).producer();
//   }

//   async sendNotification(topic: string, message: string): Promise<RecordMetadata[]> {
//     try {
//         const { data: userEmails } = await axios.get('http://user-service-api/getAllUserEmails');
//         const topicPromises = userEmails.map(async (email: string) => {
//           await this.producer.connect();
//           const result = await this.producer.send({
//             topic: topic + '-' + email,
//             messages: [{ value: message }],
//           });
//           await this.producer.disconnect();
//           return result;
//         });
  
//         return Promise.all(topicPromises);
//       } catch (error) {
//         console.error('Error fetching user email addresses:', error.message);
//         throw error;
//       }
//     }
// }
