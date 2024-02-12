---
title: MyBatis03
tags: MyBatis
categories: 达内笔记
auto_open: false
copyright: false
---



## 1. 通过查询时自定义别名的方式解决名称不一致而导致的无法封装数据的问题

假设，向用户组数据表(`t_group`)表中插入一些测试数据：

```mysql
INSERT INTO t_group (name) VALUES ('超级管理员'), ('VIP用户'), ('普通用户');
INSERT INTO t_group (name) VALUES ('禁用用户');
```

接下来，就应该在用户数据表(`t_user`)中添加新的字段，用于记录每个用户归属于哪个组：

```mysql
ALTER TABLE t_user ADD COLUMN group_id int;
```

然后，为现有的数据分配组：

```mysql
UPDATE t_user SET group_id=1 WHERE id IN (11);
UPDATE t_user SET group_id=2 WHERE id IN (9, 10);
UPDATE t_user SET group_id=3 WHERE id IN (2, 6, 13);
```

当用户数据表添加了新的字段以后，在项目中的`User`类也应该添加新的属性：

```java
package cn.tedu.mybatis;

public class User {

	private Integer id;
	private String username;
	private String password;
	private Integer age;
	private String phone;
	private String email;
	private Integer groupId;
    
    // Setters & Getters
    // toString()
    
}
```

当再次尝试查询数据时，会发现查询到的结果中，每条数据的`groupId`值均为`null`，其实这些数据在数据库中都是有值的，只是当前的查询功能并没有把它们查出来而已！

**MyBatis在处理查询时，会自动的将名称匹配的数据进行封装，其要求是查询结果的列名与封装结果的类的属性名相同**（其实是要求属性的SET方法与之保持一致），如果名称不相同，则无法自动装配对应的数据！

> Field：字段，在设计数据表时定义的名称；
>
> Column：列，在查询结果中，每个数据的名称就是列名；
>
> Property：属性，在类中声明的全局变量；

在查询时，默认情况下，列名就是字段名，但是，在查询的SQL语句中，可以自定义别名，例如：

```mysql
SELECT id,username,password,age,phone,email,group_id groupId FROM t_user ORDER BY id
```

则配置为：

```xml
<select id="findAll" resultType="cn.tedu.mybatis.User">
    SELECT 
        id, username, password, age, phone, email,
        group_id AS groupId 
    FROM 
        t_user 
    ORDER 
        BY id
</select>
```

## 2. 使用resultMap节点解决名称不一致而导致的无法封装数据的问题

在没有自定义别名的情况下，如果查询结果的列名与类的属性名不一致，还可以自定义`<resultMap>`节点进行配置，该节点的作用就是指导MyBatis封装查询到的数据！

```xml
<!-- id：自定义的名称，将应用于select节点的resultMap属性 -->
<!-- type：封装查询结果的数据类型 -->
<resultMap id="UserMap" type="cn.tedu.mybatis.User">
    <!-- result节点：将查询结果中column列对应的值封装到类的property属性中去 -->
    <result column="id" property="id"/>
    <result column="username" property="username"/>
    <result column="password" property="password"/>
    <result column="age" property="age"/>
    <result column="phone" property="phone"/>
    <result column="email" property="email"/>
    <result column="group_id" property="groupId"/>
</resultMap>

<select id="findById" resultMap="UserMap">
    SELECT
        *
    FROM 
        t_user 
    WHERE 
        id=#{id}
</select>
```

在以上配置中，需要注意：`<resultMap>`节点中的`id`属性值就是`<select>`节点的`resultMap`属性值！

如果需要执行的查询操作是单表数据查询，在配置`<resultMap>`时，对于那些列名与属性名一致的，可以不作配置！

在配置`<resultMap>`时，推荐在子级使用`<id>`节点配置主键，然后使用`<result>`节点配置其它的，便于实现缓存！MyBatis有2级缓存，其中，MyBatis的1级缓存是SqlSession缓存，开发人员无法干预，2级缓存是namespace缓存，一旦开启，默认情况下，将作用于整个XML文件，需要事先在当前XML文件中添加`<cache></cache>`节点，表示“启用缓存”，理启用缓存，需要封装查询结果的数据类型是实现了`Serializable`接口的，如果某个查询不需要使用缓存，还可以在`<select>`节点中配置`useCache="false"`，然后，就不需要开发人员进行其它配置了，MyBatis会自动处理缓存的数据，并且，一旦当前namespace执行了增删改类型的操作，就会重建缓存！

**小结**：在SQL中使用自定义别名，并在`<select>`中使用`resultType`指定封装结果的数据类型，或在SQL中使用星号表示字段列表，并配置`<resultMap>`节点后在`<select>`中使用`resultMap`，均可解决由于名称不一致导致无法封装查询结果的问题。

## 3. 一对一的关联查询

假设存在需求：根据id查询某用户的数据，并且，要求查出该用户归属的用户组的名称。

