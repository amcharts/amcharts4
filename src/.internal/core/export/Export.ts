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
import { AMEvent } from "../utils/EventDispatcher";
import { Sprite } from "../Sprite";
import { Preloader } from "../elements/Preloader";
import { Modal } from "../elements/Modal";
import { List } from "../utils/List";
import { Dictionary } from "../utils/Dictionary";
import { IDisposer } from "../utils/Disposer";
import { DateFormatter } from "../formatters/DateFormatter";
import { DurationFormatter } from "../formatters/DurationFormatter";
import { NumberFormatter } from "../formatters/NumberFormatter";
import { Language } from "../utils/Language";
import { Validatable } from "../utils/Validatable";
import { Color, color } from "../utils/Color";
import { registry } from "../Registry";
import { options } from "../Options";
import { StyleRule, getComputedStyle } from "../utils/DOM";
import * as $browser from "../utils/Browser";
import * as $object from "../utils/Object";
import * as $net from "../utils/Net";
import * as $dom from "../utils/DOM";
import * as $type from "../utils/Type";
import * as $utils from "../utils/Utils";
import * as $array from "../utils/Array";
import * as $math from "../utils/Math";


// This is used to cache the pdfmake loading
let pdfmakePromise: Promise<any>;

/**
 * Loads pdfmake dynamic module
 *
 * This is an asynchronous function. Check the description of `getImage()`
 * for description and example usage.
 *
 * @ignore Exclude from docs
 * @return Instance of pdfmake
 * @async
 */
async function _pdfmake(): Promise<any> {
	let a = await Promise.all([
		import(/* webpackChunkName: "pdfmake" */ "pdfmake/build/pdfmake.js"),
		import(/* webpackChunkName: "pdfmake" */ "../../pdfmake/vfs_fonts")
	]);
	let pdfmake = a[0];
	let vfs_fonts = a[1];
	const global = <any>window;
	global.pdfMake = global.pdfMake || {};
	global.pdfMake.vfs = vfs_fonts.default;
	pdfmake.vfs = vfs_fonts.default;
	return pdfmake;
}


// TODO better parsing
const fontFamilySrcRegexp = /src: ([^;]+);/;

// TODO better checks
function supportsBlobUri(): boolean {
	return window.navigator.msSaveOrOpenBlob != null;
}

// TODO move into utils or something ?
function blobToDataUri(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		// TODO handle abort ?
		const f = new FileReader();
		f.onload = (e) => { resolve(<string>f.result); };
		f.onerror = (e) => { reject(e); };
		f.readAsDataURL(blob);
	});
}

async function getCssRules(s: HTMLStyleElement): Promise<CSSRuleList> {
	const sheet = <CSSStyleSheet>s.sheet;

	try {
		return sheet.cssRules;

	} catch (e) {
		// Needed because of https://bugzilla.mozilla.org/show_bug.cgi?id=625013
		return await new Promise<CSSRuleList>((success, error) => {
			s.addEventListener("load", () => {
				success(sheet.cssRules);
			}, true);

			s.addEventListener("error", (e) => {
				error(e);
			}, true);

			setTimeout(() => {
				error(new Error("Timeout while waiting for <style> to load"));
			}, 10000);
		});
	}
}

// This loads a stylesheet by URL and then calls the function with it
// TODO this should be moved into utils or something
async function loadStylesheet(doc: Document, url: string, f: (topUrl: string, rule: CSSRule) => void): Promise<void> {
	let response;

	try {
		response = await $net.load(url);

	} catch (e) {
		console.error("Failed to load stylesheet", url, e);
		return;
	}

	const s = doc.createElement("style");
	s.textContent = response.response;
	doc.head.appendChild(s);

	try {
		const rules = await getCssRules(s);
		await eachStylesheet(doc, url, rules, f);

	} finally {
		doc.head.removeChild(s);
	}
}

// This calls a function for each CSSRule inside of a CSSStyleSheet.
// If the CSSStyleSheet has any @import, then it will recursively call the function for those CSSRules too.
// TODO this should be moved into utils or something
async function eachStylesheet(doc: Document, topUrl: string, rules: CSSRuleList, f: (topUrl: string, rule: CSSRule) => void): Promise<void> {
	const promises: Array<Promise<void>> = [];

	const length = rules.length;

	for (let i = 0; i < length; i++) {
		const rule = rules[i];

		if (rule.type === CSSRule.IMPORT_RULE) {
			let url = (<CSSImportRule>rule).href;

			if (url) {
				url = $utils.joinUrl(topUrl, url);
				promises.push(loadStylesheet(doc, url, f));
			}

		} else {
			f(topUrl, rule);
		}
	}

	if (promises.length) {
		await Promise.all(promises);
	}
}

