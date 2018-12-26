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
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents, AMEvent } from "./Sprite";
import { SpriteState } from "./SpriteState";
import { Animation } from "./utils/Animation";
import { List, IListEvents } from "./utils/List";
import { VerticalAlign } from "./defs/VerticalAlign";
import { IDisposer } from "./utils/Disposer";
import { Dictionary } from "./utils/Dictionary";
import { Align } from "./defs/Align";
import { IPoint } from "./defs/IPoint";
import { Preloader } from "./elements/Preloader";
import { DataItem } from "./DataItem";
import { Optional } from "./utils/Type";
import { Paper } from "./rendering/Paper";
import * as $type from "./utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines available font weights.
 *
 * @type {string}
 */
export declare type FontWeight = "normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
/**
 * Defines available text decorations.
 *
 * @type {string}
 */
export declare type TextDecoration = "none" | "underline" | "overline" | "line-through" | "blink";
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
export declare type ContainerLayout = "absolute" | "vertical" | "horizontal" | "grid" | "none";
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
    /**
     * Default font weight.
     *
     * @default "normal"
     * @type {FontWeight}
     */
    fontWeight?: FontWeight;
    /**
     * Font size for the text.
     *
     * @type {number}
     */
    fontSize?: number;
    /**
     * Font family for the text.
     *
     * @type {string}
     */
    fontFamily?: string;
    /**
     * Default font decoration.
     *
     * @default "none"
     * @type {TextDecoration}
     */
    textDecoration?: TextDecoration;
    /**
     * Horizontal alignment of Container's items.
     *
     * @type {Optional<Align>}
     */
    contentAlign?: Align;
    /**
     * Vertical alignment of Container's items.
     *
     * @ignore Exclude from docs
     * @type {Optional<VerticalAlign>}
     */
    contentValign?: VerticalAlign;
    /**
     * If set to `true`, all columns of the container with layout type "grid"
     * will be equally sized.
     *
     * @default false
     * @type {boolean}
     */
    fixedWidthGrid?: boolean;
    /**
     * Maximum number of columns (when using `"grid"` layout).
     *
     * @type {boolean}
     */
    maxColumns?: boolean;
    /**
     * If set to `true`, the children of the container will be drawn in reverse
     * order.
     *
     * @default false
     * @type {boolean}
     */
    reverseOrder?: boolean;
    /**
     * Specifies if, when state is applied on this container, the same state
     * should be applied to container's children as well as `background`.
     *
     * @default false
     * @type {boolean}
     */
    setStateOnChildren?: boolean;
}
/**
 * Defines events for the [[Container]]
 */
