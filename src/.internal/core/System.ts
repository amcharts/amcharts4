/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { registry } from "./Registry";
import { Sprite } from "./Sprite";
import { Container } from "./Container";
import { svgContainers, SVGContainer } from "./rendering/SVGContainer";
import { Component } from "./Component";
import { options } from "./Options";
import { Paper } from "./rendering/Paper";
import { raf } from "./utils/AsyncPending";
import { animations } from "./utils/Animation";
import { triggerIdle } from "./utils/AsyncPending";
import * as $dom from "./utils/DOM";
import * as $array from "./utils/Array";
import * as $type from "./utils/Type";


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * The main class that handles system-wide tasks, like caching, heartbeats, etc.
 * @important
 */
export class System {
	/**
	 * A flag indicating if the system is on pause.
	 *
	 * @type {boolean}
	 */
	protected _isPaused: boolean = false;

	/**
	 * Unique ID of the object.
	 *
	 * @type {string}
	 */
	public uid: string = registry.getUniqueId();

	/**
	 * amCharts Version.
	 *
	 * This follows npm's semver specification.
	 *
	 * @see {@link https://docs.npmjs.com/misc/semver}
	 * @type {string}
	 */
	static VERSION: string = "4.0.4";

	/**
	 * @todo Description
	 * @todo Needed?
	 * @ignore Exclude from docs
	 * @type {number}
	 */
	public dummyCounter: number = 0;

	/**
	 * @todo Description
	 * @ignore Exclude from docs
	 * @type {number}
	 */
	public time: number;


	protected _frameRequested: boolean = false;

	protected _updateStepDuration: number = 50;

	/**
	 * Performs initialization of the System object.
	 *
	 * Called when the first [[Sprite]] object is created.
	 *
	 * @ignore Exclude from docs
	 */
	public constructor() {
		this.time = Date.now();
	}

	/**
	 * Reports time elapsed since timer was reset.
	 *
	 * @ignore Exclude from docs
	 * @todo Needed?
	 * @param {string}   msg    Message to report in console
	 * @param {boolean}  reset  Reset time counter
	 */
	public reportTime(msg: string, reset?: boolean): void {
		if (this.dummyCounter < 6) {
			//console.log(Date.now() - this.time, msg, this.dummyCounter2);
		}
		if (reset) {
			this.time = Date.now();
		}
	}

