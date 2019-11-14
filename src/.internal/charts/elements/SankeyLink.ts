/**
 * SankeyLink module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { SankeyDiagramDataItem } from "../types/SankeyDiagram";
import { FlowDiagramLink, IFlowDiagramLinkAdapters, IFlowDiagramLinkEvents, IFlowDiagramLinkProperties } from "./FlowDiagramLink";
import { registry } from "../../core/Registry";
import { Polyspline } from "../../core/elements/Polyspline";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $math from "../../core/utils/Math";
import * as $type from "../../core/utils/Type";
import * as $smoothing from "../../core/rendering/Smoothing";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[SankeyLink]].
 */
export interface ISankeyLinkProperties extends IFlowDiagramLinkProperties {

	/**
	 * [tension description]
	 *
	 * @todo Description
	 */
	tension?: number;

	/**
	 * [startX description]
	 *
	 * @todo Description
	 */
	startX?: number;

	/**
	 * [startY description]
	 *
	 * @todo Description
	 */
	startY?: number;

	/**
	 * [endX description]
	 *
	 * @todo Description
	 */
	endX?: number;

	/**
	 * [endY description]
	 *
	 * @todo Description
	 */
	endY?: number;

	/**
	 * [linkWidth description]
	 *
	 * @todo Description
	 */
	linkWidth?: number;

	/**
	 * [controlPointDistance description]
	 *
	 * @todo Description
	 */
	controlPointDistance?: number;
}

/**
 * Defines events for [[SankeyLink]].
 */
export interface ISankeyLinkEvents extends IFlowDiagramLinkEvents { }

/**
 * Defines adapters for [[SankeyLink]].
 *
 * @see {@link Adapter}
 */
export interface ISankeyLinkAdapters extends IFlowDiagramLinkAdapters, ISankeyLinkProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Sankey Diagram.
 *
 * @see {@link ISankeyLinkEvents} for a list of available events
 * @see {@link ISankeyLinkAdapters} for a list of available Adapters
 * @important
 */
export class SankeyLink extends FlowDiagramLink {

	/**
	 * Defines available properties.
	 */
	public _properties!: ISankeyLinkProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: ISankeyLinkAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: ISankeyLinkEvents;

	/**
	 * Defines a type of data item used by this class.
	 */
	public _dataItem: SankeyDiagramDataItem;

	/**
	 * Spline which goes through the middle of a link, used to calculate bullet and tooltip positions, invisible by default
	 */
	public middleLine: Polyspline;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "SankeyLink";

		// TODO can this be removed ?
		new InterfaceColorSet();

		this.tension = 0.8;
		this.controlPointDistance = 0.2;

		this.startAngle = 0;
		this.endAngle = 0;

		this.linkWidth = 0;

		this.startX = 0;
		this.endX = 0;

		this.startY = 0;
		this.endY = 0;

		this.middleLine = this.createChild(Polyspline);
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

			let x0 = this.startX
			let y0 = this.startY;
			let x1 = this.endX;
			let y1 = this.endY;

			if (!$type.isNumber(x1)) {
				x1 = x0;
			}

			if (!$type.isNumber(y1)) {
				y1 = y0;
			}

			let startAngle = this.startAngle;
			let endAngle = this.endAngle;
			let w = this.linkWidth;

			let path = "";

			let xt0 = x0;
			let yt0 = y0;

			let xt1 = x1;
			let yt1 = y1;

			let xb0 = x0 + w * $math.sin(startAngle);
			let xb1 = x1 + w * $math.sin(endAngle);

			let yb0 = y0 + w * $math.cos(startAngle);
			let yb1 = y1 + w * $math.cos(endAngle);

			let xm0 = x0 + w / 2 * $math.sin(startAngle);
			let xm1 = x1 + w / 2 * $math.sin(endAngle);

			let ym0 = y0 + w / 2 * $math.cos(startAngle);
			let ym1 = y1 + w / 2 * $math.cos(endAngle);

			this.zIndex = this.zIndex || this.dataItem.index;

			let tensionX = this.tension + (1 - this.tension) * $math.sin(startAngle);
			let tensionY = this.tension + (1 - this.tension) * $math.cos(startAngle);

			this.middleLine.tensionX = tensionX;
			this.middleLine.tensionY = tensionY;

