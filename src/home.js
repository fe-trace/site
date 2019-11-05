import './css/common.css';
import * as async from './async.js';

console.log("home.js");
console.log(async);

import('./lib.js').then(lib => {
    console.log(lib);
});