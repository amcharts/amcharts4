/**
 * Functionality for adding images in SVG tree.
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
import { Sprite } from "../Sprite";
import { registry } from "../Registry";
import * as $dom from "../utils/DOM";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to add `<image>` elements to SVG.
 *
 * @see {@link IImageEvents} for a list of available events
 * @see {@link IImageAdapters} for a list of available Adapters
 */
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    /**
     * Constructor
     */
    function Image() {
        var _this = _super.call(this) || this;
        _this.className = "Image";
        _this.element = _this.paper.add("image");
        _this.applyTheme();
        _this.width = 50;
        _this.height = 50;
        return _this;
    }
    /**
     * Draws an `<image>` element.
     *
     * @ignore Exclude from docs
     */
    Image.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.element.attr({
            "width": this.innerWidth,
            "height": this.innerHeight
        });
        this.element.attrNS($dom.XLINK, "xlink:href", this.href);
    };
    Object.defineProperty(Image.prototype, "href", {
        /**
         * @return {string} Image URI
         */
        get: function () {
            return this.getPropertyValue("href");
        },
        /**
         * An image URI.
         *
         * @param {string}  value  Image URI
         */
        set: function (value) {
            this.setPropertyValue("href", value, true);
        },
        enumerable: true,
        configurable: true
    });
    return Image;
}(Sprite));
export { Image };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Image"] = Image;
//# sourceMappingURL=Image.js.map