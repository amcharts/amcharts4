/**
 * Polyspline (smoothed line) module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Polyline } from "./Polyline";
import { registry } from "../Registry";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a polysline. (smoothed multi-sigment line)
 *
 * @see {@link IPolysplineEvents} for a list of available events
 * @see {@link IPolysplineAdapters} for a list of available Adapters
 */
var Polyspline = /** @class */ (function (_super) {
    tslib_1.__extends(Polyspline, _super);
    /**
     * Constructor
     */
    function Polyspline() {
        var _this = _super.call(this) || this;
        _this.className = "Polyspline";
        _this.tensionX = 0.5;
        _this.tensionY = 0.5;
        _this.applyTheme();
        return _this;
    }
    /**
     * Creats and adds an SVG path for the arc.
     *
     * @ignore Exclude from docs
     */
    Polyspline.prototype.makePath = function () {
        this._distance = 0;
        var segments = this.segments;
        var tensionX = this.tensionX;
        var tensionY = this.tensionY;
        if (segments && segments.length > 0) {
            var path = "";
            this._realSegments = [];
            for (var i = 0, len = segments.length; i < len; i++) {
                var points = segments[i];
                var realPoints = [];
                this._realSegments.push(realPoints);
                if (points.length > 0) {
                    path += $path.moveTo(points[0]);
                    for (var p = 0; p < points.length - 1; p++) {
                        var p0 = points[p - 1];
                        var p1 = points[p];
                        var p2 = points[p + 1];
                        var p3 = points[p + 2];
                        if (p === 0) {
                            p0 = points[p];
                        }
                        else if (p == points.length - 2) {
                            p3 = points[p + 1];
                        }
                        if (!p3) {
                            p3 = p2;
                        }
                        var controlPointA = $math.getCubicControlPointA(p0, p1, p2, p3, tensionX, tensionY);
                        var controlPointB = $math.getCubicControlPointB(p0, p1, p2, p3, tensionX, tensionY);
                        path += $path.cubicCurveTo(p2, controlPointA, controlPointB);
                        // now split to small segments so that we could have positionToPoint later
                        var stepCount = Math.ceil($math.getDistance(p1, p2)) / 2;
                        var prevPoint = p1;
                        if (stepCount > 0) {
                            for (var s = 0; s <= stepCount; s++) {
                                var point = $math.getPointOnCubicCurve(p1, p2, controlPointA, controlPointB, s / stepCount);
                                realPoints.push(point);
                                this._distance += $math.getDistance(prevPoint, point);
                                //path += $path.lineTo(point);
                                prevPoint = point;
                            }
                        }
                        else {
                            realPoints.push(p0);
                        }
                    }
                }
            }
            this.path = path;
        }
    };
    Object.defineProperty(Polyspline.prototype, "tensionX", {
        /**
         * @return Tension
         */
        get: function () {
            return this.getPropertyValue("tensionX");
        },
        /**
         * Horizontal tension for the spline.
         *
         * Used by the line smoothing algorithm.
         *
         * @default 0.5
         * @param value  Tension
         */
        set: function (value) {
            this.setPropertyValue("tensionX", value);
            this.makePath();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polyspline.prototype, "tensionY", {
        /**
         * @return Tension
         */
        get: function () {
            return this.getPropertyValue("tensionY");
        },
        /**
         * Vertical tension for the spline.
         *
         * Used by the line smoothing algorithm.
         *
         * @default 0.5
         * @param value  Tensions
         */
        set: function (value) {
            this.setPropertyValue("tensionY", value, true);
            this.makePath();
        },
        enumerable: true,
        configurable: true
    });
    return Polyspline;
}(Polyline));
export { Polyspline };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Polyspline"] = Polyspline;
//# sourceMappingURL=Polyspline.js.map