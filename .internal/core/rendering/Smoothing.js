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
import * as $path from "./Path";
import * as $array from "../utils/Array";
import * as $math from "../utils/Math";
/**
 * [sign description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @todo Move this someplace else
 * @param {number} x [description]
 */
function sign(x) {
    return x < 0 ? -1 : 1;
}
/**
 * [slope2 description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {number} x0 [description]
 * @param  {number} x1 [description]
 * @param  {number} y0 [description]
 * @param  {number} y1 [description]
 * @param  {number} t  [description]
 * @return {number}    [description]
 */
function slope2(x0, x1, y0, y1, t) {
    var h = x1 - x0;
    return h ? (3 * (y1 - y0) / h - t) / 2 : t;
}
/**
 * [slope3 description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {number} x0 [description]
 * @param  {number} x1 [description]
 * @param  {number} y0 [description]
 * @param  {number} y1 [description]
 * @param  {number} x2 [description]
 * @param  {number} y2 [description]
 * @return {number}    [description]
 */
function slope3(x0, x1, y0, y1, x2, y2) {
    var h0 = x1 - x0;
    var h1 = x2 - x1;
    var s0 = (y1 - y0) / (h0 || h1 < 0 && -0);
    var s1 = (y2 - y1) / (h1 || h0 < 0 && -0);
    var p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
var Monotone = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {boolean}  reversed  [description]
     * @param {object}   info      [description]
     */
    function Monotone(reversed, info) {
        this._reversed = reversed;
        this._closed = info.closed;
    }
    /**
     * [_curve description]
     *
     * According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
     * "you can express cubic Hermite interpolation in terms of cubic Bézier curves
     * with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
     *
     * @todo Description
     * @param  {number} x0 [description]
     * @param  {number} x1 [description]
     * @param  {number} y0 [description]
     * @param  {number} y1 [description]
     * @param  {number} t0 [description]
     * @param  {number} t1 [description]
     * @return {string}    [description]
     */
    Monotone.prototype._curve = function (x0, x1, y0, y1, t0, t1) {
        var dx = (x1 - x0) / 3;
        if (this._reversed) {
            return $path.cubicCurveTo({ x: y1, y: x1 }, { x: y0 + dx * t0, y: x0 + dx }, { x: y1 - dx * t1, y: x1 - dx });
        }
        else {
            return $path.cubicCurveTo({ x: x1, y: y1 }, { x: x0 + dx, y: y0 + dx * t0 }, { x: x1 - dx, y: y1 - dx * t1 });
        }
    };
    /**
     * [smooth description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {Array<IPoint>} points [description]
     * @return {string}               [description]
     */
    Monotone.prototype.smooth = function (points) {
        var _this = this;
        var x0 = NaN;
        var x1 = NaN;
        var y0 = NaN;
        var y1 = NaN;
        var t0 = NaN;
        var point = 0;
        var output = "";
        $array.each(points, function (_a) {
            var x = _a.x, y = _a.y;
            if (_this._reversed) {
                var temp = x;
                x = y;
                y = temp;
            }
            var t1 = NaN;
            if (!(x === x1 && y === y1)) {
                switch (point) {
                    case 0:
                        point = 1;
                        if (_this._reversed) {
                            output += $path.lineTo({ x: y, y: x });
                        }
                        else {
                            output += $path.lineTo({ x: x, y: y });
                        }
                        break;
                    case 1:
                        point = 2;
                        break;
                    case 2:
                        point = 3;
                        output += _this._curve(x0, x1, y0, y1, slope2(x0, x1, y0, y1, t1 = slope3(x0, x1, y0, y1, x, y)), t1);
                        break;
                    default:
                        output += _this._curve(x0, x1, y0, y1, t0, t1 = slope3(x0, x1, y0, y1, x, y));
                        break;
                }
                x0 = x1;
                x1 = x;
                y0 = y1;
                y1 = y;
                t0 = t1;
            }
        });
        switch (point) {
            case 2:
                if (this._reversed) {
                    output += $path.lineTo({ x: y1, y: x1 });
                }
                else {
                    output += $path.lineTo({ x: x1, y: y1 });
                }
                break;
            case 3:
                output += this._curve(x0, x1, y0, y1, t0, slope2(x0, x1, y0, y1, t0));
                break;
        }
        if (this._closed) {
            output += $path.closePath();
        }
        return output;
    };
    return Monotone;
}());
export { Monotone };
/**
 * @ignore Exclude from docs
 * @todo Description
 */
var MonotoneX = /** @class */ (function (_super) {
    __extends(MonotoneX, _super);
    function MonotoneX(info) {
        return _super.call(this, false, info) || this;
    }
    return MonotoneX;
}(Monotone));
export { MonotoneX };
/**
 * @ignore Exclude from docs
 * @todo Description
 */
