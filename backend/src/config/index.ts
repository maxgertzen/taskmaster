import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.connect().then(() => {
  console.log("Connected to Redis");
});

export { redisClient };
