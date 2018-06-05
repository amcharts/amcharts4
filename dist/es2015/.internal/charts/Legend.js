/**
 * Legend-related functionality.
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
import { Component } from "../core/Component";
import { DataItem } from "../core/DataItem";
import { ListTemplate } from "../core/utils/List";
import { RoundedRectangle } from "../core/elements/RoundedRectangle";
import { Container } from "../core/Container";
import { Label } from "../core/elements/Label";
import { keyboard } from "../core/utils/Keyboard";
import { registry } from "../core/Registry";
import { getInteraction } from "../core/interaction/Interaction";
import { percent } from "../core/utils/Percent";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import * as $type from "../core/utils/Type";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[Legend]].
 *
 * @see {@link DataItem}
 */
var LegendDataItem = /** @class */ (function (_super) {
    __extends(LegendDataItem, _super);
    /**
     * Constructor
     */
    function LegendDataItem() {
        var _this = _super.call(this) || this;
        _this.className = "LegendDataItem";
        _this.applyTheme();
        return _this;
    }
    return LegendDataItem;
}(DataItem));
export { LegendDataItem };
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines a class that carries legend settings.
 *
 * A legend might change its settings dynamically. Legend can also be shared
 * by several elements, requiring different settings.
 *
 * Having legend's settings in a separate object is a good way to "hot swap"
 * a set of settings for the legend.
 */
var LegendSettings = /** @class */ (function () {
    function LegendSettings() {
        /**
         * Should marker be created for each legend item.
         *
         * @type {boolean}
         */
        this.createMarker = true;
    }
    return LegendSettings;
}());
export { LegendSettings };
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * [[Legend]] class is used to create legend for the chart.
 *
 * @see {@link ILegendEvents} for a list of available events
 * @see {@link ILegendAdapters} for a list of available Adapters
 * @todo Verify/implement dynamic updating of legend items once the properties of related Series change
 */
