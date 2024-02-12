---
title: Exception和Error有什么区别（转）
date: 2020-07-06 19:40:42
tags: 
- Exception
hidden: true
---

### 基本概念

首先Exception和Error都是继承于Throwable 类，在 Java 中只有 Throwable 类型的实例才可以被抛出（throw）或者捕获（catch），它是异常处理机制的基本组成类型。

Exception和Error体现了JAVA这门语言对于异常处理的两种方式。

Exception是java程序运行中可预料的异常情况，咱们可以获取到这种异常，并且对这种异常进行业务外的处理。

Error是java程序运行中不可预料的异常情况，这种异常发生以后，会直接导致JVM不可处理或者不可恢复的情况。所以这种异常不可能抓取到，比如OutOfMemoryError、NoClassDefFoundError等。

其中的Exception又分为检查性异常和非检查性异常。两个根本的区别在于，检查性异常 必须在编写代码时，使用try catch捕获（比如：IOException异常）。非检查性异常 在代码编写使，可以忽略捕获操作（比如：ArrayIndexOutOfBoundsException），这种异常是在代码编写或者使用过程中通过规范可以避免发生的。 切记，Error是Throw不是Exception 。



其中有一个比较经典的面试题目， 就是 NoClassDefFoundError 和 ClassNotFoundException 有什么区别

```
区别一： NoClassDefFoundError它是Error，ClassNotFoundException是
Exception。

区别二：还有一个区别在于NoClassDefFoundError是JVM运行时通过classpath加载类
时，找不到对应的类而抛出的错误。ClassNotFoundException是在编译过程中如果可能出现此异常，在编译过程中必须将ClassNotFoundException异常抛出！

NoClassDefFoundError发生场景如下：
    1、类依赖的class或者jar不存在 （简单说就是maven生成运行包后被篡改）
    2、类文件存在，但是存在不同的域中 （简单说就是引入的类不在对应的包下)
    3、大小写问题，javac编译的时候是无视大小的，很有可能你编译出来的class文件就与想要的不一样！这个没有做验证


    ClassNotFoundException发生场景如下：
    1、调用class的forName方法时，找不到指定的类
    2、ClassLoader 中的 findSystemClass() 方法时，找不到指定的类

举例说明如下:
    Class.forName("abc"); 比如abc这个类不存项目中，代码编写时，就会提示此异常是检查性异常，比如将此异常抛出。


```

第二，理解 Java 语言中操作 Throwable 的元素和实践。掌握最基本的语法是必须的，如 try-catch-finally 块，throw、throws 关键字等。与此同时，也要懂得如何处理典型场景。

throw是存在于方法的代码块中，而throws是存在于方法外围，一般是在方法名后边 throws XXXException;

有个重要的点需要记住， 就是try-catch-finally中rerun的执行顺序问题

```

try{
    retrun 3;
}catch{
    e.printStackTrace();
}finally{
    return 4;
}

//上边情况下，实际返回的是4；

try{
    int x = 3;
    retrun x;
}catch{
    e.printStackTrace();
}finally{
    x++;
}

//上边情况下，实际返回的3；
```

这是为什么呢？ 因为finally的业务操作是在try业务操作的return返回调用者者之前执行。按照刚才第一种情况，实际情况是，执行完try中的业务逻辑就，return返回的操作会先存储到一个临时的堆栈中，此时不给调用者返回，随后执行finally中的业务代码。如果finally中有return操作，那么就会把finally中的return值与try中的return值进行替换。随后将最终数据返回给调用者。

**知识扩展**

前面谈的大多是概念性的东西，下面我来谈些实践中的选择，我会结合一些代码用例进行分析。

先开看第一个吧，下面的代码反映了异常处理中哪些不当之处？

```
try {
  // 业务代码
  // …
  Thread.sleep(1000L);
} catch (Exception e) {
  // Ignore it
}

```

> 这段代码虽然很短，但是已经违反了异常处理的两个基本原则。

第一，**尽量不要捕获类似 Exception 这样的通用异常，而是应该捕获特定异常**，在这里是 Thread.sleep() 抛出的 InterruptedException。

