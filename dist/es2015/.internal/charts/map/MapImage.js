/**
 *
 */
import * as tslib_1 from "tslib";
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
    tslib_1.__extends(MapImage, _super);
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