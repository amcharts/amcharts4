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
 
webpackJsonp([9],{

/***/ 546:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(547);


/***/ }),

/***/ 547:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__es2015_themes_animated__ = __webpack_require__(548);


var amcharts4 = window.amcharts4;
amcharts4.themes = amcharts4.themes || {};
amcharts4.themes.animated = __WEBPACK_IMPORTED_MODULE_0__es2015_themes_animated__["a" /* default */];

/***/ }),

/***/ 548:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_themes_animated__ = __webpack_require__(549);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_themes_animated__["a"]; });

//# sourceMappingURL=animated.js.map

/***/ }),

/***/ 549:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_SpriteState__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Component__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_Scrollbar__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_elements_Tooltip__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__charts_series_Series__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__charts_types_SankeyDiagram__ = __webpack_require__(238);






var theme = function (object) {
    if (object instanceof __WEBPACK_IMPORTED_MODULE_0__core_SpriteState__["a" /* SpriteState */]) {
        object.transitionDuration = 400;
    }
    if (object instanceof __WEBPACK_IMPORTED_MODULE_1__core_Component__["a" /* Component */]) {
        object.rangeChangeDuration = 800;
        object.interpolationDuration = 800;
        object.sequencedInterpolation = false;
        if (object instanceof __WEBPACK_IMPORTED_MODULE_5__charts_types_SankeyDiagram__["a" /* SankeyDiagram */]) {
            object.sequencedInterpolation = true;
        }
    }
    if (object instanceof __WEBPACK_IMPORTED_MODULE_3__core_elements_Tooltip__["a" /* Tooltip */]) {
        object.animationDuration = 400;
    }
    if (object instanceof __WEBPACK_IMPORTED_MODULE_2__core_elements_Scrollbar__["a" /* Scrollbar */]) {
        object.animationDuration = 800;
    }
    if (object instanceof __WEBPACK_IMPORTED_MODULE_4__charts_series_Series__["a" /* Series */]) {
        object.defaultState.transitionDuration = 1200;
    }
};
/* harmony default export */ __webpack_exports__["a"] = (theme);
//# sourceMappingURL=animated.js.map

/***/ })

},[546]);