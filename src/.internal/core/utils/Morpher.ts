/**
 * Morpher module contains functionality that allows morphing one polygon to
 * another.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { BaseObject } from "../Base";
import { IPoint } from "../defs/IPoint";
import { IRectangle } from "../defs/IRectangle";
import { IMorphable } from "../defs/IMorphable";
import { IAnimatable, Animation, AnimationDisposer } from "../utils/Animation";
import * as $math from "../utils/Math";
import * as $ease from "../utils/Ease";
import * as $type from "../utils/Type";


/**
 * Morpher can be used to morph one polygon to some other polygon.
 */
export class Morpher extends BaseObject implements IAnimatable {

	/**
	 * An element that will be a subject for morphing.
	 */
	public morphable: IMorphable;

	/**
	 * [_morphFromPointsReal description]
	 *
	 * @todo Description
	 */
	protected _morphFromPointsReal: $type.Optional<Array<Array<Array<IPoint>>>>;

	/**
	 * [_morphToPointsReal description]
	 *
	 * @todo Description
	 */
	protected _morphToPointsReal: $type.Optional<Array<Array<Array<IPoint>>>>;

	/**
	 * [_morphToPoints description]
	 *
	 * @todo Description
	 */
	protected _morphToPoints: $type.Optional<Array<Array<Array<IPoint>>>>;

	/**
	 * Morph progress (0-1)
	 */
	protected _morphProgress: $type.Optional<number>;

	/**
	 * List of animations currently running.
	 */
	protected _animations: $type.Optional<Array<Animation>>;

	/**
	 * A storage for measurements.
	 */
	protected _bboxes: IRectangle[] = [];

	/**
	 * Duration of the morphing animation in milliseconds.
	 */
	public morphDuration: number = 800;

	/**
	 * An easing function to use for morphing animation.
	 *
	 * @see {@link Ease}
	 */
	public morphEasing: (value: number) => number = $ease.cubicOut;

	/**
	 * If set to `true`, all separate parts of the multi-part polygon will
	 * morph into a single circle or polygon when using built-in methods
	 * `morphToCircle()` or `morphToPolygon()`.
	 *
	 * Otherwise each separate part of polygon will morph to individual target
	 * circle or polgyon.
	 */
	public morphToSingle: boolean = true;

	/**
	 * A ratio to scale morphed object in relation to the source object.
	 */
	public scaleRatio: number = 1;

	/**
	 * Constructor.
	 *
	 * @param morphable An object to morph
	 */
	constructor(morphable: IMorphable) {
		super();
		this.className = "Morpher";
		this.morphable = morphable;
		this.applyTheme();
	}

	/**
	 * Morphs a polygon to another polygon.
	 *
	 * @param toPoints  Corner points of the target shape
	 * @param duration  Duration in milliseconds
	 * @param easing    Easing function
	 * @return Animation
	 */
	public morphToPolygon(toPoints: Array<Array<Array<IPoint>>>, duration?: number, easing?: (value: number) => number): Animation {
		let points: Array<Array<Array<IPoint>>> = this.morphable.currentPoints;
		if(points && toPoints){
			this.sortPoints(points);
			this.sortPoints(toPoints);

			this._morphFromPointsReal = [];
			this._morphToPointsReal = [];

			if (!$type.hasValue(duration)) {
				duration = this.morphDuration;
			}

			if (!$type.hasValue(easing)) {
				easing = this.morphEasing;
			}

			this._morphFromPointsReal = this.normalizePoints(toPoints, points);
			this._morphToPointsReal = this.normalizePoints(points, toPoints);

			this.morphable.currentPoints = this._morphFromPointsReal;

			let animation = new Animation(this, { property: "morphProgress", from: 0, to: 1 }, duration, easing);
			this._disposers.push(animation);
			animation.start()
			return animation;
		}
	}

