/**
 * Functionality for adding images in SVG tree.
 */
import * as tslib_1 from "tslib";
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
    tslib_1.__extends(Image, _super);
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
        if (this.href) {
            this.element.attr({
                "width": this.innerWidth,
                "height": this.innerHeight
            });
            this.element.attrNS($dom.XLINK, "xlink:href", this.href);
        }
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