/**
 * Container module
 * @todo Needs description
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents, AMEvent } from "./Sprite";
import { SpriteState } from "./SpriteState";
import { Animation } from "./utils/Animation";
import { List, IListEvents } from "./utils/List";
import { VerticalAlign } from "./defs/VerticalAlign";
import { IDisposer, MultiDisposer } from "./utils/Disposer";
import { Dictionary, DictionaryDisposer } from "./utils/Dictionary";
import { getInteraction } from "./interaction/Interaction";
import { Align } from "./defs/Align";
import { Group } from "./rendering/Group";
import { Rectangle } from "./elements/Rectangle";
import { IPoint } from "./defs/IPoint";
import { Percent } from "./utils/Percent";
import { registry } from "./Registry";
import { Preloader } from "./elements/Preloader";
import { DataItem } from "./DataItem";
import { Optional } from "./utils/Type";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import { Paper } from "./rendering/Paper";
import * as $iter from "./utils/Iterator";
import * as $array from "./utils/Array";
import * as $math from "./utils/Math";
import * as $type from "./utils/Type";
import { system } from "./System";
import { options } from "./Options";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines available font weights.
 */
export type FontWeight = "normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

/**
 * Defines available text decorations.
 */
export type TextDecoration = "none" | "underline" | "overline" | "line-through" | "blink";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

// Defined in DataItem.ts


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines available [[Container]] layout types
 */
export type ContainerLayout = "absolute" | "vertical" | "horizontal" | "grid" | "none";

/**
 * Defines properties for [[Container]]
 */
export interface IContainerProperties extends ISpriteProperties {

	/**
	 * Container layout.
	 *
	 * Options: "absolute" (default), "vertical", "horizontal", or "grid".
	 *
	 * @default "absolute"
	 */
	layout?: ContainerLayout;

	/**
	 * Default font weight.
	 *
	 * @default "normal"
	 */
	fontWeight?: FontWeight;

	/**
	 * Font size for the text.
	 */
	fontSize?: number;

	/**
	 * Font family for the text.
	 */
	fontFamily?: string;

	/**
	 * Default font decoration.
	 *
	 * @default "none"
	 */
	textDecoration?: TextDecoration;

	/**
	 * Horizontal alignment of Container's items.
	 */
	contentAlign?: Align;

	/**
	 * Vertical alignment of Container's items.
	 *
	 * @ignore Exclude from docs
	 */
	contentValign?: VerticalAlign;

	/**
	 * If set to `true`, all columns of the container with layout type "grid"
	 * will be equally sized.
	 *
	 * @default false
	 */
	fixedWidthGrid?: boolean;

	/**
	 * Maximum number of columns (when using `"grid"` layout).
	 */
	maxColumns?: number;

	/**
	 * If set to `true`, the children of the container will be drawn in reverse
	 * order.
	 *
	 * @default false
	 */
	reverseOrder?: boolean;

	/**
	 * Specifies if, when state is applied on this container, the same state
	 * should be applied to container's children as well as `background`.
	 *
	 * @default false
	 */
	setStateOnChildren?: boolean
}

/**
 * Defines events for the [[Container]]
 */
export interface IContainerEvents extends ISpriteEvents {

	/**
	 * Invoked when a child Sprite is added to Container.
	 */
	childadded: {
		newValue: Sprite;
	};

	/**
	 * Invoked when a child Sprite is removed from
	 */
	childremoved: {
		oldValue: Sprite;
	};

	/**
	 * invoked when layout of the container is validated
	 */
	layoutvalidated:{ }

};

/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IContainerAdapters extends ISpriteAdapters, IContainerProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Container can contain multiple sprites and arrange them in various layouts.
 *
 * @see {@link IContainerEvents} for a list of available events
 * @see {@link IContainerAdapters} for a list of available Adapters
 * @important
 */
export class Container extends Sprite {

	/**
	 * Defines available properties.
	 */
	public _properties!: IContainerProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IContainerAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IContainerEvents;

	/**
	 * Container children. (sorted by layout)
	 *
	 * @ignore Exclude from docs
	 */
	protected _childrenByLayout: Sprite[] = [];

	/**
	 * Available width (px).
	 *
	 * @ignore Exclude from docs
	 */
	protected _availableWidth: $type.Optional<number>;

	/**
	 * Available height (px).
	 *
	 * @ignore Exclude from docs
	 */
	protected _availableHeight: $type.Optional<number>;

	/**
	 * Container's child elements. (sorded by their `zIndex`)
	 *
	 * @ignore Exclude from docs
	 */
	protected _children: $type.Optional<List<Sprite>>;

	/**
	 * Container's disposers for its child elements.
	 *
	 * @ignore Exclude from docs
	 */
	protected _childrenDisposers: Dictionary<string, IDisposer> = new Dictionary();


	/**
	 * A [[Sprite]] instance to use as Container's background.
	 *
	 * @todo Make it protected
	 */
	public _background: Sprite;

	/**
	 * A reference to a [[Preloader]] element to show when Container is building
	 * itself.
	 *
	 * @ignore Exclude from docs
	 */
	protected _preloader: $type.Optional<Preloader>;

	/**
	 * Indicates if this container contains any focused elements, including
	 * itself.
	 */
	public hasFocused: boolean = false;

	/**
	 * An array of references to elements the state should be set, when it is set
	 * on this element.
	 */
	public setStateOnSprites: Sprite[] = [];

	/*
	 * @ignore
	 */
	public layoutInvalid: boolean = false;

	protected _absoluteWidth: number = 0;

	protected _absoluteHeight: number = 0;

	/**
	 * Width (in pixels) of the actual content in the Container.
	 *
	 * Please note that it might be bigger than width of the Container.
	 *
	 * @readonly
	 */
	public contentWidth: number;

	/**
	 * Height (in pixels) of the actual content in the Container.
	 *
	 * Please note that it might be bigger than height of the Container.
	 *
	 * @readonly
	 */
	public contentHeight: number;


	/**
	 * An array of child Sprites that should be ready before this object can
	 * fire a "ready" event.
	 */
	protected _shouldBeReady: Sprite[] = [];

	/**
	 * Enables touch tap protection.
	 */
	protected _tapToActivate: boolean = false;

	/**
	 * Timeout reference for `tapToActivate` functionality.
	 */
	protected _tapToActivateTimeout: Optional<IDisposer>;

	/**
	 * If `tapToActivate` is used, this setting will determine how long the chart
	 * will stay in "active" mode.
	 *
	 * @default 3000
	 * @since 4.4.0
	 */
	public tapTimeout: number = 3000;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Container";

		this._element = this.paper.addGroup("g");
		this.group.add(this.element);

		this.setPropertyValue("pixelPerfect", false);
		this.setPropertyValue("layout", "absolute");
		this.setPropertyValue("fixedWidthGrid", false);

		this.setPropertyValue("verticalCenter", "none");
		this.setPropertyValue("horizontalCenter", "none");

		this._positionPrecision = 4;

		this._disposers.push(new DictionaryDisposer(this._childrenDisposers));

		this.children.events.on("inserted", this.handleChildAdded, this);
		this.children.events.on("removed", this.handleChildRemoved, this);

