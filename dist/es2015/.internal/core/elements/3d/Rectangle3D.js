/**
 * Creates a 3D rectangle.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../../Container";
import { Sprite } from "../../Sprite";
import { LightenFilter } from "../../rendering/filters/LightenFilter";
import * as $math from "../../utils/Math";
import * as $path from "../../rendering/Path";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Builds a 3D rectangle
 * @see {@link IRectangle3DEvents} for a list of available events
 * @see {@link IRectangle3DAdapters} for a list of available Adapters
 */
var Rectangle3D = /** @class */ (function (_super) {
    tslib_1.__extends(Rectangle3D, _super);
    /**
     * Constructor
     */
    function Rectangle3D() {
        var _this = _super.call(this) || this;
        _this.angle = 30;
        _this.depth = 30;
        _this.className = "Rectangle3D";
        _this.layout = "none";
        var sideBack = _this.createChild(Sprite);
        sideBack.shouldClone = false;
        sideBack.element = _this.paper.add("path");
        sideBack.isMeasured = false;
        var lightenFilterBack = new LightenFilter();
        lightenFilterBack.lightness = -0.2;
        sideBack.filters.push(lightenFilterBack);
        _this.sideBack = sideBack;
        _this._disposers.push(_this.sideBack);
        var sideBottom = _this.createChild(Sprite);
        sideBottom.shouldClone = false;
        sideBottom.element = _this.paper.add("path");
        sideBottom.isMeasured = false;
        var lightenFilterBottom = new LightenFilter();
        lightenFilterBottom.lightness = -0.5;
        sideBottom.filters.push(lightenFilterBottom);
        _this.sideBottom = sideBottom;
        _this._disposers.push(_this.sideBottom);
        var sideLeft = _this.createChild(Sprite);
        sideLeft.shouldClone = false;
        sideLeft.element = _this.paper.add("path");
        sideLeft.isMeasured = false;
        var lightenFilterLeft = new LightenFilter();
        lightenFilterLeft.lightness = -0.4;
        sideLeft.filters.push(lightenFilterLeft);
        _this.sideLeft = sideLeft;
        _this._disposers.push(_this.sideLeft);
        var sideRight = _this.createChild(Sprite);
        sideRight.shouldClone = false;
        sideRight.element = _this.paper.add("path");
        sideRight.isMeasured = false;
        var lightenFilterRight = new LightenFilter();
        lightenFilterRight.lightness = -0.2;
        sideRight.filters.push(lightenFilterRight);
        _this.sideRight = sideRight;
        _this._disposers.push(_this.sideRight);
        var sideTop = _this.createChild(Sprite);
        sideTop.shouldClone = false;
        sideTop.element = _this.paper.add("path");
        sideTop.isMeasured = false;
        var lightenFilterTop = new LightenFilter();
        lightenFilterTop.lightness = -0.1;
        sideTop.filters.push(lightenFilterTop);
        _this.sideTop = sideTop;
        _this._disposers.push(_this.sideTop);
        var sideFront = _this.createChild(Sprite);
        sideFront.shouldClone = false;
        sideFront.element = _this.paper.add("path");
        sideFront.isMeasured = false;
        _this.sideFront = sideFront;
        _this._disposers.push(_this.sideFront);
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    Rectangle3D.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var w = this.innerWidth;
        var h = this.innerHeight;
        var depth = this.depth;
        var angle = this.angle;
        var sin = $math.sin(angle);
        var cos = $math.cos(angle);
        var a = { x: 0, y: 0 };
        var b = { x: w, y: 0 };
        var c = { x: w, y: h };
        var d = { x: 0, y: h };
        var ah = { x: depth * cos, y: -depth * sin };
        var bh = { x: depth * cos + w, y: -depth * sin };
        var ch = { x: depth * cos + w, y: -depth * sin + h };
        var dh = { x: depth * cos, y: -depth * sin + h };
        this.sideFront.element.attr({ "d": $path.moveTo(a) + $path.lineTo(b) + $path.lineTo(c) + $path.lineTo(d) + $path.closePath() });
        this.sideBack.element.attr({ "d": $path.moveTo(ah) + $path.lineTo(bh) + $path.lineTo(ch) + $path.lineTo(dh) + $path.closePath() });
        this.sideLeft.element.attr({ "d": $path.moveTo(a) + $path.lineTo(ah) + $path.lineTo(dh) + $path.lineTo(d) + $path.closePath() });
        this.sideRight.element.attr({ "d": $path.moveTo(b) + $path.lineTo(bh) + $path.lineTo(ch) + $path.lineTo(c) + $path.closePath() });
        this.sideBottom.element.attr({ "d": $path.moveTo(d) + $path.lineTo(dh) + $path.lineTo(ch) + $path.lineTo(c) + $path.closePath() });
        this.sideTop.element.attr({ "d": $path.moveTo(a) + $path.lineTo(ah) + $path.lineTo(bh) + $path.lineTo(b) + $path.closePath() });
    };
    Object.defineProperty(Rectangle3D.prototype, "depth", {
        /**
         * @return {number} Depth (px)
         */
        get: function () {
            return this.getPropertyValue("depth");
        },
        /**
         * Depth (Z dimension) of the 3D rectangle in pixels.
         *
         * @default 30
         * @param {number}  value  Depth (px)
         */
        set: function (value) {
            this.setPropertyValue("depth", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle3D.prototype, "angle", {
        /**
         * @return {number} Angle
         */
        get: function () {
            return this.getPropertyValue("angle");
        },
        /**
         * Angle of the point of view to the 3D element. (0-360)
         *
         * @default 30
         * @param {number}  value  Angle
         */
        set: function (value) {
            this.setPropertyValue("angle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return Rectangle3D;
}(Container));
export { Rectangle3D };
//# sourceMappingURL=Rectangle3D.js.map