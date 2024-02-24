# NodeExpressDevArchitecture

這是一個基於 Express 的 API 伺服器開發架構示範


## Route

專案中的路由設定集中在 `Route` 資料夾底下， `index.js` 會自動掃描同層資料夾下的所有 `.js` 檔案進行路由的註冊。

### 新增一個 Route 檔案

推薦以 API 版本號碼進行 Route 檔案的分配。你可以試著建立一個自己的路由，並讓他看起來像是下面這個樣子：

```js
class v2Route{

    constructor(){
        this.indexController = require('../controller/v2/indexController');
    }

    /**
     * Define V1 api routes
     * 
     * @param {import('express').Router} router 
     */
    define(router){
        router.get('/api/v2', this.indexController.indexPage);


        console.log('Api v1 route defined.');
    }
}

module.exports = new v2Route();
```

在 `constructor` 中載入需要使用的 Controller ，並在 `define` 中透過 `express.Router` 實體進行路由的註冊。請注意，類別中的 `define` 方法必須存在，他是 `index.js` 進行自動路由註冊時呼叫的方法。

