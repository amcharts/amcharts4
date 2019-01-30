import * as $type from "../utils/Type";
/**
 * Maps time period names to their numeric representations in milliseconds.
 *
 * @ignore Exclude from docs
 */
export var timeUnitDurations = {
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
export function getNextUnit(unit) {
    switch (unit) {
        case "year":
            return;
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
            return "minute";
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
export function getDuration(unit, count) {
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
export function now() {
    return new Date();
}
/**
 * Returns current timestamp.
 *
 * @return {Date} Current timestamp
 */
export function getTime() {
    return now().getTime();
}
/**
 * Returns a copy of the `Date` object.
 *
 * @ignore Exclude from docs
 * @param  {Date}  date  Source date
 * @return {Date}        Copy
 */
export function copy(date) {
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
export function checkChange(dateOne, dateTwo, unit) {
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
    var nextUnit = getNextUnit(unit);
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
export function add(date, unit, count) {
    switch (unit) {
        case "day":
            var day = date.getDate();
            date.setDate(day + count);
            break;
        case "second":
            var seconds = date.getSeconds();
            date.setSeconds(seconds + count);
            break;
        case "millisecond":
            var milliseconds = date.getMilliseconds();
            date.setMilliseconds(milliseconds + count);
            break;
        case "hour":
            var hours = date.getHours();
            date.setHours(hours + count);
            break;
        case "minute":
            var minutes = date.getMinutes();
            date.setMinutes(minutes + count);
            break;
        case "year":
            var year = date.getFullYear();
            date.setFullYear(year + count);
            break;
        case "month":
            var month = date.getMonth();
            date.setMonth(month + count);
            break;
        case "week":
            var wday = date.getDate();
            date.setDate(wday + count * 7);
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
export function round(date, unit, count, firstDateOfWeek) {
    if (!$type.isNumber(count)) {
        count = 1;
    }
    switch (unit) {
        case "day":
            var day = date.getDate();
            if (count > 1) {
                day = Math.floor(day / count) * count;
            }
            day = day;
            date.setDate(day);
            date.setHours(0, 0, 0, 0);
            break;
        case "second":
            var seconds = date.getSeconds();
            if (count > 1) {
                seconds = Math.floor(seconds / count) * count;
            }
            date.setSeconds(seconds, 0);
            break;
        case "millisecond":
            if (count == 1) {
                return date; // much better for perf!
            }
            var milliseconds = date.getMilliseconds();
            milliseconds = Math.floor(milliseconds / count) * count;
            date.setMilliseconds(milliseconds);
            break;
        case "hour":
            var hours = date.getHours();
            if (count > 1) {
                hours = Math.floor(hours / count) * count;
            }
            date.setHours(hours, 0, 0, 0);
            break;
        case "minute":
            var minutes = date.getMinutes();
            milliseconds = date.getMilliseconds();
            if (count > 1) {
                minutes = Math.floor(minutes / count) * count;
            }
            date.setMinutes(minutes, 0, 0);
            break;
        case "month":
            var month = date.getMonth();
            if (count > 1) {
                month = Math.floor(month / count) * count;
            }
            date.setMonth(month, 1);
            date.setHours(0, 0, 0, 0);
            break;
        case "year":
            var year = date.getFullYear();
            if (count > 1) {
                year = Math.floor(year / count) * count;
            }
            date.setFullYear(year, 0, 1);
            date.setHours(0, 0, 0, 0);
            break;
        case "week":
            var wday = date.getDate();
            var weekDay = date.getDay();
            if (!$type.isNumber(firstDateOfWeek)) {
                firstDateOfWeek = 1;
            }
            // todo: rounding when count is not 1
            if (weekDay >= firstDateOfWeek) {
                wday = wday - weekDay + firstDateOfWeek;
            }
            else {
                wday = wday - (7 + weekDay) + firstDateOfWeek;
            }
            date.setDate(wday);
            date.setHours(0, 0, 0, 0);
            break;
    }
    return date;
}
//# sourceMappingURL=Time.js.map