	/**
	 * [normalizePoints description]
	 *
	 * @ignore Exclude from docs
	 * @todo Description
	 * @param pointsA  Point A
	 * @param pointsB  Point B
	 * @return Normalized points
	 */
	public normalizePoints(pointsA: Array<Array<Array<IPoint>>>, pointsB: Array<Array<Array<IPoint>>>): Array<Array<Array<IPoint>>> {
		for (let i = 0, len = pointsA.length; i < len; i++) {
			let surfaceA: Array<IPoint> = pointsA[i][0];

			let holeA: Array<IPoint> = pointsA[i][1];
			let bboxA: IRectangle = $type.getValue($math.getBBox(surfaceA));

			let middleX = bboxA.x + bboxA.width;
			let middleY = bboxA.y + bboxA.height;

			// check if we have the same in PointsB
			if (!pointsB[i]) {
				pointsB[i] = [];
			}

			// check if we have surface in pointsB
			if (surfaceA && !pointsB[i][0]) {
				pointsB[i][0] = [{ x: middleX, y: middleY }, { x: middleX, y: middleY }];
			}

			if (pointsB[i][0]) {
				pointsB[i][0] = this.addPoints(pointsB[i][0], surfaceA.length);

				let distance = Infinity;
				let splitAt = 0;

				for (let a = 0; a < pointsB[i][0].length; a++) {
					let newDistance = $math.getDistance(pointsB[i][0][a], surfaceA[0]);
					if (newDistance < distance) {
						splitAt = a;
						distance = newDistance;
					}
				}

				let partA = pointsB[i][0].slice(0, splitAt);
				let partB = pointsB[i][0].slice(splitAt);
				pointsB[i][0] = partB.concat(partA);

			}

			if (holeA) {
				if (!pointsB[i][1]) {
					pointsB[i][1] = [{ x: middleX, y: middleY }, { x: middleX, y: middleY }];
				}
				pointsB[i][1] = this.addPoints(pointsB[i][1], holeA.length);
			}
		}

		return pointsB;
	}

	/**
	 * [sortPoints description]
	 *
	 * @ignore Exclude from doc
	 * @todo Description
	 * @param points  [description]
	 * @return                        common bbox of points
	 */
	public sortPoints(points: Array<Array<Array<IPoint>>>): $type.Optional<IRectangle> {
		points.sort(function(a, b) {
			let bbox1: IRectangle = $type.getValue($math.getBBox(a[0]));
			let bbox2: IRectangle = $type.getValue($math.getBBox(b[0]));

			if (bbox1.width * bbox1.height > bbox2.width * bbox2.height) {
				return -1;
			}
			else {
				return 1;
			}
		});

		let bboxes: IRectangle[] = [];
		for (let i = 0, len = points.length; i < len; i++) {
			let surface: IPoint[] = points[i][0];
			if (surface) {
				bboxes.push($type.getValue($math.getBBox(surface)));
			}
		}

		return $math.getCommonRectangle(bboxes);
	}

	/**
	 * Morphs polygon to a circle (it is actually a polygon which makes a circle).
	 *
	 * @param radius    Target circle radius (px)
	 * @param duration  Duration (ms)
	 * @param easing    Easing function
	 * @return Animation
	 */
	public morphToCircle(radius?: number, duration?: number, easing?: (value: number) => number): Animation {
		let points: Array<Array<Array<IPoint>>> = this.morphable.points;

		let commonBBox = this.sortPoints(points);

		this._morphFromPointsReal = [];
		this._morphToPointsReal = [];

		if (!$type.hasValue(duration)) {
			duration = this.morphDuration;
		}

		if (!$type.hasValue(easing)) {
			easing = this.morphEasing;
		}

		// surface
		for (let i = 0, len = points.length; i < len; i++) {
			let surface: IPoint[] = points[i][0];
			let hole: IPoint[] = points[i][1];

			this._morphFromPointsReal[i] = [];
			this._morphToPointsReal[i] = [];

			if (surface) {

				let toPoints: IPoint[] = surface;
				let fromPoints: IPoint[] = surface;
				let bbox: IRectangle = $type.getValue($math.getBBox(fromPoints)) // this._bboxes[i];

				if (this.morphToSingle) {
					bbox = $type.getValue(commonBBox);
				}

				let middleX: number = bbox.x + bbox.width / 2;
				let middleY: number = bbox.y + bbox.height / 2;
				let realRadius: $type.Optional<number> = radius;
				if (!$type.isNumber(realRadius)) {
					realRadius = Math.min(bbox.width / 2, bbox.height / 2);
				}

				toPoints = [];

				// find angle for the first point
				let startAngle: number = $math.getAngle({ x: middleX, y: middleY }, surface[0]);
				let count: number = 100;

				if (surface.length > count) {
					count = surface.length;
				}

				fromPoints = this.addPoints(surface, count);
				count = fromPoints.length; // add Points might increase number a bit

				let angle: number = 360 / (count - 1);

				for (let a: number = 0; a < count; a++) {
					let realAngle: number = angle * a + startAngle;
					let pointOnCircle: IPoint = { x: middleX + realRadius * $math.cos(realAngle), y: middleY + realRadius * $math.sin(realAngle) };
					toPoints[a] = pointOnCircle;
				}

				if (hole && hole.length > 0) {
					for (let i = 0, hlen = hole.length; i < hlen; i++) {
						toPoints.push({ x: middleX, y: middleY });
					}
				}

				this._morphFromPointsReal[i][0] = fromPoints;
				this._morphToPointsReal[i][0] = toPoints;
			}
		}

		this.morphable.currentPoints = this._morphFromPointsReal;

		let animation = new Animation(this, { property: "morphProgress", from: 0, to: 1 }, duration, easing);
		this._disposers.push(animation);
		animation.start()
		return animation;
	}

