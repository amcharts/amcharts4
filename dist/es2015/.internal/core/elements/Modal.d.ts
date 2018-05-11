/**
 * Modal class is used to display information over chart area.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Popup, IPopupAdapters } from "./Popup";
import { Adapter } from "../utils/Adapter";
/**
 * Represents a list of available adapters for Export.
 */
export interface IModalAdapters extends IPopupAdapters {
}
/**
 * Shows an HTML modal which covers window or a chart area.
 *
 * @todo Positioning over whole window
 */
export declare class Modal extends Popup {
    /**
     * Adapter.
     *
     * @type {Adapter<Modal, IModalAdapters>}
     */
    adapter: Adapter<Modal, IModalAdapters>;
    /**
     * Constructor
     */
    constructor();
}
