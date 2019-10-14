/**
 * Module that defines everything related to building ForceDirectedNodes.
 * 
 * It is a container which has ForceDirectedNode element which is a RoundedRectangle.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { registry } from "../../core/Registry";
import { Circle } from "../../core/elements/Circle";
import { Label } from "../../core/elements/Label";
import { ForceDirectedSeriesDataItem } from "./ForceDirectedSeries";
import { ForceDirectedLink } from "./ForceDirectedLink";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $type from "../../core/utils/Type";
import { Dictionary, DictionaryDisposer } from "../../core/utils/Dictionary";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[ForceDirectedNode]].
 */
export interface IForceDirectedNodeProperties extends IContainerProperties {

	/**
	 * If set to `true` (default) toggling a node on will automatically expand
	 * all nodes across the whole tree (all levels) of its descendants.
	 *
	 * Setting to `false` will only expand immediate children (one level).
	 */
	expandAll?: boolean;

	/**
	 * Padding of the nodes, in pixels.
	 */
	paddingRadius?: number;
}

/**
 * Defines events for [[ForceDirectedNode]].
 */
export interface IForceDirectedNodeEvents extends IContainerEvents { }

/**
 * Defines adapters for [[ForceDirectedNode]].
 *
 * @see {@link Adapter}
 */
export interface IForceDirectedNodeAdapters extends IContainerAdapters, IForceDirectedNodeProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Class used to creates [[ForceDirectedNode]] elements (circles).
 *
 * @see {@link IForceDirectedNodeEvents} for a list of available events
 * @see {@link IForceDirectedNodeAdapters} for a list of available Adapters
 * @since 4.3.8
 * @important
 */
