import * as $iter from "./Iterator";


function equal<A>(a: $iter.Iterator<A>, b: Array<A>): void {
  expect($iter.toArray(a)).toEqual(b);
  testStop(a, b[0]);
}


function testStop<A>(a: $iter.Iterator<A>, b: A): void {
  let index = 0;

  expect($iter.find(a, (value) => {
    ++index;
    return true;
  })).toEqual(b);

  expect(index).toBeLessThan(2);
}


test("fromArray", () => {
  equal($iter.fromArray([1, 2, 3]), [1, 2, 3]);
});


test("each", () => {
  const output: Array<number> = [];

  $iter.each($iter.fromArray([1, 2, 3]), (a) => {
    output.push(a + 5);
  });

  expect(output).toEqual([6, 7, 8]);
});


test("map", () => {
  equal($iter.map($iter.fromArray([1, 2, 3]), (a) => a + 5), [6, 7, 8]);
});


test("filter", () => {
  equal($iter.filter($iter.fromArray([1, 2, 3]), (a) => a > 2), [3]);
  equal($iter.filter($iter.fromArray([1, 2, 3]), (a) => false), []);
});


test("concat", () => {
  equal($iter.concat($iter.fromArray([1, 2, 3]), $iter.fromArray([4, 5, 6])), [1, 2, 3, 4, 5, 6]);
  equal($iter.concat($iter.fromArray([1, 2, 3]), $iter.fromArray([4, 5, 6]), $iter.fromArray([7, 8, 9]), $iter.fromArray([10, 11, 12])), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});


test("flatten", () => {
  equal($iter.flatten($iter.fromArray([$iter.fromArray([1, 2, 3]), $iter.fromArray([4, 5, 6]), $iter.fromArray([7, 8, 9]), $iter.fromArray([10, 11, 12])])), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});


test("indexed", () => {
  equal($iter.indexed($iter.fromArray([5, 6, 7])), [[0, 5], [1, 6], [2, 7]]);
});


test("findIndex", () => {
  expect($iter.findIndex($iter.fromArray([]), (a) => a > 5)).toBe(-1);
  expect($iter.findIndex($iter.fromArray([5]), (a) => a > 5)).toBe(-1);
  expect($iter.findIndex($iter.fromArray([5, 6]), (a) => a > 5)).toBe(1);
  expect($iter.findIndex($iter.fromArray([5, 6, 7]), (a) => a > 5)).toBe(1);
});


test("find", () => {
  expect($iter.find($iter.fromArray([]), (a) => a > 5)).toBe(undefined);
  expect($iter.find($iter.fromArray([5]), (a) => a > 5)).toBe(undefined);
  expect($iter.find($iter.fromArray([5, 6]), (a) => a > 5)).toBe(6);
  expect($iter.find($iter.fromArray([5, 6, 7]), (a) => a > 5)).toBe(6);
});


test("foldl", () => {
  expect($iter.foldl($iter.fromArray([]), 2, (a, b) => a + b)).toBe(2);
  expect($iter.foldl($iter.fromArray([5]), 2, (a, b) => a + b)).toBe(7);
  expect($iter.foldl($iter.fromArray([5, 6]), 2, (a, b) => a + b)).toBe(13);
  expect($iter.foldl($iter.fromArray([5, 6, 7]), 2, (a, b) => a + b)).toBe(20);
});


test("min", () => {
  expect($iter.min($iter.fromArray([]))).toBe(null);
  expect($iter.min($iter.fromArray([5]))).toBe(5);
  expect($iter.min($iter.fromArray([6, 5]))).toBe(5);
  expect($iter.min($iter.fromArray([7, 6, 5, 4]))).toBe(4);
});


test("max", () => {
  expect($iter.max($iter.fromArray([]))).toBe(null);
  expect($iter.max($iter.fromArray([5]))).toBe(5);
  expect($iter.max($iter.fromArray([6, 5]))).toBe(6);
  expect($iter.max($iter.fromArray([7, 6, 5, 4]))).toBe(7);
});


test("join", () => {
  expect($iter.join($iter.fromArray([]), "^")).toBe("");
  expect($iter.join($iter.fromArray(["5"]), "^")).toBe("5");
  expect($iter.join($iter.fromArray(["5", "6"]), "^")).toBe("5^6");
  expect($iter.join($iter.fromArray(["5", "6", "7"]), "^")).toBe("5^6^7");

  expect($iter.join($iter.fromArray([]))).toBe("");
  expect($iter.join($iter.fromArray(["5"]))).toBe("5");
  expect($iter.join($iter.fromArray(["5", "6"]))).toBe("56");
  expect($iter.join($iter.fromArray(["5", "6", "7"]))).toBe("567");
});
