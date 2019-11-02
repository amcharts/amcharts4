/**
 * Rectangular pattern module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Pattern, PatternProperties } from "./Pattern";
import { AMElement } from "../AMElement";
import { registry } from "../../Registry";
import * as $type from "../../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for circle pattern
 */
export interface CirclePatternProperties extends PatternProperties {
	radius: number;
};


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Circular pattern
 */
export class CirclePattern extends Pattern {

	/**
	 * Reference to `<circle>` element used in pattern.
	 */
	protected _circle: $type.Optional<AMElement>;

	/**
	 * Defines property types.
	 */
	public _properties!: CirclePatternProperties;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.properties["radius"] = 2;
		this._circle = this.paper.add("circle");
		this.addElement(this._circle);
	}

	/**
	 * Draws the circle element.
	 */
	protected draw(): void {
		super.draw();
		if (this._circle) {
			this._circle.attr({ "r": this.radius, "cx": this.width / 2, "cy":this.height / 2});
		}
	}

	/**
	 * Circle radius in pixels.
	 *
	 * @param value Radius (px)
	 */
	public set radius(value: number) {
		this.properties["radius"] = value;
		this.draw();
	}

	/**
	 * @return Radius (px)
	 */
	public get radius(): number {
		return this.properties["radius"];
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CirclePattern"] = CirclePattern;
