/**
 * [[AMElement]] represents any SVG element and related functionality.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IRectangle } from "../defs/IRectangle";
import { IDisposer } from "../utils/Disposer";
import { IPoint } from "../defs/IPoint";
import * as $dom from "../utils/DOM";
import * as $object from "../utils/Object";
import * as $type from "../utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines available SVG attributes.
 */
export type SVGAttribute =
	"accent-height" | "accumulate" | "additive" | "alignment-baseline" | "allowReorder" | "alphabetic" | "amplitude" | "arabic-form" | "aria-checked" | "aria-describedby" | "aria-hidden" | "aria-label" | "aria-labelledby" | "aria-live" | "aria-controls" | "aria-orientation" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "ascent" | "attributeName" | "attributeType" | "autoReverse" | "azimuth" | "baseFrequency" | "baseline-shift" | "baseProfile" | "bbox" | "begin" | "bias" | "by" | "calcMode" | "cap-height" | "class" | "clip" | "clipPathUnits" | "clip-path" | "clip-rule" | "color" | "color-interpolation" | "color-interpolation-filters" | "color-profile" | "color-rendering" | "contentScriptType" | "contentStyleType" | "cursor" | "cx" | "cy" | "d" | "decelerate" | "descent" | "diffuseConstant" | "direction" | "display" | "divisor" | "dominant-baseline" | "dur" | "dx" | "dy" | "edgeMode" | "elevation" | "enable-background" | "end" | "exponent" | "externalResourcesRequired" | "fill" | "fill-opacity" | "fill-rule" | "filter" | "filterRes" | "filterUnits" | "flood-color" | "flood-opacity" | "focusable" | "font-family" | "font-size" | "font-size-adjust" | "font-stretch" | "font-style" | "font-variant" | "font-weight" | "format" | "from" | "fx" | "fy" | "g1" | "g2" | "glyph-name" | "glyph-orientation-horizontal" | "glyph-orientation-vertical" | "glyphRef" | "gradientTransform" | "gradientUnits" | "hanging" | "height" | "href" | "horiz-adv-x" | "horiz-origin-x" | "id" | "ideographic" | "image-rendering" | "in" | "in2" | "intercept" | "k" | "k1" | "k2" | "k3" | "k4" | "kernelMatrix" | "kernelUnitLength" | "kerning" | "keyPoints" | "keySplines" | "keyTimes" | "lang" | "lengthAdjust" | "letter-spacing" | "lighting-color" | "limitingConeAngle" | "local" | "marker-end" | "marker-mid" | "marker-start" | "markerHeight" | "markerUnits" | "markerWidth" | "mask" | "maskContentUnits" | "maskUnits" | "mathematical" | "max" | "media" | "method" | "min" | "mode" | "name" | "numOctaves" | "offset" | "onabort" | "onactivate" | "onbegin" | "onclick" | "onend" | "onerror" | "onfocusin" | "onfocusout" | "onload" | "onmousedown" | "onmousemove" | "onmouseout" | "onmouseover" | "onmouseup" | "onrepeat" | "onresize" | "onscroll" | "onunload" | "onzoom" | "opacity" | "operator" | "order" | "orient" | "orientation" | "origin" | "overflow" | "overline-position" | "overline-thickness" | "panose-1" | "paint-order" | "pathLength" | "patternContentUnits" | "patternTransform" | "patternUnits" | "pointer-events" | "points" | "pointsAtX" | "pointsAtY" | "pointsAtZ" | "preserveAlpha" | "preserveAspectRatio" | "primitiveUnits" | "r" | "radius" | "refX" | "refY" | "rendering-intent" | "repeatCount" | "repeatDur" | "requiredExtensions" | "requiredFeatures" | "restart" | "result" | "role" | "rotate" | "rx" | "ry" | "scale" | "seed" | "shape-rendering" | "slope" | "spacing" | "specularConstant" | "specularExponent" | "speed" | "spreadMethod" | "startOffset" | "stdDeviation" | "stemh" | "stemv" | "stitchTiles" | "stop-color" | "stop-opacity" | "strikethrough-position" | "strikethrough-thickness" | "string" | "stroke" | "stroke-dasharray" | "stroke-dashoffset" | "stroke-linecap" | "stroke-linejoin" | "stroke-miterlimit" | "stroke-opacity" | "stroke-width" | "style" | "surfaceScale" | "systemLanguage" | "tabindex" | "tableValues" | "target" | "targetX" | "targetY" | "text-anchor" | "text-decoration" | "text-rendering" | "textLength" | "to" | "transform" | "type" | "u1" | "u2" | "underline-position" | "underline-thickness" | "unicode" | "unicode-bidi" | "unicode-range" | "units-per-em" | "v-alphabetic" | "v-hanging" | "v-ideographic" | "v-mathematical" | "values" | "version" | "vert-adv-y" | "vert-origin-x" | "vert-origin-y" | "viewBox" | "viewTarget" | "visibility" | "width" | "widths" | "word-spacing" | "writing-mode" | "x" | "x-height" | "x1" | "x2" | "xChannelSelector" | "xlink:actuate" | "xlink:arcrole" | "xlink:href" | "xlink:role" | "xlink:show" | "xlink:title" | "xlink:type" | "xml:base" | "xml:lang" | "xml:space" | "y" | "y1" | "y2" | "yChannelSelector" | "z" | "zoomAndPan";

