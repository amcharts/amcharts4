/**
 * This module contains a version of ColorSet that can (and should) be used for
 * coloring UI elements.
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
import { BaseObject } from "../Base";
import { color } from "./Color";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This module contains a version of ColorSet that can (and should) be used for
 * coloring UI elements.
 *
 * The main difference from the basic [[ColorSet]] is that instead of sequenced
 * colors, it uses a concept of named colors.
 *
 * This way, every element in the UI can extract an exact color theme author
 * meant for the specific purpose, like strokes, backgrounds, etc.
 */
var InterfaceColorSet = /** @class */ (function (_super) {
    __extends(InterfaceColorSet, _super);
    /**
     * Constructor
     */
    function InterfaceColorSet() {
        var _this = _super.call(this) || this;
        /**
         * Maps the list of purposes (like "stroke") to an index of color of the
         * color set.
         */
        _this._purposes = {
            stroke: color("#e5e5e5"),
            fill: color("#f3f3f3"),
            primaryButton: color("#6794dc"),
            primaryButtonHover: color("#6771dc"),
            primaryButtonDown: color("#68dc75"),
            primaryButtonActive: color("#68dc75"),
            primaryButtonText: color("#FFFFFF"),
            primaryButtonStroke: color("#FFFFFF"),
            secondaryButton: color("#d9d9d9"),
            secondaryButtonHover: color("#d9d9d9").brighten(-0.25),
            secondaryButtonDown: color("#d9d9d9").brighten(-0.35),
            secondaryButtonActive: color("#d9d9d9").brighten(0.35),
            secondaryButtonText: color("#000000"),
            secondaryButtonStroke: color("#FFFFFF"),
            grid: color("#000000"),
            background: color("#ffffff"),
            alternativeBackground: color("#000000"),
            text: color("#000000"),
            alternativeText: color("#FFFFFF"),
            disabledBackground: color("#999999"),
            positive: color("#67dc75"),
            negative: color("#dc6788")
        };
        _this.className = "InterfaceColorSet";
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a color to be used for the specific purpose.
     *
     * ```TypeScript
     * let uicolors = new am4core.InterfaceColorSet();
     * console.log(uicolors.getFor("stroke"));
     * ```
     * ```JavaScript
     * var uicolors = new am4core.InterfaceColorSet();
     * console.log(uicolors.getFor("stroke"));
     * ```
     *
     * @param  {keyof ColorPurpose}  purpose  Color use purpuse
     * @return {Color}                        Color
     */
    InterfaceColorSet.prototype.getFor = function (purpose) {
        return this._purposes[purpose];
    };
    /**
     * Sets color to be used for the specific purpose.
     *
     * @param {keyof ColorPurpose}  purpose  Color use purpose
     * @param {Color}               color    Color
     */
    InterfaceColorSet.prototype.setFor = function (purpose, color) {
        this._purposes[purpose] = color;
    };
    return InterfaceColorSet;
}(BaseObject));
export { InterfaceColorSet };
//# sourceMappingURL=InterfaceColorSet.js.map