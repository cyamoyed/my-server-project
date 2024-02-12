---
title: SpringMVC03
tags: 
- SpringMVC
categories: 达内笔记 
copyright: false 
description: 笔记来源达内
---



## 1. 关于@RequestMapping注解

在控制器中，在处理请求的方法之前添加`@RequestMapping`注解，可以配置请求路径与处理请求的方法的映射关系！

在`@RequestMapping`注解的源代码中有：

```java
/**
 * The primary mapping expressed by this annotation.
 * <p>This is an alias for {@link #path}. For example,
 * {@code @RequestMapping("/foo")} is equivalent to
 * {@code @RequestMapping(path="/foo")}.
 * <p><b>Supported at the type level as well as at the method level!</b>
 * When used at the type level, all method-level mappings inherit
 * this primary mapping, narrowing it for a specific handler method.
 * <p><strong>NOTE</strong>: A handler method that is not mapped to any path
 * explicitly is effectively mapped to an empty path.
 */
@AliasFor("path")
String[] value() default {};
```

由于`value`是默认的属性，所以，平时所使用到的`@RequestMapping("reg.do")`其实配置的就是这个`value`属性的值！

它的数据类型是`String[]`，所以，在配置时，可以同时配置多个路径！例如：

```java
// 【显示注册页面】
@RequestMapping({"reg.do", "register.do"})
public String reg() {
    System.out.println("UserController.reg()");
    return "register";
}
```

则通过`reg.do`和`register.do`均可使得`reg()`方法被执行，而方法的代码是不变的，最终的效果就是这2个路径都可以打开同一个页面！

在源代码中，还有：

```java
/**
 * The path mapping URIs (e.g. {@code "/profile"}).
 * <p>Ant-style path patterns are also supported (e.g. {@code "/profile/**"}).
 * At the method level, relative paths (e.g. {@code "edit"}) are supported
 * within the primary mapping expressed at the type level.
 * Path mapping URIs may contain placeholders (e.g. <code>"/${profile_path}"</code>).
 * <p><b>Supported at the type level as well as at the method level!</b>
 * When used at the type level, all method-level mappings inherit
 * this primary mapping, narrowing it for a specific handler method.
 * <p><strong>NOTE</strong>: A handler method that is not mapped to any path
 * explicitly is effectively mapped to an empty path.
 * @since 4.2
 */
@AliasFor("value")
String[] path() default {};
```

结合以上2段源代码，可以看到`value`属性与`path`属性是完全相同的！如果需要显式的指定属性名称时，使用`path`可以更好的表现语义，该属性名称是从4.2版本加入的！

在源代码还有：

```java
/**
 * The HTTP request methods to map to, narrowing the primary mapping:
 * GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE, TRACE.
 * <p><b>Supported at the type level as well as at the method level!</b>
 * When used at the type level, all method-level mappings inherit
 * this HTTP method restriction (i.e. the type-level restriction
 * gets checked before the handler method is even resolved).
 */
RequestMethod[] method() default {};
```

以上源代码说明在使用`@RequestMapping`时，可以配置名为`method`的属性，该属性的值的类型是`RequestMethod[]`类型，默认值是无。

该属性的作用是“配置所映射的HTTP请求方式”，如果没有配置该属性，表示“可以通过任何请求方式访问该路径”！如果显式的配置了该属性，则只有配置值对应的请求方式才是允许的，而没有被配置值的请求方式将不被允许！

例如，将请求方式限制为POST类型：

```java
@RequestMapping(value="handle_reg.do", method=RequestMethod.POST)
```

如果仍尝试使用GET或其它不被允许的请求方式，将会出现405错误：

```
HTTP Status 405 – Method Not Allowed
```

并且，还伴随具体的提示信息：

```
Request method 'GET' not supported
```

由于`method`属性的值类型是`RequestMethod[]`，所以，可以设置为允许多种请求方式，例如：

```java
@RequestMapping(path="login.do", method={RequestMethod.GET, RequestMethod.POST})
```

