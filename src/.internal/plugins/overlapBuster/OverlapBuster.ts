/**
 * Plugin which enables automatically exploding overlapping elements.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Plugin } from "../../core/utils/Plugin";
import { List } from "../../core/utils/List";
import * as $array from "../../core/utils/Array";
//import * as $math from "../../core/utils/Math";
import * as d3force from "d3-force";
import { Dictionary } from "../../core/utils/Dictionary";
import { Disposer, MultiDisposer, IDisposer } from "../../core/utils/Disposer";
import { Sprite } from "../../core/Sprite";
import { Optional } from "../../core/utils/Type";
import { ISpriteEvents, AMEvent } from "../../core/SpriteEvents";
import { registry } from "../../core/Registry";


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * @ignore
 */
export interface IOverlapBusterTarget {
	target: Sprite,
	originalX: number,
	originalY: number
}


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * A plugin which automatically groups [[PercenSeries]] slices that are smaller
 * than certain percent into one "Other" slice.
 *
 * By pushing an instance of [[Annnotation]] into `plugin` list of
 * any [[Chart]], it automatically applies the functionality.
 *
 * Example:
 *
 * ```TypeScript
 * let overlap = chart.plugins.push(new am4plugins_overlapBuster.OverlapBuster());
 * overlap.targets.push(bullet);
 * ```
 * ```JavaScript
 * let overlap = chart.plugins.push(new am4plugins_overlapBuster.OverlapBuster());
 * overlap.targets.push(bullet);
 * ```
 * ```JSON
 * // this plugin does not support JSON config
 * ```
 *
 * @since 4.6.2
 * @see {@link https://www.amcharts.com/docs/v4/tutorials/plugin-overlap-buster/} for more information and usage instructions
 */
export class OverlapBuster extends Plugin {

	/**
	 * Overlap check targets.
	 */
	private _targets: List<Sprite>;

	/**
	 * List of elements that have been misplaced temporarily.
	 */
	private _shiftedTargets: Dictionary<string, IOverlapBusterTarget>;

	/**
	 * An object which is current center of the exploded cluster.
	 */
	private _centerTarget: Optional<Sprite>;

	/**
	 * How much of the obstructed object should be arevealed approximately.
	 *
	 * The number is relative (0-1). With `0` meaning the objstructed objects
	 * won't be moved at all, `0.5` (default) will make at least half of the
	 * object show up, and `1` to reveal object whole.
	 * 
	 * @default 0.7
	 */
	public revealRatio: number = 0.7;

	/**
	 * A delay in milliseconds to postpone collapse of expanded items once
	 * they are unhovered.
	 *
	 * @default 500
	 */
	public collapseDelay: number = 500;

	/**
	 * How big an area to check for overlapping elements should be checked in
	 * relation to hovered items size.
	 *
	 * `1` (one) means it will affect only elements that are at least partially
	 * overlapping with the target element.
	 *
	 * `2` (two) will check area twice as big.
	 *
	 * Etc.
	 *
	 * @default 2
	 */
	public tolerance: number = 2;

	/**
	 * Timeout reference.
	 */
	private _collapseTimeout: IDisposer;

	/**
	 * A reference to the `d3.Simulation` instance for fine-grained configuration
	 * of node gravitational dynamics.
	 *
	 * @see {@link https://github.com/d3/d3-force#simulation} For more info
	 */
	public d3forceSimulation: d3force.Simulation<{}, d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>>;

	/**
	 * List of affected nodes.
	 */
	protected _nodes: any[];

	/**
	 * Constructor
	 */
	constructor() {
		// Nothing to do here
		super();

		// Create simulation
		this.d3forceSimulation = d3force.forceSimulation();

		// Init shifted targets list
		this._shiftedTargets = new Dictionary<string, IOverlapBusterTarget>();
		this._disposers.push(new Disposer(() => this._shiftedTargets));

		// Create list
		this._targets = new List<Sprite>();
		this._disposers.push(new Disposer(() => this.targets));

		// Events
		this._targets.events.on("inserted", (ev) => {

			// Set up hover events
			this._disposers.push(new MultiDisposer([
				ev.newValue.events.on("over", this.handleHover, this),
				ev.newValue.events.on("out", this.handleOut, this)
			]));

			// We need this in order to auto-register clones of the template
			if (ev.newValue.isTemplate) {
				this._disposers.push(
					ev.newValue.events.once("ready", this.register, this)
				);
			}
		});

	}

	/**
	 * Initializes plugin.
	 */
	public init() {
		super.init();
	}

	/**
	 * A list of objects to check for overlapping.
	 *
	 * If you push a list template into this, e.g. bullet from a series, all
	 * elements created from that templat will automatically end up in this list.
	 * 
	 * @return List of target objects
	 */
	public get targets(): List<Sprite> {
		return this._targets;
	}

	/**
	 * Handles hover event on a target element.
	 * 
	 * @param  ev  Event
	 */
	private handleHover(ev: AMEvent<Sprite, ISpriteEvents>["over"]): void {
		let mainTarget = ev.target;


		// Collapse currently exploded items
		if (this._centerTarget) {

			if (this._centerTarget === mainTarget) {
				// Same item. Do nothing.
				this.cancelCollapse();
				return;
			}

			if (this._shiftedTargets.hasKey(mainTarget.uid)) {
				// Currently expanded item.
				// Clear collapse timeout which probably is already ticking after
				// hovering out of the previous center.
				this.cancelCollapse();
				return;
			}

			// Some totally different cluster was hovered.
			// Initiate immediate collapse of currently exploded cluster.
			this.collapseCurrent();

		}

		// Set up simulation
		//let w = $math.max(50, this.target.innerWidth);
		//let h = $math.max(50, this.target.innerHeight);
		let d3forceSimulation = this.d3forceSimulation;
		if (d3forceSimulation) {
			// Assemble ojects
			let nodes: any[] = [];
			this._nodes = nodes;
			this._targets.each((target) => {
				if (this.hitTest(mainTarget, target)) {
					let x = target.pixelX;
					let y = target.pixelY;

					nodes.push({
						radius: Math.max(target.measuredWidth, target.measuredHeight) / 2 * this.revealRatio,
						target: target,
						x: x,
						y: y,
						ox: x,
						oy: y
					});

					// Log shifted
					this._shiftedTargets.setKey(target.uid, {
						target: target,
						originalX: target.dx,
						originalY: target.dy
					});
					this.stopAnimation(target);
				}
			});

			this.d3forceSimulation = d3force.forceSimulation(nodes)
				.force('collision', d3force.forceCollide().radius(function(d) {
					return (<any>d).radius;
				}))
				.on("tick", () => {
					$array.each(nodes, (node) => {
						// node.target.dx = node.target.pixelX - node.x;
						// node.target.dy = node.target.pixelY - node.y;
						node.target.dx = node.x - node.ox;
						node.target.dy = node.y - node.oy;
					});
				});
		}

		// Set center
		this._centerTarget = mainTarget;

	}

	/**
	 * Handles out event on a target element.
	 * 
	 * @param  ev  Event
	 */
	private handleOut(ev: AMEvent<Sprite, ISpriteEvents>["out"]): void {

		// Dispose old timeout if necessary
		this.cancelCollapse();

		// Delay collapse
		this._collapseTimeout = this.target.setTimeout(() => {
			this.collapseCurrent();
		}, this.collapseDelay + 10);

	}

	/**
	 * Stops object's animations.
	 * @param  target  Target
	 */
	private stopAnimation(target: Sprite): void {
		if (target.isInTransition()) {
			let animation =  target.animations.pop();
			while(animation) {
				animation.kill();
				animation = target.animations.pop();
			}
		}
	}

	/**
	 * Collapses currently expanded cluster of objects.
	 */
	private collapseCurrent(): void {
		// Stop all directed force simulations
		this.d3forceSimulation.force("collision", null);
		this.d3forceSimulation.stop();

		// Animate elements back to their original positions
		$array.each(this._nodes, (node) => {
			node.target.animate(
				[
					{ property: "dx", to: 0 },
					{ property: "dy", to: 0 }
				],
				this.target.defaultState.transitionDuration
			);
		});

		// Reset center
		this._centerTarget = undefined;

		// Clear the list
		this._shiftedTargets.clear();
	}

	/**
	 * Cancels the collapse timeout.
	 */
	private cancelCollapse(): void {
		if (this._collapseTimeout) {
			this._collapseTimeout.dispose();
		}
	}

	/**
	 * Registers new element.
	 * 
	 * @param  ev  Event
	 */
	private register(ev: AMEvent<Sprite, ISpriteEvents>["ready"]): void {
		if (this._targets.indexOf(ev.target) == -1) {
			this._targets.push(ev.target);
		}
	}

	/**
	 * Checks if the this element has any of its parts overlapping with another
	 * element.
	 *
	 * @todo Description (review)
	 * @param sprite  Second element to test again
	 * @return Overlapping?
	 */
		public hitTest(target: Sprite, sprite: Sprite): boolean {
			// validate, otherwise we will not know measuredWidth and measuredHeight
			if (target.invalid) {
				target.validate();
			}
			if (target.invalid) {
				target.validate();
			}

			let ax1 = target.pixelX;
			let ay1 = target.pixelY;
			let ax2 = ax1 + target.measuredWidth * this.tolerance;
			let ay2 = ay1 + target.measuredHeight * this.tolerance;

			let bx1 = sprite.pixelX;
			let by1 = sprite.pixelY;
			let bx2 = bx1 + sprite.measuredWidth * this.tolerance;
			let by2 = by1 + sprite.measuredHeight * this.tolerance;

			return !(bx1 > ax2 || bx2 < ax1 || by1 > ay2 || by2 < ay1);
		}


}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["OverlapBuster"] = OverlapBuster;
