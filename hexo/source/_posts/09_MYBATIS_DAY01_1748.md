---
title: MyBatis01
tags: MyBatis
categories: 达内笔记
auto_open: false
copyright: false
---



## 1. MyBatis框架的作用

MyBatis框架的主要作用是简化持久层开发。当使用MyBatis处理数据的增删改查时，只需要定义访问数据的抽象方法，并配置该抽象方法对应的SQL语句即可！

持久层：解决项目中数据持久化处理的组件。

数据持久化：将数据永久的保存下来，即将数据存储在硬盘等可以永久保存数据的存储介质中，如果要将数据保存在这些存储介质中，数据需要以文件的形式存在，通常，可以将数据存到文本文档、XML文档、数据库，通常，在没有明确的说明的情况下，讨论数据持久化指的就是使用数据库存取数据。

内存（RAM，具体表现通常是内存条）：是CPU与其它硬件交换数据的“桥梁”，正在执行的程序和数据都在内存中，一旦断电则数据全部丢失。

## 2. 创建MyBatis项目

创建Maven项目，Group Id为`cn.tedu`，Artifact Id为`mybatis`，Packaging保持为`jar`即可。

然后，在项目中添加相关依赖：

```xml
<properties>
    <!-- java version -->
    <java.version>1.8</java.version>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <!-- dependency version -->
    <mybatis.version>3.5.4</mybatis.version>
    <mybatis.spring.version>2.0.5</mybatis.spring.version>
    <spring.version>5.2.7.RELEASE</spring.version>
    <mysql.version>8.0.12</mysql.version>
    <druid.version>1.1.23</druid.version>
    <junit.version>4.13</junit.version>
</properties>

<dependencies>
    <!-- MyBatis：mybatis -->
    <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>${mybatis.version}</version>
    </dependency>
    <!-- MyBatis整合Spring：mybatis-spring -->
    <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis-spring -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>${mybatis.spring.version}</version>
    </dependency>
    <!-- Spring：spring-context -->
    <!-- https://mvnrepository.com/artifact/org.springframework/spring-context -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <!-- Spring JDBC：spring-jdbc -->
    <!-- https://mvnrepository.com/artifact/org.springframework/spring-jdbc -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <!-- MySQL：mysql-connector-java -->
    <!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>${mysql.version}</version>
    </dependency>
    <!-- 连接池：druid -->
    <!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>${druid.version}</version>
    </dependency>
    <!-- 单元测试：junit -->
    <!-- https://mvnrepository.com/artifact/junit/junit -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>${junit.version}</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## 3. 连接数据库

首先，登录MySQL控制台，创建`tedu_ums`数据库：

```mysql
CREATE DATABASE tedu_ums;
```

然后，在项目中，在**src/main/resources**下创建**jdbc.properties**文件，用于配置连接数据库的相关信息：

```
spring.datasource.url=jdbc:mysql://localhost:3306/tedu_ums?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.initialSize=2
spring.datasource.maxActive=10
```

接下来，在项目的**src/main/java**下创建`cn.tedu.mybatis`包，并在这个包下创建`SpringConfig`类，在该类中声明属性以读取以上配置值：

```java
package cn.tedu.mybatis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;

@PropertySource("classpath:jdbc.properties")
public class SpringConfig {
	
