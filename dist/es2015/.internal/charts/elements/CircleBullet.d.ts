/**
 * Bullet module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Bullet, IBulletProperties, IBulletAdapters, IBulletEvents } from "./Bullet";
import { Circle } from "../../core/elements/Circle";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Bullet]]
 */
export interface ICircleBulletProperties extends IBulletProperties {
}
/**
 * Defines events for [[Bullet]]
 */
export interface ICircleBulletEvents extends IBulletEvents {
}
/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface ICircleBulletAdapters extends IBulletAdapters, ICircleBulletProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a bullet with a textual label.
 *
 * Uses [[Label]] instance to draw the label, so the label itself is
 * configurable.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export declare class CircleBullet extends Bullet {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ICircleBulletProperties}
     */
    _properties: ICircleBulletProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ICircleBulletAdapters}
     */
    _adapter: ICircleBulletAdapters;
    /**
     * Defines available events.
     *
     * @type {ICircleBulletEvents}
     * @ignore Exclude from docs
     */
    _events: ICircleBulletEvents;
    /**
     * A label (textual) element for the bullet.
     *
     * @type {Circle}
     */
    circle: Circle;
    /**
     * Constructor
     */
    constructor();
    /**
     * Copies all proprities and related stuff from another instance of
     * [[CircleBullet]].
     *
     * @param {this}  source  Source element
     */
    copyFrom(source: this): void;
}
