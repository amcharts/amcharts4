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
 * @type {string}
 */
export const SVGNS: string = "http://www.w3.org/2000/svg";

/**
 * XML namespace.
 *
 * @ignore Exclude from docs
 * @type {string}
 */
export const XMLNS: string = "http://www.w3.org/2000/xmlns/";

/**
 * XLINK namespace.
 *
 * @ignore Exclude from docs
 * @type {string}
 */
export const XLINK: string = "http://www.w3.org/1999/xlink";


/**
 * Function that adds a disposable event listener directly to a DOM element.
 *
 * @ignore Exclude from docs
 * @param {EventTarget}   dom       A DOM element to add event to
 * @param {string}        type      Event type
 * @param {Function}      listener  Event listener
 * @returns {IDisposer}             Disposable event
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
 * @param  {Optional<HTMLElement | string>}  el  Element definition (reference, or id, or tag name)
 * @return {Optional<HTMLElement>}               Element reference
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
 * @param {HTMLElement | SVGSVGElement}  element    Element
 * @param {string}                       className  Class name to add
 */
export function addClass(element: HTMLElement | SVGSVGElement, className: string): void {
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
 * @param {HTMLElement | SVGSVGElement}  element    Element
 * @param {string}                       className  Class name to add
 */
export function removeClass(element: HTMLElement | SVGSVGElement, className: string): void {
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
 * @param {HTMLElement | SVGSVGElement}  element  Element to focus
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
 * @param  {HTMLElement | SVGSVGElement}  element  Element to get full markup for
 * @return {string}                                Markup
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
 * @param  {HTMLElement}  el  Element
 * @return {boolean}          `true` if element is a valid DOM node
 */
export function isElement(el: HTMLElement): boolean {
	return el instanceof Object && el && el.nodeType === 1;
}

/**
 * Checks of element `a` contains element `b`.
 * 
 * @param  {HTMLElement | SVGSVGElement}  a  Aleged ascendant
 * @param  {HTMLElement | SVGSVGElement}  b  Aleged descendant
 * @return {boolean}                         Contains?
 */
export function contains(a: HTMLElement | SVGSVGElement, b: HTMLElement | SVGSVGElement): boolean {
	return a !== b && (a.contains
		? a.contains(b)
		: a.compareDocumentPosition
			? !!(a.compareDocumentPosition(b) & 16)
			: true);
}

/**
 * Copies attributes from one element to another.
 *
 * @ignore Exclude from docs
 * @param {Element | HTMLElement |  SVGSVGElement}  source  Element to copy attributes from
 * @param {HTMLElement | SVGSVGElement}          target  Element to copy attributes to
 */
export function copyAttributes(source: Element | HTMLElement | SVGSVGElement, target: HTMLElement | SVGSVGElement): void {
	for (let attr in source.attributes) {
		let value = source.attributes[attr].nodeValue;

		// TODO what if it's null ?
		if (value != null) {
			target.setAttribute(source.attributes[attr].nodeName, value);
		}
	}
}

/**
 * [fixPixelPerfect description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param {HTMLElement}  el  Element
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
 * @type {Optional<CSSStyleSheet>}
 */
let rootStylesheet: $type.Optional<CSSStyleSheet>;

/**
 * [getStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @return {CSSStyleSheet} [description]
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
 * @param  {string}        selector  [description]
 * @return {CSSStyleRule}            [description]
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
	 *
	 * @type {CSSStyleRule}
	 */
	private _rule: CSSStyleRule;

	/**
	 * A CSS selector text.
	 *
	 * E.g.: `.myClass p`
	 *
	 * @param {string}  selector  CSS selector
	 */
	public set selector(selector: string) {
		this._rule.selectorText = selector;
	}

	/**
	 * @return {string} CSS selector
	 */
	public get selector(): string {
		return this._rule.selectorText;
	}

	/**
	 * Constructor.
	 *
	 * @param {string}  selector  CSS selector
	 * @param {object}  styles    An object of style attribute - value pairs
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
	 * Sets the same style properties with browser-speicifc prefixes.
	 *
	 * @param {string}  name   Attribute name
	 * @param {string}  value  Attribute value
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
	 * @param {string}  name   Attribute
	 * @param {string}  value  Value
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
 * @type {number}
 */
let styleId: number = 0;

/**
 * @ignore Exclude from docs
 * @todo Description
 */
export class StyleClass extends StyleRule {

	/**
	 * Class name.
	 *
	 * @type {string}
	 */
	private _className: string;

	/**
	 * Constructor.
	 *
	 * @param {object}  styles  An object of style attribute - value pairs
	 * @param {string}  name    Class name
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
	 * @param {string}  name  Class name
	 */
	public set className(name: string) {
		this._className = name;
		this.selector = "." + name;
	}

	/**
	 * @return {string} Class name
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
