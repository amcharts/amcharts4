/**
 * ForceDirectedLink module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../../core/Sprite";
import { registry } from "../../core/Registry";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { ForceDirectedNode } from "./ForceDirectedNode";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[ForceDirectedLink]].
 */
export interface IForceDirectedLinkProperties extends ISpriteProperties {

	/**
	 * Distance between centers of source and target nodes.
	 */
	distance?: number;

	/**
	 * Strength of the "traction" between source and target nodes.
	 */
	strength?: number;

}

/**
 * Defines events for [[ForceDirectedLink]].
 */
export interface IForceDirectedLinkEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[ForceDirectedLink]].
 *
 * @see {@link Adapter}
 */
export interface IForceDirectedLinkAdapters extends ISpriteAdapters, IForceDirectedLinkProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A class that builds links between [[ForceDirectedNode]] elements.
 *
 * @see {@link IForceDirectedLinkEvents} for a list of available events
 * @see {@link IForceDirectedLinkAdapters} for a list of available Adapters
 * @since 4.3.8
 * @important
 */
export class ForceDirectedLink extends Sprite {

	/**
	 * Defines available properties.
	 */
	public _properties!: IForceDirectedLinkProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IForceDirectedLinkAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IForceDirectedLinkEvents;

	/**
	 * Link source node
	 */
	protected _source: ForceDirectedNode;

	/**
	 * Link parent node
	 */
	protected _target: ForceDirectedNode;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ForceDirectedLink";

		let interfaceColors = new InterfaceColorSet();

		this.fillOpacity = 0;
		this.strokeOpacity = 0.5;
		this.stroke = interfaceColors.getFor("grid");
		this.isMeasured = false;
		this.nonScalingStroke = true;

		this.interactionsEnabled = false;

		this.distance = 1.5;
		this.strength = 1;

		this.applyTheme();
	}

	/**
	 * Validates element:
	 * * Triggers events
	 * * Redraws the element
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {
		super.validate();
		let source = this.source;
		let target = this.target;
		if (source && target) {
			this.path = $path.moveTo({ x: source.pixelX, y: source.pixelY }) + $path.lineTo({ x: target.pixelX, y: target.pixelY });

			if (source.isHidden || target.isHidden || source.isHiding || target.isHiding) {
				this.hide();
			}
			else {
				this.show()
			}
		}

	}

	/**
	 * Source node - a node link starts from.
	 * 
	 * @param  value  Source node
	 */
	public set source(value: ForceDirectedNode) {
		if (value) {
			this._source = value;
			this._disposers.push(value.events.on("positionchanged", this.invalidate, this, false));
		}
	}

	/**
	 * @return Source node
	 */
	public get source(): ForceDirectedNode {
		return this._source;
	}

	/**
	 * Target node - a node link ends at.
	 * 
	 * @param  value  Target node
	 */
	public set target(value: ForceDirectedNode) {
		if (value) {
			this._target = value;
			this._disposers.push(value.events.on("positionchanged", this.invalidate, this, false));
		}
	}

	/**
	 * @return Target node
	 */
	public get target(): ForceDirectedNode {
		return this._target;
	}

	/**
	 * Distance between centers of source and target nodes.
	 *
	 * This is relative to the radii to sum of both source and target nodes.
	 *
	 * E.g. if this would be set to `1` both nodes would be touching each other.
	 *
	 * @default 1.5
	 * @param  value  Distance
	 */
	public set distance(value: number) {
		this.setPropertyValue("distance", value);
	}

	/**
	 * @return Distance
	 */
	public get distance(): number {
		if (this._adapterO) {
			if (this._adapterO.isEnabled("distance")) {
				return this._adapterO.apply("distance", this.properties.distance);
			}
		}
		return this.properties.distance;
	}

	/**
	 * Relative "strength" of the traction between linked nodes.
	 *
	 * Available values: 0 to XX.
	 *
	 * The bigger the number, the more rigid the link and the less it will
	 * stretch when node is dragged.
	 *
	 * Carefully with very big numbers: nodes and links might start behaving
	 * quite "nerviously".
	 *
	 * @default 1
	 * @param  value  Strength
	 */
	public set strength(value: number) {
		this.setPropertyValue("strength", value);
	}

	/**
	 * @return Strength
	 */
	public get strength(): number {
		if (this._adapterO) {
			if (this._adapterO.isEnabled("strength")) {
				return this._adapterO.apply("strength", this.properties.strength);
			}
		}
		return this.properties.strength;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ForceDirectedLink"] = ForceDirectedLink;
