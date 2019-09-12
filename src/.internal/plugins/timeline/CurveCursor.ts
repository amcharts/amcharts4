/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { CurveChart } from "./CurveChart";
import { XYCursor, IXYCursorAdapters, IXYCursorEvents, IXYCursorProperties } from "../../charts/cursors/XYCursor";
import { IPoint } from "../../core/defs/IPoint";
import { ISpriteEvents } from "../../core/Sprite";
import { Tooltip } from "../../core/elements/Tooltip";
//import { Percent, percent } from "../../core/utils/Percent";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import { AxisRendererCurveX } from "./AxisRendererCurveX";
import { AxisRendererCurveY } from "./AxisRendererCurveY";
//import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[CurveCursor]].
 */
export interface ICurveCursorProperties extends IXYCursorProperties { }

/**
 * Defines events for [[CurveCursor]].
 */
export interface ICurveCursorEvents extends IXYCursorEvents { }

/**
 * Defines adapters for [[CurveCursor]].
 *
 * @see {@link Adapter}
 */
export interface ICurveCursorAdapters extends IXYCursorAdapters, ICurveCursorProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Cursor for [[CurveChart]].
 *
 * @see {@link ICurveCursorEvents} for a list of available events
 * @see {@link ICurveCursorAdapters} for a list of available Adapters
 */
export class CurveCursor extends XYCursor {

	/**
	 * Defines available properties
	 */
	public _properties!: ICurveCursorProperties;

	/**
	 * Defines available adapters
	 */
	public _adapter!: ICurveCursorAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ICurveCursorEvents;

	/**
	 * A reference to chart cursor belongs to.
	 */
	public _chart: CurveChart;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "CurveCursor";

		// Apply theme
		this.applyTheme();

