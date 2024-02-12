---
title: windows关闭8080端口
copyright: false
---



netstat -o -n -a | findstr :8080

taskkill /F /PID 12684