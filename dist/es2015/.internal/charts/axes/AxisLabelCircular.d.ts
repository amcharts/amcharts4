/**
 * Axis Label module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisLabel, IAxisLabelProperties, IAxisLabelAdapters, IAxisLabelEvents } from "./AxisLabel";
import { IPoint } from "../../core/defs/IPoint";
import { Percent } from "../../core/utils/Percent";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AxisLabelCircular]].
 */
export interface IAxisLabelCircularProperties extends IAxisLabelProperties {
    /**
     * Rotation angle of the label in relation to circle line.
     *
     * @type {number}
     */
    relativeRotation?: number;
    /**
     * Distance of the label from circle line.
     *
     * @type {number}
     */
    radius?: number;
}
/**
 * Defines events for [[AxisLabelCircular]].
 */
export interface IAxisLabelCircularEvents extends IAxisLabelEvents {
}
/**
 * Defines adapters for [[AxisLabelCircular]].
 *
 * @see {@link Adapter}
 */
export interface IAxisLabelCircularAdapters extends IAxisLabelAdapters, IAxisLabelCircularProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Use to create labels on circular axis.
 *
 * @see {@link IAxisLabelCircularEvents} for a list of available events
 * @see {@link IAxisLabelCircularAdapters} for a list of available Adapters
 */
export declare class AxisLabelCircular extends AxisLabel {
    /**
     * Defines available properties.
     *
     * @type {IAxisLabelCircularProperties}
     */
    _properties: IAxisLabelCircularProperties;
    /**
     * Defines available adapters.
     *
     * @type {IAxisLabelCircularAdapters}
     */
    _adapter: IAxisLabelCircularAdapters;
    /**
     * Defines available events.
     *
     * @type {IAxisLabelCircularEvents}
     */
    _events: IAxisLabelCircularEvents;
    /**
     * Related data item.
     *
     * @type {any}
     */
    _dataItem: any;
    /**
     *
     * @type {number}
     * @ignore
     */
    fdx: number;
    /**
     *
     * @type {number}
     * @ignore
     */
    fdy: number;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Rotation angle
     */
    /**
     * Relative rotation of the label.
     *
     * It is an angle to circle. In case 90, labels will be positioned like rays
     * of light, if 0 - positione along the circle.
     *
     * @param {number} value Rotation angle
     */
    relativeRotation: number;
    /**
     * @return {number} Distance (px)
     */
    /**
     * Distance from axis circle to label in pixels or percent.
     *
     * @param {number} value Distance (px or percent)
     */
    radius: number | Percent;
    /**
     * returns label radius in pixels
     */
    pixelRadius(axisRadius: number): number;
    /**
     * [fixPoint description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {IPoint}  point       Label affixation point
     * @param  {number}  axisRadius  Distance from point (px)
     * @return {IPoint}              [description]
     */
    fixPoint(point: IPoint, axisRadius: number): IPoint;
}
