/**
 * A module that defines Text element used to indicate links.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Text, ITextProperties, ITextAdapters, ITextEvents } from "../../core/elements/Text";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[TextLink]].
 */
export interface ITextLinkProperties extends ITextProperties {
}
/**
 * Defines events for [[TextLink]].
 */
export interface ITextLinkEvents extends ITextEvents {
}
/**
 * Defines adapters for [[TextLink]].
 *
 * @see {@link Adapter}
 */
export interface ITextLinkAdapters extends ITextAdapters, ITextLinkProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a text element with a link.
 *
 * @see {@link ITextLinkEvents} for a list of available events
 * @see {@link ITextLinkAdapters} for a list of available Adapters
 */
export declare class TextLink extends Text {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ITextLinkProperties}
     */
    _properties: ITextLinkProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ITextLinkAdapters}
     */
    _adapter: ITextLinkAdapters;
    /**
     * Event dispatcher.
     *
     * @type {SpriteEventDispatcher<AMEvent<TextLink, ITextLinkEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<TextLink, ITextLinkEvents>>;
    /**
     * Constructor
     */
    constructor();
}
