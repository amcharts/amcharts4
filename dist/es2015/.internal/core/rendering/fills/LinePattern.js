import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Pattern } from "./Pattern";
import { registry } from "../../Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Line pattern.
 */
var LinePattern = /** @class */ (function (_super) {
    tslib_1.__extends(LinePattern, _super);
    /**
     * Constructor
     */
    function LinePattern() {
        var _this = _super.call(this) || this;
        _this._line = _this.paper.add("line");
        _this.addElement(_this._line);
        return _this;
    }
    /**
     * Draws the pattern.
     */
    LinePattern.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (this._line) {
            this._line.attr({ "x2": this.width * 2 }); // to solve rotation
        }
    };
    return LinePattern;
}(Pattern));
export { LinePattern };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LinePattern"] = LinePattern;
//# sourceMappingURL=LinePattern.js.map