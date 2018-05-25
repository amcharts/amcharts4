/**
 * Axis Label module
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
    __extends(AxisLabel, _super);
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