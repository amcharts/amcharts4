/**
 * Defines an interface for objects that hold a net request result.
 */
export interface INetLoadResult<A> {
    /**
     * A reference to original [[XMLHttpRequest]].
     *
     * @type {XMLHttpRequest}
     */
    xhr: XMLHttpRequest;
    /**
     * Request response body.
     *
     * @type {string}
     */
    response?: string;
    /**
     * Request response as Blob. (if set `responseType = "blob"`)
     *
     * @type {Blob}
     */
    blob?: Blob;
    /**
     * Response `Content-Type`.
     *
     * @type {string | null}
     */
    type: string | null;
    /**
     * Was there an error?
     *
     * @type {boolean}
     */
    error: boolean;
    /**
     * A target object that made the net load request.
     *
     * @type {A}
     */
    target?: A;
}
export interface INetRequestOptions {
    /**
     * Custom request headers to be added to HTTP(S) request.
     */
    requestHeaders?: {
        key: string;
        value: string;
    }[];
    /**
     * Specify expected response type.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType} for more info
     * @type {XMLHttpRequestResponseType}
     */
    responseType?: XMLHttpRequestResponseType;
    /**
     * Specify whether to send CORS credentials (defaults to `false`).
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials} for more info
     */
    withCredentials?: boolean;
}
/**
 * Loads an external file via its URL.
 *
 * Please note that this is an asynchronous function.
 *
 * It will not return the result, but rather a `Promise`.
 *
 * You can use the `await` notion, or `then()`.
 *
 * ```TypeScript
 * // Using await
 * let response = await Net.load( "http://www.my.com/data.json" );
 * console.log( response.response );
 *
 * // Using then()
 * Net.load( "http://www.my.com/data.json" ).then( ( response ) => {
 *   console.log( response.response );
 * } );
 * ```
 * ```JavaScript
 * // Using then()
 * Net.load( "http://www.my.com/data.json" ).then( function( response ) {
 *   console.log( response.response );
 * } );
 * ```
 *
 * @async
 * @param  {string}                      url      URL for the file to load
 * @param  {A}                           target   A target element that is requesting the net load
 * @param  {INetRequestOptions}          options  Request options
 * @return {Promise<INetLoadResult<A>>}           Result (Promise)
 */
export declare function load<A>(url: string, target?: A, options?: INetRequestOptions): Promise<INetLoadResult<A>>;
