/**
 * SankeyNode module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { SankeyDiagram, SankeyDiagramDataItem } from "../types/SankeyDiagram";
import { List } from "../../core/utils/List";
import { LabelBullet } from "./LabelBullet";
import { Color } from "../../core/utils/Color";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[SankeyNode]].
 */
export interface ISankeyNodeProperties extends IContainerProperties {
    /**
     * Name of the node.
     *
     * @type {string}
     */
    name?: string;
    /**
     * A level node is at. (0 - ...)
     *
     * @type {number}
     */
    level?: number;
    /**
     * Node's numeric value.
     *
     * @type {number}
     */
    value?: number;
    /**
     * Node's color.
     *
     * @type {Color}
     */
    color?: Color;
}
/**
 * Defines events for [[SankeyNode]].
 */
export interface ISankeyNodeEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[SankeyNode]].
 *
 * @see {@link Adapter}
 */
export interface ISankeyNodeAdapters extends IContainerAdapters, ISankeyNodeProperties {
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
export declare class SankeyNode extends Container {
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
     * A list of data items of the items coming in from another node, one level
     * up.
     *
     * These are what ingoing links are build out of.
     *
     * @type {List<SankeyDiagramDataItem>}
     */
    protected _incomingDataItems: List<SankeyDiagramDataItem>;
    /**
     * A list of data items of the items going out of the node.
     *
     * These are what outgoing links are build out of.
     *
     * @type {List<SankeyDiagramDataItem>}
     */
    protected _outgoingDataItems: List<SankeyDiagramDataItem>;
    /**
     * Sorted list of incoming items.
     *
     * @type {Iterator<SankeyDiagramDataItem>}
     */
    protected _incomingSorted: $iter.Iterator<SankeyDiagramDataItem>;
    /**
     * Sorted list of outgoing items.
     * @type {Iterator<SankeyDiagramDataItem>}
     */
    protected _outgoingSorted: $iter.Iterator<SankeyDiagramDataItem>;
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
     * Defines the type of the [[SankeyDiagramDataItem]] used in the class.
     *
     * @ignore Exclude from docs
     * @type {SankeyDiagramDataItem}
     */
    _dataItem: SankeyDiagramDataItem;
    /**
     * Constructor
     */
    constructor();
    /**
     * Marks node as invalid, for redrawal in the next update cycle.
     *
     * @ignore Exclude from docs
     */
    invalidate(): void;
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
     * List of incoming items (links).
     *
     * @readonly
     * @return {List<SankeyDiagramDataItem>} Incoming items
     */
    readonly incomingDataItems: List<SankeyDiagramDataItem>;
    /**
     * List of outgoing items (links).
     *
     * @readonly
     * @return {List<SankeyDiagramDataItem>} Outgoing items
     */
    readonly outgoingDataItems: List<SankeyDiagramDataItem>;
    /**
     * @return {string} Name
     */
    /**
     * A name of the node.
     *
     * @param {string}  value  Name
     */
    name: string;
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
     * @return {number} Value
     */
    /**
     * Node's numeric value.
     *
     * @param {number}  value  Value
     */
    value: number;
    /**
     * @return {Color} Color
     */
    /**
     * Node's color.
     *
     * @param {Color}  value  Color
     */
    color: Color;
    /**
     * Copies properties and labels from another [[SankeyNode]].
     *
     * @param {SankeyNode}  source  Source node
     */
    copyFrom(source: this): void;
}
