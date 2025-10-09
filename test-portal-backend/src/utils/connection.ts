import Redis from "ioredis";
export const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  maxRetriesPerRequest: null,
  //  password:process.env.pasword
});
