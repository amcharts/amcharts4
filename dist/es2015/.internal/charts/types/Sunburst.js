///////////////////////NOT FISNISHED YET!
import * as tslib_1 from "tslib";
/**
 * Sunburst chart module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { PieChart, PieChartDataItem } from "./PieChart";
import { registry } from "../../core/Registry";
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
var SunburstDataItem = /** @class */ (function (_super) {
    tslib_1.__extends(SunburstDataItem, _super);
    /**
     * Constructor
     */
    function SunburstDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "SunburstDataItem";
        _this.applyTheme();
        return _this;
    }
    return SunburstDataItem;
}(PieChartDataItem));
export { SunburstDataItem };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
var Sunburst = /** @class */ (function (_super) {
    tslib_1.__extends(Sunburst, _super);
    /**
     * Constructor
     */
    function Sunburst() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "Sunburst";
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    Sunburst.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Add a default screen reader title for accessibility
        // This will be overridden in screen reader if there are any `titles` set
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Sunburst chart");
        }
    };
    return Sunburst;
}(PieChart));
export { Sunburst };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Sunburst"] = Sunburst;
registry.registeredClasses["SunburstDataItem"] = SunburstDataItem;
//# sourceMappingURL=Sunburst.js.map