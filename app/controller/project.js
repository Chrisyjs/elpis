module.exports = (app) => {
    const BaseController = require('./base')(app);
    return class ProjectController extends BaseController {
        /**
         * 获取项目列表
         * @params {object} ctx 上下文
         */
        async getList(ctx) {
            console.log(ctx.request.body,11111)
            const { project: projectService } = app.service;
            const res = await projectService.getList();
            this.success(ctx, res)
        }
    };
}