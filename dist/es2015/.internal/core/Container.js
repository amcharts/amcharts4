/**
 * Container module
 * @todo Needs description
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "./Sprite";
import { SpriteState } from "./SpriteState";
import { List } from "./utils/List";
import { MultiDisposer } from "./utils/Disposer";
import { Dictionary, DictionaryDisposer } from "./utils/Dictionary";
import { Rectangle } from "./elements/Rectangle";
import { Percent } from "./utils/Percent";
import { registry } from "./Registry";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import * as $iter from "./utils/Iterator";
import * as $array from "./utils/Array";
import * as $math from "./utils/Math";
import * as $type from "./utils/Type";
;
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Container can contain multiple sprites and arrange them in various layouts.
 *
 * @see {@link IContainerEvents} for a list of available events
 * @see {@link IContainerAdapters} for a list of available Adapters
 * @important
 */
var Container = /** @class */ (function (_super) {
    tslib_1.__extends(Container, _super);
    /**
     * Constructor
     */
    function Container() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * Container children. (sorted by layout)
         *
         * @ignore Exclude from docs
         * @type {List<Sprite>}
         */
        _this._childrenByLayout = [];
        /**
         * Container's disposers for its child elements.
         *
         * @ignore Exclude from docs
         * @type {Dictionary<string, IDisposer>}
         */
        _this._childrenDisposers = new Dictionary();
        /**
         * Indicates if this container contains any focused elements, including
         * itself.
         *
         * @type {boolean}
         */
        _this.hasFocused = false;
        /**
         * Specifies if, when state is applied on this container, the same state
         * should be applied to container's children as well as `background`.
         *
         * @type {boolean}
         */
        _this.setStateOnChildren = false;
        /**
         * An array of references to elements the state should be set, when it is set
         * ont this element.
         *
         * @type {Sprite[]}
         */
        _this.setStateOnSprites = [];
        /*
         * @ignore
         */
        _this.layoutInvalid = false;
        _this._absoluteWidth = 0;
        _this._absoluteHeight = 0;
        _this.className = "Container";
        _this._element = _this.paper.addGroup("g");
        _this.pixelPerfect = false;
        _this._positionPrecision = 4;
        _this.group.add(_this.element);
        _this.layout = "absolute";
        _this._fixedWidthGrid = false;
        _this.verticalCenter = "none";
        _this.horizontalCenter = "none";
        _this._disposers.push(new DictionaryDisposer(_this._childrenDisposers));
        _this.children.events.on("inserted", _this.handleChildAdded, _this);
        _this.children.events.on("removed", _this.handleChildRemoved, _this);
        _this.applyTheme();
        return _this;
    }
    /**
     * Handles adding of a new child into `children`. Adding new children might
     * affect the whole layout so it needs to be revalidated.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Sprite>["inserted"]} event Event object
     * @todo Throw an exception on adding a disposed object. Of course it's better NOT TO add disposed objects, so that what we should focus on.
     */
    Container.prototype.handleChildAdded = function (event) {
        var _this = this;
        var child = event.newValue;
        this._childrenDisposers.insertKey(child.uid, new MultiDisposer([
            // it's not enough to listen to POSITION_CHANGED only, as some extra redrawals will happen.
            child.events.on("transformed", this.handleChildTransform, this),
            child.events.on("zIndexChanged", function () {
                _this.sortChildren();
                _this.addChildren();
            })
        ]));
        if (this.element) {
            var group = this.element;
            group.add(child.group);
        }
        child.parent = this;
        this.dispatchImmediately("childadded", { type: "childadded", newValue: child });
        this.invalidate();
        this.invalidateLayout();
    };
    /**
     * Handles child removal. Changing size of the child may change the
     * whole layout of the Container, hence layout needs to be invalidated.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Sprite>["removed"]} event Event object
     */
    Container.prototype.handleChildRemoved = function (event) {
        var child = event.oldValue;
        // TODO figure out why the key sometimes doesn't exist
        this._childrenDisposers.removeKey(child.uid);
        if (this.element) {
            var group = this.element;
            group.removeElement(child.group);
        }
        if (child.isMeasured) {
            this.invalidateLayout();
        }
        this.dispatchImmediately("childremoved", { type: "childremoved", oldValue: child });
    };
    /**
     * Handles child transformation. Changing size of the child may change the
     * whole layout of the Container, hence layout needs to be invalidated.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["transformed"]} event Event object
     */
    Container.prototype.handleChildTransform = function (event) {
        var child = event.target;
        if (child.isMeasured) { // && this.layout != "none" && this.layout != "absolute") {
            this.invalidateLayout();
        }
    };
    /**
     * Invalidates Container's layout, causing it to be re-evaluated again.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.invalidateLayout = function () {
        if (this.disabled || this.isTemplate || this.layout == "none") {
            return;
        }
        if (!this.layoutInvalid) {
            this.layoutInvalid = true;
            $array.add(registry.invalidLayouts, this);
        }
    };
    /**
     * Invalidates the whole element, including layout.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.invalidate = function () {
        _super.prototype.invalidate.call(this);
        this.invalidateLayout();
    };
    /**
     * Invalidates the whole element, including layout AND all its child
     * elements.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.deepInvalidate = function () {
        _super.prototype.invalidate.call(this);
        //this.sortChildren();
        $array.each(this._childrenByLayout, function (child) {
            if (child instanceof Container) {
                child.deepInvalidate();
            }
            else {
                child.invalidate();
            }
        });
        this.invalidateLayout();
    };
    /**
     * Appends `<defs>` section to the element. This section holds all the SVG
     * definitions for the element, such as filters.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.appendDefs = function () {
        _super.prototype.appendDefs.call(this);
        $array.each(this._childrenByLayout, function (child) {
            if (child instanceof Container) {
                child.appendDefs();
            }
            else {
                child.appendDefs();
            }
        });
    };
    Object.defineProperty(Container.prototype, "children", {
        /**
         * Returns a list of the child [[Sprite]] elements contained in this
         * Container.
         *
         * @return {List<Sprite>} List of child elements (Sprites)
         */
        get: function () {
            // @todo Review if we can add all children to disposers
            if (!this._children) {
                this._children = new List();
                //this._disposers.push(new ListDisposer(this._children));
            }
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "minWidth", {
        /**
         * @return {Optional<number>} Width (px)
         */
        get: function () {
            return this.getPropertyValue("minWidth");
        },
        /**
         * Minimum width (px) for the Container. A container will not
         * auto-shrink beyond this value, even if child elements are smaller.
         *
         * @param {Optional<number>}  value  Width (px)
         */
        set: function (value) {
            if (this.setPropertyValue("minWidth", value)) {
                this.invalidateLayout();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "minHeight", {
        /**
         * @return {Optional<number>} Height (px)
         */
        get: function () {
            return this.getPropertyValue("minHeight");
        },
        /**
         * Minimum height (px) for the Container. A container will not
         * auto-shrink beyond this value, even if child elements are smaller.
         *
         * @param {Optional<number>}  value  Height (px)
         */
        set: function (value) {
            if (this.setPropertyValue("minHeight", value)) {
                this.invalidateLayout();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "maxWidth", {
        /**
         * @return {Optional<number>} Width (px)
         */
        get: function () {
            var maxWidth = this.getPropertyValue("maxWidth");
            if (!$type.isNumber(maxWidth)) {
                if (this.parent) {
                    return this.parent.maxWidth; // used to be pixelWidth, but this causes problems
                }
            }
            return maxWidth;
        },
        /**
         * Maximum width (px) for the Container. A container will not
         * grow beyond this value, even if child elements do not fit.
         *
         * @param {Optional<number>}  value  Width (px)
         */
        set: function (value) {
            if (this.setPropertyValue("maxWidth", value)) {
                if ($type.isNumber(this.relativeWidth)) {
                    this.invalidateLayout();
                }
                this.dispatch("maxsizechanged");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "maxHeight", {
        /**
         * @return {Optional<number>} Height (px)
         */
        get: function () {
            var maxHeight = this.getPropertyValue("maxHeight");
            if (!$type.isNumber(maxHeight)) {
                if (this.parent) {
                    return this.parent.maxHeight; // used to be pixelHeight, but this causes problems
                }
            }
            return maxHeight;
        },
        /**
         * Maximum height (px) for the Container. A container will not
         * grow beyond this value, even if child elements do not fit.
         *
         * @param {Optional<number>}  value  Height (px)
         */
        set: function (value) {
            if (this.setPropertyValue("maxHeight", value)) {
                if ($type.isNumber(this.relativeHeight)) {
                    this.invalidateLayout();
                }
                this.dispatch("maxsizechanged");
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Overrides the original `removeElement` so that Container's actual element
     * is not removed. We do not need to remove element of a Container.
     *
     * We do this because remove element each time will fail the `getBBox`.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.removeElement = function () {
    };
    /**
     * Sorts Container's children: the ones with variable width and height are
     * put at the end of the list (depending on layout type), so that fixed-width
     * ones can be drawn first.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.sortChildren = function () {
        var _this = this;
        this._childrenByLayout = [];
        if (this.layout == "none" || this.layout == "absolute" || !this.layout) {
            //$iter.each(this.children.iterator(), (child) => {
            //	this._childrenByLayout.push(child);
            //});
            this._childrenByLayout = this.children.values;
        }
        else {
            // Assemble fixed-size and relative lists
            var fixed_1 = [];
            var relative_1 = [];
            $iter.each(this.children.iterator(), function (child) {
                if (_this.layout == "horizontal" || _this.layout == "grid") {
                    if (!$type.isNumber(child.percentWidth)) {
                        fixed_1.push(child);
                    }
                    else {
                        relative_1.push(child);
                    }
                }
                else if (_this.layout == "vertical") {
                    if (!$type.isNumber(child.percentHeight)) {
                        fixed_1.push(child);
                    }
                    else {
                        relative_1.push(child);
                    }
                }
                else {
                    fixed_1.push(child);
                }
            });
            // Concat everything into list
            this._childrenByLayout = fixed_1.concat(relative_1);
        }
        this.calculateRelativeSize();
    };
    /**
     * Calculates relative sizes for all Container's children.
     *
     * @ignore Exclude from docs
     * @todo Make it protected?
     */
    Container.prototype.calculateRelativeSize = function () {
        var _this = this;
        var totalRelativeWidth = 0;
        var totalRelativeHeight = 0;
        $array.each(this._childrenByLayout, function (child) {
            // if child is not measured, we do not care about it at all.
            if (child.isMeasured) {
                if ($type.isNumber(child.percentWidth)) {
                    totalRelativeWidth += child.percentWidth;
                }
                if ($type.isNumber(child.percentHeight)) {
                    totalRelativeHeight += child.percentHeight;
                }
            }
        });
        $array.each(this._childrenByLayout, function (child) {
            if (child.isMeasured) {
                if (_this.layout == "horizontal") {
                    if ($type.isNumber(child.percentWidth)) {
                        child.relativeWidth = child.percentWidth / totalRelativeWidth;
                    }
                    if ($type.isNumber(child.percentHeight)) {
                        // consider adding a property which would make the container of 100% when it's height is set to % value but there is only one object with percent width set in the parent container
                        child.relativeHeight = child.percentHeight / 100;
                    }
                }
                if (_this.layout == "vertical") {
                    if ($type.isNumber(child.percentHeight)) {
                        child.relativeHeight = child.percentHeight / totalRelativeHeight;
                    }
                    if ($type.isNumber(child.percentWidth)) {
                        // consider adding a property which would make the container of 100% when it's height is set to % value but there is only one object with percent width set in the parent container
                        child.relativeWidth = child.percentWidth / 100;
                    }
                }
            }
            if (_this.layout == "absolute" || !child.isMeasured) {
                if ($type.isNumber(child.percentWidth)) {
                    // consider adding a property which would make the container of 100% when it's height is set to % value but there is only one object with percent width set in the parent container
                    child.relativeWidth = child.percentWidth / 100;
                }
                if ($type.isNumber(child.percentHeight)) {
                    // consider adding a property which would make the container of 100% when it's height is set to % value but there is only one object with percent width set in the parent container
                    child.relativeHeight = child.percentHeight / 100;
                }
            }
        });
    };
    /**
     * Adds all children to Container's SVG element.
     *
     * @ignore Exclude from docs
     * @todo Make it protected?
     */
    Container.prototype.addChildren = function () {
        var _this = this;
        /*
          Need this check because a child might be assigned to parent even before element is created, for example a theme
          access scrollbar.thumb
        */
        if (this.element) {
            //this.sortChildren(); // very bad for performance, maybe we don't need that at all
            var zindexed = $array.copy(this._childrenByLayout);
            zindexed.sort(function (a, b) {
                return (a.zIndex || 0) - (b.zIndex || 0);
            });
            $array.each(zindexed, function (child) {
                if (child.group) {
                    var group = _this.element;
                    group.add(child.group);
                }
            });
        }
    };
    /**
     * Creates a new element of specific type and assigns as a child to the
     * Container.
     *
     * @param  {T extends Sprite}  Class type for the new element
     * @return {T}                 New element
     */
    Container.prototype.createChild = function (classType) {
        var sprite = new classType();
        sprite.parent = this;
        return sprite;
    };
    /**
     * Removes all Container's children without actually destroying them.
     *
     * To destroy children use `disposeChildren()` instead.
     */
    Container.prototype.removeChildren = function () {
        // remove all children
        // TODO use iteration instead
        while (this.children.length > 0) {
            var child = this.children.getIndex(0);
            child.parent = undefined;
            this.children.removeValue(child);
        }
    };
    /**
     * Removes and destroys all Container's children.
     *
     * To remove children from Container without destroying them, use
     * `removeChildren()`.
     */
    Container.prototype.disposeChildren = function () {
        // TODO use iteration instead
        while (this.children.length > 0) {
            var child = this.children.getIndex(0);
            child.dispose();
            this.children.removeValue(child);
        }
    };
    Object.defineProperty(Container.prototype, "background", {
        /**
         * @return {Sprite} Background element
         */
        get: function () {
            if (!this._background) {
                this._background = this.createBackground();
                this.processBackground();
            }
            return this._background;
        },
        /**
         * An element to use as container background.
         *
         * @param {Sprite}  background  Background element
         */
        set: function (background) {
            if (this._background && this.background != background) {
                this.removeDispose(this._background);
            }
            if (background) {
                this._background = background;
                this._disposers.push(background);
                this.processBackground();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Handles the situation where parent element is resized.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.handleGlobalScale = function () {
        _super.prototype.handleGlobalScale.call(this);
        this.children.each(function (child) {
            child.handleGlobalScale();
        });
    };
    /**
     * Creates and returns a [[Rectangle]] to use as a background for Container.
     *
     * @ignore Exclude from docs
     * @return {this} Background Rectangle element
     */
    Container.prototype.createBackground = function () {
        return new Rectangle();
    };
    /**
     * Decorates background element with required properties.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.processBackground = function () {
        var background = this._background;
        if (background) {
            background.isMeasured = false;
            this._background.fill = new InterfaceColorSet().getFor("background");
            background.parent = this;
            background.isMeasured = false;
            this.children.removeValue(background);
            this._disposers.push(background);
        }
    };
    /**
     * Measures the size of container and informs its children of how much size
     * they can occupy, by setting their relative `maxWidth` and `maxHeight`
     * properties.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.validateLayout = function () {
        var _this = this;
        $array.remove(registry.invalidLayouts, this);
        this.layoutInvalid = false;
        var topParent = this.topParent;
        if (topParent) {
            if (!topParent.maxWidth || !topParent.maxHeight) {
                this._disposers.push(topParent.events.once("maxsizechanged", function () {
                    _this.invalidateLayout();
                }));
                //return; // not good for labels
            }
        }
        this._availableWidth = this.innerWidth;
        this._availableHeight = this.innerHeight;
        var measuredWidth = 0;
        var measuredHeight = 0;
        var allValid = true;
        if (this.children) {
            this.sortChildren();
            // we itterate through list of children, sorted by layout priority. sprites which width non-relative width/height will go first, so we will reduce available width before proceeding to sprites with relative width/height
            $array.each(this._childrenByLayout, function (child) {
                var maxWidth;
                var maxHeight;
                if ($type.isNumber(child.relativeWidth)) {
                    maxWidth = $math.round(_this._availableWidth * child.relativeWidth);
                    if (_this.layout == "horizontal") { // || this.layout == "absolute") {
                        maxWidth -= child.pixelMarginRight + child.pixelMarginLeft;
                    }
                }
                else {
                    if (_this.layout == "horizontal") {
                        if (child.invalid) {
                            child.validate();
                        }
                    }
                }
                if ($type.isNumber(child.relativeHeight)) {
                    maxHeight = $math.round(_this._availableHeight * child.relativeHeight);
                    if (_this.layout == "vertical") { //  || this.layout == "absolute") {
                        maxHeight -= child.pixelMarginTop + child.pixelMarginBottom;
                    }
                }
                else {
                    if (_this.layout == "vertical") {
                        if (child.invalid) {
                            child.validate();
                        }
                    }
                }
                // if child is valid
                if (child.invalid == false) {
                    if ($type.isNumber(child.relativeWidth)) {
                        child.maxWidth = maxWidth;
                    }
                    if ($type.isNumber(child.relativeHeight)) {
                        child.maxHeight = maxHeight;
                    }
                    if (child.isMeasured) {
                        // reduce available width if this is horizontal layout
                        if (_this.layout == "horizontal") {
                            if (!$type.isNumber(child.percentWidth)) {
                                if (child.measuredWidth > 0) {
                                    _this._availableWidth -= child.measuredWidth + child.pixelMarginLeft + child.pixelMarginRight;
                                }
                            }
                        }
                        // reduce available height if this is vertical layout
                        if (_this.layout == "vertical") {
                            if (!$type.isNumber(child.percentHeight)) {
                                if (child.measuredHeight > 0) {
                                    _this._availableHeight -= child.measuredHeight + child.pixelMarginTop + child.pixelMarginBottom;
                                }
                            }
                        }
                        var childMeasuredWidth = child.measuredWidth;
                        var childMeasuredHeight = child.measuredHeight;
                        if (child.align != "none") {
                            childMeasuredWidth += child.pixelMarginLeft + child.pixelMarginRight;
                        }
                        if (child.valign != "none") {
                            childMeasuredHeight += child.pixelMarginTop + child.pixelMarginBottom;
                        }
                        measuredWidth = Math.max(measuredWidth, childMeasuredWidth);
                        measuredHeight = Math.max(measuredHeight, childMeasuredHeight);
                    }
                }
                // if child is not valid
                else {
                    // tell child what maximum width/ height it can occupy
                    if (child.isMeasured) {
                        if ($type.isNumber(child.relativeWidth)) {
                            if (child.maxWidth != maxWidth) { // need to check this because of allValid
                                child.maxWidth = maxWidth;
                                allValid = false;
                            }
                        }
                        if ($type.isNumber(child.relativeHeight)) {
                            if (child.maxHeight != maxHeight) { // need to check this because of allValid
                                child.maxHeight = maxHeight;
                                allValid = false;
                            }
                        }
                    }
                }
            });
        }
        this._absoluteWidth = measuredWidth;
        this._absoluteHeight = measuredHeight;
        // arrange after measuring, only if all children are valid already
        if (allValid) {
            this.arrange();
        }
    };
    /**
     * Arranges children according to layout specs and available space / child
     * sizes.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.arrange = function () {
        var _this = this;
        if (this.children) {
            /*
               in this method we not only arrange children but also find out the size of the container
               it might seem it would be easier to get container size using sprite's measure method,
               however it would return only actual size of the bbox. However as each child meight have
               margins set, we need to check each child - we do it here.

               This method doesn't do anything with DOM, so it's not expensive
            */
            var measuredWidth = 0;
            var measuredHeight = 0;
            //let innerWidth: number = this.innerWidth; //$math.max(this.innerWidth, this._measuredWidth - paddingLeft - paddingRight);
            //let innerHeight: number = this.innerHeight; //$math.max(this.innerHeight, this._measuredHeight - paddingTop - paddingBottom);
            // above is wrong, as if a w/h is not specified, it is 0 and alignment doesn't work at all.
            var innerWidth_1 = $math.max(this.innerWidth, this._absoluteWidth);
            var innerHeight_1 = $math.max(this.innerHeight, this._absoluteHeight);
            var left = void 0; // = 0;
            var right = void 0; // = innerWidth;
            var top_1; // = 0;
            var bottom = void 0; // = innerHeight;
            var paddingLeft = this.pixelPaddingLeft;
            var paddingRight = this.pixelPaddingRight;
            var paddingTop = this.pixelPaddingTop;
            var paddingBottom = this.pixelPaddingBottom;
            var nextX = 0;
            var nextY = 0;
            var row = 0;
            var column = 0;
            var columnWidth = [];
            var rowHeight = [];
            var maxCellWidth = void 0;
            var minCellWidth = void 0;
            var columnCount = void 0;
            // GRID PRECALCULATIONS
            if (this.layout == "grid") {
                minCellWidth = $math.fitToRange($iter.min($iter.map(this.children.iterator(), function (x) { return x.measuredWidth; })), 1, this.maxWidth);
                maxCellWidth = $math.fitToRange($iter.max($iter.map(this.children.iterator(), function (x) { return x.measuredWidth; })), 1, this.maxWidth);
                if (this.fixedWidthGrid) {
                    columnCount = this.maxWidth / maxCellWidth;
                }
                else {
                    columnCount = this.maxWidth / minCellWidth; // predicted number of columns, yes it is usually much more than real number, but we fix that later
                }
                columnCount = $math.max(1, Math.floor(columnCount));
                columnWidth = this.getColumnWidth(columnCount, maxCellWidth);
            }
            var contentLeft = void 0;
            var contentRight = void 0;
            var contentTop = void 0;
            var contentBottom = void 0;
            // we itterate through array of children
            // TODO use iterator instead
            for (var i = 0, len = this.children.length; i < len; i++) {
                var child = this.children.getIndex(i);
                var x = undefined; //child.pixelX; // must reset
                var y = undefined; //child.pixelY; // must reset
                var childMarginLeft = child.pixelMarginLeft;
                var childMarginRight = child.pixelMarginRight;
                var childMarginTop = child.pixelMarginTop;
                var childMarginBottom = child.pixelMarginBottom;
                var childWidth = child.measuredWidth;
                var childHeight = child.measuredHeight;
                var childLeft = void 0;
                var childRight = void 0;
                var childTop = void 0;
                var childBottom = void 0;
                if (child.isMeasured && !child.disabled && !child.__disabled) {
                    switch (this.layout) {
                        case "none":
                            break;
                        // absolute layout
                        case "absolute":
                            // horizontal alignment
                            switch (child.align) {
                                case "left":
                                    x = childMarginLeft - child.maxLeft;
                                    break;
                                case "center":
                                    x = (innerWidth_1 - childWidth) / 2 - child.maxLeft;
                                    break;
                                case "right":
                                    x = innerWidth_1 - childMarginRight - child.maxRight;
                                    break;
                                default:
                                    if (!(child.x instanceof Percent)) {
                                        x = child.pixelX;
                                    }
                                    break;
                            }
                            // vertical alignment
                            switch (child.valign) {
                                case "top":
                                    y = childMarginTop - child.maxTop;
                                    break;
                                case "middle":
                                    y = (innerHeight_1 - childHeight) / 2 - child.maxTop;
                                    break;
                                case "bottom":
                                    y = innerHeight_1 - childMarginBottom - child.maxBottom;
                                    break;
                                default:
                                    if (!(child.y instanceof Percent)) {
                                        y = child.pixelY;
                                    }
                                    break;
                            }
                            break;
                        // vertical layout
                        case "vertical":
                            //if ($type.isNumber(child.relativeHeight)) {
                            //	childHeight = child.maxHeight;
                            //}
                            switch (child.align) {
                                case "left":
                                    x = childMarginLeft - child.maxLeft;
                                    break;
                                case "center":
                                    x = (innerWidth_1 - childWidth) / 2 - child.maxLeft;
                                    break;
                                case "right":
                                    x = innerWidth_1 - childMarginRight - child.maxRight;
                                    break;
                                default:
                                    x = child.pixelX;
                                    break;
                            }
                            y = nextY + childMarginTop - child.maxTop;
                            nextY = y + child.maxBottom + childMarginBottom;
                            break;
                        // horizontal layout
                        case "horizontal":
                            //if ($type.isNumber(child.relativeHeight)) {
                            //	childHeight = child.maxHeight;
                            //}
                            switch (child.valign) {
                                case "top":
                                    y = childMarginTop - child.maxTop;
                                    break;
                                case "middle":
                                    y = (innerHeight_1 - childHeight) / 2 - child.maxTop;
                                    break;
                                case "bottom":
                                    y = innerHeight_1 - childMarginBottom - child.maxBottom;
                                    break;
                                default:
                                    y = child.pixelY;
                                    break;
                            }
                            x = nextX + childMarginLeft - child.maxLeft;
                            nextX = x + child.maxRight + childMarginRight;
                            break;
                        case "grid":
                            x = nextX + childMarginLeft - child.maxLeft;
                            switch (child.valign) {
                                case "top":
                                    y = nextY + childMarginTop - child.maxTop;
                                    break;
                                case "middle":
                                    y = nextY + (innerHeight_1 - childHeight) / 2 - child.maxTop;
                                    break;
                                case "bottom":
                                    y = nextY + innerHeight_1 - childMarginBottom - child.maxBottom;
                                    break;
                                default:
                                    y = nextY - child.maxTop;
                                    break;
                            }
                            nextX += columnWidth[column];
                            rowHeight[row] = $math.max(rowHeight[row], childHeight);
                            column++;
                            var nextColumnWidth = columnWidth[column];
                            if (!$type.isNumber(nextColumnWidth)) {
                                nextColumnWidth = maxCellWidth;
                            }
                            if (nextX > $math.min(this.innerWidth, this.maxWidth) - nextColumnWidth && column < columnCount) {
                                columnCount = column;
                                nextX = 0;
                                nextY = 0;
                                row = 0;
                                column = 0;
                                columnWidth = this.getColumnWidth(columnCount, maxCellWidth);
                                rowHeight = [];
                                i = -1;
                                continue;
                            }
                            if (column >= columnCount) {
                                column = 0;
                                nextY += rowHeight[row];
                                row++;
                                nextX = 0;
                            }
                            break;
                    }
                    if (this.layout !== "none") {
                        child.moveTo({ x: x, y: y });
                    }
                    childLeft = x + child.maxLeft - childMarginLeft;
                    childRight = x + child.maxRight + childMarginRight;
                    childTop = y + child.maxTop - childMarginTop;
                    childBottom = y + child.maxBottom + childMarginBottom;
                    /* not good, maybe leave this for absolute layouts only
                                        if (child.align == "none") {
                                            childLeft += childMarginLeft;
                                            childRight -= childMarginRight;
                                        }

                                        if (child.valign == "none") {
                                            childTop += childMarginTop;
                                            childBottom -= childMarginBottom;
                                        }
                    */
                    if (childRight > right || !$type.isNumber(right)) {
                        right = childRight;
                    }
                    if (childLeft < left || !$type.isNumber(left)) {
                        left = childLeft;
                    }
                    if (childTop < top_1 || !$type.isNumber(top_1)) {
                        top_1 = childTop;
                    }
                    if (childBottom > bottom || !$type.isNumber(bottom)) {
                        bottom = childBottom;
                    }
                    if (childRight > contentRight || !$type.isNumber(contentRight)) {
                        contentRight = childRight;
                    }
                    if (childLeft < contentLeft || !$type.isNumber(contentLeft)) {
                        contentLeft = childLeft;
                    }
                    if (childTop < contentTop || !$type.isNumber(contentTop)) {
                        contentTop = childTop;
                    }
                    if (childBottom > contentBottom || !$type.isNumber(contentBottom)) {
                        contentBottom = contentBottom;
                    }
                }
                else {
                    child.validatePosition();
                }
            }
            if (!$type.isNumber(left)) {
                left = 0;
                contentLeft = 0;
            }
            if (!$type.isNumber(right)) {
                right = this._availableWidth;
                contentRight = right;
            }
            if (!$type.isNumber(top_1)) {
                top_1 = 0;
                contentTop = 0;
            }
            if (!$type.isNumber(bottom)) {
                bottom = this._availableHeight;
                contentBottom = bottom;
            }
            if (!$type.isNumber(contentTop)) {
                contentTop = 0;
            }
            if (!$type.isNumber(contentBottom)) {
                contentBottom = contentTop;
            }
            if (!$type.isNumber(contentLeft)) {
                contentLeft = 0;
            }
            if (!$type.isNumber(contentRight)) {
                contentRight = contentLeft;
            }
            measuredWidth = right - left;
            measuredHeight = bottom - top_1;
            if ($type.isNumber(this.relativeWidth)) {
                measuredWidth = this.maxWidth - this.pixelPaddingLeft - this.pixelPaddingRight;
                left = 0;
                right = measuredWidth;
            }
            if ($type.isNumber(this.relativeHeight)) {
                measuredHeight = this.maxHeight - this.pixelPaddingTop - this.pixelPaddingBottom;
                top_1 = 0;
                bottom = measuredHeight;
            }
            if ($type.isNumber(this._pixelWidth)) {
                left = 0;
                measuredWidth = this._pixelWidth;
            }
            if ($type.isNumber(this.minWidth) && measuredWidth < this.minWidth) {
                left = 0;
                measuredWidth = this.minWidth;
            }
            if ($type.isNumber(this._pixelHeight)) {
                top_1 = 0;
                measuredHeight = this._pixelHeight;
            }
            if ($type.isNumber(this.minHeight) && measuredHeight < this.minHeight) {
                top_1 = 0;
                measuredHeight = this.minHeight;
            }
            var measuredContentWidth = contentRight - contentLeft;
            var measuredContentHeight = contentBottom - contentTop;
            /// handle content alignment
            if (this.layout != "none") {
                var dx_1;
                var dy_1;
                var mwa = measuredWidth;
                var mha = measuredHeight;
                if (mwa < measuredContentWidth) {
                    mwa = measuredContentWidth;
                }
                if (mha < measuredContentHeight) {
                    mha = measuredContentHeight;
                }
                if (this.contentAlign == "center") {
                    dx_1 = (mwa - measuredContentWidth) / 2;
                }
                if (this.contentAlign == "right") {
                    dx_1 = mwa - measuredContentWidth;
                }
                if (this.contentValign == "middle") {
                    dy_1 = (mha - measuredContentHeight) / 2;
                }
                if (this.contentValign == "bottom") {
                    dy_1 = mha - measuredContentHeight;
                }
                if ($type.isNumber(dx_1)) {
                    $iter.each(this.children.iterator(), function (child) {
                        var childLeft = child.maxLeft;
                        var ddx = dx_1;
                        if (_this.layout == "horizontal") {
                            child.x = child.pixelX + ddx;
                        }
                        // individual grid elements can not be aligned vertically, that's why it's different from horizontal
                        if (_this.layout == "grid") {
                            child.x = child.pixelX + ddx;
                        }
                        if (_this.layout == "vertical") {
                            ddx += child.pixelMarginLeft;
                            if (child.align == "none") {
                                child.x = ddx - childLeft;
                            }
                        }
                        if (_this.layout == "absolute") {
                            ddx += child.pixelMarginLeft;
                            if (child.align == "none") {
                                child.x = ddx - childLeft;
                            }
                        }
                    });
                }
                if ($type.isNumber(dy_1)) {
                    $iter.each(this.children.iterator(), function (child) {
                        var childTop = child.maxTop;
                        var ddy = dy_1;
                        if (_this.layout == "horizontal") {
                            ddy += child.pixelMarginTop;
                            if (child.valign == "none") {
                                child.y = ddy - childTop;
                            }
                        }
                        // individual grid elements can not be aligned vertically, that's why it's different from horizontal
                        if (_this.layout == "grid") {
                            ddy += child.pixelMarginTop;
                            child.y = ddy - childTop;
                        }
                        if (_this.layout == "vertical") {
                            child.y = child.pixelY + ddy;
                        }
                        if (_this.layout == "absolute") {
                            ddy += child.pixelMarginTop;
                            if (child.valign == "none") {
                                child.y = ddy - childTop;
                            }
                        }
                    });
                }
            }
            var oldBBox = this.bbox;
            // this will mess up maxw/maxh set by container layout, we need a separate min/maxwidth for users
            // this prevents invalidating layout in such cases as scrolling category axis, when labels go outside bounds and results transformed event
            // todo: need to check if this doesn't cause other problems.
            //if (this.maxWidth > 0) {
            //measuredWidth = $math.min(measuredWidth, this.maxWidth);
            //measuredWidth = $math.max(measuredWidth, this.minWidth);
            //}
            //if (this.maxHeight > 0) {
            //measuredHeight = $math.min(measuredHeight, this.maxHeight);
            //measuredHeight = $math.max(measuredHeight, this.minHeight);
            //}
            measuredWidth = $math.max(measuredWidth, this.minWidth);
            measuredHeight = $math.max(measuredHeight, this.minHeight);
            this.bbox = this.getContainerBBox(left, top_1, measuredWidth, measuredHeight);
            var prevLeft = this.maxLeft;
            var prevTop = this.maxTop;
            var prevBotttom = this.maxBottom;
            var prevRight = this.maxRight;
            this.measure();
            //if (!oldBBox || ($math.round(oldBBox.width, 1) != $math.round(measuredWidth, 1) || $math.round(oldBBox.height, 1) != $math.round(measuredHeight, 1))) {
            if (prevLeft != this.maxLeft || prevRight != this.maxRight || prevTop != this.maxTop || prevBotttom != this.maxBottom) {
                if (this.events.isEnabled("transformed")) {
                    var event_1 = {
                        type: "transformed",
                        target: this
                    };
                    if (oldBBox) {
                        event_1.dummyData = oldBBox.width + " " + measuredWidth + "  " + oldBBox.height + " " + measuredHeight;
                    }
                    this.events.dispatchImmediately("transformed", event_1);
                }
            }
        }
    };
    Container.prototype.getContainerBBox = function (x, y, width, height) {
        if (this.definedBBox) {
            return this.definedBBox;
        }
        else {
            return { x: x, y: y, width: width, height: height };
        }
    };
    Container.prototype.updateCenter = function () {
        _super.prototype.updateCenter.call(this);
        this.updateBackground();
    };
    /**
     * Update the background to fit into specific dimensions.
     *
     * @ignore Exclude from docs
     * @todo Make it protected?
     */
    Container.prototype.updateBackground = function () {
        var background = this._background; // accessing protected, as getter creates instance if it doesn't exist
        if (background) {
            background.x = this.maxLeft;
            background.y = this.maxTop;
            background.width = this.maxRight - this.maxLeft;
            background.height = this.maxBottom - this.maxTop;
            this.group.addToBack(background.group);
        }
    };
    /**
     * Returns widths of all columns in a horizontal Container layout.
     *
     * @ignore Exclude from docs
     * @param  {number}    columnCount   Number of columns
     * @param  {number}    maxCellWidth  Maximum width of one grid cell
     * @return {number[]}                An array of column widths
     */
    Container.prototype.getColumnWidth = function (columnCount, maxCellWidth) {
        var _this = this;
        var columnWidth = [];
        var column = 0;
        $iter.each(this.children.iterator(), function (child) {
            if (child.isMeasured) {
                if (_this.fixedWidthGrid) {
                    columnWidth[column] = maxCellWidth;
                }
                else {
                    columnWidth[column] = $math.max(columnWidth[column], child.measuredWidth + child.pixelMarginRight + child.pixelMarginLeft);
                }
                column++;
                if (column == columnCount) {
                    column = 0;
                }
            }
        });
        return columnWidth;
    };
    Object.defineProperty(Container.prototype, "layout", {
        /**
         * @return {ContainerLayout} Layout
         */
        get: function () {
            return this.getPropertyValue("layout");
        },
        /**
         * Container layout.
         *
         * Options: "absolute" (default), "vertical", "horizontal", "grid", "none". "none" is quite the same as "absolute" - the objects will
         * be positioned at their x, y coordinates, the difference is that with "absolute" you can still use align/valign for children and with "none" you can not.
         * Use "none" as much as you can as it's most cpu-saving layout.
         *
         * @default "absolute"
         * @param {ContainerLayout} value Layout
         */
        set: function (value) {
            if (this.setPropertyValue("layout", value)) {
                this.invalidateLayout();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "contentValign", {
        /**
         * @return {VerticalAlign} Vertical alignment
         */
        get: function () {
            return this._contentValign;
        },
        /**
         * Vertical alignment of the elements for the vertical Container.
         *
         * This is used when Container is larger than the height of all its children.
         *
         * @param {VerticalAlign} value vertical alignment
         */
        set: function (value) {
            this._contentValign = value;
            this.invalidateLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "contentAlign", {
        /**
         * @return {Align} Horizontal alignment
         */
        get: function () {
            return this._contentAlign;
        },
        /**
         * Horizontal alignment of the elements for the horizontal Container.
         *
         * This is used when Container is larger than the height of all its children.
         *
         * @param {Align}  value  Horizontal alignment
         */
        set: function (value) {
            this._contentAlign = value;
            this.invalidateLayout();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "fixedWidthGrid", {
        /**
         * @return {boolean} Should use fixed width grid?
         */
        get: function () {
            return this._fixedWidthGrid;
        },
        /**
         * Controls if the grid of the Container should use fixed width. Fixed width
         * grid will divide available space to all its columns/rows equally, without
         * adapting to actual child sizes or size requirements.
         *
         * @default false
         * @param {boolean}  value  Should use fixed width grid?
         */
        set: function (value) {
            if (this._fixedWidthGrid != value) {
                this._fixedWidthGrid = value;
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if point is within bounds of a container.
     *
     * @param  {IPoint}   point  A coordinate to check
     * @return {boolean}         `true` if it fits within container
     */
    Container.prototype.fitsToBounds = function (point) {
        var x = point.x;
        var y = point.y;
        var deviation = 0.5; // sometimes coordinates are rounded to numbers like .999 so we add deviation here
        if (x >= -deviation && x <= this.pixelWidth + deviation && y >= -deviation && y <= this.pixelHeight + deviation) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Copies all properties from different Container, including background
     * clone.
     *
     * @param {this}  source  Source Container to copy from
     */
    Container.prototype.copyFrom = function (source) {
        var _this = this;
        _super.prototype.copyFrom.call(this, source);
        this.layout = source.layout;
        this.setStateOnChildren = source.setStateOnChildren;
        if (source._background) {
            this.background = source._background.clone();
            this.background.copyFrom(source._background); // won't work without this
        }
        $iter.each(source.children.iterator(), function (child) {
            if (child.shouldClone) {
                var clonedChild = child.clone();
                clonedChild.parent = _this;
            }
        });
    };
    Object.defineProperty(Container.prototype, "preloader", {
        /**
         * @return {Optional<Preloader>} Preloader instance
         */
        get: function () {
            var preloader = this._preloader;
            if (preloader) {
                return preloader;
            }
            else if (this.parent) {
                return this.parent.preloader;
            }
        },
        /**
         * A [[Preloader]] instance to be used when Container is busy.
         *
         * @param {Optional<Preloader>}  preloader  Preloader instance
         */
        set: function (preloader) {
            if (this._preloader) {
                this.removeDispose(this._preloader);
            }
            this._preloader = preloader;
            if (preloader) {
                preloader.parent = this.tooltipContainer;
                this._disposers.push(preloader);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets [[Paper]] instance to use to draw elements.
     *
     * @ignore Exclude from docs
     * @param {Paper}  paper  Paper
     */
    Container.prototype.setPaper = function (paper) {
        _super.prototype.setPaper.call(this, paper);
        $array.each(this._childrenByLayout, function (child) {
            if (child instanceof Container) {
                child.setPaper(paper);
            }
            else {
                child.setPaper(paper);
            }
        });
    };
    /**
     * Removes Container from the system-wide list of invalid Containers.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.removeFromInvalids = function () {
        _super.prototype.removeFromInvalids.call(this);
        $array.remove(registry.invalidLayouts, this);
    };
    /**
     * Sets a [[DataItem]] to be used as data for the Container.
     *
     * @todo Description
     * @param {DataItem} dataItem DataItem
     */
    Container.prototype.setDataItem = function (dataItem) {
        // this place is potentially dangerous, as if we set datItem for some dummy container, all children dataItems will be overriden
        // the main reason for doing this is that we need a setDataItem code to be called for each sprite, otherwise property fields won't be
        // applied. Also, getting dataItem from parent all the time is more expensive than saving value.
        if (this._dataItem != dataItem) {
            $iter.each(this.children.iterator(), function (child) {
                child.dataItem = dataItem;
            });
        }
        _super.prototype.setDataItem.call(this, dataItem);
    };
    /**
     * Measures the element.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.measureElement = function () {
        this.validateLayout();
    };
    /**
     * Returns Tooltip X coordinate if it's set, or middle of the element.
     *
     * @ignore Exclude from docs
     * @return {number} X (px)
     */
    Container.prototype.getTooltipX = function () {
        return _super.prototype.getTooltipX.call(this);
    };
    /**
     * Returns Tooltip Y coordinate if it's set, or middle of the element.
     *
     * @ignore Exclude from docs
     * @return {number} Y (px)
     */
    Container.prototype.getTooltipY = function () {
        return _super.prototype.getTooltipY.call(this);
    };
    Object.defineProperty(Container.prototype, "fontSize", {
        /**
         * @return {any} Font size
         */
        get: function () {
            return this.getPropertyValue("fontSize");
        },
        /**
         * Font size to be used for the text. The size can either be numeric, in
         * pixels, or other measurements.
         *
         * Parts of the text may override this setting using in-line formatting.
         *
         * @param {any} value Font size value
         */
        set: function (value) {
            this.setPropertyValue("fontSize", value, true);
            this.setSVGAttribute({ "font-size": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "fontWeight", {
        /**
         * @return {FontWeight} Font weight
         */
        get: function () {
            return this.getPropertyValue("fontWeight");
        },
        /**
         * Font weight to use for text.
         *
         * Parts of the text may override this setting using in-line formatting.
         *
         * @param {FontWeight} value Font weight
         */
        set: function (value) {
            this.setPropertyValue("fontWeight", value);
            this.setSVGAttribute({ "font-weight": value });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "textDecoration", {
        /**
         * @return {TextDecoration} Decoration
         */
        get: function () {
            return this.getPropertyValue("textDecoration");
        },
        /**
         * A text decoration to use for text.
         *
         * Parts of the text may override this setting using in-line formatting.
         *
         * @param {TextDecoration}  value  Decoration
         */
        set: function (value) {
            this.setPropertyValue("textDecoration", value);
            this.setSVGAttribute({ "text-decoration": value });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Disposes (destroys) the element and all its children.
     */
    Container.prototype.dispose = function () {
        if (this._background) {
            this._background.dispose();
        }
        this.disposeChildren();
        _super.prototype.dispose.call(this);
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
    Container.prototype.setState = function (value, transitionDuration, easing) {
        var stateName = value;
        if (value instanceof SpriteState) {
            stateName = value.name;
        }
        if (this.setStateOnChildren) {
            $iter.each(this.children.iterator(), function (child) {
                child.setState(stateName, transitionDuration, easing);
            });
        }
        if (this._background) {
            this._background.setState(stateName);
        }
        if (this.setStateOnSprites.length) {
            $array.each(this.setStateOnSprites, function (item) {
                item.setState(stateName, transitionDuration, easing);
            });
        }
        return _super.prototype.setState.call(this, value, transitionDuration, easing);
    };
    // otherwise isActive won't work properly with background
    Container.prototype.setActive = function (value) {
        _super.prototype.setActive.call(this, value);
        if (this._background) {
            this._background.isActive = value;
        }
    };
    return Container;
}(Sprite));
export { Container };
//# sourceMappingURL=Container.js.map