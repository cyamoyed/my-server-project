---
title: SpringMVC02
tags: 
- SpringMVC
categories: 达内笔记 
copyright: false 
description: 笔记来源达内
---



## 1. 接收客户端提交的请求参数

### 1.1. 使用HttpServletRequest接收请求参数

在处理请求的方法的参数列表中，添加`HttpServletRequest`类型的参数，在处理请求的过程中，调用该参数对象的`getParameter()`方法即可获取请求参数；

### 1.2. 将请求参数设计为方法的参数

可以将客户端提交的请求参数直接声明为处理请求的方法的参数，并且，可以直接将参数声明为期望的数据类型，例如：

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

使用这种做法时，必须保证客户端提交的请求参数与服务器端处理请求的方法的参数的名称是一致的！如果名称不一致，默认情况下，则服务器端处理请求的方法中，对应的参数将是`null`！

如果服务器端决定不使用方法的参数名作为客户端应该提交的请求参数名称，还可以在方法的参数之前添加`@RequestParam`注解，以指定参数名，例如：

```java
public String handleReg(@RequestParam("username") String aaaaa, String password)
```

按照以上代码中的注解，则客户端必须按照`username`和`password`这2个名称来提交请求参数！

## 1.3. 使用封装的类型接收请求参数

可以事先自定义类，将需要接收的请求参数都声明为这个类的属性，同时，为这些属性生成Set / Get方法：

```java
package cn.tedu.spring;

public class User {

	private String username;
	private String password;
	private Integer age;
	private String phone;
	private String email;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "User [username=" + username + ", password=" + password + ", age=" + age + ", phone=" + phone
				+ ", email=" + email + "]";
	}

}
```

然后，将自定义的数据类型声明为处理请求的方法的参数即可：

```java
// 【处理注册请求】
@RequestMapping("handle_reg.do")
@ResponseBody
public String handleReg(User user) {
    System.out.println("UserController.handleReg()");

    System.out.println(user);

    return "Over";
}
```

使用这种做法，应该保证客户端提交的请求参数名称与以上`User`类中的属性名称相同，且`User`类中的各属性都有规范名称的Set / Get方法！

## 1.4. 小结

以上3种方式中，`1.1`是在任何情况下都不推荐使用的！

通常，当参数数量较少且固定（数量或意义）时，优先使用`1.2`的做法；

当参数数量较多或不固定时，优先使用`1.3`的做法。

以上各做法可以综合在一起同时使用！

## 2. 控制器向模版页面转发数据

### 2.1. 通过HttpServletRequest转发数据

在处理请求的方法的参数列表中添加`HttpServletRequest`类型的参数，当需要将某些数据显示到页面中时，调用该参数对象的`setAttribute(String name, Object value)`方法将数据封装到`HttpServletRequest`请求对象中：

```java
// 【处理登录请求】
@RequestMapping("handle_login.do")
public String handleLogin(String username, String password, HttpServletRequest request) {
    System.out.println("UserController.handleLogin()");
    System.out.println("username=" + username);
    System.out.println("password=" + password);

    // 假设root/1234是正确的用户名/密码
    // 判断用户名
    if ("root".equals(username)) {
        // 用户名正确，需要判断密码
        if ("1234".equals(password)) {
            // 密码也正确，登录成功
            // 暂不考虑登录成功后的处理
        } else {
            // 登录失败，密码错误
            String errorMessage = "登录失败，密码错误！";
            request.setAttribute("msg", errorMessage);
            return "error";
        }
    } else {
        // 登录失败，用户名错误
        String errorMessage = "登录失败，用户名不存在！";
        request.setAttribute("msg", errorMessage);
        return "error";
    }

    return "Over.";
}
```

由于当前使用的是`Thymeleaf`框架，在HTML模版页面中，可以通过`Thymeleaf`表达式取出在控制器中封装到`HttpServletRequest`中的参数，例如：

```html
<h1 style="color:red">操作失败！<span th:text="${msg}"></span>！</h1>
```

## 2.2. 通过ModelMap转发数据

使用`ModelMap`转发数据的做法与使用`HttpServletRequest`转发数据几乎相同！例如：

