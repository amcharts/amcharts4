/**
 * Defines Funnel Chart Series.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IPercentSeriesAdapters, IPercentSeriesDataFields, IPercentSeriesEvents, IPercentSeriesProperties, PercentSeries, PercentSeriesDataItem } from "./PercentSeries";
import { FunnelSlice } from "../elements/FunnelSlice";
import { Label } from "../../core/elements/Label";
import { FunnelTick } from "../elements/FunnelTick";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { Animation } from "../../core/utils/Animation";
import { Bullet } from "../elements/Bullet";
import { registry } from "../../core/Registry";
import { SlicedChart } from "../types/SlicedChart";
import * as $math from "../../core/utils/Math";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import { percent } from "../../core/utils/Percent";
import { Disposer } from "../../core/utils/Disposer";
import { Orientation } from "../../core/defs/Orientation";
import { Align } from "../../core/defs/Align";
import { VerticalAlign } from "../../core/defs/VerticalAlign";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

//@todo: sequenced?

/**
 * Defines a [[DataItem]] for [[FunnelSeries]].
 *
 * @see {@link DataItem}
 */
export class FunnelSeriesDataItem extends PercentSeriesDataItem {

	/**
	 * A type of slice used for this series.
	 */
	public _slice: FunnelSlice;

	/**
	 * A reference to a label element.
	 */
	public _label: Label;

	/**
	 * A reference to a tick element.
	 */
	public _tick: FunnelTick;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: FunnelSeries;

	/**
	 * Defines a type of elements linking slices.
	 */
	public _sliceLink: FunnelSlice;

	/**
	 * A [[FunnelSlice]] element, related to this data item ([[FunnelSlice]]).
	 *
	 * @readonly
	 * @return Slice element
	 */
	public get sliceLink(): this["_sliceLink"] {
		if (!this._sliceLink) {
			let sliceLink = this.component.sliceLinks.create();
			this._sliceLink = sliceLink;
			this._disposers.push(sliceLink);
			sliceLink.parent = this.component.slicesContainer;

			this._disposers.push(new Disposer(() => {
				if (this.component) {
					this.component.sliceLinks.removeValue(sliceLink);
				}
			}));

			this.addSprite(sliceLink);
			sliceLink.visible = this.visible;
		}
		return this._sliceLink;
	}


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "FunnelSeriesDataItem";
		// this helps to invalidate series when value is 0 an it is hidden (no other events are triggered then)
		this.events.on("visibilitychanged", () => {
			if (this.component) {
				this.component.invalidateDataItems();
			}
		}, this, false);

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
 * Defines data fields for [[FunnelSeries]].
 */
export interface IFunnelSeriesDataFields extends IPercentSeriesDataFields { }

/**
 * Defines properties for [[FunnelSeries]].
 */
export interface IFunnelSeriesProperties extends IPercentSeriesProperties {

	/**
	 * Relative width of the slice bottom. See description of `bottomRatio`
	 * property for full description.
	 *
	 * @default 0
	 */
	bottomRatio?: number;

	/**
	 * Orientation of series
	 *
	 * @default "vertical"
	 */
	orientation?: Orientation;

	/**
	 * Put labels on the oppsite side of the series?
	 *
	 * @since 4.1.13
	 */
	labelsOpposite?: boolean;
}

/**
 * Defines events for [[FunnelSeries]].
 */
export interface IFunnelSeriesEvents extends IPercentSeriesEvents { }

/**
 * Defines adapters for [[FunnelSeries]].
 *
 * @see {@link Adapter}
 */
export interface IFunnelSeriesAdapters extends IPercentSeriesAdapters, IFunnelSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a FunnelSlice series on a [[SlicedChart]].
 *
 * @see {@link IFunnelSeriesEvents} for a list of available Events
 * @see {@link IFunnelSeriesAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/sliced-chart/} for documentation
 * @important
 */
export class FunnelSeries extends PercentSeries {

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _slice: FunnelSlice;

