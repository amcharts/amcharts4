/**
 * Functionality for any series-based elements, like Line Series (graphs),
 * Pie slice lists, etc.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Component, IComponentProperties, IComponentDataFields, IComponentAdapters, IComponentEvents } from "../../core/Component";
import { AxisDataItem } from "../axes/Axis";
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { List, ListTemplate, IListEvents, ListDisposer } from "../../core/utils/List";
import { OrderedList, OrderedListTemplate } from "../../core/utils/SortedList";
import { Dictionary, DictionaryDisposer } from "../../core/utils/Dictionary";
import { DataItem, IDataItemEvents } from "../../core/DataItem";
import { Container } from "../../core/Container";
import { SerialChart } from "../types/SerialChart";
import { Label } from "../../core/elements/Label";
import { Axis } from "../axes/Axis";
import { Tooltip } from "../../core/elements/Tooltip";
import { Bullet } from "../elements/Bullet";
import { LegendDataItem, LegendSettings } from "../Legend";
import { Animation } from "../../core/utils/Animation";
import { options } from "../../core/Options";
import { Ordering } from "../../core/utils/Order";
import { registry } from "../../core/Registry";
import { system } from "../../core/System";
import { Color } from "../../core/utils/Color";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $ease from "../../core/utils/Ease";
import * as $utils from "../../core/utils/Utils";
import * as $object from "../../core/utils/Object";
import * as $type from "../../core/utils/Type";
import * as $array from "../../core/utils/Array";
import * as $colors from "../../core/utils/Colors";


export interface IHeatRule {
	target: Sprite;
	property: string;
	min: any;
	max: any;
	dataField?: string;
	minValue?: number;
	maxValue?: number;
}


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[Series]].
 *
 * @see {@link DataItem}
 */
export class SeriesDataItem extends DataItem {

	/**
	 * Related item's width in pixels.
	 *
	 * This is passed to bullets so that we'd know if the bullet (LabelBullet)
	 * fits to max width/height.
	 *
	 * At the moment this is only used by column series.
	 *
	 * @ignore Exclude from docs
	 * @type {number}
	 */
	public itemWidth: number;

	/**
	 * Related item's height in pixels.
	 *
	 * This is passed to bullets so that we'd know if the bullet (LabelBullet)
	 * fits to max width/height.
	 *
	 * At the moment this is only used by column series.
	 *
	 * @ignore Exclude from docs
	 * @type {number}
	 */
	public itemHeight: number;

	/**
	 * A dictionary of data items bullets, where key is uid of a bullet template.
	 *
	 * @ignore Exclude from docs
	 * @todo review description
	 * @type {Dictionary}
	 */
	public bullets = new Dictionary<string, Bullet>();

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 *
	 * @type {Series}
	 */
	public _component!: Series;


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SeriesDataItem";
		//@todo Should we make `bullets` list disposable?
		this._disposers.push(new DictionaryDisposer(this.bullets));

		this.values.value = {};
		this.values.value = {};

		this.applyTheme();
	}

	/**
	 * data items's numeric value.
	 *
	 * @param {number}  value  Value
	 */
	public set value(value: number) {
		this.setValue("value", value);
	}

	/**
	 * @return {number} Value
	 */
	public get value(): number {
		return this.values.value.value;
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[Series]].
 */
export interface ISeriesDataFields extends IComponentDataFields {
	/**
	 * Name of the field in data that holds numeric value.
	 *
	 * @type {string}
	 */
	value?: string;

	/**
	 * Name of the field in data that holds boolean flag if item should be hidden.
	 *
	 * @type {string}
	 */
	hidden?: string;
}

/**
 * Defines properties for [[Series]].
 */
export interface ISeriesProperties extends IComponentProperties {

	/**
	 * Minimal distance between two adjacent bullets in pixels.
	 *
	 * If bullet is closer, it will be skipped and not shown.
	 *
	 * This allows to avoid crammed up graphs wil a lot of bullets.
	 *
	 * @default 0
	 * @type {number}
	 */
	minBulletDistance?: number;

	/**
	 * Should series be hidden in chart's legend?
	 * @type {boolean}
	 */
	hiddenInLegend?: boolean;

	/**
	 * Specifies if the series should be initially hidden.
	 * @default false
	 * @type {boolean}
	 */
	hidden?: boolean;
}

/**
 * Defines events for [[Series]].
 */
export interface ISeriesEvents extends IComponentEvents {

	/**
	 * @todo Description
	 */
	selectionextremeschanged: {};

	/**
	 * @todo Description
	 */
	extremeschanged: {};

	/**
	 * @todo Description
	 */
	dataitemchanged: {
		dataItem: DataItem
	};

}

/**
 * Defines adapters for [[Series]].
 *
 * @see {@link Adapter}
 */
export interface ISeriesAdapters extends IComponentAdapters, ISeriesProperties {

	/**
	 * Applied to the series name when it is retrieved.
	 *
	 * @type {string}
	 */
	name: string,

