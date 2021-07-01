const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('error', (err) => {
	console.log('redis err', err);
});

const set = (key, value) => {
	if (typeof value === 'object') {
		value = JSON.stringify(val);
	}
	redisClient.set(key, value, redis.print);
};
const get = (key) => {
	return new Promise((resolve, reject) => {
		redisClient.get(key, (err, value) => {
			if (err) {
				reject('redis get err', err);
				return;
			}
			// 传的key不对，redis返回的是null 需要考虑
			if (value === null) {
				resolve(null);
				return;
			}
			try {
				// 返回的是纯字符串格式的对象
				resolve(JSON.parse(value));
			} catch (err) {
				resolve(value);
			}
		});
	});
};

// redis.quit()
module.exports = {
	set,
	get,
};