	/**
	 * Defines available properties.
	 */
	public _tick: FunnelTick;

	/**
	 * Defines available adapters.
	 */
	public _label: Label;

	/**
	 * A reference to chart this series is for.
	 *
	 * @ignore Exclude from docs
	 */
	public _chart: SlicedChart;

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: IFunnelSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IFunnelSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IFunnelSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IFunnelSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: FunnelSeriesDataItem;


	protected _nextY: number = 0;

	/**
	 * List of slice elements.
	 */
	protected _sliceLinks: ListTemplate<this["_slice"]>;

	/**
	 * Holds sum of values for all slices
	 */
	protected _total: number;

	/**
	 * Holds number of slices.
	 */
	protected _count: number;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "FunnelSeries";
		this.orientation = "vertical";

		this.width = percent(100);
		this.height = percent(100);

		this.slicesContainer.width = percent(100);
		this.slicesContainer.height = percent(100);

		this._disposers.push(this.slicesContainer.events.on("maxsizechanged", this.invalidateDataItems, this, false));

		this.labelsOpposite = true;

		this.labelsContainer.layout = "absolute";

		this.bottomRatio = 0;

		this.applyTheme();
	}

	/**
	 * Creates a [[FunnelSlice]] element.
	 *
	 * @return Slice
	 */
	protected createSlice(): this["_slice"] {
		return new FunnelSlice();
	}

	/**
	 * Creates a [[FunnelTick]] element.
	 *
	 * @return Tick
	 */
	protected createTick(): this["_tick"] {
		return new FunnelTick();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Funnel Series");
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new FunnelSeriesDataItem();
	}

	/**
	 * Inits FunnelSlice.
	 *
	 * @param slice to init
	 */
	protected initSlice(slice: this["_slice"]) {
		slice.isMeasured = false;
		slice.defaultState.properties.scale = 1;
		slice.observe("scale", this.handleSliceScale, this);
		slice.observe(["dx", "dy", "x", "y"], this.handleSliceMove, this);
		slice.tooltipText = "{category}: {value.percent.formatNumber('#.#')}% ({value.value})";

		let hoverState = slice.states.create("hover");
		hoverState.properties.expandDistance = 0.2;
	}

	/**
	 * [initLabel description]
	 *
	 * @todo Description
	 * @param label [description]
	 */
	protected initLabel(label: this["_label"]) {
		super.initLabel(label);
		label.verticalCenter = "middle";
		label.horizontalCenter = "middle";
		label.isMeasured = true;
		label.padding(5, 5, 5, 5);
	}

	/**
	 * (Re)validates the whole series, effectively causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		super.validate();
		this._nextY = 0;
	}

	/**
	 * [validateDataElements description]
	 *
	 * @todo Description
	 * @ignore Exclude from docs
	 */
	public validateDataElements() {

		let slicesContainer = this.slicesContainer;
		let labelsContainer = this.labelsContainer;
		let labelTemplate = this.labels.template;

		if (this.alignLabels) {
			labelTemplate.interactionsEnabled = true;
			slicesContainer.isMeasured = true;
			labelsContainer.isMeasured = true;
		}
		else {
			labelTemplate.interactionsEnabled = false;
			slicesContainer.isMeasured = false;
			labelsContainer.isMeasured = false;
		}

		let total = 0;
		let count = 0;
		this.dataItems.each((dItem) => {
			if ($type.hasValue(dItem.value)) {
				count++;
				if (dItem.value > 0) {
					total += Math.abs(dItem.getWorkingValue("value") / dItem.value);
				}
				else {
					if (this.ignoreZeroValues) {
						count--;
					}
					else {
						if (!dItem.visible || dItem.__disabled || dItem.isHiding) {
							count--;
						}
						else {
							total += 1;
						}
					}
				}
			}
		})

		this._total = 1 / count * total;
		this._count = count;

		super.validateDataElements();

		this.arrangeLabels();
	}

