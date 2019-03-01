/**
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../../core/Sprite";
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
 * Defines properties for [[AxisLine]].
 */
export interface IAxisLineProperties extends ISpriteProperties { }

/**
 * Defines events for [[AxisLine]].
 */
export interface IAxisLineEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[AxisLine]].
 *
 * @see {@link Adapter}
 */
export interface IAxisLineAdapters extends ISpriteAdapters, IAxisLineProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to draw Axis line.
 *
 * @see {@link IAxisLineEvents} for a list of available events
 * @see {@link IAxisLineAdapters} for a list of available Adapters
 */
export class AxisLine extends Sprite {

	/**
	 * Defines available properties.
	 */
	public _properties!: IAxisLineProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisLineAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisLineEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "AxisLine";

		this.element = this.paper.add("path");

		let interfaceColors = new InterfaceColorSet();
		this.stroke = interfaceColors.getFor("grid");
		this.strokeOpacity = 0.15;
		this.pixelPerfect = true;
		this.fill = color();
		this.applyTheme();

		this.interactionsEnabled = false;

		//this.element.moveTo({ x: 0, y: 0 });
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisLine"] = AxisLine;
