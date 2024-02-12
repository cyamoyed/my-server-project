---
title: MyBatis02
tags: MyBatis
categories: 达内笔记
auto_open: false
copyright: false
---



## 1. 使用XML文件配置SQL语句

首先下载`http://doc.canglaoshi.org/config/Mapper.xml.zip`，解压得到**SomeMapper.xml**。

在项目的**src/main/resources**下创建**mappers**文件夹，并将**SomeMapper.xml**复制到该文件夹，并重命名为**UserMapper.xml**。

> 此步骤中创建的文件夹的名称是自定义的，与后续的配置有关。
>
> 此步骤中XML文件的名称是自定义的，与其它任何配置都无关。

以上添加的**UserMapper.xml**就是用于配置SQL语句的文件，通常称之为**映射文件**！该文件中的以下代码是固定的，且不可缺少的：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
```

该文件的根节点是`<mapper>`节点，必须配置`namespace`的属性，该属性的值是对应的MyBatis接口文件的全名，例如：

```xml
<mapper namespace="cn.tedu.mybatis.UserMapper">
</mapper>
```

接下来，根据需要执行的SQL语句的种类，选择使用`<insert>`、`<delete>`、`<update>`、`<select>`这4个节点中的某1个来配置SQL语句，这些节点都必须配置`id`属性，该属性的值就是接口中的抽象方法的名称，然后，在节点内部编写SQL语句即可：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
  
<!-- namespace属性：接口的全名 -->
<mapper namespace="cn.tedu.mybatis.UserMapper">

	<!-- id属性：抽象方法的名称 -->
	<insert id="insert">
		INSERT INTO t_user (
			username, password, age, phone, email
		) VALUES (
			#{username}, #{password}, #{age}, #{phone}, #{email}
		)
	</insert>

</mapper>
```

目前，MyBatis框架并不知道存在**mappers**文件夹，更加不知道哪个文件配置的SQL语句！可以将配置SQL语句的XML文件的位置配置在**jdbc.properties**中：

```
mybatis.mapper-locations=classpath:mappers/*.xml
```

以上代码就用于表示“在**src/main/resouces**下的**mappers**文件夹中的所有XML文件都是用于配置SQL语句的”，在后续使用时，也必须保证不会在**mappers**文件夹中添加其它作用的XML文件！

接下来，还应该读取以上配置信息：

```java
@Value("${mybatis.mapper-locations}")
private Resource[] mapperLocations;
```

并应用于`SqlSessionFactoryBean`对象的属性中：

```java
@Bean
public SqlSessionFactoryBean sqlSessionFactoryBean(DataSource dataSource) {
    SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
    bean.setDataSource(dataSource);
    bean.setMapperLocations(mapperLocations);
    return bean;
}
```

最后，在运行或测试之前，还需要注意：每个抽象方法只能通过1种方式配置SQL语句，要么使用注解，要么使用XML文件，不可以同时使用！否则将报错，错误提示的关键信息例如：

```
Caused by: java.lang.IllegalArgumentException: Mapped Statements collection already contains value for cn.tedu.mybatis.UserMapper.insert. please check file [D:\eclipse-workspace-202003\mybatis\target\classes\mappers\UserMapper.xml] and cn/tedu/mybatis/UserMapper.java (best guess)
```

以上提示中的`Mapped Statements collection already contains value for cn.tedu.mybatis.UserMapper.insert.`就表示“`cn.tedu.mybatis.UserMapper.insert`方法被映射了多个SQL语句的配置”，并且还推荐了检查**UserMapper.xml**和**UserMapper.java**文件！

如果配置的是`<insert>`节点，且需要获取自动编号的ID值，则在`<insert>`节点中继续配置属性即可，例如：

```xml
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO t_user (
        username, password, age, phone, email
    ) VALUES (
        #{username}, #{password}, #{age}, #{phone}, #{email}
    )
</insert>
```

当需要实现的数据访问是查询类型的，在`<select>`节点中必须配置`resultType`或`resultMap`中的某1个属性（二选一），如果都没有指定，则会出现如下错误：

```
Caused by: org.apache.ibatis.executor.ExecutorException: A query was run and no Result Maps were found for the Mapped Statement 'cn.tedu.mybatis.UserMapper.count'.  It's likely that neither a Result Type nor a Result Map was specified.
```

其中，`resultType`指的就是“封装查询结果的数据的类型”，也可以理解为“抽象方法的返回值的类型”，例如可以配置为：

```xml
<select id="count" resultType="java.lang.Integer">
	SELECT COUNT(*) FROM t_user
</select>
```

如果某个查询的抽象方法的返回值是`List`集合类型的，例如：

