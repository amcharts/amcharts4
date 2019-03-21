/**
 * Contains code and logic for generating radial gradients.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../../Base";
import { List } from "../../utils/List";
import { Group } from "../Group";
import { AMElement } from "../AMElement";
import { Paper, getGhostPaper } from "../Paper";
import { registry } from "../../Registry";
import { IGradientStop } from "./LinearGradient";
import { Color } from "../../utils/Color";
import * as $iter from "../../utils/Iterator";
import * as $type from "../../utils/Type";
import { Percent } from "../../utils/Percent";


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Radial gradient class.
 */
export class RadialGradient extends BaseObject {

	/**
	 * List of colors switch definitions in a gradient.
	 */
	protected _stops: List<IGradientStop> = new List<IGradientStop>();

	/**
	 * An SVG `<group>` element used to draw gradient.
	 *
	 * @ignore Exclude from docs
	 */
	public element: Group;

	/**
	 * Reference to Paper to add element to.
	 */
	protected _paper: $type.Optional<Paper>;

	/**
	 * A center x coordinate for the radial gradient, can be set in pixels or as Percent
	 */
	protected _cx: $type.Optional<number | Percent>;

	/**
	 * A center y coordinate for the radial gradient, can be set in pixels or as Percent
	 */
	protected _cy: $type.Optional<number | Percent>;

	/**
	 * A y coordinate of the focal point of a gradient, can be set in pixels or as Percent
	 */
	protected _fx: $type.Optional<number | Percent>;

	/**
	 * A y coordinate of the focal point of a gradient, can be set in pixels or as Percent
	 */
	protected _fy: $type.Optional<number | Percent>;


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.element = this.paper.addGroup("radialGradient");
		this.id = "gradient-" + registry.getUniqueId();
		this.element.attr({ "id": this.id });
		this._disposers.push(this.element);

		this.applyTheme();
	}

	/**
	 * Draws gradient.
	 */
	protected draw(): void {

		let gradientElement = this.element;

		if ($type.isNumber(this.cx)) {
			let value:any = this.cx;
			if(value instanceof Percent){
				value = value.percent + "%";
			}
			gradientElement.attr({ "cx": value });
		}

		if ($type.isNumber(this.cy)) {
			let value:any = this.cy;
			if(value instanceof Percent){
				value = value.percent + "%";
			}
			gradientElement.attr({ "cy": value });
		}

		if (this.fx) {
			let value:any = this.fx;
			if(value instanceof Percent){
				value = value.percent + "%";
			}
			gradientElement.attr({ "fx": value});
		}

		if (this.fy) {
			let value:any = this.fy;
			if(value instanceof Percent){
				value = value.percent + "%";
			}
			gradientElement.attr({ "fy": value});
		}

		gradientElement.removeChildNodes();

		$iter.each($iter.indexed(this._stops.iterator()), (a) => {
			let i = a[0];
			let stop = a[1];
			let offset: $type.Optional<number> = stop.offset;

			if (!$type.isNumber(offset)) {
				offset = i / (this._stops.length - 1)
			}

			let gradientStop: AMElement = this.paper.add("stop");
			if ($type.hasValue(stop.color)) {
				gradientStop.attr({ "stop-color": stop.color.toString() });
			}
			if ($type.isNumber(stop.opacity)) {
				gradientStop.attr({ "stop-opacity": stop.opacity });
			}

			if ($type.isNumber(offset)) {
				gradientStop.attr({ "offset": offset });
			}

			gradientElement.add(gradientStop);
		});
	}

	/**
	 * Adds a color step to the gradient.
	 *
	 * @param color    Color (hex code or named color)
	 * @param opacity  Opacity (value from 0 to 1; 0 completely transaprent, 1 fully opaque)
	 * @param offset   Position of color in the gradient (value 0 to 1; 0 meaning start of the gradient and 1 end)
	 */
	public addColor(color: Color, opacity?: number, offset?: number): void {
		this._stops.push({ color: color, opacity: opacity, offset: offset });
		this.draw();
	}

	/**
	 * A [[Paper]] instace to use for the gradient.
	 *
	 * @ignore Exclude from docs
	 * @param paper  Paper
	 */
	public set paper(paper: Paper) {
		if (this._paper != paper) {
			this._paper = paper;
			this.draw();
			paper.appendDef(this.element);
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Paper
	 */
	public get paper(): Paper {
		if (this._paper) {
			return this._paper;
		}
		return getGhostPaper();
	}

	/**
	 * Center x coordinate of the gradient, can be set as number or Percent
	 *
	 * @param point  Center point
	 */
	public set cx(value: $type.Optional<number | Percent>) {
		this._cx = value;
		this.draw();
	}

	public get cx(): $type.Optional<number | Percent> {
		return this._cx;
	}

	/**
	 * Center y coordinate of the gradient, can be set as number or Percent
	 *
	 * @param point  Center point
	 */
	public set cy(value: $type.Optional<number | Percent>) {
		this._cy = value;
		this.draw();
	}

	public get cy(): $type.Optional<number | Percent> {
		return this._cy;
	}


	/**
	 * y coordinate of the focal point of a gradient, can be set in pixels or as Percent
	 *
	 * @param point  Center point
	 */
	public set fx(value: $type.Optional<number | Percent>) {
		this._fx = value;
		this.draw();
	}

	public get fx(): $type.Optional<number | Percent> {
		return this._fx;
	}

	/**
	 * y coordinate of the focal point of a gradient, can be set in pixels or as Percent
	 *
	 * @param point  Center point
	 */
	public set fy(value: $type.Optional<number | Percent>) {
		this._fy = value;
		this.draw();
	}

	public get fy(): $type.Optional<number | Percent> {
		return this._fy;
	}



	public copyFrom(source:this){
		super.copyFrom(source);

		this.stops.copyFrom(source.stops);

		this.cx = source.cx;
		this.cy = source.cy;

		this.fx = source.fx;
		this.fy = source.fy;
	}

	/**
	 * A list of color stops in the gradient.
	 *
	 * @return Stops
	 */
	public get stops(): List<IGradientStop> {
		return this._stops;
	}

	/**
	 * Clears the gradient.
	 *
	 * @ignore Exclude from docs
	 */
	public clear(): void {
		this._stops.clear();
	}


}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["RadialGradient"] = RadialGradient;
