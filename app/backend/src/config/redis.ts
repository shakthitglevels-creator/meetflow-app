// import redis client creator 
import {createClient} from  'redis'

// create one redis client for the entire application 
export const redisClient = createClient({
    url: "redis://localhost:6379",
});

// connect redis 
export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis connected successfully")
    } catch (error) {
        console.error("Redis connection failed", error);
        throw error;
    }
}