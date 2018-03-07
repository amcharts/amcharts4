/**
 * A collection of functions for ordering.
 */
/**
 * [reverse description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {Ordering}  a  [description]
 * @return {Ordering}     [description]
 */
export function reverse(a) {
    switch (a) {
        case 0:
            return 0;
        case -1:
            return 1;
        case 1:
            return -1;
    }
}
/**
 * [or description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {Ordering}  a  Item 1
 * @param  {Ordering}  b  Item 2
 * @return {Ordering}     [description]
 */
export function or(a, b) {
    if (a === 0) {
        return b;
    }
    else {
        return a;
    }
}
//# sourceMappingURL=Order.js.map