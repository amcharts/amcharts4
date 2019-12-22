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
import { Sprite, visualProperties } from "../../core/Sprite";
import { SpriteState } from "../../core/SpriteState";
import { Container } from "../../core/Container";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { Dictionary } from "../../core/utils/Dictionary";
import { ValueAxis } from "../axes/ValueAxis";
import { CategoryAxis } from "../axes/CategoryAxis";
import { registry } from "../../core/Registry";
import { Bullet } from "../elements/Bullet";
import { Column } from "../elements/Column";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
import { percent } from "../../core/utils/Percent";
import * as $math from "../../core/utils/Math";
import * as $object from "../../core/utils/Object";
import * as $iter from "../../core/utils/Iterator";
import * as $array from "../../core/utils/Array";
import * as $type from "../../core/utils/Type";
import { Disposer } from "../../core/utils/Disposer";
import { LegendDataItem } from "../../charts/Legend";

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
export class ColumnSeriesDataItem extends XYSeriesDataItem {

	/**
	 * A Column Element
	 */
	public _column: Column;

	/**
	 * Indicates if this data items close value is lower than its open value.
	 */
	public droppedFromOpen: boolean;

	/**
	 * Indicates if this items value is lower than previous data item's value.
	 */
	public droppedFromPrevious: boolean;

	/**
	 * Defines a type of [[Component]] this data item is used for
	 */
	public _component!: ColumnSeries;

	/**
	 * A dictionary storing axes ranges columns by axis uid
	 *
	 * @ignore
	 */
	protected _rangesColumns: Dictionary<string, this["_column"]>;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ColumnSeriesDataItem";

		this.locations["dateX"] = 0.5;
		this.locations["dateY"] = 0.5;

		this.locations["categoryX"] = 0.5;
		this.locations["categoryY"] = 0.5;

		this.applyTheme();
	}

	/**
	 * A column used to draw a column for this data item.
	 *
	 * @param column
	 */
	public set column(column: this["_column"]) {
		this.setColumn(column);
	}

	/**
	 * @return Column
	 */
	public get column(): this["_column"] {
		return this._column;
	}

	protected setColumn(column: this["_column"]) {
		if (this._column && column != this._column) {
			$array.remove(this.sprites, this._column);
		}
		this._column = column;

		if (column) {
			let prevDataItem: ColumnSeriesDataItem = <any>column.dataItem;
			if (prevDataItem && prevDataItem != this) {
				prevDataItem.column = undefined;
			}
			this.addSprite(column);

			this._disposers.push(new Disposer(() => {
				// TODO investigate why component is undefined
				// https://codepen.io/team/amcharts/pen/dac4be245d658233a6d7e5597df2208b?editors=0010
				if (this.component) {
					this.component.columns.removeValue(column);
				}
			}));
		}
	}


	/**
	 * A dictionary storing axes ranges columns by axis uid
	 */
	public get rangesColumns(): Dictionary<string, this["_column"]> {
		if (!this._rangesColumns) {
			this._rangesColumns = new Dictionary<string, this["_column"]>();
		}
		return this._rangesColumns;
	}

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
export interface IColumnSeriesDataFields extends IXYSeriesDataFields { }

/**
 * Defines properties for [[ColumnSeries]].
 */
export interface IColumnSeriesProperties extends IXYSeriesProperties {

	/**
	 * Cluster this series columns?
	 *
	 * Setting to `false` will make columns overlap with other series.
	 *
	 * @default true
	 */
	clustered?: boolean;

}

/**
 * Defines events for [[ColumnSeries]].
 */
export interface IColumnSeriesEvents extends IXYSeriesEvents { }

/**
 * Defines adapters for [[ColumnSeries]].
 *
 * @see {@link Adapter}
 */
export interface IColumnSeriesAdapters extends IXYSeriesAdapters, IColumnSeriesProperties { }


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
export class ColumnSeries extends XYSeries {

	/**
	 * Type of column.
	 */
	public _column: Column;

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IColumnSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IColumnSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IColumnSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IColumnSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: ColumnSeriesDataItem;

