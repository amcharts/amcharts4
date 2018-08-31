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
import { LineSeriesSegment } from "./LineSeriesSegment";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";
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
 * @see {@link IStepLineSeriesSegmentEvents} for a list of available events
 * @see {@link IStepLineSeriesSegmentAdapters} for a list of available Adapters
 * @todo Example
 */
var StepLineSeriesSegment = /** @class */ (function (_super) {
    tslib_1.__extends(StepLineSeriesSegment, _super);
    /**
     * Constructor
     */
    function StepLineSeriesSegment() {
        var _this = 
        // Init
        _super.call(this) || this;
        _this.className = "StepLineSeriesSegment";
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
    StepLineSeriesSegment.prototype.drawSegment = function (points, closePoints, smoothnessX, smoothnessY, noRisers, vertical) {
        if (points.length > 0 && closePoints.length > 0) {
            if (noRisers) {
                var path = $path.moveTo(points[0]);
                if (points.length > 0) {
                    for (var i = 1; i < points.length; i++) {
                        var point = points[i];
                        var previouosPoint = points[i - 1];
                        if (vertical) {
                            if (point.y == previouosPoint.y) {
                                path += $path.moveTo(point);
                            }
                            else {
                                path += $path.lineTo(point);
                            }
                        }
                        else {
                            if (point.x == previouosPoint.x) {
                                path += $path.moveTo(point);
                            }
                            else {
                                path += $path.lineTo(point);
                            }
                        }
                    }
                }
                this.strokeSprite.element.attr({ "d": path });
                if (this.fillOpacity > 0 || this.fillSprite.fillOpacity > 0) { // helps to avoid drawing fill object if fill is not visible
                    path = $path.moveTo(points[0]) + $path.polyline(points);
                    path += $path.lineTo(closePoints[0]) + $path.polyline(closePoints);
                    path += $path.lineTo(points[0]);
                    path += $path.closePath();
                    this.fillSprite.element.attr({ "d": path });
                }
                else {
                }
            }
            else {
                var path = $path.moveTo(points[0]) + $path.polyline(points);
                this.strokeSprite.element.attr({ "d": path });
                if (this.fillOpacity > 0 || this.fillSprite.fillOpacity > 0) { // helps to avoid drawing fill object if fill is not visible
                    path += $path.lineTo(closePoints[0]) + $path.polyline(closePoints);
                    path += $path.lineTo(points[0]);
                    path += $path.closePath();
                    this.fillSprite.element.attr({ "d": path });
                }
            }
        }
    };
    return StepLineSeriesSegment;
}(LineSeriesSegment));
export { StepLineSeriesSegment };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["StepLineSeriesSegment"] = StepLineSeriesSegment;
//# sourceMappingURL=StepLineSeriesSegment.js.map