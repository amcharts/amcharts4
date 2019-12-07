/**
 * Funnel tick module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Tick, ITickProperties, ITickAdapters, ITickEvents } from "../elements/Tick";
import { Label } from "../../core/elements/Label";
import { FunnelSlice } from "./FunnelSlice";
import { MutableValueDisposer, MultiDisposer } from "../../core/utils/Disposer";
import { FunnelSeries } from "../series/FunnelSeries";
import { registry } from "../../core/Registry";
import * as $utils from "../../core/utils/Utils";
import { IPoint } from "../../core/defs/IPoint";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[FunnelTick]].
 */
export interface IFunnelTickProperties extends ITickProperties {
	locationX?: number;

	locationY?: number;
}

/**
 * Defines events for [[FunnelTick]].
 */
export interface IFunnelTickEvents extends ITickEvents { }

/**
 * Defines adapters for [[FunnelTick]].
 *
 * @see {@link Adapter}
 */
export interface IFunnelTickAdapters extends ITickAdapters, IFunnelTickProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws an tick line for a funnel slice connecting it to a related label.
 *
 * @see {@link IFunnelTickEvents} for a list of available events
 * @see {@link IFunnelTickAdapters} for a list of available Adapters
 */
export class FunnelTick extends Tick {

	/**
	 * Defines available properties.
	 */
	public _properties!: IFunnelTickProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IFunnelTickAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IFunnelTickEvents;

	/**
	 * A label element this tick is attached to.
	 */
	protected _label = new MutableValueDisposer<Label>();

	/**
	 * A slice element this tick is attached to.
	 */
	protected _slice = new MutableValueDisposer<FunnelSlice>();

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "FunnelTick";
		this.element = this.paper.add("path");
		this._disposers.push(this._label);
		this._disposers.push(this._slice);

		this.setPropertyValue("locationX", 0);
		this.setPropertyValue("locationY", 0);

		this.applyTheme();
	}

	/**
	 * Draws the tick element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		let slice: FunnelSlice = this.slice;
		let point = slice.getPoint(this.locationX, this.locationY);

		if (point) {
			let label = this.label;

			let series = <FunnelSeries>slice.dataItem.component;
			let p0:IPoint;
			let p1:IPoint;
			let p2:IPoint;

			if (series.orientation == "vertical") {

				let x1 = label.pixelX;
				let y1 = label.pixelY;

				if(!series.labelsOpposite){
					x1 += label.maxRight;
				}

				p0 = $utils.spritePointToSprite(point, slice, this.parent);				
				p2 = $utils.spritePointToSprite({ x: x1, y: y1 }, label.parent, this.parent);
				p1 = { x: label.parent.pixelX - this.length, y: p2.y };

				if(!series.labelsOpposite){
					p1.x = label.parent.measuredWidth + this.length; 
				}				
			}
			else {
				let x1 = label.pixelX;
				let y1 = label.pixelY;

				if(!series.labelsOpposite){
					y1 += label.maxBottom;
				}

				p0 = $utils.spritePointToSprite(point, slice, this.parent);
				p2 = $utils.spritePointToSprite({ x: x1, y: y1 }, label.parent, this.parent);
				p1 = { x: p2.x, y: label.parent.pixelY - this.length };

				if(!series.labelsOpposite){
					p1.y = label.parent.measuredHeight + this.length; 
				}								
			}
			this.path = $path.moveTo(p0) + $path.lineTo(p1) + $path.lineTo(p2);
		}
	}

	/**
	 * [[FunnelSlice]] element tick is attached to.
	 *
	 * @param slice  Slice
	 */
	public set slice(slice: FunnelSlice) {
		this._slice.set(slice, new MultiDisposer([
			slice.events.on("transformed", this.invalidate, this, false),
			slice.events.on("validated", this.invalidate, this, false)
		]));
	}

	/**
	 * @return FunnelSlice
	 */
	public get slice(): FunnelSlice {
		return this._slice.get();
	}

	/**
	 * [[Label]] element tick is attached to.
	 *
	 * @param label  Label
	 */
	public set label(label: Label) {
		this._label.set(label, label.events.on("transformed", this.invalidate, this, false));
	}

	/**
	 * @return Label
	 */
	public get label(): Label {
		return this._label.get();
	}

	/**
	 * A relative horizontal position within target element a tick is pointing
	 * to.
	 *
	 * A scale is from 0 to 1, where 0 means left edge, and 1 right edge.
	 *
	 * You can also set any value in-between (e.g. 0.5 will point to the middle
	 * of the slice), or outside 0-1 range, which will put tick anchor position
	 * outside target element.
	 *
	 * @param value  Location (0-1)
	 */
	public set locationX(value: number) {
		this.setPropertyValue("locationX", value, false, true);
	}

	/**
	 * @return Location (0-1)
	 */
	public get locationX(): number {
		return this.getPropertyValue("locationX");
	}

	/**
	 * A relative vertical position within target element a tick is pointing
	 * to.
	 *
	 * A scale is from 0 to 1, where 0 means top edge, and 1 bottom edge.
	 *
	 * You can also set any value in-between (e.g. 0.5 will point to the middle
	 * of the slice), or outside 0-1 range, which will put tick anchor position
	 * outside target element.
	 *
	 * @param value  Location (0-1)
	 */
	public set locationY(value: number) {
		this.setPropertyValue("locationY", value, false, true);
	}

	/**
	 * @return Location (0-1)
	 */
	public get locationY(): number {
		return this.getPropertyValue("locationY");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FunnelTick"] = FunnelTick;
