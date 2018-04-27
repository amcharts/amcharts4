/**
 * Cursor module
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
import { getInteraction } from "../../core/interaction/Interaction";
import { registry } from "../../core/Registry";
import { percent } from "../../core/utils/Percent";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Main Cursor class with common cursor functionality.
 *
 * Chart-specific cursors must extend this class.
 *
 * @see {@link ICursorEvents} for a list of available events
 * @see {@link ICursorAdapters} for a list of available Adapters
 * @todo Add description, examples
 * @todo Should we allow changing `_generalBehavior`?
 */
var Cursor = /** @class */ (function (_super) {
    __extends(Cursor, _super);
    /**
     * Constructor
     */
    function Cursor() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Current cursor position during selection.
         *
         * @type {IPoint}
         * @todo Better description
         */
        _this.point = { x: 0, y: 0 };
        _this.className = "Cursor";
        // Set defaults
        //this.background.fillOpacity = 0.5;
        //this.background.fill = color("#dadada");
        _this.width = percent(100);
        _this.height = percent(100);
        _this.shouldClone = false;
        _this.hide(0);
        _this.trackable = true;
        _this.clickable = true;
        _this.isMeasured = false;
        _this.mouseEnabled = false;
        // Add events on body to trigger down and up events (to start zooming or
        // selection)
        var interaction = getInteraction();
        interaction.body.events.on("down", _this.handleCursorDown, _this);
        interaction.body.events.on("up", _this.handleCursorUp, _this);
        interaction.body.events.on("track", _this.handleCursorMove, _this);
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Handle pointer movement in document and update cursor position as needed.
     *
     * @ignore Exclude from docs
     * @param {IInteractionEvents["track"]} event Event
     */
    Cursor.prototype.handleCursorMove = function (event) {
        var local = $utils.documentPointToSprite(event.pointer.point, this);
        // hide cursor if it's out of bounds
        if (this.fitsToBounds(local)) {
            this.show(0);
        }
        else {
            // unless we are selecting (mouse is down)
            if (!this.downPoint) {
                this.hide(0);
            }
        }
        this.point = local;
        this.getPositions();
        this.dispatch("cursorpositionchanged");
        return local;
    };
    /**
     * Updates cursors current positions.
     */
    Cursor.prototype.getPositions = function () {
        // positions are used by axes or series
        this.xPosition = this.point.x / this.innerWidth;
        this.yPosition = 1 - this.point.y / this.innerHeight;
    };
    /**
     * Handles pointer down event so we can start zoom or selection.
     *
     * @ignore Exclude from docs
     * @param {IInteractionEvents["down"]} event Original event
     */
    Cursor.prototype.handleCursorDown = function (event) {
        switch (this._generalBehavior) {
            case "zoom":
                this.dispatchImmediately("zoomstarted");
                break;
            case "select":
                this.dispatchImmediately("selectstarted");
                break;
            case "pan":
                this.dispatchImmediately("panstarted");
                break;
        }
    };
    /**
     * Handles pointer up event - finishes zoom or selection action.
     *
     * @ignore Exclude from docs
     * @param {IInteractionEvents["up"]} event Original event
     */
    Cursor.prototype.handleCursorUp = function (event) {
        this.upPoint = $utils.documentPointToSprite(event.pointer.point, this);
        if ($math.getDistance(this.upPoint, this.downPoint) > 5) {
            switch (this._generalBehavior) {
                case "zoom":
                    this.dispatchImmediately("zoomended");
                    break;
                case "select":
                    this.dispatchImmediately("selectended");
                    break;
                case "pan":
                    this.dispatchImmediately("panended");
                    break;
            }
        }
        this.downPoint = undefined;
    };
    Object.defineProperty(Cursor.prototype, "chart", {
        /**
         * @return {Chart} Chart
         */
        get: function () {
            return this._chart;
        },
        /**
         * A reference to a [[Chart]] the cursor belongs to.
         *
         * @param {Chart}  value  Chart
         */
        set: function (value) {
            this._chart = value;
        },
        enumerable: true,
        configurable: true
    });
    return Cursor;
}(Container));
export { Cursor };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Cursor"] = Cursor;
//# sourceMappingURL=Cursor.js.map