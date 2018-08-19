/**
 * Provides functionality used to creating and showing tooltips (balloons).
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../Container";
import { PointedRectangle } from "./PointedRectangle";
import { Label } from "../elements/Label";
import { Animation } from "../utils/Animation";
import { color } from "../utils/Color";
import { DropShadowFilter } from "../rendering/filters/DropShadowFilter";
import * as $math from "../utils/Math";
import * as $ease from "../utils/Ease";
import * as $utils from "../utils/Utils";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Tooltip displays text and/or multimedia information in a balloon over chart
 * area.
 * @see {@link ITooltipEvents} for a list of available events
 * @see {@link ITooltipAdapters} for a list of available Adapters
 */
var Tooltip = /** @class */ (function (_super) {
    tslib_1.__extends(Tooltip, _super);
    /**
     * Constructor
     */
    function Tooltip() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Holds numeric boundary values. Calculated from the `boundingContainer`.
         *
         * @type {IRectangle}
         */
        _this._boundingRect = { x: 0, y: 0, width: 40000, height: 40000 };
        /**
         * Coordinates tolltip's pointer (stem) should point to.
         *
         * @type {IPoint}
         */
        _this._pointTo = { x: 0, y: 0 };
        /**
         * If set to `true` the pointer/stem of the Tooltip will not go outside
         * Tooltip's width or height depending on pointer's orientation.
         *
         * @default false
         * @type {boolean}
         */
        _this.fitPointerToBounds = false;
        /**
         * If tooltipOrientation is vertical, it can be drawn below or above point. We need to know this when solving overlapping
         *
         * @type "up" | "down"
         */
        _this._verticalOrientation = "up";
        _this.className = "Tooltip";
        _this.isMeasured = false;
        _this.getFillFromObject = true;
        _this.margin(5, 5, 5, 5);
        // Create chrome/background
        var background = _this.background;
        background.interactionsEnabled = false;
        background.fillOpacity = 0.9;
        background.strokeWidth = 1;
        background.strokeOpacity = 1;
        background.stroke = color("#ffffff");
        background.cornerRadius = 3;
        background.pointerLength = 6;
        background.pointerBaseWidth = 10;
        _this.autoTextColor = true;
        // Create text element
        var label = _this.createChild(Label);
        label.shouldClone = false;
        _this.label = label;
        label.padding(7, 12, 6, 12);
        label.interactionsEnabled = false;
        label.horizontalCenter = "middle";
        label.fill = color("#ffffff");
        _this._disposers.push(label);
        _this.label.events.on("sizechanged", function () {
            _this.drawBackground();
        });
        _this.label.events.on("positionchanged", function () {
            _this.drawBackground();
        });
        _this.label.zIndex = 1; // @todo remove this line when bg sorting is solved
        // Set defaults
        _this.pointerOrientation = "vertical";
        var dropShadow = new DropShadowFilter();
        dropShadow.dy = 1;
        dropShadow.dx = 1;
        dropShadow.opacity = 0.5;
        _this.filters.push(dropShadow);
        _this.animationDuration = 0;
        _this.animationEasing = $ease.cubicOut;
        // Set accessibility options
        _this.role = "tooltip";
        _this.visible = false;
        _this.opacity = 0;
        _this.x = 0;
        _this.y = 0;
        _this.events.on("visibilitychanged", function () {
            if (_this.visible) {
                _this.label.invalidate();
            }
        });
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(Tooltip.prototype, "getStrokeFromObject", {
        /**
         * Specifies if tooltip background should get stroke color from the sprite it is pointing to.
         *
         * @return {boolean}
         * @default false
         */
        get: function () {
            return this.getPropertyValue("getStrokeFromObject");
        },
        /**
         * Specifies if tooltip background should get stroke color from the sprite it is pointing to.
         *
         * @param {value} value boolean
         */
        set: function (value) {
            this.setPropertyValue("getStrokeFromObject", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "autoTextColor", {
        /**
         * Specifies if text color should be chosen automatically for a better readability.
         *
         * @return {boolean}
         * @default true
         */
        get: function () {
            return this.getPropertyValue("autoTextColor");
        },
        /**
         * @param {value} value boolean
         */
        set: function (value) {
            this.setPropertyValue("autoTextColor", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "getFillFromObject", {
        /**
         * Specifies if tooltip background should get fill color from the sprite it is pointing to.
         *
         * @return {boolean}
         * @default true
         */
        get: function () {
            return this.getPropertyValue("getFillFromObject");
        },
        /**
         * @param {value} value boolean
         */
        set: function (value) {
            this.setPropertyValue("getFillFromObject", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates and returns a background element.
     *
     * @ignore Exclude from docs
     * @return {PointedRectangle} Background
     */
    Tooltip.prototype.createBackground = function () {
        return new PointedRectangle();
    };
    Object.defineProperty(Tooltip.prototype, "pointerOrientation", {
        /**
         * @return {PointerOrientation} Orientation
         */
        get: function () {
            return this.getPropertyValue("pointerOrientation");
        },
        /**
         * Pointer orientation: "horizontal" or "vertical".
         *
         * @default "vertical"
         * @param {PointerOrientation}  value  Orientation
         */
        set: function (value) {
            this.setPropertyValue("pointerOrientation", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "animationDuration", {
        /**
         * @return {PointerOrientation} Orientation
         */
        get: function () {
            return this.getPropertyValue("animationDuration");
        },
        /**
         * Duration in milliseconds for the animation to take place when the tolltip
         * is moving from one place to another.
         *
         * @default 0
         * @param {number}  value  number
         */
        set: function (value) {
            this.setPropertyValue("animationDuration", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "animationEasing", {
        /**
         * @return {Function}
         */
        get: function () {
            return this.getPropertyValue("animationEasing");
        },
        /**
         * Tooltip animation (moving from one place to another) easing function.
         *
         * @default $ease.cubicOut
         * @param {Function}  value (value: number) => number
         */
        set: function (value) {
            this.setPropertyValue("animationEasing", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "html", {
        /**
         * @return {string} HTML content
         */
        get: function () {
            return this.label.html;
        },
        /**
         * HTML content for the Tooltip.
         *
         * Provided value will be used as is, without applying any further
         * formatting to it.
         *
         * @param {string}  value  HTML content
         */
        set: function (value) {
            if (this.label.html != value) {
                this.label.html = value;
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tooltip.prototype, "text", {
        /**
         * @return {string} SVG text
         */
        get: function () {
            return this.label.text;
        },
        /**
         * SVG text content for the Tooltip.
         *
         * Text can have a number of formatting options supported by
         * [[TextFormatter]].
         *
         * @param {string}  value  SVG text
         */
        set: function (value) {
            if (this.label.text != value) {
                this.label.text = value;
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates the Tooltip.
     *
     * @ignore Exclude from docs
     */
    Tooltip.prototype.draw = function () {
        _super.prototype.draw.call(this);
        var label = this.label;
        if (label.invalid) {
            label.validate();
        }
        var x = this._pointTo.x;
        var y = this._pointTo.y;
        var boundingRect = this._boundingRect;
        var textW = label.measuredWidth;
        var textH = label.measuredHeight;
        var pointerLength = this.background.pointerLength;
        var textX;
        var textY;
        // try to handle if text is wider than br
        if (textW > boundingRect.width) {
            var p0 = $utils.spritePointToDocument({ x: boundingRect.x, y: boundingRect.y }, this.parent);
            var p1 = $utils.spritePointToDocument({ x: boundingRect.x + boundingRect.width, y: boundingRect.y + boundingRect.height }, this.parent);
            var documentWidth = document.body.offsetWidth;
            var documentHeight = document.body.offsetHeight;
            if (p1.x > documentWidth / 2) {
                boundingRect.x = boundingRect.width - textW;
            }
            else {
                boundingRect.width = boundingRect.x + textW;
            }
        }
        // horizontal
        if (this.pointerOrientation == "horizontal") {
            textY = -textH / 2;
            if (x > boundingRect.x + boundingRect.width / 2) {
                textX = -textW / 2 - pointerLength;
            }
            else {
                textX = textW / 2 + pointerLength;
            }
        }
        // vertical pointer
        else {
            textX = $math.fitToRange(0, boundingRect.x - x + textW / 2, boundingRect.x - x + boundingRect.width - textW / 2);
            if (y > boundingRect.y + textH + pointerLength) {
                textY = -textH - pointerLength;
                this._verticalOrientation = "up";
            }
            else {
                textY = pointerLength;
                this._verticalOrientation = "down";
            }
        }
        textY = $math.fitToRange(textY, boundingRect.y - y, boundingRect.y + boundingRect.height - textH - y);
        label.x = textX;
        label.y = textY;
    };
    /**
     * Overrides functionality from the superclass.
     *
     * @ignore Exclude from docs
     */
    Tooltip.prototype.updateBackground = function () {
        this.group.addToBack(this.background.group);
    };
    /**
     * Draws Tooltip background (chrome, background and pointer/stem).
     *
     * @ignore Exclude from docs
     */
    Tooltip.prototype.drawBackground = function () {
        var label = this.label;
        var background = this.background;
        var textWidth = label.measuredWidth;
        var textHeight = label.measuredHeight;
        var boundingRect = this._boundingRect;
        var bgWidth = textWidth;
        var bgX = label.pixelX - textWidth / 2;
        var bgHeight = textHeight;
        var bgY = label.pixelY;
        var x = this._pointTo.x;
        var y = this._pointTo.y;
        var boundX1 = boundingRect.x - x;
        var boundX2 = boundX1 + boundingRect.width;
        var boundY1 = boundingRect.y - y;
        var boundY2 = boundY1 + boundingRect.height;
        background.x = bgX;
        background.y = bgY;
        background.width = bgWidth;
        background.height = bgHeight;
        if (this.fitPointerToBounds) {
            background.pointerX = $math.fitToRange(-background.x, boundX1 - background.x, boundX2 - background.x);
            background.pointerY = $math.fitToRange(-background.y, boundY1 - background.y, boundY2 - background.y);
        }
        else {
            background.pointerX = -background.x;
            background.pointerY = -background.y;
        }
        background.validate();
    };
    /**
     * Set nes tooltip's anchor point and moves whole tooltip.
     *
     * @param {number}  x  X coordinate
     * @param {number}  y  Y coordinate
     */
    Tooltip.prototype.pointTo = function (point, instantly) {
        if (this._pointTo.x != point.x || this._pointTo.y != point.y) {
            this._pointTo = point;
            this.invalidate();
            // this helps to avoid strange animation from nowhere on initial show or when balloon was hidden already
            if (!this.visible || instantly) {
                this.moveTo(this._pointTo);
                if (this._animation) {
                    this._animation.dispose();
                }
            }
            else {
                // helps to avoid flicker on top/left corner
                if (this.pixelX == 0 && this.pixelY == 0) {
                    this.moveTo(this._pointTo);
                }
                else {
                    this._animation = new Animation(this, [{ property: "x", to: point.x, from: this.pixelX }, { property: "y", to: point.y, from: this.pixelY }], this.animationDuration, this.animationEasing).start();
                }
            }
        }
    };
    /**
     * Sets numeric boundaries Tooltip needs to obey (so it does not go outside
     * specific area).
     *
     * @ignore Exclude from docs
     * @param {IRectangle} rectangle Boundary rectangle
     */
    Tooltip.prototype.setBounds = function (rectangle) {
        var oldRect = this._boundingRect;
        if (oldRect.x != rectangle.x || oldRect.y != rectangle.y || oldRect.width != rectangle.width || oldRect.height != rectangle.height) {
            this._boundingRect = rectangle;
            this.invalidate();
        }
    };
    Object.defineProperty(Tooltip.prototype, "boundingContainer", {
        /**
         * Sets a [[Container]] instance to be used when calculating numeric
         * boundaries for the Tooltip.
         *
         * @ignore Exclude from docs
         * @param {Container}  container  Boundary container
         */
        set: function (container) {
            this._boundingContainer = container;
            // TODO remove closures ?
            container.events.on("sizechanged", this.updateBounds, this);
            container.events.on("positionchanged", this.updateBounds, this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates numeric boundaries for the Tooltip, based on the
     * `boundingCountrainer`.
     */
    Tooltip.prototype.updateBounds = function () {
        var boundingContainer = this._boundingContainer;
        // to global
        var rect = $utils.spriteRectToSvg({
            x: boundingContainer.pixelX,
            y: boundingContainer.pixelY,
            width: boundingContainer.maxWidth,
            height: boundingContainer.maxHeight
        }, boundingContainer);
        this.setBounds(rect);
    };
    Object.defineProperty(Tooltip.prototype, "verticalOrientation", {
        /**
         * If tooltipOrientation is vertical, it can be drawn below or above point.
         * We need to know this when solving overlapping.
         *
         * @ignore Exclude from docs
         * @return "up" | "down"
         */
        get: function () {
            return this._verticalOrientation;
        },
        enumerable: true,
        configurable: true
    });
    return Tooltip;
}(Container));
export { Tooltip };
//# sourceMappingURL=Tooltip.js.map