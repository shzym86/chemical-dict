const path = require("path")
const Koa = require("koa")
const KoaRouter = require("koa-router")
const mongoose = require("mongoose")
const static = require("koa-static")
const convert = require("koa-convert")
const historyApiFallback = require('koa2-connect-history-api-fallback');
const app = new Koa()
const router = new KoaRouter({
  prefix: "/api"
})

const isDev = process.env.NODE_ENV === 'development'

// 与数据库连接、查询相关的封装
const connectDB = require("../database/connect")
const {
  getByKeywords,
  getAllCategories,
  getByCategory,
  getTips
} = require("./query")

// 导入一些封装的工具函数
const {
  checkCode,
  trim
} = require("./utils")

// 解决history模式的前端路由的404情况
// https://www.npmjs.com/package/koa2-connect-history-api-fallback
if (!isDev) {
  app.use(historyApiFallback({
    whiteList: ['/api']
  }));
}

// 分页获取列表数据
router.get("/list", async ctx => {
  // 连接数据库
  if (mongoose.connection.readyState == 0) {
    await connectDB();
  }
  // 接收请求体
  let curPage = ctx.query.page;
  let keywords = ctx.query.search;
  let language = ctx.query.lang;
  // 获取查询结果
  // 验证规则是三个参数必须全部存在，避免构造URL发送请求后一下子获取全部数据！
  if (curPage && keywords && checkCode(keywords) && language) {
    let res = await getByKeywords(keywords, curPage, language);
    // 输出响应
    ctx.type = "json";
    ctx.body = res;
  } else {
    ctx.body = "Invalid";
  }
})

// 获取学科分类信息整个到索引页
router.get("/fetchIndex", async ctx => {
  // 连接数据库
  if (mongoose.connection.readyState == 0) {
    await connectDB();
  }
  let res = await getAllCategories();
  // 输出响应
  ctx.type = "json";
  ctx.body = res;
})

// 按学科分类分页获取列表数据
router.get("/list2", async ctx => {
  // 连接数据库
  if (mongoose.connection.readyState == 0) {
    await connectDB();
  }
  // 接收请求体
  let curPage = ctx.query.page;
  let subject = ctx.query.sub;
  // 获取查询结果
  // 验证规则是两个个参数必须全部存在，避免构造URL发送请求后一下子获取全部数据！
  if (curPage && subject) {
    let res = await getByCategory(subject, curPage);
    // 输出响应
    ctx.type = "json";
    ctx.body = res;
  } else {
    ctx.body = "Invalid";
  }
})

// autocomplete
router.get("/doAjax", async ctx => {
  // 连接数据库
  if (mongoose.connection.readyState == 0) {
    await connectDB();
  }
  // 接收请求体
  let input = trim(ctx.query.query);
  // 获取查询结果
  if (input && checkCode(input)) {
    let res = await getTips(input);
    // 输出响应
    ctx.type = "json";
    ctx.body = res;
  } else {
    // 必须写成空数据对象，否则autocomplete插件会报错
    ctx.body = {
      data: []
    };
  }
})

// 装载路由
app.use(router.routes()).use(router.allowedMethods())

// 开启静态服务器
app.use(convert(
  static(path.join(__dirname, "../dist"))
))

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started at port of ${port}`)
})
