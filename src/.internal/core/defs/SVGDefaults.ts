/**
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Color, color } from "../utils/Color"

/**
 * Defines a class that holds default properties for new SVG elements
 */
export class SVGDefaults {
	static opacity: number = 1;
	static strokeOpacity: number = 1;
	static strokeWidth: number = 1;
	static fillOpacity: number = 1;
	static fill: Color = color("#000000");
	static stroke: Color = color("#000000");
	static focusable: boolean = undefined;
	static tabindex: number = 0;
}