		this.mask = undefined;
	}

	/**
	 * Checks if point is within bounds of a container.
	 *
	 * @ignore Exclude from docs
	 * @param point  Point to check
	 * @return Fits within container?
	 */
	public fitsToBounds(point: IPoint): boolean {
		if (this.xAxis && this.yAxis) {
			let xAxisRenderer: AxisRendererCurveX = <AxisRendererCurveX>this.xAxis.renderer;
			let yAxisRenderer: AxisRendererCurveY = <AxisRendererCurveY>this.yAxis.renderer;
			let index = xAxisRenderer.polyspline.getClosestPointIndex(point);
			let distance = $math.getDistance(point, xAxisRenderer.polyspline.allPoints[index]);
			if (distance >= Math.abs(yAxisRenderer.radius) && distance >= Math.abs(yAxisRenderer.innerRadius)) {
				return false;
			}
			return true;
		}
	}

	/**
	 * [triggerMoveReal description]
	 * 
	 * @param  point  Target point
	 */
	protected triggerMoveReal(point: IPoint) {
		if (!this.xAxis || (this.xAxis && (!this.xAxis.cursorTooltipEnabled || this.xAxis.tooltip.disabled))) {
			this.updateLineX(this.point);
		}
		if (!this.yAxis || (this.yAxis && (!this.yAxis.cursorTooltipEnabled || this.yAxis.tooltip.disabled))) {
			this.updateLineY(this.point);
		}

		this.updateSelection();
		super.triggerMoveReal(point);
	}

	/**
	 * (Re)draws the x cursor's line.
	 *
	 * @param point New target point
	 */
	protected updateLineX(point: IPoint) {
		let lineX = this.lineX;
		let xAxis = this.xAxis;

		if (!xAxis) {
			this.xAxis = this.chart.xAxes.getIndex(0);
			xAxis = this.xAxis;
		}

		if (lineX && lineX.visible && !lineX.disabled && xAxis) {
			let position = xAxis.renderer.pointToPosition(point);
			let axisRendererX = <AxisRendererCurveX>xAxis.renderer;
			lineX.path = axisRendererX.getGridPath($math.fitToRange(position, xAxis.start, xAxis.end));
		}
	}

	/**
	 * (Re)draws the vertical (radial) cursor's line.
	 *
	 * @param point New target point
	 */
	protected updateLineY(point: IPoint) {
		let lineY = this.lineY;
		let yAxis = this.yAxis;

		if (!yAxis) {
			this.yAxis = this.chart.yAxes.getIndex(0);
			yAxis = this.yAxis;
		}

		if (lineY && lineY.visible && !lineY.disabled && yAxis) {

			let position = yAxis.renderer.pointToPosition(point);

			let axisRendererY = <AxisRendererCurveY>yAxis.renderer;
			lineY.path = axisRendererY.getGridPath($math.fitToRange(position, yAxis.start, yAxis.end));
		}
	}

	/**
	 * Updates selection dimensions on size change.
	 *
	 * @ignore Exclude from docs
	 */
	public updateSelection(): void {
		if (this._usesSelection) {
			let downPoint: IPoint = this.downPoint;

			let xAxis = this.xAxis;
			let yAxis = this.yAxis;

			if (xAxis && yAxis && downPoint) {
				let point: IPoint = this.point;


				let selection = this.selection;
				selection.x = 0;
				selection.y = 0;
				let path = "";

				let behavior = this.behavior;

				if (behavior == "zoomX" || behavior == "selectX") {
					let startPosition = xAxis.renderer.pointToPosition(downPoint);
					let endPosition = xAxis.renderer.pointToPosition(point);

					path += xAxis.renderer.getPositionRangePath(startPosition, endPosition);

					startPosition = xAxis.toGlobalPosition(startPosition);
					endPosition = xAxis.toGlobalPosition(endPosition);

					this.xRange = { start: Math.min(startPosition, endPosition), end: Math.max(endPosition, startPosition) };
				}

				else if (behavior == "zoomY" || behavior == "selectY") {
					let startPosition = yAxis.renderer.pointToPosition(downPoint);
					let endPosition = yAxis.renderer.pointToPosition(point);

					path += yAxis.renderer.getPositionRangePath(startPosition, endPosition);

					startPosition = yAxis.toGlobalPosition(startPosition);
					endPosition = yAxis.toGlobalPosition(endPosition);

					this.yRange = { start: Math.min(startPosition, endPosition), end: Math.max(endPosition, startPosition) };
				}

				selection.path = path;
			}
			else {
				this.selection.hide();
			}
		}
	}

	/**
	 * Updates cursors current positions.
	 */
	protected getPositions(): void {
		// positions are used by axes or series
		if (this.xAxis) {
			this.xPosition = this.xAxis.toGlobalPosition(this.xAxis.renderer.pointToPosition(this.point));
		}

		if (this.yAxis) {
			this.yPosition = this.yAxis.toGlobalPosition(this.yAxis.renderer.pointToPosition(this.point));
		}
	}

	/**
	 * Overriding inherited method, so that nothing happens when it's triggered.
	 */
	protected updatePoint(point: IPoint): void {

	}

	/**
	 * Updates Cursor's position when axis tooltip changes horizontal position.
	 *
	 * @param event Axis event
	 */
	protected handleXTooltipPosition(event: ISpriteEvents["positionchanged"]): void {
		if (this.xAxis.cursorTooltipEnabled) {
			let tooltip: Tooltip = this.xAxis.tooltip;
			this.updateLineX($utils.svgPointToSprite({ x: tooltip.pixelX, y: tooltip.pixelY }, this));
		}
	}

	/**
	 * Updates Cursor's position when axis tooltip changes vertical position.
	 *
	 * @todo Description
	 * @param event Axis event
	 */
	protected handleYTooltipPosition(event: ISpriteEvents["positionchanged"]): void {
		if (this.yAxis.cursorTooltipEnabled) {
			let tooltip: Tooltip = this.yAxis.tooltip;
			this.updateLineY($utils.svgPointToSprite({ x: tooltip.pixelX, y: tooltip.pixelY }, this));
		}
	}

	/**
	 * Overriding so that nothing happens when it's called.
	 * 
	 * @param  point  Point
	 */
	protected updateLinePositions(point: IPoint): void {

	}

	/**
	 * [getRanges description]
	 *
	 * @todo Description
	 */
	protected getRanges(): void { }

	/**
	 * Overriding inherited method, so that nothing happens when `updateSize`
	 * is triggered.
	 *
	 * CurveCursor is quite complicated and needs own sizing logic.
	 *
	 * @ignore Exclude from docs
	 */
	public updateSize(): void { }

	/**
	 *
	 * @ignore Exclude from docs
	 */

	protected fixPoint(point: IPoint): IPoint {
		// overriding xy method
		return point;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["CurveCursor"] = CurveCursor;
