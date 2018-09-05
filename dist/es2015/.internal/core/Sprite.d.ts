/**
 * This is the main class that encapsulates every object on the chart.
 *
 * If it's an element that is to be displayed on the screen at some point, its
 * class must extend [[Sprite]] class.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SpriteState } from "./SpriteState";
import { ISpriteEvents, SpriteEventDispatcher, AMEvent } from "./SpriteEvents";
export { ISpriteEvents, SpriteEventDispatcher, AMEvent };
import { BaseObjectEvents } from "./Base";
import { Adapter } from "./utils/Adapter";
import { ITheme } from "../themes/ITheme";
import { Dictionary, IDictionaryEvents, DictionaryTemplate } from "./utils/Dictionary";
import { ListTemplate } from "./utils/List";
import { EventDispatcher } from "./utils/EventDispatcher";
import { IDisposer, MutableValueDisposer } from "./utils/Disposer";
import { Animation, IAnimatable } from "./utils/Animation";
import { Optional } from "./utils/Type";
import { Group } from "./rendering/Group";
import { Paper } from "./rendering/Paper";
import { DataItem } from "./DataItem";
import { Container } from "./Container";
import { Pattern } from "./rendering/fills/Pattern";
import { LinearGradient } from "./rendering/fills/LinearGradient";
import { RadialGradient } from "./rendering/fills/RadialGradient";
import { SVGContainer } from "./rendering/SVGContainer";
import { Align } from "./defs/Align";
import { Roles, AriaLive } from "./defs/Accessibility";
import { Popup } from "./elements/Popup";
import { Modal } from "./elements/Modal";
import { Color } from "./utils/Color";
import { Ordering } from "./utils/Order";
import { HorizontalCenter } from "./defs/HorizontalCenter";
import { VerticalCenter } from "./defs/VerticalCenter";
import { VerticalAlign } from "./defs/VerticalAlign";
import { ShapeRendering } from "./defs/ShapeRendering";
import { AMElement } from "./rendering/AMElement";
import { Filter } from "./rendering/filters/Filter";
import { ColorModifier } from "./rendering/fills/ColorModifier";
import { InteractionObject } from "./interaction/InteractionObject";
import { IInertiaOptions, ISwipeOptions, IHitOptions, IHoverOptions, ICursorOptions, IKeyboardOptions } from "./interaction/InteractionOptions";
import { IPointer } from "./interaction/Pointer";
import { InertiaTypes } from "./interaction/Inertia";
import { IStyleProperty } from "./defs/IStyleProperty";
import { IPoint } from "./defs/IPoint";
import { IRectangle } from "./defs/IRectangle";
import { Tooltip } from "./elements/Tooltip";
import { NumberFormatter } from "./formatters/NumberFormatter";
import { DateFormatter } from "./formatters/DateFormatter";
import { DurationFormatter } from "./formatters/DurationFormatter";
import { Language } from "./utils/Language";
import { Export } from "./export/Export";
import { ISVGAttribute } from "./rendering/AMElement";
import * as $type from "./utils/Type";
import { Percent } from "./utils/Percent";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[Sprite]]
 */
export interface ISpriteProperties {
    disabled?: boolean;
    x?: number | Percent;
    y?: number | Percent;
    width?: number | string;
    height?: number | string;
    scale?: number;
    rotation?: number;
    pixelPerfect?: boolean;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    fillOpacity?: number;
    fill?: Color | LinearGradient | RadialGradient | Pattern;
    opacity?: number;
    stroke?: Color | LinearGradient | RadialGradient | Pattern;
    strokeOpacity?: number;
    strokeWidth?: number;
    strokeDasharray?: number[];
    shapeRendering?: ShapeRendering;
    draggable?: boolean;
    inert?: boolean;
    resizable?: boolean;
    rotatable?: boolean;
    swipeable?: boolean;
    trackable?: boolean;
    hoverable?: boolean;
    clickable?: boolean;
    togglable?: boolean;
    rightClickable?: boolean;
    longClickable?: boolean;
    wheelable?: boolean;
    focusable?: boolean;
    tabindex?: number;
    visible?: boolean;
    tooltipText?: string;
    tooltipHTML?: string;
    tooltipX?: number;
    tooltipY?: number;
    tooltipPosition?: "fixed" | "pointer";
    interactionsEnabled?: boolean;
    horizontalCenter?: HorizontalCenter;
    verticalCenter?: VerticalCenter;
    align?: Align;
    valign?: VerticalAlign;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    minX?: number;
    minY?: number;
    maxX?: number;
    maxY?: number;
    dx?: number;
    dy?: number;
    role?: string;
    readerDescribedBy?: string;
    readerLabelledBy?: string;
    readerLive?: AriaLive;
    readerControls?: string;
    readerChecked?: boolean;
    readerHidden?: boolean;
    readerDescription?: string;
    readerTitle?: string;
    nonScaling?: boolean;
    nonScalingStroke?: boolean;
    zIndex?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    fillModifier?: ColorModifier;
    strokeModifier?: ColorModifier;
    hoverOnFocus?: boolean;
}
/**
 * Defines animation options
 */
export interface ISpriteAnimationOptions {
    from?: Percent | Color | number | string;
    to: Percent | Color | number | string;
    property: any;
}
/**
 * Defines list ofvisual properties
 */
export declare const visualProperties: (keyof ISpriteProperties)[];
/**
 * Represents a list of available adapters for [[Sprite]]
 */
