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
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { Container } from "../../core/Container";
import { DataItem } from "../../core/DataItem";

import { Grid } from "./Grid";
import { AxisTick } from "./AxisTick";
import { AxisLabel } from "./AxisLabel";
import { AxisFill } from "./AxisFill";
import { AxisBreak } from "./AxisBreak";
import { AxisRenderer } from "./AxisRenderer";

// Charts
import { Chart } from "../Chart";

// Series
import { XYSeries, XYSeriesDataItem } from "../series/XYSeries";

// Elements
import { IPoint, IOrientationPoint } from "../../core/defs/IPoint";
import { Label } from "../../core/elements/Label";
import { IRectangle } from "../../core/defs/IRectangle";
import { Tooltip, PointerOrientation } from "../../core/elements/Tooltip";
import { PointedRectangle } from "../../core/elements/PointedRectangle";

// Types
import { IRange } from "../../core/defs/IRange";

// Utils
import { Ordering } from "../../core/utils/Order";
import { SortedListTemplate } from "../../core/utils/SortedList";
import { List, ListTemplate, IListEvents, ListDisposer } from "../../core/utils/List";
import { IDisposer, Disposer, MultiDisposer } from "../../core/utils/Disposer";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $number from "../../core/utils/Number";
import * as $array from "../../core/utils/Array";
import * as $type from "../../core/utils/Type";


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
export class AxisDataItem extends DataItem {

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
	public point: IPoint;

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
	 */
	public _component!: Axis;

	/**
	 * Used to distinguish from real data points and those data items that are
	 * used for ranges, like `series.axisRanges` or `axis.axisRanges`.
	 *
	 * @ignore Exclude from docs
	 * @type {boolean}
	 */
	public isRange: boolean;

