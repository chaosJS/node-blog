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
