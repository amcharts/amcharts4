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
import { Paper } from "../Paper";
import { Group } from "../Group";
import { AMElement } from "../AMElement";
import { Animation, IAnimatable, IAnimationOptions } from "../../utils/Animation";
import { List } from "../../utils/List";
import { Sprite } from "../../Sprite";
import * as $type from "../../utils/Type";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for a base filter
 */
export interface FilterProperties {
    /**
     * Width of the filter in percent.
     *
     * @default 120
     */
    width: number;
    /**
     * Height of the filter in percent.
     *
     * @default 120
     */
    height: number;
}
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
export declare class Filter extends BaseObject implements IAnimatable {
    /**
     * List of animations currently running for the filter.
     */
    protected _animations: $type.Optional<Array<Animation>>;
    /**
     * Contains a list of filter primitives (effects) applied by the filter.
     *
     * @ignore Exclude from docs
     */
    filterPrimitives: List<AMElement>;
    /**
     * Defines property types.
     */
    _properties: FilterProperties;
    /**
     * A storage for Filter property/value pairs.
     *
     * @ignore Exclude from docs
     * @see {@link FilterProperties}
     */
    properties: this["_properties"];
    /**
     * An SVG `<group>` element hold primitive (effect) definitions.
     */
    filterElement: $type.Optional<Group>;
    /**
     * Identifies if this object is a "template" and should not be treated as
     * real object that is drawn or actually used in the chart.
     */
    isTemplate: boolean;
    /**
     * A Paper instance to add element to.
     */
    protected _paper: $type.Optional<Paper>;
    /**
     * [_scale description]
     *
     * @todo Description
     */
    protected _scale: number;
    /**
     * [_nonScaling description]
     *
     * @todo Description
     */
    protected _nonScaling: boolean;
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
    constructor();
    /**
     * Appends actual filter elements to the filter group.
     *
     * @ignore Exclude from docs
     * @param filterElement An SVG `<group>` element to add filter element to
     */
    appendPrimitives(filterElement: Group): void;
    /**
     * Uses Transitions filter's values from current to target. This is used to
     * smoothly appear filter, rather than it pop into effect.
     *
     * @ignore Exclude from docs
     * @param animationOptions  Animation options
     * @param duration          Duration in milliseconds
     * @param easing            Easing function
     * @return Animation instance
     */
    animate(animationOptions: IAnimationOptions[] | IAnimationOptions, duration: number, easing?: (value: number) => number): Animation;
    /**
     * @return Width (%)
     */
    /**
     * Width of the filter element in percent.
     *
     * If the filter is designed to "bleed out" of the original target element,
     * like for example a shadow, you need this bigger than 100, or the
     * non-fitting parts will be clipped.
     *
     * @default 120
     * @param value Width (px)
     */
    width: number;
    /**
     * @return Height
     */
    /**
     * Height of the filter element in percent.
     *
     * If the filter is designed to "bleed out" of the original target element,
     * like for example a shadow, you need this bigger than 100, or the
     * non-fitting parts will be clipped.
     *
     * @default 120
     * @param value Height (%)
     */
    height: number;
    /**
     * Copies properties from another [[Filter]] object.
     *
     * @param filter Source [[Filter]] object
     */
    copyFrom(filter: this): void;
    /**
     * @return Paper
     */
    /**
     * Sets [[Paper]] instance to create filter's elements in.
     *
     * @ignore Exclude from docs
     * @param paper  Paper
     */
    paper: Paper;
    /**
     * All animations currently in play.
     *
     * @ignore Exclude from docs
     * @return List of animations
     */
    readonly animations: Array<Animation>;
    /**
     * @ignore Exclude from docs
     */
    /**
     * [[Sprite]] uses this method to inform filter about it's scale.
     *
     * @ignore Exclude from docs
     */
    scale: number;
    /**
     * Updates filter properties which depend on scale.
     *
     * @ignore Exclude from docs
     */
    protected updateScale(): void;
    /**
     * @return Non scaling?
     */
    /**
     * If a filter is non scaling, it will look the same even if the sprite is
     * scaled, otherwise filter will scale together with a [[Sprite]].
     *
     * @default false
     * @param value  Non scaling?
     */
    nonScaling: boolean;
    /**
     * A target element this filter is currently attached to.
     *
     * We need to keep track of it because one filter can be used for just one
     * element, so we have to remove it from the old "parent" when attaching to
     * the new one.
     *
     * @ignore Exclude from docs
     * @param value  Target element
     */
    sprite: Sprite;
    /**
     * Sets filter's target element.
     *
     * @ignore Exclude from docs
     * @param value  Element filter is being attached to
     */
    protected setSprite(value: Sprite): void;
}
