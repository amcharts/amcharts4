import { BaseObject } from "../core/Base";
export interface ITheme {
    (object: BaseObject): void;
}
export declare function is<A>(object: any, name: string): object is A;
