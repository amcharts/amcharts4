/**
 * Stock Chart module.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { registry } from "@amcharts/amcharts4/core";
import { XYChart } from "@amcharts/amcharts4/charts";
var StockChart = /** @class */ (function (_super) {
    tslib_1.__extends(StockChart, _super);
    function StockChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StockChart;
}(XYChart));
export { StockChart };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StockChart"] = StockChart;
//# sourceMappingURL=index.js.map