	/**
	 * A list of column elements.
	 */
	protected _columns: ListTemplate<this["_column"]>;

	/**
	 * Container to put column elements in.
	 */
	protected _columnsContainer: Container;

	/**
	 * Start location within cell for columns.
	 */
	protected _startLocation: number = 0;

	/**
	 * End location within cell for columns.
	 */
	protected _endLocation: number = 1;

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
	constructor() {
		super();
		this.className = "ColumnSeries";

		this.width = percent(100);
		this.height = percent(100);

		this.strokeOpacity = 0;
		this.fillOpacity = 1;

		this.clustered = true;

		let columnsContainer = this.mainContainer.createChild(Container);
		columnsContainer.shouldClone = false;
		columnsContainer.isMeasured = false;
		columnsContainer.layout = "none";
		this._columnsContainer = columnsContainer;

		this.columns.template.pixelPerfect = false;

		this.tooltipColorSource = this.columns.template;

		this.applyTheme();
	}

	/**
	 * A container that columns are created in.
	 *
	 * @ignore Exclude from docs
	 */
	public get columnsContainer() {
		return this._columnsContainer;
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Column Series");
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new ColumnSeriesDataItem();
	}

	/**
	 * (Re)validates the whole series, effectively causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		//@todo Check if we can do better than use `instanceof`
		// find start/end locations based on clustered/stacked settings
		// go through chart series instead of base axis series, because axis series doesn't maintain order
		if (this.chart && this.xAxis && this.yAxis) {
			let baseAxisSeries = this.chart.series;
			let clusterCount: number = 0;
			let index: number = 0;

			let sortedByAxis: { series: XYSeries, axis: number }[] = [];
			$iter.each(baseAxisSeries.iterator(), (series) => {
				if (series instanceof ColumnSeries) {
					if (this.baseAxis == series.baseAxis) {
						let index: number;
						if (this.baseAxis == this.xAxis) {
							index = this.chart.yAxes.indexOf(series.yAxis);
						}
						else {
							index = this.chart.xAxes.indexOf(series.xAxis);
						}

						sortedByAxis.push({ series: series, axis: index })
					}
				}
			})


			sortedByAxis.sort((a, b) => a.axis - b.axis);
			let prevAxisIndex:number;

			$array.each(sortedByAxis, (sortedItem) => {
				let series = sortedItem.series;
				if (series instanceof ColumnSeries) {
					if ((!series.stacked && series.clustered) || (prevAxisIndex != sortedItem.axis && series.clustered)) {
						clusterCount++;
					}

					if (series == this) {
						index = clusterCount - 1;
					}
				}
				prevAxisIndex = sortedItem.axis;
			});

			if(!this.clustered){
				index = 0;
				clusterCount = 1;
			}

			let renderer = this.baseAxis.renderer;

			let cellStartLocation: number = renderer.cellStartLocation;
			let cellEndLocation: number = renderer.cellEndLocation;

			this._startLocation = cellStartLocation + (index / clusterCount) * (cellEndLocation - cellStartLocation);
			this._endLocation = cellStartLocation + (index + 1) / clusterCount * (cellEndLocation - cellStartLocation);
		}

		super.validate();

		for (let i = 0; i < this.startIndex; i++) {
			let dataItem = this.dataItems.getIndex(i);
			this.disableUnusedColumns(dataItem);
		}

		for (let i = this.dataItems.length - 1; i > this.endIndex; i--) {
			let dataItem = this.dataItems.getIndex(i);
			this.disableUnusedColumns(dataItem);
		}
	}

	/**
	 * Validates data item's element, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {
		// important oder here, first real, then super. we need this to know size
		if (this.chart && this.xAxis && this.yAxis) {
			this.validateDataElementReal(dataItem);
			super.validateDataElement(dataItem);
		}
	}

	/**
	 * Returns relative start location for the data item.
	 *
	 * @param dataItem  Data item
	 * @return Location (0-1)
	 */
	protected getStartLocation(dataItem: this["_dataItem"]): number {
		let startLocation = this._startLocation;

		if (this.baseAxis == this.xAxis) {
			startLocation += dataItem.locations[this.xOpenField] - 0.5;
		}
		else {
			startLocation += dataItem.locations[this.yOpenField] - 0.5;
		}
		return startLocation;
	}

