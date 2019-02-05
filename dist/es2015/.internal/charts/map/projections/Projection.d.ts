/**
 * This module contains funcitonality related to geographical projections
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IGeoPoint } from "../../../core/defs/IGeoPoint";
import { IGeoRectangle } from "../../../core/defs/IGeoRectangle";
import { IPoint } from "../../../core/defs/IPoint";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This is a base class for a geographical projection.
 */
export declare class Projection {
    deltaLongitude: number;
    deltaLatitude: number;
    deltaGama: number;
    centerPoint: IPoint;
    scale: number;
    projectGeoArea(geoArea: IGeoPoint[][][]): IPoint[][][];
    projectGeoLine(geoLine: IGeoPoint[][]): IPoint[][];
    getClipRectangle1(): IGeoPoint[];
    getClipRectangle2(): IGeoPoint[];
    getRect1(): IGeoRectangle;
    getRect2(): IGeoRectangle;
    protected clipGeoLine(geoLine: IGeoPoint[][]): IGeoPoint[][];
    protected clipGeoArea(geoArea: IGeoPoint[][][]): IGeoPoint[][][];
    protected convertGeoArea(geoArea: IGeoPoint[][][]): IPoint[][][];
    protected convertGeoLine(geoLine: IGeoPoint[][]): IPoint[][];
    /**
     * Converts a geographical point (lat/long) to a screen point (x/y)
     * @param geoPoint Geo point (lat/long)
     * @return Screen point (x/y)
     */
    convert(geoPoint: IGeoPoint): IPoint;
    /**
     * Converts a screen point (x/y) to a geographical point (lat/long)
     * @param point Screen point (x/y)
     * @return Geo point (lat/long)
     */
    invert(point: IPoint): IGeoPoint;
    /**
     * Returns X/Y coordinates.
     * Individual projections will override this method to apply their own
     * projection logic.
     * @param lambda [description]
     * @param phi    [description]
     * @return X/Y coordinates
     * @todo Needs description
     */
    project(lambda: number, phi: number): IPoint;
    /**
     * Returns geographical coordinates (lat/long).
     * Individual projections will override this method to apply their own
     * projection logic.
     * @param x X coordinate
     * @param y Y coordinate
     * @return Geographical point
     * @todo Needs description
     */
    unproject(x: number, y: number): IGeoPoint;
    rotate(geoPoint: IGeoPoint, deltaLongitude: number, deltaLatitude: number, deltaGamma?: number): IGeoPoint;
    unrotate(geoPoint: IGeoPoint, deltaLongitude: number, deltaLatitude: number, deltaGamma?: number): IGeoPoint;
    clipLine(subjectPolyline: IGeoPoint[], clipPolygon: IGeoPoint[]): IGeoPoint[][];
    clip(subjectPolygon: IGeoPoint[], clipPolygon: IGeoPoint[]): IGeoPoint[];
    getExtremes(geoPoints: IGeoPoint[]): IGeoRectangle;
    isInside(r1: IGeoRectangle, r2: IGeoRectangle): boolean;
    isOutside(r1: IGeoRectangle, r2: IGeoRectangle): boolean;
    intermediatePoint(pointA: IGeoPoint, pointB: IGeoPoint, position: number): {
        latitude: number;
        longitude: number;
    };
}
