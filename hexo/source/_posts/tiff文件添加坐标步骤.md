---
title: tiff文件添加坐标步骤
tags: 
- ArcGIS
- Cesium
---



1. 将tiff文件导入ArcMap中，

   > 右键文件名称---数据---导出数据---选择导出路径---保存

   ![image-20210224115415504](https://hexo-1301474191.cos.ap-chongqing.myqcloud.com/tiff%E6%96%87%E4%BB%B6%E6%B7%BB%E5%8A%A0%E5%9D%90%E6%A0%87%E6%AD%A5%E9%AA%A4/image-20210224115415504.png)

![image-20210224115616222](https://hexo-1301474191.cos.ap-chongqing.myqcloud.com/tiff%E6%96%87%E4%BB%B6%E6%B7%BB%E5%8A%A0%E5%9D%90%E6%A0%87%E6%AD%A5%E9%AA%A4/image-20210224115616222.png)

2. 在C++程序中进行配置坐标

![image-20210224115952612](https://hexo-1301474191.cos.ap-chongqing.myqcloud.com/tiff%E6%96%87%E4%BB%B6%E6%B7%BB%E5%8A%A0%E5%9D%90%E6%A0%87%E6%AD%A5%E9%AA%A4/image-20210224115952612.png)

需要配置上图红框中的六个参数，**其中`上下左右`为坐标，可以在ArcGIS中查看原图的参数获取**

> 右键文件名称---属性---源---属性---范围

![image-20210224120221439](https://hexo-1301474191.cos.ap-chongqing.myqcloud.com/tiff%E6%96%87%E4%BB%B6%E6%B7%BB%E5%8A%A0%E5%9D%90%E6%A0%87%E6%AD%A5%E9%AA%A4/image-20210224120221439.png)

![image-20210224125953685](https://hexo-1301474191.cos.ap-chongqing.myqcloud.com/tiff%E6%96%87%E4%BB%B6%E6%B7%BB%E5%8A%A0%E5%9D%90%E6%A0%87%E6%AD%A5%E9%AA%A4/image-20210224125953685.png)

3. 运行程序
4. 将添加坐标后的tif文件再次导入ArcGIS中添加坐标系

> 选择ArcToolBox工具 --- 投影和变换 --- 定义投影 --- 选择需要设置的tif文件 --- 添加坐标系 --- 确定 --- 然后依照第一步的方法导出

在选择坐标系时，可以用第二步的方法查看`空间参考`中的原图坐标系，然后选择一样的即可。

![image-20210224130827715](https://hexo-1301474191.cos.ap-chongqing.myqcloud.com/tiff%E6%96%87%E4%BB%B6%E6%B7%BB%E5%8A%A0%E5%9D%90%E6%A0%87%E6%AD%A5%E9%AA%A4/image-20210224130827715.png)

![image-20210224130856310](https://hexo-1301474191.cos.ap-chongqing.myqcloud.com/tiff%E6%96%87%E4%BB%B6%E6%B7%BB%E5%8A%A0%E5%9D%90%E6%A0%87%E6%AD%A5%E9%AA%A4/image-20210224130856310.png)

5. 使用geoserver发布tif





[C++程序来源](https://blog.csdn.net/wb175208/article/details/70038218)