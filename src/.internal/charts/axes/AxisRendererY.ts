/**
 * Module, defining Axis Renderer for vertical axes.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AxisRenderer, IAxisRendererProperties, IAxisRendererAdapters, IAxisRendererEvents } from "./AxisRenderer";
import { Sprite } from "../../core/Sprite";
import { IPoint } from "../../core/defs/IPoint";
import { Axis } from "./Axis";
import { HorizontalCenter } from "../../core/defs/HorizontalCenter";
import { Label } from "../../core/elements/Label";
import { Grid } from "./Grid";
import { AxisTick } from "./AxisTick";
import { AxisLabel } from "./AxisLabel";
import { AxisBreak } from "./AxisBreak";
import { WavedLine } from "../../core/elements/WavedLine";
import { WavedRectangle } from "../../core/elements/WavedRectangle";
import { registry } from "../../core/Registry";
import { percent, Percent } from "../../core/utils/Percent";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";
import { defaultRules, ResponsiveBreakpoints } from "../../core/utils/Responsive";
import { AxisBullet } from "./AxisBullet";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisRendererY]].
 */
export interface IAxisRendererYProperties extends IAxisRendererProperties { }

/**
 * Defines events for [[AxisRendererY]].
 */
export interface IAxisRendererYEvents extends IAxisRendererEvents { }

/**
 * Defines adapters for [[AxisRenderer]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererYAdapters extends IAxisRendererAdapters, IAxisRendererYProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A renderer for vertical axis.
 *
 * @see {@link IAxisRendererYEvents} for a list of available events
 * @see {@link IAxisRendererYAdapters} for a list of available Adapters
 */
export class AxisRendererY extends AxisRenderer {

	/**
	 * Defines available properties.
	 */
	public _properties!: IAxisRendererYProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisRendererYAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisRendererYEvents;

	/**
	 * Constructor.
	 *
	 * @param axis Related axis
	 */
	constructor() {
		super();
		this.className = "AxisRendererY";
		this.minGridDistance = 40;
		this.opposite = false;
		this.height = percent(100);
		this.labels.template.verticalCenter = "middle";

		this.applyTheme();
	}

	/**
	* @ignore
	*/
	public setAxis(axis: Axis) {
		super.setAxis(axis);
		axis.layout = "horizontal";
	}

	/**
	 * @ignore
	 */
	public updateGridContainer() {
		let axis = this.axis;
		if (axis) {
			let gridContainer = this.gridContainer;
			gridContainer.y = axis.pixelY;
			gridContainer.height = axis.axisLength;
		}
	}

