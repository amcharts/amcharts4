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
import { MapLineSeries, MapLineSeriesDataItem } from "./MapLineSeries";
import { MapArc } from "./MapArc";
import { registry } from "../../core/Registry";
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
                this._mapLine = this.component.mapLines.create(MapArc);
                this.addSprite(this._mapLine);
            }
            return this._mapLine;
        },
        enumerable: true,
        configurable: true
    });
    return MapArcSeriesDataItem;
}(MapLineSeriesDataItem));
export { MapArcSeriesDataItem };
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
        return new MapArc();
    };
    return MapArcSeries;
}(MapLineSeries));
export { MapArcSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapArcSeries"] = MapArcSeries;
registry.registeredClasses["MapArcSeriesDataItem"] = MapArcSeriesDataItem;
//# sourceMappingURL=MapArcSeries.js.map