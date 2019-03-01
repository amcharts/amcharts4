/**
 * Resize button module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Button, IButtonProperties, IButtonAdapters, IButtonEvents } from "./Button";
import { Sprite } from "../Sprite";
import { Orientation } from "../defs/Orientation";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { registry } from "../Registry";
import * as $path from "../rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[ResizeButton]].
 */
export interface IResizeButtonProperties extends IButtonProperties { }

/**
 * Defines events for [[ResizeButton]] for [[ResizeButton]].
 */
export interface IResizeButtonEvents extends IButtonEvents { }

/**
 * Defines adapters for [[ResizeButton]].
 *
 * @see {@link Adapter}
 */
export interface IResizeButtonAdapters extends IButtonAdapters, IResizeButtonProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a draggable resize/grip button.
 *
 * @see {@link IResizeButtonEvents} for a list of available events
 * @see {@link IResizeButtonAdapters} for a list of available Adapters
 */
export class ResizeButton extends Button {

	/**
	 * Defines available properties.
	 */
	public _properties!: IResizeButtonProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IResizeButtonAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IResizeButtonEvents;

	/**
	 * Orientation of the resize direction.
	 *
	 * @deprecated Not used
	 */
	protected _orientation: Orientation;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "ResizeButton";

		// Set defaults
		this.orientation = "horizontal";
		this.layout = "absolute";
		this.horizontalCenter = "middle";
		this.verticalCenter = "middle";

		this.draggable = true;
		this.padding(8, 8, 8, 8);

		this.background.cornerRadius(20, 20, 20, 20);

		// Create an icon
		let icon: Sprite = new Sprite();
		icon.element = this.paper.add("path");

		let path = $path.moveTo({ x: -2, y: -6 });
		path += $path.lineTo({ x: -2, y: 6 });
		path += $path.moveTo({ x: 2, y: -6 });
		path += $path.lineTo({ x: 2, y: 6 });
		icon.path = path;

		icon.pixelPerfect = true;
		icon.padding(0, 4, 0, 4);
		icon.stroke = new InterfaceColorSet().getFor("alternativeText");
		icon.strokeOpacity = 0.7;
		//icon.align = "center";
		//icon.valign = "middle";
		this.icon = icon;

		this.label.dispose();
		this.label = undefined;

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Use for setting of direction (orientation) of the resize button.
	 *
	 * Available options: "horizontal", "vertical".
	 *
	 * @param value Orientation
	 */
	public set orientation(value: Orientation) {
		let icon = this.icon;
		if (icon) {
			if (value == "horizontal") {
				icon.rotation = 0;
			}
			else {
				icon.rotation = -90;
			}
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ResizeButton"] = ResizeButton;
