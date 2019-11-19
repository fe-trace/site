exports.ids = ["ssr"];
exports.modules = {

/***/ "./src/comp/test.js":
/*!**************************!*\
  !*** ./src/comp/test.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (props) {
  return React.createElement("div", {
    name: "123"
  }, "111");
});

/***/ }),

/***/ "./src/ssr.js":
/*!********************!*\
  !*** ./src/ssr.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _comp_test__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./comp/test */ "./src/comp/test.js");


var _require = __webpack_require__(/*! react-dom/server */ "./node_modules/react-dom/server.js"),
    renderToString = _require.renderToString;

console.log(1111);
console.log(renderToString(React.createElement(_comp_test__WEBPACK_IMPORTED_MODULE_0__["default"], null)));

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ })

};;
//# sourceMappingURL=ssr.js.map