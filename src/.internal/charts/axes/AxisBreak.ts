/**
 * Axis break module
 */


/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */

import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Axis, AxisDataItem } from "./Axis";
import { AxisRenderer } from "./AxisRenderer";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { WavedLine } from "../../core/elements/WavedLine";
import { IWavedShape } from "../../core/defs/IWavedShape";
import { List } from "../../core/utils/List";
import { IPoint } from "../../core/defs/IPoint";
import { registry } from "../../core/Registry";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[AxisBreak]].
 */
export interface IAxisBreakProperties extends IContainerProperties {

	/**
	 * A size of the break relative to the actual size of the scope break spans.
	 *
	 * For example, if `breakSize = 0.1` and unbroken scope of balues it spans
	 * would be 100 pixels, the break would be 10 pixels wide.
	 *
	 * 0 means the break will completely collapse and hide the values.
	 * 1 means break would be not collapse at all, which would make it
	 * effectively useless.
	 *
	 * @default 0.01
	 */
	breakSize?: number;

	/**
	 * Starting value.
	 */
	startValue?: number;

	/**
	 * End value.
	 */
	endValue?: number;
}

/**
 * Defines events for [[AxisBreak]].
 */
export interface IAxisBreakEvents extends IContainerEvents { }

/**
 * Defines [[AxisBreak]] adapters.
 *
 * @see {@link Adapter}
 */
export interface IAxisBreakAdapters extends IContainerAdapters, IAxisBreakProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Base class to define "breaks" on axes.
 *
 * @see {@link IAxisBreakEvents} for a list of available events
 * @see {@link IAxisBreakAdapters} for a list of available Adapters
 * @important
 */
