/**
 * ChordNode module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { FlowDiagramNode, IFlowDiagramNodeAdapters, IFlowDiagramNodeEvents, IFlowDiagramNodeProperties } from "./FlowDiagramNode";
import { ChordDiagram, ChordDiagramDataItem } from "../types/ChordDiagram";
import { List } from "../../core/utils/List";
import { AxisLabelCircular } from "../axes/AxisLabelCircular";
import { registry } from "../../core/Registry";
import { Slice } from "../../core/elements/Slice";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $iter from "../../core/utils/Iterator";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import { Bullet } from "../elements/Bullet";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[ChordNode]].
 */
export interface IChordNodeProperties extends IFlowDiagramNodeProperties { }

/**
 * Defines events for [[ChordNode]].
 */
export interface IChordNodeEvents extends IFlowDiagramNodeEvents { }

/**
 * Defines adapters for [[ChordNode]].
 *
 * @see {@link Adapter}
 */
export interface IChordNodeAdapters extends IFlowDiagramNodeAdapters, IChordNodeProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a node in a Chord Diagram.
 *
 * A Chord node is a block with a value, which represents its size on the
 * diagram.
 *
 * Nodes are connected via [[ChordLink]] elements.
 *
 * @see {@link IChordNodeEvents} for a list of available events
 * @see {@link IChordNodeAdapters} for a list of available Adapters
 * @important
 */
export class ChordNode extends FlowDiagramNode {

	/**
	 * Defines available properties.
	 */
	public _properties!: IChordNodeProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IChordNodeAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IChordNodeEvents;

	/**
	 * A list of data items of the items coming in from another node, one level
	 * up.
	 *
	 * These are what ingoing links are build out of.
	 */
	protected _incomingDataItems: List<ChordDiagramDataItem>;

	/**
	 * A list of data items of the items going out of the node.
	 *
	 * These are what outgoing links are build out of.
	 */
	protected _outgoingDataItems: List<ChordDiagramDataItem>;

	/**
	 * Sorted list of incoming items.
	 */
	protected _incomingSorted: $iter.Iterator<ChordDiagramDataItem>;

	/**
	 * Sorted list of outgoing items.
	 */
	protected _outgoingSorted: $iter.Iterator<ChordDiagramDataItem>;

	/**
	 * A chart instance this node is added to.
	 */
	public chart: ChordDiagram;


	/**
	 * Defines the type of the [[ChordDiagramDataItem]] used in the class.
	 */
	public _dataItem: ChordDiagramDataItem;


	/**
	 * Slice sprite of a node
	 */
	public slice: Slice;

	/**
	 * A label element which shows node's name.
	 */
	public label: AxisLabelCircular;

	/**
	 * @ignore
	 */
	public nextAngle: number;

	/**
	 * @ignore
	 */
	public trueStartAngle: number;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ChordNode";

		let label = this.createChild(AxisLabelCircular);
		label.location = 0.5;
		label.radius = 5;
		label.text = "{name}";
		label.zIndex = 1;
		label.shouldClone = false;
		this.label = label;

		this.layout = "none";

		this.events.on("positionchanged", this.updateRotation, this, false);

		this.isMeasured = false;
		this.slice = this.createChild(Slice);
		this.slice.isMeasured = false;

		let hiddenState = this.hiddenState;
		hiddenState.properties.fill = new InterfaceColorSet().getFor("disabledBackground");
		hiddenState.properties.opacity = 0.5;
		hiddenState.properties.visible = true;

		this.setStateOnChildren = false;

		this.slice.hiddenState.properties.visible = true;

		this.adapter.add("tooltipX", (tooltipX, target)=>{
		    return target.slice.ix * (target.slice.radius - (target.slice.radius - target.slice.pixelInnerRadius) / 2);
		})

