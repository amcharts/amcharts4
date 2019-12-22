import { ITheme } from "./ITheme";
import { is } from "../core/Registry";
import { color } from "../core/utils/Color";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import { BaseObject } from "../core/Base";
import { Scrollbar } from "../core/elements/Scrollbar";
import { ColorSet } from "../core/utils/ColorSet";
import { Grid } from "../charts/axes/Grid";
import { Button } from "../core/elements/Button";

const theme: ITheme = (object: BaseObject) => {

	if (is<InterfaceColorSet>(object, "InterfaceColorSet")) {
		object.setFor("stroke", color("#000000"));
		object.setFor("fill", color("#ffffff"));

		object.setFor("primaryButton", color("#0975da").lighten(-0.2));
		object.setFor("primaryButtonHover", color("#0975da").lighten(-0.2));
		object.setFor("primaryButtonDown", color("#0975da").lighten(-0.2));
		object.setFor("primaryButtonActive", color("#0975da").lighten(-0.2));
		object.setFor("primaryButtonText", color("#FFFFFF"));
		object.setFor("primaryButtonStroke", color("#0975da"));

		object.setFor("secondaryButton", color("#41baff"));
		object.setFor("secondaryButtonHover", color("#41baff").lighten(0.1));
		object.setFor("secondaryButtonDown", color("#41baff").lighten(0.15));
		object.setFor("secondaryButtonActive", color("#41baff").lighten(0.15));
		object.setFor("secondaryButtonText", color("#ffffff"));
		object.setFor("secondaryButtonStroke", color("#41baff").lighten(-0.2));

		object.setFor("grid", color("#ffffff"));
		object.setFor("background", color("#000000"));
		object.setFor("alternativeBackground", color("#000000"));
		object.setFor("text", color("#ffffff"));
		object.setFor("alternativeText", color("#ffffff"));
		object.setFor("disabledBackground", color("#bbbbbb"));
	}

	if (is<Grid>(object, "Grid")) {
		object.strokeOpacity = 0.07;
	}

	if (is<Scrollbar>(object, "Scrollbar")) {
		object.background.fillOpacity = 0.2;
		object.thumb.background.fillOpacity = 0.5;
	}

	//color("#e3ecb7"),

	if (is<ColorSet>(object, "ColorSet")) {
		object.list = [
			color("#eeeab5"),
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

	if (is<Button>(object, "Button")) {
		object.background.fillOpacity = 1;
		object.background.strokeOpacity = 0.5;
		object.background.fill = color("#303950");
	}
};

export default theme;
