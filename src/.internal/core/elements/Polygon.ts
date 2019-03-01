/**
 * Polygon module.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters, ISpriteEvents } from "../Sprite";
import { IPoint } from "../defs/IPoint";
import { Morpher } from "../utils/Morpher";
import { IMorphable } from "../defs/IMorphable";
import { registry } from "../Registry";
import * as $path from "../rendering/Path";
import * as $type from "../utils/Type";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines properties for [[Polygon]].
 */
export interface IPolygonProperties extends ISpriteProperties {

	/**
	 * An array of X/Y coordinates for each elbow of the polygon.
	 */
	points?: IPoint[][][];

}

/**
 * Defines events for [[Polygon]].
 */
export interface IPolygonEvents extends ISpriteEvents { }

/**
 * Defines adapters for [[Polygon]].
 *
 * @see {@link Adapter}
 */
export interface IPolygonAdapters extends ISpriteAdapters, IPolygonProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Draws a polygon.
 *
 * @see {@link IPolygonEvents} for a list of available events
 * @see {@link IPolygonAdapters} for a list of available Adapters
 */
export class Polygon extends Sprite implements IMorphable {

	/**
	 * Defines available properties.
	 */
	public _properties!: IPolygonProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IPolygonAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IPolygonEvents;

	/**
	 * A morpher instance that is used to morph polygon into some other shape.
	 */
	protected _morpher: $type.Optional<Morpher>;

	/**
	 * Current points that morpher uses. This is needed so that we don't
	 * overwrite polygons original points.
	 */
	protected _currentPoints: IPoint[][][];

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "Polygon";
		this.element = this.paper.add("path");
		this.shapeRendering = "auto";
		this._currentPoints = [];
		this.applyTheme();
	}

	/**
	 * An array of X/Y coordinates for each elbow of the polygon.
	 *
	 * @todo Example
	 * @param points  Polygon points
	 */
	public set points(points: IPoint[][][]) {
		this.setPropertyValue("points", points, true);
		this._currentPoints = this.points;
	}

	/**
	 * @return Polygon points
	 */
	public get points(): IPoint[][][] {
		return this.getPropertyValue("points");
	}

	/**
	 * Current points. Used when morphing the element, so that original `points`
	 * are not overwritten.
	 *
	 * @param points  Polygon points
	 */
	public set currentPoints(points: IPoint[][][]) {
		if (this._currentPoints != points) {
			this._currentPoints = points;
			this.draw();
		}
	}

	/**
	 * @return Polygon points
	 */
	public get currentPoints(): IPoint[][][] {
		return this._currentPoints;
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		let path: string = "";
		let points: IPoint[][][] = this._currentPoints;

		let left: $type.Optional<number>;
		let right: $type.Optional<number>;
		let top: $type.Optional<number>;
		let bottom: $type.Optional<number>;

		if (points.length > 0) {
			// separate areas
			for (let i = 0, len = points.length; i < len; i++) {
				// surface
				let surface: IPoint[] = points[i][0];
				let hole: IPoint[] = points[i][1];

				if (surface && surface.length > 0) {
					let point: IPoint = surface[0];

					path += $path.moveTo(point);

					for (let s: number = 0; s < surface.length; s++) {
						point = surface[s];
						path += $path.lineTo(point);

						if (!$type.isNumber(right) || (right < point.x)) {
							right = point.x;
						}
						if (!$type.isNumber(left) || (left > point.x)) {
							left = point.x;
						}

						if (!$type.isNumber(top) || (top > point.y)) {
							top = point.y;
						}
						if (!$type.isNumber(bottom) || (bottom < point.y)) {
							bottom = point.y;
						}
					}
				}
				// hole
				if (hole && hole.length > 0) {
					let point: IPoint = hole[0];
					path += $path.moveTo(point);

					for (let h = 0, hlen = hole.length; h < hlen; h++) {
						point = hole[h];
						path += $path.lineTo(point);
					}
				}
			}
			if (path) {
				path += $path.closePath();
			}

			this.bbox.x = left;
			this.bbox.y = top;
			this.bbox.width = right - left;
			this.bbox.height = bottom - top;
		}

		this.path = path;
	}

	/**
	 * Measures element
	 */
	protected measureElement(): void {

		// Overriding to avoid extra measurement.

	}

	/**
	 * A calculated center point for the shape.
	 *
	 * @readonly
	 * @return Center
	 */
	public get centerPoint(): IPoint {
		return { x: this.bbox.x + this.bbox.width / 2, y: this.bbox.y + this.bbox.height / 2 };
	}

	/**
	 * A [[Morpher]] instance that is used to morph polygon into some other
	 * shape.
	 *
	 * @readonly
	 * @return Morpher instance
	 */
	public get morpher(): Morpher {
		if (!this._morpher) {
			this._morpher = new Morpher(this);
			this._disposers.push(this._morpher);
		}
		return this._morpher;
	}

}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["Polygon"] = Polygon;
