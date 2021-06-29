const { userLogin } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const handleUserRouter = (req, res) => {
	const { method } = req;
	// user login
	if (method === 'POST' && req.path === '/api/user/login') {
		const { username, password } = req.body;
		const isLogin = userLogin(username, password);
		if (isLogin) {
			return new SuccessModel(true, 'login success');
		} else {
			return new ErrorModel('login fail');
		}
	}
};
module.exports = handleUserRouter;
