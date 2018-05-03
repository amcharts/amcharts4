import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

am4core.useTheme(am4themes_animated);

let chart = am4core.create("chartdiv", am4maps.MapChart);

try {
	chart.geodata = am4geodata_worldLow;
}
catch (e) {
	chart.raiseCriticalError({
		"message": "Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."
	});
}

chart.projection = new am4maps.projections.Miller();

let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
// excludes Antarctica
polygonSeries.exclude = ["ATA"]; // @todo: change this when we'll change to ISO id's
polygonSeries.tooltip.fill = am4core.color("#000000");

let colorSet = new am4core.ColorSet();

let polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.togglable = true;

let currentActive;
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

let zoomControl = new am4maps.ZoomControl();
chart.zoomControl = zoomControl;
zoomControl.slider.height = 100;
