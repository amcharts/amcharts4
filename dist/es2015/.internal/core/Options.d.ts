/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ILocale } from "./utils/Language";
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
     * @default "amcharts-"
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
     */
    autoSetClassName: boolean;
    /**
     * A default locale to auto-apply to all new charts created.
     */
    defaultLocale?: ILocale;
    /**
     * When multi-segment lines ([[Polyline]]) are drawn some points may be
     * simplified if they are closer than `minPolylineStep`.
     *
     * The bigger this value, the more simplified lines will come out.
     *
     * This setting will effect [[LineSeries]] and derivative classes.
     *
     * @default 0.5
     * @since 4.2.5
     */
    minPolylineStep?: number;
}
export declare const options: Options;
