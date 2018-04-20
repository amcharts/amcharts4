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
import { MapObject } from "./MapObject";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";
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
        if ($type.isNumber(this.latitude) && $type.isNumber(this.longitude)) {
            this.moveTo(this.series.chart.projection.convert({ latitude: this.latitude, longitude: this.longitude }));
        }
        _super.prototype.validatePosition.call(this);
    };
    return MapImage;
}(MapObject));
export { MapImage };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapImage"] = MapImage;
//# sourceMappingURL=MapImage.js.map