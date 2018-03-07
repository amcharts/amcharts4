/**
 * Defines default Responsive rules
 * @hidden
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Sprite, ISpriteProperties, ISpriteAdapters } from "../Sprite";
import { SpriteState } from "../SpriteState";
import { Container } from "../Container";
declare const _default: {
    relevant: (container: Container) => boolean;
    state: (object: Sprite, stateId: string) => SpriteState<ISpriteProperties, ISpriteAdapters>;
}[];
export default _default;
