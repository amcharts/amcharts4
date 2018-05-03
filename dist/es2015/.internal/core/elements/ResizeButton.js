/**
 * Resize button module.
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
import { Button } from "./Button";
import { Sprite } from "../Sprite";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { registry } from "../Registry";
import * as $path from "../rendering/Path";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a draggable resize/grip button.
 *
 * @see {@link IResizeButtonEvents} for a list of available events
 * @see {@link IResizeButtonAdapters} for a list of available Adapters
 */
var ResizeButton = /** @class */ (function (_super) {
    __extends(ResizeButton, _super);
    /**
     * Constructor
     */
    function ResizeButton() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "ResizeButton";
        // Set defaults
        _this.orientation = "horizontal";
        _this.draggable = true;
        _this.padding(8, 8, 8, 8);
        _this.background.cornerRadius(20, 20, 20, 20);
        _this.horizontalCenter = "middle";
        _this.verticalCenter = "middle";
        // Create an icon
        var icon = new Sprite();
        icon.element = _this.paper.add("path");
        var path = $path.moveTo({ x: 0, y: 0 });
        path += $path.lineTo({ x: 0, y: 10 });
        path += $path.moveTo({ x: 3, y: 0 });
        path += $path.lineTo({ x: 3, y: 10 });
        icon.element.attr({ "d": path });
        icon.pixelPerfect = true;
        icon.padding(0, 3, 0, 3);
        icon.stroke = new InterfaceColorSet().getFor("alternativeText");
        icon.strokeOpacity = 0.7;
        _this.icon = icon;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(ResizeButton.prototype, "orientation", {
        /**
         * Use for setting of direction (orientation) of the resize button.
         *
         * Available options: "horizontal", "vertical".
         *
         * @param {Orientation} value Orientation
         */
        set: function (value) {
            var icon = this.icon;
            if (icon) {
                if (value == "horizontal") {
                    icon.rotation = 0;
                }
                else {
                    icon.rotation = -90;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return ResizeButton;
}(Button));
export { ResizeButton };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ResizeButton"] = ResizeButton;
//# sourceMappingURL=ResizeButton.js.map