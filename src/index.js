// import './css/common.css';
// import './css/one.css';
// import * as async from './async.js';
// import { isArray, isNull } from 'lodash';

// console.log(async);
// console.log("index.js");

// import('./lib.js').then(lib => {
//     console.log(lib);
// });
// console.log(isNull, isArray);

import md from './../md/webpack/loader.md';

document.body.innerHTML = md;
console.log("md: ", md);