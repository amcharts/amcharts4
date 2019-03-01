/**
 * Play button functionality.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Button, IButtonProperties, IButtonAdapters, IButtonEvents } from "./Button";
import { RoundedRectangle } from "./RoundedRectangle";
import { registry } from "../Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { Triangle } from "./Triangle";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[PlayButton]].
 */
export interface IPlayButtonProperties extends IButtonProperties { }

/**
 * Defines events for [[PlayButton]].
 */
export interface IPlayButtonEvents extends IButtonEvents { }

/**
 * Defines adapters for [[PlayButton]].
 *
 * @see {@link Adapter}
 */
export interface IPlayButtonAdapters extends IButtonAdapters, IPlayButtonProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a zoom out button.
 *
 * @see {@link IPlayButtonEvents} for a list of available events
 * @see {@link IPlayButtonAdapters} for a list of available Adapters
 */
export class PlayButton extends Button {

	/**
	 * Defines available properties.
	 */
	public _properties!: IPlayButtonProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPlayButtonAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPlayButtonEvents;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "PlayButton";

		this.padding(12, 12, 12, 12);

		this.showSystemTooltip = true;

		let interfaceColors = new InterfaceColorSet();

		let background: RoundedRectangle = this.background;
		background.cornerRadius(25, 25, 25, 25);
		background.fill = interfaceColors.getFor("primaryButton");
		background.stroke = interfaceColors.getFor("primaryButtonStroke");
		background.strokeOpacity = 0;

		background.states.getKey("hover").properties.fill = interfaceColors.getFor("primaryButtonHover");
		background.states.getKey("down").properties.fill = interfaceColors.getFor("primaryButtonActive");

		// Create a play icon
		let playIcon: Triangle = new Triangle();
		playIcon.direction = "right";
		playIcon.width = 9;
		playIcon.height = 11;
		playIcon.marginLeft = 1;
		playIcon.marginRight = 1;
		playIcon.horizontalCenter = "middle";
		playIcon.verticalCenter = "middle";

		playIcon.stroke = interfaceColors.getFor("primaryButtonText");
		playIcon.fill = playIcon.stroke;
		this.icon = playIcon;

		// Create a play icon
		let stopIcon: RoundedRectangle = new RoundedRectangle();
		stopIcon.width = 11;
		stopIcon.height = 11;
		stopIcon.horizontalCenter = "middle";
		stopIcon.verticalCenter = "middle";
		stopIcon.cornerRadius(0, 0, 0, 0);

		stopIcon.stroke = interfaceColors.getFor("primaryButtonText");
		stopIcon.fill = playIcon.stroke;

		this.togglable = true;

		let activeState = this.states.create("active");
		activeState.transitionDuration = 0;
		activeState.properties.icon = stopIcon;

		this.defaultState.transitionDuration = 0;

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
			this.readerTitle = this.language.translate("Play");
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PlayButton"] = PlayButton;