	/**
	 * Applied to the name used by screen readers.
	 *
	 * @type {string}
	 */
	itemReaderText: string

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines base class for any kind of serial data.
 *
 * @see {@link ISeriesEvents} for a list of available Events
 * @see {@link ISeriesAdapters} for a list of available Adapters
 * @todo Separate axis-related stuff to some other class so that MapSeries would not have unrelated stuff
 */
export class Series extends Component {

	/**
	 * Defines the type of data fields used for the series.
	 *
	 * @type {ISeriesDataFields}
	 */
	public _dataFields: ISeriesDataFields;

	/**
	 * Defines available properties.
	 *
	 * @type {IComponentProperties}
	 */
	public _properties!: ISeriesProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {ISeriesAdapters}
	 */
	public _adapter!: ISeriesAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {ISeriesEvents}
	 */
	public _events!: ISeriesEvents;

	/**
	 * Defines a type of data item used for the series.
	 *
	 * @type {SeriesDataItem}
	 */
	public _dataItem: SeriesDataItem;

	/**
	 * A name of the Series.
	 *
	 * @type {string}
	 */
	protected _title: string;

	/**
	 * A reference to the legend data item related to this series.
	 *
	 * @type {LegendDataItem<Series, ISeriesEvents>}
	 */
	protected _legendDataItem: LegendDataItem;

	/**
	 * Should this series excluded from the axis scale calculations?
	 *
	 * @default false
	 * @type {boolean}
	 */
	protected _ignoreMinMax: boolean = false;

	/**
	 * Container series' elements are placed in.
	 *
	 * @ignore Exclude from docs
	 * @type {Container}
	 */
	public mainContainer: Container;

	/**
	 * Should series' bullets?
	 *
	 * @default true
	 * @type {boolean}
	 */
	protected _showBullets: boolean = true;

	/**
	 * List of series' bullets.
	 *
	 * @type {ListTemplate<Bullet>}
	 */
	protected _bullets: ListTemplate<Bullet>;

	/**
	 * Container bullets are placed in.
	 *
	 * @ignore Exclude from docs
	 * @type {Container}
	 */
	public bulletsContainer: Container;

	/**
	 * A chart series belongs to.
	 *
	 * @type {SerialChart}
	 */
	public _chart: SerialChart;

	/**
	 * A container axis ranges are placed in.
	 *
	 * @ignore Exclude from docs
	 * @type {Container}
	 */
	public rangesContainer: Container;

	/**
	 * A list of axis ranges for this series.
	 *
	 * @type {List<AxisDataItem>}
	 */
	public axisRanges: List<AxisDataItem>;

	/**
	 * Settings for the appearance of the related legend items.
	 */
	public legendSettings: LegendSettings = new LegendSettings();

	/**
	 * Lowest overal values by type.
	 *
	 * @type {Dictionary}
	 */
	protected _tmin = new Dictionary<string, number>();

	/**
	 * Highest overal values by type.
	 *
	 * @type {Dictionary}
	 */
	protected _tmax = new Dictionary<string, number>();

	/**
	 * Lowest values in current selection by type.
	 *
	 * @type {Dictionary}
	 */
	protected _smin = new Dictionary<string, number>();

	/**
	 * Highest values in current selection by type.
	 *
	 * @type {Dictionary}
	 */
	protected _smax = new Dictionary<string, number>();

	/**
	 * [dataItemsByAxis description]
	 *
	 * Both by category and date.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @type {Dictionary}
	 */
	public dataItemsByAxis = new Dictionary<string, Dictionary<string, this["_dataItem"]>>();

	/**
	 * Normally series items are focusable using keyboard, so that people can
	 * select them with a TAB key. However, if there are a lot of data points on
	 * screen it might be long and useless to tab through all o fthem.
	 *
	 * This is where `skipFocusThreshold` comes in. If there are more items than
	 * the value set here, we will not make those focusable and rather let screen
	 * reader software rely on the series summary, or authors provide alternative
	 * detailed information display, such as HTML table.
	 *
	 * Different series might have different threshold defaults.
	 *
	 * @type {Number}
	 */
	public skipFocusThreshold: number = 20;

	/**
	 * Holds a default screen reader text for series data items. It will be used
	 * to generate information for screen readers. If not set, the series will
	 * try to deduce reader text from `tooltipText` or `tooltipHTML`. If those
	 * are not set either, a default reader text will be used which is relevant
	 * for each Series type.
	 *
	 * @type {string}
	 */
	protected _itemReaderText: string;


	/*
		public heatMapfillRule: (fill:Color, column: Sprite) => any = function(fill:Color, sprite: Sprite) {
			let dataItem: SeriesDataItem = <SeriesDataItem>sprite.dataItem;

			if (dataItem && dataItem.value) {
				let series = dataItem.component;
				if($type.hasValue(series.minColor) &&  $type.hasValue(series.maxColor) && $type.isNumber(series.minValue) && $type.isNumber(series.maxValue)){
					let percent = (dataItem.values.value.workingValue - series.minValue) / (series.maxValue - series.minValue);
					return new Color($colors.interpolate(series.minColor.rgb, series.maxColor.rgb, percent));
				}
			}
		};
	*/

