/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { registry } from "./Registry";
import { Container } from "./Container";
import { svgContainers } from "./rendering/SVGContainer";
import { Component } from "./Component";
import { options } from "./Options";
import { raf } from "./utils/AsyncPending";
import { animations } from "./utils/Animation";
import { triggerIdle } from "./utils/AsyncPending";
import * as $dom from "./utils/DOM";
import * as $array from "./utils/Array";
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
var System = /** @class */ (function () {
    /**
     * Performs initialization of the System object.
     *
     * Called when the first [[Sprite]] object is created.
     *
     * @ignore Exclude from docs
     */
    function System() {
        var _this = this;
        /**
         * Unique ID of the object.
         *
         * @type {string}
         */
        this.uid = registry.getUniqueId();
        /**
         * Number of times per second component container is measured.
         *
         * It is not wise to measure container as often as `frameRate`, as this would
         * use a lot of CPU when resizing window.
         *
         * @type {number}
         */
        this.measureRate = 10;
        /**
         * @todo Description
         * @ignore Exclude from docs
         * @private
         * @type {number}
         */
        this.measureCounter = 0;
        /**
         * @todo Description
         * @todo Needed?
         * @ignore Exclude from docs
         * @type {number}
         */
        this.dummyCounter = 0;
        // frame at which we should measure
        this.measureAt = Math.round(this.frameRate / this.measureRate);
        $dom.ready(function () {
            _this.update();
            raf(function () {
                _this.update();
            });
        });
        this.time = Date.now();
    }
    /**
     * Reports time elapsed since timer was reset.
     *
     * @ignore Exclude from docs
     * @todo Needed?
     * @param {string}   msg    Message to report in console
     * @param {boolean}  reset  Reset time counter
     */
    System.prototype.reportTime = function (msg, reset) {
        if (this.dummyCounter < 6) {
            //console.log(Date.now() - this.time, msg, this.dummyCounter2);
        }
        if (reset) {
            this.time = Date.now();
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
        registry.dispatchImmediately("enterframe");
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
        while (registry.invalidDatas.length > 0) {
            var component = registry.invalidDatas[0];
            var dataProvider = component.dataProvider;
            if (!component.isDisposed()) {
                if (dataProvider && dataProvider.dataInvalid) {
                    try {
                        dataProvider.validateData();
                        if (dataProvider.dataValidationProgress < 1) {
                            break;
                        }
                    }
                    catch (e) {
                        $array.remove(registry.invalidDatas, dataProvider);
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
                        $array.remove(registry.invalidDatas, component);
                        component.raiseCriticalError(e);
                    }
                }
            }
            else {
                $array.remove(registry.invalidDatas, component);
            }
        }
        while (registry.invalidRawDatas.length > 0) {
            var component = registry.invalidRawDatas[0];
            if (!component.isDisposed()) {
                try {
                    component.validateRawData();
                }
                catch (e) {
                    $array.remove(registry.invalidRawDatas, component);
                    component.raiseCriticalError(e);
                }
            }
            else {
                $array.remove(registry.invalidRawDatas, component);
            }
        }
        // TODO use iterator instead
        while (registry.invalidDataItems.length > 0) {
            var component = registry.invalidDataItems[0];
            var dataProvider = component.dataProvider;
            // this is needed to avoid partial value validation when data is parsed in chunks
            if (component.isDisposed() || component.dataInvalid || (dataProvider && dataProvider.dataInvalid)) {
                // void
            }
            else {
                try {
                    component.validateDataItems();
                }
                catch (e) {
                    $array.remove(registry.invalidDataItems, component);
                    component.raiseCriticalError(e);
                }
            }
            // this might seem too much, as validateValues removes from invalidDataItems aswell, but just to be sure (in case validateData is overriden and no super is called)
            $array.remove(registry.invalidDataItems, component);
        }
        // TODO use iterator instead
        while (registry.invalidDataRange.length > 0) {
            var component = registry.invalidDataRange[0];
            var dataProvider = component.dataProvider;
            if (component.isDisposed() || component.dataInvalid || (dataProvider && dataProvider.dataInvalid)) {
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
                    $array.remove(registry.invalidDataRange, component);
                    component.raiseCriticalError(e);
                }
            }
            // this might seem too much, as validateDataRange removes from invalidDataRange aswell, but just to be sure (in case validateData is overriden and no super is called)
            $array.remove(registry.invalidDataRange, component);
        }
        var skippedSprites = [];
        // display objects later
        // TODO use iterator instead
        while (registry.invalidSprites.length > 0) {
            this.validateLayouts();
            this.validatePositions();
            var sprite = registry.invalidSprites[registry.invalidSprites.length - 1];
            // we need to check this, as validateLayout might validate sprite
            if (sprite && !sprite.isDisposed()) {
                if (sprite instanceof Component && (sprite.dataInvalid || (sprite.dataProvider && sprite.dataProvider.dataInvalid))) {
                    // void
                    skippedSprites.push(sprite);
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
                        skippedSprites.push(sprite);
                    }
                    else {
                        try {
                            if (sprite instanceof Container) {
                                sprite.children.each(function (child) {
                                    if (child.invalid) {
                                        if (child instanceof Component && (child.dataInvalid || (child.dataProvider && child.dataProvider.dataInvalid))) {
                                            skippedSprites.push(child);
                                        }
                                        else if (child.dataItem && child.dataItem.component && child.dataItem.component.dataInvalid) {
                                            skippedSprites.push(child);
                                        }
                                        else {
                                            child.validate();
                                        }
                                    }
                                });
                            }
                            sprite.validate();
                        }
                        catch (e) {
                            sprite.invalid = false;
                            $array.remove(registry.invalidSprites, sprite);
                            sprite.raiseCriticalError(e);
                        }
                    }
                }
                // this might seem too much, but it's ok
                sprite.invalid = false;
            }
            $array.remove(registry.invalidSprites, sprite);
        }
        registry.invalidSprites = skippedSprites;
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
        registry.dispatchImmediately("exitframe");
        //this.dummyCounter++;
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
        while (registry.invalidPositions.length > 0) {
            var sprite = registry.invalidPositions[registry.invalidPositions.length - 1];
            if (!sprite.isDisposed()) {
                try {
                    if (sprite instanceof Container) {
                        sprite.children.each(function (sprite) {
                            if (sprite.positionInvalid) {
                                sprite.validatePosition();
                            }
                        });
                    }
                    sprite.validatePosition();
                }
                catch (e) {
                    sprite.positionInvalid = false;
                    $array.remove(registry.invalidPositions, sprite);
                    sprite.raiseCriticalError(e);
                }
            }
            else {
                $array.remove(registry.invalidPositions, sprite);
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
        while (registry.invalidLayouts.length > 0) {
            var container = registry.invalidLayouts[registry.invalidLayouts.length - 1];
            if (!container.isDisposed()) {
                try {
                    container.children.each(function (sprite) {
                        if (sprite instanceof Container && sprite.layoutInvalid) {
                            sprite.validateLayout();
                        }
                    });
                    container.validateLayout();
                }
                catch (e) {
                    container.layoutInvalid = false;
                    $array.remove(registry.invalidLayouts, container);
                    container.raiseCriticalError(e);
                }
            }
            else {
                $array.remove(registry.invalidLayouts, container);
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
        $array.each(svgContainers, function (svgContainer) {
            if (svgContainer.autoResize) {
                svgContainer.measure();
            }
        });
    };
    /**
     * Outputs string to console if `verbose` is `true`.
     *
     * @param {any} value Message to output to console
     */
    System.prototype.log = function (value) {
        if (options.verbose) {
            if (console) {
                console.log(value);
            }
        }
    };
    Object.defineProperty(System.prototype, "frameRate", {
        /**
         * @return {number} Frame rate
         */
        get: function () {
            return registry.frameRate;
        },
        /**
         * Get current theme
         * @return {ITheme} [description]
         */
        /*public get theme(): ITheme {
            return $array.last(this.themes);
        }*/
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
         * @type {number} Frame rate
         */
        set: function (value) {
            registry.frameRate = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * amCharts Version.
     *
     * This follows npm's semver specification.
     *
     * @see {@link https://docs.npmjs.com/misc/semver}
     * @type {string}
     */
    System.VERSION = "4.0.0-beta.49";
    return System;
}());
export { System };
/**
 * A singleton global instance of [[System]].
 *
 * All code should use this, rather than instantiating their
 * own System objects.
 */
export var system = new System();
//# sourceMappingURL=System.js.map