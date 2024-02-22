class IndexController {

    /**
     * Index Page
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    indexPage(req, res) {
        // 假設這是你想要回傳的 JSON 數據
        const data = {
            message: 'The server is running, This is V1 API.',
            status: 'success'
        };

        // 使用 res.json() 方法來發送 JSON 響應
        res.status(200);
        res.json(data);
    }
    
}

module.exports = new IndexController();