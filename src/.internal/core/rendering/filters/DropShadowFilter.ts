/**
 * Module for "Drop Shadow" filter.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Filter, FilterProperties } from "./Filter";
import { AMElement } from "../AMElement";
import { Group } from "../Group";
import { Color, color } from "../../utils/Color";
import { InterfaceColorSet } from "../../utils/InterfaceColorSet";
import { registry } from "../../Registry";
import * as $type from "../../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines additional properties relative to the "Drop Shadow" filter
 */
export interface DropShadowFilterProperties extends FilterProperties {

	/**
	 * Horizontal offset in pixels.
	 *
	 * @type {number}
	 */
	dx: number;

	/**
	 * Vertical offset in pixels.
	 *
	 * @type {number}
	 */
	dy: number;

	/**
	 * Blur.
	 *
	 * @type {number}
	 */
	blur: number;

	/**
	 * Shadow opacity. (0-1)
	 *
	 * @type {number}
	 */
	opacity: number;

	/**
	 * Shadow color.
	 *
	 * @type {Color}
	 */
	color: Color;

};

/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creats a "Drop Shadow" filter.
 */
export class DropShadowFilter extends Filter {

	/**
	 * Defines property types.
	 *
	 * @type {DropShadowFilterProperties}
	 */
	public _properties!: DropShadowFilterProperties;

	/**
	 * A storage for Filter property/value pairs.
	 *
	 * @see [@link DropShadowFilterProperties]
	 * @type {Dictionary<DropShadowFilterProperties, any>}
	 */
	//public propertyValues: Dictionary<DropShadowFilterProperties, any>;


	/**
	 * Reference to the `<feGaussianBlur>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {AMElement}
	 */
	public feGaussianBlur: AMElement;

	/**
	 * Reference to the `<feOffset>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {AMElement}
	 */
	public feOffset: AMElement;

	/**
	 * Reference to the `<feFlood>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {AMElement}
	 */
	public feFlood: AMElement;

	/**
	 * Reference to the `<feFlood>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {AMElement}
	 */
	public feComposite: AMElement;

	/**
	 * Reference to the `<feMerge>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {Group}
	 */
	public feMerge: Group;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "DropShadowFilter";

		// Create elements
		// NOTE: we do not need to add each individual element to `_disposers`
		// because `filterPrimitives` has an event handler which automatically adds
		// anything added to it to `_disposers`

		this.color = color("#000");

		this.feGaussianBlur = this.paper.add("feGaussianBlur");
		this.feGaussianBlur.attr({ "result": "blurOut", "in": "SourceGraphic" });
		this.filterPrimitives.push(this.feGaussianBlur);

		this.feOffset = this.paper.add("feOffset");
		this.feOffset.attr({ "result": "offsetBlur" });
		this.filterPrimitives.push(this.feOffset);

		this.feFlood = this.paper.add("feFlood");
		this.feFlood.attr({ "flood-color": this.color });
		this.filterPrimitives.push(this.feFlood);

		this.feComposite = this.paper.add("feComposite");
		this.feComposite.attr({ "in2": "offsetBlur", operator: "in" });
		this.filterPrimitives.push(this.feComposite);

		this.feMerge = this.paper.addGroup("feMerge");
		this.feMerge.add(this.paper.add("feMergeNode"));
		this.feMerge.add(this.paper.add("feMergeNode").attr({ "in": "SourceGraphic" }));
		this.filterPrimitives.push(this.feMerge);

		// Set default properties
		this.width = 200;
		this.height = 200;
		this.blur = 1.5;
		this.dx = 3;
		this.dy = 3;
		this.opacity = 0.5;


		this.applyTheme();
	}


	/**
	 * Shadow color.
	 *
	 * @param {Color}  value  Color
	 */
	public set color(value: Color) {
		this.properties.color = value;
		if(this.feFlood){
			this.feFlood.attr({ "flood-color": value });
		}
	}

	/**
	 * @return {Color} Color
	 */
	public get color(): Color {
		return this.properties.color;
	}

	/**
	 * Opacity of the shadow. (0-1)
	 *
	 * @param {number}  value  Opacity (0-1)
	 */
	public set opacity(value: number) {
		this.properties.opacity = value;
		this.feFlood.attr({ "flood-opacity": value });
	}

	/**
	 * @return {number} Opacity (0-1)
	 */
	public get opacity(): number {
		return this.properties.opacity;
	}

	/**
	 * Horizontal offset in pixels.
	 *
	 * @param {number}  value  Horizontal offset (px)
	 */
	public set dx(value: number) {
		this.properties.dx = value;
		this.feOffset.attr({ "dx": value / this.scale });
	}

	/**
	 * @return {number} Horizontal offset (px)
	 */
	public get dx(): number {
		return this.properties.dx;
	}

	/**
	 * Vertical offset in pixels.
	 *
	 * @param {number} value Vertical offset (px)
	 */
	public set dy(value: number) {
		this.properties.dy = value;
		this.feOffset.attr({ "dy": value / this.scale });
	}

	/**
	 * @return {number} Vertical offset (px)
	 */
	public get dy(): number {
		return this.properties.dy;
	}

	/**
	 * Blur.
	 *
	 * @param {number}  value  Blur
	 */
	public set blur(value: number) {
		this.properties.blur = value;
		this.feGaussianBlur.attr({ "stdDeviation": value / this.scale });
	}

	/**
	 * @return {number} Blur
	 */
	public get blur(): number {
		return this.properties.blur;
	}

	/**
	 * [updateScale description]
	 *
	 * @todo Description
	 */
	protected updateScale() {
		this.dx = this.dx;
		this.dy = this.dy;
		this.blur = this.blur;
	}

}


/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["DropShadowFilter"] = DropShadowFilter;
