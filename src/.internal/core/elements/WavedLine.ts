/**
 * Functionality for drawing waved lines.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Line, ILineProperties, ILineAdapters, ILineEvents } from "./Line";
import { IPoint } from "../defs/IPoint";
import { IWavedShape } from "../defs/IWavedShape";
import { color } from "../utils/Color";
import { wavedLine } from "../rendering/Smoothing";
import * as $path from "../rendering/Path";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines available properties for [[WavedLine]].
 */
export interface IWavedLineProperties extends ILineProperties {

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

}

/**
 * Defines events for [[WavedLine]].
 */
export interface IWavedLineEvents extends ILineEvents { }

/**
 * Defines adapters for [[WavedLine]].
 *
 * @see {@link Adapter}
 */
export interface IWavedLineAdapters extends ILineAdapters, IWavedLineProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a waved line.
 *
 * @see {@link IWavedLineEvents} for a list of available events
 * @see {@link IWavedLineAdapters} for a list of available Adapters
 */
export class WavedLine extends Line implements IWavedShape {

	/**
	 * Defines available properties.
	 */
	public _properties!: IWavedLineProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IWavedLineAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IWavedLineEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "WavedLine";
		this.element = this.paper.add("path");
		this.waveLength = 16;
		this.waveHeight = 4;
		this.tension = 0.8;
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
		let p1: IPoint = { x: this.x1, y: this.y1 };
		let p2: IPoint = { x: this.x2, y: this.y2 };

		this.path = $path.moveTo(p1) + wavedLine(p1, p2, this.waveLength, this.waveHeight, this.tension, true);
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
