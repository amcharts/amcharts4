/**
 * ExportMenu provides functionality for building Export menu
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import exportCSS from "./ExportCSS";
import { IExportOptions } from "./Export";
import { Adapter } from "../utils/Adapter";
import { List } from "../utils/List";
import { Align } from "../defs/Align";
import { VerticalAlign } from "../defs/VerticalAlign";
import { getInteraction } from "../interaction/Interaction";
import { InteractionObject } from "../interaction/InteractionObject";
import { AMEvent } from "../utils/EventDispatcher";
import { IDisposer, MutableValueDisposer } from "../utils/Disposer";
import { Language, ILocaleProperties } from "../utils/Language";
import { Validatable } from "../utils/Validatable";
import { keyboard, KeyboardKeys } from "../utils/Keyboard";
import { Color } from "../utils/Color";
import * as $utils from "../utils/Utils";
import * as $iter from "../utils/Iterator";
import * as $dom from "../utils/DOM";
import * as $type from "../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Export menu item interface.
 */
export interface IExportMenuItem {

	/**
	 * Item type, usually an export format.
	 */
	type?: keyof IExportOptions;

	/**
	 * Label to display in the menu.
	 */
	label?: string;

	/**
	 * A `href` of the image to show instead of a label.
	 */
	icon?: string;

	/**
	 * Raw SVG content to add to instead of regular label.
	 */
	svg?: string;

	/**
	 * Export format. (optional)
	 */
	format?: string;

	/**
	 * Menu item options.
	 *
	 * @see {@link IExportOptions}
	 */
	options?: IExportOptions[keyof IExportOptions];

	/**
	 * Priority.
	 *
	 * The items in Export menu will be sorted by their priority in ascending
	 * order.
	 *
	 * @ignore Exclude from docs (this feature is not yet implemented)
	 */
	priority?: number;

	/**
	 * An array of [[IExportMenuItem]] items, to construct a sub-menu out of.
	 *
	 * An Export menu can have any number of nesting levels.
	 */
	menu?: Array<IExportMenuItem>;

	/**
	 * If this is set to true, it means that this specific menu item is not
	 * supported by the current client system.
	 *
	 * This is usually populated by [[Export]]'s `supported` Adapter.
	 *
	 * @see {@link IExportAdapters}
	 */
	unsupported?: boolean

	/**
	 * An [[InteractionObject]] representation of the menu item label.
	 */
	interactions?: InteractionObject;

	/**
	 * Actual HTML element of the menu item.
	 */
	element?: HTMLElement;

	/**
	 * Holds list of parent menu items to this item.
	 */
	ascendants?: List<IExportMenuItem>;

	/**
	 * Holds timeout reference.
	 *
	 * Used to delay auto-closing of the menu when it is no longer hovered.
	 *
	 * @ignore Exclude from docs
	 */
	closeTimeout?: IDisposer;

	/**
	 * Should this item be hidden?
	 */
	hidden?: boolean;

	/**
	 * A unique id to attach to the menu item.
	 */
	id?: string;

	/**
	 * Color to use as a background.
	 */
	color?: Color;

}

/**
 * Defines [[ExportMenu]] events.
 */
export interface IExportMenuEvents {

	/**
	 * Invoked when menu item is clicked/tapped.
	 */
	hit: {
		branch: IExportMenuItem;
		event: MouseEvent | TouchEvent;
	};

	/**
	 * Invoked when menu item is hovered.
	 */
	over: {
		branch: IExportMenuItem;
		event: MouseEvent | TouchEvent;
	};

	/**
	 * Invoked when menu item is no longer hovered.
	 */
	out: {
		branch: IExportMenuItem;
		event: MouseEvent | TouchEvent;
	};

	/**
	 * Invoked when ENTER key is pressed when certain menu item is in focus.
	 */
	enter: {
		branch: IExportMenuItem;
		event: KeyboardEvent;
	}

	/**
	 * Invoked when menu branch is selected. (either by hover or keyboard)
	 */
	branchselected: {
		branch: IExportMenuItem;
	}

	/**
	 * Invoked when menu branch is unselected.
	 */
	branchunselected: {
		branch: IExportMenuItem;
	}

	/**
	 * Invoked when menu is closed.
	 */
	closed: {};

}

/**
 * Represents a list of available adapters for Export
 */
export interface IExportMenuAdapters {

	items: {
		items: Array<IExportMenuItem>
	},

	menuElement: {
		menuElement: HTMLElement
	},

	branch: {
		branch: IExportMenuItem,
		level: number
	},

	rederLabel: {
		label: string,
		branch: IExportMenuItem
	},

	menuClass: {
		className: string,
		level: number
	},

	itemClass: {
		className: string,
		level: number,
		type?: keyof IExportOptions
	},

	labelClass: {
		className: string,
		level: number,
		type?: keyof IExportOptions
	},

