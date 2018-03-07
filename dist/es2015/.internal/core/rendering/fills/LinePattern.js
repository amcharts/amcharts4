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
import { Pattern } from "./Pattern";
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
    __extends(LinePattern, _super);
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
//# sourceMappingURL=LinePattern.js.map