import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisReply, RedisStore } from "rate-limit-redis";
import { redis } from "../../infrastructure/redis/redis.js";

import { Command } from "ioredis";

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  useEmail?: boolean;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,

    keyGenerator: (req) => {
      const ip = ipKeyGenerator(req.ip ?? "");

      if (!options.useEmail) {
        return ip;
      }

      return `${ip}:${req.body.email ?? "anonymous"}`;
    },

    store: new RedisStore({
      sendCommand: (command: string, ...args: string[]) =>
        redis.call(command, ...args) as Promise<RedisReply>,
    }),
  });
}
