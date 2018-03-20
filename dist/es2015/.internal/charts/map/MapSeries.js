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
import { Series, SeriesDataItem } from "../series/Series";
import { system } from "../../core/System";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
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
            if ((this.west > longitude) || !$type.isNumber(this.west)) {
                this.west = longitude;
            }
            if ((this.east < longitude) || !$type.isNumber(this.east)) {
                this.east = longitude;
            }
            if ((this.north < latitude) || !$type.isNumber(this.north)) {
                this.north = latitude;
            }
            if ((this.south > latitude) || !$type.isNumber(this.south)) {
                this.south = latitude;
            }
        }
    };
    return MapSeriesDataItem;
}(SeriesDataItem));
export { MapSeriesDataItem };
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
        $iter.each(this.dataItems.iterator(), function (dataItem) {
            if ((_this.west > dataItem.west) || !$type.isNumber(_this.west)) {
                _this.west = dataItem.west;
            }
            if ((_this.east < dataItem.east) || !$type.isNumber(_this.east)) {
                _this.east = dataItem.east;
            }
            if ((_this.north < dataItem.north) || !$type.isNumber(_this.north)) {
                _this.north = dataItem.north;
            }
            if ((_this.south > dataItem.south) || !$type.isNumber(_this.south)) {
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
    Object.defineProperty(MapSeries.prototype, "getDataFromJSON", {
        /**
         * @return {boolean} Use GeoJSON data?
         */
        get: function () {
            return this.getPropertyValue("getDataFromJSON");
        },
        /**
         * Should the map extract all the data about element, such as title, from
         * GeoJSON format?
         * @todo: review description, this is more about polygons/lines/points and not about titles. if a mapPolygonSeries doesn't have this set to true, it won't show any areas unless you pass data directly to the series
         *
         * @param {boolean}  value  Use GeoJSON data?
         */
        set: function (value) {
            if (this.setPropertyValue("getDataFromJSON", value)) {
                this.invalidateData();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapSeries.prototype, "minColor", {
        /**
         * @return {Color} Lowest color
         */
        get: function () {
            return this.getPropertyValue("minColor");
        },
        /**
         * Color for the lowest value in a heat map.
         *
         * In heat map, each object will be colored with an intermediate color
         * between `minColor` and `maxColor` based on their `value` position between
         * `min` and `max`.
         *
         * @param {Color}  value  Lowest color
         */
        set: function (value) {
            this.setPropertyValue("minColor", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapSeries.prototype, "maxColor", {
        /**
         * @return {Color} Highest color
         */
        get: function () {
            return this.getPropertyValue("maxColor");
        },
        /**
         * Color for the highest value in a heat map.
         *
         * In heat map, each object will be colored with an intermediate color
         * between `minColor` and `maxColor` based on their `value` position between
         * `min` and `max`.
         *
         * @param {Color}  value  Highest color
         */
        set: function (value) {
            this.setPropertyValue("maxColor", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapSeries.prototype, "max", {
        /**
         * @return {number} Highest value
         */
        get: function () {
            var max = this._max;
            if ($type.isNumber(max)) {
                return max;
            }
            else {
                var dataItem = this.dataItem;
                if (dataItem) {
                    return dataItem.values.value.high;
                }
            }
        },
        /**
         * User-defined highest value in the series.
         *
         * If not set, the map will use the highest `value` out of actual items in
         * the series.
         *
         * This is used to determine object's color in a heat map.
         *
         * @param {number}  value  Highest value
         */
        set: function (value) {
            this._max = value;
            this.invalidateData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapSeries.prototype, "min", {
        /**
         * @return {number} Lowest value
         */
        get: function () {
            var min = this._min;
            if ($type.isNumber(min)) {
                return min;
            }
            else {
                var dataItem = this.dataItem;
                if (dataItem) {
                    return dataItem.values.value.low;
                }
            }
        },
        /**
         * User-defined lowest value in the series.
         *
         * If not set, the map will use the lowest `value` out of actual items in
         * the series.
         *
         * This is used to determine object's color in a heat map.
         *
         * @param {number}  value  Lowest value
         */
        set: function (value) {
            this._min = value;
            this.invalidateData();
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
}(Series));
export { MapSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
system.registeredClasses["MapSeries"] = MapSeries;
system.registeredClasses["MapSeriesDataItem"] = MapSeriesDataItem;
//# sourceMappingURL=MapSeries.js.map