/**
 * Bullet module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Bullet, IBulletProperties, IBulletAdapters, IBulletEvents } from "../../charts/elements/Bullet";
import { Circle } from "../../core/elements/Circle";
import { PointedCircle } from "./PointedCircle";
import { Image } from "../../core/elements/Image";
import { Label } from "../../core/elements/Label";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Bullet]]
 */
export interface IPinBulletProperties extends IBulletProperties {
}
/**
 * Defines events for [[Bullet]]
 */
export interface IPinBulletEvents extends IBulletEvents {
}
/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IPinBulletAdapters extends IBulletAdapters, IPinBulletProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 *
 * @todo mm
 * Creates a pin bullet which can contain image or label inside.
 * Background of pin bullet is [[PointedCircle]] element, and most of the visual appearance is configured via background property.
 *
 * Uses [[Label]] instance to draw the label, so the label itself is
 * configurable.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export declare class PinBullet extends Bullet {
    /**
     * Defines available properties.
     */
    _properties: IPinBulletProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IPinBulletAdapters;
    /**
     * Defines available events.
     */
    _events: IPinBulletEvents;
    /**
     * A label (textual) element for the bullet.
     */
    circle: Circle;
    /**
     * A type for the background element.
     */
    _background: PointedCircle;
    protected _image: Image;
    protected _label: Label;
    /**
     * Constructor
     */
    constructor();
    /**
     * Validates element:
     * * Triggers events
     * * Redraws the element
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * @todo mm
     */
    /**
     * @todo mm
     */
    image: Image;
    /**
     * @todo mm
     */
    /**
     * @todo mm
     */
    label: Label;
    /**
     * Copies all proprities and related stuff from another instance of
     * [[PinBullet]].
     *
     * @param source  Source element
     */
    copyFrom(source: this): void;
    /**
     * Creates and returns a background element.
     *
     * @ignore Exclude from docs
     * @return Background
     */
    createBackground(): this["_background"];
}