	protected _heatRules: List<IHeatRule>;

	/**
	 * As calculating totals is expensive operation and not often needed, by default we do not do it. In case you use percent for your charts, you must set this to true.
	 * Pie chart, which uses percent sets this to true by default.
	 * @todo review description
	 * @type {boolean}
	 */
	public calculatePercent: boolean = false;

	/**
	 * Specifies if series should be automatically disposed when removing from chart's series list.
	 * @default true
	 */
	public autoDispose: boolean = true;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "Series";
		this.isMeasured = false;

		this.layout = "none";
		this.shouldClone = false;
		this.setPropertyValue("hidden", false);

		this.axisRanges = new List<AxisDataItem>();
		this.axisRanges.events.on("inserted", this.processAxisRange, this, false);

		this.minBulletDistance = 0; // otherwise we'll have a lot of cases when people won't see bullets and think it's a bug
		this.mainContainer = this.createChild(Container);
		this.mainContainer.shouldClone = false;
		this.mainContainer.mask = this.createChild(Sprite);

		this._disposers.push(this.mainContainer);

		// all bullets should go on top of lines/fills. So we add a separate container for bullets and later set it's parent to chart.bulletsContainer
		let bulletsContainer = this.mainContainer.createChild(Container);
		this._shouldBeReady.push(bulletsContainer);
		bulletsContainer.shouldClone = false;
		bulletsContainer.layout = "none";
		bulletsContainer.virtualParent = this;
		this._disposers.push(bulletsContainer);
		this.bulletsContainer = bulletsContainer;

		this.tooltip = new Tooltip();
		this.tooltip.virtualParent = this;
		this._disposers.push(this.tooltip);

		this.hiddenState.transitionEasing = $ease.cubicIn;

		// this data item holds sums, averages, etc
		this.dataItem = this.createDataItem();
		this._disposers.push(this.dataItem);
		this.dataItem.component = this;

		// Apply accessibility
		this.role = "group";

		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Series");
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return {SeriesDataItem} Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new SeriesDataItem();
	}

	/**
	 * Chart series is used on.
	 *
	 * @param {this["_chart"]}  value  Chart
	 */
	public set chart(value: this["_chart"]) {
		this._chart = value;
	}

	/**
	 * @return {this} Chart
	 */
	public get chart(): this["_chart"] {
		return this._chart;
	}

	/**
	 * Positions bullet.
	 *
	 * @param {Bullet}  bullet  Bullet
	 */
	public positionBullet(bullet: Bullet): void {

		// Placeholder method for extending classes to override.

	}

	/**
	 * Decorates newly created bullet after it has been instert into the list.
	 *
	 * @param {IListEvents<Bullet>["inserted"]}  event  List event
	 * @todo investigate why itemReaderText is undefined
	 */
	protected processBullet(event: IListEvents<Bullet>["inserted"]) {
		let bullet: Bullet = event.newValue;
		bullet.isTemplate = true;
		// Add accessibility options to bullet
		// If there are relatively few bullets, make them focusable
		if (this.itemsFocusable()) {
			bullet.focusable = true;
		}
	}

	/**
	 * removes bullets
	 *
	 * @param {IListEvents<Bullet>["inserted"]}  event  List event
	 */
	protected removeBullet(event: IListEvents<Bullet>["removed"]) {
		let bullet: Bullet = event.oldValue;

		this.dataItems.each((dataItem) => {
			let eachBullet = dataItem.bullets.getKey(bullet.uid);
			if (eachBullet) {
				eachBullet.dispose();
			}
		})

		this.invalidate();
	}

	/**
	 * Validates data items.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataItems() {
		super.validateDataItems();
		this.processValues(false);
	}

	/**
	 * Returns first value for the specific key in the series.
	 *
	 * @param  {string}  key  Key
	 * @return {number}       Value
	 * @todo Description
	 * @todo Convert to propert object property iterator
	 */
	protected getFirstValue(key: string, startIndex: number): number {
		// find first
		/*
		return $iter.findMap(this.dataItems.iterator(), (dataItem) => {
			for (let key in dataItem.values) {
				let value: number = dataItem.values[key].workingValue;
				if ($type.isNumber(value)) {
					return value;
				}
			}

			return null;
		});*/

		if (startIndex > 0 && startIndex < this.dataItems.length - 1) {
			startIndex++;
		}
		for (let i = startIndex; i >= 0; i--) {
			let dataItem = this.dataItems.getIndex(i);
			let value: number = dataItem.values[key].workingValue;
			if ($type.isNumber(value)) {
				return value;
			}
		}
		return null;
	}

	/**
	 * [rangeChangeUpdate description]
	 *
	 * @todo Description
	 */
	protected rangeChangeUpdate() {
		super.rangeChangeUpdate();
		this.processValues(true);
	}

