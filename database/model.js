const mongoose = require("mongoose")

// 规范数据类型
const schema = new mongoose.Schema();

// 创建数据模型对象，并导出模块
module.exports = mongoose.model("chem-term", schema)
