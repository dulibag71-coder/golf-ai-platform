import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    if (process.env.NODE_ENV !== 'test') { // Prevent connection during tests if not needed or mocked
        await redisClient.connect();
        console.log('Connected to Redis');
    }
})();

export default redisClient;
