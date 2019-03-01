/**
 * Module that defines everything related to building Curved Columns.
 * It is a container which has CurvedColumn element which is a Sprite.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Column, IColumnProperties, IColumnAdapters, IColumnEvents } from "./Column";
import { Sprite } from "../../core/Sprite";
import * as $path from "../../core/rendering/Path";
import * as $utils from "../../core/utils/Utils";
import { registry } from "../../core/Registry";
import * as $smoothing from "../../core/rendering/Smoothing";
import { Orientation } from "../../core/defs/Orientation";
import { IPoint } from "../../core/defs/IPoint";
import { percent } from "../../core/utils/Percent";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[CurvedColumn]].
 */
export interface ICurvedColumnProperties extends IColumnProperties {

	/**
	 * Horizontal tension setting of the line (0-1).
	 *
	 * Used for smoothed lines.
	 *
	 * @default 1
	 */
	tensionX?: number;

	/**
	 * Tension
	 */
	tension?: number;

	/**
	 * Orientation of the column
	 *
	 * @default "vertical"
	 */
	orientation?: Orientation;

}

/**
 * Defines events for [[CurvedColumn]].
 */
export interface ICurvedColumnEvents extends IColumnEvents { }

/**
 * Defines adapters for [[CurvedColumn]].
 *
 * @see {@link Adapter}
 */
export interface ICurvedColumnAdapters extends IColumnAdapters, ICurvedColumnProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Class used to creates CurvedColumns.
 *
 * @see {@link ICurvedColumnEvents} for a list of available events
 * @see {@link ICurvedColumnAdapters} for a list of available Adapters
 * @important
 */
export class CurvedColumn extends Column {

	/**
	 * Defines available properties.
	 */
	public _properties!: ICurvedColumnProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ICurvedColumnAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICurvedColumnEvents;

	/**
	 * The element that holds curved column shape.
	 */
	public curvedColumn: Sprite;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "CurvedColumn";
	}

	/**
	 * [createAssets description]
	 *
	 * @todo Description
	 * @ignore Exclude from docs
	 */
	protected createAssets(): void {
		this.curvedColumn = this.createChild(Sprite);
		this.curvedColumn.shouldClone = false;

		this.setPropertyValue("tension", 0.7);

		this.width = percent(120);
		this.height = percent(120);

		// some dirty hack so that if user access column, it won't get error
		this.column = <any>this.curvedColumn;
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();
		let w = this.realWidth;
		let h = this.realHeight;
		let x = this.realX - this.pixelX;
		let y = this.realY - this.pixelY;

		let points: IPoint[];

		// TODO can this be removed ?
		$utils.used(this.width);

		let tensionX = 1;
		let tensionY = 1;

		if (this.orientation == "vertical") {
			tensionX = this.tension;
			points = [{ x: 0, y: h + y }, { x: w / 2, y: y }, { x: w, y: h + y }];
		}
		else {
			tensionY = this.tension;
			points = [{ x: x, y: 0 }, { x: x + w, y: h / 2 }, { x: x, y: h }];
		}

		let path = $path.moveTo(points[0]) + new $smoothing.Tension(tensionX, tensionY).smooth(points);
		this.column.path = path;
	}

	/**
	 * Copies all parameters from another [[CurvedColumn]].
	 *
	 * @param source  Source CurvedColumn
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source)
		if (this.curvedColumn) {
			this.curvedColumn.copyFrom(source.curvedColumn);
		}
	}

	/**
	 * Horizontal tension of the curve.
	 *
	 * Tension defines how "lose" the line will be.
	 *
	 * 1 is the maximum tension which would result in pointy columns with
	 * straight edges.
	 *
	 * The smaller the tension th wider the column will be.
	 *
	 * @default 0.7
	 * @param value tension (0-1)
	 */
	public set tension(value: number) {
		this.setPropertyValue("tension", value, true);
	}

	/**
	 * @return Tension (0-1)
	 */
	public get tension(): number {
		return this.getPropertyValue("tension");
	}

	/**
	 * Orientation of the column.
	 *
	 * Available options: "vertical" (default) and "horizontal".
	 *
	 * @default "vertical"
	 * @param value  Orientation
	 */
	public set orientation(value: Orientation) {
		this.setPropertyValue("orientation", value, true);
	}

	/**
	 * Orientation
	 */
	public get orientation(): Orientation {
		return this.getPropertyValue("orientation");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CurvedColumn"] = CurvedColumn;
