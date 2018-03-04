/**
 * Defines an interface for geographical coordinates
 */
export interface IGeoRectangle {
    /**
     * Latitude
     * @type {number}
     */
    north: number;
    /**
     * Latitude
     * @type {number}
     */
    south: number;
    /**
     * Longitude
     * @type {number}
     */
    west: number;
    /**
     * Longitude
     * @type {number}
     */
    east: number;
}
