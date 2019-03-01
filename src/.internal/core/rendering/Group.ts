/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { AMElement } from "./AMElement";


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates an SVG `<g>` element.
 *
 * SVG groups are used for elements that need more elements just one.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g} About `<g>` element
 */
export class Group extends AMElement {

	/**
	 * Constructor.
	 *
	 * @param elementName Element type (should be "g")
	 */
	constructor(elementName: string) {
		super(elementName);
	}

	/**
	 * Adds an element to group.
	 *
	 * This will manipulate DOM. `element` will be physically moved into group.
	 *
	 * @param element  Element
	 */
	public add(element: AMElement): void {
		if (element) {
			this.node.appendChild(element.node);
		}
	}

	/**
	 * Adds an element to group.
	 *
	 * This will manipulate DOM. `element` will be physically moved into group.
	 *
	 * @param element  Element
	 */
	public addToBack(element: AMElement): void {
		if (element) {
			let first = this.node.childNodes[0];
			if (first) {
				if (first != element.node) {
					this.node.insertBefore(element.node, first);
				}
			}
			else {
				this.node.appendChild(element.node);
			}
		}
	}

	/**
	 * Removes the `element` from group.
	 *
	 * Please note that this will not dispose the element itself, it will just
	 * remove it from the group.
	 *
	 * @param element  Element
	 */
	public removeElement(element: AMElement): void {
		// todo: not sure about the speed, need to investigate, maybe it's faster to check if node is a child
		if (element) {
			try {
				if (element.node && element.node.parentNode == this.node) {
					this.node.removeChild(element.node);
				}
			}
			catch (err) {

			}
		}
	}


	/**
	 * Checks if this group already has the child element added
	 *
	 * @param element
	 * @return {boolean}
	 */
	public hasChild(element:AMElement):boolean {
		for(let i = 0; i < this.node.childNodes.length; i++){
			if(this.node.childNodes[i] == element.node){
				return true;
			}
		}
		return false;
	}

	/**
	 * Content of the group element.
	 *
	 * Can be used to add a lot of proprietary SVG markup into group.
	 *
	 * @param value  SVG markup
	 */
	public set content(value: string) {
		this.node.innerHTML = value;
	}

	/**
	 * @return SVG markup
	 */
	public get content(): string {
		return this.node.innerHTML;
	}

	/**
	 * Removes all children from the group.
	 */
	public removeChildren(): void {
		if (this.node.childNodes) {
			while (this.node.childNodes.length > 0) {
				let childNode = this.node.firstChild;
				if (childNode && childNode.parentNode) {
					childNode.parentNode.removeChild(childNode);
				}
			}
		}
	}
}
