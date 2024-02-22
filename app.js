require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 8080;
const route = require('./routes/index');

app.use(express.json()); // 啟用 JSON 請求體解析

// 引入所有路由
app.use('/', route);

// 啟動服務器
app.listen(port, () => {
  console.log(`Server has been started on port ${port}`);
});
