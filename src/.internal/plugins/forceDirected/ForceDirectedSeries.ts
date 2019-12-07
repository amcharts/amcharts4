/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */

import { Series, SeriesDataItem, ISeriesDataFields, ISeriesProperties, ISeriesAdapters, ISeriesEvents } from "../../charts/series/Series";
import { ForceDirectedTree, ForceDirectedTreeDataItem } from "./ForceDirectedTree";
import { registry } from "../../core/Registry";
import { ListTemplate, ListDisposer, List } from "../../core/utils/List";
import { ForceDirectedNode } from "./ForceDirectedNode";
import { Disposer } from "../../core/utils/Disposer";
import { ForceDirectedLink } from "./ForceDirectedLink";
import { ColorSet } from "../../core/utils/ColorSet";
import * as d3force from "d3-force";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import * as $utils from "../../core/utils/Utils";
import * as $array from "../../core/utils/Array";
import { Percent, percent } from "../../core/utils/Percent";
import { Color } from "../../core/utils/Color";
import { LinearGradient } from "../../core/rendering/fills/LinearGradient";
import { RadialGradient } from "../../core/rendering/fills/RadialGradient";
import { Pattern } from "../../core/rendering/fills/Pattern";
import { MouseCursorStyle } from "../../core/interaction/Mouse";
import { OrderedListTemplate } from "../../core/utils/SortedList";
import { Container } from "../../core/Container";
import { LegendDataItem } from "../../charts/Legend";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
import { Animation } from "../../core/utils/Animation";
import { AMEvent } from "../../core/utils/EventDispatcher";
import { IDataItemEvents } from "../../core/DataItem";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

/**
 * Defines a [[DataItem]] for [[ForceDirectedSeries]].
 *
 * @see {@link DataItem}
 * @since 4.3.8
 */
