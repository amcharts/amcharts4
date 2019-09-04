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
	points?: Array<Array<Array<IPoint>>>;

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
	protected _currentPoints: Array<Array<Array<IPoint>>>;

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
	public set points(points: Array<Array<Array<IPoint>>>) {
		this.setPropertyValue("points", points, true);
		this._currentPoints = points;
	}

	/**
	 * @return Polygon points
	 */
	public get points(): Array<Array<Array<IPoint>>> {
		let points = this.getPropertyValue("points");
		let path = this.path;

		if (path && (!points || points.length == 0)) {

			let valueStr = path.slice(1, path.length - 1);

			let segments: string[] = valueStr.split("ZM");

			for (let s = 0; s < segments.length; s++) {
				let segment = segments[s];
				if (segment.length > 0) {
					let areaHole = segment.split("M");

					let areaArr = areaHole[0];
					let holeArr = areaHole[1];

					if (areaArr && areaArr.length > 0) {

						let pointsArr = areaArr.split("L");
						if (pointsArr.length > 0) {

							let area: IPoint[] = [];

							let areaAndHole: Array<Array<IPoint>> = [area];
							points.push(areaAndHole);

							for (let p = 0; p < pointsArr.length; p++) {
								let coords = pointsArr[p].split(",");
								area.push({ x: +coords[0], y: +coords[1] });
							}

							if (holeArr && holeArr.length > 0) {
								let pointsArr = holeArr.split("L");
								if (pointsArr.length > 0) {
									let hole: IPoint[] = [];
									areaAndHole.push(hole);
									for (let p = pointsArr.length - 1; p >= 0; p--) {
										let coords = pointsArr[p].split(",");
										hole.push({ x: +coords[0], y: +coords[1] });
									}
								}
							}
						}
					}
				}
			}

			this.setPropertyValue("points", points);
			this._currentPoints = points;
		}
		return points;
	}

	/**
	 * Current points. Used when morphing the element, so that original `points`
	 * are not overwritten.
	 *
	 * @param points  Polygon points
	 */
	public set currentPoints(points: Array<Array<Array<IPoint>>>) {
		if (this._currentPoints != points) {
			this._currentPoints = points;
			this.draw();
		}
	}

	/**
	 * @return Polygon points
	 */
	public get currentPoints(): Array<Array<Array<IPoint>>> {
		if((!this._currentPoints || this._currentPoints.length == 0) && this.path){
			this._currentPoints = this.points;
		}
		return this._currentPoints;
	}

	/**
	 * Draws the element.
	 *
	 * @ignore Exclude from docs
	 */
	public draw(): void {
		let path: string = "";
		let points: Array<Array<Array<IPoint>>> = this._currentPoints;

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

			super.setPath(path);
		}
	}

	/**
	 * @ignore
	 */
	protected setPath(value: string): boolean {
		if (super.setPath(value)) {
			this.points = [];
			this._bbox = this.group.getBBox();
			return true;
		}
		return false;
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
