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
import { Container } from "../../core/Container";
import { registry } from "../../core/Registry";
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
    tslib_1.__extends(MapLineObject, _super);
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
         * @return {number} Position within the line
         */
        get: function () {
            return this.getPropertyValue("position");
        },
        /**
         * Sets object's relative position (0-1) within the line.
         *
         * `0` will place the object at the beginning of the line. `1` - at the end.
         *
         * Any intermediate number will place the object at some point within the
         * line.
         *
         * @param {number}  value  Position within the line (0-1)
         */
        set: function (value) {
            this.setPropertyValue("position", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapLineObject.prototype, "adjustRotation", {
        /**
         * @return {boolean} Auto-rotate
         */
        get: function () {
            return this.getPropertyValue("adjustRotation");
        },
        /**
         * If set to `true`, the object will be automatically rotated to face the
         * direction of the line at the specific position.
         *
         * This allows creating images that has its "front" always facing the logical
         * direction of the line.
         *
         * @default false
         * @param {boolean}  value  Auto-rotate
         */
        set: function (value) {
            this.setPropertyValue("adjustRotation", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    return MapLineObject;
}(Container));
export { MapLineObject };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapLineObject"] = MapLineObject;
//# sourceMappingURL=MapLineObject.js.map