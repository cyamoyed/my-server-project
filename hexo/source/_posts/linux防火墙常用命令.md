查看已开启的端口

firewall-cmd --list-ports

查看防火墙状态

firewall-cmd --state

开启防火墙

systemctl start firewalld

开启端口

firewall-cmd --zone=public --add-port=6379/tcp --permanent

重启防火墙

firewall-cmd --reload