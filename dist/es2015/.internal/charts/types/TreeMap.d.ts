/**
 * TreeMap chart module.
 *
 * Parts of the functionality used in this module are taken from D3.js library
 * (https://d3js.org/)
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { XYChart, IXYChartProperties, IXYChartDataFields, IXYChartAdapters, IXYChartEvents, XYChartDataItem } from "./XYChart";
import { DictionaryTemplate } from "../../core/utils/Dictionary";
import { ValueAxis } from "../axes/ValueAxis";
import { OrderedListTemplate } from "../../core/utils/SortedList";
import { TreeMapSeries } from "../series/TreeMapSeries";
import { Color } from "../../core/utils/Color";
import { TreeMapSeriesDataItem } from "../series/TreeMapSeries";
import { NavigationBar } from "../elements/NavigationBar";
import { ColorSet } from "../../core/utils/ColorSet";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[TreeMap]].
 *
 * @see {@link DataItem}
 */
export declare class TreeMapDataItem extends XYChartDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {TreeMap}
     */
    _component: TreeMap;
    /**
     * A treemap level this data item is displayed at.
     *
     * @type {number}
     */
    protected _level: number;
    /**
     * Related series.
     *
     * @type {TreeMapSeries}
     */
    protected _series: TreeMapSeries;
    /**
     * Related series data item.
     *
     * @type {TreeMapSeriesDataItem}
     */
    seriesDataItem: TreeMapSeriesDataItem;
    /**
     * Required for squarify functionality.
     *
     * @ignore Exclude from docs
     * @type {TreeMapDataItem[]}
     */
    rows: TreeMapDataItem[];
    /**
     * Required for squarify functionality.
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    rowsRatio: number;
    /**
     * Required for squarify functionality.
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    dice: boolean;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Value
     */
    /**
     * Numeric value of the item.
     *
     * @param {number}  value  Value
     */
    value: number;
    /**
     * @return {number} X
     */
    /**
     * Item's X position.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param {number}  value  X
     */
    x0: number;
    /**
     * @return {number} X
     */
    /**
     * Item's X position.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param {number}  value  X
     */
    x1: number;
    /**
     * @return {number} Y
     */
    /**
     * Item's Y position.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param {number}  value  Y
     */
    y0: number;
    /**
     * @return {number} Y
     */
    /**
     * Item's Y position.
     *
     * @ignore Exclude from docs
     * @todo Description (review)
     * @param {number}  value  Y
     */
    y1: number;
    /**
     * @return {string} Name
     */
    /**
     * Item's name.
     *
     * @param {string}  name  Name
     */
    name: string;
    /**
     * @return {OrderedListTemplate<TreeMapDataItem>} Item's children
     */
    /**
     * A list of item's sub-children.
     *
     * Having children means that the TreeMap chat will automatically be
     * "drillable". Clicking on an item with children will zoom to the item, then
     * display its children.
     *
     * Treemap can have any level of nesting.
     *
     * @param {OrderedListTemplate<TreeMapDataItem>}  children  Item's children
     */
    children: OrderedListTemplate<TreeMapDataItem>;
    /**
     * Depth level in the treemap hierarchy.
     *
     * The top-level item will have level set at 0. Its children will have
     * level 1, and so on.
     *
     * @readonly
     * @return {number} Level
     */
    readonly level: number;
    /**
     * @return {Color} Color
     */
    /**
     * Item's color.
     *
     * If not set, will use parent's color, or, if that is not set either,
     * automatically assigned color from chart's color set. (`chart.colors`)
     *
     * @param {Color}  value  Color
     */
    color: Color;
    /**
     * series of data item
     * @todo: proper descrition
     */
    series: TreeMapSeries;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[TreeMap]].
 */
export interface ITreeMapDataFields extends IXYChartDataFields {
    /**
     * A name of the field in data that holds item's numeric value.
     *
     * @type {string}
     */
    value?: string;
    /**
     * A name of the field in data that holds item's sub-items.
     *
     * @type {string}
     */
    children?: string;
    /**
     * A name of the field in data that holds item's name.
     *
     * @type {string}
     */
    name?: string;
    /**
     * A name of the field in data that holds item's color.
     *
     * If not set, a new color will be automatically assigned to each item as
     * defined by theme.
     *
     * @type {string}
     */
    color?: string;
}
/**
 * Defines properties for [[TreeMap]].
 */
export interface ITreeMapProperties extends IXYChartProperties {
    /**
     * Maximum levels the chart will allow drilling down to.
     *
     * @default 2
     * @type {number}
     */
    maxLevels?: number;
    /**
     * Current drill-down level the treemap is at.
     *
     * @type {number}
     */
    currentLevel?: number;
    /**
     * Sorting direction of treemap items.
     *
     * @default "descending"
     * @type {"none" | "ascending" | "descending"}
     */
    sorting?: "none" | "ascending" | "descending";
}
/**
 * Defines events for [[TreeMap]].
 */
