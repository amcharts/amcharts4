/**
 * Modal class is used to display information over chart area.
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
import { Popup } from "./Popup";
import { Adapter } from "../utils/Adapter";
/**
 * Shows an HTML modal which covers window or a chart area.
 *
 * @todo Positioning over whole window
 */
var Modal = /** @class */ (function (_super) {
    __extends(Modal, _super);
    /**
     * Constructor
     */
    function Modal() {
        var _this = _super.call(this) || this;
        /**
         * Adapter.
         *
         * @type {Adapter<Modal, IModalAdapters>}
         */
        _this.adapter = new Adapter(_this);
        _this.className = "Modal";
        _this.showCurtain = true;
        _this.draggable = false;
        return _this;
    }
    return Modal;
}(Popup));
export { Modal };
//# sourceMappingURL=Modal.js.map