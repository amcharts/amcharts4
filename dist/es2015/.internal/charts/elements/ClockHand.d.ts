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
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { Percent } from "../../core/utils/Percent";
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
     * @type {number | Percent}
     */
    radius: number | Percent;
    /**
     * Radius of the hand's inner end. (base)
     *
     * Absolute (px) or relative ([[Percent]]).
     *
     * @default Percent(0)
     * @type {number | Percent}
     */
    innerRadius: number | Percent;
    /**
     * Width, in pixels, of the clock hand's tip.
     *
     * @default 1
     * @type {number}
     */
    endWidth: number;
    /**
     * Width, in pixels, of the clock hand's base.
     *
     * @default 5
     * @type {number}
     */
    startWidth: number;
    /**
     * rotation direction
     * @type {"any" | "clockWise" | "CounterClockWise"}
     * @default "any"
     */
    rotationDirection: "any" | "clockWise" | "CounterClockWise";
}
/**
 * Defines events for [[ClockHand]].
 */
export interface IClockHandEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[ClockHand]].
 *
 * @see {@link Adapter}
 */
export interface IClockHandAdapters extends IContainerAdapters, IClockHandProperties {
}
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
export declare class ClockHand extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IClockHandProperties}
     */
    _properties: IClockHandProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IClockHandAdapters}
     */
    _adapter: IClockHandAdapters;
    /**
     * Defines available events.
     *
     * @type {IClockHandEvents}
     * @ignore Exclude from docs
     */
    _events: IClockHandEvents;
    /**
     * A circle element used as hand's base.
     *
     * @type {Circle}
     */
    protected _pin: Circle;
    /**
     * A trapezoid shape used for hand itself.
     *
     * @type {Trapezoid}
     */
    protected _hand: Trapezoid;
    /**
     * An Axis hand is related to.
     *
     * @type {MutableValueDisposer<Axis>}
     */
    protected _axis: MutableValueDisposer<Axis>;
    /**
     * Hand's current value.
     *
     * @type {any}
     */
    protected _value: any;
    /**
     * Constructor
     */
    constructor();
    /**
     * Re(validates) the clock hand, effectively redrawing it.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * @return {Circle} Pin element
     */
    /**
     * A circle element used as hand's base. (pin)
     *
     * @param {Circle}  pin  Pin element
     */
    pin: Circle;
    /**
     * @return {Trapezoid} Hand element
     */
    /**
     * A trapezoid shape used for hand itself.
     *
     * The shape of the trapezoid is controlled by ClockHand's `startWidth` and
     * `endWidth` properties.
     *
     * Set `endWidth` to 1 (px) to make it pointy.
     *
     * @param {Trapezoid}  hand  Hand element
     */
    hand: Trapezoid;
    /**
     * @return {number} Radius
     */
    /**
     * Radius of the hand's outer end. (tip)
     *
     * Absolute (px) or relative ([[Percent]]).
     *
     * @default Percent(0)
     * @param {number | Percent}  value  Radius
     */
    radius: number | Percent;
    /**
     * @return {number} Radius
     */
    /**
     * Radius of the hand's inner end. (base)
     *
     * Absolute (px) or relative ([[Percent]]).
     *
     * @default Percent(0)
     * @param {number | Percent}  value  Radius
     */
    innerRadius: number | Percent;
    /**
     * @return {number} Width (px)
     */
    /**
     * Width, in pixels, of the clock hand's inner end. (base)
     *
     * @default 5
     * @param {number}  value  Width (px)
     */
    startWidth: number;
    /**
     * @return {number} Width (px)
     */
    /**
     * Width, in pixels, of the clock hand's outer end. (tip)
     *
     * @default 1
     * @param {number}  value  Width (px)
     */
    endWidth: number;
    /**
     * @return {"any" | "clockWise" | "counterClockWise"} rotationDirection
     */
    /**
     * Rotation direction
     *
     * @default any
     * @param {"any" | "clockWise" | "counterClockWise"}  value
     */
    rotationDirection: "any" | "clockWise" | "counterClockWise";
    /**
     * Moves clock hand to particular value.
     *
     * If `duration` is set to a number in milliseconds, the hand will move
     * to the new position gracefully, rather than jumping rigth to it.
     *
     * Alternatively, you can also set `value` directly.
     *
     * @param {any}     value     New value
     * @param {number}  duration  Animation duration (ms)
     * @param {(value:number)=>number}  easing  Animation easing function
     */
    showValue(value: any, duration?: number, easing?: (value: number) => number): void;
    /**
     * @return {any} Value
     */
    /**
     * A current value clock hand is pointing to.
     *
     * @param {any}  value  Value
     */
    value: any;
    /**
     * @return {Axis} Axis
     */
    /**
     * An Axis clock hand is associated with.
     *
     * Hand's `value` relates to values on the Axis.
     *
     * @param {Axis}  axis  Axis
     */
    axis: Axis;
    /**
     * Triggers `value` accessor, so that Hand animates to new position, in case
     * value has changed.
     *
     * @ignore Exclude from docs
     */
    protected updateValue(): void;
    /**
 * Processes JSON-based config before it is applied to the object.
 *
 * @ignore Exclude from docs
 * @param {object}  config  Config
 */
    processConfig(config?: {
        [index: string]: any;
    }): void;
}