	/**
	 * [handleDataItemWorkingValueChange description]
	 *
	 * @ignore Exclude from docs
	 */
	/*
   public handleDataItemWorkingValueChange(dataItem?: this["_dataItem"], name?: string): void {
	   if (this.simplifiedProcessing) {
		   this.validateDataElement(dataItem);
	   }
	   else {
		   super.handleDataItemWorkingValueChange(dataItem, name);
	   }
   }*/

	/**
	 * Returns relative end location for the data item.
	 *
	 * @param dataItem  Data item
	 * @return Location (0-1)
	 */
	protected getEndLocation(dataItem: this["_dataItem"]): number {
		let endLocation = this._endLocation;

		if (this.baseAxis == this.xAxis) {
			endLocation += dataItem.locations[this.xField] - 0.5;
		}
		else {
			endLocation += dataItem.locations[this.yField] - 0.5;
		}
		return endLocation;
	}

	/**
	 * Validates data item's elements.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElementReal(dataItem: this["_dataItem"]): void {
		//	if (dataItem.hasValue([this.xField, this.yField])) { // todo: this doesn't work with categories, think of a better way
		let l: number;
		let r: number;
		let t: number;
		let b: number;

		let startLocation = this.getStartLocation(dataItem);
		let endLocation = this.getEndLocation(dataItem);

		let xField = this.xField;
		let xOpenField = this.xOpenField;
		let yField = this.yField;
		let yOpenField = this.yOpenField;

		let template: Sprite = this.columns.template;

		let percentWidth: number = template.percentWidth;
		let percentHeight: number = template.percentHeight;

		let pixelWidth: number = template.pixelWidth;
		let pixelHeight: number = template.pixelHeight;

		let maxWidth: number = template.maxWidth;
		let maxHeight: number = template.maxHeight;

		let paddingLeft: number = template.pixelPaddingLeft;
		let paddingRight: number = template.pixelPaddingRight;
		let paddingTop: number = template.pixelPaddingTop;
		let paddingBottom: number = template.pixelPaddingBottom;

		let outOfBounds: boolean = false;

		// two category axes
		if ((this.xAxis instanceof CategoryAxis) && (this.yAxis instanceof CategoryAxis)) {

			if (!dataItem.hasValue(this._xValueFields) || !dataItem.hasValue(this._yValueFields)) {
				return;
			}

			startLocation = 0;
			endLocation = 1;
			if (!$type.isNaN(percentWidth)) {
				let offset: number = $math.round((endLocation - startLocation) * (1 - percentWidth / 100) / 2, 5);
				startLocation += offset;
				endLocation -= offset;
			}

			l = this.xAxis.getX(dataItem, xOpenField, startLocation);
			r = this.xAxis.getX(dataItem, xField, endLocation);

			// in case width is set in pixels
			if ($type.isNaN(percentWidth)) {
				let offset: number = ((r - l) - pixelWidth) / 2;
				l += offset;
				r -= offset;
			}

			// in case max width is set in pixels
			if (!$type.isNaN(maxWidth) && maxWidth < Math.abs(r - l)) {
				let offset: number = ((r - l) - maxWidth) / 2;
				l += offset;
				r -= offset;
			}

			startLocation = 0;
			endLocation = 1;

			if (!$type.isNaN(percentHeight)) {
				let offset: number = $math.round((1 - percentHeight / 100) / 2, 5);
				startLocation += offset;
				endLocation -= offset;
			}

			t = this.yAxis.getY(dataItem, yOpenField, startLocation);
			b = this.yAxis.getY(dataItem, yField, endLocation);

			// in case width is set in pixels
			if ($type.isNaN(percentHeight)) {
				let offset: number = ((b - t) - pixelHeight) / 2;
				b += offset;
				t -= offset;
			}

			// in case max width is set in pixels
			if (!$type.isNaN(maxHeight) && maxHeight < Math.abs(b - t)) {
				let offset: number = ((b - t) - maxHeight) / 2;
				b += offset;
				t -= offset;
			}

			r = this.fixHorizontalCoordinate(r);
			l = this.fixHorizontalCoordinate(l);
			t = this.fixVerticalCoordinate(t);
			b = this.fixVerticalCoordinate(b);
		}
		else if (this.baseAxis == this.xAxis) {

			if (!dataItem.hasValue(this._yValueFields)) {
				return;
			}

			// in case width is set in percent
			if (!$type.isNaN(percentWidth)) {
				let offset: number = $math.round((endLocation - startLocation) * (1 - percentWidth / 100) / 2, 5);
				startLocation += offset;
				endLocation -= offset;
			}

			l = this.xAxis.getX(dataItem, xOpenField, startLocation);
			r = this.xAxis.getX(dataItem, xField, endLocation);

			// in case width is set in pixels
			if ($type.isNaN(percentWidth)) {
				let offset: number = ((r - l) - pixelWidth) / 2;
				l += offset;
				r -= offset;
			}

			// in case width is set in pixels
			if (!$type.isNaN(maxWidth) && maxWidth < Math.abs(r - l)) {
				let offset: number = ((r - l) - maxWidth) / 2;
				l += offset;
				r -= offset;
			}

			let bottomLocation = dataItem.locations[yOpenField];
			let topLocation = dataItem.locations[yField];
			// otherwise gantt chart will start items in the middle of a cell
			if (this.yAxis instanceof ValueAxis) {
				if ((<any>this.dataFields)[this.yField] != (<any>this.dataFields)[this.yOpenField]) {
					bottomLocation = 0;
					topLocation = 0;
				}
			}

			b = this.yAxis.getY(dataItem, yOpenField, bottomLocation);
			t = this.yAxis.getY(dataItem, yField, topLocation);

			// used to save location for bullets, but it's not a good approach
			// dataItem.locations[xField] = startLocation + (endLocation - startLocation) / 2;

			let axisLenght = Math.ceil(this.yAxis.axisLength);

			if ((t < 0 && b < 0) || (t > axisLenght && b > axisLenght)) {
				outOfBounds = true;
			}

			t = this.fixVerticalCoordinate(t);
			b = this.fixVerticalCoordinate(b);

			if (Math.abs(r - l) - paddingLeft - paddingRight == 0) {
				outOfBounds = true;
			}
		}
		// horizontal bars
		else {
			if (!dataItem.hasValue(this._xValueFields)) {
				return;
			}

			if (!$type.isNaN(percentHeight)) {
				let offset: number = $math.round((endLocation - startLocation) * (1 - percentHeight / 100) / 2, 5);
				startLocation += offset;
				endLocation -= offset;
			}

			t = this.yAxis.getY(dataItem, yOpenField, startLocation);
			b = this.yAxis.getY(dataItem, yField, endLocation);

			// in case height is set in pixels
			if ($type.isNaN(percentHeight)) {
				let offset: number = ((b - t) - pixelHeight) / 2;
				b -= offset;
				t += offset;
			}

			// in case height is set in pixels
			if (!$type.isNaN(maxHeight) && maxHeight < Math.abs(b - t)) {
				let offset: number = ((b - t) - maxHeight) / 2;
				b -= offset;
				t += offset;
			}

			let rightLocation = dataItem.locations[xField];
			let leftLocation = dataItem.locations[xOpenField];

			// otherwise gantt chart will start items in the middle of a cell
			if (this.xAxis instanceof ValueAxis) {
				if ((<any>this.dataFields)[this.xField] != (<any>this.dataFields)[this.xOpenField]) {
					rightLocation = 0;
					leftLocation = 0;
				}
			}

			r = this.xAxis.getX(dataItem, xField, rightLocation);
			l = this.xAxis.getX(dataItem, xOpenField, leftLocation);
			// used to save location for bullets, but it's not a good approach
			// dataItem.locations[yField] = startLocation + (endLocation - startLocation) / 2;

			let axisLenght = Math.ceil(this.xAxis.axisLength);

			if ((r < 0 && l < 0) || (r > axisLenght && l > axisLenght)) {
				outOfBounds = true;
			}

			r = this.fixHorizontalCoordinate(r);
			l = this.fixHorizontalCoordinate(l);

			if (Math.abs(t - b) - paddingTop - paddingBottom == 0) {
				outOfBounds = true;
			}
		}

		let w: number = Math.abs(r - l);
		let h: number = Math.abs(b - t);

		let x: number = Math.min(l, r);
		let y: number = Math.min(t, b);

		if (!outOfBounds) {
			let column: this["_column"];
			if (!dataItem.column) {
				column = this.columns.create();
				//$object.forceCopyProperties(this.columns.template, column, visualProperties);
				$object.copyProperties(this, column, visualProperties); // need this because 3d columns are not in the same container
				$object.copyProperties(this.columns.template, column, visualProperties); // second time, no force, so that columns.template would override series properties
				dataItem.addSprite(column);

				dataItem.column = column;
				column.paper = this.paper; // sometimes pattern is not drawn if is set with adapter without this.

				// accessibility
				if (this.itemsFocusable()) {
					this.role = "menu";
					column.role = "menuitem";
					column.focusable = true;
				}
				else {
					this.role = "list";
					column.role = "listitem";
					column.focusable = false;
				}

				if (column.focusable) {
					column.events.on("focus", (ev) => {
						column.readerTitle = this.populateString(this.itemReaderText, dataItem);
					}, undefined, false);
					column.events.on("blur", (ev) => {
						column.readerTitle = "";
					}, undefined, false);
				}
				if (column.hoverable) {
					column.events.on("over", (ev) => {
						column.readerTitle = this.populateString(this.itemReaderText, dataItem);
					}, undefined, false);
					column.events.on("out", (ev) => {
						column.readerTitle = "";
					}, undefined, false);
				}
			}
			else {
				column = dataItem.column;
			}

			column.width = w;
			column.height = h;

			column.x = x;
			column.y = y;

			column.realX = l;
			column.realY = t;

			column.realWidth = r - l;
			column.realHeight = b - t;

			column.parent = this.columnsContainer;
			column.virtualParent = this;

			this.setColumnStates(column);

			if (column.invalid) {
				column.validate(); // validate as if it was used previously, it will flicker with previous dimensions
			}

			column.__disabled = false;
			//column.returnAfterTemp();

			$iter.each(this.axisRanges.iterator(), (axisRange) => {
				let rangeColumn: this["_column"] = dataItem.rangesColumns.getKey(axisRange.uid);
				if (!rangeColumn) {
					rangeColumn = this.columns.create();

					//$object.forceCopyProperties(this.columns.template, rangeColumn, visualProperties);
					$object.copyProperties(axisRange.contents, rangeColumn, visualProperties); // need this because 3d columns are not in the same container

					dataItem.addSprite(rangeColumn);
					dataItem.rangesColumns.setKey(axisRange.uid, <Column>rangeColumn);
					rangeColumn.paper = this.paper; // sometimes pattern is not drawn if is set with adapter without this.
				}

				rangeColumn.parent = axisRange.contents;

				rangeColumn.width = w;
				rangeColumn.height = h;
				rangeColumn.x = x;
				rangeColumn.y = y;

				this.setColumnStates(rangeColumn);

				if (rangeColumn.invalid) {
					rangeColumn.validate(); // validate as if it was used previously, it will flicker with previous dimensions
				}

				rangeColumn.__disabled = false;
				//rangeColumn.returnAfterTemp();
			});
		}
		else {
			this.disableUnusedColumns(dataItem);
		}

		dataItem.itemWidth = w;
		dataItem.itemHeight = h;
	}


	/**
	 * @ignore
	 */
	protected disableUnusedColumns(dataItem: ColumnSeriesDataItem) {
		if (dataItem) {
			if (dataItem.column) {
				// otherwise might flicker when enabling
				dataItem.column.width = 0;
				dataItem.column.height = 0;
				dataItem.column.__disabled = true;
			}

			$iter.each(this.axisRanges.iterator(), (axisRange) => {
				let rangeColumn: Sprite = dataItem.rangesColumns.getKey(axisRange.uid);
				if (rangeColumn) {
					// otherwise might flicker when enabling
					rangeColumn.width = 0;
					rangeColumn.height = 0;
					rangeColumn.__disabled = true;
				}
			});
		}
	}


