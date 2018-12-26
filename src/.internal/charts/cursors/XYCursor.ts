/**
 * Cursor for XY chart
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Cursor, ICursorProperties, ICursorAdapters, ICursorEvents } from "./Cursor";
import { Sprite, ISpriteEvents, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { MutableValueDisposer, MultiDisposer, IDisposer } from "../../core/utils/Disposer";
import { IPoint } from "../../core/defs/IPoint";
import { IRange } from "../../core/defs/IRange";
import { Axis } from "../axes/Axis";
import { DateAxis } from "../axes/DateAxis";
import { XYSeries, IXYSeriesEvents } from "../series/XYSeries";
import { AxisRenderer } from "../axes/AxisRenderer";
import { Tooltip } from "../../core/elements/Tooltip";
import { XYChart } from "../types/XYChart";
import { registry } from "../../core/Registry";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { IInteractionEvents } from "../../core/interaction/Interaction";
import * as $math from "../../core/utils/Math";
import * as $utils from "../../core/utils/Utils";
import * as $type from "../../core/utils/Type";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[XYCursor]].
 */
export interface IXYCursorProperties extends ICursorProperties {

	/**
	 * Cursor's behavior when moved with pointer down:
	 *
	 * * "zoomX" - zooms horizontally; (default)
	 * * "zoomY" - zooms vertically;
	 * * "zoomXY" - zooms both horizontally and vertically;
	 * * "selectX" - selects a range horizontally;
	 * * "selectY" - selects a range vertically;
	 * * "selectXY" - selects a range both horizontally and vertically;
	 * * "panX" - moves (pans) current selection horizontally;
	 * * "panY" - moves (pans) current selection vertically;
	 * * "panXY" - moves (pans) current selection both horizontally and vertically;
	 * * "none" - does nothing with pointer down.
	 *
	 * @default "zoomX"
	 */
	behavior?: "zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none";

	/**
	 * Cursor's horizontal line is expanded to take full width of the related
	 * Axis' cell/category.
	 *
	 * @type {boolean}
	 */
	fullWidthLineX?: boolean;

	/**
	 * Cursor's vertical line is expanded to take full width of the related
	 * Axis' cell/category.
	 *
	 * @type {boolean}
	 */
	fullWidthLineY?: boolean;

	/**
	 * If cursor behavior is panX or panY, we allow to pan plot out of it's max bounds for a better user experience.
	 * This setting specifies relative value by how much we can pan out the plot
	 *
	 * @type {number}
	 */
	maxPanOut?: number;

	/**
	 *
	 * @type {XYSeries}
	 */
	snapToSeries: XYSeries;
}

/**
 * Defines events for [[XYCursor]].
 */
export interface IXYCursorEvents extends ICursorEvents { }

/**
 * Defines adapters for [[XYCursor]].
 *
 * @see {@link Adapter}
 */
export interface IXYCursorAdapters extends ICursorAdapters, IXYCursorProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A cursor used on [[XYChart]].
 *
 * @see {@link IXYCursorEvents} for a list of available events
 * @see {@link IXYCursorAdapters} for a list of available Adapters
 * @todo Add description, examples
 * @todo Should we allow changing `_generalBehavior`?
 */
export class XYCursor extends Cursor {

	/**
	 * Defines available properties.
	 *
	 * @type {IXYCursorProperties}
	 */
	public _properties!: IXYCursorProperties;

