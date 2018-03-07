/**
 * A collection of functions that deals with path calculations.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { system } from "../System";
import * as $math from "../utils/Math";
import * as $utils from "../utils/Utils";
import * as $type from "../utils/Type";
import * as $smoothing from "./Smoothing";
/**
 * ============================================================================
 * PATH FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Returns an SVG path from a number of points.
 *
 * @ignore Exclude from docs
 * @param  {IPoint[]}  points  An array of line elbow points
 * @return {string}            SVG path
 */
export function polyline(points) {
    var path = moveTo(points[0]);
    for (var i = 0; i < points.length; i++) {
        path += lineTo(points[i]);
    }
    return path;
}
/**
 * Returns a waved line SVG path between two points.
 *
 * @ignore Exclude from docs
 * @param  {IPoint}   point1            Starting point
 * @param  {IPoint}   point2            Ending point
 * @param  {number}   waveLength        Wave length
 * @param  {number}   waveHeight        Wave height
 * @param  {boolean}  adjustWaveLength  Adjust wave length based on the actual line length
 * @return {string}                     SVG path
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
    var d = system.getCache($utils.stringify(["wavedLine", point1.x, point2.x, point1.y, point2.y, waveLength, waveHeight]));
    if (!d) {
        if (distance > 0) {
            var angle = Math.atan2(y2 - y1, x2 - x1);
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var waveLengthX = waveLength * cos;
            var waveLengthY = waveLength * sin;
            if (waveLength <= 1 || waveHeight <= 1) {
                d = lineTo(point2);
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
                d = new $smoothing.Tension(tension, tension).smooth(points);
            }
        }
        else {
            d = "";
        }
        system.setCache($utils.stringify(["wavedLine", point1.x, point2.x, point1.y, point2.y, waveLength, waveHeight]), d);
    }
    return d;
}
/**
 * Returns a starting point of an SVG path.
 *
 * @ignore Exclude from docs
 * @param  {IPoint}  point  Starting point
 * @return {string}         SVG path
 */
export function moveTo(point) {
    return " M" + $math.round(point.x, 3) + "," + $math.round(point.y, 3) + " ";
}
/**
 * Returns a line part of SVG path.
 *
 * @ignore Exclude from docs
 * @param  {IPoint}  point  SVG path
 * @return {string}         SVG path
 */
export function lineTo(point) {
    return " L" + $math.round(point.x, 3) + "," + $math.round(point.y, 3) + " ";
}
/**
 * Returns a quadratic curve part of an SVG path.
 *
 * @ignore Exclude from docs
 * @param  {IPoint}  point         End point of the curve
 * @param  {IPoint}  controlPoint  Control point
 * @return {string}                SVG path
 */
export function quadraticCurveTo(point, controlPoint) {
    return " Q" + $math.round(controlPoint.x, 3)
        + "," + $math.round(controlPoint.y, 3) + " " + $math.round(point.x, 3)
        + "," + $math.round(point.y, 3);
}
/**
 * Returns a cubic curve part of an SVG path.
 *
 * @ignore Exclude from docs
 * @param  {IPoint}  point          End point of the curve
 * @param  {IPoint}  controlPointA  Control point A
 * @param  {IPoint}  controlPointB  Control point B
 * @return {string}                 SVG path
 */
export function cubicCurveTo(point, controlPointA, controlPointB) {
    return " C" + $math.round(controlPointA.x, 3)
        + "," + $math.round(controlPointA.y, 3) + " " + $math.round(controlPointB.x, 3)
        + "," + $math.round(controlPointB.y, 3) + " " + $math.round(point.x, 3)
        + "," + $math.round(point.y, 3);
}
/**
 * Returns a terminator for an SVG path.
 *
 * @ignore Exclude from docs
 * @return {string} SVG path
 */
export function closePath() {
    return " Z";
}
/**
 * Returns an arc part of an SVG path.
 *
 * @ignore Exclude from docs
 * @todo Better parameter descriptions
 * @param  {number}  startAngle  Starting angle
 * @param  {number}  arc         Arc
 * @param  {number}  radius      Radius
 * @param  {number}  radiusY     Vertical radius
 * @return {string}              SVG path
 */
