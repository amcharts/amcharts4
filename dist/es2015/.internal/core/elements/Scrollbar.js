/**
 * Provides functionality used to build scrollbars.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../Container";
import { ResizeButton } from "../elements/ResizeButton";
import { Button } from "../elements/Button";
import { getInteraction } from "../interaction/Interaction";
import { MouseCursorStyle } from "../interaction/Mouse";
import { RoundedRectangle } from "../elements/RoundedRectangle";
import { registry } from "../Registry";
import { keyboard } from "../utils/Keyboard";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { percent } from "../utils/Percent";
import * as $math from "../utils/Math";
import * as $ease from "../utils/Ease";
import * as $type from "../utils/Type";
import * as $utils from "../utils/Utils";
;
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Scrollbar is a generic control allowing to select a range of values or pan
 * the selection.
 *
 * @see {@link IScrollbarEvents} for a list of available events
 * @see {@link IScrollbarAdapters} for a list of available Adapters
 */
var Scrollbar = /** @class */ (function (_super) {
    tslib_1.__extends(Scrollbar, _super);
    /**
     * Construtor
     */
    function Scrollbar() {
        var _this = _super.call(this) || this;
        /**
         * A value of previously selected lower value, used for doubleclick function.
         *
         * @type {number}
         */
        _this._prevStart = 0;
        /**
         * A value of previously selected upper value, used for doubleclick function.
         *
         * @type {number}
         */
        _this._prevEnd = 1;
        /**
         * Indicates if the Scrollbar is currently "busy" (animating and or
         * performing zoom by user interaction).
         *
         * @type {boolean}
         */
        _this._isBusy = false;
        /**
         * [_skipRangeEvents description]
         *
         * @todo Description
         * @type {boolean}
         */
        _this._skipRangeEvents = false;
        /**
         * Update the selection when dragging the grips.
         *
         * If set to `false` selection will be updated only when the grip is
         * released.
         *
         * @default true
         * @type {boolean}
         */
        _this.updateWhileMoving = true;
        _this.className = "Scrollbar";
        _this.minHeight = 12;
        _this.minWidth = 12;
        _this.animationDuration = 0;
        _this.animationEasing = $ease.cubicOut;
        _this.margin(10, 10, 10, 10);
        var interfaceColors = new InterfaceColorSet();
        // background is also container as it might contain graphs, grid, etc
        var background = _this.background;
        background.cornerRadius(10, 10, 10, 10);
        background.fill = interfaceColors.getFor("fill");
        background.fillOpacity = 0.5;
        _this.startGrip = new ResizeButton();
        _this.endGrip = new ResizeButton();
        // Default orientation...
        // ... is set in `applyInternalDefaults()` because it accesses `language`
        // and should only be started to access when parent is set
        // Set events
        _this.events.on("transformed", _this.updateThumb, _this);
        // Initial positions
        _this.start = 0;
        _this.end = 1;
        // Set roles
        _this.role = "scrollbar";
        _this.thumb.role = "slider";
        _this.thumb.readerLive = "polite";
        _this.startGrip.role = "slider";
        _this.endGrip.role = "slider";
        // otherwise range changed wont' be registered
        _this.events.once("inited", function () {
            _this._previousStart = undefined;
            _this.dispatchRangeChange();
        });
        _this.hideGrips = false;
        _this.orientation = "horizontal";
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    Scrollbar.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        // Set screen reader tetxt accordingly
        if (this.orientation === "horizontal") {
            if (!$type.hasValue(this.readerTitle)) {
                this.readerTitle = this.language.translate("Use TAB to select grip buttons or left and right arrows to change selection");
            }
            if (!$type.hasValue(this.thumb.readerDescription)) {
                this.thumb.readerDescription = this.language.translate("Use left and right arrows to move selection");
            }
            if (!$type.hasValue(this.startGrip.readerDescription)) {
                this.startGrip.readerDescription = this.language.translate("Use left and right arrows to move left selection");
            }
            if (!$type.hasValue(this.endGrip.readerDescription)) {
                this.endGrip.readerDescription = this.language.translate("Use left and right arrows to move right selection");
            }
        }
        else {
            if (!$type.hasValue(this.readerTitle)) {
                this.readerTitle = this.language.translate("Use TAB select grip buttons or up and down arrows to change selection");
            }
            if (!$type.hasValue(this.thumb.readerDescription)) {
                this.thumb.readerDescription = this.language.translate("Use up and down arrows to move selection");
            }
            if (!$type.hasValue(this.startGrip.readerDescription)) {
                this.startGrip.readerDescription = this.language.translate("Use up and down arrows to move upper selection");
            }
            if (!$type.hasValue(this.endGrip.readerDescription)) {
                this.endGrip.readerDescription = this.language.translate("Use up and down arrows to move lower selection");
            }
        }
    };
    /**
     * Validates the layout of the scrollbar's elements.
     *
     * @ignore Exclude from docs
     */
    Scrollbar.prototype.validateLayout = function () {
        this.updateSize();
        _super.prototype.validateLayout.call(this);
        // when size changes, need to update extremes
        this.updateExtremes();
    };
    /**
     * Update background for the scrollbar.
     *
     * @ignore Exclude from docs
     */
    Scrollbar.prototype.processBackground = function () {
        _super.prototype.processBackground.call(this);
        var background = this.background;
        background.clickable = true;
        background.events.on("hit", this.handleBgHit, this);
    };
    /**
     * Zooms to the particular place when clicked/tapped on the scrollbar
     * background.
     *
     * @ignore Exclude from docs
     * @param {ISpriteEvents["hit"]}  event  Event
     */
    Scrollbar.prototype.handleBgHit = function (event) {
        this.makeBusy();
        var point = event.spritePoint;
        point = $utils.spritePointToSprite(point, this.background, this);
        var thumb = this.thumb;
        if (this.orientation == "horizontal") {
            var thumbX = point.x - thumb.pixelWidth / 2;
            thumbX = $math.fitToRange(thumbX, 0, this.innerWidth - thumb.pixelWidth);
            this._thumbAnimation = thumb.animate({ property: "x", to: thumbX }, this.animationDuration, this.animationEasing);
        }
        else {
            var thumbY = point.y - thumb.pixelHeight / 2;
            thumbY = $math.fitToRange(thumbY, 0, this.innerHeight - thumb.pixelHeight);
            this._thumbAnimation = thumb.animate({ property: "y", to: thumbY }, this.animationDuration, this.animationEasing);
        }
        if (this.animationDuration > 0) {
            this._thumbAnimation.events.on("animationended", this.makeUnbusy, this);
        }
        else {
            this._thumb.validate();
            this.makeUnbusy();
        }
    };
    /**
     * Set scrollbar as busy. (currently zooming)
     *
     * @ignore Exclude from docs
     */
    Scrollbar.prototype.makeBusy = function () {
        this._isBusy = true;
        this._skipRangeEvents = false;
        if (this._unbusyTimeout) {
            this.removeDispose(this._unbusyTimeout);
        }
        this._unbusyTimeout = undefined;
        this.stopAnimations();
    };
    /**
     * Stops all animations, currently playing for the scrollbar.
     *
     * @ignore Exclude from docs
     */
    Scrollbar.prototype.stopAnimations = function () {
        if (this._thumbAnimation) {
            this._thumbAnimation.stop(true);
        }
        if (this._zoomAnimation) {
            this._zoomAnimation.stop(true);
        }
    };
    /**
     * Cancels "busy" status of the Scrollbar.
     *
     * @ignore Exclude from docs
     */
    Scrollbar.prototype.makeUnbusy = function () {
        /**
         * We cannot make Scrollbar not busy right after release, because then axes
         * will take over controll and Scrollbar will start to animate.
         * Theorethically, it's not right to set timeout by `animationDuration`,
         * however we can not know all the durations of elements we scroll, so we
         * assume that animation duration will be the same as
         * `interpolationDuration` or `rangeChange` duration.
         */
        this._unbusyTimeout = this.setTimeout(this.makeUnbusyReal.bind(this), this.animationDuration * 1.1);
    };
    /**
     * [makeUnbusyReal description]
     *
     * @todo Description
     * @ignore Exclude from docs
     */
    Scrollbar.prototype.makeUnbusyReal = function () {
        this._usingGrip = undefined;
        this._isBusy = false;
        if (!this.updateWhileMoving) {
            this.dispatchRangeChange();
        }
    };
    /**
     * Disptatches rangechanged event if it really changed
     *
     * @ignore Exclude from docs
     */
    Scrollbar.prototype.dispatchRangeChange = function () {
        if (this._previousEnd != this.end || this._previousStart != this.start) {
            this._previousStart = this.start;
            this._previousEnd = this.end;
            this.dispatch("rangechanged");
        }
    };
    /**
     * Updates the "thumb" element. A draggable element between the grips.
     */
    Scrollbar.prototype.updateThumb = function () {
        if (!this.parent) {
            return;
        }
        var thumb = this.thumb;
        var start = this.start;
        var end = this.end;
        var startGrip = this.startGrip;
        var endGrip = this.endGrip;
        if (this.orientation == "horizontal") {
            var innerWidth_1 = this.innerWidth;
            thumb.width = innerWidth_1 * (end - start);
            thumb.maxX = innerWidth_1 - thumb.pixelWidth;
            thumb.x = start * innerWidth_1;
            startGrip.moveTo({ x: thumb.pixelX, y: 0 }, undefined, undefined, true); // overrides dragging
            endGrip.moveTo({ x: thumb.pixelX + thumb.pixelWidth, y: 0 }, undefined, undefined, true);
            startGrip.readerTitle = this.language.translate("From %1", undefined, this.adapter.apply("positionValue", {
                value: Math.round(start * 100) + "%",
                position: start
            }).value);
            endGrip.readerTitle = this.language.translate("To %1", undefined, this.adapter.apply("positionValue", {
                value: Math.round(end * 100) + "%",
                position: end
            }).value);
        }
        else {
            var innerHeight_1 = this.innerHeight;
            thumb.height = innerHeight_1 * (end - start);
            thumb.maxY = innerHeight_1 - thumb.pixelHeight;
            thumb.y = (1 - end) * innerHeight_1;
            startGrip.moveTo({ x: 0, y: thumb.pixelY + thumb.pixelHeight }, undefined, undefined, true);
            endGrip.moveTo({ x: 0, y: thumb.pixelY }, undefined, undefined, true);
            startGrip.readerTitle = this.language.translate("To %1", undefined, this.adapter.apply("positionValue", {
                value: Math.round((1 - start) * 100) + "%",
                position: (1 - start)
            }).value);
            endGrip.readerTitle = this.language.translate("From %1", undefined, this.adapter.apply("positionValue", {
                value: Math.round((1 - end) * 100) + "%",
                position: (1 - end)
            }).value);
        }
        // Add accessibility
        thumb.readerTitle = this.language.translate("From %1 to %2", undefined, this.adapter.apply("positionValue", {
            value: Math.round(start * 100) + "%",
            position: start
        }).value, this.adapter.apply("positionValue", {
            value: Math.round(end * 100) + "%",
            position: end
        }).value);
        if (!this._skipRangeEvents && this.updateWhileMoving) {
            this.dispatchRangeChange();
        }
    };
    /**
     * Updates extremes of the scrollbar.
     */
    Scrollbar.prototype.updateExtremes = function () {
        var orientation = this.orientation;
        var minX = 0;
        var minY = 0;
        var maxX = 0;
        var maxY = 0;
        if (orientation == "horizontal") {
            maxX = this.innerWidth;
            minY = maxY = this.innerHeight / 2;
        }
        else {
            maxY = this.innerHeight;
            minX = maxX = this.innerWidth / 2;
        }
        var startGrip = this.startGrip;
        startGrip.minX = minX;
        startGrip.maxX = maxX;
        startGrip.minY = minY;
        startGrip.maxY = maxY;
        var endGrip = this.endGrip;
        endGrip.minX = minX;
        endGrip.maxX = maxX;
        endGrip.minY = minY;
        endGrip.maxY = maxY;
        var thumb = this.thumb;
        thumb.minX = minX;
        thumb.maxX = maxX;
        thumb.minY = minY;
        thumb.maxY = maxY;
    };
    /**
     * Updates size of the scrollbar.
     */
    Scrollbar.prototype.updateSize = function () {
        var orientation = this.orientation;
        var startGrip = this.startGrip;
        if (startGrip) {
            startGrip.orientation = orientation;
        }
        if (this.endGrip) {
            this.endGrip.orientation = orientation;
        }
        var thumb = this.thumb;
        if (thumb) {
            if (orientation == "horizontal") {
                if (!$type.isNumber(this._pixelWidth)) {
                    this.width = percent(100);
                }
                // this teorethically might be wrong, if user indeed sets height of a horizontal scrollbar in percent
                // however without this height might be equal to 100% if previous orientation was set to horizontal
                // so this is ok solution, in case user really wants to have scrollbar height set in percent,
                // he should do this after orientation.
                if ($type.hasValue(this.percentHeight)) {
                    this.height = this.minHeight;
                }
                thumb.height = this.innerHeight;
                thumb.verticalCenter = "middle";
                thumb.horizontalCenter = "left";
            }
            else {
                if (!$type.isNumber(this._pixelHeight)) {
                    this.height = percent(100);
                }
                // same as above with percentHeight
                if ($type.hasValue(this.percentWidth)) {
                    this.width = this.minWidth;
                }
                thumb.width = this.innerWidth;
                thumb.verticalCenter = "top";
                thumb.horizontalCenter = "middle";
            }
        }
    };
    Object.defineProperty(Scrollbar.prototype, "start", {
        /**
         * @return {number} Position (0-1)
         */
        get: function () {
            return Math.min(this.getPosition(this._start), this.getPosition(this._end));
        },
        /**
         * ==========================================================================
         * POSITIONS
         * ==========================================================================
         * @hidden
         */
        /**
         * Relative position (0-1) of the start grip.
         *
         * @param {number}  position  Position (0-1)
         */
        set: function (position) {
            if (!this._isBusy) {
                this.__start = position;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "__start", {
        /**
         * @return {number} [description]
         */
        get: function () {
            return this._start;
        },
        /**
         * [__start description]
         *
         * @todo Description
         * @param {number} position [description]
         */
        set: function (position) {
            this._start = this.getPosition(position);
            this.updateThumb();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "end", {
        /**
         * @return {number} Position (0-1)
         */
        get: function () {
            return Math.max(this.getPosition(this._start), this.getPosition(this._end));
        },
        /**
         * Relative position (0-1) of the end grip.
         *
         * @param {number}  position  Position (0-1)
         */
        set: function (position) {
            if (!this._isBusy) {
                this.__end = position;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "__end", {
        /**
         * @return {number} [description]
         */
        get: function () {
            return this._end;
        },
        /**
         * [__end description]
         *
         * @todo Description
         * @param {number} position [description]
         */
        set: function (position) {
            this._end = this.getPosition(position);
            this.updateThumb();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "range", {
        /**
         * Current selection range.
         *
         * @readonly
         * @return {IRange} Range
         */
        get: function () {
            return { start: this.start, end: this.end, priority: this._usingGrip };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Disables range change events.
     *
     * @ignore Exclude from docs
     */
    Scrollbar.prototype.skipRangeEvents = function () {
        if (!this._isBusy) {
            this._skipRangeEvents = true;
        }
    };
    /**
     * [fixRange description]
     *
     * @todo Description
     * @ignore Exclude from docs
     * @param {IRange}  range  Range
     */
    Scrollbar.prototype.fixRange = function (range) {
        if (range.start != $math.round(this._start, 2) || range.end != $math.round(this._end, 2)) {
            this._start = range.start;
            this._end = range.end;
            this._skipRangeEvents = true;
            this.updateThumb();
            this._skipRangeEvents = false;
            this.thumb.validate();
        }
    };
    /**
     * [getPosition description]
     *
     * @todo Description
     * @param  {number}  position  [description]
     * @return {number}            [description]
     */
    Scrollbar.prototype.getPosition = function (position) {
        return $math.fitToRange($math.round(position, 4), 0, 1);
    };
    Object.defineProperty(Scrollbar.prototype, "orientation", {
        /**
         * @return {Orientation} Orientation
         */
        get: function () {
            return this.getPropertyValue("orientation");
        },
        /**
         * ==========================================================================
         * MISC
         * ==========================================================================
         * @hidden
         */
        /**
         * Orientation of the scrollbar.
         *
         * Available options: "horizontal" (default) and "vertical".
         *
         * @default "horizontal"
         * @param {Orientation}  value  Orientation
         */
        set: function (value) {
            if (this.setPropertyValue("orientation", value)) {
                // Set mouse cursors and screen reader tetxt accordingly
                if (value === "horizontal") {
                    // Mouse styles
                    this.startGrip.cursorOverStyle = MouseCursorStyle.horizontalResize;
                    this.endGrip.cursorOverStyle = MouseCursorStyle.horizontalResize;
                    // Reader text
                    /*this.readerTitle = this.language.translate("Use TAB to select grip buttons or left and right arrows to change selection");
                    this.thumb.readerDescription = this.language.translate("Use left and right arrows to move selection");
                    this.startGrip.readerDescription = this.language.translate("Use left and right arrows to move left selection");
                    this.endGrip.readerDescription = this.language.translate("Use left and right arrows to move right selection");*/
                }
                else {
                    // Mouse styles
                    this.startGrip.cursorOverStyle = MouseCursorStyle.verticalResize;
                    this.endGrip.cursorOverStyle = MouseCursorStyle.verticalResize;
                    // Reader text
                    /*this.readerTitle = this.language.translate("Use TAB select grip buttons or up and down arrows to change selection");
                    this.thumb.readerDescription = this.language.translate("Use up and down arrows to move selection");
                    this.startGrip.readerDescription = this.language.translate("Use up and down arrows to move upper selection");
                    this.endGrip.readerDescription = this.language.translate("Use up and down arrows to move lower selection");*/
                }
                this.updateByOrientation();
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @ignore
     */
    Scrollbar.prototype.updateByOrientation = function () {
    };
    Object.defineProperty(Scrollbar.prototype, "startGrip", {
        /**
         * @return {ResizeButton} Grip element
         */
        get: function () {
            return this._startGrip;
        },
        /**
         * ==========================================================================
         * GRIPS
         * ==========================================================================
         * @hidden
         */
        /**
         * Start grip element. (button)
         *
         * @param {ResizeButton}  button  Grip element
         */
        set: function (button) {
            if (this._startGrip) {
                this.removeDispose(this._startGrip);
            }
            this._startGrip = button;
            this.processGrip(button);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "endGrip", {
        /**
         * @return {ResizeButton} Grip element
         */
        get: function () {
            return this._endGrip;
        },
        /**
         * End grip element. (button)
         *
         * @param {ResizeButton}  button  Grip element
         */
        set: function (button) {
            if (this._endGrip) {
                this.removeDispose(this._endGrip);
            }
            this._endGrip = button;
            this.processGrip(button);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Decorates the grip button with properties and events.
     *
     * @ignore Exclude from docs
     * @param {ResizeButton} button Grip button
     */
    Scrollbar.prototype.processGrip = function (button) {
        button.parent = this;
        button.isMeasured = false;
        button.focusable = true;
        // Set button defaults
        button.showSystemTooltip = true;
        button.zIndex = 100;
        button.events.on("drag", this.handleGripDrag, this);
        button.events.on("dragstop", this.makeUnbusy, this);
        button.events.on("down", this.makeBusy, this);
        this._disposers.push(button);
    };
    /**
     * Updates positions of related elements after grip element is dragged.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<ResizeButton, ISpriteEvents>["drag"]}  event  Event
     */
    Scrollbar.prototype.handleGripDrag = function (event) {
        this.makeBusy();
        if (event.target === this._startGrip) {
            this._usingGrip = "start";
        }
        else {
            this._usingGrip = "end";
        }
        if (this.orientation == "horizontal") {
            this._start = this.startGrip.pixelX / this.innerWidth;
            this._end = this.endGrip.pixelX / this.innerWidth;
        }
        else {
            this._start = 1 - this.startGrip.pixelY / this.innerHeight;
            this._end = 1 - this.endGrip.pixelY / this.innerHeight;
        }
        this.updateThumb();
    };
    Object.defineProperty(Scrollbar.prototype, "thumb", {
        /**
         * @return {RoundedRectangle} Thumb element
         */
        get: function () {
            if (!this._thumb) {
                // Create scrollbar controls (setters will handle adding disposers)
                var thumb = new Button();
                thumb.background.cornerRadius(10, 10, 10, 10);
                thumb.padding(0, 0, 0, 0);
                this.thumb = thumb;
            }
            return this._thumb;
        },
        /**
         * A "thumb" element.
         *
         * It's a draggable square space between the grips, that can be used to
         * pan the seleciton.
         *
         * @param {RoundedRectangle}  thumb  Thumb element
         */
        set: function (thumb) {
            var _this = this;
            if (thumb) {
                if (this._thumb) {
                    this.removeDispose(this._thumb);
                }
                this._thumb = thumb;
                thumb.parent = this;
                thumb.isMeasured = false;
                thumb.inert = true;
                thumb.draggable = true;
                thumb.clickable = true;
                thumb.hoverable = true;
                thumb.focusable = true;
                thumb.zIndex = 0;
                // TODO remove closures ?
                // Add events
                // Add cursor styles to thumb
                thumb.cursorOverStyle = MouseCursorStyle.grab;
                thumb.cursorDownStyle = MouseCursorStyle.grabbing;
                thumb.events.on("dragstart", this.makeBusy, this);
                thumb.events.on("dragstop", this.makeUnbusy, this);
                thumb.events.on("positionchanged", this.handleThumbPosition, this);
                thumb.events.on("sizechanged", this.handleThumbPosition, this);
                thumb.events.on("doublehit", this.handleDoubleClick, this);
                // Add event for space and ENTER to toggle full zoom out and back
                // (same as doubleclick)
                this._disposers.push(getInteraction().body.events.on("keyup", function (ev) {
                    if (keyboard.isKey(ev.event, ["space", "enter"]) && _this.thumb.isFocused) {
                        ev.event.preventDefault();
                        _this.handleDoubleClick();
                    }
                }));
                this._disposers.push(this._thumb);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Zooms-in and out the selection on double-click of the thumb.
     *
     * @ignore Exclude from docs
     */
    Scrollbar.prototype.handleDoubleClick = function () {
        this.makeBusy();
        var newStart = 0;
        var newEnd = 1;
        if (this.start != 0 || this.end != 1) {
            this._prevStart = this.start;
            this._prevEnd = this.end;
        }
        else {
            newStart = this._prevStart;
            newEnd = this._prevEnd;
        }
        var zoomAnimation = this.animate([{ property: "__start", to: newStart }, { property: "__end", to: newEnd }], this.animationDuration, this.animationEasing);
        if (zoomAnimation && !zoomAnimation.isFinished()) {
            zoomAnimation.events.on("animationended", this.makeUnbusy, this);
            this._zoomAnimation = zoomAnimation;
        }
        else {
            this.makeUnbusy();
        }
    };
    /**
     * Updates positions of other elements when thumb is moved.
     *
     * @ignore Exclude from docs
     */
    Scrollbar.prototype.handleThumbPosition = function () {
        var thumb = this.thumb;
        if (this.orientation == "horizontal") {
            var innerWidth_2 = this.innerWidth;
            var w = thumb.innerWidth;
            var x = thumb.pixelX;
            this._start = x / innerWidth_2;
            this._end = (x + w) / innerWidth_2;
            this.updateThumb();
        }
        else {
            var innerHeight_2 = this.innerHeight;
            var h = thumb.innerHeight;
            var y = thumb.pixelY;
            this._start = 1 - (y + h) / innerHeight_2;
            this._end = 1 - y / innerHeight_2;
            this.updateThumb();
        }
    };
    /**
     * Creates a background element for the scrollbar.
     *
     * @ignore Exclude from docs
     * @return {RoundedRectangle} Background
     */
    Scrollbar.prototype.createBackground = function () {
        return new RoundedRectangle();
    };
    Object.defineProperty(Scrollbar.prototype, "hideGrips", {
        /**
         * @return {boolean} Show only on hover?
         */
        get: function () {
            return this._hideGrips;
        },
        /**
         * Use this property to set whether grips should be always visible (`false`),
         * or they should just appear on scrollbar hover (`true`).
         *
         * @param {boolean}  value  Show only on hover?
         */
        set: function (value) {
            var _this = this;
            this._hideGrips = value;
            if (this._overDisposer) {
                this.removeDispose(this._overDisposer);
            }
            if (this._outDisposer) {
                this.removeDispose(this._outDisposer);
            }
            if (value) {
                this._overDisposer = this.events.on("over", function () {
                    _this.startGrip.show();
                    _this.endGrip.show();
                });
                this._outDisposer = this.events.on("out", function () {
                    _this.startGrip.hide();
                    _this.endGrip.hide();
                });
                this.startGrip.hide();
                this.endGrip.hide();
            }
            else {
                this.startGrip.show();
                this.endGrip.show();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "animationDuration", {
        /**
         * @return {PointerOrientation} Orientation
         */
        get: function () {
            return this.getPropertyValue("animationDuration");
        },
        /**
         * Duration in milliseconds of scrollbar animation (happens when user clicks on a background of a scrollbar)
         * @default 0
         * @param {number} value number
         */
        set: function (value) {
            this.setPropertyValue("animationDuration", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scrollbar.prototype, "animationEasing", {
        /**
         * @return {Function}
         */
        get: function () {
            return this.getPropertyValue("animationEasing");
        },
        /**
         * Animation easing function.
         * @todo: review description and default
         * @default $ease.cubicOut
         * @param {Function}  value (value: number) => number
         */
        set: function (value) {
            this.setPropertyValue("animationEasing", value);
        },
        enumerable: true,
        configurable: true
    });
    return Scrollbar;
}(Container));
export { Scrollbar };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Scrollbar"] = Scrollbar;
//# sourceMappingURL=Scrollbar.js.map