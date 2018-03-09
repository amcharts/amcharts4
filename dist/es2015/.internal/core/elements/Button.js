/**
 * Functionality for drawing simple buttons.
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
import { Container } from "../Container";
import { Text } from "./Text";
import { RoundedRectangle } from "../elements/RoundedRectangle";
import { ColorSet } from "../utils/ColorSet";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Button class is capable of drawing a simple rectangular button with
 * optionally rounded corners and an icon in it.
 *
 * @see {@link IButtonEvents} for a list of available events
 * @see {@link IButtonAdapters} for a list of available Adapters
 */
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    /**
     * Constructor
     */
    function Button() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "Button";
        _this.tooltipY = 0;
        var colorSet = new ColorSet();
        // Set defaults
        _this.iconPosition = "left";
        _this.layout = "horizontal";
        _this.contentAlign = "center";
        _this.contentValign = "middle";
        _this.padding(8, 16, 8, 16);
        var interfaceColors = new InterfaceColorSet();
        // Create background
        var background = _this.background;
        background.fill = interfaceColors.getFor("secondaryButton");
        background.stroke = interfaceColors.getFor("secondaryButtonStroke");
        background.fillOpacity = 1;
        background.strokeOpacity = 1;
        background.cornerRadius(3, 3, 3, 3);
        // Create the text element
        _this.textElement = new Text();
        _this.textElement.fill = interfaceColors.getFor("secondaryButtonText");
        ;
        // Create default states
        var hoverState = background.states.create("hover");
        hoverState.properties.fillOpacity = 1;
        hoverState.properties.fill = interfaceColors.getFor("secondaryButtonHover");
        var downState = background.states.create("down");
        downState.transitionDuration = 100;
        downState.properties.fill = interfaceColors.getFor("secondaryButtonDown");
        downState.properties.fillOpacity = 1;
        // Set up accessibility
        // A button should be always focusable
        _this.role = "button";
        _this.focusable = true;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(Button.prototype, "icon", {
        /**
         * @return {Sprite} Icon Sprite
         */
        get: function () {
            return this._icon;
        },
        /**
         * A [[Sprite]] to be used as an icon on button.
         *
         * @param {Sprite} icon Icon Sprite
         */
        set: function (icon) {
            if (this._icon) {
                //this._icon.dispose();
                this.removeDispose(this._icon);
            }
            if (icon) {
                this._icon = icon;
                icon.parent = this;
                icon.mouseEnabled = false;
                this.iconPosition = this.iconPosition;
                this._disposers.push(this._icon);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "iconPosition", {
        /**
         * @return {"left" | "right"} Icon position
         */
        get: function () {
            return this.getPropertyValue("iconPosition");
        },
        /**
         * Icon position: "left" or "right".
         *
         * @default "left"
         * @param {"left" | "right"}  position  Icon position
         */
        set: function (position) {
            this.setPropertyValue("iconPosition", position);
            if (this.icon) {
                if (position == "left") {
                    this.icon.toBack();
                }
                else {
                    this.icon.toFront();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "textElement", {
        /**
         * @return {Text} Text element
         */
        get: function () {
            return this._textElement;
        },
        /**
         * [[Text]] element to be used for text.
         *
         * @param {Text}  textElement  Text element
         */
        set: function (textElement) {
            if (this._textElement) {
                //this._textElement.dispose();
                this.removeDispose(this._textElement);
            }
            if (textElement) {
                this._textElement = textElement;
                textElement.parent = this;
                this._disposers.push(this._textElement);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a background element for the button.
     *
     * @ignore Exclude from docs
     * @return {RoundedRectangle} Background element
     */
    Button.prototype.createBackground = function () {
        return new RoundedRectangle();
    };
    return Button;
}(Container));
export { Button };
//# sourceMappingURL=Button.js.map