/**
 * This module contains Color object definition
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { iRGB, iHSV, iHSL } from "./Colors";
import { registry } from "../Registry";
import * as $colors from "./Colors";
import * as $type from "./Type";

// Re-export
export { iRGB, iHSV, iHSL };

/**
 * Represents a color.
 *
 * `Color` accepts value only in [[iRGB]] object format. To create `Color`
 * object by parsing it from any supported string-based formats, use helper
 * [[color]] function:
 *
 * ```TypeScript
 * am4core.color("#ff0000");
 * am4core.color("#f00");
 * am4core.color("rgb(255, 0, 0)");
 * am4core.color("rgba(255, 0, 0, 0.5)");
 * am4core.color({ r: 255, g: 0, b: 0 });
 * am4core.color("red");
 * ```
 * ```JavaScript
 * am4core.color("#ff0000");
 * am4core.color("#f00");
 * am4core.color("rgb(255, 0, 0)");
 * am4core.color("rgba(255, 0, 0, 0.5)");
 * am4core.color({ r: 255, g: 0, b: 0 });
 * am4core.color("red");
 * ```
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/colors/} for color-related info
 */
export class Color {

	/**
	 * Light color (used when light contrasting color is required).
	 *
	 * @param {Color}
	 * @ignore
	 */
	protected _lightColor: $type.Optional<Color>;

	/**
	 * Dark color (used when dark contrasting color is required).
	 *
	 * @param {Color}
	 * @ignore
	 */
	protected _darkColor: $type.Optional<Color>;

	/**
	 * Holds RGB value of the color.
	 */
	protected _value: $type.Optional<iRGB>;

	/**
	 * Constructor
	 *
	 * @param color Source color
	 */
	constructor(color: $type.Optional<iRGB>) {
		this._value = color;
	}

	/**
	 * Returns [[iRGB]] representation of the color.
	 *
	 * @return RGB object
	 */
	public get rgb(): $type.Optional<iRGB> {
		return this._value;
	}

	/**
	 * Returns color hex value string, e.g. "#FF0000".
	 *
	 * @return Hex color code
	 */
	public get hex(): string {
		return this._value ? $colors.rgbToHex(this._value) : "none";
	}

	/**
	 * Returns an `rgba()` representation of the color, e.g.:
	 * `rgba(255, 0, 0, 0.5)`.
	 *
	 * @return rgba color string
	 */
	public get rgba(): string {
		return this._value ? $colors.rgbToRGBA(this._value) : "none";
	}

	/**
	 * Set alpha (transparency) of the color.
	 *
	 * @param value Alpha (0-1)
	 */
	public set alpha(value: number) {
		if (this._value) {
			this._value.a = value;
		}
	}

	/**
	 * Returns current transparency.
	 *
	 * @return Alpha (0-1)
	 */
	public get alpha(): number {
		if (this._value != null && this._value.a != null) {
			return this._value.a;

		} else {
			return 1;
		}
	}

	/**
	 * Sets "light" color. Used when determining contrasting color.
	 *
	 * @param color Color
	 */
	public set lightColor(color: Color) {
		this._lightColor = color;
	}

	/**
	 * Returns current light color setting.
	 *
	 * @return Color
	 */
	public get lightColor(): Color {
		if (!this._lightColor) {
			this._lightColor = new Color({ r: 255, g: 255, b: 255 });
		}
		return this._lightColor;
	}

	/**
	 * Sets "dark" color. Used when determining contrasting color.
	 *
	 * @param color Color
	 */
	public set darkColor(color: Color) {
		this._darkColor = color;
	}

	/**
	 * Returns current dark color setting.
	 *
	 * @return Color
	 */
	public get darkColor(): Color {
		if (!this._darkColor) {
			this._darkColor = new Color({ r: 0, g: 0, b: 0 });
		}
		return this._darkColor;
	}

	/**
	 * Overrides `toString` method so that [[Color]] object can be used as
	 * string.
	 *
	 * @ignore Exclude from docs
	 * @return String represantion of color (usable in CSS)
	 */
	public toString(): string {
		return this.alpha < 1 ? this.rgba : this.hex;
	}

	/**
	 * Returns a new [[Color]] which is percent lighter (positive value),
	 * or darker (negative value).
	 *
	 * Parameter is in the scale of -1 to 1.
	 *
	 * @param percent  Increase/decrease lightness by X
	 * @return New Color
	 */
	public lighten(percent: number): Color {
		return new Color($colors.lighten(this.rgb, percent));
	}

	/**
	 * Returns a new [[Color]] which is percent brighter (positive value),
	 * or darker (negative value).
	 *
	 * Parameter is in the scale of -1 to 1.
	 *
	 * @param percent  Increase/decrease brightness by X
	 * @return New Color
	 */
	public brighten(percent: number): Color {
		return new Color($colors.brighten(this.rgb, percent));
	}

	/**
	 * Returns a new [[Color]] based on current color with specific saturation
	 * applied.
	 *
	 * `saturation` can be in the range of 0 (fully desaturated) to 1 (fully
	 * saturated).
	 *
	 * @param saturation  Saturation (0-1)
	 * @return New (saturated) color
	 */
	public saturate(saturation: number): Color {
		return new Color($colors.saturate(this.rgb, saturation));
	}

	/**
	 * Returns a either light or dark color that contrasts specifically with
	 * this color.
	 *
	 * Uses properties `darkColor` (default black) and `lightColor` (default
	 * white).
	 *
	 * Useful when determining which color label should be on a colored
	 * background, so that it stands out.
	 *
	 * @return Contrasting color
	 */
	public get alternative(): Color {
		if (this.rgb != null) {
			return $colors.isLight(this.rgb) ? this.darkColor : this.lightColor;

		} else {
			throw new Error("Color does not exist");
		}
	}
}

/**
 * Resolves an input variable to a normal [[iRGB]] color and creates [[Color]]
 * object for it.
 *
 * @param value  Input value
 * @param alpha  Alpha (0-1)
 * @return Color object
 */
export function color(value?: string | iRGB | Color, alpha?: number): Color {

	if (!$type.hasValue(value)) {
		return new Color(undefined);
	}

	if (typeof value == "string") {
		let cacheId = "_color_" + value + "_" + (alpha || "1");
		let cached = registry.getCache(cacheId);
		if (cached) {
			return new Color({
				r: cached.r,
				g: cached.g,
				b: cached.b,
				a: cached.a
			});
		}
		let rgb = $colors.rgb(value, alpha);
		registry.setCache(cacheId, rgb);
		return new Color(rgb);
	}

	// Check if it's already a Color object
	if (value instanceof Color) {
		if ($type.hasValue(alpha)) {
			value.alpha = alpha;
		}
		return value;
	}

	// Not a string or Color instance, it's the iRGB object then
	return new Color(value);
}

/**
 * Checks if supplied argument is instance of [[Color]].
 *
 * @param value  Input value
 * @return Is Color?
 */
export function isColor(value: any): boolean {
	return value instanceof Color;
}

/**
 * Converts any value to [[Color]].
 *
 * @param value  Input value
 * @return Color
 */
export function castColor(value: any): Color {
	return color(value);
}

/**
 * Converts any value into a [[Color]].
 *
 * @param value  Source value
 * @return Color object
 */
export function toColor(value: any): Color {
	if ($type.hasValue(value) && !isColor(value)) {
		return castColor(value);
	}
	return value;
}
