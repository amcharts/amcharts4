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
 * Defines properties for [[PinBullet]].
 */
export interface IPinBulletProperties extends IBulletProperties { }

/**
 * Defines events for [[PinBullet]].
 */
export interface IPinBulletEvents extends IBulletEvents { }

/**
 * Defines adapters.
 * 
 * Includes both the [[Adapter]] definitions and properties
 * 
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
 * Creates a pin-shaped bullet with an optional text label and/or image inside
 * it.
 *
 * The background/body of the flag is a [[PointedCircle]] element. Most of
 * its the visual appearance is configured via `background` property.
 *
 * Uses [[Label]] instance to draw the label, so the label itself is
 * configurable.
 *
 * Example:
 * 
 * ```TypeScript
 * let series = chart.series.push(new am4charts.LineSeries());
 * // ...
 * let pinBullet = series.bullets.push(new am4plugins_bullets.PinBullet());
 * pinBullet.poleHeight = 15;
 * pinBullet.label.text = "{valueY}";
 * ```
 * ```JavaScript
 * var series = chart.series.push(new am4charts.LineSeries());
 * // ...
 * var pinBullet = series.bullets.push(new am4plugins_bullets.PinBullet());
 * pinBullet.poleHeight = 15;
 * pinBullet.label.text = "{valueY}";
 * ```
 * ```JSON
 * {
 *   // ...
 *   "series": [{
 *     // ...
 *     "bullets": [{
 *       "type": "PinBullet",
 *       "poleHeight": 15,
 *       "label": {
 *         "text": "{valueY}"
 *       }
 *     }]
 *   }]
 * }
 * ```
 *
 * @since 4.5.7
 * @see {@link https://www.amcharts.com/docs/v4/tutorials/plugin-bullets/} for usage instructions.
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
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
	 * A [[Circle]] element of the pin. It is used for the "inside" of the pin.
	 */
	public circle: Circle;

	/**
	 * A type for the background element.
	 */
	public _background: PointedCircle;

	/**
	 * Image element.
	 */
	protected _image: Image;

	/**
	 * Label element.
	 */
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

		if(this.circle){
			let circleRadius = this.circle.radius;

			if (circleRadius instanceof Percent) {
				this.circle.width = r * 2;
				this.circle.height = r * 2;
			}
		}

		let image = this.image;
		if (image) {
			image.x = cx;
			image.y = cy;
			image.width = r * 2;
			image.height = r * 2;
			image.element.attr({preserveAspectRatio:"xMidYMid slice"})
			if(this.circle){
				this.circle.scale = 1 / image.scale;
			}
		}
		else {
			if(this.circle){
				this.circle.x = cx;
				this.circle.y = cy;
			}
		}

		let label = this.label;
		if (label) {
			label.x = cx;
			label.y = cy;
		}
	}

	/**
	 * An element of type [[Image]] to show inside pin's circle.
	 * 
	 * @param  image  Image
	 */
	public set image(image: Image) {
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
	 * @return Image
	 */
	public get image(): Image {
		return this._image;
	}

	/**
	 * A [[Label]] element for displaying within flag.
	 *
	 * Use it's `text` property to set actual text, e.g.:
	 *
	 * ```TypeScript
	 * pinBullet.text = "Hello";
	 * ```
	 * ```JavaScript
	 * pinBullet.text = "Hello";
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     // ...
	 *     "bullets": [{
	 *       "type": "PinBullet",
	 *       "label": {
	 *         "text": "Hello"
	 *       }
	 *     }]
	 *   }]
	 * }
	 * ```
	 * @param  label  Label
	 */
	public set label(label: Label) {
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
	 * @return Label
	 */
	public get label(): Label {
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
		if(this.circle && source.circle){
			this.circle.copyFrom(source.circle);
		}

		if (source.label) {
			if (!this._label) {
				this.label = source.label.clone();
			}
			this._label.copyFrom(source.label);
		}	
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
