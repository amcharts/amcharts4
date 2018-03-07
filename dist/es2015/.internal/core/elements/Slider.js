/**
 * Slider is a scrollbar with just one selection grip.
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
import { Scrollbar } from "../../core/elements/Scrollbar";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a slider - a version of scrollbar with just one grip.
 *
 * @see {@link ISliderEvents} for a list of available events
 * @see {@link ISliderAdapters} for a list of available Adapters
 */
var Slider = /** @class */ (function (_super) {
    __extends(Slider, _super);
    /**
     * Constructor
     */
    function Slider() {
        var _this = _super.call(this) || this;
        _this.className = "Slider";
        _this.thumb.disabled = true;
        _this.endGrip.disabled = true;
        _this.applyTheme();
        return _this;
    }
    return Slider;
}(Scrollbar));
export { Slider };
//# sourceMappingURL=Slider.js.map