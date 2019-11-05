/**
 * Regression plugin.
 *
 * Uses regression-js library by Tom Alexander
 * http://tom-alexander.github.io/regression-js/
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as regression from "regression";
import { Plugin } from "../../core/utils/Plugin";
import { XYSeries } from "../../charts/series/XYSeries";
import { Optional } from "../../core/utils/Type";
import { registry } from "../../core/Registry";
import { EventDispatcher, AMEvent } from "../../core/utils/EventDispatcher";
import * as $object from "../../core/utils/Object";
import * as $type from "../../core/utils/Type";

/**
 * Defines events for [[BaseObjectEvents]].
 */
export interface IRegressionEvents {
	/**
	 * Invoked when regression finishes calculating data.
	 */
	processed: {};
};



/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A module which automatically calculates data for for trend lines using
 * various regression algorithms.
 *
 * By pushing an instance of [[Regression]] into `plugin` list of
 * any [[XYSeries]], it automatically recalculates and overrides its
 * data to show regression trend line, inestead of the source values.
 *
 * Example:
 *
 * ```TypeScript
 * let regseries = chart.series.push(new am4charts.LineSeries());
 * regseries.dataFields.valueY = "value";
 * regseries.dataFields.dateX = "date";
 *
 * let reg = regseries.plugins.push(new am4plugins_regression.Regression());
 * reg.method = "polynomial";
 * ```
 * ```JavaScript
 * var regseries = chart.series.push(new am4charts.LineSeries());
 * regseries.dataFields.valueY = "value";
 * regseries.dataFields.dateX = "date";
 *
 * var reg = regseries.plugins.push(new am4plugins_regression.Regression());
 * reg.method = "polynomial";
 * ```
 * ```JSON
 * {
 *   // ...
 *   "series": [{
 *     // ...
 *   }, {
 *     "type": "LineSeries",
 *     "dataFields": {
 *       "valueY": "value",
 *       "dateX": "date"
 *     },
 *     "plugins": [{
 *       "type": "Regression",
 *       "method": "polynomial"
 *     }]
 *   }]
 * }
 * ```
 *
 * @since 4.2.2
 */
export class Regression extends Plugin {

	/**
	 * A series object that will be used for the trend line.
	 */
	public target: Optional<XYSeries>;

	/**
	 * An [[EventDispatcher]] instance.
	 *
	 * @since 4.3.14
	 */
	public events: EventDispatcher<AMEvent<this, IRegressionEvents>> = new EventDispatcher();

	/**
	 * Method
	 */
	protected _method: "linear" | "polynomial" = "linear";

	/**
	 * Options
	 */
	protected _options: { [index: string]: any } = {};

	/**
	 * Simplify output data.
	 */
	protected _simplify: boolean = false;

	/**
	 * Reorder data after calculation
	 */
	protected _reorder: boolean = false;

	/**
	 * Calculated data.
	 */
	protected _data: Optional<any[]>;

	/**
	 * An object containing results of the calculation.
	 *
	 * @since 4.3.14
	 */
	public result: Optional<any>;

	/**
	 * Original series data.
	 */
	protected _originalData: Optional<any[]>;

	/**
	 * Should skip next "beforedatavalidated" event?
	 */
	protected _skipValidatedEvent: boolean = false;

	/**
	 * Constructor
	 */
	constructor() {
		// Nothing to do here
		super();
	}

	public init() {
		super.init();
		this.processSeries();
	}

	/**
	 * Decorates series with required events and adapters used to hijack its
	 * data.
	 */
	private processSeries(): void {

		this.invalidateData();

		// Invalidate calculated data whenever data updates
		this._disposers.push(this.target.events.on("beforedatavalidated", (ev) => {
			if (this._skipValidatedEvent) {
				this._skipValidatedEvent = false;
				return;
			}
			this.calcData();
		}));

		if (this.target.chart) {
			this._disposers.push(this.target.chart.events.on("beforedatavalidated", (ev) => {
				this.target.invalidateData();
			}));
		}

		// Save original series data
		if (this.target.data && this.target.data.length) {
			this._originalData = this.target.data;
		}

		// Set up adpater for data
		this.target.adapter.add("data", () => {
			if (this._data === undefined) {
				this.calcData();
			}
			return this._data;
		});
	}

