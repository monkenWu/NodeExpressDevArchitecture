require('dotenv').config();
//將 APP_ENV 賦予給 NODE_ENV
process.env.NODE_ENV = process.env.APP_ENV || 'development';

const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 8080;
const route = require('./routes/index');

app.use(express.json());

// 引入所有路由
app.use('/', route);

const DbConnection = require('./system/DbConnection');
DbConnection.getEngine();

// 結束伺服器時關閉資料庫連線
process.on('SIGINT', async () => {
  console.log('\nServer is shutting down.');
  await DbConnection.closeConnection();
  process.exit(0); // 正常退出
});

// 啟動服務器
app.listen(port, () => {
  console.log(`Server has been started on port ${port}`);
});
