/**
 * Module that defines everything related to building Columns.
 * It is a container which has column element which is a RoundedRectangle.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Column]].
 */
export interface IColumnProperties extends IContainerProperties {
}
/**
 * Defines events for [[Column]].
 */
export interface IColumnEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[Column]].
 *
 * @see {@link Adapter}
 */
export interface IColumnAdapters extends IContainerAdapters, IColumnProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates Columns.
 *
 * @see {@link IColumnEvents} for a list of available events
 * @see {@link IColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export declare class Column extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IColumnProperties}
     */
    _properties: IColumnProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IColumnAdapters}
     */
    _adapter: IColumnAdapters;
    /**
     * Defines available events.
     *
     * @type {IColumnEvents}
     * @ignore Exclude from docs
     */
    _events: IColumnEvents;
    /**
     * column element
     * @type {RoundedRectangle}
     */
    column: RoundedRectangle;
    /**
     * Constructor
     */
    constructor();
    protected createAssets(): void;
    /**
     * Validates element:
     * * Triggers events
     * * Redraws the element
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Copies all parameters from another [[Sprite]].
     *
     * @param {Sprite} source Source Sprite
     */
    copyFrom(source: this): void;
}
