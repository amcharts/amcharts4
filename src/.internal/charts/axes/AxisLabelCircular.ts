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
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import * as $path from "../../core/rendering/Path";
import * as $utils from "../../core/utils/Utils";
import { Percent } from "../../core/utils/Percent";

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
	 */
	relativeRotation?: number;

	/**
	 * Distance of the label from circle line.
	 */
	radius?: number;

	/**
	 * Specifies if label should be bent along the circle
	 *
	 * @type {boolean}
	 */
	bent?: boolean;
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
	 */
	public _properties!: IAxisLabelCircularProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisLabelCircularAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisLabelCircularEvents;

	/**
	 * Related data item.
	 */
	public _dataItem: any;

	/**
	 *
	 * @ignore
	 */
	public fdx: number = 0;

	/**
	 *
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
	 * of light, if 0 - positioned along the circle.
	 *
	 * @param value Rotation angle
	 */
	public set relativeRotation(value: number) {
		this.setPropertyValue("relativeRotation", value, true);
		if (!$type.hasValue(value)) {
			this.rotation = undefined;

			let dataItem = this.dataItem;
			if (dataItem && dataItem.component) {
				dataItem.component.invalidateDataItems();
			}
		}
	}

	/**
	 * @return Rotation angle
	 */
	public get relativeRotation(): number {
		return this.getPropertyValue("relativeRotation");
	}

	/**
	 * Distance from axis circle to label in pixels or percent.
	 *
	 * @param value Distance (px or percent)
	 */
	public set radius(value: number | Percent) {
		this.setPercentProperty("radius", value, true, false, 10, false);
	}

	/**
	 * @return Distance (px)
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * Specifies if label should be bent along the circle.
	 *
	 * IMPORTANT: Use this with caution, since it is quite CPU-greedy.
	 *
	 * @since 4.1.2
	 * @default false
	 * @param  value  Bent?
	 */
	public set bent(value: boolean) {
		this.setPropertyValue("bent", value, true);
		this.setPropertyValue("wrap", false);
		this.setPropertyValue("horizontalCenter", "none");
		this.setPropertyValue("verticalCenter", "none");
		if (value) {
			this.textAlign = "middle";
		}
	}

	/**
	 * @return Bent?
	 */
	public get bent(): boolean {
		return this.getPropertyValue("bent");
	}

	/**
	 * Returns label radius in pixels.
	 * 
	 * @param   axisRadius  Radius
	 * @return              Pixel radius
	 */
	public pixelRadius(axisRadius: number): number {
		let sign: number = 1;
		if (this.inside) {
			sign = -1;
		}

		return $utils.relativeToValue(this.radius, axisRadius) * sign;
	}

	/**
	 * Returns label horizontal radius in pixels.
	 * 
	 * @param   axisRadius   Radius
	 * @param   axisRadiusY  Vertical radius
	 * @return               Radius
	 */
	public pixelRadiusY(axisRadius: number, axisRadiusY: number): number {
		let sign: number = 1;
		if (this.inside) {
			sign = -1;
		}

		let radius = this.radius;

		if ($type.isNumber(radius)) {
			radius *= axisRadiusY / axisRadius;
			return $utils.relativeToValue(radius, axisRadius) * sign;
		}
		else {
			return $utils.relativeToValue(radius, axisRadiusY) * sign;
		}
	}

	/**
	 * [fixPosition description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param point       Label affixation point
	 * @param axisRadius  Distance from point (px)
	 */
	public fixPosition(angle: number, axisRadius: number, axisRadiusY?: number, dx?: number, dy?: number) {
		if (!$type.isNumber(axisRadiusY)) {
			axisRadiusY = axisRadius;
		}

		if (!$type.isNumber(dx)) {
			dx = 0;
		}

		if (!$type.isNumber(dy)) {
			dy = 0;
		}

		let point = { x: axisRadius * $math.cos(angle), y: axisRadiusY * $math.sin(angle) };

		if (this.invalid) {
			this.validate();  //@todo" check if we need this
		}

		let isNegative = false;
		let realRadius = this.radius;

		if (realRadius instanceof Percent && realRadius.value < 0) {
			isNegative = true;
		}
		else if (realRadius < 0) {
			isNegative = true;
		}

		let relativeRotation = this.relativeRotation;
		let labelRadius = this.pixelRadius(axisRadius);

		if (this.bent) {
			let point = { x: axisRadius * $math.cos(angle + 180), y: axisRadiusY * $math.sin(angle + 180) };
			this.path = $path.moveTo(point) + $path.arcTo(angle + 180, 360, axisRadius + labelRadius, axisRadiusY + labelRadius * axisRadiusY / axisRadius);
			this.locationOnPath = 0.5;
			return;
		}

		// WHEN ROTATED
		if ($type.isNumber(relativeRotation)) {

			this.horizontalCenter = "none";
			this.verticalCenter = "none";

			angle = $math.fitAngleToRange(angle, -180, 180);

			let pixelWidth = this.bbox.width;
			let pixelHeight = this.bbox.height;

			let pixelPaddingBottom = this.pixelPaddingBottom;
			let pixelPaddingTop = this.pixelPaddingTop;
			let pixelPaddingLeft = this.pixelPaddingLeft;
			let pixelPaddingRight = this.pixelPaddingRight;

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
					pixelWidth = -pixelPaddingLeft - pixelPaddingRight;
					pixelHeight = - pixelHeight - pixelPaddingTop - pixelPaddingBottom;
				}
			}

			this.rotation = relativeRotation + angle + 90;

			let dH = $math.sin(relativeRotation) / 2;
			let dW = $math.cos(relativeRotation) / 2;

			let rotation = this.rotation;

			this.dx = pixelHeight * dH * $math.sin(rotation) - pixelWidth * dW * $math.cos(rotation);
			this.dy = -pixelHeight * dH * $math.cos(rotation) - pixelWidth * dW * $math.sin(rotation);

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

			point.x += $math.cos(angle) * labelRadius;
			point.y += $math.sin(angle) * labelRadius * axisRadiusY / axisRadius;
		}
		else {
			// END OF ROTATED
			this.horizontalCenter = "middle";
			this.verticalCenter = "middle";

			if (isNegative) {
				this.dx = 0;
				this.dy = 0;
				point.x = (axisRadius + labelRadius) * $math.cos(angle);
				point.y = (axisRadiusY + labelRadius * axisRadiusY / axisRadius) * $math.sin(angle);
			}
			else {
				// we don't use valign for labels because then they would jump while animating. instead we modify dy depending on a y position
				// this math makes dy to be 1 at the top of the circle, 0.5 at the middle and 1 at the bottom
				// @todo with this math doesn't work well with inside = true
				this.dy = this._measuredHeight / 2 * $math.sin(angle) //(1 - (point.y + axisRadiusY) / (2 * axisRadiusY));
				// simmilar with dx
				this.dx = this._measuredWidth / 2 * $math.cos(angle) //(1 - (point.x + axisRadius) / (2 * axisRadius));

				point.x += $math.cos(angle) * labelRadius;
				point.y += $math.sin(angle) * labelRadius * axisRadiusY / axisRadius;
			}
		}

		point.x += dx;
		point.y += dy;

		this.fdx = this.dx;
		this.fdy = this.dy;

		this.moveTo(point);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisLabelCircular"] = AxisLabelCircular;
