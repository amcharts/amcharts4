import { EventDispatcher, AMEvent } from "./EventDispatcher";
import { triggerIdle } from "./AsyncPending";


interface IEvents {
	foo: number;
	bar: number;
}


test("dispatch", (done) => {
	const events = new EventDispatcher<IEvents>();

	let value = null;

	events.on("foo", (x) => {
		value = x;
		expect(x).toBe(5);
		done();
	});

	expect(value).toBe(null);
	events.dispatch("foo", 5);
	expect(value).toBe(null);

	setTimeout(() => {
		triggerIdle();
	}, 100);
});


test("dispatchImmediately", () => {
	const events = new EventDispatcher<IEvents>();

	let value = null;

	events.on("foo", (x) => {
		value = x;
		expect(x).toBe(5);
	});

	expect(value).toBe(null);
	events.dispatchImmediately("foo", 5);
	expect(value).toBe(5);
});


test("dispatchImmediately", () => {
	const events = new EventDispatcher<IEvents>();

	let values: Array<number> = [];

	events.on("foo", (x) => {
		values.push(x);
		expect(x).toBe(5);

		events.dispatchImmediately("bar", 5);
	});

	expect(values).toEqual([]);
	events.dispatchImmediately("foo", 5);
	expect(values).toEqual([5]);
});


test("dispatch", () => {
	const events = new EventDispatcher<IEvents>();

	let values: Array<number> = [];

	events.on("foo", (x) => {
		expect(values).toEqual([]);
		values.push(x);
		expect(x).toBe(5);

		events.dispatch("bar", 5);
		expect(values).toEqual([5]);
	});

	expect(values).toEqual([]);
	events.dispatch("foo", 5);
	expect(values).toEqual([]);

	return new Promise((success) => {
		setTimeout(() => {
			triggerIdle();
		}, 50);

		setTimeout(() => {
			expect(values).toEqual([5]);
			success();
		}, 100);
	});
});


test("once", () => {
	const events = new EventDispatcher<IEvents>();

	let values: Array<number> = [];

	events.once("foo", (x) => {
		values.push(x);
		expect(x).toBe(5);

		events.dispatchImmediately("bar", 5);
	});

	expect(values).toEqual([]);
	events.dispatchImmediately("foo", 5);
	expect(values).toEqual([5]);
});


test("duplicates", () => {
	const events = new EventDispatcher<IEvents>();

	let values: Array<[number, any, number]> = [];

	events.on("foo", function (x) {
		values.push([1, this, x]);
	});

	events.on("foo", function (x) {
		values.push([2, this, x]);
	});

	function callback(this: {}, x: number) {
		values.push([3, this, x]);
	}

	const self = {};

	events.on("foo", callback);
	events.on("foo", callback);
	events.on("foo", callback);
	events.on("foo", callback);
	events.on("foo", callback, self);
	events.on("foo", callback, self);
	events.on("foo", callback, self);

	expect(values).toEqual([]);
	events.dispatchImmediately("foo", 5);
	expect(values).toEqual([[1, undefined, 5], [2, undefined, 5], [3, undefined, 5], [3, self, 5]]);
});
