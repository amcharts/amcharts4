/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../../Base";
import { LinearGradient } from "./LinearGradient";
import { RadialGradient } from "./RadialGradient";
import { Color } from "../../utils/Color";
import { registry } from "../../Registry";


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A base class for color modifiers.
 *
 * @ignore Exclude from docs
 */
export class ColorModifier extends BaseObject {

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ColorModifier";
		this.applyTheme();
	}

	/**
	 * Modifies color value.
	 *
	 * @ignore Exclude from docs
	 * @param value  Original color
	 * @return Modified
	 */
	public modify(value: Color): Color | LinearGradient | RadialGradient {
		return value;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ColorModifier"] = ColorModifier;
