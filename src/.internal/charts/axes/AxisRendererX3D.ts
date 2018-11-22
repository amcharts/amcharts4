/**
 * Module, defining Axis Renderer for horizontal 3D axes.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRendererX, IAxisRendererXProperties, IAxisRendererXAdapters, IAxisRendererXEvents } from "../axes/AxisRendererX";
import { Sprite, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { XYChart3D } from "../types/XYChart3D";
import { Grid } from "../axes/Grid";
import { Axis } from "../axes/Axis";
import { IPoint } from "../../core/defs/IPoint";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisRendererX3D]].
 */
export interface IAxisRendererX3DProperties extends IAxisRendererXProperties { }

/**
 * Defines events for [[AxisRendererX3D]].
 */
export interface IAxisRendererX3DEvents extends IAxisRendererXEvents { }

/**
 * Defines adapters for [[AxisRendererX3D]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererX3DAdapters extends IAxisRendererXAdapters, IAxisRendererX3DProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Renderer for horizontal 3D axis.
 *
 * @see {@link IAxisRendererX3DEvents} for a list of available events
 * @see {@link IAxisRendererX3DAdapters} for a list of available Adapters
 */
export class AxisRendererX3D extends AxisRendererX {

	/**
	 * Defines available properties
	 * @type {IAxisRendererX3DProperties}
	 */
	public _properties!: IAxisRendererX3DProperties;

	/**
	 * Defines available adapters
	 * @type {AxisRendererAdapters}
	 */
	public _adapter!: IAxisRendererX3DAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IAxisRendererX3DEvents}
	 */
	public _events!: IAxisRendererX3DEvents;

	/**
	 * A related chart.
	 *
	 * @todo Description
	 * @type {MutableValueDisposer}
	 */
	protected _chart = new MutableValueDisposer<XYChart3D>();

	/**
	 * Constructor.
	 *
	 * @param {Axis} axis Related axis
	 */
	constructor() {
		super();
		this.className = "AxisRendererX3D";

		this._disposers.push(this._chart);

		this.applyTheme();
	}

	/**
	 * Updates and positions a grid element.
	 *
	 * @ignore Exclude from docs
	 * @param {Grid}    grid         Grid element
	 * @param {number}  position     Starting position
	 * @param {number}  endPosition  End position
	 */
	public updateGridElement(grid: Grid, position: number, endPosition: number) {
		position = position + (endPosition - position) * grid.location;
		let point: IPoint = this.positionToPoint(position);

		if (grid.element) {

			let dx: number = this.chart.dx3D;
			let dy: number = this.chart.dy3D;

			let h: number = this.getHeight();

			grid.path = $path.moveTo({ x: dx, y: dy }) + $path.lineTo({ x: dx, y: h + dy }) + $path.lineTo({ x: 0, y: h });
		}
		this.positionItem(grid, point);

		this.toggleVisibility(grid, position, 0, 1);
	}

	/**
	 * Updates and positions the base grid element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateBaseGridElement() {
		super.updateBaseGridElement();

		let h = this.getHeight();
		let dx = this.chart.dx3D;
		let dy = this.chart.dy3D;
		this.baseGrid.path = $path.moveTo({ x: dx, y: dy }) + $path.lineTo({ x: dx, y: h + dy }) + $path.lineTo({ x: 0, y: h });
	}

	/**
	 * Chart, associated with the Axis.
	 *
	 * @ignore Exclude from docs
	 * @param {XYChart3D} value Chart
	 */
	public set chart(chart: XYChart3D) {
		if (chart) {
			this._chart.set(chart, chart.events.on("propertychanged", this.handle3DChanged, this, false));
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return {XYChart3D} Chart
	 */
	public get chart(): XYChart3D {
		return this._chart.get();
	}

	/**
	 * Invoked when 3D-related settings change, like depth or angle.
	 *
	 * @param {AMEvent<Sprite, ISpriteEvents>["propertychanged"]} event Event
	 */
	protected handle3DChanged(event: AMEvent<Sprite, ISpriteEvents>["propertychanged"]): void {
		if (event.property == "depth" || event.property == "angle") {
			this.invalidate();
		}
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRendererX3D"] = AxisRendererX3D;
