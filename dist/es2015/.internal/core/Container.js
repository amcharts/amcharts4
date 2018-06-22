/**
 * Container module
 * @todo Needs description
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "./Sprite";
import { SpriteState } from "./SpriteState";
import { List } from "./utils/List";
import { Rectangle } from "./elements/Rectangle";
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
    __extends(Container, _super);
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
         * Indicates if this container contains any focused elements, including
         * itself.
         *
         * @type {boolean}
         */
        _this.hasFocused = false;
        /**
         * Specifies if, when state is applied on this container, the same state should be applied to container's children
         * @type {boolean}
         */
        _this.setStateOnChildren = false;
        /*
         * @ignore
         */
        _this._containerOverflowX = 0;
        /*
         * @ignore
         */
        _this._containerOverflowY = 0;
        /*
         * @ignore
         */
        _this.layoutInvalid = false;
        _this.className = "Container";
        _this.element = _this.paper.addGroup("g");
        _this.pixelPerfect = false;
        _this._positionPrecision = 4;
        _this.group.add(_this.element);
        _this.layout = "absolute";
        _this._fixedWidthGrid = false;
        _this.ignoreOverflow = false;
        _this.verticalCenter = "top";
        _this.horizontalCenter = "left";
        _this.children.events.on("insert", _this.handleChildAdded, _this);
        _this.children.events.on("remove", _this.handleChildRemoved, _this);
        _this.applyTheme();
        return _this;
    }
    /**
     * Handles adding of a new child into `children`. Adding new children might
     * affect the whole layout so it needs to be revalidated.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Sprite>["insert"]} event Event object
     * @todo Throw an exception on adding a disposed object. Of course it's better NOT TO add disposed objects, so that what we should focus on.
     */
    Container.prototype.handleChildAdded = function (event) {
        var child = event.newValue;
        // Do not add disposed objects
        if (child.isDisposed()) {
            console.log("Added to children a disposed object!");
            return;
        }
        if (this.element) {
            var group = this.element;
            group.add(child.group);
        }
        // TODO this is hacky
        if (!$type.hasValue(child._childAddedDisposer)) {
            // it's not enough to listen to POSITION_CHANGED only, as some extra redrawals will happen.
            child._childAddedDisposer = child.events.on("transformed", this.handleChildTransform, this);
            //@todo: temporary commenting this because of error it causes when I add contents Container in AxisRange constructor. this._disposers.push((<any>child)._childAddedDisposer);
        }
        this.invalidate();
        this.invalidateLayout();
    };
    /**
     * Handles child removal. Changing size of the child may change the
     * whole layout of the Container, hence layout needs to be invalidated.
     *
     * @ignore Exclude from docs
     * @param {IListEvents<Sprite>["remove"]} event Event object
     */
    Container.prototype.handleChildRemoved = function (event) {
        var child = event.oldValue;
        // TODO figure out why this is sometimes undefined
        // TODO this is hacky
        if ($type.hasValue(child._childAddedDisposer)) {
            this.removeDispose(child._childAddedDisposer);
            //(<any>child)._childAddedDisposer.dispose();
            delete child._childAddedDisposer;
        }
        if (this.element) {
            var group = this.element;
            group.removeElement(child.group);
        }
        if (child.isMeasured) {
            this.invalidateLayout();
        }
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
        if (child.isMeasured) {
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
        //this.validateLayout();
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
        this.sortChildren();
        $array.each(this._childrenByLayout, function (child) {
            if (child.invalid) {
                child.invalidate(); // this sorts invalid components in correct order
            }
        });
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
        this.sortChildren();
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
            var _this = this;
            // @todo Review if we can add all children to disposers
            if (!this._children) {
                this._children = new List();
                this._children.events.on("insert", function (event) {
                    _this.dispatchImmediately("childadded", { type: "childadded", newValue: event.newValue });
                });
                this._children.events.on("insert", function (event) {
                    _this.dispatchImmediately("childremoved", { type: "childremoved", newValue: event.newValue });
                });
                //this._disposers.push(new ListDisposer(this._children));
            }
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "minWidth", {
        /**
         * Retruns current minimum width. (px)
         *
         * @return {Optional<number>} Width (px)
         */
        get: function () {
            return this.getPropertyValue("minWidth");
        },
        /**
         * Sets minimum width (px) for the Container. A container will not
         * auto-shrink beyond this value, even if child elements are smaller.
         *
         * @param {Optional<number>} value Width (px)
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
         * Retruns current minimum height. (px)
         *
         * @return {Optional<number>} Height (px)
         */
        get: function () {
            return this.getPropertyValue("minHeight");
        },
        /**
         * Sets minimum height (px) for the Container. A container will not
         * auto-shrink beyond this value, even if child elements are smaller.
         * @param {Optional<number>} value Height (px)
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
         * Retruns current maximum width. (px)
         *
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
         * Sets maximum width (px) for the Container. A container will not
         * grow beyond this value, even if child elements do not fit.
         *
         * @param {Optional<number>} value Width (px)
         */
        set: function (value) {
            if (this.setPropertyValue("maxWidth", value)) {
                if ($type.isNumber(this.relativeWidth)) {
                    this.invalidateLayout();
                }
                this.dispatchImmediately("maxsizechanged");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "maxHeight", {
        /**
         * Retruns current maximum height. (px)
         *
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
         * Sets maximum height (px) for the Container. A container will not
         * grow beyond this value, even if child elements do not fit.
         *
         * @param {Optional<number>} value Height (px)
         */
        set: function (value) {
            if (this.setPropertyValue("maxHeight", value)) {
                if ($type.isNumber(this.relativeHeight)) {
                    this.invalidateLayout();
                }
                this.dispatchImmediately("maxsizechanged");
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initiates drawing of this element.
     *
     * @ignore Exclude from docs
     */
    Container.prototype.draw = function () {
        //this.validateLayout();
        this.addChildren();
        _super.prototype.draw.call(this);
    };
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
     * @param {Sprite[]}  children  Container's children (elements)
     */
    Container.prototype.sortChildren = function (children) {
        var _this = this;
        if (children) {
            var length_1 = children.length;
            for (var i = 0; i < length_1; ++i) {
                var child = children[i];
                // TODO don't do anything if the indexes are the same ?
                if (this.children.indexOf(child) != -1) {
                    this.children.moveValue(child, i);
                }
            }
        }
        this._childrenByLayout = [];
        if (this.layout == "none" || this.layout == "absolute" || !this.layout) {
            $iter.each(this.children.iterator(), function (child) {
                _this._childrenByLayout.push(child);
            });
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
        this.sortChildren();
        // add it to parent
        if (this.element) {
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
                    if (_this.layout == "horizontal") { // || this.layout == "absolute") { // not sure about absolute, but works well in cases like small map
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
                    if (_this.layout == "vertical") { //  || this.layout == "absolute") { // not sure about absolute, but works well in cases like small map
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
                                    if (child.ignoreOverflow) {
                                        _this._availableWidth -= child.overflowX;
                                    }
                                }
                            }
                        }
                        // reduce available height if this is vertical layout
                        if (_this.layout == "vertical") {
                            if (!$type.isNumber(child.percentHeight)) {
                                if (child.measuredHeight > 0) {
                                    _this._availableHeight -= child.measuredHeight + child.pixelMarginTop + child.pixelMarginBottom;
                                    if (child.ignoreOverflow) {
                                        _this._availableHeight -= child.overflowY;
                                    }
                                }
                            }
                        }
                        measuredWidth = Math.max(measuredWidth, child.measuredWidth);
                        measuredHeight = Math.max(measuredHeight, child.measuredHeight);
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
        // this is needed in case we have some children which we have to valign to, for example, center
        this._measuredWidth = measuredWidth + this.pixelPaddingLeft + this.pixelPaddingRight;
        this._measuredHeight = measuredHeight + this.pixelPaddingTop + this.pixelPaddingBottom;
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
            var left = void 0;
            var right = void 0;
            var top_1;
            var bottom = void 0;
            var nextX = 0;
            var nextY = 0;
            var row = 0;
            var column = 0;
            var columnWidth = [];
            var rowHeight = [];
            var maxCellWidth = void 0;
            var minCellWidth = void 0;
            var columnCount = void 0;
            var paddingLeft = this.pixelPaddingLeft;
            var paddingRight = this.pixelPaddingRight;
            var paddingTop = this.pixelPaddingTop;
            var paddingBottom = this.pixelPaddingBottom;
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
            var innerWidth_1 = $math.max(this.innerWidth, this._measuredWidth - paddingLeft - paddingRight);
            var innerHeight_1 = $math.max(this.innerHeight, this._measuredHeight - paddingTop - paddingBottom);
            var containerOverflowX = void 0;
            var containerOverflowY = void 0;
            // we itterate through array of children
            // TODO use iterator instead
            for (var i = 0, len = this.children.length; i < len; i++) {
                var child = this.children.getIndex(i);
                var x = undefined; // must reset
                var y = undefined; // must reset
                var childOverflowX = child.overflowX;
                var childOverflowY = child.overflowY;
                var childMarginLeft = child.pixelMarginLeft;
                var childMarginRight = child.pixelMarginRight;
                var childMarginTop = child.pixelMarginTop;
                var childMarginBottom = child.pixelMarginBottom;
                // this is not good, as if we rotate sprite, it gets incorrect
                //	let childWidth: number = Math.min(child.pixelWidth, child.measuredWidth);
                //	let childHeight: number = Math.min(child.pixelHeight, child.measuredHeight);
                var childWidth = child.measuredWidth;
                var childHeight = child.measuredHeight;
                if (child.isMeasured && !child.disabled && !child.__disabled) {
                    switch (this.layout) {
                        // absolute layout
                        case "absolute":
                            // horizontal alignment
                            switch (child.align) {
                                case "left":
                                    x = child.pixelMarginLeft - childOverflowX;
                                    break;
                                case "center":
                                    x = (innerWidth_1 - childWidth) / 2 - childOverflowX;
                                    break;
                                case "right":
                                    x = innerWidth_1 - childWidth - childMarginRight - childOverflowX;
                                    break;
                            }
                            // vertical alignment
                            switch (child.valign) {
                                case "top":
                                    y = childMarginTop - childOverflowY;
                                    break;
                                case "middle":
                                    y = (innerHeight_1 - childHeight) / 2 - childOverflowY;
                                    break;
                                case "bottom":
                                    y = innerHeight_1 - childHeight - childMarginBottom - childOverflowY;
                                    break;
                            }
                            break;
                        // vertical layout
                        case "vertical":
                            if ($type.isNumber(child.relativeHeight)) {
                                childHeight = child.maxHeight;
                            }
                            if (child.ignoreOverflow) {
                                if (!$type.isNumber(child.relativeHeight)) {
                                    childHeight += childOverflowY;
                                }
                                childOverflowX = 0;
                                childOverflowY = 0;
                            }
                            switch (child.align) {
                                case "left":
                                    x = childMarginLeft - childOverflowX;
                                    break;
                                case "center":
                                    x = (innerWidth_1 - childWidth) / 2 - childOverflowX;
                                    break;
                                case "right":
                                    x = innerWidth_1 - childWidth - childMarginRight - childOverflowX;
                                    break;
                            }
                            y = nextY - childOverflowY + childMarginTop;
                            nextY = childHeight + y + childOverflowY + childMarginBottom;
                            break;
                        // horizontal layout
                        case "horizontal":
                            if ($type.isNumber(child.relativeHeight)) {
                                childHeight = child.maxHeight;
                            }
                            if (child.ignoreOverflow) {
                                if (!$type.isNumber(child.relativeWidth)) {
                                    childWidth += childOverflowX;
                                }
                                childOverflowX = 0;
                                childOverflowY = 0;
                            }
                            switch (child.valign) {
                                case "top":
                                    y = child.pixelMarginTop - childOverflowY;
                                    break;
                                case "middle":
                                    y = (innerHeight_1 - childHeight) / 2 - childOverflowY;
                                    break;
                                case "bottom":
                                    y = innerHeight_1 - childHeight - childMarginBottom - childOverflowY;
                                    break;
                            }
                            x = nextX - childOverflowX + childMarginLeft;
                            nextX = x + childWidth + childOverflowX + childMarginRight;
                            break;
                        case "grid":
                            x = nextX - childOverflowX + childMarginLeft;
                            y = nextY - childOverflowY + childMarginTop;
                            switch (child.valign) {
                                case "top":
                                    y = nextY + child.pixelMarginTop - childOverflowY;
                                    break;
                                case "middle":
                                    y = nextY + (innerHeight_1 - childHeight) / 2 - childOverflowY;
                                    break;
                                case "bottom":
                                    y = nextY + innerHeight_1 - childHeight - childMarginBottom - childOverflowY;
                                    break;
                            }
                            nextX += columnWidth[column];
                            rowHeight[row] = $math.max(rowHeight[row], childHeight);
                            column++;
                            var nextColumnWidth = columnWidth[column];
                            if (!$type.isNumber(nextColumnWidth)) {
                                nextColumnWidth = maxCellWidth;
                            }
                            // here we reduce number of columns
                            if (nextX > this.maxWidth - nextColumnWidth && column < columnCount) {
                                columnCount = column - 1; // cause we added one and we need current item to go to next row
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
                    // NaN is handled by setter
                    child.moveTo({ x: x, y: y });
                    var childLeft = child.pixelX + childOverflowX;
                    var childRight = child.pixelX + childWidth + childOverflowX;
                    var childTop = child.pixelY + childOverflowY;
                    var childBottom = child.pixelY + childHeight + childOverflowY;
                    childLeft -= child.pixelMarginLeft;
                    childRight += child.pixelMarginRight;
                    childTop -= child.pixelMarginTop;
                    childBottom += child.pixelMarginBottom;
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
                    measuredWidth = right - left;
                    measuredHeight = bottom - top_1;
                    containerOverflowX = $math.min(containerOverflowX, childLeft);
                    containerOverflowY = $math.min(containerOverflowY, childTop);
                }
            }
            this._containerOverflowX = containerOverflowX;
            this._containerOverflowY = containerOverflowY;
            innerWidth_1 = $math.max(innerWidth_1, measuredWidth);
            innerHeight_1 = $math.max(innerHeight_1, measuredHeight);
            /// handle content alignment
            var dx_1;
            var dy_1;
            if (this.contentAlign == "left") {
                dx_1 = 0;
            }
            if (this.contentAlign == "center") {
                dx_1 = (innerWidth_1 - measuredWidth) / 2;
            }
            if (this.contentAlign == "right") {
                dx_1 = innerWidth_1 - measuredWidth;
            }
            if (this.contentValign == "top") {
                dy_1 = 0;
            }
            if (this.contentValign == "middle") {
                dy_1 = (innerHeight_1 - measuredHeight) / 2;
            }
            if (this.contentValign == "bottom") {
                dy_1 = innerHeight_1 - measuredHeight;
            }
            if ($type.isNumber(dx_1)) {
                $iter.each(this.children.iterator(), function (child) {
                    var childOverflowX = child.overflowX;
                    var ddx = dx_1;
                    if (child.ignoreOverflow) {
                        childOverflowX = 0;
                    }
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
                            child.x = ddx - childOverflowX;
                        }
                    }
                    if (_this.layout == "absolute") {
                        ddx += child.pixelMarginLeft;
                        if (child.align == "none") {
                            child.x = ddx - childOverflowX;
                        }
                    }
                });
            }
            if ($type.isNumber(dy_1)) {
                $iter.each(this.children.iterator(), function (child) {
                    var childOverflowY = child.overflowY;
                    var ddy = dy_1;
                    if (child.ignoreOverflow) {
                        childOverflowY = 0;
                    }
                    if (_this.layout == "horizontal") {
                        ddy += child.pixelMarginTop;
                        if (child.valign == "none") {
                            child.y = ddy - childOverflowY;
                        }
                    }
                    // individual grid elements can not be aligned vertically, that's why it's different from horizontal
                    if (_this.layout == "grid") {
                        ddy += child.pixelMarginTop;
                        child.y = ddy - childOverflowY;
                    }
                    if (_this.layout == "vertical") {
                        child.y = child.pixelY + ddy;
                    }
                    if (_this.layout == "absolute") {
                        ddy += child.pixelMarginTop;
                        if (child.valign == "none") {
                            child.y = ddy - childOverflowY;
                        }
                    }
                });
            }
            var oldBBox = this._bbox;
            measuredWidth = $math.round($math.max(measuredWidth, this.innerWidth), 1);
            measuredHeight = $math.round($math.max(measuredHeight, this.innerHeight), 1);
            // experimental
            // this prevents invalidating layout in such cases as scrolling category axis, when labels go outside bounds and results transformed event
            // todo: need to check if this doesn't cause other problems.
            if (this.maxWidth > 0) {
                measuredWidth = $math.min(measuredWidth, this.maxWidth);
                measuredWidth = $math.max(measuredWidth, this.minWidth);
            }
            if (this.maxHeight > 0) {
                measuredHeight = $math.min(measuredHeight, this.maxHeight);
                measuredHeight = $math.max(measuredHeight, this.minHeight);
            }
            this._bbox = { x: 0, y: 0, width: measuredWidth, height: measuredHeight };
            this.updateBackground(measuredWidth, measuredHeight);
            this.measure();
            if (!oldBBox || (oldBBox.width != measuredWidth || oldBBox.height != measuredHeight)) {
                // temp
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
    /**
     * Update the background to fit into specific dimensions.
     *
     * @ignore Exclude from docs
     * @todo Make it protected?
     * @param {number} measuredWidth  Wdith (px)
     * @param {number} measuredHeight Height (px)
     */
    Container.prototype.updateBackground = function (measuredWidth, measuredHeight) {
        var background = this._background; // accessing protected, as getter creates instance if it doesn't exist
        if (background) {
            if ($type.isNumber(this.relativeWidth)) {
                background.width = this.maxWidth;
            }
            else {
                background.width = measuredWidth + this.pixelPaddingLeft + this.pixelPaddingRight;
            }
            if ($type.isNumber(this.relativeHeight)) {
                background.height = this.maxHeight;
            }
            else {
                background.height = measuredHeight + this.pixelPaddingTop + this.pixelPaddingBottom;
            }
            background.x = this.overflowX;
            background.y = this.overflowY;
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
         * @return {VerticalAlign} Vertical alignement
         */
        get: function () {
            return this._contentValign;
        },
        /**
         * Vertical alignement of the elements for the vertical Container.
         *
         * This is used when Container is larger than the height of all its children.
         *
         * @param {VerticalAlign} value vertical alignement
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
         * @return {Align} Horizontal alignement
         */
        get: function () {
            return this._contentAlign;
        },
        /**
         * Horizontal alignement of the elements for the horizontal Container.
         *
         * This is used when Container is larger than the height of all its children.
         *
         * @param {Align}  value  Horizontal alignement
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
    };
    /**
     * Returns Tooltip X coordinate if it's set, or middle of the element.
     *
     * @ignore Exclude from docs
     * @return {number} X (px)
     */
    Container.prototype.getTooltipX = function () {
        return _super.prototype.getTooltipX.call(this) + this._containerOverflowX;
    };
    /**
     * Returns Tooltip Y coordinate if it's set, or middle of the element.
     *
     * @ignore Exclude from docs
     * @return {number} Y (px)
     */
    Container.prototype.getTooltipY = function () {
        return _super.prototype.getTooltipY.call(this) + this._containerOverflowY;
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
         * pxels, or other measurements.
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
        return _super.prototype.setState.call(this, value, transitionDuration, easing);
    };
    return Container;
}(Sprite));
export { Container };
//# sourceMappingURL=Container.js.map