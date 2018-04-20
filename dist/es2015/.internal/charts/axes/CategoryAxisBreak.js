/**
 * A module which defines functionality related to Category Axis Break.
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
import { AxisBreak } from "./AxisBreak";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Base class to define "breaks" in axes
 * @see {@link ICategoryAxisBreakEvents} for a list of available events
 * @see {@link ICategoryAxisBreakAdapters} for a list of available Adapters
 */
var CategoryAxisBreak = /** @class */ (function (_super) {
    __extends(CategoryAxisBreak, _super);
    /**
     * Constructor
     */
    function CategoryAxisBreak() {
        var _this = _super.call(this) || this;
        _this.className = "CategoryAxisBreak";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(CategoryAxisBreak.prototype, "startPosition", {
        /**
         * Pixel position of the break's start.
         *
         * @return {number} Position (px)
         * @readonly
         */
        get: function () {
            if (this.axis) {
                return this.axis.indexToPosition(this.adjustedStartValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBreak.prototype, "endPosition", {
        /**
         * Pixel position of the break's end.
         *
         * @return {number} Position (px)
         * @readonly
         */
        get: function () {
            if (this.axis) {
                return this.axis.indexToPosition(this.adjustedEndValue);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBreak.prototype, "startCategory", {
        /**
         * @return {string} Start category
         */
        get: function () {
            return this.getPropertyValue("startCategory");
        },
        /**
         * A category break starts on.
         *
         * @param {string}  value Start category
         */
        set: function (value) {
            if (this.setPropertyValue("startCategory", value)) {
                if (this.axis) {
                    this.axis.invalidateDataRange();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBreak.prototype, "endCategory", {
        /**
         * @return {string} End category
         */
        get: function () {
            return this.getPropertyValue("endCategory");
        },
        /**
         * A category break ends on.
         *
         * @param {string}  value  End category
         */
        set: function (value) {
            if (this.setPropertyValue("endCategory", value)) {
                if (this.axis) {
                    this.axis.invalidateDataRange();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBreak.prototype, "startValue", {
        /**
         * @return {number} Value
         */
        get: function () {
            var category = this.getPropertyValue("startCategory");
            if (category) {
                return this.axis.categoryToIndex(category);
            }
            else {
                return this.getPropertyValue("startValue");
            }
        },
        /**
         * An index of start category or a start value.
         *
         * @todo Description (review)
         * @param {number}  value  Value
         */
        set: function (value) {
            if (this.setPropertyValue("startValue", value)) {
                if (this.axis) {
                    this.axis.invalidateDataRange();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryAxisBreak.prototype, "endValue", {
        /**
         * @return {number} Value
         */
        get: function () {
            var category = this.getPropertyValue("endCategory");
            if (category) {
                return this.axis.categoryToIndex(category);
            }
            else {
                return this.getPropertyValue("endValue");
            }
        },
        /**
         * An index of end category or a end value.
         *
         * @param {number}  value  Value
         */
        set: function (value) {
            if (this.setPropertyValue("endValue", value)) {
                if (this.axis) {
                    this.axis.invalidateDataRange();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return CategoryAxisBreak;
}(AxisBreak));
export { CategoryAxisBreak };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CategoryAxisBreak"] = CategoryAxisBreak;
//# sourceMappingURL=CategoryAxisBreak.js.map