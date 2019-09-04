/**
 * Functionality for drawing simple ClockHands
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Circle } from "../../core/elements/Circle";
import { Trapezoid } from "../../core/elements/Trapezoid";
import { Axis } from "../axes/Axis";
import { AxisRendererCircular } from "../axes/AxisRendererCircular";
import { MutableValueDisposer, MultiDisposer } from "../../core/utils/Disposer";
import { percent, Percent } from "../../core/utils/Percent";
import { registry } from "../../core/Registry";
import { GaugeChart } from "../types/GaugeChart";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[ClockHand]].
 */
export interface IClockHandProperties extends IContainerProperties {

	/**
	 * Radius of the hand's outer end. (tip)
	 *
	 * Absolute (px) or relative ([[Percent]]).
	 *
	 * @default Percent(100)
	 */
	radius: number | Percent;

	/**
	 * Radius of the hand's inner end. (base)
	 *
	 * Absolute (px) or relative ([[Percent]]).
	 *
	 * @default Percent(0)
	 */
	innerRadius: number | Percent;

	/**
	 * Width, in pixels, of the clock hand's tip.
	 *
	 * @default 1
	 */
	endWidth: number;

	/**
	 * Width, in pixels, of the clock hand's base.
	 *
	 * @default 5
	 */
	startWidth: number;

	/**
	 * rotation direction
	 * @default "any"
	 */
	rotationDirection: "any" | "clockWise" | "counterClockWise";
}

/**
 * Defines events for [[ClockHand]].
 */
export interface IClockHandEvents extends IContainerEvents { }

/**
 * Defines adapters for [[ClockHand]].
 *
 * @see {@link Adapter}
 */
export interface IClockHandAdapters extends IContainerAdapters, IClockHandProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * ClockHand class is capable of drawing a simple pointy shape with optionally
 * rounderd corners and an icon.
 *
 * @see {@link IClockHandEvents} for a list of available events
 * @see {@link IClockHandAdapters} for a list of available Adapters
 * @todo Improve
 * @important
 */
