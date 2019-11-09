## webpack-dev-server
webpack-dev-server 用于在开发过程中实现热替换功能，笔者用的比较多，但是对于原理不是太了解，现准备深入了解下其实现原理。

### 配置
```
{
    devServer: {
        hot/hotOnly: true,
        port: 9000,
        compress: true,
        contentBase: path.join(__dirname, "dist"),
    }
    ...
}
```
备注：hot-代码更新会刷新页面，hotOnly-代码更新不会刷新页面

### 使用
```
webpack-dev-server --config
```
备注：webpack-cli 默认的配置文件是 (webpack.config|webpackfile)(.js|.json|.ts|..) 匹配结果

### webpack 
在说具体流程之前需要先了解一点点 webpack 的实现原理。
+ webpack 加载配置文件实例化生成 compiler 对象
+ webpack 执行过程像一条流水线，每个阶段执行完成会触发 compiler.hooks 对象上的回调函数，通过在 hooks 对象上注册事件回调，可以获取编译后的文件信息
 
### 实现流程
webpack-dev-server/lib/Server.js 部分源码
```
constructor(compiler, options = {}, _log) {
    // webpack 实例对象 compiler 
    this.compiler = compiler;

    // 解析 webpack.config.js 得到的配置信息
    this.options = options;

    // socket server 的实现模块，用来在 node 端启动一个 socket 服务和前端通信
    this.socketServerImplementation = getSocketServerImplementation(
        this.options
    );

    // 保存前端建立的socket链接，编译完成后用来发送消息通知前端重新拉取代码
    this.sockets = [];

    // 在 compiler 对象上监听 comiple/invalid/done 事件，用以通知前端获取更新
    this.setupHooks();

    // 实例化一个 express 作为 http 服务
    this.setupApp();

    // 生成中间件保存在 this.middleware 上。所有资源请求都会在其中被拦截，然后从 compiler 对象中获取对应请求的内容并返回
    this.setupDevMiddleware();

    // 将生成的中间件和 express 实例结合
    routes(this.app, this.middleware, this.options);

    // 将 express 对象传给 http.createServer 调用 listen 方法，监听到具体端口上，http 服务启动完成
    this.createServer();
}
```

### 静态资源服务实现细节
首次加载过程
+ this.setupDevMiddleware 执行过程会生成 express 中间件。webpack编译完成之后会将 done 事件返回的静态资源对象保存在 context.webpackStats 对象上
+ express 加载生成的中间件启动静态资源服务
+ 所有静态资源请求被中间件拦截，通过URL从 webpackStats 中获取具体的内容并返回
+ 首次加载流程完成
+ 前端加载完成后建立 socket 链接
+ node 端响应 socket 链接并保存

更新过程
+ this.setupHooks 监听了 compiler 中的 done 事件，代码更新之后会通过 socket 发送更新后的 hash 到前端
+ 前端收到更新通知后获取更新的代码

### 总结
webpack-dev-server 实现的核心是 webpack 提供的钩子函数，他能获取到编译之后的文件信息，再通过 express 和 middleware 拦截请求进行资源的响应。

### 其他
在阅读源码过程中发现一些以前忽略的细节：
+ require.resolve
+ process API