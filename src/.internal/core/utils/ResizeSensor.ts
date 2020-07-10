import * as $array from "./Array";
import * as $log from "./Log";


interface Sensor {
	addTarget(target: Element, callback: () => void): void;
	removeTarget(target: Element): void;
}


declare const ResizeObserver: any;

class Native implements Sensor {
	private _observer: any;
	private _targets: Array<{ target: Element, callback: () => void }> = [];

	constructor() {
		this._observer = new ResizeObserver((entries: Array<any>) => {
			$array.each(entries, (entry) => {
				$array.each(this._targets, (x) => {
					if (x.target === entry.target) {
						x.callback();
					}
				});
			});
		});
	}

	addTarget(target: Element, callback: () => void) {
		this._observer.observe(target, { box: "content-box" });
		this._targets.push({ target, callback });
	}

	removeTarget(target: Element) {
		this._observer.unobserve(target);

		$array.keepIf(this._targets, (x) => {
			return x.target !== target;
		});
	}
}


class Raf implements Sensor {
	public static delay: number = 200;

	private _timer: number | undefined;
	private _targets: Array<{ target: Element, callback: () => void, size: ClientRect | DOMRect }> = [];

	addTarget(target: Element, callback: () => void) {
		if (this._targets.length === 0) {
			let lastTime: number | null = null;

			const loop = () => {
				const currentTime = Date.now();

				if (lastTime === null || currentTime > (lastTime + Raf.delay)) {
					lastTime = currentTime;

					$array.each(this._targets, (x) => {
						let newSize = x.target.getBoundingClientRect();

						if (newSize.width !== x.size.width || newSize.height !== x.size.height) {
							x.size = newSize;
							x.callback();
						}
					});
				}

				this._timer = requestAnimationFrame(loop);
			};

			this._timer = requestAnimationFrame(loop);
		}

		let size = target.getBoundingClientRect();
		this._targets.push({ target, callback, size });
	}

	removeTarget(target: Element) {
		$array.keepIf(this._targets, (x) => {
			return x.target !== target;
		});

		if (this._targets.length === 0) {
			cancelAnimationFrame(this._timer);
		}
	}
}


let observer: Sensor | null = null;

function makeSensor(): Sensor {
	if (observer === null) {
		if (typeof ResizeObserver !== "undefined") {
			observer = new Native();

		} else {
			observer = new Raf();
		}
	}

	return observer;
}

export class ResizeSensor {
	private _sensor: Sensor;
	private _element: Element;
	private _disposed: boolean = false;

	constructor(element: Element, callback: () => void) {
		this._sensor = makeSensor();
		this._element = element;
		this._sensor.addTarget(element, callback);
	}

	public isDisposed() {
		return this._disposed;
	}

	public dispose() {
		if (!this._disposed) {
			this._disposed = true;
			this._sensor.removeTarget(this._element);
		}
	}

	public get sensor(): Sensor {
		return this._sensor;
	}

	/**
	 * Deprecated: do not use.
	 *
	 * @ignore Exclude from docs
	 */
	public reset() {
		$log.warn("resizeSensor.reset() is no longer needed and can be removed");
	}
}
