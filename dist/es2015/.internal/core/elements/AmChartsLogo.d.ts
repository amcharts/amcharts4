/**
 * AmChartsLogo module.
 *
 * AmChartsLogo shows amCharts logo for non-commercial users of a library.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../Container";
import { SpriteEventDispatcher, AMEvent } from "../Sprite";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[AmChartsLogo]].
 */
export interface IAmChartsLogoProperties extends IContainerProperties {
}
/**
 * Defines events for [[AmChartsLogo]].
 */
export interface IAmChartsLogoEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[AmChartsLogo]].
 *
 * @see {@link Adapter}
 */
export interface IAmChartsLogoAdapters extends IContainerAdapters, IAmChartsLogoProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A class used to draw and display progress indicator.
 *
 * @see {@link IAmChartsLogoEvents} for a list of available events
 * @see {@link IAmChartsLogoAdapters} for a list of available Adapters
 */
export declare class AmChartsLogo extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {IAmChartsLogoProperties}
     */
    _properties: IAmChartsLogoProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IAmChartsLogoAdapters}
     */
    _adapter: IAmChartsLogoAdapters;
    /**
     * Event dispacther.
     *
     * @type {SpriteEventDispatcher<AMEvent<AmChartsLogo, IAmChartsLogoEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<AmChartsLogo, IAmChartsLogoEvents>>;
    /**
     * Constructor
     */
    constructor();
}
