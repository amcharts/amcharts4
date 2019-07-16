import { StyleRule } from "../utils/DOM";
import { InterfaceColorSet } from "../utils/InterfaceColorSet";
import { Dictionary } from "../utils/Dictionary";
import { MultiDisposer, CounterDisposer } from "../utils/Disposer";
var rules = new Dictionary();
/**
 * A dynamically-loadable CSS module for Export menu.
 *
 * @ignore Exclude from docs
 * @param prefix  Prefix to addtach to class names
 * @return A MultiDisposer with style rules
 */
export default function (prefix) {
    var newPrefix = (prefix ? prefix : "amexport");
    var colorSet = new InterfaceColorSet();
    var counter = rules.insertKeyIfEmpty(newPrefix, function () {
        var disposer = new MultiDisposer([
            /*new StyleRule(`.${newPrefix}-menu`, {
                "opacity": "0.3",
                "transition": "all 100ms ease-in-out",
            }),

            new StyleRule(`div:hover .${newPrefix}-menu, .${newPrefix}-menu.active`, {
                "opacity": "0.9",
            }),*/
            new StyleRule("." + newPrefix + "-menu-level-0", {
                "position": "absolute",
                "top": "5px",
                "right": "5px",
            }),
            new StyleRule("." + newPrefix + "-menu-level-0." + newPrefix + "-left", {
                "right": "auto",
                "left": "5px",
            }),
            new StyleRule("." + newPrefix + "-menu-level-0." + newPrefix + "-right", {
                "right": "5px",
                "left": "auto",
            }),
            new StyleRule("." + newPrefix + "-menu-level-0." + newPrefix + "-top", {
                "top": "5px",
                "bottom": "auto",
            }),
            new StyleRule("." + newPrefix + "-menu-level-0." + newPrefix + "-bottom", {
                "top": "auto",
                "bottom": "5px",
            }),
            new StyleRule("." + newPrefix + "-item." + newPrefix + "-item-level-0", {
                "opacity": "0.3",
                "width": "30px",
                "min-height": "30px",
                "transition": "all 100ms ease-in-out",
            }),
            new StyleRule("div:hover ." + newPrefix + "-item." + newPrefix + "-item-level-0, ." + newPrefix + "-item." + newPrefix + "-item-level-0.active", {
                "opacity": "0.9",
            }),
            new StyleRule("." + newPrefix + "-item." + newPrefix + "-item-level-0 > a", {
                "padding": "0",
                "text-align": "center",
                "overflow": "hidden"
            }),
            new StyleRule("." + newPrefix + "-item." + newPrefix + "-item-level-0:before", {
                "display": "block"
            }),
            new StyleRule("." + newPrefix + "-item", {
                "position": "relative",
                "display": "block",
                "opacity": "0",
                "z-index": "1",
                "border-radius": "3px",
                "background-color": colorSet.getFor("secondaryButton").hex,
                "padding": "0",
                "margin": "1px 1px 0 0",
                "color": colorSet.getFor("secondaryButton").alternative.hex,
                "transition": "all 100ms ease-in-out, opacity 0.5s ease 0.5s",
            }),
            new StyleRule("." + newPrefix + "-left ." + newPrefix + "-item", {
                "margin": "1px 0 0 1px",
            }),
            new StyleRule("." + newPrefix + "-item:hover, ." + newPrefix + "-item.active", {
                "background": colorSet.getFor("secondaryButtonHover").hex,
                "color": colorSet.getFor("secondaryButtonText").hex,
            }),
            new StyleRule("." + newPrefix + "-item > ." + newPrefix + "-menu", {
                "position": "absolute",
                "top": "-1px",
                "right": "0",
                "margin-right": "100%",
            }),
            new StyleRule("." + newPrefix + "-left ." + newPrefix + "-item > ." + newPrefix + "-menu", {
                "left": "0",
                "right": "auto",
                "margin-left": "100%",
                "margin-right": "auto",
            }),
            new StyleRule("." + newPrefix + "-right ." + newPrefix + "-item > ." + newPrefix + "-menu", {
                "left": "auto",
                "right": "0",
                "margin-left": "auto",
                "margin-right": "100%",
            }),
            new StyleRule("." + newPrefix + "-top ." + newPrefix + "-item > ." + newPrefix + "-menu", {
                "top": "-1px",
                "bottom": "auto",
            }),
            new StyleRule("." + newPrefix + "-bottom ." + newPrefix + "-item > ." + newPrefix + "-menu", {
                "top": "auto",
                "bottom": "0",
            }),
            new StyleRule("." + newPrefix + "-item > ." + newPrefix + "-menu", {
                "display": "none",
            }),
            new StyleRule("." + newPrefix + "-item:hover > ." + newPrefix + "-menu, ." + newPrefix + "-item.active > ." + newPrefix + "-menu", {
                "display": "block",
            }),
            new StyleRule("." + newPrefix + "-item:hover > ." + newPrefix + "-menu > ." + newPrefix + "-item, ." + newPrefix + "-item.active > ." + newPrefix + "-menu > ." + newPrefix + "-item", {
                "opacity": "1",
            }),
            new StyleRule("." + newPrefix + "-menu", {
                "display": "block",
                "list-style": "none",
                "margin": "0",
                "padding": "0",
            }),
            new StyleRule("." + newPrefix + "-label", {
                "display": "block",
                "cursor": "default",
                "padding": "0.5em 1em",
            }),
            new StyleRule("." + newPrefix + "-icon", {
                "display": "block",
                "cursor": "default",
                "padding": "0.2em 0.4em",
                "width": "1.2em",
                "height": "1.2em",
                "min-width": "20px",
                "min-height": "20px",
                "margin": "auto auto",
                "border-radius": "3px",
            }),
            new StyleRule("." + newPrefix + "-item-level-0 > ." + newPrefix + "-icon", {
                "padding": "0.1em 0.2em",
            }),
            new StyleRule("." + newPrefix + "-clickable", {
                "cursor": "pointer",
            }),
        ]);
        return new CounterDisposer(function () {
            rules.removeKey(newPrefix);
            disposer.dispose();
        });
    });
    return counter.increment();
}
//# sourceMappingURL=ExportCSS.js.map