## 化学专业术语在线词典

> 项目背景：近日完成了一项有关“学术在线词典”类的产品原型设计，之后对搜索引擎的实现原理产生了兴趣，尽管在公司仅作为产品设计，不参与后期项目开发，但是我还是不想半途而废，于是就选取了一部分与化学有关的专业术语数据，花了几天时间开发了一款简单的在线词典。

### Vue 2.x + Koa2 实现简单搜索引擎

[项目演示](https://chemical-dict.herokuapp.com)


> 这是一个前后端完全分离的项目，实现了一个简单的搜索引擎的功能，主要学习了如何从后台按需查询数据，并经过处理后展示给前端页面，也学习了如何来写简单的API供前端调用。

### 1. 技术栈

- `Vue`+`Vue Router` 使用vue-cli快速构建项目，其中采用了ES6语法和Sass预处理器。
- `Koa2` 作为服务端框架处理理由并提供API。
- `Bootstrap` 快速生成样式。
- `mongoose` 操作数据库，实现数据查询。

> 原始数据在本地MongoDB数据库中进行测试，在线项目的数据存放在mLab平台，最终项目部署在Heroku云服务器，完全免费。


### 2. 项目目录

```
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


### 4. 采坑全记录

> 这里记录了一些项目开发中遇到的问题和解决方法。

---

##### (1) Vue-router采用了history模式后，启动服务器运行后一旦刷新页面会找不到相关路由页面(Not Found)。

解决：由于后端采用Koa2框架，需要使用[koa2-connect-history-api-fallback](https://www.npmjs.com/package/koa2-connect-history-api-fallback)中间件，把没有找到的后端路由全部定向到index.html，这样就可以正常访问前端路由了。注意：必须将`/api`排除在外，否则不能发起异步数据请求，直接返回的是主页的html代码。

```
const historyApiFallback = require('koa2-connect-history-api-fallback');

app.use(historyApiFallback({
	whiteList: ['/api']
}));
```

---

##### (2) 在开发环境下，webpack-dev-serser使用的是8080端口，而node服务器监听了3000端口，前端利用axios发起数据请求时会出现两个问题：

a. 请求地址不能直接写http://localhost:3000/api/...，否则项目上线后还要更改，导致开发坏境和正式环境的代码不一致。 

b. 涉及到跨域，服务端会阻止请求，如果在server中写上允许跨域的代码，但到了正式环境又不希望用户可以跨域访问API，又得去修改代码。
 
解决：在webpack配置项中增加代理机制，对于vue-cli构建的项目，在~/config/index.js的dev配置项里加入代理路径和地址，可以同时解决上述两个问题。

```
proxyTable: {
  '/api': 'http://127.0.0.1:3000'
},
```

---

##### (3) 每次查询一次数据库都会去连接一次数据库，触发10次以上node会警告内存泄漏。

解决：在数据查询操作之前，先判断数据库是否已连接，如是则跳过这个步骤直接去查询。

```
const connectDB = require("../database/connect")

if (mongoose.connection.readyState == 0) {
  await connectDB();
}
```

---

##### (4) Koa2中大量使用了async和await语法，但是在await一个封装好的函数时，实际却没有等待它执行完异步程序。比如执行上述连接数据库的connectDB()函数，数据库还没连上就执行了下面的代码。

解决：await后面紧跟的应该是一个Promise，所以connect.js中导出的模块必须是一个Promise，不能是一个async函数（没有效果）。

---

##### (5) mongoDB如何实现搜索引擎的模糊查询？

解决：通过构建正则表达式

```
let reg = new RegExp(keywords, 'i')

Modal.find({
  "key": { $regex : reg }
})
```	

---

##### (6) 由于模糊查询用到了正则，而在业务逻辑中用户输入的关键词直接赋给了变量keywords，如果输入的是特殊字符`*`，那么构建出的正则`/*/`就不合法，直接报错了！

解决：在前端将查询参数传递给server端之前，必须将特殊字符过滤掉，或者直接提示。通过一个函数来检测是否含有特殊字符。

```
checkCode(str) {
  // 过滤特殊字符，这些字符不能代入正则
  let specialKeys =
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&%*（）——|{}【】‘；：”“'。，、？]";
  let flag = 1;
  for (let i = 0; i < str.length; i++) {
    let code = str.substr(i, 1);
    if (specialKeys.indexOf(code) > 0) {
      flag = 0;
      break;
    }
  }
  return flag == 0 ? false : true;
}
```

安全验证处理：

- 第一层验证：搜索框 EnterBox组件

	- 防止用户在输入框内输入特殊字符导致正则报错，给出弹窗提示。

- 第二层验证：结果显示页 Search组件

	- 防止用户通过构造URL在浏览器中键入，因为search页面一挂载就会执行查询方法。

- 第三层验证：服务端验证 server.js

	- 防止用户通过请求工具发送，如postman，那样也会使得服务端报错。

---

##### (7) 如何判断字符串是否全为中文？

```
lang() {
  let re = /[^\u4e00-\u9fa5]/;
  // 不全为中文则返回"en"，按英文处理
  if (re.test(this.keywords)) return "en";
  // 全为中文返回"cn"
  return "cn";
},
```

---

##### (8) 从mongoDB数据库查询到的结果集是一个json，但是直接获取res[0].key的值居然是`undefind`，代码怎么写没有检查出错误。

解决：直接查询到的虽然是一个json，但可能会出现换行之类的bug，需要手动处理以下，即先转字符串再转json就正常了。

```
JSON.parse(JSON.stringify(res))
```

---

##### (9) mongoDB数据表导入导出csv格式文件的常用命令

解决：mongoDB不像mysql那样有较好用的图形化界面工具可以操作导入和导出，因此需要借助命令行工具完成。

导入：csv的第一行标明字段名，--headerline 会将首行的字段名作为每条数据的field。

	mongoimport -d [database] -c [collection] --type=csv --headerline --ignoreBlanks --file ./a.csv

导出：-f 指定需要提取的field，用逗号分隔。 

	mongoexport -d [database] -c [collection] -f _id,name,password --type=csv -o ./b.csv 

---

##### (10) vue-router的使用过程中，如果在当前路由里改变query的值再一次访问该路由，页面是没有反应的。

解决：因为在当前页面搜索后，尽管跳转了当前路由，但由于组件复用，页面不会刷新。通过监测路由的变化，一旦监测到的话，强制刷新当前路由页面。

```
 watch: {
  $route(to, from) {
    this.$router.go(0);
  }
}
```

---

##### (11) 用<router-link>标签跳转理由时，如何设置查询参数？

解决：跳转带有query信息的路由，只能使用编程式导航，给目标监听一个点击事件。

```
this.$router.push({
  name: "Search",
  query: {
    wd: this.keywords
  }
});
```

---

##### (12) 由于搜索框在首页和分页面都需要，但是两处的大小和宽度却不一样，如果只使用一个搜索框组件来满足两种不一样的设计需求？

解决：在使用EnterBox组件时，为其传递一个"类名"来标识不同的场景。针对不同场景来设置该组件的基础`font-size`，组件内所有的样式都写`em`相对单位。

首页调用：

	<EnterBox cname="enter-box-homepage"></EnterBox>


子页面调用：

	<EnterBox class="box" cname="enter-box-subpage"></EnterBox>
	
组件中接收一个cname作为第二个className：

```
<template>
  <div class="enter-box" :class="cname">
    ...
  </div>
</template> 

<script>
export default {
  props: {
    cname: {
      type: String,
      required: true
    }
  },
}
</script>

<style> 
.enter-box-homepage {
  font-size: 24px;
}
.enter-box-subpage {
  font-size: 16px;
}
.enter-box {
  ... 
}
</style>
```

---

##### (13) 关于vue-cli中设定favicon.ico网站图标

解决：将文件放到~/static/目录下，在模板文件中直接引入即可。

	<link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />

