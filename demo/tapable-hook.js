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

// const hook = new SyncHook(['newSpeed', 'flag'])

// hook.tap({ name: "warm" }, (...payload) => {
//     console.log("payload==: ", payload);
// });
// hook.call(123);

const asyncHook = new AsyncParallelHook(['name', 'age']);

asyncHook.tapAsync('event', function(name, age, callback) {
    console.log("payload===： ", name ,age);
    // return Promise.resolve("123")
    callback('end');
});

asyncHook.callAsync(1, 2);