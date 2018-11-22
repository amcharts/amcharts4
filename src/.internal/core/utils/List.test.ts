import { List, IListEvents } from "./List";
import * as $iter from "./Iterator";


function equal<A>(list: $iter.Iterable<A>, array: Array<A>): void {
  expect($iter.toArray(list.iterator())).toEqual(array);
}


function withEvents<A, Key extends keyof AMEvent<List<A>, IListEvents<A>>>(list: List<A>, event: Key, array: Array<AMEvent<List<A>, IListEvents<A>>[Key]>, fn: () => void): Promise<void> {
  return new Promise((success, failure) => {
    const events: Array<AMEvent<List<A>, IListEvents<A>>[Key]> = [];

    const disposer = list.events.on(event, (value: AMEvent<List<A>, IListEvents<A>>[Key]) => {
      events.push(value);
    });

    fn();

    // TODO is this a good timeout ?
    // TODO create a waitPending method ?
    setTimeout(() => {
      disposer.dispose();

      success(events);
    }, 100);
  }).then((events) => {
    expect(events).toEqual(array);
  });
}


test("List", () => {
  equal(new List(), []);
  equal(new List([]), []);
  equal(new List([1, 2, 3]), [1, 2, 3]);
});


test("contains", () => {
  const a = new List([1, 2, 3]);

  expect(a.contains(1)).toBe(true);
  expect(a.contains(2)).toBe(true);
  expect(a.contains(3)).toBe(true);
  expect(a.contains(4)).toBe(false);
});


test("indexOf", () => {
  const a = new List([1, 2, 3]);

  expect(a.indexOf(1)).toBe(0);
  expect(a.indexOf(2)).toBe(1);
  expect(a.indexOf(3)).toBe(2);
  expect(a.indexOf(4)).toBe(-1);
});


test("length", () => {
  expect(new List().length).toBe(0);
  expect(new List([]).length).toBe(0);
  expect(new List([1]).length).toBe(1);
  expect(new List([1, 2]).length).toBe(2);
  expect(new List([1, 2, 3]).length).toBe(3);
});


test("getIndex", () => {
  const a = new List([5, 6, 7]);

  expect(a.getIndex(0)).toBe(5);
  expect(a.getIndex(1)).toBe(6);
  expect(a.getIndex(2)).toBe(7);
  expect(a.getIndex(3)).toBe(undefined);
});


test("insertIndex", () => {
  const a = new List();
  equal(a, []);

  return withEvents(a, "insertIndex", [
    { type: "insertIndex", target: a, index: 0, newValue: 5 },
    { type: "insertIndex", target: a, index: 0, newValue: 6 },
    { type: "insertIndex", target: a, index: 1, newValue: 7 },
    { type: "insertIndex", target: a, index: 3, newValue: 8 },
    { type: "insertIndex", target: a, index: 4, newValue: 9 }
  ], () => {
    a.insertIndex(0, 5);
    equal(a, [5]);

    a.insertIndex(0, 6);
    equal(a, [6, 5]);

    a.insertIndex(1, 7);
    equal(a, [6, 7, 5]);

    a.insertIndex(3, 8);
    equal(a, [6, 7, 5, 8]);

    a.insertIndex(4, 9);
    equal(a, [6, 7, 5, 8, 9]);

    expect(() => a.insertIndex(6, 10)).toThrow("Index out of bounds: 6");
  });
});


// TODO test out of bounds
test("setIndex", () => {
  const a = new List([1, 2, 3, 4, 5]);
  equal(a, [1, 2, 3, 4, 5]);

  return withEvents(a, "setIndex", [
    { type: "setIndex", target: a, index: 0, oldValue: 1, newValue: 6 },
    { type: "setIndex", target: a, index: 0, oldValue: 6, newValue: 7 },
    { type: "setIndex", target: a, index: 2, oldValue: 3, newValue: 8 },
    { type: "setIndex", target: a, index: 4, oldValue: 5, newValue: 9 }
  ], () => {
    a.setIndex(0, 6);
    equal(a, [6, 2, 3, 4, 5]);

    a.setIndex(0, 7);
    equal(a, [7, 2, 3, 4, 5]);

    a.setIndex(2, 8);
    equal(a, [7, 2, 8, 4, 5]);

    a.setIndex(4, 9);
    equal(a, [7, 2, 8, 4, 9]);
  });
});


