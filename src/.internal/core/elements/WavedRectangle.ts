/**
 * Functionality for drawing rectangles with waved edges.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Rectangle, IRectangleProperties, IRectangleAdapters, IRectangleEvents } from "./Rectangle";
import { IPoint } from "../defs/IPoint";
import { IWavedShape } from "../defs/IWavedShape";
import { wavedLine } from "../rendering/Smoothing";
import * as $path from "../rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines available properties for [[WavedRectangle]].
 */
export interface IWavedRectangleProperties extends IRectangleProperties {

	/**
	 * Wave length in pixels.
	 *
	 * @default 16
	 */
	waveHeight?: number;

	/**
	 * Wave height in pixels.
	 *
	 * @default 4
	 */
	waveLength?: number;

	/**
	 * Wave tension.
	 *
	 * @default 0.8
	 */
	tension?: number;
}

/**
 * Defines events for [[WavedRectangle]].
 */
export interface IWavedRectangleEvents extends IRectangleEvents { }

/**
 * Defines adapters for [[WavedRectangle]].
 *
 * @see {@link Adapter}
 */
export interface IWavedRectangleAdapters extends IRectangleAdapters, IWavedRectangleProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a rectangle with waved edges.
 *
 * @see {@link IWavedRectangleEvents} for a list of available events
 * @see {@link IWavedRectangleAdapters} for a list of available Adapters
 */
export class WavedRectangle extends Rectangle implements IWavedShape {

	/**
	 * Defines available properties.
	 */
	public _properties!: IWavedRectangleProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IWavedRectangleAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IWavedRectangleEvents;

	/**
	 * Top waved?
	 */
	protected _twaved: boolean = true;

	/**
	 * Right side waved?
	 */
	protected _rwaved: boolean = true;

	/**
	 * Bottom waved?
	 */
	protected _bwaved: boolean = true;

	/**
	 * Left side waved?
	 */
	protected _lwaved: boolean = true;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "WavedRectangle";

		// Add path element
		this.element = this.paper.add("path");

		// Set defaults
		this.waveLength = 16;
		this.waveHeight = 4;
		this.tension = 0.8;


		// Apply theme
		this.applyTheme();

	}

	/**
	 * Draws the waved rectangle.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		let w: number = this.pixelWidth;
		let h: number = this._pixelHeight;

		if (w > 0 && h > 0) {
			let p1: IPoint = { x: 0, y: 0 };
			let p2: IPoint = { x: w, y: 0 };
			let p3: IPoint = { x: w, y: h };
			let p4: IPoint = { x: 0, y: h };

			let waveLength: number = this.waveLength;
			let waveHeight: number = this.waveHeight;

			let td: string = "";
			let rd: string = "";
			let bd: string = "";
			let ld: string = "";

			if (this._twaved) {
				td = wavedLine(p1, p2, waveLength, waveHeight, this.tension, true);
			}
			if (this._rwaved) {
				ld = wavedLine(p2, p3, waveLength, waveHeight, this.tension, true);
			}
			if (this._bwaved) {
				bd = wavedLine(p3, p4, waveLength, waveHeight, this.tension, true);
			}
			if (this._rwaved) {
				rd = wavedLine(p4, p1, waveLength, waveHeight, this.tension, true);
			}

			this.path = $path.moveTo(p1) + td + $path.lineTo(p2) + ld + $path.lineTo(p3) + bd + $path.lineTo(p4) + rd + "z";
		}
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
	 * Sets which side should be waved or not. If particular side is set to
	 * `false`, a straight line will be drawn on that side.
	 *
	 * @param top     Top waved?
	 * @param right   Right side waved?
	 * @param bottom  Bottom Waved?
	 * @param left    Left side waved?
	 */
	public setWavedSides(top: boolean, right: boolean, bottom: boolean, left: boolean): void {
		this._twaved = top;
		this._lwaved = right;
		this._bwaved = bottom;
		this._rwaved = left;
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
