/**
 * This is the main class that encapsulates every object on the chart.
 *
 * If it's an element that is to be displayed on the screen at some point, its
 * class must extend [[Sprite]] class.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SpriteState } from "./SpriteState";
import { SpriteEventDispatcher } from "./SpriteEvents";
export { SpriteEventDispatcher };
import { BaseObjectEvents } from "./Base";
import { Adapter } from "./utils/Adapter";
import { Dictionary, DictionaryTemplate, DictionaryDisposer } from "./utils/Dictionary";
import { ListDisposer, List } from "./utils/List";
import { MultiDisposer, Disposer, MutableValueDisposer } from "./utils/Disposer";
import { Animation, AnimationDisposer } from "./utils/Animation";
import { getGhostPaper } from "./rendering/Paper";
import { Container } from "./Container";
import { Pattern } from "./rendering/fills/Pattern";
import { LinearGradient } from "./rendering/fills/LinearGradient";
import { RadialGradient } from "./rendering/fills/RadialGradient";
import { Color, color, toColor } from "./utils/Color";
import { getInteraction } from "./interaction/Interaction";
import { MouseCursorStyle } from "./interaction/Mouse";
import { options } from "./Options";
import { registry } from "./Registry";
import { NumberFormatter } from "./formatters/NumberFormatter";
import { DateFormatter } from "./formatters/DateFormatter";
import { DurationFormatter } from "./formatters/DurationFormatter";
import { getTextFormatter } from "./formatters/TextFormatter";
import { Language } from "./utils/Language";
import { Export } from "./export/Export";
import * as $utils from "./utils/Utils";
import * as $math from "./utils/Math";
import * as $strings from "./utils/Strings";
import * as $array from "./utils/Array";
import * as $object from "./utils/Object";
import * as $type from "./utils/Type";
import * as $iter from "./utils/Iterator";
import { system } from "./System";
import { Percent } from "./utils/Percent";
/**
 * Defines list ofvisual properties
 */
