/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Ordering } from "./Order";
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
export declare function order(a: string, b: string): Ordering;
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
export declare function repeat(string: string, amount: number): string;
/**
 * Generates a random string `characters` length.
 *
 * @param  {number}  chars  Number of characters
 * @return {string}         Random string
 */
export declare function random(chars: number): string;
