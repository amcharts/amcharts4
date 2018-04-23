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
 
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 559);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["isNaN"] = isNaN;
/* harmony export (immutable) */ __webpack_exports__["getType"] = getType;
/* harmony export (immutable) */ __webpack_exports__["getDefault"] = getDefault;
/* harmony export (immutable) */ __webpack_exports__["checkString"] = checkString;
/* harmony export (immutable) */ __webpack_exports__["checkBoolean"] = checkBoolean;
/* harmony export (immutable) */ __webpack_exports__["checkNumber"] = checkNumber;
/* harmony export (immutable) */ __webpack_exports__["checkObject"] = checkObject;
/* harmony export (immutable) */ __webpack_exports__["checkArray"] = checkArray;
/* harmony export (immutable) */ __webpack_exports__["checkDate"] = checkDate;
/* harmony export (immutable) */ __webpack_exports__["castString"] = castString;
/* harmony export (immutable) */ __webpack_exports__["castNumber"] = castNumber;
/* harmony export (immutable) */ __webpack_exports__["toBoolean"] = toBoolean;
/* harmony export (immutable) */ __webpack_exports__["toNumber"] = toNumber;
/* harmony export (immutable) */ __webpack_exports__["toText"] = toText;
/* harmony export (immutable) */ __webpack_exports__["toNumberOrPercent"] = toNumberOrPercent;
/* harmony export (immutable) */ __webpack_exports__["percent"] = percent;
/* harmony export (immutable) */ __webpack_exports__["isPercent"] = isPercent;
/* harmony export (immutable) */ __webpack_exports__["hasValue"] = hasValue;
/* harmony export (immutable) */ __webpack_exports__["getValue"] = getValue;
/* harmony export (immutable) */ __webpack_exports__["isDate"] = isDate;
/* harmony export (immutable) */ __webpack_exports__["isString"] = isString;
/* harmony export (immutable) */ __webpack_exports__["isNumber"] = isNumber;
/* harmony export (immutable) */ __webpack_exports__["isObject"] = isObject;
/* harmony export (immutable) */ __webpack_exports__["isArray"] = isArray;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Percent__ = __webpack_require__(16);
/**
 * A collection of utility functions for various type checks and conversion
 * @todo Review unused functions for removal
 * @hidden
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */

/**
 * ============================================================================
 * TYPE CHECK
 * ============================================================================
 * @hidden
 */
/**
 * Returns `true` if value is not a number (NaN).
 *
 * @param  {number}  value Input value
 * @return {boolean}       Is NaN?
 * @deprecated Is not used anywhere. JS built-in isNaN is used everywhere. Maybe we don't need this, or if we do, then we should use it everywhere
 */
function isNaN(value) {
    return Number(value) !== value;
    //return value !== value;
}
/**
 * Returns a type of the value.
 *
 * @param  {any}   value  Input value
 * @return {Type}         Type of the value
 */
function getType(value) {
    return ({}).toString.call(value);
}
/**
 * Returns a default value if the passed in value is empty.
 *
 * @param  {any}   value     Input value
 * @param  {any}   optional  Default value
 * @return {any}             Value or default value whichever is available
 * @deprecated Not used anywhere
 */
function getDefault(value, optional) {
    return value || optional;
}
/**
 * Checks if the passed in value is a string.
 *
 * @param  {any}   value  Value
 * @return {value}        Is string?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
function checkString(value) {
    if (typeof value === "string") {
        return true;
    }
    else {
        throw new Error("Expected a string but got " + getType(value));
    }
}
/**
 * Checks if the passed in value is a boolean.
 *
 * @param  {any}   value  Value
 * @return {value}        Is boolean?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
function checkBoolean(value) {
    if (typeof value === "boolean") {
        return true;
    }
    else {
        throw new Error("Expected a boolean but got " + getType(value));
    }
}
/**
 * Checks if the passed in value is a number.
 *
 * @param  {any}   value  Value
 * @return {value}        Is number?
 * @throws {Error}
 */
function checkNumber(value) {
    if (typeof value === "number") {
        if (isNaN(value)) {
            throw new Error("Expected a number but got NaN");
        }
    }
    else {
        throw new Error("Expected a number but got " + getType(value));
    }
    return true;
}
/**
 * Checks if the passed in value is an object.
 *
 * @param  {any}   value  Value
 * @return {value}        Is object?
 * @throws {Error}
 * @todo Is the input type correct?
 * @deprecated Not used anywhere
 */
function checkObject(value) {
    var t = getType(value);
    if (t === "[object Object]") {
        return true;
    }
    else {
        throw new Error("Expected an object but got " + t);
    }
}
/**
 * Checks if the passed in value is an array.
 *
 * @param  {any}   value  Value
 * @return {value}        Is array?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
function checkArray(value) {
    if (Array.isArray(value)) {
        return true;
    }
    else {
        throw new Error("Expected an array but got " + getType(value));
    }
}
/**
 * Checks if the passed in value is a Date object.
 *
 * @param  {any}   value  Value
 * @return {value}        Is Date object?
 * @throws {Error}
 * @deprecated Not used anywhere
 */
function checkDate(value) {
    var t = getType(value);
    if (t === "[object Date]") {
        return true;
    }
    else {
        throw new Error("Expected a date but got " + t);
    }
}
/**
 * ============================================================================
 * TYPE CASTING
 * ============================================================================
 * @hidden
 */
/**
 * Casts string or a number into string.
 *
 * @param  {string | number}  value  Input
 * @return {string}                  String value
 * @deprecated Not used anywhere
 */
function castString(value) {
    if (typeof value === "string") {
        return value;
    }
    else if (typeof value === "number") {
        return "" + value;
    }
    else {
        throw new Error("Expected a string or number but got " + getType(value));
    }
}
/**
 * Casts string or a number into a number.
 *
 * @param  {string | number | Date}  value   Input value
 * @return {number}                  Number  value
 * @throws {Error}
 */
function castNumber(value) {
    if (typeof value === "string") {
        var number = +value;
        if (isNaN(number)) {
            throw new Error("Cannot cast string " + JSON.stringify(value) + " to a number");
        }
        else {
            return number;
        }
    }
    else if (typeof value === "number") {
        if (isNaN(value)) {
            throw new Error("Expected a number but got NaN");
        }
        else {
            return value;
        }
    }
    else {
        var t = getType(value);
        if (t === "[object Date]") {
            return value.getTime();
        }
        else {
            throw new Error("Expected a string, number, or date but got " + t);
        }
    }
}
/**
 * Casts number, string or Date into a Date object.
 *
 * @param  {string | number | Date}   value  Input value
 * @return {Date}                            Date object
 * @deprecated Not used anywhere
 * @throws {Error}
 * @hidden
 * @deprecated
 */
/*export function castDate(value: string | number | Date, formatter?: DateFormatter): Date {
    if (typeof value === "string") {
        if (formatter) {
            return formatter.parse(value);
        }
        return new Date(value);

    } else if (typeof value === "number") {
        return new Date(value);

    } else {
        const t = getType(value);

        if (t === "[object Date]") {
            return value;

        } else {
            throw new Error("Expected a string, number, or date but got " + t);
        }
    }
}*/
/**
 * ============================================================================
 * QUICK CONVERSION
 * ============================================================================
 * @hidden
 */
/**
 * Converts any value into `boolean`.
 *
 * @param  {any}      value  Source value
 * @return {boolean}         `true` or `false`
 */
function toBoolean(value) {
    return value ? true : false;
}
/**
 * Converts any value into a `number`.
 *
 * @param  {any}     value  Source value
 * @return {number}         Number representation of value
 */
function toNumber(value) {
    if (hasValue(value) && !isNumber(value)) {
        var converted = Number(value);
        if (isNaN(converted) && isString(value) && value != "") {
            return toNumber(value.replace(/[^0-9.\-]+/g, ''));
        }
        return converted;
    }
    return value;
}
/**
 * Converts any value into a string (text).
 *
 * @param  {any}     value  Source value
 * @return {string}         String representation of the input
 */
function toText(value) {
    if (hasValue(value) && !isString(value)) {
        return castString(value);
    }
    return value;
}
/**
 * Converts any value to a number or [[Percent]].
 *
 * If the parameter is a string and contains "%", it will
 * convert it into a [[Percent]].
 *
 * Otherwise, it will convert into a number.
 *
 * @param {number | Percent}   value  Number or percent
 * @return {number | Percent}         Percent object
 */
function toNumberOrPercent(value) {
    if (!hasValue(value) || isNumber(value) || isPercent(value)) {
        return value;
    }
    if (isString(value) && value.indexOf("%") != -1) {
        return percent(toNumber(value));
    }
    return toNumber(value);
}
/**
 * Converts numeric percent value to a proper [[Percent]] object.
 *
 * ```TypeScript
 * pieSeries.radius = amcharts4.percent(80);
 * ```
 * ```JavaScript
 * pieSeries.radius = amcharts4.percent(80);
 * ```
 *
 * @param  {number}   value  Percent
 * @return {Percent}         Percent object
 */
function percent(value) {
    return new __WEBPACK_IMPORTED_MODULE_0__Percent__["a" /* Percent */](value);
}
/**
 * Checks if value is a [[Percent]] object.
 *
 * @ignore Exclude from docs
 * @param  {any}      value  Input value
 * @return {boolean}         Is percent?
 */
function isPercent(value) {
    return value instanceof __WEBPACK_IMPORTED_MODULE_0__Percent__["a" /* Percent */];
}
/**
 * Checks if a variable has a value.
 *
 * @param {any}  a  Input value
 * @returns         Has value?
 */
function hasValue(a) {
    return a != null;
}
/**
 * Returns a value or throws an {Error} exception if the variable has not
 * value.
 *
 * @param {any}  a  Input value
 * @returns         Value
 */
function getValue(a) {
    if (hasValue(a)) {
        return a;
    }
    else {
        throw new Error("Value doesn't exist");
    }
}
/**
 * ============================================================================
 * TYPE CHECK
 * ============================================================================
 * @hidden
 */
/**
 * Checks if parameter is `Date`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is Date?
 */
function isDate(value) {
    return getType(value) === "[object Date]";
}
/**
 * Checks if parameter is `string`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is string?
 */
function isString(value) {
    return typeof value === "string";
}
/**
 * Checks if parameter is `number`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is number?
 */
function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
}
/**
 * Checks if parameter is `object`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is object?
 */
function isObject(value) {
    return typeof value === "object";
}
/**
 * Checks if parameter is `Array`.
 *
 * @param  {any}    value  Input value
 * @return {value}         Is Array?
 */
function isArray(value) {
    return Array.isArray(value);
}
//# sourceMappingURL=Type.js.map

/***/ }),

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Registry */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return registry; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_Dictionary__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_Cache__ = __webpack_require__(44);


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Registry is used to store miscellaneous system-wide information, like ids,
 * maps, themes, and registered classes.
 *
 * @ignore Exclude from docs
 */
var Registry = /** @class */ (function () {
    function Registry() {
        /**
         * All currently applied themes. All new chart instances created will
         * automatically inherit and retain System's themes.
         *
         * @type {ITheme}
         */
        this.themes = [];
        /**
         * List of all loaded available themes.
         *
         * Whenever a theme loads, it registers itself in System's `loadedThemes`
         * collection.
         */
        this.loadedThemes = {};
        /**
         * An indeternal counter used to generate unique IDs.
         *
         * @ignore Exclude from docs
         * @type {number}
         */
        this._uidCount = 0;
        /**
         * Keeps register of class references so that they can be instnatiated using
         * string key.
         *
         * @ignore Exclude from docs
         */
        this.registeredClasses = {};
        /**
         * Number of times per second charts will be updated.
         *
         * This means that each time an element is invalidated it will wait for the
         * next cycle to be re-validated, and possibly redrawn.
         *
         * This happens every `1000 / frameRate` milliseconds.
         *
         * Reducing this number may reduce the load on the CPU, but might slightly
         * reduce smoothness of the animations.
         *
         * @type {number}
         */
        this.frameRate = 60;
        /**
     * A list of invalid(ated) [[Sprite]] objects that need to be re-validated
     * during next cycle.
     *
     * @ignore Exclude from docs
     * @type {Array<Sprite>}
     */
        this.invalidSprites = [];
        /**
         * Components are added to this list when their data provider changes to
         * a new one or data is added/removed from their data provider.
         *
         * @ignore Exclude from docs
         * @type {Array<Component>}
         */
        this.invalidDatas = [];
        /**
         * Components are added to this list when values of their raw data change.
         * Used when we want a smooth animation from one set of values to another.
         *
         * @ignore Exclude from docs
         * @type {Array<Component>}
         */
        this.invalidRawDatas = [];
        /**
         * Components are added to this list when values of their data changes
         * (but not data provider itself).
         *
         * @ignore Exclude from docs
         * @type {Array<Component>}
         */
        this.invalidDataItems = [];
        /**
         * Components are added to this list when their data range (selection) is
         * changed, e.g. zoomed.
         *
         * @ignore Exclude from docs
         * @type {Array<Component>}
         */
        this.invalidDataRange = [];
        /**
         * A list of [[Sprite]] objects that have invalid(ated) positions, that need
         * to be recalculated.
         *
         * @ignore Exclude from docs
         * @type {Array<Sprite>}
         */
        this.invalidPositions = [];
        /**
         * A list of [[Container]] objects with invalid(ated) layouts.
         *
         * @ignore Exclude from docs
         * @type {Array<Container>}
         */
        this.invalidLayouts = [];
        this.uid = this.getUniqueId();
    }
    /**
     * Generates a unique chart system-wide ID.
     *
     * @return {string} Generated ID
     */
    Registry.prototype.getUniqueId = function () {
        var uid = this._uidCount;
        this._uidCount += 1;
        return "id-" + uid;
    };
    Object.defineProperty(Registry.prototype, "map", {
        /**
         * Returns a universal collection for mapping ids with objects.
         *
         * @ignore Exclude from docs
         * @return {Dictionary<string, any>} Map collection
         */
        get: function () {
            if (!this._map) {
                this._map = new __WEBPACK_IMPORTED_MODULE_0__utils_Dictionary__["a" /* Dictionary */]();
            }
            return this._map;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Caches value in object's cache.
     *
     * @ignore Exclude from docs
     * @param {string}  key    Key
     * @param {any}     value  Value
     */
    Registry.prototype.setCache = function (key, value) {
        __WEBPACK_IMPORTED_MODULE_1__utils_Cache__["b" /* cache */].set(this.uid, key, value);
    };
    /**
     * Retrieves cached value.
     *
     * @ignore Exclude from docs
     * @param  {string}  key  Key
     * @return {any}          Value
     */
    Registry.prototype.getCache = function (key) {
        return __WEBPACK_IMPORTED_MODULE_1__utils_Cache__["b" /* cache */].get(this.uid, key);
    };
    return Registry;
}());

/**
 * A singleton global instance of [[Registry]].
 *
 * @ignore Exclude from docs
 */
var registry = new Registry();
//# sourceMappingURL=Registry.js.map

/***/ }),

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["entries"] = entries;
/* harmony export (immutable) */ __webpack_exports__["keys"] = keys;
/* harmony export (immutable) */ __webpack_exports__["keysOrdered"] = keysOrdered;
/* harmony export (immutable) */ __webpack_exports__["hasKey"] = hasKey;
/* harmony export (immutable) */ __webpack_exports__["getKey"] = getKey;
/* harmony export (immutable) */ __webpack_exports__["eachContinue"] = eachContinue;
/* harmony export (immutable) */ __webpack_exports__["each"] = each;
/* harmony export (immutable) */ __webpack_exports__["eachOrdered"] = eachOrdered;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["merge"] = merge;
/* harmony export (immutable) */ __webpack_exports__["copyProperties"] = copyProperties;
/* harmony export (immutable) */ __webpack_exports__["forceCopyProperties"] = forceCopyProperties;
/* harmony export (immutable) */ __webpack_exports__["copyAllProperties"] = copyAllProperties;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Array__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Type__ = __webpack_require__(0);
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */


/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Returns an iterator for all entries in object.
 *
 * Can be used to safely iterate through all properties of the object.
 *
 * @param   {object}    object  Source object
 * @returns {Iterator}          Iterator
 */
function entries(object) {
    return function (push) {
        // TODO make this more efficient ?
        for (var key in object) {
            if (hasKey(object, key)) {
                if (!push([key, object[key]])) {
                    break;
                }
            }
        }
    };
}
/**
 * Returns an array of object's property names.
 *
 * @param   {object}        object  Source object
 * @returns {Array<string}          Object property names
 */
function keys(object) {
    return Object.keys(object);
}
/**
 * Returns an array of object's property names ordered using specific ordering
 * function.
 *
 * @param   {object}        object  Source object
 * @param   {function}      order   Ordering function
 * @returns {Array<string}          Object property names
 */
function keysOrdered(object, order) {
    return Object.keys(object).sort(order);
}
/**
 * Checks if `object` has a specific `key`.
 *
 * @param   {object}   object  Source object
 * @param   {string}   key     Property name
 * @returns {boolean}          Has key?
 */
function hasKey(object, key) {
    return {}.hasOwnProperty.call(object, key);
}
/**
 * Returns value of the specific `key`.
 *
 * @param   {object}   object  Source object
 * @param   {string}   key     Property name
 * @returns {any}              Key value
 */
function getKey(object, key) {
    return object[key];
}
/**
 * Iterates through all properties of the object calling `fn` for each of them.
 *
 * If return value of the function evaluates to `false` further iteration is
 * cancelled.
 *
 * @param {object}   object  Source object
 * @param {function} fn      Callback function
 */
function eachContinue(object, fn) {
    for (var key in object) {
        if (hasKey(object, key)) {
            if (!fn(key, object[key])) {
                break;
            }
        }
    }
}
/**
 * Iterates through all properties of the object calling `fn` for each of them.
 *
 * @param {object}   object  Source object
 * @param {function} fn      Callback function
 */
function each(object, fn) {
    eachContinue(object, function (key, value) {
        fn(key, value);
        return true;
    });
}
/**
 * Orders object properties using custom `ord` function and iterates through
 * them calling `fn` for each of them.
 *
 * @param {object}    object  Source object
 * @param {function}  fn      Callback function
 * @param {function}  order   Ordering function
 */
function eachOrdered(object, fn, ord) {
    __WEBPACK_IMPORTED_MODULE_0__Array__["b" /* each */](keysOrdered(object, ord), function (key) {
        fn(key, object[key]);
    });
}
/**
 * Returns a copy of the object.
 *
 * @param   {object} object  Source object
 * @returns {object}         Copy of the object
 */
function copy(object) {
    return Object.assign({}, object);
}
/**
 * Merges two objects and returns a new object that contains properties from
 * both source objects.
 *
 * @param   {object} object1  Source object #1
 * @param   {object} object2  Source object #2
 * @returns {object}          Combined object
 */
function merge(object1, object2) {
    return Object.assign({}, object1, object2);
}
/**
 * Copies a list of properties from one object to another.
 *
 * Will not copy empty properties.
 *
 * @param {object}         from  Source object
 * @param {object}         to    Target object
 * @param {Array<string>}  keys  List of keys to copy
 */
function copyProperties(from, to, keys) {
    __WEBPACK_IMPORTED_MODULE_0__Array__["b" /* each */](keys, function (key) {
        if (__WEBPACK_IMPORTED_MODULE_1__Type__["hasValue"](from[key])) {
            to[key] = from[key];
        }
    });
}
/**
 * Copies a list of properties from one object to another.
 *
 * Will copy empty properties.
 *
 * @param {object}         from  Source object
 * @param {object}         to    Target object
 * @param {Array<string>}  keys  List of keys to copy
 */
function forceCopyProperties(from, to, keys) {
    __WEBPACK_IMPORTED_MODULE_0__Array__["b" /* each */](keys, function (key) {
        to[key] = from[key];
    });
}
/**
 * Copies all properties from one object to another.
 *
 * @param {object}  from  Source object
 * @param {object}  to    Target object
 */
function copyAllProperties(from, to) {
    copyProperties(from, to, keys(from));
}
//# sourceMappingURL=Object.js.map

/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventDispatcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return TargetedEventDispatcher; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Disposer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Array__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AsyncPending__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Type__ = __webpack_require__(0);
/**
 * Event Dispatcher module is used for registering listeners and dispatching
 * events across amCharts system.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * Universal Event Dispatcher.
 *
 * @important
 */
var EventDispatcher = /** @class */ (function () {
    /**
     * Constructor
     */
    function EventDispatcher() {
        this._listeners = [];
        this._killed = [];
        this._disabled = {};
        this._iterating = 0;
        this._enabled = true;
        this._disposed = false;
    }
    /**
     * Returns if this object has been already disposed.
     *
     * @return {boolean} Disposed?
     */
    EventDispatcher.prototype.isDisposed = function () {
        return this._disposed;
    };
    /**
     * Dispose (destroy) this object.
     */
    EventDispatcher.prototype.dispose = function () {
        if (!this._disposed) {
            this._disposed = true;
            var a = this._listeners;
            this._iterating = 1;
            this._listeners = null;
            this._disabled = null;
            try {
                __WEBPACK_IMPORTED_MODULE_1__Array__["b" /* each */](a, function (x) {
                    x.disposer.dispose();
                });
            }
            finally {
                this._killed = null;
                this._iterating = null;
            }
        }
    };
    /**
     * Checks if this particular event dispatcher has any listeners set.
     *
     * @return {boolean} Has listeners?
     */
    EventDispatcher.prototype.hasListeners = function () {
        return this._listeners.length !== 0;
    };
    /**
     * Enable dispatching of events if they were previously disabled by
     * `disable()`.
     */
    EventDispatcher.prototype.enable = function () {
        this._enabled = true;
    };
    /**
     * Disable dispatching of events until re-enabled by `enable()`.
     */
    EventDispatcher.prototype.disable = function () {
        this._enabled = false;
    };
    /**
     * Enable dispatching particular event, if it was disabled before by
     * `disableType()`.
     *
     * @param {keyof T} type Event type
     */
    EventDispatcher.prototype.enableType = function (type) {
        delete this._disabled[type];
    };
    /**
     * Disable dispatching of events for a certain event type.
     *
     * Optionally, can set how many dispatches to skip before automatically
     * re-enabling the dispatching.
     *
     * @param {keyof T}            type    Event type
     * @param {number = Infinity}  amount  Number of event dispatches to skip
     */
    EventDispatcher.prototype.disableType = function (type, amount) {
        if (amount === void 0) { amount = Infinity; }
        this._disabled[type] = amount;
    };
    /**
     * Removes listener from dispatcher.
     *
     * Will throw an exception if such listener does not exists.
     *
     * @param {EventListener<T>} listener Listener to remove
     */
    EventDispatcher.prototype._removeListener = function (listener) {
        if (this._iterating === 0) {
            var index = this._listeners.indexOf(listener);
            if (index === -1) {
                throw new Error("Invalid state: could not remove listener");
            }
            this._listeners.splice(index, 1);
        }
        else {
            this._killed.push(listener);
        }
    };
    /**
     * Removes existing listener by certain parameters.
     *
     * @param {boolean}     once      Listener's once setting
     * @param {Key | null}  type      Listener's type
     * @param {A}           callback  Callback function
     * @param {B}           context   Callback context
     */
    EventDispatcher.prototype._removeExistingListener = function (once, type, callback, context) {
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        var index = __WEBPACK_IMPORTED_MODULE_1__Array__["e" /* findIndex */](this._listeners, function (info) {
            return info.once === once && // TODO is this correct ?
                info.type === type &&
                info.callback === callback &&
                info.context === context;
        });
        if (index !== -1) {
            this._listeners[index].disposer.dispose();
        }
    };
    /**
     * Checks if dispatching for particular event type is enabled.
     *
     * @param  {string}   type  Event type
     * @return {boolean}        Enabled?
     */
    EventDispatcher.prototype.isEnabled = function (type) {
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        // TODO is this check correct ?
        return this._enabled && this._disabled[type] == null && this._listeners.length > 0;
    };
    /**
     * Checks if there's already a listener with specific parameters.
     *
     * @param   {Key | null}  type      Listener's type
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     * @return {boolean}                Has listener?
     */
    EventDispatcher.prototype.has = function (type, callback, context) {
        var index = __WEBPACK_IMPORTED_MODULE_1__Array__["e" /* findIndex */](this._listeners, function (info) {
            return info.once !== true && // Ignoring "once" listeners
                info.type === type &&
                info.callback === callback &&
                info.context === context;
        });
        return index !== -1;
    };
    /**
     * Checks whether event of the particular type should be dispatched.
     *
     * @param  {string}   type  Event type
     * @return {boolean}        Dispatch?
     */
    EventDispatcher.prototype._shouldDispatch = function (type) {
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        var count = this._disabled[type];
        if (!__WEBPACK_IMPORTED_MODULE_3__Type__["isNumber"](count)) {
            return this._enabled;
        }
        else {
            if (count <= 1) {
                delete this._disabled[type];
            }
            else {
                --this._disabled[type];
            }
            return false;
        }
    };
    /**
     * [_eachListener description]
     *
     * All of this extra code is needed when a listener is removed while iterating
     *
     * @todo Description
     * @param {EventListener<T>) => void} fn [description]
     */
    EventDispatcher.prototype._eachListener = function (fn) {
        var _this = this;
        ++this._iterating;
        try {
            __WEBPACK_IMPORTED_MODULE_1__Array__["b" /* each */](this._listeners, fn);
        }
        finally {
            --this._iterating;
            // TODO should this be inside or outside the finally ?
            if (this._iterating === 0 && this._killed.length !== 0) {
                // Remove killed listeners
                __WEBPACK_IMPORTED_MODULE_1__Array__["b" /* each */](this._killed, function (killed) {
                    _this._removeListener(killed);
                });
                this._killed.length = 0;
            }
        }
    };
    /**
     * Dispatches an event immediately without waiting for next cycle.
     *
     * @param {Key}     type   Event type
     * @param {T[Key]}  event  Event object
     * @todo automatically add in type and target properties if they are missing
     */
    EventDispatcher.prototype.dispatchImmediately = function (type, event) {
        if (this._shouldDispatch(type)) {
            // TODO check if it's faster to use an object of listeners rather than a single big array
            // TODO if the function throws, maybe it should keep going ?
            this._eachListener(function (listener) {
                if (!listener.killed && (listener.type === null || listener.type === type)) {
                    listener.dispatch(type, event);
                }
            });
        }
    };
    /**
     * Shelves the event to be dispatched within next update cycle.
     *
     * @param {Key}     type   Event type
     * @param {T[Key]}  event  Event object
     * @todo automatically add in type and target properties if they are missing
     */
    EventDispatcher.prototype.dispatch = function (type, event) {
        if (this._shouldDispatch(type)) {
            this._eachListener(function (listener) {
                // TODO check if it's faster to use an object of listeners rather than a single big array
                if (!listener.killed && (listener.type === null || listener.type === type)) {
                    // TODO if the function throws, maybe it should keep going ?
                    // TODO dispatch during the update cycle, rather than using whenIdle
                    __WEBPACK_IMPORTED_MODULE_2__AsyncPending__["e" /* whenIdle */](function () {
                        if (!listener.killed) {
                            listener.dispatch(type, event);
                        }
                    });
                }
            });
        }
    };
    /**
     * Creates, catalogs and returns an [[EventListener]].
     *
     * Event listener can be disposed.
     *
     * @param   {boolean}     once      Listener's once setting
     * @param   {Key | null}  type      Listener's type
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     * @param   {function}    dispatch
     * @returns {EventListener} An event listener
     */
    EventDispatcher.prototype._on = function (once, type, callback, context, dispatch) {
        var _this = this;
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        this._removeExistingListener(once, type, callback, context);
        var info = {
            type: type,
            callback: callback,
            context: context,
            dispatch: dispatch,
            killed: false,
            once: once,
            disposer: new __WEBPACK_IMPORTED_MODULE_0__Disposer__["b" /* Disposer */](function () {
                info.killed = true;
                _this._removeListener(info);
            })
        };
        this._listeners.push(info);
        return info;
    };
    /**
     * Creates an event listener to be invoked on **any** event.
     *
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     * @returns {IDisposer}             A disposable event listener
     * @todo what if `listen` is called on the same function twice ?
     */
    EventDispatcher.prototype.onAll = function (callback, context) {
        return this._on(false, null, callback, context, function (type, event) { return callback.call(context, type, event); }).disposer;
    };
    /**
     * Creates an event listener to be invoked on a specific event type.
     *
     * ```TypeScript
     * series.events.on("hide", (ev) => {
     *   console.log("Series hidden: " + ev.target.name);
     * }, this);
     * ```
     * ```JavaScript
     * series.events.on("hide", function(ev) {
     *   console.log("Series hidden: " + ev.target.name);
     * }, this);
     * ```
     * ```JSON
     * {
     *   // ...
     *   "series": [{
     *     // ...
     *     "events": {
     *     	"hide": function(ev) {
     *     	  console.log("Series hidden: " + ev.target.name);
     *     	}
     *     }
     *   }]
     * }
     * ```
     *
     * The above will invoke our custom event handler whenever series we put
     * event on is hidden.
     *
     * @param   {Key | null}  type      Listener's type
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     * @returns {IDisposer}             A disposable event listener
     * @todo what if `listen` is called on the same function twice ?
     */
    EventDispatcher.prototype.on = function (type, callback, context) {
        return this._on(false, type, callback, context, function (type, event) { return callback.call(context, event); }).disposer;
    };
    /**
     * Creates an event listener to be invoked on a specific event type once.
     *
     * Once the event listener is invoked, it is automatically disposed.
     *
     * ```TypeScript
     * series.events.on("hide", (ev) => {
     *   console.log("Series hidden: " + ev.target.name);
     * }, this);
     * ```
     * ```JavaScript
     * series.events.on("hide", function(ev) {
     *   console.log("Series hidden: " + ev.target.name);
     * }, this);
     * ```
     * ```JSON
     * {
     *   // ...
     *   "series": [{
     *     // ...
     *     "events": {
     *     	"hide": function(ev) {
     *     	  console.log("Series hidden: " + ev.target.name);
     *     	}
     *     }
     *   }]
     * }
     * ```
     *
     * The above will invoke our custom event handler the first time series we
     * put event on is hidden.
     *
     * @param   {Key | null}  type      Listener's type
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     * @returns {IDisposer}             A disposable event listener
     * @todo what if `listen` is called on the same function twice ?
     */
    EventDispatcher.prototype.once = function (type, callback, context) {
        var x = this._on(true, type, callback, context, function (type, event) {
            x.disposer.dispose();
            callback.call(context, event);
        });
        // TODO maybe this should return a different Disposer ?
        return x.disposer;
    };
    /**
     * Removes the event listener with specific parameters.
     *
     * @param   {Key | null}  type      Listener's type
     * @param   {A}           callback  Callback function
     * @param   {B}           context   Callback context
     */
    EventDispatcher.prototype.off = function (type, callback, context) {
        this._removeExistingListener(false, type, callback, context);
    };
    /**
     * Copies all dispatcher parameters, including listeners, from another event
     * dispatcher.
     *
     * @param {this} source Source event dispatcher
     */
    EventDispatcher.prototype.copyFrom = function (source) {
        var _this = this;
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        if (source === this) {
            throw new Error("Cannot copyFrom the same TargetedEventDispatcher");
        }
        __WEBPACK_IMPORTED_MODULE_1__Array__["b" /* each */](source._listeners, function (x) {
            // TODO is this correct ?
            if (!x.killed) {
                if (x.type === null) {
                    _this.onAll(x.callback, x.context);
                }
                else if (x.once) {
                    _this.once(x.type, x.callback, x.context);
                }
                else {
                    _this.on(x.type, x.callback, x.context);
                }
            }
        });
    };
    return EventDispatcher;
}());

/**
 * A version of the [[EventDispatcher]] that dispatches events for a specific
 * target object.
 *
 * @type {[type]}
 * @important
 */
var TargetedEventDispatcher = /** @class */ (function (_super) {
    __extends(TargetedEventDispatcher, _super);
    /**
     * Constructor
     *
     * @param {Target} target Event dispatcher target
     */
    function TargetedEventDispatcher(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    /**
     * Copies all dispatcher parameters, including listeners, from another event
     * dispatcher.
     *
     * @param {this} source Source event dispatcher
     */
    TargetedEventDispatcher.prototype.copyFrom = function (source) {
        var _this = this;
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        if (source === this) {
            throw new Error("Cannot copyFrom the same TargetedEventDispatcher");
        }
        __WEBPACK_IMPORTED_MODULE_1__Array__["b" /* each */](source._listeners, function (x) {
            // TODO very hacky
            if (x.context === source.target) {
                return;
            }
            // TODO is this correct ?
            if (!x.killed) {
                if (x.type === null) {
                    _this.onAll(x.callback, x.context);
                }
                else if (x.once) {
                    _this.once(x.type, x.callback, x.context);
                }
                else {
                    _this.on(x.type, x.callback, x.context);
                }
            }
        });
    };
    return TargetedEventDispatcher;
}(EventDispatcher));

//# sourceMappingURL=EventDispatcher.js.map

/***/ }),

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Color; });
/* harmony export (immutable) */ __webpack_exports__["c"] = color;
/* harmony export (immutable) */ __webpack_exports__["d"] = isColor;
/* harmony export (immutable) */ __webpack_exports__["b"] = castColor;
/* harmony export (immutable) */ __webpack_exports__["e"] = toColor;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Colors__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Type__ = __webpack_require__(0);
/**
 * This module contains Color object definition
 */