```java
List<User> findAll();
```

在配置`<select>`的`resultType`属性时，该属性值必须是集合中的元素的类型，例如：

```xml
<select id="findAll" resultType="cn.tedu.mybatis.User">
    SELECT * FROM t_user ORDER BY id
</select>
```

至于`resultMap`属性，后面专门介绍。

注意：使用了这种做法后，就需要对抽象方法名称的定义增加一个要求“不允许重载”！

## 2. 关于多参数的问题

当抽象方法的参数列表中超过1个参数时，在配置SQL语句时直接使用`#{参数名称}`是无法访问到参数值的！

因为Java源文件在运行之前需要被编译成字节码文件（.class文件），编译时，会丢失所有局部的量的名称，所以，会导致运行时原有的“参数名称”无法使用的问题！

MyBatis允许使用`arg`作为前缀并添加从`0`开始编号的名称（例如`arg0`、`arg1`等等）表示第?个参数的名称，后续，在配置SQL语句时，就可以通过例如`#{arg0}`来表示抽象方法的第1个参数的值，使用`#{arg1}`表示抽象方法的第2个参数的值……以此类推！另外，还可以使用`param`作为前缀并添加从`1`开始编号的名称（例如`param1`、`param2`等等），在具体使用时，使用`arg`系列的名称和`param`系列的名称均可！

但是，使用`arg`和`param` 系列的名称不便于表示语义，并且，当抽象方法的参数列表发生变化时，这些名称中的序号也可能需要调整！

MyBatis提供了`@Param`注解，这个注解是添加在抽象方法的各参数之前的，可以在该注解中指定名称，后续，在配置SQL语句时，占位符中就使用注解中配置的名称！

## 2. 练习

- 在`tedu_ums`数据库中创建`t_group`表，用于存储“用户分组”的信息，该表需要有`id`和`name`这2个字段，分别表示“组id”和“组名称”；

  - ```mysql
    CREATE TABLE t_group (
    	id int AUTO_INCREMENT,
        name VARCHAR(10) NOT NULL UNIQUE,
        PRIMARY KEY (id)
    ) DEFAULT CHARSET=utf8mb4;
    ```

- 在项目中，创建`Group`实体类，对应`t_group`表；

  - ```java
    package cn.tedu.mybatis;
    
    public class Group {
    
    	private Integer id;
    	private String name;
    
    	public Integer getId() {
    		return id;
    	}
    
    	public void setId(Integer id) {
    		this.id = id;
    	}
    
    	public String getName() {
    		return name;
    	}
    
    	public void setName(String name) {
    		this.name = name;
    	}
    
    	@Override
    	public String toString() {
    		return "Group [id=" + id + ", name=" + name + "]";
    	}
    
    }
    ```

- 通过MyBatis技术，实现：

  - 增加组；
  - 根据id删除组；
  - 根据id查询组；
  - 查询所有组。

## 3. 动态SQL -- foreach

假设存在需求：批量删除用户数据（一次性删除若干条用户数据）；

需要执行的SQL语句大致是：

```mysql
DELETE FROM t_user WHERE id=? OR id=? OR id=?;
DELETE FROM t_user WHERE id IN (?,?,?);
```

作为开发人员，无法确定以上SQL语句中问号的数量，及问号对应的参数值！只能确定以上参数的数据类型及所表示的意义！

以上功能最终将由用户（软件的使用者）来决定需要删除的数据的数量（问号的数量），及删除的数据是哪几条（问号对应的参数值）！就会导致“当用户的操作不同时（选中需要删除的数据不同），最终需要执行的SQL语句是不同的”！MyBatis框架提供了“动态SQL”机制来解决这个问题！

**动态SQL**：根据用户提供的参数值不同，最终需要执行的SQL语句可以不同！

当需要实现以上批量删除的需求时，可以将抽象方法设计为：

```java
Integer deleteByIds(List<Integer> ids);
```

或者，也可以设计为（本次案例就使用这个）：

```java
Integer deleteByIds(Integer[] ids);
```

甚至，还可以设计为：

```java
Integer deleteByIds(Integer... ids);
```

> 可变参数在被处理时，本质上就是数据。

在配置SQL语句时，需要通过`<foreach>`节点来配置SQL语句中需要通过循环生成的部分：

```xml
<delete id="deleteByIds">
    DELETE FROM t_user WHERE id IN (
    	<foreach collection="array" item="id" separator=",">
            #{id}
    	</foreach>
    )
</delete>
```

关于`<foreach>`节点的配置：

