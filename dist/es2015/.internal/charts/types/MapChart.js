/**
 * Map module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SerialChart, SerialChartDataItem } from "./SerialChart";
import { MapSeries } from "../map/MapSeries";
import { MapImage } from "../map/MapImage";
import { MapPolygon } from "../map/MapPolygon";
import { Projection } from "../map/projections/Projection";
import { SmallMap } from "../map/SmallMap";
import { keyboard } from "../../core/utils/Keyboard";
import { getInteraction } from "../../core/interaction/Interaction";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $ease from "../../core/utils/Ease";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $geo from "../map/Geo";
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
    tslib_1.__extends(MapChartDataItem, _super);
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
}(SerialChartDataItem));
export { MapChartDataItem };
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
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/map/} for documentation
 */
var MapChart = /** @class */ (function (_super) {
    tslib_1.__extends(MapChart, _super);
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
        _this.zoomEasing = $ease.cubicOut;
        /**
         * Smallest available zoom level. The map will not allow to zoom out past
         * this setting.
         *
         * NOTE: Should be power of 2.
         *
         * @default 1
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
        _this.projection = new Projection();
        _this.deltaLongitude = 0;
        _this.maxPanOut = 0.7;
        _this.homeZoomLevel = 1;
        // Set padding
        _this.padding(0, 0, 0, 0);
        // so that the map would render in a hidden div too
        _this.minWidth = 10;
        _this.minHeight = 10;
        _this.events.once("inited", _this.handleAllInited, _this, false);
        // Create a container for map series
        var seriesContainer = _this.seriesContainer;
        seriesContainer.draggable = true;
        seriesContainer.visible = false;
        seriesContainer.inert = true;
        seriesContainer.resizable = true;
        seriesContainer.events.on("transformed", _this.handleMapTransform, _this, false);
        seriesContainer.events.on("doublehit", _this.handleDoubleHit, _this, false);
        seriesContainer.events.on("drag", _this.handleDrag, _this, false);
        seriesContainer.zIndex = 0;
        seriesContainer.background.fillOpacity = 0;
        // Set up events
        //this.events.on("validated", this.updateExtremes, this);
        _this.events.on("datavalidated", _this.updateExtremes, _this, false);
        // Set up main chart container, e.g. set backgrounds and events to monitor
        // size changes, etc.
        var chartContainer = _this.chartContainer;
        chartContainer.parent = _this;
        chartContainer.isMeasured = false;
        chartContainer.zIndex = -1;
        _this._disposers.push(seriesContainer.events.on("maxsizechanged", function () {
            if (_this.inited) {
                if (_this._mapAnimation) {
                    _this._mapAnimation.stop();
                }
                _this.updateScaleRatio();
                _this.zoomToGeoPoint(_this._zoomGeoPointReal, _this.zoomLevel, true, 0);
                _this.series.each(function (series) {
                    series.updateTooltipBounds();
                });
            }
        }, undefined, false));
        var chartContainerBg = chartContainer.background;
        chartContainerBg.fillOpacity = 0;
        chartContainerBg.events.on("down", function (e) { _this.seriesContainer.dragStart(e.target.interactions.downPointers.getIndex(0)); }, _this);
        chartContainerBg.events.on("up", function (e) { _this.seriesContainer.dragStop(); }, _this);
        chartContainerBg.events.on("doublehit", _this.handleDoubleHit, _this);
        chartContainerBg.focusable = true;
        chartContainer.events.on("down", _this.handleMapDown, _this, false);
        // Add description to background
        _this.background.fillOpacity = 0;
        _this.background.readerTitle = _this.language.translate("Use plus and minus keys on your keyboard to zoom in and out");
        // Add keyboard events for panning
        _this._disposers.push(getInteraction().body.events.on("keyup", function (ev) {
            if (_this.topParent.hasFocused && (!_this._zoomControl || !_this._zoomControl.thumb.isFocused)) {
                switch (keyboard.getEventKey(ev.event)) {
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
        }, _this));
        _this.mouseWheelBehavior = "zoom";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    MapChart.prototype.handleAllInited = function () {
        var inited = true;
        this.seriesContainer.visible = true;
        this.series.each(function (series) {
            if (!series.inited) {
                inited = false;
            }
        });
        if (inited) {
            this.updateExtremes();
            this.goHome(0);
        }
        else {
            registry.events.once("exitframe", this.handleAllInited, this, false);
        }
    };
    /**
     * Prevents map to be dragged out of the container area
     * @ignore
     */
    MapChart.prototype.handleDrag = function () {
        // not good doing it with adapters.
        var ww = this.seriesWidth * this.zoomLevel * this.scaleRatio;
        var hh = this.seriesHeight * this.zoomLevel * this.scaleRatio;
        var x = this.seriesContainer.pixelX;
        var y = this.seriesContainer.pixelY;
        var maxPanOut = this.maxPanOut;
        var minX = Math.min(this.maxWidth * (1 - maxPanOut) - ww / 2, -ww * (maxPanOut - 0.5));
        if (x < minX) {
            x = minX;
        }
        var maxX = Math.max(this.maxWidth * maxPanOut + ww / 2, this.maxWidth + ww * (maxPanOut - 0.5));
        if (x > maxX) {
            x = maxX;
        }
        var minY = Math.min(this.maxHeight * (1 - maxPanOut) - hh / 2, -hh * (maxPanOut - 0.5));
        if (y < minY) {
            y = minY;
        }
        var maxY = Math.max(this.maxHeight * maxPanOut + hh / 2, this.maxHeight + hh * (maxPanOut - 0.5));
        if (y > maxY) {
            y = maxY;
        }
        this.seriesContainer.moveTo({ x: x, y: y }, undefined, undefined, true);
        this._zoomGeoPointReal = this.zoomGeoPoint;
    };
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    MapChart.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Map");
        }
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
        var svgPoint = $utils.documentPointToSvg(event.point, this.htmlContainer);
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
        var svgPoint = $utils.documentPointToSvg(event.point, this.htmlContainer);
        var geoPoint = this.svgPointToGeo(svgPoint);
        if (event.shift.y < 0) {
            this.zoomIn(geoPoint);
        }
        else {
            this.zoomOut(geoPoint);
        }
    };
    Object.defineProperty(MapChart.prototype, "mouseWheelBehavior", {
        /**
         * @return { "zoom" | "none"}  mouse wheel behavior
         */
        get: function () {
            return this.getPropertyValue("mouseWheelBehavior");
        },
        /**
         * Specifies what should chart do if when mouse wheel is rotated.
         *
         * @param {"zoom" | "none"} mouse wheel behavior
         * @default zoomX
         */
        set: function (value) {
            if (this.setPropertyValue("mouseWheelBehavior", value)) {
                if (value != "none") {
                    this._mouseWheelDisposer = this.chartContainer.events.on("wheel", this.handleWheel, this, false);
                    this._disposers.push(this._mouseWheelDisposer);
                }
                else {
                    if (this._mouseWheelDisposer) {
                        this._mouseWheelDisposer.dispose();
                    }
                    this.chartContainer.wheelable = false;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
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
         * map.projection = new am4maps.projections.Mercator();
         * ```
         * ```JavaScript
         * map.projection = new am4maps.projections.Mercator();
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
            projection.deltaLongitude = this.deltaLongitude;
            if (this.setPropertyValue("projection", projection)) {
                this.invalidateProjection();
            }
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
        var pWest = this.west;
        var pEast = this.east;
        var pNorth = this.north;
        var pSouth = this.south;
        this.west = null;
        this.east = null;
        this.north = null;
        this.south = null;
        var chartContainer = this.chartContainer;
        $iter.each(this.series.iterator(), function (series) {
            if ((_this.west > series.west) || !$type.isNumber(_this.west)) {
                _this.west = series.west;
            }
            if ((_this.east < series.east) || !$type.isNumber(_this.east)) {
                _this.east = series.east;
            }
            if ((_this.north < series.north) || !$type.isNumber(_this.north)) {
                _this.north = series.north;
            }
            if ((_this.south > series.south) || !$type.isNumber(_this.south)) {
                _this.south = series.south;
            }
        });
        if ($type.isNumber(this.east) && $type.isNumber(this.north)) {
            // must reset
            this.projection.centerPoint = { x: 0, y: 0 };
            this.projection.scale = 1;
            // temporary setting deltaLongitude to 0 in order to measure w/h correctly
            var deltaLongitude = this.projection.deltaLongitude;
            this.projection.deltaLongitude = 0;
            var northPoint = this.projection.convert({ longitude: (this.east - this.west) / 2, latitude: this.north });
            var southPoint = this.projection.convert({ longitude: (this.east - this.west) / 2, latitude: this.south });
            var westPoint = this.projection.convert({ longitude: this.west, latitude: 0 });
            var eastPoint = this.projection.convert({ longitude: this.east, latitude: 0 });
            this.projection.deltaLongitude = deltaLongitude;
            this.projection.centerPoint = { x: westPoint.x + (eastPoint.x - westPoint.x) / 2, y: northPoint.y + (southPoint.y - northPoint.y) / 2 };
            var scaleRatio = void 0;
            var seriesWidth = eastPoint.x - westPoint.x;
            var seriesHeight = southPoint.y - northPoint.y;
            var vScale = chartContainer.innerWidth / seriesWidth;
            var hScale = chartContainer.innerHeight / seriesHeight;
            if (vScale > hScale) {
                scaleRatio = hScale;
            }
            else {
                scaleRatio = vScale;
            }
            if ($type.isNaN(scaleRatio) || scaleRatio == Infinity) {
                scaleRatio = 1;
            }
            var projectionScaleChanged = false;
            if (this.projection.scale != scaleRatio) {
                this.projection.scale = scaleRatio;
                projectionScaleChanged = true;
            }
            this.seriesWidth = seriesWidth * scaleRatio;
            this.seriesHeight = seriesHeight * scaleRatio;
            var northPoint2 = this.projection.convert({ longitude: (this.east - this.west) / 2, latitude: this.north });
            var westPoint2 = this.projection.convert({ longitude: this.west - this.deltaLongitude, latitude: 0 });
            this._centerGeoPoint = this.projection.invert({ x: westPoint2.x + this.seriesWidth / 2, y: northPoint2.y + this.seriesHeight / 2 });
            //this.seriesContainer.width = this.seriesWidth; // not good, doesn't resize
            //this.seriesContainer.height = this.seriesHeight; // not good, doesn't resize
            this.seriesContainer.definedBBox = { x: westPoint2.x, y: northPoint2.y, width: this.seriesWidth, height: this.seriesHeight };
            this.updateScaleRatio();
            var seriesContainer = this.seriesContainer;
            seriesContainer.x = chartContainer.pixelWidth / 2;
            seriesContainer.y = chartContainer.pixelHeight / 2;
            if (projectionScaleChanged || pWest != this.west || pEast != this.east || pNorth != this.north || pSouth != this.south) {
                $iter.each(this.series.iterator(), function (series) {
                    series.invalidate();
                });
            }
        }
    };
    /**
     * (Re)calculates a ratio which should be used to scale the actual map so
     * that it fits perfectly into available space. Helps to avoid redrawing of all the map if container size changes
     * @ignore
     */
    MapChart.prototype.updateScaleRatio = function () {
        var scaleRatio;
        var vScale = this.chartContainer.innerWidth / this.seriesWidth;
        var hScale = this.chartContainer.innerHeight / this.seriesHeight;
        if (vScale > hScale) {
            scaleRatio = hScale;
        }
        else {
            scaleRatio = vScale;
        }
        if ($type.isNaN(scaleRatio) || scaleRatio == Infinity) {
            scaleRatio = 1;
        }
        if (scaleRatio != this.scaleRatio) {
            this.scaleRatio = scaleRatio;
            $iter.each(this.series.iterator(), function (series) {
                series.scale = scaleRatio;
                series.updateTooltipBounds();
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
            var seriesPoint = $utils.svgPointToSprite(point, series);
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
            return $utils.spritePointToSvg(seriesPoint, series);
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
                $iter.each(this._dataUsers.iterator(), function (x) {
                    x.invalidateData();
                });
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
        var _this = this;
        if (!point) {
            point = this.zoomGeoPoint;
        }
        if (!point) {
            return;
        }
        this._zoomGeoPointReal = point;
        zoomLevel = $math.fitToRange(zoomLevel, this.minZoomLevel, this.maxZoomLevel);
        var seriesPoint = this.projection.convert(point);
        var svgPoint = this.geoPointToSVG(point);
        var mapPoint = $utils.svgPointToSprite(svgPoint, this);
        if (center) {
            mapPoint = {
                x: this.maxWidth / 2,
                y: this.maxHeight / 2
            };
        }
        if (!$type.isNumber(duration)) {
            duration = this.zoomDuration;
        }
        this._mapAnimation = this.seriesContainer.animate([{
                property: "scale",
                to: zoomLevel
            }, {
                property: "x",
                to: mapPoint.x - seriesPoint.x * zoomLevel * this.scaleRatio - this.pixelPaddingLeft
            }, {
                property: "y",
                to: mapPoint.y - seriesPoint.y * zoomLevel * this.scaleRatio - this.pixelPaddingTop
            }], duration, this.zoomEasing);
        this._disposers.push(this._mapAnimation.events.on("animationended", function () {
            _this._zoomGeoPointReal = _this.zoomGeoPoint;
        }));
        this.seriesContainer.validatePosition();
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
        if (mapObject instanceof MapImage) {
            if ($type.isNaN(zoomLevel)) {
                zoomLevel = 5;
            }
            return this.zoomToGeoPoint({ latitude: mapObject.latitude, longitude: mapObject.longitude }, zoomLevel, center, duration);
        }
        var dataItem = mapObject.dataItem;
        if (dataItem && $type.isNumber(dataItem.zoomLevel)) {
            zoomLevel = dataItem.zoomLevel;
        }
        if (mapObject instanceof MapPolygon) {
            var dataItem_1 = mapObject.dataItem;
            var bbox = mapObject.polygon.bbox;
            if (!$type.isNumber(zoomLevel)) {
                zoomLevel = Math.min(this.seriesWidth / bbox.width, this.seriesHeight / bbox.height);
            }
            var geoPoint = void 0;
            if (dataItem_1 && $type.hasValue(dataItem_1.zoomGeoPoint)) {
                geoPoint = dataItem_1.zoomGeoPoint;
            }
            else {
                // this is more accurate
                var polygonPoint = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
                var seriesPoint = $utils.spritePointToSprite(polygonPoint, mapObject.polygon, mapObject.series);
                geoPoint = this.seriesPointToGeo(seriesPoint);
            }
            return this.zoomToGeoPoint(geoPoint, zoomLevel, true, duration);
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
        if ($type.isNaN(level)) {
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
            var point = $utils.spritePointToSvg({ x: this.pixelWidth / 2, y: this.pixelHeight / 2 }, this);
            return this.svgPointToGeo(point);
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
            this._prevZoomLevel = this.zoomLevel;
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
                var smallMap = new SmallMap();
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
         * map.smallMap = new am4maps.SmallMap();
         * ```
         * ```JavaScript
         * // Create a small map
         * map.smallMap = new am4maps.SmallMap();
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
         * map.zoomControl = new am4maps.ZoomControl();
         * ```
         * ```JavaScript
         * // Create a zoom control
         * map.zoomControl = new am4maps.ZoomControl();
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
        return new MapSeries();
    };
    Object.defineProperty(MapChart.prototype, "deltaLongitude", {
        /**
         * @return {number} Map center shift
         */
        get: function () {
            return this.getPropertyValue("deltaLongitude");
        },
        /**
         * Degrees to shift map center by.
         *
         * E.g. if set to -160, the longitude 20 will become a new center, creating
         * a Pacific-centered map.
         *
         * @param {number}  value  Map center shift
         */
        set: function (value) {
            if (this.setPropertyValue("deltaLongitude", $geo.wrapAngleTo180(value))) {
                this.invalidateProjection();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapChart.prototype, "maxPanOut", {
        /**
         * @return {number} Max pan out
         */
        get: function () {
            return this.getPropertyValue("maxPanOut");
        },
        /**
         * Max pan out
         *
         * @param {number} Max pan out
         */
        set: function (value) {
            this.setPropertyValue("maxPanOut", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapChart.prototype, "homeGeoPoint", {
        /**
         * @return {IGeoPoint} Home geo point
         */
        get: function () {
            return this.getPropertyValue("homeGeoPoint");
        },
        /**
         * The geographical point to center map on when it is first loaded.
         *
         * The map will also be centered to this point when you call `goHome()`
         * method.
         *
         * @param {IGeoPoint}  value  Home geo point
         */
        set: function (value) {
            this.setPropertyValue("homeGeoPoint", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapChart.prototype, "homeZoomLevel", {
        /**
         * @return {number} Home zoom level
         */
        get: function () {
            return this.getPropertyValue("homeZoomLevel");
        },
        /**
         * The zoom level to put the map in when it is first loaded.
         *
         * The map will also be set to this zoom level when you call `goHome()`
         * method.
         *
         * @param {number}  value  Home zoom level
         */
        set: function (value) {
            this.setPropertyValue("homeZoomLevel", value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Invalidates projection, causing all series to be redrawn.
     */
    MapChart.prototype.invalidateProjection = function () {
        this.updateExtremes();
        //		this.projection.deltaLatitude = this.deltaLatitude;
        this.projection.deltaLongitude = this.deltaLongitude;
        $iter.each(this.series.iterator(), function (series) {
            series.invalidate();
        });
    };
    Object.defineProperty(MapChart.prototype, "geodataSource", {
        /**
         * Returns a [[DataSource]] specifically for loading Component's data.
         *
         * @return {DataSource} Data source
         */
        get: function () {
            if (!this._dataSources["geodata"]) {
                this.getDataSource("geodata");
            }
            return this._dataSources["geodata"];
        },
        /**
         * Sets a [[DataSource]] to be used for loading Component's data.
         *
         * @param {DataSource} value Data source
         */
        set: function (value) {
            var _this = this;
            if (this._dataSources["geodata"]) {
                this.removeDispose(this._dataSources["geodata"]);
            }
            this._dataSources["geodata"] = value;
            this._dataSources["geodata"].component = this;
            this.events.on("inited", function () {
                _this.loadData("geodata");
            }, this, false);
            this.setDataSourceEvents(value, "geodata");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    MapChart.prototype.processConfig = function (config) {
        // Instantiate projection
        if ($type.hasValue(config["projection"]) && $type.isString(config["projection"])) {
            config["projection"] = this.createClassInstance(config["projection"]);
        }
        // Set up small map
        if ($type.hasValue(config.smallMap) && !$type.hasValue(config.smallMap.type)) {
            config.smallMap.type = "SmallMap";
        }
        // Set up zoom control
        if ($type.hasValue(config.zoomControl) && !$type.hasValue(config.zoomControl.type)) {
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
    Object.defineProperty(MapChart.prototype, "centerGeoPoint", {
        /**
         * Geo point of map center
         *
         * @readonly
         * @type {IPoint}
         */
        get: function () {
            return this._centerGeoPoint;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resets the map to its original position and zoom level.
     */
    MapChart.prototype.goHome = function (duration) {
        var homeGeoPoint = this.homeGeoPoint;
        if (!homeGeoPoint) {
            homeGeoPoint = this.centerGeoPoint;
        }
        if (homeGeoPoint) {
            this.zoomToGeoPoint(homeGeoPoint, this.homeZoomLevel, true, duration);
        }
    };
    /**
     * Sets [[Paper]] instance to use to draw elements.
     * @ignore
     * @param {Paper} paper Paper
     * @return {boolean} true if paper was changed, false, if it's the same
     */
    MapChart.prototype.setPaper = function (paper) {
        if (this.svgContainer) {
            this.svgContainer.hideOverflow = true;
        }
        return _super.prototype.setPaper.call(this, paper);
    };
    /**
     * Prepares the legend instance for use in this chart.
     *
     * @param {Legend}  legend  Legend
     */
    MapChart.prototype.setLegend = function (legend) {
        _super.prototype.setLegend.call(this, legend);
        if (legend) {
            legend.parent = this.chartContainer;
        }
    };
    return MapChart;
}(SerialChart));
export { MapChart };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapChart"] = MapChart;
//# sourceMappingURL=MapChart.js.map