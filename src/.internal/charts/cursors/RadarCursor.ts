/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { RadarChart } from "../types/RadarChart";
import { XYCursor, IXYCursorAdapters, IXYCursorEvents, IXYCursorProperties } from "./XYCursor";
import { IPoint } from "../../core/defs/IPoint";
import { ISpriteEvents } from "../../core/Sprite";
import { Tooltip } from "../../core/elements/Tooltip";
import { Percent, percent } from "../../core/utils/Percent";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[RadarCursor]].
 */
export interface IRadarCursorProperties extends IXYCursorProperties {

	/**
	 * Inner radius of the cursor's circular line.
	 * Absolute (px) or relative ([[Percent]]).
	 */
	innerRadius: number | Percent;

	/**
	 * Outer radius of the cursor's circular line.
	 * Absolute (px) or relative ([[Percent]]).
	 */
	radius: number | Percent;

	/**
	 * Starting angle of the cursor's radial line.
	 */
	startAngle: number;

	/**
	 * Ending angle of the cursor's radial line.
	 */
	endAngle: number;

}

/**
 * Defines events for [[RadarCursor]].
 */
export interface IRadarCursorEvents extends IXYCursorEvents { }

/**
 * Defines adapters for [[RadarCursor]].
 *
 * @see {@link Adapter}
 */
export interface IRadarCursorAdapters extends IXYCursorAdapters, IRadarCursorProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Cursor for [[RadarChart]].
 *
 * @see {@link IRadarCursorEvents} for a list of available events
 * @see {@link IRadarCursorAdapters} for a list of available Adapters
 */
export class RadarCursor extends XYCursor {

	/**
	 * Defines available properties
	 */
	public _properties!: IRadarCursorProperties;

	/**
	 * Defines available adapters
	 */
	public _adapter!: IRadarCursorAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IRadarCursorEvents;

	/**
	 * A reference to chart cursor belongs to.
	 */
	public _chart: RadarChart;


	protected _prevAngle: number;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "RadarCursor";
		this.radius = percent(100);
		this.innerRadius = percent(0);

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
		let radius = $math.getDistance(point);

