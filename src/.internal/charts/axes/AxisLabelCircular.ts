/**
 * Axis Label module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisLabel, IAxisLabelProperties, IAxisLabelAdapters, IAxisLabelEvents } from "./AxisLabel";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { IPoint } from "../../core/defs/IPoint";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import * as $utils from "../../core/utils/Utils";
import { percent, Percent } from "../../core/utils/Percent";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisLabelCircular]].
 */
export interface IAxisLabelCircularProperties extends IAxisLabelProperties {

	/**
	 * Rotation angle of the label in relation to circle line.
	 *
	 * @type {number}
	 */
	relativeRotation?: number;

	/**
	 * Distance of the label from circle line.
	 *
	 * @type {number}
	 */
	radius?: number;

}

/**
 * Defines events for [[AxisLabelCircular]].
 */
export interface IAxisLabelCircularEvents extends IAxisLabelEvents { }

/**
 * Defines adapters for [[AxisLabelCircular]].
 *
 * @see {@link Adapter}
 */
export interface IAxisLabelCircularAdapters extends IAxisLabelAdapters, IAxisLabelCircularProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Use to create labels on circular axis.
 *
 * @see {@link IAxisLabelCircularEvents} for a list of available events
 * @see {@link IAxisLabelCircularAdapters} for a list of available Adapters
 */
export class AxisLabelCircular extends AxisLabel {

	/**
	 * Defines available properties.
	 *
	 * @type {IAxisLabelCircularProperties}
	 */
	public _properties!: IAxisLabelCircularProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IAxisLabelCircularAdapters}
	 */
	public _adapter!: IAxisLabelCircularAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IAxisLabelCircularEvents}
	 */
	public _events!: IAxisLabelCircularEvents;

	/**
	 * Related data item.
	 *
	 * @type {any}
	 */
	public _dataItem: any;

	/**
	 *
	 * @type {number}
	 * @ignore
	 */
	public fdx: number = 0;

	/**
	 *
	 * @type {number}
	 * @ignore
	 */
	public fdy: number = 0;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "AxisLabelCircular";
		this.padding(0, 0, 0, 0);
		this.location = 0.5;
		this.radius = 0;
		this.isMeasured = false;
		this.applyTheme();
	}

	/**
	 * Relative rotation of the label.
	 *
	 * It is an angle to circle. In case 90, labels will be positioned like rays
	 * of light, if 0 - positione along the circle.
	 *
	 * @param {number} value Rotation angle
	 */
	public set relativeRotation(value: number) {
		this.setPropertyValue("relativeRotation", value, true);
	}

	/**
	 * @return {number} Rotation angle
	 */
	public get relativeRotation(): number {
		return this.getPropertyValue("relativeRotation");
	}

	/**
	 * Distance from axis circle to label in pixels or percent.
	 *
	 * @param {number} value Distance (px or percent)
	 */
	public set radius(value: number | Percent) {
		this.setPercentProperty("radius", value, true, false, 10, false);
	}

	/**
	 * @return {number} Distance (px)
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * returns label radius in pixels
	 */
	public pixelRadius(axisRadius: number): number {
		let sign: number = 1;
		if (this.inside) {
			sign = -1;
		}

		return $utils.relativeToValue(this.radius, axisRadius) * sign;
	}

	/**
	 * [fixPoint description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param  {IPoint}  point       Label affixation point
	 * @param  {number}  axisRadius  Distance from point (px)
	 * @return {IPoint}              [description]
	 */
	public fixPoint(point: IPoint, axisRadius: number): IPoint {
		let angle: number = $math.DEGREES * Math.atan2(point.y, point.x);

		if (this.invalid) {
			this.validate();  //@todo" check if we need this
		}

		let relativeRotation = this.relativeRotation;
		// we don't use valign for labels because then they would jump while animating. instead we modify dy depending on a y position
		// this math makes dy to be 1 at the top of the circle, 0.5 at the middle and 1 at the bottom
		// @todo with this math doesn't work well with inside = true
		this.dy = -this._measuredHeight * (1 - (point.y + axisRadius) / (2 * axisRadius));
		// simmilar with dx
		this.dx = -this._measuredWidth * (1 - (point.x + axisRadius) / (2 * axisRadius));

		let labelRadius = this.pixelRadius(axisRadius);

		if ($type.isNumber(relativeRotation)) {

			let pixelWidth = this.bbox.width;
			let pixelHeight = this.bbox.height;

			if (angle > 90 || angle < -90) {
				if (relativeRotation == -90) {
					relativeRotation = 90;
					pixelWidth = 0;
				}
			}
			else {
				if (relativeRotation == -90) {
					pixelHeight = - pixelHeight;
				}
				if (relativeRotation == 90) {
					relativeRotation = -90;
					pixelWidth = 0;
					pixelHeight = - pixelHeight;
				}
			}

			this.rotation = relativeRotation + angle + 90;

			let dH = $math.sin(relativeRotation) / 2;
			let dW = $math.cos(relativeRotation) / 2;

			let rotation = this.rotation;

			this.dx = pixelHeight * dH * $math.sin(rotation) - pixelWidth * dW * $math.cos(rotation);
			this.dy = -pixelHeight * dH * $math.cos(rotation) - pixelWidth * dW * $math.sin(rotation);

			let pixelPaddingBottom = this.pixelPaddingBottom;
			let pixelPaddingTop = this.pixelPaddingTop;
			let pixelPaddingLeft = this.pixelPaddingLeft;
			let pixelPaddingRight = this.pixelPaddingRight;

			if (!this.inside) {
				labelRadius += (pixelHeight + pixelPaddingBottom + pixelPaddingTop) * $math.cos(relativeRotation) + (pixelWidth + pixelPaddingLeft + pixelPaddingRight) * $math.sin(relativeRotation);
			}
			else {
				if (angle > 90 || angle < -90) {
					labelRadius -= (pixelPaddingBottom + pixelPaddingTop) * $math.cos(relativeRotation) + (pixelPaddingLeft + pixelPaddingRight) * $math.sin(relativeRotation);
				}
				else {
					labelRadius += (pixelPaddingBottom + this.bbox.height + pixelPaddingTop) * $math.cos(relativeRotation) + (pixelPaddingLeft + pixelPaddingRight + this.bbox.width) * $math.sin(relativeRotation);
				}
			}
		}

		this.fdx = this.dx;
		this.fdy = this.dy;

		point.x += $math.cos(angle) * labelRadius;
		point.y += $math.sin(angle) * labelRadius;

		return point;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisLabelCircular"] = AxisLabelCircular;
