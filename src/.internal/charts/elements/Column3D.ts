/**
 * Module that defines everything related to building 3D Columns.
 * It is a container which has column3D element which is a Rectangle3D.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Column, IColumnProperties, IColumnAdapters, IColumnEvents } from "./Column";
import { Rectangle3D } from "../../core/elements/3d/Rectangle3D";
import { registry } from "../../core/Registry";
import { Color } from "../../core/utils/Color";
import { RadialGradient } from "../../core/rendering/fills/RadialGradient";
import { LinearGradient } from "../../core/rendering/fills/LinearGradient";
import { Pattern } from "../../core/rendering/fills/Pattern";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Column3D]].
 */
export interface IColumn3DProperties extends IColumnProperties { }

/**
 * Defines events for [[Column3D]].
 */
export interface IColumn3DEvents extends IColumnEvents { }

/**
 * Defines adapters for [[Column3D]].
 *
 * @see {@link Adapter}
 */
export interface IColumn3DAdapters extends IColumnAdapters, IColumn3DProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Class used to creates Column3Ds.
 *
 * @see {@link IColumn3DEvents} for a list of available events
 * @see {@link IColumn3DAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export class Column3D extends Column {

	/**
	 * Defines available properties.
	 */
	public _properties!: IColumn3DProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IColumn3DAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IColumn3DEvents;


	/**
	 * column3D element
	 */
	public column3D: Rectangle3D;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Column3D";
	}

	/**
	 * @ignore
	 */
	protected createAssets() {
		this.column3D = this.createChild(Rectangle3D);
		this.column3D.shouldClone = false;
		this.column3D.strokeOpacity = 0;

		// some dirty hack so that if user access column, it won't get error
		this.column = <any>this.column3D;
	}

	/**
	 * @ignore Exclude from docs
	 */
	public validate() {
		super.validate();
		if (this.column3D) {
			this.column3D.width = this.pixelWidth;
			this.column3D.height = this.pixelHeight;
			if(this.column3D.invalid){
				this.column3D.validate();
			}
		}
	}

	/**
	 * Copies all parameters from another [[Column3D]].
	 *
	 * @param source Source Column3D
	 */
	public copyFrom(source: this) {
		super.copyFrom(source)
		if (this.column3D) {
			this.column3D.copyFrom(source.column3D);
		}
	}

	/**
	 * Sets actual `fill` property on the SVG element, including applicable color
	 * modifiers.
	 *
	 * @ignore Exclude from docs
	 * @param value  Fill
	 */
	protected setFill(value: $type.Optional<Color | Pattern | LinearGradient | RadialGradient>): void {
		super.setFill(value);
		this.column.fill = value;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Column3D"] = Column3D;
