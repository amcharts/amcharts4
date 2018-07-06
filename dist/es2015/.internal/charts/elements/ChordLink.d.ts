import { ChordDiagramDataItem } from "../types/ChordDiagram";
import { FlowDiagramLink, IFlowDiagramLinkAdapters, IFlowDiagramLinkEvents, IFlowDiagramLinkProperties } from "./FlowDiagramLink";
import { QuadraticCurve } from "../../core/elements/QuadraticCurve";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[ChordLink]].
 */
export interface IChordLinkProperties extends IFlowDiagramLinkProperties {
    /**
     * [radius description]
     *
     * @todo Description
     * @type {number}
     */
    radius?: number;
    /**
     * [arc description]
     *
     * @todo Description
     * @type {number}
     */
    arc?: number;
}
/**
 * Defines events for [[ChordLink]].
 */
export interface IChordLinkEvents extends IFlowDiagramLinkEvents {
}
/**
 * Defines adapters for [[ChordLink]].
 *
 * @see {@link Adapter}
 */
export interface IChordLinkAdapters extends IFlowDiagramLinkAdapters, IChordLinkProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Chord Diagram.
 *
 * @see {@link IChordLinkEvents} for a list of available events
 * @see {@link IChordLinkAdapters} for a list of available Adapters
 * @important
 */
export declare class ChordLink extends FlowDiagramLink {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IChordLinkProperties}
     */
    _properties: IChordLinkProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IChordLinkAdapters}
     */
    _adapter: IChordLinkAdapters;
    /**
     * Defines available events.
     *
     * @type {IChordLinkEvents}
     * @ignore Exclude from docs
     */
    _events: IChordLinkEvents;
    /**
     * Defines a type of data item used by this class.
     *
     * @ignore Exclude from docs
     * @type {ChordDiagramDataItem}
     */
    _dataItem: ChordDiagramDataItem;
    /**
     * Spline which goes through the middle of a link, used to calculate bullet and tooltip positions, invisible by default
     * @type Polyspline
     */
    middleLine: QuadraticCurve;
    /**
     * Constructor
     */
    constructor();
    /**
     * (Re)validates (redraws) the link.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * @return {number} End Y
     */
    /**
     * [radius description]
     *
     * @todo Description
     * @param {number} value End Y
     */
    radius: number;
    /**
     * @return {number} [description]
     */
    /**
     * [arc description]
     *
     * @todo Description
     * @param {number} value [description]
     */
    arc: number;
}
