/**
 * Functionality for Mercator projection
 *
 * The function(s) below are from D3.js library (https://d3js.org/)
 *
 * ```
 * Copyright 2017 Mike Bostock
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * ```
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Projection } from "./Projection";
import { IGeoPoint } from "../../../core/defs/IGeoPoint";
import { IGeoRectangle } from "../../../core/defs/IGeoRectangle";
import { IPoint } from "../../../core/defs/IPoint";
import { registry } from "../../../core/Registry";
import * as $math from "../../../core/utils/Math";

/**
 * Orthographic projection.
 */
export class Orthographic extends Projection {

	/**
	 * Converts geographical coordinates to screen coordinates.
	 *
	 * @param lambda  Lambda parameter
	 * @param phi     Phi parameter
	 * @return Screen coordinates
	 */
	public project(lambda: number, phi: number): IPoint {
		return { x: Math.cos(phi) * Math.sin(lambda), y: Math.sin(phi) };
	}


	public getClipRectangle1(): IGeoPoint[] {
		let longitude = 90 - this.deltaLongitude;
		let latitude = -this.deltaLatitude;

		let smallNum = 0.00001;
		return [{ longitude: longitude - 180, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude + 90 }, { longitude: longitude - 180, latitude: latitude + 90 }];
	}


	public getRect1(): IGeoRectangle {
		let longitude = 90 - this.deltaLongitude;
		let latitude = -this.deltaLatitude;

		return { north: latitude + 90, south: latitude - 90, west: longitude - 180, east: longitude };
	}

	public getClipRectangle2(): IGeoPoint[] {
		let longitude = 90 - this.deltaLongitude;
		let latitude = -this.deltaLatitude;

		let smallNum = 0.00001;

		let delta: number;

		if (longitude > 0) {
			delta = -360;
		}
		else {
			delta = 360;
		}

		return [{ longitude: smallNum + longitude - 180 + delta, latitude: latitude - 90 }, { longitude: longitude - smallNum + delta, latitude: latitude - 90 }, { longitude: longitude - smallNum + delta, latitude: latitude + 90 }, { longitude: smallNum + longitude - 180 + delta, latitude: latitude + 90 }];
	}



	public getRect2(): IGeoRectangle {
		let longitude = 90 - this.deltaLongitude;
		let latitude = -this.deltaLatitude;

		let delta: number;

		if (longitude > 0) {
			delta = -360;
		}
		else {
			delta = 360;
		}
		return { north: latitude + 90, south: latitude - 90, west: longitude - 180 + delta, east: longitude + delta };
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
				else if (this.isInside(surfaceRect, rect1)) {
					clippedAreas.push([surface, hole]);
				}

				if (!this.isInside(surfaceRect, rect2) && !this.isOutside(surfaceRect, rect2)) {
					let clippedSurface2: IGeoPoint[] = this.clip(surface, clipRectangle2);
					let clippedHole2: IGeoPoint[] = this.clip(hole, clipRectangle2);

					clippedAreas.push([clippedSurface2, clippedHole2]);
				}
				else if (this.isInside(surfaceRect, rect2)) {
					clippedAreas.push([surface, hole]);
				}
			}

			for (let area of clippedAreas) {
				clippedArea.push(area);
			}
		}

		for (let i = 0, len = clippedArea.length; i < len; i++) {

			let surface: IGeoPoint[] = clippedArea[i][0];
			//let hole: IGeoPoint[] = clippedArea[i][1];

			if (surface) {

				let len = surface.length;

				let prevPoint = surface[len - 1];

				for (let i = 0; i < len; i++) {
					let point = surface[i];

					if ($math.round(point.longitude, 4) == $math.round(prevPoint.longitude, 4)) {
						let stepCount = Math.abs((prevPoint.latitude - point.latitude) * 2);
						let extraPoints: IGeoPoint[] = [];

						if (stepCount > 1) {
							for (let s = 1; s < stepCount; s++) {
								extraPoints.push({ longitude: prevPoint.longitude, latitude: prevPoint.latitude + (point.latitude - prevPoint.latitude) / stepCount * s })
							}

							surface.splice(i, 0, ...extraPoints);
							i = i + extraPoints.length;
						}
					}

					prevPoint = point;
				}
			}
		}

		return clippedArea;
	}


}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Orthographic"] = Orthographic;
