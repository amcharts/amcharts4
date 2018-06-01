/**
 * Module, defining Axis Renderer for vertical 3D axes.
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
import { AxisRendererY } from "../axes/AxisRendererY";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Renderer for vertical 3D axis.
 *
 * @see {@link IAxisRendererY3DEvents} for a list of available events
 * @see {@link IAxisRendererY3DAdapters} for a list of available Adapters
 */
var AxisRendererY3D = /** @class */ (function (_super) {
    __extends(AxisRendererY3D, _super);
    /**
     * Constructor.
     *
     * @param {Axis} axis Related axis
     */
    function AxisRendererY3D() {
        var _this = _super.call(this) || this;
        /**
         * A related chart.
         *
         * @todo Description
         * @type {MutableValueDisposer}
         */
        _this._chart = new MutableValueDisposer();
        _this.className = "AxisRendererY3D";
        _this._disposers.push(_this._chart);
        _this.applyTheme();
        return _this;
    }
    /**
     * Updates and positions a grid element.
     *
     * @ignore Exclude from docs
     * @param {Grid}    grid         Grid element
     * @param {number}  position     Starting position
     * @param {number}  endPosition  End position
     */
    AxisRendererY3D.prototype.updateGridElement = function (grid, position, endPosition) {
        position = position + (endPosition - position) * grid.location;
        var point = this.positionToPoint(position);
        if (grid.element) {
            var dx = this.chart.dx3D;
            var dy = this.chart.dy3D;
            var w = this.getWidth();
            grid.element.attr({ "d": $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: dx, y: dy }) + $path.lineTo({ x: w + dx, y: dy }) });
        }
        this.positionItem(grid, point);
        this.toggleVisibility(grid, position, 0, 1);
    };
    /**
     * Updates and positions the base grid element.
     *
     * @ignore Exclude from docs
     */
    AxisRendererY3D.prototype.updateBaseGridElement = function () {
        _super.prototype.updateBaseGridElement.call(this);
        var w = this.getWidth();
        this.baseGrid.element.attr({
            "d": $path.moveTo({ x: 0, y: 0 })
                + $path.lineTo({ x: w, y: 0 })
                + $path.lineTo({ x: w + this.chart.dx3D, y: this.chart.dy3D })
        });
    };
    Object.defineProperty(AxisRendererY3D.prototype, "chart", {
        /**
         * @ignore Exclude from docs
         * @return {XYChart3D} Chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * Chart, associated with the Axis.
         *
         * @ignore Exclude from docs
         * @param {XYChart3D}  value  Chart
         */
        set: function (chart) {
            if (chart) {
                this._chart.set(chart, chart.events.on("propertychanged", this.handle3DChanged, this));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Invoked when 3D-related settings change, like depth or angle.
     *
     * @param {AMEvent<Sprite, ISpriteEvents>["propertychanged"]} event Event
     */
    AxisRendererY3D.prototype.handle3DChanged = function (event) {
        if (event.property == "depth" || event.property == "angle") {
            this.invalidate();
        }
    };
    return AxisRendererY3D;
}(AxisRendererY));
export { AxisRendererY3D };
//# sourceMappingURL=AxisRendererY3D.js.map