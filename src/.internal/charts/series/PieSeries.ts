/**
 * Defines Pie Chart Series.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IPercentSeriesAdapters, IPercentSeriesDataFields, IPercentSeriesEvents, IPercentSeriesProperties, PercentSeries, PercentSeriesDataItem } from "./PercentSeries";
import { ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { Slice } from "../../core/elements/Slice";
import { AxisLabelCircular } from "../axes/AxisLabelCircular";
import { PieTick } from "../elements/PieTick";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { DataItem, IDataItemEvents } from "../../core/DataItem";
import { Container } from "../../core/Container";
import { Animation } from "../../core/utils/Animation";
import { LegendDataItem, LegendSettings } from "../../charts/Legend";
import { Bullet } from "../elements/Bullet";
import { Dictionary, IDictionaryEvents, DictionaryTemplate, DictionaryDisposer } from "../../core/utils/Dictionary";
import { registry } from "../../core/Registry";
import { IRectangle } from "../../core/defs/IRectangle";
import { IPoint } from "../../core/defs/IPoint";
import { PieChart } from "../types/PieChart";
import * as $math from "../../core/utils/Math";
import * as $iter from "../../core/utils/Iterator";
import * as $ease from "../../core/utils/Ease";
import * as $type from "../../core/utils/Type";
import { Percent, percent } from "../../core/utils/Percent";
import { IDisposer, Disposer, MultiDisposer } from "../../core/utils/Disposer";



/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

//@todo: sequenced?

/**
 * Defines a [[DataItem]] for [[PieSeries]].
 *
 * @see {@link DataItem}
 */
export class PieSeriesDataItem extends PercentSeriesDataItem {

	/**
	 * A type of slice used for this series.
	 *
	 * @type {Slice}
	 */
	public _slice: Slice;

	/**
	 * A reference to a slice label element.
	 * @ignore Exclude from docs
	 * @type {AxisLabelCircular}
	 */
	public _label: AxisLabelCircular;

	/**
	 * A reference to a slice tick element.
	 * @ignore Exclude from docs
	 * @type {PieTick}
	 */
	public _tick: PieTick;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 *
	 * @type {PieSeries}
	 */
	public _component!: PieSeries;


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PieSeriesDataItem";

		this.values.radiusValue = {};

		this.applyTheme();
	}

	/**
	 * Slice's radius, if other than default.
	 *
	 * @param {number}  value  Radius
	 */
	public set radiusValue(value: number) {
		this.setValue("radiusValue", value);
	}

	/**
	 * @return {number} Radius
	 */
	public get radiusValue(): number {
		return this.values.radiusValue.value;
	}

	/**
	 * Hide the data item (and corresponding visual elements).
	 *
	 * @param {number}    duration  Duration (ms)
	 * @param {number}    delay     Delay hiding (ms)
	 * @param {number}    toValue   Target value for animation
	 * @param {string[]}  fields    Fields to animate while hiding
	 */
	public hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): Animation {
		return super.hide(duration, delay, 0, ["value", "radiusValue"]);
	}

	/**
	 * Show hidden data item (and corresponding cisual elements).
	 *
	 * @param {number}    duration  Duration (ms)
	 * @param {number}    delay     Delay hiding (ms)
	 * @param {string[]}  fields    Fields to animate while hiding
	 */
	public show(duration?: number, delay?: number, fields?: string[]): Animation {
		return super.show(duration, delay, ["value", "radiusValue"]);
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[PieSeries]].
 */
export interface IPieSeriesDataFields extends IPercentSeriesDataFields {

	/**
	 * Name of the field in data that holds item's radius value.
	 *
	 * @type {string}
	 */
	radiusValue?: string;

}

/**
 * Defines properties for [[PieSeries]].
 */
export interface IPieSeriesProperties extends IPercentSeriesProperties {

	/**
	 * Outer radius for the series' slices in pixels.
	 *
	 * @ignore Exclude from docs
	 * @type {number | Percent}
	 */
	radius?: number | Percent;

	/**
	 * Inner radius for the series' slices in pixels.
	 *
	 * @ignore Exclude from docs
	 * @type {number | Percent}
	 */
	innerRadius?: number | Percent;

