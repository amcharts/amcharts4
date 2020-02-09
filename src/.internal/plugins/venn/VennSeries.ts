/**
 * Defines Venn Diagram Series.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { IPercentSeriesAdapters, IPercentSeriesDataFields, IPercentSeriesEvents, IPercentSeriesProperties, PercentSeries, PercentSeriesDataItem } from "../../charts/series/PercentSeries";
import { Label } from "../../core/elements/Label";
import { registry } from "../../core/Registry";
import { VennDiagram } from "./VennDiagram";
import * as $path from "../../core/rendering/Path";
import * as $type from "../../core/utils/Type";
import { percent } from "../../core/utils/Percent";
import { Sprite } from "../../core/Sprite";
import { Animation } from "../../core/utils/Animation";
import { color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as venn from "venn.js";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[VennSeries]].
 *
 * @see {@link DataItem}
 */
export class VennSeriesDataItem extends PercentSeriesDataItem {

	/**
	 * A type of slice used for this series.
	 */
	public _slice: Sprite;

	/**
	 * A reference to a label element.
	 */
	public _label: Label;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: VennSeries;

	/**
	 * @ignore
	 */
	public radius: number = 0;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "VennSeriesDataItem";
		// this helps to invalidate series when value is 0 an it is hidden (no other events are triggered then)
		this.events.on("visibilitychanged", () => {
			if (this.component) {
				//this.component.invalidateDataItems();
			}
		}, this, false);

		this.applyTheme();
	}

	/**
	 * List of categories this data item represents intersection of.
	 *
	 * @param  value  Array of intersecting categories
	 */
	public set intersections(value: string[]) {
		this.setProperty("intersections", value);
	}

	/**
	 * @return Array of intersecting categories
	 */
	public get intersections(): string[] {
		return this.properties.intersections;
	}

	/**
	 * Hide the data item (and corresponding visual elements).
	 *
	 * @param duration  Duration (ms)
	 * @param delay     Delay hiding (ms)
	 * @param toValue   Target value for animation
	 * @param fields    Fields to animate while hiding
	 */
	public hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): $type.Optional<Animation> {

		if (!this.intersections) {
			this.component.dataItems.each((dataItem) => {
				if (dataItem != this && dataItem.intersections) {
					if (dataItem.intersections.indexOf(this.category) != -1) {
						dataItem.hide(duration, delay, toValue, fields);
					}
				}
			})
		}

		return super.hide(duration, delay, toValue, fields);
		if (this.component) {
			this.component.invalidateProcessedData();
		}

	}

	/**
	 * Show hidden data item (and corresponding visual elements).
	 *
	 * @param duration  Duration (ms)
	 * @param delay     Delay hiding (ms)
	 * @param fields    Fields to animate while hiding
	 */
	public show(duration?: number, delay?: number, fields?: string[]): $type.Optional<Animation> {

		if (!this.intersections) {
			this.component.dataItems.each((dataItem) => {
				if (dataItem != this && dataItem.intersections) {
					if (dataItem.intersections.indexOf(this.category) != -1) {
						dataItem.show(duration, delay, fields);
					}
				}
			})
		}

		return super.show(duration, delay, fields);

		if (this.component) {
			this.component.invalidateProcessedData();
		}
	}

	/**
	 * @ignore
	 */
	public animateRadius(toValue: number, duration: number, easing: (value: number) => number) {
		let animation = this.animate({ property: "radius", to: toValue }, duration, easing);
		this._disposers.push(animation);
		this._disposers.push(animation.events.on("animationprogress", (event) => {
			let radius = this.radius
			let path = $path.moveTo({ x: -radius, y: 0 });
			path += $path.arcToPoint({ x: radius, y: 0 }, radius, radius, true);
			path += $path.arcToPoint({ x: -radius, y: 0 }, radius, radius, true);
			this.slice.path = path;

			if (this.slice.isHover) {
				this.component.updateHoverSprite(this.slice);
			}
		}))
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[VennSeries]].
 */
export interface IVennSeriesDataFields extends IPercentSeriesDataFields {

	/**
	 * A field that may hold an array of categories. If present, this data item
	 * will represent an intersection of categories listed in an array.
	 */
	intersections?: string;

}

/**
 * Defines properties for [[VennSeries]].
 */
export interface IVennSeriesProperties extends IPercentSeriesProperties { }

/**
 * Defines events for [[VennSeries]].
 */
