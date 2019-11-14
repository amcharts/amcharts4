/**
 * FlowDiagram module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Chart, IChartProperties, IChartDataFields, IChartAdapters, IChartEvents, ChartDataItem } from "../Chart";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { DictionaryTemplate, DictionaryDisposer } from "../../core/utils/Dictionary";
import { Container } from "../../core/Container";
import { registry } from "../../core/Registry";
import { FlowDiagramNode } from "../elements/FlowDiagramNode";
import { FlowDiagramLink } from "../elements/FlowDiagramLink";
import { LinearGradientModifier } from "../../core/rendering/fills/LinearGradientModifier";
import { ColorSet } from "../../core/utils/ColorSet";
import { toColor, Color } from "../../core/utils/Color";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $number from "../../core/utils/Number";
import * as $order from "../../core/utils/Order";
import { Disposer } from "../../core/utils/Disposer";

/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

//@todo rearange notes after dragged

/**
 * Defines a [[DataItem]] for [[FlowDiagram]].
 *
 * @see {@link DataItem}
 */
export class FlowDiagramDataItem extends ChartDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: FlowDiagram;

	/**
	 * An a link element, connecting two nodes.
	 */
	public _link: FlowDiagramLink;

	/**
	 * An origin node.
	 */
	public fromNode: FlowDiagramNode;

	/**
	 * A destination node.
	 */
	public toNode: FlowDiagramNode;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "FlowDiagramDataItem";

		this.values.value = {};

		this.applyTheme();
	}

	/**
	 * Source node's name.
	 *
	 * @param value  Name
	 */
	public set fromName(value: string) {
		this.setProperty("fromName", value);
	}

	/**
	 * @return name
	 */
	public get fromName(): string {
		return this.properties.fromName;
	}

	/**
	 * Destination node's name.
	 *
	 * @param value  Name
	 */
	public set toName(value: string) {
		this.setProperty("toName", value);
	}

	/**
	 * @return name
	 */
	public get toName(): string {
		return this.properties.toName;
	}


	/**
	 * Node color
	 *
	 * @param value  Name
	 */
	public set color(value: Color) {
		this.setProperty("color", toColor(value));
	}

	/**
	 * @return color
	 */
	public get color(): Color {
		return this.properties.color;
	}

	/**
	 * Link's value.
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
		return this.values.value.value;
	}

	/**
	 * A visual element, representing link between the source and target nodes.
	 *
	 * Link's actual thickness will be determined by `value` of this link and
	 * `value` of the source node.
	 *
	 * @readonly
	 * @return Link element
	 */
	public get link(): this["_link"] {
		if (!this._link) {
			let link = this.component.links.create();
			this._link = link;

			this.addSprite(link);

			this._disposers.push(new Disposer(() => {
				if (this.component) {
					this.component.links.removeValue(link);
				}
			}));
		}
		return this._link;
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[FlowDiagram]].
 */
export interface IFlowDiagramDataFields extends IChartDataFields {

	/**
	 * Name of the source node.
	 */
	fromName?: string;

	/**
	 * Name of the target node.
	 */
	toName?: string;

	/**
	 * Value of the link between two nodes.
	 */
	value?: string;

	/**
	 * Color of a from node
	 */
	color?: string;

	/**
	 * Visibility of a node
	 */
	visible?: string;
}

/**
 * Defines properties for [[FlowDiagram]]
 */
export interface IFlowDiagramProperties extends IChartProperties {

	/**
	 * Padding for node square in pixels.
	 */
	nodePadding?: number;

	/**
	 * Sort nodes by name or value or do not sort a
	 */
	sortBy?: "none" | "name" | "value";

	/**
	 * Sometimes nodes can get very small if their value is little. With this setting you
	 * can set min size of a node (this is relative value from the total size of all nodes)
	 */
	minNodeSize: number;
}

/**
 * Defines events for [[FlowDiagram]].
 */
export interface IFlowDiagramEvents extends IChartEvents { }

/**
 * Defines adapters for [[FlowDiagram]].
 *
 * @see {@link Adapter}
 */
export interface IFlowDiagramAdapters extends IChartAdapters, IFlowDiagramProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a Pie chart
 * @see {@link IFlowDiagramEvents} for a list of available Events
 * @see {@link IFlowDiagramAdapters} for a list of available Adapters
 * @important
 */
export class FlowDiagram extends Chart {

	/**
	 * A Color Set to use when applying/generating colors for each subsequent
	 * node.
	 */
	public colors: ColorSet = new ColorSet();

	/**
	 * Defines a type for the DataItem.
	 */
	public _dataItem: FlowDiagramDataItem;

	/**
	 * Defines available data fields.
	 */
	public _dataFields: IFlowDiagramDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IFlowDiagramProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IFlowDiagramAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IFlowDiagramEvents;


	/**
	 */
	public _node: FlowDiagramNode;


