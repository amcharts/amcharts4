/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { TimeUnit } from "../defs/TimeUnit";
import * as $type from "../utils/Type";

/**
 * Maps time period names to their numeric representations in milliseconds.
 *
 * @ignore Exclude from docs
 */
export let timeUnitDurations: {[Key in TimeUnit]: number } = {
	millisecond: 1,
	second: 1000,
	minute: 60000,
	hour: 3600000,
	day: 86400000,
	week: 604800000,
	month: 2592000000,
	year: 31536000000
};

/**
 * Returns the next time unit that goes after source `unit`.
 *
 * E.g. "hour" is the next unit after "minute", etc.
 *
 * @ignore Exclude from docs
 * @param  {TimeUnit}            unit  Source time unit
 * @return {Optional<TimeUnit>}        Next time unit
 */
export function getNextUnit(unit: TimeUnit): $type.Optional<TimeUnit> {
	switch (unit) {
		case "year":
			return

		case "month":
			return "year";

		case "week":
			return "month";

		case "day":
			return "month"; // not a mistake

		case "hour":
			return "day";

		case "minute":
			return "hour";

		case "second":
			return "minute"

		case "millisecond":
			return "second";
	}
}

/**
 * Returns number of milliseconds in the `count` of time `unit`.
 *
 * Available units: "millisecond", "second", "minute", "hour", "day", "week",
 * "month", and "year".
 *
 * @ignore Exclude from docs
 * @param  {TimeUnit}  unit   Time unit
 * @param  {number}    count  Number of units
 * @return {number}           Milliseconds
 */
export function getDuration(unit: TimeUnit, count?: number): number {
	if (!$type.hasValue(count)) {
		count = 1;
	}
	return timeUnitDurations[unit] * count;
}

/**
 * Returns current `Date` object.
 * 
 * @return {Date} Current date
 */
export function now(): Date {
	return new Date();
}

/**
 * Returns current timestamp.
 * 
 * @return {Date} Current timestamp
 */
export function getTime(): number {
	return now().getTime();
}

/**
 * Returns a copy of the `Date` object.
 *
 * @ignore Exclude from docs
 * @param  {Date}  date  Source date
 * @return {Date}        Copy
 */
export function copy(date: Date): Date {
	return new Date(date.getTime()); // todo: check if this is ok. new Date(date) used to strip milliseconds on FF in v3
}

/**
 * Checks if the `unit` part of two `Date` objects do not match. Two dates
 * represent a "range" of time, rather the same time date.
 *
 * @ignore Exclude from docs
 * @param  {Date}      dateOne  Date 1
 * @param  {Date}      dateTwo  Date 2
 * @param  {TimeUnit}  unit     Time unit to check
 * @return {boolean}            Range?
 */
export function checkChange(dateOne: Date, dateTwo: Date, unit: TimeUnit): boolean {

	switch (unit) {
		case "year":
			if (dateOne.getFullYear() != dateTwo.getFullYear()) {
				return true;
			}
			break;
		case "month":
			if (dateOne.getMonth() != dateTwo.getMonth()) {
				return true;
			}
			break;

		case "day":
			if (dateOne.getDate() != dateTwo.getDate()) {
				return true;
			}

			break;

		case "hour":
			if (dateOne.getHours() != dateTwo.getHours()) {
				return true;
			}
			break;

		case "minute":
			if (dateOne.getMinutes() != dateTwo.getMinutes()) {
				return true;
			}

			break;

		case "second":
			if (dateOne.getSeconds() != dateTwo.getSeconds()) {
				return true;
			}
			break;

		case "millisecond":
			if (dateOne.getTime() != dateTwo.getTime()) {
				return true;
			}
			break;
	}

	let nextUnit: $type.Optional<TimeUnit> = getNextUnit(unit);
	if (nextUnit) {
		return checkChange(dateOne, dateTwo, nextUnit);
	}
	else {
		return false;
	}

}

/**
 * Adds `count` of time `unit` to the source date. Returns a modified `Date` object.
 *
 * @ignore Exclude from docs
 * @param  {Date}      date   Source date
 * @param  {TimeUnit}  unit   Time unit
 * @param  {number}    count  Number of units to add
 * @return {Date}             Modified date
 */
export function add(date: Date, unit: TimeUnit, count: number): Date {
	let year: number = date.getFullYear();
	let month: number = date.getMonth();
	let day: number = date.getDate();
	let hours: number = date.getHours();
	let minutes: number = date.getMinutes();
	let seconds: number = date.getSeconds();
	let milliseconds: number = date.getMilliseconds();
	//let weekDay: number = date.getDay();

	switch (unit) {
		case "year":
			date.setFullYear(year + count);
			break;

		case "month":
			date.setMonth(month + count);
			break;

		case "week":
			date.setDate(day + count * 7);
			break;

		case "day":
			date.setDate(day + count);
			break;

		case "hour":
			date.setHours(hours + count);
			break;

		case "minute":
			date.setMinutes(minutes + count);
			break;

		case "second":
			date.setSeconds(seconds + count);
			break;

		case "millisecond":
			date.setMilliseconds(milliseconds + count);
			break;
	}

	return date;
}

/**
 * "Rounds" the date to specific time unit.
 *
 * @ignore Exclude from docs
 * @param  {Date}      date             Source date
 * @param  {TimeUnit}  unit             Time unit
 * @param  {number}    count            Number of units to round to
 * @param  {number}    firstDateOfWeek  First day of week
 * @return {Date}                       New date
 */
export function round(date: Date, unit: TimeUnit, count?: number, firstDateOfWeek?: number): Date {

	if (!$type.isNumber(count)) {
		count = 1;
	}

	if (!$type.isNumber(firstDateOfWeek)) {
		firstDateOfWeek = 1;
	}

	let year: number = date.getFullYear();
	let month: number = date.getMonth();
	let day: number = date.getDate();
	let hours: number = date.getHours();
	let minutes: number = date.getMinutes();
	let seconds: number = date.getSeconds();
	let milliseconds: number = date.getMilliseconds();
	let weekDay: number = date.getDay();

	switch (unit) {
		case "year":
			year = Math.floor(year / count) * count;
			month = 0;
			day = 1;
			hours = 0;
			minutes = 0;
			seconds = 0;
			milliseconds = 0;
			break;

		case "month":
			month = Math.floor(month / count) * count;
			day = 1;
			hours = 0;
			minutes = 0;
			seconds = 0;
			milliseconds = 0;
			break;

		case "week":
			// todo: rounding when count is not 1
			if (weekDay >= firstDateOfWeek) {
				day = day - weekDay + firstDateOfWeek;
			} else {
				day = day - (7 + weekDay) + firstDateOfWeek;
			}

			hours = 0;
			minutes = 0;
			seconds = 0;
			milliseconds = 0;
			break;

		case "day":
			day = Math.floor(day / count) * count;
			day = day;
			hours = 0;
			minutes = 0;
			seconds = 0;
			milliseconds = 0;
			break;

		case "hour":
			hours = Math.floor(hours / count) * count;
			minutes = 0;
			seconds = 0;
			milliseconds = 0;
			break;

		case "minute":
			minutes = Math.floor(minutes / count) * count;
			seconds = 0;
			milliseconds = 0;
			break;

		case "second":
			seconds = Math.floor(seconds / count) * count;
			milliseconds = 0;
			break;

		case "millisecond":
			milliseconds = Math.floor(milliseconds / count) * count;
			break;
	}

	date.setFullYear(year, month, day);
	date.setHours(hours, minutes, seconds, milliseconds);

	return date;
}