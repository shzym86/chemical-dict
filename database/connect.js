const mongoose = require('mongoose');
const isDev = process.env.NODE_ENV === 'development'

module.exports = () => {
  return new Promise((resolve, reject) => {
    // 连接数据库
    let uri = "";
    if (isDev) {
      uri = "mongodb://localhost/test";
    } else {
      uri = 'mongodb://client:gj5y20fj74j42jf848fn0dj20fh75cs@ds141406.mlab.com:41406/shzym86';
    }
    mongoose.connect(uri);
    mongoose.connection.once("open", function () {
      console.log("数据库连接成功！");
      resolve();
    }).on("error", function (err) {
      reject(err);
    })
  });
}
