import { Plugin } from "../../core/utils/Plugin";
import { XYSeries } from "../../charts/series/XYSeries";
import { Optional } from "../../core/utils/Type";
import { EventDispatcher, AMEvent } from "../../core/utils/EventDispatcher";
/**
 * Defines events for [[BaseObjectEvents]].
 */
export interface IRegressionEvents {
    /**
     * Invoked when regression finishes calculating data.
     */
    processed: {};
}
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
export declare class Regression extends Plugin {
    /**
     * A series object that will be used for the trend line.
     */
    target: Optional<XYSeries>;
    /**
     * An [[EventDispatcher]] instance.
     *
     * @since 4.3.14
     */
    events: EventDispatcher<AMEvent<this, IRegressionEvents>>;
    /**
     * Method
     */
    protected _method: "linear" | "polynomial";
    /**
     * Options
     */
    protected _options: {
        [index: string]: any;
    };
    /**
     * Calculated data.
     */
    protected _data: Optional<any[]>;
    /**
     * An object containing results of the calculation.
     *
     * @since 4.3.14
     */
    result: Optional<any>;
    /**
     * Original series data.
     */
    protected _originalData: Optional<any[]>;
    /**
     * Should skip next "beforedatavalidated" event?
     */
    protected _skipValidatedEvent: boolean;
    /**
     * Constructor
     */
    constructor();
    init(): void;
    /**
     * Decorates series with required events and adapters used to hijack its
     * data.
     */
    private processSeries();
    private invalidateData();
    private calcData();
    /**
     * @return Method
     */
    /**
     * Method to calculate regression.
     *
     * Supported values: "linear" (default), "polynomial".
     *
     * @default linear
     * @param  value  Method
     */
    method: "linear" | "polynomial";
    /**
     * @return Options
     */
    /**
     * Regression output options.
     *
     * Below are default alues.
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
    options: {
        [index: string]: any;
    };
}
