import { Dictionary } from "./Dictionary";
import * as $iter from "./Iterator";


function equal<Key extends string, A>(dict: Dictionary<Key, A>, array: Array<[Key, A]>): void {
	expect($iter.toArray(dict.iterator())).toEqual(array);
}


test("custom key type", () => {
	type Key = "foo" | "bar";

	const a = new Dictionary<Key, number>();
	equal(a, []);

	a.setKey("foo", 1);

	equal(a, [["foo", 1]]);
});
