import {
  getRedisConnectionFromPool,
  releaseRedisConnectionFromPool
} from "../config/cache.js";

export async function addDataToCache(key, data, expiresIn=null) {
  const redisClient = await getRedisConnectionFromPool();

  await redisClient.set(key, data);

  if (expiresIn) {
    redisClient.expire(key, expiresIn);
  }

  releaseRedisConnectionFromPool(redisClient);
}

export async function getDataFromCache(key) {
  const redisClient = await getRedisConnectionFromPool();

  const data = await redisClient.get(key);

  releaseRedisConnectionFromPool(redisClient);

  return data;
}
