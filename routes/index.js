const express = require('express');
const router = express.Router();

//自動掃描並引入所有的路由
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
    .filter(file => {
        //排除 index.js 以及非 .js 結尾的檔案
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach(file => {
        //將所有路由匯入，並將 Route 實體傳入入檔案中使其可以使用
        require(path.join(__dirname, file))(router);
    });

module.exports = router;