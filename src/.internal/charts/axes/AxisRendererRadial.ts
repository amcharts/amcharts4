/**
 * Module, defining Axis Renderer for radial axes.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRendererY, IAxisRendererYProperties, IAxisRendererYAdapters, IAxisRendererYEvents } from "./AxisRendererY";
import { Axis } from "./Axis";
import { AxisTick } from "./AxisTick";
import { CategoryAxis } from "./CategoryAxis";
import { RadarChart } from "../types/RadarChart";
import { IPoint } from "../../core/defs/IPoint";
import { Grid } from "./Grid";
import { AxisBreak } from "./AxisBreak";
import { WavedCircle } from "../../core/elements/WavedCircle";
import { PointerOrientation } from "../../core/elements/Tooltip";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { Percent, percent } from "../../core/utils/Percent";
import { registry } from "../../core/Registry";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";
import { Sprite } from "../../core/Sprite";
import { AxisBullet } from "./AxisBullet";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisRendererRadial]].
 */
export interface IAxisRendererRadialProperties extends IAxisRendererYProperties {

	/**
	 * Start angle of the radial axis in degrees. (0-360)
	 */
	startAngle?: number;

	/**
	 * End angle of the radial axis in degrees. (0-360)
	 */
	endAngle?: number;

	/**
	 * A grid type to display: "circles" or "polygons".
	 *
	 * @default "circles"
	 */
	gridType?: "circles" | "polygons"; //@todo: move it to GridRadial?

	/**
	 * An angle of the axis in degrees. (0-360)
	 */
	axisAngle?: number;


	/**
	 * Outer radius of the radial axis.
	 *
	 * Can either be absolute (pixels) or relative ([[Percent]]).
	 */
	radius?: number | Percent;

	/**
	 * Inner radius of the radial axis.
	 *
	 * Can either be absolute (pixels) or relative ([[Percent]]).
	 */
	innerRadius?: number | Percent;

}

/**
 * Defines events for [[AxisRendererRadial]].
 */
export interface IAxisRendererRadialEvents extends IAxisRendererYEvents { }

/**
 * Defines adapters for [[AxisRenderer]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererRadialAdapters extends IAxisRendererYAdapters, IAxisRendererRadialProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A renderer for radial axis.
 */
export class AxisRendererRadial extends AxisRendererY {

	/**
	 * Defines available properties.
	 */
	public _properties!: IAxisRendererRadialProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisRendererRadialAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisRendererRadialEvents;

	/**
	 * A related chart.
	 */
	protected _chart = new MutableValueDisposer<RadarChart>();

	/**
	 * @ignore
	 */
	public pixelRadiusReal: number = 0;

