(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["ssr"],{

/***/ "./src/comp/test.js":
/*!**************************!*\
  !*** ./src/comp/test.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function (props) {\n  return React.createElement(\"div\", {\n    name: \"123\"\n  }, \"111\");\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29tcC90ZXN0LmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXAvdGVzdC5qcz85NWNhIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwcm9wcykge1xuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XG4gICAgbmFtZTogXCIxMjNcIlxuICB9LCBcIjExMVwiKTtcbn0iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/comp/test.js\n");

/***/ }),

/***/ "./src/ssr.js":
/*!********************!*\
  !*** ./src/ssr.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _comp_test__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./comp/test */ \"./src/comp/test.js\");\n\n\nvar _require = __webpack_require__(/*! react-dom/server */ \"./node_modules/react-dom/server.browser.js\"),\n    renderToString = _require.renderToString;\n\nconsole.log(renderToString(React.createElement(_comp_test__WEBPACK_IMPORTED_MODULE_0__[\"default\"], null)));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvc3NyLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3Nzci5qcz85OGMyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXN0IGZyb20gJy4vY29tcC90ZXN0JztcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgncmVhY3QtZG9tL3NlcnZlcicpLFxuICAgIHJlbmRlclRvU3RyaW5nID0gX3JlcXVpcmUucmVuZGVyVG9TdHJpbmc7XG5cbmNvbnNvbGUubG9nKHJlbmRlclRvU3RyaW5nKFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdCwgbnVsbCkpKTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/ssr.js\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ })

},[["./src/ssr.js","manifest","lib~ssr"]]]);