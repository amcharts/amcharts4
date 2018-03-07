/**
 * Mouse-related functionality
 */
/**
 * Defines static methods that hold style list for various mouse cursor styles,
 * maintaining browser compatibility.
 */
var MouseCursorStyle = /** @class */ (function () {
    function MouseCursorStyle() {
    }
    /**
     * Styles for "grab" mouse cursor.
     *
     * @type {Array<IStyleProperty>}
     */
    MouseCursorStyle.grab = [{
            "property": "cursor",
            "value": "move"
        }, {
            "property": "cursor",
            "value": "grab"
        }, {
            "property": "cursor",
            "value": "-moz-grab"
        }, {
            "property": "cursor",
            "value": "-webkit-grab"
        }];
    /**
     * Styles for "grabbing" mouse cursor.
     *
     * @type {Array<IStyleProperty>}
     */
    MouseCursorStyle.grabbing = [{
            "property": "cursor",
            "value": "move"
        }, {
            "property": "cursor",
            "value": "grabbing"
        }, {
            "property": "cursor",
            "value": "-moz-grabbing"
        }, {
            "property": "cursor",
            "value": "-webkit-grabbing"
        }];
    /**
     * Styles for "pointer" mouse cursor. (usually used for links)
     *
     * @type {Array<IStyleProperty>}
     */
    MouseCursorStyle.pointer = [{
            "property": "cursor",
            "value": "pointer"
        }];
    /**
     * Styles for default mouse cursor. (browser determines style)
     *
     * @type {Array<IStyleProperty>}
     */
    MouseCursorStyle.default = [{
            "property": "cursor",
            "value": "default"
        }];
    /**
     * Styles for horizontal bi-directional resize mouse cursor.
     *
     * @type {Array<IStyleProperty>}
     */
    MouseCursorStyle.horizontalResize = [{
            "property": "cursor",
            "value": "ew-resize"
        }];
    /**
     * Styles for vertical bi-directional mouse cursor.
     *
     * @type {Array<IStyleProperty>}
     */
    MouseCursorStyle.verticalResize = [{
            "property": "cursor",
            "value": "ns-resize"
        }];
    return MouseCursorStyle;
}());
export { MouseCursorStyle };
//# sourceMappingURL=Mouse.js.map