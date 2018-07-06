/**
 * SankeyNode module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { FlowDiagramNode, IFlowDiagramNodeAdapters, IFlowDiagramNodeEvents, IFlowDiagramNodeProperties } from "./FlowDiagramNode";
import { SankeyDiagram, SankeyDiagramDataItem } from "../types/SankeyDiagram";
import { LabelBullet } from "./LabelBullet";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[SankeyNode]].
 */
export interface ISankeyNodeProperties extends IFlowDiagramNodeProperties {
    /**
     * A level node is at. (0 - ...)
     *
     * @type {number}
     */
    level?: number;
}
/**
 * Defines events for [[SankeyNode]].
 */
export interface ISankeyNodeEvents extends IFlowDiagramNodeEvents {
}
/**
 * Defines adapters for [[SankeyNode]].
 *
 * @see {@link Adapter}
 */
export interface ISankeyNodeAdapters extends IFlowDiagramNodeAdapters, ISankeyNodeProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a node in a Sankey Diagram.
 *
 * A Sankey node is a block with a value, which represents its size on the
 * diagram.
 *
 * Nodes are connected via [[SankeyLink]] elements.
 *
 * @see {@link ISankeyNodeEvents} for a list of available events
 * @see {@link ISankeyNodeAdapters} for a list of available Adapters
 * @important
 */
export declare class SankeyNode extends FlowDiagramNode {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ISankeyNodeProperties}
     */
    _properties: ISankeyNodeProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ISankeyNodeAdapters}
     */
    _adapter: ISankeyNodeAdapters;
    /**
     * Defines available events.
     *
     * @type {ISankeyNodeEvents}
     * @ignore Exclude from docs
     */
    _events: ISankeyNodeEvents;
    /**
     * [nextInCoord description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {number}
     */
    nextInCoord: number;
    /**
     * [nextOutCoord description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {number}
     */
    nextOutCoord: number;
    /**
     * A chart instance this node is added to.
     *
     * @type {SankeyDiagram}
     */
    chart: SankeyDiagram;
    /**
     * Defines the type of the [[SankeyDiagramDataItem]] used in the class.
     *
     * @ignore Exclude from docs
     * @type {SankeyDiagramDataItem}
     */
    _dataItem: SankeyDiagramDataItem;
    /**
     * A label element which shows node's value.
     *
     * @type {LabelBullet}
     */
    valueLabel: LabelBullet;
    /**
     * A label element which shows node's name.
     *
     * @type {LabelBullet}
     */
    nameLabel: LabelBullet;
    /**
     * Constructor
     */
    constructor();
    /**
     * Invalidates all links, attached to this node.
     *
     * @ignore Exclude from docs
     */
    invalidateLinks(): void;
    /**
     * Positions the bullet so it is centered within the node element.
     *
     * @param {LabelBullet}  bullet  Target bullet
     */
    protected positionBullet(bullet: LabelBullet): void;
    /**
     * @return {number} Level
     */
    /**
     * A level node is displayed at. (0 - ...)
     *
     * Levels are measured from left to right.
     *
     * The nodes in the left-most column will have `level = 0`.
     *
     * Nodes in second column - `level = 1`, etc.
     *
     * @param {number}  value  Level
     */
    level: number;
    /**
     * Copies properties and labels from another [[SankeyNode]].
     *
     * @param {SankeyNode}  source  Source node
     */
    copyFrom(source: this): void;
}
