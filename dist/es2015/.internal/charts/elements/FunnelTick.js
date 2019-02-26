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
         */
        _this._label = new MutableValueDisposer();
        /**
         * A slice element this tick is attached to.
         */
        _this._slice = new MutableValueDisposer();
        _this.className = "FunnelTick";
        _this.element = _this.paper.add("path");
        _this._disposers.push(_this._label);
        _this._disposers.push(_this._slice);
        _this.setPropertyValue("locationX", 0);
        _this.setPropertyValue("locationY", 0);
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
        var point = slice.getPoint(this.locationX, this.locationY);
        if (point) {
            var label = this.label;
            var series = slice.dataItem.component;
            if (series.orientation == "vertical") {
                var x1 = label.pixelX;
                var y1 = label.pixelY;
                if (!series.labelsOpposite) {
                    x1 += label.maxRight;
                }
                var p0 = $utils.spritePointToSprite(point, slice, this.parent);
                var p1 = $utils.spritePointToSprite({ x: x1, y: y1 }, label.parent, this.parent);
                this.path = $path.moveTo(p0) + $path.lineTo(p1);
            }
            else {
                var x1 = label.pixelX;
                var y1 = label.pixelY;
                if (!series.labelsOpposite) {
                    y1 += label.maxBottom;
                }
                var p0 = $utils.spritePointToSprite(point, slice, this.parent);
                var p1 = $utils.spritePointToSprite({ x: x1, y: y1 }, label.parent, this.parent);
                this.path = $path.moveTo(p0) + $path.lineTo(p1);
            }
        }
    };
    Object.defineProperty(FunnelTick.prototype, "slice", {
        /**
         * @return FunnelSlice
         */
        get: function () {
            return this._slice.get();
        },
        /**
         * [[FunnelSlice]] element tick is attached to.
         *
         * @param slice  Slice
         */
        set: function (slice) {
            this._slice.set(slice, new MultiDisposer([
                slice.events.on("transformed", this.invalidate, this, false),
                slice.events.on("validated", this.invalidate, this, false)
            ]));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunnelTick.prototype, "label", {
        /**
         * @return Label
         */
        get: function () {
            return this._label.get();
        },
        /**
         * [[Label]] element tick is attached to.
         *
         * @param label  Label
         */
        set: function (label) {
            this._label.set(label, label.events.on("transformed", this.invalidate, this, false));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunnelTick.prototype, "locationX", {
        /**
         * @return Location (0-1)
         */
        get: function () {
            return this.getPropertyValue("locationX");
        },
        /**
         * A relative horizontal position within target element a tick is pointing
         * to.
         *
         * A scale is from 0 to 1, where 0 means left edge, and 1 right edge.
         *
         * You can also set any value in-between (e.g. 0.5 will point to the middle
         * of the slice), or outside 0-1 range, which will put tick anchor position
         * outside target element.
         *
         * @param value  Location (0-1)
         */
        set: function (value) {
            this.setPropertyValue("locationX", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunnelTick.prototype, "locationY", {
        /**
         * @return Location (0-1)
         */
        get: function () {
            return this.getPropertyValue("locationY");
        },
        /**
         * A relative vertical position within target element a tick is pointing
         * to.
         *
         * A scale is from 0 to 1, where 0 means top edge, and 1 bottom edge.
         *
         * You can also set any value in-between (e.g. 0.5 will point to the middle
         * of the slice), or outside 0-1 range, which will put tick anchor position
         * outside target element.
         *
         * @param value  Location (0-1)
         */
        set: function (value) {
            this.setPropertyValue("locationY", value, false, true);
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