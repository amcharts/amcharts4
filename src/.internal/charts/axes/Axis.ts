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
import { Sprite } from "../../core/Sprite";
import { DataItem, IDataItemAdapters } from "../../core/DataItem";

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
import { defaultRules, ResponsiveBreakpoints } from "../../core/utils/Responsive";


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
	 */
	protected _grid: Grid;

	/**
	 * Reference to a related [[AxisTick]] element.
	 */
	protected _tick: AxisTick;

	/**
	 * Reference to a related [[AxisLabel]] element.
	 */
	protected _label: AxisLabel;

	/**
	 * Reference to a related [[AxisFill]] element.
	 */
	protected _axisFill: AxisFill;

	/**
	 * A mask for axis. We're using [[AxisFill]] since the mask, basically, has
	 * the same shape and features.
	 */
	protected _mask: AxisFill;

	/**
	 * Container which might be used to hold some extra items, like series
	 * segments when data item is used for axis range.
	 */
	protected _contents: Container;

	/**
	 * A text to be used as label for this data item.
	 */
	protected _text: string;

	/**
	 * Holds a physical position of the grid line associated with this data item,
	 * so that it can be used when measuring distance between points, and hiding
	 * some of them so they don't overlap.
	 */
	public point: IPoint;

	/**
	 * If the data item is within an existing [[AxisBreak]] this property will
	 * hold a reference to that [[AxisBreak]].
	 */
	public _axisBreak: AxisBreak;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: Axis;

	/**
	 * Used to distinguish from real data points and those data items that are
	 * used for ranges, like `series.axisRanges` or `axis.axisRanges`.
	 *
	 * @ignore Exclude from docs
	 */
	public isRange: boolean;

	/**
	 * relative position of data item on axis
	 */
	public position: number;

	/**
	 * @ignore
	 */
	protected _bullet: Sprite;

	/**
	 * Allows hiding axis item (tick, label, grid) if it is closer to axis
	 * beginning than this relative position (0-1).
	 *
	 * For axis labels it overrides `minLabelPosition` if set.
	 *
	 * ```TypeScript
	 * // Hide all ticks and labels closer than 20% to axis beginning.
	 * axis.renderer.ticks.template.minPosition = 0.2;
	 * axis.renderer.labels.template.minPosition = 0.2;
	 * ```
	 * ```JavaScript
	 * // Hide all ticks and labels closer than 20% to axis beginning.
	 * axis.renderer.ticks.template.minPosition = 0.2;
	 * axis.renderer.labels.template.minPosition = 0.2;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "xAxes": [{
	 *     // ...
	 *     // Hide all ticks and labels closer than 20% to axis beginning.
	 *     "renderer": {
	 *       "ticks": {
	 *         "minPosition": 0.2
	 *       },
	 *       "labels": {
	 *         "minPosition": 0.2
	 *       }
	 *     }
	 *   }]
	 * }
	 * ```
	 * 
	 * @since 4.5.11
	 */
	public minPosition?: number;

	/**
	 * Allows hiding axis item (tick, label, grid) if it is closer to axis
	 * end than this relative position (0-1).
	 *
	 * For axis labels it overrides `maxLabelPosition` if set.
	 *
	 * ```TypeScript
	 * // Hide all ticks and labels closer than 20% to axis end.
	 * axis.renderer.ticks.template.minPosition = 0.8;
	 * axis.renderer.labels.template.minPosition = 0.8;
	 * ```
	 * ```JavaScript
	 * // Hide all ticks and labels closer than 20% to axis end.
	 * axis.renderer.ticks.template.minPosition = 0.8;
	 * axis.renderer.labels.template.minPosition = 0.8;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "xAxes": [{
	 *     // ...
	 *     // Hide all ticks and labels closer than 20% to axis end.
	 *     "renderer": {
	 *       "ticks": {
	 *         "minPosition": 0.8
	 *       },
	 *       "labels": {
	 *         "minPosition": 0.8
	 *       }
	 *     }
	 *   }]
	 * }
	 * ```
	 * 
	 * @since 4.5.11
	 */
	public maxPosition?: number;


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "AxisDataItem";
		this.applyTheme();
	}

	/**
	 * Actual index of the axis data item.
	 * 
	 * @since 4.7.8
	 */
	public itemIndex: number;

	/**
	 * A [[Grid]] element associated with this data item.
	 *
	 * If there is no grid element associated with data item, a new one is
	 * created and returned.
	 *
	 * @param grid  Grid element
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
	 * @return Grid element
	 */
	public get grid(): Grid {
		if (!this._grid) {
			let component = this.component;
			if (component) {

				let template: Grid;
				let grid: Grid;

				if (this.isRange) {
					template = component.axisRanges.template.grid;
					if (template.disabled) {
						return;
					}
					else {
						grid = template.clone();
					}
				}
				else {
					template = component.renderer.grid.template;
					if (template.disabled) {
						return;
					}
					else {
						grid = component.renderer.grid.create();
						this._disposers.push(new Disposer(() => {
							component.renderer.grid.removeValue(grid);
						}));
					}
				}

				this.grid = grid;
				grid.shouldClone = false;
				this._disposers.push(grid);
				grid.axis = this.component;
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
	 * @param tick  Tick element
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
	 * @return Tick element
	 */
	public get tick(): AxisTick {
		if (!this._tick) {
			let component = this.component;
			if (component) {

				let template: AxisTick;
				let tick: AxisTick;

				if (this.isRange) {
					template = component.axisRanges.template.tick;
					if (template.disabled) {
						return;
					}
					else {
						tick = template.clone();
					}
				}
				else {
					template = component.renderer.ticks.template;
					if (template.disabled) {
						return;
					}
					else {
						tick = component.renderer.ticks.create();
						this._disposers.push(new Disposer(() => {
							component.renderer.ticks.removeValue(tick);
						}));
					}
				}

				this.tick = tick;
				tick.axis = this.component;
				tick.shouldClone = false;
				this._disposers.push(tick);
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
	 * @param label Label element
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
	 * @return Label element
	 */
	public get label(): AxisLabel {
		if (!this._label) {
			let component = this.component;
			if (component) {

				let template: AxisLabel;
				let label: AxisLabel;

				if (this.isRange) {
					template = component.axisRanges.template.label;
					if (template.disabled) {
						return;
					}
					else {
						label = template.clone();
					}
				}
				else {
					template = component.renderer.labels.template;
					if (template.disabled) {
						return;
					}
					else {
						label = component.renderer.labels.create();
						this._disposers.push(new Disposer(() => {
							component.renderer.labels.removeValue(label);
						}));
					}
				}

				this._disposers.push(label);
				this.label = label;
				label.shouldClone = false;
				label.axis = this.component;
				label.virtualParent = component;
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
	 * @param label Label element
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
	 * @return Label element
	 */
	public get axisFill(): AxisFill {
		if (!this._axisFill) {
			let component = this.component;
			if (component) {

				let template: AxisFill;
				let axisFill: AxisFill;

				if (this.isRange) {
					template = component.axisRanges.template.axisFill;
					if (!this.isTemplate && template.disabled) {
						return;
					}
					else {
						axisFill = template.clone();
					}
				}
				else {
					template = component.renderer.axisFills.template;
					if (template.disabled) {
						return;
					}
					else {
						axisFill = component.renderer.axisFills.create();
						this._disposers.push(new Disposer(() => {
							component.renderer.axisFills.removeValue(axisFill);
						}));
					}
				}

				this.axisFill = axisFill;
				axisFill.shouldClone = false;
				this._disposers.push(axisFill);
			}
		}
		return this._axisFill;
	}

	/**
	 * Text to be used as data item's label.
	 *
	 * @param text Text label
	 */
	public set text(text: string) {
		this._text = text;
		if (this._label) { // do not use getter, it will create unwanted instances!
			this._label.text = text;
		}
	}

	/**
	 * @return Text label
	 */
	public get text(): string {
		return this._text;
	}

	/**
	 * Data item's mask.
	 *
	 * @return Mask
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
	 * @return Contents container
	 */
	public get contents(): Container {
		if (!this._contents) {
			let contents = new Container();
			this.addSprite(contents);
			contents.isMeasured = false;
			this._contents = contents;

			let component = this.component;
			if (component) {
				let mask: AxisFill = component.renderer.createFill(this.component);
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
	 * @param axisBreak Axis break
	 */
	public set axisBreak(axisBreak: this["_axisBreak"]) {
		if (this._axisBreak) {
			this._axisBreak.dataItems.removeValue(this);
		}
		if (axisBreak) {
			axisBreak.dataItems.push(this);
		}
		this._axisBreak = axisBreak;
	}

	/**
	 * @return Axis break
	 */
	public get axisBreak(): this["_axisBreak"] {
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
	 * @param a  Item A
	 * @param b  Item B
	 * @return Order
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
	 * @param prop  Property name
	 * @return Property set?
	 */
	protected hasProperty(prop: string): boolean {
		return prop == "component" ? true : super.hasProperty(prop);
	}

	/**
	 * Copies all parameters from another [[AxisDataItem]].
	 *
	 * @param source Source AxisDataItem
	 */
	public copyFrom(source: this) {
		super.copyFrom(source);
		this.text = source.text;
		if (source.bullet) {
			this.bullet = source.bullet.clone();
		}

		this.minPosition = source.minPosition;
		this.maxPosition = source.maxPosition;
	}

	/**
	 * Sets visibility of the Data Item.
	 *
	 * @param value Data Item
	 */
	public setVisibility(value: boolean, noChangeValues?: boolean): void {
		super.setVisibility(value, noChangeValues);
		if (this._contents) {
			this._contents.visible = value;
		}
	}

	/**
	 * Set it to an instance of any [[Sprite]]. It will be displayed as an axis
	 * bullet in the middle of the cell, or specific value.
	 *
	 * If you need position bullet relatively to the cell, use [[AxisBullet]]
	 * instead. It has a `location` property which can be used to indicate
	 * precise relative location within cell/range.
	 *
	 * Also, [[AxisBullet]] is a [[Container]] so you can push any other element
	 * into it.
	 *
	 * NOTE: `location` is relative to the parent axis range's scope, i.e.
	 * between its `date` and `endDate` for [[DateAxis]], or `value`/`endValue`
	 * ([[ValueAxis]]), or `category`/`endCategory` ([[categoryAxis]]).
	 * 
	 * ```TypeScript
	 * let range = dateAxis.axisRanges.create();
	 * range.date = new Date(2018, 0, 5);
	 * 
	 * let flag = new am4plugins_bullets.FlagBullet();
	 * flag.label.text = "Hello";
	 *
	 * range.bullet = flag;
	 * ```
	 * ```JavaScript
	 * var range = dateAxis.axisRanges.create();
	 * range.date = new Date(2018, 0, 5);
	 * 
	 * var flag = new am4plugins_bullets.FlagBullet();
	 * flag.label.text = "Hello";
	 *
	 * range.bullet = flag;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "xAxes": [{
	 *     "type": "DateAxis",
	 *     // ...
	 *     "axisRanges": [{
	 *       "date": new Date(2018, 0, 5),
	 *       "bullet: {
	 *         "type": "FlagBullet",
	 *         "label": {
	 *           "text": "Hello"
	 *         }
	 *       }
	 *     }]
	 *   }]
	 * }
	 * ```
	 *
	 * @since 4.5.9
	 * @param  value  Bullet
	 */
	public set bullet(value: Sprite) {
		if (this._bullet && this._bullet != value) {
			$array.remove(this.sprites, this._bullet);
			this._bullet.dataItem = undefined;
		}

		this._bullet = value;
		if (value) {
			this.addSprite(value);
		}
	}

	/**
	 * @return Bullet
	 */
	public get bullet(): Sprite {
		return this._bullet;
	}



}

/**
 * Defines adapters for [[AxisDataItem]]
 * Includes both the [[DataItemAdapter]] definitions and properties
 * @see {@link DataItemAdapter}
 */
export interface IAxisDataItemAdapters extends IDataItemAdapters {

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
	 * @param value Location (0-1)
	 */
	startLocation?: number;


	/**
	 * Axis end location.
	 *
	 * * 0 - None of the last cell is shown. (don't do that)
	 * * 0.5 - Half of the last cell is shown.
	 * * 1 - Full last cell is shown.
	 *
	 * @param value Location (0-1)
	 */
	endLocation?: number;

	/**
	 * Indicates if cusor's tooltip should be shown on this Axis.
	 */
	cursorTooltipEnabled?: boolean;

	/**
	 * Normally, when axis is zoomed in, a zoom out button is shown by a chart,
	 * and vice versa: when axis is zoomed out completely, zoom out button is
	 * hidden.
	 *
	 * Setting this to `false` will disable this behavior. Zooming in our out
	 * this axis will not reveal or hide zoom out button.
	 *
	 * @default true
	 */
	toggleZoomOutButton?: boolean;

	/**
	 * Indicates if axis' tooltip should be hidden while axis range is animating
	 * (zooming)
	 *
	 * @since 4.7.16
	 * @default true
	 */
	hideTooltipWhileZooming?: boolean;
}

/**
 * Defines events for [[Axis]].
 */
export interface IAxisEvents extends IComponentEvents {

	/**
	 * Invoked when available axis lenght changes, e.g. after resizing the whole
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
	 * Applied to the tooltip text before it is shown.
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
	 */
	public _dataFields: IAxisDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IAxisProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisAdapters;

	/**
	 * Defines the type of the [[DataItem]] used in the class.
	 */
	public _dataItem: AxisDataItem;

	/**
	 * A list of Axis Ranges.
	 */
	protected _axisRanges: ListTemplate<this["_dataItem"]>;

	/**
	 * Defines the type of the axis breaks.
	 */
	public _axisBreak: AxisBreak;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisEvents;

	/**
	 * A [[Label]] instance that is used for Axis title label.
	 */
	protected _title: Label;

	/**
	 * "X", "Y", etc.
	 *
	 * This is needed so that Axis knows which of the values from series' data
	 * items it should use.
	 *
	 * @ignore Exclude from docs
	 */
	public axisLetter: string;

	/**
	 * A reference to chart the axis is for.
	 */
	protected _chart: Chart;

	/**
	 * A type for renderer used for this Axis.
	 */
	public _renderer: T;

	/**
	 * Number of Grid elements on the axis.
	 */
	protected _gridCount: number = 10;

	/**
	 * A list of [[XYSeries]] that are using this Axis.
	 */
	protected _series: List<XYSeries> = new List<XYSeries>();

	/**
	 * Holds the length of the Axis, so that we can check if it changed after
	 * other changes and we need to update layouts.
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
	 */
	public axisFieldName: string;

	// we save these values so that cursur could use them if axis line is a fill

	/**
	 * [currentItemStartPoint description]
	 *
	 * @ignore Exclude from docs
	 */
	public currentItemStartPoint: IPoint;

	/**
	 * [currentItemEndPoint description]
	 *
	 * @ignore Exclude from docs
	 */
	public currentItemEndPoint: IPoint;

	protected _tooltipPosition: number;

	/**
	 * @ignore
	 */
	public relativePositionSprite?: Sprite;

	/**
	 * Holds reference to a function that accepts a DataItem and its index as
	 * parameters.
	 *
	 * It can either return a fill opacity for a fill, or manipulate data item
	 * directly, to create various highlighting scenarios.
	 *
	 * For example, you can set it up to highlight only weekends on a
	 * [[DateAxis]].
	 */
	public fillRule(dataItem: this["_dataItem"], index?: number): void {
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
	}

	/**
	 * Full length of the axis, in pixels.
	 *
	 * @readonly
	 */
	public axisFullLength: number;

	/**
	 * Ghost label is used to prevent chart shrinking/expanding when zooming or
	 * when data is invalidated. You can set custom text on it so that it would
	 * be bigger/smaller,
	 */
	public ghostLabel: AxisLabel;

	/**
	 * Specifies if axis should be automatically disposed when removing from
	 * chart's axis list.
	 *
	 * @default true
	 */
	public autoDispose: boolean = true;

	/**
	 * @ignore
	 */
	protected _axisItemCount: number = 0;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		if (this.constructor === Axis) {
			throw new Error("'Axis' cannot be instantiated directly. Please use a specific axis type.");
		}

		this.hideTooltipWhileZooming = true;
		this.minWidth = 0.0001;
		this.minHeight = 0.0001;
		this.className = "Axis";
		this.shouldClone = false;
		this.setPropertyValue("cursorTooltipEnabled", true);
		this.toggleZoomOutButton = true;

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
		tooltip.background.filters.clear();

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

		// Accessibility
		this.readerHidden = true;

		this.events.on("rangechangestarted", () => {

			this.series.each((series) => {
				if (series.hideTooltipWhileZooming) {
					series.tooltip.hide();
					series.tooltip.preventShow = true;
				}
			})
			if (this.hideTooltipWhileZooming) {
				this.tooltip.hide();
				this.tooltip.preventShow = true;
			}
		}, undefined, false);

		this.events.on("rangechangeended", () => {
			this.series.each((series) => {
				if (series.hideTooltipWhileZooming) {
					series.tooltip.hide();
					series.tooltip.preventShow = false;
				}
			})
			if (this.hideTooltipWhileZooming) {
				this.tooltip.hide();
				this.tooltip.preventShow = false;
			}
		}, undefined, false);

		this.applyTheme();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
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
	 */
	public invalidateSeries(): void {
		// this puts series after axis in invalidation order also makes series update it's data items in case widht/height of a series is not 100%
		$iter.each(this.series.iterator(), (series) => {
			series.invalidate();
		});
	}

	/**
	 * Override to cancel super call for data element validation.
	 * @ignore
	 */
	public validateDataElements() {
		this._axisItemCount = 0;
		if (this.ghostLabel) {
			this.renderer.updateLabelElement(this.ghostLabel, this.start, this.end);
			this.ghostLabel.validate();
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
		let renderer = this.renderer;
		if (renderer) {
			renderer.updateAxisLine();
			renderer.updateTooltip();
			renderer.updateBaseGridElement();
		}

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
	 * @param dataItem Data item
	 */
	public appendDataItem(dataItem: this["_dataItem"]) {
		let renderer: AxisRenderer = this.renderer;


		let tick = dataItem.tick;
		if (tick) {
			if (tick.above) {
				tick.parent = renderer.bulletsContainer;
			}
			else {
				tick.parent = renderer.gridContainer;
			}
		}

		if (dataItem.label) {
			dataItem.label.parent = renderer;
		}

		let axisFill = dataItem.axisFill;
		if (axisFill) {
			if (axisFill.above) {
				axisFill.parent = renderer.bulletsContainer;
			}
			else {
				axisFill.parent = renderer.gridContainer;
			}
		}

		let grid = dataItem.grid;
		if (grid) {
			if (grid.above) {
				grid.parent = renderer.bulletsContainer;
			}
			else {
				grid.parent = renderer.gridContainer;
			}
		}

		if (dataItem.bullet) {
			dataItem.bullet.parent = renderer.bulletsContainer;
		}
	}

	/**
	 * Redraws Axis' related items.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		super.validate();
		this.validateLayout();

		this.renderer.updateGridContainer();
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
			if (axisRange.grid) {
				axisRange.grid.validate();
			}
			if (axisRange.tick) {
				axisRange.tick.validate();
			}
			if (axisRange.axisFill) {
				axisRange.axisFill.validate();
			}
			if (axisRange.label) {
				axisRange.label.validate();
			}
		});
	}

	/**
	 * Invalidates all axis breaks, so they are redrawn.
	 *
	 * @ignore Exclude from docs
	 */
	public validateBreaks(): void {
		if (this._axisBreaks) {
			$iter.each(this._axisBreaks.iterator(), (axisBreak) => {
				axisBreak.invalidate();
			});
		}
	}

	/**
	 * Associates an Axis break with this Axis, after it is inserted into
	 * `axisBreaks`.
	 *
	 * @ignore Exclude from docs
	 * @param event Event
	 */
	public processBreak(event: IListEvents<this["_axisBreak"]>["inserted"]) {
		let axisBreak: this["_axisBreak"] = event.newValue;
		axisBreak.parent = this.renderer.breakContainer;
		axisBreak.axis = this;
	}

	/**
	 * Registers a [[XYSeries]] element with this Axis.
	 *
	 * Returns a [[Disposer]] for all events, added to Series for watching
	 * changes in Axis, and vice versa.
	 * @ignore
	 * @param series  Series
	 * @return Event disposer
	 */
	public registerSeries(series: XYSeries): IDisposer {
		this.series.moveValue(series);

		return new MultiDisposer([
			new Disposer(() => {
				this.series.removeValue(series);
			}),

			this.events.on("lengthchanged", series.invalidate, series, false),
			this.events.on("lengthchanged", series.createMask, series, false),
			this.events.on("startchanged", series.invalidate, series, false),
			this.events.on("endchanged", series.invalidate, series, false),
			//axis.events.on("validated", chart.handleCursorPositionChange, chart, false)			

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
	 * @param renderer  Renderer
	 */
	public set renderer(renderer: this["_renderer"]) {
		if (renderer != this._renderer) {
			this._renderer = renderer;
			renderer.chart = this.chart;
			renderer.axis = this;
			renderer.parent = this;
			this.title.parent = this; // we add title to axis and set layout in renderer to avoid one extra container, as otherwise axis container would be used for holding renderer only
			this.initRenderer();

			this._disposers.push(renderer.gridContainer.events.on("maxsizechanged", this.invalidate, this, false));

			let ghostLabel = this.renderer.labels.create();
			this._disposers.push(ghostLabel);
			ghostLabel.dataItem = this.dataItems.template.clone(); // just for the adapters not to fail
			ghostLabel.text = "L";
			ghostLabel.parent = this.renderer;
			ghostLabel.shouldClone = false;
			ghostLabel.fillOpacity = 0;
			ghostLabel.opacity = 0;
			ghostLabel.strokeOpacity = 0;
			ghostLabel.interactionsEnabled = false;
			ghostLabel.validate();

			this.ghostLabel = ghostLabel;

			this.events.on("beforedatavalidated", () => {
				ghostLabel.text = "L";
			}, undefined, false);
		}
	}

	/**
	 * @return Renderer
	 */
	public get renderer(): this["_renderer"] {
		return this._renderer;
	}

	/**
	 * Converts a relative position to angle. (for circular axes)
	 *
	 * @param position Position (0-1)
	 * @return Angle
	 */
	public positionToAngle(position: number): number {
		return this.renderer.positionToAngle(position);
	}

	/**
	 * Converts pixel coordinates to a relative position. (0-1)
	 *
	 * @param point  Coorinates (px)
	 * @return Position (0-1)
	 */
	public pointToPosition(point: IPoint): number {
		return this.renderer.pointToPosition(point);
	}

	/**
	 * Converts relative position to coordinate.
	 *
	 * @since 4.7.15
	 * @param position (0-1)
	 * @return coordinate (px)
	 */
	public positionToCoordinate(position: number): number {
		return this.renderer.positionToCoordinate(position);
	}

	/**
	 * [getAnyRangePath description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param start  [description]
	 * @param end    [description]
	 * @return [description]
	 */
	public getAnyRangePath(start: any, end: any): string {
		return this.renderer.getPositionRangePath(start, end);
	}

	/**
	 * Converts any positional parameter to a relative position on axis.
	 *
	 * @todo Description (review)
	 * @param value  Pisition
	 * @return Position (0-1)
	 */
	public anyToPosition(value: any): number {
		return 0;
	}

	/**
	 * Converts any positional parameter to a relative position on axis.
	 *
	 * @todo Description (review)
	 * @param value  Pisition
	 * @return Orientation point
	 */
	public anyToPoint(value: any): IOrientationPoint {
		return { x: 0, y: 0, angle: 0 };
	}

	/**
	 * [getPositionRangePath description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param startPosition [description]
	 * @param endPosition   [description]
	 * @return [description]
	 */
	public getPositionRangePath(startPosition: number, endPosition: number): string {
		if (this.renderer) {
			return this.renderer.getPositionRangePath(startPosition, endPosition);
		}
		return "";
	}

	/**
	 * Actual axis length in pixels.
	 *
	 * @return Axis length (px)
	 */
	public get axisLength(): number {
		if (this.renderer) {
			return this.renderer.axisLength;
		}
		return 0;
	}

	/**
	 * Indicates if axis should display a tooltip for chart's cursor.
	 *
	 * @param value Display tooltip?
	 */
	public set cursorTooltipEnabled(value: boolean) {
		if (this.setPropertyValue("cursorTooltipEnabled", value)) {
			if (value && this.renderer) {
				this.renderer.updateTooltip();
			}
			else if (this.tooltip) {
				this.tooltip.hide(0);
			}
		}
	}

	/**
	 * Normally, when axis is zoomed in, a zoom out button is shown by a chart,
	 * and vice versa: when axis is zoomed out completely, zoom out button is
	 * hidden.
	 *
	 * Setting this to `false` will disable this behavior. Zooming in our out
	 * this axis will not reveal or hide zoom out button.
	 *
	 * @default true
	 * @since 4.6.2
	 * @param  value  Toggle zoom out button?
	 */
	public set toggleZoomOutButton(value: boolean) {
		this.setPropertyValue("toggleZoomOutButton", value);
	}

	/**
	 * @return Toggle zoom out button?
	 */
	public get toggleZoomOutButton(): boolean {
		return this.getPropertyValue("toggleZoomOutButton");
	}

	/**
	 * @return Display tooltip?
	 */
	public get cursorTooltipEnabled(): boolean {
		return this.getPropertyValue("cursorTooltipEnabled");
	}

	/**
	 * Hides element's [[Tooltip]].
	 *
	 * @see {@link Tooltip}
	 */
	public hideTooltip(duration?: number): void {
		super.hideTooltip(duration);
		this._tooltipPosition = undefined;
	}

	/**
	 * Shows Axis tooltip at specific relative position within Axis. (0-1)
	 *
	 * @param position Position (0-1)
	 * @param local or global position
	 */
	public showTooltipAtPosition(position: number, local?: boolean) {
		let tooltip: Tooltip = this._tooltip;

		if (!tooltip || this.dataItems.length <= 0) {
			this._tooltipPosition = undefined;
		}
		else {
			if (!local) {
				position = this.toAxisPosition(position);
			}

			if (!$type.isNumber(position) || position < this.start || position > this.end) {
				tooltip.hide(0);
				this._tooltipPosition = undefined;
				return;
			}

			let renderer = this.renderer;

			//@todo: think of how to solve this better
			if (!tooltip.parent) {
				tooltip.parent = this.tooltipContainer;
			}

			let tooltipLocation = renderer.tooltipLocation;

			let startPosition: number = this.getCellStartPosition(position);
			let endPosition: number = this.getCellEndPosition(position);

			if (this.tooltipPosition == "fixed") {
				position = $math.ceil(startPosition + (endPosition - startPosition) * tooltipLocation, 4);
			}

			position = $math.fitToRange(position, this.start, this.end);

			if (this._tooltipPosition != position) {
				this._tooltipPosition = position;

				let tooltipLocation2 = renderer.tooltipLocation2;

				let startPoint: IPoint = renderer.positionToPoint(startPosition, tooltipLocation2);
				let endPoint: IPoint = renderer.positionToPoint(endPosition, tooltipLocation2);

				// save values so cursor could use them
				this.currentItemStartPoint = startPoint;
				this.currentItemEndPoint = endPoint;

				if (renderer.fullWidthTooltip) {
					tooltip.width = endPoint.x - startPoint.x;
					tooltip.height = endPoint.y - startPoint.y;
				}

				let point: IPoint = renderer.positionToPoint(position, tooltipLocation2);
				let globalPoint: IPoint = $utils.spritePointToSvg(point, this.renderer.line);
				tooltip.text = this.getTooltipText(position);

				if (tooltip.text) {
					tooltip.pointTo(globalPoint);
					tooltip.show();
				}
			}

			if (!this.cursorTooltipEnabled || this.tooltip.disabled) {
				tooltip.hide(0);
			}
		}
	}

	/**
	 * Converts relative position (0-1) to Axis position with zoom level and
	 * inversed taken into account.
	 *
	 * @param position Global position (0-1)
	 * @return Position within Axis (0-1)
	 */
	public toAxisPosition(position: number): number {

		position = this.renderer.toAxisPosition(position);

		if (position == undefined) {
			return;
		}

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
	 * Converts position on the axis with zoom level and
	 * inversed taken into account to global position.
	 *
	 * @param position Axis position (0-1)
	 * @return Global position (0-1)
	 */
	public toGlobalPosition(position: number): number {
		if (this.renderer.inversed) {
			position = this.end - position;
		}
		else {
			position = position - this.start;
		}

		return position / (this.end - this.start);
	}

	/**
	 * Returns text to be used for cursor's Axis tooltip.
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @param position  Position coordinate (px)
	 * @return Label text
	 */
	public getTooltipText(position: number): string {
		return;
	}

	/**
	 * Updates Axis' tooltip's position and possibly size, and pointer (stem)
	 * place.
	 *
	 * @ignore Exclude from docs
	 * @param pointerOrientation  Pointer (stem) orientation
	 * @param boundingRectangle   A rectangle for tooltip to fit within
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
	 * @param position  Relative position
	 * @param location  Location on axis
	 * @return Rounded position
	 */
	public roundPosition(position: number, location: AxisItemLocation, axisLocation?: number): number {
		return position;
	}

	/**
	 * [getCellStartPosition description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param position [description]
	 * @return [description]
	 */
	public getCellStartPosition(position: number): number {
		return position;
	}

	/**
	 * [getCellEndPosition description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param position [description]
	 * @return [description]
	 */
	public getCellEndPosition(position: number): number {
		return position;
	}

	/**
	 * A list of axis ranges for this Axis.
	 *
	 * @return Axis ranges
	 */
	public get axisRanges(): ListTemplate<this["_dataItem"]> {
		if (!this._axisRanges) {
			let dataItem: AxisDataItem = this.createDataItem();
			dataItem.isRange = true;
			dataItem.axisFill = this.renderer.axisFills.template.clone();
			dataItem.grid = this.renderer.grid.template.clone();
			dataItem.tick = this.renderer.ticks.template.clone();
			dataItem.label = this.renderer.labels.template.clone();

			dataItem.isTemplate = true;
			dataItem.component = this;
			dataItem.axisFill.disabled = false;
			dataItem.tick.disabled = false;
			dataItem.grid.disabled = false;
			dataItem.label.disabled = false;

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
	 * @param event Event
	 */
	protected processAxisRange(event: IListEvents<this["_dataItem"]>["inserted"]) {
		let axisRange: AxisDataItem = event.newValue;
		axisRange.component = this;
		axisRange.isRange = true;
	}

	/**
	 * A list of axis breaks on this Axis.
	 *
	 * @return Axis breaks.
	 */
	public get axisBreaks(): SortedListTemplate<this["_axisBreak"]> {
		if (!this._axisBreaks) {
			this._axisBreaks = new SortedListTemplate<this["_axisBreak"]>(this.createAxisBreak(), (a, b) => {
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
	 * @return Axis break
	 */
	protected createAxisBreak(): this["_axisBreak"] {
		return new AxisBreak();
	}

	/**
	 * A list of Series currently associated with this Axis.
	 *
	 * @return Series
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
	 * @param dataItem Data item
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
	 * @param dataItem Data item
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
	 * @param series    Series
	 * @param position  Position (0-1)
	 * @param findNearest  Should axis try to find nearest tooltip if there is no data item at exact position
	 * @return Data item
	 */
	public getSeriesDataItem(series: XYSeries, position: number, findNearest?: boolean): XYSeriesDataItem {
		return;
	}

	/**
	 * Returns an angle that corresponds to specific position on axis.
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem  Data item
	 * @param key       ???
	 * @param location  Location
	 * @param stackKey  ???
	 * @return Angle
	 */
	public getAngle(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		return;
	}

	/**
	 * [getX description]
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem [description]
	 * @param key      [description]
	 * @param location [description]
	 * @param stackKey [description]
	 * @return [description]
	 */
	public getX(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		return;
	}


	/**
	 * [getX description]
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem [description]
	 * @param key      [description]
	 * @param location [description]
	 * @param stackKey [description]
	 * @return [description]
	 */
	public getPositionX(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		return;
	}


	/**
	 * [getY description]
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem [description]
	 * @param key      [description]
	 * @param location [description]
	 * @param stackKey [description]
	 * @return [description]
	 */
	public getY(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		return;
	}

	/**
	 * [getY description]
	 *
	 * This is a placeholder to override for extending classes.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem [description]
	 * @param key      [description]
	 * @param location [description]
	 * @param stackKey [description]
	 * @return [description]
	 */
	public getPositionY(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		return;
	}

	/**
	 * Coordinates of the actual axis start.
	 *
	 * @ignore Exclude from docs
	 * @return Base point coordinates
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
	 * [dataChangeUpdate description]
	 *
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public seriesDataChangeUpdate(series: XYSeries): void {

	}

	/**
	 * Removes axis breaks that fall between `min` and `max` (???)
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param min  Start value
	 * @param max  End value
	 * @return Spread o
	 */
	protected adjustDifference(min: number, max: number): number {
		let difference: number = max - min;
		if ($type.isNumber(difference)) {
			if (this._axisBreaks) {
				$iter.eachContinue(this._axisBreaks.iterator(), (axisBreak) => {
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
			}
			return difference;
		}
	}

	/**
	 * Checks if specific value falls within a break.
	 *
	 * Returns [[AxisBreak]] the value falls into.
	 *
	 * @param value  Value to check
	 * @return Axis break
	 */
	protected isInBreak(value: number): this["_axisBreak"] {
		if (this._axisBreaks) {
			return $iter.find(this._axisBreaks.iterator(), (axisBreak) =>
				value >= axisBreak.adjustedStartValue &&
				value <= axisBreak.adjustedEndValue);
		}
	}

	/**
	 * [fixAxisBreaks description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected fixAxisBreaks(): void {
		if (this._axisBreaks) {
			let axisBreaks: SortedListTemplate<this["_axisBreak"]> = this._axisBreaks;
			if (axisBreaks.length > 0) {
				// first make sure that startValue is <= end value
				// This needs to make a copy of axisBreaks because it mutates the list while traversing
				// TODO very inefficient
				$array.each($iter.toArray(axisBreaks.iterator()), (axisBreak) => {
					let startValue: number = $math.min(axisBreak.startValue, axisBreak.endValue);
					let endValue: number = $math.max(axisBreak.startValue, axisBreak.endValue);

					axisBreak.adjustedStartValue = startValue;
					axisBreak.adjustedEndValue = endValue;

					this._axisBreaks.update(axisBreak);
				});


				let firstAxisBreak: this["_axisBreak"] = axisBreaks.first;
				let previousEndValue: number = Math.min(firstAxisBreak.startValue, firstAxisBreak.endValue);

				// process breaks
				// TODO does this need to call axisBreaks.update ?
				$iter.each(axisBreaks.iterator(), (axisBreak) => {
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
	 * @param value [description]
	 */
	public set startIndex(value: number) {
	}

	/**
	 * @ignore Exclude from docs
	 * @return [description]
	 */
	public get startIndex(): number {
		return 0;
	}

	/**
	 * [endIndex description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param value [description]
	 */
	public set endIndex(value: number) {
	}

	/**
	 * @ignore Exclude from docs
	 * @return [description]
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
	 * Please note that `position` represents position within axis which may be
	 * zoomed and not correspond to Cursor's `position`.
	 *
	 * To convert Cursor's `position` to Axis' `position` use `toAxisPosition()` method.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/tutorials/tracking-cursors-position-via-api/#Tracking_Cursor_s_position} For more information about cursor tracking.
	 * @param position  Relative position on axis (0-1)
	 * @return Position label
	 */
	public getPositionLabel(position: number): string {
		return Math.round(position * 100) + "%x";
	}

	/**
	 * A Chart this Axis belongs to.
	 *
	 * @param value  Chart
	 */
	public set chart(value: Chart) {
		this._chart = value;
	}

	/**
	 * @return Chart
	 */
	public get chart(): Chart {
		return this._chart;
	}

	/**
	 * Creates a data item for a Series range.
	 *
	 * @param series  Target Series
	 * @return Range data item
	 */
	public createSeriesRange(series: XYSeries): this["_dataItem"] {
		let range = this.axisRanges.create();
		range.component = this;
		range.axisFill = this.renderer.axisFills.template.clone();
		range.axisFill.disabled = false;
		range.axisFill.fillOpacity = 0;

		range.grid = this.renderer.grid.template.clone();
		range.grid.disabled = true;

		range.tick = this.renderer.ticks.template.clone();
		range.tick.disabled = true;

		range.label = this.renderer.labels.template.clone();
		range.label.disabled = true;

		series.axisRanges.push(range);
		return range;
	}

	/**
	 * Copies all properties and related data from a different instance of Axis.
	 *
	 * @param source Source Axis
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		if (this.renderer) {
			this.renderer.copyFrom(source.renderer);
		}
		else {
			if (source.renderer) {
				this.renderer = source.renderer.clone();
				this._disposers.push(this.renderer);
			}
		}
		if (source.title) {
			if (!this.title) {
				this.title = source.title.clone();
				this.title.parent = this;
			}
			else {
				this.title.copyFrom(source.title);
			}
			this._disposers.push(this.title);
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
	 * @param config  Config
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
	 * @param value Location (0-1)
	 */
	public set startLocation(value: number) {
		this.setPropertyValue("startLocation", value, true);
	}

	/**
	 * @return Location (0-1)
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
	 * @param value Location (0-1)
	 */
	public set endLocation(value: number) {
		this.setPropertyValue("endLocation", value, true);
	}

	/**
	 * @return Location (0-1)
	 */
	public get endLocation(): number {
		return this.getPropertyValue("endLocation");
	}


	protected setDisabled(value: boolean) {
		let changed = super.setDisabled(value);
		if (this.renderer) {
			this.renderer.gridContainer.disabled = value;
		}
		return changed;
	}

	/**
	 * A reference to a [[Label]] element which serves as a title to the axis.
	 *
	 * When axis is created it aleready has an element, so you can just modify
	 * it.
	 *
	 * Or you can replace it with your own instance of `Label`.
	 * 
	 * @param  value  Title label
	 */
	public set title(value: Label) {
		if (this._title && this._title != value) {
			this._title.dispose();
		}
		if (value) {
			this._title = value;
			value.parent = this;
			value.shouldClone = false;
		}
	}

	/**
	 * @return Title label
	 */
	public get title(): Label {
		return this._title;
	}


	/**
	 * Indicates if axis' tooltip should be hidden while axis range is animating
	 * (zooming)
	 * 
	 * @default true
	 * @since 4.7.16
	 * @param  value  Hide tooltip while zooming?
	 */
	public set hideTooltipWhileZooming(value: boolean) {
		this.setPropertyValue("hideTooltipWhileZooming", value);
	}

	/**
	 * @return Hide tooltip while zooming?
	 */
	public get hideTooltipWhileZooming(): boolean {
		return this.getPropertyValue("hideTooltipWhileZooming");
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

/**
 * Add default responsive rules
 */

/**
 * Disable axis tooltips.
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.maybeXS,
	state: function(target, stateId) {
		if (target instanceof Axis && target.tooltip) {
			let state = target.states.create(stateId);
			state.properties.cursorTooltipEnabled = false;
			return state;
		}

		return null;
	}
});