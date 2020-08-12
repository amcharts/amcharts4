/**
 * Base class for axis range selector classes.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Axis } from "../../charts/axes/Axis";
import { AxisRenderer } from "../../charts/axes/AxisRenderer";
import { Validatable, IValidatableEvents } from "../../core/utils/Validatable";
import { registry } from "../../core/Registry";
import { MutableValueDisposer } from "../../core/utils/Disposer";
import { Language } from "../../core/utils/Language";
import selectorCSS from "./RangeSelectorCSS";
import * as $dom from "../../core/utils/DOM";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines events for [[RangeSelector]].
 */
export interface IRangeSelectorEvents extends IValidatableEvents {

	/**
	 * Invoked when position of the control changes.
	 */
	positionset: {
		prevPosition: "top" | "bottom" | "left" | "right";
		position: "top" | "bottom" | "left" | "right";
	}

	/**
	 * Invoked when control is drawn.
	 */
	drawn: {}

}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A base class for axis-specific range selectors.
 */
export class RangeSelector extends Validatable {

	/**
	 * Defines available events.
	 */
	public _events!: IRangeSelectorEvents;

	/**
	 * An instance of [[Language]].
	 */
	protected _language = new MutableValueDisposer<Language>();

	/**
	 * Reference to DOM element that holds the control element.
	 */
	protected _container: $type.Optional<HTMLElement>;

	/**
	 * Control element.
	 */
	protected _element: $type.Optional<HTMLElement>;

	/**
	 * Prefix for class names applied to control elements.
	 */
	protected _classPrefix: string = "amcharts-range-selector";

	/**
	 * If set to `true` [[RangeSelector]] will load it's own external CSS when
	 * instantiated.
	 */
	protected _defaultStyles: boolean = true;

	/**
	 * Holds references to various HTML elements control consists of.
	 */
	protected _elements: {
		wrapper?: HTMLElement;
	} = {};

	/**
	 * Position of the selector.
	 */
	protected _position: "top" | "bottom" | "left" | "right" = "bottom";

	/**
	 * A tabindex to apply to control.
	 */
	protected _tabindex: number = 0;

	/**
	 * Reference to target axis.
	 * 
	 * @ignore
	 */
	public _axis: Axis<AxisRenderer>;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "RangeSelector";
		this._disposers.push(this._language);
		this.invalidate();
		this.applyTheme();
	}

	/**
	 * (Re)draws the control.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		this.draw();
		super.validate();
	}

	/**
	 * Draws the control.
	 *
	 * @ignore
	 */
	public draw(): void {

		if (this.defaultStyles) {
			this.loadDefaultCSS();
		}

		// Selector wrapper
		if (!this._elements.wrapper) {
			this._elements.wrapper = document.createElement("div");
			this._elements.wrapper.className = this.classPrefix + "-wrapper " + this.classPrefix + "-" + this.position;
			this.container.appendChild(this._elements.wrapper);
		}

	}

	/**
	 * Destroys the control and all its elements.
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
	 * Getters and setters
	 */

	/**
	 * An HTML container to place the control in.
	 *
	 * A container must be an HTML element, because the control itself is HTML, and
	 * cannot be placed into SVG.
	 *
	 * @param container Reference to container element
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
	 * Position of the selector.
	 *
	 * Available options: `"top"`, `"bottom"`, `"left"` (default), and `"right"`.
	 *
	 * NOTE: since the control is always placed in the external container, this
	 * setting does actually affect where the control is placed but rather
	 * default CSS that affects how specific elements are arranged.
	 *
	 * For example, when setting position to `"top"` or `"bottom"`, the control
	 * will be arranged in a horizontal fashion.
	 *
	 * Similarly, for `"left"` and `"right"` the control will arrange itself
	 * vertically, which is more suitable for narrow containers.
	 *
	 * @default "left"
	 * @param  value  Position
	 */
	public set position(value: "top" | "bottom" | "left" | "right") {
		if (this._position != value) {
			const prevPosition = this._position;
			this._position = value;
			this.dispatchImmediately("positionset", {
				type: "positionset",
				position: value,
				prevPosition: prevPosition
			});
			this.invalidate();
		}
	}

	/**
	 * @return Position
	 */
	public get position(): "top" | "bottom" | "left" | "right" {
		return this._position;
	}

	/**
	 * Indicates whether [[RangeSelector]] should load external CSS to style
	 * itself.
	 *
	 * If set to `false`, the elements will not be styled, and will rely on some
	 * external CSS.
	 *
	 * @default true
	 * @param Should RangeSelector load its own CSS?
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
	 * @return Should RangeSelector load its own CSS?
	 */
	public get defaultStyles(): boolean {
		return this._defaultStyles
	}

	/**
	 * Loads the default CSS.
	 *
	 * @ignore Exclude from docs
	 */
	public loadDefaultCSS(): void {
		this._disposers.push(selectorCSS($dom.getShadowRoot(this.container), this.classPrefix));

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
		return this._tabindex;
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

			// Maybe use one from axis?
			if (this._axis) {
				return this._axis.language;
			}

			// TODO code duplication with `set language()`
			this._language.set(language, language.events.on("localechanged", (ev) => {
				this.invalidate();
			}));
		}

		return language;
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
		return this._classPrefix;
	}

	/**
	 * A target axis to use range selector for.
	 * 
	 * @param  value  Axis
	 */
	public set axis(value: this["_axis"]) {
		if (this._axis != value) {
			this._axis = value;
			this.prepAxis();
			this.language = value.language;
			this.invalidate();
		}
	}

	protected prepAxis(): void {
		// Do nothing. Extending classes should override.
	}

	/**
	 * @return Axis
	 */
	public get axis(): this["_axis"] {
		return this._axis;
	}


}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["RangeSelector"] = RangeSelector;