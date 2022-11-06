const os = require("os");
const path = require("path"); //nodejs核心模块，专门用来处理路径问题
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const threads = os.cpus().length; //cpu核数

module.exports = {
  //入口
  entry: "./src/main.js", //相对路径
  //输出
  output: {
    //文件的输出路径(开发模式没有输出)
    //_dirname nodejs里的变量，代表当前文件的文件夹目录
    path: undefined,
    //入口文件打包输出文件名
    filename: "static/js/main.js",
    //自动清空上次打包结果，即打包前将path整个目录清空
    // clean: true,
  },
  //加载器
  module: {
    rules: [
      //loader的配置
      {
        //每个文件只能被其中一个loader配置处理
        oneOf: [
          {
            test: /\.css$/, //只检测以.css结尾的文件
            //执行顺序从右到左，从下到上
            use: [
              "style-loader", //将js中的css通过创建style标签添加到html文件中生效
              "css-loader", //将css资源编译成commonjs的模块到js中
            ],
          },
          {
            test: /\.less$/, //只检测以.less结尾的文件
            //执行顺序从右到左，从下到上
            use: [
              "style-loader", //将js中的css通过创建style标签添加到html文件中生效
              "css-loader", //将css资源编译成commonjs的模块到js中
              "less-loader", //将less编译成css文件
            ],
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/, //只检测以.less结尾的文件
            type: "asset",
            //执行顺序从右到左，从下到上
            parser: {
              dataUrlCondition: {
                //小于10kb的图片转base64
                //优点：减少请求数量 缺点：体积会大一点点
                maxSize: 10 * 1024, //10kb
              },
            },
            generator: {
              filename: "static/images/[hash][ext][query]",
            },
          },
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/, //只检测以.less结尾的文件
            type: "asset/resource",
            //执行顺序从右到左，从下到上
            parser: {
              dataUrlCondition: {
                //小于10kb的图片转base64
                //优点：减少请求数量 缺点：体积会大一点点
                maxSize: 10 * 1024, //10kb
              },
            },
            generator: {
              //输出名称
              filename: "static/media/[hash][ext][query]",
            },
          },
          {
            test: /\.js$/, //只检测以.less结尾的文件
            exclude: /node_modules/, //排除node_modules中的js文件（这些文件不处理）
            // include:path.resolve(__dirname,"../src"), //只处理src下的文件，其他文件不处理
            use: [
              {
                loader: "thread-loader", //开启多进程
                options: {
                  works: threads, //进程数量
                },
              },
              {
                loader: "babel-loader",
                options: {
                  // presets: ["@babel/preset-env"],
                  cacheDirectory: true, //开启babel缓存
                  cacheCompression: false, //关闭缓存文件压缩，因为压缩需要时间
                  plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                },
              },
            ],
          },
        ],
      },
    ],
  },
  //插件
  plugins: [
    //plugin的配置
    new ESLintPlugin({
      //检测哪些文件
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", //默认值，不写也是有效果的
      cache: true, //开启缓存
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ),
      threads, //开启多进程设置进程数量
    }),
    new HtmlWebpackPlugin({
      //模板：以public/index.html文件创建新的html文件
      //新的html文件特点：1.结构和原来一致；2.自动引入打包输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  //开发服务器：不会输出资源，在内存中编译打包的
  devServer: {
    host: "localhost", //启动服务器域名
    port: "3000", //启动服务器端口号
    open: true, //是否自动打开浏览器
    // hot: false, //关闭HMR,默认开启状态
  },

  //模式
  mode: "development",
  devtool: "cheap-module-source-map",
};
