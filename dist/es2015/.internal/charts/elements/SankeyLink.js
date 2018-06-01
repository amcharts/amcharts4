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
import { Container } from "../../core/Container";
import { LinearGradient } from "../../core/rendering/fills/LinearGradient";
import { registry } from "../../core/Registry";
import { Bullet } from "../elements/Bullet";
import { Color } from "../../core/utils/Color";
import { ListTemplate } from "../../core/utils/List";
import { Polyspline } from "../../core/elements/Polyspline";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $math from "../../core/utils/Math";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $smoothing from "../../core/rendering/Smoothing";
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
        _this.tension = 0.8;
        _this.controlPointDistance = 0.2;
        _this.maskBullets = false;
        _this.layout = "none";
        _this.isMeasured = false;
        _this.startAngle = 0;
        _this.endAngle = 0;
        _this.linkWidth = 0;
        _this.startX = 0;
        _this.endX = 0;
        _this.startY = 0;
        _this.endY = 0;
        _this.strokeOpacity = 0;
        // this is very important, otherwise the container will be shifted
        _this.verticalCenter = "none";
        _this.horizontalCenter = "none";
        _this.tooltipText = "{fromName}→{toName}:{value.value}";
        _this.tooltipLocation = 0.5;
        _this.link = _this.createChild(Sprite);
        _this.link.shouldClone = false;
        _this.link.element = _this.paper.add("path");
        _this.fillOpacity = 0.2;
        _this.fill = interfaceColors.getFor("alternativeBackground");
        _this.bulletsContainer = _this.createChild(Container);
        _this.bulletsContainer.shouldClone = false;
        _this.bulletsContainer.layout = "none";
        _this.bulletsMask = _this.createChild(Sprite);
        _this.bulletsMask.shouldClone = false;
        _this.bulletsMask.element = _this.paper.add("path");
        _this.middleSpline = _this.createChild(Polyspline);
        _this.middleSpline.shouldClone = false;
        _this.middleSpline.strokeOpacity = 0;
        //this.maxWidth = 100;
        //this.maxHeight = 100;
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
        if (!this.isTemplate) {
            var x0 = this.startX;
            var y0 = this.startY;
            var x1 = this.endX;
            var y1 = this.endY;
            if (!$type.isNumber(x1)) {
                x1 = x0;
            }
            if (!$type.isNumber(y1)) {
                y1 = y0;
            }
            var startAngle = this.startAngle;
            var endAngle = this.endAngle;
            var w = this.linkWidth;
            var path = "";
            var xt0 = x0;
            var yt0 = y0;
            var xt1 = x1;
            var yt1 = y1;
            var xb0 = x0 + w * $math.sin(startAngle);
            var xb1 = x1 + w * $math.sin(endAngle);
            var yb0 = y0 + w * $math.cos(startAngle);
            var yb1 = y1 + w * $math.cos(endAngle);
            var xm0 = x0 + w / 2 * $math.sin(startAngle);
            var xm1 = x1 + w / 2 * $math.sin(endAngle);
            var ym0 = y0 + w / 2 * $math.cos(startAngle);
            var ym1 = y1 + w / 2 * $math.cos(endAngle);
            this.zIndex = this.zIndex || this.dataItem.index;
            var tensionX = this.tension + (1 - this.tension) * $math.sin(startAngle);
            var tensionY = this.tension + (1 - this.tension) * $math.cos(startAngle);
            this.middleSpline.tensionX = tensionX;
            this.middleSpline.tensionY = tensionY;
            if ($type.isNumber(w) && ($type.isNumber(x0) && $type.isNumber(x1) && $type.isNumber(y0) && $type.isNumber(y1))) {
                // solves issues with gradient fill of straight lines
                if ($math.round(xt0, 3) == $math.round(xt1, 3)) {
                    xt1 += 0.01;
                }
                if ($math.round(yt0, 3) == $math.round(yt1, 3)) {
                    yt1 += 0.01;
                }
                if ($math.round(xb0, 3) == $math.round(xb1, 3)) {
                    xb1 += 0.01;
                }
                if ($math.round(yb0, 3) == $math.round(yb1, 3)) {
                    yb1 += 0.01;
                }
                var minX = Math.min(xb0, xb1, xt0, xt1);
                var minY = Math.min(yb0, yb1, yt0, yt1);
                var maxX = Math.max(xb0, xb1, xt0, xt1);
                var maxY = Math.max(yb0, yb1, yt0, yt1);
                this._bbox = {
                    x: minX,
                    y: minY,
                    width: maxX - minX,
                    height: maxY - minY
                };
                var cpd = this.controlPointDistance;
                var kxt0 = xt0 + (xt1 - xt0) * cpd * $math.cos(startAngle);
                var kyt0 = yt0 + (yt1 - yt0) * cpd * $math.sin(startAngle);
                var kxt1 = xt1 - (xt1 - xt0) * cpd * $math.cos(endAngle);
                var kyt1 = yt1 - (yt1 - yt0) * cpd * $math.sin(endAngle);
                var kxm0 = xm0 + (xm1 - xm0) * cpd * $math.cos(startAngle);
                var kym0 = ym0 + (ym1 - ym0) * cpd * $math.sin(startAngle);
                var kxm1 = xm1 - (xm1 - xm0) * cpd * $math.cos(endAngle);
                var kym1 = ym1 - (ym1 - ym0) * cpd * $math.sin(endAngle);
                var angle = $math.getAngle({ x: kxt0, y: kyt0 }, { x: kxt1, y: kyt1 });
                var dx = (w / $math.cos(angle) - w) / $math.tan(angle) * $math.cos(startAngle);
                var dy = (w / $math.sin(angle) - w) * $math.tan(angle) * $math.sin(startAngle);
                var kxb0 = -dx / 2 + xb0 + (xb1 - xb0) * cpd * $math.cos(startAngle);
                var kyb0 = -dy / 2 + yb0 + (yb1 - yb0) * cpd * $math.sin(startAngle);
                var kxb1 = -dx / 2 + xb1 - (xb1 - xb0) * cpd * $math.cos(endAngle);
                var kyb1 = -dy / 2 + yb1 - (yb1 - yb0) * cpd * $math.sin(endAngle);
                this.middleSpline.segments = [[{ x: xm0, y: ym0 }, { x: kxm0, y: kym0 }, { x: kxm1, y: kym1 }, { x: xm1, y: ym1 }]];
                kxt0 += dx / 2;
                kyt0 += dy / 2;
                kxt1 += dx / 2;
                kyt1 += dy / 2;
                path += $path.moveTo({ x: xt0, y: yt0 });
                path += new $smoothing.Tension(tensionX, tensionY).smooth([{ x: xt0, y: yt0 }, { x: kxt0, y: kyt0 }, { x: kxt1, y: kyt1 }, { x: xt1, y: yt1 }]);
                path += $path.lineTo({ x: xb1, y: yb1 });
                path += new $smoothing.Tension(tensionX, tensionY).smooth([{ x: xb1, y: yb1 }, { x: kxb1, y: kyb1 }, { x: kxb0, y: kyb0 }, { x: xb0, y: yb0 }]);
                path += $path.closePath();
                this._overflowX = 0;
                this._overflowY = 0;
            }
            this.link.element.attr({ "d": path });
            if (this.maskBullets) {
                this.bulletsMask.element.attr({ "d": path });
                this.bulletsContainer.mask = this.bulletsMask;
            }
            this.positionBullets();
        }
    };
    SankeyLink.prototype.positionBullets = function () {
        var _this = this;
        $iter.each(this.bullets.iterator(), function (bullet) {
            bullet.parent = _this.bulletsContainer;
            _this.positionBullet(bullet);
        });
    };
    SankeyLink.prototype.positionBullet = function (bullet) {
        var location = bullet.locationX;
        if (!$type.isNumber(location)) {
            location = bullet.locationY;
        }
        if (!$type.isNumber(location)) {
            location = 0.5;
        }
        var point = this.middleSpline.positionToPoint(location);
        bullet.moveTo(point);
        var rotationField = bullet.propertyFields.rotation;
        var angle;
        if (bullet.dataItem) {
            var dataContext = bullet.dataItem.dataContext;
            angle = dataContext[rotationField];
        }
        if (!$type.isNumber(angle)) {
            angle = point.angle;
        }
        bullet.rotation = angle;
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
                this.fill = this.gradient;
                this.stroke = this.gradient;
            }
            this.setPropertyValue("colorMode", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "maskBullets", {
        /**
         * @return {boolean} mask bullets value
         */
        get: function () {
            return this.getPropertyValue("maskBullets");
        },
        /**
         * Should link bullets be masked or not
         *
         * @param {boolean}  value
         * @default false;
         */
        set: function (value) {
            this.setPropertyValue("maskBullets", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "controlPointDistance", {
        /**
         * @return {number} relative control point distance
         */
        get: function () {
            return this.getPropertyValue("controlPointDistance");
        },
        /**
         * Distance of control point of a link, defines relative distance from a node at which linke should bend
         * @default 0.2
         * @param {number}  value
         */
        set: function (value) {
            this.setPropertyValue("controlPointDistance", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "tension", {
        /**
         * @return {number} tension value
         */
        get: function () {
            return this.getPropertyValue("tension");
        },
        /**
         * Tension of a spline, 1 would make the link to have sharp edges
         * @default 0.8
         * @param {number} value
         */
        set: function (value) {
            this.setPropertyValue("tension", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SankeyLink.prototype, "tooltipLocation", {
        /**
         * @type {number} tooltip location value
         */
        get: function () {
            return this.getPropertyValue("tooltipLocation");
        },
        /**
         * Relative location of a tooltip.
         * @default 0.5
         *
         * @param {number} value
         */
        set: function (value) {
            this.setPropertyValue("tooltipLocation", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds color steps in the link gradient.
     *
     * @param {Color | Pattern | LinearGradient | RadialGradient}  value  Fill option
     */
    SankeyLink.prototype.setFill = function (value) {
        _super.prototype.setFill.call(this, value);
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
    Object.defineProperty(SankeyLink.prototype, "bullets", {
        /**
         * List of bullets
         *
         * @return {ListTemplate<Bullet>} [description]
         */
        get: function () {
            var _this = this;
            if (!this._bullets) {
                this._bullets = new ListTemplate(new Bullet());
                this._bullets.events.on("insert", function (event) {
                    event.newValue.events.on("propertychanged", function (event) {
                        if (event.property == "locationX" || event.property == "locationY") {
                            _this.positionBullet(event.target);
                        }
                    });
                });
            }
            return this._bullets;
        },
        enumerable: true,
        configurable: true
    });
    SankeyLink.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        this.bullets.copyFrom(source.bullets);
    };
    /**
     * @ignore Exclude from docs
     * @return {number} Tooltip X (px)
     */
    SankeyLink.prototype.getTooltipX = function () {
        return this.middleSpline.positionToPoint(this.tooltipLocation).x;
    };
    /**
     * @ignore Exclude from docs
     * @return {number} Tooltip Y (px)
     */
    SankeyLink.prototype.getTooltipY = function () {
        return this.middleSpline.positionToPoint(this.tooltipLocation).y;
    };
    return SankeyLink;
}(Container));
export { SankeyLink };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SankeyLink"] = SankeyLink;
//# sourceMappingURL=SankeyLink.js.map