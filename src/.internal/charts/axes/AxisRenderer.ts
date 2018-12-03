/**
 * Module, defining base Axis Renderer.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, ContainerLayout, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Sprite, SpriteEventDispatcher, AMEvent } from "../../core/Sprite";
import { IPoint } from "../../core/defs/IPoint";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { Axis } from "./Axis";
import { AxisLine } from "./AxisLine";
import { AxisFill } from "./AxisFill";
import { Grid } from "./Grid";
import { AxisLabel } from "./AxisLabel";
import { AxisTick } from "./AxisTick";
import { AxisBreak } from "./AxisBreak";
import { Chart } from "../Chart";
import { Tooltip, PointerOrientation } from "../../core/elements/Tooltip";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { registry } from "../../core/Registry";
import { percent } from "../../core/utils/Percent";
import * as $math from "../../core/utils/Math";
import { XYChart } from "../types/XYChart";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisRenderer]].
 */
export interface IAxisRendererProperties extends IContainerProperties {

	/**
	 * Minimum distance in pixels between grid elements.
	 *
	 * @type {number}
	 */
	minGridDistance?: number;

	/**
	 * Draw axis labels inside axis.
	 *
	 * @type {boolean}
	 */
	inside?: boolean;

	/**
	 * Draw axis on opposite side of the plot area?
	 *
	 * @type {boolean}
	 */
	opposite?: boolean;

	/**
	 * Inverse the order of the scale for the Axis.
	 *
	 * @type {boolean}
	 */
	inversed?: boolean;

	/**
	 * Location of the cell start. (0-1)
	 *
	 * @type {number}
	 */
	cellStartLocation?: number;

	/**
	 * Location of the cell end. (0-1)
	 * @type {number}
	 */
	cellEndLocation?: number;

	/**
	 * Location of the axis tooltip. (0-1)
	 *
	 * @type {number}
	 */
	tooltipLocation?: number;

	/**
	 * Resize axis tooltip to the full width of the cell.
	 *
	 * @type {boolean}
	 */
	fullWidthTooltip?: boolean;

	/**
	 * Labels with position less than this will be hidden.
	 *
	 * @type {number}
	 */
	minLabelPosition?: number;

	/**
	 * Labels with position bigger than this will be hidden.
	 *
	 * @type {number}
	 */
	maxLabelPosition?: number;

}

/**
 * Defines events for [[AxisRenderer]].
 */
export interface IAxisRendererEvents extends IContainerEvents { }

/**
 * Defines adapters for [[AxisRenderer]].
 *
 * @see {@link Adapter}
 */
export interface IAxisRendererAdapters extends IContainerAdapters, IAxisRendererProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A base class for all axis renderers.
 *
 * @see {@link IAxisRendererEvents} for a list of available events
 * @see {@link IAxisRendererAdapters} for a list of available Adapters
 */
export class AxisRenderer extends Container {

