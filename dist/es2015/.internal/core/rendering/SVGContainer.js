/**
 * This functionality is related to the HTML wrapper that houses `<svg>` tag.
 */
import * as $utils from "../utils/Utils";
import * as $dom from "../utils/DOM";
import * as $array from "../utils/Array";
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * A array of all SVG Containers (one SVG container per chart instance).
 *
 * @ignore Exclude from docs
 * @type {Array<SVGContainer>}
 */
export var svgContainers = [];
/**
 * A class used to create an HTML wrapper for the SVG contents.
 */
var SVGContainer = /** @class */ (function () {
    /**
     * Constructor
     *
     * * Creates an HTML wrapper for SVG
     */
    function SVGContainer(htmlElement) {
        /**
         * Indicates if this object has already been deleted. Any
         * destruction/disposal code should take this into account when deciding
         * wheter to run potentially costly disposal operations if they already have
         * been run.
         *
         * @type {boolean}
         */
        this._disposed = false;
        /**
         * If this component is in a separate HTML container, `autoResize` means the
         * module will constantly measure container's size and adopt contents to it.
         *
         * @type {Boolean}
         */
        this.autoResize = true;
        // Log parent HTML element
        this.htmlElement = htmlElement;
        // Adds to containers array
        svgContainers.push(this);
        /**
         * Create child div for the container - it will have svg node
         * It might seem that this container is not necessay, however having it solves
         * a problems with mouse position detection and some other.
         */
        var svgContainer = document.createElement("div");
        var style = svgContainer.style;
        style.width = "100%";
        style.height = "100%";
        style.position = "relative";
        htmlElement.appendChild(svgContainer);
        this.SVGContainer = svgContainer;
    }
    /**
     * Measures size of parent HTML element.
     *
     * @ignore Exclude from docs
     */
    SVGContainer.prototype.measure = function () {
        var width = $utils.width(this.htmlElement);
        var height = $utils.height(this.htmlElement);
        var container = this.container;
        if (container) {
            if (this.width != width || this.height != height) {
                this.width = width;
                this.height = height;
                if (width > 0) {
                    container.maxWidth = width;
                }
                if (height > 0) {
                    container.maxHeight = height;
                }
                $dom.fixPixelPerfect(this.SVGContainer);
            }
            if (!container.maxWidth) {
                container.maxWidth = 0;
            }
            if (!container.maxHeight) {
                container.maxHeight = 0;
            }
        }
    };
    Object.defineProperty(SVGContainer.prototype, "container", {
        /**
         * @return {Optional<Container>} Container
         */
        get: function () {
            return this._container;
        },
        /**
         * A [[Container]] element which is placed into container.
         *
         * @param {Optional<Container>}  container  Container
         */
        set: function (container) {
            this._container = container;
            this.measure();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns if this object has been already been disposed.
     *
     * @return {boolean} Is disposed?
     */
    SVGContainer.prototype.isDisposed = function () {
        return this._disposed;
    };
    /**
     * Removes this container from SVG container list in system, which
     * effectively disables size change monitoring for it.
     */
    SVGContainer.prototype.dispose = function () {
        if (!this._disposed) {
            $array.remove(svgContainers, this);
        }
    };
    return SVGContainer;
}());
export { SVGContainer };
//# sourceMappingURL=SVGContainer.js.map