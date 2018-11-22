/**
 * 3D slice module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Slice, ISliceProperties, ISliceAdapters, ISliceEvents } from "../Slice";
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../Sprite";
import { Container } from "../../Container";
import { IPoint } from "../../defs/IPoint";
import { LightenFilter } from "../../rendering/filters/LightenFilter";
import * as $math from "../../utils/Math";
import * as $path from "../../rendering/Path";
import * as $type from "../../utils/Type";

/**
 * Defines properties for [[Slice3D]].
 */
export interface ISlice3DProperties extends ISliceProperties {

	/**
	 * Depth (height) of the 3D slice in pixels.
	 *
	 * @default 20
	 * @type {number}
	 */
	depth?: number;

	/**
	 * Angle of the point of view to the 3D element. (0-360)
	 *
	 * @default 30
	 * @type {number}
	 */
	angle?: number;

}

/**
 * Defines events for [[Slice3D]].
 */
export interface ISlice3DEvents extends ISliceEvents { }

/**
 * Defines adapters for [[Slice3D]].
 *
 * @see {@link Adapter}
 */
export interface ISlice3DAdapters extends ISliceAdapters, ISlice3DProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to draw a 3D slice of a Pie chart.
 *
 * @see {@link ISlice3DEvents} for a list of available events
 * @see {@link ISlice3DAdapters} for a list of available Adapters
 */
export class Slice3D extends Slice {

	/**
	 * Defines available properties.
	 *
	 * @type {ISlice3DProperties}
	 */
	public _properties!: ISlice3DProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {ISlice3DAdapters}
	 */
	public _adapter!: ISlice3DAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {ISlice3DEvents}
	 */
	public _events!: ISlice3DEvents;

	/**
	 * Container element for elements of the 3D sides.
	 *
	 * @ignore Exclude from docs
	 * @type {Container}
	 */
	public edge: Container;

	/**
	 * Side element.
	 *
	 * @ignore Exclude from docs
	 * @type {Sprite}
	 */
	public sideA: Sprite;

	/**
	 * Side element.
	 *
	 * @ignore Exclude from docs
	 * @type {Sprite}
	 */
	public sideB: Sprite;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Slice3D";
		this.layout = "none";

		// Create edge container
		let edge = this.createChild(Container);
		this.edge = edge;
		edge.shouldClone = false;
		edge.isMeasured = false;

		let lightenFilter: LightenFilter = new LightenFilter();
		lightenFilter.lightness = -0.25;
		edge.filters.push(lightenFilter);
		edge.toBack();
		//edge.strokeOpacity = 0;
		this._disposers.push(edge);

		// Set defaults
		this.angle = 30;
		this.depth = 20;

		// Create side A element
		let sideA = this.createChild(Sprite);
		this.sideA = sideA;
		sideA.shouldClone = false;
		sideA.isMeasured = false;
		sideA.setElement(this.paper.add("path"));
		let lightenFilterA: LightenFilter = new LightenFilter();
		lightenFilterA.lightness = -0.25;
		sideA.filters.push(lightenFilterA);
		//sideA.strokeOpacity = 0;
		this._disposers.push(sideA);

		// Crate side B element
		let sideB = this.createChild(Sprite);
		this.sideB = sideB;
		sideB.shouldClone = false;
		sideB.isMeasured = false;
		sideB.setElement(this.paper.add("path"));
		let lightenFilterB: LightenFilter = new LightenFilter();
		lightenFilterB.lightness = -0.25;
		sideB.filters.push(lightenFilterB);
		this._disposers.push(sideB);
		//sideB.strokeOpacity = 0;


		// Apply theme
		this.applyTheme();

	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		// this should go here to hide 3d slices if arc = 0
		for (let i = 0, len = this.edge.children.length; i < len; i++) {
			let slice = this.edge.children.getIndex(i);
			if (slice instanceof Slice) {
				slice.radiusY = this.radiusY;
				slice.radius = this.radius;
				slice.fill = this.fill;
				slice.startAngle = this.startAngle;
				slice.arc = this.arc;
				slice.cornerRadius = this.cornerRadius;
				slice.innerRadius = this.innerRadius;
				slice.strokeOpacity = 0;
			}
		}

