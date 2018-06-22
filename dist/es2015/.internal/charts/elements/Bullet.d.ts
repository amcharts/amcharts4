/**
 * Module that defines everything related to building bullets.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Bullet]].
 */
export interface IBulletProperties extends IContainerProperties {
    /**
     * Relative horizontal location within cell. (0-1)
     *
     * @type {number}
     */
    locationX?: number;
    /**
     * Relative vertical location within cell. (0-1)
     *
     * @type {number}
     */
    locationY?: number;
    /**
     * Specifies if bullet needs to be redrawn if the underlying data changes.
     *
     * @type {boolean}
     */
    isDynamic?: boolean;
    /**
     * [string description]
     *
     * @todo Description
     * @type {string}
     */
    xField?: string;
    /**
     * [string description]
     *
     * @todo Description
     * @type {string}
     */
    yField?: string;
    /**
     * Defines if this bullet should be copied to legend marker
     */
    copyToLegendMarker?: boolean;
}
/**
 * Defines events for [[Bullet]].
 */
export interface IBulletEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[Bullet]].
 *
 * @see {@link Adapter}
 */
export interface IBulletAdapters extends IContainerAdapters, IBulletProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates bullets.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export declare class Bullet extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IBulletProperties}
     */
    _properties: IBulletProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IBulletAdapters}
     */
    _adapter: IBulletAdapters;
    /**
     * Defines available events.
     *
     * @type {IBulletEvents}
     * @ignore Exclude from docs
     */
    _events: IBulletEvents;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {number} Location (0-1)
     */
    /**
     * Relative horizontal location within cell. (0-1)
     *
     * @param {number}  value  Location (0-1)
     */
    locationX: number;
    /**
     * @return {number} Location (0-1)
     */
    /**
     * Relative vertical location within cell. (0-1)
     *
     * @param {number}  value  Location (0-1)
     */
    locationY: number;
    /**
     * @return {string} [description]
     */
    /**
     * [xField description]
     *
     * @todo Description
     * @param {string}  value  [description]
     */
    xField: string;
    /**
     * @return {string} [description]
     */
    /**
     * [yField description]
     *
     * Description
     * @param {string}  value  [description]
     */
    yField: string;
    /**
     * @return {boolean} Redraw on data change?
     */
    /**
     * Indicates if the bullet is "dynamic".
     *
     * In most cases the bullets remain the same, even if the underlying data
     * changes.
     *
     * However, in cases where bullet also displays a label, or its size depends
     * on data, it also needs to be redrawn when the underlying data changes.
     *
     * Only those bullets that have set `isDynamic = true` will be redrawn each
     * time data changes. Regular bullets will be reused as they are.
     *
     * @default false
     * @param {boolean}  value  Redraw on data change?
     */
    isDynamic: boolean;
    /**
     * @return {boolean} Redraw on data change?
     */
    /**
     * Indicates if the bullet should be copied to legend marker
     *
     * @default false
     * @param {boolean}  value  Redraw on data change?
     */
    copyToLegendMarker: boolean;
}
