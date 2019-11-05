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
import { registry } from "../../core/Registry";
import { XYChart } from "../../charts/types/XYChart";
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