	/**
	 * Constructor.
	 *
	 * @param axis Related axis
	 */
	constructor() {

		// Init
		super();
		this.className = "AxisRendererRadial";
		this.isMeasured = false;
		this.startAngle = -90;
		this.endAngle = 270;
		this.minGridDistance = 30;
		this.gridType = "circles";
		this.axisAngle = -90;
		this.isMeasured = false;
		this.layout = "none";

		this.radius = percent(100);

		this.line.strokeOpacity = 0;

		this.labels.template.horizontalCenter = "middle";

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
	 * Returns actual length of the Axis, in pixels.
	 *
	 * @return Length (px)
	 */
	public get axisLength(): number {
		return this.pixelRadius - this.pixelInnerRadius;
	}

	/**
	 * Outer radius of the axis.
	 *
	 * Can be absolute (px) or relative ([[Percent]]).
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
	 * Outer radius in pixels.
	 *
	 * @return Outer radius (px)
	 */
	public get pixelRadius(): number {
		return $utils.relativeRadiusToValue(this.radius, this.pixelRadiusReal) || 0;
	}

	/**
	 * Inner radius of the axis.
	 *
	 * Can be absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Outer radius
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, false, false, 10, false)
	}

	/**
	 * @return Inner radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Inner radius in pixels.
	 *
	 * @return Inner radius (px)
	 */
	public get pixelInnerRadius(): number {
		return $utils.relativeRadiusToValue(this.innerRadius, this.pixelRadiusReal) || 0;
	}

	/**
	 * Chart, associated with the Axis.
	 *
	 * @ignore Exclude from docs
	 * @param value Chart
	 */
	public set chart(chart: RadarChart) {
		this._chart.set(chart, null);
	}

	/**
	 * @ignore Exclude from docs
	 * @return Chart
	 */
	public get chart(): RadarChart {
		return this._chart.get();
	}

	/**
	 * Converts relative position on axis to point coordinates.
	 *
	 * @param position  Position (0-1)
	 * @param position2  Position (0-1) Position on the second axis
	 * @return Point
	 */
	public positionToPoint(position: number, position2?: number): IPoint {
		let radius: number = $math.fitToRange(this.positionToCoordinate(position), 0, Infinity);
		return { x: radius * $math.cos(this.axisAngle), y: radius * $math.sin(this.axisAngle) };
	}

	/**
	 * Updates and positions the axis line element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateAxisLine() {
		this.line.path = $path.moveTo({ x: this.pixelInnerRadius * $math.cos(this.axisAngle), y: this.pixelInnerRadius * $math.sin(this.axisAngle) }) + $path.lineTo({ x: this.pixelRadius * $math.cos(this.axisAngle), y: this.pixelRadius * $math.sin(this.axisAngle) });

		let title = this.axis.title;
		title.valign = "none";
		title.horizontalCenter = "middle";
		title.verticalCenter = "bottom";
		title.y = - this.axisLength / 2;
		let rotation: number = 90;
		if (this.opposite) {
			if (!this.inside) {
				rotation = -90;
			}
		}
		else {
			if (this.inside) {
				rotation = -90;
			}
		}
		title.rotation = rotation;
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
		position = position + (endPosition - position) * grid.location;
		let point: IPoint = this.positionToPoint(position);
		let path: string;
		let radius: number = $math.getDistance(point);
		let startAngle: number = this.startAngle;
		let endAngle: number = this.endAngle;

		if ($type.isNumber(radius) && grid.element) {
			let chart = this.chart;
			let xAxis = chart.xAxes.getIndex(0);
			let count = 0;

			let series = chart.series.getIndex(0);

			if(series){
				count = series.dataItems.length;
			}

			// polygons are only possible if x axis is present
			// @todo: review this
			if (this.gridType == "polygons" && count > 0 && series && xAxis && xAxis instanceof CategoryAxis) {
				let gridLocation = xAxis.renderer.grid.template.location;

				let angle: number = xAxis.getAngle(series.dataItems.getIndex(0), "categoryX", gridLocation);
				path = $path.moveTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });

				for (let i = 1; i < count; i++) {
					angle = xAxis.getAngle(series.dataItems.getIndex(i), "categoryX", gridLocation);
					path += $path.lineTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });
				}

				angle = xAxis.getAngle(series.dataItems.getIndex(count - 1), "categoryX", xAxis.renderer.cellEndLocation);
				path += $path.lineTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });
			}
			else {
				path = $path.moveTo({ x: radius * $math.cos(startAngle), y: radius * $math.sin(startAngle) }) + $path.arcTo(startAngle, endAngle - startAngle, radius, radius);
			}
			grid.path = path;
		}

		this.toggleVisibility(grid, position, 0, 1);
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

		let point: IPoint = this.positionToPoint(position);

		this.positionItem(label, point);
		this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
	}

	/**
	 * Updates and positions the base grid element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateBaseGridElement(): void {
		// @todo? zero grid for radar chart, is it needed?
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
	 * Start angle of the axis in degrees. (0-360)
	 *
	 * @param value  Start angle
	 */
	public set startAngle(value: number) {
		// do not normalize angle here!
		if (this.setPropertyValue("startAngle", value)) {
			this.invalidateAxisItems();
		}
	}

	/**
	 * @return Start angle
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

	/**
	 * End angle of the axis in degrees. (0-360)
	 *
	 * @param value  End angle
	 */
	public set endAngle(value: number) {
		// do not normalize angel here!
		if (this.setPropertyValue("endAngle", value)) {
			this.invalidateAxisItems();
		}
	}

	/**
	 * @return End angle
	 */
	public get endAngle(): number {
		return this.getPropertyValue("endAngle");
	}

	/**
	 * Angle of the radial axis in degrees. (0-360)
	 *
	 * @param value  Axis angle
	 */
	public set axisAngle(value: number) {
		this.setPropertyValue("axisAngle", $math.normalizeAngle(value));
		this.invalidateAxisItems();
	}

	/**
	 * @return Axis angle
	 */
	public get axisAngle(): number {
		return this.getPropertyValue("axisAngle");
		//return $math.fitToRange(this.getPropertyValue("axisAngle"), this.startAngle, this.endAngle); // no good, as less flexible
	}

	// polygons grid type is only possible under these conditions: xAxis is available and it is CategoryAxis, also at least one series should be added to a chart

	/**
	 * Grid type for radial axis.
	 *
	 * A grid on radia axis can either be perfect circles ("circles"), or
	 * straight lines ("polygons").
	 *
	 * @default "circles"
	 * @param value  Grid type
	 */
	public set gridType(value: "circles" | "polygons") {
		this.setPropertyValue("gridType", value, true);
	}

	/**
	 * Grid type
	 */
	public get gridType(): "circles" | "polygons" {
		let axis: Axis = this.chart.xAxes.getIndex(0);
		if (axis instanceof CategoryAxis) {
			return this.getPropertyValue("gridType");
		}
		else {
			return "circles";
		}

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
		let pixelInnerRadius = this.pixelInnerRadius;
		let pixelRadius = this.axisLength + pixelInnerRadius;
		let innerRadius: number = $math.fitToRange(this.positionToCoordinate(startPosition), pixelInnerRadius, pixelRadius);
		let radius: number = $math.fitToRange(this.positionToCoordinate(endPosition), pixelInnerRadius, pixelRadius);

		//let angleCount: number = this.angleCount;
		let startAngle: number = this.startAngle;
		let endAngle: number = this.endAngle;
		let arc: number = endAngle - startAngle;

		let path: string;

		let chart = this.chart;
		let xAxis = chart.xAxes.getIndex(0);
		let series = chart.series.getIndex(0);

		let count = 0;
		if(series){
			count = series.dataItems.length;		
		}

		// polygons are only possible if x axis is present
		// @todo: review this
		if (this.gridType == "polygons" && count > 0 && series && xAxis && xAxis instanceof CategoryAxis) {
			let gridLocation = xAxis.renderer.grid.template.location;

			let angle: number = xAxis.getAngle(series.dataItems.getIndex(0), "categoryX", gridLocation);
			path = $path.moveTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });

			for (let i = 1; i < count; i++) {
				angle = xAxis.getAngle(series.dataItems.getIndex(i), "categoryX", gridLocation);
				path += $path.lineTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });
			}

			angle = xAxis.getAngle(series.dataItems.getIndex(count - 1), "categoryX", xAxis.renderer.cellEndLocation);
			path += $path.lineTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });

			path += $path.moveTo({ x: innerRadius * $math.cos(angle), y: innerRadius * $math.sin(angle) })

			for (let i = count - 1; i >= 0; i--) {
				angle = xAxis.getAngle(series.dataItems.getIndex(i), "categoryX", gridLocation);
				path += $path.lineTo({ x: innerRadius * $math.cos(angle), y: innerRadius * $math.sin(angle) });
			}
		}
		else {
			path = $path.arc(startAngle, arc, radius, innerRadius);
		}
		return path;
	}

	/**
	 * Updates and positions an axis break element.
	 *
	 * @ignore Exclude from docs
	 * @param axisBreak Break element
	 */
	public updateBreakElement(axisBreak: AxisBreak) {
		// @todo: someday we might need axis break when gridType is polygons

		let startLine: WavedCircle = <WavedCircle>axisBreak.startLine;
		let endLine: WavedCircle = <WavedCircle>axisBreak.endLine;
		let fillShape: WavedCircle = <WavedCircle>axisBreak.fillShape;

		let startPoint: IPoint = axisBreak.startPoint;
		let endPoint: IPoint = axisBreak.endPoint;

		startLine.radius = Math.abs(startPoint.y);
		endLine.radius = Math.abs(endPoint.y);
		fillShape.radius = Math.abs(endPoint.y);
		fillShape.innerRadius = Math.abs(startPoint.y);
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

			let bigNum: number = 4000;
			let bbx: number = -4000;
			let bby: number = -4000;
			let bbw: number = bigNum * 2;
			let bbh: number = bigNum * 2;
			let axisAngle: number = this.axisAngle;
			if (axisAngle < 0) {
				axisAngle += 360;
			}
			let tooltipOrientation: PointerOrientation = "vertical";
			if ((axisAngle > 45 && axisAngle < 135) || (axisAngle > 225 && axisAngle < 315)) {
				tooltipOrientation = "horizontal";
			}
			this.axis.updateTooltip(tooltipOrientation, { x: bbx, y: bby, width: bbw, height: bbh });
		}
	}

	/**
	 * Updates and positions a tick element.
	 *
	 * @ignore Exclude from docs
	 * @param tick      Tick element
	 * @param position  Position
	 */
	public updateTickElement(tick: AxisTick, position: number, endPosition: number): void {
		position = position + (endPosition - position) * tick.location;
		
		let point: IPoint = this.positionToPoint(position);
		
		if (tick.element) {
			let angle: number = $math.normalizeAngle(this.axisAngle + 90);
			if (angle / 90 != Math.round(angle / 90)) {
				tick.pixelPerfect = false;
			}
			else {
				tick.pixelPerfect = true;
			}
			let tickLength = -tick.length;
			if (tick.inside) {
				tickLength *= -1;
			}
			tick.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: tickLength * $math.cos(angle), y: tickLength * $math.sin(angle) });
		}
		this.positionItem(tick, point);

		this.toggleVisibility(tick, position, 0, 1);
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

		let point: IPoint = this.positionToPoint(position);
		
		this.positionItem(bullet, point);

		this.toggleVisibility(bullet, position, 0, 1);
	}

	/**
	 * Converts a position on the axis to a coordinate in pixels.
	 *
	 * @ignore Exclude from docs
	 * @param position  Position (0-1)
	 * @return Coordinate (px)
	 */
	public positionToCoordinate(position: number): number {
		let coordinate: number;
		let axis: Axis = this.axis;
		let axisFullLength = axis.axisFullLength;
		let innerRadius = this.pixelInnerRadius;

		if (axis.renderer.inversed) {
			coordinate = (axis.end - position) * axisFullLength + innerRadius;
		}
		else {
			coordinate = (position - axis.start) * axisFullLength + innerRadius;
		}

		return $math.round(coordinate, 1);
	}

	/**
	 * Converts a point at specific coordinates to a relative position (0-1)
	 * on the axis.
	 *
	 * @param point  Point
	 * @return Position (0-1)
	 */
	public pointToPosition(point: IPoint) {
		let coordinate = ($math.getDistance(point) - this.pixelInnerRadius);
		return this.coordinateToPosition(coordinate);
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRendererRadial"] = AxisRendererRadial;
