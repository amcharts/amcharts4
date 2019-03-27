/**
 * This is a demo for MapChart.
 *
 * Refer to the following link(s) for reference:
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/map/}
 */

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);
var interfaceColors = new am4core.InterfaceColorSet();

// Set map definition
try {
    chart.geodata = am4geodata_continentsLow;
}
catch (e) {
    chart.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest <a href=\"https://www.amcharts.com/download/download-v4/\">amcharts geodata</a> and extract its contents into the same directory as your amCharts files."));
}


// Set projection
chart.projection = new am4maps.projections.Orthographic();
chart.panBehavior = "rotateLongLat";

chart.seriesContainer.cursorOverStyle = am4core.MouseCursorStyle.grab;
chart.seriesContainer.cursorDownStyle = am4core.MouseCursorStyle.grabbing;

// Add zoom control
chart.zoomControl = new am4maps.ZoomControl();

chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#ffffff");
chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.1;

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
polygonSeries.mapPolygons.template.nonScalingStroke = true;
polygonSeries.calculateVisualCenter = true;
polygonSeries.mapPolygons.template.fill = am4core.color("#47c78a");
polygonSeries.mapPolygons.template.stroke = am4core.color("#47c78a");

var graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
graticuleSeries.mapLines.template.stroke = am4core.color("#fff");
graticuleSeries.fitExtent = false;
