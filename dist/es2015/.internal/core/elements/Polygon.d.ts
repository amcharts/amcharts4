/**
 * Polygon module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../Sprite";
import { IPoint } from "../defs/IPoint";
import { Morpher } from "../utils/Morpher";
import { IMorphable } from "../defs/IMorphable";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Polygon]].
 */
export interface IPolygonProperties extends ISpriteProperties {
    /**
     * An array of X/Y coordinates for each elbow of the polygon.
     */
    points?: IPoint[][][];
}
/**
 * Defines events for [[Polygon]].
 */
export interface IPolygonEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[Polygon]].
 *
 * @see {@link Adapter}
 */
export interface IPolygonAdapters extends ISpriteAdapters, IPolygonProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Draws a polygon.
 *
 * @see {@link IPolygonEvents} for a list of available events
 * @see {@link IPolygonAdapters} for a list of available Adapters
 */
export declare class Polygon extends Sprite implements IMorphable {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IPolygonProperties}
     */
    _properties: IPolygonProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IPolygonAdapters}
     */
    _adapter: IPolygonAdapters;
    /**
     * Defines available events.
     *
     * @type {IPolygonEvents}
     * @ignore Exclude from docs
     */
    _events: IPolygonEvents;
    /**
     * A morpher instance that is used to morph polygon into some other shape.
     *
     * @type {Optional<Morpher>}
     */
    protected _morpher: $type.Optional<Morpher>;
    /**
     * Current points that morpher uses. This is needed so that we don't
     * overwrite polygons original points.
     *
     * @type {IPoint[][][]}
     */
    protected _currentPoints: IPoint[][][];
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {IPoint[]} Polygon points
     */
    /**
     * An array of X/Y coordinates for each elbow of the polygon.
     *
     * @todo Example
     * @param {IPoint[][][]}  points  Polygon points
     */
    points: IPoint[][][];
    /**
     * @return {IPoint[]} Polygon points
     */
    /**
     * Current points. Used when morphing the element, so that original `points`
     * are not overwritten.
     *
     * @param {IPoint[][][]}  points  Polygon points
     */
    currentPoints: IPoint[][][];
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * Measures element
     */
    protected measureElement(): void;
    /**
     * A calculated center point for the shape.
     *
     * @readonly
     * @return {IPoint} Center
     */
    readonly centerPoint: IPoint;
    /**
     * A [[Morpher]] instance that is used to morph polygon into some other
     * shape.
     *
     * @readonly
     * @return {Morpher} Morpher instance
     */
    readonly morpher: Morpher;
}
