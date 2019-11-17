const fs = require('fs');
const path = require('path');
const category = [];
const fileList = [];

function readFileList(dir, tag, top=true) {
    const files = fs.readdirSync(dir);

    files.forEach(item => {
        
        const fileUrl = path.join(dir, item);
        const stat = fs.statSync(fileUrl);

        if(stat.isDirectory() && top) {
            category.push({
                name: item
            });
            readFileList(fileUrl, item, false);
        } else if(/.md$/.test(fileUrl)) {
            fileList.push({
                tag: tag,
                name: item,
                createTime: stat.birthtimeMs,
                modifyTime: stat.mtimeMs
            });
        }
    });
    fileList.sort((a, b) => {
        return  b.createTime - a.createTime;
    });
}

readFileList(path.join(__dirname, "./../md"));
const result = JSON.stringify({
    category,
    fileList
});
fs.writeFile(path.join(__dirname, "./../src/json/home.js"), `export default ${result}`, "utf8", (err) => {
    if (err) throw err;
    console.log('文件已被保存');
});