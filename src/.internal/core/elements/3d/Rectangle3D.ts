/**
 * Creates a 3D rectangle.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../Container";
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../Sprite";
import { IPoint } from "../../defs/IPoint";
import { LightenFilter } from "../../rendering/filters/LightenFilter";
import * as $math from "../../utils/Math";
import * as $path from "../../rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Rectangle3D]].
 */
export interface Rectangle3DProperties extends IContainerProperties {

	/**
	 * Depth (Z dimension) of the 3D rectangle in pixels.
	 *
	 * @default 30
	 */
	depth?: number;

	/**
	 * Angle of the point of view to the 3D element. (0-360)
	 *
	 * @default 30
	 */
	angle?: number;

}

/**
 * Defines events for [[Rectangle3D]]
 */
export interface Rectangle3DEvents extends IContainerEvents { }

/**
 * Defines adapters for [[Rectangle3D]].
 *
 * @see {@link Adapter}
 */
export interface Rectangle3DAdapters extends IContainerAdapters, Rectangle3DProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Builds a 3D rectangle
 * @see {@link IRectangle3DEvents} for a list of available events
 * @see {@link IRectangle3DAdapters} for a list of available Adapters
 */
export class Rectangle3D extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: Rectangle3DProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: Rectangle3DAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: Rectangle3DEvents;

	/**
	 * Left side element.
	 *
	 * @ignore Exclude from docs
	 */
	public sideLeft: Sprite;

	/**
	 * Right side element.
	 *
	 * @ignore Exclude from docs
	 */
	public sideRight: Sprite;

	/**
	 * Top element.
	 *
	 * @ignore Exclude from docs
	 */
	public sideTop: Sprite;

	/**
	 * Bottom element.
	 *
	 * @ignore Exclude from docs
	 */
	public sideBottom: Sprite;

	/**
	 * Back element.
	 *
	 * @ignore Exclude from docs
	 */
	public sideBack: Sprite;

	/**
	 * Front element.
	 *
	 * @ignore Exclude from docs
	 */
	public sideFront: Sprite;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.angle = 30;
		this.depth = 30;
		this.className = "Rectangle3D";
		this.layout = "none";

		let sideBack: Sprite = this.createChild(Sprite);
		sideBack.shouldClone = false;
		sideBack.setElement(this.paper.add("path"));
		sideBack.isMeasured = false;
		let lightenFilterBack: LightenFilter = new LightenFilter();
		lightenFilterBack.lightness = -0.2;
		sideBack.filters.push(lightenFilterBack);
		this.sideBack = sideBack;
		this._disposers.push(this.sideBack);

		let sideBottom: Sprite = this.createChild(Sprite);
		sideBottom.shouldClone = false;
		sideBottom.setElement(this.paper.add("path"));
		sideBottom.isMeasured = false;
		let lightenFilterBottom: LightenFilter = new LightenFilter();
		lightenFilterBottom.lightness = -0.5;
		sideBottom.filters.push(lightenFilterBottom);
		this.sideBottom = sideBottom;
		this._disposers.push(this.sideBottom);

		let sideLeft: Sprite = this.createChild(Sprite);
		sideLeft.shouldClone = false;
		sideLeft.setElement(this.paper.add("path"));
		sideLeft.isMeasured = false;
		let lightenFilterLeft: LightenFilter = new LightenFilter();
		lightenFilterLeft.lightness = -0.4;
		sideLeft.filters.push(lightenFilterLeft);
		this.sideLeft = sideLeft;
		this._disposers.push(this.sideLeft);

		let sideRight: Sprite = this.createChild(Sprite);
		sideRight.shouldClone = false;
		sideRight.setElement(this.paper.add("path"));
		sideRight.isMeasured = false;
		let lightenFilterRight: LightenFilter = new LightenFilter();
		lightenFilterRight.lightness = -0.2;
		sideRight.filters.push(lightenFilterRight);
		this.sideRight = sideRight;
		this._disposers.push(this.sideRight);

		let sideTop: Sprite = this.createChild(Sprite);
		sideTop.shouldClone = false;
		sideTop.setElement(this.paper.add("path"));
		sideTop.isMeasured = false;
		let lightenFilterTop: LightenFilter = new LightenFilter();
		lightenFilterTop.lightness = -0.1;
		sideTop.filters.push(lightenFilterTop);
		this.sideTop = sideTop;
		this._disposers.push(this.sideTop);

		let sideFront: Sprite = this.createChild(Sprite);
		sideFront.shouldClone = false;
		sideFront.setElement(this.paper.add("path"));
		sideFront.isMeasured = false;
		this.sideFront = sideFront;
		this._disposers.push(this.sideFront);

		this.applyTheme();
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		let w: number = this.innerWidth;
		let h: number = this.innerHeight;

		let depth: number = this.depth;
		let angle: number = this.angle;
		let sin: number = $math.sin(angle);
		let cos: number = $math.cos(angle);

		let a: IPoint = { x: 0, y: 0 };
		let b: IPoint = { x: w, y: 0 };
		let c: IPoint = { x: w, y: h };
		let d: IPoint = { x: 0, y: h };

		let ah: IPoint = { x: depth * cos, y: -depth * sin };
		let bh: IPoint = { x: depth * cos + w, y: -depth * sin };
		let ch: IPoint = { x: depth * cos + w, y: -depth * sin + h };
		let dh: IPoint = { x: depth * cos, y: -depth * sin + h };

		this.sideFront.path = $path.moveTo(a) + $path.lineTo(b) + $path.lineTo(c) + $path.lineTo(d) + $path.closePath();
		this.sideBack.path = $path.moveTo(ah) + $path.lineTo(bh) + $path.lineTo(ch) + $path.lineTo(dh) + $path.closePath();
		this.sideLeft.path = $path.moveTo(a) + $path.lineTo(ah) + $path.lineTo(dh) + $path.lineTo(d) + $path.closePath();
		this.sideRight.path = $path.moveTo(b) + $path.lineTo(bh) + $path.lineTo(ch) + $path.lineTo(c) + $path.closePath();
		this.sideBottom.path = $path.moveTo(d) + $path.lineTo(dh) + $path.lineTo(ch) + $path.lineTo(c) + $path.closePath();
		this.sideTop.path = $path.moveTo(a) + $path.lineTo(ah) + $path.lineTo(bh) + $path.lineTo(b) + $path.closePath();
	}

	/**
	 * Depth (Z dimension) of the 3D rectangle in pixels.
	 *
	 * @default 30
	 * @param value  Depth (px)
	 */
	public set depth(value: number) {
		this.setPropertyValue("depth", value, true);
	}

	/**
	 * @return Depth (px)
	 */
	public get depth(): number {
		return this.getPropertyValue("depth");
	}

	/**
	 * Angle of the point of view to the 3D element. (0-360)
	 *
	 * @default 30
	 * @param value  Angle
	 */
	public set angle(value: number) {
		this.setPropertyValue("angle", value, true);
	}

	/**
	 * @return Angle
	 */
	public get angle(): number {
		return this.getPropertyValue("angle");
	}

}
