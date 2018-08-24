/**
 * A collection of Math-related functions
 *
 * @todo Comment trigonometric functions?
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IPoint } from "../defs/IPoint";
import { IRectangle } from "../defs/IRectangle";
import { IRange } from "../defs/IRange";
import * as $type from "./Type";
/**
 * ============================================================================
 * CONSTANTS
 * ============================================================================
 * @hidden
 */
export declare const PI: number;
export declare const HALFPI: number;
export declare const RADIANS: number;
export declare const DEGREES: number;
/**
 * Converts any value and fits it into a specific value range.
 *
 * @param  {any}     value  Source value
 * @param  {number}  min    Minimum allowable value
 * @param  {number}  max    Maximum allowable value
 * @return {number}         Number
 */
export declare function toNumberRange(value: any, min: number, max: number): number;
/**
 * Rounds the numeric value to whole number or specific precision of set.
 *
 * @param  {number} value      Value
 * @param  {number} precision  Precision (number of decimal points)
 * @return {number}            Rounded value
 */
export declare function round(value: number, precision?: number): number;
/**
 * Ceils the numeric value to whole number or specific precision of set.
 *
 * @param  {number} value      Value
 * @param  {number} precision  Precision (number of decimal points)
 * @return {number}            Rounded value
 */
export declare function ceil(value: number, precision?: number): number;
/**
 * Stretches `t` so that it will always be between `from` and `to`.
 *
 * @param  {number} t     Number from 0 to 1
 * @param  {number} from  Lowest possible value
 * @param  {number} to    Highest possible value
 * @return {number}       Adjusted value
 */
export declare function stretch(t: number, from: number, to: number): number;
/**
 * Adjust numeric value so it fits to specific value range.
 *
 * @param  {number} value     Value
 * @param  {Optional<number>} minValue  Lowest possible value
 * @param  {Optional<number>} maxValue  Highest possible value
 * @return {number}                     Adjusted value
 */
export declare function fitToRange(value: number, minValue: $type.Optional<number>, maxValue: $type.Optional<number>): number;
/**
 * Returns sine of a number.
 *
 * @param  {number} value  Value
 * @return {number}        Sine
 */
export declare function sin(value: number): number;
/**
 * Returns tan of a number.
 *
 * @param  {number} value  Value
 * @return {number}        Sine
 */
export declare function tan(value: number): number;
/**
 * Returns cosine of a number.
 *
 * @param  {number} value  Value
 * @return {number}        Cosine
 */
export declare function cos(value: number): number;
/**
 * Returns biggest value out of passed in numeric values.
 *
 * @param  {number}  left   Numeric value
 * @param  {number}  right  Numeric value
 * @return {number}         Biggest value
 */
export declare function max(left: number, right: number): number;
export declare function max(left: number, right: $type.Optional<number>): number;
export declare function max(left: $type.Optional<number>, right: number): number;
export declare function max(left: $type.Optional<number>, right: $type.Optional<number>): $type.Optional<number>;
/**
 * Returns smallest value out of passed in numeric values.
 *
 * @param  {number}  left   Numeric value
 * @param  {number}  right  Numeric value
 * @return {number}         Smallest value
 */
export declare function min(left: number, right: number): number;
export declare function min(left: number, right: $type.Optional<number>): number;
export declare function min(left: $type.Optional<number>, right: number): number;
export declare function min(left: $type.Optional<number>, right: $type.Optional<number>): $type.Optional<number>;
/**
 * Returns the closest value from the array of values to the reference value.
 *
 * @param  {number[]}  values  Array of values
 * @param  {number}    value   Reference value
 * @return {number}            Closes value from the array
 */
export declare function closest(values: number[], referenceValue: number): number;
/**
 * Checks whether two ranges of values intersect.
 *
 * @param {IRange}    range1  Range 1
 * @param {IRange}    range2  Range 2
 * @return {boolean}          Any intersecting numbers?
 */
export declare function intersect(range1: IRange, range2: IRange): boolean;
/**
 * Inverts the range of values.
 *
 * @param {IRange}  range  Range
 */
export declare function invertRange(range: IRange): {
    start: number;
    end: number;
};
/**
 * Returns an intersection range between two ranges of values.
 *
 * @param  {IRange}  range1  Range 1
 * @param  {IRange}  range2  Range 2
 * @return {IRange}          Intersecting value range
 */
export declare function intersection(range1: IRange, range2: IRange): $type.Optional<IRange>;
/**
 * Returns pixel "distance" between two points.
 *
 * If second point is not specified, distance from {x:0, y:0} point is
 * calculated.
 *
 * @param  {IPoint}  point1  Point 1
 * @param  {IPoint}  point2  Point 2
 * @return {number}          Distance in relative pixels
 */
export declare function getDistance(point1: IPoint, point2?: IPoint): number;
/**
 * Returns scale based on original and end position of the two points.
 *
 * @param  {IPoint}  point1       Current position of point 1
 * @param  {IPoint}  startPoint1  Start position of point 1
 * @param  {IPoint}  point2       Current position of point 1
 * @param  {IPoint}  startPoint2  Start position of point 2
 * @return {number}  Scale        Calculated scale
 */
export declare function getScale(point1: IPoint, startPoint1: IPoint, point2: IPoint, startPoint2: IPoint): number;
/**
 * Returns an exact mid point between two points.
 *
 * @param  {IPoint}  point1     Position of point 1
 * @param  {IPoint}  point2     Position of point 2
 * @return {IPoint}  Mid point  Position of mid-point
 */
