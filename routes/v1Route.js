const routeErrorHandler = require('../system/RouteErrorHandler');
const indexController = require('../controller/v1/IndexController');
const userController = require('../controller/v1/UserController');
const walletController = require('../controller/v1/WalletController');
const jwtMiddleware = require('./middleware/jwtMiddleware');
const oneselfMiddleware = require('./middleware/oneselfMiddleware');
const Express = require('express');

/**
 * @param {import('express').Router} router 
 */
module.exports = (router) => {

    // 使用者註冊與登入
    let userManageRoutes = Express.Router();
    userManageRoutes.post('/user', routeErrorHandler(userController.register));
    userManageRoutes.post('/user/login', routeErrorHandler(userController.login));

    // 使用者相關資源操作
    let userResourceRoutes = Express.Router();
    userResourceRoutes.use('/user/:username', jwtMiddleware, oneselfMiddleware);
    userResourceRoutes.get('/user/:username', routeErrorHandler(userController.getUserInfo));
    userResourceRoutes.get('/user/:username/wallet', routeErrorHandler(walletController.getInfo));
    userResourceRoutes.post('/user/:username/wallet/deposit', routeErrorHandler(walletController.deposit));
    userResourceRoutes.post('/user/:username/wallet/withdraw', routeErrorHandler(walletController.withdraw));
    userResourceRoutes.post('/user/:username/wallet/transfer', routeErrorHandler(walletController.transfer));

    // 主路由 /api/v1
    let apiV1Route = Express.Router();
    apiV1Route.get('/api/v1', routeErrorHandler(indexController.indexPage));
    apiV1Route.use('/api/v1',
        userManageRoutes,
        userResourceRoutes
    );

    // 將 apiV1Route 綑綁到主路由上
    router.use(apiV1Route);
};