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
import * as $array from "../../core/utils/Array";
import * as d3geo from "d3-geo";

/**
 * Converts a multi-part polygon in X/Y coordinates to a geo-multipolygon in
 * geo-points (lat/long).
 *
 * @param multiPolygon  Source multi-polygon
 * @return Geo-multipolygon
 */

export function multiPolygonToGeo(multiPolygon: Array<[Array<[number, number]>, Array<[number, number]>]>): Array<Array<Array<IGeoPoint>>> {
	return $array.map(multiPolygon, (polygon) => {
		let surface: Array<[number, number]> = polygon[0];
		let hole: Array<[number, number]> = polygon[1];

		//let holePoints: Array<IGeoPoint> = [];

		const geoArea = [];

		if (surface) {
			geoArea.push(multiPointToGeo(surface));
		}

		if (hole) {
			geoArea.push(multiPointToGeo(hole));
		}

		return geoArea;
	});
}

/**
 * Converts a multiline in X/Y coordinates to a geo-multiline in geo-points
 * (lat/long).
 *
 * @param multiLine  Source multiline
 * @return Geo-multiline
 */
export function multiLineToGeo(multiLine: Array<Array<[number, number]>>): Array<Array<IGeoPoint>> {
	return $array.map(multiLine, (multiLine) => {
		return multiPointToGeo(multiLine);
	});
}

/**
 * Converts multiple X/Y points into a lat/long geo-points.
 *
 * @param points  Source points
 * @return Geo-points
 */
export function multiPointToGeo(points: Array<[number, number]>): Array<IGeoPoint> {
	return $array.map(points, (point) => {
		return pointToGeo(point);
	});
}


/**
 * Converts multiple X/Y points into a lat/long geo-points.
 *
 * @param points  Source points
 * @return Geo-points
 */
export function multiGeoToPoint(geoPoints: Array<IGeoPoint>): Array<[number, number]> {
	return $array.map(geoPoints, geoToPoint);
}


/**
 * Converts X/Y point into a lat/long geo-point.
 *
 * @param point  Source point
 * @return Geo-point
 */
export function pointToGeo(point: [number, number]): IGeoPoint {
	return { longitude: point[0], latitude: point[1] }
}

/**
 * Converts lat/long geo-point into a X/Y point.
 *
 * @param point  Source geo-point
 * @return X/Y point
 */
export function geoToPoint(geoPoint: IGeoPoint): [number, number] {
	return [geoPoint.longitude, geoPoint.latitude];
}


/**
 * Converts geo line (collection of lat/long coordinates) to screen line (x/y).
 *
 * @param   multiGeoLine  Source geo line
 * @return                Screen line
 */
export function multiGeoLineToMultiLine(multiGeoLine: Array<Array<IGeoPoint>>): Array<Array<[number, number]>> {
	return $array.map(multiGeoLine, (segment) => {
		return $array.map(segment, geoToPoint);
	});
}

/**
 * Converts a geo polygon (collection of lat/long coordinates) to screen
 * polygon (x/y).
 *
 * @param   multiGeoPolygon  Source polygon
 * @return                   Screen polygon
 */
export function multiGeoPolygonToMultipolygon(multiGeoPolygon: Array<[Array<IGeoPoint>, Array<IGeoPoint>]>): Array<Array<Array<[number, number]>>> {
	return $array.map(multiGeoPolygon, (geoPolygon) => {
		let surface = geoPolygon[0];
		let hole = geoPolygon[1];

		const multiPolygon = [];

		if (surface) {
			multiPolygon.push(multiGeoToPoint(surface));
		}

		if (hole) {
			multiPolygon.push(multiGeoToPoint(hole));
		}

		return multiPolygon;
	});
}

/**
 * Returns a set of geographical coordinates for the circle with a center
 * at specific lat/long coordinates and radius (in degrees).
 *
 * @since 4.3.0
 * @param   longitude  Center longitude
 * @param   latitude   Center latitude
 * @param   radius     Radius (degrees)
 * @return             Circle coordinates
 */
export function getCircle(longitude: number, latitude: number, radius: number): Array<Array<Array<[number, number]>>> {
	return [d3geo.geoCircle().center([longitude, latitude]).radius(radius)().coordinates as Array<Array<[number, number]>>];
}

/**
 * Returns a set of screen coordinates that represents a "background" area
 * between provided extremities.
 *
 * @since 4.3.0
 * @param   north  North latitude
 * @param   east   East longitude
 * @param   south  South latitude
 * @param   west   West longitude
 * @return         Polygon
 */
export function getBackground(north: number, east: number, south: number, west: number): Array<Array<Array<[number, number]>>> {

	let multiPolygon: Array<Array<Array<[number, number]>>> = [];

	if(west == -180){
		west = -179.9999;
	}
	if(south == -90){
		south = -89.9999;
	}
	if(north == 90){
		north = 89.9999;
	}
	if(east == 180){
		east = 179.9999;
	}


	let stepLong = Math.min(90, (east - west) / Math.ceil((east - west) / 90));
	let stepLat = (north - south) / Math.ceil((north - south) / 90);

	for (let ln = west; ln < east; ln = ln + stepLong) {
		let surface: Array<[number, number]> = [];
		multiPolygon.push([surface]);

		if(ln + stepLong > east){
			stepLong = east - ln;
		}

		for (let ll = ln; ll <= ln + stepLong; ll = ll + 5) {
			surface.push([ll, north]);
		}

		for (let lt = north; lt >= south; lt = lt - stepLat) {
			surface.push([ln + stepLong, lt]);
		}

		for (let ll = ln + stepLong; ll >= ln; ll = ll - 5) {
			surface.push([ll, south]);
		}

		for (let lt = south; lt <= north; lt = lt + stepLat) {
			surface.push([ln, lt]);
		}


	}

	return multiPolygon;
}
