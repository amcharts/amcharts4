/**
 * Zoom control module
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../../core/Container";
import { Button } from "../../core/elements/Button";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
import { MutableValueDisposer, MultiDisposer } from "../../core/utils/Disposer";
import { keyboard } from "../../core/utils/Keyboard";
import { getInteraction } from "../../core/interaction/Interaction";
import { percent } from "../../core/utils/Percent";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a control for zooming the map.
 *
 * @see {@link IZoomControlEvents} for a list of available events
 * @see {@link IZoomControlAdapters} for a list of available Adapters
 * @important
 */
var ZoomControl = /** @class */ (function (_super) {
    tslib_1.__extends(ZoomControl, _super);
    /**
     * Constructor
     */
    function ZoomControl() {
        var _this = _super.call(this) || this;
        /**
         * A target map.
         *
         * @type {MutableValueDisposer<MapChart>}
         */
        _this._chart = new MutableValueDisposer();
        _this.className = "ZoomControl";
        _this.align = "right";
        _this.valign = "bottom";
        _this.layout = "vertical";
        _this.padding(5, 5, 5, 5);
        var interfaceColors = new InterfaceColorSet();
        var plusButton = _this.createChild(Button);
        plusButton.shouldClone = false;
        plusButton.label.text = "+";
        plusButton.width = percent(100);
        plusButton.padding(5, 5, 5, 5);
        _this.plusButton = plusButton;
        var slider = _this.createChild(Container);
        slider.shouldClone = false;
        slider.width = percent(100);
        slider.background.fill = interfaceColors.getFor("alternativeBackground");
        slider.background.fillOpacity = 0.05;
        slider.background.events.on("hit", _this.handleBackgroundClick, _this);
        slider.events.on("sizechanged", _this.updateThumbSize, _this);
        _this.slider = slider;
        var thumb = slider.createChild(Button);
        thumb.shouldClone = false;
        thumb.padding(0, 0, 0, 0);
        thumb.draggable = true;
        thumb.events.on("drag", _this.handleThumbDrag, _this);
        _this.thumb = thumb;
        var minusButton = _this.createChild(Button);
        minusButton.shouldClone = false;
        minusButton.label.text = "-";
        minusButton.padding(5, 5, 5, 5);
        _this.minusButton = minusButton;
        // Set roles
        _this.thumb.role = "slider";
        _this.thumb.readerLive = "polite";
        // Set reader text
        _this.thumb.readerTitle = _this.language.translate("Use arrow keys to zoom in and out");
        _this.minusButton.readerTitle = _this.language.translate("Press ENTER to zoom in");
        _this.plusButton.readerTitle = _this.language.translate("Press ENTER to zoom out");
        _this.applyTheme();
        _this.events.on("propertychanged", function (event) {
            if (event.property == "layout") {
                _this.fixLayout();
            }
        });
        _this._disposers.push(_this._chart);
        _this.fixLayout();
        return _this;
    }
    ZoomControl.prototype.fixLayout = function () {
        if (this.layout == "vertical") {
            this.width = 40;
            this.height = undefined;
            this.minusButton.width = percent(100);
            this.thumb.width = percent(100);
            this.plusButton.width = percent(100);
            this.slider.width = percent(100);
            this.minusButton.marginTop = 1;
            this.plusButton.marginBottom = 2;
            this.slider.height = 0;
            this.minusButton.toFront();
            this.plusButton.toBack();
            this.thumb.minX = 0;
            this.thumb.maxX = 0;
            this.thumb.minY = 0;
        }
        else if (this.layout == "horizontal") {
            this.thumb.minX = 0;
            this.thumb.minY = 0;
            this.thumb.maxY = 0;
            this.height = 40;
            this.width = undefined;
            this.minusButton.height = percent(100);
            this.minusButton.width = 30;
            this.thumb.height = percent(100);
            this.thumb.width = undefined;
            this.plusButton.height = percent(100);
            this.plusButton.width = 30;
            this.slider.height = percent(100);
            this.slider.width = 0;
            this.minusButton.marginLeft = 2;
            this.plusButton.marginRight = 2;
            this.minusButton.toBack();
            this.plusButton.toFront();
        }
    };
    /**
     * Handles zoom operation after clicking on the slider background.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["hit"]}  event  Event
     */
    ZoomControl.prototype.handleBackgroundClick = function (event) {
        var sprite = event.target;
        var y = event.spritePoint.y;
        var chart = this.chart;
        var maxPower = Math.log(chart.maxZoomLevel) / Math.LN2;
        var minPower = Math.log(chart.minZoomLevel) / Math.LN2;
        var power = (sprite.pixelHeight - y) / sprite.pixelHeight * (minPower + (maxPower - minPower));
        var zoomLevel = Math.pow(2, power);
        chart.zoomToGeoPoint(chart.zoomGeoPoint, zoomLevel);
    };
    Object.defineProperty(ZoomControl.prototype, "chart", {
        /**
         * @return {MapChart} Map/chart
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * A main chart/map that this zoom control is for.
         *
         * @param {MapChart}  chart  Map/chart
         */
        set: function (chart) {
            var _this = this;
            this._chart.set(chart, new MultiDisposer([
                chart.events.on("maxsizechanged", this.updateThumbSize, this),
                chart.events.on("zoomlevelchanged", this.updateThumb, this),
                this.minusButton.events.on("hit", function () { chart.zoomOut(chart.zoomGeoPoint); }, chart),
                getInteraction().body.events.on("keyup", function (ev) {
                    if (_this.topParent.hasFocused) {
                        if (keyboard.isKey(ev.event, "enter")) {
                            if (_this.minusButton.isFocused) {
                                chart.zoomOut();
                            }
                            else if (_this.plusButton.isFocused) {
                                chart.zoomIn();
                            }
                        }
                        else if (keyboard.isKey(ev.event, "plus")) {
                            chart.zoomIn();
                        }
                        else if (keyboard.isKey(ev.event, "minus")) {
                            chart.zoomOut();
                        }
                    }
                }, chart),
                this.plusButton.events.on("hit", function () { chart.zoomIn(chart.zoomGeoPoint); }, chart)
            ]));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the slider's thumb size based on the available zoom space.
     *
     * @ignore Exclude from docs
     */
    ZoomControl.prototype.updateThumbSize = function () {
        var chart = this.chart;
        if (chart) {
            var slider = this.slider;
            var thumb = this.thumb;
            if (this.layout == "vertical") {
                thumb.minHeight = Math.min(this.slider.pixelHeight, 20);
                thumb.height = slider.pixelHeight / this.stepCount;
                thumb.maxY = slider.pixelHeight - thumb.pixelHeight;
                if (thumb.pixelHeight <= 1) {
                    thumb.visible = false;
                }
                else {
                    thumb.visible = true;
                }
            }
            else {
                thumb.minWidth = Math.min(this.slider.pixelWidth, 20);
                thumb.width = slider.pixelWidth / this.stepCount;
                thumb.maxX = slider.pixelWidth - thumb.pixelWidth;
                if (thumb.pixelWidth <= 1) {
                    thumb.visible = false;
                }
                else {
                    thumb.visible = true;
                }
            }
        }
    };
    /**
     * Updates thumb according to current zoom position from map.
     *
     * @ignore Exclude from docs
     */
    ZoomControl.prototype.updateThumb = function () {
        var slider = this.slider;
        var chart = this.chart;
        var thumb = this.thumb;
        if (!thumb.isDown) {
            var step = (Math.log(chart.zoomLevel) - Math.log(this.chart.minZoomLevel)) / Math.LN2;
            if (this.layout == "vertical") {
                thumb.y = slider.pixelHeight - (slider.pixelHeight - thumb.pixelHeight) * step / this.stepCount - thumb.pixelHeight;
            }
            else {
                thumb.x = slider.pixelWidth * step / this.stepCount;
            }
        }
    };
    /**
     * Zooms the actual map when slider position changes.
     *
     * @ignore Exclude from docs
     */
    ZoomControl.prototype.handleThumbDrag = function () {
        var slider = this.slider;
        var chart = this.chart;
        var thumb = this.thumb;
        var step;
        var minStep = Math.log(this.chart.minZoomLevel) / Math.LN2;
        if (this.layout == "vertical") {
            step = this.stepCount * (slider.pixelHeight - thumb.pixelY - thumb.pixelHeight) / (slider.pixelHeight - thumb.pixelHeight);
        }
        else {
            step = this.stepCount * thumb.pixelX / slider.pixelWidth;
        }
        step = minStep + step;
        var zoomLevel = Math.pow(2, step);
        chart.zoomToGeoPoint(undefined, zoomLevel, false, 0);
    };
    Object.defineProperty(ZoomControl.prototype, "stepCount", {
        /**
         * Returns the step countfor the slider grid according to map's min and max
         * zoom level settings.
         *
         * @ignore Exclude from docs
         * @return {number} Step count
         */
        get: function () {
            return Math.log(this.chart.maxZoomLevel) / Math.LN2 - Math.log(this.chart.minZoomLevel) / Math.LN2;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Creates a background element for slider control.
     *
     * @ignore Exclude from docs
     * @return {this} Background
     */
    ZoomControl.prototype.createBackground = function () {
        return new RoundedRectangle();
    };
    return ZoomControl;
}(Container));
export { ZoomControl };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ZoomControl"] = ZoomControl;
//# sourceMappingURL=ZoomControl.js.map