/**
 * A module for the mini-map control.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Sprite, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { Rectangle } from "../../core/elements/Rectangle";
import { MapChart } from "../types/MapChart";
import { MapSeries } from "./MapSeries";
import { ListTemplate, IListEvents } from "../../core/utils/List";
import { MutableValueDisposer } from "../../core/utils/Disposer";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[SmallMap]].
 */
export interface ISmallMapProperties extends IContainerProperties {
}
/**
 * Defines events for [[SmallMap]].
 */
export interface ISmallMapEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[SmallMap]].
 *
 * @see {@link Adapter}
 */
export interface ISmallMapAdapters extends IContainerAdapters, ISmallMapProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a "bird's eye" view of the whole map.
 *
 * This control creates a mini-map with the whole of the map, highlighting
 * the area which is in the current viewport of the map map.
 *
 * @see {@link ISmallMapEvents} for a list of available events
 * @see {@link ISmallMapAdapters} for a list of available Adapters
 * @important
 */
export declare class SmallMap extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {SmallMaPproperties}
     */
    _properties: ISmallMapProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ISmallMapAdapters}
     */
    _adapter: ISmallMapAdapters;
    /**
     * Event dispatcher.
     *
     * @type {SpriteEventDispatcher<AMEvent<SmallMap, ISmallMapEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<SmallMap, ISmallMapEvents>>;
    /**
     * A target map.
     *
     * @type {MutableValueDisposer<MapChart>}
     */
    protected _chart: MutableValueDisposer<MapChart>;
    /**
     * A list of map series used to draw the mini-map.
     *
     * @type {ListTemplate<MapSeries>}
     */
    series: ListTemplate<MapSeries>;
    /**
     * A container that holds the visual elements for the mini-map.
     *
     * @ignore Exclude from docs
     * @type {Container}
     */
    seriesContainer: Container;
    /**
     * The rectangle element which highlights current viewport.
     *
     * @type {Rectangle}
     */
    rectangle: Rectangle;
    /**
     * Constructor
     */
    constructor();
    /**
     * Moves main map pan position after click on the small map.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["hit"]}  event  Event
     */
    moveToPosition(event: AMEvent<Sprite, ISpriteEvents>["hit"]): void;
    /**
     * Decorates a new [[MapSeries]] object with required parameters when it is
     * added to the chart.
     *
     * @param {IListEvents<MapSeries>["insert"]} event [description]
     */
    processSeries(event: IListEvents<MapSeries>["insert"]): void;
    /**
     * @return {MapChart} Chart/map
     */
    /**
     * A chart/map that this control is meant for.
     *
     * @param {MapChart}  chart  Chart/map
     */
    chart: MapChart;
    /**
     * Updates the viewport recangle as per current map zoom/pan position.
     *
     * @ignore Exclude from docs
     */
    updateRectangle(): void;
    /**
     * Update map size so that internal elements can redraw themselves after
     * the size of the small map changes.
     *
     * @ignore Exclude from docs
     */
    updateMapSize(): void;
    /**
     * Update elements after drawing the small map.
     */
    protected afterDraw(): void;
}
