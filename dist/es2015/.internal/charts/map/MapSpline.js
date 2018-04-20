/**
 * Map spline module
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
import { Polyspline } from "../../core/elements/Polyspline";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw a spline on the map.
 *
 * @see {@link IMapSplineEvents} for a list of available events
 * @see {@link IMapSplineAdapters} for a list of available Adapters
 */
var MapSpline = /** @class */ (function (_super) {
    __extends(MapSpline, _super);
    /**
     * Constructor
     */
    function MapSpline() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapSpline";
        // Create a spline
        _this.line = new Polyspline();
        _this.line.tensionX = 0.8;
        _this.line.tensionY = 0.8;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(MapSpline.prototype, "shortestDistance", {
        /**
         * ShortestDistance = true is not supported by MapSpline, only MapLine does support it
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
    return MapSpline;
}(MapLine));
export { MapSpline };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapSpline"] = MapSpline;
//# sourceMappingURL=MapSpline.js.map