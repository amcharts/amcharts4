/**
 * Functionality for drawing simple NavigationBar.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Component, IComponentProperties, IComponentAdapters, IComponentEvents, IComponentDataFields } from "../../core/Component";
import { Sprite } from "../../core/Sprite";
import { DataItem } from "../../core/DataItem";
import { ListTemplate } from "../../core/utils/List";
import { TextLink } from "../../core/elements/TextLink";
import { Triangle } from "../../core/elements/Triangle";
import * as $iter from "../../core/utils/Iterator";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[NavigationBar]].
 *
 * @see {@link DataItem}
 */
export declare class NavigationBarDataItem extends DataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     *
     * @type {NavigationBar}
     */
    _component: NavigationBar;
    /**
     * Constructor
     */
    constructor();
    /**
     * @return {string} Name
     */
    /**
     * Name of the navigation bar item.
     *
     * @param {string}  value  Name
     */
    name: string;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[NavigationBar]].
 */
export interface INavigationBarDataFields extends IComponentDataFields {
    /**
     * Name of nav var item.
     *
     * @type {string}
     */
    name?: string;
}
/**
 * Defines properties for [[NavigationBar]].
 */
export interface INavigationBarProperties extends IComponentProperties {
}
/**
 * Defines events for [[NavigationBar]].
 */
export interface INavigationBarEvents extends IComponentEvents {
}
/**
 * Defines adapters for [[NavigationBar]].
 *
 * @see {@link Adapter}
 */
export interface INavigationBarAdapters extends IComponentAdapters, INavigationBarProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * NavigationBar class can be used to create a multi-level breadcrumb-style
 * navigation control.
 *
 * @see {@link INavigationBarEvents} for a list of available events
 * @see {@link INavigationBarAdapters} for a list of available Adapters
 * @todo Implement better
 * @important
 */
export declare class NavigationBar extends Component {
    /**
     * Defines data fields.
     *
     * @ignore Exclude from docs
     * @type {NavigationBarDataFIelds}
     */
    _dataFields: INavigationBarDataFields;
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {INavigationBarProperties}
     */
    _properties: INavigationBarProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {INavigationBarAdapters}
     */
    _adapter: INavigationBarAdapters;
    /**
     * Defines available events.
     *
     * @type {INavigationBarEvents}
     * @ignore Exclude from docs
     */
    _events: INavigationBarEvents;
    /**
     * A list of breadcrumbs (links) in the nav bar.
     *
     * @type {ListTemplate<TextLink>}
     */
    links: ListTemplate<TextLink>;
    /**
     * [_linksIterator description]
     *
     * @todo Description
     * @type {.ListIterator<TextLink>}
     */
    protected _linksIterator: $iter.ListIterator<TextLink>;
    /**
     * [_separatorsIterator description]
     *
     * @todo Description
     * @type {.ListIterator<Sprite>}
     */
    protected _separatorsIterator: $iter.ListIterator<Sprite>;
    /**
     * A reference to the link which is currently active.
     *
     * @type {TextLink}
     */
    activeLink: TextLink;
    /**
     * A list of elements used as nav bar item separators.
     *
     * @type {ListTemplate<Triangle>}
     */
    separators: ListTemplate<Triangle>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Completely redraws the navigation bar.
     *
     * @ignore Exclude from docs
     */
    validateDataElements(): void;
    /**
     * Creates a visual element for a data item (nav item).
     *
     * @ignore Exclude from docs
     * @param {NavigationBarDataItem}  dataItem  Data item
     */
    validateDataElement(dataItem: NavigationBarDataItem): void;
}
