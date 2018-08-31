/**
 * FlowDiagramNode module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { FlowDiagram, FlowDiagramDataItem } from "../types/FlowDiagram";
import { List } from "../../core/utils/List";
import { Color } from "../../core/utils/Color";
import * as $iter from "../../core/utils/Iterator";
import { LegendSettings, LegendDataItem } from "../Legend";
import { Animation } from "../../core/utils/Animation";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[FlowDiagramNode]].
 */
export interface IFlowDiagramNodeProperties extends IContainerProperties {
    /**
     * Name of the node.
     *
     * @type {string}
     */
    name?: string;
    /**
     * Sum of all incomming+outgoing link values
     *
     * @type {number}
     */
    total?: number;
    /**
     * Sum of all incoming link values
     *
     * @type {number}
     */
    totalIncoming?: number;
    /**
     * Sum of all outgoing link values
     *
     * @type {number}
     */
    totalOutgoing?: number;
    /**
     * Node's color.
     *
     * @type {Color}
     */
    color?: Color;
}
/**
 * Defines events for [[FlowDiagramNode]].
 */
export interface IFlowDiagramNodeEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[FlowDiagramNode]].
 *
 * @see {@link Adapter}
 */
export interface IFlowDiagramNodeAdapters extends IContainerAdapters, IFlowDiagramNodeProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a node in a Flow Diagram.
 *
 * A Flow node is a block with a value, which represents its size on the
 * diagram.
 *
 * Nodes are connected via [[FlowLink]] elements.
 *
 * @see {@link IFlowDiagramNodeEvents} for a list of available events
 * @see {@link IFlowDiagramNodeAdapters} for a list of available Adapters
 * @important
 */
export declare class FlowDiagramNode extends Container {
    /**
     * total ajusted taken in mind chart.minNodeSize
     */
    adjustedTotal: number;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IFlowDiagramNodeProperties}
     */
    _properties: IFlowDiagramNodeProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IFlowDiagramNodeAdapters}
     */
    _adapter: IFlowDiagramNodeAdapters;
    /**
     * Defines available events.
     *
     * @type {IFlowDiagramNodeEvents}
     * @ignore Exclude from docs
     */
    _events: IFlowDiagramNodeEvents;
    /**
     * A list of data items of the items coming in from another node, one level
     * up.
     *
     * These are what ingoing links are build out of.
     *
     * @type {List<this["_dataItem"]>}
     */
    protected _incomingDataItems: List<this["_dataItem"]>;
    /**
     * A list of data items of the items going out of the node.
     *
     * These are what outgoing links are build out of.
     *
     * @type {List<this["_dataItem"]>}
     */
    protected _outgoingDataItems: List<this["_dataItem"]>;
    /**
     * Sorted list of incoming items.
     *
     * @type {Iterator<this["_dataItem"]>}
     */
    protected _incomingSorted: $iter.Iterator<this["_dataItem"]>;
    /**
     * Sorted list of outgoing items.
     * @type {Iterator<this["_dataItem"]>}
     */
    protected _outgoingSorted: $iter.Iterator<this["_dataItem"]>;
    /**
     * A chart instance this node is added to.
     *
     * @type {FlowDiagram}
     */
    chart: FlowDiagram;
    /**
     * Defines the type of the [[FlowDiagramDataItem]] used in the class.
     *
     * @ignore Exclude from docs
     * @type {FlowDiagramDataItem}
     */
    _dataItem: FlowDiagramDataItem;
    /**
     * Settings for the appearance of the related legend items.
     */
    legendSettings: LegendSettings;
    /**
     * A reference to the legend data item related to this node.
     *
     * @type {LegendDataItem<Series, ISeriesEvents>}
     */
    protected _legendDataItem: LegendDataItem;
    /**
     * Constructor
     */
    constructor();
    /**
     * Shows hidden bide.
     *
     * @param  {number}     duration  Duration of reveal animation (ms)
     * @return {Animation}            Animation
     */
    show(duration?: number): Animation;
    /**
     * Hides node.
     *
     * @param  {number}     duration  Duration of hiding animation (ms)
     * @return {Animation}            Animation
     */
    hide(duration?: number): Animation;
    /**
     * Marks node as invalid, for redrawal in the next update cycle.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Invalidates all links, attached to this node.
     *
     * @ignore Exclude from docs
     */
    invalidateLinks(): void;
    /**
     * List of incoming items (links).
     *
     * @readonly
     * @return {List<FlowDiagramDataItem>} Incoming items
     */
    readonly incomingDataItems: List<FlowDiagramDataItem>;
    /**
     * List of outgoing items (links).
     *
     * @readonly
     * @return {List<FlowDiagramDataItem>} Outgoing items
     */
    readonly outgoingDataItems: List<FlowDiagramDataItem>;
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
     * @return {number} Value
     */
    /**
     * Sum of all incoming+outgoing link values
     *
     * @param {number}  value  Value
     */
    total: number;
    /**
     * @return {number} Value
     */
    /**
     * Sum of all incomming link values.
     *
     * @param {number}  value  Value
     */
    totalIncoming: number;
    /**
     * @return {number} Value
     */
    /**
     * Sum of all outgoing link values.
     *
     * @param {number}  value  Value
     */
    totalOutgoing: number;
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
     * Creates elements in related legend container, that mimics the look of this
     * Series.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Legend item container
     */
    createLegendMarker(marker: Container): void;
    /**
     * @return {LegendDataItem<Series, ISeriesEvents>} Data item
     */
    /**
     * Legend data item that corresponds to this series.
     *
     * @param {LegendDataItem<Series, ISeriesEvents>}  value  Data item
     */
    legendDataItem: LegendDataItem;
}