	/**
	 * Defines available properties.
	 *
	 * @type {IAxisRendererProperties}
	 */
	public _properties!: IAxisRendererProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IAxisRendererAdapters}
	 */
	public _adapter!: IAxisRendererAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IAxisRendererEvents}
	 */
	public _events!: IAxisRendererEvents;

	/**
	 * A related Axis.
	 *
	 * @type {Axis}
	 */
	protected _axis: Axis;

	/**
	 * A line object of the related axis.
	 *
	 * @type {AxisLine}
	 */
	public line: AxisLine;

	/**
	 * Base grid element. ([[Sprite]])
	 *
	 * For value axes base grid is at value 0.
	 *
	 * For category/date axis it is added at the end of the last item/date.
	 *
	 * @ignore Exclude from docs
	 * @type {Sprite}
	 */
	public baseGrid: Sprite;

	/**
	 * A [[Container]] holding all of the [[Grid]] elements.
	 *
	 * @type {Container}
	 */
	public gridContainer: Container;

	/**
	 * A [[Container]] holding all of the [[AxisBreak]] elements.
	 *
	 * @type {Container}
	 */
	public breakContainer: Container;

	/**
	 * A related chart.
	 *
	 * @type {MutableValueDisposer}
	 */
	protected _chart = new MutableValueDisposer<Chart>();

	/**
	 * Defines type of the grid elements.
	 *
	 * @type {Grid}
	 */
	public _gridType: Grid;

	/**
	 * Defines type for the fill elements.
	 *
	 * @type {AxisFill}
	 */
	public _fillType: AxisFill;

	/**
	 * Defines type for tick elements.
	 *
	 * @type {AxisTick}
	 */
	public _tickType: AxisTick;

	/**
	 * Defines type for the label elements.
	 *
	 * @type {AxisLabel}
	 */
	public _labelType: AxisLabel;

	/**
	 * A list of grid elements.
	 */
	protected _grid: ListTemplate<this["_gridType"]>;

	/**
	 * A list of tick elements.
	 */
	protected _ticks: ListTemplate<this["_tickType"]>;

	/**
	 * A list of label elements.
	 */
	protected _labels: ListTemplate<this["_labelType"]>;

	/**
	 * A list of fill elements.
	 */
	protected _axisFills: ListTemplate<this["_fillType"]>;


	/**
	 * Constructor.
	 *
	 * @param {Axis} axis Related axis
	 */
	constructor() {

		// Init
		super();
		this.className = "AxisRenderer";

		// Set defaults
		this.minGridDistance = 50;
		this.inside = false;
		this.inversed = false;
		this.tooltipLocation = 0.5;
		this.fullWidthTooltip = false;
		this.cellStartLocation = 0;
		this.cellEndLocation = 1;

		this.minLabelPosition = 0;
		this.maxLabelPosition = 1;
		this.shouldClone = false;

		let gridContainer = this.createChild(Container);
		gridContainer.shouldClone = false;
		gridContainer.layout = "none";
		gridContainer.isMeasured = false;
		gridContainer.width = percent(100);
		gridContainer.height = percent(100);
		this.gridContainer = gridContainer;
		// not good without this
		gridContainer.events.on("maxsizechanged", () => {
			if (this.inited) {
				this.invalidateAxisItems();
			}
		}, this, false);

		let breakContainer = this.createChild(Container);
		breakContainer.shouldClone = false;
		breakContainer.isMeasured = false;
		breakContainer.layout = "none";
		breakContainer.width = percent(100);
		breakContainer.height = percent(100);
		this.breakContainer = breakContainer;

		this.line = this.createChild(AxisLine);
		this.line.shouldClone = false;
		this.line.strokeOpacity = 0;
		this.ticks.template.strokeOpacity = 0;

		let baseGrid: Grid = this.createChild(Grid);
		baseGrid.shouldClone = false;
		this.baseGrid = baseGrid;

		// Make elements disposable
		let disposers = this._disposers;
		disposers.push(baseGrid);
		disposers.push(this.line);
		disposers.push(gridContainer);
		disposers.push(breakContainer);
		disposers.push(this._chart);

		//this.axisFills.template.disabled = true;
		this.axisFills.template.interactionsEnabled = false;
		// Apply theme
		this.applyTheme();
	}


	set axis(axis: Axis) {
		this.setAxis(axis);
	}

	get axis(): Axis {
		return this._axis;
	}

	/**
	* @ignore
	*/
	public setAxis(axis: Axis) {
		this._axis = axis;
		this.baseGrid.parent = axis;
		this.line.parent = axis;
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
		this.events.on("sizechanged", this.updateTooltip, this, false);
		this.events.on("positionchanged", this.updateTooltip, this, false);
		this.labels.template.inside = this.inside;
		this.ticks.template.inside = this.inside;
	}

	/**
	 * Updates Axis' tooltip.
	 *
	 * @todo Description (review)
	 * @ignore Exclude from docs
	 */
	public updateTooltip(): void {
		// This is a placeholder method for extending classes to override.
	}

	/**
	 * Returns actual length of the Axis, in pixels.
	 *
	 * @return {number} Length (px)
	 */
	public get axisLength(): number {
		// This is a placeholder method for extending classes to override.
		return 0;
	}

	/**
	 * Re-positions an element to new coordinates.
	 *
	 * @ignore Exclude from docs
	 * @param {Sprite}  item   A target element
	 * @param {IPoint}  point  New coordinates
	 */
	public positionItem(item: Sprite, point: IPoint): void {
		if (item) {
			item.moveTo(point);
		}
	}

	/**
	 * Converts relative position on axis to point coordinates.
	 *
	 * @ignore Exclude from docs
	 * @param  {number}  position  Position (0-1)
	 * @return {IPoint}            Point
	 */
	public positionToPoint(position: number): IPoint {
		// This is a placeholder method for extending classes to override.
		return { x: 0, y: 0 };
	}

	/**
	 * Converts relative position on axis to angle.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review / units)
	 * @param  {number}  position  Position (0-1)
	 * @return {number}            Angle
	 */
	public positionToAngle(position: number): number {
		// This is a placeholder method for extending classes to override.
		return 0;
	}

	/**
	 * Converts relative position (0-1) on axis to a pixel coordinate.
	 *
	 * @param  {number}  position  Position (0-1)
	 * @return {number}            Coordinate (px)
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

		return coordinate;
	}


	protected getHeight(): number {
		let axis = this.axis;
		if (axis && axis.chart) {
			let chart = <XYChart>this.axis.chart;
			if (chart.plotContainer) {
				return chart.plotContainer.pixelHeight || 0;
			}
		}
		return this.gridContainer.pixelHeight || 0;
	}

	protected getWidth(): number {
		let axis = this.axis;
		if (axis && axis.chart) {
			let chart = <XYChart>this.axis.chart;
			if (chart.plotContainer) {
				return chart.plotContainer.pixelWidth || 0;
			}
		}
		return this.gridContainer.pixelWidth || 0;
	}


	/**
	 * Converts a coordinate in pixels to a relative position. (0-1)
	 *
	 * @param  {number}  coordinate  Coordinate (px)
	 * @return {number}              Position (0-1)
	 */
	public coordinateToPosition(coordinate: number): number {
		let position: number;
		let axis: Axis = this.axis;
		let axisFullLength = axis.axisFullLength;

		if (axis.renderer.inversed) {
			position = axis.end - coordinate / axisFullLength;
		}
		else {
			position = coordinate / axisFullLength + axis.start;
		}

		return $math.round(position, 5);
	}

	/**
	 * Converts a point at specific coordinates to a relative position (0-1)
	 * on the axis.
	 *
	 * @ignore Exclude from docs
	 * @param  {IPoint}  point  Point
	 * @return {number}         Position (0-1)
	 */
	public pointToPosition(point: IPoint): number {
		// This is a placeholder method for extending classes to override.
		return 0;
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
		return "";
	}

	/**
	 * Invalidates all axis data items, effectively causing them re-evaluated.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (review)
	 */
	public invalidateAxisItems(): void {
		let axis: Axis = this.axis;
		if (axis) {
			axis.invalidateDataItems();
		}
	}

	/**
	 * Updates and positions a grid element.
	 *
	 * @ignore Exclude from docs
	 * @param {Grid}    grid         Grid element
	 * @param {number}  position     Starting position
	 * @param {number}  endPosition  End position
	 */
	public updateGridElement(grid: Sprite, position: number, endPosition: number): void {
		// This is a placeholder method for extending classes to override.
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
		// This is a placeholder method for extending classes to override.
	}

	/**
	 * Updates and positions a label element.
	 *
	 * @ignore Exclude from docs
	 * @param {AxisLabel}  label        Label element
	 * @param {number}     position     Starting position
	 * @param {number}     endPosition  Ending position
	 */
	public updateLabelElement(label: AxisLabel, position: number, endPosition: number, location?: number): void {
		// This is a placeholder method for extending classes to override.
	}

	/**
	 * Updates and positions the axis line element.
	 *
	 * @ignore Exclude from docs
	 * @param {AxisFill}  fill         Fill element
	 * @param {number}    position     Starting position
	 * @param {number}    endPosition  Ending position
	 */
	public updateFillElement(fill: AxisFill, position: number, endPosition: number): void {
		fill.startPosition = position;
		fill.endPosition = endPosition;
	}

	/**
	 * Updates and positions the axis line element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateAxisLine(): void {
		// This is a placeholder method for extending classes to override.
	}

	/**
	 * Updates and positions the base grid element.
	 *
	 * @ignore Exclude from docs
	 */
	public updateBaseGridElement(): void {
		// This is a placeholder method for extending classes to override.
	}

	/**
	 * Updates and positions an axis break element.
	 *
	 * @ignore Exclude from docs
	 * @param {AxisBreak} axisBreak Break element
	 */
	public updateBreakElement(axisBreak: AxisBreak): void {
		this.positionItem(axisBreak.startLine, axisBreak.startPoint);
		this.toggleVisibility(axisBreak.startLine, axisBreak.startPosition, 0, 1);
		this.positionItem(axisBreak.endLine, axisBreak.endPoint);
		this.toggleVisibility(axisBreak.endLine, axisBreak.endPosition, 0, 1);
	}

	/**
	 * Minimum distance in pixels between grid elements.
	 *
	 * @param {number}  value  Min distance (px)
	 */
	public set minGridDistance(value: number) {
		if (this.setPropertyValue("minGridDistance", value)) {
			if (this.axis) {
				this.axis.invalidateLayout();
			}
		}
	}

	/**
	 * @return {number} Min distance (px)
	 */
	public get minGridDistance(): number {
		return this.getPropertyValue("minGridDistance");
	}

	/**
	 * A chart, associated with the Axis.
	 *
	 * @ignore Exclude from docs
	 * @param {Chart}  value  Chart
	 */
	public set chart(value: Chart) {
		this._chart.set(value, null);
	}

	/**
	 * @ignore Exclude from docs
	 * @return {Chart} Chart
	 */
	public get chart(): Chart {
		return this._chart.get();
	}

	/**
	 * Toggles visibility of an element, based on its current position and
	 * min/max position settings.
	 *
	 * E.g. labels based on `minLabelPosition` and `maxLabelPosition`.
	 *
	 * @ignore Exclude from docs
	 * @param {Sprite}  sprite       An element to toggle
	 * @param {number}  position     Elements current position
	 * @param {number}  minPosition  Min position setting
	 * @param {number}  maxPosition  Max position setting
	 */
	protected toggleVisibility(sprite: Sprite, position: number, minPosition: number, maxPosition: number): void {
		let axis = this.axis;

		let updatedStart = axis.start + (axis.end - axis.start) * minPosition - 0.00001;
		let updatedEnd = axis.start + (axis.end - axis.start) * maxPosition + 0.00001;

		if (!sprite.disabled) {
			if (position < updatedStart || position > updatedEnd) {
				sprite.__disabled = true;
			}
			else {
				sprite.__disabled = false;
			}
		}
	}

	/**
	 * Creates visual elements for and axis break.
	 *
	 * @ignore Exclude from docs
	 * @param {AxisBreak} axisBreak Axis break
	 */
	public createBreakSprites(axisBreak: AxisBreak) {
		// This is a placeholder method for extending classes to override.
	}

	/**
	 * A list of Axis' Fill elements.
	 *
	 * @return {ListTemplate} Fill elements
	 */
	public get axisFills(): ListTemplate<this["_fillType"]> {
		if (!this._axisFills) {
			this._axisFills = new ListTemplate<AxisFill>(this.createFill(this.axis));
			this._axisFills.template.applyOnClones = true;
			this._disposers.push(new ListDisposer(this._axisFills));
			this._disposers.push(this._axisFills.template);
		}
		return this._axisFills;
	}

	/**
	 * Returns a new fill element, suitable for this Axis Renderer type.
	 *
	 * @return {AxisFill} Fill element
	 */
	public createFill(axis: Axis): this["_fillType"] {
		return new AxisFill(axis);
	}

	/**
	 * A list of Axis' Grid elements.
	 *
	 * @return {ListTemplate} Grid elements
	 */
	public get grid(): ListTemplate<this["_gridType"]> {
		if (!this._grid) {
			this._grid = new ListTemplate<Grid>(this.createGrid());
			this._grid.template.applyOnClones = true;
			this._disposers.push(new ListDisposer(this._grid));
			this._disposers.push(this._grid.template);
		}
		return this._grid;
	}

	/**
	 * Returns a new grid element, suitable for this Axis Renderer type.
	 *
	 * @return {Grid} Grid element
	 */
	public createGrid(): this["_gridType"] {
		return new Grid();
	}

	/**
	 * A list of Axis' Tick elements.
	 *
	 * @return {ListTemplate} Tick elements
	 */
	public get ticks(): ListTemplate<this["_tickType"]> {
		if (!this._ticks) {
			let tick: AxisTick = this.createTick();
			tick.applyOnClones = true;
			tick.isMeasured = false;
			this._ticks = new ListTemplate<AxisTick>(tick);
			this._disposers.push(new ListDisposer(this._ticks));
			this._disposers.push(this._ticks.template);
		}
		return this._ticks;
	}

	/**
	 * Returns a new tick element, suitable for this Axis Renderer type.
	 *
	 * @return {AxisTick} Tick element
	 */
	public createTick(): this["_tickType"] {
		return new AxisTick();
	}

	/**
	 * A list of Axis' Label elements.
	 *
	 * @return {ListTemplate} Label elements
	 */
	public get labels(): ListTemplate<this["_labelType"]> {
		if (!this._labels) {
			this._labels = new ListTemplate<AxisLabel>(this.createLabel());
			this._labels.template.applyOnClones = true;
			this._disposers.push(new ListDisposer(this._labels));
			this._disposers.push(this._labels.template);
		}
		return this._labels;
	}

	/**
	 * Returns a new label element, suitable for this Axis Renderer type.
	 *
	 * @return {AxisLabel} Label element
	 */
	public createLabel(): this["_labelType"] {
		return new AxisLabel();
	}

	/**
	 * Indicates whether Axis' labels and ticks should be drawn inside Plot area.
	 *
	 * Does not work with all renderers, like AxisRendererRadial.
	 *
	 * @param {boolean}  value  Labels inside?
	 */
	public set inside(value: boolean) {

		if (this.setPropertyValue("inside", value)) {
			if (this.axis) {
				this.axis.invalidate();
			}
		}

		if (value) {
			this.width = 0;
			this.height = 0;
		}
		else {
			this.width = undefined;
			this.height = undefined;
		}
	}

	/**
	 * @return {boolean} Labels inside?
	 */
	public get inside(): boolean {
		return this.getPropertyValue("inside");
	}

	/**
	 * Indicates whether Axis should be drawn on the opposite side of the plot
	 * area than it would normally be drawn based on chart's settings.
	 *
	 * Does not work with all renderers, like [[AxisRendererRadial]] and
	 * [[AxisRenderer Circular].
	 *
	 * @param {boolean}  value  Draw axis on opposite side?
	 */
	public set opposite(value: boolean) {
		this.setPropertyValue("opposite", value);
	}

	/**
	 * @return {boolean} Draw axis on opposite side?
	 */
	public get opposite(): boolean {
		return this.getPropertyValue("opposite");
	}

	/**
	 * Indicates if Axis tooltip should take the whole width of the axis cell.
	 * (between two grid lines)
	 *
	 * NOTE: this setting is ignored on circular axis types.
	 *
	 * @param {boolean} value Full width tooltip?
	 */
	public set fullWidthTooltip(value: boolean) {
		this.setPropertyValue("fullWidthTooltip", value);
	}

	/**
	 * @return {boolean} Full width tooltip?
	 */
	public get fullWidthTooltip(): boolean {
		return this.getPropertyValue("fullWidthTooltip");
	}

	/**
	 * Location within axis cell to show tooltip on. (0-1)
	 *
	 * 0 - show at the start
	 * 0.5 - show right in the middle
	 * 1 - show at the end
	 *
	 * @param {number} value Tooltip location
	 */
	public set tooltipLocation(value: number) {
		this.setPropertyValue("tooltipLocation", value);
	}

	/**
	 * @return {number} Tooltip location
	 */
	public get tooltipLocation(): number {
		return this.getPropertyValue("tooltipLocation");
	}

	/**
	 * Location for the cell start.
	 *
	 * Normally a "cell" is the whole available width in a category.
	 *
	 * If there are several clustered column-like series available, the whole
	 * space is divided between each clustered column, or column stacks.
	 *
	 * `cellStartLocation` identifies where, within available space, the actual
	 * cell starts.
	 *
	 * This, together with column series' `width` will affect actual width of
	 * columns, and thus gaps between them.
	 *
	 * This will affect category-like axes only, like [[DateAxis]], or
	 * [[CategoryAxis]].
	 *
	 * This is used to limit a space occupied by series like column.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
	 * @param {number} value Cell start (0-1)
	 */
	public set cellStartLocation(value: number) {
		if (this.setPropertyValue("cellStartLocation", value)) {
			if (this.axis) {
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return {number} Cell start (0-1)
	 */
	public get cellStartLocation(): number {
		return this.getPropertyValue("cellStartLocation");
	}

	/**
	 * Location for the cell end.
	 *
	 * Normally a "cell" is the whole available width in a category.
	 *
	 * If there are several clustered column-like series available, the whole
	 * space is divided between each clustered column, or column stacks.
	 *
	 * `cellEndLocation` identifies where, within available space, the actual
	 * cell ends.
	 *
	 * This, together with column series' `width` will affect actual width of
	 * columns, and thus gaps between them.
	 *
	 * This will affect category-like axes only, like [[DateAxis]], or
	 * [[CategoryAxis]].
	 *
	 * This is used to limit a space occupied by series like column.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
	 * @param {number} value Cell end (0-1)
	 */
	public set cellEndLocation(value: number) {
		if (this.setPropertyValue("cellEndLocation", value)) {
			if (this.axis) {
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return {number} Cell end (0-1)
	 */
	public get cellEndLocation(): number {
		return this.getPropertyValue("cellEndLocation");
	}

	/**
	 * Indicates if the scale of the axis should be flipped.
	 *
	 * @param {boolean} value Flip axis?
	 */
	public set inversed(value: boolean) {
		this.setPropertyValue("inversed", value);
	}

	/**
	 * @return {boolean} Flip axis?
	 */
	public get inversed(): boolean {
		return this.getPropertyValue("inversed");
	}

	/**
	 * Minimum position along the Axis, for labels.
	 *
	 * Labels, which have their position closer to the start of the Axis, will be
	 * automatically hidden.
	 *
	 * E.g., setting this to 0.05 (5% of total axis length) would hide labels,
	 * that would otherwise be drawn very near start of the Axis.
	 *
	 * This is especially usefull with `inside = true`, or if the chart hasn't
	 * got any extra margins.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
	 * @param {number}  value  Min label position (0-1)
	 */
	public set minLabelPosition(value: number) {
		this.setPropertyValue("minLabelPosition", value, true);
	}

	/**
	 * @return {number} Min label position (0-1)
	 */
	public get minLabelPosition(): number {
		return this.getPropertyValue("minLabelPosition");
	}

	/**
	 * Maximum position along the Axis, for labels.
	 *
	 * Labels, which have their position closer to the and of the Axis, will be
	 * automatically hidden.
	 *
	 * E.g., setting this to 0.95 (95% of total axis length) would hide labels,
	 * that would otherwise be drawn very near end of the Axis.
	 *
	 * This is especially usefull with `inside = true`, or if the chart hasn't
	 * got any extra margins.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/axes/positioning-axis-elements/} for more info.
	 * @param {number}  value  Max label position (0-1)
	 */
	public set maxLabelPosition(value: number) {
		this.setPropertyValue("maxLabelPosition", value, true);
	}

	/**
	 * @return {number} Max label position (0-1)
	 */
	public get maxLabelPosition(): number {
		return this.getPropertyValue("maxLabelPosition");
	}

	/**
	 * Copies all settings and related items from another object of the same
	 * type.
	 *
	 * @param {this}  source  Source object
	 */
	public copyFrom(source: this) {
		super.copyFrom(source);
		this.grid.template.copyFrom(source.grid.template);
		this.ticks.template.copyFrom(source.ticks.template);
		this.labels.template.copyFrom(source.labels.template);
		this.axisFills.template.copyFrom(source.axisFills.template);
		this.line.copyFrom(source.line);
		this.baseGrid.copyFrom(source.baseGrid);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisRenderer"] = AxisRenderer;