// TODO test out of bounds
test("removeIndex", () => {
  const a = new List([1, 2, 3, 4, 5]);
  equal(a, [1, 2, 3, 4, 5]);

  return withEvents(a, "removeIndex", [
    { type: "removeIndex", target: a, index: 0, oldValue: 1 },
    { type: "removeIndex", target: a, index: 0, oldValue: 2 },
    { type: "removeIndex", target: a, index: 2, oldValue: 5 },
    { type: "removeIndex", target: a, index: 1, oldValue: 4 }
  ], () => {
    a.removeIndex(0);
    equal(a, [2, 3, 4, 5]);

    a.removeIndex(0);
    equal(a, [3, 4, 5]);

    a.removeIndex(2);
    equal(a, [3, 4]);

    a.removeIndex(1);
    equal(a, [3]);
  });
});


test("push", () => {
  const a = new List([1, 2, 3, 4, 5]);
  equal(a, [1, 2, 3, 4, 5]);

  return withEvents(a, "insertIndex", [
    { type: "insertIndex", target: a, index: 5, newValue: 6 },
    { type: "insertIndex", target: a, index: 6, newValue: 7 },
    { type: "insertIndex", target: a, index: 7, newValue: 8 },
  ], () => {
    a.push(6);
    equal(a, [1, 2, 3, 4, 5, 6]);

    a.push(7);
    equal(a, [1, 2, 3, 4, 5, 6, 7]);

    a.push(8);
    equal(a, [1, 2, 3, 4, 5, 6, 7, 8]);
  });
});


test("clear", () => {
  const a = new List([1, 2, 3, 4, 5]);
  equal(a, [1, 2, 3, 4, 5]);

  return withEvents(a, "setAll", [
    { type: "setAll", target: a, oldArray: [1, 2, 3, 4, 5], newArray: [] }
  ], () => {
    a.clear();
    equal(a, []);
  });
});


test("backwards", () => {
  const a = new List([1, 2, 3, 4, 5]);
  equal(a.backwards(), [5, 4, 3, 2, 1]);
});


test("range", () => {
  const a = new List([1, 2, 3, 4, 5]);

  equal(a.range(-1, -1), []);
  equal(a.range(0, 0), []);
  equal(a.range(3, 3), []);
  equal(a.range(4, 4), []);
  equal(a.range(5, 5), []);

  equal(a.range(-10, 10), [1, 2, 3, 4, 5]);
  equal(a.range(0, 5), [1, 2, 3, 4, 5]);
  equal(a.range(2, 3), [3]);
  equal(a.range(1, 4), [2, 3, 4]);

  equal(a.range(-10, 10).backwards(), [5, 4, 3, 2, 1]);
  equal(a.range(0, 5).backwards(), [5, 4, 3, 2, 1]);
  equal(a.range(2, 3).backwards(), [3]);
  equal(a.range(1, 4).backwards(), [4, 3, 2]);

  equal(a.range(1, 5).backwards(), [5, 4, 3, 2]);
  equal(a.range(1, 5).backwards().range(1, 4), [4, 3, 2]);
  equal(a.range(1, 5).backwards().range(1, 4).backwards().range(0, 2), [2, 3]);

  equal(a.range(0, 5).range(1, 3), [2, 3]);
  equal(a.range(0, 5).range(1, 3).range(0, 2), [2, 3]);
  equal(a.range(0, 5).range(1, 3).range(0, 2).range(1, 2), [3]);

  equal(a.range(0, 5).backwards().range(1, 3), [4, 3]);
  equal(a.range(0, 5).backwards().range(1, 3).range(0, 2), [4, 3]);
  equal(a.range(0, 5).backwards().range(1, 3).range(0, 2).range(1, 2), [3]);

  equal(a.range(0, 5).backwards().range(6, 7), []);

  equal(a.range(0, 3), [1, 2, 3]);
  equal(a.range(0, 3).backwards(), [3, 2, 1]);
  equal(a.range(0, 3).backwards().backwards(), [1, 2, 3]);

  expect(() => a.range(10, -10)).toThrow("Start index must be lower than end index");
  expect(() => a.range(5, 0)).toThrow("Start index must be lower than end index");
  expect(() => a.range(3, 2)).toThrow("Start index must be lower than end index");
  expect(() => a.range(4, 1)).toThrow("Start index must be lower than end index");
});
