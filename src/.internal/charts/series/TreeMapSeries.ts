/**
 * TreeMap series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, IColumnSeriesProperties, IColumnSeriesDataFields, IColumnSeriesAdapters, IColumnSeriesEvents, ColumnSeriesDataItem } from "./ColumnSeries";
import { visualProperties } from "../../core/Sprite";
import { TreeMap, TreeMapDataItem } from "../types/TreeMap";
import { Animation } from "../../core/utils/Animation";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $type from "../../core/utils/Type";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
import { Container } from "../../core/Container";
import * as $object from "../../core/utils/Object";
import { LegendDataItem } from "../../charts/Legend";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[TreeMapSeries]].
 *
 * @see {@link DataItem}
 */
export class TreeMapSeriesDataItem extends ColumnSeriesDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: TreeMapSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "TreeMapSeriesDataItem";

		this.applyTheme();
	}

	/**
	 * Data for the this particular item.
	 *
	 * @param value  Item's data
	 */
	//public set dataContext(value: Object) {
	//	this._dataContext = value;
	//}



	/**
	 * @return Item's data
	 */
	/*
   public get dataContext(): Object {
	   // It's because data of tree series is TreeMapDataItems.
	   if (this._dataContext) {
		   return (<any>this._dataContext).dataContext;
	   }
   }*/

	/**
	 * The name of the item's parent item.
	 *
	 * @return Parent name
	 */
	public get parentName(): string {
		let treeMapDataItem = this.treeMapDataItem;
		if (treeMapDataItem && treeMapDataItem.parent) {
			return treeMapDataItem.parent.name;
		}
	}

	/**
	 * Item's numeric value.
	 *
	 * @readonly
	 * @return Value
	 */
	public get value(): number {
		let treeMapDataItem = this.treeMapDataItem;
		if (treeMapDataItem) {
			return treeMapDataItem.value;
		}
	}

	/**
	 * A corresponding data item from the tree map.
	 *
	 * @readonly
	 * @return Data item
	 */
	public get treeMapDataItem(): TreeMapDataItem {
		return <TreeMapDataItem>this._dataContext;
	}

	/**
	 * Hides the Data Item and related visual elements.
	 *
	 * @param duration  Animation duration (ms)
	 * @param delay     Delay animation (ms)
	 * @param toValue   A value to set to `fields` when hiding
	 * @param fields    A list of data fields to set value to `toValue`
	 */
	public hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): $type.Optional<Animation> {
		let treeMapDataItem = this.treeMapDataItem;
		if (treeMapDataItem) {
			treeMapDataItem.hide(duration);
		}
		return super.hide(duration, delay, toValue, fields);
	}

	/**
	 * Shows the Data Item and related visual elements.
	 *
	 * @param duration  Animation duration (ms)
	 * @param delay     Delay animation (ms)
	 * @param fields    A list of fields to set values of
	 */
	public show(duration?: number, delay?: number, fields?: string[]): $type.Optional<Animation> {
		let treeMapDataItem = this.treeMapDataItem;
		if (treeMapDataItem) {
			treeMapDataItem.show(duration, delay, fields);
		}
		return super.show(duration, delay, fields);
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[TreeMapSeries]].
 */
export interface ITreeMapSeriesDataFields extends IColumnSeriesDataFields {

	/**
	 * Name of the field in data that holds numeric value.
	 */
	value?: string;

}

/**
 * Defines properties for [[TreeMapSeries]].
 */
export interface ITreeMapSeriesProperties extends IColumnSeriesProperties { }

/**
 * Defines events for [[TreeMapSeries]].
 */
export interface ITreeMapSeriesEvents extends IColumnSeriesEvents { }

/**
 * Defines adapters for [[TreeMapSeries]].
 *
 * @see {@link Adapter}
 */