	@Value("${spring.datasource.url}")
	private String url;
	@Value("${spring.datasource.driver-class-name}")
	private String driverClassName;
	@Value("${spring.datasource.username}")
	private String username;
	@Value("${spring.datasource.password}")
	private String password;
	@Value("${spring.datasource.initialSize}")
	private Integer initialSize;
	@Value("${spring.datasource.maxActive}")
	private Integer maxActive;
	
}
```

然后，继续添加方法，将以上读取到的信息用于配置`DataSource`对象，并将该对象交给框架处理：

```java
@Bean
public DataSource dataSource() {
    // 当前项目添加依赖时
    // 数据库连接池使用的是druid
    // 所以，此处创建DruidDataSource的对象
    // 如果以后改用其它数据库连接池
    // 则创建其它数据库连接池中的对象即可
    DruidDataSource ds = new DruidDataSource();
    ds.setUrl(url);
    ds.setDriverClassName(driverClassName);
    ds.setUsername(username);
    ds.setPassword(password);
    ds.setInitialSize(initialSize);
    ds.setMaxActive(maxActive);
    return ds;
}
```

> 注意：使用DataSource时，导包必须导javax.sql包中的接口。

接下来，在**src/test/java**下创建`cn.tedu.mybatis`包，并在这个包中创建`Tests`测试类，在类中添加测试方法：

```java
package cn.tedu.mybatis;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Tests {
	
	// 关于4.x系列单元测试方法的声明：
	// 1. 必须添加@Test注解；
	// 2. 必须使用public权限；
	// 3. 必须使用void作为返回值类型；
	// 4. 必须保持空参数列表（不允许有参数）
	@Test
	public void contextLoads() {
		System.out.println("Tests.contextLoads()");
	}
	
	@Test
	public void getConnection() throws SQLException {
		AnnotationConfigApplicationContext ac
			= new AnnotationConfigApplicationContext(SpringConfig.class);
		
		DataSource dataSource = ac.getBean("dataSource", DataSource.class);
		
		Connection conn = dataSource.getConnection();
		System.out.println(conn);
		
		ac.close();
	}

}
```

如果以上单元测试可以正常通过，则表示连接数据库的相关配置均正确，后续，框架就可以通过以上配置的对象自动连接到数据库。

## 4. 创建数据表

在`tedu_ums`数据库中创建`t_user`数据表：

```mysql
CREATE TABLE t_user (
	id int AUTO_INCREMENT,
    username varchar(20) NOT NULL UNIQUE,
    password varchar(20) NOT NULL,
    age int,
    phone varchar(20),
    email varchar(30),
    PRIMARY KEY (id)
) DEFAULT CHARSET=utf8mb4;
```

## 5. 插入数据

### 5.1. 定义抽象方法

当使用MyBatis框架处理增删改查时，抽象方法必须定义在接口中，通常，接口的名称建议使用`Mapper`作为最后一个单词。

在`cn.tedu.mybatis`包中创建`UserMapper`接口，这个接口就专门用于声明访问“用户”数据表中的数据：

```java
public interface UserMapper {}
```

然后，在接口中声明“插入用户数据”的抽象方法，关于抽象方法的声明：

- 【返回值】如果需要执行的数据操作是增、删、改类型的，则使用`Integer`作为返回值类型，表示受影响的行数，其实，也可以使用`void`作为返回值类型，表示“不关心受影响的行数”，但是，不建议这么做；如果需要执行的数据操作是查询，则设计为所期望的类型即可，当然，该类型需要能够将查询到的数据封装进去；
- 【方法名称】自定义；
- 【参数列表】根据需要执行的SQL语句中的参数来决定。

当需要执行“插入用户数据”操作时，需要执行的SQL语句大致是：

```mysql
INSERT INTO t_user (username, password, age, phone, email) VALUES (?,?,?,?,?)
```

可以将以上SQL语句中的参数全部声明到抽象方法的参数列表中，例如：

```java
Integer insert(String username, String password, Integer age, String phone, String email);
```

或者，也可以将SQL语句中的参数全部声明到某个实体类，然后使用实体类作为抽象方法的参数，例如在`cn.tedu.mybatis`包下创建`User`类：

```java
package cn.tedu.mybatis;

public class User {

	private Integer id;
	private String username;
	private String password;
	private Integer age;
	private String phone;
	private String email;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

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
		return "User [id=" + id + ", username=" + username + ", password=" + password + ", age=" + age + ", phone="
				+ phone + ", email=" + email + "]";
	}

}
```

然后，设计抽象方法为：

```java
Integer insert(User user);
```

目前，MyBatis框架并不知道接口文件的位置，就更加无法使用自定义的抽象方法，必须在配置类的声明之前添加`@MapperScan`注解，以指定接口文件所在的包！

### 5.2. 配置SQL语句

在接口的抽象方法的声明之前，根据需要执行的SQL语句的种类，选择使用`@Insert` / `@Delete` / `@Update` / `@Select`这4个当中的某个注解，当前已经添加的抽象方法`Integer insert(User user);`需要执行的是`INSERT`类型的SQL语句，则需要使用`@Insert`注解！

然后，在注解中，配置字符串类型的参数，该参数就是需要执行的SQL语句，在SQL语句中，所有的参数都使用`#{}`格式的占位符，在占位符的大括号内是参数`User`类的属性名：

```java
@Insert("INSERT INTO t_user (username, password, age, phone, email) VALUES (#{username}, #{password}, #{age}, #{phone}, #{email})")
Integer insert(User user);
```

