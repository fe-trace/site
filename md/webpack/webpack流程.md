## webpack 编译流程
webpack 读取源文件经过编译处理生成目标文件，下面将探索整个编译流程

```
file: webpack\lib\webpack.js
// webpack 是箭头函数，不能实例化
const webpack = (options, callback) => {
	let compiler;
	if (Array.isArray(options)) {
		compiler = new MultiCompiler(
			Array.from(options).map(options => webpack(options))
		);
	} else if (typeof options === "object") {
        //  生成默认配置文件
		options = new WebpackOptionsDefaulter().process(options);
		// 实例化 Compiler 对象，控制整个编译流程
        compiler = new Compiler(options.context);
		// 加载各种处理插件，核心处理插件都在此进行加载（例如添加编译入口调用EntryOptionPlugin插件）
		compiler.options = new WebpackOptionsApply().process(options, compiler);
	}

    // 有callback时自动开始编译，没有callback需要手动调用run方法开始编译
	if (callback) {
		// watch 模式
		if (
			options.watch === true ||
			(Array.isArray(options) && options.some(o => o.watch))
		) {
			const watchOptions = Array.isArray(options)
				? options.map(o => o.watchOptions || {})
				: options.watchOptions || {};
			return compiler.watch(watchOptions, callback);
		}
		compiler.run(callback);
	}
	return compiler;
};

```

// WebpackOptionsApply会实例化EntryOptionPlugin并触发添加入口文件事件。EntryOptionPlugin中监听entryOption事件会将入口文件添加到compilation对象中
```
file: webpack\lib\EntryOptionPlugin.js

const itemToPlugin = (context, item, name) => {
	if (Array.isArray(item)) {
		return new MultiEntryPlugin(context, item, name);
	}
	return new SingleEntryPlugin(context, item, name);
};

class EntryOptionPlugin {
	apply(compiler) {
		compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
			if (typeof entry === "string" || Array.isArray(entry)) {
				itemToPlugin(context, entry, "main").apply(compiler);
			} else if (typeof entry === "object") {
				for (const name of Object.keys(entry)) {
					itemToPlugin(context, entry[name], name).apply(compiler);
				}
			} else if (typeof entry === "function") {
				new DynamicEntryPlugin(context, entry).apply(compiler);
			}
			return true;
		});
	}
}
```

// 生成compiler实例，开始编译
```
file: webpack\lib\Compiler.js
run(callback) {
    this.running = true;
    // 编译完成回调
    const onCompiled = (err, compilation) => {
        const finalCallback = (err, stats) => {
			this.running = false;
			if (callback !== undefined) return callback(err, stats);
		};
        this.emitAssets(compilation, err => {
            if (compilation.hooks.needAdditionalPass.call()) {
                compilation.needAdditionalPass = true;
                const stats = new Stats(compilation);
                stats.startTime = startTime;
                stats.endTime = Date.now();
                this.hooks.done.callAsync(stats, err => {
                    this.hooks.additionalPass.callAsync(err => {
                        this.compile(onCompiled);
                    });
                });
                return;
            }
            this.emitRecords(err => {
                const stats = new Stats(compilation);
                stats.startTime = startTime;
                stats.endTime = Date.now();
                this.hooks.done.callAsync(stats, err => {
                    return finalCallback(null, stats);
                });
            });
        });
    };
    // 触发各种监听的钩子函数
    this.hooks.beforeRun.callAsync(this, err => {
        this.hooks.run.callAsync(this, err => {
            this.readRecords(err => {
                // 开始编译
                this.compile(onCompiled);
            });
        });
    });
}
compile(callback) {
    // 生成compilation实例需要的参数：normalModuleFactory、contextModuleFactory、compilationDependencies
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, err => {
        this.hooks.compile.call(params);
        // 生成 compilation 对象，用于处理文件
        const compilation = this.newCompilation(params);
        // 触发编译hooks，插件在WebpackOptionsApply中进行加载，此处触发make hooks 进行文件编译
        this.hooks.make.callAsync(compilation, err => {
            compilation.finish(err => {
                compilation.seal(err => {
                    this.hooks.afterCompile.callAsync(compilation, err => {
                        return callback(null, compilation);
                    });
                });
            });
        });
    });
}
```

