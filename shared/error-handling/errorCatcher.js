const responseWrapper = require('../../utils/responseWrapper')();

module.exports = function *errorCatcherMiddleware(next) {
    try {
        yield next;
    } catch (err) {
        console.log('before Errror', err);
        console.log(err);
        console.log('after Errror');

        const statusCode = parseInt(err.statusCode, 10) || 500;
        let message = err.message || err;
        message += err.stack;

        this.status = statusCode;

        this.body = responseWrapper.sendResponse(false, null, "error", message);
    }
};
