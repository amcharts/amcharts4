/**
 * Functionality for drawing waved circles.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Circle, ICircleProperties, ICircleAdapters, ICircleEvents } from "./Circle";
import { IWavedShape } from "../defs/IWavedShape";
import { IPoint } from "../defs/IPoint";
import { Percent } from "../utils/Percent";
import { registry } from "../Registry";
import * as $path from "../rendering/Path";
import * as $math from "../utils/Math";
import * as $utils from "../utils/Utils";
import * as $smoothing from "../../core/rendering/Smoothing";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[WavedCircle]].
 */
export interface IWavedCircleProperties extends ICircleProperties {

	/**
	 * Wave length in pixels.
	 *
	 * @default 16
	 */
	waveLength?: number;

	/**
	 * Wave height in pixels.
	 *
	 * @default 4
	 */
	waveHeight?: number;

	/**
	 * Wave tension.
	 *
	 * @default 0.8
	 */
	tension?: number;

	/**
	 * Inner radius of the circle in pixels.
	 */
	innerRadius?: number | Percent;

}

/**
 * Defines events for [[WavedCircle]].
 */
export interface IWavedCircleEvents extends ICircleEvents { }

/**
 * Defines adapters for [[WavedCircle]].
 *
 * @see {@link Adapter}
 */
export interface IWavedCircleAdapters extends ICircleAdapters, IWavedCircleProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a waved circle.
 *
 * @see {@link IWavedCircleEvents} for a list of available events
 * @see {@link IWavedCircleAdapters} for a list of available Adapters
 */
export class WavedCircle extends Circle implements IWavedShape {

	/**
	 * Defines available properties.
	 */
	public _properties!: IWavedCircleProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IWavedCircleAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IWavedCircleEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "WavedCircle";
		this.element = this.paper.add("path");
		this.waveLength = 16;
		this.waveHeight = 4;

		this.fill = undefined;
		this.fillOpacity = 0;
		this.tension = 0.8;

		this.applyTheme();
	}

	/**
	 * Draws the waved line.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		let path: string = "";

		let radius: number = this.pixelRadius;

		if (radius > 0) {
			let points: IPoint[] = this.getPoints(radius);
			path = $path.moveTo(points[0]) + new $smoothing.Tension(this.tension, this.tension).smooth(points);
		}

		let innerRadius: number = this.pixelInnerRadius;
		if (innerRadius > 0) {
			let points: IPoint[] = this.getPoints(innerRadius);
			points.reverse();
			path += $path.moveTo(points[0]) + new $smoothing.Tension(this.tension, this.tension).smooth(points);
		}

		this.path = path;
	}

	/**
	 * Returns points that circle consists of.
	 *
	 * @param radius  Radius (px)
	 * @return Points
	 */
	protected getPoints(radius: number): IPoint[] {
		let circleLength: number = radius * Math.PI * 2;
		let halfWaveHeight: number = this.waveHeight / 2;

		let waveLength = circleLength / Math.round(circleLength / this.waveLength);
		let halfWaveLength: number = waveLength / 2;
		let points: IPoint[] = [];

		let count = circleLength / waveLength;
		for (let i = 0; i <= count; i++) {
			let angle1: number = (i * waveLength) / circleLength * 360;
			let angle2: number = (i * waveLength + halfWaveLength) / circleLength * 360;

			points.push({ x: (radius - halfWaveHeight) * $math.cos(angle1), y: (radius - halfWaveHeight) * $math.sin(angle1) });
			points.push({ x: (radius + halfWaveHeight) * $math.cos(angle2), y: (radius + halfWaveHeight) * $math.sin(angle2) });
		}
		points.pop();
		return points;
	}

	/**
	 * Inner radius of the circle in pixels (absolute) or [[Percent]] (relative).
	 *
	 * @param value  Inner radius
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, true, false, 10, false);
		this.invalidate();
	}

	/**
	 * @return Inner radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Calculated inner radius of the circle in pixels.
	 *
	 * @readonly
	 * @return Inner radius (px)
	 */
	public get pixelInnerRadius(): number {
		return $utils.relativeToValue(this.innerRadius, $math.min(this.innerWidth / 2, this.innerHeight / 2));
	}

	/**
	 * Wave length in pixels.
	 *
	 * @default 16
	 * @param value  Wave length (px)
	 */
	public set waveLength(value: number) {
		this.setPropertyValue("waveLength", value);
		this.invalidate();
	}

	/**
	 * @return Wave length (px)
	 */
	public get waveLength(): number {
		return this.getPropertyValue("waveLength");
	}

	/**
	 * Wave height in pixels.
	 *
	 * @default 4
	 * @param value  Wave height (px)
	 */
	public set waveHeight(value: number) {
		this.setPropertyValue("waveHeight", value);
		this.invalidate();
	}

	/**
	 * @return Wave height (px)
	 */
	public get waveHeight(): number {
		return this.getPropertyValue("waveHeight");
	}

	/**
	 * Tension of the wave.
	 *
	 * @default 0.8
	 * @param value  Tension
	 */
	public set tension(value: number) {
		this.setPropertyValue("tension", value);
		this.invalidate();
	}

	/**
	 * @return Tension
	 */
	public get tension(): number {
		return this.getPropertyValue("tension");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["WavedCircle"] = WavedCircle;
