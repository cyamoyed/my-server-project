---
title: Spring02
tags: 
- Spring
categories: 达内笔记
copyright: false
description: 笔记来源达内
---



## 1. 组件扫描

首先，必须让Spring扫描组件所在的包，并且，组件类的声明之前必须添加`@Component`注解！

其实，除了`@Component`注解以外，还可以使用以下注解实现同样的效果：

- `@Controller`:推荐添加在**控制器类**之前;
- `@Service`:推荐添加在**业务类**之前;
- `@Repository`:推荐添加在**处理持久层的类**之前.

以上4个注解在Spring框架的作用领域中，效果是完全相同的，用法也完全相同，只是**语义**不同。

在使用组件扫描时，还可以自定义某个类，作为配置类，在这个类的声明之前使用`@ComponentScan`注解来配置组件扫描的包：

```java
package cn.tedu.spring;

import org.springframework.context.annotation.ComponentScan;

@ComponentScan("cn.tedu.spring")
public class SpringConfig {

}
```

后续,程序运行时,就需要加载这个配置类：

```java
AnnotationConfigApplicationContext ac 
    = new AnnotationConfigApplicationContext(SpringConfig.class);
```

关于组件扫描的包，严格来说，是配置需要被扫描的“**根包**（base package）”，也就是说，在执行扫描时，会扫描所设置的包及其所有子孙包中的所有组件类！当设置为扫描`cn.tedu`包时，会把`cn.tedu.spring`甚至`cn.tedu.spring.dao`这些包中的组件类都扫描到！

## 2. 关于注解的使用

以`@Bean`注解为例，其声明是：

```java
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Bean {
}
```

可以看到，注解都是通过`@interface`声明的！

在注解的声明之前，还添加了一系列的注解，例如以上的`@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})`、`@Retention(RetentionPolicy.RUNTIME)`、`@Documented`，则表示当前`@Bean`注解同时具有以上3个注解的特性。也就是说，`@Bean`注解相当于以上3个注解的同时，还具有自身的特性！

在`@Bean`注解内部，还有：

```java
/**
 * Alias for {@link #name}.
 * <p>Intended to be used when no other attributes are needed, for example:
 * {@code @Bean("customBeanName")}.
 * @since 4.3.3
 * @see #name
 */
@AliasFor("name")
String[] value() default {};
```

以上`String[] value() default {};`有点像接口中的抽象方法，但是，在注解中，这是声明的注解属性！`value`是属性名称，所以，在使用当前注解时，可以配置：

```java
@Bean(value=???)
```

以上源代码中的`String[]`看似是抽象方法的返回值，实则是`value`属性的值的数值类型！所以，可以配置为：

```java
@Bean(value={"a", "b", "c"})
```

以上源代码中的`default {}`表示该属性的默认值，所以，以下2段配置是完全等效的：

```java
@Bean
```

```java
@Bean(value={})
```

在配置注解属性时，如果属性名称是`value`，它是默认的属性，在配置时，可以不用显式的写出`value=`部分，也就是说，以下2段配置是完全等效的：

```java
@Bean(value={"a", "b", "c"})
```

```java
@Bean({"a", "b", "c"})
```

在配置注解属性时，如果属性的值的类型是数组类型，但是，当前只需要配置1个值时，可以不用写成数组格式，只需要写成数组元素的格式即可！也就是说，以下2段配置是完全等效的：

```java
@Bean({"a"})
```

```java
@Bean("a")
```

所以，总的来说，关于`@Bean`注解的`value`属性，如果需要配置的值是`"user"`，则以下4段代码都是完全等效的：

```java
@Bean("user")
```

```java
@Bean({"user"})
```

```java
@Bean(value="user")
```

```java
@Bean(value={"user"})
```

在以上源代码中，注释中还标明了`@since 4.3.3`，表示该属性从Spring框架4.3.3版本开始才加入的，如果当前使用的环境改为4.3.3以下的版本，将导致该属性不可用，因为在更低的版本中，根本就没有这个属性，甚至可能连个注解本身都不存在！

在以上源代码中，在`value`属性的声明之前还添加了`@AliasFor("name")`注解，表示当前`value`属性另有**别名**为`name`，所以，在`@Bean`注解的源代码中，还有：

```java
/**
 * The name of this bean, or if several names, a primary bean name plus aliases.
 * <p>If left unspecified, the name of the bean is the name of the annotated method.
 * If specified, the method name is ignored.
 * <p>The bean name and aliases may also be configured via the {@link #value}
 * attribute if no other attributes are declared.
 * @see #value
 */
@AliasFor("value")
String[] name() default {};
```

则在`@Bean`注解中，`name`和`value`这2个注解是完全等效的！

之所以存在2个完全等效的属性，是因为：

- `value`属性是默认的，在配置时可以不必显式的写出`value=`部分，配置时更加简单；
- `name`属性表现的语义更好，更易于根据源代码读懂程序的意思，在其它注解中，也可能存在与`value` 等效的属性。