/**
 * Represents an interface for SVG attributes.
 *
 * This is a collection of all properties that an SVG element can have.
 */
export interface ISVGAttribute {
	"accent-height"?: any;
	"accumulate"?: any;
	"additive"?: any;
	"alignment-baseline"?: any;
	"allowReorder"?: any;
	"alphabetic"?: any;
	"amplitude"?: any;
	"arabic-form"?: any;
	"aria-checked"?: any;
	"aria-describedby"?: any;
	"aria-hidden"?: any;
	"aria-label"?: any;
	"aria-labelledby"?: any;
	"aria-live"?: any;
	"aria-controls"?: any;
	"aria-orientation"?: any;
	"aria-valuemax"?: any;
	"aria-valuemin"?: any;
	"aria-valuenow"?: any;
	"aria-valuetext"?: any;
	"ascent"?: any;
	"attributeName"?: any;
	"attributeType"?: any;
	"autoReverse"?: any;
	"azimuth"?: any;
	"baseFrequency"?: any;
	"baseline-shift"?: any;
	"baseProfile"?: any;
	"bbox"?: any;
	"begin"?: any;
	"bias"?: any;
	"by"?: any;
	"calcMode"?: any;
	"cap-height"?: any;
	"class"?: any;
	"clip"?: any;
	"clipPathUnits"?: any;
	"clip-path"?: any;
	"clip-rule"?: any;
	"color"?: any;
	"color-interpolation"?: any;
	"color-interpolation-filters"?: any;
	"color-profile"?: any;
	"color-rendering"?: any;
	"contentScriptType"?: any;
	"contentStyleType"?: any;
	"cursor"?: any;
	"cx"?: any;
	"cy"?: any;
	"d"?: any;
	"decelerate"?: any;
	"descent"?: any;
	"diffuseConstant"?: any;
	"direction"?: any;
	"display"?: any;
	"divisor"?: any;
	"dominant-baseline"?: any;
	"dur"?: any;
	"dx"?: any;
	"dy"?: any;
	"edgeMode"?: any;
	"elevation"?: any;
	"enable-background"?: any;
	"end"?: any;
	"exponent"?: any;
	"externalResourcesRequired"?: any;
	"fill"?: any;
	"fill-opacity"?: any;
	"fill-rule"?: any;
	"filter"?: any;
	"filterRes"?: any;
	"filterUnits"?: any;
	"flood-color"?: any;
	"flood-opacity"?: any;
	"focusable"?: any;
	"font-family"?: any;
	"font-size"?: any;
	"font-size-adjust"?: any;
	"font-stretch"?: any;
	"font-style"?: any;
	"font-variant"?: any;
	"font-weight"?: any;
	"format"?: any;
	"from"?: any;
	"fx"?: any;
	"fy"?: any;
	"g1"?: any;
	"g2"?: any;
	"glyph-name"?: any;
	"glyph-orientation-horizontal"?: any;
	"glyph-orientation-vertical"?: any;
	"glyphRef"?: any;
	"gradientTransform"?: any;
	"gradientUnits"?: any;
	"hanging"?: any;
	"height"?: any;
	"href"?: any;
	"horiz-adv-x"?: any;
	"horiz-origin-x"?: any;
	"id"?: any;
	"ideographic"?: any;
	"image-rendering"?: any;
	"in"?: any;
	"in2"?: any;
	"intercept"?: any;
	"k"?: any;
	"k1"?: any;
	"k2"?: any;
	"k3"?: any;
	"k4"?: any;
	"kernelMatrix"?: any;
	"kernelUnitLength"?: any;
	"kerning"?: any;
	"keyPoints"?: any;
	"keySplines"?: any;
	"keyTimes"?: any;
	"lang"?: any;
	"lengthAdjust"?: any;
	"letter-spacing"?: any;
	"lighting-color"?: any;
	"limitingConeAngle"?: any;
	"local"?: any;
	"marker-end"?: any;
	"marker-mid"?: any;
	"marker-start"?: any;
	"markerHeight"?: any;
	"markerUnits"?: any;
	"markerWidth"?: any;
	"mask"?: any;
	"maskContentUnits"?: any;
	"maskUnits"?: any;
	"mathematical"?: any;
	"max"?: any;
	"media"?: any;
	"method"?: any;
	"min"?: any;
	"mode"?: any;
	"name"?: any;
	"numOctaves"?: any;
	"offset"?: any;
	"onabort"?: any;
	"onactivate"?: any;
	"onbegin"?: any;
	"onclick"?: any;
	"onend"?: any;
	"onerror"?: any;
	"onfocusin"?: any;
	"onfocusout"?: any;
	"onload"?: any;
	"onmousedown"?: any;
	"onmousemove"?: any;
	"onmouseout"?: any;
	"onmouseover"?: any;
	"onmouseup"?: any;
	"onrepeat"?: any;
	"onresize"?: any;
	"onscroll"?: any;
	"onunload"?: any;
	"onzoom"?: any;
	"opacity"?: any;
	"operator"?: any;
	"order"?: any;
	"orient"?: any;
	"orientation"?: any;
	"origin"?: any;
	"overflow"?: any;
	"overline-position"?: any;
	"overline-thickness"?: any;
	"panose-1"?: any;
	"paint-order"?: any;
	"path"?: any;
	"pathLength"?: any;
	"patternContentUnits"?: any;
	"patternTransform"?: any;
	"patternUnits"?: any;
	"pointer-events"?: any;
	"points"?: any;
	"pointsAtX"?: any;
	"pointsAtY"?: any;
	"pointsAtZ"?: any;
	"preserveAlpha"?: any;
	"preserveAspectRatio"?: any;
	"primitiveUnits"?: any;
	"r"?: any;
	"radius"?: any;
	"refX"?: any;
	"refY"?: any;
	"rendering-intent"?: any;
	"repeatCount"?: any;
	"repeatDur"?: any;
	"requiredExtensions"?: any;
	"requiredFeatures"?: any;
	"restart"?: any;
	"result"?: any;
	"role"?: any;
	"rotate"?: any;
	"rx"?: any;
	"ry"?: any;
	"scale"?: any;
	"seed"?: any;
	"shape-rendering"?: any;
	"slope"?: any;
	"spacing"?: any;
	"specularConstant"?: any;
	"specularExponent"?: any;
	"speed"?: any;
	"spreadMethod"?: any;
	"startOffset"?: any;
	"stdDeviation"?: any;
	"stemh"?: any;
	"stemv"?: any;
	"stitchTiles"?: any;
	"stop-color"?: any;
	"stop-opacity"?: any;
	"strikethrough-position"?: any;
	"strikethrough-thickness"?: any;
	"string"?: any;
	"stroke"?: any;
	"stroke-dasharray"?: any;
	"stroke-dashoffset"?: any;
	"stroke-linecap"?: any;
	"stroke-linejoin"?: any;
	"stroke-miterlimit"?: any;
	"stroke-opacity"?: any;
	"stroke-width"?: any;
	"style"?: any;
	"surfaceScale"?: any;
	"systemLanguage"?: any;
	"tabindex"?: any;
	"tableValues"?: any;
	"target"?: any;
	"targetX"?: any;
	"targetY"?: any;
	"text-anchor"?: any;
	"text-decoration"?: any;
	"text-rendering"?: any;
	"textLength"?: any;
	"to"?: any;
	"transform"?: any;
	"type"?: any;
	"u1"?: any;
	"u2"?: any;
	"underline-position"?: any;
	"underline-thickness"?: any;
	"unicode"?: any;
	"unicode-bidi"?: any;
	"unicode-range"?: any;
	"units-per-em"?: any;
	"v-alphabetic"?: any;
	"v-hanging"?: any;
	"v-ideographic"?: any;
	"v-mathematical"?: any;
	"values"?: any;
	"version"?: any;
	"vert-adv-y"?: any;
	"vert-origin-x"?: any;
	"vert-origin-y"?: any;
	"viewBox"?: any;
	"viewTarget"?: any;
	"visibility"?: any;
	"width"?: any;
	"widths"?: any;
	"word-spacing"?: any;
	"writing-mode"?: any;
	"x"?: any;
	"x-height"?: any;
	"x1"?: any;
	"x2"?: any;
	"xChannelSelector"?: any;
	"xlink:actuate"?: any;
	"xlink:arcrole"?: any;
	"xlink:href"?: any;
	"xlink:role"?: any;
	"xlink:show"?: any;
	"xlink:title"?: any;
	"xlink:type"?: any;
	"xml:base"?: any;
	"xml:lang"?: any;
	"xml:space"?: any;
	"y"?: any;
	"y1"?: any;
	"y2"?: any;
	"yChannelSelector"?: any;
	"z"?: any;
	"zoomAndPan"?: any;
}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A base class for all SVG elements. Provides low-level DOM functionality.
 *
 * All visual elements extend this class.
 */