	/**
	 * relative position of data item on axis
	 */
	public position: number;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "AxisDataItem";
		this.applyTheme();
	}

	/**
	 * A [[Grid]] element associated with this data item.
	 *
	 * If there is no grid element associated with data item, a new one is
	 * created and returned.
	 *
	 * @param {Grid}  grid  Grid element
	 */
	public set grid(grid: Grid) {
		if (this._grid && this._grid != grid) {
			$array.remove(this.sprites, this._grid);
			this._grid.dataItem = undefined;
		}

		if (grid) {
			if (grid.dataItem && grid.dataItem != this) {
				$array.remove(grid.dataItem.sprites, grid);
				grid.dataItem.grid = undefined;
			}
			this.addSprite(grid);
		}
		this._grid = grid;
	}

	/**
	 * @return {Grid} Grid element
	 */
	public get grid(): Grid {
		if (!this._grid) {
			let component = this.component;
			if (component) {
				let grid = component.renderer.grid.create();
				this.grid = grid;
				this._disposers.push(grid);
				grid.axis = this.component;
				this._disposers.push(new Disposer(() => {
					component.renderer.grid.removeValue(grid);
				}));
			}
		}
		return this._grid;
	}

	/**
	 * An [[AxisTick]] element associated with this data item.
	 *
	 * If there is no tick element associated with data item, a new one is
	 * created and returned.
	 *
	 * @param {AxisTick}  tick  Tick element
	 */
	public set tick(tick: AxisTick) {
		if (this._tick && this._tick != tick) {
			$array.remove(this.sprites, this._tick);
			this._tick.dataItem = undefined;
		}

		if (tick) {
			if (tick.dataItem && tick.dataItem != this) {
				$array.remove(tick.dataItem.sprites, tick);
				tick.dataItem.tick = undefined;
			}
			this.addSprite(tick);
		}
		this._tick = tick;
	}

	/**
	 * @return {AxisTick} Tick element
	 */
	public get tick(): AxisTick {
		if (!this._tick) {
			let component = this.component;
			if (component) {
				let tick = component.renderer.ticks.create();
				this.tick = tick;
				tick.axis = this.component;
				this._disposers.push(tick);
				this._disposers.push(new Disposer(() => {
					component.renderer.ticks.removeValue(tick);
				}));
			}
		}
		return this._tick;
	}

	/**
	 * An [[AxisLabel]] element associated with this data item.
	 *
	 * If there is no label element associated with data item, a new one is
	 * created and returned.
	 *
	 * @param {AxisLabel} label Label element
	 */
	public set label(label: AxisLabel) {
		if (this._label && this._label != label) {
			$array.remove(this.sprites, this._label);
			this._label.dataItem = undefined;
		}

		if (label) {
			if (label.dataItem && label.dataItem != this) {
				$array.remove(label.dataItem.sprites, label);
				label.dataItem.label = undefined;
			}
			this.addSprite(label);
		}
		this._label = label;
	}

	/**
	 * @return {AxisLabel} Label element
	 */
	public get label(): AxisLabel {
		if (!this._label) {
			let component = this.component;
			if (component) {
				let label = component.renderer.labels.create();
				this._disposers.push(label);
				this.label = label;
				label.axis = this.component;

				this._disposers.push(new Disposer(() => {
					component.renderer.labels.removeValue(label);
				}));
			}
		}
		return this._label;
	}

	/**
	 * An [[AxisFill]] associated element with this data item.
	 *
	 * If there is no fill element associated with data item, a new one is
	 * created and returned.
	 *
	 * @param {AxisFill} label Label element
	 */
	public set axisFill(axisFill: AxisFill) {
		if (this._axisFill && this._axisFill != axisFill) {
			$array.remove(this.sprites, this._axisFill);
			this._axisFill.dataItem = undefined;
		}

		if (axisFill) {
			if (axisFill.dataItem && axisFill.dataItem != this) {
				$array.remove(axisFill.dataItem.sprites, axisFill);
				axisFill.dataItem.axisFill = undefined;
			}
			axisFill.axis = this.component;
			this.addSprite(axisFill);
		}
		this._axisFill = axisFill;
	}

	/**
	 * @return {AxisFill} Label element
	 */
	public get axisFill(): AxisFill {
		if (!this._axisFill) {
			let component = this.component;
			if (component) {
				let axisFill = component.renderer.axisFills.create();
				this.axisFill = axisFill;
				this._disposers.push(axisFill);

				this._disposers.push(new Disposer(() => {
					component.renderer.axisFills.removeValue(axisFill);
				}));
			}
		}
		return this._axisFill;
	}

	/**
	 * Text to be used as data item's label.
	 *
	 * @param {string} text Text label
	 */
	public set text(text: string) {
		this._text = text;
		if (this._label) { // do not use getter, it will create unwanted instances!
			this._label.text = text;
		}
	}

	/**
	 * @return {string} Text label
	 */
	public get text(): string {
		return this._text;
	}

	/**
	 * Data item's mask.
	 *
	 * @return {AxisFill} Mask
	 */
	public get mask(): AxisFill {
		return this._mask;
	}

	/**
	 * Returns a [[Container]] to place all visual elements, related to data item
	 * in.
	 *
	 * If there is no Container, a new one is created.
	 *
	 * @return {Container} Contents container
	 */
	public get contents(): Container {
		if (!this._contents) {
			let contents = new Container();
			this.addSprite(contents);
			contents.isMeasured = false;
			this._contents = contents;

			let component = this.component;
			if (component) {
				let mask: AxisFill = component.renderer.axisFills.create();
				mask.disabled = false;
				mask.axis = component;
				this.addSprite(mask);
				this._mask = mask;

				contents.mask = mask;
			}
		}
		return this._contents;
	}

	/**
	 * An [[AxisBreak]] this data item falls within.
	 *
	 * @param {AxisBreak} axisBreak Axis break
	 */
	public set axisBreak(axisBreak: AxisBreak) {
		if (this._axisBreak) {
			this._axisBreak.dataItems.removeValue(this);
		}
		if (axisBreak) {
			axisBreak.dataItems.push(this);
		}
		this._axisBreak = axisBreak;
	}

	/**
	 * @return {AxisBreak} Axis break
	 */
	public get axisBreak(): AxisBreak {
		return this._axisBreak;
	}

	/**
	 * Re-draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {
		if (this.component) {
			this.component.validateDataElement(this);
		}
	}

	/**
	 * Appends data item's elements to the parent [[Container]].
	 *
	 * @ignore Exclude from docs
	 */
	public appendChildren() {
		if (this.component) {
			this.component.appendDataItem(this);
		}
	}

	/**
	 * Ordering function used in JSON setup.
	 *
	 * @param  {string}  a  Item A
	 * @param  {string}  b  Item B
	 * @return {Ordering}   Order
	 */
	protected configOrder(a: string, b: string): Ordering {
		if (a == b) {
			return 0;
		}
		else if (a == "language") {
			return -1;
		}
		else if (b == "language") {
			return 1;
		}
		else if (a == "component") {
			return -1;
		}
		else if (b == "component") {
			return 1;
		}
		else {
			return 0;
		}
	}

	/**
	 * Checks if data item has particular property set.
	 *
	 * @param  {string}   prop  Property name
	 * @return {boolean}        Property set?
	 */
	protected hasProperty(prop: string): boolean {
		return prop == "component" ? true : super.hasProperty(prop);
	}

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
export enum AxisItemLocation {
	Start = 0,
	Middle = 0.5,
	End = 1
}

/**
 * Defines data fields for [[Axis]].
 */
export interface IAxisDataFields extends IComponentDataFields { }

