/**
 * Pattern module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../../Base";
import { Group } from "../Group";
import { AMElement } from "../AMElement";
import { Paper, getGhostPaper } from "../Paper";
import { ShapeRendering } from "../../defs/ShapeRendering";
import { List, ListDisposer } from "../../utils/List";
import { MultiDisposer } from "../../utils/Disposer";
import { Animation, IAnimatable, IAnimationOptions, AnimationDisposer } from "../../utils/Animation";
import { registry } from "../../Registry";
import { Color } from "../../utils/Color";
import { InterfaceColorSet } from "../../utils/InterfaceColorSet";
import { percent, Percent } from "../../utils/Percent";
import * as $iter from "../../utils/Iterator";
import * as $object from "../../utils/Object";
import * as $type from "../../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines available units to measure patterns.
 *
 * @type {string}
 */
export type PatternUnits = "userSpaceOnUse" | "objectBoundingBox";

/**
 * Defines properties for [[Pattern]].
 *
 * @type {string}
 */
export interface PatternProperties {
	x: number;
	y: number;
	width: number;
	height: number;
	backgroundOpacity: number;
	backgroundFill: Color;
	fillOpacity: number;
	fill: Color;
	stroke: Color;
	strokeOpacity: number;
	strokeWidth: number;
	shapeRendering: ShapeRendering;
	rotation: number;
	patternUnits: PatternUnits;
};


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Base class to define patterns.
 */
export class Pattern extends BaseObject implements IAnimatable {

	/**
	 * List of available animations currently running on a pattern.
	 *
	 * @type {Optional<Array<Animation>>}
	 */
	protected _animations: $type.Optional<Array<Animation>>;

	/**
	 * An SVG `<group>` element to put sub-elements into.
	 *
	 * @type {Group}
	 */
	public element: Group;

	/**
	 * Reference to [[Paper]] instance.
	 *
	 * @type {Optional<Paper>}
	 */
	protected _paper: $type.Optional<Paper>;

	/**
	 * List of elements the pattern consists of.
	 *
	 * @type {List<AMElement>}
	 */
	protected _elements: List<AMElement> = new List<AMElement>();

	/**
	 * Defines property types.
	 *
	 * @type {FilterProperties}
	 */
	public _properties!: PatternProperties;

	/**
	 * A storage for Filter property/value pairs.
	 *
	 * @ignore Exclude from docs
	 * @see {@link PatternProperties}
	 * @type {PatternProperties}
	 */
	public properties: this["_properties"] = <any>{};
	//public propertyValues = new Dictionary<PatternProperties, any>();

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Pattern";

		// Set defaults
		this.width = 10;
		this.height = 10;
		this.x = 0;
		this.y = 0;
		this.patternUnits = "userSpaceOnUse";

		let interfaceColors = new InterfaceColorSet();

		this.backgroundFill = interfaceColors.getFor("background");
		this.backgroundOpacity = 0;

		this.fillOpacity = 1;
		this.fill = interfaceColors.getFor("alternativeBackground");
		this.stroke = interfaceColors.getFor("alternativeBackground");
		this.strokeOpacity = 1;
		this.strokeWidth = 1;
		this.shapeRendering = "crispEdges";
		this.rotation = 0;

		// Create main group to store pattern elements inelements
		this.element = this.paper.addGroup("pattern");
		this.id = "pattern-" + registry.getUniqueId();
		this.element.attr({ "id": this.id });
		this._disposers.push(this.element);

		// Make elements disposable
		this._disposers.push(new ListDisposer(this._elements));

		// Request again to trigger getter/setter code
		this.patternUnits = this.patternUnits;
		this.width = this.width;
		this.height = this.height;

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Draws the pattern.
	 */
	protected draw(): void {

		let patternElement: Group = this.element;
		if (patternElement) {

			patternElement.removeChildNodes();

			let background = this.paper.add("rect");
			background.attr({ "width": this.width, "height": this.height, "shape-rendering": "crispEdges", "fill": this.backgroundFill.hex, "fill-opacity": this.backgroundOpacity, "stroke": this.backgroundFill.hex, "stroke-opacity": this.backgroundOpacity });
			patternElement.add(background);

			patternElement.attr({ "x": this.x, "y": this.y, "width": this.width, "height": this.height, "stroke": this.stroke.hex, "fill": this.fill.hex, "fill-opacity": this.fillOpacity, "stroke-opacity": this.strokeOpacity, "stroke-width": this.strokeWidth, "shape-rendering": this.shapeRendering, "patternUnits": this.patternUnits });

			$iter.each(this._elements.iterator(), (element) => {
				element.rotation = this.rotation;
				this.element.add(element);
			});
		}
	}

