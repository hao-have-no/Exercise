# Exercise
html-布局实验，页面动画实现
One-js事件代理，Js深入浅出,js知识点练习
Two-源码积累
Three-有用的组件
Four-Es6事件,Es6知识点练习
Five-杂七杂八
Six-面试知识点累计


nginx:
/usr/sbin/nginx：主程序
/etc/nginx：存放配置文件
/usr/share/nginx：存放静态文件
/var/log/nginx：存放日志


罗列出与nginx相关的软件
dpkg --get-selections|grep nginx

sudo apt-get --purge remove nginx


查看nginx正在运行的进程，如果有就kill掉
ps -ef |grep nginx

sudo kill  -9


运行mongodb
./bin/mongod --dbpath=/usr/local/mongodb/data/db/  设置mongodb的地址

/data/db 是 MongoDB 默认的启动的数据库路径(--dbpath)。
mkdir -p /data/db

启动mongondb
mongodb://localhost 以本地方式启动

管理工具推荐:navicat

//杀死占用端口的进程
sudo lsof -i:端口号
sudo kill -9 进程号


