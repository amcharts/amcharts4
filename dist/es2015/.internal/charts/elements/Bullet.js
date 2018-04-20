/**
 * Module that defines everything related to building bullets.
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
import { Container } from "../../core/Container";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates bullets.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    /**
     * Constructor
     */
    function Bullet() {
        var _this = _super.call(this) || this;
        _this.className = "Bullet";
        _this.isMeasured = false;
        _this.tooltipX = 0;
        _this.tooltipY = 0;
        _this.layout = "none";
        _this.copyToLegendMarker = true;
        return _this;
    }
    Object.defineProperty(Bullet.prototype, "locationX", {
        /**
         * @return {number} Location (0-1)
         */
        get: function () {
            return this.getPropertyValue("locationX");
        },
        /**
         * Relative horizontal location within cell. (0-1)
         *
         * @param {number}  value  Location (0-1)
         */
        set: function (value) {
            this.setPropertyValue("locationX", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bullet.prototype, "locationY", {
        /**
         * @return {number} Location (0-1)
         */
        get: function () {
            return this.getPropertyValue("locationY");
        },
        /**
         * Relative vertical location within cell. (0-1)
         *
         * @param {number}  value  Location (0-1)
         */
        set: function (value) {
            this.setPropertyValue("locationY", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bullet.prototype, "xField", {
        /**
         * @return {string} [description]
         */
        get: function () {
            return this.getPropertyValue("xField");
        },
        /**
         * [xField description]
         *
         * @todo Description
         * @param {string}  value  [description]
         */
        set: function (value) {
            this.setPropertyValue("xField", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bullet.prototype, "yField", {
        /**
         * @return {string} [description]
         */
        get: function () {
            return this.getPropertyValue("yField");
        },
        /**
         * [yField description]
         *
         * Description
         * @param {string}  value  [description]
         */
        set: function (value) {
            this.setPropertyValue("yField", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bullet.prototype, "isDynamic", {
        /**
         * @return {boolean} Redraw on data change?
         */
        get: function () {
            return this.getPropertyValue("isDynamic");
        },
        /**
         * Indicates if the bullet is "dynamic".
         *
         * In most cases the bullets remain the same, even if the underlying data
         * changes.
         *
         * However, in cases where bullet also displays a label, or its size depends
         * on data, it also needs to be redrawn when the underlying data changes.
         *
         * Only those bullets that have set `isDynamic = true` will be redrawn each
         * time data changes. Regular bullets will be reused as they are.
         *
         * @default false
         * @param {boolean}  value  Redraw on data change?
         */
        set: function (value) {
            this.setPropertyValue("isDynamic", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bullet.prototype, "copyToLegendMarker", {
        /**
         * @return {boolean} Redraw on data change?
         */
        get: function () {
            return this.getPropertyValue("copyToLegendMarker");
        },
        /**
         * Indicates if the bullet should be copied to legend marker
         *
         * @default false
         * @param {boolean}  value  Redraw on data change?
         */
        set: function (value) {
            this.setPropertyValue("copyToLegendMarker", value);
        },
        enumerable: true,
        configurable: true
    });
    return Bullet;
}(Container));
export { Bullet };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Bullet"] = Bullet;
//# sourceMappingURL=Bullet.js.map