- `collection`：需要被遍历的对象，当抽象方法的参数只有1个且没有添加`@Param`注解时，如果参数类型是`List`集合，则取值为`list`，如果参数类型是数组，则取值为`array`；当抽象方法的参数超过1个，就一定添加了`@Param`注解，则取值为`@Param`注解配置的参数值；

- `item`：遍历过程中的每一个元素数据，当前属性可以自定义值表示元素数据的名称，在`<foreach>`节点的子级，使用`#{}`占位符时，就可以使用这个名称来表示数据；
- `separator`：遍历生成的代码片段中，各元素数据之间的分隔符号；
- `open` / `close`：遍历生成的代码片段的最左侧字符串/最右侧字符串。

**练习**：根据若干个用户的id将这些用户的密码设置为某个值。

需要执行的SQL语句大致是：

```mysql
UPDATE t_user SET password=? WHERE id IN (?,?,?)
```

可以将抽象方法设计为：

```java
Integer updatePasswordByIds(
    @Param("ids") List<Integer> ids, 
    @Param("password") String password
);
```

然后，配置SQL语句（配置映射）：

```xml
<update id="updatePasswordByIds">
    UPDATE t_user SET password=#{password} WHERE id IN (
    	<foreach collection="ids" item="id" separator=",">
    		#{id}
    	</foreach>
    )
</update>
```

## 4. 动态SQL -- if

在配置SQL语句时，可以添加`<if>`节点用于判断参数值，从而决定最终执行的SQL语句中是否包括某个SQL语句片段。

例如存在：

```java
List<User> find(
    @Param("where") String where,
    @Param("orderBy") String orderBy, 
    @Param("offset") Integer offset, 
    @Param("count") Integer count
);
```

则可以配置为：

```xml
<select id="find" resultType="cn.tedu.mybatis.User">
	SELECT * FROM t_user
    <if test="where != null">
    	WHERE ${where}
    </if>
    <if test="orderBy != null">
    	ORDER BY ${orderBy}
    </if>
    <if test="offset != null and count != null">
    	LIMIT #{offset}, #{count}
    </if>
</select>
```

需要注意：以上案例只是假想中的代码，在实际开发时，一定不要这样来使用！

需要注意：在动态SQL中，`<if>`节点并没有匹配的`else`部分！如果一定需要实现`if...else`的语法效果，可以写2个条件完全相反的`<if>`节点，或者，通过`<choose>`、`<when>`、`<otherwise>`节点进行配置，其基本格式是：

```xml
<choose>
	<when test="">
        满足条件时的SQL语句片段
    </when>
    <otherwise>
        不满足条件时的SQL语句片段
    </otherwise>
</choose>
```

## 5. 关于#{}和${}格式的占位符

MyBatis允许在配置SQL语句时使用`#{}`和`${}`这2种格式的占位符来表示参数值。

**简单原则**：在原本使用JDBC技术编程时，编写SQL语句时可以写问号(`?`)的位置，都使用`#{}`格式的占位符，不可以写问号的位置，必须使用`${}`格式的占位符！

使用`#{}`格式的占位符，只能表示某个值！MyBatis在处理时，会通过预编译的方式进行处理，即：先使用问号对占位符表示的值进行占位，并将整个SQL语句交由MySQL进行编译相关的处理（包括词法分析、语义分析、编译），当编译完成后，再将值代入到编译成功的SQL语句中一并执行。简单来说，使用`#{}`格式的占位符时，最终处理机制是使用了预编译的！所以，使用这种格式的占位符时，在编写SQL时**不需要关心值的数据类型的问题**，并且，**不存在SQL注入的风险**！

使用`${}`格式的占位符，可以表示SQL语句中的任意片段！MyBatis在处理时，会先将`${}`格式占位符对应的值**拼接**到SQL语句中，然后再将SQL语句交由MySQL进行编译相关处理，也就是说，`${}`格式占位符的值在编译之前就已经代入到SQL语句中了！很显然，在处理`${}`格式的占位符时，没有（也不可能）使用预编译！所以，使用这种格式的占位符时，**需要自行在SQL语句中考虑数据类型的问题**，例如字符串类型的值需要使用一对单引号框住！另外，还**存在SQL注入的风险**！

---

## 【整合SSM框架】

在创建SpringMVC项目的基础之上，将`mybatis`案例中的`SpringConfig`类放进去，并作为项目初始化类的`getRootConfigClasses()`方法的返回值，并添加**jdbc.properties**配置文件及相关依赖即可。

注意：为了确保框架整合后可以正常使用，推荐在`SpringConfig`类的声明之前添加`@Configuration`注解。

提示：当在控制器中需要使用持久层对象时，直接声明出`private UserMapper userMapper;`属性并添加`@Autowired`注解，即可在控制器中调用持久层所开发的方法！















