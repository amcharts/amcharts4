/**
 * This module defines a [[Validatable]] class which can be used by all
 * non-[[Sprite]] classes to use system beats to revalidate themselves.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObjectEvents } from "../Base";
import { registry } from "../Registry";
/**
 * This module defines a [[Validatable]] class which can be used by all
 * non-[[Sprite]] classes to use system update cycle to revalidate themselves.
 *
 * @ignore Exclude from docs
 */
var Validatable = /** @class */ (function (_super) {
    tslib_1.__extends(Validatable, _super);
    function Validatable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Is invalid and should be revalidated?
         */
        _this._invalid = false;
        return _this;
    }
    /**
     * Invalidates the element, so that it can re-validate/redraw itself in the
     * next cycle.
     *
     * @ignore Exclude from docs
     */
    Validatable.prototype.invalidate = function () {
        if (this._invalid === false) {
            this._invalid = true;
            registry.events.on("exitframe", this.validate, this);
        }
    };
    /**
     * Validates itself.
     *
     * Most probably the extending class will have an overriding `validate()`
     * method which will do actual work, as well as call this method using
     * `super.validate()`.
     *
     * @ignore Exclude from docs
     */
    Validatable.prototype.validate = function () {
        if (this._invalid === true) {
            this._invalid = false;
            registry.events.off("exitframe", this.validate, this);
        }
    };
    return Validatable;
}(BaseObjectEvents));
export { Validatable };
//# sourceMappingURL=Validatable.js.map