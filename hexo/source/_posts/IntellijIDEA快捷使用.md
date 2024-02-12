---
top: True
---



# Intellij IDEA快捷使用

## 1. 快捷键

### 1.1. 按键说明

| 按键      | 说明                                                         |
| --------- | ------------------------------------------------------------ |
| +         | 需要同时按下加号左右两侧的键                                 |
| ,         | 按下逗号左侧的键后，松开，然后按下逗号右侧的键               |
| Ctrl      | 控制键，键盘上标记了`Ctrl`的键，在Mac键盘上标记为`control`   |
| Shift     | 上档键，键盘上标记了`Shift`的键                              |
| Alt       | 切换键，键盘上标记了`Alt`的键，在Mac键盘上与`Option`是同一个键 |
| Command   | 命令键，**Mac键盘独有**，标记了`Command`的键                 |
| Enter     | 回车键，键盘上标记了`Enter`的键，在Mac键盘上与`return`是同一个键 |
| Space     | 空格键，键盘上最下方、最大的按键                             |
| Up / Down | 方向上/方向下，通常在键盘上标记了向上/向下的箭头             |

某些快捷键可能与操作系统或其它软件的全局快捷键是冲突的，则按下会无效或执行其它命令，可以在Intellij IDEA的设置的**Keymap**中修改为其它按键。

以下快捷键是Intellij IDEA的默认风格快捷键，如果改成了Eclipse风格或其它风格，请参考所更改的设置。

标记了`[!]`是可能存在冲突的快捷键。

全部快捷键可在Intellij IDEA的设置的**Keymap**中查看，或者查看官方文档：https://resources.jetbrains.com/storage/products/intellij-idea/docs/IntelliJIDEA_ReferenceCard.pdf?_ga=2.5349558.422550521.1580708138-1891300040.1568641704

在各种编辑软件中都会使用到的快捷键可能不会被列举到以下各表中，例如`Ctrl` + `C`表示**复制**，在各种编辑软件中都是这样设计的，就不重复列举了。

### 1.2. 推荐快捷键

| Windows / Linux      | Mac OS                      | 说明                                                         |
| -------------------- | --------------------------- | ------------------------------------------------------------ |
| **[!]** Ctrl + Space | Ctrl + Space                | 基本代码提示                                                 |
| Ctrl + Shift + Space | Ctrl + Shift + Space        | 智能代码提示                                                 |
| Shift, Shift         | Shift, Shift                | 全局查找                                                     |
| Alt + Enter          | Option + Enter              | 代码错误解决方案                                             |
| Alt + Insert         | Command + N 或 Ctrl + Enter | 自动生成Bean方法                                             |
| Ctrl + P             | Command + P                 | 在调用方法时，将光标定位在方法的括号中，提示方法的参数列表   |
| Shift + F6           | Shift + F6                  | 重命名，适用于：在文件列表中对文件重命名，在文件内部对类名、属性名、方法名等重命名 |

### 1.3. 常规

| Windows / Linux  | Mac OS              | 说明                                                    |
| ---------------- | ------------------- | ------------------------------------------------------- |
| Ctrl + Shift + A | Command + Shift + A | 查找命令（IDE中可执行的命令，例如运行、调试、重命名等） |

### 1.4. 查找与替换

| Windows / Linux  | Mac OS              | 说明                             |
| ---------------- | ------------------- | -------------------------------- |
| Shift, Shift     | Shift, Shift        | 全局查找                         |
| Ctrl + F         | Command + F         | 在当前源代码中查找               |
| Ctrl + R         | Command + R         | 在当前源代码中替换               |
| Ctrl + Shift + F | Command + Shift + F | 在指定路径（例如整个项目）中查找 |
| Ctrl + Shift + R | Command + Shift + R | 在指定路径（例如整个项目）中替换 |

### 1.5. 代码编辑

| Windows / Linux      | Mac OS                      | 说明                                                       |
| -------------------- | --------------------------- | ---------------------------------------------------------- |
| [!] Ctrl + Space     | Ctrl + Space                | 基本代码提示                                               |
| Ctrl + Shift + Space | Ctrl + Shift + Space        | 智能代码提示                                               |
| Ctrl + P             | Command + P                 | 在调用方法时，将光标定位在方法的括号中，提示方法的参数列表 |
| Alt + Insert         | Command + N 或 Ctrl + Enter | 自动生成Bean方法                                           |
| Ctrl + O             | Ctrl + O                    | 重写方法                                                   |
| Ctrl + Alt + T       | Command + Option +  T       | 使用if/try...catch等代码块包裹当前选中代码                 |
| Ctrl + /             | Command + /                 | 添加/移除行注释                                            |
| Ctrl + Alt + L       | Command + Option + L        | 格式化源代码                                               |
| Ctrl + Alt + O       | [!] Ctrl + Option + O       | 整理import语句                                             |
| Ctrl + D             | Command + D                 | 向下复制代码行                                             |
| Ctrl + Y             | Command + Delete            | 删除代码行                                                 |
| Shift + Enter        | Shift + Enter               | 新增下一行代码，并将光标定位到下一行代码                   |
| Ctrl + Enter         | Command + Enter             | 新增下一行代码，光标在原有位置不变                         |
| Ctrl + +/-           | Command + +/-               | 展开或收起类的某个成员，例如方法、内部类等                 |
| Ctrl + Shift + +/-   | Command + Shift + +/-       | 展开或收起当前类的所有成员                                 |
|                      | Option + Shift + 上/下      | 向上/下移动代码                                            |
|                      | Command + Option + V        | 将光标所在位置的常量声明为局部变量                         |
| Ctrl + Shift + V     | Command + Shift + V         | 从最近复制过的多项中选择某项来粘贴                         |

