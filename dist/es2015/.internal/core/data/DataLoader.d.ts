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
import { Adapter } from "../utils/Adapter";
/**
 * Represents a list of available adapters for Sprite
 */
export interface IDataLoaderAdapters {
    /**
     * Applied after the Data Loader determines suitable parser type by data
     * source's URL extension.
     */
    getParserByType: {
        parser: DataParser;
        type?: string;
    };
    /**
     * Applied after the Data Loader determines suitable parser type based on
     * its data examination.
     */
    getParserByData: {
        parser: DataParser;
        data?: string;
        type?: string;
    };
}
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
export declare class DataLoader {
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IExportAdapters}
     */
    _adapter: IDataLoaderAdapters;
    /**
     * Adapter.
     *
     * @type {Adapter<DataLoader, IDataLoaderAdapters>}
     */
    adapter: Adapter<DataLoader, IDataLoaderAdapters>;
    /**
     * Loads a supplied [[DataSource]] or an array of data sources, then calls
     * their respective `parse` methods.
     *
     * @param  {DataSource | DataSource[]}  source  A single data source or an array of multiple of data sources
     */
    load(source: DataSource | DataSource[]): void;
    /**
     * Instantiates a [[DataParser]] object based on the data type.
     * Built-in parser types are as follows:
     *
     * * "csv" or "text/csv"
     * * "json" or "application/json"
     *
     * @param  {string}      type  A format type
     * @return {DataParser}        A parser object
     */
    getParserByType(type: string): DataParser;
    /**
     * Tries to determine a parser out of content type and/or actual data.
     *
     * @param  {string}      data  Data
     * @param  {string}      type  Content-type
     * @return {DataParser}        Parser instance
     */
    getParserByData(data: string, type?: string): DataParser;
}
/**
 * Create instance of Data Loader
 */
export declare let dataLoader: DataLoader;