// EntryOptionPlugin中调用SingleEntryPlugin添加编译入口，SingleEntryPlugin中会监听make事件
```
file: webpack\lib\SingleEntryPlugin.js
compiler.hooks.make.tapAsync("SingleEntryPlugin", (compilation, callback) => {
    const { entry, name, context } = this;

    const dep = SingleEntryPlugin.createDependency(entry, name);
    compilation.addEntry(context, dep, name, callback);
});
```

// 添加编译入口
```
addEntry(context, entry, name, callback) {
    const slot = {
        name: name,
        request: null,
        module: null
    };
    if (entry instanceof ModuleDependency) {
        slot.request = entry.request;
    }

    this._addModuleChain(
        context,
        entry,
        module => {
            this.entries.push(module);
        },
        (err, module) => {
            this.hooks.succeedEntry.call(entry, name, module);
            return callback(null, module);
        }
    );
}

_addModuleChain(context, dependency, onModule, callback) {
    const Dep = /** @type {DepConstructor} */ (dependency.constructor);
    // 获取入口对应的工厂用于加工不同的入口
    const moduleFactory = this.dependencyFactories.get(Dep);

    // 编译模块时的信号标识，默认同时支持100个同时工作（类似线程池，资源不够时需要排队）
    this.semaphore.acquire(() => {
        // 根据入口信息生成一个NormalModule对象（对应一个module）
        moduleFactory.create(
            {
                contextInfo: {
                    issuer: "",
                    compiler: this.compiler.name
                },
                context: context,
                dependencies: [dependency]
            },
            (err, module) => {
                const afterBuild = () => {
                    if (addModuleResult.dependencies) {
                        this.processModuleDependencies(module, err => {
                            if (err) return callback(err);
                            callback(null, module);
                        });
                    } else {
                        return callback(null, module);
                    }
                };
                // 开始构建module
                if (addModuleResult.build) {
                    this.buildModule(module, false, null, null, err => {
                        if (err) {
                            this.semaphore.release();
                            return errorAndCallback(err);
                        }

                        if (currentProfile) {
                            const afterBuilding = Date.now();
                            currentProfile.building = afterBuilding - afterFactory;
                        }

                        this.semaphore.release();
                        afterBuild();
                    });
                } else {
                    this.semaphore.release();
                    this.waitForBuildingFinished(module, afterBuild);
                }
            }
        );
    });
}

buildModule(module, optional, origin, dependencies, thisCallback) {
    // 构建模块，调用loader处理模块（loader相关逻辑在其中处理）
    module.build(
        this.options,
        this,
        this.resolverFactory.get("normal", module.resolveOptions),
        this.inputFileSystem,
        error => {
            return callback();
        }
    );
}

处理流程：
1.添加入口文件
2.根据入口文件生成module对象
3.处理和保存loader信息，模块依赖信息，模块数据
4.循环处理模块依赖（回到步骤二重复）
5.最终将处理之后的模块信息保存在compilation对象上
compilation {
    编译过程中根据入口文件找到的所有模块
    _modules: Map{
        [[entries]]: [
            key: xxx(模块路径),
            value: NormalModule{
                // 模块hash
                _buildHash: xxx,
                // 模块对应的资源对象
                _source: SourceMapSource {
                    name: xxx(模块URL)
                    _value: xxx(模块对应的字符串)
                },
                loaders: [babel-loader, ...],
            }
            ...
        ]
    },
    入口模块
    entries: [{
        xxx: NormalModule{
            ...
        }
    }],
    模块拆分后生成chunk
    chunks: [
        chunk{
            _modules: Set(NormalModule{
                ...
            })
            name: xxx
            files: []
        }
    ]   
}

compilation.seal 流程：build过程主要是根据入口生成调用NormalModuleFactory生成模块实例，处理loader逻辑等。现在的模块数据还是未经过编译的源码。模块封装过程将会生成最终的源码。
处理流程：
1.根据入口模块和splitOptimization规则生成chunks
2.遍历chunks调用模板方法生成可运行代码
3.将结果保存根据名称保存在 compilation.assets 对象上，同时讲文件名称保存在对应的chunk上
```
