---
title: Spring03
tags: 
- Spring
categories: 达内笔记
copyright: false
description: 笔记来源达内
---



## 1. 通过Environment读取.properties配置文件

假设在**src/main/resources**下存在**jdbc.properties**文件，并且，在该文件中存在若干条配置信息，如果需要读取该文件中的配置信息，可以先创建某个类，在类中声明`Environment`接口类型的对象，通过自动装配的方式为该类型对象注入值：

```java
package cn.tedu.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:jdbc.properties")
public class JdbcConfig {
	
	@Autowired
	private Environment environment;

	public Environment getEnvironment() {
		return environment;
	}

	public void setEnvironment(Environment environment) {
		this.environment = environment;
	}

}
```

后续，需要读取配置文件中的值时，从以上类中获取`Environment`类型的对象，然后，调用该对象的`getProperty()`方法即可获取对应的值，例如：

```java
package cn.tedu.spring;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.core.env.Environment;

public class Demo {

	public static void main(String[] args) {
		AnnotationConfigApplicationContext ac
			= new AnnotationConfigApplicationContext(SpringConfig.class);
		
		JdbcConfig jdbcConfig = ac.getBean("jdbcConfig", JdbcConfig.class);
		
		Environment environment = jdbcConfig.getEnvironment();
		System.out.println(environment.getProperty("db.url"));
		System.out.println(environment.getProperty("db.driver"));
		System.out.println(environment.getProperty("db.username"));
		System.out.println(environment.getProperty("db.password"));
		
		ac.close();
	}

}
```

## Spring阶段小结

- 【理解】Spring框架的主要作用：创建对象，管理对象；
- 【理解】Spring框架深层的作用：解耦；
- 【掌握】通过Spring框架创建对象：
  - 在某个类中自定义方法，方法的返回值类型就是需要Spring框架创建对象的类型，在方法体中自行返回所需要创建的对象，并且为方法添加`@Bean`注解，后续，只要Spring框架加载这个类，就会自动调用被添加了`@Bean`注解的方法，并管理方法所返回的对象。通常，当需要管理的对象所归属的类不是自定义的，必须使用这种做法；
  - 使得Spring框架执行组件扫描，保证相关的类在组件扫描的包或其子孙包中，并且，类还需要添加`@Component` / `@Controller` / `@Service` / `@Repository`注解中的某1个。通常，当需要管理的对象所归属的类是自定义的，优先使用这种做法。
- 【掌握】关于组件扫描：可以将组件扫描的包的名称作为字符串参数直接应用于`AnnotationConfigApplicationContext`类的构造方法中，但是，并不推荐使用这种做法，在实际项目开发时，`AnnotationConfigApplicationContext`类通常不是开发人员自行创建的，也就没有办法在构造方法中添加包的名称！推荐使用自定义的类作为配置类，并结合`@ComponentScan`注解来配置组件扫描；
- 【理解】被Spring管理的对象默认是单例的（注意：Spring框架不是设计模式中的单例模式，只是管理对象的方法是这样的），并且，不是懒加载的模式（相当于单例模式中的饿汉式单例的效果）；
- 【了解】使用`@Scope`和`@Lazy`调整被Spring管理的对象的作用域；
- 【理解】被Spring管理的对象的生命周期；
- 【了解】配置对象的生命周期：
  - 如果使用的是添加了`@Bean`注解的自定义方法返回对象的做法，在`@Bean`注解中配置`initMethod`和`destroyMethod`属性，就可以将类中的方法分别指定为初始化方法和销毁方法；
  - 如果使用的是组件扫描和组件注解的做法，在类中的初始化方法之前添加`@PostConstruct`注解，在销毁方法之前添加`@PreDestroy`方法。

- 【理解】关于Spring框架的DI与IoC：
  - DI：Dependency Injection，依赖注入，具体的表现就是“为当前类对象所依赖的某个属性注入值”；
  - IoC：Inversion of Control：控制反转，在传统模式下，是由开发人员自行创建对象（例如`User user = new User();`）且管理对象（例如`user.setName("Jack");`），可以理解为开发人员具有对象的控制权，当使用了Spring框架后，创建对象和管理对象的权力就交给了框架。
  - 在Spring框架中，DI是一种做法，IoC是最终实现的效果，也就是“Spring框架通过DI这种做法实现了IoC的效果”。
- 【理解】Spring框架自动装配机制的2种装配模式：
  - `byName`：根据名称实现自动装配，在这种模式下，要求被装配的属性名称，与被Spring管理的对象的名称（调用`getBean()`方法给出的参数名）必须相同；
  - `byType`：根据类型实现自动装配，在这种模式，要求被装配的属性的类型，在Spring容器中存在匹配类型的对象，当应用这种机制时，必须在Spring容器中保证匹配类型的对象只有1个，否则，将会出现`NoUniqueBeanDefinitionException`异常；
- 【理解】使用`@Autowired`和`@Resource`这2个注解实现自动装配时的区别：
  - 使用`@Autowired`尝试自动装配时，Spring框架会先根据`byType`模式找出所有匹配类型的对象，如果匹配类型的对象的数量为0，也就是没有匹配类型的对象，默认情况下会直接报错（如果明确的配置为`@Autowired(required=false)`时不会因为装配失败而出错）；如果匹配类型的对象的数量为1，则直接装配；如果匹配类型的对象的数量超过1个（有2个甚至更多个），会尝试`byName`来装配，如果存在名称匹配的对象，则成功装配，如果名称均不匹配，则装配失败。
  - 使用`@Resource`注解尝试自动装配时，其工作原理是先尝试`byName`装配，如果存在名称匹配的对象，则直接装配，如果没有名称匹配的对象，则尝试`byType`装配。

- 【掌握】通过Spring框架读取**.properties**配置文件中的信息：
  - 在组件类的声明之前添加`@PropertySource`注解，以配置需要读取的**.properties**文件的位置，然后，通过`@Value`注解将读取到的属性值一一注入到类的属性中，在声明类的属性时，只要该属性的类型是常规类型（例如基本数据类型、`String`等）或Spring框架自定义的类型，都可以将类的属性直接声明为所期望的类型；
  - 在组件类的声明之前添加`@PropertySource`注解，以配置需要读取的**.properties**文件的位置，然后，在类中自定义`Environment`接口类型的对象，通过`@Autowired`为该对象自动装配值，后续，调用该对象的`getProperty()`方法即可获取在**.properties**文件中配置的属性值。
- 【说明】关于Spring AOP会在项目后期再讲。

























