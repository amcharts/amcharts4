/**
 * Module that defines everything related to building Columns.
 * It is a container which has column element which is a RoundedRectangle.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../../core/Container";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
import { registry } from "../../core/Registry";
import { percent } from "../../core/utils/Percent";
import * as $math from "../../core/utils/Math";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates Columns.
 *
 * @see {@link IColumnEvents} for a list of available events
 * @see {@link IColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
var Column = /** @class */ (function (_super) {
    tslib_1.__extends(Column, _super);
    /**
     * Constructor
     */
    function Column() {
        var _this = _super.call(this) || this;
        _this.className = "Column";
        _this.width = percent(80);
        _this.height = percent(80);
        _this.isMeasured = true; // for correct position of the tooltip
        _this.applyOnClones = true;
        _this.strokeOpacity = 1;
        _this.layout = "none";
        _this.createAssets();
        // otherwise users will have to set layout themselves if they'll want to align, scale etc children
        _this.events.on("childadded", function () {
            if (_this.layout == "none") {
                _this.layout = "absolute";
            }
        });
        return _this;
    }
    Column.prototype.createAssets = function () {
        this.column = this.createChild(RoundedRectangle);
        this.column.shouldClone = false;
        this.column.cornerRadius(0, 0, 0, 0);
        this._disposers.push(this.column);
    };
    /**
     * Validates element:
     * * Triggers events
     * * Redraws the element
     *
     * @ignore Exclude from docs
     */
    Column.prototype.validate = function () {
        _super.prototype.validate.call(this);
        if (this.column) {
            this.column.width = $math.min(this.pixelWidth, this.maxWidth);
            this.column.height = $math.min(this.pixelHeight, this.maxHeight);
        }
    };
    /**
     * Copies all parameters from another [[Sprite]].
     *
     * @param {Sprite} source Source Sprite
     */
    Column.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        if (this.column) {
            this.column.copyFrom(source.column);
        }
    };
    return Column;
}(Container));
export { Column };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Column"] = Column;
//# sourceMappingURL=Column.js.map