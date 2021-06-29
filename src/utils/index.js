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
module.exports = {
	getPostData,
};
