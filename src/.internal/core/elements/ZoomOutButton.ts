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


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[ZoomOutButton]].
 */
export interface IZoomOutButtonProperties extends IButtonProperties { }

/**
 * Defines events for [[ZoomOutButton]].
 */
export interface IZoomOutButtonEvents extends IButtonEvents { }

/**
 * Defines adapters for [[ZoomOutButton]].
 *
 * @see {@link Adapter}
 */
export interface IZoomOutButtonAdapters extends IButtonAdapters, IZoomOutButtonProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a zoom out button.
 *
 * @see {@link IZoomOutButtonEvents} for a list of available events
 * @see {@link IZoomOutButtonAdapters} for a list of available Adapters
 */
export class ZoomOutButton extends Button {

	/**
	 * Defines available properties.
	 */
	public _properties!: IZoomOutButtonProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IZoomOutButtonAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IZoomOutButtonEvents;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "ZoomOutButton";

		this.padding(9, 9, 9, 9);
		//this.dx = - 5;
		//this.dy = 5;

		this.showSystemTooltip = true;

		let interfaceColors = new InterfaceColorSet();

		let background: RoundedRectangle = this.background;
		background.cornerRadius(20, 20, 20, 20);
		background.fill = interfaceColors.getFor("primaryButton");
		background.stroke = interfaceColors.getFor("primaryButtonStroke");
		background.strokeOpacity = 0;

		background.states.getKey("hover").properties.fill = interfaceColors.getFor("primaryButtonHover");
		background.states.getKey("down").properties.fill = interfaceColors.getFor("primaryButtonActive");

		// Create an icon
		let icon: Sprite = new Sprite();
		icon.element = this.paper.add("path");

		let path = $path.moveTo({ x: 0, y: 0 });
		path += $path.lineTo({ x: 11, y: 0 });
		icon.path = path;

		icon.pixelPerfect = true;
		icon.padding(8, 3, 8, 3);
		icon.stroke = interfaceColors.getFor("primaryButtonText");
		this.icon = icon;

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Zoom Out");
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ZoomOutButton"] = ZoomOutButton;