	menuTag: {
		tag: string
	},

	itemTag: {
		tag: string
	},

	labelTag: {
		tag: string
	},

	iconTag: {
		tag: string
	},

	align: {
		align: Align
	},

	verticalAlign: {
		verticalAlign: VerticalAlign
	},

	classPrefix: {
		classPrefix: string
	},

	defaultStyles: {
		defaultStyles: boolean
	},

	tabindex: {
		tabindex: number
	},

	closeOnClick: boolean

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a menu for Export operations.
 *
 * To add an export menu to a chart, set this to a new instance of
 * [[ExportMenu]].
 *
 * ```TypeScript
 * chart.exporting.menu = new am4core.ExportMenu();
 * ```
 * ```JavaScript
 * chart.exporting.menu = new am4core.ExportMenu();
 * ```
 * ```JSON
 * {
 *   // ...
 *   "exporting": {
 *     "menu": {}
 *   }
 * }
 * ```
 * @important
 */
export class ExportMenu extends Validatable {

	/**
	 * Defines available events.
	 */
	public _events!: IExportMenuEvents;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IExportMenuAdapters;

	/**
	 * An [[Adapter]].
	 */
	public adapter: Adapter<ExportMenu, IExportMenuAdapters> = new Adapter<ExportMenu, IExportMenuAdapters>(this);

	/**
	 * How many milliseconds to hold menu/sub-menu open after it loses focus or
	 * hover, before auto-closing it.
	 *
	 * @default 1000
	 */
	public closeDelay: number = 1000;

	/**
	 * Close the menu automatically when some export operation is triggered.
	 *
	 * @default true
	 * @since 4.2.2
	 */
	public closeOnClick: boolean = true;

	/**
	 * An instance of [[Language]].
	 */
	protected _language = new MutableValueDisposer<Language>();

	/**
	 * Reference to DOM element that holds Export menu.
	 */
	protected _container: $type.Optional<HTMLElement>;

	/**
	 * Menu element.
	 */
	protected _element: $type.Optional<HTMLElement>;

	/**
	 * Currently selected menu item.
	 */
	protected _currentSelection: $type.Optional<IExportMenuItem>;

	/**
	 * What HTML tags to use to build menu.
	 */
	protected _menuTag: "ul" | "div" = "ul";

	/**
	 * Which tag to use to enclose individual menu items.
	 */
	protected _itemTag: "li" | "div" = "li";

	/**
	 * Tag to wrap menu item labels in.
	 */
	protected _labelTag: "a" = "a";

	/**
	 * Tag to use for icons
	 */
	protected _iconTag: "img" = "img";

	/**
	 * Prefix for class names applied to menu elements.
	 */
	protected _classPrefix: string = "amexport";

	/**
	 * If set to `true` [[ExportMenu]] will load it's own external CSS when
	 * instantiated.
	 */
	protected _defaultStyles: boolean = true;

	/**
	 * Horizontal positioning.
	 */
	protected _align: Align = "right";

	/**
	 * Vertical positioning.
	 */
	protected _verticalAlign: VerticalAlign = "top";

	/**
	 * A tabindex to apply to Export Menu.
	 */
	protected _tabindex: number = 0;

	/**
	 * Whether next menu close event should be ignored.
	 */
	protected _ignoreNextClose: boolean = false;

	/**
	 * Default menu items.
	 */
	protected _items: Array<IExportMenuItem> = [
		{
			"label": "...",
			"menu": [
				{
					"label": "Image",
					"menu": [
						{ "type": "png", "label": "PNG" },
						{ "type": "jpg", "label": "JPG" },
						{ "type": "svg", "label": "SVG" },
						{ "type": "pdf", "label": "PDF" }
					]
				}, {
					"label": "Data",
					"menu": [
						{ "type": "json", "label": "JSON" },
						{ "type": "csv", "label": "CSV" },
						{ "type": "xlsx", "label": "XLSX" },
						{ "type": "html", "label": "HTML" },
						{ "type": "pdfdata", "label": "PDF" }
					]
				}, {
					"label": "Print", "type": "print"
				}
			]
		}
	];

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ExportMenu";
		this._disposers.push(this._language);
		this.invalidate();
		this.applyTheme();
	}

