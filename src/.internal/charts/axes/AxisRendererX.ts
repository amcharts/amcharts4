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
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { IPoint } from "../../core/defs/IPoint";
import { IDisposer, MutableValueDisposer } from "../../core/utils/Disposer";
import { Axis } from "./Axis";
import { Grid } from "./Grid";
import { Label } from "../../core/elements/Label";
import { AxisTick } from "./AxisTick";
import { AxisLabel } from "./AxisLabel";
import { AxisBreak } from "./AxisBreak";
import { WavedLine } from "../../core/elements/WavedLine";
import { WavedRectangle } from "../../core/elements/WavedRectangle";
import { registry } from "../../core/Registry";
import { percent } from "../../core/utils/Percent";
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
 * Defines properties for [[AxisRendererX]].
 */
export interface IAxisRendererXProperties extends IAxisRendererProperties { }

/**
 * Defines events for [[AxisRendererX]].
 */
export interface IAxisRendererXEvents extends IAxisRendererEvents { }

/**
 * Defines adapters for [[AxisRendererX]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererXAdapters extends IAxisRendererAdapters, IAxisRendererXProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A renderer for horizontal axis.
 *
 * @see {@link IAxisRendererEvents} for a list of available events
 * @see {@link IAxisRendererAdapters} for a list of available Adapters
 */
export class AxisRendererX extends AxisRenderer {