最后，还需要在配置类中配置`SqlSessionFactoryBean`的对象，为该对象设置数据源，使得MyBatis框架能够自动获取数据库连接，并完成数据访问！所以，在`SpringConfig`类中添加：

```java
@Bean
public SqlSessionFactoryBean sqlSessionFactoryBean(DataSource dataSource) {
    SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
    bean.setDataSource(dataSource);
    return bean;
}
```

最后，在**src/test/java**的`cn.tedu.mybatis`包下创建`UserMapperTests`测试类，并测试以上方法：

```java
package cn.tedu.mybatis;

import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class UserMapperTests {
	
	@Test
	public void insert() {
		AnnotationConfigApplicationContext ac
			= new AnnotationConfigApplicationContext(SpringConfig.class);
		
		UserMapper userMapper 
			= ac.getBean("userMapper", UserMapper.class);
		
		User user = new User();
		user.setUsername("spring");
		user.setPassword("1234");
		user.setAge(26);
		user.setPhone("1380138000");
		user.setEmail("root@baidu.com");
		Integer rows = userMapper.insert(user);
		System.out.println("rows=" + rows);
		
		ac.close();
	}

}
```

### 5.3. 获取自动编号的ID值

在抽象方法的上方，补充添加`@Options`注解并进行配置，使得可以获取自动编号的ID值，例如：

```java
@Insert("INSERT INTO t_user (username, password, age, phone, email) VALUES (#{username}, #{password}, #{age}, #{phone}, #{email})")
@Options(useGeneratedKeys=true, keyProperty="id")
Integer insert(User user);
```

以上在`@Options`注解中，配置的`useGeneratedKeys=true`表示“需要获取自动生成的值”，`keyProperty`表示将获取到的ID值放到参数对象的`id`属性中去！

## 6. 根据id删除用户数据

需要执行的SQL语句大致是：

```mysql
DELETE FROM t_user WHERE id=?
```

先在`UserMapper`接口中添加抽象方法：

```java
Integer deleteById(Integer id);
```

然后，在抽象方法的声明之前添加`@Delete`注解来配置SQL语句：

```java
@Delete("DELETE FROM t_user WHERE id=#{id}")
```

最后，编写并执行单元测试：

```java
@Test
public void deleteById() {
    AnnotationConfigApplicationContext ac
        = new AnnotationConfigApplicationContext(SpringConfig.class);

    UserMapper userMapper 
        = ac.getBean("userMapper", UserMapper.class);

    Integer id = 1;
    Integer rows = userMapper.deleteById(id);
    System.out.println("rows=" + rows);

    ac.close();
}
```

## 7. 将所有用户的密码全部改为某个值

需要执行的SQL语句大致是：

```mysql
UPDATE t_user SET password=?
```

先在`UserMapper`接口中添加抽象方法：

```java
Integer updatePassword(String password);
```

然后，在抽象方法的声明之前添加`@Update`注解来配置SQL语句：

```java
@Update("UPDATE t_user SET password=#{password}")
```

最后，编写并执行单元测试：

```java
private UserMapper userMapper;
private AnnotationConfigApplicationContext ac;

@Before
public void doBefore() {
    ac = new AnnotationConfigApplicationContext(SpringConfig.class);
    userMapper = ac.getBean("userMapper", UserMapper.class);
}

@After
public void doAfter() {
    ac.close();
}

@Test
public void updatePassword() {
    String password = "88888888";
    Integer rows = userMapper.updatePassword(password);
    System.out.println("rows=" + rows);
}
```

注意：当单元测试经过以上调整后，每个测试方法中都不用再执行`doBefore()`和`doAfter()`方法中的代码了，在每次执行`@Test`注解的测试方法之前，都会自动调用`@Before`注解的方法，并且，在执行`@Test`注解的测试方法之后，还会自动调用`@After`注解的方法！

## 8. 统计当前用户表中用户的数量

```java
@Select("SELECT COUNT(*) FROM t_user")
Integer count();
```

## 9. 根据id查询某用户的详情

```java
@Select("SELECT * FROM t_user WHERE id=#{id}")
User findById(Integer id);
```

注意：当查询某1条数据，且没有匹配的查询结果时，将返回`null`。

## 10. 查询所有用户的信息

```java
@Select("SELECT * FROM t_user ORDER BY id")
List<User> findAll();
```

















