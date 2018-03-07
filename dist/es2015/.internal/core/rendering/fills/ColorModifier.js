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
import { BaseObject } from "../../Base";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for color modifiers.
 *
 * @ignore Exclude from docs
 */
var ColorModifier = /** @class */ (function (_super) {
    __extends(ColorModifier, _super);
    /**
     * Constructor
     */
    function ColorModifier() {
        var _this = _super.call(this) || this;
        _this.className = "ColorModifier";
        _this.applyTheme();
        return _this;
    }
    /**
     * Modifies color value.
     *
     * @ignore Exclude from docs
     * @param  {Color}  value  Original color
     * @return {Color}         Modified
     */
    ColorModifier.prototype.modify = function (value) {
        return value;
    };
    return ColorModifier;
}(BaseObject));
export { ColorModifier };
//# sourceMappingURL=ColorModifier.js.map