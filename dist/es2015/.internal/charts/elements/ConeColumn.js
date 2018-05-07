/**
 * Module that defines everything related to building Cone Columns.
 * It is a container which has coneColumn element which is a Cone.
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
import { Column } from "./Column";
import { Cone } from "../../core/elements/3d/Cone";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates ConeColumns.
 *
 * @see {@link IConeColumnEvents} for a list of available events
 * @see {@link IConeColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var ConeColumn = /** @class */ (function (_super) {
    __extends(ConeColumn, _super);
    /**
     * Constructor
     */
    function ConeColumn() {
        var _this = _super.call(this) || this;
        _this.className = "ConeColumn";
        return _this;
    }
    ConeColumn.prototype.createAssets = function () {
        this.coneColumn = this.createChild(Cone);
        this.coneColumn.shouldClone = false;
        // some dirty hack so that if user access column, it won't get error
        this.column = this.coneColumn;
    };
    ConeColumn.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.coneColumn) {
            this.coneColumn.copyFrom(source.coneColumn);
        }
    };
    return ConeColumn;
}(Column));
export { ConeColumn };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ConeColumn"] = ConeColumn;
//# sourceMappingURL=ConeColumn.js.map