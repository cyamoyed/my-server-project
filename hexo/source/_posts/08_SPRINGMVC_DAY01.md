---
title: SpringMVC01
tags: 
- SpringMVC
categories: 达内笔记 
copyright: false 
description: 笔记来源达内
top_img: /img/SpringMVC.png 
---



## 1. SpringMVC框架的作用

**MVC** = **M**odel（数据模型） + **V**iew（视图） + **C**ontroller（控制器）

SpringMVC框架主要解决了接收请求与处理响应的问题，也可以认为是解决了V-C交互的问题，与M其实没有关系。

在传统的Java EE的开发模式下，可能存在`Servlet`组件数量太多的问题，会导致项目的管理难度太大，且运行时，会有大量的`Servlet`对象长期占用内存的问题！

另外，传统的Java EE开发模式下，数据的处理过程中代码量相对较大，而SpringMVC非常大极度的简化了开发量！

## 2. SpringMVC HelloWorld

#### 2.1. 案例目标

最终程序运行后，打开浏览器，输入`http://localhost:8080/项目名/hello.do`即可看到自定义输出的内容。

#### 2.2. 在Eclipse中添加Server

打开Eclipse的**Servers**面板，添加Tomcat，当添加成功后，在Eclipse的项目列表中，会出现**Servers**项目，在需要使用Tomcat时，必须保证该项目是存在且打开的状态。

#### 2.3. 创建项目

创建**Maven Project**，**Group Id**为`cn.tedu`，**Artifact Id**为`springmvc01`，**Packaing**必须选择`war`。

当项目创建出来后，对项目名称点右键，在项目属性的**Targeted Runtimes**中勾选Tomcat。

刚刚创建好的项目的**pom.xml**会报错，因为缺少**web.xml**文件，并且`<failOnMissingWebXml>`节点默认为`true`，结合指定Java版本的代码，在**pom.xml**中添加：

```xml
<properties>
    <failOnMissingWebXml>false</failOnMissingWebXml>
    <java.version>1.8</java.version>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

然后，还需要在**pom.xml**中添加`spring-webmvc`的依赖：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.1.5.RELEASE</version>
    </dependency>
</dependencies>
```

#### 2.4. 创建初始化类

创建`cn.tedu.spring`包，在这个包中创建`SpringMvcConfig`配置类，并在这个类上配置组件扫描：

```java
package cn.tedu.spring;

import org.springframework.context.annotation.ComponentScan;

/**
 * SpringMvc的配置类
 */
@ComponentScan("cn.tedu.spring")
public class SpringMvcConfig {

}
```

在这个包中创建`SpringMvcInitializer`类，作为整个项目的初始化类，该类需要继承自`AbstractAnnotationConfigDispatcherServletInitializer`类，并重写该类中的抽象方法，在重写的`getServletConfigClasses()`方法中，返回以上`SpringMvcConfig`类，在重写的`getServletMappings()`方法中，返回的字符串数组中配置`"*.do"`即可：

```java
package cn.tedu.spring;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

/**
 * 项目的初始化类
 */
public class SpringMvcInitializer extends
	AbstractAnnotationConfigDispatcherServletInitializer {

	@Override
	protected Class<?>[] getRootConfigClasses() {
		return null;
	}

	@Override
	protected Class<?>[] getServletConfigClasses() {
		// 当项目初始化时，会加载当前方法的返回值
		// 类似于创建了AnnotationConfigApplicationContext的对象，并且把当前方法的返回值作为构造方法参数
		return new Class[] { SpringMvcConfig.class };
	}

	@Override
	protected String[] getServletMappings() {
		// 所有以 .do 为后缀的请求都由SpringMVC框架处理
		// 之所以使用 .do 是因为它不是一个正常的扩展名
		// 可以与访问普通的文件区分开来
		// 也可以换成其它后缀，例如 .action
		return new String[] { "*.do" };
	}

}
```

> 以上2个类都可以不必放在`cn.tedu.spring`包中，但是，应该为这2个类确定一个合理的包名。

#### 2.5. 使用控制器接收并处理请求

在组件扫描的`cn.tedu.spring`包中创建`HelloController`类，并在类的声明之前添加`@Controller`注解：

```java
package cn.tedu.spring;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 控制器类，SpringMVC框架中的控制器的名称是自定义的，并且，不需要继承自某个类，也不需要实现某个接口
 */
@Controller
public class HelloController {

}
```

然后，在这个中添加以下代码：