	private invalidateData(): void {
		this._data = undefined;
	}

	private calcData(): void {
		this._data = [];
		const series = this.target;

		// Get series' data (global or series own)
		let seriesData: any = this._originalData;
		if (!seriesData || seriesData.length == 0) {
			seriesData = (<any>this.target.baseSprite).data;
		}

		// Build matrix for the regression function
		let matrix: any = [];
		let map: any = {};
		let xx = 0;
		for (let i = 0; i < seriesData.length; i++) {
			let x = series.dataFields.valueX ? seriesData[i][series.dataFields.valueX] : i;
			let y = series.dataFields.valueY ? seriesData[i][series.dataFields.valueY] : i;
			if ($type.hasValue(x) && $type.hasValue(y)) {
				matrix.push([x, y]);
				map[xx] = i;
				xx++;
			}
		}

		// Calculate regression values
		let result: any = [];
		switch (this.method) {
			case "polynomial":
				result = regression.polynomial(matrix, this.options);
				break;
			default:
				result = regression.linear(matrix, this.options);
		}

		// Set results
		this.result = result;

		// Invoke event
		this.events.dispatchImmediately("processed", {
			type: "processed",
			target: this
		});

		// Order data points
		if (this.reorder) {
			result.points.sort(function(a: any, b: any) {
				if (a[0] > b[0]) {
					return -1;
				}
				else if (a[0] < b[0]) {
					return 1;
				}
				else {
					return 0;
				}
			});
		}

		// Build data
		this._data = [];
		for (let i = 0; i < result.points.length; i++) {
			if (this.simplify && i) {
				i = result.points.length - 1;
			}
			let item: any = {};
			const xx = map[i];
			$object.each(this.target.dataFields, (key, val) => {
				if (key == "valueX") {
					item[val] = result.points[i][0];
				}
				else if (key == "valueY") {
					item[val] = result.points[i][1];
				}
				else {
					item[val] = seriesData[xx][val];
				}
			});
			this._data.push(item);
		}

	}

	/**
	 * Method to calculate regression.
	 *
	 * Supported values: "linear" (default), "polynomial".
	 *
	 * @default linear
	 * @param  value  Method
	 */
	public set method(value: "linear" | "polynomial") {
		if (this._method != value) {
			this._method = value;
			this.invalidateData();
		}
	}

	/**
	 * @return Method
	 */
	public get method(): "linear" | "polynomial" {
		return this._method;
	}

	/**
	 * Regression output options.
	 *
	 * Below are default values.
	 *
	 * ```JSON
	 * {
	 *   order: 2,
	 *   precision: 2,
	 * }
	 * ```
	 *
	 * @see {@link https://github.com/Tom-Alexander/regression-js#configuration-options} About options
	 * @param  value  Options
	 */
	public set options(value: { [index: string]: any }) {
		if (this._options != value) {
			this._options = value;
			this.invalidateData();
		}
	}

	/**
	 * @return Options
	 */
	public get options(): { [index: string]: any } {
		return this._options;
	}

	/**
	 * Simplify regression line data? If set to `true` it will use only two
	 * result data points: first and last.
	 *
	 * NOTE: this does make sense with "linear" method only.
	 *
	 * @default false
	 * @since 4.2.3
	 * @param  value  Simplify?
	 */
	public set simplify(value: boolean) {
		if (this._simplify != value) {
			this._simplify = value;
			this.invalidateData();
		}
	}

	/**
	 * @return Simplify?
	 */
	public get simplify(): boolean {
		return this._simplify;
	}

	/**
	 * Orders data points after calculation. This can make sense in scatter plot
	 * scenarios where data points can come in non-linear fashion.
	 *
	 * @default false
	 * @since 4.2.3
	 * @param  value  Reorder data?
	 */
	public set reorder(value: boolean) {
		if (this._reorder != value) {
			this._reorder = value;
			this.invalidateData();
		}
	}

	/**
	 * @return Reorder data?
	 */
	public get reorder(): boolean {
		return this._reorder;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Regression"] = Regression;
