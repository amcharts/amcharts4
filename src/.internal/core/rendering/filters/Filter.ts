/**
 * This module contains a base class for an SVG filter.
 *
 * Filters can be used to decorate, change and transform just about any DOM
 * element.
 *
 * A Filter works by applying one or more effects (primitives) to SVG element.
 *
 * For more information on how SVG filters work, refer to
 * [this MDN tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Filters_Tutorial).
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../../Base";
import { registry } from "../../Registry";
import { Paper, getGhostPaper } from "../Paper";
import { Group } from "../Group";
import { AMElement } from "../AMElement";
import { Animation, IAnimatable, IAnimationOptions, AnimationDisposer } from "../../utils/Animation";
import { List } from "../../utils/List";
import { MultiDisposer } from "../../utils/Disposer";
import { Sprite } from "../../Sprite";
import * as $object from "../../utils/Object";
import * as $iter from "../../utils/Iterator";
import * as $type from "../../utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for a base filter
 * @type {string}
 */
export interface FilterProperties {

	/**
	 * Width of the filter in percent.
	 *
	 * @default 120
	 * @type {number}
	 */
	width: number;

	/**
	 * Height of the filter in percent.
	 *
	 * @default 120
	 * @type {number}
	 */
	height: number;

};


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Base filter class.
 *
 * This class while can be instantiated will not do anything. It is just a base
 * functionality for any other "real" filters to extend.
 *
 * Filters can be used to decorate, change and transform just about any DOM
 * element.
 *
 * A Filter works by applying one or more effects (primitives) to SVG element.
 *
 * For more information on how SVG filters work, refer to
 * [this MDN tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Filters_Tutorial).
 *
 * @todo Example
 */
export class Filter extends BaseObject implements IAnimatable {

	/**
	 * List of animations currently running for the filter.
	 *
	 * @type {Optional<Array<Animation>>}
	 */
	protected _animations: $type.Optional<Array<Animation>>;

	/**
	 * Contains a list of filter primitives (effects) applied by the filter.
	 *
	 * @ignore Exclude from docs
	 * @type {List<AMElement>}
	 */
	public filterPrimitives: List<AMElement>;

	/**
	 * Defines property types.
	 *
	 * @type {FilterProperties}
	 */
	public _properties!: FilterProperties;

	/**
	 * A storage for Filter property/value pairs.
	 *
	 * @ignore Exclude from docs
	 * @see {@link FilterProperties}
	 * @type {FilterProperties}
	 */
	public properties: this["_properties"] = <any>{};
	//public propertyValues = new Dictionary<FilterProperties, any>();

	/**
	 * An SVG `<group>` element hold primitive (effect) definitions.
	 *
	 * @type {Optional<Group>}
	 */
	public filterElement: $type.Optional<Group>;

	/**
	 * Identifies if this object is a "template" and should not be treated as
	 * real object that is drawn or actually used in the chart.
	 *
	 * @type {boolean}
	 */
	public isTemplate: boolean = false;

	/**
	 * A Paper instance to add element to.
	 *
	 * @type {Paper}
	 */
	protected _paper: $type.Optional<Paper>;

	/**
	 * [_scale description]
	 *
	 * @todo Description
	 * @type {number}
	 */
	protected _scale: number = 1;

	/**
	 * [_nonScaling description]
	 *
	 * @todo Description
	 * @type {boolean}
	 */
	protected _nonScaling: boolean = true;

	/**
	 * A target element this filter is currently attached to.
	 *
	 * We need to keep track of it because one filter can be used for just one
	 * element, so we have to remove it from the old "parent" when attaching to
	 * the new one.
	 */
	protected _sprite: $type.Optional<Sprite>;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Filter";

		// Create a list to hold primitives (effect elements)
		this.filterPrimitives = new List<any>();

		// Automatically add added primitives to `_disposers` so they are discarded
		// when Filter object is destroyed (disposed)
		this.filterPrimitives.events.on("inserted", (ev) => {
			this._disposers.push(ev.newValue);
		});

		// Set default dimensions
		this.width = 120;
		this.height = 120;

