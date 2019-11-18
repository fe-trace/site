const cp = require('child_process');

console.log(process.argv);
const ls = cp.spawn('node', ['./demo/tapable-hook.js'], {
    env: {
        name: 1,
        age: 2,
        addr: 3
    }
});

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
    console.log(`子进程退出，退出码 ${code}`);
});