/**
 * Preloader module.
 *
 * Preloader is a progress indicator.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../Container";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { Slice } from "./Slice";
import { Label } from "./Label";
import { registry } from "../Registry";
import { percent } from "../../core/utils/Percent";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Preloader]].
 */
export interface IPreloaderProperties extends IContainerProperties {

	/**
	 * Current preload progress. (0-1)
	 *
	 * * 0 - 0%
	 * * 0.5 - 50%
	 * * 1 - 100%
	 */
	progress?: number;

	/**
	 * Delay display of preloader by X milliseconds.
	 *
	 * When loading starts (`progress` is set to <1) and finishes (`progress` is
	 * set to 1) before `delay` ms, the loader is never shown.
	 *
	 * This is used to avoid brief flashing of the preload for very quick loads.
	 *
	 * @default 1000
	 */
	delay?: number;

}

/**
 * Defines events for [[Preloader]].
 */
export interface IPreloaderEvents extends IContainerEvents { }

/**
 * Defines adapters for [[Preloader]].
 *
 * @see {@link Adapter}
 */
export interface IPreloaderAdapters extends IContainerAdapters, IPreloaderProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A class used to draw and display progress indicator.
 *
 * @see {@link IPreloaderEvents} for a list of available events
 * @see {@link IPreloaderAdapters} for a list of available Adapters
 */
export class Preloader extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IPreloaderProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPreloaderAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPreloaderEvents;

	/**
	 * A [[Slice]] element that indicates load progress.
	 *
	 * This can be used to modify appearance of the preloader elements.
	 */
	public progressSlice: Slice;

	/**
	 * A [[Slice]] element that shows the full ring. (background for the
	 * `progressSlice`)
	 *
	 * This can be used to modify appearance of the preloader elements.
	 */
	public backgroundSlice: Slice;

	/**
	 * Label that displays progress in percent.
	 *
	 * This can be used to modify appearance of the preloader elements.
	 */
	public label: Label;

	/**
	 * Logs the timestamp of when the loader was initiated. It will be used to
	 * delay showing of the Preloader so for quick operations it does not even
	 * appear on screen.
	 */
	protected _started: $type.Optional<number>;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Preloader";

		// Set dimensions
		this.width = percent(100);
		this.height = percent(100);

		let interfaceColors = new InterfaceColorSet();

		// Create main container
		let sliceContainer: Container = this.createChild(Container);
		sliceContainer.shouldClone = false;

		// Add background (100%) slice
		let backgroundSlice: Slice = sliceContainer.createChild(Slice);
		backgroundSlice.shouldClone = false;
		backgroundSlice.radius = 53;
		backgroundSlice.arc = 360;
		backgroundSlice.fill = interfaceColors.getFor("fill");
		backgroundSlice.fillOpacity = 0.8;
		backgroundSlice.innerRadius = 42;
		backgroundSlice.isMeasured = false;
		this.backgroundSlice = backgroundSlice;

		// Add progress slice
		let progressSlice: Slice = sliceContainer.createChild(Slice);
		progressSlice.shouldClone = false;
		progressSlice.radius = 50;
		progressSlice.innerRadius = 45;
		progressSlice.fill = interfaceColors.getFor("alternativeBackground");
		progressSlice.fillOpacity = 0.2;
		progressSlice.isMeasured = false;
		this.progressSlice = progressSlice;

		// Add text label element
		let label: Label = sliceContainer.createChild(Label);
		label.shouldClone = false;
		label.horizontalCenter = "middle";
		label.verticalCenter = "middle";
		label.isMeasured = false;
		label.fill = interfaceColors.getFor("text");
		label.align = "center";
		label.valign = "middle";
		label.fillOpacity = 0.4;
		this.label = label;

		// Set defaults
		this.background.opacity = 1;
		this.background.fill = interfaceColors.getFor("background");
		this.contentAlign = "center";
		this.contentValign = "middle";
		this.delay = 300;

		// Create hidden state
		let hiddenState = this.states.create("hidden");
		hiddenState.properties.opacity = 0;

		// Hide by default
		this.visible = false;
		this.hide(0);
		this.__disabled = true;

		// Make it disposable
		// @todo Maybe it's enough to just dispose `sliceContainer`?
		this._disposers.push(this.backgroundSlice);
		this._disposers.push(this.progressSlice);
		this._disposers.push(this.label);
		this._disposers.push(sliceContainer);
	}

	/**
	 * Current preload progress. (0-1)
	 *
	 * * 0 - 0%
	 * * 0.5 - 50%
	 * * 1 - 100%
	 *
	 * Setting this to a value less than 1, will automatically reveal the
	 * preloader, while setting it to 1 (100%) will hide it.
	 *
	 * @param value Progress (0-1)
	 */
	public set progress(value: number) {
		this.__disabled = false;

		this.validateLayout(); // show not in center without this

		this.setPropertyValue("progress", value);

		/*if (!this.visible && value == 1) {
			return;
		}*/

		this.progressSlice.arc = 360 * value;

		if (this.label) {
			this.label.text = Math.round(value * 100) + "%";
		}

		if (value >= 1) {

			// Cancel the timeout
			if (this._started) {
				this._started = undefined;
			}

			// TODO remove closure ?
			registry.events.once("enterframe", () => {
				let animation = this.hide();
				if (animation && !animation.isFinished()) {
					animation.events.once("animationended", () => {
						this.__disabled = true;
					})
				}
				else {
					this.__disabled = true;
				}
			});
			this.interactionsEnabled = false;
			this.setPropertyValue("progress", 0);
		}
		else if (value > 0) {
			if (this.delay) {
				if (!this._started) {
					this._started = new Date().getTime();
				}
				else if ((this._started + this.delay) <= new Date().getTime()) {
					this.__disabled = false;
					this.show();
					this.interactionsEnabled = true;
				}
			}
			else {
				this.__disabled = false;
				this.show();
				this.interactionsEnabled = true;
			}
		}

	}

	/**
	 * @return Progress (0-1)
	 */
	public get progress(): number {
		return this.getPropertyValue("progress");
	}

	/**
	 * Delay display of preloader by X milliseconds.
	 *
	 * When loading starts (`progress` is set to <1) and finishes (`progress` is
	 * set to 1) before `delay` ms, the loader is never shown.
	 *
	 * This is used to avoid brief flashing of the preload for very quick loads.
	 *
	 * @default 1000
	 * @param value  Delay (ms)
	 */
	public set delay(value: number) {
		this.setPropertyValue("delay", value);
	}

	/**
	 * @return Delay (ms)
	 */
	public get delay(): number {
		return this.getPropertyValue("delay");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Preloader"] = Preloader;