export interface IVennSeriesEvents extends IPercentSeriesEvents { }

/**
 * Defines adapters for [[VennSeries]].
 *
 * @see {@link Adapter}
 */
export interface IVennSeriesAdapters extends IPercentSeriesAdapters, IVennSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates Venn Diagram Series.
 * 
 * Venn series uses Ben Frederickson's [venn.js](https://github.com/benfred/venn.js).
 *
 * @see {@link IVennSeriesEvents} for a list of available Events
 * @see {@link IVennSeriesAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/venn/} for documentation
 * @important
 * @since 4.9.0
 */
export class VennSeries extends PercentSeries {

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _slice: Sprite;

	/**
	 * Defines available adapters.
	 */
	public _label: Label;

	/**
	 * A reference to chart this series is for.
	 *
	 * @ignore Exclude from docs
	 */
	public _chart: VennDiagram;

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: IVennSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IVennSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IVennSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IVennSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: VennSeriesDataItem;

	/**
	 * Holds sum of values for all slices.
	 */
	protected _total: number;

	/**
	 * Holds number of slices.
	 */
	protected _count: number;

	/**
	 * A sprite which is visible when slice is hovered.
	 * 
	 * This sprite gets the path of a hovered slice so the shape is identical. It
	 * helps create nice hover effect.
	 */
	public hoverSprite: Sprite;

	/**
	 * @ignore
	 */
	protected vennData: string;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "VennSeries";

		this.width = percent(100);
		this.height = percent(100);
		this.layout = "absolute";

		this.slicesContainer.width = percent(100);
		this.slicesContainer.height = percent(100);
		this.slicesContainer.layout = "none";

		let template = this.slices.template;
		template.strokeWidth = 0;
		template.stroke = color("#ffffff");

		this._disposers.push(this.events.on("maxsizechanged", () => {
			this.vennData = undefined;
			this.invalidateDataItems();
		}, this, false));

		this.labelsContainer.layout = "none";

		this.itemReaderText = "{category}";

		let hoverSprite = this.slicesContainer.createChild(Sprite);
		hoverSprite.strokeOpacity = 1;
		hoverSprite.strokeWidth = 2;
		hoverSprite.stroke = new InterfaceColorSet().getFor("background");
		hoverSprite.strokeDasharray = "3,3";
		hoverSprite.zIndex = Number.MAX_VALUE;
		hoverSprite.interactionsEnabled = false;
		hoverSprite.fill = color();
		hoverSprite.strokeDashoffset = 0;

		let hs = hoverSprite.states.create("hover");
		hs.properties.strokeDashoffset = 1000;
		hs.transitionDuration = 100000;

		this.hoverSprite = hoverSprite;

		template.events.on("over", (event) => {
			hoverSprite.hide(0);
			hoverSprite.show();
			hoverSprite.isHover = true;
			this.updateHoverSprite(event.target);
		})

		template.events.on("out", (event) => {
			hoverSprite.isHover = false;
		})

		template.events.on("visibilitychanged", (event) => {
			if (event.visible == false) {
				this.hoverSprite.hide();
			}
		})

		template.events.on("out", (event) => {
			this.hoverSprite.hide();
		})

