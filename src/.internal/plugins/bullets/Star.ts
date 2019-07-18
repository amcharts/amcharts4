/**
 * Functionality for drawing Stars.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../../core/Sprite";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";
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
 * Defines properties for [[Star]].
 */
export interface IStarProperties extends ISpriteProperties {

	/**
	 * Radius of the star in pixels.
	 *
	 * @default 100
	 */
	radius?: number;

	/**
	 * Vertical radius for creating skewed star.
	 *
	 * This is relevant to `radius`, e.g. 0.5 will set vertical radius to half
	 * the `radius`.
	 */
	radiusY?: number;

	/**
	 * Inner radius of the star, in px or %.
	 */
	innerRadius?: number | Percent;

	/**
	 * The angle at which left edge of the star is drawn. (0-360)
	 *
	 * 0 is to the right of the center.
	 *
	 * @default -90
	 */
	startAngle?: number;

	/**
	 * Radius of stars's outer corners in pixels.
	 *
	 * @default 0
	 */
	cornerRadius?: number;

	/**
	 * Radius of stars's inner corners in pixels.
	 *
	 * @default 0
	 */
	innerCornerRadius?: number;

	/**
	 * How much of a complete circle the star will complete.
	 *
	 * A complete circle is 350 degrees. If set to 180, only half a star will
	 * be drawn
	 *
	 * @default 360
	 */
	arc?: number;

	/**
	 * Number of points (tips).
	 * 
	 * @default 5
	 */
	pointCount?: number;
}

/**
 * Defines events for [[Star]].
 */
export interface IStarEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[Star]].
 *
 * @see {@link Adapter}
 */
export interface IStarAdapters extends ISpriteAdapters, IStarProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to draw a Star shape.
 *
 * @since 4.5.7
 * @see {@link https://www.amcharts.com/docs/v4/tutorials/plugin-bullets/} for usage instructions.
 * @see {@link IStarEvents} for a list of available events
 * @see {@link IStarAdapters} for a list of available Adapters
 */
export class Star extends Sprite {

	/**
	 * Defines available properties.
	 */
	public _properties!: IStarProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IStarAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IStarEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Star";
		this.pointCount = 5;
		this.arc = 360;
		this.radius = 100;
		this.innerRadius = percent(30);
		this.cornerRadius = 0;
		this.innerCornerRadius = 0;
		this.startAngle = -90;

		this.element = this.paper.add("path");
		this.applyTheme();
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();


		let startAngle = this.startAngle;
		let arc = this.arc;
		let pointCount = this.pointCount;
		let radius = this.radius;
		let innerRadius = this.pixelInnerRadius;
		let cornerRadius = this.cornerRadius;

		if (cornerRadius > radius - innerRadius) {
			cornerRadius = radius - innerRadius;
		}

		let innerCornerRadius = this.innerCornerRadius;

		if (innerCornerRadius > radius - cornerRadius - innerRadius) {
			innerCornerRadius = radius - cornerRadius - innerRadius;
		}


		let halfAngle = arc / pointCount / 2;
		let path: string = "";

		for (let i = 0; i < pointCount; i++) {

			let angle = startAngle + i * arc / pointCount;

			if (cornerRadius > 0) {
				let p0 = { x: innerRadius * $math.cos(angle - halfAngle), y: innerRadius * $math.sin(angle - halfAngle) };
				let p1 = { x: radius * $math.cos(angle), y: radius * $math.sin(angle) };
				let p2 = { x: innerRadius * $math.cos(angle + halfAngle), y: innerRadius * $math.sin(angle + halfAngle) };

				let a1 = $math.getAngle(p1, p0);
				let a2 = $math.getAngle(p1, p2);

				let x1 = p1.x + cornerRadius * $math.cos(a1);
				let y1 = p1.y + cornerRadius * $math.sin(a1);

				let x2 = p1.x + cornerRadius * $math.cos(a2);
				let y2 = p1.y + cornerRadius * $math.sin(a2);

				path += $path.lineTo({ x: x1, y: y1 });
				path += " Q" + p1.x + "," + p1.y + " " + x2 + "," + y2;
			}
			else {
				path += $path.lineTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });
			}

			angle += halfAngle;

			if (innerCornerRadius > 0) {
				let p0 = { x: radius * $math.cos(angle - halfAngle), y: radius * $math.sin(angle - halfAngle) };
				let p1 = { x: innerRadius * $math.cos(angle), y: innerRadius * $math.sin(angle) };
				let p2 = { x: radius * $math.cos(angle + halfAngle), y: radius * $math.sin(angle + halfAngle) };

				let a1 = $math.getAngle(p1, p0);
				let a2 = $math.getAngle(p1, p2);

				let x1 = p1.x + innerCornerRadius * $math.cos(a1);
				let y1 = p1.y + innerCornerRadius * $math.sin(a1);

				let x2 = p1.x + innerCornerRadius * $math.cos(a2);
				let y2 = p1.y + innerCornerRadius * $math.sin(a2);

				path += $path.lineTo({ x: x1, y: y1 });
				path += " Q" + p1.x + "," + p1.y + " " + x2 + "," + y2;
			}
			else {
				path += $path.lineTo({ x: innerRadius * $math.cos(angle), y: innerRadius * $math.sin(angle) })
			}
		}

		if (this.arc < 360) {
			path += $path.lineTo({ x: 0, y: 0 })
		}

		path += $path.closePath();

		path = path.replace("L", "M");

		this.path = path;
	}

	/**
	 * The angle at which left edge of the star is drawn. (0-360)
	 *
	 * 0 is to the right of the center.
	 *
	 * @default -90
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
	 * How much of a complete circle the star will complete.
	 *
	 * A complete circle is 350 degrees. If set to 180, only half a star will
	 * be drawn
	 *
	 * @default 360
	 * @param  value  Arc scope
	 */
	public set arc(value: number) {
		if (!$type.isNumber(value)) {
			value = 360;
		}
		this.setPropertyValue("arc", value, true);
	}

	/**
	 * @return Arc scope
	 */
	public get arc(): number {
		return this.getPropertyValue("arc");
	}

	/**
	 * Radius of the star in pixels.
	 *
	 * @default 100
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
	 * Vertical radius for creating skewed star shapes.
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
	 * Inner radius of the star (cutout).
	 *
	 * It can be set either by absolute pixel value or relative to radius in
	 * percent.
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
	 * Radius of star's outer corners in pixels.
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
	 * Radius of star's inner corners in pixels.
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
	 * Number of start points
	 *
	 * @default 5
	 * @param value
	 */
	public set pointCount(value: number) {
		this.setPropertyValue("pointCount", value, true);
	}

	/**
	 * @return Number of star points
	 */
	public get pointCount(): number {
		let value = this.getPropertyValue("pointCount");
		return $math.max(3, value);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Star"] = Star;