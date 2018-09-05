/**
 * Legend-related functionality.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Component, IComponentProperties, IComponentDataFields, IComponentAdapters, IComponentEvents } from "../core/Component";
import { DataItem } from "../core/DataItem";
import { ListTemplate } from "../core/utils/List";
import { Container } from "../core/Container";
import { Label } from "../core/elements/Label";
import { Optional } from "../core/utils/Type";
import { Preloader } from "../core/elements/Preloader";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[Legend]].
 *
 * @see {@link DataItem}
 */
export declare class LegendDataItem extends DataItem {
    /**
     * A container data item's elements will be placed in.
     *
     * @type {Container}
     */
    protected _itemContainer: Container;
    /**
     * A [[Label]] element for the item label.
     *
     * @type {Container}
     */
    protected _label: Label;
    /**
     * A [[Container]] for legend item marker.
     *
     * @type {Container}
     */
    protected _marker: Container;
    /**
     * A [[Label]] element for the value label.
     *
     * @type {Label}
     */
    protected _valueLabel: Label;
    /**
     * A data context for legend item.
     *
     * @type {any}
     */
    dataContext: any;
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @ignore Exclude from docs
     * @type {Legend}
     */
    _component: Legend;
    /**
     * @ignore
     */
    childrenCreated: boolean;
    /**
     * Constructor
     */
    constructor();
    readonly label: Label;
    readonly valueLabel: Label;
    readonly itemContainer: Container;
    readonly marker: Container;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines a class that carries legend settings.
 *
 * A legend might change its settings dynamically. Legend can also be shared
 * by several elements, requiring different settings.
 *
 * Having legend's settings in a separate object is a good way to "hot swap"
 * a set of settings for the legend.
 */
export declare class LegendSettings {
    /**
     * [valueText description]
     *
     * @todo Description
     * @type {string}
     */
    valueText: string;
    /**
     * [labelText description]
     *
     * @todo Description
     * @type {string}
     */
    labelText: string;
    /**
     * A text template for the value part of the legend item.
     *
     * @type {string}
     */
    itemValueText: string;
    /**
     * A text template for the label part of the legend item.
     * @type {string}
     */
    itemLabelText: string;
    /**
     * Should marker be created for each legend item.
     *
     * @type {boolean}
     */
    createMarker: boolean;
}
/**
 * Represents types available for Legend position.
 *
 * @type {string}
 */
export declare type LegendPosition = "left" | "right" | "top" | "bottom" | "absolute";
/**
 * Defines data fields for [[Legend]].
 */
export interface ILegendDataFields extends IComponentDataFields {
    /**
     * A field name in the data item which holds name of the legend item.
     *
     * @type {string}
     */
    name?: string;
    /**
     * A field name in data item which holds boolean value whether item should
     * be displayed in legend or not.
     *
     * @type {string}
     */
    visible?: string;
}
/**
 * Defines properties for [[Legend]].
 */
export interface ILegendProperties extends IComponentProperties {
    /**
     * Should legend use default marker?
     *
     * If set to `false`, the legend will try to mirror the look of the actual
     * item, like series.
     *
     * @default true
     * @type {boolean}
     */
    useDefaultMarker?: boolean;
    /**
     * Position of the legend.
     *
     * Options: "left", "right", "top", "bottom" (default), or "absolute".
     *
     * @default "bottom"
     * @type {LegendPosition}
     */
    position?: LegendPosition;
}
/**
 * Defines events for [[Legend]].
 */
export interface ILegendEvents extends IComponentEvents {
}
/**
 * Defines adapters for [[Legend]].
 *
 * @see {@link Adapter}
 */
export interface ILegendAdapters extends IComponentAdapters, ILegendProperties {
}
export interface ILegendItemEvents {
    propertychanged: {
        /**
         * Property key.
         *
         * @type {string}
         */
        property: string;
    };
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * [[Legend]] class is used to create legend for the chart.
 *
 * @see {@link ILegendEvents} for a list of available events
 * @see {@link ILegendAdapters} for a list of available Adapters
 * @todo Verify/implement dynamic updating of legend items once the properties of related Series change
 */
export declare class Legend extends Component {
    /**
     * Defines the type of the data fields.
     *
     * @ignore Exclude from docs
     * @type {ILegendDataFields}
     */
    _dataFields: ILegendDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ILegendProperties}
     */
    _properties: ILegendProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ILegendAdapters}
     */
    _adapter: ILegendAdapters;
    /**
     * Defines available events.
     *
     * @type {ILegendEvents}
     * @ignore Exclude from docs
     */
    _events: ILegendEvents;
    /**
     * Defines data item type.
     *
     * @ignore Exclude from docs
     * @type {LegendDataItem<DataItem, IDataItemEvents>}
     */
    _dataItem: LegendDataItem;
    /**
     * List of legend Item containers. Legend item containers contain marker, title label and value label.
     *
     * @type {ListTemplate<Container>}
     */
    itemContainers: ListTemplate<Container>;
    /**
     * List of legend item labels.
     *
     * @type {ListTemplate<Label>}
     */
    labels: ListTemplate<Label>;
    /**
     * List of legend item markers.
     *
     * @type {ListTemplate<Container>}
     */
    markers: ListTemplate<Container>;
    /**
     * List of legend item value labels.
     *
     * @type {ListTemplate<Label>}
     */
    valueLabels: ListTemplate<Label>;
    /**
     * Currently focused legend item (for toggling via keyboard)
     *
     * @type {this["_dataItem"]}
     */
    focusedItem: Optional<this["_dataItem"]>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    protected applyInternalDefaults(): void;
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {LegendDataItem} Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * [validateDataElement description]
     *
     * @ignore Exclude from docs
     * @param {LegendDataItem} dataItem Data item
     * @todo Description
     * @todo Figure out how to update appearance of legend item without losing focus
     * @todo Update legend marker appearance as apperance of related series changes
     */
    validateDataElement(dataItem: this["_dataItem"]): void;
    /**
     * @return {LegendPosition} Position
     */
    /**
     * Position of the legend.
     *
     * Options: "left", "right", "top", "bottom" (default), or "absolute".
     *
     * @default "bottom"
     * @param {LegendPosition}  value  Position
     */
    position: LegendPosition;
    /**
     * @return {boolean} Use default marker?
     */
    /**
     * Should legend try to mirror the look of the related item when building
     * the marker for legend item?
     *
     * If set to `true` it will try to make the marker look like its related
     * item.
     *
     * E.g. if an item is for a Line Series, it will display a line of the
     * same thickness, color, and will use the same bullets if series have them.
     *
     * @default false
     * @param {boolean} value Use default marker?
     */
    useDefaultMarker: boolean;
    /**
     * Toggles a legend item.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]} item Legend item
     * @todo Maybe do it with togglable instead
     */
    toggleDataItem(item: this["_dataItem"]): void;
    /**
     * Override preloader method so that legend does not accidentally show its
     * own preloader.
     *
     * @ignore Exclude from docs
     * @return {Preloader} Always `undefined`
     */
    readonly preloader: Optional<Preloader>;
}
