/**
 * Map arched line module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { MapLine } from "./MapLine";
import { Polyarc } from "../../core/elements/Polyarc";
import { registry } from "../../core/Registry";
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
    tslib_1.__extends(MapArc, _super);
    /**
     * Constructor
     */
    function MapArc() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapArc";
        // Create a line
        _this.line = new Polyarc();
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
}(MapLine));
export { MapArc };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapArc"] = MapArc;
//# sourceMappingURL=MapArc.js.map