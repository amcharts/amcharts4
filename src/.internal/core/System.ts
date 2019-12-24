/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { registry, is } from "./Registry";
import { Sprite } from "./Sprite";
import { Container } from "./Container";
import { Component } from "./Component";
import { Label } from "./elements/Label";
import { raf } from "./utils/AsyncPending";
import { IAnimationObject } from "./utils/Animation";
import { triggerIdle } from "./utils/AsyncPending";
import * as $array from "./utils/Array";
import * as $object from "./utils/Object";
import * as $type from "./utils/Type";
import * as $log from "./utils/Log";


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
	 */
	protected _isPaused: boolean = false;

	/**
	 * Holds the list of currently playing animations.
	 *
	 * @ignore Exclude from docs
	 */
	public animations: Array<IAnimationObject> = [];

	/**
	 * Unique ID of the object.
	 */
	public uid: string = registry.getUniqueId();

	/**
	 * amCharts Version.
	 *
	 * This follows npm's semver specification.
	 *
	 * @see {@link https://docs.npmjs.com/misc/semver}
	 */
	static VERSION: string = "4.7.18";

	/**
	 * @todo Description
	 * @todo Needed?
	 * @ignore Exclude from docs
	 */
	public dummyCounter: number = 0;

	/**
	 * @todo Description
	 * @ignore Exclude from docs
	 */
	public time: number;


	protected _frameRequested: boolean = false;

	public updateStepDuration: number = 45;

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
	 * @param msg    Message to report in console
	 * @param reset  Reset time counter
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

		for (let key in registry.invalidDatas) {
			if ($object.hasKey(registry.invalidDatas, key)) {
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
				if (Date.now() - time > this.updateStepDuration) {
					break;
				}
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

		$object.each(registry.invalidLayouts, (key) => {
			this.validateLayouts(key);
		});

		$object.each(registry.invalidPositions, (key) => {
			this.validatePositions(key);
		});


		let hasSkipped: boolean = false;

		time = Date.now();

		$object.each(registry.invalidSprites, (key, invalidSprites) => {
			let count = 0;

			while (invalidSprites.length > 0) {
				this.validateLayouts(key);
				this.validatePositions(key);

				count++;

				if (count == 5) {
					if (Date.now() - time > this.updateStepDuration) {
						break;
					}
					count = 0;
				}

				let sprite: Sprite = invalidSprites[invalidSprites.length - 1];

				// we need to check this, as validateLayout might validate sprite
				if (sprite && !sprite.isDisposed()) {
					if (!sprite._systemCheckIfValidate()) {
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
								sprite._systemUpdate(skippedSprites);
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
		});

		$object.each(registry.invalidSprites, (key, value) => {
			if (value.length > 0) {
				hasSkipped = true;
			}
		});

		$object.each(registry.invalidDatas, (key, value) => {
			if (value.length > 0) {
				hasSkipped = true;
			}
		});

		// TODO make this more efficient
		// TODO don't copy the array
		$array.each($array.copy(this.animations), (x) => {
			x.update();
		});

		//if(!hasSkipped){
		$object.each(registry.invalidLayouts, (key) => {
			this.validateLayouts(key);
		});

		$object.each(registry.invalidPositions, (key) => {
			this.validatePositions(key);
		});
		//}

		triggerIdle();

		$object.each(registry.invalidLayouts, (key) => {
			this.validateLayouts(key);
		});

		$object.each(registry.invalidPositions, (key) => {
			this.validatePositions(key);
		});


		registry.dispatchImmediately("exitframe");

		if (hasSkipped || this.animations.length > 0 || skippedComponents.length > 0) {
			this.requestFrame();
		}

		if (this.updateStepDuration < 200) {
			let all0 = true;

			$object.each(registry.invalidDatas, (key, value) => {
				if (value.length > 0) {
					all0 = false;
				}
			});

			$object.each(registry.invalidSprites, (key, value) => {
				if (value.length > 0) {
					all0 = false;
				}
			});

			if (all0) {
				this.updateStepDuration = 200;
			}
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
	 * Call this method if you update data or config of a chart that is in
	 * hidden container, after revealing the container, so that labels and
	 * possibly other elements can correctly arrange themselves.
	 *
	 * @since 4.7.10
	 * @param  container  Target container
	 */
	public softInvalidate(container: Container) {
		container.children.each((child) => {
			if (child instanceof Container) {
				this.softInvalidate(child);
			}
			if (child.measureFailed) {
				if (is<Label>(child, "Label")) {
					child.hardInvalidate();
				}
				else {
					child.invalidate();
				}
				child.measureFailed = false;
			}
		})
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
					sprite._systemValidatePositions();
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
			let container: Container = invalidLayouts[invalidLayouts.length - 1];
			if (!container.isDisposed()) {
				try {
					container.children.each((sprite) => {
						sprite._systemValidateLayouts();
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
	 * @param value Message to output to console
	 */
	public log(value: any): void {
		$log.log(value);
	}

	/**
	 * Pauses all the processes of all the amCharts objects on the page
	 *
	 * @return is paused?
	 */
	public set isPaused(value: boolean) {
		this._isPaused = value;
		if (!value) {
			this._frameRequested = false;
			this.requestFrame();
		}
	}

	/**
	 * @return Is system on pause?
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