/**
 * Represents a color.
 *
 * `Color` accepts value only in [[iRGB]] object format. To create `Color`
 * object by parsing it from any supported string-based formats, use helper
 * [[color]] function:
 *
 * ```TypeScript
 * amcharts4.color("#ff0000");
 * amcharts4.color("#f00");
 * amcharts4.color("rgb(255, 0, 0)");
 * amcharts4.color("rgba(255, 0, 0, 0.5)");
 * amcharts4.color({ r: 255, g: 0, b: 0 });
 * amcharts4.color("red");
 * ```
 * ```JavaScript
 * amcharts4.color("#ff0000");
 * amcharts4.color("#f00");
 * amcharts4.color("rgb(255, 0, 0)");
 * amcharts4.color("rgba(255, 0, 0, 0.5)");
 * amcharts4.color({ r: 255, g: 0, b: 0 });
 * amcharts4.color("red");
 * ```
 */
var Color = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {iRGB} color Source color
     */
    function Color(color) {
        this._value = color;
    }
    Object.defineProperty(Color.prototype, "rgb", {
        /**
         * Returns [[iRGB]] representation of the color.
         *
         * @return {iRGB} RGB object
         */
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "hex", {
        /**
         * Returns color hex value string, e.g. "#FF0000".
         *
         * @return {string} Hex color code
         */
        get: function () {
            return this._value ? __WEBPACK_IMPORTED_MODULE_0__Colors__["rgbToHex"](this._value) : "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "rgba", {
        /**
         * Returns an `rgba()` representation of the color, e.g.:
         * `rgba(255, 0, 0, 0.5)`.
         *
         * @return {string} rgba color string
         */
        get: function () {
            return this._value ? __WEBPACK_IMPORTED_MODULE_0__Colors__["rgbToRGBA"](this._value) : "none";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "alpha", {
        /**
         * Returns current transparency.
         *
         * @return {number} Alpha (0-1)
         */
        get: function () {
            if (this._value != null && this._value.a != null) {
                return this._value.a;
            }
            else {
                return 1;
            }
        },
        /**
         * Set alpha (transparency) of the color.
         *
         * @param {number} value Alpha (0-1)
         */
        set: function (value) {
            if (this._value) {
                this._value.a = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "lightColor", {
        /**
         * Returns current light color setting.
         *
         * @return {Color} Color
         */
        get: function () {
            if (!this._lightColor) {
                this._lightColor = new Color({ r: 255, g: 255, b: 255 });
            }
            return this._lightColor;
        },
        /**
         * Sets "light" color. Used when determining contrasting color.
         *
         * @param {Color} color Color
         */
        set: function (color) {
            this._lightColor = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Color.prototype, "darkColor", {
        /**
         * Returns current dark color setting.
         *
         * @return {Color} Color
         */
        get: function () {
            if (!this._darkColor) {
                this._darkColor = new Color({ r: 0, g: 0, b: 0 });
            }
            return this._darkColor;
        },
        /**
         * Sets "dark" color. Used when determining contrasting color.
         *
         * @param {Color} color Color
         */
        set: function (color) {
            this._darkColor = color;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Overrides `toString` method so that [[Color]] object can be used as
     * string.
     *
     * @ignore Exclude from docs
     * @return {string} String represantion of color (usable in CSS)
     */
    Color.prototype.toString = function () {
        return this.alpha < 1 ? this.rgba : this.hex;
    };
    /**
     * Retruns a new [[Color]] which is percent lighter (positivive value),
     * or darker (negative value).
     *
     * Parameter is in the scale of -1 to 1.
     *
     * @param  {number}  percent  Increase/decrease lightness by X
     * @return {Color}            New Color
     */
    Color.prototype.lighten = function (percent) {
        return new Color(__WEBPACK_IMPORTED_MODULE_0__Colors__["lighten"](this.rgb, percent));
    };
    /**
     * Retruns a new [[Color]] which is percent brighter (positivive value),
     * or darker (negative value).
     *
     * Parameter is in the scale of -1 to 1.
     *
     * @param  {number}  percent  Increase/decrease brightness by X
     * @return {Color}            New Color
     */
    Color.prototype.brighten = function (percent) {
        return new Color(__WEBPACK_IMPORTED_MODULE_0__Colors__["brighten"](this.rgb, percent));
    };
    /**
     * Returns a new [[Color]] based on current color with specific saturation
     * applied.
     *
     * `saturation` can be in the range of 0 (fully desaturated) to 1 (fully
     * saturated).
     *
     * @param  {number}  saturation  Saturation (0-1)
     * @return {Color}               New (saturated) color
     */
    Color.prototype.saturate = function (saturation) {
        return new Color(__WEBPACK_IMPORTED_MODULE_0__Colors__["saturate"](this.rgb, saturation));
    };
    Object.defineProperty(Color.prototype, "alternative", {
        /**
         * Returns a either light or dark color that contrasts specifically with
         * this color.
         *
         * Uses properties `darkColor` (default black) and `lightColor` (default
         * white).
         *
         * Useful when determining which color label should be on a colored
         * background, so that it stands out.
         *
         * @return {Color} Contrasting color
         */
        get: function () {
            if (this.rgb != null) {
                return __WEBPACK_IMPORTED_MODULE_0__Colors__["isLight"](this.rgb) ? this.darkColor : this.lightColor;
            }
            else {
                throw new Error("Color does not exist");
            }
        },
        enumerable: true,
        configurable: true
    });
    return Color;
}());

/**
 * Resolves an input variable to a normal [[iRGB]] color and creates [[Color]]
 * object for it.
 *
 * @param  {string | iRGB | Color}  value  Input value
 * @param  {number}                 alpha  Alpha (0-1)
 * @return {Color}                         Color object
 */
function color(value, alpha) {
    if (!__WEBPACK_IMPORTED_MODULE_1__Type__["hasValue"](value)) {
        return new Color();
    }
    if (typeof value == "string") {
        return new Color(__WEBPACK_IMPORTED_MODULE_0__Colors__["rgb"](value, alpha));
    }
    // Check if it's already a Color object
    if (value instanceof Color) {
        if (__WEBPACK_IMPORTED_MODULE_1__Type__["hasValue"](alpha)) {
            value.alpha = alpha;
        }
        return value;
    }
    // Not a string or Color instance, it's the iRGB object then
    return new Color(value);
}
/**
 * Checks if supplied argument is instance of [[Color]].
 *
 * @param  {any}      value  Input value
 * @return {boolean}         Is Color?
 */
function isColor(value) {
    return value instanceof Color;
}
/**
 * Converts any value to [[Color]].
 *
 * @param  {any}    value  Input value
 * @return {Color}         Color
 */
function castColor(value) {
    return color(value);
}
/**
 * Converts any value into a [[Color]].
 *
 * @param  {any}    value  Source value
 * @return {Color}         Color object
 */
function toColor(value) {
    if (__WEBPACK_IMPORTED_MODULE_1__Type__["hasValue"](value) && !isColor(value)) {
        return castColor(value);
    }
    return value;
}
//# sourceMappingURL=Color.js.map

/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DictionaryDisposer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Dictionary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return DictionaryTemplate; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Disposer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EventDispatcher__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Object__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__String__ = __webpack_require__(42);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */





/**
 * A disposable dictionary, which when disposed itself will call `dispose()`
 * method on all its items.
 */
var DictionaryDisposer = /** @class */ (function (_super) {
    __extends(DictionaryDisposer, _super);
    function DictionaryDisposer(dict) {
        var _this = this;
        var disposer = dict.events.on("remove", function (x) {
            x.oldValue.dispose();
        });
        _this = _super.call(this, function () {
            disposer.dispose();
            // TODO clear the dictionary ?
            __WEBPACK_IMPORTED_MODULE_3__Iterator__["each"](dict.iterator(), function (a) {
                var v = a[1];
                v.dispose();
            });
        }) || this;
        return _this;
    }
    return DictionaryDisposer;
}(__WEBPACK_IMPORTED_MODULE_0__Disposer__["b" /* Disposer */]));

/**
 * A Dictionary is collection where values of some type can be mapped to
 * string keys.
 *
 * You might call it an "associative list" or "associative array".
 */
var Dictionary = /** @class */ (function () {
    /**
     * Constructor
     */
    function Dictionary() {
        this.events = new __WEBPACK_IMPORTED_MODULE_1__EventDispatcher__["a" /* EventDispatcher */]();
        this._dictionary = {};
    }
    /**
     * Returns `true` if key exists in Dictionary.
     *
     * @param  {Key}      key  The key to search for
     * @return {boolean}       `true` if key exists, `false` if it doesn't
     */
    Dictionary.prototype.hasKey = function (key) {
        return __WEBPACK_IMPORTED_MODULE_2__Object__["hasKey"](this._dictionary, key);
    };
    /**
     * Returns the value for a specific key.
     *
     * @param  {Key}          key  The key to search for
     * @return {Optional<T>}       Value for the key, or `undefined` if it doesn't exist
     */
    Dictionary.prototype.getKey = function (key) {
        return this._dictionary[key];
    };
    /**
     * Inserts value at specific key.
     *
     * Will thrown an exception if the key already exists in the dictionary.
     *
     * @param {Key}  key    Key
     * @param {T}    value  Value
     */
    Dictionary.prototype.insertKey = function (key, value) {
        if (__WEBPACK_IMPORTED_MODULE_2__Object__["hasKey"](this._dictionary, key)) {
            throw new Error("Key " + key + " already exists in dictionary");
        }
        else {
            this._dictionary[key] = value;
            if (this.events.isEnabled("insertKey")) {
                this.events.dispatchImmediately("insertKey", {
                    type: "insertKey",
                    target: this,
                    key: key,
                    newValue: value
                });
            }
        }
    };
    /**
     * Adds or updates key/value into dictionary.
     *
     * If the key already exists, the old value will be overwritten.
     *
     * @param  {Key}  key    Key
     * @param  {T}    value  Value
     */
    Dictionary.prototype.setKey = function (key, value) {
        if (__WEBPACK_IMPORTED_MODULE_2__Object__["hasKey"](this._dictionary, key)) {
            var oldValue = this._dictionary[key];
            this._dictionary[key] = value;
            if (this.events.isEnabled("setKey")) {
                this.events.dispatchImmediately("setKey", {
                    type: "setKey",
                    target: this,
                    key: key,
                    oldValue: oldValue,
                    newValue: value
                });
            }
            if (this.events.isEnabled("remove")) {
                this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: this,
                    oldValue: oldValue
                });
            }
        }
        else {
            this._dictionary[key] = value;
            if (this.events.isEnabled("insertKey")) {
                this.events.dispatchImmediately("insertKey", {
                    type: "insertKey",
                    target: this,
                    key: key,
                    newValue: value
                });
            }
        }
    };
    /**
     * Updates the value at specific `key` using custom function.
     *
     * Passes in current value into the function, and uses its output as a new
     * value.
     *
     * @ignore Exclude from docs
     * @param {Key}       key  Key
     * @param {function}  fn   Function to transform the value
     */
    Dictionary.prototype.updateKey = function (key, fn) {
        if (__WEBPACK_IMPORTED_MODULE_2__Object__["hasKey"](this._dictionary, key)) {
            var oldValue = this._dictionary[key];
            var newValue = fn(oldValue);
            this._dictionary[key] = newValue;
            if (this.events.isEnabled("setKey")) {
                this.events.dispatchImmediately("setKey", {
                    type: "setKey",
                    target: this,
                    key: key,
                    oldValue: oldValue,
                    newValue: newValue
                });
            }
            if (this.events.isEnabled("remove")) {
                this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: this,
                    oldValue: oldValue
                });
            }
        }
        else {
            throw new Error("Key " + key + " doesn't exist in dictionary");
        }
    };
    /**
     * Removes value at specific `key` from dictionary.
     *
     * @param {Key}  key  Key to remove
     */
    Dictionary.prototype.removeKey = function (key) {
        if (__WEBPACK_IMPORTED_MODULE_2__Object__["hasKey"](this._dictionary, key)) {
            var oldValue = this._dictionary[key];
            delete this._dictionary[key];
            if (this.events.isEnabled("removeKey")) {
                this.events.dispatchImmediately("removeKey", {
                    type: "removeKey",
                    target: this,
                    key: key,
                    oldValue: oldValue
                });
            }
            if (this.events.isEnabled("remove")) {
                this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: this,
                    oldValue: oldValue
                });
            }
        }
    };
    /**
     * [insertKeyIfEmpty description]
     *
     * @ignore Exclude from docs
     * @todo description
     * @param  {Key}       key      [description]
     * @param  {function}  ifEmpty  [description]
     * @return {T}                  [description]
     */
    Dictionary.prototype.insertKeyIfEmpty = function (key, ifEmpty) {
        if (!this.hasKey(key)) {
            this.insertKey(key, ifEmpty());
        }
        return this.getKey(key);
    };
    /**
     * Removes all items from the dictionary.
     */
    Dictionary.prototype.clear = function () {
        var _this = this;
        // TODO dispatch this after clear
        if (this.events.isEnabled("remove")) {
            __WEBPACK_IMPORTED_MODULE_2__Object__["each"](this._dictionary, function (key, value) {
                _this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: _this,
                    oldValue: value
                });
            });
        }
        this._dictionary = {};
        if (this.events.isEnabled("clear")) {
            this.events.dispatchImmediately("clear", {
                type: "clear",
                target: this
            });
        }
    };
    /**
     * Copies items from another Dictionary.
     *
     * @param {Dictionary<Key, T>}  source  A Dictionary to copy items from
     */
    Dictionary.prototype.copyFrom = function (source) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_3__Iterator__["each"](source.iterator(), function (a) {
            // TODO fix this type cast
            _this.setKey(a[0], a[1]);
        });
    };
    /**
     * Returns an interator that can be used to iterate through all items in
     * the dictionary.
     *
     * @return {Iterator} Iterator
     */
    Dictionary.prototype.iterator = function () {
        // @todo fix this type after the Iterator bug is fixed
        // https://github.com/Microsoft/TypeScript/issues/16730
        return __WEBPACK_IMPORTED_MODULE_2__Object__["entries"](this._dictionary);
    };
    /**
     * Returns an iterator that can be used to iterate through all items in
     * the dictionary, ordered by key.
     *
     * @ignore Exclude from docs
     * @return {Iterator} Iterator
     */
    Dictionary.prototype.sortedIterator = function () {
        return __WEBPACK_IMPORTED_MODULE_3__Iterator__["sort"](this.iterator(), function (x, y) { return __WEBPACK_IMPORTED_MODULE_4__String__["order"](x[0], y[0]); });
    };
    return Dictionary;
}());

/**
 * A version of a [[Dictionary]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
var DictionaryTemplate = /** @class */ (function (_super) {
    __extends(DictionaryTemplate, _super);
    /**
     * Constructor
     *
     * @param {T} t Template object
     */
    function DictionaryTemplate(t) {
        var _this = _super.call(this) || this;
        _this.template = t;
        return _this;
    }
    Object.defineProperty(DictionaryTemplate.prototype, "template", {
        /**
         * @return {T} Template object
         */
        get: function () {
            return this._template;
        },
        /**
         * A "template" object to copy all properties from when creating new list
         * items.
         *
         * @param {T}  v  Template object
         */
        set: function (v) {
            v.isTemplate = true;
            this._template = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all elements from other dictionary.
     *
     * @param {DictionaryTemplate}  source  Source dictionary
     */
    DictionaryTemplate.prototype.copyFrom = function (source) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_3__Iterator__["each"](source.iterator(), function (a) {
            // TODO fix this type cast
            // TODO why does this need to clone ?
            _this.setKey(a[0], a[1].clone());
        });
    };
    /**
     * Instantiates a new object of the specified type, adds it to specified
     * `key` in the dictionary, and returns it.
     *
     * @param make  Item type to use. Will use the default type for the dictionary if not specified.
     * @return      Newly created item
     */
    DictionaryTemplate.prototype.create = function (key) {
        var _this = this;
        return this.insertKeyIfEmpty(key, function () { return _this.template.clone(); });
    };
    return DictionaryTemplate;
}(Dictionary));

//# sourceMappingURL=Dictionary.js.map

/***/ }),

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Percent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Type__ = __webpack_require__(0);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_0__Type__["percent"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__Type__["isPercent"]; });
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Represents a relative value. (percent)
 */
