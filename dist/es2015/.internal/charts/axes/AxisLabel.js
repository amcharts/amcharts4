/**
 * Axis Label module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Label } from "../../core/elements/Label";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Use to create labels on Axis.
 *
 * @see {@link IAxisLabelEvents} for a list of available events
 * @see {@link IAxisLabelAdapters} for a list of available Adapters
 * @important
 */
var AxisLabel = /** @class */ (function (_super) {
    tslib_1.__extends(AxisLabel, _super);
    /**
     * Constructor
     */
    function AxisLabel() {
        var _this = _super.call(this) || this;
        _this.className = "AxisLabel";
        _this.isMeasured = false;
        _this.padding(10, 10, 10, 10);
        _this.renderingFrequency = 1;
        _this.location = 0.5;
        _this.nonScaling = true;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(AxisLabel.prototype, "location", {
        /**
         * @return {AxisItemLocation} Location (0-1)
         */
        get: function () {
            return this.getPropertyValue("location");
        },
        /**
         * Relative location of the label. (0-1)
         *
         * @param {AxisItemLocation}  value  Location (0-1)
         */
        set: function (value) {
            this.setPropertyValue("location", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisLabel.prototype, "inside", {
        /**
         * Returns if label is set to be drawn inside axis.
         *
         * @return {boolean} Inside?
         */
        get: function () {
            return this.getPropertyValue("inside");
        },
        /**
         * Sets if label should be drawn inside axis.
         *
         * @param {boolean}  value  Inside?
         */
        set: function (value) {
            this.setPropertyValue("inside", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return AxisLabel;
}(Label));
export { AxisLabel };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisLabel"] = AxisLabel;
//# sourceMappingURL=AxisLabel.js.map