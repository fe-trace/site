## webpack optimization 配置

### 概述 
optimization 选项用于配置和重写 webpack 默认的 chunk 生成方式

### 默认配置
```
module.exports = {
  optimization: {
    splitChunks: {
      // 需要优化的模块来源：async-异步加载的模块，initial-从配置入口引用的模块，all-包含上述两者
      chunks: 'async',
      // 将模块拆分成chunk的最小体积，体积过小不会拆分，避免出现很多小的模块
      minSize: 30000,
      // 和minSize含义相反
      maxSize: 0,
      // 模块被引用的最少次数
      minChunks: 1,
      // 异步模块动态加载JS的最大个数，如果满足多个规则，但是拆分数量大于请求数，只会拆分体积大的模块
      maxAsyncRequests: 5,
      // 入口模块的并行加载JS最大请求数，如果满足多个规则，但是拆分数量大于请求数，只会拆分体积大的模块
      maxInitialRequests: 3,
      // 生成bundle文件名的模块来源和名称之间的定界符(entry ~ module.js)
      automaticNameDelimiter: '~',
      // 生成 bundle 文件名的最大字符数
      automaticNameMaxLength: 30,
      // 生成bundle的名称,true：基于chunk生成名称
      name: true,
      // 缓存组，继承上诉规则并重新配置，默认提供来了default和vendors两个规则
      cacheGroups: {
        vendors: {
          // 匹配具体的文件路径
          test: /[\\/]node_modules[\\/]/,
          // 拆分规则对应的权重，数组越大，生成规则越靠前
          priority: -10
        },
        default: {
          // 模块被引用的最小次数
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

### 实践
```
optimization: {
  // 拆分 webpack 实现模块加载相关代码
  runtimeChunk: {
    name: 'manifest'
  },
  splitChunks: {
    cacheGroups: {
      // 抽离第三方插件
      lib: {
        // 指定是node_modules下的第三方包
        test: /node_modules/,
        chunks: 'all',
        // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
        priority: 10
      },
      // 抽离公共代码
      commons: { 
        chunks: 'all',
        minChunks: 2,
        // 只要超出0字节就生成一个新包
        minSize: 0
      },
      // 抽离入口模块，可以不配置这个
      runtime: { 
        chunks: 'initial',
        minSize: 0
      }
    }
  }
}
```