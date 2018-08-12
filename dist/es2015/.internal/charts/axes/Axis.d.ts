/**
 * Base class for all Axis
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Component, IComponentProperties, IComponentDataFields, IComponentAdapters, IComponentEvents } from "../../core/Component";
import { Container } from "../../core/Container";
import { DataItem } from "../../core/DataItem";
import { Grid } from "./Grid";
import { AxisTick } from "./AxisTick";
import { AxisLabel } from "./AxisLabel";
import { AxisFill } from "./AxisFill";
import { AxisBreak } from "./AxisBreak";
import { AxisRenderer } from "./AxisRenderer";
import { Chart } from "../Chart";
import { XYSeries, XYSeriesDataItem } from "../series/XYSeries";
import { IPoint, IOrientationPoint } from "../../core/defs/IPoint";
import { Label } from "../../core/elements/Label";
import { IRectangle } from "../../core/defs/IRectangle";
import { PointerOrientation } from "../../core/elements/Tooltip";
import { Ordering } from "../../core/utils/Order";
import { SortedListTemplate } from "../../core/utils/SortedList";
import { List, ListTemplate, IListEvents } from "../../core/utils/List";
import { IDisposer } from "../../core/utils/Disposer";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[Axis]].
 *
 * @see {@link DataItem}
 */
