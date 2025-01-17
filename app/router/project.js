module.exports = (app,router) =>{
    const { project: projectController } = app.controller
    router.post('/api/project/getList',projectController.getList.bind(projectController))
    router.get('/api/project/list',projectController.list.bind(projectController))
}