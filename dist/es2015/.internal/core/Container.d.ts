/**
 * Container module
 * @todo Needs description
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "./Sprite";
import { List, IListEvents, ListGrouper } from "./utils/List";
import { VerticalAlign } from "./defs/VerticalAlign";
import { Align } from "./defs/Align";
import { IPoint } from "./defs/IPoint";
import { Preloader } from "./elements/Preloader";
import { DataItem } from "./DataItem";
import { Optional } from "./utils/Type";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines available [[Container]] layout types
 * @type {string}
 */
export declare type ContainerLayout = "absolute" | "vertical" | "horizontal" | "grid";
/**
 * Defines properties for [[Container]]
 */
export interface IContainerProperties extends ISpriteProperties {
    /**
     * Container layout.
     *
     * Options: "absolute" (default), "vertical", "horizontal", or "grid".
     *
     * @default "absolute"
     * @type {ContainerLayout}
     */
    layout?: ContainerLayout;
}
/**
 * Defines events for the [[Container]]
 */
export interface IContainerEvents extends ISpriteEvents {
}
/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IContainerAdapters extends ISpriteAdapters, IContainerProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Container can contain multiple sprites and arrange them in various layouts.
 *
 * @see {@link IContainerEvents} for a list of available events
 * @see {@link IContainerAdapters} for a list of available Adapters
 * @important
 */
