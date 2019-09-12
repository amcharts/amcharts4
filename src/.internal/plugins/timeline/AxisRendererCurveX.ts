/**
 * Module, defining Axis Renderer for curved axes.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRendererX, IAxisRendererXAdapters, IAxisRendererXEvents, IAxisRendererXProperties } from "../../charts/axes/AxisRendererX";
//import { AxisFillCircular } from "./AxisFillCircular";
import { AxisRendererCurveY } from "./AxisRendererCurveY";
import { CurveChart } from "./CurveChart";
import { Axis } from "../../charts/axes/Axis";
import { IPoint, IOrientationPoint } from "../../core/defs/IPoint";
import { Sprite } from "../../core/Sprite";
import { GridCircular } from "../../charts/axes/GridCircular";
import { AxisLabelCircular } from "../../charts/axes/AxisLabelCircular";
import { AxisFillCircular } from "../../charts/axes/AxisFillCircular";
import { registry } from "../../core/Registry";
import { Polyspline } from "../../core/elements/Polyspline";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";
import * as $type from "../../core/utils/Type";
import * as $array from "../../core/utils/Array";
import { AxisTick } from "../../charts/axes/AxisTick";
import { AxisBullet } from "../../charts/axes/AxisBullet";
import { AxisBreak } from "../../charts/axes/AxisBreak";
import { wavedLine } from "../../core/rendering/Smoothing";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisRendererCurveX]].
 */
export interface IAxisRendererCurveXProperties extends IAxisRendererXProperties {

	/**
	 * A line object representing curve of the axis.
	 */
	polyspline?: Polyspline;

	/**
	 * Precision setting to use when drawing chart objects. Basically, it's
	 * number of pixels that a control point should be added at.
	 *
	 * The smaller the number, the finer line. However, small number will impact
	 * the performace.
	 *
	 * Depending on actual chart configuration, you might need to find the best
	 * possible value to balance between detail and good performance.
	 *
	 * @default 10
	 */
	precisionStep?: number;

	/**
	 * Should the chart be scaled automatically, to fit into container?
	 *
	 * @default true
	 */
	autoScale?: boolean;

	/**
	 * Should chart be centered within chart area?
	 *
	 * @default true
	 */
	autoCenter?: boolean;

	/**
	 * Array of control points to draw axis curve along.
	 */
	points?: IPoint[];

}

/**
 * Defines events for [[AxisRendererCurveX]].
 */
export interface IAxisRendererCurveXEvents extends IAxisRendererXEvents { }

/**
 * Defines adapters for [[AxisRenderer]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererCurveXAdapters extends IAxisRendererXAdapters, IAxisRendererCurveXProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A renderer for "horizontal" curve axis.
 */
export class AxisRendererCurveX extends AxisRendererX {

	/**
	 * Defines available properties.
	 */
	public _properties!: IAxisRendererCurveXProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisRendererCurveXAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisRendererCurveXEvents;

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

	/**
	 * @ignore
	 */
	public axisRendererY: AxisRendererCurveY;

	/**
	 * @readonly
	 * @ignore
	 */
	public autoScaleScale: number = 1;

	/**
	 * @ignore
	 */
	protected _tempSprite: Sprite;

	/**
	 * @ignore
	 */
	protected _pointsChanged: boolean;

	/**
	 * Constructor.
	 */
	constructor() {

		// Init
		super();

		// axis.layout = "none"; // does not trigger redraw when size changes

		// axis.layout = "none"; // does not trigger redraw when size changes
		this.layout = "none";

		this.autoScale = true;

		this.autoCenter = true;

		this.isMeasured = false;

		this.className = "AxisRendererCurveX";

		this.line.strokeOpacity = 1;

		this.precisionStep = 10;

		this.points = [{ x: -300, y: 0 }, { x: 300, y: 0 }];

		this._tempSprite = this.createChild(Sprite);
		this._tempSprite.visible = false;

		this.applyTheme();


	}

	/**
	 * Returns actual length of the Axis, in pixels.
	 *
	 * @return Length (px)
	 */
	public get axisLength(): number {
		return this.polyspline.distance;
	}

	/**
	 * Updates and positions the axis line element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateAxisLine() {
		this.line.path = this.polyspline.path;
	}

	/**
	 * A [[Polyspline]] elment that represents axis shape / curve.
	 * 
	 * @param  value  Polyspline
	 */
	public set polyspline(value: Polyspline) {
		this.setPropertyValue("polyspline", value, true);
		value.parent = this;
	}

