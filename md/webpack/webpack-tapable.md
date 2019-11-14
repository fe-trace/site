## tapable
tapable 是 webpack 打包过程中进行流程控制的核心。tapable 提供了多种类型的 hook，能够满足同步，异步，并行，串行，值传递 等执行场景。

### Hook
tapable 提供了一流程控制的基类：Hook。基类中提供了公共的流程控制逻辑，在具体的子类中可以进行重写和扩展。

### Hook 构造函数
```
function Hook(String[]: args) { }
```
实例化 Hook 需要一个字符串数组作为参数，字符串数组中字符可以是任意字符，在内部实现中没有具体含义，主要是用来标记回调函数的参数个数以及动态生成回调函数时作为参数名称使用。

### Hook 使用（以SyncHook为例）
```
const { SyncHook } = require('tapable');
// 实例化 Hook(字符串数组用来标识参数个数)
const hook = new SyncHook(['name', 'age']);

// 在 Hook 实例上注册一个回调函数('event'可以是任意字符串)
hook.tap('event', function(name, age) {
    // name = 'tom' 
    // age  =  20
});
// 回调 Hook 实例上注册的方法(传入参数个数需要和实例化时字符串数组长度对应，过长会被舍去，不足时对应字段为 undefined)
hook.call('tom', 20);
```