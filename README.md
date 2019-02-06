# 化学专业术语在线词典 v2

本项目于2019年2月更新了2.0升级版：[项目演示 - v2](https://chemical-dict-2.herokuapp.com)

> 2.0 版本正处于继续优化阶段，暂不开源。本仓库的代码仍然为 1.0 版本。

2.0 版本在原有基础上新增了更多功能：

- 用户注册登录
- 本地收藏生词本
- 在线贡献新词
- GitHub第三方登录

同时实践了更多更丰富的 **前端** 和 **Node.js** 相关的技术栈，包括：

- vue-cli 3 最新脚手架重构项目、目录结构优化设计、深入ES6模块化
- vue-router 实现 SPA 路由跳转、导航守卫保护认证路由
- vuex 存储用户认证信息
- vue-meta 为 SPA 页面定制不同的 title
- axios 实现前后端数据交互、拦截响应数据、统一处理异常
- Koa 2 作为后端服务器，提供后端接口
- Bootstrap 4 全新布局重构项目，灵活使用 Utilities
- Material Design Icons 字体图标的使用
- Lodash 各种常见工具函数的使用
- Element-UI 提供常用的 Vue UI组件（如表单验证）、按需引入节省流量
- MongoDB 数据库存储
- mongoose 操作数据库，实现增删改查
- 搜索引擎的原理与实现（数据查询、数据防抓取、正则表达式）
- SSR 首页预渲染
- 响应式设计，完美兼容移动端体验
- Localforage 增强版的浏览器本地缓存
- JWT 用户认证机制，保护认证的后端接口
- OAuth 2.0 第三方社交登录 - 对接 GitHub 登录
- 腾讯防水墙
- 一键社交分享功能
- mlab 部署本地 MongoDB 数据库
- Heroku 部署项目



# 化学专业术语在线词典 v1

> 项目背景：近日完成了一项有关“学术在线词典”类的产品原型设计，之后对搜索引擎的实现原理产生了兴趣，尽管在公司仅作为产品设计，不参与后期项目开发，但是我还是不想半途而废，于是就选取了一部分与化学有关的专业术语数据，花了几天时间开发了一款简单的在线词典。

## Vue 2.x + Koa2 实现简单搜索引擎

这是一个前后端完全分离的项目，实现了一个简单的搜索引擎的功能，主要学习了如何从后台按需查询数据，并经过处理后展示给前端页面，也学习了如何来写简单的API供前端调用。


[项目演示 - v1](https://chemical-dict.herokuapp.com)

[采坑记录 - v1](https://github.com/shzym86/chemical-dict/blob/master/Problems.md)


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

