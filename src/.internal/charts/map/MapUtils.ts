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

export function multiPolygonToGeo(multiPolygon: number[][][][]): IGeoPoint[][][] {
	let multiGeoArea: IGeoPoint[][][] = [];

	for (let i = 0, len = multiPolygon.length; i < len; i++) {

		let surface: number[][] = multiPolygon[i][0];
		let hole: number[][] = multiPolygon[i][1];

		//let holePoints: IGeoPoint[] = [];

		multiGeoArea[i] = [];

		if (surface) {
			multiGeoArea[i].push(multiPointToGeo(surface));
		}

		if (hole) {
			multiGeoArea[i].push(multiPointToGeo(hole));
		}
	}
	return multiGeoArea;
}

/**
 * Converts a multiline in X/Y coordinates to a geo-multiline in geo-points
 * (lat/long).
 *
 * @param multiLine  Source multiline
 * @return Geo-multiline
 */
export function multiLineToGeo(multiLine: number[][][]): IGeoPoint[][] {
	let multiGeoLine: IGeoPoint[][] = [];

	for (let i = 0, len = multiLine.length; i < len; i++) {
		multiGeoLine.push(multiPointToGeo(multiLine[i]));
	}
	return multiGeoLine;
}

/**
 * Converts multiple X/Y points into a lat/long geo-points.
 *
 * @param points  Source points
 * @return Geo-points
 */
export function multiPointToGeo(points: number[][]): IGeoPoint[] {
	let geoPoints: IGeoPoint[] = [];
	for (let i = 0, len = points.length; i < len; i++) {
		geoPoints.push(pointToGeo(points[i]));
	}
	return geoPoints;
}

/**
 * Converts X/Y point into a lat/long geo-point.
 *
 * @param point  Source point
 * @return Geo-point
 */
export function pointToGeo(point: number[]): IGeoPoint {
	return { longitude: point[0], latitude: point[1] }
}
