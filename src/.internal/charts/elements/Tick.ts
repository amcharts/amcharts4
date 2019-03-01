/**
 * Tick module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../../core/Sprite";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Tick]].
 */
export interface ITickProperties extends ISpriteProperties {

	/**
	 * Length of the tick (px).
	 */
	length?: number;
}

/**
 * Defines events for [[Tick]].
 */
export interface ITickEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[Tick]].
 *
 * @see {@link Adapter}
 */
export interface ITickAdapters extends ISpriteAdapters, ITickProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A basic Tick class.
 *
 * A tick is a short dash, mainly connecting an object like axis or slice to
 * it's textual label.
 *
 * @see {@link ITickEvents} for a list of available events
 * @see {@link ITickAdapters} for a list of available Adapters
 * @important
 */
export class Tick extends Sprite {

	/**
	 * Defines available properties.
	 */
	public _properties!: ITickProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ITickAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ITickEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Tick";

		let interfaceColors = new InterfaceColorSet();

		this.fillOpacity = 0;
		this.length = 6;
		this.strokeOpacity = 0.2;
		this.stroke = interfaceColors.getFor("grid");
		this.isMeasured = false;
		this.nonScalingStroke = true;

		this.applyTheme();
	}

	/**
	 * Length of the tick in pixels.
	 *
	 * @param value  Length (px)
	 */
	public set length(value: number) {
		this.setPropertyValue("length", value, true);
	}

	/**
	 * @return Length (px)
	 */
	public get length(): number {
		if (this.disabled) {
			return 0;
		}
		return this.getPropertyValue("length");
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Tick"] = Tick;
