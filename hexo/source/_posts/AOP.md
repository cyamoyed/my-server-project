---
title: AOP
tags: 
	- AOP
	- 面试题
categories: 面试题
date: 2020-08-26 21:42:24
---

### Spring AOP

#### 概念

AOP，指面向切面编程(Aspect Oriented Programming)，是一种编程思想，在实际应用中是对OOP的有效补充。

在OOP中，模块化的核心单元是类，在AOP中，模块化的核心单元是切面(Aspect)，切面中封装了具体的代码。

#### AOP有什么用？

应用程序中的处理逻辑可以分为两类：核心关注点 和 横切关注点。

核心关注点指某项业务的核心处理逻辑。

横切关注点指那些会被多个业务重复调用，但是和具体业务关系不大的模块，例如日志模块，性能统计模块，事务管理模块，安全验证模块等。

AOP可以将横切关注点的内容封装在Aspect内部，并注入到所需的地方，有效实现核心关注点和横切关注点的解耦，提高了程序的可扩展性和可维护性，提高了开发效率。

![](1.png)

#### 如何使用：

Spring的IOC为AOP提供了强大的支持，利用Spring，可以非常便捷的实现AOP编程：

0. 需要在项目中添加`aspectj-tools`和`aspectjweaver`的依赖：

   <dependency>
     <groupId>aspectj</groupId>
     <artifactId>aspectj-tools</artifactId>
     <version>1.0.6</version>
   </dependency>

   <dependency>
     <groupId>org.aspectj</groupId>
     <artifactId>aspectjweaver</artifactId>
   </dependency>

1. 需要开发一个切面类`cn.tedu.db.common.aop.TimerAspect`，在类上添加2个必要的注解`@Aspect`和`@Component`:

   @Aspect
   @Component
   public class TimerAspect {

   }


2. 在类中添加切面方法：

方法的参数列表中必须添加参数`ProceedingJoinPoint`，它代表了目标方法的句柄：

	@Around("execution(* cn.tedu.db.sys.service.impl.*.*(..))")
	public Object a(ProceedingJoinPoint pjp) throws Throwable {
		
		// 记录开始时间
		long st=System.currentTimeMillis();
		
		Object result=pjp.proceed();
		
		// 记录结束时间
		long et=System.currentTimeMillis();
		
		// 输出耗时
		System.err.println(pjp.getSignature().getName()+"-> 耗时："+(et-st)+"ms.");
		
		return result;
	}

`pjp.proceed()`代表调用了目标方法，该目标方法可能是有返回值的方法，对于这类方法，应该接收方法的返回值，并在切面结束时返回该返回值。

`pjp.proceed()`调用目标方法时，可能抛出异常`Throwable`，如果在切面方法中不需要对异常进行处理，可直接在签名中声明抛出。

需要在切面方法前添加`@Around`注解，指明该切面方法是在目标方法调用前和调用后都有逻辑执行，对应的也可以添加`@Before`或`@After`，但是一般没有必要。

在`@Around`注解后需要指明当前切面方法注入的目标位置，`@Around("execution(* cn.tedu.db.sys.service.impl.*.*(..))")`代表业务层所有的方法都被注入。
	

	* `execution()`为表达式的主体
	* 第一个"*"号表示返回值的类型任意
	* `cn.tedu.db.sys.service.impl`表示AOP所切的服务的包名
	* 第二个"*"表示类名，*即所有类
	* `.*(..)`表示任何方法名，括号表示参数，两个点表示任何参数类型

#### AOP中的一些基本概念：

Aspect（切面）： Aspect声明类似于Java中的类声明，在Aspect中会包含着一些Pointcut以及相应的Advice。

Joint point（连接点）：表示在程序中明确定义的点，典型的包括方法调用，对类成员的访问以及异常处理程序块的执行等等，它自身还可以嵌套其它 joint point。

Pointcut（切点）：表示一组 joint point，这些 joint point 或是通过逻辑关系组合起来，或是通过通配、正则表达式等方式集中起来，它定义了相应的 Advice 将要发生的地方。

Advice（通知）：Advice 定义了在 Pointcut 里面定义的程序点具体要做的操作，它通过 before、after和around来区别是在每个joint point之前、之后还是代替执行的代码。

Target（目标对象）：织入 Advice 的目标对象。

Weaving（织入）：将 Aspect 和其他对象连接起来, 并创建 Adviced object 的过程

AOP proxy: 由AOP框架创建的对象，用于实现方面协定（建议方法执行等）。 在Spring框架中，AOP代理将是JDK动态代理或CGLIB代理。

![](2.png)

