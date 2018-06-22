/**
 * Module that defines everything related to building RadarColumns.
 * It is a container which has radarColumn element which is a Slice.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Column, IColumnProperties, IColumnAdapters, IColumnEvents } from "./Column";
import { Slice } from "../../core/elements/Slice";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[RadarColumn]].
 */
export interface IRadarColumnProperties extends IColumnProperties {
}
/**
 * Defines events for [[RadarColumn]].
 */
export interface IRadarColumnEvents extends IColumnEvents {
}
/**
 * Defines adapters for [[RadarColumn]].
 *
 * @see {@link Adapter}
 */
export interface IRadarColumnAdapters extends IColumnAdapters, IRadarColumnProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates RadarColumns.
 *
 * @see {@link IRadarColumnEvents} for a list of available events
 * @see {@link IRadarColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export declare class RadarColumn extends Column {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IRadarColumnProperties}
     */
    _properties: IRadarColumnProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IRadarColumnAdapters}
     */
    _adapter: IRadarColumnAdapters;
    /**
     * Defines available events.
     *
     * @type {IRadarColumnEvents}
     * @ignore Exclude from docs
     */
    _events: IRadarColumnEvents;
    /**
     * Radar column element
     * @type {Slice}
     */
    radarColumn: Slice;
    /**
     * Constructor
     */
    constructor();
    createAssets(): void;
    copyFrom(source: this): void;
    /**
     * X coordinate for the slice tooltip.
     *
     * @return {number} X
     */
    protected getTooltipX(): number;
    /**
     * Y coordinate for the slice tooltip.
     *
     * @return {number} Y
     */
    protected getTooltipY(): number;
}
