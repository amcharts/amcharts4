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
import { AxisRendererRadial } from "./AxisRendererRadial";
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
import { Sprite } from "../../core/Sprite";
import { AxisBullet } from "./AxisBullet";
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
	 */
	startAngle?: number;

	/**
	 * End angle of the circular axis in degrees (0-360).
	 */
	endAngle?: number;

	/**
	 * Outer radius of the circular axis.
	 *
	 * Can either be absolute (pixels) or relative ([[Percent]]).
	 */
	radius?: number | Percent;

	/**
	 * Inner radius of the circular axis.
	 *
	 * Can either be absolute (pixels) or relative ([[Percent]]).
	 */
	innerRadius?: number | Percent;

	/**
	 * Specifies if axis should use it's own start/end angles or the ones set on chart.
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
	 */
	public _properties!: IAxisRendererCircularProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisRendererCircularAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisRendererCircularEvents;

	/**
	 * Defines type of the grid elements.
	 */
	public _gridType: GridCircular;

	/**
	 * Defines type for the fill elements.
	 */
	public _fillType: AxisFillCircular;

	/**
	 * Defines type for the label elements.
	 */
	public _labelType: AxisLabelCircular;

	/**
	 * @ignore
	 */
	public pixelRadiusReal: number = 0;

	public axisRendererY: AxisRendererRadial;

	/**
	 * Constructor.
	 *
	 * @param axis Related axis
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
	 * @return Length (px)
	 */
	public get axisLength(): number {
		return 2 * Math.PI * this.pixelRadius;
	}

	/**
	 * Outer radius of the axis.
	 *
	 * Can be absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Outer radius
	 */
	public set radius(value: number | Percent) {
		if (this.setPercentProperty("radius", value, false, false, 10, false)) {
			if (this.axis) {
				this.axis.invalidate();
			}
		}
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
	 * @param value  Inner radius
	 */
	public set innerRadius(value: number | Percent) {
		if (this.setPercentProperty("innerRadius", value, false, false, 10, false)) {
			if (this.axis) {
				this.axis.invalidate();
			}
		}
	}

	/**
	 * @return Inner radius
	 */
	public get innerRadius(): number | Percent {
		return this.getPropertyValue("innerRadius");
	}

	/**
	 * Specifies if axis should use its own `startAngle` and `endAngle` or
	 * inherit them from relative properties from chart.
	 *
	 * @default false
	 * @param value  Use chart's angles
	 */
	public set useChartAngles(value: boolean) {
		this.setPropertyValue("useChartAngles", value);
	}

	/**
	 * @return Use chart angles
	 */
	public get useChartAngles(): boolean {
		return this.getPropertyValue("useChartAngles");
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
	 * Converts relative position on axis to point coordinates.
	 *
	 * @param position  Position (0-1)
	 * @param position2  Position (0-1) Position on the second axis
	 * @return Point
	 */
	public positionToPoint(position: number, position2?: number): IPoint {

		if (!$type.isNumber(position2)) {
			position2 = 1;
		}

		let coordinate: number = this.positionToCoordinate(position);
		let angle: number = this.startAngle + (this.endAngle - this.startAngle) * coordinate / this.axisLength;
		let radius = this.pixelRadius;
		let innerRadius = this.pixelInnerRadius;

		if (this.axisRendererY) {
			let realRadius = $math.fitToRange(this.axisRendererY.positionToCoordinate(position2), 0, Infinity)
			return { x: realRadius * $math.cos(angle), y: realRadius * $math.sin(angle) };
		}

		return { x: $math.cos(angle) * innerRadius + (radius - innerRadius) * $math.cos(angle) * position2, y: $math.sin(angle) * innerRadius + (radius - innerRadius) * $math.sin(angle) * position2 };
	}

	/**
	 * Converts relative position (0-1) on axis to angle in degrees (0-360).
	 *
	 * @param position  Position (0-1)
	 * @return Angle (0-360)
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
	 * @param grid         Grid element
	 * @param position     Starting position
	 * @param endPosition  End position
	 */
	public updateGridElement(grid: GridCircular, position: number, endPosition: number) {
		position = position + (endPosition - position) * grid.location;

		let point: IPoint = this.positionToPoint(position);
		if ($type.isNumber(point.x) && $type.isNumber(point.y) && grid.element) {
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
	 * @param tick         Tick element
	 * @param position     Starting position
	 * @param endPosition  End position
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
		let radius: number = this.pixelRadius;
		let angle: number = $math.DEGREES * Math.atan2(point.y, point.x);

		point = { x: radius * $math.cos(angle), y: radius * $math.sin(angle) }

		this.positionItem(bullet, point);

		this.toggleVisibility(bullet, position, 0, 1);
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

		label.fixPosition(this.positionToAngle(position), this.pixelRadius);
		label.zIndex = 2;

		this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
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
	 * Start angle of the axis in degrees (0-360).
	 *
	 * @param value  Start angle
	 */
	public set startAngle(value: number) {
		// do not normalize angel here!
		if (this.setPropertyValue("startAngle", value)) {
			this.invalidateAxisItems();
			if (this.axis) {
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return Start angle
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

	/**
	 * End angle of the axis in degrees (0-360).
	 *
	 * @param value  End angle
	 */
	public set endAngle(value: number) {
		// do not normalize angel here!
		if (this.setPropertyValue("endAngle", value)) {
			this.invalidateAxisItems();
			if (this.axis) {
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return End angle
	 */
	public get endAngle(): number {
		return this.getPropertyValue("endAngle");
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
	 * @return Grid element
	 */
	public createGrid(): this["_gridType"] {
		return new GridCircular();
	}

	/**
	 * Returns a new fill element, suitable for this Axis Renderer type.
	 *
	 * @return Fill element
	 */
	public createFill(axis: Axis): this["_fillType"] {
		return new AxisFillCircular(axis);
	}

	/**
	 * Returns a new label element, suitable for this Axis Renderer type.
	 *
	 * @return Label element
	 */
	public createLabel(): this["_labelType"] {
		return new AxisLabelCircular();
	}


	/**
	 * Converts a point at specific coordinates to a relative position (0-1)
	 * on the axis.
	 *
	 * @param point  Point
	 * @return Position (0-1)
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
