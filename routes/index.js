const express = require('express');
const router = express.Router();

//自動掃描並引入所有的路由
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
//排除 index.js 以及非 .js 結尾的檔案
fs.readdirSync(__dirname)
    .filter(file => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach(file => {
        //將所有路由匯入，並將 Route 實體傳入類別中，使其能進行註冊。
        const route = require(path.join(__dirname, file));
        route.define(router);
    });

module.exports = router;