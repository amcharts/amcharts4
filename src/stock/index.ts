/**
 * Stock Chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { registry } from "@amcharts/amcharts4/core";
import { XYChart } from "@amcharts/amcharts4/charts";


export class StockChart extends XYChart {
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StockChart"] = StockChart;
