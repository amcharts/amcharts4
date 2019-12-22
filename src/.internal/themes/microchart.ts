import { ITheme } from "./ITheme";
import { is } from "../core/Registry";
import { BaseObject } from "../core/Base";
import { Sprite } from "../core/Sprite";
import { Container } from "../core/Container";
import { ZoomOutButton } from "../core/elements/ZoomOutButton";
import { AxisLine } from "../charts/axes/AxisLine";
import { Axis } from "../charts/axes/Axis";
import { Grid } from "../charts/axes/Grid";
import { Chart } from "../charts/Chart";
import { PercentSeries } from "../charts/series/PercentSeries";
import { AxisLabel } from "../charts/axes/AxisLabel";
import { Scrollbar } from "../core/elements/Scrollbar";

const theme: ITheme = (object: BaseObject) => {

	if (is<Sprite>(object, "Sprite")) {
		object.showSystemTooltip = false;
	}

	if (is<Chart>(object, "Chart")) {
		object.padding(0, 0, 0, 0);
	}

	if (is<Scrollbar>(object, "Scrollbar")) {
		object.startGrip.disabled = true;
		object.endGrip.disabled = true;
	}

	if (is<AxisLabel>(object, "AxisLabel") || is<AxisLine>(object, "AxisLine") || is<Grid>(object, "Grid")) {
		object.disabled = true;
	}

	if (is<Axis>(object, "Axis")) {
		object.cursorTooltipEnabled = false;
	}

	if (is<PercentSeries>(object, "PercentSeries")) {
		object.labels.template.disabled = true;
		object.ticks.template.disabled = true;
	}

	if (is<ZoomOutButton>(object, "ZoomOutButton")) {
		object.padding(1, 1, 1, 1);
	}

	if (is<Container>(object, "Container")) {
		if(object.minHeight) {
			object.minHeight = undefined;
		}
		if(object.minWidth) {
			object.minWidth = undefined;
		}
	}


};

export default theme;
