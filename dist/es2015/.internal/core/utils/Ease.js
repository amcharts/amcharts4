/**
 * A collection of easing functions
 *
 * Parts of this collection are taken from D3.js library (https://d3js.org/)
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as $math from "../utils/Math";
/**
 * The functions below are from D3.js library (https://d3js.org/)
 *
 * ----------------------------------------------------------------------------
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
 * ----------------------------------------------------------------------------
 * @hidden
 */
/**
 * ============================================================================
 * LINEAR FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Easing function: "linear".
 */
export function linear(t) {
    return +t;
}
/**
 * Easing function: "quadIn".
 */
export function quadIn(t) {
    return t * t;
}
/**
 * Easing function: "quadOut".
 */
export function quadOut(t) {
    return t * (2 - t);
}
/**
 * Easing function: "quadInOut".
 */
export function quadInOut(t) {
    t *= 2;
    return (t <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}
/**
 * Easing function: "polyIn".
 */
export function polyIn(t, e) {
    return Math.pow(t, e);
}
/**
 * Easing function: "polyOut".
 */
export function polyOut(t, e) {
    return 1 - Math.pow(1 - t, e);
}
/**
 * Easing function: "polyInOut".
 */
export function polyInOut(t, e) {
    t *= 2;
    return (t <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
}
/**
 * Easing function: "polyIn3".
 */
export function polyIn3(t) {
    return polyIn(t, 3);
}
/**
 * Easing function: "polyOut3".
 */
export function polyOut3(t) {
    return polyOut(t, 3);
}
/**
 * Easing function: "polyInOut3".
 */
export function polyInOut3(t) {
    return polyInOut(t, 3);
}
/**
 * ============================================================================
 * EXPONENTIAL FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Easing function: "expIn".
 */
export function expIn(t) {
    return Math.pow(2, 10 * t - 10);
}
/**
 * Easing function: "expOut".
 */
export function expOut(t) {
    return 1 - Math.pow(2, -10 * t);
}
/**
 * Easing function: "expInOut".
 */
export function expInOut(t) {
    t *= 2;
    return (t <= 1 ? Math.pow(2, 10 * t - 10) : 2 - Math.pow(2, 10 - 10 * t)) / 2;
}
/**
 * ============================================================================
 * SINE FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Easing function: "sinIn".
 */
export function sinIn(t) {
    return 1 - Math.cos(t * $math.HALFPI);
}
/**
 * Easing function: "sinOut".
 */
export function sinOut(t) {
    return Math.sin(t * $math.HALFPI);
}
/**
 * Easing function: "sinInOut".
 */
export function sinInOut(t) {
    return (1 - Math.cos($math.PI * t)) / 2;
}
/**
 * ============================================================================
 * CUBIC FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Easing function: "cubicIn".
 */
export function cubicIn(t) {
    return t * t * t;
}
/**
 * Easing function: "cubicOut".
 */
export function cubicOut(t) {
    return --t * t * t + 1;
}
/**
 * Easing function: "cubicInOut".
 */
export function cubicInOut(t) {
    t *= 2;
    return (t <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
/**
 * ============================================================================
 * CIRCLE FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Easing function: "circleIn".
 */
export function circleIn(t) {
    return 1 - Math.sqrt(1 - t * t);
}
/**
 * Easing function: "circleOut".
 */
export function circleOut(t) {
    return Math.sqrt(1 - --t * t);
}
/**
 * Easing function: "circleInOut".
 */
export function circleInOut(t) {
    t *= 2;
    return (t <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}
/**
 * ============================================================================
 * BOUNCE FUNCTIONS
 * ============================================================================
 * @hidden
 */
var b1 = 4 / 11, b2 = 6 / 11, b3 = 8 / 11, b4 = 3 / 4, b5 = 9 / 11, b6 = 10 / 11, b7 = 15 / 16, b8 = 21 / 22, b9 = 63 / 64, b0 = 1 / b1 / b1;
/**
 * Easing function: "bounceIn".
 */
export function bounceIn(t) {
    return 1 - bounceOut(1 - t);
}
/**
 * Easing function: "bounceOut".
 */
export function bounceOut(t) {
    t = +t;
    return t < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
}
/**
 * Easing function: "bounceInOut".
 */
export function bounceInOut(t) {
    t *= 2;
    return (t <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
}
/**
 * ============================================================================
 * ELASTIC FUNCTIONS
 * ============================================================================
 * @hidden
 */
var tau = 2 * Math.PI;
var amplitude = 1;
var period = 0.3 / tau;
var s = Math.asin(1 / amplitude) * period;
/**
 * Easing function: "elasticIn".
 *
 * @function elasticIn
 * @param a  Amplitude
 * @param p  period
 */
export function elasticIn(t) {
    return amplitude * Math.pow(2, 10 * --t) * Math.sin((s - t) / period);
}
/**
 * Easing function: "elasticOut".
 *
 * @function elasticOut
 * @param a  Amplitude
 * @param p  period
 */
export function elasticOut(t) {
    return 1 - amplitude * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / period);
}
/**
 * Easing function: "elasticInOut".
 *
 * @function elasticInOut
 * @param a  Amplitude
 * @param p  period
 */
export function elasticInOut(t) {
    t = t * 2 - 1;
    return (t < 0
        ? amplitude * Math.pow(2, 10 * t) * Math.sin((s - t) / period)
        : 2 - amplitude * Math.pow(2, -10 * t) * Math.sin((s + t) / period)) / 2;
}
//# sourceMappingURL=Ease.js.map