	/**
	 * [processValues description]
	 *
	 * @todo Description
	 * @todo Convert to propert object property iterator
	 * @param {OrderedList<this["_dataItem"]>} dataItems [description]
	 */
	protected processValues(working: boolean) {
		let dataItems = this.dataItems;

		let count: { [index: string]: number } = {};
		let sum: { [index: string]: number } = {};
		let low: { [index: string]: number } = {};
		let high: { [index: string]: number } = {};
		let open: { [index: string]: number } = {};
		let close: { [index: string]: number } = {};
		let previous: { [index: string]: number } = {};
		let first: { [index: string]: number } = {};

		//let duration: number = 0; // todo: check if series uses selection.change or selection.change.percent and set duration to interpolationduration

		let startIndex: number = $math.max(0, this._workingStartIndex);
		startIndex = $math.min(startIndex, this.dataItems.length);

		let endIndex: number = $math.min(this._workingEndIndex, this.dataItems.length);

		if (!$type.isNumber(startIndex)) {
			startIndex = 0;
		}

		if (!$type.isNumber(endIndex)) {
			endIndex = this.dataItems.length;
		}

		if (startIndex > 0) {
			let dataItem = dataItems.getIndex(startIndex - 1);
			for (let key in dataItem.values) {
				let value: number = dataItem.values[key].workingValue;

				if ($type.isNumber(value)) {
					// save previous
					previous[key] = value;
				}
			}
		}

		for (let i = startIndex; i < endIndex; i++) {
			let dataItem = dataItems.getIndex(i);
			for (let key in dataItem.values) {

				let value: number = dataItem.values[key].workingValue;

				//if (i >= startIndex && i <= endIndex) { // do not add to count, sum etc if it is not within start/end index
				if ($type.isNumber(value)) {

					// count values
					if (!$type.isNumber(count[key])) {
						count[key] = 0;
					}
					count[key]++;

					// sum values
					if (!$type.isNumber(sum[key])) {
						sum[key] = 0;
					}
					sum[key] += value;

					// open
					if (!$type.isNumber(open[key])) {
						open[key] = value;
					}

					// close
					close[key] = value;

					// low
					if (!$type.isNumber(low[key])) {
						low[key] = value;
					}
					else {
						if (low[key] > value) {
							low[key] = value;
						}
					}

					// high
					if (!$type.isNumber(high[key])) {
						high[key] = value;
					}
					else {
						if (high[key] < value) {
							high[key] = value;
						}
					}

					if (!$type.isNumber(first[key])) {
						first[key] = this.getFirstValue(key, startIndex);
					}

					// change
					dataItem.setCalculatedValue(key, value - first[key], "change");
					// change from start percent
					// will fail if first value is 0
					dataItem.setCalculatedValue(key, (value - first[key]) / first[key] * 100, "changePercent");

					// previous change
					let prevValue: number = previous[key];
					if (!$type.isNumber(prevValue)) {
						prevValue = value;
					}

					dataItem.setCalculatedValue(key, value - prevValue, "previousChange");
					// previous change percent
					dataItem.setCalculatedValue(key, (value - prevValue) / prevValue * 100, "previousChangePercent");

					// save previous
					previous[key] = value;
				}
			}
		}

		if (this.calculatePercent) {
			for (let i = startIndex; i < endIndex; i++) {
				let dataItem = dataItems.getIndex(i);

				$object.each(dataItem.values, (key) => {
					let ksum: number = sum[key];

					let value: number = dataItem.values[key].workingValue;

					if ($type.isNumber(value) && ksum > 0) {

						// this hack is made in order to make it possible to animate single slice to 0
						// if there is only one slice left, percent value is always 100%, so it won't animate
						// so we use real value of a slice instead of current value
						if (value == ksum) {
							ksum = dataItem.values[key].value;
						}

						let percent = value / ksum * 100;
						dataItem.setCalculatedValue(key, percent, "percent");
					}
				});
			}
		}


		// calculate one before first (cant do that in cycle, as we don't know open yet
		// when drawing line chart we should draw line to the invisible data point to the left, otherwise the line will always look like it starts from the selected point
		// so we do startIndex - 1
		if (startIndex > 0) {
			let zeroItem: this["_dataItem"] = dataItems.getIndex(startIndex - 1);

			$object.each(zeroItem.values, (key) => {
				//for (let key in zeroItem.values) {
				let value = zeroItem.values[key].value;
				// change
				zeroItem.setCalculatedValue(key, value - open[key], "change");
				// change percent
				zeroItem.setCalculatedValue(key, (value - open[key]) / open[key] * 100, "changePercent");
				//}
			});
		}

		// we save various data like sum, average to dataPoint of the series
		let dataItem: DataItem = this.dataItem;
		$object.each(dataItem.values, (key) => {
			dataItem.setCalculatedValue(key, sum[key], "sum");
			dataItem.setCalculatedValue(key, sum[key] / count[key], "average");
			dataItem.setCalculatedValue(key, open[key], "open");
			dataItem.setCalculatedValue(key, close[key], "close");
			dataItem.setCalculatedValue(key, low[key], "low");
			dataItem.setCalculatedValue(key, high[key], "high");
			dataItem.setCalculatedValue(key, count[key], "count");
		});
	}

