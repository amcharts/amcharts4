/**
 * Defines Percent Chart Series.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Series, SeriesDataItem, ISeriesProperties, ISeriesDataFields, ISeriesAdapters, ISeriesEvents } from "./Series";
import { ISpriteEvents, AMEvent } from "../../core/Sprite";
import { Sprite } from "../../core/Sprite";
import { Label } from "../../core/elements/Label";
import { Color } from "../../core/utils/Color";
import { Tick } from "../elements/Tick";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { Container } from "../../core/Container";
import { Animation } from "../../core/utils/Animation";
import { LegendDataItem, LegendSettings } from "../../charts/Legend";
import { ColorSet } from "../../core/utils/ColorSet";
import { PatternSet } from "../../core/utils/PatternSet";
import { registry } from "../../core/Registry";
import { PercentChart } from "../types/PercentChart";
import * as $iter from "../../core/utils/Iterator";
import * as $ease from "../../core/utils/Ease";
import * as $type from "../../core/utils/Type";
import { Disposer } from "../../core/utils/Disposer";
import { defaultRules, ResponsiveBreakpoints } from "../../core/utils/Responsive";



/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

//@todo: sequenced?

/**
 * Defines a [[DataItem]] for [[PercentSeries]].
 *
 * @see {@link DataItem}
 */
export class PercentSeriesDataItem extends SeriesDataItem {

	/**
	 * A type of slice used for this series.
	 */
	public _slice: Sprite;

	/**
	 * A reference to a slice label element.
	 *
	 * @ignore Exclude from docs
	 */
	public _label: Label;

	/**
	 * A reference to a slice tick element.
	 * @ignore Exclude from docs
	 */
	public _tick: Tick;

	/**
	 * A reference to a corresponding legend data item.
	 */
	protected _legendDataItem: LegendDataItem;

	/**
	 * Custom settings for the legend item.
	 * Not used, only added to sattisfy LegendDataItem
	 *
	 * @ignore
	 */
	public legendSettings: LegendSettings;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: PercentSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PercentSeriesDataItem";

