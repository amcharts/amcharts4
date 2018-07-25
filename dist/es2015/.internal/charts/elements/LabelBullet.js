/**
 * Bullet module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Bullet } from "./Bullet";
import { Label } from "../../core/elements/Label";
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
var LabelBullet = /** @class */ (function (_super) {
    tslib_1.__extends(LabelBullet, _super);
    /**
     * Constructor
     */
    function LabelBullet() {
        var _this = _super.call(this) || this;
        _this.className = "LabelBullet";
        var label = _this.createChild(Label);
        label.shouldClone = false;
        label.verticalCenter = "middle";
        label.horizontalCenter = "middle";
        label.truncate = true;
        label.hideOversized = true;
        label.stroke = color();
        label.strokeOpacity = 0;
        label.fill = new InterfaceColorSet().getFor("text");
        _this.events.on("maxsizechanged", function () {
            _this.label.maxWidth = _this.maxWidth;
            _this.label.maxHeight = _this.maxHeight;
        }, _this);
        _this.label = label;
        return _this;
        // not good, as lineSeries will have labels somewhere in the middle.
        //this.locationX = 0.5;
        //this.locationY = 0.5;
    }
    /**
     * Copies all proprities and related stuff from another instance of
     * [[LabelBullet]].
     *
     * @param {this}  source  Source element
     */
    LabelBullet.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.label.copyFrom(source.label);
    };
    return LabelBullet;
}(Bullet));
export { LabelBullet };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LabelBullet"] = LabelBullet;
//# sourceMappingURL=LabelBullet.js.map