需要注意的是：在配置注解中的属性时，如果需要配置的是`value`属性的值，可以不用显式的写出`value=`部分，**前提是当前注解只配置`value`这1个属性**！如果需要配置多个属性，则必须写出每一个属性名，例如：

```java
@Bean(value="user", initMethod="init")
```

而不能写成：

```java
@Bean("user", initMethod="init")	// 错误
```

## 3. 使用组件扫描后配置作用域与生命周期

在类的声明之前，添加`@Scope("prototype")`即可将当前类配置为“非单例”的对象！例如：

```java
package cn.tedu.spring;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

@Repository
@Scope("prototype")
public class User {

}
```

在单例的情况下，在类的声明之前添加`@Lazy`注解，就可以将对象配置为“懒加载”的模式：

```java
package cn.tedu.spring;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository
@Lazy
public class User {

}
```

如果需要配置当前类中的生命周期的处理，首先，还是需要在类中自定义2个方法，分别表示“初始化方法”和“销毁方法”，然后，在初始化方法之前添加`@PostConstruct`注解，在销毁方法之前添加`@PreDestroy`注解，例如：

```java
package cn.tedu.spring;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository
@Lazy
public class User {
	
	public User() {
		System.out.println("User.User()");
	}
	
	@PostConstruct
	public void init() {
		System.out.println("User.init()");
	}
	
	@PreDestroy
	public void destroy() {
		System.out.println("User.destroy()");
	}

}
```

注意：以上2个注解并不是Spring的注解，如果JRE环境版本太低，将无法识别以上2个注解，需要调整当前项目的JRE环境！

## 4. 关于Spring管理对象的小结

如果需要Spring管理某个类的对象，可以：

- 自定义方法，将方法的返回值类型设置为期望管理的类型，并在方法中返回匹配类型的对象，最后，在方法的声明之前添加`@Bean`注解；
- 设置组件扫描的包，并在类的声明之前添加`@Component` / `@Controller` / `@Service` / `@Repository`这4个注解中的某1个。

在实际使用时，大多采取第2种做法，但是，如果需要Spring管理的类并**不是自定义的类**，就只能采取第1种做法！

## 5. 关于Spring的解耦

在没有使用Spring框架的情况下，在项目中，各组件之间是存在依赖关系的，例如：

```java
// 处理用户登录请求的Servlet组件类
public class UserLoginServlet {
    private UserJdbcDao userDao = new UserJdbcDao();
    public void doPost() {
        userDao.login();
    }
}
```

```java
// 处理用户数据增删改查的组件
public class UserJdbcDao {
    public void login() {
        // 通过JDBC技术实现数据查询，判断用户名与密码是否正确
    }
}
```

以上代码就体现了类与类之前的**依赖**关系，具体表现就是`UserLoginServlet`是依赖于`UserJdbcDao`的！

如果直接依赖于某个类，将会导致**耦合度过高**的问题！

假设在`UserJdbcDao`中，是通过原生的JDBC技术实现数据访问的，后续，需要改为使用MyBatis框架技术来实现，则可能创建`UserMybatisDao`类，用于取代`UserJdbcDao`类！

如果需要替换，则项目中原有的以下代码：

```java
private UserJdbcDao userDao = new UserJdbcDao();
```

全部需要替换为：

```java
private UserMybatisDao userDao = new UserMybatisDao();
```

这种**替换时需要调整大量原有代码**的问题，就是**高耦合**的问题，我们希望的目标是**低耦合**，将原有**高耦合**的项目调整为**低耦合**的状态，就是**解耦**的做法！

可以将处理用户数据增删改查的相关操作声明在接口中，例如：

```java
public interface UserDao {
    void login();
}
```

然后，各个处理用户数据增删改查的类都去实现这个接口：

```java
public class UserJdbcDao implements UserDao {
    public void login() {
        // 通过JDBC实现处理用户登录
    }
}
```

```java
public class UserMybatisDao implements UserDao {
    public void login() {
        // 通过MyBatis框架技术实现处理用户登录
    }
}
```

后续，在各个Servlet组件中，就可以声明为接口类型：

```java
private UserDao userDao = new UserMybatisDao();
```

通过以上代码调整，就可以使得Servlet组件**依赖于接口**，而不再是**依赖于类**，从而实现了解耦！

另外，还可以通过设计模式中的工厂模式来生产对象，例如：

```java
public class UserDaoFactory {
    public static UserDao newInstance() {
        return new UserMybatisDao();
    }
}
```

当有了以上工厂后，原本在Servlet组件中声明持久层对象的代码就可以再调整为：

```java
private UserDao userDao = UserDaoFactory.newInstance();
```

至此，在项目中到底是使用`UserJdbcDao`还是使用`UserMybatisDao`，在以上代码都不会体现出来了，也就意味着当需要切换/替换时，以上代码是不需要修改的，而是修改`UserDaoFactory`工厂类的方法的返回值这1处即可！

