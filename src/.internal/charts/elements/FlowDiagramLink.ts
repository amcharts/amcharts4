/**
 * FlowDiagramLink module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../../core/Sprite";
import { Container, IContainerProperties, IContainerEvents, IContainerAdapters } from "../../core/Container";
import { FlowDiagramDataItem } from "../types/FlowDiagram";
import { LinearGradient } from "../../core/rendering/fills/LinearGradient";
import { RadialGradient } from "../../core/rendering/fills/RadialGradient";
import { Pattern } from "../../core/rendering/fills/Pattern";
import { registry } from "../../core/Registry";
import { Bullet } from "../elements/Bullet";
import { Color } from "../../core/utils/Color";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { Polyline } from "../../core/elements/Polyline";
import { Line } from "../../core/elements/Line";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import * as $iter from "../../core/utils/Iterator";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[FlowDiagramLink]].
 */
export interface IFlowDiagramLinkProperties extends IContainerProperties {

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
	 * [startAngle description]
	 *
	 * @todo Description
	 */
	startAngle?: number;

	/**
	 * [endAngle description]
	 *
	 * @todo Description
	 */
	endAngle?: number;

	/**
	 * Should link be filled with a solid color, color of from node, color of toNode or gradient between node colors.
	 */
	colorMode?: "solid" | "gradient" | "fromNode" | "toNode";

	/**
	 * [controlPointDistance description]
	 *
	 * @todo Description
	 */
	controlPointDistance?: number;

	/**
	 * [maskBullets description]
	 *
	 * @todo Description
	 */
	maskBullets?: boolean;

	/**
	 * [tooltipLocation description]
	 *
	 * @todo Description
	 */
	tooltipLocation?: number;
}

/**
 * Defines events for [[FlowDiagramLink]].
 */
export interface IFlowDiagramLinkEvents extends IContainerEvents { }

/**
 * Defines adapters for [[FlowDiagramLink]].
 *
 * @see {@link Adapter}
 */
export interface IFlowDiagramLinkAdapters extends IContainerAdapters, IFlowDiagramLinkProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * This class creates a link (waved color-filled line) between two nodes in a
 * Flow Diagram.
 *
 * @see {@link IFlowDiagramLinkEvents} for a list of available events
 * @see {@link IFlowDiagramLinkAdapters} for a list of available Adapters
 * @important
 */
