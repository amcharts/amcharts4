/**
 * Module that defines everything related to building 3D Columns.
 * It is a container which has column3D element which is a Rectangle3D.
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
import { Rectangle3D } from "../../core/elements/3d/Rectangle3D";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates Column3Ds.
 *
 * @see {@link IColumn3DEvents} for a list of available events
 * @see {@link IColumn3DAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var Column3D = /** @class */ (function (_super) {
    __extends(Column3D, _super);
    /**
     * Constructor
     */
    function Column3D() {
        var _this = _super.call(this) || this;
        _this.className = "Column3D";
        return _this;
    }
    Column3D.prototype.createAssets = function () {
        this.column3D = this.createChild(Rectangle3D);
        this.column3D.shouldClone = false;
        this.column3D.strokeOpacity = 0;
        // some dirty hack so that if user access column, it won't get error
        this.column = this.column3D;
    };
    Column3D.prototype.validate = function () {
        _super.prototype.validate.call(this);
        if (this.column3D) {
            this.column3D.width = this.pixelWidth;
            this.column3D.height = this.pixelHeight;
        }
    };
    Column3D.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.column3D) {
            this.column3D.copyFrom(source.column3D);
        }
    };
    return Column3D;
}(Column));
export { Column3D };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Column3D"] = Column3D;
//# sourceMappingURL=Column3D.js.map