/**
 * Export module.
 *
 * Parts of Export functionality rely on the following third party libraries:
 *
 * [canvg.js](https://github.com/canvg/canvg)
 * Copyright (c) Gabe Lerner
 * Licensed under [MIT](https://github.com/canvg/canvg/blob/master/LICENSE)
 *
 * [pdfmake](http://pdfmake.org/)
 * Copyright (c) 2014 bpampuch
 * Licensed under [MIT](https://github.com/bpampuch/pdfmake/blob/master/LICENSE)
 *
 * [SheetJS Community Edition](https://github.com/sheetjs/js-xlsx)
 * Licensed under [Apache License 2.0](https://github.com/SheetJS/js-xlsx/blob/master/LICENSE)
 *
 * [JSZip](http://stuartk.com/jszip)
 * Copyright (c) Stuart Knightley
 * Dual licenced under the [MIT license or GPLv3](https://raw.githubusercontent.com/Stuk/jszip/master/LICENSE.markdown).
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ExportMenu } from "./ExportMenu";
import { Adapter } from "../utils/Adapter";
import { Sprite } from "../Sprite";
import { Preloader } from "../elements/Preloader";
import { Modal } from "../elements/Modal";
import { List } from "../utils/List";
import { IDisposer } from "../utils/Disposer";
import { DateFormatter } from "../formatters/DateFormatter";
import { Language } from "../utils/Language";
import { Validatable } from "../utils/Validatable";
import { Color } from "../utils/Color";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Represents an Event object that comes from [[Export]].
 */
export declare type ExportOperation = {
    format?: string;
    options?: any;
};
/**
 * Defines image formats available for export.
 *
 * @type {string}
 */
export declare type imageFormats = "png" | "gif" | "jpg";
/**
 * Represents options for image export.
 */
export interface IExportImageOptions {
    /**
     * Quality of the exported image. (0-1)
     *
     * @type {number}
     */
    quality?: number;
    /**
     * Rescale image.
     *
     * Number less than 1 will shrink the image.
     *
     * Number bigger than 1 will scale up the image.
     *
     * @default 1
     * @type {number}
     */
    scale?: number;
    /**
     * Normally, Export removes "tainted" images (images that are loaded from
     * other host than the chart itself) before export.
     *
     * Set this to `true` to disable it.
     *
     * Please note that removal of tainted images might trigger cross-origin
     * security restrictions in browser and prevent the whole export operation,
     * so use with caution.
     *
     * @default false
     * @type {boolean}
     */
    keepTainted?: boolean;
}
/**
 * Represents options for SVG export.
 */
export interface IExportSVGOptions {
}
/**
 * Available PDF page sizes.
 *
 * @type {string}
 */
export declare type pageSizes = "4A0" | "2A0" | "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "A10" | "B0" | "B1" | "B2" | "B3" | "B4" | "B5" | "B6" | "B7" | "B8" | "B9" | "B10" | "C0" | "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8" | "C9" | "C10" | "RA0" | "RA1" | "RA2" | "RA3" | "RA4" | "SRA0" | "SRA1" | "SRA2" | "SRA3" | "SRA4" | "EXECUTIVE" | "FOLIO" | "LEGAL" | "LETTER" | "TABLOID";
/**
 * Represents options for PDF export.
 */
export interface IExportPDFOptions extends IExportImageOptions {
    /**
     * Font size to use for all texts.
     *
     * @type {number}
     */
    fontSize?: number;
    /**
     * An image format to use for embedded images in PDF.
     *
     * See `imageFormats` in [[Export_module]].
     *
     * @type {string}
     */
    imageFormat?: imageFormats;
    /**
     * Whether to add a URL of the web page the chart has been exported from.
     *
     * @type {boolean}
     * @default true
     */
    addURL?: boolean;
    /**
     * Page size of the exported PDF.
     *
     * See `pageSizes` in [[Export_module]].
     *
     * @type {string}
     */
    pageSize?: pageSizes;
    /**
     * Page orientation.
     */
    pageOrientation?: "landscape" | "portrait";
    /**
     * Page margins.
     *
     * Can be one of the following:
     *
     * A single number, in which case it will act as margin setting
     * for all four edges of the page.
     *
     * An array of two numbers `[ horizontal, vertical ]`.
     *
     * An array of four numbers `[ left, top, right, bottom ]`.
     */
    pageMargins?: number | number[];
}
/**
 * Represents options for CSV export.
 */
