原版node-借助expressda搭建服务器，主要用于mysql数据的驱动－－server.js启动

新版node-借助koa+sequelize和外部postman进行jwt鉴定权限－－app.js启动

首先必须要有Erlang环境支持
安装之前要装一些必要的库:
# sudo apt-get install build-essential
# sudo apt-get install libncurses5-dev
# sudo apt-get install libssl-dev
# sudo apt-get install m4
# sudo apt-get install unixodbc unixodbc-dev
# sudo apt-get install freeglut3-dev libwxgtk2.8-dev
# sudo apt-get install xsltproc
# sudo apt-get install fop
# sudo apt-get install tk8.5

# sudo apt-get install rabbitmq-server
如果没有问题，那就直接安装了，不用设置什么东西

查看运行状态
# service rabbitmq-server status

创建配置文件，复制权限给默认用户
d /etc/rabbitmq/
#vim rabbitmq.config
编辑内容如下：
[{rabbit, [{loopback_users, []}]}].
保存后重启

消息队列－rabbitmq（常用命令）
sudo service rabbitmq-server stop　启动服务
sudo service rabbitmq-server start　关闭服务


whereis rabbitmq：查看 rabbitmq 安装位置
rabbitmqctl start_app：启动应用
whereis erlang：查看erlang安装位置
rabbitmqctl start_app：启动应用
rabbitmqctl stop_app：关闭应用
rabbitmqctl status：节点状态
rabbitmqctl add_user username password：添加用户
rabbitmqctl list_users：列出所有用户
rabbitmqctl delete_user username：删除用户
rabbitmqctl add_vhost vhostpath：创建虚拟主机
rabbitmqctl list_vhosts：列出所有虚拟主机
rabbitmqctl list_queues：查看所有队列
rabbitmqctl -p vhostpath purge_queue blue：清除队列里消息

　exchange交换机，消息先发送到这里，储存

  消息队列：到达消费者前一刻存储的地方
  
  ａｃｋ回执：收到消息后确认消息已被消费的应答。

