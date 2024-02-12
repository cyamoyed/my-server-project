---
title: Tomcat中配置去掉项目名
date: 2020-07-06 14:51:03
tags:
- tomcat
- nginx
- 负载均衡
auto_open: false

---



负载均衡中war放在tomcat中时，访问会带有包名。

##### 打开tomcat/conf/server.xml,把

```
<Context path="/" docBase="/usr/local/tomcat/tomcat-8102/webapps/blog/" reloadable="true" />
```



添加到`<Host></Host>`标签中。

路径最后一定要加`/`,刚开始没加居然也可以，但后面又不行，又直接访问到🐱页面去了。



