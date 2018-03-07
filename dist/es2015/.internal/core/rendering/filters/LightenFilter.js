/**
 * Module for "Lighten" filter.
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
 * Creates a "Lighten" filter.
 */
var LightenFilter = /** @class */ (function (_super) {
    __extends(LightenFilter, _super);
    /**
     * Constructor
     * * Creates primitve (effect) elements
     * * Sets default properties
     */
    function LightenFilter() {
        var _this = _super.call(this) || this;
        _this.className = "LightenFilter";
        // Create elements
        // NOTE: we do not need to add each individual element to `_disposers`
        // because `filterPrimitives` has an event handler which automatically adds
        // anything added to it to `_disposers`
        _this.feColorMatrix = _this.paper.add("feColorMatrix");
        _this.feColorMatrix.attr({ "type": "matrix" });
        _this.filterPrimitives.push(_this.feColorMatrix);
        // Set default properties
        _this.lightness = 0;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(LightenFilter.prototype, "lightness", {
        /**
         * @return {number} Lightness (0-1)
         */
        get: function () {
            return this.properties["lightness"];
        },
        /**
         * Lightness. (0-1)
         *
         * @param {number} value Lightness (0-1)
         */
        set: function (value) {
            this.properties["lightness"] = value;
            var v = value + 1;
            this.feColorMatrix.attr({ "values": v + " 0 0 0 0 0 " + v + " 0 0 0 0 0 " + v + " 0 0 0 0 0 1 0" });
        },
        enumerable: true,
        configurable: true
    });
    return LightenFilter;
}(Filter));
export { LightenFilter };
//# sourceMappingURL=LightenFilter.js.map