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
//import { IGeoRectangle } from "../../../core/defs/IGeoRectangle";
import { IPoint, IOrientationPoint } from "../../../core/defs/IPoint";
import { registry } from "../../../core/Registry";
import * as $math from "../../../core/utils/Math";
import * as d3geo from "d3-geo";
import { MapChart } from "../../types/MapChart";


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This is a base class for a geographical projection.
 */
export class Projection {

	/**
	 * @ignore
	 */
	protected _d3Projection: d3geo.GeoProjection;

	/**
	 * @ignore
	 */
	protected _d3Path: d3geo.GeoPath;

	/**
	 * @ignore
	 */
	public chart: MapChart;


	constructor() {
		this.d3Projection = d3geo.geoEquirectangular();
	}


	/**
	 * d3 projection
	 */
	public set d3Projection(projection: d3geo.GeoProjection) {
		this._d3Projection = projection;
		projection.precision(0.1);
		this._d3Path = d3geo.geoPath().projection(projection);

		if (this.chart) {
			this.chart.invalidateProjection();
		}
	}

	/**
	 * d3 projection
	 */
	public get d3Projection(): d3geo.GeoProjection {
		return this._d3Projection;
	}

	/**
	 * d3 path generator method
	 * @ignore
	 */
	public get d3Path(): d3geo.GeoPath {
		return this._d3Path;
	}

	/**
	 * @ignore
	 */
	public get scale(): number {
		return this.d3Projection.scale() / 100;
	}

	/**
	 * Converts a geographical point (lat/long) to a screen point (x/y)
	 * @param geoPoint Geo point (lat/long)
	 * @return Screen point (x/y)
	 */
	public convert(geoPoint: IGeoPoint): IPoint {
		/*
		geoPoint = $geo.normalizePoint(geoPoint);
		geoPoint = this.rotate(geoPoint, this.deltaLongitude, this.deltaLatitude, this.deltaGama);
		let pointInRadians: IPoint = this.project(geoPoint.longitude * $math.RADIANS, geoPoint.latitude * $math.RADIANS);
		return {
			x: $math.round(pointInRadians.x * $math.DEGREES - this.centerPoint.x, 4) * this.scale,
			y: $math.round(-pointInRadians.y * $math.DEGREES - this.centerPoint.y, 4) * this.scale
		};*/

		let p = this.d3Projection([geoPoint.longitude, geoPoint.latitude]);
		if (p) {
			return { x: p[0], y: p[1] };
		}
	}

	/**
	 * Converts a screen point (x/y) to a geographical point (lat/long)
	 * @param point Screen point (x/y)
	 * @return Geo point (lat/long)
	 */
	public invert(point: IPoint): IGeoPoint {
		/*
		let pointInRadians: IGeoPoint = this.unproject((point.x / this.scale + this.centerPoint.x) * $math.RADIANS, (-point.y / this.scale - this.centerPoint.y) * $math.RADIANS);

		let geoPoint = { longitude: pointInRadians.longitude * $math.DEGREES, latitude: pointInRadians.latitude * $math.DEGREES };

		geoPoint = this.unrotate(geoPoint, this.deltaLongitude, this.deltaLatitude, this.deltaGama);
		*/
		let p = this.d3Projection.invert([point.x, point.y]);
		if (p) {
			return { longitude: p[0], latitude: p[1] };
		}
	}

	/**
	 * Returns X/Y coordinates.
	 * Individual projections will override this method to apply their own
	 * projection logic.
	 * @deprecated
	 * @param lambda [description]
	 * @param phi    [description]
	 * @return X/Y coordinates
	 * @todo Needs description
	 */
	public project(lambda: number, phi: number): IPoint {
		return this.convert({ longitude: lambda * $math.DEGREES, latitude: phi * $math.DEGREES });
	}

	/**
	 * Returns geographical coordinates (lat/long).
	 * Individual projections will override this method to apply their own
	 * projection logic.
	 * @deprecated
	 * @param x X coordinate
	 * @param y Y coordinate
	 * @return Geographical point
	 * @todo Needs description
	 */
	public unproject(x: number, y: number): IGeoPoint {
		return this.invert({ x: x, y: y });
	}


