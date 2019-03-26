/**
 * This module contains a version of ColorSet that can (and should) be used for
 * coloring UI elements.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../Base";
import { registry } from "../Registry";
import { Color, color } from "./Color";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines available color purposes and their relation with the color set color
 * index.
 */
export interface IColorPurpose {
	stroke: Color,
	fill: Color,

	primaryButton: Color,
	primaryButtonHover: Color,
	primaryButtonDown: Color,
	primaryButtonActive: Color,
	primaryButtonText: Color,
	primaryButtonStroke: Color,

	secondaryButton: Color,
	secondaryButtonHover: Color,
	secondaryButtonDown: Color,
	secondaryButtonActive: Color,
	secondaryButtonText: Color,
	secondaryButtonStroke: Color,

	grid: Color,
	background: Color,
	alternativeBackground: Color,
	text: Color,
	alternativeText: Color,
	disabledBackground: Color,

	positive: Color,
	negative: Color
}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This module contains a version of ColorSet that can (and should) be used for
 * coloring UI elements.
 *
 * The main difference from the basic [[ColorSet]] is that instead of sequenced
 * colors, it uses a concept of named colors.
 *
 * This way, every element in the UI can extract an exact color theme author
 * meant for the specific purpose, like strokes, backgrounds, etc.
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/colors/} for color-related info
 */
export class InterfaceColorSet extends BaseObject {

	/**
	 * Maps the list of purposes (like "stroke") to an index of color of the
	 * color set.
	 */
	protected _purposes: IColorPurpose = {
		stroke: color("#e5e5e5"),
		fill: color("#f3f3f3"),

		primaryButton: color("#6794dc"),
		primaryButtonHover: color("#6771dc"),
		primaryButtonDown: color("#68dc75"),
		primaryButtonActive: color("#68dc75"),
		primaryButtonText: color("#FFFFFF"),
		primaryButtonStroke: color("#FFFFFF"),

		secondaryButton: color("#d9d9d9"),
		secondaryButtonHover: color("#d9d9d9").brighten(-0.25),
		secondaryButtonDown: color("#d9d9d9").brighten(-0.35),
		secondaryButtonActive: color("#d9d9d9").brighten(0.35),
		secondaryButtonText: color("#000000"),

		secondaryButtonStroke: color("#FFFFFF"),

		grid: color("#000000"),
		background: color("#ffffff"),
		alternativeBackground: color("#000000"),
		text: color("#000000"),
		alternativeText: color("#FFFFFF"),
		disabledBackground: color("#999999"),
		positive: color("#67dc75"),
		negative: color("#dc6788")
	};

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "InterfaceColorSet";
		this.applyTheme();
	}

	protected debug(): void {}

	/**
	 * Returns a color to be used for the specific purpose.
	 *
	 * ```TypeScript
	 * let uicolors = new am4core.InterfaceColorSet();
	 * console.log(uicolors.getFor("stroke"));
	 * ```
	 * ```JavaScript
	 * var uicolors = new am4core.InterfaceColorSet();
	 * console.log(uicolors.getFor("stroke"));
	 * ```
	 *
	 * @param purpose  Color use purpuse
	 * @return Color
	 */
	public getFor(purpose: keyof IColorPurpose): Color {
		return this._purposes[purpose];
	}

	/**
	 * Sets color to be used for the specific purpose.
	 *
	 * @param purpose  Color use purpose
	 * @param color    Color
	 */
	public setFor(purpose: keyof IColorPurpose, color: Color): void {
		this._purposes[purpose] = color;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["InterfaceColorSet"] = InterfaceColorSet;
