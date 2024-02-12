---
title: Spring01
tags: 
- Spring
categories: 达内笔记
copyright: false
description: 笔记来源达内
---



## 2. Spring框架的作用

Spring框架的主要作用是创建对象和管理对象。

创建对象：类似于`User user = new User();`

管理对象：随时可以通过Spring框架获取对象，甚至Spring框架还能够帮我们为对象的属性进行赋值等。

## 3. 通过Spring框架创建对象，并获取对象

在Eclipse中创建**Maven Project**，在创建过程中勾上**Create a simple project**，**Group Id**填为`cn.tedu`，**Artifact Id**填为`spring01`。

> 如果某个项目不会被其它项目所使用，只需要保证自身能独立运行，其实**Group Id**和**Artifact Id**的值是多少，并不重要。

创建成功后，先在**pom.xml**中添加以上配置：

```xml
<properties>
    <java.version>1.8</java.version>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

然后，对项目名称点击鼠标右键，选择**Maven** > **Update Project**以更新Maven，则当前环境会使用Java 1.8。

接下来，需要在**pom.xml**中添加Spring框架所需的`spring-context`依赖的代码：

```xml
<dependencies>
    <!-- https://mvnrepository.com/artifact/org.springframework/spring-context -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.2.6.RELEASE</version>
    </dependency>
</dependencies>
```

如果需要Spring管理某个类的对象，可以通过自定义的类进行配置！

例如存在需求：使得Spring框架管理`Date`类的对象！

先在项目的`cn.tedu.spring`包中创建`Beans`类，并且，在这个类中自定义方法，方法的返回值类型必须是`Date`，然后，自行在方法体中创建出`Date`对象并返回即可：

```java
package cn.tedu.spring;

import java.util.Date;

import org.springframework.context.annotation.Bean;

public class Beans {
	
	@Bean
	public Date aaa() {
		return new Date();
	}

}
```

> 以上使用的包名是自定义，并不是强制要求。
>
> 以上使用的类名是自定义，并不是强制要求。

关于以上自定义的方法：

- 应该使用`public`权限；
- 返回值类型是需要Spring管理的对象所归属的类型；
- 方法名称可以自定义；
- 参数列表暂时为空；
- 必须添加`@Bean`注解。

然后，就可以创建一个用于运行的类，加载以上类，并获取对象：

```java
package cn.tedu.spring;

