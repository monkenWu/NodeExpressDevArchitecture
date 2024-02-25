const routeErrorHandler = require('../system/RouteErrorHandler');
const indexController = require('../controller/v1/IndexController');
const userController = require('../controller/v1/UserController');
const jwtMiddleware = require('./middleware/jwtMiddleware');

/**
 * @param {import('express').Router} router 
 */
module.exports = (router) => {
    router.get('/api/v1', routeErrorHandler(indexController.indexPage));

    router.post('/api/v1/user', routeErrorHandler(userController.register));
    router.post('/api/v1/user/login', routeErrorHandler(userController.login));
    router.get('/api/v1/user', jwtMiddleware, routeErrorHandler(userController.getUserInfo));
};