如果要根据id查询某用户的数据，需要执行的SQL语句大致是：

```mysql
SELECT * FROM t_user WHERE id=?
```

如果还要查出该用户归属的组的名称，需要关联`t_group`数据表一起查询：

```mysql
SELECT * FROM t_user LEFT JOIN t_group ON t_user.group_id=t_group.id WHERE id=?
```

由于以上关联条件就是`t_user.group_id=t_group.id`，结合使用星号作为字段列表，所以，在查询结果中，一定存在`group_id`和其后的`id`字段值一模一样的问题！由于有2个字段的值一定完全相同，则应该明确的指定需要查询的字段列表：

```mysql
SELECT 
	t_user.*,
	t_group.name 
FROM 
	t_user 
LEFT JOIN 
	t_group 
ON 
	t_user.group_id=t_group.id 
WHERE 
	t_user.id=?
```

在使用MyBatis框架尝试实现功能时，目前并没有任何实体类可以封装以上查询的结果，因为实体类的属性设计是要求与数据表保持对应的，而此处需要执行的查询涉及2张表！则需要创建VO类（Value Object类）来封装此次查询的结果：

```java
public class UserVO {
    
    private Integer id;
    private String username;
    private String password;
    private Integer age;
    private String phone;
    private String email;
    private Integer groupId;
    private String groupName;
    
	// Setters & Getters
    // toString()
    
}
```

> 实体类中的属性需要与数据表相对应；
>
> VO类中的属性需要与查询结果相对应；
>
> 除此以外，这2种类的写法是一样的，只是定位不同。

开发抽象方法：

```java
UserVO findVOById(Integer id);
```

配置SQL映射：

```xml
<select id="findVOById" resultType="cn.tedu.mybatis.UserVO">
    SELECT 
        t_user.id, username, password, age, phone, 
    	email, group_id AS groupId,
        t_group.name AS groupName
    FROM 
        t_user 
    LEFT JOIN 
        t_group 
    ON 
        t_user.group_id=t_group.id 
    WHERE 
        t_user.id=#{id}
</select>
```

完成后，测试：

```java
@Test
public void findVOById() {
    Integer id = 10;
    UserVO user = userMapper.findVOById(id);
    System.out.println(user);
}
```

## 4. 一对多的关联查询

假设存在需求：根据id查询某个用户组的信息，并且，还查出该组有哪些用户，最终，把这些用户的信息也显示出来！

需要执行的SQL语句大致是：

```mysql
SELECT
	*
FROM 
	t_group
LEFT JOIN
	t_user
ON
	t_group.id=t_user.group_id
WHERE
	t_group.id=1
```

当查询后，需要使用一个新的VO类来封装此次的查询结果，则创建`GroupVO`类：

```java
public class GroupVO {
    
    private Integer id;
    private String name;
    private List<User> users;
    
    // Setters & Getters
    // toString()
    
}
```

在一对多的查询中，MyBatis根本就不知道怎么封装查询结果中的数据！当没有匹配的查询结果，或只有1条查询结果时，并不会报错，只是查询结果的数据不正确而已，如果查询结果有多条，则会出现如下错误信息：

```
Caused by: org.apache.ibatis.exceptions.TooManyResultsException: Expected one result (or null) to be returned by selectOne(), but found: 2
```

为了保障能够正确的封装查询结果，**必须**使用`<resultMap>`来指导MyBatis封装！并且，在SQL语句中，还需要为某个`id`定义别名，以保证查询结果每一列的名称都不同，否则，MyBatis只会从相同的列名中排列靠前的那一列中取数据，甚至，如果在`<resultMap>`中使用`<id>`配置主键，当出现多条数据的最靠前的那一列id值相同时，重复id的数据将不会被封装！

具体配置如下：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
  
<mapper namespace="cn.tedu.mybatis.GroupMapper">

	<resultMap id="GroupVOMap" type="cn.tedu.mybatis.GroupVO">
		<id column="gid" property="id" />
		<result column="name" property="name"/>
		<!-- collection节点：用于配置1对多的属性 -->
		<!-- ofType属性：集合元素类型 -->
		<collection property="users"
			ofType="cn.tedu.mybatis.User">
			<id column="id" property="id"/>
			<result column="username" property="username"/>
			<result column="password" property="password"/>
			<result column="age" property="age"/>
			<result column="phone" property="phone"/>
			<result column="email" property="email"/>
			<result column="group_id" property="groupId"/>
		</collection>
	</resultMap>

	<select id="findVOById" resultMap="GroupVOMap">
		SELECT
			t_group.id AS gid, name,
			t_user.*
		FROM 
			t_group
		LEFT JOIN
			t_user
		ON
			t_group.id=t_user.group_id
		WHERE
			t_group.id=#{id}
	</select>

