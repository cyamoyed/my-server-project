---
title: Nginx配置跨域及转发
tags: nginx
copyright: false
---

1. 新建newfile.conf文件

```nginx
server{
        listen       1123;
	# server_name  localhost;
	location /gdlk {
        # 配置跨域问题
		add_header Access-Control-Allow-Origin *;
		add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
		add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
		if ($request_method = 'OPTIONS') {
			return 204;
		}
        # 添加下面两行配置转发
	rewrite  ^.+apis/?(.*)$ /$1 break;
	proxy_pass http://tm.amap.com/trafficengine/mapabc/traffictile;
	}
	location /txlk {
		# add_header Access-Control-Allow-Origin *;
		# add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
		# add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
		# if ($request_method = 'OPTIONS') {
		#	 return 204;
		# }
        # 添加下面两行配置转发
	rewrite  ^.+apis/?(.*)$ /$1 break;
	proxy_pass https://rtt2b.map.qq.com/rtt/;
	}
	location /bdlk {
		# add_header Access-Control-Allow-Origin *;
		# add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
		# add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
		# if ($request_method = 'OPTIONS') {
		#	 return 204;
		# }
       # 添加下面两行配置转发
	rewrite  ^.+apis/?(.*)$ /$1 break;
	proxy_pass http://its.map.baidu.com:8002/traffic/TrafficTileService;
	}
}
```

