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
 * Returns a waved line SVG path between two points.
 *
 * @ignore Exclude from docs
 * @param  {IPoint}   point1            Starting point
 * @param  {IPoint}   point2            Ending point
 * @param  {number}   waveLength        Wave length
 * @param  {number}   waveHeight        Wave height
 * @param  {boolean}  adjustWaveLength  Adjust wave length based on the actual line length
 * @return {string}                     SVG path
 */
export declare function wavedLine(point1: IPoint, point2: IPoint, waveLength: number, waveHeight: number, tension: number, adjustWaveLength?: boolean): string;
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
