/**
 * Defines Pyramid Series.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IFunnelSeriesAdapters, IFunnelSeriesDataFields, IFunnelSeriesEvents, IFunnelSeriesProperties, FunnelSeries, FunnelSeriesDataItem } from "./FunnelSeries";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";
import * as $utils from "../../core/utils/Utils";
import { Percent, percent } from "../../core/utils/Percent";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

//@todo: sequenced?

/**
 * Defines a [[DataItem]] for [[PyramidSeries]].
 *
 * @see {@link DataItem}
 */
export class PyramidSeriesDataItem extends FunnelSeriesDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: PyramidSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PyramidSeriesDataItem";

		this.applyTheme();
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[PyramidSeries]].
 */
export interface IPyramidSeriesDataFields extends IFunnelSeriesDataFields { }

/**
 * Defines properties for [[PyramidSeries]].
 */
export interface IPyramidSeriesProperties extends IFunnelSeriesProperties {

	/**
	 * Bottom width in pixels or percent
	 */
	bottomWidth?: number | Percent;

	/**
	 * Top width in pixels or percent
	 */
	topWidth?: number | Percent;

	/**
	 * Height of pyramid
	 */
	pyramidHeight?: number | Percent;

	/**
	 * Indicates whether slice value should sould influence its height or area
	 * size.
	 *
	 * @default "area"
	 */
	valueIs?: "height" | "area";
}

/**
 * Defines events for [[PyramidSeries]].
 */
export interface IPyramidSeriesEvents extends IFunnelSeriesEvents { }

/**
 * Defines adapters for [[PyramidSeries]].
 *
 * @see {@link Adapter}
 */
export interface IPyramidSeriesAdapters extends IFunnelSeriesAdapters, IPyramidSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a FunnelSlice series on a [[SlicedChart]].
 *
 * @see {@link IPyramidSeriesEvents} for a list of available Events
 * @see {@link IPyramidSeriesAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/sliced-chart/} for documentation
 * @important
 */
export class PyramidSeries extends FunnelSeries {

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: IPyramidSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IPyramidSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPyramidSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPyramidSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: PyramidSeriesDataItem;

	/**
	 * [_nextWidth description]
	 *
	 * @todo Description
	 */
	protected _nextWidth: number;

	protected _pyramidHeight: number;

	protected _pyramidWidth: number;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "PyramidSeries";
		this.topWidth = percent(0);
		this.bottomWidth = percent(100);
		this.pyramidHeight = percent(100);
		this.valueIs = "area";

		this.sliceLinks.template.width = 0;
		this.sliceLinks.template.height = 0;

