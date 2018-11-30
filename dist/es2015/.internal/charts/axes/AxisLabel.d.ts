/**
 * Axis Label module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Label, ILabelProperties, ILabelAdapters, ILabelEvents } from "../../core/elements/Label";
import { AxisItemLocation, AxisDataItem, Axis } from "./Axis";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AxisLabel]].
 */
export interface IAxisLabelProperties extends ILabelProperties {
    /**
     * Relative location of the label. (0-1)
     *
     * @type {number}
     */
    location?: number;
    /**
     * Draw the label on the inside of the Axis?
     *
     * @type {boolean}
     */
    inside?: boolean;
}
/**
 * Defines events for [[AxisLabel]].
 */
export interface IAxisLabelEvents extends ILabelEvents {
}
/**
 * Defines adapters for [[AxisLabel]].
 *
 * @see {@link Adapter}
 */
export interface IAxisLabelAdapters extends ILabelAdapters, IAxisLabelProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Use to create labels on Axis.
 *
 * @see {@link IAxisLabelEvents} for a list of available events
 * @see {@link IAxisLabelAdapters} for a list of available Adapters
 * @important
 */
export declare class AxisLabel extends Label {
    /**
     * Defines available properties.
     *
     * @type {IAxisLabelProperties}
     */
    _properties: IAxisLabelProperties;
    /**
     * Defines available adapters.
     *
     * @type {IAxisLabelAdapters}
     */
    _adapter: IAxisLabelAdapters;
    /**
     * Defines available events.
     *
     * @type {IAxisLabelEvents}
     */
    _events: IAxisLabelEvents;
    /**
     * Related data item.
     *
     * @type {AxisDataItem}
     */
    _dataItem: AxisDataItem;
    /**
     * A referecent to Axis element this fill is applied to.
     *
     * @type {Axis}
     */
    axis: Axis;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {AxisItemLocation} Location (0-1)
     */
    /**
     * Relative location of the label. (0-1)
     *
     * @param {AxisItemLocation}  value  Location (0-1)
     */
    location: AxisItemLocation;
    /**
     * Returns if label is set to be drawn inside axis.
     *
     * @return {boolean} Inside?
     */
    /**
     * Sets if label should be drawn inside axis.
     *
     * @param {boolean}  value  Inside?
     */
    inside: boolean;
    /**
     * @ignore
     */
    protected setDisabled(value: boolean): boolean;
}
