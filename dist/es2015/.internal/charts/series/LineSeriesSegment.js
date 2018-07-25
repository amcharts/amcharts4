/**
 * Line series segment module.
 * @todo Add description about what this is
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../../core/Container";
import { Sprite, visualProperties } from "../../core/Sprite";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";
import * as $object from "../../core/utils/Object";
import * as $smoothing from "../../core/rendering/Smoothing";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Represents a line series segment.
 *
 * A line segment can be used to apply different properties to a part of the
 * line series, between two data points.
 *
 * @see {@link ILineSeriesSegmentEvents} for a list of available events
 * @see {@link ILineSeriesSegmentAdapters} for a list of available Adapters
 * @todo Example
 */
var LineSeriesSegment = /** @class */ (function (_super) {
    tslib_1.__extends(LineSeriesSegment, _super);
    /**
     * Constructor
     */
    function LineSeriesSegment() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "LineSeriesSegment";
        // Set defaults
        _this.isMeasured = false;
        _this.interactionsEnabled = false;
        _this.layout = "none";
        // Create fill element
        var fillSprite = _this.createChild(Sprite);
        _this.fillSprite = fillSprite;
        fillSprite.shouldClone = false;
        fillSprite.element = _this.paper.add("path");
        fillSprite.isMeasured = false;
        _this._disposers.push(fillSprite);
        // Create line element
        var strokeSprite = _this.createChild(Sprite);
        _this.strokeSprite = strokeSprite;
        strokeSprite.shouldClone = false;
        strokeSprite.element = _this.paper.add("path");
        strokeSprite.isMeasured = false;
        _this._disposers.push(strokeSprite);
        return _this;
    }
    /**
     * Draws the series segment.
     *
     * @ignore Exclude from docs
     * @param {IPoint[]}  points       Points to connect
     * @param {IPoint[]}  closePoints  ?
     * @param {number}    smoothnessX  Horizontal bezier setting (?)
     * @param {number}    smoothnessY  Vertical bezier setting (?)
     */
    LineSeriesSegment.prototype.drawSegment = function (points, closePoints, smoothnessX, smoothnessY) {
        if (points.length > 0 && closePoints.length > 0) {
            var path = $path.moveTo(points[0]) + new $smoothing.Tension(smoothnessX, smoothnessY).smooth(points);
            //if(this.strokeOpacity > 0 || this.strokeSprite.strokeOpacity > 0){ // not good, range stroke is not drawn then
            this.strokeSprite.element.attr({ "d": path });
            //}
            if (this.fillOpacity > 0 || this.fillSprite.fillOpacity > 0) { // helps to avoid drawing fill object if fill is not visible
                path += $path.lineTo(closePoints[0]) + new $smoothing.Tension(smoothnessX, smoothnessY).smooth(closePoints);
                path += $path.lineTo(points[0]);
                path += $path.closePath();
                this.fillSprite.element.attr({ "d": path });
            }
        }
    };
    /**
     * Copies properties from a [[Sprite]] to both line and fill elements.
     *
     * @param {Sprite} source Source [[Sprite]] to copy properties from
     */
    LineSeriesSegment.prototype.copyFrom = function (source) {
        _super.prototype.copyFrom.call(this, source);
        var lineElement = this.strokeSprite;
        $object.copyProperties(source, lineElement.properties, visualProperties);
        lineElement.fillOpacity = 0;
        var fillElement = this.fillSprite;
        $object.copyProperties(source, fillElement.properties, visualProperties);
        fillElement.strokeOpacity = 0;
    };
    return LineSeriesSegment;
}(Container));
export { LineSeriesSegment };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["LineSeriesSegment"] = LineSeriesSegment;
//# sourceMappingURL=LineSeriesSegment.js.map