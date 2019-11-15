const showdown = require('showdown');
const converter = new showdown.Converter({
    tables: true
});

module.exports = function(content) {
    const html = converter.makeHtml(content);
    const result = `
        export default '${html}';
    `;

    this.callback(null, result);
};