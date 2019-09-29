/**
 * A collection of network-related functions
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as $type from "./Type";

/**
 * Defines an interface for objects that hold a net request result.
 */
export interface INetLoadResult<A> {

	/**
	 * A reference to original [[XMLHttpRequest]].
	 */
	xhr: XMLHttpRequest;

	/**
	 * Request response body.
	 */
	response?: string;

	/**
	 * Request response as Blob. (if set `responseType = "blob"`)
	 */
	blob?: Blob;

	/**
	 * Response `Content-Type`.
	 */
	type: string | null;

	/**
	 * Was there an error?
	 */
	error: boolean;

	/**
	 * A target object that made the net load request.
	 */
	target?: A;

}

export interface INetRequestOptions {

	/**
	 * Custom request headers to be added to HTTP(S) request.
	 */
	requestHeaders?: { key: string, value: string }[];

	/**
	 * Specify expected response type.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType} for more info
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
 * @param url      URL for the file to load
 * @param target   A target element that is requesting the net load
 * @param options  Request options
 * @return Result (Promise)
 */
export function load<A>(url: string, target?: A, options?: INetRequestOptions): Promise<INetLoadResult<A>> {
	return new Promise<INetLoadResult<A>>((success, error) => {

		// Is return type Blob?
		let isBlob = $type.hasValue(options) && options.responseType == "blob";

		// Create request and set up handlers
		let xhr = new XMLHttpRequest();
		xhr.onload = () => {
			if (xhr.status === 200) {

				let response: $type.Optional<string>;
				let blob: $type.Optional<Blob>;

				if (isBlob) {
					blob = xhr.response;
					readBlob(blob).then((response) => {
						let output: INetLoadResult<A> = {
							xhr: xhr,
							error: false,
							response: response,
							blob: blob,
							type: xhr.getResponseHeader("Content-Type"),
							target: target
						};
						success(output);
					});
					return;
				}
				else {
					response = xhr.responseText || xhr.response
				}

				let output: INetLoadResult<A> = {
					xhr: xhr,
					error: false,
					response: response,
					blob: blob,
					type: xhr.getResponseHeader("Content-Type"),
					target: target
				};
				success(output);
			}
			else {
				error({
					xhr: xhr,
					error: true,
					type: xhr.getResponseHeader("Content-Type"),
					target: target
				});
			}
		};
		xhr.onerror = () => {
			error({
				xhr: xhr,
				error: true,
				type: xhr.getResponseHeader("Content-Type"),
				target: target
			});
		};

		// Open request
		xhr.open("GET", url, true);

		if (options && options.withCredentials) {
			xhr.withCredentials = true;
		}

		// Process options
		if ($type.hasValue(options)) {

			if ($type.hasValue(options.requestHeaders)) {
				for (let i = 0; i < options.requestHeaders.length; i++) {
					let header = options.requestHeaders[i];
					xhr.setRequestHeader(header.key, header.value);
				}
			}

			if ($type.hasValue(options.responseType)) {
				xhr.responseType = options.responseType;
			}
		}

		// Send request
		xhr.send();

	});

}

/**
 * Returns textual representation of a Blob object.
 * 
 * @param   blob  Target blob
 * @return        Text promise
 */
export function readBlob(blob: Blob): Promise<string> {
	return new Promise<string>((success, error) => {
		const reader = new FileReader()

		reader.onload = event => {
			success(reader.result);
		}

		reader.onerror = (e) => {
			error(e);
		}

		reader.readAsText(blob);
	});
}