/**
 * Label class is used to put textual elements on the chart. It uses [[Text]] to
 * add actual text, but is in itself a [[Container]] so that various sizing and
 * placement options can be applied to it.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../Container";
import { SpriteEventDispatcher, AMEvent } from "../Sprite";
import { DataItem } from "../DataItem";
import { Text } from "./Text";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Label]].
 */
export interface ILabelProperties extends IContainerProperties {
}
/**
 * Defines events for [[Label]].
 */
export interface ILabelEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[Label]].
 *
 * @see {@link Adapter}
 */
export interface ILabelAdapters extends IContainerAdapters, ILabelProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Label class is used to put textual elements on the chart. It uses [[Text]] to
 * add actual text, but is in itself a [[Container]] so that various sizing and
 * placement options can be applied to it.
 *
 * @see {@link ILabelEvents} for a list of available events
 * @see {@link ILabelAdapters} for a list of available Adapters
 */
export declare class Label extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ILabelProperties}
     */
    _properties: ILabelProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ILabelAdapters}
     */
    _adapter: ILabelAdapters;
    /**
     * Reference to a [[Text]] instance.
     *
     * @type {Text}
     */
    protected _textElement: Text;
    /**
     * Event dispatcher.
     *
     * @type {SpriteEventDispatcher<AMEvent<Label, ILabelEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<Label, ILabelEvents>>;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {Text} Text instance
     */
    /**
     * A [[Text]] instance to be used as label element.
     *
     * @param {Text}  textElement  Text instance
     */
    textElement: Text;
    /**
     * A plain text for the label.
     *
     * @param {string}  value  Text
     */
    text: string;
    /**
     * An HTML content for the label.
     *
     * @param {string}  value  HTML
     */
    html: string;
    /**
     * Sets data item for the label.
     *
     * This wil be used in resolving field references in text and replacing them
     * with real values.
     *
     * @ignore Exclude from docs
     * @param {DataItem} dataItem [description]
     */
    setDataItem(dataItem: DataItem): void;
    /**
     * Copies all properties from another [[Label]] instance.
     *
     * @param {Label}  label  Source element
     */
    copyFrom(label: this): void;
}
