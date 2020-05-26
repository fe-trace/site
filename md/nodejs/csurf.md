### csurf 跨站请求伪造验证
csurf 用于处理跨站请求伪造，通过生成一个session生命周期的token，并保存在cookie中，每次请求时会验证当前请求头中是否存在token。不存在认为是非法请求。

执行流程
```
function csurf (options) {
    var opts = options || {}
    // 设置保存csrf信息的cookie字段
    var cookie = getCookieOptions(opts.cookie)
    // 设置保存csrf信息的session字段（使用session时使用）
    var sessionKey = opts.sessionKey || 'session'
    // 获取csrf信息的方法
    var value = opts.value || defaultValue
    // token对象用于生成验证token
    var tokens = new Tokens(opts)
    // 忽略不需要验证的请求
    var ignoreMethods = opts.ignoreMethods === undefined
        ? ['GET', 'HEAD', 'OPTIONS']
        : opts.ignoreMethods
    // 使用map保存不需要验证的请求
    var ignoreMethod = getIgnoredMethods(ignoreMethods)
    // express中间件
    return function csrf (req, res, next) {
        var secret = getSecret(req, sessionKey, cookie)
        var token

        // 根据csrf的值生成token
        req.csrfToken = function csrfToken () {
            // 从请求头中获取csrf信息
            var sec = !cookie
                ? getSecret(req, sessionKey, cookie)
                : secret

            if (token && sec === secret) {
                return token
            }

            if (sec === undefined) {
                sec = tokens.secretSync()
                setSecret(req, res, sessionKey, sec, cookie)
            }

            secret = sec
            token = tokens.create(secret)
            return token
        }

        // 请求头中不存在csrf信息时，生成csrf token 并保存
        if (!secret) {
            secret = tokens.secretSync()
            setSecret(req, res, sessionKey, secret, cookie)
        }
        // 验证生成的csrf信息和请求头中的token是否一致，不一致抛出异常
        if (!ignoreMethod[req.method] && !tokens.verify(secret, value(req))) {
            return next(createError(403, 'invalid csrf token', {
                code: 'EBADCSRFTOKEN'
            }))
        }
        next()
    }
}
```