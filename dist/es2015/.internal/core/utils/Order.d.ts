/**
 * A collection of functions for ordering.
 */
/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Defines values that ordering functions can return.
 *
 * @type {number}
 */
export declare type Ordering = -1 | 0 | 1;
/**
 * [reverse description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {Ordering}  a  [description]
 * @return {Ordering}     [description]
 */
export declare function reverse(a: Ordering): Ordering;
/**
 * [or description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param  {Ordering}  a  Item 1
 * @param  {Ordering}  b  Item 2
 * @return {Ordering}     [description]
 */
export declare function or(a: Ordering, b: Ordering): Ordering;
