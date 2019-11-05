/**
 * Stock Chart module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { registry } from "../../core/Registry";
import { XYChart } from "../../charts/types/XYChart";


export class StockChart extends XYChart {
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StockChart"] = StockChart;