export var visualProperties = ["fill", "fillOpacity", "stroke", "strokeOpacity", "strokeWidth", "strokeDasharray"]; // do not add opacity here, as it is used for showing/hiding
;
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
var Sprite = /** @class */ (function (_super) {
    tslib_1.__extends(Sprite, _super);
    /**
     * Constructor:
     * * Creates initial node
     * * Sets default properties
     * * Creates required default states
     * * Inits accessibility
     */
    function Sprite() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Holds values for Sprite's properties.
         */
        _this.properties = {};
        /**
         * Event dispacther.
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/event-listeners/} for more info about Events
         * @type {SpriteEventDispatcher<AMEvent<Sprite, ISpriteEvents>>} Event dispatcher instance
         */
        _this.events = new SpriteEventDispatcher(_this);
        /**
         * Holds Adapter.
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/adapters/} for more info about Adapters
         * @type {Adapter<Sprite, ISpriteAdapters>}
         */
        _this.adapter = new Adapter(_this);
        /**
         * @ignore Exclude from docs
         * @todo Description
         */
        _this._bindings = {};
        /**
         * Holds indicator if this Sprite is a "template" to be used for creating
         * other Sprites from and should not be treated as full-fledged element.
         *
         * @ignore Exclude from docs
         * @type {Optional<boolean>}
         */
        _this._isTemplate = false;
        /**
         * Holds indicator whether this sprite was already initialized.
         *
         * @ignore Exclude from docs
         * @type {boolean}
         */
        _this._inited = false;
        /**
         * Holds indicator whether this sprite was already initialized and ready.
         *
         * @ignore Exclude from docs
         * @type {boolean}
         */
        _this._ready = false;
        /**
         * If `sprite.hide()` is called and we have "hidden" state and
         * `transitionDuration > 0`, we set `isHiding` flag to `true` in order to
         * avoid restarting animations in case `hide()` method is called multiple
         * times.
         *
         * @type {boolean}
         */
        _this.isHiding = false;
        /**
         * If `sprite.hide()` is called, we set isHidden to true when sprite is hidden.
         * This was added becaus hidden state might have visibility set to true and so
         * there would not be possible to find out if a sprite is technically hidden or not.
         *
         * @type {boolean}
         */
        _this._isHidden = false;
        /**
         * This property indicates if Sprite is currently being revealed from hidden
         * state. This is used to prevent multiple calls to `sprite.show()` to
         * restart reveal animation. (if enabled)
         *
         * @type {boolean}
         */
        _this.isShowing = false;
        /**
         * Indicates if this element is a standalone instance. A "standalone
         * instance" means this is a autonomous object which maintains its own
         * set of controls like Preloader, Export, etc.
         *
         * @ignore Exclude from docs
         * @type {boolean}
         */
        _this.isStandaloneInstance = false;
        /**
         * Indicates if togglable Sprite is currently active (toggled on).
         *
         * @ignore Exclude from docs
         * @type {boolean}
         */
        _this._isActive = false;
        /**
         * A Sprite element to use as a mask for this Sprite.
         *
         * @ignore Exclude from docs
         * @type {MutableValueDisposer}
         */
        _this._mask = new MutableValueDisposer();
        /**
         * @ignore Exclude from docs
         * @todo Description
         * @type {number}
         */
        _this._positionPrecision = 3;
        /**
         * An instance of [[Language]].
         *
         * @ignore Exclude from docs
         * @type {Language}
         */
        _this._language = new MutableValueDisposer();
        /**
         * Indicates if the chart should follow right-to-left rules.
         *
         * @ignore Exclude from docs
         * @type {boolean}
         */
        _this._rtl = false;
        /**
         * Holds [[Export]] object.
         *
         * @ignore Exclude from docs
         * @type {Export}
         */
        _this._exporting = new MutableValueDisposer();
        /**
         * Defines bounding box (square) for this element.
         *
         * @ignore Exclude from docs
         * @type {IRectangle}
         */
        _this._bbox = { x: 0, y: 0, width: 0, height: 0 };
        /**
         * Indicates if this element is invalid and should be re-validated (redrawn).
         *
         * @ignore Exclude from docs
         * @type {boolean}
         */
        _this.invalid = false;
        /**
         * Indicates if this elements position is invalid and should be repositioned
         *
         * @ignore Exclude from docs
         * @type {boolean}
         */
        _this.positionInvalid = false;
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
        _this.propertyFields = {};
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
        _this.applyOnClones = false;
        // read only, sprite extreme coordinates
        /**
         * @ignore
         */
        _this.maxLeft = 0;
        /**
         * @ignore
         */
        _this.maxRight = 0;
        /**
         * @ignore
         */
        _this.maxTop = 0;
        /**
         * @ignore
         */
        _this.maxBottom = 0;
        _this._isDragged = false;
        /**
         * @deprecated Moved to [[SpriteProperties]]
         * @type {boolean}
         */
        _this._disabled = false;
        _this._internalDisabled = false;
        _this._updateDisabled = false;
        _this._internalDefaultsApplied = false;
        /**
         * Time in milliseconds after which rollout event happens when user rolls-out of the sprite. This helps to avoid flickering in some cases.
         * @type {number}
         */
        _this.rollOutDelay = 0;
        /**
         * This flag is set to `true` for the initial sprite you create and place
         * to the div so that we could clear all additional
         * sprites/containers when this sprite is disposed.
         *
         * @ignore
         */
        _this.isBaseSprite = false;
        /**
         * Indicates whether this sprite should be cloned when cloning its parent
         * container. We set this to `false` in those cases when a sprite is created
         * by the class, so that when cloning a duplicate sprite would not appear.
         *
         * @type {boolean}
         */
        _this.shouldClone = true;
        /**
         * A read-only flag which indicates if a sprite has completed its initial
         * animation (if `showOnInit = true`).
         *
         * In case `showOnInit = false`, `appeared` is set to `true` on init.
         *
         * @readonly
         * @type {boolean}
         */
        _this.appeared = false;
        /**
         * [ex description]
         *
         * @todo Description
         * @ignore
         * @type {number}
         */
        _this.ex = 0;
        /**
         * [ey description]
         *
         * @todo Description
         * @ignore
         * @type {number}
         */
        _this.ey = 0;
        _this.className = "Sprite";
        // Generate a unique ID
        _this.uid;
        // Create SVG group to hold everything in
        _this.group = _this.paper.addGroup("g");
        // Set defaults
        // it is better to set defauls like this in order to save invaliation calls and events
        _this.setPropertyValue("scale", 1);
        _this.setPropertyValue("rotation", 0);
        _this.setPropertyValue("align", "none");
        _this.setPropertyValue("valign", "none");
        _this.setPropertyValue("pixelPerfect", false);
        _this.setPropertyValue("visible", true);
        _this.setPropertyValue("tooltipPosition", "fixed");
        _this.setPropertyValue("verticalCenter", "none");
        _this.setPropertyValue("horizontalCenter", "none");
        _this.setPropertyValue("marginTop", 0);
        _this.setPropertyValue("marginBottom", 0);
        _this.setPropertyValue("marginLeft", 0);
        _this.setPropertyValue("marginRight", 0);
        _this.setPropertyValue("dx", 0);
        _this.setPropertyValue("dy", 0);
        _this.setPropertyValue("paddingTop", 0);
        _this.setPropertyValue("paddingBottom", 0);
        _this.setPropertyValue("paddingRight", 0);
        _this.setPropertyValue("paddingLeft", 0);
        _this.setPropertyValue("togglable", false);
        _this.setPropertyValue("hidden", false);
        _this.setPropertyValue("urlTarget", "_self");
        _this._prevMeasuredWidth = 0;
        _this._prevMeasuredHeight = 0;
        _this._measuredWidth = 0;
        _this._measuredHeight = 0;
        _this._isMeasured = true;
        // Invalidate the Sprite so that renderer knows it needs to be drawn
        _this.invalidate();
        //this.states.create("default").properties.opacity = 1;
        // Apply the theme
        _this.applyTheme();
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
        _this._disposers.push(_this.events);
        _this._disposers.push(_this.group);
        _this._disposers.push(_this._mask);
        _this._disposers.push(_this._language);
        _this._disposers.push(_this._exporting);
        //this._disposers.push(this._parent);
        //this._disposers.push(this._modal);
        _this._disposers.push(new Disposer(function () {
            $object.each(_this._bindings, function (key, value) {
                value.dispose();
            });
        }));
        _this.setPropertyValue("interactionsEnabled", true);
        return _this;
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
    Sprite.prototype.applyTheme = function () {
        _super.prototype.applyTheme.call(this);
        if (options.autoSetClassName) {
            this.setClassName();
        }
    };
    /**
     * Returns theme(s) used by this object either set explicitly on this
     * element, inherited from parent, or inherited from [[System]].
     *
     * @return {ITheme} An array of theme references
     */
    Sprite.prototype.getCurrentThemes = function () {
        var themes = this._themes;
        if (themes) {
            return themes;
        }
        else {
            var parent_1 = this.parent;
            if (parent_1) {
                return parent_1.getCurrentThemes();
            }
            else {
                return registry.themes;
            }
        }
    };
    /**
     * Called just before element's validation, this function allows setting
     * defaults.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.applyInternalDefaults = function () {
        // Nothing here, but extending classes might override this function
        // so that they can set their defaults
        this._internalDefaultsApplied = true;
    };
    /**
     * Invalidates element.
     *
     * Object will be redrawn during the next update cycle.
     *
     * Please note that in most cases elements will auto-invalidate when needed. If
     * everything works, DO NOT use this method. Use it only if some changes do
     * not take otherwise.
     */
    Sprite.prototype.invalidate = function () {
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
    };
    /**
     * Validates element:
     * * Triggers events
     * * Redraws the element
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.validate = function () {
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
    };
    /**
     * Invalidates element's position.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.invalidatePosition = function () {
        if (this.disabled || this._isTemplate) {
            return;
        }
        if (!this.positionInvalid) {
            this.positionInvalid = true;
            registry.addToInvalidPositions(this);
            system.requestFrame();
        }
    };
    /**
     * Transforms the element.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    Sprite.prototype.validatePosition = function () {
        var pixelX = this.pixelX;
        var pixelY = this.pixelY;
        var dx = this.dx;
        var dy = this.dy;
        var x = pixelX + dx;
        var y = pixelY + dy;
        if (this._updateDisabled) {
            if (this._internalDisabled) {
                this.group.attr({ "display": "none" });
            }
            else {
                if (!this.disabled) {
                    this.removeSVGAttribute("display");
                }
            }
            this._updateDisabled = false;
        }
        var sizeChanged = this.measure();
        //if (!this.invalid) {
        var prevGroupTransform = this.group.transformString;
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
        }
        //}
        // it might happen that x and y changed again, so we only remove if they didn't
        if (pixelX + dx == x && pixelY + dy == y) {
            registry.removeFromInvalidPositions(this);
            this.positionInvalid = false;
        }
        var maskRectangle = this._maskRectangle;
        // todo: verify this
        if (maskRectangle) {
            this._clipElement.moveTo({ x: maskRectangle.x - pixelX, y: maskRectangle.y - pixelY });
        }
    };
    /**
     * A placeholder method that is called **before** element begins to be drawn.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.beforeDraw = function () {
    };
    /**
     * A placeholder method that draws the element.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.draw = function () {
    };
    /**
     * A placeholder method that is called **after** element finishes drawing
     * itself.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.afterDraw = function () {
        if (this.isMeasured || this.horizontalCenter !== "none" || this.verticalCenter !== "none") {
            this.measureElement();
        }
        //this.applyMask();
        if (!this._inited) {
            try {
                // used to be applySVGAttrbutes here, this is more efficient
                for (var _a = tslib_1.__values(this.adapter.keys()), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var key = _b.value;
                    switch (key) {
                        case "mask":
                        case "fill":
                        case "opacity":
                        case "fillOpacity":
                        case "stroke":
                        case "strokeOpacity":
                        case "shapeRendering":
                        case "strokeDasharray":
                            //case "focusable":
                            //case "tabindex":
                            //case "role":
                            this[key] = this[key];
                            break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.applyFilters();
            this.visible = this.visible;
            this.interactionsEnabled = this.getPropertyValue("interactionsEnabled"); // can't use .interactionsEnabled as it get's parent's
            this._inited = true;
            if (!this.showOnInit) {
                this.appeared = true;
            }
            this.applyMask();
            this.dispatch("validated");
            this.dispatch("inited");
            this.dispatchReady();
        }
        else {
            this.dispatch("validated");
        }
        var e_1, _c;
    };
    /**
     * Dispatches `"ready"` event. Sprite dispatches it right after `"inited"` event.
     *
     * @ignore
     */
    Sprite.prototype.dispatchReady = function () {
        if (!this.isReady()) {
            this._ready = true;
            this.dispatch("ready");
        }
    };
    /**
     * Triggers a re-initialization of this element.
     *
     * Will result in complete redrawing of the element.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.reinit = function () {
        this._inited = false;
        this.setState(this.defaultState);
        this.invalidate();
    };
    /**
     * Handles the situation where parent element is resized.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.handleGlobalScale = function () {
        this.dispatch("globalscalechanged");
        if (this.nonScalingStroke) {
            this.strokeWidth = this.strokeWidth;
        }
        if (this.nonScaling) {
            this.validatePosition();
        }
        this.updateFilterScale();
    };
    /**
     * Updates filter properties which might depend on scale
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.updateFilterScale = function () {
        var _this = this;
        $iter.each(this.filters.iterator(), function (filter) {
            filter.scale = _this.globalScale;
        });
    };
    /**
     * Removes itself from system's invalid lists.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.removeFromInvalids = function () {
        registry.removeFromInvalidSprites(this);
        registry.removeFromInvalidPositions(this);
    };
    /**
     * Copies all parameters from another [[Sprite]].
     *
     * @param {Sprite} source Source Sprite
     */
    Sprite.prototype.copyFrom = function (source) {
        var _this = this;
        _super.prototype.copyFrom.call(this, source);
        this.events.copyFrom(source.events);
        this.isMeasured = source.isMeasured;
        this.states.copyFrom(source.states);
        if (source.filters.length > 0) {
            source.filters.each(function (filter) {
                _this.filters.push(filter.clone());
            });
        }
        this.adapter.copyFrom(source.adapter);
        //helps to avoid calling getter which creates instance
        if (source["_interaction"]) {
            this.interactions.copyFrom(source.interactions);
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
    };
    Sprite.prototype.dispose = function () {
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
            _super.prototype.dispose.call(this);
            // Clear adapters
            this.adapter.clear();
            if (this.applyOnClones) {
                if (this._clones) {
                    for (var i = this._clones.length - 1; i >= 0; i--) {
                        var clone = this._clones.getIndex(i);
                        clone.dispose();
                    }
                }
            }
            if (this._svgContainer) {
                this._svgContainer.dispose();
            }
            if (this._interactionDisposer) {
                this._interactionDisposer.dispose();
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
            if (this.stroke && !(this.stroke instanceof Color)) {
                this.stroke.dispose();
            }
            // TODO a bit hacky
            if (this.fill && !(this.fill instanceof Color)) {
                this.fill.dispose();
            }
            // remove from map
            if ($type.hasValue(this.id)) {
                this.map.removeKey(this.id);
            }
            this.parent = undefined;
            if (this._filters) {
                while (this._filters.length > 0) {
                    var filter = this._filters.getIndex(0);
                    filter.dispose();
                    this._filters.removeValue(filter);
                }
            }
        }
    };
    Object.defineProperty(Sprite.prototype, "isTemplate", {
        /**
         * @ignore Exclude from docs
         * @return {boolean} Is template?
         */
        get: function () {
            return this._isTemplate;
        },
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
        set: function (value) {
            value = $type.toBoolean(value);
            if (this._isTemplate != value) {
                this._isTemplate = value;
                if (this instanceof Container) {
                    $iter.each(this.children.iterator(), function (child) {
                        child.isTemplate = value;
                    });
                }
                if (value) {
                    this.parent = this.parent;
                    this.removeFromInvalids();
                }
                else {
                    this.invalidate();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "showSystemTooltip", {
        /**
         * @return {boolean} Show system tooltip?
         */
        get: function () {
            if (!$type.hasValue(this._showSystemTooltip)) {
                if (this.parent) {
                    return this.parent.showSystemTooltip;
                }
                else {
                    return false;
                }
            }
            return this._showSystemTooltip;
        },
        /**
         * Indicates whether the element should attempt to construct itself in a way
         * so that system tooltip is shown if its `readerTitle` is set.
         *
         * @param {boolean} value Show system tooltip?
         */
        set: function (value) {
            value = $type.toBoolean(value);
            this._showSystemTooltip = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "topParent", {
        /**
         * ==========================================================================
         * HIERARCHY AND STRUCTURE RELATED STUFF
         * ==========================================================================
         * @hidden
         */
        /**
         * Sprites's top-level [[Container]].
         *
         * In most cases that will be a Chart.
         *
         * @return {Optional<Container>} Top-level ascendant
         */
        get: function () {
            if (this._topParent) {
                return this._topParent;
            }
            else {
                if (this.parent) {
                    return this.parent.topParent;
                }
            }
        },
        /**
         * @ignore
         * @param value {Container} top parent of a sprite
         */
        set: function (value) {
            this._topParent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "parent", {
        /**
         * @return {Optional<Container>} Parent container
         */
        get: function () {
            return this._parent;
        },
        /**
         * Elements' parent [[Container]].
         *
         * @param {Optional<Container>}  parent  Parent container
         */
        set: function (parent) {
            if (this._isTemplate) {
                return;
            }
            var currentPaper = this.paper;
            var oldParent = this._parent;
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
                }
                else {
                    this.topParent = undefined;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "virtualParent", {
        /**
         * @return {Optional<Container>} Virtual parent
         */
        get: function () {
            return this._virtualParent;
        },
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
        set: function (value) {
            this._virtualParent = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Moves `<defs>` to correct place in DOM.
     *
     * Some elements are initially created in "ghost" container. When moving
     * those into proper place in DOM, their respective `<defs>` need to be moved
     * as well.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.appendDefs = function () {
        if (this.filterElement) {
            this.paper.appendDef(this.filterElement);
        }
        var fill = this.fill;
        if (fill && fill.element) {
            this.paper.appendDef(fill.element);
        }
        var stroke = this.stroke;
        if (stroke && stroke.element) {
            this.paper.appendDef(stroke.element);
        }
        if (this.fillModifier && this.fill instanceof Color) {
            var fill_1 = this.fillModifier.modify(this.fill);
            if (fill_1 && fill_1.element) {
                this.paper.appendDef(fill_1.element);
            }
        }
        if (this.strokeModifier && this.stroke instanceof Color) {
            var stroke_1 = this.strokeModifier.modify(this.stroke);
            if (stroke_1 && stroke_1.element) {
                this.paper.appendDef(stroke_1.element);
            }
        }
        if (this._clipPath) {
            this.paper.appendDef(this._clipPath);
        }
    };
    Object.defineProperty(Sprite.prototype, "map", {
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
        get: function () {
            var top = this.topParent;
            if (top) {
                return top.map;
            }
            else if (!this._map) {
                this._map = new Dictionary();
            }
            return this._map;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "id", {
        /**
         * @return {string} ID
         */
        get: function () {
            return this._id;
        },
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
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "dom", {
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
        get: function () {
            return this.group.node;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "paper", {
        /**
         * @ignore Exclude from docs
         * @return {Paper} Paper
         */
        get: function () {
            if (this._paper) {
                return this._paper;
            }
            else {
                if (this.parent) {
                    return this.parent.paper;
                }
            }
            return getGhostPaper();
        },
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
        set: function (paper) {
            this.setPaper(paper);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets [[Paper]] instance to use to draw elements.
     * @ignore
     * @param {Paper} paper Paper
     * @return {boolean} true if paper was changed, false, if it's the same
     */
    Sprite.prototype.setPaper = function (paper) {
        var oldPaper = this._paper;
        if (oldPaper != paper) {
            this._paper = paper;
            this.appendDefs();
            return true;
        }
        return false;
    };
    Object.defineProperty(Sprite.prototype, "htmlContainer", {
        /**
         * @return {Optional<HTMLElement>} HTML element
         */
        get: function () {
            if (this._htmlContainer) {
                return this._htmlContainer;
            }
            else {
                if (this.parent) {
                    return this.parent.htmlContainer;
                }
            }
        },
        /**
         * An HTML element to be used when placing wrapper element (`<div>`)
         * for the whole chart.
         *
         * This is the same for **all** elements within the same chart.
         *
         * @param {Optional<HTMLElement>} htmlContainer HTML element
         */
        set: function (htmlContainer) {
            this._htmlContainer = htmlContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "titleElement", {
        /**
         * Creates (if not yet created) and returns element's `<title>` element.
         *
         * @ignore Exclude from docs
         * @return {AMElement} Title element
         */
        get: function () {
            if (!this._titleElement) {
                this._titleElement = this.paper.add("title");
                this.group.add(this._titleElement);
            }
            return this._titleElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "descriptionElement", {
        /**
         * Creates (if not yet created) and returns element's `<desc>` element.
         *
         * @ignore Exclude from docs
         * @return {AMElement} Desc element
         */
        get: function () {
            if (!this._descriptionElement) {
                this._descriptionElement = this.paper.add("desc");
                this.group.add(this._descriptionElement);
            }
            return this._descriptionElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "filters", {
        /**
         * Returns list of SVG filters (effects) applied to element. If the filter
         * list is not yet initilized, creates and returns an empty one.
         * Note, not all filters combine well with one another. We recommend using one filter per sprite.
         *
         * @return {List<Filter>} List of filters
         */
        get: function () {
            if (!this._filters) {
                this._filters = new List();
                // TODO only add certain events ?
                this._disposers.push(this._filters.events.onAll(this.applyFilters, this));
                this._disposers.push(new ListDisposer(this._filters));
            }
            return this._filters;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets required SVG attributes. Must be called every time an element is
     * redrawn so that attributes are (re)applied.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.setSVGAttributes = function () {
        this.fill = this.fill;
        this.opacity = this.opacity;
        this.fillOpacity = this.fillOpacity;
        this.stroke = this.stroke;
        this.strokeOpacity = this.strokeOpacity;
        this.shapeRendering = this.shapeRendering;
        this.strokeDasharray = this.strokeDasharray;
        this.focusable = this.focusable;
        this.tabindex = this.tabindex;
        this.role = this.role;
    };
    /**
     * Sets an attribute directly on an SVG element.
     *
     * @ignore Exclude from docs
     * @param {ISVGAttribute} attribute Attribute object
     */
    Sprite.prototype.setSVGAttribute = function (attribute) {
        this.group.attr(attribute);
    };
    /**
     * Removes an attribute directly from SVG element.
     *
     * @param {string} attribute Attribute key to remove
     */
    Sprite.prototype.removeSVGAttribute = function (attribute) {
        this.group.removeAttr(attribute);
    };
    /**
     * Sets `class` attribute of the elements SVG node.
     *
     * Uses `am4core.options.classNamePrefix`.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.setClassName = function () {
        var className = this.className;
        var classNamePrefix = options.classNamePrefix;
        if (this.element) {
            this.element.addClass(classNamePrefix + className);
        }
        this.group.addClass(classNamePrefix + className + "-group");
        if ($type.hasValue(this.id)) {
            this.group.addClass(classNamePrefix + this.id);
        }
    };
    /**
     * Adds an `id` attribute the the element and returns the id.
     *
     * @ignore Exclude from docs
     * @return {string} Element's ID
     */
    Sprite.prototype.uidAttr = function () {
        this.setSVGAttribute({ "id": this.uid });
        return this.uid;
    };
    /**
     * [updateClipPath description]
     *
     * @todo Description
     */
    Sprite.prototype.updateClipPath = function () {
        var element = this._clipElement;
        if (element) {
            element.moveTo({ x: this.mask.pixelX, y: this.mask.pixelY });
        }
    };
    /**
     * @ignore
     */
    Sprite.prototype.createClipPath = function () {
        if (!this._clipPath) {
            this._clipPath = this.paper.addGroup("clipPath");
            this.paper.appendDef(this._clipPath);
            this._disposers.push(this._clipPath);
            var id = registry.getUniqueId();
            this._clipPath.attr({ "id": id });
            this.group.attr({ "clip-path": "url(#" + id + ")" });
        }
    };
    /**
     * Applies the mask Sprite.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.applyMask = function () {
        var mask = this.mask;
        if (this._clipPath && mask) {
            // Container
            if (mask instanceof Container) {
                this._clipElement.attr({ "width": $math.max(0, mask.pixelWidth), "height": $math.max(0, mask.pixelHeight) });
                var point = $utils.spritePointToSprite({ x: mask.pixelX, y: mask.pixelY }, mask.parent, this);
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
    };
    /**
     * Applies filters to the element.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.applyFilters = function () {
        var _this = this;
        // we create a separate filter for each sprite as otherwise it would be impossible to animate filter.
        // svg doesn't support multiple filters applied to one element, so we put all the primitives to one filterElement of a sprite.
        if (this._filters && this._filters.length > 0) {
            var width_1 = 100;
            var height_1 = 100;
            if (!this.filterElement) {
                this.filterElement = this.paper.addGroup("filter");
                this._disposers.push(this.filterElement);
            }
            else {
                this.filterElement.removeChildNodes();
            }
            this.paper.appendDef(this.filterElement);
            var id = "filter-" + this.uid;
            this.filterElement.attr({ "id": id });
            $iter.each(this.filters.iterator(), function (filter) {
                filter.sprite = _this;
                filter.paper = _this.paper;
                filter.appendPrimitives(_this.filterElement);
                if (filter.width > width_1) {
                    width_1 = filter.width;
                }
                if (filter.height > height_1) {
                    height_1 = filter.height;
                }
                filter.scale = _this.globalScale;
            });
            this.filterElement.attr({ "width": width_1 + "%", "height": height_1 + "%", "x": -(width_1 - 100) / 2 + "%", "y": -(height_1 - 100) / 2 + "%" });
            this.group.attr({ "filter": "url(#" + id + ")" });
        }
        else if (this.filterElement) {
            this.group.removeAttr("filter");
            this.filterElement.removeChildNodes();
        }
    };
    /**
     * [removeClipPath description]
     *
     * @ignore Exclude from docs
     * @todo Description
     */
    Sprite.prototype.removeClipPath = function () {
        if (this._clipPath) {
            //this._clipPath.dispose();
            this.removeDispose(this._clipPath);
            this._clipPath = undefined;
        }
    };
    Sprite.prototype.setElement = function (element) {
        this.element = element;
        this.setSVGAttributes();
        this.applyAccessibility();
    };
    Object.defineProperty(Sprite.prototype, "element", {
        /**
         * @return {AMElement} Element
         */
        get: function () {
            return this._element;
        },
        /**
         * The main element for this Sprite, usually an SVG `<g>`.
         *
         * All other sub-elements are created in it.
         *
         * @param {Optional<AMElement>}  element  Element
         */
        set: function (element) {
            // Destroy previous element if there was one before
            this.removeElement();
            // Set new element
            this._element = element;
            // Add element to group
            // Since we are adding Element to group, which is already in the
            // `.disposers` it will be removed automatically when Sprite is disposed
            // of
            this.group.add(element);
            // This is needed if someone is setting element not in draw method but
            // from outside
            if (!this.invalid) {
                this.validate();
            }
            if (options.autoSetClassName) {
                this.setClassName();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "svgContainer", {
        /**
         * HTML container (`<div>`) which is used to place chart's `<svg>` element
         * in.
         *
         * @return {Optional<SVGContainer>} Container for chart elements
         */
        get: function () {
            if (this._svgContainer) {
                return this._svgContainer;
            }
            else {
                if (this.parent) {
                    return this.parent.svgContainer;
                }
            }
        },
        /**
         * Sets HTML container to add SVG and other chart elements to.
         *
         * @param {Optional<SVGContainer>} svgContainer Container for chart elements
         */
        set: function (svgContainer) {
            this._svgContainer = svgContainer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Measures main element.
     *
     * Saves measurements into private `_bbox` property.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.measureElement = function () {
        if (this.element) {
            if (this.definedBBox) {
                this._bbox = this.definedBBox;
            }
            else {
                var svgBBox = this.element.getBBox();
                this._bbox = { x: svgBBox.x, y: svgBBox.y, width: svgBBox.width, height: svgBBox.height };
            }
        }
    };
    /**
     * Positions element according its center settings.
     *
     * @todo Description (review)
     * @ignore Exclude from docs
     */
    Sprite.prototype.updateCenter = function () {
        if (this.element) {
            var prevElementTransform = this.element.transformString;
            var bbox = this.bbox;
            var ex = 0;
            var ey = 0;
            var elementX = bbox.x;
            var elementY = bbox.y;
            var elementWidth = bbox.width;
            var elementHeigth = bbox.height;
            var pixelPaddingLeft = this.pixelPaddingLeft;
            var pixelPaddingRight = this.pixelPaddingRight;
            var pixelPaddingTop = this.pixelPaddingTop;
            var pixelPaddingBottom = this.pixelPaddingBottom;
            // add padding to the measured size
            var measuredWidth = $math.max(bbox.width + pixelPaddingLeft + pixelPaddingRight, this.pixelWidth);
            var measuredHeight = $math.max(bbox.height + pixelPaddingTop + pixelPaddingBottom, this.pixelHeight);
            // extremes
            var left = bbox.x;
            var right = bbox.x + measuredWidth;
            var top_1 = bbox.y;
            var bottom = bbox.y + measuredHeight;
            var horizontalCenter = this.horizontalCenter;
            var verticalCenter = this.verticalCenter;
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
            var x = $math.round(ex - elementX, this._positionPrecision, true);
            var y = $math.round(ey - elementY, this._positionPrecision, true);
            this.ex = x - pixelPaddingLeft;
            this.ey = y - pixelPaddingTop;
            this.maxLeft = left + x - pixelPaddingLeft;
            this.maxRight = right + x - pixelPaddingLeft;
            this.maxTop = top_1 + y - pixelPaddingTop;
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
    };
    /**
     * Measures the whole element.
     *
     * Returns `true` if the size has changed from the last measurement.
     *
     * @ignore Exclude from docs
     * @return {boolean} Did the size changed from the last measurement?
     */
    Sprite.prototype.measure = function () {
        this.updateCenter();
        var bbox = this.bbox;
        var measuredWidth = this._measuredWidth;
        var measuredHeight = this._measuredHeight;
        // extremes
        var left = this.maxLeft;
        var right = this.maxRight;
        var top = this.maxTop;
        var bottom = this.maxBottom;
        // non-parent wise size
        this._measuredWidthSelf = measuredWidth;
        this._measuredHeightSelf = measuredHeight;
        var positionPrecision = this._positionPrecision;
        // if a sprite is rotated or scaled, calculate measured size after transformations
        if (this.rotation !== 0 || this.scale !== 1) {
            // not good to handleGlobalScale here.
            if (this.nonScalingStroke) {
                this.strokeWidth = this.strokeWidth;
            }
            var svg = this.paper.svg;
            var matrix = svg.createSVGMatrix();
            var rotation = this.rotation;
            matrix.a = $math.cos(rotation) * this.scale;
            matrix.c = -$math.sin(rotation) * this.scale;
            matrix.e = 0;
            matrix.b = $math.sin(rotation) * this.scale;
            matrix.d = $math.cos(rotation) * this.scale;
            matrix.f = 0;
            var p1 = svg.createSVGPoint();
            p1.x = left;
            p1.y = top;
            var p2 = svg.createSVGPoint();
            p2.x = right;
            p2.y = top;
            var p3 = svg.createSVGPoint();
            p3.x = right;
            p3.y = bottom;
            var p4 = svg.createSVGPoint();
            p4.x = left;
            p4.y = bottom;
            var pt1 = p1.matrixTransform(matrix);
            var pt2 = p2.matrixTransform(matrix);
            var pt3 = p3.matrixTransform(matrix);
            var pt4 = p4.matrixTransform(matrix);
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
            if (this.isHover && this.tooltip && this.tooltip.visible) {
                this.updateTooltipPosition();
            }
            return true;
        }
        return false;
    };
    /**
     * Insert this element before sibling element.
     *
     * @param  {Sprite}  sprite  Target element
     * @return {Sprite}          This element
     */
    Sprite.prototype.insertBefore = function (sprite) {
        var parent = this.parent;
        if (parent) {
            var index = parent.children.indexOf(sprite);
            if (index !== -1) {
                parent.children.moveValue(this, index);
                parent.sortChildren();
            }
        }
        return this;
    };
    /**
     * Insert this element after sibling element.
     *
     * @param  {Sprite}  sprite  Target element
     * @return {Sprite}          This element
     */
    Sprite.prototype.insertAfter = function (sprite) {
        var parent = this.parent;
        if (parent) {
            var index = parent.children.indexOf(sprite);
            if (index !== -1) {
                parent.children.moveValue(this, index + 1);
                parent.sortChildren();
            }
        }
        return this;
    };
    /**
     * Removes the main SVG element.
     *
     * This does not destroy the whole Sprite element. To do that use
     * `dispose()` instead.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.removeElement = function () {
        // remove visual element
        if (this._element) {
            this.removeDispose(this._element);
            this._element = undefined;
        }
    };
    /**
     * Returns relative (percent) value of the X coordindate within this element.
     *
     * A relative value is a hundredth of a percent. So 100% would result in a 1
     * as relative value.
     *
     * @param  {number | Percent}  value  Absolute or relative X coordinate
     * @return {number}                   Relative value
     */
    Sprite.prototype.getRelativeX = function (value) {
        if (value instanceof Percent) {
            return value.value;
        }
        else if (this.parent) {
            return value / this.parent.innerWidth;
        }
        return 0;
    };
    /**
     * Returns relative (percent) value of the Y coordindate within this element.
     *
     * A relative value is a hundredth of a percent. So 100% would result in a 1
     * as relative value.
     *
     * @param  {number | Percent}  value  Absolute or relative Y coordinate
     * @return {number}                   Relative value
     */
    Sprite.prototype.getRelativeY = function (value) {
        if (value instanceof Percent) {
            return value.value;
        }
        else if (this.parent) {
            return value / this.parent.innerHeight;
        }
        return 0;
    };
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
    Sprite.prototype.getPixelX = function (value) {
        // we don't use $utils.valueToRelative as this would mean that we should access parent.innerWidth
        // all the time and this would result chain of the same actions and will slow down the system a lot
        var pixel = 0;
        if ($type.isNumber(value)) {
            pixel = value;
        }
        else if (value instanceof Percent) {
            var relative = value.value;
            if (this.parent) {
                pixel = $math.round(this.parent.innerWidth * relative, this._positionPrecision, true);
            }
        }
        return pixel;
    };
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
    Sprite.prototype.getPixelY = function (value) {
        // we don't use $utils.valueToRelative as this would mean that we should access parent.innerWidth
        // all the time and this would result chain of the same actions and will slow down the system a lot
        var pixel = 0;
        if ($type.isNumber(value)) {
            pixel = value;
        }
        else if (value instanceof Percent) {
            var relative = value.value;
            if (this.parent) {
                pixel = $math.round(this.parent.innerHeight * relative, this._positionPrecision, true);
            }
        }
        return pixel;
    };
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
    Sprite.prototype.moveTo = function (point, rotation, scale, isDragged) {
        if (this.isDragged && !isDragged) {
            return;
        }
        if (point) {
            if ($type.isNumber(point.x)) {
                this.setPropertyValue("x", point.x);
            }
            if ($type.isNumber(point.y)) {
                this.setPropertyValue("y", point.y);
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
    };
    Object.defineProperty(Sprite.prototype, "mask", {
        /**
         * Returns [[Sprite]] element currently used as mask for this element.
         *
         * @ignore Exclude from docs
         * @return {Optional<Sprite>} A [[Sprite]] to use as mask
         */
        get: function () {
            return this.adapter.apply("mask", this._mask.get());
        },
        /**
         * Sets another [[Sprite]] element as this elements mask.
         *
         * @ignore Exclude from docs
         * @param {Optional<Sprite>} mask A [[Sprite]] to use as mask
         */
        set: function (mask) {
            var _this = this;
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
                        mask.events.on("maxsizechanged", function () { if (_this.inited) {
                            _this.applyMask;
                        } }, undefined, false),
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "maskRectangle", {
        /**
         * @ignore Exclude from docs
         * @return {IRectangle} Mask Rectangle
         */
        get: function () {
            return this._maskRectangle;
        },
        // you can set IRectangle as a mask instead o a sprite. Note, the changes of the object won't be monitored
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
        set: function (rect) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "isMeasured", {
        /**
         * @ignore Exclude from docs
         * @return {boolean} Was element already measured?
         */
        get: function () {
            return this._isMeasured;
        },
        /**
         * Indicates if this element was already measured.
         *
         * @ignore Exclude from docs
         * @param {boolean} value Was element already measured?
         */
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if the this element has any of its parts overlapping with another
     * element.
     *
     * @todo Description (review)
     * @param  {Sprite}   sprite  Second element to test again
     * @return {boolean}          Overlapping?
     */
    Sprite.prototype.hitTest = function (sprite) {
        // validate, otherwise we will not know measuredWidth and measuredHeight
        if (this.invalid) {
            this.validate();
        }
        if (sprite.invalid) {
            sprite.validate();
        }
        var ax1 = this.pixelX;
        var ay1 = this.pixelY;
        var ax2 = ax1 + this.measuredWidth;
        var ay2 = ay1 + this.measuredHeight;
        var bx1 = sprite.pixelX;
        var by1 = sprite.pixelY;
        var bx2 = bx1 + sprite.measuredWidth;
        var by2 = by1 + sprite.measuredHeight;
        return !(bx1 > ax2 || bx2 < ax1 || by1 > ay2 || by2 < ay1);
    };
    Object.defineProperty(Sprite.prototype, "inited", {
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
        get: function () {
            return this._inited;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns `true` if Sprite has already finished initializing and is ready.
     *
     * If this object is a [[Container]] it will wait for all of its children
     * are ready before becoming ready itself and firing a `"ready"` event.
     *
     * @return {boolean} is ready?
     */
    Sprite.prototype.isReady = function () {
        return this._ready;
    };
    Object.defineProperty(Sprite.prototype, "states", {
        /**
         * Returns a collection of element's available [[SpriteState]] entries.
         *
         * @see {@link SpriteState}
         * @return {DictionaryTemplate<string, SpriteState>} States
         */
        get: function () {
            if (!this._states) {
                var state = new SpriteState();
                // works
                this._states = new DictionaryTemplate(state);
                // TODO what about removeKey ?
                this._disposers.push(this._states.events.on("insertKey", this.processState, this, false));
                this._disposers.push(this._states.events.on("setKey", this.processState, this, false));
                this._disposers.push(new DictionaryDisposer(this._states));
                this._disposers.push(state);
            }
            return this._states;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "hiddenState", {
        /**
         * Returns a [[SpriteState]] object for "hidden" state.
         *
         * This is a shortcut to `this.states.getKey("hidden")`.
         *
         * @return {SpriteState} Hidden state
         */
        get: function () {
            if (!this.states.getKey("hidden")) {
                var hiddenState = this.states.create("hidden");
                hiddenState.properties.opacity = 0;
                hiddenState.properties.visible = false;
            }
            return this.states.getKey("hidden");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "defaultState", {
        /**
         * Returns a [[SpriteState]] object for "default" state.
         *
         * This is a shortcut to `this.states.getKey("default")`.
         *
         * @return {SpriteState} Hidden state
         */
        get: function () {
            if (!this.states.getKey("default")) {
                var defaultState = this.states.create("default");
                defaultState.properties.opacity = 1;
            }
            return this.states.getKey("default");
        },
        enumerable: true,
        configurable: true
    });
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
    Sprite.prototype.processState = function (event) {
        var state = event.newValue;
        state.sprite = this;
        state.name = event.key;
        if (this.states.hasKey("hover") || $type.hasValue(this.tooltipHTML) || $type.hasValue(this.tooltipText)) {
            this.hoverable = true;
        }
        if (this.states.hasKey("down")) {
            this.clickable = true;
        }
        if (this.states.hasKey("focus")) {
            this.focusable = true;
        }
        // Propagate the new state to clones
        if (this.applyOnClones) {
            var clones = this.clones.values;
            var length_1 = clones.length;
            for (var i = 0; i < length_1; ++i) {
                var clone = clones[i];
                if (!clone.isDisposed()) {
                    clone.states.setKey(state.name, state);
                }
            }
        }
    };
    Object.defineProperty(Sprite.prototype, "animations", {
        /**
         * Returns a list elements's animations currently being played.
         *
         * If the list has not been initialized it is created.
         *
         * @return {Array<Animation>} List of animations
         */
        get: function () {
            if (!this._animations) {
                this._animations = [];
                this._disposers.push(new AnimationDisposer(this._animations));
            }
            return this._animations;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Converts element's local coordinates to the coordinates within the main
     * chart container.
     *
     * @param  {IPoint}  point  Local point
     * @return {IPoint}         Global point
     */
    Sprite.prototype.getSvgPoint = function (point) {
        // Calculate SVG point
        var bbox = this.htmlContainer.getBoundingClientRect();
        return {
            "x": point.x - bbox.left,
            "y": point.y - bbox.top
        };
    };
    /**
     * Creates and starts an [[Animation]] with given `animationOptions`.
     *
     * @see {@link Animation} for additional information about available options
     * @param  {ISpriteAnimationOptions[] | ISpriteAnimationOptions}  animationOptions  Animation options
     * @param  {number}                                               duration          Duration in milliseconds
     * @param  {(number) => number}                                   easing            Easing function
     * @return {Animation}                                                              Animation instance
     */
    Sprite.prototype.animate = function (animationOptions, duration, easing) {
        return new Animation(this, animationOptions, duration, easing).start();
    };
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
    Sprite.prototype.setState = function (value, transitionDuration, easing) {
        var state;
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
    };
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
    Sprite.prototype.applyCurrentState = function (duration) {
        //if (!this.isHidden) { // this was done for hover state not to take effect if "hidden" is actually visible, need to think about it.
        var animation = this.setState(this.defaultState, duration);
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
    };
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
    Sprite.prototype.transitTo = function (state, duration, easing) {
        var _this = this;
        // Init
        var options = [], propValues = state.allValues, transition;
        // todo: do this for numeric/color properties only?
        // @todo use state.getPropertyValue instead
        $object.each(propValues, function (propertyName, finalValue) {
            var currentValue = _this[propertyName];
            // save current value to default state. this solves a big problem where values must be set both on sprite and default state
            if (finalValue != currentValue && _this.defaultState.properties[propertyName] == undefined) {
                _this.defaultState.properties[propertyName] = currentValue;
            }
            //if (finalValue != currentValue && $type.hasValue(finalValue)) {
            if ($type.hasValue(finalValue)) {
                var option = { from: currentValue, to: finalValue, property: propertyName };
                options.push(option);
            }
        });
        if (options.length > 0) {
            transition = this.animate(options, duration, easing);
            if (transition && !transition.isFinished()) {
                // TODO should this use events.once ?
                // TODO push onto _disposers array ?
                this._disposers.push(transition.events.on("animationended", function () {
                    _this.dispatchImmediately("transitionended");
                }));
            }
            else {
                this.dispatchImmediately("transitionended");
            }
        }
        // apply filters if set
        if (state.filters.length > 0) {
            var newFilters_1 = [];
            // check for the same filters
            $iter.each(state.filters.iterator(), function (stateFilter) {
                var newFilter = stateFilter.clone();
                newFilters_1.push(newFilter);
                var animationOptions = [];
                $iter.each(_this.filters.iterator(), function (currentFilter) {
                    // if we have the same filters
                    if (currentFilter.className == newFilter.className) {
                        if (!$iter.contains(_this.defaultState.filters.iterator(), function (x) { return x.className === newFilter.className; })) {
                            _this.defaultState.filters.push(currentFilter);
                        }
                        $object.each(newFilter.properties, function (propertyName, newValue) {
                            var currentValue = currentFilter.properties[propertyName];
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
            this.filters.pushAll(newFilters_1);
        }
        return transition;
    };
    /**
     * Returns `true` if Sprite is currently transiting from one state/value to
     * another.
     *
     * @return {boolean} Is in transition?
     */
    Sprite.prototype.isInTransition = function () {
        return this.animations.length > 0;
    };
    Object.defineProperty(Sprite.prototype, "isHover", {
        /**
         * Returns indicator if this element has a mouse pointer currently hovering
         * over it, or if it has any touch pointers pressed on it.
         *
         * @return {boolean} Is hovered?
         */
        get: function () {
            if (this.isInteractive()) {
                return this.interactions.isHover;
            }
            return false;
        },
        /**
         * Indicates if this element has a mouse pointer currently hovering
         * over it, or if it has any touch pointers pressed on it.
         *
         * @param {boolean} value Is hovered?
         */
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "isDragged", {
        /**
         * Returns indicator if this element is being dragged at the moment.
         *
         * @return {boolean} Is dragged?
         */
        get: function () {
            return this._isDragged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "isDown", {
        /**
         * @return {boolean} Is down?
         */
        get: function () {
            if (this.isInteractive()) {
                return this.interactions.isDown;
            }
            return false;
        },
        /**
         * Indicates if this element has any pointers (mouse or touch) pressing down
         * on it.
         *
         * @param {boolean} value Is down?
         */
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "isFocused", {
        /**
         * @return {boolean} Is focused?
         */
        get: function () {
            if (this.isInteractive()) {
                return this.interactions.isFocused;
            }
            return false;
        },
        /**
         * Indicates if this element is focused (possibly by tab navigation).
         *
         * @param {boolean} value Is focused?
         */
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "isActive", {
        /**
         * @return {boolean} Is active?
         */
        get: function () {
            return this._isActive;
        },
        /**
         * Indicates if this element is currently active (toggled on) or not
         * (toggled off).
         *
         * @param {boolean} value Is active?
         */
        set: function (value) {
            this.setActive(value);
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype.setActive = function (value) {
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
    };
    Object.defineProperty(Sprite.prototype, "disabled", {
        /**
         * @return {boolean} Disabled?
         */
        get: function () {
            //if(this._internalDisabled){
            //	return true;
            //}
            var current = this.getPropertyValue("disabled");
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
        },
        /**
         * Controls if element is disabled.
         *
         * A disabled element is hidden, and is removed from any processing, layout
         * calculations, and generally treated as if it does not exist.
         *
         * The element itself is not destroyed, though. Setting this back to `false`,
         * will "resurrect" the element.
         *
         * @param {boolean}  value  Disabled?
         */
        set: function (value) {
            this.setDisabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype.setDisabled = function (value) {
        value = $type.toBoolean(value);
        var current = this.getPropertyValue("disabled");
        if (current != value) {
            this.setPropertyValue("disabled", value, true);
            if (value) {
                this.parent = this.parent;
                this.removeFromInvalids();
                this.group.attr({ "display": "none" });
            }
            else {
                if (this instanceof Container) {
                    this.deepInvalidate();
                }
                else {
                    this.invalidate();
                }
                if (!this.__disabled) {
                    this.removeSVGAttribute("display");
                }
            }
            this.dispatch("transformed");
            system.requestFrame();
            return true;
        }
        return false;
    };
    Object.defineProperty(Sprite.prototype, "__disabled", {
        /**
         * @ignore
         * @return {boolean} Disabled?
         */
        get: function () {
            return this._internalDisabled;
        },
        /**
         * Internal disable method.
         *
         * Do not use it for disabling elements. Use `disabled` accessor instead.
         *
         * @ignore Exclude from docs
         * @param {boolean} value Disabled?
         */
        set: function (value) {
            if (this._internalDisabled != value) {
                this._internalDisabled = value;
                this._updateDisabled = true;
                this.invalidatePosition(); // better use this instead of invalidate()
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "numberFormatter", {
        /**
         * @return {NumberFormatter} A [[NumberFormatter]] instance to be used
         */
        get: function () {
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
        },
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
        set: function (value) {
            this._numberFormatter = value;
            this._numberFormatter.language = this.language;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "dateFormatter", {
        /**
         * @return {DateFormatter} An instance of DateFormatter
         */
        get: function () {
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
        },
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
        set: function (value) {
            this._dateFormatter = value;
            this._dateFormatter.language = this.language;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "durationFormatter", {
        /**
         * @return {DurationFormatter} An instance of DurationFormatter
         */
        get: function () {
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
        },
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
        set: function (value) {
            this._durationFormatter = value;
            this._durationFormatter.language = this.language;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "language", {
        /**
         * @return {Language} An instance of Language
         */
        get: function () {
            var language = this._language.get();
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
        },
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
        set: function (value) {
            var _this = this;
            if (this._language.get() !== value) {
                this._language.set(value, value.events.on("localechanged", function (ev) {
                    if (_this instanceof Container) {
                        _this.deepInvalidate();
                    }
                }));
            }
        },
        enumerable: true,
        configurable: true
    });
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
    Sprite.prototype.populateString = function (string, dataItem) {
        if ($type.hasValue(string)) {
            string = $type.castString(string);
            string = getTextFormatter().escape(string);
            var tags = string.match(/\{([^}]+)\}/g);
            var i = void 0;
            if (tags) {
                for (i = 0; i < tags.length; i++) {
                    var tag = tags[i].replace(/\{([^}]+)\}/, "$1");
                    var value = this.getTagValue(tag, "", dataItem);
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
        return this.adapter.apply("populateString", string);
    };
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
    Sprite.prototype.getTagValue = function (tagName, format, dataItem) {
        var value;
        if (!$type.hasValue(dataItem)) {
            dataItem = this.dataItem;
        }
        // Parse parts
        var parts = [];
        var reg = /([^.]+)\(([^)]*)\)|([^.]+)/g;
        ;
        var matches;
        while ((matches = reg.exec(tagName)) !== null) {
            if (matches[3]) {
                // Simple property
                parts.push({
                    prop: matches[3]
                });
            }
            else {
                // Method
                // Parse parameters
                var params = [];
                if ($utils.trim(matches[2]) != "") {
                    var reg2 = /'([^']*)'|"([^"]*)"|([0-9\-]+)/g;
                    var matches2 = void 0;
                    while ((matches2 = reg2.exec(matches[2])) !== null) {
                        params.push(matches2[1] || matches2[2] || matches2[3]);
                    }
                }
                parts.push({
                    method: matches[1],
                    params: params
                });
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
            var dataContext = dataItem.dataContext;
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
            value = this.getTagValueFromObject(parts, this.populateStringFrom || this);
        }
        // Finally, check the parent
        if (!$type.hasValue(value) && this.parent) {
            value = this.parent.getTagValue(tagName, format);
        }
        return value;
    };
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
    Sprite.prototype.getTagValueFromObject = function (parts, object, format) {
        var current = object;
        var formatApplied = false;
        for (var i = 0, len = parts.length; i < len; i++) {
            var part = parts[i];
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
                        var numberValue = $utils.anyToNumber(current);
                        if ($type.hasValue(numberValue)) {
                            current = this.numberFormatter.format(numberValue, format || part.params[0] || undefined);
                            formatApplied = true;
                        }
                        break;
                    case "formatDate":
                        var dateValue = $utils.anyToDate(current);
                        if (!$type.isDate(dateValue) || $type.isNaN(dateValue.getTime())) {
                            // Was not able to get date out of value, quitting and letting
                            // calling method try another value
                            return;
                        }
                        if ($type.hasValue(dateValue)) {
                            current = this.dateFormatter.format(dateValue, format || part.params[0] || undefined);
                            formatApplied = true;
                        }
                        break;
                    case "formatDuration":
                        var durationValue = $utils.anyToNumber(current);
                        if ($type.hasValue(durationValue)) {
                            current = this.durationFormatter.format(durationValue, format || part.params[0] || undefined, part.params[1] || undefined);
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
            var formatParts = [{
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
                var formatterType = $utils.getFormat(format);
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
    };
    Object.defineProperty(Sprite.prototype, "dataItem", {
        /**
         * @return {this} [[DataItem]]
         */
        get: function () {
            if (!this._dataItem) {
                if (this.virtualParent) {
                    return this.virtualParent.dataItem;
                }
                if (this.parent) {
                    return this.parent.dataItem;
                }
            }
            return this._dataItem;
        },
        /**
         * A [[DataItem]] to use as element's data source.
         *
         * @todo Review type
         * @param {this["_dataItem"]}  dataItem  DataItem
         */
        set: function (dataItem) {
            //an not use this["_dataItem"] here, as we return parent data item if this sprite doesn't have one.
            // @todo:think about it
            this.setDataItem(dataItem);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets currently used [[DataItem]].
     *
     * If the element has also `configField` set, it will also look for any
     * config in DataItem's data context to apply to this element.
     *
     * @param {DataItem} dataItem DataItem
     */
    Sprite.prototype.setDataItem = function (dataItem) {
        if (this._dataItem != dataItem) {
            this._dataItem = dataItem;
            if (this.configField) {
                if (dataItem.dataContext) {
                    this.config = dataItem.dataContext[this.configField];
                }
            }
            var dataContext = dataItem.dataContext;
            if (dataContext) {
                for (var propertyName in this.propertyFields) {
                    var fieldValue = this.propertyFields[propertyName];
                    if ($type.hasValue(dataContext[fieldValue])) {
                        var anyThis = this;
                        anyThis[propertyName] = dataContext[fieldValue];
                    }
                }
            }
            this.invalidate();
        }
    };
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
    Sprite.prototype.getPropertyValue = function (propertyName) {
        var propValue = this.properties[propertyName];
        // Apply adapter
        // @todo get rid of <any>
        if (!this._isTemplate) {
            propValue = this.adapter.apply(propertyName, propValue);
        }
        return propValue;
    };
    Sprite.prototype.setColorProperty = function (property, value, invalidate) {
        var currentValue = this.properties[property];
        if (value instanceof Color && currentValue instanceof Color && value.hex == currentValue.hex) {
            return false;
        }
        else {
            return this.setPropertyValue(property, value, invalidate);
        }
    };
    Sprite.prototype.setPercentProperty = function (property, value, invalidate, transform, precision, floor) {
        value = $type.toNumberOrPercent(value);
        if ($type.isNumber(value)) {
            value = $math.round(value, precision, floor);
            return this.setPropertyValue(property, value, invalidate, transform);
        }
        else {
            var currentValue = this.properties[property];
            if (value instanceof Percent && currentValue instanceof Percent && value.value == currentValue.value) {
                return false;
            }
            else {
                return this.setPropertyValue(property, value, invalidate, transform);
            }
        }
    };
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
    Sprite.prototype.setPropertyValue = function (property, value, invalidate, transform) {
        var currentValue = this.properties[property];
        if (this.properties[property] !== value) {
            this.properties[property] = value;
            if (this.events.isEnabled("propertychanged")) {
                var event_1 = {
                    type: "propertychanged",
                    target: this,
                    property: property
                };
                this.events.dispatchImmediately("propertychanged", event_1);
            }
            if (invalidate) {
                this.invalidate();
            }
            if (transform) {
                this.invalidatePosition();
            }
            if (this.applyOnClones) {
                var clones = this.clones.values;
                var length_2 = clones.length;
                for (var i = 0; i < length_2; ++i) {
                    var clone = clones[i];
                    if (!clone.isDisposed()) {
                        //(<Sprite>clone).setPropertyValue(<any>property, value, invalidate, transform);
                        clone[property] = value;
                    }
                }
            }
            return true;
        }
        return false;
    };
    Sprite.prototype.bind = function (property, source, bindToProperty, modifier) {
        var _this = this;
        if (bindToProperty === void 0) { bindToProperty = property; }
        if ($type.hasValue(this._bindings[property])) {
            this._bindings[property].dispose();
        }
        // set current value
        this[property] = source[bindToProperty];
        //source.addEventListener(AMEvent.PROPERTY_CHANGED, this.handleBindings, false, this);
        this._bindings[property] = source.events.on("propertychanged", function (event) {
            if (event.property === bindToProperty) {
                var value = source[bindToProperty];
                if (modifier) {
                    value = modifier(value);
                }
                // TODO clonesById
                _this[property] = value;
            }
        });
    };
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
    Sprite.prototype.observe = function (property, listener, context) {
        var _this = this;
        return new MultiDisposer($array.map($array.toArray(property), function (prop) {
            return _this.events.on("propertychanged", function (e) {
                if (e.property === prop) {
                    listener.call(context, e);
                }
            });
        }));
    };
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
    Sprite.prototype.applyAccessibility = function () {
        // Check if we need to add label and description
        var title = this.readerTitle, description = this.readerDescription, role = this.role, hidden = this.readerHidden, checked = this.readerChecked, controls = this.readerControls, live = this.readerLive;
        // Init label/describe ids
        var labelledByIds = [], describedByIds = [];
        var labelledBy = this.readerLabelledBy;
        if (labelledBy) {
            labelledByIds.push(labelledBy);
        }
        var describedBy = this.readerDescribedBy;
        if (describedBy) {
            describedByIds.push(describedBy);
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
                var titleElement = this.titleElement;
                var titleId = this.uid + "-title";
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
            if (description) {
                var descriptionElement = this.descriptionElement;
                var descriptionId = this.uid + "-description";
                if (descriptionElement.node.textContent != description) {
                    descriptionElement.node.textContent = description;
                    descriptionElement.attr({ id: descriptionId });
                }
                labelledByIds.push(descriptionId);
            }
            else if (this._descriptionElement) {
                this.group.removeElement(this._descriptionElement);
                this._descriptionElement = undefined;
            }
        }
        // Add label and described properties
        if (labelledByIds.length) {
            this.setSVGAttribute({ "aria-labelledby": labelledByIds.join(" ") });
        }
        if (describedByIds.length) {
            this.setSVGAttribute({ "aria-describedby": describedByIds.join(" ") });
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
        }
        else {
            this.removeSVGAttribute("aria-controls");
        }
        // Apply aria-live
        if (live) {
            this.setSVGAttribute({ "aria-live": live });
        }
        else {
            this.removeSVGAttribute("aria-live");
        }
    };
    Object.defineProperty(Sprite.prototype, "readerTitle", {
        /**
         * @return {string} Title
         */
        get: function () {
            return this.getPropertyValue("readerTitle");
        },
        /**
         * Screen reader title of the element.
         *
         * @param {string} value Title
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("readerTitle", value)) {
                this.applyAccessibility();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "readerDescription", {
        /**
         * @return {string} Description
         */
        get: function () {
            return this.getPropertyValue("readerDescription");
        },
        /**
         * Screen reader description of the element.
         *
         * @param {string} value Description
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("readerDescription", value)) {
                this.applyAccessibility();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "role", {
        /**
         * @return {Roles} Role
         */
        get: function () {
            return this.getPropertyValue("role");
        },
        /**
         * A WAI-ARIA role for the element.
         *
         * @see {@link https://www.w3.org/TR/wai-aria-1.1/#role_definitions} for more information on WAI-ARIA roles
         * @param {Roles}  value  Role
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("role", value)) {
                this.applyAccessibility();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "readerHidden", {
        /**
         * @return {boolean} Hidden?
         */
        get: function () {
            return this.getPropertyValue("readerHidden");
        },
        /**
         * Controls if element should be hidden from screen readers.
         *
         * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-hidden} for more information
         * @param {boolean}  value  Hidden?
         */
        set: function (value) {
            value = $type.toBoolean(value);
            if (this.setPropertyValue("readerHidden", value)) {
                this.applyAccessibility();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "readerChecked", {
        /**
         * @ignore Exclude from docs
         * @return {boolean} Checked?
         */
        get: function () {
            return this.getPropertyValue("readerChecked");
        },
        /**
         * Controls if element is currently marked as "checked".
         *
         * @ignore Exclude from docs
         * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-checked} for more information
         * @param {boolean} value Checked?
         */
        set: function (value) {
            value = $type.toBoolean(value);
            if (this.setPropertyValue("readerChecked", value)) {
                this.applyAccessibility();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "readerControls", {
        /**
         * @ignore Exclude from docs
         * @return {string} Setting value
         */
        get: function () {
            return this.getPropertyValue("readerControls");
        },
        /**
         * A `uid` of an element this element controls.
         *
         * @ignore Exclude from docs
         * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-controls} for more information
         * @param {string} value Setting value
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("readerControls", value)) {
                this.applyAccessibility();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "readerLive", {
        /**
         * @ignore Exclude from docs
         * @return {AriaLive} Setting value
         */
        get: function () {
            return this.getPropertyValue("readerLive");
        },
        /**
         * Controls accessibility setting "aria-live" for the element.
         *
         * @ignore Exclude from docs
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions} for more information
         * @param {AriaLive} value Setting value
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("readerLive", value)) {
                this.applyAccessibility();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "readerLabelledBy", {
        /**
         * @ignore Exclude from docs
         * @return {Sprite} Target element
         */
        get: function () {
            return this.getPropertyValue("readerLabelledBy");
        },
        /**
         * A `uid` of an element that describes this element.
         *
         * @ignore Exclude from docs
         * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby} for more information
         * @param {Sprite} value Target element
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("readerLabelledBy", value)) {
                this.applyAccessibility();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "readerDescribedBy", {
        /**
         * @ignore Exclude from docs
         * @return {Sprite} Target element
         */
        get: function () {
            return this.getPropertyValue("readerDescribedBy");
        },
        /**
         * A `uid` of an element that describes this element.
         *
         * @ignore Exclude from docs
         * @see {@link https://www.w3.org/TR/wai-aria-1.1/#aria-describedby} for more information
         * @param {Sprite} value Target element
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("readerDescribedBy", value)) {
                this.applyAccessibility();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "keyboardOptions", {
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
        get: function () {
            if (!this.interactions.keyboardOptions) {
                if (this.virtualParent) {
                    return this.virtualParent.keyboardOptions;
                }
                if (this.parent) {
                    return this.parent.keyboardOptions;
                }
            }
            return this.interactions.keyboardOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "interactions", {
        /**
         * Returns (creates if necessary) an [[InteractionObject]] associated with
         * this element.
         *
         * [[InteractionObject]] is used to attach all kinds of user-interactions to
         * the element, e.g. click/touch, dragging, hovering, and similar events.
         *
         * @return {InteractionObject} Interaction object
         */
        get: function () {
            if (!this._interaction) {
                var interaction = getInteraction().getInteraction(this.dom);
                this._interaction = interaction;
                this._interaction.clickable = this.clickable;
                this._interaction.hoverable = this.hoverable;
                this._interaction.trackable = this.trackable;
                this._interaction.draggable = this.draggable;
                this._interaction.swipeable = this.swipeable;
                this._interaction.resizable = this.resizable;
                this._interaction.wheelable = this.wheelable;
                this._interaction.inert = this.inert;
                this._interaction.sprite = this;
                this._disposers.push(this._interaction);
            }
            return this._interaction;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns true if interactions object was created. Mostly used just to avoid creating interactions object if not needed.
     * @return {boolean} Is Sprite interactive?
     */
    Sprite.prototype.isInteractive = function () {
        if (this._interaction) {
            return true;
        }
        else {
            return false;
        }
    };
    Object.defineProperty(Sprite.prototype, "focusable", {
        /**
         * @return {Optional<boolean>} Can element be focused?
         */
        get: function () {
            return this.getPropertyValue("focusable");
        },
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
        set: function (value) {
            var _this = this;
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
                    this.interactions.setEventDisposer("sprite-focusable", value, function () { return new MultiDisposer([
                        _this.events.on("blur", _this.handleBlur, _this, false),
                        _this.events.on("focus", _this.handleFocus, _this, false)
                    ]); });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Applies filters (if set) when element gains focus.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["focus"]} ev Original event
     */
    Sprite.prototype.handleFocus = function (ev) {
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
    };
    /**
     * Removes focus filter (if set) when elementloses focus.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["blur"]} ev Original event
     */
    Sprite.prototype.handleBlur = function (ev) {
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
    };
    Object.defineProperty(Sprite.prototype, "focusFilter", {
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
        get: function () {
            /*if (!this._focusFilter) {
                this._focusFilter = new FocusFilter();
                this._disposers.push(this._focusFilter);
            }*/
            //return this._focusFilter;
            var focusFilter = this._focusFilter;
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
        },
        /**
         * @see {@link Filter}
         * @ignore Exclude from docs
         * @todo This is still experimental, don't use it
         */
        set: function (value) {
            this._focusFilter = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "hoverOnFocus", {
        /**
         * @return {boolean} Trigger hover on focus?
         */
        get: function () {
            return this.getPropertyValue("hoverOnFocus");
        },
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
        set: function (value) {
            if (value !== this.hoverOnFocus) {
                this.setPropertyValue("hoverOnFocus", value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "tabindex", {
        /**
         * Returns current TAB index for focusable item.
         *
         * @return {number} TAB index
         */
        get: function () {
            var index = this._tabindex;
            if (index != null) {
                return index;
            }
            else if (this.virtualParent) {
                return this.virtualParent.tabindex;
            }
            else if (this.parent) {
                return this.parent.tabindex;
            }
        },
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
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "inertiaOptions", {
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
        get: function () {
            if (!this.interactions.inertiaOptions) {
                if (this.parent) {
                    return this.parent.inertiaOptions;
                }
            }
            return this.interactions.inertiaOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "draggable", {
        /**
         * @return {boolean} `true` if element can be dragged
         */
        get: function () {
            return this.getPropertyValue("draggable");
        },
        /**
         * Controls if the element is draggable.
         *
         * @param {boolean}  value  `true` if element can be dragged
         */
        set: function (value) {
            var _this = this;
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
                    this.interactions.setEventDisposer("sprite-draggable", value, function () { return new MultiDisposer([
                        _this.events.on("down", _this.handleDown, _this, false),
                        _this.events.on("dragstart", _this.handleDragStart, _this, false),
                        _this.events.on("drag", _this.handleDragMove, _this, false),
                        _this.events.on("dragstop", _this.handleDragStop, _this, false)
                    ]); });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Executes when dragged element is being started to drag.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.handleDragStart = function () {
        this.interactions.originalPosition = {
            x: this.pixelX,
            y: this.pixelY
        };
        this._isDragged = true;
        this.hideTooltip(0);
    };
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
    Sprite.prototype.dragStart = function (pointer) {
        //this.dragStop(pointer);
        //this.draggable = true;
        this._isDragged = true;
        getInteraction().dragStart(this.interactions, pointer);
    };
    /**
     * Executes when dragged element is being dropped.
     *
     * @ignore Exclude from docs
     */
    Sprite.prototype.handleDragStop = function () {
        this._isDragged = false;
        this.showTooltip();
        this.interactions.originalPosition = undefined;
    };
    /**
     * Stops manually initiated dragging of the element.
     *
     * @ignore Exclude from docs
     * @param {IPointer} pointer Pointer to use as a reference
     */
    Sprite.prototype.dragStop = function (pointer) {
        //this.draggable = false;
        this._isDragged = false;
        getInteraction().dragStop(this.interactions, pointer);
        //this.handleDragStop();
    };
    /**
     * Executes when {Sprite} is being dragged.
     *
     * @ignore Exclude from docs
     * @param {InteractionEvent} ev Event object
     * @todo Implement parent position offset calculation
     */
    Sprite.prototype.handleDragMove = function (ev) {
        var point = this.interactions.originalPosition;
        if (point) {
            var globalScale = this.parent.globalScale;
            this.moveTo({ x: point.x + ev.shift.x / globalScale, y: point.y + ev.shift.y / globalScale }, undefined, undefined, true);
            //this.dispatchImmediately("drag", ev);
        }
    };
    Object.defineProperty(Sprite.prototype, "inert", {
        /**
         * @return {boolean} `true` if element should use inertia when animated
         */
        get: function () {
            return this.getPropertyValue("inert");
        },
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
        set: function (value) {
            value = $type.toBoolean(value);
            if (this.setPropertyValue("inert", value)) {
                if (!value && !this.isInteractive()) {
                    // void
                }
                else {
                    this.interactions.inert = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "hoverOptions", {
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
        get: function () {
            if (!this.interactions.hoverOptions) {
                if (this.virtualParent) {
                    return this.virtualParent.hoverOptions;
                }
                if (this.parent) {
                    return this.parent.hoverOptions;
                }
            }
            return this.interactions.hoverOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "hoverable", {
        /**
         * @return {boolean} `true` if element is hoverable
         */
        get: function () {
            return this.getPropertyValue("hoverable");
        },
        /**
         * Controls if the element is hoverable (hover events are registered).
         *
         * Use `over` and `out` events, to watch for those respective actions.
         *
         * @default false
         * @param {boolean} value `true` if element can be hovered
         */
        set: function (value) {
            var _this = this;
            value = $type.toBoolean(value);
            if (this.setPropertyValue("hoverable", value)) {
                if (!value && !this.isInteractive()) {
                    // void
                }
                else {
                    this.applyCursorStyle();
                    this.interactions.hoverable = value;
                    // setEventDisposer will also remove listeners if value == false
                    this.interactions.setEventDisposer("sprite-hoverable", value, function () { return new MultiDisposer([
                        _this.events.on("over", _this.handleOver, _this, false),
                        _this.events.on("out", _this.handleOut, _this, false),
                    ]); });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handles tasks when element becomes hovered:
     * * Shows [[Tooltip]] if applicable
     * * Applies "hover" state
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["over"]} ev Event object
     */
    Sprite.prototype.handleOver = function (ev) {
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
            var point = void 0;
            if (ev && ev.pointer) {
                point = $utils.documentPointToSvg(ev.pointer.point, this.svgContainer.SVGContainer);
            }
            this.showTooltip(point);
        }
        else {
            this.hideTooltip();
            if (!this.isHidden && this.states.hasKey("hover")) {
                this.applyCurrentState();
            }
        }
    };
    /**
     * Handles tasks when element loses hover:
     *
     * * Hides [[Tooltip]]
     * * Applies default state
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["out"]} ev [description]
     */
    Sprite.prototype.handleOut = function (ev) {
        this.hideTooltip();
        this._outTimeout = this.setTimeout(this.handleOutReal.bind(this), this.rollOutDelay);
    };
    /**
     * [handleOutReal description]
     *
     * @ignore
     * @todo description
     */
    Sprite.prototype.handleOutReal = function () {
        if (!this.isHidden && !this.isHiding && this.states.hasKey("hover")) {
            this.applyCurrentState();
        }
    };
    Object.defineProperty(Sprite.prototype, "hitOptions", {
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
        get: function () {
            if (!this.interactions.hitOptions) {
                if (this.virtualParent) {
                    return this.virtualParent.hitOptions;
                }
                if (this.parent) {
                    return this.parent.hitOptions;
                }
            }
            return this.interactions.hitOptions;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Prepares element's after `down` event.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["down"]} ev Event
     */
    Sprite.prototype.handleDown = function (ev) {
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
    };
    /**
     * Prepares element's after `up` event.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["up"]} ev Event
     */
    Sprite.prototype.handleUp = function (ev) {
        /*if (!this.isDown) {
            this.interactions.originalPosition = null;
            this.interactions.originalAngle = null;
            this.interactions.originalScale = null;
        }*/
        if (this.states.hasKey("down")) {
            this.applyCurrentState();
        }
    };
    Object.defineProperty(Sprite.prototype, "clickable", {
        /**
         * @return {boolean}
         */
        get: function () {
            return this.getPropertyValue("clickable");
        },
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
         * @param {boolean} value `true` if element can be clicked
         */
        set: function (value) {
            var _this = this;
            value = $type.toBoolean(value);
            if (this.setPropertyValue("clickable", value)) {
                if (!value && !this.isInteractive()) {
                    // void
                }
                else {
                    this.applyCursorStyle();
                    this.interactions.clickable = value;
                    // setEventDisposer will also remove listeners if value == false
                    this.interactions.setEventDisposer("sprite-clickable", value, function () { return new MultiDisposer([
                        _this.events.on("down", _this.handleDown, _this, false),
                        _this.events.on("up", _this.handleUp, _this, false)
                    ]); });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "togglable", {
        /**
         * @return {boolean} Is togglable?
         */
        get: function () {
            return this.getPropertyValue("togglable");
        },
        /**
         * Indicates if element can be toggled on and off by subsequent clicks/taps.
         *
         * Togglable element will alternate its `isActive` property between `true`
         * and `false` with each click.
         *
         * @param {boolean} value Is togglable?
         */
        set: function (value) {
            var _this = this;
            value = $type.toBoolean(value);
            if (this.setPropertyValue("togglable", value)) {
                if (!value && !this.isInteractive()) {
                    // void
                }
                else {
                    // setEventDisposer will also remove listeners if value == false
                    this.interactions.setEventDisposer("sprite-togglable", value, function () { return _this.events.on("hit", _this.handleToggle, _this, false); });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handles toggling of the element.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["hit"]} ev Event
     */
    Sprite.prototype.handleToggle = function (ev) {
        this.isActive = !this.isActive;
    };
    Object.defineProperty(Sprite.prototype, "url", {
        /**
         * @return {Optional<string>} URL
         */
        get: function () {
            return this.getPropertyValue("url");
        },
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
         * @param {Optional<string>} value URL
         */
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "baseId", {
        get: function () {
            if (!this._baseId && this.parent) {
                this.baseId = this.parent.baseId;
            }
            return this._baseId;
        },
        set: function (value) {
            this.setBaseId(value);
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype.setBaseId = function (value) {
        if (value != this._baseId) {
            if (this.invalid) {
                this.invalid = false;
                registry.removeFromInvalidSprites(this);
                this.invalidate();
            }
            this._baseId = value;
        }
    };
    Object.defineProperty(Sprite.prototype, "urlTarget", {
        /**
         * @return {string} URL target
         */
        get: function () {
            return this.getPropertyValue("urlTarget");
        },
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
        set: function (value) {
            this.setPropertyValue("urlTarget", value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handles URL transition on element click.
     *
     * @ignore Exclude from docs
     * @param {InteractionEvent} ev An event object
     */
    Sprite.prototype.urlHandler = function (ev) {
        // Is URL set?
        if ($utils.isNotEmpty(this.url)) {
            // Proceed to the URL
            var url = this.populateString(this.url);
            if (this.urlTarget === "_self") {
                window.location.href = url;
            }
            else {
                window.open(url, this.urlTarget);
            }
        }
    };
    Object.defineProperty(Sprite.prototype, "swipeOptions", {
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
        get: function () {
            if (!this.interactions.swipeOptions) {
                if (this.virtualParent) {
                    return this.virtualParent.swipeOptions;
                }
                if (this.parent) {
                    return this.parent.swipeOptions;
                }
            }
            return this.interactions.swipeOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "swipeable", {
        /**
         * @return {boolean} Element swipable?
         */
        get: function () {
            return this.getPropertyValue("swipeable");
        },
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
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "trackable", {
        /**
         * @return {boolean} Track cursor movement over element?
         */
        get: function () {
            return this.getPropertyValue("trackable");
        },
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
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "wheelable", {
        /**
         * @return {boolean} Mouse wheel events enabled?
         */
        get: function () {
            return this.getPropertyValue("wheelable");
        },
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
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "resizable", {
        /**
         * @return {boolean} Element resizable?
         */
        get: function () {
            return this.getPropertyValue("resizable");
        },
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
        set: function (value) {
            var _this = this;
            value = $type.toBoolean(value);
            if (this.setPropertyValue("resizable", value)) {
                if (!value && !this.isInteractive()) {
                    // void
                }
                else {
                    this.applyCursorStyle();
                    this.interactions.resizable = value;
                    // setEventDisposer will also remove listeners if value == false
                    this.interactions.setEventDisposer("sprite-resizable", value, function () { return new MultiDisposer([
                        _this.events.on("down", _this.handleDown, _this, false),
                        _this.events.on("resize", _this.handleResize, _this, false)
                    ]); });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handles resize intermediate step.
     *
     * By default this method resizes actual element. Each element, can override
     * this method to implement their own resize logic.
     *
     * @ignore Exclude from docs
     * @param {InteractionEvent} ev Event object
     */
    Sprite.prototype.handleResize = function (ev) {
        this.scale = this.interactions.originalScale * ev.scale;
        this.validatePosition();
        /*center: (io.draggable
        ? $math.getMidPoint(point1, point2)
        : {
            "x": io.originalPosition.x,
            "y": io.originalPosition.y
        })*/
        //this.moveTo(this.originalPosition.x + ev.shift.x, this.originalPosition.y + ev.shift.y);
        if (this.draggable) {
            var svgPoint1 = $utils.documentPointToSvg(ev.point1, this.htmlContainer);
            var svgPoint2 = $utils.documentPointToSvg(ev.point2, this.htmlContainer);
            var svgMidPoint = $math.getMidPoint(svgPoint1, svgPoint2);
            var parentPoint1 = $utils.documentPointToSprite(ev.startPoint1, this.parent);
            var parentPoint2 = $utils.documentPointToSprite(ev.startPoint2, this.parent);
            var originalPosition = this.interactions.originalPosition;
            var originalScale = this.interactions.originalScale;
            if (originalPosition) {
                var spritePoint1 = { x: (parentPoint1.x - originalPosition.x) / originalScale, y: (parentPoint1.y - originalPosition.y) / originalScale };
                var spritePoint2 = { x: (parentPoint2.x - originalPosition.x) / originalScale, y: (parentPoint2.y - originalPosition.y) / originalScale };
                var spriteMidPoint = $math.getMidPoint(spritePoint1, spritePoint2);
                var parentPoint = $utils.svgPointToSprite(svgMidPoint, this.parent);
                this.moveTo({ x: parentPoint.x - spriteMidPoint.x * this.scale, y: parentPoint.y - spriteMidPoint.y * this.scale });
            }
        }
    };
    Object.defineProperty(Sprite.prototype, "cursorOptions", {
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
        get: function () {
            if (!this.interactions.cursorOptions) {
                if (this.virtualParent) {
                    return this.virtualParent.cursorOptions;
                }
                if (this.parent) {
                    return this.parent.cursorOptions;
                }
            }
            return this.interactions.cursorOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "cursorOverStyle", {
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
         * @param {Array<IStyleProperty>} style An array of styles to apply onhover
         */
        set: function (style) {
            this.cursorOptions.overStyle = style;
            getInteraction().applyCursorOverStyle(this.interactions);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "cursorDownStyle", {
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
         * @param {Array<IStyleProperty>} style An array of styles to apply onhover
         */
        set: function (style) {
            this.cursorOptions.downStyle = style;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Applies default cursor styles for interactable elements.
     *
     * @ignore Exclude from docs
     * @todo Determine if this is necessary. Maybe let's not apply any cursor styles by default
     */
    Sprite.prototype.applyCursorStyle = function () {
        // Draggable styles
        /*if (this.draggable) {

            if (!$type.hasValue(this.cursorOptions.overStyle)) {
                this.cursorOptions.overStyle = MouseCursorStyle.grab;
            }

            if (!$type.hasValue(this.cursorOptions.downStyle)) {
                this.cursorOptions.downStyle = MouseCursorStyle.grabbing;
            }
        }*/
    };
    Object.defineProperty(Sprite.prototype, "interactionsEnabled", {
        /**
         * @return {boolean} Is interaction enabled for this element?
         */
        get: function () {
            var value = this.getPropertyValue("interactionsEnabled");
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
        },
        /**
         * Setting this to `false` will effectively disable all interactivity on the
         * element.
         *
         * @param {boolean}  value  Is interaction enabled for this element?
         */
        set: function (value) {
            value = $type.toBoolean(value);
            if (this.setPropertyValue("interactionsEnabled", value)) {
                var pointerEvents = null; // must be null, not "null"!
                if (!value) {
                    pointerEvents = "none";
                }
                else {
                    // this is for IE
                    this.group.node.style.pointerEvents = "";
                }
                this.group.node.style.pointerEvents = pointerEvents;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "exporting", {
        /**
         * @return {Export} Export instance
         */
        get: function () {
            return this.getExporting();
        },
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
        set: function (exp) {
            this._exporting.set(exp, exp);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This is here as a method so that inheriting classes could override it.
     *
     * @return {Export} Export instance
     */
    Sprite.prototype.getExporting = function () {
        var _export = this._exporting.get();
        if (_export) {
            return _export;
        }
        else {
            if (this.isStandaloneInstance || !this.parent) {
                _export = new Export(this.svgContainer.SVGContainer);
                _export.sprite = this;
                _export.language = this.language;
                _export.dateFormatter = this.dateFormatter;
                this._exporting.set(_export, _export);
            }
            else {
                return this.parent.exporting;
            }
        }
        return _export;
    };
    Object.defineProperty(Sprite.prototype, "exportable", {
        /**
         * @return {boolean} Export?
         */
        get: function () {
            var svgContainer = this.svgContainer;
            return !svgContainer || $array.indexOf(svgContainer.nonExportableSprites, this) == -1;
        },
        /**
         * If set to `false` this element will be omitted when exporting the chart
         * to an image.
         *
         * @default true
         * @param {boolean}  value  Export?
         */
        set: function (value) {
            var svgContainer = this.svgContainer;
            if (svgContainer && value != this.exportable) {
                if (value) {
                    $array.remove(svgContainer.nonExportableSprites, this);
                }
                else {
                    svgContainer.nonExportableSprites.push(this);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ==========================================================================
     * MODAL/POPUP RELATED STUFF
     * ==========================================================================
     * @hidden
     */
    /**
     * Private method to be used for "classPrefix" adapter for modals/popups.
     *
     * @param {string}  value  Prefix
     */
    Sprite.prototype.modalPrefix = function (value) {
        value = options.classNamePrefix + value;
        return value;
    };
    Object.defineProperty(Sprite.prototype, "modal", {
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
        get: function () {
            var svgContainer = this.svgContainer;
            if (svgContainer) {
                var modal = svgContainer.modal;
                if (!modal.adapter.has("classPrefix", this.modalPrefix)) {
                    modal.adapter.add("classPrefix", this.modalPrefix);
                }
                return modal;
            }
        },
        enumerable: true,
        configurable: true
    });
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
    Sprite.prototype.openModal = function (text, title) {
        var svgContainer = this.svgContainer;
        if (svgContainer) {
            return svgContainer.openModal(text, title);
        }
    };
    /**
     * Hides modal window if there is one currently open.
     */
    Sprite.prototype.closeModal = function () {
        var svgContainer = this.svgContainer;
        if (svgContainer) {
            svgContainer.closeModal();
        }
    };
    Object.defineProperty(Sprite.prototype, "popups", {
        /**
         * A list of popups for this chart.
         *
         * @return {ListTemplate<Popup>} Popups
         */
        get: function () {
            var svgContainer = this.svgContainer;
            if (svgContainer) {
                var popups = svgContainer.popups;
                popups.template.sprite = this;
                if (!popups.template.adapter.has("classPrefix", this.modalPrefix)) {
                    popups.template.adapter.add("classPrefix", this.modalPrefix);
                }
                return popups;
            }
        },
        enumerable: true,
        configurable: true
    });
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
    Sprite.prototype.openPopup = function (text, title) {
        var svgContainer = this.svgContainer;
        if (svgContainer) {
            return svgContainer.openPopup(text, title);
        }
    };
    /**
     * Closes all currently open popup windows
     */
    Sprite.prototype.closeAllPopups = function () {
        var svgContainer = this.svgContainer;
        if (svgContainer) {
            return svgContainer.closeAllPopups();
        }
    };
    Object.defineProperty(Sprite.prototype, "x", {
        /**
         * @return {number | Percent} X coordinate
         */
        get: function () {
            return this.getPropertyValue("x");
        },
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
        set: function (value) {
            if (!this.isDragged) {
                this.setPercentProperty("x", value, false, true, this._positionPrecision, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelX", {
        /**
         * Returns element's current absolute X coordinate in pixels.
         *
         * @readonly
         * @return {number} X coordinate (px)
         */
        get: function () {
            return this.adapter.apply("pixelX", $math.fitToRange(this.getPixelX(this.x), this.minX, this.maxX));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativeX", {
        /**
         * Returns element's current relative X coordinate in [[Percent]].
         *
         * @return {number} X coordinate ([[Percent]])
         */
        get: function () {
            return this.adapter.apply("relativeX", this.getRelativeX(this.x));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "minX", {
        /**
         * @ignore Exclude from docs
         * @return {number} Min X (px)
         */
        get: function () {
            return this.getPropertyValue("minX");
        },
        /**
         * The smallest allowable absolute X coordinate for this element.
         *
         * This is used to contain element movement within certain boundaries.
         *
         * @ignore Exclude from docs
         * @param {number} value Min X (px)
         */
        set: function (value) {
            if ($type.isNumber(value)) {
                value = $math.round(value, this._positionPrecision, true);
                this.setPropertyValue("minX", value, false, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "maxX", {
        /**
         * @ignore Exclude from docs
         * @return {number} Max X (px)
         */
        get: function () {
            return this.getPropertyValue("maxX");
        },
        /**
         * The biggest allowable absolute X coordinate for this element.
         *
         * This is used to contain element movement within certain boundaries.
         *
         * @ignore Exclude from docs
         * @param {number} value Max X (px)
         */
        set: function (value) {
            if ($type.isNumber(value)) {
                value = $math.round(value, this._positionPrecision, true);
                this.setPropertyValue("maxX", value, false, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "y", {
        /**
         * @return {number | Percent} Y coordinate
         */
        get: function () {
            return this.getPropertyValue("y");
        },
        /**
         * Element's absolute or relative Y coordinate.
         *
         * If setting both X and Y, please consider using `moveTo()` method instead,
         * as it will be faster to set both coordinates at once.
         *
         * @param {number | Percent}  value  Y coordinate
         */
        set: function (value) {
            if (!this.isDragged) {
                this.setPercentProperty("y", value, false, true, this._positionPrecision, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelY", {
        /**
         * Returns element's current absolute Y coordinate in pixels.
         *
         * @readonly
         * @return {number} Y coordinate (px)
         */
        get: function () {
            return this.adapter.apply("pixelY", $math.fitToRange(this.getPixelY(this.y), this.minY, this.maxY));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativeY", {
        /**
         * Returns element's current relative Y coordinate in [[Percent]].
         *
         * @readonly
         * @return {number} Y coordinate ([[Percent]])
         */
        get: function () {
            return this.adapter.apply("relativeY", this.getRelativeX(this.y));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "minY", {
        /**
         * @ignore Exclude from docs
         * @return {number} Min Y (px)
         */
        get: function () {
            return this.getPropertyValue("minY");
        },
        /**
         * The smallest allowable absolute Y coordinate for this element.
         *
         * This is used to contain element movement within certain boundaries.
         *
         * @ignore Exclude from docs
         * @param {number} value Min Y (px)
         */
        set: function (value) {
            if ($type.isNumber(value)) {
                value = $math.round(value, this._positionPrecision, true);
                this.setPropertyValue("minY", value, false, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "maxY", {
        /**
         * @ignore Exclude from docs
         * @return {number} Max Y (px)
         */
        get: function () {
            return this.getPropertyValue("maxY");
        },
        /**
         * The biggest allowable absolute Y coordinate for this element.
         *
         * This is used to contain element movement within certain boundaries.
         *
         * @ignore Exclude from docs
         * @param {number}  value  Max Y (px)
         */
        set: function (value) {
            if ($type.isNumber(value)) {
                value = $math.round(value, this._positionPrecision, true);
                this.setPropertyValue("maxY", value, false, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "dx", {
        /**
         * @return {number} Horizontal offset (px)
         */
        get: function () {
            return this.getPropertyValue("dx");
        },
        /**
         * A horizontal offset for the element in pixels.
         *
         * Can be negative value for offset to the left.
         *
         * @param {number}  value  Horizontal offset (px)
         */
        set: function (value) {
            if ($type.isNumber(value)) {
                value = $math.round(value, this._positionPrecision, true);
                this.setPropertyValue("dx", value, false, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "dy", {
        /**
         * @return {number} Vertical offset (px)
         */
        get: function () {
            return this.getPropertyValue("dy");
        },
        /**
         * A vertical offset for the element in pixels.
         *
         * Can be negative value for offset upwards.
         *
         * @param {number}  value  Vertical offset (px)
         */
        set: function (value) {
            if ($type.isNumber(value)) {
                value = $math.round(value, this._positionPrecision, true);
                this.setPropertyValue("dy", value, false, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "rotation", {
        /**
         * @return {number} Rotation (0-360)
         */
        get: function () {
            return this.getPropertyValue("rotation");
        },
        /**
         * Rotation of the element in degrees. (0-360)
         *
         * @param {number}  value  Rotation (0-360)
         */
        set: function (value) {
            value = $type.toNumber(value);
            if (!$type.isNumber(value)) {
                value = 0;
            }
            this.setPropertyValue("rotation", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "align", {
        /**
         * @return {Align} Horizontal align
         */
        get: function () {
            return this.getPropertyValue("align");
        },
        /**
         * Controls horizontal alignment of the element.
         *
         * This is used by parent [[Container]] when layouting its children.
         *
         * @param {Align}  value  Horizontal align
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("align", value)) {
                if (this.parent) {
                    this.parent.invalidateLayout();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "valign", {
        /**
         * @return {VerticalAlign} Vertical align
         */
        get: function () {
            return this.getPropertyValue("valign");
        },
        /**
         * Controls vertical alignment of the element.
         *
         * This is used by parent [[Container]] when layouting its children.
         *
         * @param {VerticalAlign}  value  Vertical align
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("valign", value)) {
                if (this.parent) {
                    this.parent.invalidateLayout();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "horizontalCenter", {
        /**
         * @return {HorizontalCenter} Horizontal center
         */
        get: function () {
            return this.getPropertyValue("horizontalCenter");
        },
        /**
         * Controls which part of the element to treat as a horizontal center.
         *
         * The setting will be used when positioning, resizing and rotating the
         * element.
         *
         * @param {HorizontalCenter}  value  Horizontal center
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("horizontalCenter", value)) {
                this.updateCenter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "verticalCenter", {
        /**
         * @return {VerticalCenter} Vertical center
         */
        get: function () {
            return this.getPropertyValue("verticalCenter");
        },
        /**
         * Controls which part of the element to treat as a vertical center.
         *
         * The setting will be used when positioning, resizing and rotating the
         * element.
         *
         * @param {VerticalCenter}  value  Vertical center
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("verticalCenter", value)) {
                this.updateCenter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "maxWidth", {
        /**
         * @return {number} Maximum width (px)
         */
        get: function () {
            var maxWidth = this.getPropertyValue("maxWidth");
            if (!$type.isNumber(maxWidth)) {
                if (this.parent) {
                    return this.parent.maxWidth;
                }
            }
            return maxWidth;
        },
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
        set: function (value) {
            this.setMaxWidth(value);
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype.setMaxWidth = function (value) {
        var prevWidth = this.maxWidth;
        var prevHeight = this.maxHeight;
        if (this.setPropertyValue("maxWidth", value)) {
            if ($type.isNumber(this.relativeWidth)) {
                this.invalidate();
            }
            var event_2 = {
                type: "maxsizechanged",
                target: this,
                previousWidth: prevWidth,
                previousHeight: prevHeight
            };
            this.dispatchImmediately("maxsizechanged", event_2);
        }
    };
    Object.defineProperty(Sprite.prototype, "maxHeight", {
        /**
         * @return {number} Maximum height (px)
         */
        get: function () {
            var maxHeight = this.getPropertyValue("maxHeight");
            if (!$type.isNumber(maxHeight)) {
                if (this.parent) {
                    return this.parent.maxHeight;
                }
            }
            return maxHeight;
        },
        /**
         * Maximum allowed height for the element in pixels.
         *max
         * @param {number}  value  Maximum height (px)
         */
        set: function (value) {
            this.setMaxHeight(value);
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype.setMaxHeight = function (value) {
        var prevWidth = this.maxWidth;
        var prevHeight = this.maxHeight;
        if (this.setPropertyValue("maxHeight", value)) {
            if ($type.isNumber(this.relativeHeight)) {
                this.invalidate();
            }
            var event_3 = {
                type: "maxsizechanged",
                target: this,
                previousWidth: prevWidth,
                previousHeight: prevWidth
            };
            this.dispatchImmediately("maxsizechanged", event_3);
        }
    };
    Object.defineProperty(Sprite.prototype, "minWidth", {
        /**
         * @return {Optional<number>} Minimum width (px)
         */
        get: function () {
            return this.getPropertyValue("minWidth");
        },
        /**
         * Minimum width of the element in pixels.
         *
         * Set to `undefined` to remove the limit.
         *
         * @param {Optional<number>}  value  Minimum width (px)
         */
        set: function (value) {
            this.setPropertyValue("minWidth", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "minHeight", {
        /**
         * @return {Optional<number>} Minimum height (px)
         */
        get: function () {
            return this.getPropertyValue("minHeight");
        },
        /**
         * Minimum height for the element in pixels.
         *
         * Set to `undefined` to remove the limit.
         *
         * @param {Optional<number>}  value  Minimum height (px)
         */
        set: function (value) {
            this.setPropertyValue("minHeight", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "width", {
        /**
         * @return {number | Percent} Width (absolute or relative)
         */
        get: function () {
            return this.getPropertyValue("width");
        },
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
        set: function (value) {
            var changed = this.setPercentProperty("width", value, true, false, this._positionPrecision, true);
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "height", {
        /**
         * @return {number | Percent} height (absolute or relative)
         */
        get: function () {
            return this.getPropertyValue("height");
        },
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
        set: function (value) {
            var changed = this.setPercentProperty("height", value, true, false, this._positionPrecision, true);
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelWidth", {
        /**
         * Returns element's width in pixels, if width was set. For actual width use measuredWidth property.
         *
         * @readonly
         * @return {number} Width (px)
         */
        get: function () {
            var width;
            if ($type.isNumber(this.percentWidth)) {
                width = this.maxWidth;
            }
            else if ($type.isNumber(this._pixelWidth)) {
                width = this._pixelWidth;
            }
            else {
                width = 0;
            }
            var minWidth = this.minWidth;
            if (minWidth != null && width < minWidth) {
                width = minWidth;
            }
            return this.adapter.apply("pixelWidth", $math.round(width, this._positionPrecision, true));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelHeight", {
        /**
         * Returns element's height in pixels. For actual height use measuredHeight property.
         *
         * @readonly
         * @return {number} Height (px)
         */
        get: function () {
            var height;
            if ($type.isNumber(this.percentHeight)) {
                height = this.maxHeight;
            }
            else if ($type.isNumber(this._pixelHeight)) {
                height = this._pixelHeight;
            }
            else {
                height = 0; //this._measuredHeightSelf;
            }
            var minHeight = this.minHeight;
            if (minHeight != null && height < minHeight) {
                height = minHeight;
            }
            return this.adapter.apply("pixelHeight", $math.round(height, this._positionPrecision, true));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativeWidth", {
        /**
         * @return {$type.Optional<number>} Relative width
         * @ignore
         */
        get: function () {
            var relativeWidth = this._relativeWidth;
            if ($type.isNumber(relativeWidth)) {
                return this.adapter.apply("relativeWidth", relativeWidth);
            }
        },
        /**
         * Element's relative width in [[Percent]].
         * @ignore
         *
         * @param {$type.Optional<number>}  value  Relative width
         */
        set: function (value) {
            if (this._relativeWidth != value) {
                this._relativeWidth = value;
                //			this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativeHeight", {
        /**
         * @return {$type.Optional<number>} Relative height
         * @ignore
         */
        get: function () {
            var relativeHeight = this._relativeHeight;
            if ($type.isNumber(relativeHeight)) {
                return this.adapter.apply("relativeHeight", relativeHeight);
            }
        },
        /**
         * Element's relative height in [[Percent]].
         *
         * @param {$type.Optional<number>}  value  Relative height
         * @ignore
         */
        set: function (value) {
            if (this._relativeHeight != value) {
                this._relativeHeight = value;
                //			this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "measuredWidth", {
        /**
         * Returns element's measured width in pixels.
         *
         * A measured width is actual width of contents plus `paddingRight` and* `paddingLeft`, relative to sprite parent, meaning that
         * rotation and scale is taken into account.
         *
         * @readonly
         * @return {number} Width (px)
         */
        get: function () {
            if (this.disabled || this.__disabled) {
                return 0;
            }
            return this.adapter.apply("measuredWidth", this._measuredWidth);
            // it's not good to fit to min/max range as then rotations and scale won't be taken into account
            //return this.adapter.apply("measuredWidth", $math.fitToRange(this._measuredWidth, this.minWidth, this.maxWidth));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "measuredHeight", {
        /**
         * Returns elements's measured height in pixels.
         *
         * A measured height is actual height of contents plus `paddingTop` and `paddingBottom`, relative to sprite parent, meaning that
         * rotation and scale taken into account.
         *
         * @readonly
         * @return {number} Height (px)
         */
        get: function () {
            if (this.disabled || this.__disabled) {
                return 0;
            }
            // it's not good to fit to min/max range as then rotations and scale won't be taken into account
            //return this.adapter.apply("measuredHeight", $math.fitToRange(this._measuredHeight, this.minHeight, this.maxHeight));
            return this.adapter.apply("measuredHeight", this._measuredHeight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "outerWidth", {
        /**
         * Returns element's measured width plus its left and right margins in
         * pixels.
         *
         * @readonly
         * @return {number} Outer width (px)
         */
        get: function () {
            return this.adapter.apply("outerWidth", this.pixelWidth + this.pixelMarginRight + this.pixelMarginLeft);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "outerHeight", {
        /**
         * Returns element's measured height plus its top and bottom margins in
         * pixels.
         *
         * @readonly
         * @return {number} Outer height (px)
         */
        get: function () {
            return this.adapter.apply("outerHeight", this.pixelHeight + this.pixelMarginTop + this.pixelMarginBottom);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "innerWidth", {
        /**
         * Returns element's measured inner width in pixels.
         *
         * Inner width is actual available space for content, e.g. element's width
         * minus horizontal padding.
         *
         * @readonly
         * @return {number} Inner width (px)
         */
        get: function () {
            return this.adapter.apply("innerWidth", Math.max(0, this.pixelWidth - this.pixelPaddingRight - this.pixelPaddingLeft));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "innerHeight", {
        /**
         * Returns element's measured inner height in pixels.
         *
         * Inner height is actual available space for content, e.g. element's height
         * minus vertical padding.
         *
         * @readonly
         * @return {number} Inner height (px)
         */
        get: function () {
            return this.adapter.apply("innerHeight", Math.max(0, this.pixelHeight - this.pixelPaddingTop - this.pixelPaddingBottom));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "globalScale", {
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
        get: function () {
            var scale = this.scale;
            if (this.parent) {
                scale = scale * this.parent.globalScale;
            }
            return this.adapter.apply("globalScale", scale);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "scale", {
        /**
         * @return {number} Scale (0-1)
         */
        get: function () {
            return this.getPropertyValue("scale");
        },
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
        set: function (value) {
            value = $type.toNumber(value);
            if (value < 0) {
                value = 0;
            }
            if (value != this.getPropertyValue("scale")) {
                this.setPropertyValue("scale", value, false, true);
                this.handleGlobalScale();
            }
        },
        enumerable: true,
        configurable: true
    });
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
    Sprite.prototype.margin = function (top, right, bottom, left) {
        this.marginTop = top;
        this.marginRight = right;
        this.marginBottom = bottom;
        this.marginLeft = left;
        return this;
    };
    Object.defineProperty(Sprite.prototype, "marginLeft", {
        /**
         * @return {number | Percent} Margin value
         */
        get: function () {
            return this.getPropertyValue("marginLeft");
        },
        /**
         * Left margin - absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Margin value
         */
        set: function (value) {
            this.setPercentProperty("marginLeft", value, true, true, this._positionPrecision, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "marginRight", {
        /**
         * @return {number | Percent} Margin value
         */
        get: function () {
            return this.getPropertyValue("marginRight");
        },
        /**
         * Right margin - absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Margin value
         */
        set: function (value) {
            this.setPercentProperty("marginRight", value, true, true, this._positionPrecision, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "marginTop", {
        /**
         * @return {number | Percent} Margin value
         */
        get: function () {
            return this.getPropertyValue("marginTop");
        },
        /**
         * Top margin - absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Margin value
         */
        set: function (value) {
            this.setPercentProperty("marginTop", value, true, true, this._positionPrecision, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "marginBottom", {
        /**
         * @return {number | Percent} Margin value
         */
        get: function () {
            return this.getPropertyValue("marginBottom");
        },
        /**
         * Bottom margin - absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Margin value
         */
        set: function (value) {
            this.setPercentProperty("marginBottom", value, true, true, this._positionPrecision, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelMarginRight", {
        /**
         * Returns current right margin in pixels.
         *
         * @readonly
         * @return {number} Right margin (px)
         */
        get: function () {
            return this.adapter.apply("pixelMarginRight", this.getPixelX(this.marginRight));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativeMarginRight", {
        /**
         * Returns current relative right margin.
         *
         * @readonly
         * @return {number} Relative right margin
         */
        get: function () {
            // @todo Maybe use [[Percent]]?
            return this.adapter.apply("relativeMarginRight", this.getRelativeX(this.marginRight));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelMarginLeft", {
        /**
         * Returns current left margin in pixels.
         *
         * @readonly
         * @return {number} Left margin (px)
         */
        get: function () {
            return this.adapter.apply("pixelMarginLeft", this.getPixelX(this.marginLeft));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativeMarginLeft", {
        /**
         * Returns current relative left margin.
         *
         * @readonly
         * @return {number} Relative left margin
         */
        get: function () {
            //@todo Maybe use [[Percent]]?
            return this.adapter.apply("relativeMarginLeft", this.getRelativeX(this.marginLeft));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelMarginTop", {
        /**
         * Returns current top margin in pixels.
         *
         * @readonly
         * @return {number} Top margin (px)
         */
        get: function () {
            return this.adapter.apply("pixelMarginTop", this.getPixelY(this.marginTop));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativeMarginTop", {
        /**
         * Returns current relative top margin.
         *
         * @readonly
         * @return {number} Relative top margin
         */
        get: function () {
            // @todo Maybe use [[Percent]]?
            return this.adapter.apply("relativeMarginTop", this.getRelativeY(this.marginTop));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelMarginBottom", {
        /**
         * Returns current bottom margin in pixels.
         *
         * @readonly
         * @return {number} Bottom margin (px)
         */
        get: function () {
            return this.adapter.apply("pixelMarginBottom", this.getPixelY(this.marginBottom));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativeMarginBottom", {
        /**
         * Returns current relative bottom margin.
         *
         * @readonly
         * @return {number} Relative bottom margin
         */
        get: function () {
            // @todo Maybe use [[Percent]]?
            return this.adapter.apply("relativeMarginBottom", this.getRelativeY(this.marginBottom));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets padding for the element in pixels.
     *
     * @param  {number}  top     Top padding (px)
     * @param  {number}  right   Right padding (px)
     * @param  {number}  bottom  Bottom padding (px)
     * @param  {number}  left    Left padding (px)
     * @return {Sprite}          Element
     */
    Sprite.prototype.padding = function (top, right, bottom, left) {
        this.paddingTop = top;
        this.paddingRight = right;
        this.paddingBottom = bottom;
        this.paddingLeft = left;
        return this;
    };
    Object.defineProperty(Sprite.prototype, "paddingLeft", {
        /**
         * @return {number | Percent} Padding value
         */
        get: function () {
            return this.getPropertyValue("paddingLeft");
        },
        /**
         * Left padding - absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Padding value
         */
        set: function (value) {
            this.setPercentProperty("paddingLeft", value, true, true, this._positionPrecision, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "paddingRight", {
        /**
         * @return {number | Percent} Padding value
         */
        get: function () {
            return this.getPropertyValue("paddingRight");
        },
        /**
         * Right padding - absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Padding value
         */
        set: function (value) {
            this.setPercentProperty("paddingRight", value, true, true, this._positionPrecision, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "paddingTop", {
        /**
         * @return {number | Percent} Padding value
         */
        get: function () {
            return this.getPropertyValue("paddingTop");
        },
        /**
         * Top padding - absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Padding value
         */
        set: function (value) {
            this.setPercentProperty("paddingTop", value, true, true, this._positionPrecision, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "paddingBottom", {
        /**
         * @return {number | Percent} Padding value
         */
        get: function () {
            return this.getPropertyValue("paddingBottom");
        },
        /**
         * Bottom padding - absolute (px) or relative ([[Percent]]).
         *
         * @param {number | Percent}  value  Padding value
         */
        set: function (value) {
            this.setPercentProperty("paddingBottom", value, true, true, this._positionPrecision, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelPaddingRight", {
        /**
         * Returns current right padding in pixels.
         *
         * @readonly
         * @return {number} Right padding (px)
         */
        get: function () {
            return this.getPixelX(this.paddingRight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativePaddingRight", {
        /**
         * Returns current relative right padding.
         *
         * @readonly
         * @return {number} Relative right padding
         */
        get: function () {
            // @todo Maybe use [[Percent]]?
            return this.getRelativeX(this.paddingRight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelPaddingLeft", {
        /**
         * Returns current left padding in pixels.
         *
         * @readonly
         * @return {number} Left padding (px)
         */
        get: function () {
            return this.getPixelX(this.paddingLeft);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativePaddingLeft", {
        /**
         * Returns current relative left padding.
         *
         * @readonly
         * @return {number} Relative left padding
         */
        get: function () {
            // @todo Maybe use [[Percent]]?
            return this.getRelativeX(this.paddingLeft);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelPaddingTop", {
        /**
         * Returns current top padding in pixels.
         *
         * @readonly
         * @return {number} Top padding (px)
         */
        get: function () {
            return this.getPixelY(this.paddingTop);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativePaddingTop", {
        /**
         * Returns current relative top padding.
         *
         * @readonly
         * @return {number} Relative top padding
         */
        get: function () {
            // @todo Maybe use [[Percent]]?
            return this.getRelativeY(this.paddingTop);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelPaddingBottom", {
        /**
         * Returns current bottom padding in pixels.
         *
         * @readonly
         * @return {number} Bottom padding (px)
         */
        get: function () {
            return this.getPixelY(this.paddingBottom);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "relativePaddingBottom", {
        /**
         * Returns current relative bottom padding.
         *
         * @readonly
         * @return {number} Relative bottom padding
         */
        get: function () {
            // @todo Maybe use [[Percent]]?
            return this.getRelativeY(this.paddingBottom);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "path", {
        /**
         * Path of a tick element
         * @type {string}
         */
        get: function () {
            return this.getPropertyValue("path");
        },
        /**
         * ==========================================================================
         * APPEARANCE-RELATED PROPERTIES AND RELATED STUFF
         * ==========================================================================
         * @hidden
         */
        /**
         * Path of a sprite element
         * @type {string}
         */
        set: function (value) {
            if (this.setPropertyValue("path", value)) {
                if (!this.element) {
                    this.element = this.paper.add("path");
                }
                this.element.attr({ "d": value });
                this.invalidatePosition();
                // otherwise is 0x0
                if (!this.inited) {
                    this.events.once("inited", this.validatePosition, this, false);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "fillModifier", {
        /**
         * @return {ColorModifier} Fill color modifier
         */
        get: function () {
            return this.getPropertyValue("fillModifier");
        },
        /**
         * [[ColorModifier]] that can be used to modify color and pattern of the
         * element's fill, e.g. create gradients.
         *
         * @param {ColorModifier}  value  Fill color modifiier
         */
        set: function (value) {
            if (this.setPropertyValue("fillModifier", value)) {
                this.setFill(this.fill);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "strokeModifier", {
        /**
         * @return {ColorModifier} Stroke color modifier
         */
        get: function () {
            return this.getPropertyValue("strokeModifier");
        },
        /**
         * [[ColorModifier]] that can be used to modify color and pattern of the
         * element's stroke (outline), e.g. create gradients.
         *
         * @param {ColorModifier}  value  Stroke color modifier
         */
        set: function (value) {
            this.setPropertyValue("strokeModifier", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "fillOpacity", {
        /**
         * @return {number} Opacity (0-9)
         */
        get: function () {
            return this.getPropertyValue("fillOpacity");
        },
        /**
         * Element's fill opacity.
         *
         * Opacity ranges from 0 (fully transparent) to 1 (fully opaque).
         *
         * @param {number}  value  Opacity (0-1)
         */
        set: function (value) {
            value = $math.toNumberRange(value, 0, 1);
            if (this.setPropertyValue("fillOpacity", value)) {
                this.setSVGAttribute({ "fill-opacity": value });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "fill", {
        /**
         * @return {Color} Fill
         */
        get: function () {
            return this.getPropertyValue("fill");
        },
        /**
         * Element's fill color or pattern.
         *
         * @param {Optional<Color | Pattern | LinearGradient | RadialGradient>}  value  Fill
         */
        set: function (value) {
            this.setFill(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets actual `fill` property on the SVG element, including applicable color
     * modifiers.
     *
     * @ignore Exclude from docs
     * @param {Optional<Color | Pattern | LinearGradient | RadialGradient>}  value  Fill
     */
    Sprite.prototype.setFill = function (value) {
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
            else if (value instanceof Pattern || value instanceof LinearGradient || value instanceof RadialGradient) {
                var fill = value;
                fill.paper = this.paper;
                this.setSVGAttribute({ "fill": "url(#" + fill.id + ")" });
            }
        }
    };
    Object.defineProperty(Sprite.prototype, "opacity", {
        /**
         * @return {number} Opacity (0-1)
         */
        get: function () {
            return this.getPropertyValue("opacity");
        },
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
        set: function (value) {
            value = $math.toNumberRange(value, 0, 1);
            if (this.setPropertyValue("opacity", value)) {
                this.setSVGAttribute({ "opacity": value });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "stroke", {
        /**
         * @return {Color} Stroke setting
         */
        get: function () {
            return this.getPropertyValue("stroke");
        },
        /**
         * Element's stroke (outline) color or pattern.
         *
         * @param {Color | Pattern | LinearGradient | RadialGradient}  value  Stroke setting
         */
        set: function (value) {
            this.setStroke(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets actual `stroke` property on the SVG element, including applicable
     * color modifiers.
     *
     * @ignore Exclude from docs
     * @param {Color | Pattern | LinearGradient | RadialGradient} value Stroke setting
     */
    Sprite.prototype.setStroke = function (value) {
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
            else if (value instanceof Pattern || value instanceof LinearGradient || value instanceof RadialGradient) {
                var stroke = value;
                stroke.paper = this.paper;
                this.setSVGAttribute({ "stroke": "url(#" + stroke.id + ")" });
            }
        }
    };
    Object.defineProperty(Sprite.prototype, "strokeOpacity", {
        /**
         * @return {number} Opacity (0-1)
         */
        get: function () {
            return this.getPropertyValue("strokeOpacity");
        },
        /**
         * Stroke (outline) opacity.
         *
         * The values may range from 0 (fully transparent) to 1 (fully opaque).
         *
         * @param {number}  value  Opacity (0-1)
         */
        set: function (value) {
            value = $math.toNumberRange(value, 0, 1);
            if (this.setPropertyValue("strokeOpacity", value)) {
                this.setSVGAttribute({ "stroke-opacity": value });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "nonScalingStroke", {
        /**
         * @return {boolean} Do not scale stroke (outline)
         */
        get: function () {
            return this.getPropertyValue("nonScalingStroke");
        },
        /**
         * Controls if the element's stroke (outline) should remain keep constant
         * thicnkess and do not scale when the whole element is resized.
         *
         * @param {boolean}  value  Do not scale stroke (outline)
         */
        set: function (value) {
            value = $type.toBoolean(value);
            if (this.setPropertyValue("nonScalingStroke", value)) {
                this.strokeWidth = this.strokeWidth;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "nonScaling", {
        /**
         * @return {boolean} Is element scaleable?
         */
        get: function () {
            return this.getPropertyValue("nonScaling");
        },
        /**
         * Controls if element should keep constant size and not scale even if there is
         * space available, or it does not fit.
         *
         * @param {boolean}  value  Is element scaleable?
         */
        set: function (value) {
            // @todo Description (review)
            value = $type.toBoolean(value);
            this.setPropertyValue("nonScaling", value, false, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "strokeWidth", {
        /**
         * @return {number} Thickness (px)
         */
        get: function () {
            return this.getPropertyValue("strokeWidth");
        },
        /**
         * Stroke (outline) thickness in pixels.
         *
         * @param {number}  value  Thickness (px)
         */
        set: function (value) {
            value = $type.toNumber(value);
            this.setPropertyValue("strokeWidth", value, true);
            if (this.nonScalingStroke) {
                if (!$type.isNumber(value)) {
                    value = 1;
                }
                value = value / this.globalScale;
            }
            this.setSVGAttribute({ "stroke-width": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "strokeDasharray", {
        /**
         * @return {string} `stroke-dasharray`
         */
        get: function () {
            return this.getPropertyValue("strokeDasharray");
        },
        /**
         * A `stroke-dasharray` for the stroke (outline).
         *
         * "Dasharray" allows setting rules to make lines dashed, dotted, etc.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray} for more info on `stroke-dasharray`
         * @param {string}  value  `stroke-dasharray`
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("strokeDasharray", value)) {
                this.setSVGAttribute({ "stroke-dasharray": value });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "shapeRendering", {
        /**
         * @return {ShapeRendering} 'shape-rendering' value
         */
        get: function () {
            return this.getPropertyValue("shapeRendering");
        },
        /**
         * An SVG-specific `shape-rendering` value.
         *
         * `shape-rendering` controls how vector graphics are drawn and rendered.
         *
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering} for more information about `shape-rendering`
         * @default "auto"
         * @param {ShapeRendering}  value  'shape-rendering' value
         */
        set: function (value) {
            value = $type.toText(value);
            if (this.setPropertyValue("shapeRendering", value)) {
                this.setSVGAttribute({ "shape-rendering": value });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pixelPerfect", {
        /**
         * @return {boolean} Use pixel perfect?
         */
        get: function () {
            return this.getPropertyValue("pixelPerfect");
        },
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
        set: function (value) {
            value = $type.toBoolean(value);
            if (value) {
                this._positionPrecision = 0;
            }
            else {
                this._positionPrecision = 3;
            }
            this.setPropertyValue("pixelPerfect", value, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "rtl", {
        /**
         * @return {boolean} RTL?
         */
        get: function () {
            if ($type.hasValue(this._rtl)) {
                return this._rtl;
            }
            else if (this.virtualParent) {
                return this.virtualParent.rtl;
            }
            else if (this.parent) {
                return this.parent.rtl;
            }
            this.rtl = false;
            return this.rtl;
        },
        /**
         * An RTL (right-to-left) setting.
         *
         * RTL may affect alignment, text, and other visual properties.
         *
         * @param {DateFormatter}  value  `true` for to use RTL
         */
        set: function (value) {
            value = $type.toBoolean(value);
            this._rtl = value;
        },
        enumerable: true,
        configurable: true
    });
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
     * @param  {number}  duration  Fade in duration (ms)
     * @return {Optional<Animation>} Animation object if such object was created
     */
    Sprite.prototype.show = function (duration) {
        return this.showReal(duration);
    };
    /**
     * Performs actual operations to reveal this element.
     *
     * @ignore Exclude from docs
     * @param  {number} duration Fade in duration (ms)
     * @return {number}          Fade in duration (ms)
     */
    Sprite.prototype.showReal = function (duration) {
        var _this = this;
        var transition;
        var properties = this.defaultState.properties;
        if (!this.disabled && (this.isHidden || !this.visible || this.isHiding || (properties.opacity != null && this.opacity < properties.opacity && !this.isShowing))) {
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
                this._showHideDisposer = transition.events.on("animationended", function () {
                    _this.isShowing = false;
                });
                this._disposers.push(this._showHideDisposer);
            }
            else {
                this.isShowing = false;
            }
            // Make it visible
            var visible = this.defaultState.properties.visible;
            if (!$type.hasValue(visible)) {
                visible = true;
            }
            this.visible = visible;
            // Dispatch "show" event
            this.dispatchImmediately("shown");
        }
        return transition;
    };
    /**
     * Initiates hiding of Sprite.
     * When called it will fade out the the Sprite to transparency, then make it
     * invisible.
     * @param {number} duration Duration in millisecons
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
     * @param  {number}  duration  Fade out duration (ms)
     * @return {Optional<Animation>} hide Animation object if such object was created
     */
    Sprite.prototype.hide = function (duration) {
        return this.hideReal(duration);
    };
    /**
     * Hides actual SVG elements and handles hiding animations.
     *
     * @param  {number}  duration  Fade out duration (ms)
     * @return {Animation}            Fade out duration (ms)
     * @ignore
     */
    Sprite.prototype.hideReal = function (duration) {
        var _this = this;
        var transition;
        if (!this.isHiding && this.visible) {
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
            var hiddenState = this.hiddenState;
            // Transition to "hidden" state, provided Sprite has one set
            if (hiddenState) {
                // Yes, we have a "hidden" state
                // `setState` will return an `Animation` object which we can set
                // events on
                transition = this.setState(hiddenState, duration, undefined);
                if (transition && !transition.isFinished()) {
                    this._hideAnimation = transition;
                    this._showHideDisposer = transition.events.on("animationended", function () {
                        _this.isHiding = false;
                        _this._isHidden = true;
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
            // Dispach "hidden" event
            this.dispatchImmediately("hidden");
            this.invalidate(); // hide it at once to avoid flickers // validate() causes SO
        }
        if (!$type.isNumber(duration)) {
            duration = this.hiddenState.transitionDuration;
        }
        return transition;
    };
    Object.defineProperty(Sprite.prototype, "visible", {
        /**
         * Returns current visibility of the element.
         *
         * @return {boolean} Visible?
         */
        get: function () {
            return this.getVisibility();
        },
        /**
         * Sets visibility of the element.
         *
         * @param {boolean} value Visible?
         */
        set: function (value) {
            value = $type.toBoolean(value);
            this.setVisibility(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns visibility value
     * @ignore
     */
    Sprite.prototype.getVisibility = function () {
        var value = this.getPropertyValue("visible");
        if (!$type.hasValue(value)) {
            value = true;
        }
        return value;
    };
    /**
     * Sets `visibility` property:
     *
     * * `true` - visible
     * * `false` - hidden
     *
     * @param  {boolean}  value  true - visible, false - hidden
     * @return {string}          Current visibility
     */
    Sprite.prototype.setVisibility = function (value) {
        if (this.setPropertyValue("visible", value)) {
            if (value) {
                this.group.removeAttr("visibility");
            }
            else {
                this.group.attr({ "visibility": "hidden" });
            }
            //this.invalidatePosition();
            if (this.events.isEnabled("visibilitychanged")) {
                var event_4 = {
                    type: "visibilitychanged",
                    target: this,
                    visible: value
                };
                this.events.dispatchImmediately("visibilitychanged", event_4);
            }
        }
    };
    Object.defineProperty(Sprite.prototype, "zIndex", {
        /**
         * @return {number} zIndex
         */
        get: function () {
            return this.getPropertyValue("zIndex");
        },
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
        set: function (value) {
            value = $type.toNumber(value);
            if (this.setPropertyValue("zIndex", value)) {
                this.dispatch("zIndexChanged");
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Moves the element to the very top in element order, so that it appears
     * in front of other elements.
     */
    Sprite.prototype.toFront = function () {
        var parent = this.parent;
        if (parent && parent.children.indexOf(this) != parent.children.length - 1) {
            parent.children.moveValue(this, parent.children.length - 1);
            this.dispatch("zIndexChanged");
        }
    };
    /**
     * Moves the element to the very bottom in the element order, so that it
     * appears behind other elements.
     */
    Sprite.prototype.toBack = function () {
        var parent = this.parent;
        if (parent && parent.children.indexOf(this) != 0) {
            parent.children.moveValue(this, 0);
            this.dispatch("zIndexChanged");
        }
    };
    Object.defineProperty(Sprite.prototype, "tooltip", {
        /**
         * @return {Optional<Tooltip>} Tooltip
         */
        get: function () {
            if (this._tooltip) {
                return this._tooltip;
            }
            else if (this.virtualParent) {
                return this.virtualParent.tooltip;
            }
            else if (this.parent) {
                return this.parent.tooltip;
            }
        },
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
        set: function (tooltip) {
            if (this._tooltip) {
                //this._tooltip.dispose();
                this.removeDispose(this._tooltip);
            }
            this._tooltip = tooltip;
            if (tooltip) {
                tooltip.parent = this.tooltipContainer;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "tooltipDataItem", {
        /**
         * @return {DataItem} Tooltip data item
         */
        get: function () {
            var tooltipDataItem = this._tooltipDataItem;
            if (tooltipDataItem) {
                return tooltipDataItem;
            }
            else {
                return this.dataItem;
            }
        },
        /**
         * A [[DataItem]] to use when populating content for the element's
         * [[Tooltip]].
         *
         * @see {@link Tooltip}
         * @see {@link DataItem}
         * @param {DataItem}  value  Tooltip data item
         */
        set: function (value) {
            // important: do not dispose tooltip dataItem, as it is some actual data item from data!
            this._tooltipDataItem = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "tooltipColorSource", {
        /**
         * @return {Optional<Sprite>} Tooltip color source
         */
        get: function () {
            return this._tooltipColorSource;
        },
        /**
         * A [[Sprite]] or sprite template to use when getting colors for tooltip. If a template is set,
         * tooltip will look for a clone in tooltipDataItem.sprites. If no clone is found, then template colors will be used.
         *
         * @see {@link Tooltip}
         * @see {@link Sprite}
         * @param {Optional<Sprite>}  sprite Sprite
         */
        set: function (sprite) {
            this._tooltipColorSource = sprite;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Shows the element's [[Tooltip]].
     *
     * A tooltip will be populated using text templates in either `tooltipHTML` or
     * `tooltipText` as well as data in `tooltipDataItem`.
     *
     * @see {@link Tooltip}
     * @param {point} optional point (sprite-related) to which tooltip must point.
     * @return {boolean} returns true if the tooltip was shown and false if it wasn't (no text was found)
     */
    Sprite.prototype.showTooltip = function (point) {
        // do not show if hidden
        var sprite = this;
        while (sprite != undefined) {
            if (!sprite.visible || sprite.disabled || sprite.__disabled) {
                return;
            }
            sprite = sprite.parent;
        }
        if ($type.hasValue(this.tooltipText) || $type.hasValue(this.tooltipHTML)) {
            var tooltip = this.tooltip;
            var tooltipDataItem = this.tooltipDataItem;
            if (tooltip) {
                var colorSource_1 = this;
                var tooltipColorSource_1 = this.tooltipColorSource;
                if ((tooltip.getStrokeFromObject || tooltip.getFillFromObject) && tooltipColorSource_1) {
                    if (tooltipColorSource_1.isTemplate) {
                        if (tooltipDataItem) {
                            $array.eachContinue(tooltipDataItem.sprites, function (sprite) {
                                if (sprite.clonedFrom == tooltipColorSource_1) {
                                    colorSource_1 = sprite;
                                    return false;
                                }
                                return true;
                            });
                        }
                    }
                    else {
                        colorSource_1 = tooltipColorSource_1;
                    }
                }
                if (tooltip.getStrokeFromObject) {
                    var stroke = this.stroke;
                    var source = colorSource_1;
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
                    var fill = this.fill;
                    var source = colorSource_1;
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
                var text = "";
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
                        var duration = tooltip.defaultState.transitionDuration;
                        if (duration <= 0) {
                            duration = 1;
                        }
                        tooltip.show(duration);
                        return true;
                    }
                }
                else {
                    this.hideTooltip(0);
                }
            }
        }
        return false;
    };
    /**
     * @ignore
     */
    Sprite.prototype.updateTooltipPosition = function (point) {
        var _this = this;
        if (this.tooltipPosition == "pointer") {
            this._interactionDisposer = getInteraction().body.events.on("track", function (ev) {
                return _this.pointTooltipTo($utils.documentPointToSvg(ev.point, _this.svgContainer.SVGContainer), true);
            });
            if (point) {
                return this.pointTooltipTo(point, true);
            }
        }
        else {
            // Point to the X/Y of this Sprite
            var globalPoint = $utils.spritePointToSvg({
                "x": this.tooltipX,
                "y": this.tooltipY
            }, this);
            return this.pointTooltipTo(globalPoint);
        }
    };
    /**
     * Sets the point the [[Tooltip]] should point to.
     *
     * @param {IPoint}   point      Coordinates to point to
     * @param {boolean}  instantly  Move instantly without animation
     */
    Sprite.prototype.pointTooltipTo = function (point, instantly) {
        var tooltip = this.tooltip;
        if (tooltip) {
            if ($math.isInRectangle(point, { x: 0, y: 0, width: this.topParent.maxWidth, height: this.topParent.maxHeight })) {
                tooltip.pointTo(point, instantly);
                return true;
            }
        }
        return false;
    };
    /**
     * Hides element's [[Tooltip]].
     *
     * @see {@link Tooltip}
     */
    Sprite.prototype.hideTooltip = function (duration) {
        var tooltip = this.tooltip;
        if (tooltip) {
            tooltip.hide(duration);
            if (this._interactionDisposer) {
                this._interactionDisposer.dispose();
            }
        }
    };
    Object.defineProperty(Sprite.prototype, "tooltipHTML", {
        /**
         * @return {string} Tooltip HTML content template
         */
        get: function () {
            return this.getPropertyValue("tooltipHTML");
        },
        /**
         * An HTML template to be used to populate [[Tooltip]] contents.
         *
         * If element has `tooltipDataItem` or `dataItem` set, this will be parsed
         * for any data values to be replaced with the values from respective data
         * items.
         *
         * @param {string} value Tooltip HTML content template
         */
        set: function (value) {
            value = $type.toText(value);
            this.hoverable = true;
            if (this.setPropertyValue("tooltipHTML", value)) {
                if (this.tooltip) {
                    if (this.tooltip.visible) {
                        this.showTooltip();
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "tooltipText", {
        /**
         * @return {string} Tooltip content template
         */
        get: function () {
            return this.getPropertyValue("tooltipText");
        },
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
        set: function (value) {
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "tooltipContainer", {
        /**
         * @ignore Exclude from docs
         * @return {Optional<Container>} Container
         */
        get: function () {
            if (this._tooltipContainer) {
                return this._tooltipContainer;
            }
            else if (this.parent) {
                return this.parent.tooltipContainer;
            }
        },
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
        set: function (value) {
            this._tooltipContainer = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "tooltipX", {
        /**
         * @ignore Exclude from docs
         * @return {number} Tooltip X (px)
         */
        get: function () {
            return this.getTooltipX();
        },
        /**
         * X coordinate the [[Tooltip]] should be shown at.
         *
         * @ignore Exclude from docs
         * @param {number}  value  Tooltip X (px)
         */
        set: function (value) {
            value = $type.toNumber(value);
            if (this.setPropertyValue("tooltipX", value) && this.tooltip) {
                this.tooltip.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "tooltipPosition", {
        /**
         * @type {"fixed" | "pointer"} Position
         */
        get: function () {
            return this.getPropertyValue("tooltipPosition");
        },
        /**
         * Specifies if [[Tooltip]] should follow the mouse or touch pointer or stay
         * at the fixed position.
         *
         * @param { "fixed" | "pointer" }  value  Position
         */
        set: function (value) {
            this.setPropertyValue("tooltipPosition", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "tooltipY", {
        /**
         * @ignore Exclude from docs
         * @return {number} Tooltip Y (px)
         */
        get: function () {
            return this.getTooltipY();
        },
        /**
         * Y coordinate the [[Tooltip]] should be shown at.
         *
         * @ignore Exclude from docs
         * @param {number}  value  Tooltip Y (px)
         */
        set: function (value) {
            value = $type.toNumber(value);
            if (this.setPropertyValue("tooltipY", value) && this.tooltip) {
                this.tooltip.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns Tooltip X coordinate if it's set, or middle of the element.
     *
     * @ignore Exclude from docs
     * @return {number} X (px)
     */
    Sprite.prototype.getTooltipX = function () {
        var x = this.getPropertyValue("tooltipX");
        if (!$type.isNumber(x)) {
            x = this.maxLeft + this.measuredWidth / 2 - this.pixelPaddingLeft - this.ex; // overflow is know only for measured items, so this is not always good
        }
        return x;
    };
    /**
     * Returns Tooltip Y coordinate if it's set, or middle of the element.
     *
     * @ignore Exclude from docs
     * @return {number} Y (px)
     */
    Sprite.prototype.getTooltipY = function () {
        var y = this.getPropertyValue("tooltipY");
        if (!$type.isNumber(y)) {
            y = this.maxTop + this.measuredHeight / 2 - this.pixelPaddingTop - this.ey; // overflow is know only for measured items, so this is not always good
        }
        return y;
    };
    /**
     * Displays a modal or console message with error, and halts any further
     * processing of this item.
     *
     * @ignore Exclude from docs
     * @param {Error} e Error
     * @todo Implement from applying further actions to this item
     */
    Sprite.prototype.raiseCriticalError = function (e) {
        if (this.svgContainer) {
            this.modal.content = e.message;
            this.modal.closable = false;
            this.modal.open();
            this.disabled = true;
        }
        if (options.verbose) {
            console.log(e);
        }
    };
    /**
 * Processes JSON-based config before it is applied to the object.
 *
 * @ignore Exclude from docs
 * @param {object}  config  Config
 */
    Sprite.prototype.processConfig = function (config) {
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
        _super.prototype.processConfig.call(this, config);
    };
    /**
     * Converts string name of the cursor into actual [[MouseCursorStyle]].
     *
     * @param  {string}                      style  Cursor type
     * @return {Optional<MouseCursorStyle>}         Cursor definition
     */
    Sprite.prototype.getCursorStyle = function (style) {
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
    };
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
    Sprite.prototype.configOrder = function (a, b) {
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
            return _super.prototype.configOrder.call(this, a, b);
        }
    };
    Object.defineProperty(Sprite.prototype, "isHidden", {
        /**
         * If `sprite.hide()` is called, we set isHidden to true when sprite is hidden.
         * This was added becaus hidden state might have visibility set to true and so
         * there would not be possible to find out if a sprite is technically hidden or not.
         *
         * @type {boolean}
         */
        get: function () {
            if (this._isHidden) {
                return this._isHidden;
            }
            else if (this._parent) {
                return this._parent.isHidden;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "showOnInit", {
        /**
         * @return {boolean} Show on init?
         */
        get: function () {
            return this.getPropertyValue("showOnInit");
        },
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
         * @param {boolean}  value show on init?
         */
        set: function (value) {
            value = $type.toBoolean(value);
            this.setShowOnInit(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @ignore
     */
    Sprite.prototype.setShowOnInit = function (value) {
        if (this.setPropertyValue("showOnInit", value)) {
            if (!this.isTemplate) {
                if (value && !this.inited && !this.hidden) {
                    this._showOnInitDisposer = new MultiDisposer([
                        registry.events.once("enterframe", this.hideInitially, this),
                        this.events.once("beforevalidated", this.hideInitially, this, false),
                        this.events.on("inited", this.appear, this, false)
                    ]);
                    this._disposers.push(this._showOnInitDisposer);
                }
                else {
                    if (this._showOnInitDisposer) {
                        this._showOnInitDisposer.dispose();
                    }
                }
            }
        }
    };
    /**
     * @ignore
     */
    Sprite.prototype.hideInitially = function () {
        if (!this.isDisposed()) {
            this.appeared = false;
            //if (!this.hidden && !this._isHidden) { // not good for series, as on enterframe it doesn't have data items yet.
            if (!this.inited) {
                this.hide(0);
            }
        }
    };
    /**
     * Hides the chart instantly and then shows it. If defaultState.transitionDuration > 0, this will result an animation in which properties of hidden state will animate to properties of visible state.
     */
    Sprite.prototype.appear = function () {
        var _this = this;
        this.appeared = false;
        if (!this.hidden && !this.isHidden) {
            this.hide(0);
        }
        if (!this.hidden) {
            var animation = this.show();
            if (animation && !animation.isFinished()) {
                animation.events.on("animationended", function () {
                    _this.appeared = true;
                });
            }
            else {
                this.appeared = true;
            }
        }
        else {
            this.appeared = true;
        }
    };
    Object.defineProperty(Sprite.prototype, "hidden", {
        /**
         * @return {boolean} Is initially hidden?
         */
        get: function () {
            return this.getPropertyValue("hidden");
        },
        /**
         * If a sprite has `showOnInit = true`, it will animate from "hidden" to
         * "default" state when initialized. To prevent this but keep
         * `showOnInit = true`, you can set `sprite.hidden = true`.
         *
         * @param {boolean}  value initially hidden?
         */
        set: function (value) {
            value = $type.toBoolean(value);
            this.setPropertyValue("hidden", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "bbox", {
        /**
         * Returns bounding box (square) for this element.
         *
         * @ignore Exclude from docs
         * @type {IRectangle}
         */
        get: function () {
            if (this.definedBBox) {
                return this.definedBBox;
            }
            return this._bbox;
        },
        enumerable: true,
        configurable: true
    });
    return Sprite;
}(BaseObjectEvents));
export { Sprite };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Sprite"] = Sprite;
//# sourceMappingURL=Sprite.js.map