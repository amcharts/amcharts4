import * as tslib_1 from "tslib";
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
    tslib_1.__extends(ColorModifier, _super);
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