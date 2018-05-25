## 化学专业术语在线词典

> 项目背景：近日完成了一项有关“学术在线词典”类的产品原型设计，之后对搜索引擎的实现原理产生了兴趣，尽管在公司仅作为产品设计，不参与后期项目开发，但是我还是不想半途而废，于是就选取了一部分与化学有关的专业术语数据，花了几天时间开发了一款简单的在线词典。

### Vue 2.x + Koa2 实现简单搜索引擎

[项目演示](https://chemical-dict.herokuapp.com)


> 这是一个前后端完全分离的项目，实现了一个简单的搜索引擎的功能，主要学习了如何从后台按需查询数据，并经过处理后展示给前端页面，也学习了如何来写简单的API供前端调用。

### 1. 技术栈

- `Vue`+`Vue Router` 使用vue-cli快速构建项目，其中采用了ES6语法和Sass预处理器。
- `Koa2` 作为服务端框架处理路由并提供API。
- `Bootstrap` 快速生成样式。
- `mongoose` 操作数据库，实现数据查询。

> 原始数据在本地MongoDB数据库中进行测试，在线项目的数据存放在mLab平台，最终项目部署在Heroku云服务器，完全免费。


### 2. 项目目录

```bash
.
├── build
│   └── ...
├── config
│   └── ...
├── database
│   ├── connect.js						# 封装数据库连接
│   └── model.js						# 封装Model
├── dist
│   └── ...
├── server
│   ├── query.js						# 封装数据查询的业务逻辑
│   ├── utils.js						# 封装工具函数
│   └── server.js						# 开启Node服务，装载后端路由
├── src
│   ├── App.vue							# 根组件
│   ├── assets							# 资源文件
│   │   └── logo.png
│   ├── components
│   │   ├── common						# 通用核心组件
│   │   │   ├── EnterBox.vue
│   │   │   ├── Loading.vue
│   │   │   └── Pagination.vue
│   │   ├── layout						# 布局类组件
│   │   │   ├── Header.vue
│   │   │   └── Navbar.vue
│   │   └── page						# 路由页面组件
│   │       ├── Category.vue
│   │       ├── CategorySearch.vue
│   │       ├── Home.vue
│   │       └── Search.vue
│   ├── main.js							# 入口文件
│   └── router							# 前端路由配置
│       └── index.js
├── static
│       └── favicon.ico
├── index.html							# 页面模板
├── Procfile
├── README.md
└── package.json
```


### 3. 页面架构和数据请求

- 首页
	- 学科分类索引页
		- 按学科类别搜索页
	- 按关键词搜索页

除了首页之外的三个路由页面，每个组件内部都需要设定钩子函数，当组件一挂载立即向后台API请求数据来渲染整个页面。

组件 | 功能 | API | 调用方法
---|---|---|---
Search | 按关键词搜索页 | /api/list | getByKeywords(keywords, curPage, lang)
Category | 学科分类索引页 | /api/fetchIndex | getAllCategories()
CategorySearch | 按学科类别搜索页 | /api/list2 | getByCategory(subject, curPage)