var Percent = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {number}  percent  Percent value
     */
    function Percent(percent) {
        this._value = percent;
    }
    Object.defineProperty(Percent.prototype, "value", {
        /**
         * Relative value.
         *
         * E.g. 100% is 1, 50% is 0.5, etc.
         *
         * This is useful to apply transformations to other values. E.g.:
         *
         * ```TypeScript
         * let value = 256;
         * let percent = new amcharts4.Percent(50);
         * console.log(value * percent.value); // outputs 128
         * ```
         * ```JavaScript
         * var value = 256;
         * var percent = new amcharts4.Percent(50);
         * console.log(value * percent.value); // outputs 128
         * ```
         *
         * @readonly
         * @return {number} Relative value
         */
        get: function () {
            return this._value / 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Percent.prototype, "percent", {
        /**
         * Value in percent.
         *
         * @return {number} Percent
         */
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return Percent;
}());

//# sourceMappingURL=Percent.js.map

/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GlobalAdapter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return globalAdapter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Adapter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SortedList__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Number__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Order__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_Array__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_Type__ = __webpack_require__(0);
/**
 * An Adapter can be used to apply chained synchronous transformations to any
 * value at runtime.
 *
 * Each type class using Adapters must have `adapters` property and adapter
 * interface defined.
 *
 * Adapters can be used to allow external code to apply transformations to any
 * value at any time.
 *
 * For example we have a Weather class which has a method `now()` which returns
 * current temperature.
 *
 * ```
 * function now() {
 *   // ... calculate temperature
 *   let temp = "Temperature now is " + degrees + "F";
 *   return temp;
 * }
 * ```
 *
 * Now, supposed we want to let other classes to modify the output of the
 * `now()`? We just apply an adapter to the `temp` before it is returned:
 *
 * ```
 * temp = this.adapters.apply("now", {
 *   temp: temp,
 *   degrees: degrees
 * }).temp;
 * ```
 *
 * Some other class might tap onto it by defining an Adapter that calculates
 * the temperature in Celsius:
 *
 * weather.adapters.add("now", (arg) => {
 *   arg.temp += "(" + farenheitToCelsius(arg.degrees) + "C)";
 *   return arh;
 * });
 *
 * Furthermore some time-related class could add time:
 *
 * weather.adapters.add("now", (arg) => {
 *   arg.temp += "; the time now is " + (new Date().toLocaleString());
 *   return arh;
 * });
 *
 * So without adapters we would get output like this:
 *
 * ```
 * Temperature now is 90F
 * ```
 *
 * With adapters applied we now have:
 *
 * ```
 * Temperature now is 90F (32C); the time now is 12/11/2012, 7:00:00 PM
 * ```
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */






/**
 * ============================================================================
 * GLOBAL ADAPTER
 * ============================================================================
 * @hidden
 */
/**
 * A global adapter is an adpater that is attached to a class type rather than
 * specific object instance.
 *
 * @ignore Exclude from docs
 */
var GlobalAdapter = /** @class */ (function () {
    function GlobalAdapter() {
        /**
         * Callback id iterator.
         *
         * @type {number}
         */
        this._callbackId = 0;
        /**
         * A list of if callbacks (adapters).
         *
         */
        this._callbacks = new __WEBPACK_IMPORTED_MODULE_0__SortedList__["c" /* SortedList */](function (left, right) {
            return __WEBPACK_IMPORTED_MODULE_2__Order__["a" /* or */](__WEBPACK_IMPORTED_MODULE_1__Number__["order"](left.priority, right.priority), __WEBPACK_IMPORTED_MODULE_1__Number__["order"](left.id, right.id));
        });
    }
    /**
     * Adds a global callback which is not specific to any particular object.
     * Whenever an adapter in any object of the specific class type is invoked
     * global adapters will kick in.
     *
     * @param {any}         type      Class type
     * @param {any}         key       Adapter key
     * @param {any}         callback  Callback function
     * @param {number = 0}  priority  Priority (higher priority meaning adapter will be applied later)
     * @param {any}         scope     Callback function scaope
     */
    GlobalAdapter.prototype.addAll = function (type, key, callback, priority, scope) {
        if (priority === void 0) { priority = 0; }
        this._callbacks.insert({
            id: ++this._callbackId,
            key: key,
            callback: callback,
            priority: priority,
            scope: scope,
            type: type
        });
    };
    /**
     * Returns if there are adapters for specific type available.
     *
     * @param  {Target}   type  Adapter type
     * @param  {Key}      key   Adapter key
     * @return {boolean}
     */
    GlobalAdapter.prototype.isEnabled = function (type, key) {
        // TODO check the type and key
        return this._callbacks.length > 0;
    };
    /**
     * Applies global adapters for the object of the specific type.
     *
     * @param {any}  type   Class type
     * @param {any}  key    Adapter key
     * @param {any}  value  Value
     */
    GlobalAdapter.prototype.applyAll = function (type, key, value) {
        // This is needed to improve the performance and reduce garbage collection
        var callbacks = this._callbacks.values;
        var length = callbacks.length;
        // Cycle through all callbacks and find the ones we need to use
        for (var i = 0; i < length; ++i) {
            var item = callbacks[i];
            if (item.key === key && type instanceof item.type) {
                value = item.callback.call(item.scope, value, type);
            }
        }
        return value;
    };
    return GlobalAdapter;
}());

/**
 * A global Adapter for plugins that want to add specific
 * functionality for any chart, not just specific instance.
 *
 * If you want to add an adapter which applies to all instances of the same
 * object type, like, for instance all slices in PieSeries, you can use
 * global adapter.
 *
 * Global adapter is a system-wide instance, accessible via `globalAdapter`.
 *
 * ```TypeScript
 * amcharts4.globalAdapter.addAll<charts.IPieSeriesAdapters, charts.PieSeries, "fill">(charts.PieSeries. "fill", (value, target) => {
 *   return amcharts4.color("#005500");
 * });
 * ```
 * ```JavaScript
 * amcharts4.globalAdapter.addAll(amcharts4.charts.PieSeries. "fill", (value, target) => {
 *   return amcharts4.color("#005500");
 * });
 * ```
 *
 * @todo Description (improve)
 */
var globalAdapter = new GlobalAdapter();
/**
 * ============================================================================
 * REGULAR ADAPTER
 * ============================================================================
 * @hidden
 */
/**
 * Adapter allows adding ordered callback functions and associating them with a
 * string-based key. An Adapter user can then easily invoke those callbacks to
 * apply custom functions on its input, output or intermediate values.
 *
 * Custom code and plugins can add their own callbacks to modify and enhance
 * core functionality.
 *
 * See the description of `add()` for an example.
 *
 * Almost any object in amCharts4 has own adapter, accessible with `adapter`
 * property.
 *
 * Any adapters added to it will be applied to that object only.
 *
 * ### Global Adapters
 *
 * If you want to add an adapter which applies to all instances of the same
 * object type, like, for instance all slices in PieSeries, you can use
 * global adapter.
 *
 * Global adapter is a system-wide instance, accessible via `globalAdapter`.
 *
 * ```TypeScript
 * amcharts4.globalAdapter.addAll<charts.IPieSeriesAdapters, charts.PieSeries, "fill">(charts.PieSeries. "fill", (value, target) => {
 *   return amcharts4.color("#005500");
 * });
 * ```
 * ```JavaScript
 * amcharts4.globalAdapter.addAll(amcharts4.charts.PieSeries. "fill", (value, target) => {
 *   return amcharts4.color("#005500");
 * });
 * ```
 *
 * {@link https://www.amcharts.com/docs/v4/reference/adapter_module/#globalAdapter_property More info}.
 *
 * @important
 */
var Adapter = /** @class */ (function () {
    /**
     * Constructor, sets the object referece this Adapter should be used for.
     *
     * @param {T} c Object
     */
    function Adapter(c) {
        /**
         * Internal counter for callback ids.
         *
         * @type {number}
         */
        this._callbackId = 0;
        /**
         * A list of adapter callbacks.
         *
         * @param {[type]} $number.order(left.priority, right.priority) [description]
         * @param {[type]} $number.order(left.id,       right.id));	}  [description]
         */
        this._callbacks = new __WEBPACK_IMPORTED_MODULE_0__SortedList__["c" /* SortedList */](function (left, right) {
            return __WEBPACK_IMPORTED_MODULE_2__Order__["a" /* or */](__WEBPACK_IMPORTED_MODULE_1__Number__["order"](left.priority, right.priority), __WEBPACK_IMPORTED_MODULE_1__Number__["order"](left.id, right.id));
        });
        this.object = c;
        // TODO this exposes the internal events
        this.events = this._callbacks.events;
    }
    /**
     * Adds a callback for a specific key.
     *
     * ```TypeScript
     * // Override fill color value and make all slices green
     * chart.series.template.adapter.add("fill", (value, target) => {
     *   return amcharts4.color("#005500");
     * });
     * ```
     * ```JavaScript
     * // Override fill color value and make all slices green
     * chart.series.template.adapter.add("fill", function(value, target) {
     *   return amcharts4.color("#005500");
     * });
     * ```
     * ```JSON
     * {
     *   // ...
     *   "series": [{
     *     // ...
     *     "adapter": {
     *     	// Override fill color value and make all slices green
     *     	"fill": function(value, target) {
     *     	  return amcharts4.color("#005500");
     *     	}
     *     }
     *   }]
     * }
     * ```
     *
     * The above will call user-defined function (adapter) whenever `fill` value
     * is requested from the Pie series, allowing it to override the default
     * using custom code and any fuzzy logic.
     *
     * There can be any number of adapters set on one property key.
     *
     * In this case adapters will be applied in daisy-chain fashion. The first
     * adapter in queue will make its transformation. The next one will have
     * the output of the first adapter as a starting value, etc.
     *
     * The order of the adapters are determined either by the order they were
     * added in, or their `priority` value.
     *
     * The heigher the `priority`, the later in the game adapter will be applied.
     *
     * @param {string}         key       Key
     * @param {any[]) => any}  callback  A callback function
     * @param {number}         priority  The higher priority, the more chance the adapter will be applied last
     * @param {any}            scope     Scope for the callback function
     */
    Adapter.prototype.add = function (key, callback, priority, scope) {
        if (priority === void 0) { priority = 0; }
        this._callbacks.insert({
            id: ++this._callbackId,
            key: key,
            callback: callback,
            priority: priority,
            scope: scope
        });
    };
    /**
     * Checks whether specific adapter is already set.
     *
     * @param   {string}         key       Key
     * @param   {any[]) => any}  callback  A callback function
     * @param   {number}         priority  The higher priority, the more chance the adapter will be applied last
     * @param   {any}            scope     Scope for the callback function
     * @returns                            Adapter set?
     */
    Adapter.prototype.has = function (key, callback, priority, scope) {
        if (priority === void 0) { priority = 0; }
        // @todo Implement actual check
        return false;
    };
    /**
     * Removes adapter callbacks for the specific `key`.
     *
     * If `priority` is specified, only callbacks for that priority are removed.
     *
     * @param {string} key      Key
     * @param {number} priority Priority
     * @todo Implement
     */
    Adapter.prototype.remove = function (key, priority) {
        var _this = this;
        // It has to make a copy because it removes the elements while iterating
        // TODO inefficient
        __WEBPACK_IMPORTED_MODULE_4__utils_Array__["b" /* each */](__WEBPACK_IMPORTED_MODULE_3__utils_Iterator__["toArray"](this._callbacks.iterator()), function (item) {
            // TODO test this
            if (item.key === key && (!__WEBPACK_IMPORTED_MODULE_5__utils_Type__["isNumber"](priority) || priority === item.priority)) {
                _this._callbacks.remove(item);
            }
        });
    };
    /**
     * Returns if there are any adapters set for the specific `key`.
     *
     * @returns {boolean} Are there any adapters for the key?
     */
    Adapter.prototype.isEnabled = function (key) {
        // TODO check the key
        return this._callbacks.length > 0 || globalAdapter.isEnabled(this.object, key);
    };
    /**
     * Passes the input value through all the callbacks for the defined `key`.
     *
     * @param  {string}  key      Key
     * @param  {any}     value    Input value
     * @param  {any[]}   ...rest  Rest of the parameters to be passed into callback
     * @return {any}              Output value
     */
    Adapter.prototype.apply = function (key, value) {
        // This is needed to improve the performance and reduce garbage collection
        var callbacks = this._callbacks.values;
        var length = callbacks.length;
        for (var i = 0; i < length; ++i) {
            var item = callbacks[i];
            if (item.key === key) {
                value = item.callback.call(item.scope, value, this.object);
            }
        }
        // Apply global adapters
        value = globalAdapter.applyAll(this.object, key, value);
        return value;
    };
    Object.defineProperty(Adapter.prototype, "keys", {
        /**
         * Returns all adapter keys that are currently in effect.
         *
         * @return {string[]} Adapter keys
         */
        get: function () {
            // TODO inefficient
            return __WEBPACK_IMPORTED_MODULE_3__utils_Iterator__["toArray"](__WEBPACK_IMPORTED_MODULE_3__utils_Iterator__["map"](this._callbacks.iterator(), function (x) { return x.key; }));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all the adapter callbacks from `source`.
     *
     * @param {Adapter<Target, T>}  source  An Adapter to copy items from
     */
    Adapter.prototype.copyFrom = function (source) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_3__utils_Iterator__["each"](source._callbacks.iterator(), function (x) {
            _this.add(x.key, x.callback, x.priority, x.scope);
        });
    };
    return Adapter;
}());

//# sourceMappingURL=Adapter.js.map

/***/ }),

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PI", function() { return PI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HALFPI", function() { return HALFPI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RADIANS", function() { return RADIANS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEGREES", function() { return DEGREES; });
/* harmony export (immutable) */ __webpack_exports__["toNumberRange"] = toNumberRange;
/* harmony export (immutable) */ __webpack_exports__["round"] = round;
/* harmony export (immutable) */ __webpack_exports__["stretch"] = stretch;
/* harmony export (immutable) */ __webpack_exports__["fitToRange"] = fitToRange;
/* harmony export (immutable) */ __webpack_exports__["sin"] = sin;
/* harmony export (immutable) */ __webpack_exports__["tan"] = tan;
/* harmony export (immutable) */ __webpack_exports__["cos"] = cos;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["closest"] = closest;
/* harmony export (immutable) */ __webpack_exports__["intersect"] = intersect;
/* harmony export (immutable) */ __webpack_exports__["invertRange"] = invertRange;
/* harmony export (immutable) */ __webpack_exports__["intersection"] = intersection;
/* harmony export (immutable) */ __webpack_exports__["getDistance"] = getDistance;
/* harmony export (immutable) */ __webpack_exports__["getScale"] = getScale;
/* harmony export (immutable) */ __webpack_exports__["getMidPoint"] = getMidPoint;
/* harmony export (immutable) */ __webpack_exports__["getRotation"] = getRotation;
/* harmony export (immutable) */ __webpack_exports__["getAngle"] = getAngle;
/* harmony export (immutable) */ __webpack_exports__["getCenterShift"] = getCenterShift;
/* harmony export (immutable) */ __webpack_exports__["getBBox"] = getBBox;
/* harmony export (immutable) */ __webpack_exports__["getCommonRectangle"] = getCommonRectangle;
/* harmony export (immutable) */ __webpack_exports__["getPointOnQuadraticCurve"] = getPointOnQuadraticCurve;
/* harmony export (immutable) */ __webpack_exports__["getPointOnCubicCurve"] = getPointOnCubicCurve;
/* harmony export (immutable) */ __webpack_exports__["getCubicControlPointA"] = getCubicControlPointA;
/* harmony export (immutable) */ __webpack_exports__["getCubicControlPointB"] = getCubicControlPointB;
/* harmony export (immutable) */ __webpack_exports__["adjustTension"] = adjustTension;
/* harmony export (immutable) */ __webpack_exports__["normalizeAngle"] = normalizeAngle;
/* harmony export (immutable) */ __webpack_exports__["fitAngleToRange"] = fitAngleToRange;
/* harmony export (immutable) */ __webpack_exports__["getArcRect"] = getArcRect;
/* harmony export (immutable) */ __webpack_exports__["isInRectangle"] = isInRectangle;
/* harmony export (immutable) */ __webpack_exports__["getLineIntersection"] = getLineIntersection;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Type__ = __webpack_require__(0);
/**
 * A collection of Math-related functions
 *
 * @todo Comment trigonometric functions?
 */

/**
 * ============================================================================
 * CONSTANTS
 * ============================================================================
 * @hidden
 */
var PI = Math.PI;
var HALFPI = PI / 2;
var RADIANS = PI / 180;
var DEGREES = 180 / PI;
/**
 * Converts any value and fits it into a specific value range.
 *
 * @param  {any}     value  Source value
 * @param  {number}  min    Minimum allowable value
 * @param  {number}  max    Maximum allowable value
 * @return {number}         Number
 */
function toNumberRange(value, min, max) {
    if (__WEBPACK_IMPORTED_MODULE_0__Type__["hasValue"](value)) {
        value = __WEBPACK_IMPORTED_MODULE_0__Type__["toNumber"](value);
        return fitToRange(value, min, max);
    }
    return value;
}
/**
 * Rounds the numeric value to whole number or specific precision of set.
 *
 * @param  {number} value      Value
 * @param  {number} precision  Precision (number of decimal points)
 * @return {number}            Rounded value
 */
function round(value, precision) {
    if (!__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](precision) || precision <= 0) {
        return Math.round(value);
    }
    else {
        var d = Math.pow(10, precision);
        return Math.round(value * d) / d;
    }
}
/**
 * Stretches `t` so that it will always be between `from` and `to`.
 *
 * @param  {number} t     Number from 0 to 1
 * @param  {number} from  Lowest possible value
 * @param  {number} to    Highest possible value
 * @return {number}       Adjusted value
 */
function stretch(t, from, to) {
    return (t * (to - from)) + from;
}
/**
 * Adjust numeric value so it fits to specific value range.
 *
 * @param  {number} value     Value
 * @param  {number} minValue  Lowest possible value
 * @param  {number} maxValue  Highest possible value
 * @return {number}           Adjusted value
 */
function fitToRange(value, minValue, maxValue) {
    if (maxValue < minValue) {
        var temp = maxValue;
        maxValue = minValue;
        minValue = temp;
    }
    if (value < minValue) {
        value = minValue;
    }
    if (value > maxValue) {
        value = maxValue;
    }
    return value;
}
/**
 * Returns sine of a number.
 *
 * @param  {number} value  Value
 * @return {number}        Sine
 */
function sin(value) {
    return round(Math.sin(RADIANS * value), 10);
}
/**
 * Returns tan of a number.
 *
 * @param  {number} value  Value
 * @return {number}        Sine
 */
function tan(value) {
    return round(Math.tan(RADIANS * value), 10);
}
/**
 * Returns cosine of a number.
 *
 * @param  {number} value  Value
 * @return {number}        Cosine
 */
function cos(value) {
    return round(Math.cos(RADIANS * value), 10);
}
function max(left, right) {
    if (__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](left)) {
        if (__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](right)) {
            if (right > left) {
                return right;
            }
            else {
                return left;
            }
        }
        else {
            return left;
        }
    }
    else if (__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](right)) {
        return right;
    }
    else {
        return null;
    }
}
function min(left, right) {
    if (__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](left)) {
        if (__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](right)) {
            if (right < left) {
                return right;
            }
            else {
                return left;
            }
        }
        else {
            return left;
        }
    }
    else if (__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](right)) {
        return right;
    }
    else {
        return null;
    }
}
/**
 * Returns the closest value from the array of values to the reference value.
 *
 * @param  {number[]}  values  Array of values
 * @param  {number}    value   Reference value
 * @return {number}            Closes value from the array
 */
function closest(values, referenceValue) {
    return values.reduce(function (prev, curr) {
        return (Math.abs(curr - referenceValue) < Math.abs(prev - referenceValue) ? curr : prev);
    });
}
/**
 * Checks whether two ranges of values intersect.
 *
 * @param {IRange}    range1  Range 1
 * @param {IRange}    range2  Range 2
 * @return {boolean}          Any intersecting numbers?
 */
function intersect(range1, range2) {
    var start1 = __WEBPACK_IMPORTED_MODULE_0__Type__["getValue"](range1.start);
    var start2 = __WEBPACK_IMPORTED_MODULE_0__Type__["getValue"](range2.start);
    var end1 = __WEBPACK_IMPORTED_MODULE_0__Type__["getValue"](range1.end);
    var end2 = __WEBPACK_IMPORTED_MODULE_0__Type__["getValue"](range2.end);
    return Math.max(start1, start2) <= Math.min(end1, end2);
}
/**
 * Inverts the range of values.
 *
 * @param {IRange}  range  Range
 */
function invertRange(range) {
    var start = __WEBPACK_IMPORTED_MODULE_0__Type__["getValue"](range.start);
    var end = __WEBPACK_IMPORTED_MODULE_0__Type__["getValue"](range.end);
    return { start: 1 - end, end: 1 - start };
}
/**
 * Returns an intersection range between two ranges of values.
 *
 * @param  {IRange}  range1  Range 1
 * @param  {IRange}  range2  Range 2
 * @return {IRange}          Intersecting value range
 */
function intersection(range1, range2) {
    var start1 = __WEBPACK_IMPORTED_MODULE_0__Type__["getValue"](range1.start);
    var start2 = __WEBPACK_IMPORTED_MODULE_0__Type__["getValue"](range2.start);
    var end1 = __WEBPACK_IMPORTED_MODULE_0__Type__["getValue"](range1.end);
    var end2 = __WEBPACK_IMPORTED_MODULE_0__Type__["getValue"](range2.end);
    var startMax = Math.max(start1, start2);
    var endMin = Math.min(end1, end2);
    if (endMin < startMax) {
        return undefined;
    }
    else {
        return { start: startMax, end: endMin };
    }
}
/**
 * Returns pixel "distance" between two points.
 *
 * If second point is not specified, distance from {x:0, y:0} point is
 * calculated.
 *
 * @param  {IPoint}  point1  Point 1
 * @param  {IPoint}  point2  Point 2
 * @return {number}          Distance in relative pixels
 */
function getDistance(point1, point2) {
    if (!point2) {
        point2 = { x: 0, y: 0 };
    }
    return Math.sqrt(Math.pow(Math.abs(point1.x - point2.x), 2) + Math.pow(Math.abs(point1.y - point2.y), 2));
}
/**
 * Returns scale based on original and end position of the two points.
 *
 * @param  {IPoint}  point1       Current position of point 1
 * @param  {IPoint}  startPoint1  Start position of point 1
 * @param  {IPoint}  point2       Current position of point 1
 * @param  {IPoint}  startPoint2  Start position of point 2
 * @return {number}  Scale        Calculated scale
 */
function getScale(point1, startPoint1, point2, startPoint2) {
    var initialDistance = getDistance(startPoint1, startPoint2);
    var currentDistance = getDistance(point1, point2);
    return Math.abs(currentDistance / initialDistance);
}
/**
 * Returns an exact mid point between two points.
 *
 * @param  {IPoint}  point1     Position of point 1
 * @param  {IPoint}  point2     Position of point 2
 * @return {IPoint}  Mid point  Position of mid-point
 */
function getMidPoint(point1, point2, position) {
    if (!__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](position)) {
        position = 0.5;
    }
    return {
        "x": (point1.x + (point2.x - point1.x) * position),
        "y": (point1.y + (point2.y - point1.y) * position)
    };
}
/**
 * Returns difference in angles between starting and ending position of two
 * vectors.
 *
 * @param  {IPoint}  point1       Current position of point 1
 * @param  {IPoint}  startPoint1  Start position of point 1
 * @param  {IPoint}  point2       Current position of point 1
 * @param  {IPoint}  startPoint2  Start position of point 2
 * @return {number}               Angle difference in degrees
 */
function getRotation(point1, startPoint1, point2, startPoint2) {
    // Get start and end angles
    var startAngle = getAngle(startPoint1, startPoint2);
    var angle = getAngle(point1, point2);
    // Calculate angle
    var diff = startAngle - angle;
    if (diff < 0) {
        diff += 360;
    }
    return diff;
}
/**
 * Calculates angle of the vector based on two or one point.
 *
 * @param  {IPoint}  point1  Point 1
 * @param  {IPoint}  point2  Point 2
 * @return {number}          Angle in degrees
 */
function getAngle(point1, point2) {
    if (!point2) {
        point2 = { x: point1.x * 2, y: point1.y * 2 };
    }
    var diffX = point2.x - point1.x;
    var diffY = point2.y - point1.y;
    var angle = Math.atan2(diffY, diffX) * DEGREES;
    if (angle < 0) {
        angle += 360;
    }
    return normalizeAngle(angle);
}
/**
 * Returns the shift in coordinates of the center when item is rotated, moved
 * and scaled at the same time.
 *
 * @param  {IPoint}  center       Current center
 * @param  {IPoint}  point1       Frst reference point
 * @param  {IPoint}  startPoint1  Original position of the first reference point
 * @param  {IPoint}  point2       Second reference point
 * @param  {IPoint}  startPoint2  Original position of the first reference point
 * @return {IPoint}               Shift in center point coordinates
 */
function getCenterShift(center, point1, startPoint1, point2, startPoint2) {
    // Get angle
    var angle = getRotation(point1, startPoint1, point2, startPoint2) - 90;
    if (angle < 0) {
        angle += 360;
    }
    // Get distance between new position
    var distance = getDistance(point1, point2);
    // Calculate new X
    var x = Math.cos(angle) / distance + point1.x;
    var y = Math.cos(angle) / distance + point1.y;
    var shift = {
        "x": x - center.x,
        "y": y - center.y
    };
    return shift;
}
/**
 * Converts an array of points into a bounding box rectangle.
 *
 * Array can contain any number of points.
 *
 * @param  {IPoint[]}              points  Points
 * @return {Optional<IRectangle>}          Bounding box rectangle
 */
function getBBox(points) {
    if (points) {
        var length_1 = points.length;
        if (length_1 !== 0) {
            var left = void 0;
            var right = void 0;
            var top_1;
            var bottom = void 0;
            for (var i = 0; i < length_1; i++) {
                var point = points[i];
                if (!__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](right) || (point.x > right)) {
                    right = point.x;
                }
                if (!__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](left) || (point.x < left)) {
                    left = point.x;
                }
                if (!__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](top_1) || (point.y < top_1)) {
                    top_1 = point.y;
                }
                if (!__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](bottom) || (point.y > bottom)) {
                    bottom = point.y;
                }
            }
            return { x: left, y: top_1, width: right - left, height: bottom - top_1 };
        }
    }
    return { x: 0, y: 0, width: 0, height: 0 };
}
/**
 * Returns a [[IRectangle]] object representing a common rectangle that fits
 * all passed in rectangles in it.
 *
 * @param {IRectangle[]}           rectangles  An array of rectangles
 * @return {Optional<IRectangle>}              Common rectangle
 */
function getCommonRectangle(rectangles) {
    var length = rectangles.length;
    if (length !== 0) {
        var minX = void 0;
        var minY = void 0;
        var maxX = void 0;
        var maxY = void 0;
        for (var i = 0; i < length; i++) {
            var rectangle = rectangles[i];
            minX = min(rectangle.x, minX);
            minY = min(rectangle.y, minY);
            maxX = max(rectangle.x + rectangle.width, maxX);
            maxY = max(rectangle.y + rectangle.height, maxY);
        }
        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }
}
/**
 * [getPointOnQuadraticCurve description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {IPoint}  pointA        [description]
 * @param  {IPoint}  pointB        [description]
 * @param  {IPoint}  controlPoint  [description]
 * @param  {number}  position      [description]
 * @return {IPoint}                [description]
 */
function getPointOnQuadraticCurve(pointA, pointB, controlPoint, position) {
    var x = (1 - position) * (1 - position) * pointA.x + 2 * (1 - position) * position * controlPoint.x + position * position * pointB.x;
    var y = (1 - position) * (1 - position) * pointA.y + 2 * (1 - position) * position * controlPoint.y + position * position * pointB.y;
    return { x: x, y: y };
}
/**
 * [getPointOnCubicCurve description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {IPoint}  pointA         [description]
 * @param  {IPoint}  pointB         [description]
 * @param  {IPoint}  controlPointA  [description]
 * @param  {IPoint}  controlPointB  [description]
 * @param  {number}  position       [description]
 * @return {IPoint}                 [description]
 */
function getPointOnCubicCurve(pointA, pointB, controlPointA, controlPointB, position) {
    var point = { x: 0, y: 0 };
    var mt1 = 1 - position;
    var mt2 = mt1 * mt1;
    var mt3 = mt2 * mt1;
    point.x = pointA.x * mt3 + controlPointA.x * 3 * mt2 * position + controlPointB.x * 3 * mt1 * position * position + pointB.x * position * position * position;
    point.y = pointA.y * mt3 + controlPointA.y * 3 * mt2 * position + controlPointB.y * 3 * mt1 * position * position + pointB.y * position * position * position;
    return point;
}
/**
 * [getCubicControlPointA description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {IPoint}  p0        [description]
 * @param  {IPoint}  p1        [description]
 * @param  {IPoint}  p2        [description]
 * @param  {IPoint}  p3        [description]
 * @param  {number}  tensionX  [description]
 * @param  {number}  tensionY  [description]
 * @return {IPoint}            [description]
 */
function getCubicControlPointA(p0, p1, p2, p3, tensionX, tensionY) {
    tensionX = adjustTension(tensionX);
    tensionY = adjustTension(tensionY);
    return { x: ((-p0.x + p1.x / tensionX + p2.x) * tensionX), y: ((-p0.y + p1.y / tensionY + p2.y) * tensionY) };
}
/**
 * [getCubicControlPointB description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {IPoint}  p0        [description]
 * @param  {IPoint}  p1        [description]
 * @param  {IPoint}  p2        [description]
 * @param  {IPoint}  p3        [description]
 * @param  {number}  tensionX  [description]
 * @param  {number}  tensionY  [description]
 * @return {IPoint}            [description]
 */
function getCubicControlPointB(p0, p1, p2, p3, tensionX, tensionY) {
    tensionX = adjustTension(tensionX);
    tensionY = adjustTension(tensionY);
    return { x: ((p1.x + p2.x / tensionX - p3.x) * tensionX), y: ((p1.y + p2.y / tensionY - p3.y) * tensionY) };
}
/**
 * [adjustTension description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {number}  tension  [description]
 * @return {number}           [description]
 */
function adjustTension(tension) {
    return 1 - tension + 0.00001;
}
/**
 * [normalizeAngle description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {number}  value  [description]
 * @return {number}         [description]
 */
function normalizeAngle(value) {
    if (value == 360) {
        return 360;
    }
    return value % 360;
}
/**
 * [normalizeAngleToRange description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @todo review this with various angles, can be tested on radar chart with custom start/end angles
 * @param {number}   value       [description]
 * @param {number}   startAngle  [description]
 * @param {number}   endAngle    [description]
 * @return {number}              [description]
 */
function fitAngleToRange(value, startAngle, endAngle) {
    if (startAngle > endAngle) {
        var temp = startAngle;
        startAngle = endAngle;
        endAngle = temp;
    }
    value = normalizeAngle(value);
    var count = (startAngle - normalizeAngle(startAngle)) / 360;
    if (value < startAngle) {
        value += 360 * (count + 1);
    }
    var maxEnd = startAngle + (endAngle - startAngle) / 2 + 180;
    var maxStart = startAngle + (endAngle - startAngle) / 2 - 180;
    if (value > endAngle) {
        if (value - 360 > startAngle) {
            value -= 360;
        }
        else {
            if (value < maxEnd) {
                value = endAngle;
            }
            else {
                value = startAngle;
            }
        }
    }
    if (value < startAngle) {
        if (value > maxStart) {
            value = startAngle;
        }
        else {
            value = endAngle;
        }
    }
    return value;
}
/**
 * Returns [[IRectangle]] of an arc in relative values, assuming that the
 * center is at the circle center.
 *
 * Used to find out max radius of an arc.
 *
 * @ignore Exclude from docs
 * @param  {number}      startAngle  Start angle
 * @param  {number}      endAngle    End angle
 * @param  {number}      radius    	 Relative radius
 * @return {IRectangle}              Rectangle
 */
function getArcRect(startAngle, endAngle, radius) {
    // do not normalize here!
    //startAngle = normalizeAngle(startAngle);
    //endAngle = normalizeAngle(endAngle);
    if (!__WEBPACK_IMPORTED_MODULE_0__Type__["isNumber"](radius)) {
        radius = 1;
    }
    if (startAngle == endAngle) {
        endAngle += 360;
    }
    if (startAngle > endAngle) {
        var temp = endAngle;
        endAngle = startAngle;
        startAngle = temp;
    }
    var minX;
    var maxX;
    var minY;
    var maxY;
    for (var angle = startAngle; angle < endAngle; angle += 0.1) {
        minX = min(cos(angle) * radius, minX);
        maxX = max(cos(angle) * radius, maxX);
        minY = min(sin(angle) * radius, minY);
        maxY = max(sin(angle) * radius, maxY);
    }
    return { x: minX, y: minY, width: (maxX - minX), height: (maxY - minY) };
}
/**
 * Returns true if a point is within rectangle
 *
 * @param  {IPoint}      point
 * @param  {IRectangle}  rectangle
 * @return {boolean}
 */
function isInRectangle(point, rectangle) {
    if (point.x >= rectangle.x && point.x <= rectangle.x + rectangle.width && point.y > rectangle.y && point.y < rectangle.y + rectangle.height) {
        return true;
    }
    return false;
}
function getLineIntersection(pointA1, pointA2, pointB1, pointB2) {
    var x = ((pointA1.x * pointA2.y - pointA2.x * pointA1.y) * (pointB1.x - pointB2.x) - (pointA1.x - pointA2.x) * (pointB1.x * pointB2.y - pointB1.y * pointB2.x)) / ((pointA1.x - pointA2.x) * (pointB1.y - pointB2.y) - (pointA1.y - pointA2.y) * (pointB1.x - pointB2.x));
    var y = ((pointA1.x * pointA2.y - pointA2.x * pointA1.y) * (pointB1.y - pointB2.y) - (pointA1.y - pointA2.y) * (pointB1.x * pointB2.y - pointB1.y * pointB2.x)) / ((pointA1.x - pointA2.x) * (pointB1.y - pointB2.y) - (pointA1.y - pointA2.y) * (pointB1.x - pointB2.x));
    return { x: x, y: y };
}
//# sourceMappingURL=Math.js.map

/***/ }),

/***/ 26:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return PX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return STRING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return NUMBER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DURATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return PLACEHOLDER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return PLACEHOLDER2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return PLACEHOLDER3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return PLACEHOLDER4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return PLACEHOLDER5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return PLACEHOLDER_L; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return PLACEHOLDER_R; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return PLACEHOLDER_Q; });
/**
 * A collection of String-based constants.
 * @hidden
 * @ignore Exclude from docs
 */
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var PX = "px";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var STRING = "string";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var NUMBER = "number";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var DATE = "date";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var DURATION = "duration";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var PLACEHOLDER = "__§§§__";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var PLACEHOLDER2 = "__§§§§__";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var PLACEHOLDER3 = "__§§§§§__";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var PLACEHOLDER4 = "__§§§§§§__";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var PLACEHOLDER5 = "__§§§§§§§__";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var PLACEHOLDER_L = "__amcharts_a6uo6cfd8f__";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var PLACEHOLDER_R = "__amcharts_jhovxywbes__";
/**
 * @ignore Exclude from docs
 * @type {string}
 */
var PLACEHOLDER_Q = "__amcharts_pf4bcqdo3t__";
//# sourceMappingURL=Strings.js.map

/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return raf; });
/* harmony export (immutable) */ __webpack_exports__["a"] = nextFrame;
/* harmony export (immutable) */ __webpack_exports__["c"] = readFrame;
/* harmony export (immutable) */ __webpack_exports__["f"] = writeFrame;
/* harmony export (immutable) */ __webpack_exports__["e"] = whenIdle;
/* harmony export (immutable) */ __webpack_exports__["d"] = triggerIdle;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Array__ = __webpack_require__(3);
/**
 * A collection of low-level async operation stuff.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */

var pendingFrame = false;
var nextQueue = [];
var readQueue = [];
var writeQueue = [];
var idleQueue = [];
var fps = 1000 / 60;
/**
 * [raf description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {[type]}
 */
var raf = (typeof requestAnimationFrame === "function"
    ? function (fn) {
        requestAnimationFrame(fn);
    }
    : function (fn) {
        setTimeout(fn, fps);
    });
/**
 * [frameLoop description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
function frameLoop() {
    var now = Date.now();
    var length = nextQueue.length;
    for (var i = 0; i < length; ++i) {
        nextQueue[i](now);
    }
    __WEBPACK_IMPORTED_MODULE_0__Array__["m" /* shiftLeft */](nextQueue, length);
    for (var i = 0; i < readQueue.length; ++i) {
        readQueue[i](now);
    }
    readQueue.length = 0;
    for (var i = 0; i < writeQueue.length; ++i) {
        writeQueue[i](now);
    }
    writeQueue.length = 0;
    if (nextQueue.length === 0 && readQueue.length === 0) {
        pendingFrame = false;
    }
    else {
        raf(frameLoop);
    }
}
/**
 * [pendFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
function pendFrame() {
    if (!pendingFrame) {
        pendingFrame = true;
        raf(frameLoop);
    }
}
/**
 * [nextFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param {Listener} fn [description]
 */
