/**
 * Venn Diagram module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PercentChart, IPercentChartProperties, IPercentChartDataFields, IPercentChartAdapters, IPercentChartEvents, PercentChartDataItem } from "../../charts/types/PercentChart";
import { VennSeries } from "./VennSeries";
import { registry } from "../../core/Registry";
import { Legend } from "../../charts/Legend";
import * as $type from "../../core/utils/Type";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[VennDiagram]].
 *
 * @see {@link DataItem}
 */
export class VennDiagramDataItem extends PercentChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: VennDiagram;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "VennDiagramDataItem";
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
 * Defines data fields for [[VennDiagram]].
 */
export interface IVennDiagramDataFields extends IPercentChartDataFields { }

/**
 * Defines properties for [[VennDiagram]]
 */
export interface IVennDiagramProperties extends IPercentChartProperties { }

/**
 * Defines events for [[VennDiagram]].
 */
export interface IVennDiagramEvents extends IPercentChartEvents { }

/**
 * Defines adapters for [[VennDiagram]].
 *
 * @see {@link Adapter}
 */
export interface IVennDiagramAdapters extends IPercentChartAdapters, IVennDiagramProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a Venn Diagram.
 * 
 * Venn diagram uses Ben Frederickson's [venn.js](https://github.com/benfred/venn.js).
 *
 * @see {@link IVennDiagramEvents} for a list of available Events
 * @see {@link IVennDiagramAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/venn/} for documentation
 * @important
 * @since 4.9.0
 */
export class VennDiagram extends PercentChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IVennDiagramDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IVennDiagramProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IVennDiagramAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IVennDiagramEvents;

	/**
	 * Defines a type of series that this chart uses.
	 */
	public _seriesType: VennSeries;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "VennDiagram";

		this.seriesContainer.layout = "horizontal";

		this.padding(15, 15, 15, 15);

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
			this.readerTitle = this.language.translate("Venn Diagram");
		}
	}

	/**
	 * @ignore
	 */
	protected setLegend(legend: Legend) {
		super.setLegend(legend);
		if (legend) {
			legend.valueLabels.template.disabled = true;
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["VennDiagram"] = VennDiagram;
registry.registeredClasses["VennDiagramDataItem"] = VennDiagramDataItem;