如果需要将请求方式限制为固定的某1种，还可以使用简化后的注解！例如使用`@PostMapping`注解，就可以将请求方式限制为`POST`类型，在使用时，只需要配置请求路径即可，例如：

```java
// @RequestMapping(value="handle_reg.do", method=RequestMethod.POST)
@PostMapping("handle_reg.do")
```

在`@PostMapping`注解的源代码中，关于该注解的声明是：

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = RequestMethod.POST)
public @interface PostMapping {
}
```

在该注解的声明之前添加了`@RequestMapping(method = RequestMethod.POST)`就表示当前`@PostMapping`注解具有`@RequestMapping`的作用特点且已经将请求方式限制为`POST`了！

除此以外，还有`@GetMapping`、`@PutMapping`、`@DeleteMapping`、`@PatchMapping`，均对应某1种请求方式！

**小结：如果需要将请求方式限制为某1种，则应该使用以上这些简化的注解，如果需要同时允许多种不同的请求方式，应该使用`@RequestMapping`！**

关于`@RequestMapping`注解，除了添加在处理请求的方法之前，还可以添加在控制器类的声明之前！例如：

```java
@Controller
@RequestMapping("user")
public class UserController {
}
```

当控制器类的声明之前配置了`@RequestMapping("user")`后，当前类中映射的所有请求路径中都需要添加`user`这个层级，例如，在没有添加该配置之前时，访问路径是：

```
http://localhost:8080/springmvc02/reg.do
http://localhost:8080/springmvc02/login.do
```

添加了配置之后，访问路径是：

```
http://localhost:8080/springmvc02/user/reg.do
http://localhost:8080/springmvc02/user/login.do
```

**通常，推荐为每一个控制器类的声明之前都添加该注解的配置！**

可以看到 ，SpringMVC框架在处理配置的路径时，会把类之前的`@RequestMapping`配置值与方法之前的配置值拼接起来作为完整的访问路径，但是，开发人员并不需要考虑配置值的左右两侧的`/`符号，例如以下配置是等效的：

| 在控制器类之前的配置 | 在方法之前的配置 |
| -------------------- | ---------------- |
| **user**             | **reg.do**       |
| user                 | /reg.do          |
| user/                | reg.do           |
| user/                | /reg.do          |
| /user                | reg.do           |
| /user                | /reg.do          |
| /user/               | reg.do           |
| /user/               | /reg.do          |

在实际使用时，推荐使用第1种即可！如果使用其它的配置风格也是可以的，但是，在同一个项目中，应该只使用1种风格的配置！

## 2. 拦截器

拦截器（`Interceptor`）在SpringMVC框架中可以作用于若干个不同的请求，且经过拦截器的处理后，可以选择对这些请求进行阻止（不允许继续向后续的流程中执行），或选择放行！

> 注意：拦截器的作用并不一定是”拦“下来就不允许执行了，可能某些拦截器的做法就是”拦“下来后全部放行！

当需要要使用拦截器时，首先，需要自定义类，实现`HandlerInterceptor`接口，并在重写的方法中添加输出语句，以便于观察方法的执行时间点及执行的先后顺序：

```java
package cn.tedu.spring;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class LoginInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		System.out.println("LoginInterceptor.preHandle()");
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		System.out.println("LoginInterceptor.postHandle()");
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		System.out.println("LoginInterceptor.afterCompletion()");
	}

}
```

然后，还需要对拦截器进行配置，关于该配置的写法要求：

- 相关的配置需要写在某个类中，这个类需要实现`WebMvcConfigurer`接口，且在类的声明之前必须添加`@Configuration`和`@EnableWebMvc`这2个注解，且这个类的对象必须是初始化类的`getServletConfigClasses()`方法的返回值；
- 在以上类中重写`addInterceptors()`方法，以配置拦截器。

例如使用原本存在的`SpringMvcConfig`为作配置类：

```java
package cn.tedu.spring;

@EnableWebMvc
@Configuration
@ComponentScan("cn.tedu.spring")
public class SpringMvcConfig implements WebMvcConfigurer {
	
	private String characterEncoding = "utf-8";
	
