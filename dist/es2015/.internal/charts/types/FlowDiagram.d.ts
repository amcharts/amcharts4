/**
 * FlowDiagram module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Chart, IChartProperties, IChartDataFields, IChartAdapters, IChartEvents, ChartDataItem } from "../Chart";
import { AMEvent } from "../../core/Sprite";
import { IDataItemEvents } from "../../core/DataItem";
import { ListTemplate } from "../../core/utils/List";
import { DictionaryTemplate } from "../../core/utils/Dictionary";
import { Container } from "../../core/Container";
import { FlowDiagramNode } from "../elements/FlowDiagramNode";
import { FlowDiagramLink } from "../elements/FlowDiagramLink";
import { ColorSet } from "../../core/utils/ColorSet";
import { Color } from "../../core/utils/Color";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[FlowDiagram]].
 *
 * @see {@link DataItem}
 */
export declare class FlowDiagramDataItem extends ChartDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {FlowDiagram}
     */
    _component: FlowDiagram;
    /**
     * An a link element, connecting two nodes.
     * @ignore
     * @type {FlowDiagramLink}
     */
    _link: FlowDiagramLink;
    /**
     * An origin node.
     *
     * @type {FlowDiagramNode}
     */
    fromNode: FlowDiagramNode;
    /**
     * A destination node.
     *
     * @type {FlowDiagramNode}
     */
    toNode: FlowDiagramNode;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {string} name
     */
    /**
     * Source node's name.
     *
     * @param {string}  value  Name
     */
    fromName: string;
    /**
     * @return {string} name
     */
    /**
     * Destination node's name.
     *
     * @param {string}  value  Name
     */
    toName: string;
    /**
     * @return {string} color
     */
    /**
     * Node color
     *
     * @param {string}  value  Name
     */
    color: Color;
    /**
     * @return {number} Value
     */
    /**
     * Link's value.
     *
     * @param {number}  value  Value
     */
    value: number;
    /**
     * A visual element, representing link between the source and target nodes.
     *
     * Link's actual thickness will be determined by `value` of this link and
     * `value` of the source node.
     *
     * @readonly
     * @return {FlowDiagramLink} Link element
     */
    readonly link: this["_link"];
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[FlowDiagram]].
 */
export interface IFlowDiagramDataFields extends IChartDataFields {
    /**
     * Name of the source node.
     *
     * @type {string}
     */
    fromName?: string;
    /**
     * Name of the target node.
     *
     * @type {string}
     */
    toName?: string;
    /**
     * Value of the link between two nodes.
     *
     * @type {string}
     */
    value?: string;
    /**
     * Color of a from node
     *
     * @type {string}
     */
    color?: string;
    /**
     * Visibility of a node
     *
     * @type {string}
     */
    visible?: string;
}
/**
 * Defines properties for [[FlowDiagram]]
 */
export interface IFlowDiagramProperties extends IChartProperties {
    /**
     * Padding for node square in pixels.
     *
     * @type {number}
     */
    nodePadding?: number;
    /**
     * Sort nodes by name or value or do not sort a
     *
     * @type {"none" | "name" | "value"}
     */
    sortBy?: "none" | "name" | "value";
    /**
     * Sometimes nodes can get very small if their value is little. With this setting you
     * can set min size of a node (this is relative value from the total size of all nodes)
     */
    minNodeSize: number;
}
/**
 * Defines events for [[FlowDiagram]].
 */
export interface IFlowDiagramEvents extends IChartEvents {
}
/**
 * Defines adapters for [[FlowDiagram]].
 *
 * @see {@link Adapter}
 */
export interface IFlowDiagramAdapters extends IChartAdapters, IFlowDiagramProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Pie chart
 * @see {@link IFlowDiagramEvents} for a list of available Events
 * @see {@link IFlowDiagramAdapters} for a list of available Adapters
 * @important
 */