		// Apply theme
		this.applyTheme();

	}

	/**
	 * Appends actual filter elements to the filter group.
	 *
	 * @ignore Exclude from docs
	 * @param {Group} filterElement An SVG `<group>` element to add filter element to
	 */
	public appendPrimitives(filterElement: Group): void {
		$iter.each(this.filterPrimitives.iterator(), (filterPrimitive) => {
			filterElement.add(filterPrimitive);
		});
	}

	/**
	 * Uses Transitions filter's values from current to target. This is used to
	 * smoothly appear filter, rather than it pop into effect.
	 *
	 * @ignore Exclude from docs
	 * @param  {IAnimationOptions[] | IAnimationOptions}  animationOptions  Animation options
	 * @param  {number}                                   duration          Duration in milliseconds
	 * @param  {(number) => number}                       easing            Easing function
	 * @return {Animation}                                                  Animation instance
	 */
	public animate(animationOptions: IAnimationOptions[] | IAnimationOptions, duration: number, easing?: (value: number) => number): Animation {
		let animation: Animation = new Animation(this, animationOptions, duration, easing).start();
		return animation;
	}

	/**
	 * Width of the filter element in percent.
	 *
	 * If the filter is designed to "bleed out" of the original target element,
	 * like for example a shadow, you need this bigger than 100, or the
	 * non-fitting parts will be clipped.
	 *
	 * @default 120
	 * @param {number} value Width (px)
	 */
	public set width(value: number) {
		this.properties["width"] = value;
	}

	/**
	 * @return {number} Width (%)
	 */
	public get width(): number {
		return this.properties["width"];
	}

	/**
	 * Height of the filter element in percent.
	 *
	 * If the filter is designed to "bleed out" of the original target element,
	 * like for example a shadow, you need this bigger than 100, or the
	 * non-fitting parts will be clipped.
	 *
	 * @default 120
	 * @param {number} value Height (%)
	 */
	public set height(value: number) {
		this.properties["height"] = value;
	}

	/**
	 * @return {number} Height
	 */
	public get height(): number {
		return this.properties["height"];
	}

	/**
	 * Copies properties from another [[Filter]] object.
	 *
	 * @param {Filter} filter Source [[Filter]] object
	 */
	public copyFrom(filter: this): void {
		super.copyFrom(filter);
		$object.each(filter.properties, (key, value) => {
			(<any>this)[key] = value;
		});
	}

	/**
	 * Sets [[Paper]] instance to create filter's elements in.
	 *
	 * @ignore Exclude from docs
	 * @param {Paper}  paper  Paper
	 */
	public set paper(paper: Paper) {
		if (this._paper != paper) {
			this._paper = paper;
		}
	}

	/**
	 * @return {Paper} Paper
	 */
	public get paper(): Paper {
		if (this._paper) {
			return this._paper;
		}
		return getGhostPaper();
	}

	/**
	 * All animations currently in play.
	 *
	 * @ignore Exclude from docs
	 * @return {Array<Animation>} List of animations
	 */
	public get animations(): Array<Animation> {
		if (!this._animations) {
			this._animations = [];
			this._disposers.push(new AnimationDisposer(this._animations));
		}
		return this._animations;
	}

	/**
	 * [[Sprite]] uses this method to inform filter about it's scale.
	 *
	 * @ignore Exclude from docs
	 */
	public set scale(value: number) {
		this._scale = value;
		this.updateScale();
	}

	/**
	 * @ignore Exclude from docs
	 */
	public get scale(): number {
		return this._scale;
	}

	/**
	 * Updates filter properties which depend on scale.
	 *
	 * @ignore Exclude from docs
	 */
	protected updateScale() {
		// Dummy method for extending classes to override.
	}

	/**
	 * If a filter is non scaling, it will look the same even if the sprite is
	 * scaled, otherwise filter will scale together with a [[Sprite]].
	 *
	 * @default false
	 * @param {boolean}  value  Non scaling?
	 */
	public set nonScaling(value: boolean) {
		this._nonScaling = value;
		if (!value) {
			this._scale = 1;
		}
		this.updateScale();
	}

	/**
	 * @return {boolean} Non scaling?
	 */
	public get nonScaling(): boolean {
		return this._nonScaling;
	}

	/**
	 * A target element this filter is currently attached to.
	 *
	 * We need to keep track of it because one filter can be used for just one
	 * element, so we have to remove it from the old "parent" when attaching to
	 * the new one.
	 *
	 * @ignore Exclude from docs
	 * @param {Sprite}  value  Target element
	 */
	public set sprite(value: Sprite) {
		this.setSprite(value);
	}

	/**
	 * Sets filter's target element.
	 *
	 * @ignore Exclude from docs
	 * @param {Sprite}  value  Element filter is being attached to
	 */
	protected setSprite(value: Sprite): void {
		if (this._sprite && this._sprite != value) {
			this._sprite.filters.removeValue(this);
		}
		this._sprite = value;
	}
}
