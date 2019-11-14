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
import * as $utils from "../core/utils/Utils";
import * as $type from "../core/utils/Type";
import { Sprite } from "../core/Sprite";
import { Disposer } from "../core/utils/Disposer";
import { MouseCursorStyle } from "../core/interaction/Mouse";
import { defaultRules, ResponsiveBreakpoints } from "../core/utils/Responsive";
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
        /**
         * A legend item's [[Label]] element.
         *
         * @return Label
         */
        get: function () {
            var _this = this;
            if (!this._label) {
                var label_1 = this.component.labels.create();
                this._label = label_1;
                this.addSprite(label_1);
                this._disposers.push(label_1);
                label_1.parent = this.itemContainer;
                this._disposers.push(new Disposer(function () {
                    if ($type.hasValue(_this.component)) {
                        _this.component.labels.removeValue(label_1);
                    }
                }));
            }
            return this._label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegendDataItem.prototype, "color", {
        /**
         * @return Main color
         */
        get: function () {
            return this.properties.color;
        },
        /**
         * Main color of legend data item.
         *
         * This is set by the target element this legend item represents, like
         * a Series or a Slice.
         *
         * It can be used to derive a color in legend's sub-items, like label:
         *
         * ```TypeScript
         * chart.legend.labels.template.text = "[{color}]{name}[/]";
         * ```
         * ```JavaScript
         * chart.legend.labels.template.text = "[{color}]{name}[/]";
         * ```
         * ```JSON
         * {
         *   // ...
         *   "legend": {
         *     // ...
         *     "labels": {
         *       "text": "[{color}]{name}[/]"
         *     }
         *   }
         * }
         * ```
         *
         * @see {@link https://www.amcharts.com/docs/v4/concepts/legend/#Legend_labels} For more information about configuring legend labels.
         * @param value  Main color
         */
        set: function (value) {
            this.setProperty("color", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegendDataItem.prototype, "valueLabel", {
        /**
         * A legend item's [[Label]] element for "value label".
         *
         * @return Label
         */
        get: function () {
            var _this = this;
            if (!this._valueLabel) {
                var valueLabel_1 = this.component.valueLabels.create();
                this._valueLabel = valueLabel_1;
                this.addSprite(valueLabel_1);
                this._disposers.push(valueLabel_1);
                valueLabel_1.parent = this.itemContainer;
                this._disposers.push(new Disposer(function () {
                    if ($type.hasValue(_this.component)) {
                        _this.component.valueLabels.removeValue(valueLabel_1);
                    }
                }));
            }
            return this._valueLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegendDataItem.prototype, "itemContainer", {
        /**
         * A reference to the main [[Container]] that holds legend item's elements:
         * marker and labels.
         *
         * @return Item container
         */
        get: function () {
            var _this = this;
            if (!this._itemContainer) {
                var component_1 = this.component;
                var itemContainer_1 = component_1.itemContainers.create();
                itemContainer_1.parent = component_1;
                this._itemContainer = itemContainer_1;
                this.addSprite(itemContainer_1);
                this._disposers.push(itemContainer_1);
                // Add click/tap event to toggle item
                if (itemContainer_1.togglable) {
                    itemContainer_1.events.on("toggled", function (ev) {
                        component_1.toggleDataItem(ev.target.dataItem);
                    }, undefined, false);
                }
                // Add focus event so that we can track which object is currently in focus
                // for keyboard toggling
                if (itemContainer_1.focusable) {
                    itemContainer_1.events.on("focus", function (ev) {
                        component_1.focusedItem = ev.target.dataItem;
                    }, undefined, false);
                    itemContainer_1.events.on("blur", function (ev) {
                        component_1.focusedItem = undefined;
                    }, undefined, false);
                }
                this._disposers.push(new Disposer(function () {
                    if ($type.hasValue(_this.component)) {
                        _this.component.itemContainers.removeValue(itemContainer_1);
                    }
                }));
                if (this.dataContext.uidAttr) {
                    itemContainer_1.readerControls = this.dataContext.uidAttr();
                    itemContainer_1.readerLabelledBy = this.dataContext.uidAttr();
                }
                var sprite = this.dataContext;
                if ((sprite instanceof DataItem || sprite instanceof Sprite) && !sprite.isDisposed()) {
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
                            itemContainer_1.readerChecked = false;
                            itemContainer_1.events.disableType("toggled");
                            itemContainer_1.isActive = true;
                            itemContainer_1.events.enableType("toggled");
                        }, undefined, false));
                        itemContainer_1.addDisposer(sprite.events.on("shown", function (ev) {
                            itemContainer_1.readerChecked = true;
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
        /**
         * A [[Container]] that holds legend item's marker element.
         *
         * @return Marker
         */
        get: function () {
            var _this = this;
            if (!this._marker) {
                var marker_1 = this.component.markers.create();
                this._marker = marker_1;
                marker_1.parent = this.itemContainer;
                this.addSprite(marker_1);
                this._disposers.push(marker_1);
                this._disposers.push(new Disposer(function () {
                    if ($type.hasValue(_this.component)) {
                        _this.component.markers.removeValue(marker_1);
                    }
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
 * @see {@link https://www.amcharts.com/docs/v4/concepts/legend/} for Legend documentation
 * @see {@link ILegendEvents} for a list of available events
 * @see {@link ILegendAdapters} for a list of available Adapters
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
        itemContainer.role = "switch";
        itemContainer.togglable = true;
        itemContainer.cursorOverStyle = MouseCursorStyle.pointer;
        itemContainer.background.fillOpacity = 0; // creates hit area
        // Create container list using item template we just created
        _this.itemContainers = new ListTemplate(itemContainer);
        _this._disposers.push(new ListDisposer(_this.itemContainers));
        _this._disposers.push(_this.itemContainers.template);
        // Set up global keyboard events for toggling elements
        _this._disposers.push(getInteraction().body.events.on("keyup", function (ev) {
            if (keyboard.isKey(ev.event, "enter") && _this.focusedItem && _this.focusedItem.itemContainer.clickable) {
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
     * @return Data Item
     */
    Legend.prototype.createDataItem = function () {
        return new LegendDataItem();
    };
    /**
     * [validateDataElement description]
     *
     * @ignore Exclude from docs
     * @param dataItem Data item
     * @todo Description
     * @todo Figure out how to update appearance of legend item without losing focus
     * @todo Update legend marker appearance as apperance of related series changes
     */
    Legend.prototype.validateDataElement = function (dataItem) {
        _super.prototype.validateDataElement.call(this, dataItem);
        // Get data item (legend item's) container
        var container = dataItem.itemContainer;
        var marker = dataItem.marker;
        $utils.used(dataItem.label);
        var valueLabel = dataItem.valueLabel;
        // Set parent and update current state
        container.readerChecked = dataItem.dataContext.visible;
        // Tell series its legend data item
        dataItem.dataContext.legendDataItem = dataItem;
        var legendSettings = dataItem.dataContext.legendSettings;
        // If we are not using default markers, create a unique legend marker based
        // on the data item type
        var dataContext = dataItem.dataContext;
        if (dataContext.createLegendMarker && (!this.useDefaultMarker || !(dataContext instanceof Sprite))) {
            if (!dataItem.childrenCreated) {
                dataContext.createLegendMarker(marker);
                dataItem.childrenCreated = true;
            }
        }
        if (dataContext.updateLegendValue) {
            dataContext.updateLegendValue(); // this solves issue with external legend, as legend is created after chart updates legend values
        }
        if (dataContext.component && dataContext.component.updateLegendValue) {
            dataContext.component.updateLegendValue(dataContext);
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
        if (legendSettings && (legendSettings.itemValueText != undefined || legendSettings.valueText != undefined)) {
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
         * @return Position
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
         * @param value  Position
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
         * @return Use default marker?
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
         * @param value Use default marker?
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
     * @param item Legend item
     * @todo Maybe do it with togglable instead
     */
    Legend.prototype.toggleDataItem = function (item) {
        var dataContext = item.dataContext;
        if (!dataContext.visible || dataContext.isHiding || (dataContext instanceof Sprite && dataContext.isHidden)) {
            item.color = item.colorOrig;
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
            item.color = new InterfaceColorSet().getFor("disabledBackground");
        }
    };
    Object.defineProperty(Legend.prototype, "preloader", {
        /**
         * Override preloader method so that legend does not accidentally show its
         * own preloader.
         *
         * @ignore Exclude from docs
         * @return Always `undefined`
         */
        get: function () {
            return;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * [handleDataItemPropertyChange description]
     *
     * @ignore Exclude from docs
     */
    Legend.prototype.handleDataItemPropertyChange = function (dataItem, name) {
        dataItem.valueLabel.invalidate();
        dataItem.label.invalidate();
    };
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
/**
 * Add default responsive rules
 */
/**
 * Move legend to below the chart if chart is narrow
 */
defaultRules.push({
    relevant: ResponsiveBreakpoints.widthXS,
    state: function (target, stateId) {
        if (target instanceof Legend && (target.position == "left" || target.position == "right")) {
            var state = target.states.create(stateId);
            state.properties.position = "bottom";
            return state;
        }
        return null;
    }
});
/**
 * Move legend to the right if chart is very short
 */
defaultRules.push({
    relevant: ResponsiveBreakpoints.heightXS,
    state: function (target, stateId) {
        if (target instanceof Legend && (target.position == "top" || target.position == "bottom")) {
            var state = target.states.create(stateId);
            state.properties.position = "right";
            return state;
        }
        return null;
    }
});
/**
 * Disable legend altogether on small charts
 */
defaultRules.push({
    relevant: ResponsiveBreakpoints.isXS,
    state: function (target, stateId) {
        if (target instanceof Legend) {
            var state = target.states.create(stateId);
            state.properties.disabled = true;
            return state;
        }
        return null;
    }
});
//# sourceMappingURL=Legend.js.map