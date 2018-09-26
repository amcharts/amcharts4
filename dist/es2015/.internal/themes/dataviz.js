/**
 * A color scheme inspired by {@link https://datavizproject.com/}
 */
import { color } from "../core/utils/Color";
import { ColorSet } from "../core/utils/ColorSet";
var theme = function (object) {
    if (object instanceof ColorSet) {
        object.list = [
            color("#283250"),
            color("#902c2d"),
            color("#d5433d"),
            color("#f05440")
        ];
        object.reuse = false;
        object.stepOptions = {
            lightness: 0.05,
            hue: 0
        };
        object.passOptions = {};
    }
};
export default theme;
//# sourceMappingURL=dataviz.js.map