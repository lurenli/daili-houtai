var path = require("path");
var webpack = require("webpack");

module.exports = {
    //入口
    entry: [path.resolve(__dirname, "./src/index.jsx")],
    //输出目录
    output: {
        path:path.join(__dirname,"/dist"),
        filename: 'bundle.js',
        publicPath: '/assets'
    },
    //注入环境变量，可以直接通过process.env.NODE_ENV获取
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev'),
                'HOST_URL' : JSON.stringify('http://www.huaxur.com/game-mng'),
                'IMAGE_PRIFIX' : JSON.stringify('http://jinshang-hz.oss-cn-hangzhou.aliyuncs.com/')
            }
        }),
        // new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            compress: {
                warnings: false
            }
        })
    ],
    //loader配置
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.js$/,
                loaders: [ 'babel' ],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=830000'
            }
        ]
    },
    //第三方js库引用
    externals: {
    },
    //配置目录结构，添加目录接口import时只需要文件名，不需要目录名。
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