/**
 * Defines properties for [[Axis]].
 */
export interface IAxisProperties extends IComponentProperties {

	/**
	 * Axis start location.
	 *
	 * * 0 - None of the first cell is shown. (don't do that)
	 * * 0.5 - Half of the first cell is shown.
	 * * 1 - Full first cell is shown.
	 *
	 * @param {number} value Location (0-1)
	 */
	startLocation?: number;


	/**
	 * Axis end location.
	 *
	 * * 0 - None of the last cell is shown. (don't do that)
	 * * 0.5 - Half of the last cell is shown.
	 * * 1 - Full last cell is shown.
	 *
	 * @param {number} value Location (0-1)
	 */
	endLocation?: number;
}

/**
 * Defines events for [[Axis]].
 */
export interface IAxisEvents extends IComponentEvents {

	/**
	 * Invoked when available axis lenght chganges, e.g. after resizing the whole
	 * chart.
	 */
	lengthchanged: {}

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
	label: string

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
export class Axis<T extends AxisRenderer = AxisRenderer> extends Component {

	/**
	 * Defines list of data fields.
	 *
	 * @type {IAxisDataFields}
	 */
	public _dataFields: IAxisDataFields;

	/**
	 * Defines available properties.
	 *
	 * @type {IAxisProperties}
	 */
	public _properties!: IAxisProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IAxisAdapters}
	 */
	public _adapter!: IAxisAdapters;

	/**
	 * Defines the type of the [[DataItem]] used in the class.
	 *
	 * @type {AxisDataItem}
	 */
	public _dataItem: AxisDataItem;

	/**
	 * A list of Axis Ranges.
	 */
	protected _axisRanges: ListTemplate<this["_dataItem"]>;

	/**
	 * Defines the type of the axis breaks.
	 *
	 * @type {AxisBreak}
	 */
	public _axisBreak: AxisBreak;

	/**
	 * Defines available events.
	 *
	 * @type {IAxisEvents}
	 */
	public _events!: IAxisEvents;

	/**
	 * A [[Label]] instance that is used for Axis title label.
	 *
	 * @type {Label}
	 */
	public title: Label;

	/**
	 * "X", "Y", etc.
	 *
	 * This is needed so that Axis knows which of the values from series' data
	 * items it should use.
	 *
	 * @ignore Exclude from docs
	 * @type {string}
	 */
	public axisLetter: string;

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
	protected _gridCount: number = 10;

	/**
	 * A list of [[XYSeries]] that are using this Axis.
	 *
	 * @type {List<XYSeries>}
	 */
	protected _series: List<XYSeries> = new List<XYSeries>();

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
	public axisFieldName: string;

	// we save these values so that cursur could use them if axis line is a fill

	/**
	 * [currentItemStartPoint description]
	 *
	 * @ignore Exclude from docs
	 * @type {IPoint}
	 */
	public currentItemStartPoint: IPoint;

	/**
	 * [currentItemEndPoint description]
	 *
	 * @ignore Exclude from docs
	 * @type {IPoint}
	 */
	public currentItemEndPoint: IPoint;

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
	public fillRule: (dataItem: AxisDataItem, index?: number) => any = function(dataItem: AxisDataItem, index?: number) {
		if (!$type.isNumber(index)) {
			index = dataItem.index;
		}
		if (index / 2 == Math.round(index / 2)) {
			dataItem.axisFill.__disabled = true;
			dataItem.axisFill.opacity = 0;
		}
		else {
			dataItem.axisFill.opacity = 1;
			dataItem.axisFill.__disabled = false;
		}
	};


	/**
	 * Full length of the axis, in pixels
	 */
	public axisFullLength: number;


	/**
	 * Ghost label is used to prevent chart shrinking/expanding when zooming or when data is invalidated. You can set custom text on it so that it would be bigger/smaller
	 */
	public ghostLabel: AxisLabel;

	/**
	 * Specifies if axis should be automatically disposed when removing from chart's axis list.
	 * @default true
	 */
	public autoDispose: boolean = true;


	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Axis";
		this.shouldClone = false;
		this.cursorTooltipEnabled = true;

		let interfaceColors = new InterfaceColorSet();

		// Create title
		this.title = new Label();
		this.title.shouldClone = false;
		this._disposers.push(this.title);
		this.setPropertyValue("startLocation", 0);
		this.setPropertyValue("endLocation", 1);

		// Data item iterator
		this._dataItemsIterator = new $iter.ListIterator<this["_dataItem"]>(this.dataItems, () => this.dataItems.create());
		this._dataItemsIterator.createNewItems = true;

