/**
 * Popup class is used to display information over chart area.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import popupCSS from "./PopupCSS";
import { Adapter } from "../utils/Adapter";
import { BaseObjectEvents } from "../Base";
import { Sprite } from "../Sprite";
import { getInteraction } from "../interaction/Interaction";
import { InteractionObject } from "../interaction/InteractionObject";
import { keyboard } from "../utils/Keyboard";
import { Percent } from "../utils/Percent";
import { MultiDisposer } from "../utils/Disposer";
import { Align } from "../defs/Align";
import { VerticalAlign } from "../defs/VerticalAlign";
import { IPoint } from "../defs/IPoint";
import { Optional } from "../utils/Type";
import * as $type from "../utils/Type";
import * as $object from "../utils/Object";

/**
 * Represents a list of available adapters for Export.
 */
export interface IPopupAdapters {

	/**
	 * Applied to the class prefixes.
	 *
	 * @type {string}
	 */
	classPrefix: string,

	/**
	 * Applied to popup content before it is shown.
	 * @type {string}
	 */
	content: string,

	/**
	 * Applied to popup title before it is shown.
	 * @type {string}
	 */
	title: string,

	/**
	 * Applied to the screen reader title.
	 * @type {string}
	 */
	readerTitle: string,

	/**
	 * Applied to default `defaultStyles` property before it is retrieved.
	 *
	 * @type {boolean}
	 */
	defaultStyles: boolean,

	/**
	 * Applied to default `showCurtain` property before it is retrieved.
	 *
	 * @type {boolean}
	 */
	showCurtain: boolean,

	/**
	 * Applied to default `draggable` property before it is retrieved.
	 *
	 * @type {boolean}
	 */
	draggable: boolean,

	/**
	 * Applied to `closable` property before it is retrieved.
	 *
	 * @type {boolean}
	 */
	closable: boolean,

	/**
	 * Applied to `fitTo` property before it's retrieved.
	 *
	 * @ignore Feature not yet implemented
	 * @type {"none" | "container" | "window"}
	 */
	fitTo: "none" | "container" | "window",

	/**
	 * Applied to horizontal alignment of the popup.
	 *
	 * @type {Align}
	 */
	align: Optional<Align>;

	/**
	 * Applied to vertical alignment of the popup.
	 *
	 * @type {VerticalAlign}
	 */
	verticalAlign: Optional<VerticalAlign>;

	/**
	 * Applied to `left` position value.
	 *
	 * @type {number | Percent}
	 */
	left: number | Percent;

	/**
	 * Applied to `right` position value.
	 *
	 * @type {number | Percent}
	 */
	right: number | Percent;

	/**
	 * Applied to `top` position value.
	 *
	 * @type {number | Percent}
	 */
	top: number | Percent;

	/**
	 * Applied to `bottom` position value.
	 *
	 * @type {number | Percent}
	 */
	bottom: number | Percent;

	/**
	 * Applied to class names list that are added as class for various popup
	 * elements.
	 */
	classNames: {
		wrapperClass: string,
		titleClass: string,
		contentClass: string,
		curtainClass: string,
		closeClass: string
	}

}

/**
 * Defines events for Popup.
 */
export interface IPopupEvents {

	/**
	 * Invoked when Popup is opened.
	 */
	opened: {};

	/**
	 * Invoked when Popup is closed.
	 */
	closed: {};

}

/**
 * Shows an HTML popup which covers window or a chart area.
 *
 * @see {@link https://www.amcharts.com/docs/v4/concepts/popups-and-modals/} For examples and docs on Popups and Modals.
 * @todo Positioning over whole window
 */
export class Popup extends BaseObjectEvents {

	/**
	 * Defines available events.
	 *
	 * @type {IPopupEvents}
	 */
	public _events!: IPopupEvents;

	/**
	 * Defines available adapters.
	 *
	 * @type {IExportAdapters}
	 */
	public _adapter!: IPopupAdapters;

	/**
	 * Adapter.
	 *
	 * @type {Adapter<Popup, IPopupAdapters>}
	 */
	public adapter: Adapter<Popup, IPopupAdapters> = new Adapter<Popup, IPopupAdapters>(this);

