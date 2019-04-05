/**
 * SankeyNode module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { FlowDiagramNode, IFlowDiagramNodeAdapters, IFlowDiagramNodeEvents, IFlowDiagramNodeProperties } from "./FlowDiagramNode";
import { SankeyDiagram, SankeyDiagramDataItem } from "../types/SankeyDiagram";
import { LabelBullet } from "./LabelBullet";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";
import * as $utils from "../../core/utils/Utils";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[SankeyNode]].
 */
export interface ISankeyNodeProperties extends IFlowDiagramNodeProperties {

	/**
	 * A level node is at. (0 - ...)
	 */
	level?: number;
}

/**
 * Defines events for [[SankeyNode]].
 */
export interface ISankeyNodeEvents extends IFlowDiagramNodeEvents { }

/**
 * Defines adapters for [[SankeyNode]].
 *
 * @see {@link Adapter}
 */
export interface ISankeyNodeAdapters extends IFlowDiagramNodeAdapters, ISankeyNodeProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a node in a Sankey Diagram.
 *
 * A Sankey node is a block with a value, which represents its size on the
 * diagram.
 *
 * Nodes are connected via [[SankeyLink]] elements.
 *
 * @see {@link ISankeyNodeEvents} for a list of available events
 * @see {@link ISankeyNodeAdapters} for a list of available Adapters
 * @important
 */
export class SankeyNode extends FlowDiagramNode {

	/**
	 * Defines available properties.
	 */
	public _properties!: ISankeyNodeProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISankeyNodeAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISankeyNodeEvents;


	/**
	 * [nextInCoord description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public nextInCoord: number = 0;

	/**
	 * [nextOutCoord description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 */
	public nextOutCoord: number = 0;

	/**
	 * A chart instance this node is added to.
	 */
	public chart: SankeyDiagram;


	/**
	 * Defines the type of the [[SankeyDiagramDataItem]] used in the class.
	 */
	public _dataItem: SankeyDiagramDataItem;

	/**
	 * A label element which shows node's value.
	 */
	public valueLabel: LabelBullet;

	/**
	 * A label element which shows node's name.
	 */
	public nameLabel: LabelBullet;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SankeyNode";

		this.width = 10;
		this.height = 10;

		let nameLabel = this.createChild(LabelBullet);
		nameLabel.shouldClone = false;
		//@should we auto update these locations if position is changed?
		nameLabel.locationX = 1;
		nameLabel.locationY = 0.5;
		nameLabel.label.text = "{name}";

		//nameLabel.label.textElement.hideOversized = false;
		nameLabel.width = 150;
		nameLabel.height = 150;
		nameLabel.label.horizontalCenter = "left";
		nameLabel.label.padding(0, 5, 0, 5);
		this.nameLabel = nameLabel;

		let valueLabel = this.createChild(LabelBullet);
		valueLabel.shouldClone = false;
		valueLabel.label.hideOversized = false;
		valueLabel.locationX = 0.5;
		valueLabel.locationY = 0.5;
		valueLabel.width = 150;
		valueLabel.height = 150;
		//valueLabel.label.text = "{value}";
		valueLabel.label.horizontalCenter = "middle";
		this.valueLabel = valueLabel;

		let hiddenState = this.hiddenState;
		hiddenState.properties.fill = new InterfaceColorSet().getFor("disabledBackground");
		hiddenState.properties.opacity = 0.5;
		hiddenState.properties.visible = true;

