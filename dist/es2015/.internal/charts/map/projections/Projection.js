/**
 * This module contains funcitonality related to geographical projections
 */
import * as tslib_1 from "tslib";
import { registry } from "../../../core/Registry";
import * as $math from "../../../core/utils/Math";
import * as $geo from "../Geo";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * This is a base class for a geographical projection.
 */
var Projection = /** @class */ (function () {
    function Projection() {
        this.deltaLongitude = 0;
        this.deltaLatitude = 0;
        this.deltaGama = 0;
        this.centerPoint = { x: 0, y: 0 };
        this.scale = 1;
    }
    Projection.prototype.projectGeoArea = function (geoArea) {
        var clippedGeoArea = this.clipGeoArea(geoArea);
        var convertedPoints = this.convertGeoArea(clippedGeoArea);
        return convertedPoints;
    };
    Projection.prototype.projectGeoLine = function (geoLine) {
        return this.convertGeoLine(this.clipGeoLine(geoLine));
    };
    Projection.prototype.getClipRectangle1 = function () {
        var longitude = $geo.wrapAngleTo180(180 - this.deltaLongitude);
        var latitude = $geo.wrapAngleTo180(this.deltaLatitude);
        var smallNum = 0.00001;
        return [{ longitude: -180, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude + 90 }, { longitude: -180, latitude: latitude + 90 }];
    };
    Projection.prototype.getClipRectangle2 = function () {
        var longitude = $geo.wrapAngleTo180(180 - this.deltaLongitude);
        //let latitude = $geo.wrapAngleTo180(this.deltaLatitude);
        var smallNum = 0.00001;
        return [{ longitude: longitude + smallNum, latitude: -90 }, { longitude: 180, latitude: -90 }, { longitude: 180, latitude: 90 }, { longitude: longitude + smallNum, latitude: 90 }];
    };
    Projection.prototype.getRect1 = function () {
        var longitude = $geo.wrapAngleTo180(180 - this.deltaLongitude);
        var latitude = $geo.wrapAngleTo180(this.deltaLatitude);
        return { north: latitude + 90, south: latitude - 90, west: longitude - 180, east: longitude };
    };
    Projection.prototype.getRect2 = function () {
        var longitude = $geo.wrapAngleTo180(180 - this.deltaLongitude);
        var latitude = $geo.wrapAngleTo180(this.deltaLatitude);
        return { north: latitude + 90, south: latitude - 90, west: longitude, east: (longitude + 180) };
    };
    Projection.prototype.clipGeoLine = function (geoLine) {
        if (!geoLine) {
            return;
        }
        var clippedLine = [];
        var clipRectangle1 = this.getClipRectangle1();
        var clipRectangle2 = this.getClipRectangle2();
        for (var i = 0; i < geoLine.length; i++) {
            var segment = geoLine[i];
            if (segment) {
                var clippedSegments = this.clipLine(segment, clipRectangle1);
                clippedLine = clippedLine.concat(clippedSegments);
                if (this.deltaLongitude != 0) {
                    var clippedSegments2 = this.clipLine(segment, clipRectangle2);
                    clippedLine = clippedLine.concat(clippedSegments2);
                }
            }
        }
        return clippedLine;
    };
    Projection.prototype.clipGeoArea = function (geoArea) {
        if (!geoArea) {
            return;
        }
        var clippedArea = [];
        var clipRectangle1 = this.getClipRectangle1();
        var clipRectangle2 = this.getClipRectangle2();
        var rect1 = this.getRect1();
        var rect2 = this.getRect2();
        for (var i = 0; i < geoArea.length; i++) {
            var surface = geoArea[i][0];
            var hole = geoArea[i][1];
            var clippedAreas = [];
            if (surface) {
                var surfaceRect = this.getExtremes(surface);
                if (!this.isInside(surfaceRect, rect1) && !this.isOutside(surfaceRect, rect1)) {
                    var clippedSurface1 = this.clip(surface, clipRectangle1);
                    var clippedHole1 = this.clip(hole, clipRectangle1);
                    clippedAreas.push([clippedSurface1, clippedHole1]);
                }
                else {
                    clippedAreas.push([surface, hole]);
                }
                if (!this.isInside(surfaceRect, rect2) && !this.isOutside(surfaceRect, rect2)) {
                    var clippedSurface2 = this.clip(surface, clipRectangle2);
                    var clippedHole2 = this.clip(hole, clipRectangle2);
                    clippedAreas.push([clippedSurface2, clippedHole2]);
                }
            }
            try {
                for (var clippedAreas_1 = tslib_1.__values(clippedAreas), clippedAreas_1_1 = clippedAreas_1.next(); !clippedAreas_1_1.done; clippedAreas_1_1 = clippedAreas_1.next()) {
                    var area = clippedAreas_1_1.value;
                    clippedArea.push(area);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (clippedAreas_1_1 && !clippedAreas_1_1.done && (_a = clippedAreas_1.return)) _a.call(clippedAreas_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return clippedArea;
        var e_1, _a;
    };
    Projection.prototype.convertGeoArea = function (geoArea) {
        if (!geoArea) {
            return;
        }
        var convertedPoints = [];
        for (var i = 0; i < geoArea.length; i++) {
            var surface = geoArea[i][0];
            var hole = geoArea[i][1];
            var convertedAreaPoints = [];
            if (surface) {
                var convertedSurface = [];
                for (var s = 0; s < surface.length; s++) {
                    var point = this.convert(surface[s]);
                    convertedSurface.push(point);
                }
                convertedAreaPoints.push(convertedSurface);
            }
            if (hole) {
                var convertedHole = [];
                for (var s = 0; s < hole.length; s++) {
                    var point = this.convert(hole[s]);
                    convertedHole.push(point);
                }
                convertedAreaPoints.push(convertedHole);
            }
            convertedPoints.push(convertedAreaPoints);
        }
        return convertedPoints;
    };
    Projection.prototype.convertGeoLine = function (geoLine) {
        if (!geoLine) {
            return;
        }
        var convertedPoints = [];
        for (var i = 0; i < geoLine.length; i++) {
            var segment = geoLine[i];
            var convertedSegmentPoints = [];
            for (var s = 0; s < segment.length; s++) {
                var geoPoint = segment[s];
                var point = this.convert(geoPoint);
                convertedSegmentPoints.push(point);
            }
            convertedPoints.push(convertedSegmentPoints);
        }
        return convertedPoints;
    };
    /**
     * Converts a geographical point (lat/long) to a screen point (x/y)
     * @param  {IGeoPoint} geoPoint Geo point (lat/long)
     * @return {IPoint}             Screen point (x/y)
     */
    Projection.prototype.convert = function (geoPoint) {
        geoPoint = $geo.normalizePoint(geoPoint);
        geoPoint = this.rotate(geoPoint, this.deltaLongitude, this.deltaLatitude, this.deltaGama);
        var pointInRadians = this.project(geoPoint.longitude * $math.RADIANS, geoPoint.latitude * $math.RADIANS);
        return {
            x: $math.round(pointInRadians.x * $math.DEGREES - this.centerPoint.x, 4) * this.scale,
            y: $math.round(-pointInRadians.y * $math.DEGREES - this.centerPoint.y, 4) * this.scale
        };
    };
    /**
     * Converts a screen point (x/y) to a geographical point (lat/long)
     * @param  {IPoint}    point Screen point (x/y)
     * @return {IGeoPoint}       Geo point (lat/long)
     */
    Projection.prototype.invert = function (point) {
        var pointInRadians = this.unproject((point.x / this.scale + this.centerPoint.x) * $math.RADIANS, (-point.y / this.scale - this.centerPoint.y) * $math.RADIANS);
        var geoPoint = { longitude: pointInRadians.longitude * $math.DEGREES, latitude: pointInRadians.latitude * $math.DEGREES };
        geoPoint = this.unrotate(geoPoint, this.deltaLongitude, this.deltaLatitude, this.deltaGama);
        return geoPoint;
    };
    /**
     * Returns X/Y coordinates.
     * Individual projections will override this method to apply their own
     * projection logic.
     * @param  {number} lambda [description]
     * @param  {number} phi    [description]
     * @return {IPoint}        X/Y coordinates
     * @todo Needs description
     */
    Projection.prototype.project = function (lambda, phi) {
        return { x: lambda, y: phi };
    };
    /**
     * Returns geographical coordinates (lat/long).
     * Individual projections will override this method to apply their own
     * projection logic.
     * @param  {number}    x X coordinate
     * @param  {number}    y Y coordinate
     * @return {IGeoPoint}   Geographical point
     * @todo Needs description
     */
    Projection.prototype.unproject = function (x, y) {
        return { longitude: x, latitude: y };
    };
    Projection.prototype.rotate = function (geoPoint, deltaLongitude, deltaLatitude, deltaGamma) {
        var deltaLambda = deltaLongitude * $math.RADIANS;
        var deltaPhi = deltaLatitude * $math.RADIANS;
        deltaGamma = deltaGamma * $math.RADIANS;
        var lambda = geoPoint.longitude * $math.RADIANS + deltaLambda;
        var phi = geoPoint.latitude * $math.RADIANS;
        var cosDeltaPhi = Math.cos(deltaPhi);
        var sinDeltaPhi = Math.sin(deltaPhi);
        var cosDeltaGamma = Math.cos(deltaGamma);
        var sinDeltaGamma = Math.sin(deltaGamma);
        var cosPhi = Math.cos(phi);
        var x = Math.cos(lambda) * cosPhi;
        var y = Math.sin(lambda) * cosPhi;
        var z = Math.sin(phi);
        var k = z * cosDeltaPhi + x * sinDeltaPhi;
        return { longitude: $math.DEGREES * Math.atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi), latitude: $math.DEGREES * Math.asin(k * cosDeltaGamma + y * sinDeltaGamma) };
    };
    Projection.prototype.unrotate = function (geoPoint, deltaLongitude, deltaLatitude, deltaGamma) {
        var deltaLambda = deltaLongitude * $math.RADIANS;
        var deltaPhi = deltaLatitude * $math.RADIANS;
        deltaGamma = deltaGamma * $math.RADIANS;
        var lambda = geoPoint.longitude * $math.RADIANS - deltaLambda;
        var phi = geoPoint.latitude * $math.RADIANS;
        var cosDeltaPhi = Math.cos(deltaPhi);
        var sinDeltaPhi = Math.sin(deltaPhi);
        var cosDeltaGamma = Math.cos(deltaGamma);
        var sinDeltaGamma = Math.sin(deltaGamma);
        var cosPhi = Math.cos(phi);
        var x = Math.cos(lambda) * cosPhi;
        var y = Math.sin(lambda) * cosPhi;
        var z = Math.sin(phi);
        var k = z * cosDeltaGamma - y * sinDeltaGamma;
        return { longitude: $math.DEGREES * Math.atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi), latitude: $math.DEGREES * Math.asin(k * cosDeltaPhi - x * sinDeltaPhi) };
    };
    Projection.prototype.clipLine = function (subjectPolyline, clipPolygon) {
        if (!subjectPolyline || subjectPolyline.length == 0) {
            return;
        }
        var cp1;
        var cp2;
        var inside = function (p) {
            return (cp2.longitude - cp1.longitude) * (p.latitude - cp1.latitude) > (cp2.latitude - cp1.latitude) * (p.longitude - cp1.longitude);
        };
        var s;
        var e;
        //@todo: make a separate function
        var intersection = function () {
            var dc = { longitude: cp1.longitude - cp2.longitude, latitude: cp1.latitude - cp2.latitude };
            var dp = { longitude: s.longitude - e.longitude, latitude: s.latitude - e.latitude };
            var n1 = cp1.longitude * cp2.latitude - cp1.latitude * cp2.longitude;
            var n2 = s.longitude * e.latitude - s.latitude * e.longitude;
            var n3 = 1.0 / (dc.longitude * dp.latitude - dc.latitude * dp.longitude);
            return { longitude: (n1 * dp.longitude - n2 * dc.longitude) * n3, latitude: (n1 * dp.latitude - n2 * dc.latitude) * n3 };
        };
        var segment = subjectPolyline;
        cp1 = clipPolygon[clipPolygon.length - 1];
        for (var j in clipPolygon) {
            cp2 = clipPolygon[j];
            var inputList = segment;
            segment = [];
            s = inputList[0];
            for (var i = 0; i < inputList.length; i++) {
                e = inputList[i];
                if (inside(e)) {
                    if (!inside(s)) {
                        segment.push(intersection());
                    }
                    segment.push(e);
                }
                else if (inside(s)) {
                    segment.push(intersection());
                }
                s = e;
            }
            cp1 = cp2;
        }
        return [segment];
    };
    //@todo add credits to roseta code
    //@todo: someday make it better
    Projection.prototype.clip = function (subjectPolygon, clipPolygon) {
        if (!subjectPolygon || subjectPolygon.length == 0) {
            return;
        }
        var cp1;
        var cp2;
        var inside = function (p) {
            return (cp2.longitude - cp1.longitude) * (p.latitude - cp1.latitude) > (cp2.latitude - cp1.latitude) * (p.longitude - cp1.longitude);
        };
        var s;
        var e;
        //@todo: make a separate function
        var intersection = function () {
            var dc = { longitude: cp1.longitude - cp2.longitude, latitude: cp1.latitude - cp2.latitude };
            var dp = { longitude: s.longitude - e.longitude, latitude: s.latitude - e.latitude };
            var n1 = cp1.longitude * cp2.latitude - cp1.latitude * cp2.longitude;
            var n2 = s.longitude * e.latitude - s.latitude * e.longitude;
            var n3 = 1.0 / (dc.longitude * dp.latitude - dc.latitude * dp.longitude);
            return { longitude: (n1 * dp.longitude - n2 * dc.longitude) * n3, latitude: (n1 * dp.latitude - n2 * dc.latitude) * n3 };
        };
        var outputList = subjectPolygon;
        cp1 = clipPolygon[clipPolygon.length - 1];
        for (var j in clipPolygon) {
            cp2 = clipPolygon[j];
            var inputList = outputList;
            outputList = [];
            s = inputList[inputList.length - 1]; //last on the input list
            for (var i in inputList) {
                e = inputList[i];
                if (inside(e)) {
                    if (!inside(s)) {
                        outputList.push(intersection());
                    }
                    outputList.push(e);
                }
                else if (inside(s)) {
                    outputList.push(intersection());
                }
                s = e;
            }
            cp1 = cp2;
        }
        return outputList;
    };
    //@todo: move to some utils?
    Projection.prototype.getExtremes = function (geoPoints) {
        var west = geoPoints[0].longitude;
        var east = geoPoints[0].longitude;
        var north = geoPoints[0].latitude;
        var south = geoPoints[0].latitude;
        for (var s = 0; s < geoPoints.length; s++) {
            var longitude = geoPoints[s].longitude;
            var latitude = geoPoints[s].latitude;
            if ((west > longitude)) {
                west = longitude;
            }
            if ((east < longitude)) {
                east = longitude;
            }
            if ((north < latitude)) {
                north = latitude;
            }
            if ((south > latitude)) {
                south = latitude;
            }
        }
        return { north: north, east: east, south: south, west: west };
    };
    //@todo: move to some utils?
    Projection.prototype.isInside = function (r1, r2) {
        if (r1.north < r2.north && r1.south > r2.south && r1.west > r2.west && r1.east < r2.east) {
            return true;
        }
        return false;
    };
    //@todo: move to some utils?
    Projection.prototype.isOutside = function (r1, r2) {
        if (r1.south > r2.north || r1.north < r2.south || r1.west > r2.east || r1.east < r2.west) {
            return true;
        }
        return false;
    };
    //@todo: move to some utils?
    //@todo: add credits to: https://www.movable-type.co.uk/scripts/latlong.html
    Projection.prototype.intermediatePoint = function (pointA, pointB, position) {
        var phi1 = pointA.latitude * $math.RADIANS;
        var lambda1 = pointA.longitude * $math.RADIANS;
        var phi2 = pointB.latitude * $math.RADIANS;
        var lambda2 = pointB.longitude * $math.RADIANS;
        var sinPhi1 = Math.sin(phi1);
        var cosPhi1 = Math.cos(phi1);
        var sinLambda1 = Math.sin(lambda1);
        var cosLambda1 = Math.cos(lambda1);
        var sinPhi2 = Math.sin(phi2);
        var cosPhi2 = Math.cos(phi2);
        var sinLambda2 = Math.sin(lambda2);
        var cosLambda2 = Math.cos(lambda2);
        // distance between points
        var deltaPhi = phi2 - phi1;
        var deltaLambda = lambda2 - lambda1;
        var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        var delta = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var A = Math.sin((1 - position) * delta) / Math.sin(delta);
        var B = Math.sin(position * delta) / Math.sin(delta);
        var x = A * cosPhi1 * cosLambda1 + B * cosPhi2 * cosLambda2;
        var y = A * cosPhi1 * sinLambda1 + B * cosPhi2 * sinLambda2;
        var z = A * sinPhi1 + B * sinPhi2;
        var phi3 = Math.atan2(z, Math.sqrt(x * x + y * y));
        var lambda3 = Math.atan2(y, x);
        return { latitude: phi3 * $math.DEGREES, longitude: lambda3 * $math.DEGREES };
    };
    ;
    return Projection;
}());
export { Projection };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Projection"] = Projection;
//# sourceMappingURL=Projection.js.map