import { Adapter } from "../utils/Adapter";
import { BaseObject } from "../Base";
import { InteractionObject } from "../interaction/InteractionObject";
/**
 * Represents a list of available adapters for Export.
 */
export interface IModalAdapters {
    /**
     * Applied to the class prefixes.
     *
     * @type {string}
     */
    classPrefix: string;
    /**
     * Applied to modal content before it is shown.
     * @type {string}
     */
    content: string;
    /**
     * Applied to the screen reader title.
     * @type {string}
     */
    readerTitle: string;
    /**
     * Applied to default `defaultStyles` property before it is rettrieved.
     *
     * @type {boolean}
     */
    defaultStyles: boolean;
    /**
     * Applied to class names list that are added ass `class` for various modal
     * elements.
     */
    classNames: {
        wrapperClass: string;
        contentClass: string;
        curtainClass: string;
        closeClass: string;
    };
}
/**
 * Shows an HTML modal which covers window or a chart area.
 *
 * @todo Positioning over whole window
 */
export declare class Modal extends BaseObject {
    /**
     * Adapter.
     *
     * @type {Adapter<Modal, IModalAdapters>}
     */
    adapter: Adapter<Modal, IModalAdapters>;
    /**
     * A reference to an HTML element to be used for container. If not set, modal
     * will cover the whole window.
     *
     * @type {HTMLElement}
     */
    container: HTMLElement | Document;
    /**
     * A top element in modal.
     *
     * @type {HTMLElement}
     */
    protected _element: HTMLElement;
    /**
     * A content wrapper element.
     *
     * @type {HTMLElement}
     */
    protected _contentWrapperElement: HTMLElement;
    /**
     * A content element.
     *
     * @type {HTMLElement}
     */
    protected _contentElement: HTMLElement;
    /**
     * Holds [[InteractionObject]] representation of modal curtain element.
     *
     * @type {InteractionObject}
     */
    protected _curtainIO: InteractionObject;
    /**
     * Holds [[InteractionObject]] representation of the close button element.
     *
     * @type {InteractionObject}
     */
    protected _closeIO: InteractionObject;
    /**
     * Contents of modal window.
     *
     * @type {string}
     */
    protected _content: string;
    /**
     * Prefix to apply to class names for modal elements.
     *
     * @type {string}
     */
    protected _classPrefix: string;
    /**
     * If set to `true` [[Modal]] will use default styles.
     *
     * @type {boolean}
     */
    protected _defaultStyles: boolean;
    /**
     * A title for screen readers. It is very highly recommended to set that title
     * so that people using screen reader tools can get an immediate summary of
     * the information in the modal.
     *
     * @type {string}
     */
    readerTitle: string;
    /**
     * Is modal closable?
     *
     * @type {boolean}
     */
    private _closable;
    /**
     * Shows modal window.
     */
    show(): void;
    /**
     * Hides modal window.
     */
    hide(): void;
    /**
     * Destroy (dispose) modal.
     */
    dispose(): void;
    /**
     * Creates and returns an HTML holder element for modal (`<div>`).
     *
     * @ignore Exclude from docs
     * @return {HTMLElement} Modal holder element
     */
    readonly element: HTMLElement;
    /**
     * Positions content element in the center of modal based on its actual size.
     *
     * @ignore Exclude from docs
     */
    positionElement(): void;
    /**
     * A prefix that is applied to class names of various modal elements.
     *
     * @return {string} Class name prefix
     */
    /**
     * @param {string} value Class name prefix
     */
    classPrefix: string;
    /**
     * @return {string} Modal content
     */
    /**
     * Modal content.
     *
     * Modal contemt can be any valid HTML, including CSS.
     * @param {string} value Modal content
     */
    content: string;
    /**
     * @return {boolean} Closable?
     */
    /**
     * Is modal closable?
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
     * Should modal use default CSS?
     *
     * If default CSS is disabled, an external CSS should handle the look of the
     * modal, since it will look quite out of place otherwise.
     *
     * @default true
     * @param {string} Use default CSS?
     */
    defaultStyles: boolean;
    /**
     * Loads modal CSS.
     *
     * @ignore Exclude from docs
     */
    loadDefaultCSS(): void;
    /**
     * If modal is closable, this method adds various events to modal elements.
     */
    protected _applyEvents(): void;
}