		this.applyTheme();
	}


	/**
	 * Adds an `id` attribute the the slice element and returns its id.
	 *
	 * @ignore Exclude from docs
	 */
	public uidAttr(): string {
		return this.slice.uidAttr();
	}

	/**
	 * Hide the data item (and corresponding visual elements).
	 *
	 * @param duration  Duration (ms)
	 * @param delay     Delay hiding (ms)
	 * @param toValue   Target value for animation
	 * @param fields    Fields to animate while hiding
	 */
	public hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): $type.Optional<Animation> {
		if (!fields) {
			fields = ["value"];
		}
		return super.hide(duration, delay, 0, fields);
	}

	/**
	 * Sets visibility of the Data Item.
	 *
	 * @param value Data Item
	 */
	public setVisibility(value: boolean, noChangeValues?: boolean): void {
		if (!noChangeValues) {
			if (value) {
				this.setWorkingValue("value", this.values["value"].value, 0, 0);
			}
			else {
				this.setWorkingValue("value", 0, 0, 0);
			}
		}

		super.setVisibility(value, noChangeValues);
	}

	/**
	 * Show hidden data item (and corresponding cisual elements).
	 *
	 * @param duration  Duration (ms)
	 * @param delay     Delay hiding (ms)
	 * @param fields    Fields to animate while hiding
	 */
	public show(duration?: number, delay?: number, fields?: string[]): $type.Optional<Animation> {
		if (!fields) {
			fields = ["value"];
		}
		return super.show(duration, delay, fields);
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
		return this.properties.category;
	}


	/**
	 * Creates a marker used in the legend for this slice.
	 *
	 * @ignore Exclude from docs
	 * @param marker  Marker container
	 */
	public createLegendMarker(marker: Container) {
		this.component.createLegendMarker(marker, this);
	}

	/**
	 * A legend's data item, that corresponds to this data item.
	 *
	 * @param value  Legend data item
	 */
	public set legendDataItem(value: LegendDataItem) {
		this._legendDataItem = value;
		if (value.label) {
			value.label.dataItem = this;
		}
		if (value.valueLabel) {
			value.valueLabel.dataItem = this;
		}
	}

	/**
	 * @return Legend data item
	 */
	public get legendDataItem(): LegendDataItem {
		return this._legendDataItem;
	}

	/**
	 * A Tick element, related to this data item. (slice)
	 *
	 * @readonly
	 * @return Tick element
	 */
	public get tick(): this["_tick"] {
		if (!this._tick) {
			let tick = this.component.ticks.create();
			this._tick = tick;
			this.addSprite(tick);
			this._disposers.push(tick);
			tick.parent = this.component.ticksContainer;

			this._disposers.push(new Disposer(() => {
				if (this.component) {
					this.component.ticks.removeValue(tick);
				}
			}));


			tick.visible = this.visible;
		}
		return this._tick;
	}

	/**
	 * A Label element, related to this data item. (slice)
	 *
	 * @readonly
	 * @return Label element
	 */
	public get label(): this["_label"] {
		if (!this._label) {
			let label = this.component.labels.create();
			this.addSprite(label);
			this._label = label;

			this._disposers.push(label);
			label.parent = this.component.labelsContainer;

			this._disposers.push(new Disposer(() => {
				if (this.component) {
					this.component.labels.removeValue(label);
				}
			}));

			label.visible = this.visible;
		}
		return this._label;
	}

	/**
	 * An element, related to this data item. (slice)
	 *
	 * @readonly
	 * @return Slice element
	 */
	public get slice(): this["_slice"] {
		if (!this._slice) {

			let component = this.component;

			let slice = component.slices.create();
			this.addSprite(slice);

			this._slice = slice;
			this._disposers.push(slice);
			slice.parent = component.slicesContainer;

			this._disposers.push(new Disposer(() => {
				component.slices.removeValue(slice);
			}));


			slice.visible = this.visible;

			// Apply accessibility
			if (component.itemsFocusable()) {
				this.component.role = "menu";
				slice.role = "menuitem";
				slice.focusable = true;
			}
			else {
				this.component.role = "list";
				slice.role = "listitem";
				slice.focusable = false;
			}

			// Apply screen reader label
			if (slice.focusable) {
				slice.events.on("focus", (ev) => {
					slice.readerTitle = component.populateString(component.itemReaderText, this);
				}, undefined, false);
				slice.events.on("blur", (ev) => {
					slice.readerTitle = "";
				}, undefined, false);
			}
			if (slice.hoverable) {
				slice.events.on("over", (ev) => {
					slice.readerTitle = component.populateString(component.itemReaderText, this);
				}, undefined, false);
				slice.events.on("out", (ev) => {
					slice.readerTitle = "";
				}, undefined, false);
			}
		}
		return this._slice;
	}

	/**
	 * Should dataItem (slice) be hidden in legend?
	 *
	 * @param value Visible in legend?
	 */
	public set hiddenInLegend(value: boolean) {
		this.setProperty("hiddenInLegend", value);
	}

	/**
	 * @return Disabled in legend?
	 */
	public get hiddenInLegend(): boolean {
		return this.properties.hiddenInLegend;
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[PercentSeries]].
 */
export interface IPercentSeriesDataFields extends ISeriesDataFields {

	/**
	 * Name of the field in data that holds category.
	 */
	category?: string;

	/**
	 * Name of the field in data that holds boolean flag if item should be
	 * hidden in legend.
	 */
	hiddenInLegend?: string;
}

/**
 * Defines properties for [[PercentSeries]].
 */
export interface IPercentSeriesProperties extends ISeriesProperties {
	/**
	 * A color set to be used for slices.
	 *
	 * For each new subsequent slice, the chart will assign the next color in
	 * this set.
	 */
	colors?: ColorSet;

	/**
	 * Pattern set to apply to fills.
	 * 
	 * @since 4.7.5
	 */
	patterns?: PatternSet;

	/**
	 * Align labels into nice vertical columns?
	 *
	 * @default true
	 */
	alignLabels?: boolean;

	/**
	 * If set to `true` the chart will not show slices with zero values.
	 * 
	 * @default false
	 * @since 4.7.9
	 */
	ignoreZeroValues?: boolean;

}

/**
 * Defines events for [[PercentSeries]].
 */
export interface IPercentSeriesEvents extends ISeriesEvents { }

