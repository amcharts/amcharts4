/**
 * Module that defines everything related to building Columns.
 * It is a container which has column element which is a RoundedRectangle.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
import { registry } from "../../core/Registry";
import { percent } from "../../core/utils/Percent";
import * as $math from "../../core/utils/Math";
import { IRectangle } from "../../core/defs/IRectangle";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Column]].
 */
export interface IColumnProperties extends IContainerProperties { }

/**
 * Defines events for [[Column]].
 */
export interface IColumnEvents extends IContainerEvents { }

/**
 * Defines adapters for [[Column]].
 *
 * @see {@link Adapter}
 */
export interface IColumnAdapters extends IContainerAdapters, IColumnProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Class used to creates Columns.
 *
 * @see {@link IColumnEvents} for a list of available events
 * @see {@link IColumnAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export class Column extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IColumnProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IColumnAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IColumnEvents;

	/**
	 * column element
	 */
	public column: RoundedRectangle;

	/**
	 * @ignore
	 */
	public realWidth: number;

	/**
	 * @ignore
	 */
	public realHeight: number;

	/**
	 * @ignore
	 */
	public realX: number;

	/**
	 * @ignore
	 */
	public realY: number;


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Column";

		this.width = percent(80);
		this.height = percent(80);

		//this.isMeasured = true; // for correct position of the tooltip
		this.events.disableType("transformed"); // not to bug parent
		this.applyOnClones = true;

		this.strokeOpacity = 1;

		this.layout = "none";

		this.createAssets();

		// otherwise users will have to set layout themselves if they'll want to align, scale etc children
		this.events.on("childadded", this.handleKidAdded, this, false);
	}


	/**
	 * @ignore
	 */
	protected handleKidAdded() {
		if (this.layout == "none") {
			this.layout = "absolute";
		}
	}

	/**
	 * @ignore
	 */
	protected createAssets() {
		this.column = this.createChild(RoundedRectangle);
		this.column.shouldClone = false;
		this.column.isMeasured = false;
		this.column.cornerRadius(0, 0, 0, 0);
		this._disposers.push(this.column);
	}

	/**
	 * @ignore Exclude from docs
	 */
	public validate() {
		super.validate();
		let column = this.column;
		if (column) {
			column.width = $math.min(this.pixelWidth, this.maxWidth);
			column.height = $math.min(this.pixelHeight, this.maxHeight);
			if(column.invalid){
				column.validate(); // important!
			}
		}
	}
	/**
	 * Copies all parameters from another [[Column]].
	 *
	 * @param source Source Column
	 */
	public copyFrom(source: this) {
		super.copyFrom(source);
		if (this.column) {
			this.column.copyFrom(source.column);
		}
	}


	/**
	 * Returns bounding box (square) for this element.
	 *
	 * @ignore Exclude from docs
	 */
	public get bbox(): IRectangle {
		if (this.definedBBox) {
			return this.definedBBox;
		}
		if (this.column) {
			return { x: 0, y: 0, width: this.column.measuredWidth, height: this.column.measuredHeight };
		}
		else {
			return { x: 0, y: 0, width: $math.min(this.pixelWidth, this.maxWidth), height: $math.min(this.pixelHeight, this.maxHeight) };
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Column"] = Column;