	/**
	 * Performs "heartbeat" operations `frameRate` number of times per second.
	 *
	 * When the chart element is invalidated, it is not immediately redrawn.
	 *
	 * Instead it waits for the next `update()` cycle to be re-validated.
	 *
	 * @ignore Exclude from docs
	 * @todo Maybe should be private?
	 */
	public update(): void {

		if (this._isPaused) {
			return;
		}

		this._frameRequested = false;

		let time = Date.now();

		registry.dispatchImmediately("enterframe");

		//this.validateLayouts();
		//this.validatePositions();
		/*
				for (let key in registry.invalidLayouts) {
					this.validateLayouts(key);
				}
				for (let key in registry.invalidPositions) {
					this.validatePositions(key);
				}
		*/

		let skippedComponents: Component[] = [];

		// data objects first - do all calculations
		// only data is parsed in chunks, thats why we do for loop instead of a while like with other invalid items.
		// important to go backwards, as items are removed!
		// TODO use iterator instead

		for (var key in registry.invalidDatas) {
			let invalidData = registry.invalidDatas[key];

			while (invalidData.length > 0) {
				let component: Component = invalidData[0];
				let dataProvider: $type.Optional<Component> = component.dataProvider;

				if (!component.isDisposed()) {

					if (dataProvider && dataProvider.dataInvalid) {
						try {
							dataProvider.validateData();
							if (dataProvider.dataValidationProgress < 1) {
								break;
							}
						}
						catch (e) {
							$array.remove(invalidData, dataProvider);
							dataProvider.raiseCriticalError(e);
						}
					}
					else {
						try {
							component.validateData();
							if (component.dataValidationProgress < 1) {
								break;
							}
						}
						catch (e) {
							$array.remove(invalidData, component);
							component.raiseCriticalError(e);
						}
					}
				}
				else {
					$array.remove(invalidData, component);
				}
			}
			if (Date.now() - time > this._updateStepDuration) {
				break;
			}
		}

		while (registry.invalidRawDatas.length > 0) {
			let component: Component = registry.invalidRawDatas[0];
			if (!component.isDisposed()) {
				try {
					component.validateRawData();
				}
				catch (e) {
					$array.remove(registry.invalidRawDatas, component);
					component.raiseCriticalError(e);
				}
			}
			else {
				$array.remove(registry.invalidRawDatas, component);
			}
		}

		// TODO use iterator instead
		while (registry.invalidDataItems.length > 0) {
			let component: Component = registry.invalidDataItems[0];

			let dataProvider: $type.Optional<Component> = component.dataProvider;

			// this is needed to avoid partial value validation when data is parsed in chunks
			if (component.isDisposed() || component.dataInvalid || (dataProvider && dataProvider.dataInvalid)) {
				// void
			}
			else {
				try {
					component.validateDataItems();
				}
				catch (e) {
					$array.remove(registry.invalidDataItems, component);
					component.raiseCriticalError(e);
				}
			}

			// this might seem too much, as validateValues removes from invalidDataItems aswell, but just to be sure (in case validateData is overriden and no super is called)
			$array.remove(registry.invalidDataItems, component);
		}

		// TODO use iterator instead
		while (registry.invalidDataRange.length > 0) {
			let component: Component = registry.invalidDataRange[0];

			let dataProvider: $type.Optional<Component> = component.dataProvider;

			if (component.isDisposed() || component.dataInvalid || (dataProvider && dataProvider.dataInvalid)) {
				// void
			}
			else {
				try {
					component.validateDataRange();
					if (!component.skipRangeEvent) {
						component.dispatchImmediately("datarangechanged");
					}
					component.skipRangeEvent = false;
				}
				catch (e) {
					$array.remove(registry.invalidDataRange, component);
					component.raiseCriticalError(e);
				}
			}
			// this might seem too much, as validateDataRange removes from invalidDataRange aswell, but just to be sure (in case validateData is overriden and no super is called)
			$array.remove(registry.invalidDataRange, component);
		}

		let skippedSprites: Sprite[] = [];

		// display objects later
		// TODO use iterator instead

		for (let key in registry.invalidLayouts) {
			this.validateLayouts(key);
		}
		for (let key in registry.invalidPositions) {
			this.validatePositions(key);
		}


		let hasSkipped: boolean = false;

		time = Date.now();

		for (var key in registry.invalidSprites) {
			let count = 0;

			let invalidSprites = registry.invalidSprites[key];

			while (invalidSprites.length > 0) {
				this.validateLayouts(key);
				this.validatePositions(key);

				count++;

				if (count == 5) {
					if (Date.now() - time > this._updateStepDuration) {
						break;
					}
					count = 0;
				}

				let sprite: Sprite = invalidSprites[invalidSprites.length - 1];

				// we need to check this, as validateLayout might validate sprite
				if (sprite && !sprite.isDisposed()) {
					if (!this.checkIfValidate(sprite)) {
						// void
						skippedSprites.push(sprite);
					}
					else {
						if (!this.checkIfValidate2(sprite)) {
							// void
							skippedSprites.push(sprite);
						}
						else {
							try {
								if (sprite instanceof Container) {
									sprite.children.each((child) => {
										if (child.invalid) {
											if (!this.checkIfValidate(child)) {
												skippedSprites.push(child);
											}
											else if (child.dataItem && child.dataItem.component && child.dataItem.component.dataInvalid) {
												skippedSprites.push(child);
											}
											else {
												child.validate();
											}
										}
									})
								}
								sprite.validate();
							}
							catch (e) {
								sprite.invalid = false;
								$array.remove(invalidSprites, sprite);
								sprite.raiseCriticalError(e);
							}
						}
					}
					// this might seem too much, but it's ok
					sprite.invalid = false;
				}
				$array.remove(invalidSprites, sprite);
			}

			registry.invalidSprites[key] = registry.invalidSprites[key].concat(skippedSprites);
		}

		for (var key in registry.invalidSprites) {
			if (registry.invalidSprites[key].length > 0) {
				hasSkipped = true;
			}
		}

		for (var key in registry.invalidDatas) {
			if (registry.invalidDatas[key].length > 0) {
				hasSkipped = true;
			}
		}

		// TODO make this more efficient
		// TODO don't copy the array
		$array.each($array.copy(animations), (x) => {
			x.update();
		});

		//if(!hasSkipped){
		for (let key in registry.invalidLayouts) {
			this.validateLayouts(key);
		}
		for (let key in registry.invalidPositions) {
			this.validatePositions(key);
		}
		//}

		triggerIdle();

		for (let key in registry.invalidLayouts) {
			this.validateLayouts(key);
		}
		for (let key in registry.invalidPositions) {
			this.validatePositions(key);
		}


		registry.dispatchImmediately("exitframe");

		if (hasSkipped || animations.length > 0 || skippedComponents.length > 0) {
			this.requestFrame();
		}

		if (this._updateStepDuration < 200) {
			let all0 = true;

			for (var key in registry.invalidDatas) {
				if (registry.invalidDatas[key].length > 0) {
					all0 = false;
				}
			}

			for (var key in registry.invalidSprites) {
				if (registry.invalidSprites[key].length > 0) {
					all0 = false;
				}
			}
			if (all0) {
				this._updateStepDuration = 200;
			}
		}
	}