export class AMElement implements IDisposer {

	/**
	 * Indicates if the element was already disposed.
	 */
	protected _isDisposed: boolean = false;

	/**
	 * An SVG node of the element.
	 */
	public node: SVGSVGElement;

	/**
	 * Current X coordinate.
	 */
	private _x: number = 0;

	/**
	 * Current Y coordinate.
	 */
	private _y: number = 0;

	/**
	 * 
	 */
	private _rotationY: number = 0;	

	/**
	 * 
	 */
	private _rotationX: number = 0;		

	/**
	 * Current rotation.
	 */
	private _rotation: number = 0;

	/**
	 * Current scale.
	 */
	private _scale: number = 1;

	/**
	 * current value of transfrom string
	 */
	private _transformString:string;

	/**
	 * Constructor creates a new element or uses the one that was passed in.
	 *
	 * @param element Element reference node type
	 */
	constructor(element: string | SVGSVGElement) {
		if (typeof element === "string") {
			this.node = <SVGSVGElement>document.createElementNS($dom.SVGNS, element);
		}
		else {
			this.node = element;
		}
	}

	/**
	 * Removes element's node from DOM.
	 */
	public removeNode(): void {
		if (this.node) {
			if (this.node.parentNode) {
				this.node.parentNode.removeChild(this.node);
			}
		}
	}

