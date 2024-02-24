class IndexController {

    /**
     * Index Page
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    indexPage(req, res) {
        const data = {
            message: 'The server is running, This is V1 API.',
            status: 'success'
        };

        res.status(200);
        res.json(data);
    }
    
}

module.exports = new IndexController();