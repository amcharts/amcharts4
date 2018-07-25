import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../../core/Sprite";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * AxisFill is a base class used to defines fill shapes for various
 * type-specific Axes.
 *
 * Axis fills are used to add fills to specific ranges of those axes.
 *
 * @see {@link IAxisFillEvents} for a list of available events
 * @see {@link IAxisFillAdapters} for a list of available Adapters
 * @important
 */
var AxisFill = /** @class */ (function (_super) {
    tslib_1.__extends(AxisFill, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Axis
     */
    function AxisFill(axis) {
        var _this = _super.call(this) || this;
        _this.axis = axis;
        _this.element = _this.paper.add("path");
        _this.className = "AxisFill";
        _this.isMeasured = false;
        _this.location = 0;
        var interfaceColors = new InterfaceColorSet();
        _this.fill = interfaceColors.getFor("alternativeBackground");
        _this.fillOpacity = 0;
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the fill element.
     *
     * @ignore Exclude from docs
     */
    AxisFill.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (this.axis && $type.isNumber(this.startPosition) && $type.isNumber(this.endPosition)) {
            this.fillPath = this.axis.getPositionRangePath(this.startPosition, this.endPosition);
            this.element.attr({ "d": this.fillPath });
        }
    };
    Object.defineProperty(AxisFill.prototype, "startPosition", {
        /**
         * @return {number} Start position
         */
        get: function () {
            return this.getPropertyValue("startPosition");
        },
        /**
         * An actual starting position of the fill.
         *
         * @param {number}  value  Starting position
         */
        set: function (value) {
            this.setPropertyValue("startPosition", value);
            this.invalidate(); // this is needed as relative position might not change when zooming
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisFill.prototype, "endPosition", {
        /**
         * @return {number} End position
         */
        get: function () {
            return this.getPropertyValue("endPosition");
        },
        /**
         * An actual end position of the fill.
         *
         * @param {number} value End position
         */
        set: function (value) {
            this.setPropertyValue("endPosition", value);
            this.invalidate(); // this is needed as relative position might not change when zooming
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisFill.prototype, "location", {
        /**
         * @return {AxisItemLocation} Location (0-1)
         */
        get: function () {
            return this.getPropertyValue("location");
        },
        /**
         * Relative location of the fill. (0-1)
         *
         * @param {number} value Location (0-1)
         */
        set: function (value) {
            this.setPropertyValue("location", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return AxisFill;
}(Sprite));
export { AxisFill };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisFill"] = AxisFill;
//# sourceMappingURL=AxisFill.js.map