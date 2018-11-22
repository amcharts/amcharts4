/**
 * Module that defines everything related to building OHLCs.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Candlestick, ICandlestickProperties, ICandlestickAdapters, ICandlestickEvents } from "./Candlestick";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { Line } from "../../core/elements/Line";
import { registry } from "../../core/Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[OHLC]].
 */
export interface IOHLCProperties extends ICandlestickProperties { }

/**
 * Defines events for [[OHLC]].
 */
export interface IOHLCEvents extends ICandlestickEvents { }

/**
 * Defines adapters for [[OHLC]].
 *
 * @see {@link Adapter}
 */
export interface IOHLCAdapters extends ICandlestickAdapters, IOHLCProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Class used to creates OHLCs.
 *
 * @see {@link IOHLCEvents} for a list of available events
 * @see {@link IOHLCAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export class OHLC extends Candlestick {

	/**
	 * Defines available properties.
	 *
	 * @type {IOHLCProperties}
	 */
	public _properties!: IOHLCProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IOHLCAdapters}
	 */
	public _adapter!: IOHLCAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IOHLCEvents}
	 */
	public _events!: IOHLCEvents;


	/**
	 * Open line element
	 * @type {Line}
	 */
	public openLine: Line;

	/**
	 * Close line element
	 * @type {Line}
	 */
	public closeLine: Line;

	/**
	 * High-low line element
	 * @type {Line}
	 */
	public highLowLine: Line;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "OHLC";
		this.layout = "none";
	}

	createAssets() {
		//super.createAssets();

		this.openLine = this.createChild(Line);
		this.openLine.shouldClone = false;

		this.highLowLine = this.createChild(Line);
		this.highLowLine.shouldClone = false;

		this.closeLine = this.createChild(Line);
		this.closeLine.shouldClone = false;
	}

	copyFrom(source: this) {
		super.copyFrom(source)
		if (this.openLine) {
			this.openLine.copyFrom(source.openLine);
		}
		if (this.highLowLine) {
			this.highLowLine.copyFrom(source.highLowLine);
		}
		if (this.closeLine) {
			this.closeLine.copyFrom(source.closeLine);
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["OHLC"] = OHLC;
