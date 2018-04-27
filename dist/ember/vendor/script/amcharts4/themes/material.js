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
 
webpackJsonp([6],{

/***/ 559:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(560);


/***/ }),

/***/ 560:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__es2015_themes_material__ = __webpack_require__(561);

window.am4themes_material = __WEBPACK_IMPORTED_MODULE_0__es2015_themes_material__["a" /* default */];

/***/ }),

/***/ 561:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_themes_material__ = __webpack_require__(562);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_themes_material__["a"]; });

//# sourceMappingURL=material.js.map

/***/ }),

/***/ 562:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_utils_Color__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_ColorSet__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_Tooltip__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_elements_ResizeButton__ = __webpack_require__(166);




var theme = function (object) {
    if (object instanceof __WEBPACK_IMPORTED_MODULE_1__core_utils_ColorSet__["a" /* ColorSet */]) {
        object.list = [
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#F44336"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#E91E63"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#9C27B0"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#673AB7"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#3F51B5"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#2196F3"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#03A9F4"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#00BCD4"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#009688"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#4CAF50"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#8BC34A"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#CDDC39"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#FFEB3B"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#FFC107"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#FF9800"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#FF5722"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#795548"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#9E9E9E"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#607D8B")
        ];
        object.minLightness = 0.2;
        object.maxLightness = 0.7;
        object.reuse = true;
    }
    if (object instanceof __WEBPACK_IMPORTED_MODULE_3__core_elements_ResizeButton__["a" /* ResizeButton */]) {
        object.background.cornerRadiusTopLeft = 20;
        object.background.cornerRadiusTopRight = 20;
        object.background.cornerRadiusBottomLeft = 20;
        object.background.cornerRadiusBottomRight = 20;
    }
    if (object instanceof __WEBPACK_IMPORTED_MODULE_2__core_elements_Tooltip__["a" /* Tooltip */]) {
        object.animationDuration = 800;
    }
};
/* harmony default export */ __webpack_exports__["a"] = (theme);
//# sourceMappingURL=material.js.map

/***/ })

},[559]);