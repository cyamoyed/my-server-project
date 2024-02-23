# docker常用命令
## docker容器在run时设置开机启动

要在运行Docker容器时设置开机启动，可以使用`--restart`选项来指定容器的重启策略。以下是一些常用的重启策略：

1. `--restart=always`：容器退出时总是重新启动。
2. `--restart=unless-stopped`：容器退出时重新启动，除非手动停止容器。
3. `--restart=on-failure`：只有在容器以非零退出代码退出时才重新启动。
4. `--restart=on-failure:5`：只有在容器以非零退出代码退出且退出代码为5时才重新启动。

例如，要在运行一个名为`my-container`的容器时设置开机启动并总是重新启动，可以使用以下命令：
```shell
docker run --restart=always my-container
```

通过设置`--restart`选项，可以在运行Docker容器时指定容器的重启策略，从而实现容器的开机启动。

## docker指定容器名字

要在运行Docker容器时指定容器的名称，可以使用`--name`选项。以下是示例命令：

```shell
docker run --name my-container my-image
```

在这个示例中，`--name my-container`指定了容器的名称为`my-container`，`my-image`是要运行的镜像名称。

通过指定`--name`选项，可以为Docker容器指定一个自定义的名称，方便在后续操作中引用该容器。