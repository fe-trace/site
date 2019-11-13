## webpack 模块加载
webpack 将源码编译过后，将源码拆分成 chunk，最后输出结果。最终结果在生成时添加了许多模块化相关的代码，下面将介绍 webpack 编译后的模块以及如何做模块加载。

### 模块类型
+ 初始化模块：页面初始化时需要加载的模块
+ 动态加载模块：动态引用的模块

### 初始化模块
执行流程：新增一个对象，传入对象到具体模块中执行，将模块导出的数据保存在对象中，并缓存在内存中
```
function __webpack_require__(moduleId) {
    // 判断模块是否已经加载，已经加载直接返回模块的 exports 对象
    if(installedModules[moduleId]) {
        return installedModules[moduleId].exports;
    }
    // 创建一个模块对象，并保存在内存中
    var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
    };
    // 传入创建的模块对象，并执行模块代码
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // 设置模块已经加载完成标示
    module.l = true;
    // 返回模块的 exports 对象
    return module.exports;
}
```

### 动态加载
执行流程：动态加载模块分为两个过程，先讲模块代码请求到本地，完成之后再执行一次模块的加载过程（和初始化模块加载逻辑一致）。整个过程通过 promise 来完成，请求异步模块时会创建一个 promise。并将 promise 返回给调用者。在模块加载完成后自动执行，执行过程会改变之前生成 promise 的状态。异步模块的调用者持有 promise 的引用所以会得到通知，从而再以初始化加载模块的方式得到异步模块的返回值。
```
__webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];
    var installedChunkData = installedChunks[chunkId];
    // 判断模块是否已经加载（重复加载异步模块的情况）
    if(installedChunkData !== 0) {

        // 模块当前正在加载
        if(installedChunkData) {
            promises.push(installedChunkData[2]);
        } else {
            // 创建一个 promise 用来做模块加载通知（将 promise 的 resolve 回调保存起来）
            var promise = new Promise(function(resolve, reject) {
                installedChunkData = installedChunks[chunkId] = [resolve, reject];
            });
            // 保存创建的 promise ，用来返回给加载异步模块的调用者
            promises.push(installedChunkData[2] = promise);
            // 新增 script 标签用来加载 JS 模块
            var script = document.createElement('script');
            var onScriptComplete;
            script.charset = 'utf-8';
            script.timeout = 120;
            if (__webpack_require__.nc) {
                script.setAttribute("nonce", __webpack_require__.nc);
            }
            script.src = jsonpScriptSrc(chunkId);
            var error = new Error();
            onScriptComplete = function (event) {
                script.onerror = script.onload = null;
                clearTimeout(timeout);
                var chunk = installedChunks[chunkId];
                if(chunk !== 0) {
                    if(chunk) {
                        var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                        var realSrc = event && event.target && event.target.src;
                        error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                        error.name = 'ChunkLoadError';
                        error.type = errorType;
                        error.request = realSrc;
                        chunk[1](error);
                    }
                    installedChunks[chunkId] = undefined;
                }
            };
            var timeout = setTimeout(function(){
                onScriptComplete({ type: 'timeout', target: script });
            }, 120000);
            script.onerror = script.onload = onScriptComplete;
            document.head.appendChild(script);
        }
    }
    // 将在异步请求模块时生成对应的 promise 返回，当请求成功，模块代码执行时会触发改变 promise 的状态，从而通知异步模块的调用者，调用者再通过加载初始化模块的方式，再加载一次异步模块
    return Promise.all(promises);
};
```