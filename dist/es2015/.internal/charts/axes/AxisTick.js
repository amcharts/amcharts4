/**
 * Axis Tick module
 */
import * as tslib_1 from "tslib";
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
    tslib_1.__extends(AxisTick, _super);
    function AxisTick() {
        var _this = _super.call(this) || this;
        _this.className = "AxisTick";
        _this.element = _this.paper.add("path");
        _this.location = 0.5;
        _this.isMeasured = false;
        _this.pixelPerfect = true;
        _this.strokeOpacity = 0;
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
    /**
     * @ignore
     */
    AxisTick.prototype.setDisabled = function (value) {
        var changed = _super.prototype.setDisabled.call(this, value);
        if (this.axis) {
            this.axis.invalidateDataItems();
        }
        return changed;
    };
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