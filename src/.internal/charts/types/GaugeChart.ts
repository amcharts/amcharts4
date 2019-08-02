/**
 * Module for building Gauge charts.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { RadarChart, IRadarChartProperties, IRadarChartDataFields, IRadarChartAdapters, IRadarChartEvents, RadarChartDataItem } from "./RadarChart";
import { ListTemplate, IListEvents, ListDisposer } from "../../core/utils/List";
import { ClockHand } from "../elements/ClockHand";
import { Ordering } from "../../core/utils/Order";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[GaugeChart]].
 *
 * @see {@link DataItem}
 */
export class GaugeChartDataItem extends RadarChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: GaugeChart;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "GaugeChartDataItem";
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
 * Defines data fields for [[GaugeChart]].
 */
export interface IGaugeChartDataFields extends IRadarChartDataFields { }

/**
 * Defines properties for [[GaugeChart]].
 */
export interface IGaugeChartProperties extends IRadarChartProperties { }

/**
 * Defines events for [[GaugeChart]].
 */
export interface IGaugeChartEvents extends IRadarChartEvents { }

/**
 * Defines adapters for [[GaugeChart]].
 *
 * @see {@link Adapter}
 */
export interface IGaugeChartAdapters extends IRadarChartAdapters, IGaugeChartProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a Gauge chart.
 *
 * @see {@link IGaugeChartEvents} for a list of available Events
 * @see {@link IGaugeChartAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/gauge-chart/} for documentation
 * @important
 */
export class GaugeChart extends RadarChart {

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IGaugeChartDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IGaugeChartProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IGaugeChartAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IGaugeChartEvents;

	/**
	 * A list of [[ClockHand]] items displayed on this Gauge chart.
	 */
	public hands: ListTemplate<ClockHand>;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "GaugeChart";

		this.startAngle = 180;
		this.endAngle = 360;

		this.hands = new ListTemplate<ClockHand>(new ClockHand());
		this.hands.events.on("inserted", this.processHand, this, false);

		this._disposers.push(new ListDisposer(this.hands));
		this._disposers.push(this.hands.template);

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
			this.readerTitle = this.language.translate("Gauge chart");
		}

	}

	/**
	 * Decorates a [[ClockHand]] when it is added to the chart.
	 *
	 * @param event  Event
	 */
	protected processHand(event: IListEvents<ClockHand>["inserted"]): void {
		let hand: ClockHand = event.newValue;
		if (!hand.axis) {
			hand.axis = this.xAxes.getIndex(0);
		}
	}

	/**
	 * This function is used to sort element's JSON config properties, so that
	 * some properties that absolutely need to be processed last, can be put at
	 * the end.
	 *
	 * @ignore Exclude from docs
	 * @param a  Element 1
	 * @param b  Element 2
	 * @return Sorting number
	 */
	protected configOrder(a: string, b: string): Ordering {
		if (a == b) {
			return 0;
		}
		// Must come last
		else if (a == "hands") {
			return 1;
		}
		else if (b == "hands") {
			return -1;
		}
		else {
			return super.configOrder(a, b);
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["GaugeChart"] = GaugeChart;
