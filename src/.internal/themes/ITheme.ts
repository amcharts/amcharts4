import { BaseObject } from "../core/Base";
import { registry } from "../core/Registry";

export interface ITheme {
  (object: BaseObject): void;
}

// TODO put this someplace else ?
// TODO export this in core.ts ?
export function is<A>(object: any, name: string): object is A {
	const x = registry.registeredClasses[name];
	return x != null && object instanceof x;
}
