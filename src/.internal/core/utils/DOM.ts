/**
 * A collection of DOM-related functions.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Disposer, IDisposer } from "./Disposer";
import { readFrame, writeFrame } from "./AsyncPending";
import * as $object from "./Object";
import * as $array from "./Array";
import * as $type from "./Type";

/**
 * SVG namespace.
 *
 * @ignore Exclude from docs
 */
export const SVGNS: string = "http://www.w3.org/2000/svg";

/**
 * XML namespace.
 *
 * @ignore Exclude from docs
 */
export const XMLNS: string = "http://www.w3.org/2000/xmlns/";

/**
 * XLINK namespace.
 *
 * @ignore Exclude from docs
 */
export const XLINK: string = "http://www.w3.org/1999/xlink";


/**
 * Function that adds a disposable event listener directly to a DOM element.
 *
 * @ignore Exclude from docs
 * @param dom       A DOM element to add event to
 * @param type      Event type
 * @param listener  Event listener
 * @returns Disposable event
 */
export function addEventListener<E extends Event>(dom: EventTarget, type: string, listener: (event: E) => void, options?: any): IDisposer {
	//@todo proper type check for options: EventListenerOptions | boolean (TS for some reason gives error on passive parameter)
	//console.log(type, dom);
	dom.addEventListener(type, <EventListener>listener, options || false);

	return new Disposer(() => {
		dom.removeEventListener(type, <EventListener>listener, options || false);
	});
}

/**
 * Finds and returns an element reference using following logic:
 * * If we pass in an element instance, we just return it back.
 * * If we pass in a string, the function looks for an element with such id.
 * * If no element with such id is found, we grab the first element with a tag name like this.
 *
 * @ignore Exclude from docs
 * @param el  Element definition (reference, or id, or tag name)
 * @return Element reference
 * @todo Review this function as it seems pretty fuzzy and hacky
 */
export function getElement(el: $type.Optional<HTMLElement | string>): $type.Optional<HTMLElement> {
	if ($type.isString(el)) {
		let e: Element | null = document.getElementById(el);

		if (e == null) {
			e = document.getElementsByClassName(el)[0];
		}

		if (e instanceof HTMLElement) {
			return e;
		}

	} else if (el instanceof HTMLElement) {
		return el;
	}
}

/**
 * Adds a class name to an HTML or SVG element.
 *
 * @ignore Exclude from docs
 * @param element    Element
 * @param className  Class name to add
 */
export function addClass(element: HTMLElement | SVGSVGElement, className: string): void {
	if (!element) {
		return;
	}
	if (element.classList) {
		element.classList.add(className);
	}
	else {
		let currentClassName = element.getAttribute("class");
		if (currentClassName) {
			element.setAttribute("class", currentClassName.split(" ").filter((item) => {
				return item !== className;
			}).join(" ") + " " + className);
		}
		else {
			element.setAttribute("class", className);
		}
		//element.className = element.className.replace(new RegExp("^" + className + "| " + className), "") + " " + className;
	}
}

/**
 * Removes a class name from an HTML or SVG element.
 *
 * @ignore Exclude from docs
 * @param element    Element
 * @param className  Class name to add
 */
export function removeClass(element: HTMLElement | SVGSVGElement, className: string): void {
	if (!element) {
		return;
	}
	if (element.classList) {
		element.classList.remove(className);
	}
	else {
		let currentClassName = element.getAttribute("class");
		if (currentClassName) {
			element.setAttribute("class", currentClassName.split(" ").filter((item) => {
				return item !== className;
			}).join(" "));
		}
		//element.className = element.className.replace(new RegExp("^" + className + "| " + className), "");
	}
}

/**
 * Sets style property on DOM element.
 *
 * @ignore Exclude from docs
 * @todo Still needed?
 */
export function setStyle(element: HTMLElement | SVGSVGElement, property: string, value: string): void {
	(<any>element.style)[property] = value;
}

/**
 * Gets the computed style value for an element.
 *
 * @ignore Exclude from docs
 */
export function getComputedStyle(element: Element, property: string): string | number {

	if ((<any>element).currentStyle) {
		return (<any>element).currentStyle[property];
	}

	return document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
}

/**
 * Removes focus from any element by shifting focus to body.
 *
 * @ignore Exclude from docs
 */
export function blur(): void {
	let input = document.createElement("input");
	input.style.position = "fixed";
	input.style.top = "0px";
	input.style.left = "-10000px";
	document.body.appendChild(input);
	input.focus();
	input.blur();
	document.body.removeChild(input);
}

/**
 * Tries to focus the element.
 *
 * @ignore Exlude from docs
 * @param element  Element to focus
 */
export function focus(element: HTMLElement | SVGSVGElement): void {

	if (element instanceof HTMLElement) {
		element.focus();
	}
	else {
		let input = document.createElement("input");
		let fo = <SVGSVGElement>document.createElementNS(SVGNS, "foreignObject");
		fo.appendChild(input);
		element.appendChild(fo);
		input.focus();
		input.disabled = true;
		fo.remove();
	}

	/*if ((<any>element).focus != undefined) {
		(<any>element).focus();
	}
	else if (element instanceof SVGSVGElement) {
		// Not implemented
		// @todo implement focus fallback
	}*/
}