export class ForceDirectedSeriesDataItem extends SeriesDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: ForceDirectedSeries;

	/**
	 * A reference to a component of a data item.
	 */
	public component: ForceDirectedSeries;

	/**
	 * A type of node used for this series.
	 */
	public _node: ForceDirectedNode;

	/**
	 * A list of [[ForceDirectedLink]] elements of links  to node's children.
	 *
	 * This list does not include a link to node's parent, which is available
	 * through `parentLink`.
	 */
	public childLinks: List<ForceDirectedLink>;

	/**
	 * A [[ForceDirectedLink]] to node's parent.
	 */
	public parentLink: ForceDirectedLink;

	/**
	 * A Legend's data item.
	 */
	protected _legendDataItem: LegendDataItem;

	/**
	 * Have all children already been initialized?
	 */
	public childrenInited: boolean = false;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ForceDirectedSeriesDataItem";

		this.hasChildren.children = true;

		this.childLinks = new List<ForceDirectedLink>();

		this.applyTheme();
	}

	/**
	 * Shows the Data Item and related visual elements.
	 *
	 * @param duration  Animation duration (ms)
	 * @param delay     Delay animation (ms)
	 * @param fields    A list of fields to set values of
	 */
	public show(duration?: number, delay?: number, fields?: string[]): $type.Optional<Animation> {
		this._visible = true;

		if (this.node) {
			this.node.isActive = true;
		}
		return;
	}

	/**
	 * @ignore
	 */
	public dispatchVisibility(visible: boolean) {
		if (this.events.isEnabled("visibilitychanged")) {
			const event: AMEvent<this, IDataItemEvents>["visibilitychanged"] = {
				type: "visibilitychanged",
				target: this,
				visible: visible
			};

			this.events.dispatchImmediately("visibilitychanged", event);
		}
	}


	/**
	 * Hides the Data Item and related visual elements.
	 *
	 * @param duration  Animation duration (ms)
	 * @param delay     Delay animation (ms)
	 * @param toValue   A value to set to `fields` when hiding
	 * @param fields    A list of data fields to set value to `toValue`
	 */
	public hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): $type.Optional<Animation> {
		this._visible = false;

		if (this.events.isEnabled("visibilitychanged")) {
			const event: AMEvent<this, IDataItemEvents>["visibilitychanged"] = {
				type: "visibilitychanged",
				target: this,
				visible: false
			};

			this.events.dispatchImmediately("visibilitychanged", event);
		}

		if (this.node) {
			this.node.isActive = false;
		}
		return;
	}

	/**
	 * Numeric value of the item.
	 *
	 * @param value  Value
	 */
	public set value(value: number) {
		this.setValue("value", value);
	}

	/**
	 * @return Value
	 */
	public get value(): number {

		let value = this.values.value.value;

		if (!$type.isNumber(value)) {
			if (this.children) {
				value = 0;
				this.children.each((child) => {
					value += child.value;
				})
			}
		}

		return value;
	}

	/**
	 * An element, related to this data item. (node)
	 *
	 * @readonly
	 * @return node element
	 */
	public get node(): ForceDirectedNode {
		if (!this._node) {

			let component = this.component;

			let node = component.nodes.create();
			node.draggable = true;
			this._node = node;

			this._disposers.push(node);

			this._disposers.push(new Disposer(() => {
				component.nodes.removeValue(node);
			}));

			this.addSprite(node);
			node.visible = this.visible;
			node.hiddenState.properties.visible = true;

			// Apply accessibility
			if (component.itemsFocusable()) {
				this.component.role = "menu";
				node.role = "menuitem";
				node.focusable = true;
			}
			else {
				this.component.role = "list";
				node.role = "listitem";
				node.focusable = false;
			}

			// Apply screen reader label
			if (node.focusable) {
				node.events.once("focus", (ev) => {
					node.readerTitle = component.populateString(component.itemReaderText, this);
				}, undefined, false);
				node.events.once("blur", (ev) => {
					node.readerTitle = "";
				}, undefined, false);
			}
			if (node.hoverable) {
				node.events.once("over", (ev) => {
					node.readerTitle = component.populateString(component.itemReaderText, this);
				}, undefined, false);
				node.events.once("out", (ev) => {
					node.readerTitle = "";
				}, undefined, false);
			}
		}
		return this._node;
	}

	/**
	 * Depth level in the series hierarchy.
	 *
	 * The top-level item will have level set at 0. Its children will have
	 * level 1, and so on.
	 *
	 * @readonly
	 * @return Level
	 */
	public get level(): number {
		if (!this.parent) {
			return 0;
		}
		else {
			return this.parent.level + 1;
		}
	}

	/**
	 * Item's color.
	 *
	 * If not set, will use parent's color, or, if that is not set either,
	 * automatically assigned color from chart's color set. (`chart.colors`)
	 *
	 * @param value  : Color | LinearGradient | RadialGradient | Pattern
	 */
	public set color(value: Color | LinearGradient | RadialGradient | Pattern) {
		this.setProperty("color", value);
	}

	/**
	 * @return Color
	 */
	public get color(): Color | LinearGradient | RadialGradient | Pattern {
		let color = this.properties.color;

		if (color == undefined) {
			if (this.parent) {
				color = this.parent.color;
			}
		}
		if (color == undefined) {
			if (this.component) {
				color = this.component.colors.getIndex(this.component.colors.step * this.index);
			}
		}
		return color;
	}

	/**
	 * An array of id's of other nodes outside of the child/parent tree to link
	 * with.
	 * 
	 * @param  value  Link list
	 */
	public set linkWith(value: string[]) {
		this.setProperty("linkWith", value);
	}

	/**
	 * @return Link list
	 */
	public get linkWith(): string[] {
		return this.properties.linkWith;
	}

	/**
	 * Should dataItem (node) be hidden in legend?
	 *
	 * @param value Visible in legend?
	 */
	public set hiddenInLegend(value: boolean) {
		this.setProperty("hiddenInLegend", value);
	}

	/**
	 * @return Hidden in legend?
	 */
	public get hiddenInLegend(): boolean {
		return this.properties.hiddenInLegend;
	}

	/**
	 * Indicates whether node should start off as collapsed.
	 *
	 * This can be used to specify whether node should start off as collapsed
	 * via data.
	 *
	 * To toggle actual node, use its `isActive` property instead.
	 * 
	 * @param  value  Collapsed?
	 */
	public set collapsed(value: boolean) {
		this.setProperty("collapsed", value);
		this.node.isActive = !value;
	}

	/**
	 * @return Collapsed?
	 */
	public get collapsed(): boolean {
		return this.properties.collapsed;
	}

	/**
	 * Is this node fixed (immovable)?
	 *
	 * @since 4.6.2
	 * @param  value  Fixed?
	 */
	public set fixed(value: boolean) {
		this.setProperty("fixed", value);
	}

	/**
	 * @return Fixed?
	 */
	public get fixed(): boolean {
		return this.properties.fixed;
	}

	/**
	 * A list of item's sub-children.
	 *
	 * @param children  Item's children
	 */
	public set children(children: OrderedListTemplate<ForceDirectedSeriesDataItem>) {
		this.setProperty("children", children);
	}

	/**
	 * @return Item's children
	 */
	public get children(): OrderedListTemplate<ForceDirectedSeriesDataItem> {
		return this.properties.children;
	}

	/**
	 * Creates a marker used in the legend for this slice.
	 *
	 * @ignore Exclude from docs
	 * @param marker  Marker container
	 */
	public createLegendMarker(marker: Container) {
		this.component.createLegendMarker(marker, this);
		if (!this.node.isActive) {
			this.hide();
		}
	}

	/**
	 * A legend's data item, that corresponds to this data item.
	 *
	 * @param value  Legend data item
	 */
	public set legendDataItem(value: LegendDataItem) {
		this._legendDataItem = value;
		if (value.label) {
			value.label.dataItem = this;
		}
		if (value.valueLabel) {
			value.valueLabel.dataItem = this;
		}
	}

	/**
	 * @return Legend data item
	 */
	public get legendDataItem(): LegendDataItem {
		return this._legendDataItem;
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[ForceDirectedSeries]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedSeriesDataFields extends ISeriesDataFields {

	/**
	 * Name of the field in data that holds category.
	 */
	category?: string;

	/**
	 * A name of the field in data that holds item's sub-items.
	 */
	children?: string;

	/**
	 * A name of the field in data that holds item's name.
	 */
	name?: string;

	/**
	 * A name of the field tha holds an array of ids that node should link with
	 * besides of it's own children or parent.
	 */
	linkWith?: string;

	/**
	 * A name of the field in data that holds item's color.
	 *
	 * If not set, a new color will be automatically assigned to each item as
	 * defined by theme.
	 */
	color?: string;

	/**
	 * Name of the field in data that holds boolean flag if item should be
	 * hidden in legend.
	 */
	hiddenInLegend?: string;

	/**
	 * A name of the field that holds boolean flag whether node should start
	 * as collapsed. (nodes start as fully expanded by default)
	 */
	collapsed?: string;

	/**
	 * name of the field that holds boolean flag indicating whether this node
	 * is "fixed" (immobavle).
	 *
	 * @since 4.6.2
	 */
	fixed?: string;
}

/**
 * Defines properties for [[ForceDirectedSeries]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedSeriesProperties extends ISeriesProperties {

	/**
	 * Smallest possible radius in pixels of the node circle.
	 * 
	 * @default 5
	 */
	minRadius?: number | Percent;

	/**
	 * Biggest possible radius in pixels of the node circle.
	 * 
	 * @default 70
	 */
	maxRadius?: number | Percent;

	/**
	 * A color set to be used for coloring nodes.
	 *
	 * Each new top level will be assigned a new color from this list.
	 */
	colors?: ColorSet;

	/**
	 * Number of levels to display initially.
	 */
	maxLevels?: number;

	/**
	 * A relative strength with which nodes push or attract each other.
	 */
	manyBodyStrength?: number;

	/**
	 * A relative strength with which nodes are pushed away or attracted to
	 * center of the chart.
	 */
	centerStrength?: number;

	/**
	 * Relative attraction strength between the nodes connected with `linkWith`.
	 *
	 * @since 4.4.8
	 */
	linkWithStrength?: number;
}

