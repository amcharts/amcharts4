import { SankeyDiagramDataItem } from "../types/SankeyDiagram";
import { FlowDiagramLink, IFlowDiagramLinkAdapters, IFlowDiagramLinkEvents, IFlowDiagramLinkProperties } from "./FlowDiagramLink";
import { Polyspline } from "../../core/elements/Polyspline";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[SankeyLink]].
 */
export interface ISankeyLinkProperties extends IFlowDiagramLinkProperties {
    /**
     * [tension description]
     *
     * @todo Description
     * @type {number}
     */
    tension?: number;
    /**
     * [startX description]
     *
     * @todo Description
     * @type {number}
     */
    startX?: number;
    /**
     * [startY description]
     *
     * @todo Description
     * @type {number}
     */
    startY?: number;
    /**
     * [endX description]
     *
     * @todo Description
     * @type {number}
     */
    endX?: number;
    /**
     * [endY description]
     *
     * @todo Description
     * @type {number}
     */
    endY?: number;
    /**
     * [linkWidth description]
     *
     * @todo Description
     * @type {number}
     */
    linkWidth?: number;
    /**
     * [controlPointDistance description]
     *
     * @todo Description
     * @type {number}
     */
    controlPointDistance?: number;
}
/**
 * Defines events for [[SankeyLink]].
 */
export interface ISankeyLinkEvents extends IFlowDiagramLinkEvents {
}
/**
 * Defines adapters for [[SankeyLink]].
 *
 * @see {@link Adapter}
 */
export interface ISankeyLinkAdapters extends IFlowDiagramLinkAdapters, ISankeyLinkProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Sankey Diagram.
 *
 * @see {@link ISankeyLinkEvents} for a list of available events
 * @see {@link ISankeyLinkAdapters} for a list of available Adapters
 * @important
 */
export declare class SankeyLink extends FlowDiagramLink {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ISankeyLinkProperties}
     */
    _properties: ISankeyLinkProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ISankeyLinkAdapters}
     */
    _adapter: ISankeyLinkAdapters;
    /**
     * Defines available events.
     *
     * @type {ISankeyLinkEvents}
     * @ignore Exclude from docs
     */
    _events: ISankeyLinkEvents;
    /**
     * Defines a type of data item used by this class.
     *
     * @ignore Exclude from docs
     * @type {SankeyDiagramDataItem}
     */
    _dataItem: SankeyDiagramDataItem;
    /**
     * Spline which goes through the middle of a link, used to calculate bullet and tooltip positions, invisible by default
     * @type Polyspline
     */
    middleLine: Polyspline;
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
     * @return {number} Start X
     */
    /**
     * [startX description]
     *
     * @todo Description
     * @param {number}  value  Start X
     */
    startX: number;
    /**
     * @return {number} End X
     */
    /**
     * [endX description]
     *
     * @todo Description
     * @param {number} value  End X
     */
    endX: number;
    /**
     * @return {number} Start Y
     */
    /**
     * [startY description]
     *
     * @todo Description
     * @param {number}  value  Start Y
     */
    startY: number;
    /**
     * @return {number} End Y
     */
    /**
     * [endY description]
     *
     * @todo Description
     * @param {number} value End Y
     */
    endY: number;
    /**
     * @return {number} [description]
     */
    /**
     * [linkWidth description]
     *
     * @todo Description
     * @param {number} value [description]
     */
    linkWidth: number;
    /**
     * @return {number} relative control point distance
     */
    /**
     * Distance of control point of a link, defines relative distance from a node at which linke should bend
     * @default 0.2
     * @param {number}  value
     */
    controlPointDistance: number;
    /**
     * @return {number} tension value
     */
    /**
     * Tension of a spline, 1 would make the link to have sharp edges
     * @default 0.8
     * @param {number} value
     */
    tension: number;
}