	/**
	 * Start angle for the series' slices in degrees. (0-360)
	 *
	 * @ignore Exclude from docs
	 * @todo Redo so that users can set it
	 * @type {number}
	 */
	startAngle?: number;

	/**
	 * End angle for the series' slices in degrees. (0-360)
	 *
	 * @ignore Exclude from docs
	 * @todo Redo so that users can set it
	 * @type {number}
	 */
	endAngle?: number;
}

/**
 * Defines events for [[PieSeries]].
 */
export interface IPieSeriesEvents extends IPercentSeriesEvents { }

/**
 * Defines adapters for [[PieSeries]].
 *
 * @see {@link Adapter}
 */
export interface IPieSeriesAdapters extends IPercentSeriesAdapters, IPieSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a slice series on a Pie chart.
 *
 * @see {@link IPieSeriesEvents} for a list of available Events
 * @see {@link IPieSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class PieSeries extends PercentSeries {

	public _slice: Slice;

	public _tick: PieTick;

	public _label: AxisLabelCircular;

	public _chart: PieChart;

	/**
	 * Defines the type of data fields used for the series.
	 *
	 * @type {IPieSeriesDataFields}
	 */
	public _dataFields: IPieSeriesDataFields;

	/**
	 * Defines available properties.
	 *
	 * @type {IPieSeriesProperties}
	 */
	public _properties!: IPieSeriesProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IPieSeriesAdapters}
	 */
	public _adapter!: IPieSeriesAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IPieSeriesEvents}
	 */
	public _events!: IPieSeriesEvents;

	/**
	 * Defines the type of data item.
	 *
	 * @type {PieSeriesDataItem}
	 */
	public _dataItem: PieSeriesDataItem;

	/**
	 * Holds current angle for the next slice to start on.
	 *
	 * @type {number}
	 */
	protected _currentStartAngle: number;

	/**
	 * Data items that fall to the left side of the pie.
	 */
	protected _leftItems: this["_dataItem"][];

	/**
	 * Data items that fall to the right side of the pie.
	 */
	protected _rightItems: this["_dataItem"][];

	/**
	 * [_arcRect description]
	 *
	 * @todo Description
	 * @type {IRectangle}
	 */
	protected _arcRect: IRectangle;

	/**
	 * [_maxRadiusPercent description]
	 *
	 * @todo Description
	 * @type {number}
	 */
	protected _maxRadiusPercent: number;

	/**
	 * [_pixelRadius description]
	 *
	 * @ignore this is set by pie chart, not by user
	 * @type {number}
	 */
	protected _pixelRadius: number;

	/**
	 * [_pixelInnerRadius description]
	 *
	 * @ignore this is set by pie chart, not by user
	 * @type {number}
	 */
	protected _pixelInnerRadius: number;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "PieSeries";

		this.alignLabels = true;
		this.startAngle = -90;
		this.endAngle = 270;

		this.labels.template.radius = percent(5);

		this.applyTheme();
	}

	/** 
	 * creates slice
	 */
	protected createSlice(): this["_slice"] {
		return new Slice();
	}

	/** 
	 * creates tick
	 */
	protected createTick(): this["_tick"] {
		return new PieTick();
	}

	/** 
	 * creates label
	 */
	protected createLabel(): this["_label"] {
		return new AxisLabelCircular();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Pie Slice Series");
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return {PieSeriesDataItem} Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new PieSeriesDataItem();
	}

	/**
	 * Inits slice.
	 *
	 * @param  {Slice} slice to init
	 */
	protected initSlice(slice: this["_slice"]) {
		slice.isMeasured = false;
		slice.defaultState.properties.scale = 1;
		slice.observe("scale", this.handleSliceScale, this);
		slice.observe(["dx", "dy", "x", "y", "shiftRadius"], this.handleSliceMove, this);
		slice.tooltipText = "{category}: {value.percent.formatNumber('#.#')}% ({value.value})";

		let hoverState = slice.states.create("hover");
		hoverState.properties.scale = 1.05;

		let defaultState = slice.defaultState;
		defaultState.properties.shiftRadius = 0;

		slice.togglable = true;

		slice.events.on("toggled", (event) => {
			event.target.hideTooltip();
		});

		let activeState = slice.states.create("active");
		activeState.properties.shiftRadius = 0.10;
	}

	/**
	 * (Re)validates the whole series, effectively causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		this._leftItems = [];
		this._rightItems = [];

		this._currentStartAngle = this.startAngle;
		this._arcRect = $math.getArcRect(this.startAngle, this.endAngle);

		this._maxRadiusPercent = 0;
		for (let i = this.startIndex; i < this.endIndex; i++) {
			let dataItem = this.dataItems.getIndex(i);
			let radiusValuePercent = dataItem.values.radiusValue.percent;
			if (radiusValuePercent > this._maxRadiusPercent) {
				this._maxRadiusPercent = radiusValuePercent;
			}
		}

		super.validate();

		if (this.alignLabels) {
			if (this.startAngle > this.endAngle) {
				this._rightItems.reverse();
			}
			else {
				this._leftItems.reverse()
			}


			this._rightItems.sort((a, b) => {
				let aAngle = (a.slice.middleAngle + 360) % 360;
				let bAngle = (b.slice.middleAngle + 360) % 360;

				if (aAngle > 270) {
					aAngle -= 360;
				}

				if (bAngle > 270) {
					bAngle -= 360;
				}

				if (aAngle < bAngle) {
					return -1;
				}
				else {
					return 1;
				}
			})

			this._leftItems.sort((a, b) => {

				let aAngle = (a.slice.middleAngle + 360) % 360;
				let bAngle = (b.slice.middleAngle + 360) % 360;

				if (aAngle < bAngle) {
					return 1;
				}
				else {
					return -1;
				}
			})

			this.arrangeLabels(this._rightItems);
			this.arrangeLabels(this._leftItems);
		}
	}

	/**
	 * Validates data item's element, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 * @param {PieSeriesDataItem}  dataItem  Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {
		if (this.pixelRadius > 0) {

			let percent = dataItem.values.value.percent;

			// SLICE
			let slice: Slice = dataItem.slice;
			slice.radius = this.pixelRadius;

			if ($type.isNumber(dataItem.radiusValue)) {
				slice.radius = this.pixelInnerRadius + (this.pixelRadius - this.pixelInnerRadius) * dataItem.values.radiusValue.percent / this._maxRadiusPercent;
			}
			if (!(slice.innerRadius instanceof Percent)) {
				slice.innerRadius = this.pixelInnerRadius;
			}
			slice.startAngle = this._currentStartAngle;

			slice.arc = dataItem.values.value.percent * (this.endAngle - this.startAngle) / 100;

			// LABEL
			let label = dataItem.label;

			let tick = dataItem.tick;
			tick.slice = slice;
			tick.label = label;

			let normalizedMiddleAngle: number = (slice.middleAngle + 360) % 360; // force angle to be 0 - 360;

			let point: IPoint;

			if (this.alignLabels) {
				let labelRadius = label.pixelRadius(slice.radius);
				let x: number = tick.length + labelRadius;
				label.dx = 0;
				label.dy = 0;
				label.verticalCenter = "middle";
				let arcRect = this._arcRect;
				// right half
				if (normalizedMiddleAngle >= 270 || normalizedMiddleAngle <= 90) { // 91 makes less chances for flickering
					x += (arcRect.width + arcRect.x) * this.pixelRadius;
					label.horizontalCenter = "left";
					this._rightItems.push(dataItem);
				}
				// left half
				else {
					x -= arcRect.x * this.pixelRadius;
					label.horizontalCenter = "right";
					this._leftItems.push(dataItem);
					x *= -1;
				}

				let distance = slice.radius + tick.length + labelRadius;
				point = { x: x, y: slice.iy * distance };
			}
			else {
				label.horizontalCenter = undefined;
				label.verticalCenter = undefined;
				let x: number = slice.ix * slice.radius;
				let y: number = slice.iy * slice.radiusY;

				point = label.fixPoint({ x: x, y: y }, slice.radius, slice.radiusY);
			}

			label.moveTo(point);
			this._currentStartAngle += slice.arc;

			// do this at the end, otherwise bullets won't be positioned properly
			super.validateDataElement(dataItem);
		}
	}

	/**
	 * Outer radius for the series' slices in pixels or [[Percent]].
	 *
	 * @param {number | Percent}  value  Radius
	 */
	public set radius(value: number | Percent) {
		if (this.setPercentProperty("radius", value, true, false, 10, false)) {
			this.invalidateDataItems();
		}
	}

	/**
	 * @return {number | Percent} Radius
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * @return {number} Radius
	 * @ignore
	 */
	public get pixelRadius(): number {
		return this._pixelRadius;
	}

	/**
	 * @ignore
	 */
	public set pixelRadius(value: number) {
		if (this._pixelRadius != value) {
			this._pixelRadius = value;
			this.invalidateDataItems();
		}
	}

	/**
	 * @return {number} Pixel inner radius
	 * @ignore
	 */
	public get pixelInnerRadius(): number {
		return this._pixelInnerRadius;
	}

	/**
	 * @ignore
	 */
	public set pixelInnerRadius(value: number) {
		if (this._pixelInnerRadius != value) {
			this._pixelInnerRadius = value;
			this.invalidateDataItems();
		}
	}

	/**
	 * Inner radius for the series' slices in pixels.
	 *
	 * @ignore Exclude from docs
	 * @todo Redo so that users can set it
	 * @param {number | Percent}  value  Radius
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, true, false, 10, false);
	}

	/**
	 * @ignore Exclude from docs
	 * @return {number | Percent} Radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Start angle for the series' slices in degrees. (0-360)
	 *
	 * @ignore Exclude from docs
	 * @todo Redo so that users can set it
	 * @param {number}  value  Angle
	 */
	public set startAngle(value: number) {
		this.setPropertyValue("startAngle", $math.normalizeAngle(value), true);
	}

	/**
	 * @ignore Exclude from docs
	 * @return {number} Angle
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

	/**
	 * End angle for the series' slices in degrees. (0-360)
	 *
	 * @ignore Exclude from docs
	 * @todo Redo so that users can set it
	 * @param {number}  value  Angle
	 */
	public set endAngle(value: number) {
		this.setPropertyValue("endAngle", value, true);
	}

	/**
	 * @ignore Exclude from docs
	 * @return {number} Angle
	 */
	public get endAngle(): number {
		return this.getPropertyValue("endAngle");
	}


	/**
	 * Positions series bullet.
	 *
	 * @ignore Exclude from docs
	 * @param {Bullet}  bullet  Bullet
	 */
	public positionBullet(bullet: Bullet): void {
		super.positionBullet(bullet);

		let dataItem: this["_dataItem"] = <this["_dataItem"]>bullet.dataItem;
		let slice: Slice = dataItem.slice;

		let locationX = bullet.locationX;
		if (!$type.isNumber(locationX)) {
			locationX = 0.5;
		}
		let locationY = bullet.locationY;
		if (!$type.isNumber(locationY)) {
			locationY = 1;
		}

		let angle = slice.startAngle + slice.arc * locationX;
		let radius = locationY * slice.radius;

		bullet.x = radius * $math.cos(angle);
		bullet.y = radius * $math.sin(angle);
	}


	/**
	 * Repositions bullet and labels when slice moves.
	 *
	 * @ignore Exclude from docs
	 * @param {AMEvent<Slice, ISpriteEvents>["propertychanged"]}  event  Event
	 */
	protected handleSliceMove(event: AMEvent<this["_slice"], ISpriteEvents>["propertychanged"]): void {
		if (!this.alignLabels) {

			let slice = event.target;
			let dataItem: this["_dataItem"] = <this["_dataItem"]>slice.dataItem;
			// moving textelement, as label dx and dy are already employed for aligning
			//@labeltodo
			if (dataItem) {
				let label = dataItem.label;
				if (label) {
					label.dx = label.fdx + slice.dx + slice.pixelX;
					label.dy = label.fdy + slice.dy + slice.pixelY;
				}
			}
		}
	}


	/**
	 * Returns bounding box (square) for this element.
	 *
	 * @ignore Exclude from docs
	 * @type {IRectangle}
	 */
	public get bbox(): IRectangle {
		if (this.definedBBox) {
			return this.definedBBox;
		}
		let chart = this.chart;
		if (chart) {
			return $math.getArcRect(chart.startAngle, chart.endAngle, this.pixelRadius);
		}

		return $math.getArcRect(this.startAngle, this.endAngle, this.pixelRadius);
	}
}

/**
 * bboxter class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PieSeries"] = PieSeries;
registry.registeredClasses["PieSeriesDataItem"] = PieSeriesDataItem;
