## loader
loader 在 webpack 中用来自定义资源的编译方式，其本质上就是一个函数，接收资源文件内容，然后将处理结果返回。

### loader 定义
```
module.exports = function(content) {
    return content;
};
module.exports.pitch = function(remainingRequest, precedingRequest, data) {
    data.value = xxx;
};
```

### 配置方式
```
{ 
    test: /\.md$/, 
    loader: [
        'loader-A',
        'loader-B'
    ]
}
```

### loader 执行过程
通过 loader 字段可以为每种资源文件配置多个编译方式，资源文件内容依次从后向前传入每个 loader 进行处理。如果 loader 声明了 pitch 处理逻辑，在执行 loader 逻辑之前，会先从前往后执行 pitch 逻辑。如果 pitch 逻辑中给出了一个执行结果（return xxx），那么会跳过后面的 loader。
```
loader 都配置了 pitch 逻辑
config: [loaderA, loaderB, loaderC]
execute: loaderA.pitch -> loaderB.pitch -> loaderC.pitch -> loaderC -> loaderB -> loaderA

loader 都配置了 pitch 逻辑，loaderB.pitch 中给出了执行结果
config: [loaderA, loaderB, loaderC]
execute: loaderA.pitch -> loaderB.pitch -> loaderA
```

### loader 自定义实现
借助 showdown 实现一个将 markdown 转换为 HTML 的自定义 loader。
```
const showdown = require('showdown');
const converter = new showdown.Converter({
    tables: true
});
module.exports = function(content) {
    // 借助 showdown 库将 markdown 编译成 HTML
    const html = converter.makeHtml(content);
    // 对结果封装成一个 JS 模块
    const result = “export default '${html}'; ”;
    // 将处理结果返回
    this.callback(null, result);
};
```
