/**
 * Bullet module
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Bullet, IBulletProperties, IBulletAdapters, IBulletEvents } from "./Bullet";
import { Sprite } from "../../core/Sprite";
import { registry } from "../../core/Registry";
import * as $path from "../../core/rendering/Path";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Bullet]]
 */
export interface IErrorBulletProperties extends IBulletProperties { }

/**
 * Defines events for [[Bullet]]
 */
export interface IErrorBulletEvents extends IBulletEvents { }

/**
 * Defines adapters
 * Includes both the [[Adapter]] definitions and properties
 * @see {@link Adapter}
 */
export interface IErrorBulletAdapters extends IBulletAdapters, IErrorBulletProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Creates a bullet with a textual label.
 *
 * Uses [[Label]] instance to draw the label, so the label itself is
 * configurable.
 *
 * @see {@link IBulletEvents} for a list of available events
 * @see {@link IBulletAdapters} for a list of available Adapters
 * @todo Usage example
 * @important
 */
export class ErrorBullet extends Bullet {

	/**
	 * Defines available properties.
	 */
	public _properties!: IErrorBulletProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IErrorBulletAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IErrorBulletEvents;

	public errorLine:Sprite;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "ErrorBullet";
		this.errorLine = this.createChild(Sprite);
		this.errorLine.shouldClone = false;
		this.width = 20;
		this.height = 20;
		this.strokeOpacity = 1;
		this.isDynamic = true;
	}


	validatePosition(){
		super.validatePosition();
		let w = this.pixelWidth / 2;
		let h = this.pixelHeight / 2;

		this.errorLine.path = $path.moveTo({x:-w, y:-h}) + $path.lineTo({x:w, y:-h}) + $path.moveTo({x:0, y:-h}) + $path.lineTo({x:0, y:h}) + $path.moveTo({x:-w, y:h}) + $path.lineTo({x:w, y:h});
	}

	/**
	 * Copies all proprities and related stuff from another instance of
	 * [[ErrorBullet]].
	 *
	 * @param source  Source element
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.errorLine.copyFrom(source.errorLine);
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ErrorBullet"] = ErrorBullet;
