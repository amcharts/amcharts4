/**
 * This functionality is related to the HTML wrapper that houses `<svg>` tag.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container } from "../Container";
import { Sprite } from "../Sprite";
import { IDisposer, Disposer } from "../utils/Disposer";
import { Popup } from "../elements/Popup";
import { Modal } from "../elements/Modal";
import { ListTemplate, ListDisposer } from "../utils/List";
import * as $utils from "../utils/Utils";
import * as $dom from "../utils/DOM";
import * as $array from "../utils/Array";
import * as $type from "../utils/Type";
import ResizeSensor from "css-element-queries/src/ResizeSensor";



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
 */
export const svgContainers: Array<SVGContainer> = [];

/**
 * A class used to create an HTML wrapper for the SVG contents.
 */
export class SVGContainer implements IDisposer {

	/**
	 * Indicates if this object has already been deleted. Any
	 * destruction/disposal code should take this into account when deciding
	 * wheter to run potentially costly disposal operations if they already have
	 * been run.
	 */
	protected _disposed: boolean = false;

	/**
	 * Width of HTML element.
	 */
	public width: $type.Optional<number>;

	/**
	 * Height of HTML element.
	 */
	public height: $type.Optional<number>;

	/**
	 * A [[Container]] element which is placed into container.
	 */
	protected _container: $type.Optional<Container>;

	/**
	 * A parent HTML container that SVG wrapper element is placed in.
	 */
	public htmlElement: HTMLElement;

	/**
	 * If this component is in a separate HTML container, `autoResize` means the
	 * module will constantly measure container's size and adopt contents to it.
	 */
	public autoResize: Boolean = true;

	/**
	 * A `<div>` element which acts as a wrapper/holder for the SVG element.
	 */
	public SVGContainer: HTMLDivElement;

	/**
	 * A reference to ResizeSensor object which monitors changes of div size.
	 *
	 * @ignore
	 */
	public resizeSensor: ResizeSensor;

	/**
	 * Holds list of references to [[Sprite]] objects that should not be exported
	 * when exporting chart to an image.
	 *
	 * @ignore
	 */
	public nonExportableSprites: Sprite[] = [];

	/**
	 * Holds [[Modal]] object.
	 *
	 * @ignore Exclude from docs
	 */
	protected _modal: $type.Optional<Modal>;

	/**
	 * Holds [[Popup]] objects.
	 *
	 * @ignore Exclude from docs
	 */
	protected _popups: $type.Optional<ListTemplate<Popup>>;

	/**
	 * List of objects that need to be disposed when this one is disposed.
	 */
	protected _disposers: Array<IDisposer> = [];

	public cssScale: number = 1;

	/**
	 * Constructor
	 *
	 * * Creates an HTML wrapper for SVG
	 */
	constructor(htmlElement: HTMLElement, ghost?: boolean) {

		// Log parent HTML element
		this.htmlElement = htmlElement;

		if (!ghost) {
			const callback = () => {
				if (this.autoResize) {
					this.measure();
				}
			};

			this.resizeSensor = new ResizeSensor(htmlElement, callback);

			this._disposers.push(new Disposer(() => {
				this.resizeSensor.detach(callback);
			}));
		}

		// Adds to containers array
		svgContainers.push(this);

		/**
		 * Create child div for the container - it will have svg node
		 * It might seem that this container is not necessay, however having it solves
		 * a problems with mouse position detection and some other.
		 */
		let svgContainer = document.createElement("div");
		let style = svgContainer.style;
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
	public measure(): void {
		let width: number = $utils.width(this.htmlElement);
		let height: number = $utils.height(this.htmlElement);
		let container = this.container;
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
			this.cssScale = 1;
			this.checkTransform(this.htmlElement);
		}
	}

	/**
	 * A [[Container]] element which is placed into container.
	 *
	 * @param container  Container
	 */
	public set container(container: $type.Optional<Container>) {
		this._container = container;
		this.measure();
	}

	/**
	 * @return Container
	 */
	public get container(): $type.Optional<Container> {
		return this._container;
	}

	/**
	 * Returns if this object has been already been disposed.
	 *
	 * @return Is disposed?
	 */
	public isDisposed(): boolean {
		return this._disposed;
	}

	/**
	 * Removes this container from SVG container list in system, which
	 * effectively disables size change monitoring for it.
	 */
	public dispose(): void {
		if (!this._disposed) {
			$array.remove(svgContainers, this);
		}

		$array.each(this._disposers, (item) => {
			item.dispose();
		});
	}

