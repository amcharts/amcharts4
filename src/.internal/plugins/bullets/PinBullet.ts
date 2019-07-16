/**
 * Bullet module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Bullet, IBulletProperties, IBulletAdapters, IBulletEvents } from "../../charts/elements/Bullet";
import { Circle } from "../../core/elements/Circle";
import { PointedCircle } from "./PointedCircle";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import { percent, Percent } from "../../core/utils/Percent";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { Image } from "../../core/elements/Image";
import { Label } from "../../core/elements/Label";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Bullet]]
 */
export interface IPinBulletProperties extends IBulletProperties {

}

/**
 * Defines events for [[Bullet]]
 */
export interface IPinBulletEvents extends IBulletEvents { }

/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IPinBulletAdapters extends IBulletAdapters, IPinBulletProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * 
 * @todo mm
 * Creates a pin bullet which can contain image or label inside.
 * Background of pin bullet is [[PointedCircle]] element, and most of the visual appearance is configured via background property.
 *
 * Uses [[Label]] instance to draw the label, so the label itself is
 * configurable.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export class PinBullet extends Bullet {

	/**
	 * Defines available properties.
	 */
	public _properties!: IPinBulletProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPinBulletAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPinBulletEvents;

	/**
	 * A label (textual) element for the bullet.
	 */
	public circle: Circle;

	/**
	 * A type for the background element.
	 */
	public _background: PointedCircle;

	protected _image: Image;

	protected _label: Label;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "PinBullet";
		let interfaceColors = new InterfaceColorSet();

		let circle = this.createChild(Circle);
		circle.shouldClone = false;
		circle.isMeasured = false;
		circle.fill = interfaceColors.getFor("background");
		circle.radius = percent(85);

		this.circle = circle;
		let background = this.background;
		background.fill = interfaceColors.getFor("alternativeBackground");
		background.fillOpacity = 1;
		background.pointerBaseWidth = 20;
		background.pointerLength = 20;
		background.radius = 25;
		background.events.on("propertychanged", this.invalidate, this, false);

		this.applyTheme();
	}

	/**
	 * Validates element:
	 * * Triggers events
	 * * Redraws the element
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {
		super.validate();
		let background = this.background;

		let px = background.pointerX;
		let py = background.pointerY;
		let pl = background.pointerLength;
		let pw = background.pointerBaseWidth;
		let pa = background.pointerAngle + 180;
		let r = background.radius;

		if (pw > 2 * r) {
			pw = 2 * r;
		}

		let da = $math.DEGREES * Math.atan(pw / 2 / pl);

		if (da <= 0.001) {
			da = 0.001;
		}

		let a1 = pa - da;
		let a2 = pa + da;

		let p1 = { x: px + pl * $math.cos(a1), y: py + pl * $math.sin(a1) };
		let p2 = { x: px + pl * $math.cos(a2), y: py + pl * $math.sin(a2) };

		let x1 = p1.x;
		let x2 = p2.x;

		let y1 = p1.y;
		let y2 = p2.y;

		let radsq = r * r;
		let q = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

		let x3 = (x1 + x2) / 2;
		let cx = x3 - Math.sqrt(radsq - ((q / 2) * (q / 2))) * ((y1 - y2) / q);

		let y3 = (y1 + y2) / 2;
		let cy = y3 - Math.sqrt(radsq - ((q / 2) * (q / 2))) * ((x2 - x1) / q);

		let circleRadius = this.circle.radius;

		if (circleRadius instanceof Percent) {
			this.circle.width = r * 2;
			this.circle.height = r * 2;
		}

		let image = this.image;
		if (image) {
			image.x = cx;
			image.y = cy;
			image.width = r * 2;
			image.height = r * 2;
		}
		else {
			this.circle.x = cx;
			this.circle.y = cy;
		}

		let label = this.label;
		if (label) {
			label.x = cx;
			label.y = cy;
		}
	}

	/**
	 * @todo mm
	 */
	set image(image: Image) {
		if (image) {
			this._image = image;
			this._disposers.push(image);
			image.shouldClone = false;
			image.parent = this;
			image.horizontalCenter = "middle";
			image.verticalCenter = "middle";

			if (this.circle) {
				image.mask = this.circle;
			}
		}
	}

	/**
	 * @todo mm
	 */
	get image(): Image {
		return this._image;
	}

	/**
	 * @todo mm
	 */
	set label(label: Label) {
		if (label) {
			this._label = label;
			this._disposers.push(label);
			label.shouldClone = false;
			label.parent = this;
			label.horizontalCenter = "middle";
			label.verticalCenter = "middle";
			label.textAlign = "middle";
			label.dy = 2;
		}
	}
	
	/**
	 * @todo mm
	 */
	get label(): Label {
		return this._label;
	}


	/**
	 * Copies all proprities and related stuff from another instance of
	 * [[PinBullet]].
	 *
	 * @param source  Source element
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		if (source.image) {
			if (!this._image) {
				this.image = source.image.clone();
			}
			this._image.copyFrom(source.image);
		}
		this.circle.copyFrom(source.circle);
	}

	/**
	 * Creates and returns a background element.
	 *
	 * @ignore Exclude from docs
	 * @return Background
	 */
	public createBackground(): this["_background"] {
		return new PointedCircle();
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PinBullet"] = PinBullet;
