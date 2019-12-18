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
import { Sprite } from "../../core/Sprite";
import { List, ListTemplate, IListEvents, ListDisposer } from "../../core/utils/List";
import { Dictionary, DictionaryDisposer } from "../../core/utils/Dictionary";
import { DataItem } from "../../core/DataItem";
import { Container } from "../../core/Container";
import { SerialChart } from "../types/SerialChart";
import { Label } from "../../core/elements/Label";
import { Axis } from "../axes/Axis";
import { Tooltip } from "../../core/elements/Tooltip";
import { Bullet } from "../elements/Bullet";
import { LegendDataItem, LegendSettings } from "../Legend";
import { options } from "../../core/Options";
import { Ordering } from "../../core/utils/Order";
import { Color } from "../../core/utils/Color";
import { registry } from "../../core/Registry";
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
	 */
	public itemHeight: number;

	/**
	 * A dictionary of data items bullets, where key is uid of a bullet template.
	 *
	 * @ignore Exclude from docs
	 */
	protected _bullets: Dictionary<string, Sprite>;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: Series;

	/**
	 * A dictionary of data items bullets, where key is uid of a bullet template.
	 */
	public get bullets(): Dictionary<string, Sprite> {
		if (!this._bullets) {
			this._bullets = new Dictionary<string, Sprite>();
			this._disposers.push(new DictionaryDisposer(this._bullets));
		}
		return this._bullets;
	}


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SeriesDataItem";
		//@todo Should we make `bullets` list disposable?
		//this._disposers.push(new DictionaryDisposer(this.bullets));

		this.values.value = {};
		this.values.value = {};

		this.applyTheme();
	}

	/**
	 * Destroys this object and all related data.
	 */
	public dispose() {
		this.bullets.clear();
		super.dispose();
	}

	/**
	 * data items's numeric value.
	 *
	 * @param value  Value
	 */
	public set value(value: number) {
		this.setValue("value", value);
	}

	/**
	 * @return Value
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
	 */
	value?: string;

	/**
	 * Name of the field in data that holds boolean flag if item should be hidden.
	 */
	hidden?: string;
}

/**
 * Defines properties for [[Series]].
 */
export interface ISeriesProperties extends IComponentProperties {

	/**
	 * Minimal distance between data points in pixels.
	 *
	 * If distance gets smaller than this, bullets are turned off to avoid
	 * overlapping.
	 *
	 * `0` (zero) disables this behavior.
	 *
	 * @default 0
	 */
	minBulletDistance?: number;

	/**
	 * Should series be hidden in chart's legend?
	 */
	hiddenInLegend?: boolean;

	/**
	 * Series' name.
	 */
	name?: string;
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
	 * Applied to the name used by screen readers.
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
	 */
	public _dataFields: ISeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ISeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISeriesEvents;

	/**
	 * Defines a type of data item used for the series.
	 */
	public _dataItem: SeriesDataItem;

	/**
	 * A reference to the legend data item related to this series.
	 */
	protected _legendDataItem: LegendDataItem;

	/**
	 * Should this series excluded from the axis scale calculations?
	 *
	 * @default false
	 */
	protected _ignoreMinMax: boolean = false;

	/**
	 * Container series' elements are placed in.
	 *
	 * @ignore Exclude from docs
	 */
	public mainContainer: Container;

	/**
	 * Should series' bullets?
	 *
	 * @default true
	 */
	protected _showBullets: boolean = true;

	/**
	 * List of series' bullets.
	 */
	protected _bullets: ListTemplate<Sprite>;

	/**
	 * Container bullets are placed in.
	 *
	 * @ignore Exclude from docs
	 */
	public bulletsContainer: Container;

	/**
	 * A chart series belongs to.
	 */
	public _chart: SerialChart;

	/**
	 * A container axis ranges are placed in.
	 *
	 * @ignore Exclude from docs
	 */
	public rangesContainer: Container;

	/**
	 * A list of axis ranges for this series.
	 */
	public axisRanges: List<AxisDataItem>;

	/**
	 * Settings for the appearance of the related legend items.
	 */
	public legendSettings: LegendSettings = new LegendSettings();

	/**
	 * Lowest overal values by type.
	 */
	protected _tmin = new Dictionary<string, number>();

	/**
	 * Highest overal values by type.
	 */
	protected _tmax = new Dictionary<string, number>();

