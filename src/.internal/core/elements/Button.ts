/**
 * Functionality for drawing simple buttons.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../Container";
import { Sprite } from "../Sprite";
import { Label } from "./Label";
import { RoundedRectangle } from "../elements/RoundedRectangle";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { registry } from "../Registry";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Button]].
 */
export interface IButtonProperties extends IContainerProperties {

	/**
	 * Icon (if available) position - left or right.
	 */
	iconPosition?: "left" | "right";

	/**
	 * Icon sprite
	 */
	icon?: Sprite;
}

/**
 * Defines events for [[Button]].
 */
export interface IButtonEvents extends IContainerEvents { }

/**
 * Defines adapters for [[Button]].
 *
 * @see {@link Adapter}
 */
export interface IButtonAdapters extends IContainerAdapters, IButtonProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Button class is capable of drawing a simple rectangular button with
 * optionally rounded corners and an icon in it.
 *
 * @see {@link IButtonEvents} for a list of available events
 * @see {@link IButtonAdapters} for a list of available Adapters
 */
export class Button extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IButtonProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IButtonAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IButtonEvents;

	/**
	 * Icon reference.
	 */
	protected _icon: Sprite;

	/**
	 * [[Label]] element for button content.
	 */
	protected _label: $type.Optional<Label>;

	/**
	 * A type for background.
	 */
	public _background: RoundedRectangle;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Button";

		this.tooltipY = 0;

		// Set defaults
		this.iconPosition = "left";
		this.layout = "horizontal";
		this.contentAlign = "center";
		this.contentValign = "middle";
		this.padding(8, 16, 8, 16);

		let interfaceColors = new InterfaceColorSet();

		// Create background
		let background = this.background;
		background.fill = interfaceColors.getFor("secondaryButton");
		background.stroke = interfaceColors.getFor("secondaryButtonStroke");
		background.fillOpacity = 1;
		background.strokeOpacity = 1;
		background.cornerRadius(3, 3, 3, 3);

		// Create the label element
		this.label = new Label();
		this.label.fill = interfaceColors.getFor("secondaryButtonText");;

		// Create default states
		let hoverState = background.states.create("hover");
		hoverState.properties.fillOpacity = 1;
		hoverState.properties.fill = interfaceColors.getFor("secondaryButtonHover");

		let downState = background.states.create("down");
		downState.transitionDuration = 100;
		downState.properties.fill = interfaceColors.getFor("secondaryButtonDown");
		downState.properties.fillOpacity = 1;
		// Set up accessibility
		// A button should be always focusable
		this.role = "button";
		this.focusable = true;

		// Apply theme
		this.applyTheme();

	}

	/**
	 * A [[Sprite]] to be used as an icon on button.
	 *
	 * @param icon Icon Sprite
	 */
	public set icon(icon: Sprite) {
		let currentIcon = this.getPropertyValue("icon");
		if (currentIcon) {
			//this._icon.dispose();
			//this.removeDispose(currentIcon);
			currentIcon.parent = undefined;
		}
		if (icon) {
			this.setPropertyValue("icon", icon);
			icon.parent = this;
			icon.interactionsEnabled = false;
			this.iconPosition = this.iconPosition;
			this._disposers.push(icon);
		}
	}

	/**
	 * @return Icon Sprite
	 */
	public get icon(): Sprite {
		return this.getPropertyValue("icon");
	}

	/**
	 * Icon position: "left" or "right".
	 *
	 * @default "left"
	 * @param position  Icon position
	 */
	public set iconPosition(position: "left" | "right") {
		this.setPropertyValue("iconPosition", position);

		if (this.icon) {
			if (position == "left") {
				this.icon.toBack();
			}
			else {
				this.icon.toFront();
			}
		}
	}

	/**
	 * @return Icon position
	 */
	public get iconPosition(): "left" | "right" {
		return this.getPropertyValue("iconPosition");
	}

	/**
	 * [[Label]] element to be used for text.
	 *
	 * @param label element
	 */
	public set label(label: $type.Optional<Label>) {
		if (this._label) {
			//this._label.dispose();
			this.removeDispose(this._label);
		}
		this._label = label;
		if (label) {
			label.parent = this;
			label.interactionsEnabled = false;
			this._disposers.push(this._label);
		}
	}

	/**
	 * @return Label element
	 */
	public get label(): $type.Optional<Label> {
		return this._label;
	}

	/**
	 * Creates a background element for the button.
	 *
	 * @ignore Exclude from docs
	 * @return Background element
	 */
	public createBackground(): this["_background"] {
		return new RoundedRectangle();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Button"] = Button;
