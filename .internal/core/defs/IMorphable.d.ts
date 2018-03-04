import { Morpher } from "../utils/Morpher";
import { IPoint } from "./IPoint";
export interface IMorphable {
    morpher: Morpher;
    points: IPoint[][][];
    currentPoints: IPoint[][][];
}
