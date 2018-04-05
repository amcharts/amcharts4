/**
 * Bullet module
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
import { Bullet } from "./Bullet";
import { Circle } from "../../core/elements/Circle";
import { system } from "../../core/System";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a bullet with a textual label.
 *
 * Uses [[Label]] instance to draw the label, so the label itself is
 * configurable.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var CircleBullet = /** @class */ (function (_super) {
    __extends(CircleBullet, _super);
    /**
     * Constructor
     */
    function CircleBullet() {
        var _this = _super.call(this) || this;
        _this.className = "CircleBullet";
        _this.cloneChildren = false;
        _this.circle = _this.createChild(Circle);
        _this.circle.radius = 5;
        return _this;
    }
    /**
     * Copies all proprities and related stuff from another instance of
     * [[CircleBullet]].
     *
     * @param {this}  source  Source element
     */
    CircleBullet.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.circle.copyFrom(source.circle);
    };
    /**
     * Sets currently used [[DataItem]].
     *
     * If the element has also `configField` set, it will also look for any
     * config in DataItem's data context to apply to this element.
     *
     * @param {DataItem} dataItem DataItem
     */
    CircleBullet.prototype.setDataItem = function (dataItem) {
        _super.prototype.setDataItem.call(this, dataItem);
        this.circle.dataItem = dataItem;
    };
    return CircleBullet;
}(Bullet));
export { CircleBullet };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
system.registeredClasses["CircleBullet"] = CircleBullet;
//# sourceMappingURL=CircleBullet.js.map