const showdown = require('showdown');
const converter = new showdown.Converter({tables: true, strikethrough: true});
const text      = `
## tapable
tapable 是 webpack 打包过程中进行流程控制的核心。tapable 提供了多种类型的 hook，能够满足同步，异步，并行，串行，值传递 等执行场景。

### Hook 函数特性
| 类型 | 特点 |
|:-- |:--:|
|SyncHook | 回调串行执行，return 不能中断回调队列，没有返回值 |
|SyncBailHook | 回调串行执行，事件处理函数返回值不为 undefined 能中断回调队列，返回值为return值 |
`;
const html = converter.makeHtml(text);
console.log(html);