/**
 * Grip module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Button, IButtonProperties, IButtonAdapters, IButtonEvents } from "./Button";
import { Sprite } from "../Sprite";
import { Align } from "../defs/Align";
import { VerticalAlign } from "../defs/VerticalAlign";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { IDisposer } from "../../core/utils/Disposer";
import { registry } from "../Registry";
import { Optional } from "../utils/Type";
import { percent } from "../utils/Percent";
import * as $path from "../rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Grip]].
 */
export interface IGripProperties extends IButtonProperties {
	position: Align | VerticalAlign;
	autoHideDelay: number;
}

/**
 * Defines events for [[Grip]] for [[Grip]].
 */
export interface IGripEvents extends IButtonEvents { }

/**
 * Defines adapters for [[Grip]].
 *
 * @see {@link Adapter}
 */
export interface IGripAdapters extends IButtonAdapters, IGripProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a grip element that can be used for scrolling or other things.
 *
 * @see {@link IGripEvents} for a list of available events
 * @see {@link IGripAdapters} for a list of available Adapters
 * @since 4.4.0
 */
export class Grip extends Button {

	/**
	 * Defines available properties.
	 */
	public _properties!: IGripProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IGripAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IGripEvents;

		/**
	 * Disposer for grip autohide timeout.
	 */
	protected _autoHideTimeout: Optional<IDisposer>;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Grip";

		const cs = new InterfaceColorSet();

		// Set defaults
		this.layout = "absolute";


		this.padding(10, 10, 10, 10);
		this.margin(3, 3, 3, 3);
		this.background.fillOpacity = 0.3;
		this.background.cornerRadius(10, 10, 10, 10);

		// Create an icon
		let icon: Sprite = new Sprite();
		icon.element = this.paper.add("path");

		let path = $path.moveTo({ x: -6, y: 0 });
		path += $path.lineTo({ x: 6, y: 0 });
		path += $path.moveTo({ x: -8, y: -6 });
		path += $path.lineTo({ x: 0, y: -12 });
		path += $path.lineTo({ x: 8, y: -6 });
		path += $path.moveTo({ x: -8, y: 6 });
		path += $path.lineTo({ x: 0, y: 12 });
		path += $path.lineTo({ x: 8, y: 6 });
		icon.path = path;
		icon.strokeWidth = 2;
		icon.fillOpacity = 0;

		icon.pixelPerfect = true;
		icon.padding(0, 4, 0, 4);
		icon.stroke = cs.getFor("text");
		icon.strokeOpacity = 0.7;
		icon.align = "center";
		icon.valign = "middle";
		this.icon = icon;

		this.label.dispose();
		this.label = undefined;

		// Set default position
		this.position = "right";

		// Set up autohide
		this.autoHideDelay = 3000;
		this.events.on("shown", (ev) => {
			if (this._autoHideTimeout) {
				this._autoHideTimeout.dispose();
			}
			if (this.autoHideDelay) {
				this._autoHideTimeout = this.setTimeout(() => {
					this.hide();
				}, this.autoHideDelay);
			}
		});

		this.events.on("down", (ev) => {
			if (this._autoHideTimeout) {
				this._autoHideTimeout.dispose();
			}
		});

		this.events.on("out", (ev) => {
			if (this.autoHideDelay) {
				this._autoHideTimeout = this.setTimeout(() => {
					this.hide();
				}, this.autoHideDelay);
			}
		});

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Sets position of the grip.
	 *
	 * Available options: "left", "right" (default), "top", "bottom".
	 *
	 * @param  value  Position
	 */
	public set position(value: Align | VerticalAlign) {
		if (this.setPropertyValue("position", value)) {
			switch(value) {
				case "left":
					this.align = "left";
					this.valign = "middle";
					this.horizontalCenter = "left";
					this.verticalCenter = "middle";
					this.icon.rotation = 0;
					this.width = undefined;
					this.height = percent(30);
					break;

				case "right":
					this.align = "right";
					this.valign = "middle";
					this.horizontalCenter = "right";
					this.verticalCenter = "middle";
					this.icon.rotation = 0;
					this.width = undefined;
					this.height = percent(30);
					break;

				case "top":
					this.align = "center";
					this.valign = "top";
					this.horizontalCenter = "middle";
					this.verticalCenter = "top";
					this.icon.rotation = 90;
					this.width = percent(30);
					this.height = undefined;
					break;

				case "bottom":
					this.align = "center";
					this.valign = "bottom";
					this.horizontalCenter = "middle";
					this.verticalCenter = "bottom";
					this.icon.rotation = 90;
					this.width = percent(30);
					this.height = undefined;
					break;

				default:
					this.align = "center";
					this.valign = "middle";
					this.horizontalCenter = "middle";
					this.verticalCenter = "middle";
					this.icon.rotation = 90;
					this.width = percent(30);
					this.height = undefined;
			}
		}

	}

	/**
	 * @return Position
	 */
	public get position(): Align | VerticalAlign {
		return this.getPropertyValue("position");
	}

	/**
	 * Number of milliseconds to show grip until it is hidden automatically.
	 *
	 * @default 3000
	 * @param  value  Delay
	 */
	public set autoHideDelay(value: number) {
		this.setPropertyValue("autoHideDelay", value);
	}

	/**
	 * @return Delay
	 */
	public get autoHideDelay(): number {
		return this.getPropertyValue("autoHideDelay");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Grip"] = Grip;