	/**
	 * Animate pattern properties.
	 *
	 * @see {@link Animation}
	 * @param  {IAnimationOptions[] | IAnimationOptions}  animationOptions  Animation options
	 * @param  {number}                                   duration          Duration (ms)
	 * @param  {(number) => number}                       easing            Easing function
	 * @return {Animation}                                                  Animation instance
	 */
	public animate(animationOptions: IAnimationOptions[] | IAnimationOptions, duration: number, easing?: (value: number) => number): Animation {
		return new Animation(this, animationOptions, duration, easing).start();
	}

	/**
	 * Adds an element to the pattern.
	 *
	 * @param {AMElement}  element  Element
	 */
	public addElement(element: AMElement): void {
		this._elements.push(element);
		this._disposers.push(element);
	}

	/**
	 * Remove an element from the pattern.
	 *
	 * @param {AMElement}  element  Element
	 */
	public removeElement(element: AMElement): void {
		this._elements.removeValue(element);
		this.removeDispose(element);
	}

	/**
	 * Returns the list of SVG elements comprising the pattern.
	 *
	 * @return {List<AMElement>} Pattern elements
	 */
	public get elements(): List<AMElement> {
		return this._elements;
	}

	/**
	 * Pattern fill opacity. (0-1)
	 *
	 * @param {number}  value  Opacity (0-1)
	 */
	public set fillOpacity(value: number) {
		this.properties["fillOpacity"] = value;
		this.draw();
	}

	/**
	 * @return {number} Opacity (0-1)
	 */
	public get fillOpacity(): number {
		return this.properties["fillOpacity"];
	}

	/**
	 * Fill color of the pattern.
	 *
	 * @param {Color}  value  Fill color
	 */
	public set fill(value: Color) {
		this.properties["fill"] = value;
		this.draw();
	}

	/**
	 * @return {Color} Fill color
	 */
	public get fill(): Color {
		return this.properties["fill"];
	}

	/**
	 * Pattern background fill color.
	 *
	 * @param {Color}  value  Background color
	 */
	public set backgroundFill(value: Color) {
		this.properties["backgroundFill"] = value;
		this.draw();
	}

	/**
	 * @return {Color} Background color
	 */
	public get backgroundFill(): Color {
		return this.properties["backgroundFill"];
	}

	/**
	 * Pattern backgorund opacity. (0-1)
	 *
	 * @param {number}  value  Background opacity (0-1)
	 */
	public set backgroundOpacity(value: number) {
		this.properties["backgroundOpacity"] = value;
		this.draw();
	}

	/**
	 * @return {number} Background opacity (0-1)
	 */
	public get backgroundOpacity(): number {
		return this.properties["backgroundOpacity"];
	}

	/**
	 * Pattern stroke (border) color.
	 *
	 * @param {Color}  value  Color
	 */
	public set stroke(value: Color) {
		this.properties["stroke"] = value;
		this.draw();
	}

	/**
	 * @return {Color} Color
	 */
	public get stroke(): Color {
		return this.properties["stroke"];
	}

	/**
	 * Pattern stroke opacity. (0-1)
	 *
	 * @param {number}  value  Opacity (0-1)
	 */
	public set strokeOpacity(value: number) {
		this.properties["strokeOpacity"] = value;
		this.draw();
	}

	/**
	 * @return {number} Opacity (0-1)
	 */
	public get strokeOpacity(): number {
		return this.properties["strokeOpacity"];
	}

	/**
	 * Pattern stroke thickness in pixels.
	 *
	 * @param {number}  value  Stroke thickness (px)
	 */
	public set strokeWidth(value: number) {
		this.properties["strokeWidth"] = value;
		this.draw();
	}

	/**
	 * @return {number} Stroke thickness (px)
	 */
	public get strokeWidth(): number {
		return this.properties["strokeWidth"];
	}