	/**
	 * @ignore
	 * @deprecated
	 */
	public rotate(geoPoint: IGeoPoint, deltaLongitude: number, deltaLatitude: number, deltaGamma?: number): IGeoPoint {

		let deltaLambda = deltaLongitude * $math.RADIANS;
		let deltaPhi = deltaLatitude * $math.RADIANS;
		deltaGamma = deltaGamma * $math.RADIANS;

		let lambda = geoPoint.longitude * $math.RADIANS + deltaLambda;
		let phi = geoPoint.latitude * $math.RADIANS;

		let cosDeltaPhi = Math.cos(deltaPhi);
		let sinDeltaPhi = Math.sin(deltaPhi);
		let cosDeltaGamma = Math.cos(deltaGamma);
		let sinDeltaGamma = Math.sin(deltaGamma);

		let cosPhi = Math.cos(phi);

		let x = Math.cos(lambda) * cosPhi;
		let y = Math.sin(lambda) * cosPhi;
		let z = Math.sin(phi);
		let k = z * cosDeltaPhi + x * sinDeltaPhi;

		return { longitude: $math.DEGREES * Math.atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi), latitude: $math.DEGREES * Math.asin(k * cosDeltaGamma + y * sinDeltaGamma) };
	}

	/**
	 * @ignore
	 * @deprecated
	 */
	public unrotate(geoPoint: IGeoPoint, deltaLongitude: number, deltaLatitude: number, deltaGamma?: number): IGeoPoint {

		let deltaLambda = deltaLongitude * $math.RADIANS;
		let deltaPhi = deltaLatitude * $math.RADIANS;
		deltaGamma = deltaGamma * $math.RADIANS;

		let lambda = geoPoint.longitude * $math.RADIANS - deltaLambda;
		let phi = geoPoint.latitude * $math.RADIANS;

		let cosDeltaPhi = Math.cos(deltaPhi);
		let sinDeltaPhi = Math.sin(deltaPhi);
		let cosDeltaGamma = Math.cos(deltaGamma);
		let sinDeltaGamma = Math.sin(deltaGamma);

		let cosPhi = Math.cos(phi);

		let x = Math.cos(lambda) * cosPhi;
		let y = Math.sin(lambda) * cosPhi;
		let z = Math.sin(phi);
		let k = z * cosDeltaGamma - y * sinDeltaGamma;

		return { longitude: $math.DEGREES * Math.atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi), latitude: $math.DEGREES * Math.asin(k * cosDeltaPhi - x * sinDeltaPhi) };
	}


	//@todo: move to some utils?
	//@todo: add credits to: https://www.movable-type.co.uk/scripts/latlong.html
	public intermediatePoint(pointA: IGeoPoint, pointB: IGeoPoint, position: number): IGeoPoint {
		let p = d3geo.geoInterpolate([pointA.longitude, pointA.latitude], [pointB.longitude, pointB.latitude])(position);
		return { longitude: p[0], latitude: p[1] };
	};

	// returns radians
	public multiDistance(multiGeoLine: Array<Array<IGeoPoint>>): number {
		let distance = 0;
		for (let s = 0; s < multiGeoLine.length; s++) {
			let points: Array<IGeoPoint> = multiGeoLine[s];
			if (points.length > 1) {
				for (let p = 1; p < points.length; p++) {
					let pointA = points[p - 1];
					let pointB = points[p];
					distance += this.distance(pointA, pointB);
				}
			}
		}
		return distance;
	}

	// returns radians
	public distance(pointA: IGeoPoint, pointB: IGeoPoint): number {
		return d3geo.geoDistance([pointA.longitude, pointA.latitude], [pointB.longitude, pointB.latitude]);
	}


	/**
	 * Converts relative position along the line (0-1) into pixel coordinates.
	 *
	 * @param position  Position (0-1)
	 * @return Coordinates
	 */
	public positionToPoint(multiGeoLine: Array<Array<IGeoPoint>>, position: number): IOrientationPoint {

		if (multiGeoLine) {
			let intermediatePoint = this.positionToGeoPoint(multiGeoLine, position);
			let intermediatePointA = this.positionToGeoPoint(multiGeoLine, position - 0.01);
			let intermediatePointB = this.positionToGeoPoint(multiGeoLine, position + 0.01);

			if (intermediatePointA && intermediatePointB) {

				let point = this.convert(intermediatePoint);

				let pa = this.convert(intermediatePointA);
				let pb = this.convert(intermediatePointB);

				return { x: point.x, y: point.y, angle: $math.getAngle(pa, pb) };
			}
		}

		return { x: 0, y: 0, angle: 0 };
	}


	/**
	 * Converts relative position along the line (0-1) into pixel coordinates.
	 *
	 * @param position  Position (0-1)
	 * @return Coordinates
	 */
	public positionToGeoPoint(multiGeoLine: Array<Array<IGeoPoint>>, position: number): IGeoPoint {

		if (multiGeoLine) {
			let totalDistance: number = this.multiDistance(multiGeoLine);
			let currentDistance: number = 0;

			let distanceAB: number;
			let positionA: number = 0;
			let positionB: number = 0;
			let pointA: IGeoPoint;
			let pointB: IGeoPoint;

			for (let s = 0; s < multiGeoLine.length; s++) {
				let points: Array<IGeoPoint> = multiGeoLine[s];
				if (points.length > 1) {
					for (let p = 1; p < points.length; p++) {
						pointA = points[p - 1];
						pointB = points[p];

						positionA = currentDistance / totalDistance;
						distanceAB = this.distance(pointA, pointB);
						currentDistance += distanceAB;
						positionB = currentDistance / totalDistance;

						if (positionA <= position && positionB > position) {
							s = multiGeoLine.length;
							break;
						}
					}
				}
				else if (points.length == 1) {
					pointA = points[0];
					pointB = points[0];
					positionA = 0;
					positionB = 1;
				}
			}

			if (pointA && pointB) {
				let positionAB: number = (position - positionA) / (positionB - positionA);
				return this.intermediatePoint(pointA, pointB, positionAB);
			}
		}
		return { longitude: 0, latitude: 0 };
	}
}



/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Projection"] = Projection;
