/**
 * 3D column series module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ColumnSeries, IColumnSeriesProperties, IColumnSeriesDataFields, IColumnSeriesAdapters, IColumnSeriesEvents, ColumnSeriesDataItem } from "../series/ColumnSeries";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { Container } from "../../core/Container";
import { XYChart3D } from "../types/XYChart3D";
import { Column3D } from "../elements/Column3D";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

export class ColumnSeries3DDataItem extends ColumnSeriesDataItem {

	/**
	 * A sprite used to draw the column.
	 * @type {Column3D}
	 */
	public _column: Column3D;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ColumnSeries3DDataItem";
		this.applyTheme();
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[ColumnSeries3D]].
 */
export interface IColumnSeries3DDataFields extends IColumnSeriesDataFields { }

/**
 * Defines properties for [[ColumnSeries3D]].
 */
export interface IColumnSeries3DProperties extends IColumnSeriesProperties {

	/**
	 * Depth (height) of the slices in the series in pixels.
	 *
	 * @ignore Exclude from docs
	 * @type {number}
	 */
	depth?: number;

	/**
	 * Angle of view for the slices in series. (0-360)
	 *
	 * @ignore Exclude from docs
	 * @type {number}
	 */
	angle?: number;

}

/**
 * Defines events for [[ColumnSeries3D]].
 */
export interface IColumnSeries3DEvents extends IColumnSeriesEvents { }

/**
 * Defines adapters for [[ColumnSeries3D]].
 *
 * @see {@link Adapter}
 */
export interface IColumnSeries3DAdapters extends IColumnSeriesAdapters, IColumnSeries3DProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a 3D column graph.
 *
 * @see {@link IColumnSeries3DEvents} for a list of available Events
 * @see {@link IColumnSeries3DAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class ColumnSeries3D extends ColumnSeries {

	/**
	 */
	public _dataItem: ColumnSeries3DDataItem;

	/**
	 */
	public _column: Column3D;

	/**
	 * Defines the type for data fields.
	 *
	 * @type {IColumnSeries3DDataFields}
	 */
	public _dataFields: IColumnSeries3DDataFields;

	/**
	 * Defines available properties.
	 *
	 * @type {IColumnSeries3DProperties}
	 */
	public _properties!: IColumnSeries3DProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IColumnSeries3DAdapters}
	 */
	public _adapter!: IColumnSeries3DAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IColumnSeries3DEvents}
	 */
	public _events!: IColumnSeries3DEvents;

	/**
	 * Specifies how deep in 3d space columns should be drawn.
	 *
	 * Internal use only.
	 *
	 * @ignore Exclude from docs
	 * @type {number}
	 */
	public depthIndex: number;

	/**
	 * A chart series belongs to.
	 *
	 * @type {XYChart3D}
	 */
	public _chart: XYChart3D;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "ColumnSeries3D";

		this.columns.template.column3D.applyOnClones = true;
		this.columns.template.hiddenState.properties.visible = true;

		this.applyTheme();
	}

	/**
	 * @ignore
	 */
	public get columnsContainer(): Container {
		if (this.chart && this.chart.columnsContainer) {
			return this.chart.columnsContainer;
		}
		else {
			return this._columnsContainer;
		}
	}

	/**
	 * Validates data item's elements.
	 *
	 * @ignore Exclude from docs
	 * @param {this["_dataItem"]}  dataItem  Data item
	 */
	public validateDataElementReal(dataItem: this["_dataItem"]): void {
		super.validateDataElementReal(dataItem);
		if(dataItem.column){
			dataItem.column.dx = this.dx;
			dataItem.column.dy = this.dy;
		}
	}	


	/**
	 * Validates data item's elements.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataElements(): void {
		super.validateDataElements();
		if(this.chart){
			this.chart.invalidateLayout();	
		}		
	}		

	/**
	 * Returns an element to use for 3D bar.
	 * @ignore
	 * @return {this["_column"]} Element.
	 */
	protected createColumnTemplate(): this["_column"] {
		return new Column3D();
	}



	/**
	 * Depth (height) of the slices in the series in pixels.
	 *
	 * @ignore Exclude from docs
	 * @param {number}  value  Depth (px)
	 */
	public set depth(value: number) {
		this.setPropertyValue("depth", value, true);
		let template = this.columns.template; // todo: Cone is not Rectangle3D, maybe we should do some I3DShape?
		template.column3D.depth = value;
	}

	/**
	 * @ignore Exclude from docs
	 * @return {number} Depth (px)
	 */
	public get depth(): number {
		return this.getPropertyValue("depth");
	}

	/**
	 * Angle of view for the slices in series. (0-360)
	 *
	 * @ignore Exclude from docs
	 * @param {number}  value  Angle (0-360)
	 */
	public set angle(value: number) {
		this.setPropertyValue("angle", value);
		let template = this.columns.template;
		template.column3D.angle = value;
	}

	/**
	 * @ignore Exclude from docs
	 * @return {number} Angle (0-360)
	 */
	public get angle(): number {
		return this.getPropertyValue("angle");
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ColumnSeries3D"] = ColumnSeries3D;
registry.registeredClasses["ColumnSeries3DDataItem"] = ColumnSeries3DDataItem;
