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