var MonotoneY = /** @class */ (function (_super) {
    __extends(MonotoneY, _super);
    function MonotoneY(info) {
        return _super.call(this, true, info) || this;
    }
    return MonotoneY;
}(Monotone));
export { MonotoneY };
/**
 * @ignore Exclude from docs
 * @todo Description
 * @type {Number}
 */
var epsilon = 1e-12;
/**
 * @ignore Exclude from docs
 * @todo Description
 */
var CatmullRom = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {object} info [description]
     */
    function CatmullRom(info) {
        this._alpha = info.alpha;
        this._closed = info.closed;
    }
    /**
     * [smooth description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {Array<IPoint>}  points  [description]
     * @return {string}                 [description]
     */
    CatmullRom.prototype.smooth = function (points) {
        var _this = this;
        var x0 = NaN;
        var x1 = NaN;
        var x2 = NaN;
        var x3 = NaN;
        var x4 = NaN;
        var x5 = NaN;
        var y0 = NaN;
        var y1 = NaN;
        var y2 = NaN;
        var y3 = NaN;
        var y4 = NaN;
        var y5 = NaN;
        var l01_a = 0;
        var l12_a = 0;
        var l23_a = 0;
        var l01_2a = 0;
        var l12_2a = 0;
        var l23_2a = 0;
        var point = 0;
        var output = "";
        var pushPoint = function (_a) {
            var x = _a.x, y = _a.y;
            if (point) {
                var x23 = x2 - x;
                var y23 = y2 - y;
                l23_a = Math.sqrt(l23_2a = Math.pow(x23 * x23 + y23 * y23, _this._alpha));
            }
            switch (point) {
                case 0:
                    point = 1;
                    if (_this._closed) {
                        x3 = x;
                        y3 = y;
                    }
                    else {
                        output += $path.lineTo({ x: x, y: y });
                    }
                    break;
                case 1:
                    point = 2;
                    if (_this._closed) {
                        x4 = x;
                        y4 = y;
                        output += $path.moveTo({ x: x4, y: y4 });
                    }
                    break;
                case 2:
                    point = 3;
                    if (_this._closed) {
                        x5 = x;
                        y5 = y;
                        break;
                    }
                    else {
                        // fall-through
                    }
                default:
                    {
                        var _x1 = x1;
                        var _y1 = y1;
                        var _x2 = x2;
                        var _y2 = y2;
                        if (l01_a > epsilon) {
                            var a = 2 * l01_2a + 3 * l01_a * l12_a + l12_2a;
                            var n = 3 * l01_a * (l01_a + l12_a);
                            _x1 = (_x1 * a - x0 * l12_2a + x2 * l01_2a) / n;
                            _y1 = (_y1 * a - y0 * l12_2a + y2 * l01_2a) / n;
                        }
                        if (l23_a > epsilon) {
                            var b = 2 * l23_2a + 3 * l23_a * l12_a + l12_2a;
                            var m = 3 * l23_a * (l23_a + l12_a);
                            _x2 = (_x2 * b + x1 * l23_2a - x * l12_2a) / m;
                            _y2 = (_y2 * b + y1 * l23_2a - y * l12_2a) / m;
                        }
                        output += $path.cubicCurveTo({ x: x2, y: y2 }, { x: _x1, y: _y1 }, { x: _x2, y: _y2 });
                    }
                    break;
            }
            l01_a = l12_a;
            l12_a = l23_a;
            l01_2a = l12_2a;
            l12_2a = l23_2a;
            x0 = x1;
            x1 = x2;
            x2 = x;
            y0 = y1;
            y1 = y2;
            y2 = y;
        };
        $array.each(points, pushPoint);
        if (this._closed) {
            switch (point) {
                case 1:
                    output += $path.moveTo({ x: x3, y: y3 });
                    output += $path.closePath();
                    break;
                case 2:
                    output += $path.lineTo({ x: x3, y: y3 });
                    output += $path.closePath();
                    break;
                case 3:
                    pushPoint({ x: x3, y: y3 });
                    pushPoint({ x: x4, y: y4 });
                    pushPoint({ x: x5, y: y5 });
                    break;
            }
        }
        else {
            switch (point) {
                case 2:
                    output += $path.lineTo({ x: x2, y: y2 });
                    break;
                case 3:
                    pushPoint({ x: x2, y: y2 });
                    break;
            }
            output += $path.closePath();
        }
        return output;
    };
    return CatmullRom;
}());
export { CatmullRom };
/**
 * @ignore Exclude from docs
 * @todo Description
 */
var Tension = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {number} tensionX [description]
     * @param {number} tensionY [description]
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
     * @param  {Array<IPoint>}  points  [description]
     * @return {string}                 [description]
     */
    Tension.prototype.smooth = function (points) {
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
        for (var i = 0; i < points.length - 1; i++) {
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
 * @ignore Exclude from docs
 * @todo Description
 */
var Basis = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {object}  info  [description]
     */
    function Basis(info) {
        this._closed = info.closed;
    }
    /**
     * [smooth description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {Array<IPoint>}  points  [description]
     * @return {string}                 [description]
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