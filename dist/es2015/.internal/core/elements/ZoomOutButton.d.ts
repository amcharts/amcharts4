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
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[ZoomOutButton]].
 */
export interface IZoomOutButtonProperties extends IButtonProperties {
}
/**
 * Defines events for [[ZoomOutButton]].
 */
export interface IZoomOutButtonEvents extends IButtonEvents {
}
/**
 * Defines adapters for [[ZoomOutButton]].
 *
 * @see {@link Adapter}
 */
export interface IZoomOutButtonAdapters extends IButtonAdapters, IZoomOutButtonProperties {
}
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
export declare class ZoomOutButton extends Button {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IZoomOutButtonProperties}
     */
    _properties: IZoomOutButtonProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IZoomOutButtonAdapters}
     */
    _adapter: IZoomOutButtonAdapters;
    /**
     * Defines available events.
     *
     * @type {IZoomOutButtonEvents}
     * @ignore Exclude from docs
     */
    _events: IZoomOutButtonEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
}
