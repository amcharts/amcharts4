/**
 * Legend-related functionality.
 */
import * as tslib_1 from "tslib";
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Component } from "../core/Component";
import { DataItem } from "../core/DataItem";
import { ListTemplate, ListDisposer } from "../core/utils/List";
import { RoundedRectangle } from "../core/elements/RoundedRectangle";
import { Container } from "../core/Container";
import { Label } from "../core/elements/Label";
import { keyboard } from "../core/utils/Keyboard";
import { registry } from "../core/Registry";
import { getInteraction } from "../core/interaction/Interaction";
import { percent } from "../core/utils/Percent";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import * as $type from "../core/utils/Type";
import { Sprite } from "../core/Sprite";
import { Disposer } from "../core/utils/Disposer";
import { MouseCursorStyle } from "../core/interaction/Mouse";
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
    tslib_1.__extends(LegendDataItem, _super);
    /**
     * Constructor
     */
    function LegendDataItem() {
        var _this = _super.call(this) || this;
        /**
         * @ignore
         */
        _this.childrenCreated = false;
        _this.className = "LegendDataItem";
        _this.applyTheme();
        return _this;
    }
    Object.defineProperty(LegendDataItem.prototype, "label", {
        get: function () {
            var _this = this;
            if (!this._label) {
                var label_1 = this.component.labels.create();
                this._label = label_1;
                this.addSprite(label_1);
                this._disposers.push(label_1);
                label_1.parent = this.itemContainer;
                this._disposers.push(new Disposer(function () {
                    _this.component.labels.removeValue(label_1);
                }));
            }
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegendDataItem.prototype, "valueLabel", {
        get: function () {
            var _this = this;
            if (!this._valueLabel) {
                var valueLabel_1 = this.component.valueLabels.create();
                this._valueLabel = valueLabel_1;
                this.addSprite(valueLabel_1);
                this._disposers.push(valueLabel_1);
                valueLabel_1.parent = this.itemContainer;
                this._disposers.push(new Disposer(function () {
                    _this.component.valueLabels.removeValue(valueLabel_1);
                }));
            }
            return this._valueLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegendDataItem.prototype, "itemContainer", {
        get: function () {
            var _this = this;
            if (!this._itemContainer) {
                var itemContainer_1 = this.component.itemContainers.create();
                this._itemContainer = itemContainer_1;
                this.addSprite(itemContainer_1);
                this._disposers.push(itemContainer_1);
                this._disposers.push(new Disposer(function () {
                    _this.component.itemContainers.removeValue(itemContainer_1);
                }));
                if (this.dataContext.uidAttr) {
                    itemContainer_1.readerControls = this.dataContext.uidAttr();
                    itemContainer_1.readerLabelledBy = this.dataContext.uidAttr();
                }
                var sprite = this.dataContext;
                if (sprite instanceof DataItem || sprite instanceof Sprite) {
                    itemContainer_1.addDisposer(sprite.events.on("visibilitychanged", function (ev) {
                        itemContainer_1.readerChecked = ev.visible;
                        itemContainer_1.events.disableType("toggled");
                        itemContainer_1.isActive = !ev.visible;
                        itemContainer_1.events.enableType("toggled");
                    }, undefined, false));
                    sprite.addDisposer(new Disposer(function () {
                        if (_this.component) {
                            _this.component.dataItems.remove(_this);
                        }
                    }));
                    if (sprite instanceof Sprite) {
                        itemContainer_1.addDisposer(sprite.events.on("hidden", function (ev) {
                            itemContainer_1.readerChecked = true;
                            itemContainer_1.events.disableType("toggled");
                            itemContainer_1.isActive = true;
                            itemContainer_1.events.enableType("toggled");
                        }, undefined, false));
                        itemContainer_1.addDisposer(sprite.events.on("shown", function (ev) {
                            itemContainer_1.readerChecked = false;
                            itemContainer_1.events.disableType("toggled");
                            itemContainer_1.isActive = false;
                            itemContainer_1.events.enableType("toggled");
                        }, undefined, false));
                    }
                }
            }
            return this._itemContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegendDataItem.prototype, "marker", {
        get: function () {
            var _this = this;
            if (!this._marker) {
                var marker_1 = this.component.markers.create();
                this._marker = marker_1;
                marker_1.parent = this.itemContainer;
                this.addSprite(marker_1);
                this._disposers.push(marker_1);
                this._disposers.push(new Disposer(function () {
                    _this.component.markers.removeValue(marker_1);
                }));
            }
            return this._marker;
        },
        enumerable: true,
        configurable: true
    });
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
    tslib_1.__extends(Legend, _super);
    /**
     * Constructor
     */
    function Legend() {
        var _this = _super.call(this) || this;
        _this.className = "Legend";
        // Set defaults
        _this.layout = "grid";
        _this.setPropertyValue("useDefaultMarker", false);
        _this.setPropertyValue("contentAlign", "center");
        // Create a template container and list for legend items
        var itemContainer = new Container();
        itemContainer.applyOnClones = true;
        itemContainer.padding(10, 0, 10, 0);
        itemContainer.margin(0, 10, 0, 0);
        itemContainer.layout = "horizontal";
        itemContainer.clickable = true;
        itemContainer.focusable = true;
        itemContainer.role = "checkbox";
        itemContainer.togglable = true;
        itemContainer.cursorOverStyle = MouseCursorStyle.pointer;
        itemContainer.background.fillOpacity = 0; // creates hit area
        // Add click/tap event to toggle item
        // not good to listen to "toggled" as we will get to stackoverflow
        itemContainer.events.on("toggled", function (ev) {
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
        _this._disposers.push(new ListDisposer(_this.itemContainers));
        _this._disposers.push(_this.itemContainers.template);
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
        marker.applyOnClones = true;
        marker.setStateOnChildren = true;
        marker.background.fillOpacity = 0;
        marker.background.strokeOpacity = 0;
        marker.propertyFields.fill = "fill";
        marker.valign = "middle";
        var disabledColor = interfaceColors.getFor("disabledBackground");
        marker.events.on("childadded", function (event) {
            var child = event.newValue;
            var activeState = child.states.create("active");
            activeState.properties.stroke = disabledColor;
            activeState.properties.fill = disabledColor;
        });
        _this.markers = new ListTemplate(marker);
        _this._disposers.push(new ListDisposer(_this.markers));
        _this._disposers.push(_this.markers.template);
        // Create a legend background element
        var rectangle = marker.createChild(RoundedRectangle);
        rectangle.width = percent(100);
        rectangle.height = percent(100);
        rectangle.applyOnClones = true;
        rectangle.propertyFields.fill = "fill";
        rectangle.strokeOpacity = 0;
        // Create a template container and list for item labels
        var label = new Label();
        label.text = "{name}";
        label.margin(0, 5, 0, 5);
        label.valign = "middle";
        label.applyOnClones = true;
        label.states.create("active").properties.fill = interfaceColors.getFor("disabledBackground");
        _this.labels = new ListTemplate(label);
        _this._disposers.push(new ListDisposer(_this.labels));
        _this._disposers.push(_this.labels.template);
        label.interactionsEnabled = false;
        // Create a template container and list for item value labels
        var valueLabel = new Label();
        valueLabel.margin(0, 5, 0, 0);
        valueLabel.valign = "middle";
        valueLabel.width = 50; // to avoid rearranging legend entries when value changes.
        valueLabel.align = "right";
        valueLabel.textAlign = "end";
        valueLabel.applyOnClones = true;
        valueLabel.states.create("active").properties.fill = interfaceColors.getFor("disabledBackground");
        valueLabel.interactionsEnabled = false;
        _this.valueLabels = new ListTemplate(valueLabel);
        _this._disposers.push(new ListDisposer(_this.valueLabels));
        _this._disposers.push(_this.valueLabels.template);
        _this.position = "bottom"; // don't use setPropertyValue here!
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
        // Get data item (legend item's) container
        var container = dataItem.itemContainer;
        var marker = dataItem.marker;
        var label = dataItem.label;
        var valueLabel = dataItem.valueLabel;
        // Set parent and update current state
        container.parent = this;
        container.readerChecked = dataItem.dataContext.visible;
        // Tell series its legend data item
        dataItem.dataContext.legendDataItem = dataItem;
        // If we are not using default markers, create a unique legend marker based
        // on the data item type
        if (dataItem.dataContext.createLegendMarker && !this.useDefaultMarker) {
            if (!dataItem.childrenCreated) {
                dataItem.dataContext.createLegendMarker(marker);
                dataItem.childrenCreated = true;
            }
        }
        if (valueLabel.invalid) {
            valueLabel.validate();
        }
        if (valueLabel.currentText == "" || valueLabel.currentText == undefined) {
            valueLabel.__disabled = true;
        }
        else {
            valueLabel.__disabled = false;
        }
        var visible = dataItem.dataContext.visible;
        if (visible === undefined) {
            visible = true;
        }
        visible = $type.toBoolean(visible);
        dataItem.dataContext.visible = visible;
        container.events.disableType("toggled");
        container.isActive = !visible;
        container.events.enableType("toggled");
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
         * IMPORTANT: [[MapChart]] will ignore this setting, as it is using different
         * layout structure than other charts.
         *
         * To position legend in [[MapChart]] set legend's `align` (`"left"` or
         * `"right"`) and `valign` (`"top"` or `"bottom"`) properties instead.
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
                    this.labels.template.truncate = true;
                    this.labels.template.fullWords = false;
                }
                else {
                    this.itemContainers.template.width = undefined;
                    this.itemContainers.template.maxWidth = undefined;
                    this.valueLabels.template.width = 50;
                    this.labels.template.truncate = false;
                    this.width = percent(100);
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
        if (!dataContext.visible || dataContext.isHiding || (dataContext instanceof Sprite && dataContext.isHidden)) {
            item.itemContainer.isActive = false;
            if (dataContext.hidden === true) {
                dataContext.hidden = false;
            }
            if (dataContext.show) {
                dataContext.show();
            }
            else {
                dataContext.visible = true;
            }
        }
        else {
            item.itemContainer.isActive = true;
            if (dataContext.hide) {
                dataContext.hide();
            }
            else {
                dataContext.visible = false;
            }
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