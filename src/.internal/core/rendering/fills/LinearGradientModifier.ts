/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { LinearGradient } from "./LinearGradient";
import { GradientModifier } from "./GradientModifier";
import { registry } from "../../Registry";


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
 * let fillModifier = new am4core.LinearGradientModifier();
 * fillModifier.opacities = [1, 1, 0];
 * fillModifier.offsets = [0, 0.8, 1];
 * columnSeries.columns.template.fillModifier = fillModifier;
 * ```
 * ```JavaScript
 * var fillModifier = new am4core.LinearGradientModifier();
 * fillModifier.opacities = [1, 1, 0];
 * fillModifier.offsets = [0, 0.8, 1];
 * columnSeries.columns.template.fillModifier = fillModifier;
 * ```
 * ```JSON
 * "series": [{
 *   "type": "ColumnSeries",
 *   "columns": {
 *     "fillModifier": {
 *       "type": "LinearGradientModifier",
 *       "opacities": [1, 1, 0],
 *       "offsets": [0, 0.8, 1]
 *     }
 *   }
 * }]
 * ```
 */
export class LinearGradientModifier extends GradientModifier {

	/**
	 * A reference to the gradient instance that this modifier is used for.
	 */
	public gradient: LinearGradient;


	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.className = "LinearGradientModifier";
		this.gradient = new LinearGradient();
		this.applyTheme();
	}

	public copyFrom(source: this) {
		super.copyFrom(source);
		this.gradient = source.gradient.clone();
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LinearGradientModifier"] = LinearGradientModifier;
