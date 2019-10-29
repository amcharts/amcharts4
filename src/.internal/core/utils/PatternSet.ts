/**
 * This module contains PatternSet object definition
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../Base";
import { Color } from "./Color";
import { InterfaceColorSet } from "./InterfaceColorSet";
import { Pattern } from "../rendering/fills/Pattern";
import { LinePattern } from "../rendering/fills/LinePattern";
import { RectPattern } from "../rendering/fills/RectPattern";
import { Circle } from "../elements/Circle";
import { registry } from "../Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines an interable list of distinctive patterns that can be used in
 * conjunction to colors to generate various fill patterns.
 *
 * @important
 * @since 4.7.5
 * @see {@link https://www.amcharts.com/docs/v4/concepts/colors/} for color-related info
 */
export class PatternSet extends BaseObject {

	/**
	 * Holds the list of the colors in this set. (preset or auto-generated)
	 */
	protected _list: Pattern[] = [];

	/**
	 * Current step.
	 */
	protected _currentStep: number = 0;

	/**
	 * If set to non-zero value, the PatternSet will start iterating patterns from
	 * that particular index, not the first pattern in the list.
	 */
	protected _startIndex: number = 0;

	/**
	 * Current pass in cycle. Once all patterns in the list are iterated,
	 * iteration restarts from beginning and currentPass is incremented.
	 */
	protected _currentPass: number = 0;

	/**
	 * A base color. If there are no colors pre-set in the color list, ColorSet
	 * will use this color as a base when generating new ones, applying
	 * `stepOptions` and `passOptions` to this base color.
	 */
	public baseColor: Color = new Color({
		r: 103,
		g: 183,
		b: 220
	});

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "PatternSet";

		// Set base color to be used for pattern elements
		const interfaceColors = new InterfaceColorSet();

		// Set default patterns
		this.list = [
			this.getLinePattern(6, 45, 1),
			this.getRectPattern(5, 0, 2),
			this.getLinePattern(6, 90, 1),
			this.getCirclePattern(8, 0, 2),
			this.getLinePattern(6, 0, 1),
			this.getRectPattern(3, 0, 1),
			this.getLinePattern(6, 90, 3),
			this.getRectPattern(6, 0, 4),
			this.getLinePattern(6, 45, 2),
			this.getRectPattern(2, 0, 1),
			this.getLinePattern(6, 0, 3),
		];

		this.baseColor = interfaceColors.getFor("stroke");
		this.applyTheme();
	}

	public getLinePattern(size: number, rotation: number, thickness: number): LinePattern {
		let pattern = new LinePattern();
		pattern.width = size;
		pattern.height = size;
		pattern.stroke = this.baseColor;
		pattern.strokeWidth = thickness;
		pattern.rotation = rotation;
		return pattern;
	}

	public getRectPattern(size: number, rotation: number, thickness: number): RectPattern {
		let pattern = new RectPattern();
		pattern.width = size;
		pattern.height = size;
		pattern.rectWidth = thickness;
		pattern.rectHeight = thickness;
		pattern.fill = this.baseColor;
		pattern.strokeWidth = 0;
		pattern.element.attr({ transform: "translate(" + ((size - thickness) / 2) + ", " + ((size - thickness) / 2) + ")" });
		pattern.rotation = rotation;
		return pattern;
	}

	public getCirclePattern(size: number, rotation: number, thickness: number): Pattern {
		let pattern = new Pattern();
		pattern.width = size;
		pattern.height = size;

		let circle = new Circle()
		circle.radius = thickness;
		circle.fill = this.baseColor;
		circle.strokeWidth = 0;
		circle.element.attr({ transform: "translate(" + (size / 2) + ", " + (size / 2) + ")" });
		pattern.addElement(circle.element);

		return pattern;
	}

	/**
	 * List of pre-defined patterns to be used in set.
	 *
	 * @param value Pattern list
	 */
	public set list(value: Pattern[]) {
		this._list = value;
		this.reset();
	}

	/**
	 * @return Pattern list
	 */
	public get list(): Pattern[] {
		return this._list;
	}

	/**
	 * Returns the next pattern in list.
	 *
	 * @return Pattern
	 */
	public next(): Pattern {
		const pattern = this.getIndex(this.currentStep);
		this._currentStep++;
		return pattern;
	}

	/**
	 * Returns a color at specific index in the list.
	 *
	 * @param  i  Index
	 * @return Pattern
	 */
	public getIndex(i: number): Pattern {
		let pattern;
		while (this.list.length <= this._currentStep) {
			this.generatePatterns();
		}
		pattern = this.list[this._currentStep];
		return pattern;
	}

	/**
	 * Generates a new set of patterns.
	 */
	private generatePatterns(): void {
		const count = this.list.length / (this._currentPass + 1);
		this._currentPass++;
		for (let i = 0; i < count; i++) {
			this.list.push(this.list[i].clone());
		}
	}

	/**
	 * Resets internal iterator.
	 *
	 * Calling `next()` after this will return the very first color in the color
	 * list, even if it was already returned before.
	 */
	public reset(): void {
		this._currentStep = this._startIndex;
	}

	/**
	 * Sets current color iteration. You can use this property to skip some
	 * colors from iteration. E.g. setting it to `10` will skip first ten
	 * colors.
	 *
	 * Please note that the number is zero-based.
	 *
	 * @param value  Step
	 */
	public set currentStep(value: number) {
		this._currentStep = value;
	}

	/**
	 * @return Step
	 */
	public get currentStep(): number {
		return this._currentStep;
	}

	/**
	 * If set to non-zero value, the ColorSet will start iterating colors from
	 * that particular index, not the first color in the list.
	 *
	 * @default 0
	 * @param  value  Index
	 */
	public set startIndex(value: number) {
		this._startIndex = value;
		this.reset();
	}

	/**
	 * @return Index
	 */
	public get startIndex(): number {
		return this._startIndex;
	}

	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		// if (config) {

		// 	// Set up axis ranges
		// 	if ($type.hasValue(config.list) && $type.isArray(config.list)) {
		// 		for (let i = 0, len = config.list.length; i < len; i++) {
		// 			if (!(config.list[i] instanceof Color)) {
		// 				config.list[i] = color(config.list[i]);
		// 			}
		// 		}
		// 	}
		// }
		super.processConfig(config);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["PatternSet"] = PatternSet;