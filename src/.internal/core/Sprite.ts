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
import { Dictionary, IDictionaryEvents, DictionaryTemplate, DictionaryDisposer } from "./utils/Dictionary";
import { ListTemplate, ListDisposer, List } from "./utils/List";
import { EventDispatcher } from "./utils/EventDispatcher";
import { MultiDisposer, IDisposer, Disposer, MutableValueDisposer } from "./utils/Disposer";
import { Animation, IAnimatable, IAnimationOptions, AnimationDisposer } from "./utils/Animation";
import { Optional } from "./utils/Type";
import { Group } from "./rendering/Group";
import { Paper, getGhostPaper } from "./rendering/Paper";
import { DataItem } from "./DataItem";
import { Container } from "./Container";
import { Pattern } from "./rendering/fills/Pattern";
import { LinearGradient } from "./rendering/fills/LinearGradient";
import { RadialGradient } from "./rendering/fills/RadialGradient";
import { SVGContainer } from "./rendering/SVGContainer";
import { Align } from "./defs/Align";
import { Roles, AriaLive } from "./defs/Accessibility";
import { IPlugin } from "./utils/Plugin";
import { Popup } from "./elements/Popup";
import { Modal } from "./elements/Modal";
import { Color, color, toColor } from "./utils/Color";
import { Ordering } from "./utils/Order";

import { HorizontalCenter } from "./defs/HorizontalCenter";
import { VerticalCenter } from "./defs/VerticalCenter";
import { VerticalAlign } from "./defs/VerticalAlign";
import { ShapeRendering } from "./defs/ShapeRendering";
import { AMElement } from "./rendering/AMElement";
import { Filter } from "./rendering/filters/Filter";

import { ColorModifier } from "./rendering/fills/ColorModifier";

import { getInteraction } from "./interaction/Interaction";
import { InteractionObject } from "./interaction/InteractionObject";

import { IInertiaOptions, ISwipeOptions, IHitOptions, IHoverOptions, ICursorOptions, IKeyboardOptions, IMouseOptions } from "./interaction/InteractionOptions";
import { IPointer } from "./interaction/Pointer";
import { MouseCursorStyle } from "./interaction/Mouse";
import { InertiaTypes } from "./interaction/Inertia";
import { IStyleProperty } from "./defs/IStyleProperty";

import { options } from "./Options";
import { registry } from "./Registry";
import { IPoint } from "./defs/IPoint";
import { IRectangle } from "./defs/IRectangle";
import { Tooltip } from "./elements/Tooltip";

import { NumberFormatter } from "./formatters/NumberFormatter";
import { DateFormatter } from "./formatters/DateFormatter";
import { DurationFormatter } from "./formatters/DurationFormatter";
import { getTextFormatter } from "./formatters/TextFormatter";
import { Language } from "./utils/Language";
import { Export } from "./export/Export";
import { AmChartsLogo } from "./elements/AmChartsLogo";


import { ISVGAttribute } from "./rendering/AMElement";

import * as $utils from "./utils/Utils";
import * as $math from "./utils/Math";
import * as $strings from "./utils/Strings";
import * as $array from "./utils/Array";
import * as $object from "./utils/Object";
import * as $type from "./utils/Type";
import * as $iter from "./utils/Iterator";

import { system } from "./System";

import { Percent, percent } from "./utils/Percent";


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
	width?: number | Percent;
	height?: number | Percent;
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
	strokeDasharray?: string;
	strokeDashoffset?: number;
	strokeLinecap?: "butt" | "square" | "round";
	strokeLinejoin?: "miter" | "round" | "bevel";
	shapeRendering?: ShapeRendering;
	draggable?: boolean;
	inert?: boolean;
	resizable?: boolean;
	swipeable?: boolean;
	trackable?: boolean;
	hoverable?: boolean;
	clickable?: boolean;
	togglable?: boolean;
	wheelable?: boolean;
	focusable?: boolean;
	tabindex?: number;
	contextMenuDisabled?: boolean;
	visible?: boolean;
	tooltipText?: string;
	tooltipHTML?: string;
	tooltipX?: number | Percent;
	tooltipY?: number | Percent;
	alwaysShowTooltip?: boolean;
	tooltipPosition?: "fixed" | "pointer";
	showTooltipOn?: "hover" | "hit" | "always";
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
	role?: Roles;
	readerDescribedBy?: string;
	readerLabelledBy?: string;
	readerLive?: AriaLive;
	readerControls?: string;
	readerChecked?: boolean;
	readerHidden?: boolean;
	readerDescription?: string;
	readerTitle?: string;
	readerOrientation?: string;
	readerValueNow?: string;
	readerValueText?: string;
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
	path?: string;
	urlTarget?: string;
	url?: string;
	hidden?: boolean;
	showOnInit?: boolean;
	id?: string;
	isActive?: boolean;
	isHover?: boolean;
}

/**
 * Defines animation options
 */
export interface ISpriteAnimationOptions {
	from?: Percent | Color | number | string;
	to: Percent | Color | number | string;
	property: any; // todo: this["_properties"] can not be used here, think.
}

/**
 * Defines list ofvisual properties
 */
export const visualProperties: (keyof ISpriteProperties)[] = ["fill", "fillOpacity", "stroke", "strokeOpacity", "strokeWidth", "strokeDasharray", "strokeDashoffset", "strokeLinecap", "strokeLinejoin"]; // do not add opacity here, as it is used for showing/hiding

/**
 * Represents a list of available adapters for [[Sprite]]
 */
export interface ISpriteAdapters extends ISpriteProperties {

	pixelHeight: number;
	pixelWidth: number;
	relativeHeight: number
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
	populateString: string;

	inertiaOptions: Dictionary<InertiaTypes, IInertiaOptions>;
	hitOptions: IHitOptions;
	hoverOptions: IHoverOptions;
	swipeOptions: ISwipeOptions;
	keyboardOptions: IKeyboardOptions;
	mouseOptions: IMouseOptions;
	cursorOptions: ICursorOptions;
	criticalError: Error;
};

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
export class Sprite extends BaseObjectEvents implements IAnimatable {

	/**
	 * Defines property types.
	 */
	public _properties!: ISpriteProperties;

	/**
	 * Defines state type.
	 *
	 * @ignore Exclude from docs
	 */
	//public _state: SpriteState;

	/**
	 * Defines type used in the Sprite.
	 */
	public _adapter!: ISpriteAdapters;

	/**
	 * Holds values for Sprite's properties.
	 */
	public properties: this["_properties"] = {};

	/**
	 * Defines available events.
	 */
	public _events!: ISpriteEvents;

	/**
	 * @ignore
	 */
	public _eventDispatcher: SpriteEventDispatcher<AMEvent<this, this["_events"]>> = new SpriteEventDispatcher(this);

	/**
	 * Event dispatcher.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/event-listeners/} for more info about Events
	 */
	public get events(): SpriteEventDispatcher<AMEvent<this, this["_events"]>> {
		return this._eventDispatcher;
	}

	/**
	 * @ignore
	 */
	public _adapterO: Adapter<this, this["_adapter"]>;

	/**
	 * Holds Adapter.
	 *
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/adapters/} for more info about Adapters
	 */
	public get adapter(): Adapter<this, this["_adapter"]> {
		if (!this._adapterO) {
			this._adapterO = new Adapter<this, this["_adapter"]>(this);
		}
		return this._adapterO;
	}

	/**
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	private _bindings: { [key: string]: IDisposer } = {};

	/**
	 * Holds indicator if this Sprite is a "template" to be used for creating
	 * other Sprites from and should not be treated as full-fledged element.
	 *
	 * @ignore Exclude from docs
	 */
	protected _isTemplate: boolean = false;

	protected _isPath: boolean = false;

	/**
	 * Holds collection of Sprite States.
	 */
	public _states: $type.Optional<DictionaryTemplate<string, SpriteState<this["_properties"], this["_adapter"]>>>;

	/**
	 * Holds indicator whether this sprite was already initialized.
	 *
	 * @ignore Exclude from docs
	 */
	protected _inited: boolean = false;

	/**
	 * Holds indicator whether this sprite was already initialized and ready.
	 *
	 * @ignore Exclude from docs
	 */
	protected _ready: boolean = false;

	/**
	 * A reference to a Tooltip for this Sprite.
	 *
	 * @ignore Exclude from docs
	 */
	protected _tooltip: $type.Optional<Tooltip>;

	/**
	 * A special data item which tooltip will use when formatting data. In case
	 * it is not set, dataItem will be used.
	 *
	 * @ignore Exclude from docs
	 */
	protected _tooltipDataItem: $type.Optional<DataItem>;

	/**
	 * A reference to another sprite or sprite template from which tooltip should take colors if getFillFromObject or getStrokeFromObject are set to true.
	 * Mostly used when we need to adjust tooltip color for a series, depending on column or bullet color.
	 *
	 * @ignore Exclude from docs
	 */
	protected _tooltipColorSource: $type.Optional<Sprite>;

	/**
	 * If `sprite.hide()` is called and we have "hidden" state and
	 * `transitionDuration > 0`, we set `isHiding` flag to `true` in order to
	 * avoid restarting animations in case `hide()` method is called multiple
	 * times.
	 */
	public isHiding: boolean = false;

	/**
	 * If `sprite.hide()` is called, we set isHidden to true when sprite is hidden.
	 * This was added becaus hidden state might have visibility set to true and so
	 * there would not be possible to find out if a sprite is technically hidden or not.
	 */
	protected _isHidden: boolean = false;

	/**
	 * This property indicates if Sprite is currently being revealed from hidden
	 * state. This is used to prevent multiple calls to `sprite.show()` to
	 * restart reveal animation. (if enabled)
	 */
	public isShowing: boolean = false;

	/**
	 * Indicates if this element is a standalone instance. A "standalone
	 * instance" means this is a autonomous object which maintains its own
	 * set of controls like Preloader, Export, etc.
	 *
	 * @ignore Exclude from docs
	 */
	public isStandaloneInstance: boolean = false;

	/**
	 * Indicates if togglable Sprite is currently active (toggled on).
	 *
	 * @ignore Exclude from docs
	 */
	protected _isActive: boolean = false;

	/**
	 * A Sprite element to use as a mask for this Sprite.
	 *
	 * @ignore Exclude from docs
	 */
	protected _mask = new MutableValueDisposer<Sprite>();

	/**
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected _clipPath: Optional<Group>;

	/**
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected _clipElement: $type.Optional<AMElement>;

	/**
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected _positionPrecision: number = 3;

	/**
	 * Holds reference to Sprite's [[InteractionObject]]. Sprite does not
	 * perform any user interactions directly, it happens via [[InteractionObject]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _interaction: $type.Optional<InteractionObject>;

	/**
	 * An instance of [[Language]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _language = new MutableValueDisposer<Language>();

	/**
	 * An instance of [[NumberFormatter]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _numberFormatter: $type.Optional<NumberFormatter>;

	/**
	 * An instance of [[DateFormatter]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _dateFormatter: $type.Optional<DateFormatter>;

	/**
	 * An instance of [[DurationFormatter]].
	 *
	 * @ignore Exclude from docs
	 */
	protected _durationFormatter: $type.Optional<DurationFormatter>;

	/**
	 * An HTML element to which [[svgContainer]] is added.
	 *
	 * @ignore Exclude from docs
	 */
	protected _htmlContainer: $type.Optional<HTMLElement>;

	/**
	 * An HTML element to which all chart elements are added.
	 *
	 * @ignore Exclude from docs
	 */
	protected _svgContainer: $type.Optional<SVGContainer>;

	/**
	 * A [[Container]] instance to place this element's [[Tooltip]] elements in
	 *
	 * @ignore Exclude from docs
	 */
	protected _tooltipContainer: $type.Optional<Container>;


	protected _urlDisposer: $type.Optional<IDisposer>;

	/**
	 * Should this element be measured when measuring its parent container's
	 * dimentions?
	 *
	 * @ignore Exclude from docs
	 */
	protected _isMeasured: $type.Optional<boolean>;

	/**
	 * Indicates if the chart should follow right-to-left rules.
	 *
	 * @ignore Exclude from docs
	 */
	protected _rtl: boolean;

	/**
	 * Holds [[Export]] object.
	 *
	 * @ignore Exclude from docs
	 */
	protected _exporting = new MutableValueDisposer<Export>();

	/**
	 * Should this Sprite be included when exporting?
	 */
	protected _exportable: boolean = true;

	/**
	 * A reference to a top-level SVG node for this Sprite element.
	 *
	 * @ignore Exclude from docs
	 */
	protected _element: Optional<AMElement>;

	/**
	 * Holds Sprite's main SVG group (`<g>`) element. Other Sprite's elements
	 * are all placed in this group.
	 */
	public group: Group;

	/**
	 * A reference to [[Paper]] SVG renderer used to create SVG nodes.
	 *
	 * @ignore Exclude from docs
	 */
	protected _paper: $type.Optional<Paper>;

	/**
	 * Elements's top-level [[Container]].
	 *
	 * In most cases that will be a Chart.
	 *
	 * @return Top-level ascendant
	 */
	protected _topParent: Optional<Container>;

	/**
	 * Data item assigned to the sprite. It might contain information defining
	 * some style properties.
	 */
	public _dataItem: $type.Optional<DataItem>;

	/**
	 * Parent container.
	 *
	 * @ignore Exclude from docs
	 */
	protected _parent: Container;

	/**
	 * Sprite's "virtual" parent.
	 *
	 * @ignore Exclude from docs
	 */
	protected _virtualParent: Sprite;

	/**
	 * Defines bounding box (square) for this element.
	 *
	 * @ignore Exclude from docs
	 */
	protected _bbox: IRectangle = { x: 0, y: 0, width: 0, height: 0 };

	/**
	 * Base tab index for the Sprite. Used for TAB-key selection order.
	 *
	 * Use accessors `tabIndex` to set and retrieve.
	 *
	 * @ignore Exclude from docs
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
	 */
	protected _showSystemTooltip: $type.Optional<boolean>;

	/**
	 * List of animations currently playing for this Sprite.
	 *
	 * @ignore Exclude from docs
	 */
	protected _animations: $type.Optional<Array<Animation>>;

	/**
	 * A link to [[Disposer]] for event handler which is attached to hide
	 * animation. In some cases we need to cancel this event. This property is
	 * used to hold the reference to disposer of this event so that we can
	 * cancel it by calling its `dispose()` method.
	 *
	 * @ignore Exclude from docs
	 */
	protected _showHideDisposer: $type.Optional<IDisposer>;

	/**
	 * If element is currently hiding, this property will hold a reference to
	 * [[Animation]] instance, which is handling hiding animation.
	 *
	 * @ignore Exclude from docs
	 */
	protected _hideAnimation: $type.Optional<Animation>;

	/**
	 * List of [[Filter]] items that are currently applied to the element.
	 *
	 * @ignore Exclude from docs
	 */
	protected _filters: $type.Optional<List<Filter>>;

	/**
	 * A shortcut to the special "Focus" filter which is applied when the element
	 * gains focus.
	 *
	 * This is an accessibility feature.
	 *
	 * @ignore Exclude from docs
	 */
	protected _focusFilter: $type.Optional<Filter>;

	/**
	 * Indicates if this element is invalid and should be re-validated (redrawn).
	 *
	 * @ignore Exclude from docs
	 */
	public invalid: boolean = false;

	/**
	 * Indicates if this elements position is invalid and should be repositioned
	 *
	 * @ignore Exclude from docs
	 */
	public positionInvalid: boolean = false;

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
	 */
	public propertyFields: { [index in keyof this["_properties"]]?: string } = {};
	//public propertyFields: Dictionary<keyof this["_properties"], string> = new Dictionary<keyof this["_properties"], string>();

	/**
	 * Element's relative width.
	 *
	 * Do not set this property directly. Use `width` accessor with [[Percent]]
	 * value instead.
	 *
	 * @ignore Exclude from docs
	 */
	public percentWidth: $type.Optional<number>;

	/**
	 * Element's relative height.
	 *
	 * Do not set this property directly. Use `height` accessor with [[Percent]]
	 * value instead.
	 *
	 * @ignore Exclude from docs
	 */
	public percentHeight: $type.Optional<number>;

	/**
	 * An SVG group element that is used to put all SVG filters to.
	 *
	 * @ignore Exclude from docs
	 */
	public filterElement: $type.Optional<Group>;

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
	 */
	public configField: $type.Optional<string>;

	/**
	 * Reference to element's `<title>` element.
	 *
	 * @ignore Exclude from docs
	 */
	protected _titleElement: Optional<AMElement>;

	/**
	 * Reference to element's `<description>` element.
	 *
	 * @ignore Exclude from docs
	 */
	protected _descriptionElement: Optional<AMElement>;

	/**
	 * Specifies if property changes on this object should be propagated to the
	 * objects cloned from this object.
	 *
	 * This setting affects property changes *after* cloning, since at the moment
	 * of cloning all of properties from source object are copied to the clone
	 * anyway.
	 *
	 * @default false
	 */
	public applyOnClones: boolean = false;

	/**
	 * a reference to an object which should be used when populating string. used for tooltip label mostly.
	 * @ignore
	 */
	public populateStringFrom: any;

	/**
	 * Internal storage properties.
	 *
	 * @ignore Exclude from docs
	 */

	protected _measuredWidth: number;
	protected _measuredHeight: number;

	// unrotated unscaled
	protected _measuredWidthSelf: number = 0;
	protected _measuredHeightSelf: number = 0;

	protected _prevMeasuredWidth: number;
	protected _prevMeasuredHeight: number;

	protected _pixelWidth: $type.Optional<number>;
	protected _pixelHeight: $type.Optional<number>;

	protected _relativeWidth: $type.Optional<number>;
	protected _relativeHeight: $type.Optional<number>;

	// read only, sprite extreme coordinates
	/**
	 * @ignore
	 */
	public maxLeft: number = 0;
	/**
	 * @ignore
	 */
	public maxRight: number = 0;
	/**
	 * @ignore
	 */
	public maxTop: number = 0;
	/**
	 * @ignore
	 */
	public maxBottom: number = 0;

	// not rotated and not scaled
	/**
	 * @ignore
	 */
	public maxLeftSelf: number = 0;
	/**
	 * @ignore
	 */
	public maxRightSelf: number = 0;
	/**
	 * @ignore
	 */
	public maxTopSelf: number = 0;
	/**
	 * @ignore
	 */
	public maxBottomSelf: number = 0;

	protected _isDragged: boolean = false;

	protected _isResized: boolean = false;

	/**
	 * @deprecated Moved to [[SpriteProperties]]
	 */
	protected _disabled: boolean = false;

	protected _internalDisabled: boolean = false;

	protected _updateDisabled: boolean = false;

	protected _maskRectangle: $type.Optional<IRectangle>;

	protected _internalDefaultsApplied: boolean = false;

	protected _interactionDisposer: $type.Optional<IDisposer>;

	/**
	 * You can set bbox from outside if you know what size your element must be (used in radar chart for example)
	 * @ignore
	 */
	public definedBBox: IRectangle;

	/**
	 * Time in milliseconds after which rollout event happens when user rolls-out of the sprite. This helps to avoid flickering in some cases.
	 */
	public rollOutDelay: number = 0;

	/**
	 * @ignore
	 */
	protected _outTimeout: $type.Optional<IDisposer>;

	/**
	 * This flag is set to `true` for the initial sprite you create and place
	 * to the div so that we could clear all additional
	 * sprites/containers when this sprite is disposed.
	 *
	 * @ignore
	 */
	public isBaseSprite: boolean = false;

	/**
	 * Indicates whether this sprite should be cloned when cloning its parent
	 * container. We set this to `false` in those cases when a sprite is created
	 * by the class, so that when cloning a duplicate sprite would not appear.
	 */
	public shouldClone: boolean = true;

	/**
	 * A property which you can use to store any data you want.
	 */
	public dummyData: any;

	/**
	 * A reference to a real fill object. Sometimes might be useful to modify
	 * gradient (when fill is color but we have FillModifier).
	 */
	public realFill: Color | Pattern | LinearGradient | RadialGradient;

	/**
	 * A reference to a real stroke object. Sometimes might be useful to modify
	 * gradient (when fill is color but we have a FillModifier).
	 */
	public realStroke: Color | Pattern | LinearGradient | RadialGradient;

	/**
	 * A reference to amCharts logo element.
	 *
	 * @ignore
	 */
	public logo: AmChartsLogo;

	/**
	 * [_baseId description]
	 *
	 * @todo Description
	 */
	protected _baseId: string;

	/**
	 * A read-only flag which indicates if a sprite has completed its initial
	 * animation (if `showOnInit = true`).
	 *
	 * In case `showOnInit = false`, `appeared` is set to `true` on init.
	 *
	 * @readonly
	 */
	public appeared: boolean = false;

	/**
	 * [ex description]
	 *
	 * @todo Description
	 * @ignore
	 */
	public ex: number = 0;

	/**
	 * [ey description]
	 *
	 * @todo Description
	 * @ignore
	 */
	public ey: number = 0;

	/**
	 * [_showOnInitDisposer description]
	 *
	 * @todo Description
	 */
	protected _showOnInitDisposer: MultiDisposer;

	/**
	 * Holds the list of plugins attached to this Sprite.
	 */
	protected _plugins: $type.Optional<List<IPlugin>>;

	/**
	 * Indicates if the sprite can be moved around when resizing it with two fingers (will only work if draggable = false)
	 * @ignore
	 */
	public dragWhileResize: boolean = false;

	/**
	 * @ignore
	 */
	public vpDisposer: MultiDisposer;

	protected _alwaysShowDisposers: IDisposer[];

	/**
	 *  @ignore
	 */
	public measureFailed: boolean = false;

	/**
	 * If this flag is set to true, calling show() will not reveal the sprite.
	 * 
	 * @ignore
	 */
	public preventShow:boolean = false;

	/**
	 * Constructor:
	 * * Creates initial node
	 * * Sets default properties
	 * * Creates required default states
	 * * Inits accessibility
	 */
	constructor() {

		// Init
		super();

		this.className = "Sprite";

		this._disposers.push(this._eventDispatcher);

		// Generate a unique ID
		$utils.used(this.uid);

		// Create SVG group to hold everything in
		this.group = this.paper.addGroup("g");

		// Set defaults
		// it is better to set defauls like this in order to save invaliation calls and events
		this.setPropertyValue("scale", 1);
		this.setPropertyValue("rotation", 0);
		this.setPropertyValue("align", "none");
		this.setPropertyValue("valign", "none");
		this.setPropertyValue("pixelPerfect", false);
		this.setPropertyValue("visible", true);
		this.setPropertyValue("tooltipPosition", "fixed");
		this.setPropertyValue("verticalCenter", "none");
		this.setPropertyValue("horizontalCenter", "none");

		this.setPropertyValue("tooltipX", percent(50));
		this.setPropertyValue("tooltipX", percent(50));

		this.setPropertyValue("marginTop", 0);
		this.setPropertyValue("marginBottom", 0);
		this.setPropertyValue("marginLeft", 0);
		this.setPropertyValue("marginRight", 0);

		this.setPropertyValue("dx", 0);
		this.setPropertyValue("dy", 0);

		this.setPropertyValue("paddingTop", 0);
		this.setPropertyValue("paddingBottom", 0);
		this.setPropertyValue("paddingRight", 0);
		this.setPropertyValue("paddingLeft", 0);

		this.setPropertyValue("togglable", false);
		this.setPropertyValue("hidden", false);
		this.setPropertyValue("urlTarget", "_self");
		this.setPropertyValue("alwaysShowTooltip", false);
		this.setPropertyValue("showTooltipOn", "hover");

		this._prevMeasuredWidth = 0;
		this._prevMeasuredHeight = 0;
		this._measuredWidth = 0;
		this._measuredHeight = 0;

		this._isMeasured = true;

		// Invalidate the Sprite so that renderer knows it needs to be drawn
		this.invalidate();

		//this.states.create("default").properties.opacity = 1;

		// Apply the theme
		this.applyTheme();

		//this._disposers.push(this._clickable);

		// Decorate adapter with events so that we can apply its settings whenever
		// it is modified
		// @todo Think what to do here. We can't just apply the adapter value to
		// property since not all of those are for properties. Commented out for
		// now.
		/*this.adapter.events.on("inserted", (ev: any) => {
			(<any>this)[ev.newValue.key] = (<any>this)[ev.newValue.key];
		});
		this.adapter.events.on("removed", (ev: any) => {
			(<any>this)[ev.newValue.key] = (<any>this)[ev.newValue.key];
		});*/

		// Add disposable dependencies to `_disposers` so they are automatically
		// disposed of when this object is disposed
		this._disposers.push(this.events);
		this._disposers.push(this.group);
		this._disposers.push(this._mask);
		this._disposers.push(this._language);
		this._disposers.push(this._exporting);
		//this._disposers.push(this._parent);
		//this._disposers.push(this._modal);

		this._disposers.push(new Disposer(() => {
			$object.each(this._bindings, (key, value) => {
				value.dispose();
			});
		}));

		this.setPropertyValue("interactionsEnabled", true);
	}


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
	public applyTheme(): void {
		super.applyTheme();
		if (options.autoSetClassName) {
			this.setClassName();
		}
	}

	/**
	 * Returns theme(s) used by this object either set explicitly on this
	 * element, inherited from parent, or inherited from [[System]].
	 *
	 * @return An array of theme references
	 */
	public getCurrentThemes(): ITheme[] {
		const themes = this._themes;

		if (themes) {
			return themes;

		} else {
			const parent = this.parent;

			if (parent) {
				return parent.getCurrentThemes();

			} else {
				return registry.themes;
			}
		}
	}

	/**
	 * Called just before element's validation, this function allows setting
	 * defaults.
	 *
	 * @ignore Exclude from docs
	 */
	protected applyInternalDefaults(): void {

		// Nothing here, but extending classes might override this function
		// so that they can set their defaults
		this._internalDefaultsApplied = true;
	}

	/**
	 * Invalidates element.
	 *
	 * Object will be redrawn during the next update cycle.
	 *
	 * Please note that in most cases elements will auto-invalidate when needed. If
	 * everything works, DO NOT use this method. Use it only if some changes do
	 * not take otherwise.
	 */
	public invalidate(): void {
		if (this.disabled || this._isTemplate) {
			return;
		}
		// We no longer reset this on each invalidate, so that they are applied
		// only once, and do not overwrite user-defined settings
		//this._internalDefaultsApplied = false;

		if (!this.invalid) {
			this.invalid = true;
			registry.addToInvalidSprites(this);
			system.requestFrame();
		}
	}

	/**
	 * Validates element:
	 * * Triggers events
	 * * Redraws the element
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		this.dispatchImmediately("beforevalidated");

		// prevents from drawing if topparent is 0x0
		/*
		let topParent = this.topParent;

		if (topParent) {
			if (!topParent.maxWidth || !topParent.maxHeight) {
				this._disposers.push(topParent.events.once("maxsizechanged", this.invalidate, this));
			}
		}*/

		// Set internal defaults
		if (!this._internalDefaultsApplied) {
			this.applyInternalDefaults();
		}

