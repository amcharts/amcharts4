/**
 * Axis Bullet module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerAdapters, IContainerEvents, IContainerProperties } from "../../core/Container";
import { AxisItemLocation, AxisDataItem, Axis } from "./Axis";
import { registry } from "../../core/Registry";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisBullet]].
 */
export interface IAxisBulletProperties extends IContainerProperties {

	/**
	 * Relative position within cell/range.
	 *
	 * Value range is from from `0` (beginning) to `1` (end).
	 *
	 * @default 0.5
	 */
	location?: number;

	/**
	 * Draw inside plot area (`true`) or outside it (`false`).
	 *
	 * @default false
	 */
	inside?: boolean;

}

/**
 * Defines events for [[AxisBullet]].
 */
export interface IAxisBulletEvents extends IContainerEvents { }

/**
 * Defines adapter for [[AxisBullet]].
 *
 * @see {@link Adapter}
 */
export interface IAxisBulletAdapters extends IContainerAdapters, IAxisBulletProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to draw a positioned bullet (element) on an Axis.
 *
 * ```TypeScript
 * let range = dateAxis.axisRanges.create();
 * range.date = new Date(2018, 0, 5);
 * 
 * let flag = new am4plugins_bullets.FlagBullet();
 * flag.label.text = "Hello";
 *
 * range.bullet = flag;
 * ```
 * ```JavaScript
 * var range = dateAxis.axisRanges.create();
 * range.date = new Date(2018, 0, 5);
 * 
 * var flag = new am4plugins_bullets.FlagBullet();
 * flag.label.text = "Hello";
 *
 * range.bullet = flag;
 * ```
 * ```JSON
 * {
 *   // ...
 *   "xAxes": [{
 *     "type": "DateAxis",
 *     // ...
 *     "axisRanges": [{
 *       "date": new Date(2018, 0, 5),
 *       "bullet: {
 *         "type": "FlagBullet",
 *         "label": {
 *           "text": "Hello"
 *         }
 *       }
 *     }]
 *   }]
 * }
 * ```
 *
 * @since 4.5.9
 * @see {@link IAxisBulletEvents} for a list of available events
 * @see {@link IAxisBulletAdapters} for a list of available Adapters
 * @important
 */
export class AxisBullet extends Container {

	/**
	 * Defines available properties
	 */
	public _properties!: IAxisBulletProperties;

	/**
	 * Defines available adapters
	 */
	public _adapter!: IAxisBulletAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisBulletEvents;

	/**
	 * Data item.
	 */
	public _dataItem: AxisDataItem;

	/**
	 * A referecent to Axis element this fill is applied to.
	 */
	public axis: Axis;

	constructor() {
		super();

		this.className = "AxisBullet";

		this.location = 0.5;

		this.isMeasured = false;

		this.applyTheme();
	}

	/**
	 * Relative position within cell/range.
	 *
	 * Value range is from from `0` (beginning) to `1` (end).
	 *
	 * NOTE: `location` is relative to the parent axis range's scope, i.e.
	 * between its `date` and `endDate` for [[DateAxis]], or `value`/`endValue`
	 * ([[ValueAxis]]), or `category`/`endCategory` ([[categoryAxis]]).
	 * 
	 * ```TypeScript
	 * let range = dateAxis.axisRanges.create();
	 * range.date = new Date(2018, 0, 5);
	 * range.endDate = new Date(2018, 0, 6);
	 * 
	 * let bullet = new am4charts.AxisBullet();
	 * bullet.location = 1;
	 * 
	 * let flag = bullet.createChild(am4plugins_bullets.FlagBullet);
	 * flag.label.text = "Hello";
	 * ```
	 * ```JavaScript
	 * var range = dateAxis.axisRanges.create();
	 * range.date = new Date(2018, 0, 5);
	 * range.endDate = new Date(2018, 0, 6);
	 * 
	 * var bullet = new am4charts.AxisBullet();
	 * bullet.location = 1;
	 * 
	 * var flag = bullet.createChild(am4plugins_bullets.FlagBullet);
	 * flag.label.text = "Hello";
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "xAxes": [{
	 *     "type": "DateAxis",
	 *     // ...
	 *     "axisRanges": [{
	 *       "date": new Date(2018, 0, 5),
	 *       "endDate": new Date(2018, 0, 6),
	 *       "bullet: {
	 *         "type": "AxisBullet",
	 *         "location": 1,
	 *         "children": [{
	 *           "type": "FlagBullet",
	 *           "label": {
	 *             "text": "Hello"
	 *           }
	 *         }]
	 *       }
	 *     }]
	 *   }]
	 * }
	 * ```
	 *
	 * @default 0.5
	 * @param  value  Location (0-1)
	 */
	public set location(value: AxisItemLocation) {
		this.setPropertyValue("location", value, true);
	}

	/**
	 * @return Location (0-1)
	 */
	public get location(): AxisItemLocation {
		return this.getPropertyValue("location");
	}

	/**
	 * @ignore
	 */
	protected setDisabled(value: boolean): boolean {
		let changed = super.setDisabled(value);
		if (this.axis) {
			this.axis.invalidateDataItems();
		}
		return changed;
	}
}


/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisBullet"] = AxisBullet;