	/**
	 * Returns `transform` attribute of the element.
	 *
	 * @ignore Exclude from docs
	 * @return Transform attribute value
	 */
	public get transformString(): $type.Optional<string> {
		if (this.node) {

			return this._transformString;
			/*
			const value = this.node.getAttribute("transform");

			if (value !== null) {
				return value;
			}*/
		}
	}

	/**
	 * Appply position, rotation and scale properties via elemen's `transform`
	 * property
	 *
	 * @ignore Exclude from docs
	 */
	public transform(): void {

		let transfromString = "translate(" + this._x + "," + this._y + ")";

		if (this._scale != 1) {
			transfromString += ((transfromString ? " " : "") + "scale(" + this._scale + ")");
		}

		if (this._rotation != 0) {
			let rotateString = "rotate(" + this._rotation + ")";

			if(this._rotationX && this._rotationY){
				rotateString = "rotate(" + this._rotation + " " + this._rotationX + " " + this._rotationY + ")";
			}

			transfromString += ((transfromString ? " " : "") + rotateString);
		}

		this._transformString = transfromString;

		this.node.setAttribute("transform", transfromString);
	}

	/**
	 * Returns bounding box of the element.
	 *
	 * ATTENTION: Bounding box calculations are extremely costly so should be
	 * used sparingly and cached whenever possible.
	 *
	 * @return Bounding rectangle
	 */
	public getBBox(): IRectangle {
		let bbox: IRectangle = {
			width: 0,
			height: 0,
			x: 0,
			y: 0
		};

		// FF would fail if getBBox() is called without node added to parent
		if (this.node && this.node.parentNode) {
			
			try { // again for ff. TODO: check if this doesn't slow down
				let svgbbox = this.node.getBBox();
				bbox.x = svgbbox.x;
				bbox.y = svgbbox.y;
				bbox.width = svgbbox.width;
				bbox.height = svgbbox.height;
			} catch (err) { }
		}

		return bbox;
	}

