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
import { registry } from "../../../core/Registry";
import * as $math from "../../../core/utils/Math";
import * as $geo from "../Geo";


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

	public centerPoint: IPoint = { x: 0, y: 0 };

	public scale: number = 1;

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


	/**
	 * Converts a geographical point (lat/long) to a screen point (x/y)
	 * @param  {IGeoPoint} geoPoint Geo point (lat/long)
	 * @return {IPoint}             Screen point (x/y)
	 */
	public convert(geoPoint: IGeoPoint): IPoint {
		geoPoint = $geo.normalizePoint(geoPoint);
		geoPoint = this.rotate(geoPoint, this.deltaLongitude, this.deltaLatitude, this.deltaGama);
		let pointInRadians: IPoint = this.project(geoPoint.longitude * $math.RADIANS, geoPoint.latitude * $math.RADIANS);
		return {
			x: $math.round(pointInRadians.x * $math.DEGREES - this.centerPoint.x, 4) * this.scale,
			y: $math.round(-pointInRadians.y * $math.DEGREES - this.centerPoint.y, 4) * this.scale
		};
	}

	/**
	 * Converts a screen point (x/y) to a geographical point (lat/long)
	 * @param  {IPoint}    point Screen point (x/y)
	 * @return {IGeoPoint}       Geo point (lat/long)
	 */
	public invert(point: IPoint): IGeoPoint {
		let pointInRadians: IGeoPoint = this.unproject((point.x / this.scale + this.centerPoint.x) * $math.RADIANS, (-point.y / this.scale - this.centerPoint.y) * $math.RADIANS);

		let geoPoint = { longitude: pointInRadians.longitude * $math.DEGREES, latitude: pointInRadians.latitude * $math.DEGREES };

		geoPoint = this.unrotate(geoPoint, this.deltaLongitude, this.deltaLatitude, this.deltaGama);

		return geoPoint;
	}

	/**
	 * Returns X/Y coordinates.
	 * Individual projections will override this method to apply their own 
	 * projection logic.
	 * @param  {number} lambda [description]
	 * @param  {number} phi    [description]
	 * @return {IPoint}        X/Y coordinates
	 * @todo Needs description
	 */
	public project(lambda: number, phi: number): IPoint {
		return { x: lambda, y: phi };
	}

	/**
	 * Returns geographical coordinates (lat/long).
	 * Individual projections will override this method to apply their own 
	 * projection logic.
	 * @param  {number}    x X coordinate
	 * @param  {number}    y Y coordinate
	 * @return {IGeoPoint}   Geographical point
	 * @todo Needs description
	 */
	public unproject(x: number, y: number): IGeoPoint {
		return { longitude: x, latitude: y };
	}


	rotate(geoPoint: IGeoPoint, deltaLongitude: number, deltaLatitude: number, deltaGamma?: number): IGeoPoint {

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

	unrotate(geoPoint: IGeoPoint, deltaLongitude: number, deltaLatitude: number, deltaGamma?: number): IGeoPoint {

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

		for (let j in clipPolygon) {
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

		for (let j in clipPolygon) {
			cp2 = clipPolygon[j];
			let inputList = outputList;
			outputList = [];
			s = inputList[inputList.length - 1]; //last on the input list
			for (let i in inputList) {
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

	//@todo: move to some utils?
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
	}

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


	//@todo: move to some utils?
	//@todo: add credits to: https://www.movable-type.co.uk/scripts/latlong.html
	public intermediatePoint(pointA: IGeoPoint, pointB: IGeoPoint, position: number) {
		var phi1 = pointA.latitude * $math.RADIANS;
		let lambda1 = pointA.longitude * $math.RADIANS;

		let phi2 = pointB.latitude * $math.RADIANS;
		let lambda2 = pointB.longitude * $math.RADIANS;

		var sinPhi1 = Math.sin(phi1);
		let cosPhi1 = Math.cos(phi1);
		let sinLambda1 = Math.sin(lambda1);
		let cosLambda1 = Math.cos(lambda1);
		var sinPhi2 = Math.sin(phi2);
		let cosPhi2 = Math.cos(phi2);
		let sinLambda2 = Math.sin(lambda2);
		let cosLambda2 = Math.cos(lambda2);

		// distance between points
		var deltaPhi = phi2 - phi1;
		var deltaLambda = lambda2 - lambda1;
		var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
		var delta = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		var A = Math.sin((1 - position) * delta) / Math.sin(delta);
		var B = Math.sin(position * delta) / Math.sin(delta);

		var x = A * cosPhi1 * cosLambda1 + B * cosPhi2 * cosLambda2;
		var y = A * cosPhi1 * sinLambda1 + B * cosPhi2 * sinLambda2;
		var z = A * sinPhi1 + B * sinPhi2;

		var phi3 = Math.atan2(z, Math.sqrt(x * x + y * y));
		var lambda3 = Math.atan2(y, x);

		return { latitude: phi3 * $math.DEGREES, longitude: lambda3 * $math.DEGREES };
	};
}


/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 * 
 * @ignore
 */
registry.registeredClasses["Projection"] = Projection;