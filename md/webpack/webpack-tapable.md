[//]: # (date: 2019-11-14)
## tapable
tapable 是 webpack 打包过程中进行流程控制的核心。tapable 提供了多种类型的 hook，能够满足同步，异步，并行，串行，值传递 等执行场景。

### Hook
tapable 提供了流程控制的基类：Hook。基类中提供了公共的流程控制逻辑，在具体的子类中可以进行重写和扩展。

### Hook 构造函数
```
function Hook(String[]: args) { }
```
PS：实例化 Hook 需要一个字符串数组作为参数，字符串数组中字符可以是任意字符，在内部实现中没有具体含义，主要是用来标记回调函数的参数个数以及动态生成回调函数时作为参数名称使用。


### Hook 函数特性
| 类型 | 特点 |
|:- | - |
|SyncHook | 回调串行执行，return 不能中断回调队列，没有返回值 |
|SyncBailHook | 回调串行执行，事件处理函数返回值不为 undefined 能中断回调队列，返回值为return值 |
|SyncWaterfallHook | 回调串行执行，return不能中断回调队列，上一个事件处理函数返回值会作为后面回调的入参，最后一个return值为调用结果返回值 |
|SyncLoopHook | 回调串行执行，事件处理函数返回值不为 undefined 时会重复执行回调（重复执行第一个到当前回调），没有返回值 |
|AsyncParallelHook | 异步并行执行 |
|AsyncParallelBailHook | 异步并行执行，事件处理函数有返回值时不继续往后执行 |
|AsyncSeriesHook | 异步串行执行 |
|AsyncSeriesBailHook | 异步串行执行，事件处理函数有返回值时不继续往后执行 |
|AsyncSeriesWaterfallHook | 异步串行执行，上一个事件处理函数返回值作为参数传递给下一个事件处理函数 |

### Hook 函数注册和调用方式
类型 | 注册方式 | 调用方式
:- | - | -
SyncHook | tap | call
SyncBailHook | tap | call
SyncWaterfallHook | tap | call
SyncLoopHook | tap | call
AsyncParallelHook | tap/tapAsync/tapPromise | callAsync/promise 
AsyncParallelBailHook | tap/tapAsync/tapPromise | callAsync/promise
AsyncSeriesHook | tap/tapAsync/tapPromise | callAsync/promise
AsyncSeriesBailHook | tap/tapAsync/tapPromise | callAsync/promise
AsyncSeriesWaterfallHook | tap/tapAsync/tapPromise | callAsync/promise

### Hook 使用
SyncHook
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

SyncBailHook
```
const hook = new SyncBailHook(['name']);
hook.tap('sync', function(name) {
	console.log(`1-${name}`);
});
hook.tap('sync', function(name) {
	console.log(`2-${name}`);
	return 2;
});
hook.tap('sync', function(name) {
	console.log(`3-${name}`);
});
const data = hook.call('tom');
console.log("data: ", data);
// 1-tom
// 2-tom
// data:  2
```

SyncWaterfallHook
```
const hook = new SyncWaterfallHook(['name']);
hook.tap('sync', function(name) {
	console.log(`1-${name}`);
	return 1;
});
hook.tap('sync', function(name) {
	console.log(`2-${name}`);
	return 2;
});
hook.tap('sync', function(name) {
	console.log(`3-${name}`);
});
const data = hook.call('tom');
console.log("data: ", data);
// 1-tom
// 2-1
// 3-2
// data:  2
```

SyncLoopHook
```
const hook = new SyncLoopHook(['name']);
hook.tap('sync', function(name) {
	console.log(`1-${name}`);
});
hook.tap('sync', function(name) {
	console.log(`2-${name}`);
});
hook.tap('sync', function(name) {
	console.log(`3-${name}`);
});
const data = hook.call('tom');
console.log("data: ", data);
// 1-tom
// 2-tom
// 3-tom
// data:  undefined
```

AsyncParallelHook
```
const asyncHook = new AsyncParallelHook(['name']);
console.time('time');
asyncHook.tapPromise('promise-1', function(name) {
    console.log("promise 1 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(1)
		}, 1000)
	});
});
asyncHook.tapPromise('promise-2', function(name) {
    console.log("promise 2 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(2)
		}, 3000)
	});
});
asyncHook.promise(2).then(function(data) {
	console.log('call: ', data);
	console.timeEnd('time');
});
// promise 1  2
// promise 2  2
// call:  undefined
// time: 3007.090ms
```

AsyncParallelBailHook
```
const asyncHook = new AsyncParallelBailHook(['name']);
console.time('time');
asyncHook.tapPromise('promise-1', function(name) {
    console.log("promise 1 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(1)
		}, 1000)
	});
});
asyncHook.tapPromise('promise-2', function(name) {
    console.log("promise 2 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(2)
		}, 3000)
	});
});
asyncHook.promise(2).then(function(data) {
	console.log('call: ', data);
	console.timeEnd('time');
});
// promise 1  2
// promise 2  2
// call:  1
// time: 1009.113ms
```

AsyncSeriesHook
```
const asyncHook = new AsyncSeriesHook(['name']);
console.time('time');
asyncHook.tapPromise('promise-1', function(name) {
    console.log("promise 1 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(1)
		}, 1000)
	});
});
asyncHook.tapPromise('promise-2', function(name) {
    console.log("promise 2 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(2)
		}, 3000)
	});
});
asyncHook.promise(2).then(function(data) {
	console.log('call: ', data);
	console.timeEnd('time');
});
// promise 1  2
// promise 2  2
// call:  undefined
// time: 4010.490ms
```

AsyncSeriesBailHook
```
const asyncHook = new AsyncSeriesBailHook(['name']);
console.time('time');
asyncHook.tapPromise('promise-1', function(name) {
    console.log("promise 1 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(1)
		}, 1000)
	});
});
asyncHook.tapPromise('promise-2', function(name) {
    console.log("promise 2 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(2)
		}, 3000)
	});
});
asyncHook.promise(2).then(function(data) {
	console.log('call: ', data);
	console.timeEnd('time');
});
// promise 1  2
// call:  1
// time: 1005.311ms
```

AsyncSeriesWaterfallHook
```
const asyncHook = new AsyncSeriesWaterfallHook(['name']);
console.time('time');
asyncHook.tapPromise('promise-1', function(name) {
    console.log("promise 1 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(1)
		}, 1000)
	});
});
asyncHook.tapPromise('promise-2', function(name) {
    console.log("promise 2 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve(2)
		}, 3000)
	});
});
asyncHook.promise(2).then(function(data) {
	console.log('call: ', data);
	console.timeEnd('time');
});
// promise 1  2
// promise 2  1
// call:  2
// time: 4015.683ms
```