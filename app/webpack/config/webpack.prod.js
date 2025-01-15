const path = require('path')
const merge = require('webpack-merge')
const os = require('os')
const HappyPack = require('happypack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')


// 多线程 build 设置
const happypackCommonConfig = {
    debug: false,
    threadPool: HappyPack.ThreadPool({ size: os.cpus().length })
}
// 获取基类配置
const baseConfig = require('./webpack.base')

const webpackConfig = merge.smart(baseConfig, {
    // 指定环境配置
    mode: 'production',
    //
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'happypack/loader?id=css'
                ]
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(process.cwd(), './app/pages'),
                ],
                use: ['happypack/loader?id=js']

            }
        ],

    },
    // webpack不会有大量的 hints 信息，默认为warning
    performance: {
        hints: false
    },
    plugins: [
        // 每次 build 前，清空 public/dist 目录，
        new CleanWebpackPlugin(['public/dist'], {
            root: path.resolve(process.cwd(), './app/'),
            exclude: [], // 需要排除的内容
            verbose: true, // 是否打印详细的清理日志。
            dry: false, // 是否启用“干运行”模式。在干运行模式下，插件不会实际删除文件，而只是输出将要删除的文件列表
        }),
        // 提取 css 的公共部分，有效利用缓存，（非公共部分使用 inline）
        new MiniCssExtractPlugin({
            chunkFilename: 'css/[name]_[contenthash:8].bundle.css',
        }),
        // 优化并压缩 css 资源
        new CSSMinimizerPlugin(),
        // 多线程打包 JS, 加快打包速度
        new HappyPack({
            ...happypackCommonConfig,
            id: 'js',
            loaders: [`babel-loader?${JSON.stringify({
                presets: ['@babel/preset-env'],
                plugins: [
                    '@babel/plugin-transform-runtime'
                ]
            })}`]
        }),
        // 多线程打包 Css,加快打包速度
        new HappyPack({
            ...happypackCommonConfig,
            id: 'css',
            loaders: [{
                path: 'css-loader',
                options: {
                    importLoaders: 1,
                }
            }]
        }),
        // 浏览器在请求资源时，不发送用户的身份凭证
        new HtmlWebpackInjectAttributesPlugin({
            crossOrigin: 'anonymous'
        }),
    ],
    optimization: {
        // 使用 TerserPlugin 的并发和缓存，提升压缩阶段的性能
        // 清除 console.log 
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                cache: true, // 启用缓存来加速构建过程
                parallel: true, // 利用多核cpu的优势来加快压缩速度
                terserOptions: {
                    compress: {
                        drop_console: true, // 去掉 console.log 内容
                    }
                }
            })
        ]
    },
    // 生产环境的 output 
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod'),
        publicPath: 'dist/prod',
        crossOriginLoading: 'anonymous'
    },
})

module.exports = webpackConfig