
module.exports = {
    '/api/project/getList': {
        get: {
            query: {
                type: 'object',
                properties: {
                    proj_key: {
                        type: 'string',
                    }
                },
                required: ['proj_key']
            },
        },
        post: {
            body:{
                type: 'object',
                properties: {
                    proj_key1: {
                        type: 'string',
                    }
                },
                required: ['proj_key1']
            }
        },
    }
}