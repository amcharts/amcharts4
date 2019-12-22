import { ITheme } from "./ITheme";
import { is } from "../core/Registry";
import { BaseObject } from "../core/Base";
import { XYChart } from "../charts/types/XYChart";
import { PercentSeries } from "../charts/series/PercentSeries";
import { XYSeries } from "../charts/series/XYSeries";
import { PatternSet } from "../core/utils/PatternSet";
import { InterfaceColorSet } from "../core/utils/InterfaceColorSet";
import { Pattern } from "../core/rendering/fills/Pattern";

const theme: ITheme = (object: BaseObject) => {

	// Create PatternSet
	if (is<XYChart>(object, "XYChart") || is<PercentSeries>(object, "PercentSeries")) {
		object.patterns = new PatternSet();
	}

	// Set up compatible series
	if (is<XYSeries>(object, "XYSeries") || is<PercentSeries>(object, "PercentSeries")) {

		// Set up fill for series' tooltip
		if (object.tooltip) {
			const ic = new InterfaceColorSet;
			object.tooltip.getFillFromObject = false;
			object.tooltip.fill = ic.getFor("alternativeBackground");
			object.tooltip.label.fill = ic.getFor("text");
			object.tooltip.background.stroke = ic.getFor("alternativeBackground");
		}

	}

	if (is<Pattern>(object, "Pattern")) {
		object.backgroundOpacity = 1;
	}

};

export default theme;
