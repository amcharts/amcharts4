/**
 * A collection of Map-related utility functions.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IGeoPoint } from "../../core/defs/IGeoPoint";
/**
 * Converts a multi-part polygon in X/Y coordinates to a geo-multipolygon in
 * geo-points (lat/long).
 *
 * @param  {number[][][][]}  multiPolygon  Source multi-polygon
 * @return {IGeoPoint[]}                   Geo-multipolygon
 */
export declare function multiPolygonToGeo(multiPolygon: number[][][][]): IGeoPoint[][][];
/**
 * Converts a multiline in X/Y coordinates to a geo-multiline in geo-points
 * (lat/long).
 *
 * @param  {number[][][]}  multiLine  Source multiline
 * @return {IGeoPoint[]}              Geo-multiline
 */
export declare function multiLineToGeo(multiLine: number[][][]): IGeoPoint[][];
/**
 * Converts multiple X/Y points into a lat/long geo-points.
 *
 * @param  {number[][]}   points  Source points
 * @return {IGeoPoint[]}          Geo-points
 */
export declare function multiPointToGeo(points: number[][]): IGeoPoint[];
/**
 * Converts X/Y point into a lat/long geo-point.
 *
 * @param  {number[]}   point  Source point
 * @return {IGeoPoint}         Geo-point
 */
export declare function pointToGeo(point: number[]): IGeoPoint;