	/**
	 * Apply different state/coloring to columns based on the change value.
	 *
	 * @param sprite  Sprite to apply state to
	 * @todo Do not apply accessibility to wicks of the candlesticks
	 */
	protected setColumnStates(sprite: Sprite): void {
		if (this._dropFromOpenState || this._dropFromPreviousState || this._riseFromOpenState || this._riseFromPreviousState) {

			let dataItem: this["_dataItem"] = <this["_dataItem"]>sprite.dataItem;

			if (this.xAxis instanceof ValueAxis || this.yAxis instanceof ValueAxis) {
				let open: number;
				let value: number;
				let change: number;

				if (this.baseAxis == this.yAxis) {
					if (this.xOpenField && this.xField && this.xAxis instanceof ValueAxis) {
						open = dataItem.getValue(this.xOpenField);
						value = dataItem.getValue(this.xField);
						change = dataItem.getValue(this.xAxis.axisFieldName + "X", "previousChange");
					}
				}
				else {
					if (this.yOpenField && this.yField && this.yAxis instanceof ValueAxis) {
						open = dataItem.getValue(this.yOpenField);
						value = dataItem.getValue(this.yField);
						change = dataItem.getValue(this.yAxis.axisFieldName + "Y", "previousChange");
					}
				}

				if (value < open) {
					dataItem.droppedFromOpen = true;
					sprite.defaultState.copyFrom(this._dropFromOpenState)
					sprite.setState(this._dropFromOpenState, 0);
				}
				else {
					dataItem.droppedFromOpen = false;
					sprite.defaultState.copyFrom(this._riseFromOpenState)
					sprite.setState(this._riseFromOpenState, 0);
				}

				if (change < 0) {
					dataItem.droppedFromPrevious = true;
					sprite.defaultState.copyFrom(this._dropFromPreviousState)
					sprite.setState((this._dropFromPreviousState), 0);
				}
				else {
					dataItem.droppedFromPrevious = false;
					sprite.defaultState.copyFrom(this._riseFromPreviousState)
					sprite.setState((this._riseFromPreviousState), 0);
				}
			}
		}
	}

