/**
 * Functionality for drawing bullets with basic shapes.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite } from "../../core/Sprite";
import { Bullet, IBulletProperties, IBulletAdapters, IBulletEvents } from "../../charts/elements/Bullet";
import { Rectangle } from "../../core/elements/Rectangle";
import { Circle } from "../../core/elements/Circle";
import { Triangle } from "../../core/elements/Triangle";
import { registry } from "../../core/Registry";
import * as $type from "../../core/utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[ShapeBullet]].
 */
export interface IShapeBulletProperties extends IBulletProperties {

	/**
	 * Size (width and height in pixels) of the bullet. The actual shapes will be
	 * sized and positioned to fit this pixel value.
	 *
	 * @default 10
	 */
	size?: number;

	/**
	 * Shape of the bullet.
	 */
	shape?: BulletShapes;

}

/**
 * Defines events for [[ShapeBullet]].
 */
export interface IShapeBulletEvents extends IBulletEvents { }

/**
 * Defines adapters for [[ShapeBullet]].
 *
 * @see {@link Adapter}
 */
export interface IShapeBulletAdapters extends IBulletAdapters, IShapeBulletProperties { }

/**
 * Defines available shapes for a [[ShapeBullet]].
 */
export type BulletShapes = "square" | "diamond" | "circle" | "up" | "down" | "left" | "right";


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Used to draw a ShapeBullet shape.
 *
 * @since 4.9.34
 * @see {@link https://www.amcharts.com/docs/v4/tutorials/plugin-bullets/} for usage instructions.
 * @see {@link IShapeBulletEvents} for a list of available events
 * @see {@link IShapeBulletAdapters} for a list of available Adapters
 */
export class ShapeBullet extends Bullet {

	/**
	 * Defines available properties.
	 */
	public _properties!: IShapeBulletProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IShapeBulletAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IShapeBulletEvents;

	/**
	 * An actual element comprising the shape.
	 *
	 * The type of the element will depend on the `shape` setting. It could be
	 * a `Circle`, `Rectangle`, or `Triangle`.
	 */
	public shapeElement: Sprite;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "ShapeBullet";
		this.size = 10;
		this.applyTheme();
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		super.draw();

		if (this.shapeElement) {
			this.shapeElement.dispose();
		}

		switch (this.shape) {
			case "square":
				this.createSquare();
				break;
			case "diamond":
				this.createSquare(45);
				break;
			case "circle":
				this.createCircle();
				break;
			case "up":
				this.createTriangle();
				break;
			case "right":
				this.createTriangle(90);
				break;
			case "down":
				this.createTriangle(180);
				break;
			case "left":
				this.createTriangle(270);
				break;
		}

		// todo
	}

	/**
	 * Decorates the shape so it is positioned properly.
	 */
	private processShape(): void {
		this.shapeElement.horizontalCenter = "middle";
		this.shapeElement.verticalCenter = "middle";
	}

	/**
	 * Creates a square shape.
	 */
	private createSquare(rotation: number = 0): void {
		const element = this.createChild(Rectangle);
		element.width = this.size;
		element.height = this.size;
		element.rotation = rotation;
		this.shapeElement = element;
		this.processShape();
	}

	/**
	 * Creates a circle shape.
	 */
	private createCircle(rotation: number = 0): void {
		const element = this.createChild(Circle);
		element.radius = this.size / 2;
		this.shapeElement = element;
		this.processShape();
	}

	/**
	 * Creates a triangle shape.
	 */
	private createTriangle(rotation: number = 0): void {
		const element = this.createChild(Triangle);
		element.width = this.size;
		element.height = this.size;
		element.rotation = rotation;
		this.shapeElement = element;
		this.processShape();
	}

	/**
	 * Shape of the bullet.
	 *
	 * Available options: `"square"`, `"diamond"`, `"circle"`, `"up"`, `"down"`,
	 * `"left"`, `"right"`.
	 *
	 * There is no default. If `shape` is not set, the bullets will come out
	 * empty.
	 *
	 * @param  value  Shape
	 */
	public set shape(value: BulletShapes) {
		if (this.setPropertyValue("shape", value, true)) {
			this.invalidate();
		}
	}

	/**
	 * @return shape scope
	 */
	public get shape(): BulletShapes {
		return this.getPropertyValue("shape");
	}

	/**
	 * Size (width and height in pixels) of the bullet. The actual shapes will be
	 * sized and positioned to fit this pixel value.
	 *
	 * @default 10
	 * @param value  Size (px)
	 */
	public set size(value: number) {
		if (this.setPropertyValue("size", value, true)) {
			this.width = value;
			this.height = value;
			this.invalidate();
		}
	}

	/**
	 * @return Size (px)
	 */
	public get size(): number {
		let size: number = this.getPropertyValue("size");
		if (!$type.isNumber(size)) {
			size = 0;
		}
		return size;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["ShapeBullet"] = ShapeBullet;