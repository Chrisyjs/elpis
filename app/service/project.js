module.exports = (app) => {
    const BaseService = require('./base')(app);
    return class ProjectService extends BaseService {
        async getList() {
            return [
                {
                    name: 'project1',
                    desc: '11111'
                },
                {
                    name: 'project2',
                    desc: '22222'
                },
            ]
        }
    }
}  