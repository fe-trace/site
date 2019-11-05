import './css/common.css';
import './css/one.css';
import * as async from './async.js';

console.log(async);
console.log("index.js");

import('./lib.js').then(lib => {
    console.log(lib);
});