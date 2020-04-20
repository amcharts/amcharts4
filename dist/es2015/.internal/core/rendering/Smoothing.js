/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { registry } from "../Registry";
import * as $path from "./Path";
import * as $array from "../utils/Array";
import * as $utils from "../utils/Utils";
import * as $math from "../utils/Math";
/**
 * @ignore Exclude from docs
 * @todo Description
 */
var Tension = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param tensionX [description]
     * @param tensionY [description]
     */
    function Tension(tensionX, tensionY) {
        this._tensionX = tensionX;
        this._tensionY = tensionY;
    }
    /**
     * [smooth description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param points  [description]
     * @return [description]
     */
    Tension.prototype.smooth = function (points) {
        for (var i = points.length - 1; i > 0; i--) {
            var p0 = points[i];
            var p1 = points[i - 1];
            if (Math.abs(p0.x - p1.x) < 0.1 && Math.abs(p0.y - p1.y) < 0.1) {
                points.splice(i, 1);
            }
        }
        var tensionX = this._tensionX;
        var tensionY = this._tensionY;
        if (points.length < 3 || (tensionX >= 1 && tensionY >= 1)) {
            return $path.polyline(points);
        }
        var first = points[0];
        var last = points[points.length - 1];
        var closed = false;
        if ($math.round(first.x, 3) == $math.round(last.x) && $math.round(first.y) == $math.round(last.y)) {
            closed = true;
        }
        // Can't moveTo here, as it wont be possible to have fill then.
        var path = "";
        for (var i = 0, len = points.length - 1; i < len; i++) {
            var p0 = points[i - 1];
            var p1 = points[i];
            var p2 = points[i + 1];
            var p3 = points[i + 2];
            if (i === 0) {
                if (closed) {
                    p0 = points[points.length - 2];
                }
                else {
                    p0 = points[i];
                }
            }
            else if (i == points.length - 2) {
                if (closed) {
                    p3 = points[1];
                }
                else {
                    p3 = points[i + 1];
                }
            }
            var controlPointA = $math.getCubicControlPointA(p0, p1, p2, p3, tensionX, tensionY);
            var controlPointB = $math.getCubicControlPointB(p0, p1, p2, p3, tensionX, tensionY);
            path += $path.cubicCurveTo(p2, controlPointA, controlPointB);
        }
        return path;
    };
    return Tension;
}());
export { Tension };
/**
 * Returns a waved line SVG path between two points.
 *
 * @ignore Exclude from docs
 * @param point1            Starting point
 * @param point2            Ending point
 * @param waveLength        Wave length
 * @param waveHeight        Wave height
 * @param adjustWaveLength  Adjust wave length based on the actual line length
 * @return SVG path
 */
export function wavedLine(point1, point2, waveLength, waveHeight, tension, adjustWaveLength) {
    var x1 = point1.x;
    var y1 = point1.y;
    var x2 = point2.x;
    var y2 = point2.y;
    var distance = $math.getDistance(point1, point2);
    if (adjustWaveLength) {
        waveLength = distance / Math.round(distance / waveLength);
    }
    var d = registry.getCache($utils.stringify(["wavedLine", point1.x, point2.x, point1.y, point2.y, waveLength, waveHeight]));
    if (!d) {
        if (distance > 0) {
            var angle = Math.atan2(y2 - y1, x2 - x1);
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var waveLengthX = waveLength * cos;
            var waveLengthY = waveLength * sin;
            if (waveLength <= 1 || waveHeight <= 1) {
                d = $path.lineTo(point2);
            }
            else {
                var halfWaveCount = Math.round(2 * distance / waveLength);
                var points = [];
                var sign = 1;
                if (x2 < x1) {
                    sign *= -1;
                }
                if (y2 < y1) {
                    sign *= -1;
                }
                for (var i = 0; i <= halfWaveCount; i++) {
                    sign *= -1;
                    var x = x1 + i * waveLengthX / 2 + sign * waveHeight / 2 * sin;
                    var y = y1 + i * waveLengthY / 2 - sign * waveHeight / 2 * cos;
                    points.push({ x: x, y: y });
                }
                d = new Tension(tension, tension).smooth(points);
            }
        }
        else {
            d = "";
        }
        registry.setCache($utils.stringify(["wavedLine", point1.x, point2.x, point1.y, point2.y, waveLength, waveHeight]), d);
    }
    return d;
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
var Basis = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param info  [description]
     */
    function Basis(info) {
        this._closed = info.closed;
    }
    /**
     * [smooth description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param points  [description]
     * @return [description]
     */
    Basis.prototype.smooth = function (points) {
        var _this = this;
        var x0 = NaN;
        var x1 = NaN;
        var x2 = NaN;
        var x3 = NaN;
        var x4 = NaN;
        var y0 = NaN;
        var y1 = NaN;
        var y2 = NaN;
        var y3 = NaN;
        var y4 = NaN;
        var point = 0;
        var output = "";
        var pushCurve = function (x, y) {
            output += $path.cubicCurveTo({
                x: (x0 + 4 * x1 + x) / 6,
                y: (y0 + 4 * y1 + y) / 6
            }, {
                x: (2 * x0 + x1) / 3,
                y: (2 * y0 + y1) / 3
            }, {
                x: (x0 + 2 * x1) / 3,
                y: (y0 + 2 * y1) / 3
            });
        };
        var pushPoint = function (_a) {
            var x = _a.x, y = _a.y;
            switch (point) {
                case 0:
                    point = 1;
                    if (_this._closed) {
                        x2 = x;
                        y2 = y;
                    }
                    else {
                        output += $path.lineTo({ x: x, y: y });
                    }
                    break;
                case 1:
                    point = 2;
                    if (_this._closed) {
                        x3 = x;
                        y3 = y;
                    }
                    break;
                case 2:
                    point = 3;
                    if (_this._closed) {
                        x4 = x;
                        y4 = y;
                        output += $path.moveTo({ x: (x0 + 4 * x1 + x) / 6, y: (y0 + 4 * y1 + y) / 6 });
                        break;
                    }
                    else {
                        output += $path.lineTo({ x: (5 * x0 + x1) / 6, y: (5 * y0 + y1) / 6 });
                        // fall-through
                    }
                default:
                    pushCurve(x, y);
                    break;
            }
            x0 = x1;
            x1 = x;
            y0 = y1;
            y1 = y;
        };
        $array.each(points, pushPoint);
        if (this._closed) {
            switch (point) {
                case 1:
                    output += $path.moveTo({ x: x2, y: y2 });
                    output += $path.closePath();
                    break;
                case 2:
                    output += $path.moveTo({ x: (x2 + 2 * x3) / 3, y: (y2 + 2 * y3) / 3 });
                    output += $path.lineTo({ x: (x3 + 2 * x2) / 3, y: (y3 + 2 * y2) / 3 });
                    output += $path.closePath();
                    break;
                case 3:
                    pushPoint({ x: x2, y: y2 });
                    pushPoint({ x: x3, y: y3 });
                    pushPoint({ x: x4, y: y4 });
                    break;
            }
        }
        else {
            switch (point) {
                case 3:
                    pushCurve(x1, y1);
                // fall-through
                case 2:
                    output += $path.lineTo({ x: x1, y: y1 });
                    break;
            }
            output += $path.closePath();
        }
        return output;
    };
    return Basis;
}());
export { Basis };
//# sourceMappingURL=Smoothing.js.map