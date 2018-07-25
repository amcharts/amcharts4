/**
 * Map polygon module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapObject } from "./MapObject";
import { Polygon } from "../../core/elements/Polygon";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
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
    tslib_1.__extends(MapPolygon, _super);
    /**
     * Constructor
     */
    function MapPolygon() {
        var _this = _super.call(this) || this;
        _this.className = "MapPolygon";
        _this.polygon = _this.createChild(Polygon);
        _this.polygon.shouldClone = false;
        var interfaceColors = new InterfaceColorSet();
        _this.fill = interfaceColors.getFor("secondaryButton");
        _this.stroke = interfaceColors.getFor("secondaryButtonStroke");
        _this.strokeOpacity = 1;
        /*this.events.on("focus", (event) => {
            //this.toFront();
            //this.isFocused = true;
        });*/
        _this.tooltipPosition = "pointer";
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
    return MapPolygon;
}(MapObject));
export { MapPolygon };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapPolygon"] = MapPolygon;
//# sourceMappingURL=MapPolygon.js.map