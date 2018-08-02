/**
 * Slice module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../Container";
import { Sprite } from "../Sprite";
import { registry } from "../Registry";
import * as $math from "../utils/Math";
import * as $path from "../rendering/Path";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a wedged semi-circle - slice. Usually used for Pie/Donut charts.
 *
 * @see {@link ISliceEvents} for a list of available events
 * @see {@link ISliceAdapters} for a list of available Adapters
 */
var Slice = /** @class */ (function (_super) {
    tslib_1.__extends(Slice, _super);
    /**
     * Constructor
     */
    function Slice() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "Slice";
        // Set defaults
        _this.cornerRadius = 0;
        _this.startAngle = 0;
        _this.innerRadius = 0;
        _this.radius = 0;
        _this.arc = 0;
        _this.shiftRadius = 0;
        _this.strokeOpacity = 1;
        _this.layout = "none";
        // Create a slice wedge element
        _this.slice = _this.createChild(Sprite);
        _this.slice.element = _this.paper.add("path");
        _this.slice.isMeasured = false;
        _this._disposers.push(_this.slice);
        _this.element.attr({ "stroke-linejoin": "round" });
        _this.element.attr({ "stroke-linecap": "round" });
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    Slice.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.slice.element.attr({ "d": $path.arc(this.startAngle, this.arc, this.radius, this.innerRadius, this.radiusY, this.cornerRadius, this.innerCornerRadius) });
        this.slice.invalidate();
        this.shiftRadius = this.shiftRadius;
    };
    Slice.prototype.getContainerBBox = function () {
        return $math.getArcRect(this.startAngle, this.startAngle + this.arc, this.radius);
    };
    Object.defineProperty(Slice.prototype, "startAngle", {
        /**
         * @return {number} Angle (0-360)
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
        /**
         * The angle at which left edge of the slice is drawn. (0-360)
         *
         * 0 is to the right of the center.
         *
         * @param {number}  value  Angle (0-360)
         */
        set: function (value) {
            this.setPropertyValue("startAngle", $math.normalizeAngle(value), true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice.prototype, "arc", {
        /**
         * @return {number} [description]
         */
        get: function () {
            return this.getPropertyValue("arc");
        },
        /**
         * [arc description]
         *
         * @todo Description
         * @param {number} value [description]
         */
        set: function (value) {
            if (!$type.isNumber(value)) {
                value = 0;
            }
            this.setPropertyValue("arc", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice.prototype, "radius", {
        /**
         * @return {number} Radius (px)
         */
        get: function () {
            var radius = this.getPropertyValue("radius");
            if (!$type.isNumber(radius)) {
                radius = 0;
            }
            return radius;
        },
        /**
         * Radius of the slice in pixels.
         *
         * @param {number}  value  Radius (px)
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice.prototype, "radiusY", {
        /**
         * @return {number} Vertical radius (0-1)
         */
        get: function () {
            var value = this.getPropertyValue("radiusY");
            if (!$type.isNumber(value)) {
                value = this.radius;
            }
            return value;
        },
        /**
         * Vertical radius for creating skewed slices.
         *
         * This is relevant to `radius`, e.g. 0.5 will set vertical radius to half
         * the `radius`.
         *
         * @param {number} value Vertical radius (0-1)
         */
        set: function (value) {
            this.setPropertyValue("radiusY", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice.prototype, "innerRadius", {
        /**
         * @return {number} Radius (px)
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Inner radius of the slice for creating cut out (donut) slices.
         *
         * @default 0
         * @param {number}  value  Radius (px)
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice.prototype, "cornerRadius", {
        /**
         * @return {number} Radius (px)
         */
        get: function () {
            return this.getPropertyValue("cornerRadius");
        },
        /**
         * Radius of slice's outer corners in pixels.
         *
         * @default 0
         * @param {number}  value  Radius (px)
         */
        set: function (value) {
            this.setPropertyValue("cornerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice.prototype, "innerCornerRadius", {
        /**
         * @return {number} Radius (px)
         */
        get: function () {
            return this.getPropertyValue("innerCornerRadius");
        },
        /**
         * Radius of slice's inner corners in pixels.
         *
         * @default 0
         * @param {number}  value  Radius (px)
         */
        set: function (value) {
            this.setPropertyValue("innerCornerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice.prototype, "shiftRadius", {
        /**
         * @return {number} [description]
         */
        get: function () {
            return this.getPropertyValue("shiftRadius");
        },
        /**
         * [shiftRadius description]
         *
         * 0-1
         *
         * @todo Description
         * @param {number} value [description]
         */
        set: function (value) {
            this.setPropertyValue("shiftRadius", value);
            this.dx = value * this.radius * this.ix;
            this.dy = value * this.radiusY * this.iy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice.prototype, "ix", {
        /**
         * [ix description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @return {number} [description]
         */
        get: function () {
            return $math.cos(this.middleAngle);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice.prototype, "iy", {
        /**
         * [iy description]
         *
         * @ignore Exclude from docs
         * @todo Description
         * @return {number} [description]
         */
        get: function () {
            if (this.radius > 0) {
                return $math.sin(this.middleAngle) * this.radiusY / this.radius;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slice.prototype, "middleAngle", {
        /**
         * An angle of the slice's middle.
         *
         * @ignore Exclude from docs
         * @return {number} Angle
         */
        get: function () {
            return this.startAngle + this.arc / 2;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * X coordinate for the slice tooltip.
     *
     * @return {number} X
     */
    Slice.prototype.getTooltipX = function () {
        var value = this.getPropertyValue("tooltipX");
        if (!$type.isNumber(value)) {
            value = this.ix * (this.innerRadius + (this.radius - this.innerRadius) / 2);
        }
        return value;
    };
    /**
     * Y coordinate for the slice tooltip.
     *
     * @return {number} Y
     */
    Slice.prototype.getTooltipY = function () {
        var value = this.getPropertyValue("tooltipY");
        if (!$type.isNumber(value)) {
            value = this.iy * (this.innerRadius + (this.radius - this.innerRadius) / 2);
        }
        return value;
    };
    return Slice;
}(Container));
export { Slice };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Slice"] = Slice;
//# sourceMappingURL=Slice.js.map