	/**
	 * [getNextValue description]
	 *
	 * @todo Description
	 * @param dataItem  [description]
	 * @return [description]
	 */
	protected getNextValue(dataItem: FunnelSeriesDataItem): number {
		let index = dataItem.index;
		let nextValue: number = dataItem.getWorkingValue("value");
		if (index < this.dataItems.length - 1) {
			let nextItem = this.dataItems.getIndex(index + 1);
			nextValue = nextItem.getWorkingValue("value");

			if (!nextItem.visible || nextItem.isHiding || nextItem.__disabled || (nextItem.value == 0 && this.ignoreZeroValues)) {
				return this.getNextValue(nextItem);
			}
		}
		return nextValue;
	}

	/**
	 * [formDataElement description]
	 *
	 * @todo Description
	 */
	protected formDataElement(): void {

	}

	/**
	 * Validates data item's element, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {
		if ($type.hasValue(dataItem.value)) {
			// FunnelSlice
			let slice = dataItem.slice;
			slice.orientation = this.orientation;

			let sliceLink = dataItem.sliceLink;
			sliceLink.orientation = this.orientation;

			let tick = dataItem.tick;
			let label = dataItem.label;

			tick.slice = slice;
			tick.label = label;

			this.decorateSlice(dataItem);

			sliceLink.fill = slice.fill;

			if (dataItem.index == this.dataItems.length - 1) {
				sliceLink.disabled = true;
			}

			// do this at the end, otherwise bullets won't be positioned properly
			super.validateDataElement(dataItem);
		}
	}

	/**
	 * [decorateSlice description]
	 *
	 * @todo Description
	 * @param dataItem [description]
	 */
	protected decorateSlice(dataItem: this["_dataItem"]): void {
		let slice = dataItem.slice;
		let sliceLink = dataItem.sliceLink;
		let label = dataItem.label;
		let tick = dataItem.tick;

		let maxWidth = this.slicesContainer.innerWidth;
		let maxHeight = this.slicesContainer.innerHeight;

		let nextValue = this.getNextValue(dataItem);
		let workingValue = Math.abs(dataItem.getWorkingValue("value"));
		let bottomRatio = this.bottomRatio;

		let d = 1;
		if (dataItem.value != 0) {
			d = workingValue / Math.abs(dataItem.value);
		}
		else {
			if (dataItem.__disabled || dataItem.isHiding || !dataItem.visible) {
				d = 0.000001;
			}
		}

		if (this.ignoreZeroValues && dataItem.value == 0) {
			dataItem.__disabled = true;
			return;
		}
		else {
			dataItem.__disabled = false;
		}

		if (this._nextY == Infinity) {
			this._nextY = 0;
		}

		if (this.orientation == "vertical") {

			let linkHeight = sliceLink.pixelHeight * d;

			maxHeight = maxHeight + linkHeight; // to avoid one link gap in the bottom

			slice.topWidth = workingValue / this.dataItem.values.value.high * maxWidth;
			slice.bottomWidth = (workingValue - (workingValue - nextValue) * bottomRatio) / this.dataItem.values.value.high * maxWidth;

			sliceLink.topWidth = slice.bottomWidth;
			sliceLink.bottomWidth = (workingValue - (workingValue - nextValue)) / this.dataItem.values.value.high * maxWidth;

			slice.y = this._nextY;
			slice.height = Math.min(100000, $math.max(0, maxHeight / this._count * d / this._total - linkHeight));

			slice.x = maxWidth / 2;

			if (!this.alignLabels) {
				label.x = slice.x;
			}
			else {
				label.x = undefined;
			}
			label.y = slice.pixelY + slice.pixelHeight * tick.locationY;

			this._nextY += slice.pixelHeight + linkHeight;
			sliceLink.y = this._nextY - linkHeight;
			sliceLink.x = slice.x;
		}
		else {
			let linkWidth = sliceLink.pixelWidth * d;

			maxWidth = maxWidth + linkWidth; // to avoid one link gap in the bottom

			slice.topWidth = workingValue / this.dataItem.values.value.high * maxHeight;
			slice.bottomWidth = (workingValue - (workingValue - nextValue) * bottomRatio) / this.dataItem.values.value.high * maxHeight;

			sliceLink.topWidth = slice.bottomWidth;
			sliceLink.bottomWidth = (workingValue - (workingValue - nextValue)) / this.dataItem.values.value.high * maxHeight;

			slice.x = this._nextY;
			slice.width = Math.min(100000, maxWidth / this._count * d * 1 / this._total - linkWidth);
			slice.y = maxHeight / 2;

			if (!this.alignLabels) {
				label.y = slice.y;
			}
			else {
				label.y = this.labelsContainer.measuredHeight;
			}
			label.x = slice.pixelX + slice.pixelWidth * tick.locationX;

			this._nextY += slice.pixelWidth + linkWidth;
			sliceLink.x = this._nextY - linkWidth;

			sliceLink.y = slice.y;
		}
	}

