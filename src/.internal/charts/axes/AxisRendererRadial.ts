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
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { IPoint } from "../../core/defs/IPoint";
import { Grid } from "./Grid";
import { AxisBreak } from "./AxisBreak";
import { WavedCircle } from "../../core/elements/WavedCircle";
import { SortedListTemplate } from "../../core/utils/SortedList";
import { PointerOrientation } from "../../core/elements/Tooltip";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { Percent, percent } from "../../core/utils/Percent";
import { registry } from "../../core/Registry";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";


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
	 *
	 * @type {number}
	 */
	startAngle?: number;

	/**
	 * End angle of the radial axis in degrees. (0-360)
	 *
	 * @type {number}
	 */
	endAngle?: number;

	/**
	 * A grid type to display: "circles" or "polygons".
	 *
	 * @default "circles"
	 * @type {"circles" | "polygons"}
	 */
	gridType?: "circles" | "polygons"; //@todo: move it to GridRadial?

	/**
	 * An angle of the axis in degrees. (0-360)
	 *
	 * @type {number}
	 */
	axisAngle?: number;


	/**
	 * Outer radius of the radial axis.
	 *
	 * Can either be absolute (pixels) or relative ([[Percent]]).
	 *
	 * @type {number | Percent}
	 */
	radius?: number | Percent;

	/**
	 * Inner radius of the radial axis.
	 *
	 * Can either be absolute (pixels) or relative ([[Percent]]).
	 *
	 * @type {number | Percent}
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
	 *
	 * @type {AxisRendererProperties}
	 */
	public _properties!: IAxisRendererRadialProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {AxisRendererAdapters}
	 */
	public _adapter!: IAxisRendererRadialAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IAxisRendererRadialEvents}
	 */
	public _events!: IAxisRendererRadialEvents;

	/**
	 * A related chart.
	 *
	 * @type {MutableValueDisposer}
	 */
	protected _chart = new MutableValueDisposer<RadarChart>();

	/**
	 * @ignore
	 */
	public pixelRadiusReal: number = 0;

	/**
	 * Constructor.
	 *
	 * @param {Axis} axis Related axis
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
	 * @return {number} Length (px)
	 */
	public get axisLength(): number {
		return this.pixelRadius - this.pixelInnerRadius;
	}

	/**
	 * Outer radius of the axis.
	 *
	 * Can be absolute (px) or relative ([[Percent]]).
	 *
	 * @param {number | Percent}  value  Outer radius
	 */
	public set radius(value: number | Percent) {
		this.setPercentProperty("radius", value, false, false, 10, false);
	}

	/**
	 * @return {number | Percent} Outer radius
	 */
	public get radius(): number | Percent {
		return this.getPropertyValue("radius");
	}

	/**
	 * Outer radius in pixels.
	 *
	 * @return {number} Outer radius (px)
	 */
	public get pixelRadius(): number {
		return $utils.relativeRadiusToValue(this.radius, this.pixelRadiusReal) || 0;
	}

	/**
	 * Inner radius of the axis.
	 *
	 * Can be absolute (px) or relative ([[Percent]]).
	 *
	 * @param {number | Percent}  value  Outer radius
	 */
	public set innerRadius(value: number | Percent) {
		this.setPercentProperty("innerRadius", value, false, false, 10, false)
	}

	/**
	 * @return {number | Percent} Inner radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Inner radius in pixels.
	 *
	 * @return {number} Inner radius (px)
	 */
	public get pixelInnerRadius(): number {
		return $utils.relativeRadiusToValue(this.innerRadius, this.pixelRadiusReal) || 0;
	}

	/**
	 * Chart, associated with the Axis.
	 *
	 * @ignore Exclude from docs
	 * @param {RadarChart} value Chart
	 */
	public set chart(chart: RadarChart) {
		this._chart.set(chart, null);
	}

	/**
	 * @ignore Exclude from docs
	 * @return {RadarChart} Chart
	 */
	public get chart(): RadarChart {
		return this._chart.get();
	}

	/**
	 * Converts relative position on axis to point coordinates.
	 *
	 * @param  {number}  position  Position (0-1)
	 * @return {IPoint}            Point
	 */
	public positionToPoint(position: number): IPoint {
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
	 * @param {Grid}    grid         Grid element
	 * @param {number}  position     Starting position
	 * @param {number}  endPosition  End position
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
			let count = chart.dataItems.length;
			let series = chart.series.getIndex(0);

			// polygons are only possible if x axis is present
			// @todo: review this
			if (this.gridType == "polygons" && count > 0 && series && xAxis && xAxis instanceof CategoryAxis) {
				let gridLocation = xAxis.renderer.grid.template.location;

				let angle: number = xAxis.getAngle(series.dataItems.getIndex(0), "categoryX", gridLocation);
				path = $path.moveTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });
				let count: number = chart.dataItems.length;

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
	 * @param {AxisLabel}  label        Label element
	 * @param {number}     position     Starting position
	 * @param {number}     endPosition  Ending position
	 */
	public updateLabelElement(label: this["_labelType"], position: number, endPosition: number, location?:number) {

		if(!$type.hasValue(location)){
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
	 * @param  {IPoint}   point Point coordinates
	 * @return {boolean}         Fits?
	 */
	public fitsToBounds(point: IPoint): boolean {
		return true;
	}

	/**
	 * Start angle of the axis in degrees. (0-360)
	 *
	 * @param {number}  value  Start angle
	 */
	public set startAngle(value: number) {
		// do not normalize angel here!
		this.setPropertyValue("startAngle", value);
		this.invalidateAxisItems();
	}

	/**
	 * @return {number} Start angle
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

	/**
	 * End angle of the axis in degrees. (0-360)
	 *
	 * @param {number}  value  End angle
	 */
	public set endAngle(value: number) {
		// do not normalize angel here!
		this.setPropertyValue("endAngle", value);
		this.invalidateAxisItems();
	}

	/**
	 * @return {number} End angle
	 */
	public get endAngle(): number {
		return this.getPropertyValue("endAngle");
	}

	/**
	 * Angle of the radial axis in degrees. (0-360)
	 *
	 * @param {number}  value  Axis angle
	 */
	public set axisAngle(value: number) {
		this.setPropertyValue("axisAngle", $math.normalizeAngle(value));
		this.invalidateAxisItems();
	}

	/**
	 * @return {number} Axis angle
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
	 * @param {"circles" | "polygons"}  value  Grid type
	 */
	public set gridType(value: "circles" | "polygons") {
		this.setPropertyValue("gridType", value, true);
	}

	/**
	 * @type {"circles" | "polygons"} Grid type
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
	 * @param  {number}  startPosition  Starting position
	 * @param  {number}  endPosition    End position
	 * @return {string}                 SVG path
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
		let count = chart.dataItems.length;
		let series = chart.series.getIndex(0);

		// polygons are only possible if x axis is present
		// @todo: review this
		if (this.gridType == "polygons" && count > 0 && series && xAxis && xAxis instanceof CategoryAxis) {
			let gridLocation = xAxis.renderer.grid.template.location;

			let angle: number = xAxis.getAngle(series.dataItems.getIndex(0), "categoryX", gridLocation);
			path = $path.moveTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });
			let count: number = chart.dataItems.length;

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
	 * @param {AxisBreak} axisBreak Break element
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
	 * @param {AxisBreak} axisBreak Axis break
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
	 * @param {AxisTick}  tick      Tick element
	 * @param {number}    position  Position
	 */
	public updateTickElement(tick: AxisTick, position: number): void {
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
	 * Converts a position on the axis to a coordinate in pixels.
	 *
	 * @ignore Exclude from docs
	 * @param  {number}  position  Position (0-1)
	 * @return {number}            Coordinate (px)
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
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRendererRadial"] = AxisRendererRadial;
