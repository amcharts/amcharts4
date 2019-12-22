/**
 * Sankey diagram module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { FlowDiagram, FlowDiagramDataItem, IFlowDiagramAdapters, IFlowDiagramDataFields, IFlowDiagramEvents, IFlowDiagramProperties } from "./FlowDiagram";
import { percent } from "../../core/utils/Percent";
import { registry } from "../../core/Registry";
import { SankeyNode } from "../elements/SankeyNode";
import { SankeyLink } from "../elements/SankeyLink";
import { Animation } from "../../core/utils/Animation";
import { Orientation } from "../../core/defs/Orientation";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import * as $object from "../../core/utils/Object";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

//@todo rearange notes after dragged

/**
 * Defines a [[DataItem]] for [[SankeyDiagram]].
 *
 * @see {@link DataItem}
 */
export class SankeyDiagramDataItem extends FlowDiagramDataItem {

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: SankeyDiagram;

	/**
	 * An a link element, connecting two nodes.
	 */
	public _link: SankeyLink;

	/**
	 * An origin node.
	 */
	public fromNode: SankeyNode;

	/**
	 * A destination node.
	 */
	public toNode: SankeyNode;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SankeyDiagramDataItem";
		this.applyTheme();
	}
}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[SankeyDiagram]].
 */
export interface ISankeyDiagramDataFields extends IFlowDiagramDataFields {

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
}

/**
 * Defines properties for [[SankeyDiagram]]
 */
export interface ISankeyDiagramProperties extends IFlowDiagramProperties {

	/**
	 * Sort nodes by name or value or do not sort at all
	 */
	nodeAlign?: "top" | "bottom" | "middle";


	/**
	 * Orientation of the chart.
	 */
	orientation?: Orientation;
}

/**
 * Defines events for [[SankeyDiagram]].
 */
export interface ISankeyDiagramEvents extends IFlowDiagramEvents { }

/**
 * Defines adapters for [[SankeyDiagram]].
 *
 * @see {@link Adapter}
 */
export interface ISankeyDiagramAdapters extends IFlowDiagramAdapters, ISankeyDiagramProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a Sankey Diagram chart.
 *
 * @see {@link ISankeyDiagramEvents} for a list of available Events
 * @see {@link ISankeyDiagramAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/sankey-diagram/} for documentation
 * @important
 */
export class SankeyDiagram extends FlowDiagram {


	/**
	 * Defines a type for the DataItem.
	 */
	public _dataItem: SankeyDiagramDataItem;

	/**
	 * Defines available data fields.
	 */
	public _dataFields: ISankeyDiagramDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: ISankeyDiagramProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISankeyDiagramAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISankeyDiagramEvents;

	/**
	 * An a link element, connecting two nodes.
	 */
	public _link: SankeyLink;

	/**
	 * @todo Description
	 */
	protected _levelSum: { [index: number]: number };

	/**
	 * @todo Description
	 */
	protected _levelNodesCount: { [index: number]: number };

	/**
	 */
	public _node: SankeyNode;

	/**
	 * [maxSum description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public maxSum: number;

	/**
	 * level with max sum
	 */
	protected _maxSumLevel: number;

	/**
	 * [valueHeight description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	protected _valueHeight: number;

	/**
	 * A total number of levels, present on this chart.
	 */
	protected _levelCount: number;

	/**
	 * Sorted nodes iterator.
	 *
	 * @ignore
	 */
	protected _sorted: $iter.Iterator<[string, this["_node"]]>;

	protected _heightAnimation: Animation;

	protected _level: number;


	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "SankeyDiagram";
		this.orientation = "horizontal";
		this.nodeAlign = "middle";

		this.nodesContainer.width = percent(100);
		this.nodesContainer.height = percent(100);

		this.linksContainer.width = percent(100);
		this.linksContainer.height = percent(100);

