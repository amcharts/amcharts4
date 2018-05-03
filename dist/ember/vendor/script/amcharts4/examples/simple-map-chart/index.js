am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4maps.MapChart);

try {
	chart.geodata = am4geodata_worldLow;
}
catch (e) {
	chart.raiseCriticalError({
		"message": "Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."
	});
}

chart.projection = new am4maps.projections.Miller();

var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
// excludes Antarctica
polygonSeries.exclude = ["ATA"]; // @todo: change this when we'll change to ISO id's
polygonSeries.tooltip.fill = am4core.color("#000000");

var colorSet = new am4core.ColorSet();

var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.togglable = true;

var currentActive;
polygonTemplate.events.on("hit", function (event) {
	// if we have some country selected, set default state to it
	if (currentActive) {
		currentActive.setState("default");
	}

	chart.zoomToMapObject(event.target);
	currentActive = event.target;
})

var hoverState = polygonTemplate.states.create("hover");
hoverState.properties.fill = colorSet.getIndex(0);

var activeState = polygonTemplate.states.create("active");
activeState.properties.fill = colorSet.getIndex(4);

/*
var smallMap = new maps.SmallMap();
chart.smallMap = smallMap;

var smallMapPolygonSeries = smallMap.series.push(new maps.MapPolygonSeries());
smallMapPolygonSeries.copyFrom(polygonSeries);
*/

var zoomControl = new am4maps.ZoomControl();
chart.zoomControl = zoomControl;
zoomControl.slider.height = 100;
