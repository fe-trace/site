(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./md/webpack/optimization配置.md":
/*!**************************************!*\
  !*** ./md/webpack/optimization配置.md ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<h2 id=\\\"webpackoptimization\\\">webpack optimization 配置</h2>\\n<h3 id=\\\"\\\">概述</h3>\\n<p>optimization 选项用于配置和重写 webpack 默认的 chunk 生成方式</p>\\n<h3 id=\\\"-1\\\">默认配置</h3>\\n<pre><code>module.exports = {\\n  optimization: {\\n    splitChunks: {\\n      // 需要优化的模块来源：async-异步加载的模块，initial-从配置入口引用的模块，all-包含上述两者\\n      chunks: 'async',\\n      // 将模块拆分成chunk的最小体积，体积过小不会拆分，避免出现很多小的模块\\n      minSize: 30000,\\n      // 和minSize含义相反\\n      maxSize: 0,\\n      // 模块被引用的最少次数\\n      minChunks: 1,\\n      // 异步模块动态加载JS的最大个数，如果满足多个规则，但是拆分数量大于请求数，只会拆分体积大的模块\\n      maxAsyncRequests: 5,\\n      // 入口模块的并行加载JS最大请求数，如果满足多个规则，但是拆分数量大于请求数，只会拆分体积大的模块\\n      maxInitialRequests: 3,\\n      // 生成bundle文件名的模块来源和名称之间的定界符(entry ~ module.js)\\n      automaticNameDelimiter: '~',\\n      // 生成 bundle 文件名的最大字符数\\n      automaticNameMaxLength: 30,\\n      // 生成bundle的名称,true：基于chunk生成名称\\n      name: true,\\n      // 缓存组，继承上诉规则并重新配置，默认提供来了default和vendors两个规则\\n      cacheGroups: {\\n        vendors: {\\n          // 匹配具体的文件路径\\n          test: /[\\\\\\\\/]node_modules[\\\\\\\\/]/,\\n          // 拆分规则对应的权重，数组越大，生成规则越靠前\\n          priority: -10\\n        },\\n        default: {\\n          // 模块被引用的最小次数\\n          minChunks: 2,\\n          priority: -20,\\n          reuseExistingChunk: true\\n        }\\n      }\\n    }\\n  }\\n};\\n</code></pre>\\n<h3 id=\\\"-2\\\">实践</h3>\\n<pre><code>optimization: {\\n  // 拆分 webpack 实现模块加载相关代码\\n  runtimeChunk: {\\n    name: 'manifest'\\n  },\\n  splitChunks: {\\n    cacheGroups: {\\n      // 抽离第三方插件\\n      lib: {\\n        // 指定是node_modules下的第三方包\\n        test: /node_modules/,\\n        chunks: 'all',\\n        // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包\\n        priority: 10\\n      },\\n      // 抽离公共代码\\n      commons: { \\n        chunks: 'all',\\n        minChunks: 2,\\n        // 只要超出0字节就生成一个新包\\n        minSize: 0\\n      },\\n      // 抽离入口模块，可以不配置这个\\n      runtime: { \\n        chunks: 'initial',\\n        minSize: 0\\n      }\\n    }\\n  }\\n}\\n</code></pre>\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tZC93ZWJwYWNrL29wdGltaXphdGlvbumFjee9ri5tZC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL21kL3dlYnBhY2svb3B0aW1pemF0aW9u6YWN572uLm1kP2M0MDUiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgXCI8aDIgaWQ9XFxcIndlYnBhY2tvcHRpbWl6YXRpb25cXFwiPndlYnBhY2sgb3B0aW1pemF0aW9uIOmFjee9rjwvaDI+XFxuPGgzIGlkPVxcXCJcXFwiPuamgui/sDwvaDM+XFxuPHA+b3B0aW1pemF0aW9uIOmAiemhueeUqOS6jumFjee9ruWSjOmHjeWGmSB3ZWJwYWNrIOm7mOiupOeahCBjaHVuayDnlJ/miJDmlrnlvI88L3A+XFxuPGgzIGlkPVxcXCItMVxcXCI+6buY6K6k6YWN572uPC9oMz5cXG48cHJlPjxjb2RlPm1vZHVsZS5leHBvcnRzID0ge1xcbiAgb3B0aW1pemF0aW9uOiB7XFxuICAgIHNwbGl0Q2h1bmtzOiB7XFxuICAgICAgLy8g6ZyA6KaB5LyY5YyW55qE5qih5Z2X5p2l5rqQ77yaYXN5bmMt5byC5q2l5Yqg6L2955qE5qih5Z2X77yMaW5pdGlhbC3ku47phY3nva7lhaXlj6PlvJXnlKjnmoTmqKHlnZfvvIxhbGwt5YyF5ZCr5LiK6L+w5Lik6ICFXFxuICAgICAgY2h1bmtzOiAnYXN5bmMnLFxcbiAgICAgIC8vIOWwhuaooeWdl+aLhuWIhuaIkGNodW5r55qE5pyA5bCP5L2T56ev77yM5L2T56ev6L+H5bCP5LiN5Lya5ouG5YiG77yM6YG/5YWN5Ye6546w5b6I5aSa5bCP55qE5qih5Z2XXFxuICAgICAgbWluU2l6ZTogMzAwMDAsXFxuICAgICAgLy8g5ZKMbWluU2l6ZeWQq+S5ieebuOWPjVxcbiAgICAgIG1heFNpemU6IDAsXFxuICAgICAgLy8g5qih5Z2X6KKr5byV55So55qE5pyA5bCR5qyh5pWwXFxuICAgICAgbWluQ2h1bmtzOiAxLFxcbiAgICAgIC8vIOW8guatpeaooeWdl+WKqOaAgeWKoOi9vUpT55qE5pyA5aSn5Liq5pWw77yM5aaC5p6c5ruh6Laz5aSa5Liq6KeE5YiZ77yM5L2G5piv5ouG5YiG5pWw6YeP5aSn5LqO6K+35rGC5pWw77yM5Y+q5Lya5ouG5YiG5L2T56ev5aSn55qE5qih5Z2XXFxuICAgICAgbWF4QXN5bmNSZXF1ZXN0czogNSxcXG4gICAgICAvLyDlhaXlj6PmqKHlnZfnmoTlubbooYzliqDovb1KU+acgOWkp+ivt+axguaVsO+8jOWmguaenOa7oei2s+WkmuS4quinhOWIme+8jOS9huaYr+aLhuWIhuaVsOmHj+Wkp+S6juivt+axguaVsO+8jOWPquS8muaLhuWIhuS9k+enr+Wkp+eahOaooeWdl1xcbiAgICAgIG1heEluaXRpYWxSZXF1ZXN0czogMyxcXG4gICAgICAvLyDnlJ/miJBidW5kbGXmlofku7blkI3nmoTmqKHlnZfmnaXmupDlkozlkI3np7DkuYvpl7TnmoTlrprnlYznrKYoZW50cnkgfiBtb2R1bGUuanMpXFxuICAgICAgYXV0b21hdGljTmFtZURlbGltaXRlcjogJ34nLFxcbiAgICAgIC8vIOeUn+aIkCBidW5kbGUg5paH5Lu25ZCN55qE5pyA5aSn5a2X56ym5pWwXFxuICAgICAgYXV0b21hdGljTmFtZU1heExlbmd0aDogMzAsXFxuICAgICAgLy8g55Sf5oiQYnVuZGxl55qE5ZCN56ewLHRydWXvvJrln7rkuo5jaHVua+eUn+aIkOWQjeensFxcbiAgICAgIG5hbWU6IHRydWUsXFxuICAgICAgLy8g57yT5a2Y57uE77yM57un5om/5LiK6K+J6KeE5YiZ5bm26YeN5paw6YWN572u77yM6buY6K6k5o+Q5L6b5p2l5LqGZGVmYXVsdOWSjHZlbmRvcnPkuKTkuKrop4TliJlcXG4gICAgICBjYWNoZUdyb3Vwczoge1xcbiAgICAgICAgdmVuZG9yczoge1xcbiAgICAgICAgICAvLyDljLnphY3lhbfkvZPnmoTmlofku7bot6/lvoRcXG4gICAgICAgICAgdGVzdDogL1tcXFxcXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFxcXFxcL10vLFxcbiAgICAgICAgICAvLyDmi4bliIbop4TliJnlr7nlupTnmoTmnYPph43vvIzmlbDnu4TotorlpKfvvIznlJ/miJDop4TliJnotorpnaDliY1cXG4gICAgICAgICAgcHJpb3JpdHk6IC0xMFxcbiAgICAgICAgfSxcXG4gICAgICAgIGRlZmF1bHQ6IHtcXG4gICAgICAgICAgLy8g5qih5Z2X6KKr5byV55So55qE5pyA5bCP5qyh5pWwXFxuICAgICAgICAgIG1pbkNodW5rczogMixcXG4gICAgICAgICAgcHJpb3JpdHk6IC0yMCxcXG4gICAgICAgICAgcmV1c2VFeGlzdGluZ0NodW5rOiB0cnVlXFxuICAgICAgICB9XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufTtcXG48L2NvZGU+PC9wcmU+XFxuPGgzIGlkPVxcXCItMlxcXCI+5a6e6Le1PC9oMz5cXG48cHJlPjxjb2RlPm9wdGltaXphdGlvbjoge1xcbiAgLy8g5ouG5YiGIHdlYnBhY2sg5a6e546w5qih5Z2X5Yqg6L2955u45YWz5Luj56CBXFxuICBydW50aW1lQ2h1bms6IHtcXG4gICAgbmFtZTogJ21hbmlmZXN0J1xcbiAgfSxcXG4gIHNwbGl0Q2h1bmtzOiB7XFxuICAgIGNhY2hlR3JvdXBzOiB7XFxuICAgICAgLy8g5oq956a756ys5LiJ5pa55o+S5Lu2XFxuICAgICAgbGliOiB7XFxuICAgICAgICAvLyDmjIflrprmmK9ub2RlX21vZHVsZXPkuIvnmoTnrKzkuInmlrnljIVcXG4gICAgICAgIHRlc3Q6IC9ub2RlX21vZHVsZXMvLFxcbiAgICAgICAgY2h1bmtzOiAnYWxsJyxcXG4gICAgICAgIC8vIOiuvue9ruS8mOWFiOe6p++8jOmYsuatouWSjOiHquWumuS5ieeahOWFrOWFseS7o+eggeaPkOWPluaXtuiiq+imhueblu+8jOS4jei/m+ihjOaJk+WMhVxcbiAgICAgICAgcHJpb3JpdHk6IDEwXFxuICAgICAgfSxcXG4gICAgICAvLyDmir3nprvlhazlhbHku6PnoIFcXG4gICAgICBjb21tb25zOiB7IFxcbiAgICAgICAgY2h1bmtzOiAnYWxsJyxcXG4gICAgICAgIG1pbkNodW5rczogMixcXG4gICAgICAgIC8vIOWPquimgei2heWHujDlrZfoioLlsLHnlJ/miJDkuIDkuKrmlrDljIVcXG4gICAgICAgIG1pblNpemU6IDBcXG4gICAgICB9LFxcbiAgICAgIC8vIOaKveemu+WFpeWPo+aooeWdl++8jOWPr+S7peS4jemFjee9rui/meS4qlxcbiAgICAgIHJ1bnRpbWU6IHsgXFxuICAgICAgICBjaHVua3M6ICdpbml0aWFsJyxcXG4gICAgICAgIG1pblNpemU6IDBcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuPC9jb2RlPjwvcHJlPlwiOyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./md/webpack/optimization配置.md\n");

/***/ })

}]);