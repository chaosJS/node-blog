const { userLogin } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { getCookieExpires } = require('../utils');

const handleUserRouter = (req, res) => {
	const { method } = req;
	// user login
	if (method === 'POST' && req.path === '/api/user/login') {
		const { username, password } = req.body;
		const result = userLogin(username, password);
		return result.then((loginData) => {
			if (loginData.username) {
				// set session
				req.session.username = loginData.username;
				req.session.realname = loginData.realname;
				/**
				 * 第一次登陆成功
				 *  req.session  = {
				 * 		username:'zhangsan',
				 * 		realname: '张三'
				 * 	}
				 *
				 * 修改req.session会引起全局的SESSION_DATA变化
				 */

				/**
 						var SESSION_DATA = {};
						var userId = 'random str'
						SESSION_DATA[userId] = {}

						//  此时 req.session = {}
						var req ={}
						req.session = SESSION_DATA[userId];
						// 第一次登陆成功之后
						req.session.username = 'zhangsan';
						req.session.realname = '张三';

						// 此时 SESSION_DATA的结构是
						SESSION_DATA  = {
							'random str':{
								username:'zhangsan',
				 				realname: '张三'
							}
						}
				 */
				// 需要时 直接使用 req.session.xxx即可

				return new SuccessModel(true, 'login success');
			} else {
				return new ErrorModel('login fail');
			}
		});
	}
};
module.exports = handleUserRouter;
