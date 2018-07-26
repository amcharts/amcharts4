/**
 * ============================================================================
 * COMPARING FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Comparing function used for ordering.
 *
 * @ignore Exclude from docs
 * @todo Use localeCompare
 * @param  {string}    a  Item 1
 * @param  {string}    b  Item 2
 * @return {Ordering}     Result
 */
export function order(a, b) {
    if (a === b) {
        return 0;
    }
    else if (a < b) {
        return -1;
    }
    else {
        return 1;
    }
}
/**
 * ============================================================================
 * OTHER FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Repeats a `string` number of times as set in `amount`.
 *
 * @ignore Exclude from docs
 * @todo Make this faster
 * @param  {string}  string  Source string
 * @param  {number}  amount  Number of times to repeat string
 * @return {string}          New string
 */
export function repeat(string, amount) {
    return new Array(amount + 1).join(string);
}
/**
 * Generates a random string `characters` length.
 *
 * @param  {number}  chars  Number of characters
 * @return {string}         Random string
 */
export function random(chars) {
    var res = "";
    var choice = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < chars; i++) {
        res += choice.charAt(Math.floor(Math.random() * choice.length));
    }
    return res;
}
//# sourceMappingURL=String.js.map