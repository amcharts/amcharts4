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
 * Defines properties for rectangular pattern
 */
export interface RectPatternProperties extends PatternProperties {
	rectWidth: number;
	rectHeight: number;
};


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Rectangular pattern
 */
export class RectPattern extends Pattern {

	/**
	 * Reference to `<rect>` element used in pattern.
	 */
	protected _rect: $type.Optional<AMElement>;

	/**
	 * Defines property types.
	 */
	public _properties!: RectPatternProperties;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.rectHeight = 1;
		this.rectWidth = 1;
		this._rect = this.paper.add("rect");
		this.addElement(this._rect);
	}

	/**
	 * Draws the rectangular element.
	 */
	protected draw(): void {
		super.draw();
		this.properties["rotationX"] = this.width / 2;
		this.properties["rotationY"] = this.height / 2;		
		if (this._rect) {
			this._rect.attr({ "width": this.rectWidth, "height": this.rectHeight, "x":(this.width - this.rectWidth) / 2, "y":(this.height - this.rectHeight) / 2 });
		}
	}

	/**
	 * Rectangle width in pixels.
	 *
	 * @param value Width (px)
	 */
	public set rectWidth(value: number) {
		this.properties["rectWidth"] = value;
		this.draw();
	}

	/**
	 * @return Width (px)
	 */
	public get rectWidth(): number {
		return this.properties["rectWidth"];
	}

	/**
	 * Rectangle height in pixels.
	 *
	 * @param value Height (px)
	 */
	public set rectHeight(value: number) {
		this.properties["rectHeight"] = value;
		this.draw();
	}

	/**
	 * @return Height (px)
	 */
	public get rectHeight(): number {
		return this.properties["rectHeight"];
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["RectPattern"] = RectPattern;
