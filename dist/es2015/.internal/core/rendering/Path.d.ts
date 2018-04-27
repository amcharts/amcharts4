/**
 * A collection of functions that deals with path calculations.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IPoint } from "../defs/IPoint";
import { IRectangle } from "../defs/IRectangle";
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
export declare function polyline(points: IPoint[]): string;
/**
 * Returns a starting point of an SVG path.
 *
 * @ignore Exclude from docs
 * @param  {IPoint}  point  Starting point
 * @return {string}         SVG path
 */
export declare function moveTo(point: IPoint): string;
/**
 * Returns a line part of SVG path.
 *
 * @ignore Exclude from docs
 * @param  {IPoint}  point  SVG path
 * @return {string}         SVG path
 */
export declare function lineTo(point: IPoint): string;
/**
 * Returns a quadratic curve part of an SVG path.
 *
 * @ignore Exclude from docs
 * @param  {IPoint}  point         End point of the curve
 * @param  {IPoint}  controlPoint  Control point
 * @return {string}                SVG path
 */
export declare function quadraticCurveTo(point: IPoint, controlPoint: IPoint): string;
/**
 * Returns a cubic curve part of an SVG path.
 *
 * @ignore Exclude from docs
 * @param  {IPoint}  point          End point of the curve
 * @param  {IPoint}  controlPointA  Control point A
 * @param  {IPoint}  controlPointB  Control point B
 * @return {string}                 SVG path
 */
export declare function cubicCurveTo(point: IPoint, controlPointA: IPoint, controlPointB: IPoint): string;
/**
 * Returns a terminator for an SVG path.
 *
 * @ignore Exclude from docs
 * @return {string} SVG path
 */
export declare function closePath(): string;
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
export declare function arcTo(startAngle: number, arc: number, radius: number, radiusY?: number): string;
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
export declare function arc(startAngle: number, arc: number, radius: number, innerRadius?: number, radiusY?: number, cornerRadius?: number, innerCornerRadius?: number): string;
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
export declare function arcToPoint(point: IPoint, radius: number, radiusY?: number, sweepFlag?: boolean, largeArcFlag?: boolean, xAxisRotation?: number): string;
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
export declare function rectangle(width: number, height: number, x?: number, y?: number): string;
/**
 * Converts a rectangle to an SVG path.
 *
 * @ignore Exclude from docs
 * @param  {IRectangle}  rect  Rectangle
 * @param  {boolean}     ccw   Counter-clockwise?
 * @return {string}            SVG path
 */
export declare function rectToPath(rect: IRectangle, ccw?: boolean): string;