export interface ITreeMapEvents extends IXYChartEvents {
}
/**
 * Defines adapters for [[TreeMap]].
 *
 * @see {@link Adapter}
 */
export interface ITreeMapAdapters extends IXYChartAdapters, ITreeMapProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a TreeMap chart.
 *
 * @see {@link ITreeMapEvents} for a list of available Events
 * @see {@link ITreeMapAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/treemap/} for documentation
 */
export declare class TreeMap extends XYChart {
    /**
     * Defines a type of the data item used for this chart.
     *
     * @ignore Exclude from docs.
     * @type {TreeMapDataItem}
     */
    _dataItem: TreeMapDataItem;
    /**
     * Defines available data fields.
     *
     * @ignore Exclude from docs.
     * @type {ITreeMapDataFields}
     */
    _dataFields: ITreeMapDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs.
     * @type {ITreeMapProperties}
     */
    _properties: ITreeMapProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs.
     * @type {SeriesAdapters}
     */
    _adapter: ITreeMapAdapters;
    /**
     * Defines available events.
     *
     * @type {ITreeMapEvents}
     * @ignore Exclude from docs
     */
    _events: ITreeMapEvents;
    /**
     * A horizontal value axis.
     *
     * TreeMap chart is basically an XY chart, which means it has vertical and
     * horizontal value axes.
     *
     * As with any XY-based chart, it can be zoomed.
     *
     * @type {ValueAxis}
     */
    xAxis: ValueAxis;
    /**
     * A vertical value axis.
     *
     * TreeMap chart is basically an XY chart, which means it has vertical and
     * horizontal value axes.
     *
     * As with any XY-based chart, it can be zoomed.
     *
     * @type {ValueAxis}
     */
    yAxis: ValueAxis;
    /**
     * An algorithm used to divide area into squares based on their value.
     *
     * Available options: squarify (default), binaryTree, slice, dice, sliceDice.
     *
     * ```TypeScript
     * chart.layoutAlgorithm = chart.sliceDice;
     * ```
     * ```JavaScript
     * chart.layoutAlgorithm = chart.sliceDice;
     * ```
     * ```JSON
     * {
     *   // ...
     *   "layoutAlgorithm": "sliceDice",
     *   // ...
     * }
     * ```
     *
     * @see {@link https://www.amcharts.com/docs/v4/chart-types/treemap/#Area_division_methods} For more info and examples.
     * @default squarify
     * @type {function}
     */
    layoutAlgorithm: (parent: TreeMapDataItem) => void;
    /**
     * Defines a type of series that this chart uses.
     *
     * @ignore Exclude from docs
     * @type {PieSeries}
     */
    _seriesType: TreeMapSeries;
    /**
     * [_homeDataItem description]
     *
     * @todo Description
     * @type {TreeMapDataItem}
     */
    protected _homeDataItem: TreeMapDataItem;
    /**
     * [_tempSeries description]
     *
     * @todo Description
     * @type {TreeMapSeries[]}
     */
    protected _tempSeries: TreeMapSeries[];
    /**
     * A text dispalyed on the home button in breadcurmb nav control.
     *
     * @type {string}
     */
    protected _homeText: string;
    /**
     * A set of colors to be applied autoamtically to each new chart item, if
     * not explicitly set.
     *
     * @type {ColorSet}
     */
    colors: ColorSet;
    /**
     * Holds series object for each TreeMap level.
     *
     * "0" is the top-level series.
     * "1" is the second level.
     * Etc.
     *
     * @todo Description
     * @param {DictionaryTemplate<string, TreeMapSeries>} Templates for each level
     */
    seriesTemplates: DictionaryTemplate<string, this["_seriesType"]>;
    /**
     * Is the chart zoomable?
     *
     * If the chart is `zoomable`, and items have sub-items, the chart will
     * drill-down to sub-items when click on their parent item.
     *
     * @default true
     * @type {boolean}
     */
    zoomable: boolean;
    /**
     * A navigation bar used to show "breadcrumb" control, indicating current
     * drill-down path.
     *
     * @type {NavigationBar}
     */
    protected _navigationBar: NavigationBar;
    /**
     * Currently selected data item.
     * @type {TreeMapDataItem}
     * @readonly
     */
    currentlyZoomed: TreeMapDataItem;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns navigationBar if it is added to a chart
     */
    /**
     * A navigation bar used to show "breadcrumb" control, indicating current
     * drill-down path.
     *
     * @type {NavigationBar}
     */
    navigationBar: NavigationBar;
    /**
     * (Re)validates chart's data.
     *
     * @ignore Exclude from docs
     */
    validateData(): void;
    /**
     * Layouts and sizes all items according to their value and
     * `layoutAlgorithm`.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Parent data item
     */
    layoutItems(parent: TreeMapDataItem, sorting?: "none" | "ascending" | "descending"): void;
    /**
     * Creates and returns a new treemap series.
     *
     * @todo Description
     * @param {TreeMapDataItem}  dataItem  Data item to create series out of
     */
    protected createTreeSeries(dataItem: TreeMapDataItem): void;
    /**
     * [createTreeSeriesReal description]
     *
     * @todo Description
     * @param {TreeMapDataItem} dataItem [description]
     */
    protected createTreeSeriesReal(dataItem: TreeMapDataItem): void;
    /**
     * @ignore
     * Overriding, as tree map series are created on the fly all the time
     */
    protected seriesAppeared(): boolean;
    /**
     * Initializes the treemap series.
     *
     * @todo Description
     * @param {TreeMapDataItem}  dataItem  Chart data item
     */
    protected initSeries(dataItem: TreeMapDataItem): void;
    /**
     * Toggles bullets so that labels that belong to current drill level are
     * shown.
     *
     * @param {number}  duration  Animation duration (ms)
     */
    protected toggleBullets(duration?: number): void;
    /**
     * Zooms to particular item in series.
     *
     * @param {TreeMapSeriesDataItem}  dataItem  Data item
     */
    zoomToSeriesDataItem(dataItem: TreeMapSeriesDataItem): void;
    /**
     * Zooms to particular item.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  dataItem  Data item
     */
    zoomToChartDataItem(dataItem: TreeMapDataItem): void;
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {XYSeriesDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * @return {number} Maximum drill-down level
     */
    /**
     * Maximum drill-down levels the chart will allow going to.
     *
     * If set, the chart will not drill-down further, even if there are sub-items
     * available.
     *
     * Set to 0 to disable drill down functionality.
     *
     * @param {number}  value  Maximum drill-down level
     */
    maxLevels: number;
    /**
     * @return {number} Current level
     */
    /**
     * Current drill-down level the chart is at.
     *
     * @param {number}  value  Current level
     */
    currentLevel: number;
    /**
     * Sorting direction of treemap items.
     *
     * Available options: "none", "ascending", and "descending" (default).
     *
     * @default "descending"
     * @param {"none" | "ascending" | "descending"} value [description]
     */
    sorting: "none" | "ascending" | "descending";
    /**
     * Creates and returns a new series of the suitable type.
     *
     * @return {this} new series
     */
    protected createSeries(): this["_seriesType"];
    /**
     * @return {string} Home text
     */
    /**
     * A text displayed on the "home" button which is used to go back to level 0
     * after drill into sub-items.
     *
     * @param {string}  value  Home text
     */
    homeText: string;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
    /**
     * [handleDataItemValueChange description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    protected handleDataItemValueChange(): void;
    /**
     * Measures the size of container and informs its children of how much size
     * they can occupy, by setting their relative `maxWidth` and `maxHeight`
     * properties.
     *
     * @ignore Exclude from docs
     */
    validateLayout(): void;
    /**
     * Validates (processes) data items.
     *
     * @ignore Exclude from docs
     */
    validateDataItems(): void;
    /**
     * ==========================================================================
     * TREEMAP LAYOUT FUNCTIONS
     * ==========================================================================
     * @hidden
     */
    /**
     * The functions below are from D3.js library (https://d3js.org/)
     *
     * --------------------------------------------------------------------------
     * Copyright 2017 Mike Bostock
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice,
     *    this list of conditions and the following disclaimer.
     *
     * 2. Redistributions in binary form must reproduce the above copyright
     *    notice,this list of conditions and the following disclaimer in the
     *    documentation and/or other materials provided with the distribution.
     *
     * 3. Neither the name of the copyright holder nor the names of its
     *    contributors may be used to endorse or promote products derived from
     *    this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
     * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     * POSSIBILITY OF SUCH DAMAGE.
     * --------------------------------------------------------------------------
     * @hidden
     */
    /**
     * Treemap layout algorithm: binaryTree.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    binaryTree(parent: TreeMapDataItem): void;
    /**
     * Treemap layout algorithm: slice.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    slice(parent: TreeMapDataItem): void;
    /**
     * Treemap layout algorithm: dice.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    dice(parent: TreeMapDataItem): void;
    /**
     * Treemap layout algorithm: slideDice.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    sliceDice(parent: TreeMapDataItem): void;
    /**
     * Treemap layout algorithm: squarify.
     *
     * @ignore Exclude from docs
     * @param {TreeMapDataItem}  parent  Data item
     */
    squarify(parent: TreeMapDataItem): void;
    /**
     * Setups the legend to use the chart's data.
     */
    protected feedLegend(): void;
}
