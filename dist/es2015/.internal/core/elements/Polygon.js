/**
 * Polygon module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../Sprite";
import { Morpher } from "../utils/Morpher";
import { registry } from "../Registry";
import * as $path from "../rendering/Path";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a polygon.
 *
 * @see {@link IPolygonEvents} for a list of available events
 * @see {@link IPolygonAdapters} for a list of available Adapters
 */
var Polygon = /** @class */ (function (_super) {
    tslib_1.__extends(Polygon, _super);
    /**
     * Constructor
     */
    function Polygon() {
        var _this = _super.call(this) || this;
        _this.className = "Polygon";
        _this.element = _this.paper.add("path");
        _this.shapeRendering = "auto";
        _this._currentPoints = [];
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(Polygon.prototype, "points", {
        /**
         * @return {IPoint[]} Polygon points
         */
        get: function () {
            return this.getPropertyValue("points");
        },
        /**
         * An array of X/Y coordinates for each elbow of the polygon.
         *
         * @todo Example
         * @param {IPoint[][][]}  points  Polygon points
         */
        set: function (points) {
            this.setPropertyValue("points", points, true);
            this._currentPoints = this.points;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "currentPoints", {
        /**
         * @return {IPoint[]} Polygon points
         */
        get: function () {
            return this._currentPoints;
        },
        /**
         * Current points. Used when morphing the element, so that original `points`
         * are not overwritten.
         *
         * @param {IPoint[][][]}  points  Polygon points
         */
        set: function (points) {
            if (this._currentPoints != points) {
                this._currentPoints = points;
                this.draw();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    Polygon.prototype.draw = function () {
        var path = "";
        var points = this._currentPoints;
        var left;
        var right;
        var top;
        var bottom;
        if (points.length > 0) {
            // separate areas
            for (var i = 0; i < points.length; i++) {
                // surface
                var surface = points[i][0];
                var hole = points[i][1];
                if (surface && surface.length > 0) {
                    var point = surface[0];
                    path += $path.moveTo(point);
                    for (var s = 0; s < surface.length; s++) {
                        point = surface[s];
                        path += $path.lineTo(point);
                        if (!$type.isNumber(right) || (right < point.x)) {
                            right = point.x;
                        }
                        if (!$type.isNumber(left) || (left > point.x)) {
                            left = point.x;
                        }
                        if (!$type.isNumber(top) || (top > point.y)) {
                            top = point.y;
                        }
                        if (!$type.isNumber(bottom) || (bottom < point.y)) {
                            bottom = point.y;
                        }
                    }
                }
                // hole
                if (hole && hole.length > 0) {
                    var point = hole[0];
                    path += $path.moveTo(point);
                    for (var h = 0; h < hole.length; h++) {
                        point = hole[h];
                        path += $path.lineTo(point);
                    }
                }
            }
            if (path) {
                path += $path.closePath();
            }
            this.bbox.x = left;
            this.bbox.y = top;
            this.bbox.width = right - left;
            this.bbox.height = bottom - top;
        }
        this.element.attr({ "d": path });
    };
    /**
     * Measures element
     */
    Polygon.prototype.measureElement = function () {
        // Overriding to avoid extra measurement.
    };
    Object.defineProperty(Polygon.prototype, "centerPoint", {
        /**
         * A calculated center point for the shape.
         *
         * @readonly
         * @return {IPoint} Center
         */
        get: function () {
            return { x: this.bbox.x + this.bbox.width / 2, y: this.bbox.y + this.bbox.height / 2 };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "morpher", {
        /**
         * A [[Morpher]] instance that is used to morph polygon into some other
         * shape.
         *
         * @readonly
         * @return {Morpher} Morpher instance
         */
        get: function () {
            if (!this._morpher) {
                this._morpher = new Morpher(this);
                this._disposers.push(this._morpher);
            }
            return this._morpher;
        },
        enumerable: true,
        configurable: true
    });
    return Polygon;
}(Sprite));
export { Polygon };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Polygon"] = Polygon;
//# sourceMappingURL=Polygon.js.map