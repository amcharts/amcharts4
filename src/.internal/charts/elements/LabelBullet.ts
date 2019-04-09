/**
 * Bullet module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Bullet, IBulletProperties, IBulletAdapters, IBulletEvents } from "./Bullet";
import { Label } from "../../core/elements/Label";
import { registry } from "../../core/Registry";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Bullet]]
 */
export interface ILabelBulletProperties extends IBulletProperties { }

/**
 * Defines events for [[Bullet]]
 */
export interface ILabelBulletEvents extends IBulletEvents { }

/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface ILabelBulletAdapters extends IBulletAdapters, ILabelBulletProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a bullet with a textual label.
 *
 * Uses [[Label]] instance to draw the label, so the label itself is
 * configurable.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export class LabelBullet extends Bullet {

	/**
	 * Defines available properties.
	 */
	public _properties!: ILabelBulletProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ILabelBulletAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ILabelBulletEvents;

	/**
	 * A label (textual) element for the bullet.
	 */
	public label: Label;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "LabelBullet";

		let label = this.createChild(Label);
		label.shouldClone = false;
		label.verticalCenter = "middle";
		label.horizontalCenter = "middle";
		label.truncate = true;
		label.hideOversized = false;

		label.maxWidth = 500;
		label.maxHeight = 500;

		label.stroke = color();
		label.strokeOpacity = 0;
		label.fill = new InterfaceColorSet().getFor("text");

		this.events.on("maxsizechanged", this.handleMaxSize, this, false);

		this.label = label;

		// not good, as lineSeries will have labels somewhere in the middle.
		//this.locationX = 0.5;
		//this.locationY = 0.5;

		this.applyTheme();
	}

	protected handleMaxSize(){
		this.label.maxWidth = this.maxWidth;
		this.label.maxHeight = this.maxHeight;
	}

	/**
	 * Copies all proprities and related stuff from another instance of
	 * [[LabelBullet]].
	 *
	 * @param source  Source element
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.label.copyFrom(source.label);
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LabelBullet"] = LabelBullet;