export declare function getMidPoint(point1: IPoint, point2: IPoint, position?: number): IPoint;
/**
 * Returns difference in angles between starting and ending position of two
 * vectors.
 *
 * @param  {IPoint}  point1       Current position of point 1
 * @param  {IPoint}  startPoint1  Start position of point 1
 * @param  {IPoint}  point2       Current position of point 1
 * @param  {IPoint}  startPoint2  Start position of point 2
 * @return {number}               Angle difference in degrees
 */
export declare function getRotation(point1: IPoint, startPoint1: IPoint, point2: IPoint, startPoint2: IPoint): number;
/**
 * Calculates angle of the vector based on two or one point.
 *
 * @param  {IPoint}  point1  Point 1
 * @param  {IPoint}  point2  Point 2
 * @return {number}          Angle in degrees
 */
export declare function getAngle(point1: IPoint, point2?: IPoint): number;
/**
 * Returns the shift in coordinates of the center when item is rotated, moved
 * and scaled at the same time.
 *
 * @param  {IPoint}  center       Current center
 * @param  {IPoint}  point1       Frst reference point
 * @param  {IPoint}  startPoint1  Original position of the first reference point
 * @param  {IPoint}  point2       Second reference point
 * @param  {IPoint}  startPoint2  Original position of the first reference point
 * @return {IPoint}               Shift in center point coordinates
 */
export declare function getCenterShift(center: IPoint, point1: IPoint, startPoint1: IPoint, point2: IPoint, startPoint2: IPoint): IPoint;
/**
 * Converts an array of points into a bounding box rectangle.
 *
 * Array can contain any number of points.
 *
 * @param  {IPoint[]}              points  Points
 * @return {Optional<IRectangle>}          Bounding box rectangle
 */
export declare function getBBox(points: IPoint[]): $type.Optional<IRectangle>;
/**
 * Returns a [[IRectangle]] object representing a common rectangle that fits
 * all passed in rectangles in it.
 *
 * @param {IRectangle[]}           rectangles  An array of rectangles
 * @return {Optional<IRectangle>}              Common rectangle
 */
export declare function getCommonRectangle(rectangles: IRectangle[]): $type.Optional<IRectangle>;
/**
 * [getPointOnQuadraticCurve description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {IPoint}  pointA        [description]
 * @param  {IPoint}  pointB        [description]
 * @param  {IPoint}  controlPoint  [description]
 * @param  {number}  position      [description]
 * @return {IPoint}                [description]
 */
export declare function getPointOnQuadraticCurve(pointA: IPoint, pointB: IPoint, controlPoint: IPoint, position: number): IPoint;
/**
 * [getPointOnCubicCurve description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {IPoint}  pointA         [description]
 * @param  {IPoint}  pointB         [description]
 * @param  {IPoint}  controlPointA  [description]
 * @param  {IPoint}  controlPointB  [description]
 * @param  {number}  position       [description]
 * @return {IPoint}                 [description]
 */
export declare function getPointOnCubicCurve(pointA: IPoint, pointB: IPoint, controlPointA: IPoint, controlPointB: IPoint, position: number): IPoint;
/**
 * [getCubicControlPointA description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {IPoint}  p0        [description]
 * @param  {IPoint}  p1        [description]
 * @param  {IPoint}  p2        [description]
 * @param  {IPoint}  p3        [description]
 * @param  {number}  tensionX  [description]
 * @param  {number}  tensionY  [description]
 * @return {IPoint}            [description]
 */
export declare function getCubicControlPointA(p0: IPoint, p1: IPoint, p2: IPoint, p3: IPoint, tensionX: number, tensionY: number): IPoint;
/**
 * [getCubicControlPointB description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {IPoint}  p0        [description]
 * @param  {IPoint}  p1        [description]
 * @param  {IPoint}  p2        [description]
 * @param  {IPoint}  p3        [description]
 * @param  {number}  tensionX  [description]
 * @param  {number}  tensionY  [description]
 * @return {IPoint}            [description]
 */
export declare function getCubicControlPointB(p0: IPoint, p1: IPoint, p2: IPoint, p3: IPoint, tensionX: number, tensionY: number): IPoint;
/**
 * [adjustTension description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {number}  tension  [description]
 * @return {number}           [description]
 */
export declare function adjustTension(tension: number): number;
/**
 * [normalizeAngle description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {number}  value  [description]
 * @return {number}         [description]
 */
export declare function normalizeAngle(value: number): number;
/**
 * [normalizeAngleToRange description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @todo review this with various angles, can be tested on radar chart with custom start/end angles
 * @param {number}   value       [description]
 * @param {number}   startAngle  [description]
 * @param {number}   endAngle    [description]
 * @return {number}              [description]
 */
export declare function fitAngleToRange(value: number, startAngle: number, endAngle: number): number;
/**
 * Returns [[IRectangle]] of an arc in relative values, assuming that the
 * center is at the circle center.
 *
 * Used to find out max radius of an arc.
 *
 * @ignore Exclude from docs
 * @param  {number}      startAngle  Start angle
 * @param  {number}      endAngle    End angle
 * @param  {number}      radius    	 Relative radius
 * @return {IRectangle}              Rectangle
 */
export declare function getArcRect(startAngle: number, endAngle: number, radius?: number): IRectangle;
/**
 * Returns true if a point is within rectangle
 *
 * @param  {IPoint}      point
 * @param  {IRectangle}  rectangle
 * @return {boolean}
 */
export declare function isInRectangle(point: IPoint, rectangle: IRectangle): boolean;
export declare function getLineIntersection(pointA1: IPoint, pointA2: IPoint, pointB1: IPoint, pointB2: IPoint): {
    x: number;
    y: number;
};
