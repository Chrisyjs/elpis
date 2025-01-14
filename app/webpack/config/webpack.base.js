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
        'entry.page2': "./app/pages/page2/entry.page2.js",
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
                // use: {
                //     loader: 'url-loader',
                //     option: {
                //         limit: 300,
                //         esModule: false,
                //     }
                // }
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
    // 产物输出路径
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod'),
        publicPath: 'dist/prod',
        crossOriginLoading: 'anonymous'
    },
    // 配置模块解析的具体行为(找到具体的路径)
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css'],
        alias: {
            $page: path.resolve(process.cwd(), './app/pages')
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
        new HtmlWebpackPlugin({
            // 产物 （最终模板） 输出路径
            filename: path.resolve(process.cwd(), './app/public/dist', 'entry.page2.html'),
            // 指定要使用的模板文件
            template: path.resolve(process.cwd(), './app/view/entry.html'),
            // 要注入的代码块
            chunks: ['entry.page2']
        })
    ],
    // 配置代码打包输出优化（代码分割，模块合并，缓存，TreeShaking,压缩等优化策略）
    optimization: {}
}   