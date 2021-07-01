const redis = require('redis');

const getPostData = (req) => {
	return new Promise((reslove) => {
		if (
			req.method !== 'POST' ||
			!req.headers['content-type'].includes('application/json')
		) {
			// 非post请求或者 请求格式不为'application/json' 返回空
			reslove({});
			return;
		}
		let postData = ``;
		req.on('data', (chunk) => {
			postData += chunk;
		});
		req.on('end', () => {
			if (!postData) {
				reslove({});
				return;
			}
			reslove(JSON.parse(postData));
		});
	});
};
const parseCookieStr = (cookieStr) => {
	const cookieObj = {};
	cookieStr.split(';').forEach((item) => {
		if (!item) {
			return;
		}
		const key = item.split('=')[0].trim();
		const value = item.split('=')[1].trim();
		cookieObj[key] = value;
	});
	return cookieObj;
};
const getCookieExpires = () => {
	// set one day expires time
	const d = new Date();
	d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
	return d.toGMTString();
};
const testRedis = () => {
	const redisClient = redis.createClient(6379, '127.0.0.1');
	redisClient.on('error', (err) => {
		console.log('redis err', err);
	});

	redisClient.set('myname-key', 'zhangsan-value', redis.print);
	redisClient.get('myname-key', (err, value) => {
		if (err) {
			console.log('redis get err', err);
			return;
		}
		console.log(value);
		// exit redis
		redisClient.quit();
	});
};
module.exports = {
	getPostData,
	parseCookieStr,
	getCookieExpires,
	testRedis,
};
