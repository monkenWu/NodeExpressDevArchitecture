class v2Route{

    constructor(){
        this.indexController = require('../controller/v2/indexController');
    }

    /**
     * Define V1 api routes
     * 
     * @param {import('express').Router} router 
     * @returns {import('express').Router}
     */
    define(router){
        router.get('/api/v2', this.indexController.indexPage);


        console.log('Api v1 route defined.');
    }
}

module.exports = new v2Route();