## next.js
next.js 作为 react 服务端渲染的框架，一直对其实现原理比较好奇。整体的实现流程和 webpack-dev-server 相似，主要分为两部分：
1. 通过 webpack 编译静态资源，编译完成通过钩子函数获取到最终结果
2. 通过 HTTP 模块启动本地服务，拦截请求并处理

### 启动服务
源文件：next\dist\server\next-dev-server.js
启动服务过程中生成一个 next 实例，实例中自定义了路由规则拦截静态资源，页面，API请求，自定义路由，请求转发等
```
// 生成 next 实例
const app = (0, _next.default)(serverOptions);
// 调用http模块创建网络服务
const srv = _http.default.createServer(app.getRequestHandler())
```

### 加载自定义路由拦截HTTP请求
源文件：next\dist\server\next-dev-server.js（next-dev-server 继承 next-server）
```
// http服务启动后，加载路由规则
async prepare() {
    await this.loadCustomRoutes();
    if (this.customRoutes) {
        const { redirects, rewrites } = this.customRoutes;
        if (redirects.length || rewrites.length) {
            // TODO: don't reach into router instance
            this.router.routes = this.generateRoutes();
        }
    }
}
```

### 编译静态资源
源文件：next\dist\server\next-dev-server.js

服务启动后，调用 next 实例的 prepare 方法开始执行编译。编译过程通过调用 hot-reloader 进行前后端代码的编译和打包。并将 hot-reloader 实例挂载到 next 实例上。
```
async prepare() {
    // 生成 hot-reloader 实例对象，初始化参数和配置
    this.hotReloader = new _hotReloader.default(this.dir, {
        pagesDir: this.pagesDir,
        config: this.nextConfig,
        buildId: this.buildId
    });
    // 调用 webpack 进行静态资源编译
    await this.hotReloader.start();
}
```

源文件：next\dist\server\hot-reloader.js

hot-reloader 处理过程中，通过 webpack 配置对静态资源进行编译，最终将结果保存在 webpack-dev-middleware 实例上
```
async start() {
    // 清除之前的编译结果
    await this.clean();
    // 获取 webpack 配置文件
    const configs = await this.getWebpackConfig();
    // 生成 webpack 实例
    const multiCompiler = (0, _webpack.default)(configs);
    // 绑定钩子函数，启动热替换功能
    const buildTools = await this.prepareBuildTools(multiCompiler);
    // 保存 buildTools 中的 webpackDevMiddleware 对象，用于获取编译之后的结果
    this.assignBuildTools(buildTools);
    // 获取编译后的结果
    this.stats = (await this.waitUntilValid()).stats[0];
}
```
prepareBuildTools 中调用 webpack-dev-middleware 公共库逻辑，webpack-dev-middleware 调用 webpack 编译资源，并监听 webpack 提供的钩子函数，在编译完成后将结果挂载到 context.webpackStats 上。hot-reloader 可以通过调用webpack-dev-middleware 实例返回的 waitUntilValid 方法获取对编译之后的结果：context.webpackStats。
调用 waitUntilValid 时，如果编译未完成会先将回调保存在 content.callbacks 数组中，编译完成后触发回调将结果返回。
```
context.compiler.hooks.done.tap('WebpackDevMiddleware', done);
function done(stats) {
    context.state = true;
    context.webpackStats = stats;

    process.nextTick(() => {
        // check if still in valid state
        if (!context.state) {
            return;
        }

        context.options.reporter(context.options, {
            log,
            state: true,
            stats,
        });
        // 编译完成之后通过回调将结果向上传递给 hot-reloader 实例
        const cbs = context.callbacks;
        context.callbacks = [];
        cbs.forEach((cb) => {
        cb(stats);
    });
});
``` 

