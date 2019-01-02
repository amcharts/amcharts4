/**
 * Functionality for drawing paths.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../core/Container";
import { Sprite, SpriteEventDispatcher, AMEvent, ISpriteEvents } from "../core/Sprite";
import { SpriteShiftEvent } from "../core/SpriteEvents";
import { IDisposer } from "../core/utils/Disposer";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import { registry } from "../core/Registry";
import { percent, Percent } from "../core/utils/Percent";
import * as $type from "../core/utils/Type";
import * as $utils from "../core/utils/Utils";
import { Rectangle } from "../core/elements/Rectangle";
import { getInteraction, IInteractionEvents } from "../core/interaction/Interaction";
import { IPoint } from "../core/defs/IPoint";
import { Optional } from "../core/utils/Type";

/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Resize]].
 */
export interface IResizeProperties extends IContainerProperties {

}

/**
 * Defines events for [[Resize]].
 */
export interface IResizeEvents extends IContainerEvents { }

/**
 * Defines adapters for [[Resize]].
 *
 * @see {@link Adapter}
 */
export interface IResizeAdapters extends IContainerAdapters, IResizeProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Resize class is capable of drawing a simple rectangular button with
 * optionally rounded corners and an icon in it.
 *
 * @see {@link IResizeEvents} for a list of available events
 * @see {@link IResizeAdapters} for a list of available Adapters
 */
export class Resize extends Container {

	/**
	 * Defines available properties.
	 *
	 * @type {IResizeProperties}
	 */
	public _properties!: IResizeProperties;

	/**
	 * Defines available adapters.
	 *
	 * @type {IResizeAdapters}
	 */
	public _adapter!: IResizeAdapters;

	/**
	 * Defines available events.
	 *
	 * @type {IResizeEvents}
	 */
	public _events!: IResizeEvents;


	public isResizing: boolean = false;

	public _sprite: Sprite;

	protected _changeDisposer: IDisposer;

	public tlGrip: Rectangle;
	public trGrip: Rectangle;
	public blGrip: Rectangle;
	public brGrip: Rectangle;

	public constrainProportions: boolean = false;

	public rectangle: Rectangle;

	/**
	 * Constructor
	 */
	constructor() {

		// Init
		super();
		this.className = "Resize";

		this.isMeasured = false;

		const interaction = getInteraction();

		let color = new InterfaceColorSet().getFor("alternativeBackground");

		let rectangle = this.createChild(Rectangle);

		rectangle.strokeOpacity = 1;
		rectangle.strokeWidth = 1;
		rectangle.strokeDasharray = "2,2";
		rectangle.fillOpacity = 0;
		rectangle.stroke = color;
		this.rectangle = rectangle;

		let tlGrip = this.createChild(Rectangle);
		tlGrip.width = 10;
		tlGrip.height = 10;
		tlGrip.fill = color;
		tlGrip.verticalCenter = "middle";
		tlGrip.horizontalCenter = "middle";
		tlGrip.draggable = true;
		this.tlGrip = tlGrip;
		
		tlGrip.events.on("drag", this.handleGrips, this, true);

		this.trGrip = tlGrip.clone();
		this.trGrip.parent = this;

		this.brGrip = tlGrip.clone();
		this.brGrip.parent = this;

		this.blGrip = tlGrip.clone();
		this.blGrip.parent = this;

		// Apply theme
		this.applyTheme();
	}

	public set sprite(sprite: Optional<Sprite>) {
		this._sprite = sprite;
		if (sprite) {
			this.toFront();
			this.visible = true;
			this.updatePosition();
			this._changeDisposer = sprite.events.on("transformed", this.updatePosition, this, false);
		}
		else {
			this.visible = false;
		}
	}

	public get sprite(): Optional<Sprite> {
		return this._sprite;
	}

	public updatePosition() {
		let sprite = this._sprite;
		if (sprite) {

			let w = sprite.measuredWidth;
			let h = sprite.measuredHeight;

			this.rectangle.width = w;
			this.rectangle.height = h;
			this.rectangle.x = 0;
			this.rectangle.y = 0;

			let point = $utils.spritePointToSprite({ x: sprite.pixelX + sprite.maxLeft, y: sprite.pixelY + sprite.maxTop }, sprite.parent, this.parent);
			this.x = point.x;
			this.y = point.y;
			
			this.tlGrip.x = 0;
			this.tlGrip.y = 0;

			this.trGrip.x = w;
			this.trGrip.y = 0;
			
			this.brGrip.x = w;
			this.brGrip.y = h;

			this.blGrip.x = 0;
			this.blGrip.y = h;
		}
	}

	protected handleGrips(event: AMEvent<Sprite, ISpriteEvents>["drag"]) {

		let grip = event.target;

		let tlGrip = this.tlGrip;
		let trGrip = this.trGrip;
		let blGrip = this.blGrip;
		let brGrip = this.brGrip;		

		if(grip == tlGrip){
			blGrip.x = grip.x;
			trGrip.y = grip.y;
		}
		else if(grip == blGrip){
			tlGrip.x = grip.x;
			brGrip.y = grip.y;
		}		
		else if(grip == trGrip){
			brGrip.x = grip.x;
			tlGrip.y = grip.y;
		}
		else if(grip == brGrip){
			trGrip.x = grip.x;
			blGrip.y = grip.y;
		}

		let rectangle = this.rectangle;

		rectangle.x = Math.min(tlGrip.pixelX, trGrip.pixelX, blGrip.pixelX, brGrip.pixelX);
		rectangle.y = Math.min(tlGrip.pixelY, trGrip.pixelY, blGrip.pixelY, brGrip.pixelY);

		rectangle.width = Math.max(tlGrip.pixelX, trGrip.pixelX, blGrip.pixelX, brGrip.pixelX) - rectangle.pixelX;
		rectangle.height = Math.max(tlGrip.pixelY, trGrip.pixelY, blGrip.pixelY, brGrip.pixelY) - rectangle.pixelY;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Resize"] = Resize;