> 也有很多开发者使用`Ctrl` + `X`作为**删除代码行**的快捷键，其本质是**剪切**了代码，当然，只要不粘贴，其效果也是相同的。

### 1.6. 管理与导航

| Windows           | Mac OS                     | 说明                                                         |
| ----------------- | -------------------------- | ------------------------------------------------------------ |
| Shift + F6        | Shift + F6                 | 重命名，适用于：在文件列表中对文件重命名，在文件内部对类名、属性名、方法名等重命名 |
|                   | Shift + 单击               | 在选项卡处单击以关闭文件                                     |
| Ctrl  + F12       | Command + F12              | 显示当前文档结构                                             |
| Ctrl + U          | Command + U                | 打开父类方法，打开父类，需先装光标定位到类名，不适用于打开Object类 |
| F4 / Ctrl + Enter | Command + 下 / Ctrl + 单击 | 打开光标所在位置的类、属性、方法的声明                       |

## 2. 快捷输入

### 2.1. 操作方式

可以通过快捷输入简单的内容后按下Enter键，快速完成特定的代码内容，这些内容可以在设置的Editor > Live Templates中查看或调整。

### 2.2. 常规

| 输入内容 | 等效代码                                                     |
| -------- | ------------------------------------------------------------ |
| `psvm`   | `public static void main(String[] args) {}`                  |
| `sout`   | `System.out.println();`                                      |
| `serr`   | `System.err.println();`                                      |
| `soutm`  | `System.out.println("类名.方法名");`                         |
| `soutp`  | `System.out.println("参数1 = [值1], 参数2 = [值2], ... , 参数N = [值N]");` |
| `soutv`  | `System.out.println("参数名 = 值");`                         |

### 2.3. 声明静态常量

| 输入内容 | 等效代码                     |
| -------- | ---------------------------- |
| `psf`    | `public static final`        |
| `prsf`   | `private static final`       |
| `psfi`   | `public static final int`    |
| `psfs`   | `public static final String` |

### 2.4. 判断

| 输入内容 | 等效代码                     |
| -------- | ---------------------------- |
| `ifn`    | `if (变量 == null) {}`       |
| `inn`    | `if (变量 != null) {}`       |
| `inst`   | `if (变量 instanceof 类) {}` |

### 2.5. 循环与遍历

| 输入内容 | 等效代码                                                     |
| -------- | ------------------------------------------------------------ |
| `fori`   | `for (int 循环变量 = 0; 循环变量 < ; i++) {}`                |
| `itar`   | `for (int 循环变量 = 0; 循环变量 < 数组.length(); i++) { 类型 数组元素变量名 = 数组[i]}` |
| `iter`   | `for (元素类型 变量名 : 被遍历对象) {}`                      |
| `itli`   | `for (int 循环变量 = 0; 循环变量 < 集合.size(); i++) { 类型 集合元素变量名 = 集合.get(循环变量); }` |

## 3. 快捷输入--高级

### 3.1. 遍历数组或集合对象

假设存在名为`numbers`的`int`数组或集合，输入`numbers.for`即可生成增强for循环代码，格式如下：

```java
for (int number : numbers) {
}
```

### 3.2. 为值声明变量

假设需要声明`int`类型的变量，其值为`1`，输入`1.var`即可生成对应的声明语句，格式如下：

```java
int i = 1;
```

整型数字默认生成的变量名是`i`，代码生成后，可以自行调整。

同理，假设需要声明`String`类型的变量，其值为`"Java"`，输入`"Java".var`即可，格式如下：

```java
String java = "Java";
```

字符串类型默认生成的变量名有多种情况，例如字符串内容是简单字母时，默认变量名就是字母，如果字母首字母是大写的，也会自动使用首字母小写作为默认变量名，字符串类型是汉字时，默认变量名就是汉字，字符串中包含不允许组成变量名的字符时，会使用`s`或`s1`、`s2`等作为默认变量名，当然，在代码生成后，都可以自行调整。

其它数据类型的值也可以使用同样的方法声明出变量，例如输入`new Date().var`时，就可以生成：

```java
Date date = new Date();
```

### 3.3. 判断对象是否为空

假设存在名为`x`的变量，需要判断是否为空，输入`x.null`然后在提示菜单中选择`null`一栏回车，即可生成：

```java
if (x == null) {
}
```

如果需要判断是否非空，则输入`x.no`后选择`notnull`一栏并回车，即可生成：

```java
if (x != null) {
}
```

---

未完，某天再续……

