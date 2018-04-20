/**
 * Axis Tick module
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
import { Tick } from "../elements/Tick";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws an axis tick
 * @see {@link IAxisTickEvents} for a list of available events
 * @see {@link IAxisTickAdapters} for a list of available Adapters
 */
var AxisTick = /** @class */ (function (_super) {
    __extends(AxisTick, _super);
    function AxisTick() {
        var _this = _super.call(this) || this;
        _this.className = "AxisTick";
        _this.element = _this.paper.add("path");
        _this.location = 0.5;
        _this.isMeasured = false;
        _this.pixelPerfect = true;
        _this.length = 5;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(AxisTick.prototype, "location", {
        get: function () {
            return this.getPropertyValue("location");
        },
        set: function (value) {
            this.setPropertyValue("location", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisTick.prototype, "inside", {
        get: function () {
            return this.getPropertyValue("inside");
        },
        set: function (value) {
            this.setPropertyValue("inside", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return AxisTick;
}(Tick));
export { AxisTick };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisTick"] = AxisTick;
//# sourceMappingURL=AxisTick.js.map