import { is } from "./ITheme";
import { PatternSet } from "../core/utils/PatternSet";
import { color } from "../core/utils/Color";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
var theme = function (object) {
    if (is(object, "XYChart") || is(object, "PercentSeries")) {
        object.patterns = new PatternSet();
    }
    if (is(object, "Tooltip")) {
        var ic = new InterfaceColorSet;
        object.getFillFromObject = false;
        object.fill = ic.getFor("alternativeBackground");
        object.stroke = ic.getFor("text");
    }
    if (is(object, "ColorSet")) {
        var ic = new InterfaceColorSet;
        object.list = [
            color(ic.getFor("alternativeBackground"))
        ];
        object.reuse = true;
    }
};
export default theme;
//# sourceMappingURL=patterns.js.map