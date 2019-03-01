/**
 * Functionality for drawing simple NavigationBar.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Component, IComponentProperties, IComponentAdapters, IComponentEvents, IComponentDataFields } from "../../core/Component";
import { Sprite } from "../../core/Sprite";
import { DataItem } from "../../core/DataItem";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { TextLink } from "../../core/elements/TextLink";
import { Triangle } from "../../core/elements/Triangle";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { percent } from "../../core/utils/Percent";
import * as $iter from "../../core/utils/Iterator";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[NavigationBar]].
 *
 * @see {@link DataItem}
 */
export class NavigationBarDataItem extends DataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: NavigationBar;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "NavigationBarDataItem";
		this.applyTheme();
	}

	/**
	 * Name of the navigation bar item.
	 *
	 * @param value  Name
	 */
	public set name(value: string) {
		this.setProperty("name", value);
	}

	/**
	 * @return Name
	 */
	public get name(): string {
		return this.properties["name"];
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[NavigationBar]].
 */
export interface INavigationBarDataFields extends IComponentDataFields {

	/**
	 * Name of nav var item.
	 */
	name?: string;

}

/**
 * Defines properties for [[NavigationBar]].
 */
export interface INavigationBarProperties extends IComponentProperties {

}

/**
 * Defines events for [[NavigationBar]].
 */
export interface INavigationBarEvents extends IComponentEvents { }

/**
 * Defines adapters for [[NavigationBar]].
 *
 * @see {@link Adapter}
 */
export interface INavigationBarAdapters extends IComponentAdapters, INavigationBarProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * NavigationBar class can be used to create a multi-level breadcrumb-style
 * navigation control.
 *
 * @see {@link INavigationBarEvents} for a list of available events
 * @see {@link INavigationBarAdapters} for a list of available Adapters
 * @todo Implement better
 * @important
 */
export class NavigationBar extends Component {

	/**
	 * Defines data fields.
	 */
	public _dataFields: INavigationBarDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: INavigationBarProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: INavigationBarAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: INavigationBarEvents;

	/**
	 * A list of breadcrumbs (links) in the nav bar.
	 */
	public links: ListTemplate<TextLink>;

	/**
	 * [_linksIterator description]
	 *
	 * @todo Description
	 */
	protected _linksIterator: $iter.ListIterator<TextLink>;

	/**
	 * [_separatorsIterator description]
	 *
	 * @todo Description
	 */
	protected _separatorsIterator: $iter.ListIterator<Sprite>;

	/**
	 * A reference to the link which is currently active.
	 */
	public activeLink: TextLink;

	/**
	 * A list of elements used as nav bar item separators.
	 */
	public separators: ListTemplate<Triangle>;

	/**
	 * Identifies the type of the [[DataItem]] used in this element.
	 */
	public _dataItem!: NavigationBarDataItem;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "NavigationBar";

		let interfaceColors = new InterfaceColorSet();

		let textLink = new TextLink();
		textLink.valign = "middle";
		textLink.paddingTop = 8;
		textLink.paddingBottom = 8;

		this.paddingBottom = 2;

		this.links = new ListTemplate<TextLink>(textLink);
		this._disposers.push(new ListDisposer(this.links));
		this._disposers.push(textLink);

		this._linksIterator = new $iter.ListIterator<TextLink>(this.links, () => this.links.create());
		this._linksIterator.createNewItems = true;

		let triangle = new Triangle();
		triangle.direction = "right";
		triangle.width = 8;
		triangle.height = 12;
		triangle.fill = interfaceColors.getFor("alternativeBackground");
		triangle.fillOpacity = 0.5;
		triangle.valign = "middle";
		triangle.marginLeft = 10;
		triangle.marginRight = 10;

		this.separators = new ListTemplate<Triangle>(triangle);
		this._disposers.push(new ListDisposer(this.separators));
		this._disposers.push(triangle);

		let activeLink = new TextLink();
		this.activeLink = activeLink;
		activeLink.copyFrom(textLink);
		activeLink.valign = "middle";
		activeLink.fontWeight = "bold";

		this.width = percent(100);
		this.layout = "grid";
		this.dataFields.name = "name";

		// Apply theme
		this.applyTheme();
	}

	/**
	 * Completely redraws the navigation bar.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataElements(): void {
		this.removeChildren();
		this._linksIterator.reset();
		super.validateDataElements();
		//@todo: dispose
	}

	/**
	 * Creates a visual element for a data item (nav item).
	 *
	 * @ignore Exclude from docs
	 * @param dataItem  Data item
	 */
	public validateDataElement(dataItem: this["_dataItem"]): void {
		super.validateDataElement(dataItem);

		let textLink: TextLink;
		if (dataItem.index < this.dataItems.length - 1) {
			textLink = this._linksIterator.getLast();
			textLink.parent = this;
			let separator = this.separators.create();
			separator.parent = this;
			separator.valign = "middle";
		}
		else {
			textLink = this.activeLink;
			textLink.events.copyFrom(this.links.template.events);
			textLink.hide(0);
			textLink.show();
			textLink.parent = this;
		}
		textLink.dataItem = dataItem;
		textLink.text = dataItem.name;
		textLink.validate();
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["NavigationBar"] = NavigationBar;
registry.registeredClasses["NavigationBarDataItem"] = NavigationBarDataItem;
