/**
 * Module, defining Axis Renderer for curved axes.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRendererY, IAxisRendererYProperties, IAxisRendererYAdapters, IAxisRendererYEvents } from "../../charts/axes/AxisRendererY";
import { AxisRendererCurveX } from "./AxisRendererCurveX";
import { Axis } from "../../charts/axes/Axis";
import { AxisTick } from "../../charts/axes/AxisTick";
import { IPoint } from "../../core/defs/IPoint";
import { Grid } from "../../charts/axes/Grid";
import { AxisBreak } from "../../charts/axes/AxisBreak";
import { WavedCircle } from "../../core/elements/WavedCircle";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { registry } from "../../core/Registry";
import { CurveChart } from "./CurveChart"
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";
import * as $type from "../../core/utils/Type";
import { AxisBullet } from "../../charts/axes/AxisBullet";
import { Sprite } from "../../core/Sprite";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisRendererCurveY]].
 */
export interface IAxisRendererCurveYProperties extends IAxisRendererYProperties {

	/**
	 * Outer radius of the vertical (Y) axis in pixels.
	 *
	 * Indicate distance from the charts X axis control curve.
	 */
	radius?: number;

	/**
	 * Inner radius of the vertical (Y) axis in pixels.
	 *
	 * Indicate distance from the charts X axis control curve.
	 */
	innerRadius?: number;

	/**
	 * Relative location of the Y axis along the length of the X axis.
	 *
	 * Values range from 0 (default) which means start of the X axis, to 1 meaning
	 * end of the X axis.
	 */
	axisLocation?: number;

}

/**
 * Defines events for [[AxisRendererCurveY]].
 */
export interface IAxisRendererCurveYEvents extends IAxisRendererYEvents { }

/**
 * Defines adapters for [[AxisRenderer]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererCurveYAdapters extends IAxisRendererYAdapters, IAxisRendererCurveYProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A renderer for radial axis.
 */
export class AxisRendererCurveY extends AxisRendererY {

	/**
	 * Defines available properties.
	 */
	public _properties!: IAxisRendererCurveYProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisRendererCurveYAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisRendererCurveYEvents;

	/**
	 * A related chart.
	 */
	protected _chart = new MutableValueDisposer<CurveChart>();

	/**
	 * @ignore
	 */
	public axisRendererX: AxisRendererCurveX; // @todo automatic


	/**
	 * Constructor.
	 *
	 * @param axis Related axis
	 */
	constructor() {

		// Init
		super();
		this.className = "AxisRendererCurveY";
		this.isMeasured = false;
		this.minGridDistance = 30;
		this.isMeasured = false;
		this.layout = "none";

		this.radius = 40;
		this.innerRadius = -40;

		this.line.strokeOpacity = 0;

		this.labels.template.horizontalCenter = "right";

		this._disposers.push(this._chart);

		this.applyTheme();
	}

	/**
	 * Validates Axis renderer.
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {
		// so that radius would be updated
		if (this.chart && this.chart.invalid) {
			this.chart.validate();
		}

		super.validate();
	}

	/**
	 * Actual length of the Axis, in pixels.
	 *
	 * @return Length (px)
	 */
	public get axisLength(): number {
		return Math.abs(this.radius - this.innerRadius);
	}

	/**
	 * Outer radius of the vertical (Y) axis in pixels.
	 *
	 * Indicate distance from the charts X axis control curve.
	 *
	 * Negative number means inside/below the X axis.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/timeline/#Axis_radii} for more info
	 * @param value  Outer radius
	 */
	public set radius(value: number) {
		this.setPropertyValue("radius", value, true);
	}

	/**
	 * @return Outer radius
	 */
	public get radius(): number {
		return this.getPropertyValue("radius");
	}

	/**
	 * Inner radius of the vertical (Y) axis in pixels.
	 *
	 * Indicate distance from the charts X axis control curve.
	 *
	 * Negative number means inside/below the X axis.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/timeline/#Axis_radii} for more info
	 * @param value  Outer radius
	 */
	public set innerRadius(value: number) {
		this.setPropertyValue("innerRadius", value, true);
	}