		// Create tooltip
		let tooltip: Tooltip = new Tooltip();
		this._disposers.push(tooltip);
		tooltip.label.padding(5, 10, 5, 10);
		tooltip.background.pointerLength = 5;
		tooltip.fitPointerToBounds = true;
		tooltip.filters.clear();

		// Set virtual parentfor the tooltip so that it can properly inheirt
		// formatters from the axis.
		tooltip.virtualParent = this;

		// Create background element for the tooltip
		let background: PointedRectangle = <PointedRectangle>tooltip.background;
		background.cornerRadius = 0;
		background.fill = interfaceColors.getFor("alternativeBackground");
		background.stroke = background.fill;
		background.strokeWidth = 1;
		background.fillOpacity = 1;
		tooltip.label.fill = interfaceColors.getFor("alternativeText");

		this.tooltip = tooltip;

		this.applyTheme();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return {AxisDataItem} Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new AxisDataItem();
	}

	/**
	 * Invalidates layout.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidateLayout(): void {
		super.invalidateLayout();
		// this puts series after axis in invalidation order also makes series update it's data items in case widht/height of a series is not 100%
		$iter.each(this.series.iterator(), (series) => {
			series.invalidateLayout();
		});
	}


	/**
	 * Invalidates series of this axis.
	 *
	 */
	public invalidateSeries(): void {
		// this puts series after axis in invalidation order also makes series update it's data items in case widht/height of a series is not 100%
		$iter.each(this.series.iterator(), (series) => {
			series.invalidateDataRange();
		});
	}

	/**
	 * Override to cancel super call for data element validation.
	 * @ignore
	 */
	public validateDataElements() {
		if (this.ghostLabel) {
			this.renderer.updateLabelElement(this.ghostLabel, this.start, this.end);
		}
	}

	/**
	 * Recalculates the number of grid items on the axis.
	 */
	protected updateGridCount() {
		if (this.renderer) {
			this._gridCount = this.axisLength / this.renderer.minGridDistance;
		}
	}

	/**
	 * Redraws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public validateLayout(): void {

		this.axisFullLength = this.axisLength / (this.end - this.start);

		super.validateLayout();
		this.updateGridCount();
		this.renderer.updateAxisLine();
		this.renderer.updateTooltip();
		this.renderer.updateBaseGridElement();

		if (this._prevLength != this.axisLength) {
			this.dispatchImmediately("lengthchanged");
			this._prevLength = this.axisLength;
		}
	}

	/**
	 * Initializes Axis' renderer.
	 *
	 * @ignore Exclude from docs
	 */
	public initRenderer(): void {

	}

	/**
	 * Adds a data item to the Axis.
	 *
	 * @param {this["_dataItem"]} dataItem Data item
	 */
	public appendDataItem(dataItem: this["_dataItem"]) {
		let renderer: AxisRenderer = this.renderer;
		dataItem.tick.parent = renderer.gridContainer;
		dataItem.label.parent = renderer;
		dataItem.grid.parent = renderer.gridContainer;
		dataItem.axisFill.parent = renderer.gridContainer;
	}

	/**
	 * Redraws Axis' related items.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		super.validate();
		this.axisFullLength = this.axisLength / (this.end - this.start);
		this.validateAxisRanges();
		this.validateBreaks();
	}

	/**
	 * Redars Axis ranges.
	 *
	 * @ignore Exclude from docs
	 */
	public validateAxisRanges(): void {
		$iter.each(this.axisRanges.iterator(), (axisRange) => {
			this.appendDataItem(axisRange);
			this.validateDataElement(axisRange);
			axisRange.grid.validate();
			axisRange.tick.validate();
			axisRange.axisFill.validate();
			axisRange.label.validate();
		});
	}

	/**
	 * Invalidates all axis breaks, so they are redrawn.
	 *
	 * @ignore Exclude from docs
	 */
	public validateBreaks(): void {
		$iter.each(this.axisBreaks.iterator(), (axisBreak) => {
			axisBreak.invalidate();
		});
	}

	/**
	 * Associates an Axis break with this Axis, after it is inserted into
	 * `axisBreaks`.
	 *
	 * @ignore Exclude from docs
	 * @param {IListEvents<AxisBreak>["inserted"]} event Event
	 */
	public processBreak(event: IListEvents<AxisBreak>["inserted"]) {
		let axisBreak: AxisBreak = event.newValue;
		axisBreak.parent = this.renderer.breakContainer;
		axisBreak.axis = this;
	}

	/**
	 * Registers a [[XYSeries]] element with this Axis.
	 *
	 * Returns a [[Disposer]] for all events, added to Series for watching
	 * changes in Axis, and vice versa.
	 * @ignore
	 * @param  {XYSeries}     series  Series
	 * @return {IDisposer}          Event disposer
	 */
	public registerSeries(series: XYSeries): IDisposer {
		this.series.moveValue(series);

		return new MultiDisposer([
			new Disposer(() => {
				this.series.removeValue(series);
			}),

			this.events.on("lengthchanged", series.invalidate, series, false)//,

			// TODO should these be disposed of ?
			//series.events.on("datavalidated", this.processSeriesDataItems, this),
			//series.events.on("visibilitychanged", this.processSeriesDataItems, this),
			//series.events.on("hidden", this.processSeriesDataItems, this)
		]);
	}

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
	public set renderer(renderer: T) {
		if (renderer != this._renderer) {
			this._renderer = renderer;
			renderer.chart = this.chart;
			renderer.axis = this;
			renderer.parent = this;
			this.title.parent = this; // we add title to axis and set layout in renderer to avoid one extra container, as otherwise axis container would be used for holding renderer only
			this.initRenderer();

			let ghostLabel = this.renderer.labels.create();
			this._disposers.push(ghostLabel);
			ghostLabel.dataItem = this.dataItems.template.clone(); // just for the adapters not to fail
			ghostLabel.text = "L";
			ghostLabel.parent = this.renderer;
			ghostLabel.fillOpacity = 0;
			ghostLabel.opacity = 0;
			ghostLabel.strokeOpacity = 0;
			ghostLabel.validate();
			this.ghostLabel = ghostLabel;
		}
	}

	/**
	 * @return {T} Renderer
	 */
	public get renderer(): T {
		return this._renderer;
	}

	/**
	 * Converts a relative position to angle. (for circular axes)
	 *
	 * @param  {number} position Position (0-1)
	 * @return {number}          Angle
	 */
	public positionToAngle(position: number): number {
		return this.renderer.positionToAngle(position);
	}

	/**
	 * Converts pixel coordinates to a relative position. (0-1)
	 *
	 * @param {IPoint}   point  Coorinates (px)
	 * @return {number}         Position (0-1)
	 */
	public pointToPosition(point: IPoint): number {
		return this.renderer.pointToPosition(point);
	}

	/**
	 * [getAnyRangePath description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param  {any}     start  [description]
	 * @param  {any}     end    [description]
	 * @return {string}         [description]
	 */
	public getAnyRangePath(start: any, end: any): string {
		return this.renderer.getPositionRangePath(start, end);
	}

	/**
	 * Converts any positional parameter to a relative position on axis.
	 *
	 * @todo Description (review)
	 * @param  {any}     value  Pisition
	 * @return {number}         Position (0-1)
	 */
	public anyToPosition(value: any): number {
		return 0;
	}

	/**
	 * Converts any positional parameter to a relative position on axis.
	 *
	 * @todo Description (review)
	 * @param  {any}     value  Pisition
	 * @return {IOrientationPoint}  Orientation point
	 */
	public anyToPoint(value: any): IOrientationPoint {
		return { x: 0, y: 0, angle: 0 };
	}

	/**
	 * [getPositionRangePath description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param  {number} startPosition [description]
	 * @param  {number} endPosition   [description]
	 * @return {string}               [description]
	 */
	public getPositionRangePath(startPosition: number, endPosition: number): string {
		return this.renderer.getPositionRangePath(startPosition, endPosition);
	}

	/**
	 * Actual axis length in pixels.
	 *
	 * @return {number} Axis length (px)
	 */
	public get axisLength(): number {
		return this.renderer.axisLength;
	}

	/**
	 * Indicates if axis should display a tooltip for chart's cursor.
	 *
	 * @param {boolean} value Display tooltip?
	 */
	public set cursorTooltipEnabled(value: boolean) {
		this._cursorTooltipEnabled = value;

		if (value && this.renderer) {
			this.renderer.updateTooltip();
		}
	}

	/**
	 * @return {boolean} Display tooltip?
	 */
	public get cursorTooltipEnabled(): boolean {
		return this._cursorTooltipEnabled;
	}

	/**
	 * Shows Axis tooltip at specific relative position within Axis. (0-1)
	 *
	 * @param {number} position Position (0-1)
	 */
	public showTooltipAtPosition(position: number) {

		let tooltip: Tooltip = this._tooltip;

		position = this.toAxisPosition(position);

		let renderer = this.renderer;

		if (tooltip && this.dataItems.length > 0) {
			//@todo: think of how to solve this better
			if (tooltip && !tooltip.parent) {
				tooltip.parent = this.tooltipContainer;
			}

			let tooltipLocation = renderer.tooltipLocation;


			let startPosition: number = this.getCellStartPosition(position);
			let endPosition: number = this.getCellEndPosition(position);

			if (this.tooltipPosition == "fixed") {
				position = startPosition + (endPosition - startPosition) * tooltipLocation;
			}
			position = $math.fitToRange(position, this.start, this.end);

			let startPoint: IPoint = renderer.positionToPoint(startPosition);
			let endPoint: IPoint = renderer.positionToPoint(endPosition);

			// save values so cursor could use them
			this.currentItemStartPoint = startPoint;
			this.currentItemEndPoint = endPoint;

			if (renderer.fullWidthTooltip) {
				tooltip.width = endPoint.x - startPoint.x;
				tooltip.height = endPoint.y - startPoint.y;
			}

			let point: IPoint = renderer.positionToPoint(position);
			let globalPoint: IPoint = $utils.spritePointToSvg(point, this.renderer.line);
			tooltip.text = this.getTooltipText(position);

			if (tooltip.text) {
				tooltip.pointTo(globalPoint);
				tooltip.show();
			}

			if (!this.cursorTooltipEnabled) {
				tooltip.hide(0);
			}
		}
	}

	/**
	 * Converts relative position (0-1) to Axis position with zoom level and
	 * inversed taken into account.
	 *
	 * @param  {number} position Global position (0-1)
	 * @return {number}          Position within Axis (0-1)
	 */
	public toAxisPosition(position: number): number {
		position = position * (this.end - this.start);
		if (this.renderer.inversed) {
			position = this.end - position;
		}
		else {
			position = this.start + position;
		}

		return position;
	}

	/**
	 * Returns text to be used for cursor's Axis tooltip.
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @param  {number}  position  Position coordinate (px)
	 * @return {string}            Label text
	 */
	public getTooltipText(position: number): string {
		return;
	}

	/**
	 * Updates Axis' tooltip's position and possibly size, and pointer (stem)
	 * place.
	 *
	 * @ignore Exclude from docs
	 * @param {PointerOrientation}  pointerOrientation  Pointer (stem) orientation
	 * @param {IRectangle}          boundingRectangle   A rectangle for tooltip to fit within
	 */
	public updateTooltip(pointerOrientation: PointerOrientation, boundingRectangle: IRectangle): void {
		let tooltip: Tooltip = this._tooltip;
		if (tooltip) {
			tooltip.pointerOrientation = pointerOrientation;
			tooltip.setBounds($utils.spriteRectToSvg(boundingRectangle, this.renderer.line));
		}
	}

	/**
	 * [roundPosition description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param  {number}            position  Relative position
	 * @param  {AxisItemLocation}  location  Location on axis
	 * @return {number}                      Rounded position
	 */
	public roundPosition(position: number, location: AxisItemLocation): number {
		return position;
	}

	/**
	 * [getCellStartPosition description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param  {number} position [description]
	 * @return {number}          [description]
	 */
	public getCellStartPosition(position: number): number {
		return position;
	}

	/**
	 * [getCellEndPosition description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param  {number} position [description]
	 * @return {number}          [description]
	 */
	public getCellEndPosition(position: number): number {
		return position;
	}

	/**
	 * A list of axis ranges for this Axis.
	 *
	 * @return {ListTemplate} Axis ranges
	 */
	public get axisRanges(): ListTemplate<this["_dataItem"]> {
		if (!this._axisRanges) {
			let dataItem: AxisDataItem = this.createDataItem();
			this._axisRanges = new ListTemplate<this["_dataItem"]>(dataItem);
			this._axisRanges.events.on("inserted", this.processAxisRange, this, false);
			this._disposers.push(new ListDisposer(this._axisRanges));
			this._disposers.push(this._axisRanges.template);
		}
		return this._axisRanges;
	}

	/**
	 * Decorates an axis range after it has been added to the axis range list.
	 *
	 * @param {IListEvents<AxisDataItem>["inserted"]} event Event
	 */
	protected processAxisRange(event: IListEvents<AxisDataItem>["inserted"]) {
		let axisRange: AxisDataItem = event.newValue;
		axisRange.component = this;
		axisRange.isRange = true;
	}

	/**
	 * A list of axis breaks on this Axis.
	 *
	 * @return {SortedListTemplate} Axis breaks.
	 */
	public get axisBreaks(): SortedListTemplate<this["_axisBreak"]> {
		if (!this._axisBreaks) {
			this._axisBreaks = new SortedListTemplate<AxisBreak>(this.createAxisBreak(), (a, b) => {
				return $number.order(a.adjustedStartValue, b.adjustedStartValue);
			});

			this._axisBreaks.events.on("inserted", this.processBreak, this, false);
			this._disposers.push(new ListDisposer(this._axisBreaks));
			this._disposers.push(this._axisBreaks.template);
		}
		return this._axisBreaks;
	}

	/**
	 * Creates a new axis break.
	 *
	 * @return {this["_axisBreak"]} Axis break
	 */
	protected createAxisBreak(): this["_axisBreak"] {
		return new AxisBreak();
	}

	/**
	 * A list of Series currently associated with this Axis.
	 *
	 * @return {List<XYSeries>} Series
	 */
	public get series(): List<XYSeries> {
		if (!this._series) {
			this._series = new List<XYSeries>();
		}
		return this._series;
	}

	/**
	 * Processes Series' data items.
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 */
	public processSeriesDataItems(): void {

	}

	/**
	 * Processes Series' single data item.
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @param {XYSeriesDataItem} dataItem Data item
	 */
	public processSeriesDataItem(dataItem: XYSeriesDataItem, axisLetter?: string): void {

	}

	/**
	 * Post-processes Serie's data items.
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 */
	public postProcessSeriesDataItems(): void {

	}

	/**
	 * Post-processes Serie's single data item.
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @param {XYSeriesDataItem} dataItem Data item
	 */
	public postProcessSeriesDataItem(dataItem: XYSeriesDataItem): void {

	}

	//

	/**
	 * Updates Axis based on all Series that might influence it.
	 *
	 * Called by Series after Series data is validated.
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 */
	public updateAxisBySeries(): void {

	}

	/**
	 * Hides unused data items.
	 *
	 * @ignore Exclude from docs
	 */
	public hideUnusedDataItems(): void {
		// hide all unused
		let dataItemsIterator: $iter.ListIterator<this["_dataItem"]> = this._dataItemsIterator;

		dataItemsIterator.createNewItems = false;

		$iter.each(dataItemsIterator.iterator(), (dataItem) => {
			this.validateDataElement(dataItem); // solves shrinking
			dataItem.__disabled = true;
		});

		dataItemsIterator.clear();
		dataItemsIterator.createNewItems = true;
	}

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
	public getSeriesDataItem(series: XYSeries, position: number): XYSeriesDataItem {
		return;
	}

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
	public getAngle(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number {
		return;
	}

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
	public getX(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number {
		return;
	}

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
	public getY(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string): number {
		return;
	}

	/**
	 * Coordinates of the actual axis start.
	 *
	 * @ignore Exclude from docs
	 * @return {IPoint} Base point coordinates
	 */
	public get basePoint(): IPoint {
		return { x: 0, y: 0 };
	}

	/**
	 * [dataChangeUpdate description]
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public dataChangeUpdate(): void {

	}

	/**
	 * Removes axis breaks that fall between `min` and `max` (???)
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param  {number}  min  Start value
	 * @param  {number}  max  End value
	 * @return {number}       Spread o
	 */
	protected adjustDifference(min: number, max: number): number {
		let difference: number = max - min;
		if ($type.isNumber(difference)) {
			$iter.eachContinue(this.axisBreaks.iterator(), (axisBreak) => {
				let startValue: number = axisBreak.adjustedStartValue;
				let endValue: number = axisBreak.adjustedEndValue;
				if ($type.isNumber(startValue) && $type.isNumber(endValue)) {
					// breaks are sorted, we don't need go further anymore
					if (startValue > max) {
						return false;
					}

					if (endValue >= min) {
						if ($type.isNumber(startValue) && $type.isNumber(endValue)) {
							let breakSize: number = axisBreak.breakSize;

							let intersection: IRange = $math.intersection({ start: startValue, end: endValue }, { start: min, end: max });

							if (intersection) {
								difference -= (intersection.end - intersection.start) * (1 - breakSize);
							}
						}
					}

					return true;
				}
			});
			return difference;
		}
	}

	/**
	 * Checks if specific value falls within a break.
	 *
	 * Returns [[AxisBreak]] the value falls into.
	 *
	 * @param  {number}     value  Value to check
	 * @return {AxisBreak}         Axis break
	 */
	protected isInBreak(value: number): AxisBreak {
		return $iter.find(this.axisBreaks.iterator(), (axisBreak) =>
			value >= axisBreak.adjustedStartValue &&
			value <= axisBreak.adjustedEndValue);
	}

	/**
	 * [fixAxisBreaks description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected fixAxisBreaks(): void {
		let axisBreaks: SortedListTemplate<AxisBreak> = this.axisBreaks;
		if (axisBreaks.length > 0) {
			// first make sure that startValue is <= end value
			// This needs to make a copy of axisBreaks because it mutates the list while traversing
			// TODO very inefficient
			$array.each($iter.toArray(axisBreaks.iterator()), (axisBreak) => {
				let startValue: number = $math.min(axisBreak.startValue, axisBreak.endValue);
				let endValue: number = $math.max(axisBreak.startValue, axisBreak.endValue);

				axisBreak.adjustedStartValue = startValue;
				axisBreak.adjustedEndValue = endValue;

				this.axisBreaks.update(axisBreak);
			});


			let firstAxisBreak: AxisBreak = axisBreaks.first;
			let previousEndValue: number = Math.min(firstAxisBreak.startValue, firstAxisBreak.endValue);

			// process breaks
			// TODO does this need to call axisBreaks.update ?
			$iter.each(this.axisBreaks.iterator(), (axisBreak) => {
				let startValue: number = axisBreak.adjustedStartValue;
				let endValue: number = axisBreak.adjustedEndValue;

				// breaks can't overlap
				// if break starts before previous break ends
				if (startValue < previousEndValue) {
					startValue = previousEndValue;

					if (endValue < previousEndValue) {
						endValue = previousEndValue;
					}
				}

				axisBreak.adjustedStartValue = startValue;
				axisBreak.adjustedEndValue = endValue;
			});
		}
	}

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
	public set startIndex(value: number) {
	}

	/**
	 * @ignore Exclude from docs
	 * @return {number} [description]
	 */
	public get startIndex(): number {
		return 0;
	}

	/**
	 * [endIndex description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param {number} value [description]
	 */
	public set endIndex(value: number) {
	}

	/**
	 * @ignore Exclude from docs
	 * @return {number} [description]
	 */
	public get endIndex(): number {
		return this.dataItems.length;
	}


	/**
	 * Returns a formatted label based on position.
	 *
	 * Individual axis types should override this method to generate a label
	 * that is relevant to axis type.
	 *
	 * @param  {number}  position  Relative position on axis (0-1)
	 * @return {string}            Position label
	 */
	public getPositionLabel(position: number): string {
		return Math.round(position * 100) + "%x";
	}

	/**
	 * A Chart this Axis belongs to.
	 *
	 * @param {Chart}  value  Chart
	 */
	public set chart(value: Chart) {
		this._chart = value;
	}

	/**
	 * @return {Chart} Chart
	 */
	public get chart(): Chart {
		return this._chart;
	}

	/**
	 * Creates a data item for a Series range.
	 *
	 * @param  {XYSeries}  series  Target Series
	 * @return {this}            Range data item
	 */
	public createSeriesRange(series: XYSeries): this["_dataItem"] {
		let range = this.createDataItem();
		range.component = this;
		range.axisFill.disabled = false;
		series.axisRanges.push(range);
		return range;
	}

	/**
	 * Copies all properties and related data from a different instance of Axis.
	 *
	 * @param {this} source Source Axis
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		if (this.renderer) {
			this.renderer.copyFrom(source.renderer);
		}
		if (source.title) {
			this.title = source.title.clone();
		}
	}

	/**
	 * Resets internal iterator.
	 */
	protected resetIterators(): void {
		this._dataItemsIterator.reset();
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param {object}  config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Set up axis ranges
			if ($type.hasValue(config.axisRanges) && $type.isArray(config.axisRanges)) {
				for (let i = 0, len = config.axisRanges.length; i < len; i++) {
					let range = config.axisRanges[i];

					// If `series` is set, we know it's a series range
					if ($type.hasValue(range["series"])) {
						if ($type.isString(range["series"])) {
							if (this.map.hasKey(range["series"])) {
								//range["series"] = this.map.getKey(range["series"]);
								config.axisRanges[i] = this.createSeriesRange(this.map.getKey(range["series"]));
								delete (range["series"]);
								config.axisRanges[i].config = range;
							}
						}
					}
				}
			}
		}
		super.processConfig(config);
	}


	/**
	 * Axis start location. Works on Date/Category axis, doesn't work on Value axis.
	 *
	 * * 0 - Full first cell is shown.
	 * * 0.5 - Half of first cell is shown.
	 * * 1 - None of the first cell is visible. (you probably don't want that)
	 *
	 * @param {number} value Location (0-1)
	 */
	public set startLocation(value: number) {
		this.setPropertyValue("startLocation", value, true);
	}

	/**
	 * @return {number} Location (0-1)
	 */
	public get startLocation(): number {
		return this.getPropertyValue("startLocation");
	}

	/**
	 * Axis end location. Works on Date/Category axis, doesn't work on Value axis.
	 *
	 * * 0 - None of the last cell is shown. (don't do that)
	 * * 0.5 - Half of the last cell is shown.
	 * * 1 - Full last cell is shown.
	 *
	 * @param {number} value Location (0-1)
	 */
	public set endLocation(value: number) {
		this.setPropertyValue("endLocation", value, true);
	}

	/**
	 * @return {number} Location (0-1)
	 */
	public get endLocation(): number {
		return this.getPropertyValue("endLocation");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Axis"] = Axis;
registry.registeredClasses["AxisDataItem"] = AxisDataItem;
