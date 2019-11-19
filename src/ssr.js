import Test from './comp/test';

const { renderToString } = require('react-dom/server');

console.log(1111);
console.log(renderToString(<Test />));