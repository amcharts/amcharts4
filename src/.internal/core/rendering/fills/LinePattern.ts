/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Pattern, PatternProperties } from "./Pattern";
import { AMElement } from "../AMElement";
import { registry } from "../../Registry";
import * as $path from "../../rendering/Path";

export interface LinePatternProperties extends PatternProperties {
	gap: number;
};


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
	 */
	protected _line: AMElement;

	/**
	 * Defines property types.
	 */
	public _properties!: LinePatternProperties;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.properties["gap"] = 0;
		this._line = this.paper.add("path");
		this.addElement(this._line);
	}

	/**
	 * Draws the pattern.
	 */
	protected draw(): void {
		super.draw();
		if (Math.round(this.rotation / 90) != this.rotation / 90) {
			this.properties["shapeRendering"] = "auto";
		}
		if (this._line) {
			let w = this.width;
			let h = this.height;

			let path = "";

			if (!this.gap) {
				if (Math.round(this.rotation / 90) != this.rotation / 90) {
					path = $path.moveTo({ x: -w, y: h / 2 }) + $path.lineTo({ x: w * 2, y: h / 2 });

					this.properties["rotationX"] = this.width / 2;
					this.properties["rotationY"] = this.height / 2;
				}
				else {
					path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: w, y: 0 });
				}
			}
			else {
				let step = this.gap + this.strokeWidth;
				let count = this.height / step;

				for (let i = -count / 2; i < count * 1.5; i++) {
					if (Math.round(this.rotation / 90) != this.rotation / 90) {
						path += $path.moveTo({ x: -w, y: (i + 0.5) * step }) + $path.lineTo({ x: w * 2, y: (i + 0.5) * step });

						this.properties["rotationX"] = this.width / 2;
						this.properties["rotationY"] = this.height / 2;
					}
					else {
						path += $path.moveTo({ x: -w, y: i * step }) + $path.lineTo({ x: w * 2, y: i * step });
					}
				}
			}

			this._line.attr({ "d": path });
		}
	}


	/**
	 * Number of pixels between pattern lines.
	 *
	 * The pattern will automatically draw required number of lines to fill
	 * pattern area maintaining `gap` distance between them.
	 *
	 * 0 (zero) means only single line will be drawn.
	 *
	 * @default 0
	 * @since 4.7.7
	 */
	public set gap(value: number) {
		this.properties["gap"] = value;
		this.draw();
	}

	/**
	 * @return gap
	 */
	public get gap(): number {
		return this.properties["gap"];
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LinePattern"] = LinePattern;
