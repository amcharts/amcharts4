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

	public deltaLongitude: number = 0;

	public deltaLatitude: number = 0;

	public deltaGama: number = 0;

	protected _d3Projection: d3geo.GeoProjection;

	protected _d3Path: d3geo.GeoPath;

	constructor() {
		this.d3Projection = d3geo.geoEquirectangular();
	}

	public set d3Projection(projection: d3geo.GeoProjection) {
		this._d3Projection = projection;
		projection.precision(0.1);
		this._d3Path = d3geo.geoPath().projection(projection);
	}

	public get d3Projection(): d3geo.GeoProjection {
		return this._d3Projection;
	}

	public get d3Path(): d3geo.GeoPath {
		return this._d3Path;
	}

	public get scale(): number {
		return this.d3Projection.scale() / 100;
	}

	/*
		public projectGeoArea(geoArea: IGeoPoint[][][]): IPoint[][][] {
	
			let clippedGeoArea: IGeoPoint[][][] = this.clipGeoArea(geoArea);
			let convertedPoints: IPoint[][][] = this.convertGeoArea(clippedGeoArea);
	
			return convertedPoints;
		}
	
		public projectGeoLine(geoLine: IGeoPoint[][]): IPoint[][] {
			return this.convertGeoLine(this.clipGeoLine(geoLine));
		}
	
		public getClipRectangle1(): IGeoPoint[] {
			let longitude = $geo.wrapAngleTo180(180 - this.deltaLongitude);
			let latitude = $geo.wrapAngleTo180(this.deltaLatitude);
	
			let smallNum = 0.00001;
			return [{ longitude: -180, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude + 90 }, { longitude: -180, latitude: latitude + 90 }];
		}
	
		public getClipRectangle2(): IGeoPoint[] {
			let longitude = $geo.wrapAngleTo180(180 - this.deltaLongitude);
			//let latitude = $geo.wrapAngleTo180(this.deltaLatitude);
	
			let smallNum = 0.00001;
			return [{ longitude: longitude + smallNum, latitude: -90 }, { longitude: 180, latitude: -90 }, { longitude: 180, latitude: 90 }, { longitude: longitude + smallNum, latitude: 90 }];
		}
	
		public getRect1(): IGeoRectangle {
			let longitude = $geo.wrapAngleTo180(180 - this.deltaLongitude);
			let latitude = $geo.wrapAngleTo180(this.deltaLatitude);
	
			return { north: latitude + 90, south: latitude - 90, west: longitude - 180, east: longitude };
		}
	
		public getRect2(): IGeoRectangle {
			let longitude = $geo.wrapAngleTo180(180 - this.deltaLongitude);
			let latitude = $geo.wrapAngleTo180(this.deltaLatitude);
	
			return { north: latitude + 90, south: latitude - 90, west: longitude, east: (longitude + 180) };
		}
	
	
	
		protected clipGeoLine(geoLine: IGeoPoint[][]): IGeoPoint[][] {
			if (!geoLine) {
				return;
			}
	
			let clippedLine: IGeoPoint[][] = [];
	
			let clipRectangle1 = this.getClipRectangle1();
			let clipRectangle2 = this.getClipRectangle2();
	
			for (let i = 0, len = geoLine.length; i < len; i++) {
				let segment: IGeoPoint[] = geoLine[i];
	
				if (segment) {
					let clippedSegments: IGeoPoint[][] = this.clipLine(segment, clipRectangle1);
					clippedLine = clippedLine.concat(clippedSegments);
	
					if (this.deltaLongitude != 0) {
						let clippedSegments2: IGeoPoint[][] = this.clipLine(segment, clipRectangle2);
						clippedLine = clippedLine.concat(clippedSegments2);
					}
				}
			}
	
			return clippedLine;
		}
	
	
		protected clipGeoArea(geoArea: IGeoPoint[][][]): IGeoPoint[][][] {
	
			if (!geoArea) {
				return;
			}
	
			let clippedArea: IGeoPoint[][][] = [];
	
			let clipRectangle1 = this.getClipRectangle1();
			let clipRectangle2 = this.getClipRectangle2();
	
			let rect1 = this.getRect1();
			let rect2 = this.getRect2();
	
			for (let i = 0, len = geoArea.length; i < len; i++) {
	
				let surface: IGeoPoint[] = geoArea[i][0];
				let hole: IGeoPoint[] = geoArea[i][1];
	
				let clippedAreas: IGeoPoint[][][] = [];
	
				if (surface) {
	
					let surfaceRect = this.getExtremes(surface);
	
					if (!this.isInside(surfaceRect, rect1) && !this.isOutside(surfaceRect, rect1)) {
						let clippedSurface1: IGeoPoint[] = this.clip(surface, clipRectangle1);
						let clippedHole1: IGeoPoint[] = this.clip(hole, clipRectangle1);
						clippedAreas.push([clippedSurface1, clippedHole1]);
					}
					else {
						clippedAreas.push([surface, hole]);
					}
	
					if (!this.isInside(surfaceRect, rect2) && !this.isOutside(surfaceRect, rect2)) {
						let clippedSurface2: IGeoPoint[] = this.clip(surface, clipRectangle2);
						let clippedHole2: IGeoPoint[] = this.clip(hole, clipRectangle2);
						clippedAreas.push([clippedSurface2, clippedHole2]);
					}
				}
	
				for (let area of clippedAreas) {
					clippedArea.push(area);
				}
			}
	
			return clippedArea;
		}
	
		protected convertGeoArea(geoArea: IGeoPoint[][][]): IPoint[][][] {
	
			if (!geoArea) {
				return;
			}
	
			let convertedPoints: IPoint[][][] = [];
	
			for (let i = 0, len = geoArea.length; i < len; i++) {
	
				let surface: IGeoPoint[] = geoArea[i][0];
				let hole: IGeoPoint[] = geoArea[i][1];
	
				let convertedAreaPoints: IPoint[][] = [];
	
				if (surface) {
					let convertedSurface: IPoint[] = [];
	
					for (let s = 0, slen = surface.length; s < slen; s++) {
						let point: IPoint = this.convert(surface[s]);
	
						convertedSurface.push(point);
					}
					convertedAreaPoints.push(convertedSurface);
				}
	
				if (hole) {
					let convertedHole: IPoint[] = [];
					for (let s = 0, hlen = hole.length; s < hlen; s++) {
						let point: IPoint = this.convert(hole[s]);
	
						convertedHole.push(point);
					}
					convertedAreaPoints.push(convertedHole);
				}
				convertedPoints.push(convertedAreaPoints);
			}
			return convertedPoints;
		}
	
		protected convertGeoLine(geoLine: IGeoPoint[][]): IPoint[][] {
			if (!geoLine) {
				return;
			}
			let convertedPoints: IPoint[][] = [];
	
			for (let i = 0, len = geoLine.length; i < len; i++) {
	
				let segment: IGeoPoint[] = geoLine[i];
	
				let convertedSegmentPoints: IPoint[] = [];
	
				for (let s = 0, slen = segment.length; s < slen; s++) {
					let geoPoint: IGeoPoint = segment[s];
	
					let point: IPoint = this.convert(geoPoint);
					convertedSegmentPoints.push(point);
				}
	
				convertedPoints.push(convertedSegmentPoints);
			}
			return convertedPoints;
		}
	*/

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
		return { x: p[0], y: p[1] };
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

		return { longitude: p[0], latitude: p[1] };
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


	/*	
			clipLine(subjectPolyline: IGeoPoint[], clipPolygon: IGeoPoint[]): IGeoPoint[][] {
		
				if (!subjectPolyline || subjectPolyline.length == 0) {
					return;
				}
		
				let cp1: IGeoPoint;
				let cp2: IGeoPoint;
		
				var inside = function(p: IGeoPoint) {
					return (cp2.longitude - cp1.longitude) * (p.latitude - cp1.latitude) > (cp2.latitude - cp1.latitude) * (p.longitude - cp1.longitude);
				};
		
				let s: IGeoPoint;
				let e: IGeoPoint;
		
				//@todo: make a separate function
				var intersection = function() {
					let dc = { longitude: cp1.longitude - cp2.longitude, latitude: cp1.latitude - cp2.latitude };
					let dp = { longitude: s.longitude - e.longitude, latitude: s.latitude - e.latitude };
					let n1 = cp1.longitude * cp2.latitude - cp1.latitude * cp2.longitude;
					let n2 = s.longitude * e.latitude - s.latitude * e.longitude;
					let n3 = 1.0 / (dc.longitude * dp.latitude - dc.latitude * dp.longitude);
		
					return { longitude: (n1 * dp.longitude - n2 * dc.longitude) * n3, latitude: (n1 * dp.latitude - n2 * dc.latitude) * n3 };
				};
		
				var segment: IGeoPoint[] = subjectPolyline;
		
				cp1 = clipPolygon[clipPolygon.length - 1];
		
				for (let j = 0; j < clipPolygon.length; ++j) {
					cp2 = clipPolygon[j];
					let inputList = segment;
					segment = [];
					s = inputList[0];
					for (let i = 0, len = inputList.length; i < len; i++) {
						e = inputList[i];
		
						if (inside(e)) {
							if (!inside(s)) {
								segment.push(intersection());
							}
							segment.push(e);
						}
						else if (inside(s)) {
							segment.push(intersection());
						}
		
						s = e;
					}
					cp1 = cp2;
				}
		
				return [segment];
			}
		
		
		
		
			//@todo add credits to roseta code
			//@todo: someday make it better
			clip(subjectPolygon: IGeoPoint[], clipPolygon: IGeoPoint[]) {
		
				if (!subjectPolygon || subjectPolygon.length == 0) {
					return;
				}
		
				let cp1: IGeoPoint;
				let cp2: IGeoPoint;
		
				var inside = function(p: IGeoPoint) {
					return (cp2.longitude - cp1.longitude) * (p.latitude - cp1.latitude) > (cp2.latitude - cp1.latitude) * (p.longitude - cp1.longitude);
				};
		
				let s: IGeoPoint;
				let e: IGeoPoint;
				//@todo: make a separate function
				var intersection = function() {
					let dc = { longitude: cp1.longitude - cp2.longitude, latitude: cp1.latitude - cp2.latitude };
					let dp = { longitude: s.longitude - e.longitude, latitude: s.latitude - e.latitude };
					let n1 = cp1.longitude * cp2.latitude - cp1.latitude * cp2.longitude;
					let n2 = s.longitude * e.latitude - s.latitude * e.longitude;
					let n3 = 1.0 / (dc.longitude * dp.latitude - dc.latitude * dp.longitude);
		
					return { longitude: (n1 * dp.longitude - n2 * dc.longitude) * n3, latitude: (n1 * dp.latitude - n2 * dc.latitude) * n3 };
				};
		
				var outputList = subjectPolygon;
		
				cp1 = clipPolygon[clipPolygon.length - 1];
		
				for (let j = 0; j < clipPolygon.length; ++j) {
					cp2 = clipPolygon[j];
					let inputList = outputList;
					outputList = [];
					s = inputList[inputList.length - 1]; //last on the input list
		
					for (let i = 0, len = inputList.length; i < len; ++i) {
						e = inputList[i];
		
						if (inside(e)) {
							if (!inside(s)) {
								outputList.push(intersection());
							}
							outputList.push(e);
						}
						else if (inside(s)) {
							outputList.push(intersection());
						}
						s = e;
					}
		
					cp1 = cp2;
				}
				return outputList;
			}
		*/
	//@todo: move to some utils?
	/*
	public getExtremes(geoPoints: IGeoPoint[]): IGeoRectangle {

		let west: number = geoPoints[0].longitude;
		let east: number = geoPoints[0].longitude;
		let north: number = geoPoints[0].latitude;
		let south: number = geoPoints[0].latitude;

		for (let s: number = 0; s < geoPoints.length; s++) {
			let longitude: number = geoPoints[s].longitude;
			let latitude: number = geoPoints[s].latitude;

			if ((west > longitude)) {
				west = longitude;
			}
			if ((east < longitude)) {
				east = longitude;
			}

			if ((north < latitude)) {
				north = latitude;
			}
			if ((south > latitude)) {
				south = latitude;
			}
		}

		return { north: north, east: east, south: south, west: west };
	}*/
	/*
		//@todo: move to some utils?
		public isInside(r1: IGeoRectangle, r2: IGeoRectangle) {
			if (r1.north < r2.north && r1.south > r2.south && r1.west > r2.west && r1.east < r2.east) {
				return true;
			}
			return false;
		}
	
		//@todo: move to some utils?
		public isOutside(r1: IGeoRectangle, r2: IGeoRectangle) {
			if (r1.south > r2.north || r1.north < r2.south || r1.west > r2.east || r1.east < r2.west) {
				return true;
			}
			return false;
		}
	*/

	//@todo: move to some utils?
	//@todo: add credits to: https://www.movable-type.co.uk/scripts/latlong.html
	public intermediatePoint(pointA: IGeoPoint, pointB: IGeoPoint, position: number): IGeoPoint {
		let p = d3geo.geoInterpolate([pointA.longitude, pointA.latitude], [pointB.longitude, pointB.latitude])(position);
		return { longitude: p[0], latitude: p[1] };
	};

	// returns radians
	public multiDistance(multiGeoLine: IGeoPoint[][]): number {
		let distance = 0;
		for (let s = 0; s < multiGeoLine.length; s++) {
			let points: IGeoPoint[] = multiGeoLine[s];
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
	public positionToPoint(multiGeoLine: IGeoPoint[][], position: number): IOrientationPoint {

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
	public positionToGeoPoint(multiGeoLine: IGeoPoint[][], position: number): IGeoPoint {

		if (multiGeoLine) {
			let totalDistance: number = this.multiDistance(multiGeoLine);
			let currentDistance: number = 0;

			let distanceAB: number;
			let positionA: number = 0;
			let positionB: number = 0;
			let pointA: IGeoPoint;
			let pointB: IGeoPoint;

			for (let s = 0; s < multiGeoLine.length; s++) {
				let points: IGeoPoint[] = multiGeoLine[s];
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
