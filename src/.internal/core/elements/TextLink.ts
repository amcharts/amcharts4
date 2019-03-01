/**
 * A module that defines Text element used to indicate links.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Label, ILabelProperties, ILabelAdapters, ILabelEvents } from "../../core/elements/Label";
import { MouseCursorStyle } from "../../core/interaction/Mouse";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { registry } from "../Registry";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[TextLink]].
 */
export interface ITextLinkProperties extends ILabelProperties { }

/**
 * Defines events for [[TextLink]].
 */
export interface ITextLinkEvents extends ILabelEvents { }

/**
 * Defines adapters for [[TextLink]].
 *
 * @see {@link Adapter}
 */
export interface ITextLinkAdapters extends ILabelAdapters, ITextLinkProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a text element with a link.
 *
 * @see {@link ITextLinkEvents} for a list of available events
 * @see {@link ITextLinkAdapters} for a list of available Adapters
 */
export class TextLink extends Label {

	/**
	 * Defines available properties.
	 */
	public _properties!: ITextLinkProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ITextLinkAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ITextLinkEvents;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "TextLink";
		this.selectable = true;

		let interfaceColors = new InterfaceColorSet();

		this.fill = interfaceColors.getFor("primaryButton").brighten(0.3);

		let hoverState = this.states.create("hover");
		hoverState.properties.fill = interfaceColors.getFor("primaryButtonHover").brighten(0.3);

		let downState = this.states.create("down");
		downState.properties.fill = interfaceColors.getFor("primaryButtonDown").brighten(0.3);

		this.cursorOverStyle = MouseCursorStyle.pointer;

		this.applyTheme();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["TextLink"] = TextLink;