	/**
	 * (Re)validates the whole series, effectively causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		$iter.each(this.axisRanges.iterator(), (axisRange) => {
			//axisRange.contents.disposeChildren(); // not good for columns, as they are reused
			//			axisRange.appendChildren();
			axisRange.validate();
		});

		super.validate();
		this.bulletsContainer.fill = this.fill;
		this.bulletsContainer.stroke = this.stroke;

		$iter.each(this.dataItems.iterator(), (dataItem) => {
			if (dataItem.index < this.startIndex || dataItem.index >= this.endIndex) {
				dataItem.bullets.each((key, bullet) => {
					bullet.__disabled = true;
				})
			}
		});

		this.updateTooltipBounds();
	}

	/**
	 * @ignore
	 */
	public updateTooltipBounds() {
		if (this.topParent) {
			this.tooltip.setBounds({ x: 0, y: 0, width: this.topParent.maxWidth, height: this.topParent.maxHeight });
		}
	}

	/**
	 * Validates data item's element, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 * @param {SeriesDataItem}  dataItem  Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {
		super.validateDataElement(dataItem);

		if (this._showBullets) {
			this.bulletsContainer.visible = true;
			$iter.each(this.bullets.iterator(), (bulletTemplate) => {
				// always better to use the same, this helps to avoid redrawing
				let bullet: Bullet = <Bullet>dataItem.bullets.getKey(bulletTemplate.uid);

				if (!bullet) {
					bullet = bulletTemplate.clone();
				}

				let currentDataItem: this["_dataItem"] = <this["_dataItem"]>bullet.dataItem;
				if (currentDataItem != dataItem) {
					// set to undefined in order not to reuse
					if (currentDataItem) {
						currentDataItem.bullets.setKey(bulletTemplate.uid, undefined);
					}

					dataItem.addSprite(bullet);

					// Add accessibility to bullet
					let readerText = this.itemReaderText || ("{" + bullet.xField + "}: {" + bullet.yField + "}");
					if (bullet.focusable) {
						bullet.events.once("focus", (ev) => {
							bullet.readerTitle = this.populateString(readerText, bullet.dataItem);
						}, undefined, false);
						bullet.events.once("blur", (ev) => {
							bullet.readerTitle = "";
						}, undefined, false);
					}
					if (bullet.hoverable) {
						bullet.events.once("over", (ev) => {
							bullet.readerTitle = this.populateString(readerText, bullet.dataItem);
						}, undefined, false);
						bullet.events.once("out", (ev) => {
							bullet.readerTitle = "";
						}, undefined, false);
					}

					if (bullet.isDynamic) {
						dataItem.events.on("workingvaluechanged", bullet.deepInvalidate, bullet, false);
						//dataItem.events.on("calculatedvaluechanged", bullet.deepInvalidate, bullet, false);
						this.dataItem.events.on("workingvaluechanged", bullet.deepInvalidate, bullet, false);
					}
					bullet.deepInvalidate();
				}

				bullet.parent = this.bulletsContainer;
				bullet.visible = true;
				dataItem.bullets.setKey(bulletTemplate.uid, bullet);

				// pass max w/h so we'd know if we should show/hide somethings
				bullet.maxWidth = dataItem.itemWidth;
				bullet.maxHeight = dataItem.itemHeight;
				bullet.__disabled = false;

				this.positionBullet(bullet);
			});
		}
		else {
			this.bulletsContainer.visible = false;
		}
	}

	/**
	 * [handleDataItemWorkingValueChange description]
	 *
	 * @ignore Exclude from docs
	 */
	public handleDataItemWorkingValueChange(dataItem?: this["_dataItem"], name?:string): void {
		if (!this.dataRangeInvalid) {
			this.invalidateProcessedData();
		}
	}

	/**
	 * Should this series excluded from the axis scale calculations?
	 *
	 * @default false
	 * @param {boolean}  value  Exclude from calculations?
	 */
	public set ignoreMinMax(value: boolean) {
		this._ignoreMinMax = value;
		this.invalidateDataItems();
	}

	/**
	 * @return {boolean} Exclude from calculations?
	 */
	public get ignoreMinMax(): boolean {
		return this._ignoreMinMax;
	}

	/**
	 * Create a mask for the series.
	 *
	 * @ignore Exclude from docs
	 */
	public createMask(): void {

		// A placeholder method for extending classes to override.

	}

