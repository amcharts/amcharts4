/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Pattern } from "./Pattern";
import { AMElement } from "../AMElement";
import { registry } from "../../Registry";


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Line pattern.
 */
export class LinePattern extends Pattern {

	/**
	 * SVG `<line>` element used for pattern.
	 * 
	 * @type {AMElement}
	 */
	protected _line: AMElement;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this._line = this.paper.add("line");
		this.addElement(this._line);
	}

	/**
	 * Draws the pattern.
	 */
	protected draw(): void {
		super.draw();
		if (this._line) {
			this._line.attr({ "x2": this.width * 2 }); // to solve rotation
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LinePattern"] = LinePattern;
