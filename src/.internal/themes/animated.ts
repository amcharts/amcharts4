import { ITheme } from "./ITheme";
import { is } from "../core/Registry";
import { SpriteState } from "../core/SpriteState";
import { Component } from "../core/Component";
import { BaseObject } from "../core/Base";
import { Scrollbar } from "../core/elements/Scrollbar";
import { Tooltip } from "../core/elements/Tooltip";
import { Series } from "../charts/series/Series";
import { PercentSeries } from "../charts/series/PercentSeries";
import { SankeyDiagram } from "../charts/types/SankeyDiagram";
import { FunnelSeries } from "../charts/series/FunnelSeries";
import { MapSeries } from "../charts/map/MapSeries";
import { FunnelSlice } from "../charts/elements/FunnelSlice";
import { Column } from "../charts/elements/Column";
import { Column3D } from "../charts/elements/Column3D";
import { Slice } from "../core/elements/Slice";
import { Preloader } from "../core/elements/Preloader";
import { Chart } from "../charts/Chart";



const theme: ITheme = (object: BaseObject) => {
	if (is<SpriteState<any, any>>(object, "SpriteState")) {
		object.transitionDuration = 400;
	}

	if (is<Component>(object, "Component")) {
		object.rangeChangeDuration = 500;
		object.interpolationDuration = 500;
		object.sequencedInterpolation = false;

		if (is<SankeyDiagram>(object, "SankeyDiagram")) {
			object.sequencedInterpolation = true;
		}

		if (is<FunnelSeries>(object, "FunnelSeries")) {
			object.sequencedInterpolation = true;
		}
	}

	if (is<Chart>(object, "Chart")) {
		object.defaultState.transitionDuration = 2000;
		object.hiddenState.transitionDuration = 1000;
	}

	if (is<Tooltip>(object, "Tooltip")) {
		object.animationDuration = 400;
		object.defaultState.transitionDuration = 400;
		object.hiddenState.transitionDuration = 400;
	}

	if (is<Scrollbar>(object, "Scrollbar")) {
		object.animationDuration = 500;
	}

	if (is<Series>(object, "Series")) {
		object.defaultState.transitionDuration = 1000;
		object.hiddenState.transitionDuration = 700;
		object.hiddenState.properties.opacity = 1;
		object.showOnInit = true;
	}

	if (is<MapSeries>(object, "MapSeries")) {
		object.hiddenState.properties.opacity = 0;
	}

	if (is<PercentSeries>(object, "PercentSeries")) {
		object.hiddenState.properties.opacity = 0;
	}

	if (is<FunnelSlice>(object, "FunnelSlice")) {
		object.defaultState.transitionDuration = 800;
		object.hiddenState.transitionDuration = 1000;
		object.hiddenState.properties.opacity = 1;
	}

	if (is<Slice>(object, "Slice")) {
		object.defaultState.transitionDuration = 700;
		object.hiddenState.transitionDuration = 1000;
		object.hiddenState.properties.opacity = 1;
	}

	if (is<Preloader>(object, "Preloader")) {
		object.hiddenState.transitionDuration = 2000;
	}

	if (is<Column>(object, "Column")) {
		object.defaultState.transitionDuration = 700;
		object.hiddenState.transitionDuration = 1000;
		object.hiddenState.properties.opacity = 1;
	}

	if (is<Column3D>(object, "Column3D")) {
		object.hiddenState.properties.opacity = 0;
	}
};

export default theme;