import java.util.Date;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Demo {
	
	public static void main(String[] args) {
		// 1. 加载配置类，获取Spring容器
		AnnotationConfigApplicationContext ac
			= new AnnotationConfigApplicationContext(Beans.class);
		
		// 2. 从Spring容器中获取对象
		Date date = (Date) ac.getBean("aaa"); // getBean()方法的参数，就是配置对象的方法的名称
		
		// 3. 测试
		System.out.println(date);
		
		// 4. 关闭
		ac.close();
	}

}
```

运行以上代码，就可以看到输出的对象！

在以上`Beans`类中，配置对象的方法名是`aaa`，在运行的`Demo`类中，调用`getBean()`方法的参数也必须是`"aaa"`，名称必须保持一致！

通过，获取某个值的方法的名称都应该是`getXxx`，所以，以上`Beans`类中的方法应该改为：

```java
@Bean
public Date getDate() {
    return new Date();
}
```

但是，一旦将方法名改成了`getDate`，运行时，调用的`getBean()`方法的参数也应该改成`getDate`，例如改成：

```java
Date date = (Date) ac.getBean("getDate");
```

很显然，这个`getDate`表示的是一个**名称**，而名称应该使用名词，而不应该使用动词作为前缀！

如果要解决这个问题，可以在`@Bean`注解中配置参数，例如：

```java
@Bean("date")
public Date getDate() {
    return new Date();
}
```

后续，在运行时，调用`getBean()`方法的参数就是`@Bean`注解中配置的值，例如：

```java
Date date = (Date) ac.getBean("date");
```

**小结：在运行时，调用的`getBean()`方法的参数值，默认情况下，是配置对象的方法的名称，如果配置对象的方法的`@Bean`注解添加了参数，则`getBean()`方法的参数就是`@Bean`注解中的参数！**

**其实，Spring推荐直接使用名词作为以上配置对象的方法名称，即推荐使用`date`作为方法名，而不是`getDate`作为方法名！该名词将用于`getBean()`方法的参数，毕竟这个方法定义好了以后，是由Spring框架去调用了，开发人员不需要自行调用该方法，为了简化代码的同时还保证`getBean()`代码的语义，推荐使用名词作为方法名称！**

## 4. 由Spring管理的对象的作用域

由Spring管理的对象，在默认情况下，都是单例的！如果在配置对象的方法之前，补充添加`@Scope`注解，且注解参数配置为`prototype`时，就不是单例的了！例如：

```java
@Bean
@Scope("prototype")
public User user() {
    return new User();
}
```

> 注意：Spring与单例模式是两个不同的概念！
>
> 当需要同时使用多个注解时，各注解不区分先后顺序。

由Spring管理的对象，在单例的情况下，默认是饿汉式的！如果希望调整为懒汉式的，则在配置对象方法的方法之前补充添加`@Lazy`注解即可：

```java
@Bean
@Lazy
public User user() {
    return new User();
}
```

## 5. 由Spring管理的对象的生命周期

生命周期：某个对象从创建到最终销毁会经历的历程！

通常，需要讨论生命周期时，对应的数据类型的对象都不是由开发人员自行维护的！

被容器维护的对象，都是由容器创建对象，并在适当的时候调用其中的某些方法的！而开发人员需要做的就是“确定满足某条件的时候应该执行什么任务”！也就是说，“容器决定什么时候执行，开发人员决定执行时做什么”。

学习生命周期的意义就是“知道在什么时候需要做什么事情”！

以`Servlet`为例，其生命周期中会有几个特殊的方法，在特定的情况下会被调用，这些就称之为生命周期方法：

- `init()`：当`Servlet`被创建对象后，立即执行，且只执行1次，该方法适合编写一些初始化相关的代码；
- `service()`：当接收到匹配的请求后会被调用，接收到多少次请求，就执行多少次该方法；
- `destroy()`：当`Servlet`对象即将被销毁之前执行，且只执行1次，该方法适合编写一些与结束相关的代码，例如关闭等等。

当使用Spring框架后，某些类的对象交给Spring框架来管理了，那么，这些对象在什么时候被创建、什么时候被销毁，及创建过程和销毁过程中需要执行某些代码，对于开发人员来说，一定程度上是不可控的！

Spring框架允许用户在类中自定义最多2个方法，分别表示“初始化方法”和“销毁方法”，并且，Spring框架会在创建对象之后自动调用初始化方法，会在销毁对象之前调用销毁方法！关于方法的定义：

- 访问权限：应该使用`public`权限；
- 返回值类型：使用`void`；
- 方法名称：自定义；
- 参数列表：空。

例如，在`User`类中自定义2个生命周期方法：

```java
public void init() {
    System.out.println("User.init()");
}

public void destroy() {
    System.out.println("User.destroy()");
}
```

然后，在配置对象的方法之前的`@Bean`注解中配置这2个方法作为生命周期方法：

```java
@Bean(initMethod="init", destroyMethod="destroy")
public User user() {
    return new User();
}
```

## 6. 通过组件扫描使得Spring管理类的对象

假设存在`User`类，需要被Spring框架创建并管理对象，则，必须先明确`User`类所在的包，然后，在用于运行的类`Demo`中，在`AnnotationConfigApplicationContext`的构造方法中，将包名作为构造方法的参数，例如：

```java
AnnotationConfigApplicationContext ac 
    = new AnnotationConfigApplicationContext("cn.tedu.spring");
```

以上代码则表示“**组件扫描**”，当执行时，Spring框架会扫描指定的包中所有的内容，并且，自动创建各**组件**的对象并进行管理！

当然，并不是所有的类都是“**组件**”，如果要标识某个类是“组件”，必须在类的声明之前添加`@Component`注解！例如：

```java
package cn.tedu.spring;

import org.springframework.stereotype.Component;

@Component
public class User {

}
```

后续，从Spring容器中获取对象时，默认情况下，将类名的首字母改为小写，作为Bean的名称，用于调用`getBean()`方法的参数，例如：

```java
User user = ac.getBean("user", User.class);
```

> 关于Bean的名称，如果类名**首字母是大写，且第2个字母是小写**，例如`User`或`Student`，则Bean的名称就是将首字母改为小写即可，也就是`user`或`student`！如果不满足该条件，例如类名是`teacher`或`IUserDao`，则Bean的名称就是类的名称！

当然，Spring框架也允许自定义Bean的名称，只要将自定义的名称配置在`@Component`注解参数中即可，例如：

```java
package cn.tedu.spring;

import org.springframework.stereotype.Component;