```java
// @RequestMapping用于配置请求路径
// 后续，当项目运行时，按照这个路径来访问
// 就会导致接下来的方法被执行
// 接下来的方法就相当于Servlet中的service()方法
@RequestMapping("hello.do")
// @ResponseBody表示响应正文
// 会导致接下来的方法的返回值会直接响应到客户端去
@ResponseBody
public String hello() {
    // 注意：不要返回中文或中文的标点符号，默认不支持
    return "Hello, SpringMVC!!!";
}
```

## 3. SpringMVC框架的核心组件

- `DispatcherServlet`：前端控制器，负责接收所配置的所有请求（假设配置为`*.do`，则它将接收所有以`.do`为后缀的请求），并负责分发这些请求；
- `HandlerMapping`：记录了请求路径与处理请求的`Controller`或其方法的对应关系，
- `Controller`：控制器，负责处理具体的请求，每个项目中可能有若干个`Controller`组件，每个`Controller`组件中可以有若干个处理请求的方法；
- `ModelAndView`：控制器处理完请求后得到的结果，该结果可以包含数据与视图名称；
- `ViewResovler`：视图解析器，可以根据视图名称来确定具体的视图组件。

## 4. 显示html模版页面

先在**src/main/resources**下创建**templates**文件夹，然后，在该文件夹创建**register.html**页面，页面的内容可以自行设计。

然后，在控制器中，将处理请求的方法之前的`@ResponseBody`注解去掉，并将方法的返回值改为`register`（HTML文件的名称），例如：

```java
// 【显示注册页面】
@RequestMapping("reg.do")
public String reg() {
    return "register";
}
```

最后，在**pom.xml**中添加`thymeleaf`和`thymeleaf-spring4`/`thymeleaf-spring5`的依赖：

```xml
<dependency>
    <groupId>org.thymeleaf</groupId>
    <artifactId>thymeleaf</artifactId>
    <version>3.0.11.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.thymeleaf</groupId>
    <artifactId>thymeleaf-spring5</artifactId>
    <version>3.0.11.RELEASE</version>
</dependency>
```

并在`SpringMvcConfig`中添加关于`ViewResolver`的配置：

```java
private String characterEncoding = "utf-8";

@Bean
public ViewResolver viewResolver() {
    ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
    templateResolver.setCharacterEncoding(characterEncoding);
    templateResolver.setCacheable(false);
    templateResolver.setTemplateMode("HTML");
    templateResolver.setPrefix("/templates/"); // 前缀
    templateResolver.setSuffix(".html"); // 后缀

    SpringTemplateEngine templateEngine = new SpringTemplateEngine();
    templateEngine.setTemplateResolver(templateResolver);

    ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
    viewResolver.setCharacterEncoding(characterEncoding);
    viewResolver.setTemplateEngine(templateEngine);
    return viewResolver;
}
```

在以上配置中，需要关注的就是配置“前缀”和“后缀”的2条配置！SpringMVC框架在使用以上视图解析器时，会将“前缀”、“控制器方法返回的视图名称”、“后缀”拼接起来，得到具体用于显示的视图组件，以上代码中，拼接起来的值就是`/templates/register.html`，能够指向所设计的网页文件！当然，也可以采取其它的组件方式，例如“前缀”和“后缀”都配置为空字符串，而方法的返回值直接返回`"/templates/register.html"`也是可以的！

另外，以上代码中使用到了`ClassLoaderTemplateResolver`模版解析器，该模版解析器在工作时，默认会在项目的**src/main/resources**下查找视图组件，所以，视图文件（HTML）文件必须放在这个位置！还可以使用`ServletContextTemplateResolver`模版解析器，其查找视图组件的位置是在**webapp**下。

## 5. 接收客户端提交的请求参数

在SpringMVC框架中，将“客户端提交的请求参数”直接声明为“处理请求的方法的参数”即可，甚至，还可以将参数直接声明为所期望的类型，例如：

```java
// 【处理注册请求】
@RequestMapping("handle_reg.do")
@ResponseBody
public String handleReg(String username, String password, Integer age, String phone, String email) {
    System.out.println("UserController.handleReg()");

    System.out.println("username=" + username);
    System.out.println("password=" + password);
    System.out.println("age=" + age);
    System.out.println("phone=" + phone);
    System.out.println("email=" + email);

    return "Over";
}
```





## 6.SpringMVC执行流程图

![SpringMVC执行流程图](/img/SpringMVC.png )







