import { Sprite } from "../Sprite";
/**
 * Promise resolved when the DOM content finishes loading or the `deviceready`
 * event triggers in a Cordova environment.
 */
export declare let documentReady: Promise<Event>;
/**
 * Add elements to be checked when available on the viewport. Also add
 * callback to be executed when the element is on the viewport.
 *
 * @param element  The HTML element where the charts is rendered
 * @param callback The callback function
 */
export declare function add(element: HTMLElement, sprite: Sprite, callback: Function): void;
