/**
 * Category axis module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Axis, AxisItemLocation, AxisDataItem, IAxisProperties, IAxisDataFields, IAxisAdapters, IAxisEvents, IAxisDataItemAdapters } from "./Axis";
import { IPoint, IOrientationPoint } from "../../core/defs/IPoint";
import { AxisFill } from "./AxisFill";
import { AxisRenderer } from "./AxisRenderer";
import { AxisRendererX } from "./AxisRendererX";
import { AxisRendererY } from "./AxisRendererY";
import { SerialChart } from "../types/SerialChart";
import { AxisTick } from "./AxisTick";
import { Grid } from "./Grid";
import { AxisLabel } from "./AxisLabel";
import { registry } from "../../core/Registry";
import { Dictionary } from "../../core/utils/Dictionary";
import { XYSeries, XYSeriesDataItem } from "../series/XYSeries";
import { CategoryAxisBreak } from "./CategoryAxisBreak";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import * as $iter from "../../core/utils/Iterator";
import { Adapter } from "../../core/utils/Adapter";
import { IRange } from "../../core/defs/IRange";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[CategoryAxis]].
 *
 * @see {@link DataItem}
 */
export class CategoryAxisDataItem extends AxisDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: CategoryAxis;


	/**
	 * @ignore
	 */
	public _adapterO: Adapter<CategoryAxisDataItem, ICategoryAxisDataItemAdapters>;

	/**
	 * Holds Adapter.
	 */
	public get adapter(): Adapter<CategoryAxisDataItem, ICategoryAxisDataItemAdapters> {
		if (!this._adapterO) {
			this._adapterO = new Adapter<CategoryAxisDataItem, ICategoryAxisDataItemAdapters>(this);
		}
		return this._adapterO;
	}

	public seriesDataItems: { [index: string]: XYSeriesDataItem[] } = {};

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CategoryAxisDataItem";
		this.text = "{category}";

		this.locations.category = 0;
		this.locations.endCategory = 1;

		this.applyTheme();
	}

	/**
	 * Category.
	 *
	 * @param value  Category
	 */
	public set category(value: string) {
		this.setProperty("category", value);
	}

	/**
	 * @return Category
	 */
	public get category(): string {
		if (this._adapterO) {
			if (this._adapterO.isEnabled("category")) {
				return this._adapterO.apply("category", this.properties.category);
			}
		}
		return this.properties.category;
	}

	/**
	 * End category.
	 *
	 * Used for items that span several categories, like [[CategoryAxisBreak]].
	 *
	 * @param value  End category
	 */
	public set endCategory(value: string) {
		this.setProperty("endCategory", value);
	}

	/**
	 * @return End category
	 */
	public get endCategory(): string {
		return this.properties.endCategory;
	}
}

/**
 * Defines adapters for [[DataItem]]
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface ICategoryAxisDataItemAdapters extends IAxisDataItemAdapters {
	category: string;
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[CategoryAxis]].
 */
export interface ICategoryAxisDataFields extends IAxisDataFields {

	/**
	 * A field that holds category information.
	 */
	category?: string;

}

/**
 * Defines properties for [[CategoryAxis]].
 */
export interface ICategoryAxisProperties extends IAxisProperties { }

/**
 * Defines events for [[CategoryAxis]].
 */
export interface ICategoryAxisEvents extends IAxisEvents { }

/**
 * Defines adapter for [[CategoryAxis]].
 *
 * @see {@link Adapter}
 */
export interface ICategoryAxisAdapters extends IAxisAdapters, ICategoryAxisProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to create a category-based axis for the chart.
 *
 * ```TypeScript
 * // Create the axis
 * let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 *
 * // Set settings
 * xAxis.title.text = "Clients";
 * ```
 * ```JavaScript
 * // Create the axis
 * var valueAxis = chart.xAxes.push(new am4charts.CategoryAxis());
 *
 * // Set settings
 * valueAxis.title.text = "Clients";
 * ```
 * ```JSON
 * "xAxes": [{
 *   "type": "CategoryAxis",
 *   "title": {
 *     "text": "Clients"
 *   }
 * }]
 * ```
 *
 * @see {@link ICategoryAxisEvents} for a list of available Events
 * @see {@link ICategoryAxisAdapters} for a list of available Adapters
 * @important
 */
