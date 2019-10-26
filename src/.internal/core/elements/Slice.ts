/**
 * Slice module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../Container";
import { Sprite } from "../Sprite";
import { registry } from "../Registry";
import * as $math from "../utils/Math";
import * as $path from "../rendering/Path";
import * as $type from "../utils/Type";
import * as $utils from "../utils/Utils";
import { Percent } from "../utils/Percent";
import { IRectangle } from "../defs/IRectangle";
import { RadialGradient } from "../rendering/fills/RadialGradient";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Slice]].
 */
export interface ISliceProperties extends IContainerProperties {

	/**
	 * Radius of the slice in pixels.
	 */
	radius?: number;

	/**
	 * Vertical radius for creating skewed slices.
	 *
	 * This is relevant to `radius`, e.g. 0.5 will set vertical radius to half
	 * the `radius`.
	 */
	radiusY?: number;

	/**
	 * Inner radius of the slice for creating cut out (donut) slices, in px or %
	 */
	innerRadius?: number | Percent;

	/**
	 * The angle at which left edge of the slice is drawn. (0-360)
	 *
	 * 0 is to the right of the center.
	 */
	startAngle?: number;

	/**
	 * [arc description]
	 *
	 * @todo Description
	 */
	arc?: number;

	/**
	 * [shiftRadius description]
	 *
	 * @todo Description
	 */
	shiftRadius?: number;

	/**
	 * Radius of slice's outer corners in pixels.
	 *
	 * @default 0
	 */
	cornerRadius?: number;

	/**
	 * Radius of slice's inner corners in pixels.
	 *
	 * @default 0
	 */
	innerCornerRadius?: number;

}

/**
 * Defines events for [[Slice]].
 */
export interface ISliceEvents extends IContainerEvents { }

/**
 * Defines adapters for [[Slice]].
 *
 * @see {@link Adapter}
 */
export interface ISliceAdapters extends IContainerAdapters, ISliceProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a wedged semi-circle - slice. Usually used for Pie/Donut charts.
 *
 * @see {@link ISliceEvents} for a list of available events
 * @see {@link ISliceAdapters} for a list of available Adapters
 */
