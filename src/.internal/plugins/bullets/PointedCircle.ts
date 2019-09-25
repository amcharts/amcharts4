/**
 * Pointed rectangle module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PointedShape, IPointedShapeProperties, IPointedShapeAdapters, IPointedShapeEvents } from "../../core/elements/PointedShape";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";
import * as $math from "../../core/utils/Math";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[PointedCircle]].
 */
export interface IPointedCircleProperties extends IPointedShapeProperties {

	/**
	 * Radius of a pin, in pixels.
	 *
	 * @default 18
	 */
	radius?: number;

	/**
	 * Angle of a pointer, in degrees.
	 *
	 * @default 90
	 */
	pointerAngle?: number;

}

/**
 * Defines events for [[PointedCircle]].
 */
export interface IPointedCircleEvents extends IPointedShapeEvents { }

/**
 * Defines adapters for [[PointedCircle]].
 *
 * @see {@link Adapter}
 */
export interface IPointedCircleAdapters extends IPointedShapeAdapters, IPointedCircleProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a circle with a pointer.
 *
 * @since 4.5.7
 * @see {@link https://www.amcharts.com/docs/v4/tutorials/plugin-bullets/} for usage instructions.
 * @see {@link IPointedCircleEvents} for a list of available events
 * @see {@link IPointedCircleAdapters} for a list of available Adapters
 */
export class PointedCircle extends PointedShape {

	/**
	 * Defines available properties.
	 */
	public _properties!: IPointedCircleProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPointedCircleAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPointedCircleEvents;


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PointedCircle";
		this.element = this.paper.add("path");
		this.radius = 18;
		this.pointerAngle = 90;

		this.applyTheme();
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		let pw = this.pointerBaseWidth;
		let pl = this.pointerLength;

		if (pl <= 0.001) {
			pl = 0.001;
		}

		let angle = this.pointerAngle + 180;
		let radius = this.radius;


		if (pw > 2 * radius) {
			pw = 2 * radius;
		}

		let x = this.pointerX;
		let y = this.pointerY;

		let path = $path.moveTo({ x: x, y: x });

		let da = $math.DEGREES * Math.atan(pw / 2 / pl);

		if (da <= 0.001) {
			da = 0.001;
		}

		let a1 = angle - da;
		let a2 = angle + da;

		path += $path.lineTo({ x: x + pl * $math.cos(a1), y: y + pl * $math.sin(a1) });
		path += $path.arcToPoint({ x: x + pl * $math.cos(a2), y: y + pl * $math.sin(a2) }, radius, radius, true, true);
		path += $path.lineTo({ x: x, y: x });

		this.path = path;
	}

	/**
	 * Radius of a circle in pixels.
	 *
	 * @default 18
	 * @param  value  Radius (px)
	 */
	public set radius(value: number) {
		this.setPropertyValue("radius", value, true);
	}

	/**
	 * @return Radius (px)
	 */
	public get radius(): number {
		return this.getPropertyValue("radius");
	}

	/**
	 * Angle of a pointer, in degrees.
	 * 
	 * @default 90
	 * @param  value Angle (degrees)
	 */
	public set pointerAngle(value: number) {
		this.setPropertyValue("pointerAngle", value, true);
	}

	/**
	 * @return Angle of a pointer, in degrees.
	 */
	public get pointerAngle(): number {
		return this.getPropertyValue("pointerAngle");
	}

	public getTooltipY(){
		return $math.sin(this.pointerAngle) * (-this.pointerLength * 0.8 - this.radius) - this.radius;
	}

	public getTooltipX(){
		return $math.cos(this.pointerAngle) * (-this.pointerLength * 0.8 - this.radius);
	}	
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PointerCircle"] = PointedCircle;