	/**
	 * A list of chart's FlowDiagram nodes.
	 *
	 * @param {DictionaryTemplate<string, this["_node"]>}
	 */
	protected _nodes: DictionaryTemplate<string, this["_node"]>;


	/**
	 */
	public _link: FlowDiagramLink;

	/**
	 * A list of FlowDiagram links connecting nodes.
	 *
	 * @param {ListTemplate<this["_link"]>}
	 */
	protected _links: ListTemplate<this["_link"]>;

	/**
	 * A container that holds all of the link elements.
	 */
	public linksContainer: Container;

	/**
	 * A container that holds all of the node elements.
	 */
	public nodesContainer: Container;

	/**
	 * Sorted nodes iterator.
	 *
	 * @ignore
	 */
	protected _sorted: $iter.Iterator<[string, FlowDiagramNode]>;


	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "FlowDiagram";
		this.nodePadding = 20;
		this.sortBy = "none";
		this.sequencedInterpolation = true;

		this.colors.step = 2;
		this.minNodeSize = 0.02;

		let linksContainer = this.chartContainer.createChild(Container);
		linksContainer.shouldClone = false;
		linksContainer.layout = "none";
		linksContainer.isMeasured = false;
		this.linksContainer = linksContainer;

		let nodesContainer = this.chartContainer.createChild(Container);
		nodesContainer.shouldClone = false;
		nodesContainer.layout = "none";
		nodesContainer.isMeasured = false;
		this.nodesContainer = nodesContainer;

		// this data item holds sums, averages, etc
		this.dataItem = this.createDataItem();
		this.dataItem.component = this;

