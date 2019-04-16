/**
 * Pie tick module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Tick, ITickProperties, ITickAdapters, ITickEvents } from "../elements/Tick";
import { AxisLabelCircular } from "../axes/AxisLabelCircular";
import { Slice } from "../../core/elements/Slice";
import { MutableValueDisposer, MultiDisposer } from "../../core/utils/Disposer";
import { PieSeries } from "../series/PieSeries"
import { registry } from "../../core/Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[PieTick]].
 */
export interface IPieTickProperties extends ITickProperties { }

/**
 * Defines events for [[PieTick]].
 */
export interface IPieTickEvents extends ITickEvents { }

/**
 * Defines adapters for [[PieTick]].
 *
 * @see {@link Adapter}
 */
export interface IPieTickAdapters extends ITickAdapters, IPieTickProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws an tick line for a pie slice connecting it to a related label.
 *
 * @see {@link IPieTickEvents} for a list of available events
 * @see {@link IPieTickAdapters} for a list of available Adapters
 */
export class PieTick extends Tick {

	/**
	 * Defines available properties.
	 */
	public _properties!: IPieTickProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPieTickAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPieTickEvents;

	/**
	 * A label element this tick is attached to.
	 */
	protected _label = new MutableValueDisposer<AxisLabelCircular>();

	/**
	 * A slice element this tick is attached to.
	 */
	protected _slice = new MutableValueDisposer<Slice>();

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PieTick";
		this.element = this.paper.add("polyline");
		this._disposers.push(this._label);
		this._disposers.push(this._slice);
		this.applyTheme();
	}

	/**
	 * Draws the tick element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		let slice: Slice = this.slice;
		let label = this.label;

		let series = <PieSeries>slice.dataItem.component;

		if (slice && slice.radius > 0 && label && label.text) {
			let x0 = slice.dx + slice.slice.dx + slice.pixelX + slice.ix * slice.radius * slice.scale;
			let y0 = slice.dy + slice.slice.dy + slice.pixelY + slice.iy * slice.radiusY * slice.scale;

			let x1: number;
			let y1: number;

			let x2: number;
			let y2: number;

			if (series.alignLabels) {
				x1 = label.pixelX - this.length;
				y1 = label.pixelY;

				x2 = label.pixelX;
				y2 = y1;

				if (label.horizontalCenter == "right") {
					x1 += 2 * this.length;
					x2 = x1 - this.length;
				}
			}
			else {
				const r = label.pixelRadius(slice.radius);

				x1 = x0 + r * slice.ix;
				y1 = y0 + r * slice.iy;

				x2 = x1;
				y2 = y1;
			}

			this.element.attr({ "points": [x0, y0, x1, y1, x2, y2] });
		}
	}

	/**
	 * Slice element tick is attached to.
	 *
	 * @param slice  Slice
	 */
	public set slice(slice: Slice) {
		this._slice.set(slice, new MultiDisposer([
			slice.events.on("transformed", this.invalidate, this),
			slice.events.on("validated", this.invalidate, this)
		]));
	}

	/**
	 * @return Slice
	 */
	public get slice(): Slice {
		return this._slice.get();
	}

	/**
	 * Label element tick is attached to.
	 *
	 * @param label  Label
	 */
	public set label(label: AxisLabelCircular) {
		this._label.set(label, label.events.on("transformed", this.invalidate, this, false));
	}

	/**
	 * @return Label
	 */
	public get label(): AxisLabelCircular {
		return this._label.get();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PieTick"] = PieTick;
