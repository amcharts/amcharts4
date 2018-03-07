/**
 * Module for "Blur" filter.
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
;
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a "Blur" filter.
 */
var BlurFilter = /** @class */ (function (_super) {
    __extends(BlurFilter, _super);
    /**
     * Constructor
     * * Creates primitve (effect) elements
     * * Sets default properties
     */
    function BlurFilter() {
        var _this = _super.call(this) || this;
        _this.className = "BlurFilter";
        // Create elements
        // NOTE: we do not need to add each individual element to `_disposers`
        // because `filterPrimitives` has an event handler which automatically adds
        // anything added to it to `_disposers`
        _this.feGaussianBlur = _this.paper.add("feGaussianBlur");
        _this.feGaussianBlur.attr({ "result": "blurOut", "in": "SourceGraphic" });
        _this.filterPrimitives.push(_this.feGaussianBlur);
        // Set default properties
        _this.width = 200;
        _this.height = 200;
        _this.blur = 1.5;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(BlurFilter.prototype, "blur", {
        /**
         * @return {number} Blur
         */
        get: function () {
            return this.properties.blur;
        },
        /**
         * Blur value.
         *
         * @default 1.5
         * @param {number} value Blur
         */
        set: function (value) {
            this.properties.blur = value;
            this.feGaussianBlur.attr({ "stdDeviation": value / this.scale });
        },
        enumerable: true,
        configurable: true
    });
    return BlurFilter;
}(Filter));
export { BlurFilter };
//# sourceMappingURL=BlurFilter.js.map