export function arcTo(startAngle, arc, radius, radiusY) {
    if (arc == 0) {
        return "";
    }
    if (!$type.isNumber(radiusY)) {
        radiusY = radius;
    }
    var path = "";
    var c = ",";
    var segments = Math.ceil(Math.abs(arc) / 180);
    var l = 1;
    if (arc < 0) {
        l = 0;
    }
    // center
    var cx = -$math.cos(startAngle) * radius;
    var cy = -$math.sin(startAngle) * radiusY;
    // previous, as we use a not A
    var pax = 0;
    var pay = 0;
    for (var i = 0; i < segments; i++) {
        var endAngle = startAngle + arc / segments * (i + 1);
        var ax = $math.round($math.cos(endAngle) * radius + cx - pax, 3);
        var ay = $math.round($math.sin(endAngle) * radiusY + cy - pay, 3);
        path += " a" + radius + c + radiusY + c + 0 + c + 0 + c + l + c + ax + c + ay;
        pax = ax;
        pay = ay;
    }
    return path;
}
/**
 * Creates an arc path.
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {number}  startAngle         [description]
 * @param  {number}  arc                [description]
 * @param  {number}  radius             [description]
 * @param  {number}  innerRadius        [description]
 * @param  {number}  radiusY            [description]
 * @param  {number}  cornerRadius       [description]
 * @param  {number}  innerCornerRadius  [description]
 * @return {string}                     SVG path
 */
export function arc(startAngle, arc, radius, innerRadius, radiusY, cornerRadius, innerCornerRadius) {
    if (arc == 0 || radius <= 0) {
        return "";
    }
    arc = $math.min(arc, 360);
    var endAngle = startAngle + arc;
    var crSin = $math.sin($math.min(arc, 45) / 2);
    innerRadius = innerRadius || 0;
    radiusY = $type.isNumber(radiusY) ? radiusY : radius;
    cornerRadius = cornerRadius || 0;
    innerCornerRadius = $type.isNumber(innerCornerRadius) ? innerCornerRadius : cornerRadius;
    var innerRadiusY = (radiusY / radius) * innerRadius;
    var cornerRadiusY = (radiusY / radius) * cornerRadius;
    var innerCornerRadiusY = (radiusY / radius) * innerCornerRadius;
    cornerRadius = $math.fitToRange(cornerRadius, 0, (radius - innerRadius) / 2);
    cornerRadiusY = $math.fitToRange(cornerRadiusY, 0, (radiusY - innerRadiusY) / 2);
    innerCornerRadius = $math.fitToRange(innerCornerRadius, 0, (radius - innerRadius) / 2);
    innerCornerRadiusY = $math.fitToRange(innerCornerRadiusY, 0, (radiusY - innerRadiusY) / 2);
    cornerRadius = $math.round($math.fitToRange(cornerRadius, 0, radius * crSin), 3);
    cornerRadiusY = $math.round($math.fitToRange(cornerRadiusY, 0, radiusY * crSin), 3);
    innerCornerRadius = $math.round($math.fitToRange(innerCornerRadius, 0, innerRadius * crSin), 3);
    innerCornerRadiusY = $math.round($math.fitToRange(innerCornerRadiusY, 0, innerRadiusY * crSin), 3);
    var crAngle = Math.asin(cornerRadius / radius / 2) * $math.DEGREES * 2;
    var crAngleY = Math.asin(cornerRadiusY / radiusY / 2) * $math.DEGREES * 2;
    if (innerRadius < innerCornerRadius) {
        innerRadius = innerCornerRadius;
    }
    if (innerRadiusY < innerCornerRadiusY) {
        innerRadiusY = innerCornerRadiusY;
    }
    var crInnerAngle = Math.asin(innerCornerRadius / innerRadius / 2) * $math.DEGREES * 2;
    var crInnerAngleY = Math.asin(innerCornerRadiusY / innerRadiusY / 2) * $math.DEGREES * 2;
    if (!$type.isNumber(crInnerAngle)) {
        crInnerAngle = 0;
    }
    if (!$type.isNumber(crInnerAngleY)) {
        crInnerAngleY = 0;
    }
    var middleAngle = startAngle + arc / 2;
    var mPoint = { x: $math.round($math.cos(middleAngle) * innerRadius, 3), y: $math.sin(middleAngle) * innerRadiusY };
    var a0 = { x: $math.cos(startAngle) * (innerRadius + innerCornerRadius), y: $math.sin(startAngle) * (innerRadiusY + innerCornerRadiusY) };
    var b0 = { x: $math.cos(startAngle) * (radius - cornerRadius), y: $math.sin(startAngle) * (radiusY - cornerRadiusY) };
    var c0 = { x: $math.cos(endAngle) * (radius - cornerRadius), y: $math.sin(endAngle) * (radiusY - cornerRadiusY) };
    var d0 = { x: $math.cos(endAngle) * (innerRadius + innerCornerRadius), y: $math.sin(endAngle) * (innerRadiusY + innerCornerRadiusY) };
    var b1 = { x: $math.cos(startAngle + crAngle) * radius, y: $math.sin(startAngle + crAngleY) * radiusY };
    var d1 = { x: $math.cos(endAngle - crInnerAngle) * innerRadius, y: $math.sin(endAngle - crInnerAngleY) * innerRadiusY };
    // some magic math
    innerCornerRadius += innerCornerRadius * $math.sin(crInnerAngle / 2);
    innerCornerRadiusY += innerCornerRadiusY * $math.sin(crInnerAngleY / 2);
    if (crInnerAngle > (endAngle - startAngle) / 2) {
        d1 = mPoint;
    }
    var path = "";
    // start from b if this is full circle
    if (arc == 360 && cornerRadius == 0) {
        path = moveTo(b0);
    }
    else {
        path = moveTo(a0);
        path += lineTo(b0);
        path += arcToPoint(b1, cornerRadius, cornerRadiusY, true);
    }
    // draw arc
    path += arcTo(startAngle + crAngle, arc - 2 * crAngle, radius, radiusY);
    // draw inner arc
    if ($type.isNumber(innerRadius) && innerRadius != 0) {
        // move to B if this is full circle
        if (arc == 360 && cornerRadius == 0) {
            path += moveTo(d0);
        }
        else {
            path += arcToPoint(c0, cornerRadius, cornerRadiusY, true);
            path += lineTo(d0);
            path += arcToPoint(d1, innerCornerRadius, innerCornerRadiusY, true);
        }
        path += arcTo(endAngle - crInnerAngle, -(arc - 2 * crInnerAngle), innerRadius, innerRadiusY);
        if (arc < 360 || cornerRadius > 0) {
            path += arcToPoint(a0, innerCornerRadius, innerCornerRadiusY, true);
        }
    }
    else {
        path += arcToPoint(c0, cornerRadius, cornerRadiusY, true);
        path += lineTo(a0);
    }
    return path;
}
/**
 * Creates a path for an arc to specific coordinate.
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {IPoint}  point         Reference point
 * @param  {number}  radius        Radius
 * @param  {number}  radiusY       Vertical radius (for skewed arcs)
 * @param  {boolean} sweepFlag     [description]
 * @param  {boolean} largeArcFlag  [description]
 * @param  {number}  xAxisRotation [description]
 * @return {string}                Arc path
 */
