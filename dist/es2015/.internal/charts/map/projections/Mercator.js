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
/**
 * Mercator projection.
 */
var Mercator = /** @class */ (function (_super) {
    tslib_1.__extends(Mercator, _super);
    function Mercator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Converts screen coordinates to latitude/longitude in radians
     * @param  {number}     x  X
     * @param  {number}     y  Y
     * @return {IGeoPoint}     Geographical coordinates
     */
    Mercator.prototype.unproject = function (x, y) {
        return {
            longitude: x,
            latitude: 2 * Math.atan(Math.exp(y)) - Math.PI / 2
        };
    };
    /**
     * Converts geographical coordinates to screen coordinates.
     *
     * @param  {number}  lambda  Lambda parameter
     * @param  {number}  phi     Phi parameter
     * @return {IPoint}          Screen coordinates
     */
    Mercator.prototype.project = function (lambda, phi) {
        return {
            x: lambda,
            y: Math.log(Math.tan((Math.PI / 2 + phi) / 2))
        };
    };
    return Mercator;
}(Projection));
export { Mercator };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Mercator"] = Mercator;
//# sourceMappingURL=Mercator.js.map