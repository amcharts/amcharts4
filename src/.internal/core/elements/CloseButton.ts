/**
 * Zoom out button functionality.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Button, IButtonProperties, IButtonAdapters, IButtonEvents } from "./Button";
import { Sprite } from "../Sprite";
import { RoundedRectangle } from "./RoundedRectangle";
import { registry } from "../Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $path from "../rendering/Path";
import * as $type from "../../core/utils/Type";
import { MouseCursorStyle } from "../../core/interaction/Mouse";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[CloseButton]].
 */
export interface ICloseButtonProperties extends IButtonProperties { }

/**
 * Defines events for [[CloseButton]].
 */
export interface ICloseButtonEvents extends IButtonEvents { }

/**
 * Defines adapters for [[CloseButton]].
 *
 * @see {@link Adapter}
 */
export interface ICloseButtonAdapters extends IButtonAdapters, ICloseButtonProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a zoom out button.
 *
 * @see {@link ICloseButtonEvents} for a list of available events
 * @see {@link ICloseButtonAdapters} for a list of available Adapters
 */
export class CloseButton extends Button {

	/**
	 * Defines available properties.
	 */
	public _properties!: ICloseButtonProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICloseButtonAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICloseButtonEvents;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "CloseButton";

		this.padding(8, 8, 8, 8);
		this.showSystemTooltip = true;

		this.width = 30;
		this.height = 30;

		let interfaceColors = new InterfaceColorSet();

		this.cursorOverStyle = MouseCursorStyle.pointer;

		let background: RoundedRectangle = this.background;
		background.cornerRadius(20, 20, 20, 20);

		let bgc = interfaceColors.getFor("background");
		background.fill = bgc;
		background.stroke = interfaceColors.getFor("primaryButton");
		background.strokeOpacity = 1;
		background.strokeWidth = 1;

		let downColor = interfaceColors.getFor("primaryButtonActive")

		let bhs =background.states.getKey("hover");
		bhs.properties.strokeWidth = 3;
		bhs.properties.fill = bgc;

		let bds = background.states.getKey("down");				
		bds.properties.stroke = downColor;
		bds.properties.fill = bgc;

		// Create an icon
		let icon: Sprite = new Sprite();
		icon.element = this.paper.add("path");
		icon.stroke = background.stroke;

		this.icon = icon;

		// Apply theme
		this.applyTheme();
	}

	public validate() {
		super.validate();

		let w = this.pixelWidth / 3;
		let h = this.pixelHeight / 3;

		let path = $path.moveTo({ x: -w / 2, y: -h / 2 });
		path += $path.lineTo({ x: w / 2, y: h / 2 });
		path += $path.moveTo({ x: w / 2, y: -h / 2 });
		path += $path.lineTo({ x: -w / 2, y: h / 2 });
		this.icon.path = path;
		this.invalidateLayout();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Close");
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CloseButton"] = CloseButton;