	/**
	 * A list of column elements in the series.
	 *
	 * @return Columns
	 */
	public get columns(): ListTemplate<this["_column"]> {
		if (!this._columns) {
			this._columns = new ListTemplate<this["_column"]>(this.createColumnTemplate());
			this._disposers.push(new ListDisposer(this._columns));
			this._disposers.push(this._columns.template);
		}
		return this._columns;
	}

	/**
	 * Creates and returns a column element to use as a template.
	 *
	 * @return Column template
	 */
	protected createColumnTemplate(): this["_column"] {
		return new Column();
	}

	/**
	 * Cluster this series columns?
	 *
	 * Setting to `false` will make columns overlap with other series.
	 *
	 * @default true
	 * @param value  Clustered?
	 */
	public set clustered(value: boolean) {
		this.setPropertyValue("clustered", value, true);
	}

	/**
	 * @return Clustered?
	 */
	public get clustered(): boolean {
		return this.getPropertyValue("clustered");
	}

	/**
	 * A state to apply to a column when close value is lower than open value.
	 *
	 * Can be used to differentiate appearance based on value relations.
	 *
	 * NOTE: this will work only if at least one axis is [[ValueAxis]].
	 *
	 * @readonly You can modify state object, but can't overwrite it
	 * @param  value  State
	 */
	public set dropFromOpenState(value: SpriteState<this["_properties"], this["_adapter"]>) {
		this._dropFromOpenState = value;
	}

