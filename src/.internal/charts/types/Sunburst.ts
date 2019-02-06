///////////////////////NOT FISNISHED YET!

/**
 * Sunburst chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PieChart, IPieChartProperties, IPieChartDataFields, IPieChartAdapters, IPieChartEvents, PieChartDataItem } from "./PieChart";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { percent, Percent } from "../../core/utils/Percent";
import { PieSeries, PieSeriesDataItem } from "../series/PieSeries";
import { DataItem, IDataItemEvents } from "../../core/DataItem";
import { List, IListEvents, ListTemplate } from "../../core/utils/List";
import { Legend } from "../Legend";
import { IPoint } from "../../core/defs/IPoint";
import { IRectangle } from "../../core/defs/IRectangle";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $utils from "../../core/utils/Utils";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[Sunburst]].
 *
 * @see {@link DataItem}
 */
export class SunburstDataItem extends PieChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: Sunburst;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SunburstDataItem";
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
 * Defines data fields for [[Sunburst]].
 */
export interface ISunburstDataFields extends IPieChartDataFields { }

/**
 * Defines properties for [[Sunburst]]
 */
export interface ISunburstProperties extends IPieChartProperties { }

/**
 * Defines events for [[Sunburst]].
 */
export interface ISunburstEvents extends IPieChartEvents { }

/**
 * Defines adapters for [[Sunburst]].
 *
 * @see {@link Adapter}
 */
export interface ISunburstAdapters extends IPieChartAdapters, ISunburstProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */


export class Sunburst extends PieChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: ISunburstDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ISunburstProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISunburstAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISunburstEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: PieSeries;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Sunburst";

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {

		super.applyInternalDefaults();

		// Add a default screen reader title for accessibility
		// This will be overridden in screen reader if there are any `titles` set
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Sunburst chart");
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Sunburst"] = Sunburst;
registry.registeredClasses["SunburstDataItem"] = SunburstDataItem;
