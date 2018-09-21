/**
 * Funnel tick module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Tick } from "../elements/Tick";
import { MutableValueDisposer, MultiDisposer } from "../../core/utils/Disposer";
import { registry } from "../../core/Registry";
import * as $utils from "../../core/utils/Utils";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws an tick line for a funnel slice connecting it to a related label.
 *
 * @see {@link IFunnelTickEvents} for a list of available events
 * @see {@link IFunnelTickAdapters} for a list of available Adapters
 */
var FunnelTick = /** @class */ (function (_super) {
    tslib_1.__extends(FunnelTick, _super);
    /**
     * Constructor
     */
    function FunnelTick() {
        var _this = _super.call(this) || this;
        /**
         * A label element this tick is attached to.
         *
         * @type {MutableValueDisposer}
         */
        _this._label = new MutableValueDisposer();
        /**
         * A slice element this tick is attached to.
         *
         * @type {MutableValueDisposer}
         */
        _this._slice = new MutableValueDisposer();
        _this.className = "FunnelTick";
        _this.element = _this.paper.add("path");
        _this._disposers.push(_this._label);
        _this._disposers.push(_this._slice);
        _this.applyTheme();
        return _this;
    }
    /**
     * Draws the tick element.
     *
     * @ignore Exclude from docs
     */
    FunnelTick.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var slice = this.slice;
        var point = slice.tickPoint;
        if (point) {
            var label = this.label;
            var series = slice.dataItem.component;
            if (series.orientation == "vertical") {
                var x1 = label.pixelX;
                var y1 = label.pixelY;
                var p0 = $utils.spritePointToSprite(point, slice, this.parent);
                var p1 = $utils.spritePointToSprite({ x: x1, y: y1 }, label.parent, this.parent);
                this.path = $path.moveTo(p0) + $path.lineTo(p1);
            }
            else {
                var x1 = label.pixelX;
                var y1 = label.pixelY - label.measuredHeight;
                var p0 = $utils.spritePointToSprite(point, slice, this.parent);
                var p1 = $utils.spritePointToSprite({ x: x1, y: y1 }, label.parent, this.parent);
                this.path = $path.moveTo(p0) + $path.lineTo(p1);
            }
        }
    };
    Object.defineProperty(FunnelTick.prototype, "slice", {
        /**
         * @return {FunnelSlice} FunnelSlice
         */
        get: function () {
            return this._slice.get();
        },
        /**
         * [[FunnelSlice]] element tick is attached to.
         *
         * @param {FunnelSlice}  slice  Slice
         */
        set: function (slice) {
            this._slice.set(slice, new MultiDisposer([
                slice.events.on("transformed", this.invalidate, this),
                slice.events.on("validated", this.invalidate, this)
            ]));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunnelTick.prototype, "label", {
        /**
         * @return {AxisLabelCircular} Label
         */
        get: function () {
            return this._label.get();
        },
        /**
         * [[Label]] element tick is attached to.
         *
         * @param {Label}  label  Label
         */
        set: function (label) {
            this._label.set(label, label.events.on("transformed", this.invalidate, this));
        },
        enumerable: true,
        configurable: true
    });
    return FunnelTick;
}(Tick));
export { FunnelTick };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FunnelTick"] = FunnelTick;
//# sourceMappingURL=FunnelTick.js.map