	/**
	 * (Re)draws the Export menu.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		this.draw();
		super.validate();
	}

	/**
	 * Draws the menu based on current items.
	 *
	 * Normally, there's no need to call this explicitly. The chart, if it has
	 * export menu enabled, will automatically draw the menu.
	 */
	public draw(): void {

		// Create top-level menu item, or clear it
		if (!this._element) {
			this._element = this.createMenuElement(0);
		}
		else {
			this._element.innerHTML = "";
			this._element.className = this.getMenuItemClass(0);
		}

		// See if we're loading external CSS
		// Hide it until CSS is loaded
		if (this.defaultStyles) {
			this._element.style.display = "none";
		}

		// Append to container
		$type.getValue(this._container).appendChild(this._element);

		// Apply adapter to menu items before processing
		let items = this.adapter.apply("items", {
			items: this._items
		}).items;

		for (let len = items.length, i = 0; i < len; i++) {
			this.drawBranch(this._element, items[i], 0);
		}

		// Apply adapter to finalized menu element
		this._element = this.adapter.apply("menuElement", {
			menuElement: this._element
		}).menuElement;

		// Set up global "down" event
		this._disposers.push(getInteraction().body.events.on("down", (ev) => {
			if (!ev.pointer.touch) {
				this._ignoreNextClose = false;
			}
			this.close();
		}));

		// Set up global event on ESC press to close the menu
		this._disposers.push(getInteraction().body.events.on("keyup", (ev) => {
			let key = keyboard.getEventKey(ev.event);
			switch (key) {
				case "esc":
					this.close();
					break;
				case "up":
				case "down":
				case "left":
				case "right":
					this.moveSelection(key);
					break;
			}
		}));

		if (this.defaultStyles) {
			this.loadDefaultCSS();
		}

	}

	/**
	 * Creates a new branch in export menu. This function is recursive for
	 * building multi-level menus.
	 *
	 * @ignore Exclude from docs
	 * @param container Container to put branch elements in
	 * @param branch    Menu item
	 * @param level     Current nesting level
	 */
	protected drawBranch(container: HTMLElement, branch: IExportMenuItem, level: number): void {

		// Apply adapter
		branch = this.adapter.apply("branch", {
			branch: branch,
			level: level
		}).branch;

		// Unsupported?
		// ExportMenu does not check or know for specific browser/system
		// capabilities. It must happen in some other code and applied via Adapter.
		// Export itself will check compatibility, but there might be other plugins
		// that influence it or even add any specific export functionality.
		if (branch.unsupported === true) {
			return;
		}

		// Init ascendants
		if (!branch.ascendants) {
			branch.ascendants = new List<IExportMenuItem>();
		}

		// Get type
		let type: keyof IExportOptions | undefined | null = branch.type;

		// Create an item
		let element = this.createItemElement(level, type);

		// Create label
		let label;

		// Create icon
		if (branch.icon) {
			label = this.createIconElement(level, type);
			(<HTMLImageElement>label).src = branch.icon;
			if (branch.label) {
				(<HTMLImageElement>label).title = branch.label;
			}
		}
		else if (branch.svg) {
			label = this.createSvgElement(level, type, branch.svg);
			if (branch.label) {
				(<HTMLElement>label).title = branch.label;
			}
		}
		else {
			label = this.createLabelElement(level, type);
			label.innerHTML = (branch.label ? this.language.translate(<keyof ILocaleProperties>branch.label) : "");
		}

		// Apply reader text to label
		let readerLabel = this.getReaderLabel(branch, label.innerHTML);
		label.setAttribute("aria-label", readerLabel);

		// Add Label
		element.appendChild(label);

		// Create interaction object
		// TODO clean this up when it's disposed
		branch.interactions = getInteraction().getInteraction(label);
		branch.element = element;

		// Create interaction manager we can set event listeners to
		if (this.typeClickable(type)) {
			//branch.interactions.clickable = true;
			// TODO clean this up when it's disposed
			branch.interactions.events.on("hit", (ev) => {
				if (this.events.isEnabled("hit")) {
					const event: AMEvent<this, IExportMenuEvents>["hit"] = {
						"type": "hit",
						"event": ev.event,
						"target": this,
						"branch": branch
					};
					this.events.dispatchImmediately("hit", event);
				}
			});

			// TODO clean this up when it's disposed
			branch.interactions.events.on("keyup", (ev) => {
				if (keyboard.isKey(ev.event, "enter")) {
					if (this.events.isEnabled("enter")) {
						const event: AMEvent<this, IExportMenuEvents>["enter"] = {
							"type": "enter",
							"event": ev.event,
							"target": this,
							"branch": branch
						};
						this.events.dispatchImmediately("enter", event);
					}
				}
			});
		}

		{
			const submenu = this.getSubMenu(branch);

			// Add ENTER event to open sub-menus
			if (submenu != null) {
				// TODO clean this up when it's disposed
				branch.interactions.events.on("keyup", (ev) => {
					if (keyboard.isKey(ev.event, "enter")) {
						// This is item has sub-menu, activate the first child on ENTER
						this.selectBranch(submenu[0]);

						// Attempt to set focus
						this.setFocus(submenu[0]);
					}
				});
				branch.interactions.events.on("hit", (ev) => {
					this.selectBranch(branch);
				});
			}
		}

		// Add events
		// TODO clean this up when it's disposed
		branch.interactions.events.on("over", (ev) => {

			if (ev.pointer.touch) {
				// Cancel pending menu closure
				this._ignoreNextClose = true;
			}

			this.selectBranch(branch);

			if (this.events.isEnabled("over")) {
				const event: AMEvent<this, IExportMenuEvents>["over"] = {
					"type": "over",
					"event": ev.event,
					"target": this,
					"branch": branch
				};
				this.events.dispatchImmediately("over", event);
			}
		});

		// TODO clean this up when it's disposed
		branch.interactions.events.on("out", (ev) => {
			if (!ev.pointer.touch) {
				this.delayUnselectBranch(branch);
			}
			if (this.events.isEnabled("out")) {
				const event: AMEvent<this, IExportMenuEvents>["out"] = {
					"type": "out",
					"event": ev.event,
					"target": this,
					"branch": branch
				};
				this.events.dispatchImmediately("out", event);
			}
		});

		// TODO clean this up when it's disposed
		branch.interactions.events.on("focus", (ev) => {
			this.selectBranch(branch);
		});

		// TODO clean this up when it's disposed
		branch.interactions.events.on("blur", (ev) => {
			this.delayUnselectBranch(branch);
		});

		// Increment level
		let local_level = level + 1;

		// Has sub-menu?
		if (branch.menu) {
			let submenu = this.createMenuElement(local_level);
			for (let len = branch.menu.length, i = 0; i < len; i++) {
				let ascendants = new List<IExportMenuItem>();
				branch.menu[i].ascendants = ascendants;
				if (branch.ascendants.length) {
					ascendants.copyFrom(branch.ascendants);
				}
				ascendants.push(branch);
				this.drawBranch(submenu, branch.menu[i], local_level);
			}

			// Sub-menu is empty (all items are not supported)
			// Do not draw this menu item at all
			if (submenu.innerHTML == "") {
				return;
			}
			element.appendChild(submenu);
		}

		// Should this item be hidden?
		if (branch.hidden) {
			this.hideBranch(branch);
		}

		// Add id?
		if (branch.id) {
			element.setAttribute("id", branch.id);
		}

		// Background color?
		if (branch.color) {
			element.style.backgroundColor = branch.color.hex;
		}

		// Append to container
		container.appendChild(element);

	}

