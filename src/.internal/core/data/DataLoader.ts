/**
 * Data Loader is responsible for loading and parsing external data
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { DataSource } from "./DataSource";
import { DataParser } from "./DataParser";
import { CSVParser } from "./CSVParser";
import { JSONParser } from "./JSONParser";
import { Adapter } from "../utils/Adapter";
import * as $net from "../utils/Net";
import * as $array from "../utils/Array";

/**
 * Represents a list of available adapters for Sprite
 */
export interface IDataLoaderAdapters {

	/**
	 * Applied after the Data Loader determines suitable parser type by data
	 * source's URL extension.
	 */
	getParserByType: {
		parser: DataParser,
		type?: string
	},

	/**
	 * Applied after the Data Loader determines suitable parser type based on
	 * its data examination.
	 */
	getParserByData: {
		parser: DataParser,
		data?: string,
		type?: string
	}

};

/**
 * Data Loader is responsible for loading and parsing external data.
 *
 * There is just one instance of DataLoader per system. Unless you have a
 * speicific reason, do not instantiate additional instances.
 *
 * The global instance of Data Loader is accessible via:
 *
 * ```TypeScript
 * am4core.dataLoader;
 * ```
 * ```JavaScript
 * am4core.dataLoader;
 * ```
 *
 * A loading of specific data source is done via [[DataSource]].
 *
 	 Please refer to [[DataSource]] for information how to use it.
 *
 * @see {@link IDataLoaderAdapters} for a list of available Adapters
 */
export class DataLoader {

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IDataLoaderAdapters;

	/**
	 * Adapter.
	 */
	public adapter: Adapter<DataLoader, IDataLoaderAdapters> = new Adapter<DataLoader, IDataLoaderAdapters>(this);

	/**
	 * Loads a supplied [[DataSource]] or an array of data sources, then calls
	 * their respective `parse` methods.
	 *
	 * @param source  A single data source or an array of multiple of data sources
	 */
	public load(source: DataSource | DataSource[]): void {
		let sources = Array.isArray(source) ? source : [source];

		// Add each Source to the list to be loaded simultaneously
		let promises = $array.map(sources, (x) => {
			// Dispatch events
			x.dispatchImmediately("started");
			x.dispatchImmediately("loadstarted");

			return $net.load(x.url, x, x.requestOptions);
		});

		// Run all promises in parallel
		Promise.all(promises).then((res) => {
			// Process each loaded source
			$array.each(res, (result) => {
				// Get Source
				let source = result.target;

				// Dispatch events
				source.dispatchImmediately("loadended");

				if (result.error) {
					if (source.events.isEnabled("error")) {
						source.events.dispatchImmediately("error", {
							type: "error",
							code: result.xhr.status,
							message: source.language.translate("Unable to load file: %1", null, source.url),
							target: source
						});
					}

				}
				else {

					// Initiate parsing of the loaded data
					source.processData(result.response, result.type);

				}

				source.dispatchImmediately("ended");
			});
		}).catch((res) => {

			if (res.target) {

				res.target.dispatchImmediately("loadended");

				if (res.target.events.isEnabled("error")) {
					res.target.events.dispatchImmediately("error", {
						type: "error",
						code: res.xhr.status,
						message: res.target.language.translate("Unable to load file: %1", null, res.target.url),
						target: res.target
					});
				}

				res.target.dispatchImmediately("ended");

			}

		});
	}

	/**
	 * Instantiates a [[DataParser]] object based on the data type.
	 * Built-in parser types are as follows:
	 *
	 * * "csv" or "text/csv"
	 * * "json" or "application/json"
	 *
	 * @param contentType  A format type
	 * @return A parser object
	 */
	public getParserByType(contentType: string): DataParser {

		// Let some plugin decide
		let parser = this.adapter.apply("getParserByType", {
			parser: null,
			type: contentType
		}).parser;

		if (parser) {
			return parser;
		}

		if (contentType == "csv" || contentType == "text/csv" || contentType == "application/vnd.ms-excel") {
			return new CSVParser();
		}
		if (contentType == "json" || contentType == "application/json") {
			return new JSONParser();
		}
		return;
	}

	/**
	 * Tries to determine a parser out of content type and/or actual data.
	 *
	 * @param data         Data
	 * @param contentType  Content-type
	 * @return Parser instance
	 */
	public getParserByData(data: string, contentType?: string): DataParser {

		// Let some plugin decide
		let parser = this.adapter.apply("getParserByData", {
			parser: null,
			data: data,
			type: contentType
		}).parser;

		// Check if we have parser from outside code
		if (!parser) {
			// No, let's try to figure it out
			parser = this.getParserByType(contentType)

			if (parser) {
				// We're able to figure out parser by content-type
				return parser;
			}
			else if (JSONParser.isJSON(data)) {
				return this.getParserByType("json");
			}
			else if (CSVParser.isCSV(data)) {
				return this.getParserByType("csv");
			}
		}

		return parser;
	}

}

/**
 * Create instance of Data Loader
 */
export let dataLoader: DataLoader = new DataLoader();