	/**
	 * Moves the element to new coordinates.
	 *
	 * @param x  Target X
	 * @param y  Target Y
	 */
	public moveTo(point: IPoint): void {
		if (point) {
			let x: number = point.x;
			let y: number = point.y;
			if (this._x != x || this._y != y) {
				this._x = x;
				this._y = y;
				this.transform();
			}
		}
	}

	/**
	 * Element's SVG contents.
	 *
	 * @param value Contents
	 */
	public set content(value: string) {
		// @todo Do not use `innerHTML` as this is not reliable and will not work on all browsers
		this.node.innerHTML = value;
	}

	/**
	 * Returns element's contents as SVG markup.
	 *
	 * @return Contents
	 */
	public get content(): string {
		// @todo Do not use `innerHTML` as this is not reliable and will not work on all browsers
		return this.node.innerHTML || "";
	}

	/**
	 * Text contents of the SVG element.
	 *
	 * @param value Text contents
	 */
	public set textContent(value: string) {
		this.node.textContent = value;
	}

	/**
	 * @return Text contents
	 */
	public get textContent(): string {
		return this.node.textContent || "";
	}

	/**
	 * Element's X position in pixels.
	 *
	 * @param value  X coordinate (px)
	 */
	public set x(value: number) {
		if (this._x != value) {
			this._x = value;
			this.transform();
		}
	}

	/**
	 * @return X coordinate (px)
	 */
	public get x(): number {
		return this._x;
	}

	/**
	 * Element's Y position in pixels.
	 *
	 * @param value Y coordinate (px)
	 */
	public set y(value: number) {
		if (this._y != value) {
			this._y = value;
			this.transform();
		}
	}

	/**
	 * @return Y coordinate (px)
	 */
	public get y(): number {
		return this._y;
	}

	/**
	 * Element's rotation in degrees.
	 *
	 * @param value Rotation
	 */
	public set rotation(angle: number) {
		if (this._rotation != angle) {
			this._rotation = angle;
			this.transform();
		}
	}

	/**
	 * @return Rotation
	 */
	public get rotation(): number {
		return this._rotation;
	}

	/**
	 * @ignore
	 */
	public set rotationX(x: number) {
		if (this._rotationX != x) {
			this._rotationX = x;
			this.transform();
		}
	}	

	/**
	 * @ignore
	 */
	public get rotationX():number{
		return this._rotationX;
	}

	/**
	 * @ignore
	 */
	public set rotationY(y: number) {
		if (this._rotationY != y) {
			this._rotationY = y;
			this.transform();
		}
	}	

	/**
	 * @ignore
	 */
	public get rotationY():number{
		return this._rotationY;
	}	

	/**
	 * Element's scale where 1 is original size.
	 *
	 * Setting to 0.5 will reduce element's size by 50%, 2 will make element
	 * twice as large, etc.
	 *
	 * @param value Scale
	 */
	public set scale(value: number) {
		if (this._scale != value) {
			this._scale = value;
			this.transform();
		}
	}

