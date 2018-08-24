/**
 * Map line module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapObject } from "./MapObject";
import { MapLineObject } from "./MapLineObject";
import { Triangle } from "../../core/elements/Triangle";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { Polyline } from "../../core/elements/Polyline";
import { registry } from "../../core/Registry";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { percent } from "../../core/utils/Percent";
import * as $iter from "../../core/utils/Iterator";
import * as $geo from "./Geo";
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
    tslib_1.__extends(MapLine, _super);
    /**
     * Constructor
     */
    function MapLine() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapLine";
        // Create a line and set its default properties
        _this.line = new Polyline();
        _this.line.stroke = color();
        _this.strokeOpacity = 1;
        var interfaceColors = new InterfaceColorSet();
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
            this.setPropertyValue("multiGeoLine", $geo.normalizeMultiline(multiGeoLine), true);
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
                for (var images_1 = tslib_1.__values(images), images_1_1 = images_1.next(); !images_1_1.done; images_1_1 = images_1.next()) {
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
                for (var _a = tslib_1.__values(this.imagesToConnect), _b = _a.next(); !_b.done; _b = _a.next()) {
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
                    // add last point to avoid gap
                    newGeoLine.push(geoPointB);
                }
                newMultiGeoLine.push(newGeoLine);
            }
            multiGeoLine = newMultiGeoLine;
        }
        this.line.segments = chart.projection.projectGeoLine(multiGeoLine);
        if (this._arrow) {
            this._arrow.validatePosition();
        }
        $iter.each(this.lineObjects.iterator(), function (x) {
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
                this._lineObjects = new ListTemplate(new MapLineObject());
                this._lineObjects.events.on("inserted", this.handleLineObjectAdded, this);
                this._disposers.push(new ListDisposer(this._lineObjects));
                this._disposers.push(this._lineObjects.template);
            }
            return this._lineObjects;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorate a [[LineObject]] when it is added to the line.
     *
     * @param {IListEvents<MapLineObject>["inserted"]}  event  Event
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
                var arrow = this.createChild(MapLineObject);
                arrow.shouldClone = false;
                arrow.width = 8;
                arrow.height = 10;
                arrow.mapLine = this;
                arrow.position = 0.5;
                var triangle = arrow.createChild(Triangle);
                triangle.shouldClone = false;
                triangle.fillOpacity = 1;
                triangle.width = percent(100);
                triangle.height = percent(100);
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
}(MapObject));
export { MapLine };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapLine"] = MapLine;
//# sourceMappingURL=MapLine.js.map