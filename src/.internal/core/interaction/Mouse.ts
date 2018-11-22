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
export class MouseCursorStyle {

	/**
	 * Styles for "grab" mouse cursor.
	 * 
	 * @type {Array<IStyleProperty>}
	 */
	static grab: Array<IStyleProperty> = [{
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
	static grabbing: Array<IStyleProperty> = [{
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
	static pointer: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "pointer"
	}];

	/**
	 * Styles for default mouse cursor. (browser determines style)
	 * 
	 * @type {Array<IStyleProperty>}
	 */
	static default: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "default"
	}];

	/**
	 * Styles for horizontal bi-directional resize mouse cursor.
	 * 
	 * @type {Array<IStyleProperty>}
	 */
	static horizontalResize: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "ew-resize"
	}];

	/**
	 * Styles for vertical bi-directional mouse cursor.
	 * 
	 * @type {Array<IStyleProperty>}
	 */
	static verticalResize: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "ns-resize"
	}];

}