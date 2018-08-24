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
import { AxisLabel } from "./AxisLabel";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Use to create labels on circular axis.
 *
 * @see {@link IAxisLabelCircularEvents} for a list of available events
 * @see {@link IAxisLabelCircularAdapters} for a list of available Adapters
 */
var AxisLabelCircular = /** @class */ (function (_super) {
    tslib_1.__extends(AxisLabelCircular, _super);
    /**
     * Constructor
     */
    function AxisLabelCircular() {
        var _this = _super.call(this) || this;
        _this.className = "AxisLabelCircular";
        _this.padding(0, 0, 0, 0);
        _this.location = 0.5;
        _this.radius = 0;
        _this.isMeasured = false;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(AxisLabelCircular.prototype, "relativeRotation", {
        /**
         * @return {number} Rotation angle
         */
        get: function () {
            return this.getPropertyValue("relativeRotation");
        },
        /**
         * Relative rotation of the label.
         *
         * It is an angle to circle. In case 90, labels will be positioned like rays
         * of light, if 0 - positione along the circle.
         *
         * @param {number} value Rotation angle
         */
        set: function (value) {
            this.setPropertyValue("relativeRotation", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisLabelCircular.prototype, "radius", {
        /**
         * @return {number} Distance (px)
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Distance from axis circle to label in pixels.
         *
         * @param {number} value Distance (px)
         */
        set: function (value) {
            // No percent here, as it would be quite complicated to calculate radius
            // of a chart together with axis label radius
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [fixPoint description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {IPoint}  point       Label affixation point
     * @param  {number}  axisRadius  Distance from point (px)
     * @return {IPoint}              [description]
     */
    AxisLabelCircular.prototype.fixPoint = function (point, axisRadius) {
        var angle = $math.DEGREES * Math.atan2(point.y, point.x);
        if (this.invalid) {
            this.validate(); //@todo" check if we need this
        }
        var sign = 1;
        if (this.inside) {
            sign = -1;
        }
        var relativeRotation = this.relativeRotation;
        // we don't use valign for labels because then they would jump while animating. instead we modify dy depending on a y position
        // this math makes dy to be 1 at the top of the circle, 0.5 at the middle and 1 at the bottom
        // @todo with this math doesn't work well with inside = true
        this.dy = -this._measuredHeight * (1 - (point.y + axisRadius) / (2 * axisRadius));
        // simmilar with dx
        this.dx = -this._measuredWidth * (1 - (point.x + axisRadius) / (2 * axisRadius));
        //console.log(this.measuredWidth, this._measuredHeight, this.text, this.bbox.width)
        var labelRadius = this.radius * sign;
        if ($type.isNumber(relativeRotation)) {
            var pixelWidth = this.bbox.width;
            var pixelHeight = this.bbox.height;
            if (angle > 90 || angle < -90) {
                if (relativeRotation == -90) {
                    relativeRotation = 90;
                    pixelWidth = 0;
                }
            }
            else {
                if (relativeRotation == -90) {
                    pixelHeight = -pixelHeight;
                }
                if (relativeRotation == 90) {
                    relativeRotation = -90;
                    pixelWidth = 0;
                    pixelHeight = -pixelHeight;
                }
            }
            this.rotation = relativeRotation + angle + 90;
            var dH = $math.sin(relativeRotation) / 2;
            var dW = $math.cos(relativeRotation) / 2;
            var rotation = this.rotation;
            this.dx = pixelHeight * dH * $math.sin(rotation) - pixelWidth * dW * $math.cos(rotation);
            this.dy = -pixelHeight * dH * $math.cos(rotation) - pixelWidth * dW * $math.sin(rotation);
            var pixelPaddingBottom = this.pixelPaddingBottom;
            var pixelPaddingTop = this.pixelPaddingTop;
            var pixelPaddingLeft = this.pixelPaddingLeft;
            var pixelPaddingRight = this.pixelPaddingRight;
            if (!this.inside) {
                labelRadius += (pixelHeight + pixelPaddingBottom + pixelPaddingTop) * $math.cos(relativeRotation) + (pixelWidth + pixelPaddingLeft + pixelPaddingRight) * $math.sin(relativeRotation);
            }
            else {
                labelRadius -= (pixelPaddingBottom + pixelPaddingTop) * $math.cos(relativeRotation) + (pixelPaddingLeft + pixelPaddingRight) * $math.sin(relativeRotation);
            }
        }
        point.x += $math.cos(angle) * labelRadius;
        point.y += $math.sin(angle) * labelRadius;
        return point;
    };
    return AxisLabelCircular;
}(AxisLabel));
export { AxisLabelCircular };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisLabelCircular"] = AxisLabelCircular;
//# sourceMappingURL=AxisLabelCircular.js.map