	/**
	 * Creates a menu element to hold its elements in. Usually it's an `<ul>`
	 * tag.
	 *
	 * @ignore Exclude from docs
	 * @param level  Current nesting level
	 * @return HTML element reference
	 */
	public createMenuElement(level: number): HTMLElement {
		let element: HTMLElement = document.createElement(this.menuTag);
		element.className = this.getMenuItemClass(level);

		// Accessibility
		if (level === 0) {
			element.setAttribute("role", "menu");
		}
		return element;
	}

	/**
	 * Generates a class name for the menu element based on its nesting level.
	 *
	 * @ignore Exclude from docs
	 * @param level  Current nesting level
	 * @return Class name(s)
	 */
	public getMenuItemClass(level: number): string {
		let className = this.classPrefix + "-menu " + this.classPrefix + "-menu-level-" + level;
		if (level === 0) {
			className += " " + this.classPrefix + "-menu-root " +
				this.classPrefix + "-" + this.align + " " +
				this.classPrefix + "-" + this.verticalAlign;
		}
		return this.adapter.apply("menuClass", {
			className: className,
			level: level
		}).className;
	}

	/**
	 * Creates menu item. Usually `<li>` tag. Its label and sub-elements will go
	 * into this element.
	 *
	 * @ignore Exclude from docs
	 * @param level  Current nesting level
	 * @param type   Type of the menu item
	 * @return HTML element reference
	 */
	public createItemElement(level: number, type?: keyof IExportOptions): HTMLElement {
		let element: HTMLElement = document.createElement(this.itemTag);
		let className = this.classPrefix + "-item " + this.classPrefix
			+ "-item-level-" + level
			+ " " + this.classPrefix + "-item-" + (type || "blank");
		element.className = this.adapter.apply("itemClass", {
			className: className,
			level: level,
			type: type
		}).className;
		return element;
	}

	/**
	 * Creates a "label" part of the menu item. It could be text or any HTML
	 * content.
	 *
	 * @ignore Exclude from docs
	 * @param level  Current nesting level
	 * @param type   Type of the menu item
	 * @return An HTML Element
	 */
	public createLabelElement(level: number, type?: keyof IExportOptions): HTMLElement {
		let element: HTMLElement = document.createElement(this.labelTag);
		let className = this.classPrefix + "-label " + this.classPrefix
			+ "-label-level-" + level
			+ " " + this.classPrefix + "-item-" + (type || "blank");
		if (this.typeClickable(type)) {
			className += " " + this.classPrefix + "-clickable";
		}
		element.className = this.adapter.apply("labelClass", {
			className: className,
			level: level,
			type: type
		}).className;

		// Accessible navigation
		element.setAttribute("tabindex", this.tabindex.toString());
		element.setAttribute("role", "menuitem");
		return element;
	}