/**
 * Defines events for [[ForceDirectedSeries]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedSeriesEvents extends ISeriesEvents { }

/**
 * Defines adapters for [[ForceDirectedSeries]].
 *
 * @see {@link Adapter}
 * @since 4.3.8
 */
export interface IForceDirectedSeriesAdapters extends ISeriesAdapters, IForceDirectedSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[Series]] for a [[ForceDirectedTree]] chart.
 *
 * @see {@link IForceDirectedSeriesEvents} for a list of available Events
 * @see {@link IForceDirectedSeriesAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/ForceDirectedTree/} For more information
 * @todo Example
 * @since 4.3.8
 * @important
 */
export class ForceDirectedSeries extends Series {

	/**
	 * @ignore
	 */
	public _node: ForceDirectedNode;

	/**
	 * @ignore
	 */
	protected _nodes: ListTemplate<this["_node"]>;

	/**
	 * @ignore
	 */
	public _link: ForceDirectedLink;

	/**
	 * @ignore
	 */
	protected _links: ListTemplate<this["_link"]>;

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: IForceDirectedSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IForceDirectedSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IForceDirectedSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IForceDirectedSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: ForceDirectedSeriesDataItem;

	/**
	 * A chart series belongs to.
	 */
	public _chart: ForceDirectedTree;

