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
}
export declare const options: Options;
