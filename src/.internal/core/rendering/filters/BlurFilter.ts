/**
 * Module for "Blur" filter.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Filter, FilterProperties } from "./Filter";
import { AMElement } from "../AMElement";
import { Color } from "../../utils/Color";
import { registry } from "../../Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines additional properties relative to the "Blur" filter.
 */
export interface BlurFilterProperties extends FilterProperties {

	/**
	 * Horizontal offset in pixels.
	 *
	 * @ignore Deprecated
	 * @deprecated ?
	 * @todo Remove?
	 */
	dx?: number;

	/**
	 * Vertical offset in pixels.
	 *
	 * @ignore Deprecated
	 * @deprecated ?
	 * @todo Remove?
	 */
	dy?: number;

	/**
	 * Blur value.
	 */
	blur: number;

	/**
	 * Opacity. (0-1)
	 *
	 * @ignore Deprecated
	 * @deprecated ?
	 * @todo Remove?
	 */
	opacity?: number;

	/**
	 * Color.
	 *
	 * @ignore Deprecated
	 * @deprecated ?
	 * @todo Remove?
	 */
	color?: Color;

};


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a "Blur" filter.
 */
export class BlurFilter extends Filter {

	/**
	 * Defines property types.
	 */
	public _properties!: BlurFilterProperties;

	/**
	 * A storage for Filter property/value pairs.
	 * @see [@link BlurFilterProperties]
	 */
	//public propertyValues: Dictionary<BlurFilterProperties, any>;

	/**
	 * Reference to the `<feGaussianBlur>` element.
	 *
	 * @ignore Exclude from docs
	 */
	public feGaussianBlur: AMElement;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "BlurFilter";

		// Create elements
		// NOTE: we do not need to add each individual element to `_disposers`
		// because `filterPrimitives` has an event handler which automatically adds
		// anything added to it to `_disposers`

		this.feGaussianBlur = this.paper.add("feGaussianBlur");
		this.feGaussianBlur.attr({ "result": "blurOut", "in": "SourceGraphic" });
		this.filterPrimitives.push(this.feGaussianBlur);

		// Set default properties
		this.width = 200;
		this.height = 200;
		this.blur = 1.5;

		this.applyTheme();
	}

	/**
	 * Blur value.
	 *
	 * The bigger the value, the blurrier the target element will become.
	 *
	 * @default 1.5
	 * @param value Blur
	 */
	public set blur(value: number) {
		this.properties.blur = value;
		this.feGaussianBlur.attr({ "stdDeviation": value / this.scale });
	}

	/**
	 * @return Blur
	 */
	public get blur(): number {
		return this.properties.blur;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["BlurFilter"] = BlurFilter;