		if (this.arc !== 0 && this.radius > 0 && this.depth > 0) {
			this.sideB.show(0);
			this.sideA.show(0);
			this.edge.show(0);

			let startAngle = this.startAngle;
			let arc = this.arc;
			let innerRadius = this.pixelInnerRadius || 0;
			let radiusY = this.radiusY || 0;
			let cornerRadius = this.cornerRadius || 0;
			let innerCornerRadius = this.innerCornerRadius;
			let radius = this.radius;

			// this is code duplicate with $path.arc. @todo to think how to avoid it

			let endAngle = startAngle + arc;
			let crSin = $math.sin($math.min(arc, 45) / 2);

			innerCornerRadius = innerCornerRadius || cornerRadius;

			let innerRadiusY = (radiusY / radius) * innerRadius;
			let cornerRadiusY = (radiusY / radius) * cornerRadius;
			let innerCornerRadiusY = (radiusY / radius) * innerCornerRadius;

			cornerRadius = $math.fitToRange(cornerRadius, 0, (radius - innerRadius) / 2);
			cornerRadiusY = $math.fitToRange(cornerRadiusY, 0, (radiusY - innerRadiusY) / 2);

			innerCornerRadius = $math.fitToRange(innerCornerRadius, 0, (radius - innerRadius) / 2);
			innerCornerRadiusY = $math.fitToRange(innerCornerRadiusY, 0, (radiusY - innerRadiusY) / 2);

			cornerRadius = $math.fitToRange(cornerRadius, 0, radius * crSin);
			cornerRadiusY = $math.fitToRange(cornerRadiusY, 0, radiusY * crSin);

			innerCornerRadius = $math.fitToRange(innerCornerRadius, 0, innerRadius * crSin);
			innerCornerRadiusY = $math.fitToRange(innerCornerRadiusY, 0, innerRadiusY * crSin);

			//let crAngle: number = Math.asin(cornerRadius / radius / 2) * $math.DEGREES * 2;
			//let crAngleY: number = Math.asin(cornerRadiusY / radiusY / 2) * $math.DEGREES * 2;

			if (innerRadius < innerCornerRadius) {
				innerRadius = innerCornerRadius;
			}

			if (innerRadiusY < innerCornerRadiusY) {
				innerRadiusY = innerCornerRadiusY;
			}

			let crInnerAngle: number = Math.asin(innerCornerRadius / innerRadius / 2) * $math.DEGREES * 2;
			let crInnerAngleY: number = Math.asin(innerCornerRadiusY / innerRadiusY / 2) * $math.DEGREES * 2;

			if (!$type.isNumber(crInnerAngle)) {
				crInnerAngle = 0;
			}
			if (!$type.isNumber(crInnerAngleY)) {
				crInnerAngleY = 0;
			}

			//let middleAngle = startAngle + arc / 2;
			//let mPoint = { x: $math.round($math.cos(middleAngle) * innerRadius, 4), y: $math.round($math.sin(middleAngle) * innerRadiusY, 4) };

			let a0 = { x: $math.round($math.cos(startAngle) * (innerRadius + innerCornerRadius), 4), y: $math.round($math.sin(startAngle) * (innerRadiusY + innerCornerRadiusY), 4) };
			let b0 = { x: $math.round($math.cos(startAngle) * (radius - cornerRadius), 4), y: $math.round($math.sin(startAngle) * (radiusY - cornerRadiusY), 4) };
			let c0 = { x: $math.round($math.cos(endAngle) * (radius - cornerRadius), 4), y: $math.round($math.sin(endAngle) * (radiusY - cornerRadiusY), 4) };
			let d0 = { x: $math.round($math.cos(endAngle) * (innerRadius + innerCornerRadius), 4), y: $math.round($math.sin(endAngle) * (innerRadiusY + innerCornerRadiusY), 4) };
			// end of duplicate

			let h: number = this.depth;
			let ah: IPoint = { x: a0.x, y: a0.y - h };
			let bh: IPoint = { x: b0.x, y: b0.y - h };
			let ch: IPoint = { x: c0.x, y: c0.y - h };
			let dh: IPoint = { x: d0.x, y: d0.y - h };

			this.sideA.path = $path.moveTo(a0) + $path.lineTo(b0) + $path.lineTo(bh) + $path.lineTo(ah) + $path.closePath();
			this.sideB.path = $path.moveTo(c0) + $path.lineTo(d0) + $path.lineTo(dh) + $path.lineTo(ch) + $path.closePath();

			if (this.startAngle < 90) {
				this.sideA.toBack();
			}
			else {
				this.sideA.toFront();
			}

			if (this.startAngle + this.arc > 90) {
				this.sideB.toBack();
			}
			else {
				this.sideB.toFront();
			}
		}
		else {
			this.sideA.hide(0);
			this.sideB.hide(0);
			this.edge.hide(0);
		}
	}

	/**
	 * Depth (height) of the 3D slice in pixels.
	 *
	 * @default 20
	 * @param {number}  depth  Depth (px)
	 */
	public set depth(depth: number) {
		if (this.setPropertyValue("depth", depth, true)) {
			this.edge.removeChildren();

			let d = 3;

			if (depth > 0) {
				let count: number = Math.ceil(this.depth / d);
				let step: number = depth / count;
				for (let i = 0; i <= count; i++) {
					let slice: Slice = this.edge.createChild(Slice);
					slice.isMeasured = false;
					slice.y = -step * i;
				}
			}
			this.slice.dy = -this.depth;
		}
	}

	/**
	 * @return {number} Depth (px)
	 */
	public get depth(): number {
		return this.getPropertyValue("depth");
	}

	/**
	 * Angle of the point of view to the 3D element. (0-360)
	 *
	 * @default 30
	 * @param {number}  value  Angle
	 */
	public set angle(value: number) {
		this.setPropertyValue("angle", value, true);
	}

	/**
	 * @return {number} Angle
	 */
	public get angle(): number {
		let angle: number = this.getPropertyValue("angle");
		if (!$type.isNumber(angle)) {
			angle = 0;
		}
		return angle;
	}

	/**
	 * @return {number} Vertical radius (0-1)
	 */
	public get radiusY(): number {
		let radiusY: number = this.getPropertyValue("radiusY");
		if (!$type.isNumber(radiusY)) {
			radiusY = this.radius - this.radius * this.angle / 90;
		}
		return radiusY;
	}

	/**
	 * Vertical radius for creating skewed slices.
	 *
	 * This is relevant to `radius`, e.g. 0.5 will set vertical radius to half
	 * the `radius`.
	 *
	 * @param {number} value Vertical radius (0-1)
	 */
	public set radiusY(value: number) {
		this.setPropertyValue("radiusY", value, true);
	}

	/**
	 * Copies all properties and related data from a different instance of Axis.
	 *
	 * @param {this} source Source Axis
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.edge.copyFrom(source.edge);
		this.sideA.copyFrom(source.sideA);
		this.sideB.copyFrom(source.sideB);
	}			

}
