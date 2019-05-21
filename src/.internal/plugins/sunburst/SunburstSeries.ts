/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */

import { PieSeries, PieSeriesDataItem, IPieSeriesDataFields, IPieSeriesProperties, IPieSeriesAdapters, IPieSeriesEvents } from "../../charts/series/PieSeries";
import { Sunburst, SunburstDataItem } from "./Sunburst";
import * as $type from "../../core/utils/Type";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { Animation } from "../../core/utils/Animation";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[SunburstSeries]].
 *
 * @see {@link DataItem}
 * @since 4.1.6
 */
export class SunburstSeriesDataItem extends PieSeriesDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: SunburstSeries;

	/**
	 * A reference to a component of a data item.
	 */
	public component: SunburstSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SunburstSeriesDataItem";

		this.applyTheme();
	}

	/**
	 * A corresponding data item from the Sunburst.
	 *
	 * @readonly
	 * @return Data item
	 */
	public get sunburstDataItem(): SunburstDataItem {
		return <SunburstDataItem>this._dataContext;
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
		let sunburstDataItem = this.sunburstDataItem;
		if (sunburstDataItem && sunburstDataItem.series) {
			sunburstDataItem.series.dataItems.each((dataItem) => {
				dataItem.hide(duration, delay, toValue, fields);
			})
		}
		return super.hide(duration, delay, toValue, fields);
	}


	/**
	 * Show hidden data item (and corresponding cisual elements).
	 *
	 * @param duration  Duration (ms)
	 * @param delay     Delay hiding (ms)
	 * @param fields    Fields to animate while hiding
	 */
	public show(duration?: number, delay?: number, fields?: string[]): $type.Optional<Animation> {
		let sunburstDataItem = this.sunburstDataItem;

		if (sunburstDataItem && sunburstDataItem.series) {
			sunburstDataItem.series.dataItems.each((dataItem) => {
				dataItem.show(duration, delay, fields);
			})
		}

		return super.show(duration, delay, fields);
	}

	/**
	 * Numeric value.
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

		let value = 0;
		let sbDataItem = this.sunburstDataItem;
		if(sbDataItem){
			if (!sbDataItem.series) {
				value = this.values["value"].value;
			}
			else {
				sbDataItem.series.dataItems.each((dataItem) => {
					let childValue = dataItem.value;
					if ($type.isNumber(childValue)) {
						value += childValue;
					}
				});

			}
		}

		return value;
	}

	/**
	 *
	 * @todo description
	 * @ignore
	 * @return Value
	 */
	public getActualWorkingValue(name: string): $type.Optional<number> {
		let value = 0;
		let sbDataItem = this.sunburstDataItem;

		if (!sbDataItem.series) {
			value = this.values[name].workingValue;
		}
		else {
			sbDataItem.series.dataItems.each((dataItem) => {
				let childValue = dataItem.getWorkingValue(name);
				if ($type.isNumber(childValue)) {
					value += childValue;
				}
			});
		}
		return value;
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[SunburstSeries]].
 *
 * @since 4.1.6
 */
export interface ISunburstSeriesDataFields extends IPieSeriesDataFields { }

/**
 * Defines properties for [[SunburstSeries]].
 *
 * @since 4.1.6
 */
export interface ISunburstSeriesProperties extends IPieSeriesProperties { }

/**
 * Defines events for [[SunburstSeries]].
 *
 * @since 4.1.6
 */
export interface ISunburstSeriesEvents extends IPieSeriesEvents { }

/**
 * Defines adapters for [[SunburstSeries]].
 *
 * @see {@link Adapter}
 * @since 4.1.6
 */
export interface ISunburstSeriesAdapters extends IPieSeriesAdapters, ISunburstSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a [[Sunburst]] chart.
 *
 * @see {@link ISunburstSeriesEvents} for a list of available Events
 * @see {@link ISunburstSeriesAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/sunburst/} For more information
 * @todo Example
 * @since 4.1.6
 * @important
 */
export class SunburstSeries extends PieSeries {

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: ISunburstSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ISunburstSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISunburstSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISunburstSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: SunburstSeriesDataItem;

	/**
	 * A chart series belongs to.
	 */
	public _chart: Sunburst;

	/**
	 * The level in hierarchy hierarchy series is at.
	 *
	 * @readonly
	 */
	public level: number;

	/**
	 * Parent data item of a series.
	 */
	public parentDataItem: SunburstDataItem;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SunburstSeries";

		this.dataFields.category = "name";
		this.dataFields.value = "value";

		let interfaceColors = new InterfaceColorSet();
		this.stroke = interfaceColors.getFor("background");
		this.strokeOpacity = 1;

		this.alignLabels = false;
		this.ticks.template.disabled = true;

		this.slices.template.hiddenState.properties.visible = true;

		let labelTemplate = this.labels.template;
		labelTemplate.relativeRotation = 90;
		labelTemplate.radius = 10;
		labelTemplate.inside = true;
		labelTemplate.strokeOpacity = 0;
		labelTemplate.fillOpacity = 1;
		labelTemplate.fill = interfaceColors.getFor("background");
		labelTemplate.padding(0, 0, 0, 0);
		labelTemplate.interactionsEnabled = false;

		let sliceTemplate = this.slices.template;
		sliceTemplate.stroke = interfaceColors.getFor("background");
		let activeState = sliceTemplate.states.getKey("active");
		if (activeState) {
			activeState.properties.shiftRadius = 0;
		}

		this.applyTheme();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new SunburstSeriesDataItem();
	}

	/**
	 * Processes data item.
	 *
	 * @param dataItem     Data item
	 * @param dataContext  Raw data
	 * @param index        Index of the data item
	 */
	protected processDataItem(dataItem: this["_dataItem"], dataContext?: Object): void {
		(<SunburstDataItem>dataContext).seriesDataItem = dataItem; // save a reference here. dataContext is TreeMapDataItem and we need to know dataItem sometimes
		super.processDataItem(dataItem, dataContext);
	}

	/**
	 * [handleDataItemValueChange description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public handleDataItemValueChange(dataItem?: this["_dataItem"], name?: string): void {
		super.handleDataItemValueChange(dataItem, name);
		dataItem.sunburstDataItem.setValue(name, dataItem.getValue(name));
	}

	/**
	 * [handleDataItemWorkingValueChange description]
	 *
	 * @ignore
	 * @todo Description
	 * @param {this["_dataItem"]} dataItem [description]
	 * @param {string}            name     [description]
	 */
	public handleDataItemWorkingValueChange(dataItem?: this["_dataItem"], name?: string): void {
		super.handleDataItemWorkingValueChange(dataItem, name);
		//dataItem.sunburstDataItem.setWorkingValue(name, dataItem.getWorkingValue(name), 0);

		let sunburstDataItem = dataItem.sunburstDataItem.parent.parent;
		while (sunburstDataItem != undefined) {
			sunburstDataItem.series.invalidateProcessedData();
			sunburstDataItem = sunburstDataItem.parent;
		}

		//dataItem.sunburstDataItem.parent.series.invalidateRawData();
		//	console.log(dataItem.sunburstDataItem.uid, dataItem.sunburstDataItem.parent.uid)

		//console.log(dataItem.sunburstDataItem.parent.series.uid, this.uid);
		//console.log(name, dataItem.getWorkingValue(name), dataItem.sunburstDataItem.getWorkingValue(name), dataItem.sunburstDataItem.value)
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SunburstSeries"] = SunburstSeries;
registry.registeredClasses["SunburstSeriesDataItem"] = SunburstSeriesDataItem;
