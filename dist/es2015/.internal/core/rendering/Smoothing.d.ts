import { IPoint } from "../defs/IPoint";
/**
 * ============================================================================
 * PATH FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * @ignore Exclude from docs
 * @todo Description
 */
export interface ISmoothing {
    smooth(points: Array<IPoint>): string;
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
export declare class Monotone implements ISmoothing {
    /**
     * [_reversed description]
     *
     * @todo Description
     * @type {boolean}
     */
    private _reversed;
    /**
     * [_closed description]
     *
     * @todo Description
     * @type {boolean}
     */
    private _closed;
    /**
     * Constructor.
     *
     * @param {boolean}  reversed  [description]
     * @param {object}   info      [description]
     */
    constructor(reversed: boolean, info: {
        closed: boolean;
    });
    /**
     * [_curve description]
     *
     * According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
     * "you can express cubic Hermite interpolation in terms of cubic Bézier curves
     * with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
     *
     * @todo Description
     * @param  {number} x0 [description]
     * @param  {number} x1 [description]
     * @param  {number} y0 [description]
     * @param  {number} y1 [description]
     * @param  {number} t0 [description]
     * @param  {number} t1 [description]
     * @return {string}    [description]
     */
    private _curve(x0, x1, y0, y1, t0, t1);
    /**
     * [smooth description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {Array<IPoint>} points [description]
     * @return {string}               [description]
     */
    smooth(points: Array<IPoint>): string;
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
export declare class MonotoneX extends Monotone {
    constructor(info: {
        closed: boolean;
    });
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
export declare class MonotoneY extends Monotone {
    constructor(info: {
        closed: boolean;
    });
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
export declare class CatmullRom implements ISmoothing {
    /**
     * [_alpha description]
     *
     * @todo Description
     * @type {number}
     */
    private _alpha;
    /**
     * [_closed description]
     *
     * @todo Description
     * @type {boolean}
     */
    private _closed;
    /**
     * Constructor.
     *
     * @param {object} info [description]
     */
    constructor(info: {
        alpha: number;
        closed: boolean;
    });
    /**
     * [smooth description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {Array<IPoint>}  points  [description]
     * @return {string}                 [description]
     */
    smooth(points: Array<IPoint>): string;
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
export declare class Tension implements ISmoothing {
    /**
     * [_tensionX description]
     *
     * @todo Description
     * @type {number}
     */
    private _tensionX;
    /**
     * [_tensionY description]
     *
     * @todo Description
     * @type {number}
     */
    private _tensionY;
    /**
     * Constructor.
     *
     * @param {number} tensionX [description]
     * @param {number} tensionY [description]
     */
    constructor(tensionX: number, tensionY: number);
    /**
     * [smooth description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {Array<IPoint>}  points  [description]
     * @return {string}                 [description]
     */
    smooth(points: Array<IPoint>): string;
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
export declare class Basis implements ISmoothing {
    /**
     * [_closed description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {boolean}
     */
    private _closed;
    /**
     * Constructor.
     *
     * @param {object}  info  [description]
     */
    constructor(info: {
        closed: boolean;
    });
    /**
     * [smooth description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @param  {Array<IPoint>}  points  [description]
     * @return {string}                 [description]
     */
    smooth(points: Array<IPoint>): string;
}
