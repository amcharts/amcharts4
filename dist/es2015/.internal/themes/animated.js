import { SpriteState } from "../core/SpriteState";
import { Component } from "../core/Component";
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
var theme = function (object) {
    if (object instanceof SpriteState) {
        object.transitionDuration = 400;
    }
    if (object instanceof Component) {
        object.rangeChangeDuration = 700;
        object.interpolationDuration = 700;
        object.sequencedInterpolation = false;
        if (object instanceof SankeyDiagram) {
            object.sequencedInterpolation = true;
        }
        if (object instanceof FunnelSeries) {
            object.sequencedInterpolation = true;
        }
    }
    if (object instanceof Chart) {
        object.defaultState.transitionDuration = 2000;
        object.hiddenState.transitionDuration = 1000;
    }
    if (object instanceof Tooltip) {
        object.animationDuration = 400;
        object.defaultState.transitionDuration = 400;
        object.hiddenState.transitionDuration = 400;
    }
    if (object instanceof Scrollbar) {
        object.animationDuration = 700;
    }
    if (object instanceof Series) {
        object.defaultState.transitionDuration = 1000;
        object.hiddenState.transitionDuration = 700;
        object.hiddenState.properties.opacity = 1;
        object.showOnInit = true;
    }
    if (object instanceof MapSeries) {
        object.hiddenState.properties.opacity = 0;
    }
    if (object instanceof PercentSeries) {
        object.hiddenState.properties.opacity = 0;
    }
    if (object instanceof FunnelSlice) {
        object.defaultState.transitionDuration = 800;
        object.hiddenState.transitionDuration = 1000;
        object.hiddenState.properties.opacity = 1;
    }
    if (object instanceof Slice) {
        object.defaultState.transitionDuration = 700;
        object.hiddenState.transitionDuration = 1000;
        object.hiddenState.properties.opacity = 1;
    }
    if (object instanceof Preloader) {
        object.hiddenState.transitionDuration = 2000;
    }
    if (object instanceof Column) {
        object.defaultState.transitionDuration = 700;
        object.hiddenState.transitionDuration = 1000;
        object.hiddenState.properties.opacity = 1;
    }
    if (object instanceof Column3D) {
        object.hiddenState.properties.opacity = 0;
    }
};
export default theme;
//# sourceMappingURL=animated.js.map