function nextFrame(fn) {
    nextQueue.push(fn);
    pendFrame();
}
/**
 * [readFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param {Listener} fn [description]
 */
function readFrame(fn) {
    readQueue.push(fn);
    pendFrame();
}
/**
 * [writeFrame description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param {Listener} fn [description]
 */
function writeFrame(fn) {
    writeQueue.push(fn);
    pendFrame();
}
/**
 * [whenIdle description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param {Listener} fn [description]
 */
function whenIdle(fn) {
    idleQueue.push(fn);
}
/**
 * [triggerIdle description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @todo Maybe don't trigger a callback which was added while in the middle of triggering?
 */
function triggerIdle() {
    var now = Date.now();
    var length = idleQueue.length;
    for (var i = 0; i < length; ++i) {
        idleQueue.shift()(now);
    }
}
//# sourceMappingURL=AsyncPending.js.map

/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["g"] = indexOf;
/* harmony export (immutable) */ __webpack_exports__["i"] = map;
/* harmony export (immutable) */ __webpack_exports__["b"] = each;
/* harmony export (immutable) */ __webpack_exports__["c"] = eachContinue;
/* harmony export (immutable) */ __webpack_exports__["m"] = shiftLeft;
/* unused harmony export last */
/* unused harmony export first */
/* unused harmony export insert */
/* unused harmony export setIndex */
/* harmony export (immutable) */ __webpack_exports__["k"] = remove;
/* harmony export (immutable) */ __webpack_exports__["j"] = move;
/* unused harmony export add */
/* unused harmony export replace */
/* harmony export (immutable) */ __webpack_exports__["n"] = toArray;
/* unused harmony export has */
/* harmony export (immutable) */ __webpack_exports__["a"] = copy;
/* unused harmony export slice */
/* harmony export (immutable) */ __webpack_exports__["h"] = insertIndex;
/* harmony export (immutable) */ __webpack_exports__["l"] = removeIndex;
/* harmony export (immutable) */ __webpack_exports__["f"] = getSortedIndex;
/* harmony export (immutable) */ __webpack_exports__["e"] = findIndex;
/* harmony export (immutable) */ __webpack_exports__["d"] = find;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Math__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Type__ = __webpack_require__(0);


/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Searches `array` for `value`.
 *
 * Returns -1 if not found.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {A}             value  Value to search
 * @returns {number}               Index
 */
function indexOf(array, value) {
    var length = array.length;
    for (var i = 0; i < length; ++i) {
        // TODO handle NaN
        if (array[i] === value) {
            return i;
        }
    }
    return -1;
}
/**
 * Calls `fn` function for every member of array and returns a new array out
 * of all outputs.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {function}      fn     Callback function
 * @returns {number}               New array
 */
function map(array, fn) {
    var length = array.length;
    var output = new Array(length);
    for (var i = 0; i < length; ++i) {
        output[i] = fn(array[i], i);
    }
    return output;
}
/**
 * Iterates thorugh all items in array and calls `fn` function for each of
 * them.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {function}      fn     Callback function
 */
function each(array, fn) {
    var length = array.length;
    for (var i = 0; i < length; ++i) {
        fn(array[i], i);
    }
}
/**
 * Iterates thorugh all items in array and calls `fn` function for each of
 * them.
 *
 * If `fn` call evaluates to `false`, further iteration is cancelled.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {function}      fn     Callback function
 */
function eachContinue(array, fn) {
    var length = array.length;
    for (var i = 0; i < length; ++i) {
        if (!fn(array[i], i)) {
            break;
        }
    }
}
/**
 * Shifts an item at `index` towards beginning of the array.
 *
 * @param {ArrayLike<A>}  array  Source array
 * @param {number}        index  Target element index
 */
function shiftLeft(array, index) {
    var length = array.length;
    for (var i = index; i < length; ++i) {
        array[i - index] = array[i];
    }
    array.length = length - index;
}
/**
 * Returns the last item of the array.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @returns {A}                    Last item
 */
function last(array) {
    var length = array.length;
    return length ? array[length - 1] : undefined;
}
/**
 * Returns the first item of the array.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @returns {A}                    Last item
 */
function first(array) {
    return array[0];
}
/**
 * Inserts `element` into `array` at `index`.
 *
 * Caps `index` to be between `0` and `array.length`
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item to insert
 * @param {ArrayLike<A>}  array    Index to insert item at
 */
function insert(array, element, index) {
    //if (array) {
    index = __WEBPACK_IMPORTED_MODULE_0__Math__["fitToRange"](index, 0, array.length);
    array.splice(index, 0, element);
    //}
}
/**
 * Removes all copies of `element` from `array` (if they exist) and then
 * inserts `element` at `index`.
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item
 * @param {ArrayLike<A>}  array    Index to move item to
 */
function setIndex(array, element, index) {
    remove(array, element);
    insert(array, element, index);
}
/**
 * Removes `element` from `array`.
 *
 * If there are multiple copies of `element`, they are all removed.
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item to remove
 */
function remove(array, element) {
    var found = false;
    if (array) {
        var index = void 0;
        while ((index = array.indexOf(element)) !== -1) {
            array.splice(index, 1);
            found = true;
        }
    }
    return found;
}
/**
 * Adds an `element` to `array`.
 *
 * If array already contains and item like this, it is removed before adding
 * it again.
 *
 * Optionally `toIndex` can be specified to add element at specific index.
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item to add
 * @param {ArrayLike<A>}  array    Index to move item to
 */
function move(array, element, toIndex) {
    // @todo this implementation must be the same as the List.moveValue method
    // @todo don't do anything if the desired index is the same as the current index
    var index = array.indexOf(element);
    // @todo remove all old values rather than only the first ?
    if (index !== -1) {
        removeIndex(array, index);
    }
    if (toIndex == null) {
        array.push(element);
    }
    else {
        insertIndex(array, toIndex, element);
    }
}
/**
 * Inserts `element` into `array` at `index`.
 *
 * If `index` is not provided, it will insert `element` at the end of `array`.
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item to add
 * @param {ArrayLike<A>}  array    Index to add item at
 */
function add(array, element, index) {
    // Append to the end if index is not set
    if (!__WEBPACK_IMPORTED_MODULE_1__Type__["isNumber"](index)) {
        array.push(element);
    }
    // Add to the beginning of array if index is 0
    else if (index === 0) {
        array.unshift(element);
    }
    // Add to indicated place if index is set
    else {
        array.splice(index, 0, element);
    }
}
/**
 * Removes `element` from `array` (if it exists) and then inserts `element` at
 * `index`.
 *
 * If `index` is not provided, it will insert `element` at the end of `array`.
 *
 * @param {ArrayLike<A>}  array    Source array
 * @param {ArrayLike<A>}  element  Item to remove
 * @param {ArrayLike<A>}  array    Index to move item to
 */
function replace(array, element, index) {
    // check if exists
    var ind = array.indexOf(element);
    // remove if exists
    if (ind !== -1) {
        array.splice(ind, 1);
    }
    // add to end if index is not set
    if (!__WEBPACK_IMPORTED_MODULE_1__Type__["isNumber"](index)) {
        array.push(element);
    }
    // add to indicated place if index is set
    else {
        array.splice(index, 0, element);
    }
}
/**
 * Wraps `input` in an array, if it isn't already an array.
 *
 * @param {Array<A> | A}  input  Source value
 * @return {Array<A>} An array
 */
function toArray(input) {
    if (Array.isArray(input)) {
        return input;
    }
    else {
        return [input];
    }
}
/**
 * Returns `true` if `element` exists in `array`.
 *
 * @param   {ArrayLike<A>}  array    Source array
 * @param   {ArrayLike<A>}  element  Item to search for
 * @returns {boolean}                Item in array?
 */
function has(array, element) {
    return indexOf(array, element) !== -1;
}
/**
 * Returns a shallow copy of `array`.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @returns {boolean}              Copy of the array
 */
function copy(array) {
    var length = array.length;
    // It's faster to create the array with a pre-defined length
    var output = new Array(length);
    for (var i = 0; i < length; ++i) {
        // Because the array has a pre-defined length, we have to assign rather than push
        // This is also faster than pushing
        output[i] = array[i];
    }
    return output;
}
/**
 * Returns a copy of `array` which contains all the elements between `start`
 * and `end`. (including `start` and excluding `end`)
 *
 * If `end` is not provided, it defaults to `array.length`.
 *
 * @param   {ArrayLike<A>}  array  Source array
 * @param   {number}        start  Start index
 * @param   {number}        end    End index
 * @returns {Array<A>}             Part of the array
 */
function slice(array, start, end) {
    if (end === void 0) { end = array.length; }
    var output = new Array(end - start);
    for (var i = start; i < end; ++i) {
        output[i - start] = array[i];
    }
    return output;
}
/**
 * Inserts a value into array at specific index.
 *
 * @param {Array<A>}  array  Source array
 * @param {number}    index  Index
 * @param {A}         value  Value to insert
 */
function insertIndex(array, index, value) {
    array.splice(index, 0, value);
}
/**
 * Removes a value from array at specific index.
 *
 * @param {Array<A>}  array  Source array
 * @param {number}    index  Index
 */
function removeIndex(array, index) {
    array.splice(index, 1);
}
/**
 * Orders an array using specific `ordering` function and returns index of
 * the `value`.
 *
 * @ignore Exclude from docs
 * @param   {ArrayLike<A>}  array     Source array
 * @param   {function}      ordering  An ordering function
 * @param   {ArrayLike<A>}  value     Value to search for
 * @returns {SortResult}              Result of the search
 */
function getSortedIndex(array, ordering, value) {
    var start = 0;
    var end = array.length;
    var found = false;
    while (start < end) {
        // TODO is this faster/slower than using Math.floor ?
        var pivot = (start + end) >> 1;
        var order = ordering(value, array[pivot]);
        // less
        if (order < 0) {
            end = pivot;
            // equal
        }
        else if (order === 0) {
            found = true;
            start = pivot + 1;
            // more
        }
        else {
            start = pivot + 1;
        }
    }
    return {
        found: found,
        index: (found ? start - 1 : start)
    };
}
/**
 * Searches the array using custom function and returns index of the item if
 * found.
 *
 * Will call `matches` function on all items of the array. If return value
 * evaluates to `true`, index is returned.
 *
 * Otherwise returns -1.
 *
 * @param   {ArrayLike<A>}  array    Source array
 * @param   {function}      matches  Search function
 * @returns {number}                 Index of the item if found
 */
function findIndex(array, matches) {
    var length = array.length;
    for (var i = 0; i < length; ++i) {
        if (matches(array[i], i)) {
            return i;
        }
    }
    return -1;
}
/**
 * Searches the array using custom function and returns item if found.
 *
 * Will call `matches` function on all items of the array. If return value
 * evaluates to `true`, index is returned.
 *
 * Otherwise returns `undefined`.
 *
 * @param   {ArrayLike<A>}  array    Source array
 * @param   {function}      matches  Search function
 * @returns {number}                 Item if found
 */
function find(array, matches) {
    var index = findIndex(array, matches);
    if (index !== -1) {
        return array[index];
    }
}
//# sourceMappingURL=Array.js.map

/***/ }),

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["rgb"] = rgb;
/* harmony export (immutable) */ __webpack_exports__["hexToRgb"] = hexToRgb;
/* harmony export (immutable) */ __webpack_exports__["rgbaToRgb"] = rgbaToRgb;
/* harmony export (immutable) */ __webpack_exports__["rgbToHex"] = rgbToHex;
/* harmony export (immutable) */ __webpack_exports__["rgbToRGBA"] = rgbToRGBA;
/* harmony export (immutable) */ __webpack_exports__["pad2"] = pad2;
/* harmony export (immutable) */ __webpack_exports__["interpolate"] = interpolate;
/* harmony export (immutable) */ __webpack_exports__["lighten"] = lighten;
/* harmony export (immutable) */ __webpack_exports__["getLightnessStep"] = getLightnessStep;
/* harmony export (immutable) */ __webpack_exports__["brighten"] = brighten;
/* harmony export (immutable) */ __webpack_exports__["getBrightnessStep"] = getBrightnessStep;
/* harmony export (immutable) */ __webpack_exports__["saturate"] = saturate;
/* harmony export (immutable) */ __webpack_exports__["hslToRgb"] = hslToRgb;
/* harmony export (immutable) */ __webpack_exports__["rgbToHsl"] = rgbToHsl;
/* harmony export (immutable) */ __webpack_exports__["rgbToHsv"] = rgbToHsv;
/* harmony export (immutable) */ __webpack_exports__["hsvToRgb"] = hsvToRgb;
/* harmony export (immutable) */ __webpack_exports__["isLight"] = isLight;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Math__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Type__ = __webpack_require__(0);
/**
 * A collection of color-related functions
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */


/**
 * Define named colors for easy resolution to RGB.
 *
 * @type {Object}
 */
