import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  maxRetriesPerRequest: null,
  //  password:process.env.pasword
});

const csvQueue = new Queue("csvQueue", { connection });

export default csvQueue;
