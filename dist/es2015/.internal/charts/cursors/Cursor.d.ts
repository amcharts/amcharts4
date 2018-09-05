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
import { IInteractionObjectEvents } from "../../core/interaction/InteractionObjectEvents";
import { IPoint } from "../../core/defs/IPoint";
import { Chart } from "../Chart";
import * as $type from "../../core/utils/Type";
import { Animation } from "../../core/utils/Animation";
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
     * Specifies the rules when cursor needs to be moved or hidden.
     */
    protected _stick: "hard" | "soft" | "none";
    /**
     * A screen point that cursor is "stuck" to.
     *
     * @type {IPoint}
     */
    protected _stickPoint: IPoint;
    /**
     * Constructor
     */
    constructor();
    /**
     * Handle pointer movement in document and update cursor position as needed.
     *
     * @ignore Exclude from docs
     * @param {IInteractionObjectEvents["track"]} event Event
     */
    handleCursorMove(event: IInteractionObjectEvents["track"]): IPoint;
    /**
     * Hides actual SVG elements and handles hiding animations.
     *
     * @param  {number}  duration  Fade out duration (ms)
     * @return {Animation}            Fade out duration (ms)
     * @ignore
     */
    protected hideReal(duration?: number): $type.Optional<Animation>;
    /**
     * Places the cursor at specific point.
     *
     * The second parameter has following options:
     *
     * `"none"` - placed cursor will only be there until mouse/touch moves, then
     * it either moves to a new place (if pointer over plot area) or is hidden.
     *
     * `"soft"` - cursor will stay in the place if mouse/touch is happening
     * outside chart, but will move to a new place whe plot area is hovered or
     * touched.
     *
     * `"hard"` - cursor will stay in place no matter what, until it is moved by
     * another `triggerMove()` call.
     *
     * @param {IPoint}                    point  Point to place cursor at
     * @param {"hard" | "soft" | "none"}  stick  Level of cursor stickiness to the place
     */
    triggerMove(point: IPoint, stick?: "hard" | "soft" | "none"): void;
    /**
     * Places the cursor at specific point.
     *
     * @param {IPoint}  point Point to place cursor at
     */
    protected triggerMoveReal(point: IPoint): void;
    /**
     * Simulates pressing down (click/touch) action by a cursor.
     *
     * @param {IPoint}   point               Point of action
     */
    triggerDown(point: IPoint): void;
    /**
     * Simulates pressing down (click/touch) action by a cursor.
     *
     * @param {IPoint}   point               Point of action
     */
    protected triggerDownReal(point: IPoint): void;
    /**
     * Simulates the action of release of the mouse down / touch.
     *
     * @param {IPoint}   point               Point of action
     */
    triggerUp(point: IPoint): void;
    /**
     * Simulates the action of release of the mouse down / touch.
     *
     * @param {IPoint}   point               Point of action
     */
    protected triggerUpReal(point: IPoint): void;
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
