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
	 */
	static grab: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "move"
	}, {
		"property": "cursor",
		"value": "grab"
	}, {
		"property": "cursor",
		"value": "-webkit-grab"
	}];

	/**
	 * Styles for "grabbing" mouse cursor.
	 */
	static grabbing: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "move"
	}, {
		"property": "cursor",
		"value": "grabbing"
	}, {
		"property": "cursor",
		"value": "-webkit-grabbing"
	}];

	/**
	 * Styles for "pointer" mouse cursor. (usually used for links)
	 */
	static pointer: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "pointer"
	}];

	/**
	 * Styles for default mouse cursor. (browser determines style)
	 */
	static default: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "default"
	}];

	/**
	 * Styles for horizontal bi-directional resize mouse cursor.
	 */
	static horizontalResize: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "ew-resize"
	}];

	/**
	 * Styles for vertical bi-directional mouse cursor.
	 */
	static verticalResize: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "ns-resize"
	}];

	/**
	 * Styles for "no-allowed" cursor.
	 * @since 4.7.15
	 */
	static notAllowed: Array<IStyleProperty> = [{
		"property": "cursor",
		"value": "not-allowed"
	}];

}