/**
 * Defines adapters for [[PercentSeries]].
 *
 * @see {@link Adapter}
 */
export interface IPercentSeriesAdapters extends ISeriesAdapters, IPercentSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[PercentSeries]] which is a base class for [[PieSeries]],
 * [[FunnelSeries]], and [[PyramidSeries]].
 *
 * @see {@link IPercentSeriesEvents} for a list of available Events
 * @see {@link IPercentSeriesAdapters} for a list of available Adapters
 */
export class PercentSeries extends Series {

	/**
	 * Defines type of the slice elements for the series.
	 */
	public _slice: Sprite;

	/**
	 * Defines type of the tick elements for the series.
	 */
	public _tick: Tick;

	/**
	 * Defines type of the label elements for the series.
	 */
	public _label: Label;

	/**
	 * A reference to chart this series is for.
	 *
	 * @ignore Exclude from docs
	 */
	public _chart: PercentChart;

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: IPercentSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IPercentSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPercentSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPercentSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: PercentSeriesDataItem;

	/**
	 * Container slice elements are put in.
	 */
	public slicesContainer: Container;

	/**
	 * Container tick elements are put in.
	 */
	public ticksContainer: Container;

	/**
	 * Container label elements are put in.
	 */
	public labelsContainer: Container;

	/**
	 * List of slice elements.
	 */
	protected _slices: ListTemplate<this["_slice"]>;

	/**
	 * List of tick elements.
	 */
	protected _ticks: ListTemplate<this["_tick"]>;

	/**
	 * List of label elements.
	 */
	protected _labels: ListTemplate<this["_label"]>;


	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "PercentSeries";

		this._addAllDataItems = false;

		this.colors = new ColorSet();
		this.colors.step = 1;
		this.isMeasured = true;
		this.calculatePercent = true;

		let slicesContainer = this.createChild(Container);
		slicesContainer.shouldClone = false;
		slicesContainer.isMeasured = false;
		this.slicesContainer = slicesContainer;

		let ticksContainer = this.createChild(Container);
		ticksContainer.shouldClone = false;
		ticksContainer.isMeasured = false;
		ticksContainer.layout = "none";
		this.ticksContainer = ticksContainer;

		let labelsContainer = this.createChild(Container);
		labelsContainer.shouldClone = false;
		labelsContainer.isMeasured = false;
		labelsContainer.layout = "none";
		this.labelsContainer = labelsContainer;

		this.alignLabels = false;

		this.bulletsContainer.toFront();

		// Make all slices focusable
		this.skipFocusThreshold = 50;

		let defaultState = this.defaultState;
		defaultState.transitionEasing = $ease.sinOut;

		// Accessibility
		this.itemReaderText = "{category}: {value.percent.formatNumber('#.#')}%";