	protected getLastLabel(index: number):Label {
		if (index > 0) {
			let lastLabel = this.labels.getIndex(index);
			if (lastLabel.__disabled || !lastLabel.visible) {
				return this.getLastLabel(index - 1);
			}
			else {
				return lastLabel;
			}
		}
	}

	/**
	 * [arrangeLabels description]
	 *
	 * @todo Description
	 */
	protected arrangeLabels(): void {

		if (this.alignLabels) {
			let count = this.labels.length;
			if (count > 1) {

				let lastLabel = this.getLastLabel(count - 1);
				if (lastLabel) {

					let lastY = lastLabel.pixelY;
					let lastX = lastLabel.pixelX;

					if (count > 1) {
						for (let i = count - 2; i >= 0; i--) {
							let label = this.labels.getIndex(i);

							if (label.visible && !label.__disabled) {
								if (label.invalid) {
									label.validate();
								}
								if (this.orientation == "vertical") {
									if (label.pixelY + label.measuredHeight > lastY) {
										label.y = Math.min(1000000, lastY - label.measuredHeight);
									}
								}
								// horizontal
								else {
									if (label.pixelX + label.measuredWidth > lastX) {
										label.x = Math.min(1000000, lastX - label.measuredWidth);
									}
								}
								lastY = label.pixelY;
								lastX = label.pixelX;
							}
						}

						lastY = 0;
						lastX = 0;
						for (let i = 0; i < count; i++) {
							let label = this.labels.getIndex(i);
							if (label.visible && !label.__disabled) {
								if (label.invalid) {
									label.validate();
								}
								if (this.orientation == "vertical") {
									if (label.pixelY < lastY) {
										label.y = Math.min(1000000, lastY);
									}
								}
								// horizontal
								else {
									if (label.pixelX < lastX) {
										label.x = Math.min(1000000, lastX);
									}
								}

								lastY += label.measuredHeight;
								lastX += label.measuredWidth;
							}
						}
					}
				}
			}
		}
	}

	/**
	 * Positions series bullet.
	 *
	 * @ignore Exclude from docs
	 * @param bullet  Bullet
	 */
	public positionBullet(bullet: Bullet): void {
		super.positionBullet(bullet);

		let dataItem: this["_dataItem"] = <this["_dataItem"]>bullet.dataItem;
		let slice: FunnelSlice = dataItem.slice;

		let locationX = bullet.locationX;
		if (!$type.isNumber(locationX)) {
			locationX = 0.5;
		}
		let locationY = bullet.locationY;
		if (!$type.isNumber(locationY)) {
			locationY = 1;
		}

		bullet.x = slice.pixelX + slice.measuredWidth * locationX;
		bullet.y = slice.pixelY + slice.measuredHeight * locationY;
	}

