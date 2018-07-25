/**
 * Functionality for Mercator projection
 *
 * The function(s) below are from D3.js library (https://d3js.org/)
 *
 * ```
 * Copyright 2017 Mike Bostock
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * ```
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Projection } from "./Projection";
import { registry } from "../../../core/Registry";
import * as $math from "../../../core/utils/Math";
/**
 * Orthographic projection.
 */
var Orthographic = /** @class */ (function (_super) {
    tslib_1.__extends(Orthographic, _super);
    function Orthographic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Converts geographical coordinates to screen coordinates.
     *
     * @param  {number}  lambda  Lambda parameter
     * @param  {number}  phi     Phi parameter
     * @return {IPoint}          Screen coordinates
     */
    Orthographic.prototype.project = function (lambda, phi) {
        return { x: Math.cos(phi) * Math.sin(lambda), y: Math.sin(phi) };
    };
    Orthographic.prototype.getClipRectangle1 = function () {
        var longitude = 90 - this.deltaLongitude;
        var latitude = -this.deltaLatitude;
        var smallNum = 0.00001;
        return [{ longitude: longitude - 180, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude - 90 }, { longitude: longitude - smallNum, latitude: latitude + 90 }, { longitude: longitude - 180, latitude: latitude + 90 }];
    };
    Orthographic.prototype.getRect1 = function () {
        var longitude = 90 - this.deltaLongitude;
        var latitude = -this.deltaLatitude;
        return { north: latitude + 90, south: latitude - 90, west: longitude - 180, east: longitude };
    };
    Orthographic.prototype.getClipRectangle2 = function () {
        var longitude = 90 - this.deltaLongitude;
        var latitude = -this.deltaLatitude;
        var smallNum = 0.00001;
        var delta;
        if (longitude > 0) {
            delta = -360;
        }
        else {
            delta = 360;
        }
        return [{ longitude: smallNum + longitude - 180 + delta, latitude: latitude - 90 }, { longitude: longitude - smallNum + delta, latitude: latitude - 90 }, { longitude: longitude - smallNum + delta, latitude: latitude + 90 }, { longitude: smallNum + longitude - 180 + delta, latitude: latitude + 90 }];
    };
    Orthographic.prototype.getRect2 = function () {
        var longitude = 90 - this.deltaLongitude;
        var latitude = -this.deltaLatitude;
        var delta;
        if (longitude > 0) {
            delta = -360;
        }
        else {
            delta = 360;
        }
        return { north: latitude + 90, south: latitude - 90, west: longitude - 180 + delta, east: longitude + delta };
    };
    Orthographic.prototype.clipGeoArea = function (geoArea) {
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
                else if (this.isInside(surfaceRect, rect1)) {
                    clippedAreas.push([surface, hole]);
                }
                if (!this.isInside(surfaceRect, rect2) && !this.isOutside(surfaceRect, rect2)) {
                    var clippedSurface2 = this.clip(surface, clipRectangle2);
                    var clippedHole2 = this.clip(hole, clipRectangle2);
                    clippedAreas.push([clippedSurface2, clippedHole2]);
                }
                else if (this.isInside(surfaceRect, rect2)) {
                    clippedAreas.push([surface, hole]);
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
        for (var i = 0; i < clippedArea.length; i++) {
            var surface = clippedArea[i][0];
            //let hole: IGeoPoint[] = clippedArea[i][1];
            if (surface) {
                var prevPoint = surface[surface.length - 1];
                for (var i_1 = 0; i_1 < surface.length; i_1++) {
                    var point = surface[i_1];
                    if ($math.round(point.longitude, 4) == $math.round(prevPoint.longitude, 4)) {
                        var stepCount = Math.abs((prevPoint.latitude - point.latitude) * 2);
                        var extraPoints = [];
                        if (stepCount > 1) {
                            for (var s = 1; s < stepCount; s++) {
                                extraPoints.push({ longitude: prevPoint.longitude, latitude: prevPoint.latitude + (point.latitude - prevPoint.latitude) / stepCount * s });
                            }
                            surface.splice.apply(surface, tslib_1.__spread([i_1, 0], extraPoints));
                            i_1 = i_1 + extraPoints.length;
                        }
                    }
                    prevPoint = point;
                }
            }
        }
        return clippedArea;
        var e_1, _a;
    };
    return Orthographic;
}(Projection));
export { Orthographic };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Orthographic"] = Orthographic;
//# sourceMappingURL=Orthographic.js.map