		// Apply theme
		this.applyTheme();
	}

	/**
	 * (Re)validates chart's data, effectively causing the chart to redraw.
	 *
	 * @ignore Exclude from docs
	 */
	public validateData(): void {
		super.validateData();

		this._levelCount = 0;

		this.nodes.each((key, node) => {
			node.level = undefined;
		});

		this.nodes.each((key, node) => {
			node.level = this.getNodeLevel(node, 0);
			this._levelCount = $math.max(this._levelCount, node.level);
		});
	}

	/**
	 * Returns node's highest level.
	 *
	 * @param node   Node
	 * @param level  Current level
	 * @return New level
	 */
	protected getNodeLevel(node: this["_node"], level: number): number {
		//@todo solve circular so
		let levels: number[] = [level];
		$iter.each(node.incomingDataItems.iterator(), (link) => {
			if (link.fromNode) {
				if ($type.isNumber(link.fromNode.level)) {
					levels.push(link.fromNode.level + 1);
				}
				else {
					levels.push(this.getNodeLevel(link.fromNode, level + 1));
				}
			}
		})

		return Math.max(...levels);
	}


	/**
	 * Calculates relation between pixel height and total value.
	 *
	 * In Sankey the actual thickness of links and height of nodes will depend
	 * on their values.
	 */
	protected calculateValueHeight() {
		// calculate sums of each level
		this._levelSum = {};
		this._levelNodesCount = {};
		this.maxSum = 0;

		let total = this.dataItem.values.value.sum;

		$iter.each(this._sorted, (strNode) => {
			let node = strNode[1];
			this.getNodeValue(node);
		});

		this.nodes.each((key, node) => {
			let level = node.level;

			let value = Math.max(node.totalIncoming, node.totalOutgoing);


			if (value / total < this.minNodeSize) {
				value = total * this.minNodeSize;
			}

			if ($type.isNumber(this._levelSum[level])) {
				this._levelSum[level] += value;
			}
			else {
				this._levelSum[level] = value;
			}

			if ($type.isNumber(this._levelNodesCount[level])) {
				this._levelNodesCount[level]++;
			}
			else {
				this._levelNodesCount[level] = 1;
			}
		});


		let availableHeight: number;
		if (this.orientation == "horizontal") {
			availableHeight = this.chartContainer.maxHeight - 1;
		}
		else {
			availableHeight = this.chartContainer.maxWidth - 1;
		}


		let maxSumLevel: number;
		let minHeight: number;

		$object.each(this._levelSum, (key, value) => {
			let realValue = value;

			let levelNodeCount = this._levelNodesCount[key];
			let valueHeight = (availableHeight - (levelNodeCount - 1) * this.nodePadding) / realValue;

			if (minHeight > valueHeight || !$type.isNumber(minHeight)) {
				minHeight = valueHeight;
				this.maxSum = realValue;
				maxSumLevel = $type.toNumber(key);
			}
		});

		this._maxSumLevel = maxSumLevel;

		let maxSumLevelNodeCount = this._levelNodesCount[this._maxSumLevel];

		let valueHeight = (availableHeight - (maxSumLevelNodeCount - 1) * this.nodePadding) / this.maxSum;

		if (!$type.isNumber(this.valueHeight)) {
			this.valueHeight = valueHeight;
		}
		else {
			let finalHeight;
			try {
				finalHeight = this._heightAnimation.animationOptions[0].to;
			}
			catch (err) {

			}
			// without animations it will be non-smooth as maxValue jumps from one column to another
			if (finalHeight != valueHeight) {
				let duration = this.interpolationDuration;
				try {
					duration = this.nodes.template.states.getKey("active").transitionDuration;
				}
				catch (err) {

				}

				this._heightAnimation = new Animation(this, { property: "valueHeight", from: this.valueHeight, to: valueHeight }, duration, this.interpolationEasing).start();
				this._disposers.push(this._heightAnimation);
			}
		}
	}

	/**
	 * Redraws the chart.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		super.validate();

		this.calculateValueHeight();

		let container = this.nodesContainer;

		let nextCoordinate: { [index: number]: number } = {};

		let maxSumLevelNodeCount = this._levelNodesCount[this._maxSumLevel];

		let total = this.dataItem.values.value.sum;

		$iter.each(this._sorted, (strNode) => {
			let node = strNode[1];
			let level = node.level;
			let levelCoordinate: number = 0;

			let nodeCount = this._levelNodesCount[level];

			switch (this.nodeAlign) {
				case "bottom":
					levelCoordinate = (this.maxSum - this._levelSum[level]) * this.valueHeight - (nodeCount - maxSumLevelNodeCount) * this.nodePadding;
					break;
				case "middle":
					levelCoordinate = (this.maxSum - this._levelSum[level]) * this.valueHeight / 2 - (nodeCount - maxSumLevelNodeCount) * this.nodePadding / 2;
					break;
			}

			node.parent = container;

			let delta: number;
			let x: number;
			let y: number;

			let value = Math.max(node.totalIncoming, node.totalOutgoing);

			if (value / total < this.minNodeSize) {
				value = total * this.minNodeSize;
			}

			if (this.orientation == "horizontal") {
				delta = (this.innerWidth - node.pixelWidth) / this._levelCount;

				x = delta * node.level;
				y = nextCoordinate[level] || levelCoordinate;

				let h = value * this.valueHeight;

				node.height = h;
				node.minX = x;
				node.maxX = x;
				nextCoordinate[level] = y + h + this.nodePadding;
			}
			else {
				delta = (this.innerHeight - node.pixelHeight) / this._levelCount;

				x = nextCoordinate[level] || levelCoordinate;
				y = delta * node.level;

				let w = value * this.valueHeight;

				node.width = w;
				node.minY = y;
				node.maxY = y;
				nextCoordinate[level] = x + w + this.nodePadding;
			}
			node.x = x;
			node.y = y;
		});
	}

	/**
	 * Performs actual operations to reveal this element.
	 *
	 * @ignore Exclude from docs
	 * @param duration Fade in duration (ms)
	 * @return Fade in duration (ms)
	 */
	protected showReal(duration?: number): $type.Optional<Animation> {

		if(this.preventShow){
			return;
		}		

		if (this.interpolationDuration > 0) {
			let container = this.nodesContainer;

			let i: number = 0;

			$iter.each(this.links.iterator(), (link) => {
				link.hide(0);
			})

			$iter.each(this._sorted, (strNode) => {

				let node = strNode[1];

				let property: "dx" | "dy";

				if (this.orientation == "horizontal") {
					node.dx = -(container.pixelWidth - node.pixelWidth) / Math.max(this._levelCount, 1);
					property = "dx";
				}
				else {
					node.dy = -(container.pixelHeight - node.pixelHeight) / Math.max(this._levelCount, 1);
					property = "dy";
				}

				let delay = 0;
				let duration = this.interpolationDuration;
				if (this.sequencedInterpolation) {
					delay = this.sequencedInterpolationDelay * i + duration * i / $iter.length(this.nodes.iterator());
				}

				node.opacity = 0;
				node.invalidateLinks();

				node.animate([{ property: "opacity", from: 0, to: 1 }, { property: property, to: 0 }], this.interpolationDuration, this.interpolationEasing).delay(delay);

				$iter.each(node.outgoingDataItems.iterator(), (dataItem) => {
					let animation = dataItem.link.show(this.interpolationDuration);
					if (animation && !animation.isFinished()) {
						animation.delay(delay);
					}
				})

				$iter.each(node.incomingDataItems.iterator(), (dataItem) => {
					if (!dataItem.fromNode) {
						let animation = dataItem.link.show(this.interpolationDuration);
						if (animation && !animation.isFinished()) {
							animation.delay(delay);
						}
					}
				})

				i++;
			});
		}

		return super.showReal();
	}

	/**
	 * Changes the sort type of the nodes.
	 *
	 * This will actually reshuffle nodes using nice animation.
	 */
	protected changeSorting() {
		this.sortNodes();

		let nextCoordinate: { [index: number]: number } = {};

		$iter.each(this._sorted, (strNode) => {
			let node = strNode[1];
			let level = node.level;

			let levelCoordinate = (this.maxSum - this._levelSum[level]) * this.valueHeight / 2;

			let property: "x" | "y";
			let nodeHeight: number;
			if (this.orientation == "horizontal") {
				property = "y";
				nodeHeight = node.pixelHeight;
			}
			else {
				property = "x";
				nodeHeight = node.pixelWidth;
			}

			node.animate({ property: property, to: nextCoordinate[level] || levelCoordinate }, this.interpolationDuration, this.interpolationEasing);
			nextCoordinate[level] = (nextCoordinate[level] || levelCoordinate) + nodeHeight + this.nodePadding;

			node.invalidateLinks();
		});
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
			this.readerTitle = this.language.translate("Sankey diagram");
		}
	}

	/**
	 * Creates and returns a new data item.
	 *
	 * @return Data item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new SankeyDiagramDataItem();
	}

	/**
	 * How to align nodes. In case layout is vertical, top means left and bottom means right
	 *
	 * @param value  Node sorting
	 */
	public set nodeAlign(value: "top" | "middle" | "bottom") {
		this.setPropertyValue("nodeAlign", value);
		this.changeSorting();
	}

	/**
	 * @returns Returns nodeAlign value
	 */
	public get nodeAlign(): "top" | "middle" | "bottom" {
		return this.getPropertyValue("nodeAlign");
	}

	/**
	 * Orientation of the chart: "horizontal" or "vertical";
	 *
	 * @param value Orientation
	 */
	public set orientation(value: Orientation) {
		this.setPropertyValue("orientation", value, true);
		let nameLabel = this.nodes.template.nameLabel;

		if (value == "vertical") {
			this.nodes.template.width = undefined;
			nameLabel.label.horizontalCenter = "middle";
			nameLabel.locationX = 0.5;
		}
		else {
			this.nodes.template.height = undefined;
			nameLabel.label.horizontalCenter = "left";
			nameLabel.locationX = 1;
		}
	}

	/**
	 * @return Orientation
	 */
	public get orientation(): Orientation {
		return this.getPropertyValue("orientation");
	}

	/**
	 * @ignore
	 */
	public createNode(): this["_node"] {
		let node = new SankeyNode();
		this._disposers.push(node);
		return node;
	}

	/**
	 * @ignore
	 */
	public createLink(): this["_link"] {
		let link = new SankeyLink();
		this._disposers.push(link);
		return link;
	}


	/**
	 * @ignore
	 */
	public get valueHeight(): number {
		return this._valueHeight;
	}


	/**
	 * @ignore
	 */
	public set valueHeight(value: number) {
		if (value != this._valueHeight) {
			this._valueHeight = value;
			this.invalidate();
		}
	}

	/**
	 * @ignore
	 */
	disposeData() {
		super.disposeData();
		this._sorted = this.nodes.iterator();
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SankeyDiagram"] = SankeyDiagram;
