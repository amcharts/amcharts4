/**
 * Column series module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { XYSeries, IXYSeriesDataFields, XYSeriesDataItem, IXYSeriesProperties, IXYSeriesAdapters, IXYSeriesEvents } from "./XYSeries";
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { SpriteState } from "../../core/SpriteState";
import { Container } from "../../core/Container";
import { ListTemplate } from "../../core/utils/List";
import { Bullet } from "../elements/Bullet";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ColumnSeries]].
 *
 * @see {@link DataItem}
 */
export declare class ColumnSeriesDataItem extends XYSeriesDataItem {
    /**
     * A sprite used to draw the column.
     *
     * @type {Sprite}
     */
    protected _column: Sprite;
    /**
     * Indicates if this data items close value is lower than its open value.
     *
     * @type {boolean}
     */
    droppedFromOpen: boolean;
    /**
     * Indicates if this items value is lower than previous data item's value.
     *
     * @type {boolean}
     */
    droppedFromPrevious: boolean;
    /**
     * Defines a type of [[Component]] this data item is used for
     * @type {ColumnSeries}
     */
    _component: ColumnSeries;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {Sprite} Column sprite
     */
    /**
     * A column sprite used to draw a column for this data item.
     *
     * For performance sake, column sprites are reused, hence the necessity
     * of this property.
     *
     * @param {Sprite}  column  Column sprite
     */
    column: Sprite;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[ColumnSeries]].
 */
export interface IColumnSeriesDataFields extends IXYSeriesDataFields {
}
/**
 * Defines properties for [[ColumnSeries]].
 */
export interface IColumnSeriesProperties extends IXYSeriesProperties {
    /**
     * Cluster this series columns?
     *
     * Setting to `false` will make columns overlap with pther series.
     *
     * @default true
     * @type {boolean}
     */
    clustered?: boolean;
}
/**
 * Defines events for [[ColumnSeries]].
 */
export interface IColumnSeriesEvents extends IXYSeriesEvents {
}
/**
 * Defines adapters for [[ColumnSeries]].
 *
 * @see {@link Adapter}
 */