	/**
	 * @return Polyspline
	 */
	public get polyspline(): Polyspline {
		let polyspline = this.getPropertyValue("polyspline");
		if (!polyspline) {
			polyspline = this.createChild(Polyspline);
			polyspline.tensionX = 1;
			polyspline.tensionY = 1;

			this.polyspline = polyspline;
		}
		return polyspline;
	}

	/**
	 * Should the chart be scaled automatically, to fit into container?
	 *
	 * @default true
	 * @param  value  Auto-scale?
	 */
	public set autoScale(value: boolean) {
		this.setPropertyValue("autoScale", value, true);
	}

	/**
	 * @return Auto-scale?
	 */
	public get autoScale(): boolean {
		return this.getPropertyValue("autoScale");
	}

	/**
	 * Should chart be centered within chart area?
	 *
	 * @default true
	 * @param  value  Auto-center?
	 */
	public set autoCenter(value: boolean) {
		this.setPropertyValue("autoCenter", value, true);
	}

	/**
	 * @return {boolean} Auto-center?
	 */
	public get autoCenter(): boolean {
		return this.getPropertyValue("autoCenter");
	}

	/**
	 * Precision setting to use when drawing chart objects. Basically, it's
	 * number of pixels that a control point should be added at.
	 *
	 * The smaller the number, the finer line. However, small number will impact
	 * the performace.
	 *
	 * Depending on actual chart configuration, you might need to find the best
	 * possible value to balance between detail and good performance.
	 *
	 * @default 10
	 * @param  value  Precision step
	 */
	public set precisionStep(value: number) {
		this.setPropertyValue("precisionStep", value, true);
	}

	/**
	 * @return Precision step
	 */
	public get precisionStep(): number {
		return this.getPropertyValue("precisionStep");
	}

	/**
	 * An array of control points that define axis curve.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/chart-types/timeline/#Control_points} for more info
	 * @param  value  Control points
	 */
	public set points(value: IPoint[]) {
		if (this.setPropertyValue("points", value, true)) {
			this._pointsChanged = true;
			this.polyspline.segments = [value];
		}
	}

	/**
	 * @return Control points
	 */
	public get points(): IPoint[] {
		return this.getPropertyValue("points");
	}

	/**
	* @ignore
	*/
	public setAxis(axis: Axis): void {
		super.setAxis(axis);
		if (axis && axis.chart) {
			let chart = <CurveChart>axis.chart;
			this._disposers.push(chart.curveContainer.events.on("positionchanged", () => {
				this.handleSizeChange();
			}))

			this._disposers.push(chart.events.on("maxsizechanged", () => {
				this.handleSizeChange();
			}))
		}
	}

	/**
	 * A handler for when axis size changes.
	 */
	protected handleSizeChange(): void {

		if (this._pointsChanged) {
			let pp = this.axis.getPositionRangePath(0, 1);
			this._tempSprite.path = pp;
			this._pointsChanged = false;
		}

		if (this.points) {
			let chart = <CurveChart>this.axis.chart;
			let curveContainer = chart.curveContainer;

			let mw = chart.plotContainer.maxWidth - curveContainer.pixelPaddingLeft - curveContainer.pixelPaddingRight;
			let mh = chart.plotContainer.maxHeight - curveContainer.pixelPaddingTop - curveContainer.pixelPaddingBottom;

			let bbox = this._tempSprite.element.getBBox();
			let centerPoint = { x: 0, y: 0 };

			if (this.autoCenter) {
				centerPoint = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
			}

			let scale = 1;
			if (this.autoScale) {
				scale = $math.min(mw / bbox.width, mh / bbox.height);
			}

			let modifiedPoints: IPoint[] = [];
			$array.each(this.points, (point) => {
				modifiedPoints.push({ x: (point.x - centerPoint.x) * scale, y: (point.y - centerPoint.y) * scale });
			})

			this.polyspline.segments = [modifiedPoints];
		}
	}

