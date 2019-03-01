/**
 * Slider is a scrollbar with just one selection grip.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Scrollbar, IScrollbarProperties, IScrollbarAdapters, IScrollbarEvents } from "../../core/elements/Scrollbar";
import { registry } from "../Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Slider]].
 */
export interface ISliderProperties extends IScrollbarProperties { }

/**
 * Defines events for [[Slider]].
 */
export interface ISliderEvents extends IScrollbarEvents { }

/**
 * Defines adapters for [[Slider]].
 *
 * @see {@link Adapter}
 */
export interface ISliderAdapters extends IScrollbarAdapters, ISliderProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a slider - a version of scrollbar with just one grip.
 *
 * @see {@link ISliderEvents} for a list of available events
 * @see {@link ISliderAdapters} for a list of available Adapters
 */
export class Slider extends Scrollbar {

	/**
	 * Defines available properties.
	 */
	public _properties!: ISliderProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISliderAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISliderEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Slider";

		this.thumb.opacity = 0;
		this.thumb.interactionsEnabled = false;
		this.endGrip.opacity = 0;
		this.endGrip.interactionsEnabled = false;

		this.startGrip.events.on("drag", () => {
			this.endGrip.x = this.startGrip.x;
			this.endGrip.y = this.startGrip.y;
		})

		this.applyTheme();
	}


	/**
	 * @return [description]
	 */
	protected get __end(): number {
		return this._start;
	}

	protected set __end(value: number) {

	}

	/**
	 * @return [description]
	 */
	public get end(): number {
		return this._start;
	}

	/**
	 * Relative position (0-1) of the end grip.
	 *
	 * @param position  Position (0-1)
	 */
	public set end(position: number) {

	}


	/**
	 * Relative position (0-1) of the start grip.
	 *
	 * @param position  Position (0-1)
	 */
	public set start(position: number) {
		if (!this._isBusy) {
			this.__start = position;
		}
	}

	/**
	 * @return Position (0-1)
	 */
	public get start(): number {
		return this._start;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Slider"] = Slider;
