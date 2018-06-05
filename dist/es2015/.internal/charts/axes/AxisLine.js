/**
 *
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
import { Sprite } from "../../core/Sprite";
import { registry } from "../../core/Registry";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to draw Axis line.
 *
 * @see {@link IAxisLineEvents} for a list of available events
 * @see {@link IAxisLineAdapters} for a list of available Adapters
 */
var AxisLine = /** @class */ (function (_super) {
    __extends(AxisLine, _super);
    /**
     * Constructor
     */
    function AxisLine() {
        var _this = _super.call(this) || this;
        _this.className = "AxisLine";
        _this.element = _this.paper.add("path");
        var interfaceColors = new InterfaceColorSet();
        _this.stroke = interfaceColors.getFor("grid");
        _this.strokeOpacity = 0.15;
        _this.pixelPerfect = true;
        _this.fill = color();
        _this.applyTheme();
        _this.interactionsEnabled = false;
        _this.element.moveTo({ x: 0, y: 0 });
        return _this;
    }
    return AxisLine;
}(Sprite));
export { AxisLine };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisLine"] = AxisLine;
//# sourceMappingURL=AxisLine.js.map