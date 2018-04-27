/**
 * @license
 * Copyright (c) 2018 amCharts (Antanas Marcelionis, Martynas Majeris)
 *
 * This sofware is provided under multiple licenses. Please see below for
 * links to appropriate usage.
 *
 * Free amCharts linkware license. Details and conditions:
 * https://github.com/amcharts/amcharts4/blob/master/LICENSE
 *
 * One of the amCharts commercial licenses. Details and pricing:
 * https://www.amcharts.com/online-store/
 * https://www.amcharts.com/online-store/licenses-explained/
 *
 * If in doubt, contact amCharts at contact@amcharts.com
 *
 * PLEASE DO NOT REMOVE THIS COPYRIGHT NOTICE.
 * @hidden
 */
 
webpackJsonp([8],{

/***/ 551:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(552);


/***/ }),

/***/ 552:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__es2015_themes_dark__ = __webpack_require__(553);

window.am4themes_dark = __WEBPACK_IMPORTED_MODULE_0__es2015_themes_dark__["a" /* default */];

/***/ }),

/***/ 553:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_themes_dark__ = __webpack_require__(554);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_themes_dark__["a"]; });

//# sourceMappingURL=dark.js.map

/***/ }),

/***/ 554:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_utils_Color__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_Scrollbar__ = __webpack_require__(102);



var theme = function (object) {
    if (object instanceof __WEBPACK_IMPORTED_MODULE_1__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]) {
        object.setFor("stroke", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#000000"));
        object.setFor("fill", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#2b2b2b"));
        object.setFor("primaryButton", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#6794dc").lighten(-0.2));
        object.setFor("primaryButtonHover", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#6771dc").lighten(-0.2));
        object.setFor("primaryButtonDown", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#68dc75").lighten(-0.2));
        object.setFor("primaryButtonActive", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#68dc75").lighten(-0.2));
        object.setFor("primaryButtonText", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#FFFFFF"));
        object.setFor("primaryButtonStroke", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#6794dc"));
        object.setFor("secondaryButton", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#3b3b3b"));
        object.setFor("secondaryButtonHover", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#3b3b3b").lighten(0.1));
        object.setFor("secondaryButtonDown", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#3b3b3b").lighten(0.15));
        object.setFor("secondaryButtonActive", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#3b3b3b").lighten(0.15));
        object.setFor("secondaryButtonText", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#bbbbbb"));
        object.setFor("secondaryButtonStroke", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#3b3b3b").lighten(-0.2));
        object.setFor("grid", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#bbbbbb"));
        object.setFor("background", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#000000"));
        object.setFor("alternativeBackground", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#ffffff"));
        object.setFor("text", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#ffffff"));
        object.setFor("alternativeText", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#000000"));
        object.setFor("disabledBackground", Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#bbbbbb"));
    }
    if (object instanceof __WEBPACK_IMPORTED_MODULE_2__core_elements_Scrollbar__["a" /* Scrollbar */]) {
        object.background.fillOpacity = 0.4;
        object.thumb.background.fillOpacity = 0.5;
    }
};
/* harmony default export */ __webpack_exports__["a"] = (theme);
//# sourceMappingURL=dark.js.map

/***/ })

},[551]);