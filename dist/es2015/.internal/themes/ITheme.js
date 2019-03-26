import { registry } from "../core/Registry";
// TODO put this someplace else ?
// TODO export this in core.ts ?
export function is(object, name) {
    var x = registry.registeredClasses[name];
    return x != null && object instanceof x;
}
//# sourceMappingURL=ITheme.js.map