/**
 * Grip module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Button, IButtonProperties, IButtonAdapters, IButtonEvents } from "./Button";
import { Align } from "../defs/Align";
import { VerticalAlign } from "../defs/VerticalAlign";
import { IDisposer } from "../../core/utils/Disposer";
import { Optional } from "../utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Grip]].
 */
export interface IGripProperties extends IButtonProperties {
    position: Align | VerticalAlign;
    autoHideDelay: number;
}
/**
 * Defines events for [[Grip]] for [[Grip]].
 */
export interface IGripEvents extends IButtonEvents {
}
/**
 * Defines adapters for [[Grip]].
 *
 * @see {@link Adapter}
 */
export interface IGripAdapters extends IButtonAdapters, IGripProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a grip element that can be used for scrolling or other things.
 *
 * @see {@link IGripEvents} for a list of available events
 * @see {@link IGripAdapters} for a list of available Adapters
 * @since 4.4.0
 */
export declare class Grip extends Button {
    /**
     * Defines available properties.
     */
    _properties: IGripProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IGripAdapters;
    /**
     * Defines available events.
     */
    _events: IGripEvents;
    /**
 * Disposer for grip autohide timeout.
 */
    protected _autoHideTimeout: Optional<IDisposer>;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return Position
     */
    /**
     * Sets position of the grip.
     *
     * Available options: "left", "right" (default), "top", "bottom".
     *
     * @param  value  Position
     */
    position: Align | VerticalAlign;
    /**
     * @return Delay
     */
    /**
     * Number of milliseconds to show grip until it is hidden automatically.
     *
     * @default 3000
     * @param  value  Delay
     */
    autoHideDelay: number;
}