	/**
	 * Parent data item of a series.
	 */
	public parentDataItem: ForceDirectedTreeDataItem;

	/**
	 * A reference to the `d3.Simulation` instance for fine-grained configuration
	 * of node gravitational dynamics.
	 *
	 * @see {@link https://github.com/d3/d3-force#simulation} For more info
	 */
	public d3forceSimulation: d3force.Simulation<{}, d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>>;

	/**
	 * @ignore
	 */
	protected _maxValue: number;

	/**
	 * @ignore
	 */
	public forceLinks: d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>[];

	/**
	 * @ignore
	 */
	protected _linkForce: d3force.ForceLink<d3force.SimulationNodeDatum, d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>>;

	/**
	 * @ignore
	 */
	protected _collisionForce: d3force.ForceCollide<d3force.SimulationNodeDatum>;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ForceDirectedSeries";

		this.d3forceSimulation = d3force.forceSimulation();

		this.maxRadius = percent(8);
		this.minRadius = percent(1);

		this.width = percent(100);
		this.height = percent(100);

		this.colors = new ColorSet();
		this.colors.step = 2;

		this.width = percent(100);
		this.height = percent(100);

		this.manyBodyStrength = -15;
		this.centerStrength = 0.8;

		this.events.on("maxsizechanged", () => {
			this.updateRadiuses(this.dataItems);
			this.updateLinksAndNodes();

			this.dataItems.each((dataItem) => {
				this.handleFixed(dataItem);
			})

			let d3forceSimulation = this.d3forceSimulation;

			let w = $math.max(50, this.innerWidth);
			let h = $math.max(50, this.innerHeight);

			if (d3forceSimulation) {
				d3forceSimulation.force("x", d3force.forceX().x(w / 2).strength(this.centerStrength * 100 / w));
				d3forceSimulation.force("y", d3force.forceY().y(h / 2).strength(this.centerStrength * 100 / h));
				if (d3forceSimulation.alpha() < 0.4) {
					d3forceSimulation.alpha(0.4);
					d3forceSimulation.restart();
				}
			}
		})

