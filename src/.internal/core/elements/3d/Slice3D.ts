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
import { Sprite } from "../../Sprite";
import { IPoint } from "../../defs/IPoint";
import * as $math from "../../utils/Math";
import * as $path from "../../rendering/Path";
import * as $type from "../../utils/Type";
import { Color, color } from "../../utils/Color";
import { RadialGradient } from "../../rendering/fills/RadialGradient";
import { LinearGradient } from "../../rendering/fills/LinearGradient";
import { Pattern } from "../../rendering/fills/Pattern";
import { LightenFilter } from "../../rendering/filters/LightenFilter";

/**
 * Defines properties for [[Slice3D]].
 */
export interface ISlice3DProperties extends ISliceProperties {

	/**
	 * Depth (height) of the 3D slice in pixels.
	 *
	 * @default 20
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
	 */
	public _properties!: ISlice3DProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISlice3DAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISlice3DEvents;

	/**
	 *
	 * @ignore Exclude from docs
	 */
	public edge: Sprite;

	/**
	 * Side element.
	 *
	 * @ignore Exclude from docs
	 */
	public sideA: Sprite;

	/**
	 * Side element.
	 *
	 * @ignore Exclude from docs
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
		let edge = this.createChild(Sprite);
		this.edge = edge;
		edge.shouldClone = false;
		edge.isMeasured = false;
		edge.toBack();

		// Set defaults
		this.angle = 30;
		this.depth = 20;

		// Create side A element
		let sideA = this.createChild(Sprite);
		this.sideA = sideA;
		sideA.shouldClone = false;
		sideA.isMeasured = false;
		//sideA.setElement(this.paper.add("path"));
		//sideA.strokeOpacity = 0;

		// Crate side B element
		let sideB = this.createChild(Sprite);
		this.sideB = sideB;
		sideB.shouldClone = false;
		sideB.isMeasured = false;
		//sideB.setElement(this.paper.add("path"));
		//sideB.strokeOpacity = 0;


		// Apply theme
		this.applyTheme();
	}

	/**
	 * Sets actual `fill` property on the SVG element, including applicable color
	 * modifiers.
	 *
	 * @ignore Exclude from docs
	 * @param value  Fill
	 */
	protected setFill(value: $type.Optional<Color | Pattern | LinearGradient | RadialGradient>): void {
		super.setFill(value);

		let colorStr: string;
		if (value instanceof Color) {
			colorStr = value.hex;
		}
		else if (value instanceof LinearGradient || value instanceof RadialGradient) {
			colorStr = value.stops.getIndex(0).color.hex;
		}
		else {
			let filter = new LightenFilter();
			filter.lightness = -0.25;
			this.edge.filters.push(filter);
			this.sideA.filters.push(filter.clone());
			this.sideB.filters.push(filter.clone());
		}

		if (colorStr) {
			let edgeFill = color(colorStr).lighten(-0.25);

			this.edge.fill = edgeFill;
			this.sideA.fill = edgeFill;
			this.sideB.fill = edgeFill;

			this.edge.stroke = edgeFill;
			this.sideA.stroke = edgeFill;
			this.sideB.stroke = edgeFill;
		}
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		this.cornerRadius = 0;
		this.innerCornerRadius = 0;

		super.draw();

		if (this.arc !== 0 && this.radius > 0 && this.depth > 0) {
			this.sideB.show(0);
			this.sideA.show(0);
			this.edge.show(0);

			let startAngle = this.startAngle;
			let arc = this.arc;
			let innerRadius = this.pixelInnerRadius || 0;
			let radiusY = this.radiusY || 0;

			//let cornerRadius = this.cornerRadius || 0;
			//let innerCornerRadius = this.innerCornerRadius;
			let radius = this.radius;

			// this is code duplicate with $path.arc. @todo to think how to avoid it

			let endAngle = startAngle + arc;
			//let crSin = $math.sin($math.min(arc, 45) / 2);

			//innerCornerRadius = innerCornerRadius || cornerRadius;

			let innerRadiusY = (radiusY / radius) * innerRadius;
			//let cornerRadiusY = (radiusY / radius) * cornerRadius;
			//let innerCornerRadiusY = (radiusY / radius) * innerCornerRadius;

			//cornerRadius = $math.fitToRange(cornerRadius, 0, (radius - innerRadius) / 2);
			//cornerRadiusY = $math.fitToRange(cornerRadiusY, 0, (radiusY - innerRadiusY) / 2);

			//innerCornerRadius = $math.fitToRange(innerCornerRadius, 0, (radius - innerRadius) / 2);
			//innerCornerRadiusY = $math.fitToRange(innerCornerRadiusY, 0, (radiusY - innerRadiusY) / 2);

			//cornerRadius = $math.fitToRange(cornerRadius, 0, radius * crSin);
			//cornerRadiusY = $math.fitToRange(cornerRadiusY, 0, radiusY * crSin);

			//innerCornerRadius = $math.fitToRange(innerCornerRadius, 0, innerRadius * crSin);
			//innerCornerRadiusY = $math.fitToRange(innerCornerRadiusY, 0, innerRadiusY * crSin);

			//let crAngle: number = Math.asin(cornerRadius / radius / 2) * $math.DEGREES * 2;
			//let crAngleY: number = Math.asin(cornerRadiusY / radiusY / 2) * $math.DEGREES * 2;

			//if (innerRadius < innerCornerRadius) {
			//	innerRadius = innerCornerRadius;
			//}

			//if (innerRadiusY < innerCornerRadiusY) {
			//	innerRadiusY = innerCornerRadiusY;
			//}

			//let crInnerAngle: number = Math.asin(innerCornerRadius / innerRadius / 2) * $math.DEGREES * 2;
			//let crInnerAngleY: number = Math.asin(innerCornerRadiusY / innerRadiusY / 2) * $math.DEGREES * 2;

			//if (!$type.isNumber(crInnerAngle)) {
			//	crInnerAngle = 0;
			//}
			//if (!$type.isNumber(crInnerAngleY)) {
			//	crInnerAngleY = 0;
			//}

			//let middleAngle = startAngle + arc / 2;
			//let mPoint = { x: $math.round($math.cos(middleAngle) * innerRadius, 4), y: $math.round($math.sin(middleAngle) * innerRadiusY, 4) };

			let a0 = { x: $math.cos(startAngle) * (innerRadius), y: $math.sin(startAngle) * (innerRadiusY) };
			let b0 = { x: $math.cos(startAngle) * (radius), y: $math.sin(startAngle) * (radiusY) };
			let c0 = { x: $math.cos(endAngle) * (radius), y: $math.sin(endAngle) * (radiusY) };
			let d0 = { x: $math.cos(endAngle) * (innerRadius), y: $math.sin(endAngle) * (innerRadiusY) };
			// end of duplicate

			let h: number = this.depth;
			let ah: IPoint = { x: a0.x, y: a0.y - h };
			let bh: IPoint = { x: b0.x, y: b0.y - h };
			let ch: IPoint = { x: c0.x, y: c0.y - h };
			let dh: IPoint = { x: d0.x, y: d0.y - h };

			let edgePath = "";
			let count = Math.ceil(arc / 5);
			let step = arc / count;
			let mangle = startAngle;

			let prevPoint = bh;


			for (let i = 0; i < count; i++) {
				mangle += step;
				if (mangle > 0 && mangle < 180) {
					edgePath += $path.moveTo(prevPoint);
					let pp = { x: $math.cos(mangle) * (radius), y: $math.sin(mangle) * (radiusY) - h };
					edgePath += $path.lineTo({ x: prevPoint.x, y: prevPoint.y + h });
					edgePath += $path.arcToPoint({ x: pp.x, y: pp.y + h }, radius, radiusY, true);
					edgePath += $path.lineTo(pp);
					edgePath += $path.arcToPoint(prevPoint, radius, radiusY);
					edgePath += "z";
					prevPoint = pp;
				}
				else {
					edgePath += $path.moveTo(prevPoint);
					let pp = { x: $math.cos(mangle) * (radius), y: $math.sin(mangle) * (radiusY) - h };
					edgePath += $path.arcToPoint(pp, radius, radiusY, true);
					edgePath += $path.lineTo({ x: pp.x, y: pp.y + h });
					edgePath += $path.arcToPoint({ x: prevPoint.x, y: prevPoint.y + h }, radius, radiusY);
					edgePath += $path.lineTo(prevPoint);
					edgePath += "z";
					prevPoint = pp;
				}
			}

			prevPoint = ah;
			mangle = startAngle;


			for (let i = 0; i < count; i++) {
				mangle += step;
				if (mangle > 0 && mangle < 180) {
					edgePath += $path.moveTo(prevPoint);
					let pp = { x: $math.cos(mangle) * (innerRadius), y: $math.sin(mangle) * (innerRadiusY) - h };
					edgePath += $path.lineTo({ x: prevPoint.x, y: prevPoint.y + h });
					edgePath += $path.arcToPoint({ x: pp.x, y: pp.y + h }, innerRadius, innerRadiusY, true);
					edgePath += $path.lineTo(pp);
					edgePath += $path.arcToPoint(prevPoint, innerRadius, innerRadiusY);
					edgePath += "z";
					prevPoint = pp;
				}
				else {
					edgePath += $path.moveTo(prevPoint);
					let pp = { x: $math.cos(mangle) * (innerRadius), y: $math.sin(mangle) * (innerRadiusY) - h };
					edgePath += $path.arcToPoint(pp, innerRadius, innerRadiusY, true);
					edgePath += $path.lineTo({ x: pp.x, y: pp.y + h });
					edgePath += $path.arcToPoint({ x: prevPoint.x, y: prevPoint.y + h }, innerRadius, innerRadiusY);
					edgePath += $path.lineTo(prevPoint);
					edgePath += "z";
					prevPoint = pp;
				}
			}

			this.edge.path = edgePath;
/*
			a0 = { x: $math.cos(startAngle) * (innerRadius + innerCornerRadius), y: $math.sin(startAngle) * (innerRadiusY + innerCornerRadiusY) };
			b0 = { x: $math.cos(startAngle) * (radius - cornerRadius), y: $math.sin(startAngle) * (radiusY - cornerRadiusY) };
			c0 = { x: $math.cos(endAngle) * (radius - cornerRadius), y: $math.sin(endAngle) * (radiusY - cornerRadiusY) };
			d0 = { x: $math.cos(endAngle) * (innerRadius + innerCornerRadius), y: $math.sin(endAngle) * (innerRadiusY + innerCornerRadiusY) };
			// end of duplicate

			ah = { x: a0.x, y: a0.y - h };
			bh = { x: b0.x, y: b0.y - h };
			ch = { x: c0.x, y: c0.y - h };
			dh = { x: d0.x, y: d0.y - h };
*/
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

			this.slice.dy = -h;			
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
	 * @param depth  Depth (px)
	 */
	public set depth(depth: number) {
		this.setPropertyValue("depth", depth, true);
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
		let angle: number = this.getPropertyValue("angle");
		if (!$type.isNumber(angle)) {
			angle = 0;
		}
		return angle;
	}

	/**
	 * @return Vertical radius (0-1)
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
	 * @param value Vertical radius (0-1)
	 */
	public set radiusY(value: number) {
		this.setPropertyValue("radiusY", value, true);
	}

	/**
	 * Copies all properties and related data from a different instance of Axis.
	 *
	 * @param source Source Axis
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.edge.copyFrom(source.edge);
		this.sideA.copyFrom(source.sideA);
		this.sideB.copyFrom(source.sideB);
	}

}
