const superagent = require('superagent')

module.exports = (app) => {
    return class BaseService {
        /**
         * controller 基类
         * 统一收拢 controller 相关的公共方法
         */
        constructor() {
            this.app = app;
            this.config = app.config;
            this.curl = superagent;
        }
    };
} 