	/**
	 * Defines available adapters
	 *
	 * @type {IXYCursorAdapters}
	 */
	public _adapter!: IXYCursorAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IXYCursorEvents}
	 */
	public _events!: IXYCursorEvents;

	/**
	 * Vertical cursor line element.
	 *
	 * @type {MutableValueDisposer<Sprite>}
	 */
	protected _lineX = new MutableValueDisposer<Sprite>();

	/**
	 * Horizontal cursor line element.
	 *
	 * @type {MutableValueDisposer<Sprite>}
	 */
	protected _lineY = new MutableValueDisposer<Sprite>();

	/**
	 * Element which highlights selected area.
	 *
	 * @type {Sprite}
	 */
	protected _selection: Sprite;

	/**
	 * A range of current horizontal selection.
	 *
	 * @type {IRange}
	 */
	public xRange: IRange;

	/**
	 * A range of current vertical selection.
	 *
	 * @type {IRange}
	 */
	public yRange: IRange;

	/**
	 * Horizontal [[Axis]].
	 *
	 * @type {MutableValueDisposer<Axis>}
	 */
	protected _xAxis = new MutableValueDisposer<Axis<AxisRenderer>>();

	/**
	 * Vertical [[Axis]].
	 *
	 * @type {MutableValueDisposer<Axis>}
	 */
	protected _yAxis = new MutableValueDisposer<Axis<AxisRenderer>>();

	/**
	 * A reference to chart cursor belongs to.
	 *
	 * @type {Chart}
	 */
	public _chart: XYChart;

	protected _snapToDisposer: IDisposer;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "XYCursor";

		// Defaults
		this.behavior = "zoomX";

		this.maxPanOut = 0.1;

		let interfaceColors = new InterfaceColorSet();

		// Create selection element
		let selection: Sprite = this.createChild(Sprite);
		selection.shouldClone = false;
		selection.fillOpacity = 0.2;
		selection.fill = interfaceColors.getFor("alternativeBackground");
		selection.isMeasured = false;
		selection.interactionsEnabled = false;
		this.selection = selection;
		this._disposers.push(this.selection);

		// Create cursor's vertical line
		let lineX: Sprite = this.createChild(Sprite);
		lineX.shouldClone = false;
		lineX.stroke = interfaceColors.getFor("grid");
		lineX.fill = color();
		lineX.strokeDasharray = "3,3";
		lineX.isMeasured = false;
		lineX.strokeOpacity = 0.4;
		lineX.interactionsEnabled = false;
		lineX.y = 0;// important
		this.lineX = lineX;
		this._disposers.push(this.lineX);

		// Create cursor's horizontal line
		let lineY: Sprite = this.createChild(Sprite);
		lineY.shouldClone = false;
		lineY.stroke = interfaceColors.getFor("grid");
		lineY.fill = color();
		lineY.strokeDasharray = "3,3";
		lineY.isMeasured = false;
		lineY.strokeOpacity = 0.4;
		lineY.interactionsEnabled = false;
		lineY.x = 0; // important
		this.lineY = lineY;
		this._disposers.push(this.lineY);

		// Add handler for size changes
		this.events.on("sizechanged", this.updateSize, this, false);

		this._disposers.push(this._lineX);
		this._disposers.push(this._lineY);
		this._disposers.push(this._xAxis);
		this._disposers.push(this._yAxis);

		this.mask = this;

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Updates cursor element dimensions on size change.
	 *
	 * @ignore Exclude from docs
	 */
	public updateSize(): void {
		if (this.lineX) {
			this.lineX.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: 0, y: this.innerHeight });
		}
		if (this.lineY) {
			this.lineY.path = $path.moveTo({ x: 0, y: 0 }) + $path.lineTo({ x: this.innerWidth, y: 0 });
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

				if (this.lineX) {
					point.x = this.lineX.pixelX;
				}

				if (this.lineY) {
					point.y = this.lineY.pixelY;
				}

				let selection: Sprite = this.selection;

				let x: number = Math.min(point.x, downPoint.x);
				let y: number = Math.min(point.y, downPoint.y);

				let w: number = $math.round(Math.abs(downPoint.x - point.x), this._positionPrecision);
				let h: number = $math.round(Math.abs(downPoint.y - point.y), this._positionPrecision);

				switch (this.behavior) {
					case "zoomX":
						y = 0;
						h = this.pixelHeight;
						break;
					case "zoomY":
						x = 0;
						w = this.pixelWidth;
						break;
					case "selectX":
						y = 0;
						h = this.pixelHeight;
						break;
					case "selectY":
						x = 0;
						w = this.pixelWidth;
						break;
				}

				selection.x = x;
				selection.y = y;

				selection.path = $path.rectangle(w, h);

				selection.validatePosition(); // otherwise Edge shoes some incorrect size rectangle
			}
			else {
				this.selection.hide();
			}
		}
	}


	/**
	 *
	 * @ignore Exclude from docs
	 */

	protected fixPoint(point: IPoint): IPoint {
		point.x = Math.max(0, point.x);
		point.y = Math.max(0, point.y);
		point.x = Math.min(this.pixelWidth, point.x);
		point.y = Math.min(this.pixelHeight, point.y);

		return point;
	}


	/**
	 * Places the cursor at specific point.
	 *
	 * @param {IPoint}   point Point to place cursor at
	 */
	protected triggerMoveReal(point: IPoint): void {
		super.triggerMoveReal(point);

		if ((this.snapToSeries && !this.snapToSeries.isHidden)) {

		}
		else {
			this.updateLinePositions(point);
		}

		if (this.downPoint && $math.getDistance(this.downPoint, point) > 3) {
			if (this._generalBehavior == "pan") {
				this.getPanningRanges();
				this.dispatch("panning");
			}
		}
	}

	/**
	 *
	 * @ignore Exclude from docs
	 */
	protected updateLinePositions(point: IPoint) {
		point = this.fixPoint(this.point);

		if (this.lineX && this.lineX.visible && !this.xAxis) {
			this.lineX.x = point.x;
		}
		if (this.lineY && this.lineY.visible && !this.yAxis) {
			this.lineY.y = point.y;
		}
		this.updateSelection();
	}


	protected triggerDownReal(point: IPoint) {
		if (this.visible && !this.isHiding) {

			if (this.fitsToBounds(point)) {
				this.downPoint = point;

				this.updatePoint(point);

				//this.updateLinePositions(point); // otherwise lines won't be in correct position and touch won't work fine

				this.point.x = this.downPoint.x;
				this.point.y = this.downPoint.y;

				let selection: Sprite = this.selection;
				let selectionX: number = this.downPoint.x;
				let selectionY: number = this.downPoint.y;

				if (this._usesSelection) {
					selection.x = selectionX;
					selection.y = selectionY;
					selection.path = "";
					selection.show();
				}
				super.triggerDownReal(point);
			}
			else {
				this.downPoint = undefined;
			}
		}
		else {
			this.downPoint = undefined;
		}
	}

	/**
	 * Updates the coordinates of where pointer down event occurred
	 * (was pressed).
	 */
	protected updatePoint(point: IPoint) {
		if (this.lineX) {
			point.x = this.lineX.pixelX;
		}
		if (this.lineY) {
			point.y = this.lineY.pixelY;
		}
	}


	protected triggerUpReal(point: IPoint) {
		if (this.downPoint) {
			this.upPoint = point;

			this.updatePoint(this.upPoint);

			this.getRanges();

			if (this.behavior == "selectX" || this.behavior == "selectY" || this.behavior == "selectXY") {
				// void
			}
			else {
				this.selection.hide();
			}

			super.triggerUpReal(point);
		}

		this.downPoint = undefined;
		this.updateSelection();
	}


	/**
	 * [getRanges description]
	 *
	 * @todo Description
	 */
	protected getPanningRanges() {

		let startX = $math.round(this.downPoint.x / this.innerWidth, 5);
		let startY = $math.round(this.downPoint.y / this.innerHeight, 5);

		let currentX = $math.round(this.point.x / this.innerWidth, 5);
		let currentY = $math.round(this.point.y / this.innerHeight, 5);

		let deltaX = startX - currentX;
		let deltaY = -startY + currentY;

		this.xRange = { start: deltaX, end: 1 + deltaX };
		this.yRange = { start: deltaY, end: 1 + deltaY };

		if (this.behavior == "panX") {
			this.yRange.start = 0;
			this.yRange.end = 1;
		}
		if (this.behavior == "panY") {
			this.xRange.start = 0;
			this.xRange.end = 1;
		}
	}

	/**
	 * [getRanges description]
	 *
	 * @todo Description
	 */
	protected getRanges() {
		if (this.lineX) {
			this.upPoint.x = this.lineX.pixelX;
		}
		if (this.lineY) {
			this.upPoint.y = this.lineY.pixelY;
		}

		// @todo Is this needed?
		this.selection;

		let startX: number = $math.round(this.downPoint.x / this.innerWidth, 5);
		let endX: number = $math.round((this.upPoint.x) / this.innerWidth, 5);

		let startY: number = $math.round(this.downPoint.y / this.innerHeight, 5);
		let endY: number = $math.round((this.upPoint.y) / this.innerHeight, 5);

		this.xRange = { start: $math.min(startX, endX), end: $math.max(startX, endX) };
		this.yRange = { start: $math.min(startY, endY), end: $math.max(startY, endY) };
	}

	/**
	 * Cursor's behavior when it's moved with pointer down:
	 *
	 * * "zoomX" - zooms horizontally;
	 * * "zoomY" - zooms vertically;
	 * * "zoomXY" - zooms both horizontally and vertically;
	 * * "selectX" - selects a range horizontally;
	 * * "selectY" - selects a range vertically;
	 * * "selectXY" - selects a range both horizontally and vertically;
	 * * "panX" - moves (pans) current selection horizontally;
	 * * "panY" - moves (pans) current selection vertically;
	 * * "panXY" - moves (pans) current selection both horizontally and vertically;
	 * * "none" - does nothing with pointer down.
	 *
	 * E.g. "zoomXY" will mean that pressing a mouse (or touching) over plot area
	 * and dragging it will start zooming the chart.
	 *
	 * @param {"zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none"} value Bheavior
	 */
	public set behavior(value: "zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none") {
		this.setPropertyValue("behavior", value, true);

		this._usesSelection = false;

		if (value.indexOf("zoom") != -1) {
			this._generalBehavior = "zoom";
			this._usesSelection = true;
		}
		if (value.indexOf("select") != -1) {
			this._generalBehavior = "select";
			this._usesSelection = true;
		}
		if (value.indexOf("pan") != -1) {
			this._generalBehavior = "pan";
			this._usesSelection = false;
		}
	}

	/**
	 * @type {"zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none"} Bheavior
	 */
	public get behavior(): "zoomX" | "zoomY" | "zoomXY" | "selectX" | "selectY" | "selectXY" | "panX" | "panY" | "panXY" | "none" {
		return this.getPropertyValue("behavior");
	}

	/**
	 * Cursor's horizontal line is expanded to take full width of the related
	 * Axis' cell/category.
	 *
	 * NOTE: this setting will work properly if `xAxis` is set and only in case
	 * `xAxis` is [[CategoryAxis]] or [[DateAxis]].
	 *
	 * @param {boolean} value Full width?
	 */
	public set fullWidthLineX(value: boolean) {
		this.setPropertyValue("fullWidthLineX", value);
	}

	/**
	 * @return {boolean} Full width?
	 */
	public get fullWidthLineX(): boolean {
		return this.getPropertyValue("fullWidthLineX");
	}

	/**
	 * Cursor's vertical line is expanded to take full width of the related
	 * Axis' cell/category.
	 *
	 * NOTE: this setting will work properly if `yAxis` is set and only in case
	 * `yAxis` is [[CategoryAxis]] or [[DateAxis]].
	 *
	 * @param {boolean} value Full width?
	 */
	public set fullWidthLineY(value: boolean) {
		this.setPropertyValue("fullWidthLineY", value);
	}

	/**
	 * @return {boolean} Full width?
	 */
	public get fullWidthLineY(): boolean {
		return this.getPropertyValue("fullWidthLineY");
	}

	/**
	 * If cursor behavior is panX or panY, we allow to pan plot out of it's max bounds for a better user experience.
	 * This setting specifies relative value by how much we can pan out the plot
	 *
	 * @param {number} value
	 */
	public set maxPanOut(value: number) {
		this.setPropertyValue("maxPanOut", value);
	}

	/**
	 * @return {number} Full width?
	 */
	public get maxPanOut(): number {
		return this.getPropertyValue("maxPanOut");
	}

	/**
	 * A reference to X [[Axis]].
	 *
	 * An XY cursor can live without `xAxis` set. You set xAxis for cursor when
	 * you have axis tooltip enabled and you want cursor line to be at the same
	 * position as tooltip.
	 *
	 * This works with [[CategoryAxis]] and [[DateAxis]] but not with
	 * [[ValueAxis]].
	 *
	 * @todo Description (review)
	 * @param {Axis} axis X axis
	 */
	public set xAxis(axis: Axis) {
		if (this._xAxis.get() != axis) {
			let chart: XYChart = <XYChart>axis.chart;
			this._xAxis.set(axis, new MultiDisposer([
				axis.tooltip.events.on("positionchanged", this.handleXTooltipPosition, this, false),
				//axis.events.on("validated", chart.handleCursorPositionChange, chart, false)
			]));
		}
	}

	/**
	 * @return {Axis} X axis
	 */
	public get xAxis(): Axis {
		return this._xAxis.get();
	}

	/**
	 * A reference to Y [[Axis]].
	 *
	 * An XY cursor can live without `yAxis` set. You set xAxis for cursor when
	 * you have axis tooltip enabled and you want cursor line to be at the same
	 * position as tooltip.
	 *
	 * This works with [[CategoryAxis]] and [[DateAxis]] but not with
	 * [[ValueAxis]].
	 *
	 * @todo Description (review)
	 * @param {Axis} axis Y axis
	 */
	public set yAxis(axis: Axis) {
		if (this._yAxis.get() != axis) {
			let chart: XYChart = <XYChart>axis.chart;
			this._yAxis.set(axis, new MultiDisposer([
				axis.tooltip.events.on("positionchanged", this.handleYTooltipPosition, this, false),
				//axis.events.on("validated", chart.handleCursorPositionChange, chart, false)
			]));
		}
	}

	/**
	 * @return {Axis} Y Axis
	 */
	public get yAxis(): Axis {
		return this._yAxis.get();
	}

	/**
	 * Updates Cursor's position when axis tooltip changes position.
	 *
	 * @ignore Exclude from docs
	 * @param {ISpriteEvents["positionchanged"]} event Original Axis event
	 */
	protected handleXTooltipPosition(event: ISpriteEvents["positionchanged"]): void {
		let tooltip: Tooltip = this.xAxis.tooltip;
		let point: IPoint = $utils.svgPointToSprite({ x: tooltip.pixelX, y: tooltip.pixelY }, this);
		let x: number = point.x;

		if (this.lineX) {
			this.lineX.x = x;
			if (!this.fitsToBounds(point)) {
				this.hide();
			}
		}

		if (this.xAxis && this.fullWidthLineX) {
			let startPoint: IPoint = this.xAxis.currentItemStartPoint;
			let endPoint: IPoint = this.xAxis.currentItemEndPoint;
			if (startPoint && endPoint) {
				this.lineX.x = x;
				let width: number = endPoint.x - startPoint.x;
				this.lineX.path = $path.rectangle(width, this.innerHeight, -width / 2);
			}
		}
	}

	/**
	 * Updates Cursor's position when Y axis changes position or scale.
	 *
	 * @ignore Exclude from docs
	 * @param {ISpriteEvents["positionchanged"]} event Original Axis event
	 */
	protected handleYTooltipPosition(event: ISpriteEvents["positionchanged"]): void {
		let tooltip: Tooltip = this.yAxis.tooltip;
		let point: IPoint = $utils.svgPointToSprite({ x: tooltip.pixelX, y: tooltip.pixelY }, this);
		let y: number = point.y;

		if (this.lineY) {
			this.lineY.y = y;

			if (!this.fitsToBounds(point)) {
				this.hide();
			}
		}

		if (this.yAxis && this.fullWidthLineY) {
			let startPoint: IPoint = this.yAxis.currentItemStartPoint;
			let endPoint: IPoint = this.yAxis.currentItemEndPoint;
			if (startPoint && endPoint) {
				this.lineY.y = y;
				let height: number = endPoint.y - startPoint.y;
				this.lineY.path = $path.rectangle(this.innerWidth, height, 0, -height / 2);
			}
		}
	}

	/**
	 * A Line element to use for X axis.
	 *
	 * @param {Sprite} lineX Line
	 */
	public set lineX(lineX: Sprite) {
		if (lineX) {
			lineX.setElement(this.paper.add("path"));
			this._lineX.set(lineX, lineX.events.on("positionchanged", this.updateSelection, this, false));
			lineX.interactionsEnabled = false;
			lineX.parent = this;
		}
		else {
			this._lineX.reset();
		}
	}

	/**
	 * @return {Sprite} Line element
	 */
	public get lineX(): Sprite {
		return this._lineX.get();
	}

	/**
	 * A Line element to use Y axis.
	 *
	 * @param {Sprite} lineY Line
	 */
	public set lineY(lineY: Sprite) {
		if (lineY) {
			lineY.setElement(this.paper.add("path"));
			this._lineY.set(lineY, lineY.events.on("positionchanged", this.updateSelection, this, false));
			lineY.parent = this;
			lineY.interactionsEnabled = false;
		}
		else {
			this._lineY.reset();
		}
	}

	/**
	 * @return {Sprite} Line element
	 */
	public get lineY(): Sprite {
		return this._lineY.get();
	}

	/**
	 * A selection element ([[Sprite]]).
	 *
	 * @param {Sprite} selection Selection rectangle
	 */
	public set selection(selection: Sprite) {
		this._selection = selection;
		if (selection) {
			selection.element = this.paper.add("path");
			selection.parent = this;
		}
	}

	/**
	 * @return {Sprite} Selection rectangle
	 */
	public get selection(): Sprite {
		return this._selection;
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * Looks if `xAxis` and `yAxis` is set via ID in JSON config, and replaces
	 * with real references.
	 *
	 * @ignore Exclude from docs
	 * @param {object}  config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Set up axes
			if ($type.hasValue(config.xAxis) && $type.isString(config.xAxis) && this.map.hasKey(config.xAxis)) {
				config.xAxis = this.map.getKey(config.xAxis);
			}
			if ($type.hasValue(config.yAxis) && $type.isString(config.yAxis) && this.map.hasKey(config.yAxis)) {
				config.yAxis = this.map.getKey(config.yAxis);
			}

		}

		super.processConfig(config);

	}

	/**
	 * Specifies to which series cursor lines should be snapped. Works when one
	 * of the axis is `DateAxis` or `CategoryAxis`. Won't work if both axes are
	 * `ValueAxis`.
	 * 
	 * @param {XYSeries}
	 */
	public set snapToSeries(series: XYSeries) {
		if (this.setPropertyValue("snapToSeries", series)) {
			if (this._snapToDisposer) {
				this._snapToDisposer.dispose();
			}

			if (series) {
				this._snapToDisposer = series.events.on("tooltipshownat", this.handleSnap, this, false);
			}
		}
	}

	/**
	 * @return {XYSeries}
	 */
	public get snapToSeries(): XYSeries {
		return this.getPropertyValue("snapToSeries");
	}

	/**
	 * [handleSnap description]
	 * 
	 * @ignore
	 * @todo Description
	 */
	public handleSnap() {
		
		let series = this.snapToSeries;
		let y = series.tooltipY;
		let x = series.tooltipX;// - this.pixelWidth;

		if (this.xAxis) {
			if (this.xAxis.renderer.opposite) {
				y -= this.pixelHeight;
			}
		}

		this.point = { x: x, y: y };
		this.getPositions();

		x -= this.pixelWidth;

		if (this.yAxis) {
			if (this.yAxis.renderer.opposite) {
				x += this.pixelWidth;
			}
		}

		let tooltip = series.tooltip;
		let duration = tooltip.animationDuration;
		let easing = tooltip.animationEasing;

		if (series.baseAxis == series.xAxis) {
			series.yAxis.showTooltipAtPosition(this.yPosition);
		}

		if (series.baseAxis == series.yAxis) {
			series.xAxis.showTooltipAtPosition(this.xPosition);
		}

		this.lineX.animate([{ property: "y", to: y }], duration, easing);
		this.lineY.animate([{ property: "x", to: x }], duration, easing);

		if (!this.xAxis) {
			this.lineX.animate([{ property: "x", to: x }], duration, easing);
		}
		if (!this.yAxis) {
			this.lineY.animate([{ property: "y", to: y }], duration, easing);
		}
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["XYCursor"] = XYCursor;