	/**
	 * @return State
	 */
	public get dropFromOpenState(): SpriteState<this["_properties"], this["_adapter"]> {
		if (!this._dropFromOpenState) {
			this._dropFromOpenState = this.states.create("dropFromOpenState");
		}
		return this._dropFromOpenState;
	}

	/**
	 * A state to apply to a column when its value is lower value of a previous
	 * column.
	 *
	 * Can be used to differentiate appearance based on value relations.
	 *
	 * @readonly You can modify state object, but can't overwrite it
	 * @param  value  State
	 */
	public set dropFromPreviousState(value: SpriteState<this["_properties"], this["_adapter"]>) {
		this._dropFromPreviousState = value;
	}

	/**
	 * @return State
	 */
	public get dropFromPreviousState(): SpriteState<this["_properties"], this["_adapter"]> {
		if (!this._dropFromPreviousState) {
			this._dropFromPreviousState = this.states.create("dropFromPreviousState");
		}
		return this._dropFromPreviousState;
	}

	/**
	 * A state to apply to a column when close value is same or higher than open
	 * value.
	 *
	 * Can be used to differentiate appearance based on value relations.
	 *
	 * NOTE: this will work only if at least one axis is [[ValueAxis]].
	 *
	 * @readonly You can modify state object, but can't overwrite it
	 * @param  value  State
	 */
	public set riseFromOpenState(value: SpriteState<this["_properties"], this["_adapter"]>) {
		this._riseFromOpenState = value;
	}