		// Apply theme
		this.applyTheme();
	}

	public dispose(): void {
		super.dispose();
		this.dataItem.dispose();
	}

	/**
	 * (Re)validates chart's data, effectively causing the chart to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {
		if (this._parseDataFrom == 0) {
			this.nodes.clear();
		}

		this.sortNodes();

		this.colors.reset();

		super.validateData();

		let sum = 0;
		let count = 0;
		let low: number;
		let high: number;

		// build blocks
		$iter.each(this.dataItems.iterator(), (dataItem) => {
			let fromName = dataItem.fromName;

			if (fromName) {
				let node = this.nodes.getKey(fromName);
				if (!node) {
					node = this.nodes.create(fromName);
					node.name = fromName;
					node.chart = this;
					node.dataItem = dataItem;
				}
				dataItem.fromNode = node;
				dataItem.fromNode.outgoingDataItems.push(dataItem);
			}
			let toName = dataItem.toName;
			if (toName) {
				let node = this.nodes.getKey(toName);
				if (!node) {
					node = this.nodes.create(toName);
					node.name = toName;
					node.chart = this;
					node.dataItem = dataItem;
				}

				dataItem.toNode = node;
				dataItem.toNode.incomingDataItems.push(dataItem);
			}

			if (!dataItem.fromNode) {
				let strokeModifier = new LinearGradientModifier();
				strokeModifier.opacities = [0, 1];
				dataItem.link.strokeModifier = strokeModifier;
			}

			if (!dataItem.toNode) {
				let fillModifier = new LinearGradientModifier();
				fillModifier.opacities = [1, 0];
				dataItem.link.strokeModifier = fillModifier;
			}

			let value = dataItem.value;
			if ($type.isNumber(value)) {
				sum += value;
				count++;

				if (low > value || !$type.isNumber(low)) {
					low = value;
				}
				if (high < value || !$type.isNumber(high)) {
					high = value;
				}
			}
		});

		let key = "value";

		this.dataItem.setCalculatedValue(key, high, "high");
		this.dataItem.setCalculatedValue(key, low, "low");
		this.dataItem.setCalculatedValue(key, sum, "sum");
		this.dataItem.setCalculatedValue(key, sum / count, "average");
		this.dataItem.setCalculatedValue(key, count, "count");


		$iter.each(this.nodes.iterator(), (strNode) => {
			let node = strNode[1];

			if (node.fill instanceof Color) {
				node.color = node.fill;
			}

			if (node.color == undefined) {
				node.color = this.colors.next();
			}

			if (node.dataItem.color != undefined) {
				node.color = node.dataItem.color;
			}

			if (!node.dataItem.visible) {
				node.hide(0);
			}

			this.getNodeValue(node);
		});

		this.sortNodes();
		this.feedLegend();
	}

	/**
	 * [handleDataItemWorkingValueChange description]
	 *
	 * @ignore Exclude from docs
	 */
	public handleDataItemWorkingValueChange(dataItem?: this["_dataItem"], name?: string): void {
		this.invalidate();
	}


	/**
	 * Sorts nodes by either their values or names, based on `sortBy` setting.
	 */
	protected sortNodes() {
		if (this.sortBy == "name") {
			this._sorted = this.nodes.sortedIterator();
		}
		else if (this.sortBy == "value") {
			this._sorted = $iter.sort(this.nodes.iterator(), (x, y) => $order.reverse($number.order(x[1].total, y[1].total)));
		}
		else {
			this._sorted = this.nodes.iterator();
		}
	}

	/**
	 * Updates a cummulative value of the node.
	 *
	 * A node's value is determined by summing values of all of the incoming
	 * links or all of the outgoing links, whichever results in bigger number.
	 *
	 * @param node  Node value
	 */
	protected getNodeValue(node: FlowDiagramNode) {

		// todo: totalIncomming totalOutgoing, total

		let incomingTotal = 0;
		let outgoingTotal = 0;

		$iter.each(node.incomingDataItems.iterator(), (dataItem: FlowDiagramDataItem) => {
			let value = dataItem.getWorkingValue("value");
			if ($type.isNumber(value)) {
				incomingTotal += value;
			}
		});

		$iter.each(node.outgoingDataItems.iterator(), (dataItem: FlowDiagramDataItem) => {
			let value = dataItem.getWorkingValue("value");
			if ($type.isNumber(value)) {
				outgoingTotal += value;
			}
		});

		node.total = incomingTotal + outgoingTotal;
		node.totalIncoming = incomingTotal;
		node.totalOutgoing = outgoingTotal;
	};

	/**
	 * Changes the sort type of the nodes.
	 *
	 * This will actually reshuffle nodes using nice animation.
	 */
	protected changeSorting() {
		this.sortNodes();
	}

	/**
	 * Sets defaults that instantiate some objects that rely on parent, so they
	 * cannot be set in constructor.
	 */
	protected applyInternalDefaults(): void {

		super.applyInternalDefaults();

		// Add a default screen reader title for accessibility
		// This will be overridden in screen reader if there are any `titles` set
		if (!$type.hasValue(this.readerTitle)) {
			this.readerTitle = this.language.translate("Flow diagram");
		}
	}

	/**
	 * Creates and returns a new data item.
	 *
	 * @return Data item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new FlowDiagramDataItem();
	}

	/**
	 * Padding for node square in pixels.
	 *
	 * Padding will add extra space around node's name label.
	 *
	 * @param value Padding (px)
	 */
	public set nodePadding(value: number) {
		this.setPropertyValue("nodePadding", value, true);
	}

	/**
	 * @return Padding (px)
	 */
	public get nodePadding(): number {
		return this.getPropertyValue("nodePadding");
	}

	/**
	 * Sort nodes by "name" or "value" or do not sort at all. If not sorted, nodes will appear in the same order as they are in the data.
	 * @default "none"
	 * @param value  Node sorting
	 */
	public set sortBy(value: "none" | "name" | "value") {
		this.setPropertyValue("sortBy", value);
		this.changeSorting();
	}

	/**
	 * @returns Node sorting
	 */
	public get sortBy(): "none" | "name" | "value" {
		return this.getPropertyValue("sortBy");
	}

	/**
	 * Sometimes nodes can get very small if their value is little. With this setting you
	 * can set min size of a node (this is relative value from the total size of all nodes)
	 * @default 0.02
	 * @param value  Node sorting
	 */
	public set minNodeSize(value: number) {
		this.setPropertyValue("minNodeSize", value, true);
	}

	/**
	 * @returns min node size
	 */
	public get minNodeSize(): number {
		return this.getPropertyValue("minNodeSize");
	}


	/**
	 * A list of chart's nodes.
	 *
	 * @param {DictionaryTemplate<string, this["_node"]>}
	 */
	public get nodes(): DictionaryTemplate<string, this["_node"]> {
		if (!this._nodes) {
			let template = this.createNode();
			template.events.on("hit", (event) => {
				event.target.handleHit(event);
			});
			this._nodes = new DictionaryTemplate<string, this["_node"]>(template);
			this._disposers.push(new DictionaryDisposer(this._nodes));
		}
		return this._nodes;
	}

	/**
	 * @ignore
	 */
	public createNode(): this["_node"] {
		let node = new FlowDiagramNode();
		this._disposers.push(node);
		return node;
	}

	/**
	 * A list of chart's links.
	 *
	 * @param {ListTemplate<this["_link"]>}
	 */
	public get links(): ListTemplate<this["_link"]> {
		if (!this._links) {
			this._links = new ListTemplate<this["_link"]>(this.createLink());
			this._disposers.push(new ListDisposer(this._links));
		}
		return this._links;
	}

	/**
	 * @ignore
	 */
	public createLink(): this["_link"] {
		let link = new FlowDiagramLink();
		this._disposers.push(link);
		return link;
	}

	/**
	 * Setups the legend to use the chart's data.
	 * @ignore
	 */
	public feedLegend(): void {
		let legend = this.legend;
		if (legend) {
			let legendData: any[] = [];

			this.nodes.each((key, node) => {
				legendData.push(node);
			});

			legend.data = legendData;
			legend.dataFields.name = "name";
		}
	}

	/**
	 * @ignore
	 */
	public disposeData() {
		super.disposeData();
		this.nodes.clear();
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FlowDiagram"] = FlowDiagram;