	/**
	 * Converts relative position on axis to point coordinates.
	 *
	 * @param position  Position (0-1)
	 * @param position2  Position (0-1) Position on the second axis
	 * @return Point
	 */
	public positionToPoint(position: number, position2?: number): IOrientationPoint {

		let axis = this.axis;

		position = (position - axis.start) / (axis.end - axis.start);

		let point = this.polyspline.positionToPoint(position, true);
		point.angle += 90;

		let axisRendererY = this.axisRendererY;

		if ($type.isNumber(position2) && axisRendererY) {
			position2 = axisRendererY.axis.toAxisPosition(position2);
			let radius = axisRendererY.positionToPoint(position2).y;

			point.x += radius * $math.cos(point.angle);
			point.y += radius * $math.sin(point.angle);
		}

		return point;
	}

	/**
	 * Converts relative position (0-1) on axis to angle in degrees (0-360).
	 *
	 * @param position  Position (0-1)
	 * @return Angle (0-360)
	 */
	public positionToAngle(position: number): number {

		let axis = this.axis;
		position = $math.max(0, (position - axis.start) / (axis.end - axis.start));

		return this.polyspline.positionToPoint(position, true).angle + 90;
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
		if (grid.element) {
			position = position + (endPosition - position) * grid.location;

			grid.zIndex = 0;

			grid.path = this.getGridPath(position);

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

		let point = this.positionToPoint(position);

		let angle: number = point.angle;
		let axisRendererY = this.axisRendererY;
		if (axisRendererY) {
			let radius: number = -axisRendererY.radius;
			let innerRadius: number = -axisRendererY.innerRadius;

			return $path.moveTo({ x: point.x + innerRadius * $math.cos(angle), y: point.y + innerRadius * $math.sin(angle) }) + $path.lineTo({ x: point.x + radius * $math.cos(angle), y: point.y + radius * $math.sin(angle) });
		}
		return "";
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

			let point = this.positionToPoint(position);
			let angle = point.angle;

			let tickLength = tick.length;
			if (tick.inside) {
				tickLength *= -1;
			}

			tick.path = $path.moveTo({ x: point.x, y: point.y }) + $path.lineTo({ x: point.x + tickLength * $math.cos(angle), y: point.y + tickLength * $math.sin(angle) });
			this.toggleVisibility(tick, position, 0, 1);
		}

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

		label.x = point.x;
		label.y = point.y;
		label.zIndex = 2;

		this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
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

		let axisRendererY = this.axisRendererY;
		if (axisRendererY) {

			if (startPosition > endPosition) {
				let temp = startPosition;
				startPosition = endPosition;
				endPosition = temp;
			}

			let startY = axisRendererY.axis.start;
			let endY = axisRendererY.axis.end;

			let startX = this.axis.start;
			let endX = this.axis.end;

			if ((startPosition <= startX && endPosition <= startX) || (startPosition >= endX && endPosition >= endX)) {
				return path;
			}

			startPosition = $math.fitToRange(startPosition, startX, endX);
			endPosition = $math.fitToRange(endPosition, startX, endX);

			if (endPosition == startX || startPosition == endX) {
				return path;
			}

			if (endPosition == startPosition) {
				return path;
			}

			let startRadius = $math.round(axisRendererY.positionToPoint(startY).y, 1) | 0;
			let endRadius = $math.round(axisRendererY.positionToPoint(endY).y, 1) | 0;

			let point = this.positionToPoint(startPosition);
			let angle = point.angle;

			path = $path.moveTo(point);

			let count = Math.ceil(this.axisLength / this.precisionStep * (endPosition - startPosition) / (endX - startX));

			for (let i = 0; i <= count; i++) {

				let pos = startPosition + i / count * (endPosition - startPosition);

				point = this.positionToPoint(pos);

				angle = point.angle;

				let x = point.x + startRadius * $math.cos(angle);
				let y = point.y + startRadius * $math.sin(angle);

				path += $path.lineTo({ x: x, y: y });
			}
			for (let i = count; i >= 0; i--) {

				let pos = startPosition + i / count * (endPosition - startPosition);

				point = this.positionToPoint(pos);
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
	 * Updates and positions the base grid element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateBaseGridElement(): void {

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

		let point = this.positionToPoint(position);
		//let angle = point.angle;

		bullet.moveTo({ x: point.x, y: point.y });
		//bullet.rotation = angle - 90;

		this.toggleVisibility(bullet, position, 0, 1);
	}

	/**
	 * Updates and positions an axis break element.
	 *
	 * @ignore Exclude from docs
	 * @param axisBreak Break element
	 */
	public updateBreakElement(axisBreak: AxisBreak): void {
		let axisRendererY = this.axisRendererY;

		if (axisRendererY) {

			let startPosition = axisBreak.startPosition;
			let endPosition = axisBreak.endPosition;

			let startAngle = this.positionToAngle(startPosition);
			let startPoint = this.positionToPoint(startPosition);

			let endAngle = this.positionToAngle(endPosition);
			let endPoint = this.positionToPoint(endPosition);

			let startLine = axisBreak.startLine;
			let endLine = axisBreak.endLine;
			let fillShape = axisBreak.fillShape;

			let radius: number = -axisRendererY.radius + axisBreak.pixelMarginTop;
			let innerRadius: number = -axisRendererY.innerRadius - axisBreak.pixelMarginBottom;

			let x1 = startPoint.x + innerRadius * $math.cos(startAngle);
			let y1 = startPoint.y + innerRadius * $math.sin(startAngle);

			let x2 = startPoint.x + radius * $math.cos(startAngle);
			let y2 = startPoint.y + radius * $math.sin(startAngle);

			let x3 = endPoint.x + innerRadius * $math.cos(endAngle);
			let y3 = endPoint.y + innerRadius * $math.sin(endAngle);

			let x4 = endPoint.x + radius * $math.cos(endAngle);
			let y4 = endPoint.y + radius * $math.sin(endAngle);

			let p1 = { x: x1, y: y1 };
			let p2 = { x: x2, y: y2 };

			let p3 = { x: x3, y: y3 };
			let p4 = { x: x4, y: y4 };

			startLine.path = $path.moveTo(p1) + wavedLine(p1, p2, startLine.waveLength, startLine.waveHeight, startLine.tension, true);
			endLine.path = $path.moveTo(p4) + wavedLine(p4, p3, endLine.waveLength, endLine.waveHeight, endLine.tension, true);

			let path = $path.moveTo(p1);
			path += wavedLine(p1, p2, fillShape.waveLength, fillShape.waveHeight, fillShape.tension, true);

			let startX = this.axis.start;
			let endX = this.axis.end;

			let count = Math.ceil(this.axisLength / this.precisionStep * (endPosition - startPosition) / (endX - startX));

			for (let i = 0; i <= count; i++) {

				let pos = startPosition + i / count * (endPosition - startPosition);

				let point = this.positionToPoint(pos);
				let angle = point.angle;

				let x = point.x + radius * $math.cos(angle);
				let y = point.y + radius * $math.sin(angle);

				path += $path.lineTo({ x: x, y: y });
			}

			path += wavedLine(p4, p3, fillShape.waveLength, fillShape.waveHeight, fillShape.tension, true);

			for (let i = count; i >= 0; i--) {

				let pos = startPosition + i / count * (endPosition - startPosition);


				let point = this.positionToPoint(pos);
				let angle = point.angle;

				let x = point.x + innerRadius * $math.cos(angle);
				let y = point.y + innerRadius * $math.sin(angle);

				path += $path.lineTo({ x: x, y: y });
			}

			fillShape.path = path;

			this.toggleVisibility(axisBreak.startLine, axisBreak.startPosition, 0, 1);
			this.toggleVisibility(axisBreak.endLine, axisBreak.endPosition, 0, 1);
		}
	}

	/**
	 * @ignore
	 */
	public toAxisPosition(value: number): number {
		return value;
	}

	/**
	 * Converts a coordinate in pixels to a relative position. (0-1)
	 *
	 * @param coordinate  Coordinate (px)
	 * @param coordinate2  Coordinate (px) Some more complicated axes need two coordinates
	 * @return Position (0-1)
	 */
	public coordinateToPosition(coordinate: number, coordinate2?: number): number {
		let points = this.polyspline.allPoints;

		let closestPoint = this.polyspline.getClosestPointIndex({ x: coordinate, y: coordinate2 });

		return super.coordinateToPosition(closestPoint / (points.length - 1) * this.axisLength);
	}

	/**
	 * Updates some of the Axis tooltip's visual properties, related to
	 * rendering of the Axis.
	 *
	 * @todo Description (review)
	 * @ignore Exclude from docs
	 */
	public updateTooltip(): void {

	}

	/**
	 * [[CurveChart]] does not support inversed X axes. This setting will be
	 * ignored.
	 * @param  value  Flip axis?
	 */
	public set inversed(value: boolean) {

	}

	/**
	 * @return Flip axis?
	 */
	public get inversed(): boolean {
		return false;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRendererCurveX"] = AxisRendererCurveX;