export class Slice extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: ISliceProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISliceAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISliceEvents;

	/**
	 * Main slice element.
	 *
	 * Slice itself is a [[Container]] so that [[Slice3D]] could extend it and
	 * add 3D elements to it.
	 */
	public slice: Sprite;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Slice";

		// Set defaults
		this.setPropertyValue("cornerRadius", 0);
		this.setPropertyValue("startAngle", 0);
		this.setPercentProperty("innerRadius", 0);
		this.setPercentProperty("radius", 0);
		this.setPropertyValue("arc", 0);
		this.setPropertyValue("shiftRadius", 0);
		this.strokeOpacity = 1;
		this.setPropertyValue("layout", "none");

		// Create a slice wedge element
		this.slice = this.createChild(Sprite);
		this.slice.isMeasured = false;

		this._disposers.push(this.slice);

		//this.element.attr({ "stroke-linejoin": "round" });
		//this.element.attr({ "stroke-linecap": "round" });

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
		let radiusY = this.radiusY;
		if(this.radius > 0 && radiusY == 0){
			radiusY = 0.01;
		}
		this.slice.path = $path.arc(this.startAngle, this.arc, this.radius, this.pixelInnerRadius, radiusY, this.cornerRadius, this.innerCornerRadius);
		this.slice.invalidate();
		this.shiftRadius = this.shiftRadius;

		if (this.realFill instanceof RadialGradient) {
			this.updateGradient(this.realFill);
		}
		if (this.realStroke instanceof RadialGradient) {
			this.updateGradient(this.realStroke);
		}
	}

	protected updateGradient(gradient: RadialGradient) {
		gradient.element.attr({ "gradientUnits": "userSpaceOnUse" });
		gradient.element.attr({ "r": this.radius });
		gradient.cx = 0;
		gradient.cy = 0;
		gradient.element.attr({ radius: this.radius });
	}



	/**
	 * Returns bounding box (square) for this element.
	 *
	 * @ignore Exclude from docs
	 */
	public get bbox(): IRectangle {
		if (this.definedBBox) {
			return this.definedBBox;
		}

		if (this.isMeasured) {
			let innerRect = $math.getArcRect(this.startAngle, this.startAngle + this.arc, this.pixelInnerRadius);
			let outerRect = $math.getArcRect(this.startAngle, this.startAngle + this.arc, this.radius);
			return $math.getCommonRectangle([innerRect, outerRect]);
		}
		else {
			return { x: 0, y: 0, width: 0, height: 0 };
		}
	}

	/**
	 * The angle at which left edge of the slice is drawn. (0-360)
	 *
	 * 0 is to the right of the center.
	 *
	 * @param value  Angle (0-360)
	 */
	public set startAngle(value: number) {
		this.setPropertyValue("startAngle", $math.normalizeAngle(value), true);
	}

	/**
	 * @return Angle (0-360)
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

	/**
	 * [arc description]
	 *
	 * @todo Description
	 * @param value [description]
	 */
	public set arc(value: number) {
		if (!$type.isNumber(value)) {
			value = 0;
		}
		this.setPropertyValue("arc", value, true);
	}

	/**
	 * @return [description]
	 */
	public get arc(): number {
		return this.getPropertyValue("arc");
	}

	/**
	 * Radius of the slice in pixels.
	 *
	 * @param value  Radius (px)
	 */
	public set radius(value: number) {
		this.setPropertyValue("radius", value, true);
	}

	/**
	 * @return Radius (px)
	 */
	public get radius(): number {
		let radius: number = this.getPropertyValue("radius");
		if (!$type.isNumber(radius)) {
			radius = 0;
		}
		return radius;
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
	 * @return Vertical radius (0-1)
	 */
	public get radiusY(): number {
		let value: number = this.getPropertyValue("radiusY");

		if (!$type.isNumber(value)) {
			value = this.radius;
		}
		return value;
	}

	/**
	 * Inner radius of the slice for creating cut out (donut) slices.
	 *
	 * @default 0
	 * @param value  Radius (px or %)
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, true, false, 10, false);
	}

	/**
	 * @return Radius (px or %)
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * @return Radius px
	 */
	public get pixelInnerRadius(): number {
		return $utils.relativeToValue(this.innerRadius, this.radius);
	}

	/**
	 * Radius of slice's outer corners in pixels.
	 *
	 * @default 0
	 * @param value  Radius (px)
	 */
	public set cornerRadius(value: number) {
		this.setPropertyValue("cornerRadius", value, true);
	}

	/**
	 * @return Radius (px)
	 */
	public get cornerRadius(): number {
		return this.getPropertyValue("cornerRadius");
	}

	/**
	 * Radius of slice's inner corners in pixels.
	 *
	 * @default 0
	 * @param value  Radius (px)
	 */
	public set innerCornerRadius(value: number) {
		this.setPropertyValue("innerCornerRadius", value, true);
	}

	/**
	 * @return Radius (px)
	 */
	public get innerCornerRadius(): number {
		return this.getPropertyValue("innerCornerRadius");
	}

	/**
	 * Indicates how far (relatively to center) a slice should be moved.
	 *
	 * The value is relative to the radius of the slice. Meaning 0 no shift,
	 * 1 - slice shifted outside by whole of its radius.
	 *
	 * @param  value  Radius shift
	 */
	public set shiftRadius(value: number) {
		this.setPropertyValue("shiftRadius", value);
		this.dx = value * this.radius * this.ix;
		this.dy = value * this.radiusY * this.iy;
	}

	/**
	 * @return Radius shift
	 */
	public get shiftRadius(): number {
		return this.getPropertyValue("shiftRadius");
	}

	/**
	 * [ix description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @return [description]
	 */
	public get ix(): number {
		return $math.cos(this.middleAngle);
	}

	/**
	 * [iy description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @return [description]
	 */
	public get iy(): number {
		if (this.radius > 0) {
			return $math.sin(this.middleAngle);
		}
		else {
			return $math.sin(this.middleAngle);
		}
	}

	/**
	 * An angle of the slice's middle.
	 *
	 * @ignore Exclude from docs
	 * @return Angle
	 */
	public get middleAngle(): number {
		return this.startAngle + this.arc / 2;
	}

	/**
	 * X coordinate for the slice tooltip.
	 *
	 * @return X
	 */
	public getTooltipX(): number {
		let value = this.getPropertyValue("tooltipX");

		if($type.isNumber(value)){
			return value;
		}
		let p = 0.5;
		if(value instanceof Percent){
			p = value.value;
		}
		let innerRadius = $utils.relativeToValue(this.innerRadius, this.radius);
		return this.ix * (innerRadius + (this.radius - innerRadius) * p);
	}

	/**
	 * Y coordinate for the slice tooltip.
	 *
	 * @return Y
	 */
	public getTooltipY(): number {
		let value = this.getPropertyValue("tooltipY");

		if($type.isNumber(value)){
			return value;
		}
		let p = 0.5;
		if(value instanceof Percent){
			p = value.value;
		}
		let innerRadius = $utils.relativeToValue(this.innerRadius, this.radius);
		return this.iy * (innerRadius + (this.radius - innerRadius) * p) + this.slice.dy;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Slice"] = Slice;