	/**
	 * Shape rendering
	 * @param {ShapeRendering} value [description]
	 */
	public set shapeRendering(value: ShapeRendering) {
		this.properties["shapeRendering"] = value;
		this.draw();
	}

	public get shapeRendering(): ShapeRendering {
		return this.properties["shapeRendering"];
	}

	/**
	 * Pattern rotation in degrees.
	 *
	 * @param {number}  value  Rotation
	 */
	public set rotation(value: number) {
		this.properties["rotation"] = value;
		this.draw();
	}

	/**
	 * @return {number} Rotation
	 */
	public get rotation(): number {
		return this.properties["rotation"];
	}

	/**
	 * Pattern measuring units.
	 *
	 * Available options: "userSpaceOnUse" | "objectBoundingBox".
	 *
	 * @param {"userSpaceOnUse" | "objectBoundingBox"}  value  Units
	 */
	public set patternUnits(value: "userSpaceOnUse" | "objectBoundingBox") {
		this.properties["patternUnits"] = value;
		this.draw();
	}

	/**
	 * @return {"userSpaceOnUse" | "objectBoundingBox"} Units
	 */
	public get patternUnits(): "userSpaceOnUse" | "objectBoundingBox" {
		return this.properties["patternUnits"];
	}

	/**
	 * Pattern width in pixels.
	 *
	 * @param {number}  value  Width (px)
	 */
	public set width(value: number) {
		this.properties["width"] = value;
		this.draw();
	}

	/**
	 * @return {number} Width (px)
	 */
	public get width(): number {
		return this.properties["width"];
	}

	/**
	 * Pattern height in pixels.
	 *
	 * @param {number} value Height (px)
	 */
	public set height(value: number) {
		this.properties["height"] = value;
		this.draw();
	}

	/**
	 * @return {number} Height (px)
	 */
	public get height(): number {
		return this.properties["height"];
	}

	/**
	 * X position. (pixels)
	 *
	 * @param {number} value X (px)
	 */
	public set x(value: number) {
		this.properties["x"] = value;
		this.draw();
	}

	/**
	 * @return {number} X (px)
	 */
	public get x(): number {
		return this.properties["x"];
	}

	/**
	 * Y position (px).
	 *
	 * @param {number} value Y (px)
	 */
	public set y(value: number) {
		this.properties["y"] = value;
		this.draw();
	}

	/**
	 * @return {number} Y (px)
	 */
	public get y(): number {
		return this.properties["y"];
	}

	/**
	 * [[Paper]] instance to draw pattern in.
	 *
	 * @ignore Exclude from docs
	 * @param {Paper}  paper  Paper
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
	 * @return {Paper} Paper
	 */
	public get paper(): Paper {
		if (this._paper) {
			return this._paper;
		}
		return getGhostPaper();
	}

	/**
	 * Copies properties from another Pattern instance.
	 *
	 * @param {this}  source  Source pattern
	 */
	public copyFrom(source: this) {
		super.copyFrom(source);
		$object.each(source.properties, (key, value) => {
			(<any>this)[key] = value;
		});
	}

	/**
	 * A list of animations currently running on the patter.
	 *
	 * @ignore Exclude from docs
	 * @return {Array<Animation>} Animation list
	 */
	public get animations(): Array<Animation> {
		if (!this._animations) {
			this._animations = [];
			this._disposers.push(new AnimationDisposer(this._animations));
		}
		return this._animations;
	}


	/**
	 * Processes JSON-based config before it is applied to the object.
	 *
	 * @ignore Exclude from docs
	 * @param {object}  config  Config
	 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Set up series
			if ($type.hasValue(config.elements) && $type.isArray(config.elements)) {
				for (let i = 0, len = config.elements.length; i < len; i++) {
					let element = config.elements[i];
					if ($type.hasValue(element["type"])) {
						let sprite = this.createEntryInstance(element);
						if (sprite instanceof BaseObject) {
							sprite.config = element;
						}
						this.addElement(
							$type.hasValue(element["typeProperty"])
							? sprite[element["typeProperty"]]
							: sprite.element
						);
					}
				}
			}

		}

		super.processConfig(config);

	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Pattern"] = Pattern;
