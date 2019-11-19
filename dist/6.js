(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{146:function(e,n,r){"use strict";r.r(n),n.default="<h2 id=\"webpack\">webpack 模块加载</h2>\n<p>webpack 将源码编译过后，将源码拆分成 chunk，最后输出结果。最终结果在生成时添加了许多模块化相关的代码，下面将介绍 webpack 编译后的模块以及如何做模块加载。</p>\n<h3 id=\"\">模块类型</h3>\n<ul>\n<li>初始化模块：页面初始化时需要加载的模块</li>\n<li>动态加载模块：动态引用的模块</li>\n</ul>\n<h3 id=\"-1\">初始化模块</h3>\n<p>执行流程：新增一个对象，传入对象到具体模块中执行，将模块导出的数据保存在对象中，并缓存在内存中</p>\n<pre><code>function __webpack_require__(moduleId) {\n    // 判断模块是否已经加载，已经加载直接返回模块的 exports 对象\n    if(installedModules[moduleId]) {\n        return installedModules[moduleId].exports;\n    }\n    // 创建一个模块对象，并保存在内存中\n    var module = installedModules[moduleId] = {\n        i: moduleId,\n        l: false,\n        exports: {}\n    };\n    // 传入创建的模块对象，并执行模块代码\n    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n    // 设置模块已经加载完成标示\n    module.l = true;\n    // 返回模块的 exports 对象\n    return module.exports;\n}\n</code></pre>\n<h3 id=\"-2\">动态加载</h3>\n<p>执行流程：动态加载模块分为两个过程，先将模块代码请求到本地，完成之后再执行一次模块的加载过程（和初始化模块加载逻辑一致）。整个过程通过 promise 来完成，请求异步模块时会创建一个 promise。并将 promise 返回给调用者。在模块加载完成后自动执行，执行过程会改变之前生成 promise 的状态。异步模块的调用者持有 promise 的引用所以会得到通知，从而再以初始化加载模块的方式得到异步模块的返回值。</p>\n<pre><code>__webpack_require__.e = function requireEnsure(chunkId) {\n    var promises = [];\n    var installedChunkData = installedChunks[chunkId];\n    // 判断模块是否已经加载（重复加载异步模块的情况）\n    if(installedChunkData !== 0) {\n\n        // 模块当前正在加载\n        if(installedChunkData) {\n            promises.push(installedChunkData[2]);\n        } else {\n            // 创建一个 promise 用来做模块加载通知（将 promise 的 resolve 回调保存起来）\n            var promise = new Promise(function(resolve, reject) {\n                installedChunkData = installedChunks[chunkId] = [resolve, reject];\n            });\n            // 保存创建的 promise ，用来返回给加载异步模块的调用者\n            promises.push(installedChunkData[2] = promise);\n            // 新增 script 标签用来加载 JS 模块\n            var script = document.createElement('script');\n            var onScriptComplete;\n            script.charset = 'utf-8';\n            script.timeout = 120;\n            if (__webpack_require__.nc) {\n                script.setAttribute(\"nonce\", __webpack_require__.nc);\n            }\n            script.src = jsonpScriptSrc(chunkId);\n            var error = new Error();\n            onScriptComplete = function (event) {\n                script.onerror = script.onload = null;\n                clearTimeout(timeout);\n                var chunk = installedChunks[chunkId];\n                if(chunk !== 0) {\n                    if(chunk) {\n                        var errorType = event &amp;&amp; (event.type === 'load' ? 'missing' : event.type);\n                        var realSrc = event &amp;&amp; event.target &amp;&amp; event.target.src;\n                        error.message = 'Loading chunk ' + chunkId + ' failed.\\n(' + errorType + ': ' + realSrc + ')';\n                        error.name = 'ChunkLoadError';\n                        error.type = errorType;\n                        error.request = realSrc;\n                        chunk[1](error);\n                    }\n                    installedChunks[chunkId] = undefined;\n                }\n            };\n            var timeout = setTimeout(function(){\n                onScriptComplete({ type: 'timeout', target: script });\n            }, 120000);\n            script.onerror = script.onload = onScriptComplete;\n            document.head.appendChild(script);\n        }\n    }\n    // 将在异步请求模块时生成对应的 promise 返回，当请求成功，模块代码执行时会触发改变 promise 的状态，从而通知异步模块的调用者，调用者再通过加载初始化模块的方式，再加载一次异步模块\n    return Promise.all(promises);\n};\n</code></pre>"}}]);