/**
 * Returns markup for the element including the element tag itself.
 * SVG elements do not support `outerHTML` so this functions applies of
 * a workaround which creates a new temporary wrapper, clones element and uses
 * wrapper's `innerHTML`.
 *
 * @ignore Exclude from docs
 * @param element  Element to get full markup for
 * @return Markup
 * @deprecated Not in use anywhere
 */
export function outerHTML(element: HTMLElement | SVGSVGElement): string {
	if (element.outerHTML) {
		return element.outerHTML;
	}
	else {
		let twrap = document.createElement("div");
		let tnode = element.cloneNode(true);
		twrap.appendChild(tnode);
		let content = twrap.innerHTML;
		return content;
	}
}

/**
 * Checks if element is a valid DOM node.
 *
 * @ignore Exclude from docs
 * @param el  Element
 * @return `true` if element is a valid DOM node
 */
export function isElement(el: HTMLElement): boolean {
	return el instanceof Object && el && el.nodeType === 1;
}

/**
 * Checks of element `a` contains element `b`.
 *
 * @param a  Aleged ascendant
 * @param b  Aleged descendant
 * @return Contains?
 */
export function contains(a: HTMLElement | SVGSVGElement, b: HTMLElement | SVGSVGElement): boolean {
	let cursor: Node = b;

	while (true) {
		if (a === cursor) {
			return true;

		} else if (cursor.parentNode == null) {
			// TODO better ShadowRoot detection
			if ((<ShadowRoot>cursor).host == null) {
				return false;

			} else {
				cursor = (<ShadowRoot>cursor).host;
			}

		} else {
			cursor = cursor.parentNode;
		}
	}
}

/**
 * Returns the root of the element (either the Document or the ShadowRoot)
 *
 * @param a  Node
 * @return Root
 */
export function getRoot(a: Node): Document | ShadowRoot | null {
	// TODO replace with Node.prototype.getRootNode
	const owner = a.ownerDocument;

	let cursor: Node = a;

	while (true) {
		if (cursor.parentNode == null) {
			// If the cursor is the document, or it is a ShadowRoot
			// TODO better ShadowRoot detection
			if (cursor === owner || (<ShadowRoot>cursor).host != null) {
				return <Document | ShadowRoot>cursor;

			} else {
				return null;
			}

		} else {
			cursor = cursor.parentNode;
		}
	}
}

/**
 * Gets the true target of the Event.
 *
 * This is needed to make events work with the shadow DOM.
 *
 * @param event  Event
 * @return EventTarget
 */
export function eventTarget(event: Event): EventTarget {
	if (typeof (<any>event).composedPath === "function") {
		return (<any>event).composedPath()[0];

	} else {
		return event.target;
	}
}

/**
 * Copies attributes from one element to another.
 *
 * @ignore Exclude from docs
 * @param source  Element to copy attributes from
 * @param target  Element to copy attributes to
 */
export function copyAttributes(source: Element | HTMLElement | SVGSVGElement, target: HTMLElement | SVGSVGElement): void {
	$array.each(source.attributes, (attr) => {
		// TODO what if it's null ?
		if (attr.value != null) {
			target.setAttribute(attr.name, attr.value);
		}
	});
}

/**
 * [fixPixelPerfect description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param el  Element
 */
export function fixPixelPerfect(el: HTMLElement): void {
	readFrame(() => {
		// sometimes IE doesn't like this
		// TODO figure out a way to remove this
		try {
			const rect = el.getBoundingClientRect();

			const left = rect.left - Math.round(rect.left);
			const top = rect.top - Math.round(rect.top);

			if (left !== 0) {
				writeFrame(() => {
					el.style.left = left + "px";
				});
			}

			if (top !== 0) {
				writeFrame(() => {
					el.style.top = top + "px";
				});
			}

		} catch (e) { }
	});
}

/**
 * [rootStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
let rootStylesheet: $type.Optional<CSSStyleSheet>;

/**
 * [getStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @return [description]
 */
function getStylesheet(): CSSStyleSheet {
	if (!$type.hasValue(rootStylesheet)) {
		// TODO use createElementNS ?
		const e = document.createElement("style");
		e.type = "text/css";
		document.head.appendChild(e);
		rootStylesheet = e.sheet as CSSStyleSheet;
	}

	return rootStylesheet;
}

/**
 * [makeStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param selector  [description]
 * @return [description]
 */
function makeStylesheet(selector: string): CSSStyleRule {
	const root = getStylesheet();

	const index = root.cssRules.length;

	root.insertRule(selector + "{}", index);

	return root.cssRules[index] as CSSStyleRule;
}

/**
 * Defines a class for a CSS rule.
 *
 * Can be used to dynamically add CSS to the document.
 */
export class StyleRule extends Disposer {

	/**
	 * CSS rule.
	 */
	private _rule: CSSStyleRule;

	/**
	 * A CSS selector text.
	 *
	 * E.g.: `.myClass p`
	 *
	 * @param selector  CSS selector
	 */
	public set selector(selector: string) {
		this._rule.selectorText = selector;
	}

