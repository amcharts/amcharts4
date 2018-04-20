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
 
webpackJsonp([11],{

/***/ 537:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(538);


/***/ }),

/***/ 538:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__es2015_lang_en_US__ = __webpack_require__(539);


var amcharts4 = window.amcharts4;
amcharts4.lang = amcharts4.lang || {};
amcharts4.lang.en_US = __WEBPACK_IMPORTED_MODULE_0__es2015_lang_en_US__["a" /* default */];

/***/ }),

/***/ 539:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_lang_en_US__ = __webpack_require__(540);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_lang_en_US__["a"]; });

//# sourceMappingURL=en_US.js.map

/***/ }),

/***/ 540:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Translation file
 * Locale: en_US
 *
 * Use en.ts as a template to translate to other languages.
 *
 * @type {ILocale}
 */
/* harmony default export */ __webpack_exports__["a"] = ({
    // number formatter related
    "_decimalSeparator": ".",
    "_thousandSeparator": ",",
    // Default date formats for various periods
    "_date_millisecond": "mm::ss SSS",
    "_date_second": "hh:mm:ss a",
    "_date_minute": "hh:mm a",
    "_date_hour": "hh:mm a",
    "_date_day": "MMM dd",
    "_date_week": "ww",
    "_date_month": "MMM",
    "_date_year": "yyyy",
    // Default duration formats for various base units
    "_duration_millisecond": "SSS",
    "_duration_second": "ss",
    "_duration_minute": "mm",
    "_duration_hour": "hh",
    "_duration_day": "dd",
    "_duration_week": "ww",
    "_duration_month": "MM",
    "_duration_year": "yyyy",
    // Era
    "_era_ad": "AD",
    "_era_bc": "BC",
    // Period
    "A": "",
    "P": "",
    "AM": "",
    "PM": "",
    "A.M.": "",
    "P.M.": "",
    // Dates
    "January": "",
    "February": "",
    "March": "",
    "April": "",
    "May": "",
    "June": "",
    "July": "",
    "August": "",
    "September": "",
    "October": "",
    "November": "",
    "December": "",
    "Jan": "",
    "Feb": "",
    "Mar": "",
    "Apr": "",
    "May(short)": "May",
    "Jun": "",
    "Jul": "",
    "Aug": "",
    "Sep": "",
    "Oct": "",
    "Nov": "",
    "Dec": "",
    "Sunday": "",
    "Monday": "",
    "Tuesday": "",
    "Wednesday": "",
    "Thursday": "",
    "Friday": "",
    "Saturday": "",
    "Sun": "",
    "Mon": "",
    "Tue": "",
    "Wed": "",
    "Thu": "",
    "Fri": "",
    "Sat": "",
    // ordinal function
    "_dateOrd": function (day) {
        var res = "th";
        if ((day < 11) || (day > 13)) {
            switch (day % 10) {
                case 1:
                    res = "st";
                    break;
                case 2:
                    res = "nd";
                    break;
                case 3:
                    res = "rd";
                    break;
            }
        }
        return res;
    },
    // Chart elements
    "Play": "",
    "Stop": "",
    "Zoom Out": "",
    "Legend": "",
    "Click, tap or press ENTER to toggle": "",
    "Loading": "",
    "Home": "",
    // Chart types
    "Chart": "",
    "Serial chart": "",
    "X/Y chart": "",
    "Pie chart": "",
    "Gauge chart": "",
    "Radar chart": "",
    "Sankey diagram": "",
    "TreeMap chart": "",
    // Series types
    "Series": "",
    "Candlestick Series": "",
    "Column Series": "",
    "Line Series": "",
    "Pie Slice Series": "",
    "X/Y Series": "",
    // Map-related
    "Map": "",
    "Press ENTER to zoom in": "",
    "Press ENTER to zoom out": "",
    "Use arrow keys to zoom in and out": "",
    "Use plus and minus keys on your keyboard to zoom in and out": "",
    // Export-related
    "Export": "",
    "Image": "",
    "Data": "",
    "Print": "",
    "Click, tap or press ENTER to open": "",
    "Click, tap or press ENTER to print.": "",
    "Click, tap or press ENTER to export as %1.": "",
    'To save the image, right-click this link and choose "Save picture as..."': "",
    'To save the image, right-click thumbnail on the left and choose "Save picture as..."': "",
    "(Press ESC to close this message)": "",
    "Image Export Complete": "",
    "Export operation took longer than expected. Something might have gone wrong.": "",
    "Saved from": "",
    "PNG": "",
    "JPG": "",
    "GIF": "",
    "SVG": "",
    "PDF": "",
    "JSON": "",
    "CSV": "",
    "XLSX": "",
    // Scrollbar-related
    "Use TAB to select grip buttons or left and right arrows to change selection": "",
    "Use left and right arrows to move selection": "",
    "Use left and right arrows to move left selection": "",
    "Use left and right arrows to move right selection": "",
    "Use TAB select grip buttons or up and down arrows to change selection": "",
    "Use up and down arrows to move selection": "",
    "Use up and down arrows to move lower selection": "",
    "Use up and down arrows to move upper selection": "",
    "From %1 to %2": "",
    "From %1": "",
    "To %1": "",
    // Data loader-related
    "No parser available for file: %1": "",
    "Error parsing file: %1": "",
    "Unable to load file: %1": "",
    "Invalid date": "",
});
//# sourceMappingURL=en_US.js.map

/***/ })

},[537]);