@Component("stu")
public class Student {
	
}
```

则以上类的对象被Spring管理时，Bean的名称就是`"stu"`，后续，调用`getBean()`方法获取对象时，也必须使用这个名称来获取对象：

```java
Student stu = ac.getBean("stu", Student.class);
```























---

## 【附】1. 单例模式

单例模式，是设计模式中的一种。

单例模式，其特点是：被设计为单例的类型，在同一时间内，该类型的对象只会存在1个！

假设存在`King`类：

```java
public class King {}
```

作为一个普通的类，是可以在类的外部随意创建对象的，例如：

```java
King k1 = new King();
King k2 = new King();
King k3 = new King();
```

因为在`King`类中，没有声明构造方法，则编译器会自动的添加默认构造方法，也就是公有的、无参数的构造方法，所以，在类的外部才可以随意创建对象！以上代码中就创建了3个`King`类型的对象！

如果要实现单例，首先，就不能允许随意创建对象，可以显式的添加构造方法，并将其私有化，避免外部随意访问，例如：

```java
public class King {
    private King() {}
}
```

一旦显式的添加了构造方法，编译器就不会再自动添加构造方法了，则在类的外部，将不可以再执行`King k1 = new King();`这类的代码了！

使用了私有的构造方法，并不影响在类的内部使用该构造方法，为了保证在类的外部依然可以获取类的对象，则可以：

```java
public class King {
    private King() {}
    
    public King getInstance() {
        return new King();
    }
}
```

同时，为了保证“多次获取时，获取到的都是同一个对象”，则不能反复在方法中**创建**对象，而是改为：

```java
public class King {
    private King king = new King();
    
    private King() {}
    
    public King getInstance() {
        return king;
    }
}
```

改为这样以后，无论执行多少次`getInstance()`方法，该方法返回的都是同一个`king`变量，而该变量的值只是在类被加载时赋值了1次而已，就实现了单例的效果！

当然，以上代码是矛盾的！因为，如果要调用`getInstance()`方法，必须先有`King`类型的对象，而得到`King`类型对象的唯一途径就是调用`getInstance()`方法！也就是说：不调用`getInstance()`方法就无法得到对象，但是，调用方法之前又必须有对象！

为了解决这个问题，可以为`getInstance()`方法添加`static`修饰符，则通过`类名.方法名()`的格式就可以调用方法了，不需要事先获取对象！同时，基于“被`static`修饰的成员不可以直接访问没被`static`修饰的成员”的原则，所以，全局的`private King king = new King();`也需要添加`static`修饰符：

```java
public class King {
    private static King king = new King();
    
    private King() {}
    
    public static King getInstance() {
        return king;
    }
}
```

至此，简单的单例模式代码就完成了，后续，需要获取`King`类型的对象时，只能通过`King.getInstance()`得到对象，而该方法每次返回的都是同一个对象！

严格来说，以上单例模式的设计是“饿汉式”的，可以看到，在类被加载时，就直接创建了`King`类的对象，此时，也许并不需要获取对象，但是，也创建好了 ，后续，当需要对象时，直接获取即可！另外，还有“懒汉式”的单例模式，其特点就是“不到逼不得已，不创建对象”！其基础代码例如：

```java
public class King {
    private static King king;
    
    private King() {}
    
    public static King getInstance() {
        if (king == null) {
            king = new King();
        }
        return king;
    }
}
```

以上代码是多线程不安全的！为了解决这个问题，可以将以上代码块添加互斥锁，例如：

```java
public class King {
    private static King king;
    
    private King() {}
    
    public static King getInstance() {
        synchronized("java") {
            if (king == null) {
                king = new King();
            }
        }
        return king;
    }
}
```

一旦添加了锁，就会导致每次调用`getInstance()`方法时都会先锁定代码再执行，效率偏低，为了解决该问题，还可以：

```java
public class King {
    private static King king;
    
    private King() {}
    
    public static King getInstance() {
        if (king == null) { // 判断是否有必须加锁，如果没有该判断，则效率可能偏低
            synchronized("java") {
                if (king == null) { // 判断是否有必须创建对象，如果没有该判断，则可能创建多个对象
                    king = new King();
                }
            }
        }
        return king;
    }
}
```

以上，就是完整的懒汉式的单例模式！

**小结：单例模式的特点就是“单一实例”，表现为“同一时间内，某个类的对象只有1个”！单例模式分为“饿汉式”和“懒汉式”这2种，前者是“早早的创建出对象，随时可以获取”，后者是“不到逼不得已不会创建对象”！**

