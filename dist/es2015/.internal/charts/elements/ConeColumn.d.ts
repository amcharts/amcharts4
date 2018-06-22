/**
 * Module that defines everything related to building Cone Columns.
 * It is a container which has coneColumn element which is a Cone.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Column, IColumnProperties, IColumnAdapters, IColumnEvents } from "./Column";
import { Cone } from "../../core/elements/3d/Cone";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[ConeColumn]].
 */
export interface IConeColumnProperties extends IColumnProperties {
}
/**
 * Defines events for [[ConeColumn]].
 */
export interface IConeColumnEvents extends IColumnEvents {
}
/**
 * Defines adapters for [[ConeColumn]].
 *
 * @see {@link Adapter}
 */
export interface IConeColumnAdapters extends IColumnAdapters, IConeColumnProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates ConeColumns.
 *
 * @see {@link IConeColumnEvents} for a list of available events
 * @see {@link IConeColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export declare class ConeColumn extends Column {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IConeColumnProperties}
     */
    _properties: IConeColumnProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IConeColumnAdapters}
     */
    _adapter: IConeColumnAdapters;
    /**
     * Defines available events.
     *
     * @type {IConeColumnEvents}
     * @ignore Exclude from docs
     */
    _events: IConeColumnEvents;
    /**
     * Radar column element
     * @type {Slice}
     */
    coneColumn: Cone;
    /**
     * Constructor
     */
    constructor();
    createAssets(): void;
    copyFrom(source: this): void;
}
