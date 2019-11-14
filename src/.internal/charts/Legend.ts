/**
 * Legend-related functionality.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Component, IComponentProperties, IComponentDataFields, IComponentAdapters, IComponentEvents } from "../core/Component";
import { DataItem } from "../core/DataItem";
import { ListTemplate, ListDisposer } from "../core/utils/List";
import { RoundedRectangle } from "../core/elements/RoundedRectangle";
import { Container } from "../core/Container";
import { Label } from "../core/elements/Label";
import { Optional } from "../core/utils/Type";
import { Preloader } from "../core/elements/Preloader";
import { keyboard } from "../core/utils/Keyboard";
import { registry } from "../core/Registry";
import { getInteraction } from "../core/interaction/Interaction";
import { percent } from "../core/utils/Percent";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import { Color } from "../core/utils/Color";
import { RadialGradient } from "../core/rendering/fills/RadialGradient";
import { LinearGradient } from "../core/rendering/fills/LinearGradient";
import { Pattern } from "../core/rendering/fills/Pattern";
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
export class LegendDataItem extends DataItem {

	/**
	 * A container data item's elements will be placed in.
	 */
	protected _itemContainer: Container;

	/**
	 * A [[Label]] element for the item label.
	 */
	protected _label: Label;

	/**
	 * A [[Container]] for legend item marker.
	 */
	protected _marker: Container;

	/**
	 * A [[Label]] element for the value label.
	 */
	protected _valueLabel: Label;

	/**
	 * A data context for legend item.
	 */
	public dataContext: any;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: Legend;

	/**
	 * @ignore
	 */
	public childrenCreated: boolean = false;

	/**
	 * @ignore
	 */
	public colorOrig: $type.Optional<Color | Pattern | LinearGradient | RadialGradient>;


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "LegendDataItem";
		this.applyTheme();
	}

	/**
	 * A legend item's [[Label]] element.
	 *
	 * @return Label
	 */
	public get label(): Label {
		if (!this._label) {
			let label = this.component.labels.create();
			this._label = label;
			this.addSprite(label);
			this._disposers.push(label);
			label.parent = this.itemContainer;

			this._disposers.push(new Disposer(() => {
				if ($type.hasValue(this.component)) {
					this.component.labels.removeValue(label);
				}
			}));
		}
		return this._label;
	}

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
	public set color(value: $type.Optional<Color | Pattern | LinearGradient | RadialGradient>) {
		this.setProperty("color", value);
	}

	/**
	 * @return Main color
	 */
	public get color(): $type.Optional<Color | Pattern | LinearGradient | RadialGradient> {
		return this.properties.color;
	}

	/**
	 * A legend item's [[Label]] element for "value label".
	 *
	 * @return Label
	 */
	public get valueLabel(): Label {
		if (!this._valueLabel) {
			let valueLabel = this.component.valueLabels.create();
			this._valueLabel = valueLabel;

			this.addSprite(valueLabel);
			this._disposers.push(valueLabel);
			valueLabel.parent = this.itemContainer;

			this._disposers.push(new Disposer(() => {
				if ($type.hasValue(this.component)) {
					this.component.valueLabels.removeValue(valueLabel);
				}
			}));
		}
		return this._valueLabel;
	}

	/**
	 * A reference to the main [[Container]] that holds legend item's elements:
	 * marker and labels.
	 *
	 * @return Item container
	 */
	public get itemContainer(): Container {
		if (!this._itemContainer) {

			let component = this.component;

			let itemContainer = component.itemContainers.create();
			itemContainer.parent = component;
			this._itemContainer = itemContainer;
			this.addSprite(itemContainer);
			this._disposers.push(itemContainer);

			// Add click/tap event to toggle item
			if(itemContainer.togglable){
				itemContainer.events.on("toggled", (ev) => {
					component.toggleDataItem(<this>ev.target.dataItem);
				}, undefined, false);
			}

			// Add focus event so that we can track which object is currently in focus
			// for keyboard toggling
			if (itemContainer.focusable) {
				itemContainer.events.on("focus", (ev) => {
					component.focusedItem = <this>ev.target.dataItem;
				}, undefined, false);
				itemContainer.events.on("blur", (ev) => {
					component.focusedItem = undefined;
				}, undefined, false);
			}

			this._disposers.push(new Disposer(() => {
				if ($type.hasValue(this.component)) {
					this.component.itemContainers.removeValue(itemContainer);
				}
			}));

			if (this.dataContext.uidAttr) {
				itemContainer.readerControls = this.dataContext.uidAttr();
				itemContainer.readerLabelledBy = this.dataContext.uidAttr();
			}

			let sprite = <any>this.dataContext;
			if ((sprite instanceof DataItem || sprite instanceof Sprite) && !sprite.isDisposed())  {

				itemContainer.addDisposer(
					sprite.events.on("visibilitychanged", (ev) => {
						itemContainer.readerChecked = ev.visible;
						itemContainer.events.disableType("toggled");
						itemContainer.isActive = !ev.visible;
						itemContainer.events.enableType("toggled");
					}, undefined, false)
				)

				sprite.addDisposer(new Disposer(() => {
					if (this.component) {
						this.component.dataItems.remove(this);
					}
				}))

				if (sprite instanceof Sprite) {
					itemContainer.addDisposer(
						sprite.events.on("hidden", (ev) => {
							itemContainer.readerChecked = false;
							itemContainer.events.disableType("toggled");
							itemContainer.isActive = true;
							itemContainer.events.enableType("toggled");
						}, undefined, false)
					)
					itemContainer.addDisposer(
						sprite.events.on("shown", (ev) => {
							itemContainer.readerChecked = true;
							itemContainer.events.disableType("toggled");
							itemContainer.isActive = false;
							itemContainer.events.enableType("toggled");
						}, undefined, false)
					)
				}
			}
		}
		return this._itemContainer;
	}

	/**
	 * A [[Container]] that holds legend item's marker element.
	 *
	 * @return Marker
	 */
	public get marker(): Container {
		if (!this._marker) {
			let marker = this.component.markers.create();
			this._marker = marker;
			marker.parent = this.itemContainer;
			this.addSprite(marker);
			this._disposers.push(marker);

			this._disposers.push(new Disposer(() => {
				if ($type.hasValue(this.component)) {
					this.component.markers.removeValue(marker);
				}
			}));
		}
		return this._marker;
	}
}


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
export class LegendSettings {

