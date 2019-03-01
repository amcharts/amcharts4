/**
 * Functionality for drawing quadratic curves.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Line, ILineProperties, ILineAdapters, ILineEvents } from "./Line";
import { IPoint, IOrientationPoint } from "../defs/IPoint";
import { color } from "../utils/Color";
import * as $path from "../rendering/Path";
import * as $math from "../utils/Math";
import * as $type from "../utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines available properties for [[QuadraticCurve]].
 */
export interface IQuadraticCurveProperties extends ILineProperties {
	/**
	 * X coordinate of control point.
	 */
	cpx?: number;

	/**
	 * Y coordinate of control point.
	 */
	cpy?: number;
}

/**
 * Defines events for [[QuadraticCurve]].
 */
export interface IQuadraticCurveEvents extends ILineEvents { }

/**
 * Defines adapters for [[QuadraticCurve]].
 *
 * @see {@link Adapter}
 */
export interface IQuadraticCurveAdapters extends ILineAdapters, IQuadraticCurveProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a waved line.
 *
 * @see {@link IQuadraticCurveEvents} for a list of available events
 * @see {@link IQuadraticCurveAdapters} for a list of available Adapters
 */
export class QuadraticCurve extends Line {

	/**
	 * Defines available properties.
	 */
	public _properties!: IQuadraticCurveProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IQuadraticCurveAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IQuadraticCurveEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "QuadraticCurve";
		this.element = this.paper.add("path");
		this.pixelPerfect = false;

		this.fill = color();

		this.applyTheme();
	}

	/**
	 * Draws the waved line.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		//super.draw();
		if($type.isNumber(this.x1 + this.x2 + this.y1 + this.y2 + this.cpx + this.cpy )){

			let p1: IPoint = { x: this.x1, y: this.y1 };
			let p2: IPoint = { x: this.x2, y: this.y2 };
			let cp: IPoint = { x: this.cpx, y: this.cpy };

			let d: string = $path.moveTo(p1) + $path.quadraticCurveTo(p2, cp);

			this.path = d;
		}
	}

	/**
	 * X coordinate of control point.
	 *
	 * @param value X
	 */
	public set cpx(value: number) {
		this.setPropertyValue("cpx", value, true);
	}

	/**
	 * @return X
	 */
	public get cpx(): number {
		return this.getPropertyValue("cpx");
	}

	/**
	 * Y coordinate of control point.
	 *
	 * @param value Y
	 */
	public set cpy(value: number) {
		this.setPropertyValue("cpy", value, true);
	}

	/**
	 * @return Y
	 */
	public get cpy(): number {
		return this.getPropertyValue("cpy");
	}

	/**
	 * Converts relative position along the line (0-1) into pixel coordinates.
	 *
	 * @param position  Position (0-1)
	 * @return Coordinates
	 */
	public positionToPoint(position: number): IOrientationPoint {
		let p1 = {x:this.x1, y:this.y1};
		let cp = {x:this.cpx, y:this.cpy};
		let p2 = {x:this.x2, y:this.y2};

		let point1 = $math.getPointOnQuadraticCurve(p1, p2, cp, position);
		let point2 = $math.getPointOnQuadraticCurve(p1, p2, cp, position + 0.001);

		return {x:point1.x, y:point1.y, angle:$math.getAngle(point1, point2)};
	}
}
