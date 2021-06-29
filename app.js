// 设置头，
// 添加基本解析工具，
// 解析路由返回数据
const qs = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { getPostData } = require('./src/utils');

const serverHandler = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization'
	);
	if (req.method === 'OPTIONS') {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader(
			'Access-Control-Allow-Headers',
			'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization'
		);
	}
	const { url } = req;
	req.path = url.split('?')[0];
	req.query = qs.parse(url.split('?')[1]);
	// 处理postData
	getPostData(req).then((postData) => {
		// so in router we can get post data in req.body
		req.body = postData;
		const blogResult = handleBlogRouter(req, res);

		if (blogResult) {
			blogResult.then((blogData) => {
				res.end(JSON.stringify(blogData));
			});
			return;
		}

		const userData = handleUserRouter(req, res);
		if (userData) {
			res.end(JSON.stringify(userData));
			return;
		}
		// not match any router
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.write('404 not found \n');
		res.end();
	});
};

module.exports = serverHandler;
