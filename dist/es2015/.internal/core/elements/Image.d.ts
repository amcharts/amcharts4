/**
 * Functionality for adding images in SVG tree.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../Sprite";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Image]].
 */
export interface IImageProperties extends ISpriteProperties {
    /**
     * A URI of the image.
     *
     * @type {string}
     */
    href?: string;
}
/**
 * Defines events for [[Image]].
 */
export interface IImageEvents extends ISpriteEvents {
}
/**
 * Defines adapters for [[Image]].
 *
 * @see {@link Adapter}
 */
export interface IImageAdapters extends ISpriteAdapters, IImageProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Used to add `<image>` elements to SVG.
 *
 * @see {@link IImageEvents} for a list of available events
 * @see {@link IImageAdapters} for a list of available Adapters
 */
export declare class Image extends Sprite {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IImageProperties}
     */
    _properties: IImageProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IImageAdapters}
     */
    _adapter: IImageAdapters;
    /**
     * Defines available events.
     *
     * @type {IImageEvents}
     * @ignore Exclude from docs
     */
    _events: IImageEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws an `<image>` element.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * @return {string} Image URI
     */
    /**
     * An image URI.
     *
     * @param {string}  value  Image URI
     */
    href: string;
}
