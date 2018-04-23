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
 
webpackJsonp([7],{

/***/ 554:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(555);


/***/ }),

/***/ 555:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__es2015_themes_kelly__ = __webpack_require__(556);


var amcharts4 = window.amcharts4;
amcharts4.themes = amcharts4.themes || {};
amcharts4.themes.kelly = __WEBPACK_IMPORTED_MODULE_0__es2015_themes_kelly__["a" /* default */];

/***/ }),

/***/ 556:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_themes_kelly__ = __webpack_require__(557);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_themes_kelly__["a"]; });

//# sourceMappingURL=kelly.js.map

/***/ }),

/***/ 557:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_utils_Color__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_ColorSet__ = __webpack_require__(63);
/**
 * Kelly's colors is a set of 22 highly contrasting colors.
 *
 * More info:
 * {@link https://i.kinja-img.com/gawker-media/image/upload/1015680494325093012.JPG}
 * {@link https://eleanormaclure.files.wordpress.com/2011/03/colour-coding.pdf}
 */


var theme = function (object) {
    if (object instanceof __WEBPACK_IMPORTED_MODULE_1__core_utils_ColorSet__["a" /* ColorSet */]) {
        object.list = [
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#F3C300"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#875692"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#F38400"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#A1CAF1"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#BE0032"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#C2B280"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#848482"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#008856"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#E68FAC"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#0067A5"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#F99379"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#604E97"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#F6A600"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#B3446C"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#DCD300"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#882D17"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#8DB600"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#654522"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#E25822"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#2B3D26"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#F2F3F4"),
            Object(__WEBPACK_IMPORTED_MODULE_0__core_utils_Color__["c" /* color */])("#222222")
        ];
        object.minLightness = 0.2;
        object.maxLightness = 0.7;
        object.reuse = true;
    }
};
/* harmony default export */ __webpack_exports__["a"] = (theme);
//# sourceMappingURL=kelly.js.map

/***/ })

},[554]);