		this.applyTheme();
	}

	/**
	 * Creates a Sprite element.
	 *
	 * @return Sprite
	 */
	protected createSlice(): Sprite {
		return new Sprite();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {
		super.applyInternalDefaults();
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Venn Series");
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new VennSeriesDataItem();
	}

	/**
	 * Inits Slice.
	 *
	 * @param Slice to init
	 */
	protected initSlice(slice: this["_slice"]) {
		slice.isMeasured = false;
		slice.tooltipText = "{category}";
	}

	/**
	 * Inits a Slice label.
	 * 
	 * @param Label
	 */
	protected initLabel(label: this["_label"]) {
		label.verticalCenter = "middle";
		label.horizontalCenter = "middle";
		label.isMeasured = false;
		label.text = "{category}";
	}

	/**
	 * @ignore
	 */
	public updateHoverSprite(sprite: Sprite) {
		this.hoverSprite.path = sprite.path;
		this.hoverSprite.x = sprite.x;
		this.hoverSprite.y = sprite.y;
	}

	/**
	 * [validateDataElements description]
	 *
	 * @todo Description
	 * @ignore Exclude from docs
	 */
	public validateDataElements() {
		super.validateDataElements();

		let slicesContainer = this.slicesContainer;
		let labelsContainer = this.labelsContainer;
		let labelTemplate = this.labels.template;

		if (this.alignLabels) {
			labelTemplate.interactionsEnabled = true;
			slicesContainer.isMeasured = true;
			labelsContainer.isMeasured = true;
		}
		else {
			labelTemplate.interactionsEnabled = false;
			slicesContainer.isMeasured = false;
			labelsContainer.isMeasured = false;
		}

		let sets: any[] = [];
		// prepare data for venn
		this.dataItems.each((dataItem) => {
			let set: any = {};
			if (dataItem.intersections) {
				set.sets = dataItem.intersections;
			}
			else {
				set.sets = [dataItem.category];
			}
			set.size = dataItem.getValue("value");
			let isHidden = false;
			if (dataItem.intersections) {
				for (let i = 0; i < dataItem.intersections.length; i++) {
					let category = dataItem.intersections[i];
					let di = this.getDataItemByCategory(category);

					if (di.isHiding || !di.visible) {
						isHidden = true;
					}
				}
				if (isHidden && dataItem.visible) {
					dataItem.hide(0);
				}
			}

			if (set.size > 0 && !isHidden && !dataItem.isHiding && dataItem.visible) {
				sets.push(set);
			}
		})

		let newSets = sets.toString();

		if (newSets != this.vennData) {

			this.vennData = newSets;

			if (sets.length > 0) {
				let vennData = venn.venn(sets);

				vennData = venn.normalizeSolution(vennData, null, null);

				vennData = venn.scaleSolution(vennData, this.innerWidth, this.innerHeight, 0);

				let circles: any = {};
				for (let name in vennData) {
					let item = vennData[name];

					let radius = item.radius;

					let dataItem = this.getDataItemByCategory(name);
					if (this.interpolationDuration > 0) {
						dataItem.animateRadius(radius, this.interpolationDuration, this.interpolationEasing);
					}
					else {
						let path = $path.moveTo({ x: -radius, y: 0 });
						path += $path.arcToPoint({ x: radius, y: 0 }, radius, radius, true);
						path += $path.arcToPoint({ x: -radius, y: 0 }, radius, radius, true);
						dataItem.slice.path = path;

						if (dataItem.slice.isHover) {
							this.updateHoverSprite(dataItem.slice);
						}
					}
					let slice = dataItem.slice;

					if (slice.x == undefined || slice.y == undefined) {
						slice.x = item.x;
						slice.y = item.y;
					}
					else {
						slice.animate([{ property: "x", to: item.x }, { property: "y", to: item.y }], this.interpolationDuration, this.interpolationEasing);
					}

					circles[name] = item;
				}

				let centers: any = venn.computeTextCentres(circles, sets);

				let i = 0;
				this.dataItems.each((dataItem) => {
					let name = dataItem.category;
					let center = centers[name];
					if (dataItem.intersections) {
						name = dataItem.intersections.toString();
						center = centers[name];
						if (center) {
							let set = dataItem.intersections;
							let cc = [];

							for (let s = 0; s < set.length; s++) {
								cc.push(circles[set[s]]);
							}
							let intersectionPath = venn.intersectionAreaPath(cc)

							let slice = dataItem.slice;
							slice.path = intersectionPath;

							slice.tooltipX = center.x;
							slice.tooltipY = center.y;
						}
					}

					if (center) {
						let label = dataItem.label;
						if (label.x == undefined || label.y == undefined) {
							label.x = center.x;
							label.y = center.y;
						}
						else {
							label.animate([{ property: "x", to: center.x }, { property: "y", to: center.y }], this.interpolationDuration, this.interpolationEasing);
						}
					}
					else {
						//dataItem.label.x = -10000;
					}

					this.updateLegendValue(dataItem);

					if (!this.slices.template.propertyFields.zIndex) {
						dataItem.slice.zIndex = i;
					}
					i++;
				})
			}
		}

	}

	/**
	 * Returns data item by category.
	 * 
	 * @param   category  Category
	 * @return            Data item
	 */
	public getDataItemByCategory(category: string): VennSeriesDataItem {
		let di: VennSeriesDataItem;
		this.dataItems.each((dataItem) => {
			if (dataItem.category == category) {
				di = dataItem;
			}
		})
		return di;
	}
}

/**
 * Adds class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["VennSeries"] = VennSeries;
registry.registeredClasses["VennSeriesDataItem"] = VennSeriesDataItem;
