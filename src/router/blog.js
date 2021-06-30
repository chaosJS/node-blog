// 只解析路由，返回正确的数据格式
const {
	getBlogList,
	getBlogDetail,
	newBlog,
	updataBlog,
	delBlog,
	getPromiseData,
} = require('../controller/blog');

const { SuccessModel, ErrorModel } = require('../model/resModel');
const handleBlogRouter = (req, res) => {
	const { method } = req;

	// 博客列表
	if (method === 'GET' && req.path === '/api/blog/list') {
		getPromiseData('a.json')
			.then((aData) => {
				return getPromiseData(aData.next);
			})
			.then((bData) => {
				return getPromiseData(bData.next);
			})
			.then((cData) => {
				console.log(cData.data);
			});
		const { author, keyword } = req.query;
		// const blogList = getBlogList(author, keyword);
		return getBlogList(author, keyword).then((blogList) => {
			return new SuccessModel(blogList);
		});
	}
	// 博客详情
	if (method === 'GET' && req.path === '/api/blog/detail') {
		const { id } = req.query;
		const blogRes = getBlogDetail(id);
		return blogRes.then((blogDetail) => {
			return new SuccessModel(blogDetail);
		});
	}

	// new a blog
	if (method === 'POST' && req.path === '/api/blog/new') {
		// return new SuccessModel(newBlog(req.body));
		const blogRes = newBlog(req.body);
		return blogRes.then((newBlogId) => {
			return new SuccessModel(newBlogId);
		});
	}
	// updata a blog
	if (method === 'POST' && req.path === '/api/blog/update') {
		const { id } = req.query;
		const result = updataBlog(id, req.body);
		return result.then((val) => {
			if (val) {
				return new SuccessModel();
			} else {
				return new ErrorModel(`update blog ${id} fail`);
			}
		});
	}

	// del a blog
	if (method === 'POST' && req.path === '/api/blog/delete') {
		const { id } = req.query;
		const result = delBlog(id, req.body.author);
		return result.then((val) => {
			if (val) {
				return new SuccessModel();
			} else {
				return new ErrorModel(`del blog ${id} fail`);
			}
		});
	}
};
module.exports = handleBlogRouter;
