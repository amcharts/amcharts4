/**
 * FlowDiagramNode module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Sprite, AMEvent, visualProperties, ISpriteEvents } from "../../core/Sprite";
import { FlowDiagram, FlowDiagramDataItem } from "../types/FlowDiagram";
import { List } from "../../core/utils/List";
import { registry } from "../../core/Registry";
import { Color } from "../../core/utils/Color";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $iter from "../../core/utils/Iterator";
import * as $string from "../../core/utils/String";
import * as $order from "../../core/utils/Order";
import * as $number from "../../core/utils/Number";
import { RoundedRectangle } from "../../core/elements/RoundedRectangle";
import * as $object from "../../core/utils/Object";
import { LegendSettings, LegendDataItem } from "../Legend";
import { Animation } from "../../core/utils/Animation";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[FlowDiagramNode]].
 */
export interface IFlowDiagramNodeProperties extends IContainerProperties {

	/**
	 * Name of the node.
	 */
	name?: string;

	/**
	 * Sum of all incomming+outgoing link values
	 */
	total?: number;

	/**
	 * Sum of all incoming link values
	 */
	totalIncoming?: number;

	/**
	 * Sum of all outgoing link values
	 */
	totalOutgoing?: number;

	/**
	 * Node's color.
	 */
	color?: Color;

}

/**
 * Defines events for [[FlowDiagramNode]].
 */
export interface IFlowDiagramNodeEvents extends IContainerEvents { }

/**
 * Defines adapters for [[FlowDiagramNode]].
 *
 * @see {@link Adapter}
 */
export interface IFlowDiagramNodeAdapters extends IContainerAdapters, IFlowDiagramNodeProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a node in a Flow Diagram.
 *
 * A Flow node is a block with a value, which represents its size on the
 * diagram.
 *
 * Nodes are connected via [[FlowLink]] elements.
 *
 * @see {@link IFlowDiagramNodeEvents} for a list of available events
 * @see {@link IFlowDiagramNodeAdapters} for a list of available Adapters
 * @important
 */
export class FlowDiagramNode extends Container {

	/**
	 * total ajusted taken in mind chart.minNodeSize
	 */
	public adjustedTotal: number;

	/**
	 * Defines available properties.
	 */
	public _properties!: IFlowDiagramNodeProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IFlowDiagramNodeAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IFlowDiagramNodeEvents;

	/**
	 * A list of data items of the items coming in from another node, one level
	 * up.
	 *
	 * These are what ingoing links are build out of.
	 */
	protected _incomingDataItems: List<this["_dataItem"]>;

	/**
	 * A list of data items of the items going out of the node.
	 *
	 * These are what outgoing links are build out of.
	 */
	protected _outgoingDataItems: List<this["_dataItem"]>;

	/**
	 * Sorted list of incoming items.
	 */
	protected _incomingSorted: $iter.Iterator<this["_dataItem"]>;

	/**
	 * Sorted list of outgoing items.
	 */
	protected _outgoingSorted: $iter.Iterator<this["_dataItem"]>;

	/**
	 * A chart instance this node is added to.
	 */
	public chart: FlowDiagram;


	/**
	 * Defines the type of the [[FlowDiagramDataItem]] used in the class.
	 */
	public _dataItem: FlowDiagramDataItem;

	/**
	 * Settings for the appearance of the related legend items.
	 */
	public legendSettings: LegendSettings = new LegendSettings();


	/**
	 * A reference to the legend data item related to this node.
	 */
	protected _legendDataItem: LegendDataItem;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "FlowDiagramNode";

		this.isMeasured = false;

		// TODO can this be removed ?
		new InterfaceColorSet();

		this.draggable = true;
		this.inert = true;

		this.setStateOnChildren = true;

