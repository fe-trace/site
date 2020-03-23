## next.js request
next.js 处理路由请求过程是一个复杂的过程。主要包括：路由拦截，资源动态编译。下面篇幅将探索整个处理过程。

### 路由拦截

#### 请求入口
文件：next\dist\server\lib\start-server.js
```
const app = (0, _next.default)(serverOptions)
const srv = _http.default.createServer(app.getRequestHandler())
```

#### 静态资源编译--准备阶段
静态资源通过调用 hot-reloader 进行资源编译。

文件：next\dist\server\hot-reloader.js
```
async start () {
    // 清除之前的编译文件
    await this.clean()
    // 生成 webpack 配置对象：编译服务端资源配置和编译客户端资源配置
    const configs = await this.getWebpackConfig()
    // 生成两个 webpack 实例对象
    const multiCompiler = (0, _webpack.default)(configs)
    // 1. 监听 webpack 中提供的钩子函数获取最终的编译结果
    // 2. 调用各种中间件生成拦截规则
    const buildTools = await this.prepareBuildTools(multiCompiler)
    // 将 buildTools 中返回的中间件实例保存
    this.assignBuildTools(buildTools)
    // 通过调用 buildTools 中保存的 webpack-dev-middleware 实例获取最终的编译结果
    this.stats = (await this.waitUntilValid()).stats[0]
}

async prepareBuildTools (multiCompiler) {
    // 监听服务端 webpack 实例
    multiCompiler.compilers[1].hooks.done.tap('NextjsHotReloaderForServer', stats => {
        const { compilation } = stats;
        // ....
        this.serverPrevDocumentHash = documentChunk.hash;
    });
    // 监听客户端 webpack 实例
    multiCompiler.compilers[0].hooks.done.tap('NextjsHotReloaderForClient', stats => {
        const { compilation } = stats;
        // ....
        this.initialized = true;
        this.stats = stats;
        this.prevChunkNames = chunkNames;
    })
    // 监听 webpack 实例中钩子函数: invalid/run/done/watchRun
    // 生成HTTP请求拦截规则
    const webpackDevMiddleware = (0, _webpackDevMiddleware.default)(
        multiCompiler,
        webpackDevMiddlewareConfig
    )
    // 热替换功能
    const webpackHotMiddleware = (0, _webpackHotMiddleware.default)(
      multiCompiler.compilers[0],
      { path: '/_next/webpack-hmr', log: false, heartbeat: 2500 }
    )
    // 动态添加入口文件进行编译
    const onDemandEntries = (0, _onDemandEntryHandler.default)(
      webpackDevMiddleware,
      multiCompiler,
      {
        dir: this.dir,
        buildId: this.buildId,
        pagesDir: this.pagesDir,
        distDir: this.config.distDir,
        reload: this.reload.bind(this),
        pageExtensions: this.config.pageExtensions,
        publicRuntimeConfig: this.config.publicRuntimeConfig,
        serverRuntimeConfig: this.config.serverRuntimeConfig,
        ...this.config.onDemandEntries
      }
    )
    return { webpackDevMiddleware, webpackHotMiddleware, onDemandEntries }
}
```

#### 处理过程-以请求页面为例

如果请求页面静态资源，会根据请求路径动态编译 pages 下面的文件
```
// 文件：next\dist\server\next-dev-server.js
async run(req, res, parsedUrl) {
    // 等待初始化编译完成后再相应之后的请求
    await this.devReady;
    // ...
    // dev-server 中并未处理过多的逻辑，请求拦截在继承的父类 next-server 中处理
    return super.run(req, res, parsedUrl);
}

// 文件：next\dist\next-server\server\next-server.js
async run(req, res, parsedUrl) {
    // 不影响主流程的操作，未深入看
    this.handleCompression(req, res);
    try {
        // 根据路由规则匹配处理函数，页面会被 Catchall render 路由拦截（路由在启动时调用generateRoutes生成）
        const matched = await this.router.execute(req, res, parsedUrl);
        if (matched) {
            return;
        }
    }
    catch (err) {
        if (err.code === 'DECODE_FAILED') {
            res.statusCode = 400;
            return this.renderError(null, req, res, '/_error', {});
        }
        throw err;
    }
    await this.render404(req, res, parsedUrl);
}

generateRoutes() {
    // ...
    routes.push({
        match: router_1.route('/:path*'),
        type: 'route',
        name: 'Catchall render',
        fn: async (req, res, params, parsedUrl) => {
            const { pathname, query } = parsedUrl;
            if (!pathname) {
                throw new Error('pathname is undefined');
            }
            // 拦截页面不相关逻辑
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
}

async render(req, res, pathname, query = {}, parsedUrl) {
    const url = req.url;
    // ...
    // 调用 next-dev-server 中的renderToHTML
    const html = await this.renderToHTML(req, res, pathname, query, {
        dataOnly: (this.renderOpts.ampBindInitData && Boolean(query.dataOnly)) ||
            (req.headers &&
                (req.headers.accept || '').indexOf('application/amp.bind+json') !==
                    -1),
    });
    if (html === null) {
        return;
    }
    return this.sendHTML(req, res, html);
}

async renderToHTML(req, res, pathname, query, options = {}) {
    try {
        // hot-reloader 在编译资源准备阶段保存了 onDemandEntries 实例用来动态添加入口文件重新触发 webpack 进行编译，这里获取到请求路径然后查找 pages 下面对应的路由进行重新编译
        await this.hotReloader.ensurePage(pathname).catch(async err => {
            // ...
        });
    } catch (err) {
        // ...
    }
    const html = await super.renderToHTML(req, res, pathname, query, options);
    return html;
}

// hot-reloader 中的重新编译流程
async ensurePage (page) {
    const bundleFile = pageUrl === '/' ? '/index.js' : `${pageUrl}.js`
    const name = (0, _path.join)('static', buildId, 'pages', bundleFile)
    const absolutePagePath = pagePath.startsWith('next/dist/pages') ? require.resolve(pagePath) : (0, _path.join)(pagesDir, pagePath)

    // 将根据路由匹配出来的文件路径保存在 entries 中，重新编译时会从中获取编译路径
    entries[normalizedPage] = { name, absolutePagePath, status: ADDED }
    // 添加事件回调，编译完成后触发
    doneCallbacks.once(normalizedPage, handleCallback)
    // 调用 watching(watching=webpack.watch) 实例通知 webpack 进行重新编译
    invalidator.invalidate();
    function handleCallback (err) {
        if (err) return reject(err)
        resolve()
    }
}

// 编译完成后开始生成渲染模板（next-server）
renderToHTML(req, res, pathname, query = {}, { amphtml, dataOnly, hasAmp, } = {}) {
    return this.findPageComponents(pathname, query).then(result => {
        return this.renderToHTMLWithComponents(req, res, pathname, query, result, Object.assign({}, this.renderOpts, { amphtml, hasAmp, dataOnly }));
    });
}

async renderToHTMLWithComponents(req, res, pathname, query = {}, result, opts) {
    return render_1.renderToHTML(req, res, pathname, query, Object.assign({}, result, opts));
}

// 调用 Component 组件获取对应的HTML
render_1.renderToHTML() {
    // 1.调用组件的 getInitialProps 获取初始值
    // 2.获取对应路由涉及的资源路径
    // 3.调用 Component 组件生成 HTML
    // 4.将HTML和资源路径组合生成最终的HTML代码
}

```