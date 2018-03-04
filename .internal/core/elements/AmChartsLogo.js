/**
 * AmChartsLogo module.
 *
 * AmChartsLogo is a progress indicator.
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
import { Container } from "../Container";
import { Line } from "./Line";
import { Polyspline } from "./Polyspline";
import { color } from "../utils/Color";
import { DesaturateFilter } from "../rendering/filters/DesaturateFilter";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A class used to draw and display progress indicator.
 *
 * @see {@link IAmChartsLogoEvents} for a list of available events
 * @see {@link IAmChartsLogoAdapters} for a list of available Adapters
 */
var AmChartsLogo = /** @class */ (function (_super) {
    __extends(AmChartsLogo, _super);
    /**
     * Constructor
     */
    function AmChartsLogo() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "AmChartsLogo";
        _this.isMeasured = false;
        _this.opacity = 0.3;
        _this.defaultState.properties.opacity = 0.4;
        _this.url = "http://www.amcharts.com";
        _this.showSystemTooltip = true;
        _this.readerTitle = "chart created using amCharts library";
        _this.width = 220;
        _this.height = 60;
        _this.background.opacity = 0;
        var ae = _this.createChild(Line);
        ae.isMeasured = false;
        ae.x1 = 167;
        ae.y1 = 50.5;
        ae.x2 = 180;
        ae.y2 = 50.5;
        ae.pixelPerfect = false;
        ae.strokeWidth = 6;
        ae.stroke = color("#474758");
        ae.strokeOpacity = 1;
        var m = _this.createChild(Polyspline);
        m.isMeasured = false;
        m.segments = [[{ x: 70, y: 50 }, { x: 90, y: 50 }, { x: 120, y: 20 }, { x: 135, y: 35 }, { x: 150, y: 20 }, { x: 180, y: 50 }, { x: 200, y: 50 }]];
        m.strokeWidth = 6;
        m.tensionX = 0.8;
        m.tensionY = 1;
        m.stroke = color("#3cabff");
        var mb = _this.createChild(Line);
        mb.isMeasured = false;
        mb.strokeWidth = 6;
        mb.x1 = 25;
        mb.y1 = 50.5;
        mb.x2 = 70.5;
        mb.y2 = 50.5;
        mb.stroke = color("#3cabff");
        var a = _this.createChild(Polyspline);
        a.isMeasured = false;
        a.segments = [[{ x: 20, y: 50 }, { x: 50, y: 50 }, { x: 90, y: 12 }, { x: 127, y: 50 }, { x: 167, y: 50 }]];
        a.strokeWidth = 6;
        a.tensionX = 0.75;
        a.tensionY = 1;
        a.stroke = color("#474758");
        var desaturateFilter = new DesaturateFilter();
        _this.filters.push(desaturateFilter);
        var desaturateFilterHover = new DesaturateFilter();
        desaturateFilterHover.saturation = 1;
        var hoverState = _this.states.create("hover");
        hoverState.properties.opacity = 1;
        hoverState.filters.push(desaturateFilterHover);
        return _this;
    }
    return AmChartsLogo;
}(Container));
export { AmChartsLogo };
//# sourceMappingURL=AmChartsLogo.js.map