		this.beforeDraw();
		this.draw();

		this.invalid = false;

		registry.removeFromInvalidSprites(this);
		this.afterDraw();
	}

	/**
	 * Invalidates element's position.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidatePosition(): void {
		if (this.disabled || this._isTemplate) {
			return;
		}
		if (!this.positionInvalid) {
			this.positionInvalid = true;
			registry.addToInvalidPositions(this);
			system.requestFrame();
		}
	}


	/**
	 * Transforms the element.
	 *
	 * @todo Description (review)
	 * @ignore Exclude from docs
	 */
	public validatePosition(): void {

		let pixelX = this.pixelX;
		let pixelY = this.pixelY;
		let dx = this.dx;
		let dy = this.dy;

		let x: number = pixelX + dx;
		let y: number = pixelY + dy;

		if (this._updateDisabled) {
			if (this._internalDisabled) {
				this.group.attr({ "display": "none" })
			}
			else {
				if (!this.disabled) {
					this.removeSVGAttribute("display");
				}
			}
			this._updateDisabled = false;
		}

		let sizeChanged: boolean = this.measure();

		//if (!this.invalid) {
		let prevGroupTransform: string = this.group.transformString;

		this.group.moveTo({ x: x, y: y });
		this.group.rotation = this.rotation;
		if (this.nonScaling) {
			this.group.scale = this.scale / this.globalScale;
		}
		else {
			this.group.scale = this.scale;
		}

		if (prevGroupTransform != this.group.transformString || sizeChanged) {
			// not yet sure, this is to avoid many transforms=>container layout invalidation on initial buid
			if (prevGroupTransform == null) {
				this.dispatch("transformed");
			}
			else {
				this.dispatchImmediately("transformed");
			}
			// TODO clear existing positionchanged dispatches ?
			this.dispatch("positionchanged");

			if (this.showTooltipOn == "hit" || this.showTooltipOn == "always") {
				this.updateTooltipPosition();
			}
		}
		//}

		// it might happen that x and y changed again, so we only remove if they didn't
		if (pixelX + dx == x && pixelY + dy == y) {
			registry.removeFromInvalidPositions(this);
			this.positionInvalid = false;
		}
		let maskRectangle = this._maskRectangle;
		// todo: verify this
		if (maskRectangle) {
			this._clipElement.moveTo({ x: maskRectangle.x - pixelX, y: maskRectangle.y - pixelY });
		}
	}

	/**
	 * A placeholder method that is called **before** element begins to be drawn.
	 *
	 * @ignore Exclude from docs
	 */
	protected beforeDraw(): void {

	}

	/**
	 * A placeholder method that draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	protected draw(): void {

	}

	/**
	 * A placeholder method that is called **after** element finishes drawing
	 * itself.
	 *
	 * @ignore Exclude from docs
	 */
	protected afterDraw(): void {
		if (this.isMeasured || this.horizontalCenter !== "none" || this.verticalCenter !== "none") {
			this.measureElement();
		}

		//this.applyMask();

		if (!this._inited) {
			if (this._adapterO) {
				// used to be applySVGAttrbutes here, this is more efficient
				for (let key of this._adapterO.keys()) {
					switch (key) {
						case "mask":
						case "fill":
						case "opacity":
						case "fillOpacity":
						case "stroke":
						case "strokeOpacity":
						case "strokeWidth":
						case "shapeRendering":
						case "strokeDasharray":
						case "strokeDashoffset":
						case "strokeLinecap":
						case "strokeLinejoin":
						case "textDecoration":
						case "fontSize":
						case "fontFamily":
						case "fontWeight":
							//case "focusable":
							//case "tabindex":
							//case "role":
							(<any>this)[key] = (<any>this)[key];
							break;
					}
				}
			}

			this.applyFilters();

			this.visible = this.visible;
			this.interactionsEnabled = this.getPropertyValue("interactionsEnabled"); // can't use .interactionsEnabled as it get's parent's

			this._inited = true;

			if (!this.showOnInit) {
				this.appeared = true;
			}

			if (this.hidden) {
				this.hide(0);
			}

			this.applyMask();
			this.dispatch("validated");
			this.dispatch("inited");
			this.dispatchReady();
		}
		else {
			this.dispatch("validated");
		}

		if (this.showTooltipOn == "always") {
			if (this.visible && !this.disabled && !this.__disabled) {
				this.showTooltip();
			}
			else {
				this.hideTooltip(0);
			}
		}
	}

	/**
	 * Dispatches `"ready"` event. Sprite dispatches it right after `"inited"` event.
	 *
	 * @ignore
	 */
	public dispatchReady(): void {
		if (!this.isReady()) {
			this._ready = true;
			this.dispatch("ready");
		}
	}


	/**
	 * Triggers a re-initialization of this element.
	 *
	 * Will result in complete redrawing of the element.
	 *
	 * @ignore Exclude from docs
	 */
	public reinit(): void {
		this._inited = false;
		this.setState(this.defaultState);
		this.invalidate();
	}

	/**
	 * Handles the situation where parent element is resized.
	 *
	 * @ignore Exclude from docs
	 */
	public handleGlobalScale(): void {
		this.dispatch("globalscalechanged");

		if (this.nonScalingStroke) {
			this.strokeWidth = this.strokeWidth;
		}

		if (this.nonScaling) {
			this.validatePosition();
		}

		this.updateFilterScale();
	}


	/**
	 * Updates filter properties which might depend on scale
	 *
	 * @ignore Exclude from docs
	 */
	protected updateFilterScale(): void {
		$iter.each(this.filters.iterator(), (filter) => {
			filter.scale = this.globalScale;
		});
	}

	/**
	 * Removes itself from system's invalid lists.
	 *
	 * @ignore Exclude from docs
	 */
	protected removeFromInvalids() {
		registry.removeFromInvalidSprites(this);
		registry.removeFromInvalidPositions(this);
	}

	/**
	 * Copies all parameters from another [[Sprite]].
	 *
	 * @param source Source Sprite
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);

		this.isMeasured = source.isMeasured;

		this.states.copyFrom(source.states);

		if (source.filters.length > 0) {
			source.filters.each((filter) => {
				this.filters.push(filter.clone());
			})
		}
		if (source._adapterO) {
			this.adapter.copyFrom(source._adapterO);
		}

		//helps to avoid calling getter which creates instance
		if ((<any>source)["_interaction"]) {
			this.interactions.copyFrom(source.interactions);
		}

		if ((<any>source)["_plugins"]) {
			this.plugins.copyFrom(source.plugins);
		}

		this.configField = source.configField;

		this.applyOnClones = source.applyOnClones;

		// this.numberFormatter = source.numberFormatter; // todo: this creates loose number formatter and copies it to all clones. somehow we need to know if source had numberFormatter explicitly created and not just because a getter was called.

		//this.mask = source.mask; need to think about this, generally this causes a lot of problems
		this.disabled = source.disabled;

		this.virtualParent = source.virtualParent;

		this.exportable = source.exportable;
		//@todo: create tooltip if it's on source but not on this?
		//const tooltip = this._tooltip;
		//if (tooltip) {
		//	tooltip.copyFrom(source.tooltip);
		//}

		if (source._tooltip) {
			if (this._tooltip) {
				this._tooltip.copyFrom(source.tooltip);
			}
			else {
				this.tooltip = source.tooltip.clone();
			}
		}

		//if ((<any>source)["_tooltip"] && !this._tooltip) {
		//	this._tooltip = (<any>source)["_tooltip"];
		//}

		this._showSystemTooltip = source.showSystemTooltip;

		$utils.copyProperties(source.propertyFields, this.propertyFields);
		$utils.copyProperties(source.properties, this);

		if (source.fillModifier) {
			this.fillModifier = source.fillModifier.clone();
		}

		if (source.strokeModifier) {
			this.strokeModifier = source.strokeModifier.clone();
		}
	}

	/**
	 * Destroys this object and all related data.
	 */
	public dispose(): void {
		if (!this.isDisposed()) {

			this.dispatchImmediately("beforedisposed");

			if (this.isBaseSprite) {
				if (this.htmlContainer) {
					while (this.htmlContainer.childNodes.length > 0) {
						this.htmlContainer.removeChild(this.htmlContainer.firstChild);
					}
				}

				this.isBaseSprite = false;
			}

			super.dispose();

			// Clear adapters
			if (this._adapterO) {
				this._adapterO.clear();
			}

			if (this.applyOnClones) {
				if (this._clones) {
					for (let i = this._clones.length - 1; i >= 0; i--) {
						let clone = this._clones.getIndex(i);
						clone.dispose();
					}
				}
			}

			if (this._svgContainer) {
				this._svgContainer.dispose();
			}

			if (this._interactionDisposer) {
				this._interactionDisposer.dispose();
				this._interactionDisposer = undefined;
			}

			if (this._urlDisposer) {
				this._urlDisposer.dispose();
			}

			this.removeFromInvalids();

			if (this.element) {
				this.element.dispose();
			}
			if (this.group) {
				this.group.dispose();
			}

			if (this._numberFormatter) {
				this._numberFormatter.dispose();
			}

			if (this._focusFilter) {
				this._focusFilter.dispose();
			}

			let stroke = this.stroke;
			if (stroke && !(stroke instanceof Color) && stroke.dispose) {
				if (this.clonedFrom && this.clonedFrom.stroke == stroke) {
					// do nothing
				}
				else {
					stroke.dispose();
				}
			}

			// TODO a bit hacky
			let fill = this.fill;
			if (fill && !(fill instanceof Color) && fill.dispose) {
				if (this.clonedFrom && this.clonedFrom.fill == fill) {
					// do nothing
				}
				else {
					fill.dispose();
				}
			}

			// remove from map
			if ($type.hasValue(this.id)) {
				this.map.removeKey(this.id);
			}

			this.parent = undefined;
			if (this._filters) {
				while (this._filters.length > 0) {
					let filter = <Filter>this._filters.getIndex(0);
					filter.dispose();
					this._filters.removeValue(filter);
				}
			}

			this._alwaysShowDisposers = undefined;
		}
	}

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
	 * @param value Is template?
	 */
	public set isTemplate(value: boolean) {
		value = $type.toBoolean(value);
		if (this._isTemplate != value) {
			this._isTemplate = value;

			if (this instanceof Container) {
				$iter.each(this.children.iterator(), (child) => {
					child.isTemplate = value;
				})
			}

			if (value) {
				this.parent = this.parent;
				this.removeFromInvalids();
			}
			else {
				this.invalidate();
			}
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Is template?
	 */
	public get isTemplate(): boolean {
		return this._isTemplate;
	}

	/**
	 * Indicates whether the element should attempt to construct itself in a way
	 * so that system tooltip is shown if its `readerTitle` is set.
	 *
	 * @param value Show system tooltip?
	 */
	public set showSystemTooltip(value: boolean) {
		value = $type.toBoolean(value);
		if (this._showSystemTooltip != value) {
			this._showSystemTooltip = value;
			this.applyAccessibility();
		}
	}

	/**
	 * @return Show system tooltip?
	 */
	public get showSystemTooltip(): boolean {
		if (!$type.hasValue(this._showSystemTooltip)) {
			if (this.virtualParent) {
				return this.virtualParent.showSystemTooltip;
			}
			else if (this.parent) {
				return this.parent.showSystemTooltip;
			}
			else {
				return false;
			}
		}
		return this._showSystemTooltip;
	}


	/**
	 * ==========================================================================
	 * HIERARCHY AND STRUCTURE RELATED STUFF
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Sprites's top-level [[Container]].
	 *
	 * Please note that in most cases it won't be the chart element.
	 *
	 * To access base chart element, use `baseSprite` instead.
	 *
	 * @return Top-level ascendant
	 */
	public get topParent(): Optional<Container> {
		if (this._topParent) {
			return this._topParent;
		}
		else {
			if (this.parent) {
				return this.parent.topParent;
			}
		}
	}

	/**
	 * @ignore
	 * @param value {Container} top parent of a sprite
	 */
	public set topParent(value: Container) {
		this._topParent = value;
	}

	/**
	 * Elements' parent [[Container]].
	 *
	 * @param parent  Parent container
	 */
	public set parent(parent: Optional<Container>) {
		if (this._isTemplate) {
			return;
		}

		// TODO is this needed ?
		$utils.used(this.paper);

		let oldParent = this._parent;
		if (oldParent != parent) {

			if (oldParent) {
				oldParent.children.removeValue(this);
			}

			this._parent = parent;

			if (parent) {

				this.topParent = parent.topParent;

				if (parent.isTemplate) {
					this.isTemplate = true;
				}

				this.baseId = parent.baseId;

				parent.children.push(this);
				// insert handler at Container invalidates +  invalidatesLayout + adds to group

				if (this._tooltip && !this._tooltipContainer) {
					this._tooltip.parent = parent.tooltipContainer;
				}

				if (!this._dataItem) {
					this.dataItem = parent.dataItem;
				}

				this.handleAlwaysShowTooltip();

				this.dispatchImmediately("parentset");
			}
			else {
				this.topParent = undefined;
			}
		}
	}

	/**
	 * @ignore
	 */
	protected handleAlwaysShow() {
		this.showTooltip();
	}

	/**
	 * @ignore
	 */
	protected handleAlwaysShowTooltip() {
		let sprite: Sprite = this;

		let oldDisposers = this._alwaysShowDisposers;
		if (oldDisposers) {
			$array.each(oldDisposers, (oldDisposer) => {
				oldDisposer.dispose();
			})
		}

		this._alwaysShowDisposers = [];

		if (this.showTooltipOn == "always") {
			while (sprite != undefined) {
				let disposer = sprite.events.on("visibilitychanged", this.handleAlwaysShow, this, false);
				this.addDisposer(disposer);
				this._alwaysShowDisposers.push(disposer);
				sprite = sprite.parent;
			}
		}
	}

	/**
	 * @return Parent container
	 */
	public get parent(): Optional<Container> {
		return this._parent;
	}

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
	 * @param value  Virtual parent
	 */
	public set virtualParent(value: Sprite) {
		this._virtualParent = value;
	}

	/**
	 * @return Virtual parent
	 */
	public get virtualParent(): Optional<Sprite> {
		return this._virtualParent;
	}

	/**
	 * Moves `<defs>` to correct place in DOM.
	 *
	 * Some elements are initially created in "ghost" container. When moving
	 * those into proper place in DOM, their respective `<defs>` need to be moved
	 * as well.
	 *
	 * @ignore Exclude from docs
	 */
	public appendDefs(): void {

		if (this.filterElement) {
			this.paper.appendDef(this.filterElement);
		}

		let fill = <any>this.fill;

		if (fill && fill.element) {
			this.paper.appendDef(fill.element);
		}

		let stroke = <any>this.stroke;
		if (stroke && stroke.element) {
			this.paper.appendDef(stroke.element);
		}

		if (this.fillModifier && this.fill instanceof Color) {
			let fill = <any>this.fillModifier.modify(this.fill);
			if (fill && fill.element) {
				this.paper.appendDef(fill.element);
			}
		}

		if (this.strokeModifier && this.stroke instanceof Color) {
			let stroke = <any>this.strokeModifier.modify(this.stroke);
			if (stroke && stroke.element) {
				this.paper.appendDef(stroke.element);
			}
		}

		if (this._clipPath) {
			this.paper.appendDef(this._clipPath);
		}

		if (this._exportable === false) {
			this.exportable = false;
		}
	}

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
	 * @return Map collection
	 */
	public get map(): Dictionary<string, any> {
		const top = this.topParent;

		if (top) {
			return top.map;
		} else if (!this._map) {
			this._map = new Dictionary<string, any>();
		}

		return this._map;
	}

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
	 * @param value ID
	 */
	public set id(value: string) {
		if (this._id != value) {
			this._id = value;
			if (this.map.hasKey(value)) {
				throw Error("Duplicate id (" + value + ") used on multiple objects.");
			}
			else {
				this.map.setKey(value, this);
			}
			if (options.autoSetClassName) {
				this.setClassName();
			}
		}
	}

	/**
	 * @return ID
	 */
	public get id(): string {
		return this._id;
	}


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
	 * @return DOM element
	 */
	public get dom(): SVGSVGElement {
		return this.group.node;
	}

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
	 * @param paper  Paper
	 */
	public set paper(paper: Paper) {
		this.setPaper(paper);
	}

	/**
	 * Sets [[Paper]] instance to use to draw elements.
	 * @ignore
	 * @param paper Paper
	 * @return true if paper was changed, false, if it's the same
	 */
	public setPaper(paper: Paper): boolean {
		let oldPaper = this._paper;

		if (oldPaper != paper) {
			this._paper = paper;

			this.appendDefs();
			return true;
		}
		return false;
	}

	/**
	 * @ignore Exclude from docs
	 * @return Paper
	 */
	public get paper(): Paper {
		if (this._paper) {
			return this._paper;
		}
		else {
			if (this.parent) {
				return this.parent.paper;
			}
		}

		return getGhostPaper();
	}

	/**
	 * An HTML element to be used when placing wrapper element (`<div>`)
	 * for the whole chart.
	 *
	 * This is the same for **all** elements within the same chart.
	 *
	 * @param htmlContainer HTML element
	 */
	public set htmlContainer(htmlContainer: $type.Optional<HTMLElement>) {
		this._htmlContainer = htmlContainer;
	}

	/**
	 * @return HTML element
	 */
	public get htmlContainer(): $type.Optional<HTMLElement> {
		if (this._htmlContainer) {
			return this._htmlContainer;
		}
		else {
			if (this.parent) {
				return this.parent.htmlContainer;
			}
		}
	}

	/**
	 * Creates (if not yet created) and returns element's `<title>` element.
	 *
	 * @ignore Exclude from docs
	 * @return Title element
	 */
	public get titleElement(): AMElement {
		if (!this._titleElement) {
			this._titleElement = this.paper.add("title");
			this.group.add(this._titleElement);
		}
		return this._titleElement;
	}

	/**
	 * Creates (if not yet created) and returns element's `<desc>` element.
	 *
	 * @ignore Exclude from docs
	 * @return Desc element
	 */
	public get descriptionElement(): AMElement {
		if (!this._descriptionElement) {
			this._descriptionElement = this.paper.add("desc");
			this.group.add(this._descriptionElement);
		}
		return this._descriptionElement;
	}

	/**
	 * Returns list of SVG filters (effects) applied to element. If the filter
	 * list is not yet initilized, creates and returns an empty one.
	 * Note, not all filters combine well with one another. We recommend using one filter per sprite.
	 *
	 * @return List of filters
	 */
	public get filters(): List<Filter> {
		if (!this._filters) {
			this._filters = new List<Filter>();
			// TODO only add certain events ?
			this._disposers.push(this._filters.events.onAll(this.applyFilters, this));
			this._disposers.push(new ListDisposer(this._filters));
		}
		return this._filters;
	}

	/**
	 * Sets required SVG attributes. Must be called every time an element is
	 * redrawn so that attributes are (re)applied.
	 *
	 * @ignore Exclude from docs
	 */
	protected setSVGAttributes(): void {
		this.fill = this.fill;
		this.opacity = this.opacity;
		this.fillOpacity = this.fillOpacity;
		this.stroke = this.stroke;
		this.strokeOpacity = this.strokeOpacity;
		this.shapeRendering = this.shapeRendering;
		this.strokeDasharray = this.strokeDasharray;
		this.strokeDashoffset = this.strokeDashoffset;
		this.strokeLinecap = this.strokeLinecap;
		this.strokeLinejoin = this.strokeLinejoin;
		this.focusable = this.focusable;
		this.tabindex = this.tabindex;
		this.role = this.role;
	}

	/**
	 * Sets an attribute directly on an SVG element.
	 *
	 * @ignore Exclude from docs
	 * @param attribute Attribute object
	 */
	protected setSVGAttribute(attribute: ISVGAttribute): void {
		this.group.attr(attribute);
	}

	/**
	 * Removes an attribute directly from SVG element.
	 *
	 * @param attribute Attribute key to remove
	 */
	protected removeSVGAttribute(attribute: string): void {
		this.group.removeAttr(attribute);
	}

	/**
	 * Sets `class` attribute of the elements SVG node.
	 *
	 * Uses `am4core.options.classNamePrefix`.
	 *
	 * @ignore Exclude from docs
	 */
	public setClassName(): void {

		let className = this.className;
		let classNamePrefix = options.classNamePrefix;

		if (this.element) {
			this.element.addClass(classNamePrefix + className);
		}

		this.group.addClass(classNamePrefix + className + "-group");

		if ($type.hasValue(this.id)) {
			this.group.addClass(classNamePrefix + this.id);
		}
	}

	/**
	 * Adds an `id` attribute the the element and returns the id.
	 *
	 * @ignore Exclude from docs
	 * @return Element's ID
	 */
	public uidAttr(): string {
		this.setSVGAttribute({ "id": this.uid });
		return this.uid;
	}

	/**
	 * [updateClipPath description]
	 *
	 * @todo Description
	 */
	protected updateClipPath(): void {
		const element = this._clipElement;

		if (element) {
			element.moveTo({ x: this.mask.pixelX, y: this.mask.pixelY });
		}
	}


	/**
	 * @ignore
	 */
	protected createClipPath() {
		if (!this._clipPath) {
			this._clipPath = this.paper.addGroup("clipPath");
			this.paper.appendDef(this._clipPath);
			this._disposers.push(this._clipPath);
			let id: string = registry.getUniqueId();
			this._clipPath.attr({ "id": id });
			this.group.attr({ "clip-path": "url(\"" + $utils.getBaseURI() + id + "\")" });
		}
	}


	/**
	 * Applies the mask Sprite.
	 *
	 * @ignore Exclude from docs
	 */
	protected applyMask(): void {
		let mask = this.mask;

		if (this._clipPath && mask) {
			// Container
			if (mask instanceof Container) {
				this._clipElement.attr({ "width": $math.max(0, mask.pixelWidth), "height": $math.max(0, mask.pixelHeight) });

				let point = $utils.spritePointToSprite({ x: mask.pixelX, y: mask.pixelY }, mask.parent, this);

				this._clipPath.x = point.x;
				this._clipPath.y = point.y;
			}
			// Sprite
			else {
				if (mask.element && mask.element != this._clipElement) {
					this._clipElement = mask.element;
					this._clipPath.add(this._clipElement);
				}

				this._clipPath.scale = mask.scale;
				this._clipPath.x = mask.pixelX;
				this._clipPath.y = mask.pixelY;
				this._clipPath.rotation = mask.rotation;
			}
		}
	}

	/**
	 * Applies filters to the element.
	 *
	 * @ignore Exclude from docs
	 */
	protected applyFilters(): void {
		// we create a separate filter for each sprite as otherwise it would be impossible to animate filter.
		// svg doesn't support multiple filters applied to one element, so we put all the primitives to one filterElement of a sprite.
		if (this._filters && this._filters.length > 0) {

			let width = 100;
			let height = 100;

			if (!this.filterElement) {
				this.filterElement = this.paper.addGroup("filter");
				this._disposers.push(this.filterElement);
			}
			else {
				this.filterElement.removeChildNodes();
			}

			this.paper.appendDef(this.filterElement);

			let id: string = "filter-" + this.uid;
			this.filterElement.attr({ "id": id });

			$iter.each(this.filters.iterator(), (filter) => {
				filter.sprite = this;
				filter.paper = this.paper;

				filter.appendPrimitives(this.filterElement);

				if (filter.width > width) {
					width = filter.width;
				}
				if (filter.height > height) {
					height = filter.height;
				}

				filter.scale = this.globalScale;
			});

			let w = width + "%";
			let h = height + "%";

			/* temporarily removed as it is breaking tooltips on Safari @todo come back to this
			if (this._measuredHeight <= 1) {
				h = height + "";
			}

			if (this._measuredWidth <= 1) {
				h = width + "";
			}*/

			this.filterElement.attr({ "width": w, "height": h, "x": -(width - 100) / 2 + "%", "y": -(height - 100) / 2 + "%" });

			this.group.attr({ "filter": "url(\"" + $utils.getBaseURI() + id + "\")" });
		}
		else if (this.filterElement) {
			this.group.removeAttr("filter");
			this.filterElement.removeChildNodes();
		}
	}

	/**
	 * [removeClipPath description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected removeClipPath(): void {
		if (this._clipPath) {
			//this._clipPath.dispose();
			this.removeDispose(this._clipPath);
			this._clipPath = undefined;
		}
	}

	/**
	 * [setElement description]
	 *
	 * @ignore
	 * @todo Description
	 * @param element [description]
	 */
	public setElement(element: AMElement) {
		this.element = element;
		this.setSVGAttributes();
		this.applyAccessibility();
	}

	/**
	 * The main element for this Sprite, usually an SVG `<g>`.
	 *
	 * All other sub-elements are created in it.
	 *
	 * @param element  Element
	 */
	public set element(element: Optional<AMElement>) {

		// Destroy previous element if there was one before
		this.removeElement();

		// Set new element
		this._element = element;

		// Add element to group
		// Since we are adding Element to group, which is already in the
		// `.disposers` it will be removed automatically when Sprite is disposed
		// of
		this.group.add(element);

		if (element.node instanceof SVGPathElement) {
			this._isPath = true;
		}

		// This is needed if someone is setting element not in draw method but
		// from outside
		if (!this.invalid) {
			this.validate();
		}

		if (options.autoSetClassName) {
			this.setClassName();
		}
	}

	/**
	 * @return Element
	 */
	public get element(): Optional<AMElement> {
		return this._element;
	}

	/**
	 * HTML container (`<div>`) which is used to place chart's `<svg>` element
	 * in.
	 *
	 * @return Container for chart elements
	 */
	public get svgContainer(): $type.Optional<SVGContainer> {
		if (this._svgContainer) {
			return this._svgContainer;
		}
		else if (this.parent) {
			return this.parent.svgContainer;
		}
	}

	/**
	 * Sets HTML container to add SVG and other chart elements to.
	 *
	 * @param svgContainer Container for chart elements
	 */
	public set svgContainer(svgContainer: $type.Optional<SVGContainer>) {
		this._svgContainer = svgContainer;
	}

	/**
	 * Measures main element.
	 *
	 * Saves measurements into private `_bbox` property.
	 *
	 * @ignore Exclude from docs
	 */
	protected measureElement() {
		if (this.element) {
			if (this.definedBBox) {
				this._bbox = this.definedBBox;
			}
			else {
				let svgBBox: IRectangle = this.element.getBBox();
				this._bbox = { x: svgBBox.x, y: svgBBox.y, width: svgBBox.width, height: svgBBox.height };
			}
		}
	}



	/**
	 * Positions element according its center settings.
	 *
	 * @todo Description (review)
	 * @ignore Exclude from docs
	 */
	public updateCenter() {
		if (this.element) {
			let prevElementTransform: string = this.element.transformString;

			let bbox = this.bbox;

			let ex = 0;
			let ey = 0;

			let elementX = bbox.x;
			let elementY = bbox.y;

			let elementWidth = bbox.width;
			let elementHeigth = bbox.height;

			let pixelPaddingLeft = this.pixelPaddingLeft;
			let pixelPaddingRight = this.pixelPaddingRight;
			let pixelPaddingTop = this.pixelPaddingTop;
			let pixelPaddingBottom = this.pixelPaddingBottom;

			// add padding to the measured size
			let measuredWidth = $math.max(elementWidth + pixelPaddingLeft + pixelPaddingRight, this.pixelWidth);
			let measuredHeight = $math.max(elementHeigth + pixelPaddingTop + pixelPaddingBottom, this.pixelHeight);

			// extremes
			let left = bbox.x;
			let right = bbox.x + measuredWidth;

			let top = bbox.y;
			let bottom = bbox.y + measuredHeight;

			let horizontalCenter = this.horizontalCenter;
			let verticalCenter = this.verticalCenter;

			switch (horizontalCenter) {
				case "none":
					ex = elementX + pixelPaddingLeft;
					break;
				case "left":
					ex = pixelPaddingLeft;
					break;
				case "middle":
					ex = pixelPaddingLeft - (elementWidth + pixelPaddingRight + pixelPaddingLeft) / 2;
					break;
				case "right":
					ex = -pixelPaddingRight - elementWidth;
					break;
			}

			switch (verticalCenter) {
				case "none":
					ey = elementY + pixelPaddingTop;
					break;
				case "top":
					ey = pixelPaddingTop;
					break;
				case "middle":
					ey = pixelPaddingTop - (elementHeigth + pixelPaddingBottom + pixelPaddingTop) / 2;
					break;
				case "bottom":
					ey = -pixelPaddingBottom - elementHeigth;
					break;
			}

			this._measuredHeight = measuredHeight;
			this._measuredWidth = measuredWidth;

			let x: number = $math.round(ex - elementX, this._positionPrecision, true);
			let y: number = $math.round(ey - elementY, this._positionPrecision, true);

			this.ex = x - pixelPaddingLeft;
			this.ey = y - pixelPaddingTop;

			this.maxLeft = left + x - pixelPaddingLeft;
			this.maxRight = right + x - pixelPaddingLeft;

			this.maxTop = top + y - pixelPaddingTop;
			this.maxBottom = bottom + y - pixelPaddingTop;

			if (this.pixelPerfect) {
				x -= 0.5;
				y -= 0.5;
			}

			this.element.moveTo({ x: x, y: y });

			if (prevElementTransform != this.element.transformString) {
				this.dispatchImmediately("transformed");
			}
		}
	}

	/**
	 * Measures the whole element.
	 *
	 * Returns `true` if the size has changed from the last measurement.
	 *
	 * @ignore Exclude from docs
	 * @return Did the size changed from the last measurement?
	 */
	public measure(): boolean {

		this.updateCenter();

		let measuredWidth = this._measuredWidth;
		let measuredHeight = this._measuredHeight;

		// extremes
		let left = this.maxLeft;
		let right = this.maxRight;

		let top = this.maxTop;
		let bottom = this.maxBottom;

		// non-parent wise size
		this._measuredWidthSelf = measuredWidth;
		this._measuredHeightSelf = measuredHeight;

		let positionPrecision = this._positionPrecision;

		this.maxLeftSelf = this.maxLeft;
		this.maxRightSelf = this.maxRight;
		this.maxTopSelf = this.maxTop;
		this.maxBottomSelf = this.maxBottom;

		// if a sprite is rotated or scaled, calculate measured size after transformations
		if (this.rotation !== 0 || this.scale !== 1) {

			// not good to handleGlobalScale here.
			if (this.nonScalingStroke) {
				this.strokeWidth = this.strokeWidth;
			}

			let svg = this.paper.svg;

			let matrix: SVGMatrix = svg.createSVGMatrix();
			let rotation: number = this.rotation;

			matrix.a = $math.cos(rotation) * this.scale;
			matrix.c = - $math.sin(rotation) * this.scale;
			matrix.e = 0;
			matrix.b = $math.sin(rotation) * this.scale;
			matrix.d = $math.cos(rotation) * this.scale;
			matrix.f = 0;

			let p1: SVGPoint = svg.createSVGPoint();
			p1.x = left;
			p1.y = top;

			let p2: SVGPoint = svg.createSVGPoint();
			p2.x = right;
			p2.y = top;

			let p3: SVGPoint = svg.createSVGPoint();
			p3.x = right;
			p3.y = bottom;

			let p4: SVGPoint = svg.createSVGPoint();
			p4.x = left;
			p4.y = bottom;

			let pt1: SVGPoint = p1.matrixTransform(matrix);
			let pt2: SVGPoint = p2.matrixTransform(matrix);
			let pt3: SVGPoint = p3.matrixTransform(matrix);
			let pt4: SVGPoint = p4.matrixTransform(matrix);

			left = Math.min(pt1.x, pt2.x, pt3.x, pt4.x);
			right = Math.max(pt1.x, pt2.x, pt3.x, pt4.x);
			top = Math.min(pt1.y, pt2.y, pt3.y, pt4.y);
			bottom = Math.max(pt1.y, pt2.y, pt3.y, pt4.y);

			measuredWidth = right - left;
			measuredHeight = bottom - top;

			this.maxLeft = $math.round(left, positionPrecision, true);
			this.maxRight = $math.round(right, positionPrecision, true);
			this.maxTop = $math.round(top, positionPrecision, true);
			this.maxBottom = $math.round(bottom, positionPrecision, true);
		}

		this._measuredWidth = $math.round(measuredWidth, positionPrecision, true);
		this._measuredHeight = $math.round(measuredHeight, positionPrecision, true);


		// dispatch event
		if (this._measuredWidth != this._prevMeasuredWidth || this._measuredHeight != this._prevMeasuredHeight) {
			this._prevMeasuredHeight = this._measuredHeight;
			this._prevMeasuredWidth = this._measuredWidth;

			// TODO clear existing sizechanged dispatches ?
			this.dispatch("sizechanged");

			if ((this.isHover || this.showTooltipOn == "hit" || this.showTooltipOn == "always") && this.tooltip && this.tooltip.visible && ($type.hasValue(this.tooltipText) || $type.hasValue(this.tooltipHTML))) {
				this.updateTooltipPosition();
			}

			return true;
		}

		return false;
	}

	/**
	 * Insert this element before sibling element.
	 *
	 * @param sprite  Target element
	 * @return This element
	 */
	public insertBefore(sprite: Sprite): Sprite {
		let parent = this.parent;

		if (parent) {
			let index: number = parent.children.indexOf(sprite);
			if (index !== -1) {
				parent.children.moveValue(this, index);
				parent.sortChildren();
			}
		}

		return this;
	}

	/**
	 * Insert this element after sibling element.
	 *
	 * @param sprite  Target element
	 * @return This element
	 */
	public insertAfter(sprite: Sprite): Sprite {
		let parent = this.parent;

		if (parent) {
			let index: number = parent.children.indexOf(sprite);
			if (index !== -1) {
				parent.children.moveValue(this, index + 1);
				parent.sortChildren();
			}
		}

		return this;
	}

	/**
	 * Removes the main SVG element.
	 *
	 * This does not destroy the whole Sprite element. To do that use
	 * `dispose()` instead.
	 *
	 * @ignore Exclude from docs
	 */
	protected removeElement() {
		// remove visual element
		if (this._element) {
			this.removeDispose(this._element);
			this._element = undefined;
		}
	}

	/**
	 * Returns relative (percent) value of the X coordindate within this element.
	 *
	 * A relative value is a hundredth of a percent. So 100% would result in a 1
	 * as relative value.
	 *
	 * @param value  Absolute or relative X coordinate
	 * @return Relative value
	 */
	public getRelativeX(value: number | Percent): number {
		if (value instanceof Percent) {
			return value.value;
		}
		else if (this.parent) {
			return value / this.parent.innerWidth;
		}
		return 0;
	}

	/**
	 * Returns relative (percent) value of the Y coordindate within this element.
	 *
	 * A relative value is a hundredth of a percent. So 100% would result in a 1
	 * as relative value.
	 *
	 * @param value  Absolute or relative Y coordinate
	 * @return Relative value
	 */
	public getRelativeY(value: number | Percent): number {
		if (value instanceof Percent) {
			return value.value;
		}
		else if (this.parent) {
			return value / this.parent.innerHeight;
		}
		return 0;
	}

	/**
	 * Returns an X coordinate in pixel within the element.
	 *
	 * If number is passed in as parameter, the same number will be returned
	 * back.
	 *
	 * If [[Percent]] is passed in, it will be recalculated to pixels.
	 *
	 * @param value  Absolute or relative X coordinate
	 * @return X coordinate in pixels
	 */
	public getPixelX(value: number | Percent): number {

		// we don't use $utils.valueToRelative as this would mean that we should access parent.innerWidth
		// all the time and this would result chain of the same actions and will slow down the system a lot

		let pixel: number = 0;
		if ($type.isNumber(value)) {
			pixel = value;
		}
		else if (value instanceof Percent) {
			let relative: number = value.value;

			if (this.parent) {
				pixel = $math.round(this.parent.innerWidth * relative, this._positionPrecision, true);
			}
		}
		return pixel;
	}

	/**
	 * Returns an Y coordinate in pixel within the element.
	 *
	 * If number is passed in as parameter, the same number will be returned
	 * back.
	 *
	 * If [[Percent]] is passed in, it will be recalculated to pixels.
	 *
	 * @param value  Absolute or relative Y coordinate
	 * @return Y coordinate in pixels
	 */
	public getPixelY(value: number | Percent): number {

		// we don't use $utils.valueToRelative as this would mean that we should access parent.innerWidth
		// all the time and this would result chain of the same actions and will slow down the system a lot

		let pixel: number = 0;
		if ($type.isNumber(value)) {
			pixel = value;
		}
		else if (value instanceof Percent) {
			let relative: number = value.value;

			if (this.parent) {
				pixel = $math.round(this.parent.innerHeight * relative, this._positionPrecision, true);
			}
		}

		return pixel;
	}

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
	 * @param point     New coordinates
	 * @param rotation  New rotation
	 * @param scale     New Scale
	 */
	public moveTo(point: IPoint, rotation?: number, scale?: number, isDragged?: boolean): void {
		if (this.isDragged && !isDragged) {
			return;
		}
		if (point) {
			if ($type.isNumber(point.x)) {
				this.setPropertyValue("x", $math.round(point.x, this._positionPrecision, true));
			}
			if ($type.isNumber(point.y)) {
				this.setPropertyValue("y", $math.round(point.y, this._positionPrecision, true));
			}
		}

		if ($type.isNumber(rotation)) {
			this.rotation = rotation;
		}

		if ($type.isNumber(scale)) {
			this.scale = scale;
		}

		// must leave this
		this.invalidatePosition();
	}

	/**
	 * Sets another [[Sprite]] element as this elements mask.
	 *
	 * @ignore Exclude from docs
	 * @param mask A [[Sprite]] to use as mask
	 */
	public set mask(mask: Optional<Sprite>) {
		if (this._mask.get() !== mask) {
			// this is good
			if (mask) {

				this.createClipPath();

				if (!(mask instanceof Container)) {
					mask.isMeasured = false;
					if (mask.element) {
						this._clipElement = mask.element;
					}
				}
				else {
					this._clipElement = this.paper.add("rect");
				}

				if (this._clipElement) {
					this._clipPath.add(this._clipElement);
				}

				this._mask.set(mask, new MultiDisposer([
					//mask.addEventListener(SpriteEvent.TRANSFORMED, this.applyMask, false, this);
					mask.events.on("maxsizechanged", () => { if (this.inited) { this.applyMask(); } }, undefined, false),
					mask.events.on("validated", this.applyMask, this, false),
					mask.events.on("positionchanged", this.applyMask, this, false)
				]));

				this.applyMask();
			}
			else {
				this._mask.reset();
				this.group.removeAttr("clip-path");
				this.removeClipPath();
			}
		}
	}

	/**
	 * Returns [[Sprite]] element currently used as mask for this element.
	 *
	 * @ignore Exclude from docs
	 * @return A [[Sprite]] to use as mask
	 */
	public get mask(): Optional<Sprite> {
		if (!this._adapterO) {
			return this._mask.get();
		}
		else {
			return this._adapterO.apply("mask", this._mask.get());
		}
	}

	// you can set IRectangle as a mask instead o a sprite. Note, the changes of the object won't be monitored

	/**
	 * Instead of creating a [[Sprite]] for mask, you can just use a
	 * [[Rectangle]] by setting this accessor.
	 *
	 * Please note that the element will not monitor any changes to the mask
	 * rectangle.
	 *
	 * @ignore Exclude from docs
	 * @param rect Mask Rectangle
	 */
	public set maskRectangle(rect: IRectangle) {
		if (rect) {

			this.createClipPath();

			if (!this._clipElement) {
				this._clipElement = this.paper.add("rect");
				this._clipPath.add(this._clipElement);
			}
			this._clipElement.attr({ "width": rect.width, "height": rect.height });
		}
		else {
			this.removeClipPath();
			this._clipElement = undefined;
		}
		this._maskRectangle = rect;
	}

	/**
	 * @ignore Exclude from docs
	 * @return Mask Rectangle
	 */
	public get maskRectangle(): IRectangle {
		return this._maskRectangle;
	}

	/**
	 * Indicates if this element was already measured.
	 *
	 * @ignore Exclude from docs
	 * @param value Was element already measured?
	 */
	public set isMeasured(value: boolean) {
		value = $type.toBoolean(value);

		if (!value) {
			this._measuredWidth = 0;
			this._measuredHeight = 0;
			//this._pixelHeight = 0;
			//this._pixelWidth = 0;
		}

		if (this._isMeasured != value) {
			this._isMeasured = value;
			this.invalidatePosition();
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Was element already measured?
	 */
	public get isMeasured(): boolean {
		return this._isMeasured;
	}

	/**
	 * Checks if the this element has any of its parts overlapping with another
	 * element.
	 *
	 * @todo Description (review)
	 * @param sprite  Second element to test again
	 * @return Overlapping?
	 */
	public hitTest(sprite: Sprite): boolean {
		// validate, otherwise we will not know measuredWidth and measuredHeight
		if (this.invalid) {
			this.validate();
		}
		if (sprite.invalid) {
			sprite.validate();
		}

		let ax1 = this.pixelX;
		let ay1 = this.pixelY;
		let ax2 = ax1 + this.measuredWidth;
		let ay2 = ay1 + this.measuredHeight;

		let bx1 = sprite.pixelX;
		let by1 = sprite.pixelY;
		let bx2 = bx1 + sprite.measuredWidth;
		let by2 = by1 + sprite.measuredHeight;

		return !(bx1 > ax2 || bx2 < ax1 || by1 > ay2 || by2 < ay1);
	}

	/**
	 * ==========================================================================
	 * STATE-RELATED
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Returns `true` if Sprite has already finished initializing.
	 *
	 * @return Initialized?
	 */
	public get inited(): boolean {
		return this._inited;
	}

	/**
	 * Returns `true` if Sprite has already finished initializing and is ready.
	 *
	 * If this object is a [[Container]] it will wait for all of its children
	 * are ready before becoming ready itself and firing a `"ready"` event.
	 *
	 * @return is ready?
	 */
	public isReady(): boolean {
		return this._ready;
	}

	/**
	 * Returns a collection of element's available [[SpriteState]] entries.
	 *
	 * @see {@link SpriteState}
	 * @return States
	 */
	public get states(): DictionaryTemplate<string, SpriteState<this["_properties"], this["_adapter"]>> {
		if (!this._states) {
			const state = new SpriteState<this["_properties"], this["_adapter"]>();

			// works
			this._states = new DictionaryTemplate<string, SpriteState<this["_properties"], this["_adapter"]>>(state);

			// TODO what about removeKey ?
			this._disposers.push(this._states.events.on("insertKey", this.processState, this, false));
			this._disposers.push(this._states.events.on("setKey", this.processState, this, false));

			this._disposers.push(new DictionaryDisposer(this._states));
			this._disposers.push(state);
		}
		return this._states;
	}

	/**
	 * Returns a [[SpriteState]] object for "hidden" state.
	 *
	 * This is a shortcut to `this.states.getKey("hidden")`.
	 *
	 * @return Hidden state
	 */
	public get hiddenState(): SpriteState<this["_properties"], this["_adapter"]> {
		if (!this.states.getKey("hidden")) {
			let hiddenState = this.states.create("hidden");
			hiddenState.properties.opacity = 0;
			hiddenState.properties.visible = false;
		}

		return this.states.getKey("hidden");
	}

	/**
	 * Returns a [[SpriteState]] object for "default" state.
	 *
	 * This is a shortcut to `this.states.getKey("default")`.
	 *
	 * @return Hidden state
	 */
	public get defaultState(): SpriteState<this["_properties"], this["_adapter"]> {

		if (!this.states.getKey("default")) {
			let defaultState = this.states.create("default");
			defaultState.properties.opacity = 1;
		}

		return this.states.getKey("default");
	}

	/**
	 * Checks if some key states are defined and updates Sprite properties
	 * accordingly.
	 *
	 * For example if there's a state "down" defined for Sprite, we automatically
	 * make it "clickable".
	 *
	 * @ignore Exclude from docs
	 * @param event An event which caused state list update
	 */
	protected processState(event: IDictionaryEvents<string, SpriteState<this["_properties"], this["_adapter"]>>["insertKey" | "setKey"]): void {
		let state: SpriteState<this["_properties"], this["_adapter"]> = event.newValue;
		state.sprite = this;
		state.name = event.key;
		if (this.states.hasKey("hover") || (this.showTooltipOn == "hover" && ($type.hasValue(this.tooltipHTML) || $type.hasValue(this.tooltipText)))) {
			this.hoverable = true;
		}

		if (this.states.hasKey("down") || (this.showTooltipOn == "hover" && ($type.hasValue(this.tooltipHTML) || $type.hasValue(this.tooltipText)))) {
			this.clickable = true;
		}

		if (this.states.hasKey("focus")) {
			this.focusable = true;
		}

		// Propagate the new state to clones
		if (this.applyOnClones) {
			const clones = this.clones.values;
			const length = clones.length;

			for (let i = 0; i < length; ++i) {
				const clone = clones[i];
				if (!clone.isDisposed()) {
					clone.states.setKey(state.name, state);
				}
			}
		}
	}

	/**
	 * Returns a list elements's animations currently being played.
	 *
	 * If the list has not been initialized it is created.
	 *
	 * @return List of animations
	 */
	public get animations(): Array<Animation> {
		if (!this._animations) {
			this._animations = [];
			this._disposers.push(new AnimationDisposer(this._animations));
		}
		return this._animations;
	}

	/**
	 * Converts element's local coordinates to the coordinates within the main
	 * chart container.
	 *
	 * @param point  Local point
	 * @return Global point
	 */
	public getSvgPoint(point: IPoint): IPoint {
		try {
			// Calculate SVG point
			let bbox = this.htmlContainer.getBoundingClientRect();

			return {
				"x": point.x - bbox.left,
				"y": point.y - bbox.top
			};
		}
		catch (e) {
			return point;
		}
	}

	/**
	 * Creates and starts an [[Animation]] with given `animationOptions`.
	 *
	 * @see {@link Animation} for additional information about available options
	 * @param animationOptions  Animation options
	 * @param duration          Duration in milliseconds
	 * @param easing            Easing function
	 * @return Animation instance
	 */
	public animate(animationOptions: ISpriteAnimationOptions[] | ISpriteAnimationOptions, duration: number, easing?: (value: number) => number): Animation {
		return new Animation(this, animationOptions, duration, easing).start();
	}

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
	 * @param value               A state - name key or instance
	 * @param transitionDuration  Duration of the transition between current and new state
	 * @param easing              An easing function
	 */
	public setState(value: string | SpriteState<this["_properties"], this["_adapter"]>, transitionDuration?: number, easing?: (value: number) => number): $type.Optional<Animation> {
		let state: Optional<SpriteState<this["_properties"], this["_adapter"]>>;
		if (value instanceof SpriteState) {
			this.states.setKey(value.name, value);
			state = value;
		}
		else {
			state = this.states.getKey(value);
			if (!state) {
				return;
			}
		}

		// stop previous transition
		// not good - foe expample, we are animating to some "active" state and in them middle "hover" state happens. then "active" stat won't be applied
		//if (this._transition) {
		//this._transition.stop();
		//}

		if (state.name == "hover") {
			if (this.isHidden) {
				return;
			}
			this.isHover = true;
		}

		if (state.name == "hidden") {
			this.isHiding = true;
		}
		else {
			if (!this.visible) {
				this.setVisibility(state.properties.visible || this.defaultState.properties.visible);
			}
		}

		if (state.name == "active") {
			this.isActive = true;
		}
		// we do not set isActive = false here if it's not active, but container does that if setStateOnChildren = true


		if (!$type.isNumber(transitionDuration)) {
			transitionDuration = state.transitionDuration;
		}

		if (!$type.hasValue(easing)) {
			easing = state.transitionEasing;
		}

		return this.transitTo(state, transitionDuration, easing);
	}

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
	 * @param duration  Duration for the animation (ms)
	 * @return [[Animation]] object which is handling the transition
	 */
	public applyCurrentState(duration?: number): $type.Optional<Animation> {

		//if (!this.isHidden) { // this was done for hover state not to take effect if "hidden" is actually visible, need to think about it.

		let animation: $type.Optional<Animation> = this.setState(this.defaultState, duration);

		if (this.isHover) {
			animation = this.setState("hover", duration);
		}

		if (this.isDown && this.interactions.downPointers.length) {
			animation = this.setState("down", duration);
		}

		this.isFocused = this.isFocused;

		if (this.isActive) {
			animation = this.setState("active", duration);
			if (this.isHover && this.states.hasKey("hoverActive")) {
				animation = this.setState("hoverActive", duration);
			}
		}

		return animation;
		//}
	}

	/**
	 * Starts an [[Animation]] of the properties to specific values as they are
	 * set in `state`.
	 *
	 * @ignore Exclude from docs
	 * @param state     Target State
	 * @param duration  Duration in milliseconds
	 * @param easing    Easing function
	 * @return Transition Animation
	 */
	protected transitTo(state: SpriteState<this["_properties"], this["_adapter"]>, duration: number, easing?: (value: number) => number): Optional<Animation> {
		// Init
		let options: ISpriteAnimationOptions[] = [],
			propValues = state.allValues,
			transition: Optional<Animation>;

		// todo: do this for numeric/color properties only?
		// @todo use state.getPropertyValue instead
		$object.each(propValues, (propertyName, finalValue) => {
			let currentValue: any = (<any>this)[propertyName];
			// save current value to default state. this solves a big problem where values must be set both on sprite and default state
			if (finalValue != currentValue && this.defaultState.properties[propertyName] == undefined) {
				this.defaultState.properties[propertyName] = currentValue;
			}

			//if (finalValue != currentValue && $type.hasValue(finalValue)) {
			if ($type.hasValue(finalValue)) {
				let option: ISpriteAnimationOptions = { from: currentValue, to: <any>finalValue, property: propertyName };
				options.push(option);
			}
		});

		if (options.length > 0) {
			transition = this.animate(options, duration, easing);
			if (transition && !transition.isFinished()) {
				// TODO should this use events.once ?
				// TODO push onto _disposers array ?
				this._disposers.push(transition.events.on("animationended", () => {
					this.dispatchImmediately("transitionended");
				}));
			}
			else {
				this.dispatchImmediately("transitionended");
			}
		}

		// apply filters if set
		if (state.filters.length > 0) {
			let newFilters: Filter[] = [];
			// check for the same filters
			$iter.each(state.filters.iterator(), (stateFilter) => {
				let newFilter: Filter = <Filter>stateFilter.clone();
				newFilters.push(newFilter);
				let animationOptions: IAnimationOptions[] = [];

				$iter.each(this.filters.iterator(), (currentFilter) => {
					// if we have the same filters
					if (currentFilter.className == newFilter.className) {

						if (!$iter.contains(this.defaultState.filters.iterator(), (x) => x.className === newFilter.className)) {
							this.defaultState.filters.push(currentFilter);
						}

						$object.each(newFilter.properties, (propertyName, newValue) => {
							let currentValue = (<any>currentFilter).properties[propertyName];
							// if values are not the same, push to animation options array
							if (currentValue != newValue) {
								animationOptions.push({ property: propertyName, from: currentValue, to: newValue });
							}
						});
					}
				});
				// animate to new value
				newFilter.animate(animationOptions, duration, easing);
			});
			this.filters.clear();
			this.filters.pushAll(newFilters);
		}

		return transition;
	}

	/**
	 * Returns `true` if Sprite is currently transiting from one state/value to
	 * another.
	 *
	 * @return Is in transition?
	 */
	public isInTransition(): boolean {
		return this.animations.length > 0;
	}

	/**
	 * Indicates if this element has a mouse pointer currently hovering
	 * over it, or if it has any touch pointers pressed on it.
	 *
	 * @param value Is hovered?
	 */
	public set isHover(value: boolean) {
		value = $type.toBoolean(value);
		if (value !== this.isHover) {
			if (this.isInteractive()) {
				this.interactions.isHover = value;
				if (value) {
					this.handleOver();
				}
				else {
					this.handleOut();
				}
			}
		}
	}

	/**
	 * Returns indicator if this element has a mouse pointer currently hovering
	 * over it, or if it has any touch pointers pressed on it.
	 *
	 * @return Is hovered?
	 */
	public get isHover(): boolean {
		if (this.isInteractive()) {
			return this.interactions.isHover;
		}
		return false;
	}

	/**
	 * Returns indicator if this element is being dragged at the moment.
	 *
	 * @return Is dragged?
	 */
	public get isDragged(): boolean {
		return this._isDragged;
	}

	/**
	 * Returns indicator if this element is being resized at the moment.
	 *
	 * @return Is resized?
	 */
	public get isResized(): boolean {
		return this._isResized;
	}

	/**
	 * Indicates if this element has any pointers (mouse or touch) pressing down
	 * on it.
	 *
	 * @param value Is down?
	 */
	public set isDown(value: boolean) {
		value = $type.toBoolean(value);
		if (this.isInteractive() && this.isDown != value) {
			this.interactions.isDown = value;
			if (value) {
				this.handleDown();
			}
			else {
				this.handleUp();
			}
		}
	}

	/**
	 * @return Is down?
	 */
	public get isDown(): boolean {
		if (this.isInteractive()) {
			return this.interactions.isDown;
		}
		return false;
	}

	/**
	 * Indicates if this element is focused (possibly by tab navigation).
	 *
	 * @param value Is focused?
	 */
	public set isFocused(value: boolean) {
		value = $type.toBoolean(value);
		if (this.focusable && this.isFocused != value) {
			if (this.isInteractive()) {
				this.interactions.isFocused = value;
				if (value === true) {
					this.handleFocus();
				}
				else {
					this.handleBlur();
				}
			}
		}
	}

	/**
	 * @return Is focused?
	 */
	public get isFocused(): boolean {
		if (this.isInteractive()) {
			return this.interactions.isFocused;
		}
		return false;
	}

	/**
	 * Indicates if this element is currently active (toggled on) or not
	 * (toggled off).
	 *
	 * @param value Is active?
	 */
	public set isActive(value: boolean) {
		this.setActive(value);
	}


	protected setActive(value: boolean) {

		value = $type.toBoolean(value);
		if (this._isActive !== value) {
			this._isActive = value;
			if (value && this.states.hasKey("active")) {
				this.setState("active");
				if (this.isHover && this.states.hasKey("hoverActive")) {
					this.setState("hoverActive");
				}
			}
			else {
				this.applyCurrentState();
			}

			this.dispatchImmediately("toggled");
		}
	}

	/**
	 * @return Is active?
	 */
	public get isActive(): boolean {
		return this._isActive;
	}

	/**
	 * Controls if element is disabled.
	 *
	 * A disabled element is hidden, and is removed from any processing, layout
	 * calculations, and generally treated as if it does not exist.
	 *
	 * The element itself is not destroyed, though. Setting this back to `false`,
	 * will "resurrect" the element.
	 *
	 * @param value  Disabled?
	 */
	public set disabled(value: boolean) {
		this.setDisabled(value);
	}

	/**
	 * @return Disabled?
	 */
	public get disabled(): boolean {
		//if(this._internalDisabled){
		//	return true;
		//}
		let current = this.getPropertyValue("disabled");
		if ($type.hasValue(current)) {
			return current;
		}
		else {
			if (this.virtualParent) {
				return this.virtualParent.disabled;
			}
			if (this.parent) {
				return this.parent.disabled;
			}
		}
		return false;
	}


	protected setDisabled(value: boolean): boolean {
		value = $type.toBoolean(value);
		let current = this.getPropertyValue("disabled");
		if (current != value) {
			this.setPropertyValue("disabled", value, true);
			if (value) {
				this.parent = this.parent;
				this.removeFromInvalids();
				this.group.attr({ "display": "none" });
				this.dispatch("disabled");
			}
			else {
				if (this.parent) {
					let group = <Group>this.parent.element;
					if (!group.hasChild(this.group)) {
						group.add(this.group);
					}
				}

				if (this instanceof Container) {
					this.deepInvalidate();
					if(this._background){
						this._background.invalidate();
					}
				}
				else {
					this.invalidate();
				}
				if (!this.__disabled) {
					this.removeSVGAttribute("display");
				}
				this.dispatch("enabled");
			}

			this.dispatch("transformed");
			system.requestFrame();
			return true;
		}
		return false;
	}

	/**
	 * Internal disable method.
	 *
	 * Do not use it for disabling elements. Use `disabled` accessor instead.
	 *
	 * @ignore Exclude from docs
	 * @param value Disabled?
	 */
	public set __disabled(value: boolean) {
		if (this._internalDisabled != value) {
			this._internalDisabled = value;
			this._updateDisabled = true;
			this.invalidatePosition(); // better use this instead of invalidate()
		}
	}

	/**
	 * @ignore
	 * @return Disabled?
	 */
	public get __disabled(): boolean {
		return this._internalDisabled;
	}


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
	 * @param value  An instance of NumberFormatter
	 */
	public set numberFormatter(value: NumberFormatter) {
		this._numberFormatter = value;
		this._numberFormatter.language = this.language;
	}

	/**
	 * @return A [[NumberFormatter]] instance to be used
	 */
	public get numberFormatter(): NumberFormatter {
		if (this._numberFormatter) {
			return this._numberFormatter;
		}
		else if (this.virtualParent) {
			return this.virtualParent.numberFormatter;
		}
		else if (this.parent) {
			return this.parent.numberFormatter;
		}
		this._numberFormatter = new NumberFormatter();
		this._numberFormatter.language = this.language;
		return this.numberFormatter;
	}

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
	 * @param value  An instance of DateFormatter
	 */
	public set dateFormatter(value: DateFormatter) {
		this._dateFormatter = value;
		this._dateFormatter.language = this.language;
	}

	/**
	 * @return An instance of DateFormatter
	 */
	public get dateFormatter(): DateFormatter {
		if (this._dateFormatter) {
			return this._dateFormatter;
		}
		else if (this.virtualParent) {
			return this.virtualParent.dateFormatter;
		}
		else if (this.parent) {
			return this.parent.dateFormatter;
		}
		this._dateFormatter = new DateFormatter();
		this._dateFormatter.language = this.language;
		return this.dateFormatter;
	}

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
	 * @param value  An instance of DurationFormatter
	 */
	public set durationFormatter(value: DurationFormatter) {
		this._durationFormatter = value;
		this._durationFormatter.language = this.language;
	}

	/**
	 * @return An instance of DurationFormatter
	 */
	public get durationFormatter(): DurationFormatter {
		if (this._durationFormatter) {
			return this._durationFormatter;
		}
		else if (this.virtualParent) {
			return this.virtualParent.durationFormatter;
		}
		else if (this.parent) {
			return this.parent.durationFormatter;
		}
		this._durationFormatter = new DurationFormatter();
		this._durationFormatter.language = this.language;
		return this.durationFormatter;
	}

	/**
	 * A [[Language]] instance to use for translations.
	 *
	 * Normally it is enough to set language for the top-most element - chart.
	 *
	 * All other element child elements will automatically re-use that language
	 * object.
	 *
	 * @param value  An instance of Language
	 */
	public set language(value: Language) {
		if (this._language.get() !== value) {
			this._language.set(value, value.events.on("localechanged", (ev) => {
				if (this._numberFormatter) {
					this._numberFormatter.language = this.language;
				}
				if (this._dateFormatter) {
					this._dateFormatter.language = this.language;
				}
				if (this._durationFormatter) {
					this._durationFormatter.language = this.language;
				}
				if (this._exporting.get()) {
					const exporting = this._exporting.get();
					exporting.numberFormatter.language = this.language;
					exporting.dateFormatter.language = this.language;
					exporting.durationFormatter.language = this.language;
					exporting.language = this.language;
				}
				if (this instanceof Container) {
					this.deepInvalidate();
				}
			}));
		}
	}

	/**
	 * @return An instance of Language
	 */
	public get language(): Language {
		let language = this._language.get();
		if (language) {
			return language;
		}
		else if (this.virtualParent) {
			return this.virtualParent.language;
		}
		else if (this.parent) {
			return this.parent.language;
		}
		language = new Language();
		this.language = language;
		return language;
	}


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
	 * @param string            A string to format
	 * @param dataItem          DataItem
	 * @return Formatted string
	 */

	public populateString(string: string, dataItem?: DataItem): string {
		if ($type.hasValue(string)) {
			string = $type.castString(string);
			string = getTextFormatter().escape(string);
			let tags = string.match(/\{([^}]+)\}/g);
			let i;
			if (tags) {
				for (i = 0; i < tags.length; i++) {
					let tag = tags[i].replace(/\{([^}]+)\}/, "$1");
					let value = this.getTagValue(tag, "", dataItem);

					if (!$type.hasValue(value)) {
						value = "";
					}

					string = string.split(tags[i]).join(value);
				}
			}
			string = getTextFormatter().unescape(string);
		}
		else {
			string = "";
		}
		if (!this._adapterO) {
			return string;
		}
		else {
			return this._adapterO.apply("populateString", string);
		}
	}

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
	 * @param tagName           Tag name to replace
	 * @param format            Format to use
	 * @param dataItem          DataItem
	 * @return Formatted value
	 */
	public getTagValue(tagName: string, format?: string, dataItem?: DataItem): string {
		let value: any;
		if (!$type.hasValue(dataItem)) {
			dataItem = this.dataItem;
		}

		// Parse parts
		let parts: any[] = [];
		let reg = /([^.]+)\(([^)]*)\)|([^.]+)/g;;
		let matches;

		while (true) {
			matches = reg.exec(tagName);

			if (matches === null) {
				break;
			}

			if (matches[3]) {
				// Simple property
				parts.push({
					prop: matches[3]
				});
			}
			else {
				// Method
				// Parse parameters
				let params: any[] = [];
				if ($utils.trim(matches[2]) != "") {
					let reg2 = /'([^']*)'|"([^"]*)"|([0-9\-]+)/g;
					let matches2;

					while (true) {
						matches2 = reg2.exec(matches[2]);

						if (matches2 === null) {
							break;
						}

						params.push(matches2[1] || matches2[2] || matches2[3])
					}
				}
				parts.push({
					method: matches[1],
					params: params
				})
			}
		}


		// Check if we can retrieve the value from data item
		if (dataItem) {


			// Check values
			value = this.getTagValueFromObject(parts, dataItem.values);

			// Check properties
			if (!$type.hasValue(value) || $type.isObject(value)) { // isObject helps to solve problem with date axis, as for example dateX will get dateX from values object and wont't get to the dateX date.
				value = this.getTagValueFromObject(parts, dataItem);
			}

			// Check data context
			let dataContext: any = dataItem.dataContext;
			if (!$type.hasValue(value) && dataContext) {
				value = this.getTagValueFromObject(parts, dataItem.dataContext);

				// scond data context level sometimes exist (tree map)
				if (!$type.hasValue(value) && dataContext.dataContext) {
					value = this.getTagValueFromObject(parts, dataContext.dataContext);
				}
			}

			// Check component's data item
			if (!$type.hasValue(value) && dataItem.component && dataItem.component.dataItem !== dataItem) {
				value = dataItem.component.getTagValue(tagName, format);
			}
		}

		// Check sprite's properties
		if (!$type.hasValue(value)) {
			value = this.getTagValueFromObject(parts, this.populateStringFrom || <any>this);
		}

		// Finally, check the parent
		if (!$type.hasValue(value) && this.parent) {
			value = this.parent.getTagValue(tagName, format);
		}

		return value;
	}

	/**
	 * Tries to retrieve values from properties of any object, then applies
	 * proper formatting to it.
	 *
	 * @ignore Exclude from docs
	 * @todo Description (improve)
	 * @param parts   Properties ant methods to access
	 * @param object  Source object
	 * @param format  A specific format to apply
	 * @return Formatted value
	 */
	public getTagValueFromObject(parts: any[], object: any, format?: string): any {
		let current: any = object;
		let formatApplied = false;
		for (let i = 0, len = parts.length; i < len; i++) {
			let part = parts[i];
			if (part.prop) {
				// Regular property
				current = current[part.prop];
				if (!$type.hasValue(current)) {
					// Not set, return undefined
					return;
				}
			}
			else {
				// Method

				switch (part.method) {
					case "formatNumber":
						let numberValue = $utils.anyToNumber(current);
						if ($type.hasValue(numberValue)) {
							current = this.numberFormatter.format(
								numberValue,
								format || part.params[0] || undefined
							);
							formatApplied = true;
						}
						break;
					case "formatDate":
						let dateValue;
						if ($type.isString(current)) {
							dateValue = this.dateFormatter.parse(current);
						}
						else {
							dateValue = $utils.anyToDate(current);
						}
						if (!$type.isDate(dateValue) || $type.isNaN(dateValue.getTime())) {
							// Was not able to get date out of value, quitting and letting
							// calling method try another value
							return;
						}
						if ($type.hasValue(dateValue)) {
							current = this.dateFormatter.format(
								dateValue,
								format || part.params[0] || undefined
							);
							formatApplied = true;
						}
						break;
					case "formatDuration":
						let durationValue = $utils.anyToNumber(current);
						if ($type.hasValue(durationValue)) {
							current = this.durationFormatter.format(
								durationValue,
								format || part.params[0] || undefined,
								part.params[1] || undefined
							);
							formatApplied = true;
						}
						break;
					case "urlEncode":
					case "encodeURIComponent":
						current = encodeURIComponent(current);
						break;
					default:
						if (current[part.method]) {
							current[part.method].apply(this, part.params);
						}
						break;
				}
			}
		}

		// Apply default format if it wasn't applied explicitly
		if (!formatApplied) {

			let formatParts = [{
				method: "",
				params: format
			}];

			if (!$type.hasValue(format)) {

				// Format is not set
				// Determine from the type of the value
				if ($type.isNumber(current)) {
					formatParts[0].method = "formatNumber";
					formatParts[0].params = "";
				}
				else if ($type.isDate(current)) {
					formatParts[0].method = "formatDate";
					formatParts[0].params = "";
				}

			}
			else {

				// Format set
				// Try to determine formatter based on the format
				let formatterType: string = $utils.getFormat(format);

				// format
				if (formatterType === $strings.NUMBER) {
					formatParts[0].method = "formatNumber";
				}
				else if (formatterType === $strings.DATE) {
					formatParts[0].method = "formatDate";
				}
				else if (formatterType === $strings.DURATION) {
					formatParts[0].method = "formatDuration";
				}

			}

			// Apply format
			if (formatParts[0].method) {
				current = this.getTagValueFromObject(formatParts, current);
			}

		}

		return current;
	}


	/**
	 * A [[DataItem]] to use as element's data source.
	 *
	 * @todo Review type
	 * @param dataItem  DataItem
	 */
	public set dataItem(dataItem: this["_dataItem"]) {
		//an not use this["_dataItem"] here, as we return parent data item if this sprite doesn't have one.
		// @todo:think about it
		this.setDataItem(dataItem);
	}

	/**
	 * @return [[DataItem]]
	 */
	public get dataItem(): this["_dataItem"] {
		if (!this._dataItem) {
			if (this.virtualParent) {
				return this.virtualParent.dataItem;
			}
			if (this.parent) {
				return this.parent.dataItem;
			}
		}
		return this._dataItem;
	}

	/**
	 * Sets currently used [[DataItem]].
	 *
	 * If the element has also `configField` set, it will also look for any
	 * config in DataItem's data context to apply to this element.
	 *
	 * @param dataItem DataItem
	 */
	protected setDataItem(dataItem: DataItem) {
		if (this._dataItem != dataItem) {
			this._dataItem = dataItem;
			if (dataItem) {
				if (this.configField) {
					let dataContext: any = dataItem.dataContext;
					if (dataContext) {
						this.config = dataContext[this.configField];
						if (!this.config && dataContext.dataContext) {
							this.config = dataContext.dataContext[this.configField];
						}
					}
				}

				let dataContext = <any>dataItem.dataContext;

				if (dataContext) {

					let dataContext2 = dataContext.dataContext;

					$object.each(this.propertyFields, (propertyName, fieldValue) => {
						if ($type.hasValue(dataContext[fieldValue])) {
							let anyThis = <any>this;
							anyThis[propertyName] = dataContext[fieldValue];
						}
						else {
							if (dataContext2) {
								let value = dataContext2[fieldValue];
								if ($type.hasValue(value)) {
									let anyThis = <any>this;
									anyThis[propertyName] = value;
								}
							}
						}
					});
				}
			}

			this.invalidate();
		}
	}


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
	 * @param propertyName  Property name
	 * @return Property value
	 */
	public getPropertyValue<Key extends keyof this["_properties"]>(propertyName: Key): this["_properties"][Key] {
		let propValue: this["_properties"][Key] = this.properties[propertyName];

		// Apply adapter
		if (!this._isTemplate) {
			if (this._adapterO) {
				propValue = this._adapterO.apply(propertyName, <any>propValue);
			}
		}

		return propValue;
	}


	protected setColorProperty<Key extends keyof this["properties"]>(property: Key, value: $type.Optional<Color | Pattern | LinearGradient | RadialGradient>, invalidate?: boolean): boolean {
		let currentValue = this.properties[property];
		if (value instanceof Color && currentValue instanceof Color && value.toString() == currentValue.toString()) {
			return false;
		}
		else {
			return this.setPropertyValue(property, value, invalidate);
		}
	}


	protected setPercentProperty<Key extends keyof this["properties"]>(property: Key, value: Percent | number, invalidate?: boolean, transform?: boolean, precision?: number, floor?: boolean): boolean {
		value = $type.toNumberOrPercent(value);

		if ($type.isNumber(value)) {

			value = $math.round(value, precision, floor);

			return this.setPropertyValue(property, value, invalidate, transform);
		}
		else {
			let currentValue = this.properties[property];

			if (value instanceof Percent && currentValue instanceof Percent && value.value == currentValue.value) {
				return false;
			}
			else {
				return this.setPropertyValue(property, value, invalidate, transform);
			}
		}
	}


	/**
	 * Sets elements's property value. Will also propagate the same property value
	 * on all element's clones.
	 *
	 * @param property    Property
	 * @param value       Value
	 * @param invalidate  Should the sprite be invalidated, cause it's re-rendering
	 * @param transform   Re-apply positioning of the element
	 * @return Did the value change? It will return `true` if the new value and the old value of the property are not the same
	 * @todo Review propagation to clones. Right now we simply check if clone is disposed before setting the same property on it. It's better to remove from clone list altogether.
	 */
	public setPropertyValue<Key extends keyof this["properties"]>(property: Key, value: any, invalidate?: boolean, transform?: boolean): boolean {
		if (this.properties[property] !== value && !this.isDisposed()) {
			this.properties[property] = value;

			if (this.events.isEnabled("propertychanged")) {

				const event: AMEvent<this, ISpriteEvents>["propertychanged"] = {
					type: "propertychanged",
					target: this,
					property: <string>property
				};
				this.events.dispatchImmediately("propertychanged", event);
			}

			if (invalidate) {
				this.invalidate();
			}

			if (transform) {
				this.invalidatePosition();
			}

			if (this.applyOnClones) {
				const clones = this.clones.values;
				const length = clones.length;

				for (let i = 0; i < length; ++i) {
					const clone = clones[i];

					if (!clone.isDisposed()) {
						//(<Sprite>clone).setPropertyValue(<any>property, value, invalidate, transform);
						(<any>clone)[property] = value;
					}
				}
			}
			return true;
		}
		return false;
	}

	/**
	 * @ignore Exclude from docs
	 * @todo Verify this
	 */
	public bind<
		S extends { cloneId: string, events: EventDispatcher<{ propertychanged: { property: string } }> },
		From extends (keyof S & keyof this),
		To extends keyof this
	>(
		property: To,
		source: S,
		bindToProperty: From,
		modifier?: (value: this[From]) => this[To]
	): void;
	public bind<
		S extends { cloneId: string, events: EventDispatcher<{ propertychanged: { property: string } }> },
		Key extends (keyof S & keyof this)
	>(
		property: Key,
		source: S,
		modifier?: (value: this[Key]) => this[Key]
	): void;
	public bind<
		S extends this & { cloneId: string, events: EventDispatcher<{ propertychanged: { property: string } }> },
		Key extends (keyof S & keyof this)
	>(
		property: Key,
		source: S,
		bindToProperty: Key = property,
		modifier?: (value: this[Key]) => this[Key]
	): void {
		if ($type.hasValue(this._bindings[<string>property])) {
			this._bindings[<string>property].dispose();
		}

		// set current value
		this[property] = source[bindToProperty];

		//source.addEventListener(AMEvent.PROPERTY_CHANGED, this.handleBindings, false, this);
		this._bindings[<string>property] = source.events.on("propertychanged", (event) => {
			if (event.property === bindToProperty) {
				let value: this[Key] = source[bindToProperty];

				if (modifier) {
					value = modifier(value);
				}

				// TODO clonesById
				this[property] = value;
			}
		});
	}

	/**
	 * Sets up and obeserver function to monitor changes in particular property
	 * or properties.
	 *
	 * @ignore Exclude from docs
	 * @param property  Element's property name
	 * @param listener  Handler function
	 * @param context   Context for handler function
	 * @returns Event Disposer
	 */
	public observe<C>(property: string | string[], listener: (this: C, event: AMEvent<this, ISpriteEvents>["propertychanged"]) => void, context?: C, shouldClone?: boolean): IDisposer {
		return new MultiDisposer($array.map($array.toArray(property), (prop) => {
			return this.events.on("propertychanged", (e) => {
				if (e.property === prop) {
					listener.call(context, e);
				}
			}, context, shouldClone);
		}));
	}

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
	protected applyAccessibility(): void {

		// Check if we need to add label and description
		let title = this.readerTitle,
			description = this.readerDescription,
			role = this.role,
			hidden = this.readerHidden,
			checked = this.readerChecked,
			controls = this.readerControls,
			live = this.readerLive,
			orientation = this.readerOrientation,
			valueNow = this.readerValueNow,
			valueText = this.readerValueText;

		// Init label/describe ids
		let labelledByIds: string[] = [],
			describedByIds: string[] = [];

		let labelledBy: string = this.readerLabelledBy;
		if (labelledBy) {
			labelledByIds.push(labelledBy);
		}

		let describedBy: string = this.readerDescribedBy;
		if (describedBy) {
			describedByIds.push(describedBy);
		}

		// Consolidate title and description if system tooltip is disabled
		if (!this.showSystemTooltip && title) {
			if (description) {
				description = title + " -- " + description;
			}
			else {
				description = title;
			}
			title = undefined;
		}

		// If we have only label, we use `aria-label` attribute.
		// If there are both label and description, we'll go with separate tags and
		// use `aria-labelledby`
		if (title && !description && !this.showSystemTooltip) {


			// Only label is set, use attribute
			this.setSVGAttribute({
				"aria-label": title
			});

			// Remove previous elements
			this.removeSVGAttribute("aria-description");
			if (this._titleElement) {
				this.group.removeElement(this._titleElement);
				this._titleElement = undefined;
			}
			if (this._descriptionElement) {
				this.group.removeElement(this._descriptionElement);
				this._descriptionElement = undefined;
			}

		}
		else {

			if (title) {
				let titleElement = this.titleElement;
				let titleId = this.uid + "-title";
				if (titleElement.node.textContent != title) {
					titleElement.node.textContent = title;
					titleElement.attr({ id: titleId });
				}
				labelledByIds.push(titleId);
			}
			else if (this._titleElement) {
				this.group.removeElement(this._titleElement);
				this._titleElement = undefined;
			}

			let descriptionId = this.uid + "-description";
			if (description) {
				let descriptionElement = this.descriptionElement;

				if (descriptionElement.node.textContent != description) {
					descriptionElement.node.textContent = description;
					descriptionElement.attr({ id: descriptionId });
				}
				describedByIds.push(descriptionId);
			}
			else if (this._descriptionElement) {
				this.group.removeElement(this._descriptionElement);
				this._descriptionElement = undefined;
				$array.remove(describedByIds, descriptionId);
			}

		}

		// Add label and described properties
		if (labelledByIds.length) {
			this.setSVGAttribute({ "aria-labelledby": labelledByIds.join(" ") });
		}
		else {
			this.removeSVGAttribute("aria-labelledby");
		}

		if (describedByIds.length) {
			this.setSVGAttribute({ "aria-describedby": describedByIds.join(" ") });
		}
		else {
			this.removeSVGAttribute("aria-describedby");
		}

		// Apply role
		if (role) {
			this.setSVGAttribute({ "role": role });
		}
		else {
			this.removeSVGAttribute("role");
		}

		// Apply aria-hidden
		if (hidden) {
			this.setSVGAttribute({ "aria-hidden": "true" });
		}
		else {
			this.removeSVGAttribute("aria-hidden");
		}

		// Apply aria-checked
		if (checked) {
			this.setSVGAttribute({ "aria-checked": "true" });
		}
		else if (checked === false) {
			this.setSVGAttribute({ "aria-checked": "false" });
		}
		else {
			this.removeSVGAttribute("aria-checked");
		}

		// Apply aria-controls
		if (controls) {
			this.setSVGAttribute({ "aria-controls": controls });
		} else {
			this.removeSVGAttribute("aria-controls");
		}

		// Apply aria-live
		if (live) {
			this.setSVGAttribute({ "aria-live": live });
		} else {
			this.removeSVGAttribute("aria-live");
		}

		// Apply aria-orientation
		if (orientation) {
			this.setSVGAttribute({ "aria-orientation": orientation });
		} else {
			this.removeSVGAttribute("aria-orientation");
		}

		// Apply aria-valuenow
		if (valueNow) {
			this.setSVGAttribute({ "aria-valuenow": valueNow });
		} else {
			this.removeSVGAttribute("aria-valuenow");
		}

		// Apply aria-valuetext
		if (valueText) {
			this.setSVGAttribute({ "aria-valuetext": valueText });
		} else {
			this.removeSVGAttribute("aria-valuetext");
		}
	}

	/**
	 * Screen reader title of the element.
	 *
	 * @param value Title
	 */
	public set readerTitle(value: string) {
		value = $type.toText(value);
		if (this.setPropertyValue("readerTitle", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @return Title
	 */
	public get readerTitle(): string {
		const title = this.getPropertyValue("readerTitle");
		if ($type.hasValue(title) && this.dataItem) {
			return this.populateString(title);
		}
		return title;
	}

	/**
	 * Screen reader description of the element.
	 *
	 * @param value Description
	 */
	public set readerDescription(value: string) {
		value = $type.toText(value);
		if (this.setPropertyValue("readerDescription", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @return Description
	 */
	public get readerDescription(): string {
		return this.getPropertyValue("readerDescription");
	}

	/**
	 * A WAI-ARIA role for the element.
	 *
	 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#role_definitions} for more information on WAI-ARIA roles
	 * @param value  Role
	 */
	public set role(value: Roles) {
		value = <Roles>$type.toText(value);
		if (this.setPropertyValue("role", value)) {
			this.applyAccessibility();

			if (value == "slider") {
				this.setSVGAttribute({ "aria-valuemin": "0" });
				this.setSVGAttribute({ "aria-valuemax": "100" });
			}
		}
	}

	/**
	 * @return Role
	 */
	public get role(): Roles {
		return this.getPropertyValue("role");
	}

	/**
	 * Controls if element should be hidden from screen readers.
	 *
	 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-hidden} for more information
	 * @param value  Hidden?
	 */
	public set readerHidden(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("readerHidden", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @return Hidden?
	 */
	public get readerHidden(): boolean {
		return this.getPropertyValue("readerHidden");
	}

	/**
	 * Controls if element is currently marked as "checked".
	 *
	 * @ignore Exclude from docs
	 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-checked} for more information
	 * @param value Checked?
	 */
	public set readerChecked(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("readerChecked", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Checked?
	 */
	public get readerChecked(): boolean {
		return this.getPropertyValue("readerChecked");
	}

	/**
	 * A `uid` of an element this element controls.
	 *
	 * @ignore Exclude from docs
	 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-controls} for more information
	 * @param value Setting value
	 */
	public set readerControls(value: string) {
		value = $type.toText(value);
		if (this.setPropertyValue("readerControls", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Setting value
	 */
	public get readerControls(): string {
		return this.getPropertyValue("readerControls");
	}

	/**
	 * Controls accessibility setting "aria-live" for the element.
	 *
	 * @ignore Exclude from docs
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions} for more information
	 * @param value Setting value
	 */
	public set readerLive(value: AriaLive) {
		value = <AriaLive>$type.toText(value);
		if (this.setPropertyValue("readerLive", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Setting value
	 */
	public get readerLive(): AriaLive {
		return this.getPropertyValue("readerLive");
	}

	/**
	 * A `uid` of an element that describes this element.
	 *
	 * @ignore Exclude from docs
	 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby} for more information
	 * @param value Target element
	 */
	public set readerLabelledBy(value: string) {
		value = $type.toText(value);
		if (this.setPropertyValue("readerLabelledBy", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Target element
	 */
	public get readerLabelledBy(): string {
		return this.getPropertyValue("readerLabelledBy");
	}

	/**
	 * A `uid` of an element that describes this element.
	 *
	 * @ignore Exclude from docs
	 * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-describedby} for more information
	 * @param value Target element
	 */
	public set readerDescribedBy(value: string) {
		value = $type.toText(value);
		if (this.setPropertyValue("readerDescribedBy", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Target element
	 */
	public get readerDescribedBy(): string {
		return this.getPropertyValue("readerDescribedBy");
	}

	/**
	 * Orientation of the element.
	 *
	 * @since 4.7.16
	 * @param value Orientation
	 */
	public set readerOrientation(value: string) {
		value = $type.toText(value);
		if(this.setPropertyValue("readerOrientation", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @return Orientation
	 */
	public get readerOrientation(): string {
		return this.getPropertyValue("readerOrientation");
	}

	/**
	 * Current value of the element.
	 *
	 * @since 4.7.16
	 * @param value Current value
	 */
	public set readerValueNow(value: string) {
		value = $type.toText(value);
		if(this.setPropertyValue("readerValueNow", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @return Current value
	 */
	public get readerValueNow(): string {
		return this.getPropertyValue("readerValueNow");
	}

	/**
	 * Text representation of the current value of the element.
	 *
	 * @since 4.7.16
	 * @param value Current value (text)
	 */
	public set readerValueText(value: string) {
		value = $type.toText(value);
		if(this.setPropertyValue("readerValueText", value)) {
			this.applyAccessibility();
		}
	}

	/**
	 * @return Current value (text)
	 */
	public get readerValueText(): string {
		return this.getPropertyValue("readerValueText");
	}


	/**
	 * ==========================================================================
	 * USER INTERACTIONS
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Returns elements keyboard options.
	 *
	 * @return Keyboard options
	 */
	public get keyboardOptions(): IKeyboardOptions {
		if (!this.interactions.keyboardOptions) {
			if (this.virtualParent) {
				return this.virtualParent.keyboardOptions;
			}
			if (this.parent) {
				return this.parent.keyboardOptions;
			}
		}
		return this.interactions.keyboardOptions;
	}

	/**
	 * Mouse options.
	 *
	 * Enables controlling options related to the mouse, for example sensitivity
	 * of its mouse wheel.
	 *
	 * E.g. the below will reduce chart's wheel-zoom speed to half its default
	 * speed:
	 *
	 * ```TypeScript
	 * chart.plotContainer.mouseOptions.sensitivity = 0.5;
	 * ```
	 * ```JavaScript
	 * chart.plotContainer.mouseOptions.sensitivity = 0.5;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "plotContainer": {
	 *     "mouseOptions": {
	 *       "sensitivity": 0.5
	 *     }
	 *   }
	 * }
	 * ```
	 *
	 * @return Mouse options
	 */
	public get mouseOptions(): IMouseOptions {
		if (!this.interactions.mouseOptions) {
			if (this.virtualParent) {
				return this.virtualParent.mouseOptions;
			}
			if (this.parent) {
				return this.parent.mouseOptions;
			}
		}
		return this.interactions.mouseOptions;
	}

	/**
	 * Returns (creates if necessary) an [[InteractionObject]] associated with
	 * this element.
	 *
	 * [[InteractionObject]] is used to attach all kinds of user-interactions to
	 * the element, e.g. click/touch, dragging, hovering, and similar events.
	 *
	 * @return Interaction object
	 */
	public get interactions(): InteractionObject {
		if (!this._interaction) {
			const interaction = getInteraction().getInteraction(this.dom);
			this._interaction = interaction;
			this._interaction.clickable = this.clickable;
			this._interaction.hoverable = this.hoverable;
			this._interaction.trackable = this.trackable;
			this._interaction.draggable = this.draggable;
			this._interaction.swipeable = this.swipeable;
			this._interaction.resizable = this.resizable;
			this._interaction.wheelable = this.wheelable;
			this._interaction.contextMenuDisabled = this.contextMenuDisabled;
			this._interaction.inert = this.inert;
			this._interaction.sprite = this;
			this._disposers.push(this._interaction);
		}
		return this._interaction;
	}

	/**
	 * Returns true if interactions object was created. Mostly used just to avoid creating interactions object if not needed.
	 * @return Is Sprite interactive?
	 */
	public isInteractive(): boolean {
		if (this._interaction) {
			return true;
		}
		else {
			return false;
		}
	}



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
	 * @param value  Can element be focused?
	 */
	public set focusable(value: Optional<boolean>) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("focusable", value)) {
			if (!value && !this.isInteractive()) {

			}
			else {
				this.interactions.focusable = value;
				if (value) {
					this.setSVGAttribute({ "focusable": value });
				}
				else {
					this.removeSVGAttribute("focusable");
				}
				// Set focus events that would apply "focus" state
				// setEventDisposer will also remove listeners if value == false
				this.interactions.setEventDisposer("sprite-focusable", value, () => new MultiDisposer([
					this.events.on("blur", this.handleBlur, this, false),
					this.events.on("focus", this.handleFocus, this, false)
				]));
			}
		}
	}

	/**
	 * @return Can element be focused?
	 */
	public get focusable(): Optional<boolean> {
		return this.getPropertyValue("focusable");
	}

	/**
	 * Applies filters (if set) when element gains focus.
	 *
	 * @ignore Exclude from docs
	 * @param ev Original event
	 */
	public handleFocus(ev?: AMEvent<Sprite, ISpriteEvents>["focus"]): void {
		if (this.focusable) {
			if (this.topParent) {
				this.topParent.hasFocused = true;
			}
			if (this.focusFilter) {
				// Any `filters` manipulation will trigger `applyFilters()` so we don't
				// need to call it here
				this.filters.push(this.focusFilter);
			}
			if (this.hoverOnFocus) {
				// Trigger a hover event as well
				this.isHover = true;
				this.handleOver();
			}
		}
	}

	/**
	 * Removes focus filter (if set) when elementloses focus.
	 *
	 * @ignore Exclude from docs
	 * @param ev Original event
	 */
	public handleBlur(ev?: AMEvent<Sprite, ISpriteEvents>["blur"]): void {
		if (this.focusable) {
			if (this.topParent) {
				this.topParent.hasFocused = false;
			}
			if (this.focusFilter) {
				// Any `filters` manipulation will trigger `applyFilters()` so we don't
				// need to call it here
				this.filters.removeValue(this.focusFilter);
			}
			if (this.hoverOnFocus) {
				// Trigger a out event as well
				this.isHover = false;
				this.handleOut();
			}
		}
	}

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
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/accessibility/} more about accessibility
	 * @see {@link https://www.amcharts.com/docs/v4/tutorials/changing-appearance-of-focused-items/} cusomizing focus appearance
	 * @ignore Exclude from docs
	 * @return Focused element filter
	 */
	public get focusFilter(): $type.Optional<Filter> {
		/*if (!this._focusFilter) {
			this._focusFilter = new FocusFilter();
			this._disposers.push(this._focusFilter);
		}*/
		//return this._focusFilter;

		const focusFilter = this._focusFilter;

		if (focusFilter) {
			return focusFilter;
		}
		if (this.virtualParent) {
			return this.virtualParent.focusFilter;
		}
		else if (this.parent) {
			return this.parent.focusFilter;
		}

		//this._focusFilter = new FocusFilter();
		//this._disposers.push(this._focusFilter);
	}

	/**
	 * @see {@link Filter}
	 * @ignore Exclude from docs
	 * @todo This is still experimental, don't use it
	 */
	public set focusFilter(value: $type.Optional<Filter>) {
		this._focusFilter = value;
	}

	/**
	 * If set to `true`, this element will also trigger `"over"` event with all
	 * the related consequences, like "hover" state being applied and tooltip
	 * being shown.
	 *
	 * Useful as an accessibility feature to display rollover tooltips on items
	 * selected via keyboard.
	 *
	 * @param value  Trigger hover on focus?
	 * @default false
	 */
	public set hoverOnFocus(value: boolean) {
		if (value !== this.hoverOnFocus) {
			this.setPropertyValue("hoverOnFocus", value);
		}
	}

	/**
	 * @return Trigger hover on focus?
	 */
	public get hoverOnFocus(): boolean {
		return this.getPropertyValue("hoverOnFocus");
	}

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
	 * @param value TAB index
	 */
	public set tabindex(value: number) {
		value = $type.toNumber(value);
		if (this.setPropertyValue("tabindex", value) && $type.isNumber(value)) {
			this.interactions.tabindex = value;
			this.setSVGAttribute({ "tabindex": value });
			if (value > -1) {
				this.focusable = true;
			}
			else {
				this.focusable = undefined;
			}
		}
	}

	/**
	 * Returns current TAB index for focusable item.
	 *
	 * @return TAB index
	 */
	public get tabindex(): $type.Optional<number> {
		const index = this._tabindex;

		if (index != null) {
			return index;
		}
		else if (this.virtualParent) {
			return this.virtualParent.tabindex;
		}
		else if (this.parent) {
			return this.parent.tabindex;
		}
	}


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
	 * @return Inertia options
	 */
	public get inertiaOptions(): Dictionary<InertiaTypes, IInertiaOptions> {
		if (!this.interactions.inertiaOptions) {
			if (this.parent) {
				return this.parent.inertiaOptions;
			}
		}
		return this.interactions.inertiaOptions;
	}

	/**
	 * Controls if the element is draggable.
	 *
	 * @param value  `true` if element can be dragged
	 */
	public set draggable(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("draggable", value)) {

			if (!value && !this.isInteractive()) {

			}
			else {
				this.applyCursorStyle();
				this.interactions.draggable = value;
				//interaction.processDraggable(this);

				// Add events
				// @todo Maybe attach to InteractionObject's multidisposer so that
				// sprites events get disposed together with them?
				// this.interactions.disposers.getItem("movable")
				// setEventDisposer will also remove listeners if value == false
				this.interactions.setEventDisposer("sprite-draggable", value, () => new MultiDisposer([
					this.events.on("down", this.handleDown, this, false),
					this.events.on("dragstart", this.handleDragStart, this, false),
					this.events.on("drag", this.handleDragMove, this, false),
					this.events.on("dragstop", this.handleDragStop, this, false)
				]));
			}
		}
	}

	/**
	 * @return `true` if element can be dragged
	 */
	public get draggable(): boolean {
		return this.getPropertyValue("draggable");
	}

	/**
	 * Executes when dragged element is being started to drag.
	 *
	 * @ignore Exclude from docs
	 */
	protected handleDragStart(ev: AMEvent<Sprite, ISpriteEvents>["dragstart"]): void {
		if (!this.interactions.isTouchProtected || !ev.touch) {
			this.interactions.originalPosition = {
				x: this.pixelX,
				y: this.pixelY
			};
			this._isDragged = true;
			this.hideTooltip(0);
		}
	}

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
	 * @param pointer Pointer to use for movement
	 */
	public dragStart(pointer?: IPointer): void {
		//this.dragStop(pointer);
		//this.draggable = true;
		this._isDragged = true;
		getInteraction().dragStart(this.interactions, pointer);
	}

	/**
	 * Executes when dragged element is being dropped.
	 *
	 * @ignore Exclude from docs
	 */
	protected handleDragStop(ev: AMEvent<Sprite, ISpriteEvents>["dragstop"]): void {
		if (!this.interactions.isTouchProtected || !ev.touch) {
			this._isDragged = false;
			this.showTooltip();
			this.interactions.originalPosition = undefined;
		}
	}

	/**
	 * Stops manually initiated dragging of the element.
	 *
	 * @ignore Exclude from docs
	 * @param pointer Pointer to use as a reference
	 */
	public dragStop(pointer?: IPointer): void {
		//this.draggable = false;
		this._isDragged = false;
		getInteraction().dragStop(this.interactions, pointer);
		//this.handleDragStop();
	}

	/**
	 * Executes when {Sprite} is being dragged.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event object
	 * @todo Implement parent position offset calculation
	 */
	public handleDragMove(ev: AMEvent<Sprite, ISpriteEvents>["drag"]): void {
		if (!this.interactions.isTouchProtected || !ev.touch) {
			let point: Optional<IPoint> = this.interactions.originalPosition;

			if (point && this._isDragged) {
				let globalScale = this.parent.globalScale * this.svgContainer.cssScale;
				this.moveTo({ x: point.x + ev.shift.x / globalScale, y: point.y + ev.shift.y / globalScale }, undefined, undefined, true);
			}

			this.dispatchImmediately("dragged", ev);
		}
	}

	/**
	 * Controls if the element should use inertia when interacted with.
	 *
	 * "Inert" element, when dragged and released, will carry the momentum of the
	 * movement, and will continue moving in the same drag direction, gradually
	 * reducing in speed until finally stops.
	 *
	 * @default false
	 * @param value `true` if element should use inertia when animated
	 */
	public set inert(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("inert", value)) {
			if (!value && !this.isInteractive()) {
				// void
			}
			else {
				this.interactions.inert = value;
			}
		}
	}

	/**
	 * @return `true` if element should use inertia when animated
	 */
	public get inert(): boolean {
		return this.getPropertyValue("inert");
	}

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
	 * @return Options
	 */
	public get hoverOptions(): IHoverOptions {
		if (!this.interactions.hoverOptions) {
			if (this.virtualParent) {
				return this.virtualParent.hoverOptions;
			}
			if (this.parent) {
				return this.parent.hoverOptions;
			}
		}
		return this.interactions.hoverOptions;
	}

	/**
	 * Controls if the element is hoverable (hover events are registered).
	 *
	 * Use `over` and `out` events, to watch for those respective actions.
	 *
	 * @default false
	 * @param value `true` if element can be hovered
	 */
	public set hoverable(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("hoverable", value)) {
			if (!value && !this.isInteractive()) {
				// void
			}
			else {
				this.applyCursorStyle();
				this.interactions.hoverable = value;

				// setEventDisposer will also remove listeners if value == false
				this.interactions.setEventDisposer("sprite-hoverable", value, () => new MultiDisposer([
					this.events.on("over", this.handleOver, this, false),
					this.events.on("out", this.handleOut, this, false),
				]));
			}
		}
	}

	/**
	 * @return `true` if element is hoverable
	 */
	public get hoverable(): boolean {
		return this.getPropertyValue("hoverable");
	}

	/**
	 * Handles tasks when element becomes hovered:
	 * * Shows [[Tooltip]] if applicable
	 * * Applies "hover" state
	 *
	 * @ignore Exclude from docs
	 * @param ev Event object
	 */
	public handleOver(ev?: AMEvent<Sprite, ISpriteEvents>["over"]): void {
		if (this._outTimeout) {
			this._outTimeout.dispose();
		}
		if (this.isHover) {

			if (this.states.hasKey("hover")) {
				//this.setState("hover");
				// This will check `isHover` and will set "hover" state
				if (!this.isHidden) {
					this.applyCurrentState();
				}
			}
			let point: IPoint
			if (ev && ev.pointer) {
				point = $utils.documentPointToSvg(ev.pointer.point, this.svgContainer.SVGContainer, this.svgContainer.cssScale)
			}

			if (this.showTooltipOn == "hover") {
				this.showTooltip(point);
			}
		}
		else {
			if (this.showTooltipOn == "hover") {
				this.hideTooltip();
			}
			if (!this.isHidden && this.states.hasKey("hover")) {
				this.applyCurrentState();
			}
		}
	}

	/**
	 * Handles tasks when element loses hover:
	 *
	 * * Hides [[Tooltip]]
	 * * Applies default state
	 *
	 * @ignore Exclude from docs
	 * @param ev [description]
	 */
	public handleOut(ev?: AMEvent<Sprite, ISpriteEvents>["out"]): void {
		if (this.tooltip && this.tooltip.targetSprite == this && this.tooltip.keepTargetHover) {
			this._outTimeout = this.setTimeout(() => {
				if (!this.tooltip.isHover) {
					if (this.tooltip.targetSprite == this) {
						this.hideTooltip();
					}
					this._outTimeout = this.setTimeout(this.handleOutReal.bind(this), this.rollOutDelay);
				}
			}, 10);
			return;
		}
		if (this.showTooltipOn == "hover") {
			this.hideTooltip();
		}
		this._outTimeout = this.setTimeout(this.handleOutReal.bind(this), this.rollOutDelay);
	}

	/**
	 * [handleOutReal description]
	 *
	 * @ignore
	 * @todo description
	 */
	public handleOutReal() {
		if (!this.isHidden && !this.isHiding && this.states.hasKey("hover")) {
			this.applyCurrentState();
		}
	}


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
	 * @return Options
	 */
	public get hitOptions(): IHitOptions {
		if (!this.interactions.hitOptions) {
			if (this.virtualParent) {
				return this.virtualParent.hitOptions;
			}
			if (this.parent) {
				return this.parent.hitOptions;
			}
		}
		return this.interactions.hitOptions;
	}

	/**
	 * Prepares element's after `down` event.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event
	 */
	public handleDown(ev?: AMEvent<Sprite, ISpriteEvents>["down"]): void {
		if (this.interactions.downPointers.length === 1) {
			this.interactions.originalPosition = {
				x: this.pixelX,
				y: this.pixelY
			};
			this.interactions.originalAngle = this.rotation;
			this.interactions.originalScale = this.scale;
			if (this.states.hasKey("down")) {
				this.setState("down");
			}
		}
	}

	/**
	 * Prepares element's after `up` event.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event
	 */
	public handleUp(ev?: AMEvent<Sprite, ISpriteEvents>["up"]): void {
		/*if (!this.isDown) {
			this.interactions.originalPosition = null;
			this.interactions.originalAngle = null;
			this.interactions.originalScale = null;
		}*/
		this._isResized = false;
		if (this.states.hasKey("down")) {
			this.applyCurrentState();
		}
		if (this.showTooltipOn == "hit") {
			this.showTooltip();
			this._disposers.push(getInteraction().body.events.once("down", (ev) => {
				this.hideTooltip();
			}));
		}
	}

	/**
	 * Indicates if the element is clickable.
	 *
	 * Some type of the elements, like buttons are clickable by default.
	 *
	 * Most of the elements are not clickable by default.
	 *
	 * Use `hit`, `doublehit`, `up`, `down`, `toggled` events to watch for
	 * respective click/touch actions.
	 *
	 * @param value `true` if element can be clicked
	 */
	public set clickable(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("clickable", value)) {
			if (!value && !this.isInteractive()) {
				// void
			}
			else {
				this.applyCursorStyle();
				this.interactions.clickable = value;

				// setEventDisposer will also remove listeners if value == false
				this.interactions.setEventDisposer("sprite-clickable", value, () => new MultiDisposer([
					this.events.on("down", this.handleDown, this, false),
					this.events.on("up", this.handleUp, this, false)
				]));
			}
		}
	}

	/**
	 * @return {boolean}
	 */
	public get clickable(): boolean {
		return this.getPropertyValue("clickable");
	}

	/**
	 * Indicates if element can be toggled on and off by subsequent clicks/taps.
	 *
	 * Togglable element will alternate its `isActive` property between `true`
	 * and `false` with each click.
	 *
	 * @param value Is togglable?
	 */
	public set togglable(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("togglable", value)) {
			if (!value && !this.isInteractive()) {
				// void
			}
			else {
				// setEventDisposer will also remove listeners if value == false
				this.interactions.setEventDisposer("sprite-togglable", value, () => this.events.on("hit", this.handleToggle, this, false));
			}
		}
	}

	/**
	 * @return Is togglable?
	 */
	public get togglable(): boolean {
		return this.getPropertyValue("togglable");
	}

	/**
	 * Handles toggling of the element.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event
	 */
	public handleToggle(ev: AMEvent<Sprite, ISpriteEvents>["hit"]) {
		this.isActive = !this.isActive;
	}

	/**
	 * Should element prevent context menu to be displayed, e.g. when
	 * right-clicked?
	 *
	 * @default false
	 * @param value Context menu disabled?
	 */
	public set contextMenuDisabled(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("contextMenuDisabled", value)) {
			this.interactions.contextMenuDisabled = value;
		}
	}

	/**
	 * @return Context menu disabled?
	 */
	public get contextMenuDisabled(): boolean {
		return this.getPropertyValue("contextMenuDisabled");
	}

	/**
	 * Click-through URL for this element.
	 *
	 * If set, clicking/tapping this element will open the new URL in a target
	 * window/tab as set by `urlTarget`.
	 *
	 * Please note that URL will be parsed by data placeholders in curly
	 * brackets, to be populated from data. E.g.:
	 *
	 * ```TypeScript
	 * series.columns.template.url = "https://www.google.com/search?q={category.urlEncode()}";
	 * ```
	 * ```JavaScript
	 * series.columns.template.url = "https://www.google.com/search?q={category.urlEncode()}";
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     // ...
	 *     "columns": {
	 *       "url": "https://www.google.com/search?q={category.urlEncode()}"
	 *     }
	 *   }]
	 * }
	 * ```
	 *
	 * @param value URL
	 */
	public set url(value: $type.Optional<string>) {
		if (this.setPropertyValue("url", value)) {
			if (this._urlDisposer) {
				this._urlDisposer.dispose();
			}

			// If URL is not empty, set up events
			if ($utils.isNotEmpty(value)) {
				this._urlDisposer = this.events.on("hit", this.urlHandler, this, false);

				// Set other required parameters
				this.clickable = true;
				this.cursorOverStyle = MouseCursorStyle.pointer;
			}
		}
	}

	/**
	 * @return URL
	 */
	public get url(): $type.Optional<string> {
		return this.getPropertyValue("url");
	}

	/**
	 * [baseId description]
	 *
	 * @ignore
	 * @param  value  [description]
	 */
	public set baseId(value: string) {
		this.setBaseId(value);
	}

	/**
	 * [baseId description]
	 *
	 * @ignore
	 * @return [description]
	 */
	public get baseId(): string {
		if (!this._baseId && this.parent) {
			this.baseId = this.parent.baseId;
		}

		return this._baseId;
	}

	protected setBaseId(value: string) {
		if (value != this._baseId) {
			if (this.invalid) {
				this.invalid = false;
				registry.removeFromInvalidSprites(this);
				this.invalidate();
			}
			this._baseId = value;
		}
	}

	/**
	 * Returns the mail chart object that this element belongs to.
	 *
	 * In most cases it will mean the chart object.
	 *
	 * Can be used to retrieve chart object in various events and adapters.
	 *
	 * ```TypeScript
	 * chart.seriesContainer.events.on("hit", function(ev) {
	 *   console.log(ev.target.baseSprite);
	 * });
	 * ```
	 * ```JavaScript
	 * chart.seriesContainer.events.on("hit", function(ev) {
	 *   console.log(ev.target.baseSprite);
	 * });
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "seriesContainer": {
	 *     "events": {
	 *       "hit": function(ev) {
	 *         console.log(ev.target.baseSprite);
	 *       }
	 *     }
	 *   }
	 * }
	 * ```
	 *
	 * @readonly
	 * @return  Base chart object
	 */
	public get baseSprite(): $type.Optional<Sprite> {
		if (this.isBaseSprite) {
			return this;
		}
		else if (this.parent) {
			return this.parent.baseSprite;
		}
	}

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
	 * @param value URL target
	 */
	public set urlTarget(value: string) {
		this.setPropertyValue("urlTarget", value);
	}

	/**
	 * @return URL target
	 */
	public get urlTarget(): string {
		return this.getPropertyValue("urlTarget");
	}

	/**
	 * Handles URL transition on element click.
	 *
	 * @ignore Exclude from docs
	 * @param ev An event object
	 */
	public urlHandler(ev: AMEvent<Sprite, ISpriteEvents>["hit"]): void {
		// Is URL set?
		if ($utils.isNotEmpty(this.url)) {
			// Proceed to the URL
			let url = this.populateString(this.url);
			if (this.urlTarget === "_self") {
				window.location.href = url;
			}
			else {
				window.open(url, this.urlTarget);
			}
		}
	}


	/**
	 * ==========================================================================
	 * SWIPING GESTURE TRACKING
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Returns element's swipe gesture options.
	 *
	 * @return Swipe gesture options
	 */
	public get swipeOptions(): ISwipeOptions {
		if (!this.interactions.swipeOptions) {
			if (this.virtualParent) {
				return this.virtualParent.swipeOptions;
			}
			if (this.parent) {
				return this.parent.swipeOptions;
			}
		}
		return this.interactions.swipeOptions;
	}

	/**
	 * Controls if element is swipeable.
	 *
	 * Swipable element will invoke `swipe`, `swipeleft` and `swiperight` events,
	 * when quick horizontal drag action is performed with either mouse or touch.
	 *
	 * Please note that combining swipe and drag is possible, however will incur
	 * a slight but noticeable delay in drag start.
	 *
	 * @param value  Element swipable?
	 */
	public set swipeable(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("swipeable", value)) {
			this.applyCursorStyle();
			if (!value && !this.isInteractive()) {
				// void
			}
			else {
				this.interactions.swipeable = value;
			}
			//interaction.processSwipeable(this);
		}
	}

	/**
	 * @return Element swipable?
	 */
	public get swipeable(): boolean {
		return this.getPropertyValue("swipeable");
	}


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
	 * @param value Track cursor movement over element?
	 */
	public set trackable(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("trackable", value)) {
			if (!value && !this.isInteractive()) {
				// void
			}
			else {
				this.applyCursorStyle();
				this.interactions.trackable = value;
			}
			//interaction.processTrackable(this);
		}
	}

	/**
	 * @return Track cursor movement over element?
	 */
	public get trackable(): boolean {
		return this.getPropertyValue("trackable");
	}


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
	 * @param value Mouse wheel events enabled?
	 */
	public set wheelable(value: boolean) {
		if (this.setPropertyValue("wheelable", value)) {
			if (!value && !this.isInteractive()) {
				// void
			}
			else {
				this.applyCursorStyle();
				this.interactions.wheelable = value;
			}
			//interaction.processWheelable(this);
		}
	}

	/**
	 * @return Mouse wheel events enabled?
	 */
	public get wheelable(): boolean {
		return this.getPropertyValue("wheelable");
	}

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
	 * @param value  Element resizable?
	 */
	public set resizable(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("resizable", value)) {
			if (!value && !this.isInteractive()) {
				// void
			}
			else {
				this.applyCursorStyle();
				this.interactions.resizable = value;
				// setEventDisposer will also remove listeners if value == false
				this.interactions.setEventDisposer("sprite-resizable", value, () => new MultiDisposer([
					this.events.on("down", this.handleDown, this, false),
					this.events.on("resize", this.handleResize, this, false)
				]));
			}
		}
	}

	/**
	 * @return Element resizable?
	 */
	public get resizable(): boolean {
		return this.getPropertyValue("resizable");
	}

	/**
	 * Handles resize intermediate step.
	 *
	 * By default this method resizes actual element. Each element, can override
	 * this method to implement their own resize logic.
	 *
	 * @ignore Exclude from docs
	 * @param ev Event object
	 */
	public handleResize(ev: AMEvent<Sprite, ISpriteEvents>["resize"]): void {
		if (!this.interactions.isTouchProtected || !ev.touch) {
			this._isResized = true;

			this.scale = this.interactions.originalScale * ev.scale;

			this.validatePosition();
			/*center: (io.draggable
			? $math.getMidPoint(point1, point2)
			: {
				"x": io.originalPosition.x,
				"y": io.originalPosition.y
			})*/
			//this.moveTo(this.originalPosition.x + ev.shift.x, this.originalPosition.y + ev.shift.y);
			if (this.draggable || this.dragWhileResize) {
				this._isDragged = false;
				let svgPoint1: IPoint = $utils.documentPointToSvg(ev.point1, this.htmlContainer, this.svgContainer.cssScale);
				let svgPoint2: IPoint = $utils.documentPointToSvg(ev.point2, this.htmlContainer, this.svgContainer.cssScale);
				let svgMidPoint: IPoint = $math.getMidPoint(svgPoint1, svgPoint2);

				let parentPoint1: IPoint = $utils.documentPointToSprite(ev.startPoint1, this.parent);
				let parentPoint2: IPoint = $utils.documentPointToSprite(ev.startPoint2, this.parent);

				let originalPosition: Optional<IPoint> = this.interactions.originalPosition;
				let originalScale: number = this.interactions.originalScale;

				if (originalPosition) {
					let spritePoint1: IPoint = { x: (parentPoint1.x - originalPosition.x) / originalScale, y: (parentPoint1.y - originalPosition.y) / originalScale };
					let spritePoint2: IPoint = { x: (parentPoint2.x - originalPosition.x) / originalScale, y: (parentPoint2.y - originalPosition.y) / originalScale };

					let spriteMidPoint: IPoint = $math.getMidPoint(spritePoint1, spritePoint2);

					let parentPoint: IPoint = $utils.svgPointToSprite(svgMidPoint, this.parent);
					this.moveTo({ x: parentPoint.x - spriteMidPoint.x * this.scale, y: parentPoint.y - spriteMidPoint.y * this.scale }, undefined, undefined, true);
				}
			}
		}
	}


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
	 * @return Cursor options
	 */
	public get cursorOptions(): ICursorOptions {
		if (!this.interactions.cursorOptions) {
			if (this.virtualParent) {
				return this.virtualParent.cursorOptions;
			}
			if (this.parent) {
				return this.parent.cursorOptions;
			}
		}
		return this.interactions.cursorOptions;
	}

	/**
	 * A shortcut to setting mouse cursor on hover.
	 *
	 * Example:
	 *
	 * ```TypeScript
	 * series.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
	 * ```
	 * ```JavaScript
	 * series.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": {
	 *     // ...
	 *     "slices": {
	 *       "cursorOverStyle": "pointer"
	 *     }
	 *   }
	 * }
	 * ```
	 *
	 * @param style An array of styles to apply onhover
	 */
	public set cursorOverStyle(style: Array<IStyleProperty>) {
		if (!this.cursorOptions.overStyle) {
			this.interactions.cursorOptions = {
				defaultStyle: this.cursorOptions.defaultStyle
			};
		}
		this.cursorOptions.overStyle = style;
		getInteraction().applyCursorOverStyle(this.interactions);
	}

	/**
	 * A shortcut to setting mouse cursor when button is pressed down.
	 *
	 * Example:
	 *
	 * ```TypeScript
	 * series.slices.template.cursorDownStyle = am4core.MouseCursorStyle.grabbing;
	 * ```
	 * ```JavaScript
	 * series.slices.template.cursorDownStyle = am4core.MouseCursorStyle.grabbing;
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": {
	 *     // ...
	 *     "slices": {
	 *       "cursorDownStyle": "grabbing"
	 *     }
	 *   }
	 * }
	 * ```
	 *
	 * @param style An array of styles to apply onhover
	 */
	public set cursorDownStyle(style: Array<IStyleProperty>) {
		this.cursorOptions.downStyle = style;
	}

	/**
	 * Applies default cursor styles for interactable elements.
	 *
	 * @ignore Exclude from docs
	 * @todo Determine if this is necessary. Maybe let's not apply any cursor styles by default
	 */
	public applyCursorStyle(): void {

		// Draggable styles
		/*if (this.draggable) {

			if (!$type.hasValue(this.cursorOptions.overStyle)) {
				this.cursorOptions.overStyle = MouseCursorStyle.grab;
			}

			if (!$type.hasValue(this.cursorOptions.downStyle)) {
				this.cursorOptions.downStyle = MouseCursorStyle.grabbing;
			}
		}*/

	}

	/**
	 * Setting this to `false` will effectively disable all interactivity on the
	 * element.
	 *
	 * @param value  Is interaction enabled for this element?
	 */
	public set interactionsEnabled(value: boolean) {
		value = $type.toBoolean(value);

		if (this.setPropertyValue("interactionsEnabled", value)) {
			let pointerEvents = null; // must be null, not "null"!
			if (!value) {
				pointerEvents = "none";
			}
			else {
				// this is for IE
				this.group.node.style.pointerEvents = "";
			}
			this.group.node.style.pointerEvents = pointerEvents;
		}
	}

	/**
	 * @return Is interaction enabled for this element?
	 */
	public get interactionsEnabled(): boolean {
		let value = this.getPropertyValue("interactionsEnabled");
		if (value === false) {
			return false;
		}
		if (this.virtualParent) {
			return this.virtualParent.interactionsEnabled;
		}
		if (this.parent) {
			return this.parent.interactionsEnabled;
		}
		return true;
	}

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
	 * @param exp  Export
	 */
	public set exporting(exp: Export) {
		this._exporting.set(exp, exp);
	}

	/**
	 * @return Export instance
	 */
	public get exporting(): Export {
		return this.getExporting();
	}

	/**
	 * This is here as a method so that inheriting classes could override it.
	 *
	 * @return Export instance
	 */
	protected getExporting(): Export {
		let _export = this._exporting.get();

		if (_export) {
			return _export;
		}
		else {
			if (this.isStandaloneInstance || !this.parent) {
				_export = new Export(this.svgContainer.SVGContainer);
				_export.sprite = this;
				_export.language = this.language;
				_export.numberFormatter = this.numberFormatter;
				_export.dateFormatter = this.dateFormatter;
				_export.durationFormatter = this.durationFormatter;
				this._exporting.set(_export, _export);
			}
			else {
				return this.parent.exporting;
			}
		}
		return _export;
	}

	/**
	 * If set to `false` this element will be omitted when exporting the chart
	 * to an image.
	 *
	 * @default true
	 * @param value  Export?
	 */
	public set exportable(value: boolean) {
		const svgContainer = this.svgContainer;
		this._exportable = value;
		if (svgContainer) {
			if (value) {
				$array.remove(svgContainer.nonExportableSprites, this);
			}
			else if ($array.indexOf(svgContainer.nonExportableSprites, this) == -1) {
				svgContainer.nonExportableSprites.push(this);
			}
		}
	}

	/**
	 * @return Export?
	 */
	public get exportable(): boolean {
		return this._exportable;
		/*const svgContainer = this.svgContainer;
		return !svgContainer || $array.indexOf(svgContainer.nonExportableSprites, this) == -1;*/
	}


	/**
	 * ==========================================================================
	 * MODAL/POPUP RELATED STUFF
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Private method to be used for "classPrefix" adapter for modals/popups.
	 *
	 * @param value  Prefix
	 */
	private modalPrefix(value: string) {
		value = options.classNamePrefix + value;
		return value;
	}

	/**
	 * Returns a [[Modal]] instance, associated with this chart.
	 * (elements top parent)
	 *
	 * Accessing modal does not make it appear. To make a modal appear, use
	 * `showModal()` method.
	 *
	 * @see {@link Modal} for more information about using Modal windows
	 * @return Modal instance
	 */
	public get modal(): Optional<Modal> {
		const svgContainer = this.svgContainer;
		if (svgContainer) {
			const modal = svgContainer.modal;
			if (!modal.adapter.has("classPrefix", this.modalPrefix)) {
				modal.adapter.add("classPrefix", this.modalPrefix);
			}
			return modal;
		}

	}

	/**
	 * Opens a modal window with specific content (`text` parameter) and,
	 * optionally, `title`.
	 *
	 * The `text` parameter can contain HTML content.
	 *
	 * @see {@link Modal} for more information about using Modal windows
	 * @param text   Modal contents
	 * @param title  Title for the modal window
	 */
	public openModal(text: string, title?: string): Optional<Modal> {
		const svgContainer = this.svgContainer;
		if (svgContainer) {
			return svgContainer.openModal(text, title);
		}
	}

	/**
	 * Hides modal window if there is one currently open.
	 */
	public closeModal(): void {
		const svgContainer = this.svgContainer;
		if (svgContainer) {
			svgContainer.closeModal();
		}
	}

	/**
	 * A list of popups for this chart.
	 *
	 * @return Popups
	 */
	public get popups(): Optional<ListTemplate<Popup>> {
		const svgContainer = this.svgContainer;
		if (svgContainer) {
			const popups = svgContainer.popups;
			popups.template.sprite = this;

			if (!popups.template.adapter.has("classPrefix", this.modalPrefix)) {
				popups.template.adapter.add("classPrefix", this.modalPrefix);
			}
			return popups;
		}

	}

	/**
	 * Creates, opens, and returns a new [[Popup]] window.
	 *
	 * `text` can be any valid HTML.
	 *
	 * `title` is currently not supported.
	 *
	 * @param text   Popup contents
	 * @param title  Popup title
	 * @return Popup instance
	 */
	public openPopup(text: string, title?: string): Optional<Popup> {
		const svgContainer = this.svgContainer;
		if (svgContainer) {
			return svgContainer.openPopup(text, title);
		}
	}

	/**
	 * Closes all currently open popup windows
	 */
	public closeAllPopups(): void {
		const svgContainer = this.svgContainer;
		if (svgContainer) {
			svgContainer.closeAllPopups();
		}
	}


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
	 * @param value X coordinate
	 */
	public set x(value: number | Percent) {
		if (!this.isDragged) {
			this.setPercentProperty("x", value, false, true, this._positionPrecision, true);
		}
	}

	/**
	 * @return X coordinate
	 */
	public get x(): number | Percent {
		return this.getPropertyValue("x");
	}

	/**
	 * Returns element's current absolute X coordinate in pixels.
	 *
	 * @readonly
	 * @return X coordinate (px)
	 */
	public get pixelX(): number {
		let value = $math.fitToRange(this.getPixelX(this.x), this.minX, this.maxX);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("pixelX", value);

		}
	}

	/**
	 * Returns element's current relative X coordinate in [[Percent]].
	 *
	 * @return X coordinate ([[Percent]])
	 */
	public get relativeX(): number {
		if (!this._adapterO) {
			return this.getRelativeX(this.x)
		}
		else {
			return this._adapterO.apply("relativeX", this.getRelativeX(this.x));
		}
	}

	/**
	 * The smallest allowable absolute X coordinate for this element.
	 *
	 * This is used to contain element movement within certain boundaries.
	 *
	 * @ignore Exclude from docs
	 * @param value Min X (px)
	 */
	public set minX(value: number) {
		if ($type.isNumber(value)) {
			value = $math.round(value, this._positionPrecision, true);
			this.setPropertyValue("minX", value, false, true);
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Min X (px)
	 */
	public get minX(): number {
		return this.getPropertyValue("minX");
	}

	/**
	 * The biggest allowable absolute X coordinate for this element.
	 *
	 * This is used to contain element movement within certain boundaries.
	 *
	 * @ignore Exclude from docs
	 * @param value Max X (px)
	 */
	public set maxX(value: number) {
		if ($type.isNumber(value)) {
			value = $math.round(value, this._positionPrecision, true);
			this.setPropertyValue("maxX", value, false, true);
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Max X (px)
	 */
	public get maxX(): number {
		return this.getPropertyValue("maxX");
	}

	/**
	 * Element's absolute or relative Y coordinate.
	 *
	 * If setting both X and Y, please consider using `moveTo()` method instead,
	 * as it will be faster to set both coordinates at once.
	 *
	 * @param value  Y coordinate
	 */
	public set y(value: number | Percent) {
		if (!this.isDragged) {
			this.setPercentProperty("y", value, false, true, this._positionPrecision, true);
		}
	}

	/**
	 * @return Y coordinate
	 */
	public get y(): number | Percent {
		return this.getPropertyValue("y");
	}

	/**
	 * Returns element's current absolute Y coordinate in pixels.
	 *
	 * @readonly
	 * @return Y coordinate (px)
	 */
	public get pixelY(): number {
		let value = $math.fitToRange(this.getPixelY(this.y), this.minY, this.maxY);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("pixelY", value);
		}
	}

	/**
	 * Returns element's current relative Y coordinate in [[Percent]].
	 *
	 * @readonly
	 * @return Y coordinate ([[Percent]])
	 */
	public get relativeY(): number {
		if (!this._adapterO) {
			return this.getRelativeX(this.y);
		}
		else {
			return this._adapterO.apply("relativeY", this.getRelativeX(this.y));
		}
	}

	/**
	 * The smallest allowable absolute Y coordinate for this element.
	 *
	 * This is used to contain element movement within certain boundaries.
	 *
	 * @ignore Exclude from docs
	 * @param value Min Y (px)
	 */
	public set minY(value: number) {
		if ($type.isNumber(value)) {
			value = $math.round(value, this._positionPrecision, true);
			this.setPropertyValue("minY", value, false, true);
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Min Y (px)
	 */
	public get minY(): number {
		return this.getPropertyValue("minY");
	}

	/**
	 * The biggest allowable absolute Y coordinate for this element.
	 *
	 * This is used to contain element movement within certain boundaries.
	 *
	 * @ignore Exclude from docs
	 * @param value  Max Y (px)
	 */
	public set maxY(value: number) {
		if ($type.isNumber(value)) {
			value = $math.round(value, this._positionPrecision, true);
			this.setPropertyValue("maxY", value, false, true);
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Max Y (px)
	 */
	public get maxY(): number {
		return this.getPropertyValue("maxY");
	}

	/**
	 * A horizontal offset for the element in pixels.
	 *
	 * Can be negative value for offset to the left.
	 *
	 * @param value  Horizontal offset (px)
	 */
	public set dx(value: number) {
		if ($type.isNumber(value)) {
			value = $math.round(value, this._positionPrecision, true);
			this.setPropertyValue("dx", value, false, true);
		}
	}

	/**
	 * @return Horizontal offset (px)
	 */
	public get dx(): number {
		return this.getPropertyValue("dx");
	}

	/**
	 * A vertical offset for the element in pixels.
	 *
	 * Can be negative value for offset upwards.
	 *
	 * @param value  Vertical offset (px)
	 */
	public set dy(value: number) {
		if ($type.isNumber(value)) {
			value = $math.round(value, this._positionPrecision, true);
			this.setPropertyValue("dy", value, false, true);
		}
	}

	/**
	 * @return Vertical offset (px)
	 */
	public get dy(): number {
		return this.getPropertyValue("dy");
	}

	/**
	 * Rotation of the element in degrees. (0-360)
	 *
	 * @param value  Rotation (0-360)
	 */
	public set rotation(value: number) {
		value = $type.toNumber(value);
		if (!$type.isNumber(value)) {
			value = 0;
		}
		this.setPropertyValue("rotation", value, false, true);
	}

	/**
	 * @return Rotation (0-360)
	 */
	public get rotation(): number {
		return this.getPropertyValue("rotation");
	}

	/**
	 * Controls horizontal alignment of the element.
	 *
	 * This is used by parent [[Container]] when layouting its children.
	 *
	 * @param value  Horizontal align
	 */
	public set align(value: Align) {
		value = <Align>$type.toText(value);
		if (this.setPropertyValue("align", value)) {
			if (this.parent) {
				this.parent.invalidateLayout();
			}
		}
	}

	/**
	 * @return Horizontal align
	 */
	public get align(): Align {
		return this.getPropertyValue("align");
	}

	/**
	 * Controls vertical alignment of the element.
	 *
	 * This is used by parent [[Container]] when layouting its children.
	 *
	 * @param value  Vertical align
	 */
	public set valign(value: VerticalAlign) {
		value = <VerticalAlign>$type.toText(value);
		if (this.setPropertyValue("valign", value)) {
			if (this.parent) {
				this.parent.invalidateLayout();
			}
		}
	}

	/**
	 * @return Vertical align
	 */
	public get valign(): VerticalAlign {
		return this.getPropertyValue("valign");
	}

	/**
	 * Controls which part of the element to treat as a horizontal center.
	 *
	 * The setting will be used when positioning, resizing and rotating the
	 * element.
	 *
	 * @param value  Horizontal center
	 */
	public set horizontalCenter(value: HorizontalCenter) {
		value = <HorizontalCenter>$type.toText(value);
		if (this.setPropertyValue("horizontalCenter", value)) {
			this.updateCenter();
		}
	}

	/**
	 * @return Horizontal center
	 */
	public get horizontalCenter(): HorizontalCenter {
		return this.getPropertyValue("horizontalCenter");
	}

	/**
	 * Controls which part of the element to treat as a vertical center.
	 *
	 * The setting will be used when positioning, resizing and rotating the
	 * element.
	 *
	 * @param value  Vertical center
	 */
	public set verticalCenter(value: VerticalCenter) {
		value = <VerticalCenter>$type.toText(value);
		if (this.setPropertyValue("verticalCenter", value)) {
			this.updateCenter();
		}
	}

	/**
	 * @return Vertical center
	 */
	public get verticalCenter(): VerticalCenter {
		return this.getPropertyValue("verticalCenter");
	}


	/**
	 * ==========================================================================
	 * DIMENSIONAL PROPERTIES AND RELATED STUFF
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Maximum allowed width for the element in pixels.
	 *
	 * @param value  Maximum width (px)
	 */
	public set maxWidth(value: number) {
		this.setMaxWidth(value);
	}

	protected setMaxWidth(value: number) {
		let prevWidth = this.maxWidth;
		let prevHeight = this.maxHeight;
		if (this.setPropertyValue("maxWidth", value)) {
			if ($type.isNumber(this.relativeWidth)) {
				this.invalidate();
			}

			const event: AMEvent<this, ISpriteEvents>["maxsizechanged"] = {
				type: "maxsizechanged",
				target: this,
				previousWidth: prevWidth,
				previousHeight: prevHeight
			};

			this.dispatchImmediately("maxsizechanged", event);
		}
	}

	/**
	 * @return Maximum width (px)
	 */
	public get maxWidth(): number {
		let maxWidth = this.getPropertyValue("maxWidth");

		if (!$type.isNumber(maxWidth)) {
			if (this.parent) {
				return this.parent.maxWidth;
			}
		}
		return maxWidth;
	}

	/**
	 * Maximum allowed height for the element in pixels.
	 *
	 * @param value  Maximum height (px)
	 */
	public set maxHeight(value: number) {
		this.setMaxHeight(value);
	}

	protected setMaxHeight(value: number) {

		let prevWidth = this.maxWidth;
		let prevHeight = this.maxHeight;

		if (this.setPropertyValue("maxHeight", value)) {

			if ($type.isNumber(this.relativeHeight)) {
				this.invalidate();
			}

			const event: AMEvent<this, ISpriteEvents>["maxsizechanged"] = {
				type: "maxsizechanged",
				target: this,
				previousWidth: prevWidth,
				previousHeight: prevHeight
			};

			this.dispatchImmediately("maxsizechanged", event);
		}
	}

	/**
	 * @return Maximum height (px)
	 */
	public get maxHeight(): number {
		let maxHeight = this.getPropertyValue("maxHeight");
		if (!$type.isNumber(maxHeight)) {
			if (this.parent) {
				return this.parent.maxHeight;
			}
		}
		return maxHeight;
	}

	/**
	 * Minimum width of the element in pixels.
	 *
	 * Set to `undefined` to remove the limit.
	 *
	 * @param value  Minimum width (px)
	 */
	public set minWidth(value: Optional<number>) {
		this.setPropertyValue("minWidth", value, true);
	}

	/**
	 * @return Minimum width (px)
	 */
	public get minWidth(): Optional<number> {
		return this.getPropertyValue("minWidth");
	}

	/**
	 * Minimum height for the element in pixels.
	 *
	 * Set to `undefined` to remove the limit.
	 *
	 * @param value  Minimum height (px)
	 */
	public set minHeight(value: Optional<number>) {
		this.setPropertyValue("minHeight", value, true);
	}

	/**
	 * @return Minimum height (px)
	 */
	public get minHeight(): Optional<number> {
		return this.getPropertyValue("minHeight");
	}

	/**
	 * Element's absolute or relative width.
	 *
	 * The width can either be absolute, set in numeric pixels, or relative, set
	 * in [[Percent]].
	 *
	 * Relative width will be calculated using closest measured ancestor
	 * [[Container]].
	 *
	 * @param value  Width (numeric in pixels or relative)
	 */
	public set width(value: number | Percent) {

		let changed: boolean = this.setPercentProperty("width", value, true, false, this._positionPrecision, true);

		if (changed) {
			this.percentWidth = undefined;
			this.relativeWidth = undefined;

			if (value instanceof Percent) {
				this.percentWidth = value.percent;
				if ($type.isNumber(this._pixelWidth)) {
					this.maxWidth = undefined;
				}
				this._pixelWidth = undefined;
			}
			else {
				this._pixelWidth = Number(value);
				//this._measuredWidth = this._pixelWidth;
				this.maxWidth = this._pixelWidth;
			}
			this.invalidatePosition();
		}
	}

	/**
	 * @return Width (absolute or relative)
	 */
	public get width(): number | Percent {
		return this.getPropertyValue("width");
	}

	/**
	 * Element's absolute or relative height.
	 *
	 * The height can either be absolute, set in numeric pixels, or relative, set
	 * in [[Percent]].
	 *
	 * Relative height will be calculated using closest measured ancestor
	 * [[Container]].
	 *
	 * @param value  Height (numeric in pixels or relative)
	 */
	public set height(value: number | Percent) {

		let changed: boolean = this.setPercentProperty("height", value, true, false, this._positionPrecision, true);

		if (changed) {
			this.percentHeight = undefined;
			this._relativeHeight = undefined;

			if (value instanceof Percent) {
				this.percentHeight = value.percent;
				if ($type.isNumber(this._pixelHeight)) {
					this.maxHeight = undefined;
				}
				this._pixelHeight = undefined;
			}
			else {
				this._pixelHeight = Number(value);
				//this._measuredHeight = this._pixelHeight;
				this.maxHeight = this._pixelHeight; // yes, we reset maxWidth
			}

			this.invalidatePosition();
		}
	}

	/**
	 * @return height (absolute or relative)
	 */
	public get height(): number | Percent {
		return this.getPropertyValue("height");
	}

	/**
	 * Returns element's width in pixels, if width was set. For actual width use measuredWidth property.
	 *
	 * @readonly
	 * @return Width (px)
	 */
	public get pixelWidth(): number {
		let width: number;
		if ($type.isNumber(this.percentWidth)) {
			width = this.maxWidth;
		}
		else if ($type.isNumber(this._pixelWidth)) {
			width = this._pixelWidth;
		}
		else {
			width = 0;
		}

		const minWidth = this.minWidth;

		if (minWidth != null && width < minWidth) {
			width = minWidth;
		}
		let value = $math.round(width, this._positionPrecision, true);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("pixelWidth", value);
		}
	}

	/**
	 * Returns element's height in pixels. For actual height use measuredHeight property.
	 *
	 * @readonly
	 * @return Height (px)
	 */
	public get pixelHeight(): number {
		let height: number;
		if ($type.isNumber(this.percentHeight)) {
			height = this.maxHeight;
		}
		else if ($type.isNumber(this._pixelHeight)) {
			height = this._pixelHeight;
		}
		else {
			height = 0//this._measuredHeightSelf;
		}

		const minHeight = this.minHeight;

		if (minHeight != null && height < minHeight) {
			height = minHeight;
		}
		let value = $math.round(height, this._positionPrecision, true);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("pixelHeight", value);
		}
	}

	/**
	 * Element's relative width in [[Percent]].
	 * @ignore
	 *
	 * @param value  Relative width
	 */
	public set relativeWidth(value: $type.Optional<number>) {
		if (this._relativeWidth != value) {
			this._relativeWidth = value;
			//			this.invalidate();
		}
	}

	/**
	 * @return Relative width
	 * @ignore
	 */
	public get relativeWidth(): $type.Optional<number> {
		const relativeWidth = this._relativeWidth;

		if ($type.isNumber(relativeWidth)) {
			if (!this._adapterO) {
				return relativeWidth;
			}
			else {
				return this._adapterO.apply("relativeWidth", relativeWidth);
			}
		}
	}

	/**
	 * Element's relative height in [[Percent]].
	 *
	 * @param value  Relative height
	 * @ignore
	 */
	public set relativeHeight(value: $type.Optional<number>) {
		if (this._relativeHeight != value) {
			this._relativeHeight = value;
			//			this.invalidate();
		}
	}

	/**
	 * @return Relative height
	 * @ignore
	 */
	public get relativeHeight(): $type.Optional<number> {
		const relativeHeight = this._relativeHeight;

		if ($type.isNumber(relativeHeight)) {
			if (!this._adapterO) {
				return relativeHeight;
			}
			else {
				return this._adapterO.apply("relativeHeight", relativeHeight);
			}
		}
	}

	/**
	 * Returns element's measured width in pixels.
	 *
	 * A measured width is actual width of contents plus `paddingRight` and* `paddingLeft`, relative to sprite parent, meaning that
	 * rotation and scale is taken into account.
	 *
	 * @readonly
	 * @return Width (px)
	 */
	public get measuredWidth(): number {

		if (this.disabled || this.__disabled) {
			return 0;
		}
		if (!this._adapterO) {
			return this._measuredWidth;
		}
		else {
			return this._adapterO.apply("measuredWidth", this._measuredWidth);
		}
		// it's not good to fit to min/max range as then rotations and scale won't be taken into account
		//return this.adapter.apply("measuredWidth", $math.fitToRange(this._measuredWidth, this.minWidth, this.maxWidth));
	}

	/**
	 * Returns elements's measured height in pixels.
	 *
	 * A measured height is actual height of contents plus `paddingTop` and `paddingBottom`, relative to sprite parent, meaning that
	 * rotation and scale taken into account.
	 *
	 * @readonly
	 * @return Height (px)
	 */
	public get measuredHeight(): number {

		if (this.disabled || this.__disabled) {
			return 0;
		}

		// it's not good to fit to min/max range as then rotations and scale won't be taken into account
		//return this.adapter.apply("measuredHeight", $math.fitToRange(this._measuredHeight, this.minHeight, this.maxHeight));
		if (!this._adapterO) {
			return this._measuredHeight;
		}
		else {
			return this._adapterO.apply("measuredHeight", this._measuredHeight);
		}
	}

	/**
	 * Returns element's measured width plus its left and right margins in
	 * pixels.
	 *
	 * @readonly
	 * @return Outer width (px)
	 */
	public get outerWidth(): number {
		let value = this.pixelWidth + this.pixelMarginRight + this.pixelMarginLeft;
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("outerWidth", value);
		}
	}

	/**
	 * Returns element's measured height plus its top and bottom margins in
	 * pixels.
	 *
	 * @readonly
	 * @return Outer height (px)
	 */
	public get outerHeight(): number {
		let value = this.pixelHeight + this.pixelMarginTop + this.pixelMarginBottom;
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("outerHeight", value);
		}
	}

	/**
	 * Returns element's measured inner width in pixels.
	 *
	 * Inner width is actual available space for content, e.g. element's width
	 * minus horizontal padding.
	 *
	 * @readonly
	 * @return Inner width (px)
	 */
	public get innerWidth(): number {
		let value = Math.max(0, this.pixelWidth - this.pixelPaddingRight - this.pixelPaddingLeft);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("innerWidth", value);
		}
	}

	/**
	 * Returns element's measured inner height in pixels.
	 *
	 * Inner height is actual available space for content, e.g. element's height
	 * minus vertical padding.
	 *
	 * @readonly
	 * @return Inner height (px)
	 */
	public get innerHeight(): number {
		let value = Math.max(0, this.pixelHeight - this.pixelPaddingTop - this.pixelPaddingBottom);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("innerHeight", value);
		}
	}

	/**
	 * Returns element's current "global" scale.
	 *
	 * Scale values accumulate over hierarchy of elements.
	 *
	 * E.g. if a [[Container]] has `scale = 2` and it's child has a `scale = 2`,
	 * the child's `globalScale` will be 4. (a multitude of `2 x 2`)
	 *
	 * @readonly
	 * @return Global scale
	 */
	public get globalScale(): number {
		let scale: number = this.scale;
		if (this.parent) {
			scale = scale * this.parent.globalScale;
		}
		if (!this._adapterO) {
			return scale;
		}
		else {
			return this._adapterO.apply("globalScale", scale);
		}
	}

	/**
	 * Scale of the element.
	 *
	 * The scale is set from 0 (element reduced to nothing) to 1 (default size).
	 * * 2 will mean element is increased twice.
	 * * 0.5 - reduced by 50%.
	 *
	 * Etc.
	 *
	 * @param value  Scale (0-1)
	 */
	public set scale(value: number) {
		value = $type.toNumber(value);
		if (value < 0) {
			value = 0;
		}
		if (value != this.getPropertyValue("scale")) {
			this.setPropertyValue("scale", value, false, true);
			this.handleGlobalScale();
		}
	}

	/**
	 * @return Scale (0-1)
	 */
	public get scale(): number {
		return this.getPropertyValue("scale");
	}

	/**
	 * Sets all four margins for the element at once.
	 *
	 * Margins are set in pixels.
	 *
	 * @param top     Top margin
	 * @param right   Right margin
	 * @param bottom  Bottom margin
	 * @param left    Left margin
	 * @return Current element
	 */
	public margin(top: number, right: number, bottom: number, left: number): Sprite {
		this.marginTop = top;
		this.marginRight = right;
		this.marginBottom = bottom;
		this.marginLeft = left;
		return this;
	}

	/**
	 * Left margin - absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Margin value
	 */
	public set marginLeft(value: number | Percent) {
		this.setPercentProperty("marginLeft", value, true, true, this._positionPrecision, true);
	}

	/**
	 * @return Margin value
	 */
	public get marginLeft(): number | Percent {
		return this.getPropertyValue("marginLeft");
	}

	/**
	 * Right margin - absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Margin value
	 */
	public set marginRight(value: number | Percent) {
		this.setPercentProperty("marginRight", value, true, true, this._positionPrecision, true);
	}

	/**
	 * @return Margin value
	 */
	public get marginRight(): number | Percent {
		return this.getPropertyValue("marginRight");
	}

	/**
	 * Top margin - absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Margin value
	 */
	public set marginTop(value: number | Percent) {
		this.setPercentProperty("marginTop", value, true, true, this._positionPrecision, true);
	}

	/**
	 * @return Margin value
	 */
	public get marginTop(): number | Percent {
		return this.getPropertyValue("marginTop");
	}

	/**
	 * Bottom margin - absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Margin value
	 */
	public set marginBottom(value: number | Percent) {
		this.setPercentProperty("marginBottom", value, true, true, this._positionPrecision, true);
	}

	/**
	 * @return Margin value
	 */
	public get marginBottom(): number | Percent {
		return this.getPropertyValue("marginBottom");
	}

	/**
	 * Returns current right margin in pixels.
	 *
	 * @readonly
	 * @return Right margin (px)
	 */
	public get pixelMarginRight(): number {
		let value = this.getPixelX(this.marginRight);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("pixelMarginRight", value);
		}

	}

	/**
	 * Returns current relative right margin.
	 *
	 * @readonly
	 * @return Relative right margin
	 */
	public get relativeMarginRight(): number {
		// @todo Maybe use [[Percent]]?
		let value = this.getRelativeX(this.marginRight);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("relativeMarginRight", value);
		}
	}

	/**
	 * Returns current left margin in pixels.
	 *
	 * @readonly
	 * @return Left margin (px)
	 */
	public get pixelMarginLeft(): number {
		let value = this.getPixelX(this.marginLeft);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("pixelMarginLeft", value);
		}
	}

	/**
	 * Returns current relative left margin.
	 *
	 * @readonly
	 * @return Relative left margin
	 */
	public get relativeMarginLeft(): number {
		//@todo Maybe use [[Percent]]?
		let value = this.getRelativeX(this.marginLeft);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("relativeMarginLeft", value);
		}
	}

	/**
	 * Returns current top margin in pixels.
	 *
	 * @readonly
	 * @return Top margin (px)
	 */
	public get pixelMarginTop(): number {
		let value = this.getPixelY(this.marginTop);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("pixelMarginTop", value);
		}
	}

	/**
	 * Returns current relative top margin.
	 *
	 * @readonly
	 * @return Relative top margin
	 */
	public get relativeMarginTop(): number {
		// @todo Maybe use [[Percent]]?
		let value = this.getRelativeY(this.marginTop);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("relativeMarginTop", value);
		}
	}

	/**
	 * Returns current bottom margin in pixels.
	 *
	 * @readonly
	 * @return Bottom margin (px)
	 */
	public get pixelMarginBottom(): number {
		let value = this.getPixelY(this.marginBottom);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("pixelMarginBottom", value);
		}
	}

	/**
	 * Returns current relative bottom margin.
	 *
	 * @readonly
	 * @return Relative bottom margin
	 */
	public get relativeMarginBottom(): number {
		// @todo Maybe use [[Percent]]?
		let value = this.getRelativeY(this.marginBottom);
		if (!this._adapterO) {
			return value;
		}
		else {
			return this._adapterO.apply("relativeMarginBottom", value);
		}
	}

	/**
	 * Sets padding for the element in pixels.
	 *
	 * @param top     Top padding (px)
	 * @param right   Right padding (px)
	 * @param bottom  Bottom padding (px)
	 * @param left    Left padding (px)
	 * @return Element
	 */
	public padding(top: number, right: number, bottom: number, left: number): Sprite {
		this.paddingTop = top;
		this.paddingRight = right;
		this.paddingBottom = bottom;
		this.paddingLeft = left;
		return this;
	}

	/**
	 * Left padding - absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Padding value
	 */
	public set paddingLeft(value: number | Percent) {
		this.setPercentProperty("paddingLeft", value, true, true, this._positionPrecision, true);
	}

	/**
	 * @return Padding value
	 */
	public get paddingLeft(): number | Percent {
		return this.getPropertyValue("paddingLeft");
	}

	/**
	 * Right padding - absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Padding value
	 */
	public set paddingRight(value: number | Percent) {
		this.setPercentProperty("paddingRight", value, true, true, this._positionPrecision, true);
	}

	/**
	 * @return Padding value
	 */
	public get paddingRight(): number | Percent {
		return this.getPropertyValue("paddingRight");
	}

	/**
	 * Top padding - absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Padding value
	 */
	public set paddingTop(value: number | Percent) {
		this.setPercentProperty("paddingTop", value, true, true, this._positionPrecision, true);
	}

	/**
	 * @return Padding value
	 */
	public get paddingTop(): number | Percent {
		return this.getPropertyValue("paddingTop");
	}

	/**
	 * Bottom padding - absolute (px) or relative ([[Percent]]).
	 *
	 * @param value  Padding value
	 */
	public set paddingBottom(value: number | Percent) {
		this.setPercentProperty("paddingBottom", value, true, true, this._positionPrecision, true);
	}

	/**
	 * @return Padding value
	 */
	public get paddingBottom(): number | Percent {
		return this.getPropertyValue("paddingBottom");
	}

	/**
	 * Returns current right padding in pixels.
	 *
	 * @readonly
	 * @return Right padding (px)
	 */
	public get pixelPaddingRight(): number {
		return this.getPixelX(this.paddingRight);
	}

	/**
	 * Returns current relative right padding.
	 *
	 * @readonly
	 * @return Relative right padding
	 */
	public get relativePaddingRight(): number {
		// @todo Maybe use [[Percent]]?
		return this.getRelativeX(this.paddingRight);
	}

	/**
	 * Returns current left padding in pixels.
	 *
	 * @readonly
	 * @return Left padding (px)
	 */
	public get pixelPaddingLeft(): number {
		return this.getPixelX(this.paddingLeft);
	}

	/**
	 * Returns current relative left padding.
	 *
	 * @readonly
	 * @return Relative left padding
	 */
	public get relativePaddingLeft(): number {
		// @todo Maybe use [[Percent]]?
		return this.getRelativeX(this.paddingLeft);
	}

	/**
	 * Returns current top padding in pixels.
	 *
	 * @readonly
	 * @return Top padding (px)
	 */
	public get pixelPaddingTop(): number {
		return this.getPixelY(this.paddingTop);
	}

	/**
	 * Returns current relative top padding.
	 *
	 * @readonly
	 * @return Relative top padding
	 */
	public get relativePaddingTop(): number {
		// @todo Maybe use [[Percent]]?
		return this.getRelativeY(this.paddingTop);
	}

	/**
	 * Returns current bottom padding in pixels.
	 *
	 * @readonly
	 * @return Bottom padding (px)
	 */
	public get pixelPaddingBottom(): number {
		return this.getPixelY(this.paddingBottom);
	}

	/**
	 * Returns current relative bottom padding.
	 *
	 * @readonly
	 * @return Relative bottom padding
	 */
	public get relativePaddingBottom(): number {
		// @todo Maybe use [[Percent]]?
		return this.getRelativeY(this.paddingBottom);
	}


	/**
	 * ==========================================================================
	 * APPEARANCE-RELATED PROPERTIES AND RELATED STUFF
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Path of Sprite element
	 */
	public set path(value: string) {
		this.setPath(value);
	}

	/**
	 * @ignore
	 */
	protected setPath(value: string): boolean {
		if (this.setPropertyValue("path", value)) {

			if (!this._isPath) {
				if (!this.element || (this.element.node && !(this.element.node instanceof SVGPathElement))) {
					this.element = this.paper.add("path");
				}
				this._isPath = true;
			}
			if ($type.hasValue(value)) {
				this.element.attr({ "d": value });
			}
			else {
				this.element.removeAttr("d");
			}
			this.invalidatePosition();
			// otherwise is 0x0
			if (!this.inited) {
				this.events.once("inited", this.validatePosition, this, false);
			}
			return true;
		}
		return false;
	}

	/**
	 * @return Path of a Sprite element
	 */
	public get path(): string {
		return this.getPropertyValue("path");
	}

	/**
	 * [[ColorModifier]] that can be used to modify color and pattern of the
	 * element's fill, e.g. create gradients.
	 *
	 * @param value  Fill color modifiier
	 */
	public set fillModifier(value: ColorModifier) {
		if (this.setPropertyValue("fillModifier", value)) {
			this.setFill(this.fill);
		}
	}

	/**
	 * @return Fill color modifier
	 */
	public get fillModifier(): ColorModifier {
		return this.getPropertyValue("fillModifier");
	}

	/**
	 * [[ColorModifier]] that can be used to modify color and pattern of the
	 * element's stroke (outline), e.g. create gradients.
	 *
	 * @param value  Stroke color modifier
	 */
	public set strokeModifier(value: ColorModifier) {
		this.setPropertyValue("strokeModifier", value, true);
	}

	/**
	 * @return Stroke color modifier
	 */
	public get strokeModifier(): ColorModifier {
		return this.getPropertyValue("strokeModifier");
	}

	/**
	 * Element's fill opacity.
	 *
	 * Opacity ranges from 0 (fully transparent) to 1 (fully opaque).
	 *
	 * @param value  Opacity (0-1)
	 */
	public set fillOpacity(value: number) {
		value = $math.toNumberRange(value, 0, 1);
		if (this.setPropertyValue("fillOpacity", value)) {
			this.setSVGAttribute({ "fill-opacity": value });
		}
	}

	/**
	 * @return Opacity (0-9)
	 */
	public get fillOpacity(): number {
		return this.getPropertyValue("fillOpacity");
	}

	/**
	 * Element's fill color or pattern.
	 *
	 * @param value  Fill
	 */
	public set fill(value: $type.Optional<Color | Pattern | LinearGradient | RadialGradient>) {
		this.setFill(value);
	}

	/**
	 * Sets actual `fill` property on the SVG element, including applicable color
	 * modifiers.
	 *
	 * @ignore Exclude from docs
	 * @param value  Fill
	 */
	protected setFill(value: $type.Optional<Color | Pattern | LinearGradient | RadialGradient>): void {
		if (!$type.isObject(value)) {
			value = toColor(value);
		}

		if (this.setColorProperty("fill", value) || this.fillModifier) {
			// this can not go into next if, as value is turned to Gradient
			if (value instanceof Color) {
				if (this.fillModifier) {
					value = this.fillModifier.modify(value);
				}
			}

			this.realFill = value;

			// todo: review this place when some Color type will be added
			if (value instanceof Color) {
				this.setSVGAttribute({ "fill": value.toString() });
			}
			else if (!$type.hasValue(value)) {
				this.removeSVGAttribute("fill");
			}
			else if (<any>value instanceof Pattern || <any>value instanceof LinearGradient || <any>value instanceof RadialGradient) {
				let fill = value;
				fill.paper = this.paper;
				this.setSVGAttribute({ "fill": "url(\"" + $utils.getBaseURI() + fill.id + "\")" });
			}
		}
	}

	/**
	 * @return Fill
	 */
	public get fill(): $type.Optional<Color | Pattern | LinearGradient | RadialGradient> {
		return this.getPropertyValue("fill");
	}

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
	 * @param value Opacity (0-1)
	 */
	public set opacity(value: number) {
		value = $math.toNumberRange(value, 0, 1);
		if (this.setPropertyValue("opacity", value)) {
			this.setSVGAttribute({ "opacity": value });
		}
	}

	/**
	 * @return Opacity (0-1)
	 */
	public get opacity(): number {
		return this.getPropertyValue("opacity");
	}

	/**
	 * Element's stroke (outline) color or pattern.
	 *
	 * @param value  Stroke setting
	 */
	public set stroke(value: Color | Pattern | LinearGradient | RadialGradient) {
		this.setStroke(value);
	}

	/**
	 * Sets actual `stroke` property on the SVG element, including applicable
	 * color modifiers.
	 *
	 * @ignore Exclude from docs
	 * @param value Stroke setting
	 */
	protected setStroke(value: Color | Pattern | LinearGradient | RadialGradient) {
		if (!$type.isObject(value)) {
			value = toColor(value);
		}

		if (this.setColorProperty("stroke", value) || this.strokeModifier) {

			// this can not go into next if, as value is turned to Gradient
			if (value instanceof Color) {
				if (this.strokeModifier) {
					value = this.strokeModifier.modify(value);
				}
			}

			this.realStroke = value;

			if (value instanceof Color) {
				if (value.hex == "none") {
					this.removeSVGAttribute("stroke");
				}
				else {
					this.setSVGAttribute({ "stroke": value.toString() });
				}
			}
			else if (!$type.hasValue(value)) {
				this.removeSVGAttribute("stroke");
			}
			else if (<any>value instanceof Pattern || <any>value instanceof LinearGradient || <any>value instanceof RadialGradient) {
				let stroke = value;
				stroke.paper = this.paper;
				this.setSVGAttribute({ "stroke": "url(\"" + $utils.getBaseURI() + stroke.id + "\")" });
			}
		}
	}

	/**
	 * @return Stroke setting
	 */
	public get stroke(): Color | Pattern | LinearGradient | RadialGradient {
		return this.getPropertyValue("stroke");
	}

	/**
	 * Stroke (outline) opacity.
	 *
	 * The values may range from 0 (fully transparent) to 1 (fully opaque).
	 *
	 * @param value  Opacity (0-1)
	 */
	public set strokeOpacity(value: number) {
		value = $math.toNumberRange(value, 0, 1);
		if (this.setPropertyValue("strokeOpacity", value)) {
			this.setSVGAttribute({ "stroke-opacity": value });
		}
	}

	/**
	 * @return Opacity (0-1)
	 */
	public get strokeOpacity(): number {
		return this.getPropertyValue("strokeOpacity");
	}

	/**
	 * Controls if the element's stroke (outline) should remain keep constant
	 * thicnkess and do not scale when the whole element is resized.
	 *
	 * @param value  Do not scale stroke (outline)
	 */
	public set nonScalingStroke(value: boolean) {
		value = $type.toBoolean(value);
		if (this.setPropertyValue("nonScalingStroke", value)) {
			this.strokeWidth = this.strokeWidth;
		}
	}

	/**
	 * @return Do not scale stroke (outline)
	 */
	public get nonScalingStroke(): boolean {
		return this.getPropertyValue("nonScalingStroke");
	}

	/**
	 * Controls if element should keep constant size and not scale even if there is
	 * space available, or it does not fit.
	 *
	 * @param value  Is element scaleable?
	 */
	public set nonScaling(value: boolean) {
		// @todo Description (review)
		value = $type.toBoolean(value);
		this.setPropertyValue("nonScaling", value, false, true);
	}

	/**
	 * @return Is element scaleable?
	 */
	public get nonScaling(): boolean {
		return this.getPropertyValue("nonScaling");
	}

	/**
	 * Stroke (outline) thickness in pixels.
	 *
	 * @param value  Thickness (px)
	 */
	public set strokeWidth(value: number) {
		value = $type.toNumber(value);
		this.setPropertyValue("strokeWidth", value, true);

		if (this.nonScalingStroke) {
			if (!$type.isNumber(value)) {
				value = 1;
			}
			value = value / this.globalScale;
		}
		this.setSVGAttribute({ "stroke-width": value });
	}

	/**
	 * @return Thickness (px)
	 */
	public get strokeWidth(): number {
		return this.getPropertyValue("strokeWidth");
	}

	/**
	 * A `stroke-dasharray` for the stroke (outline).
	 *
	 * "Dasharray" allows setting rules to make lines dashed, dotted, etc.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray} for more info on `stroke-dasharray`
	 * @param value  `stroke-dasharray`
	 */
	public set strokeDasharray(value: string) {
		value = $type.toText(value);
		if (this.setPropertyValue("strokeDasharray", value)) {
			this.setSVGAttribute({ "stroke-dasharray": value });
		}
	}

	/**
	 * @return `stroke-dasharray`
	 */
	public get strokeDasharray(): string {
		return this.getPropertyValue("strokeDasharray");
	}

	/**
	 * A `stroke-dashoffset` for the stroke (outline).
	 *
	 * "Dashoffset" allows setting the start position of the dashes if
	 * `strokeDasharray` is used.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dashoffset} for more info on `stroke-dashoffset`
	 * @param value  `stroke-dashoffset`
	 */
	public set strokeDashoffset(value: number) {
		value = $type.toNumber(value);
		if (this.setPropertyValue("strokeDashoffset", value)) {
			this.setSVGAttribute({ "stroke-dashoffset": value });
		}
	}

	/**
	 * @return `stroke-dashoffset`
	 */
	public get strokeDashoffset(): number {
		return this.getPropertyValue("strokeDashoffset");
	}

	/**
	 * A `stroke-linecap` to indicate how line ends are drawn.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes#Stroke} for more info on `stroke-linecap`
	 * @param value  `stroke-linecap`
	 */
	public set strokeLinecap(value: "butt" | "square" | "round") {
		if (this.setPropertyValue("strokeLinecap", value)) {
			this.setSVGAttribute({ "stroke-linecap": value });
		}
	}

	/**
	 * @return `stroke-linecap`
	 */
	public get strokeLinecap(): "butt" | "square" | "round" {
		return this.getPropertyValue("strokeLinecap");
	}

	/**
	 * A `stroke-linejoin` to indicate how line ends are drawn.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes#Stroke} for more info on `stroke-linejoin`
	 * @param value  `stroke-linejoin`
	 */
	public set strokeLinejoin(value: "miter" | "round" | "bevel") {
		if (this.setPropertyValue("strokeLinejoin", value)) {
			this.setSVGAttribute({ "stroke-linejoin": value });
		}
	}

	/**
	 * @return `stroke-linejoin`
	 */
	public get strokeLinejoin(): "miter" | "round" | "bevel" {
		return this.getPropertyValue("strokeLinejoin");
	}

	/**
	 * An SVG-specific `shape-rendering` value.
	 *
	 * `shape-rendering` controls how vector graphics are drawn and rendered.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering} for more information about `shape-rendering`
	 * @default "auto"
	 * @param value  'shape-rendering' value
	 */
	public set shapeRendering(value: ShapeRendering) {
		value = <ShapeRendering>$type.toText(value);
		if (this.setPropertyValue("shapeRendering", value)) {
			this.setSVGAttribute({ "shape-rendering": value });
		}
	}

	/**
	 * @return 'shape-rendering' value
	 */
	public get shapeRendering(): ShapeRendering {
		return this.getPropertyValue("shapeRendering");
	}

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
	 * @param value  Use pixel perfect?
	 */
	public set pixelPerfect(value: boolean) {
		value = $type.toBoolean(value);
		if (value) {
			this._positionPrecision = 0;
		}
		else {
			this._positionPrecision = 3;
		}

		this.setPropertyValue("pixelPerfect", value, true);
	}

	/**
	 * @return Use pixel perfect?
	 */
	public get pixelPerfect(): boolean {
		return this.getPropertyValue("pixelPerfect");
	}

	/**
	 * An RTL (right-to-left) setting.
	 *
	 * RTL may affect alignment, text, and other visual properties.
	 *
	 * @param value  `true` for to use RTL
	 */
	public set rtl(value: boolean) {
		value = $type.toBoolean(value);
		this._rtl = value;
	}

	/**
	 * @return RTL?
	 */
	public get rtl(): boolean {
		if ($type.hasValue(this._rtl)) {
			return this._rtl;
		}
		else if (this.virtualParent) {
			return this.virtualParent.rtl;
		}
		else if (this.parent) {
			return this.parent.rtl;
		}
		//this.rtl = false;
		return false;
	}


	/**
	 * ==========================================================================
	 * VISIBILITY AND ORDER PROPERTIES AND RELATED STUFF
	 * ==========================================================================
	 * @hidden
	 */

	/**
 	 * Reveals hidden element.
 	 *
 	 * Has no effect if element is already visible.
 	 *
 	 * If `duration` is not specified, it will use default.
 	 *
 	 * @param duration  Fade in duration (ms)
 	 * @return Animation object if such object was created
 	 */
	public show(duration?: number): $type.Optional<Animation> {
		return this.showReal(duration);
	}

	/**
	 * Performs actual operations to reveal this element.
	 *
	 * @ignore Exclude from docs
	 * @param duration Fade in duration (ms)
	 * @return Fade in duration (ms)
	 */
	protected showReal(duration?: number): $type.Optional<Animation> {
		if(this.preventShow){
			return;
		}
		let transition: $type.Optional<Animation>;

		const properties = this.defaultState.properties;

		if (!this.disabled && (this.isHidden || !this.visible || this.isHiding || (properties.opacity != null && this.opacity < properties.opacity && !this.isShowing)) && !this.isDisposed()) {

			// helps to avoid flicker, as show might change opacity or visibility but item might be at invalid state/position
			if (this.invalid) {
				this.validate();
			}

			if (this.positionInvalid) {
				this.validatePosition();
			}

			if (!$type.isNumber(duration)) {
				duration = this.defaultState.transitionDuration;
			}

			if (this._hideAnimation) {
				this._hideAnimation.kill();
				this._hideAnimation = undefined;
			}

			// Cancel hide handler just in case it was there
			if (this._showHideDisposer) {
				this.removeDispose(this._showHideDisposer);
			}

			this._isHidden = false;
			this.isHiding = false;
			this.isShowing = true;

			// Apply current state
			transition = this.applyCurrentState(duration);

			if (transition && !transition.isFinished()) {

				this._showHideDisposer = transition.events.on("animationended", () => {
					this.isShowing = false;
				});

				this._disposers.push(this._showHideDisposer);
			}
			else {
				this.isShowing = false;
			}
			// Make it visible
			let visible = this.defaultState.properties.visible;
			if (!$type.hasValue(visible)) {
				visible = true;
			}
			this.visible = visible;

			// Unhide from screen readers
			this.readerHidden = false;

			// Dispatch "show" event
			this.dispatchImmediately("shown");
		}

		return transition;
	}

	/**
	 * Initiates hiding of Sprite.
	 * When called it will fade out the the Sprite to transparency, then make it
	 * invisible.
	 * @param duration Duration in millisecons
	 */

	/**
	 * Hides the element, by applying `hidden` state.
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
	 * @param duration  Fade out duration (ms)
	 * @return hide Animation object if such object was created
	 */
	public hide(duration?: number): $type.Optional<Animation> {
		return this.hideReal(duration);
	}

	/**
	 * Hides actual SVG elements and handles hiding animations.
	 *
	 * @param duration  Fade out duration (ms)
	 * @return Fade out duration (ms)
	 * @ignore
	 */
	protected hideReal(duration?: number): $type.Optional<Animation> {
		let transition: $type.Optional<Animation>;

		if (!this.isHiding && this.visible && !this.isDisposed()) {
			this.hideTooltip(0);

			if (this._hideAnimation) {
				this._hideAnimation.kill();
				this._hideAnimation = undefined;
			}

			this.isShowing = false;

			// Cancel hide handler just in case it was there
			if (this._showHideDisposer) {
				this.removeDispose(this._showHideDisposer);
			}

			// Get state
			let hiddenState = this.hiddenState;

			// Transition to "hidden" state, provided Sprite has one set
			if (hiddenState) {
				// Yes, we have a "hidden" state
				// `setState` will return an `Animation` object which we can set
				// events on
				transition = this.setState(hiddenState, duration, undefined);

				if (transition && !transition.isFinished()) {
					this._hideAnimation = transition;
					this._showHideDisposer = transition.events.on("animationended", () => {
						this.isHiding = false;
						this._isHidden = true;
					}, this);

					this._disposers.push(this._showHideDisposer);

					// Thrown everything into `_disposers` just in case Sprite gets
					// destroyed in the meantime
					this._disposers.push(transition);
				}
				else {
					this.isHiding = false;
					this._isHidden = true;
				}
			}
			else {
				// No hidden state, let's just set `visible` and call it a day
				this.visible = false;
				this.isHiding = false;
				this._isHidden = true;
			}

			// Hide from screen readers
			this.readerHidden = true;

			// Dispach "hidden" event
			this.dispatchImmediately("hidden");
			this.invalidate(); // hide it at once to avoid flickers // validate() causes SO
		}

		if (!$type.isNumber(duration)) {
			duration = this.hiddenState.transitionDuration;
		}

		return transition;
	}

	/**
	 * Sets visibility of the element.
	 *
	 * @param value Visible?
	 */
	public set visible(value: boolean) {
		value = $type.toBoolean(value);
		this.setVisibility(value);
	}

	/**
	 * Returns current visibility of the element.
	 *
	 * @return Visible?
	 */
	public get visible(): boolean {
		return this.getVisibility();
	}

	/**
	 * Returns visibility value
	 * @ignore
	 */
	protected getVisibility(): boolean {
		let value = this.getPropertyValue("visible");
		if (!$type.hasValue(value)) {
			value = true;
		}
		return value;
	}


	/**
	 * Sets `visibility` property:
	 *
	 * * `true` - visible
	 * * `false` - hidden
	 *
	 * @param value  true - visible, false - hidden
	 * @return Current visibility
	 */
	public setVisibility(value: boolean) {
		if (this.setPropertyValue("visible", value)) {
			if (value) {
				this.group.removeAttr("visibility");
			}
			else {
				this.group.attr({ "visibility": "hidden" });
			}
			//this.invalidatePosition();

			if (this.events.isEnabled("visibilitychanged")) {
				const event: AMEvent<this, ISpriteEvents>["visibilitychanged"] = {
					type: "visibilitychanged",
					target: this,
					visible: value
				};
				this.events.dispatchImmediately("visibilitychanged", event);
			}
		}
	}

	/**
	 * A "zIndex" of the element.
	 *
	 * "zIndex" determines the order of how elements are placed over each other.
	 *
	 * Higher "zIndex" will mean the element will be draw on top of elements
	 * with lower "zIndexes".
	 *
	 * @param value  zIndex
	 */
	public set zIndex(value: number) {
		value = $type.toNumber(value);
		if (this.setPropertyValue("zIndex", value)) {
			this.dispatch("zIndexChanged");
		}
	}

	/**
	 * @return zIndex
	 */
	public get zIndex(): number {
		return this.getPropertyValue("zIndex");
	}

	/**
	 * Moves the element to the very top in element order, so that it appears
	 * in front of other elements.
	 */
	public toFront(): void {
		let parent = this.parent;
		if (parent && parent.children.indexOf(this) != parent.children.length - 1) {
			parent.children.moveValue(this, parent.children.length - 1);
			this.dispatch("zIndexChanged");
		}
	}

	/**
	 * Moves the element to the very bottom in the element order, so that it
	 * appears behind other elements.
	 */
	public toBack(): void {
		let parent = this.parent;
		if (parent && parent.children.indexOf(this) != 0) {
			parent.children.moveValue(this, 0);
			this.dispatch("zIndexChanged");
		}
	}


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
	 * @param tooltip  Tooltip
	 */
	public set tooltip(tooltip: $type.Optional<Tooltip>) {
		if (this._tooltip) {
			//this._tooltip.dispose();
			this.removeDispose(this._tooltip);
		}

		this._tooltip = tooltip;

		if (tooltip) {
			tooltip.parent = this.tooltipContainer;
		}
	}

	/**
	 * @return Tooltip
	 */
	public get tooltip(): $type.Optional<Tooltip> {
		if (this._tooltip) {
			return this._tooltip;
		}
		else if (this.virtualParent) {
			return this.virtualParent.tooltip;
		}
		else if (this.parent) {
			return this.parent.tooltip;
		}
	}

	/**
	 * A [[DataItem]] to use when populating content for the element's
	 * [[Tooltip]].
	 *
	 * @see {@link Tooltip}
	 * @see {@link DataItem}
	 * @param value  Tooltip data item
	 */
	public set tooltipDataItem(value: DataItem) {
		// important: do not dispose tooltip dataItem, as it is some actual data item from data!
		this._tooltipDataItem = value;
	}

	/**
	 * @return Tooltip data item
	 */
	public get tooltipDataItem(): DataItem {
		const tooltipDataItem = this._tooltipDataItem;

		if (tooltipDataItem) {
			return tooltipDataItem;

		} else {
			return this.dataItem;
		}
	}

	/**
	 * A [[Sprite]] or sprite template to use when getting colors for tooltip. If a template is set,
	 * tooltip will look for a clone in tooltipDataItem.sprites. If no clone is found, then template colors will be used.
	 *
	 * @see {@link Tooltip}
	 * @see {@link Sprite}
	 * @param sprite Sprite
	 */
	public set tooltipColorSource(sprite: $type.Optional<Sprite>) {
		this._tooltipColorSource = sprite;
	}

	/**
	 * @return Tooltip color source
	 */
	public get tooltipColorSource(): $type.Optional<Sprite> {
		return this._tooltipColorSource;
	}

	/**
	 * Shows the element's [[Tooltip]].
	 *
	 * A tooltip will be populated using text templates in either `tooltipHTML` or
	 * `tooltipText` as well as data in `tooltipDataItem`.
	 *
	 * @see {@link Tooltip}
	 * @param optional point (sprite-related) to which tooltip must point.
	 * @return returns true if the tooltip was shown and false if it wasn't (no text was found)
	 */
	public showTooltip(point?: IPoint): boolean {

		if (this.showTooltipOn == "always" && !this._tooltip && this.tooltip) {
			this._tooltip = this.tooltip.clone();
		}

		// do not show if hidden
		let sprite: Sprite = this;
		while (sprite != undefined) {
			if (!sprite.visible || sprite.disabled || sprite.__disabled) {
				if (this._tooltip && this._tooltip.visible) {
					this._tooltip.hide(0);
				}
				return;
			}
			sprite = sprite.parent;
		}

		if ($type.hasValue(this.tooltipText) || $type.hasValue(this.tooltipHTML)) {
			let tooltip = this.tooltip;
			let tooltipDataItem = this.tooltipDataItem;

			if (tooltip) {

				tooltip.targetSprite = this;

				let colorSource: Sprite = this;
				let tooltipColorSource = this.tooltipColorSource;
				if ((tooltip.getStrokeFromObject || tooltip.getFillFromObject) && tooltipColorSource) {
					if (tooltipColorSource.isTemplate) {
						if (tooltipDataItem) {
							$array.eachContinue(tooltipDataItem.sprites, (sprite) => {
								if (sprite.clonedFrom == tooltipColorSource) {
									colorSource = sprite;
									return false;
								}
								return true;
							})
						}
					}
					else {
						colorSource = tooltipColorSource;
					}
				}


				if (tooltip.getStrokeFromObject) {
					let stroke = this.stroke;
					let source: Sprite = colorSource;

					while (source.parent != undefined) {
						stroke = source.stroke;
						if (stroke == undefined) {
							source = source.parent;
						}
						if (stroke != undefined) {
							break;
						}
					}

					if (stroke instanceof Color) {
						tooltip.background.animate({ property: "stroke", to: stroke }, tooltip.animationDuration);
					}
					else {
						tooltip.background.stroke = stroke;
					}
				}

				// Set data item
				tooltip.dataItem = tooltipDataItem;
				tooltip.label.populateStringFrom = this;

				if (tooltip.getFillFromObject) {

					let fill = this.fill;

					let source: Sprite = colorSource;

					while (source.parent != undefined) {
						fill = source.fill;
						if (fill == undefined || (fill instanceof Color && fill.rgb == undefined)) {
							source = source.parent;
						}
						else if (fill != undefined) {
							break;
						}
					}

					if (fill == undefined) {
						fill = color("#000000");
					}

					if (fill instanceof Color) {
						if (!tooltip.visible) {
							tooltip.background.fill = fill;
						}
						else {
							tooltip.background.animate({ property: "fill", to: fill }, tooltip.animationDuration);
						}
					}
					else {
						tooltip.background.fill = fill;
					}

					if (tooltip.autoTextColor && fill instanceof Color) {
						tooltip.label.fill = fill.alternative;
					}
				}

				// Apply tooltip text
				let text = "";
				if (this.tooltipHTML) {
					tooltip.html = this.tooltipHTML;
					text = this.tooltipHTML;
				}
				if (this.tooltipText) {
					tooltip.text = this.tooltipText;
					text = this.tooltipText;
				}

				if (this.updateTooltipPosition(point)) {

					// Set accessibility option
					tooltip.readerDescribedBy = this.uidAttr();

					// make label to render to be able to check currentText
					if (tooltip.label.invalid) {
						tooltip.label.validate();
					}

					if (text != undefined && text != "" && tooltip.label.currentText != "") {

						//@todo: think of how to solve this better
						if (tooltip && !tooltip.parent) {
							tooltip.parent = this.tooltipContainer;
						}

						// Reveal tooltip
						// showing it in 1 ms helps to avoid strange flickering in IE
						let duration = tooltip.defaultState.transitionDuration;
						if (duration <= 0) {
							duration = 1;
						}

						tooltip.show(duration);
						return true;
					}
					else {
						this.hideTooltip(0);
					}
				}
				else {
					this.hideTooltip(0);
				}
			}
		}
		return false;
	}

	/**
	 * @ignore
	 */
	protected updateTooltipPosition(point?: IPoint): boolean {
		if (this.tooltipPosition == "pointer") {

			if (this._interactionDisposer) {
				this._interactionDisposer.dispose();
			}

			this._interactionDisposer = getInteraction().body.events.on("track", (ev) => {
				return this.pointTooltipTo($utils.documentPointToSvg(ev.point, this.svgContainer.SVGContainer, this.svgContainer.cssScale), true);
			});
			if (point) {
				return this.pointTooltipTo(point, true);
			}
		}
		else {
			// Point to the X/Y of this Sprite
			let globalPoint = $utils.spritePointToSvg({
				"x": this.getTooltipX(),
				"y": this.getTooltipY()
			}, this);

			return this.pointTooltipTo(globalPoint);
		}
	}

	/**
	 * Sets the point the [[Tooltip]] should point to.
	 *
	 * @param point      Coordinates to point to
	 * @param instantly  Move instantly without animation
	 */
	protected pointTooltipTo(point: IPoint, instantly?: boolean): boolean {
		let tooltip = this.tooltip;
		if (tooltip && this.topParent) {

			if (tooltip.showInViewport) {
				tooltip.pointTo(point, instantly);
				return true;
			}

			if ($math.isInRectangle(point, { x: 0, y: 0, width: this.topParent.maxWidth, height: this.topParent.maxHeight })) {
				tooltip.pointTo(point, instantly);
				return true;
			}
		}
		return false;
	}

	/**
	 * Hides element's [[Tooltip]].
	 *
	 * @see {@link Tooltip}
	 */
	public hideTooltip(duration?: number): void {

		if (this.showTooltipOn == "always") {
			return;
		}

		let tooltip = this.tooltip;
		if (tooltip) {
			if (tooltip.targetSprite == this) {
				tooltip.targetSprite = undefined;
			}
			tooltip.hide(duration);
			if (this._interactionDisposer) {
				this._interactionDisposer.dispose();
				this._interactionDisposer = undefined;
			}
		}
	}

	/**
	 * An HTML template to be used to populate [[Tooltip]] contents.
	 *
	 * If element has `tooltipDataItem` or `dataItem` set, this will be parsed
	 * for any data values to be replaced with the values from respective data
	 * items.
	 *
	 * @param value Tooltip HTML content template
	 */
	public set tooltipHTML(value: string) {
		value = $type.toText(value);
		this.hoverable = true;
		if (this.setPropertyValue("tooltipHTML", value)) {
			if (this.tooltip) {
				if (this.tooltip.visible) {
					this.showTooltip();
				}
			}
		}
	}

	/**
	 * @return Tooltip HTML content template
	 */
	public get tooltipHTML(): string {
		return this.getPropertyValue("tooltipHTML");
	}

	/**
	 * A text template to be used to populate Tooltip's contents.
	 *
	 * If element has `tooltipDataItem` or `dataItem` set, this will be parsed
	 * for any data values to be replaced with the values from respective data
	 * items.
	 *
	 * This template will also be parsed for any special formatting tags.
	 *
	 * @param value Tooltip content template
	 * @see {@link TextFormatter}
	 */
	public set tooltipText(value: string) {
		value = $type.toText(value);
		if (value) {
			this.hoverable = true;
		}
		if (this.setPropertyValue("tooltipText", value)) {
			if (this.tooltip) {
				if (this.tooltip.visible) {
					this.showTooltip();
				}
			}
		}
	}

	/**
	 * @return Tooltip content template
	 */
	public get tooltipText(): string {
		return this.getPropertyValue("tooltipText");
	}

	/**
	 * A container reference that should be used to place element's
	 * [[Tooltip]] in.
	 *
	 * Will use parent's container if does not have one set.
	 *
	 * @ignore Exclude from docs
	 * @param value Container
	 * @todo Dispose of the old _tooltipContainer ?
	 */
	public set tooltipContainer(value: $type.Optional<Container>) {
		this._tooltipContainer = value;
	}

	/**
	 * @ignore Exclude from docs
	 * @return Container
	 */
	public get tooltipContainer(): $type.Optional<Container> {
		if (this._tooltipContainer) {
			return this._tooltipContainer;
		}
		else if (this.parent) {
			return this.parent.tooltipContainer;
		}
	}

	/**
	 * X coordinate the [[Tooltip]] should be shown at.
	 *
	 * @param value  Tooltip X (px)
	 */
	public set tooltipX(value: number | Percent) {
		if (this.setPercentProperty("tooltipX", value) && this.tooltip) {
			this.tooltip.invalidate();
		}
	}

	/**
	 * @return Tooltip X (px)
	 */
	public get tooltipX(): number | Percent {
		return this.getTooltipX();
	}

	/**
	 * DEPRECATION NOTICE: This setting is deprecated in favor of a more flexible
	 * setting: `showTooltipOn`. Please use `showTooltipOn = "always"` instead.
	 * 
	 * Indicates if this element should display a tooltip permanently.
	 *
	 * Useful, if you want to show permanent tooltips on some items.
	 *
	 * @default false
	 * @since 4.5.4
	 * @deprecated Use `showTooltipOn = "always"` instead
	 * @param  value  Always show tooltip?
	 */
	public set alwaysShowTooltip(value: boolean) {
		value = $type.toBoolean(value);
		if (value) {
			this.showTooltipOn = "always";
		}
	}

	/**
	 * @return Always show tooltip?
	 */
	public get alwaysShowTooltip(): boolean {
		return this.getPropertyValue("showTooltipOn") == "always";
	}

	/**
	 * Indicates when tooltip needs to be shown on this element:
	 *
	 * * `"hover"` (default) - Tooltip will be shown when element is hovered on.
	 * * `"hit"` - Tooltip will be shown when element is clicked/tapped. Tooltip will be hidden when clicked/tapped anywhere else.
	 * * `"always"` - Tooltip will be shown on the element permanently.
	 *
	 * For example, if you would like to show tooltips on all of the columns of
	 * a [[ColumnSeries]]:
	 *
	 * ```TypeScript
	 * series.columns.template.showTooltipOn = "always";
	 * ```
	 * ```JavaScript
	 * series.columns.template.showTooltipOn = "always";
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     // ...
	 *     "columns": {
	 *       "showTooltipOn": "always"
	 *     }
	 *   }]
	 * }
	 * ```
	 *
	 * It can even be set to display on a selected columns via `propertyFields`:
	 *
	 * ```TypeScript
	 * series.columns.template.propertyFields.showTooltipOn = "tooltip";
	 * ```
	 * ```JavaScript
	 * series.columns.template.propertyFields.showTooltipOn = "tooltip";
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     // ...
	 *     "columns": {
	 *       "propertyFields": {
	 *         "showTooltipOn": "tooltip"
	 *       }
	 *     }
	 *   }]
	 * }
	 * ```
	 *
	 * @default "hover"
	 * @since 4.7.9
	 * @param  value  When to show tooltip
	 */
	public set showTooltipOn(value: "hover" | "hit" | "always") {
		if (this.setPropertyValue("showTooltipOn", value)) {
			if (value == "hit") {
				this.clickable = true;
			}
			if (this.tooltip) {
				if (value == "always") {
					this.showTooltip();
				}
				else {
					this.handleAlwaysShowTooltip();
				}
			}
		}
	}

	/**
	 * @return When to show tooltip
	 */
	public get showTooltipOn(): "hover" | "hit" | "always" {
		return this.getPropertyValue("showTooltipOn");
	}

	/**
	 * Specifies if [[Tooltip]] should follow the mouse or touch pointer or stay
	 * at the fixed position.
	 *
	 * @param value  Position
	 */
	public set tooltipPosition(value: "fixed" | "pointer") {
		this.setPropertyValue("tooltipPosition", value);
	}

	/**
	 * Position
	 */
	public get tooltipPosition(): "fixed" | "pointer" {
		return this.getPropertyValue("tooltipPosition");
	}

	/**
	 * Y coordinate the [[Tooltip]] should be shown at.
	 *
	 * @param value  Tooltip Y (px)
	 */
	public set tooltipY(value: number | Percent) {
		if (this.setPercentProperty("tooltipY", value) && this.tooltip) {
			this.tooltip.invalidate();
		}
	}

	/**
	 * @return Tooltip Y (px)
	 */
	public get tooltipY(): number | Percent {
		return this.getTooltipY();
	}

	/**
	 * Returns Tooltip X coordinate if it's set, or middle of the element.
	 *
	 * @ignore Exclude from docs
	 * @return X (px)
	 */
	public getTooltipX(): number {

		let x = this.getPropertyValue("tooltipX");

		if (!$type.hasValue(x)) {
			x = percent(50);
		}

		let value: number;
		if ($type.isNumber(x)) {
			value = x;
		}

		if (x instanceof Percent) {
			value = this.maxLeftSelf + this._measuredWidthSelf * x.value - this.pixelPaddingLeft - this.ex; // overflow is know only for measured items, so this is not always good
		}

		if(!$type.isNumber(value)){
			value = 0;
		}		

		return value;
	}

	/**
	 * Returns Tooltip Y coordinate if it's set, or middle of the element.
	 *
	 * @ignore Exclude from docs
	 * @return Y (px)
	 */
	public getTooltipY(): number {
		let y = this.getPropertyValue("tooltipY");

		if (!$type.hasValue(y)) {
			y = percent(50);
		}

		let value: number;
		if ($type.isNumber(y)) {
			value = y;
		}

		if (y instanceof Percent) {
			value = this.maxTopSelf + this._measuredHeightSelf * y.value - this.pixelPaddingTop - this.ey;  // overflow is know only for measured items, so this is not always good
		}

		if(!$type.isNumber(value)){
			value = 0;
		}

		return value;
	}

	/**
	 * Displays a modal or console message with error, and halts any further
	 * processing of this item.
	 *
	 * @ignore Exclude from docs
	 * @param e Error
	 * @todo Implement from applying further actions to this item
	 */
	public raiseCriticalError(e: Error) {

		if (this.svgContainer) {
			if (!this._adapterO) {
				this.modal.content = e.message;
			}
			else {
				this.modal.content = this._adapterO.apply("criticalError", e).message;
			}

			this.modal.closable = false;
			this.modal.open();
			this.disabled = true;
		}

		if (options.verbose) {
			console.log(e);
		}
	}

	/**
 * Processes JSON-based config before it is applied to the object.
 *
 * @ignore Exclude from docs
 * @param config  Config
 */
	public processConfig(config?: { [index: string]: any }): void {

		if (config) {

			// Tooltip color source
			if ($type.hasValue(config.tooltipColorSource) && $type.isString(config.tooltipColorSource) && this.map.hasKey(config.tooltipColorSource)) {
				config.tooltipColorSource = this.map.getKey(config.tooltipColorSource);
			}

			// Cursor styles
			if ($type.hasValue(config.cursorOverStyle) && $type.isString(config.cursorOverStyle)) {
				config.cursorOverStyle = this.getCursorStyle(config.cursorOverStyle);
			}
			if ($type.hasValue(config.cursorDowntyle) && $type.isString(config.cursorDowntyle)) {
				config.cursorDowntyle = this.getCursorStyle(config.cursorDowntyle);
			}
			if ($type.hasValue(config.cursorOptions)) {
				if ($type.hasValue(config.cursorOptions.overStyle) && $type.isString(config.cursorOptions.overStyle)) {
					config.cursorOptions.overStyle = this.getCursorStyle(config.cursorOptions.overStyle);
				}
				if ($type.hasValue(config.cursorOptions.downStyle) && $type.isString(config.cursorOptions.downStyle)) {
					config.cursorOptions.downStyle = this.getCursorStyle(config.cursorOptions.downStyle);
				}
			}

		}

		super.processConfig(config);

	}

	/**
	 * Converts string name of the cursor into actual [[MouseCursorStyle]].
	 *
	 * @param style  Cursor type
	 * @return Cursor definition
	 */
	private getCursorStyle(style: string): MouseCursorStyle {
		switch (style) {
			case "grab":
				return MouseCursorStyle.grab;
			case "grabbing":
				return MouseCursorStyle.grabbing;
			case "pointer":
				return MouseCursorStyle.pointer;
			case "horizontalResize":
				return MouseCursorStyle.horizontalResize;
			case "verticalResize":
				return MouseCursorStyle.verticalResize;
			default:
				return MouseCursorStyle.default;
		}
	}

	/**
	 * This function is used to sort element's JSON config properties, so that
	 * some properties that absolutely need to be processed last, can be put at
	 * the end.
	 *
	 * @ignore Exclude from docs
	 * @param a  Element 1
	 * @param b  Element 2
	 * @return Sorting number
	 */
	protected configOrder(a: string, b: string): Ordering {
		if (a == b) {
			return 0;
		}
		// Must come last
		else if (a == "tooltipColorSource") {
			return 1;
		}
		else if (b == "tooltipColorSource") {
			return -1;
		}
		else {
			return super.configOrder(a, b);
		}
	}

	/**
	 * If `sprite.hide()` is called, we set isHidden to true when sprite is hidden.
	 * This was added becaus hidden state might have visibility set to true and so
	 * there would not be possible to find out if a sprite is technically hidden or not.
	 */
	public get isHidden(): boolean {
		if (this._isHidden) {
			return this._isHidden;
		}
		else if (this._parent) {
			return this._parent.isHidden;
		}
		return false;
	}

	/**
	 * If this is set to `true`, Sprite, when inited will be instantly hidden
	 * ("hidden" state applied) and then shown ("default" state applied).
	 *
	 * If your "default" state's `transitionDuration > 0` this will result in
	 * initial animation from "hidden" state to "default" state.
	 *
	 * If you need a Sprite which has `showOnInit = true` not to be shown
	 * initially, set `sprite.hidden = true`. Setting `sprite.visible = false`
	 * will not prevent the animation and the sprite will be shown.
	 *
	 * @param value show on init?
	 */
	public set showOnInit(value: boolean) {
		value = $type.toBoolean(value);
		this.setShowOnInit(value);
	}

	/**
	 * @ignore
	 */
	protected setShowOnInit(value: boolean) {
		if (this.setPropertyValue("showOnInit", value)) {
			if (!this.isTemplate) {
				if (value && !this.inited && !this.hidden) {
					this._showOnInitDisposer = new MultiDisposer([
						registry.events.once("enterframe", this.hideInitially, this),
						this.events.once("beforevalidated", this.hideInitially, this, false),
						this.events.on("inited", this.appear, this, false)
					])

					this._disposers.push(this._showOnInitDisposer);
				}
				else {
					if (this._showOnInitDisposer) {
						this._showOnInitDisposer.dispose();
					}
				}
			}
		}
	}

	/**
	 * @ignore
	 */
	protected hideInitially() {
		if (!this.isDisposed()) {
			this.appeared = false;
			//if (!this.hidden && !this._isHidden) { // not good for series, as on enterframe it doesn't have data items yet.
			if (!this.inited) {
				this.hide(0);
			}
		}
	}

	/**
	 * Hides the chart instantly and then shows it. If defaultState.transitionDuration > 0, this will result an animation in which properties of hidden state will animate to properties of visible state.
	 */
	public appear() {
		this.appeared = false;
		if (!this.hidden && !this.isHidden) {
			this.hide(0);
		}
		if (!this.hidden) {

			let animation = this.show();

			if (animation && !animation.isFinished()) {
				animation.events.on("animationended", () => {
					this.appeared = true;
					this.dispatch("appeared");
				})
			}
			else {
				this.appeared = true;
				this.dispatch("appeared");
			}
		}
		else {
			this.appeared = true;
			this.dispatch("appeared");
		}
	}

	/**
	 * @return Show on init?
	 */
	public get showOnInit(): boolean {
		return this.getPropertyValue("showOnInit");
	}


	/**
	 * If a sprite has `showOnInit = true`, it will animate from "hidden" to
	 * "default" state when initialized. To prevent this but keep
	 * `showOnInit = true`, you can set `sprite.hidden = true`.
	 *
	 * @param value initially hidden?
	 */
	public set hidden(value: boolean) {
		value = $type.toBoolean(value);
		this.setPropertyValue("hidden", value);
	}

	/**
	 * @return Is initially hidden?
	 */
	public get hidden(): boolean {
		return this.getPropertyValue("hidden");
	}


	/**
	 * Returns bounding box (square) for this element.
	 *
	 * @ignore Exclude from docs
	 */
	public get bbox(): IRectangle {
		if (this.definedBBox) {
			return this.definedBBox;
		}
		return this._bbox;
	}

	/**
	 * A list of plugins (objects that implement [[IPlugin]] interface) attached
	 * to this object.
	 *
	 * @since 4.2.2
	 * @return List of plugins
	 */
	public get plugins(): List<IPlugin> {
		if (!this._plugins) {
			this._plugins = new List<IPlugin>();
			this._disposers.push(this._plugins.events.on("inserted", (ev) => {
				ev.newValue.target = this;
				ev.newValue.init();
			}));
			this._disposers.push(new ListDisposer(this._plugins));
		}
		return this._plugins;
	}


	/**
	 * Called during the System.update method
	 *
	 * @ignore Exclude from docs
	 */
	public _systemUpdate(skippedSprites: Array<Sprite>) {
		this.validate();
	}

	/**
	 * Called during the System.update method
	 *
	 * @ignore Exclude from docs
	 */
	public _systemCheckIfValidate(): boolean {
		return true;
	}

	/**
	 * Called during the System.validatePositions method
	 *
	 * @ignore Exclude from docs
	 */
	public _systemValidatePositions() {
		this.validatePosition();
	}

	/**
	 * Called during the System.validateLayouts method
	 *
	 * @ignore Exclude from docs
	 */
	public _systemValidateLayouts() {

	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Sprite"] = Sprite;