		this.adapter.add("tooltipY", (tooltipY, target)=>{
		    return target.slice.iy * (target.slice.radius - (target.slice.radius - target.slice.pixelInnerRadius) / 2);
		})
	}


	/**
	 * Invalidates all links, attached to this node.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidateLinks(): void {
		super.invalidateLinks();

		let label = this.label;
		let slice = this.slice;
		let chart = this.chart;
		if (chart && slice) {

			let sum = this.total;
			let arc = slice.arc;
			let sliceStartAngle = slice.startAngle;

			this.children.each((child) => {
				if (child instanceof Bullet) {
					let locationX = child.locationX;
					if (!$type.isNumber(locationX)) {
						locationX = 0.5;
					}
					let locationY = child.locationY;
					if (!$type.isNumber(locationY)) {
						locationY = 1;
					}

					let childAngle = sliceStartAngle + arc * locationX;
					let childRadius = locationY * slice.radius;

					child.x = childRadius * $math.cos(childAngle);
					child.y = childRadius * $math.sin(childAngle);
				}
			})


			let labelAngle = sliceStartAngle + arc * label.location;
			let startAngle = sliceStartAngle + (1 - sum / this.adjustedTotal) * arc * 0.5; // if value of a node is > then sum of the links, add to center link

			if ($type.isNaN(startAngle)) {
				startAngle = sliceStartAngle;
			}

			label.fixPosition(labelAngle, slice.radius);

			this.nextAngle = startAngle;

			if (this._outgoingSorted) {

				$iter.each(this._outgoingSorted, (dataItem) => {
					let link = dataItem.link;
					link.parent = this.chart.linksContainer;
					let value = dataItem.getWorkingValue("value");

					if ($type.isNumber(value)) {

						if (chart.nonRibbon) {
							let percentWidth = link.percentWidth;
							if (!$type.isNumber(percentWidth)) {
								percentWidth = 5;
							}
							percentWidth = percentWidth / 100;

							link.startAngle = sliceStartAngle + arc / 2 - arc / 2 * percentWidth;
							link.arc = arc * percentWidth;
						}
						else {
							link.arc = value * chart.valueAngle;
							link.startAngle = this.nextAngle;
							this.nextAngle += link.arc;
						}

						if (!dataItem.toNode) {
							link.endAngle = link.startAngle;
						}

						link.radius = slice.pixelInnerRadius;
					}

					//link.validate();
				});
			}

			if (this._incomingSorted) {
				$iter.each(this._incomingSorted, (dataItem) => {
					let link = dataItem.link;

					link.radius = slice.pixelInnerRadius;

					if (chart.nonRibbon) {
						let percentWidth = link.percentWidth;
						if (!$type.isNumber(percentWidth)) {
							percentWidth = 5;
						}

						percentWidth = percentWidth / 100;

						link.endAngle = sliceStartAngle + arc / 2 - arc / 2 * percentWidth;
						link.arc = arc * percentWidth;
					}
					else {
						link.endAngle = this.nextAngle;
						let value = dataItem.getWorkingValue("value");
						if ($type.isNumber(value)) {
							link.arc = value * chart.valueAngle; // yes, this is needed
							this.nextAngle += link.arc;
						}
					}

					if (!dataItem.fromNode) {
						link.startAngle = link.endAngle;
					}

					//link.validate();
				});
			}
		}
	}

	/**
	 * @ignore
	 * updates slice start angle so that when we drag a node it would face the center
	 */
	protected updateRotation() {
		let slice = this.slice;
		let mAngle = this.trueStartAngle + slice.arc / 2;
		let radius = slice.radius;

		let tx = radius * $math.cos(mAngle);
		let ty = radius * $math.sin(mAngle);

		let angle = $math.getAngle({ x: tx + this.pixelX, y: ty + this.pixelY });

		slice.startAngle = this.trueStartAngle + (angle - mAngle);

		this.dx = - this.pixelX;
		this.dy = - this.pixelY;
	}


	/**
	 * Copies properties and labels from another [[ChordNode]].
	 *
	 * @param source  Source node
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.label.copyFrom(source.label);
		this.slice.copyFrom(source.slice);
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ChordNode"] = ChordNode;
