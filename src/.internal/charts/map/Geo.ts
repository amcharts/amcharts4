/**
 * A collection of GeoJSON format-related utility functions.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IGeoPoint } from "../../core/defs/IGeoPoint";
import { IPoint } from "../../core/defs/IPoint";
import * as $math from "../../core/utils/Math";


/**
 * Normalizes a geo-point.
 *
 * @ignore Exclude from docs
 * @param  {IGeoPoint}  geoPoint  Source geo-point
 * @return {IGeoPoint}            Normalized geo-point
 */
export function normalizePoint(geoPoint: IGeoPoint): IGeoPoint {
	let longitude = wrapAngleTo180(geoPoint.longitude);
	let latitude = Math.asin(Math.sin((geoPoint.latitude * $math.RADIANS))) * $math.DEGREES;

	let latitude180 = wrapAngleTo180(geoPoint.latitude);

	if (Math.abs(latitude180) > 90) {
		longitude = wrapAngleTo180(longitude + 180);
	}

	geoPoint.longitude = longitude;
	geoPoint.latitude = latitude;

	return geoPoint;
}

/**
 * Normalizes all points of a geo-line.
 *
 * @ignore Exclude from docs
 * @param  {IGeoPoint[][]}  multiline  Source geo-line
 * @return {IGeoPoint[]}               Normalized geo-line
 */
export function normalizeMultiline(multiline: IGeoPoint[][]): IGeoPoint[][] {
	for (let segment of multiline) {
		for (let point of segment) {
			point = normalizePoint(point);
		}
	}
	return multiline;
}

/**
 * [wrapAngleTo180 description]
 *
 * @todo Description
 * @ignore Exclude from docs
 * @param  {number}  angle  Angle
 * @return {number}         Angle
 */
export function wrapAngleTo180(angle: number): number {
	angle = angle % 360;

	if (angle > 180) {
		angle -= 360;
	}
	if (angle < -180) {
		angle += 360;
	}

	return angle;
}

/**
 * Converts a geo point to a regular point object.
 *
 * @ignore Exclude from docs
 * @param  {IGeoPoint}  geoPoint  Source geo point
 * @return {IPoint}               Point
 */
export function geoToPoint(geoPoint: IGeoPoint): IPoint {
	return { x: geoPoint.longitude, y: geoPoint.latitude };
}