/**
 * Pointed shape module.
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
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a shape with a pointer.
 *
 * @see {@link IPointedShapeEvents} for a list of available events
 * @see {@link IPointedShapeAdapters} for a list of available Adapters
 */
var PointedShape = /** @class */ (function (_super) {
    __extends(PointedShape, _super);
    /**
     * Constructor
     */
    function PointedShape() {
        var _this = _super.call(this) || this;
        _this.className = "PointedShape";
        _this.pointerBaseWidth = 15;
        _this.pointerLength = 10;
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    PointedShape.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (!$type.isNumber(this.pointerX)) {
            this.pointerX = this.pixelWidth / 2;
        }
        if (!$type.isNumber(this.pointerY)) {
            this.pointerY = this.pixelHeight + 10;
        }
    };
    Object.defineProperty(PointedShape.prototype, "pointerBaseWidth", {
        /**
         * @return {number} Width (px)
         */
        get: function () {
            return this.getPropertyValue("pointerBaseWidth");
        },
        /**
         * A width of the pinter's (stem's) thick end (base) in pixels.
         *
         * @default 15
         * @param {number}  value  Width (px)
         */
        set: function (value) {
            this.setPropertyValue("pointerBaseWidth", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointedShape.prototype, "pointerLength", {
        /**
         * @return {number} Length (px)
         */
        get: function () {
            return this.getPropertyValue("pointerLength");
        },
        /**
         * A length of the pinter (stem) in pixels.
         *
         * @default 10
         * @param {number}  value  Length (px)
         */
        set: function (value) {
            this.setPropertyValue("pointerLength", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointedShape.prototype, "pointerX", {
        /**
         * @return {number} X
         */
        get: function () {
            return this.getPropertyValue("pointerX");
        },
        /**
         * X coordinate the shape is pointing to.
         *
         * @param {number}  value  X
         */
        set: function (value) {
            this.setPropertyValue("pointerX", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointedShape.prototype, "pointerY", {
        /**
         * @return {number} Y
         */
        get: function () {
            return this.getPropertyValue("pointerY");
        },
        /**
         * Y coordinate the shape is pointing to.
         *
         * @param {number}  value  Y
         */
        set: function (value) {
            this.setPropertyValue("pointerY", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return PointedShape;
}(Sprite));
export { PointedShape };
//# sourceMappingURL=PointedShape.js.map