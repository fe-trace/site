const showdown = require('showdown');
const converter = new showdown.Converter({
    tables: true
});

module.exports = function(content) {
    let html = converter.makeHtml(content);

    // HTML 标签字符串没有进行转义，存在换行符，直接使用会报错，所以先进行转码
    this.callback(null, `export default ${JSON.stringify(html)};`);
};