	/**
	 * Indicates if chart container should have its style set
	 * to `overflow: hidden`.
	 *
	 * Normally, we don't want that, so that certain elements, such as tooltips,
	 * would be able to go outside chart area.
	 *
	 * There is one issue though. Some browsers ignore SVG masks and would
	 * display scrollbars if chart elements, that go outside chart area extend
	 * outside window.
	 *
	 * This is especially true for [[MapChart]], which can have its elements
	 * extend very widely when zoomed in. Even if those parts are not visible
	 * because of SVG masks, some browsers might still display window scrollbars.
	 *
	 * This is why we set this setting to `true` in [[MapChart]].
	 *
	 * Other charts use default of `false`.
	 */
	public set hideOverflow(value: boolean) {
		if (value) {
			this.SVGContainer.style.overflow = "hidden";
		}
		else {
			this.SVGContainer.style.overflow = "";
		}
	}

	/**
	 * ==========================================================================
	 * MODAL/POPUP RELATED STUFF
	 * ==========================================================================
	 * @hidden
	 */

	/**
	 * Returns a [[Modal]] instance, associated with this chart.
	 * (elements top parent)
	 *
	 * Accessing modal does not make it appear. To make a modal appear, use
	 * `showModal()` method.
	 *
	 * @see {@link Modal} for more information about using Modal windows
	 * @return Modal instance
	 */
	public get modal(): Modal {

		if (!$type.hasValue(this._modal)) {

			// Create new modal
			this._modal = new Modal();
			this._modal.container = this.SVGContainer;

			// Add to disposers
			this._disposers.push(this._modal);
		}
		return this._modal;

	}

	/**
	 * Opens a modal window with specific content (`text` parameter) and,
	 * optionally, `title`.
	 *
	 * The `text` parameter can contain HTML content.
	 *
	 * @see {@link Modal} for more information about using Modal windows
	 * @param text   Modal contents
	 * @param title  Title for the modal window
	 */
	public openModal(text: string, title?: string): Modal {

		// Hide previous modal
		this.closeModal();

		// Create modal
		let modal = this.modal;
		modal.content = text;
		modal.readerTitle = title;
		modal.open();

		return modal;
	}

	/**
	 * Hides modal window if there is one currently open.
	 */
	public closeModal(): void {
		if (this._modal) {
			this.modal.close();
		}
	}

	/**
	 * A list of popups for this chart.
	 *
	 * @return Popups
	 */
	public get popups(): ListTemplate<Popup> {

		if (!$type.hasValue(this._popups)) {

			// Create popup template
			let popupTemplate = new Popup();
			popupTemplate.container = this.SVGContainer;

			// Create the list
			this._popups = new ListTemplate(popupTemplate);

			// Add to disposers
			this._disposers.push(new ListDisposer(this._popups));
			this._disposers.push(this._popups.template);
		}
		return this._popups;

	}

	/**
	 * Creates, opens, and returns a new [[Popup]] window.
	 *
	 * `text` can be any valid HTML.
	 *
	 * `title` is currently not supported.
	 *
	 * @param text   Popup contents
	 * @param title  Popup title
	 * @return Popup instance
	 */
	public openPopup(text: string, title?: string): Popup {
		let popup = this.popups.create();
		popup.content = text;
		if ($type.hasValue(title)) {
			popup.title = title;
		}
		popup.open();
		return popup;
	}

	/**
	 * Closes all currently open popup windows
	 */
	public closeAllPopups(): void {
		this.popups.each((popup) => {
			popup.close();
		});
	}


	protected checkTransform(div: HTMLElement) {
		if (window.getComputedStyle) {
			if (div && div.style) {
				let style = window.getComputedStyle(div, null);
				if (style) {
					let matrix = style.getPropertyValue("-webkit-transform") ||
						style.getPropertyValue("-moz-transform") ||
						style.getPropertyValue("-ms-transform") ||
						style.getPropertyValue("-o-transform") ||
						style.getPropertyValue("transform");

					if (matrix && matrix !== "none") {
						let values = matrix.split('(')[1].split(')')[0].split(',');
						let a = Number(values[0]);
						let b = Number(values[1]);

						let scale = Math.sqrt(a * a + b * b);

						if (!isNaN(scale)) {
							this.cssScale *= scale;
						}
					}
				}
			}
			if (div.parentNode && div.parentNode instanceof HTMLElement) {
				this.checkTransform(div.parentNode);
			}
		}
	}
}