	/**
	 * @return Scale
	 */
	public get scale(): number {
		return this._scale;
	}

	/**
	 * Removes an attribute from element.
	 *
	 * @param attribute  Attribute to remove
	 */
	public removeAttr(attribute: string): void {
		this.node.removeAttribute(attribute);
	}

	/**
	 * Sets a set of attributes on a element.
	 *
	 * @param attributes  An object with attribute names (key) and values
	 * @return The same element
	 */
	public attr(attributes: ISVGAttribute): AMElement {
		$object.each(attributes, (attributeName, attributeValue) => {
			if (!$type.hasValue(attributeValue)) {
				this.node.removeAttribute(attributeName);
			}
			else {
				// this is for performance testing
				//if(attributeValue == this.node.getAttribute(attributeName)){
				//	console.log(attributeName, attributeValue)
				//}
				this.node.setAttribute(attributeName, attributeValue);
			}
		});
		return this;
	}

	/**
	 * Returns a value of a node attribute.
	 *
	 * @param attribute  Attribute name
	 * @return Attribute value
	 */
	public getAttr(attribute: string): string | null {
		return this.node.getAttribute(attribute);
	}

	/**
	 * Sets a single attribute of the element's node using namesspace.
	 *
	 * @param ns         Namespace
	 * @param attribute  Attribute
	 * @param value      Value
	 * @return The same element
	 */
	public attrNS(ns: string, attribute: string, value: string): AMElement {
		this.node.setAttributeNS(ns, attribute, value);
		return this;
	}

	/**
	 * Returns a namespaced attribute value from node.
	 *
	 * @param ns         Namespace
	 * @param attribute  Attribute
	 * @return Attribute value
	 */
	public getAttrNS(ns: string, attribute: string): string {
		return this.node.getAttributeNS(ns, attribute);
	}

	/**
	 * Removes `style` attribute from node.
	 *
	 * @param attribute  Attribute to remove
	 */
	public removeStyle(attribute: string): void {
		// @todo Review because it's a bit messy and maybe not needed (pratically not used)
		delete (<any>this.node.style)[attribute];
	}

	/**
	 * Returns style attribute value.
	 *
	 * @param attribute  Style attribute value
	 * @return Attribute value
	 */
	public getStyle(attribute: string): string {
		// @todo Review because it's a bit messy and maybe not needed (pratically not used)
		return (<any>this.node.style)[attribute];
	}

	/**
	 * Adds style attributes to element's node.
	 *
	 * @param attributes  Object containing attribute: value pairs
	 * @return The same element
	 */
	public addStyle(attributes: Object): AMElement {
		// @todo Review because it's a bit messy and maybe not needed (pratically not used)
		$object.each(attributes, (attributeName, attributeValue) => {
			if (!$type.hasValue(attributeValue)) {
				this.removeStyle(attributeName);
			}
			else {
				(<any>this.node.style)[attributeName] = attributeValue;
			}
		});
		return this;
	}

	/**
	 * Adds a class to element.
	 *
	 * @param name  Class name
	 */
	public addClass(name: string): void {
		$dom.addClass(this.node, name);
	}

	/**
	 * Removes a class from element.
	 *
	 * @param name Class name
	 */
	public removeClass(name: string): void {
		$dom.removeClass(this.node, name);
	}

	/**
	 * Sets a class name on element.
	 *
	 * @param name  Class name
	 */
	public setClass(name: string): void {
		this.node.setAttribute("class", name);
	}

	/**
	 * Removes all element's child nodes, basically leaving it empty.
	 */
	public removeChildNodes(): void {
		// remove all children
		while (this.node.childNodes.length > 0) {
			this.node.removeChild(this.node.firstChild!);
		}
	}

	/**
	 * Was this element already been disposed?
	 *
	 * @return Disposed?
	 */
	public isDisposed(): boolean {
		return this._isDisposed;
	}

	/**
	 * Disposes element.
	 */
	public dispose(): void {
		this.removeNode();
	}

}
