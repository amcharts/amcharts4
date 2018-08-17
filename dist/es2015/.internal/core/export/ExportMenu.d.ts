import { IExportOptions } from "./Export";
import { Adapter } from "../utils/Adapter";
import { List } from "../utils/List";
import { Align } from "../defs/Align";
import { VerticalAlign } from "../defs/VerticalAlign";
import { InteractionObject } from "../interaction/InteractionObject";
import { IDisposer, MutableValueDisposer } from "../utils/Disposer";
import { Language } from "../utils/Language";
import { Validatable } from "../utils/Validatable";
import { KeyboardKeys } from "../utils/Keyboard";
import * as $type from "../utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Export menu item interface.
 */
export interface IExportMenuItem {
    /**
     * Item type, usually an export format.
     *
     * @type {string}
     */
    type?: keyof IExportOptions;
    /**
     * Label to display in the menu.
     *
     * @type {string}
     */
    label?: string;
    /**
     * Export format. (optional)
     *
     * @type {string}
     */
    format?: string;
    /**
     * Menu item options.
     *
     * @see {@link IExportOptions}
     * @type {Object}
     */
    options?: IExportOptions[keyof IExportOptions];
    /**
     * Priority.
     *
     * The items in Export menu will be sorted by their priority in ascending
     * order.
     *
     * @ignore Exclude from docs (this feature is not yet implemented)
     * @type {number}
     */
    priority?: number;
    /**
     * An array of [[IExportMenuItem]] items, to construct a sub-menu out of.
     *
     * An Export menu can have any number of nesting levels.
     *
     * @type {Array<IExportMenuItem>}
     */
    menu?: Array<IExportMenuItem>;
    /**
     * If this is set to true, it means that this specific menu item is not
     * supported by the current client system.
     *
     * This is usually populated by [[Export]]'s `supported` Adapter.
     *
     * @see {@link IExportAdapters}
     * @type {boolean}
     */
    unsupported?: boolean;
    /**
     * An [[InteractionObject]] representation of the menu item.
     *
     * @type {InteractionObject}
     */
    interactions?: InteractionObject;
    /**
     * Holds list of parent menu items to this item.
     */
    ascendants?: List<IExportMenuItem>;
    /**
     * Holds timeout reference.
     *
     * Used to delay auto-closing of the menu when it is no longer hovered.
     *
     * @ignore Exclude from docs
     * @type {IDisposer}
     */
    closeTimeout?: IDisposer;
}
/**
 * Defines [[ExportMenu]] events.
 */
export interface IExportMenuEvents {
    /**
     * Invoked when menu item is clicked/tapped.
     */
    hit: {
        branch: IExportMenuItem;
        event: MouseEvent | TouchEvent;
    };
    /**
     * Invoked when menu item is hovered.
     */
    over: {
        branch: IExportMenuItem;
        event: MouseEvent | TouchEvent;
    };
    /**
     * Invoked when menu item is no longer hovered.
     */
    out: {
        branch: IExportMenuItem;
        event: MouseEvent | TouchEvent;
    };
    /**
     * Invoked when ENTER key is pressed when certain menu item is in focus.
     *
     * @type {KeyboardEvent}
     */
    enter: {
        branch: IExportMenuItem;
        event: KeyboardEvent;
    };
    /**
     * Invoked when menu branch is selected. (either by hover or keyboard)
     */
    branchselected: {
        branch: IExportMenuItem;
    };
    /**
     * Invoked when menu branch is unselected.
     */
    branchunselected: {
        branch: IExportMenuItem;
    };
    /**
     * Invoked when menu is closed.
     */
    closed: {};
}
/**
 * Represents a list of available adapters for Export
 */
