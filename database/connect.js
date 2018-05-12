const mongoose = require('mongoose');

module.exports = () => {
  return new Promise((resolve, reject) => {
    // 连接数据库
    let uri = 'mongodb://client:gj5y20fj74j42jf848fn0dj20fh75cs@ds141406.mlab.com:41406/shzym86';
    // let uri = "mongodb://localhost/test";
    mongoose.connect(uri);
    mongoose.connection.once("open", function () {
      console.log("数据库连接成功！");
      resolve();
    }).on("error", function (err) {
      reject(err);
    })
  });
}