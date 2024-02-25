require('dotenv').config();
//將 APP_ENV 賦予給 NODE_ENV
process.env.NODE_ENV = process.env.APP_ENV || 'development';

const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 8080;
const route = require('./routes/index');
const LogManager = require('./system/LogManager');

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

//404 處理
app.use((req, res, next) => {
    res.status(404).json({
      status: 'error',
      message: 'Not Found',
    });
});
  
// 錯誤處理
app.use((err, req, res, next) => {
    if (err.isOperational) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        res.status(statusCode).json({
            status: 'error',
            message,
        });
    } else {
        //非預期錯誤將直接進入錯誤日誌
        let detail = err.stack || err.message;
        LogManager.writeErrorLog(detail);

        if (process.env.APP_ENV == 'production') {
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        } else {
            //詳細的程式行數錯誤
            //將換行符號換成陣列字串
            let detailArr = [];
            detail.split('\n').forEach((line) => {
                detailArr.push(line.trim());
            });
            res.status(500).json({
                status: 'error',
                message: err.message,
                detail: detailArr
            });
        }

    }
});

// 啟動服務器
app.listen(port, () => {
    console.log(`Server has been started on port ${port}`);
});
