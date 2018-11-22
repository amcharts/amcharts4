import * as $array from "./Array";


test("map", () => {
	expect($array.map([51, 52, 53], (x) => x + 20)).toEqual([71, 72, 73]);
	expect($array.map([51, 52, 53], (_, i) => i)).toEqual([0, 1, 2]);
});


test("each", () => {
	const a: Array<number> = [];
	const b: Array<number> = [];

	$array.each([51, 52, 53], (x, i) => {
		a.push(x);
		b.push(i);
	});

	expect(a).toEqual([51, 52, 53]);
	expect(b).toEqual([0, 1, 2]);
});


test("shiftLeft", () => {
	const a = [5, 6, 7, 8, 9, 10, 11, 12];

	$array.shiftLeft(a, 0);
	expect(a).toEqual([5, 6, 7, 8, 9, 10, 11, 12]);

	$array.shiftLeft(a, 1);
	expect(a).toEqual([6, 7, 8, 9, 10, 11, 12]);

	$array.shiftLeft(a, 1);
	expect(a).toEqual([7, 8, 9, 10, 11, 12]);

	$array.shiftLeft(a, 4);
	expect(a).toEqual([11, 12]);

	// TODO remove this <any> later
	expect(() => $array.shiftLeft(a, 4)).toThrow(<any>new RangeError("Invalid array length"));
});