export interface IExportCSVOptions {
    /**
     * Separator string to separate columns with.
     *
     * @default ","
     * @type {string}
     */
    separator?: string;
    /**
     * CSV format does not require enclosing values in quotes, unless it
     * contains strings.
     *
     * This setting can be used to enforce enclosing of all values in CSV with
     * quotes.
     *
     * @default false
     * @type {boolean}
     */
    forceQuotes?: boolean;
    /**
     * Add column names in first row?
     *
     * Export will try to use user-friendly column names where possible, either
     * from Export's `dataFields` or deduced from chart's series' names that are
     * bound to specific data fields.
     *
     * @default true
     * @type {boolean}
     */
    addColumnNames?: boolean;
    /**
     * Add rows in reverse order.
     *
     * @default false
     * @type {boolean}
     */
    reverse?: boolean;
    /**
     * Use timestamps instead of formatted date/time values.
     *
     * @default false
     * @type {boolean}
     */
    useTimestamps?: boolean;
    /**
     * Will try to format numbers and date/time according to user's locale
     * settings.
     *
     * @default true
     * @type {boolean}
     */
    useLocale?: boolean;
}
/**
 * Represents options for JSON export
 */
export interface IExportJSONOptions {
    /**
     * Use timestamps instead of formatted date/time values.
     *
     * @default false
     * @type {boolean}
     */
    useTimestamps?: boolean;
    /**
     * Will try to format numbers and date/time according to user's locale
     * settings.
     *
     * @default true
     * @type {boolean}
     */
    useLocale?: boolean;
    /**
     * Sets indent size for each hierarchical elements.
     *
     * @default "  "
     * @type {number}
     */
    indent?: number;
}
/**
 * Represents options for XLSX export.
 */
export interface IExportExcelOptions {
    /**
     * Add column names in first row?
     *
     * Export will try to use user-friendly column names where possible, either
     * from Export's `dataFields` or deduced from chart's series' names that are
     * bound to specific data fields.
     *
     * @default true
     * @type {boolean}
     */
    addColumnNames?: boolean;
    /**
     * Use timestamps instead of formatted date/time values.
     *
     * @default false
     * @type {boolean}
     */
    useTimestamps?: boolean;
    /**
     * Will try to format numbers and date/time according to user's locale
     * settings.
     *
     * @default true
     * @type {boolean}
     */
    useLocale?: boolean;
}
/**
 * Represents options for print.
 */
export interface IExportPrintOptions extends IExportImageOptions {
    /**
     * A delay in milliseconds to wait before initiating print.
     *
     * This delay is necessary to ensure DOM is prepared and repainted before
     * print dialog kicks in.
     *
     * @default 500
     * @type {number}
     */
    delay?: number;
    /**
     * Method to use for printing.
     *
     * If one fails for your particular setup, try the other.
     *
     * "css" - inserts dynamic CSS that hides everything, except the image being printed.
     * "iframe" - creates a dynamic `<iframe>` with the image, then prints it.
     *
     * @default "iframe"
     */
    printMethod?: "css" | "iframe";
}
/**
 * Represents options for custom menu items.
 */
export interface IExportCustomOptions {
}
/**
 * Represents interface for a temporarily removed image.
 */
export interface IExportRemovedObject {
    /**
     * Element that was removed out of DOM.
     *
     * @type {Node}
     */
    element: Node;
    /**
     * A placeholder element that was placed instead of removed element so that
     * we know where to put removed element back in.
     *
     * @type {Node}
     */
    placeholder: Node;
}
/**
 * Represents all available options for all export operations.
 */
export interface IExportOptions {
    png: IExportImageOptions;
    gif: IExportImageOptions;
    jpg: IExportImageOptions;
    svg: IExportSVGOptions;
    pdf: IExportPDFOptions;
    xlsx: IExportExcelOptions;
    csv: IExportCSVOptions;
    json: IExportJSONOptions;
    print: IExportPrintOptions;
    custom: IExportCustomOptions;
}
/**
 * All export options as a type.
 *
 * @ignore Exclude from docs
 */
export declare type ExportOptions = IExportImageOptions | IExportSVGOptions | IExportPDFOptions | IExportExcelOptions | IExportCSVOptions | IExportJSONOptions | IExportPrintOptions;
/**
 * Defines events for export operations.
 */
export interface IExportEvents {
    /**
     * Invoked when Export initializes.
     */
    inited: {};
    /**
     * Invoked when Export menu is created.
     */
    menucreated: {};
    /**
     * Invoked when the Export starts export procedure.
     *
     * You can use event handlers here to modify config before actual export
     * starts.
     *
     * @type {ExportOperation}
     */
    exportstarted: ExportOperation;
    /**
     * Invoked when export operation finishes.
     *
     * @type {ExportOperation}
     */
    exportfinished: ExportOperation;
    /**
     * Invoked when export operation encounters error.
     *
     * @type {ExportOperation}
     */
    error: ExportOperation;
    /**
     * Invoked when export operation times out.
     *
     * Use Export's `timeoutDelay` setting to set timeout. (default: 2000ms)
     *
     * @type {ExportOperation}
     */
    exporttimedout: ExportOperation;
}
/**
 * @ignore Exclude from docs
 */