export interface IColumnSeriesAdapters extends IXYSeriesAdapters, IColumnSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a column graph.
 *
 * @see {@link IColumnSeriesEvents} for a list of available Events
 * @see {@link IColumnSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export declare class ColumnSeries extends XYSeries {
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs
     * @type {IColumnSeriesDataFields}
     */
    _dataFields: IColumnSeriesDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IColumnSeriesProperties}
     */
    _properties: IColumnSeriesProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IColumnSeriesAdapters}
     */
    _adapter: IColumnSeriesAdapters;
    /**
     * Event dispacther.
     *
     * @type {SpriteEventDispatcher<AMEvent<ColumnSeries, IColumnSeriesEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<ColumnSeries, IColumnSeriesEvents>>;
    /**
     * Defines the type of data item.
     *
     * @ignore Exclude from docs
     * @type {ColumnSeriesDataItem}
     */
    _dataItem: ColumnSeriesDataItem;
    /**
     * A list of column elements.
     *
     * @type {ListTemplate<Sprite>}
     */
    protected _columns: ListTemplate<Sprite>;
    /**
     * Container to put column elements in.
     *
     * @type {Container}
     */
    protected _columnsContainer: Container;
    /**
     * Iterator for columns.
     *
     * @type {ListIterator<Sprite>}
     */
    protected _columnsIterator: $iter.ListIterator<Sprite>;
    /**
     * Start location within cell for columns.
     *
     * @type {number}
     */
    protected _startLocation: number;
    /**
     * End location within cell for columns.
     *
     * @type {number}
     */
    protected _endLocation: number;
    /**
     * A state to apply to a column when close value is lower than open value.
     */
    protected _dropFromOpenState: SpriteState<this["_properties"], this["_adapter"]>;
    /**
     * A state to apply to a column when its value is lower value of a previous
     * column.
     */
    protected _dropFromPreviousState: SpriteState<this["_properties"], this["_adapter"]>;
    /**
     * A state to apply to a column when close value is same or higher than open
     * value.
     */
    protected _riseFromOpenState: SpriteState<this["_properties"], this["_adapter"]>;
    /**
     * A state to apply to a column when its value is same or higher than value
     * of a previous column.
     */
    protected _riseFromPreviousState: SpriteState<this["_properties"], this["_adapter"]>;
    /**
     * Constructor
     */
    constructor();
    /**
     * A container that columns are created in.
     *
     * @ignore Exclude from docs
     */
    readonly columnsContainer: Container;
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {ColumnSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * (Re)validates the whole series, effectively causing it to redraw.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Validates data item's element, effectively redrawing it.
     *
     * @ignore Exclude from docs
     * @param {ColumnSeriesDataItem}  dataItem  Data item
     */
    validateDataElement(dataItem: this["_dataItem"]): void;
    /**
     * Returns relative start location for the data item.
     *
     * @param  {this["_dataItem"]}  dataItem  Data item
     * @return {number}                       Location (0-1)
     */
    protected getStartLocation(dataItem: this["_dataItem"]): number;
    /**
     * Returns relative end location for the data item.
     *
     * @param  {this["_dataItem"]}  dataItem  Data item
     * @return {number}                       Location (0-1)
     */
    protected getEndLocation(dataItem: this["_dataItem"]): number;
    /**
     * Validates data item's elements.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]}  dataItem  Data item
     */
    validateDataElementReal(dataItem: this["_dataItem"]): void;
    /**
     * Apply different state/coloring to columns based on the change value.
     *
     * @param {Sprite}  sprite  Sprite to apply state to
     * @todo Do not apply accessibility to wicks of the candlesticks
     */
    protected setColumnStates(sprite: Sprite): void;
    /**
     * A list of column elements.
     *
     * @ignore Exclude from docs
     * @return {ListTemplate<Sprite>} Columns
     */
    readonly columns: ListTemplate<Sprite>;
    /**
     * Creates and returns a column element to use as a template.
     *
     * @return {Sprite} Column template
     */
    protected getColumnTemplate(): Sprite;
    /**
     * @return {boolean} Clustered?
     */
    /**
     * Cluster this series columns?
     *
     * Setting to `false` will make columns overlap with pther series.
     *
     * @default true
     * @param {boolean}  value  Clustered?
     */
    clustered: boolean;
    /**
     * A state to apply to a column when close value is lower than open value.
     *
     * Can be used to differentiate appearance based on value relations.
     *
     * NOTE: this will work only if at least one axis is [[ValueAxis]].
     *
     * @readonly You can modify state object, but can't overwrite it
     * @return {SpriteState} State
     */
    readonly dropFromOpenState: SpriteState<this["_properties"], this["_adapter"]>;
    /**
     * A state to apply to a column when its value is lower value of a previous
     * column.
     *
     * Can be used to differentiate appearance based on value relations.
     *
     * @readonly You can modify state object, but can't overwrite it
     * @return {SpriteState} State
     */
    readonly dropFromPreviousState: SpriteState<this["_properties"], this["_adapter"]>;
    /**
     * A state to apply to a column when close value is same or higher than open
     * value.
     *
     * Can be used to differentiate appearance based on value relations.
     *
     * NOTE: this will work only if at least one axis is [[ValueAxis]].
     *
     * @readonly You can modify state object, but can't overwrite it
     * @return {SpriteState} State
     */
    readonly riseFromOpenState: SpriteState<this["_properties"], this["_adapter"]>;
    /**
     * A state to apply to a column when its value is same or higher than value
     * of a previous column.
     *
     * Can be used to differentiate appearance based on value relations.
     *
     * @readonly You can modify state object, but can't overwrite it
     * @return {SpriteState} State
     */
    readonly riseFromPreviousState: SpriteState<this["_properties"], this["_adapter"]>;
    /**
     * Updates value of the related legend item.
     *
     * @ignore Exclude from docs
     * @param {ColumnSeriesDataItem}  dataItem  Data item
     */
    updateLegendValue(dataItem?: this["_dataItem"]): void;
    /**
     * Creates elements in related legend container, that mimics the look of this
     * Series.
     *
     * @ignore Exclude from docs
     * @param {Container}  marker  Legend item container
     */
    createLegendMarker(marker: Container): void;
    /**
     * Copies all properties from another instance of [[ColumnSeries]].
     *
     * @param {ColumnSeries}  source  Source series
     */
    copyFrom(source: this): void;
    /**
    * returns bullet x location
    * @ignore
    */
    protected getBulletLocationX(bullet: Bullet, field: string): number;
    /**
    * returns bullet y location
    * @ignore
    */
    protected getBulletLocationY(bullet: Bullet, field: string): number;
}