	/**
	 * Creates a "icon" part of the menu item.
	 *
	 * @ignore Exclude from docs
	 * @param level  Current nesting level
	 * @param type   Type of the menu item
	 * @return An HTML Element
	 */
	public createIconElement(level: number, type?: keyof IExportOptions): HTMLElement {
		let element: HTMLElement = document.createElement(this.iconTag);
		let className = this.classPrefix + "-icon " + this.classPrefix
			+ "-icon-level-" + level
			+ " " + this.classPrefix + "-item-" + (type || "blank");
		if (this.typeClickable(type)) {
			className += " " + this.classPrefix + "-clickable";
		}
		element.className = this.adapter.apply("labelClass", {
			className: className,
			level: level,
			type: type
		}).className;

		// Accessible navigation
		element.setAttribute("tabindex", this.tabindex.toString());
		element.setAttribute("role", "menuitem");
		return element;
	}

	/**
	 * Creates a a custom element out of raw HTML.
	 *
	 * @ignore Exclude from docs
	 * @param level  Current nesting level
	 * @param type   Type of the menu item
	 * @return An HTML Element
	 */
	public createSvgElement(level: number, type?: keyof IExportOptions, svg?: string): HTMLElement {
		let parser = new DOMParser();
		let element = parser.parseFromString(svg, "image/svg+xml").documentElement;
		let className = this.classPrefix + "-icon " + this.classPrefix
			+ "-icon-level-" + level
			+ " " + this.classPrefix + "-item-" + (type || "blank");
		if (this.typeClickable(type)) {
			className += " " + this.classPrefix + "-clickable";
		}
		element.setAttribute("class", this.adapter.apply("labelClass", {
			className: className,
			level: level,
			type: type
		}).className);

		// Accessible navigation
		element.setAttribute("tabindex", this.tabindex.toString());
		element.setAttribute("role", "menuitem");
		return element;
	}

	/**
	 * Destroys the menu and all its elements.
	 */
	public dispose(): void {
		if (!this._disposed) {
			super.dispose();

			if (this._element && this._element.parentNode) {
				this._element.parentNode.removeChild(this._element);
			}
		}
	}

	/**
	 * Checks whether menu item type is supposed to be clickable.
	 *
	 * @ignore Exclude from docs
	 * @param type  Menu item type
	 * @return Is clickable?
	 */
	public typeClickable(type: keyof IExportOptions | undefined | null): type is keyof IExportOptions {
		return $type.hasValue(type);
	}

	/**
	 * Checks whether menu item has any sub-items.
	 *
	 * @ignore Exclude from docs
	 * @param branch  A menu item
	 * @return Has sub-items?
	 */
	public hasSubMenu(branch: IExportMenuItem): boolean {
		return (branch.menu && branch.menu.length) ? true : false;
	}

	/**
	 * Returns sub-items (if they exist).
	 *
	 * @ignore Exclude from docs
	 * @param branch  A menu item
	 * @return Submenus
	 */
	public getSubMenu(branch: IExportMenuItem): $type.Optional<Array<IExportMenuItem>> {
		if (branch.menu && branch.menu.length) {
			return branch.menu;
		}
	}

	/**
	 * Generates and returns an applicable label to be used for screen readers.
	 *
	 * @ignore Exclude from docs
	 * @param item   A menu item instance
	 * @param label  Current label
	 * @return Reader text
	 */
	public getReaderLabel(branch: IExportMenuItem, label: string): string {

		// Strip any HTML from the label
		label = $utils.stripTags(label);

		// Add textual note if the branch is clickable
		if (this.hasSubMenu(branch)) {
			label += " [" + this.language.translate("Click, tap or press ENTER to open") + "]";
		}
		else if (branch.type == "print") {
			label = this.language.translate("Click, tap or press ENTER to print.");
		}
		else if (this.typeClickable(branch.type)) {
			label = this.language.translate("Click, tap or press ENTER to export as %1.", undefined, label);
		}

		return this.adapter.apply("rederLabel", {
			label: label,
			branch: branch
		}).label;
	}

	/**
	 * Getters and setters
	 */

	/**
	 * An HTML container to place the Menu in.
	 *
	 * A container must be an HTML element, because menu itself is HTML, and
	 * cannot be placed into SVG.
	 *
	 * @param container Reference to container element
	 * @todo Check if menu is already build. If it is, just move it to a new container
	 */
	public set container(container: $type.Optional<HTMLElement>) {
		this._container = container;
		this.invalidate();
	}

	/**
	 * @return Container
	 */
	public get container(): $type.Optional<HTMLElement> {
		return this._container;
	}