	/**
	 * [addPoints description]
	 *
	 * @ignore Exclude from doc
	 * @todo Description
	 * @param points         [description]
	 * @param mustHaveCount  [description]
	 * @return [description]
	 */
	public addPoints(points: IPoint[], mustHaveCount: number): IPoint[] {
		let addToSegmentCount: number = Math.round(mustHaveCount / points.length);
		let newPoints: IPoint[] = [];
		for (let i = 0, len = points.length; i < len; i++) {
			let point0: IPoint = points[i];
			let point1: IPoint;
			if (i == points.length - 1) {
				point1 = points[0];
			}
			else {
				point1 = points[i + 1];
			}

			newPoints.push(point0);

			for (let p: number = 1; p < addToSegmentCount; p++) {
				let percent: number = p / addToSegmentCount;
				let extraPoint: IPoint = { x: point0.x + (point1.x - point0.x) * percent, y: point0.y + (point1.y - point0.y) * percent }
				newPoints.push(extraPoint);
			}

			// stop adding in case we already added more than left in original
			if (newPoints.length + points.length - i == mustHaveCount) {
				addToSegmentCount = 0;
			}
		}

		if (newPoints.length < mustHaveCount && points.length > 0) {
			let lastPoint: IPoint = points[points.length - 1];
			for (let p: number = newPoints.length; p < mustHaveCount; p++) {
				// add same as last
				newPoints.push({ x: lastPoint.x, y: lastPoint.y });
			}
		}

		return newPoints;
	}

	/**
	 * Morphs polygon into a rectangular polygon.
	 *
	 * @param width     Width of the target rectangle (px)
	 * @param height    Height of the target rectangle (px)
	 * @param duration  Duration (ms)
	 * @param easing    Easing function
	 * @return Animation
	 */
	public morphToRectangle(width?: number, height?: number, duration?: number, easing?: (value: number) => number): Animation {
		let points: Array<Array<Array<IPoint>>> = this.morphable.points;

		this.sortPoints(points);

		this._morphFromPointsReal = [];
		this._morphToPointsReal = [];

		if (!$type.hasValue(duration)) {
			duration = this.morphDuration;
		}

		if (!$type.hasValue(easing)) {
			easing = this.morphEasing;
		}

		//		let biggestBBox: IRectangle = this._bboxes[this._biggestIndex];

		// surface
		for (let i = 0, len = points.length; i < len; i++) {
			let surface: IPoint[] = points[i][0];
			let hole: IPoint[] = points[i][1];

			this._morphFromPointsReal[i] = [];
			this._morphToPointsReal[i] = [];

			if (surface) {

				let toPoints: IPoint[] = surface;
				let fromPoints: IPoint[] = surface;
				let bbox: IRectangle = this._bboxes[i];


				// we only work with first area. TODO: maybe we should find the biggest one?
				if (this.morphToSingle) {
					//if (i != this._biggestIndex) {
					//	bbox = { x: biggestBBox.x + biggestBBox.width / 2, y: biggestBBox.y + biggestBBox.height / 2, width: 0, height: 0 };
					//}
				}

				let x: number = bbox.x;
				let y: number = bbox.y;

				let realWidth: $type.Optional<number> = width;
				let realHeight: $type.Optional<number> = height;

				if (!$type.isNumber(realWidth)) {
					realWidth = bbox.width;
				}
				if (!$type.isNumber(realHeight)) {
					realHeight = bbox.height;
				}

				toPoints = [{ x: x, y: y }, { x: x + realWidth, y: y }, { x: x + realWidth, y: y + realHeight }, { x: x, y: y + realHeight }];
				toPoints = this.addPoints(toPoints, surface.length);

				// if polygon has less points then count, add
				if (surface.length < 4) {
					for (let i = surface.length; i < 4; i++) {
						toPoints.push({ x: surface[i].x, y: surface[i].y });
					}
				}
				if (hole && hole.length > 0) {
					let middleX: number = bbox.x + bbox.width / 2;
					let middleY: number = bbox.y + bbox.height / 2;

					for (let i = 0, hlen = hole.length; i < hlen; i++) {
						toPoints.push({ x: middleX, y: middleY });
					}
				}

				this._morphFromPointsReal[i][0] = fromPoints;
				this._morphToPointsReal[i][0] = toPoints;
			}
		}

		this.morphable.currentPoints = this._morphFromPointsReal;

		let animation = new Animation(this, { property: "morphProgress", from: 0, to: 1 }, duration, easing);
		this._disposers.push(animation);
		animation.start()
		return animation;
	}