	/**
	 * A reference to an HTML element to be used for container. If not set, popup
	 * will cover the whole window.
	 *
	 * @type {Optional<HTMLElement>}
	 */
	public container: $type.Optional<HTMLElement | Document>;

	/**
	 * A parent element this Popup belongs to.
	 *
	 * @type {Optional<Sprite>}
	 */
	public sprite: $type.Optional<Sprite>;

	/**
	 * Holds references to various HTML elements, Popup consists of.
	 */
	protected _elements: {
		wrapper?: HTMLElement;
		title?: HTMLElement;
		content?: HTMLElement;
		close?: HTMLElement;
		curtain?: HTMLElement;
	} = {};

	/**
	 * Holdes Interaction objects for various Popup's elements.
	 */
	protected _IOs: {
		wrapper?: InteractionObject;
		content?: InteractionObject;
		close?: InteractionObject;
		curtain?: InteractionObject;
	} = {};

	/**
	 * Contents of popup window.
	 *
	 * @type {string}
	 */
	protected _content: string = "";

	/**
	 * Title of the popup window.
	 *
	 * @type {string}
	 */
	protected _title: string = "";

	/**
	 * Prefix to apply to class names for popup elements.
	 *
	 * @type {string}
	 */
	protected _classPrefix: string = "ampopup"

	/**
	 * If set to `true` [[Popup]] will use default styles.
	 *
	 * @type {boolean}
	 */
	protected _defaultStyles: boolean = true;

	/**
	 * If set to `true` [[Popup]] will dim out all chart content behind it by
	 * showing a semi-transparent fill. (curtain)
	 *
	 * @type {boolean}
	 */
	protected _showCurtain: boolean = false;

	/**
	 * Indicates whether popup can be dragged.
	 *
	 * @type {boolean}
	 */
	protected _draggable: boolean = true;

	/**
	 * Horizontal position of the content window.
	 *
	 * @type {Align}
	 */
	protected _align: Optional<Align> = "center";

	/**
	 * Vertical position of the content window.
	 *
	 * @type {VerticalAlign}
	 */
	protected _verticalAlign: Optional<VerticalAlign> = "middle";

	/**
	 * Shift in position of the element. (used for dragging)
	 *
	 * @type {number}
	 */
	protected _shift: IPoint = {
		x: 0,
		y: 0
	};

	/**
	 * Temporary shift in position of the element. (used for dragging)
	 *
	 * @type {number}
	 */
	protected _tempShift: IPoint = {
		x: 0,
		y: 0
	};

	/**
	 * "left" position of the popup content.
	 *
	 * @type {number | Percent}
	 */
	protected _left: number | Percent;

	/**
	 * "right" position of the popup content.
	 *
	 * @type {number | Percent}
	 */
	protected _right: number | Percent;

	/**
	 * "top" position of the popup content.
	 *
	 * @type {number | Percent}
	 */
	protected _top: number | Percent;

	/**
	 * "bottom" position of the popup content.
	 *
	 * @type {number | Percent}
	 */
	protected _bottom: number | Percent;

	/**
	 * A title for screen readers. It is very highly recommended to set that title
	 * so that people using screen reader tools can get an immediate summary of
	 * the information in the popup.
	 *
	 * @type {string}
	 */
	public _readerTitle: string = "";

	/**
	 * Is popup closable?
	 *
	 * @type {boolean}
	 */
	private _closable: boolean = true;

	/**
	 * Was CSS already loaded?
	 *
	 * @type {boolean}
	 */
	private _cssLoaded: boolean = false;

	/**
	 * If set to other than "none" will try to re-adjust the position of the
	 * popop to fit within chart container or browser window.
	 *
	 * @ignore Feature not yet implemented
	 * @todo Implement
	 * @type {"none" | "container" | "window"}
	 */
	private _fitTo: "none" | "container" | "window" = "window";

	/**
	 * Used to log original value of `interactionsEnabled` so that it can be restored
	 * after temporarily disabling it.
	 *
	 * @type {Optional<boolean>}
	 */
	private _spriteInteractionsEnabled: $type.Optional<boolean>;

