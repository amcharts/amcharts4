/**
 * Module for "Desaturate" filter.
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
import { Filter } from "./Filter";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creats a "Desaturate" filter
 */
var DesaturateFilter = /** @class */ (function (_super) {
    __extends(DesaturateFilter, _super);
    /**
     * Constructor
     * * Creates primitve (effect) elements
     * * Sets default properties
     */
    function DesaturateFilter() {
        var _this = _super.call(this) || this;
        _this.className = "DesaturateFilter";
        // Create elements
        // NOTE: we do not need to add each individual element to `_disposers`
        // because `filterPrimitives` has an event handler which automatically adds
        // anything added to it to `_disposers`
        _this.feColorMatrix = _this.paper.add("feColorMatrix");
        _this.feColorMatrix.attr({ "type": "saturate" });
        _this.filterPrimitives.push(_this.feColorMatrix);
        // Set default properties
        _this.width = 120;
        _this.height = 120;
        _this.saturation = 0;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(DesaturateFilter.prototype, "saturation", {
        /**
         * @return {number} Saturation (0-1)
         */
        get: function () {
            return this.properties["saturation"];
        },
        /**
         * Saturation.
         *
         * 0 - completely desaturated.
         * 1 - fully saturated.
         *
         * @param {number}  value  Saturation (0-1)
         * @todo Describe possible values
         */
        set: function (value) {
            this.properties["saturation"] = value;
            this.feColorMatrix.attr({ "values": value.toString() });
        },
        enumerable: true,
        configurable: true
    });
    return DesaturateFilter;
}(Filter));
export { DesaturateFilter };
//# sourceMappingURL=DesaturateFilter.js.map