import webpack from 'webpack'
import path from 'path' 
import HWP from 'html-webpack-plugin'
import MiniCss from 'mini-css-extract-plugin'

const WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev'
const htmlConfig = (name, title)=>{
    return {
        template    : `./src/pages/${name}.html`,
        filename    : `view/${name}.html`,
        title       : title,
        inject      : true,
        hash        : true,
        chunks      : ['public','common','vendor',name]
    }
}

export default {
    entry:{
        public:["./src/public/index.js"],
        index:'./src/script/index.js'
    },
    output:{
        path: path.resolve(__dirname,'./dist'),
        publicPath:'dev' === WEBPACK_ENV ? '/dist/' : '//s.mymarsmall.cn/',
        filename: 'js/[name].js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader'
                },
                exclude:'/node_modules/'
            },    
            {
                test:/\.css$/,
                use:[MiniCss.loader, 'css-loader'] 
            },     
            {
                test:/\.styl$/,
                use:[MiniCss.loader, 'css-loader','stylus-loader'] 
            },
            {
                test:/\.(jpg|png|gif|svg)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        outputPath:'images/',
                        limit:100
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use:{
                    loader:'url-loader',
                    options:{
                        outputPath:'fonts/',   
                        limit:100           
                    }
                }
            }

        ]
    },
    optimization:{
        splitChunks:{
            cacheGroups:{
                common: {
                    name: "common",
                    chunks: "all",
                    minChunks:3,
                    minSize: 10,
                    priority: 0
                },
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10
                }
            }
        }
    },
    plugins:[
        new HWP(htmlConfig('index','首页')),        
        new MiniCss({
            filename: "css/[name].css",
            chunkFilename: "css/[name].[id].css"
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve:{
        alias:{
            "@": __dirname + '/src',
            "utils": __dirname + '/src/utils',
            "api": __dirname + '/src/api',
            "style": __dirname + '/src/style',
            "template": __dirname + '/src/template',            
        }
    },
    devServer: {
        // contentBase: path.resolve(__dirname, './dist'),
        publicPath: '/dist',
        // host: 'localhost',
        // port: 8080, 
        // historyApiFallback: true,
        proxy: {            
            '/user/*': { 
                target: 'http://www.happymmall.com',    
                changeOrigin: true
            }
        }
    }
}