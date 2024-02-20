module.exports = {
  title: '傅培',
  description: '编程手册',
  base: '/',
  lang: 'zh-CN',
  themeConfig: {
    footer: {
      message: '<a href="https://beian.miit.gov.cn" rel="nofollow" target="_blank">渝ICP备20002043号-2</a>'
    },
    sidebar: [
      {
        text: '常用编程环境',
        items: [
          { text: '编程环境和软件工具安装手册', link: 'https://server.static.fupeijun.com/environment/%E7%BC%96%E7%A8%8B%E7%8E%AF%E5%A2%83%E5%92%8C%E8%BD%AF%E4%BB%B6%E5%B7%A5%E5%85%B7%E5%AE%89%E8%A3%85%E6%89%8B%E5%86%8C.pdf' },
        ]
      },
      {
        text: 'Java',
        items: [
          { text: 'Java开发手册（嵩山版）', link: 'https://server.static.fupeijun.com/java/javadoc/Java%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8C%EF%BC%88%E5%B5%A9%E5%B1%B1%E7%89%88%EF%BC%89.pdf' },
          { text: 'Java 6 API 中文版文档', link: 'https://server.static.fupeijun.com/java/javadoc/java6api/api/index.html' },
          { text: 'Java 8 API 文档', link: 'https://server.static.fupeijun.com/java/javadoc/java8api/index.html' },
        ]
      },
      {
        text: 'Linux',
        items: [
          { text: 'vim常用命令', link: '/linux/vim-command' },
          { text: 'Linux速查备忘手册', link: 'https://server.static.fupeijun.com/linux/Linux%E9%80%9F%E6%9F%A5%E5%A4%87%E5%BF%98%E6%89%8B%E5%86%8C.pdf' },
          { text: '快乐的 Linux 命令行', link: 'https://server.static.fupeijun.com/linux/tlcl-cn.pdf' },
        ]
      },
      {
        text: 'Python',
        items: [
          { text: 'python语法整理', link: 'https://server.static.fupeijun.com/python/python%E8%AF%AD%E6%B3%95%E6%95%B4%E7%90%86.pdf' },
        ]
      },
      {
        text: 'Docker',
        items: [
          { text: 'docker命令', link: 'https://server.static.fupeijun.com/docker/docker-command.pdf' },
        ]
      },
      {
        text: 'Node',
        items: [
          { text: 'npm和yarn的源、代理设置', link: '/node/npm和yarn的源、代理设置' },
        ]
      }
    ]
  }
}