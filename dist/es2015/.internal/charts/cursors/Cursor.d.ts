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
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
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
     *
     * @todo Description (check)
     */
    zoomstarted: {};
    /**
     * Invoked when user is done zooming using cursor.
     *
     * @todo Description (check)
     */
    zoomended: {};
    /**
     * Invoked when user starts panning using cursor.
     *
     * @todo Description (check)
     */
    panstarted: {};
    /**
     * Invoked when user is done panning using cursor.
     *
     * @todo Description (check)
     */
    panended: {};
    /**
     * Invoked when user is panning using cursor.
     *
     * @todo Description (check)
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
     * Cursor's event dispatcher.
     *
     * @type {SpriteEventDispatcher}
     */
    events: SpriteEventDispatcher<AMEvent<Cursor, ICursorEvents>>;
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
