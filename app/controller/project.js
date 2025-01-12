module.exports = (app) => {
    const BaseController = require('./base')(app);
    return class ProjectController extends BaseController {
        /**
         * 获取项目列表
         * @params {object} ctx 上下文
         */
        async getList(ctx) {
            const { project: projectService } = app.service;
            const res = await projectService.getList();
            app.logger.info(process.env._ENV,app.env.isLocal())
            this.success(ctx, res)
        }
    };
}