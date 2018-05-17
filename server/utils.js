// 过滤特殊字符，这些字符不能代入正则
const checkCode = str => {
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

// 去除首尾空格
const trim = str => {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 获取输入文字的语种
const getLanguage = str => {
  let re = /[^\u4e00-\u9fa5]/;
  // 不全为中文则返回"en"，按英文处理
  if (re.test(str)) return "en";
  // 全为中文返回"cn
  return "cn";
}

module.exports = {
  checkCode,
  trim,
  getLanguage
}
