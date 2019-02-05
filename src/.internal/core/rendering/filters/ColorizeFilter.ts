/**
 * Module for "Colorize" filter.
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
import * as $type from "../../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines additional properties relative to the "Colorize" filter.
 */
export interface ColorizeFilterProperties extends FilterProperties {

	/**
	 * Color.
	 */
	color?: Color;

	/**
	 * Intensity. (0-1)
	 *
	 * @default 1
	 */
	intensity: number;

};


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a "Colorize" filter.
 */
export class ColorizeFilter extends Filter {

	/**
	 * Defines property types.
	 */
	public _properties!: ColorizeFilterProperties;

	/**
	 * A storage for Filter property/value pairs.
	 * @see [@link ColorizeFilterProperties]
	 */
	//public propertyValues: Dictionary<ColorizeFilterProperties, any>;

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
		this.className = "ColorizeFilter";

		// Create elements
		// NOTE: we do not need to add each individual element to `_disposers`
		// because `filterPrimitives` has an event handler which automatically adds
		// anything added to it to `_disposers`
		this.feColorMatrix = this.paper.add("feColorMatrix");
		this.feColorMatrix.attr({ "type": "matrix" });
		//this.feColorMatrix.setAttribute("in", "SourceAlpha");
		this.filterPrimitives.push(this.feColorMatrix);

		// Set default properties
		this.intensity = 1;

		this.applyTheme();
	}

	/**
	 * (Re)applies colors to the already existing filter by modifying filyer's
	 * color matrix element.
	 *
	 * @ignore Exclude from docs
	 */
	public applyFilter(): void {

		let i: number = this.intensity;
		let ii = 1 - i;

		let r: number;
		let g: number;
		let b: number;

		const color = this.color;

		if (color && color.rgb) {
			r = color.rgb.r / 255 * i;
			g = color.rgb.g / 255 * i;
			b = color.rgb.b / 255 * i;

		} else {
			r = 0;
			g = 0;
			b = 0;
		}

		this.feColorMatrix.attr({ "values": ii + " 0 0 0 " + r + " 0 " + ii + " 0 0 " + g + " 0 0 " + ii + " 0 " + b + " 0 0 0 1 0" });
	}

	/**
	 * Target color to apply to the element.
	 *
	 * Depending on the `intensity`, all colors of the target element will steer
	 * towards this color.
	 *
	 * E.g. setting to `am4core.color("greener")` will make all colors greener.
	 *
	 * @param value  Color
	 */
	public set color(value: $type.Optional<Color>) {
		this.properties["color"] = value;
		this.applyFilter();
	}

	/**
	 * @return Color
	 */
	public get color(): $type.Optional<Color> {
		return this.properties["color"];
	}

	/**
	 * Intensity of the color (0-1).
	 *
	 * The bigger the number the more of a `color` target's colors will become.
	 *
	 * 0 means the colors will remain as they are.
	 * 1 means all colors will become the target `color`.
	 *
	 * @default 1
	 * @param value  Intensity (0-1)
	 */
	public set intensity(value: number) {
		this.properties.intensity = value;
		this.applyFilter();
	}

	/**
	 * @return Intensity (0-1)
	 */
	public get intensity(): number {
		return this.properties.intensity;
	}

}


/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ColorizeFilter"] = ColorizeFilter;
