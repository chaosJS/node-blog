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
				// return cookie to frontend
				res.serHeader(
					'Set-Cookie',
					`username=${
						loginData.username
					};path=/ httpOnly; expires=${getCookieExpires()}`
				);
				return new SuccessModel(true, 'login success');
			} else {
				return new ErrorModel('login fail');
			}
		});
	}
};
module.exports = handleUserRouter;