export class AxisBreak extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IAxisBreakProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IAxisBreakAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IAxisBreakEvents;

	/**
	 * Defines the type of the Axis this break is used for.
	 */
	public _axisType: Axis;

	/**
	 * Reference to parent Axis.
	 */
	protected _axis = new MutableValueDisposer<this["_axisType"]>();

	/**
	 * A reference to starting line element.
	 */
	protected _startLine: IWavedShape;

	/**
	 * A reference to ending line element.
	 */
	protected _endLine: IWavedShape;

	/**
	 * A reference to fill shape.
	 */
	protected _fillShape: IWavedShape;

	/**
	 * A list of axis data items which fall within this break.
	 */
	public dataItems: List<AxisDataItem> = new List<AxisDataItem>();

	/**
	 * Adjusted start value.
	 *
	 * Start and end values need to be adjusted so that they do not overlap with
	 * adjacent breaks.
	 */
	public adjustedStartValue: number;

	/**
	 * Adjusted end value.
	 *
	 * Start and end values need to be adjusted so that they do not overlap with
	 * adjacent breaks.
	 */
	public adjustedEndValue: number;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "AxisBreak";

		// Set defaults
		this.breakSize = 0.01;
		this.marginLeft = -5;
		this.marginRight = -5;
		this.marginTop = -5;
		this.marginBottom = -5;

		let interfaceColors = new InterfaceColorSet();

		// Create elements
		// (these won't be used actually, just for setting properties)
		let fillShape = new WavedLine();
		fillShape.fill = interfaceColors.getFor("background");
		fillShape.stroke = color();
		fillShape.fillOpacity = 0.9;
		fillShape.zIndex = 0;
		this._fillShape = fillShape;

		let startLine = new WavedLine();
		startLine.fill = color();
		startLine.stroke = interfaceColors.getFor("grid");
		startLine.strokeOpacity = 0.3;
		startLine.zIndex = 1;
		this._startLine = startLine;

		let endLine = new WavedLine();
		endLine.fill = color();
		endLine.stroke = color("#000000");// interfaceColors.getFor("grid");
		endLine.strokeOpacity = 0.3;
		endLine.zIndex = 2;
		this._endLine = endLine;

		this._disposers.push(this._axis);

		// Apply theme
		this.applyTheme();
	}

	public dispose(): void {
		super.dispose();

		if (this._fillShape) {
			this._fillShape.dispose();
		}

		if (this._startLine) {
			this._startLine.dispose();
		}

		if (this._endLine) {
			this._endLine.dispose();
		}
	}

	/**
	 * An element used for the starting line of the break.
	 *
	 * @param sprite  Element
	 */
	public set startLine(sprite: IWavedShape) {
		if (this._startLine) {
			this._startLine.dispose();
		}
		this._startLine = sprite;
		this.addBreakSprite(sprite);
	}

	/**
	 * @return Element
	 */
	public get startLine(): IWavedShape {
		return this._startLine;
	}

	/**
	 * An element used for the end line of the break.
	 *
	 * @param sprite Element
	 */
	public set endLine(sprite: IWavedShape) {
		if (this._endLine) {
			this._endLine.dispose();
		}
		this._endLine = sprite;
		this.addBreakSprite(sprite);
	}

	/**
	 * @return Element
	 */
	public get endLine(): IWavedShape {
		return this._endLine;
	}

	/**
	 * An element used for fill of the break.
	 *
	 * @param sprite Element
	 */
	public set fillShape(sprite: IWavedShape) {
		if (this._fillShape) {
			this._fillShape.dispose();
		}

		this._fillShape = sprite;
		this.addBreakSprite(sprite);
	}

	/**
	 * @return Element
	 */
	public get fillShape(): IWavedShape {
		return this._fillShape;
	}

	/**
	 * Adds a break element (e.g. lines, fill) to the break, which is
	 * [[Container]].
	 *
	 * @ignore Exclude from docs
	 * @param sprite Element to add
	 */
	public addBreakSprite(sprite: IWavedShape) {
		sprite.parent = this;
		sprite.isMeasured = false;
		this._disposers.push(sprite);
	}

	/**
	 * An Axis this Break is associated with.
	 *
	 * @param axis  Axis
	 */
	public set axis(axis: this["_axisType"]) {
		if (this._axis.get() !== axis) {
			this._axis.set(axis, axis.renderer.gridContainer.events.on("transformed", this.invalidate, this, false));
			axis.renderer.createBreakSprites(this);

			// this can't go to copyFrom, as axis is set later
			let breakTemplate: AxisBreak = axis.axisBreaks.template;

			this.startLine.copyFrom(breakTemplate.startLine);
			this.endLine.copyFrom(breakTemplate.endLine);
			this.fillShape.copyFrom(breakTemplate.fillShape);
		}
	}

	/**
	 * @return Axis
	 */
	public get axis(): this["_axisType"] {
		return this._axis.get();
	}

	/**
	 * A size of the break relative to the actual size of the scope break spans.
	 *
	 * For example, if `breakSize = 0.1` and unbroken scope of balues it spans
	 * would be 100 pixels, the break would be 10 pixels wide.
	 *
	 * 0 means the break will completely collapse and hide the values.
	 * 1 means break would be not collapse at all, which would make it
	 * effectively useless.
	 *
	 * @default 0.01
	 * @param value  Relative axis break
	 */
	public set breakSize(value: number) {
		if (this.setPropertyValue("breakSize", value)) {
			if (this.axis) {
				this.axis.invalidate();
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return Relative axis break
	 */
	public get breakSize(): number {
		return this.getPropertyValue("breakSize");
	}

	/**
	 * Returns pixel coordinates of axis break's start.
	 *
	 * @return Start point
	 */
	public get startPoint(): IPoint {
		let renderer: AxisRenderer = this.axis.renderer;
		if (renderer) {
			return renderer.positionToPoint(this.startPosition);
		}
	}

	/**
	 * Returns pixel coordinates of axis break's end.
	 *
	 * @return End point
	 */
	public get endPoint(): IPoint {
		let renderer: AxisRenderer = this.axis.renderer;
		if (renderer) {
			return renderer.positionToPoint(this.endPosition);
		}
	}

	/**
	 * Returns a relative position at which axis break starts.
	 *
	 * This is a calculated position, meaning it shows relative position of the
	 * break after break is applied.
	 *
	 * @return Start position
	 */
	public get startPosition(): number {
		return;
	}

	/**
	 * Returns a relative position at which axis break ends.
	 *
	 * This is a calculated position, meaning it shows relative position of the
	 * break after break is applied.
	 *
	 * @return End position
	 */
	public get endPosition(): number {
		return;
	}

	/**
	 * Draws the axis break.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();
		if (this.axis) {
			let renderer: AxisRenderer = this.axis.renderer;
			renderer.updateBreakElement(this);
		}
	}

	/**
	 * A starting value for the break.
	 *
	 * @param value  Starting value
	 */
	public set startValue(value: number) {
		if (this.setPropertyValue("startValue", value)) {
			if (this.axis) {
				this.axis.invalidate();
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return Starting value
	 */
	public get startValue(): number {
		return this.getPropertyValue("startValue");
	}

	/**
	 * An end value for the break.
	 *
	 * @param value  End value
	 */
	public set endValue(value: number) {
		if (this.setPropertyValue("endValue", value)) {
			if (this.axis) {
				this.axis.invalidate();
				this.axis.invalidateSeries();
			}
		}
	}

	/**
	 * @return End value
	 */
	public get endValue(): number {
		return this.getPropertyValue("endValue");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["AxisBreak"] = AxisBreak;