	/**
	 * @return Inner radius
	 */
	public get innerRadius(): number {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Chart, associated with the Axis.
	 *
	 * @ignore Exclude from docs
	 * @param value Chart
	 */
	public set chart(chart: CurveChart) {
		this._chart.set(chart, null);
	}

	/**
	 * @ignore Exclude from docs
	 * @return Chart
	 */
	public get chart(): CurveChart {
		return this._chart.get();
	}

	/**
	 * Converts relative position on axis to point coordinates.
	 *
	 * @param position  Position (0-1)
	 * @return Point
	 */
	public positionToPoint(position: number): IPoint {
		return { x: 0, y: this.positionToCoordinate(position) };
	}

	/**
	 * Updates and positions the axis line element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateAxisLine() {
		let axisRendererX = this.axisRendererX;
		if (axisRendererX) {
			let axis = axisRendererX.axis;
			let point = axisRendererX.positionToPoint(axis.start + (axis.end - axis.start) * this.axisLocation);
			let angle = point.angle;

			let radius = -this.radius;
			let innerRadius = -this.innerRadius;

			this.line.path = $path.moveTo({ x: innerRadius * $math.cos(angle), y: innerRadius * $math.sin(angle) }) + $path.lineTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });
			this.line.moveTo(point);

			let title = this.axis.title;
			title.moveTo({ x: point.x + radius / 2 * $math.cos(angle), y: point.y + radius / 2 * $math.sin(angle) });
			title.rotation = angle - 180;
		}
	}

	/**
	 * Updates and positions a grid element.
	 *
	 * @ignore Exclude from docs
	 * @param grid         Grid element
	 * @param position     Starting position
	 * @param endPosition  End position
	 */
	public updateGridElement(grid: Grid, position: number, endPosition: number) {

		let axisRendererX = this.axisRendererX;
		if (axisRendererX) {
			position = position + (endPosition - position) * grid.location;

			if (position >= 0 && position <= 1) {
				grid.path = this.getGridPath(position);
			}

			this.positionItem(grid, { x: 0, y: 0 });
			this.toggleVisibility(grid, position, 0, 1);
		}
	}

	/**
	 * [getGridPath description]
	 *
	 * @ignore
	 * @todo description
	 * @param   position  Position
	 * @return            SVG path
	 */
	public getGridPath(position: number): string {
		let axisRendererX = this.axisRendererX;
		let path = "";
		if (axisRendererX && $type.isNumber(position)) {

			let radius = $math.round(this.positionToPoint(position).y, 1);

			let point = axisRendererX.positionToPoint(axisRendererX.axis.start);
			let angle = point.angle;

			let count = Math.ceil(axisRendererX.axisLength / axisRendererX.precisionStep);
			let start = axisRendererX.axis.start;
			let end = axisRendererX.axis.end;

			for (let i = 0; i <= count; i++) {

				let pos = start + i / count * (end - start);
				point = axisRendererX.positionToPoint(pos);
				angle = point.angle;

				let x = point.x + radius * $math.cos(angle);
				let y = point.y + radius * $math.sin(angle);

				path += $path.lineTo({ x: x, y: y });
			}

			path = path.replace("L", "M");
		}
		return path;
	}

	/**
	 * Updates and positions a label element.
	 *
	 * @ignore Exclude from docs
	 * @param label        Label element
	 * @param position     Starting position
	 * @param endPosition  Ending position
	 */
	public updateLabelElement(label: this["_labelType"], position: number, endPosition: number, location?: number) {
		if (!$type.hasValue(location)) {
			location = label.location;
		}

		position = position + (endPosition - position) * location;
		let radius = this.positionToPoint(position).y;

		let axisRendererX = this.axisRendererX;
		if (axisRendererX) {
			let axis = axisRendererX.axis;
			let point = axisRendererX.positionToPoint(axis.start + (axis.end - axis.start) * this.axisLocation);
			let angle = point.angle;

			point.x += radius * $math.cos(angle);
			point.y += radius * $math.sin(angle);

			this.positionItem(label, point);
			this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
		}
	}

	/**
	 * Updates and positions a tick element.
	 *
	 * @ignore Exclude from docs
	 * @param tick      Tick element
	 * @param position  Position
	 */
	public updateTickElement(tick: AxisTick, position: number): void {
		if (tick.element) {
			let axisRendererX = this.axisRendererX;
			if (axisRendererX) {
				let point = axisRendererX.positionToPoint(this.axisLocation);
				let angle = point.angle;

				let radius = this.positionToPoint(position).y;

				point.x += radius * $math.cos(angle);
				point.y += radius * $math.sin(angle);

				angle = $math.normalizeAngle(angle + 90);
				if (angle / 90 != Math.round(angle / 90)) {
					tick.pixelPerfect = false;
				}
				else {
					tick.pixelPerfect = true;
				}

				let tickLength = tick.length;
				if (tick.inside) {
					tickLength *= -1;
				}

				tick.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: tickLength * $math.cos(angle), y: tickLength * $math.sin(angle) });
				this.positionItem(tick, point);

				this.toggleVisibility(tick, position, 0, 1);
			}
		}
	}

	/**
	 * Updates and positions axis bullet.
	 *
	 * @ignore Exclude from docs
	 * @param bullet       AxisBullet element
	 * @param position     Starting position
	 * @param endPosition  End position
	 */
	public updateBullet(bullet: Sprite, position: number, endPosition: number): void {
		let location = 0.5;
		if (bullet instanceof AxisBullet) {
			location = bullet.location;
		}

		position = position + (endPosition - position) * location;

		let axisRendererX = this.axisRendererX;
		if (axisRendererX) {
			let point = axisRendererX.positionToPoint(this.axisLocation);
			let angle = point.angle;

			let radius = this.positionToPoint(position).y;

			point.x += radius * $math.cos(angle);
			point.y += radius * $math.sin(angle);

			angle = $math.normalizeAngle(angle + 90);

			this.positionItem(bullet, point);

			this.toggleVisibility(bullet, position, 0, 1);
		}
	}

	/**
	 * Updates and positions the base grid element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateBaseGridElement(): void {
		// @todo? zero grid for curve chart, is it needed?
	}

	/**
	 * Checks if point is within bounds of a container.
	 *
	 * @ignore Exclude from docs
	 * @param point Point coordinates
	 * @return Fits?
	 */
	public fitsToBounds(point: IPoint): boolean {
		return true;
	}

	/**
	 * [getPositionRangePath description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param startPosition  Starting position
	 * @param endPosition    End position
	 * @return SVG path
	 */
	public getPositionRangePath(startPosition: number, endPosition: number): string {

		let path = "";
		let axisRendererX = this.axisRendererX;

		if (axisRendererX) {
			let startX = axisRendererX.axis.start;
			let endX = axisRendererX.axis.end;

			let startY = this.axis.start;
			let endY = this.axis.end;

			if ((startPosition <= startY && endPosition <= startY) || (startPosition >= endY && endPosition >= endY)) {
				return path;
			}

			startPosition = $math.fitToRange(startPosition, startY, endY);
			endPosition = $math.fitToRange(endPosition, startY, endY);

			let startRadius = $math.round(this.positionToPoint(startPosition).y, 1);
			let endRadius = $math.round(this.positionToPoint(endPosition).y, 1);

			if ($type.isNaN(startRadius) || $type.isNaN(endRadius)) {
				return "";
			}

			let point = axisRendererX.positionToPoint(startX);
			let angle = point.angle;

			path = $path.moveTo(point);

			let count = Math.ceil(axisRendererX.axisLength / axisRendererX.precisionStep);
			for (let i = 0; i <= count; i++) {

				let pos = startX + i / count * (endX - startX);

				point = axisRendererX.positionToPoint(pos);
				angle = point.angle;

				let x = point.x + startRadius * $math.cos(angle);
				let y = point.y + startRadius * $math.sin(angle);

				path += $path.lineTo({ x: x, y: y });
			}
			for (let i = count; i >= 0; i--) {

				let pos = startX + i / count * (endX - startX);

				point = axisRendererX.positionToPoint(pos);
				angle = point.angle;

				let x = point.x + endRadius * $math.cos(angle);
				let y = point.y + endRadius * $math.sin(angle);

				path += $path.lineTo({ x: x, y: y });
			}

			path += $path.closePath();

		}

		return path;
	}

	/**
	 * Updates and positions an axis break element.
	 *
	 * @ignore Exclude from docs
	 * @param axisBreak Break element
	 */
	public updateBreakElement(axisBreak: AxisBreak): void {
		let axisRendererX = this.axisRendererX;

		if (axisRendererX) {

			axisBreak.fillShape.path = this.getPositionRangePath(axisBreak.startPosition, axisBreak.endPosition);

			this.toggleVisibility(axisBreak.startLine, axisBreak.startPosition, 0, 1);
			this.toggleVisibility(axisBreak.endLine, axisBreak.endPosition, 0, 1);
		}
	}

	/**
	 * Creates visual elements for and axis break.
	 *
	 * @ignore Exclude from docs
	 * @param axisBreak Axis break
	 */
	public createBreakSprites(axisBreak: AxisBreak): void {
		axisBreak.startLine = new WavedCircle();
		axisBreak.endLine = new WavedCircle();
		axisBreak.fillShape = new WavedCircle();
	}

	/**
	 * Updates some of the Axis tooltip's visual properties, related to
	 * rendering of the Axis.
	 *
	 * @todo Description (review)
	 * @ignore Exclude from docs
	 */
	public updateTooltip(): void {
		let axis: Axis = this.axis;
		if (axis) {
			/*
			let bigNum: number = 4000;
			let bbx: number = -4000;
			let bby: number = -4000;
			let bbw: number = bigNum * 2;
			let bbh: number = bigNum * 2;

			this.axis.updateTooltip(tooltipOrientation, { x: bbx, y: bby, width: bbw, height: bbh }); */
		}
	}

	/**
	 * Converts a position on the axis to a coordinate in pixels.
	 *
	 * @param  position  Position (0-1)
	 * @return           Coordinate (px)
	 */
	public positionToCoordinate(position: number): number {
		let coordinate: number;
		let axis: Axis = this.axis;
		let axisFullLength = axis.axisFullLength;

		if (axis.renderer.inversed) {
			coordinate = (axis.end - position) * axisFullLength;
		}
		else {
			coordinate = (position - axis.start) * axisFullLength;
		}

		return $math.round(-this.innerRadius - coordinate, 4);
	}


	// TODO: make this universal?

	/**
	 * Relative location of the Y axis along the length of the X axis.
	 *
	 * Values range from 0 (default) which means start of the X axis, to 1 meaning
	 * end of the X axis.
	 *
	 * @default 0
	 * @param  value  Axis location
	 */
	public set axisLocation(value: number) {
		this.setPropertyValue("axisLocation", value);
		this.invalidateAxisItems();
	}

	/**
	 * @return Axis location
	 */
	public get axisLocation(): number {
		return this.getPropertyValue("axisLocation");
	}

	/**
	 * Called when rendered is attached to an Axis, as well as a property of
	 * Axis that might affect the appearance is updated.
	 *
	 * E.g. `axis.opposite`, `axis.inside`, etc.
	 *
	 * This method is called **before** draw, so that any related setting
	 * changed in this method can be changed.
	 *
	 * @todo Description (review)
	 * @ignore Exclude from docs
	 */
	public processRenderer(): void {
		super.processRenderer();

		// can not do this in init, as axis is set later
		let axis = this.axis;

		if (axis) {
			let title = axis.title;
			if (title) {
				title.isMeasured = false;
				title.horizontalCenter = "middle";
				title.verticalCenter = "bottom";
			}
		}
	}

	/**
	 * Converts a coordinate in pixels to a relative position. (0-1)
	 *
	 * @param coordinate  Coordinate (px)
	 * @param coordinate2  Coordinate (px) Some more complicated axes need two coordinates
	 * @return Position (0-1)
	 */
	public coordinateToPosition(coordinate: number, coordinate2?: number): number {
		let axisRendererX = this.axisRendererX;
		let distance = coordinate;
		if (axisRendererX) {
			let closestPoint = axisRendererX.polyspline.allPoints[axisRendererX.polyspline.getClosestPointIndex({ x: coordinate2, y: coordinate })];
			let angle = closestPoint.angle - 90;

			distance = $math.getDistance({ x: closestPoint.x + this.innerRadius * $math.cos(angle), y: closestPoint.y + this.innerRadius * $math.sin(angle) }, { x: coordinate2, y: coordinate });
		}

		return super.coordinateToPosition(distance);
	}

	/**
	 * @ignore
	 */
	public toAxisPosition(value: number): number {
		return value;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRendererCurveY"] = AxisRendererCurveY;
