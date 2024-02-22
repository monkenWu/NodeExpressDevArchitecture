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
        const route = require(path.join(__dirname, file));
        route.define(router);
    });

module.exports = router;