export interface ITreeMapSeriesAdapters extends IColumnSeriesAdapters, ITreeMapSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines Series for a TreeMap chart.
 *
 * @see {@link ITreeMapSeriesEvents} for a list of available Events
 * @see {@link ITreeMapSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class TreeMapSeries extends ColumnSeries {

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: ITreeMapSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ITreeMapSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ITreeMapSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ITreeMapSeriesEvents;

	/**
	 * The level in treemap hierarchy series is at.
	 */
	public level: number;

	/**
	 * Type of the data item used by series.
	 */
	public _dataItem: TreeMapSeriesDataItem;

	/**
	 * A chart series belongs to.
	 */
	public _chart: TreeMap;

	/**
	 * Parent data item of a series.
	 */
	public parentDataItem: TreeMapDataItem;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "TreeMapSeries";
		this.applyTheme();

		this.fillOpacity = 1;
		this.strokeOpacity = 1;
		this.minBulletDistance = 0;
		this.columns.template.tooltipText = "{parentName} {name}: {value}"; //@todo add format number?
		this.columns.template.configField = "config";

		let interfaceColors = new InterfaceColorSet();

		this.stroke = interfaceColors.getFor("background");
		this.dataFields.openValueX = "x0";
		this.dataFields.valueX = "x1";
		this.dataFields.openValueY = "y0";
		this.dataFields.valueY = "y1";

		this.sequencedInterpolation = false;

		this.showOnInit = false;

		// otherwise nodes don't stack nicely to each other
		this.columns.template.pixelPerfect = false;
	}

	/**
	 * Processes data item.
	 *
	 * @param dataItem     Data item
	 * @param dataContext  Raw data
	 * @param index        Index of the data item
	 */
	protected processDataItem(dataItem: this["_dataItem"], dataContext?: Object): void {
		(<TreeMapDataItem>dataContext).seriesDataItem = dataItem; // save a reference here. dataContext is TreeMapDataItem and we need to know dataItem sometimes
		super.processDataItem(dataItem, dataContext);
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new TreeMapSeriesDataItem();
	}

	/**
	 * Shows series.
	 *
	 * @param duration  Duration of fade in (ms)
	 * @return Animation
	 */
	public show(duration?: number): Animation {
		if(this.preventShow){
			return;
		}

		let interpolationDuration = this.defaultState.transitionDuration;
		if ($type.isNumber(duration)) {
			interpolationDuration = duration;
		}

		this.dataItems.each((dataItem) => {
			//dataItem.treeMapDataItem.setWorkingValue("value", dataItem.treeMapDataItem.values.value.value);
			dataItem.show(duration);
		})

		return super.showReal(interpolationDuration);
	}


	/**
	 * Hides series.
	 *
	 * @param duration  Duration of fade out (ms)
	 * @return Animation
	 */
	public hide(duration?: number): Animation {

		let interpolationDuration = this.defaultState.transitionDuration;
		if ($type.isNumber(duration)) {
			interpolationDuration = duration;
		}

		let animation = super.hideReal(interpolationDuration);

		this.dataItems.each((dataItem) => {
			//dataItem.treeMapDataItem.setWorkingValue("value", 0);
			dataItem.hide(duration);
		})
		return animation;
	}

	/**
	 * Process values.
	 *
	 * @ignore Exclude from docs
	 */
	public processValues() {

		// Just overriding so that inherited method does not kick in.

	}

	/**
	 * Returns relative start location for the data item.
	 *
	 * @param dataItem  Data item
	 * @return Location (0-1)
	 */
	protected getStartLocation(dataItem: this["_dataItem"]): number {		
		return 0;
	}	

	/**
	 * Returns relative end location for the data item.
	 *
	 * @param dataItem  Data item
	 * @return Location (0-1)
	 */
	protected getEndLocation(dataItem: this["_dataItem"]): number {
		return 1;
	}	


	/**
	 * @ignore
	 */
	public dataChangeUpdate() {

	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Add empty data fields if the they are not set, so that XYSeries
			// dataField check does not result in error.
			if (!$type.hasValue(config.dataFields) || !$type.isObject(config.dataFields)) {
				config.dataFields = {};
			}

		}

		super.processConfig(config);
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

		//column.copyFrom(<any>this.columns.template);
		column.padding(0, 0, 0, 0); // if columns will have padding (which is often), legend marker will be very narrow
		column.width = w;
		column.height = h;

		let legendDataItem = <LegendDataItem>marker.dataItem;
		legendDataItem.color = column.fill;
		legendDataItem.colorOrig = column.fill;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["TreeMapSeries"] = TreeMapSeries;
registry.registeredClasses["TreeMapSeriesDataItem"] = TreeMapSeriesDataItem;