		this.applyTheme();
	}

	/**
	 * Creates a slice element.
	 *
	 * @return Slice
	 */
	protected createSlice(): this["_slice"] {
		return new Sprite();
	}

	/**
	 * Creates a tick element.
	 *
	 * @return Tick
	 */
	protected createTick(): this["_tick"] {
		return new Tick();
	}

	/**
	 * Sreates label element.
	 *
	 * @return label
	 */
	protected createLabel(): this["_label"] {
		return new Label();
	}

	/**
	 * A list of slice elements for the series.
	 *
	 * Use its `template` to configure look and behavior of the slices. E.g.:
	 *
	 * ```TypeScript
	 * series.slices.template.stroke = am4core.color("#fff");
	 * series.slices.template.strokeWidth = 2;
	 * ```
	 * ```JavaScript
	 * series.slices.template.stroke = am4core.color("#fff");
	 * series.slices.template.strokeWidth = 2;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     // ...
	 *     "slices": {
	 *       "stroke": "#fff",
	 *       "strokeWidth": 2
	 *     }
	 *   }]
	 * }
	 * ```
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/list-templates/} for more information about list templates
	 * @return Slices
	 */
	public get slices(): ListTemplate<this["_slice"]> {
		if (!this._slices) {
			let slice = this.createSlice();

			slice.applyOnClones = true;
			this._disposers.push(slice);
			this.initSlice(slice);

			this._slices = new ListTemplate(slice);
			this._disposers.push(new ListDisposer(this._slices));
		}
		return this._slices;
	}

	/**
	 * A list of tick elements for the series. Ticks connect slice to its label.
	 *
	 * Use its `template` to configure look and behavior of the ticks. E.g.:
	 *
	 * ```TypeScript
	 * series.ticks.template.strokeWidth = 2;
	 * ```
	 * ```JavaScript
	 * series.ticks.template.strokeWidth = 2;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     // ...
	 *     "ticks": {
	 *       "strokeWidth": 2
	 *     }
	 *   }]
	 * }
	 * ```
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/list-templates/} for more information about list templates
	 * @return Slices
	 */
	public get ticks(): ListTemplate<this["_tick"]> {
		if (!this._ticks) {
			let tick = this.createTick();
			tick.applyOnClones = true;
			this._disposers.push(tick);
			this.initTick(tick);

			this._ticks = new ListTemplate(tick);
			this._disposers.push(new ListDisposer(this._ticks));
		}
		return this._ticks;
	}

	/**
	 * A list of slice label elements for the series.
	 *
	 * Use its `template` to configure look and behavior of the labels. E.g.:
	 *
	 * ```TypeScript
	 * series.labels.template.fill = am4core.color("#c00");
	 * series.labels.template.fontSize = 20;
	 * ```
	 * ```JavaScript
	 * series.labels.template.fill = am4core.color("#c00");
	 * series.labels.template.fontSize = 20;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     // ...
	 *     "labels": {
	 *       "stroke": "#c00",
	 *       "fontSize": 20
	 *     }
	 *   }]
	 * }
	 * ```
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/list-templates/} for more information about list templates
	 * @return Slices
	 */
	public get labels(): ListTemplate<this["_label"]> {
		if (!this._labels) {
			let label = this.createLabel();
			label.applyOnClones = true;
			this._disposers.push(label);
			this.initLabel(label);

			this._labels = new ListTemplate(label);
			this._disposers.push(new ListDisposer(this._labels));
		}
		return this._labels;
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new PercentSeriesDataItem();
	}

	/**
	 * Creates and returns a new slice element.
	 *
	 * @param sliceType  Type of the slice element
	 * @return Slice
	 */
	protected initSlice(slice: this["_slice"]) {

	}

	protected initLabel(label: this["_label"]) {
		label.text = "{category}: {value.percent.formatNumber('#.0')}%";
		label.isMeasured = false;
		label.padding(5, 5, 5, 5);
	}

	protected initTick(label: this["_tick"]) {

	}

	/**
	 * Validates (processes) data items.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataItems(): void {
		this.colors.reset();
		if (this.patterns) {
			this.patterns.reset();
		}
		super.validateDataItems();
	}

	/**
	 * Validates data item's element, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {

		let slice = dataItem.slice;

		if (slice) {
			if (slice.fill == undefined) {
				if (this.patterns) {
					if (!$type.hasValue(slice.stroke)) {
						slice.stroke = this.colors.next();
					}
					slice.fill = this.patterns.next();
					if ($type.hasValue(slice.fillOpacity)) {
						slice.fill.backgroundOpacity = slice.fillOpacity;
					}
					if (slice.stroke instanceof Color) {
						slice.fill.stroke = slice.stroke;
						slice.fill.fill = slice.stroke;
					}
				}
				else {
					slice.fill = this.colors.next();
				}
			}
			else {
				this.colors.currentStep += this.colors.step;
			}

			if (slice.stroke == undefined) {
				slice.stroke = slice.fill;
			}
		}

		// do this at the end, otherwise bullets won't be positioned properly
		super.validateDataElement(dataItem);

		if (slice) {
			dataItem.bullets.each((key, bullet) => {
				if (bullet.fill == undefined) {
					bullet.fill = slice.fill;
				}
				if (bullet.stroke == undefined) {
					bullet.stroke = slice.stroke;
				}
			})
		}

		this.updateLegendValue(dataItem);
	}

	/**
	 * Validates (processes) data.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {
		super.validateData();
		if (this.chart) {
			this.chart.feedLegend();
		}
	}

	/**
	 * Arranges slice labels according to position settings.
	 *
	 * @ignore Exclude from docs
	 * @param dataItems  Data items
	 */
	protected arrangeLabels(dataItems: this["_dataItem"][]): void {
		for (let i = 0, len = dataItems.length; i < len; i++) {
			let dataItem: this["_dataItem"] = dataItems[i];

			let label = dataItem.label;

			if (label) {

				if (label.invalid) {
					label.validate();
				}
				
				let lh = label.measuredHeight;
				if (!label.visible) {
					lh = 0;
				}

				if (label.pixelY - lh / 2 < -this.maxHeight / 2) {
					label.y = -this.maxHeight / 2 + lh / 2;
				}

				let nextLabel = this.getNextLabel(i + 1, dataItems);

				let bottom: number = label.pixelY + lh;

				if (nextLabel) {
					if (nextLabel.y < bottom) {
						nextLabel.y = bottom;
					}
				}
			}
		}
	}


	protected arrangeLabels2(dataItems: this["_dataItem"][]): void {

		let previousTop = this.maxHeight / 2;

		for (let i = dataItems.length - 1; i >= 0; i--) {
			let dataItem: this["_dataItem"] = dataItems[i];

			let label = dataItem.label;

			if (label) {
				if (label.invalid) {
					label.validate();
				}

				let lh = label.measuredHeight;
				if (!label.visible) {
					lh = 0;
				}

				if (i == dataItems.length - 1) {
					previousTop += lh / 2;
				}

				if (label.pixelY + lh > previousTop) {
					label.y = previousTop - lh;
					previousTop = label.y;
				}
			}
		}
	}

	/**
	 * Returns the next label according to `index`.
	 *
	 * @param index      Current index
	 * @param dataItems  Data items
	 * @return Label element
	 */
	protected getNextLabel(index: number, dataItems: this["_dataItem"][]): this["_label"] {
		if (dataItems.length >= index) {
			let nextDataItem: this["_dataItem"] = dataItems[index];
			if (nextDataItem) {
				if (nextDataItem.label) {
					if (nextDataItem.visible) {
						return nextDataItem.label;
					}
					else {
						return this.getNextLabel(index + 1, dataItems);
					}
				}
				else {
					return this.getNextLabel(index + 1, dataItems);
				}
			}
		}
	}

	/**
	 * A color set to be used for slices.
	 *
	 * For each new subsequent slice, the chart will assign the next color in
	 * this set.
	 *
	 * @param value  Color set
	 */
	public set colors(value: ColorSet) {
		this.setPropertyValue("colors", value, true);
	}

	/**
	 * @return Color set
	 */
	public get colors(): ColorSet {
		return this.getPropertyValue("colors");
	}

	/**
	 * A [[PatternSet]] to use when creating patterned fills for slices.
	 *
	 * @since 4.7.5
	 * @param value  Pattern set
	 */
	public set patterns(value: PatternSet) {
		this.setPropertyValue("patterns", value, true);
	}

	/**
	 * @return Pattern set
	 */
	public get patterns(): PatternSet {
		return this.getPropertyValue("patterns");
	}

	/**
	 * Binds related legend data item's visual settings to this series' visual
	 * settings.
	 *
	 * @ignore Exclude from docs
	 * @param marker    Container
	 * @param dataItem  Data item
	 */
	public createLegendMarker(marker: Container, dataItem?: this["_dataItem"]): void {
		$iter.each(marker.children.iterator(), (child) => {
			let slice: this["_slice"] = dataItem.slice;

			child.defaultState.properties.fill = slice.fill;
			child.defaultState.properties.stroke = slice.stroke;
			child.defaultState.properties.fillOpacity = slice.fillOpacity;
			child.defaultState.properties.strokeOpacity = slice.strokeOpacity;

			child.fill = slice.fill;
			child.stroke = slice.stroke;
			child.fillOpacity = slice.fillOpacity;
			child.strokeOpacity = slice.strokeOpacity;

			if (child.fill == undefined) {
				child.__disabled = true;
			}

			let legendDataItem = <LegendDataItem>marker.dataItem;
			legendDataItem.color = slice.fill;
			legendDataItem.colorOrig = slice.fill;

			child.addDisposer(slice.events.on("propertychanged", (ev) => {
				if (ev.property == "fill") {

					child.__disabled = false;

					if (!child.isActive) {
						child.fill = slice.fill;
					}
					child.defaultState.properties.fill = slice.fill;
					legendDataItem.color = slice.fill;
					legendDataItem.colorOrig = slice.fill;
				}

				if (ev.property == "stroke") {
					if (!child.isActive) {
						child.stroke = slice.stroke;
					}
					child.defaultState.properties.stroke = slice.stroke;
				}
			}, undefined, false));
		});
	}

	/**
	 * Repositions bullets when slice's size changes.
	 *
	 * @ignore Exclude from docs
	 * @param event  Event
	 */
	protected handleSliceScale(event: AMEvent<this["_slice"], ISpriteEvents>["propertychanged"]): void {
		let slice: this["_slice"] = event.target;
		let dataItem: this["_dataItem"] = <this["_dataItem"]>slice.dataItem;
		$iter.each(dataItem.bullets.iterator(), (a) => {
			let value = a[1];
			this.positionBullet(value);
		});
	}

	/**
	 * Repositions bullet and labels when slice moves.
	 *
	 * @ignore Exclude from docs
	 * @param event  Event
	 */
	protected handleSliceMove(event: AMEvent<this["_slice"], ISpriteEvents>["propertychanged"]): void {

	}

	/**
	 * Copies all properties from another instance of [[PercentSeries]].
	 *
	 * @param source  Source series
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.slices.template.copyFrom(source.slices.template);
		this.labels.template.copyFrom(source.labels.template);
		this.ticks.template.copyFrom(source.ticks.template);
	}

	/**
	 * Align labels into nice vertical columns?
	 *
	 * This will ensure that labels never overlap with each other.
	 *
	 * Arranging labels into columns makes them more readble, and better user
	 * experience.
	 *
	 * If set to `false` labels will be positioned at `label.radius` distance,
	 * and may, in some cases, overlap.
	 *
	 * @default true
	 * @param value  Align labels?
	 */
	public set alignLabels(value: boolean) {
		this.setAlignLabels(value);
	}

	/**
	 * @return Align labels?
	 */
	public get alignLabels(): boolean {
		return this.getPropertyValue("alignLabels");
	}

	/**
	 * @ignore
	 */
	protected setAlignLabels(value: boolean) {
		this.setPropertyValue("alignLabels", value, true);
	}

	/**
	 * If set to `true` the chart will not show slices with zero values.
	 * 
	 * @default false
	 * @since 4.7.9
	 * @param  value  Ignore zero values
	 */
	public set ignoreZeroValues(value: boolean) {
		this.setPropertyValue("ignoreZeroValues", value, true);
	}

	/**
	 * @return Ignore zero values
	 */
	public get ignoreZeroValues(): boolean {
		return this.getPropertyValue("ignoreZeroValues");
	}

	/**
	 * Updates corresponding legend data item with current values.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public updateLegendValue(dataItem?: this["_dataItem"]) {
		if (dataItem) {
			let legendDataItem = dataItem.legendDataItem;
			let legendSettings = dataItem.legendSettings;

			if (legendDataItem && legendSettings) {

				if (legendSettings) {
					if (legendSettings.labelText) {
						legendDataItem.label.text = legendSettings.labelText;
					}
					if (legendSettings.itemLabelText) {
						legendDataItem.label.text = legendSettings.itemLabelText;
					}
					if (legendSettings.valueText) {
						legendDataItem.valueLabel.text = legendSettings.valueText;
					}
					if (legendSettings.itemValueText) {
						legendDataItem.valueLabel.text = legendSettings.itemValueText;
					}
				}
			}
		}
	}
}

/**
 * bboxter class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PercentSeries"] = PercentSeries;
registry.registeredClasses["PercentSeriesDataItem"] = PercentSeriesDataItem;

/**
 * Add default responsive rules
 */

/**
 * Disable labels and ticks.
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.maybeXS,
	state: function(target, stateId) {
		if (target instanceof PercentSeries) {
			let state = target.states.create(stateId);

			let labelState = target.labels.template.states.create(stateId);
			labelState.properties.disabled = true;

			let tickState = target.ticks.template.states.create(stateId);
			tickState.properties.disabled = true;
			return state;
		}

		return null;
	}
});
