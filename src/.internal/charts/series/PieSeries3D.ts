/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */

import { PieSeries, PieSeriesDataItem, IPieSeriesDataFields, IPieSeriesProperties, IPieSeriesAdapters, IPieSeriesEvents } from "../series/PieSeries";
import { PieChart3D } from "../types/PieChart3D";
import { Slice3D } from "../../core/elements/3d/Slice3D";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";
import { Bullet } from "../elements/Bullet";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[PieSeries3D]].
 *
 * @see {@link DataItem}
 */
export class PieSeries3DDataItem extends PieSeriesDataItem {

	/**
	 * Defines type of the slice represented by this data item.
	 */
	public _slice: Slice3D;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: PieSeries3D;

	/**
	 * @todo Remove?
	 * @deprecated
	 */
	public component: PieSeries3D;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PieSeries3DDataItem";

		this.values.depthValue = {};

		this.applyTheme();
	}

	/**
	 * Slice depth (height).
	 *
	 * @param value  Depth
	 */
	public set depthValue(value: number) {
		this.setValue("depthValue", value);
	}

	/**
	 * @return Depth
	 */
	public get depthValue(): number {
		return this.values["depthValue"].value;
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[PieSeries3D]].
 */
export interface IPieSeries3DDataFields extends IPieSeriesDataFields {

	/**
	 * Name of the field in data that holds 3D slice depth (height).
	 */
	depthValue?: string;

}

/**
 * Defines properties for [[PieSeries3D]].
 */
export interface IPieSeries3DProperties extends IPieSeriesProperties {

	/**
	 * Depth (height) of the pie slice in pixels.
	 */
	depth?: number;

	/**
	 * Angle of the view point of the 3D pie.
	 */
	angle?: number;

}

/**
 * Defines events for [[PieSeries3D]].
 */
export interface IPieSeries3DEvents extends IPieSeriesEvents { }

/**
 * Defines adapters for [[PieSeries3D]].
 *
 * @see {@link Adapter}
 */
export interface IPieSeries3DAdapters extends IPieSeriesAdapters, IPieSeries3DProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a slice series on a 3D pie chart.
 *
 * @see {@link IPieSeries3DEvents} for a list of available Events
 * @see {@link IPieSeries3DAdapters} for a list of available Adapters
 * @todo Example
 * @important
 */
export class PieSeries3D extends PieSeries {

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: IPieSeries3DDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IPieSeries3DProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPieSeries3DAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPieSeries3DEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: PieSeries3DDataItem;

	/**
	 * A chart series belongs to.
	 */
	public _chart: PieChart3D;

	public _slice: Slice3D;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PieSeries3D";
		this.applyTheme();
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new PieSeries3DDataItem();
	}

	/**
	 * creates slice
	 */
	protected createSlice(): this["_slice"] {
		return new Slice3D();
	}

	/**
	 * Validates data item's element, effectively redrawing it.
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElement(dataItem: PieSeries3DDataItem): void {

		let slice: Slice3D = <Slice3D>dataItem.slice;

		let depth: number = this.depth;
		if (!$type.isNumber(depth)) {
			depth = this.chart.depth;
		}

		let depthPercent: number = dataItem.values.depthValue.percent;
		if (!$type.isNumber(depthPercent)) {
			depthPercent = 100;
		}

		slice.depth = depthPercent * depth / 100;

		let angle: number = this.angle;
		if (!$type.isNumber(angle)) {
			angle = this.chart.angle;
		}

		slice.angle = angle;

		super.validateDataElement(dataItem);
	}

	/**
	 * (Re)validates the whole series, effectively causing it to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		super.validate();

		for (let i = this._workingStartIndex; i < this._workingEndIndex; i++) {
			let dataItem = this.dataItems.getIndex(i);
			let slice: Slice3D = dataItem.slice;

			const startAngle = slice.startAngle;
			// find quarter
			//q0 || q1
			if ((startAngle >= -90 && startAngle < 90)) {
				slice.toFront();
			}
			//q2 || q3
			else if ((startAngle >= 90)) {
				slice.toBack();
			}
		}
	}

	/**
	 * Depth (height) of the pie slice in pixels.
	 *
	 * @param value  Depth (px)
	 */
	public set depth(value: number) {
		this.setPropertyValue("depth", value, true);
	}

	/**
	 * @return Depth (px)
	 */
	public get depth(): number {
		return this.getPropertyValue("depth");
	}

	/**
	 * Angle of the view point of the 3D pie. (0-360)
	 *
	 * @param value  Angle
	 */
	public set angle(value: number) {
		this.setPropertyValue("angle", value);
	}

	/**
	 * @return Angle
	 */
	public get angle(): number {
		return this.getPropertyValue("angle");
	}

	/**
	 * Positions series bullet.
	 *
	 * @ignore Exclude from docs
	 * @param bullet  Bullet
	 */
	public positionBullet(bullet: Bullet): void {
		super.positionBullet(bullet);

		let dataItem: this["_dataItem"] = <this["_dataItem"]>bullet.dataItem;
		let slice = dataItem.slice;

		bullet.y = bullet.pixelY - slice.depth;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PieSeries3D"] = PieSeries3D;
registry.registeredClasses["PieSeries3DDataItem"] = PieSeries3DDataItem;
