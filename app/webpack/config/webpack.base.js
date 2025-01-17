const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * webpack 基础配置
 */

module.exports = {
    // 入口配置
    entry: {
        'entry.page1': "./app/pages/page1/entry.page1.js",
        // 'entry.page2': "./app/pages/page2/entry.page2.js",
    },
    // 模块解析配置（决定了要加载哪些模块，以及用什么样的方式去解析）
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader'
                }
            },
            {
                test: /\.js$/,
                // 只对业务代码进行babel，加快webpack打包速度
                include: [
                    path.resolve(process.cwd(), './app/pages'),
                ],
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|jpe?g|gif)(\?.+)$/,
                use: {
                    loader: 'url-loader',
                    // option: {
                    //     limit: 300,
                    //     esModule: false,
                    // } 
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)$/,
                use: {
                    loader: 'file-loader'
                }
            },
        ]
    },

    // 配置模块解析的具体行为(找到具体的路径)
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css'],
        alias: {
            $page: path.resolve(process.cwd(), './app/pages'),
            $common: path.resolve(process.cwd(), './app/pages/common'),
            $widgets: path.resolve(process.cwd(), './app/pages/widgets'),
            $common: path.resolve(process.cwd(), './app/pages/common'),
            $store: path.resolve(process.cwd(), './app/pages/store'),
        }
    },
    // 配置 webpack 插件
    plugins: [
        // 处理.vue文件，这个插件是必须的
        // 它的职能是将你定义过的其他规则复制并应用到 .vue文件里
        // 例如，如果有一条匹配规则/\.js$/ 的规则，那么它会应用到 .vue 文件的 <script> 板块中
        new VueLoaderPlugin(),
        // 把第三方库暴露到window context 下 
        new webpack.ProvidePlugin({
            Vue: 'vue',
            axios: 'axios',
            _: 'lodash'
        }),
        // 定义全局常量
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: 'true', // 支持 vue 解析 optionAPI
            __VUE_PROD_DEVTOOLS__: 'false', // 禁用 vue 调试工具
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false', // 禁用生产环境显示 “水合”信息 
        }),

        // 构造最终渲染的页面模板
        new HtmlWebpackPlugin({
            // 产物 （最终模板） 输出路径
            filename: path.resolve(process.cwd(), './app/public/dist', 'entry.page1.html'),
            // 指定要使用的模板文件
            template: path.resolve(process.cwd(), './app/view/entry.html'),
            // 要注入的代码块
            chunks: ['entry.page1']
        }),
        // 构造最终渲染的页面模板
        // new HtmlWebpackPlugin({
        //     // 产物 （最终模板） 输出路径
        //     filename: path.resolve(process.cwd(), './app/public/dist', 'entry.page2.html'),
        //     // 指定要使用的模板文件
        //     template: path.resolve(process.cwd(), './app/view/entry.html'),
        //     // 要注入的代码块
        //     chunks: ['entry.page2']
        // })
    ],
    // 配置代码打包输出优化（代码分割，模块合并，缓存，TreeShaking,压缩等优化策略）
    optimization: {
        splitChunks: {
            chunks: 'all', // 对同步和异步模块都进行切割
            maxAsyncRequests: 10, // 每次异步加载的最大并行请求数
            maxInitialRequests: 10, // 入口点的最大并行请求数
            cacheGroups: {
                vendor: { // 第三方依赖库
                    test: /[\\/]node_modules[\\/]/, // 打包 node_modules 中的文件
                    name: 'vendor', // 模块名称
                    priority: 20, //优先级，数字越大，优先级越高
                    enforce: true, // 强制执行
                    reuseExistingChunk: true, // 复用已有的chunk
                },
                common: { // 公共模块，
                    name: 'common',// 模块名称
                    minChunks: 2, // 被两处应用即被归为公共模块
                    minSize: 1, //最小分割文件大小（1 byte）
                    priority: 10, //优先级
                    reuseExistingChunk: true, // 复用已有的chunk
                }
            }
        },
        // 将 webpack 运行时生产的代码打包到 runtime.js
        runtimeChunk: true
    }
}   