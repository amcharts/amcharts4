/**
 * A module for the mini-map control.
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
import { Container } from "../../core/Container";
import { Rectangle } from "../../core/elements/Rectangle";
import { MapSeries } from "./MapSeries";
import { ListTemplate } from "../../core/utils/List";
import { MutableValueDisposer, MultiDisposer } from "../../core/utils/Disposer";
import { system } from "../../core/System";
import { color } from "../../core/utils/Color";
import * as $utils from "../../core/utils/Utils";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Creates a "bird's eye" view of the whole map.
 *
 * This control creates a mini-map with the whole of the map, highlighting
 * the area which is in the current viewport of the map map.
 *
 * @see {@link ISmallMapEvents} for a list of available events
 * @see {@link ISmallMapAdapters} for a list of available Adapters
 * @important
 */
var SmallMap = /** @class */ (function (_super) {
    __extends(SmallMap, _super);
    /**
     * Constructor
     */
    function SmallMap() {
        var _this = 
        // Init
        _super.call(this) || this;
        /**
         * A target map.
         *
         * @type {MutableValueDisposer<MapChart>}
         */
        _this._chart = new MutableValueDisposer();
        _this.className = "SmallMap";
        // Set defaults
        _this.align = "left";
        _this.valign = "bottom";
        _this.percentHeight = 20;
        _this.percentWidth = 20;
        _this.margin(5, 5, 5, 5);
        var interfaceColors = new InterfaceColorSet();
        // Set background defailts
        _this.background.fillOpacity = 0.9;
        _this.background.fill = interfaceColors.getFor("background");
        // Set up events
        _this.events.on("hit", _this.moveToPosition, _this);
        _this.events.on("maxsizechanged", _this.updateMapSize, _this);
        // Create series
        _this.series = new ListTemplate(new MapSeries());
        _this.series.events.on("insert", _this.processSeries, _this);
        // Create a container
        _this.seriesContainer = _this.createChild(Container);
        // Create an outline rectangle
        var rectangle = _this.createChild(Rectangle);
        rectangle.stroke = interfaceColors.getFor("alternativeBackground");
        rectangle.strokeWidth = 1;
        rectangle.strokeOpacity = 0.5;
        rectangle.fill = color(); //"none";
        rectangle.verticalCenter = "middle";
        rectangle.horizontalCenter = "middle";
        rectangle.isMeasured = false;
        _this.rectangle = rectangle;
        // Apply theme
        _this.applyTheme();
        return _this;
    }
    /**
     * Moves main map pan position after click on the small map.
     *
     * @ignore Exclude from docs
     * @param {AMEvent<Sprite, ISpriteEvents>["hit"]}  event  Event
     */
    SmallMap.prototype.moveToPosition = function (event) {
        var svgPoint = event.svgPoint;
        var rectPoint = $utils.svgPointToSprite(svgPoint, this.rectangle);
        var zoomLevel = this.chart.zoomLevel;
        var scale = Math.min(this.percentWidth, this.percentHeight) / 100;
        var x = (rectPoint.x + this.rectangle.pixelWidth / 2) / scale * zoomLevel;
        var y = (rectPoint.y + this.rectangle.pixelHeight / 2) / scale * zoomLevel;
        var geoPoint = this.chart.svgPointToGeo({ x: x, y: y });
        this.chart.zoomToGeoPoint(geoPoint, this.chart.zoomLevel, true);
    };
    /**
     * Decorates a new [[MapSeries]] object with required parameters when it is
     * added to the chart.
     *
     * @param {IListEvents<MapSeries>["insert"]} event [description]
     */
    SmallMap.prototype.processSeries = function (event) {
        var series = event.newValue;
        series.chart = this.chart;
        series.parent = this.seriesContainer;
    };
    Object.defineProperty(SmallMap.prototype, "chart", {
        /**
         * @return {MapChart} Chart/map
         */
        get: function () {
            return this._chart.get();
        },
        /**
         * A chart/map that this control is meant for.
         *
         * @param {MapChart}  chart  Chart/map
         */
        set: function (chart) {
            if (this.chart != chart) {
                this._chart.set(chart, new MultiDisposer([
                    chart.events.on("zoomlevelchanged", this.updateRectangle, this),
                    chart.events.on("mappositionchanged", this.updateRectangle, this),
                    chart.events.on("scaleratiochanged", this.updateMapSize, this)
                ]));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Updates the viewport recangle as per current map zoom/pan position.
     *
     * @ignore Exclude from docs
     */
    SmallMap.prototype.updateRectangle = function () {
        var chart = this.chart;
        var zoomLevel = chart.zoomLevel;
        var rectangle = this.rectangle;
        rectangle.width = this.pixelWidth / zoomLevel;
        rectangle.height = this.pixelHeight / zoomLevel;
        var scale = Math.min(this.percentWidth, this.percentHeight) / 100;
        var seriesContainer = chart.seriesContainer;
        var x = Math.ceil((zoomLevel * seriesContainer.pixelWidth / 2 - seriesContainer.pixelX) * scale / zoomLevel + rectangle.pixelWidth / 2);
        var y = Math.ceil((zoomLevel * seriesContainer.pixelHeight / 2 - seriesContainer.pixelY) * scale / zoomLevel + rectangle.pixelHeight / 2);
        rectangle.x = x;
        rectangle.y = y;
    };
    /**
     * Update map size so that internal elements can redraw themselves after
     * the size of the small map changes.
     *
     * @ignore Exclude from docs
     */
    SmallMap.prototype.updateMapSize = function () {
        if (this.chart) {
            this.seriesContainer.scale = this.chart.scaleRatio * Math.min(this.percentWidth, this.percentHeight) / 100;
            this.afterDraw();
        }
    };
    /**
     * Update elements after drawing the small map.
     */
    SmallMap.prototype.afterDraw = function () {
        _super.prototype.afterDraw.call(this);
        this.seriesContainer.moveTo({ x: this.pixelWidth / 2, y: this.pixelHeight / 2 });
        this.rectangle.maskRectangle = { x: -1, y: -1, width: Math.ceil(this.pixelWidth + 2), height: Math.ceil(this.pixelHeight + 2) };
    };
    return SmallMap;
}(Container));
export { SmallMap };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
system.registeredClasses["SmallMap"] = SmallMap;
//# sourceMappingURL=SmallMap.js.map