	/**
	 * [valueText description]
	 *
	 * @todo Description
	 */
	public valueText: string;

	/**
	 * [labelText description]
	 *
	 * @todo Description
	 */
	public labelText: string;

	/**
	 * A text template for the value part of the legend item.
	 */
	public itemValueText: string;

	/**
	 * A text template for the label part of the legend item.
	 */
	public itemLabelText: string;

	/**
	 * Should marker be created for each legend item.
	 */
	public createMarker: boolean = true;
}

/**
 * Represents types available for Legend position. Not all charts will pay attention to this, like MapChart. You'll need to use legend.align and legend.valign properties to position legend on MapChart.
 */
export type LegendPosition = "left" | "right" | "top" | "bottom" | "absolute";

/**
 * Defines data fields for [[Legend]].
 */
export interface ILegendDataFields extends IComponentDataFields {

	/**
	 * A field name in the data item which holds name of the legend item.
	 */
	name?: string;

	/**
	 * A field name in data item which holds boolean value whether item should
	 * be displayed in legend or not.
	 */
	visible?: string;
}

/**
 * Defines properties for [[Legend]].
 */
export interface ILegendProperties extends IComponentProperties {

	/**
	 * Should legend use default marker?
	 *
	 * If set to `false`, the legend will try to mirror the look of the actual
	 * item, like series.
	 *
	 * @default true
	 */
	useDefaultMarker?: boolean;

	/**
	 * Position of the legend.
	 *
	 * Options: "left", "right", "top", "bottom" (default), or "absolute".
	 *
	 * @default "bottom"
	 */
	position?: LegendPosition

}

/**
 * Defines events for [[Legend]].
 */