### 请求处理逻辑
访问具体页面时，所有请求都会被 handleRequest 拦截，然后根据 URL 匹配具体的路由处理方式
```
// 启动服务时监听 next 实例上的 getRequestHandler 方法
_http.default.createServer(app.getRequestHandler());

// 具体处理逻辑
getRequestHandler() {
    return this.handleRequest.bind(this);
}
// 处理URL，获取参数
handleRequest(req, res, parsedUrl) {
    // Parse url if parsedUrl not provided
    if (!parsedUrl || typeof parsedUrl !== 'object') {
        const url = req.url;
        parsedUrl = url_1.parse(url, true);
    }
    // Parse the querystring ourselves if the user doesn't handle querystring parsing
    if (typeof parsedUrl.query === 'string') {
        parsedUrl.query = querystring_1.parse(parsedUrl.query);
    }
    res.statusCode = 200;
    return this.run(req, res, parsedUrl).catch(err => {
        this.logError(err);
        res.statusCode = 500;
        res.end('Internal Server Error');
    });
}
// 匹配具体的处理逻辑
async run(req, res, parsedUrl) {
    this.handleCompression(req, res);
    try {
        const matched = await this.router.execute(req, res, parsedUrl);
        if (matched) {
            return;
        }
    } catch (err) {
        if (err.code === 'DECODE_FAILED') {
            res.statusCode = 400;
            return this.renderError(null, req, res, '/_error', {});
        }
        throw err;
    }
    await this.render404(req, res, parsedUrl);
}

// 以页面请求为例，请求会被 catchall render 规则拦截
routes.push({
    match: router_1.route('/:path*'),
    type: 'route',
    name: 'Catchall render',
    fn: async (req, res, params, parsedUrl) => {
        const {
            pathname,
            query
        } = parsedUrl;
        if (!pathname) {
            throw new Error('pathname is undefined');
        }
        // Used in development to check public directory paths
        if (await this._beforeCatchAllRender(req, res, params, parsedUrl)) {
            return {
                finished: true,
            };
        }
        await this.render(req, res, pathname, query, parsedUrl);
        return {
            finished: true,
        };
    },
});
// 调用具体的渲染逻辑，根据URL获取对应的组件生成HTML
async render(req, res, pathname, query = {}, parsedUrl) {
    const url = req.url;
    if (url.match(/^\/_next\//) ||
        (this.hasStaticDir && url.match(/^\/static\//))) {
        return this.handleRequest(req, res, parsedUrl);
    }
    if (utils_3.isBlockedPage(pathname)) {

        return this.render404(req, res, parsedUrl);
    }

    const html = await this.renderToHTML(req, res, pathname, query, {
        dataOnly: (this.renderOpts.ampBindInitData && Boolean(query.dataOnly)) ||
            (req.headers &&
                (req.headers.accept || '').indexOf('application/amp.bind+json') !==
                -1),
    });
    // Request was ended by the user
    if (html === null) {
        return;
    }
    return this.sendHTML(req, res, html);
}
// 渲染时根据 URL 匹配对应的页面组件
renderToHTML(req, res, pathname, query = {}, {
        amphtml,
        dataOnly,
        hasAmp,
    } = {}) {
    return this.findPageComponents(pathname, query)
        .then(result => {
            return this.renderToHTMLWithComponents(
                req, 
                res, 
                pathname, 
                query, 
                result, 
                Object.assign({}, this.renderOpts, {
                    amphtml,
                    hasAmp,
                    dataOnly
                })
            );
        }, err => {

        }    
    );
}
// 调用 renderToHTMLWithComponents
function renderToHTMLWithComponents() {
    render_1.renderToHTML(req, res, pathname, query, renderOpts);
}
// 渲染 React 组件获取最终 HTML (next\dist\next-server\server\render.js) 
```

### 总结
本次阅读nextJs源码只大概的看了下实现流程，具体的很多细节并未探究：
+ 1.CSS在整个过程中如何处理
+ 2.开发模式下路由的动态编译
+ 3.服务的热替换处理
+ 4.懒加载模块在编译过程的处理