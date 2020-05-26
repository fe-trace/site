## cross-env
在使用 webpack 编辑编译静态资源时，需要根据生产环境的不同，设置不同的配置参数。通常我们会设置 NODE_ENV 环境变量来区分不同的环境。cross-env 就时为了这种使用场景诞生的，他能在 process.env 对象上添加自定义的参数从而标识不同的环境。

### 具体实现
通过子进程执行具体的命令时可以通过 env 属性设置参数，然后可以通过 process.env 获取
```
function crossEnv(args, options = {}) {
    const [envSetters, command, commandArgs] = parseCommand(args)
    const env = getEnvVars(envSetters)
    if (command) {
        const proc = spawn(
            commandConvert(command, env, true),
            commandArgs.map(arg => commandConvert(arg, env)),
            {
                stdio: 'inherit',
                shell: options.shell,
                env,
            },
        )
        return proc
    }
    return null
}
```