var namedColors = {
    aliceblue: { r: 240, g: 248, b: 255 },
    antiquewhite: { r: 250, g: 235, b: 215 },
    aqua: { r: 0, g: 255, b: 255 },
    aquamarine: { r: 127, g: 255, b: 212 },
    azure: { r: 240, g: 255, b: 255 },
    beige: { r: 245, g: 245, b: 220 },
    bisque: { r: 255, g: 228, b: 196 },
    black: { r: 0, g: 0, b: 0 },
    blanchedalmond: { r: 255, g: 235, b: 205 },
    blue: { r: 0, g: 0, b: 255 },
    blueviolet: { r: 138, g: 43, b: 226 },
    brown: { r: 165, g: 42, b: 42 },
    burlywood: { r: 222, g: 184, b: 135 },
    cadetblue: { r: 95, g: 158, b: 160 },
    chartreuse: { r: 127, g: 255, b: 0 },
    chocolate: { r: 210, g: 105, b: 30 },
    coral: { r: 255, g: 127, b: 80 },
    cornflowerblue: { r: 100, g: 149, b: 237 },
    cornsilk: { r: 255, g: 248, b: 220 },
    crimson: { r: 220, g: 20, b: 60 },
    cyan: { r: 0, g: 255, b: 255 },
    darkblue: { r: 0, g: 0, b: 139 },
    darkcyan: { r: 0, g: 139, b: 139 },
    darkgoldenrod: { r: 184, g: 134, b: 11 },
    darkgray: { r: 169, g: 169, b: 169 },
    darkgrey: { r: 169, g: 169, b: 169 },
    darkgreen: { r: 0, g: 100, b: 0 },
    darkkhaki: { r: 189, g: 183, b: 107 },
    darkmagenta: { r: 139, g: 0, b: 139 },
    darkolivegreen: { r: 85, g: 107, b: 47 },
    darkorange: { r: 255, g: 140, b: 0 },
    darkorchid: { r: 153, g: 50, b: 204 },
    darkred: { r: 139, g: 0, b: 0 },
    darksalmon: { r: 233, g: 150, b: 122 },
    darkseagreen: { r: 143, g: 188, b: 143 },
    darkslateblue: { r: 72, g: 61, b: 139 },
    darkslategray: { r: 47, g: 79, b: 79 },
    darkslategrey: { r: 47, g: 79, b: 79 },
    darkturquoise: { r: 0, g: 206, b: 209 },
    darkviolet: { r: 148, g: 0, b: 211 },
    deeppink: { r: 255, g: 20, b: 147 },
    deepskyblue: { r: 0, g: 191, b: 255 },
    dimgray: { r: 105, g: 105, b: 105 },
    dimgrey: { r: 105, g: 105, b: 105 },
    dodgerblue: { r: 30, g: 144, b: 255 },
    firebrick: { r: 178, g: 34, b: 34 },
    floralwhite: { r: 255, g: 250, b: 240 },
    forestgreen: { r: 34, g: 139, b: 34 },
    fuchsia: { r: 255, g: 0, b: 255 },
    gainsboro: { r: 220, g: 220, b: 220 },
    ghostwhite: { r: 248, g: 248, b: 255 },
    gold: { r: 255, g: 215, b: 0 },
    goldenrod: { r: 218, g: 165, b: 32 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
    green: { r: 0, g: 128, b: 0 },
    greenyellow: { r: 173, g: 255, b: 47 },
    honeydew: { r: 240, g: 255, b: 240 },
    hotpink: { r: 255, g: 105, b: 180 },
    indianred: { r: 205, g: 92, b: 92 },
    indigo: { r: 75, g: 0, b: 130 },
    ivory: { r: 255, g: 255, b: 240 },
    khaki: { r: 240, g: 230, b: 140 },
    lavender: { r: 230, g: 230, b: 250 },
    lavenderblush: { r: 255, g: 240, b: 245 },
    lawngreen: { r: 124, g: 252, b: 0 },
    lemonchiffon: { r: 255, g: 250, b: 205 },
    lightblue: { r: 173, g: 216, b: 230 },
    lightcoral: { r: 240, g: 128, b: 128 },
    lightcyan: { r: 224, g: 255, b: 255 },
    lightgoldenrodyellow: { r: 250, g: 250, b: 210 },
    lightgray: { r: 211, g: 211, b: 211 },
    lightgrey: { r: 211, g: 211, b: 211 },
    lightgreen: { r: 144, g: 238, b: 144 },
    lightpink: { r: 255, g: 182, b: 193 },
    lightsalmon: { r: 255, g: 160, b: 122 },
    lightseagreen: { r: 32, g: 178, b: 170 },
    lightskyblue: { r: 135, g: 206, b: 250 },
    lightslategray: { r: 119, g: 136, b: 153 },
    lightslategrey: { r: 119, g: 136, b: 153 },
    lightsteelblue: { r: 176, g: 196, b: 222 },
    lightyellow: { r: 255, g: 255, b: 224 },
    lime: { r: 0, g: 255, b: 0 },
    limegreen: { r: 50, g: 205, b: 50 },
    linen: { r: 250, g: 240, b: 230 },
    magenta: { r: 255, g: 0, b: 255 },
    maroon: { r: 128, g: 0, b: 0 },
    mediumaquamarine: { r: 102, g: 205, b: 170 },
    mediumblue: { r: 0, g: 0, b: 205 },
    mediumorchid: { r: 186, g: 85, b: 211 },
    mediumpurple: { r: 147, g: 112, b: 219 },
    mediumseagreen: { r: 60, g: 179, b: 113 },
    mediumslateblue: { r: 123, g: 104, b: 238 },
    mediumspringgreen: { r: 0, g: 250, b: 154 },
    mediumturquoise: { r: 72, g: 209, b: 204 },
    mediumvioletred: { r: 199, g: 21, b: 133 },
    midnightblue: { r: 25, g: 25, b: 112 },
    mintcream: { r: 245, g: 255, b: 250 },
    mistyrose: { r: 255, g: 228, b: 225 },
    moccasin: { r: 255, g: 228, b: 181 },
    navajowhite: { r: 255, g: 222, b: 173 },
    navy: { r: 0, g: 0, b: 128 },
    oldlace: { r: 253, g: 245, b: 230 },
    olive: { r: 128, g: 128, b: 0 },
    olivedrab: { r: 107, g: 142, b: 35 },
    orange: { r: 255, g: 165, b: 0 },
    orangered: { r: 255, g: 69, b: 0 },
    orchid: { r: 218, g: 112, b: 214 },
    palegoldenrod: { r: 238, g: 232, b: 170 },
    palegreen: { r: 152, g: 251, b: 152 },
    paleturquoise: { r: 175, g: 238, b: 238 },
    palevioletred: { r: 219, g: 112, b: 147 },
    papayawhip: { r: 255, g: 239, b: 213 },
    peachpuff: { r: 255, g: 218, b: 185 },
    peru: { r: 205, g: 133, b: 63 },
    pink: { r: 255, g: 192, b: 203 },
    plum: { r: 221, g: 160, b: 221 },
    powderblue: { r: 176, g: 224, b: 230 },
    purple: { r: 128, g: 0, b: 128 },
    rebeccapurple: { r: 102, g: 51, b: 153 },
    red: { r: 255, g: 0, b: 0 },
    rosybrown: { r: 188, g: 143, b: 143 },
    royalblue: { r: 65, g: 105, b: 225 },
    saddlebrown: { r: 139, g: 69, b: 19 },
    salmon: { r: 250, g: 128, b: 114 },
    sandybrown: { r: 244, g: 164, b: 96 },
    seagreen: { r: 46, g: 139, b: 87 },
    seashell: { r: 255, g: 245, b: 238 },
    sienna: { r: 160, g: 82, b: 45 },
    silver: { r: 192, g: 192, b: 192 },
    skyblue: { r: 135, g: 206, b: 235 },
    slateblue: { r: 106, g: 90, b: 205 },
    slategray: { r: 112, g: 128, b: 144 },
    slategrey: { r: 112, g: 128, b: 144 },
    snow: { r: 255, g: 250, b: 250 },
    springgreen: { r: 0, g: 255, b: 127 },
    steelblue: { r: 70, g: 130, b: 180 },
    tan: { r: 210, g: 180, b: 140 },
    teal: { r: 0, g: 128, b: 128 },
    thistle: { r: 216, g: 191, b: 216 },
    tomato: { r: 255, g: 99, b: 71 },
    turquoise: { r: 64, g: 224, b: 208 },
    violet: { r: 238, g: 130, b: 238 },
    wheat: { r: 245, g: 222, b: 179 },
    white: { r: 255, g: 255, b: 255 },
    whitesmoke: { r: 245, g: 245, b: 245 },
    yellow: { r: 255, g: 255, b: 0 },
    yellowgreen: { r: 154, g: 205, b: 50 }
};
/**
 * Tries to resolve a named color into a hex color representation.
 *
 * @ignore Exclude from docs
 * @param  {string}  value  Color name
 * @return {string}         Color
 * @deprecated
 */
/*export function resolveNamedColor(value: string): Color {
    return (<any>namedColors)[value] ? (<any>namedColors)[value] : undefined;
}*/
/**
 * Converts a proper color hex code (i.e. "#FF5500") or named color (i.e. "red")
 * into an {iRGB} object. If the code is not correctly formatted, an RGB of
 * black is returned.
 *
 * @ignore Exclude from docs
 * @param  {string}  color  Color code
 * @param  {number}  alpha  Alpha (0-1)
 * @return {iRGB}           RGB
 */
function rgb(color, alpha) {
    // Init return value
    var rgb;
    // Try resolving color format
    // Named color?
    if (namedColors[color]) {
        rgb = namedColors[color];
    }
    // Hex code?
    else if (color.charAt(0) === "#") {
        rgb = hexToRgb(color);
    }
    // rgb() format?
    else if (color.match(/^rgba?\(/)) {
        rgb = rgbaToRgb(color);
    }
    // Was not able to resolve?
    if (!rgb) {
        rgb = { r: 0, g: 0, b: 0, a: 1 };
    }
    // Set alpha
    if (__WEBPACK_IMPORTED_MODULE_1__Type__["hasValue"](alpha)) {
        rgb.a = alpha;
    }
    return rgb;
}
/**
 * Converts a hex color code (i.e. "#FF5500") to an [[iRGB]] object.
 *
 * @ignore Exclude from docs
 * @param  {string}  hex  Hex color code
 * @return {iRGB}         RGB
 */
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : undefined;
}
/**
 * Converts color strings in format like `rgb()` and `rgba()` to [[iRGB]].
 *
 * @ignore Exclude from docs
 * @param  {string}  color  Color code
 * @return {iRGB}           RGB
 */
function rgbaToRgb(color) {
    // Init
    var matches;
    color = color.replace(/[ ]/g, "");
    // Try rgb() format
    if (matches = color.match(/^rgb\(([0-9]*),([0-9]*),([0-9]*)\)/i)) {
        matches.push("1");
    }
    else if (matches = color.match(/^rgba\(([0-9]*),([0-9]*),([0-9]*),([.0-9]*)\)/i)) {
        // nothing
    }
    else {
        return undefined;
    }
    return {
        r: parseInt(matches[1]),
        g: parseInt(matches[2]),
        b: parseInt(matches[3]),
        a: parseFloat(matches[4])
    };
}
/**
 * Converts an [[iRGB]] object into a hex color code.
 *
 * @ignore Exclude from docs
 * @param  {iRGB}    rgb  RGB
 * @return {string}       Hex color code
 */
function rgbToHex(rgb) {
    return "#" + pad2(rgb.r.toString(16)) + pad2(rgb.g.toString(16)) + pad2(rgb.b.toString(16));
}
/**
 * Converts an [[iRGB]] object into its `rgb()` or `rgba()` representation.
 *
 * @ignore Exclude from docs
 * @param  {iRGB}    rgb  RGB
 * @return {string}       `rgba()` syntax
 */
function rgbToRGBA(rgb) {
    if (__WEBPACK_IMPORTED_MODULE_1__Type__["hasValue"](rgb.a) && rgb.a !== 1) {
        return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ")";
    }
    else {
        return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    }
}
/**
 * Pads a 1-digit string with a zero.
 *
 * @ignore Exclude from docs
 * @param  {string}  c  Input string
 * @return {string}     Padded string
 */
function pad2(c) {
    return c.length == 1 ? "0" + c : "" + c;
}
/**
 * Returns an intermediate color between two colors based on the relative
 * position. Position needs to be in range between 0 and 1. Zero meaning the
 * resulting color will be closest to the first reference color.
 *
 * @ignore Exclude from docs
 * @param  {iRGB}    color1   First reference color
 * @param  {iRGB}    color2   Second reference color
 * @param  {number}  percent  Relative position (0-1)
 * @return {iRGB}             Interpolated color
 */
function interpolate(rgb1, rgb2, percent) {
    percent = __WEBPACK_IMPORTED_MODULE_0__Math__["fitToRange"](percent, 0, 1);
    if (rgb1) {
        if (rgb2) {
            return {
                r: rgb1.r + Math.round((rgb2.r - rgb1.r) * percent),
                g: rgb1.g + Math.round((rgb2.g - rgb1.g) * percent),
                b: rgb1.b + Math.round((rgb2.b - rgb1.b) * percent),
                a: (rgb1.a || 1) + Math.round(((rgb2.a || 1) - (rgb1.a || 1)) * percent)
            };
        }
        else {
            return rgb1;
        }
    }
    else if (rgb2) {
        return rgb2;
    }
    else {
        return rgb1;
    }
}
/**
 * Returns a color that is `percent` brighter than the reference color.
 *
 * @ignore Exclude from docs
 * @param  {iRGB}    color    Reference color
 * @param  {number}  percent  Brightness percent
 * @return {iRGB}             Hex code of the new color
 */
function lighten(rgb, percent) {
    if (rgb) {
        return {
            r: Math.max(0, Math.min(255, rgb.r + getLightnessStep(rgb.r, percent))),
            g: Math.max(0, Math.min(255, rgb.g + getLightnessStep(rgb.g, percent))),
            b: Math.max(0, Math.min(255, rgb.b + getLightnessStep(rgb.b, percent))),
            a: rgb.a
        };
    }
    else {
        // TODO is this correct ?
        return rgb;
    }
}
;
/**
 * Gets lightness step.
 *
 * @ignore Exclude from docs
 * @param  {number}  value    Value
 * @param  {number}  percent  Percent
 * @return {number}           Step
 */
function getLightnessStep(value, percent) {
    var base = percent > 0 ? 255 - value : value;
    return Math.round(base * percent);
}
/**
 * Returns a color that is `percent` brighter than the source `color`.
 *
 * @ignore Exclude from docs
 * @param  {iRGB}    color    Source color
 * @param  {number}  percent  Brightness percent
 * @return {iRGB}             New color
 */
function brighten(rgb, percent) {
    if (rgb) {
        var base = Math.min(Math.max(rgb.r, rgb.g, rgb.b), 230);
        //let base = Math.max(rgb.r, rgb.g, rgb.b);
        var step = getLightnessStep(base, percent);
        return {
            r: Math.max(0, Math.min(255, Math.round(rgb.r + step))),
            g: Math.max(0, Math.min(255, Math.round(rgb.g + step))),
            b: Math.max(0, Math.min(255, Math.round(rgb.b + step))),
            a: rgb.a
        };
    }
    else {
        // TODO is this correct ?
        return rgb;
    }
}
;
/**
 * Returns brightness step.
 *
 * @ignore Exclude from docs
 * @param  {number}  value    Value
 * @param  {number}  percent  Percent
 * @return {number}           Step
 */
function getBrightnessStep(value, percent) {
    var base = 255; //percent > 0 ? 255 - value : value;
    return Math.round(base * percent);
}
/**
 * Returns a new [[iRGB]] object based on `rgb` parameter with specific
 * saturation applied.
 *
 * `saturation` can be in the range of 0 (fully desaturated) to 1 (fully
 * saturated).
 *
 * @ignore Exclude from docs
 * @param  {iRGB}    color       Base color
 * @param  {number}  saturation  Saturation (0-1)
 * @return {iRGB}                New color
 */
function saturate(rgb, saturation) {
    if (saturation == 1) {
        return rgb;
    }
    var hsl = rgbToHsl(rgb);
    hsl.s = saturation;
    return hslToRgb(hsl);
}
/*
// not used
export function rgbToMatrix(rgb: iRGB): string {
    let r = $type.toText($math.round((rgb.r || 0) / 255, 10));
    let g = $type.toText($math.round((rgb.g || 0) / 255, 10));
    let b = $type.toText($math.round((rgb.b || 0) / 255, 10));
    let a = $type.toText(rgb.a || 1);
    return	      r + " 0 0 0 0" +
                    " 0 " + g + " 0 0 0" +
                    " 0 0 " + b + " 0 0" +
                    " 0 0 0 " + a + " 0";
}
*/
/**
 * The functions below are taken and adapted from Garry Tan's blog post:
 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * The further attributions go mjijackson.com, which now seems to be defunct.
 */
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * Function adapted from:
 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * @ignore Exclude from docs
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(color) {
    var r, g, b;
    var h = color.h;
    var s = color.s;
    var l = color.l;
    if (s == 0) {
        r = g = b = l; // achromatic
    }
    else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * Function adapted from:
 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * @ignore Exclude from docs
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(color) {
    var r = color.r / 255;
    var g = color.g / 255;
    var b = color.b / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    if (max === min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return {
        h: h,
        s: s,
        l: l
    };
}
/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @ignore Exclude from docs
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(color) {
    var r = color.r / 255;
    var g = color.g / 255;
    var b = color.b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var v = max;
    var d = max - min;
    s = max == 0 ? 0 : d / max;
    if (max == min) {
        h = 0; // achromatic
    }
    else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return {
        h: h,
        s: s,
        v: v
    };
}
/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @ignore Exclude from docs
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(color) {
    var r = 0;
    var g = 0;
    var b = 0;
    var h = color.h;
    var s = color.s;
    var v = color.v;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
/**
 * Returns `true` if color is "light". Useful indetermining which contrasting
 * color to use for elements over this color. E.g.: you would want to use
 * black text over light background, and vice versa.
 *
 * @ignore Exclude from docs
 * @param  {iRGB}     color  Source color
 * @return {boolean}         Light?
 */
function isLight(color) {
    return ((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000 >= 128;
}
//# sourceMappingURL=Colors.js.map

/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["fromArray"] = fromArray;
/* harmony export (immutable) */ __webpack_exports__["length"] = length;
/* harmony export (immutable) */ __webpack_exports__["toArray"] = toArray;
/* harmony export (immutable) */ __webpack_exports__["eachContinue"] = eachContinue;
/* harmony export (immutable) */ __webpack_exports__["each"] = each;
/* harmony export (immutable) */ __webpack_exports__["sort"] = sort;
/* harmony export (immutable) */ __webpack_exports__["map"] = map;
/* harmony export (immutable) */ __webpack_exports__["filter"] = filter;
/* harmony export (immutable) */ __webpack_exports__["concat"] = concat;
/* harmony export (immutable) */ __webpack_exports__["flatten"] = flatten;
/* harmony export (immutable) */ __webpack_exports__["indexed"] = indexed;
/* harmony export (immutable) */ __webpack_exports__["findIndex"] = findIndex;
/* harmony export (immutable) */ __webpack_exports__["find"] = find;
/* harmony export (immutable) */ __webpack_exports__["findMap"] = findMap;
/* harmony export (immutable) */ __webpack_exports__["contains"] = contains;
/* harmony export (immutable) */ __webpack_exports__["foldl"] = foldl;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["join"] = join;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListIterator", function() { return ListIterator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Array__ = __webpack_require__(3);

/**
 * @ignore Exclude from docs
 * @todo Description
 */
function fromArray(array) {
    return function (push) {
        var length = array.length;
        for (var i = 0; i < length; ++i) {
            if (!push(array[i])) {
                break;
            }
        }
    };
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
function length(iter) {
    var sum = 0;
    iter(function (_) {
        ++sum;
        return true;
    });
    return sum;
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
function toArray(iter) {
    var output = [];
    iter(function (value) {
        output.push(value);
        return true;
    });
    return output;
}
/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {Iterator<A>}
 */
function eachContinue(iter, fn) {
    return iter(fn);
}
/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {Iterator<A>}
 */
function each(iter, fn) {
    return iter(function (value) {
        fn(value);
        return true;
    });
}
/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {Iterator<A>}
 */
function sort(iter, fn) {
    return fromArray(toArray(iter).sort(fn));
}
/**
 * [A description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {[type]}
 */
function map(iter, fn) {
    return function (push) { return iter(function (value) { return push(fn(value)); }); };
}
/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {Iterator<A>}
 */
function filter(iter, fn) {
    return function (push) { return iter(function (value) {
        if (fn(value)) {
            return push(value);
        }
        else {
            return true;
        }
    }); };
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
function concat() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (push) {
        var go = true;
        var push2 = function (value) { return (go = push(value)); };
        var length = args.length;
        for (var i = 0; i < length; ++i) {
            args[i](push2);
            if (!go) {
                break;
            }
        }
    };
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
function flatten(iter) {
    return function (push) {
        var go = true;
        var push2 = function (value) { return (go = push(value)); };
        return iter(function (value) {
            value(push2);
            return go;
        });
    };
}
/**
 * [number description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {[type]}
 */
function indexed(iter) {
    return function (push) {
        var index = 0;
        return iter(function (value) { return push([index++, value]); });
    };
}
/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {Iterator<A>}
 */
function findIndex(iter, matches) {
    var found = false;
    var i = 0;
    iter(function (value) {
        if (matches(value)) {
            found = true;
            return false;
        }
        else {
            ++i;
            return true;
        }
    });
    return (found ? i : -1);
}
/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {Iterator<A>}
 */
function find(iter, matches) {
    var output;
    iter(function (value) {
        if (matches(value)) {
            output = value;
            return false;
        }
        else {
            return true;
        }
    });
    return output;
}
/**
 * [A description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {[type]}
 */
function findMap(iter, matches) {
    var output;
    iter(function (value) {
        var v = matches(value);
        if (v !== null) {
            output = v;
            return false;
        }
        else {
            return true;
        }
    });
    return output;
}
/**
 * [iter description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {Iterator<A>}
 */
function contains(iter, matches) {
    var output = false;
    iter(function (value) {
        if (matches(value)) {
            output = true;
            return false;
        }
        else {
            return true;
        }
    });
    return output;
}
/**
 * [A description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @type {[type]}
 */
function foldl(iter, init, fn) {
    iter(function (value) {
        init = fn(init, value);
        return true;
    });
    return init;
}
/**
 * [min2 description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {number |     null}        left [description]
 * @param  {number}    right [description]
 * @return {number}          [description]
 */
function min2(left, right) {
    if (left == null || right < left) {
        return right;
    }
    else {
        return left;
    }
}
/**
 * [min description]
 *
 * @ignore Exclude from docs
 * @todo Verify that this works correctly
 * @todo Description
 * @param  {Iterator<number>} a [description]
 * @return {number}             [description]
 */
function min(a) {
    return foldl(a, null, min2);
}
/**
 * [max2 description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {number |     null}        left [description]
 * @param  {number}    right [description]
 * @return {number}          [description]
 */
function max2(left, right) {
    if (left == null || right > left) {
        return right;
    }
    else {
        return left;
    }
}
/**
 * [max description]
 *
 * @ignore Exclude from docs
 * @todo Verify that this works correctly
 * @todo Description
 * @param  {Iterator<number>} a [description]
 * @return {number}             [description]
 */
function max(a) {
    return foldl(a, null, max2);
}
/**
 * [join description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {Iterator<string>} iter [description]
 * @param  {string        =    ""}          separator [description]
 * @return {string}                [description]
 */
function join(iter, separator) {
    if (separator === void 0) { separator = ""; }
    var first = true;
    var init = "";
    iter(function (value) {
        if (first) {
            first = false;
        }
        else {
            init += separator;
        }
        init += value;
        return true;
    });
    return init;
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
var ListIterator = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {Iterable<T>} list [description]
     * @param {()       =>   T}           create [description]
     */
    function ListIterator(list, create) {
        // flag specifies if iterator should create new list item if it is reqested for a nextItem but there is no more left in the list
        this.createNewItems = false;
        this.list = list;
        this._create = create;
        this.reset();
    }
    ListIterator.prototype.reset = function () {
        this._listCopy = toArray(this.list.iterator());
    };
    ListIterator.prototype.clear = function () {
        this._listCopy.length = 0;
    };
    ListIterator.prototype.getFirst = function () {
        return this.returnItem(0);
    };
    ListIterator.prototype.getLast = function () {
        return this.returnItem(this._listCopy.length - 1);
    };
    ListIterator.prototype.find = function (fn) {
        var index = __WEBPACK_IMPORTED_MODULE_0__Array__["e" /* findIndex */](this._listCopy, fn);
        if (index !== -1) {
            var item = this._listCopy[index];
            // TODO use removeIndex instead ?
            __WEBPACK_IMPORTED_MODULE_0__Array__["k" /* remove */](this._listCopy, item);
            return item;
        }
        else {
            return this.getLast();
        }
    };
    ListIterator.prototype.removeItem = function (item) {
        return __WEBPACK_IMPORTED_MODULE_0__Array__["k" /* remove */](this._listCopy, item);
    };
    ListIterator.prototype.returnItem = function (index) {
        if (index >= 0 && index < this._listCopy.length) {
            var item = this._listCopy[index];
            // TODO use removeIndex instead ?
            __WEBPACK_IMPORTED_MODULE_0__Array__["k" /* remove */](this._listCopy, item);
            return item;
        }
        else if (this.createNewItems) {
            return this._create();
        }
    };
    ListIterator.prototype.iterator = function () {
        return fromArray(this._listCopy);
    };
    return ListIterator;
}());

//# sourceMappingURL=Iterator.js.map

/***/ }),

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["order"] = order;
/* harmony export (immutable) */ __webpack_exports__["repeat"] = repeat;
/**
 * ============================================================================
 * COMPARING FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Comparing function used for ordering.
 *
 * @ignore Exclude from docs
 * @todo Use localeCompare
 * @param  {string}    a  Item 1
 * @param  {string}    b  Item 2
 * @return {Ordering}     Result
 */
function order(a, b) {
    if (a === b) {
        return 0;
    }
    else if (a < b) {
        return -1;
    }
    else {
        return 1;
    }
}
/**
 * ============================================================================
 * OTHER FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Repeats a `string` number of times as set in `amount`.
 *
 * @ignore Exclude from docs
 * @todo Make this faster
 * @param  {string}  string  Source string
 * @param  {number}  amount  Number of times to repeat string
 * @return {string}          New string
 */
function repeat(string, amount) {
    return new Array(amount + 1).join(string);
}
//# sourceMappingURL=String.js.map

/***/ }),

/***/ 43:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderedList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SortedList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return OrderedListTemplate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SortedListTemplate; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__EventDispatcher__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Array__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Type__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */




/**
 * Ordered list contains values of any type in an indexed array.
 */
var OrderedList = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {Array<T>}  initial  Inital list of values to add to list
     */
    function OrderedList(initial) {
        /**
         * Holds list values.
         *
         * @type {Array<T>}
         */
        this._values = [];
        /**
         * Event dispatcher.
         *
         * @type {EventDispatcher<AMEvent<OrderedList<T>, ISortedListEvents<T>>>}
         */
        this.events = new __WEBPACK_IMPORTED_MODULE_0__EventDispatcher__["a" /* EventDispatcher */]();
        if (initial != null) {
            this.setAll(initial);
        }
    }
    Object.defineProperty(OrderedList.prototype, "values", {
        /**
         * All items of the list.
         *
         * Do not modify the list directly. Rather use `insert()` and `remove()`
         * methods.
         *
         * @return {Array<T>} List values
         */
        get: function () {
            return this._values;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Inserts a value into list item array.
     *
     * @param {T}  value  Value
     */
    OrderedList.prototype._insert = function (value) {
        this._values.push(value);
    };
    Object.defineProperty(OrderedList.prototype, "length", {
        /**
         * Number of items in the list.
         *
         * @readonly
         * @return {number} Length
         */
        get: function () {
            return this._values.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the index of the specific `value`.
     *
     * -1 if not found.
     *
     * @param  {T}       value  Value
     * @return {number}        Index
     */
    OrderedList.prototype.indexOf = function (value) {
        return __WEBPACK_IMPORTED_MODULE_1__Array__["g" /* indexOf */](this._values, value);
    };
    /**
     * Checks if list contains the `value`.
     *
     * @param  {T}        value  Value
     * @return {boolean}         In the list?
     */
    OrderedList.prototype.contains = function (value) {
        return this.indexOf(value) !== -1;
    };
    /**
     * Returns an item at specific `index`.
     *
     * @param  {number}  index  Index
     * @return {T}              Item
     */
    OrderedList.prototype.getIndex = function (index) {
        return this._values[index];
    };
    Object.defineProperty(OrderedList.prototype, "first", {
        /**
         * First item in the list.
         *
         * @return {T} Item
         */
        get: function () {
            return this._values[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrderedList.prototype, "last", {
        /**
         * Last item in the list.
         *
         * @return {T} Item
         */
        get: function () {
            return this._values[this._values.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Inserts a value into list.
     *
     * @param {T}  value  Value
     */
    OrderedList.prototype.insert = function (value) {
        this._insert(value);
        if (this.events.isEnabled("insert")) {
            this.events.dispatchImmediately("insert", {
                type: "insert",
                target: this,
                newValue: value
            });
        }
    };
    /**
     * Removes an item with the `value` from the list.
     *
     * @param {T}  value  Value
     */
    OrderedList.prototype.remove = function (value) {
        var index = this.indexOf(value);
        if (index !== -1) {
            var oldValue = this._values[index];
            __WEBPACK_IMPORTED_MODULE_1__Array__["l" /* removeIndex */](this._values, index);
            if (this.events.isEnabled("remove")) {
                this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: this,
                    oldValue: oldValue
                });
            }
        }
    };
    /**
     * Sets multiple items to the list.
     *
     * All current items are removed.
     *
     * @param {Array<T>}  newArray  New items
     */
    OrderedList.prototype.setAll = function (newArray) {
        var _this = this;
        var oldArray = __WEBPACK_IMPORTED_MODULE_1__Array__["a" /* copy */](this._values);
        this._values.length = 0;
        __WEBPACK_IMPORTED_MODULE_1__Array__["b" /* each */](newArray, function (value) {
            _this._insert(value);
        });
        if (this.events.isEnabled("remove")) {
            __WEBPACK_IMPORTED_MODULE_1__Array__["b" /* each */](oldArray, function (x) {
                _this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: _this,
                    oldValue: x
                });
            });
        }
        if (this.events.isEnabled("insert")) {
            __WEBPACK_IMPORTED_MODULE_1__Array__["b" /* each */](this._values, function (x) {
                _this.events.dispatchImmediately("insert", {
                    type: "insert",
                    target: _this,
                    newValue: x
                });
            });
        }
    };
    /**
     * Removes all items from the list.
     */
    OrderedList.prototype.clear = function () {
        this.setAll([]);
    };
    /**
     * Returns part of the list between `start` and `end` indexes, as a new
     * [[OrderedList]].
     *
     * @param  {number}          start  Start index
     * @param  {number}          end    End index
     * @return {OrderedList<T>}         Items in range
     */
    OrderedList.prototype.slice = function (start, end) {
        var out = new OrderedList();
        out._values = this._values.slice(start, end);
        return out;
    };
    /**
     * Finds a closest available index to the `value` in specified direction.
     *
     * @ignore exclude from docs
     * @param  {number}                      value      value to search for
     * @param  {function}                    fn         A callback function that returns value of the item
     * @param  {"left" | "right" |  "any" }  direction  Direciton
     * @return {number}                                 Index
     */
    OrderedList.prototype.findClosestIndex = function (value, fn, direction) {
        if (direction === void 0) { direction = "any"; }
        // Init temporary values
        var closestIndex = -1;
        var closestValue;
        var closestDifference;
        var i = 0;
        __WEBPACK_IMPORTED_MODULE_2__Iterator__["eachContinue"](this.iterator(), function (element) {
            var item = fn(element);
            // Exact match?
            if (item === value) {
                // Found exact value - don't bother searching further
                closestIndex = i;
                return false;
            }
            // Calc difference
            if (direction === "any") {
                var difference = Math.abs(value - item);
                if (!__WEBPACK_IMPORTED_MODULE_3__Type__["hasValue"](closestDifference) || (closestDifference > difference)) {
                    closestIndex = i;
                    closestValue = item;
                    closestDifference = difference;
                }
            }
            else if (direction === "left" && (item < value)) {
                if (!__WEBPACK_IMPORTED_MODULE_3__Type__["hasValue"](closestValue) || (closestValue < item)) {
                    closestIndex = i;
                    closestValue = item;
                }
            }
            else if (direction === "right" && (item > value)) {
                if (!__WEBPACK_IMPORTED_MODULE_3__Type__["hasValue"](closestValue) || (closestValue > item)) {
                    closestIndex = i;
                    closestValue = item;
                }
            }
            ++i;
            return true;
        });
        // Found nothing?
        if (closestIndex === -1) {
            if (direction === "left") {
                // Use First one
                closestIndex = 0;
            }
            else if (direction === "right") {
                // Use last item
                closestIndex = this.length - 1;
            }
        }
        return closestIndex;
    };
    /**
     * Returns a list iterator.
     *
     * @return {Iterator} Iterator
     */
    OrderedList.prototype.iterator = function () {
        return __WEBPACK_IMPORTED_MODULE_2__Iterator__["fromArray"](this._values);
    };
    return OrderedList;
}());

/**
 * A list where all items are ordered according to specific ordering function,
 * which is passed in via constructor parameter, when creating an instance of
 * [[SortedList]].
 */
var SortedList = /** @class */ (function (_super) {
    __extends(SortedList, _super);
    /**
     * Constructor.
     *
     * @param {T) => Ordering}  sort  Ordering function
     */
    function SortedList(sort) {
        var _this = _super.call(this) || this;
        _this._ordering = sort;
        return _this;
    }
    /**
     * Inserts item into the list.
     *
     * @param {T}  value  Item
     */
    SortedList.prototype._insert = function (value) {
        var _a = __WEBPACK_IMPORTED_MODULE_1__Array__["f" /* getSortedIndex */](this._values, this._ordering, value), found = _a.found, index = _a.index;
        // @todo maybe allow for multiple items which are equal ?
        if (found) {
            // @todo pretty printing
            throw new Error("Value already exists: " + value);
        }
        else {
            __WEBPACK_IMPORTED_MODULE_1__Array__["h" /* insertIndex */](this._values, index, value);
        }
    };
    /**
     * Returns index of the item in list if found.
     *
     * -1 if item is not in the list.
     *
     * @param  {T}       value  Item to search for
     * @return {number}         Index
     */
    SortedList.prototype.indexOf = function (value) {
        var _a = __WEBPACK_IMPORTED_MODULE_1__Array__["f" /* getSortedIndex */](this._values, this._ordering, value), found = _a.found, index = _a.index;
        if (found) {
            return index;
        }
        else {
            return -1;
        }
    };
    /**
     * [udpate description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {T} value [description]
     */
    SortedList.prototype.update = function (value) {
        // @todo test this
        var index = __WEBPACK_IMPORTED_MODULE_1__Array__["g" /* indexOf */](this._values, value);
        // @todo throw an error if it doesn't exist ?
        if (index !== -1) {
            var last = this._values.length - 1;
            // Check if the current ordering is correct
            if (!((index === 0 || this._ordering(this._values[index - 1], value) < 0) &&
                (index === last || this._ordering(value, this._values[index + 1]) < 0))) {
                __WEBPACK_IMPORTED_MODULE_1__Array__["l" /* removeIndex */](this._values, index);
                this._insert(value);
            }
        }
    };
    return SortedList;
}(OrderedList));

/**
 * A version of a [[OrderedList]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
var OrderedListTemplate = /** @class */ (function (_super) {
    __extends(OrderedListTemplate, _super);
    /**
     * Constructor
     *
     * @param {T} t Template object
     */
    function OrderedListTemplate(t) {
        var _this = _super.call(this) || this;
        _this.template = t;
        return _this;
    }
    Object.defineProperty(OrderedListTemplate.prototype, "template", {
        /**
         * @return {T} Template object
         */
        get: function () {
            return this._template;
        },
        /**
         * A "template" object to copy all properties from when creating new list
         * items.
         *
         * @param {T}  v  Template object
         */
        set: function (v) {
            v.isTemplate = true;
            this._template = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all elements from other list.
     *
     * @param {OrderedListTemplate}  source  Source list
     */
    OrderedListTemplate.prototype.copyFrom = function (source) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2__Iterator__["each"](source.iterator(), function (value) {
            _this.insert(value.clone());
        });
    };
    /**
     * Returns part of the list, starting at `start` and ending at `end` indexes,
     * as a new [[OrderedListTemplate]].
     *
     * @param  {number}                  start  Start index
     * @param  {number}                  end    End index
     * @return {OrderedListTemplate<T>}         New list
     */
    OrderedListTemplate.prototype.slice = function (start, end) {
        var out = new OrderedListTemplate(this.template);
        out._values = this._values.slice(start, end);
        return out;
    };
    OrderedListTemplate.prototype.create = function (make) {
        var clone = (make != null
            ? new make()
            : this.template.clone());
        this.insert(clone);
        return clone;
    };
    return OrderedListTemplate;
}(OrderedList));

/**
 * A version of a [[SortedList]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
var SortedListTemplate = /** @class */ (function (_super) {
    __extends(SortedListTemplate, _super);
    /**
     * Constructor
     *
     * @param {T}         t     Template object
     * @param {function}  sort  Ordering function
     */
    function SortedListTemplate(t, sort) {
        var _this = _super.call(this, sort) || this;
        _this.template = t;
        return _this;
    }
    Object.defineProperty(SortedListTemplate.prototype, "template", {
        /**
         * @return {T} Template object
         */
        get: function () {
            return this._template;
        },
        /**
         * A "template" object to copy all properties from when creating new list
         * items.
         *
         * @param {T}  v  Template object
         */
        set: function (v) {
            v.isTemplate = true;
            this._template = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all elements from other list.
     *
     * @param {SortedListTemplate}  source  Source list
     */
    SortedListTemplate.prototype.copyFrom = function (source) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2__Iterator__["each"](source.iterator(), function (value) {
            _this.insert(value.clone());
        });
    };
    SortedListTemplate.prototype.create = function (make) {
        var clone = (make != null
            ? new make()
            : this.template.clone());
        this.insert(clone);
        return clone;
    };
    return SortedListTemplate;
}(SortedList));

//# sourceMappingURL=SortedList.js.map

/***/ }),

/***/ 44:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Cache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return cache; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Dictionary__ = __webpack_require__(15);
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Represents object cache.
 *
 * @ignore Exclude from docs
 * @todo Better storage
 * @todo TTL logging
 * @todo Garbage collector
 */
var Cache = /** @class */ (function () {
    function Cache() {
        /**
         * Storage for cache items.
         *
         * @type {Object}
         */
        this._storage = new __WEBPACK_IMPORTED_MODULE_0__Dictionary__["a" /* Dictionary */]();
        /**
         * Default TTL in milliseconds.
         *
         * @type {number}
         */
        this.ttl = 1000;
    }
    /**
     * Caches or updates cached value, resets TTL.
     *
     * @param {string}  owner  An id of the object that owns this cache
     * @param {string}  key    Index key
     * @param {A}       value  Value
     */
    Cache.prototype.set = function (owner, key, value) {
        // Create if storage does not exist for this owner
        var ownerStorage = this._storage.insertKeyIfEmpty(owner, function () { return new __WEBPACK_IMPORTED_MODULE_0__Dictionary__["a" /* Dictionary */](); });
        // Create cache item
        var item = {
            "touched": new Date().getTime(),
            "ttl": this.ttl,
            "value": value
        };
        // Set
        ownerStorage.setKey(key, item);
    };
    /**
     * Rerturns cached item, respecting TTL.
     *
     * @param  {string}  owner  An id of the object that owns this cache
     * @param  {string}  key    Index key
     * @return {A}              Value, or `undefined` if not set
     */
    Cache.prototype.get = function (owner, key) {
        // 		 || ypeof this._storage[owner][key] === "undefined" || this._storage[owner][key].expired === true) {
        if (this._storage.hasKey(owner)) {
            var ownerStorage = this._storage.getKey(owner);
            if (ownerStorage.hasKey(key)) {
                var cacheItem = ownerStorage.getKey(key);
                return cacheItem.expired === true ? undefined : cacheItem.value;
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    };
    /**
     * Clears cache for specific owner or everything.
     *
     * @param {string} owner Owner to clear cache for
     */
    Cache.prototype.clear = function (owner) {
        if (owner) {
            this._storage.removeKey(owner);
        }
        else {
            this._storage.clear();
        }
    };
    return Cache;
}());

/**
 * ============================================================================
 * GLOBAL INSTANCE
 * ============================================================================
 * @hidden
 */
/**
 * A global instance of cache. Use this instance to cache any values.
 *
 * @ignore Exclude from docs
 */
var cache = new Cache();
//# sourceMappingURL=Cache.js.map

/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["order"] = order;
/**
 * ============================================================================
 * COMPARING FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Comparing function used for ordering.
 *
 * @ignore Exclude from docs
 * @param  {number}    a  Number 1
 * @param  {number}    b  Number 2
 * @return {Ordering}     Result
 */
function order(a, b) {
    if (a === b) {
        return 0;
    }
    else if (a < b) {
        return -1;
    }
    else {
        return 1;
    }
}
//# sourceMappingURL=Number.js.map

/***/ }),

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Disposer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return MultiDisposer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return MutableValueDisposer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CounterDisposer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Array__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Type__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */


/**
 * A base class for disposable objects.
 *
 * @ignore Exclude from docs
 */
var Disposer = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {function}  dispose  Function that disposes object
     */
    function Disposer(dispose) {
        this._disposed = false;
        this._dispose = dispose;
    }
    /**
     * Checks if object is disposed.
     *
     * @return {boolean} Disposed?
     */
    Disposer.prototype.isDisposed = function () {
        return this._disposed;
    };
    /**
     * Disposes the object.
     */
    Disposer.prototype.dispose = function () {
        if (!this._disposed) {
            this._disposed = true;
            this._dispose();
        }
    };
    return Disposer;
}());

/**
 * A collection of related disposers that can be disposed in one go.
 *
 * @ignore Exclude from docs
 */
var MultiDisposer = /** @class */ (function (_super) {
    __extends(MultiDisposer, _super);
    function MultiDisposer(disposers) {
        return _super.call(this, function () {
            __WEBPACK_IMPORTED_MODULE_0__Array__["b" /* each */](disposers, function (x) {
                x.dispose();
            });
        }) || this;
    }
    return MultiDisposer;
}(Disposer));

/**
 * A special kind of Disposer that has attached value set.
 *
 * If a new value is set using `set()` method, the old disposer value is
 * disposed.
 *
 * @ignore Exclude from docs
 * @todo Description
 */
var MutableValueDisposer = /** @class */ (function (_super) {
    __extends(MutableValueDisposer, _super);
    /**
     * Constructor.
     */
    function MutableValueDisposer() {
        var _this = _super.call(this, function () {
            if (__WEBPACK_IMPORTED_MODULE_1__Type__["hasValue"](_this._disposer)) {
                _this._disposer.dispose();
                _this._disposer = undefined;
            }
        }) || this;
        _this._disposer = undefined;
        return _this;
    }
    /**
     * Returns current value.
     *
     * @return {Optional<T>} Value
     */
    MutableValueDisposer.prototype.get = function () {
        return this._value;
    };
    /**
     * Sets value and disposes previous value if it was set.
     *
     * @param {Optional<T>}          value     New value
     * @param {Optional<IDisposer>}  disposer  Disposer
     */
    MutableValueDisposer.prototype.set = function (value, disposer) {
        if (__WEBPACK_IMPORTED_MODULE_1__Type__["hasValue"](this._disposer)) {
            this._disposer.dispose();
        }
        this._disposer = disposer;
        this._value = value;
    };
    /**
     * Resets the disposer value.
     */
    MutableValueDisposer.prototype.reset = function () {
        this.set(undefined, undefined);
    };
    return MutableValueDisposer;
}(Disposer));

/**
 * @ignore Exclude from docs
 * @todo Description
 */
var CounterDisposer = /** @class */ (function (_super) {
    __extends(CounterDisposer, _super);
    function CounterDisposer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * [_counter description]
         *
         * @todo Description
         * @type {number}
         */
        _this._counter = 0;
        return _this;
    }
    /**
     * [increment description]
     *
     * @todo Description
     */
    CounterDisposer.prototype.increment = function () {
        var _this = this;
        // TODO throw an error if it is disposed
        ++this._counter;
        // TODO make this more efficient
        return new Disposer(function () {
            --_this._counter;
            if (_this._counter === 0) {
                _this.dispose();
            }
        });
    };
    return CounterDisposer;
}(Disposer));

//# sourceMappingURL=Disposer.js.map

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = reverse;
/* harmony export (immutable) */ __webpack_exports__["a"] = or;
/**
 * A collection of functions for ordering.
 */
/**
 * [reverse description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {Ordering}  a  [description]
 * @return {Ordering}     [description]
 */
function reverse(a) {
    switch (a) {
        case 0:
            return 0;
        case -1:
            return 1;
        case 1:
            return -1;
    }
}
/**
 * [or description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {Ordering}  a  Item 1
 * @param  {Ordering}  b  Item 2
 * @return {Ordering}     [description]
 */
function or(a, b) {
    if (a === 0) {
        return b;
    }
    else {
        return a;
    }
}
//# sourceMappingURL=Order.js.map

/***/ }),

/***/ 559:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(560);


/***/ }),

/***/ 560:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__es2015_themes_kelly__ = __webpack_require__(561);


var amcharts4 = window.amcharts4;
amcharts4.themes = amcharts4.themes || {};
amcharts4.themes.kelly = __WEBPACK_IMPORTED_MODULE_0__es2015_themes_kelly__["a" /* default */];

/***/ }),

/***/ 561:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_themes_kelly__ = __webpack_require__(562);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_themes_kelly__["a"]; });

//# sourceMappingURL=kelly.js.map

/***/ }),

