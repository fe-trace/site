## next.js

## 执行流程

### 启动服务
源文件：next\dist\server\next-dev-server.js
启动服务过程中生成一个 next 实例，实例中自定义了路由规则拦截静态资源，页面，API请求，自定义路由，请求转发等
```
// 生成 next 实例
const app = (0, _next.default)(serverOptions);

// 在实例内部定义拦截规则
this.router = new router_1.default(this.generateRoutes());
```
调用http模块创建网络服务
```
// 所有请求都都在 next 实例中处理，根据路由规则，匹配具体的处理方式
const srv = _http.default.createServer(app.getRequestHandler());
```

### 编译静态资源


### 请求处理逻辑
```
// 具体处理逻辑
getRequestHandler() {
    return this.handleRequest.bind(this);
}
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
```