```java
// 【处理登录请求】
@RequestMapping("handle_login.do")
public String handleLogin(String username, String password, ModelMap modelMap) {
    System.out.println("UserController.handleLogin()");
    System.out.println("username=" + username);
    System.out.println("password=" + password);

    // 假设root/1234是正确的用户名/密码
    // 判断用户名
    if ("root".equals(username)) {
        // 用户名正确，需要判断密码
        if ("1234".equals(password)) {
            // 密码也正确，登录成功
            // 暂不考虑登录成功后的处理
        } else {
            // 登录失败，密码错误
            String errorMessage = "登录失败，密码错误！！";
            modelMap.addAttribute("msg", errorMessage);
            return "error";
        }
    } else {
        // 登录失败，用户名错误
        String errorMessage = "登录失败，用户名不存在！！";
        modelMap.addAttribute("msg", errorMessage);
        return "error";
    }

    return "Over.";
}
```

## 2.3. 使用ModelAndView转发数据

将处理请求的方法的返回值类型声明为`ModelAndView`类型，在方法返回`ModelAndView`对象之前，必须向该对象中封装视图名称与数据，例如：

```java
// 【处理登录请求】
@RequestMapping("handle_login.do")
public ModelAndView handleLogin(String username, String password) {
    System.out.println("UserController.handleLogin()");
    System.out.println("username=" + username);
    System.out.println("password=" + password);

    // 假设root/1234是正确的用户名/密码
    // 判断用户名
    if ("root".equals(username)) {
        // 用户名正确，需要判断密码
        if ("1234".equals(password)) {
            // 密码也正确，登录成功
            // 暂不考虑登录成功后的处理
        } else {
            // 登录失败，密码错误
            String errorMessage = "MAV:登录失败，密码错误！！";
            Map<String, Object> model = new HashMap<String, Object>();
            model.put("msg", errorMessage);
            ModelAndView mav = new ModelAndView("error", model);
            return mav;
        }
    } else {
        // 登录失败，用户名错误
        String errorMessage = "MAV:登录失败，用户名不存在！！";
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("msg", errorMessage);
        ModelAndView mav = new ModelAndView("error", model);
        return mav;
    }

    return null;
}
```

## 3. 重定向

当处理请求的方法的返回值类型是`String`类型时，返回`"redirect:目标路径"`即可实现重定向！

> 当处理请求的方法的返回值类型是`String`类型时，如果希望执行转发，可以使用`"forward:视图名称"`的格式，由于转发是默认的行为，所以直接返回`"视图名称"`即可，不需要显式的添加`forward:`前缀。

**关于转发与重定向的区别**

- 转发是服务器内部的行为，具体表现为“控制器将请求转发给视图组件（可以有数据，也可以没有数据）”，对于客户端来说，只发出过1次请求，并且，只知道这1次请求的路径，在客户端的浏览器中，地址栏显示的URL也不会发生变化！同时，由于这是服务器内部的行为，所以，控制器可以向视图组件传递任意数据！从编写代码的角度来看，转发时，需要指定的是视图名称！
- 重定向的本质是客户端向服务器第1次发出请求后，服务器响应了302响应码，及目标路径，客户端收到这次响应后，由于响应码是`302`，会自动发出第2次请求，请求路径（目标）就是第1次请求时服务器端响应的目标路径！所以，总的来说，重定向至少发生了2次请求与响应的交互过程，由于是多次请求，并且，后续的请求目标路径对于客户端来说是已知的，所以，在客户端的浏览器中，地址栏显示的URL会发生变化！同时，由于整个过程是多次请求，由服务器端多个不同的控制器类（同一个控制器，但处理请求的方法不同）进行处理的，会导致在默认情况下，多次处理请求的过程中产生的数据无法共享使用或不便于传递！从编写代码的角度来看，重定向时，需要指定的是目标路径！

## 4. 使用Session

在处理请求的方法的参数列表中，可以直接添加`HttpSession`类型的参数，用于访问Session中的数据，添加参数后，在当前方法体中，就可以向Session中存入数据，也可以取出Session的数据，当然，只要存入了数据，在Session的有效期内，视图组件也可以直接获取Session中的数据！

**关于Session的消失：**

- 服务器关机或重启；
- 超时；
- 关闭浏览器。

**关于存入到Session中的数据：**

- 用户身份的唯一标识，例如用户的id、用户名等；
- 高频率访问的数据，例如用户名、头像等；
- 不便于使用其它技术进行传递或共享的数据。











