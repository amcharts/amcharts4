/**
 * Cursor module
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { IInteractionEvents } from "../../core/interaction/Interaction";
import { IPoint } from "../../core/defs/IPoint";
import { Chart } from "../Chart";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Cursor]].
 */
export interface ICursorProperties extends IContainerProperties {
}
/**
 * Defines events for [[Cursor]].
 */
export interface ICursorEvents extends IContainerEvents {
    /**
     * Invoked when position of cursor changes.
     */
    cursorpositionchanged: {};
    /**
     * Invoked when user starts selecting a range with a cursor, e.g. presses
     * down mouse button and drags the cursor.
     */
    selectstarted: {};
    /**
     * Invoked when selection has ended, e.g. user releases mouse button.
     */
    selectended: {};
    /**
     * Invoked when user starts zooming using cursor.
     */
    zoomstarted: {};
    /**
     * Invoked when user clicked to start zooming/panning/selecting but haven't
     * finished the operation.
     */
    behaviorcanceled: {};
    /**
     * Invoked when user is done zooming using cursor.
     */
    zoomended: {};
    /**
     * Invoked when user starts panning using cursor.
     */
    panstarted: {};
    /**
     * Invoked when user is done panning using cursor.
     */
    panended: {};
    /**
     * Invoked when user is panning using cursor.
     */
    panning: {};
}
/**
 * Defines adapters for [[Cursor]].
 *
 * @see {@link Adapter}
 */
export interface ICursorAdapters extends IContainerAdapters, ICursorProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Main Cursor class with common cursor functionality.
 *
 * Chart-specific cursors must extend this class.
 *
 * @see {@link ICursorEvents} for a list of available events
 * @see {@link ICursorAdapters} for a list of available Adapters
 * @todo Add description, examples
 * @todo Should we allow changing `_generalBehavior`?
 */
export declare class Cursor extends Container {
    /**
     * Defines available properties.
     *
     * @ignore Exclude from docs
     * @type {ICursorProperties}
     */
    _properties: ICursorProperties;
    /**
     * Defines available adapters.
     *
     * @ignore Exclude from docs
     * @type {ICursorAdapters}
     */
    _adapter: ICursorAdapters;
    /**
     * Defines available events.
     *
     * @type {ICursorEvents}
     * @ignore Exclude from docs
     */
    _events: ICursorEvents;
    /**
     * Point coordinates of where selection started.
     *
     * @type {IPoint}
     */
    downPoint: IPoint;
    /**
     * Point coordinates of where selection ended.
     *
     * @type {IPoint}
     */
    upPoint: IPoint;
    /**
     * Current cursor position during selection.
     *
     * @type {IPoint}
     * @todo Better description
     */
    point: IPoint;
    /**
     * Relative horizontal position.
     *
     * @type {number}
     * @todo: maybe we should make getter only? it is used from outside by axes or series to show tooltips at some position
     */
    xPosition: number;
    /**
     * Relative vertical position.
     *
     * @type {number}
     * @todo: maybe we should make getter only? it is used from outside by axes or series to show tooltips at some position
     */
    yPosition: number;
    /**
     * [_usesSelection description]
     *
     * @todo Description
     * @type {boolean}
     */
    protected _usesSelection: boolean;
    /**
     * What to do when user pressed down and drags cursor: zoom or select.
     *
     * @type {"zoom" | "select"}
     */
    protected _generalBehavior: "zoom" | "select" | "pan";
    /**
     * A reference to chart cursor belongs to.
     *
     * @ignore Exclude from docs
     * @type {Chart}
     */
    _chart: Chart;
    /**
     * Constructor
     */
    constructor();
    /**
     * Handle pointer movement in document and update cursor position as needed.
     *
     * @ignore Exclude from docs
     * @param {IInteractionEvents["track"]} event Event
     */
    handleCursorMove(event: IInteractionEvents["track"]): IPoint;
    /**
     * Places the cursor at specific point.
     *
     * If `triggeredByPointer == false` the cursor will stay there, regardless
     * movement of the actual pointer(s). This is useful when you want to
     * manually place cursor.
     *
     * @param {IPoint}   point               Point to place cursor at
     * @param {boolean}  triggeredByPointer  Was this triggered by actual pointer?
     */
    triggerMove(point: IPoint, triggeredByPointer?: boolean): void;
    /**
     * Places the cursor at specific point.
     *
     * @param {IPoint}   point               Point to place cursor at
     * @param {boolean}  triggeredByPointer  Was this triggered by actual pointer?
     */
    protected triggerMoveReal(point: IPoint, triggeredByPointer?: boolean): void;
    /**
     * Simulates pressing down (click/touch) action by a cursor.
     *
     * @param {IPoint}   point               Point of action
     * @param {boolean}  triggeredByPointer  Was this triggered by actual pointer?
     */
    triggerDown(point: IPoint, triggeredByPointer?: boolean): void;
    /**
     * Simulates pressing down (click/touch) action by a cursor.
     *
     * @param {IPoint}   point               Point of action
     * @param {boolean}  triggeredByPointer  Was this triggered by actual pointer?
     */
    protected triggerDownReal(point: IPoint, triggeredByPointer?: boolean): void;
    /**
     * Simulates the action of release of the mouse down / touch.
     *
     * @param {IPoint}   point               Point of action
     * @param {boolean}  triggeredByPointer  Was this triggered by actual pointer?
     */
    triggerUp(point: IPoint, triggeredByPointer?: boolean): void;
    /**
     * Simulates the action of release of the mouse down / touch.
     *
     * @param {IPoint}   point               Point of action
     * @param {boolean}  triggeredByPointer  Was this triggered by actual pointer?
     */
    protected triggerUpReal(point: IPoint, triggeredByPointer?: boolean): void;
    /**
     * Updates selection dimensions on size change.
     *
     * @ignore Exclude from docs
     */
    updateSelection(): void;
    /**
     * Updates cursors current positions.
     */
    protected getPositions(): void;
    /**
     * Handles pointer down event so we can start zoom or selection.
     *
     * @ignore Exclude from docs
     * @param {IInteractionEvents["down"]} event Original event
     */
    handleCursorDown(event: IInteractionEvents["down"]): void;
    /**
     * Updates the coordinates of where pointer down event occurred
     * (was pressed).
     */
    protected updatePoint(point: IPoint): void;
    /**
     * Handles pointer up event - finishes zoom or selection action.
     *
     * @ignore Exclude from docs
     * @param {IInteractionEvents["up"]} event Original event
     */
    handleCursorUp(event: IInteractionEvents["up"]): void;
    /**
     * @return {Chart} Chart
     */
    /**
     * A reference to a [[Chart]] the cursor belongs to.
     *
     * @param {Chart}  value  Chart
     */
    chart: this["_chart"];
}
