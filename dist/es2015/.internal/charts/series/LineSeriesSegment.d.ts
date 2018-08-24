/**
 * Line series segment module.
 * @todo Add description about what this is
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Sprite } from "../../core/Sprite";
import { IPoint } from "../../core/defs/IPoint";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[LineSeriesSegment]].
 */
export interface ILineSeriesSegmentProperties extends IContainerProperties {
}
/**
 * Defines events for [[LineSeriesSegment]].
 */
export interface ILineSeriesSegmentEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[LineSeriesSegment]].
 *
 * @see {@link Adapter}
 */
export interface ILineSeriesSegmentAdapters extends IContainerAdapters, ILineSeriesSegmentProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Represents a line series segment.
 *
 * A line segment can be used to apply different properties to a part of the
 * line series, between two data points.
 *
 * @see {@link ILineSeriesSegmentEvents} for a list of available events
 * @see {@link ILineSeriesSegmentAdapters} for a list of available Adapters
 * @todo Example
 */
export declare class LineSeriesSegment extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ILineSeriesSegmentPropertiess}
     */
    _properties: ILineSeriesSegmentProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ILineSeriesSegmentAdapters}
     */
    _adapter: ILineSeriesSegmentAdapters;
    /**
     * Defines available events.
     *
     * @type {ILineSeriesSegmentEvents}
     * @ignore Exclude from docs
     */
    _events: ILineSeriesSegmentEvents;
    /**
     * Segment's line element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    strokeSprite: Sprite;
    /**
     * Segment's fill element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    fillSprite: Sprite;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the series segment.
     *
     * @ignore Exclude from docs
     * @param {IPoint[]}  points       Points to connect
     * @param {IPoint[]}  closePoints  ?
     * @param {number}    smoothnessX  Horizontal bezier setting (?)
     * @param {number}    smoothnessY  Vertical bezier setting (?)
     */
    drawSegment(points: IPoint[], closePoints: IPoint[], smoothnessX: number, smoothnessY: number): void;
    /**
     * Copies properties from a [[Sprite]] to both line and fill elements.
     *
     * @param {Sprite} source Source [[Sprite]] to copy properties from
     */
    copyFrom(source: this): void;
}
