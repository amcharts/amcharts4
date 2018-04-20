/**
 * Map arched line module
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
    __extends(MapArc, _super);
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