	/**
	 * A list of menu items. Can be nested.
	 *
	 * @param items  Menu items
	 */
	public set items(items: Array<IExportMenuItem>) {
		this._items = items;
		this.invalidate();
	}

	/**
	 * @return Menu items
	 */
	public get items(): Array<IExportMenuItem> {
		return this._items;
	}

	/**
	 * Sets main menu tag to place menu in.
	 *
	 * This also sets up how menu items are built.
	 *
	 * If you set this to "ul", menu items will be wrapped into `<li>` tags.
	 *
	 * If set to "div", menu items will be wrapped in `<div>` tags.
	 *
	 * @default "ul"
	 * @param tag Tag to use for menu
	 */
	public set tag(tag: "ul" | "div") {
		this._menuTag = tag;
		this._itemTag = tag == "ul" ? "li" : "div";
		this.invalidate();
	}

	/**
	 * Returns current menu tag.
	 *
	 * @ignore Exclude from docs
	 * @return Menu tag (item that contains sub-items)
	 */
	public get menuTag(): string {
		return this.adapter.apply("menuTag", {
			tag: this._menuTag
		}).tag;
	}

	/**
	 * Returns tag to wrap items into.
	 *
	 * @ignore Exclude from docs
	 * @return Item tag
	 */
	public get itemTag(): string {
		return this.adapter.apply("itemTag", {
			tag: this._itemTag
		}).tag;
	}

	/**
	 * Returns menu label tag.
	 *
	 * @ignore Exclude from docs
	 * @return Label tag
	 */
	public get labelTag(): string {
		return this.adapter.apply("labelTag", {
			tag: this._labelTag
		}).tag;
	}

	/**
	 * Returns icon tag.
	 *
	 * @ignore Exclude from docs
	 * @return Icon tag
	 */
	public get iconTag(): string {
		return this.adapter.apply("iconTag", {
			tag: this._iconTag
		}).tag;
	}

	/**
	 * A horizontal alignment for the menu placement.
	 *
	 * @param value Horizontal alignment
	 */
	public set align(value: Align) {
		this._align = value;
		this.invalidate();
	}

	/**
	 * @return Horizontal alignment
	 */
	public get align(): Align {
		return this.adapter.apply("align", {
			align: this._align
		}).align;
	}

	/**
	 * A vertical alignment for the menu placement.
	 *
	 * @param value Vertical alignment
	 */
	public set verticalAlign(value: VerticalAlign) {
		this._verticalAlign = value;
		this.invalidate();
	}

	/**
	 * @return Vertical alignment
	 */
	public get verticalAlign(): VerticalAlign {
		return this.adapter.apply("verticalAlign", {
			verticalAlign: this._verticalAlign
		}).verticalAlign;
	}

	/**
	 * Class name prefix.
	 *
	 * @default "amexport"
	 * @param value Class name prefix
	 */
	public set classPrefix(value: string) {
		this._classPrefix = value;
		this.invalidate();
	}

	/**
	 * @return Class name prefix
	 */
	public get classPrefix(): string {
		return this.adapter.apply("classPrefix", {
			classPrefix: this._classPrefix
		}).classPrefix;
	}

	/**
	 * Indicates whether [[ExportMenu]] should load external CSS to style itself.
	 *
	 * If set to `false`, the menu will not be styled, and will rely on some
	 * external CSS.
	 *
	 * @default true
	 * @param Should ExportMenu load its own CSS?
	 */
	public set defaultStyles(value: boolean) {
		if (this._defaultStyles != value) {
			this._defaultStyles = value;
			if (value) {
				this.loadDefaultCSS();
			}
		}
		this.invalidate();
	}

	/**
	 * @return Should ExportMenu load its own CSS?
	 */
	public get defaultStyles(): boolean {
		return this.adapter.apply("defaultStyles", {
			defaultStyles: this._defaultStyles
		}).defaultStyles;
	}

	/**
	 * Loads the default CSS.
	 *
	 * @ignore Exclude from docs
	 */
	public loadDefaultCSS(): void {
		this._disposers.push(exportCSS(this.classPrefix));

		if (this._element) {
			this._element.style.display = "";
		}
	}

	/**
	 * A tab index for the menu.
	 *
	 * Tab index will influence the order in which elements on the chart and
	 * the whole page are selected when pressing TAB key.
	 *
	 * @param value Tab index
	 */
	public set tabindex(value: number) {
		this._tabindex = value;
		this.invalidate();
	}

	/**
	 * @return Tab index
	 */
	public get tabindex(): number {
		return this.adapter.apply("tabindex", {
			tabindex: this._tabindex
		}).tabindex;
	}

	/**
	 * A [[Language]] instance.
	 *
	 * @param value An instance of [[Language]]
	 */
	public set language(value: Language) {
		this._language.set(value, value.events.on("localechanged", (ev) => {
			this.invalidate();
		}));
		this.invalidate();
	}

