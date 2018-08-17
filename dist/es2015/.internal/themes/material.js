import { color } from "../core/utils/Color";
import { ColorSet } from "../core/utils/ColorSet";
import { Tooltip } from "../core/elements/Tooltip";
import { ResizeButton } from "../core/elements/ResizeButton";
import { AmChartsLogo } from "../core/elements/AmChartsLogo";
var theme = function (object) {
    if (object instanceof ColorSet) {
        object.list = [
            color("#F44336"),
            color("#E91E63"),
            color("#9C27B0"),
            color("#673AB7"),
            color("#3F51B5"),
            color("#2196F3"),
            color("#03A9F4"),
            color("#00BCD4"),
            color("#009688"),
            color("#4CAF50"),
            color("#8BC34A"),
            color("#CDDC39"),
            color("#FFEB3B"),
            color("#FFC107"),
            color("#FF9800"),
            color("#FF5722"),
            color("#795548"),
            color("#9E9E9E"),
            color("#607D8B")
        ];
        object.minLightness = 0.2;
        object.maxLightness = 0.7;
        object.reuse = true;
    }
    if (object instanceof ResizeButton) {
        object.background.cornerRadiusTopLeft = 20;
        object.background.cornerRadiusTopRight = 20;
        object.background.cornerRadiusBottomLeft = 20;
        object.background.cornerRadiusBottomRight = 20;
    }
    if (object instanceof Tooltip) {
        object.animationDuration = 800;
    }
    if (object instanceof AmChartsLogo) {
        object.align = "left";
        object.valign = "bottom";
    }
};
export default theme;
//# sourceMappingURL=material.js.map