	/**
	 * Orientation of the funnel slices: "horizontal" or "vertical" (default).
	 *
	 * @default "vertical"
	 * @param value Orientation
	 */
	public set orientation(value: Orientation) {
		if (this.setPropertyValue("orientation", value)) {
			this.labelsOpposite = this.labelsOpposite;
			this.invalidate();
			if (value == "vertical") {
				this.ticks.template.locationX = 1;
				this.ticks.template.locationY = 0.5;
				this.labels.template.rotation = 0;
				this.layout = "horizontal";
			}
			else {
				this.ticks.template.locationX = 0.5;
				this.ticks.template.locationY = 1;
				this.labels.template.rotation = -90;
				this.layout = "vertical";
			}
		}
	}

	/**
	 * @return Orientation
	 */
	public get orientation(): Orientation {
		return this.getPropertyValue("orientation");
	}

	/**
	 * Indicates how slice's bottom will change in relation to slices top AND
	 * next slices top.
	 *
	 * Basically it's a relative value (0-1) that indicates bottom width
	 * position between current slice's top width and the top withd of the next
	 * one.
	 *
	 * The scale goes from 0 (closer to current slice width) to 1 (closer to next
	 * slice with).
	 *
	 * `0` (default) will mean that bottom will be the same as top, resulting in
	 * a prefectly square slice.
	 *
	 * From the data-viz standpoint `0` is a correct setting, since area of the
	 * slices will depict their value correctly.
	 *
	 * `1` will mean that slice will become trapezoid with its bottom matching
	 * width of the next slice.
	 *
	 * `0.5` will make bottom width be in the middle of width of current slice
	 * and the next slice.
	 *
	 * @default 0
	 * @param {number}
	 */
	public set bottomRatio(value: number) {
		if (this.setPropertyValue("bottomRatio", value)) {
			this.invalidate();
		}
	}

	/**
	 * @return {number}
	 */
	public get bottomRatio(): number {
		return this.getPropertyValue("bottomRatio");
	}

	/**
	 * A list of elements linking each actual slice.
	 *
	 * Please note that links are [[FunnelSlice]] objects, just like real links,
	 * so they have all the same configuration options.
	 *
	 * You can use `template` of this link, to specify how links will look.
	 *
	 * ```TypeScript
	 * series.sliceLinks.template.fillOpacity = 0.5;
	 * ```
	 * ```JavaScript
	 * series.sliceLinks.template.fillOpacity = 0.5;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     "type": "FunnelSeries",
	 *      // ...
	 *      "sliceLinks": {
	 *        "fillOpacity": 0.5
	 *      }
	 *   }]
	 * }
	 * ```
	 *
	 * @return Funnel links
	 */
	public get sliceLinks(): ListTemplate<this["_slice"]> {
		if (!this._sliceLinks) {
			let sliceLink = new FunnelSlice();
			sliceLink.applyOnClones = true;
			sliceLink.fillOpacity = 0.5;
			sliceLink.expandDistance = - 0.3;
			sliceLink.hiddenState.properties.opacity = 0;

			this._disposers.push(sliceLink);

			this._sliceLinks = new ListTemplate(sliceLink);
			this._disposers.push(new ListDisposer(this._sliceLinks));
		}
		return this._sliceLinks;
	}

	/**
	 * Shows hidden series.
	 *
	 * @param duration  Duration of reveal animation (ms)
	 * @return Animation
	 */
	public show(duration?: number): Animation {

		let startIndex: number = this.startIndex;
		let endIndex: number = this.endIndex;

		let interpolationDuration = this.defaultState.transitionDuration;

		if ($type.isNumber(duration)) {
			interpolationDuration = duration;
		}

		let delay: number = 0;
		$iter.each($iter.indexed(this.dataItems.iterator()), (a) => {
			let i = a[0];
			let dataItem = a[1];

			if (this.sequencedInterpolation) {
				delay = this.sequencedInterpolationDelay * i + interpolationDuration * (i - startIndex) / (endIndex - startIndex);
			}
			dataItem.show(interpolationDuration, delay, ["value"]);
		});

		let animation = super.show(duration);

		return animation;
	}