export class ClockHand extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IClockHandProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IClockHandAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IClockHandEvents;

	/**
	 * A circle element used as hand's base.
	 */
	protected _pin: Circle;

	/**
	 * A trapezoid shape used for hand itself.
	 */
	protected _hand: Trapezoid;

	/**
	 * An Axis hand is related to.
	 */
	protected _axis: MutableValueDisposer<Axis> = new MutableValueDisposer<Axis>();

	/**
	 * Hand's current value.
	 */
	protected _value: any;


	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "ClockHand";

		let interfaceColors = new InterfaceColorSet();

		this.fill = interfaceColors.getFor("alternativeBackground");
		this.stroke = this.fill;

		let pin: Circle = new Circle();
		pin.radius = 5;
		this.pin = pin;
		this.isMeasured = false;

		this.startWidth = 5;
		this.endWidth = 1;

		this.width = percent(100);
		this.height = percent(100);

		this.radius = percent(100);
		this.innerRadius = percent(0);

		let hand: Trapezoid = new Trapezoid();
		this.hand = hand;

		this._disposers.push(this._axis);

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Re(validates) the clock hand, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {
		super.validate();
		let hand = this.hand;
		hand.width = this.pixelWidth;
		let h: number = Math.max(this.startWidth, this.endWidth);
		hand.height = h;
		hand.leftSide = percent(this.startWidth / h * 100);
		hand.rightSide = percent(this.endWidth / h * 100);

		if (this.axis) {
			let renderer: AxisRendererCircular = <AxisRendererCircular>this.axis.renderer;

			let x0: number = $utils.relativeRadiusToValue(this.innerRadius, renderer.pixelRadius);
			let x1: number = $utils.relativeRadiusToValue(this.radius, renderer.pixelRadius);

			hand.x = x0;
			hand.y = - h / 2;

			hand.width = x1 - x0;
		}
	}

	/**
	 * A circle element used as hand's base. (pin)
	 *
	 * @param pin  Pin element
	 */
	public set pin(pin: Circle) {
		if (this._pin) {
			this.removeDispose(this._pin);
		}
		if (pin) {
			this._pin = pin;
			pin.parent = this;
			this._disposers.push(pin);
		}
	}

	/**
	 * @return Pin element
	 */
	public get pin(): Circle {
		return this._pin;
	}

	/**
	 * A trapezoid shape used for hand itself.
	 *
	 * The shape of the trapezoid is controlled by ClockHand's `startWidth` and
	 * `endWidth` properties.
	 *
	 * Set `endWidth` to 1 (px) to make it pointy.
	 *
	 * @param hand  Hand element
	 */
	public set hand(hand: Trapezoid) {
		if (this._hand) {
			this.removeDispose(this._hand);
		}
		if (hand) {
			this._hand = hand;
			hand.parent = this;
			this._disposers.push(hand);
		}
	}

	/**
	 * @return Hand element
	 */
	public get hand(): Trapezoid {
		return this._hand;
	}

	/**
	 * Radius of the hand's outer end. (tip)
	 *
	 * Absolute (px) or relative ([[Percent]]).
	 *
	 * @default Percent(0)
	 * @param value  Radius
	 */
	public set radius(value: number | Percent) {
		this.setPercentProperty("radius", value, true, false, 10, false);
	}

	/**
	 * @return Radius
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * Radius of the hand's inner end. (base)
	 *
	 * Absolute (px) or relative ([[Percent]]).
	 *
	 * @default Percent(0)
	 * @param value  Radius
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, true, false, 10, false);
	}

	/**
	 * @return Radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Width, in pixels, of the clock hand's inner end. (base)
	 *
	 * @default 5
	 * @param value  Width (px)
	 */
	public set startWidth(value: number) {
		this.setPropertyValue("startWidth", value, true);
	}

	/**
	 * @return Width (px)
	 */
	public get startWidth(): number {
		return this.getPropertyValue("startWidth");
	}

	/**
	 * Width, in pixels, of the clock hand's outer end. (tip)
	 *
	 * @default 1
	 * @param value  Width (px)
	 */
	public set endWidth(value: number) {
		this.setPropertyValue("endWidth", value, true);
	}

	/**
	 * @return Width (px)
	 */
	public get endWidth(): number {
		return this.getPropertyValue("endWidth");
	}


	/**
	 * Rotation direction
	 *
	 * @default any
	 * @param value
	 */
	public set rotationDirection(value: "any" | "clockWise" | "counterClockWise") {
		this.setPropertyValue("rotationDirection", value);
	}

	/**
	 * @return rotationDirection
	 */
	public get rotationDirection(): "any" | "clockWise" | "counterClockWise" {
		return this.getPropertyValue("rotationDirection");
	}

	/**
	 * Moves clock hand to particular value.
	 *
	 * If `duration` is set to a number in milliseconds, the hand will move
	 * to the new position gracefully, rather than jumping rigth to it.
	 *
	 * Alternatively, you can also set `value` directly.
	 *
	 * @param value     New value
	 * @param duration  Animation duration (ms)
	 * @param easing  Animation easing function
	 */
	public showValue(value: any, duration?: number, easing?: (value: number) => number): void {
		this._value = value;
		if (value != undefined) {
			if (!$type.isNumber(duration)) {
				duration = 0;
			}

			if (this.axis) {
				let renderer = <AxisRendererCircular>this.axis.renderer;
				let newAngle = renderer.positionToAngle(this.axis.anyToPosition(value));
				let currentAngle = this.rotation;

				if (this.rotationDirection == "clockWise") {
					if (newAngle < currentAngle) {
						this.rotation = currentAngle - 360;
					}
				}
				if (this.rotationDirection == "counterClockWise") {
					if (newAngle > currentAngle) {
						this.rotation = currentAngle + 360;
					}
				}

				this.animate({ property: "rotation", to: newAngle }, duration, easing);
			}
		}
	}

	/**
	 * A current value clock hand is pointing to.
	 *
	 * @param value  Value
	 */
	public set value(value: any) {
		this.showValue(value);
	}

	/**
	 * @return Value
	 */
	public get value(): any {
		return this._value;
	}

	/**
	 * An Axis clock hand is associated with.
	 *
	 * Hand's `value` relates to values on the Axis.
	 *
	 * @param axis  Axis
	 */
	public set axis(axis: Axis) {
		if (this.axis != axis) {
			this._axis.set(axis, new MultiDisposer([
				axis.events.on("datavalidated", this.updateValue, this, false),
				axis.events.on("datarangechanged", this.updateValue, this, false),
				axis.events.on("dataitemsvalidated", this.updateValue, this, false),
				axis.events.on("propertychanged", this.invalidate, this, false)
			]));
		}
		if (axis) {
			let chart: GaugeChart = <GaugeChart>axis.chart;
			if (chart) {
				this.rotation = chart.startAngle;
			}
		}
		this.parent = axis.renderer;
		this.zIndex = 5;
	}

	/**
	 * @return Axis
	 */
	public get axis(): Axis {
		return this._axis.get();
	}

	/**
	 * Triggers `value` accessor, so that Hand animates to new position, in case
	 * value has changed.
	 *
	 * @ignore Exclude from docs
	 */
	protected updateValue() {
		this.value = this.value;
	}

	/**
 * Processes JSON-based config before it is applied to the object.
 *
 * @ignore Exclude from docs
 * @param config  Config
 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Connect clock hands with axes
			if ($type.hasValue(config.axis) && $type.isString(config.axis) && this.map.hasKey(config.axis)) {
				config.axis = this.map.getKey(config.axis);
			}

		}

		super.processConfig(config);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ClockHand"] = ClockHand;
