/**
 * Label class is used to put textual elements on the chart. It uses [[Text]] to
 * add actual text, but is in itself a [[Container]] so that various sizing and
 * placement options can be applied to it.
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
import { Container } from "../Container";
import { Text } from "./Text";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Label class is used to put textual elements on the chart. It uses [[Text]] to
 * add actual text, but is in itself a [[Container]] so that various sizing and
 * placement options can be applied to it.
 *
 * @see {@link ILabelEvents} for a list of available events
 * @see {@link ILabelAdapters} for a list of available Adapters
 */
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    /**
     * Constructor
     */
    function Label() {
        var _this = _super.call(this) || this;
        _this.className = "Label";
        _this.textElement = new Text();
        _this.cloneChildren = false;
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(Label.prototype, "textElement", {
        /**
         * @return {Text} Text instance
         */
        get: function () {
            return this._textElement;
        },
        /**
         * A [[Text]] instance to be used as label element.
         *
         * @param {Text}  textElement  Text instance
         */
        set: function (textElement) {
            if (this._textElement) {
                //this._textElement.dispose();
                this.removeDispose(this._textElement);
            }
            if (textElement) {
                this._textElement = textElement;
                textElement.parent = this;
                textElement.align = "left";
                textElement.valign = "top";
                this._disposers.push(this._textElement);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "text", {
        /**
         * A plain text for the label.
         *
         * @param {string}  value  Text
         */
        set: function (value) {
            this.textElement.text = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "html", {
        /**
         * An HTML content for the label.
         *
         * @param {string}  value  HTML
         */
        set: function (value) {
            this.textElement.html = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets data item for the label.
     *
     * This wil be used in resolving field references in text and replacing them
     * with real values.
     *
     * @ignore Exclude from docs
     * @param {DataItem} dataItem [description]
     */
    Label.prototype.setDataItem = function (dataItem) {
        this.textElement.dataItem = dataItem;
        _super.prototype.setDataItem.call(this, dataItem);
    };
    /**
     * Copies all properties from another [[Label]] instance.
     *
     * @param {Label}  label  Source element
     */
    Label.prototype.copyFrom = function (label) {
        _super.prototype.copyFrom.call(this, label);
        this.textElement.copyFrom(label.textElement);
    };
    return Label;
}(Container));
export { Label };
//# sourceMappingURL=Label.js.map