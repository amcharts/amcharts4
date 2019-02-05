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
 * @param multiPolygon  Source multi-polygon
 * @return Geo-multipolygon
 */
export declare function multiPolygonToGeo(multiPolygon: number[][][][]): IGeoPoint[][][];
/**
 * Converts a multiline in X/Y coordinates to a geo-multiline in geo-points
 * (lat/long).
 *
 * @param multiLine  Source multiline
 * @return Geo-multiline
 */
export declare function multiLineToGeo(multiLine: number[][][]): IGeoPoint[][];
/**
 * Converts multiple X/Y points into a lat/long geo-points.
 *
 * @param points  Source points
 * @return Geo-points
 */
export declare function multiPointToGeo(points: number[][]): IGeoPoint[];
/**
 * Converts X/Y point into a lat/long geo-point.
 *
 * @param point  Source point
 * @return Geo-point
 */
export declare function pointToGeo(point: number[]): IGeoPoint;
