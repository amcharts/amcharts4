/**
 * A collection of network-related functions
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as $type from "./Type";
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
export function load(url, target, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (success, error) {
                    // Create request and set up handlers
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            var response = xhr.responseText || xhr.response;
                            success({
                                xhr: xhr,
                                error: false,
                                response: response,
                                type: xhr.getResponseHeader("Content-Type"),
                                target: target
                            });
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
                    xhr.onerror = function () {
                        error({
                            xhr: xhr,
                            error: true,
                            type: xhr.getResponseHeader("Content-Type"),
                            target: target
                        });
                    };
                    // Open request
                    xhr.open("GET", url);
                    // Process options
                    if ($type.hasValue(options) && $type.hasValue(options.requestHeaders)) {
                        for (var i = 0; i < options.requestHeaders.length; i++) {
                            var header = options.requestHeaders[i];
                            xhr.setRequestHeader(header.key, header.value);
                        }
                    }
                    // Send request
                    xhr.send();
                })];
        });
    });
}
//# sourceMappingURL=Net.js.map