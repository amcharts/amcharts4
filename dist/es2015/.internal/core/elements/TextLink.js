/**
 * A module that defines Text element used to indicate links.
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
import { Text } from "../../core/elements/Text";
import { MouseCursorStyle } from "../../core/interaction/Mouse";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a text element with a link.
 *
 * @see {@link ITextLinkEvents} for a list of available events
 * @see {@link ITextLinkAdapters} for a list of available Adapters
 */
var TextLink = /** @class */ (function (_super) {
    __extends(TextLink, _super);
    /**
     * Constructor
     */
    function TextLink() {
        var _this = _super.call(this) || this;
        _this.className = "TextLink";
        _this.selectable = true;
        var interfaceColors = new InterfaceColorSet();
        _this.fill = interfaceColors.getFor("primaryButton");
        var hoverState = _this.states.create("hover");
        hoverState.properties.fill = interfaceColors.getFor("primaryButtonHover");
        var downState = _this.states.create("down");
        downState.properties.fill = interfaceColors.getFor("primaryButtonDown");
        _this.cursorOverStyle = MouseCursorStyle.pointer;
        _this.applyTheme();
        return _this;
    }
    return TextLink;
}(Text));
export { TextLink };
//# sourceMappingURL=TextLink.js.map