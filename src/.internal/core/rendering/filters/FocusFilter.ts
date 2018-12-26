/**
 * Module for "Focus" filter.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../../Sprite";
import { Filter, FilterProperties } from "./Filter";
import { AMElement } from "../AMElement";
import { Color } from "../../utils/Color";
import { InterfaceColorSet } from "../../utils/InterfaceColorSet";
import { StyleRule, StyleClass } from "../../utils/DOM";
import * as $type from "../../utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines additional properties relative to the "Focus" filter.
 */
export interface FocusFilterProperties extends FilterProperties {

	/**
	 * Opacity of the outline. (0-1)
	 *
	 * @type {number}
	 */
	opacity?: number;

	/**
	 * Stroke (outline) color.
	 *
	 * @type {Color}
	 */
	stroke?: Color;

	/**
	 * Stroke (outline) thickness in pixels.
	 *
	 * @type {number}
	 */
	strokeWidth?: number;

	/**
	 * Stroke (outline) opacity. (0-1)
	 *
	 * @type {number}
	 */
	strokeOpacity?: number;

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a "Focus" filter.
 */
export class FocusFilter extends Filter {

	/**
	 * Defines property types.
	 *
	 * @type {FocusFilterProperties}
	 */
	public _properties!: FocusFilterProperties;

	/**
	 * A storage for Filter property/value pairs.
	 * @see [@link FocusFilterProperties]
	 * @type {Dictionary<FocusFilterProperties, any>}
	 */
	//public propertyValues: Dictionary<FocusFilterProperties, any>;

	/**
	 * Reference to the `<feFlood>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {AMElement}
	 */
	public feFlood: AMElement;

	/**
	 * Reference to the `<feMorphology>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {AMElement}
	 */
	public feMorphology: AMElement;

	/**
	 * Reference to the `<feFlood>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {AMElement}
	 */
	public feColorMatrix: AMElement;

	/**
	 * Reference to the `<feComposite>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {AMElement}
	 */
	public feComposite: AMElement;

	/**
	 * Reference to the `<feFlood>` element.
	 *
	 * @ignore Exclude from docs
	 * @type {AMElement}
	 */
	public feBlend: AMElement;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "FocusFilter";

		// Create elements
		// NOTE: we do not need to add each individual element to `_disposers`
		// because `filterPrimitives` has an event handler which automatically adds
		// anything added to it to `_disposers`
		this.feFlood = this.paper.add("feFlood");
		this.feFlood.attr({ "flood-color": new InterfaceColorSet().getFor("primaryButtonHover"), "result": "base" });
		this.filterPrimitives.push(this.feFlood);

		this.feMorphology = this.paper.add("feMorphology");
		this.feMorphology.attr({ "result": "bigger", "in": "SourceGraphic", "operator": "dilate", "radius": "2" });
		this.filterPrimitives.push(this.feMorphology);

		this.feColorMatrix = this.paper.add("feColorMatrix");
		this.feColorMatrix.attr({ "result": "mask", "in": "bigger", "type": "matrix", "values": "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" });
		this.filterPrimitives.push(this.feColorMatrix);

		this.feComposite = this.paper.add("feComposite");
		this.feComposite.attr({ "result": "drop", "in": "base", "in2": "mask", "operator": "in" });
		this.filterPrimitives.push(this.feComposite);

		this.feBlend = this.paper.add("feBlend");
		this.feBlend.attr({ "in": "SourceGraphic", "in2": "drop", "mode": "normal" });
		this.filterPrimitives.push(this.feBlend);

		// Set default properties
		this.width = 130;
		this.height = 130;

		this.applyTheme();
	}

	/**
	 * Stroke (outline) color.
	 *
	 * @param {Color}  value  Color
	 */
	public set stroke(value: $type.Optional<Color>) {
		this.properties["stroke"] = value;
		this.feFlood.attr({ "flood-color": value });
	}

	/**
	 * @return {Optional<Color>} Color
	 */
	public get stroke(): $type.Optional<Color> {
		return this.properties["stroke"];
	}

	/**
	 * Stroke (outline) thickness in pixels.
	 *
	 * @param {number}  value  Outline thickness (px)
	 */
	public set strokeWidth(value: $type.Optional<number>) {
		this.properties["strokeWidth"] = value;
		this.feMorphology.attr({ "radius": value });
	}

	/**
	 * @return {number} Outline thickness (px)
	 */
	public get strokeWidth(): $type.Optional<number> {
		return this.properties["strokeWidth"];
	}

	/**
	 * Opacity of the outline. (0-1)
	 *
	 * @param {number}  value  Outline opacity (0-1)
	 */
	public set opacity(value: $type.Optional<number>) {
		this.properties["opacity"] = value;
		this.feColorMatrix.attr({ "values": "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " + value + " 0" });
	}

	/**
	 * @return {number} Outline opacity (0-1)
	 */
	public get opacity(): $type.Optional<number> {
		return this.properties["opacity"];
	}

	/**
	 * Sets filter's target element.
	 *
	 * In addition it also disables built-in focus outline on element this
	 * filter is applied to.
	 *
	 * @ignore Exclude from docs
	 * @param {Sprite}  value  Element filter is being attached to
	 */
	protected setSprite(value: Sprite): void {
		if (this._sprite && this._sprite != value) {
			this._sprite.group.removeStyle("outline");
		}
		value.group.addStyle({
			"outline": "none"
		});
		super.setSprite(value);
	}

}