	public checkIfValidate(sprite: Sprite): boolean {
		if (sprite instanceof Component && (sprite.dataInvalid || (sprite.dataProvider && sprite.dataProvider.dataInvalid))) {
			return false;
		}
		else {
			return true;
		}
	}

	public checkIfValidate2(sprite: Sprite): boolean {
		if (sprite.dataItem && sprite.dataItem.component && sprite.dataItem.component.dataInvalid && !sprite.dataItem.component.isTemplate) {
			return false;
		}
		else {
			return true;
		}
	}	

	/**
	 * Requests new animation frame
	 */
	public requestFrame() {
		if (!this._frameRequested) {

			raf(() => {
				this.update();
			});
			this._frameRequested = true;
		}
	}

	/**
	 * Triggers position re-validation on all [[Sprite]] elements that have
	 * invalid(ated) positions.
	 *
	 * @ignore Exclude from docs
	 * @todo Maybe should be private?
	 */
	public validatePositions(id: string): void {
		// invalid positions
		// TODO use iterator instead
		let invalidPositions = registry.invalidPositions[id];

		while (invalidPositions.length > 0) {
			let sprite: Sprite = invalidPositions[invalidPositions.length - 1];
			if (!sprite.isDisposed()) {
				try {
					if (sprite instanceof Container) {
						sprite.children.each((sprite) => {
							if (sprite.positionInvalid) {
								sprite.validatePosition();
							}
						})
					}

					sprite.validatePosition();
				}
				catch (e) {
					sprite.positionInvalid = false;
					$array.remove(invalidPositions, sprite);
					sprite.raiseCriticalError(e);
				}
			}
			else {
				$array.remove(invalidPositions, sprite);
			}
		}
	}

	/**
	 * Triggers position re-validation on all [[Container]] elements that have
	 * invalid(ated) layouts.
	 *
	 * @ignore Exclude from docs
	 * @todo Maybe should be private?
	 */
	public validateLayouts(id: string): void {
		// invalid positions
		// TODO use iterator instead
		let invalidLayouts = registry.invalidLayouts[id];
		while (invalidLayouts.length > 0) {
			let container = invalidLayouts[invalidLayouts.length - 1] as Container;
			if (!container.isDisposed()) {
				try {
					container.children.each((sprite) => {
						if (sprite instanceof Container && sprite.layoutInvalid && !sprite.isDisposed()) {
							sprite.validateLayout();
						}
					})

					container.validateLayout();
				}
				catch (e) {
					container.layoutInvalid = false;
					$array.remove(invalidLayouts, container);
					container.raiseCriticalError(e);
				}
			}
			else {
				$array.remove(invalidLayouts, container);
			}
		}
	}

	/**
	 * Outputs string to console if `verbose` is `true`.
	 *
	 * @param {any} value Message to output to console
	 */
	public log(value: any): void {
		if (options.verbose) {
			if (console) {
				console.log(value);
			}
		}
	}

	/**
	 * Pauses all the processes of all the amCharts objects on the page
	 *
	 * @return {boolean} is paused?
	 */
	public set isPaused(value: boolean) {
		this._isPaused = value;
		if (!value) {
			this._frameRequested = false;
			this.requestFrame();
		}
	}

	/**
	 * @return {boolean} Is system on pause?
	 */
	public get isPaused(): boolean {
		return this._isPaused;
	}

}


/**
 * A singleton global instance of [[System]].
 *
 * All code should use this, rather than instantiating their
 * own System objects.
 */
export const system: System = new System();
