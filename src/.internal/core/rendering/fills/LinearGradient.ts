/**
 * Contains code and logic for generating linear gradients.
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
import { Color } from "../../utils/Color";
import { registry } from "../../Registry";
import * as $iter from "../../utils/Iterator";
import * as $math from "../../utils/Math";
import * as $type from "../../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Represents an object describing color switching point in a gradiend.
 */
export interface IGradientStop {

	/**
	 * Color.
	 */
	color: Color;

	/**
	 * Offset defines where in the gradient the color should kick in. Values
	 * from 0 to 1 are possible with 0 meaning start, 0.5 half-way through the
	 * gradient, etc.
	 */
	offset?: number;

	/**
	 * Transparency of the color. 0 - completely transparent, 1 - fully opaque.
	 */
	opacity?: number;

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Linear gradient class.
 */
export class LinearGradient extends BaseObject {

	/**
	 * List of colors switch definitions in a gradient.
	 */
	protected _stops: List<IGradientStop> = new List<IGradientStop>();

	/**
	 * An SVG `<group>` element used to draw gradient.
	 */
	public element: Group;

	/**
	 * Reference to Paper to add element to.
	 */
	protected _paper: $type.Optional<Paper>;

	/**
	 * Gradient direction.
	 */
	protected _rotation: number = 0;

	/**
	 * Constructor.
	 */
	constructor() {

		// Init
		super();
		this.className = "LinearGradient";

		this._stops.events.on("setIndex", this.validate, this);
		this._stops.events.on("inserted", this.validate, this);
		// Create element
		this.element = this.paper.addGroup("linearGradient");
		this.id = "gradient-" + registry.getUniqueId();
		this.element.attr({ "id": this.id });
		this._disposers.push(this.element);

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Draws gradient.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {

		let rotation = (this._rotation + 90) * $math.RADIANS;

		let x1: string = Math.round(50 + Math.sin(rotation + Math.PI) * 50) + '%';
		let y1: string = Math.round(50 + Math.cos(rotation) * 50) + '%';

		let x2: string = Math.round(50 + Math.sin(rotation) * 50) + '%';
		let y2: string = Math.round(50 + Math.cos(rotation + Math.PI) * 50) + '%';


		let gradientElement: Group = this.element;
		gradientElement.removeChildNodes();
		gradientElement.attr({"x1": x1, "x2":x2, "y1": y1, "y2":y2});

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
	 * Clears the gradient.
	 *
	 * @ignore Exclude from docs
	 */
	public clear(): void {
		this._stops.clear();
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
	 * [[Paper]] instace to use for the gradient.
	 *
	 * @ignore Exclude from docs
	 * @param paper  Paper
	 */
	public set paper(paper: Paper) {
		if (this._paper != paper) {
			this._paper = paper;
			this.validate();
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
	 * Rotation (direction) of the gradient in degrees.
	 *
	 * @param value  Rotation
	 */
	public set rotation(value: number) {
		//this.element.attr({ "gradientTransform": "rotate(" + value + " 10 100)" });
		this._rotation = value;
		this.validate();
	}

	/**
	 * @return Rotation
	 */
	public get rotation(): number {
		return this._rotation;
	}


	public copyFrom(source:this){
		super.copyFrom(source);

		this.stops.copyFrom(source.stops);

		this._rotation = source.rotation;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LinearGradient"] = LinearGradient;
