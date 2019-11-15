const {
    HookMap,
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
} = require("tapable");

// const hook = new SyncHook(['name'])
// hook.tap('sync-1', (name) => {
// 	console.log("callback", name);
// 	return "aaa"
// });
// hook.tap('sync-2', (name) => {
// 	console.log("callback", name);
// 	return "aaa"
// });
// const data = hook.call('tom');
// console.log("data: ", data);

// const hook = new SyncBailHook(['name']);
// hook.tap('sync', function(name) {
// 	console.log(`1-${name}`);
// });
// hook.tap('sync', function(name) {
// 	console.log(`2-${name}`);
// 	return 2;
// });
// hook.tap('sync', function(name) {
// 	console.log(`3-${name}`);
// });
// const data = hook.call('tom');
// console.log("data: ", data);

// const hook = new SyncWaterfallHook(['name']);
// hook.tap('sync', function(name) {
// 	console.log(`1-${name}`);
// 	return 1;
// });
// hook.tap('sync', function(name) {
// 	console.log(`2-${name}`);
// 	return 2;
// });
// hook.tap('sync', function(name) {
// 	console.log(`3-${name}`);
// });
// const data = hook.call('tom');
// console.log("data: ", data);

// const hook = new SyncLoopHook(['name']);
// hook.tap('sync', function(name) {
// 	console.log(`1-${name}`);
// });
// hook.tap('sync', function(name) {
// 	console.log(`2-${name}`);
// });
// hook.tap('sync', function(name) {
// 	console.log(`3-${name}`);
// });
// const data = hook.call('tom');
// console.log("data: ", data);

// const asyncHook = new AsyncParallelHook(['name']);
// asyncHook.tapAsync('event-1', function(name, callback) {
// 	console.log("payload one： ", name);
// 	setTimeout(function() {
// 		callback(1);
// 	}, 5000)
// });
// asyncHook.tap('event-2', function(name, callback) {
//     console.log("payload two： ", name);
// 	return 2;
// });
// asyncHook.tapPromise('event-2', function(name, callback) {
// 	console.log("payload 3 ", name);
	
// 	return new Promise(function(resolve,reject) {
// 		setTimeout(() => {
// 			resolve(1);
// 		}, 3000);
// 	});
// });
// asyncHook.tapAsync('event-1', function(name, callback) {
// 	console.log("payload 5 ", name);
// 	callback(5);
// });
// asyncHook.tapPromise('event-3', function(name, callback) {
//     console.log("payload 4 ", name);
// 	return Promise.resolve(2);
// });
// asyncHook.callAsync(2, function(data) {
// 	console.log('call: ', data);
// });
// asyncHook.promise(3).then(d => {
// 	console.log("data: ", d);
// });
// const asyncHook = new AsyncSeriesWaterfallHook(['name']);
// console.time("time");
// asyncHook.tapAsync('event-1', function(name, callback) {
// 	console.log("payload 1 ", name);
// 	setTimeout(function() {
// 		callback(4);
// 	}, 1000)
// });
// asyncHook.tap('event-2', function(name, callback) {
//     console.log("payload 2 ", name);
// 	// return 2;
// });
// asyncHook.tapPromise('event-2', function(name, callback) {
//     console.log("payload 3 ", name);
// 	return Promise.resolve(3);
// });
// asyncHook.tapPromise('event-3', function(name, callback) {
//     console.log("payload 4 ", name);
// 	return Promise.resolve(4);
// });
// asyncHook.tapAsync('event-2', function(name, callback) {
// 	console.log("payload 5 ", name);
// 	setTimeout(function() {
// 		callback(5);
// 	}, 3000)
// });
// asyncHook.callAsync(3, function(data) {
// 	console.log('call: ', data);
// 	console.timeEnd("time");
// });

// const asyncHook = new AsyncSeriesWaterfallHook(['name']);
// console.time('time');

// asyncHook.tapAsync('async-1', function(name, callback) {
// 	console.log("payload 1 ", name);
// 	setTimeout(function() {
// 		callback(1);
// 	}, 2000)
// });
// asyncHook.tapAsync('async-2', function(name, callback) {
// 	console.log("payload 2 ", name);
// 	callback(5);
// });
// asyncHook.callAsync(2, function(data) {
// 	console.log('call: ', data);
// 	console.timeEnd('time');
// });

// asyncHook.tapPromise('promise-1', function(name) {
//     console.log("promise 1 ", name);
// 	return new Promise(function(resolve) {
// 		setTimeout(function() {
// 			resolve(1)
// 		}, 1000)
// 	});
// });
// asyncHook.tapPromise('promise-2', function(name) {
//     console.log("promise 2 ", name);
// 	return new Promise(function(resolve) {
// 		setTimeout(function() {
// 			resolve(2)
// 		}, 3000)
// 	});
// });
// asyncHook.promise(2).then(function(data) {
// 	console.log('call: ', data);
// 	console.timeEnd('time');
// });


const asyncHook = new AsyncParallelBailHook(['name']);
console.time('time');
asyncHook.tapPromise('promise-1', function(name) {
    console.log("promise 1 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			console.log("1111");
			resolve()
		}, 5000)
	});
});
asyncHook.tapPromise('promise-2', function(name) {
    console.log("promise 2 ", name);
	return new Promise(function(resolve) {
		setTimeout(function() {
			console.log("2222");
			resolve(2)
		}, 3000)
	});
});
asyncHook.promise(2).then(function(data) {
	console.log('call: ', data);
	console.timeEnd('time');
});