/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { registry } from "../Registry";
import * as $path from "./Path";
import * as $array from "../utils/Array";
import * as $utils from "../utils/Utils";
import * as $math from "../utils/Math";
import { IPoint } from "../defs/IPoint";


/**
 * ============================================================================
 * PATH FUNCTIONS
 * ============================================================================
 * @hidden
 */

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export interface ISmoothing {
	smooth(points: Array<IPoint>): string;
}

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export class Tension implements ISmoothing {

	/**
	 * [_tensionX description]
	 *
	 * @todo Description
	 */
	private _tensionX: number;

	/**
	 * [_tensionY description]
	 *
	 * @todo Description
	 */
	private _tensionY: number;

	/**
	 * Constructor.
	 *
	 * @param tensionX [description]
	 * @param tensionY [description]
	 */
	constructor(tensionX: number, tensionY: number) {
		this._tensionX = tensionX;
		this._tensionY = tensionY;
	}

	/**
	 * [smooth description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param points  [description]
	 * @return [description]
	 */
	public smooth(points: Array<IPoint>): string {
		let tensionX = this._tensionX;
		let tensionY = this._tensionY;

		if (points.length < 3 || (tensionX >= 1 && tensionY >= 1)) {
			return $path.polyline(points);
		}

		let first: IPoint = points[0];
		let last: IPoint = points[points.length - 1];

		let closed: boolean = false;

		if ($math.round(first.x, 3) == $math.round(last.x) && $math.round(first.y) == $math.round(last.y)) {
			closed = true;
		}

		// Can't moveTo here, as it wont be possible to have fill then.
		let path: string = "";

		for (let i = 0, len = points.length - 1; i < len; i++) {
			let p0: IPoint = points[i - 1];

			let p1: IPoint = points[i];

			let p2: IPoint = points[i + 1];

			let p3: IPoint = points[i + 2];

			if (i === 0) {
				if (closed) {
					p0 = points[points.length - 2];
				}
				else {
					p0 = points[i];
				}
			} else if (i == points.length - 2) {
				if (closed) {
					p3 = points[1];
				}
				else {
					p3 = points[i + 1];
				}
			}

			let controlPointA: IPoint = $math.getCubicControlPointA(p0, p1, p2, p3, tensionX, tensionY);
			let controlPointB: IPoint = $math.getCubicControlPointB(p0, p1, p2, p3, tensionX, tensionY);

			path += $path.cubicCurveTo(p2, controlPointA, controlPointB);
		}

		return path;
	}
}


/**
 * Returns a waved line SVG path between two points.
 *
 * @ignore Exclude from docs
 * @param point1            Starting point
 * @param point2            Ending point
 * @param waveLength        Wave length
 * @param waveHeight        Wave height
 * @param adjustWaveLength  Adjust wave length based on the actual line length
 * @return SVG path
 */
export function wavedLine(point1: IPoint, point2: IPoint, waveLength: number, waveHeight: number, tension: number, adjustWaveLength?: boolean): string {

	let x1: number = point1.x;
	let y1: number = point1.y;

	let x2: number = point2.x;
	let y2: number = point2.y;

	let distance: number = $math.getDistance(point1, point2);

	if (adjustWaveLength) {
		waveLength = distance / Math.round(distance / waveLength);
	}

	let d: string = registry.getCache($utils.stringify(["wavedLine", point1.x, point2.x, point1.y, point2.y, waveLength, waveHeight]));
	if (!d) {
		if (distance > 0) {
			let angle: number = Math.atan2(y2 - y1, x2 - x1);

			let cos: number = Math.cos(angle);
			let sin: number = Math.sin(angle);

			let waveLengthX: number = waveLength * cos;
			let waveLengthY: number = waveLength * sin;

			if (waveLength <= 1 || waveHeight <= 1) {
				d = $path.lineTo(point2);
			}
			else {
				let halfWaveCount: number = Math.round(2 * distance / waveLength);

				let points: IPoint[] = [];
				let sign: number = 1;

				if (x2 < x1) {
					sign *= -1;
				}

				if (y2 < y1) {
					sign *= -1;
				}

				for (let i: number = 0; i <= halfWaveCount; i++) {
					sign *= -1;
					let x: number = x1 + i * waveLengthX / 2 + sign * waveHeight / 2 * sin;
					let y: number = y1 + i * waveLengthY / 2 - sign * waveHeight / 2 * cos;
					points.push({ x: x, y: y });
				}

				d = new Tension(tension, tension).smooth(points);
			}
		}
		else {
			d = "";
		}

		registry.setCache($utils.stringify(["wavedLine", point1.x, point2.x, point1.y, point2.y, waveLength, waveHeight]), d);
	}

	return d;
}


