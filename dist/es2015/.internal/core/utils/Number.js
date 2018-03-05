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
 * @param  {number}    a  Number 1
 * @param  {number}    b  Number 2
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
//# sourceMappingURL=Number.js.map