		this.background.hiddenState.copyFrom(hiddenState);

	}


	/**
	 * Invalidates all links, attached to this node.
	 *
	 * @ignore Exclude from docs
	 */
	public invalidateLinks(): void {
		super.invalidateLinks();
		this.nextInCoord = 0;
		this.nextOutCoord = 0;
		let chart = this.chart;

		if (chart) {
			let orientation = chart.orientation;
			if (this._incomingSorted) {
				$iter.each(this._incomingSorted, (dataItem) => {
					let link = dataItem.link;
					let value = dataItem.getWorkingValue("value");
					if ($type.isNumber(value)) {
						link.parent = this.chart.linksContainer;

						let x: number;
						let y: number;
						let angle: number;

						if (orientation == "horizontal") {
							x = this.pixelX + this.dx;
							y = this.nextInCoord + this.pixelY + this.dy;
							angle = 0;
						}
						else {
							y = this.pixelY + this.dy;
							x = this.nextInCoord + this.pixelX + this.dx;
							angle = 90;
						}

						link.endX = x;
						link.endY = y;
						link.startAngle = angle;
						link.endAngle = angle;
						link.gradient.rotation = angle;

						link.linkWidth = value * chart.valueHeight;

						if (!dataItem.fromNode) {

							if (orientation == "horizontal") {
								link.maxWidth = 200;
								link.startX = this.pixelX + this.dx - link.maxWidth;
								link.startY = link.endY;
							}
							else {
								link.maxHeight = 200;
								link.startX = link.endX;
								link.startY = this.pixelY + this.dy - link.maxHeight;
							}

							// TODO is this needed ?
							$utils.used(link.gradient);

							link.fill = dataItem.toNode.color;
							let stop = link.gradient.stops.getIndex(0);
							if (stop) {
								if (link.colorMode == "gradient") {
									stop.color = this.color;
								}
								stop.opacity = 0;
								link.fill = link.gradient;
								link.stroke = link.gradient;
								link.gradient.validate();
							}
						}
						//link.validate();
						this.nextInCoord += link.linkWidth;
					}
				});
			}

			if (this._outgoingSorted) {
				$iter.each(this._outgoingSorted, (dataItem) => {
					let link = dataItem.link;
					link.parent = this.chart.linksContainer;
					let value = dataItem.getWorkingValue("value");
					if ($type.isNumber(value)) {
						let x: number;
						let y: number;
						let angle: number;

						if (orientation == "horizontal") {
							angle = 0;
							x = this.pixelX + this.pixelWidth + this.dx - 1;
							y = this.nextOutCoord + this.pixelY + this.dy;
						}
						else {
							angle = 90;
							x = this.nextOutCoord + this.pixelX + this.dx;
							y = this.pixelY + this.pixelHeight + this.dy - 1;
						}

						link.startX = x;
						link.startY = y;
						link.startAngle = angle;
						link.endAngle = angle;
						link.gradient.rotation = angle;

						link.linkWidth = value * this.chart.valueHeight;

						if (!dataItem.toNode) {
							if (orientation == "horizontal") {
								link.maxWidth = 200;
								link.endX = this.pixelX + link.maxWidth + this.dx;
								link.endY = link.startY;
							}
							else {
								link.maxHeight = 200;
								link.endX = link.startX;
								link.endY = this.pixelY + link.maxHeight + this.dy;
							}

							link.opacity = this.opacity;

							let stop = link.gradient.stops.getIndex(1);
							if (stop) {
								if (link.colorMode == "gradient") {
									stop.color = this.color;
								}
								stop.opacity = 0;
								link.fill = link.gradient;
								link.stroke = link.gradient;
								link.gradient.validate();
							}
						}
						//link.validate();
						this.nextOutCoord += link.linkWidth;
					}
				});
			}
		}

		this.positionBullet(this.nameLabel);
		this.positionBullet(this.valueLabel);
	}

	/**
	 * Positions the bullet so it is centered within the node element.
	 *
	 * @param bullet  Target bullet
	 */
	protected positionBullet(bullet: LabelBullet) {
		if (bullet) {
			bullet.x = this.measuredWidth * bullet.locationX;
			bullet.y = this.measuredHeight * bullet.locationY;
		}
	}

	/**
	 * A level node is displayed at. (0 - ...)
	 *
	 * Levels are measured from left to right.
	 *
	 * The nodes in the left-most column will have `level = 0`.
	 *
	 * Nodes in second column - `level = 1`, etc.
	 *
	 * @param value  Level
	 */
	public set level(value: number) {
		this.setPropertyValue("level", value, true);
	}

	/**
	 * @return Level
	 */
	public get level(): number {
		return this.getPropertyValue("level");
	}

	/**
	 * Copies properties and labels from another [[SankeyNode]].
	 *
	 * @param source  Source node
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.nameLabel.copyFrom(source.nameLabel);
		this.valueLabel.copyFrom(source.valueLabel);
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SankeyNode"] = SankeyNode;
