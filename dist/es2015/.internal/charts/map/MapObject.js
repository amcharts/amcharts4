/**
 * Map object module
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
    __extends(MapObject, _super);
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