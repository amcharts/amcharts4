/**
 * Functionality for drawing triangles.
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
import * as $path from "../rendering/Path";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw a triangle.
 *
 * @see {@link ITriangleEvents} for a list of available events
 * @see {@link ITriangleAdapters} for a list of available Adapters
 */
var Triangle = /** @class */ (function (_super) {
    __extends(Triangle, _super);
    /**
     * Constructor
     */
    function Triangle() {
        var _this = _super.call(this) || this;
        _this.className = "Triangle";
        _this.element = _this.paper.add("path");
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    Triangle.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var w = this.pixelWidth;
        var h = this.pixelHeight;
        var path;
        switch (this.direction) {
            case "right":
                path = $path.moveTo({ x: 0, y: 0 })
                    + $path.lineTo({ x: w, y: h / 2 })
                    + $path.lineTo({ x: 0, y: h })
                    + $path.closePath();
                break;
            case "left":
                path = $path.moveTo({ x: w, y: 0 })
                    + $path.lineTo({ x: 0, y: h / 2 })
                    + $path.lineTo({ x: w, y: h })
                    + $path.closePath();
                break;
            case "bottom":
                path = $path.moveTo({ x: 0, y: 0 })
                    + $path.lineTo({ x: w, y: 0 })
                    + $path.lineTo({ x: w / 2, y: h })
                    + $path.closePath();
                break;
            case "top":
                path = $path.moveTo({ x: w / 2, y: 0 })
                    + $path.lineTo({ x: w, y: h })
                    + $path.lineTo({ x: 0, y: h })
                    + $path.closePath();
                break;
        }
        this.element.attr({ "d": path });
    };
    Object.defineProperty(Triangle.prototype, "direction", {
        /**
         * Returns direction of a triangle
         *
         * @return {"left" | "right" | "top" | "bottom"} value
         */
        get: function () {
            return this.getPropertyValue("direction");
        },
        /**
         * Sets direction of a triangle
         *
         * @param {"left" | "right" | "top" | "bottom"} value
         */
        set: function (value) {
            this.setPropertyValue("direction", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return Triangle;
}(Sprite));
export { Triangle };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Triangle"] = Triangle;
//# sourceMappingURL=Triangle.js.map