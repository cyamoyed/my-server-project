---
title: Ajax收到的json数据是字符串形式
copyright: false
---

在Servlet中添加

```java
response.setContentType("application/json;charset=UTF-8");
response.setHeader("Cache-Control", "no-cache");
response.setCharacterEncoding("UTF-8");
```

