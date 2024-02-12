---
title: Java基础部分面试题
date: 2020-08-03 20:19:54
tags: 面试题
categories: 面试题
---

1. JDK和JRE有什么区别？

   > JDK是Java开发工具包， JRE是Java运行环境。

2. ==和equals有什么区别？

3. 两个对象的hashcode()相同，则equals()也一定为true，对吗，为什么？

   > 不对。
   >
   > 如果没有重写equals()方法，使用的就是Object类中的equals()方法，返回内存编码.
   >
   > 在集合中，比如HashSet中，要求放入的对象不能重复，怎么判定呢？
   >
   > 首先会调用hashcode，如果hashcode相等，则继续调用equals，也相等，则认为重复。
   >
   > 如果重写equals后，如果不重写hashcode，则hashcode就是继承自Object的，返回内存编码，这时候可能出现equals相等，而hashcode不等，你的对象使用集合时，就会等不到正确的结果

4. final在Java中有什么作用？

   >   定义类：不可继承。定义方法：不可重写。定义属性：值不可改变，定义之初就要赋值。

5. Java中的math.round(-1.5)等于多少？

   > -1。round()的结果会四舍五入，-1.5四舍五入后是-1。

6. String属于基础的数据类型吗？

   > 不属于，String是一个类，八个基本数据类型是关键字

7. Java中操作字符串都有哪些类？他们之间有什么区别？

   > String, StringBuffer, StringBuilder

8. String str = "i"与String str=new String("i")一样吗？ 

   > 不一样 前者Java虚拟机会分配到内存空间中，后者会分配到堆内存中新开辟一块空间。

9. 如何将字符串反转？

   > StringBuffer或StringBuilder的reverse()方法。

10. String类的常用方法有哪些？

    > lenth(), isEmpty(), replaceAll(), split(), trim(), toString()

11. 抽象类必须要有抽象方法吗？

    > 不是，抽象类可以有构造方法或普通方法。

12. 普通类和抽象类有哪些区别？

    > 普通类可以被实例化， 抽象类可以定义抽象方法，使用抽象类方便代码的复用。
    >
    > 抽象类的子类必须实现抽象类中所有的抽象方法，否则这个子类也是抽象类。

13. 抽象类能使用final修饰吗？

    > 不能。抽象类必须被继承，而使用final关键字后不能被继承，是冲突的。

14. 接口和抽象类有什么区别？

    > 接口更多的是在系统架构设计方法中发挥作用，更像是一种规范，而抽象类在代码实现方面发挥作用，方便代码的重用。
    >
    > 抽象类中可以实现方法，接口中只能有抽象方法。

15. Java中IO流分为几种？

    > **inputStream字节输入流，outputStream字节输出流，Writer字符输出流，Reader字符输入流**
    >
    > 按数据流向：输入流和输出流
    >
    > 按处理单位：字节流和字符流（JDK中Stream后缀的是字节流，Reader或Writer后缀的是字符流）
    >
    > 根据功能：节点流和处理流

16. BIO、NIO、AIO、有什么区别？

    > - BIO：**同步并阻塞**，服务器实现模式为一个**连接一个线程**，即客户端有连接请求时服务器端就需要启动一个线程进行处理，如果这个连接不做任何事情会造成不必要的线程开销，当然可以通过线程池机制改善。
    > - NIO：**同步非阻塞**，服务器实现模式为一个**请求一个线程**，即客户端发送的连接请求都会注册到多路复用器上，多路复用器轮询到连接有I/O请求时才启动一个线程进行处理。
    > - AIO：**异步非阻塞**，服务器实现模式为一个**有效请求一个线程**，客户端的 IO 请求都是由 OS 先完成了再通知服务器应用去启动线程进行处理。

17. Files的常用方法有哪些？

    > - Files.exists() 检测文件路径是否存在
    > - Files.createFile()创建文件
    > - Files.createDirectory()创建文件夹
    > - Files.delete() 删除文件或者目录
    > - Files.copy() 复制文件
    > - Files.move() 移动文件
    > - Files.size()查看文件个数
    > - Files.read() 读取文件
    > - Files.write()写入文件