		//if(!$math.isAngleInRange(angle, this.startAngle, this.endAngle)){
			//return false;
		//}
		if (radius < this.truePixelRadius + 1 && radius > this.pixelInnerRadius - 1) { // ok to add/remove some
			return true;
		}
		return false;
	}

	/**
	 * Starting angle of the cursor's radial line.
	 *
	 * @param value Start angle
	 */
	public set startAngle(value: number) {
		this.setPropertyValue("startAngle", value, true);
	}

	/**
	 * @return Start angle
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

	/**
	 * End angle of the cursor's radial line.
	 *
	 * @param value End angle
	 */
	public set endAngle(value: number) {
		this.setPropertyValue("endAngle", value, true);
	}

	/**
	 * @return End angle
	 */
	public get endAngle(): number {
		return this.getPropertyValue("endAngle");
	}


	protected triggerMoveReal(point:IPoint) {

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
	 * (Re)draws the horizontal (circular) cursor's line.
	 *
	 * @param point New target point
	 */
	protected updateLineX(point: IPoint) {

		let radius: number = this.pixelRadius;
		let startAngle: number = this.startAngle;
		let endAngle: number = this.endAngle;
		let innerRadius: number = this.pixelInnerRadius;

		if (radius > 0 && $type.isNumber(startAngle) && $type.isNumber(endAngle) && $type.isNumber(innerRadius)) {
			let angle: number = $math.fitAngleToRange($math.getAngle(point), startAngle, endAngle);
			let path: string;

			if (this.lineX && this.lineX.visible) {

				this.lineX.moveTo({ x: 0, y: 0 });

				// fill
				if (this.xAxis && this.fullWidthLineX) {

					let startPoint: IPoint = this.xAxis.currentItemStartPoint;
					let endPoint: IPoint = this.xAxis.currentItemEndPoint;

					if (startPoint && endPoint) {
						let fillStartAngle: number = $math.fitAngleToRange($math.getAngle(startPoint), startAngle, endAngle);
						let fillEndAngle: number = $math.fitAngleToRange($math.getAngle(endPoint), startAngle, endAngle);

						let arc: number = fillEndAngle - fillStartAngle;

						// clockwise
						// this is needed, normalizeAngle doesn't solve it
						if (startAngle < endAngle) {
							if (arc < 0) {
								arc += 360;
							}
						}
						// ccw
						else {
							if (arc > 0) {
								arc -= 360;
							}
						}

						angle -= arc / 2;

						path = $path.moveTo({ x: innerRadius * $math.cos(angle), y: innerRadius * $math.sin(angle) })
							+ $path.lineTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) })
							+ $path.arcTo(angle, arc, radius)
							+ $path.lineTo({ x: innerRadius * $math.cos(angle + arc), y: innerRadius * $math.sin(angle + arc) })
							+ $path.arcTo(angle + arc, -arc, innerRadius);
					}
				}

				// line
				if (!path) {
					path = $path.moveTo({ x: innerRadius * $math.cos(angle), y: innerRadius * $math.sin(angle) }) + $path.lineTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });
				}

				this.lineX.path = path;
			}
		}
	}

	/**
	 * (Re)draws the vertical (radial) cursor's line.
	 *
	 * @param point New target point
	 */
	protected updateLineY(point: IPoint) {
		if (this.lineY && this.lineY.visible) {
			let startAngle = this.startAngle;
			let endAngle = this.endAngle;
			let truePixelRadius = this.truePixelRadius;
			let radius = $math.fitToRange($math.getDistance(point), 0, this.truePixelRadius);
			if ($type.isNumber(radius) && $type.isNumber(startAngle)) {
				this.lineY.moveTo({ x: 0, y: 0 });

				let path: string;
				let arc: number = endAngle - startAngle;

				if (this.yAxis && this.fullWidthLineY) {
					// fill
					let startPoint: IPoint = this.yAxis.currentItemStartPoint;
					let endPoint: IPoint = this.yAxis.currentItemEndPoint;

					if (startPoint && endPoint) {
						let innerRadius: number = $math.fitToRange($math.getDistance(startPoint), 0, truePixelRadius);
						radius = $math.fitToRange($math.getDistance(endPoint), 0, truePixelRadius);

						path = $path.moveTo({ x: radius * $math.cos(startAngle), y: radius * $math.sin(startAngle) }) + $path.arcTo(startAngle, arc, radius);
						path += $path.moveTo({ x: innerRadius * $math.cos(endAngle), y: innerRadius * $math.sin(endAngle) }) + $path.arcTo(endAngle, -arc, innerRadius);
					}
				}

				if (!path) {
					path = $path.moveTo({ x: radius * $math.cos(startAngle), y: radius * $math.sin(startAngle) }) + $path.arcTo(startAngle, endAngle - startAngle, radius);
				}

				this.lineY.path = path;
			}
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

			if (downPoint) {

				let point: IPoint = this.point;

				let radius: number = this.pixelRadius;
				let truePixelRadius: number = this.truePixelRadius;
				let innerRadius: number = this.pixelInnerRadius;

				let startAngle: number = Math.min(this.startAngle, this.endAngle);
				let endAngle: number = Math.max(this.startAngle, this.endAngle);

				let downAngle: number = $math.fitAngleToRange($math.getAngle(downPoint), startAngle, endAngle);
				let angle: number = $math.fitAngleToRange($math.getAngle(point), startAngle, endAngle);

				let downRadius: number = $math.getDistance(downPoint);
				if (downRadius < truePixelRadius) {

					let currentRadius = $math.fitToRange($math.getDistance(point), 0, truePixelRadius);

					this._prevAngle = angle;

					let path: string = $path.moveTo({ x: 0, y: 0 });

					let downSin: number = $math.sin(downAngle);
					let downCos: number = $math.cos(downAngle);

					let sin: number = $math.sin(angle);
					let cos: number = $math.cos(angle);

					let behavior = this.behavior;
					if (behavior == "zoomX" || behavior == "selectX") {
						path += $path.lineTo({ x: radius * downCos, y: radius * downSin }) + $path.arcTo(downAngle, angle - downAngle, radius) + $path.lineTo({ x: innerRadius * cos, y: innerRadius * sin }) + $path.arcTo(angle, downAngle - angle, innerRadius);
					}
					else if (behavior == "zoomY" || behavior == "selectY") {
						path = $path.moveTo({ x: currentRadius * $math.cos(startAngle), y: currentRadius * $math.sin(startAngle) }) + $path.arcTo(startAngle, endAngle - startAngle, currentRadius) + $path.lineTo({ x: downRadius * $math.cos(endAngle), y: downRadius * $math.sin(endAngle) }) + $path.arcTo(endAngle, startAngle - endAngle, downRadius) + $path.closePath();
					}
					else if (behavior == "zoomXY") {
						path = $path.moveTo({ x: currentRadius * $math.cos(downAngle), y: currentRadius * $math.sin(downAngle) }) + $path.arcTo(downAngle, angle - downAngle, currentRadius) + $path.lineTo({ x: downRadius * $math.cos(angle), y: downRadius * $math.sin(angle) }) + $path.arcTo(angle, downAngle - angle, downRadius) + $path.closePath();
					}

					this.selection.path = path;
				}
				this.selection.moveTo({ x: 0, y: 0 });
			}
		}
	}

	/**
	 * Updates cursors current positions.
	 */
	protected getPositions() {
		// positions are used by axes or series
		let chart: RadarChart = this.chart;
		if (chart) {
			let innerRadius = this.pixelInnerRadius;
			let radius: number = this.truePixelRadius - innerRadius;

			let startAngle: number = this.startAngle;
			let endAngle: number = this.endAngle;

			let angle: number = $math.fitAngleToRange($math.getAngle(this.point), startAngle, endAngle);
			let xPosition = ((angle - startAngle) / (endAngle - startAngle));
			this.xPosition = xPosition;

			this.yPosition = $math.fitToRange(($math.getDistance(this.point) - innerRadius) / radius, 0, 1);
		}
	}

	/**
	 * Overriding inherited method, so that nothing happens when it's triggered.
	 *
	 * @ignore Exclude from docs
	 */
	protected updatePoint(point: IPoint) {

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
	 * needs to be overriden
	 * @ignore
	 */
	protected updateLinePositions(point: IPoint) {

	}


	/**
	 * [getRanges description]
	 *
	 * @todo Description
	 */
	protected getRanges(): void {
		let downPoint = this.downPoint;
		if (downPoint) {
			let upPoint: IPoint = this.upPoint;

			let chart: RadarChart = this.chart;
			if (chart) {
				let radius: number = this.pixelRadius;
				let startAngle: number = this.startAngle;
				let endAngle: number = this.endAngle;

				let downAngle: number = $math.fitAngleToRange($math.getAngle(downPoint), this.startAngle, this.endAngle);
				let upAngle: number = $math.fitAngleToRange($math.getAngle(upPoint), this.startAngle, this.endAngle);

				let downRadius = $math.fitToRange($math.getDistance(downPoint), 0, radius);
				let upRadius = $math.fitToRange($math.getDistance(upPoint), 0, radius);

				let startX: number = 0;
				let endX: number = 1;

				let startY: number = 0;
				let endY: number = 1;

				let behavior = this.behavior;
				if (behavior == "zoomX" || behavior == "selectX" || behavior == "zoomXY" || behavior == "selectXY") {
					let arc: number = endAngle - startAngle;
					startX = $math.round((downAngle - startAngle) / arc, 5);
					endX = $math.round((upAngle - startAngle) / arc, 5);
				}

				if (behavior == "zoomY" || behavior == "selectY" || behavior == "zoomXY" || behavior == "selectXY") {
					startY = $math.round(downRadius / radius, 5);
					endY = $math.round(upRadius / radius, 5);
				}

				this.xRange = { start: Math.min(startX, endX), end: Math.max(startX, endX) };
				this.yRange = { start: Math.min(startY, endY), end: Math.max(startY, endY) };

				if (this.behavior == "selectX" || this.behavior == "selectY" || this.behavior == "selectXY") {
					// void
				}
				else {
					this.selection.hide();
				}
			}
		}
	}

	/**
	 * Overriding inherited method, so that nothing happens when `updateSize`
	 * is triggered.
	 *
	 * RadarCursor is quite complicated and needs own sizing logic.
	 *
	 * @ignore Exclude from docs
	 */
	public updateSize(): void { }

	/**
	 * Outer radius of the cursor's circular line.
	 * Absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Outer radius
	 */
	public set radius(value: number | Percent) {
		this.setPercentProperty("radius", value, false, false, 10, false);
	}

	/**
	 * @return Outer radius
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * Outer radius of the circular line in pixels.
	 *
	 * @return Outer radius (px)
	 * @readonly
	 */
	public get pixelRadius(): number {
		return $utils.relativeRadiusToValue(this.radius, this.truePixelRadius);
	}

	/**
	 * [truePixelRadius description]
	 *
	 * @todo Description
	 * @return Outer radius (px)
	 * @readonly
	 */
	public get truePixelRadius(): number {
		return $utils.relativeToValue(percent(100), $math.min(this.innerWidth / 2, this.innerHeight / 2));
	}

	/**
	 * Inner radius of the cursor's circular line.
	 * Absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Inner radius
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, false, false, 10, false);
	}

	/**
	 * @return Inner radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Inner radius of the circular line in pixels.
	 *
	 * @return Inner radius (px)
	 * @readonly
	 */
	public get pixelInnerRadius(): number {

		let innerRadius = this.innerRadius;

		if (innerRadius instanceof Percent) {
			innerRadius = percent(100 * innerRadius.value * this.chart.innerRadiusModifyer);
		}

		return $utils.relativeRadiusToValue(innerRadius, this.truePixelRadius) || 0;
	}


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
registry.registeredClasses["RadarCursor"] = RadarCursor;
