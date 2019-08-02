import { options } from "../Options";

/**
 * Outputs string to console if `verbose` is `true`.
 */
export function log(...messages: Array<any>): void {
	if (options.verbose) {
		if (console) {
			console.log(...messages);
		}
	}
}

/**
 * Outputs a warning to the console.
 */
export function warn(...messages: Array<any>): void {
	if (console) {
		console.warn(...messages);
	}
}
