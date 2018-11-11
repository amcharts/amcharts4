import { color } from "../core/utils/Color";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import { Scrollbar } from "../core/elements/Scrollbar";
import { ColorSet } from "../core/utils/ColorSet";
var theme = function (object) {
    if (object instanceof InterfaceColorSet) {
        object.setFor("stroke", color("#000000"));
        object.setFor("fill", color("#2b2b2b"));
        object.setFor("primaryButton", color("#0975da").lighten(-0.2));
        object.setFor("primaryButtonHover", color("#0975da").lighten(-0.2));
        object.setFor("primaryButtonDown", color("#0975da").lighten(-0.2));
        object.setFor("primaryButtonActive", color("#0975da").lighten(-0.2));
        object.setFor("primaryButtonText", color("#FFFFFF"));
        object.setFor("primaryButtonStroke", color("#0975da"));
        object.setFor("secondaryButton", color("#1fb0ff"));
        object.setFor("secondaryButtonHover", color("#1fb0ff").lighten(0.1));
        object.setFor("secondaryButtonDown", color("#1fb0ff").lighten(0.15));
        object.setFor("secondaryButtonActive", color("#1fb0ff").lighten(0.15));
        object.setFor("secondaryButtonText", color("#1fb0ff"));
        object.setFor("secondaryButtonStroke", color("#1fb0ff").lighten(-0.2));
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
            color("#0975da"),
            color("#0996f2"),
            color("#1fb0ff"),
            color("#41baff"),
            color("#5ec5ff"),
            color("#3db7ff")
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