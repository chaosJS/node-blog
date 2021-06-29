// 只createServer 关注与 server 配置相关
const http = require('http');
const port = 8787;
const serverHandler = require('../app');
const server = http.createServer(serverHandler);

server.listen(port, () => {
	console.log('listening on 8787 port');
});