</mapper>
```

注意：在配置一对多的查询时，在`<resultMap>`中，即使存在列名与属性名完全相同的数据，也必须通过`<id>`或`<result>`节点进行配置！

## 5. MyBatis阶段小结

- 【理解】MyBatis框架的主要作用是简化持久层开发；
- 【了解】使用MyBatis时的必要配置：
  - 添加依赖：`mybatis` / `mybatis-spring` / `spring-context` / `spring-jdbc` / `mysql-connector-java`(也可以是其它数据库连接jar包，根据实际情况选取) / `druid`(也可以是其它数据库连接池)；
  - 配置连接数据库的信息，例如url、driver-class-name等；
  - 配置XML文件的位置（如果使用XML配置SQL语句）；
  - 使用配置类，读取连接数据库的信息，用于配置`DataSource`；配置`SqlSessionFactoryBean`；在配置类的声明之前使用`@MapperScan`注解配置接口文件所在的包；
- 【掌握】抽象方法的声明原则
  - 【返回值类型】如果需要执行的操作是`INSERT`、`DELETE`、`UPDATE`类型的操作，使用`Integer`作为返回值类型，表示“受影响的行数”，也可以使用`void`但不推荐；如果需要执行操作是`SELECT`类型，使用期望的数据类型作为返回值类型，只需要保证该类型能够封装查询结果即可；
  - 【方法名称】自定义，但不允许重载；
  - 【参数列表】根据需要执行的SQL语句中的参数来设计，可以将所需的参数逐一的添加到抽象方法的参数列表中，也可以使用封装的类型作为参数，当抽象方法的参数超过1个（例如2个或更多个），必须（应该）为每个参数添加`@Param`注解并配置参数名称。
- 【掌握】配置抽象方法对应的SQL语句
  - 可以在抽象方法的声明之前使用`@Insert`、`@Delete`、`@Update`、`@Select`节点配置SQL语句，这种做法不推荐用于篇幅较长的SQL语句，或配置较多的功能；
  - 配置SQL语句的XML文件必须在配置指定的文件夹中；
  - 每个XML文件的根节点是`<mapper>`，其中的`namespace`属性是对应的接口的全名；
  - 在XML文件的子级通过`<insert>`、`<delete>`、`<update>`、`<select>`节点配置SQL语句，每个节点都必须配置`id`属性，取值为抽象方法的名称；
  - 如果插入数据后需要获取自动编号的id值，需要在`<insert>`节点配置`useGeneratedKeys`和`keyProperty`属性；
  - 在`<select>`节点中，必须配置`resultType`以指定抽象方法的返回值类型，或配置`resultMap`用于指导MyBatis封装查询结果，这2个属性必须配置其中的1个；

- 【理解】关于`#{}`和`${}`格式的占位符的使用情景和区别；
- 【掌握】动态SQL的`<foreach>`的使用；
- 【了解】动态SQL的`<if>`和`<choose>`系列节点的使用；
- 【掌握】解决因为名称不一致导致MyBatis无法自动封装查询结果的问题
  - 当自定义字段列表时，自定义别名，使得名称保持一致，并且，在`<select>`节点中使用`resultType`即可；
  - 当使用星号表示字段列表时，配置`<resultMap>`以指导MyBatis封装，并且，在`<select>`节点中使用`resultMap`应用配置的`<resultMap>`。
- 【理解】实体类与VO类的区别；
- 【掌握】一对多的关联查询及相关配置（例如`<resultMap>`中的`<collection>`子节点）；
- 【了解】缓存的基本概念；
- 【理解】什么情况下需要使用`<resultMap>`：
  - 查询时，存在名称不匹配的问题，且使用星号表示字段列表；
  - 【必须】配置1对多的查询；
- 【理解】什么情况下需要自定义别名：
  - 查询时，存在名称不匹配的问题，且不使用`resultMap`，则需要自定义别名；
  - 【必须】关联查询时，存在多个名称相同的列，则需要自定义别名，使得这些列名不同。

## 6. 作业

要求用户可以通过注册页面提交注册数据，最终，注册成功后，数据将写入到`t_user`表中。

- 要求用户名必须唯一，如果尝试注册的用户名已经被占用，应该给出错误提示，在持久层，应该至少开发`Integer insert(User user)`和`User findByUsername(String username)`方法，在用户尝试注册时，应该先通过`findByUsername()`检查用户名是否已经被占用（如果找到数据，则表示已被占用，如果找不到数据，则表示未被占用），再决定执行`insert()`或直接报错。

- 关于控制器中调用持久层方法，大致代码如下：

  - ```java
    @Controller
    @RequestMapping("user")
    public class UserController {
        
        // 如果使用IDEA，可能报错，配置为@Autowired(required=false)即可
        @Autowired
        private UserMapper userMapper;
        
        @RequestMapping("reg.do")
        public String reg(User user) {
            // 直接调用全局的userMapper即可访问持久层
        }
        
    }
    ```

如果时间充裕，再做一个登录功能。

如果已经完成，复习SSM框架，复习JSON，复习Vue。