// This calls a function for each CSSRule for all of the stylesheets in the page.
// If the CSSStyleSheet has any @import, then it will recursively call the function for those CSSRules too.
// TODO this should be moved into utils or something
async function eachStylesheets(f: (topUrl: string, rule: CSSRule) => void): Promise<void> {
	// This uses an <iframe> so it doesn't screw up the site's styles
	const iframe = document.createElement("iframe");

	// This causes it to use the same origin policy as the parent page
	iframe.src = "about:blank";
	// This tries to make it more accessible for screen readers
	iframe.setAttribute("title", "");

	document.head.appendChild(iframe);

	try {
		const doc = iframe.contentDocument;

		// TODO use $dom.getRoot instead of document ?
		await Promise.all($array.map(document.styleSheets, (sheet) => {
			let url = sheet.href;

			if (url == null) {
				return eachStylesheet(doc, location.href, (<CSSStyleSheet>sheet).cssRules, f);

			} else {
				url = $utils.joinUrl(location.href, url);
				return loadStylesheet(doc, url, f);
			}
		}));

	} finally {
		document.head.removeChild(iframe);
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Represents an Event object that comes from [[Export]].
 */
export type ExportOperation = {
	format?: string;
	options?: any;
}

/**
 * Defines image formats available for export.
 */
export type imageFormats = "png" | "gif" | "jpg";

/**
 * An interface describing extra elements to include in export.
 *
 * @since 4.2.0
 */
export interface IExportCanvas {

	/**
	 * Top margin in pixels.
	 */
	marginTop?: number;

	/**
	 * Right margin in pixels.
	 */
	marginRight?: number;

	/**
	 * Bottom margin in pixels.
	 */
	marginBottom?: number;

	/**
	 * Left margin in pixels.
	 */
	marginLeft?: number;

	/**
	 * Position to put extra element in relation to main chart.
	 */
	position?: "left" | "right" | "top" | "bottom";

	/**
	 * Reference to element.
	 */
	sprite?: Sprite;

	/**
	 * If this is set to `true` and extra element is higher/wider than main
	 * chart element, the extra element will be cropped.
	 *
	 * @default false
	 * @since 4.6.1
	 */
	crop?: boolean;
}

/**
 * Represents options for image export.
 */
export interface IExportImageOptions {

	/**
	 * Quality of the exported image. (0-1)
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
 */
export type pageSizes = "4A0" | "2A0" | "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "A10" |
	"B0" | "B1" | "B2" | "B3" | "B4" | "B5" | "B6" | "B7" | "B8" | "B9" | "B10" |
	"C0" | "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8" | "C9" | "C10" |
	"RA0" | "RA1" | "RA2" | "RA3" | "RA4" |
	"SRA0" | "SRA1" | "SRA2" | "SRA3" | "SRA4" |
	"EXECUTIVE" | "FOLIO" | "LEGAL" | "LETTER" | "TABLOID";

/**
 * Represents options for PDF export.
 */
export interface IExportPDFOptions extends IExportImageOptions {

	/**
	 * Font size to use for all texts.
	 */
	fontSize?: number;

	/**
	 * An image format to use for embedded images in PDF.
	 *
	 * See `imageFormats` in [[Export_module]].
	 */
	imageFormat?: imageFormats;

	/**
	 * Whether to add a URL of the web page the chart has been exported from.
	 *
	 * @default true
	 */
	addURL?: boolean;

	/**
	 * Page size of the exported PDF.
	 *
	 * See `pageSizes` in [[Export_module]].
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

	/**
	 * Should data table be included together with the image?
	 *
	 * Use "pdfdata" options to configure table output.
	 *
	 * @default false
	 * @since 4.7.0
	 */
	addData?: boolean;

	/**
	 * Add column names in first row?
	 *
	 * Export will try to use user-friendly column names where possible, either
	 * from Export's `dataFields` or deduced from chart's series' names that are
	 * bound to specific data fields.
	 *
	 * @default true
	 * @since 4.7.0
	 */
	addColumnNames?: boolean;

	/**
	 * Use timestamps instead of formatted date/time values.
	 *
	 * @default false
	 * @since 4.7.0
	 */
	useTimestamps?: boolean;

	/**
	 * Will try to format numbers and date/time according to user's locale
	 * settings.
	 *
	 * @default true
	 * @since 4.7.0
	 */
	useLocale?: boolean;

	/**
	 * Replace missing values with this.
	 *
	 * @default "" (empty string)
	 * @since 4.7.0
	 */
	emptyAs?: any;

	/**
	 * If set to `true` will export data as pivoted (column names in first column;
	 * values in rows).
	 *
	 * @default false
	 * @since 4.7.0
	 */
	pivot?: boolean;
}

/**
 * Represents options for CSV export.
 */
export interface IExportCSVOptions {

	/**
	 * Separator string to separate columns with.
	 *
	 * @default ","
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
	 */
	addColumnNames?: boolean;

	/**
	 * Add rows in reverse order.
	 *
	 * @default false
	 */
	reverse?: boolean;

	/**
	 * Use timestamps instead of formatted date/time values.
	 *
	 * @default false
	 */
	useTimestamps?: boolean;

	/**
	 * Will try to format numbers and date/time according to user's locale
	 * settings.
	 *
	 * @default true
	 */
	useLocale?: boolean;

	/**
	 * Replace missing values with this.
	 *
	 * @default "" (empty string)
	 */
	emptyAs?: any;

	/**
	 * If set to `true` will export data as pivoted (column names in first column;
	 * values in rows).
	 *
	 * @default false
	 * @since 4.6.8
	 */
	pivot?: boolean;

}

/**
 * Represents options for JSON export
 */
export interface IExportJSONOptions {

	/**
	 * Use timestamps instead of formatted date/time values.
	 *
	 * @default false
	 */
	useTimestamps?: boolean;

	/**
	 * Will try to format numbers and date/time according to user's locale
	 * settings.
	 *
	 * @default true
	 */
	useLocale?: boolean;

	/**
	 * Sets indent size for each hierarchical elements.
	 *
	 * @default "  "
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
	 */
	addColumnNames?: boolean;

	/**
	 * Use timestamps instead of formatted date/time values.
	 *
	 * @default false
	 */
	useTimestamps?: boolean;

	/**
	 * Will try to format numbers and date/time according to user's locale
	 * settings.
	 *
	 * @default true
	 */
	useLocale?: boolean;

	/**
	 * Replace missing values with this.
	 *
	 * @default "" (empty string)
	 */
	emptyAs?: any;

	/**
	 * If set to `true` will export data as pivoted (column names in first column;
	 * values in rows).
	 *
	 * @default false
	 * @since 4.6.8
	 */
	pivot?: boolean;

}

/**
 * Represents options for HTML export.
 * @since 4.7.0
 */
export interface IExportHTMLOptions {

	/**
	 * Add column names in first row?
	 *
	 * Export will try to use user-friendly column names where possible, either
	 * from Export's `dataFields` or deduced from chart's series' names that are
	 * bound to specific data fields.
	 *
	 * @default true
	 */
	addColumnNames?: boolean;

	/**
	 * Use timestamps instead of formatted date/time values.
	 *
	 * @default false
	 */
	useTimestamps?: boolean;

	/**
	 * Will try to format numbers and date/time according to user's locale
	 * settings.
	 *
	 * @default true
	 */
	useLocale?: boolean;

	/**
	 * Replace missing values with this.
	 *
	 * @default "" (empty string)
	 */
	emptyAs?: any;

	/**
	 * If set to `true` will export data as pivoted (column names in first column;
	 * values in rows).
	 *
	 * @default false
	 */
	pivot?: boolean;

	/**
	 * A class name to add to table.
	 */
	tableClass?: string;

	/**
	 * A class name to add to table headers.
	 */
	rowClass?: string;

	/**
	 * A class name to add to table headers.
	 */
	headerClass?: string;

	/**
	 * A class name to add to table cells.
	 */
	cellClass?: string;

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

	/**
	 * A callback function reference that will be called when this custom item
	 * is clicked.
	 */
	callback?: (branch?: any) => any;

	/**
	 * A target which will be `this` context for callback calls.
	 */
	callbackTarget?: any;

}

/**
 * Represents interface for a temporarily removed image.
 */
export interface IExportRemovedObject {

	/**
	 * Element that was removed out of DOM.
	 */
	element: Node;

	/**
	 * A placeholder element that was placed instead of removed element so that
	 * we know where to put removed element back in.
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
	pdfdata: IExportPDFOptions;
	html: IExportHTMLOptions;
	print: IExportPrintOptions;
	custom: IExportCustomOptions;
}

/**
 * All export options as a type.
 *
 * @ignore Exclude from docs
 */
export type ExportOptions = IExportImageOptions | IExportSVGOptions | IExportPDFOptions | IExportExcelOptions | IExportCSVOptions | IExportJSONOptions | IExportHTMLOptions | IExportPrintOptions;

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
	 */
	exportstarted: ExportOperation;

	/**
	 * Invoked when export operation finishes.
	 */
	exportfinished: ExportOperation;

	/**
	 * Invoked when export operation encounters error.
	 */
	error: ExportOperation;

	/**
	 * Invoked when export operation times out.
	 *
	 * Use Export's `timeoutDelay` setting to set timeout. (default: 2000ms)
	 */
	exporttimedout: ExportOperation;

}

/**
 * @ignore Exclude from docs
 */
export type Keys = keyof IExportOptions;

/**
 * Represents a list of available adapters for [[Export]].
 */
export interface IExportAdapters {

	supported: {
		supported: boolean,
		type: Keys,
		options?: IExportOptions[Keys]
	},

	exportFunction: {
		func: <Key extends keyof IExportOptions>(type: Key, options?: IExportOptions[Key]) => Promise<any>,
		type: Keys,
		options?: IExportOptions[Keys]
	},

	options: {
		options: IExportOptions[Keys],
		type?: Keys
	},

	title: {
		title: $type.Optional<string>,
		options?: IExportOptions[Keys]
	},

	charset: {
		charset: string,
		type?: Keys,
		options?: IExportOptions[Keys]
	}

	svgToDataURI: {
		data: string,
		options?: IExportOptions[Keys]
	},

	getSVG: {
		data: string,
		options?: IExportOptions[Keys]
	},

	normalizeSVG: {
		data: string,
		options?: IExportOptions[Keys]
	},

	getCSV: {
		data: string,
		options?: IExportOptions[Keys]
	},

	getJSON: {
		data: string,
		options?: IExportOptions[Keys]
	},

	getExcel: {
		data: string,
		options?: IExportOptions[Keys]
	},

	getHTML: {
		data: string,
		options?: IExportOptions[Keys]
	},

	pdfmakeDocument: {
		doc: any,
		options?: IExportOptions[Keys]
	},

	pdfmakeTable: {
		table: any,
		options?: IExportOptions[Keys]
	},

	container: {
		container: HTMLElement
	},

	sprite: {
		sprite: Sprite
	},

	extraSprites: {
		extraSprites: Array<Sprite | IExportCanvas>
	},

	validateSprites: {
		validateSprites: Array<Sprite>
	},

	data: {
		data: Array<any>
	},

	dataFields: {
		dataFields: any
	},

	formatDataFields: {
		dataFields: any,
		format: string
	},

	dateFormatter: {
		dateFormatter: DateFormatter
	},

	dateFormat: {
		dateFormat: $type.Optional<string | Intl.DateTimeFormatOptions>
	},

	dateFields: {
		dateFields: any
	},

	numberFormatter: {
		numberFormatter: NumberFormatter
	},

	numberFormat: {
		numberFormat: $type.Optional<string>
	},

	numberFields: {
		numberFields: any
	},

	durationFormatter: {
		durationFormatter: DurationFormatter
	},

	durationFormat: {
		durationFormat: $type.Optional<string>
	},

	durationFields: {
		durationFields: any
	},

	dataFieldName: {
		name: string,
		field: string
	},

	isDateField: {
		isDateField: boolean,
		field: string
	},

	isNumberField: {
		isNumberField: boolean,
		field: string
	},

	isDurationField: {
		isDurationField: boolean,
		field: string
	},

	contentType: {
		contentType: string,
		type: Keys
	},

	filePrefix: {
		filePrefix: string
	},

	backgroundColor: {
		backgroundColor: $type.Optional<Color>
	},

	timeoutMessage: {
		message: string
	},

	xlsxWorkbookOptions: {
		options: any
	},

	xlsxSheetName: {
		name: string
	}


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
export class Export extends Validatable {

	/**
	 * XLINK namespace definition.
	 *
	 * @ignore Exclude from docs
	 */
	static XLINK: string = "http://www.w3.org/1999/xlink";

	/**
	 * Defines available events.
	 */
	public _events!: IExportEvents;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IExportAdapters;

	/**
	 * Adapter.
	 */
	public adapter = new Adapter<Export, IExportAdapters>(this);

	/**
	 * Holds options for each format.
	 *
	 * @ignore Exclude from docs
	 */
	private _formatOptions: Dictionary<string, ExportOptions> = new Dictionary<string, ExportOptions>();

	/**
	 * An instance of [[Language]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _language: $type.Optional<Language>;

	/**
	 * An instance of [[ExportMenu]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _menu: $type.Optional<ExportMenu>;

	/**
	 * Reference to main container to place menu in.
	 */
	protected _container: HTMLElement;

	/**
	 * [[Sprite]] instance to be used when converting to image.
	 */
	protected _sprite: $type.Optional<Sprite>;

	/**
	 * Extra [[Sprite]] elements to include in exports.
	 */
	protected _extraSprites: Array<Sprite | IExportCanvas> = [];

	/**
	 * A list of [[Sprite]] elements that need to be valid before export
	 * commences.
	 */
	protected _validateSprites: Array<Sprite> = [];

	/**
	 * Data storage to be used when exporting to data formats.
	 */
	protected _data: any;

	/**
	 * Holds an object of field key / field name used to name columns when
	 * exporting to data formats.
	 */
	protected _dataFields: any;

	/**
	 * Indicates whether data fields were generated dynamically (`true`) or
	 * if they were pre-set by the user (`false`).
	 */
	protected _dynamicDataFields: boolean = true;

	/**
	 * A reference to [[DateFormatter]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _dateFormatter: $type.Optional<DateFormatter>;

	/**
	 * A Date format to be used when formatting dates in string-based data
	 * formats.
	 *
	 * @ignore Exclude from docs
	 */
	protected _dateFormat: $type.Optional<string | Intl.DateTimeFormatOptions>;

	/**
	 * A list of column keys that hold date values.
	 *
	 * @ignore Exclude from docs
	 */
	protected _dateFields: $type.Optional<List<string>>;

	/**
	 * A reference to [[DurationFormatter]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _durationFormatter: $type.Optional<DurationFormatter>;

	/**
	 * A duration format to be used when formatting numeric values.
	 *
	 * @ignore Exclude from docs
	 */
	protected _durationFormat: $type.Optional<string>;

	/**
	 * A list of column keys that hold duration values.
	 *
	 * @ignore Exclude from docs
	 */
	protected _durationFields: $type.Optional<List<string>>;

	/**
	 * A reference to [[NumberFormatter]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _numberFormatter: $type.Optional<NumberFormatter>;

	/**
	 * A number format to be used when formatting numbers in string-based data
	 * formats.
	 *
	 * @ignore Exclude from docs
	 */
	protected _numberFormat: $type.Optional<string>;

	/**
	 * A list of column keys that hold number values.
	 *
	 * @ignore Exclude from docs
	 */
	protected _numberFields: $type.Optional<List<string>>;

	/**
	 * Holds a list of objects that were temporarily removed from the DOM while
	 * exporting. Those most probably are tainted images, or foreign objects that
	 * would otherwise prevent SVG to be converted to canvas.
	 *
	 * @ignore Exclude from docs
	 */
	protected _removedObjects: List<IExportRemovedObject> = new List<IExportRemovedObject>();

	/**
	 * Holds references to the objects that were temporarily hidden when export
	 * started, so that we can reveal them back when export ends.
	 */
	protected _hiddenObjects: Sprite[] = [];

	/**
	 * Indicates if non-exportable objects are now hidden;
	 */
	protected _objectsAlreadyHidden: boolean = false;

	/**
	 * Exported files will be prefixed with whatever it is set here.
	 *
	 * @ignore Exclude from docs
	 */
	protected _filePrefix: string = "amCharts";

	/**
	 * Export will try to determine proper background color itself. If you want to
	 * override it and use some other color, set this property.
	 *
	 * @ignore Exclude from docs
	 */
	protected _backgroundColor: $type.Optional<Color>;

	/**
	 * A title to use for some document exports, mainly for print.
	 * A document.title will be used if not set.
	 *
	 * @ignore Exclude from docs
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
	 */
	public useWebFonts: boolean = true;

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
	 */
	public useRetina: boolean = true;

	/**
	 * By default Export will try to use built-in method for transforming chart
	 * into an image for download, then fallback to external library (canvg) for
	 * conversion if failed.
	 *
	 * Setting this to `false` will force use of external library for all export
	 * operations.
	 *
	 * It might be useful to turn off simplified export if you are using strict
	 * content security policies, that disallow images with blobs as their
	 * source.
	 *
	 * @default true
	 * @since 4.2.5
	 */
	public useSimplifiedExport: boolean = true;

	/**
	 * If export operation takes longer than milliseconds in this second, we will
	 * show a modal saying export operation took longer than expected.
	 */
	public timeoutDelay: number = 2000;

	/**
	 * A reference to export timeout.
	 *
	 * @ignore Exclude from docs
	 */
	protected _timeoutTimeout: $type.Optional<IDisposer>;

	/**
	 * Holds reference to [[Modal]] instance.
	 *
	 * @ignore Exclude from docs
	 */
	protected _modal: $type.Optional<Modal>;

	/**
	 * Used to log original value of `interactionsEnabled` so that it can be restored
	 * after temporarily disabling it.
	 */
	private _spriteInteractionsEnabled: $type.Optional<boolean>;

	/**
	 * Constructor
	 */
	constructor(container: HTMLElement) {
		super();

		this._container = container;

		this.className = "Export";

		// Set default options
		this._formatOptions.setKey("png", {});

		this._formatOptions.setKey("jpg", {
			quality: 0.8
		});

		this._formatOptions.setKey("gif", {});

		this._formatOptions.setKey("svg", {});

		this._formatOptions.setKey("pdf", {
			fontSize: 14,
			imageFormat: "png",
			addURL: true,
			addColumnNames: true
		});

		this._formatOptions.setKey("json", {
			indent: 2,
			useLocale: true
		});

		this._formatOptions.setKey("csv", {
			addColumnNames: true,
			emptyAs: ""
		});

		this._formatOptions.setKey("xlsx", {
			addColumnNames: true,
			useLocale: true,
			emptyAs: ""
		});

		this._formatOptions.setKey("html", {
			addColumnNames: true,
			emptyAs: ""
		});

		this._formatOptions.setKey("pdfdata", {
			fontSize: 14,
			imageFormat: "png",
			addURL: true,
			addColumnNames: true,
			emptyAs: ""
		});

		this._formatOptions.setKey("print", {
			delay: 500,
			printMethod: "iframe"
		});

		// Add options adapter
		this.adapter.add("options", (arg) => {
			let formatOptions = this._formatOptions.getKey(arg.type);
			if (arg.options) {
				arg.options = $object.merge(formatOptions, arg.options);
			}
			else {
				arg.options = formatOptions;
			}
			return arg;
		});

		this.applyTheme();

		this.dispatchImmediately("inited");
	}

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
	 * @param menu  ExportMenu instance
	 */
	public set menu(menu: $type.Optional<ExportMenu>) {
		if (this._menu) {
			this.removeDispose(this._menu);
		}
		this._menu = menu;

		// Set container and language
		this._menu.container = this.container;
		this._menu.language = this._language;

		// Add adapter to check for browser support
		this._menu.adapter.add("branch", (arg) => {
			arg.branch.unsupported = !this.typeSupported(arg.branch.type);
			return arg;
		});

		// Add click events
		this._menu.events.on("hit", (ev) => {
			this.export(ev.branch.type, ev.branch.options);
			this.menu.close();
		});

		this._menu.events.on("enter", (ev) => {
			this.export(ev.branch.type, ev.branch.options);
			this.menu.close();
		});

		this._menu.events.on("over", (ev) => {
			this._disablePointers();
		});

		this._menu.events.on("out", (ev) => {
			this._releasePointers();
		});

		// Dispatch event
		this.dispatchImmediately("menucreated");

		// Prefix with Sprite's class name
		this._menu.adapter.add("classPrefix", (obj) => {
			obj.classPrefix = options.classNamePrefix + obj.classPrefix;
			return obj;
		});

		// Add menu to disposers so that it's destroyed when Export is disposed
		this._disposers.push(this._menu);
	}

	/**
	 * @return ExportMenu instance
	 */
	public get menu(): $type.Optional<ExportMenu> {
		return this._menu;
	}

	/**
	 * Checks if this specific menu item type is supported by current system.
	 *
	 * @param type  Menu item type
	 * @return `false` if not supported
	 */
	public typeSupported<Key extends keyof IExportOptions>(type: Key): boolean {
		let supported = true;
		if (type === "pdf") {
			//supported = this.downloadSupport();
		}
		else if (type === "xlsx") {
			//supported = (this.downloadSupport() && this._hasData()) ? true : false;
			supported = this._hasData() ? true : false;
		}
		else if (type == "print" && !(<any>window).print) {
			supported = false;
		}
		else if (["json", "csv", "html", "pdfdata"].indexOf(type) !== -1 && !this._hasData()) {
			supported = false;
		}
		return this.adapter.apply("supported", {
			supported: supported,
			type: type
		}).supported;
	}

	/**
	 * Checks if data is available.
	 *
	 * @return Has data?
	 */
	private _hasData(): boolean {
		return this.data && this.data.length;
	}

	/**
	 * Get function to handle export for particular format.
	 *
	 * @ignore Exclude from docs
	 */
	private _getFunction<Key extends keyof IExportOptions>(type: Key): (this: this, type: Key, options?: IExportOptions[Key]) => Promise<any> {
		switch (type) {
			case "png":
			case "gif":
			case "jpg":
				return <any>this.getImage;
			case "svg":
				return <any>this.getSVG;
			case "pdf":
			case "pdfdata":
				return <any>this.getPDF;
			case "xlsx":
				return <any>this.getExcel;
			case "csv":
				return <any>this.getCSV;
			case "json":
				return <any>this.getJSON;
			case "html":
				return <any>this.getHTML;
			case "print":
				return <any>this.getPrint;
			default:
				return this.unsupported;
		}
	}

	/**
	 * Initiates export procedure.
	 *
	 * @param type     Export type
	 * @param options  Options
	 * @return `true` if export was successful
	 * @async
	 */
	public async export<Key extends keyof IExportOptions>(type: Key, options?: IExportOptions[Key]): Promise<boolean> {

		// Check if it's a custom item, and do nothing or execute custom callback
		if (type == "custom") {
			this.handleCustom(<IExportCustomOptions>options);
			return true;
		}

		// Dispatch event
		if (this.events.isEnabled("exportstarted")) {
			const event: AMEvent<this, IExportEvents>["exportstarted"] = {
				"type": "exportstarted",
				"target": this,
				"format": type,
				"options": options
			};
			this.events.dispatchImmediately("exportstarted", event);
		}

		// Schedule a preloader
		this.showPreloader()

		// Schedule a timeout
		if (this.timeoutDelay) {
			this.hideTimeout();
			this._timeoutTimeout = this.setTimeout((): void => {

				// Dispatch event
				if (this.events.isEnabled("exporttimedout")) {
					const event: AMEvent<this, IExportEvents>["exporttimedout"] = {
						"type": "exporttimedout",
						"target": this,
						"format": type,
						"options": options
					};
					this.events.dispatchImmediately("exporttimedout", event);
				}

				// Show modal
				this.showTimeout()

			}, this.timeoutDelay);
		}

		// Hide items that should not be exported
		this.hideNonExportableSprites();

		// Get the actual export function
		let func: (this: this, type: Key, options?: IExportOptions[Key]) => Promise<any> = this._getFunction(type);

		// Give chance for plugins to override both function and options
		options = this.adapter.apply("options", {
			options: options,
			type: type
		}).options;

		func = this.adapter.apply("exportFunction", {
			func: func as any,
			type: type,
			options: options
		}).func;

		// Get exported stuff
		let data = await func.call(this, type, options);

		// Restore temporarily hidden elements
		this.restoreNonExportableSprites();

		if (data) {

			// Dispatch event
			if (this.events.isEnabled("exportfinished")) {
				const event: AMEvent<this, IExportEvents>["exportfinished"] = {
					"type": "exportfinished",
					"target": this,
					"format": type,
					"options": options
				};
				this.events.dispatchImmediately("exportfinished", event);
			}

			// Hide preloader and timeout modals
			this.hidePreloader();
			this.hideTimeout();
			if (this.menu) {
				this.menu.close();
			}

			// Download or print
			if (type === "print") {
				return this.print(data, <IExportOptions["print"]>options, this.adapter.apply("title", {
					title: this.title,
					options: options
				}).title);
			}
			else {
				if (type == "pdfdata") {
					return this.download(data, this.filePrefix + ".pdf");
				}
				return this.download(data, this.filePrefix + "." + type);
			}

		}
		else {
			// Throw exception?
			// @todo

			// Dispatch event
			if (this.events.isEnabled("error")) {
				const event: AMEvent<this, IExportEvents>["error"] = {
					"type": "error",
					"target": this,
					"format": type,
					"options": options
				};
				this.events.dispatchImmediately("error", event);
			}

			return false;
		}

	}

	/**
	 * A function that should handle unsupported export types.
	 *
	 * @ignore Exclude from docs
	 * @param type     Export type
	 * @param options  Options
	 * @return Promise
	 * @async
	 */
	public async unsupported<Key extends keyof IExportOptions>(type: Key, options?: IExportOptions[Key]): Promise<string> {
		// TODO should this return `undefined`?
		return "";
	}

	/**
	 * Handles click on a "custom" menu item.
	 *
	 * Basically, if it has "callback" enabled, it will be called. Nothing else.
	 *
	 * @ignore Exclude from docs
	 * @param options  Options
	 */
	public handleCustom(options: IExportCustomOptions): void {
		if ($type.hasValue(options) && $type.hasValue(options.callback)) {
			options.callback.call(options.callbackTarget || this, options);
		}
	}

	/**
	 * Requests a Print of the chart.
	 *
	 * @param type     Export type
	 * @param options  Options
	 * @return Promise
	 * @async
	 */
	public async getPrint(type: string, options?: IExportPrintOptions): Promise<string> {
		return this.getImage("png", options);
	}

	/**
	 * A function that returns data: URI encoded @font-family, so that way it can be embedded into SVG.
	 *
	 * @ignore Exclude from docs
	 * @return String which can be embedded directly into a <style> element.
	 * @async
	 */
	public async getFontFamilies(): Promise<{ blobs: Array<string>, cssText: string }> {
		const DOMURL = this.getDOMURL();

		const blobs: Array<string> = [];
		const promises: Array<Promise<string>> = [];

		await eachStylesheets((topUrl, rule) => {
			if (rule.type === CSSRule.FONT_FACE_RULE) {
				const cssText = rule.cssText;

				// TODO this is necessary because Edge doesn't let you access the src using getPropertyValue
				const src = fontFamilySrcRegexp.exec(cssText);

				if (src !== null) {
					// TODO make this faster (don't create Promises for non-url stuff)
					const urls: Array<Promise<string | null>> = src[1].split(/ *, */).map(async (url) => {
						// TODO better parsing for this
						// TODO is it necessary to handle ' ?
						const a = /^url\(["']?([^"'\)]+)["']?\)([^,]*)$/.exec(url);

						if (a === null) {
							return url;

						} else {
							const after = a[2];

							const fullUrl = $utils.joinUrl(topUrl, a[1]);

							try {
								// Fetch the actual font-file (.woff)
								const response = await $net.load(fullUrl, undefined, { responseType: "blob" });

								let url;

								// We need blob for IE and Edge
								if (supportsBlobUri()) {
									url = DOMURL.createObjectURL(response.blob);
									blobs.push(url);

									// We need a data URI for Firefox and Chrome
								} else {
									url = await blobToDataUri(response.blob);
								}

								// TODO should it should escape the URI ?
								return "url(\"" + url + "\")" + after;

							} catch (e) {
								console.error("Failed to load font", fullUrl, e);
								return null;
							}
						}
					});

					promises.push(Promise.all(urls).then((a) => {
						a = a.filter((x) => x != null);

						if (a.length === 0) {
							return "";

						} else {
							return cssText.replace(fontFamilySrcRegexp, "src: " + a.join(", ") + ";");
						}
					}));
				}
			}
		});

		const a = await Promise.all(promises);

		return {
			blobs: blobs,
			cssText: a.filter((x) => !!x).join("\n")
		};
	}

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
	 * let img;
	 *
	 * // Async
	 * img = await chart.exporting.getImage( "png" );
	 *
	 * // Sync
	 * chart.exporting.getImage( "png" ).then( ( data ) => {
	 *   img = data;
	 * } );
	 * ```
	 * ```JavaScript
	 * var img;
	 * chart.exporting.getImage( "png" ).then( ( data ) => {
	 *   img = data;
	 * } );
	 * ```
	 *
	 * @param  type           Image format
	 * @param  options        Options
	 * @param  includeExtras  Should extra sprites be included if set?
	 * @return Promise
	 */
	public async getImage<Key extends imageFormats>(type: Key, options?: IExportImageOptions, includeExtras?: boolean): Promise<string> {

		let prehidden = this._objectsAlreadyHidden;
		if (!prehidden) {
			this.hideNonExportableSprites();
		}

		if (!$type.hasValue(options)) {
			options = this.getFormatOptions(type);
		}

		// Wait for required elements to be ready before proceeding
		await this.awaitValidSprites();

		// Are we using simplified export option?
		if (await this.simplifiedImageExport()) {

			try {
				let canvas = await this.getCanvas(options);

				// Add extra sprites
				if (includeExtras !== false) {
					canvas = await this.addExtras(canvas, options);
				}

				// Convert to data uri
				let uri = canvas.toDataURL(this.getContentType(type), options.quality);

				// Get rid of the canvas
				this.disposeCanvas(canvas);

				if (!prehidden) {
					this.restoreNonExportableSprites();
				}

				return uri;
			}
			catch (e) {
				console.error(e.message + "\n" + e.stack);
				console.warn("Simple export failed, falling back to advanced export");

				// An error occurred, let's try advanced method
				const data = await this.getImageAdvanced(type, options, includeExtras);

				if (!prehidden) {
					this.restoreNonExportableSprites();
				}

				return data;

			}

		}
		else {

			/**
			 * Going the hard way. Converting to canvas from each node
			 */
			const data = await this.getImageAdvanced(type, options, includeExtras);

			if (!prehidden) {
				this.restoreNonExportableSprites();
			}

			return data;
		}

	}

	/**
	 * Adds extra elements to the canvas.
	 *
	 * @param  canvas   Original canvas
	 * @param  options  Options
	 */
	private async addExtras(canvas: HTMLCanvasElement, options?: IExportImageOptions, advanced?: boolean): Promise<HTMLCanvasElement> {
		if (this.extraSprites.length) {
			let middleLeft = 0;
			let middleTop = 0;
			let middleWidth = canvas.width;
			let middleHeight = canvas.height;
			let extraRight = 0;
			let extraBottom = 0;

			const extras = await Promise.all($array.map(this.extraSprites, async (extraSprite) => {
				// Get that extra
				let extra: IExportCanvas;

				if (extraSprite instanceof Sprite) {
					extra = {
						sprite: extraSprite,
						position: "bottom"
					};

				} else {
					extra = extraSprite;
				}

				// Set defaults
				extra.position = extra.position || "bottom";
				extra.marginTop = extra.marginTop || 0;
				extra.marginRight = extra.marginRight || 0;
				extra.marginBottom = extra.marginBottom || 0;
				extra.marginLeft = extra.marginLeft || 0;

				let extraCanvas;

				if (advanced) {
					extraCanvas = await extra.sprite.exporting.getCanvasAdvanced(options);

				} else {
					extraCanvas = await extra.sprite.exporting.getCanvas(options);
				}

				const extraWidth = extraCanvas.width + extra.marginLeft + extra.marginRight;
				const extraHeight = extraCanvas.height + extra.marginTop + extra.marginBottom;

				if (extra.position == "top") {
					middleWidth = extra.crop ? middleHeight : $math.max(middleWidth, extraWidth);
					middleTop += extraHeight;

				} else if (extra.position == "right") {
					middleHeight = extra.crop ? middleHeight : $math.max(middleHeight, extraHeight);
					extraRight += extraWidth;

				} else if (extra.position == "left") {
					middleHeight = extra.crop ? middleHeight : $math.max(middleHeight, extraHeight);
					middleLeft += extraWidth;

				} else if (extra.position === "bottom") {
					middleWidth = extra.crop ? middleHeight : $math.max(middleWidth, extraWidth);
					extraBottom += extraHeight;
				}

				return {
					canvas: extraCanvas,
					position: extra.position,
					left: extra.marginLeft,
					top: extra.marginTop,
					width: extraWidth,
					height: extraHeight
				};
			}));

			const newCanvas = this.getDisposableCanvas();

			newCanvas.width = middleLeft + middleWidth + extraRight;
			newCanvas.height = middleTop + middleHeight + extraBottom;

			const ctx = newCanvas.getContext("2d");

			// Get background
			const background = this.backgroundColor || this.findBackgroundColor(this.sprite.dom);

			if (background) {
				ctx.fillStyle = background.toString();
				ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
			}

			let left = middleLeft;
			let top = middleTop;
			let right = left + middleWidth;
			let bottom = top + middleHeight;

			// Radiates outwards from center
			$array.each(extras, (extra) => {
				if (extra.position == "top") {
					top -= extra.height;
					ctx.drawImage(extra.canvas, middleLeft + extra.left, top + extra.top);

				} else if (extra.position == "right") {
					ctx.drawImage(extra.canvas, right + extra.left, middleTop + extra.top);
					right += extra.width;

				} else if (extra.position == "left") {
					left -= extra.width;
					ctx.drawImage(extra.canvas, left + extra.left, middleTop + extra.top);

				} else if (extra.position === "bottom") {
					ctx.drawImage(extra.canvas, middleLeft + extra.left, bottom + extra.top);
					bottom += extra.height;
				}

				this.disposeCanvas(extra.canvas);
			});

			ctx.drawImage(canvas, middleLeft, middleTop);

			return newCanvas;

		} else {
			return canvas;
		}
	}

	/**
	 * Returns canvas representation of the [[Sprite]].
	 *
	 * @param   options  Options
	 * @return           Canvas
	 */
	public async getCanvas(options?: IExportImageOptions): Promise<HTMLCanvasElement> {

		// Options are set?
		if (!$type.hasValue(options)) {
			options = {};
		}

		// Get background
		let background = this.backgroundColor || this.findBackgroundColor(this.sprite.dom);

		// Get DOM URL
		let DOMURL = this.getDOMURL();
		let url: string | null = null;
		let blobs: Array<string> | null = null;
		let canvas;

		// Create temporary image element
		try {
			/**
			 * Simplified version using `createObjectURL`
			 * Not supported in older browsers
			 */

			// Get dimensions
			let width = this.sprite.pixelWidth,
				height = this.sprite.pixelHeight,
				font = $dom.findFont(this.sprite.dom),
				fontSize = $dom.findFontSize(this.sprite.dom);

			// Create canvas and its 2D context
			canvas = this.getDisposableCanvas();

			// Set canvas width/height
			let pixelRatio = this.getPixelRatio(options);
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			canvas.width = width * pixelRatio;
			canvas.height = height * pixelRatio;

			let ctx = canvas.getContext("2d");

			if (pixelRatio != 1) {
				ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
			}

			// Add background if necessary
			if (background) {
				ctx.fillStyle = background.toString();
				ctx.fillRect(0, 0, width, height);
			}

			let promises: Promise<any>[] = [];

			if (this.useWebFonts) {
				// TODO what if one of the other things errors before it's been able to set `blobs` ?
				promises.push(this.getFontFamilies().then((fonts) => {
					blobs = fonts.blobs;
					return fonts.cssText;
				}));
			}

			promises.push(this.imagesToDataURI(this.sprite.dom, options));
			promises.push(this.prepForeignObjects(this.sprite.dom, options));

			// Do prepareations on a document
			let a = await Promise.all(promises);

			// Get SVG representation of the Sprite
			let data = this.normalizeSVG(
				"<style>" + a[0] + "</style>" + this.serializeElement(this.sprite.paper.defs) + this.serializeElement(this.sprite.dom),
				options,
				width,
				height,
				font,
				fontSize
			);

			// Get Blob representation of SVG and create object URL
			let svg = new Blob([data], { type: "image/svg+xml" });
			url = DOMURL.createObjectURL(svg);

			let img = await this.loadNewImage(url, width, height, "anonymous");

			// Draw image on canvas
			ctx.drawImage(img, 0, 0);

		} finally {
			if (url !== null) {
				DOMURL.revokeObjectURL(url);
			}

			if (blobs !== null) {
				$array.each(blobs, (url) => {
					DOMURL.revokeObjectURL(url);
				});
			}

			// Restore replaced tainted images in DOM
			this.restoreRemovedObjects();
		}

		return canvas;
	}

	/**
	 * Returns canvas representation of the [[Sprite]] using canvg.
	 *
	 * @param   options  Options
	 * @return           Canvas
	 */
	public async getCanvasAdvanced(options?: IExportImageOptions): Promise<HTMLCanvasElement> {

		// Options are set?
		if (!$type.hasValue(options)) {
			options = {};
		}
		// Convert external images to data uris
		await this.imagesToDataURI(this.sprite.dom, options);

		// Get background
		let background = this.backgroundColor || this.findBackgroundColor(this.sprite.dom);

		// Get canvg
		let canvg = await this.canvg;

		// Get dimensions
		let width = this.sprite.pixelWidth,
			height = this.sprite.pixelHeight,
			font = $dom.findFont(this.sprite.dom),
			fontSize = $dom.findFontSize(this.sprite.dom);

		// Get SVG representation of the Sprite
		let data = this.normalizeSVG(
			this.serializeElement(this.sprite.paper.defs) + this.serializeElement(this.sprite.dom),
			options,
			width,
			height,
			font,
			fontSize,
			background
		);

		// Create canvas and its 2D context
		let canvas = this.getDisposableCanvas();

		// Set canvas width/height
		let pixelRatio = this.getPixelRatio(options);
		canvas.style.width = (width * pixelRatio) + 'px';
		canvas.style.height = (height * pixelRatio) + 'px';
		canvas.width = width * pixelRatio;
		canvas.height = height * pixelRatio;

		let config: any = {
			//ignoreDimensions: true,
			useCORS: true
		};

		if (pixelRatio != 1) {
			config.ignoreDimensions = true;
			config.scaleWidth = width * pixelRatio;
			config.scaleHeight = height * pixelRatio;
		}

		canvg(canvas, data, config);

		return canvas;

	}

	/**
	 * Tries to dynamically load [canvg.js](https://github.com/canvg/canvg) and
	 * export an image using its functions.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @param type     Image format
	 * @param options  Options
	 * @return Data uri
	 */
	public async getImageAdvanced(type: imageFormats, options?: IExportImageOptions, includeExtras?: boolean): Promise<string> {

		let prehidden = this._objectsAlreadyHidden;
		if (!prehidden) {
			this.hideNonExportableSprites();
		}

		if (!$type.hasValue(options)) {
			options = this.getFormatOptions(type);
		}
		// Get canvas
		let canvas = await this.getCanvasAdvanced(options);

		// Add extra sprites
		if (includeExtras !== false) {
			canvas = await this.addExtras(canvas, options, true);
		}

		// Convert canvas to data url
		let uri = canvas.toDataURL(this.getContentType(type), options.quality);

		// Get rid of the canvas
		this.disposeCanvas(canvas);

		if (!prehidden) {
			this.restoreNonExportableSprites();
		}

		return uri;
	}

	/**
	 * Creates a `<canvas>` element and returns it.
	 *
	 * @return Canvas element
	 */
	protected getDisposableCanvas(): HTMLCanvasElement {
		let canvas = document.createElement("canvas");
		canvas.style.position = "fixed";
		canvas.style.top = "-10000px";
		document.body.appendChild(canvas);
		return canvas;
	}

	/**
	 * Removes canvas.
	 *
	 * @param canvas  Canvas element
	 */
	protected disposeCanvas(canvas: HTMLCanvasElement): void {
		document.body.removeChild(canvas);
	}

	/**
	 * Returns pixel ratio for retina displays.
	 *
	 * @return Pixel ratio
	 */
	protected getPixelRatio(options?: IExportImageOptions): number {
		const scale = options && options.scale ? options.scale : 1;
		return (this.useRetina ? $utils.getPixelRatio() : 1) * scale;
	}

	/**
	 * Converts all `<image>` tags in SVG to use data uris instead of external
	 * URLs
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @ignore Exclude from docs
	 * @param el       SVG node
	 * @param options  Options
	 * @return Promise
	 */
	public async imagesToDataURI(el: SVGSVGElement, options?: IExportImageOptions): Promise<void> {

		// Get and process all images
		let images = el.querySelectorAll("image");
		if (images.length) {

			// Init promises
			let promises = [];

			// There are images, process each of them
			for (let count = images.length, i = 0; i < count; i++) {

				// Get image and its href
				let image = images[i];
				let href = image.getAttributeNS(Export.XLINK, "href");

				// no href?
				if (!href) {
					continue;
				}

				if (href.indexOf("data:image") !== -1) {
					// Ignore image if it's already in Data URI format
				}
				else {

					// SVG or bitmap image?
					if (href.indexOf(".svg") !== -1) {
						promises.push(this.svgToDataURI(image, options));
					}
					else {
						promises.push(this.imageToDataURI(image, options));
					}

				}
			}

			await Promise.all(promises);
			return;
		}
		else {
			return;
		}

	}

	/**
	 * `foreignObject` elements cannot be exported. This function hides them
	 * temprarily. In the future it might try to convert them to SVG to make them
	 * exportable.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @ignore Exclude from docs
	 * @param el       SVG node
	 * @param options  Options
	 * @return Promise
	 */
	public async prepForeignObjects(el: SVGSVGElement, options?: IExportImageOptions): Promise<void> {

		// Get and process all foreign objects
		let objects = el.querySelectorAll("foreignObject");
		if (objects.length) {

			// There are foreign objects, process each of them
			for (let count = objects.length, i = 0; i < count; i++) {
				this.temporarilyRemoveObject(objects[i]);
			}
		}

		return;
	}

	/**
	 * Converts an SVG `<image>` to use its data uri for `href` instead of
	 * external file.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @ignore Exclude from docs
	 * @param el       SVG element
	 * @param options  Options
	 */
	public async imageToDataURI(el: SVGImageElement, options?: IExportImageOptions): Promise<string> {

		// Create a new image and set its `crossOrigin`. This might not work on some
		// browsers. We'll deal with it if error occurs
		let img: HTMLImageElement;
		try {

			// Create image
			img = await this.loadNewImage(el.getAttributeNS(Export.XLINK, "href"), null, null, "anonymous");

			// Create new canvas
			let canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;

			// Draw new image on it via `toDataURL`
			canvas.getContext("2d").drawImage(img, 0, 0);

			// Replace image `href` with data uri
			// If we got to this point it means image has loaded, however we might
			// still get an error with `toDataURL()`
			try {
				let uri = canvas.toDataURL();
				el.setAttribute("href", uri);
				return uri;
			}
			catch (e) {
				// Give up and temporarily remove the element href temporarily
				if (options.keepTainted !== false) {
					/*this._removedObjects.push({
						"element": el,
						"originalHref": el.getAttributeNS(Export.XLINK, "href")
					});
					el.setAttributeNS(Export.XLINK, "href", "");*/
					this.temporarilyRemoveObject(el);
				}
				return undefined;
			}

		}
		catch (e) {

			// Give up and temporarily remove the element's href
			if (!options || options.keepTainted !== false) {
				/*this._removedObjects.push({
					"element": el,
					"originalHref": el.getAttributeNS(Export.XLINK, "href")
				});
				el.setAttributeNS(Export.XLINK, "href", "");*/
				this.temporarilyRemoveObject(el);
			}
			return undefined;

		}

	}

	/**
	 * Converts `<image>` with external SVG source to data uri. Loads external SVG
	 * file, then converts it to data uri and replaces the `xlink:href` parameter.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @ignore Exclude from docs
	 * @param el        An SVG element
	 * @param options   Options
	 */
	public async svgToDataURI(el: SVGImageElement, options?: IExportImageOptions): Promise<string> {
		let href = el.getAttributeNS(Export.XLINK, "href");
		try {
			let data = await $net.load(href);
			let charset = this.adapter.apply("charset", {
				charset: "base64",
				type: "svg",
				options: options
			}).charset;

			let uri = this.adapter.apply("svgToDataURI", {
				data: "data:" + this.getContentType("svg") + ";" + charset + "," + btoa(data.response),
				options: options
			}).data;

			el.setAttributeNS(Export.XLINK, "href", uri);
			return uri;
		}
		catch (e) {
			// Disable temporarily
			if (!options || options.keepTainted !== false) {
				/*this._removedObjects.push({
					"element": el,
					"originalHref": href
				});
				el.setAttributeNS(Export.XLINK, "href", "");*/
				this.temporarilyRemoveObject(el);
			}
			return undefined;
		}

	}

	/**
	 * Temporarily removes element from DOM, and replaces it with a dummy
	 * placeholder, as well as stores it for later restoration.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @ignore Exclude from docs
	 * @param el Node
	 */
	public temporarilyRemoveObject(el: Node, placeholder?: SVGSVGElement): void {

		// Get parent
		let parent = el.parentElement || el.parentNode;

		// Create a placeholder group element if it has not been passed in
		if (!placeholder) {
			placeholder = this.sprite.paper.add("g").node;
		}
		parent.insertBefore(placeholder, el);

		// Check if we have a textContents we can replace with
		// @todo Perhaps we should explore alternatives to creating text nodes
		// i.e. creating a text version of the HTML-based Text, just for export
		// purposes. Converting HTML into SVG is very complicated
		if (el.textContent) {
			/*let text = this.sprite.paper.add("text").node;
			text.textContent = el.textContent;
			placeholder.appendChild(text);

			// Copy properties from the removing element to the placeholder
			$dom.copyAttributes(el, placeholder);*/
		}

		// Remove the old element
		parent.removeChild(el);

		// Log removed item
		this._removedObjects.push({
			"element": el,
			"placeholder": placeholder
		});

	}

	/**
	 * Restores all (possibly tainted or unsupported) objects that were
	 * temporarily removed when exporting.
	 *
	 * @ignore Exclude from docs
	 */
	public restoreRemovedObjects(): void {
		let obj: IExportRemovedObject;

		while (true) {
			obj = this._removedObjects.pop()

			if (!obj) {
				break;
			}

			//obj.element.setAttribute("href", obj.originalHref);
			let parent = obj.placeholder.parentElement || obj.placeholder.parentNode;
			parent.insertBefore(obj.element, obj.placeholder);
			//parent.removeChild(obj.placeholder);
		}
	}

	/**
	 * Checkes if simplified export can be used using `createObjectURL` and SVG
	 * document does not contain any external images.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @ignore Exclude from docs
	 * @return `true` if simplified export can be used
	 */
	public async simplifiedImageExport(): Promise<boolean> {

		if (this.useSimplifiedExport === false) {
			return false;
		}

		// Do we have this cached?
		let cache = registry.getCache("simplifiedImageExport");
		if (cache === false || cache === true) {
			return cache;
		}

		// Try generating a small SVG-embedded canvas
		// If exception occurs, simplified method is not supported
		try {
			let canvas = document.createElement("canvas");
			canvas.width = 1;
			canvas.height = 1;
			let ctx = canvas.getContext("2d");
			let DOMURL = this.getDOMURL();
			let svg = new Blob([this.normalizeSVG("<g></g>", {}, 1, 1)], { type: "image/svg+xml" });
			let url = DOMURL.createObjectURL(svg);
			let img;
			try {
				img = await this.loadNewImage(url, 1, 1);
			}
			catch (e) {
				return false;
			}
			ctx.drawImage(img, 0, 0);
			DOMURL.revokeObjectURL(url);
			try {
				//let uri = canvas.toDataURL("image/png");
				registry.setCache("simplifiedImageExport", true);
				return true;
			}
			catch (e) {
				registry.setCache("simplifiedImageExport", false);
				return false;
			}

		} catch (e) {
			registry.setCache("simplifiedImageExport", false);
			return false;
		}
	}

	/**
	 * Returns a new `<image>` element.
	 *
	 * @ignore Exclude from docs
	 * @param url          URL of the image
	 * @param width        Width (px)
	 * @param height       Height (px)
	 * @param crossOrigin  Cross-Origin setting
	 * @return Promise
	 */
	public loadNewImage(url: string, width?: number, height?: number, crossOrigin?: string): Promise<HTMLImageElement> {
		return new Promise((success, error) => {

			// New image
			let image: HTMLImageElement;
			if (width && height) {
				image = new Image(width, height);
			}
			else {
				image = new Image();
			}

			// Set crossorigin
			if (crossOrigin) {
				image.setAttribute("crossOrigin", crossOrigin);
			}

			// Report success on load
			image.onload = () => {
				success(image);
			};

			function onerror() {
				// Error occurred. Just in case it's the crossOrigin issue, let's try
				// stripping off this attribute and trying again
				if (crossOrigin) {

					// Retain old uri
					let currentHref = image.src;

					// Set up another `onerror` to handle situations where image is not
					// loadable at all (i.e. protected by CORS)
					image.onerror = () => {
						// Nope, no luck
						error(new Error("Loading image \"" + url + "\" failed"));
					};

					// remove the `crossOrigin` attribute
					image.removeAttribute("crossorigin");

					// retry
					image.src = "";
					image.src = currentHref;
				}
				else {
					error(new Error("Loading image \"" + url + "\" failed"));
				}
			}

			// Set image error handlers
			image.onabort = onerror;
			image.onerror = onerror;

			// Trigger load
			image.src = url;
		});
	}

	/**
	 * Returns current DOM URL.
	 *
	 * @ignore Exclude from docs
	 * @return URL
	 */
	public getDOMURL(): any {
		return self.URL || (<any>self).webkitURL || self;
	}

	/**
	 * Returns an SVG representation of the chart.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @param type     Type of the export
	 * @param options  Options
	 * @return Promise
	 */
	public async getSVG(type: "svg", options?: IExportSVGOptions): Promise<string> {

		let prehidden = this._objectsAlreadyHidden;
		if (!prehidden) {
			this.hideNonExportableSprites();
		}

		// Wait for required elements to be ready before proceeding
		await this.awaitValidSprites();

		// Get dimensions
		let width = this.sprite.pixelWidth,
			height = this.sprite.pixelHeight,
			font = $dom.findFont(this.sprite.dom),
			fontSize = $dom.findFontSize(this.sprite.dom);
		// Get SVG
		let svg = this.normalizeSVG(
			this.serializeElement(this.sprite.paper.defs) + this.serializeElement(this.sprite.dom),
			options,
			width,
			height,
			font,
			fontSize
		);

		// Prep data URI
		let charset = this.adapter.apply("charset", {
			charset: "charset=utf-8",
			type: "svg",
			options: options
		}).charset;

		let uri = this.adapter.apply("getSVG", {
			data: "data:" + this.getContentType(type) + ";" + charset + "," + encodeURIComponent(svg),
			options: options
		}).data;

		if (!prehidden) {
			this.restoreNonExportableSprites();
		}

		return uri;

	}

	/**
	 * Checks if SVG is fully formatted. Encloses in `<svg>...</svg>` if
	 * necessary.
	 *
	 * @ignore Exclude from docs
	 * @param svg       Input SVG
	 * @param options   Options
	 * @param width     Width of the SVG viewport
	 * @param height    Height of the SVG viewport
	 * @param font      Font family to use as a base
	 * @param fontSize  Font size to use as a base
	 * @return Output SVG
	 * @todo Add style params to existing <svg>
	 */
	public normalizeSVG(svg: string, options?: IExportSVGOptions, width?: number, height?: number, font?: string, fontSize?: string, background?: Color): string {

		// Construct width/height params
		let dimParams = "";
		if (width) {
			dimParams += "width=\"" + width + "px\" ";
		}
		if (height) {
			dimParams += "height=\"" + height + "px\" ";
		}

		// Apply font settings
		let styleParams = "";
		if (font) {
			styleParams += "font-family: " + font.replace(/"/g, "") + ";";
		}
		if (fontSize) {
			styleParams += "font-size: " + fontSize + ";";
		}
		// Add missing <svg> enclosure
		if (!svg.match(/<svg/)) {
			svg = "<?xml version=\"1.0\" encoding=\"utf-8\"?><svg " + dimParams + " style=\"" + styleParams + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">" + svg + "</svg>";
		}
		else {

			if (dimParams !== "") {
				// Clear current params
				svg = svg.replace(/(<svg[^>]*)width="[^"]*"/, "$1");
				svg = svg.replace(/(<svg[^>]*)height="[^"]*"/, "$1");

				// Add new params
				svg = svg.replace(/(<svg)/, "$1" + dimParams);
			}

			/*if (styleParams !== "") {
				// Clear current params
				svg = svg.replace(/(<svg[^>]*)stylewidth="[^"]*"/, "$1");
				svg = svg.replace(/(<svg[^>]*)height="[^"]*"/, "$1");

				// Add new params
				svg = svg.replace(/(<svg)/, "$1" + dimParams);
			}*/
		}


		if (background) {
			svg = svg.replace(/(<svg[^>]*>)/, "$1<rect width=\"100%\" height=\"100%\" fill=\"" + background.rgba + "\"/>");
			//svg = svg.replace(/<\/svg>/, "<rect width=\"100%\" height=\"100%\" fill=\"" + background.rgba + "\"/></svg>");
		}

		if ($browser.isInternetExplorer()) {
			// IE can't handle exporting <feColorMatrix> for some reason
			svg = svg.replace(/<feColorMatrix [^\/>]*\/>/gi, "");
		}

		// Remove base uri-related stuff
		let reg = new RegExp("url\\(" + $utils.escapeForRgex($utils.getBaseURI()), "g");
		svg = svg.replace(reg, "url(#");

		svg = this.adapter.apply("normalizeSVG", {
			data: svg,
			options: options
		}).data;

		return svg;
	}

	/**
	 * Serializes an element and returns its contents.
	 *
	 * @ignore Exclude from docs
	 * @param element  An element to serialize
	 * @return A serialized XML
	 */
	public serializeElement(element: HTMLElement | SVGSVGElement | SVGDefsElement): string {
		return new XMLSerializer().serializeToString(element);
	}

	/**
	 * Returns a PDF containing chart image.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @param type     Type of the export
	 * @param options  Options
	 * @return Promise
	 * @async
	 * @todo Account for header when calculating vertical fit
	 */
	public async getPDF(type: "pdf" | "pdfdata", options?: IExportPDFOptions): Promise<string> {

		// Get image
		let image = await this.getImage(options.imageFormat || "png", options);

		// Load pdfmake
		let pdfmake = await this.pdfmake;

		// Defaults
		let defaultMargins = [30, 30, 30, 30];

		// Init content for PDF
		let doc = {
			pageSize: options.pageSize || "A4",
			pageOrientation: options.pageOrientation || "portrait",
			pageMargins: options.pageMargins || defaultMargins,
			//header: <any>[],
			content: <any>[]
		};

		// Should we add title?
		let title = this.adapter.apply("title", {
			title: this.title,
			options: options
		}).title;

		if (title) {
			doc.content.push({
				text: title,
				fontSize: options.fontSize,
				bold: true,
				margin: [0, 0, 0, 15]
			});
		}

		// Add page URL?
		if (options.addURL) {
			doc.content.push({
				text: this.language.translate("Saved from") + ": " + document.location.href,
				fontSize: options.fontSize,
				margin: [0, 0, 0, 15]
			});
		}

		// Add image
		if (type != "pdfdata") {
			doc.content.push({
				image: image,
				fit: this.getPageSizeFit(doc.pageSize, doc.pageMargins)
			});
		}

		// Add data
		if (type == "pdfdata" || options.addData) {
			doc.content.push({
				table: await this.getPDFData("pdf", options)
			});
		}

		// Apply adapters
		doc = this.adapter.apply("pdfmakeDocument", {
			doc: doc,
			options: options
		}).doc;

		// Create PDF
		return await new Promise<string>((success, error) => {
			pdfmake.createPdf(doc).getDataUrl((uri: string) => {
				success(uri);
			});
		});

	}

	/**
	 * Returns chart's data formatted suitable for PDF export (pdfmake).
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @since 4.7.0
	 * @param type     Type of the export
	 * @param options  Options
	 * @return Promise
	 * @async
	 */
	public async getPDFData(type: "pdf", options?: IExportPDFOptions): Promise<any> {

		// Init output
		let content = <any>{
			"body": <any>[]
		};

		// Data fields
		const dataFields = this.adapter.apply("formatDataFields", {
			dataFields: this.dataFields,
			format: "pdf"
		}).dataFields;

		// Add rows
		const data = this.data;

		// Vertical or horizontal (default) layout
		if (options.pivot) {

			$object.each(dataFields, (key, val) => {
				let dataRow = [];
				if (options.addColumnNames) {
					dataRow.push(val);
				}
				for (let len = data.length, i = 0; i < len; i++) {
					let dataValue = data[i][key];
					dataRow.push(this.convertToSpecialFormat<"pdf">(key, dataValue, options, true));
				}
				content.body.push(this.getPDFDataRow(dataRow, options, undefined, true));
			});

		}

		else {

			// Add column names?
			if (options.addColumnNames) {
				content.body.push(this.getPDFDataRow(dataFields, options, undefined, true));
				content.headerRows = 1;
			}

			for (let len = data.length, i = 0; i < len; i++) {
				content.body.push(this.getPDFDataRow(data[i], options, dataFields));
			}

		}

		return this.adapter.apply("pdfmakeTable", {
			table: content,
			options: options
		}).table;

	}

	/**
	 * Formats a row of data for use in PDF data table (pdfmake).
	 *
	 * @ignore Exclude from docs
	 * @since 4.7.0
	 * @param  row         An object holding data for the row
	 * @param  options     Options
	 * @param  dataFields  Data fields
	 * @param  asIs        Do not try to convert to dates
	 * @return Formated Data line
	 */
	public getPDFDataRow(row: any, options?: IExportPDFOptions, dataFields?: any, asIs: boolean = false): Array<string> {

		// Init
		let items: any[] = [];

		// Data fields
		if (!dataFields) {
			dataFields = row;
		}

		// Process each row item
		$object.each(dataFields, (key, name) => {

			// Get value
			let value = this.convertEmptyValue(key, row[key], options);

			// Convert dates
			let item = asIs ? value : this.convertToSpecialFormat<"csv">(key, value, options);
			item = "" + item;

			// Add to item
			items.push(item);
		});

		return items;
	}

	/**
	 * Returns fit dimensions for available page sizes.
	 *
	 * @ignore Exclude from docs
	 * @param pageSize Page size
	 * @return `[width, height]` in pixels
	 */
	public getPageSizeFit(pageSize: pageSizes, margins?: number | number[]): number[] {

		// Check margins
		let newMargins = [0, 0, 0, 0];
		if (typeof margins == "number") {
			newMargins = [margins, margins, margins, margins];
		}
		else if (margins.length == 2) {
			newMargins = [margins[0], margins[1], margins[0], margins[1]];
		}
		else if (margins.length == 4) {
			newMargins = margins;
		}

		// Define available page sizes
		let sizes = {
			"4A0": [4767.87, 6740.79],
			"2A0": [3370.39, 4767.87],
			A0: [2383.94, 3370.39],
			A1: [1683.78, 2383.94],
			A2: [1190.55, 1683.78],
			A3: [841.89, 1190.55],
			A4: [595.28, 841.89],
			A5: [419.53, 595.28],
			A6: [297.64, 419.53],
			A7: [209.76, 297.64],
			A8: [147.40, 209.76],
			A9: [104.88, 147.40],
			A10: [73.70, 104.88],
			B0: [2834.65, 4008.19],
			B1: [2004.09, 2834.65],
			B2: [1417.32, 2004.09],
			B3: [1000.63, 1417.32],
			B4: [708.66, 1000.63],
			B5: [498.90, 708.66],
			B6: [354.33, 498.90],
			B7: [249.45, 354.33],
			B8: [175.75, 249.45],
			B9: [124.72, 175.75],
			B10: [87.87, 124.72],
			C0: [2599.37, 3676.54],
			C1: [1836.85, 2599.37],
			C2: [1298.27, 1836.85],
			C3: [918.43, 1298.27],
			C4: [649.13, 918.43],
			C5: [459.21, 649.13],
			C6: [323.15, 459.21],
			C7: [229.61, 323.15],
			C8: [161.57, 229.61],
			C9: [113.39, 161.57],
			C10: [79.37, 113.39],
			RA0: [2437.80, 3458.27],
			RA1: [1729.13, 2437.80],
			RA2: [1218.90, 1729.13],
			RA3: [864.57, 1218.90],
			RA4: [609.45, 864.57],
			SRA0: [2551.18, 3628.35],
			SRA1: [1814.17, 2551.18],
			SRA2: [1275.59, 1814.17],
			SRA3: [907.09, 1275.59],
			SRA4: [637.80, 907.09],
			EXECUTIVE: [521.86, 756.00],
			FOLIO: [612.00, 936.00],
			LEGAL: [612.00, 1008.00],
			LETTER: [612.00, 792.00],
			TABLOID: [792.00, 1224.00]
		};

		// Calculate size
		let fitSize = sizes[pageSize]
		fitSize[0] -= newMargins[0] + newMargins[2];
		fitSize[1] -= newMargins[1] + newMargins[3];
		return fitSize;
	}

	/**
	 * Returns an Excel file of chart's data.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @param type     Type of the export
	 * @param options  Options
	 * @return Promise
	 * @async
	 * @todo Handle dates
	 * @todo Support for multi-sheet
	 */
	public async getExcel(type: "xlsx", options?: IExportExcelOptions): Promise<string> {

		// Load xlsx
		let XLSX = await this.xlsx;

		// Create workbook options
		let wbOptions = this.adapter.apply("xlsxWorkbookOptions", {
			options: {
				bookType: "xlsx",
				bookSST: false,
				type: "base64",
				//dateNF: 'yyyy-mm-dd'
			}
		}).options;

		// Get sheet name
		let sheetName = this.normalizeExcelSheetName(this.adapter.apply("xlsxSheetName", {
			name: this.title || this.language.translate("Data")
		}).name);

		// Create a workbook
		let wb = {
			SheetNames: <any>[sheetName],
			Sheets: <any>{}
		};

		// Init worksheet data
		let data: Array<any> = [];

		// Data fields
		const dataFields = this.adapter.apply("formatDataFields", {
			dataFields: this.dataFields,
			format: "xslx"
		}).dataFields;

		// Vertical or horizontal (default) layout
		if (options.pivot) {

			$object.each(dataFields, (key, val) => {
				let dataRow = [];
				if (options.addColumnNames) {
					dataRow.push(val);
				}
				for (let len = this.data.length, i = 0; i < len; i++) {
					let dataValue = this.data[i][key];
					dataRow.push(this.convertToSpecialFormat<"xlsx">(key, dataValue, options, true));
				}
				data.push(this.getExcelRow(dataRow, options, undefined, true));
			});

		}

		else {
			// Add column names?
			if (options.addColumnNames) {
				data.push(this.getExcelRow(dataFields, options, undefined, true));
			}

			// Add lines
			for (let len = this.data.length, i = 0; i < len; i++) {
				data.push(this.getExcelRow(this.data[i], options, dataFields));
			}
		}

		// Create sheet and add data
		wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);

		// Generate data uri
		let uri = this.adapter.apply("getExcel", {
			data: "data:" + this.getContentType(type) + ";base64," + XLSX.write(wb, wbOptions),
			options: options
		}).data;

		return uri;
	}

	/**
	 * This is needed to work around Excel limitations.
	 *
	 * @param name  Source name
	 * @return Normalized name
	 */
	private normalizeExcelSheetName(name: string): string {
		name = name.replace(/([:\\\/?*\[\]]+)/g, " ");
		return $utils.truncateWithEllipsis(name, 31, "...", true);
	}

	/**
	 * Rertuns an array of values to be used as Excel row.
	 *
	 * @ignore Exclude from docs
	 * @param  row         Row data
	 * @param  options     Options
	 * @param  dataFields  Data fields
	 * @param  asIs        Do not try to convert to dates
	 * @return Array of values
	 */
	public getExcelRow(row: any, options?: IExportExcelOptions, dataFields?: any, asIs: boolean = false): any[] {

		// Init
		let items: any[] = [];

		// Data fields
		if (!dataFields) {
			dataFields = row;
		}

		// Process each row item
		$object.each(dataFields, (key, name) => {

			// Get value
			let value = this.convertEmptyValue(key, row[key], options);

			// Convert dates
			let item = asIs ? value : this.convertToSpecialFormat<"xlsx">(key, value, options, true);

			items.push(item);
		});

		return items;
	}

	/**
	 * Returns chart's data formatted as CSV.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @param type     Type of the export
	 * @param options  Options
	 * @return Promise
	 * @async
	 */
	public async getCSV(type: "csv", options?: IExportCSVOptions): Promise<string> {

		// Init output
		let csv = "";

		// Data fields
		const dataFields = this.adapter.apply("formatDataFields", {
			dataFields: this.dataFields,
			format: "csv"
		}).dataFields;

		// Add rows
		let br = "";
		const data = this.data;

		// Vertical or horizontal (default) layout
		if (options.pivot) {

			$object.each(dataFields, (key, val) => {
				let dataRow = [];
				if (options.addColumnNames) {
					dataRow.push(val);
				}
				for (let len = data.length, i = 0; i < len; i++) {
					let dataValue = data[i][key];
					dataRow.push(this.convertToSpecialFormat<"csv">(key, dataValue, options, true));
				}
				csv += br + this.getCSVRow(dataRow, options, undefined, true);
				br = "\n";
			});

		}

		else {
			for (let len = data.length, i = 0; i < len; i++) {
				let row = this.getCSVRow(data[i], options, dataFields);
				if (options.reverse) {
					csv = row + br + csv;
				}
				else {
					csv += br + row;
				}
				br = "\n";
			}

			// Add column names?
			if (options.addColumnNames) {
				csv = this.getCSVRow(dataFields, options, undefined, true) + br + csv;
			}
		}

		// Add content type
		let charset = this.adapter.apply("charset", {
			charset: "charset=utf-8",
			type: type,
			options: options
		}).charset;

		let uri = this.adapter.apply("getCSV", {
			data: "data:" + this.getContentType(type) + ";" + charset + "," + encodeURIComponent(csv),
			options: options
		}).data;

		return uri;

	}

	/**
	 * Formats a row of CSV data.
	 *
	 * @ignore Exclude from docs
	 * @param  row         An object holding data for the row
	 * @param  options     Options
	 * @param  dataFields  Data fields
	 * @param  asIs        Do not try to convert to dates
	 * @return Formated CSV line
	 */
	public getCSVRow(row: any, options?: IExportCSVOptions, dataFields?: any, asIs: boolean = false): string {

		// Init
		let separator = options.separator || ",";
		let items: any[] = [];

		// Data fields
		if (!dataFields) {
			dataFields = row;
		}

		// Process each row item
		$object.each(dataFields, (key, name) => {

			// Get value
			let value = this.convertEmptyValue(key, row[key], options);

			// Check if we need to skip
			// This is no longer required because we are iterating via dataFields anyway
			/*if ($type.hasValue(this.dataFields) && !$type.hasValue(this.dataFields[key])) {
				return;
			}*/

			// Convert dates
			let item = asIs ? value : this.convertToSpecialFormat<"csv">(key, value, options);

			// Cast and escape doublequotes
			item = "" + item;
			item = item.replace(/"/g, '""');

			// Enclose into double quotes
			if (options.forceQuotes || (item.search(new RegExp("\"|\n|" + separator, "g")) >= 0)) {
				item = "\"" + item + "\"";
			}

			// Add to item
			items.push(item);
		});

		return items.join(separator);
	}

	/**
	 * Returns chart's data formatted as HTML table.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @since 4.7.0
	 * @param type     Type of the export
	 * @param options  Options
	 * @return Promise
	 * @async
	 */
	public async getHTML(type: "html", options?: IExportHTMLOptions): Promise<string> {

		// Init output
		let html = "<table>";
		if (options.tableClass) {
			html = "<table class=\"" + options.tableClass + "\">";
		}

		// Data fields
		const dataFields = this.adapter.apply("formatDataFields", {
			dataFields: this.dataFields,
			format: "html"
		}).dataFields;

		// Add rows
		const data = this.data;

		// Vertical or horizontal (default) layout
		if (options.pivot) {

			$object.each(dataFields, (key, val) => {
				let dataRow = [];
				if (options.addColumnNames) {
					dataRow.push(val);
				}
				for (let len = data.length, i = 0; i < len; i++) {
					let dataValue = data[i][key];
					dataRow.push(this.convertToSpecialFormat<"html">(key, dataValue, options, true));
				}
				html += "\n" + this.getHTMLRow(dataRow, options, undefined, true);
			});

		}

		else {
			// Add column names?
			if (options.addColumnNames) {
				html += "\n" + this.getHTMLRow(dataFields, options, undefined, true, true);
			}

			for (let len = data.length, i = 0; i < len; i++) {
				html += "\n" + this.getHTMLRow(data[i], options, dataFields);
			}
		}

		html += "</table>";

		// Add content type
		let charset = this.adapter.apply("charset", {
			charset: "charset=utf-8",
			type: type,
			options: options
		}).charset;

		let uri = this.adapter.apply("getHTML", {
			data: "data:" + this.getContentType(type) + ";" + charset + "," + encodeURIComponent(html),
			options: options
		}).data;

		return uri;

	}

	/**
	 * Formats a row of HTML data.
	 *
	 * @since 4.7.0
	 * @ignore Exclude from docs
	 * @param  row         An object holding data for the row
	 * @param  options     Options
	 * @param  dataFields  Data fields
	 * @param  asIs        Do not try to convert to dates
	 * @return Formated HTML row
	 */
	public getHTMLRow(row: any, options?: IExportHTMLOptions, dataFields?: any, asIs: boolean = false, headerRow: boolean = false): string {

		// Init output
		let html = "\t<tr>";
		if (options.rowClass) {
			html = "\t<tr class=\"" + options.rowClass + "\">";
		}

		// Data fields
		if (!dataFields) {
			dataFields = row;
		}

		// th or dh?
		const tag = headerRow ? "th" : "td";

		// Process each row item
		let first = true;
		$object.each(dataFields, (key, name) => {

			// Get value
			let value = this.convertEmptyValue(key, row[key], options);

			// Convert dates
			let item = asIs ? value : this.convertToSpecialFormat<"html">(key, value, options);

			// Escape HTML entities
			item = "" + item;
			item = item.replace(/[\u00A0-\u9999<>\&]/gim, function(i: string) {
				return "&#" + i.charCodeAt(0) + ";";
			});

			// Which tag to use
			let useTag = tag;
			if (options.pivot && first) {
				useTag = "th";
			}

			// Add cell
			if (options.cellClass) {
				html += "\n\t\t<" + useTag + " class=\"" + options.cellClass + "\">" + item + "</" + useTag + ">";
			}
			else {
				html += "\n\t\t<" + useTag + ">" + item + "</" + useTag + ">";
			}

			first = false;
		});

		html += "\n\t</tr>";

		return html;
	}

	/**
	 * Returns chart's data in JSON format.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @param type     Type of the export
	 * @param options  Options
	 * @return Promise
	 * @async
	 */
	public async getJSON(type: "json", options?: IExportJSONOptions): Promise<string> {

		// Check if we need to regenerate data based on `dataFields`
		let data: any[];
		const dataFields = this.adapter.apply("formatDataFields", {
			dataFields: this.dataFields,
			format: "csv"
		}).dataFields;
		if (!this._dynamicDataFields) {
			data = [];
			const sourceData = this.data;
			for (let len = sourceData.length, i = 0; i < len; i++) {
				let value = sourceData[i];
				if (typeof value == "object") {
					let newValue: any = {};
					$object.each(value, (field, item) => {
						if ($type.hasValue(dataFields[field])) {
							newValue[dataFields[field]] = this.convertToSpecialFormat<"json">(field, item, options);
						}
					});
					data.push(newValue);
				}
			}
		}
		else {
			data = this.data;
		}

		// Stringify JSON
		let json = JSON.stringify(data, (key, value) => {
			if (typeof value == "object") {
				$object.each(value, (field, item) => {
					value[field] = this.convertToSpecialFormat<"json">(field, item, options);
				});
			}
			return value;
		}, options.indent);

		// Add content type
		let charset = this.adapter.apply("charset", {
			charset: "charset=utf-8",
			type: type,
			options: options
		}).charset;

		let uri = this.adapter.apply("getJSON", {
			data: "data:" + this.getContentType(type) + ";" + charset + "," + encodeURIComponent(json),
			options: options
		}).data;

		return uri;

	}

	/**
	 * Converts the value to proper date format.
	 *
	 * @ignore Exclude from docs
	 * @param  field         Field name
	 * @param  value         Value
	 * @param  options       Options
	 * @param  keepOriginal  Will ignore formatting and will keep value as it is in data
	 * @return Formatted date value or unmodified value
	 */
	public convertToSpecialFormat<Key extends "json" | "csv" | "xlsx" | "html" | "pdf">(field: string, value: any, options?: IExportOptions[Key], keepOriginal?: boolean): any {

		// Is this a timestamp or duration?
		if (typeof value == "number") {
			if (this.isDateField(field)) {
				value = new Date(value);
			}
			else if (this.isDurationField(field)) {
				return this.durationFormatter.format(value, this.durationFormat);
			}
			else if (this.isNumberField(field) && this.numberFormat) {
				return this.numberFormatter.format(value, this.numberFormat);
			}
		}

		if (value instanceof Date) {
			if (options.useTimestamps) {
				value = value.getTime();
			}
			else if (options.useLocale) {
				if (!keepOriginal) {
					value = value.toLocaleString();
				}
			}
			else {
				value = this.dateFormatter.format(value, this.dateFormat);
			}
		}
		else if ($type.isString(value) && this.isDateField(field) && this.dateFormat) {
			value = this.dateFormatter.format(this.dateFormatter.parse(value), this.dateFormat);
		}

		return value;
	}

	/**
	 * Converts empty value based on `emptyAs` option.
	 *
	 * @ignore Exclude from docs
	 */
	public convertEmptyValue<Key extends "csv" | "xlsx">(field: string, value: any, options?: IExportOptions[Key]): any {
		return $type.hasValue(value) ? value : options.emptyAs;
	}

	/**
	 * Triggers download of the file.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @param uri       Data URI with file content
	 * @param fileName  File name
	 * @return Promise
	 * @async
	 */
	public async download(uri: string, fileName: string): Promise<boolean> {

		if (this.msBlobDownloadSupport()) {

			/**
			 * For all IEs 10 and up we use native method `msSaveBlob`
			 */

			// Extract content type and get pure data without headers
			let parts = uri.split(";");
			let contentType = parts.shift().replace(/data:/, "");
			uri = decodeURIComponent(parts.join(";").replace(/^[^,]*,/, ""));


			// Check if we need to Base64-decode
			if (["image/svg+xml", "application/json", "text/csv"].indexOf(contentType) == -1) {
				try {
					let decoded = atob(uri);
					uri = decoded;
				} catch (e) {
					// Error occurred, meaning string was not Base64-encoded. Do nothing.
					return false;
				}
			}
			else {
				let blob = new Blob([uri], { type: contentType });
				window.navigator.msSaveBlob(blob, fileName);
				return true;
			}

			// Dissect uri into array
			let chars = new Array(uri.length);
			for (let i = 0; i < uri.length; ++i) {
				let charCode = uri.charCodeAt(i);
				chars[i] = charCode;
			}

			// Prep Blob and force the download
			let blob = new Blob([new Uint8Array(chars)], { type: contentType });
			window.navigator.msSaveBlob(blob, fileName);

		}

		else if (this.blobDownloadSupport()) {

			/**
			 * Supports Blob object.
			 * Use it.
			 */
			let link = document.createElement("a");
			link.download = fileName;
			document.body.appendChild(link);

			// Extract content type and get pure data without headers
			let parts = uri.split(";");
			let contentType = parts.shift().replace(/data:/, "");

			uri = decodeURIComponent(parts.join(";").replace(/^[^,]*,/, ""));

			if (["image/svg+xml", "application/json", "text/csv", "text/html"].indexOf(contentType) == -1) {
				try {
					let decoded = atob(uri);
					uri = decoded;
				} catch (e) {
					// Error occurred, meaning string was not Base64-encoded. Do nothing.
					return false;
				}
			}
			else {
				let blob = new Blob([uri], { type: contentType });
				let url = window.URL.createObjectURL(blob);
				link.href = url;
				link.download = fileName;
				link.click();
				setTimeout(() => {
					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);
				}, 100);
				return true;
			}

			// Dissect uri into array
			let chars = new Array(uri.length);
			for (let i = 0; i < uri.length; ++i) {
				let charCode = uri.charCodeAt(i);
				chars[i] = charCode;
			}

			let blob = new Blob([new Uint8Array(chars)], { type: contentType });
			let url = window.URL.createObjectURL(blob);
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			setTimeout(() => {
				window.URL.revokeObjectURL(url);
			}, 100);

		}

		else if (this.linkDownloadSupport()) {

			/**
			 * For regular browsers, we create a link then simulate a click on it
			 */

			let link = document.createElement("a");
			link.download = fileName;
			link.href = uri;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

		}
		else if (this.legacyIE()) {

			/**
			 * Old IEs (9 and down) we will use an <iframe> trick
			 */

			let parts = uri.match(/^data:(.*);[ ]*([^,]*),(.*)$/);

			if (parts.length === 4) {
				// Base64-encoded or text-based stuff?
				if (parts[2] == "base64") {

					// Base64-encoded - probably an image
					if (parts[1].match(/^image\//)) {

						// Yep, an image. Let's create a temporary image placeholder,
						// so that user can use do Save As.
						this.showModal(
							"<img src=\"" + uri + "\" style=\"float: left; max-width: 50%; max-height: 80%; margin: 0 1em 0.5em 0; border: 1px solid #eee;\" />" +
							"<p>" + this.language.translate(
								"To save the image, right-click thumbnail on the left and choose \"Save picture as...\""
							) +
							"</p>" +
							"<p style=\"text-align: center;\"><small>" + this.language.translate(
								"(Press ESC to close this message)"
							) + "</small></p>",
							this.language.translate("Image Export Complete")
						);

					}

				}
				else {

					// Text-based

					// IE9 is trippy about saving files with filenames of the extensions it
					// does not know. Let's use .txt extension for all text-based export
					// formats, except SVG.
					let contentType;
					if (fileName.match(/\.svg$/)) {
						contentType = "image/svg+xml";
					}
					else {
						contentType = "text/plain";
						fileName += ".txt";
					}

					// Create temporary iframe
					let iframe = document.createElement("iframe");
					iframe.width = "1px";
					iframe.height = "1px"
					iframe.style.display = "none";
					document.body.appendChild(iframe);

					// Add our stuff to the document of the iframe and trigger save as
					let idoc = iframe.contentDocument;
					idoc.open(contentType, "replace");
					// TODO test this with various encodings (e.g. UTF)
					//idoc.charset = parts[2].replace(/charset=/, "");
					idoc.write(decodeURIComponent(parts[3]));
					idoc.close();
					idoc.execCommand("SaveAs", true, fileName);

					// Destroy the iframe
					document.body.removeChild(iframe);

				}

			}

		}
		else {

			/**
			 * Something else - perhaps a mobile.
			 * Let's just display it in the same page.
			 * (hey we don't like it either)
			 */
			window.location.href = uri;
		}

		return true;

	}

	/**
	 * Returns `true` if browser has any supported methods to trigger download
	 * of a binary file.
	 *
	 * @return Supports downloads?
	 */
	public downloadSupport(): boolean {
		//return !this.legacyIE();
		return this.linkDownloadSupport() || this.msBlobDownloadSupport();
	}

	/**
	 * Checks if the browser supports "download" attribute on links.
	 *
	 * @ignore Exclude from docs
	 * @return Browser supports triggering downloads?
	 */
	public linkDownloadSupport(): boolean {
		// Do we have this cached?
		let cache = registry.getCache("linkDownloadSupport");
		if (cache === false || cache === true) {
			return cache;
		}
		let a = document.createElement("a");
		let res = typeof a.download !== "undefined";
		registry.setCache("linkDownloadSupport", res);
		return res;
	}

	/**
	 * Checks if the browser supports download via `msBlob`.
	 *
	 * @ignore Exclude from docs
	 * @return Browser supports triggering downloads?
	 */
	public blobDownloadSupport(): boolean {
		return $type.hasValue(window.Blob);
	}

	/**
	 * Checks if the browser supports download via `msBlob`.
	 *
	 * @ignore Exclude from docs
	 * @return Browser supports triggering downloads?
	 */
	public msBlobDownloadSupport(): boolean {
		return $type.hasValue(window.navigator.msSaveOrOpenBlob);
	}

	/**
	 * Checks if this is a legacy version of IE.
	 *
	 * @ignore Exclude from docs
	 * @return IE9 or less?
	 */
	public legacyIE(): boolean {
		// Create a temporary <div> with conditional tags in it an an <i> tag.
		// Count <i>s. If there are some, we have IE9 or late on our hands.
		let div = document.createElement("div");
		div.innerHTML = "<!--[if lt IE 10]><i></i><![endif]-->";
		return div.getElementsByTagName("i").length == 1;
	}

	/**
	 * Initiates print of the chart.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @param data     Data URI for the image
	 * @param options  Options
	 * @param title    Optional title to use (uses window's title by default)
	 * @return Promise
	 * @async
	 */
	public async print(data: string, options?: IExportPrintOptions, title?: string): Promise<boolean> {

		if (options.printMethod == "css") {
			return this.printViaCSS(data, options, title);
		}
		else {
			return this.printViaIframe(data, options, title);
		}

	}

	protected async printViaCSS(data: string, options?: IExportPrintOptions, title?: string): Promise<boolean> {
		// Save current scroll position
		let scroll = document.documentElement.scrollTop || document.body.scrollTop;

		// Hide all current nodes of the document and save their current states
		// of `display` style
		/*let states: Array<string> = [];
		let items = document.body.childNodes;
		for (let len = items.length, i = 0; i < len; i++) {
			let item = <HTMLElement>items[i];
			if ($dom.isElement(item)) {
				states[i] = item.style.display;
				item.style.display = "none";
			}
		}*/

		// Hide all document nodes by applyin custom CSS
		let rule = new StyleRule("body > *", {
			"display": "none",
			"position": "fixed",
			"visibility": "hidden",
			"opacity": "0",
			"clipPath": "polygon(0px 0px,0px 0px,0px 0px,0px 0px);"
		});

		// Replace title?
		let originalTitle: string;
		if (title && document && document.title) {
			originalTitle = document.title;
			document.title = title;
		}

		// Create and add exported image
		let img = new Image();
		img.src = data;
		img.style.maxWidth = "100%";
		img.style.display = "block";
		img.style.position = "relative";
		img.style.visibility = "visible";
		img.style.opacity = "1";
		img.style.clipPath = "none";
		document.body.appendChild(img);

		// Print
		this.setTimeout(() => {
			(<any>window).print();
		}, 50);

		// Delay needs to be at least a second for iOS devices
		let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(<any>window).MSStream;
		if (isIOS && (options.delay < 1000)) {
			options.delay = 1000;
		}
		else if (options.delay < 100) {
			options.delay = 100;
		}

		// Delay function that resets back the document the way ot was before
		this.setTimeout(() => {

			// Remove image
			document.body.removeChild(img);

			// Reset back all elements
			/*for (let len = items.length, i = 0; i < len; i++) {
				let item = <HTMLElement>items[i];
				if ($dom.isElement(item)) {
					item.style.display = states[i];
				}
			}*/
			rule.dispose();

			// Restore title
			if (originalTitle) {
				document.title = document.title;
			}

			// Scroll back the document the way it was before
			document.documentElement.scrollTop = document.body.scrollTop = scroll;

		}, options.delay || 500);

		return true;
	}

	protected async printViaIframe(data: string, options?: IExportPrintOptions, title?: string): Promise<boolean> {

		// Create an iframe
		let iframe = document.createElement("iframe");
		iframe.style.visibility = "hidden";
		document.body.appendChild(iframe);

		// This is needed for FireFox
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.close();

		// Create and add exported image
		let img = new Image();
		img.src = data;
		img.style.maxWidth = "100%";
		if (title) {
			iframe.contentWindow.document.title = title;
		}
		iframe.contentWindow.document.body.appendChild(img);

		(<any>iframe).load = function() {
			iframe.contentWindow.document.body.appendChild(img);
		};

		// Print
		this.setTimeout(() => {
			try {
				if (!(<any>iframe).contentWindow.document.execCommand("print", false, null)) {
					(<any>iframe).contentWindow.print()​​​​​​;
				}
			} catch (e) {
				(<any>iframe).contentWindow.print()​​​​​​;
			}
		}, options.delay || 50);

		// Delay needs to be at least a second for iOS devices
		let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(<any>window).MSStream;
		if (isIOS && (options.delay < 1000)) {
			options.delay = 1000;
		}
		else if (options.delay < 100) {
			options.delay = 100;
		}

		// Delay function that resets back the document the way ot was before
		this.setTimeout(() => {

			// Remove image
			document.body.removeChild(iframe);

		}, options.delay + 50 || 100);

		return true;
	}

	/**
	 * Finds a background color for the element. If element is transparent it goes
	 * up the DOM hierarchy to find a parent element that does.
	 *
	 * @ignore Exclude from docs
	 * @param element Element
	 * @return Color code
	 */
	public findBackgroundColor(element: Element): Color {

		// Check if element has styles set
		let opacity = 1,
			currentColor = (<string>getComputedStyle(element, "background-color"));

		// Check opacity
		if (currentColor.match(/[^,]*,[^,]*,[^,]*,[ ]?0/) || currentColor == "transparent") {
			opacity = 0;
		}

		if (opacity == 0) {
			let parent = element.parentElement;// || <Element>element.parentNode;

			// Completely transparent. Look for a parent
			if (parent) {
				return this.findBackgroundColor(parent);
			}
			else {
				return color("#fff");
			}
		}
		else {
			return color(currentColor, opacity);
		}

	}

	/**
	 * A reference to a container to be used to place [[ExportMenu]] in.
	 *
	 * @param value Reference
	 */
	public set container(value: HTMLElement) {
		this._container = value;
	}

	/**
	 * @return Reference
	 */
	public get container(): HTMLElement {
		return this.adapter.apply("container", {
			container: this._container
		}).container;
	}

	/**
	 * A reference to [[Sprite]] to export. Can be any Sprite, including some
	 * internal elements.
	 *
	 * @param value Sprite
	 */
	public set sprite(value: Sprite) {
		this._sprite = value;
	}

	/**
	 * @return Sprite
	 */
	public get sprite(): Sprite {
		return this.adapter.apply("sprite", {
			sprite: this._sprite
		}).sprite;
	}

	/**
	 * An array of extra [[Sprite]] elements to include in export.
	 *
	 * It can be used to export any external elements, or even other charts.
	 *
	 * E.g.:
	 *
	 * ```TypeScript
	 * chart.exporting.extraSprites.push(chart2);
	 * ```
	 * ```JavaScript
	 * chart.exporting.extraSprites.push(chart2);
	 * ```
	 *
	 * @since 4.2.0
	 * @param value Sprite
	 */
	public set extraSprites(value: Array<Sprite | IExportCanvas>) {
		this._extraSprites = value;
	}

	/**
	 * @return Sprite
	 */
	public get extraSprites(): Array<Sprite | IExportCanvas> {
		return this.adapter.apply("extraSprites", {
			extraSprites: this._extraSprites
		}).extraSprites;
	}

	/**
	 * An array of [[Sprite]] elements that need to be valid before export
	 * commences.
	 *
	 * If any of those elements is not completely ready when export is triggered,
	 * the export will wait until they are (their `validated` event triggers)
	 * before going through with the export opertaion.
	 *
	 * This is useful if you need to modify chart appearance for the export.
	 *
	 * E.g.:
	 *
	 * ```TypeScript
	 * // Add watermark
	 * let watermark = chart.createChild(am4core.Label);
	 * watermark.text = "Copyright (C) 2019";
	 * watermark.disabled = true;
	 *
	 * // Add watermark to validated sprites
	 * chart.exporting.validateSprites.push(watermark);
	 *
	 * // Enable watermark on export
	 * chart.exporting.events.on("exportstarted", function(ev) {
	 *   watermark.disabled = false;
	 * });
	 *
	 * // Disable watermark when export finishes
	 * chart.exporting.events.on("exportfinished", function(ev) {
	 *   watermark.disabled = true;
	 * });
	 * ```
	 * ```JavaScript
	 * // Add watermark
	 * var watermark = chart.createChild(am4core.Label);
	 * watermark.text = "Copyright (C) 2019";
	 * watermark.disabled = true;
	 *
	 * // Add watermark to validated sprites
	 * chart.exporting.validateSprites.push(watermark);
	 *
	 * // Enable watermark on export
	 * chart.exporting.events.on("exportstarted", function(ev) {
	 *   watermark.disabled = false;
	 * });
	 *
	 * // Disable watermark when export finishes
	 * chart.exporting.events.on("exportfinished", function(ev) {
	 *   watermark.disabled = true;
	 * });
	 * ```
	 *
	 * @since 4.6.8
	 * @param value Sprite
	 */
	public set validateSprites(value: Array<Sprite>) {
		this._validateSprites = value;
	}

	/**
	 * @return Sprite
	 */
	public get validateSprites(): Array<Sprite> {
		return this.adapter.apply("validateSprites", {
			validateSprites: this._validateSprites
		}).validateSprites;
	}

	/**
	 * Data to export.
	 *
	 * @param value Data
	 */
	public set data(value: any) {
		this._data = value;
	}

	/**
	 * @return Data
	 */
	public get data(): any {
		return this.adapter.apply("data", {
			data: this._data
		}).data;
	}

	/**
	 * Data fields in `{ field: fieldName }` format. Those are used for
	 * exporting in data formats to name the columns.
	 *
	 * @param value Field names
	 */
	public set dataFields(value: any) {
		this._dataFields = value;
		this._dynamicDataFields = false;
	}

	/**
	 * @return Field names `{ field: fieldName }`
	 */
	public get dataFields(): any {
		if (!this._dataFields) {
			this.generateDataFields();
		}
		return this.adapter.apply("dataFields", {
			dataFields: this._dataFields
		}).dataFields;
	}

	/**
	 * Called after target chart's data updates.
	 *
	 * @ignore
	 */
	public handleDataUpdated(): void {
		if (this._dynamicDataFields) {
			this._dataFields = undefined;
		}
	}

	/**
	 * A [[DateFormatter]] to use when formatting dates when exporting data.
	 *
	 * @param value DateFormatter instance
	 */
	public set dateFormatter(value: any) {
		this._dateFormatter = value;
	}

	/**
	 * @return A DateFormatter instance
	 */
	public get dateFormatter(): any {
		if (!this._dateFormatter) {
			this._dateFormatter = new DateFormatter();
			this._dateFormatter.language = this.language;
		}
		return this.adapter.apply("dateFormatter", {
			dateFormatter: this._dateFormatter
		}).dateFormatter;
	}

	/**
	 * A date format to use for exporting dates. Will use [[DateFormatter]]
	 * format if not set.
	 *
	 * @param value Date format
	 */
	public set dateFormat(value: $type.Optional<string | Intl.DateTimeFormatOptions>) {
		this._dateFormat = value;
	}

	/**
	 * @return Date format
	 */
	public get dateFormat(): $type.Optional<string | Intl.DateTimeFormatOptions> {
		return this.adapter.apply("dateFormat", {
			dateFormat: this._dateFormat
		}).dateFormat;
	}

	/**
	 * A list of fields that hold date values.
	 *
	 * @param value Date field list
	 */
	public set dateFields(value: List<string>) {
		this._dateFields = value;
	}

	/**
	 * @return Date field list
	 */
	public get dateFields(): List<string> {
		if (!this._dateFields) {
			this._dateFields = new List<string>();
		}
		return this.adapter.apply("dateFields", {
			dateFields: this._dateFields
		}).dateFields;
	}

	/**
	 * A [[NumberFormatter]] to use when formatting dates when exporting data.
	 *
	 * @since 4.5.15
	 * @param value NumberFormatter instance
	 */
	public set numberFormatter(value: any) {
		this._dateFormatter = value;
	}

	/**
	 * @return A NumberFormatter instance
	 */
	public get numberFormatter(): any {
		if (!this._numberFormatter) {
			this._numberFormatter = new NumberFormatter();
			this._numberFormatter.language = this.language;
		}
		return this.adapter.apply("numberFormatter", {
			numberFormatter: this._numberFormatter
		}).numberFormatter;
	}

	/**
	 * A number format to use for exporting dates. Will use [[NumberFormatter]]
	 * format if not set.
	 *
	 * @since 4.5.15
	 * @param value Number format
	 */
	public set numberFormat(value: $type.Optional<string>) {
		this._numberFormat = value;
	}

	/**
	 * @return Number format
	 */
	public get numberFormat(): $type.Optional<string> {
		return this.adapter.apply("numberFormat", {
			numberFormat: this._numberFormat
		}).numberFormat;
	}

	/**
	 * A list of fields that hold number values.
	 *
	 * @since 4.5.15
	 * @param value Number field list
	 */
	public set numberFields(value: List<string>) {
		this._numberFields = value;
	}

	/**
	 * @return Number field list
	 */
	public get numberFields(): List<string> {
		if (!this._numberFields) {
			this._numberFields = new List<string>();
		}
		return this.adapter.apply("numberFields", {
			numberFields: this._numberFields
		}).numberFields;
	}

	/**
	 * A [[DurationFormatter]] to use when formatting duration values when
	 * exporting data.
	 *
	 * @param value  DurationFormatter instance
	 */
	public set durationFormatter(value: any) {
		this._durationFormatter = value;
	}

	/**
	 * @return A DurationFormatter instance
	 */
	public get durationFormatter(): any {
		if (!this._durationFormatter) {
			this._durationFormatter = new DurationFormatter();
			this._durationFormatter.language = this.language;
		}
		return this.adapter.apply("durationFormatter", {
			durationFormatter: this._durationFormatter
		}).durationFormatter;
	}

	/**
	 * A format to use when formatting values from `durationFields`.
	 * Will use [[DurationFormatter]] format if not set.
	 *
	 * @param value Duration format
	 */
	public set durationFormat(value: $type.Optional<string>) {
		this._durationFormat = value;
	}

	/**
	 * @return Duration format
	 */
	public get durationFormat(): $type.Optional<string> {
		return this.adapter.apply("durationFormat", {
			durationFormat: this._durationFormat
		}).durationFormat;
	}

	/**
	 * A list of fields that hold duration values.
	 *
	 * @param value Duration field list
	 */
	public set durationFields(value: List<string>) {
		this._durationFields = value;
	}

	/**
	 * @return Duration field list
	 */
	public get durationFields(): List<string> {
		if (!this._durationFields) {
			this._durationFields = new List<string>();
		}
		return this.adapter.apply("durationFields", {
			durationFields: this._durationFields
		}).durationFields;
	}

	/**
	 * Generates data fields out of the first row of data.
	 *
	 * @ignore Exclude from docs
	 */
	public generateDataFields(): void {
		this._dataFields = {};
		if (this.data.length) {
			$array.each(this.data, (row) => {
				$object.each(row, (key, value) => {
					if (!$type.hasValue(this._dataFields[key])) {
						this._dataFields[key] = this.adapter.apply("dataFieldName", {
							name: key,
							field: key
						}).name;
					}
				});
			});
		}
	}

	/**
	 * Cheks against `dateFields` property to determine if this field holds
	 * dates.
	 *
	 * @ignore Exclude from docs
	 * @param field   Field name
	 * @param options Options
	 * @return `true` if it's a date field
	 */
	public isDateField(field: string): boolean {
		return this.adapter.apply("isDateField", {
			isDateField: this.dateFields.contains(field),
			field: field
		}).isDateField;
	}

	/**
	 * Cheks against `numberFields` property to determine if this field holds
	 * numbers.
	 *
	 * @ignore Exclude from docs
	 * @param field   Field name
	 * @param options Options
	 * @return `true` if it's a number field
	 */
	public isNumberField(field: string): boolean {
		return this.adapter.apply("isNumberField", {
			isNumberField: this.numberFields.contains(field),
			field: field
		}).isNumberField;
	}

	/**
	 * Cheks against `durationFields` property to determine if this field holds
	 * durations.
	 *
	 * @ignore Exclude from docs
	 * @param field   Field name
	 * @param options Options
	 * @return `true` if it's a date field
	 */
	public isDurationField(field: string): boolean {
		return this.adapter.apply("isDurationField", {
			isDurationField: this.durationFields.contains(field),
			field: field
		}).isDurationField;
	}

	/**
	 * Returns proper content type for the export type.
	 *
	 * @param type  Export format/type
	 * @return Proper content type, i.e. "image/jpeg"
	 */
	public getContentType<Key extends keyof IExportOptions>(type: Key): string {

		let contentType = "";
		switch (type) {
			case "png":
			case "gif":
				contentType = "image/" + type;
				break;
			case "jpg":
				contentType = "image/jpeg";
				break;
			case "svg":
				contentType = "image/svg+xml";
				break;
			case "csv":
				contentType = "text/csv";
				break;
			case "json":
				contentType = "application/json";
				break;
			case "html":
				contentType = "text/html";
				break;
			case "pdf":
			case "pdfdata":
				contentType = "application/pdf";
				break;
			case "xlsx":
				contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
				break;
		}

		return this.adapter.apply("contentType", {
			contentType: contentType,
			type: type
		}).contentType;

	}

	/**
	 * A file prefix to be used for all exported formats.
	 *
	 * Export will apply format-related extension to it. E.g. if this is set to
	 * "myExport", the file name of the PNG exported image will be "myExport.png".
	 *
	 * @param value File prefix
	 */
	public set filePrefix(value: string) {
		this._filePrefix = value;
	}

	/**
	 * @return File prefix
	 */
	public get filePrefix(): string {
		return this.adapter.apply("filePrefix", {
			filePrefix: this._filePrefix
		}).filePrefix;
	}

	/**
	 * A background color to be used for exported images. If set, this will
	 * override the automatically acquired background color.
	 *
	 * @param value Color
	 */
	public set backgroundColor(value: $type.Optional<Color>) {
		this._backgroundColor = value;
	}

	/**
	 * @return Background color
	 */
	public get backgroundColor(): $type.Optional<Color> {
		return this.adapter.apply("backgroundColor", {
			backgroundColor: this._backgroundColor
		}).backgroundColor;
	}

	/**
	 * A title to be used when printing.
	 *
	 * @param value Title
	 */
	public set title(value: $type.Optional<string>) {
		this._title = value;
	}

	/**
	 * @return Title
	 */
	public get title(): $type.Optional<string> {
		return this.adapter.apply("title", {
			title: this._title
		}).title;
	}

	/**
	 * Displays a preloader/exporting indicator.
	 *
	 * @ignore Exclude from docs
	 * @todo Add ability to change text
	 */
	public showPreloader(): void {
		let preloader = this.preloader;
		if (preloader) {
			preloader.progress = 0.5;
			preloader.label.text = "...";
		}
	}

	/**
	 * Hides preloader/exporting indicator
	 *
	 * @ignore Exclude from docs
	 */
	public hidePreloader(): void {
		let preloader = this.preloader;
		if (preloader) {
			preloader.progress = 1;
		}
	}

	/**
	 * Returns a an instance of [[Preloader]] associated with the Sprite being
	 * exported.
	 *
	 * @return Preloader
	 */
	public get preloader(): Preloader {
		return this._sprite && this._sprite.parent && this._sprite.parent.preloader ?
			this._sprite.parent.preloader :
			undefined;
	}

	/**
	 * Displays a modal saying export is taking longer than expected.
	 *
	 * @ignore Exclude from docs
	 */
	public showTimeout(): void {
		this.showModal(
			this.adapter.apply("timeoutMessage", {
				message: this.language.translate("Export operation took longer than expected. Something might have gone wrong.")
			}).message
		);
	}

	/**
	 * Hides preloader/exporting indicator.
	 *
	 * @ignore Exclude from docs
	 */
	public hideTimeout(): void {
		if (this._timeoutTimeout) {
			this.removeDispose(this._timeoutTimeout);
			this._timeoutTimeout = null;
		}
		this.hideModal();
	}

	/**
	 * A [[Language]] instance to be used for translations.
	 *
	 * @param value An instance of [[Language]]
	 */
	public set language(value: Language) {
		this._language = value;
	}

	/**
	 * @return A [[Language]] instance to be used
	 */
	public get language(): Language {
		if (!this._language) {
			this._language = new Language();
		}

		return this._language;
	}

	/**
	 * Returns (and creates) [[Modal]].
	 *
	 * @ignore Exclude from docs
	 * @return Modal instance
	 */
	public get modal(): Modal {
		if (!this._modal) {
			this._modal = new Modal();

			// Prefix with Sprite's class name
			this._modal.adapter.add("classPrefix", (value) => {
				value = options.classNamePrefix + value;
				return value;
			});
		}
		return this._modal;
	}

	/**
	 * Shows [[Modal]] with specific text.
	 *
	 * @ignore Exclude from docs
	 * @param text Modal contents
	 */
	public showModal(text: string, title?: string): void {

		// Hide previous modal and preloader
		this.hideModal();
		this.hidePreloader();

		// Create modal
		let modal = this.modal;
		modal.container = this.sprite.svgContainer.SVGContainer;
		modal.content = text;
		modal.readerTitle = title;
		modal.open();
	}

	/**
	 * Hides modal window if one's currently open.
	 *
	 * @ignore Exclude from docs
	 */
	public hideModal(): void {
		if (this._modal) {
			this.modal.close();
		}
	}

	/**
	 * Loads canvg dynamic module.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @ignore Exclude from docs
	 * @return Instance of canvg
	 * @async
	 */
	private async _canvg(): Promise<any> {
		const canvg = await import(/* webpackChunkName: "canvg" */ "canvg");

		if ((<any>canvg).default != null) {
			return (<any>canvg).default;

		} else {
			return canvg;
		}
	}

	/**
	 * Returns canvg instance.
	 *
	 * @ignore Exclude from docs
	 * @return Instance of canvg
	 */
	public get canvg(): Promise<any> {
		return this._canvg();
	}

	/**
	 * Returns pdfmake instance.
	 *
	 * @ignore Exclude from docs
	 * @return Instance of pdfmake
	 */
	public get pdfmake(): Promise<any> {
		if (pdfmakePromise == null) {
			pdfmakePromise = _pdfmake();
		}

		return pdfmakePromise;
	}

	/**
	 * Loads xlsx dynamic module.
	 *
	 * This is an asynchronous function. Check the description of `getImage()`
	 * for description and example usage.
	 *
	 * @ignore Exclude from docs
	 * @return Instance of pdfmake
	 * @async
	 */
	private async _xlsx(): Promise<any> {
		return await import(/* webpackChunkName: "xlsx" */ "xlsx");
	}

	/**
	 * Returns xlsx instance.
	 *
	 * @ignore Exclude from docs
	 * @return Instance of pdfmake
	 */
	public get xlsx(): Promise<any> {
		return this._xlsx();
	}

	/**
	 * Sets options for a format.
	 */
	public setFormatOptions<Key extends keyof IExportOptions>(type: Key, options: IExportOptions[Key]): void {
		this._formatOptions.setKey(type, options);
	}

	/**
	 * Returns current options for a format.
	 */
	public getFormatOptions<Key extends keyof IExportOptions>(type: Key): IExportOptions[Key] {
		return this._formatOptions.getKey(type);
	}

	/**
	 * Disables interactivity on parent chart.
	 */
	protected _disablePointers(): void {
		if (!$type.hasValue(this._spriteInteractionsEnabled)) {
			this._spriteInteractionsEnabled = this.sprite.interactionsEnabled;
		}
		this.sprite.interactionsEnabled = false;
	}

	/**
	 * Releases temporarily disabled pointers on parent chart.
	 */
	protected _releasePointers(): void {
		if ($type.hasValue(this._spriteInteractionsEnabled)) {
			this.sprite.interactionsEnabled = this._spriteInteractionsEnabled;
		}
	}

	/**
	 * Hides all elements that should not be included in the exported image.
	 */
	private hideNonExportableSprites(): void {
		if (this._objectsAlreadyHidden) {
			return;
		}
		const svgContainer = this.sprite.svgContainer;
		if (svgContainer) {
			$array.each(svgContainer.nonExportableSprites, (item) => {
				if (!item.isHidden && !item.isHiding) {
					this._hiddenObjects.push(item);
				}
				item.hide(0);
			});
		}
		this._objectsAlreadyHidden = true;
	}

	/**
	 * Respores elements that were hidden before export.
	 */
	private restoreNonExportableSprites(): void {
		if (!this._objectsAlreadyHidden) {
			return;
		}
		$array.each(this._hiddenObjects, (item) => {
			item.show(0);
		});
		this._hiddenObjects = [];
		this._objectsAlreadyHidden = false;
	}

	/**
	 * Checks if there are elements that absolutely need to be validated before
	 * export.
	 *
	 * If there are invalid elements, it will await for them to be validated.
	 *
	 * @return Promise
	 */
	private async awaitValidSprites(): Promise<void> {
		let promises: Promise<any>[] = [];

		if (this.validateSprites.length) {
			$array.each(this.validateSprites, (sprite, index) => {
				if (sprite.invalid) {
					promises.push(new Promise((resolve, reject) => {
						sprite.events.once("validated", (ev) => {
							resolve();
						});
					}));
				}
			});
		}

		if (promises.length) {
			await Promise.all(promises);
		}
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		registry.registeredClasses["ExportMenu"] = ExportMenu;

		if (config) {

			// Set up menu
			if ($type.hasValue(config.menu) && !$type.hasValue(config.menu.type)) {
				config.menu.type = "ExportMenu";
			}

		}

		super.processConfig(config);

	}

}
