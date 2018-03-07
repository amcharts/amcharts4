/**
 * Mouse-related functionality
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IStyleProperty } from "../defs/IStyleProperty";
/**
 * Defines static methods that hold style list for various mouse cursor styles,
 * maintaining browser compatibility.
 */
export declare class MouseCursorStyle {
    /**
     * Styles for "grab" mouse cursor.
     *
     * @type {Array<IStyleProperty>}
     */
    static grab: Array<IStyleProperty>;
    /**
     * Styles for "grabbing" mouse cursor.
     *
     * @type {Array<IStyleProperty>}
     */
    static grabbing: Array<IStyleProperty>;
    /**
     * Styles for "pointer" mouse cursor. (usually used for links)
     *
     * @type {Array<IStyleProperty>}
     */
    static pointer: Array<IStyleProperty>;
    /**
     * Styles for default mouse cursor. (browser determines style)
     *
     * @type {Array<IStyleProperty>}
     */
    static default: Array<IStyleProperty>;
    /**
     * Styles for horizontal bi-directional resize mouse cursor.
     *
     * @type {Array<IStyleProperty>}
     */
    static horizontalResize: Array<IStyleProperty>;
    /**
     * Styles for vertical bi-directional mouse cursor.
     *
     * @type {Array<IStyleProperty>}
     */
    static verticalResize: Array<IStyleProperty>;
}