这是因为在日常的开发和合作中，我们读代码的机会往往超过写代码，软件工程是门协作的艺术，所以我们有义务让自己的代码能够直观地体现出尽量多的信息，而泛泛的 Exception 之类，恰恰隐藏了我们的目的。另外，我们也要保证程序不会捕获到我们不希望捕获的异常。比如，你可能更希望 RuntimeException 被扩散出来，而不是被捕获。

进一步讲，除非深思熟虑了，否则不要捕获 Throwable 或者 Error，这样很难保证我们能够正确程序处理 OutOfMemoryError。

第二，**不要生吞（swallow）异常**。这是异常处理中要特别注意的事情，因为很可能会导致非常难以诊断的诡异情况。

生吞异常，往往是基于假设这段代码可能不会发生，或者感觉忽略异常是无所谓的，但是千万不要在产品代码做这种假设！

如果我们不把异常抛出来，或者也没有输出到日志（Logger）之类，程序可能在后续代码以不可控的方式结束。没人能够轻易判断究竟是哪里抛出了异常，以及是什么原因产生了异常。

再来看看第二段代码

```
try {
   // 业务代码
   // …
} catch (IOException e) {
    e.printStackTrace();
}
```

这段代码作为一段实验代码，它是没有任何问题的，但是在产品代码中，通常都不允许这样处理。你先思考一下这是为什么呢？

> 这样的代码在代码规范中是没有问题的，他的问题出在，异常中的异常日志如何输出的问题。按照上边的输出，如果实在复杂的系统中，会判断不出来，异常具体在哪里打印出来的。
> 尤其是对于分布式系统，如果发生异常，但是无法找到堆栈轨迹（stacktrace），这纯属是为诊断设置障碍。所以，最好使用产品日志，详细地输出到日志系统里



  还有一种处理方式，可自定义异常，将业务异常转换为业务术语，但是抛出异常时，必须把异常的cause信息打印出，方便跟踪问题，在最短的时间内，解决问题。但是需要考虑两点

自定异常时，需要考虑自定义异常是否为检查性异常，因为这种类型设计的初衷更是为了从异常情况恢复，作为异常设计者，我们往往有充足信息进行分类。

在保证诊断信息足够的同时，也要考虑避免包含敏感信息，因为那样可能导致潜在的安全问题。如果我们看 Java 的标准类库，你可能注意到类似 java.net.ConnectException，出错信息是类似“ Connection refused (Connection refused)”，而不包含具体的机器名、IP、端口等，一个重要考量就是信息安全。类似的情况在日志中也有，比如，用户数据一般是不可以输出到日志里面的。

> 对于异常中的检查性异常，我们简单的说一下。目前检查性异常被业界说是java的一种设计缺陷。有一下几点可以参考一下

 Checked Exception 的假设是我们捕获了异常，然后恢复程序。但是，其实我们大多数情况下，根本就不可能恢复。Checked Exception 的使用，已经大大偏离了最初的设计目的。
 当然，很多人也觉得没有必要矫枉过正，因为确实有一些异常，比如和环境相关的 IO、网络等，其实是存在可恢复性的，而且 Java 已经通过业界的海量实践，证明了其构建高质量软件的能力。

> 我们从性能角度来审视一下 Java 的异常处理机制，这里有两个可能会相对昂贵的地方：

1. try-catch 代码段会产生额外的性能开销，或者换个角度说，它往往会影响 JVM 对代码进行优化，所以建议仅捕获有必要的代码段，尽量不要一个大的 try 包住整段的代码；与此同时，利用异常控制代码流程，也不是一个好主意，远比我们通常意义上的条件语句（if/else、switch）要低效。
2. java 每实例化一个 Exception，都会对当时的栈进行快照，这是一个相对比较重的操作。如果发生的非常频繁，这个开销可就不能被忽略了。







原文地址

[https://blog.csdn.net/weixin_42124070/article/details/80833629](https://blog.csdn.net/weixin_42124070/article/details/80833629)

