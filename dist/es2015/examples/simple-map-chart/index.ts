import * as amcharts4 from "@amcharts/amcharts4/core";
import * as maps from "@amcharts/amcharts4/maps";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";
import worldLow from "@amcharts/amcharts4/geodata/worldLow";

amcharts4.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", maps.MapChart);
chart.geodata = worldLow;
chart.projection = new maps.projections.Miller();

let polygonSeries = chart.series.push(new maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
// excludes Antarctica
polygonSeries.exclude = ["ATA"]; //@todo: chanhe this when we'll change to ISO id's
polygonSeries.tooltip.fill = amcharts4.color("#000000");

let colorSet = new amcharts4.ColorSet();

let polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.togglable = true;

let currentActive: maps.MapPolygon;
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
let smallMap = new maps.SmallMap();
chart.smallMap = smallMap;

let smallMapPolygonSeries = smallMap.series.push(new maps.MapPolygonSeries());
smallMapPolygonSeries.copyFrom(polygonSeries);
*/

let zoomControl = new maps.ZoomControl();
chart.zoomControl = zoomControl;
zoomControl.slider.height = 100;