export class FlowDiagramLink extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IFlowDiagramLinkProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IFlowDiagramLinkAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IFlowDiagramLinkEvents;

	/**
	 * Defines a type of data item used by this class.
	 */
	public _dataItem: FlowDiagramDataItem;

	/**
	 * A gradiend instance that is used to provided colored gradient fills for
	 * the Flow link.
	 */
	protected _gradient: LinearGradient;


	/**
	 * List of bullets
	 * @ignore
	 */
	protected _bullets: ListTemplate<Bullet>;

	/**
	 * Link sprite
	 */
	public link: Sprite;

	/**
	 * Bullets mask spite
     */
	protected _bulletsMask: Sprite;

	/**
	 * Bullets container
     */
	protected _bulletsContainer: Container;

	/**
	 * Spline which goes through the middle of a link, used to calculate bullet and tooltip positions, invisible by default
     */
	public middleLine: Line | Polyline;


	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "FlowDiagramLink";

		let interfaceColors = new InterfaceColorSet();

		this.maskBullets = false;

		this.colorMode = "fromNode";

		this.layout = "none";
		this.isMeasured = false;

		this.startAngle = 0;
		this.endAngle = 0;

		this.strokeOpacity = 0;

		// this is very important, otherwise the container will be shifted
		this.verticalCenter = "none";
		this.horizontalCenter = "none";

		this.tooltipText = "{fromName}→{toName}:{value.value}";
		this.tooltipLocation = 0.5;

		this.link = this.createChild(Sprite);
		this.link.shouldClone = false;
		this.link.setElement(this.paper.add("path"));
		this.link.isMeasured = false;
		this.fillOpacity = 0.2;
		this.fill = interfaceColors.getFor("alternativeBackground");

		this.applyTheme();
	}

	/**
	 * Positions bullets
	 * @ignore
	 */
	protected positionBullets() {
		$iter.each(this.bullets.iterator(), (bullet) => {
			bullet.parent = this.bulletsContainer;

			bullet.maxWidth = this.maxWidth;
			bullet.maxHeight = this.maxHeight;

			this.positionBullet(bullet);
		})
	}

	/**
	 * Bullets container
     */
	public get bulletsContainer() {
		if (!this._bulletsContainer) {
			let bulletsContainer = this.createChild(Container);
			bulletsContainer.shouldClone = false;
			bulletsContainer.layout = "none";
			this._bulletsContainer = bulletsContainer;
		}
		return this._bulletsContainer;
	}


	/**
	 * Bullets mask sprite
     */
	public get bulletsMask() {
		if (!this._bulletsMask) {
			let bulletsMask = this.createChild(Sprite);
			bulletsMask.shouldClone = false;
			bulletsMask.setElement(this.paper.add("path"));
			bulletsMask.isMeasured = false;
			this._bulletsMask = bulletsMask;
		}
		return this._bulletsMask;
	}

	/**
	 * Positions bullets at relative bullet.locationX position on the link.
	 * @ignore
	 */
	protected positionBullet(bullet: Bullet) {

		let location = bullet.locationX;

		if (!$type.isNumber(location)) {
			location = bullet.locationY;
		}

		if (!$type.isNumber(location)) {
			location = 0.5;
		}
		let point = this.middleLine.positionToPoint(location);

		bullet.moveTo(point);

		let rotationField = bullet.propertyFields.rotation;
		let angle: number;
		if (bullet.dataItem) {
			let dataContext: any = bullet.dataItem.dataContext;
			angle = dataContext[rotationField];
		}
		if (!$type.isNumber(angle)) {
			angle = point.angle;
		}

		bullet.rotation = angle;
	}

	/**
	 * [startAngle description]
	 *
	 * @todo Description
	 * @param value  Start angle
	 */
	public set startAngle(value: number) {
		this.setPropertyValue("startAngle", value, true);
	}

	/**
	 * @return Start angle
	 */
	public get startAngle(): number {
		return this.getPropertyValue("startAngle");
	}

	/**
	 * [endAngle description]
	 *
	 * @todo Description
	 * @param value  End angle
	 */
	public set endAngle(value: number) {
		this.setPropertyValue("endAngle", value, true);
	}

	/**
	 * @return End angle
	 */
	public get endAngle(): number {
		return this.getPropertyValue("endAngle");
	}


	/**
	 * Should link be filled with a solid color, color of from node, color of toNode or gradient between node colors.
	 * Some of the links, like ChordLink does not support gradiens well.
	 *
	 * @param value  Fill mode
	 */
	public set colorMode(value: "solid" | "gradient" | "fromNode" | "toNode") {
		if (value == "gradient") {
			let color = this.fill;

			this.gradient.stops.clear();
			if (color instanceof Color) {
				this.gradient.addColor(color);
				this.gradient.addColor(color);
			}
			this.fill = this.gradient;
			this.stroke = this.gradient;
		}
		this.setPropertyValue("colorMode", value, true);
	}

	/**
	 * Fill mode
	 */
	public get colorMode(): "solid" | "gradient" | "fromNode" | "toNode" {
		return this.getPropertyValue("colorMode");
	}


	/**
	 * Should link bullets be masked or not
	 *
	 * @param value
	 * @default false
	 */
	public set maskBullets(value: boolean) {
		this.setPropertyValue("maskBullets", value, true);
	}

	/**
	 * @return mask bullets value
	 */
	public get maskBullets(): boolean {
		return this.getPropertyValue("maskBullets");
	}

	/**
	 * Relative location of a tooltip.
	 * @default 0.5
	 *
	 * @param value
	 */
	public set tooltipLocation(value: number) {
		this.setPropertyValue("tooltipLocation", value, true);
	}

	/**
	 * Tooltip location value
	 */
	public get tooltipLocation(): number {
		return this.getPropertyValue("tooltipLocation");
	}

	/**
	 * Adds color steps in the link gradient.
	 *
	 * @param value  Fill option
	 */
	protected setFill(value: Color | Pattern | LinearGradient | RadialGradient) {
		super.setFill(value)
		let gradient = this._gradient;

		if (gradient && value instanceof Color) {
			gradient.stops.clear();
			gradient.addColor(value);
			gradient.addColor(value);
		}
	}

	/**
	 * Updates bounding box based on element dimension settings.
	 *
	 * @ignore Exclude from docs
	 */
	public measureElement(): void {

	}


	/**
	 * List of bullets
	 *
	 * @return [description]
	 */
	public get bullets(): ListTemplate<Bullet> {
		if (!this._bullets) {
			this._bullets = new ListTemplate<Bullet>(new Bullet());
			this._disposers.push(new ListDisposer(this._bullets));
			this._disposers.push(this._bullets.template);
			this._bullets.events.on("inserted", (event) => {
				event.newValue.events.on("propertychanged", (event) => {
					if (event.property == "locationX" || event.property == "locationY") {
						this.positionBullet(event.target);
					}
				}, undefined, false)
			}, undefined, false)
		}
		return this._bullets;
	}


	/**
	 * Copies properties from another [[FlowDiagramLink]].
	 *
	 * @param source  Source link
	 */
	copyFrom(source: this) {
		super.copyFrom(source);
		this.bullets.copyFrom(source.bullets);
		let middleLine = this.middleLine;
		if (middleLine) {
			if (middleLine instanceof Line && source.middleLine instanceof Line) {
				middleLine.copyFrom(source.middleLine);
			}

			if (middleLine instanceof Polyline && source.middleLine instanceof Polyline) {
				middleLine.copyFrom(source.middleLine);
			}
		}

		this.link.copyFrom(source.link);
	}

	/**
	 * @ignore Exclude from docs
	 * @return Tooltip X (px)
	 */
	public getTooltipX(): number {
		if (this.middleLine) {
			return this.middleLine.positionToPoint(this.tooltipLocation).x;
		}
	}

	/**
	 * @ignore Exclude from docs
	 * @return Tooltip Y (px)
	 */
	public getTooltipY(): number {
		if (this.middleLine) {
			return this.middleLine.positionToPoint(this.tooltipLocation).y;
		}
	}

	/**
	 * A gradiend instance that is used to provided colored gradient fills for
	 * the Flow link.
	 */
	public get gradient() {
		if (!this._gradient) {
			this._gradient = new LinearGradient();
		}
		return this._gradient;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FlowDiagramLink"] = FlowDiagramLink;
