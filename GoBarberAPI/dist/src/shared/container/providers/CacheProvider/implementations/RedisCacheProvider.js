"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RedisCacheProvider {
    constructor() {
        //this.client = new Redis(cacheConfig.config.redis);
    }
    async save(key, value) {
        await this.client.set(key, JSON.stringify(value));
    }
    async recover(key) {
        const data = await this.client.get(key);
        if (!data) {
            return null;
        }
        const parsedData = JSON.parse(data);
        return parsedData;
    }
    async invalidate(key) {
        await this.client.del(key);
    }
    async invalidatePrefix(prefix) {
        const keys = await this.client.keys(`${prefix}:*`);
        const pipeline = this.client.pipeline();
        keys.forEach(key => {
            pipeline.del(key);
        });
        await pipeline.exec();
    }
}
exports.default = RedisCacheProvider;
