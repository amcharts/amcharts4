/**
 * Polyline module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../Sprite";
import { IPoint, IOrientationPoint } from "../defs/IPoint";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Polyline]].
 */
export interface IPolylineProperties extends ISpriteProperties {
    /**
     * A list of segment coordinates for the multi-part line.
     *
     * @type {IPoint[][]}
     */
    segments?: IPoint[][];
}
/**
 * Defines events for [[Polyline]].
 */
export interface IPolylineEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[Polyline]].
 *
 * @see {@link Adapter}
 */
export interface IPolylineAdapters extends ISpriteAdapters, IPolylineProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a polyline.
 *
 * @see {@link IPolylineEvents} for a list of available events
 * @see {@link IPolylineAdapters} for a list of available Adapters
 */
export declare class Polyline extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IPolylineProperties}
     */
    _properties: IPolylineProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IPolylineAdapters}
     */
    _adapter: IPolylineAdapters;
    /**
     * Defines available events.
     *
     * @type {IPolylineEvents}
     * @ignore Exclude from docs
     */
    _events: IPolylineEvents;
    /**
     * [_distance description]
     *
     * @todo Description
     * @type {number}
     */
    protected _distance: number;
    /**
     * [_realSegments]
     *
     * @todo Description
     * @type {Optional<IPoint[][]>}
     */
    protected _realSegments: $type.Optional<IPoint[][]>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Creats and adds an SVG path for the arc.
     *
     * @ignore Exclude from docs
     */
    makePath(): void;
    /**
     * @return {Optional<IPoint[]>} Segments
     */
    /**
     * A list of segment coordinates for the multi-part line.
     *
     * @todo Example
     * @param {Optional<IPoint[][]>}  segments  Segments
     */
    segments: $type.Optional<IPoint[][]>;
    /**
     * [distance description]
     *
     * @todo Description
     * @return {number} [description]
     */
    readonly distance: number;
    /**
     * Converts relative position along the line (0-1) into pixel coordinates.
     *
     * @param  {number}             position  Position (0-1)
     * @return {IOrientationPoint}            Coordinates
     */
    positionToPoint(position: number): IOrientationPoint;
}
