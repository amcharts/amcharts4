/**
 * ConeSeries module
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries3D, ColumnSeries3DDataItem } from "./ColumnSeries3D";
import { Cone } from "../../core/elements/3d/Cone";
import { percent } from "../../core/utils/Percent";
import { system } from "../../core/System";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ConeSeries]].
 *
 * @see {@link DataItem}
 */
var ConeSeriesDataItem = /** @class */ (function (_super) {
    __extends(ConeSeriesDataItem, _super);
    /**
     * Constructor
     */
    function ConeSeriesDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "ConeSeriesDataItem";
        _this.applyTheme();
        return _this;
    }
    return ConeSeriesDataItem;
}(ColumnSeries3DDataItem));
export { ConeSeriesDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a cone graph.
 *
 * @see {@link IConeSeriesEvents} for a list of available Events
 * @see {@link IConeSeriesAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
var ConeSeries = /** @class */ (function (_super) {
    __extends(ConeSeries, _super);
    /**
     * Constructor
     */
    function ConeSeries() {
        var _this = _super.call(this) || this;
        _this.className = "ConeSeries";
        _this.applyTheme();
        return _this;
    }
    /**
     * Returns a new element to use as a template for the series.
     *
     * @return {Sprite} Element
     */
    ConeSeries.prototype.getColumnTemplate = function () {
        var template = new Cone();
        template.topRadius = percent(0);
        template.width = percent(80);
        template.height = percent(80);
        return template;
    };
    return ConeSeries;
}(ColumnSeries3D));
export { ConeSeries };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
system.registeredClasses["ConeSeries"] = ConeSeries;
system.registeredClasses["ConeSeriesDataItem"] = ConeSeriesDataItem;
//# sourceMappingURL=ConeSeries.js.map