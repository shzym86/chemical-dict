// 导入Modal
const Term = require("../database/model");
// 每页显示数
const pageSize = 10;
// 导入获取语言的函数
const {
  getLanguage
} = require("./utils")

// 根据关键词来查询
const getByKeywords = (keywords, currentPage, lang) => {
  return new Promise((resolve, reject) => {

    // 查询条件
    let reg = new RegExp(keywords, 'i')
    let condition = lang == "cn" ? {
      "cn": {
        $regex: reg
      }
    } : {
      "en": {
        $regex: reg
      }
    };

    Term.find(condition).exec((err, res) => {
      if (err) {
        reject(err);
      } else {
        // console.log(res[0].en)   # 居然是undefined
        // console.log(JSON.parse(JSON.stringify(res[0])).en)  # 格式化后就正常了
        res = JSON.parse(JSON.stringify(res));
        // 先查询总数
        let total = res.length;
        // 按字符串长度来排序
        res.sort(function (a, b) {
          return a[lang].length - b[lang].length;
        })
        // 跳过数
        let skipnum = (currentPage - 1) * pageSize;
        // 截取分页数据
        let data = res.splice(skipnum, pageSize);
        let result = {
          total,
          currentPage,
          data
        };
        resolve(result);
      }
    })
  })
}

// 直接从后台遍历获取所有学科列表
const getAllCategories = () => {
  return new Promise((resolve, reject) => {
    Term.aggregate([{
      $group: {
        _id: "$sub1",
        subject: {
          $addToSet: "$sub2"
        }
      }
    }]).exec((err, res) => {
      if (err) {
        reject(err);
      } else {
        res = JSON.parse(JSON.stringify(res));
        resolve(res);
      }
    })
  })
}

// 根据学科类别来查询
const getByCategory = (subject, currentPage) => {
  return new Promise((resolve, reject) => {
    Term.find({
      sub2: subject
    }).exec((err, res) => {
      if (err) {
        reject(err);
      } else {
        res = JSON.parse(JSON.stringify(res));
        // 先查询总数
        let total = res.length;
        // 跳过数
        let skipnum = (currentPage - 1) * pageSize;
        // 截取分页数据
        let data = res.splice(skipnum, pageSize);
        let result = {
          total,
          currentPage,
          data
        };
        resolve(result);
      }
    })
  })
}

// 根据输入获取自动提示
const getTips = (input) => {
  return new Promise((resolve, reject) => {
    // 判断输入的是中文还是英文
    let lang = getLanguage(input)

    // 开始查询
    getByKeywords(input, 1, lang).then(res => {
      // 获取所有候选词
      let matchedList = [];
      res.data.forEach(item => {
        matchedList.push(item[lang]);
      })
      // 数据预处理：去重后截取前5个最终返回
      let matchedListOnly = Array.from(new Set(matchedList)).slice(0, 5);
      // 返回autocomplete插件能够识别的格式，必须是有key的Object，不能是Array
      let data = [];
      matchedListOnly.forEach(item => {
        data.push({
          match: item
        })
      })
      let result = {
        data
      }
      resolve(result);
    }).catch(err => {
      reject(err);
    })
  })
}

module.exports = {
  getByKeywords,
  getAllCategories,
  getByCategory,
  getTips
}
