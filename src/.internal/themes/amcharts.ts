import { ITheme } from "./ITheme";
import { is } from "../core/Registry";
import { color } from "../core/utils/Color";
import { BaseObject } from "../core/Base";
import { ColorSet } from "../core/utils/ColorSet";
import { Grid } from "../charts/axes/Grid";

const theme: ITheme = (object: BaseObject) => {
	if (is<Grid>(object, "Grid")) {
		object.strokeOpacity = 0.07;
	}

	if (is<ColorSet>(object, "ColorSet")) {
		object.list = [
			color("#86ce86"),
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