	@Bean
	public ViewResolver viewResolver() {
		// 省略
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		HandlerInterceptor interceptor = new LoginInterceptor();
		// 注意：表示拦截器处理的路径时，各路径必须使用 / 作为第1个字符
		registry.addInterceptor(interceptor).addPathPatterns("/index.do");
	}

}
```

在一个项目中，允许同时存在若干个拦截器，配置的先后顺序决定了执行顺序，如果某个请求会经过多个拦截器，只有这些拦截器全部都放行，才可以继续向后执行，只要其中任何一个拦截器的处理结果是阻止运行，该请求就不可以向后执行了！

通过运行效果可以观察到：

- 当拦截器中的`preHandle()`方法返回`true`时，会行执行拦截器中的`preHandle()`方法，再执行需要请求的控制器中的方法，再执行拦截器中的`postHandle()`和`afterCompletion()`方法；
- 当拦截器中的`preHandle()`方法返回`false`时，只会执行拦截器中的`preHandle()`方法，且客户端的浏览器窗口将显示一片空白。
- 只有拦截器中的`preHandle()`方法才是真正意义上的”拦截“方法！

回到`LoginInterceptor`类中，重写`preHandle()`方法以判断阻止或放行：

```java
@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    System.out.println("LoginInterceptor.preHandle()");
    // 如果已经登录，则放行，如果未登录，则阻止且重定向到登录界面
    HttpSession session = request.getSession();
    if (session.getAttribute("username") == null) {
        String contextPath = request.getContextPath();
        response.sendRedirect(contextPath + "/user/login.do");
        return false;
    }
    return true;
}
```

关于拦截器的配置，首先，每个拦截器都可以配置若干个拦截的路径！关于配置拦截路径时调用的`addPathPatterns()`方法，其源代码是：

```java
/**
 * Add URL patterns to which the registered interceptor should apply to.
 */
public InterceptorRegistration addPathPatterns(String... patterns) {
    return addPathPatterns(Arrays.asList(patterns));
}

/**
 * List-based variant of {@link #addPathPatterns(String...)}.
 * @since 5.0.3
 */
