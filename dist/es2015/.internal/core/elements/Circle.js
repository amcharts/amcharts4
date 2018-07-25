/**
 * Functionality for drawing circles.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../Sprite";
import { percent } from "../utils/Percent";
import { registry } from "../Registry";
import * as $utils from "../utils/Utils";
import * as $math from "../utils/Math";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to create a circle
 * @see {@link ICircleEvents} for a list of available events
 * @see {@link ICircleAdapters} for a list of available Adapters
 */
var Circle = /** @class */ (function (_super) {
    tslib_1.__extends(Circle, _super);
    /**
     * Constructor
     */
    function Circle() {
        var _this = _super.call(this) || this;
        _this.radius = percent(100);
        _this.className = "Circle";
        _this.element = _this.paper.add("circle");
        _this.horizontalCenter = "middle";
        _this.verticalCenter = "middle";
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the circle.
     */
    Circle.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.element.attr({ "r": this.pixelRadius });
    };
    Object.defineProperty(Circle.prototype, "radius", {
        /**
         * @return {number} Radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Radius of the circle.
         *
         * Can be either absolute (pixels) or relative ([Percent]).
         *
         * @param {number | Percent}  value  Radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "pixelRadius", {
        /**
         * Radius of the circle in pixels.
         *
         * This is a read-only property. To set radius in pixels, use `radius`
         * property.
         *
         * @readonly
         * @return {number} Radius (px)
         */
        get: function () {
            return $utils.relativeToValue(this.radius, $math.min(this.innerWidth / 2, this.innerHeight / 2));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates bounding box.
     *
     * @ignore Exclude from docs
     */
    Circle.prototype.measureElement = function () {
        this.bbox = {
            x: -this.pixelRadius,
            y: -this.pixelRadius,
            width: this.pixelRadius * 2,
            height: this.pixelRadius * 2
        };
    };
    return Circle;
}(Sprite));
export { Circle };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Circle"] = Circle;
//# sourceMappingURL=Circle.js.map