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
    /**
     * Whether the chart should only display when its container is visible
     * on the document viewport.
     *
     * This setting can be combined with `queue` for better performance.
     *
     * @default false
     * @since 4.5.0
     */
    onlyShowOnViewport: boolean;
    /**
     * A reference to the HTML element to be used as a secondary viewport for
     * charts.
     *
     * Use this if you are placing charts in a scrollable container and using
     * with `onlyShowOnViewport = true`.
     *
     * @since 4.7.4
     */
    viewportTarget?: HTMLElement;
    /**
     * Whether to queue all charts rendering. One chart will be rendered at a time. The next
     * chart starts to render after the previous chart's ready event.
     *
     * This setting can be combined with `onlyShowOnViewport` for better performance.
     *
     * @default false
     * @since 4.5.0
     */
    queue: boolean;
    /**
     * List of applied licenses.
     *
     * @type {String[]}
     */
    licenses: String[];
}
/**
 * Global options.
 */
export declare const options: Options;