所以，通过定义接口和创建工厂类就可以实现解耦，但是，在实际项目开发时，不可能为每一个组件都创建专门的工厂类，而Spring框架就可以当作是一个庞大的工厂，开发人员可以通过Spring框架的使用约定，将某些类的对象交给Spring框架进行管理，后续，在具体使用过程中，就不必自行创建对象，而是**获取**对象即可！

## 6. 自动装配

在Spring框架的应用中，可以为需要被Spring自动赋值的属性添加`@Autowired`，则Spring框架会从Spring容器中找出匹配的值，并自动完成赋值！这就是Spring框架的自动装配机制！

当Spring尝试为某个属性实现自动装配时，采取的模式主要有：

- `byName`：根据名称实现自动装配，在这种模式下，要求被装配的属性名称，与被Spring管理的对象的名称（调用`getBean()`方法给出的参数名）必须相同；
- `byType`：根据类型实现自动装配，在这种模式，要求被装配的属性的类型，在Spring容器中存在匹配类型的对象，当应用这种机制时，必须在Spring容器中保证匹配类型的对象只有1个，否则，将会出现`NoUniqueBeanDefinitionException`异常；

当使用`@Autowired`尝试自动装配时，Spring框架会先根据`byType`模式找出所有匹配类型的对象，如果匹配类型的对象的数量为0，也就是没有匹配类型的对象，默认情况下会直接报错，提示信息例如：

```
Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'cn.tedu.spring.UserDao' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {@org.springframework.beans.factory.annotation.Autowired(required=true)}
```

> 如果使用`@Autowired`时明确的配置为`@Autowired(required=false)`，当没有匹配类型的对象时，也不会因为装配失败而报错！

如果匹配类型的对象的数量为1，则直接装配；

如果匹配类型的对象的数量超过1个（有2个甚至更多个），会尝试`byName`来装配，如果存在名称匹配的对象，则成功装配，如果名称均不匹配，则装配失败，会提示如下错误：

```
Caused by: org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'cn.tedu.spring.UserDao' available: expected single matching bean but found 2: userJdbcDao,userMybatisDao
```

当需要自动装配时，除了使用`@Autowired`注解以外，还可以使用`@Resource`注解！

当使用`@Resource`注解尝试自动装配时，其工作原理是先尝试`byName`装配，如果存在名称匹配的对象，则直接装配，如果没有名称匹配的对象，则尝试`byType`装配。

另外，如果某个方法是被Spring调用的，还可以将需要装配的对象设置为方法的参数（不需要添加注解即可正常使用），Spring也可以实现方法参数的自动装配！例如：

```java
public void test(UserDao userDao) {}
```

## 7. 通过Spring框架读取.properties文件

首先，在案例的**src/main/resources**下创建**jdbc.properties**文件，并且，在文件中，添加一些自定义的配置信息：

```
url=jdbc:mysql://localhost:3306/db_name
driver=com.mysql.jdbc.Driver
username=root
password=1234
```

> 本次案例的目标是读取以上文件的信息，并不用于真实的连接某个数据库，所以，各属性的值可以不是真正使用的值！

如果要读取以上信息，可以将这些信息都读取到某个类的各个属性中去，则先创建一个类，并在类中声明4个属性（与以上**jdbc.properties**文件中的配置信息的数量保持一致）：

```java
package cn.tedu.spring;

public class JdbcConfig {
	
	private String url;
	private String driver;
	private String username;
	private String password;

}
```

然后，在类的声明之前，通过`@PropertySource`配置需要读取的配置文件：

```java
@PropertySource("classpath:jdbc.properties")
```

然后，在各个属性的声明之前，通过`@Value`注解读取配置信息中的值，并注入到属性中，其基本格式是`@Value("${配置文件中的属性名称}")`，例如：

```java
package cn.tedu.spring;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;

@PropertySource("classpath:jdbc.properties")
public class JdbcConfig {
	
	@Value("${url}")
	private String url;
	@Value("${driver}")
	private String driver;
	@Value("${username}")
	private String username;
	@Value("${password}")
	private String password;

    @Override
	public String toString() {
		return "JdbcConfig [url=" + url + ", driver=" + driver + ", username=" + username + ", password=" + password
				+ "]";
	}
    
}
```

由于期望的是由Spring读取配置文件，并为以上类的各个属性赋值，所以，以上`JdbcConfig`应该是被Spring管理的！所以，先使用一个类来配置组件扫描：

```java
package cn.tedu.spring;

import org.springframework.context.annotation.ComponentScan;

@ComponentScan("cn.tedu.spring")
public class SpringConfig {

}
```

然后，在`JdbcConfig`类的声明之前添加`@Component`注解即可！

**注意：在Windows操作系统中，如果配置文件中的属性名是`username`，则最终注入属性的值将不是配置文件中的值，而是当前登录Windows操作系统的用户名，为了避免出现此类问题，建议在配置文件中，每个属性的名称之前都添加一些自定义的前缀。**