	/**
	 * Identifies if this object is a "template" and should not be treated as
	 * real object that is drawn or actually used in the chart.
	 *
	 * @ignore Exclude from docs
	 * @type {boolean}
	 */
	public isTemplate: boolean = false;

	/**
	 * Indicates if the element was already sized and should not be measured for
	 * sized again, saving some precious resources.
	 *
	 * @type {boolean}
	 */
	private _sized: boolean = false;

	/**
	 * Cached bounding rectangle info.
	 *
	 * @type {Optional<DOMRect | ClientRect>}
	 */
	private _bbox: $type.Optional<DOMRect | ClientRect>;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Popup";
	}

	/**
	 * Shows popup window.
	 */
	public open(): void {
		if (this.container) {
			if (this._elements.wrapper) {
				this.container.appendChild(this._elements.wrapper);
			}
			if (this._elements.curtain) {
				this.container.appendChild(this._elements.curtain);
				this.showCurtain = this.showCurtain;
			}
			this.positionElement();
			this.dispatchImmediately("opened");
		}
	}

	/**
	 * Hides popup window.
	 */
	public close(): void {
		if (this._elements.wrapper) {
			if (this._elements.wrapper.parentElement) {
				this._elements.wrapper.parentElement.removeChild(this._elements.wrapper);
			}
		}
		if (this._elements.curtain) {
			if (this._elements.curtain.parentElement) {
				this._elements.curtain.parentElement.removeChild(this._elements.curtain);
			}
		}
		this.dispatchImmediately("closed");
		this.releasePointers();
	}

	/**
	 * Destroy (dispose) popup.
	 */
	public dispose(): void {
		this.close();
		super.dispose();
	}

	/**
	 * Positions content element in the center of popup based on its actual size.
	 *
	 * @ignore Exclude from docs
	 */
	public positionElement(forceResize: boolean = true): void {

		if (!this._elements.wrapper) {
			return;
		}

		setTimeout(() => {
			if (!this._elements.wrapper) {
				return;
			}

			if (forceResize || !this._sized) {
				this._elements.wrapper.style.opacity = "0.01";
				this._elements.wrapper.style.left = "0";
				this._elements.wrapper.style.top = "0";
				this._elements.wrapper.style.margin = "0 0 0 0";

				// Size the element, but only for the first time
				if (!this._elements.wrapper.style.width) {
					let bbox = this._elements.wrapper.getBoundingClientRect();
					this._elements.wrapper.style.width = bbox.width + "px";
					this._elements.wrapper.style.height = bbox.height + "px";
				}

				this._sized = true;
			}

			setTimeout(() => {
				if (!this._elements.wrapper) {
					return;
				}

				let bbox: DOMRect | ClientRect;
				if ((forceResize || !this._sized) && this._bbox) {
					bbox = this._bbox;
				}
				else {
					bbox = this._elements.wrapper.getBoundingClientRect();
					this._elements.wrapper.style.opacity = "";
				}

				// Set horizontal positioning
				switch (this.align) {
					case "left":
						this._elements.wrapper.style.left = "0";
						this._elements.wrapper.style.right = "auto";
						this._elements.wrapper.style.marginLeft = this.toStyle(this._shift.x + this._tempShift.x);
						break;
					case "center":
						this._elements.wrapper.style.left = "50%";
						this._elements.wrapper.style.right = "auto";
						this._elements.wrapper.style.marginLeft = this.toStyle(Math.round(-bbox.width / 2) + (this._shift.x + this._tempShift.x));
						break;
					case "right":
						this._elements.wrapper.style.left = "auto";
						this._elements.wrapper.style.right = "0";
						this._elements.wrapper.style.marginLeft = this.toStyle(this._shift.x + this._tempShift.x);
						break;
					default:
						this._elements.wrapper.style.left = this.toStyle(this.left) || "auto";
						this._elements.wrapper.style.right = this.toStyle(this.right) || "auto";
						this._elements.wrapper.style.marginLeft = this.toStyle(this._shift.x + this._tempShift.x);
						break;
				}

				// Set vertical positioning
				switch (this.verticalAlign) {
					case "top":
						this._elements.wrapper.style.top = "0";
						this._elements.wrapper.style.bottom = "auto";
						this._elements.wrapper.style.marginTop = this.toStyle(this._shift.y + this._tempShift.y);
						break;
					case "middle":
						this._elements.wrapper.style.top = "50%";
						this._elements.wrapper.style.bottom = "auto";
						this._elements.wrapper.style.marginTop = this.toStyle(Math.round(-bbox.height / 2) + (this._shift.y + this._tempShift.y));
						break;
					case "bottom":
						this._elements.wrapper.style.top = "auto";
						this._elements.wrapper.style.bottom = "0";
						this._elements.wrapper.style.marginTop = this.toStyle(this._shift.y + this._tempShift.y);
						break;
					default:
						this._elements.wrapper.style.top = this.toStyle(this.top) || "auto";
						this._elements.wrapper.style.bottom = this.toStyle(this.bottom) || "auto";
						this._elements.wrapper.style.marginTop = this.toStyle(this._shift.y + this._tempShift.y);
						break;
				}

			}, 1);
		}, 1);

	}

	protected setupDragging(): void {
		if (this.draggable) {
			if (!this._IOs.wrapper.events.has("drag")) {
				this._IOs.wrapper.events.on("drag", (ev) => {
					this._tempShift.x = ev.shift.x;
					this._tempShift.y = ev.shift.y;
					this.positionElement(false);
				});
			}
			if (!this._IOs.wrapper.events.has("dragstop")) {
				this._IOs.wrapper.events.on("dragstop", (ev) => {
					this._shift.x += this._tempShift.x;
					this._shift.y += this._tempShift.y;
					this._tempShift.x = 0;
					this._tempShift.y = 0;
					this.positionElement(false);
				});
			}
		}
		else {
			// @todo Remove events
		}
	}

	protected toStyle(value: number | Percent): string | null {
		if (!$type.hasValue(value)) {
			return null;
		}
		else if ($type.isNumber(value)) {
			return "" + value + "px";
		}
		else {
			return value.toString();
		}
	}

	/**
	 * A prefix that is applied to class names of various popup elements.
	 *
	 * @return {string} Class name prefix
	 */
	public get classPrefix(): string {
		return this.adapter.apply("classPrefix", this._classPrefix);
	}

	/**
	 * @param {string} value Class name prefix
	 */
	public set classPrefix(value: string) {
		this._classPrefix = value;
	}

	/**
	 * Returns raw prefix (without adapters applied).
	 *
	 * @ignore Exclude from docs
	 * @return {string} Class name prefix
	 */
	public get classPrefixRaw(): string {
		return this._classPrefix;
	}

	/**
	 * Popup content.
	 *
	 * Popup content can be any valid HTML, including CSS.
	 *
	 * @param {string} value Popup content
	 */
	public set content(value: string) {
		if (this._content != value) {
			this._content = value;
			if (!this._elements.content) {
				this.createContentElement();
			}
			this._elements.content.innerHTML = value;
			this.positionElement();
		}
	}

	/**
	 * @return {string} Popup content
	 */
	public get content(): string {
		return this.adapter.apply("content", this._content);
	}

	protected getClassNames() {
		return this.adapter.apply("classNames", {
			wrapperClass: this.classPrefix + "",
			titleClass: this.classPrefix + "-title",
			contentClass: this.classPrefix + "-content",
			curtainClass: this.classPrefix + "-curtain",
			closeClass: this.classPrefix + "-close"
		});
	}

	/**
	 * Creates content element.
	 */
	protected createContentElement(): void {

		// Check if it's created already
		if (this._elements.wrapper) {
			return;
		}

		// Get class names for popup elements
		let classNames = this.getClassNames();

		// Create content element
		let wrapper = document.createElement("div");
		wrapper.className = classNames.contentClass;
		wrapper.style.opacity = "0.01";

		// Create close button
		let close = document.createElement("a");
		close.className = classNames.closeClass;

		// Content title
		let title = document.createElement("div");
		title.innerHTML = this.title;
		title.className = classNames.titleClass;
		if (!this.title) {
			title.style.display = "none";
		}

		// Content div
		let content = document.createElement("div");
		content.innerHTML = this.content;

		// Set up events for content
		this._IOs.wrapper = getInteraction().getInteraction(wrapper);
		this._disposers.push(this._IOs.wrapper);

		// Set hover/out events
		this._IOs.wrapper.events.on("over", this.disablePointers, this);
		this._IOs.wrapper.events.on("out", this.releasePointers, this);

		// Create an InteractionObject for close
		this._IOs.close = getInteraction().getInteraction(close);
		this._disposers.push(this._IOs.close);

		// Hide close for now
		close.style.visibility = "hidden";

		// Add accessible stuff
		wrapper.setAttribute("role", "dialog");

		// Add to wrapper
		wrapper.appendChild(close);
		wrapper.appendChild(title);
		wrapper.appendChild(content);
		this.container.appendChild(wrapper);

		// Save for later access
		this._elements.wrapper = wrapper;
		this._elements.content = content;
		this._elements.title = title;
		this._elements.close = close;

		// Load CSS
		if (this.defaultStyles) {
			this.loadDefaultCSS();
		}

		// Create curtain as well
		this.createCurtainElement();

		// Apply events
		this.applyEvents();

		this.applyReaderSettings();

		// Draggable?
		this.setupDragging();

	}

	/**
	 * Popup title.
	 *
	 * Popup title can be any valid HTML, including CSS.
	 *
	 * @param {string}  value  Popup title
	 */
	public set title(value: string) {
		if (this._title != value) {
			this._title = value;
			if (!this._elements.content) {
				this.createContentElement();
			}
			this._elements.title.innerHTML = value;
			this.positionElement();
			this.applyReaderSettings();
		}
	}

	/**
	 * @return {string} Popup title
	 */
	public get title(): string {
		return this.adapter.apply("title", this._title);
	}

	/**
	 * A title for screen readers. It is very highly recommended to set that title
	 * so that people using screen reader tools can get an immediate summary of
	 * the information in the popup.
	 *
	 * @param {string}  value  Reader title
	 */
	public set readerTitle(value: string) {
		if (this._readerTitle != value) {
			this._readerTitle = value;
			this.applyReaderSettings();
		}
	}

	/**
	 * @return {string} Popup content
	 */
	public get readerTitle(): string {
		return this.adapter.apply(
			"readerTitle",
			this._readerTitle != "" ? this._readerTitle : this.title
		);
	}

	/**
	 * Is popup closable?
	 *
	 * If it is, it can be closed in a number of ways, e.g. by hitting ESC key,
	 * clicking curtain, or clicking the close button.
	 *
	 * If it is not closable, the only way to close it is via `close()` call.
	 *
	 * @param {boolean} value Closable?
	 */
	public set closable(value: boolean) {
		if (value !== this._closable) {
			this._closable = value;
			this.applyEvents();
		}
	}

	/**
	 * @return {boolean} Closable?
	 */
	public get closable(): boolean {
		return this.adapter.apply("closable", this._closable);
	}

	/**
	 * If set to other than "none" will try to re-adjust the position of the
	 * popop to fit within chart container or browser window.
	 *
	 * @ignore
	 * @todo Implement
	 * @default "window"
	 * @param {"none" | "container" | "window"}  value  Fit option
	 */
	public set fitTo(value: "none" | "container" | "window") {
		if (value != this._fitTo) {
			this._fitTo = value;
			this.positionElement;
		}
	}

	/**
	 * @ignore
	 * @todo Implement
	 * @return {"none" | "container" | "window"} Fit option
	 */
	public get fitTo(): "none" | "container" | "window" {
		return this.adapter.apply("fitTo", this._fitTo);
	}

	/**
	 * Should popup use default CSS?
	 *
	 * If default CSS is disabled, an external CSS should handle the look of the
	 * popup, since it will look quite out of place otherwise.
	 *
	 * @default true
	 * @param {string} Use default CSS?
	 */
	public set defaultStyles(value: boolean) {
		if (this._defaultStyles != value) {
			this._defaultStyles = value;
		}
	}

	/**
	 * @return {boolean} Use default CSS?
	 */
	public get defaultStyles(): boolean {
		return this.adapter.apply("defaultStyles", this._defaultStyles);
	}

	/**
	 * Should popup use dim out all content behind it?
	 *
	 * @default false
	 * @param {boolean} Show curtain?
	 */
	public set showCurtain(value: boolean) {
		if (this._showCurtain != value) {
			this._showCurtain = value;
			if (this._elements.curtain) {
				this._elements.curtain.style.display = value ? "block" : "none";
			}
		}
	}

	/**
	 * @return {boolean} Show curtain?
	 */
	public get showCurtain(): boolean {
		return this.adapter.apply("showCurtain", this._showCurtain);
	}

	/**
	 * Creates curtain element.
	 */
	protected createCurtainElement(): void {

		// Get class names for popup elements
		let classNames = this.getClassNames();

		// Create the curtain
		let curtain = document.createElement("div");
		curtain.className = classNames.curtainClass;

		// Append curtain to wrapper
		this.container.appendChild(curtain);

		// Create an InteractionObject for curtain because we might need to
		// set interactions on it
		this._IOs.curtain = getInteraction().getInteraction(curtain);

		// Add Curtain IO to disposers
		this._disposers.push(this._IOs.curtain);

		// Set events to disable underlying interactivity
		this._IOs.curtain.events.on("over", this.disablePointers, this);
		this._IOs.curtain.events.on("out", this.releasePointers, this);

		// Hide it?
		curtain.style.display = this.showCurtain ? "block" : "none";

		// Save for later
		this._elements.curtain = curtain;

	}

	/**
	 * Can the popup be dragged with a pointer?
	 *
	 * @default false
	 * @param {boolean} Show curtain?
	 */
	public set draggable(value: boolean) {
		if (this._draggable != value) {
			this._draggable = value;
			this.setupDragging();
		}
	}

	/**
	 * @return {boolean} Show curtain?
	 */
	public get draggable(): boolean {
		return this.adapter.apply("draggable", this._draggable);
	}

	/**
	 * Horizontal positioning of the content window.
	 *
	 * Available options: "left", "center" (default), "right", and "none".
	 *
	 * @default "center"
	 * @param {Align} Horizontal position
	 */
	public set align(value: Align) {
		if (this._align != value) {
			this._align = value;
			this.positionElement();
		}
	}

	/**
	 * @return {boolean} Horizontal position
	 */
	public get align(): Align {
		return this.adapter.apply("align", this._align);
	}

	/**
	 * Vertical positioning of the content window.
	 *
	 * Available options: "top", "middle" (default), "bottom", and "none".
	 *
	 * @default "middle"
	 * @param {VerticalAlign} Vertical position
	 */
	public set verticalAlign(value: VerticalAlign) {
		if (this._verticalAlign != value) {
			this._verticalAlign = value;
			this.positionElement();
		}
	}

	/**
	 * @return {boolean} Vertical position
	 */
	public get verticalAlign(): VerticalAlign {
		return this.adapter.apply("verticalAlign", this._verticalAlign);
	}

	/**
	 * "left" coordinate of a non-aligned (`align = "none"`) popup.
	 *
	 * Can be either absolute pixel value, or relative (`Percent`).
	 *
	 * Setting this property will automatically set `align` to "none".
	 *
	 * NOTE: The position is relative to the chart container.
	 *
	 * @param {number | Percent} Left
	 */
	public set left(value: number | Percent) {
		if (this.left != value) {
			this._left = value;
			this._align = "none";
			this.positionElement();
		}
	}

	/**
	 * @return {boolean} Left
	 */
	public get left(): number | Percent {
		return this.adapter.apply("left", this._left);
	}

	/**
	 * "right" coordinate of a non-aligned (`align = "none"`) popup.
	 *
	 * Can be either absolute pixel value, or relative (`Percent`).
	 *
	 * Setting this property will automatically set `align` to "none".
	 *
	 * NOTE: The position is relative to the chart container.
	 *
	 * @param {number | Percent} Right
	 */
	public set right(value: number | Percent) {
		if (this.right != value) {
			this._right = value;
			this._align = "none";
			this.positionElement();
		}
	}

	/**
	 * @return {boolean} Right
	 */
	public get right(): number | Percent {
		return this.adapter.apply("right", this._right);
	}

	/**
	 * "top" coordinate of a non-aligned (`verticalAlign = "none"`) popup.
	 *
	 * Can be either absolute pixel value, or relative (`Percent`).
	 *
	 * Setting this property will automatically set `verticalAlign` to "none".
	 *
	 * NOTE: The position is relative to the chart container.
	 *
	 * @param {number | Percent} Top
	 */
	public set top(value: number | Percent) {
		if (this.top != value) {
			this._top = value;
			this._verticalAlign = "none";
			this.positionElement();
		}
	}

	/**
	 * @return {boolean} Top
	 */
	public get top(): number | Percent {
		return this.adapter.apply("top", this._top);
	}

	/**
	 * "bottom" coordinate of a non-aligned (`verticalAlign = "none"`) popup.
	 *
	 * Can be either absolute pixel value, or relative (`Percent`).
	 *
	 * Setting this property will automatically set `verticalAlign` to "none".
	 *
	 * NOTE: The position is relative to the chart container.
	 *
	 * @param {number | Percent} Bottom
	 */
	public set bottom(value: number | Percent) {
		if (this.bottom != value) {
			this._bottom = value;
			this._verticalAlign = "none";
			this.positionElement();
		}
	}

	/**
	 * @return {boolean} Bottom
	 */
	public get bottom(): number | Percent {
		return this.adapter.apply("bottom", this._bottom);
	}

	/**
	 * Returns an object with references to various elements of the Popup.
	 *
	 * * `wrapper`
	 * * `title`
	 * * `content`
	 * * `close`
	 * * `curtain`
	 */
	public get elements(): {
		wrapper?: HTMLElement;
		title?: HTMLElement;
		content?: HTMLElement;
		close?: HTMLElement;
		curtain?: HTMLElement;
	} {
		return this._elements;
	}

	/**
	 * Loads popup CSS.
	 *
	 * @ignore Exclude from docs
	 */
	public loadDefaultCSS(): void {
		if (!this._cssLoaded) {
			this._disposers.push(popupCSS(this.classPrefix));
			$object.each(this._elements, (key, el) => {
				el.style.display = "";
			});
			this._cssLoaded = true;
		}
	}

	/**
	 * If popup is closable, this method adds various events to popup elements.
	 */
	protected applyEvents(): void {
		if (this._IOs.close) {
			if (this.closable) {
				this._IOs.close.element.style.visibility = "visible";

				let disposers = [
					getInteraction().body.events.on("keyup", (ev) => {
						if (keyboard.isKey(ev.event, "esc") && this.closable) {
							this.close()
						}
					}),
					this._IOs.close.events.on("hit", (ev) => {
						this.close();
					})
				];
				disposers.push(this._IOs.curtain.events.on("hit", (ev) => {
					if (this.showCurtain) {
						this.close();
					}
				}));
				this._disposers.push(new MultiDisposer(disposers));
			}
			else {
				this._IOs.close.element.style.visibility = "hidden";
			}
		}
	}

	/**
	 * Disables interactivity on parent chart.
	 */
	protected disablePointers(): void {
		if (this.sprite) {
			this._spriteInteractionsEnabled = this.sprite.interactionsEnabled;
			this.sprite.interactionsEnabled = false;
		}
	}

	/**
	 * Releases temporarily disabled pointers on parent chart.
	 */
	protected releasePointers(): void {
		if ($type.hasValue(this._spriteInteractionsEnabled)) {
			this.sprite.interactionsEnabled = this._spriteInteractionsEnabled;
			this._spriteInteractionsEnabled = undefined;
		}
	}

	/**
	 * Sets screen reader related settings.
	 */
	protected applyReaderSettings(): void {
		this.elements.wrapper.setAttribute("aria-label", this.readerTitle);
	}

	/**
	 * Copies all properties and related data from different element.
	 *
	 * @param {this} object Source element
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.container = source.container;
		this.sprite = source.sprite;
		this.classPrefix = source.classPrefixRaw;
		this.content = source.content;
		this.title = source.title;
		this.readerTitle = source.readerTitle;
		this.defaultStyles = source.defaultStyles;
		this.showCurtain = source.showCurtain;
		this.align = source.align;
		this.verticalAlign = source.verticalAlign;
		this.left = source.left;
		this.right = source.right;
		this.top = source.top;
		this.bottom = source.bottom;
		this.adapter.copyFrom(source.adapter);
	}

}
