# NodeExpressDevArchitecture

這是一個基於 Express 的 API 伺服器開發架構示範，本專案整合了以下程式庫與提供特性：

* Express.js - Web 應用框架
* Sequelize - ORM
* SQLite3 - 開發時使用的資料庫
* dotenv - 環境變數管理
* express-jwt 和 jsonwebtoken - 用於建構 JWT 驗證流程
* JEST - 測試框架
* nodemon - 開發時自動重啟應用
* sequelize-cli - 資料庫 Migration
* winston - 日誌記錄

## Feature

在專案內已包含了一些 APIs 與相關的測試，你可以透過在啟動開發環境後進行基本的測試。你可以在專案根目錄中找到 `APIs.postman_collection.json` 檔案，這是一個 Postman Collection 檔案，你可以透過 Postman 進行 API 測試，這些 API 在設計上依循 RESTful API 的設計原則。

在專案內提供以下的功能模組：
* User
    * 註冊
    * 登入 - 取得 Access Token
    * 取得使用者資訊
* Wallet
    * 資訊(餘額與交易記錄)
    * 儲值
    * 提領
    * 轉帳

## 環境

本專案將透過 docker-compose.yml 部署開發環境

### 初次部署

* 建構環境
    ```bash
    docker-compose build
    ```
    > 如果需要重頭建構 image 可以同時在指令後面使用 `--no-cache` 選項
* 執行容器
    ```bash
    docker-compose up
    ```
    > 如果需要背景執行可以使用 `-d` 選項
* 進入容器
    ```bash
    docker-compose exec app bash
    ```
    > 你也可以透過 VSCode 的 Remote - Containers 擴充套件進入容器開發

* 將 `env.example` 複製成 `.env` 並調整組態設定使其符合需求
* 初始化資料庫
    ```bash
    npx sequelize-cli db:migrate
    ```
* 執行開發伺服器
    ```bash
    npm run dev
    ```

### 更新依賴

當你在專案中新增了新的依賴，你在下次執行環境時，需要重新建構 Image

```bash
docker-compose build
```

## Test

本專案使用 `Jest` 進行測試，你可以在 `./test` 資料夾中找到所有的測試檔案。請確保你的測試檔案名稱以 `.test.js` 結尾。

專案根目錄中的 `.test.env` 檔案用來設定測試環境的組態。

你可以透過下列指令來執行測試：

```bash
npm run test
```

## Route

專案中的路由設定集中在 `Route` 資料夾底下， `index.js` 會自動掃描同層資料夾下的所有 `.js` 檔案進行路由的註冊。

推薦以 API 版本號碼進行 Route 檔案的分配。你可以試著建立一個自己的路由，並讓他看起來像是下面這個樣子：

```js
const indexController = require('../controller/v1/IndexController');

/**
 * @param {import('express').Router} router 
 */
module.exports = (router) => {
    router.get('/api/v1', indexController.indexPage);

};
```

`./routes/index.js` 會自動掃描 `./routes` 資料夾下的所有 `.js` 檔案進行路由的註冊。`Express` 的 `Router` 會被傳入到每個路由檔案中，你可以在每個路由檔案中進行路由的註冊。

## Migration

本專案的 Migration 是使用 `sequelize-cli` 進行管理的，你可以透過 `npx sequelize-cli` 來執行 Migration 相關的指令。


透過下列指令來建立一個 Migration 檔案：
```bash
npx sequelize-cli migration:generate --name {migration-name}
```

透過下列指令來執行 Migration：
```bash
npx sequelize-cli db:migrate
```