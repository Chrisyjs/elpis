const Ajv = require('ajv')
const ajv = new Ajv()

module.exports = (app) => {
    $schema = 'http://json-schema.org/draft-07/schema#'
    return async (ctx, next) => {
        //只对 API 请求做签名校验
        if (ctx.path.indexOf('/api') < 0) {
            return await next();
        }
        const { query, body, headers } = ctx.request
        const { params, path, method } = ctx

        app.logger.info(`[${method} ${path}] body: ${JSON.stringify(body)}`)
        app.logger.info(`[${method} ${path}] query: ${JSON.stringify(query)}`)
        app.logger.info(`[${method} ${path}] header: ${JSON.stringify(headers)}`)
        app.logger.info(`[${method} ${path}] params: ${JSON.stringify(params)}`)

        const schema = app.routerSchema[path]?.[method.toLowerCase()];
        if (!schema) {
            return await next();
        }
        let valid = true
        let validate;
        // ajv 校验器
        if (valid && headers && schema.headers) {
            schema.headers.$schema = $schema
            validate = ajv.compile(schema.headers);
            valid = validate(headers)
        }
        if (valid && body && schema.body) {
            schema.body.$schema = $schema
            validate = ajv.compile(schema.body);
            valid = validate(body)
        }
        if (valid && query && schema.query) {
            schema.query.$schema = $schema
            validate = ajv.compile(schema.query);
            valid = validate(query)
        }
        if (valid && params && schema.params) {
            schema.params.$schema = $schema
            validate = ajv.compile(schema.params);
            valid = validate(params)
        }

        if (!valid) {
            ctx.status = 200
            ctx.body = {
                success: false,
                message: `request validate fail:${ajv.errorsText(validate.errors)}`,
                code: 442
            }
        }
        await next()
    }
}