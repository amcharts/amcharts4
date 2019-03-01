/**
 * Cone module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../Container";
import { Sprite, visualProperties } from "../../Sprite";
import { Ellipse } from "../../elements/Ellipse";
import { LinearGradientModifier } from "../../rendering/fills/LinearGradientModifier";
import { percent, Percent } from "../../utils/Percent";
import * as $object from "../../utils/Object";
import * as $path from "../../rendering/Path";
import { Orientation } from "../../defs/Orientation";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Cone]].
 */
export interface IConeProperties extends IContainerProperties {

	/**
	 * Angle of the point of view to the 3D element. (0-360)
	 *
	 * @default 30
	 */
	angle?: number;

	/**
	 * A relative radius of the cone's bottom (base).
	 *
	 * It is relevant to the inner width or height of the element.
	 *
	 * @default Percent(100)
	 */
	radius?: Percent;

	/**
	 * A relative radius of the cone's top (tip).
	 *
	 * It is relevant to the inner width or height of the element.
	 *
	 * @default Percent(0)
	 */
	topRadius?: Percent;

	/**
	 * Orientation of the cone
	 *
	 * @default "vertical"
	 */
	orientation?: Orientation;

}

/**
 * Defines events for [[Cone]].
 */
export interface IConeEvents extends IContainerEvents { }

/**
 * Defines adapters for [[Cone]].
 *
 * @see {@link Adapter}
 */
export interface IConeAdapters extends IContainerAdapters, IConeProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Builds a round cone/cylinder.
 *
 * @see {@link IConeEvents} for a list of available events
 * @see {@link IConeAdapters} for a list of available Adapters
 */
export class Cone extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IConeProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IConeAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IConeEvents;

	/**
	 * Bottom ellement.
	 *
	 * @ignore Exclude from docs
	 */
	public bottom: Ellipse;

	/**
	 * Top element.
	 *
	 * @ignore Exclude from docs
	 */
	public top: Ellipse;

	/**
	 * Body element.
	 *
	 * @ignore Exclude from docs
	 */
	public body: Sprite;

	/**
	 * Gradient for the fill of the body.
	 */
	public bodyFillModifier: LinearGradientModifier;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Cone";

		this.angle = 30;
		this.radius = percent(100);
		this.topRadius = percent(100);

		this.top = this.createChild(Ellipse);
		this.top.shouldClone = false;

		this.bottom = this.createChild(Ellipse);
		this.bottom.shouldClone = false;

		this.body = this.createChild(Sprite);
		this.body.shouldClone = false;

		this.body.setElement(this.paper.add("path"));
		this.layout = "none";

		this.bodyFillModifier = new LinearGradientModifier();
		this.bodyFillModifier.lightnesses = [0, -0.25, 0];
		this.body.fillModifier = this.bodyFillModifier;

		this.applyTheme();
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		$object.copyProperties(this, this.top, visualProperties);
		$object.copyProperties(this, this.bottom, visualProperties);
		$object.copyProperties(this, this.body, visualProperties);

		let w: number = this.innerWidth;
		let h: number = this.innerHeight;

		let bottom: Ellipse = this.bottom;
		let top: Ellipse = this.top;

		let angle: number = this.angle;
		let radiusBase: number;
		let dx: number;
		let dy: number;

		if (this.orientation == "horizontal") {
			radiusBase = h / 2;
			bottom.y = h / 2;
			top.y = h / 2;
			top.x = w;
			dx = (90 - angle) / 90;
			dy = 0;
			this.bodyFillModifier.gradient.rotation = 90;
		}
		else {
			dx = 0;
			dy = (90 - angle) / 90;

			radiusBase = w / 2;
			bottom.y = h;
			bottom.x = w / 2;
			top.x = w / 2;
			this.bodyFillModifier.gradient.rotation = 0;
		}

		let radius: number = this.radius.value * radiusBase;
		let topRadius: number = this.topRadius.value * radiusBase;

		bottom.radius = radius - radius * dx;
		bottom.radiusY = radius - radius * dy;

		top.radius = topRadius - topRadius * dx;
		top.radiusY = topRadius - topRadius * dy;

		let path: string;
		if (this.orientation == "horizontal") {
			path = $path.moveTo({ x: 0, y: h / 2 - bottom.radiusY }) + $path.arcTo(-90, -180, bottom.radius, bottom.radiusY) + $path.lineTo({ x: w, y: h / 2 + top.radiusY }) + $path.arcTo(90, 180, top.radius, top.radiusY) + $path.closePath();
		}
		else {
			path = $path.moveTo({ x: w / 2 - top.radius, y: 0 }) + $path.arcTo(180, -180, top.radius, top.radiusY) + $path.lineTo({ x: w / 2 + bottom.radius, y: h }) + $path.arcTo(0, 180, bottom.radius, bottom.radiusY) + $path.closePath();
		}

		this.body.path = path;
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

	/**
	 * A relative radius of the cone's bottom (base).
	 *
	 * It is relevant to the inner width or height of the element.
	 *
	 * @default Percent(100)
	 * @param value  Bottom radius
	 */
	public set radius(value: Percent) {
		this.setPropertyValue("radius", value, true);
	}

	/**
	 * @return Bottom radius
	 */
	public get radius(): Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * A relative radius of the cone's top (tip).
	 *
	 * It is relevant to the inner width or height of the element.
	 *
	 * @default Percent(0)
	 * @param value  Top radius
	 */
	public set topRadius(value: Percent) {
		this.setPropertyValue("topRadius", value, true);
	}

	/**
	 * @return Top radius
	 */
	public get topRadius(): Percent {
		return this.getPropertyValue("topRadius");
	}

	/**
	 * Orientation of the cone
	 *
	 * @default "vertical"
	 * @param value  Orientation
	 */
	public set orientation(value: Orientation) {
		this.setPropertyValue("orientation", value, true);
	}

	/**
	 * Orientation
	 */
	public get orientation(): Orientation {
		return this.getPropertyValue("orientation");
	}

}
