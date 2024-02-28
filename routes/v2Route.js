const routeErrorHandler = require('../system/RouteErrorHandler');
const indexController = require('../controller/v2/IndexController');

/**
 * @param {import('express').Router} router 
 */
module.exports = (router) => {
    router.get('/api/v2', routeErrorHandler(indexController.indexPage));

};