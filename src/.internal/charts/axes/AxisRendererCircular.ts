/**
 * Module, defining Axis Renderer for circular axes.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRenderer, IAxisRendererProperties, IAxisRendererAdapters, IAxisRendererEvents } from "./AxisRenderer";
import { Axis } from "./Axis";
import { AxisFillCircular } from "./AxisFillCircular";
import { SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { IPoint } from "../../core/defs/IPoint";
import { AxisTick } from "./AxisTick";
import { GridCircular } from "./GridCircular";
import { AxisLabelCircular } from "./AxisLabelCircular";
import { registry } from "../../core/Registry";
import { percent, Percent } from "../../core/utils/Percent";
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
 * Defines properties for [[AxisRendererCircular]].
 */
export interface IAxisRendererCircularProperties extends IAxisRendererProperties {

	/**
	 * Start angle of the circular axis in degrees (0-360).
	 *
	 * @type {number}
	 */
	startAngle?: number;

	/**
	 * End angle of the circular axis in degrees (0-360).
	 *
	 * @type {number}
	 */
	endAngle?: number;

	/**
	 * Outer radius of the circular axis.
	 *
	 * Can either be absolute (pixels) or relative ([[Percent]]).
	 *
	 * @type {number | Percent}
	 */
	radius?: number | Percent;

	/**
	 * Inner radius of the circular axis.
	 *
	 * Can either be absolute (pixels) or relative ([[Percent]]).
	 *
	 * @type {number | Percent}
	 */
	innerRadius?: number | Percent;

	/**
	 * Specifies if axis should use it's own start/end angles or the ones set on chart.
	 *
	 * @type {boolean}
	 */
	useChartAngles?: boolean;

}

/**
 * Defines events for [[AxisRendererCircular]].
 */
export interface IAxisRendererCircularEvents extends IAxisRendererEvents { }

/**
 * Defines adapters for [[AxisRenderer]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererCircularAdapters extends IAxisRendererAdapters, IAxisRendererCircularProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A renderer for circular axis.
 */
export class AxisRendererCircular extends AxisRenderer {

