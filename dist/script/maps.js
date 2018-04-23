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
 
webpackJsonp([5],{

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MapSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__series_Series__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Type__ = __webpack_require__(2);
/**
 * Map series module
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
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapSeries]].
 *
 * @see {@link DataItem}
 */
var MapSeriesDataItem = /** @class */ (function (_super) {
    __extends(MapSeriesDataItem, _super);
    /**
     * Constructor
     */
    function MapSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "MapSeriesDataItem";
        _this.values.value = {};
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapSeriesDataItem.prototype, "value", {
        /**
         * @return {number} Value
         */
        get: function () {
            return this.values.value.value;
        },
        /**
         * Numeric value of the data item.
         *
         * Value may be used in heat-map calculations.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            this.setValue("value", value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the item's bounding coordinates: coordinates of the East, West,
     * North, and South-most points.
     *
     * @ignore Exclude from docs
     * @param {IGeoPoint[]}  geoPoints  Points of the element
     */
    MapSeriesDataItem.prototype.updateExtremes = function (geoPoints) {
        for (var s = 0; s < geoPoints.length; s++) {
            var longitude = geoPoints[s].longitude;
            var latitude = geoPoints[s].latitude;
            if ((this.west > longitude) || !__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](this.west)) {
                this.west = longitude;
            }
            if ((this.east < longitude) || !__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](this.east)) {
                this.east = longitude;
            }
            if ((this.north < latitude) || !__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](this.north)) {
                this.north = latitude;
            }
            if ((this.south > latitude) || !__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](this.south)) {
                this.south = latitude;
            }
        }
    };
    return MapSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__series_Series__["b" /* SeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for series of map objects.
 *
 * @see {@link IMapSeriesEvents} for a list of available Events
 * @see {@link IMapSeriesAdapters} for a list of available Adapters
 * @important
 */
var MapSeries = /** @class */ (function (_super) {
    __extends(MapSeries, _super);
    /**
     * Constructor
     */
    function MapSeries() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapSeries";
        // Set defaults
        _this.isMeasured = false;
        _this.nonScalingStroke = true;
        // Set data fields
        _this.dataFields.value = "value";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapSeriesDataItem} Data Item
     */
    MapSeries.prototype.createDataItem = function () {
        return new MapSeriesDataItem();
    };
    /**
     * (Re)validates series data, effectively causing the whole series to be
     * redrawn.
     *
     * @ignore Exclude from docs
     */
    MapSeries.prototype.validateData = function () {
        var _this = this;
        _super.prototype.validateData.call(this);
        __WEBPACK_IMPORTED_MODULE_2__core_utils_Iterator__["each"](this.dataItems.iterator(), function (dataItem) {
            if ((_this.west > dataItem.west) || !__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](_this.west)) {
                _this.west = dataItem.west;
            }
            if ((_this.east < dataItem.east) || !__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](_this.east)) {
                _this.east = dataItem.east;
            }
            if ((_this.north < dataItem.north) || !__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](_this.north)) {
                _this.north = dataItem.north;
            }
            if ((_this.south > dataItem.south) || !__WEBPACK_IMPORTED_MODULE_3__core_utils_Type__["isNumber"](_this.south)) {
                _this.south = dataItem.south;
            }
        });
        this.chart.updateExtremes();
    };
    /**
     * Checks whether object should be included in series.
     *
     * @param  {string[]}  includes  A list of explicitly included ids
     * @param  {string[]}  excludes  A list of explicitly excluded ids
     * @param  {string}    id        Id of the object
     * @return {boolean}             Include?
     */
    MapSeries.prototype.checkInclude = function (includes, excludes, id) {
        if (includes) {
            if (includes.length == 0) {
                return false;
            }
            else {
                if (includes.indexOf(id) == -1) {
                    return false;
                }
            }
        }
        if (excludes && excludes.length > 0) {
            if (excludes.indexOf(id) != -1) {
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(MapSeries.prototype, "useGeodata", {
        /**
         * @return {boolean} Use GeoJSON data?
         */
        get: function () {
            return this.getPropertyValue("useGeodata");
        },
        /**
         * Should the map extract all the data about element, such as title, from
         * GeoJSON format?
         * @todo: review description, this is more about polygons/lines/points and not about titles. if a mapPolygonSeries doesn't have this set to true, it won't show any areas unless you pass data directly to the series
         *
         * @param {boolean}  value  Use GeoJSON data?
         */
        set: function (value) {
            if (this.setPropertyValue("useGeodata", value)) {
                this.invalidateData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapSeries.prototype, "include", {
        /**
         * @return {string[]} Included objects
         */
        get: function () {
            return this.getPropertyValue("include");
        },
        /**
         * A list of object ids that should be explictly included in the series.
         *
         * If this is not set, the series will automatically include all of the
         * objects, available in the GeoJSON map. (minus the ones listed in
         * `exclude`)
         *
         * If you need to display only specific objects, use `include`. E.g.:
         *
         * `include = ["FR", "ES", "DE"];`
         *
         * The above will show only France, Spain, and Germany out of the whole map.
         *
         * @param {string[]}  value  Included objects
         */
        set: function (value) {
            if (this.setPropertyValue("include", value)) {
                this.processIncExc();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @ignore
     */
    MapSeries.prototype.processIncExc = function () {
        //this.data = [];
        this.invalidateData();
    };
    Object.defineProperty(MapSeries.prototype, "exclude", {
        /**
         * @return {string[]} Excluded ids
         */
        get: function () {
            return this.getPropertyValue("exclude");
        },
        /**
         * A list of object ids that should be excluded from the series.
         *
         * E.g. you want to include all of the areas from a GeoJSON map, except
         * Antarctica.
         *
         * You'd leave `include` empty, and set `exclude = ["AQ"]`.
         *
         * @param {string[]}  value  Excluded ids
         */
        set: function (value) {
            if (this.setPropertyValue("exclude", value)) {
                this.processIncExc();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorates a newly added object.
     *
     * @param {IListEvents<MapObject>["insert"]} event [description]
     */
    MapSeries.prototype.handleObjectAdded = function (event) {
        var mapObject = event.newValue;
        mapObject.parent = this;
        mapObject.series = this;
    };
    return MapSeries;
}(__WEBPACK_IMPORTED_MODULE_0__series_Series__["a" /* Series */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["MapSeries"] = MapSeries;
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["MapSeriesDataItem"] = MapSeriesDataItem;
//# sourceMappingURL=MapSeries.js.map

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapObject; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * Map object module
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
 * A base class for all map objects: lines, images, etc.
 *
 * @see {@link IMapObjectEvents} for a list of available events
 * @see {@link IMapObjectAdapters} for a list of available Adapters
 */
var MapObject = /** @class */ (function (_super) {
    __extends(MapObject, _super);
    /**
     * Constructor
     */
    function MapObject() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapObject";
        // Set defaults
        _this.isMeasured = false;
        _this.layout = "none";
        _this.clickable = true;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * (Re)validates this object, forcing it to redraw.
     *
     * @ignore Exclude from docs
     */
    MapObject.prototype.validate = function () {
        this.readerTitle = this.series.itemReaderText;
        _super.prototype.validate.call(this);
    };
    return MapObject;
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["MapObject"] = MapObject;
//# sourceMappingURL=MapObject.js.map

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["normalizePoint"] = normalizePoint;
/* harmony export (immutable) */ __webpack_exports__["normalizeMultiline"] = normalizeMultiline;
/* harmony export (immutable) */ __webpack_exports__["wrapAngleTo180"] = wrapAngleTo180;
/* harmony export (immutable) */ __webpack_exports__["geoToPoint"] = geoToPoint;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_utils_Math__ = __webpack_require__(3);
/**
 * A collection of GeoJSON format-related utility functions.
 */
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};

/**
 * Normalizes a geo-point.
 *
 * @ignore Exclude from docs
 * @param  {IGeoPoint}  geoPoint  Source geo-point
 * @return {IGeoPoint}            Normalized geo-point
 */
function normalizePoint(geoPoint) {
    var longitude = wrapAngleTo180(geoPoint.longitude);
    var latitude = Math.asin(Math.sin((geoPoint.latitude * __WEBPACK_IMPORTED_MODULE_0__core_utils_Math__["RADIANS"]))) * __WEBPACK_IMPORTED_MODULE_0__core_utils_Math__["DEGREES"];
    var latitude180 = wrapAngleTo180(geoPoint.latitude);
    if (Math.abs(latitude180) > 90) {
        longitude = wrapAngleTo180(longitude + 180);
    }
    geoPoint.longitude = longitude;
    geoPoint.latitude = latitude;
    return geoPoint;
}
/**
 * Normalizes all points of a geo-line.
 *
 * @ignore Exclude from docs
 * @param  {IGeoPoint[][]}  multiline  Source geo-line
 * @return {IGeoPoint[]}               Normalized geo-line
 */
function normalizeMultiline(multiline) {
    try {
        for (var multiline_1 = __values(multiline), multiline_1_1 = multiline_1.next(); !multiline_1_1.done; multiline_1_1 = multiline_1.next()) {
            var segment = multiline_1_1.value;
            try {
                for (var segment_1 = __values(segment), segment_1_1 = segment_1.next(); !segment_1_1.done; segment_1_1 = segment_1.next()) {
                    var point = segment_1_1.value;
                    point = normalizePoint(point);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (segment_1_1 && !segment_1_1.done && (_a = segment_1.return)) _a.call(segment_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (multiline_1_1 && !multiline_1_1.done && (_b = multiline_1.return)) _b.call(multiline_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return multiline;
    var e_2, _b, e_1, _a;
}
/**
 * [wrapAngleTo180 description]
 *
 * @todo Description
 * @ignore Exclude from docs
 * @param  {number}  angle  Angle
 * @return {number}         Angle
 */
function wrapAngleTo180(angle) {
    angle = angle % 360;
    if (angle > 180) {
        angle -= 360;
    }
    if (angle < -180) {
        angle += 360;
    }
    return angle;
}
/**
 * Converts a geo point to a regular point object.
 *
 * @ignore Exclude from docs
 * @param  {IGeoPoint}  geoPoint  Source geo point
 * @return {IPoint}               Point
 */
function geoToPoint(geoPoint) {
    return { x: geoPoint.longitude, y: geoPoint.latitude };
}
//# sourceMappingURL=Geo.js.map

/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapLine; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MapObject__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MapLineObject__ = __webpack_require__(528);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_Triangle__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_elements_Polyline__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Color__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Percent__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__Geo__ = __webpack_require__(138);
/**
 * Map line module
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
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
 * Used to draw a line on the map.
 *
 * @see {@link IMapLineEvents} for a list of available events
 * @see {@link IMapLineAdapters} for a list of available Adapters
 */
var MapLine = /** @class */ (function (_super) {
    __extends(MapLine, _super);
    /**
     * Constructor
     */
    function MapLine() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapLine";
        // Create a line and set its default properties
        _this.line = new __WEBPACK_IMPORTED_MODULE_4__core_elements_Polyline__["a" /* Polyline */]();
        _this.line.stroke = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Color__["c" /* color */])();
        _this.strokeOpacity = 1;
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_7__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        _this.stroke = interfaceColors.getFor("grid");
        _this.shortestDistance = true;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Converts a position within the line (0-1) to a physical point
     * coordinates.
     *
     * 0 indicates start of the line, 0.5 - middle, while 1 indicates the end.
     *
     * @param  {number}             position  Position (0-1)
     * @return {IOrientationPoint}            Coordinates
     */
    MapLine.prototype.positionToPoint = function (position) {
        if (this.line) {
            return this.line.positionToPoint(position);
        }
        return { x: 0, y: 0, angle: 0 };
    };
    Object.defineProperty(MapLine.prototype, "multiGeoLine", {
        /**
         * @return {IGeoPoint[]} [description]
         */
        get: function () {
            return this.getPropertyValue("multiGeoLine");
        },
        /**
         * [multiGeoLine description]
         *
         * @todo Description
         * @param {IGeoPoint[][]} multiGeoLine [description]
         */
        set: function (multiGeoLine) {
            this.setPropertyValue("multiGeoLine", __WEBPACK_IMPORTED_MODULE_10__Geo__["normalizeMultiline"](multiGeoLine), true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapLine.prototype, "imagesToConnect", {
        /**
         * @return {MapImages[]}
         */
        get: function () {
            return this.getPropertyValue("imagesToConnect");
        },
        /**
         * Instead of setting longitudes/latitudes you can set an array of images which will be connected by the line
         *
         * @param {MapImages[]} images
         */
        set: function (images) {
            var _this = this;
            try {
                //@todo dispose listeners if previous imagesToConnect exists
                for (var images_1 = __values(images), images_1_1 = images_1.next(); !images_1_1.done; images_1_1 = images_1.next()) {
                    var image = images_1_1.value;
                    image.events.on("propertychanged", function (event) {
                        if (event.property == "longitude" || event.property == "latitude") {
                            _this.invalidate();
                        }
                    }, this);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (images_1_1 && !images_1_1.done && (_a = images_1.return)) _a.call(images_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.setPropertyValue("imagesToConnect", images);
            var e_1, _a;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * (Re)validates the line, effectively forcing it to redraw.
     *
     * @ignore Exclude from docs
     */
    MapLine.prototype.validate = function () {
        var chart = this.series.chart;
        //let multiPoints: IPoint[][] = [];
        var multiGeoLine = this.multiGeoLine;
        if (this.imagesToConnect) {
            var segment = [];
            multiGeoLine = [segment];
            try {
                for (var _a = __values(this.imagesToConnect), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var image = _b.value;
                    segment.push({ longitude: image.longitude, latitude: image.latitude });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (this.shortestDistance) {
            var newMultiGeoLine = [];
            for (var i = 0; i < multiGeoLine.length; i++) {
                var geoLine = multiGeoLine[i];
                var newGeoLine = [];
                for (var p = 1; p < geoLine.length; p++) {
                    var geoPointA = geoLine[p - 1];
                    var geoPointB = geoLine[p];
                    var stepCount = Math.max(Math.abs(geoPointA.latitude - geoPointB.latitude), Math.abs(geoPointA.longitude - geoPointB.longitude));
                    //let latitudeStep: number = (geoPointB.latitude - geoPointA.latitude) / stepCount;
                    //let longitudeStep: number = (geoPointB.longitude - geoPointA.longitude) / stepCount;
                    for (var d = 0; d < stepCount; d++) {
                        var intermediatePoint = chart.projection.intermediatePoint(geoPointA, geoPointB, d / stepCount);
                        if (newGeoLine.length > 0) {
                            var previousPoint = newGeoLine[newGeoLine.length - 1];
                            if (Math.abs(previousPoint.longitude - intermediatePoint.longitude) > 359) {
                                newMultiGeoLine.push(newGeoLine);
                                newGeoLine = [];
                            }
                        }
                        newGeoLine.push(intermediatePoint);
                    }
                }
                newMultiGeoLine.push(newGeoLine);
            }
            multiGeoLine = newMultiGeoLine;
        }
        this.line.segments = chart.projection.projectGeoLine(multiGeoLine);
        if (this._arrow) {
            this._arrow.validatePosition();
        }
        __WEBPACK_IMPORTED_MODULE_9__core_utils_Iterator__["each"](this.lineObjects.iterator(), function (x) {
            x.validatePosition();
        });
        this.line.parent = this;
        _super.prototype.validate.call(this);
        var e_2, _c;
    };
    /**
     * @ignore Exclude from docs
     */
    MapLine.prototype.measureElement = function () {
        // Overriding, just to avoid extra measure
    };
    Object.defineProperty(MapLine.prototype, "shortestDistance", {
        /**
         * @return {boolean} Real path?
         */
        get: function () {
            return this.getPropertyValue("shortestDistance");
        },
        /**
         * The line should take the shortest path over the globe.
         *
         * Enabling this will make the line look differently in different
         * projections. Only `MapLine` supports this setting, `MapArc` and
         * `MapSplice` don't.
         *
         * @default false
         * @param {boolean}  value  Real path?
         */
        set: function (value) {
            this.setPropertyValue("shortestDistance", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapLine.prototype, "lineObjects", {
        /**
         * List of separate line objects, the line consists of.
         *
         * @todo Description (review)
         * @readonly
         * @return {ListTemplate<MapLineObject>} List of line objects
         */
        get: function () {
            if (!this._lineObjects) {
                this._lineObjects = new __WEBPACK_IMPORTED_MODULE_3__core_utils_List__["e" /* ListTemplate */](new __WEBPACK_IMPORTED_MODULE_1__MapLineObject__["a" /* MapLineObject */]());
                this._lineObjects.events.on("insert", this.handleLineObjectAdded, this);
            }
            return this._lineObjects;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorate a [[LineObject]] when it is added to the line.
     *
     * @param {IListEvents<MapLineObject>["insert"]}  event  Event
     */
    MapLine.prototype.handleLineObjectAdded = function (event) {
        var mapLineObject = event.newValue;
        mapLineObject.mapLine = this;
        mapLineObject.parent = this;
    };
    Object.defineProperty(MapLine.prototype, "arrow", {
        /**
         * @return {MapLineObject} Arrow element
         */
        get: function () {
            if (!this._arrow) {
                var arrow = this.createChild(__WEBPACK_IMPORTED_MODULE_1__MapLineObject__["a" /* MapLineObject */]);
                arrow.shouldClone = false;
                arrow.width = 8;
                arrow.height = 10;
                arrow.mapLine = this;
                arrow.position = 0.5;
                var triangle = arrow.createChild(__WEBPACK_IMPORTED_MODULE_2__core_elements_Triangle__["a" /* Triangle */]);
                triangle.shouldClone = false;
                triangle.fillOpacity = 1;
                triangle.width = Object(__WEBPACK_IMPORTED_MODULE_8__core_utils_Percent__["c" /* percent */])(100);
                triangle.height = Object(__WEBPACK_IMPORTED_MODULE_8__core_utils_Percent__["c" /* percent */])(100);
                triangle.rotation = 90;
                triangle.horizontalCenter = "middle";
                triangle.verticalCenter = "middle";
                this._arrow = arrow;
            }
            return this._arrow;
        },
        /**
         * A [[MapLineObject]] to use as an option arrowhead on the line.
         *
         * Just accessing this property will create a default arrowhead on the line
         * automatically.
         *
         * @param {MapLineObject}  arrow  Arrow element
         */
        set: function (arrow) {
            this._arrow = arrow;
            arrow.mapLine = this;
            arrow.parent = this;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies line properties and other attributes, like arrow, from another
     * instance of [[MapLine]].
     *
     * @param {MapLineObject}  source  Source map line
     */
    MapLine.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.lineObjects.copyFrom(source.lineObjects);
        if (source._arrow) {
            this.arrow = source.arrow.clone();
        }
    };
    Object.defineProperty(MapLine.prototype, "latitude", {
        /**
         * Latitude of the line center.
         *
         * @readonly
         * @return {number} Latitude
         */
        get: function () {
            var dataItem = this.dataItem;
            return dataItem.north + (dataItem.south - dataItem.north) / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapLine.prototype, "longitude", {
        /**
         * Longitude of the line center.
         *
         * @readonly
         * @return {number} Latitude
         */
        get: function () {
            var dataItem = this.dataItem;
            return dataItem.east + (dataItem.west - dataItem.east) / 2;
        },
        enumerable: true,
        configurable: true
    });
    return MapLine;
}(__WEBPACK_IMPORTED_MODULE_0__MapObject__["a" /* MapObject */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_5__core_Registry__["a" /* registry */].registeredClasses["MapLine"] = MapLine;
//# sourceMappingURL=MapLine.js.map

/***/ }),

/***/ 140:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = multiPolygonToGeo;
/* harmony export (immutable) */ __webpack_exports__["a"] = multiLineToGeo;
/* harmony export (immutable) */ __webpack_exports__["b"] = multiPointToGeo;
/* harmony export (immutable) */ __webpack_exports__["d"] = pointToGeo;
/**
 * A collection of Map-related utility functions.
 */
/**
 * Converts a multi-part polygon in X/Y coordinates to a geo-multipolygon in
 * geo-points (lat/long).
 *
 * @param  {number[][][][]}  multiPolygon  Source multi-polygon
 * @return {IGeoPoint[]}                   Geo-multipolygon
 */
function multiPolygonToGeo(multiPolygon) {
    var multiGeoArea = [];
    for (var i = 0; i < multiPolygon.length; i++) {
        var surface = multiPolygon[i][0];
        var hole = multiPolygon[i][1];
        //let holePoints: IGeoPoint[] = [];
        multiGeoArea[i] = [];
        if (surface) {
            multiGeoArea[i].push(multiPointToGeo(surface));
        }
        if (hole) {
            multiGeoArea[i].push(multiPointToGeo(hole));
        }
    }
    return multiGeoArea;
}
/**
 * Converts a multiline in X/Y coordinates to a geo-multiline in geo-points
 * (lat/long).
 *
 * @param  {number[][][]}  multiLine  Source multiline
 * @return {IGeoPoint[]}              Geo-multiline
 */
function multiLineToGeo(multiLine) {
    var multiGeoLine = [];
    for (var i = 0; i < multiLine.length; i++) {
        multiGeoLine.push(multiPointToGeo(multiLine[i]));
    }
    return multiGeoLine;
}
/**
 * Converts multiple X/Y points into a lat/long geo-points.
 *
 * @param  {number[][]}   points  Source points
 * @return {IGeoPoint[]}          Geo-points
 */
function multiPointToGeo(points) {
    var geoPoints = [];
    for (var i = 0; i < points.length; i++) {
        geoPoints.push(pointToGeo(points[i]));
    }
    return geoPoints;
}
/**
 * Converts X/Y point into a lat/long geo-point.
 *
 * @param  {number[]}   point  Source point
 * @return {IGeoPoint}         Geo-point
 */
function pointToGeo(point) {
    return { longitude: point[0], latitude: point[1] };
}
//# sourceMappingURL=MapUtils.js.map

/***/ }),

/***/ 193:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapImage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MapObject__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Type__ = __webpack_require__(2);
/**
 *
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
 * Used to place an image on the map.
 *
 * @see {@link IMapImageEvents} for a list of available events
 * @see {@link IMapImageAdapters} for a list of available Adapters
 */
var MapImage = /** @class */ (function (_super) {
    __extends(MapImage, _super);
    /**
     * Constructor
     */
    function MapImage() {
        var _this = _super.call(this) || this;
        _this.className = "MapImage";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapImage.prototype, "latitude", {
        /**
         * @return {number} Latitude
         */
        get: function () {
            return this.getPropertyValue("latitude");
        },
        /**
         * Latitude image is placed at.
         *
         * @param {number}  value  Latitude
         */
        set: function (value) {
            this.setPropertyValue("latitude", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapImage.prototype, "longitude", {
        /**
         * @return {number} Longitude
         */
        get: function () {
            return this.getPropertyValue("longitude");
        },
        /**
         * Longitude image is placed on.
         *
         * @param {number}  value  Longitude
         */
        set: function (value) {
            this.setPropertyValue("longitude", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Repositions the image to it's current position.
     *
     * @ignore Exclude from docs
     */
    MapImage.prototype.validatePosition = function () {
        if (__WEBPACK_IMPORTED_MODULE_2__core_utils_Type__["isNumber"](this.latitude) && __WEBPACK_IMPORTED_MODULE_2__core_utils_Type__["isNumber"](this.longitude)) {
            this.moveTo(this.series.chart.projection.convert({ latitude: this.latitude, longitude: this.longitude }));
        }
        _super.prototype.validatePosition.call(this);
    };
    return MapImage;
}(__WEBPACK_IMPORTED_MODULE_0__MapObject__["a" /* MapObject */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["MapImage"] = MapImage;
//# sourceMappingURL=MapImage.js.map

/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPolygon; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MapObject__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Polygon__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/**
 * Map polygon module
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
 * Used to draw a polygon on the map.
 *
 * @see {@link IMapPolygonEvents} for a list of available events
 * @see {@link IMapPolygonAdapters} for a list of available Adapters
 */
var MapPolygon = /** @class */ (function (_super) {
    __extends(MapPolygon, _super);
    /**
     * Constructor
     */
    function MapPolygon() {
        var _this = _super.call(this) || this;
        _this.className = "MapPolygon";
        _this.polygon = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Polygon__["a" /* Polygon */]);
        _this.polygon.shouldClone = false;
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_3__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        _this.fill = interfaceColors.getFor("secondaryButton");
        _this.stroke = interfaceColors.getFor("secondaryButtonStroke");
        _this.strokeOpacity = 1;
        /*this.events.on("focus", (event) => {
            //this.toFront();
            //this.isFocused = true;
        });*/
        _this.tooltipPosition = "mouse";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapPolygon.prototype, "multiGeoPolygon", {
        /**
         * @return {IGeoPoint[]} Polygon coordinates
         */
        get: function () {
            return this.getPropertyValue("multiGeoPolygon");
        },
        /**
         * Set of coordinates for the polygon.
         *
         * @param {IGeoPoint[][][]}  multiGeoPolygon  Polygon coordinates
         */
        set: function (multiGeoPolygon) {
            this.setPropertyValue("multiGeoPolygon", multiGeoPolygon, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * (Re)validates the polygon, effectively redrawing it.
     *
     * @ignore Exclude from docs
     */
    MapPolygon.prototype.validate = function () {
        if (this.series) {
            this.polygon.points = this.series.chart.projection.projectGeoArea(this.multiGeoPolygon);
        }
        _super.prototype.validate.call(this);
    };
    /**
     * @ignore Exclude from docs
     */
    MapPolygon.prototype.measureElement = function () {
        // Overriding, just to avoid extra measure
    };
    Object.defineProperty(MapPolygon.prototype, "latitude", {
        /**
         * Calculated polygon center latitude.
         *
         * @readonly
         * @return {number} Center latitude
         */
        get: function () {
            var dataItem = this.dataItem;
            return dataItem.north + (dataItem.south - dataItem.north) / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolygon.prototype, "longitude", {
        /**
         * Calculated polygon center longitude.
         *
         * @readonly
         * @return {number} Center longitude
         */
        get: function () {
            var dataItem = this.dataItem;
            return dataItem.east + (dataItem.west - dataItem.east) / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolygon.prototype, "pixelWidth", {
        /**
         * Not 100% sure about this, as if we add something to MapPolygon this
         * won't be true, but otherwise we will get all 0 and the tooltip won't
         * be positioned properly
         * @hidden
         */
        /**
         * Element's width in pixels.
         *
         * @readonly
         * @return {number} Width (px)
         */
        get: function () {
            return this.polygon.pixelWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolygon.prototype, "pixelHeight", {
        /**
         * Element's height in pixels.
         *
         * @readonly
         * @return {number} Width (px)
         */
        get: function () {
            return this.polygon.pixelHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolygon.prototype, "overflowX", {
        /**
         * Element's horizontal overflow in pixels.
         *
         * @readonly
         * @return {number} Overflow (px)
         */
        get: function () {
            return this.polygon.overflowX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolygon.prototype, "overflowY", {
        /**
         * Element's vertical overflow in pixels.
         *
         * @readonly
         * @return {number} Overflow (px)
         */
        get: function () {
            return this.polygon.overflowY;
        },
        enumerable: true,
        configurable: true
    });
    return MapPolygon;
}(__WEBPACK_IMPORTED_MODULE_0__MapObject__["a" /* MapObject */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["a" /* registry */].registeredClasses["MapPolygon"] = MapPolygon;
//# sourceMappingURL=MapPolygon.js.map

/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MapLineSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapLineSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MapSeries__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MapLine__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__MapUtils__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Array__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__ = __webpack_require__(4);
/**
 * Map line series module
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
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapLineSeries]]
 * @see {@link DataItem}
 */
var MapLineSeriesDataItem = /** @class */ (function (_super) {
    __extends(MapLineSeriesDataItem, _super);
    /**
     * Constructor
     */
    function MapLineSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "MapLineSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapLineSeriesDataItem.prototype, "mapLine", {
        /**
         * A [[MapLine]] element related to this data item.
         *
         * @readonly
         * @return {MapLine} Element
         */
        get: function () {
            if (!this._mapLine) {
                this._mapLine = this.component.mapLines.create(__WEBPACK_IMPORTED_MODULE_1__MapLine__["a" /* MapLine */]);
                this.addSprite(this._mapLine);
            }
            return this._mapLine;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapLineSeriesDataItem.prototype, "line", {
        /**
         * @return {number[]} Coordinates
         */
        get: function () {
            return this._line;
        },
        /**
         * A collection of X/Y coordinates for a single-segment line. E.g.:
         *
         * ```JSON
         * [
         *   [ 100, 150 ],
         *   [ 120, 200 ]
         * ]
         * ```
         *
         * @param {number[][]}  line  Coordinates
         */
        set: function (line) {
            this._line = line;
            this.multiGeoLine = __WEBPACK_IMPORTED_MODULE_4__MapUtils__["a" /* multiLineToGeo */]([line]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapLineSeriesDataItem.prototype, "multiLine", {
        /**
         * @return {number[]} Coordinates
         */
        get: function () {
            return this._multiLine;
        },
        /**
         * A collection of X/Y coordinates for a multi-segment line. E.g.:
         *
         * ```JSON
         * [
         *   // Segment 1
         *   [
         *     [ 100, 150 ],
         *     [ 120, 200 ]
         *   ],
         *
         *   // Segment 2
         *   [
         *     [ 120, 200 ],
         *     [ 150, 100 ]
         *   ]
         * ]
         * ```
         *
         * @param {number[][]}  multiLine  Coordinates
         */
        set: function (multiLine) {
            this._multiLine = multiLine;
            this.multiGeoLine = __WEBPACK_IMPORTED_MODULE_4__MapUtils__["a" /* multiLineToGeo */](multiLine);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapLineSeriesDataItem.prototype, "geoLine", {
        /**
         * @return {IGeoPoint[]} Coordinates
         */
        get: function () {
            return this._geoLine;
        },
        /**
         * A collection of lat/long coordinates for a single-segment line. E.g.:
         *
         * ```JSON
         * [
         *   { longitude: 3.121, latitude: 0.58 },
         *   { longitude: -5.199, latitude: 21.223 }
         * ]
         * ```
         *
         * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.4} GeoJSON LineString reference
         * @param {IGeoPoint[][]}  geoLine  Coordinates
         */
        set: function (geoLine) {
            this._geoLine = geoLine;
            this.multiGeoLine = [geoLine];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapLineSeriesDataItem.prototype, "multiGeoLine", {
        /**
         * @return {IGeoPoint[]} Coordinates
         */
        get: function () {
            return this._multiGeoLine;
        },
        /**
         * A collection of X/Y coordinates for a multi-segment line. E.g.:
         *
         * ```JSON
         * [
         *   // Segment 1
         *   [
         *     { longitude: 3.121, latitude: 0.58 },
         *     { longitude: -5.199, latitude: 21.223 }
         *   ],
         *
         *   // Segment 2
         *   [
         *     { longitude: -5.199, latitude: 21.223 },
         *     { longitude: -12.9, latitude: 25.85 }
         *   ]
         * ]
         * ```
         *
         * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.5} GeoJSON MultiLineString reference
         * @param {IGeoPoint[][]}  multiGeoLine  Coordinates
         */
        set: function (multiGeoLine) {
            this._multiGeoLine = multiGeoLine;
            this.updateLineExtremes(multiGeoLine);
            this.mapLine.multiGeoLine = this._multiGeoLine;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the item's bounding coordinates: coordinates of the East, West,
     * North, and South-most points.
     *
     * @ignore Exclude from docs
     * @param {IGeoPoint[]}  geoPoints  Points of the element
     */
    MapLineSeriesDataItem.prototype.updateLineExtremes = function (multiGeoLine) {
        for (var i = 0; i < multiGeoLine.length; i++) {
            var geoLine = multiGeoLine[i];
            this.updateExtremes(geoLine);
        }
    };
    return MapLineSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__MapSeries__["b" /* MapSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A series of map line series.
 *
 * @see {@link IMapLineSeriesEvents} for a list of available Events
 * @see {@link IMapLineSeriesAdapters} for a list of available Adapters
 * @important
 */
var MapLineSeries = /** @class */ (function (_super) {
    __extends(MapLineSeries, _super);
    /**
     * Constructor
     */
    function MapLineSeries() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapLineSeries";
        // Set data fields
        _this.dataFields.multiLine = "multiLine";
        _this.dataFields.line = "line";
        _this.dataFields.geoLine = "geoLine";
        _this.dataFields.multiGeoLine = "multiGeoLine";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapLineSeriesDataItem} Data Item
     */
    MapLineSeries.prototype.createDataItem = function () {
        return new MapLineSeriesDataItem();
    };
    /**
     * (Re)validates series data, effectively causing the whole series to be
     * redrawn.
     *
     * @ignore Exclude from docs
     */
    MapLineSeries.prototype.validateData = function () {
        var _this = this;
        if (this.data.length > 0) {
            this.mapLines.clear();
        }
        // process geoJSON and created map objects
        if (this.useGeodata) {
            var geoJSON = this.chart.geodata;
            if (geoJSON) {
                var features = void 0;
                if (geoJSON.type == "FeatureCollection") {
                    features = geoJSON.features;
                }
                else if (geoJSON.type == "Feature") {
                    features = [geoJSON];
                }
                else if (["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"].indexOf(geoJSON.type) != -1) {
                    features = [{ geometry: geoJSON }];
                }
                else {
                    console.log("nothing found in geoJSON");
                }
                if (features) {
                    var _loop_1 = function (i) {
                        var feature = features[i];
                        var geometry = feature.geometry;
                        if (geometry) {
                            var type = geometry.type;
                            var id_1 = feature.id;
                            if (type == "LineString" || type == "MultiLineString") {
                                if (!this_1.checkInclude(this_1.include, this_1.exclude, id_1)) {
                                    return "continue";
                                }
                                var coordinates = geometry.coordinates;
                                if (coordinates) {
                                    // make the same as MultiPolygon
                                    if (type == "MultiLineString") {
                                        coordinates = [coordinates];
                                    }
                                }
                                var dataObject = __WEBPACK_IMPORTED_MODULE_5__core_utils_Array__["d" /* find */](this_1.data, function (value, i) {
                                    return value.id == id_1;
                                });
                                if (!dataObject) {
                                    dataObject = { multiLineString: coordinates, id: id_1 };
                                    this_1.data.push(dataObject);
                                }
                                else {
                                    if (!dataObject.multiLineString) {
                                        dataObject.multiLineString = coordinates;
                                    }
                                }
                                // copy properties data to datacontext
                                __WEBPACK_IMPORTED_MODULE_6__core_utils_Utils__["copyProperties"](feature.properties, dataObject);
                            }
                        }
                    };
                    var this_1 = this;
                    for (var i = 0; i < features.length; i++) {
                        _loop_1(i);
                    }
                }
            }
        }
        // if data is parsed in chunks, lines list is corrupted, fix it here
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.dataItems.iterator(), function (dataItem) {
            _this.mapLines.moveValue(dataItem.mapLine);
        });
        _super.prototype.validateData.call(this);
    };
    Object.defineProperty(MapLineSeries.prototype, "mapLines", {
        /**
         * A list of lines in the series.
         *
         * @return {ListTemplate} Lines
         */
        get: function () {
            if (!this._mapLines) {
                var lineTemplate = this.createLine();
                var mapLines = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["e" /* ListTemplate */](lineTemplate);
                mapLines.events.on("insert", this.handleObjectAdded, this);
                this._mapLines = mapLines;
            }
            return this._mapLines;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a new line instance of suitable type.
     *
     * @return {MapLine} New line
     */
    MapLineSeries.prototype.createLine = function () {
        return new __WEBPACK_IMPORTED_MODULE_1__MapLine__["a" /* MapLine */]();
    };
    /**
     * (Re)validates the series
     *
     * @ignore Exclude from docs
     */
    MapLineSeries.prototype.validate = function () {
        _super.prototype.validate.call(this);
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.mapLines.iterator(), function (mapLine) {
            mapLine.validate();
        });
    };
    /**
     * Copies all properties from another instance of [[Series]].
     *
     * @param {Series}  source  Source series
     */
    MapLineSeries.prototype.copyFrom = function (source) {
        this.mapLines.template.copyFrom(source.mapLines.template);
        _super.prototype.copyFrom.call(this, source);
    };
    return MapLineSeries;
}(__WEBPACK_IMPORTED_MODULE_0__MapSeries__["a" /* MapSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["a" /* registry */].registeredClasses["MapLineSeries"] = MapLineSeries;
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["a" /* registry */].registeredClasses["MapLineSeriesDataItem"] = MapLineSeriesDataItem;
//# sourceMappingURL=MapLineSeries.js.map

/***/ }),

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SmallMap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Rectangle__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Color__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__ = __webpack_require__(2);
/**
 * A module for the mini-map control.
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
 * Creates a "bird's eye" view of the whole map.
 *
 * This control creates a mini-map with the whole of the map, highlighting
 * the area which is in the current viewport of the map map.
 *
 * @see {@link ISmallMapEvents} for a list of available events
 * @see {@link ISmallMapAdapters} for a list of available Adapters
 * @important
 */
var SmallMap = /** @class */ (function (_super) {
    __extends(SmallMap, _super);
    /**
     * Constructor
     */
    function SmallMap() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * A target map.
         *
         * @type {MutableValueDisposer<MapChart>}
         */
        _this._chart = new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "SmallMap";
        // Set defaults
        _this.align = "left";
        _this.valign = "bottom";
        _this.percentHeight = 20;
        _this.percentWidth = 20;
        _this.margin(5, 5, 5, 5);
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_6__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        // Set background defailts
        _this.background.fillOpacity = 0.9;
        _this.background.fill = interfaceColors.getFor("background");
        // Set up events
        _this.events.on("hit", _this.moveToPosition, _this);
        _this.events.on("maxsizechanged", _this.updateMapSize, _this);
        // Create a container
        _this.seriesContainer = _this.createChild(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]);
        _this.seriesContainer.shouldClone = false;
        // Create an outline rectangle
        var rectangle = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Rectangle__["a" /* Rectangle */]);
        rectangle.shouldClone = false;
        rectangle.stroke = interfaceColors.getFor("alternativeBackground");
        rectangle.strokeWidth = 1;
        rectangle.strokeOpacity = 0.5;
        rectangle.fill = Object(__WEBPACK_IMPORTED_MODULE_5__core_utils_Color__["c" /* color */])(); //"none";
        rectangle.verticalCenter = "middle";
        rectangle.horizontalCenter = "middle";
        rectangle.isMeasured = false;
        _this.rectangle = rectangle;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(SmallMap.prototype, "series", {
        /**
         * A list of map series used to draw the mini-map.
         *
         * @readonly
         * @return {List<MapSeries>} Series
         */
        get: function () {
            if (!this._series) {
                this._series = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["b" /* List */]();
                this._series.events.on("insert", this.handleSeriesAdded, this);
                this._series.events.on("remove", this.handleSeriesRemoved, this);
            }
            return this._series;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorates a new series when they are pushed into a `series` list.
     *
     * @param {IListEvents<MapSeries>["insert"]} event Event
     */
    SmallMap.prototype.handleSeriesAdded = function (event) {
        var series = event.newValue;
        if (this.chart.series.contains(series)) {
            var newSeries = series.clone();
            this._series.removeValue(series);
            this._series.push(newSeries);
            series = newSeries;
        }
        series.chart = this.chart;
        series.parent = this.seriesContainer;
        series.mouseEnabled = false;
    };
    /**
     * Cleans up after series are removed from Scrollbar.
     *
     * @param {IListEvents<XYSeries>["remove"]}  event  Event
     */
    SmallMap.prototype.handleSeriesRemoved = function (event) {
        //let sourceSeries: MapSeries = event.oldValue;
        this.invalidate();
    };
    /**
     * Moves main map pan position after click on the small map.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["hit"]}  event  Event
     */
    SmallMap.prototype.moveToPosition = function (event) {
        var svgPoint = event.svgPoint;
        var rectPoint = __WEBPACK_IMPORTED_MODULE_7__core_utils_Utils__["svgPointToSprite"](svgPoint, this.rectangle);
        var zoomLevel = this.chart.zoomLevel;
        var scale = Math.min(this.percentWidth, this.percentHeight) / 100;
        var x = (rectPoint.x + this.rectangle.pixelWidth / 2) / scale * zoomLevel;
        var y = (rectPoint.y + this.rectangle.pixelHeight / 2) / scale * zoomLevel;
        var geoPoint = this.chart.svgPointToGeo({ x: x, y: y });
        this.chart.zoomToGeoPoint(geoPoint, this.chart.zoomLevel, true);
    };
    Object.defineProperty(SmallMap.prototype, "chart", {
        /**
         * @return {MapChart} Chart/map
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * A chart/map that this control is meant for.
         *
         * @param {MapChart}  chart  Chart/map
         */
        set: function (chart) {
            if (this.chart != chart) {
                this._chart.set(chart, new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["c" /* MultiDisposer */]([
                    chart.events.on("zoomlevelchanged", this.updateRectangle, this),
                    chart.events.on("mappositionchanged", this.updateRectangle, this),
                    chart.events.on("scaleratiochanged", this.updateMapSize, this)
                ]));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the viewport recangle as per current map zoom/pan position.
     *
     * @ignore Exclude from docs
     */
    SmallMap.prototype.updateRectangle = function () {
        var chart = this.chart;
        var zoomLevel = chart.zoomLevel;
        var rectangle = this.rectangle;
        rectangle.width = this.pixelWidth / zoomLevel;
        rectangle.height = this.pixelHeight / zoomLevel;
        var scale = Math.min(this.percentWidth, this.percentHeight) / 100;
        var seriesContainer = chart.seriesContainer;
        var x = Math.ceil((zoomLevel * seriesContainer.pixelWidth / 2 - seriesContainer.pixelX) * scale / zoomLevel + rectangle.pixelWidth / 2);
        var y = Math.ceil((zoomLevel * seriesContainer.pixelHeight / 2 - seriesContainer.pixelY) * scale / zoomLevel + rectangle.pixelHeight / 2);
        rectangle.x = x;
        rectangle.y = y;
    };
    /**
     * Update map size so that internal elements can redraw themselves after
     * the size of the small map changes.
     *
     * @ignore Exclude from docs
     */
    SmallMap.prototype.updateMapSize = function () {
        if (this.chart) {
            this.seriesContainer.scale = this.chart.scaleRatio * Math.min(this.percentWidth, this.percentHeight) / 100;
            this.afterDraw();
        }
    };
    /**
     * Update elements after drawing the small map.
     */
    SmallMap.prototype.afterDraw = function () {
        _super.prototype.afterDraw.call(this);
        this.seriesContainer.moveTo({ x: this.pixelWidth / 2, y: this.pixelHeight / 2 });
        this.rectangle.maskRectangle = { x: -1, y: -1, width: Math.ceil(this.pixelWidth + 2), height: Math.ceil(this.pixelHeight + 2) };
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    SmallMap.prototype.processConfig = function (config) {
        if (config) {
            // Set up series
            if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](config.series) && __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isArray"](config.series)) {
                for (var i = 0, len = config.series.length; i < len; i++) {
                    var series = config.series[i];
                    if (__WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["hasValue"](series) && __WEBPACK_IMPORTED_MODULE_8__core_utils_Type__["isString"](series) && this.map.hasKey(series)) {
                        config.series[i] = this.map.getKey(series);
                    }
                }
            }
        }
        _super.prototype.processConfig.call(this, config);
    };
    return SmallMap;
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_4__core_Registry__["a" /* registry */].registeredClasses["SmallMap"] = SmallMap;
//# sourceMappingURL=SmallMap.js.map

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapSpline; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MapLine__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Polyspline__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/**
 * Map spline module
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
 * Used to draw a spline on the map.
 *
 * @see {@link IMapSplineEvents} for a list of available events
 * @see {@link IMapSplineAdapters} for a list of available Adapters
 */
var MapSpline = /** @class */ (function (_super) {
    __extends(MapSpline, _super);
    /**
     * Constructor
     */
    function MapSpline() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapSpline";
        // Create a spline
        _this.line = new __WEBPACK_IMPORTED_MODULE_1__core_elements_Polyspline__["a" /* Polyspline */]();
        _this.line.tensionX = 0.8;
        _this.line.tensionY = 0.8;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapSpline.prototype, "shortestDistance", {
        /**
         * ShortestDistance = true is not supported by MapSpline, only MapLine does support it
         * @default false
         * @param {boolean}  value
         * @todo: review description
         */
        get: function () {
            return false;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    return MapSpline;
}(__WEBPACK_IMPORTED_MODULE_0__MapLine__["a" /* MapLine */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["a" /* registry */].registeredClasses["MapSpline"] = MapSpline;
//# sourceMappingURL=MapSpline.js.map

/***/ }),

/***/ 293:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapArc; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MapLine__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Polyarc__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/**
 * Map arched line module
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
 * Used to draw an arched line on the map.
 *
 * @see {@link IMapArcEvents} for a list of available events
 * @see {@link IMapArcAdapters} for a list of available Adapters
 */
var MapArc = /** @class */ (function (_super) {
    __extends(MapArc, _super);
    /**
     * Constructor
     */
    function MapArc() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapArc";
        // Create a line
        _this.line = new __WEBPACK_IMPORTED_MODULE_1__core_elements_Polyarc__["a" /* Polyarc */]();
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapArc.prototype, "shortestDistance", {
        /**
         * ShortestDistance = true is not supported by MapArc, only MapLine does support it
         * @default false
         * @param {boolean}  value
         * @todo: review description
         */
        get: function () {
            return false;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    return MapArc;
}(__WEBPACK_IMPORTED_MODULE_0__MapLine__["a" /* MapLine */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["a" /* registry */].registeredClasses["MapArc"] = MapArc;
//# sourceMappingURL=MapArc.js.map

/***/ }),

/***/ 294:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ZoomControl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_elements_Button__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_elements_RoundedRectangle__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Keyboard__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_interaction_Interaction__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_utils_InterfaceColorSet__ = __webpack_require__(8);
/**
 * Zoom control module
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
 * Creates a control for zooming the map.
 *
 * @see {@link IZoomControlEvents} for a list of available events
 * @see {@link IZoomControlAdapters} for a list of available Adapters
 * @important
 */
var ZoomControl = /** @class */ (function (_super) {
    __extends(ZoomControl, _super);
    /**
     * Constructor
     */
    function ZoomControl() {
        var _this = _super.call(this) || this;
        /**
         * A target map.
         *
         * @type {MutableValueDisposer<MapChart>}
         */
        _this._chart = new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["d" /* MutableValueDisposer */]();
        _this.className = "ZoomControl";
        _this.align = "right";
        _this.valign = "bottom";
        _this.layout = "vertical";
        _this.padding(5, 5, 5, 5);
        var interfaceColors = new __WEBPACK_IMPORTED_MODULE_8__core_utils_InterfaceColorSet__["a" /* InterfaceColorSet */]();
        var plusButton = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Button__["a" /* Button */]);
        plusButton.shouldClone = false;
        plusButton.label.text = "+";
        plusButton.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
        plusButton.padding(5, 5, 5, 5);
        _this.plusButton = plusButton;
        var slider = _this.createChild(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]);
        slider.shouldClone = false;
        slider.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
        slider.background.fill = interfaceColors.getFor("alternativeBackground");
        slider.background.fillOpacity = 0.05;
        slider.background.events.on("hit", _this.handleBackgroundClick, _this);
        slider.events.on("sizechanged", _this.updateThumbSize, _this);
        _this.slider = slider;
        var thumb = slider.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Button__["a" /* Button */]);
        thumb.shouldClone = false;
        thumb.padding(0, 0, 0, 0);
        thumb.draggable = true;
        thumb.events.on("drag", _this.handleThumbDrag, _this);
        _this.thumb = thumb;
        var minusButton = _this.createChild(__WEBPACK_IMPORTED_MODULE_1__core_elements_Button__["a" /* Button */]);
        minusButton.shouldClone = false;
        minusButton.label.text = "-";
        minusButton.padding(5, 5, 5, 5);
        _this.minusButton = minusButton;
        // Set roles
        _this.thumb.role = "slider";
        _this.thumb.readerLive = "polite";
        // Set reader text
        _this.thumb.readerTitle = _this.language.translate("Use arrow keys to zoom in and out");
        _this.minusButton.readerTitle = _this.language.translate("Press ENTER to zoom in");
        _this.plusButton.readerTitle = _this.language.translate("Press ENTER to zoom out");
        _this.applyTheme();
        _this.events.on("propertychanged", function (event) {
            if (event.property == "layout") {
                _this.fixLayout();
            }
        });
        _this.fixLayout();
        return _this;
    }
    ZoomControl.prototype.fixLayout = function () {
        if (this.layout == "vertical") {
            this.width = 40;
            this.height = undefined;
            this.minusButton.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.thumb.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.plusButton.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.slider.width = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.minusButton.marginTop = 1;
            this.plusButton.marginBottom = 2;
            this.slider.height = 0;
            this.minusButton.toFront();
            this.plusButton.toBack();
            this.thumb.minX = 0;
            this.thumb.maxX = 0;
            this.thumb.minY = 0;
        }
        else if (this.layout == "horizontal") {
            this.thumb.minX = 0;
            this.thumb.minY = 0;
            this.thumb.maxY = 0;
            this.height = 40;
            this.width = undefined;
            this.minusButton.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.minusButton.width = 30;
            this.thumb.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.thumb.width = undefined;
            this.plusButton.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.plusButton.width = 30;
            this.slider.height = Object(__WEBPACK_IMPORTED_MODULE_6__core_utils_Percent__["c" /* percent */])(100);
            this.slider.width = 0;
            this.minusButton.marginLeft = 2;
            this.plusButton.marginRight = 2;
            this.minusButton.toBack();
            this.plusButton.toFront();
        }
    };
    /**
     * Handles zoom operation after clicking on the slider background.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["hit"]}  event  Event
     */
    ZoomControl.prototype.handleBackgroundClick = function (event) {
        var sprite = event.target;
        var y = event.spritePoint.y;
        var chart = this.chart;
        var maxPower = Math.log(chart.maxZoomLevel) / Math.LN2;
        var minPower = Math.log(chart.minZoomLevel) / Math.LN2;
        var power = (sprite.pixelHeight - y) / sprite.pixelHeight * (minPower + (maxPower - minPower));
        var zoomLevel = Math.pow(2, power);
        chart.zoomToGeoPoint(chart.zoomGeoPoint, zoomLevel);
    };
    Object.defineProperty(ZoomControl.prototype, "chart", {
        /**
         * @return {MapChart} Map/chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * A main chart/map that this zoom control is for.
         *
         * @param {MapChart}  chart  Map/chart
         */
        set: function (chart) {
            var _this = this;
            this._chart.set(chart, new __WEBPACK_IMPORTED_MODULE_3__core_utils_Disposer__["c" /* MultiDisposer */]([
                chart.events.on("maxsizechanged", this.updateThumbSize, this),
                chart.events.on("zoomlevelchanged", this.updateThumb, this),
                this.minusButton.events.on("hit", function () { chart.zoomOut(chart.zoomGeoPoint); }, chart),
                __WEBPACK_IMPORTED_MODULE_5__core_interaction_Interaction__["b" /* interaction */].body.events.on("keyup", function (ev) {
                    if (_this.topParent.hasFocused) {
                        if (__WEBPACK_IMPORTED_MODULE_4__core_utils_Keyboard__["b" /* keyboard */].isKey(ev.event, "enter")) {
                            if (_this.minusButton.isFocused) {
                                chart.zoomOut();
                            }
                            else if (_this.plusButton.isFocused) {
                                chart.zoomIn();
                            }
                        }
                        else if (__WEBPACK_IMPORTED_MODULE_4__core_utils_Keyboard__["b" /* keyboard */].isKey(ev.event, "plus")) {
                            chart.zoomIn();
                        }
                        else if (__WEBPACK_IMPORTED_MODULE_4__core_utils_Keyboard__["b" /* keyboard */].isKey(ev.event, "minus")) {
                            chart.zoomOut();
                        }
                    }
                }, chart),
                this.plusButton.events.on("hit", function () { chart.zoomIn(chart.zoomGeoPoint); }, chart)
            ]));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the slider's thumb size based on the available zoom space.
     *
     * @ignore Exclude from docs
     */
    ZoomControl.prototype.updateThumbSize = function () {
        var chart = this.chart;
        if (chart) {
            var slider = this.slider;
            var thumb = this.thumb;
            if (this.layout == "vertical") {
                thumb.minHeight = Math.min(this.slider.pixelHeight, 20);
                thumb.height = slider.pixelHeight / (chart.maxZoomLevel - chart.minZoomLevel);
                thumb.maxY = slider.pixelHeight - thumb.pixelHeight;
                if (thumb.pixelHeight <= 1) {
                    thumb.visible = false;
                }
                else {
                    thumb.visible = true;
                }
            }
            else {
                thumb.minWidth = Math.min(this.slider.pixelWidth, 20);
                thumb.width = slider.pixelWidth / (chart.maxZoomLevel - chart.minZoomLevel);
                thumb.maxX = slider.pixelWidth - thumb.pixelWidth;
                if (thumb.pixelWidth <= 1) {
                    thumb.visible = false;
                }
                else {
                    thumb.visible = true;
                }
            }
        }
    };
    /**
     * Updates thumb according to current zoom position from map.
     *
     * @ignore Exclude from docs
     */
    ZoomControl.prototype.updateThumb = function () {
        var slider = this.slider;
        var chart = this.chart;
        var thumb = this.thumb;
        if (!thumb.isDown) {
            var step = Math.log(chart.zoomLevel) / Math.LN2;
            if (this.layout == "vertical") {
                thumb.y = slider.pixelHeight - (slider.pixelHeight - thumb.pixelHeight) * (step + 1) / this.stepCount;
            }
            else {
                thumb.x = slider.pixelWidth * step / this.stepCount;
            }
        }
    };
    /**
     * Zooms the actual map when slider position changes.
     *
     * @ignore Exclude from docs
     */
    ZoomControl.prototype.handleThumbDrag = function () {
        var slider = this.slider;
        var chart = this.chart;
        var thumb = this.thumb;
        var step;
        if (this.layout == "vertical") {
            step = this.stepCount * (slider.pixelHeight - thumb.pixelY - thumb.pixelHeight) / (slider.pixelHeight - thumb.pixelHeight) - 1;
        }
        else {
            step = this.stepCount * thumb.pixelX / slider.pixelWidth;
        }
        var zoomLevel = Math.pow(2, step);
        chart.zoomToGeoPoint(undefined, zoomLevel, false, 0);
    };
    Object.defineProperty(ZoomControl.prototype, "stepCount", {
        /**
         * Returns the step countfor the slider grid according to map's min and max
         * zoom level settings.
         *
         * @ignore Exclude from docs
         * @return {number} Step count
         */
        get: function () {
            return Math.log(this.chart.maxZoomLevel) / Math.LN2 - Math.log(this.chart.minZoomLevel) / Math.LN2;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a background element for slider control.
     *
     * @ignore Exclude from docs
     * @return {this} Background
     */
    ZoomControl.prototype.createBackground = function () {
        return new __WEBPACK_IMPORTED_MODULE_2__core_elements_RoundedRectangle__["a" /* RoundedRectangle */]();
    };
    return ZoomControl;
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_7__core_Registry__["a" /* registry */].registeredClasses["ZoomControl"] = ZoomControl;
//# sourceMappingURL=ZoomControl.js.map

/***/ }),

/***/ 524:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(525);


/***/ }),

/***/ 525:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__es2015_maps__ = __webpack_require__(526);

window.amcharts4.maps = __WEBPACK_IMPORTED_MODULE_0__es2015_maps__;

/***/ }),

/***/ 526:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal_charts_Legend__ = __webpack_require__(146);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LegendDataItem", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_charts_Legend__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Legend", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_charts_Legend__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LegendSettings", function() { return __WEBPACK_IMPORTED_MODULE_0__internal_charts_Legend__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal_charts_elements_HeatLegend__ = __webpack_require__(248);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "HeatLegend", function() { return __WEBPACK_IMPORTED_MODULE_1__internal_charts_elements_HeatLegend__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__internal_charts_types_MapChart__ = __webpack_require__(527);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapChartDataItem", function() { return __WEBPACK_IMPORTED_MODULE_2__internal_charts_types_MapChart__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapChart", function() { return __WEBPACK_IMPORTED_MODULE_2__internal_charts_types_MapChart__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__internal_charts_map_MapSeries__ = __webpack_require__(105);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_3__internal_charts_map_MapSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapSeries", function() { return __WEBPACK_IMPORTED_MODULE_3__internal_charts_map_MapSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__internal_charts_map_MapObject__ = __webpack_require__(137);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapObject", function() { return __WEBPACK_IMPORTED_MODULE_4__internal_charts_map_MapObject__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__internal_charts_map_MapPolygon__ = __webpack_require__(194);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapPolygon", function() { return __WEBPACK_IMPORTED_MODULE_5__internal_charts_map_MapPolygon__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__internal_charts_map_MapImage__ = __webpack_require__(193);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapImage", function() { return __WEBPACK_IMPORTED_MODULE_6__internal_charts_map_MapImage__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__internal_charts_map_MapLine__ = __webpack_require__(139);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapLine", function() { return __WEBPACK_IMPORTED_MODULE_7__internal_charts_map_MapLine__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__internal_charts_map_MapSpline__ = __webpack_require__(292);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapSpline", function() { return __WEBPACK_IMPORTED_MODULE_8__internal_charts_map_MapSpline__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__internal_charts_map_MapArc__ = __webpack_require__(293);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapArc", function() { return __WEBPACK_IMPORTED_MODULE_9__internal_charts_map_MapArc__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__internal_charts_map_MapPolygonSeries__ = __webpack_require__(529);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapPolygonSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_10__internal_charts_map_MapPolygonSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapPolygonSeries", function() { return __WEBPACK_IMPORTED_MODULE_10__internal_charts_map_MapPolygonSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__internal_charts_map_MapLineSeries__ = __webpack_require__(195);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapLineSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_11__internal_charts_map_MapLineSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapLineSeries", function() { return __WEBPACK_IMPORTED_MODULE_11__internal_charts_map_MapLineSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__internal_charts_map_MapSplineSeries__ = __webpack_require__(530);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapSplineSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_12__internal_charts_map_MapSplineSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapSplineSeries", function() { return __WEBPACK_IMPORTED_MODULE_12__internal_charts_map_MapSplineSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__internal_charts_map_MapImageSeries__ = __webpack_require__(531);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapImageSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_13__internal_charts_map_MapImageSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapImageSeries", function() { return __WEBPACK_IMPORTED_MODULE_13__internal_charts_map_MapImageSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__internal_charts_map_MapArcSeries__ = __webpack_require__(532);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapArcSeriesDataItem", function() { return __WEBPACK_IMPORTED_MODULE_14__internal_charts_map_MapArcSeries__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MapArcSeries", function() { return __WEBPACK_IMPORTED_MODULE_14__internal_charts_map_MapArcSeries__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__internal_charts_map_MapUtils__ = __webpack_require__(140);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "multiPolygonToGeo", function() { return __WEBPACK_IMPORTED_MODULE_15__internal_charts_map_MapUtils__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "multiLineToGeo", function() { return __WEBPACK_IMPORTED_MODULE_15__internal_charts_map_MapUtils__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "multiPointToGeo", function() { return __WEBPACK_IMPORTED_MODULE_15__internal_charts_map_MapUtils__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "pointToGeo", function() { return __WEBPACK_IMPORTED_MODULE_15__internal_charts_map_MapUtils__["d"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__internal_charts_map_ZoomControl__ = __webpack_require__(294);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ZoomControl", function() { return __WEBPACK_IMPORTED_MODULE_16__internal_charts_map_ZoomControl__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__internal_charts_map_SmallMap__ = __webpack_require__(199);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SmallMap", function() { return __WEBPACK_IMPORTED_MODULE_17__internal_charts_map_SmallMap__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__internal_charts_map_projections_Projection__ = __webpack_require__(76);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Projection", function() { return __WEBPACK_IMPORTED_MODULE_18__internal_charts_map_projections_Projection__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__internal_charts_map_projections__ = __webpack_require__(533);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "projections", function() { return __WEBPACK_IMPORTED_MODULE_19__internal_charts_map_projections__; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__internal_charts_map_Geo__ = __webpack_require__(138);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "geo", function() { return __WEBPACK_IMPORTED_MODULE_20__internal_charts_map_Geo__; });
/**
 * Duplicated
 */


/**
 * Maps
 */
















/**
 * Elements: projections
 */





//# sourceMappingURL=maps.js.map

/***/ }),

/***/ 527:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MapChartDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapChart; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SerialChart__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__map_MapSeries__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_MapImage__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__map_MapPolygon__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__map_projections_Projection__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__map_SmallMap__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Keyboard__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_interaction_Interaction__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__core_utils_Ease__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__core_utils_Type__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__map_Geo__ = __webpack_require__(138);
/**
 * Map module.
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
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapChart]].
 *
 * @see {@link DataItem}
 */
var MapChartDataItem = /** @class */ (function (_super) {
    __extends(MapChartDataItem, _super);
    /**
     * Constructor
     */
    function MapChartDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "MapChartDataItem";
        _this.applyTheme();
        return _this;
    }
    return MapChartDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__SerialChart__["b" /* SerialChartDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a map.
 *
 * @see {@link IMapChartEvents} for a list of available Events
 * @see {@link IMapChartAdapters} for a list of available Adapters
 * @todo Example
 */
var MapChart = /** @class */ (function (_super) {
    __extends(MapChart, _super);
    /**
     * Constructor
     */
    function MapChart() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * A ratio to be used when scaling the map shapes.
         *
         * @readonly
         * @type {number}
         */
        _this.scaleRatio = 1;
        /**
         * Default duration of zoom animations (ms).
         *
         * @type {number}
         */
        _this.zoomDuration = 1000;
        /**
         * Default zooming animation easing function.
         *
         * @type {function}
         */
        _this.zoomEasing = __WEBPACK_IMPORTED_MODULE_11__core_utils_Ease__["cubicOut"];
        /**
         * Smallest available zoom level. The map will not allow to zoom out past
         * this setting.
         *
         * NOTE: Should be power of 2.
         *
         * @defautl 1
         * @type {number}
         */
        _this.minZoomLevel = 1;
        /**
         * Biggest available zoom level. The map will not allow to zoom in past
         * this setting.
         *
         * NOTE: Should be power of 2.
         *
         * @default 32
         * @type {number}
         */
        _this.maxZoomLevel = 32;
        /**
         * [_prevZoomGeoPoint description]
         *
         * @todo Description
         * @type {IGeoPoint}
         */
        _this._prevZoomGeoPoint = { latitude: 0, longitude: 0 };
        _this.className = "MapChart";
        // Set default projection
        _this.projection = new __WEBPACK_IMPORTED_MODULE_4__map_projections_Projection__["a" /* Projection */]();
        //		this.deltaLatitude = 0;
        _this.deltaLongitude = 0;
        // Set padding
        _this.padding(0, 0, 0, 0);
        // Create a container for map series
        var seriesContainer = _this.seriesContainer;
        seriesContainer.draggable = true;
        seriesContainer.inert = true;
        seriesContainer.resizable = true;
        seriesContainer.events.on("transformed", _this.handleMapTransform, _this);
        seriesContainer.events.on("doublehit", _this.handleDoubleHit, _this);
        // Set up events
        _this.events.on("datavalidated", _this.updateExtremes, _this);
        // Set up main chart container, e.g. set backgrounds and events to monitor
        // size changes, etc.
        var chartContainer = _this.chartContainer;
        chartContainer.events.on("maxsizechanged", _this.udpateScaleRatio, _this);
        var chartContainerBg = chartContainer.background;
        chartContainerBg.fillOpacity = 0;
        chartContainerBg.events.on("down", function (e) { _this.seriesContainer.dragStart(e.target.interactions.downPointers.getIndex(0)); }, _this);
        chartContainerBg.events.on("up", function (e) { _this.seriesContainer.dragStop(); }, _this);
        chartContainerBg.events.on("doublehit", _this.handleDoubleHit, _this);
        chartContainerBg.focusable = true;
        chartContainer.events.on("wheel", _this.handleWheel, _this);
        chartContainer.events.on("down", _this.handleMapDown, _this);
        // Add description to background
        _this.background.fillOpacity = 0;
        _this.background.readerTitle = _this.language.translate("Use plus and minus keys on your keyboard to zoom in and out");
        // Add keyboard events for panning
        __WEBPACK_IMPORTED_MODULE_7__core_interaction_Interaction__["b" /* interaction */].body.events.on("keyup", function (ev) {
            if (_this.topParent.hasFocused && (!_this._zoomControl || !_this._zoomControl.thumb.isFocused)) {
                switch (__WEBPACK_IMPORTED_MODULE_6__core_utils_Keyboard__["b" /* keyboard */].getEventKey(ev.event)) {
                    case "up":
                        _this.pan({ x: 0, y: 0.1 });
                        break;
                    case "down":
                        _this.pan({ x: 0, y: -0.1 });
                        break;
                    case "left":
                        _this.pan({ x: 0.1, y: 0 });
                        break;
                    case "right":
                        _this.pan({ x: -0.1, y: 0 });
                        break;
                }
            }
        }, _this);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    MapChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        this.readerTitle = this.language.translate("Map");
    };
    /**
     * Handles event when a pointer presses down on the map, e.g. user presses
     * down mouse or touches the map on a screen.
     *
     * Stops all animations currently going on.
     */
    MapChart.prototype.handleMapDown = function () {
        if (this._mapAnimation) {
            this._mapAnimation.stop();
        }
    };
    /**
     * Handles the event when user doubleclicks or dooubletaps the map: zooms
     * in on the reference point.
     *
     * @param {AMEvent<Sprite, ISpriteEvents>["doublehit"]}  event  Original event
     */
    MapChart.prototype.handleDoubleHit = function (event) {
        var svgPoint = __WEBPACK_IMPORTED_MODULE_10__core_utils_Utils__["documentPointToSvg"](event.point, this.htmlContainer);
        var geoPoint = this.svgPointToGeo(svgPoint);
        this.zoomIn(geoPoint);
    };
    /**
     * Handles mouse wheel event, e.g. user rotates mouse wheel while over the
     * map: zooms in or out depending on the direction of the wheel turn.
     *
     * @param {AMEvent<Sprite, ISpriteEvents>["wheel"]}  event  Original event
     */
    MapChart.prototype.handleWheel = function (event) {
        var svgPoint = __WEBPACK_IMPORTED_MODULE_10__core_utils_Utils__["documentPointToSvg"](event.point, this.htmlContainer);
        var geoPoint = this.svgPointToGeo(svgPoint);
        if (event.shift.y < 0) {
            this.zoomIn(geoPoint);
        }
        else {
            this.zoomOut(geoPoint);
        }
    };
    Object.defineProperty(MapChart.prototype, "projection", {
        /**
         * @return {Projection} Projection
         */
        get: function () {
            return this.getPropertyValue("projection");
        },
        /**
         * Projection to use for the map.
         *
         * Available projections:
         * * Eckert6
         * * Mercator
         * * Miller
         * * Orthographic
         *
         * ```TypeScript
         * map.projection = new maps.projections.Mercator();
         * ```
         * ```JavaScript
         * map.projection = new amcharts4.maps.projections.Mercator();
         * ```
         * ```JSON
         * {
         *   // ...
         *   "projection": "Mercator"
         *   // ...
         * }
         * ```
         *
         * @param {Projection}  projection  Projection
         */
        set: function (projection) {
            this.setPropertyValue("projection", projection, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Calculates the longitudes and latitudes of the most distant points from
     * the center in all four directions: West, East, North, and South.
     *
     * @ignore Exclude from docs
     */
    MapChart.prototype.updateExtremes = function () {
        var _this = this;
        this.west = null;
        this.east = null;
        this.north = null;
        this.south = null;
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            if ((_this.west > series.west) || !__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNumber"](_this.west)) {
                _this.west = series.west;
            }
            if ((_this.east < series.east) || !__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNumber"](_this.east)) {
                _this.east = series.east;
            }
            if ((_this.north < series.north) || !__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNumber"](_this.north)) {
                _this.north = series.north;
            }
            if ((_this.south > series.south) || !__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNumber"](_this.south)) {
                _this.south = series.south;
            }
        });
        // must reset
        this.projection.centerPoint = { x: 0, y: 0 };
        this.projection.scale = 1;
        // temporary setting deltaLongitude to 0 in order to measure w/h correctly
        var deltaLongitude = this.projection.deltaLongitude;
        this.projection.deltaLongitude = 0;
        var westPoint = this.projection.convert({ longitude: this.west, latitude: (this.south - this.north) / 2 });
        var eastPoint = this.projection.convert({ longitude: this.east, latitude: (this.south - this.north) / 2 });
        var northPoint = this.projection.convert({ longitude: (this.east - this.west) / 2, latitude: this.north });
        var southPoint = this.projection.convert({ longitude: (this.east - this.west) / 2, latitude: this.south });
        this.projection.deltaLongitude = deltaLongitude;
        this.projection.centerPoint = { x: westPoint.x + (eastPoint.x - westPoint.x) / 2, y: northPoint.y + (southPoint.y - northPoint.y) / 2 };
        var scaleRatio;
        var seriesWidth = eastPoint.x - westPoint.x;
        var seriesHeight = southPoint.y - northPoint.y;
        var vScale = this.chartContainer.innerWidth / seriesWidth;
        var hScale = this.chartContainer.innerHeight / seriesHeight;
        if (vScale > hScale) {
            scaleRatio = hScale;
        }
        else {
            scaleRatio = vScale;
        }
        if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNaN"](scaleRatio) || scaleRatio == Infinity) {
            scaleRatio = 1;
        }
        this.projection.scale = scaleRatio;
        this.seriesWidth = seriesWidth * scaleRatio;
        this.seriesHeight = seriesHeight * scaleRatio;
        this.udpateScaleRatio();
    };
    /**
     * (Re)calculates a ratio which should be used to scale the actual map so
     * that it fits perfectly into available space. Helps to avoid redrawing of all the map if container size changes
     * @ignore
     */
    MapChart.prototype.udpateScaleRatio = function () {
        var _this = this;
        var scaleRatio;
        var vScale = this.chartContainer.innerWidth / this.seriesWidth;
        var hScale = this.chartContainer.innerHeight / this.seriesHeight;
        if (vScale > hScale) {
            scaleRatio = hScale;
        }
        else {
            scaleRatio = vScale;
        }
        if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNaN"](scaleRatio) || scaleRatio == Infinity) {
            scaleRatio = 1;
        }
        if (scaleRatio != this.scaleRatio) {
            this.scaleRatio = scaleRatio;
            __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
                series.scale = _this.scaleRatio;
            });
            this.dispatch("scaleratiochanged");
        }
    };
    /**
     * Converts a point within map container to geographical (lat/long)
     * coordinates.
     *
     * @param  {IPoint}     point  Source point
     * @return {IGeoPoint}         Geo-point
     */
    MapChart.prototype.svgPointToGeo = function (point) {
        var series = this.series.getIndex(0);
        if (series) {
            var seriesPoint = __WEBPACK_IMPORTED_MODULE_10__core_utils_Utils__["svgPointToSprite"](point, series);
            return this.seriesPointToGeo(seriesPoint);
        }
    };
    /**
     * Converts geographical (lat/long) coordinates to an X/Y point within map's
     * container.
     *
     * @param  {IGeoPoint}  point  Source geo-point
     * @return {IPoint}            Point
     */
    MapChart.prototype.geoPointToSVG = function (point) {
        var series = this.series.getIndex(0);
        if (series) {
            var seriesPoint = this.geoPointToSeries(point);
            return __WEBPACK_IMPORTED_MODULE_10__core_utils_Utils__["spritePointToSvg"](seriesPoint, series);
        }
    };
    /**
     * Converts a point (X/Y) within actual objects of the map to geographical
     * (lat/long) coordinates.
     *
     * @param  {IPoint}     point  Source point
     * @return {IGeoPoint}         Geo-point
     */
    MapChart.prototype.seriesPointToGeo = function (point) {
        return this.projection.invert(point);
    };
    /**
     * Converts geographical (lat/long) coordinates to an X/Y point within
     * actual elements/objects of the maps.
     *
     * @param  {IGeoPoint}  point  Source geo-point
     * @return {IPoint}            Point
     */
    MapChart.prototype.geoPointToSeries = function (point) {
        return this.projection.convert(point);
    };
    /**
     * Performs after-draw tasks, e.g. centers the map.
     */
    MapChart.prototype.afterDraw = function () {
        _super.prototype.afterDraw.call(this);
        var seriesContainer = this.seriesContainer;
        var chartContainer = this.chartContainer;
        seriesContainer.x = chartContainer.pixelWidth / 2;
        seriesContainer.y = chartContainer.pixelHeight / 2;
    };
    Object.defineProperty(MapChart.prototype, "geodata", {
        /**
         * @return {Object} GeoJSON data
         */
        get: function () {
            return this._geodata;
        },
        /**
         * Map data in GeoJSON format.
         *
         * The Map supports the following GeoJSON objects: `Point`, `LineString`,
         * `Polygon`, `MultiPoint`, `MultiLineString`, and `MultiPolygon`.
         *
         * @see {@link http://geojson.org/} Official GeoJSON format specification
         * @param {Object} geoJSON GeoJSON data
         */
        set: function (geodata) {
            if (geodata != this._geodata) {
                this._geodata = geodata;
                this.invalidateData();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Zooms the map to particular zoom level and centers on a latitude/longitude
     * coordinate.
     *
     * @param  {IGeoPoint}  point      Center coordinate
     * @param  {number}     zoomLevel  Zoom level
     * @param  {boolean}    center     Center on the given coordinate?
     * @param  {number}     duration   Duration for zoom animation (ms)
     * @return {Animation}             Zoom animation
     */
    MapChart.prototype.zoomToGeoPoint = function (point, zoomLevel, center, duration) {
        if (!point) {
            point = this.zoomGeoPoint;
        }
        zoomLevel = __WEBPACK_IMPORTED_MODULE_9__core_utils_Math__["fitToRange"](zoomLevel, this.minZoomLevel, this.maxZoomLevel);
        var seriesPoint = this.projection.convert(point);
        var svgPoint = this.geoPointToSVG(point);
        if (center) {
            svgPoint = {
                x: this.pixelWidth / 2,
                y: this.pixelHeight / 2
            };
        }
        if (!__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNumber"](duration)) {
            duration = this.zoomDuration;
        }
        this._mapAnimation = this.seriesContainer.animate([{
                property: "scale",
                to: zoomLevel
            }, {
                property: "x",
                to: svgPoint.x - seriesPoint.x * zoomLevel * this.scaleRatio - this.pixelPaddingLeft
            }, {
                property: "y",
                to: svgPoint.y - seriesPoint.y * zoomLevel * this.scaleRatio - this.pixelPaddingTop
            }], duration, this.zoomEasing);
        return this._mapAnimation;
    };
    /**
     * Zooms the map to a particular map object.
     *
     * @param  {MapObject}  mapObject  Target map object
     * @param  {number}     zoomLevel  Zoom level
     * @param  {boolean}    center     Center on the given coordinate?
     * @param  {number}     duration   Duration for zoom animation (ms)
     * @return {Animation}             Zoom animation
     */
    MapChart.prototype.zoomToMapObject = function (mapObject, zoomLevel, center, duration) {
        if (center == undefined) {
            center = true;
        }
        if (mapObject instanceof __WEBPACK_IMPORTED_MODULE_2__map_MapImage__["a" /* MapImage */]) {
            if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNaN"](zoomLevel)) {
                zoomLevel = 5;
            }
            return this.zoomToGeoPoint({ latitude: mapObject.latitude, longitude: mapObject.longitude }, zoomLevel, center, duration);
        }
        if (mapObject instanceof __WEBPACK_IMPORTED_MODULE_3__map_MapPolygon__["a" /* MapPolygon */]) {
            var dataItem = mapObject.dataItem;
            return this.zoomToRectangle(dataItem.north, dataItem.east, dataItem.south, dataItem.west, zoomLevel, center, duration);
        }
    };
    /**
     * Zooms the map to a particular viewport.
     *
     * The `north`, `east`, `south`, and `west` define boundaries of the
     * imaginary viewort we want to zoom the map to.
     *
     * `level` is not actual zoom level. The map will determine the zoom level
     * required to accommodated such zoom, and will adjust it by `level` if set.
     *
     * @param  {number}     north     Latitude of the North-most boundary
     * @param  {number}     east      Longitude of the East-most boundary
     * @param  {number}     south     Latitude of the South-most boundary
     * @param  {number}     west      Longitude of the West-most boundary
     * @param  {number}     level     Adjust zoom level
     * @param  {boolean}    center    Center on the given coordinate?
     * @param  {number}     duration  Duration for zoom animation (ms)
     * @return {Animation}            Zoom animation
     */
    MapChart.prototype.zoomToRectangle = function (north, east, south, west, level, center, duration) {
        if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isNaN"](level)) {
            level = 1;
        }
        var zoomLevel = level * Math.min((this.south - this.north) / (south - north), (this.west - this.east) / (west - east));
        return this.zoomToGeoPoint({ latitude: north + (south - north) / 2, longitude: west + (east - west) / 2 }, zoomLevel, center, duration);
    };
    /**
     * Zooms in the map, optionally centering on particular latitude/longitude
     * point.
     *
     * @param  {IGeoPoint}  geoPoint  Optional center point
     * @param  {number}     duration  Duration for zoom animation (ms)
     * @return {Animation}            Zoom animation
     */
    MapChart.prototype.zoomIn = function (geoPoint, duration) {
        return this.zoomToGeoPoint(geoPoint, this.zoomLevel * 2, false, duration);
    };
    /**
     * Zooms out the map, optionally centering on particular latitude/longitude
     * point.
     *
     * @param  {IGeoPoint}  geoPoint  Optional center point
     * @param  {number}     duration  Duration for zoom animation (ms)
     * @return {Animation}            Zoom animation
     */
    MapChart.prototype.zoomOut = function (geoPoint, duration) {
        return this.zoomToGeoPoint(geoPoint, this.zoomLevel / 2, false, duration);
    };
    /**
     * Pans the maps using relative coordinates. E.g.:
     *
     * ```JSON
     * {
     *   x: 0.1,
     *   y: -0.1
     * }
     * ```
     *
     * The above will move the map by 10% to the right, and by 10% upwards.
     *
     * @param {IPoint}  shift     Vertical and horizontal shift
     * @param {number}  duration  Pan animation duration (ms)
     */
    MapChart.prototype.pan = function (shift, duration) {
        var point = this.geoPointToSVG(this.zoomGeoPoint);
        point.x += this.pixelWidth * shift.x;
        point.y += this.pixelHeight * shift.y;
        this.zoomToGeoPoint(this.svgPointToGeo(point), this.zoomLevel, true, duration);
    };
    Object.defineProperty(MapChart.prototype, "zoomGeoPoint", {
        /**
         * Current lat/long coordinates for the center of the viewport. (default
         * zoom reference point)
         *
         * @readonly
         * @return {IGeoPoint} Coordinates
         */
        get: function () {
            return this.svgPointToGeo({
                x: this.pixelWidth / 2,
                y: this.pixelHeight / 2
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapChart.prototype, "zoomLevel", {
        /**
         * Current zoom level.
         *
         * @readonly
         * @return {number} Zoom level
         */
        get: function () {
            return this.seriesContainer.scale;
        },
        set: function (value) {
            this.seriesContainer.scale = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Dispatches events after some map transformation, like pan or zoom.
     */
    MapChart.prototype.handleMapTransform = function () {
        if (this.zoomLevel != this._prevZoomLevel) {
            this.dispatch("zoomlevelchanged");
        }
        if (this.zoomGeoPoint && (this._prevZoomGeoPoint.latitude != this.zoomGeoPoint.latitude || this._prevZoomGeoPoint.longitude != this.zoomGeoPoint.longitude)) {
            this.dispatch("mappositionchanged");
        }
    };
    Object.defineProperty(MapChart.prototype, "smallMap", {
        /**
         * @return {SmallMap} Small map
         */
        get: function () {
            if (!this._smallMap) {
                var smallMap = new __WEBPACK_IMPORTED_MODULE_5__map_SmallMap__["a" /* SmallMap */]();
                this.smallMap = smallMap;
            }
            return this._smallMap;
        },
        /**
         * A [[SmallMap]] to be used on the map.
         *
         * Please note, that accessing this property will NOT create a small map
         * if it has not yet been created. (except in JSON)
         *
         * ```TypeScript
         * // Create a small map
         * map.smallMap = new map.SmallMap();
         * ```
         * ```JavaScript
         * // Create a small map
         * map.smallMap = new amcharts4.map.SmallMap();
         * ```
         * ```JSON
         * {
         *   // ...
         *   "smallMap": {}
         *   // ...
         * }
         * ```
         *
         * @param {SmallMap}  smallMap  Small map
         */
        set: function (smallMap) {
            if (this._smallMap) {
                this.removeDispose(this._smallMap);
            }
            this._smallMap = smallMap;
            this._smallMap.chart = this;
            smallMap.parent = this.chartContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapChart.prototype, "zoomControl", {
        /**
         * @return {ZoomControl} Zoom control
         */
        get: function () {
            return this._zoomControl;
        },
        /**
         * A [[ZoomControl]] to be used on the map.
         *
         * Please note, that accessing this property will NOT create a zoom control
         * if it has not yet been created. (except in JSON)
         *
         * ```TypeScript
         * // Create a zoom control
         * map.zoomControl = new maps.ZoomControl();
         * ```
         * ```JavaScript
         * // Create a zoom control
         * map.zoomControl = new amcharts4.maps.ZoomControl();
         * ```
         * ```JSON
         * {
         *   // ...
         *   "zoomControl": {}
         *   // ...
         * }
         * ```
         *
         * @param {ZoomControl}  zoomControl  Zoom control
         */
        set: function (zoomControl) {
            if (this._zoomControl) {
                this.removeDispose(this._zoomControl);
            }
            this._zoomControl = zoomControl;
            zoomControl.chart = this;
            zoomControl.parent = this.chartContainer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and returns a map series of appropriate type.
     *
     * @return {MapSeries} Map series
     */
    MapChart.prototype.createSeries = function () {
        return new __WEBPACK_IMPORTED_MODULE_1__map_MapSeries__["a" /* MapSeries */]();
    };
    Object.defineProperty(MapChart.prototype, "deltaLongitude", {
        /**
         * @return {number} [description]
         */
        get: function () {
            return this.getPropertyValue("deltaLongitude");
        },
        /**
         * [deltaLatitude description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @param {number} value [description]
         */
        /*public set deltaLatitude(value: number) {
            this.setPropertyValue("deltaLatitude", $geo.wrapAngleTo180(value));
            this.invalidateProjection();
        }
    */
        /**
         * @return {number} [description]
         */
        /*
     public get deltaLatitude(): number {
         return this.getPropertyValue("deltaLatitude");
     }*/
        /**
         * [deltaLongitude description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @param {number} value [description]
         */
        set: function (value) {
            this.setPropertyValue("deltaLongitude", __WEBPACK_IMPORTED_MODULE_14__map_Geo__["wrapAngleTo180"](value));
            this.invalidateProjection();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Invalidates projection, causing all series to be redrawn.
     */
    MapChart.prototype.invalidateProjection = function () {
        //		this.projection.deltaLatitude = this.deltaLatitude;
        this.projection.deltaLongitude = this.deltaLongitude;
        __WEBPACK_IMPORTED_MODULE_12__core_utils_Iterator__["each"](this.series.iterator(), function (series) {
            series.invalidate();
        });
    };
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    MapChart.prototype.processConfig = function (config) {
        // Instantiate projection
        if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config["projection"]) && __WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["isString"](config["projection"])) {
            config["projection"] = this.createClassInstance(config["projection"]);
        }
        // Set up small map
        if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.smallMap) && !__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.smallMap.type)) {
            config.smallMap.type = "SmallMap";
        }
        // Set up zoom control
        if (__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.zoomControl) && !__WEBPACK_IMPORTED_MODULE_13__core_utils_Type__["hasValue"](config.zoomControl.type)) {
            config.zoomControl.type = "ZoomControl";
        }
        _super.prototype.processConfig.call(this, config);
    };
    /**
 * This function is used to sort element's JSON config properties, so that
 * some properties that absolutely need to be processed last, can be put at
 * the end.
 *
 * @ignore Exclude from docs
 * @param  {string}  a  Element 1
 * @param  {string}  b  Element 2
 * @return {number}     Sorting number
 */
    MapChart.prototype.configOrder = function (a, b) {
        if (a == b) {
            return 0;
        }
        // Must come last
        else if (a == "smallMap") {
            return 1;
        }
        else if (b == "smallMap") {
            return -1;
        }
        else if (a == "series") {
            return 1;
        }
        else if (b == "series") {
            return -1;
        }
        else {
            return _super.prototype.configOrder.call(this, a, b);
        }
    };
    /**
     * Adds `projection` to "as is" fields.
     *
     * @param  {string}   field  Field name
     * @return {boolean}         Assign as is?
     */
    MapChart.prototype.asIs = function (field) {
        return field == "projection" || _super.prototype.asIs.call(this, field);
    };
    return MapChart;
}(__WEBPACK_IMPORTED_MODULE_0__SerialChart__["a" /* SerialChart */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_8__core_Registry__["a" /* registry */].registeredClasses["MapChart"] = MapChart;
//# sourceMappingURL=MapChart.js.map

/***/ }),

/***/ 528:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapLineObject; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Container__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * Map line module
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
 * Draws a line on the map.
 *
 * @see {@link IMapLineObjectEvents} for a list of available events
 * @see {@link IMapLineObjectAdapters} for a list of available Adapters
 */
var MapLineObject = /** @class */ (function (_super) {
    __extends(MapLineObject, _super);
    /**
     * Constructor
     */
    function MapLineObject() {
        var _this = _super.call(this) || this;
        _this.adjustRotation = true;
        _this.className = "MapLineObject";
        _this.isMeasured = false;
        _this.layout = "none";
        _this.applyTheme();
        return _this;
    }
    /**
     * (Re)validates element's position.
     *
     * @ignore Exclude from docs
     */
    MapLineObject.prototype.validatePosition = function () {
        if (this.mapLine) {
            var point = this.mapLine.positionToPoint(this.position);
            this.x = point.x;
            this.y = point.y;
            if (this.adjustRotation) {
                this.rotation = point.angle;
            }
            var dataItem = this.mapLine.dataItem;
            if (dataItem) {
                var series = this.mapLine.dataItem.component;
                this.scale = 1 / series.scale;
            }
        }
        _super.prototype.validatePosition.call(this);
    };
    Object.defineProperty(MapLineObject.prototype, "position", {
        /**
         * @return {number} [description]
         */
        get: function () {
            return this.getPropertyValue("position");
        },
        /**
         * [position description]
         *
         * @todo Description
         * @param {number} value [description]
         */
        set: function (value) {
            this.setPropertyValue("position", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapLineObject.prototype, "adjustRotation", {
        /**
         * @return {boolean} [description]
         */
        get: function () {
            return this.getPropertyValue("adjustRotation");
        },
        /**
         * [adjustRotation description]
         *
         * @todo Description
         * @param {boolean} value [description]
         */
        set: function (value) {
            this.setPropertyValue("adjustRotation", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    return MapLineObject;
}(__WEBPACK_IMPORTED_MODULE_0__core_Container__["a" /* Container */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["MapLineObject"] = MapLineObject;
//# sourceMappingURL=MapLineObject.js.map

/***/ }),

/***/ 529:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MapPolygonSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPolygonSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MapSeries__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MapPolygon__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__MapUtils__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_utils_Array__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__ = __webpack_require__(4);
/**
 * Map polygon series module
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
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapPolygonSeries]]
 * @see {@link DataItem}
 */
var MapPolygonSeriesDataItem = /** @class */ (function (_super) {
    __extends(MapPolygonSeriesDataItem, _super);
    /**
     * Constructor
     */
    function MapPolygonSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "MapPolygonSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapPolygonSeriesDataItem.prototype, "mapPolygon", {
        /**
         * A [[MapPolygon]] element related to this data item.
         *
         * @readonly
         * @return {MapPolygon} Element
         */
        get: function () {
            if (!this._mapPolygon) {
                this._mapPolygon = this.component.mapPolygons.create();
                this.addSprite(this._mapPolygon);
            }
            return this._mapPolygon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolygonSeriesDataItem.prototype, "polygon", {
        /**
         * @return {number[]} Coordinates
         */
        get: function () {
            return this._polygon;
        },
        /**
         * A collection of X/Y coordinates for a single polygon. E.g.:
         *
         * ```JSON
         * [
         *   [
         *     [ 100, 150 ],
         *     [ 120, 200 ],
         *     [ 150, 200 ],
         *     [ 170, 240 ],
         *     [ 100, 150 ]
         *   ]
         * ]
         * ```
         *
         * @param {number[][][]}  polygon  Coordinates
         */
        set: function (polygon) {
            this._polygon = polygon;
            this.multiGeoPolygon = __WEBPACK_IMPORTED_MODULE_4__MapUtils__["c" /* multiPolygonToGeo */]([polygon]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolygonSeriesDataItem.prototype, "multiPolygon", {
        /**
         * @return {number[]} Coordinates
         */
        get: function () {
            return this._multiPolygon;
        },
        /**
         * A collection of X/Y coordinates for a multi-part polygon. E.g.:
         *
         * ```JSON
         * [
         *   // Part 1
         *   [
         *     [
         *       [ 100, 150 ],
         *       [ 120, 200 ],
         *       [ 150, 220 ],
         *       [ 170, 240 ],
         *       [ 100, 150 ]
         *     ]
         *   ],
         *
         *   // Part 2
         *   [
         *     [
         *       [ 300, 350 ],
         *       [ 320, 400 ],
         *       [ 350, 420 ],
         *       [ 370, 440 ],
         *       [ 300, 350 ]
         *     ]
         *   ]
         * ]
         * ```
         *
         * @param {number[][][]}  multiPolygon  Coordinates
         */
        set: function (multiPolygon) {
            this._multiPolygon = multiPolygon;
            this.multiGeoPolygon = __WEBPACK_IMPORTED_MODULE_4__MapUtils__["c" /* multiPolygonToGeo */](multiPolygon);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolygonSeriesDataItem.prototype, "geoPolygon", {
        /**
         * @return {IGeoPoint[]} Coordinates
         */
        get: function () {
            return this._geoPolygon;
        },
        /**
         * A collection of lat/long coordinates for a single polygon. E.g.:
         *
         * ```JSON
         * [
         *   [
         *     { latitude: -10.0, longitude: -10.0 },
         *     { latitude: 10.0, longitude: -10.0 },
         *     { latitude: 10.0, longitude: 10.0 },
         *     { latitude: -10.0, longitude: -10.0 }
         *   ]
         * ]
         * ```
         *
         * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.6} GeoJSON Polygon reference
         * @param {IGeoPoint[][]}  geoPolygon  Coordinates
         */
        set: function (geoPolygon) {
            this._geoPolygon = geoPolygon;
            this.multiGeoPolygon = [geoPolygon];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolygonSeriesDataItem.prototype, "multiGeoPolygon", {
        /**
         * @return {IGeoPoint[]} Coordinates
         */
        get: function () {
            return this._multiGeoPolygon;
        },
        /**
         * A collection of lat/long coordinates for a multi-part polygon. E.g.:
         *
         * ```JSON
         * [
         *   [
         *     [
         *       { longitude: 180.0, latitude: 40.0 },
         *       { longitude: 180.0, latitude: 50.0 },
         *       { longitude: 170.0, latitude: 50.0 },
         *       { longitude: 170.0, latitude: 40.0 },
         *       { longitude: 180.0, latitude: 40.0 }
         *     ]
         *   ],
         *   [
         *     [
         *       { longitude: -170.0, latitude: 40.0 },
         *       { longitude: -170.0, latitude: 50.0 },
         *       { longitude: -180.0, latitude: 50.0 },
         *       { longitude: -180.0, latitude: 40.0 },
         *       { longitude: -170.0, latitude: 40.0 }
         *     ]
         *   ]
         * ]
         * ```
         *
         * @see {@link https://tools.ietf.org/html/rfc7946#section-3.1.7} GeoJSON MultiPolygon reference
         * @param {IGeoPoint[][][]}  multiGeoPolygon  Coordinates
         */
        set: function (multiGeoPolygon) {
            this._multiGeoPolygon = multiGeoPolygon;
            this.updateAreaExtremes(multiGeoPolygon);
            this.mapPolygon.multiGeoPolygon = this._multiGeoPolygon;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the item's bounding coordinates: coordinates of the East, West,
     * North, and South-most points.
     *
     * @ignore Exclude from docs
     * @param {IGeoPoint[]}  geoPoints  Points of the element
     */
    MapPolygonSeriesDataItem.prototype.updateAreaExtremes = function (multiGeoPolygon) {
        for (var i = 0; i < multiGeoPolygon.length; i++) {
            var geoPolygon = multiGeoPolygon[i];
            var surface = geoPolygon[0];
            this.updateExtremes(surface);
        }
    };
    return MapPolygonSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__MapSeries__["b" /* MapSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A series of map polygon elements.
 *
 * @see {@link IMapPolygonSeriesEvents} for a list of available Events
 * @see {@link IMapPolygonSeriesAdapters} for a list of available Adapters
 * @important
 */
var MapPolygonSeries = /** @class */ (function (_super) {
    __extends(MapPolygonSeries, _super);
    /**
     * Constructor
     */
    function MapPolygonSeries() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.parsingStepDuration = 5000; // to avoid some extra redrawing
        _this.className = "MapPolygonSeries";
        // Set data fields
        _this.dataFields.multiPolygon = "multiPolygon";
        _this.dataFields.polygon = "polygon";
        _this.dataFields.geoPolygon = "geoPolygon";
        _this.dataFields.multiGeoPolygon = "multiGeoPolygon";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapPolygonSeriesDataItem} Data Item
     */
    MapPolygonSeries.prototype.createDataItem = function () {
        return new MapPolygonSeriesDataItem();
    };
    /**
     * @ignore
     */
    MapPolygonSeries.prototype.clearPolygons = function () {
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.mapPolygons.iterator(), function (mapPolygon) {
            mapPolygon.polygon.dispose();
            mapPolygon.dispose();
        });
        this.mapPolygons.clear();
    };
    /**
     * @ignore
     */
    MapPolygonSeries.prototype.processIncExc = function () {
        this.clearPolygons();
        _super.prototype.processIncExc.call(this);
    };
    /**
     * (Re)validates series data, effectively causing the whole series to be
     * redrawn.
     *
     * @ignore Exclude from docs
     */
    MapPolygonSeries.prototype.validateData = function () {
        var _this = this;
        if (this.data.length > 0 && this._parseDataFrom == 0) {
            this.clearPolygons();
        }
        this.west = null;
        this.east = null;
        this.north = null;
        this.south = null;
        // process geoJSON and created map objects
        if (this.useGeodata) {
            var geoJSON = this.chart.geodata;
            if (geoJSON) {
                var features = void 0;
                if (geoJSON.type == "FeatureCollection") {
                    features = geoJSON.features;
                }
                else if (geoJSON.type == "Feature") {
                    features = [geoJSON];
                }
                else if (["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"].indexOf(geoJSON.type) != -1) {
                    features = [{ geometry: geoJSON }];
                }
                else {
                    console.log("nothing found in geoJSON");
                }
                if (features) {
                    var _loop_1 = function (i) {
                        var feature = features[i];
                        var geometry = feature.geometry;
                        if (geometry) {
                            var type = geometry.type;
                            var id_1 = feature.id;
                            if (type == "Polygon" || type == "MultiPolygon") {
                                if (!this_1.checkInclude(this_1.include, this_1.exclude, id_1)) {
                                    return "continue";
                                }
                                var coordinates = geometry.coordinates;
                                if (coordinates) {
                                    // make the same as MultiPolygon
                                    if (type == "Polygon") {
                                        coordinates = [coordinates];
                                    }
                                }
                                // find data object in user-provided data
                                var dataObject = __WEBPACK_IMPORTED_MODULE_5__core_utils_Array__["d" /* find */](this_1.data, function (value, i) {
                                    return value.id == id_1;
                                });
                                // create one if not found
                                if (!dataObject) {
                                    dataObject = { multiPolygon: coordinates, id: id_1 };
                                    this_1.data.push(dataObject);
                                }
                                // in case found
                                else {
                                    // if user-provided object doesn't have points data provided in any way:
                                    if (!dataObject.multiPolygon) {
                                        dataObject.multiPolygon = coordinates;
                                    }
                                }
                                // copy properties data to datacontext
                                __WEBPACK_IMPORTED_MODULE_6__core_utils_Utils__["copyProperties"](feature.properties, dataObject);
                            }
                        }
                    };
                    var this_1 = this;
                    for (var i = 0; i < features.length; i++) {
                        _loop_1(i);
                    }
                }
            }
        }
        _super.prototype.validateData.call(this);
        // if data is parsed in chunks, polygon list is corrupted, fix it here
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.dataItems.iterator(), function (dataItem) {
            _this.mapPolygons.moveValue(dataItem.mapPolygon);
        });
    };
    /**
     * (Re)validates the series
     *
     * @ignore Exclude from docs
     */
    MapPolygonSeries.prototype.validate = function () {
        _super.prototype.validate.call(this);
        //console.log(this.uid, this.mapPolygons.length);
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.mapPolygons.iterator(), function (mapPolygon) {
            mapPolygon.validate();
        });
    };
    Object.defineProperty(MapPolygonSeries.prototype, "mapPolygons", {
        /**
         * List of polygon elements in the series.
         *
         * @return {ListTemplate<MapPolygon>} Polygon list
         */
        get: function () {
            if (!this._mapPolygons) {
                var polygonTemplate = new __WEBPACK_IMPORTED_MODULE_1__MapPolygon__["a" /* MapPolygon */]();
                var mapPolygons = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["e" /* ListTemplate */](polygonTemplate);
                mapPolygons.template.focusable = true;
                mapPolygons.events.on("insert", this.handleObjectAdded, this);
                this._mapPolygons = mapPolygons;
            }
            return this._mapPolygons;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns MapPolygon by id in geoJSON file
     * @param {string} polygon id
     * @return {MapPolygon}
     */
    MapPolygonSeries.prototype.getPolygonById = function (id) {
        return __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["find"](this.mapPolygons.iterator(), function (mapPolygon) {
            var dataContext = mapPolygon.dataItem.dataContext;
            return dataContext.id == id;
        });
    };
    /**
     * Copies all properties from another instance of [[Series]].
     *
     * @param {Series}  source  Source series
     */
    MapPolygonSeries.prototype.copyFrom = function (source) {
        this.mapPolygons.template.copyFrom(source.mapPolygons.template);
        _super.prototype.copyFrom.call(this, source);
    };
    return MapPolygonSeries;
}(__WEBPACK_IMPORTED_MODULE_0__MapSeries__["a" /* MapSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["a" /* registry */].registeredClasses["MapPolygonSeries"] = MapPolygonSeries;
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["a" /* registry */].registeredClasses["MapPolygonSeriesDataItem"] = MapPolygonSeriesDataItem;
//# sourceMappingURL=MapPolygonSeries.js.map

/***/ }),

/***/ 530:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MapSplineSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapSplineSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MapLineSeries__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MapSpline__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/**
 * Map spline series module
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
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapSplineSeries]]
 * @see {@link DataItem}
 */
var MapSplineSeriesDataItem = /** @class */ (function (_super) {
    __extends(MapSplineSeriesDataItem, _super);
    /**
     * Constructor
     */
    function MapSplineSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "MapSplineSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapSplineSeriesDataItem.prototype, "mapLine", {
        /**
         * A [[MapSpline]] element related to this data item.
         *
         * @return {MapSpline} Element
         */
        get: function () {
            if (!this._mapLine) {
                this._mapLine = this.component.mapLines.create(__WEBPACK_IMPORTED_MODULE_1__MapSpline__["a" /* MapSpline */]);
                this.addSprite(this._mapLine);
            }
            return this._mapLine;
        },
        enumerable: true,
        configurable: true
    });
    return MapSplineSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__MapLineSeries__["b" /* MapLineSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A series of map spline elements.
 *
 * @see {@link IMapSplineSeriesEvents} for a list of available Events
 * @see {@link IMapSplineSeriesAdapters} for a list of available Adapters
 * @important
 */
var MapSplineSeries = /** @class */ (function (_super) {
    __extends(MapSplineSeries, _super);
    /**
     * Constructor
     */
    function MapSplineSeries() {
        var _this = _super.call(this) || this;
        _this.className = "MapSplineSeries";
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapSplineSeriesDataItem} Data Item
     */
    MapSplineSeries.prototype.createDataItem = function () {
        return new MapSplineSeriesDataItem();
    };
    /**
     * Returns a new line instance of suitable type.
     *
     * @return {MapSpline} New line
     */
    MapSplineSeries.prototype.createLine = function () {
        return new __WEBPACK_IMPORTED_MODULE_1__MapSpline__["a" /* MapSpline */]();
    };
    return MapSplineSeries;
}(__WEBPACK_IMPORTED_MODULE_0__MapLineSeries__["a" /* MapLineSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["a" /* registry */].registeredClasses["MapSplineSeries"] = MapSplineSeries;
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["a" /* registry */].registeredClasses["MapSplineSeriesDataItem"] = MapSplineSeriesDataItem;
//# sourceMappingURL=MapSplineSeries.js.map

/***/ }),

/***/ 531:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MapImageSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapImageSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MapSeries__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MapImage__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_List__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_utils_Array__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__MapUtils__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_utils_Utils__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__ = __webpack_require__(4);
/**
 * Map image series module
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
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapImageSeries]]
 * @see {@link DataItem}
 */
var MapImageSeriesDataItem = /** @class */ (function (_super) {
    __extends(MapImageSeriesDataItem, _super);
    /**
     * Constructor
     */
    function MapImageSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "MapImageSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapImageSeriesDataItem.prototype, "mapImage", {
        /**
         * A [[MapImage]] element related to this data item.
         *
         * @return {MapImage} Element
         */
        get: function () {
            if (!this._mapImage) {
                this._mapImage = this.component.mapImages.create();
                this.addSprite(this._mapImage);
            }
            return this._mapImage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapImageSeriesDataItem.prototype, "point", {
        /**
         * @return {number[]} [description]
         */
        get: function () {
            return this._point;
        },
        /**
         * [point description]
         *
         * @todo Description
         * @param {number[]} point [description]
         */
        set: function (point) {
            this._point = point;
            this.geoPoint = __WEBPACK_IMPORTED_MODULE_5__MapUtils__["d" /* pointToGeo */](point);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapImageSeriesDataItem.prototype, "geoPoint", {
        /**
         * @return {IGeoPoint} Image coordinates
         */
        get: function () {
            return this._geoPoint;
        },
        /**
         * Geographical coordinates (lat/long) image is placed at.
         *
         * @param {IGeoPoint} geoPoint Image coordinates
         */
        set: function (geoPoint) {
            this._geoPoint = geoPoint;
            this.updateExtremes([this._geoPoint]);
            this.mapImage.latitude = this._geoPoint.latitude;
            this.mapImage.longitude = this._geoPoint.longitude;
        },
        enumerable: true,
        configurable: true
    });
    return MapImageSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__MapSeries__["b" /* MapSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A series of map image (marker) elements.
 *
 * @see {@link IMapImageSeriesEvents} for a list of available Events
 * @see {@link IMapImageSeriesAdapters} for a list of available Adapters
 * @important
 */
var MapImageSeries = /** @class */ (function (_super) {
    __extends(MapImageSeries, _super);
    /**
     * Constructor
     */
    function MapImageSeries() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapImageSeries";
        // Set data fields
        _this.dataFields.multiPoint = "multiPoint";
        _this.dataFields.point = "point";
        _this.dataFields.geoPoint = "geoPoint";
        _this.dataFields.multiGeoPoint = "multiGeoPoint";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapImageSeriesDataItem} Data Item
     */
    MapImageSeries.prototype.createDataItem = function () {
        return new MapImageSeriesDataItem();
    };
    /**
     * (Re)validates the data of the sries, effectively forcing it to redraw
     * all of its elements.
     *
     * @ignore Exclude from docs
     */
    MapImageSeries.prototype.validateData = function () {
        var _this = this;
        if (this.data.length > 0) {
            this.mapImages.clear();
        }
        // process geoJSON and created map objects
        if (this.useGeodata) {
            var geoJSON = this.chart.geodata;
            if (geoJSON) {
                var features = void 0;
                if (geoJSON.type == "FeatureCollection") {
                    features = geoJSON.features;
                }
                else if (geoJSON.type == "Feature") {
                    features = [geoJSON];
                }
                else if (["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"].indexOf(geoJSON.type) != -1) {
                    features = [{ geometry: geoJSON }];
                }
                else {
                    console.log("nothing found in geoJSON");
                }
                if (features) {
                    var _loop_1 = function (i) {
                        var feature = features[i];
                        var geometry = feature.geometry;
                        if (geometry) {
                            var type = geometry.type;
                            var id_1 = feature.id;
                            if (type == "Point" || type == "MultiPoint") { // todo: we don't support multipoints at the moment actually
                                if (!this_1.checkInclude(this_1.include, this_1.exclude, id_1)) {
                                    return "continue";
                                }
                                var coordinates = geometry.coordinates;
                                if (coordinates) {
                                    // make the same as MultiPoint
                                    if (type == "MultiPoint") {
                                        coordinates = [coordinates];
                                    }
                                }
                                var dataObject = __WEBPACK_IMPORTED_MODULE_4__core_utils_Array__["d" /* find */](this_1.data, function (value, i) {
                                    return value.id == id_1;
                                });
                                if (!dataObject) {
                                    dataObject = { multiPoint: coordinates, id: id_1 };
                                    this_1.data.push(dataObject);
                                }
                                else {
                                    if (!dataObject.multiPoint) {
                                        dataObject.multiPoint = coordinates;
                                    }
                                }
                                // copy properties data to datacontext
                                __WEBPACK_IMPORTED_MODULE_6__core_utils_Utils__["copyProperties"](feature.properties, dataObject);
                            }
                        }
                    };
                    var this_1 = this;
                    for (var i = 0; i < features.length; i++) {
                        _loop_1(i);
                    }
                }
            }
        }
        // if data is parsed in chunks, images list is corrupted, fix it here
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.dataItems.iterator(), function (dataItem) {
            _this.mapImages.moveValue(dataItem.mapImage);
        });
        _super.prototype.validateData.call(this);
    };
    Object.defineProperty(MapImageSeries.prototype, "mapImages", {
        /**
         * A list of map images in the series.
         *
         * @return {ListTemplate<MapImage>} Map images
         */
        get: function () {
            if (!this._mapImages) {
                var template = new __WEBPACK_IMPORTED_MODULE_1__MapImage__["a" /* MapImage */]();
                var mapImages = new __WEBPACK_IMPORTED_MODULE_2__core_utils_List__["e" /* ListTemplate */](template);
                mapImages.template.focusable = true;
                mapImages.events.on("insert", this.handleObjectAdded, this);
                this._mapImages = mapImages;
            }
            return this._mapImages;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * (Re)validates data element, effectively triggering its redrawal.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    MapImageSeries.prototype.validateDataElement = function (dataItem) {
        _super.prototype.validateDataElement.call(this, dataItem);
        dataItem.mapImage.invalidate();
    };
    /**
     * (Re)validates the series
     *
     * @ignore Exclude from docs
     */
    MapImageSeries.prototype.validate = function () {
        _super.prototype.validate.call(this);
        __WEBPACK_IMPORTED_MODULE_7__core_utils_Iterator__["each"](this.mapImages.iterator(), function (mapImage) {
            mapImage.validatePosition();
        });
    };
    /**
     * Copies all properties from another instance of [[Series]].
     *
     * @param {Series}  source  Source series
     */
    MapImageSeries.prototype.copyFrom = function (source) {
        this.mapImages.template.copyFrom(source.mapImages.template);
        _super.prototype.copyFrom.call(this, source);
    };
    return MapImageSeries;
}(__WEBPACK_IMPORTED_MODULE_0__MapSeries__["a" /* MapSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["a" /* registry */].registeredClasses["MapImageSeries"] = MapImageSeries;
__WEBPACK_IMPORTED_MODULE_3__core_Registry__["a" /* registry */].registeredClasses["MapImageSeriesDataItem"] = MapImageSeriesDataItem;
//# sourceMappingURL=MapImageSeries.js.map

/***/ }),

/***/ 532:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MapArcSeriesDataItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapArcSeries; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MapLineSeries__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__MapArc__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_Registry__ = __webpack_require__(1);
/**
 * Map arc series module.
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
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[MapArcSeries]].
 *
 * @see {@link DataItem}
 */
var MapArcSeriesDataItem = /** @class */ (function (_super) {
    __extends(MapArcSeriesDataItem, _super);
    /**
     * Constructor
     */
    function MapArcSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "MapArcSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapArcSeriesDataItem.prototype, "mapLine", {
        /**
         * A [[MapArc]] element related to this data item.
         *
         * @return {MapArc} Element
         */
        get: function () {
            if (!this._mapLine) {
                this._mapLine = this.component.mapLines.create(__WEBPACK_IMPORTED_MODULE_1__MapArc__["a" /* MapArc */]);
                this.addSprite(this._mapLine);
            }
            return this._mapLine;
        },
        enumerable: true,
        configurable: true
    });
    return MapArcSeriesDataItem;
}(__WEBPACK_IMPORTED_MODULE_0__MapLineSeries__["b" /* MapLineSeriesDataItem */]));

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A series of arc elements. (curved lines)
 *
 * @see {@link IMapArcSeriesEvents} for a list of available Events
 * @see {@link IMapArcSeriesAdapters} for a list of available Adapters
 * @important
 */
var MapArcSeries = /** @class */ (function (_super) {
    __extends(MapArcSeries, _super);
    /**
     * Constructor
     */
    function MapArcSeries() {
        var _this = _super.call(this) || this;
        _this.className = "MapArcSeries";
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {MapArcSeriesDataItem} Data Item
     */
    MapArcSeries.prototype.createDataItem = function () {
        return new MapArcSeriesDataItem();
    };
    /**
     * Returns a new line instance of suitable type.
     *
     * @return {MapArc} New line
     */
    MapArcSeries.prototype.createLine = function () {
        return new __WEBPACK_IMPORTED_MODULE_1__MapArc__["a" /* MapArc */]();
    };
    return MapArcSeries;
}(__WEBPACK_IMPORTED_MODULE_0__MapLineSeries__["a" /* MapLineSeries */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["a" /* registry */].registeredClasses["MapArcSeries"] = MapArcSeries;
__WEBPACK_IMPORTED_MODULE_2__core_Registry__["a" /* registry */].registeredClasses["MapArcSeriesDataItem"] = MapArcSeriesDataItem;
//# sourceMappingURL=MapArcSeries.js.map

/***/ }),

/***/ 533:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__projections_Mercator__ = __webpack_require__(534);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Mercator", function() { return __WEBPACK_IMPORTED_MODULE_0__projections_Mercator__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__projections_Miller__ = __webpack_require__(535);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Miller", function() { return __WEBPACK_IMPORTED_MODULE_1__projections_Miller__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__projections_Eckert6__ = __webpack_require__(536);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Eckert6", function() { return __WEBPACK_IMPORTED_MODULE_2__projections_Eckert6__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__projections_Orthographic__ = __webpack_require__(537);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Orthographic", function() { return __WEBPACK_IMPORTED_MODULE_3__projections_Orthographic__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__projections_Projection__ = __webpack_require__(76);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Projection", function() { return __WEBPACK_IMPORTED_MODULE_4__projections_Projection__["a"]; });





//# sourceMappingURL=projections.js.map

/***/ }),

/***/ 534:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Mercator; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Projection__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * Functionality for Mercator projection
 *
 * The function(s) below are from D3.js library (https://d3js.org/)
 *
 * ```
 * Copyright 2017 Mike Bostock
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * ```
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
 * Mercator projection.
 */
var Mercator = /** @class */ (function (_super) {
    __extends(Mercator, _super);
    function Mercator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Converts screen coordinates to latitude/longitude in radians
     * @param  {number}     x  X
     * @param  {number}     y  Y
     * @return {IGeoPoint}     Geographical coordinates
     */
    Mercator.prototype.unproject = function (x, y) {
        return {
            longitude: x,
            latitude: 2 * Math.atan(Math.exp(y)) - Math.PI / 2
        };
    };
    /**
     * Converts geographical coordinates to screen coordinates.
     *
     * @param  {number}  lambda  Lambda parameter
     * @param  {number}  phi     Phi parameter
     * @return {IPoint}          Screen coordinates
     */
    Mercator.prototype.project = function (lambda, phi) {
        return {
            x: lambda,
            y: Math.log(Math.tan((Math.PI / 2 + phi) / 2))
        };
    };
    return Mercator;
}(__WEBPACK_IMPORTED_MODULE_0__Projection__["a" /* Projection */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["Mercator"] = Mercator;
//# sourceMappingURL=Mercator.js.map

/***/ }),

/***/ 535:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Miller; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Projection__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * Functionality for Miller projection
 *
 * The function(s) below are from D3.js library (https://d3js.org/)
 *
 * ```
 * Copyright 2017 Mike Bostock
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * ```
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
 * Miller projection.
 */
var Miller = /** @class */ (function (_super) {
    __extends(Miller, _super);
    function Miller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Converts screen coordinates to latitude/longitude.
     *
     * @param  {number}     x  X
     * @param  {number}     y  Y
     * @return {IGeoPoint}     Geographical coordinates in radians
     */
    Miller.prototype.unproject = function (x, y) {
        return {
            longitude: x,
            latitude: 2.5 * Math.atan(Math.exp(0.8 * y)) - 0.625 * Math.PI
        };
    };
    /**
     * Converts geographical coordinates to screen coordinates.
     *
     * @param  {number}  lambda  Lambda parameter
     * @param  {number}  phi     Phi parameter
     * @return {IPoint}          Screen coordinates
     */
    Miller.prototype.project = function (lambda, phi) {
        return {
            x: lambda,
            y: 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * phi))
        };
    };
    return Miller;
}(__WEBPACK_IMPORTED_MODULE_0__Projection__["a" /* Projection */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["Miller"] = Miller;
//# sourceMappingURL=Miller.js.map

/***/ }),

/***/ 536:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Eckert6; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Projection__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/**
 * Functionality for Eckert6 projection
 *
 * The function(s) below are from D3.js library (https://d3js.org/)
 *
 * ```
 * Copyright 2017 Mike Bostock
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * ```
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
 * Eckert6 projection.
 */
var Eckert6 = /** @class */ (function (_super) {
    __extends(Eckert6, _super);
    function Eckert6() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Converts screen coordinates to latitude/longitude.
     *
     * @param  {number}     x  X
     * @param  {number}     y  Y
     * @return {IGeoPoint}     Geographical coordinates in radians
     */
    Eckert6.prototype.unproject = function (x, y) {
        var j = 1 + Math.PI / 2, k = Math.sqrt(j / 2);
        return {
            longitude: x * 2 * k / (1 + Math.cos(y *= k)),
            latitude: Math.asin((y + Math.sin(y)) / j)
        };
    };
    /**
     * Converts geographical coordinates to screen coordinates.
     *
     * @param  {number}  lambda  Lambda parameter
     * @param  {number}  phi     Phi parameter
     * @return {IPoint}          Screen coordinates
     */
    Eckert6.prototype.project = function (lambda, phi) {
        var k = (1 + Math.PI / 2) * Math.sin(phi);
        for (var i = 0, delta = Infinity; i < 10 && Math.abs(delta) > 0.00001; i++) {
            phi -= delta = (phi + Math.sin(phi) - k) / (1 + Math.cos(phi));
        }
        k = Math.sqrt(2 + Math.PI);
        return {
            x: lambda * (1 + Math.cos(phi)) / k,
            y: 2 * phi / k
        };
    };
    return Eckert6;
}(__WEBPACK_IMPORTED_MODULE_0__Projection__["a" /* Projection */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["Eckert6"] = Eckert6;
//# sourceMappingURL=Eckert6.js.map

/***/ }),

/***/ 537:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Orthographic; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Projection__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__ = __webpack_require__(3);
/**
 * Functionality for Mercator projection
 *
 * The function(s) below are from D3.js library (https://d3js.org/)
 *
 * ```
 * Copyright 2017 Mike Bostock
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * ```
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */



/**
 * Orthographic projection.
 */
var Orthographic = /** @class */ (function (_super) {
    __extends(Orthographic, _super);
    function Orthographic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Converts geographical coordinates to screen coordinates.
     *
     * @param  {number}  lambda  Lambda parameter
     * @param  {number}  phi     Phi parameter
     * @return {IPoint}          Screen coordinates
     */
    Orthographic.prototype.project = function (lambda, phi) {
        return { x: Math.cos(phi) * Math.sin(lambda), y: Math.sin(phi) };
    };
    Orthographic.prototype.getClipRectangle1 = function () {
        var longitude = 90 - this.deltaLongitude;
        var latitude = -this.deltaLatitude;
        var smallNum = 0.00001;
        return [{ longitude: longitude - 180, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude + 90 }, { longitude: longitude - 180, latitude: latitude + 90 }];
    };
    Orthographic.prototype.getRect1 = function () {
        var longitude = 90 - this.deltaLongitude;
        var latitude = -this.deltaLatitude;
        return { north: latitude + 90, south: latitude - 90, west: longitude - 180, east: longitude };
    };
    Orthographic.prototype.getClipRectangle2 = function () {
        var longitude = 90 - this.deltaLongitude;
        var latitude = -this.deltaLatitude;
        var smallNum = 0.00001;
        var delta;
        if (longitude > 0) {
            delta = -360;
        }
        else {
            delta = 360;
        }
        return [{ longitude: smallNum + longitude - 180 + delta, latitude: latitude - 90 }, { longitude: longitude - smallNum + delta, latitude: latitude - 90 }, { longitude: longitude - smallNum + delta, latitude: latitude + 90 }, { longitude: smallNum + longitude - 180 + delta, latitude: latitude + 90 }];
    };
    Orthographic.prototype.getRect2 = function () {
        var longitude = 90 - this.deltaLongitude;
        var latitude = -this.deltaLatitude;
        var delta;
        if (longitude > 0) {
            delta = -360;
        }
        else {
            delta = 360;
        }
        return { north: latitude + 90, south: latitude - 90, west: longitude - 180 + delta, east: longitude + delta };
    };
    Orthographic.prototype.clipGeoArea = function (geoArea) {
        if (!geoArea) {
            return;
        }
        var clippedArea = [];
        var clipRectangle1 = this.getClipRectangle1();
        var clipRectangle2 = this.getClipRectangle2();
        var rect1 = this.getRect1();
        var rect2 = this.getRect2();
        for (var i = 0; i < geoArea.length; i++) {
            var surface = geoArea[i][0];
            var hole = geoArea[i][1];
            var clippedAreas = [];
            if (surface) {
                var surfaceRect = this.getExtremes(surface);
                if (!this.isInside(surfaceRect, rect1) && !this.isOutside(surfaceRect, rect1)) {
                    var clippedSurface1 = this.clip(surface, clipRectangle1);
                    var clippedHole1 = this.clip(hole, clipRectangle1);
                    clippedAreas.push([clippedSurface1, clippedHole1]);
                }
                else if (this.isInside(surfaceRect, rect1)) {
                    clippedAreas.push([surface, hole]);
                }
                if (!this.isInside(surfaceRect, rect2) && !this.isOutside(surfaceRect, rect2)) {
                    var clippedSurface2 = this.clip(surface, clipRectangle2);
                    var clippedHole2 = this.clip(hole, clipRectangle2);
                    clippedAreas.push([clippedSurface2, clippedHole2]);
                }
                else if (this.isInside(surfaceRect, rect2)) {
                    clippedAreas.push([surface, hole]);
                }
            }
            try {
                for (var clippedAreas_1 = __values(clippedAreas), clippedAreas_1_1 = clippedAreas_1.next(); !clippedAreas_1_1.done; clippedAreas_1_1 = clippedAreas_1.next()) {
                    var area = clippedAreas_1_1.value;
                    clippedArea.push(area);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (clippedAreas_1_1 && !clippedAreas_1_1.done && (_a = clippedAreas_1.return)) _a.call(clippedAreas_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        for (var i = 0; i < clippedArea.length; i++) {
            var surface = clippedArea[i][0];
            //let hole: IGeoPoint[] = clippedArea[i][1];
            if (surface) {
                var prevPoint = surface[surface.length - 1];
                for (var i_1 = 0; i_1 < surface.length; i_1++) {
                    var point = surface[i_1];
                    if (__WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["round"](point.longitude, 4) == __WEBPACK_IMPORTED_MODULE_2__core_utils_Math__["round"](prevPoint.longitude, 4)) {
                        var stepCount = Math.abs((prevPoint.latitude - point.latitude) * 2);
                        var extraPoints = [];
                        if (stepCount > 1) {
                            for (var s = 1; s < stepCount; s++) {
                                extraPoints.push({ longitude: prevPoint.longitude, latitude: prevPoint.latitude + (point.latitude - prevPoint.latitude) / stepCount * s });
                            }
                            surface.splice.apply(surface, __spread([i_1, 0], extraPoints));
                            i_1 = i_1 + extraPoints.length;
                        }
                    }
                    prevPoint = point;
                }
            }
        }
        return clippedArea;
        var e_1, _a;
    };
    return Orthographic;
}(__WEBPACK_IMPORTED_MODULE_0__Projection__["a" /* Projection */]));

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_1__core_Registry__["a" /* registry */].registeredClasses["Orthographic"] = Orthographic;
//# sourceMappingURL=Orthographic.js.map

/***/ }),

/***/ 76:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Projection; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_Registry__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Geo__ = __webpack_require__(138);
/**
 * This module contains funcitonality related to geographical projections
 */
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This is a base class for a geographical projection.
 */
var Projection = /** @class */ (function () {
    function Projection() {
        this.deltaLongitude = 0;
        this.deltaLatitude = 0;
        this.deltaGama = 0;
        this.centerPoint = { x: 0, y: 0 };
        this.scale = 1;
    }
    Projection.prototype.projectGeoArea = function (geoArea) {
        var clippedGeoArea = this.clipGeoArea(geoArea);
        var convertedPoints = this.convertGeoArea(clippedGeoArea);
        return convertedPoints;
    };
    Projection.prototype.projectGeoLine = function (geoLine) {
        return this.convertGeoLine(this.clipGeoLine(geoLine));
    };
    Projection.prototype.getClipRectangle1 = function () {
        var longitude = __WEBPACK_IMPORTED_MODULE_2__Geo__["wrapAngleTo180"](180 - this.deltaLongitude);
        var latitude = __WEBPACK_IMPORTED_MODULE_2__Geo__["wrapAngleTo180"](this.deltaLatitude);
        var smallNum = 0.00001;
        return [{ longitude: -180, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude + 90 }, { longitude: -180, latitude: latitude + 90 }];
    };
    Projection.prototype.getClipRectangle2 = function () {
        var longitude = __WEBPACK_IMPORTED_MODULE_2__Geo__["wrapAngleTo180"](180 - this.deltaLongitude);
        //let latitude = $geo.wrapAngleTo180(this.deltaLatitude);
        var smallNum = 0.00001;
        return [{ longitude: longitude + smallNum, latitude: -90 }, { longitude: 180, latitude: -90 }, { longitude: 180, latitude: 90 }, { longitude: longitude + smallNum, latitude: 90 }];
    };
    Projection.prototype.getRect1 = function () {
        var longitude = __WEBPACK_IMPORTED_MODULE_2__Geo__["wrapAngleTo180"](180 - this.deltaLongitude);
        var latitude = __WEBPACK_IMPORTED_MODULE_2__Geo__["wrapAngleTo180"](this.deltaLatitude);
        return { north: latitude + 90, south: latitude - 90, west: longitude - 180, east: longitude };
    };
    Projection.prototype.getRect2 = function () {
        var longitude = __WEBPACK_IMPORTED_MODULE_2__Geo__["wrapAngleTo180"](180 - this.deltaLongitude);
        var latitude = __WEBPACK_IMPORTED_MODULE_2__Geo__["wrapAngleTo180"](this.deltaLatitude);
        return { north: latitude + 90, south: latitude - 90, west: longitude, east: (longitude + 180) };
    };
    Projection.prototype.clipGeoLine = function (geoLine) {
        if (!geoLine) {
            return;
        }
        var clippedLine = [];
        var clipRectangle1 = this.getClipRectangle1();
        var clipRectangle2 = this.getClipRectangle2();
        for (var i = 0; i < geoLine.length; i++) {
            var segment = geoLine[i];
            if (segment) {
                var clippedSegments = this.clipLine(segment, clipRectangle1);
                clippedLine = clippedLine.concat(clippedSegments);
                if (this.deltaLongitude != 0) {
                    var clippedSegments2 = this.clipLine(segment, clipRectangle2);
                    clippedLine = clippedLine.concat(clippedSegments2);
                }
            }
        }
        return clippedLine;
    };
    Projection.prototype.clipGeoArea = function (geoArea) {
        if (!geoArea) {
            return;
        }
        var clippedArea = [];
        var clipRectangle1 = this.getClipRectangle1();
        var clipRectangle2 = this.getClipRectangle2();
        var rect1 = this.getRect1();
        var rect2 = this.getRect2();
        for (var i = 0; i < geoArea.length; i++) {
            var surface = geoArea[i][0];
            var hole = geoArea[i][1];
            var clippedAreas = [];
            if (surface) {
                var surfaceRect = this.getExtremes(surface);
                if (!this.isInside(surfaceRect, rect1) && !this.isOutside(surfaceRect, rect1)) {
                    var clippedSurface1 = this.clip(surface, clipRectangle1);
                    var clippedHole1 = this.clip(hole, clipRectangle1);
                    clippedAreas.push([clippedSurface1, clippedHole1]);
                }
                else {
                    clippedAreas.push([surface, hole]);
                }
                if (!this.isInside(surfaceRect, rect2) && !this.isOutside(surfaceRect, rect2)) {
                    var clippedSurface2 = this.clip(surface, clipRectangle2);
                    var clippedHole2 = this.clip(hole, clipRectangle2);
                    clippedAreas.push([clippedSurface2, clippedHole2]);
                }
            }
            try {
                for (var clippedAreas_1 = __values(clippedAreas), clippedAreas_1_1 = clippedAreas_1.next(); !clippedAreas_1_1.done; clippedAreas_1_1 = clippedAreas_1.next()) {
                    var area = clippedAreas_1_1.value;
                    clippedArea.push(area);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (clippedAreas_1_1 && !clippedAreas_1_1.done && (_a = clippedAreas_1.return)) _a.call(clippedAreas_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return clippedArea;
        var e_1, _a;
    };
    Projection.prototype.convertGeoArea = function (geoArea) {
        if (!geoArea) {
            return;
        }
        var convertedPoints = [];
        for (var i = 0; i < geoArea.length; i++) {
            var surface = geoArea[i][0];
            var hole = geoArea[i][1];
            var convertedAreaPoints = [];
            if (surface) {
                var convertedSurface = [];
                for (var s = 0; s < surface.length; s++) {
                    var point = this.convert(surface[s]);
                    convertedSurface.push(point);
                }
                convertedAreaPoints.push(convertedSurface);
            }
            if (hole) {
                var convertedHole = [];
                for (var s = 0; s < hole.length; s++) {
                    var point = this.convert(hole[s]);
                    convertedHole.push(point);
                }
                convertedAreaPoints.push(convertedHole);
            }
            convertedPoints.push(convertedAreaPoints);
        }
        return convertedPoints;
    };
    Projection.prototype.convertGeoLine = function (geoLine) {
        if (!geoLine) {
            return;
        }
        var convertedPoints = [];
        for (var i = 0; i < geoLine.length; i++) {
            var segment = geoLine[i];
            var convertedSegmentPoints = [];
            for (var s = 0; s < segment.length; s++) {
                var geoPoint = segment[s];
                var point = this.convert(geoPoint);
                convertedSegmentPoints.push(point);
            }
            convertedPoints.push(convertedSegmentPoints);
        }
        return convertedPoints;
    };
    /**
     * Converts a geographical point (lat/long) to a screen point (x/y)
     * @param  {IGeoPoint} geoPoint Geo point (lat/long)
     * @return {IPoint}             Screen point (x/y)
     */
    Projection.prototype.convert = function (geoPoint) {
        geoPoint = __WEBPACK_IMPORTED_MODULE_2__Geo__["normalizePoint"](geoPoint);
        geoPoint = this.rotate(geoPoint, this.deltaLongitude, this.deltaLatitude, this.deltaGama);
        var pointInRadians = this.project(geoPoint.longitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"], geoPoint.latitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"]);
        return {
            x: __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["round"](pointInRadians.x * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["DEGREES"] - this.centerPoint.x, 2) * this.scale,
            y: __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["round"](-pointInRadians.y * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["DEGREES"] - this.centerPoint.y, 2) * this.scale
        };
    };
    /**
     * Converts a screen point (x/y) to a geographical point (lat/long)
     * @param  {IPoint}    point Screen point (x/y)
     * @return {IGeoPoint}       Geo point (lat/long)
     */
    Projection.prototype.invert = function (point) {
        var pointInRadians = this.unproject((point.x / this.scale + this.centerPoint.x) * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"], (-point.y / this.scale - this.centerPoint.y) * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"]);
        var geoPoint = { longitude: pointInRadians.longitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["DEGREES"], latitude: pointInRadians.latitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["DEGREES"] };
        geoPoint = this.unrotate(geoPoint, this.deltaLongitude, this.deltaLatitude, this.deltaGama);
        return geoPoint;
    };
    /**
     * Returns X/Y coordinates.
     * Individual projections will override this method to apply their own
     * projection logic.
     * @param  {number} lambda [description]
     * @param  {number} phi    [description]
     * @return {IPoint}        X/Y coordinates
     * @todo Needs description
     */
    Projection.prototype.project = function (lambda, phi) {
        return { x: lambda, y: phi };
    };
    /**
     * Returns geographical coordinates (lat/long).
     * Individual projections will override this method to apply their own
     * projection logic.
     * @param  {number}    x X coordinate
     * @param  {number}    y Y coordinate
     * @return {IGeoPoint}   Geographical point
     * @todo Needs description
     */
    Projection.prototype.unproject = function (x, y) {
        return { longitude: x, latitude: y };
    };
    Projection.prototype.rotate = function (geoPoint, deltaLongitude, deltaLatitude, deltaGamma) {
        var deltaLambda = deltaLongitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        var deltaPhi = deltaLatitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        deltaGamma = deltaGamma * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        var lambda = geoPoint.longitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"] + deltaLambda;
        var phi = geoPoint.latitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        var cosDeltaPhi = Math.cos(deltaPhi);
        var sinDeltaPhi = Math.sin(deltaPhi);
        var cosDeltaGamma = Math.cos(deltaGamma);
        var sinDeltaGamma = Math.sin(deltaGamma);
        var cosPhi = Math.cos(phi);
        var x = Math.cos(lambda) * cosPhi;
        var y = Math.sin(lambda) * cosPhi;
        var z = Math.sin(phi);
        var k = z * cosDeltaPhi + x * sinDeltaPhi;
        return { longitude: __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["DEGREES"] * Math.atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi), latitude: __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["DEGREES"] * Math.asin(k * cosDeltaGamma + y * sinDeltaGamma) };
    };
    Projection.prototype.unrotate = function (geoPoint, deltaLongitude, deltaLatitude, deltaGamma) {
        var deltaLambda = deltaLongitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        var deltaPhi = deltaLatitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        deltaGamma = deltaGamma * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        var lambda = geoPoint.longitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"] - deltaLambda;
        var phi = geoPoint.latitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        var cosDeltaPhi = Math.cos(deltaPhi);
        var sinDeltaPhi = Math.sin(deltaPhi);
        var cosDeltaGamma = Math.cos(deltaGamma);
        var sinDeltaGamma = Math.sin(deltaGamma);
        var cosPhi = Math.cos(phi);
        var x = Math.cos(lambda) * cosPhi;
        var y = Math.sin(lambda) * cosPhi;
        var z = Math.sin(phi);
        var k = z * cosDeltaGamma - y * sinDeltaGamma;
        return { longitude: __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["DEGREES"] * Math.atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi), latitude: __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["DEGREES"] * Math.asin(k * cosDeltaPhi - x * sinDeltaPhi) };
    };
    Projection.prototype.clipLine = function (subjectPolyline, clipPolygon) {
        if (!subjectPolyline || subjectPolyline.length == 0) {
            return;
        }
        var cp1;
        var cp2;
        var inside = function (p) {
            return (cp2.longitude - cp1.longitude) * (p.latitude - cp1.latitude) > (cp2.latitude - cp1.latitude) * (p.longitude - cp1.longitude);
        };
        var s;
        var e;
        //@todo: make a separate function
        var intersection = function () {
            var dc = { longitude: cp1.longitude - cp2.longitude, latitude: cp1.latitude - cp2.latitude };
            var dp = { longitude: s.longitude - e.longitude, latitude: s.latitude - e.latitude };
            var n1 = cp1.longitude * cp2.latitude - cp1.latitude * cp2.longitude;
            var n2 = s.longitude * e.latitude - s.latitude * e.longitude;
            var n3 = 1.0 / (dc.longitude * dp.latitude - dc.latitude * dp.longitude);
            return { longitude: (n1 * dp.longitude - n2 * dc.longitude) * n3, latitude: (n1 * dp.latitude - n2 * dc.latitude) * n3 };
        };
        var segment = subjectPolyline;
        cp1 = clipPolygon[clipPolygon.length - 1];
        for (var j in clipPolygon) {
            cp2 = clipPolygon[j];
            var inputList = segment;
            segment = [];
            s = inputList[0];
            for (var i = 0; i < inputList.length; i++) {
                e = inputList[i];
                if (inside(e)) {
                    if (!inside(s)) {
                        segment.push(intersection());
                    }
                    segment.push(e);
                }
                else if (inside(s)) {
                    segment.push(intersection());
                }
                s = e;
            }
            cp1 = cp2;
        }
        return [segment];
    };
    //@todo add credits to roseta code
    //@todo: someday make it better
    Projection.prototype.clip = function (subjectPolygon, clipPolygon) {
        if (!subjectPolygon || subjectPolygon.length == 0) {
            return;
        }
        var cp1;
        var cp2;
        var inside = function (p) {
            return (cp2.longitude - cp1.longitude) * (p.latitude - cp1.latitude) > (cp2.latitude - cp1.latitude) * (p.longitude - cp1.longitude);
        };
        var s;
        var e;
        //@todo: make a separate function
        var intersection = function () {
            var dc = { longitude: cp1.longitude - cp2.longitude, latitude: cp1.latitude - cp2.latitude };
            var dp = { longitude: s.longitude - e.longitude, latitude: s.latitude - e.latitude };
            var n1 = cp1.longitude * cp2.latitude - cp1.latitude * cp2.longitude;
            var n2 = s.longitude * e.latitude - s.latitude * e.longitude;
            var n3 = 1.0 / (dc.longitude * dp.latitude - dc.latitude * dp.longitude);
            return { longitude: (n1 * dp.longitude - n2 * dc.longitude) * n3, latitude: (n1 * dp.latitude - n2 * dc.latitude) * n3 };
        };
        var outputList = subjectPolygon;
        cp1 = clipPolygon[clipPolygon.length - 1];
        for (var j in clipPolygon) {
            cp2 = clipPolygon[j];
            var inputList = outputList;
            outputList = [];
            s = inputList[inputList.length - 1]; //last on the input list
            for (var i in inputList) {
                e = inputList[i];
                if (inside(e)) {
                    if (!inside(s)) {
                        outputList.push(intersection());
                    }
                    outputList.push(e);
                }
                else if (inside(s)) {
                    outputList.push(intersection());
                }
                s = e;
            }
            cp1 = cp2;
        }
        return outputList;
    };
    //@todo: move to some utils?
    Projection.prototype.getExtremes = function (geoPoints) {
        var west = geoPoints[0].longitude;
        var east = geoPoints[0].longitude;
        var north = geoPoints[0].latitude;
        var south = geoPoints[0].latitude;
        for (var s = 0; s < geoPoints.length; s++) {
            var longitude = geoPoints[s].longitude;
            var latitude = geoPoints[s].latitude;
            if ((west > longitude)) {
                west = longitude;
            }
            if ((east < longitude)) {
                east = longitude;
            }
            if ((north < latitude)) {
                north = latitude;
            }
            if ((south > latitude)) {
                south = latitude;
            }
        }
        return { north: north, east: east, south: south, west: west };
    };
    //@todo: move to some utils?
    Projection.prototype.isInside = function (r1, r2) {
        if (r1.north < r2.north && r1.south > r2.south && r1.west > r2.west && r1.east < r2.east) {
            return true;
        }
        return false;
    };
    //@todo: move to some utils?
    Projection.prototype.isOutside = function (r1, r2) {
        if (r1.south > r2.north || r1.north < r2.south || r1.west > r2.east || r1.east < r2.west) {
            return true;
        }
        return false;
    };
    //@todo: move to some utils?
    //@todo: add credits to: https://www.movable-type.co.uk/scripts/latlong.html
    Projection.prototype.intermediatePoint = function (pointA, pointB, position) {
        var phi1 = pointA.latitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        var lambda1 = pointA.longitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        var phi2 = pointB.latitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        var lambda2 = pointB.longitude * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["RADIANS"];
        var sinPhi1 = Math.sin(phi1);
        var cosPhi1 = Math.cos(phi1);
        var sinLambda1 = Math.sin(lambda1);
        var cosLambda1 = Math.cos(lambda1);
        var sinPhi2 = Math.sin(phi2);
        var cosPhi2 = Math.cos(phi2);
        var sinLambda2 = Math.sin(lambda2);
        var cosLambda2 = Math.cos(lambda2);
        // distance between points
        var deltaPhi = phi2 - phi1;
        var deltaLambda = lambda2 - lambda1;
        var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        var delta = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var A = Math.sin((1 - position) * delta) / Math.sin(delta);
        var B = Math.sin(position * delta) / Math.sin(delta);
        var x = A * cosPhi1 * cosLambda1 + B * cosPhi2 * cosLambda2;
        var y = A * cosPhi1 * sinLambda1 + B * cosPhi2 * sinLambda2;
        var z = A * sinPhi1 + B * sinPhi2;
        var phi3 = Math.atan2(z, Math.sqrt(x * x + y * y));
        var lambda3 = Math.atan2(y, x);
        return { latitude: phi3 * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["DEGREES"], longitude: lambda3 * __WEBPACK_IMPORTED_MODULE_1__core_utils_Math__["DEGREES"] };
    };
    ;
    return Projection;
}());

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
__WEBPACK_IMPORTED_MODULE_0__core_Registry__["a" /* registry */].registeredClasses["Projection"] = Projection;
//# sourceMappingURL=Projection.js.map

/***/ })

},[524]);