	/**
	 * Process axis range after it has been added to the list.
	 *
	 * @param {IListEvents<AxisDataItem>["inserted"]}  event  Event
	 */
	protected processAxisRange(event: IListEvents<AxisDataItem>["inserted"]): void {
		// create container if not existing
		if (!this.rangesContainer) {
			this.rangesContainer = this.createChild(Container);
			this.rangesContainer.shouldClone = false;
			this.rangesContainer.isMeasured = false;
		}

		let axisRange: AxisDataItem = event.newValue;
		if (axisRange) {
			axisRange.contents.parent = this.rangesContainer;
			axisRange.isRange = true;
		}
	}

	/**
	 * [getAxisField description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param  {Axis}    axis  [description]
	 * @return {string}        [description]
	 */
	public getAxisField(axis: Axis): string {
		return;
	}

	/**
	 * Shows the tooltip at specific position.
	 *
	 * @ignore Exclude from docs
	 * @param {number}  xPosition  X
	 * @param {number}  yPosition  Y
	 */
	public showTooltipAtPosition(xPosition: number, yPosition: number): void {

		// Placeholder method for extending classes to override.

	}

	/**
	 * Minimal distance between two adjacent bullets in pixels.
	 *
	 * If bullet is closer, it will be skipped and not shown.
	 *
	 * This allows to avoid crammed up graphs wil a lot of bullets.
	 *
	 * @default 0
	 * @param {number}  value  Distance (px)
	 */
	public set minBulletDistance(value: number) {
		this.setPropertyValue("minBulletDistance", value, true);
	}

	/**
	 * @return {number} Distance (px)
	 */
	public get minBulletDistance(): number {
		return this.getPropertyValue("minBulletDistance");
	}

	/**
	 * A list of bullets that will be added to each and every items in the
	 * series.
	 *
	 * You can push any object that is a descendant of a [[Bullet]] here. All
	 * items added to this list will be copied and used as a bullet on all data
	 * items, including their properties, events, etc.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/bullets/} for more info about the concept of Bullets
	 * @return {ListTemplate<Bullet>} List of bullets.
	 */
	public get bullets(): ListTemplate<Bullet> {
		if (!this._bullets) {
			this._bullets = new ListTemplate<Bullet>(new Bullet());
			this._bullets.template.virtualParent = this;
			this._bullets.events.on("inserted", this.processBullet, this, false);
			this._bullets.events.on("removed", this.removeBullet, this, false);

			this._disposers.push(new ListDisposer(this._bullets));
			this._disposers.push(this._bullets.template);
		}
		return this._bullets;
	}

	/**
	 * Binds related legend data item's visual settings to this series' visual
	 * settings.
	 *
	 * @ignore Exclude from docs
	 * @param {Container}  marker  Legend item container
	 */
	public createLegendMarker(marker: Container): void {

		// This is a placeholder method for extending classes to override.

	}

	/**
	 * Should the series be hidden in legend?
	 *
	 * @param {boolean} value Hidden in legend?
	 */
	public set hiddenInLegend(value: boolean) {
		if(this.setPropertyValue("hiddenInLegend", value)){
			if(this.chart){
				this.chart.feedLegend();
			}
		}
	}

	/**
	 * @return {boolean} Hidden in legend?
	 */
	public get hiddenInLegend(): boolean {
		return this.getPropertyValue("hiddenInLegend");
	}

	/**
	 * Series' name.
	 *
	 * @param {string}  value  Name
	 */
	public set name(value: string) {
		this._title = value;
		this.readerTitle = value;
	}

	/**
	 * @return {string} Name
	 */
	public get name(): string {
		return this.adapter.apply("name", this._title);
	}

	/**
	 * Screen reader text to be applied to each individual data item, such
	 * as bullets, columns or slices.
	 *
	 * The template can contain field reference meta codes, i.e. `{dateX}`,
	 * `{valueY}`, etc.
	 *
	 * Any text formatting options, e.g. `[bold]` will be ignored.
	 *
	 * @param {string} value Screen reader text template
	 */
	public set itemReaderText(value: string) {
		this._itemReaderText = value;
	}

	/**
	 * @return {string} Screen reader text template
	 */
	public get itemReaderText(): string {

		// Get explicitly set reader text
		let readerText = this._itemReaderText;

		// Not set? Let's try something else
		if (!readerText) {

			// Tooltip text?
			if (this.tooltipText) {
				readerText = $utils.plainText(this.tooltipText);
			}
			else if (this.tooltipHTML) {
				readerText = $utils.plainText(this.tooltipHTML);
			}

		}

		return this.adapter.apply("itemReaderText", readerText);

	}

	/**
	 * Returns if number of data items in the series are beyond non-focusable
	 * count and should not be available for TAB-through.
	 *
	 * @ignore Exclude from docs
	 * @return {boolean} Items focusable?
	 */
	public itemsFocusable(): boolean {
		return this.dataItems.length >= this.skipFocusThreshold ? false : true;
	}

	/**
	 * Legend data item that corresponds to this series.
	 *
	 * @param {LegendDataItem<Series, ISeriesEvents>}  value  Data item
	 */
	public set legendDataItem(value: LegendDataItem) {
		this._legendDataItem = value;
		this._legendDataItem.itemContainer.deepInvalidate();
	}