export declare class AxisDataItem extends DataItem {
    /**
     * Reference to a related [[Grid]] element.
     *
     * @type {Grid}
     */
    protected _grid: Grid;
    /**
     * Reference to a related [[AxisTick]] element.
     *
     * @type {AxisTick}
     */
    protected _tick: AxisTick;
    /**
     * Reference to a related [[AxisLabel]] element.
     *
     * @type {AxisLabel}
     */
    protected _label: AxisLabel;
    /**
     * Reference to a related [[AxisFill]] element.
     *
     * @type {AxisFill}
     */
    protected _axisFill: AxisFill;
    /**
     * A mask for axis. We're using [[AxisFill]] since the mask, basically, has
     * the same shape and features.
     *
     * @type {AxisFill}
     */
    protected _mask: AxisFill;
    /**
     * Container which might be used to hold some extra items, like series
     * segments when data item is used for axis range.
     *
     * @type {Container}
     */
    protected _contents: Container;
    /**
     * A text to be used as label for this data item.
     *
     * @type {string}
     */
    protected _text: string;
    /**
     * Holds a physical position of the grid line associated with this data item,
     * so that it can be used when measuring distance between points, and hiding
     * some of them so they don't overlap.
     *
     * @type {IPoint}
     */
    point: IPoint;
    /**
     * If the data item is within an existing [[AxisBreak]] this property will
     * hold a reference to that [[AxisBreak]].
     *
     * @type {AxisBreak}
     */
    protected _axisBreak: AxisBreak;
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {Axis}
     * @ignore Exclude from docs
     */
    _component: Axis;
    /**
     * Used to distinguish from real data points and those data items that are
     * used for ranges, like `series.axisRanges` or `axis.axisRanges`.
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    isRange: boolean;
    /**
     * relative position of data item on axis
     */
    position: number;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {Grid} Grid element
     */
    /**
     * A [[Grid]] element associated with this data item.
     *
     * If there is no grid element associated with data item, a new one is
     * created and returned.
     *
     * @param {Grid}  grid  Grid element
     */
    grid: Grid;
    /**
     * @return {AxisTick} Tick element
     */
    /**
     * An [[AxisTick]] element associated with this data item.
     *
     * If there is no tick element associated with data item, a new one is
     * created and returned.
     *
     * @param {AxisTick}  tick  Tick element
     */
    tick: AxisTick;
    /**
     * @return {AxisLabel} Label element
     */
    /**
     * An [[AxisLabel]] element associated with this data item.
     *
     * If there is no label element associated with data item, a new one is
     * created and returned.
     *
     * @param {AxisLabel} label Label element
     */
    label: AxisLabel;
    /**
     * @return {AxisFill} Label element
     */
    /**
     * An [[AxisFill]] associated element with this data item.
     *
     * If there is no fill element associated with data item, a new one is
     * created and returned.
     *
     * @param {AxisFill} label Label element
     */
    axisFill: AxisFill;
    /**
     * @return {string} Text label
     */
    /**
     * Text to be used as data item's label.
     *
     * @param {string} text Text label
     */
    text: string;
    /**
     * Data item's mask.
     *
     * @return {AxisFill} Mask
     */
    readonly mask: AxisFill;
    /**
     * Returns a [[Container]] to place all visual elements, related to data item
     * in.
     *
     * If there is no Container, a new one is created.
     *
     * @return {Container} Contents container
     */
    readonly contents: Container;
    /**
     * @return {AxisBreak} Axis break
     */
    /**
     * An [[AxisBreak]] this data item falls within.
     *
     * @param {AxisBreak} axisBreak Axis break
     */
    axisBreak: AxisBreak;
    /**
     * Re-draws the element.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Appends data item's elements to the parent [[Container]].
     *
     * @ignore Exclude from docs
     */
    appendChildren(): void;
    /**
     * Ordering function used in JSON setup.
     *
     * @param  {string}  a  Item A
     * @param  {string}  b  Item B
     * @return {Ordering}   Order
     */
    protected configOrder(a: string, b: string): Ordering;
    /**
     * Checks if data item has particular property set.
     *
     * @param  {string}   prop  Property name
     * @return {boolean}        Property set?
     */
    protected hasProperty(prop: string): boolean;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines named positions for data item's location within [[Axis]].
 */
export declare enum AxisItemLocation {
    Start = 0,
    Middle = 0.5,
    End = 1,
}
/**
 * Defines data fields for [[Axis]].
 */
export interface IAxisDataFields extends IComponentDataFields {
}
/**
 * Defines properties for [[Axis]].
 */
export interface IAxisProperties extends IComponentProperties {
}
/**
 * Defines events for [[Axis]].
 */
export interface IAxisEvents extends IComponentEvents {
    /**
     * Invoked when available axis lenght chganges, e.g. after resizing the whole
     * chart.
     */
    lengthchanged: {};
}
/**
 * Defines adapters for [[Axis]].
 *
 * @see {@link Adapter}
 */
export interface IAxisAdapters extends IComponentAdapters, IAxisProperties {
    /**
     * Applied to an axis label text before it's drawn.
     *
     * @type {string}
     */
    label: string;
    /**
     * Applied to the tooltip text before it is shown.
     *
     * @type {string}
     */
    getTooltipText: string;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for all Axis elements.
 *
 * @see {@link IAxisEvents} for a list of available Events
 * @see {@link IAxisAdapters} for a list of available Adapters
 */
export declare class Axis<T extends AxisRenderer = AxisRenderer> extends Component {
    /**
     * Defines list of data fields.
     *
     * @ignore Exclude from docs
     * @type {IAxisDataFields}
     */
    _dataFields: IAxisDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IAxisProperties}
     */
    _properties: IAxisProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IAxisAdapters}
     */
    _adapter: IAxisAdapters;
    /**
     * Defines the type of the [[DataItem]] used in the class.
     *
     * @ignore Exclude from docs
     * @type {AxisDataItem}
     */
    _dataItem: AxisDataItem;
    /**
     * A list of Axis Ranges.
     */
    protected _axisRanges: ListTemplate<this["_dataItem"]>;
    /**
     * Defines the type of the axis breaks.
     *
     * @ignore Exclude from docs
     * @type {AxisBreak}
     */
    _axisBreak: AxisBreak;
    /**
     * Defines available events.
     *
     * @type {IAxisEvents}
     * @ignore Exclude from docs
     */
    _events: IAxisEvents;
    /**
     * A [[Label]] instance that is used for Axis title label.
     *
     * @type {Label}
     */
    title: Label;
    /**
     * "X", "Y", etc.
     *
     * This is needed so that Axis knows which of the values from series' data
     * items it should use.
     *
     * @ignore Exclude from docs
     * @type {string}
     */
    axisLetter: string;
    /**
     * A reference to chart the axis is for.
     *
     * @type {Chart}
     */
    protected _chart: Chart;
    /**
     * Indicates if cusor's tooltip should be shown on this Axis.
     *
     * @type {boolean}
     */
    protected _cursorTooltipEnabled: boolean;
    /**
     * A type for renderer used for this Axis.
     * @type {T}
     */
    protected _renderer: T;
    /**
     * Number of Grid elements on the axis.
     *
     * @type {number}
     */
    protected _gridCount: number;
    /**
     * A list of [[XYSeries]] that are using this Axis.
     *
     * @type {List<XYSeries>}
     */
    protected _series: List<XYSeries>;
    /**
     * Holds the length of the Axis, so that we can check if it changed after
     * other changes and we need to update layouts.
     *
     * @type {number}
     */
    protected _prevLength: number;
    /**
     * A list of Axis Breaks associated with this Axis.
     */
    protected _axisBreaks: SortedListTemplate<this["_axisBreak"]>;
    /**
     * A reference to the Iterator for Axis' data items.
     */
    protected _dataItemsIterator: $iter.ListIterator<this["_dataItem"]>;
    /**
     * A name of the data field this Axis looks for its data in, e.g. "category".
     *
     * @ignore Exclude from docs
     * @type {string}
     */
    axisFieldName: string;
    /**
     * [currentItemStartPoint description]
     *
     * @ignore Exclude from docs
     * @type {IPoint}
     */
    currentItemStartPoint: IPoint;
    /**
     * [currentItemEndPoint description]
     *
     * @ignore Exclude from docs
     * @type {IPoint}
     */
    currentItemEndPoint: IPoint;
    /**
     * Holds reference to a function that accepts a DataItem and its index as
     * parameters.
     *
     * It can either return a fill opacity for a fill, or manipulate data item
     * directly, to create various highlighting scenarios.
     *
     * For example, you can set it up to highlight only weekends on a
     * [[DateAxis]].
     *
     * @type {function}
     */
    fillRule: (dataItem: AxisDataItem, index?: number) => any;
    axisFullLength: number;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {AxisDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * Invalidates layout.
     *
     * @ignore Exclude from docs
     */
    invalidateLayout(): void;
    /**
     * Override to cancel super call for data element validation.
     */
    protected validateDataElements(): void;
    /**
     * Recalculates the number of grid items on the axis.
     */
    protected updateGridCount(): void;
    /**
     * Redraws the element.
     *
     * @ignore Exclude from docs
     */
    validateLayout(): void;
    /**
     * Initializes Axis' renderer.
     *
     * @ignore Exclude from docs
     */
    initRenderer(): void;
    /**
     * Appends data items.
     *
     * Does nothing on a base Axis.
     */
    protected appendDataItems(): void;
    /**
     * Adds a data item to the Axis.
     *
     * @param {this["_dataItem"]} dataItem Data item
     */
    appendDataItem(dataItem: this["_dataItem"]): void;
    /**
     * Redraws Axis' related items.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Redars Axis ranges.
     *
     * @ignore Exclude from docs
     */
    validateAxisRanges(): void;
    /**
     * Invalidates all axis breaks, so they are redrawn.
     *
     * @ignore Exclude from docs
     */
    validateBreaks(): void;
    /**
     * Associates an Axis break with this Axis, after it is inserted into
     * `axisBreaks`.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<AxisBreak>["inserted"]} event Event
     */
    processBreak(event: IListEvents<AxisBreak>["inserted"]): void;
    /**
     * Registers a [[XYSeries]] element with this Axis.
     *
     * Returns a [[Disposer]] for all events, added to Series for watching
     * changes in Axis, and vice versa.
     * @ignore
     * @param  {XYSeries}     series  Series
     * @return {IDisposer}          Event disposer
     */
    registerSeries(series: XYSeries): IDisposer;
    /**
     * @return {T} Renderer
     */
    /**
     * An [[AxisRenderer]] to be used to render this Axis.
     *
     * Please note that most of the settings, related to Axis' appearance are set
     * via its renderer. Not directly on the Axis.
     *
     * E.g.:
     *
     * ```TypeScript
     * axis.renderer.inside = true;
     * axis.renderer.minLabelPosition = 0.1;
     * axis.renderer.maxLabelPosition = 0.9;
     * ```
     * ```JavaScript
     * axis.renderer.inside = true;
     * axis.renderer.minLabelPosition = 0.1;
     * axis.renderer.maxLabelPosition = 0.9;
     * ```
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/} for more info
     * @param {T}  renderer  Renderer
     */
    renderer: T;
    /**
     * Converts a relative position to angle. (for circular axes)
     *
     * @param  {number} position Position (0-1)
     * @return {number}          Angle
     */
    positionToAngle(position: number): number;
    /**
     * Converts pixel coordinates to a relative position. (0-1)
     *
     * @param {IPoint}   point  Coorinates (px)
     * @return {number}         Position (0-1)
     */
    pointToPosition(point: IPoint): number;
    /**
     * [getAnyRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {any}     start  [description]
     * @param  {any}     end    [description]
     * @return {string}         [description]
     */
    getAnyRangePath(start: any, end: any): string;
    /**
     * Converts any positional parameter to a relative position on axis.
     *
     * @todo Description (review)
     * @param  {any}     value  Pisition
     * @return {number}         Position (0-1)
     */
    anyToPosition(value: any): number;
    /**
     * Converts any positional parameter to a relative position on axis.
     *
     * @todo Description (review)
     * @param  {any}     value  Pisition
     * @return {IOrientationPoint}  Orientation point
     */
    anyToPoint(value: any): IOrientationPoint;
    /**
     * [getPositionRangePath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number} startPosition [description]
     * @param  {number} endPosition   [description]
     * @return {string}               [description]
     */
    getPositionRangePath(startPosition: number, endPosition: number): string;
    /**
     * Actual axis length in pixels.
     *
     * @return {number} Axis length (px)
     */
    readonly axisLength: number;
    /**
     * @return {boolean} Display tooltip?
     */
    /**
     * Indicates if axis should display a tooltip for chart's cursor.
     *
     * @param {boolean} value Display tooltip?
     */
    cursorTooltipEnabled: boolean;
    /**
     * Shows Axis tooltip at specific relative position within Axis. (0-1)
     *
     * @param {number} position Position (0-1)
     */
    showTooltipAtPosition(position: number): void;
    /**
     * Converts relative position (0-1) to Axis position with zoom level and
     * inversed taken into account.
     *
     * @param  {number} position Global position (0-1)
     * @return {number}          Position within Axis (0-1)
     */
    toAxisPosition(position: number): number;
    /**
     * Returns text to be used for cursor's Axis tooltip.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @param  {number}  position  Position coordinate (px)
     * @return {string}            Label text
     */
    getTooltipText(position: number): string;
    /**
     * Updates Axis' tooltip's position and possibly size, and pointer (stem)
     * place.
     *
     * @ignore Exclude from docs
     * @param {PointerOrientation}  pointerOrientation  Pointer (stem) orientation
     * @param {IRectangle}          boundingRectangle   A rectangle for tooltip to fit within
     */
    updateTooltip(pointerOrientation: PointerOrientation, boundingRectangle: IRectangle): void;
    /**
     * [roundPosition description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number}            position  Relative position
     * @param  {AxisItemLocation}  location  Location on axis
     * @return {number}                      Rounded position
     */
    roundPosition(position: number, location: AxisItemLocation): number;
    /**
     * [getCellStartPosition description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number} position [description]
     * @return {number}          [description]
     */
    getCellStartPosition(position: number): number;
    /**
     * [getCellEndPosition description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {number} position [description]
     * @return {number}          [description]
     */
    getCellEndPosition(position: number): number;
    /**
     * A list of axis ranges for this Axis.
     *
     * @return {ListTemplate} Axis ranges
     */
    readonly axisRanges: ListTemplate<this["_dataItem"]>;
    /**
     * Decorates an axis range after it has been added to the axis range list.
     *
     * @param {IListEvents<AxisDataItem>["inserted"]} event Event
     */
    protected processAxisRange(event: IListEvents<AxisDataItem>["inserted"]): void;
    /**
     * A list of axis breaks on this Axis.
     *
     * @return {SortedListTemplate} Axis breaks.
     */
    readonly axisBreaks: SortedListTemplate<this["_axisBreak"]>;
    /**
     * Creates a new axis break.
     *
     * @return {this["_axisBreak"]} Axis break
     */
    protected createAxisBreak(): this["_axisBreak"];
    /**
     * A list of Series currently associated with this Axis.
     *
     * @return {List<XYSeries>} Series
     */
    readonly series: List<XYSeries>;
    /**
     * Processes Series' data items.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     */
    processSeriesDataItems(): void;
    /**
     * Processes Series' single data item.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @param {XYSeriesDataItem} dataItem Data item
     */
    processSeriesDataItem(dataItem: XYSeriesDataItem): void;
    /**
     * Post-processes Serie's data items.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     */
    postProcessSeriesDataItems(): void;
    /**
     * Post-processes Serie's single data item.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @param {XYSeriesDataItem} dataItem Data item
     */
    postProcessSeriesDataItem(dataItem: XYSeriesDataItem): void;
    /**
     * Updates Axis based on all Series that might influence it.
     *
     * Called by Series after Series data is validated.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     */
    updateAxisBySeries(): void;
    /**
     * Hides unused data items.
     *
     * @ignore Exclude from docs
     */
    hideUnusedDataItems(): void;
    /**
     * Returns a Series' data item that corresponds to specific position on Axis.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @param  {Series}          series    Series
     * @param  {number}          position  Position (0-1)
     * @return {XYSeriesDataItem}            Data item
     */
    getSeriesDataItem(series: XYSeries, position: number): XYSeriesDataItem;
    /**
     * Returns an angle that corresponds to specific position on axis.
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem}  dataItem  Data item
     * @param  {string}          key       ???
     * @param  {number}          location  Location
     * @param  {string}          stackKey  ???
     * @return {number}                    Angle
     */
    getAngle(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number;
    /**
     * [getX description]
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem} dataItem [description]
     * @param  {string}         key      [description]
     * @param  {number}         location [description]
     * @param  {string}         stackKey [description]
     * @return {number}                  [description]
     */
    getX(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number;
    /**
     * [getY description]
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {XYSeriesDataItem} dataItem [description]
     * @param  {string}         key      [description]
     * @param  {number}         location [description]
     * @param  {string}         stackKey [description]
     * @return {number}                  [description]
     */
    getY(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number;
    /**
     * Coordinates of the actual axis start.
     *
     * @ignore Exclude from docs
     * @return {IPoint} Base point coordinates
     */
    readonly basePoint: IPoint;
    /**
     * [dataChangeUpdate description]
     *
     * This is a placeholder to override for extending classes.
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    dataChangeUpdate(): void;
    /**
     * Removes axis breaks that fall between `min` and `max` (???)
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param  {number}  min  Start value
     * @param  {number}  max  End value
     * @return {number}       Spread o
     */
    protected adjustDifference(min: number, max: number): number;
    /**
     * Checks if specific value falls within a break.
     *
     * Returns [[AxisBreak]] the value falls into.
     *
     * @param  {number}     value  Value to check
     * @return {AxisBreak}         Axis break
     */
    protected isInBreak(value: number): AxisBreak;
    /**
     * [fixAxisBreaks description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    protected fixAxisBreaks(): void;
    /**
     * @ignore Exclude from docs
     * @return {number} [description]
     */
    /**
     * We need start/end indexes of axes to be 0 - `dataItems.length`.
     *
     * Yes, also for category axis, this helps to avoid jumping of categories
     * while scrolling and does not do a lot of extra work as we use
     * protected `_startIndex` and `_endIndex` when working with items.
     *
     * @hidden
     */
    /**
     * [startIndex description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {number} value [description]
     */
    startIndex: number;
    /**
     * @ignore Exclude from docs
     * @return {number} [description]
     */
    /**
     * [endIndex description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param {number} value [description]
     */
    endIndex: number;
    /**
     * Returns a formatted label based on position.
     *
     * Individual axis types should override this method to generate a label
     * that is relevant to axis type.
     *
     * @param  {number}  position  Relative position on axis (0-1)
     * @return {string}            Position label
     */
    getPositionLabel(position: number): string;
    /**
     * @return {Chart} Chart
     */
    /**
     * A Chart this Axis belongs to.
     *
     * @param {Chart}  value  Chart
     */
    chart: Chart;
    /**
     * Creates a data item for a Series range.
     *
     * @param  {XYSeries}  series  Target Series
     * @return {this}            Range data item
     */
    createSeriesRange(series: XYSeries): this["_dataItem"];
    /**
     * Copies all properties and related data from a different instance of Axis.
     *
     * @param {this} source Source Axis
     */
    copyFrom(source: this): void;
    /**
     * Resets internal iterator.
     */
    protected resetIterators(): void;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
}