		this.applyTheme();
	}

	/**
	 * Returns maximum value from all supplied data items.
	 * 
	 * @ignore
	 * @param   dataItems  List of data items
	 * @param   max        Default max
	 * @return             Max
	 */
	protected getMaxValue(dataItems: OrderedListTemplate<ForceDirectedSeriesDataItem>, max: number): number {
		dataItems.each((dataItem) => {
			if (dataItem.value > max) {
				max = dataItem.value;
			}

			if (dataItem.children) {
				let cmax = this.getMaxValue(dataItem.children, max);
				if (cmax > max) {
					max = cmax;
				}
			}
		})
		return max;
	}

	/**
	 * Validates (processes) data items.
	 *
	 * @ignore Exclude from docs
	 */
	public validateDataItems(): void {

		if (this.chart.__disabled) {
			super.validateDataItems();
			return;
		}

		this._dataDisposers.push(new ListDisposer(this.links));

		this._maxValue = this.getMaxValue(this.dataItems, 0);

		this.forceLinks = [];

		this.colors.reset();

		let index = 0;

		let radius = Math.min(this.innerHeight / 3, this.innerWidth / 3);

		if (this.dataItems.length <= 1) {
			radius = 0;
		}

		this.dataItems.each((dataItem) => {

			let angle = index / this.dataItems.length * 360;

			let node = dataItem.node;

			let xField = node.propertyFields.x;
			let yField = node.propertyFields.y;

			if (xField && $type.hasValue((<any>dataItem.dataContext)[xField])) {
				node.x = (<any>dataItem.dataContext)[xField];
			}
			else {
				node.x = this.innerWidth / 2 + radius * $math.cos(angle);
			}
			if (yField && $type.hasValue((<any>dataItem.dataContext)[yField])) {
				node.y = (<any>dataItem.dataContext)[yField];
			}
			else {
				node.y = this.innerHeight / 2 + radius * $math.sin(angle);
			}

			this.handleFixed(dataItem);

			dataItem.node.fill = dataItem.color;
			dataItem.node.stroke = dataItem.color;

			index++;

			this.initNode(dataItem);
		})

		if (this.dataFields.linkWith) {
			this.dataItems.each((dataItem) => {
				this.processLinkWith(dataItem);
			})
		}

		let d3forceSimulation = this.d3forceSimulation;

		d3forceSimulation.on("tick", () => {
			this.updateLinksAndNodes();
		});

		// helps to avoid initial scatter
		for (let i = 0; i < 10; i++) {
			d3forceSimulation.tick();
		}
		d3forceSimulation.alphaDecay(1 - Math.pow(0.001, 1 / 600));

		this.chart.feedLegend();

		super.validateDataItems();
	}

	protected handleFixed(dataItem: this["_dataItem"]) {
		let node = dataItem.node;

		let xField = node.propertyFields.x;
		let yField = node.propertyFields.y;

		if (xField && $type.hasValue((<any>dataItem.dataContext)[xField])) {
			node.x = (<any>dataItem.dataContext)[xField];
		}

		if (yField && $type.hasValue((<any>dataItem.dataContext)[yField])) {
			node.y = (<any>dataItem.dataContext)[yField];
		}

		if (dataItem.fixed) {
			if (node.x instanceof Percent) {
				(<any>node).fx = $utils.relativeToValue(node.x, this.innerWidth);
			}
			else {
				(<any>node).fx = node.x;
			}

			if (node.y instanceof Percent) {
				(<any>node).fy = $utils.relativeToValue(node.y, this.innerHeight);
			}
			else {
				(<any>node).fy = node.y;
			}

			node.draggable = false;

			node.validate(); // for links to redraw
		}
		else {
			(<any>node).fx = undefined;
			(<any>node).fy = undefined;
			node.draggable = true;
		}
	}

	/**
	 * @ignore
	 * @todo description
	 */
	public updateNodeList() {
		let d3forceSimulation = this.d3forceSimulation;
		d3forceSimulation.nodes(this.nodes.values);
		this._linkForce = d3force.forceLink(this.forceLinks);
		d3forceSimulation.force("link", this._linkForce);
		this._collisionForce = d3force.forceCollide();
		d3forceSimulation.force("collision", this._collisionForce);

		let w = $math.max(50, this.innerWidth);
		let h = $math.max(50, this.innerHeight);

		d3forceSimulation.force("x", d3force.forceX().x(w / 2).strength(this.centerStrength * 100 / w));
		d3forceSimulation.force("y", d3force.forceY().y(h / 2).strength(this.centerStrength * 100 / h));
	}

	/**
	 * @ignore
	 * @todo description
	 */
	public updateLinksAndNodes() {
		if (this._linkForce) {
			this._linkForce.distance((linkDatum) => {
				return this.getDistance(linkDatum)
			});
			this._linkForce.strength((linkDatum) => {
				return this.getStrength(linkDatum)
			});
		}

		if (this._collisionForce) {
			this._collisionForce.radius(function(node) {
				if (node instanceof ForceDirectedNode) {
					let radius = node.circle.pixelRadius;
					if (!node.outerCircle.__disabled && !node.outerCircle.disabled && node.outerCircle.visible) {
						radius = (radius + 3) * node.outerCircle.scale;
					}
					return radius + node.paddingRadius;
				}
				return 1;
			})
		}

		this.d3forceSimulation.force("manybody", d3force.forceManyBody().strength((node) => {
			if (node instanceof ForceDirectedNode) {
				return node.circle.pixelRadius * this.manyBodyStrength;
			}
			return this.manyBodyStrength;
		}));
	}

	/**
	 * @ignore
	 * @todo description
	 */
	protected getDistance(linkDatum: d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>) {
		let source: ForceDirectedNode = <ForceDirectedNode>linkDatum.source;
		let target: ForceDirectedNode = <ForceDirectedNode>linkDatum.target;

		let distance = 0;
		if (target.dataItem && source.dataItem) {


			let link = source.linksWith.getKey(target.uid);

			if (link) {
				distance = link.distance;
			}

			if (!source.isActive) {
				distance = 1;
			}

			if(target.isHidden){
				return 0;
			}

			return (distance * (source.circle.pixelRadius + target.circle.pixelRadius));
		}

		return distance;
	}

	/**
	 * @ignore
	 * @todo description
	 */
	protected getStrength(linkDatum: d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>) {
		let source: ForceDirectedNode = <ForceDirectedNode>linkDatum.source;
		let target: ForceDirectedNode = <ForceDirectedNode>linkDatum.target;

		let strength = 0;

		let link = source.linksWith.getKey(target.uid);
		if (link) {
			strength = link.strength;
		}

		if(target.isHidden){
			return 0;
		}

		return strength;
	}

	/**
	 * Handler for drag end event.
	 * 
	 * @ignore
	 */
	public nodeDragEnded(): void {
		this.d3forceSimulation.alphaTarget(0);
	}
	/**
	 * Handler for drag start event.
	 * 
	 * @ignore
	 */
	public nodeDragStarted(): void {
		this.d3forceSimulation.alpha(0.1);
		this.d3forceSimulation.restart();
	}

	/**
	 * Resets positions of whole tree.
	 * 
	 * @ignore
	 */
	public restartSimulation(): void {
		if (this.d3forceSimulation.alpha() <= 0.3) {
			this.d3forceSimulation.alpha(0.3);
			this.d3forceSimulation.restart();
		}
	}

	/**
	 * @ignore
	 */
	protected updateRadiuses(dataItems: OrderedListTemplate<ForceDirectedSeriesDataItem>) {
		dataItems.each((dataItem) => {
			this.updateRadius(dataItem);
			if (dataItem.childrenInited) {
				this.updateRadiuses(dataItem.children);
			}
		})
	}

	/**
	 * @ignore
	 */
	protected updateRadius(dataItem: ForceDirectedSeriesDataItem) {
		let node = dataItem.node;
		let minSide = (this.innerWidth + this.innerHeight) / 2;
		let minRadius = $utils.relativeToValue(this.minRadius, minSide)
		let maxRadius = $utils.relativeToValue(this.maxRadius, minSide)

		let radius = minRadius + dataItem.value / this._maxValue * (maxRadius - minRadius);

		if (!$type.isNumber(radius)) {
			radius = minRadius;
		}

		//if(!node.circle.isHidden){
		node.circle.radius = radius;
		//}
		node.outerCircle.radius = radius + 3;

		node.circle.states.getKey("active").properties.radius = radius;
		node.circle.defaultState.properties.radius = radius;
	}

	/**
	 * Initializes node.
	 * 
	 * @ignore
	 */
	public initNode(dataItem: ForceDirectedSeriesDataItem): void {

		let node = dataItem.node;
		node.parent = this;
		this.updateRadius(dataItem);

		//let nodeIndex = this.nodes.indexOf(dataItem.node);

		if (!dataItem.children || dataItem.children.length == 0) {
			node.outerCircle.disabled = true;
			node.circle.interactionsEnabled = true;
			node.cursorOverStyle = MouseCursorStyle.default;
		}
		else {
			node.cursorOverStyle = MouseCursorStyle.pointer;
		}


		if (this.dataItemsInvalid && (dataItem.level >= this.maxLevels - 1 || dataItem.collapsed)) {
			node.isActive = false;
			this.updateNodeList();
			return;
		}

		if (!node.isActive) {
			node.hide(0);
		}

		if (dataItem.children) {
			let index = 0;
			dataItem.childrenInited = true;

			if (this.dataItems.length == 1 && dataItem.level == 0) {
				this.colors.next();
			}

			dataItem.children.each((child) => {
				/*
				let link = this.links.create();
				link.parent = this;
				link.zIndex = -1;
				dataItem.childLinks.push(link);
				link.source = dataItem.node;
				let childIndex = this.nodes.indexOf(child.node);
				link.target = child.node;
				child.parentLink = link;

				this._forceLinks.push({ source: nodeIndex, target: childIndex });
				*/

				let link = node.linkWith(child.node);
				child.parentLink = link;

				let radius = 2 * node.circle.pixelRadius + child.node.circle.pixelRadius;

				let angle = index / dataItem.children.length * 360;

				child.node.x = node.pixelX + radius * $math.cos(angle);
				child.node.y = node.pixelY + radius * $math.sin(angle);

				child.node.circle.radius = 0;

				let color: Color | LinearGradient | RadialGradient | Pattern;

				let diColor = child.properties.color;
				if ($type.hasValue(diColor)) {
					color = diColor;
				}
				else {
					if (this.dataItems.length == 1 && dataItem.level == 0) {
						color = this.colors.next();
					}
					else {
						color = dataItem.color;
					}
				}
				child.color = color;
				child.node.fill = color;
				child.node.stroke = color;
				child.parentLink.stroke = color;

				this.initNode(child);

				index++;
			})
		}
		node.isActive = true;
		node.show();
		this.updateNodeList();
	}

	/**
	 * @ignore
	 * @todo description
	 */
	protected processLinkWith(dataItem: ForceDirectedSeriesDataItem) {

		if (dataItem.linkWith) {
			$array.each(dataItem.linkWith, (id, index) => {
				let dataItemToConnect = this.getDataItemById(this.dataItems, id);

				if (dataItemToConnect) {
					dataItem.node.linkWith(dataItemToConnect.node, this.linkWithStrength);
				}
			})
		}

		if (dataItem.children) {
			dataItem.children.each((child) => {
				this.processLinkWith(child);
			})
		}
	}

	/**
	 * Returns a [[ForceDirectedSeriesDataItem]] related to node by specific id.
	 *
	 * @param   dataItems  List of data items to search in
	 * @param   id         Id to search for
	 * @return             Data item
	 */
	public getDataItemById(dataItems: OrderedListTemplate<ForceDirectedSeriesDataItem>, id: string): ForceDirectedSeriesDataItem {
		for (let i = dataItems.length - 1; i >= 0; i--) {
			let dataItem = dataItems.getIndex(i);

			if (dataItem.id == id) {
				return dataItem;
			}
			if (dataItem.children) {
				let di = this.getDataItemById(dataItem.children, id);
				if (di) {
					return di;
				}
			}
		}
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new ForceDirectedSeriesDataItem();
	}

	/**
	 * A list of nodes in series.
	 * 
	 * @return  Node list
	 */
	public get nodes(): ListTemplate<this["_node"]> {
		if (!this._nodes) {
			let node = this.createNode();

			node.applyOnClones = true;
			this._disposers.push(node);

			this._nodes = new ListTemplate(node);
			this._disposers.push(new ListDisposer(this._nodes));
		}
		return this._nodes;
	}

	/**
	 * A list of links between nodes.
	 * 
	 * @return  Link list
	 */
	public get links(): ListTemplate<this["_link"]> {
		if (!this._links) {
			let link = this.createLink();
			link.applyOnClones = true;
			this._disposers.push(link);

			this._links = new ListTemplate(link);
			this._disposers.push(new ListDisposer(this._links));
		}
		return this._links;
	}

	/**
	 * Creates a new node.
	 */
	protected createNode(): this["_node"] {
		return new ForceDirectedNode();
	}

	/**
	 * Creates a new link.
	 */
	protected createLink(): this["_link"] {
		return new ForceDirectedLink();
	}

	/**
	 * Smallest possible radius in pixels of the node circle.
	 * 
	 * If set in percent, it radius will be calculated from average width and
	 * height of series.
	 * 
	 * @default Percent(1)
	 * @param  value  Minimum radius (px or percent)
	 */
	public set minRadius(value: number | Percent) {
		this.setPropertyValue("minRadius", value, true);
	}

	/**
	 * @return Minimum radius (px or percent)
	 */
	public get minRadius(): number | Percent {
		return this.getPropertyValue("minRadius");
	}

	/**
	 * Biggest possible radius in pixels of the node circle.
	 * 
	 * If set in percent, it radius will be calculated from average width and
	 * height of series.
	 *
	 * @default Percent(8)
	 * @param  value  Maximum radius (px or Percent)
	 */
	public set maxRadius(value: number | Percent) {
		this.setPropertyValue("maxRadius", value, true);
	}

	/**
	 * @return Maximum radius (px or Percent)
	 */
	public get maxRadius(): number | Percent {
		return this.getPropertyValue("maxRadius");
	}

	/**
	 * A color set to be used for nodes.
	 *
	 * iIt works like this:
	 * 
	 * The first level with more than one node, assigns different colors to all
	 * nodes in this list. Their child nodes inherit the color.
	 *
	 * For example, if the top level has one node with three children, the top
	 * node will get first color, the first child will get second color, etc.
	 *
	 * If there are two top nodes, the first top node gets first color, the
	 * second top node gets the second color. Their subsequent children inherit
	 * colors.
	 *
	 * @param value  Color set
	 */
	public set colors(value: ColorSet) {
		this.setPropertyValue("colors", value, true);
	}

	/**
	 * @return Color set
	 */
	public get colors(): ColorSet {
		return this.getPropertyValue("colors");
	}

	/**
	 * Number of levels to be displayed initially.
	 * 
	 * @param  value  Number of levels
	 */
	public set maxLevels(value: number) {
		this.setPropertyValue("maxLevels", value, true);
	}

	/**
	 * @return Number of levels
	 */
	public get maxLevels(): number {
		return this.getPropertyValue("maxLevels");
	}

	/**
	 * Relative strength each node pushes (or attracts) other nodes (it is
	 * multiplied by `node.circle.radius` for big nodes to push stronger).
	 * 
	 * Positive value will make nodes attract each other, while negative will
	 * push away each other. The bigger the negative number is, the more 
	 * scattered nodes will be.
	 *
	 * Available value range: `-XX` to `XX`.
	 * 
	 * @default -15
	 * @param  value  Body push/attrack strength
	 */
	public set manyBodyStrength(value: number) {
		if (this.setPropertyValue("manyBodyStrength", value)) {
			this.restartSimulation();
		}
	}

	/**
	 * @return  Body push/attrack strength
	 */
	public get manyBodyStrength(): number {
		return this.getPropertyValue("manyBodyStrength");
	}

	/**
	 * Relative strength each child node is pushes (or attracted) to the center
	 * of the chart.
	 * 
	 * Positive value will make nodes to be attracted to center, while negative
	 * will push them away.
	 *
	 * Available value range: `-50` to `50`.
	 * 
	 * @default 0.8
	 * @param  value  Stregth of attraction to center
	 */
	public set centerStrength(value: number) {
		if (this.setPropertyValue("centerStrength", value)) {
			this.restartSimulation();
		}
	}

	/**
	 * @return  Stregth of attraction to center
	 */
	public get centerStrength(): number {
		return this.getPropertyValue("centerStrength");
	}

	/**
	 * Relative attraction strength between the nodes connected with `linkWith`.
	 *
	 * @since 4.4.8
	 * @param  value  Strength
	 * @default undefined
	 */
	public set linkWithStrength(value: number) {
		if (this.setPropertyValue("linkWithStrength", value)) {
			this.restartSimulation();
		}
	}

	/**
	 * @return Strength
	 */
	public get linkWithStrength(): number {
		return this.getPropertyValue("linkWithStrength");
	}


	/**
	 * Binds related legend data item's visual settings to this series' visual
	 * settings.
	 *
	 * @ignore Exclude from docs
	 * @param marker    Container
	 * @param dataItem  Data item
	 */
	public createLegendMarker(marker: Container, dataItem?: this["_dataItem"]): void {
		marker.children.each((child) => {
			let node = dataItem.node;

			if (child instanceof RoundedRectangle) {
				child.cornerRadius(40, 40, 40, 40);
			}


			child.defaultState.properties.fill = node.fill;
			child.defaultState.properties.stroke = node.stroke;
			child.defaultState.properties.fillOpacity = node.fillOpacity;
			child.defaultState.properties.strokeOpacity = node.strokeOpacity;

			child.fill = node.fill;
			child.stroke = node.stroke;
			child.fillOpacity = node.fillOpacity;
			child.strokeOpacity = node.strokeOpacity;

			if (child.fill == undefined) {
				child.__disabled = true;
			}

			let legendDataItem = <LegendDataItem>marker.dataItem;
			legendDataItem.color = node.fill;
			legendDataItem.colorOrig = node.fill;

			node.events.on("propertychanged", (ev) => {
				if (ev.property == "fill") {

					child.__disabled = false;

					if (!child.isActive) {
						child.fill = node.fill;
					}
					child.defaultState.properties.fill = node.fill;
					legendDataItem.color = node.fill;
					legendDataItem.colorOrig = node.fill;
				}

				if (ev.property == "stroke") {
					if (!child.isActive) {
						child.stroke = node.stroke;
					}
					child.defaultState.properties.stroke = node.stroke;
				}
			}, undefined, false)
		});
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ForceDirectedSeries"] = ForceDirectedSeries;
registry.registeredClasses["ForceDirectedSeriesDataItem"] = ForceDirectedSeriesDataItem;