		this.applyTheme();
	}

	/**
	 * Handles adding of a new child into `children`. Adding new children might
	 * affect the whole layout so it needs to be revalidated.
	 *
	 * @ignore Exclude from docs
	 * @param event Event object
	 * @todo Throw an exception on adding a disposed object. Of course it's better NOT TO add disposed objects, so that what we should focus on.
	 */
	public handleChildAdded(event: IListEvents<Sprite>["inserted"]): void {
		this.processChild(event.newValue);
	}

	/**
	 * @ignore
	 */
	public processChild(child: Sprite) {
		// try solves the problem when somedy adds child directly to children
		try {
			this._childrenDisposers.insertKey(child.uid, new MultiDisposer([
				// it's not enough to listen to POSITION_CHANGED only, as some extra redrawals will happen.
				child.events.on("transformed", this.handleChildTransform, this),
				child.events.on("zIndexChanged", this.sortAndAdd, this)
			]));
		}
		catch (err) {
			// void
		}

		if (this.element) {
			let group = <Group>this.element;
			group.add(child.group);
		}

		child.parent = this;
		child.paper = this.paper;

		this.dispatchImmediately("childadded", { type: "childadded", newValue: child });

		this.invalidate();
	}

	/**
	 * @ignore
	 */
	protected sortAndAdd() {
		this.sortChildren();
		this.addChildren();
	}

	/**
	 * Handles child removal. Changing size of the child may change the
	 * whole layout of the Container, hence layout needs to be invalidated.
	 *
	 * @ignore Exclude from docs
	 * @param event Event object
	 */
	public handleChildRemoved(event: IListEvents<Sprite>["removed"]): void {
		let child: Sprite = event.oldValue;

		// TODO figure out why the key sometimes doesn't exist
		this._childrenDisposers.removeKey(child.uid);

		if (this.element) {
			let group = <Group>this.element;
			group.removeElement(child.group);
		}

		if (child.isMeasured) {
			this.invalidateLayout();
		}

		this.dispatchImmediately("childremoved", { type: "childremoved", oldValue: child });
	}

	/**
	 * Handles child transformation. Changing size of the child may change the
	 * whole layout of the Container, hence layout needs to be invalidated.
	 *
	 * @ignore Exclude from docs
	 * @param event Event object
	 */
	public handleChildTransform(event: AMEvent<Sprite, ISpriteEvents>["transformed"] | AMEvent<Sprite, ISpriteEvents>["sizechanged"]): void {
		let child: Sprite = event.target;
		if (child.isMeasured) {// && this.layout != "none" && this.layout != "absolute") {
			this.invalidateLayout();
		}
	}

	/**
	 * Invalidates Container's layout, causing it to be re-evaluated again.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidateLayout(): void {
		if (this.layoutInvalid || this.disabled || this.isTemplate || this.layout == "none" || this.__disabled) {
			return;
		}

		this.layoutInvalid = true;
		registry.addToInvalidLayouts(this);
		system.requestFrame();
	}

	/**
	 * Invalidates element.
	 *
	 * Object will be redrawn during the next update cycle.
	 *
	 * Please note that in most cases elements will auto-invalidate when needed. If
	 * everything works, DO NOT use this method. Use it only if some changes do
	 * not take otherwise.
	 */
	public invalidate(): void {
		super.invalidate();
		this.invalidateLayout();
	}

	/**
	 * Invalidates the whole element, including layout AND all its child
	 * elements.
	 *
	 * As this will essentially force all elements to redraw, use only if
	 * absolutely necessary.
	 */
	public deepInvalidate(): void {
		super.invalidate();
		//this.sortChildren();

		$array.each(this._childrenByLayout, (child) => {
			if (child instanceof Container) {
				child.deepInvalidate();
			}
			else {
				child.invalidate();
			}
		});

		this.invalidateLayout();
	}

	/**
	 * Returns a list of the child [[Sprite]] elements contained in this
	 * Container.
	 *
	 * @return List of child elements (Sprites)
	 */
	public get children(): List<Sprite> {
		// @todo Review if we can add all children to disposers
		if (!this._children) {
			this._children = new List<Sprite>();
			//this._disposers.push(new ListDisposer(this._children));
		}
		return this._children;
	}

	/**
	 * Minimum width (px) for the Container. A container will not
	 * auto-shrink beyond this value, even if child elements are smaller.
	 *
	 * @param value  Width (px)
	 */
	public set minWidth(value: Optional<number>) {
		if (this.setPropertyValue("minWidth", value)) {
			this.invalidateLayout();
		}
	}

	/**
	 * @return Width (px)
	 */
	public get minWidth(): Optional<number> {
		return this.getPropertyValue("minWidth");
	}

	/**
	 * Minimum height (px) for the Container. A container will not
	 * auto-shrink beyond this value, even if child elements are smaller.
	 *
	 * @param value  Height (px)
	 */
	public set minHeight(value: Optional<number>) {
		if (this.setPropertyValue("minHeight", value)) {
			this.invalidateLayout();
		}
	}

	/**
	 * @return Height (px)
	 */
	public get minHeight(): Optional<number> {
		return this.getPropertyValue("minHeight");
	}

	/**
	 * Overrides the original `removeElement` so that Container's actual element
	 * is not removed. We do not need to remove element of a Container.
	 *
	 * We do this because remove element each time will fail the `getBBox`.
	 *
	 * @ignore Exclude from docs
	 */
	protected removeElement(): void {

	}

	/**
	 * Sorts Container's children: the ones with variable width and height are
	 * put at the end of the list (depending on layout type), so that fixed-width
	 * ones can be drawn first.
	 *
	 * @ignore Exclude from docs
	 */
	public sortChildren(): void {

		this._childrenByLayout = [];

		if (this.layout == "none" || this.layout == "absolute" || !this.layout) {
			//$iter.each(this.children.iterator(), (child) => {
			//	this._childrenByLayout.push(child);
			//});
			this._childrenByLayout = this.children.values;
		}
		else {
			// Assemble fixed-size and relative lists
			let fixed: Sprite[] = [];
			let relative: Sprite[] = [];

			$iter.each(this.children.iterator(), (child) => {
				if (this.layout == "horizontal" || this.layout == "grid") {
					if (!$type.isNumber(child.percentWidth)) {
						fixed.push(child);
					}
					else {
						relative.push(child);
					}
				}
				else if (this.layout == "vertical") {
					if (!$type.isNumber(child.percentHeight)) {
						fixed.push(child);
					}
					else {
						relative.push(child);
					}
				} else {
					fixed.push(child);
				}
			});

			// Concat everything into list
			this._childrenByLayout = fixed.concat(relative);
		}

		this.calculateRelativeSize();
	}

	/**
	 * Calculates relative sizes for all Container's children.
	 *
	 * @ignore Exclude from docs
	 * @todo Make it protected?
	 */
	public calculateRelativeSize(): void {
		let totalRelativeWidth: number = 0;
		let totalRelativeHeight: number = 0;

		$array.each(this._childrenByLayout, (child) => {
			// if child is not measured, we do not care about it at all.
			if (child.isMeasured) {
				if ($type.isNumber(child.percentWidth)) {
					totalRelativeWidth += child.percentWidth;
				}
				if ($type.isNumber(child.percentHeight)) {
					totalRelativeHeight += child.percentHeight;
				}
			}
		});

		$array.each(this._childrenByLayout, (child) => {
			if (child.isMeasured) {
				if (this.layout == "horizontal") {
					if ($type.isNumber(child.percentWidth)) {
						child.relativeWidth = child.percentWidth / totalRelativeWidth;
					}
					if ($type.isNumber(child.percentHeight)) {
						child.relativeHeight = child.percentHeight / 100;
					}
				}
				if (this.layout == "vertical") {
					if ($type.isNumber(child.percentHeight)) {
						child.relativeHeight = child.percentHeight / totalRelativeHeight;
					}
					if ($type.isNumber(child.percentWidth)) {
						child.relativeWidth = child.percentWidth / 100;
					}
				}

				if (this.layout == "grid") {
					if ($type.isNumber(child.percentHeight)) {
						child.relativeHeight = child.percentHeight / 100;
					}
					if ($type.isNumber(child.percentWidth)) {
						child.relativeWidth = child.percentWidth / 100;
					}
				}
			}
			if (this.layout == "absolute" || !child.isMeasured) {
				if ($type.isNumber(child.percentWidth)) {
					child.relativeWidth = child.percentWidth / 100;
				}
				if ($type.isNumber(child.percentHeight)) {
					child.relativeHeight = child.percentHeight / 100;
				}
			}
		});
	}

	/**
	 * Adds all children to Container's SVG element.
	 *
	 * @ignore Exclude from docs
	 */
	protected addChildren(): void {
		/*
		  Need this check because a child might be assigned to parent even before element is created, for example a theme
		  access scrollbar.thumb
		*/
		if (this.element) {
			let zindexed = $array.copy(this.children.values); // not children by layout!

			let sortArray = zindexed.map(function(data, idx) {
				return { idx: idx, data: data }
			});

			sortArray.sort(function(a: any, b: any) {
				const ai = (a.data.zIndex || 0);
				const bi = (b.data.zIndex || 0);
				if (ai < bi) { return -1; }
				if (ai > bi) { return 1; }
				return a.idx - b.idx
			});

			zindexed = sortArray.map(function(val) {
				return val.data;
			});

			let group = <Group>this.element;

			// check, maybe the order is good already
			let isCorrect = true;

			if (group.node && group.node.childNodes) {
				for (let i = 0, len = group.node.childNodes.length; i < len; i++) {
					if (group.node.childNodes[i] != zindexed[i].group.node) {
						isCorrect = false;
						break;
					}
				}
			}

			if (!isCorrect) {
				$array.each(zindexed, (child) => {
					if (child.group) {
						group.add(child.group);
					}
				});


				if (this._background) {
					this.group.addToBack(this._background.group);
				}

				this.invalidateLayout();
			}
		}
	}

	/**
	 * Creates a new element of specific type and assigns as a child to the
	 * Container.
	 *
	 * @param Class type for the new element
	 * @return New element
	 */
	public createChild<T extends Sprite>(classType: { new(): T; }): T {
		let sprite = new classType();
		sprite.parent = this;
		return sprite;
	}

	/**
	 * Removes all Container's children without actually destroying them.
	 *
	 * To destroy children use `disposeChildren()` instead.
	 */
	public removeChildren(): void {
		// remove all children
		// TODO use iteration instead
		while (this.children.length > 0) {
			let child = <Sprite>this.children.getIndex(0);
			child.parent = undefined;
			this.children.removeValue(child);
		}
	}

	/**
	 * Removes and destroys all Container's children.
	 *
	 * To remove children from Container without destroying them, use
	 * `removeChildren()`.
	 */
	public disposeChildren(): void {
		// TODO use iteration instead
		while (this.children.length > 0) {
			let child = <Sprite>this.children.getIndex(0);
			child.dispose();
			this.children.removeValue(child);
		}
	}

	/**
	 * An element to use as container background.
	 *
	 * @param background  Background element
	 */
	public set background(background: this["_background"]) {
		if (this._background && this.background != background) {
			this.removeDispose(this._background);
		}

		if (background) {
			this._background = background;
			this._disposers.push(background);
			this.processBackground();
		}
	}

	/**
	 * Handles the situation where parent element is resized.
	 *
	 * @ignore Exclude from docs
	 */
	public handleGlobalScale(): void {
		super.handleGlobalScale();
		this.children.each((child) => {
			child.handleGlobalScale();
		})
	}

	/**
	 * Creates and returns a [[Rectangle]] to use as a background for Container.
	 *
	 * @ignore Exclude from docs
	 * @return Background Rectangle element
	 */
	public createBackground(): this["_background"] {
		return <any>new Rectangle();
	}

	/**
	 * @return Background element
	 */
	public get background(): this["_background"] {
		if (!this._background) {
			this._background = this.createBackground();
			this.processBackground();
		}

		return this._background;
	}

	/**
	 * Decorates background element with required properties.
	 *
	 * @ignore Exclude from docs
	 */
	public processBackground(): void {
		let background = this._background;
		if (background) {
			background.isMeasured = false;
			this._background.fill = new InterfaceColorSet().getFor("background");
			background.parent = this;
			background.isMeasured = false;
			this.children.removeValue(background);
			this._disposers.push(background);
			this.group.addToBack(this._background.group);
		}
	}

	/**
	 * Measures the size of container and informs its children of how much size
	 * they can occupy, by setting their relative `maxWidth` and `maxHeight`
	 * properties.
	 *
	 * @ignore Exclude from docs
	 */
	public validateLayout(): void {

		registry.removeFromInvalidLayouts(this);

		this.layoutInvalid = false;

		// prevents from drawing if topparent is 0x0
		/*
		let topParent = this.topParent;
		if (topParent) {
			if (!topParent.maxWidth || !topParent.maxHeight) {
				this._disposers.push(topParent.events.once("maxsizechanged", this.invalidateLayout, this));
			}
		}*/

		this._availableWidth = this.innerWidth;
		this._availableHeight = this.innerHeight;

		let measuredWidth = 0;
		let measuredHeight = 0;

		let allValid = true;

		if (this.children) {

			this.sortChildren();

			// we itterate through list of children, sorted by layout priority. sprites which width non-relative width/height will go first, so we will reduce available width before proceeding to sprites with relative width/height
			$array.each(this._childrenByLayout, (child) => {
				let maxWidth: number;
				let maxHeight: number;

				if ($type.isNumber(child.relativeWidth)) {
					maxWidth = $math.round(this._availableWidth * child.relativeWidth, 2);
					if (this.layout == "horizontal") {// || this.layout == "absolute") {
						maxWidth -= child.pixelMarginRight + child.pixelMarginLeft;
					}
				}
				else {
					if (this.layout == "horizontal") {
						if (child.invalid) {
							child.validate();
						}
					}
				}

				if ($type.isNumber(child.relativeHeight)) {
					maxHeight = $math.round(this._availableHeight * child.relativeHeight, 2);
					if (this.layout == "vertical") {//  || this.layout == "absolute") {
						maxHeight -= child.pixelMarginTop + child.pixelMarginBottom;
					}
				}
				else {
					if (this.layout == "vertical") {
						if (child.invalid) {
							child.validate();
						}
					}
				}

				// if child is valid
				if (child.invalid == false) {

					if ($type.isNumber(child.relativeWidth)) {
						child.maxWidth = maxWidth;
					}

					if ($type.isNumber(child.relativeHeight)) {
						child.maxHeight = maxHeight;
					}

					if (child.isMeasured) {
						// reduce available width if this is horizontal layout
						if (this.layout == "horizontal") {
							if (!$type.isNumber(child.percentWidth)) {
								if (child.measuredWidth > 0) {
									this._availableWidth -= child.measuredWidth + child.pixelMarginLeft + child.pixelMarginRight;
								}
							}
						}

						// reduce available height if this is vertical layout
						if (this.layout == "vertical") {
							if (!$type.isNumber(child.percentHeight)) {
								if (child.measuredHeight > 0) {
									this._availableHeight -= child.measuredHeight + child.pixelMarginTop + child.pixelMarginBottom;
								}
							}
						}

						let childMeasuredWidth = child.measuredWidth;
						let childMeasuredHeight = child.measuredHeight;

						if (child.align != "none") {
							childMeasuredWidth += child.pixelMarginLeft + child.pixelMarginRight;
						}
						if (child.valign != "none") {
							childMeasuredHeight += child.pixelMarginTop + child.pixelMarginBottom;
						}

						measuredWidth = Math.max(measuredWidth, childMeasuredWidth);
						measuredHeight = Math.max(measuredHeight, childMeasuredHeight);
					}
				}
				// if child is not valid
				else {
					// tell child what maximum width/ height it can occupy
					if (child.isMeasured) {
						if ($type.isNumber(child.relativeWidth)) {
							if (child.maxWidth != maxWidth) { // need to check this because of allValid
								child.maxWidth = maxWidth;
								allValid = false;
							}
						}
						if ($type.isNumber(child.relativeHeight)) {
							if (child.maxHeight != maxHeight) { // need to check this because of allValid
								child.maxHeight = maxHeight;

								allValid = false;
							}
						}
					}
				}
			});
		}

		this._absoluteWidth = measuredWidth;
		this._absoluteHeight = measuredHeight;

		// arrange after measuring, only if all children are valid already
		if (allValid) {
			this.arrange();
		}
	}


	/**
	 * Arranges children according to layout specs and available space / child
	 * sizes.
	 *
	 * @ignore Exclude from docs
	 */
	public arrange(): void {
		let children = this.children;
		/*
		   in this method we not only arrange children but also find out the size of the container
		   it might seem it would be easier to get container size using sprite's measure method,
		   however it would return only actual size of the bbox. However as each child meight have
		   margins set, we need to check each child - we do it here.

		   This method doesn't do anything with DOM, so it's not expensive
		*/
		let measuredWidth: number = 0;
		let measuredHeight: number = 0;

		//let innerWidth: number = this.innerWidth; //$math.max(this.innerWidth, this._measuredWidth - paddingLeft - paddingRight);
		//let innerHeight: number = this.innerHeight; //$math.max(this.innerHeight, this._measuredHeight - paddingTop - paddingBottom);
		// above is wrong, as if a w/h is not specified, it is 0 and alignment doesn't work at all.
		let innerWidth: number = $math.max(this.innerWidth, this._absoluteWidth);
		let innerHeight: number = $math.max(this.innerHeight, this._absoluteHeight);

		let left: $type.Optional<number>;// = 0;
		let right: $type.Optional<number>;// = innerWidth;
		let top: $type.Optional<number>;// = 0;
		let bottom: $type.Optional<number>;// = innerHeight;

		let paddingLeft: number = this.pixelPaddingLeft;
		let paddingRight: number = this.pixelPaddingRight;
		let paddingTop: number = this.pixelPaddingTop;
		let paddingBottom: number = this.pixelPaddingBottom;

		let nextX: number = 0;
		let nextY: number = 0;
		let row: number = 0;
		let column: number = 0;

		let columnWidth: number[] = [];
		let rowHeight: number[] = [];

		let maxCellWidth: $type.Optional<number>;
		let minCellWidth: $type.Optional<number>;
		let columnCount: $type.Optional<number>;

		let maxWidth = this.maxWidth;
		let maxHeight = this.maxHeight;
		let minWidth = this.minWidth;
		let minHeight = this.minHeight;

		let childrenCopy = $array.copy(children.values);
		if (this.reverseOrder) {
			childrenCopy.reverse();
		}

		// GRID PRECALCULATIONS
		if (this.layout == "grid") {

			minCellWidth = maxWidth;
			maxCellWidth = 1;

			for (let i = 0, len = childrenCopy.length; i < len; i++) {
				let child = childrenCopy[i];
				if (child.isMeasured && !child.disabled && !child.__disabled) {
					let childMeasuredWidth = child.measuredWidth;
					if (childMeasuredWidth < minCellWidth) {
						minCellWidth = childMeasuredWidth;
					}
					if (childMeasuredWidth > maxCellWidth) {
						maxCellWidth = childMeasuredWidth;
					}
				}
			}

			minCellWidth = $math.fitToRange(minCellWidth, 1, maxWidth);
			maxCellWidth = $math.fitToRange(maxCellWidth, 1, maxWidth);


			if (this.fixedWidthGrid) {
				columnCount = maxWidth / maxCellWidth;
			}
			else {
				columnCount = maxWidth / minCellWidth; // predicted number of columns, yes it is usually much more than real number, but we fix that later
			}

			columnCount = $math.max(1, Math.floor(columnCount));
			columnCount = $math.min(this.maxColumns, columnCount);
			columnWidth = this.getColumnWidth(childrenCopy, columnCount, maxCellWidth);
		}

		let contentLeft: $type.Optional<number>;
		let contentRight: $type.Optional<number>;
		let contentTop: $type.Optional<number>;
		let contentBottom: $type.Optional<number>;

		// we itterate through array of children
		// TODO use iterator instead



		for (let i = 0, len = childrenCopy.length; i < len; i++) {
			let child = childrenCopy[i];

			if (child.isMeasured && !child.disabled && !child.__disabled) {

				let x: $type.Optional<number> = undefined;//child.pixelX; // must reset
				let y: $type.Optional<number> = undefined;//child.pixelY; // must reset

				let childMarginLeft: number = child.pixelMarginLeft;
				let childMarginRight: number = child.pixelMarginRight;
				let childMarginTop: number = child.pixelMarginTop;
				let childMarginBottom: number = child.pixelMarginBottom;

				let childWidth: number = child.measuredWidth;
				let childHeight: number = child.measuredHeight;

				let childLeft: $type.Optional<number>;
				let childRight: $type.Optional<number>;
				let childTop: $type.Optional<number>;
				let childBottom: $type.Optional<number>;

				switch (this.layout) {
					case "none":
						break;
					// absolute layout
					case "absolute":
						// horizontal alignment
						switch (child.align) {
							case "left":
								x = childMarginLeft - child.maxLeft;
								break;
							case "center":
								x = (innerWidth - childWidth) / 2 - child.maxLeft;
								break;
							case "right":
								x = innerWidth - childMarginRight - child.maxRight;
								break;
							default:
								if (!(child.x instanceof Percent)) {
									x = child.pixelX;
								}
								break;
						}

						// vertical alignment
						switch (child.valign) {
							case "top":
								y = childMarginTop - child.maxTop;
								break;
							case "middle":
								y = (innerHeight - childHeight) / 2 - child.maxTop;
								break;
							case "bottom":
								y = innerHeight - childMarginBottom - child.maxBottom;
								break;
							default:
								if (!(child.y instanceof Percent)) {
									y = child.pixelY;
								}
								break;
						}

						break;
					// vertical layout
					case "vertical":
						//if ($type.isNumber(child.relativeHeight)) {
						//	childHeight = child.maxHeight;
						//}

						switch (child.align) {
							case "left":
								x = childMarginLeft - child.maxLeft;
								break;
							case "center":
								x = (innerWidth - childWidth) / 2 - child.maxLeft;
								break;
							case "right":
								x = innerWidth - childMarginRight - child.maxRight;
								break;
							default:
								x = child.pixelX;
								break;
						}

						y = nextY + childMarginTop - child.maxTop;
						nextY = y + child.maxBottom + childMarginBottom;
						break;

					// horizontal layout
					case "horizontal":

						//if ($type.isNumber(child.relativeHeight)) {
						//	childHeight = child.maxHeight;
						//}

						switch (child.valign) {
							case "top":
								y = childMarginTop - child.maxTop;
								break;
							case "middle":
								y = (innerHeight - childHeight) / 2 - child.maxTop;
								break;
							case "bottom":
								y = innerHeight - childMarginBottom - child.maxBottom;
								break;
							default:
								y = child.pixelY;
								break;
						}

						x = nextX + childMarginLeft - child.maxLeft;
						nextX = x + child.maxRight + childMarginRight;

						break;

					case "grid":
						x = nextX + childMarginLeft - child.maxLeft;
						switch (child.valign) {
							case "top":
								y = nextY + childMarginTop - child.maxTop;
								break;
							case "middle":
								y = nextY + (innerHeight - childHeight) / 2 - child.maxTop;
								break;
							case "bottom":
								y = nextY + innerHeight - childMarginBottom - child.maxBottom;
								break;
							default:
								y = nextY - child.maxTop;
								break;
						}

						nextX += columnWidth[column];

						rowHeight[row] = $math.max(rowHeight[row], childHeight);
						column++;

						let nextColumnWidth = columnWidth[column];

						if (!$type.isNumber(nextColumnWidth)) {
							nextColumnWidth = maxCellWidth;
						}

						if (nextX > $math.min(this.innerWidth, maxWidth) - nextColumnWidth + 1 && column < columnCount) {
							columnCount = column;

							nextX = 0;
							nextY = 0;

							row = 0;
							column = 0;

							columnWidth = this.getColumnWidth(childrenCopy, columnCount, maxCellWidth);
							rowHeight = [];

							i = -1;
							continue;
						}

						if (column >= columnCount) {
							column = 0;
							nextY += rowHeight[row];
							row++;
							nextX = 0;
						}
						break;
				}

				if (this.layout !== "none") {
					child.moveTo({ x: x, y: y }); // must use moveTo, otherwise x/y set in percent won't work

					childLeft = x + child.maxLeft - childMarginLeft;
					childRight = x + child.maxRight + childMarginRight;
					childTop = y + child.maxTop - childMarginTop;
					childBottom = y + child.maxBottom + childMarginBottom;

					if (childRight > right || !$type.isNumber(right)) {
						right = childRight;
					}

					if (childLeft < left || !$type.isNumber(left)) {
						left = childLeft;
					}

					if (childTop < top || !$type.isNumber(top)) {
						top = childTop;
					}

					if (childBottom > bottom || !$type.isNumber(bottom)) {
						bottom = childBottom;
					}

					if (childRight > contentRight || !$type.isNumber(contentRight)) {
						contentRight = childRight;
					}

					if (childLeft < contentLeft || !$type.isNumber(contentLeft)) {
						contentLeft = childLeft;
					}

					if (childTop < contentTop || !$type.isNumber(contentTop)) {
						contentTop = childTop;
					}

					if (childBottom > contentBottom || !$type.isNumber(contentBottom)) {
						contentBottom = contentBottom;
					}
				}
			}
			else {
				child.validatePosition();
			}
		}

		if (this.layout == "none") {
			let noneBBox = this.bbox;
			left = noneBBox.x;
			right = noneBBox.x + noneBBox.width;
			top = noneBBox.y;
			bottom = noneBBox.y + noneBBox.height;
		}

		if (!$type.isNumber(left)) {
			left = 0;
			contentLeft = 0;
		}

		if (!$type.isNumber(right)) {
			right = this._availableWidth;
			contentRight = right;
		}

		if (!$type.isNumber(top)) {
			top = 0;
			contentTop = 0;
		}

		if (!$type.isNumber(bottom)) {
			bottom = this._availableHeight;
			contentBottom = bottom;
		}

		if (!$type.isNumber(contentTop)) {
			contentTop = 0;
		}

		if (!$type.isNumber(contentBottom)) {
			contentBottom = contentTop;
		}

		if (!$type.isNumber(contentLeft)) {
			contentLeft = 0;
		}

		if (!$type.isNumber(contentRight)) {
			contentRight = contentLeft;
		}

		measuredWidth = right - left;
		measuredHeight = bottom - top;

		if ($type.isNumber(this.relativeWidth)) {
			measuredWidth = maxWidth - paddingLeft - paddingRight;
			left = 0;
			right = measuredWidth;
		}

		if ($type.isNumber(this.relativeHeight)) {
			measuredHeight = maxHeight - paddingTop - paddingBottom;
			top = 0;
			bottom = measuredHeight;
		}

		if ($type.isNumber(this._pixelWidth)) {
			left = 0;
			measuredWidth = this._pixelWidth - paddingLeft - paddingRight;
		}

		if ($type.isNumber(minWidth) && measuredWidth < minWidth) {
			left = 0;
			measuredWidth = this.minWidth - paddingLeft - paddingRight;
		}

		if ($type.isNumber(this._pixelHeight)) {
			top = 0;
			measuredHeight = this._pixelHeight - paddingTop - paddingBottom;
		}

		if ($type.isNumber(minHeight) && measuredHeight < minHeight) {
			top = 0;
			measuredHeight = minHeight - paddingTop - paddingBottom;
		}

		let measuredContentWidth = contentRight - contentLeft;
		let measuredContentHeight = contentBottom - contentTop;

		/// handle content alignment
		if (this.layout != "none" && (this.contentAlign || this.contentValign) && children.length > 0) {
			let dx: $type.Optional<number>;
			let dy: $type.Optional<number>;

			let mwa = measuredWidth;
			let mha = measuredHeight;
			if (mwa < measuredContentWidth) {
				mwa = measuredContentWidth;
			}

			if (mha < measuredContentHeight) {
				mha = measuredContentHeight;
			}

			if (this.contentAlign == "center") {
				dx = (mwa - measuredContentWidth) / 2;
			}
			if (this.contentAlign == "right") {
				dx = mwa - measuredContentWidth;
			}
			if (this.contentValign == "middle") {
				dy = (mha - measuredContentHeight) / 2;
			}
			if (this.contentValign == "bottom") {
				dy = mha - measuredContentHeight;
			}

			if ($type.isNumber(dx)) {
				$iter.each(children.iterator(), (child) => {
					let childLeft: number = child.maxLeft;

					let ddx: number = dx;

					if (this.layout == "horizontal") {
						child.x = child.pixelX + ddx;
					}
					// individual grid elements can not be aligned vertically, that's why it's different from horizontal
					if (this.layout == "grid") {
						child.x = child.pixelX + ddx;
					}
					if (this.layout == "vertical") {
						ddx += child.pixelMarginLeft;
						if (child.align == "none") {
							child.x = ddx - childLeft;
						}
					}

					if (this.layout == "absolute") {
						ddx += child.pixelMarginLeft;
						if (child.align == "none") {
							child.x = ddx - childLeft;
						}
					}
				});
			}

			if ($type.isNumber(dy)) {
				$iter.each(children.iterator(), (child) => {
					let childTop: number = child.maxTop;

					let ddy: number = dy;

					if (this.layout == "horizontal") {
						ddy += child.pixelMarginTop;
						if (child.valign == "none") {
							child.y = ddy - childTop;
						}
					}
					// individual grid elements can not be aligned vertically, that's why it's different from horizontal
					if (this.layout == "grid") {
						ddy += child.pixelMarginTop;
						child.y = ddy - childTop;
					}
					if (this.layout == "vertical") {
						child.y = child.pixelY + ddy;
					}

					if (this.layout == "absolute") {
						ddy += child.pixelMarginTop;

						if (child.valign == "none") {
							child.y = ddy - childTop;
						}
					}
				});
			}
		}

		let oldBBox = this.bbox;


		// this will mess up maxw/maxh set by container layout, we need a separate min/maxwidth for users
		// this prevents invalidating layout in such cases as scrolling category axis, when labels go outside bounds and results transformed event
		// todo: need to check if this doesn't cause other problems.
		//if (this.maxWidth > 0) {
		//measuredWidth = $math.min(measuredWidth, this.maxWidth);
		//measuredWidth = $math.max(measuredWidth, this.minWidth);
		//}

		//if (this.maxHeight > 0) {
		//measuredHeight = $math.min(measuredHeight, this.maxHeight);
		//measuredHeight = $math.max(measuredHeight, this.minHeight);
		//}

		measuredWidth = $math.max(measuredWidth, minWidth);
		measuredHeight = $math.max(measuredHeight, minHeight);

		this.contentWidth = measuredWidth;
		this.contentHeight = measuredHeight;
		// new
		measuredWidth = $math.min(measuredWidth, maxWidth);
		measuredHeight = $math.min(measuredHeight, maxHeight);

		this._bbox = { x: left, y: top, width: measuredWidth, height: measuredHeight };

		let prevLeft = this.maxLeft;
		let prevTop = this.maxTop;
		let prevBotttom = this.maxBottom;
		let prevRight = this.maxRight;

		this.measure();

		if (prevLeft != this.maxLeft || prevRight != this.maxRight || prevTop != this.maxTop || prevBotttom != this.maxBottom) {
			if (this.events.isEnabled("transformed")) {
				let event: AMEvent<this, IContainerEvents>["transformed"] = {
					type: "transformed",
					target: this
				};
				if (oldBBox) {
					event.dummyData = oldBBox.width + " " + measuredWidth + "  " + oldBBox.height + " " + measuredHeight;
				}

				this.events.dispatchImmediately("transformed", event);
			}
		}

		this.dispatchImmediately("layoutvalidated");
	}

	/**
	 * Positions element according its center settings.
	 *
	 * @todo Description (review)
	 * @ignore Exclude from docs
	 */
	public updateCenter() {
		super.updateCenter();
		this.updateBackground();
	}

	/**
	 * Update the background to fit into specific dimensions.
	 *
	 * @ignore Exclude from docs
	 * @todo Make it protected?
	 */
	public updateBackground(): void {
		let background: Sprite = this._background; // accessing protected, as getter creates instance if it doesn't exist

		if (background) {
			background.x = this.maxLeft;
			background.y = this.maxTop;
			background.width = this.maxRight - this.maxLeft;
			background.height = this.maxBottom - this.maxTop;
		}
	}

	/**
	 * Returns widths of all columns in a horizontal Container layout.
	 *
	 * @ignore Exclude from docs
	 * @param columnCount   Number of columns
	 * @param maxCellWidth  Maximum width of one grid cell
	 * @return An array of column widths
	 */
	public getColumnWidth(children: Sprite[], columnCount: number, maxCellWidth: number): number[] {
		let columnWidth: number[] = [];
		let column: number = 0;

		$array.each(children, (child) => {
			if (child.isMeasured && !child.disabled && !child.__disabled) {
				if (this.fixedWidthGrid) {
					columnWidth[column] = maxCellWidth;
				}
				else {
					columnWidth[column] = $math.max(columnWidth[column], child.measuredWidth + child.pixelMarginRight + child.pixelMarginLeft);
				}

				column++;

				if (column == columnCount) {
					column = 0;
				}
			}
		});

		return columnWidth;
	}

	/**
	 * Container layout.
	 *
	 * Options: "absolute" (default), "vertical", "horizontal", "grid", "none". "none" is quite the same as "absolute" - the objects will
	 * be positioned at their x, y coordinates, the difference is that with "absolute" you can still use align/valign for children and with "none" you can not.
	 * Use "none" as much as you can as it's most cpu-saving layout.
	 *
	 * @default "absolute"
	 * @param value Layout
	 */
	public set layout(value: ContainerLayout) {
		if (this.setPropertyValue("layout", value)) {
			this.invalidateLayout();
		}
	}

	/**
	 * @return Layout
	 */
	public get layout(): ContainerLayout {
		return this.getPropertyValue("layout");
	}

	/**
	 * Vertical alignment of the elements for the vertical Container.
	 *
	 * This is used when Container is larger than the height of all its children.
	 *
	 * @param value vertical alignment
	 */
	public set contentValign(value: VerticalAlign) {
		this.setPropertyValue("contentValign", value, true);
	}

	/**
	 * @return Vertical alignment
	 */
	public get contentValign(): VerticalAlign {
		return this.getPropertyValue("contentValign");
	}

	/**
	 * Horizontal alignment of the elements for the horizontal Container.
	 *
	 * This is used when Container is larger than the height of all its children.
	 *
	 * @param value  Horizontal alignment
	 */
	public set contentAlign(value: Align) {
		this.setPropertyValue("contentAlign", value, true);
	}

	/**
	 * @return Horizontal alignment
	 */
	public get contentAlign(): Align {
		return this.getPropertyValue("contentAlign");
	}

	/**
	 * Controls if the grid of the Container should use fixed width. Fixed width
	 * grid will divide available space to all its columns/rows equally, without
	 * adapting to actual child sizes or size requirements.
	 *
	 * @default false
	 * @param value  Should use fixed width grid?
	 */
	public set fixedWidthGrid(value: boolean) {
		this.setPropertyValue("fixedWidthGrid", value, true);
	}

	/**
	 * @return Should use fixed width grid?
	 */
	public get fixedWidthGrid(): boolean {
		return this.getPropertyValue("fixedWidthGrid");
	}

	/**
	 * Maximum number of columns (when using `"grid"` layout).
	 *
	 * @param value  Should use fixed width grid?
	 */
	public set maxColumns(value: Optional<number>) {
		this.setPropertyValue("maxColumns", value, true);
	}

	/**
	 * @return Should use fixed width grid?
	 */
	public get maxColumns(): Optional<number> {
		return this.getPropertyValue("maxColumns");
	}

	/**
	 * If set to `true`, the children of the container will be drawn in reverse
	 * order.
	 *
	 * @default false
	 * @param value  Reverse children?
	 */
	public set reverseOrder(value: Optional<boolean>) {
		this.setPropertyValue("reverseOrder", value, true);
	}

	/**
	 * @return Reverse children?
	 */
	public get reverseOrder(): Optional<boolean> {
		return this.getPropertyValue("reverseOrder");
	}

	/**
	 * Specifies if, when state is applied on this container, the same state
	 * should be applied to container's children as well as `background`.
	 *
	 * @default false
	 * @param value  Set state on children
	 */
	public set setStateOnChildren(value: boolean) {
		this.setPropertyValue("setStateOnChildren", value, true);
	}

	/**
	 * @return Set state on children
	 */
	public get setStateOnChildren(): boolean {
		return this.getPropertyValue("setStateOnChildren");
	}

	/**
	 * Checks if point is within bounds of a container.
	 *
	 * @param point  A coordinate to check
	 * @return `true` if it fits within container
	 */
	public fitsToBounds(point: IPoint): boolean {
		let x = point.x;
		let y = point.y;
		let deviation = 0.5; // sometimes coordinates are rounded to numbers like .999 so we add deviation here
		if (x >= -deviation && x <= this.pixelWidth + deviation && y >= -deviation && y <= this.pixelHeight + deviation) {
			return true;
		}
		else {
			return false;
		}
	}

	/**
	 * Copies all properties from different Container, including background
	 * clone.
	 *
	 * @param source  Source Container to copy from
	 */
	public copyFrom(source: this) {
		super.copyFrom(source);
		this.layout = source.layout;
		this.setStateOnChildren = source.setStateOnChildren;

		if (source._background) {
			this.background = source._background.clone();
			this.background.copyFrom(source._background); // won't work without this
		}

		$iter.each(source.children.iterator(), (child) => {
			if (child.shouldClone) {
				let clonedChild: Sprite = child.clone();
				clonedChild.parent = this;
			}
		});
	}

	/**
	 * A [[Preloader]] instance to be used when Container is busy.
	 *
	 * @param preloader  Preloader instance
	 */
	public set preloader(preloader: $type.Optional<Preloader>) {
		if (this._preloader) {
			this.removeDispose(this._preloader);
		}
		this._preloader = preloader;
		if (preloader) {
			preloader.parent = this.tooltipContainer;
			this._disposers.push(preloader);
		}
	}

	/**
	 * @return Preloader instance
	 */
	public get preloader(): $type.Optional<Preloader> {
		const preloader = this._preloader;

		if (preloader) {
			return preloader;
		}
		else if (this.parent) {
			return this.parent.preloader;
		}
	}

	/**
	 * Sets [[Paper]] instance to use to draw elements.
	 * @ignore
	 * @param paper Paper
	 * @return true if paper was changed, false, if it's the same
	 */
	public setPaper(paper: Paper): boolean {
		let changed = super.setPaper(paper);

		if (changed) {
			if (this._background) {
				this._background.paper = paper;
				this._background.topParent = this.topParent;
			}
			this.children.each((child) => {
				child.setPaper(paper);
				child.topParent = this.topParent;
			})
		}
		return changed;
	}

	/**
	 * Removes Container from the system-wide list of invalid Containers.
	 *
	 * @ignore Exclude from docs
	 */
	protected removeFromInvalids() {
		super.removeFromInvalids();
		registry.removeFromInvalidLayouts(this);
	}

	/**
	 * Sets a [[DataItem]] to be used as data for the Container.
	 *
	 * @todo Description
	 * @param dataItem DataItem
	 */
	protected setDataItem(dataItem: DataItem) {
		// this place is potentially dangerous, as if we set datItem for some dummy container, all children dataItems will be overriden
		// the main reason for doing this is that we need a setDataItem code to be called for each sprite, otherwise property fields won't be
		// applied. Also, getting dataItem from parent all the time is more expensive than saving value.
		if (this._dataItem != dataItem) {
			$iter.each(this.children.iterator(), (child) => {
				child.dataItem = dataItem;
			});

			if (this._background) {
				this._background.dataItem = dataItem;
			}
		}

		super.setDataItem(dataItem);
	}

	/**
	 * Measures the element.
	 *
	 * @ignore Exclude from docs
	 */
	public measureElement(): void {
		if (this.disabled || this.isTemplate || this.layout == "none" || this.__disabled) {
			// void
		}
		else {
			this.validateLayout();
		}

	}

	/**
	 * Font family to be used for the text.
	 *
	 * Parts of the text may override this setting using in-line formatting.
	 *
	 * @param value Font family value
	 */
	public set fontFamily(value: string) {
		if (this.setPropertyValue("fontFamily", value, true)) {
			this.setSVGAttribute({ "font-family": value });
			this.invalidateLabels();
		}
	}

	/**
	 * @return Font family
	 */
	public get fontFamily(): string {
		return this.getPropertyValue("fontFamily");
	}

	/**
	 * Font size to be used for the text. The size can either be numeric, in
	 * pixels, or other measurements.
	 *
	 * Parts of the text may override this setting using in-line formatting.
	 *
	 * @param value Font size value
	 */
	public set fontSize(value: any) {
		if (this.setPropertyValue("fontSize", value, true)) {
			this.setSVGAttribute({ "font-size": value });
			this.invalidateLabels();
		}
	}

	/**
	 * @return Font size
	 */
	public get fontSize(): any {
		return this.getPropertyValue("fontSize");
	}

	/**
	 * When fontSize of fontFamily changes we need to hard-invalidate all Labels of this container to position them properly.
	 */
	public invalidateLabels() {
		this.children.each((child) => {
			// can't import Label because of Circular dependencies
			if ((<any>child)["hardInvalidate"]) {
				(<any>child)["hardInvalidate"]();
			}
			else if (child instanceof Container) {
				child.invalidateLabels();
			}
		})
	}

	/**
	 * Font weight to use for text.
	 *
	 * Parts of the text may override this setting using in-line formatting.
	 *
	 * @param value Font weight
	 */
	public set fontWeight(value: FontWeight) {
		this.setPropertyValue("fontWeight", value);
		this.setSVGAttribute({ "font-weight": value });
	}

	/**
	 * @return Font weight
	 */
	public get fontWeight(): FontWeight {
		return this.getPropertyValue("fontWeight");
	}

	/**
	 * A text decoration to use for text.
	 *
	 * Parts of the text may override this setting using in-line formatting.
	 *
	 * @param value  Decoration
	 */
	public set textDecoration(value: TextDecoration) {
		this.setPropertyValue("textDecoration", value);
		this.setSVGAttribute({ "text-decoration": value });
	}

	/**
	 * @return Decoration
	 */
	public get textDecoration(): TextDecoration {
		return this.getPropertyValue("textDecoration");
	}

	/**
	 * Disposes (destroys) the element and all its children.
	 */
	public dispose(): void {
		if (this._background) {
			this._background.dispose();
		}
		this._shouldBeReady = [];
		this.disposeChildren();
		super.dispose();
	}

	/**
	 * Applies a [[SpriteState]] on this element.
	 *
	 * The first parameter can either be a name of the state or a [[SpriteState]]
	 * instance.
	 *
	 * When run, this method will apply SVG properties defined in a
	 * [[SpriteState]], but only those that are relevant to this particular
	 * element, that is are listed in its respective `properties` array.
	 *
	 * @see {@link SpriteState}
	 * @param value               A state - name key or instance
	 * @param transitionDuration  Duration of the transition between current and new state
	 * @param easing              An easing function
	 */
	public setState(value: string | SpriteState<this["_properties"], this["_adapter"]>, transitionDuration?: number, easing?: (value: number) => number): $type.Optional<Animation> {

		let stateName = value;
		if (value instanceof SpriteState) {
			stateName = value.name;
		}

		if (this.setStateOnChildren) {
			$iter.each(this.children.iterator(), (child) => {
				child.setState(stateName, transitionDuration, easing);

				// not good to set it in child setState
				if (stateName != "active") {
					child.isActive = false;
				}
			})
		}
		if (this._background) {
			this._background.setState(stateName);
		}

		if (this.setStateOnSprites.length) {
			$array.each(this.setStateOnSprites, (item) => {
				item.setState(stateName, transitionDuration, easing);
			});
		}

		return super.setState(value, transitionDuration, easing);
	}

	// otherwise isActive won't work properly with background
	protected setActive(value: boolean) {
		super.setActive(value);
		if (this._background) {
			this._background.isActive = value;
		}
	}


	/**
	 * Dispatches ready event. Dispatches when all children are ready.
	 */
	public dispatchReady() {
		if (!this.isReady() && !this.isDisposed()) {
			let allReady = true;

			$iter.eachContinue(this.children.iterator(), (sprite) => {
				if (!sprite.__disabled && !sprite.disabled && !sprite.isReady()) {
					allReady = false;
					return false;
				}
				else {
					return true;					
				}
			});

			$array.eachContinue(this._shouldBeReady, (sprite) => {
				if (!sprite.__disabled && !sprite.disabled && !sprite.isReady()) {
					allReady = false;
					return false;
				}
				else {
					return true;
				}
			})

			if (allReady) {
				super.dispatchReady();
			}
			else {
				registry.events.once("exitframe", () => {
					this.dispatchReady();
					system.requestFrame();
				}, undefined, false);
			}
		}
	}


	/**
	 * Called during the System.update method
	 *
	 * @ignore Exclude from docs
	 */
	public _systemUpdate(skippedSprites: Array<Sprite>): void {
		this.children.each((child) => {
			if (child.invalid) {
				if (!child._systemCheckIfValidate()) {
					skippedSprites.push(child);
				}
				else if (child.dataItem && child.dataItem.component && child.dataItem.component.dataInvalid) {
					skippedSprites.push(child);
				}
				else {
					child.validate();
				}
			}
		});

		super._systemUpdate(skippedSprites);
	}

	/**
	 * Called during the System.validatePositions method
	 *
	 * @ignore Exclude from docs
	 */
	public _systemValidatePositions() {
		this.children.each((sprite) => {
			if (sprite.positionInvalid) {
				sprite.validatePosition();
			}
		});

		super._systemValidatePositions();
	}

	/**
	 * Called during the System.validateLayouts method
	 *
	 * @ignore Exclude from docs
	 */
	public _systemValidateLayouts() {
		if (this.layoutInvalid && !this.isDisposed()) {
			this.validateLayout();
		}
	}

	/**
	 * If set to `true` the chart's regular touch functionality will be suspended
	 * so that the whole page it is located in remains scrollable, even when
	 * swiping over the chart's body.
	 *
	 * User will need to tap the chart in order to activate its regular touch
	 * functionality.
	 *
	 * The chart will remain "active" as long as user keeps interacting with the
	 * chart. After `tapTimeout` milliseconds the chart will return to its
	 * "protected" mode.
	 *
	 * @default false
	 * @since 4.4.0
	 * @param  value  Enable touch protection?
	 * @see {@link https://www.amcharts.com/docs/v4/concepts/touch/} For more information.
	 */
	public set tapToActivate(value: boolean) {
		if (this._tapToActivate != value) {
			this.setTapToActivate(value);
		}
	}

	/**
	 * @return Enable touch protection?
	 */
	public get tapToActivate(): boolean {
		return this._tapToActivate;
	}

	protected setTapToActivate(value: boolean): void {
		this._tapToActivate = value;
		this.interactions.isTouchProtected = value;
		// setEventDisposer will also remove listeners if value == false
		if (value) {
			this.interactions.setEventDisposer("container-tapToActivate", value, () => new MultiDisposer([
				this.events.on("hit", this.handleTapToActivate, this, false),
				this.events.on("down", this.initTapTimeout, this, false),
				this.events.on("track", this.initTapTimeout, this, false),
				//this.events.on("drag", this.initTapTimeout, this, false),
				getInteraction().body.events.on("down", (ev) => {
					if (!getInteraction().isLocalElement(ev.pointer, this.paper.svg, this.uid)) {
						this.handleTapToActivateDeactivation();
					}
				}, this, false)
			]));
		}

		getInteraction()
	}

	/**
	 * @todo Ignore on non-touch events
	 */
	protected handleTapToActivate(): void {
		this.interactions.isTouchProtected = false;
		this.initTapTimeout();
	}

	protected handleTapToActivateDeactivation(): void {
		this.interactions.isTouchProtected = true;
	}

	protected initTapTimeout(): void {
		if (this._tapToActivateTimeout) {
			this._tapToActivateTimeout.dispose();
		}
		if (this.tapToActivate && !this.interactions.isTouchProtected && this.tapTimeout) {
			this._tapToActivateTimeout = this.setTimeout(() => {
				this.handleTapToActivateDeactivation()
			}, this.tapTimeout);
		}
	}

	/**
	 * @ignore
	 * @return Has license?
	 */
	public hasLicense(): boolean {
		if (options.commercialLicense) {
			return true;
		}
		for (let i = 0; i < options.licenses.length; i++) {
			if (options.licenses[i].match(/^CH.{5,}/i)) {
				return true;
			}
		}
		return false;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Container"] = Container;
