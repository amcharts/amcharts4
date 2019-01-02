/**
 * Functionality for drawing paths.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../core/Container";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import { registry } from "../core/Registry";
import * as $utils from "../core/utils/Utils";
import { Rectangle } from "../core/elements/Rectangle";
import { getInteraction } from "../core/interaction/Interaction";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Resize class is capable of drawing a simple rectangular button with
 * optionally rounded corners and an icon in it.
 *
 * @see {@link IResizeEvents} for a list of available events
 * @see {@link IResizeAdapters} for a list of available Adapters
 */
var Resize = /** @class */ (function (_super) {
    tslib_1.__extends(Resize, _super);
    /**
     * Constructor
     */
    function Resize() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.isResizing = false;
        _this.constrainProportions = false;
        _this.className = "Resize";
        _this.isMeasured = false;
        var interaction = getInteraction();
        var color = new InterfaceColorSet().getFor("alternativeBackground");
        var rectangle = _this.createChild(Rectangle);
        rectangle.strokeOpacity = 1;
        rectangle.strokeWidth = 1;
        rectangle.strokeDasharray = "2,2";
        rectangle.fillOpacity = 0;
        rectangle.stroke = color;
        _this.rectangle = rectangle;
        var tlGrip = _this.createChild(Rectangle);
        tlGrip.width = 10;
        tlGrip.height = 10;
        tlGrip.fill = color;
        tlGrip.verticalCenter = "middle";
        tlGrip.horizontalCenter = "middle";
        tlGrip.draggable = true;
        _this.tlGrip = tlGrip;
        tlGrip.events.on("drag", _this.handleGrips, _this, true);
        _this.trGrip = tlGrip.clone();
        _this.trGrip.parent = _this;
        _this.brGrip = tlGrip.clone();
        _this.brGrip.parent = _this;
        _this.blGrip = tlGrip.clone();
        _this.blGrip.parent = _this;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(Resize.prototype, "sprite", {
        get: function () {
            return this._sprite;
        },
        set: function (sprite) {
            this._sprite = sprite;
            if (sprite) {
                this.toFront();
                this.visible = true;
                this.updatePosition();
                this._changeDisposer = sprite.events.on("transformed", this.updatePosition, this, false);
            }
            else {
                this.visible = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Resize.prototype.updatePosition = function () {
        var sprite = this._sprite;
        if (sprite) {
            var w = sprite.measuredWidth;
            var h = sprite.measuredHeight;
            this.rectangle.width = w;
            this.rectangle.height = h;
            this.rectangle.x = 0;
            this.rectangle.y = 0;
            var point = $utils.spritePointToSprite({ x: sprite.pixelX + sprite.maxLeft, y: sprite.pixelY + sprite.maxTop }, sprite.parent, this.parent);
            this.x = point.x;
            this.y = point.y;
            this.tlGrip.x = 0;
            this.tlGrip.y = 0;
            this.trGrip.x = w;
            this.trGrip.y = 0;
            this.brGrip.x = w;
            this.brGrip.y = h;
            this.blGrip.x = 0;
            this.blGrip.y = h;
        }
    };
    Resize.prototype.handleGrips = function (event) {
        var grip = event.target;
        var tlGrip = this.tlGrip;
        var trGrip = this.trGrip;
        var blGrip = this.blGrip;
        var brGrip = this.brGrip;
        if (grip == tlGrip) {
            blGrip.x = grip.x;
            trGrip.y = grip.y;
        }
        else if (grip == blGrip) {
            tlGrip.x = grip.x;
            brGrip.y = grip.y;
        }
        else if (grip == trGrip) {
            brGrip.x = grip.x;
            tlGrip.y = grip.y;
        }
        else if (grip == brGrip) {
            trGrip.x = grip.x;
            blGrip.y = grip.y;
        }
        var rectangle = this.rectangle;
        rectangle.x = Math.min(tlGrip.pixelX, trGrip.pixelX, blGrip.pixelX, brGrip.pixelX);
        rectangle.y = Math.min(tlGrip.pixelY, trGrip.pixelY, blGrip.pixelY, brGrip.pixelY);
        rectangle.width = Math.max(tlGrip.pixelX, trGrip.pixelX, blGrip.pixelX, brGrip.pixelX) - rectangle.pixelX;
        rectangle.height = Math.max(tlGrip.pixelY, trGrip.pixelY, blGrip.pixelY, brGrip.pixelY) - rectangle.pixelY;
    };
    return Resize;
}(Container));
export { Resize };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Resize"] = Resize;
//# sourceMappingURL=Resize.js.map