/***/ 562:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_utils_Color__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_ColorSet__ = __webpack_require__(67);
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

/***/ }),

/***/ 6:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BaseObjectEvents; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_Dictionary__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_Disposer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_EventDispatcher__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_Adapter__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_Color__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_Percent__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__utils_Cache__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_Array__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utils_Object__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__utils_Type__ = __webpack_require__(0);
/**
 * Base functionality
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();












/**
 * Provides base functionality for all derivative objects, like generating ids,
 * handling cache, etc.
 */
var BaseObject = /** @class */ (function () {
    //protected _classes: { [index: string]: any } = {};
    /**
     * Constructor
     * * Sets class name
     */
    function BaseObject() {
        /**
         * Indicates if this object has already been deleted. Any
         * destruction/disposal code should take this into account when deciding
         * wheter to run potentially costly disposal operations if they already have
         * been run.
         *
         * @type {boolean}
         * @ignore Exclude from docs
         */
        this._disposed = false;
        /**
         * List of IDisposer which will be disposed when the BaseObject is disposed.
         *
         * @ignore Exclude from docs
         */
        this._disposers = [];
        this.className = "BaseObject";
    }
    Object.defineProperty(BaseObject.prototype, "uid", {
        /**
         * Returns object's internal unique ID.
         *
         * @return {string} Unique ID
         */
        get: function () {
            if (!this._uid) {
                this._uid = __WEBPACK_IMPORTED_MODULE_7__Registry__["a" /* registry */].getUniqueId();
                __WEBPACK_IMPORTED_MODULE_7__Registry__["a" /* registry */].map.setKey(this._uid, this);
            }
            return this._uid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseObject.prototype, "id", {
        /**
         * @return {string} Id
         */
        get: function () {
            return this._id;
        },
        /**
         * Sets the user-defined id of the element.
         *
         * @param {string} value Id
         */
        set: function (value) {
            //registry.map.setKey(value, this); // registry.map only stores by uid
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseObject.prototype, "map", {
        /**
         * Returns a universal collection for mapping ids with objects.
         *
         * @ignore Exclude from docs
         * @return {Dictionary<string, any>} Map collection
         */
        get: function () {
            if (!this._map) {
                this._map = new __WEBPACK_IMPORTED_MODULE_1__utils_Dictionary__["a" /* Dictionary */]();
            }
            return this._map;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Applies properties from all assigned themes.
     *
     * @ignore Exclude from docs
     */
    BaseObject.prototype.applyTheme = function () {
        var _this = this;
        // TODO is this needed ?
        if (__WEBPACK_IMPORTED_MODULE_7__Registry__["a" /* registry */]) {
            var themes = this.getCurrentThemes();
            // TODO is this needed ?
            if (themes) {
                __WEBPACK_IMPORTED_MODULE_9__utils_Array__["b" /* each */](themes, function (theme, index) {
                    theme(_this);
                });
            }
        }
    };
    Object.defineProperty(BaseObject.prototype, "themes", {
        /**
         * @ignore Exclude from docs
         * @return {ITheme[]} An array of themes
         */
        get: function () {
            return this._themes;
        },
        /**
         * A list of themes to be used for this element.
         *
         * @ignore Exclude from docs
         * @param {ITheme[]} value An array of themes
         */
        set: function (value) {
            this._themes = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a list of themes that should be applied to this element. It could
     * either be a list of themes set explicitly on this element, or system-wide.
     *
     * @return {ITheme[]} List of themes
     */
    BaseObject.prototype.getCurrentThemes = function () {
        return this.themes || __WEBPACK_IMPORTED_MODULE_7__Registry__["a" /* registry */].themes;
    };
    /**
     * Returns if this object has been already been disposed.
     *
     * @return {boolean} Is disposed?
     */
    BaseObject.prototype.isDisposed = function () {
        return this._disposed;
    };
    /**
     * Destroys this object and all related data.
     */
    BaseObject.prototype.dispose = function () {
        if (!this._disposed) {
            this._disposed = true;
            var a = this._disposers;
            this._disposers = null;
            __WEBPACK_IMPORTED_MODULE_9__utils_Array__["b" /* each */](a, function (x) {
                x.dispose();
            });
            // Clear cache
            this.clearCache();
            // remove from clones list
            if (this.clonedFrom) {
                this.clonedFrom.clones.removeValue(this);
            }
            __WEBPACK_IMPORTED_MODULE_7__Registry__["a" /* registry */].map.removeKey(this._uid);
        }
    };
    /**
     * Disposes disposable object and removes it from `_disposers`.
     *
     * @param {IDisposer} target Object to dispose
     * @ignore Exclude from docs
     */
    BaseObject.prototype.removeDispose = function (target) {
        //if(target){
        if (!this._disposed) {
            var index = __WEBPACK_IMPORTED_MODULE_9__utils_Array__["g" /* indexOf */](this._disposers, target);
            if (index > -1) {
                this._disposers.splice(index, 1);
            }
        }
        target.dispose();
        //}
    };
    /**
     * Makes a copy of this object and returns the clone. Try to avoid clonning complex objects like chart, create new instances if you need them.
     *
     * @param   {string}  cloneId  An id to use for clone (if not set a unique id will be generated)
     * @returns {Object}           Clone
     */
    BaseObject.prototype.clone = function (cloneId) {
        if (!cloneId) {
            cloneId = "clone-" + __WEBPACK_IMPORTED_MODULE_7__Registry__["a" /* registry */].getUniqueId();
        }
        var newObject = new this.constructor();
        newObject.cloneId = cloneId;
        newObject.clonedFrom = this;
        newObject.copyFrom(this);
        // add to clones list
        this.clones.push(newObject);
        return newObject;
    };
    Object.defineProperty(BaseObject.prototype, "clones", {
        /**
         * Returns a collection of object's clones.
         *
         * @ignore Exclude from docs
         * @return {Dictionary<string, BaseObject>} Clones
         */
        get: function () {
            if (!this._clones) {
                this._clones = new __WEBPACK_IMPORTED_MODULE_0__utils_List__["b" /* List */]();
            }
            return this._clones;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all properties and related data from different element.
     *
     * @param {this} object Source element
     */
    BaseObject.prototype.copyFrom = function (object) {
    };
    Object.defineProperty(BaseObject.prototype, "className", {
        /**
         * @ignore Exclude from docs
         * @return {string} Class name
         */
        get: function () {
            return this._className;
        },
        /**
         * Element's class name. (a class that was used to instantiate the element)
         *
         * @ignore Exclude from docs
         * @param {string}  value  Class name
         */
        set: function (value) {
            this._className = value;
            /*if (registry) {
                registry.registeredClasses[value] = typeof this;
            }*/
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Caches value in object's cache.
     *
     * @ignore Exclude from docs
     * @param {string}  key    Key
     * @param {any}     value  Value
     */
    BaseObject.prototype.setCache = function (key, value) {
        __WEBPACK_IMPORTED_MODULE_8__utils_Cache__["b" /* cache */].set(this.uid, key, value);
    };
    /**
     * Retrieves cached value.
     *
     * @ignore Exclude from docs
     * @param  {string}  key  Key
     * @return {any}          Value
     */
    BaseObject.prototype.getCache = function (key) {
        return __WEBPACK_IMPORTED_MODULE_8__utils_Cache__["b" /* cache */].get(this.uid, key);
    };
    /**
     * Clears object's local cache.
     *
     * @ignore Exclude from docs
     */
    BaseObject.prototype.clearCache = function () {
        __WEBPACK_IMPORTED_MODULE_8__utils_Cache__["b" /* cache */].clear(this.uid);
    };
    /**
     * Creates [[Disposer]] for `setTimeout` function call. This ensures that all
     * timeouts created by the object will be cleared when object itself is
     * disposed.
     *
     * @ignore Exclude from docs
     * @param  {() => void}  fn     Callback function
     * @param  {number}      delay  Timeout (ms)
     * @return {IDisposer}          Disposer for timeout
     */
    BaseObject.prototype.setTimeout = function (fn, delay) {
        var _this = this;
        var id = setTimeout(function () {
            _this.removeDispose(disposer);
            fn();
        }, delay);
        var disposer = new __WEBPACK_IMPORTED_MODULE_2__utils_Disposer__["b" /* Disposer */](function () {
            clearTimeout(id);
        });
        this._disposers.push(disposer);
        return disposer;
    };
    Object.defineProperty(BaseObject.prototype, "config", {
        /**
         * ==========================================================================
         * JSON-BASED CONFIG PROCESSING
         * ==========================================================================
         * @hidden
         */
        /**
         * Use this property to set JSON-based config. When set, triggers processing
         * routine, which will go thorugh all properties, and try to apply values,
         * create instances, etc.
         *
         * Use this with caution, as it is a time-consuming process. It's used for
         * initialchart setup only, not routine operations.
         *
         * @param {object} json JSON config
         */
        set: function (config) {
            try {
                this.processConfig(config);
            }
            catch (e) {
                /*if (this instanceof Sprite) {
                    this.raiseCriticalError(e);
                }*/
                this.raiseCriticalError(e);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Processes the JSON config.
     *
     * @param {object}  json  JSON config
     * @ignore Exclude from docs
     */
    BaseObject.prototype.processConfig = function (config) {
        var _this = this;
        if (!config) {
            return;
        }
        // Get target
        var target = this;
        // Iterate through all of the items
        __WEBPACK_IMPORTED_MODULE_10__utils_Object__["eachOrdered"](config, function (configKey, configValue) {
            // Check if there's a property in target
            if (_this.hasProperty(configKey)) {
                var item_1;
                // Do we have instructions to create an object?
                if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](configValue) && __WEBPACK_IMPORTED_MODULE_11__utils_Type__["hasValue"](configValue["type"])) {
                    // Create new instance
                    if (item_1 = _this.createClassInstance(configValue["type"])) {
                        target[configKey] = item_1;
                    }
                    else {
                        item_1 = target[configKey];
                    }
                }
                else {
                    // Get item from the object
                    item_1 = target[configKey];
                }
                /**
                 * It is...
                 * --------------------------------------------------------------------
                 */
                if (item_1 instanceof __WEBPACK_IMPORTED_MODULE_4__utils_Adapter__["a" /* Adapter */]) {
                    // ... an Adapter, try to add handlers to it
                    // ------------------------------------------------------------------
                    _this.processAdapters(item_1, configValue);
                }
                else if (item_1 instanceof __WEBPACK_IMPORTED_MODULE_3__utils_EventDispatcher__["a" /* EventDispatcher */]) {
                    // ... an EventDispatcher, try to add handlers to it
                    // ------------------------------------------------------------------
                    _this.processEvents(item_1, configValue);
                }
                else if (_this.asIs(configKey)) {
                    // ... a special field, just set it to new value
                    // ------------------------------------------------------------------
                    // (no need to add each indvidual item)
                    target[configKey] = configValue;
                }
                else if (configValue instanceof BaseObject) {
                    // ... a BaseObject object, we just going to use it as it is
                    // ------------------------------------------------------------------
                    target[configKey] = configValue;
                }
                else if (item_1 instanceof BaseObject) {
                    // ... another child BaseObject
                    // ------------------------------------------------------------------
                    // Let's just pass in config part in and let itself deal with it
                    item_1.config = configValue;
                }
                else if (item_1 instanceof __WEBPACK_IMPORTED_MODULE_0__utils_List__["e" /* ListTemplate */]) {
                    // ... a list with template
                    // ------------------------------------------------------------------
                    // Let's see what we can do with it
                    if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isArray"](configValue)) {
                        // It's an array.
                        // Create a list item for entry, or try to apply properties to an
                        // existing entry if possible and it is present.
                        __WEBPACK_IMPORTED_MODULE_9__utils_Array__["b" /* each */](configValue, function (entry, index) {
                            var type = _this.getConfigEntryType(entry);
                            var listItem;
                            if (item_1.hasIndex(index)) {
                                listItem = item_1.getIndex(index);
                            }
                            else if (type) {
                                listItem = item_1.create(type);
                            }
                            else {
                                listItem = item_1.create();
                            }
                            if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](entry)) {
                                // If the list item is BaseObject, we just need to let it
                                // deal if its own config
                                if (listItem instanceof BaseObject) {
                                    listItem.config = entry;
                                }
                                else if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](listItem) && __WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](entry)) {
                                    __WEBPACK_IMPORTED_MODULE_10__utils_Object__["copyAllProperties"](entry, listItem);
                                }
                                else {
                                    item_1.setIndex(item_1.indexOf(listItem), entry);
                                }
                            }
                        });
                        // Truncate the list if it contains less items than the config
                        // array
                        while (configValue.length > item_1.length) {
                            item_1.pop();
                        }
                    }
                    else if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](configValue)) {
                        // It's a single oject.
                        // Treat it as a template.
                        __WEBPACK_IMPORTED_MODULE_10__utils_Object__["each"](configValue, function (entryKey, entryValue) {
                            var listItem = item_1.template[entryKey];
                            if (listItem instanceof __WEBPACK_IMPORTED_MODULE_4__utils_Adapter__["a" /* Adapter */]) {
                                _this.processAdapters(listItem, entryValue);
                            }
                            else if (listItem instanceof __WEBPACK_IMPORTED_MODULE_3__utils_EventDispatcher__["a" /* EventDispatcher */]) {
                                _this.processEvents(listItem, entryValue);
                            }
                            else if (listItem instanceof __WEBPACK_IMPORTED_MODULE_1__utils_Dictionary__["c" /* DictionaryTemplate */]) {
                                _this.processDictionaryTemplate(listItem, entryValue);
                            }
                            else if (item_1.template[entryKey] instanceof BaseObject) {
                                // Template is a BaseObject. Let it deal with its own config.
                                item_1.template[entryKey].config = entryValue;
                            }
                            else {
                                // Aything else. Just assing and be done with it.
                                item_1.template[entryKey] = entryValue;
                            }
                        });
                    }
                    else {
                        // Something else?
                        // Not sure what to do with it on a list - ignore
                    }
                }
                else if (item_1 instanceof __WEBPACK_IMPORTED_MODULE_0__utils_List__["b" /* List */]) {
                    // ... a list
                    // ------------------------------------------------------------------
                    // Convert to array if necessary
                    if (!__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isArray"](configValue)) {
                        configValue = [configValue];
                    }
                    // It's an array
                    // Create a list item for entry
                    __WEBPACK_IMPORTED_MODULE_9__utils_Array__["b" /* each */](configValue, function (entry, index) {
                        if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](entry)) {
                            // An object.
                            //
                            // Let's see if we can instantiate a class out of it, or we need
                            // to push it into list as it is.
                            //
                            // If there are items already at the specified index in the list,
                            // apply properties rather than create a new one.
                            var listItem = void 0;
                            if (item_1.hasIndex(index)) {
                                listItem = item_1.getIndex(index);
                            }
                            else {
                                var listItem_1 = _this.createEntryInstance(entry);
                                item_1.push(listItem_1);
                            }
                            // If the list item is BaseObject, we just need to let it
                            // deal if its own config
                            if (listItem instanceof BaseObject) {
                                listItem.config = entry;
                            }
                        }
                        else {
                            // Basic value.
                            // Just push it into list, or override existing value
                            if (item_1.hasIndex(index)) {
                                item_1.setIndex(index, entry);
                            }
                            else {
                                item_1.push(entry);
                            }
                        }
                    });
                    // Truncate the list if it contains less items than the config
                    // array
                    while (configValue.length > item_1.length) {
                        item_1.pop();
                    }
                }
                else if (item_1 instanceof __WEBPACK_IMPORTED_MODULE_1__utils_Dictionary__["c" /* DictionaryTemplate */]) {
                    // ... a dictionary with template
                    // ------------------------------------------------------------------
                    _this.processDictionaryTemplate(item_1, configValue);
                }
                else if (item_1 instanceof __WEBPACK_IMPORTED_MODULE_1__utils_Dictionary__["a" /* Dictionary */]) {
                    // ... a dictionary
                    // ------------------------------------------------------------------
                    // @todo
                }
                else if (item_1 instanceof __WEBPACK_IMPORTED_MODULE_5__utils_Color__["a" /* Color */] || item_1 instanceof __WEBPACK_IMPORTED_MODULE_6__utils_Percent__["a" /* Percent */]) {
                    // ... it's a Color or Percent
                    // ------------------------------------------------------------------
                    target[configKey] = configValue;
                }
                else if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](item_1) && __WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](configValue)) {
                    // ... a regular object
                    // ------------------------------------------------------------------
                    __WEBPACK_IMPORTED_MODULE_10__utils_Object__["copyAllProperties"](configValue, item_1);
                }
                else {
                    // ... something else - probably a simple property or object
                    // ------------------------------------------------------------------
                    // Maybe convert to `Percent` or `Color`?
                    if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isString"](configValue)) {
                        if (configValue.match(/^[0-9.\-]+\%$/)) {
                            configValue = Object(__WEBPACK_IMPORTED_MODULE_6__utils_Percent__["c" /* percent */])(__WEBPACK_IMPORTED_MODULE_11__utils_Type__["toNumber"](configValue));
                        }
                        else if (configValue.match(/^\#[0-9abcdef]{3,}$/i)) {
                            configValue = Object(__WEBPACK_IMPORTED_MODULE_5__utils_Color__["c" /* color */])(configValue);
                        }
                    }
                    // Assign
                    target[configKey] = configValue;
                }
            }
        }, this.configOrder);
    };
    BaseObject.prototype.processAdapters = function (item, config) {
        if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](config)) {
            __WEBPACK_IMPORTED_MODULE_10__utils_Object__["each"](config, function (key, entry) {
                if (!item.has(key, entry)) {
                    item.add(key, entry);
                }
            });
        }
    };
    BaseObject.prototype.processEvents = function (item, config) {
        if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](config)) {
            __WEBPACK_IMPORTED_MODULE_10__utils_Object__["each"](config, function (key, entry) {
                if (!item.has(key, entry)) {
                    item.on(key, entry);
                }
            });
        }
    };
    /**
     * Processes JSON config for a [[DictionaryTemplate]] item.
     *
     * @todo Description
     * @param {DictionaryTemplate<any, any>}  item    Item
     * @param {any}                           config  Config
     */
    BaseObject.prototype.processDictionaryTemplate = function (item, config) {
        // We can only process object
        // Not sure what to do with other types - ignore
        if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](config)) {
            // Create an entry for each item, or override properties for
            // existing one.
            __WEBPACK_IMPORTED_MODULE_10__utils_Object__["each"](config, function (entryKey, entryValue) {
                var listItem;
                // Get existing one, or create a new one
                if (item.hasKey(entryKey)) {
                    listItem = item.getKey(entryKey);
                }
                else {
                    listItem = item.create(entryKey);
                }
                // Set data
                if (listItem instanceof BaseObject) {
                    listItem.config = entryValue;
                }
                else if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](listItem) && __WEBPACK_IMPORTED_MODULE_11__utils_Type__["isObject"](entryValue)) {
                    __WEBPACK_IMPORTED_MODULE_10__utils_Object__["copyAllProperties"](entryValue, listItem);
                }
                else {
                    listItem.setKey(entryKey, entryValue);
                }
            });
        }
    };
    /**
     * This function is used to sort element's JSON config properties, so that
     * some properties that absolutely need to be processed last, can be put at
     * the end.
     *
     * @ignore Exclude from docs
     * @param  {string}  a  Element 1
     * @param  {string}  b  Element 2
     * @return {Ordering}   Sorting number
     */
    BaseObject.prototype.configOrder = function (a, b) {
        if (a == b) {
            return 0;
        }
        // Language must come first, so it's all set up when the rest of the
        // elements are being instantiated
        else if (a == "language") {
            return -1;
        }
        else if (b == "language") {
            return 1;
        }
        else {
            return 0;
        }
    };
    /**
     * Checks if field should be just assigned as is, without any checking when
     * processing JSON config.
     *
     * Extending functions can override this function to do their own checks.
     *
     * @param  {string}   field  Field name
     * @return {boolean}         Assign as is?
     */
    BaseObject.prototype.asIs = function (field) {
        return __WEBPACK_IMPORTED_MODULE_9__utils_Array__["g" /* indexOf */](["locale"], field) != -1;
    };
    /**
     * Creates a relevant class instance if such class definition exists.
     *
     * @ignore Exclude from docs
     * @param  {string}  className  Class name
     * @return {Object}             Instance
     */
    BaseObject.prototype.createClassInstance = function (className) {
        if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["hasValue"](__WEBPACK_IMPORTED_MODULE_7__Registry__["a" /* registry */].registeredClasses[className])) {
            return new __WEBPACK_IMPORTED_MODULE_7__Registry__["a" /* registry */].registeredClasses[className]();
        }
        return;
    };
    /**
     * Creates a class instance for a config entry using it's type. (as set in
     * `type` property)
     *
     * @ignore Exclude from docs
     * @param  {any}  config  Config part
     * @return {any}          Instance
     */
    BaseObject.prototype.createEntryInstance = function (config) {
        var res;
        if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["hasValue"](config["type"])) {
            res = this.createClassInstance(config["type"]);
        }
        if (!res) {
            return config;
        }
        return res;
    };
    /**
     * Determines config object type.
     *
     * @ignore Exclude from docs
     * @param  {any}  config  Config part
     * @return {any}          Type
     */
    BaseObject.prototype.getConfigEntryType = function (config) {
        if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["hasValue"](config["type"])) {
            if (__WEBPACK_IMPORTED_MODULE_11__utils_Type__["hasValue"](__WEBPACK_IMPORTED_MODULE_7__Registry__["a" /* registry */].registeredClasses[config["type"]])) {
                return __WEBPACK_IMPORTED_MODULE_7__Registry__["a" /* registry */].registeredClasses[config["type"]];
            }
            else {
                throw Error("Invalid type: \"" + config["type"] + "\".");
            }
        }
        return;
    };
    /**
     * Checks if this element has a property.
     *
     * @ignore Exclude from docs
     * @param  {string}   prop  Property name
     * @return {boolean}        Has property?
     */
    BaseObject.prototype.hasProperty = function (prop) {
        return prop in this ? true : false;
    };
    return BaseObject;
}());

;
/**
 * A version of [[BaseObject]] with events properties and methods.
 * Classes that use [[EventDispatcher]] should extend this instead of
 * [[BaseObject]] directly.
 */
var BaseObjectEvents = /** @class */ (function (_super) {
    __extends(BaseObjectEvents, _super);
    /**
     * Constructor
     */
    function BaseObjectEvents() {
        var _this = _super.call(this) || this;
        /**
         * An [[EventDispatcher]] instance
         */
        _this.events = new __WEBPACK_IMPORTED_MODULE_3__utils_EventDispatcher__["a" /* EventDispatcher */]();
        _this.className = "BaseObjectEvents";
        _this._disposers.push(_this.events);
        return _this;
    }
    /**
     * Dispatches an event using own event dispatcher. Will automatically
     * populate event data object with event type and target (this element).
     * It also checks if there are any handlers registered for this sepecific
     * event.
     *
     * @param {string} eventType Event type (name)
     * @param {any}    data      Data to pass into event handler(s)
     */
    BaseObjectEvents.prototype.dispatch = function (eventType, data) {
        // @todo Implement proper type check
        if (this.events.isEnabled(eventType)) {
            if (data) {
                data.type = eventType;
                data.target = data.target || this;
                this.events.dispatch(eventType, {
                    type: eventType,
                    target: this
                });
            }
            else {
                this.events.dispatch(eventType, {
                    type: eventType,
                    target: this
                });
            }
        }
    };
    /**
     * Works like `dispatch`, except event is triggered immediately, without
     * waiting for the next frame cycle.
     *
     * @param {string} eventType Event type (name)
     * @param {any}    data      Data to pass into event handler(s)
     */
    BaseObjectEvents.prototype.dispatchImmediately = function (eventType, data) {
        // @todo Implement proper type check
        if (this.events.isEnabled(eventType)) {
            if (data) {
                data.type = eventType;
                data.target = data.target || this;
                this.events.dispatchImmediately(eventType, data);
            }
            else {
                this.events.dispatchImmediately(eventType, {
                    type: eventType,
                    target: this
                });
            }
        }
    };
    return BaseObjectEvents;
}(BaseObject));

//# sourceMappingURL=Base.js.map

/***/ }),

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ColorSet; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Base__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Color__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Colors__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Type__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Utils__ = __webpack_require__(9);
/**
 * This module contains ColorSet object definition
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */





/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Represents a set of colors. Can also generate colors according to set rules.
 *
 * @important
 */