		this.events.on("positionchanged", this.invalidateLinks, this, false);
		this.events.on("sizechanged", this.invalidateLinks, this, false);
		//this.events.on("hit", this.handleHit, this, false);
	}

	/**
	 * @ignore
	 */
	public handleHit(event: AMEvent<Sprite, ISpriteEvents>["hit"]) {
		if (this.isHidden || this.isHiding) {
			this.show();
		}
		else {
			this.hide();
		}
	}

	/**
	 * Shows hidden node.
	 *
	 * @param duration  Duration of reveal animation (ms)
	 * @return Animation
	 */
	public show(duration?: number): Animation {
		let animation = super.show(duration);

		this.outgoingDataItems.each(function(dataItem) {
			if (!dataItem.toNode || (dataItem.toNode && !dataItem.toNode.isHidden)) {
				dataItem.setWorkingValue("value", dataItem.getValue("value"), duration);
			}
		})

		this.incomingDataItems.each(function(dataItem) {
			if (!dataItem.fromNode || (dataItem.fromNode && !dataItem.fromNode.isHidden)) {
				dataItem.setWorkingValue("value", dataItem.getValue("value"), duration);
			}
		})

		return animation;
	}

	/**
	 * Hides node.
	 *
	 * @param duration  Duration of hiding animation (ms)
	 * @return Animation
	 */
	public hide(duration?: number): Animation {
		let animation = super.hide(duration);

		this.outgoingDataItems.each(function(dataItem) {
			dataItem.setWorkingValue("value", 0, duration);
		})

		this.incomingDataItems.each(function(dataItem) {
			dataItem.setWorkingValue("value", 0, duration);
		})

		return animation;
	}


	/**
	 * Marks node as invalid, for redrawal in the next update cycle.
	 *
	 * @ignore Exclude from docs
	 */
	public validate(): void {
		if(!this.isDisposed()){
			super.validate();
			this.invalidateLinks();
		}
	}

	/**
	 * Invalidates all links, attached to this node.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidateLinks(): void {

		this.outgoingDataItems.each((dataItem) => {
			let link = dataItem.link;
			if (link.colorMode == "fromNode") {
				link.fill = link.dataItem.fromNode.color;
			}

			if (link.colorMode == "gradient") {

				link.fill = link.gradient;
				link.stroke = link.gradient;

				let stop = link.gradient.stops.getIndex(0);

				if (stop) {
					stop.color = this.color;
					link.gradient.validate();
				}
			}
		});

		this.incomingDataItems.each((dataItem) => {
			let link = dataItem.link;
			if (link.colorMode == "toNode") {
				link.fill = link.dataItem.toNode.color;
			}

			if (link.colorMode == "gradient") {
				link.fill = link.gradient;
				link.stroke = link.gradient;

				let stop = link.gradient.stops.getIndex(1);

				if (stop) {
					stop.color = this.color;
					link.gradient.validate();
				}
			}
		});

	}

	/**
	 * List of incoming items (links).
	 *
	 * @readonly
	 * @return Incoming items
	 */
	public get incomingDataItems(): List<this["_dataItem"]> {
		if (!this._incomingDataItems) {
			let incomingDataItems = new List<FlowDiagramDataItem>();
			incomingDataItems.events.on("inserted", () => {
				if (this.chart.sortBy == "name") {
					this._incomingSorted = $iter.sort(this._incomingDataItems.iterator(), (x, y) => $string.order(x.fromName, y.fromName));
				}
				else if (this.chart.sortBy == "value") {
					this._incomingSorted = $iter.sort(this._incomingDataItems.iterator(), (x, y) => $order.reverse($number.order(x.value, y.value)));
				}
				else {
					this._incomingSorted = this._incomingDataItems.iterator();
				}
			}, undefined, false);
			this._incomingDataItems = incomingDataItems;
		}
		return this._incomingDataItems;
	}

	/**
	 * List of outgoing items (links).
	 *
	 * @readonly
	 * @return Outgoing items
	 */
	public get outgoingDataItems(): List<FlowDiagramDataItem> {
		if (!this._outgoingDataItems) {
			let outgoingDataItems = new List<FlowDiagramDataItem>();
			outgoingDataItems.events.on("inserted", () => {
				if (this.chart.sortBy == "name") {
					this._outgoingSorted = $iter.sort(this._outgoingDataItems.iterator(), (x, y) => $string.order(x.fromName, y.fromName));
				}
				else if (this.chart.sortBy == "value") {
					this._outgoingSorted = $iter.sort(this._outgoingDataItems.iterator(), (x, y) => $order.reverse($number.order(x.value, y.value)));
				}
				else {
					this._outgoingSorted = this._outgoingDataItems.iterator();
				}

			}, undefined, false);
			this._outgoingDataItems = outgoingDataItems;
		}
		return this._outgoingDataItems;
	}

	/**
	 * A name of the node.
	 *
	 * @param value  Name
	 */
	public set name(value: string) {
		this.setPropertyValue("name", value, true);
	}

	/**
	 * @return Name
	 */
	public get name(): string {
		return this.getPropertyValue("name");
	}

	/**
	 * Sum of all incoming+outgoing link values
	 *
	 * @param value  Value
	 */
	public set total(value: number) {
		this.setPropertyValue("total", value, true);
	}

	/**
	 * @return Value
	 */
	public get total(): number {
		return this.getPropertyValue("total");
	}

	/**
	 * Sum of all incomming link values.
	 *
	 * @param value  Value
	 */
	public set totalIncoming(value: number) {
		this.setPropertyValue("totalIncoming", value, true);
	}

	/**
	 * @return Value
	 */
	public get totalIncoming(): number {
		return this.getPropertyValue("totalIncoming");
	}

	/**
	 * Sum of all outgoing link values.
	 *
	 * @param value  Value
	 */
	public set totalOutgoing(value: number) {
		this.setPropertyValue("totalOutgoing", value, true);
	}

	/**
	 * @return Value
	 */
	public get totalOutgoing(): number {
		return this.getPropertyValue("totalOutgoing");
	}

	/**
	 * Node's color.
	 *
	 * @param value  Color
	 */
	public set color(value: Color) {
		this.setColorProperty("color", value);
		if (this._background) {
			this._background.fill = value;
		}
		this.fill = value;
	}

	/**
	 * @return Color
	 */
	public get color(): Color {
		return this.getPropertyValue("color");
	}

	/**
	 * Creates elements in related legend container, that mimics the look of this
	 * Series.
	 *
	 * @ignore Exclude from docs
	 * @param marker  Legend item container
	 */
	public createLegendMarker(marker: Container) {
		let w: number = marker.pixelWidth;
		let h: number = marker.pixelHeight;

		marker.removeChildren();

		let column: RoundedRectangle = marker.createChild(RoundedRectangle);
		column.shouldClone = false;
		$object.copyProperties(this, column, visualProperties);
		column.stroke = this.fill;

		column.copyFrom(<any>this);
		column.padding(0, 0, 0, 0); // if columns will have padding (which is often), legend marker will be very narrow
		column.width = w;
		column.height = h;

		let legendDataItem = <LegendDataItem>marker.dataItem;
		legendDataItem.color = column.fill;
		legendDataItem.colorOrig = column.fill;
	}

	/**
	 * Legend data item that corresponds to this series.
	 *
	 * @param value  Data item
	 */
	public set legendDataItem(value: LegendDataItem) {
		this._legendDataItem = value;
		this._legendDataItem.itemContainer.deepInvalidate();
	}

	/**
	 * @return Data item
	 */
	public get legendDataItem(): LegendDataItem {
		return this._legendDataItem;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FlowDiagramNode"] = FlowDiagramNode;
