/**
 * Functionality for drawing paths.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Sprite, AMEvent, ISpriteEvents } from "../../core/Sprite";
import { InterfaceColorSet } from "../../core/utils/InterfaceColorSet";
import { registry } from "../../core/Registry";
import { percent } from "../../core/utils/Percent";
import * as $utils from "../../core/utils/Utils";
import { getInteraction, IInteractionEvents } from "../../core/interaction/Interaction";
import { Polyspline } from "../../core/elements/Polyspline";
import { IPoint } from "../../core/defs/IPoint";
import { Orientation } from "../../core/defs/Orientation";
import { Optional } from "../../core/utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[FreeDraw]].
 */
export interface IFreeDrawProperties extends IContainerProperties {

}

/**
 * Defines events for [[FreeDraw]].
 */
export interface IFreeDrawEvents extends IContainerEvents { }

/**
 * Defines adapters for [[FreeDraw]].
 *
 * @see {@link Adapter}
 */
export interface IFreeDrawAdapters extends IContainerAdapters, IFreeDrawProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * FreeDraw class is capable of drawing a simple rectangular button with
 * optionally rounded corners and an icon in it.
 *
 * @see {@link IFreeDrawEvents} for a list of available events
 * @see {@link IFreeDrawAdapters} for a list of available Adapters
 */
export class FreeDraw extends Container {

	/**
	 * Defines available properties.
	 */
	public _properties!: IFreeDrawProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IFreeDrawAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IFreeDrawEvents;

	public splines: Polyspline[] = [];

	public currentSpline: Polyspline;

	public currentPoints: IPoint[];

	public isDrawing: boolean = false;

	protected _direction: Optional<Orientation>;

	protected _prevPoint: Optional<IPoint>;


	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "FreeDraw";

		this.width = percent(100);
		this.height = percent(100);
		this.isMeasured = false;

		this.background.fillOpacity = 0;

		const interaction = getInteraction();

		this.strokeOpacity = 1;
		this.strokeWidth = 1;
		this.stroke = new InterfaceColorSet().getFor("stroke");

		this.events.on("down", this.handleDrawStart, this, false);
		this._disposers.push(interaction.body.events.on("up", this.handleDrawEnd, this));
		this._disposers.push(interaction.body.events.on("track", this.handleDraw, this));
		this._disposers.push(interaction.body.events.on("keyup", this.handleKeyUp, this));

		// Apply theme
		this.applyTheme();
	}

	public handleKeyUp(): void {
		this._direction = undefined;
	}

	public handleDraw(event: IInteractionEvents["track"]): void {
		if (this.isDrawing) {
			let point = $utils.documentPointToSprite(event.pointer.point, this);

			if (event.event.shiftKey) {
				if (this._direction == undefined) {
					if (this._prevPoint) {
						if (Math.abs(this._prevPoint.x - point.x) > Math.abs(this._prevPoint.y - point.y)) {
							this._direction = "horizontal";
						}
						else {
							this._direction = "vertical";
						}
					}
				}

				if (this._prevPoint) {
					if (this._direction == "horizontal") {
						point.y = this._prevPoint.y;
					}
					else if (this._direction == "vertical") {
						point.x = this._prevPoint.x;
					}
				}
			}
			else {
				this._direction = undefined;
			}

			this.currentPoints.push(point);
			this.currentSpline.segments = [this.currentPoints];
			this._prevPoint = point;
		}
	}

	public handleDrawStart(event?: AMEvent<Sprite, ISpriteEvents>["down"]): void {
		this.isDrawing = true;
		this._direction = undefined;

		if (event.event.shiftKey) {
			let point = $utils.documentPointToSprite(event.pointer.point, this);
			if (!this.currentPoints) {
				this.currentPoints = [];
			}
			if (!this.currentSpline) {
				this.currentSpline = this.createChild(Polyspline);
			}

			this.currentPoints.push(point);
			this.currentSpline.segments = [this.currentPoints];
		}
		else {
			this.currentSpline = this.createChild(Polyspline);
			this.currentPoints = [];
			this.splines.push(this.currentSpline);
		}

		this.currentSpline.tensionX = 1;
		this.currentSpline.tensionY = 1;

		this._prevPoint = undefined;
	}

	public handleDrawEnd(event: IInteractionEvents["up"]): void {
		this.isDrawing = false;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["FreeDraw"] = FreeDraw;
