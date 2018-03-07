/**
 * SankeyLink module
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
import { Sprite } from "../../core/Sprite";
import { LinearGradient } from "../../core/rendering/fills/LinearGradient";
import { system } from "../../core/System";
import { color, Color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Sankey Diagram.
 *
 * @see {@link ISankeyLinkEvents} for a list of available events
 * @see {@link ISankeyLinkAdapters} for a list of available Adapters
 * @important
 */
var SankeyLink = /** @class */ (function (_super) {
    __extends(SankeyLink, _super);
    /**
     * Constructor
     */
    function SankeyLink() {
        var _this = _super.call(this) || this;
        /**
         * A gradiend instance that is used to provided colored gradient fills for
         * the Sankey link.
         *
         * @type {LinearGradient}
         */
        _this.gradient = new LinearGradient();
        _this.className = "SankeyLink";
        var interfaceColors = new InterfaceColorSet();
        _this.element = _this.paper.add("path");
        _this.startAngle = 0;
        _this.endAngle = 0;
        _this.linkWidth = 0;
        _this.startX = 0;
        _this.endX = 0;
        _this.startY = 0;
        _this.endY = 0;
        _this.strokeOpacity = 0.2;
        _this.stroke = interfaceColors.getFor("alternativeBackground");
        _this.maxWidth = 100;
        _this.maxHeight = 100;
        var hoverState = _this.states.create("hover");
        hoverState.properties.strokeOpacity = 0.4;
        _this.tooltipText = "{fromName}→{toName}:{value.value}";
        _this.applyTheme();
        return _this;
    }
    /**
     * (Re)validates (redraws) the link.
     *
     * @ignore Exclude from docs
     */
    SankeyLink.prototype.validate = function () {
        _super.prototype.validate.call(this);
        var x0 = this.startX;
        var y0 = this.startY;
        var x1 = this.endX;
        var y1 = this.endY;
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        var w = this.linkWidth;
        var path = "";
        this.fill = color();
        this.strokeWidth = w;
        this.element.attr({ "stroke-linecap": "butt" });
        x0 = x0 + w / 2 * $math.sin(startAngle);
        x1 = x1 + w / 2 * $math.sin(endAngle);
        y0 = y0 + w / 2 * $math.cos(startAngle);
        y1 = y1 + w / 2 * $math.cos(endAngle);
        var kx0 = x0 + (x1 - x0) / 2 * $math.cos(startAngle);
        var ky0 = y0 + (y1 - y0) / 2 * $math.sin(startAngle);
        var kx1 = x1 - (x1 - x0) / 2 * $math.cos(endAngle);
        var ky1 = y1 - (y1 - y0) / 2 * $math.sin(endAngle);
        // hack to solve problem of gradients not being applied on straight lines.
        if (x0 == x1) {
            x1 += 0.001;
        }
        if (y0 == y1) {
            y1 += 0.001;
        }
        path = $path.moveTo({ x: x0, y: y0 });
        path += $path.cubicCurveTo({ x: x1, y: y1 }, { x: kx0, y: ky0 }, { x: kx1, y: ky1 });
        this._bbox = {
            x: x0,
            y: y0,
            width: x1 - x0,
            height: y1 - y0
        };
        this.element.attr({ "d": path });
    };
    Object.defineProperty(SankeyLink.prototype, "startAngle", {
        /**
         * @return {number} Start angle
         */
        get: function () {
            return this.getPropertyValue("startAngle");
        },
        /**
         * [startAngle description]
         *
         * @todo Description
         * @param {number}  value  Start angle
         */
        set: function (value) {
            this.setPropertyValue("startAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "endAngle", {
        /**
         * @return {number} End angle
         */
        get: function () {
            return this.getPropertyValue("endAngle");
        },
        /**
         * [endAngle description]
         *
         * @todo Description
         * @param {number}  value  End angle
         */
        set: function (value) {
            this.setPropertyValue("endAngle", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "startX", {
        /**
         * @return {number} Start X
         */
        get: function () {
            return this.getPropertyValue("startX");
        },
        /**
         * [startX description]
         *
         * @todo Description
         * @param {number}  value  Start X
         */
        set: function (value) {
            this.setPropertyValue("startX", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "endX", {
        /**
         * @return {number} End X
         */
        get: function () {
            return this.getPropertyValue("endX");
        },
        /**
         * [endX description]
         *
         * @todo Description
         * @param {number} value  End X
         */
        set: function (value) {
            this.setPropertyValue("endX", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "startY", {
        /**
         * @return {number} Start Y
         */
        get: function () {
            return this.getPropertyValue("startY");
        },
        /**
         * [startY description]
         *
         * @todo Description
         * @param {number}  value  Start Y
         */
        set: function (value) {
            this.setPropertyValue("startY", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "endY", {
        /**
         * @return {number} End Y
         */
        get: function () {
            return this.getPropertyValue("endY");
        },
        /**
         * [endY description]
         *
         * @todo Description
         * @param {number} value End Y
         */
        set: function (value) {
            this.setPropertyValue("endY", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "linkWidth", {
        /**
         * @return {number} [description]
         */
        get: function () {
            return this.getPropertyValue("linkWidth");
        },
        /**
         * [linkWidth description]
         *
         * @todo Description
         * @param {number} value [description]
         */
        set: function (value) {
            this.setPropertyValue("linkWidth", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "colorMode", {
        /**
         * @type {"solid" | "gradient"} Fill mode
         */
        get: function () {
            return this.getPropertyValue("colorMode");
        },
        /**
         * Should link be filled with a solid color or gradient.
         *
         * @param {"solid" | "gradient"}  value  Fill mode
         */
        set: function (value) {
            if (value == "gradient") {
                //this.fill = this.gradient;
                this.stroke = this.gradient;
            }
            this.setPropertyValue("colorMode", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds color steps in the link gradient.
     *
     * @param {Color | Pattern | LinearGradient | RadialGradient}  value  Fill option
     */
    SankeyLink.prototype.setStroke = function (value) {
        _super.prototype.setStroke.call(this, value);
        if (value instanceof Color) {
            this.gradient.stops.clear();
            this.gradient.addColor(value);
            this.gradient.addColor(value);
        }
    };
    /**
     * Updates bounding box based on element dimension settings.
     *
     * @ignore Exclude from docs
     */
    SankeyLink.prototype.measureElement = function () {
    };
    return SankeyLink;
}(Sprite));
export { SankeyLink };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
system.registeredClasses["SankeyLink"] = SankeyLink;
//# sourceMappingURL=SankeyLink.js.map