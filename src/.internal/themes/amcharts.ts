import { ITheme } from "./ITheme";
import { color } from "../core/utils/Color";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import { BaseObject } from "../core/Base";
import { Scrollbar } from "../core/elements/Scrollbar";
import { ColorSet } from "../core/utils/ColorSet";
import { Grid } from "../charts/axes/Grid";
import { DropShadowFilter } from "../core/rendering/filters/DropShadowFilter";

const theme: ITheme = (object: BaseObject) => {
	if (object instanceof Grid) {
		object.strokeOpacity = 0.07;
	}

	if (object instanceof ColorSet) {
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