var Legend = /** @class */ (function (_super) {
    __extends(Legend, _super);
    /**
     * Constructor
     */
    function Legend() {
        var _this = _super.call(this) || this;
        _this.className = "Legend";
        // Set defaults
        _this.layout = "grid";
        _this.useDefaultMarker = false;
        _this.contentAlign = "center";
        // Create a template container and list for legend items
        var itemContainer = new Container();
        itemContainer.padding(10, 0, 10, 0);
        itemContainer.margin(0, 5, 0, 0);
        itemContainer.layout = "horizontal";
        itemContainer.clickable = true;
        itemContainer.focusable = true;
        itemContainer.role = "checkbox";
        itemContainer.background.opacity = 0; // creates hit area
        itemContainer.togglable = true;
        // Add click/tap event to toggle item
        itemContainer.events.on("hit", function (ev) {
            _this.toggleDataItem(ev.target.dataItem);
        }, _this);
        // Add focus event so that we can track which object is currently in focus
        // for keyboard toggling
        itemContainer.events.on("focus", function (ev) {
            _this.focusedItem = ev.target.dataItem;
        });
        itemContainer.events.on("blur", function (ev) {
            _this.focusedItem = undefined;
        });
        // Create container list using item template we just created
        _this.itemContainers = new ListTemplate(itemContainer);
        // Set up global keyboard events for toggling elements
        _this._disposers.push(getInteraction().body.events.on("keyup", function (ev) {
            if (keyboard.isKey(ev.event, "enter") && _this.focusedItem) {
                _this.toggleDataItem(_this.focusedItem);
            }
        }, _this));
        var interfaceColors = new InterfaceColorSet();
        // Create a template container and list for the a marker
        var marker = new Container();
        marker.width = 23;
        marker.height = 23;
        marker.interactionsEnabled = false;
        marker.setStateOnChildren = true;
        marker.propertyFields.fill = "fill";
        var disabledColor = interfaceColors.getFor("disabledBackground");
        marker.events.on("childadded", function (event) {
            var activeState = event.newValue.states.create("active");
            activeState.properties.stroke = disabledColor;
            activeState.properties.fill = disabledColor;
        });
        _this.markers = new ListTemplate(marker);
        // Create a legend background element
        var rectangle = marker.createChild(RoundedRectangle);
        rectangle.width = percent(100);
        rectangle.height = percent(100);
        // Create a template container and list for item labels
        var label = new Label();
        label.text = "{name}";
        label.margin(0, 5, 0, 5);
        label.valign = "middle";
        label.states.create("active").properties.fill = interfaceColors.getFor("disabledBackground");
        label.renderingFrequency = 2;
        _this.labels = new ListTemplate(label);
        // Create a template container and list for item value labels
        var valueLabel = new Label();
        valueLabel.margin(0, 5, 0, 0);
        valueLabel.valign = "middle";
        valueLabel.width = 40; // to avoid rearranging legend entries when value changes.
        valueLabel.align = "right";
        valueLabel.textAlign = "end";
        valueLabel.states.create("active").properties.fill = interfaceColors.getFor("disabledBackground");
        valueLabel.renderingFrequency = 2;
        _this.valueLabels = new ListTemplate(valueLabel);
        _this.position = "bottom";
        // Create a state for disabled legend items
        itemContainer.states.create("active");
        itemContainer.setStateOnChildren = true;
        // Apply accessibility settings
        _this.role = "group";
        _this.applyTheme();
        return _this;
    }
    /**
     * Sets defaults that instantiate some objects that rely on parent, so they
     * cannot be set in constructor.
     */
    Legend.prototype.applyInternalDefaults = function () {
        _super.prototype.applyInternalDefaults.call(this);
        if (!$type.hasValue(this.readerTitle)) {
            this.readerTitle = this.language.translate("Legend");
        }
    };
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return {LegendDataItem} Data Item
     */
    Legend.prototype.createDataItem = function () {
        return new LegendDataItem();
    };
    /**
     * Removes children before calling validate method of the super class. (which
     * initiates building of the legend)
     *
     * @ignore Exclude from docs
     */
    Legend.prototype.validate = function () {
        this.removeChildren();
        _super.prototype.validate.call(this);
    };
    /**
     * [validateDataElement description]
     *
     * @ignore Exclude from docs
     * @param {LegendDataItem} dataItem Data item
     * @todo Description
     * @todo Figure out how to update appearance of legend item without losing focus
     * @todo Update legend marker appearance as apperance of related series changes
     */
    Legend.prototype.validateDataElement = function (dataItem) {
        _super.prototype.validateDataElement.call(this, dataItem);
        // Get data item (legend item's) container and assign it to legend container
        var container = dataItem.itemContainer;
        if (!container) {
            // Create new container for the data item
            container = this.itemContainers.create();
            dataItem.addSprite(container);
            container.readerTitle = this.language.translate("Click, tap or press ENTER to toggle");
            container.readerControls = dataItem.dataContext.uidAttr();
            container.readerLabelledBy = dataItem.dataContext.uidAttr();
            dataItem.itemContainer = container;
            // Add an event to check for item's properties
            // We cannot do this on a template since template does not have
            // dataContext, yet
            dataItem.dataContext.events.on("propertychanged", function (ev) {
                if (ev.property == "visible") {
                    container.readerChecked = dataItem.dataContext.visible;
                }
                else {
                    //this.validateDataElement(dataItem);
                }
            });
        }
        // Set parent and update current state
        container.parent = this;
        container.readerChecked = dataItem.dataContext.visible;
        // Create a marker for legend item
        var marker = dataItem.marker;
        if (!marker) {
            marker = this.markers.create();
            marker.parent = container;
            dataItem.marker = marker;
        }
        // If we are not using default markers, create a unique legend marker based
        // on the data item type
        if (!this.useDefaultMarker) {
            dataItem.dataContext.createLegendMarker(marker);
        }
        // Create label
        var label = dataItem.label;
        if (!label) {
            label = this.labels.create();
            label.parent = container;
            dataItem.label = label;
        }
        // Create value label
        var valueLabel = dataItem.valueLabel;
        if (!valueLabel) {
            valueLabel = this.valueLabels.create();
            valueLabel.parent = container;
            dataItem.valueLabel = valueLabel;
        }
        // Tell series its legend data item
        dataItem.dataContext.legendDataItem = dataItem;
    };
    Object.defineProperty(Legend.prototype, "position", {
        /**
         * @return {LegendPosition} Position
         */
        get: function () {
            return this.getPropertyValue("position");
        },
        /**
         * Position of the legend.
         *
         * Options: "left", "right", "top", "bottom" (default), or "absolute".
         *
         * @default "bottom"
         * @param {LegendPosition}  value  Position
         */
        set: function (value) {
            if (this.setPropertyValue("position", value)) {
                if (value == "left" || value == "right") {
                    this.margin(10, 20, 10, 20);
                    this.valign = "middle";
                    this.itemContainers.template.width = percent(100);
                    this.valueLabels.template.width = percent(100);
                }
                else {
                    this.itemContainers.template.maxWidth = undefined;
                    this.width = percent(100);
                    this.valueLabels.template.width = 40;
                }
                this.invalidate();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Legend.prototype, "useDefaultMarker", {
        /**
         * @return {boolean} Use default marker?
         */
        get: function () {
            return this.getPropertyValue("useDefaultMarker");
        },
        /**
         * Should legend try to mirror the look of the related item when building
         * the marker for legend item?
         *
         * If set to `true` it will try to make the marker look like its related
         * item.
         *
         * E.g. if an item is for a Line Series, it will display a line of the
         * same thickness, color, and will use the same bullets if series have them.
         *
         * @default false
         * @param {boolean} value Use default marker?
         */
        set: function (value) {
            this.setPropertyValue("useDefaultMarker", value, true);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Toggles a legend item.
     *
     * @ignore Exclude from docs
     * @param {this["_dataItem"]} item Legend item
     * @todo Maybe do it with togglable instead
     */
    Legend.prototype.toggleDataItem = function (item) {
        var dataContext = item.dataContext;
        if (!dataContext.visible || dataContext.isHiding) {
            dataContext.show();
        }
        else {
            dataContext.hide();
        }
    };
    Object.defineProperty(Legend.prototype, "preloader", {
        /**
         * Override preloader method so that legend does not accidentally show its
         * own preloader.
         *
         * @ignore Exclude from docs
         * @return {Preloader} Always `undefined`
         */
        get: function () {
            return;
        },
        enumerable: true,
        configurable: true
    });
    return Legend;
}(Component));
export { Legend };
/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Legend"] = Legend;
//# sourceMappingURL=Legend.js.map