	/**
	 * @return {LegendDataItem<Series, ISeriesEvents>} Data item
	 */
	public get legendDataItem(): LegendDataItem {
		return this._legendDataItem;
	}

	/**
	 * Updates corresponding legend data item with current values.
	 *
	 * @ignore Exclude from docs
	 * @param {this["_dataItem"]}  dataItem  Data item
	 */
	public updateLegendValue(dataItem?: this["_dataItem"]) {
		// if this series has legend item
		if (this.legendDataItem) {

			let legendSettings: LegendSettings = this.legendSettings;
			let legendDataItem = this.legendDataItem;
			let label: Label = legendDataItem.label;
			let valueLabel: Label = legendDataItem.valueLabel;

			// update legend
			if (dataItem) {				
				if (valueLabel) {
					if (legendSettings.itemValueText) {
						valueLabel.text = legendSettings.itemValueText;
					}					
					valueLabel.dataItem = dataItem;
				}
				if (label) {
					if (legendSettings.itemLabelText) {
						label.text = legendSettings.itemLabelText;
					}
					label.dataItem = this.dataItem;
				}
			}
			else {
				if (label) {
					// if itemLabelText is set, means we have to reset label even if labelText is not set
					if (legendSettings.labelText || legendSettings.itemLabelText != undefined) {
						label.text = legendSettings.labelText;
					}
					label.dataItem = this.dataItem;
				}
				if (valueLabel) {
					if (legendSettings.valueText || legendSettings.itemValueText != undefined) {
						valueLabel.text = legendSettings.valueText;
					}
					valueLabel.dataItem = this.dataItem;
				}
			}
		}
	}

	/**
	 * Copies all properties from another instance of [[Series]].
	 *
	 * @param {Series}  source  Source series
	 */
	public copyFrom(source: this) {
		this.bullets.copyFrom(source.bullets);
		this.bulletsContainer.copyFrom(source.bulletsContainer);
		this.calculatePercent = source.calculatePercent;
		super.copyFrom(source);
	}

	/**
	 * Displays a modal or console message with error, and halts any further
	 * processing of this element.
	 *
	 * @param {Error} e Error
	 */
	public raiseCriticalError(e: Error) {
		this._chart.modal.content = e.message;
		this._chart.modal.closable = false;
		this._chart.modal.open();
		this._chart.disabled = true;

		if (options.verbose) {
			console.log(e);
		}
	}


	/**
	 * Applies filters to the element.
	 *
	 * @ignore Exclude from docs
	 */
	protected applyFilters() {
		super.applyFilters();
		this.bulletsContainer.filters.clear();

		// copyFrom of a list copies, does not clone
		$iter.each(this.filters.iterator(), (filter) => {
			this.bulletsContainer.filters.push(filter.clone());
		});
	}

