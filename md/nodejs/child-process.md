### nodejs子进程

### 子进程创建方式：spawn, fork, exec, execFile

### 创建方式的区别
fork: 衍生一个nodejs进程，并调用指定模块，模块已建立IPC通道，允许父子进程之间通信
exec: 衍生一个shell并在该shell中运行命令，完成时将stdout和stderr传给回调函数
execFile: 和exec类型，默认情况下不衍生shell而是直接执行命令
spwan: 异步衍生子进程，其他方式都是基于该命令进行封装