			if ($type.isNumber(w) && ($type.isNumber(x0) && $type.isNumber(x1) && $type.isNumber(y0) && $type.isNumber(y1))) {

				// solves issues with gradient fill of straight lines
				if ($math.round(xt0, 3) == $math.round(xt1, 3)) {
					xt1 += 0.01;
				}

				if ($math.round(yt0, 3) == $math.round(yt1, 3)) {
					yt1 += 0.01;
				}

				if ($math.round(xb0, 3) == $math.round(xb1, 3)) {
					xb1 += 0.01;
				}

				if ($math.round(yb0, 3) == $math.round(yb1, 3)) {
					yb1 += 0.01;
				}

				let minX = Math.min(xb0, xb1, xt0, xt1);
				let minY = Math.min(yb0, yb1, yt0, yt1);
				let maxX = Math.max(xb0, xb1, xt0, xt1);
				let maxY = Math.max(yb0, yb1, yt0, yt1);

				this._bbox = {
					x: minX,
					y: minY,
					width: maxX - minX,
					height: maxY - minY
				};

				let cpd = this.controlPointDistance;

				let kxt0 = xt0 + (xt1 - xt0) * cpd * $math.cos(startAngle);
				let kyt0 = yt0 + (yt1 - yt0) * cpd * $math.sin(startAngle);

				let kxt1 = xt1 - (xt1 - xt0) * cpd * $math.cos(endAngle);
				let kyt1 = yt1 - (yt1 - yt0) * cpd * $math.sin(endAngle);

				let kxm0 = xm0 + (xm1 - xm0) * cpd * $math.cos(startAngle);
				let kym0 = ym0 + (ym1 - ym0) * cpd * $math.sin(startAngle);

				let kxm1 = xm1 - (xm1 - xm0) * cpd * $math.cos(endAngle);
				let kym1 = ym1 - (ym1 - ym0) * cpd * $math.sin(endAngle);

				let angle = $math.getAngle({ x: kxt0, y: kyt0 }, { x: kxt1, y: kyt1 });

				let dx = (w / $math.cos(angle) - w) / $math.tan(angle) * $math.cos(startAngle);
				let dy = (w / $math.sin(angle) - w) * $math.tan(angle) * $math.sin(startAngle);

				let kxb0 = -dx / 2 + xb0 + (xb1 - xb0) * cpd * $math.cos(startAngle);
				let kyb0 = -dy / 2 + yb0 + (yb1 - yb0) * cpd * $math.sin(startAngle);

				let kxb1 = -dx / 2 + xb1 - (xb1 - xb0) * cpd * $math.cos(endAngle);
				let kyb1 = -dy / 2 + yb1 - (yb1 - yb0) * cpd * $math.sin(endAngle);


				this.middleLine.segments = [[{ x: xm0, y: ym0 }, { x: kxm0, y: kym0 }, { x: kxm1, y: kym1 }, { x: xm1, y: ym1 }]];

				kxt0 += dx / 2;
				kyt0 += dy / 2;

				kxt1 += dx / 2;
				kyt1 += dy / 2;

				path += $path.moveTo({ x: xt0, y: yt0 });
				path += new $smoothing.Tension(tensionX, tensionY).smooth([{ x: xt0, y: yt0 }, { x: kxt0, y: kyt0 }, { x: kxt1, y: kyt1 }, { x: xt1, y: yt1 }]);
				path += $path.lineTo({ x: xb1, y: yb1 });
				path += new $smoothing.Tension(tensionX, tensionY).smooth([{ x: xb1, y: yb1 }, { x: kxb1, y: kyb1 }, { x: kxb0, y: kyb0 }, { x: xb0, y: yb0 }]);
				path += $path.closePath();
			}

			this.link.path = path;

			if (this.maskBullets) {
				this.bulletsMask.path = path;
				this.bulletsContainer.mask = this.bulletsMask;
			}
			this.positionBullets();
		}
	}

	/**
	 * [startX description]
	 *
	 * @todo Description
	 * @param value  Start X
	 */
	public set startX(value: number) {
		this.setPropertyValue("startX", value, true);
	}

	/**
	 * @return Start X
	 */
	public get startX(): number {
		return this.getPropertyValue("startX");
	}

	/**
	 * [endX description]
	 *
	 * @todo Description
	 * @param value  End X
	 */
	public set endX(value: number) {
		this.setPropertyValue("endX", value, true);
	}

	/**
	 * @return End X
	 */
	public get endX(): number {
		return this.getPropertyValue("endX");
	}

	/**
	 * [startY description]
	 *
	 * @todo Description
	 * @param value  Start Y
	 */
	public set startY(value: number) {
		this.setPropertyValue("startY", value, true);
	}

	/**
	 * @return Start Y
	 */
	public get startY(): number {
		return this.getPropertyValue("startY");
	}

	/**
	 * [endY description]
	 *
	 * @todo Description
	 * @param value End Y
	 */
	public set endY(value: number) {
		this.setPropertyValue("endY", value, true);
	}

	/**
	 * @return End Y
	 */
	public get endY(): number {
		return this.getPropertyValue("endY");
	}

	/**
	 * [linkWidth description]
	 *
	 * @todo Description
	 * @param value [description]
	 */
	public set linkWidth(value: number) {
		this.setPropertyValue("linkWidth", value, true);
	}

	/**
	 * @return [description]
	 */
	public get linkWidth(): number {
		return this.getPropertyValue("linkWidth");
	}

	/**
	 * Distance of control point of a link, defines relative distance from a node at which linke should bend
	 * @default 0.2
	 * @param value
	 */
	public set controlPointDistance(value: number) {
		this.setPropertyValue("controlPointDistance", value, true);
	}

	/**
	 * @return relative control point distance
	 */
	public get controlPointDistance(): number {
		return this.getPropertyValue("controlPointDistance");
	}

	/**
	 * Tension of a spline, 1 would make the link to have sharp edges
	 * @default 0.8
	 * @param value
	 */
	public set tension(value: number) {
		this.setPropertyValue("tension", value, true);
	}

	/**
	 * @return tension value
	 */
	public get tension(): number {
		return this.getPropertyValue("tension");
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["SankeyLink"] = SankeyLink;