export interface IContainerEvents extends ISpriteEvents {
    /**
     * Invoked when a child Sprite is added to Container.
     */
    childadded: {
        newValue: Sprite;
    };
    /**
     * Invoked when a child Sprite is removed from
     */
    childremoved: {
        oldValue: Sprite;
    };
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
     */
    _properties: IContainerProperties;
    /**
     * Defines available adapters.
     *
     * @type {IContainerAdapters}
     */
    _adapter: IContainerAdapters;
    /**
     * Defines available events.
     *
     * @type {IContainerEvents}
     */
    _events: IContainerEvents;
    /**
     * Container children. (sorted by layout)
     *
     * @ignore Exclude from docs
     * @type {List<Sprite>}
     */
    protected _childrenByLayout: Sprite[];
    /**
     * Available width (px).
     *
     * @ignore Exclude from docs
     * @type {Optional<number>}
     */
    protected _availableWidth: $type.Optional<number>;
    /**
     * Available height (px).
     *
     * @ignore Exclude from docs
     * @type {Optional<number>}
     */
    protected _availableHeight: $type.Optional<number>;
    /**
     * Container's child elements. (sorded by their `zIndex`)
     *
     * @ignore Exclude from docs
     * @type {Optional<List<Sprite>>}
     */
    protected _children: $type.Optional<List<Sprite>>;
    /**
     * Container's disposers for its child elements.
     *
     * @ignore Exclude from docs
     * @type {Dictionary<string, IDisposer>}
     */
    protected _childrenDisposers: Dictionary<string, IDisposer>;
    /**
     * A [[Sprite]] instance to use as Container's background.
     *
     * @todo Make it protected
     * @type {Sprite}
     */
    _background: Sprite;
    /**
     * A reference to a [[Preloader]] element to show when Container is building
     * itself.
     *
     * @ignore Exclude from docs
     * @type {Optional<Preloader>}
     */
    protected _preloader: $type.Optional<Preloader>;
    /**
     * Indicates if this container contains any focused elements, including
     * itself.
     *
     * @type {boolean}
     */
    hasFocused: boolean;
    /**
     * An array of references to elements the state should be set, when it is set
     * on this element.
     *
     * @type {Sprite[]}
     */
    setStateOnSprites: Sprite[];
    layoutInvalid: boolean;
    protected _absoluteWidth: number;
    protected _absoluteHeight: number;
    /**
     * Width (in pixels) of the actual content in the Container.
     *
     * Please note that it might be bigger than width of the Container.
     *
     * @readonly
     * @type {number}
     */
    contentWidth: number;
    /**
     * Height (in pixels) of the actual content in the Container.
     *
     * Please note that it might be bigger than height of the Container.
     *
     * @readonly
     * @type {number}
     */
    contentHeight: number;
    /**
     * An array of child Sprites that should be ready before this object can
     * fire a "ready" event.
     */
    protected _shouldBeReady: Sprite[];
    /**
     * Constructor
     */
    constructor();
    /**
     * Handles adding of a new child into `children`. Adding new children might
     * affect the whole layout so it needs to be revalidated.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Sprite>["inserted"]} event Event object
     * @todo Throw an exception on adding a disposed object. Of course it's better NOT TO add disposed objects, so that what we should focus on.
     */
    handleChildAdded(event: IListEvents<Sprite>["inserted"]): void;
    /**
     * @ignore
     */
    processChild(child: Sprite): void;
    /**
     * @ignore
     */
    protected sortAndAdd(): void;
    /**
     * Handles child removal. Changing size of the child may change the
     * whole layout of the Container, hence layout needs to be invalidated.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Sprite>["removed"]} event Event object
     */
    handleChildRemoved(event: IListEvents<Sprite>["removed"]): void;
    /**
     * Handles child transformation. Changing size of the child may change the
     * whole layout of the Container, hence layout needs to be invalidated.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["transformed"]} event Event object
     */
    handleChildTransform(event: AMEvent<Sprite, ISpriteEvents>["transformed"] | AMEvent<Sprite, ISpriteEvents>["sizechanged"]): void;
    /**
     * Invalidates Container's layout, causing it to be re-evaluated again.
     *
     * @ignore Exclude from docs
     */
    invalidateLayout(): void;
    /**
     * Invalidates element.
     *
     * Object will be redrawn during the next update cycle.
     *
     * Please note that in most cases elements will auto-invalidate when needed. If
     * everything works, DO NOT use this method. Use it only if some changes do
     * not take otherwise.
     */
    invalidate(): void;
    /**
     * Invalidates the whole element, including layout AND all its child
     * elements.
     *
     * As this will essentially force all elements to redraw, use only if
     * absolutely necessary.
     */
    deepInvalidate(): void;
    /**
     * Returns a list of the child [[Sprite]] elements contained in this
     * Container.
     *
     * @return {List<Sprite>} List of child elements (Sprites)
     */
    readonly children: List<Sprite>;
    /**
     * @return {Optional<number>} Width (px)
     */
    /**
     * Minimum width (px) for the Container. A container will not
     * auto-shrink beyond this value, even if child elements are smaller.
     *
     * @param {Optional<number>}  value  Width (px)
     */
    minWidth: Optional<number>;
    /**
     * @return {Optional<number>} Height (px)
     */
    /**
     * Minimum height (px) for the Container. A container will not
     * auto-shrink beyond this value, even if child elements are smaller.
     *
     * @param {Optional<number>}  value  Height (px)
     */
    minHeight: Optional<number>;
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
     */
    sortChildren(): void;
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
     */
    protected addChildren(): void;
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
     * Handles the situation where parent element is resized.
     *
     * @ignore Exclude from docs
     */
    handleGlobalScale(): void;
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
     * Positions element according its center settings.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    updateCenter(): void;
    /**
     * Update the background to fit into specific dimensions.
     *
     * @ignore Exclude from docs
     * @todo Make it protected?
     */
    updateBackground(): void;
    /**
     * Returns widths of all columns in a horizontal Container layout.
     *
     * @ignore Exclude from docs
     * @param  {number}    columnCount   Number of columns
     * @param  {number}    maxCellWidth  Maximum width of one grid cell
     * @return {number[]}                An array of column widths
     */
    getColumnWidth(children: Sprite[], columnCount: number, maxCellWidth: number): number[];
    /**
     * @return {ContainerLayout} Layout
     */
    /**
     * Container layout.
     *
     * Options: "absolute" (default), "vertical", "horizontal", "grid", "none". "none" is quite the same as "absolute" - the objects will
     * be positioned at their x, y coordinates, the difference is that with "absolute" you can still use align/valign for children and with "none" you can not.
     * Use "none" as much as you can as it's most cpu-saving layout.
     *
     * @default "absolute"
     * @param {ContainerLayout} value Layout
     */
    layout: ContainerLayout;
    /**
     * @return {VerticalAlign} Vertical alignment
     */
    /**
     * Vertical alignment of the elements for the vertical Container.
     *
     * This is used when Container is larger than the height of all its children.
     *
     * @param {VerticalAlign} value vertical alignment
     */
    contentValign: VerticalAlign;
    /**
     * @return {Align} Horizontal alignment
     */
    /**
     * Horizontal alignment of the elements for the horizontal Container.
     *
     * This is used when Container is larger than the height of all its children.
     *
     * @param {Align}  value  Horizontal alignment
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
     * @return {Optional<number>} Should use fixed width grid?
     */
    /**
     * Maximum number of columns (when using `"grid"` layout).
     *
     * @param {Optional<number>}  value  Should use fixed width grid?
     */
    maxColumns: Optional<number>;
    /**
     * @return {Optional<boolean>} Reverse children?
     */
    /**
     * If set to `true`, the children of the container will be drawn in reverse
     * order.
     *
     * @default false
     * @param {Optional<boolean>}  value  Reverse children?
     */
    reverseOrder: Optional<boolean>;
    /**
     * @return {boolean} Set state on children
     */
    /**
     * Specifies if, when state is applied on this container, the same state
     * should be applied to container's children as well as `background`.
     *
     * @default false
     * @param {boolean}  value  Set state on children
     */
    setStateOnChildren: boolean;
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
     * @param {this}  source  Source Container to copy from
     */
    copyFrom(source: this): void;
    /**
     * @return {Optional<Preloader>} Preloader instance
     */
    /**
     * A [[Preloader]] instance to be used when Container is busy.
     *
     * @param {Optional<Preloader>}  preloader  Preloader instance
     */
    preloader: $type.Optional<Preloader>;
    /**
     * Sets [[Paper]] instance to use to draw elements.
     * @ignore
     * @param {Paper} paper Paper
     * @return {boolean} true if paper was changed, false, if it's the same
     */
    setPaper(paper: Paper): boolean;
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
    /**
     * @return {any} Font family
     */
    /**
     * Font family to be used for the text.
     *
     * Parts of the text may override this setting using in-line formatting.
     *
     * @param {string} value Font family value
     */
    fontFamily: string;
    /**
     * @return {any} Font size
     */
    /**
     * Font size to be used for the text. The size can either be numeric, in
     * pixels, or other measurements.
     *
     * Parts of the text may override this setting using in-line formatting.
     *
     * @param {any} value Font size value
     */
    fontSize: any;
    /**
     * When fontSize of fontFamily changes we need to hard-invalidate all Labels of this container to position them properly.
     */
    invalidateLabels(): void;
    /**
     * @return {FontWeight} Font weight
     */
    /**
     * Font weight to use for text.
     *
     * Parts of the text may override this setting using in-line formatting.
     *
     * @param {FontWeight} value Font weight
     */
    fontWeight: FontWeight;
    /**
     * @return {TextDecoration} Decoration
     */
    /**
     * A text decoration to use for text.
     *
     * Parts of the text may override this setting using in-line formatting.
     *
     * @param {TextDecoration}  value  Decoration
     */
    textDecoration: TextDecoration;
    /**
     * Disposes (destroys) the element and all its children.
     */
    dispose(): void;
    /**
     * Applies a [[SpriteState]] on this element.
     *
     * The first parameter can either be a name of the state or a [[SpriteState]]
     * instance.
     *
     * When run, this method will apply SVG properties defined in a
     * [[SpriteState]], but only those that are relevant to this particular
     * element, that is are listed in its respective `properties` array.
     *
     * @see {@link SpriteState}
     * @param {string | SpriteState} value               A state - name key or instance
     * @param {number}               transitionDuration  Duration of the transition between current and new state
     * @param {number) => number}    easing              An easing function
     */
    setState(value: string | SpriteState<this["_properties"], this["_adapter"]>, transitionDuration?: number, easing?: (value: number) => number): $type.Optional<Animation>;
    protected setActive(value: boolean): void;
    /**
     * Dispatches ready event. Dispatches when all children are ready.
     */
    dispatchReady(): void;
}
