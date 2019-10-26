import { ITheme, is } from "./ITheme";
import { BaseObject } from "../core/Base";
import { XYChart } from "../charts/types/XYChart";
import { PercentSeries } from "../charts/series/PercentSeries";
import { PatternSet } from "../core/utils/PatternSet";
import { ColorSet } from "../core/utils/ColorSet";
import { color } from "../core/utils/Color";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import { Tooltip } from "../core/elements/Tooltip";

const theme: ITheme = (object: BaseObject) => {

	if (is<XYChart>(object, "XYChart") || is<PercentSeries>(object, "PercentSeries")) {
		object.patterns = new PatternSet();
	}

	if (is<Tooltip>(object, "Tooltip")) {
		const ic = new InterfaceColorSet;
		object.getFillFromObject = false;
		object.fill = ic.getFor("alternativeBackground");
		object.stroke = ic.getFor("text");
	}

	if (is<ColorSet>(object, "ColorSet")) {
		const ic = new InterfaceColorSet;
		object.list = [
			color(ic.getFor("alternativeBackground"))
		];
		object.reuse = true;
	}

};

export default theme;
