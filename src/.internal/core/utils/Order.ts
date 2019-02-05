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
 */
export type Ordering = -1 | 0 | 1;

/**
 * [reverse description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param a  [description]
 * @return [description]
 */
export function reverse(a: Ordering): Ordering {
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
 * @param a  Item 1
 * @param b  Item 2
 * @return [description]
 */
export function or(a: Ordering, b: Ordering): Ordering {
	if (a === 0) {
		return b;

	} else {
		return a;
	}
}