	/**
	 * @ignore
	 */
	public toAxisPosition(value: number): number {
		let axis = this.axis;
		if (axis) {
			let inversedPosition = 1 - value;
			let relativePositionSprite = axis.relativePositionSprite;

			let y = axis.pixelY;
			if (relativePositionSprite) {
				y = $utils.spritePointToSprite({ x: 0, y: this.pixelY }, this.parent, relativePositionSprite).y;
			}
			else {
				relativePositionSprite = axis.parent;
			}
			if (relativePositionSprite) {
				let relativeY = y / relativePositionSprite.innerHeight;
				let relativeHeight = axis.axisLength / relativePositionSprite.innerHeight;

				return 1 - (inversedPosition - relativeY) / relativeHeight;
			}
		}
		return value;
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

		let axis = this.axis;

		if (axis) {

			let title: Label = axis.title;
			title.valign = "middle";

			if (!(axis.height instanceof Percent)) {
				axis.height = percent(100);
			}

			if (this.opposite) {
				title.rotation = 90;
				this.line.toBack();
				title.toFront();
			}
			else {
				title.rotation = -90;
				title.toBack();
				this.line.toFront();
			}
		}
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

			let bigNum: number = 2000;
			let bbx: number = 0;
			let bby: number = 0;
			let bbw: number = bigNum;
			let bbh: number = this.axisLength;

			// right
			if (this.opposite) {
				if (this.inside) {
					bbx = - bigNum;
					bbw = bigNum;
				}
			}
			// left
			else {
				if (!this.inside) {
					bbx = - bigNum;
					bbw = bigNum;
				}
			}
			this.axis.updateTooltip("horizontal", { x: bbx, y: bby, width: bbw, height: bbh });
		}
	}

	/**
	 * Returns actual length of the Axis, in pixels.
	 *
	 * @return Length (px)
	 */
	public get axisLength(): number {
		let axis = this.axis;
		return (axis.measuredHeight - axis.pixelPaddingTop - axis.pixelPaddingBottom) || 0;
	}
	/**
	 * Converts relative position on axis to point coordinates.
	 *
	 * @param position  Position (0-1)
	 * @param position2  Position (0-1) Position on the second axis
	 * @return Point
	 */
	public positionToPoint(position: number, position2?: number): IPoint {
		return { x: 0, y: this.positionToCoordinate(position) };
	}

	/**
	 * Converts a point at specific coordinates to a relative position (0-1)
	 * on the axis.
	 *
	 * @param point  Point
	 * @return Position (0-1)
	 */
	public pointToPosition(point: IPoint) {
		return this.coordinateToPosition(point.y, point.x);
	}

	/**
	 * Converts a coordinate in pixels to a relative position. (0-1)
	 *
	 * @param coordinate  Coordinate (px)
	 * @param coordinate2  Coordinate of a second axis, only needed for complex axes systems, like timeline (px)
	 * @return Position (0-1)
	 */
	public coordinateToPosition(coordinate: number, coordinate2?:number): number {
		let position: number;
		let axis: Axis = this.axis;
		let axisFullLength = axis.axisFullLength;

		if (axis.renderer.inversed) {
			position = (1 - axis.start) - coordinate / axisFullLength;
		}
		else {
			position = coordinate / axisFullLength + (1 - axis.end);
		}
		return $math.round(position, 5);
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
		let y1: number = $math.fitToRange(this.positionToCoordinate(startPosition), 0, this.axisLength);
		let y2: number = $math.fitToRange(this.positionToCoordinate(endPosition), 0, this.axisLength);

		let h: number = Math.abs(y2 - y1);
		let w: number = this.getWidth();
		let y: number = Math.min(y1, y2);
		let x: number = 0;

		return $path.rectToPath({
			x: x,
			y: y,
			width: w,
			height: h
		}, true);
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
		//	point.y = $utils.spritePointToSprite({ x: 0, y: point.y }, this, this.gridContainer).y;

		grid.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: this.getWidth(), y: 0 });

		this.positionItem(grid, point);

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

		let tickLength = tick.length;

		try {
			$utils.used(this.axis.title.measuredWidth);
		} catch {
			// void
		}

		point.x = $utils.spritePointToSprite({ x: this.line.pixelX, y: 0 }, this.line.parent, this.gridContainer).x;

		if (!this.opposite) {
			tickLength *= (tick.inside ? 1 : -1);
		}
		else {
			tickLength *= (tick.inside ? -1 : 1);
		}

		tick.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: tickLength, y: 0 });

		this.positionItem(tick, point);

		this.toggleVisibility(tick, position, 0, 1);
	}

	/**
	 * Updates and positions the axis line element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateAxisLine() {
		this.line.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: 0, y: this.axisLength });
	}

	/**
	 * Updates and positions the base grid element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateBaseGridElement(): void {
		super.updateBaseGridElement();

		let axis: Axis = this.axis;

		let w: number = this.getWidth();
		let h: number = this.axisLength;
		let y: number = axis.basePoint.y;

		let baseGrid: Sprite = this.baseGrid;

		if (y < - 0.2 || y > h + 0.2) {
			baseGrid.hide(0);
		}
		else {
			let x = $utils.spritePointToSprite({ x: 0, y: 0 }, this.gridContainer, baseGrid.parent).x;

			baseGrid.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: w, y: 0 });
			baseGrid.moveTo({ x: x, y: y });
			baseGrid.show(0);
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
	public updateLabelElement(label: AxisLabel, position: number, endPosition: number, location?: number) {

		if (!$type.hasValue(location)) {
			location = label.location;
		}

		position = position + (endPosition - position) * location;
		label.isMeasured = !label.inside;

		let point: IPoint = this.positionToPoint(position);

		let horizontalCenter: HorizontalCenter;
		let deltaX = 0;
		let maxWidth = this.gridContainer.maxWidth;

		if (this.opposite) {
			if (label.inside) {
				horizontalCenter = "right";
				if (label.align == "left") {
					deltaX = -maxWidth;
					horizontalCenter = "left";
				}
				if (label.align == "center") {
					deltaX = -maxWidth / 2;
					horizontalCenter = "middle";
				}
			}
			else {
				horizontalCenter = "left";
			}

			point.x = 0 + deltaX;
		}
		else {
			if (label.inside) {
				horizontalCenter = "left";
				if (label.align == "right") {
					deltaX = maxWidth;
					horizontalCenter = "right";
				}
				if (label.align == "center") {
					deltaX = maxWidth / 2;
					horizontalCenter = "middle";
				}
			}
			else {
				horizontalCenter = "right";
			}

			point.x = this.measuredWidth + deltaX;
		}

		if (label.rotation == 0) {
			// Apply fuzzy logic to verticalCenter only if labels are not rotated
			label.horizontalCenter = horizontalCenter;
		}

		this.positionItem(label, point);
		this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
	}

	/**
	 * Updates and positions an axis break element.
	 *
	 * @ignore Exclude from docs
	 * @param axisBreak Break element
	 */
	public updateBreakElement(axisBreak: AxisBreak) {
		super.updateBreakElement(axisBreak);

		let startLine = axisBreak.startLine;
		let endLine = axisBreak.endLine;
		let fillShape = axisBreak.fillShape;

		let startPoint: IPoint = axisBreak.startPoint;
		let endPoint: IPoint = axisBreak.endPoint;

		let x1: number = axisBreak.pixelMarginLeft;
		let x2: number = this.getWidth() - axisBreak.pixelMarginLeft - axisBreak.pixelMarginRight;

		startPoint.y = $math.fitToRange(startPoint.y, -1, this.axisLength + 1);
		endPoint.y = $math.fitToRange(endPoint.y, -1, this.axisLength + 1);

		if (startPoint.y == endPoint.y && (startPoint.y < 0 || startPoint.y > this.axisLength)) {
			axisBreak.fillShape.__disabled = true;
		}
		else {
			axisBreak.fillShape.__disabled = false;
		}

		let w = Math.abs(x2 - x1);

		startLine.x = x1;
		startLine.height = 0;
		startLine.width = w;

		endLine.x = x1;
		endLine.height = 0;
		endLine.width = w;

		fillShape.width = w;
		fillShape.height = Math.abs(endPoint.y - startPoint.y);
		fillShape.x = x1;
		fillShape.y = endPoint.y;
	}

	/**
	 * Creates visual elements for and axis break.
	 *
	 * @ignore Exclude from docs
	 * @param axisBreak Axis break
	 */
	public createBreakSprites(axisBreak: AxisBreak) {
		axisBreak.startLine = new WavedLine();
		axisBreak.endLine = new WavedLine();
		let wavedRectangle: WavedRectangle = new WavedRectangle();
		wavedRectangle.setWavedSides(true, false, true, false);
		axisBreak.fillShape = wavedRectangle;
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

		if (!axis.renderer.inversed) {
			coordinate = (axis.end - position) * axisFullLength;
		}
		else {
			coordinate = (position - axis.start) * axisFullLength;
		}

		return $math.round(coordinate, 1);
	}


	/**
	 * Updates and positions axis bullets.
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

		point.x = $utils.spritePointToSprite({ x: this.line.pixelX, y: 0 }, this.line.parent, this.gridContainer).x;

		this.positionItem(bullet, point);

		this.toggleVisibility(bullet, position, 0, 1);
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRendererY"] = AxisRendererY;

/**
 * Add default responsive rules
 */

/**
 * Put labels inside plot area.
 * Disable first and last labels.
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.widthS,
	state: function(target, stateId) {
		if (target instanceof AxisRendererY) {
			let state = target.states.create(stateId);
			state.properties.inside = true;
			state.properties.maxLabelPosition = 0.9;
			state.properties.minLabelPosition = 0.1;
			return state;
		}

		return null;
	}
});

/**
 * Disable labels altogather on very small charts
 */
defaultRules.push({
	relevant: ResponsiveBreakpoints.widthXS,
	state: function(target, stateId) {
		if (target instanceof AxisRendererY) {
			let state = target.states.create(stateId);
			state.properties.disabled = true;
			return state;
		}

		return null;
	}
});