export declare type Keys = keyof IExportOptions;
/**
 * Represents a list of available adapters for [[Export]].
 */
export interface IExportAdapters {
    supported: {
        supported: boolean;
        type: Keys;
        options?: IExportOptions[Keys];
    };
    exportFunction: {
        func: (type: Keys, options?: IExportOptions[Keys]) => Promise<any>;
        type: Keys;
        options?: IExportOptions[Keys];
    };
    options: {
        options: IExportOptions[Keys];
        type?: Keys;
    };
    title: {
        title: $type.Optional<string>;
        options?: IExportOptions[Keys];
    };
    charset: {
        charset: string;
        type?: Keys;
        options?: IExportOptions[Keys];
    };
    svgToDataURI: {
        data: string;
        options?: IExportOptions[Keys];
    };
    getSVG: {
        data: string;
        options?: IExportOptions[Keys];
    };
    normalizeSVG: {
        data: string;
        options?: IExportOptions[Keys];
    };
    getCSV: {
        data: string;
        options?: IExportOptions[Keys];
    };
    getJSON: {
        data: string;
        options?: IExportOptions[Keys];
    };
    getExcel: {
        data: string;
        options?: IExportOptions[Keys];
    };
    pdfmakeDocument: {
        doc: any;
        options?: IExportOptions[Keys];
    };
    container: {
        container: HTMLElement;
    };
    sprite: {
        sprite: Sprite;
    };
    data: {
        data: Array<any>;
    };
    dataFields: {
        dataFields: any;
    };
    dateFormatter: {
        dateFormatter: DateFormatter;
    };
    dateFormat: {
        dateFormat: $type.Optional<string>;
    };
    dateFields: {
        dateFields: any;
    };
    dataFieldName: {
        name: string;
        field: string;
    };
    isDateField: {
        isDateField: boolean;
        field: string;
    };
    contentType: {
        contentType: string;
        type: Keys;
    };
    filePrefix: {
        filePrefix: string;
    };
    backgroundColor: {
        backgroundColor: $type.Optional<Color>;
    };
    timeoutMessage: {
        message: string;
    };
    xlsxWorkbookOptions: {
        options: any;
    };
    xlsxSheetName: {
        name: string;
    };
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * [[Export]] allows downloading of current snapshot of the chart as an
 * image, PDF, or its data in various formats.
 *
 * The export functionality is enabled by default in charts and is accessible
 * via API or optional export menu.
 *
 * To enable menu, simply access export's `menu` property. E.g.:
 *
 * ```TypeScript
 * chart.exporting.menu = new am4core.ExportMenu();
 * ```
 * ```JavaScript
 * chart.exporting.menu = new am4core.ExportMenu();
 * ```
 * ```JSON
 * {
 *   // ...
 *   "exporting": {
 *     "menu": {}
 *   }
 * }
 * ```
 *
 * To export via API, use `export()` method:
 *
 * ```TypeScript
 * chart.exporting.export(type, [options]);
 * ```
 * ```JavaScript
 * chart.exporting.export(type, [options]);
 * ```
 *
 * E.g.:
 *
 * ```TypeScript
 * chart.exporting.export("png");
 * ```
 * ```JavaScript
 * chart.exporting.export("png");
 * ```
 *
 * @todo Better loading indicator?
 * @todo Implement multiplier option
 * @todo Handling of hanged exports
 * @important
 */
export declare class Export extends Validatable {
    /**
     * XLINK namespace definition.
     *
     * @ignore Exclude from docs
     * @type {string}
     */
    static XLINK: string;
    /**
     * Defines available events.
     *
     * @type {IExportEvents}
     * @ignore Exclude from docs
     */
    _events: IExportEvents;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IExportAdapters}
     */
    _adapter: IExportAdapters;
    /**
     * Adapter.
     *
     * @type {Adapter<Export, IExportAdapters>}
     */
    adapter: Adapter<Export, IExportAdapters>;
    /**
     * Holds options for each format.
     *
     * @ignore Exclude from docs
     * @type {Dictionary<string, ExportOptions>}
     */
    private _formatOptions;
    /**
     * An instance of [[Language]].
     *
     * @ignore Exclude from docs
     * @type {Language}
     */
    protected _language: $type.Optional<Language>;
    /**
     * An instance of [[ExportMenu]].
     *
     * @ignore Exclude from docs
     * @type {Optional<ExportMenu>}
     */
    protected _menu: $type.Optional<ExportMenu>;
    /**
     * Reference to main container to place menu in.
     *
     * @ignore Exclude from docs
     * @type {HTMLElement}
     */
    protected _container: HTMLElement;
    /**
     * [[Sprite]] instance to be used when converting to image.
     *
     * @ignore Exclude from docs
     * @type {Optional<Sprite>}
     */
    protected _sprite: $type.Optional<Sprite>;
    /**
     * Data storage to be used when exporting to data formats.
     *
     * @ignore Exclude from docs
     * @type {any}
     */
    protected _data: any;
    /**
     * Holds an object of field key / field name used to name columns when
     * exporting to data formats.
     *
     * @ignore Exclude from docs
     * @type {any}
     */
    protected _dataFields: any;
    /**
     * A reference to [[DateFormatter]].
     *
     * @ignore Exclude from docs
     * @type {Optional<DateFormatter>}
     */
    protected _dateFormatter: $type.Optional<DateFormatter>;
    /**
     * A Date format to be used when formatting dates in string-based data
     * formats.
     *
     * @ignore Exclude from docs
     * @type {Optional<string>}
     */
    protected _dateFormat: $type.Optional<string>;
    /**
     * A list of column keys that hold date values.
     *
     * @ignore Exclude from docs
     * @type {Optional<List<string>>}
     */
    protected _dateFields: $type.Optional<List<string>>;
    /**
     * Holds a list of objects that were temporarily removed from the DOM while
     * exporting. Those most probably are tainted images, or foreign objects that
     * would otherwise prevent SVG to be converted to canvas.
     *
     * @ignore Exclude from docs
     * @type {List<IExportRemovedObject>}
     */
    protected _removedObjects: List<IExportRemovedObject>;
    /**
     * Exported files will be prefixed with whatever it is set here.
     *
     * @ignore Exclude from docs
     * @type {string}
     */
    protected _filePrefix: string;
    /**
     * Export will try to determine proper background color itself. If you want to
     * override it and use some other color, set this property.
     *
     * @ignore Exclude from docs
     * @type {Optional<Color>}
     */
    protected _backgroundColor: $type.Optional<Color>;
    /**
     * A title to use for some document exports, mainly for print.
     * A document.title will be used if not set.
     *
     * @ignore Exclude from docs
     * @type {Optional<string>}
     */
    protected _title: $type.Optional<string>;
    /**
     * If you are using web fonts (such as Google Fonts), your chart might be
     * using them as well.
     *
     * Normally, exporting to image will require to download these fonts so the
     * are carried over to exported image.
     *
     * This setting can be used to disable or enable this functionality.
     *
     * @default true
     * @type {boolean}
     */
    useWebFonts: boolean;
    /**
     * Many modern displays have use more actual pixels per displayed pixel. This
     * results in sharper images on screen. Unfortunately, when exported to a
     * bitmap image of the sam width/height size it will lose those extra pixels,
     * resulting in somewhat blurry image.
     *
     * This is why we are going to export images larger than they are, so that we
     * don't lose any details.
     *
     * If you'd rather export images without change in size, set this to `false`.
     *
     * @default true
     * @type {boolean}
     */
    useRetina: boolean;
    /**
     * If export operation takes longer than milliseconds in this second, we will
     * show a modal saying export operation took longer than expected.
     *
     * @type {number}
     */
    timeoutDelay: number;
    /**
     * A reference to export timeout.
     *
     * @ignore Exclude from docs
     * @type {Optional<number>}
     */
    protected _timeoutTimeout: $type.Optional<IDisposer>;
    /**
     * Holds reference to [[Modal]] instance.
     *
     * @ignore Exclude from docs
     * @type {Optional<Modal>}
     */
    protected _modal: $type.Optional<Modal>;
    /**
     * Used to log original value of `interactionsEnabled` so that it can be restored
     * after temporarily disabling it.
     *
     * @type {Optional<boolean>}
     */
    private _spriteInteractionsEnabled;
    /**
     * Constructor
     */
    constructor(container: HTMLElement);
    /**
     * @return {Optional<ExportMenu>} ExportMenu instance
     */
    /**
     * An instance of [[ExportMenu]].
     *
     * To add an export menu to a chart, set this to a new instance of
     * [[ExportMenu]].
     *
     * ```TypeScript
     * chart.exporting.menu = new am4core.ExportMenu();
     * ```
     * ```JavaScript
     * chart.exporting.menu = new am4core.ExportMenu();
     * ```
     * ```JSON
     * {
     *   // ...
     *   "exporting": {
     *     "menu": {}
     *   }
     * }
     * ```
     *
     * @param {Optional<ExportMenu>}  menu  ExportMenu instance
     */
    menu: $type.Optional<ExportMenu>;
    /**
     * Checks if this specific menu item type is supported by current system.
     *
     * @param  {string}   type  Menu item type
     * @return {boolean}        `false` if not supported
     */
    typeSupported<Key extends keyof IExportOptions>(type: Key): boolean;
    /**
     * Get function to handle export for particular format.
     *
     * @ignore Exclude from docs
     * @type {this}
     */
    private _getFunction<Key>(type);
    /**
     * Initiates export procedure.
     *
     * @param  {string}   type     Export type
     * @param  {Object}   options  Options
     * @return {boolean}           `true` if export was successful
     * @async
     */
    export<Key extends keyof IExportOptions>(type: Key, options?: IExportOptions[Key]): Promise<boolean>;
    /**
     * A function that should handle unsupported export types.
     *
     * @ignore Exclude from docs
     * @param  {string}              type     Export type
     * @param  {IExportImageOptions} options  Options
     * @return {Promise<string>}               Promise
     * @async
     */
    unsupported<Key extends keyof IExportOptions>(type: Key, options?: IExportOptions[Key]): Promise<string>;
    /**
     * Requests a Print of the chart.
     *
     * @param  {string}               type     Export type
     * @param  {IExportImageOptions}  options  Options
     * @return {Promise<string>}               Promise
     * @async
     */
    getPrint(type: string, options?: IExportPrintOptions): Promise<string>;
    /**
     * A function that returns data: URI encoded @font-family, so that way it can be embedded into SVG.
     *
     * @ignore Exclude from docs
     * @return {Promise<string>} String which can be embedded directly into a <style> element.
     * @async
     */
    getFontFamilies(): Promise<{
        blobs: Array<string>;
        cssText: string;
    }>;
    /**
     * Produces image output from the element.
     *
     * Converts to a `Canvas` first, then produces an image to download.
     *
     * This is an asynchronous function. Rather than returning a result, it
     * returns a Promise.
     *
     * You can use `await` notion from other async functions, or `then()`
     * anywhere else.
     *
     * ```TypeScript
     * // Async
     * let img = await chart.exporting.getImage( "PNG" );
     *
     * // Sync
     * let img;
     * chart.exporting.getImage( "PNG" ).then( ( data ) => {
     *   img = exporing;
     * } );
     * ```
     * ```JavaScript
     * var img;
     * chart.exporting.getImage( "PNG" ).then( ( data ) => {
     *   var = data;
     * } );
     * ```
     *
     * @param  {string}               type     Image format
     * @param  {IExportImageOptions}  options  Options
     * @return {Promise<string>}               Promise
     */
    getImage<Key extends imageFormats>(type: Key, options?: IExportImageOptions): Promise<string>;
    /**
     * Tries to dynamically load [canvg.js](https://github.com/canvg/canvg) and
     * export an image using its functions.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @param {string}               type     Image format
     * @param {IExportImageOptions}  options  Options
     * @return {Promise<string>}              Data uri
     */
    getImageAdvanced(type: imageFormats, options?: IExportImageOptions): Promise<string>;
    /**
     * Creates a `<canvas>` element and returns it.
     *
     * @return {HTMLCanvasElement} Canvas element
     */
    protected getDisposableCanvas(): HTMLCanvasElement;
    /**
     * Removes canvas.
     *
     * @param {HTMLCanvasElement}  canvas  Canvas element
     */
    protected disposeCanvas(canvas: HTMLCanvasElement): void;
    /**
     * Returns pixel ratio for retina displays.
     *
     * @return {number} Pixel ratio
     */
    protected getPixelRatio(): number;
    /**
     * Converts all `<image>` tags in SVG to use data uris instead of external
     * URLs
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @ignore Exclude from docs
     * @param  {SVGSVGElement}        el       SVG node
     * @param  {IExportImageOptions}  options  Options
     * @return {Promise<void>}                 Promise
     */
    imagesToDataURI(el: SVGSVGElement, options?: IExportImageOptions): Promise<void>;
    /**
     * `foreignObject` elements cannot be exported. This function hides them
     * temprarily. In the future it might try to convert them to SVG to make them
     * exportable.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @ignore Exclude from docs
     * @param  {SVGSVGElement}        el       SVG node
     * @param  {IExportImageOptions}  options  Options
     * @return {Promise<void>}                 Promise
     */
    prepForeignObjects(el: SVGSVGElement, options?: IExportImageOptions): Promise<void>;
    /**
     * Converts an SVG `<image>` to use its data uri for `href` instead of
     * external file.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @ignore Exclude from docs
     * @param {SVGImageElement}     el       SVG element
     * @param {IExportImageOptions} options  Options
     */
    imageToDataURI(el: SVGImageElement, options?: IExportImageOptions): Promise<string>;
    /**
     * Converts `<image>` with external SVG source to data uri. Loads external SVG
     * file, then converts it to data uri and replaces the `xlink:href` parameter.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @ignore Exclude from docs
     * @param {SVGImageElement}     el        An SVG element
     * @param {IExportImageOptions} options   Options
     */
    svgToDataURI(el: SVGImageElement, options?: IExportImageOptions): Promise<string>;
    /**
     * Temporarily removes element from DOM, and replaces it with a dummy
     * placeholder, as well as stores it for later restoration.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @ignore Exclude from docs
     * @param {Node} el Node
     */
    temporarilyRemoveObject(el: Node, placeholder?: SVGSVGElement): void;
    /**
     * Restores all (possibly tainted or unsupported) objects that were
     * temporarily removed when exporting.
     *
     * @ignore Exclude from docs
     */
    restoreRemovedObjects(): void;
    /**
     * Checkes if simplified export can be used using `createObjectURL` and SVG
     * document does not contain any external images.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @ignore Exclude from docs
     * @return {boolean} `true` if simplified export can be used
     */
    simplifiedImageExport(): Promise<boolean>;
    /**
     * Returns a new `<image>` element.
     *
     * @ignore Exclude from docs
     * @param  {string}                     url          URL of the image
     * @param  {number}                     width        Width (px)
     * @param  {number}                     height       Height (px)
     * @param  {string}                     crossOrigin  Cross-Origin setting
     * @return {Promise<HTMLImageElement>}               Promise
     */
    loadNewImage(url: string, width?: number, height?: number, crossOrigin?: string): Promise<HTMLImageElement>;
    /**
     * Returns current DOM URL.
     *
     * @ignore Exclude from docs
     * @return {any} URL
     */
    getDOMURL(): any;
    /**
     * Returns an SVG representation of the chart.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @param {string}             type     Type of the export
     * @param {IExportSVGOptions}  options  Options
     * @return {Promise<string>}            Promise
     */
    getSVG(type: "svg", options?: IExportSVGOptions): Promise<string>;
    /**
     * Checks if SVG is fully formatted. Encloses in `<svg>...</svg>` if
     * necessary.
     *
     * @ignore Exclude from docs
     * @param  {string}             svg       Input SVG
     * @param  {IExportSVGOptions}  options   Options
     * @param  {number}             width     Width of the SVG viewport
     * @param  {number}             height    Height of the SVG viewport
     * @param  {string}             font      Font family to use as a base
     * @param  {string}             fontSize  Font size to use as a base
     * @return {string}                       Output SVG
     * @todo Add style params to existing <svg>
     */
    normalizeSVG(svg: string, options?: IExportSVGOptions, width?: number, height?: number, font?: string, fontSize?: string, background?: Color): string;
    /**
     * Serializes an element and returns its contents.
     *
     * @ignore Exclude from docs
     * @param  {HTMLElement | SVGSVGElement}  element  An element to serialize
     * @return {string}                                A serialized XML
     */
    serializeElement(element: HTMLElement | SVGSVGElement | SVGDefsElement): string;
    /**
     * Returns a PDF containing chart image.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @param {string}             type     Type of the export
     * @param {IExportPDFOptions}  options  Options
     * @return {Promise<string>}            Promise
     * @async
     * @todo Account for header when calculating vertical fit
     */
    getPDF(type: "pdf", options?: IExportPDFOptions): Promise<string>;
    /**
     * Returns fit dimensions for available page sizes.
     *
     * @ignore Exclude from docs
     * @param  {pageSizes} pageSize Page size
     * @return {number[]}           `[width, height]` in pixels
     */
    getPageSizeFit(pageSize: pageSizes, margins?: number | number[]): number[];
    /**
     * Returns an Excel file of chart's data.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @param {string}               type     Type of the export
     * @param {IExportExcelOptions}  options  Options
     * @return {Promise<string>}              Promise
     * @async
     * @todo Handle dates
     * @todo Support for multi-sheet
     */
    getExcel(type: "xlsx", options?: IExportExcelOptions): Promise<string>;
    /**
     * This is needed to work around Excel limitations.
     *
     * @param  {string}  name  Source name
     * @return {string}        Normalized name
     */
    private normalizeExcelSheetName(name);
    /**
     * Rertuns an array of values to be used as Excel row.
     *
     * @ignore Exclude from docs
     * @param  {any}                  row      Row data
     * @param  {IExportExcelOptions}  options  Options
     * @return {any[]}                         Array of values
     */
    getExcelRow(row: any, options?: IExportExcelOptions): any[];
    /**
     * Returns chart's data formatted as CSV.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @param {string}             type     Type of the export
     * @param {IExportCSVOptions}  options  Options
     * @return {Promise<string>}            Promise
     * @async
     */
    getCSV(type: "csv", options?: IExportCSVOptions): Promise<string>;
    /**
     * Formats a row of CSV data.
     *
     * @ignore Exclude from docs
     * @param  {any}               row     An object holding data for the row
     * @param  {IExportCSVOptions} options Options
     * @return {string}                    Formated CSV line
     */
    getCSVRow(row: any, options?: IExportCSVOptions): string;
    /**
     * Returns chart's data in JSON format.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @param {string}              type     Type of the export
     * @param {IExportJSONOptions}  options  Options
     * @return {Promise<string>}             Promise
     * @async
     */
    getJSON(type: "json", options?: IExportJSONOptions): Promise<string>;
    /**
     * Converts the value to proper date format.
     *
     * @ignore Exclude from docs
     * @param  {string}                                  field    Field name
     * @param  {any}                                     value    Value
     * @param  {IExportCSVOptions | IExportJSONOptions}  options  Options
     * @return {any}                                              Formatted date value or unmodified value
     */
    convertDateValue<Key extends "json" | "csv" | "xlsx">(field: string, value: any, options?: IExportOptions[Key]): any;
    /**
     * Triggers download of the file.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @param  {string}            uri       Data URI with file content
     * @param  {string}            fileName  File name
     * @return {Promise<boolean>}            Promise
     * @async
     */
    download(uri: string, fileName: string): Promise<boolean>;
    /**
     * Returns `true` if browser has any supported methods to trigger download
     * of a binary file.
     *
     * @return {boolean} Supports downloads?
     */
    downloadSupport(): boolean;
    /**
     * Checks if the browser supports "download" attribute on links.
     *
     * @ignore Exclude from docs
     * @return {boolean} Browser supports triggering downloads?
     */
    linkDownloadSupport(): boolean;
    /**
     * Checks if the browser supports download via `msBlob`.
     *
     * @ignore Exclude from docs
     * @return {boolean} Browser supports triggering downloads?
     */
    blobDownloadSupport(): boolean;
    /**
     * Checks if this is a legacy version of IE.
     *
     * @ignore Exclude from docs
     * @return {boolean} IE9 or less?
     */
    legacyIE(): boolean;
    /**
     * Initiates print of the chart.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @param {string}               data     Data URI for the image
     * @param {IExportPrintOptions}  options  Options
     * @param {string}               title    Optional title to use (uses window's title by default)
     * @return {Promise<boolean>}             Promise
     * @async
     */
    print(data: string, options?: IExportPrintOptions, title?: string): Promise<boolean>;
    protected printViaCSS(data: string, options?: IExportPrintOptions, title?: string): Promise<boolean>;
    protected printViaIframe(data: string, options?: IExportPrintOptions, title?: string): Promise<boolean>;
    /**
     * Finds a background color for the element. If element is transparent it goes
     * up the DOM hierarchy to find a parent element that does.
     *
     * @ignore Exclude from docs
     * @param  {Element}  element Element
     * @return {Color}            Color code
     */
    findBackgroundColor(element: Element): Color;
    /**
     * Returns a font fmaily name for the element (directly set or
     * computed/inherited).
     *
     * @ignore Exclude from docs
     * @param  {Element}  element  Element
     * @return {string}            Font family
     */
    findFont(element: Element): string;
    /**
     * Returns a font fmaily name for the element (directly set or
     * computed/inherited).
     *
     * @ignore Exclude from docs
     * @param  {Element}  element  Element
     * @return {string}            Font family
     */
    findFontSize(element: Element): string;
    /**
     * @return {HTMLElement} Reference
     */
    /**
     * A reference to a container to be used to place [[ExportMenu]] in.
     *
     * @param {HTMLElement} value Reference
     */
    container: HTMLElement;
    /**
     * @return {Sprite} Sprite
     */
    /**
     * A reference to [[Sprite]] to export. Can be any Sprite, including some
     * internal elements.
     *
     * @param {Sprite} value Sprite
     */
    sprite: Sprite;
    /**
     * @return {any} Data
     */
    /**
     * Data to export.
     *
     * @param {any} value Data
     */
    data: any;
    /**
     * @return {any} Field names `{ field: fieldName }`
     */
    /**
     * Data fields in `{ field: fieldName }` format. Those are used for
     * exporting in data formats to name the columns.
     *
     * @param {any} value Field names
     */
    dataFields: any;
    /**
     * @return {any} A DateFormatter instance
     */
    /**
     * A [[DateFormatter]] to use when formatting dates when exporting data.
     *
     * @param {any} value DateFormatter instance
     */
    dateFormatter: any;
    /**
     * @return {Optional<string>} Date format
     */
    /**
     * A date format to use for exporting dates. Will use [[DateFormatter]]
     * format if not set.
     *
     * @param {Optional<string>} value Date format
     */
    dateFormat: $type.Optional<string>;
    /**
     * @return {List<string>} Date field list
     */
    /**
     * A list of fields that hold date values.
     *
     * @param {List<string>} value Date field list
     */
    dateFields: List<string>;
    /**
     * Generates data fields out of the first row of data.
     *
     * @ignore Exclude from docs
     */
    generateDataFields(): void;
    /**
     * Cheks against `dateFields` property to determine if this field holds
     * dates.
     *
     * @ignore Exclude from docs
     * @param  {string}        field   Field name
     * @param  {IExportOptions} options Options
     * @return {boolean}               `true` if it's a date field
     */
    isDateField(field: string): boolean;
    /**
     * Returns proper content type for the export type.
     *
     * @param  {string}  type  Export format/type
     * @return {string}        Proper content type, i.e. "image/jpeg"
     */
    getContentType<Key extends keyof IExportOptions>(type: Key): string;
    /**
     * @return {string} File prefix
     */
    /**
     * A file prefix to be used for all exported formats.
     *
     * Export will apply format-related extension to it. E.g. if this is set to
     * "myExport", the file name of the PNG exported image will be "myExport.png".
     *
     * @param {string} value File prefix
     */
    filePrefix: string;
    /**
     * @return {Optional<Color>} Background color
     */
    /**
     * A background color to be used for exported images. If set, this will
     * override the automatically acquired background color.
     *
     * @param {Optional<Color>} value Color
     */
    backgroundColor: $type.Optional<Color>;
    /**
     * @return {Optional<string>} Title
     */
    /**
     * A title to be used when printing.
     *
     * @param {Optional<string>} value Title
     */
    title: $type.Optional<string>;
    /**
     * Displays a preloader/exporting indicator.
     *
     * @ignore Exclude from docs
     * @todo Add ability to change text
     */
    showPreloader(): void;
    /**
     * Hides preloader/exporting indicator
     *
     * @ignore Exclude from docs
     */
    hidePreloader(): void;
    /**
     * Returns a an instance of [[Preloader]] associated with the Sprite being
     * exported.
     *
     * @return {Preloader} Preloader
     */
    readonly preloader: Preloader;
    /**
     * Displays a modal saying export is taking longer than expected.
     *
     * @ignore Exclude from docs
     */
    showTimeout(): void;
    /**
     * Hides preloader/exporting indicator.
     *
     * @ignore Exclude from docs
     */
    hideTimeout(): void;
    /**
     * @return {Language} A [[Language]] instance to be used
     */
    /**
     * A [[Language]] instance to be used for translations.
     *
     * @param {Language} value An instance of [[Language]]
     */
    language: Language;
    /**
     * Returns (and creates) [[Modal]].
     *
     * @ignore Exclude from docs
     * @return {Modal} Modal instance
     */
    readonly modal: Modal;
    /**
     * Shows [[Modal]] with specific text.
     *
     * @ignore Exclude from docs
     * @param {string} text Modal contents
     */
    showModal(text: string, title?: string): void;
    /**
     * Hides modal window if one's currently open.
     *
     * @ignore Exclude from docs
     */
    hideModal(): void;
    /**
     * Loads canvg dynamic module.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @ignore Exclude from docs
     * @return {Promise<any>} Instance of canvg
     * @async
     */
    private _canvg();
    /**
     * Returns canvg instance.
     *
     * @ignore Exclude from docs
     * @return {Promise<any>} Instance of canvg
     */
    readonly canvg: Promise<any>;
    /**
     * Loads pdfmake dynamic module
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @ignore Exclude from docs
     * @return {Promise<any>} Instance of pdfmake
     * @async
     */
    private _pdfmake();
    /**
     * Returns pdfmake instance.
     *
     * @ignore Exclude from docs
     * @return {Promise<any>} Instance of pdfmake
     */
    readonly pdfmake: Promise<any>;
    /**
     * Loads xlsx dynamic module.
     *
     * This is an asynchronous function. Check the description of `getImage()`
     * for description and example usage.
     *
     * @ignore Exclude from docs
     * @return {Promise<any>} Instance of pdfmake
     * @async
     */
    private _xlsx();
    /**
     * Returns xlsx instance.
     *
     * @ignore Exclude from docs
     * @return {Promise<any>} Instance of pdfmake
     */
    readonly xlsx: Promise<any>;
    /**
     * Sets options for a format.
     *
     * @type {Key}
     */
    setFormatOptions<Key extends keyof IExportOptions>(type: Key, options: IExportOptions[Key]): void;
    /**
     * Returns current options for a format.
     */
    getFormatOptions<Key extends keyof IExportOptions>(type: Key): IExportOptions[Key];
    /**
 * Disables interactivity on parent chart.
 */
    protected _disablePointers(): void;
    /**
     * Releases temporarily disabled pointers on parent chart.
     */
    protected _releasePointers(): void;
    /**
     * Processes JSON-based config before it is applied to the object.
     *
     * @ignore Exclude from docs
     * @param {object}  config  Config
     */
    processConfig(config?: {
        [index: string]: any;
    }): void;
}
