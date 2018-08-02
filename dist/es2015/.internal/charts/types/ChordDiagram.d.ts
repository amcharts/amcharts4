import { FlowDiagram, FlowDiagramDataItem, IFlowDiagramAdapters, IFlowDiagramDataFields, IFlowDiagramEvents, IFlowDiagramProperties } from "./FlowDiagram";
import { Percent } from "../../core/utils/Percent";
import { ListTemplate } from "../../core/utils/List";
import { DictionaryTemplate } from "../../core/utils/Dictionary";
import { Container } from "../../core/Container";
import { ChordNode } from "../elements/ChordNode";
import { ChordLink } from "../elements/ChordLink";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ChordDiagram]].
 *
 * @see {@link DataItem}
 */
export declare class ChordDiagramDataItem extends FlowDiagramDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {ChordDiagram}
     */
    _component: ChordDiagram;
    /**
     * An a link element, connecting two nodes.
     * @ignore
     * @type {ChordLink}
     */
    _link: ChordLink;
    /**
     * An origin node.
     *
     * @type {ChordNode}
     */
    fromNode: ChordNode;
    /**
     * A destination node.
     *
     * @type {ChordNode}
     */
    toNode: ChordNode;
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
 * Defines data fields for [[ChordDiagram]].
 */
export interface IChordDiagramDataFields extends IFlowDiagramDataFields {
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
 * Defines properties for [[ChordDiagram]]
 */
export interface IChordDiagramProperties extends IFlowDiagramProperties {
    /**
     * Radius of the Chord. Absolute or relative.
     *
     * @type {number | Percent}
     */
    radius?: number | Percent;
    /**
     * Inner radius of the Chord nodes. Absolute or relative. Negative value means that the inner radius will be calculated from the radius, not from the center.
     *
     * @type {number | Percent}
     */
    innerRadius?: number | Percent;
    /**
     * An angle radar face starts on. (degrees)
     *
     * @default -90
     * @type {number}
     */
    startAngle?: number;
    /**
     * An angle radar face ends on. (degrees)
     *
     * @default 270
     * @type {number}
     */
    endAngle?: number;
    /**
     * If you set this to true, all the lines will be of the same width.
     *
     * @default false
     * @type {boolean}
     */
    nonRibbon?: boolean;
}
/**
 * Defines events for [[ChordDiagram]].
 */
export interface IChordDiagramEvents extends IFlowDiagramEvents {
}
/**
 * Defines adapters for [[ChordDiagram]].
 *
 * @see {@link Adapter}
 */
export interface IChordDiagramAdapters extends IFlowDiagramAdapters, IChordDiagramProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a Chord Diagram chart.
 *
 * @see {@link IChordDiagramEvents} for a list of available Events
 * @see {@link IChordDiagramAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/chord-diagram/} for documentation
 * @important
 */
export declare class ChordDiagram extends FlowDiagram {
    /**
     * Defines a type for the DataItem.
     *
     * @ignore Exclude from docs
     * @type {ChordDiagramDataItem}
     */
    _dataItem: ChordDiagramDataItem;
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IChordDiagramDataFields}
     */
    _dataFields: IChordDiagramDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IChordDiagramProperties}
     */
    _properties: IChordDiagramProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {SeriesAdapters}
     */
    _adapter: IChordDiagramAdapters;
    /**
     * Defines available events.
     *
     * @type {IChordDiagramEvents}
     * @ignore Exclude from docs
     */
    _events: IChordDiagramEvents;
    /**
     * A list of chart's Chord nodes.
     *
     * @param {DictionaryTemplate<string, ChordNode>}
     */
    nodes: DictionaryTemplate<string, ChordNode>;
    /**
     * A list of Chord links connecting nodes.
     *
     * @param {ListTemplate<ChordLink>}
     */
    links: ListTemplate<ChordLink>;
    /**
     * Sorted nodes iterator.
     *
     * @ignore
     * @type {Iterator}
     */
    protected _sorted: $iter.Iterator<[string, ChordNode]>;
    /**
     * [valueAngle description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {number}
     */
    valueAngle: number;
    /**
     * A container for chord elemens.
     *
     * @type {Container}
     */
    chordContainer: Container;
    /**
     * @ignore
     */
    _node: ChordNode;
    /**
     * Constructor
     */
    constructor();
    /**
     * Redraws the chart.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
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
     * @return {number} Start angle (degrees)
     */
    /**
     * Starting angle of the Radar face. (degrees)
     *
     * Normally, a circular radar face begins (the radial axis is drawn) at the
     * top center. (at -90 degrees)
     *
     * You can use `startAngle` to change this setting.
     *
     * E.g. setting this to 0 will make the radial axis start horizontally to
     * the right, as opposed to vertical.
     *
     * For a perfect circle the absolute sum of `startAngle` and `endAngle`
     * needs to be 360.
     *
     * However, it's **not** necessary to do so. You can set those to lesser
     * numbers, to create semi-circles.
     *
     * E.g. `startAngle = -90` with `endAngle = 0` will create a radar face that
     * looks like a quarter of a circle.
     *
     * @default -90
     * @param {number}  value  Start angle (degrees)
     */
    startAngle: number;
    /**
     * @return {number} End angle (degrees)
     */
    /**
     * Starting angle of the Radar face. (degrees)
     *
     * Normally, a circular radar face ends (the radial axis is drawn) exactly
     * where it has started, forming a full 360 circle. (at 270 degrees)
     *
     * You can use `endAngle` to end the circle somewhere else.
     *
     * E.g. setting this to 180 will make the radar face end at horizontal line
     * to the left off the center.
     *
     * For a perfect circle the absolute sum of `startAngle` and `endAngle`
     * needs to be 360.
     *
     * However, it's **not** necessary to do so. You can set those to lesser
     * numbers, to create semi-circles.
     *
     * E.g. `startAngle = -90` with `endAngle = 0` will create a radar face that
     * looks like a quarter of a circle.
     *
     * @default -90
     * @param {number}  value  End angle (degrees)
     */
    endAngle: number;
    /**
     * @return {number} Outer radius
     */
    /**
     * Outer radius of the Radar face.
     *
     * This can either be in absolute pixel value, or relative [[Percent]].
     *
     * @param {number | Percent}  value  Outer radius
     */
    radius: number | Percent;
    /**
     * @return {number} Inner radius
     */
    /**
     * Inner radius of the Chord nodes.
     *
     * This can either be in absolute pixel value, or relative [[Percent]].
     *
     * @param {number | Percent}  value  Outer radius
     */
    innerRadius: number | Percent;
    /**
     * @return {boolean} Non-ribbon
     */
    /**
     *
     * If you set this to true, all the lines will be of the same width. This is done by making middleLine of a ChordLink visible.
     *
     * @param {boolean}  value
     */
    nonRibbon: boolean;
    /**
     * @ignore
     */
    createNode(): this["_node"];
    /**
     * @ignore
     */
    createLink(): this["_link"];
}
