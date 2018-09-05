/**
 * Map line series module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapSeries, MapSeriesDataItem } from "./MapSeries";
import { MapLine } from "./MapLine";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { registry } from "../../core/Registry";
import * as $mapUtils from "./MapUtils";
import * as $array from "../../core/utils/Array";
import * as $utils from "../../core/utils/Utils";
import * as $iter from "../../core/utils/Iterator";
import { Disposer } from "../../core/utils/Disposer";
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
    tslib_1.__extends(MapLineSeriesDataItem, _super);
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
            var _this = this;
            if (!this._mapLine) {
                var mapLine_1 = this.component.mapLines.create(MapLine);
                this._mapLine = mapLine_1;
                this.addSprite(mapLine_1);
                this._disposers.push(mapLine_1);
                this._disposers.push(new Disposer(function () {
                    _this.component.mapLines.removeValue(mapLine_1);
                }));
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
            this.multiGeoLine = $mapUtils.multiLineToGeo([line]);
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
            this.multiGeoLine = $mapUtils.multiLineToGeo(multiLine);
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
}(MapSeriesDataItem));
export { MapLineSeriesDataItem };
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
    tslib_1.__extends(MapLineSeries, _super);
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
        if (this.useGeodata || this.geodata) {
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
                                var dataObject = $array.find(this_1.data, function (value, i) {
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
                                $utils.copyProperties(feature.properties, dataObject);
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
        // important! this should go after super
        // if data is parsed in chunks, lines list is corrupted, fix it here
        $iter.each(this.dataItems.iterator(), function (dataItem) {
            _this.mapLines.moveValue(dataItem.mapLine);
        });
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
                var mapLines = new ListTemplate(lineTemplate);
                this._disposers.push(new ListDisposer(mapLines));
                this._disposers.push(mapLines.template);
                mapLines.events.on("inserted", this.handleObjectAdded, this);
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
        return new MapLine();
    };
    /**
     * (Re)validates the series
     *
     * @ignore Exclude from docs
     */
    MapLineSeries.prototype.validate = function () {
        _super.prototype.validate.call(this);
        $iter.each(this.mapLines.iterator(), function (mapLine) {
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
}(MapSeries));
export { MapLineSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapLineSeries"] = MapLineSeries;
registry.registeredClasses["MapLineSeriesDataItem"] = MapLineSeriesDataItem;
//# sourceMappingURL=MapLineSeries.js.map