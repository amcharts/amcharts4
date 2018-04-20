/**
 * A module defining functionality for axis grid elements.
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
 * Displays an axis grid line.
 *
 * @see {@link IGridEvents} for a list of available events
 * @see {@link IGridAdapters} for a list of available Adapters
 * @todo Review: container is better, as we'll be able to attach something to the grid, also with 3d charts we might need some additional elements
 * @important
 */
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    /**
     * Constructor
     */
    function Grid() {
        var _this = _super.call(this) || this;
        _this.className = "Grid";
        _this.element = _this.paper.add("path");
        _this.location = 0.5;
        _this.isMeasured = false;
        var interfaceColors = new InterfaceColorSet();
        _this.stroke = interfaceColors.getFor("grid");
        _this.pixelPerfect = true;
        _this.strokeOpacity = 0.15;
        _this.fill = color(); // "none";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(Grid.prototype, "location", {
        /**
         * @return {AxisItemLocation} Location (0-1)
         */
        get: function () {
            return this.getPropertyValue("location");
        },
        /**
         * Location within axis cell to place grid line on.
         *
         * * 0 - start
         * * 0.5 - middle
         * * 1 - end
         *
         * @param {AxisItemLocation}  value  Location (0-1)
         */
        set: function (value) {
            this.setPropertyValue("location", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return Grid;
}(Sprite));
export { Grid };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Grid"] = Grid;
//# sourceMappingURL=Grid.js.map