/**
 * @ignore Exclude from docs
 * @todo Description
 */
export class Basis implements ISmoothing {

	/**
	 * [_closed description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	private _closed: boolean;

	/**
	 * Constructor.
	 *
	 * @param info  [description]
	 */
	constructor(info: { closed: boolean }) {
		this._closed = info.closed;
	}

	/**
	 * [smooth description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param points  [description]
	 * @return [description]
	 */
	public smooth(points: Array<IPoint>): string {
		let x0: number = NaN;
		let x1: number = NaN;
		let x2: number = NaN;
		let x3: number = NaN;
		let x4: number = NaN;
		let y0: number = NaN;
		let y1: number = NaN;
		let y2: number = NaN;
		let y3: number = NaN;
		let y4: number = NaN;
		let point: number = 0;

		let output = "";

		const pushCurve = (x: number, y: number): void => {
			output += $path.cubicCurveTo(
				{
					x: (x0 + 4 * x1 + x) / 6
					, y: (y0 + 4 * y1 + y) / 6
				},

				{
					x: (2 * x0 + x1) / 3
					, y: (2 * y0 + y1) / 3
				},

				{
					x: (x0 + 2 * x1) / 3
					, y: (y0 + 2 * y1) / 3
				}
			);
		};

		const pushPoint = ({ x, y }: IPoint): void => {
			switch (point) {
				case 0:
					point = 1;

					if (this._closed) {
						x2 = x;
						y2 = y;

					} else {
						output += $path.lineTo({ x, y });
					}
					break;

				case 1:
					point = 2;

					if (this._closed) {
						x3 = x;
						y3 = y;
					}
					break;

				case 2:
					point = 3;

					if (this._closed) {
						x4 = x;
						y4 = y;
						output += $path.moveTo({ x: (x0 + 4 * x1 + x) / 6, y: (y0 + 4 * y1 + y) / 6 });
						break;

					} else {
						output += $path.lineTo({ x: (5 * x0 + x1) / 6, y: (5 * y0 + y1) / 6 });
						// fall-through
					}

				default:
					pushCurve(x, y);
					break;
			}

			x0 = x1;
			x1 = x;
			y0 = y1;
			y1 = y;
		};

		$array.each(points, pushPoint);

		if (this._closed) {
			switch (point) {
				case 1:
					output += $path.moveTo({ x: x2, y: y2 });
					output += $path.closePath();
					break;
				case 2:
					output += $path.moveTo({ x: (x2 + 2 * x3) / 3, y: (y2 + 2 * y3) / 3 });
					output += $path.lineTo({ x: (x3 + 2 * x2) / 3, y: (y3 + 2 * y2) / 3 });
					output += $path.closePath();
					break;
				case 3:
					pushPoint({ x: x2, y: y2 });
					pushPoint({ x: x3, y: y3 });
					pushPoint({ x: x4, y: y4 });
					break;
			}

		} else {
			switch (point) {
				case 3:
					pushCurve(x1, y1);
				// fall-through
				case 2:
					output += $path.lineTo({ x: x1, y: y1 });
					break;
			}

			output += $path.closePath();
		}

		return output;
	}

}