	/**
	 * @return State
	 */
	public get riseFromOpenState(): SpriteState<this["_properties"], this["_adapter"]> {
		if (!this._riseFromOpenState) {
			this._riseFromOpenState = this.states.create("riseFromOpenState");
		}
		return this._riseFromOpenState;
	}

	/**
	 * A state to apply to a column when its value is same or higher than value
	 * of a previous column.
	 *
	 * Can be used to differentiate appearance based on value relations.
	 *
	 * @readonly You can modify state object, but can't overwrite it
	 * @param  value  State
	 */
	public set riseFromPreviousState(value: SpriteState<this["_properties"], this["_adapter"]>) {
		this._riseFromPreviousState = value;
	}

	/**
	 * @return State
	 */
	public get riseFromPreviousState(): SpriteState<this["_properties"], this["_adapter"]> {
		if (!this._riseFromPreviousState) {
			this._riseFromPreviousState = this.states.create("riseFromPreviousState");
		}
		return this._riseFromPreviousState;
	}

	/**
	 * Updates value of the related legend item.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public updateLegendValue(dataItem?: this["_dataItem"], notRange?: boolean) {
		super.updateLegendValue(dataItem, notRange);

		if (this.legendDataItem) {
			let marker: Container = this.legendDataItem.marker;
			let fromOpenState: SpriteState<this["_properties"], this["_adapter"]>;
			let fromPreviousState: SpriteState<this["_properties"], this["_adapter"]>;

			if (dataItem) {
				if (dataItem.droppedFromOpen) {
					fromOpenState = this._dropFromOpenState;
				}
				else {
					fromOpenState = this._riseFromOpenState;
				}

				if (dataItem.droppedFromPrevious) {
					fromPreviousState = this._dropFromPreviousState;
				}
				else {
					fromPreviousState = this._riseFromPreviousState;
				}
			}

			$iter.each(marker.children.iterator(), (child) => {
				if (dataItem) {
					child.setState(fromPreviousState);
					child.setState(fromOpenState);
				}
				else {
					// todo: think what to do here, maybe apply above states based on totals?
					child.setState(this._riseFromPreviousState);
					child.setState(this._riseFromOpenState);
				}
			});
		}
	}

	/**
	 * Creates elements in related legend container, that mimics the look of this
	 * Series.
	 *
	 * @ignore Exclude from docs
	 * @param marker  Legend item container
	 */
	public createLegendMarker(marker: Container) {
		let w: number = marker.pixelWidth;
		let h: number = marker.pixelHeight;

		marker.removeChildren();

		let column: RoundedRectangle = marker.createChild(RoundedRectangle);
		column.shouldClone = false;
		$object.copyProperties(this, column, visualProperties);

		column.copyFrom(<any>this.columns.template);
		column.padding(0, 0, 0, 0); // if columns will have padding (which is often), legend marker will be very narrow
		column.width = w;
		column.height = h;

		let legendDataItem = <LegendDataItem>marker.dataItem;
		legendDataItem.color = this.fill;
		legendDataItem.colorOrig = this.fill;
	}