	/**
	 * Defines available properties.
	 *
	 * @type {IAxisRendererXProperties}
	 */
	public _properties!: IAxisRendererXProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IAxisRendererXAdapters}
	 */
	public _adapter!: IAxisRendererXAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IAxisRendererXEvents}
	 */
	public _events!: IAxisRendererXEvents;

	/**
	 * Constructor.
	 *
	 * @param {Axis} axis Related axis
	 */
	constructor() {
		super();

		this.className = "AxisRendererX";

		this.minGridDistance = 120;

		this.opposite = false;

		this.rotation = 0;

		this.width = percent(100);

		this.labels.template.horizontalCenter = "middle";

		this.applyTheme();
	}

	/**
	* @ignore
	*/
	public setAxis(axis: Axis) {
		super.setAxis(axis);
		axis.layout = "vertical";
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
			axis.width = percent(100);

			// @todo Is thi sneeded?
			this.line;

			let title: Label = axis.title;
			title.rotation = 0;
			title.align = "center";

			if (this.opposite) {
				this.line.toFront();
				title.toBack();
			}
			else {
				title.toFront();
				this.line.toBack();
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
	public updateTooltip() {
		let axis: Axis = this.axis;
		if (axis) {
			let bigNum: number = 1000;
			let bbx: number = this.line.pixelX;
			let bby: number = this.line.pixelY;
			let bbw: number = this.axisLength;

			let bbh: number = bigNum;

			// top
			if (this.opposite) {
				if (!this.inside) {
					bby = - bigNum;
					bbh = bigNum;
				}
			}
			// bottom
			else {
				if (this.inside) {
					bby = - bigNum;
					bbh = bigNum;
				}
			}

			this.axis.updateTooltip("vertical", { x: bbx, y: bby, width: bbw, height: bbh });
		}
	}

	/**
	 * Updates and positions a label element.
	 *
	 * @ignore Exclude from docs
	 * @param {AxisLabel}  label        Label element
	 * @param {number}     position     Starting position
	 * @param {number}     endPosition  Ending position
	 */
	public updateLabelElement(label: AxisLabel, position: number, endPosition: number, location?: number) {

		if (!$type.hasValue(location)) {
			location = label.location;
		}

		position = position + (endPosition - position) * location;
		let point: IPoint = this.positionToPoint(position);

		label.isMeasured = !label.inside;

		if (!this.opposite && label.inside) {
			if(label.rotation == 0){
				label.verticalCenter = "bottom";
			}
		}
		else {
			if(label.rotation == 0){
				label.verticalCenter = "top";
			}
		}

		this.positionItem(label, point);

		this.toggleVisibility(label, position, this.minLabelPosition, this.maxLabelPosition);
	}

	/**
	 * Returns actual length of the Axis, in pixels.
	 *
	 * @return {number} Length (px)
	 */
	public get axisLength(): number {
		let axis = this.axis;
		return (axis.measuredWidth - axis.pixelPaddingRight - axis.pixelPaddingLeft) || 0;
	}

	/**
	 * Converts relative position on axis to point coordinates.
	 *
	 * @param  {number}  position  Position (0-1)
	 * @return {IPoint}            Point
	 */
	public positionToPoint(position: number): IPoint {
		return { x: this.positionToCoordinate(position), y: 0 };
	}

	/**
	 * Converts a point at specific coordinates to a relative position (0-1)
	 * on the axis.
	 *
	 * @param  {IPoint}  point  Point
	 * @return {number}         Position (0-1)
	 */
	public pointToPosition(point: IPoint) {
		return this.coordinateToPosition(point.x);
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
		let x1: number = $math.fitToRange(this.positionToCoordinate(startPosition), 0, this.axisLength);
		let x2: number = $math.fitToRange(this.positionToCoordinate(endPosition), 0, this.axisLength);

		let w: number = Math.abs(x2 - x1);
		let h: number = this.getHeight();
		let x: number = Math.min(x1, x2);
		let y: number = 0;

		return $path.rectToPath({
			x: x,
			y: y,
			width: w,
			height: h
		}, true);
	}


	/**
	 * Updates and positions an axis break element.
	 *
	 * @ignore Exclude from docs
	 * @param {AxisBreak} axisBreak Break element
	 */
	public updateBreakElement(axisBreak: AxisBreak): void {
		super.updateBreakElement(axisBreak);

		let startLine = axisBreak.startLine;
		let endLine = axisBreak.endLine;
		let fillShape = axisBreak.fillShape;

		let startPoint: IPoint = axisBreak.startPoint;
		let endPoint: IPoint = axisBreak.endPoint;

		let y1: number = axisBreak.pixelMarginLeft;
		let y2: number = this.getHeight() - axisBreak.pixelMarginTop - axisBreak.pixelMarginBottom;

		startPoint.x = $math.fitToRange(startPoint.x, -1, this.pixelWidth + 1);
		endPoint.x = $math.fitToRange(endPoint.x, -1, this.pixelWidth + 1);

		if (startPoint.x == endPoint.x && (startPoint.x < 0 || startPoint.x > this.pixelWidth)) {
			axisBreak.fillShape.__disabled = true;
		}
		else {
			axisBreak.fillShape.__disabled = false;
		}

		startLine.y = y1;
		startLine.width = 0;
		startLine.height = y2;

		endLine.y = y1;
		endLine.width = 0;
		endLine.height = y2;

		fillShape.height = y2;
		fillShape.width = Math.abs(endPoint.x - startPoint.x);
		fillShape.y = y1;
		fillShape.x = startPoint.x;
	}

	/**
	 * Updates and positions a grid element.
	 *
	 * @ignore Exclude from docs
	 * @param {Grid}    grid         Grid element
	 * @param {number}  position     Starting position
	 * @param {number}  endPosition  End position
	 */
	public updateGridElement(grid: Grid, position: number, endPosition: number): void {
		position = position + (endPosition - position) * grid.location;
		let point: IPoint = this.positionToPoint(position);

		grid.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: 0, y: this.getHeight() });

		this.positionItem(grid, point);

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
	public updateTickElement(tick: AxisTick, position: number, endPosition: number): void {
		position = position + (endPosition - position) * tick.location;
		let point: IPoint = this.positionToPoint(position);

		let tickLength = tick.length;
		if (this.opposite) {
			point.y = 0;
			tickLength *= (tick.inside ? 1 : -1);
		}
		else {
			point.y = this.gridContainer.pixelHeight;
			tickLength *= (tick.inside ? -1 : 1);
		}

		tick.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: 0, y: tickLength });

		this.positionItem(tick, point);

		this.toggleVisibility(tick, position, 0, 1);
	}

	/**
	 * Updates and positions the axis line element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateAxisLine(): void {
		this.line.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: this.axisLength, y: 0 });
	}

	/**
	 * Updates and positions the base grid element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateBaseGridElement(): void {
		super.updateBaseGridElement();

		let axis: Axis = this.axis;
		let h: number = this.getHeight();
		let w: number = this.getWidth();
		let baseGrid: Sprite = this.baseGrid;

		let x: number = axis.basePoint.x;
		if (x < 0 || x > w) {
			baseGrid.hide(0);
		}
		else {
			let y = $utils.spritePointToSprite({ x: 0, y: 0 }, this.gridContainer, baseGrid.parent).y;
			baseGrid.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: 0, y: h });
			baseGrid.moveTo({ x: x, y: y });
			baseGrid.show(0);
		}
	}

	/**
	 * Creates visual elements for and axis break.
	 *
	 * @ignore Exclude from docs
	 * @param {AxisBreak} axisBreak Axis break
	 */
	public createBreakSprites(axisBreak: AxisBreak): void {
		axisBreak.startLine = new WavedLine();
		axisBreak.endLine = new WavedLine();
		let wavedRectangle: WavedRectangle = new WavedRectangle();
		wavedRectangle.setWavedSides(false, true, false, true);
		axisBreak.fillShape = wavedRectangle;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRendererX"] = AxisRendererX;