	/**
	 * Hides series.
	 *
	 * @param duration  Duration of hiding animation (ms)
	 * @return Animation
	 */
	public hide(duration?: number): Animation {
		let fields: string[] = ["value"];
		let value: number = 0;

		let startIndex: number = this.startIndex;
		let endIndex: number = this.endIndex;

		let delay: number = 0;
		let interpolationDuration = this.hiddenState.transitionDuration;
		if ($type.isNumber(duration)) {
			interpolationDuration = duration;
		}

		$iter.each($iter.indexed(this.dataItems.iterator()), (a) => {
			let i = a[0];
			let dataItem = a[1];

			if (this.sequencedInterpolation) {
				delay = this.sequencedInterpolationDelay * i + interpolationDuration * (i - startIndex) / (endIndex - startIndex);
			}
			dataItem.hide(interpolationDuration, delay, value, fields);
		});

		let animation: Animation = super.hide(duration);
		if (animation && !animation.isFinished()) {
			animation.delay(delay);
		}

		return animation;
	}

	/**
	 * @ignore
	 */
	protected setAlignLabels(value: boolean) {
		super.setAlignLabels(value);
		this.ticks.template.disabled = !value;
		let labelsContainer = this.labelsContainer;
		if (labelsContainer) {
			// do not align
			if (!value) {
				labelsContainer.width = percent(100);
				labelsContainer.height = percent(100);
			}
			//align
			else {
				labelsContainer.height = undefined;
				labelsContainer.width = undefined;
				labelsContainer.margin(10, 10, 10, 10);
			}
		}
		this.labelsOpposite = this.labelsOpposite;
	}

	/**
	 * Put labels on the oppsite side of the series?
	 *
	 * This setting is only used if `alignLabels = true`.
	 *
	 * If set to `true` (default) labels will be drawn to the right (on vertical
	 * series), or to the bottom (on horizontal series).
	 *
	 * If set to `false`, labels will be positioned to the left or top
	 * respectively.
	 *
	 * @default true
	 * @since 4.1.13
	 * @param  value  Labels on opposite side?
	 */
	public set labelsOpposite(value: boolean) {
		this.setPropertyValue("labelsOpposite", value)
		let labelTemplate = this.labels.template;

		let labelAlign: Align = "none";
		let labelValign: VerticalAlign = "none";

		if (!this.alignLabels) {
			if (this.orientation == "vertical") {
				labelAlign = "center";
			}
			else {
				labelValign = "middle";
			}
		}
		else {
			// opposite (left/bottom)
			if (value) {
				this.labelsContainer.toFront();
				// left
				if (this.orientation == "vertical") {
					this.ticks.template.locationX = 1;
					labelTemplate.horizontalCenter = "left";
					labelAlign = "right";
				}
				// bottom
				else {
					this.ticks.template.locationY = 1;
					labelTemplate.horizontalCenter = "right";
					labelValign = "bottom";
				}
			}
			// non oposite (right/top)
			else {
				this.labelsContainer.toBack();
				// right
				if (this.orientation == "vertical") {
					this.ticks.template.locationX = 0;
					labelAlign = "left";
				}
				// top
				else {
					labelValign = "top";
					this.ticks.template.locationY = 0;
				}
			}
		}

		labelTemplate.align = labelAlign;
		labelTemplate.valign = labelValign;

		this.validateLayout();
		this.ticks.each((tick) => {
			tick.invalidate();
		})
		this.invalidateDataItems();
	}

	/**
	 * @return Labels on opposite side?
	 */
	public get labelsOpposite(): boolean {
		return this.getPropertyValue("labelsOpposite");
	}
}

/**
 * bboxter class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FunnelSeries"] = FunnelSeries;
registry.registeredClasses["FunnelSeriesDataItem"] = FunnelSeriesDataItem;
