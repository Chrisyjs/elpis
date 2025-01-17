/**
 * 前端封装的 curl 方法
 * @params options 请求参数
 */

const md5 = require("md5")
import { ElMessage } from 'element-plus'
import axios from 'axios'

const curl = ({
    url, // 请求地址
    method = 'post', // 请求方法
    headers = {}, // 请求头
    query = {}, // url query
    data = {},
    responseType = 'json',
    timeout = 60000,
    errorMessages = '网络异常'
}) => {
    // 接口签名处理（让接口变动态）
    const signKey = "adsadsads3313131adsadasdda1111"
    const st = Date.now()
    // 构造请求参数
    const axiosSetting = {
        url, // 请求地址
        method, // 请求方法
        params: query,
        headers: {
            ...headers,
            s_t: st,
            s_sign: md5(`${signKey}_${st}`),
        }, // 请求头
        data,
        responseType,
        timeout,
        errorMessages
    }
    return axios.request(axiosSetting).then((response) => {
        const resData = response.data || {}
        // 后端返回格式
        const { success } = resData
        console.log(resData)
        // 失败
        if (!success) {
            const { message, code } = resData
            if (code === 442) {
                ElMessage.error('请求参数异常');
            } else if (code === 445) {
                ElMessage.error('请求不合法');
            } else if (code === 50000) {
                ElMessage.error(message);
            }
            ElMessage.error(message)
            return Promise.resolve({ success, code, message })
        }
        // 成功
        const { data, metadata } = resData
        return Promise.reject({ success, data, metadata })
    }).catch(error => {
        const { message } = error
        if (message && message.match(/timeout/)) {
            return Promise.resolve({
                message: 'Request Timeout',
                code: 504
            })
        }
        return Promise.resolve(error)
    })
}

export default curl