export declare class Container extends Sprite {
    /**
     * Defines available properties.
     *
     * @type {IContainerProperties}
     * @ignore Exclude from docs
     */
    _properties: IContainerProperties;
    /**
     * Defines available adapters.
     *
     * @type {IContainerAdapters}
     * @ignore Exclude from docs
     */
    _adapter: IContainerAdapters;
    /**
     * Event dispacther..
     *
     * @type {SpriteEventDispatcher<AMEvent<Container, IContainerEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<Container, IContainerEvents>>;
    /**
     * Container children. (sorted by layout)
     *
     * @ignore Exclude from docs
     * @type {List<Sprite>}
     */
    protected _childrenByLayout: Sprite[];
    /**
     * [_zIndexGroups description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {ListGrouper<Sprite>}
     */
    protected _zIndexGroups: ListGrouper<Sprite>;
    /**
     * Available width. (px)
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _availableWidth: number;
    /**
     * Available height. (px)
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _availableHeight: number;
    /**
     * [_fixedWidthGrid description]
     *
     * @ignore Exclude from docs
     * @todo Description
     * @type {boolean}
     */
    protected _fixedWidthGrid: boolean;
    /**
     * Container's child elements. (sorded by their `zIndex`)
     *
     * @ignore Exclude from docs
     * @type {List<Sprite>}
     */
    protected _children: List<Sprite>;
    /**
     * Horizontal alignement of Container's items
     * @ignore Exclude from docs
     * @type {Align}
     */
    protected _contentAlign: Align;
    /**
     * Vertical alignement of Container's items.
     *
     * @ignore Exclude from docs
     * @type {VerticalAlign}
     */
    protected _contentValign: VerticalAlign;
    /**
     * A [[Sprite]] instance to use as Container's background.
     *
     * @ignore Exclude from docs
     * @todo Make it protected
     * @type {Sprite}
     */
    _background: Sprite;
    /**
     * A reference to a [[Preloader]] element to show when Container is building
     * itself.
     *
     * @ignore Exclude from docs
     * @type {Preloader}
     */
    protected _preloader: Preloader;
    /**
     * Indicates if this container contains any focused elements, including
     * itself.
     *
     * @type {boolean}
     */
    hasFocused: boolean;
    /**
     * Whether children of the container should be cloned when cloning this
     * Container.
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    cloneChildren: boolean;
    protected _containerOverflowX: number;
    protected _containerOverflowY: number;
    /**
     * Constructor
     */
    constructor();
    /**
     * Handles adding of a new child into `children`. Adding new children might
     * affect the whole layout so it needs to be revalidated.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Sprite>["insert"]} event Event object
     * @todo Throw an exception on adding a disposed object. Of course it's better NOT TO add disposed objects, so that what we should focus on.
     */
    handleChildAdded(event: IListEvents<Sprite>["insert"]): void;
    /**
     * Handles child removal. Changing size of the child may change the
     * whole layout of the Container, hence layout needs to be invalidated.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Sprite>["remove"]} event Event object
     */
    handleChildRemoved(event: IListEvents<Sprite>["remove"]): void;
    /**
     * Handles child transformation. Changing size of the child may change the
     * whole layout of the Container, hence layout needs to be invalidated.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["transformed"]} event Event object
     */
    handleChildTransform(event: AMEvent<Sprite, ISpriteEvents>["transformed"]): void;
    /**
     * Invalidates Container's layout, causing it to be re-evaluated again.
     *
     * @ignore Exclude from docs
     */
    invalidateLayout(): void;
    /**
     * Invalidates the whole element, including layout.
     *
     * @ignore Exclude from docs
     */
    invalidate(): void;
    /**
     * Invalidates the whole element, including layout AND all its child
     * elements.
     *
     * @ignore Exclude from docs
     */
    deepInvalidate(): void;
    /**
     * Appends `<defs>` section to the element. This section holds all the SVG
     * definitions for the element, such as filters.
     *
     * @ignore Exclude from docs
     */
    appendDefs(): void;
    /**
     * Returns a list of the child [[Sprite]] elements contained in this
     * Container.
     *
     * @return {List<Sprite>} List of child elements (Sprites)
     */
    readonly children: List<Sprite>;
    /**
     * Retruns current minimum width. (px)
     *
     * @return {Optional<number>} Width (px)
     */
    /**
     * Sets minimum width (px) for the Container. A container will not
     * auto-shrink beyond this value, even if child elements are smaller.
     *
     * @param {Optional<number>} value Width (px)
     */
    minWidth: Optional<number>;
    /**
     * Retruns current minimum height. (px)
     *
     * @return {Optional<number>} Height (px)
     */
    /**
     * Sets minimum height (px) for the Container. A container will not
     * auto-shrink beyond this value, even if child elements are smaller.
     * @param {Optional<number>} value Height (px)
     */
    minHeight: Optional<number>;
    /**
     * Retruns current maximum width. (px)
     *
     * @return {Optional<number>} Width (px)
     */
    /**
     * Sets maximum width (px) for the Container. A container will not
     * grow beyond this value, even if child elements do not fit.
     *
     * @param {Optional<number>} value Width (px)
     */
    maxWidth: number;
    /**
     * Retruns current maximum height. (px)
     *
     * @return {Optional<number>} Height (px)
     */
    /**
     * Sets maximum height (px) for the Container. A container will not
     * grow beyond this value, even if child elements do not fit.
     *
     * @param {Optional<number>} value Height (px)
     */
    maxHeight: number;
    /**
     * Initiates drawing of this element.
     *
     * @ignore Exclude from docs
     */
    draw(): void;
    /**
     * Overrides the original `removeElement` so that Container's actual element
     * is not removed. We do not need to remove element of a Container.
     *
     * We do this because remove element each time will fail the `getBBox`.
     *
     * @ignore Exclude from docs
     */
    protected removeElement(): void;
    /**
     * Sorts Container's children: the ones with variable width and height are
     * put at the end of the list (depending on layout type), so that fixed-width
     * ones can be drawn first.
     *
     * @ignore Exclude from docs
     * @param {Sprite[]}  children  Container's children (elements)
     */
    sortChildren(children?: Sprite[]): void;
    /**
     * Calculates relative sizes for all Container's children.
     *
     * @ignore Exclude from docs
     * @todo Make it protected?
     */
    calculateRelativeSize(): void;
    /**
     * Adds all children to Container's SVG element.
     *
     * @ignore Exclude from docs
     * @todo Make it protected?
     */
    addChildren(): void;
    /**
     * Creates a new element of specific type and assigns as a child to the
     * Container.
     *
     * @param  {T extends Sprite}  Class type for the new element
     * @return {T}                 New element
     */
    createChild<T extends Sprite>(classType: {
        new (): T;
    }): T;
    /**
     * Removes all Container's children without actually destroying them.
     *
     * To destroy children use `disposeChildren()` instead.
     */
    removeChildren(): void;
    /**
     * Removes and destroys all Container's children.
     *
     * To remove children from Container without destroying them, use
     * `removeChildren()`.
     */
    disposeChildren(): void;
    /**
     * @return {Sprite} Background element
     */
    /**
     * An element to use as container background.
     *
     * @param {Sprite}  background  Background element
     */
    background: this["_background"];
    /**
     * Creates and returns a [[Rectangle]] to use as a background for Container.
     *
     * @ignore Exclude from docs
     * @return {this} Background Rectangle element
     */
    createBackground(): this["_background"];
    /**
     * Decorates background element with required properties.
     *
     * @ignore Exclude from docs
     */
    processBackground(): void;
    /**
     * Measures the size of container and informs its children of how much size
     * they can occupy, by setting their relative `maxWidth` and `maxHeight`
     * properties.
     *
     * @ignore Exclude from docs
     */
    validateLayout(): void;
    /**
     * Arranges children according to layout specs and available space / child
     * sizes.
     *
     * @ignore Exclude from docs
     */
    arrange(): void;
    /**
     * Update the background to fit into specific dimensions.
     *
     * @ignore Exclude from docs
     * @todo Make it protected?
     * @param {number} measuredWidth  Wdith (px)
     * @param {number} measuredHeight Height (px)
     */
    updateBackground(measuredWidth: number, measuredHeight: number): void;
    /**
     * Returns widths of all columns in a horizontal Container layout.
     *
     * @ignore Exclude from docs
     * @param  {number}    columnCount   Number of columns
     * @param  {number}    maxCellWidth  Maximum width of one grid cell
     * @return {number[]}                An array of column widths
     */
    getColumnWidth(columnCount: number, maxCellWidth: number): number[];
    /**
     * @return {ContainerLayout} Layout
     */
    /**
     * Container layout.
     *
     * Options: "absolute" (default), "vertical", "horizontal", or "grid".
     *
     * @default "absolute"
     * @param {ContainerLayout} value Layout
     */
    layout: ContainerLayout;
    /**
     * @return {VerticalAlign} Vertical alignement
     */
    /**
     * Vertical alignement of the elements for the vertical Container.
     *
     * This is used when Container is larger than the height of all its children.
     *
     * @param {VerticalAlign} value vertical alignement
     */
    contentValign: VerticalAlign;
    /**
     * @return {Align} Horizontal alignement
     */
    /**
     * Horizontal alignement of the elements for the horizontal Container.
     *
     * This is used when Container is larger than the height of all its children.
     *
     * @param {Align}  value  Horizontal alignement
     */
    contentAlign: Align;
    /**
     * @return {boolean} Should use fixed width grid?
     */
    /**
     * Controls if the grid of the Container should use fixed width. Fixed width
     * grid will divide available space to all its columns/rows equally, without
     * adapting to actual child sizes or size requirements.
     *
     * @default false
     * @param {boolean}  value  Should use fixed width grid?
     */
    fixedWidthGrid: boolean;
    /**
     * Checks if point is within bounds of a container.
     *
     * @param  {IPoint}   point  A coordinate to check
     * @return {boolean}         `true` if it fits within container
     */
    fitsToBounds(point: IPoint): boolean;
    /**
     * Copies all properties from different Container, including background
     * clone.
     *
     * @param {this}  source  Source COntainer to copy from
     */
    copyFrom(source: this): void;
    /**
     * Clones the Container, including all of its children.
     *
     * @return {this} New Container clone
     */
    clone(): this;
    /**
     * Creates (if necessary) and returns an instance of the [[Preloader]] to
     * show when Container is busy loading.
     *
     * @return {Preloader} Preloader instance
     */
    /**
     * Sets a [[Preloader]] instance to be used when COntainer is busy.
     *
     * @param {Preloader} preloader Preloader instance
     */
    preloader: Preloader;
    /**
     * Removes Container from the system-wide list of invalid Containers.
     *
     * @ignore Exclude from docs
     */
    protected removeFromInvalids(): void;
    /**
     * Sets a [[DataItem]] to be used as data for the Container.
     *
     * @todo Description
     * @param {DataItem} dataItem DataItem
     */
    protected setDataItem(dataItem: DataItem): void;
    /**
     * Measures the element.
     *
     * @ignore Exclude from docs
     */
    measureElement(): void;
    /**
     * Returns Tooltip X coordinate if it's set, or middle of the element.
     *
     * @ignore Exclude from docs
     * @return {number} X (px)
     */
    protected getTooltipX(): number;
    /**
     * Returns Tooltip Y coordinate if it's set, or middle of the element.
     *
     * @ignore Exclude from docs
     * @return {number} Y (px)
     */
    protected getTooltipY(): number;
}