		this.applyTheme();
	}


	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Pyramid Series");
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new PyramidSeriesDataItem();
	}

	/**
	 * (Re)validates the whole series, effectively causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		super.validate();
		this._nextWidth = undefined;
	}

	/**
	 * [getNextValue description]
	 *
	 * @todo Description
	 * @param dataItem [description]
	 * @return [description]
	 */
	protected getNextValue(dataItem: FunnelSeriesDataItem): number {
		let index = dataItem.index;
		let nextValue: number = dataItem.getWorkingValue("value");
		if (index < this.dataItems.length - 1) {
			let nextItem = this.dataItems.getIndex(index + 1);
			nextValue = nextItem.getWorkingValue("value");
		}
		if (nextValue == 0) {
			nextValue = 0.000001;
		}
		return nextValue;
	}

	/**
	 * [validateDataElements description]
	 *
	 * @todo Description
	 * @ignore Exclude from docs
	 */
	public validateDataElements() {
		let maxWidth = this.slicesContainer.innerWidth;
		let maxHeight = this.slicesContainer.innerHeight;

		this.dataItems.each((dataItem) => {
			if (dataItem.value > 0) {
				let relValue = dataItem.getWorkingValue("value") / dataItem.value;
				let sliceLink = dataItem.sliceLink;
				if (this.orientation == "vertical") {
					maxHeight -= (sliceLink.pixelHeight * relValue);
				}
				else {
					maxWidth -= (sliceLink.pixelWidth * relValue);
				}
			}
		})

		this._pyramidHeight = $utils.relativeToValue(this.pyramidHeight, maxHeight);
		this._pyramidWidth = $utils.relativeToValue(this.pyramidHeight, maxWidth);

		if (this.orientation == "vertical") {
			let y = (maxHeight - this._pyramidHeight) / 2;
			this.slicesContainer.y = y
			this.labelsContainer.y = y;
			this.ticksContainer.y = y;
		}
		else {
			let x = (maxWidth - this._pyramidWidth) / 2;
			this.slicesContainer.x = x;
			this.labelsContainer.x = x;
			this.ticksContainer.x = x;
		}

		super.validateDataElements();
	}

	/**
	 * [decorateSlice description]
	 *
	 * @todo Description
	 * @param dataItem [description]
	 */
	protected decorateSlice(dataItem: this["_dataItem"]) {

		let sum = this.dataItem.values.value.absoluteSum;

		if (sum == 0) {
			return;
		}

		let slice = dataItem.slice;
		let sliceLink = dataItem.sliceLink;
		let label = dataItem.label;
		let tick = dataItem.tick;

		// TODO can this be removed ?
		this.getNextValue(dataItem);

		let workingValue = Math.abs(dataItem.getWorkingValue("value"));

		if (workingValue == 0) {
			workingValue = 0.000001;
		}

		let pyramidWidth = this._pyramidWidth;
		let pyramidHeight = this._pyramidHeight;

		let maxWidth = this.slicesContainer.innerWidth;
		let maxHeight = this.slicesContainer.innerHeight;

		let linkWidth = sliceLink.pixelWidth;
		let linkHeight = sliceLink.pixelHeight;

		if (dataItem.value == 0 && this.ignoreZeroValues) {
			dataItem.__disabled = true;
		}
		else {
			dataItem.__disabled = false;
		}

		if (this.orientation == "vertical") {
			let topWidth = $utils.relativeToValue(this.topWidth, maxWidth);

			if (!$type.isNumber(this._nextWidth)) {
				this._nextWidth = topWidth;
			}


			let bottomWidth = $utils.relativeToValue(this.bottomWidth, maxWidth);
			let sliceTopWidth = this._nextWidth;

			let angle = Math.atan2(pyramidHeight, topWidth - bottomWidth);
			let c = Math.tan(Math.PI / 2 - angle);
			if (c == 0) {
				c = 0.00000001;
			}

			let sliceHeight: number;
			let sliceBottomWidth: number;

			if (this.valueIs == "area") {
				let totalSquare = (topWidth + bottomWidth) / 2 * pyramidHeight;
				let square = totalSquare * workingValue / sum;

				let s = Math.abs(sliceTopWidth * sliceTopWidth - 2 * square * c);

				sliceHeight = (sliceTopWidth - Math.sqrt(s)) / c;
				sliceBottomWidth = (2 * square - sliceHeight * sliceTopWidth) / sliceHeight;
			}
			else {
				sliceHeight = pyramidHeight * workingValue / sum;
				sliceBottomWidth = sliceTopWidth - sliceHeight * c;
			}

			slice.height = sliceHeight;
			slice.width = maxWidth;
			slice.bottomWidth = sliceBottomWidth;
			slice.topWidth = sliceTopWidth;

			sliceLink.topWidth = slice.bottomWidth;
			sliceLink.bottomWidth = slice.bottomWidth;

			slice.y = this._nextY;
			//slice.x = maxWidth / 2;

			if (!this.alignLabels) {
				label.x = maxWidth / 2;
			}
			else {
				label.x = 0;
			}

			label.y = slice.pixelY + slice.pixelHeight * tick.locationY + slice.dy;

			this._nextY += slice.pixelHeight + linkHeight * workingValue / Math.max(Math.abs(dataItem.value), 0.00000001);
			sliceLink.y = this._nextY - linkHeight;
			sliceLink.x = maxWidth / 2;
		}
		else {
			let topWidth = $utils.relativeToValue(this.topWidth, maxHeight);

			if (!$type.isNumber(this._nextWidth)) {
				this._nextWidth = topWidth;
			}

			let bottomWidth = $utils.relativeToValue(this.bottomWidth, maxHeight);
			let sliceTopWidth = this._nextWidth;

			let angle = Math.atan2(pyramidWidth, topWidth - bottomWidth);
			let c = Math.tan(Math.PI / 2 - angle);
			if (c == 0) {
				c = 0.00000001;
			}

			let sliceWidth: number;
			let sliceBottomWidth: number;

			if (this.valueIs == "area") {
				let totalSquare = (topWidth + bottomWidth) / 2 * pyramidWidth;
				let square = totalSquare * workingValue / sum;
				sliceWidth = (sliceTopWidth - Math.sqrt(sliceTopWidth * sliceTopWidth - 2 * square * c)) / c;
				sliceBottomWidth = (2 * square - sliceWidth * sliceTopWidth) / sliceWidth;
			}
			else {
				sliceWidth = pyramidWidth * workingValue / sum;
				sliceBottomWidth = sliceTopWidth - sliceWidth * c;
			}

			slice.width = sliceWidth;
			slice.height = maxHeight;
			slice.bottomWidth = sliceBottomWidth;
			slice.topWidth = sliceTopWidth;

			sliceLink.topWidth = slice.bottomWidth;
			sliceLink.bottomWidth = slice.bottomWidth;

			slice.x = this._nextY;

			if (!this.alignLabels) {
				label.y = maxHeight / 2;
			}
			else {
				label.y = this.labelsContainer.measuredHeight;
			}

			label.x = slice.pixelX + slice.pixelWidth * tick.locationX + slice.dx;

			this._nextY += slice.pixelWidth + linkWidth * workingValue / Math.max(Math.abs(dataItem.value), 0.00000001);
			sliceLink.x = this._nextY - linkWidth;
			sliceLink.y = maxHeight / 2;
		}

		this._nextWidth = slice.bottomWidth;
	}

	/**
	 * Width of the pyramid's tip in pixels or relative (`Percent`).
	 *
	 * `0%` (default) means the pyramid will be perfectly pointy.
	 * `50%` will have a cut off / blunt top that is half the width of the chart.
	 * `100%` will take the whole width of the chart.
	 *
	 * If you need the downward-pointing pyramid, you might want to `topWidth` to
	 * `100%` and `bottomWidth` to `0%`.
	 *
	 * @default 0%
	 * @param {number | Percent}
	 */
	public set topWidth(value: number | Percent) {
		if (this.setPercentProperty("topWidth", value, false, false, 10, false)) {
			this.invalidate();
		}
	}

	/**
	 * @return {number | Percent}
	 */
	public get topWidth(): number | Percent {
		return this.getPropertyValue("topWidth");
	}


	/**
	 * Height of pyramid
	 *
	 *
	 * @default 100%
	 * @param {number | Percent}
	 */
	public set pyramidHeight(value: number | Percent) {
		if (this.setPercentProperty("pyramidHeight", value, false, false, 10, false)) {
			this.invalidate();
		}
	}

	/**
	 * @return {number | Percent}
	 */
	public get pyramidHeight(): number | Percent {
		return this.getPropertyValue("pyramidHeight");
	}

	/**
	 * Width of the pyramid's bottom (bsae) in pixels or relative (`Percent`).
	 *
	 * `0%` means the pyramid's botto will be pointy.
	 * `50%` will have a cut off / blunt bottom that is half the width of the chart.
	 * `100%` (default) will take the whole width of the chart.
	 *
	 * If you need the downward-pointing pyramid, you might want to `topWidth` to
	 * `100%` and `bottomWidth` to `0%`.
	 *
	 * @param {number | Percent}
	 */
	public set bottomWidth(value: number | Percent) {
		if (this.setPercentProperty("bottomWidth", value, false, false, 10, false)) {
			this.invalidate();
		}
	}

	/**
	 * @return {number | Percent}
	 */
	public get bottomWidth(): number | Percent {
		return this.getPropertyValue("bottomWidth");
	}

	/**
	 * Indicates how slice's value will influence its size.
	 *
	 * `"area"` (default) means that the whole area of the pyramid (counting in
	 * modifications by `topWidth` and `bottomWidth`) will be divvied up between
	 * slices based on their value.
	 *
	 * With this setting at `"area"` the area of the trapezoids of each slice
	 * will represent their value relatively to values of the other slices.
	 *
	 * This is a correct way to depict "weight" of each slice based on their
	 * values.
	 *
	 * `"height"` means whole height (as opposed to area) of the pyramid will be
	 * divvied up between slices. Actual slice width or area is not counted in.
	 *
	 * From the data-viz standpoint this does not make a lot of sense, since
	 * slices with lesser values might appear more prominent if they are placed
	 * towards thick end of the pyramid since their areas will be bigger.
	 *
	 * @default "area"
	 * @param {"area" | "height"}
	 */
	public set valueIs(value: "area" | "height") {
		if (this.setPropertyValue("valueIs", value)) {
			this.invalidate();
		}
	}

	/**
	 * @return {"area" | "height"}
	 */
	public get valueIs(): "area" | "height" {
		return this.getPropertyValue("valueIs");
	}
}

/**
 * bboxter class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PyramidSeries"] = PyramidSeries;
registry.registeredClasses["PyramidSeriesDataItem"] = PyramidSeriesDataItem;