	/**
	 * Lowest values in current selection by type.
	 */
	protected _smin = new Dictionary<string, number>();

	/**
	 * Highest values in current selection by type.
	 */
	protected _smax = new Dictionary<string, number>();

	/**
	 * [dataItemsByAxis description]
	 *
	 * Both by category and date.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
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
	 */
	public skipFocusThreshold: number = 20;

	/**
	 * Holds a default screen reader text for series data items. It will be used
	 * to generate information for screen readers. If not set, the series will
	 * try to deduce reader text from `tooltipText` or `tooltipHTML`. If those
	 * are not set either, a default reader text will be used which is relevant
	 * for each Series type.
	 */
	protected _itemReaderText: string;


	/**
	 * Used to indicate if `itemReaderText` was changed "from the outside".
	 */
	protected _itemReaderTextChanged: boolean = false;

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
	 * Most of the series use absolute values. However sometimes various
	 * calculated percent values are need, e.g. item's percent representation
	 * across all values in series, etc.
	 *
	 * It's a resource-intensive operation, so it is disabled by default.
	 *
	 * If you need percents to be calculated, e.g. for showing them in tooltips,
	 * or creating 100% stacks, this setting needs to be set to `true`.
	 * 
	 * NOTE: `PieChart`, which relies on slice percentages, has this
	 * automatically set to `true`.
	 *
	 * @default false
	 */
	public calculatePercent: boolean = false;

	/**
	 * Specifies if series should be automatically disposed when removing from
	 * chart's `series` list.
	 * 
	 * @default true
	 */
	public autoDispose: boolean = true;

	/**
	 * When chart/series' data is processed, all kinds of derivative values are
	 * calculated. E.g. sum, min, max, change, etc. This is a potentially
	 * time-consuming operation, especially prominent in data-heavy charts.
	 *
	 * If your chart does not need those values, and you have a lot of data,
	 * setting this to `true` might give a dramatic increase in initial chart
	 * load speed.
	 *
	 * Please note, regular column and line series usage scenarios do not
	 * require derivative values. Those come into play only when you do advanced
	 * functionality like coloring segments of charts in different colors
	 * depending on change between open and close values, have stacked series, or
	 * display any of the derived values, like percent, in tooltips or bullets.
	 *
	 * @default false
	 */
	public simplifiedProcessing: boolean = false;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		if (this.constructor === Series) {
			throw new Error("'Series' cannot be instantiated directly. Please use a specific series type.");
		}

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
	 * We need this here so that class names can be applied to bullets container.
	 *
	 * @ignore Exclude from docs
	 */
	public applyTheme(): void {
		super.applyTheme();
		if (options.autoSetClassName && this.bulletsContainer) {
			this.bulletsContainer.className = this.className + "-bullets";
			this.bulletsContainer.setClassName();
		}
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
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new SeriesDataItem();
	}

	/**
	 * Chart series is used on.
	 *
	 * @param value  Chart
	 */
	public set chart(value: this["_chart"]) {
		this._chart = value;
	}

	/**
	 * @return Chart
	 */
	public get chart(): this["_chart"] {
		return this._chart;
	}

	/**
	 * Positions bullet.
	 *
	 * @param bullet  Sprite
	 */
	public positionBullet(bullet: Sprite): void {

		// Placeholder method for extending classes to override.

	}

	/**
	 * Decorates newly created bullet after it has been instert into the list.
	 *
	 * @param event  List event
	 * @todo investigate why itemReaderText is undefined
	 */
	protected processBullet(event: IListEvents<Sprite>["inserted"]) {
		let bullet: Sprite = event.newValue;
		bullet.isTemplate = true;
		// Add accessibility options to bullet
		// If there are relatively few bullets, make them focusable
		this.events.once("datavalidated", (ev) => {
			if (this.itemsFocusable()) {
				bullet.focusable = true;
			}
		});
	}