export interface IExportMenuAdapters {
    items: {
        items: Array<IExportMenuItem>;
    };
    menuElement: {
        menuElement: HTMLElement;
    };
    branch: {
        branch: IExportMenuItem;
        level: number;
    };
    rederLabel: {
        label: string;
        branch: IExportMenuItem;
    };
    menuClass: {
        className: string;
        level: number;
    };
    itemClass: {
        className: string;
        level: number;
        type?: keyof IExportOptions;
    };
    labelClass: {
        className: string;
        level: number;
        type?: keyof IExportOptions;
    };
    menuTag: {
        tag: string;
    };
    itemTag: {
        tag: string;
    };
    labelTag: {
        tag: string;
    };
    align: {
        align: Align;
    };
    verticalAlign: {
        verticalAlign: VerticalAlign;
    };
    classPrefix: {
        classPrefix: string;
    };
    defaultStyles: {
        defaultStyles: boolean;
    };
    tabindex: {
        tabindex: number;
    };
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a menu for Export operations.
 *
 * To add an export menu to a chart, set this to a new instance of
 * [[ExportMenu]].
 *
 * ```TypeScript
 * chart.exporting.menu = new am4core.ExportMenu();
 * ```
 * ```JavaScript
 * chart.exporting.menu = new am4core.ExportMenu();
 * ```
 * ```JSON
 * {
 *   // ...
 *   "exporting": {
 *     "menu": {}
 *   }
 * }
 * ```
 * @important
 */
export declare class ExportMenu extends Validatable {
    /**
     * Defines available events.
     *
     * @type {IExportMenuEvents}
     * @ignore Exclude from docs
     */
    _events: IExportMenuEvents;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {IExportAdapters}
     */
    _adapter: IExportMenuAdapters;
    /**
     * An [[Adapter]].
     *
     * @type {Adapter<ExportMenu, IExportMenuAdapters>}
     */
    adapter: Adapter<ExportMenu, IExportMenuAdapters>;
    /**
     * How many milliseconds to hold menu/sub-menu open after it loses focus or
     * hover, before auto-closing it.
     *
     * @type {number}
     */
    closeDelay: number;
    /**
     * An instance of [[Language]].
     *
     * @ignore Exclude from docs
     * @type {MutableValueDisposer<Language>}
     */
    protected _language: MutableValueDisposer<Language>;
    /**
     * Reference to DOM element that holds Export menu.
     *
     * @ignore Exclude from docs
     * @type {Optional<HTMLElement>}
     */
    protected _container: $type.Optional<HTMLElement>;
    /**
     * Menu element.
     *
     * @ignore Exclude from docs
     * @type {Optional<HTMLElement>}
     */
    protected _element: $type.Optional<HTMLElement>;
    /**
     * Currently selected menu item.
     *
     * @ignore Exclude from docs
     * @type {Optional<IExportMenuItem>}
     */
    protected _currentSelection: $type.Optional<IExportMenuItem>;
    /**
     * What HTML tags to use to build menu.
     *
     * @ignore Exclude from docs
     * @type {string}
     */
    protected _menuTag: "ul" | "div";
    /**
     * Which tag to use to enclose individual menu items.
     *
     * @ignore Exclude from docs
     * @type {string}
     */
    protected _itemTag: "li" | "div";
    /**
     * Tag to wrap menu item labels in.
     *
     * @ignore Exclude from docs
     * @type {string}
     */
    protected _labelTag: "a";
    /**
     * Prefix for class names applied to menu elements.
     *
     * @ignore Exclude from docs
     * @type {string}
     */
    protected _classPrefix: string;
    /**
     * If set to `true` [[ExportMenu]] will load it's own external CSS when
     * instantiated.
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    protected _defaultStyles: boolean;
    /**
     * Horizontal positioning.
     *
     * @ignore Exclude from docs
     * @type {Align}
     */
    protected _align: Align;
    /**
     * Vertical positioning.
     *
     * @ignore Exclude from docs
     * @type {VerticalAlign}
     */
    protected _verticalAlign: VerticalAlign;
    /**
     * A tabindex to apply to Export Menu.
     *
     * @ignore Exclude from docs
     * @type {number}
     */
    protected _tabindex: number;
    /**
     * Whether next menu close event should be ignored.
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    protected _ignoreNextClose: boolean;
    /**
     * Default menu items.
     *
     * @ignore Exclude from docs
     * @type {Array<IExportMenuItem>}
     */
    protected _items: Array<IExportMenuItem>;
    /**
     * Constructor
     */
    constructor();
    /**
     * (Re)draws the Export menu.
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Draws the menu based on current items.
     *
     * Normally, there's no need to call this explicitly. The chart, if it has
     * export menu enabled, will automatically draw the menu.
     */
    draw(): void;
    /**
     * Creates a new branch in export menu. This function is recursive for
     * building multi-level menus.
     *
     * @ignore Exclude from docs
     * @param {HTMLElement}     container Container to put branch elements in
     * @param {IExportMenuItem} branch    Menu item
     * @param {number}          level     Current nesting level
     */
    protected drawBranch(container: HTMLElement, branch: IExportMenuItem, level: number): void;
    /**
     * Creates a menu element to hold its elements in. Usually it's an `<ul>`
     * tag.
     *
     * @ignore Exclude from docs
     * @param  {number}       level  Current nesting level
     * @return {HTMLElement}         HTML element reference
     */
    createMenuElement(level: number): HTMLElement;
    /**
     * Generates a class name for the menu element based on its nesting level.
     *
     * @ignore Exclude from docs
     * @param  {number}  level  Current nesting level
     * @return {string}         Class name(s)
     */
    getMenuItemClass(level: number): string;
    /**
     * Creates menu item. Usually `<li>` tag. Its label and sub-elements will go
     * into this element.
     *
     * @ignore Exclude from docs
     * @param  {number}       level  Current nesting level
     * @param  {string}       type   Type of the menu item
     * @return {HTMLElement}         HTML element reference
     */
    createItemElement(level: number, type?: keyof IExportOptions): HTMLElement;
    /**
     * Creates a "label" part of the menu item. It could be text or any HTML
     * content.
     *
     * @ignore Exclude from docs
     * @param  {number}       level  Current nesting level
     * @param  {string}       type   Type of the menu item
     * @return {HTMLElement}         An HTML Element
     */
    createLabelElement(level: number, type?: keyof IExportOptions): HTMLElement;
    /**
     * Destroys the menu and all its elements.
     */
    dispose(): void;
    /**
     * Checks whether menu item type is supposed to be clickable.
     *
     * @ignore Exclude from docs
     * @param  {string}   type  Menu item type
     * @return {boolean}        Is clickable?
     */
    typeClickable(type: keyof IExportOptions | undefined | null): type is keyof IExportOptions;
    /**
     * Checks whether menu item has any sub-items.
     *
     * @ignore Exclude from docs
     * @param  {IExportMenuItem}  branch  A menu item
     * @return {boolean}                  Has sub-items?
     */
    hasSubMenu(branch: IExportMenuItem): boolean;
    /**
     * Returns sub-items (if they exist).
     *
     * @ignore Exclude from docs
     * @param  {IExportMenuItem}                   branch  A menu item
     * @return {Optional<Array<IExportMenuItem>>}          Submenus
     */
    getSubMenu(branch: IExportMenuItem): $type.Optional<Array<IExportMenuItem>>;
    /**
     * Generates and returns an applicable label to be used for screen readers.
     *
     * @ignore Exclude from docs
     * @param  {IExportMenuItem}  item   A menu item instance
     * @param  {string}           label  Current label
     * @return {string}                  Reader text
     */
    getReaderLabel(branch: IExportMenuItem, label: string): string;
    /**
     * @return {HTMLElement} Container
     */
    /**
     * Getters and setters
     */
    /**
     * An HTML container to place the Menu in.
     *
     * A container must be an HTML element, because menu itself is HTML, and
     * cannot be placed into SVG.
     *
     * @param {Optional<HTMLElement>} container Reference to container element
     * @todo Check if menu is already build. If it is, just move it to a new container
     */
    container: $type.Optional<HTMLElement>;
    /**
     * @return {Array<IExportMenuItem>} Menu items
     */
    /**
     * A list of menu items. Can be nested.
     *
     * @param {Array<IExportMenuItem>}  items  Menu items
     */
    items: Array<IExportMenuItem>;
    /**
     * Sets main menu tag to place menu in.
     *
     * This also sets up how menu items are built.
     *
     * If you set this to "ul", menu items will be wrapped into `<li>` tags.
     *
     * If set to "div", menu items will be wrapped in `<div>` tags.
     *
     * @default "ul"
     * @param {"ul" | "div"} tag Tag to use for menu
     */
    tag: "ul" | "div";
    /**
     * Returns current menu tag.
     *
     * @ignore Exclude from docs
     * @return {string} Menu tag (item that contains sub-items)
     */
    readonly menuTag: string;
    /**
     * Returns tag to wrap items into.
     *
     * @ignore Exclude from docs
     * @return {string} Item tag
     */
    readonly itemTag: string;
    /**
     * Returns menu label tag.
     *
     * @ignore Exclude from docs
     * @return {string} Label tag
     */
    readonly labelTag: string;
    /**
     * @return {Align} Horizontal alignment
     */
    /**
     * A horizontal alignment for the menu placement.
     *
     * @param {Align} value Horizontal alignment
     */
    align: Align;
    /**
     * @return {VerticalAlign} Vertical alignment
     */
    /**
     * A vertical alignment for the menu placement.
     *
     * @param {VerticalAlign} value Vertical alignment
     */
    verticalAlign: VerticalAlign;
    /**
     * @return {string} Class name prefix
     */
    /**
     * Class name prefix.
     *
     * @default "amexport"
     * @param {string} value Class name prefix
     */
    classPrefix: string;
    /**
     * @return {boolean} Should ExportMenu load its own CSS?
     */
    /**
     * Indicates whether [[ExportMenu]] should load external CSS to style itself.
     *
     * If set to `false`, the menu will not be styled, and will rely on some
     * external CSS.
     *
     * @default true
     * @param {string} Should ExportMenu load its own CSS?
     */
    defaultStyles: boolean;
    /**
     * Loads the default CSS.
     *
     * @ignore Exclude from docs
     */
    loadDefaultCSS(): void;
    /**
     * @return {number} Tab index
     */
    /**
     * A tab index for the menu.
     *
     * Tab index will influence the order in which elements on the chart and
     * the whole page are selected when pressing TAB key.
     *
     * @param {number} value Tab index
     */
    tabindex: number;
    /**
     * @return {Language} A [[Language]] instance to be used
     */
    /**
     * A [[Language]] instance.
     *
     * @param {Language} value An instance of [[Language]]
     */
    language: Language;
    /**
     * Controlling the menu
     */
    /**
     * Removes all active classes from menu items. Useful on touch devices and
     * keyboard navigation where open menu can be closed instantly by clicking or
     * tapping outside it.
     *
     * @ignore Exclude from docs
     */
    close(): void;
    /**
     * Selects a branch in the menu.
     *
     * Handles closing of currently open branch.
     *
     * @ignore Exclude from docs
     * @param {IExportMenuItem} branch Branch to select
     */
    selectBranch(branch: IExportMenuItem): void;
    /**
     * Unselects a branch. Also selects a branch one level up if necessary.
     *
     * @ignore Exclude from docs
     * @param {IExportMenuItem} branch Branch to unselect
     * @param {boolean}         simple If `true`, only the branch will be unselected without selecting parent branch
     */
    unselectBranch(branch: IExportMenuItem, simple?: boolean): void;
    /**
     * Delay unselection of a branch. This can still be cancelled in some other
     * place if the branch or its children regain focus.
     *
     * @ignore Exclude from docs
     * @param {IExportMenuItem} branch Branch to unselect
     * @param {boolean}         simple If `true`, only the branch will be unselected without selecting parent branch
     */
    delayUnselectBranch(branch: IExportMenuItem, simple?: boolean): void;
    /**
     * Navigates the menu based on which direction kayboard key was pressed.
     *
     * @ignore Exclude from docs
     * @param {KeyboardKeys} key A key that was pressed
     */
    moveSelection(key: KeyboardKeys): void;
    /**
     * Returns all siblings of a menu item, including this same menu item.
     *
     * @ignore Exclude from docs
     * @param  {IExportMenuItem}         branch  Menu item
     * @return {Array<IExportMenuItem>}          List of sibling menu items
     */
    getSiblings(branch: IExportMenuItem): Array<IExportMenuItem>;
    /**
     * Returns menu items parent item.
     *
     * @ignore Exclude from docs
     * @param  {IExportMenuItem}            branch  Menu item
     * @return {Optional<IExportMenuItem>}          Parent menu item
     */
    getParentItem(branch: IExportMenuItem): $type.Optional<IExportMenuItem>;
    /**
     * Returns next sibling in the same menu branch. If there is no next sibling,
     * the first one is returned. If there is just one item, that item is
     * returned. Unsupported menu items are skipped.
     *
     * @ignore Exclude from docs
     * @param  {IExportMenuItem}  branch  Menu item to search siblings for
     * @return {IExportMenuItem}          Menu item
     */
    getNextSibling(branch: IExportMenuItem): IExportMenuItem;
    /**
     * Returns previous sibling in the same menu branch. If there is no next
     * sibling, the first one is returned. If there is just one item, that item is
     * returned. Unsupported menu items are skipped.
     *
     * @ignore Exclude from docs
     * @param  {IExportMenuItem}  branch  Menu item to search siblings for
     * @return {IExportMenuItem}          Menu item
     */
    getPrevSibling(branch: IExportMenuItem): IExportMenuItem;
    /**
     * Attempts to set focus on particular menu element.
     *
     * @ignore Exclude from docs
     * @param {IExportMenuItem} branch Menu item
     */
    setFocus(branch: IExportMenuItem): void;
    /**
     * Attempts to remove focus from the menu element.
     *
     * @ignore Exclude from docs
     * @param {IExportMenuItem} branch Menu item
     */
    setBlur(branch: IExportMenuItem): void;
}