export class CategoryAxis<T extends AxisRenderer = AxisRenderer> extends Axis<T> {

	/**
	 * Defines data fields.
	 */
	public _dataFields: ICategoryAxisDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ICategoryAxisProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICategoryAxisAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICategoryAxisEvents;

	/**
	 * Defines the type of the Date Items.
	 */
	public _dataItem: CategoryAxisDataItem;

	/**
	 * Defines the type of the axis breaks.
	 */
	public _axisBreak: CategoryAxisBreak;

	/**
	 * A reference to chart the axis is for.
	 */
	public chart: SerialChart;

	/**
	 * Frequency of the labels on axis.
	 */
	protected _frequency: number;

	/**
	 * A collection that holds Axis' data items sorted by each category.
	 */
	public dataItemsByCategory: Dictionary<string, this["_dataItem"]> = new Dictionary<string, this["_dataItem"]>();

	/**
	 * last data item is used for the closing grid
	 */
	protected _lastDataItem: CategoryAxisDataItem;


	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "CategoryAxis";

		// Set field name
		this.axisFieldName = "category";

		this._lastDataItem = this.createDataItem();
		this._lastDataItem.component = this;
		this._disposers.push(this._lastDataItem);


		// Apply theme
		this.applyTheme();

	}

	/**
	 * Returns a new/empty [[DataItem]] of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new CategoryAxisDataItem();
	}

	/**
	 * Returns a new/empty [[AxisBreak]] of the appropriate type.
	 *
	 * @return Axis break
	 */
	protected createAxisBreak(): this["_axisBreak"] {
		return new CategoryAxisBreak();
	}

	/**
	 * Processes a related series' data item.
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param dataItem  Data item
	 */
	public processSeriesDataItem(dataItem: XYSeriesDataItem, axisLetter?: string): void {
		super.processSeriesDataItem(dataItem, axisLetter);
		let category: string = (<any>dataItem)["category" + this.axisLetter];
		if ($type.hasValue(category)) {
			let categoryAxisDataItem: this["_dataItem"] = this.dataItemsByCategory.getKey(category);
			if (categoryAxisDataItem) {
				let seriesId = dataItem.component.uid;
				let seriesDataItems = categoryAxisDataItem.seriesDataItems[seriesId];
				if (!seriesDataItems) {
					seriesDataItems = [];
					categoryAxisDataItem.seriesDataItems[seriesId] = seriesDataItems;
				}
				seriesDataItems.push(dataItem);
			}
		}
		else {
			dataItem.component.dataItems.remove(dataItem);
		}
	}

	/**
	 * Validates the data range.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 */
	public validateDataRange(): void {

		super.validateDataRange();

		$iter.each(this._series.iterator(), (series) => {
			if ((series.xAxis instanceof CategoryAxis) && (series.yAxis instanceof CategoryAxis)) {
				series.invalidateDataRange();
			}
			else {
				let startIndex = this.positionToIndex(this.start);
				let endIndex = this.positionToIndex(this.end);

				if (endIndex >= this.dataItems.length) {
					endIndex--;
				}

				let seriesId = series.uid;
				let minIndex: number;
				let maxIndex: number;

				for (let i = startIndex; i <= endIndex; i++) {
					let axisDataItem = this.dataItems.getIndex(i);
					if (axisDataItem) {
						let seriesDataItems = axisDataItem.seriesDataItems[seriesId];

						if (seriesDataItems) {
							for (let i = 0; i < seriesDataItems.length; i++) {
								let seriesDataItem = seriesDataItems[i];
								if (seriesDataItem) {
									let index = seriesDataItem.index;
									if (!$type.isNumber(minIndex) || index < minIndex) {
										minIndex = index;
									}
									if (!$type.isNumber(maxIndex) || index > maxIndex) {
										maxIndex = index;
									}
								}
							}
						}
					}
				}

				if ($type.isNumber(minIndex)) {
					series.startIndex = minIndex;
				}
				else {
					series.start = this.start;
				}
				if ($type.isNumber(maxIndex)) {
					series.endIndex = maxIndex + 1;
				}
				else {
					series.end = this.end;
				}

				// range might not change, but axis breaks might.
				if (this._axisBreaks && this._axisBreaks.length > 0) {
					series.invalidateDataRange();
				}
			}
		});
	}

	/**
	 * Validates the whole axis. Causes it to redraw.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 */
	public validate(): void {

		super.validate();

		let dataCount: number = this.dataItems.length;

		let startIndex = $math.fitToRange(Math.floor(this.start * dataCount - 1), 0, dataCount);
		let endIndex = $math.fitToRange(Math.ceil(this.end * dataCount), 0, dataCount);

		if (this.renderer.invalid) {
			this.renderer.validate();
		}

		// find frequency at which we'll show items
		let maxCount: number = this.renderer.axisLength / this.renderer.minGridDistance;
		let frequency: number = Math.min(this.dataItems.length, Math.ceil((endIndex - startIndex) / maxCount));

		this._startIndex = Math.floor(startIndex / frequency) * frequency;
		this._endIndex = Math.ceil(this.end * dataCount);

		this.fixAxisBreaks();

		if (this._startIndex == this._endIndex) {
			this._endIndex++;
		}

		this._frequency = frequency;

		if (this.axisLength <= 0) {
			return;
		}

		this.maxZoomFactor = this.dataItems.length;
		if (this.dataItems.length <= 0) {
			this.maxZoomFactor = 1;
		}

		this.resetIterators();

		// it's important to use protected variables here, as getters will return 0 - length
		// TODO use iterator instead
		// @ todo: not solved cat axis item fading
		startIndex = $math.max(0, this._startIndex - this._frequency);
		endIndex = $math.min(this.dataItems.length, this._endIndex + this._frequency);

		let itemIndex = 0;

		for (let i = 0; i < startIndex; i++) {
			let dataItem = this.dataItems.getIndex(i);
			dataItem.__disabled = true;
		}

		for (let i = endIndex, len = this.dataItems.length; i < len; i++) {
			let dataItem = this.dataItems.getIndex(i);
			dataItem.__disabled = true;
		}

		for (let i = startIndex; i < endIndex; i++) {
			if (i < this.dataItems.length) {
				let dataItem: this["_dataItem"] = this.dataItems.getIndex(i);
				if (i / this._frequency == Math.round(i / this._frequency)) {
					let axisBreak: CategoryAxisBreak = this.isInBreak(i);
					if (!axisBreak) {
						this.appendDataItem(dataItem);
						this.validateDataElement(dataItem, itemIndex);
					}

					itemIndex++;
				}
				else {
					//previously we disabled all before, but this is better for cpu
					//this.validateDataElement(dataItem, itemIndex); // helps to solve shrinking // not good - creates all items
					dataItem.__disabled = true;
				}
			}
		}

		this.appendDataItem(this._lastDataItem);
		this.validateDataElement(this._lastDataItem, itemIndex + 1, this.dataItems.length);

		if (this._axisBreaks) {
			let axisBreaks = this._axisBreaks;

			axisBreaks.each((axisBreak) => {
				let adjustedStartValue: number = axisBreak.adjustedStartValue;
				let adjustedEndValue: number = axisBreak.adjustedEndValue;

				if ($math.intersect({ start: adjustedStartValue, end: adjustedEndValue }, { start: this._startIndex, end: this._endIndex })) {

					let frequency: number = $math.fitToRange(Math.ceil(this._frequency / axisBreak.breakSize), 1, adjustedEndValue - adjustedStartValue);
					let itemIndex = 0;
					// TODO use iterator instead
					for (let b = adjustedStartValue; b <= adjustedEndValue; b = b + frequency) {
						let dataItem: this["_dataItem"] = this.dataItems.getIndex(b);
						this.appendDataItem(dataItem);
						this.validateDataElement(dataItem, itemIndex);
						itemIndex++;
					}
				}
			});
		}

		this.validateBreaks();
		this.validateAxisRanges();

		this.ghostLabel.invalidate(); // solves font issue
		this.renderer.invalidateLayout();
	}

	/**
	 * [validateDataElement description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param dataItem   [description]
	 * @param itemIndex  [description]
	 */
	public validateDataElement(dataItem: this["_dataItem"], itemIndex?: number, index?: number): void {
		super.validateDataElement(dataItem);

		dataItem.itemIndex = this._axisItemCount;
		this._axisItemCount++;		

		//dataItem.__disabled = false;

		let renderer: AxisRenderer = this.renderer;
		if (!$type.isNumber(index)) {
			index = this.categoryToIndex(dataItem.category);
		}

		let endIndex = this.categoryToIndex(dataItem.endCategory);

		if (!$type.isNumber(endIndex)) {
			endIndex = index;
		}

		let position: number = this.indexToPosition(index, dataItem.locations.category);
		let endPosition: number = this.indexToPosition(endIndex, dataItem.locations.endCategory);

		dataItem.position = position;

		let fillEndIndex: number;
		let fillPosition: number;
		let fillEndPosition: number;

		if (dataItem.isRange) {
			fillEndIndex = endIndex;
			fillPosition = this.indexToPosition(index, dataItem.locations.category);
			fillEndPosition = this.indexToPosition(fillEndIndex, dataItem.locations.endCategory);
		}

		dataItem.point = renderer.positionToPoint(position);

		let tick: AxisTick = dataItem.tick;
		if (tick && !tick.disabled) {
			renderer.updateTickElement(tick, position, endPosition);
		}

		let grid: Grid = dataItem.grid;
		if (grid && !grid.disabled) {
			renderer.updateGridElement(grid, position, endPosition);
		}


		let label: AxisLabel = dataItem.label;
		if (label && !label.disabled) {
			// theorethically this might result problems if category text changes, the range text won't change. But otherwise range.label.text = "custom text" wont' work, which is not intuitive.
			if (!dataItem.isRange || label.text == undefined) {
				dataItem.text = dataItem.text;
			}

			renderer.updateLabelElement(label, position, endPosition);

			if ((renderer instanceof AxisRendererY && dataItem.label.measuredWidth > this.ghostLabel.measuredWidth) || (renderer instanceof AxisRendererX && dataItem.label.measuredHeight > this.ghostLabel.measuredHeight)) {
				if (dataItem.label.html) {
					this.ghostLabel.html = dataItem.label.currentText;
				}
				else {
					this.ghostLabel.text = dataItem.label.currentText;
				}
			}
		}

		let fill: AxisFill = dataItem.axisFill;
		if (fill && !fill.disabled) {

			if (!dataItem.isRange) {
				fillEndIndex = index + this._frequency;
				fillPosition = this.indexToPosition(index, fill.location);
				fillEndPosition = this.indexToPosition(fillEndIndex, fill.location);
			}

			renderer.updateFillElement(fill, fillPosition, fillEndPosition);
			if (!dataItem.isRange) {
				this.fillRule(dataItem, itemIndex);
			}
		}

		if (dataItem.bullet) {
			renderer.updateBullet(dataItem.bullet, position, endPosition);
		}


		let mask: AxisFill = dataItem.mask;
		if (mask) {
			renderer.updateFillElement(mask, fillPosition, fillEndPosition);
		}
	}


	/**
	 * @ignore
	 */
	public disposeData() {
		this.dataItemsByCategory.clear();
		super.disposeData();
	}

	/**
	 * Processes the axis data item.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem     Data item
	 * @param dataContext  The raw data that corresponds to this data item
	 */
	public processDataItem(dataItem: this["_dataItem"], dataContext: Object): void {
		if (dataItem) {
			// creat a collection for fast access
			super.processDataItem(dataItem, dataContext);
			// check if such category already exists
			//let existingDataItem: CategoryAxisDataItem = this.dataItemsByCategory.getKey(dataItem.category);
			//if (existingDataItem && existingDataItem != dataItem) {
			//	this.dataItems.remove(existingDataItem);
			//}

			if ($type.hasValue(dataItem.category)) {
				this.dataItemsByCategory.setKey(dataItem.category, dataItem);
			}
		}
	}


	protected getDataItem(dataContext?: any): this["_dataItem"] {
		let category: string = <string>(dataContext[this.dataFields.category]);
		if ($type.hasValue(category)) {
			let dataItem: this["_dataItem"] = this.dataItemsByCategory.getKey(category);

			if (dataItem) {
				return dataItem;
			}
			else {
				return this.dataItems.create();
			}
		}
	}

	/**
	 * Converts a category index to an actual screen coordinate on the axis.
	 *
	 * `location` identifies relative location within category. 0 - beginning,
	 * 0.5 - middle, 1 - end, and anything inbetween.
	 *
	 * @param index     Index
	 * @param location  Location (0-1)
	 * @return Position (px)
	 */
	public indexToPosition(index: number, location?: AxisItemLocation | number): number {
		if (!$type.isNumber(location)) {
			location = 0.5;
		}

		let startIndex: number = this.startIndex;
		let endIndex: number = this.endIndex;

		let difference: number = this.adjustDifference(startIndex, endIndex);

		let startLocation = this.startLocation;
		let endLocation = this.endLocation;

		difference -= startLocation;
		difference -= (1 - endLocation);

		if (this._axisBreaks) {
			let axisBreaks = this._axisBreaks;

			$iter.eachContinue(axisBreaks.iterator(), (axisBreak) => {
				let breakStartIndex: number = axisBreak.adjustedStartValue;
				let breakEndIndex: number = axisBreak.adjustedEndValue;

				if (index < startIndex) {
					return false;
				}

				if ($math.intersect({ start: breakStartIndex, end: breakEndIndex }, { start: startIndex, end: endIndex })) {
					breakStartIndex = Math.max(startIndex, breakStartIndex);
					breakEndIndex = Math.min(endIndex, breakEndIndex);

					let breakSize: number = axisBreak.breakSize;

					// value to the right of break end
					if (index > breakEndIndex) {
						startIndex += (breakEndIndex - breakStartIndex) * (1 - breakSize);
					}
					// value to the left of break start
					else if (index < breakStartIndex) {

					}
					// value within break
					else {
						index = breakStartIndex + (index - breakStartIndex) * breakSize;
					}
				}

				return true;
			});
		}

		return $math.round((index + location - startLocation - startIndex) / difference, 5);
	}

	/**
	 * Converts a string category name to relative position on axis.
	 *
	 * `location` identifies relative location within category. 0 - beginning,
	 * 0.5 - middle, 1 - end, and anything inbetween.
	 *
	 * @param category  Category name
	 * @param location  Location (0-1)
	 * @return Position
	 */
	public categoryToPosition(category: string, location?: AxisItemLocation): number {
		let index: number = this.categoryToIndex(category);
		return this.indexToPosition(index, location);
	}

	/**
	 * Converts a string category name to a orientation point (x, y, angle) on axis
	 *
	 * `location` identifies relative location within category. 0 - beginning,
	 * 0.5 - middle, 1 - end, and anything inbetween.
	 * @param category  Category name
	 * @param location  Location (0-1)
	 * @return Orientation point
	 */
	public categoryToPoint(category: string, location?: AxisItemLocation): IOrientationPoint {
		let position = this.categoryToPosition(category, location);
		let point = this.renderer.positionToPoint(position);
		let angle = this.renderer.positionToAngle(position);
		return { x: point.x, y: point.y, angle: angle };
	}


	/**
	 * Converts a string category name to a orientation point (x, y, angle) on axis
	 *
	 * `location` identifies relative location within category. 0 - beginning,
	 * 0.5 - middle, 1 - end, and anything inbetween.
	 * @param category  Category name
	 * @param location  Location (0-1)
	 * @return Orientation point
	 */
	anyToPoint(category: string, location?: AxisItemLocation): IOrientationPoint {
		return this.categoryToPoint(category, location);
	}


	/**
	 * Converts a string category name to relative position on axis.
	 *
	 * An alias to `categoryToPosition()`.
	 *
	 * @param category  Category name
	 * @param location  Location (0-1)
	 * @return Relative position
	 */
	public anyToPosition(category: string, location?: AxisItemLocation): number {
		return this.categoryToPosition(category, location);
	}

	/**
	 * Converts named category to an index of data item it corresponds to.
	 *
	 * @param category  Category
	 * @return Data item index
	 */
	public categoryToIndex(category: string): number {
		if ($type.hasValue(category)) {
			let dataItem: this["_dataItem"] = this.dataItemsByCategory.getKey(category);
			if (dataItem) {
				return dataItem.index;
			}
		}
	}

	/**
	 * Zooms the axis to specific named ctaegories.
	 *
	 * @param startCategory  Start category
	 * @param endCategory    End category
	 */
	public zoomToCategories(startCategory: string, endCategory: string): void {
		this.zoomToIndexes(this.categoryToIndex(startCategory), this.categoryToIndex(endCategory) + 1);
	}

	/**
	 * [getAnyRangePath description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param start         [description]
	 * @param end           [description]
	 * @param startLocation [description]
	 * @param endLocation   [description]
	 * @return [description]
	 */
	public getAnyRangePath(start: string, end: string, startLocation?: AxisItemLocation, endLocation?: AxisItemLocation): string {
		let startPos: number = this.categoryToPosition(start, startLocation);
		let endPos: number = this.categoryToPosition(end, endLocation);
		return this.getPositionRangePath(startPos, endPos); // Base class (Axis) gets range shape from AxisRenderer
	}

	/**
	 * Takes an absolute position (px) within axis and adjust it to a specific
	 * `location` within category it corresponds to.
	 *
	 * @param position  Source position (px)
	 * @param location  Location within category (0-1)
	 * @return Adjusted position (px)
	 */
	public roundPosition(position: number, location?: AxisItemLocation): number {
		let index: number = this.positionToIndex(position);
		return this.indexToPosition(index, location);
	}

	/**
	 * Finds and returns first series data item with specific category
	 * @param series    Target series
	 * @param category  Category
	 * @return XYSeriesDataItem data item
	 */
	public getFirstSeriesDataItem(series: XYSeries, category: string): XYSeriesDataItem {

		for (let i = 0; i < series.dataItems.length; i++) {
			let dataItem = series.dataItems.getIndex(i);
			if (series.xAxis == this) {
				if (dataItem.categoryX == category) {
					return dataItem;
				}
			}
			if (series.yAxis == this) {
				if (dataItem.categoryY == category) {
					return dataItem;
				}
			}
		}
	}

	/**
	 * Finds and returns last series data item with specific category.
	 * @param series    Target series
	 * @param category  Category
	 * @return XYSeriesDataItem data item
	 */
	public getLastSeriesDataItem(series: XYSeries, category: string): XYSeriesDataItem {

		for (let i = series.dataItems.length - 1; i >= 0; i--) {
			let dataItem = series.dataItems.getIndex(i);
			if (series.xAxis == this) {
				if (dataItem.categoryX == category) {
					return dataItem;
				}
			}
			if (series.yAxis == this) {
				if (dataItem.categoryY == category) {
					return dataItem;
				}
			}
		}

	}


	/**
	 * Returns a data item from Series that corresponds to a specific absolute
	 * position on the Axis.
	 *
	 * @param series    Target series
	 * @param position  Position (px)
	 * @return XYSeriesDataItem data item
	 */
	public getSeriesDataItem(series: XYSeries, position: number, findNearest?: boolean): XYSeriesDataItem {

		if ($type.isNumber(position)) {

			let index = this.positionToIndex(position);

			if (index >= this.dataItems.length) {
				index--;
			}

			let dataItem = this.dataItems.getIndex(index);

			if (dataItem) {
				let category = dataItem.category;
				let sdi: XYSeriesDataItem;

				let seriesDataItem = series.dataItems.getIndex(index);
				if (seriesDataItem) {
					if (series.xAxis == this) {
						if (seriesDataItem.categoryX == category) {
							return seriesDataItem;
						}
					}
					if (series.yAxis == this) {
						if (seriesDataItem.categoryY == category) {
							return seriesDataItem;
						}
					}
				}


				series.dataItems.each((dataItem) => {
					if (series.xAxis == this) {
						if (dataItem.categoryX == category) {
							if (!sdi) {
								sdi = dataItem;
							}
							if (Math.abs(index - sdi.index) > Math.abs(index - dataItem.index)) {
								sdi = dataItem;
							}

						}
					}
					if (series.yAxis == this) {
						if (dataItem.categoryY == category) {
							if (!sdi) {
								sdi = dataItem;
							}
							if (Math.abs(index - sdi.index) > Math.abs(index - dataItem.index)) {
								sdi = dataItem;
							}
						}
					}
				})

				//@todo
				if (findNearest) {

				}

				return sdi;
			}
		}
	}


	/**
	 * Returns the X coordinate for series' data item.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem  Data item
	 * @param key       Category
	 * @param location  Location (0-1)
	 * @return X coordinate (px)
	 */
	public getX(dataItem: XYSeriesDataItem, key?: string, location?: number, stackKey?: string, range?: IRange): number {

		let position = this.getPositionX(dataItem, key, location, stackKey, range);

		if ($type.isNaN(position)) {
			return this.basePoint.x;
		}
		else {
			return this.renderer.positionToPoint(position).x;
		}
	}

	/**
	 * Returns relative position on axis for series' data item.
	 *
	 * @since 4.5.14
	 * @param  dataItem  Data item
	 * @param  key       Category
	 * @param  location  Location (0-1)
	 * @return           Relative position
	 */
	public getPositionX(dataItem: XYSeriesDataItem, key?: string, location?: number, stackKey?: string, range?: IRange): number {
		let position;
		if ($type.hasValue(key)) {
			position = this.categoryToPosition(dataItem.categories[key], location);
		}

		if (range) {
			position = $math.fitToRange(position, range.start, range.end);
		}

		return position;
	}

	/**
	 * Returns the Y coordinate for series' data item.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem  Data item
	 * @param key       Category
	 * @param location  Location (0-1)
	 * @return Y coordinate (px)
	 */
	public getY(dataItem: XYSeriesDataItem, key?: string, location?: number, stackKey?: string, range?: IRange): number {

		let position = this.getPositionY(dataItem, key, location, stackKey, range);

		if ($type.isNaN(position)) {
			return this.basePoint.y;
		}
		else {
			return this.renderer.positionToPoint(position).y;
		}
	}

	/**
	 * Returns relative position on axis for series' data item.
	 *
	 * @since 4.5.14
	 * @param  dataItem  Data item
	 * @param  key       Category
	 * @param  location  Location (0-1)
	 * @return           Relative position
	 */
	public getPositionY(dataItem: XYSeriesDataItem, key?: string, location?: number, stackKey?: string, range?: IRange): number {
		let position;
		if ($type.hasValue(key)) {
			position = this.categoryToPosition(dataItem.categories[key], location);
		}

		if (range) {
			position = $math.fitToRange(position, range.start, range.end);
		}

		return position;
	}

	/**
	 * Returns an angle for series data item.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param dataItem  Data item
	 * @param key       Category
	 * @param location  Location (0-1)
	 * @param stackKey  Stack key (?)
	 * @param range Range to fit in
	 * @return Angle
	 */
	public getAngle(dataItem: XYSeriesDataItem, key: string, location?: number, stackKey?: string, range?: IRange): number {
		let position = this.categoryToPosition(dataItem.categories[key], location);

		if (range) {
			position = $math.fitToRange(position, range.start, range.end);
		}

		return this.positionToAngle(position);
	}

	/**
	 * Returns an absolute pixel coordinate of the start of the cell (category),
	 * that specific position value falls into.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param position  Position (px)
	 * @return Cell start position (px)
	 */
	public getCellStartPosition(position: number): number {
		return this.roundPosition(position, 0);
	}

	/**
	 * Returns an absolute pixel coordinate of the end of the cell (category),
	 * that specific position value falls into.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 * @param position  Position (px)
	 * @return Cell end position (px)
	 */
	public getCellEndPosition(position: number): number {
		return this.roundPosition(position, 1);
	}

	/**
	 * Returns text to show in a category tooltip, based on specific position
	 * within axis.
	 *
	 * @ignore Exclude from docs
	 * @param position  Position (px)
	 * @return Label (category)
	 */
	public getTooltipText(position: number): string {
		let dataItem: this["_dataItem"] = this.dataItems.getIndex(this.positionToIndex(position));

		if (dataItem) {
			this.tooltipDataItem = dataItem;
			this.tooltip.dataItem = dataItem;
			if(this.tooltipText){
				return this.tooltipText;
			}

			if (!this._adapterO) {
				return dataItem.category;
			}
			else {
				return this._adapterO.apply("getTooltipText", dataItem.category);
			}
		}
	}

	/**
	 * Returns an index of the category that corresponds to specific pixel
	 * position within axis.
	 *
	 * @param position  Position (px)
	 * @return Category index
	 */
	public positionToIndex(position: number): number {
		position = $math.round(position, 10);
		if (position < 0) {
			position = 0;
		}

		if (position > 1) {
			position = 1;
		}

		let startIndex: number = this.startIndex;
		let endIndex: number = this.endIndex;
		let difference: number = endIndex - startIndex - this.startLocation - (1 - this.endLocation);

		position += 1 / difference * this.startLocation;
		let index: number = null;

		if (this._axisBreaks) {
			let axisBreaks = this._axisBreaks;

			// in case we have some axis breaks
			$iter.eachContinue(axisBreaks.iterator(), (axisBreak) => {
				let breakStartPosition: number = axisBreak.startPosition;
				let breakEndPosition: number = axisBreak.endPosition;

				let breakStartIndex: number = axisBreak.adjustedStartValue;
				let breakEndIndex: number = axisBreak.adjustedEndValue;

				breakStartIndex = $math.max(breakStartIndex, startIndex);
				breakEndIndex = $math.min(breakEndIndex, endIndex);

				let breakSize: number = axisBreak.breakSize;

				difference -= (breakEndIndex - breakStartIndex) * (1 - breakSize);

				// position to the right of break end
				if (position > breakEndPosition) {
					startIndex += (breakEndIndex - breakStartIndex) * (1 - breakSize);
				}
				// position to the left of break start
				else if (position < breakStartPosition) {

				}
				// value within break
				else {
					let breakPosition = (position - breakStartPosition) / (breakEndPosition - breakStartPosition);
					index = breakStartIndex + Math.round(breakPosition * (breakEndIndex - breakStartIndex));
					return false;
				}

				return true;
			});
		}

		if (!$type.isNumber(index)) {
			index = Math.floor(position * difference + startIndex);
		}
		if (index >= this.dataItems.length) {
			index = this.dataItems.length - 1;
		}
		// not good, when panning out of bounds, each time one less item gets selected
		//if (index >= endIndex) {
		//	index--;
		//}

		return index;
	}

	/**
	 * Returns category based on position.
	 *
	 * Please note that `position` represents position within axis which may be
	 * zoomed and not correspond to Cursor's `position`.
	 *
	 * To convert Cursor's `position` to Axis' `position` use `toAxisPosition()` method.
	 *
	 * This is a synonim of `getPositionLabel()` implemented here for consistentcy.
	 *
	 * @since 4.3.8
	 * @see {@link https://www.amcharts.com/docs/v4/tutorials/tracking-cursors-position-via-api/#Tracking_Cursor_s_position} For more information about cursor tracking.
	 * @param position  Relative position on axis (0-1)
	 * @return Position label
	 */
	public positionToCategory(position: number): string {
		return this.getPositionLabel(position);
	}

	/**
	 * Returns category based on position.
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
		let dataItem: this["_dataItem"] = this.dataItems.getIndex(this.positionToIndex(position));
		if (dataItem) {
			return dataItem.category;
		}
	}

	/**
	 * Coordinates of the actual axis start.
	 *
	 * @ignore Exclude from docs
	 * @return Base point
	 */
	public get basePoint(): IPoint {
		// This makes base grid to be drawn at the end of the axis and adds extra
		// grid which we need to nicely close the chart.
		return this.renderer.positionToPoint(1);
	}

	/**
	 * Initializes Axis' renderer.
	 *
	 * @ignore Exclude from docs
	 */
	public initRenderer(): void {
		super.initRenderer();

		let renderer = this.renderer;
		renderer.baseGrid.disabled = true;
	}

	/**
	 * Current frequency of labels of the axis.
	 *
	 * Normally it would be 1, but when labels start to be hidden due
	 * to `minGridDistance` this read-only property will increase.
	 *
	 * @readonly
	 * @since 4.2.0
	 * @return Label frequency
	 */
	public get frequency(): number {
		return this._frequency;
	}
}

/**
 * Register class, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CategoryAxis"] = CategoryAxis;
registry.registeredClasses["CategoryAxisDataItem"] = CategoryAxisDataItem;