export declare class FlowDiagram extends Chart {
    /**
     * A Color Set to use when applying/generating colors for each subsequent
     * node.
     *
     * @type {ColorSet}
     */
    colors: ColorSet;
    /**
     * Defines a type for the DataItem.
     *
     * @ignore Exclude from docs
     * @type {FlowDiagramDataItem}
     */
    _dataItem: FlowDiagramDataItem;
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IFlowDiagramDataFields}
     */
    _dataFields: IFlowDiagramDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IFlowDiagramProperties}
     */
    _properties: IFlowDiagramProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {SeriesAdapters}
     */
    _adapter: IFlowDiagramAdapters;
    /**
     * Defines available events.
     *
     * @type {IFlowDiagramEvents}
     * @ignore Exclude from docs
     */
    _events: IFlowDiagramEvents;
    /**
     * @ignore
     */
    _node: FlowDiagramNode;
    /**
     * A list of chart's FlowDiagram nodes.
     *
     * @param {DictionaryTemplate<string, this["_node"]>}
     */
    protected _nodes: DictionaryTemplate<string, this["_node"]>;
    /**
     * @ignore
     */
    _link: FlowDiagramLink;
    /**
     * A list of FlowDiagram links connecting nodes.
     *
     * @param {ListTemplate<this["_link"]>}
     */
    protected _links: ListTemplate<this["_link"]>;
    /**
     * A container that holds all of the link elements.
     *
     * @type {Container}
     */
    linksContainer: Container;
    /**
     * A container that holds all of the node elements.
     * @type {Container}
     */
    nodesContainer: Container;
    /**
     * Sorted nodes iterator.
     *
     * @ignore
     * @type {Iterator}
     */
    protected _sorted: $iter.Iterator<[string, FlowDiagramNode]>;
    /**
     * Constructor
     */
    constructor();
    dispose(): void;
    /**
     * (Re)validates chart's data, effectively causing the chart to redraw.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    protected handleDataItemWorkingValueChange(event: AMEvent<FlowDiagramDataItem, IDataItemEvents>["workingvaluechanged"]): void;
    /**
     * [appear description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    appear(): void;
    /**
     * Sorts nodes by either their values or names, based on `sortBy` setting.
     */
    protected sortNodes(): void;
    /**
     * Updates a cummulative value of the node.
     *
     * A node's value is determined by summing values of all of the incoming
     * links or all of the outgoing links, whichever results in bigger number.
     *
     * @param {FlowDiagramNode}  node  Node value
     */
    protected getNodeValue(node: FlowDiagramNode): void;
    /**
     * Changes the sort type of the nodes.
     *
     * This will actually reshuffle nodes using nice animation.
     */
    protected changeSorting(): void;
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
    /**
     * Creates and returns a new data item.
     *
     * @return {this} Data item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * @return {number} Padding (px)
     */
    /**
     * Padding for node square in pixels.
     *
     * Padding will add extra space around node's name label.
     *
     * @param {number} value Padding (px)
     */
    nodePadding: number;
    /**
     * @returns {"none" | name" | "value"} Node sorting
     */
    /**
     * Sort nodes by "name" or "value" or do not sort at all. If not sorted, nodes will appear in the same order as they are in the data.
     * @default "none"
     * @param {"none" | "name" | "value"}  value  Node sorting
     */
    sortBy: "none" | "name" | "value";
    /**
     * @returns {number} min node size
     */
    /**
     * Sometimes nodes can get very small if their value is little. With this setting you
     * can set min size of a node (this is relative value from the total size of all nodes)
     * @default 0.02
     * @param {"none" | "name" | "value"}  value  Node sorting
     */
    minNodeSize: number;
    /**
     * A list of chart's nodes.
     *
     * @param {DictionaryTemplate<string, this["_node"]>}
     */
    readonly nodes: DictionaryTemplate<string, this["_node"]>;
    /**
     * @ignore
     */
    createNode(): this["_node"];
    /**
     * A list of chart's links.
     *
     * @param {ListTemplate<this["_link"]>}
     */
    readonly links: ListTemplate<this["_link"]>;
    /**
     * @ignore
     */
    createLink(): this["_link"];
    /**
     * Setups the legend to use the chart's data.
     */
    protected feedLegend(): void;
}