export interface ILegendEvents extends IComponentEvents { }

/**
 * Defines adapters for [[Legend]].
 *
 * @see {@link Adapter}
 */
export interface ILegendAdapters extends IComponentAdapters, ILegendProperties { }

export interface ILegendItemEvents {
	propertychanged: {
		/**
		 * Property key.
		 */
		property: string;
	};
}

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
export class Legend extends Component {

	/**
	 * Defines the type of the data fields.
	 */
	public _dataFields: ILegendDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ILegendProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ILegendAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ILegendEvents;

	/**
	 * Defines data item type.
	 */
	public _dataItem: LegendDataItem;

	/**
	 * List of legend Item containers. Legend item containers contain marker, title label and value label.
	 */
	public itemContainers: ListTemplate<Container>;

	/**
	 * List of legend item labels.
	 */
	public labels: ListTemplate<Label>;

	/**
	 * List of legend item markers.
	 */
	public markers: ListTemplate<Container>;

	/**
	 * List of legend item value labels.
	 */
	public valueLabels: ListTemplate<Label>;

	/**
	 * Currently focused legend item (for toggling via keyboard)
	 */
	public focusedItem: Optional<this["_dataItem"]>;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Legend";

		// Set defaults
		this.layout = "grid";
		this.setPropertyValue("useDefaultMarker", false);
		this.setPropertyValue("contentAlign", "center");

		// Create a template container and list for legend items
		let itemContainer: Container = new Container();
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
		this.itemContainers = new ListTemplate<Container>(itemContainer);
		this._disposers.push(new ListDisposer(this.itemContainers));
		this._disposers.push(this.itemContainers.template);

		// Set up global keyboard events for toggling elements
		this._disposers.push(getInteraction().body.events.on("keyup", (ev) => {
			if (keyboard.isKey(ev.event, "enter") && this.focusedItem && this.focusedItem.itemContainer.clickable) {
				this.toggleDataItem(this.focusedItem);
			}
		}, this));

		let interfaceColors = new InterfaceColorSet();

		// Create a template container and list for the a marker
		let marker: Container = new Container();
		marker.width = 23;
		marker.height = 23;
		marker.interactionsEnabled = false;
		marker.applyOnClones = true;
		marker.setStateOnChildren = true;
		marker.background.fillOpacity = 0;
		marker.background.strokeOpacity = 0;
		marker.propertyFields.fill = "fill";
		marker.valign = "middle";

		let disabledColor = interfaceColors.getFor("disabledBackground");

		marker.events.on("childadded", (event) => {
			let child = event.newValue;
			let activeState = child.states.create("active");
			activeState.properties.stroke = disabledColor;
			activeState.properties.fill = disabledColor;
		});

		this.markers = new ListTemplate<Container>(marker);
		this._disposers.push(new ListDisposer(this.markers));
		this._disposers.push(this.markers.template);

		// Create a legend background element
		let rectangle: RoundedRectangle = marker.createChild(RoundedRectangle);
		rectangle.width = percent(100);
		rectangle.height = percent(100);
		rectangle.applyOnClones = true;
		rectangle.propertyFields.fill = "fill";
		rectangle.strokeOpacity = 0;

		// Create a template container and list for item labels
		let label: Label = new Label();
		label.text = "{name}";
		label.margin(0, 5, 0, 5);
		label.valign = "middle";
		label.applyOnClones = true;
		label.states.create("active").properties.fill = interfaceColors.getFor("disabledBackground");
		this.labels = new ListTemplate<Label>(label);
		this._disposers.push(new ListDisposer(this.labels));
		this._disposers.push(this.labels.template);
		label.interactionsEnabled = false;

		// Create a template container and list for item value labels
		let valueLabel: Label = new Label();
		valueLabel.margin(0, 5, 0, 0);
		valueLabel.valign = "middle";
		valueLabel.width = 50; // to avoid rearranging legend entries when value changes.
		valueLabel.align = "right";
		valueLabel.textAlign = "end";
		valueLabel.applyOnClones = true;
		valueLabel.states.create("active").properties.fill = interfaceColors.getFor("disabledBackground");
		valueLabel.interactionsEnabled = false;

