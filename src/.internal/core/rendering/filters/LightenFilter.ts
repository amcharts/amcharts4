/**
 * Module for "Lighten" filter.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Filter, FilterProperties } from "./Filter";
import { AMElement } from "../AMElement";
import { registry } from "../../Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines additional properties relative to the "Lighten" filter
 */
export interface LightenFilterProperties extends FilterProperties {

	/**
	 * Lightness.
	 */
	lightness: number;

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a "Lighten" filter.
 */
export class LightenFilter extends Filter {

	/**
	 * Defines property types.
	 */
	public _properties!: LightenFilterProperties;

	/**
	 * A storage for Filter property/value pairs.
	 * @see [@link LightenFilterProperties]
	 */
	//public propertyValues: Dictionary<LightenFilterProperties, any>;

	/**
	 * Reference to the `<feColorMatrix>` element.
	 *
	 * @ignore Exclude from docs
	 */
	public feColorMatrix: AMElement;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "LightenFilter";

		// Create elements
		// NOTE: we do not need to add each individual element to `_disposers`
		// because `filterPrimitives` has an event handler which automatically adds
		// anything added to it to `_disposers`
		this.feColorMatrix = this.paper.add("feColorMatrix");
		this.feColorMatrix.attr({ "type": "matrix" });
		this.filterPrimitives.push(this.feColorMatrix);

		// Set default properties
		this.lightness = 0;

		this.applyTheme();
	}

	/**
	 * Lightness of the target colors.
	 *
	 * If `lightness` is a positive number, the filter will make all colors
	 * lighter.
	 *
	 * If `lightness` is negative, colors will be darkened.
	 *
	 * @param value  Lightness
	 */
	public set lightness(value: number) {
		this.properties["lightness"] = value;
		let v = value + 1;
		this.feColorMatrix.attr({ "values": v + " 0 0 0 0 0 " + v + " 0 0 0 0 0 " + v + " 0 0 0 0 0 1 0" });
	}

	/**
	 * @return Lightness
	 */
	public get lightness(): number {
		return this.properties["lightness"];
	}

}


/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LightenFilter"] = LightenFilter;