	/**
	 * @return A [[Language]] instance to be used
	 */
	public get language(): Language {
		let language = this._language.get();

		if (language == null) {
			language = new Language();

			// TODO code duplication with `set language()`
			this._language.set(language, language.events.on("localechanged", (ev) => {
				this.invalidate();
			}));
		}

		return language;
	}

	/**
	 * Controlling the menu
	 */

	/**
	 * Removes all active classes from menu items. Useful on touch devices and
	 * keyboard navigation where open menu can be closed instantly by clicking or
	 * tapping outside it.
	 *
	 * @ignore Exclude from docs
	 */
	public close(): void {
		if (this._ignoreNextClose) {
			this._ignoreNextClose = false;
			return;
		}

		if (this.closeOnClick) {
			this._element.style.pointerEvents = "none";
			setTimeout(() => {
				this._element.style.pointerEvents = "auto";
			}, 100);
		}

		if (this._currentSelection) {
			this.setBlur(this._currentSelection);
			this._currentSelection = undefined;
		}

		if (this._element) {
			let items = this._element.getElementsByClassName("active");
			for (let len = items.length, i = len - 1; i >= 0; i--) {
				if (items[i]) {
					$dom.removeClass(<HTMLElement>items[i], "active");
				}
			}
		}

		this.events.dispatchImmediately("closed", {
			type: "closed",
			target: this
		});
	}

	/**
	 * Selects a branch in the menu.
	 *
	 * Handles closing of currently open branch.
	 *
	 * @ignore Exclude from docs
	 * @param branch Branch to select
	 */
	public selectBranch(branch: IExportMenuItem): void {

		// Cancel previous closure
		if (branch.closeTimeout) {
			this.removeDispose(branch.closeTimeout);
			branch.closeTimeout = undefined;
		}

		// Add active class
		$dom.addClass(branch.interactions.element.parentElement, "active");

		// Remove current selection
		if (this._currentSelection && this._currentSelection !== branch && this._currentSelection.ascendants) {
			$iter.each($iter.concat($iter.fromArray([this._currentSelection]), this._currentSelection.ascendants.iterator()), (ascendant) => {
				if (!branch.ascendants.contains(ascendant) && branch !== ascendant) {
					this.unselectBranch(ascendant, true);
				}
			});
		}

		// Select and/or cancel timeout for current ascendants
		$iter.each(branch.ascendants.iterator(), (ascendant) => {
			if (ascendant.closeTimeout) {
				this.removeDispose(ascendant.closeTimeout);
				ascendant.closeTimeout = undefined;
			}
			$dom.addClass(ascendant.interactions.element.parentElement, "active");
		});

		// Log current selection
		this._currentSelection = branch;

		// Invoke event
		if (this.events.isEnabled("branchselected")) {
			const event: AMEvent<this, IExportMenuEvents>["branchselected"] = {
				type: "branchselected",
				target: this,
				branch: branch
			};
			this.events.dispatchImmediately("branchselected", event);
		}
	}

	/**
	 * Unselects a branch. Also selects a branch one level up if necessary.
	 *
	 * @ignore Exclude from docs
	 * @param branch Branch to unselect
	 * @param simple If `true`, only the branch will be unselected without selecting parent branch
	 */
	public unselectBranch(branch: IExportMenuItem, simple?: boolean): void {

		// Remove active class
		$dom.removeClass(branch.interactions.element.parentElement, "active");

		// Remove current selection
		if (this._currentSelection == branch) {
			this._currentSelection = undefined;
		}

		// Invoke event
		if (this.events.isEnabled("branchunselected")) {
			const event: AMEvent<this, IExportMenuEvents>["branchunselected"] = {
				type: "branchunselected",
				target: this,
				branch: branch
			};
			this.events.dispatchImmediately("branchunselected", event);
		}
	}

	/**
	 * Delay unselection of a branch. This can still be cancelled in some other
	 * place if the branch or its children regain focus.
	 *
	 * @ignore Exclude from docs
	 * @param branch Branch to unselect
	 * @param simple If `true`, only the branch will be unselected without selecting parent branch
	 */
	public delayUnselectBranch(branch: IExportMenuItem, simple?: boolean): void {

		// Schedule branch unselection
		if (branch.closeTimeout) {
			this.removeDispose(branch.closeTimeout);
			branch.closeTimeout = undefined;
		}
		branch.closeTimeout = this.setTimeout(() => {
			this.unselectBranch(branch, simple);
		}, this.closeDelay);

		// Schedule unselection of all ascendants
		// In case focus went away from the export menu altogether, this will ensure
		// that all items will be closed.
		// In case we're jumping to other menu item, those delayed unselections will
		// be cancelled by `selectBranch`
		if (simple !== true && branch.ascendants) {
			$iter.each(branch.ascendants.iterator(), (ascendant) => {
				this.delayUnselectBranch(ascendant, true);
			});
		}
	}