	/**
	 * @return CSS selector
	 */
	public get selector(): string {
		return this._rule.selectorText;
	}

	/**
	 * Constructor.
	 *
	 * @param selector  CSS selector
	 * @param styles    An object of style attribute - value pairs
	 */
	constructor(selector: string, styles: { [name: string]: string }) {
		// TODO test this
		super(() => {
			const root = getStylesheet();

			// TODO a bit hacky
			const index = $array.indexOf(root.cssRules, this._rule);

			if (index === -1) {
				throw new Error("Could not dispose StyleRule");

			} else {
				root.deleteRule(index);
			}
		});

		this._rule = makeStylesheet(selector);

		$object.each(styles, (key, value) => {
			this.setStyle(key, value);
		});
	}

	/**
	 * Sets the same style properties with browser-specific prefixes.
	 *
	 * @param name   Attribute name
	 * @param value  Attribute value
	 */
	private _setVendorPrefixName(name: string, value: string): void {
		const style = this._rule.style;
		style.setProperty("-webkit-" + name, value, "");
		style.setProperty("-moz-" + name, value, "");
		style.setProperty("-ms-" + name, value, "");
		style.setProperty("-o-" + name, value, "");
		style.setProperty(name, value, "");
	}

	/**
	 * Sets a value for specific style attribute.
	 *
	 * @param name   Attribute
	 * @param value  Value
	 */
	public setStyle(name: string, value: string): void {
		if (name === "transition") {
			this._setVendorPrefixName(name, value);

		} else {
			this._rule.style.setProperty(name, value, "");
		}
	}

}

/**
 * An internal counter for unique style ids.
 *
 * @ignore Exclude from docs
 */
let styleId: number = 0;

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export class StyleClass extends StyleRule {

	/**
	 * Class name.
	 */
	private _className: string;

	/**
	 * Constructor.
	 *
	 * @param styles  An object of style attribute - value pairs
	 * @param name    Class name
	 */
	constructor(styles: { [name: string]: string }, name?: string) {
		const className =
			(!$type.hasValue(name)
				// TODO generate the classname randomly
				? "__style_" + (++styleId) + "__"
				: name);

		super("." + className, styles);

		this._className = className;
	}

	/**
	 * Class name.
	 *
	 * @param name  Class name
	 */
	public set className(name: string) {
		this._className = name;
		this.selector = "." + name;
	}

	/**
	 * @return Class name
	 */
	public get className(): string {
		return this._className;
	}

	/**
	 * Converts the whole class to
	 * @ignore Exclude from docs
	 */
	public toString(): string {
		return this._className;
	}

}


export function ready(f: () => void): void {
	if (document.readyState !== "loading") {
		f();

	} else {
		const listener = () => {
			if (document.readyState !== "loading") {
				document.removeEventListener("readystatechange", listener);
				f();
			}
		};

		document.addEventListener("readystatechange", listener);
	}
}

/**
 * Returns a font fmaily name for the element (directly set or
 * computed/inherited).
 *
 * @ignore Exclude from docs
 * @param element  Element
 * @return Font family
 */
export function findFont(element: Element): string {

	// Check if element has styles set
	let font = getComputedStyle(element, "font-family");

	if (!font) {
		// Completely transparent. Look for a parent
		let parent = element.parentElement || <Element>element.parentNode;
		if (parent) {
			return findFont(parent);
		}
		else {
			return undefined;
		}
	}
	else {
		return (<string>font);
	}

}

/**
 * Returns a font fmaily name for the element (directly set or
 * computed/inherited).
 *
 * @ignore Exclude from docs
 * @param element  Element
 * @return Font family
 */
export function findFontSize(element: Element): string {

	// Check if element has styles set
	let font = getComputedStyle(element, "font-size");

	if (!font) {
		// Completely transparent. Look for a parent
		let parent = element.parentElement || <Element>element.parentNode;
		if (parent) {
			return findFontSize(parent);
		}
		else {
			return undefined;
		}
	}
	else {
		return (<string>font);
	}

}

/**
 * Checks whether element is not visible, whether directly or via its
 * ascendants.
 *
 * @param   element  Target element
 * @return           Hidden?
 */
export function isHidden(element: HTMLElement): boolean {
	return (element.offsetParent === null);
}


/**
 * Checks wthether element is in the current viewport.
 *
 * @since 2.5.5
 * @param   el Element
 * @return     Within viewport?
 */
export function isElementInViewport(el: HTMLElement, viewportTarget?: HTMLElement): boolean {

	// Get position data of the element
	let rect = el.getBoundingClientRect();

	// Should we measure against specific viewport element?
	if (viewportTarget) {

		// Check if viewport itself is visible
		if (!isElementInViewport(viewportTarget)) {
			return false;
		}

		// Check if element is visible within the viewport
		let viewportRect = viewportTarget.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.top <= (viewportRect.top + viewportRect.height) &&
			rect.left <= (viewportRect.left + viewportRect.width)
		);
	}

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.left <= (window.innerWidth || document.documentElement.clientWidth)
	);

}