	/**
	 * @todo Description
	 */
	public get heatRules(): List<IHeatRule> {
		if (!this._heatRules) {
			this._heatRules = new List<IHeatRule>();
			this._heatRules.events.on("inserted", (event) => {
				let heatRule = event.newValue;
				let target = heatRule.target;

				if (target) {
					let dataField = heatRule.dataField;

					if (!$type.hasValue(dataField)) {
						dataField = "value";
					}

					let min = heatRule.min;
					let max = heatRule.max;

					let seriesDataItem = this.dataItem;
					let property = heatRule.property;

					let minValue = $type.toNumber(heatRule.minValue);
					let maxValue = $type.toNumber(heatRule.maxValue);

					if (!$type.isNumber(minValue) && !$type.isNumber(maxValue)) {
						this.dataItem.events.on("calculatedvaluechanged", (event) => {
							if (event.property == dataField) {
								$iter.each(this.dataItems.iterator(), (dataItem) => {
									let foundSprite = false;
									$array.each(dataItem.sprites, (sprite) => {
										if (sprite.clonedFrom == target) {
											let anySprite = <any>sprite;
											anySprite[property] = anySprite[property];
											foundSprite = true;
										}
									});

									if (!foundSprite) {
										$array.each(dataItem.sprites, (sprite) => {
											if (sprite instanceof Container) {
												$iter.each(sprite.children.iterator(), (child) => {
													if (child.className == target.className) {
														let anyChild = <any>child;
														anyChild[property] = anyChild[property];
													}
													// giveup here
													else if (child instanceof Container) {
														child.deepInvalidate();
													}
												})
											}
										});
									}

								})
							}
						});
					}

					this.dataItems.template.events.on("workingvaluechanged", (event) => {
						if (event.property == dataField) {
							let dataItem = event.target;
							let foundSprite = false;
							$array.each(dataItem.sprites, (sprite) => {
								if (sprite.clonedFrom == target) {
									let anySprite = <any>sprite;
									anySprite[property] = anySprite[property];
									foundSprite = true;
								}
							});

							if (!foundSprite) {
								$array.each(dataItem.sprites, (sprite) => {
									if (sprite instanceof Container) {
										$iter.each(sprite.children.iterator(), (child) => {
											if (child.className == target.className) {
												let anyChild = <any>child;
												anyChild[property] = anyChild[property];
											}
											// givup here
											else if (child instanceof Container) {
												child.deepInvalidate();
											}
										})
									}
								});
							}
						}
					})


					target.adapter.add(<any>property, (value, ruleTarget, property) => {
						let minValue = $type.toNumber(heatRule.minValue);
						let maxValue = $type.toNumber(heatRule.maxValue);

						if (ruleTarget instanceof Sprite) {
							let anySprite = <any>ruleTarget;
							let propertyField = anySprite.propertyFields[property];
							if (propertyField && ruleTarget.dataItem) {
								let dataContext = <any>ruleTarget.dataItem.dataContext;
								if (dataContext && $type.hasValue(dataContext[propertyField])) {
									return value;
								}
							}
						}

						let dataItem: SeriesDataItem = <SeriesDataItem>ruleTarget.dataItem;

						if (!$type.isNumber(minValue)) {
							minValue = seriesDataItem.values[dataField].low;
						}

						if (!$type.isNumber(maxValue)) {
							maxValue = seriesDataItem.values[dataField].high;
						}

						if (dataItem) {
							let fieldValues = dataItem.values[dataField];
							if (fieldValues) {
								let workingValue = fieldValues.workingValue;
								if ($type.hasValue(min) && $type.hasValue(max) && $type.isNumber(minValue) && $type.isNumber(maxValue) && $type.isNumber(workingValue)) {

									let percent = (workingValue - minValue) / (maxValue - minValue);

									if($type.isNumber(workingValue) && !$type.isNumber(percent)){
										percent = 0.5;
									}
									// fixes problems if all values are the same
									if ($type.isNumber(min)) {
										return min + (max - min) * percent;
									}
									else if (min instanceof Color) {
										return new Color($colors.interpolate(min.rgb, max.rgb, percent));
									}
								}
							}
						}
						return value;
					})
				}
			});
		}
		return this._heatRules;
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param {object}  config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		let heatRules;

		if (config) {

			// Set up bullets
			if ($type.hasValue(config.bullets) && $type.isArray(config.bullets)) {
				for (let i = 0, len = config.bullets.length; i < len; i++) {
					let bullets = config.bullets[i];
					if (!$type.hasValue(bullets.type)) {
						bullets.type = "Bullet";
					}
				}
			}

			// Let's take heatRules out of the config, so that we can process
			// them later, when bullets are already there
			if ($type.hasValue(config.heatRules) && $type.isArray(config.heatRules)) {
				heatRules = config.heatRules;
				delete config.heatRules;
			}

		}

		super.processConfig(config);

		// Process heat rules again, when all other elements are ready
		if (heatRules) {
			for (let i = 0, len = heatRules.length; i < len; i++) {
				let rule = heatRules[i];

				// Resolve target
				let target: any = this;
				if ($type.hasValue(rule.target) && $type.isString(rule.target)) {


					// Check if we can find this element by id
					if (this.map.hasKey(rule.target)) {
						target = this.map.getKey(rule.target);
					}
					else {
						let parts = rule.target.split(".");
						for (let x = 0; x < parts.length; x++) {
							if (target instanceof List) {
								let listitem = target.getIndex($type.toNumber(parts[x]));
								if (!listitem) {
									target = (<any>target)[parts[x]];
								}
								else {
									target = listitem;
								}
							}
							else {
								target = target[parts[x]];
							}
						}
					}
				}
				rule.target = target;

				// Resolve colors and percents
				if ($type.hasValue(rule.min)) {
					rule.min = this.maybeColorOrPercent(rule.min);
				}
				if ($type.hasValue(rule.max)) {
					rule.max = this.maybeColorOrPercent(rule.max);
				}
			}

			super.processConfig({
				heatRules: heatRules
			});
		}

	}

	/**
	 * Returns visibility value
	 * @ignore
	 */
/*
	protected getVisibility(): boolean {
		let hidden = this.getPropertyValue("hidden");
		if (hidden) {
			return false;
		}
		else {
			return super.getVisibility();
		}
	}*/

	/**
	 * This function is used to sort element's JSON config properties, so that
	 * some properties that absolutely need to be processed last, can be put at
	 * the end.
	 *
	 * @ignore Exclude from docs
	 * @param  {string}  a  Element 1
	 * @param  {string}  b  Element 2
	 * @return {Ordering}   Sorting number
	 */
	protected configOrder(a: string, b: string): Ordering {
		if (a == b) {
			return 0;
		}
		// Must come last
		else if (a == "heatRules") {
			return 1;
		}
		else if (b == "heatRules") {
			return -1;
		}
		else {
			return super.configOrder(a, b);
		}
	}
}

/**
 * Register class, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Series"] = Series;
registry.registeredClasses["SeriesDataItem"] = SeriesDataItem;
