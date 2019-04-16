/**
 * Module, defining Axis Renderer for vertical 3D axes.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRendererY, IAxisRendererYProperties, IAxisRendererYAdapters, IAxisRendererYEvents } from "../axes/AxisRendererY";
import { Sprite, ISpriteEvents, AMEvent } from "../../core/Sprite";
import { XYChart3D } from "../types/XYChart3D";
import { Grid } from "../axes/Grid";
import { IPoint } from "../../core/defs/IPoint";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisRendererY3D]].
 */
export interface IAxisRendererY3DProperties extends IAxisRendererYProperties { }

/**
 * Defines events for [[AxisRendererY3D]].
 */
export interface IAxisRendererY3DEvents extends IAxisRendererYEvents { }

/**
 * Defines adapters for [[AxisRendererY3D]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererY3DAdapters extends IAxisRendererYAdapters, IAxisRendererY3DProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Renderer for vertical 3D axis.
 *
 * @see {@link IAxisRendererY3DEvents} for a list of available events
 * @see {@link IAxisRendererY3DAdapters} for a list of available Adapters
 */
export class AxisRendererY3D extends AxisRendererY {

	/**
	 * Defines available properties.
	 */
	public _properties!: IAxisRendererY3DProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisRendererY3DAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisRendererY3DEvents;

	/**
	 * A related chart.
	 *
	 * @todo Description
	 */
	protected _chart = new MutableValueDisposer<XYChart3D>();

	/**
	 * Constructor.
	 *
	 * @param axis Related axis
	 */
	constructor() {
		super();
		this.className = "AxisRendererY3D";
		this._disposers.push(this._chart);
		this.applyTheme();
	}

	/**
	 * Updates and positions a grid element.
	 *
	 * @ignore Exclude from docs
	 * @param grid         Grid element
	 * @param position     Starting position
	 * @param endPosition  End position
	 */
	public updateGridElement(grid: Grid, position: number, endPosition: number): void {
		position = position + (endPosition - position) * grid.location;

		let point: IPoint = this.positionToPoint(position);
		if (grid.element) {

			let dx: number = this.chart.dx3D || 0;
			let dy: number = this.chart.dy3D || 0;

			let w: number = this.getWidth();

			grid.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: dx, y: dy }) + $path.lineTo({ x: w + dx, y: dy });
		}
		this.positionItem(grid, point);

		this.toggleVisibility(grid, position, 0, 1);
	}

	/**
	 * Updates and positions the base grid element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateBaseGridElement(): void {
		super.updateBaseGridElement();

		let dx: number = this.chart.dx3D || 0;
		let dy: number = this.chart.dy3D || 0;

		let w: number = this.getWidth();
		this.baseGrid.path = $path.moveTo({ x: 0, y: 0 })
			+ $path.lineTo({ x: w, y: 0 })
			+ $path.lineTo({ x: w + dx, y: dy });
	}

	/**
	 * Chart, associated with the Axis.
	 *
	 * @ignore Exclude from docs
	 * @param value  Chart
	 */
	public set chart(chart: XYChart3D) {
		if (chart) {
			this._chart.set(chart, chart.events.on("propertychanged", this.handle3DChanged, this, false));
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Chart
	 */
	public get chart(): XYChart3D {
		return this._chart.get();
	}

	/**
	 * Invoked when 3D-related settings change, like depth or angle.
	 *
	 * @param event Event
	 */
	protected handle3DChanged(event: AMEvent<Sprite, ISpriteEvents>["propertychanged"]): void {
		if (event.property == "depth" || event.property == "angle") {
			this.invalidate();
		}
	}

}