var ColorSet = /** @class */ (function (_super) {
    __extends(ColorSet, _super);
    /**
     * Constructor
     */
    function ColorSet() {
        var _this = _super.call(this) || this;
        /**
         * Holds the list of the colors in this set. (preset or auto-generated)
         *
         * @type {Color[]}
         */
        _this._list = [];
        /**
         * Current step in a color generator's cycle.
         *
         * @type {number}
         */
        _this._currentStep = 0;
        /**
         * Current pass in the color generator's cycle. Normally a generator would
         * cycle through all available hue range, then repeat it, alternating other
         * color properties, to generate distinctive colors.
         *
         * @type {number}
         */
        _this._currentPass = 0;
        /**
         * A base color. If there are no colors pre-set in the color list, ColorSet
         * will use this color as a base when generating new ones, applying
         * `stepOptions` and `passOptions` to this base color.
         *
         * @type {Color}
         */
        _this.baseColor = new __WEBPACK_IMPORTED_MODULE_1__Color__["a" /* Color */]({
            r: 103,
            g: 183,
            b: 220
        });
        /**
         * Modifications to apply with each new generated color.
         *
         * @type {iColorSetStepOptions}
         */
        _this.stepOptions = {};
        /**
         * Modifications to apply on top of `stepOptions` for each "pass" of the
         * color generation.
         *
         * A "pass" is when ColorSet generates `minColors` number of colors.
         *
         * @type {iColorSetStepOptions}
         */
        _this.passOptions = {
            brighten: -0.2
        };
        /**
         * An index increment to use when iterating through color list.
         *
         * Default is 1, which means returning each and every color.
         *
         * Setting it to a bigger number will make ColorSet `next()` iterator skip
         * some colors.
         *
         * E.g. setting to 2, will return every second color in the list.
         *
         * This is useful, when the color list has colors that are too close each
         * other for contrast.
         *
         * However, having bigger number will mean that `next()` iterator will go
         * through the list quicker, and the generator will kick sooner.
         *
         * @type {number}
         */
        _this.step = 1;
        /**
         * A number of colors to generate in one "pass".
         *
         * This setting can be automatically overridden, if ColorSet has a list of
         * pre-set colors. In such case ColorSet will generate exactly the same
         * number of colors with each pass as there were colors in original set.
         *
         * @type {number}
         */
        _this.minColors = 20;
        /**
         * Do not let the "lightness" of generated color to fall below this
         * threshold.
         *
         * @type {number}
         */
        _this.minLightness = 0.2;
        /**
         * Do not let the "lightness" of generated color to get above this threshold.
         *
         * @type {number}
         */
        _this.maxLightness = 0.9;
        /**
         * Randomly shuffle generated colors.
         *
         * @type {boolean}
         */
        _this.shuffle = false;
        /**
         * When colors are generated, based on `stepOptions`, each generated color
         * gets either lighter or darker.
         *
         * If this is set to `true`, color generator will switch to opposing spectrum
         * when reaching `minLightness` or `maxLightness`.
         *
         * E.g. if we start off with a red color, then gradually generate lighter
         * colors through rose shades, then switch back to dark red and gradually
         * increase the lightness of it until it reaches the starting red.
         *
         * If set to `false` it will stop there and cap lightness at whatever level
         * we hit `minLightness` or `maxLightness`, which may result in a number of
         * the same colors.
         *
         * @type {boolean}
         */
        _this.wrap = true;
        /**
         * Re-use same colors in the pre-set list, when ColorSet runs out of colors,
         * rather than start generating new ones.
         *
         * @type {boolean}
         */
        _this.reuse = false;
        /**
         * Saturation of colors. THis will change saturation of all colors of color set.
         * It is recommended to set this in theme, as changing it at run time won't make the items to redraw and change color.
         *
         * @type {boolean}
         */
        _this.saturation = 1;
        _this.className = "ColorSet";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(ColorSet.prototype, "list", {
        /**
         * Returns current list of colors.
         *
         * If there are none, a new list of colors is generated, based on various
         * ColorSet settings.
         *
         * @return {Color[]} Color list
         */
        get: function () {
            if (!this._list) {
                this.generate(this.minColors);
            }
            return this._list;
        },
        /**
         * Sets a list of pre-defined colors to use for the iterator.
         *
         * @param {Color[]} value Color list
         */
        set: function (value) {
            this._list = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns next color in the list using internal iterator counter.
     *
     * If `step` is set to something other than 1, it may return other color than
     * exact next one in the list.
     *
     * @return {Color} Color
     */
    ColorSet.prototype.next = function () {
        if (this.list.length <= this._currentStep) {
            if (this.reuse && this._currentPass == 0 && this._list.length) {
                this.minColors = this._list.length;
            }
            this.generate(this.minColors);
        }
        var color = this.list[this._currentStep];
        this._currentStep += this.step;
        return color.saturate(this.saturation);
    };
    /**
     * Returns a color at specific index in the list.
     *
     * @param  {number}  i  Index
     * @return {Color}      Color
     */
    ColorSet.prototype.getIndex = function (i) {
        if (this.list.length <= i) {
            if (this.reuse && this._currentPass == 0 && this._list.length) {
                this.minColors = this._list.length;
            }
            this.generate(this.minColors);
            return this.getIndex(i);
        }
        return this.list[i].saturate(this.saturation);
    };
    /**
     * Resets internal iterator.
     *
     * Calling `next()` after this will return the very first color in the color
     * list, even if it was already returned before.
     */
    ColorSet.prototype.reset = function () {
        this._currentStep = 0;
    };
    /**
     * Generates colors based on the various ColorSet settings.
     *
     * @param {number} count Number of colors to generate
     */
    ColorSet.prototype.generate = function (count) {
        // Init
        var curColor = this.currentColor;
        var hsl = __WEBPACK_IMPORTED_MODULE_2__Colors__["rgbToHsl"](curColor.rgb);
        var hueStep = __WEBPACK_IMPORTED_MODULE_3__Type__["hasValue"](this.stepOptions.hue) ? this.stepOptions.hue : 1 / count;
        var mods = {
            brighten: 0,
            lighten: 0,
            lightness: hsl.l,
            saturation: hsl.s
        };
        // Generate list of hues, and shuffle them
        var hues = [];
        if (this.reuse) {
            for (var i = 0; i < count; i++) {
                hues.push(__WEBPACK_IMPORTED_MODULE_2__Colors__["rgbToHsl"](this._list[i].rgb).h);
            }
        }
        else {
            for (var i = 0; i < count; i++) {
                var h = hsl.h + hueStep * i;
                if (this.wrap && (h > 1)) {
                    h -= 1;
                }
                hues.push(h);
            }
        }
        // Shuffle colors randomly
        if (this.shuffle) {
            hues.sort(function (a, b) {
                return Math.random() - 0.5;
            });
        }
        // Generate colors by rotating hue
        for (var i = 0; i < count; i++) {
            // Update hue
            if (this.reuse) {
                hsl = __WEBPACK_IMPORTED_MODULE_2__Colors__["rgbToHsl"](this._list[i].rgb);
            }
            else {
                hsl.h = hues.shift();
            }
            // Apply HSL mods
            this.applyStepOptions(hsl, mods, i, this._currentPass);
            // Convert back to Color
            var c = Object(__WEBPACK_IMPORTED_MODULE_1__Color__["c" /* color */])(__WEBPACK_IMPORTED_MODULE_2__Colors__["hslToRgb"](hsl));
            // Apply regular color mods
            var brighten = (this.stepOptions.brighten || 0) * i + (this.passOptions.brighten || 0) * this._currentPass;
            if (brighten != 0) {
                if (this.wrap) {
                    brighten = __WEBPACK_IMPORTED_MODULE_4__Utils__["fitNumberRelative"](brighten, this.minLightness, this.maxLightness);
                }
                else {
                    brighten = __WEBPACK_IMPORTED_MODULE_4__Utils__["fitNumber"](brighten, this.minLightness, this.maxLightness);
                }
                c = c.brighten(brighten);
            }
            var lighten = (this.stepOptions.lighten || 0) * i + (this.passOptions.lighten || 0) * this._currentPass;
            if (lighten != 0) {
                if (this.wrap) {
                    lighten = __WEBPACK_IMPORTED_MODULE_4__Utils__["fitNumberRelative"](lighten, this.minLightness, this.maxLightness);
                }
                else {
                    lighten = __WEBPACK_IMPORTED_MODULE_4__Utils__["fitNumber"](lighten, this.minLightness, this.maxLightness);
                }
                c = c.lighten(lighten);
            }
            this._list.push(c);
        }
        this._currentPass++;
    };
    Object.defineProperty(ColorSet.prototype, "currentColor", {
        /**
         * Returns current last color. It's either the last color in the list of
         * colors, or `baseColor` if list is empty.
         *
         * @return {Color} Color
         */
        get: function () {
            if (this._list.length == 0) {
                return this.baseColor.saturate(this.saturation);
            }
            else {
                return this._list[this._list.length - 1].saturate(this.saturation);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Generates modifiers for color, based on what step and pass.
     *
     * @param {iHSL}                  hsl   Curren HSL value of the color to modify
     * @param {iColorSetStepOptions}  base  The modifiers that were before modification to use as a base
     * @param {number}                step  Current step
     * @param {number}                pass  Current pass
     */
    ColorSet.prototype.applyStepOptions = function (hsl, base, step, pass) {
        // Process lightness
        hsl.l = base.lightness + (this.stepOptions.lightness || 0) * step + (this.passOptions.lightness || 0) * pass;
        if (this.wrap) {
            if (hsl.l > 1) {
                hsl.l = hsl.l - Math.floor(hsl.l);
            }
            else if (hsl.l < 0) {
                hsl.l = -(hsl.l - Math.floor(hsl.l));
            }
            hsl.l = __WEBPACK_IMPORTED_MODULE_4__Utils__["fitNumberRelative"](hsl.l, this.minLightness, this.maxLightness);
        }
        else {
            if (hsl.l > 1) {
                hsl.l = 1;
            }
            else if (hsl.l < 0) {
                hsl.l = 0;
            }
            hsl.l = __WEBPACK_IMPORTED_MODULE_4__Utils__["fitNumber"](hsl.l, this.minLightness, this.maxLightness);
        }
    };
    return ColorSet;
}(__WEBPACK_IMPORTED_MODULE_0__Base__["a" /* BaseObject */]));

//# sourceMappingURL=ColorSet.js.map

/***/ }),

/***/ 7:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IndexedIterable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ListGrouper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ListDisposer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return List; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ListTemplate; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Disposer__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EventDispatcher__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Array__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Iterator__ = __webpack_require__(4);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




/**
 * @todo Description
 */
var IndexedIterable = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {Array<A>}  array  List items
     * @param {number}    start  Start index
     * @param {number}    end    End index
     */
    function IndexedIterable(array, start, end) {
        this._array = array;
        this._start = start;
        this._end = end;
    }
    /**
     * Returns a list item iterator.
     *
     * @return {Iterator} Iterator
     */
    IndexedIterable.prototype.iterator = function () {
        var _this = this;
        return function (push) {
            if (_this._start !== _this._end) {
                if (_this._start < _this._end) {
                    for (var i = _this._start; i < _this._end; ++i) {
                        if (!push(_this._array[i])) {
                            break;
                        }
                    }
                }
                else {
                    for (var i = _this._start - 1; i >= _this._end; --i) {
                        if (!push(_this._array[i])) {
                            break;
                        }
                    }
                }
            }
        };
    };
    /**
     * Returns an interable list sorted backwards than current list.
     *
     * @return {IndexedIterable<A>} List
     */
    IndexedIterable.prototype.backwards = function () {
        return new IndexedIterable(this._array, this._end, this._start);
    };
    /**
     * Returns a new list consisting only of specific range of items between
     * `start` and `end` indexes.
     *
     * @param  {number}              start  Start index
     * @param  {number}              end    End index
     * @return {IndexedIterable<A>}         List
     */
    IndexedIterable.prototype.range = function (start, end) {
        if (start <= end) {
            if (this._start === this._end) {
                return this;
            }
            else if (this._start < this._end) {
                var diff = end - start;
                start = Math.max(this._start + start, this._start);
                end = Math.min(start + diff, this._end);
                return new IndexedIterable(this._array, start, end);
            }
            else {
                var diff = end - start;
                start = Math.max(this._start - start, this._end);
                end = Math.max(start - diff, this._end);
                return new IndexedIterable(this._array, start, end);
            }
        }
        else {
            throw new Error("Start index must be lower than end index");
        }
    };
    return IndexedIterable;
}());

/**
 * ListGrouper organizes [[List]] items into groups.
 *
 * @ignore Exclude from docs
 */
var ListGrouper = /** @class */ (function (_super) {
    __extends(ListGrouper, _super);
    /**
     * Constructor.
     */
    function ListGrouper(list, getKey, sort) {
        var _this = _super.call(this, [
            list.events.on("insert", function (x) {
                var value = x.newValue;
                var key = _this._getKey(value);
                var index = 0;
                __WEBPACK_IMPORTED_MODULE_3__Iterator__["eachContinue"](list.iterator(), function (x) {
                    if (x === value) {
                        return false;
                    }
                    else if (_this._getKey(x) === key) {
                        ++index;
                    }
                    return true;
                });
                _this._insert(value, key, index);
            }),
            list.events.on("remove", function (x) {
                _this._remove(x.oldValue);
            })
        ]) || this;
        /**
         * Grouping keys.
         *
         * @type {Array<number>}
         */
        _this._keys = [];
        /**
         * List item groups.
         */
        _this._groups = {};
        _this._getKey = getKey;
        _this._sort = sort;
        __WEBPACK_IMPORTED_MODULE_3__Iterator__["each"](list.iterator(), function (x) {
            _this._insert(x, getKey(x));
        });
        return _this;
    }
    /**
     * Inserts an item (`x`) to a specific group (`key`) and specific `index`.
     *
     * @param {A}       x      Item
     * @param {number}  key    Group name
     * @param {number}  index  Index
     */
    ListGrouper.prototype._insert = function (x, key, index) {
        if (this._groups[key] == null) {
            this._groups[key] = [];
            // TODO code duplication with SortedList
            var _a = __WEBPACK_IMPORTED_MODULE_2__Array__["f" /* getSortedIndex */](this._keys, this._sort, key), found = _a.found, index_1 = _a.index;
            if (found) {
                throw new Error("Key already exists: " + key);
            }
            else {
                __WEBPACK_IMPORTED_MODULE_2__Array__["h" /* insertIndex */](this._keys, index_1, key);
            }
        }
        if (index == null) {
            this._groups[key].push(x);
        }
        else {
            __WEBPACK_IMPORTED_MODULE_2__Array__["h" /* insertIndex */](this._groups[key], index, x);
        }
    };
    /**
     * Removes an item from the list.
     *
     * @param {A} x Item to remove
     */
    ListGrouper.prototype._remove = function (x) {
        var key = this._getKey(x);
        var values = this._groups[key];
        if (values != null) {
            __WEBPACK_IMPORTED_MODULE_2__Array__["k" /* remove */](values, x);
            if (values.length === 0) {
                delete this._groups[key];
                var _a = __WEBPACK_IMPORTED_MODULE_2__Array__["f" /* getSortedIndex */](this._keys, this._sort, key), found = _a.found, index = _a.index;
                if (found) {
                    __WEBPACK_IMPORTED_MODULE_2__Array__["l" /* removeIndex */](this._keys, index);
                }
                else {
                    throw new Error("Key doesn't exist: " + key);
                }
            }
        }
    };
    /**
     * Returns an iterator for the list.
     *
     * The iterator will iterate through all items in all groups.
     *
     * @return {.Iterator<A>} Iterator
     */
    ListGrouper.prototype.iterator = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_3__Iterator__["flatten"](__WEBPACK_IMPORTED_MODULE_3__Iterator__["map"](__WEBPACK_IMPORTED_MODULE_3__Iterator__["fromArray"](this._keys), function (key) {
            return __WEBPACK_IMPORTED_MODULE_3__Iterator__["fromArray"](_this._groups[key]);
        }));
    };
    return ListGrouper;
}(__WEBPACK_IMPORTED_MODULE_0__Disposer__["c" /* MultiDisposer */]));

/**
 * A disposable list, which when disposed itself will call `dispose()` method
 * on all its items.
 */
var ListDisposer = /** @class */ (function (_super) {
    __extends(ListDisposer, _super);
    function ListDisposer(list) {
        var _this = this;
        var disposer = list.events.on("remove", function (x) {
            x.oldValue.dispose();
        });
        _this = _super.call(this, function () {
            disposer.dispose();
            // TODO clear the list ?
            __WEBPACK_IMPORTED_MODULE_3__Iterator__["each"](list.iterator(), function (x) {
                x.dispose();
            });
        }) || this;
        return _this;
    }
    return ListDisposer;
}(__WEBPACK_IMPORTED_MODULE_0__Disposer__["b" /* Disposer */]));

/**
 * Checks if specific index fits into length.
 *
 * @param {number}  index  Index
 * @param {number}  len    Length
 */
function checkBounds(index, len) {
    if (!(index >= 0 && index < len)) {
        throw new Error("Index out of bounds: " + index);
    }
}
/**
 * A List class is used to hold a number of indexed items of the same type.
 */
var List = /** @class */ (function () {
    /**
     * Constructor
     *
     * @param {Array<T>}  initial  Inital list of values to add to list
     */
    function List(initial) {
        if (initial === void 0) { initial = []; }
        this.events = new __WEBPACK_IMPORTED_MODULE_1__EventDispatcher__["a" /* EventDispatcher */]();
        this._values = initial;
    }
    Object.defineProperty(List.prototype, "values", {
        /**
         * An array of values in the list.
         *
         * Do not use this property to add values. Rather use dedicated methods, like
         * `push()`, `removeIndex()`, etc.
         *
         * @readonly
         * @return {Array<T>} List values
         */
        get: function () {
            return this._values;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if list contains specific item reference.
     *
     * @param  {T}        item  Item to search for
     * @return {boolean}        `true` if found, `false` if not found
     */
    List.prototype.contains = function (value) {
        return this._values.indexOf(value) !== -1;
    };
    /**
     * Removes specific item from the list.
     *
     * @param {T} item An item to remove
     */
    List.prototype.removeValue = function (value) {
        var index;
        while ((index = this.indexOf(value)) !== -1) {
            this.removeIndex(index);
        }
    };
    /**
     * Searches the list for specific item and returns its index.
     *
     * @param  {T}       item  An item to search for
     * @return {number}        Index or -1 if not found
     */
    List.prototype.indexOf = function (value) {
        return __WEBPACK_IMPORTED_MODULE_2__Array__["g" /* indexOf */](this._values, value);
    };
    Object.defineProperty(List.prototype, "length", {
        /**
         * Number of items in list.
         *
         * @readonly
         * @return {number} Number of items
         */
        get: function () {
            return this._values.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if there's a value at specific index.
     *
     * @param  {number}   index  Index
     * @return {boolean}         Value exists?
     */
    List.prototype.hasIndex = function (index) {
        return index >= 0 && index < this._values.length;
    };
    /**
     * Returns an item at specified index.
     *
     * @param  {number}  index  Index
     * @return {T}              List item
     */
    List.prototype.getIndex = function (index) {
        return this._values[index];
    };
    /**
     * Sets value at specific index.
     *
     * If there's already a value at the index, it is overwritten.
     *
     * @param  {number}  index  Index
     * @param  {T}       value  New value
     * @return {T}              New value
     */
    List.prototype.setIndex = function (index, value) {
        checkBounds(index, this._values.length);
        var oldValue = this._values[index];
        // Do nothing if the old value and the new value are the same
        if (oldValue !== value) {
            this._values[index] = value;
            if (this.events.isEnabled("setIndex")) {
                this.events.dispatchImmediately("setIndex", {
                    type: "setIndex",
                    target: this,
                    index: index,
                    oldValue: oldValue,
                    newValue: value
                });
            }
            if (this.events.isEnabled("remove")) {
                this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: this,
                    oldValue: oldValue
                });
            }
            if (this.events.isEnabled("insert")) {
                this.events.dispatchImmediately("insert", {
                    type: "insert",
                    target: this,
                    newValue: value
                });
            }
        }
        return oldValue;
    };
    /**
     * Adds an item to the list at a specific index, which pushes all the other
     * items further down the list.
     *
     * @param  {number} index Index
     * @param  {T}      item  An item to add
     */
    List.prototype.insertIndex = function (index, value) {
        checkBounds(index, this._values.length + 1);
        __WEBPACK_IMPORTED_MODULE_2__Array__["h" /* insertIndex */](this._values, index, value);
        if (this.events.isEnabled("insertIndex")) {
            this.events.dispatchImmediately("insertIndex", {
                type: "insertIndex",
                target: this,
                index: index,
                newValue: value
            });
        }
        if (this.events.isEnabled("insert")) {
            this.events.dispatchImmediately("insert", {
                type: "insert",
                target: this,
                newValue: value
            });
        }
    };
    /**
     * [_sortQuicksort description]
     *
     * @todo Description
     * @param {number}    low    [description]
     * @param {number}    high   [description]
     * @param {function}  order  [description]
     */
    List.prototype._sortQuicksort = function (low, high, order) {
        if (low < high) {
            var p = this._sortPartition(low, high, order);
            this._sortQuicksort(low, p, order);
            this._sortQuicksort(p + 1, high, order);
        }
    };
    /**
     * [_sortPartition description]
     *
     * @todo Description
     * @param  {number}    low    [description]
     * @param  {number}    high   [description]
     * @param  {function}  order  [description]
     * @return {number}           [description]
     */
    List.prototype._sortPartition = function (low, high, order) {
        var values = this._values;
        var pivot = values[low];
        var i = low - 1;
        var j = high + 1;
        for (;;) {
            do {
                ++i;
            } while (order(values[i], pivot) < 0);
            do {
                --j;
            } while (order(values[j], pivot) > 0);
            if (i >= j) {
                return j;
            }
            else {
                this.swap(i, j);
            }
        }
    };
    /**
     * Reorders list items according to specific ordering function.
     *
     * @param {T) => Ordering}  order  Ordering function
     */
    List.prototype.sort = function (order) {
        // https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme
        // @todo faster implementation of this
        // @todo test this
        this._sortQuicksort(0, this._values.length - 1, order);
    };
    /**
     * Swaps indexes of two items in the list.
     *
     * @param {number}  a  Item 1
     * @param {number}  b  Item 2
     */
    List.prototype.swap = function (a, b) {
        var len = this._values.length;
        checkBounds(a, len);
        checkBounds(b, len);
        if (a !== b) {
            var value_a = this._values[a];
            var value_b = this._values[b];
            this._values[a] = value_b;
            if (this.events.isEnabled("setIndex")) {
                this.events.dispatchImmediately("setIndex", {
                    type: "setIndex",
                    target: this,
                    index: a,
                    oldValue: value_a,
                    newValue: value_b
                });
            }
            this._values[b] = value_a;
            if (this.events.isEnabled("setIndex")) {
                this.events.dispatchImmediately("setIndex", {
                    type: "setIndex",
                    target: this,
                    index: b,
                    oldValue: value_b,
                    newValue: value_a
                });
            }
        }
    };
    /**
     * Removes a value at specific index.
     *
     * @param  {number}  index  Index of value to remove
     * @return {T}              Removed value
     */
    List.prototype.removeIndex = function (index) {
        checkBounds(index, this._values.length);
        var oldValue = this._values[index];
        __WEBPACK_IMPORTED_MODULE_2__Array__["l" /* removeIndex */](this._values, index);
        if (this.events.isEnabled("removeIndex")) {
            this.events.dispatchImmediately("removeIndex", {
                type: "removeIndex",
                target: this,
                index: index,
                oldValue: oldValue
            });
        }
        if (this.events.isEnabled("remove")) {
            this.events.dispatchImmediately("remove", {
                type: "remove",
                target: this,
                oldValue: oldValue
            });
        }
        return oldValue;
    };
    /**
     * Moves an item to a specific index within the list
     *
     * If the index is not specified it will move the item to the end of the
     * list.
     *
     * @param {T}       value  Item to move
     * @param {number}  index  Index to place item at
     */
    List.prototype.moveValue = function (value, toIndex) {
        // TODO don't do anything if the desired index is the same as the current index
        var index = this.indexOf(value);
        // TODO remove all old values rather than only the first ?
        if (index !== -1) {
            var oldValue = this._values[index];
            __WEBPACK_IMPORTED_MODULE_2__Array__["l" /* removeIndex */](this._values, index);
            if (this.events.isEnabled("removeIndex")) {
                this.events.dispatchImmediately("removeIndex", {
                    type: "removeIndex",
                    target: this,
                    index: index,
                    oldValue: oldValue
                });
            }
        }
        if (toIndex == null) {
            toIndex = this._values.length;
            this._values.push(value);
        }
        else {
            __WEBPACK_IMPORTED_MODULE_2__Array__["h" /* insertIndex */](this._values, toIndex, value);
        }
        if (this.events.isEnabled("insertIndex")) {
            this.events.dispatchImmediately("insertIndex", {
                type: "insertIndex",
                target: this,
                index: toIndex,
                newValue: value
            });
        }
        if (index === -1) {
            if (this.events.isEnabled("insert")) {
                this.events.dispatchImmediately("insert", {
                    type: "insert",
                    target: this,
                    newValue: value
                });
            }
        }
    };
    /**
     * Adds an item to the end of the list.
     *
     * @param  {T}  item  An item to add
     */
    List.prototype.push = function (value) {
        var index = this._values.push(value) - 1;
        if (this.events.isEnabled("insertIndex")) {
            this.events.dispatchImmediately("insertIndex", {
                type: "insertIndex",
                target: this,
                index: index,
                newValue: value
            });
        }
        if (this.events.isEnabled("insert")) {
            this.events.dispatchImmediately("insert", {
                type: "insert",
                target: this,
                newValue: value
            });
        }
        return value;
    };
    /**
     * Adds an item as a first item in the list.
     *
     * @param  {T}  item  An item to add
     */
    List.prototype.unshift = function (value) {
        return this.insertIndex(0, value);
    };
    /**
     * Adds multiple items to the list.
     *
     * @param {Array<T>}  items  An Array of items to add
     */
    List.prototype.pushAll = function (values) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_2__Array__["b" /* each */](values, function (value) {
            _this.push(value);
        });
    };
    /**
     * Copies and adds items from abother list.
     *
     * @param {List<T>}  source  A list top copy items from
     */
    List.prototype.copyFrom = function (source) {
        this.pushAll(source._values);
    };
    /**
     * Returns the last item from the list, and removes it.
     *
     * @return {T} Item
     */
    List.prototype.pop = function () {
        var index = this._values.length - 1;
        return index < 0 ? undefined : this.removeIndex(this._values.length - 1);
    };
    /**
     * Returns the first item from the list, and removes it.
     *
     * @return {T} Item
     */
    List.prototype.shift = function () {
        return this._values.length ? this.removeIndex(0) : undefined;
    };
    /**
     * Sets multiple items to the list.
     *
     * All current items are removed.
     *
     * @param {Array<T>}  newArray  New items
     */
    List.prototype.setAll = function (newArray) {
        var _this = this;
        // @tod if a value exists in both the new and old arrays, don't send remove/insert events
        var oldArray = __WEBPACK_IMPORTED_MODULE_2__Array__["a" /* copy */](this._values);
        this._values.length = 0;
        __WEBPACK_IMPORTED_MODULE_2__Array__["b" /* each */](newArray, function (value) {
            _this._values.push(value);
        });
        if (this.events.isEnabled("setAll")) {
            this.events.dispatchImmediately("setAll", {
                type: "setAll",
                target: this,
                oldArray: oldArray,
                newArray: this._values // TODO make a copy ?
            });
        }
        if (this.events.isEnabled("remove")) {
            __WEBPACK_IMPORTED_MODULE_2__Array__["b" /* each */](oldArray, function (x) {
                _this.events.dispatchImmediately("remove", {
                    type: "remove",
                    target: _this,
                    oldValue: x
                });
            });
        }
        if (this.events.isEnabled("insert")) {
            __WEBPACK_IMPORTED_MODULE_2__Array__["b" /* each */](this._values, function (x) {
                _this.events.dispatchImmediately("insert", {
                    type: "insert",
                    target: _this,
                    newValue: x
                });
            });
        }
    };
    /**
     * Removes all items from the list.
     */
    List.prototype.clear = function () {
        this.setAll([]);
    };
    /**
     * Returns a list iterator.
     *
     * @return {Iterator} Iterator
     */
    List.prototype.iterator = function () {
        return __WEBPACK_IMPORTED_MODULE_3__Iterator__["fromArray"](this._values);
    };
    /**
     * Returns a specific range of list items, which can be iterated.
     *
     * @ignore Exclude from docs
     * @todo Code duplication with IndexedIterable
     * @param  {number}              start  Start index
     * @param  {number}              end    End index
     * @return {IndexedIterable<T>}         Range
     */
    List.prototype.range = function (start, end) {
        if (start <= end) {
            var diff = end - start;
            start = Math.max(start, 0);
            end = Math.min(start + diff, this._values.length);
            return new IndexedIterable(this._values, start, end);
        }
        else {
            throw new Error("Start index must be lower than end index");
        }
    };
    /**
     * Returns an iterator that has list items sorted backwards.
     *
     * @ignore Exclude from docs
     * @return {IndexedIterable<T>} List
     */
    List.prototype.backwards = function () {
        return new IndexedIterable(this._values, this._values.length, 0);
    };
    return List;
}());

/**
 * A version of a [[List]] that has a "template".
 *
 * A template is an instance of an object, that can be used to create new
 * elements in the list without actually needing to create instances for those.
 *
 * When new element is created in the list, e.g. by calling its `create()`
 * method, an exact copy of the element is created (including properties and
 * other attributes), inserted into the list and returned.
 */
var ListTemplate = /** @class */ (function (_super) {
    __extends(ListTemplate, _super);
    /**
     * Constructor
     *
     * @param {T} t Template object
     */
    function ListTemplate(t) {
        var _this = _super.call(this) || this;
        _this.template = t;
        return _this;
    }
    Object.defineProperty(ListTemplate.prototype, "template", {
        /**
         * @return {T} Template object
         */
        get: function () {
            return this._template;
        },
        /**
         * A "template" object to copy all properties from when creating new list
         * items.
         *
         * @param {T}  v  Template object
         */
        set: function (v) {
            v.isTemplate = true;
            this._template = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies all elements from other list.
     *
     * @param {ListTemplate}  source  Source list
     */
    ListTemplate.prototype.copyFrom = function (source) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_3__Iterator__["each"](source.iterator(), function (value) {
            _this.push(value.clone());
        });
    };
    ListTemplate.prototype.create = function (make) {
        var clone = (make != null
            ? new make()
            : this.template.clone());
        this.push(clone);
        return clone;
    };
    /**
     * Creates an exact clone of the list, including its items and template.
     *
     * @return {ListTemplate<T>} New list
     */
    ListTemplate.prototype.clone = function () {
        var out = new ListTemplate(this.template);
        var values = this.values;
        var length = values.length;
        for (var i = 0; i < length; ++i) {
            out.push(values[i].clone());
        }
        return out;
    };
    return ListTemplate;
}(List));

//# sourceMappingURL=List.js.map

/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["copyProperties"] = copyProperties;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["empty"] = empty;
/* harmony export (immutable) */ __webpack_exports__["relativeToValue"] = relativeToValue;
/* harmony export (immutable) */ __webpack_exports__["relativeRadiusToValue"] = relativeRadiusToValue;
/* harmony export (immutable) */ __webpack_exports__["valueToRelative"] = valueToRelative;
/* harmony export (immutable) */ __webpack_exports__["camelToDashed"] = camelToDashed;
/* harmony export (immutable) */ __webpack_exports__["capitalize"] = capitalize;
/* harmony export (immutable) */ __webpack_exports__["stringify"] = stringify;
/* harmony export (immutable) */ __webpack_exports__["splitTextByCharCount"] = splitTextByCharCount;
/* harmony export (immutable) */ __webpack_exports__["truncateWithEllipsis"] = truncateWithEllipsis;
/* harmony export (immutable) */ __webpack_exports__["trim"] = trim;
/* harmony export (immutable) */ __webpack_exports__["rtrim"] = rtrim;
/* harmony export (immutable) */ __webpack_exports__["ltrim"] = ltrim;
/* harmony export (immutable) */ __webpack_exports__["reverseString"] = reverseString;
/* harmony export (immutable) */ __webpack_exports__["unquote"] = unquote;
/* harmony export (immutable) */ __webpack_exports__["padString"] = padString;
/* harmony export (immutable) */ __webpack_exports__["getFormat"] = getFormat;
/* harmony export (immutable) */ __webpack_exports__["cleanFormat"] = cleanFormat;
/* harmony export (immutable) */ __webpack_exports__["stripTags"] = stripTags;
/* harmony export (immutable) */ __webpack_exports__["plainText"] = plainText;
/* harmony export (immutable) */ __webpack_exports__["numberToString"] = numberToString;
/* harmony export (immutable) */ __webpack_exports__["anyToDate"] = anyToDate;
/* harmony export (immutable) */ __webpack_exports__["anyToNumber"] = anyToNumber;
/* harmony export (immutable) */ __webpack_exports__["getYearDay"] = getYearDay;
/* harmony export (immutable) */ __webpack_exports__["getWeek"] = getWeek;
/* harmony export (immutable) */ __webpack_exports__["getMonthWeek"] = getMonthWeek;
/* harmony export (immutable) */ __webpack_exports__["getDayFromWeek"] = getDayFromWeek;
/* harmony export (immutable) */ __webpack_exports__["get12Hours"] = get12Hours;
/* harmony export (immutable) */ __webpack_exports__["getTimeZone"] = getTimeZone;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (immutable) */ __webpack_exports__["fitNumber"] = fitNumber;
/* harmony export (immutable) */ __webpack_exports__["fitNumberRelative"] = fitNumberRelative;
/* harmony export (immutable) */ __webpack_exports__["svgPointToSprite"] = svgPointToSprite;
/* harmony export (immutable) */ __webpack_exports__["spritePointToSvg"] = spritePointToSvg;
/* harmony export (immutable) */ __webpack_exports__["spritePointToSprite"] = spritePointToSprite;
/* harmony export (immutable) */ __webpack_exports__["svgRectToSprite"] = svgRectToSprite;
/* harmony export (immutable) */ __webpack_exports__["spriteRectToSvg"] = spriteRectToSvg;
/* harmony export (immutable) */ __webpack_exports__["documentPointToSvg"] = documentPointToSvg;
/* harmony export (immutable) */ __webpack_exports__["svgPointToDocument"] = svgPointToDocument;
/* harmony export (immutable) */ __webpack_exports__["documentPointToSprite"] = documentPointToSprite;
/* harmony export (immutable) */ __webpack_exports__["spritePointToDocument"] = spritePointToDocument;
/* harmony export (immutable) */ __webpack_exports__["width"] = width;
/* harmony export (immutable) */ __webpack_exports__["height"] = height;
/* harmony export (immutable) */ __webpack_exports__["decimalPlaces"] = decimalPlaces;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Percent__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_Math__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_Type__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__String__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Strings__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Object__ = __webpack_require__(10);
/**
 * A collection of universal utility functions.
 */






/**
 * ============================================================================
 * MISC FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Copies all properties of one object to the other, omitting undefined.
 *
 * @param  {Object}   fromObject  Source object
 * @param  {Object}   toObject    Target object
 * @return {Object}               Updated target object
 * @todo Maybe consolidate with utils.copy?
 */
function copyProperties(source, target) {
    __WEBPACK_IMPORTED_MODULE_5__Object__["each"](source, function (key, value) {
        // only if value is set		
        if (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["hasValue"](value)) {
            target[key] = value;
        }
    });
    return target;
}
/**
 * Copies all properties of one object to the other.
 *
 * @param  {Object}  source     Source object
 * @param  {Object}  recipient  Target object
 * @return {Object}             Updated target object
 */
function copy(source, target) {
    __WEBPACK_IMPORTED_MODULE_5__Object__["each"](source, function (key, value) {
        target[key] = value;
    });
    return target;
}
/**
 * Checks if value is not empty (undefined or zero-length string).
 *
 * @param  {any}      value  Value to check
 * @return {boolean}         `true` if value is "empty"
 */
function empty(value) {
    return !__WEBPACK_IMPORTED_MODULE_2__utils_Type__["hasValue"](value) || (value.toString() === "");
}
/**
 * [relativeToValue description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {$type.Optional<number | Percent>}  percent  [description]
 * @param  {number}                            full     [description]
 * @return {number}                                     [description]
 */
function relativeToValue(percent, full) {
    if (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](percent)) {
        return percent;
    }
    else if (percent != null && __WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](percent.value)) {
        return full * percent.value;
    }
    else {
        return 0;
    }
}
/**
 * [relativeRadiusToValue description]
 *
 * Differs from relativeToValue so that if a value is negative, it subtracts
 * it from full value.
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {$type.Optional<number | Percent>}  percent             [description]
 * @param  {number}                            full                [description]
 * @param  {boolean}                           subtractIfNegative  [description]
 * @return {number}                                                [description]
 */
function relativeRadiusToValue(percent, full, subtractIfNegative) {
    var value;
    if (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](percent)) {
        value = percent;
        if (value < 0) {
            if (subtractIfNegative) {
                value = full + value;
            }
            else {
                value = full - value;
            }
        }
    }
    else if (percent != null && __WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](percent.value)) {
        value = full * percent.value;
    }
    return value;
}
/**
 * [valueToRelative description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {number | Percent}  value  [description]
 * @param  {number}            full   [description]
 * @return {number}                   [description]
 */
function valueToRelative(value, full) {
    if (value instanceof __WEBPACK_IMPORTED_MODULE_0__Percent__["a" /* Percent */]) {
        return value.value;
    }
    else {
        return value / full;
    }
}
/**
 * ============================================================================
 * STRING FORMATTING FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Converts camelCased text to dashed version:
 * ("thisIsString" > "this-is-string")
 *
 * @param  {string}  str  Input
 * @return {string}       Output
 */
function camelToDashed(str) {
    return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}
/**
 * Converts tring to uppercase.
 *
 * @param  {string}  str  String to convert
 * @return {string}       uppercased string
 * @todo Maybe make it better
 */
function capitalize(str) {
    var arr = str.split("");
    arr[0] = arr[0].toUpperCase();
    return arr.join("");
}
/**
 * Converts any value into its string representation.
 *
 * @param  {any}     value  Value
 * @return {string}         String represantation of the value
 */
function stringify(value) {
    return JSON.stringify(value);
}
/**
 * Splits the text into multiple lines, respecting maximum character count.
 * Prioretizes splitting on spaces and punctuation. Falls back on splitting
 * mid-word if there's no other option.
 *
 * @param  {string}    text      Text
 * @param  {number}    maxChars  Maximum number of characters per line
 * @return {string[]}            An array of split text
 */
function splitTextByCharCount(text, maxChars, fullWords, rtl) {
    // Maybe the text fits?
    if (text.length <= maxChars) {
        return [text];
    }
    // Init result
    var res = [];
    // Split by spacing
    var currentIndex = -1;
    var words = text.split(/[\s]+/);
    //let prefix: string = "";
    /*if (rtl) {
        words.reverse();
    }*/
    //console.log(words);
    // Process each word
    for (var i = 0; i < words.length; i++) {
        // Get word and symbol count
        var word = words[i];
        var wordLength = word.length;
        // Ignore empty words
        if (wordLength === 0) {
            continue;
        }
        // Append space
        if (i < (words.length - 1)) {
            if (rtl) {
                word = " " + word;
            }
            else {
                word += " ";
            }
        }
        // Check word length
        if ((wordLength > maxChars) && fullWords !== true) {
            // A single word is longer than allowed symbol count
            // Break it up
            if (rtl) {
                word = reverseString(word);
            }
            var parts = word.match(new RegExp(".{1," + maxChars + "}", "g"));
            // TODO is this correct ?
            if (parts) {
                if (rtl) {
                    for (var x = 0; x < parts.length; x++) {
                        parts[x] = reverseString(parts[x]);
                    }
                    //parts.reverse();
                }
                res = res.concat(parts);
            }
        }
        else {
            // Init current line
            if (currentIndex === -1) {
                res.push("");
                currentIndex = 0;
            }
            // Check if we need to break into another line
            if (((res[currentIndex].length + wordLength + 1) > maxChars) && res[currentIndex] !== "") {
                res.push("");
                currentIndex++;
            }
            // Add word
            res[currentIndex] += word;
        }
        // Update index
        currentIndex = res.length - 1;
    }
    //console.log(res);
    /*if (rtl) {
        res.reverse();
    }*/
    // Do we have only one word that does not fit?
    // Since fullWords is set and we can't split the word, we end up with empty
    // set.
    if (res.length == 1 && fullWords && (res[0].length > maxChars)) {
        res = [];
    }
    return res;
}
/**
 * Truncates the text to certain character count.
 *
 * Will add ellipsis if the string is truncated. Optionally, can truncate on full words only.
 *
 * For RTL support, pass in the fifth parameter as `true`.
 *
 * @param  {string}   text       Input text
 * @param  {number}   maxChars   Maximum character count of output
 * @param  {string}   ellipsis   Ellipsis string, i.e. "..."
 * @param  {boolean}  fullWords  If `true`, will not break mid-word, unless there's a single word and it does not with into `maxChars`
 * @param  {boolean}  rtl        Is this an RTL text?
 * @return {string}              Truncated text
 */
function truncateWithEllipsis(text, maxChars, ellipsis, fullWords, rtl) {
    if (text.length <= maxChars) {
        return text;
    }
    // Calc max chars
    maxChars -= ellipsis.length;
    if (maxChars < 1) {
        maxChars = 1;
        //ellipsis = "";
    }
    // Get lines
    var lines = splitTextByCharCount(text, maxChars, fullWords, rtl);
    // Use first line
    return lines[0] + ellipsis;
}
/**
 * Removes whitespace from beginning and end of the string.
 *
 * @param  {string}  str  Input
 * @return {string}       Output
 */
function trim(str) {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
;
/**
 * Removes whitespace from end of the string.
 *
 * @param  {string}  str  Input
 * @return {string}       Output
 */
function rtrim(str) {
    return str.replace(/[\s\uFEFF\xA0]+$/g, "");
}
;
/**
 * Removes whitespace from beginning of the string.
 *
 * @param  {string}  str  Input
 * @return {string}       Output
 */
function ltrim(str) {
    return str.replace(/^[\s\uFEFF\xA0]+/g, "");
}
;
/**
 * Reverses string.
 *
 * @param  {string}  str  Input
 * @return {string}       Output
 */
function reverseString(str) {
    return str.split("").reverse().join("");
}
/**
 * Removes quotes from the string.
 *
 * @param  {string}  str  Input
 * @return {string}       Output
 */
function unquote(str) {
    var res = str.trim();
    res = str.replace(/^'(.*)'$/, "$1");
    if (res == str) {
        res = str.replace(/^"(.*)"$/, "$1");
    }
    return res;
}
/**
 * Pads a string with additional characters to certain length.
 *
 * @param  {any}            value  A numeric value
 * @param  {number = 0}     len    Result string length in characters
 * @param  {string = "0"}   char   A character to use for padding
 * @return {string}                Padded value as string
 */
function padString(value, len, char) {
    if (len === void 0) { len = 0; }
    if (char === void 0) { char = "0"; }
    if (typeof value !== "string")
        value = value.toString();
    return len > value.length ? Array(len - value.length + 1).join(char) + value : value;
}
/**
 * Tries to determine format type.
 *
 * @ignore Exclude from docs
 * @param {string}   format  Format string
 * @return {string}          Format type ("string" | "number" | "date" | "duration")
 */
function getFormat(format) {
    // Undefined?
    if (typeof format === "undefined")
        return __WEBPACK_IMPORTED_MODULE_4__Strings__["m" /* STRING */];
    // Cleanup and lowercase format
    format = format.toLowerCase().replace(/^\[[^\]]*\]/, "");
    // Remove style tags
    format = format.replace(/\[[^\]]+\]/, "");
    // Trim
    format = format.trim();
    // Check for any explicit format hints (i.e. /Date)
    var hints = format.match(/\/(date|number|duration)$/);
    if (hints) {
        return hints[1];
    }
    // Check for explicit hints
    if (format === __WEBPACK_IMPORTED_MODULE_4__Strings__["c" /* NUMBER */]) {
        return __WEBPACK_IMPORTED_MODULE_4__Strings__["c" /* NUMBER */];
    }
    if (format === __WEBPACK_IMPORTED_MODULE_4__Strings__["a" /* DATE */]) {
        return __WEBPACK_IMPORTED_MODULE_4__Strings__["a" /* DATE */];
    }
    if (format === __WEBPACK_IMPORTED_MODULE_4__Strings__["b" /* DURATION */]) {
        return __WEBPACK_IMPORTED_MODULE_4__Strings__["b" /* DURATION */];
    }
    // Detect number formatting symbols
    if (format.match(/[#0]/)) {
        return __WEBPACK_IMPORTED_MODULE_4__Strings__["c" /* NUMBER */];
    }
    // Detect date formatting symbols
    if (format.match(/[ymwdhnsqaxkzgtei]/)) {
        return __WEBPACK_IMPORTED_MODULE_4__Strings__["a" /* DATE */];
    }
    // Nothing? Let's display as string
    return __WEBPACK_IMPORTED_MODULE_4__Strings__["m" /* STRING */];
}
/**
 * Cleans up format:
 * * Strips out formatter hints
 *
 * @ignore Exclude from docs
 * @param  {string}  format  Format
 * @return {string}          Cleaned format
 */
function cleanFormat(format) {
    return format.replace(/\/(date|number|duration)$/i, "");
}
/**
 * Strips all tags from the string.
 *
 * @param  {string}  text  Source string
 * @return {string}        String without tags
 */
function stripTags(text) {
    return text ? text.replace(/<[^>]*>/g, "") : text;
}
/**
 * Removes new lines and tags from a string.
 *
 * @param  {string}  text  String to conver
 * @return {string}        Converted string
 */
function plainText(text) {
    return text ? stripTags(text.replace(/[\n\r]+/g, ". ")) : text;
}
/**
 * ============================================================================
 * TYPE CONVERSION FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Converts numeric value into string. Deals with large or small numbers that
 * would otherwise use exponents.
 *
 * @param  {number}  value  Numeric value
 * @return {string}         Numeric value as string
 */
function numberToString(value) {
    // TODO handle Infinity and -Infinity
    if (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNaN"](value)) {
        return "NaN";
    }
    if (value === Infinity) {
        return "Infinity";
    }
    if (value === -Infinity) {
        return "-Infinity";
    }
    // Negative 0
    if ((value === 0) && (1 / value === -Infinity)) {
        return "-0";
    }
    // Preserve negative and deal with absoute values
    var negative = value < 0;
    value = Math.abs(value);
    // TODO test this
    var parsed = __WEBPACK_IMPORTED_MODULE_2__utils_Type__["getValue"](/^([0-9]+)(?:\.([0-9]+))?(?:e[\+\-]([0-9]+))?$/.exec("" + value));
    var digits = parsed[1];
    var decimals = parsed[2] || "";
    var res;
    // Leave the nummber as it is if it does not use exponents
    if (parsed[3] == null) {
        res = (decimals === "" ? digits : digits + "." + decimals);
    }
    else {
        var exponent = +parsed[3];
        // Deal with decimals
        if (value < 1) {
            var zeros = exponent - 1;
            res = "0." + __WEBPACK_IMPORTED_MODULE_3__String__["repeat"]("0", zeros) + digits + decimals;
            // Deal with integers
        }
        else {
            var zeros = exponent - decimals.length;
            if (zeros === 0) {
                res = digits + decimals;
            }
            else if (zeros < 0) {
                res = digits + decimals.slice(0, zeros) + "." + decimals.slice(zeros);
            }
            else {
                res = digits + decimals + __WEBPACK_IMPORTED_MODULE_3__String__["repeat"]("0", zeros);
            }
        }
    }
    return negative ? "-" + res : res;
}
/**
 * Converts anything to Date object.
 *
 * @param  {Date | number | string}  value  A value of any type
 * @return {Date}                           Date object representing a value
 */
function anyToDate(value) {
    if (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isDate"](value)) {
        // TODO maybe don't create a new Date ?
        return new Date(value);
    }
    else if (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](value)) {
        return new Date(value);
    }
    else {
        // Try converting to number (assuming timestamp)
        var num = Number(value);
        if (!__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](num)) {
            return new Date(value);
        }
        else {
            return new Date(num);
        }
    }
}
/**
 * Tries converting any value to a number.
 *
 * @param  {any}     value  Source value
 * @return {number}         Number
 */
function anyToNumber(value) {
    if (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isDate"](value)) {
        return value.getTime();
    }
    else if (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](value)) {
        return value;
    }
    else if (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isString"](value)) {
        // Try converting to number (assuming timestamp)
        var num = Number(value);
        if (!__WEBPACK_IMPORTED_MODULE_2__utils_Type__["isNumber"](num)) {
            // Failing
            return undefined;
        }
        else {
            return num;
        }
    }
}
/**
 * ============================================================================
 * DATE-RELATED FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Returns a year day.
 *
 * @param  {Date}     date  Date
 * @param  {boolean}  utc   Assume UTC dates?
 * @return {number}         Year day
 * @todo Account for UTC
 */
function getYearDay(date, utc) {
    if (utc === void 0) { utc = false; }
    var first = new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
    return Math.floor((date.getTime() - first.getTime()) / 86400000) + 1;
}
/**
 * Returns week number for a given date.
 *
 * @param  {Date}     date  Date
 * @param  {boolean}  utc   Assume UTC dates?
 * @return {number}         Week number
 * @todo Account for UTC
 */
function getWeek(date, utc) {
    if (utc === void 0) { utc = false; }
    var day = getYearDay(date, utc) - 1;
    var week = Math.floor((day - (date.getDay() || 7) + 10) / 7);
    if (week === 0) {
        week = 53;
    }
    else if (week === 53) {
        week = 1;
    }
    return week;
}
/**
 * Returns a week number in the month.
 *
 * @param  {Date}     date  Source Date
 * @param  {boolean}  utc   Assume UTC dates?
 * @return {number}         Week number in month
 */
function getMonthWeek(date, utc) {
    if (utc === void 0) { utc = false; }
    var firstWeek = getWeek(new Date(date.getFullYear(), date.getMonth(), 1), utc);
    var currentWeek = getWeek(date, utc);
    if (currentWeek == 1) {
        currentWeek = 53;
    }
    return currentWeek - firstWeek + 1;
}
/**
 * Returns a year day out of the given week number.
 *
 * @param  {number}   week     Week
 * @param  {number}   year     Year
 * @param  {number}   weekday  Weekday
 * @param  {boolean}  utc      Assume UTC dates
 * @return {number}            Day in a year
 */
function getDayFromWeek(week, year, weekday, utc) {
    if (weekday === void 0) { weekday = 1; }
    if (utc === void 0) { utc = false; }
    var date = new Date(year, 0, 4, 0, 0, 0, 0);
    if (utc) {
        date.setUTCFullYear(year);
    }
    var day = week * 7 + weekday - ((date.getDay() || 7) + 3);
    return day;
}
/**
 * Returns 12-hour representation out of the 24-hour hours.
 *
 * @param  {number}  hours  24-hour number
 * @return {number}         12-hour number
 */
function get12Hours(hours, base) {
    if (hours > 12) {
        hours -= 12;
    }
    else if (hours === 0) {
        hours = 12;
    }
    return __WEBPACK_IMPORTED_MODULE_2__utils_Type__["hasValue"](base) ? hours + (base - 1) : hours;
}
/**
 * Returns a string name of the tome zone.
 *
 * @param  {Date}     date     Date object
 * @param  {boolean}  long     Should return long ("Pacific Standard Time") or short abbreviation ("PST")
 * @param  {boolean}  savings  Include information if it's in daylight savings mode
 * @return {string}            Time zone name
 */
function getTimeZone(date, long, savings) {
    if (long === void 0) { long = false; }
    if (savings === void 0) { savings = false; }
    var wotz = date.toLocaleString("UTC");
    var wtz = date.toLocaleString("UTC", { timeZoneName: long ? "long" : "short" }).substr(wotz.length);
    //wtz = wtz.replace(/[+-]+[0-9]+$/, "");
    if (savings === false) {
        wtz = wtz.replace(/ (standard|daylight|summer|winter) /i, " ");
    }
    return wtz;
}
/**
 * ============================================================================
 * NUMBER-RELATED FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Returns a random number between `from` and `to`.
 *
 * @param  {number}  from  From number
 * @param  {number}  to    To number
 * @return {number}        Random number
 */
function random(from, to) {
    return Math.floor(Math.random() * to) + from;
}
/**
 * Fits the number into specific `min` and `max` bounds.
 *
 * @param  {number}  value  Input value
 * @param  {number}  min    Minimum value
 * @param  {number}  max    Maximum value
 * @return {number}         Possibly adjusted value
 */
function fitNumber(value, min, max) {
    if (value > max) {
        return max;
    }
    else if (value < min) {
        return min;
    }
    return value;
}
/**
 * Fits the number into specific `min` and `max` bounds.
 *
 * If the value is does not fit withing specified range, it "wraps" around the
 * values.
 *
 * For example, if we have input value 10 with min set at 1 and max set at 8,
 * the value will not fit. The remainder that does not fit (2) will be added
 * to `min`, resulting in 3.
 *
 * The output of regular `fitNumber()` would return 8 instead.
 *
 * @param  {number}  value  Input value
 * @param  {number}  min    Minimum value
 * @param  {number}  max    Maximum value
 * @return {number}         Possibly adjusted value
 */
function fitNumberRelative(value, min, max) {
    var gap = max - min;
    if (value > max) {
        value = min + (value - gap * Math.floor(value / gap));
    }
    else if (value < min) {
        value = min + (value - gap * Math.floor(value / gap));
    }
    return value;
}
/**
 * ============================================================================
 * SPRITE-RELATED FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Converts SVG element coordinates to coordinates within specific [[Sprite]].
 *
 * @param  {IPoint}  point   SVG coordinates
 * @param  {Sprite}  sprite  Sprite
 * @return {IPoint}         Sprite coordinates
 */
function svgPointToSprite(point, sprite) {
    var x = point.x;
    var y = point.y;
    var sprites = [];
    while (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["hasValue"](sprite.parent)) {
        sprites.push(sprite);
        sprite = sprite.parent;
    }
    sprites.reverse();
    for (var i = 0; i < sprites.length; i++) {
        var sprite_1 = sprites[i];
        var angle = sprite_1.rotation;
        var relativeX = x - sprite_1.pixelX;
        var relativeY = y - sprite_1.pixelY;
        if (sprite_1.dx) {
            x -= sprite_1.dx;
        }
        if (sprite_1.dy) {
            y -= sprite_1.dy;
        }
        x = (__WEBPACK_IMPORTED_MODULE_1__utils_Math__["cos"](-angle) * relativeX - __WEBPACK_IMPORTED_MODULE_1__utils_Math__["sin"](-angle) * relativeY) / sprite_1.scale - sprite_1.pixelPaddingLeft;
        y = (__WEBPACK_IMPORTED_MODULE_1__utils_Math__["cos"](-angle) * relativeY + __WEBPACK_IMPORTED_MODULE_1__utils_Math__["sin"](-angle) * relativeX) / sprite_1.scale - sprite_1.pixelPaddingTop;
    }
    return { x: x, y: y };
}
/**
 * Converts coordinates within [[Sprite]] to coordinates relative to the whole
 * SVG element.
 *
 * @param  {IPoint}  point   Sprite coordinates
 * @param  {Sprite}  sprite  Sprite
 * @return {IPoint}          SVG coordinates
 */
function spritePointToSvg(point, sprite) {
    var x = point.x;
    var y = point.y;
    while (__WEBPACK_IMPORTED_MODULE_2__utils_Type__["hasValue"](sprite.parent)) {
        var angle = sprite.rotation;
        x += sprite.pixelPaddingLeft;
        y += sprite.pixelPaddingTop;
        if (sprite.dx) {
            x += sprite.dx;
        }
        if (sprite.dy) {
            y += sprite.dy;
        }
        var relativeX = sprite.pixelX + ((x * __WEBPACK_IMPORTED_MODULE_1__utils_Math__["cos"](angle) - y * __WEBPACK_IMPORTED_MODULE_1__utils_Math__["sin"](angle))) * sprite.scale;
        var relativeY = sprite.pixelY + ((x * __WEBPACK_IMPORTED_MODULE_1__utils_Math__["sin"](angle) + y * __WEBPACK_IMPORTED_MODULE_1__utils_Math__["cos"](angle))) * sprite.scale;
        x = relativeX;
        y = relativeY;
        sprite = sprite.parent;
    }
    return { x: x, y: y };
}
/**
 * Converts coordinates of one sprite to another.
 *
 * @param  {IPoint}  point   Sprite coordinates
 * @param  {Sprite}  sprite  Sprite
 * @param  {Sprite}  toSprite  Sprite
 * @return {IPoint}  converted coordinates
 */
function spritePointToSprite(point, sprite, toSprite) {
    return svgPointToSprite(spritePointToSvg(point, sprite), toSprite);
}
/**
 * Converts a rectangle expressed in SVG element coordinates to coordinates
 * within specific [[Sprite]].
 *
 * @param  {IRectangle}  rect    SVG rectangle
 * @param  {Sprite}      sprite  Sprite
 * @return {IRectangle}          Sprite rectangle
 */
function svgRectToSprite(rect, sprite) {
    var p1 = svgPointToSprite(rect, sprite);
    var p2 = svgPointToSprite({ x: rect.x + rect.width, y: rect.y + rect.height }, sprite);
    return { x: p1.x, y: p1.y, width: p2.x - p1.x, height: p2.y - p1.y };
}
/**
 * Converts a rectangle expressed in [[Sprite]] coordinates to SVG coordinates.
 *
 * @param  {IRectangle}  rect    Sprite rectangle
 * @param  {Sprite}      sprite  Sprite
 * @return {IRectangle}          SVG rectangle
 */
function spriteRectToSvg(rect, sprite) {
    var p1 = spritePointToSvg(rect, sprite);
    var p2 = spritePointToSvg({ x: rect.x + rect.width, y: rect.y + rect.height }, sprite);
    return { x: p1.x, y: p1.y, width: p2.x - p1.x, height: p2.y - p1.y };
}
/**
 * Converts global document-wide coordinates to coordinates within SVG element.
 *
 * @param  {IPoint}       point         Global coordinates
 * @param  {HTMLElement}  svgContainer  SVG element
 * @return {IPoint}                     SVG coordinates
 */
function documentPointToSvg(point, svgContainer) {
    var bbox = svgContainer.getBoundingClientRect();
    return {
        "x": point.x - bbox.left,
        "y": point.y - bbox.top
    };
}
/**
 * Converts SVG coordinates to global document-wide coordinates.
 *
 * @param  {IPoint}       point         SVG coordinates
 * @param  {HTMLElement}  svgContainer  SVG element
 * @return {IPoint}                     Global coordinates
 */
function svgPointToDocument(point, svgContainer) {
    var bbox = svgContainer.getBoundingClientRect();
    return {
        "x": point.x + bbox.left,
        "y": point.y + bbox.top
    };
}
/**
 * Converts document-wide global coordinates to coordinates within specific
 * [[Sprite]].
 *
 * @param  {IPoint}  point   Global coordinates
 * @param  {Sprite}  sprite  Sprite
 * @return {IPoint}          Sprite coordinates
 */
function documentPointToSprite(point, sprite) {
    var svgPoint = documentPointToSvg(point, sprite.htmlContainer);
    return svgPointToSprite(svgPoint, sprite);
}
/**
 * Converts coordinates within [[Sprite]] to global document coordinates.
 *
 * @param  {IPoint}  point   Sprite coordinates
 * @param  {Sprite}  sprite  Sprite
 * @return {IPoint}          Global coordinates
 */
function spritePointToDocument(point, sprite) {
    var svgPoint = spritePointToSvg(point, sprite);
    return svgPointToDocument(svgPoint, sprite.htmlContainer);
}
/**
 * ============================================================================
 * DEPRECATED FUNCTIONS
 * @todo Review and remove
 * ============================================================================
 * @hidden
 */
/**
 * Returns element's width.
 *
 * @ignore Exclude from docs
 * @param  {HTMLElement}  element  Element
 * @return {number}                Width (px)
 * @deprecated Not used anywhere
 */
function width(element) {
    return element.clientWidth;
}
/**
 * Returns element's height.
 *
 * @ignore Exclude from docs
 * @param  {HTMLElement}  element  Element
 * @return {number}                Height (px)
 * @deprecated Not used anywhere
 */
function height(element) {
    return element.clientHeight;
}
/**
 * Returns number of decimals
 *
 * @ignore Exclude from docs
 * @param  {number}  number  Input number
 * @return {number}          Number of decimals
 */
function decimalPlaces(number) {
    var match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) {
        return 0;
    }
    return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
}
//# sourceMappingURL=Utils.js.map

/***/ })

/******/ });