export class ForceDirectedNode extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IForceDirectedNodeProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IForceDirectedNodeAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IForceDirectedNodeEvents;

	/**
	 * A node's [[Circle]] element.
	 */
	public circle: Circle;

	/**
	 * A [[Circle]] element for node's outline. This outline is used on nodes
	 * that have children.
	 */
	public outerCircle: Circle;

	/**
	 * Related data item.
	 */
	public _dataItem: ForceDirectedSeriesDataItem;

	/**
	 * Node's [[Label]] element.
	 */
	public label: Label;

	/**
	 * A list of other [[ForceDirectedNode]] elements this node is linked with
	 * using `linkWith`.
	 *
	 * @since 4.4.8
	 */
	public linksWith: Dictionary<string, ForceDirectedLink>;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ForceDirectedNode";

		//this.isMeasured = true; // for correct position of the tooltip
		this.applyOnClones = true;
		this.togglable = true;
		this.draggable = true;
		this.setStateOnChildren = true;

		this.isActive = false;
		this.expandAll = true;
		this.paddingRadius = 0;

		this.linksWith = new Dictionary<string, ForceDirectedLink>()
		this._disposers.push(new DictionaryDisposer(this.linksWith));

		this.events.on("dragstart", () => {
			if (this.dataItem.component) {
				this.dataItem.component.nodeDragStarted();
			}
		}, this, false);

		this.events.on("drag", () => {
			this.updateSimulation();
		}, this, false);

		let outerCircle = this.createChild(Circle);
		outerCircle.shouldClone = false;
		outerCircle.strokeWidth = 2;

		let bgColor = new InterfaceColorSet().getFor("background");
		outerCircle.fill = bgColor;
		this.outerCircle = outerCircle;

		let hoverState = outerCircle.states.create("hover");
		hoverState.properties.scale = 1.1;

		let outerActiveState = outerCircle.states.create("active");
		outerActiveState.properties.scale = 1.1;
		outerActiveState.properties.visible = true;

		let activeHoverState = outerCircle.states.create("hoverActive");
		activeHoverState.properties.scale = 1;

		let circle = this.createChild(Circle);

		let activeState = circle.states.create("active");
		activeState.properties.visible = true;

		circle.shouldClone = false;
		circle.interactionsEnabled = false;
		circle.hiddenState.properties.radius = 0.01;
		circle.events.on("validated", this.updateSimulation, this, false)
		circle.hiddenState.properties.visible = true;


		this.circle = circle;

		this.addDisposer(circle.events.on("validated", this.updateLabelSize, this, false));

		this._disposers.push(this.circle);

		let label = this.createChild(Label);
		label.shouldClone = false;
		label.horizontalCenter = "middle";
		label.verticalCenter = "middle";
		label.fill = bgColor;
		label.strokeOpacity = 0;
		label.interactionsEnabled = false;
		label.textAlign = "middle";
		label.textValign = "middle";
		this.label = label;

		this.adapter.add("tooltipY", (y, target) => {
			return -target.circle.pixelRadius;
		})
	}

	/**
	 * @ignore
	 */
	protected updateLabelSize() {
		if (this.label.text) {
			let circle = this.circle;
			let radius = circle.pixelRadius;

			let ds = circle.defaultState;
			let dsRadius = ds.properties.radius
			if ($type.isNumber(dsRadius)) {
				radius = dsRadius;
			}

			this.label.width = 2 * radius;
			this.label.height = 2 * radius;
		}
	}


	/**
	 * Copies all parameters from another [[ForceDirectedNode]].
	 *
	 * @param source Source ForceDirectedNode
	 */
	public copyFrom(source: this) {
		super.copyFrom(source);
		if (this.circle) {
			this.circle.copyFrom(source.circle);
		}
		if (this.label) {
			this.label.copyFrom(source.label);
		}
		if (this.outerCircle) {
			this.outerCircle.copyFrom(source.outerCircle);
		}
	}

	/**
	 * Sets node as "active" (expanded).
	 * 
	 * @ignore
	 * @param  value  Active or not?
	 */
	public setActive(value: boolean) {
		super.setActive(value);

		let dataItem = this.dataItem;

		if (dataItem) {

			let children = dataItem.children;
			let component = dataItem.component;
			if (!component.dataItemsInvalid) {
				if (value && children && !dataItem.childrenInited) {
					component.initNode(dataItem);
					component.updateNodeList();
				}

				if (value) {
					if (children) {
						children.each((child) => {
							child.node.show();
							child.node.interactionsEnabled = true;
							if (child.parentLink) {
								child.parentLink.show();
							}
							if (this.expandAll) {
								child.node.isActive = true;
							}
							else {
								child.node.isActive = false;
								//child.node.hide(0)
							}
						})
					}
					dataItem.dispatchVisibility(true);
				}
				else {
					if (children) {
						children.each((child) => {
							if (child.parentLink) {
								child.parentLink.hide();
							}
							child.node.isActive = false;
							child.node.interactionsEnabled = false;

							child.node.hide();
						})
					}
					dataItem.dispatchVisibility(false);
				}
			}
		}

		this.updateSimulation();
	}

	/**
	 * @ignore
	 * @todo description
	 */
	protected updateSimulation() {
		let dataItem = this.dataItem;
		if (dataItem && dataItem.component) {
			dataItem.component.restartSimulation();
		}
	}

	/**
	 * If set to `true` (default) toggling a node on will automatically expand
	 * all nodes across the whole tree (all levels) of its descendants.
	 *
	 * Setting to `false` will only expand immediate children (one level).
	 * 
	 * @default true
	 * @since 4.4.8
	 * @param  value  Expand all?
	 */
	public set expandAll(value: boolean) {
		this.setPropertyValue("expandAll", value);
	}

	/**
	 * @return Expand all?
	 */
	public get expandAll(): boolean {
		return this.getPropertyValue("expandAll");
	}

	/**
	 * Creates a new link between two nodes.
	 *
	 * Use this method to dynamically add links without requiring to revalidate
	 * whole of the data.
	 * 
	 * @since 4.4.8
	 * @param   node      Target node
	 * @param   strength  Link strength
	 * @return            New link
	 */
	public linkWith(node: ForceDirectedNode, strength?: number): ForceDirectedLink {
		let link = this.linksWith.getKey(node.uid);
		if (!link) {
			link = node.linksWith.getKey(this.uid);
		}

		if (!link) {
			let dataItem = this.dataItem;
			let component = dataItem.component;
			link = component.links.create();
			link.parent = component;
			link.zIndex = -1;
			link.source = this;
			link.target = node;
			link.stroke = dataItem.node.fill;

			link.dataItem = node.dataItem;

			if ($type.isNumber(strength)) {
				link.strength = strength;
			}

			let nodeIndex = component.nodes.indexOf(dataItem.node);
			let childIndex = component.nodes.indexOf(node);

			component.forceLinks.push({ source: nodeIndex, target: childIndex });
			component.updateNodeList();

			dataItem.childLinks.push(link);

			this.linksWith.setKey(node.uid, link);
		}
		return link;
	}

	/**
	 * Removes a link between two nodes.
	 * 
	 * @since 4.4.8
	 * @param  node  Target node
	 */
	public unlinkWith(node: ForceDirectedNode) {
		this.linksWith.removeKey(node.uid);
	}

	/**
	 * Padding of the nodes, in pixels.
	 * 
	 * @since 4.6.7
	 * @default 0
	 * @param  value  padding radius
	 */
	public set paddingRadius(value: number) {
		this.setPropertyValue("paddingRadius", value);
	}

	/** 
	 * @return Padding radius
	 */
	public get paddingRadius(): number {
		return this.getPropertyValue("paddingRadius");
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ForceDirectedNode"] = ForceDirectedNode;