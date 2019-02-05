/**
 * Functionality for drawing rectangles with waved edges.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Rectangle } from "./Rectangle";
import { wavedLine } from "../rendering/Smoothing";
import * as $path from "../rendering/Path";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a rectangle with waved edges.
 *
 * @see {@link IWavedRectangleEvents} for a list of available events
 * @see {@link IWavedRectangleAdapters} for a list of available Adapters
 */
var WavedRectangle = /** @class */ (function (_super) {
    tslib_1.__extends(WavedRectangle, _super);
    /**
     * Constructor
     */
    function WavedRectangle() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Top waved?
         */
        _this._twaved = true;
        /**
         * Right side waved?
         */
        _this._rwaved = true;
        /**
         * Bottom waved?
         */
        _this._bwaved = true;
        /**
         * Left side waved?
         */
        _this._lwaved = true;
        _this.className = "WavedRectangle";
        // Add path element
        _this.element = _this.paper.add("path");
        // Set defaults
        _this.waveLength = 16;
        _this.waveHeight = 4;
        _this.tension = 0.8;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the waved rectangle.
     *
     * @ignore Exclude from docs
     */
    WavedRectangle.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var w = this.pixelWidth;
        var h = this._pixelHeight;
        if (w > 0 && h > 0) {
            var p1 = { x: 0, y: 0 };
            var p2 = { x: w, y: 0 };
            var p3 = { x: w, y: h };
            var p4 = { x: 0, y: h };
            var waveLength = this.waveLength;
            var waveHeight = this.waveHeight;
            var td = "";
            var rd = "";
            var bd = "";
            var ld = "";
            if (this._twaved) {
                td = wavedLine(p1, p2, waveLength, waveHeight, this.tension, true);
            }
            if (this._rwaved) {
                ld = wavedLine(p2, p3, waveLength, waveHeight, this.tension, true);
            }
            if (this._bwaved) {
                bd = wavedLine(p3, p4, waveLength, waveHeight, this.tension, true);
            }
            if (this._rwaved) {
                rd = wavedLine(p4, p1, waveLength, waveHeight, this.tension, true);
            }
            this.path = $path.moveTo(p1) + td + $path.lineTo(p2) + ld + $path.lineTo(p3) + bd + $path.lineTo(p4) + rd + "z";
        }
    };
    Object.defineProperty(WavedRectangle.prototype, "waveLength", {
        /**
         * @return Wave length (px)
         */
        get: function () {
            return this.getPropertyValue("waveLength");
        },
        /**
         * Wave length in pixels.
         *
         * @default 16
         * @param value  Wave length (px)
         */
        set: function (value) {
            this.setPropertyValue("waveLength", value);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WavedRectangle.prototype, "waveHeight", {
        /**
         * @return Wave height (px)
         */
        get: function () {
            return this.getPropertyValue("waveHeight");
        },
        /**
         * Wave height in pixels.
         *
         * @default 4
         * @param value  Wave height (px)
         */
        set: function (value) {
            this.setPropertyValue("waveHeight", value);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets which side should be waved or not. If particular side is set to
     * `false`, a straight line will be drawn on that side.
     *
     * @param top     Top waved?
     * @param right   Right side waved?
     * @param bottom  Bottom Waved?
     * @param left    Left side waved?
     */
    WavedRectangle.prototype.setWavedSides = function (top, right, bottom, left) {
        this._twaved = top;
        this._lwaved = right;
        this._bwaved = bottom;
        this._rwaved = left;
    };
    Object.defineProperty(WavedRectangle.prototype, "tension", {
        /**
         * @return Tension
         */
        get: function () {
            return this.getPropertyValue("tension");
        },
        /**
         * Tension of the wave.
         *
         * @default 0.8
         * @param value  Tension
         */
        set: function (value) {
            this.setPropertyValue("tension", value);
            this.invalidate();
        },
        enumerable: true,
        configurable: true
    });
    return WavedRectangle;
}(Rectangle));
export { WavedRectangle };
//# sourceMappingURL=WavedRectangle.js.map