/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColorModifier } from "./ColorModifier";
import { LinearGradient } from "./LinearGradient";
import { RadialGradient } from "./RadialGradient";
import { Color } from "../../utils/Color";
import { registry } from "../../Registry";
import * as $math from "../../utils/Math";
import * as $type from "../../utils/Type";


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This class can be used to modify linear gradient steps, changing visual
 * properties like lightness, brightness, opacity of each set.
 *
 * It can also set offsets for each gradient step.
 *
 * E.g. if I want to fill a columns in a column series to be a solid fill from
 * top to 80% of height, then gradually fades out, I can use the following
 * gradient modifier as a `fillModifier`:
 *
 * ```TypeScript
 * let fillModifier = new am4core.GradientModifier();
 * fillModifier.opacities = [1, 1, 0];
 * fillModifier.offsets = [0, 0.8, 1];
 * columnSeries.columns.template.fillModifier = fillModifier;
 * ```
 * ```JavaScript
 * var fillModifier = new am4core.GradientModifier();
 * fillModifier.opacities = [1, 1, 0];
 * fillModifier.offsets = [0, 0.8, 1];
 * columnSeries.columns.template.fillModifier = fillModifier;
 * ```
 * ```JSON
 * "series": [{
 *   "type": "ColumnSeries",
 *   "columns": {
 *     "fillModifier": {
 *       "type": "GradientModifier",
 *       "opacities": [1, 1, 0],
 *       "offsets": [0, 0.8, 1]
 *     }
 *   }
 * }]
 * ```
 */
export class GradientModifier extends ColorModifier {

	/**
	 * A reference to the gradient instance that this modifier is used for.
	 */
	public gradient: LinearGradient | RadialGradient;

	/**
	 * An array of lightness values for each step.
	 */
	protected _lightnesses!: number[];

	/**
	 * An array of brightness values for each step.
	 */
	protected _brightnesses!: number[];

	/**
	 * An array of opacity values for each step.
	 */
	protected _opacities!: number[];

	/**
	 * An array of relative position (0-1) for each step.
	 *
	 * If not set, all steps will be of equal relative length.
	 */
	protected _offsets!: number[];

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.lightnesses = [];
		this.brightnesses = [];
		this.opacities = [];
		this.offsets = [];
		this.className = "GradientModifier";
		this.applyTheme();
	}

	/**
	 * An array of lightness values for each step.
	 *
	 * @param value  Lightness values
	 */
	public set lightnesses(value: number[]) {
		this._lightnesses = value;
		this._brightnesses = [];
	}

	/**
	 * @return Lightness values
	 */
	public get lightnesses(): number[] {
		return this._lightnesses;
	}

	/**
	 * An array of brightness values for each step.
	 *
	 * @param value  Brightness values
	 */
	public set brightnesses(value: number[]) {
		this._brightnesses = value;
		this._lightnesses = [];
	}

	/**
	 * @return Brightness values
	 */
	public get brightnesses(): number[] {
		return this._brightnesses;
	}

	/**
	 * An array of opacity values for each step.
	 *
	 * @param value  Opacity values
	 */
	public set opacities(value: number[]) {
		this._opacities = value;
	}

	/**
	 * @return Opacity values
	 */
	public get opacities(): number[] {
		return this._opacities;
	}

	/**
	 * An array of relative position (0-1) for each step.
	 *
	 * If not set, all steps will be of equal relative length.
	 *
	 * @param value  Offsets
	 */
	public set offsets(value: number[]) {
		this._offsets = value;
	}

	/**
	 * @return Offsets
	 */
	public get offsets(): number[] {
		return this._offsets;
	}

	/**
	 * Modifies the color based on step setting.
	 *
	 * @ignore Exclude from docs
	 * @param value  Source color
	 * @return A gradient that matches set modification rules
	 */
	public modify(value: Color): Color | LinearGradient | RadialGradient {

		// Clear current gradient
		this.gradient.clear();

		// Get step count
		let count: number = 0;
		if (this.opacities) {
			count = $math.max(count, this.opacities.length);
		}
		if (this.lightnesses) {
			count = $math.max(count, this.lightnesses.length);
		}
		if (this.brightnesses) {
			count = $math.max(count, this.brightnesses.length);
		}

		// Init step values
		let opacity: number = 1,
			lightness: $type.Optional<number>,
			brightness: $type.Optional<number>;

		// Apply steps
		for (let i = 0; i < count; i++) {

			// Take base color
			let color = value;

			// Check if there are any parameters for this step
			if (this.opacities && $type.isNumber(this.opacities[i])) {
				opacity = this.opacities[i];
			}
			if (this.lightnesses && $type.isNumber(this.lightnesses[i])) {
				lightness = this.lightnesses[i];
				brightness = undefined;
			}
			if (this.brightnesses && $type.isNumber(this.brightnesses[i])) {
				brightness = this.brightnesses[i];
				lightness = undefined;
			}

			// Check if we need to brighten/lighten color
			if ($type.isNumber(brightness)) {
				color = value.brighten(this.brightnesses[i]);
			}
			else if ($type.isNumber(lightness)) {
				color = value.lighten(this.lightnesses[i]);
			}

			// Get offset (it's OK if it's undefined)
			let offset: number = this.offsets[i];

			// Apply step
			this.gradient.addColor(color, opacity, offset);
		}
		return this.gradient;
	}

	public copyFrom(source: this) {
		super.copyFrom(source);

		this._offsets = source.offsets;
		this._brightnesses = source.brightnesses;
		this._lightnesses = source.lightnesses;
		this._opacities = source.opacities;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["GradientModifier"] = GradientModifier;
