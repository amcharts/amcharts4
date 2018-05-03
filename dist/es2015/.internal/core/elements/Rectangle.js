/**
 * Functionality for drawing rectangles.
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
import { Sprite } from "../Sprite";
import { registry } from "../Registry";
import * as $math from "../utils/Math";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw a rectangle.
 *
 * @see {@link IRectangleEvents} for a list of available events
 * @see {@link IRectangleAdapters} for a list of available Adapters
 */
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    /**
     * Constructor
     * * Creates a `<rect>` element
     * * Creates default state
     */
    function Rectangle() {
        var _this = _super.call(this) || this;
        _this.className = "Rectangle";
        _this.element = _this.paper.add("rect");
        _this.pixelPerfect = true;
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    Rectangle.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var precision = this._positionPrecision;
        if (this.pixelPerfect) {
            precision = 0;
        }
        var w = $math.round(this.innerWidth, precision);
        var h = $math.round(this.innerHeight, precision);
        this.element.attr({
            "width": w,
            "height": h
        });
    };
    /**
     * Updates bounding box based on element dimension settings.
     *
     * @ignore Exclude from docs
     */
    Rectangle.prototype.measureElement = function () {
        this._bbox = {
            x: 0,
            y: 0,
            width: this.innerWidth,
            height: this.innerHeight
        };
    };
    return Rectangle;
}(Sprite));
export { Rectangle };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Rectangle"] = Rectangle;
//# sourceMappingURL=Rectangle.js.map