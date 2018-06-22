/**
 * Sankey diagram module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Chart, IChartProperties, IChartDataFields, IChartAdapters, IChartEvents, ChartDataItem } from "../Chart";
import { ListTemplate } from "../../core/utils/List";
import { DictionaryTemplate } from "../../core/utils/Dictionary";
import { Container } from "../../core/Container";
import { SankeyNode } from "../elements/SankeyNode";
import { SankeyLink } from "../elements/SankeyLink";
import { ColorSet } from "../../core/utils/ColorSet";
import { Color } from "../../core/utils/Color";
import { Orientation } from "../../core/defs/Orientation";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[SankeyDiagram]].
 *
 * @see {@link DataItem}
 */
export declare class SankeyDiagramDataItem extends ChartDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {SankeyDiagram}
     */
    _component: SankeyDiagram;
    /**
     * An a link element, connecting two nodes.
     *
     * @type {SankeyLink}
     */
    protected _link: SankeyLink;
    /**
     * An origin node.
     *
     * @type {SankeyNode}
     */
    fromNode: SankeyNode;
    /**
     * A destination node.
     *
     * @type {SankeyNode}
     */
    toNode: SankeyNode;
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
     * @return {SankeyLink} Link element
     */
    readonly link: SankeyLink;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[SankeyDiagram]].
 */
export interface ISankeyDiagramDataFields extends IChartDataFields {
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
}
/**
 * Defines properties for [[SankeyDiagram]]
 */
export interface ISankeyDiagramProperties extends IChartProperties {
    /**
     * Padding for node square in pixels.
     *
     * @type {number}
     */
    nodePadding?: number;
    /**
     * Sort nodes by name or value or do not sort at all
     *
     * @type {"top" | "bottom" | "middle"}
     */
    nodeAlign?: "top" | "bottom" | "middle";
    /**
     * Sort nodes by name or value or do not sort a
     *
     * @type {"none" | "name" | "value"}
     */
    sortBy?: "none" | "name" | "value";
    /**
     * Orientation of the chart.
     *
     * @type {Orientation}
     */
    orientation?: Orientation;
}
/**
 * Defines events for [[SankeyDiagram]].
 */
export interface ISankeyDiagramEvents extends IChartEvents {
}
/**
 * Defines adapters for [[SankeyDiagram]].
 *
 * @see {@link Adapter}
 */
export interface ISankeyDiagramAdapters extends IChartAdapters, ISankeyDiagramProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Pie chart
 * @see {@link ISankeyDiagramEvents} for a list of available Events
 * @see {@link ISankeyDiagramAdapters} for a list of available Adapters
 * @important
 */
export declare class SankeyDiagram extends Chart {
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
     * @type {SankeyDiagramDataItem}
     */
    _dataItem: SankeyDiagramDataItem;
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {ISankeyDiagramDataFields}
     */
    _dataFields: ISankeyDiagramDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ISankeyDiagramProperties}
     */
    _properties: ISankeyDiagramProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {SeriesAdapters}
     */
    _adapter: ISankeyDiagramAdapters;
    /**
     * Defines available events.
     *
     * @type {ISankeyDiagramEvents}
     * @ignore Exclude from docs
     */
    _events: ISankeyDiagramEvents;
    /**
     * A list of chart's Sankey nodes.
     *
     * @param {DictionaryTemplate<string, SankeyNode>}
     */
    nodes: DictionaryTemplate<string, SankeyNode>;
    /**
     * A list of Sankey links connecting nodes.
     *
     * @param {ListTemplate<SankeyLink>}
     */
    links: ListTemplate<SankeyLink>;
    /**
     * @todo Description
     */
    protected _levelSum: {
        [index: number]: number;
    };
    /**
     * @todo Description
     */
    protected _levelNodesCount: {
        [index: number]: number;
    };
    /**
     * [maxSum description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {number}
     */
    maxSum: number;
    /**
     * number of nodes in level with max value, needed for position calculation
     */
    protected maxSumLevelNodeCount: number;
    /**
     * [valueHeight description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {number}
     */
    valueHeight: number;
    /**
     * A total number of levels, present on this chart.
     *
     * @type {number}
     */
    protected _levelCount: number;
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
    protected _sorted: $iter.Iterator<[string, SankeyNode]>;
    /**
     * Alignment of nodes
     *
     * @ignore
     * @type {"top" | "bottom" | "middle"}
     */
    protected _nodeAlign: "top" | "bottom" | "middle";
    /**
     * Constructor
     */
    constructor();
    /**
     * (Re)validates chart's data, effectively causing the chart to redraw.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    /**
     * Returns node's highest level.
     *
     * @param  {SankeyNode}  node   Node
     * @param  {number}      level  Current level
     * @return {number}             New level
     */
    protected getNodeLevel(node: SankeyNode, level: number): number;
    /**
     * Sorts nodes by either their values or names, based on `sortBy` setting.
     */
    protected sortNodes(): void;
    /**
     * Calculates relation between pixel height and total value.
     *
     * In Sankey the actual thickness of links and height of nodes will depend
     * on their values.
     */
    protected calculateValueHeight(): void;
    /**
     * Updates a cummulative value of the node.
     *
     * A node's value is determined by summing values of all of the incoming
     * links or all of the outgoing links, whichever results in bigger number.
     *
     * @param {SankeyNode}  node  Node value
     */
    protected getNodeValue(node: SankeyNode): void;
    /**
     * Redraws the chart.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * [appear description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    appear(): void;
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
     * @returns {"top" | "middle" | "bottom"} Returns nodeAlign value
     */
    /**
     * How to align nodes. In case layout is vertical, top means left and bottom means right
     *
     * @param {"top" | "middle" | "bottom"}  value  Node sorting
     */
    nodeAlign: "top" | "middle" | "bottom";
    /**
     * @return {Orientation} Orientation
     */
    /**
     * Orientation of the chart: "horizontal" or "vertical";
     *
     * @param {Orientation} value Orientation
     */
    orientation: Orientation;
}
