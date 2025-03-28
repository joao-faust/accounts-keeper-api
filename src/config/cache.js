import { createPool } from "generic-pool";
import { createClient } from "redis";

const redisPool = createPool(
  {
    create: async () => {
      const client = createClient({
        url: "redis://cache"
      });
      await client.connect();

      client.on("error", error => console.log("Redis Client Error", error))

      return client;
    },
    destroy: async (client) => {
      await client.quit();
    }
  },
  {
    min: 4,
    max: 4
  }
);

export async function getRedisConnectionFromPool() {
  return await redisPool.acquire();
}

export function releaseRedisConnectionFromPool(client) {
  redisPool.release(client);
}