export interface ISpriteAdapters extends ISpriteProperties {
    pixelHeight: number;
    pixelWidth: number;
    relativeHeight: number;
    relativeWidth: number;
    measuredHeight: number;
    measuredWidth: number;
    outerHeight: number;
    outerWidth: number;
    innerHeight: number;
    innerWidth: number;
    globalScale: number;
    pixelMarginRight: number;
    relativeMarginRight: number;
    pixelMarginLeft: number;
    relativeMarginLeft: number;
    pixelMarginTop: number;
    relativeMarginTop: number;
    pixelMarginBottom: number;
    relativeMarginBottom: number;
    pixelX: number;
    relativeX: number;
    pixelY: number;
    relativeY: number;
    mask: Sprite;
    url: string;
    urlTarget: string;
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Sprite represents any displayable element.
 *
 * This is the main class that encapsulates every object on the chart.
 *
 * If it's an element that is to be displayed on the screen at some point, its
 * class must extend [[Sprite]] class.
 *
 * [[Sprite]] class represents the a hierarchical structure. Every object that
 * extends [[Sprite]] can have children, that would inherit their properties,
 * such as language, formatters, etc.
 *
 * @see {@link SpriteState}
 * @see {@link ISpriteEvents} for a list of available events
 * @see {@link ISpriteAdapters} for a list of available Adapters
 *
 * @todo Review child elements that need to go into `_disposers`
 * @important
 */
export declare class Sprite extends BaseObjectEvents implements IAnimatable {
    /**
     * Defines property types.
     *
     * @ignore Exclude from docs
     * @type {ISpriteProperties}
     */
    _properties: ISpriteProperties;
    /**
     * Defines state type.
     *
     * @ignore Exclude from docs
     * @type {SpriteState}
     */
    /**
     * Defines type used in the Sprite.
     *
     * @ignore Exclude from docs
     * @type {ISpriteAdapters}
     */
    _adapter: ISpriteAdapters;
    /**
     * Holds values for Sprite's properties.
     */
    properties: this["_properties"];
    /**
     * Defines available events.
     *
     * @type {ISpriteEvents}
     * @ignore Exclude from docs
     */
    _events: ISpriteEvents;
    /**
     * Event dispacther.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/event-listeners/} for more info about Events
     * @type {SpriteEventDispatcher<AMEvent<Sprite, ISpriteEvents>>} Event dispatcher instance
     */
    events: SpriteEventDispatcher<AMEvent<this, this["_events"]>>;
    /**
     * Holds Adapter.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/adapters/} for more info about Adapters
     * @type {Adapter<Sprite, ISpriteAdapters>}
     */
    adapter: Adapter<this, this["_adapter"]>;
    /**
     * @ignore Exclude from docs
     * @todo Description
     */
    private _bindings;
    /**
     * Holds indicator if this Sprite is a "template" to be used for creating
     * other Sprites from and should not be treated as full-fledged element.
     *
     * @ignore Exclude from docs
     * @type {Optional<boolean>}
     */
    protected _isTemplate: $type.Optional<boolean>;
    /**
     * Holds collection of Sprite States.
     *
     * @ignore Exclude from docs
     * @type {Optional<DictionaryTemplate<string, SpriteState<this["_properties"], this["_adapter"]>>>}
     */
    _states: $type.Optional<DictionaryTemplate<string, SpriteState<this["_properties"], this["_adapter"]>>>;
    /**
     * Holds indicator whether this sprite was already initialized.
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    protected _inited: boolean;
    /**
     * A reference to a Tooltip for this Sprite.
     *
     * @ignore Exclude from docs
     * @type {Optional<Tooltip>}
     */
    protected _tooltip: $type.Optional<Tooltip>;
    /**
     * A special data item which tooltip will use when formatting data. In case
     * it is not set, dataItem will be used.
     *
     * @ignore Exclude from docs
     * @type {Optional<DataItem>}
     */
    protected _tooltipDataItem: $type.Optional<DataItem>;
    /**
     * A reference to another sprite or sprite template from which tooltip should take colors if getFillFromObject or getStrokeFromObject are set to true.
     * Mostly used when we need to adjust tooltip color for a series, depending on column or bullet color.
     *
     * @ignore Exclude from docs
     * @type {Optional<Sprite>}
     */
    protected _tooltipColorSource: $type.Optional<Sprite>;
    /**
     * If `sprite.hide()` is called and we have "hidden" state and
     * `transitionDuration > 0`, we set `isHiding` flag to `true` in order to
     * avoid restarting animations in case `hide()` method is called multiple
     * times.
     *
     * @type {boolean}
     */
    isHiding: boolean;
    /**
     * If `sprite.hide()` is called, we set isHidden to true when sprite is hidden.
     * This was added becaus hidden state might have visibility set to true and so
     * there would not be possible to find out if a sprite is technically hidden or not.
     *
     * @type {boolean}
     */
    protected _isHidden: boolean;
    /**
     * This property indicates if Sprite is currently being revealed from hidden
     * state. This is used to prevent multiple calls to `sprite.show()` to
     * restart reveal animation. (if enabled)
     *
     * @type {boolean}
     */
    isShowing: boolean;
    /**
     * Indicates if this element is a standalone instance. A "standalone
     * instance" means this is a autonomous object which maintains its own
     * set of controls like Preloader, Export, etc.
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    isStandaloneInstance: boolean;
    /**
     * Indicates if togglable Sprite is currently active (toggled on).
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    protected _isActive: boolean;
    /**
     * A Sprite element to use as a mask for this Sprite.
     *
     * @ignore Exclude from docs
     * @type {MutableValueDisposer}
     */
    protected _mask: MutableValueDisposer<Sprite>;
    /**
     * @ignore Exclude from docs
     * @todo Description
     * @type {Optional<Group>}
     */
    protected _clipPath: Optional<Group>;
    /**
     * @ignore Exclude from docs
     * @todo Description
     * @type {Optional<AMElement>}
     */
    protected _clipElement: $type.Optional<AMElement>;
    /**
     * @ignore Exclude from docs
     * @todo Description
     * @type {number}
     */
    protected _positionPrecision: number;
    /**
     * Holds reference to Sprite's [[InteractionObject]]. Sprite does not
     * perform any user interactions directly, it happens via [[InteractionObject]].
     *
     * @ignore Exclude from docs
     * @type {Optional<InteractionObject>}
     */
    protected _interaction: $type.Optional<InteractionObject>;
    /**
     * An instance of [[Language]].
     *
     * @ignore Exclude from docs
     * @type {Language}
     */
    protected _language: MutableValueDisposer<Language>;
    /**
     * An instance of [[NumberFormatter]].
     *
     * @ignore Exclude from docs
     * @type {Optional<NumberFormatter>}
     */
    protected _numberFormatter: $type.Optional<NumberFormatter>;
    /**
     * An instance of [[DateFormatter]].
     *
     * @ignore Exclude from docs
     * @type {Optional<DateFormatter>}
     */
    protected _dateFormatter: $type.Optional<DateFormatter>;
    /**
     * An instance of [[DurationFormatter]].
     *
     * @ignore Exclude from docs
     * @type {Optional<DurationFormatter>}
     */
    protected _durationFormatter: $type.Optional<DurationFormatter>;
    /**
     * An HTML element to which [[svgContainer]] is added.
     *
     * @ignore Exclude from docs
     * @type {Optional<HTMLElement>}
     */
    protected _htmlContainer: $type.Optional<HTMLElement>;
    /**
     * An HTML element to which all chart elements are added.
     *
     * @ignore Exclude from docs
     * @type {Optional<SVGContainer>}
     */
    protected _svgContainer: $type.Optional<SVGContainer>;
    /**
     * A [[Container]] instance to place this element's [[Tooltip]] elements in
     *
     * @ignore Exclude from docs
     * @type {Optional<Container>}
     */
    protected _tooltipContainer: $type.Optional<Container>;
    /**
     * An URL to go to when user clicks on a this Sprite.
     *
     * @ignore Exclude from docs
     * @type {Optional<string>}
     */
    protected _url: $type.Optional<string>;
    protected _urlDisposer: $type.Optional<IDisposer>;
    /**
     * URL target to use.
     *
     * @ignore Exclude from docs
     * @type {string}
     */
    protected _urlTarget: string;
    /**
     * Should this element be measured when measuring its parent container's
     * dimentions?
     *
     * @ignore Exclude from docs
     * @type {Optional<boolean>}
     */
    protected _isMeasured: $type.Optional<boolean>;
    /**
     * Indicates if the chart should follow righ-to-left rules.
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    protected _rtl: boolean;
    /**
     * Holds [[Export]] object.
     *
     * @ignore Exclude from docs
     * @type {Export}
     */
    protected _exporting: MutableValueDisposer<Export>;
    /**
     * Holds [[Modal]] object.
     *
     * @ignore Exclude from docs
     * @type {Optional<Modal>}
     */
    protected _modal: $type.Optional<Modal>;
    /**
     * Holds [[Popup]] objects.
     *
     * @ignore Exclude from docs
     * @type {Optional<ListTemplate<Popup>>}
     */
    protected _popups: $type.Optional<ListTemplate<Popup>>;
    /**
     * A reference to a top-level SVG node for this Sprite element.
     *
     * @ignore Exclude from docs
     * @type {Optional<AMElement>}
     */
    protected _element: Optional<AMElement>;
    /**
     * Holds Sprite's main SVG group (`<g>`) element. Other Sprite's elements
     * are all placed in this group.
     * @type {Group}
     */
    group: Group;
    /**
     * A reference to [[Paper]] SVG renderer used to create SVG nodes.
     *
     * @ignore Exclude from docs
     * @type {Optional<Paper>}
     */
    protected _paper: $type.Optional<Paper>;
    /**
     * Data item assigned to the sprite. It might contain information defining
     * some style properties.
     *
     * @ignore Exclude from docs
     * @type {Optional<DataItem>}
     */
    _dataItem: $type.Optional<DataItem>;
    /**
     * Parent container.
     *
     * @ignore Exclude from docs
     * @type {Container}
     */
    protected _parent: Container;
    /**
     * Sprite's "virtual" parent.
     *
     * @ignore Exclude from docs
     * @type {Sprite}
     */
    protected _virtualParent: Sprite;
    /**
     * Defines bounding box (square) for this element.
     *
     * @ignore Exclude from docs
     * @type {IRectangle}
     */
    bbox: IRectangle;
    /**
     * Base tab index for the Sprite. Used for TAB-key selection order.
     *
     * Use accessors `tabIndex` to set and retrieve.
     *
     * @ignore Exclude from docs
     * @type {Optional<number>}
     */
    protected _tabindex: $type.Optional<number>;
    /**
     * Should system tooltips be allowed to be displayed if the element has
     * `readerTitle` set?
     *
     * Use accessors `showSystemTooltip` to set and retrieve.
     *
     * This is an accessibility feature.
     *
     * @ignore Exclude from docs
     * @type {Optional<boolean>}
     */
    protected _showSystemTooltip: $type.Optional<boolean>;
    /**
     * List of animations currently playing for this Sprite.
     *
     * @ignore Exclude from docs
     * @type {Optional<Array<Animation>>}
     */
    protected _animations: $type.Optional<Array<Animation>>;
    /**
     * A link to [[Disposer]] for event handler which is attached to hide
     * animation. In some cases we need to cancel this event. This property is
     * used to hold the reference to disposer of this event so that we can
     * cancel it by calling its `dispose()` method.
     *
     * @ignore Exclude from docs
     * @type {Optional<IDisposer>}
     */
    protected _showHideDisposer: $type.Optional<IDisposer>;
    /**
     * If element is currently hiding, this property will hold a reference to
     * [[Animation]] instance, which is handling hiding animation.
     *
     * @ignore Exclude from docs
     * @type {Optional<Animation>}
     */
    protected _hideAnimation: $type.Optional<Animation>;
    /**
     * List of [[Filter]] items that are currently applied to the element.
     *
     * @ignore Exclude from docs
     * @type {Optional<ListTemplate<Filter>>}
     */
    protected _filters: $type.Optional<ListTemplate<Filter>>;
    /**
     * A shortcut to the special "Focus" filter which is applied when the element
     * gains focus.
     *
     * This is an accessibility feature.
     *
     * @ignore Exclude from docs
     * @type {Optional<Filter>}
     */
    protected _focusFilter: $type.Optional<Filter>;
    /**
     * Indicates if this element is invalid and should be re-validated (redrawn).
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    invalid: boolean;
    /**
     * Indicates if this elements position is invalid and should be repositioned
     *
     * @ignore Exclude from docs
     * @type {boolean}
     */
    positionInvalid: boolean;
    /**
     * A collection of key/value pairs that can be used to bind specific Sprite
     * properties to [[DataItem]].
     *
     * For example: `fill` property can be bound to `myCustomColor` field in
     * DataItem. The Sprite will automatically get the value for `fill` from its
     * DataItem.
     *
     * Can be set for each [[SpriteState]] individually to override default
     * bindings.
     *
     * @see {@link SpriteState}
     * @type {Object}
     */
    propertyFields: {
        [index in keyof this["_properties"]]?: string;
    };
    /**
     * Element's relative width.
     *
     * Do not set this property directly. Use `width` accessor with [[Percent]]
     * value instead.
     *
     * @ignore Exclude from docs
     * @type {$type.Optional<number>}
     */
    percentWidth: $type.Optional<number>;
    /**
     * Element's relative height.
     *
     * Do not set this property directly. Use `height` accessor with [[Percent]]
     * value instead.
     *
     * @ignore Exclude from docs
     * @type {$type.Optional<number>}
     */
    percentHeight: $type.Optional<number>;
    /**
     * An SVG group element that is used to put all SVG filters to.
     *
     * @ignore Exclude from docs
     * @type {Optional<Group>}
     */
    filterElement: $type.Optional<Group>;
    /**
     * A field in data context of element's `dataItem` that holds config values
     * for this element.
     *
     * This is a very powerful feature, allowing changing virtually any setting,
     * including those for element's children, for the element via data.
     *
     * Example data:
     *
     * ```JSON
     * {
     *   "value": 100,
     *   "config": {
     *     "fill": "#F00"
     *   }
     * }
     * ```
     *
     * If you set element's `configField = "config"`, the element for this
     * specific data point will have a red fill.
     *
     * @type {Optional<string>}
     */
    configField: $type.Optional<string>;
    /**
     * Reference to element's `<title>` element.
     *
     * @ignore Exclude from docs
     * @type {Optional<SVGTitleElement>}
     */
    protected _titleElement: Optional<AMElement>;
    /**
     * Reference to element's `<description>` element.
     *
     * @ignore Exclude from docs
     * @type {Optional<SVGDescElement>}
     */
    protected _descriptionElement: Optional<AMElement>;
    /**
     * Specifies if a property changes on this object should be propaged to the
     * objects cloned from this object.
     *
     * This setting affects property changes *after* cloning, since at the moment
     * of cloning all of properties from source object are copied to the clone
     * anyway.
     *
     * @default false
     */
    applyOnClones: boolean;
    /**
     * a reference to an object which should be used when populating string. used for tooltip label mostly.
     * @ignore
     */
    populateStringFrom: any;
    /**
     * Internal storage properties.
     *
     * @ignore Exclude from docs
     */
    protected _measuredWidth: number;
    protected _measuredHeight: number;
    protected _measuredWidthSelf: number;
    protected _measuredHeightSelf: number;
    protected _prevMeasuredWidth: number;
    protected _prevMeasuredHeight: number;
    protected _pixelWidth: $type.Optional<number>;
    protected _pixelHeight: $type.Optional<number>;
    protected _relativeWidth: $type.Optional<number>;
    protected _relativeHeight: $type.Optional<number>;
    /**
     * @ignore
     */
    maxLeft: number;
    /**
     * @ignore
     */
    maxRight: number;
    /**
     * @ignore
     */
    maxTop: number;
    /**
     * @ignore
     */
    maxBottom: number;
    protected _isDragged: boolean;
    /**
     * @deprecated Moved to [[SpriteProperties]]
     * @type {boolean}
     */
    protected _disabled: boolean;
    protected _internalDisabled: boolean;
    protected _updateDisabled: boolean;
    protected _maskRectangle: $type.Optional<IRectangle>;
    protected _internalDefaultsApplied: boolean;
    protected _interactionDisposer: $type.Optional<IDisposer>;
    /**
     * You can set bbox from outside if you know what size your element must be (used in radar chart for example)
     * @ignore
     */
    definedBBox: IRectangle;
    /**
     * Sets frequency at which this element should be rendered. Used to save CPU,
     * mostly for text elements.
     *
     * Higher number means this element will render more sluggishly by skipping
     * frames, but in doing so will use less resources.
     *
     * E.g. setting to 2 will make this element's renderer skip one frame, so any
     * changes to the element will be rendered 1/60 second later than it would
     * at default setting of 1.
     *
     * @type {number}
     */
    renderingFrequency: number;
    /**
     * Used to track frame number when `renderingFrequency` is > 2.
     * When `renderingFrame == 1`, Sprite renders.
     *
     * @ignore Exclude from docs
     */
    renderingFrame: number;
    /**
     * Time in milliseconds after which rollout event happens when user rolls-out of the sprite. This helps to avoid flickering in some cases.
     * @type {number}
     */
    rollOutDelay: number;
    /**
     * @ignore
     */
    protected _outTimeout: $type.Optional<IDisposer>;
    /**
     * @ignore
     * this flag is set to true for the initial sprite you create and place to the div so that we could clear all additional sprites/containers when this sprite is disposed
     */
    isBaseSprite: boolean;
    /**
     * Whether this sprite should be cloned when cloning it's parent container. We set this to falsse in those cases when a sprite is created by the class, so that when cloning
     * a duplicate sprite would not appear.
     *
     * @type {boolean}
     */
    shouldClone: boolean;
    /**
     * A property which you can use to store any data you want.
     * @type {any}
     */
    dummyData: any;
    /**
     * Constructor:
     * * Creates initial node
     * * Sets default properties
     * * Creates required default states
     * * Inits accessibility
     */
    constructor();
    /**
     * ==========================================================================
     * ELEMENT VALIDATION, INIT, AND DRAWING STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Applies properties from all assigned themes.
     *
     * We do this here so that we can apply class names as well.
     *
     * @ignore Exclude from docs
     */
    applyTheme(): void;
    /**
     * Returns theme(s) used by this object either set explicitly on this
     * element, inherited from parent, or inherited from [[System]].
     *
     * @return {ITheme} An array of theme references
     */
    getCurrentThemes(): ITheme[];
    /**
     * Called just before element's validation, this function allows setting
     * defaults.
     *
     * @ignore Exclude from docs
     */
    protected applyInternalDefaults(): void;
    /**
     * Invalidates element.
     *
     * Object will be redrawn during the next update cycle.
     *
     * @ignore Exclude from docs
     */
    invalidate(): void;
    /**
     * Validates element:
     * * Triggers events
     * * Redraws the element
     *
     * @ignore Exclude from docs
     */
    validate(): void;
    /**
     * Invalidates element's position.
     *
     * @ignore Exclude from docs
     */
    invalidatePosition(): void;
    /**
     * Transforms the element.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    validatePosition(): void;
    /**
     * A placeholder method that is called **before** element begins to be drawn.
     *
     * @ignore Exclude from docs
     */
    protected beforeDraw(): void;
    /**
     * A placeholder method that draws the element.
     *
     * @ignore Exclude from docs
     */
    protected draw(): void;
    /**
     * A placeholder method that is called **after** element finishes drawing
     * itself.
     *
     * @ignore Exclude from docs
     */
    protected afterDraw(): void;
    /**
     * Triggers a re-initialization of this element.
     *
     * Will result in complete redrawing of the element.
     *
     * @ignore Exclude from docs
     */
    reinit(): void;
    /**
     * Handles the situation where parent element is resized.
     *
     * @ignore Exclude from docs
     */
    handleGlobalScale(): void;
    /**
     * Updates filter properties which might depend on scale
     *
     * @ignore Exclude from docs
     */
    protected updateFilterScale(): void;
    /**
     * Removes itself from system's invalid lists.
     *
     * @ignore Exclude from docs
     */
    protected removeFromInvalids(): void;
    /**
     * Copies all parameters from another [[Sprite]].
     *
     * @param {Sprite} source Source Sprite
     */
    copyFrom(source: this): void;
    dispose(): void;
    /**
     * @ignore Exclude from docs
     * @return {boolean} Is template?
     */
    /**
     * Indicates if this element is a "template".
     *
     * Template Sprites act only as a holders for config for other "real"
     * elements to be cloned from.
     *
     * Templates are treated differently, as they are not validated, redrawn, or
     * otherwise are processed.
     *
     * @ignore Exclude from docs
     * @param {boolean} value Is template?
     */
    isTemplate: boolean;
    /**
     * @return {boolean} Show system tooltip?
     */
    /**
     * Indicates whether the element should attempt to construct itself in a way
     * so that system tooltip is shown if its `readerTitle` is set.
     *
     * @param {boolean} value Show system tooltip?
     */
    showSystemTooltip: boolean;
    /**
     * ==========================================================================
     * HIERARCHY AND STRUCTURE RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Elements's top-level [[Container]].
     *
     * In most cases that will be a Chart.
     *
     * @return {Optional<Container>} Top-level ascendant
     */
    readonly topParent: Optional<Container>;
    /**
     * @return {Optional<Container>} Parent container
     */
    /**
     * Elements' parent [[Container]].
     *
     * @param {Optional<Container>}  parent  Parent container
     */
    parent: Optional<Container>;
    /**
     * @return {Optional<Container>} Virtual parent
     */
    /**
     * Element's "virtual" parent.
     *
     * This is required in ordere to maintain proper inheritance (like
     * formatters).
     *
     * Sometimes an element is a "logical" parent, even though it's not a direct
     * ascendant.
     *
     * Example: a bullet is not a child of the axis, but it would make sense
     * for it to inherit series' formatters.
     *
     * @ignore Exclude from docs
     * @param {Sprite}  value  Virtual parent
     */
    virtualParent: Sprite;
    /**
     * Moves `<defs>` to correct place in DOM.
     *
     * Some elements are initially created in "ghost" container. When moving
     * those into proper place in DOM, their respective `<defs>` need to be moved
     * as well.
     *
     * @ignore Exclude from docs
     */
    appendDefs(): void;
    /**
     * Returns a [[Dictionary]] which maps object ids with their respective
     * objects.
     *
     * Can be used to retrieve any object by id, e.g.:
     *
     * ```TypeScript
     * console.log(mySprite.map.getKey("myid"));
     * ```
     * ```JavaScript
     * console.log(mySprite.map.getKey("myid"));
     * ```
     *
     * @ignore Exclude from docs
     * @return {Dictionary<string, any>} Map collection
     */
    readonly map: Dictionary<string, any>;
    /**
     * @return {string} ID
     */
    /**
     * Element's user-defined ID.
     *
     * Will throw an Error if there already is an object with the same ID.
     *
     * Please note that above check will be performed withing the scope of the
     * current chart instance. It will not do checks across other chart instances
     * or in globally in DOM.
     *
     * Make sure the IDs are unique.
     *
     * @param {string} value ID
     */
    id: string;
    /**
     * ==========================================================================
     * ELEMENT AND DOM TREE MANIPULATION AND MEASURING
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns DOM element reference associated with this element.
     *
     * @readonly
     * @return {SVGSVGElement} DOM element
     */
    readonly dom: SVGSVGElement;
    /**
     * @ignore Exclude from docs
     * @return {Paper} Paper
     */
    /**
     * A [[Paper]] instance to place elements on.
     *
     * If there's no Paper set for this element, it goes up the ascendant tree
     * until it finds one.
     *
     * This method is used by important `addChild()` method, so it's essential
     * to have a [[Paper]] instance.
     *
     * If this element has a separate `htmlContainer` set, it will have a
     * [[Paper]] instance itself.
     *
     * @ignore Exclude from docs
     * @param {Paper}  paper  Paper
     */
    paper: Paper;
    setPaper(paper: Paper): void;
    /**
     * @return {Optional<HTMLElement>} HTML element
     */
    /**
     * An HTML element to be used when placing wrapper element (`<div>`)
     * for the whole chart.
     *
     * This is the same for **all** elements within the same chart.
     *
     * @param {Optional<HTMLElement>} htmlContainer HTML element
     */
    htmlContainer: $type.Optional<HTMLElement>;
    /**
     * Creates (if not yet created) and returns element's `<title>` element.
     *
     * @ignore Exclude from docs
     * @return {AMElement} Title element
     */
    readonly titleElement: AMElement;
    /**
     * Creates (if not yet created) and returns element's `<desc>` element.
     *
     * @ignore Exclude from docs
     * @return {AMElement} Desc element
     */
    readonly descriptionElement: AMElement;
    /**
     * Returns list of SVG filters (effects) applied to element. If the filter
     * list is not yet initilized, creates and returns an empty one.
     * Note, not all filters combine well with one another. We recommend using one filter per sprite.
     *
     * @return {ListTemplate<Filter>} List of filters
     */
    readonly filters: ListTemplate<Filter>;
    /**
     * Sets required SVG attributes. Must be called every time an element is
     * redrawn so that attributes are (re)applied.
     *
     * @ignore Exclude from docs
     */
    protected setSVGAttributes(): void;
    /**
     * Sets an attribute directly on an SVG element.
     *
     * @ignore Exclude from docs
     * @param {ISVGAttribute} attribute Attribute object
     */
    protected setSVGAttribute(attribute: ISVGAttribute): void;
    /**
     * Removes an attribute directly from SVG element.
     *
     * @param {string} attribute Attribute key to remove
     */
    protected removeSVGAttribute(attribute: string): void;
    /**
     * Sets `class` attribute of the elements SVG node.
     *
     * Uses `am4core.options.classNamePrefix`.
     *
     * @ignore Exclude from docs
     */
    setClassName(): void;
    /**
     * Adds an `id` attribute the the element and returns the id.
     *
     * @ignore Exclude from docs
     * @return {string} Element's ID
     */
    uidAttr(): string;
    /**
     * [updateClipPath description]
     *
     * @todo Description
     */
    protected updateClipPath(): void;
    /**
     * Applies the mask Sprite.
     *
     * @ignore Exclude from docs
     */
    protected applyMask(): void;
    /**
     * Applies filters to the element.
     *
     * @ignore Exclude from docs
     */
    protected applyFilters(): void;
    /**
     * [removeClipPath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    protected removeClipPath(): void;
    /**
     * @return {AMElement} Element
     */
    /**
     * The main element for this Sprite, usually an SVG `<g>`.
     *
     * All other sub-elements are created in it.
     *
     * @param {Optional<AMElement>}  element  Element
     */
    element: Optional<AMElement>;
    /**
     * HTML container (`<div>`) which is used to place chart's `<svg>` element
     * in.
     *
     * @return {Optional<SVGContainer>} Container for chart elements
     */
    /**
     * Sets HTML container to add SVG and other chart elements to.
     *
     * @param {Optional<SVGContainer>} svgContainer Container for chart elements
     */
    svgContainer: $type.Optional<SVGContainer>;
    /**
     * Measures main element.
     *
     * Saves measurements into private `_bbox` property.
     *
     * @ignore Exclude from docs
     */
    protected measureElement(): void;
    /**
     * Positions element according its center settings.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    updateCenter(): void;
    /**
     * Measures the whole element.
     *
     * Returns `true` if the size has changed from the last measurement.
     *
     * @ignore Exclude from docs
     * @return {boolean} Did the size chance from the last measurement?
     */
    measure(): boolean;
    /**
     * Insert this element before sibling element.
     *
     * @param  {Sprite}  sprite  Target element
     * @return {Sprite}          This element
     */
    insertBefore(sprite: Sprite): Sprite;
    /**
     * Insert this element after sibling element.
     *
     * @param  {Sprite}  sprite  Target element
     * @return {Sprite}          This element
     */
    insertAfter(sprite: Sprite): Sprite;
    /**
     * Removes the main SVG element.
     *
     * This does not destroy the whole Sprite element. To do that use
     * `dispose()` instead.
     *
     * @ignore Exclude from docs
     */
    protected removeElement(): void;
    /**
     * Returns relative (percent) value of the X coordindate within this element.
     *
     * A relative value is a hundredth of a percent. So 100% would result in a 1
     * as relative value.
     *
     * @param  {number | Percent}  value  Absolute or relative X coordinate
     * @return {number}                   Relative value
     */
    getRelativeX(value: number | Percent): number;
    /**
     * Returns relative (percent) value of the Y coordindate within this element.
     *
     * A relative value is a hundredth of a percent. So 100% would result in a 1
     * as relative value.
     *
     * @param  {number | Percent}  value  Absolute or relative Y coordinate
     * @return {number}                   Relative value
     */
    getRelativeY(value: number | Percent): number;
    /**
     * Returns an X coordinate in pixel within the element.
     *
     * If number is passed in as parameter, the same number will be returned
     * back.
     *
     * If [[Percent]] is passed in, it will be recalculated to pixels.
     *
     * @param  {number | Percent}  value  Absolute or relative X coordinate
     * @return {number}                   X coordinate in pixels
     */
    getPixelX(value: number | Percent): number;
    /**
     * Returns an Y coordinate in pixel within the element.
     *
     * If number is passed in as parameter, the same number will be returned
     * back.
     *
     * If [[Percent]] is passed in, it will be recalculated to pixels.
     *
     * @param  {number | Percent}  value  Absolute or relative Y coordinate
     * @return {number}                   Y coordinate in pixels
     */
    getPixelY(value: number | Percent): number;
    /**
     * Moves the element to a specified coordinates.
     *
     * Using this method is preferred method of moving element, as it saves some
     * CPU processing power over setting `x` and `y` properties separately.
     *
     * The method respects element's center settings. The element will be
     * positioned so that `point` coordinates come in whatever "center" of the
     * element is, as set in `horizontalCenter` and `verticalCenter`.
     *
     * Besides moving the element, you can also at the same time scale and
     * rotate the element.
     *
     * @param {IPoint}  point     New coordinates
     * @param {number}  rotation  New rotation
     * @param {number}  scale     New Scale
     */
    moveTo(point: IPoint, rotation?: number, scale?: number, isDragged?: boolean): void;
    /**
     * Returns [[Sprite]] element currently used as mask for this element.
     *
     * @ignore Exclude from docs
     * @return {Optional<Sprite>} A [[Sprite]] to use as mask
     */
    /**
     * Sets another [[Sprite]] element as this elements mask.
     *
     * @ignore Exclude from docs
     * @param {Optional<Sprite>} mask A [[Sprite]] to use as mask
     */
    mask: Optional<Sprite>;
    /**
     * @ignore Exclude from docs
     * @return {IRectangle} Mask Rectangle
     */
    /**
     * Instead of creating a [[Sprite]] for mask, you can just use a
     * [[Rectangle]] by setting this accessor.
     *
     * Please note that the element will not monitor any changes to the mask
     * rectangle.
     *
     * @ignore Exclude from docs
     * @param {IRectangle} rect Mask Rectangle
     */
    maskRectangle: IRectangle;
    /**
     * @ignore Exclude from docs
     * @return {boolean} Was element already measured?
     */
    /**
     * Indicates if this element was already measured.
     *
     * @ignore Exclude from docs
     * @param {boolean} value Was element already measured?
     */
    isMeasured: boolean;
    /**
     * Checks if the this element has any of its parts overlapping with another
     * element.
     *
     * @todo Description (review)
     * @param  {Sprite}   sprite  Second element to test again
     * @return {boolean}          Overlapping?
     */
    hitTest(sprite: Sprite): boolean;
    /**
     * ==========================================================================
     * STATE-RELATED
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns `true` if Sprite has already finished initializing.
     *
     * @return {boolean} Initialized?
     */
    readonly inited: boolean;
    /**
     * Returns a collection of element's available [[SpriteState]] entries.
     *
     * @see {@link SpriteState}
     * @return {DictionaryTemplate<string, SpriteState>} States
     */
    readonly states: DictionaryTemplate<string, SpriteState<this["_properties"], this["_adapter"]>>;
    /**
     * Returns a [[SpriteState]] object for "hidden" state.
     *
     * This is a shortcut to `this.states.getKey("hidden")`.
     *
     * @return {SpriteState} Hidden state
     */
    readonly hiddenState: SpriteState<this["_properties"], this["_adapter"]>;
    /**
     * Returns a [[SpriteState]] object for "default" state.
     *
     * This is a shortcut to `this.states.getKey("default")`.
     *
     * @return {SpriteState} Hidden state
     */
    readonly defaultState: SpriteState<this["_properties"], this["_adapter"]>;
    /**
     * Checks if some key states are defined and updates Sprite properties
     * accordingly.
     *
     * For example if there's a state "down" defined for Sprite, we automatically
     * make it "clickable".
     *
     * @ignore Exclude from docs
     * @param {IDictionaryEvents<string, SpriteState>["insertKey" | "setKey"]} event An event which caused state list update
     */
    protected processState(event: IDictionaryEvents<string, SpriteState<this["_properties"], this["_adapter"]>>["insertKey" | "setKey"]): void;
    /**
     * Returns a list elements's animations currently being played.
     *
     * If the list has not been initialized it is created.
     *
     * @return {Array<Animation>} List of animations
     */
    readonly animations: Array<Animation>;
    /**
     * Converts element's local coordinates to the coordinates within the main
     * chart container.
     *
     * @param  {IPoint}  point  Local point
     * @return {IPoint}         Global point
     */
    getSvgPoint(point: IPoint): IPoint;
    /**
     * Creates and starts an [[Animation]] with given `animationOptions`.
     *
     * @see {@link Animation} for additional information about available options
     * @param  {ISpriteAnimationOptions[] | ISpriteAnimationOptions}  animationOptions  Animation options
     * @param  {number}                                               duration          Duration in milliseconds
     * @param  {(number) => number}                                   easing            Easing function
     * @return {Animation}                                                              Animation instance
     */
    animate(animationOptions: ISpriteAnimationOptions[] | ISpriteAnimationOptions, duration: number, easing?: (value: number) => number): Animation;
    /**
     * Applies a [[SpriteState]] on this element.
     *
     * The first parameter can either be a name state or a [[SpriteState]]
     * instance.
     *
     * When run, this method will apply SVG properties defined in a
     * [[SpriteState]], but only those that are relevant to this particular
     * element, i.e. are in the `properties` array.
     *
     * @see {@link SpriteState}
     * @param {string | SpriteState} value               A state - name key or instance
     * @param {number}               transitionDuration  Duration of the transition between current and new state
     * @param {number) => number}    easing              An easing function
     */
    setState(value: string | SpriteState<this["_properties"], this["_adapter"]>, transitionDuration?: number, easing?: (value: number) => number): $type.Optional<Animation>;
    /**
     * Applies proper state based on the condition of the element. A condition is
     * deducted in this order:
     * * "hover" if Sprite has currently any pointers over it
     * * "down" if Sprite has any pointers (touch or mouse) currently pressed over it
     * * "focus" if Sprite has currently got focus (accessibility)
     * * "hidden" if Sprite is currently hidden
     *
     * Returns an [[Animation]] object, which is handling gradual transition from
     * current values of properties, to the new target state(s).
     *
     * @param  {number}     duration  Duration for the animation (ms)
     * @return {Optional<Animation>}  [[Animation]] object which is handling the transition
     */
    applyCurrentState(duration?: number): $type.Optional<Animation>;
    /**
     * Starts an [[Animation]] of the properties to specific values as they are
     * set in `state`.
     *
     * @ignore Exclude from docs
     * @param  {SpriteState}         state     Target State
     * @param  {number}              duration  Duration in milliseconds
     * @param  {(number) => number}  easing    Easing function
     * @return {Animation}                     Transition Animation
     */
    protected transitTo(state: SpriteState<this["_properties"], this["_adapter"]>, duration: number, easing?: (value: number) => number): Optional<Animation>;
    /**
     * Returns `true` if Sprite is currently transiting from one state/value to
     * another.
     *
     * @return {boolean} Is in transition?
     */
    isInTransition(): boolean;
    /**
     * Returns indicator if this element has a mouse pointer currently hovering
     * over it, or if it has any touch pointers pressed on it.
     *
     * @return {boolean} Is hovered?
     */
    /**
     * Indicates if this element has a mouse pointer currently hovering
     * over it, or if it has any touch pointers pressed on it.
     *
     * @param {boolean} value Is hovered?
     */
    isHover: boolean;
    /**
     * Returns indicator if this element is being dragged at the moment.
     *
     * @return {boolean} Is dragged?
     */
    readonly isDragged: boolean;
    /**
     * @return {boolean} Is down?
     */
    /**
     * Indicates if this element has any pointers (mouse or touch) pressing down
     * on it.
     *
     * @param {boolean} value Is down?
     */
    isDown: boolean;
    /**
     * @return {boolean} Is focused?
     */
    /**
     * Indicates if this element is focused (possibly by tab navigation).
     *
     * @param {boolean} value Is focused?
     */
    isFocused: boolean;
    /**
     * @return {boolean} Is active?
     */
    /**
     * Indicates if this element is currently active (toggled on) or not
     * (toggled off).
     *
     * @param {boolean} value Is active?
     */
    isActive: boolean;
    protected setActive(value: boolean): void;
    /**
     * @return {boolean} Disabled?
     */
    /**
     * Controls if element is disabled.
     *
     * A disabled element is hidden, and is removed from any processing, layout
     * calculations, and generally treated like if it does not existed.
     *
     * The element itself is not destroyed, though. Setting this back to `false`,
     * will "resurrect" the element.
     *
     * @param {boolean}  value  Disabled?
     */
    disabled: boolean;
    protected setDisabled(value: boolean): void;
    /**
     * Internal disable method.
     *
     * Do not use it for disabling elements. Use `disabled` accessor instead.
     *
     * @ignore Exclude from docs
     * @param {boolean} value Disabled?
     */
    __disabled: boolean;
    /**
     * @return {NumberFormatter} A [[NumberFormatter]] instance to be used
     */
    /**
     * ==========================================================================
     * FORMATTERS AND OTHER EXTERNAL HELPERS
     * ==========================================================================
     * @hidden
     */
    /**
     * A [[NumberFormatter]] instance.
     *
     * This is used to format numbers.
     *
     * ```TypeScript
     * chart.numberFormatter.numberFormat = "#,###.#####";
     * ```
     * ```JavaScript
     * chart.numberFormatter.numberFormat = "#,###.#####";
     * ```
     * ```JSON
     * {
     *   // ...
     *   "numberFormatter": {
     *     "numberFormat": "#,###.#####"
     *   }
     * }
     * ```
     *
     * You can set a separate instance of formatter for each
     * individual element. However that would be unnecessary overhead as
     * all elements would automatically inherit formatter from their parents,
     * all the way up to the chart itself.
     *
     *
     * @see {@link NumberFormatter} for more info on formatting numbers
     * @param {NumberFormatter}  value  An instance of NumberFormatter
     */
    numberFormatter: NumberFormatter;
    /**
     * @return {DateFormatter} An instance of DateFormatter
     */
    /**
     * A [[DateFormatter]] instance.
     *
     * This is used to format dates, e.g. on a date axes, balloons, etc.
     *
     * ```TypeScript
     * chart.dateFormatter.dateFormat = "yyyy-MM-dd";
     * ```
     * ```JavaScript
     * chart.dateFormatter.dateFormat = "yyyy-MM-dd";
     * ```
     * ```JSON
     * {
     *   // ...
     *   "dateFormatter": {
     *     "dateFormat": "yyyy-MM-dd"
     *   }
     * }
     * ```
     *
     * You can set a separate instance of formatter for each
     * individual element. However that would be unnecessary overhead as
     * all elements would automatically inherit formatter from their parents,
     * all the way up to the chart itself.
     *
     * @see {@link DateFormatter} for more info on dates formatting
     * @param {DateFormatter}  value  An instance of DateFormatter
     */
    dateFormatter: DateFormatter;
    /**
     * @return {DurationFormatter} An instance of DurationFormatter
     */
    /**
     * A [[DurationFormatter]] instance.
     *
     * This is used to format numbers as durations, e.g. on a value axes.
     *
     * You can set a separate instance of formatter for each
     * individual element. However that would be unnecessary overhead as
     * all elements would automatically inherit formatter from their parents,
     * all the way up to the chart itself.
     *
     * @see {@link DurationFormatter} for more info on durations
     * @param {DurationFormatter}  value  An instance of DurationFormatter
     */
    durationFormatter: DurationFormatter;
    /**
     * @return {Language} An instance of Language
     */
    /**
     * A [[Language]] instance to use for translations.
     *
     * Normally it is enough to set language for the top-most element - chart.
     *
     * All other element child elements will automatically re-use that language
     * object.
     *
     * @param {Language}  value  An instance of Language
     */
    language: Language;
    /**
     * ==========================================================================
     * DATA-RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Parses the string for meta tags `{tag}` and replaces them with a real
     * value. Supports straight up tags referring to the field in data, i.e.
     * `{value}` or tags with additional formatting info. E.g.:
     *
     * ```Text
     * {myfield.formatDate("yyyy-MM-dd")}
     * {myfield.formatDate()}
     * {myfield.formatNumber("#,####.00")}
     * {myfield.formatNumber()}
     * {myField.formatDuration("mm:ss")}
     * ```
     *
     * Etc.
     *
     * This method Will automatically detect and use proper formatter for the
     * value.
     *
     * The source value will be looked up in various places: (in order)
     * * Sprite's own `dataItem`
     * * Sprite's properties
     * * Parent's `dataItem`
     * * Parent's properties
     *
     * @ignore Exclude from docs
     * @param  {string}    string            A string to format
     * @param  {DataItem}  dataItem          DataItem
     * @return {string}                      Formatted string
     */
    populateString(string: string, dataItem?: DataItem): string;
    /**
     * Gets the value from data item and formats it according to specified format.
     *
     * If `format` is specified, it will use its contents to choose formatter for
     * the value. Otherwise it will select formatter accordingly to actual value
     * type.
     *
     * @ignore Exclude from docs
     * @todo Ability to force certain formatter on known numeric and date values
     * @see {@link NumberFormatter}
     * @see {@link DateFormatter}
     * @see {@link DurationFormatter}
     * @param  {string}    tagName           Tag name to replace
     * @param  {string}    format            Format to use
     * @param  {DataItem}  dataItem          DataItem
     * @return {string}                      Formatted value
     */
    getTagValue(tagName: string, format?: string, dataItem?: DataItem): string;
    /**
     * Tries to retrieve values from properties of any object, then applies
     * proper formatting to it.
     *
     * @ignore Exclude from docs
     * @todo Description (improve)
     * @param  {any[]}   parts   Properties ant methods to access
     * @param  {any}     object  Source object
     * @param  {string}  format  A specific format to apply
     * @return {any}             Formatted value
     */
    getTagValueFromObject(parts: any[], object: any, format?: string): any;
    /**
     * @return {this} [[DataItem]]
     */
    /**
     * A [[DataItem]] to use as element's data source.
     *
     * @todo Review type
     * @param {this["_dataItem"]}  dataItem  DataItem
     */
    dataItem: this["_dataItem"];
    /**
     * Sets currently used [[DataItem]].
     *
     * If the element has also `configField` set, it will also look for any
     * config in DataItem's data context to apply to this element.
     *
     * @param {DataItem} dataItem DataItem
     */
    protected setDataItem(dataItem: DataItem): void;
    /**
     * ==========================================================================
     * PROPERTY UTILITIES
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns element's property value.
     *
     * Will check if there are any bindings with [[DataItem]].
     *
     * Will also apply any adapters bound to `propertyName`.
     *
     * @param  {ISpriteProperties}  propertyName  Property name
     * @return {any}                              Property value
     */
    getPropertyValue(propertyName: keyof this["_properties"]): any;
    /**
     * Sets elements's property value. Will also propagate the same property value
     * on all element's clones.
     *
     * @param  {this["_properties"]}  property    Property
     * @param  {any}                  value       Value
     * @param  {boolean}              invalidate  Should the sprite be invalidated, cause it's re-rendering
     * @param  {boolean}              transform   Re-apply positioning of the element
     * @return {boolean}                          Did the value change? It will return `true` if the new value and the old value of the property are not the same
     * @todo Review propagation to clones. Right now we simply check if clone is disposed before setting the same property on it. It's better to remove from clone list altogether.
     */
    setPropertyValue<Key extends keyof this["properties"]>(property: Key, value: any, invalidate?: boolean, transform?: boolean): boolean;
    /**
     * @ignore Exclude from docs
     * @todo Verify this
     */
    bind<S extends {
        cloneId: string;
        events: EventDispatcher<{
            propertychanged: {
                property: string;
            };
        }>;
    }, From extends (keyof S & keyof this), To extends keyof this>(property: To, source: S, bindToProperty: From, modifier?: (value: this[From]) => this[To]): void;
    bind<S extends {
        cloneId: string;
        events: EventDispatcher<{
            propertychanged: {
                property: string;
            };
        }>;
    }, Key extends (keyof S & keyof this)>(property: Key, source: S, modifier?: (value: this[Key]) => this[Key]): void;
    /**
     * Sets up and obeserver function to monitor changes in particular property
     * or properties.
     *
     * @ignore Exclude from docs
     * @param   {string | string[]}  property  Element's property name
     * @param   {function}           listener  Handler function
     * @param   {C}                  context   Context for handler function
     * @returns {IDisposer}                    Event Disposer
     */
    observe<C>(property: string | string[], listener: (this: C, event: AMEvent<Sprite, ISpriteEvents>["propertychanged"]) => void, context?: C): IDisposer;
    /**
     * ==========================================================================
     * ACCESSIBILITY-RELATED PROPERTIES
     * ==========================================================================
     * @hidden
     */
    /**
     * Applies accessibility to the SVG element.
     *
     * Adds `<title>` and `<description>` elements as well as `aria-labelledby`
     * and `role` properties.
     *
     * @ignore Exclude from docs
     */
    protected applyAccessibility(): void;
    /**
     * @return {string} Title
     */
    /**
     * Screen reader title of the element.
     *
     * @param {string} value Title
     */
    readerTitle: string;
    /**
     * @return {string} Description
     */
    /**
     * Screen reader description of the element.
     *
     * @param {string} value Description
     */
    readerDescription: string;
    /**
     * @return {Roles} Role
     */
    /**
     * A WAI-ARIA role for the element.
     *
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#role_definitions} for more information on WAI-ARIA roles
     * @param {Roles}  value  Role
     */
    role: Roles;
    /**
     * @return {boolean} Hidden?
     */
    /**
     * Controls if element should be hidden from screen readers.
     *
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-hidden} for more information
     * @param {boolean}  value  Hidden?
     */
    readerHidden: boolean;
    /**
     * @ignore Exclude from docs
     * @return {boolean} Checked?
     */
    /**
     * Controls if element is currently marked as "checked".
     *
     * @ignore Exclude from docs
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-checked} for more information
     * @param {boolean} value Checked?
     */
    readerChecked: boolean;
    /**
     * @ignore Exclude from docs
     * @return {string} Setting value
     */
    /**
     * A `uid` of an element this element controls.
     *
     * @ignore Exclude from docs
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-controls} for more information
     * @param {string} value Setting value
     */
    readerControls: string;
    /**
     * @ignore Exclude from docs
     * @return {AriaLive} Setting value
     */
    /**
     * Controls accessibility setting "aria-live" for the element.
     *
     * @ignore Exclude from docs
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions} for more information
     * @param {AriaLive} value Setting value
     */
    readerLive: AriaLive;
    /**
     * @ignore Exclude from docs
     * @return {Sprite} Target element
     */
    /**
     * A `uid` of an element that describes this element.
     *
     * @ignore Exclude from docs
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby} for more information
     * @param {Sprite} value Target element
     */
    readerLabelledBy: string;
    /**
     * @ignore Exclude from docs
     * @return {Sprite} Target element
     */
    /**
     * A `uid` of an element that describes this element.
     *
     * @ignore Exclude from docs
     * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-describedby} for more information
     * @param {Sprite} value Target element
     */
    readerDescribedBy: string;
    /**
     * ==========================================================================
     * USER INTERACTIONS
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns elements keyboard options.
     *
     * @return {IKeyboardOptions} Keyboard options
     */
    readonly keyboardOptions: IKeyboardOptions;
    /**
     * Returns (creates if necessary) an [[InteractionObject]] associated with
     * this element.
     *
     * [[InteractionObject]] is used to attach all kinds of user-interactions to
     * the element, e.g. click/touch, dragging, hovering, and similar events.
     *
     * @return {InteractionObject} Interaction object
     */
    readonly interactions: InteractionObject;
    /**
     * @return {Optional<boolean>} Can element be focused?
     */
    /**
     * ==========================================================================
     * ELEMENT FOCUS-RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Controls if the element can gain focus.
     *
     * Focusable element will be selectable via TAB key.
     *
     * Please note, clicking it with a mouse or touching will not add focus to
     * it.
     *
     * Focused element will show a system-specific highlight, which might ruin
     * the overal look. This is why we don't focus element on click/touch.
     *
     * A default setting varies for different elements. By default all elements
     * are not focusable, except certain items like buttons, legend items, etc.
     *
     * @default undefined (auto)
     * @param {Optional<boolean>}  value  Can element be focused?
     */
    focusable: Optional<boolean>;
    /**
     * Applies filters (if set) when element gains focus.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["focus"]} ev Original event
     */
    handleFocus(ev?: AMEvent<Sprite, ISpriteEvents>["focus"]): void;
    /**
     * Removes focus filter (if set) when elementloses focus.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["blur"]} ev Original event
     */
    handleBlur(ev?: AMEvent<Sprite, ISpriteEvents>["blur"]): void;
    /**
     * A reference to a [[Filter]] to apply to element when it gains focus.
     *
     * Normally, browsers will draw a default ugly square around focused element,
     * which totally makes sense because its purpose is to help identify active
     * element for visually impaired people.
     *
     * However, if you would rather apply a filter, so you can modify how focused
     * element looks like, use `focusFilter`.
     *
     * Simply set it to an anstance of [[FocusFilter]], or any other filter
     * object.
     *
     * ```TypeScript
     * chart.focusFilter = new am4core.FocusFilter();
     * ```
     * ```JavaScript
     * chart.focusFilter = new am4core.FocusFilter();
     * ```
     * ```JSON
     * {
     *   // ...
     *   "focusFilter": {
     *     "type": "FocusFilter"
     *   },
     *   // ...
     * }
     * ```
     *
     * @see {@link Filter}
     * @ignore Exclude from docs
     * @return {Optional<Filter>} Focused element filter
     * @todo This is still experimental, use at your own risk.
     */
    /**
     * @see {@link Filter}
     * @ignore Exclude from docs
     * @todo This is still experimental, don't use it
     */
    focusFilter: $type.Optional<Filter>;
    /**
     * @return {boolean} Trigger hover on focus?
     */
    /**
     * If set to `true`, this element will also trigger `"over"` event with all
     * the related consequences, like "hover" state being applied and tooltip
     * being shown.
     *
     * Useful as an accessibility feature to display rollover tooltips on items
     * selected via keyboard.
     *
     * @param {boolean}  value  Trigger hover on focus?
     * @default false
     */
    hoverOnFocus: boolean;
    /**
     * Returns current TAB index for focusable item.
     *
     * @return {number} TAB index
     */
    /**
     * Sets TAB index.
     *
     * Tab index maintains the order in which focusable elements gain focus when
     * TAB key is pressed.
     *
     * Please note, tab index is not local to the chart. It affects the whole
     * of the page, including non-SVG elements. Maintain extreme causion when
     * setting tab indexes, as it affects the user experience for the whole
     * web page.
     *
     * @param {number} value TAB index
     */
    tabindex: number;
    /**
     * ==========================================================================
     * DRAGGING AND RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns element's options to be used for inertia. This setting is
     * inheritable, meaning that if not set directly, it will search in all its
     * ascendants until very top.
     *
     * Inertia is used only if element's `inert` is set to `true`.
     *
     * "Inert" element, when dragged and released, will carry the momentum of the
     * movement, and will continue moving in the same drag direction, gradually
     * reducing in speed until finally stops.
     *
     * Check [[IInertiaOptions]] for how you tweak inertia animations.
     *
     * @return {Dictionary<InertiaTypes, IInertiaOptions>} Inertia options
     */
    readonly inertiaOptions: Dictionary<InertiaTypes, IInertiaOptions>;
    /**
     * @return {boolean} `true` if element can be dragged
     */
    /**
     * Controls if the element is draggable.
     *
     * @param {boolean}  value  `true` if element can be dragged
     */
    draggable: boolean;
    /**
     * Executes when dragged element is being started to drag.
     *
     * @ignore Exclude from docs
     */
    protected handleDragStart(): void;
    /**
     * Tell this element to start being dragged. This is useful if you want to
     * drag items by interactions performed not directly on the target element.
     *
     * Parameter `pointer` is highly recommended. By passing in the Pointer you
     * will ensure that movement is tracked for the pointer that you want. If not
     * supplied, the system will try to determine the most logical pointer.
     *
     * However this may fail if you have more than one pointer active, which
     * might happen if you have several objects being dragged on a touch device.
     *
     * @ignore Exclude from docs
     * @param {IPointer} pointer Pointer to use for movement
     */
    dragStart(pointer?: IPointer): void;
    /**
     * Executes when dragged element is being dropped.
     *
     * @ignore Exclude from docs
     */
    protected handleDragStop(): void;
    /**
     * Stops manually initiated dragging of the element.
     *
     * @ignore Exclude from docs
     * @param {IPointer} pointer Pointer to use as a reference
     */
    dragStop(pointer?: IPointer): void;
    /**
     * Executes when {Sprite} is being dragged.
     *
     * @ignore Exclude from docs
     * @param {InteractionEvent} ev Event object
     * @todo Implement parent position offset calculation
     */
    handleDragMove(ev: AMEvent<Sprite, ISpriteEvents>["drag"]): void;
    /**
     * @return {boolean} `true` if element should use inertia when animated
     */
    /**
     * Controls if the element should use inertia when interacted with.
     *
     * "Inert" element, when dragged and released, will carry the momentum of the
     * movement, and will continue moving in the same drag direction, gradually
     * reducing in speed until finally stops.
     *
     * @default false
     * @param {boolean} value `true` if element should use inertia when animated
     */
    inert: boolean;
    /**
     * ==========================================================================
     * HOVERING
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns Sprite's hover options.
     *
     * @see {@link IHoverOptions} for available options.
     * @return {IHoverOptions} Options
     */
    readonly hoverOptions: IHoverOptions;
    /**
     * @return {boolean} `true` if element is hoverable
     */
    /**
     * Controls if the element is hoverable (hover events are registered).
     *
     * Use `over` and `out` events, to watch for those respective actions.
     *
     * @default false
     * @param {boolean} value `true` if element can be hovered
     */
    hoverable: boolean;
    /**
     * Handles tasks when element becomes hovered:
     * * Shows [[Tooltip]] if applicable
     * * Applies "hover" state
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["over"]} ev Event object
     */
    handleOver(ev?: AMEvent<Sprite, ISpriteEvents>["over"]): void;
    /**
     * Handles tasks when element loses hover:
     * * Hides [[Tooltip]]
     * * Applys default state
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["out"]} ev [description]
     */
    handleOut(ev?: AMEvent<Sprite, ISpriteEvents>["out"]): void;
    handleOutReal(): void;
    /**
     * ==========================================================================
     * CLICKING/TAPPING AND TOGGLING STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns Sprite's click (hit) options.
     *
     * Click (hit) options control things like double-click, timeouts, etc.
     *
     * @see {@link IHitOptions} for available options.
     * @return {IHitOptions} Options
     */
    readonly hitOptions: IHitOptions;
    /**
     * Prepares element's after `down` event.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["rotate"]} ev Event
     */
    handleDown(ev?: AMEvent<Sprite, ISpriteEvents>["down"]): void;
    /**
     * Prepares element's after `up` event.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["rotate"]} ev Event
     */
    handleUp(ev?: AMEvent<Sprite, ISpriteEvents>["up"]): void;
    /**
     * @return {boolean}
     */
    /**
     * Indicates if the element is clickable.
     *
     * Some times of the elements, like buttons are clickable by default.
     *
     * Most of the elements are not clickable by default.
     *
     * Use `hit`, `doublehit`, `up`, `down`, `toggled` events to watch for
     * respective click/touch actions.
     *
     * @param {boolean} value `true` if element can be clicked
     */
    clickable: boolean;
    /**
     * @return {boolean} Is togglable?
     */
    /**
     * Indicates if element can be toggled on and off by subsequent clicks/taps.
     *
     * Togglable element will alternate its `isActive` property between `true`
     * and `false` with each click.
     *
     * @param {boolean} value Is togglable?
     */
    togglable: boolean;
    /**
     * Handles toggling of the element.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["hit"]} ev Event
     */
    handleToggle(ev: AMEvent<Sprite, ISpriteEvents>["hit"]): void;
    /**
     * @return {Optional<string>} URL
     */
    /**
     * Click-through URL for this element.
     *
     * If set, clicking/tapping this element will open the new URL in a target
     * window/tab as set by `urlTarget`.
     *
     * @param {Optional<string>} value URL
     */
    url: $type.Optional<string>;
    /**
     * @return {string} URL target
     */
    /**
     * Target to use for URL clicks:
     *
     * * _blank
     * * _self (default)
     * * _parent
     * * _top
     * * Name of the window/frame
     *
     * Ignored if `url` is not set.
     *
     * @param {string} value URL target
     */
    urlTarget: string;
    /**
     * Handles URL transition on element click.
     *
     * @ignore Exclude from docs
     * @param {InteractionEvent} ev An event object
     */
    urlHandler(ev: AMEvent<Sprite, ISpriteEvents>["hit"]): void;
    /**
     * ==========================================================================
     * SWIPING GESTURE TRACKING
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns element's swipe gesture options.
     *
     * @return {ISwipeOptions} Swipe gesture options
     */
    readonly swipeOptions: ISwipeOptions;
    /**
     * @return {boolean} Element swipable?
     */
    /**
     * Controls if element is swipeable.
     *
     * Swipable element will invoke `swipe`, `swipeleft` and `swiperight` events,
     * when quick horizontal drag action is performed with either mouse or touch.
     *
     * Please note that combining swipe and drag is possible, however will incur
     * a slight but noticeable delay in drag start.
     *
     * @param {boolean}  value  Element swipable?
     */
    swipeable: boolean;
    /**
     * @return {boolean} Track cursor movement over element?
     */
    /**
     * ==========================================================================
     * POINTER TRACKING
     * ==========================================================================
     * @hidden
     */
    /**
     * Indicates if the element is trackable (mouse position over it is reported to
     * event listeners).
     *
     * Will invoke `track` events whenever pointer (cursor) changes position
     * while over element.
     *
     * Please note, touch devices will also invoke `track` events when touch
     * point is moved while holding down on a trackable element.
     *
     * @param {boolean} value Track cursor movement over element?
     */
    trackable: boolean;
    /**
     * @return {boolean} Mouse wheel events enabled?
     */
    /**
     * ==========================================================================
     * MOUSE-WHEEL RELATED
     * ==========================================================================
     * @hidden
     */
    /**
     * Indicates if the element can be interacted with mouse wheel.
     *
     * Will invoke `wheel`, `wheelup`, `wheeldown`, `wheelleft`, and `wheelright`
     * events when using mouse wheel over the element.
     *
     * @param {boolean} value Mouse wheel events enabled?
     */
    wheelable: boolean;
    /**
     * @return {boolean} Element resizable?
     */
    /**
     * ==========================================================================
     * RESIZE
     * ==========================================================================
     * @hidden
     */
    /**
     * Indicates if this element is resizable.
     *
     * Enabling resize will turn on various interactions on the element. Their
     * actual functionality will depend on other properties.
     *
     * If the element also `draggable`, resize will only happen with two points
     * of contact on a touch device.
     *
     * If the element is not draggable, resize can be performed with just one
     * point of contact, touch or mouse.
     *
     * Will invoke `resize` event every time the size of the element changes.
     *
     * @param {boolean}  value  Element resizable?
     */
    resizable: boolean;
    /**
     * Handles resize intermediate step.
     *
     * By default this method resizes actual element. Each element, can override
     * this method to implement their own resize logic.
     *
     * @ignore Exclude from docs
     * @param {InteractionEvent} ev Event object
     */
    handleResize(ev: AMEvent<Sprite, ISpriteEvents>["resize"]): void;
    /**
     * @return {boolean} Can be rotated?
     */
    /**
     * ==========================================================================
     * ROTATION
     * ==========================================================================
     * @hidden
     */
    /**
     * Controls if the element can be rotated.
     *
     * If enabled, the element can be rotated using various interactions.
     *
     * If the element also `draggable`, rotation can be performed using two
     * points of contact, i.e. on touch devices only.
     *
     * If the element is not `draggable`, rotation can be performed using one
     * point of contact, e.g. mouse or touch.
     *
     * Rotation will happen around configured center of the element, as set in
     * `horizontalCenter` and `verticalCenter`.
     *
     * Invokes `rotate` event when rotation angle changes.
     *
     * @param {boolean}  value  Can be rotated?
     */
    rotatable: boolean;
    /**
     * Handles rotate intermediate step.
     *
     * By default this method will rotate the actual element.
     *
     * Extending classes might override this method to implement their own
     * rotation logic.
     *
     * @ignore Exclude from docs
     * @param {InteractionEvent} ev Event object
     */
    handleRotate(ev: AMEvent<Sprite, ISpriteEvents>["rotate"]): void;
    /**
     * ==========================================================================
     * MOUSE-RELATED
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns element's cursor options.
     *
     * Cursor options usually define cursor style for various states of the
     * hovered element.
     *
     * Elements inherit `cursorOptions` from their parents if they don't have
     * them set explicitly.
     *
     * @see {@link ICursorOptions} for a list of available options
     * @return {ICursorOptions} Cursor options
     */
    readonly cursorOptions: ICursorOptions;
    /**
     * A shortcut to setting mouse cursor on hover.
     *
     * @param {Array<IStyleProperty>} style An array of styles to apply onhover
     */
    cursorOverStyle: Array<IStyleProperty>;
    /**
     * A shortcut to setting mouse cursor when button is pressed down.
     *
     * @param {Array<IStyleProperty>} style An array of styles to apply onhover
     */
    cursorDownStyle: Array<IStyleProperty>;
    /**
     * Applies default cursor styles for interactable elements.
     *
     * @ignore Exclude from docs
     * @todo Determine if this is necessary. Maybe let's not apply any cursor styles by default
     */
    applyCursorStyle(): void;
    /**
     * @return {boolean} Is interaction enabled for this element?
     */
    /**
     * Setting this to `false` will effectively disable all interactivity on the
     * element.
     *
     * @param {boolean}  value  Is interaction enabled for this element?
     */
    interactionsEnabled: boolean;
    /**
     * Sets up the element to either ignore all interactivity, or not.
     *
     * @ignore Exclude from docs
     * @param  {boolean}  value  Interactivity enabled?
     * @return {string}          Current event handlers for the element
     */
    setInteractionsEnabled(value: boolean): string;
    /**
     * @return {Export} Export instance
     */
    /**
     * ==========================================================================
     * EXPORT-RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * An [[Export]] instance.
     *
     * Used to access API of the chart export functionality.
     *
     * If `exporting` is not set, the element inherits [[Export]] instance from
     * its parents.
     *
     * Upon request, if no parent has such instance, a new one is created, using
     * default settings, what in most cases is just enough.
     *
     * @see {@link https://www.amcharts.com/docs/v4/concepts/exporting/} for more info about exporting
     * @param {Export}  exp  Export
     */
    exporting: Export;
    /**
     * This is here as a method so that inheriting classes could override it.
     *
     * @return {Export} Export instance
     */
    protected getExporting(): Export;
    /**
     * ==========================================================================
     * MODAL/POPUP RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Returns a [[Modal]] instance, associated with this chart.
     * (elements top parent)
     *
     * Accessing modal does not make it appear. To make a modal appear, use
     * `showModal()` method.
     *
     * @see {@link Modal} for more information about using Modal windows
     * @return {Modal} Modal instance
     */
    readonly modal: Modal;
    /**
     * Opens a modal window with specific content (`text` parameter) and,
     * optionally, `title`.
     *
     * The `text` parameter can contain HTML content.
     *
     * @see {@link Modal} for more information about using Modal windows
     * @param {string}  text   Modal contents
     * @param {string}  title  Title for the modal window
     */
    openModal(text: string, title?: string): Modal;
    /**
     * Hides modal window if there is one currently open.
     */
    closeModal(): void;
    /**
     * A list of popups for this chart.
     *
     * @return {ListTemplate<Popup>} Popups
     */
    readonly popups: ListTemplate<Popup>;
    /**
     * Creates, opens, and returns a new [[Popup]] window.
     *
     * `text` can be any valid HTML.
     *
     * `title` is currently not supported.
     *
     * @param  {string}  text   Popup contents
     * @param  {string}  title  Popup title
     * @return {Popup}          Popup instance
     */
    openPopup(text: string, title?: string): Popup;
    /**
     * Closes all currently open popup windows
     */
    closeAllPopups(): void;
    /**
     * @return {number | Percent} X coordinate
     */
    /**
     * ==========================================================================
     * POSITIONAL PROPERTIES AND RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Element's absolute or relative X coordinate.
     *
     * If setting both X and Y, please consider using `moveTo()` method instead,
     * as it will be faster to set both coordinates at once.
     *
     * @param {number | Percent} value X coordinate
     */
    x: number | Percent;
    /**
     * Returns element's current absolute X coordinate in pixels.
     *
     * @readonly
     * @return {number} X coordinate (px)
     */
    readonly pixelX: number;
    /**
     * Returns element's current relative X coordinate in [[Percent]].
     *
     * @return {number} X coordinate ([[Percent]])
     */
    readonly relativeX: number;
    /**
     * @ignore Exclude from docs
     * @return {number} Min X (px)
     */
    /**
     * The smallest allowable absolute X coordinate for this element.
     *
     * This is used to contain element movement within certain boundaries.
     *
     * @ignore Exclude from docs
     * @param {number} value Min X (px)
     */
    minX: number;
    /**
     * @ignore Exclude from docs
     * @return {number} Max X (px)
     */
    /**
     * The biggest allowable absolute X coordinate for this element.
     *
     * This is used to contain element movement within certain boundaries.
     *
     * @ignore Exclude from docs
     * @param {number} value Max X (px)
     */
    maxX: number;
    /**
     * @return {number | Percent} Y coordinate
     */
    /**
     * Element's absolute or relative Y coordinate.
     *
     * If setting both X and Y, please consider using `moveTo()` method instead,
     * as it will be faster to set both coordinates at once.
     *
     * @param {number | Percent}  value  Y coordinate
     */
    y: number | Percent;
    /**
     * Returns element's current absolute Y coordinate in pixels.
     *
     * @readonly
     * @return {number} Y coordinate (px)
     */
    readonly pixelY: number;
    /**
     * Returns element's current relative Y coordinate in [[Percent]].
     *
     * @readonly
     * @return {number} Y coordinate ([[Percent]])
     */
    readonly relativeY: number;
    /**
     * @ignore Exclude from docs
     * @return {number} Min Y (px)
     */
    /**
     * The smallest allowable absolute Y coordinate for this element.
     *
     * This is used to contain element movement within certain boundaries.
     *
     * @ignore Exclude from docs
     * @param {number} value Min Y (px)
     */
    minY: number;
    /**
     * @ignore Exclude from docs
     * @return {number} Max Y (px)
     */
    /**
     * The biggest allowable absolute Y coordinate for this element.
     *
     * This is used to contain element movement within certain boundaries.
     *
     * @ignore Exclude from docs
     * @param {number}  value  Max Y (px)
     */
    maxY: number;
    /**
     * @return {number} Horizontal offset (px)
     */
    /**
     * A horizontal offset for the element in pixels.
     *
     * Can be negative value for offset to the left.
     *
     * @param {number}  value  Horizontal offset (px)
     */
    dx: number;
    /**
     * @return {number} Vertical offset (px)
     */
    /**
     * A vertical offset for the element in pixels.
     *
     * Can be negative value for offset upwards.
     *
     * @param {number}  value  Vertical offset (px)
     */
    dy: number;
    /**
     * @return {number} Rotation (0-360)
     */
    /**
     * Rotation of the element in degrees. (0-360)
     *
     * @param {number}  value  Rotation (0-360)
     */
    rotation: number;
    /**
     * Rotates the element to certain `angle`.
     *
     * Set `rotation` property instead.
     *
     * @ignore Exclude from docs
     * @param {number} angle Rotation angle (0-360)
     */
    rotate(angle: number): void;
    /**
     * @return {Align} Horizontal align
     */
    /**
     * Controls horizontal alignment of the element.
     *
     * This is used by parent [[Container]] when layouting its children.
     *
     * @param {Align}  value  Horizontal align
     */
    align: Align;
    /**
     * @return {VerticalAlign} Vertical align
     */
    /**
     * Controls vertical alignment of the element.
     *
     * This is used by parent [[Container]] when layouting its children.
     *
     * @param {VerticalAlign}  value  Vertical align
     */
    valign: VerticalAlign;
    /**
     * @return {HorizontalCenter} Horizontal center
     */
    /**
     * Controls which part of the element to treat as a horizontal center.
     *
     * The setting will be used when positioning, resizing and rotating the
     * element.
     *
     * @param {HorizontalCenter}  value  Horizontal center
     */
    horizontalCenter: HorizontalCenter;
    /**
     * @return {VerticalCenter} Vertical center
     */
    /**
     * Controls which part of the element to treat as a vertical center.
     *
     * The setting will be used when positioning, resizing and rotating the
     * element.
     *
     * @param {VerticalCenter}  value  Vertical center
     */
    verticalCenter: VerticalCenter;
    /**
     * @return {number} Maximum width (px)
     */
    /**
     * ==========================================================================
     * DIMENSIONAL PROPERTIES AND RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Maximum allowed width for the element in pixels.
     *
     * @param {number}  value  Maximum width (px)
     */
    maxWidth: number;
    /**
     * @return {number} Maximum height (px)
     */
    /**
     * Maximum allowed height for the element in pixels.
     *
     * @param {number}  value  Maximum height (px)
     */
    maxHeight: number;
    /**
     * @return {Optional<number>} Minimum width (px)
     */
    /**
     * Minimum width of the element in pixels.
     *
     * Set to `undefined` to remove the limit.
     *
     * @param {Optional<number>}  value  Minimum width (px)
     */
    minWidth: Optional<number>;
    /**
     * @return {Optional<number>} Minimum height (px)
     */
    /**
     * Minimum height for the element in pixels.
     *
     * Set to `undefined` to remove the limit.
     *
     * @param {Optional<number>}  value  Minimum height (px)
     */
    minHeight: Optional<number>;
    /**
     * @return {number | Percent} Width (absolute or relative)
     */
    /**
     * Element's absolute or relative width.
     *
     * The width can either be absolute, set in numer pixels, or relative, set
     * in [[Percent]].
     *
     * Relative width will be calculated using closest measured ancestor
     * [[Container]].
     *
     * @param {number | Percent}  value  Width (numeric in pixels or relative)
     */
    width: number | Percent;
    /**
     * @return {number | Percent} height (absolute or relative)
     */
    /**
     * Element's absolute or relative height.
     *
     * The height can either be absolute, set in numer pixels, or relative, set
     * in [[Percent]].
     *
     * Relative height will be calculated using closest measured ancestor
     * [[Container]].
     *
     * @param {number | Percent}  value  Height (numeric in pixels or relative)
     */
    height: number | Percent;
    /**
     * Returns element's width in pixels, if width was set. For actual width use measuredWidth property.
     *
     * @readonly
     * @return {number} Width (px)
     */
    readonly pixelWidth: number;
    /**
     * Returns element's height in pixels. For actual height use measuredHeight property.
     *
     * @readonly
     * @return {number} Height (px)
     */
    readonly pixelHeight: number;
    /**
     * @return {$type.Optional<number>} Relative width
     * @ignore
     */
    /**
     * Element's relative width in [[Percent]].
     * @ignore
     *
     * @param {$type.Optional<number>}  value  Relative width
     */
    relativeWidth: $type.Optional<number>;
    /**
     * @return {$type.Optional<number>} Relative height
     * @ignore
     */
    /**
     * Element's relative height in [[Percent]].
     *
     * @param {$type.Optional<number>}  value  Relative height
     * @ignore
     */
    relativeHeight: $type.Optional<number>;
    /**
     * Returns element's measured width in pixels.
     *
     * A measured width is actual width of contents plus `paddingRight` and* `paddingLeft`, relative to sprite parent, meaning that
     * rotation and scale is taken into account.
     *
     * @readonly
     * @return {number} Width (px)
     */
    readonly measuredWidth: number;
    /**
     * Returns elements's measured height in pixels.
     *
     * A measured height is actual height of contents plus `paddingTop` and `paddingBottom`, relative to sprite parent, meaning that
     * rotation and scale taken into account.
     *
     * @readonly
     * @return {number} Height (px)
     */
    readonly measuredHeight: number;
    /**
     * Returns element's measured width plus its left and right margins in
     * pixels.
     *
     * @readonly
     * @return {number} Outer width (px)
     */
    readonly outerWidth: number;
    /**
     * Returns element's measured height plus its top and bottom margins in
     * pixels.
     *
     * @readonly
     * @return {number} Outer height (px)
     */
    readonly outerHeight: number;
    /**
     * Returns element's measured inner width in pixels.
     *
     * Inner width is actual available space for content, e.g. element's width
     * minus horizontal padding.
     *
     * @readonly
     * @return {number} Inner width (px)
     */
    readonly innerWidth: number;
    /**
     * Returns element's measured inner height in pixels.
     *
     * Inner height is actual available space for content, e.g. element's height
     * minus vertical padding.
     *
     * @readonly
     * @return {number} Inner height (px)
     */
    readonly innerHeight: number;
    /**
     * Returns element's current "global" scale.
     *
     * Scale values accumulate over hierarchy of elements.
     *
     * E.g. if a [[Container]] has `scale = 2` and it's child has a `scale = 2`,
     * the child's `globalScale` will be 4. (a multitude of `2 x 2`)
     *
     * @readonly
     * @return {number} Global scale
     */
    readonly globalScale: number;
    /**
     * @return {number} Scale (0-1)
     */
    /**
     * Scale of the element.
     *
     * The scale is set from 0 (element reduced to nothing) to 1 (default size).
     * * 2 will mean element is increased twice.
     * * 0.5 - reduced by 50%.
     *
     * Etc.
     *
     * @param {number}  value  Scale (0-1)
     */
    scale: number;
    /**
     * Sets all four margins for the element at once.
     *
     * Margins are set in pixels.
     *
     * @param  {number}  top     Top margin
     * @param  {number}  right   Right margin
     * @param  {number}  bottom  Bottom margin
     * @param  {number}  left    Left margin
     * @return {Sprite}          Current element
     */
    margin(top: number, right: number, bottom: number, left: number): Sprite;
    /**
     * @return {number | Percent} Margin value
     */
    /**
     * Left margin - absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Margin value
     */
    marginLeft: number | Percent;
    /**
     * @return {number | Percent} Margin value
     */
    /**
     * Right margin - absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Margin value
     */
    marginRight: number | Percent;
    /**
     * @return {number | Percent} Margin value
     */
    /**
     * Top margin - absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Margin value
     */
    marginTop: number | Percent;
    /**
     * @return {number | Percent} Margin value
     */
    /**
     * Bottom margin - absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Margin value
     */
    marginBottom: number | Percent;
    /**
     * Returns current right margin in pixels.
     *
     * @readonly
     * @return {number} Right margin (px)
     */
    readonly pixelMarginRight: number;
    /**
     * Returns current relative right margin.
     *
     * @readonly
     * @return {number} Relative right margin
     */
    readonly relativeMarginRight: number;
    /**
     * Returns current left margin in pixels.
     *
     * @readonly
     * @return {number} Left margin (px)
     */
    readonly pixelMarginLeft: number;
    /**
     * Returns current relative left margin.
     *
     * @readonly
     * @return {number} Relative left margin
     */
    readonly relativeMarginLeft: number;
    /**
     * Returns current top margin in pixels.
     *
     * @readonly
     * @return {number} Top margin (px)
     */
    readonly pixelMarginTop: number;
    /**
     * Returns current relative top margin.
     *
     * @readonly
     * @return {number} Relative top margin
     */
    readonly relativeMarginTop: number;
    /**
     * Returns current bottom margin in pixels.
     *
     * @readonly
     * @return {number} Bottom margin (px)
     */
    readonly pixelMarginBottom: number;
    /**
     * Returns current relative bottom margin.
     *
     * @readonly
     * @return {number} Relative bottom margin
     */
    readonly relativeMarginBottom: number;
    /**
     * Sets padding for the element in pixels.
     *
     * @param  {number}  top     Top padding (px)
     * @param  {number}  right   Right padding (px)
     * @param  {number}  bottom  Bottom padding (px)
     * @param  {number}  left    Left padding (px)
     * @return {Sprite}          Element
     */
    padding(top: number, right: number, bottom: number, left: number): Sprite;
    /**
     * @return {number | Percent} Padding value
     */
    /**
     * Left padding - absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Padding value
     */
    paddingLeft: number | Percent;
    /**
     * @return {number | Percent} Padding value
     */
    /**
     * Right padding - absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Padding value
     */
    paddingRight: number | Percent;
    /**
     * @return {number | Percent} Padding value
     */
    /**
     * Top padding - absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Padding value
     */
    paddingTop: number | Percent;
    /**
     * @return {number | Percent} Padding value
     */
    /**
     * Bottom padding - absolute (px) or relative ([[Percent]]).
     *
     * @param {number | Percent}  value  Padding value
     */
    paddingBottom: number | Percent;
    /**
     * Returns current right padding in pixels.
     *
     * @readonly
     * @return {number} Right padding (px)
     */
    readonly pixelPaddingRight: number;
    /**
     * Returns current relative right padding.
     *
     * @readonly
     * @return {number} Relative right padding
     */
    readonly relativePaddingRight: number;
    /**
     * Returns current left padding in pixels.
     *
     * @readonly
     * @return {number} Left padding (px)
     */
    readonly pixelPaddingLeft: number;
    /**
     * Returns current relative left padding.
     *
     * @readonly
     * @return {number} Relative left padding
     */
    readonly relativePaddingLeft: number;
    /**
     * Returns current top padding in pixels.
     *
     * @readonly
     * @return {number} Top padding (px)
     */
    readonly pixelPaddingTop: number;
    /**
     * Returns current relative top padding.
     *
     * @readonly
     * @return {number} Relative top padding
     */
    readonly relativePaddingTop: number;
    /**
     * Returns current bottom padding in pixels.
     *
     * @readonly
     * @return {number} Bottom padding (px)
     */
    readonly pixelPaddingBottom: number;
    /**
     * Returns current relative bottom padding.
     *
     * @readonly
     * @return {number} Relative bottom padding
     */
    readonly relativePaddingBottom: number;
    /**
     * @return {ColorModifier} Fill color modifier
     */
    /**
     * ==========================================================================
     * APPEARANCE-RELATED PROPERTIES AND RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * [[ColorModifier]] that can be used to modify color and pattern of the
     * element's fill, e.g. create gradients.
     *
     * @param {ColorModifier}  value  Fill color modifiier
     */
    fillModifier: ColorModifier;
    /**
     * @return {ColorModifier} Stroke color modifier
     */
    /**
     * [[ColorModifier]] that can be used to modify color and pattern of the
     * element's stroke (outline), e.g. create gradients.
     *
     * @param {ColorModifier}  value  Stroke color modifier
     */
    strokeModifier: ColorModifier;
    /**
     * @return {number} Opacity (0-9)
     */
    /**
     * Element's fill opacity.
     *
     * Opacity ranges from 0 (fully transparent) to 1 (fully opaque).
     *
     * @param {number}  value  Opacity (0-1)
     */
    fillOpacity: number;
    /**
     * @return {Color} Fill
     */
    /**
     * Element's fill color or pattern.
     *
     * @param {Optional<Color | Pattern | LinearGradient | RadialGradient>}  value  Fill
     */
    fill: $type.Optional<Color | Pattern | LinearGradient | RadialGradient>;
    /**
     * Sets actual `fill` property on the SVG element, including applicable color
     * modifiers.
     *
     * @ignore Exclude from docs
     * @param {Optional<Color | Pattern | LinearGradient | RadialGradient>}  value  Fill
     */
    protected setFill(value: $type.Optional<Color | Pattern | LinearGradient | RadialGradient>): void;
    /**
     * @return {number} Opacity (0-1)
     */
    /**
     * Element's opacity.
     *
     * Opacity setting can range from 0 (fully transparent) to 1 (fully opaque).
     *
     * ATTENTION: It is highly not recommended to use `opacity` directly on the
     * element. The charts use `opacity` to hide/show elements, so your setting
     * might be lost if element is hidden and then later shown.
     *
     * Instead use methods `hide()` and `show()` to completely toggle off and on
     * the element.
     *
     * Or, use properties `fillOpacity` and `strokeOpacity`, if you need to make
     * the element semi-transparent.
     *
     * @param {number} value Opacity (0-1)
     */
    opacity: number;
    /**
     * @return {Color} Stroke setting
     */
    /**
     * Element's stroke (outline) color or pattern.
     *
     * @param {Color | Pattern | LinearGradient | RadialGradient}  value  Stroke setting
     */
    stroke: Color | Pattern | LinearGradient | RadialGradient;
    /**
     * Sets actual `stroke` property on the SVG element, including applicable
     * color modifiers.
     *
     * @ignore Exclude from docs
     * @param {Color | Pattern | LinearGradient | RadialGradient} value Stroke setting
     */
    protected setStroke(value: Color | Pattern | LinearGradient | RadialGradient): void;
    /**
     * @return {number} Opacity (0-1)
     */
    /**
     * Stroke (outline) opacity.
     *
     * The values may range from 0 (fully transparent) to 1 (fully opaque).
     *
     * @param {number}  value  Opacity (0-1)
     */
    strokeOpacity: number;
    /**
     * @return {boolean} Do not scale stroke (outline)
     */
    /**
     * Controls if the element's stroke (outline) should remain keep constant
     * thicnkess and do not scale when the whole element is resized.
     *
     * @param {boolean}  value  Do not scale stroke (outline)
     */
    nonScalingStroke: boolean;
    /**
     * @return {boolean} Is element scaleable?
     */
    /**
     * Controls if element should keep constant size and not scale even if there is
     * space available, or it does not fit.
     *
     * @param {boolean}  value  Is element scaleable?
     */
    nonScaling: boolean;
    /**
     * @return {number} Thickness (px)
     */
    /**
     * Stroke (outline) thickness in pixels.
     *
     * @param {number}  value  Thickness (px)
     */
    strokeWidth: number;
    /**
     * @return {string} `stroke-dasharray`
     */
    /**
     * A `stroke-dasharray` for the stroke (outline).
     *
     * "Dasharray" allows setting rules to make lines dashed, dotted, etc.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray} for more info on `stroke-dasharray`
     * @param {string}  value  `stroke-dasharray`
     */
    strokeDasharray: string;
    /**
     * @return {ShapeRendering} 'shape-rendering' value
     */
    /**
     * An SVG-specific `shape-rendering` value.
     *
     * `shape-rendering` controls how vector graphics are drawn and rendered.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering} for more information about `shape-rendering`
     * @default "auto"
     * @param {ShapeRendering}  value  'shape-rendering' value
     */
    shapeRendering: ShapeRendering;
    /**
     * @return {boolean} Use pixel perfect?
     */
    /**
     * Controls if SVG vectors should be drawn with "pixel" precision, producing
     * perfectly crisp lines on retina displays.
     *
     * Setting this to `true` might improve visual quality, but may have a
     * negative effect on performance.
     *
     * Different elements use different default setting for `pixelPerfect`.
     *
     * We recommend leaving this at their default settings, unless there's a
     * specific need.
     *
     * @param {boolean}  value  Use pixel perfect?
     */
    pixelPerfect: boolean;
    /**
     * @return {boolean} RTL?
     */
    /**
     * An RTL (righ-to-left) setting.
     *
     * RTL may affect alignment, text, and other visual properties.
     *
     * @param {DateFormatter}  value  `true` for to use RTL
     */
    rtl: boolean;
    /**
     * ==========================================================================
     * VISIBILITY AND ORDER PROPERTIES AND RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Reveals (fades in) hidden element.
     *
     * Has no effect if element is already visible.
     *
     * If `duration` is not specified, it will use default.
     *
     * @param  {number}  duration  Fade in duration (ms)
     * @return {Optional<Animation>} Animation object if such object was created
     */
    show(duration?: number): $type.Optional<Animation>;
    /**
     * Performs actual operations to reveal this element.
     *
     * @ignore Exclude from docs
     * @param  {number} duration Fade in duration (ms)
     * @return {number}          Fade in duration (ms)
     */
    protected showReal(duration?: number): $type.Optional<Animation>;
    /**
     * Initiates hiding of Sprite.
     * When called it will fade out the the Sprite to transparency, then make it
     * invisible.
     * @param {number} duration Duration in millisecons
     */
    /**
     * Hides (fades out) the element, and applies `hidden` state.
     *
     * Has no effect if element is already hidden.
     *
     * If `duration` is not specified, it will use default.
     *
     * While element is fading out, its `isHiding` property will resolve to
     * `true`.
     *
     * When element is hidden, its `visible` property will resolve to `false`.
     *
     * @param  {number}  duration  Fade out duration (ms)
     * @return {Optional<Animation>} hide Animation object if such object was created
     */
    hide(duration?: number): $type.Optional<Animation>;
    /**
     * Hides actual SVG elements and handles hiding animations.
     *
     * @param  {number}  duration  Fade out duration (ms)
     * @return {Animation}            Fade out duration (ms)
     * @ignore
     */
    protected hideReal(duration?: number): $type.Optional<Animation>;
    /**
     * Returns current visibility of the element.
     *
     * @return {boolean} Visible?
     */
    /**
     * Sets visibility of the element.
     *
     * @param {boolean} value Visible?
     */
    visible: boolean;
    /**
     * Sets `visibility` property:
     *
     * * `true` - visible
     * * `false` - hidden
     *
     * @param  {boolean}  value  `true` - visible, `false` - hidden
     * @return {string}          Current visibility
     */
    setVisibility(value: boolean): void;
    /**
     * @return {number} zIndex
     */
    /**
     * A "zIndex" of the element.
     *
     * "zIndex" determines the order of how elements are placed over each other.
     *
     * Higher "zIndex" will mean the element will be draw on top of elements
     * with lower "zIndexes".
     *
     * @param {number}  value  zIndex
     */
    zIndex: number;
    /**
     * Moves the element to the very top in element order, so that it appears
     * in front of other elements.
     */
    toFront(): void;
    /**
     * Moves the element to the very bottom in the element order, so that it
     * appears behind other elements.
     */
    toBack(): void;
    /**
     * @return {Optional<Tooltip>} Tooltip
     */
    /**
     * ==========================================================================
     * TOOLTIP-RELATED PROPERTIES STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * A [[Tooltip]] object to be used when displayed rollover information for
     * the element.
     *
     * @param {Tooltip}  tooltip  Tooltip
     */
    tooltip: $type.Optional<Tooltip>;
    /**
     * @return {DataItem} Tooltip data item
     */
    /**
     * A [[DataItem]] to use when populating content for the element's
     * [[Tooltip]].
     *
     * @see {@link Tooltip}
     * @see {@link DataItem}
     * @param {DataItem}  value  Tooltip data item
     */
    tooltipDataItem: DataItem;
    /**
     * @return {Optional<Sprite>} Tooltip color source
     */
    /**
     * A [[Sprite]] or sprite template to use when getting colors for tooltip. If a template is set,
     * tooltip will look for a clone in tooltipDataItem.sprites. If no clone is found, then template colors will be used.
     *
     * @see {@link Tooltip}
     * @see {@link Sprite}
     * @param {Optional<Sprite>}  sprite Sprite
     */
    tooltipColorSource: $type.Optional<Sprite>;
    /**
     * Shows the element's [[Tooltip]].
     *
     * A tooltip will be populated using text templates in either `tooltipHTML`
     * or `tooltipText` as well as data in `tooltipDataItem`.
     *
     * @see {@link Tooltip}
     * @return {boolean} returns true if the tooltip was shown and false if it wasn't (no text was found)
     * @param {point} optional point (sprite-related) to which tooltip must point.
     */
    showTooltip(point?: IPoint): boolean;
    /**
     * Sets the point the [[Tooltip]] should point to.
     *
     * @param {IPoint}   point      Coordinates to point to
     * @param {boolean}  instantly  Move instantly without animation
     */
    protected pointTooltipTo(point: IPoint, instantly?: boolean): void;
    /**
     * Hides element's [[Tooltip]].
     *
     * @see {@link Tooltip}
     */
    hideTooltip(duration?: number): void;
    /**
     * @return {string} Tooltip HTML content template
     */
    /**
     * An HTML template to be used to populate [[Tooltip]] contents.
     *
     * If element has `tooltipDataItem` or `dataItem` set, this will be parsed
     * for any data values to be replaced with the values from respective data
     * items.
     *
     * @param {string} value Tooltip HTML content template
     */
    tooltipHTML: string;
    /**
     * @return {string} Tooltip content template
     */
    /**
     * A text template to be used to populate Tooltip's contents.
     *
     * If element has `tooltipDataItem` or `dataItem` set, this will be parsed
     * for any data values to be replaced with the values from respective data
     * items.
     *
     * This template will also be parsed for any special formatting tags.
     *
     * @param {string} value Tooltip content template
     * @see {@link TextFormatter}
     */
    tooltipText: string;
    /**
     * @ignore Exclude from docs
     * @return {Optional<Container>} Container
     */
    /**
     * A container reference that should be used to place element's
     * [[Tooltip]] in.
     *
     * Will use parent's container if does not have one set.
     *
     * @ignore Exclude from docs
     * @param {Container} value Container
     * @todo Dispose of the old _tooltipContainer ?
     */
    tooltipContainer: $type.Optional<Container>;
    /**
     * @ignore Exclude from docs
     * @return {number} Tooltip X (px)
     */
    /**
     * X coordinate the [[Tooltip]] should be shown at.
     *
     * @ignore Exclude from docs
     * @param {number}  value  Tooltip X (px)
     */
    tooltipX: number;
    /**
     * @type {"fixed" | "pointer"} Position
     */
    /**
     * Specifies if [[Tooltip]] should follow the mouse or touch pointer or stay
     * at the fixed position.
     *
     * @param { "fixed" | "pointer" }  value  Position
     */
    tooltipPosition: "fixed" | "pointer";
    /**
     * @ignore Exclude from docs
     * @return {number} Tooltip Y (px)
     */
    /**
     * Y coordinate the [[Tooltip]] should be shown at.
     *
     * @ignore Exclude from docs
     * @param {number}  value  Tooltip Y (px)
     */
    tooltipY: number;
    /**
     * Returns Tooltip X coordinate if it's set, or middle of the element.
     *
     * @ignore Exclude from docs
     * @return {number} X (px)
     */
    protected getTooltipX(): number;
    /**
     * Returns Tooltip Y coordinate if it's set, or middle of the element.
     *
     * @ignore Exclude from docs
     * @return {number} Y (px)
     */
    protected getTooltipY(): number;
    /**
     * Displays a modal or console message with error, and halts any further
     * processing of this item.
     *
     * @ignore Exclude from docs
     * @param {Error} e Error
     * @todo Implement from applying further actions to this item
     */
    raiseCriticalError(e: Error): void;
    /**
 * Processes JSON-based config before it is applied to the object.
 *
 * @ignore Exclude from docs
 * @param {object}  config  Config
 */
    processConfig(config?: {
        [index: string]: any;
    }): void;
    /**
     * This function is used to sort element's JSON config properties, so that
     * some properties that absolutely need to be processed last, can be put at
     * the end.
     *
     * @ignore Exclude from docs
     * @param  {string}  a  Element 1
     * @param  {string}  b  Element 2
     * @return {Ordering}   Sorting number
     */
    protected configOrder(a: string, b: string): Ordering;
    /**
     * If `sprite.hide()` is called, we set isHidden to true when sprite is hidden.
     * This was added becaus hidden state might have visibility set to true and so
     * there would not be possible to find out if a sprite is technically hidden or not.
     *
     * @type {boolean}
     */
    readonly isHidden: boolean;
}