	/**
	 * removes bullets
	 *
	 * @param event  List event
	 */
	protected removeBullet(event: IListEvents<Sprite>["removed"]) {
		let bullet: Sprite = event.oldValue;

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
	 * @param key  Key
	 * @return Value
	 * @todo Description
	 * @todo Convert to propert object property iterator
	 */
	protected getFirstValue(key: string, startIndex: number): number {
		// find first
		/*
		return $iter.findMap(this.dataItems.iterator(), (dataItem) => {
			for (let key in dataItem.values) {
				if ($object.hasKey(dataItem.values, key)) {
					let value: number = dataItem.values[key].workingValue;
					if ($type.isNumber(value)) {
						return value;
					}
				}
			}

			return null;
		});*/

		if (startIndex > 0 && startIndex < this.dataItems.length - 1) {
			startIndex++;
		}
		for (let i = startIndex; i >= 0; i--) {
			let dataItem = this.dataItems.getIndex(i);
			let value: number = dataItem.getActualWorkingValue(key);
			if ($type.isNumber(value)) {
				return value;
			}
		}
		return null;
	}

	/**
	 * Returns first value for the specific key in the series.
	 *
	 * @param key  Key
	 * @return Value
	 * @todo Description
	 * @todo Convert to propert object property iterator
	 */
	protected getAbsoluteFirstValue(key: string): number {
		for (let i = 0; i < this.dataItems.length; i++) {
			let dataItem = this.dataItems.getIndex(i);
			let value: number = dataItem.values[key].value;
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
	 * @param dataItems [description]
	 */
	protected processValues(working: boolean) {
		if (!this.simplifiedProcessing) {
			let dataItems = this.dataItems;

			let count: { [index: string]: number } = {};
			let sum: { [index: string]: number } = {};
			let absoluteSum: { [index: string]: number } = {};
			let low: { [index: string]: number } = {};
			let high: { [index: string]: number } = {};
			let open: { [index: string]: number } = {};
			let close: { [index: string]: number } = {};
			let previous: { [index: string]: number } = {};
			let first: { [index: string]: number } = {};
			let absoluteFirst: { [index: string]: number } = {};

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

				$object.each(dataItem.values, (key, values) => {
					let value: number = dataItem.getActualWorkingValue(key);

					if ($type.isNumber(value)) {
						// save previous
						previous[key] = value;
					}
				});
			}

			for (let i = startIndex; i < endIndex; i++) {
				let dataItem = dataItems.getIndex(i);

				$object.each(dataItem.values, (key, values) => {
					let value: number = dataItem.getActualWorkingValue(key);

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

						// absolute sum values
						if (!$type.isNumber(absoluteSum[key])) {
							absoluteSum[key] = 0;
						}
						absoluteSum[key] += Math.abs(value);

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

						if (!$type.isNumber(absoluteFirst[key])) {
							absoluteFirst[key] = this.getAbsoluteFirstValue(key);
						}

						// change
						dataItem.setCalculatedValue(key, value - first[key], "change");
						// change from start percent
						// will fail if first value is 0
						dataItem.setCalculatedValue(key, (value - first[key]) / first[key] * 100, "changePercent");

						dataItem.setCalculatedValue(key, (value - absoluteFirst[key]), "startChange");

						dataItem.setCalculatedValue(key, (value - absoluteFirst[key]) / absoluteFirst[key] * 100, "startChangePercent");

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
				});
			}

			if (this.calculatePercent) {
				for (let i = startIndex; i < endIndex; i++) {
					let dataItem = dataItems.getIndex(i);

					$object.each(dataItem.values, (key) => {
						let ksum: number = absoluteSum[key];

						let value: number = dataItem.getActualWorkingValue(key);

						if ($type.isNumber(value)) {
							if (ksum > 0) {
								// this hack is made in order to make it possible to animate single slice to 0
								// if there is only one slice left, percent value is always 100%, so it won't animate
								// so we use real value of a slice instead of current value
								if (value == ksum) {
									ksum = dataItem.values[key].value;
								}

								let percent = value / ksum * 100;

								dataItem.setCalculatedValue(key, percent, "percent");
							}
							else {
								dataItem.setCalculatedValue(key, 0, "percent");
							}
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
					let value = zeroItem.values[key].value;
					// change
					zeroItem.setCalculatedValue(key, value - open[key], "change");
					// change percent
					zeroItem.setCalculatedValue(key, (value - open[key]) / open[key] * 100, "changePercent");
				});
			}

			// we save various data like sum, average to dataPoint of the series
			let dataItem: DataItem = this.dataItem;
			$object.each(dataItem.values, (key) => {
				dataItem.setCalculatedValue(key, sum[key], "sum");
				dataItem.setCalculatedValue(key, absoluteSum[key], "absoluteSum");
				dataItem.setCalculatedValue(key, sum[key] / count[key], "average");
				dataItem.setCalculatedValue(key, open[key], "open");
				dataItem.setCalculatedValue(key, close[key], "close");
				dataItem.setCalculatedValue(key, low[key], "low");
				dataItem.setCalculatedValue(key, high[key], "high");
				dataItem.setCalculatedValue(key, count[key], "count");
			});
		}
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
		let bulletsContainer = this.bulletsContainer;
		bulletsContainer.fill = this.fill;
		bulletsContainer.stroke = this.stroke;
		bulletsContainer.x = this.pixelX;
		bulletsContainer.y = this.pixelY;

		if (this.bulletsContainer.children.length > 0) {
			if (this._showBullets) {


				for (let i = 0; i < this.startIndex; i++) {
					let dataItem = this.dataItems.getIndex(i);
					if (dataItem) {
						dataItem.bullets.each((key, bullet) => {
							bullet.__disabled = true;
						})
					}
				}

				for (let i = this.dataItems.length - 1; i > this.endIndex; i--) {
					let dataItem = this.dataItems.getIndex(i);
					if (dataItem) {
						dataItem.bullets.each((key, bullet) => {
							bullet.__disabled = true;
						})
					}
				}

			}
			else {
				this.bulletsContainer.children.each((bullet) => {
					bullet.__disabled = true;
				})
			}
		}

		this.updateTooltipBounds();
	}

	/**
	 * @ignore
	 */
	public updateTooltipBounds() {
		if (this.topParent) {
			let x = 0;
			let y = 0;
			let w = this.topParent.maxWidth;
			let h = this.topParent.maxHeight;
			let rect = { x: x, y: y, width: w, height: h };

			this.tooltip.setBounds(rect);
		}
	}


	protected shouldCreateBullet(dataItem: this["_dataItem"], bulletTemplate: Sprite): boolean {
		return true;
	}


	/**
	 * Validates data item's element, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {
		super.validateDataElement(dataItem);

		if (this._showBullets) {
			if (!this.isHidden) {
				this.bulletsContainer.visible = true;
			}
			this.bullets.each((bulletTemplate) => {
				// always better to use the same, this helps to avoid redrawing
				let bullet: Sprite = <Sprite>dataItem.bullets.getKey(bulletTemplate.uid);

				if (this.shouldCreateBullet(dataItem, bulletTemplate)) {
					if (!bullet) {

						let disabledField = bulletTemplate.propertyFields.disabled;
						let dataContext = <any>dataItem.dataContext;
						if (disabledField && dataContext && dataContext[disabledField] === false) {
							bulletTemplate.applyOnClones = false;
							bulletTemplate.disabled = false;
							bullet = bulletTemplate.clone();
							bulletTemplate.disabled = true;
							bulletTemplate.applyOnClones = true;
						}
						else {
							bullet = bulletTemplate.clone();
						}

						bullet.shouldClone = false;
						dataItem.addSprite(bullet);

						if (!this.visible || this.isHiding) {
							bullet.hide(0);
						}
					}

					let currentDataItem: this["_dataItem"] = <this["_dataItem"]>bullet.dataItem;
					if (currentDataItem != dataItem) {
						// set to undefined in order not to reuse
						if (currentDataItem) {
							currentDataItem.bullets.setKey(bulletTemplate.uid, undefined);
						}

						let readerText = this.itemReaderText;

						if (bullet instanceof Bullet) {
							if (!readerText) {
								readerText = ("{" + bullet.xField + "}: {" + bullet.yField + "}");
							}

							if (bullet.isDynamic) {
								dataItem.events.on("workingvaluechanged", bullet.deepInvalidate, bullet, false);
								//dataItem.events.on("calculatedvaluechanged", bullet.deepInvalidate, bullet, false);
								this.dataItem.events.on("workingvaluechanged", bullet.deepInvalidate, bullet, false);
							}
							bullet.deepInvalidate();
						}

						// Add accessibility to bullet
						if (bullet.focusable) {
							bullet.events.on("focus", (ev) => {
								bullet.readerTitle = this.populateString(readerText, bullet.dataItem);
							}, undefined, false);
							bullet.events.on("blur", (ev) => {
								bullet.readerTitle = "";
							}, undefined, false);
						}
						if (bullet.hoverable) {
							bullet.events.on("over", (ev) => {
								bullet.readerTitle = this.populateString(readerText, bullet.dataItem);
							}, undefined, false);
							bullet.events.on("out", (ev) => {
								bullet.readerTitle = "";
							}, undefined, false);
						}

					}

					bullet.parent = this.bulletsContainer;
					dataItem.bullets.setKey(bulletTemplate.uid, bullet);

					// pass max w/h so we'd know if we should show/hide somethings
					bullet.maxWidth = dataItem.itemWidth;
					bullet.maxHeight = dataItem.itemHeight;
					bullet.__disabled = false;

					this.positionBullet(bullet);
				}
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
	public handleDataItemWorkingValueChange(dataItem?: this["_dataItem"], name?: string): void {
		if (!this.dataRangeInvalid) {
			this.invalidateProcessedData();
		}
	}

	/**
	 * Should this series excluded from the axis scale calculations?
	 *
	 * @default false
	 * @param value  Exclude from calculations?
	 */
	public set ignoreMinMax(value: boolean) {
		this._ignoreMinMax = value;
		this.invalidateDataItems();
	}

	/**
	 * @return Exclude from calculations?
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
	 * @param event  Event
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
			axisRange.events.on("valuechanged", this.invalidateDataItems, this, false);
		}
	}

	/**
	 * [getAxisField description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param axis  [description]
	 * @return [description]
	 */
	public getAxisField(axis: Axis): string {
		return;
	}

	/**
	 * Shows the tooltip at specific position.
	 *
	 * @ignore Exclude from docs
	 * @param xPosition  X
	 * @param yPosition  Y
	 */
	public showTooltipAtPosition(xPosition: number, yPosition: number): void {

		// Placeholder method for extending classes to override.

	}

	/**
	 * Minimal distance between data points in pixels.
	 *
	 * If distance gets smaller than this, bullets are turned off to avoid
	 * overlapping.
	 *
	 * `0` (zero) disables this behavior.
	 *
	 * IMPORTANT: This setting will work only when Series' base axis
	 * is [[CategoryAxis]] or [[DateAxis]]. If base axis is [[ValueAxis]] the
	 * setting will be ignored, because it would be a huge overhead to measure
	 * distance between each and every bullet.
	 *
	 * @default 0
	 * @param value  Distance (px)
	 */
	public set minBulletDistance(value: number) {
		this.setPropertyValue("minBulletDistance", value, true);
	}

	/**
	 * @return Distance (px)
	 */
	public get minBulletDistance(): number {
		return this.getPropertyValue("minBulletDistance");
	}

	/**
	 * A list of bullets that will be added to each and every items in the
	 * series.
	 *
	 * You can push any object that is a descendant of a [[Sprite]] here. All
	 * items added to this list will be copied and used as a bullet on all data
	 * items, including their properties, events, etc.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/bullets/} for more info about the concept of Bullets
	 * @return List of bullets.
	 */
	public get bullets(): ListTemplate<Sprite> {
		if (!this._bullets) {
			this._bullets = new ListTemplate<Sprite>(new Bullet());
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
	 * @param marker  Legend item container
	 */
	public createLegendMarker(marker: Container): void {

		// This is a placeholder method for extending classes to override.

	}

	/**
	 * Should the series be hidden in legend?
	 *
	 * @param value Hidden in legend?
	 */
	public set hiddenInLegend(value: boolean) {
		if (this.setPropertyValue("hiddenInLegend", value)) {
			if (this.chart) {
				this.chart.feedLegend();
			}
		}
	}

	/**
	 * @return Hidden in legend?
	 */
	public get hiddenInLegend(): boolean {
		return this.getPropertyValue("hiddenInLegend");
	}

	/**
	 * Series' name.
	 *
	 * @param value  Name
	 */
	public set name(value: string) {
		this.setPropertyValue("name", value);

		let legendDataItem = this.legendDataItem;
		if (legendDataItem) {
			legendDataItem.component.invalidate();
			legendDataItem.component.invalidateRawData();
		}

		this.readerTitle = value;
	}

	/**
	 * @return Name
	 */
	public get name(): string {
		return this.getPropertyValue("name");
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
	 * @param value Screen reader text template
	 */
	public set itemReaderText(value: string) {
		this._itemReaderText = value;
		this._itemReaderTextChanged = true;
	}

	/**
	 * @return Screen reader text template
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

		if (!this._adapterO) {
			return readerText;
		}
		else {
			return this._adapterO.apply("itemReaderText", readerText);
		}

	}

	/**
	 * Returns if number of data items in the series are beyond non-focusable
	 * count and should not be available for TAB-through.
	 *
	 * @ignore Exclude from docs
	 * @return Items focusable?
	 */
	public itemsFocusable(): boolean {
		return this.dataItems.length >= this.skipFocusThreshold ? false : true;
	}

	/**
	 * Legend data item that corresponds to this series.
	 *
	 * @param value  Data item
	 */
	public set legendDataItem(value: LegendDataItem) {
		this._legendDataItem = value;
		this._legendDataItem.itemContainer.deepInvalidate();
	}

	/**
	 * @return Data item
	 */
	public get legendDataItem(): LegendDataItem {
		return this._legendDataItem;
	}

	/**
	 * Updates corresponding legend data item with current values.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public updateLegendValue(dataItem?: this["_dataItem"], notRange?: boolean) {
		// if this series has legend item
		if (this.legendDataItem) {

			let legendSettings: LegendSettings = this.legendSettings;
			let legendDataItem = this.legendDataItem;
			let label: Label = legendDataItem.label;
			let valueLabel: Label = legendDataItem.valueLabel;

			// update legend
			if (dataItem || notRange) {
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
					label.dataItem = dataItem;
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
	 * @param source  Source series
	 */
	public copyFrom(source: this) {
		this.bullets.copyFrom(source.bullets);
		this.bulletsContainer.copyFrom(source.bulletsContainer);
		this.calculatePercent = source.calculatePercent;
		this.simplifiedProcessing = source.simplifiedProcessing;
		super.copyFrom(source);
	}

	/**
	 * Displays a modal or console message with error, and halts any further
	 * processing of this element.
	 *
	 * @param e Error
	 */
	public raiseCriticalError(e: Error) {
		if (this._chart && this._chart.modal) {
			this._chart.modal.content = this._chart.adapter.apply("criticalError", e).message;
			this._chart.modal.closable = false;
			this._chart.modal.open();
			this._chart.disabled = true;
		}

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
	 * A list of heat rules to apply to series' elements based on the value
	 * of the data item.
	 *
	 * Heat rules can be any "numeric" (including `Color`) property, and can also
	 * be applied to child objects of series, like columns, bullets, etc.
	 *
	 * E.g.:
	 *
	 * ```TypeScript
	 * series.heatRules.push({
	 *  "target": series.columns.template,
	 *  "property": "fill",
	 *  "min": am4core.color("#F5DBCB"),
	 *  "max": am4core.color("#ED7B84"),
	 *  "dataField": "valueY"
	 *});
	 *```
	 * ```Javacript
	 * series.heatRules.push({
	 *  "target": series.columns.template,
	 *  "property": "fill",
	 *  "min": am4core.color("#F5DBCB"),
	 *  "max": am4core.color("#ED7B84"),
	 *  "dataField": "valueY"
	 *});
	 *```
	 *```JSON
	 *{
	 *  // ...
	 *  "series": [{
	 *    "type": "ColumnSeries",
	 *    "heatRules": [{
	 *      "target": "columns.template",
	 *      "property": "fill",
	 *      "min": "#F5DBCB",
	 *      "max": "#ED7B84",
	 *      "dataField": "valueY"
	 *    }]
	 *  }]
	 *}
	 *```
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/series/#Heat_maps} for more about heat rules
	 * @return  Heat rules
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
								let workingValue = dataItem.getActualWorkingValue(dataField);
								if ($type.hasValue(min) && $type.hasValue(max) && $type.isNumber(minValue) && $type.isNumber(maxValue) && $type.isNumber(workingValue)) {

									let percent = (workingValue - minValue) / (maxValue - minValue);

									if ($type.isNumber(workingValue) && !$type.isNumber(percent)) {
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
	 * @param config  Config
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
	 * @param a  Element 1
	 * @param b  Element 2
	 * @return Sorting number
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

	/**
	 * Sets `visibility` property:
	 *
	 * * `true` - visible
	 * * `false` - hidden
	 *
	 * @param value  true - visible, false - hidden
	 * @return Current visibility
	 */
	public setVisibility(value: boolean) {
		super.setVisibility(value);
		this.bulletsContainer.visible = value;
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