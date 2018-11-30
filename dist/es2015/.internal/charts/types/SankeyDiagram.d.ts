import { FlowDiagram, FlowDiagramDataItem, IFlowDiagramAdapters, IFlowDiagramDataFields, IFlowDiagramEvents, IFlowDiagramProperties } from "./FlowDiagram";
import { SankeyNode } from "../elements/SankeyNode";
import { SankeyLink } from "../elements/SankeyLink";
import { Animation } from "../../core/utils/Animation";
import { Orientation } from "../../core/defs/Orientation";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
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
export declare class SankeyDiagramDataItem extends FlowDiagramDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {SankeyDiagram}
     */
    _component: SankeyDiagram;
    /**
     * An a link element, connecting two nodes.
     * @type {SankeyLink}
     */
    _link: SankeyLink;
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
export interface ISankeyDiagramDataFields extends IFlowDiagramDataFields {
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
export interface ISankeyDiagramProperties extends IFlowDiagramProperties {
    /**
     * Sort nodes by name or value or do not sort at all
     *
     * @type {"top" | "bottom" | "middle"}
     */
    nodeAlign?: "top" | "bottom" | "middle";
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
export interface ISankeyDiagramEvents extends IFlowDiagramEvents {
}
/**
 * Defines adapters for [[SankeyDiagram]].
 *
 * @see {@link Adapter}
 */
export interface ISankeyDiagramAdapters extends IFlowDiagramAdapters, ISankeyDiagramProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Sankey Diagram chart.
 *
 * @see {@link ISankeyDiagramEvents} for a list of available Events
 * @see {@link ISankeyDiagramAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/sankey-diagram/} for documentation
 * @important
 */
export declare class SankeyDiagram extends FlowDiagram {
    /**
     * Defines a type for the DataItem.
     *
     * @type {SankeyDiagramDataItem}
     */
    _dataItem: SankeyDiagramDataItem;
    /**
     * Defines available data fields.
     *
     * @type {ISankeyDiagramDataFields}
     */
    _dataFields: ISankeyDiagramDataFields;
    /**
     * Defines available properties.
     *
     * @type {ISankeyDiagramProperties}
     */
    _properties: ISankeyDiagramProperties;
    /**
     * Defines available adapters.
     *
     * @type {SeriesAdapters}
     */
    _adapter: ISankeyDiagramAdapters;
    /**
     * Defines available events.
     *
     * @type {ISankeyDiagramEvents}
     */
    _events: ISankeyDiagramEvents;
    /**
     * An a link element, connecting two nodes.
     * @type {SankeyLink}
     */
    _link: SankeyLink;
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
     */
    _node: SankeyNode;
    /**
     * [maxSum description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {number}
     */
    maxSum: number;
    /**
     * level with max sum
     */
    protected _maxSumLevel: number;
    /**
     * [valueHeight description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {number}
     */
    protected _valueHeight: number;
    /**
     * A total number of levels, present on this chart.
     *
     * @type {number}
     */
    protected _levelCount: number;
    /**
     * Sorted nodes iterator.
     *
     * @ignore
     * @type {Iterator}
     */
    protected _sorted: $iter.Iterator<[string, SankeyNode]>;
    protected _heightAnimation: Animation;
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
     * Calculates relation between pixel height and total value.
     *
     * In Sankey the actual thickness of links and height of nodes will depend
     * on their values.
     */
    protected calculateValueHeight(): void;
    /**
     * Redraws the chart.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Performs actual operations to reveal this element.
     *
     * @ignore Exclude from docs
     * @param  {number} duration Fade in duration (ms)
     * @return {number}          Fade in duration (ms)
     */
    protected showReal(duration?: number): $type.Optional<Animation>;
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
    /**
     * @ignore
     */
    createNode(): this["_node"];
    /**
     * @ignore
     */
    createLink(): this["_link"];
    /**
     * @ignore
     */
    /**
     * @ignore
     */
    valueHeight: number;
    /**
     * @ignore
     */
    disposeData(): void;
}
