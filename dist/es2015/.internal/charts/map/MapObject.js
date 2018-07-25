/**
 * Map object module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../../core/Container";
import { registry } from "../../core/Registry";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A base class for all map objects: lines, images, etc.
 *
 * @see {@link IMapObjectEvents} for a list of available events
 * @see {@link IMapObjectAdapters} for a list of available Adapters
 */
var MapObject = /** @class */ (function (_super) {
    tslib_1.__extends(MapObject, _super);
    /**
     * Constructor
     */
    function MapObject() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "MapObject";
        // Set defaults
        _this.isMeasured = false;
        _this.layout = "none";
        _this.clickable = true;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * (Re)validates this object, forcing it to redraw.
     *
     * @ignore Exclude from docs
     */
    MapObject.prototype.validate = function () {
        this.readerTitle = this.series.itemReaderText;
        _super.prototype.validate.call(this);
    };
    return MapObject;
}(Container));
export { MapObject };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["MapObject"] = MapObject;
//# sourceMappingURL=MapObject.js.map