public InterceptorRegistration addPathPatterns(List<String> patterns) {
    this.includePatterns.addAll(patterns);
    return this;
}
```

实际使用时，可以写成例如：

```java
registry.addInterceptor(interceptor).addPathPatterns("/index.do", "/user/password.do");
```

或者写成：

```java
List<String> pathPatterns = new ArrayList<>();
pathPatterns.add("/index.do");
pathPatterns.add("/user/password.do");
registry.addInterceptor(interceptor).addPathPatterns(pathPatterns);
```

在配置路径时，还可以使用星号(`*`)作为通配符，例如，可以将`/blog/*`配置到拦截路径中，则`/blog/delete.do`、`/blog/edit.do`等路径都可以被匹配！

但是，需要注意的是：1个星号(`*`)只能表示某层级下的资源，不可以匹配到若干个层级！例如配置为`/blog/*`时，就无法匹配到`/blog/2020/list.do`！如果一定匹配若干个层级，必须使用2个连续的星号(`**`)，例如配置为`/blog/**`，则可以匹配到`/blog/list.do`、`/blog/2020/list.do`、`/blog/2020/07/list.do`……

在注册拦截器之后，还可以调用`excludePathPatterns()`方法添加”排除“的路径，被”排除“的路径将不会被拦截器处理！所以，也可以理解为”例外“或”白名单“，例如：

```java
List<String> pathPatterns = new ArrayList<>();
pathPatterns.add("/user/reg.do");
pathPatterns.add("/user/handle_reg.do");
pathPatterns.add("/user/login.do");
pathPatterns.add("/user/handle_login.do");
registry.addInterceptor(interceptor)
    .addPathPatterns("/user/**")
    .excludePathPatterns(pathPatterns);
```

注意：在调用方法时，必须先调用`addPathPatterns()`方法然后再调用`excludePathPatterns()`方法！

## 3. 拦截器与过滤器的区别

**【相同/相似】**

拦截器与过滤器都是可以作用于若干个不同的请求的，在处理请求之前将执行拦截器或过滤器中的代码，并且，都能够实现放行或阻止的效果，并且，都有”链“的概念，在同一个项目中允许存在若干个拦截器或过滤器，同一个请求需要经历多个拦截器或过滤器，只有这些拦截器或过滤器全部放行，才能向后执行！

**【区别】**

- 过滤器Filter是Java EE中的组件，则任何Java EE项目都可以使用过滤器，而拦截器Interceptor是SpringMVC框架中的组件，只有使用了SpringMVC框架的Java EE项目才可以使用拦截器，并且，只有被SpringMVC框架处理的请求才可能被拦截器处理，例如将SpringMVC框架处理的路径设置为`*.do`时，直接访问HTML页面、图片等资源将不会被拦截器处理；
- 过滤器Filter是执行在所有Servlet组件之前的，而拦截器Interceptor的第1次执行是在`DispatcherServlet`之后，且在Controller组件之前的（当然，使用过滤器时，也许是通过Servlet来处理请求的，使用拦截器时，是通过Controller来处理请求的，所以，这2者都是在处理请求之前执行，所以，一般情况下，差异并不明显）；
- 过滤器Filter只能配置过滤路径（黑名单），而拦截器Interceptor既可以配置拦截路径（黑名单），又可以配置排除路径（例外，白名单），后者的配置更加灵活！

**【小结】**

通过分析以上区别，可以发现：通过过滤器Filter实现的效果，改为使用拦截器Interceptor基本上都可以实现！同时，拦截器还具备”配置更加灵活“的特点，所以，在绝大部分情况下，应该优先使用拦截器！

当然，过滤器也具有拦截器无法取代的特点，就是”执行时间点“非常早，它是执行在所有Servlet组件之前的，所以，如果某个需要被”拦“下来执行的任务是非常早期就要执行，则必须使用过滤器！

例如，SpringMVC框架默认使用的编码是`ISO-8859-1`，是不支持中文的，所以，使用`POST`提交的请求参数中，只要存在非ASCII码字符，就会出现乱码，如果需要自定义编码，需要在项目的初始化类中重写`getServletFilters()`方法，并在该方法中返回SpringMVC框架自带的字符编码过滤器，且设置编码，例如：

```java
@Override
protected Filter[] getServletFilters() {
    return new Filter[] { new CharacterEncodingFilter("UTF-8") };
}
```

## 4. SpringMVC阶段小结

- 【理解】SpringMVC框架的作用：解决V-C交互的问题；
- 【理解】SpringMVC框架的核心执行流程图；
- 【掌握】通过SpringMVC框架接收并处理客户端的请求：
  - SpringMVC项目的搭建：添加`spring-webmvc`依赖，配置不使用**web.xml**，添加Tomcat环境，创建SpringMVC的配置类，创建初始化项目的类并加载SpringMVC的配置类、设置SpringMVC框架所处理的请求路径；
  - 创建控制器类：自定义名称，必须放在组件扫描的包或其子孙包中，必须添加`@Controller`注解；
  - 创建处理请求的方法：使用`@RequestMapping`系列注解配置请求路径，使用`public`访问权限，暂定使用`String`作为返回值类型，方法名称可以自定义，方法的参数列表可以按需设计。
- 【掌握】通过SpringMVC框架接收客户端提交的请求参数：
  - 将请求参数逐一声明为处理请求的方法的参数；
  - 将多个请求参数封装到自定义对象中，并将自定义的数据类型声明为处理请求的方法的参数。
- 【掌握】使用SpringMVC封装转发的数据到视图组件，并且在视图组件显示转发的数据；
- 【理解】转发与重定向的区别；
- 【掌握】Session的使用原则与使用方式；
- 【掌握】拦截器的使用与配置；
- 【理解】拦截器与过滤器的区别；
- 【掌握】解决POST请求中文乱码的问题；
- 【掌握】阅读简单的注解源代码，例如`@RequestMapping`、`@RequestParam`等。





