		this.valueLabels = new ListTemplate<Label>(valueLabel);
		this._disposers.push(new ListDisposer(this.valueLabels));
		this._disposers.push(this.valueLabels.template);

		this.position = "bottom"; // don't use setPropertyValue here!

		// Create a state for disabled legend items
		itemContainer.states.create("active");
		itemContainer.setStateOnChildren = true;

		// Apply accessibility settings
		this.role = "group";

		this.applyTheme();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Legend");
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new LegendDataItem();
	}

	/**
	 * [validateDataElement description]
	 *
	 * @ignore Exclude from docs
	 * @param dataItem Data item
	 * @todo Description
	 * @todo Figure out how to update appearance of legend item without losing focus
	 * @todo Update legend marker appearance as apperance of related series changes
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {
		super.validateDataElement(dataItem);

		// Get data item (legend item's) container
		let container = dataItem.itemContainer;

		let marker = dataItem.marker;

		$utils.used(dataItem.label);
		let valueLabel = dataItem.valueLabel;

		// Set parent and update current state
		container.readerChecked = dataItem.dataContext.visible;

		// Tell series its legend data item
		dataItem.dataContext.legendDataItem = dataItem;

		let legendSettings = dataItem.dataContext.legendSettings;

		// If we are not using default markers, create a unique legend marker based
		// on the data item type
		let dataContext = dataItem.dataContext;

		if (dataContext.createLegendMarker && (!this.useDefaultMarker || !(dataContext instanceof Sprite))) {
			if (!dataItem.childrenCreated) {
				dataContext.createLegendMarker(marker);
				dataItem.childrenCreated = true;
			}
		}

		if (dataContext.updateLegendValue) {
			dataContext.updateLegendValue(); // this solves issue with external legend, as legend is created after chart updates legend values
		}		

		if(dataContext.component && dataContext.component.updateLegendValue){
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


		let visible = dataItem.dataContext.visible;
		if (visible === undefined) {
			visible = true;
		}
		visible = $type.toBoolean(visible);
		dataItem.dataContext.visible = visible;

		container.events.disableType("toggled");
		container.isActive = !visible;
		container.events.enableType("toggled");
	}

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
	public set position(value: LegendPosition) {
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
	}

	/**
	 * @return Position
	 */
	public get position(): LegendPosition {
		return this.getPropertyValue("position");
	}

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
	public set useDefaultMarker(value: boolean) {
		this.setPropertyValue("useDefaultMarker", value, true);
	}

	/**
	 * @return Use default marker?
	 */
	public get useDefaultMarker(): boolean {
		return this.getPropertyValue("useDefaultMarker");
	}

	/**
	 * Toggles a legend item.
	 *
	 * @ignore Exclude from docs
	 * @param item Legend item
	 * @todo Maybe do it with togglable instead
	 */
	public toggleDataItem(item: this["_dataItem"]): void {
		let dataContext = item.dataContext;

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

	}

	/**
	 * Override preloader method so that legend does not accidentally show its
	 * own preloader.
	 *
	 * @ignore Exclude from docs
	 * @return Always `undefined`
	 */
	public get preloader(): Optional<Preloader> {
		return;
	}

	/**
	 * [handleDataItemPropertyChange description]
	 *
	 * @ignore Exclude from docs
	 */
	public handleDataItemPropertyChange(dataItem?: this["_dataItem"], name?: string): void {
		dataItem.valueLabel.invalidate();
		dataItem.label.invalidate();
	}

}

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
	state: function(target, stateId) {
		if (target instanceof Legend && (target.position == "left" || target.position == "right")) {
			let state = target.states.create(stateId);
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
	state: function(target, stateId) {
		if (target instanceof Legend && (target.position == "top" || target.position == "bottom")) {
			let state = target.states.create(stateId);
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
	state: function(target, stateId) {
		if (target instanceof Legend) {
			let state = target.states.create(stateId);
			state.properties.disabled = true;
			return state;
		}

		return null;
	}
});
