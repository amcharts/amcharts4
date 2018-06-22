/**
 * Cone module.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../Container";
import { Sprite } from "../../Sprite";
import { Ellipse } from "../../elements/Ellipse";
import { LinearGradientModifier } from "../../rendering/fills/LinearGradientModifier";
import { Percent } from "../../utils/Percent";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Cone]].
 */
export interface IConeProperties extends IContainerProperties {
    /**
     * Angle of the point of view to the 3D element. (0-360)
     *
     * @default 30
     * @type {number}
     */
    angle?: number;
    /**
     * A relative radius of the cone's bottom (base).
     *
     * It is relevant to the inner width or height of the element.
     *
     * @default Percent(100)
     * @type {Percent}
     */
    radius?: Percent;
    /**
     * A relative radius of the cone's top (tip).
     *
     * It is relevant to the inner width or height of the element.
     *
     * @default Percent(0)
     * @type {Percent}
     */
    topRadius?: Percent;
    /**
     * Orientation of the cone: "horizontal" or "vertical".
     *
     * @default "vertical"
     */
    orientation?: "horizontal" | "vertical";
}
/**
 * Defines events for [[Cone]].
 */
export interface IConeEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[Cone]].
 *
 * @see {@link Adapter}
 */
export interface IConeAdapters extends IContainerAdapters, IConeProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Builds a round cone/cylinder.
 *
 * @see {@link IConeEvents} for a list of available events
 * @see {@link IConeAdapters} for a list of available Adapters
 */
export declare class Cone extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IConeProperties}
     */
    _properties: IConeProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IConeAdapters}
     */
    _adapter: IConeAdapters;
    /**
     * Defines available events.
     *
     * @type {IConeEvents}
     * @ignore Exclude from docs
     */
    _events: IConeEvents;
    /**
     * Bottom ellement.
     *
     * @ignore Exclude from docs
     * @type {Ellipse}
     */
    bottom: Ellipse;
    /**
     * Top element.
     *
     * @ignore Exclude from docs
     * @type {Ellipse}
     */
    top: Ellipse;
    /**
     * Body element.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    body: Sprite;
    /**
     * Gradient for the fill of the body.
     *
     * @type {LinearGradientModifier}
     */
    bodyFillModifier: LinearGradientModifier;
    /**
     * Constructor
     */
    constructor();
    /**
     * Draws the element.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * @return {number} Angle
     */
    /**
     * Angle of the point of view to the 3D element. (0-360)
     *
     * @default 30
     * @param {number}  value  Angle
     */
    angle: number;
    /**
     * @return {Percent} Bottom radius
     */
    /**
     * A relative radius of the cone's bottom (base).
     *
     * It is relevant to the inner width or height of the element.
     *
     * @default Percent(100)
     * @param {Percent}  value  Bottom radius
     */
    radius: Percent;
    /**
     * @return {Percent} Top radius
     */
    /**
     * A relative radius of the cone's top (tip).
     *
     * It is relevant to the inner width or height of the element.
     *
     * @default Percent(0)
     * @param {Percent}  value  Top radius
     */
    topRadius: Percent;
    /**
     * @type {"horizontal" | "vertical"} Orientation
     */
    /**
     * Orientation of the cone: "horizontal" or "vertical".
     *
     * @default "vertical"
     * @param {"horizontal" | "vertical"}  value  Orientation
     */
    orientation: "horizontal" | "vertical";
}
