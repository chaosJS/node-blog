1. 选择 myspl 而不是 mongodb
   1. 业内常用
   2. 问题可查
2. brew mysql

   ```
   We've installed your MySQL database without a root password. To secure it run:
       mysql_secure_installation

   MySQL is configured to only allow connections from localhost by default

   To connect run:
       mysql -uroot

   To have launchd start mysql now and restart at login:
     brew services start mysql
   Or, if you don't want/need a background service you can just run:
     mysql.server start
   ```

   ```sql
   --- new ---
   insert into users (username, `password`, realname) values ('lisi','123', '李四');
   --- select ---
   select * from users -- do not use *
   select id username from users
   select username ,id from users where username='zhangsan' and/or `password`='123';
   -- password include 12 模糊查询
   select * from users where `password` like '%12%'
   select * from users where `password` like '%1%' order by id; -- 默认正序
   select * from users where `password` like '%1%' order by id desc; -- 降序
   -- when update or del you should add a key colum like id or
   -- SET SQL_SAFE_UPDATES = 0
   --- update ---
   update users set realname='李四update' where username = 'lisi' and id=2;
   --- del  ---
   delete from  users where username='lisi' and id=2; -- 流水，日志之类
   update users set `status` = 0 where username = 'lisi' and id=3; --soft delete 用户 文章 行为等核心数据
   -- in real dev env you should not delete data , you should add a column like status
   -- to set status 0/1
   select * from users where `status`<>0;
   ```

3. node connect sql

   1. `Client does not support authentication protocol requested by server;`

   ```sql
   alter user 'root'@'localhost' identified with mysql_native_password by '********';
   flush privileges;
   ```

4. cookie vs session

   1. cookie 大小限制， 安全问题
   2. session 服务器性能

5. 拆分 session 到 redis
   1. brew install redis
   2. redis-server // start redis server
   3. redis-cli // start set/get op
   4. set key value
   5. get key // get value
   6. keys \* //get all key list
   7. del key
6. log
7. crontab 拆分日志
   1. `crontab -e ` 编辑 `* 0 * * * sh /Users/lichao/projects/node-doc/src/utils/copy.sh`
   2. 每天凌晨 0：00 分触发 copy.sh
   3. `crontab -l` 列出所有任务
8. 安全
   1. 使用 mysql 的 escape 转义 sql 语句 防止 sql 注入
   2. xss 没有对用户输入的文本进行过滤，就插入到 HTML 中 用户输入/URL 参数/POST 参数 都要过滤
   3. 输出的 html/js/css 也要过滤
   4. mysql 用户密码加密