	/**
	 * Navigates the menu based on which direction kayboard key was pressed.
	 *
	 * @ignore Exclude from docs
	 * @param key A key that was pressed
	 */
	public moveSelection(key: KeyboardKeys): void {

		// Check if there's a current selection
		if (!this._currentSelection) {
			return;
		}

		let newSelection: $type.Optional<IExportMenuItem>;

		if (key == "up") {
			// Try moving up in current menu list, or to the last item if already
			// at the top
			newSelection = this.getPrevSibling(this._currentSelection);
		}
		else if (key == "down") {
			// Try moving down in current menu list, or to the top item if already
			// at the bottom
			newSelection = this.getNextSibling(this._currentSelection);
		}
		else if ((key == "left" && this.align == "right") || (key == "right" && this.align == "left")) {
			let menu = this.getSubMenu(this._currentSelection);

			// Go one level-deeper
			if (menu != null) {
				newSelection = menu[0];
			}
		}
		else if ((key == "right" && this.align == "right") || (key == "left" && this.align == "left")) {
			// Go one level-deeper
			newSelection = this.getParentItem(this._currentSelection);
		}

		if (newSelection && newSelection !== this._currentSelection) {
			this.selectBranch(newSelection);
			this.setFocus(newSelection);
			this._currentSelection = newSelection;
		}

	}

	/**
	 * Returns all siblings of a menu item, including this same menu item.
	 *
	 * @ignore Exclude from docs
	 * @param branch  Menu item
	 * @return List of sibling menu items
	 */
	public getSiblings(branch: IExportMenuItem): Array<IExportMenuItem> {
		let parent = this.getParentItem(branch);

		if (parent && parent.menu) {
			return parent.menu;

		} else {
			return [];
		}
	}

	/**
	 * Returns menu items parent item.
	 *
	 * @ignore Exclude from docs
	 * @param branch  Menu item
	 * @return Parent menu item
	 */
	public getParentItem(branch: IExportMenuItem): $type.Optional<IExportMenuItem> {
		if (branch.ascendants && branch.ascendants.length) {
			return branch.ascendants.getIndex(branch.ascendants.length - 1);
		}
		else {
			return undefined;
		}
	}

	/**
	 * Returns next sibling in the same menu branch. If there is no next sibling,
	 * the first one is returned. If there is just one item, that item is
	 * returned. Unsupported menu items are skipped.
	 *
	 * @ignore Exclude from docs
	 * @param branch  Menu item to search siblings for
	 * @return Menu item
	 */
	public getNextSibling(branch: IExportMenuItem): IExportMenuItem {
		let siblings = this.getSiblings(branch);
		if (siblings.length > 1) {
			let next = siblings.indexOf(branch) + 1;
			next = siblings.length == next ? 0 : next;
			return siblings[next].unsupported ? this.getNextSibling(siblings[next]) : siblings[next];
		}
		else {
			return branch;
		}
	}

	/**
	 * Returns previous sibling in the same menu branch. If there is no next
	 * sibling, the first one is returned. If there is just one item, that item is
	 * returned. Unsupported menu items are skipped.
	 *
	 * @ignore Exclude from docs
	 * @param branch  Menu item to search siblings for
	 * @return Menu item
	 */
	public getPrevSibling(branch: IExportMenuItem): IExportMenuItem {
		let siblings = this.getSiblings(branch);
		if (siblings.length > 1) {
			let prev = siblings.indexOf(branch) - 1;
			prev = prev == -1 ? siblings.length - 1 : prev;
			return siblings[prev].unsupported ? this.getPrevSibling(siblings[prev]) : siblings[prev];
		}
		else {
			return branch;
		}
	}

	/**
	 * Attempts to set focus on particular menu element.
	 *
	 * @ignore Exclude from docs
	 * @param branch Menu item
	 */
	public setFocus(branch: IExportMenuItem): void {
		if (branch.interactions) {
			try {
				(<HTMLElement>branch.interactions.element).focus();
			}
			catch(e) {
				// nothing
			}
		}
	}

	/**
	 * Attempts to remove focus from the menu element.
	 *
	 * @ignore Exclude from docs
	 * @param branch Menu item
	 */
	public setBlur(branch: IExportMenuItem): void {
		if (branch.interactions) {
			try {
				(<HTMLElement>branch.interactions.element).blur();
			}
			catch(e) {
				// nothing
			}
		}
	}

	/**
	 * Hides the whole branch of menu.
	 * 
	 * @param  branch  branch
	 */
	public hideBranch(branch: IExportMenuItem): void {
		branch.element.style.display = "none";
	}

	/**
	 * Show the branch of menu.
	 * 
	 * @param  branch  branch
	 */
	public showBranch(branch: IExportMenuItem): void {
		branch.element.style.display = "";
	}

}