	/**
	 * Copies all properties from another instance of [[ColumnSeries]].
	 *
	 * @param source  Source series
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.columns.template.copyFrom(source.columns.template);
	}

	/**
	* returns bullet x location
	* @ignore
	*/

	protected getBulletLocationX(bullet: Bullet, field: string): number {
		if (this.baseAxis == this.xAxis) {
			let bulletLocationX = bullet.locationX;
			if (!$type.isNumber(bulletLocationX)) {
				bulletLocationX = 0.5;
			}

			let endLocation = this.getEndLocation(<ColumnSeriesDataItem>bullet.dataItem);
			let startLocation = this.getStartLocation(<ColumnSeriesDataItem>bullet.dataItem);

			return endLocation - (endLocation - startLocation) * bulletLocationX;
		}
		else {
			return super.getBulletLocationX(bullet, field);
		}
	}


	/**
	* returns bullet y location
	* @ignore
	*/
	protected getBulletLocationY(bullet: Bullet, field: string): number {
		if (this.baseAxis == this.yAxis) {
			let bulletLocationY = bullet.locationY;
			if (!$type.isNumber(bulletLocationY)) {
				bulletLocationY = 0.5;
			}

			let endLocation = this.getEndLocation(<ColumnSeriesDataItem>bullet.dataItem);
			let startLocation = this.getStartLocation(<ColumnSeriesDataItem>bullet.dataItem);

			return endLocation - (endLocation - startLocation) * bulletLocationY;
		}
		else {
			return super.getBulletLocationY(bullet, field);
		}
	}

	protected getAdjustedXLocation(dataItem: this["_dataItem"], field: string) {
		if (this.baseAxis == this.xAxis) {
			let bulletLocationX = 0.5;
			if (dataItem) {
				bulletLocationX = dataItem.locations[field];
			}
			if (!$type.isNumber(bulletLocationX)) {
				bulletLocationX = 0.5;
			}
			return this._endLocation - (this._endLocation - this._startLocation) * bulletLocationX;
		}
		else {
			return super.getAdjustedXLocation(dataItem, field);
		}
	}

	protected getAdjustedYLocation(dataItem: this["_dataItem"], field: string) {
		if (this.baseAxis == this.yAxis) {
			let bulletLocationY = 0.5;
			if (dataItem) {
				bulletLocationY = dataItem.locations[field];
			}
			if (!$type.isNumber(bulletLocationY)) {
				bulletLocationY = 0.5;
			}
			return this._endLocation - (this._endLocation - this._startLocation) * bulletLocationY;
		}
		else {
			return super.getAdjustedXLocation(dataItem, field);
		}
	}


	/**
	 * @ignore Exclude from docs
	 */
	protected fixVerticalCoordinate(coordinate: number): number {
		let paddingBottom = this.columns.template.pixelPaddingBottom;
		let paddingTop = this.columns.template.pixelPaddingTop;

		let minY: number = -paddingTop;
		let maxY: number = this.yAxis.axisLength + paddingBottom;

		return $math.fitToRange(coordinate, minY, maxY);
	}

	/**
	 * @ignore Exclude from docs
	 */
	protected fixHorizontalCoordinate(coordinate: number): number {
		let paddingLeft = this.columns.template.pixelPaddingLeft;
		let paddingRight = this.columns.template.pixelPaddingRight;

		let minX: number = -paddingLeft;
		let maxX: number = this.xAxis.axisLength + paddingRight;

		return $math.fitToRange(coordinate, minX, maxX);
	}

	/**
	 * @ignore
	 */
	public disposeData() {
		super.disposeData();
		this.columns.clear();
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ColumnSeries"] = ColumnSeries;
registry.registeredClasses["ColumnSeriesDataItem"] = ColumnSeriesDataItem;
