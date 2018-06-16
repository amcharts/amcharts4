import { Adapter } from "../utils/Adapter";
import { BaseObject } from "../Base";
import { Sprite } from "../Sprite";
import { InteractionObject } from "../interaction/InteractionObject";
import { Percent } from "../utils/Percent";
import { Align } from "../defs/Align";
import { VerticalAlign } from "../defs/VerticalAlign";
import { IPoint } from "../defs/IPoint";
/**
 * Represents a list of available adapters for Export.
 */
export interface IPopupAdapters {
    /**
     * Applied to the class prefixes.
     *
     * @type {string}
     */
    classPrefix: string;
    /**
     * Applied to popup content before it is shown.
     * @type {string}
     */
    content: string;
    /**
     * Applied to popup title before it is shown.
     * @type {string}
     */
    title: string;
    /**
     * Applied to the screen reader title.
     * @type {string}
     */
    readerTitle: string;
    /**
     * Applied to default `defaultStyles` property before it is retrieved.
     *
     * @type {boolean}
     */
    defaultStyles: boolean;
    /**
     * Applied to default `showCurtain` property before it is retrieved.
     *
     * @type {boolean}
     */
    showCurtain: boolean;
    /**
     * Applied to default `draggable` property before it is retrieved.
     *
     * @type {boolean}
     */
    draggable: boolean;
    /**
     * Applied to horizontal alignement of the popup.
     *
     * @type {Align}
     */
    align: Align;
    /**
     * Applied to vertical alignement of the popup.
     *
     * @type {VerticalAlign}
     */
    verticalAlign: VerticalAlign;
    /**
     * Appliet to `left` position value.
     *
     * @type {number | Percent}
     */
    left: number | Percent;
    /**
     * Appliet to `right` position value.
     *
     * @type {number | Percent}
     */
    right: number | Percent;
    /**
     * Appliet to `top` position value.
     *
     * @type {number | Percent}
     */
    top: number | Percent;
    /**
     * Appliet to `bottom` position value.
     *
     * @type {number | Percent}
     */
    bottom: number | Percent;
    /**
     * Applied to class names list that are added ass `class` for various popup
     * elements.
     */
    classNames: {
        wrapperClass: string;
        titleClass: string;
        contentClass: string;
        curtainClass: string;
        closeClass: string;
    };
}
/**
 * Shows an HTML popup which covers window or a chart area.
 *
 * @todo Positioning over whole window
 */
