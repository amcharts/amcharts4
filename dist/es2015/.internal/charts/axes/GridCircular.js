/**
 * A module defining functionality for circular axis grid elements.
 */
import * as tslib_1 from "tslib";
import { Grid } from "./Grid";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a circular grid element for circular-type axis.
 *
 * @see {@link IGridCircularEvents} for a list of available events
 * @see {@link IGridCircularAdapters} for a list of available Adapters
 * @todo Review: container is better, as we'll be able to attach something to the GridCircular, also with 3d charts we might need some additional elements
 */
var GridCircular = /** @class */ (function (_super) {
    tslib_1.__extends(GridCircular, _super);
    /**
     * Constructor
     */
    function GridCircular() {
        var _this = _super.call(this) || this;
        _this.className = "GridCircular";
        _this.pixelPerfect = false;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(GridCircular.prototype, "innerRadius", {
        /**
         * @return {number} Inner radius
         */
        get: function () {
            return this.getPropertyValue("innerRadius");
        },
        /**
         * Inner radius of the circular grid. (absolute or relative)
         *
         * @param {number | Percent} value Inner radius
         */
        set: function (value) {
            this.setPropertyValue("innerRadius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridCircular.prototype, "radius", {
        /**
         * @return {number} Outer radius
         */
        get: function () {
            return this.getPropertyValue("radius");
        },
        /**
         * Outer radius of the circular grid. (absolute or relative)
         *
         * @param {number | Percent} value Outer radius
         */
        set: function (value) {
            this.setPropertyValue("radius", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return GridCircular;
}(Grid));
export { GridCircular };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["GridCircular"] = GridCircular;
//# sourceMappingURL=GridCircular.js.map