import { color } from "../core/utils/Color";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import { Scrollbar } from "../core/elements/Scrollbar";
import { ColorSet } from "../core/utils/ColorSet";
var theme = function (object) {
    if (object instanceof InterfaceColorSet) {
        object.setFor("stroke", color("#000000"));
        object.setFor("fill", color("#2b2b2b"));
        object.setFor("primaryButton", color("#6794dc").lighten(-0.2));
        object.setFor("primaryButtonHover", color("#6771dc").lighten(-0.2));
        object.setFor("primaryButtonDown", color("#68dc75").lighten(-0.2));
        object.setFor("primaryButtonActive", color("#68dc75").lighten(-0.2));
        object.setFor("primaryButtonText", color("#FFFFFF"));
        object.setFor("primaryButtonStroke", color("#6794dc"));
        object.setFor("secondaryButton", color("#0079ba"));
        object.setFor("secondaryButtonHover", color("#0079ba").lighten(0.1));
        object.setFor("secondaryButtonDown", color("#0079ba").lighten(0.15));
        object.setFor("secondaryButtonActive", color("#0079ba").lighten(0.15));
        object.setFor("secondaryButtonText", color("#0079ba"));
        object.setFor("secondaryButtonStroke", color("#0079ba").lighten(-0.2));
        object.setFor("grid", color("#bbbbbb"));
        object.setFor("background", color("#000000"));
        object.setFor("alternativeBackground", color("#ffffff"));
        object.setFor("text", color("#ffffff"));
        object.setFor("alternativeText", color("#000000"));
        object.setFor("disabledBackground", color("#bbbbbb"));
    }
    if (object instanceof Scrollbar) {
        object.background.fillOpacity = 0.4;
        object.thumb.background.fillOpacity = 0.5;
    }
    if (object instanceof ColorSet) {
        object.list = [
            color("#e3ecb7"),
            color("#0079ba")
        ];
        object.reuse = false;
        object.stepOptions = {
            lightness: 0.1,
            hue: 0
        };
        object.passOptions = {};
    }
};
export default theme;
//# sourceMappingURL=amchartsdark.js.map