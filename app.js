// 设置头，
// 添加基本解析工具，
// 解析路由返回数据
const qs = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { access } = require('./src/utils/log');
const {
	getPostData,
	parseCookieStr,
	getCookieExpires,
	// testRedis,
} = require('./src/utils');

// session data
const SESSION_DATA = {};
const key = 'session_id';
const EXPIRES = 20 * 60 * 1000; //过期时长

// test redis
// testRedis();
const serverHandler = (req, res) => {
	// log access log

	access(
		`${req.method} -- ${req.url} -- ${
			req.headers['user-agent']
		} -- ${Date.now()}`
	);
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);
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
	// parse cookies
	const cookieStr = req.headers.cookie || '';
	req.cookie = parseCookieStr(cookieStr);

	// parse session
	let needSetCookie = false;
	// //判断请求cookie中是否有被添加userid
	let userId = req.cookie.userid;
	if (userId) {
		// 如果cookie中有userid直接使用
		if (!SESSION_DATA[userId]) {
			// SESSION_DATA 中userId 为空 说明不存在或者过期了 则清空
			SESSION_DATA[userId] = {};
		}
	} else {
		needSetCookie = true;
		userId = `${Date.now()}_${Math.random()}`;
		SESSION_DATA[userId] = {};
		/** 此时 SESSION_DATA 的结构
		 * {
		 * 	"1625135395066_0.8444791312713953":{}
		 * }
		 */
	}
	//  req.session = {}
	req.session = SESSION_DATA[userId];
	// 处理postData
	getPostData(req).then((postData) => {
		// so in router we can get post data in req.body
		req.body = postData;
		const blogResult = handleBlogRouter(req, res);

		if (blogResult) {
			blogResult.then((blogData) => {
				if (needSetCookie) {
					res.setHeader(
						'Set-Cookie',
						`userid=${userId};  samesite=true; path=/; httpOnly; expires=${getCookieExpires()}`
					);
				}
				res.end(JSON.stringify(blogData));
			});
			return;
		}

		const userResult = handleUserRouter(req, res);
		if (userResult) {
			userResult.then((userData) => {
				if (needSetCookie) {
					res.setHeader(
						'Set-Cookie',
						`userid=${userId}; domain=localhost; path=/; httpOnly; expires=${getCookieExpires()}`
					);
				}
				res.end(JSON.stringify(userData));
			});
			return;
		}
		// not match any router
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.write('404 not found \n');
		res.end();
	});
};

module.exports = serverHandler;