	/**
	 * Defines available properties.
	 *
	 * @type {IAxisRendererProperties}
	 */
	public _properties!: IAxisRendererCircularProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IAxisRendererAdapters}
	 */
	public _adapter!: IAxisRendererCircularAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IAxisRendererCircularEvents}
	 */
	public _events!: IAxisRendererCircularEvents;

	/**
	 * Defines type of the grid elements.
	 *
	 * @type {GridCircular}
	 */
	public _gridType: GridCircular;

	/**
	 * Defines type for the fill elements.
	 *
	 * @type {AxisFillCircular}
	 */
	public _fillType: AxisFillCircular;

	/**
	 * Defines type for the label elements.
	 *
	 * @type {AxisLabelCircular}
	 */
	public _labelType: AxisLabelCircular;

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

		// axis.layout = "none"; // does not trigger redraw when size changes
		this.layout = "none";

		this.className = "AxisRendererCircular";
		this.isMeasured = false;
		this.startAngle = -90;
		this.endAngle = 270;

		this.useChartAngles = true;
		this.radius = percent(100);

		this.isMeasured = false;

		this.grid.template.location = 0;

		this.labels.template.location = 0;
		this.labels.template.radius = 15;

		this.ticks.template.location = 0;
		this.ticks.template.pixelPerfect = false;
		this.tooltipLocation = 0;

		this.line.strokeOpacity = 0;

		this.applyTheme();
	}

	/**
	* @ignore
	*/
	public setAxis(axis: Axis) {
		super.setAxis(axis);
		axis.isMeasured = false;

		// modify x and y so that tooltip would always be on circle
		let tooltip = axis.tooltip;

		tooltip.adapter.add("dx", (x, target) => {
			let point: IPoint = $utils.svgPointToSprite({ x: target.pixelX, y: target.pixelY }, this);
			return this.pixelRadius * Math.cos(Math.atan2(point.y, point.x)) - point.x;
		});

		tooltip.adapter.add("dy", (y, target) => {
			let point: IPoint = $utils.svgPointToSprite({ x: target.pixelX, y: target.pixelY }, this);
			return this.pixelRadius * Math.sin(Math.atan2(point.y, point.x)) - point.y;
		});
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
		return 2 * Math.PI * this.pixelRadius;
	}

	/**
	 * Outer radius of the axis.
	 *
	 * Can be absolute (px) or relative ([[Percent]]).
	 *
	 * @param {number | Percent}  value  Outer radius
	 */
	public set radius(value: number | Percent) {
		if (this.setPercentProperty("radius", value, false, false, 10, false)) {
			if (this.axis) {
				this.axis.invalidate();
			}
		}
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
	 * @param {number | Percent}  value  Inner radius
	 */
	public set innerRadius(value: number | Percent) {
		if (this.setPercentProperty("innerRadius", value, false, false, 10, false)) {
			if (this.axis) {
				this.axis.invalidate();
			}
		}
	}

	/**
	 * @return {number | Percent} Inner radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Specifies if axis should use its own `startAngle` and `endAngle` or
	 * inherit them from relative properties from chart.
	 *
	 * @default false
	 * @param {boolean}  value  Use chart's angles
	 */
	public set useChartAngles(value: boolean) {
		this.setPropertyValue("useChartAngles", value);
	}

	/**
	 * @return {boolean} Use chart angles
	 */
	public get useChartAngles(): boolean {
		return this.getPropertyValue("useChartAngles");
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
	 * Converts relative position on axis to point coordinates.
	 *
	 * @param  {number}  position  Position (0-1)
	 * @return {IPoint}            Point
	 */
	public positionToPoint(position: number): IPoint {		
		let coordinate: number = this.positionToCoordinate(position);
		let angle: number = this.startAngle + (this.endAngle - this.startAngle) * coordinate / this.axisLength;
		return { x: this.pixelRadius * $math.cos(angle), y: this.pixelRadius * $math.sin(angle) };
	}

	/**
	 * Converts relative position (0-1) on axis to angle in degrees (0-360).
	 *
	 * @param  {number}  position  Position (0-1)
	 * @return {number}            Angle (0-360)
	 */
	public positionToAngle(position: number): number {
		let axis: Axis = this.axis;

		let arc: number = (this.endAngle - this.startAngle) / (axis.end - axis.start);

		let angle: number;

		if (axis.renderer.inversed) {
			angle = this.startAngle + (axis.end - position) * arc;
		}
		else {
			angle = this.startAngle + (position - axis.start) * arc;
		}

		return $math.round(angle, 3);
	}

	/**
	 * Updates and positions the axis line element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateAxisLine() {
		let radius: number = this.pixelRadius;
		let startAngle: number = this.startAngle;
		let endAngle: number = this.endAngle;

		let arc: number = endAngle - startAngle;
		this.line.path = $path.moveTo({ x: radius * $math.cos(startAngle), y: radius * $math.sin(startAngle) }) + $path.arcTo(startAngle, arc, radius, radius);
	}

	/**
	 * Updates and positions a grid element.
	 *
	 * @ignore Exclude from docs
	 * @param {Grid}    grid         Grid element
	 * @param {number}  position     Starting position
	 * @param {number}  endPosition  End position
	 */
	public updateGridElement(grid: GridCircular, position: number, endPosition: number) {
		position = position + (endPosition - position) * grid.location;

		let point: IPoint = this.positionToPoint(position);
		if (grid.element) {
			let angle: number = $math.DEGREES * Math.atan2(point.y, point.x);
			let radius: number = $utils.relativeRadiusToValue($type.hasValue(grid.radius) ? grid.radius : percent(100), this.pixelRadius);

			let gridInnerRadius = $utils.relativeRadiusToValue(grid.innerRadius, this.pixelRadius);
			grid.zIndex = 0;

			let innerRadius: number = $utils.relativeRadiusToValue($type.isNumber(gridInnerRadius) ? gridInnerRadius : this.innerRadius, this.pixelRadius, true);
			grid.path = $path.moveTo({ x: innerRadius * $math.cos(angle), y: innerRadius * $math.sin(angle) }) + $path.lineTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) });
		}
		this.toggleVisibility(grid, position, 0, 1);
	}

	/**
	 * Updates and positions a tick element.
	 *
	 * @ignore Exclude from docs
	 * @param {AxisTick}  tick         Tick element
	 * @param {number}    position     Starting position
	 * @param {number}    endPosition  End position
	 */
	public updateTickElement(tick: AxisTick, position: number, endPosition: number) {

		position = position + (endPosition - position) * tick.location;

		let point: IPoint = this.positionToPoint(position);

		if (tick.element) {
			let radius: number = this.pixelRadius;
			let angle: number = $math.DEGREES * Math.atan2(point.y, point.x);
			let tickLength: number = tick.length;
			if (tick.inside) {
				tickLength = -tickLength;
			}
			tick.zIndex = 1;
			tick.path = $path.moveTo({ x: radius * $math.cos(angle), y: radius * $math.sin(angle) }) + $path.lineTo({ x: (radius + tickLength) * $math.cos(angle), y: (radius + tickLength) * $math.sin(angle) });
		}

		this.toggleVisibility(tick, position, 0, 1);
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

		label.fixPoint(point, this.pixelRadius);
		label.zIndex = 2;

		this.positionItem(label, point);

		this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
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
	 * Start angle of the axis in degrees (0-360).
	 *
	 * @param {number}  value  Start angle
	 */
	public set startAngle(value: number) {
		// do not normalize angel here!
		if (this.setPropertyValue("startAngle", value)) {
			if (this.axis) {
				this.axis.invalidate();
			}
		}
	}

	/**
	 * @return {number} Start angle
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

	/**
	 * End angle of the axis in degrees (0-360).
	 *
	 * @param {number}  value  End angle
	 */
	public set endAngle(value: number) {
		// do not normalize angel here!
		if (this.setPropertyValue("endAngle", value)) {
			if (this.axis) {
				this.axis.invalidate();
			}
		}
	}

	/**
	 * @return {number} End angle
	 */
	public get endAngle(): number {
		return this.getPropertyValue("endAngle");
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
	public getPositionRangePath(startPosition: number, endPosition: number, radius?: number | Percent, innerRadius?: number | Percent, cornerRadius?: number): string {
		let path: string = "";
		if ($type.isNumber(startPosition) && $type.isNumber(endPosition)) {

			if (!$type.hasValue(radius)) {
				radius = this.radius;
			}

			startPosition = $math.max(startPosition, this.axis.start);
			endPosition = $math.min(endPosition, this.axis.end);

			if (endPosition < startPosition) {
				endPosition = startPosition;
			}

			let pixelRadius: number = $utils.relativeRadiusToValue(radius, this.pixelRadius);
			let pixelInnerRadius: number = $utils.relativeRadiusToValue(innerRadius, this.pixelRadius, true);

			let startAngle: number = this.positionToAngle(startPosition);
			let endAngle: number = this.positionToAngle(endPosition);

			let arc: number = endAngle - startAngle;

			path = $path.arc(startAngle, arc, pixelRadius, pixelInnerRadius, pixelRadius, cornerRadius);
		}

		return path;
	}

	/**
	 * Returns a new grid element, suitable for this Axis Renderer type.
	 *
	 * @return {GridCircular} Grid element
	 */
	public createGrid(): this["_gridType"] {
		return new GridCircular();
	}

	/**
	 * Returns a new fill element, suitable for this Axis Renderer type.
	 *
	 * @return {AxisFillCircular} Fill element
	 */
	public createFill(axis: Axis): this["_fillType"] {
		return new AxisFillCircular(axis);
	}

	/**
	 * Returns a new label element, suitable for this Axis Renderer type.
	 *
	 * @return {AxisLabelCircular} Label element
	 */
	public createLabel(): this["_labelType"] {
		return new AxisLabelCircular();
	}


	/**
	 * Converts a point at specific coordinates to a relative position (0-1)
	 * on the axis.
	 *
	 * @param  {IPoint}  point  Point
	 * @return {number}         Position (0-1)
	 */
	public pointToPosition(point: IPoint) {		
		let angle = $math.fitAngleToRange($math.getAngle(point), this.startAngle, this.endAngle);		
		return this.coordinateToPosition((angle - this.startAngle) / 360 * this.axisLength);
	}	
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRendererCircular"] = AxisRendererCircular;
