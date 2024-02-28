const ForbiddenError = require('../../system/exceptions/ForbiddenError');

/**
 * 判段當前使用者是否正操作著自己的資源。
 * 使用此中介時，路由中必須帶有 :userId ，並且此中介必須放在 jwtMiddleware 之後。 
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next
 */
const oneselfMiddleware = (req, res, next) => {
    let username  = req.params.username;
    if (req.auth.username !== username) {
        throw new ForbiddenError('You can only operate your own resources.');
    }

    next();
}

module.exports = oneselfMiddleware;
