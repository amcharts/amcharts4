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
export interface IModalAdapters extends IPopupAdapters {}

/**
 * Shows an HTML modal which covers window or a chart area.
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/popups-and-modals/} For examples and docs on Popups and Modals.
 */
export class Modal extends Popup {

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IModalAdapters;

	/**
	 * Adapter.
	 */
	public adapter: Adapter<Modal, IModalAdapters> = new Adapter<Modal, IModalAdapters>(this);

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Modal";
		this.showCurtain = true;
		this.draggable = false;
	}

}
