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
import { IRectangle } from "../../core/defs/IRectangle";
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
     * @type {IColumnProperties}
     */
    _properties: IColumnProperties;
    /**
     * Defines available adapters.
     *
     * @type {IColumnAdapters}
     */
    _adapter: IColumnAdapters;
    /**
     * Defines available events.
     *
     * @type {IColumnEvents}
     */
    _events: IColumnEvents;
    /**
     * column element
     * @type {RoundedRectangle}
     */
    column: RoundedRectangle;
    /**
     * @ignore
     */
    realWidth: number;
    /**
     * @ignore
     */
    realHeight: number;
    /**
     * @ignore
     */
    realX: number;
    /**
     * @ignore
     */
    realY: number;
    /**
     * Constructor
     */
    constructor();
    /**
     * @ignore
     */
    protected handleKidAdded(): void;
    /**
     * @ignore
     */
    protected createAssets(): void;
    /**
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Copies all parameters from another [[Column]].
     *
     * @param {Column} source Source Column
     */
    copyFrom(source: this): void;
    /**
     * Returns bounding box (square) for this element.
     *
     * @ignore Exclude from docs
     * @type {IRectangle}
     */
    readonly bbox: IRectangle;
}
