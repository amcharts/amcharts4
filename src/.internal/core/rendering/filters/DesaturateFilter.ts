/**
 * Module for "Desaturate" filter.
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
import * as $type from "../../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines additional properties relative to the "Desaturate" filter
 */
export interface DesaturateFilterProperties extends FilterProperties {

	/**
	 * Saturation. (0-1)
	 *
	 * @type {number}
	 */
	saturation: number;

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creats a "Desaturate" filter
 */
export class DesaturateFilter extends Filter {

	/**
	 * Defines property types.
	 *
	 * @type {DesaturateFilterProperties}
	 */
	public _properties!: DesaturateFilterProperties;

	/**
	 * A storage for Filter property/value pairs.
	 * @see [@link DesaturateFilterProperties]
	 * @type {Dictionary<DesaturateFilterProperties, any>}
	 */
	//public propertyValues: Dictionary<DesaturateFilterProperties, any>;

	/**
	 * Reference to the `<feColorMatrix>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {AMElement}
	 */
	public feColorMatrix: AMElement;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "DesaturateFilter";

		// Create elements
		// NOTE: we do not need to add each individual element to `_disposers`
		// because `filterPrimitives` has an event handler which automatically adds
		// anything added to it to `_disposers`
		this.feColorMatrix = this.paper.add("feColorMatrix");
		this.feColorMatrix.attr({ "type": "saturate" });
		this.filterPrimitives.push(this.feColorMatrix);

		// Set default properties
		this.width = 120;
		this.height = 120;

		this.saturation = 0;

		this.applyTheme();
	}

	/**
	 * Saturation.
	 *
	 * 0 - completely desaturated.
	 * 1 - fully saturated (gray).
	 *
	 * @param {number}  value  Saturation (0-1)
	 */
	public set saturation(value: number) {
		this.properties["saturation"] = value;
		this.feColorMatrix.attr({ "values": value.toString() });
	}

	/**
	 * @return {number} Saturation (0-1)
	 */
	public get saturation(): number {
		return this.properties["saturation"];
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["DesaturateFilter"] = DesaturateFilter;
