/**
 * ChordLink module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { ChordDiagramDataItem } from "../types/ChordDiagram";
import { FlowDiagramLink, IFlowDiagramLinkAdapters, IFlowDiagramLinkEvents, IFlowDiagramLinkProperties } from "./FlowDiagramLink";
import { registry } from "../../core/Registry";
import { QuadraticCurve } from "../../core/elements/QuadraticCurve";
import * as $math from "../../core/utils/Math";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[ChordLink]].
 */
export interface IChordLinkProperties extends IFlowDiagramLinkProperties {

	/**
	 * [radius description]
	 *
	 * @todo Description
	 */
	radius?: number;


	/**
	 * [arc description]
	 *
	 * @todo Description
	 */
	arc?: number;
}

/**
 * Defines events for [[ChordLink]].
 */
export interface IChordLinkEvents extends IFlowDiagramLinkEvents { }

/**
 * Defines adapters for [[ChordLink]].
 *
 * @see {@link Adapter}
 */
export interface IChordLinkAdapters extends IFlowDiagramLinkAdapters, IChordLinkProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Chord Diagram.
 *
 * @see {@link IChordLinkEvents} for a list of available events
 * @see {@link IChordLinkAdapters} for a list of available Adapters
 * @important
 */
export class ChordLink extends FlowDiagramLink {

	/**
	 * Defines available properties.
	 */
	public _properties!: IChordLinkProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IChordLinkAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IChordLinkEvents;

	/**
	 * Defines a type of data item used by this class.
	 */
	public _dataItem: ChordDiagramDataItem;

	/**
	 * Spline which goes through the middle of a link, used to calculate bullet and tooltip positions, invisible by default
     */
	public middleLine: QuadraticCurve;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ChordLink";

		this.middleLine = this.createChild(QuadraticCurve);
		this.middleLine.shouldClone = false;
		this.middleLine.strokeOpacity = 0;

		this.applyTheme();
	}

	/**
	 * (Re)validates (redraws) the link.
	 *
	 * @ignore Exclude from docs
	 */
	public validate() {
		super.validate();

		if (!this.isTemplate) {
			let startAngle = this.startAngle;
			let endAngle = this.endAngle;

			let arc = this.arc;
			let radius = this.radius;

			let fromNode = this.dataItem.fromNode;
			let toNode = this.dataItem.toNode;

			let fromX = 0;
			let fromY = 0;

			if (fromNode) {
				fromX = fromNode.pixelX + fromNode.dx;
				fromY = fromNode.pixelY + fromNode.dy;
			}

			let toX = 0;
			let toY = 0;

			if (toNode) {
				toX = toNode.pixelX + toNode.dx;
				toY = toNode.pixelY + toNode.dy;
			}

			if (radius > 0) {
				let x1 = radius * $math.cos(startAngle) + fromX;
				let y1 = radius * $math.sin(startAngle) + fromY;
				let x2 = radius * $math.cos(endAngle) + toX;
				let y2 = radius * $math.sin(endAngle) + toY;

				//let cpAngle = startAngle + arc + (endAngle - startAngle - arc) / 2;
				//let arcWidth = $math.getDistance({x:x1, y:y1}, {x:x4, y:y4});

				//let cpx = (arcWidth) * $math.cos(cpAngle);
				//let cpy = (arcWidth) * $math.sin(cpAngle);

				let cp = { x: 0, y: 0 };
				let path = $path.moveTo({ x: x1, y: y1 });

				path += $path.arcTo(startAngle, arc, radius);
				path += $path.quadraticCurveTo({ x: x2, y: y2 }, cp);
				path += $path.arcTo(endAngle, arc, radius);
				path += $path.quadraticCurveTo({ x: x1, y: y1 }, cp);

				if (arc > 0) {
					this.link.path = path;
				}
				else {
					this.link.path = "";
				}

				if (this.maskBullets) {
					this.bulletsMask.path = path;
					this.bulletsContainer.mask = this.bulletsMask;
				}

				let mAngle1 = startAngle + arc / 2;
				let mAngle2 = endAngle + arc / 2;

				let middleLine = this.middleLine;

				middleLine.x1 = radius * $math.cos(mAngle1) + fromX;
				middleLine.y1 = radius * $math.sin(mAngle1) + fromY;
				middleLine.x2 = radius * $math.cos(mAngle2) + toX;
				middleLine.y2 = radius * $math.sin(mAngle2) + toY;

				middleLine.cpx = 0;
				middleLine.cpy = 0;

				middleLine.stroke = this.fill;

				this.positionBullets();
			}
		}
	}
	/**
	 * [radius description]
	 *
	 * @todo Description
	 * @param value End Y
	 */
	public set radius(value: number) {
		this.setPropertyValue("radius", value, true);
	}

	/**
	 * @return End Y
	 */
	public get radius(): number {
		return this.getPropertyValue("radius");
	}

	/**
	 * [arc description]
	 *
	 * @todo Description
	 * @param value [description]
	 */
	public set arc(value: number) {
		this.setPropertyValue("arc", value, true);
	}

	/**
	 * @return [description]
	 */
	public get arc(): number {
		return this.getPropertyValue("arc");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ChordLink"] = ChordLink;
