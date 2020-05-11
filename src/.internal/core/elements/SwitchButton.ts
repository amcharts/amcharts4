/**
 * Functionality for drawing simple SwitchButtons.
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
import { Button } from "../elements/Button";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { Circle } from "../../core/elements/Circle";
import { percent } from "../../core/utils/Percent";
import { registry } from "../Registry";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[SwitchButton]].
 */
export interface ISwitchButtonProperties extends IContainerProperties { }

/**
 * Defines events for [[SwitchButton]].
 */
export interface ISwitchButtonEvents extends IContainerEvents { }

/**
 * Defines adapters for [[SwitchButton]].
 *
 * @see {@link Adapter}
 */
export interface ISwitchButtonAdapters extends IContainerAdapters, ISwitchButtonProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * SwitchButton class is capable of drawing a simple rectangular SwitchButton with
 * optionally rounded corners and an icon in it.
 *
 * @see {@link ISwitchButtonEvents} for a list of available events
 * @see {@link ISwitchButtonAdapters} for a list of available Adapters
 */
export class SwitchButton extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: ISwitchButtonProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISwitchButtonAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISwitchButtonEvents;

	/**
	 * Icon reference.
	 */
	protected _icon: Sprite;

	/**
	 * [[Label]] element for SwitchButton content.
	 */
	protected _leftLabel: $type.Optional<Label>;

	/**
	 * [[Label]] element for SwitchButton content.
	 */
	protected _rightLabel: $type.Optional<Label>;

	/**
	 * A type for background.
	 */
	public _background: RoundedRectangle;

	protected _switchButton: Button;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "SwitchButton";

		this.tooltipY = 0;

		// Set defaults
		this.layout = "horizontal";
		this.contentAlign = "center";
		this.contentValign = "middle";
		this.padding(8, 16, 8, 16);
		this.setStateOnChildren = true;
		this.states.create("active");

		let interfaceColors = new InterfaceColorSet();

		// Create the label element
		let leftLabel = new Label();
		leftLabel.fillOpacity = 0.3;
		let llas = leftLabel.states.create("active");
		llas.properties.fillOpacity = 1;
		leftLabel.isActive = true;
		this.leftLabel = leftLabel;

		let button = new Button();
		let circle = new Circle();
		button.contentValign = "none";
		button.padding(0, 0, 0, 0);
		circle.radius = 10;
		button.icon = circle;
		button.icon.valign = "middle";
		button.label = undefined;
		let p100 = percent(100);
		button.background.cornerRadius(p100, p100, p100, p100);
		button.width = circle.radius * 3.5;
		button.height = circle.radius * 2.1;
		button.marginLeft = 8;
		button.marginRight = 8;
		button.togglable = true;
		circle.dx = -circle.radius * 0.7;
		circle.fill = interfaceColors.getFor("primaryButton");

		let hs = circle.states.create("hover");
		hs.properties.fill = interfaceColors.getFor("primaryButtonHover");

		let as = circle.states.create("active");
		as.properties.fill = interfaceColors.getFor("primaryButtonActive");
		as.properties.dx = circle.radius * 0.7;

		this.switchButton = button;

		this.events.on("toggled", () => {
			this.leftLabel.isActive = !this.isActive;
			this.rightLabel.isActive = this.isActive;
		})

		// Create the label element
		let rightLabel = new Label();
		rightLabel.fillOpacity = 0.3;
		
		let rlas = rightLabel.states.create("active");
		rlas.properties.fillOpacity = 1;
		this.rightLabel = rightLabel;

		// Set up accessibility
		// A Button should be always focusable
		this.role = "button";
		this.focusable = true;

		rightLabel.valign = "middle";
		leftLabel.valign = "middle";	
		button.valign = "middle"	

		// Apply theme
		this.applyTheme();
	}

	/**
	 * [[Label]] element to be used for left text.
	 *
	 * @param left label element
	 */
	public set leftLabel(label: $type.Optional<Label>) {
		if (this._leftLabel) {
			this.removeDispose(this._leftLabel);
		}
		this._leftLabel = label;
		if (label) {
			label.parent = this;
			label.interactionsEnabled = false;
			label.shouldClone = false;
			this._disposers.push(this._leftLabel);
		}
	}

	/**
	 * @return Left label element
	 */
	public get leftLabel(): $type.Optional<Label> {
		return this._leftLabel;
	}

	/**
	 * [[Label]] element to be used for left text.
	 *
	 * @param rigth label element
	 */
	public set rightLabel(label: $type.Optional<Label>) {
		if (this._rightLabel) {
			this.removeDispose(this._rightLabel);
		}
		this._rightLabel = label;
		if (label) {
			label.parent = this;
			label.interactionsEnabled = false;
			label.shouldClone = false;
			this._disposers.push(this._rightLabel);
		}
	}

	/**
	 * @return Rigth label element
	 */
	public get rightLabel(): $type.Optional<Label> {
		return this._rightLabel;
	}

	/**
	 * @return Left label element
	 */
	public get switch(): $type.Optional<Button> {
		return this._switchButton;
	}

	/**
	 * [[Label]] element to be used for left text.
	 *
	 * @param rigth label element
	 */
	public set switchButton(button: $type.Optional<Button>) {
		if (this._switchButton) {
			this.removeDispose(this._switchButton);
		}
		this._switchButton = button;
		if (button) {
			button.parent = this;
			button.shouldClone = false;
			this._disposers.push(this._switchButton);
		}
	}

	/**
	 * Copies properties and other attributes.
	 *
	 * @param source  Source
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		if (source.leftLabel) {
			this.leftLabel.copyFrom(source.leftLabel)
		}
		if (source.rightLabel) {
			this.rightLabel.copyFrom(source.rightLabel)
		}
		if (source.switchButton) {
			this.switchButton.copyFrom(source.switchButton)
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SwitchButton"] = SwitchButton;
