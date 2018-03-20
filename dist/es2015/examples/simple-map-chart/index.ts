import * as amcharts4 from "@amcharts/amcharts4";
import * as map from "@amcharts/amcharts4/map";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";
import worldMap from "@amcharts/amcharts4/maps/worldLow";


amcharts4.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", map.MapChart);
chart.geoJSON = worldMap;
chart.projection = new map.projections.Miller();

let polygonSeries = chart.series.push(new map.MapPolygonSeries());
polygonSeries.getDataFromJSON = true;
// excludes Antarctica
polygonSeries.exclude = ["ATA"]; //@todo: chanhe this when we'll change to ISO id's
polygonSeries.tooltip.fill = amcharts4.color("#000000");

let colorSet = new amcharts4.ColorSet();

let polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.togglable = true;

let currentActive: map.MapPolygon;
polygonTemplate.events.on("hit", (event) => {
	// if we have some country selected, set default state to it
	if (currentActive) {
		currentActive.setState("default");
	}

	chart.zoomToMapObject(event.target);
	currentActive = event.target;
})

let hoverState = polygonTemplate.states.create("hover");
hoverState.properties.fill = colorSet.getIndex(0);

let activeState = polygonTemplate.states.create("active");
activeState.properties.fill = colorSet.getIndex(4);

/*
let smallMap = new Map.SmallMap();
chart.smallMap = smallMap;

let smallMapPolygonSeries = smallMap.series.push(new Map.MapPolygonSeries());
smallMapPolygonSeries.copyFrom(polygonSeries);
*/

let zoomControl = new map.ZoomControl();
chart.zoomControl = zoomControl;
zoomControl.slider.height = 100;