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
import { BaseObjectEvents } from "./Base";
import { EventDispatcher } from "./utils/EventDispatcher";
import { Container } from "./Container";
import { SVGContainer } from "./rendering/SVGContainer";
import { Component } from "./Component";
import { Paper } from "./rendering/Paper";
import { raf } from "./utils/AsyncPending";
import { TextFormatter } from "./formatters/TextFormatter";
import { animations } from "./utils/Animation";
import { Tooltip } from "./elements/Tooltip";
import { Preloader } from "./elements/Preloader";
import { triggerIdle } from "./utils/AsyncPending";
import * as $dom from "./utils/DOM";
import * as $array from "./utils/Array";
import { percent } from "./utils/Percent";
import { FocusFilter } from "./rendering/filters/FocusFilter";
import { AmChartsLogo } from "./elements/AmChartsLogo";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * The main class that handles system-wide tasks, like caching, heartbeats, etc.
 * @important
 */
var System = /** @class */ (function (_super) {
    __extends(System, _super);
    /**
     * Constructor
     */
    function System() {
        var _this = _super.call(this) || this;
        /**
         * All currently applied themes. All new chart instances created will
         * automatically inherit and retain System's themes.
         *
         * @type {ITheme}
         */
        _this.themes = [];
        /**
         * List of all loaded available themes.
         *
         * Whenever a theme loads, it registers itself in System's `loadedThemes`
         * collection.
         */
        _this.loadedThemes = {};
        /**
         * An indeternal counter used to generate unique IDs.
         *
         * @ignore Exclude from docs
         * @type {number}
         */
        _this._uidCount = 0;
        /**
         * Console output enabled.
         *
         * @type {boolean}
         */
        _this.verbose = true;
        /**
         * Invalid sizes
         * @rodo Remove commented code
         */
        //public invalidSizes: Array<Sprite>;
        /**
         * Number of times per second charts will be updated.
         *
         * This means that each time an element is invalidated it will wait for the
         * next cycle to be re-validated, and possibly redrawn.
         *
         * This happens every `1000 / frameRate` milliseconds.
         *
         * Reducing this number may reduce the load on the CPU, but might slightly
         * reduce smoothness of the animations.
         *
         * @type {number}
         */
        _this.frameRate = 60;
        /**
         * Number of times per second component container is measured.
         *
         * It is not wise to measure container as often as `frameRate`, as this would
         * use a lot of CPU when resizing window.
         *
         * @type {number}
         */
        _this.measureRate = 10;
        /**
         * @todo Description
         * @ignore Exclude from docs
         * @private
         * @type {number}
         */
        _this.measureCounter = 0;
        /**
         * amCharts will add `class` property to some elements. All those class names
         * will be prefixed by `classNamePrefix`.
         *
         * @type {string}
         */
        _this.classNamePrefix = "amcharts-";
        /**
         * @todo Description
         * @todo Needed?
         * @ignore Exclude from docs
         * @type {number}
         */
        _this.dummyCounter = 0;
        /**
         * Keeps register of class references so that they can be instnatiated using
         * string key.
         *
         * @ignore Exclude from docs
         */
        _this.registeredClasses = {};
        /**
         * @ignore
         */
        _this.commercialLicense = false;
        _this.events = new EventDispatcher();
        return _this;
    }
    /**
     * Performs initialization of the System object.
     *
     * Called when the first [[Sprite]] object is created.
     *
     * @ignore Exclude from docs
     */
    System.prototype.init = function () {
        var _this = this;
        this.svgContainers = [];
        this.invalidPositions = [];
        this.invalidSprites = [];
        this.invalidDatas = [];
        this.invalidRawDatas = [];
        this.invalidDataRange = [];
        this.invalidDataItems = [];
        this.invalidLayouts = [];
        this.textFormatter = new TextFormatter();
        // frame at which we should measure
        this.measureAt = Math.round(this.frameRate / this.measureRate);
        // ghost is used to draw elements while real paper is not yet created or Sprite doesn't know parent yet
        var ghostDiv = document.createElement("div");
        ghostDiv.hidden = true;
        document.body.appendChild(ghostDiv);
        var ghostSvgContainer = new SVGContainer(ghostDiv);
        this.ghostPaper = new Paper(ghostSvgContainer.SVGContainer);
        this.ghostPaper.id = "ghost";
        $dom.ready(function () {
            _this.update();
            raf(function () {
                _this.update();
            });
        });
        system.time = Date.now();
        // Create an id for system
        this.uid;
    };
    /**
     * Creates all HTML and SVG containers needed for the chart instance, as well
     * as the new [[Sprite]] (as specified in `classType` parameter).
     *
     * @param  {Optional<HTMLElement | string>}  htmlElement  A container to creat elements in
     * @param  {T}                               classType    A class definition of the new element to create
     * @return {T}                                            Newly-created Sprite object
     */
    System.prototype.createChild = function (htmlElement, classType) {
        var htmlContainer = $dom.getElement(htmlElement);
        if (htmlContainer) {
            // we need to create another div with position:absolute in order div elements added inside could be positioned relatively
            /*
            let innerContainer = document.createElement("div");
            let style = innerContainer.style;
            style.width = "100%";
            style.height = "100%";
            style.position = "relative";
*/
            //	htmlContainer.appendChild(innerContainer);
            var svgDiv = new SVGContainer(htmlContainer);
            var paper = new Paper(svgDiv.SVGContainer);
            paper.id = "svg-" + (system.svgContainers.length - 1);
            // the approach with masks is chosen because overflow:visible is set on SVG element in order tooltips could go outside
            // svg area - this is often needed when working with small charts.
            // main container which holds content container and tooltips container
            var container = new Container();
            container.htmlContainer = htmlContainer;
            container.svgContainer = svgDiv.SVGContainer;
            container.width = percent(100);
            container.height = percent(100);
            container.paper = paper;
            // this is set from parent container, but this one doesn't have, so do it manually.
            container.relativeWidth = 1;
            container.relativeHeight = 1;
            svgDiv.container = container;
            // content container
            // setting mask directly on classType object would result mask to shift together with object transformations
            var contentContainer = container.createChild(Container);
            contentContainer.width = percent(100);
            contentContainer.height = percent(100);
            // content mask
            contentContainer.mask = contentContainer.background;
            // creating classType instance
            var sprite_1 = contentContainer.createChild(classType);
            sprite_1.isBaseSprite = true;
            sprite_1.focusFilter = new FocusFilter();
            // tooltip container
            var tooltipContainer_1 = container.createChild(Container);
            tooltipContainer_1.width = percent(100);
            tooltipContainer_1.height = percent(100);
            tooltipContainer_1.isMeasured = false;
            contentContainer.tooltipContainer = tooltipContainer_1;
            sprite_1.tooltip = new Tooltip();
            sprite_1.tooltip.hide(0);
            sprite_1.tooltip.setBounds({ x: 0, y: 0, width: tooltipContainer_1.maxWidth, height: tooltipContainer_1.maxHeight });
            tooltipContainer_1.events.on("maxsizechanged", function () {
                sprite_1.tooltip.setBounds({ x: 0, y: 0, width: tooltipContainer_1.maxWidth, height: tooltipContainer_1.maxHeight });
            });
            //@todo: maybe we don't need to create one by default but only on request?
            contentContainer.preloader = new Preloader();
            if (!this.commercialLicense) {
                tooltipContainer_1.createChild(AmChartsLogo);
            }
            sprite_1.numberFormatter; // need to create one.
            return sprite_1;
        }
        else {
            system.log("html container not found");
        }
    };
    /**
     * Reports time elapsed since timer was reset.
     *
     * @ignore Exclude from docs
     * @todo Needed?
     * @param {string}   msg    Message to report in console
     * @param {boolean}  reset  Reset time counter
     */
    System.prototype.reportTime = function (msg, reset) {
        if (system.dummyCounter < 6) {
            //console.log(Date.now() - system.time, msg, this.dummyCounter2);
        }
        if (reset) {
            system.time = Date.now();
        }
    };
    /**
     * Performs "heartbeat" operations `frameRate` number of times per second.
     *
     * When the chart element is invalidated, it is not immediately redrawn.
     *
     * Instead it waits for the next `update()` cycle to be re-validated.
     *
     * @ignore Exclude from docs
     * @todo Maybe should be private?
     */
    System.prototype.update = function () {
        var _this = this;
        this.dispatchImmediately("enterframe");
        this.measureCounter++;
        if (this.measureCounter >= this.measureAt) {
            this.measureCounter = 0;
            this.measure();
        }
        this.validateLayouts();
        this.validatePositions();
        // data objects first - do all calculations
        // only data is parsed in chunks, thats why we do for loop instead of a while like with other invalid items.
        // important to go backwards, as items are removed!
        // TODO use iterator instead
        while (this.invalidDatas.length > 0) {
            var component = this.invalidDatas[0];
            var dataProvider = component.dataProvider;
            if (dataProvider && dataProvider.dataInvalid) {
                try {
                    dataProvider.validateData();
                    if (dataProvider.dataValidationProgress < 1) {
                        break;
                    }
                }
                catch (e) {
                    $array.remove(this.invalidDatas, dataProvider);
                    dataProvider.raiseCriticalError(e);
                }
            }
            else {
                try {
                    component.validateData();
                    if (component.dataValidationProgress < 1) {
                        break;
                    }
                }
                catch (e) {
                    $array.remove(this.invalidDatas, component);
                    component.raiseCriticalError(e);
                }
            }
        }
        while (this.invalidRawDatas.length > 0) {
            var component = this.invalidRawDatas[0];
            try {
                component.validateRawData();
            }
            catch (e) {
                $array.remove(this.invalidRawDatas, component);
                component.raiseCriticalError(e);
            }
        }
        // TODO use iterator instead
        while (this.invalidDataItems.length > 0) {
            var component = this.invalidDataItems[0];
            var dataProvider = component.dataProvider;
            // this is needed to avoid partial value validation when data is parsed in chunks
            if (component.dataInvalid || (dataProvider && dataProvider.dataInvalid)) {
                // void
            }
            else {
                try {
                    component.validateDataItems();
                }
                catch (e) {
                    $array.remove(this.invalidDataItems, component);
                    component.raiseCriticalError(e);
                }
            }
            // this might seem too much, as validateValues removes from invalidDataItems aswell, but just to be sure (in case validateData is overriden and no super is called)
            $array.remove(system.invalidDataItems, component);
        }
        // TODO use iterator instead
        while (this.invalidDataRange.length > 0) {
            var component = this.invalidDataRange[0];
            var dataProvider = component.dataProvider;
            if (component.dataInvalid || (dataProvider && dataProvider.dataInvalid)) {
                // void
            }
            else {
                try {
                    component.validateDataRange();
                    if (!component.skipRangeEvent) {
                        component.dispatchImmediately("datarangechanged");
                    }
                    component.skipRangeEvent = false;
                }
                catch (e) {
                    $array.remove(this.invalidDataRange, component);
                    component.raiseCriticalError(e);
                }
            }
            // this might seem too much, as validateDataRange removes from invalidDataRange aswell, but just to be sure (in case validateData is overriden and no super is called)
            $array.remove(system.invalidDataRange, component);
        }
        var skippedSprites = [];
        // display objects later
        // TODO use iterator instead
        while (this.invalidSprites.length > 0) {
            this.validateLayouts();
            this.validatePositions();
            var sprite = this.invalidSprites[this.invalidSprites.length - 1];
            // we need to check this, as validateLayout might validate sprite
            if (sprite && !sprite.isDisposed()) {
                if (sprite instanceof Component && (sprite.dataInvalid || (sprite.dataProvider && sprite.dataProvider.dataInvalid))) {
                    // void
                }
                else {
                    // @todo? maybe we should only check if preloader is visible and render only preloader sprites?
                    // if not, think how can we the next line better.
                    if (sprite.renderingFrame > 1) {
                        sprite.renderingFrame--;
                        skippedSprites.push(sprite);
                    }
                    else if (sprite.dataItem && sprite.dataItem.component && sprite.dataItem.component.dataInvalid) {
                        // void
                    }
                    else {
                        try {
                            sprite.validate();
                        }
                        catch (e) {
                            $array.remove(this.invalidSprites, sprite);
                            sprite.raiseCriticalError(e);
                        }
                    }
                }
            }
            // this might seem too much, but it's ok
            $array.remove(system.invalidSprites, sprite);
        }
        system.invalidSprites = skippedSprites;
        // TODO make this more efficient
        // TODO don't copy the array
        $array.each($array.copy(animations), function (x) {
            x.update();
        });
        // to avoid flicker, we validate positions last time
        //this.validateLayouts();
        //this.validatePositions();
        triggerIdle();
        // to avoid flicker, we validate positions last time
        this.validateLayouts();
        this.validatePositions();
        this.dispatchImmediately("exitframe");
        //system.dummyCounter++;
        raf(function () {
            _this.update();
        });
    };
    /**
     * Triggers position re-validation on all [[Sprite]] elements that have
     * invalid(ated) positions.
     *
     * @ignore Exclude from docs
     * @todo Maybe should be private?
     */
    System.prototype.validatePositions = function () {
        // invalid positions
        // TODO use iterator instead
        while (this.invalidPositions.length > 0) {
            var sprite = this.invalidPositions[this.invalidPositions.length - 1];
            try {
                sprite.validatePosition();
            }
            catch (e) {
                $array.remove(this.invalidPositions, sprite);
                sprite.raiseCriticalError(e);
            }
        }
    };
    /**
     * Triggers position re-validation on all [[Container]] elements that have
     * invalid(ated) layouts.
     *
     * @ignore Exclude from docs
     * @todo Maybe should be private?
     */
    System.prototype.validateLayouts = function () {
        // invalid positions
        // TODO use iterator instead
        while (this.invalidLayouts.length > 0) {
            var container = this.invalidLayouts[this.invalidLayouts.length - 1];
            try {
                container.validateLayout();
            }
            catch (e) {
                $array.remove(this.invalidLayouts, container);
                container.raiseCriticalError(e);
            }
        }
    };
    /**
     * (Re)measures all top-level SVG containers for size.
     *
     * @ignore Exclude from docs
     * @todo Maybe should be private?
     */
    System.prototype.measure = function () {
        $array.each(this.svgContainers, function (svgContainer) {
            if (svgContainer.autoResize) {
                svgContainer.measure();
            }
        });
    };
    /**
     * Sets style property on DOM element.
     *
     * @ignore Exclude from docs
     * @todo Still needed?
     */
    System.prototype.setStyle = function (element, property, value) {
        element.style[property] = value;
    };
    /**
     * Outputs string to console if `verbose` is `true`.
     *
     * @param {any} value Message to output to console
     */
    System.prototype.log = function (value) {
        if (this.verbose) {
            if (console) {
                console.log(value);
            }
        }
    };
    /**
     * amCharts Version.
     *
     * This follows npm's semver specification.
     *
     * @see {@link https://docs.npmjs.com/misc/semver}
     * @type {string}
     */
    System.VERSION = "4.0.0-beta.8";
    return System;
}(BaseObjectEvents));
export { System };
/**
 * A singleton global instance of [[System]].
 *
 * All code should access this system variable, rather than instantiate their
 * own.
 */
export var system = new System();
/**
 * Init the System just once
 */
system.init();
//# sourceMappingURL=System.js.map