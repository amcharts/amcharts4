import { IDisposer } from "./Disposer";


class DebugError {
	public stack!: string;

	constructor(f: any) {
		const oldValue = (<any>Error).stackTraceLimit;

		(<any>Error).stackTraceLimit = 100;

		if ((<any>Error).captureStackTrace) {
			(<any>Error).captureStackTrace(this, f);
		}

		(<any>Error).stackTraceLimit = oldValue;
	}
}


let enabled = true;

export function enable() {
	enabled = true;
}

export function disable() {
	enabled = false;
}

export function debug(value: IDisposer) {
	// TODO better detection for classes which shouldn't be debugged
	if (enabled && (<any>value).className !== "InterfaceColorSet") {
		const x = new DebugError(debug);

		setTimeout(() => {
			if (!value.isDisposed()) {
				console.log(value, x.stack);
			}
		}, 10000);
	}
}
