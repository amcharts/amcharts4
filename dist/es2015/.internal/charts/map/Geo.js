/**
 * A collection of GeoJSON format-related utility functions.
 */
import * as tslib_1 from "tslib";
import * as $math from "../../core/utils/Math";
/**
 * Normalizes a geo-point.
 *
 * @ignore Exclude from docs
 * @param geoPoint  Source geo-point
 * @return Normalized geo-point
 */
export function normalizePoint(geoPoint) {
    var longitude = wrapAngleTo180(geoPoint.longitude);
    var latitude = Math.asin(Math.sin((geoPoint.latitude * $math.RADIANS))) * $math.DEGREES;
    var latitude180 = wrapAngleTo180(geoPoint.latitude);
    if (Math.abs(latitude180) > 90) {
        longitude = wrapAngleTo180(longitude + 180);
    }
    geoPoint.longitude = longitude;
    geoPoint.latitude = latitude;
    return geoPoint;
}
/**
 * Normalizes all points of a geo-line.
 *
 * @ignore Exclude from docs
 * @param multiline  Source geo-line
 * @return Normalized geo-line
 */
export function normalizeMultiline(multiline) {
    try {
        for (var multiline_1 = tslib_1.__values(multiline), multiline_1_1 = multiline_1.next(); !multiline_1_1.done; multiline_1_1 = multiline_1.next()) {
            var segment = multiline_1_1.value;
            try {
                for (var segment_1 = tslib_1.__values(segment), segment_1_1 = segment_1.next(); !segment_1_1.done; segment_1_1 = segment_1.next()) {
                    var point = segment_1_1.value;
                    point = normalizePoint(point);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (segment_1_1 && !segment_1_1.done && (_a = segment_1.return)) _a.call(segment_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (multiline_1_1 && !multiline_1_1.done && (_b = multiline_1.return)) _b.call(multiline_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return multiline;
    var e_2, _b, e_1, _a;
}
/**
 * [wrapAngleTo180 description]
 *
 * @todo Description
 * @ignore Exclude from docs
 * @param angle  Angle
 * @return Angle
 */
export function wrapAngleTo180(angle) {
    angle = angle % 360;
    if (angle > 180) {
        angle -= 360;
    }
    if (angle < -180) {
        angle += 360;
    }
    return angle;
}
/**
 * Converts a geo point to a regular point object.
 *
 * @ignore Exclude from docs
 * @param geoPoint  Source geo point
 * @return Point
 */
export function geoToPoint(geoPoint) {
    return { x: geoPoint.longitude, y: geoPoint.latitude };
}
//# sourceMappingURL=Geo.js.map