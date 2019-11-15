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
import { color } from "../../core/utils/Color";
import { MouseCursorStyle } from "../../core/interaction/Mouse";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[MinimizeButton]].
 */
export interface IMinimizeButtonProperties extends IButtonProperties { }

/**
 * Defines events for [[MinimizeButton]].
 */
export interface IMinimizeButtonEvents extends IButtonEvents { }

/**
 * Defines adapters for [[MinimizeButton]].
 *
 * @see {@link Adapter}
 */
export interface IMinimizeButtonAdapters extends IButtonAdapters, IMinimizeButtonProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a zoom out button.
 *
 * @see {@link IMinimizeButtonEvents} for a list of available events
 * @see {@link IMinimizeButtonAdapters} for a list of available Adapters
 */
export class MinimizeButton extends Button {

	/**
	 * Defines available properties.
	 */
	public _properties!: IMinimizeButtonProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IMinimizeButtonAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IMinimizeButtonEvents;

	protected _activePath: string;
	protected _path: string;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "MinimizeButton";

		this.padding(8, 8, 8, 8);
		this.togglable = true;
		//this.dx = - 5;
		//this.dy = 5;

		this.setStateOnChildren = true;

		this.showSystemTooltip = true;

		this.width = 30;
		this.height = 30;

		let interfaceColors = new InterfaceColorSet();

		let background: RoundedRectangle = this.background;
		background.cornerRadius(20, 20, 20, 20);

		this.cursorOverStyle = MouseCursorStyle.pointer;

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
		icon.states.create("active");
		icon.element = this.paper.add("path");
		icon.stroke = background.stroke;
		icon.fill = color();
		this.icon = icon;

		this._disposers.push(background.events.on("over", () => {
			icon.isHover = true;
		}, this, false))

		this._disposers.push(background.events.on("out", () => {
			icon.isHover = false;
		}, this, false))

		this._disposers.push(background.events.on("hit", () => {
			icon.isActive = !icon.isActive;
		}, this, false))

		// Apply theme
		this.applyTheme();
	}

	protected setActive(value: boolean) {
		super.setActive(value);
		this.updateIcon();
	}

	protected updateIcon() {
		let path = "";
		if (this.isActive) {
			path = this._activePath;
		}
		else {
			path = this._path;
		}

		this.icon.path = path;
	}

	public validate() {
		super.validate();

		let w = this.pixelWidth / 3;
		let h = this.pixelHeight / 3;

		let path = $path.moveTo({ x: -w / 2, y: -h / 2 });
		path += $path.lineTo({ x: 0, y: -2 });
		path += $path.lineTo({ x: w / 2, y: -h / 2 });

		path += $path.moveTo({ x: -w / 2, y: h / 2 });
		path += $path.lineTo({ x: 0, y: 2 });
		path += $path.lineTo({ x: w / 2, y: h / 2 });

		this._path = path;

		this.icon.path = path;

		let activePath = $path.moveTo({ x: -w / 2, y: -2 });
		activePath += $path.lineTo({ x: 0, y: -h / 2 });
		activePath += $path.lineTo({ x: w / 2, y: -2 });

		activePath += $path.moveTo({ x: -w / 2, y: 2 });
		activePath += $path.lineTo({ x: 0, y: h / 2 });
		activePath += $path.lineTo({ x: w / 2, y: 2 });

		let activeState = this.icon.states.getKey("active");
		activeState.properties.path = activePath;
		this._activePath = activePath;

		this.invalidateLayout();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Minimize");
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MinimizeButton"] = MinimizeButton;
