/**
 * Modal class is used to display information over chart area.
 */
import * as tslib_1 from "tslib";
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
    tslib_1.__extends(Modal, _super);
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