	/**
	 * Progress of the morph transition.
	 *
	 * Setting this will also trigger actual transformation.
	 *
	 * @param value  Progress (0-1)
	 */
	public set morphProgress(value: $type.Optional<number>) {
		this._morphProgress = value;

		let currentPoints: Array<Array<Array<IPoint>>> = [];

		if (value != null) {
			let fromPoints: $type.Optional<Array<Array<Array<IPoint>>>> = this._morphFromPointsReal;
			let toPoints: $type.Optional<Array<Array<Array<IPoint>>>> = this._morphToPointsReal;

			if (fromPoints != null && toPoints != null) {

				for (let i = 0, len = fromPoints.length; i < len; i++) {

					let currentArea: Array<Array<IPoint>> = [];
					currentPoints.push(currentArea);

					let surfaceFrom: IPoint[] = fromPoints[i][0];
					let holeFrom: IPoint[] = fromPoints[i][1];

					let surfaceTo: IPoint[] = toPoints[i][0];
					let holeTo: IPoint[] = toPoints[i][1];

					if (surfaceFrom && surfaceFrom.length > 0 && surfaceTo && surfaceTo.length > 0) {

						let currentSurface: IPoint[] = [];

						for (let i = 0, slen = surfaceFrom.length; i < slen; i++) {
							let point0: IPoint = surfaceFrom[i];
							let point1: IPoint = surfaceTo[i];

							let currentPoint: IPoint = { x: point0.x + (point1.x * this.scaleRatio - point0.x) * value, y: point0.y + (point1.y * this.scaleRatio - point0.y) * value }

							currentSurface.push(currentPoint);
						}
						currentArea[0] = currentSurface;
					}
					if (holeFrom && holeFrom.length > 0 && holeTo && holeTo.length > 0) {
						let currentHole: IPoint[] = [];
						for (let i = 0, hlen = holeFrom.length; i < hlen; i++) {
							let point0: IPoint = holeFrom[i];
							let point1: IPoint = holeTo[i];

							let currentPoint: IPoint = { x: point0.x + (point1.x * this.scaleRatio - point0.x) * value, y: point0.y + (point1.y * this.scaleRatio - point0.y) * value }

							currentHole.push(currentPoint);
						}
						currentArea[1] = currentHole;
					}
				}
			}
		}

		this.morphable.currentPoints = currentPoints;
	}

	/**
	 * Returns the progress of morph transition.
	 *
	 * @return Progress (0-1)
	 */
	public get morphProgress(): $type.Optional<number> {
		return this._morphProgress;
	}

	/**
	 * Restores the polygon to its original appearance.
	 *
	 * @param duration  Duration (ms)
	 * @param easing    Easing function
	 * @return Animation
	 */
	public morphBack(duration?: number, easing?: (value: number) => number): Animation {
		this._morphToPointsReal = this._morphFromPointsReal;
		this._morphFromPointsReal = this.morphable.currentPoints;

		if (!$type.hasValue(duration)) {
			duration = this.morphDuration;
		}

		if (!$type.hasValue(easing)) {
			easing = this.morphEasing;
		}

		let animation = new Animation(this, { property: "morphProgress", from: 0, to: 1 }, duration, easing);
		this._disposers.push(animation);
		animation.start()
		return animation;
	}

	/**
	 * Returns a list of morph animations currently being played.
	 *
	 * @return List of animations
	 */
	public get animations(): Array<Animation> {
		if (!this._animations) {
			this._animations = [];
			this._disposers.push(new AnimationDisposer(this._animations));
		}
		return this._animations;
	}

}
