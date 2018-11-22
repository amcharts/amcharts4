/**
 * Defines system-wide options for amCharts 4.
 *
 * Accessible via singleton object `am4core.options`.
 *
 * Options set here are will be applicable to all charts created afterwards.
 *
 * E.g.:
 *
 * ```TypeScript
 * am4core.options.autoSetClassName = true;
 * ```
 * ```JavaScript
 * am4core.options.autoSetClassName = true;
 * ```
 */
export interface Options {
	/**
	 * Console output enabled.
	 *
	 * @type {boolean}
	 */
	verbose: boolean;

	/**
	 * @ignore
	 */
	commercialLicense: boolean;

	/**
	 * amCharts will add `class` property to some elements. All those class names
	 * will be prefixed by `classNamePrefix`.
	 *
	 * @type {string}
	 */
	classNamePrefix: string;

	/**
	 * Normally, the chart will create its elements without any `className`
	 * attributes.
	 *
	 * If you set this to `true`, it will set class names that will reflect
	 * the actual class this the SVG element corresponds to.
	 *
	 * The className will contain class prefixed with `amcharts-`. (prefix is
	 * configurable via `classNamePrefix`)
	 *
	 * E.g. `"amcharts-button"`.
	 *
	 * @default false
	 * @type {boolean}
	 */
	autoSetClassName: boolean;
}

export const options: Options = {
	verbose: true,
	commercialLicense: false,
	classNamePrefix: "amcharts-",
	autoSetClassName: false
};