export declare class Popup extends BaseObject {
    /**
     * Adapter.
     *
     * @type {Adapter<Popup, IPopupAdapters>}
     */
    adapter: Adapter<Popup, IPopupAdapters>;
    /**
     * A reference to an HTML element to be used for container. If not set, popup
     * will cover the whole window.
     *
     * @type {HTMLElement}
     */
    container: HTMLElement | Document;
    /**
     * A parent element this Popup belongs to.
     *
     * @type {Sprite}
     */
    sprite: Sprite;
    /**
     * Holds references to various HTML elements, Popup consists of.
     */
    protected _elements: {
        wrapper?: HTMLElement;
        title?: HTMLElement;
        content?: HTMLElement;
        curtain?: HTMLElement;
    };
    /**
     * Holdes Interaction objects for various Popup's elements.
     */
    protected _IOs: {
        wrapper?: InteractionObject;
        content?: InteractionObject;
        close?: InteractionObject;
        curtain?: InteractionObject;
    };
    /**
     * Contents of popup window.
     *
     * @type {string}
     */
    protected _content: string;
    /**
     * Title of the popup window.
     *
     * @type {string}
     */
    protected _title: string;
    /**
     * Prefix to apply to class names for popup elements.
     *
     * @type {string}
     */
    protected _classPrefix: string;
    /**
     * If set to `true` [[Popup]] will use default styles.
     *
     * @type {boolean}
     */
    protected _defaultStyles: boolean;
    /**
     * If set to `true` [[Popup]] will dim out all chart content behind it by
     * showing a semi-transparent fill. (curtain)
     *
     * @type {boolean}
     */
    protected _showCurtain: boolean;
    /**
     * Indicates whether popup can be dragged.
     *
     * @type {boolean}
     */
    protected _draggable: boolean;
    /**
     * Horizontal position of the content window.
     *
     * @type {Align}
     */
    protected _align: Align;
    /**
     * Vertical position of the content window.
     *
     * @type {VerticalAlign}
     */
    protected _verticalAlign: VerticalAlign;
    /**
     * Shift in position of the element. (used for dragging)
     *
     * @type {number}
     */
    protected _shift: IPoint;
    /**
     * Temporary shift in position of the element. (used for dragging)
     *
     * @type {number}
     */
    protected _tempShift: IPoint;
    /**
     * "left" position of the popup content.
     *
     * @type {number | Percent}
     */
    protected _left: number | Percent;
    /**
     * "right" position of the popup content.
     *
     * @type {number | Percent}
     */
    protected _right: number | Percent;
    /**
     * "top" position of the popup content.
     *
     * @type {number | Percent}
     */
    protected _top: number | Percent;
    /**
     * "bottom" position of the popup content.
     *
     * @type {number | Percent}
     */
    protected _bottom: number | Percent;
    /**
     * A title for screen readers. It is very highly recommended to set that title
     * so that people using screen reader tools can get an immediate summary of
     * the information in the popup.
     *
     * @type {string}
     */
    readerTitle: string;
    /**
     * Is popup closable?
     *
     * @type {boolean}
     */
    private _closable;
    /**
     * Was CSS already loaded?
     *
     * @type {boolean}
     */
    private _cssLoaded;
    /**
     * Used to log original value of `interactionsEnabled` so that it can be restored
     * after temporarily disabling it.
     *
     * @type {boolean}
     */
    private _spriteInteractionsEnabled;
    /**
     * Identifies if this object is a "template" and should not be treated as
     * real object that is drawn or actually used in the chart.
     *
     * @type {boolean}
     */
    isTemplate: boolean;
    /**
     * Indicates if the element was already sized and should not be measured for
     * sized again, saving some precious resources.
     *
     * @type {boolean}
     */
    private _sized;
    /**
     * Cached bounding rectangle info.
     *
     * @type {DOMRect | ClientRect}
     */
    private _bbox;
    /**
     * Constructor
     */
    constructor();
    /**
     * Shows popup window.
     */
    show(): void;
    /**
     * Hides popup window.
     */
    hide(): void;
    /**
     * Destroy (dispose) popup.
     */
    dispose(): void;
    /**
     * Positions content element in the center of popup based on its actual size.
     *
     * @ignore Exclude from docs
     */
    positionElement(forceResize?: boolean): void;
    protected setupDragging(): void;
    protected toStyle(value: number | Percent): string;
    /**
     * A prefix that is applied to class names of various popup elements.
     *
     * @return {string} Class name prefix
     */
    /**
     * @param {string} value Class name prefix
     */
    classPrefix: string;
    /**
     * @return {string} Popup content
     */
    /**
     * Popup content.
     *
     * Popup content can be any valid HTML, including CSS.
     *
     * @param {string} value Popup content
     */
    content: string;
    protected getClassNames(): {
        wrapperClass: string;
        titleClass: string;
        contentClass: string;
        curtainClass: string;
        closeClass: string;
    };
    /**
     * Creates content element.
     */
    protected createContentElement(): void;
    /**
     * @return {string} Popup content
     */
    /**
     * Popup ttile.
     *
     * Popup title can be any valid HTML, including CSS.
     * @param {string} value Popup content
     */
    title: string;
    /**
     * @return {boolean} Closable?
     */
    /**
     * Is popup closable?
     *
     * If it is, it can be closed in a number of ways, e.g. by hitting ESC key,
     * clicking curtain, or clicking the close button.
     *
     * If it is not closable, the only way to close it is via `hide()` call.
     *
     * @param {boolean} value Closable?
     */
    closable: boolean;
    /**
     * @return {boolean} Use default CSS?
     */
    /**
     * Should popup use default CSS?
     *
     * If default CSS is disabled, an external CSS should handle the look of the
     * popup, since it will look quite out of place otherwise.
     *
     * @default true
     * @param {string} Use default CSS?
     */
    defaultStyles: boolean;
    /**
     * @return {boolean} Show curtain?
     */
    /**
     * Should popup use dim out all content behind it?
     *
     * @default false
     * @param {boolean} Show curtain?
     */
    showCurtain: boolean;
    /**
     * Creates curtain element.
     */
    protected createCurtainElement(): void;
    /**
     * @return {boolean} Show curtain?
     */
    /**
     * Can the popup be dragged with a pointer?
     *
     * @default false
     * @param {boolean} Show curtain?
     */
    draggable: boolean;
    /**
     * @return {boolean} Horizontal position
     */
    /**
     * Horizontal positioning of the content window.
     *
     * Available options: "left", "center" (default), "right", and "none".
     *
     * @default "center"
     * @param {Align} Horizontal position
     */
    align: Align;
    /**
     * @return {boolean} Vertical position
     */
    /**
     * Vertical positioning of the content window.
     *
     * Available options: "top", "middle" (default), "bottom", and "none".
     *
     * @default "middle"
     * @param {VerticalAlign} Vertical position
     */
    verticalAlign: VerticalAlign;
    /**
     * @return {boolean} Left
     */
    /**
     * "left" coordinate of a non-aligned (`align = "none"`) popup.
     *
     * Can be either absolute pixel value, or relative (`Percent`).
     *
     * Setting this property will automatically set `align` to "none".
     *
     * NOTE: The position is relative to the chart container.
     *
     * @param {number | Percent} Left
     */
    left: number | Percent;
    /**
     * @return {boolean} Right
     */
    /**
     * "right" coordinate of a non-aligned (`align = "none"`) popup.
     *
     * Can be either absolute pixel value, or relative (`Percent`).
     *
     * Setting this property will automatically set `align` to "none".
     *
     * NOTE: The position is relative to the chart container.
     *
     * @param {number | Percent} Right
     */
    right: number | Percent;
    /**
     * @return {boolean} Top
     */
    /**
     * "top" coordinate of a non-aligned (`verticalAlign = "none"`) popup.
     *
     * Can be either absolute pixel value, or relative (`Percent`).
     *
     * Setting this property will automatically set `verticalAlign` to "none".
     *
     * NOTE: The position is relative to the chart container.
     *
     * @param {number | Percent} Top
     */
    top: number | Percent;
    /**
     * @return {boolean} Bottom
     */
    /**
     * "bottom" coordinate of a non-aligned (`verticalAlign = "none"`) popup.
     *
     * Can be either absolute pixel value, or relative (`Percent`).
     *
     * Setting this property will automatically set `verticalAlign` to "none".
     *
     * NOTE: The position is relative to the chart container.
     *
     * @param {number | Percent} Bottom
     */
    bottom: number | Percent;
    /**
     * Loads popup CSS.
     *
     * @ignore Exclude from docs
     */
    loadDefaultCSS(): void;
    /**
     * If popup is closable, this method adds various events to popup elements.
     */
    protected _applyEvents(): void;
    /**
     * Disables interactivity on parent chart.
     */
    protected _disablePointers(): void;
    /**
     * Releases temporarily disabled pointers on parent chart.
     */
    protected _releasePointers(): void;
    /**
     * Copies all properties and related data from different element.
     *
     * @param {this} object Source element
     */
    copyFrom(source: this): void;
}