export function arcToPoint(point, radius, radiusY, sweepFlag, largeArcFlag, xAxisRotation) {
    if (radius == 0) {
        return "";
    }
    xAxisRotation = xAxisRotation || 0;
    largeArcFlag = Boolean(largeArcFlag);
    sweepFlag = Boolean(sweepFlag);
    var c = ",";
    var sweepFlagValue = +sweepFlag; // converts to 1 or 0
    var largeArcFlagValue = +largeArcFlag; // converts to 1 or 0
    return " A" + radius + c + radiusY + c + xAxisRotation + c + largeArcFlagValue + c + sweepFlagValue + c + $math.round(point.x, 4) + c + $math.round(point.y, 3);
}
/**
 * Creates a new rectangle.
 *
 * @ignore Exclude from docs
 * @param  {number}  width   Width (px)
 * @param  {number}  height  Height (px)
 * @param  {number}  x       X position
 * @param  {number}  y       Y position
 * @return {string}          Rectangle
 */
export function rectangle(width, height, x, y) {
    if (!$type.isNumber(x)) {
        x = 0;
    }
    if (!$type.isNumber(y)) {
        y = 0;
    }
    return moveTo({ x: x, y: y }) + lineTo({ x: x + width, y: y }) + lineTo({ x: x + width, y: y + height }) + lineTo({ x: x, y: y + height }) + closePath();
}
/**
 * Converts a rectangle to an SVG path.
 *
 * @ignore Exclude from docs
 * @param  {IRectangle}  rect  Rectangle
 * @param  {boolean}     ccw   Counter-clockwise?
 * @return {string}            SVG path
 */
export function rectToPath(rect, ccw) {
    var c = ",";
    var L = " L";
    if (ccw) {
        return "M" + rect.x
            + c + rect.y + L + rect.x
            + c + (rect.y + rect.height) + L + (rect.x + rect.width)
            + c + (rect.y + rect.height) + L + (rect.x + rect.width)
            + c + rect.y + L + rect.x
            + c + rect.y;
    }
    else {
        return "M" + rect.x
            + c + rect.y + L + (rect.x + rect.width)
            + c + rect.y + L + (rect.x + rect.width)
            + c + (rect.y + rect.height) + L + rect.x
            + c + (rect.y + rect.height) + L + rect.x
            + c + rect.y;
    }
}
//# sourceMappingURL=Path.js.map