class v1Route{

    constructor(){
        this.indexController = require('../controller/v1/indexController');
    }

    /**
     * Define V1 api routes
     * 
     * @param {import('express').Router} router 
     */
    define(router){
        router.get('/api/v1', this.indexController.indexPage);

        console.log('Api v1 route defined.');
    }
}

module.exports = new v1Route();