import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_continentsLow from "@amcharts/amcharts4-geodata/continentsLow";


am4core.useTheme(am4themes_animated);

var mapChart = am4core.create("chartdiv", am4maps.MapChart);

try {
  mapChart.geodata = am4geodata_continentsLow;
}
catch (e) {
  mapChart.raiseCriticalError(new Error("Map geodata could not be loaded. Please download the latest amcharts geodata and extract its contents into the same directory as your amCharts files."));
}

mapChart.projection = new am4maps.projections.Miller;
// prevent dragging
mapChart.seriesContainer.draggable = false;
mapChart.seriesContainer.resizable = false;
// prevent zooming
mapChart.minZoomLevel = 1;
// countries
var countriesSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
countriesSeries.useGeodata = true;
countriesSeries.mapPolygons.template.fill = am4core.color("#47c78a");
countriesSeries.mapPolygons.template.stroke = am4core.color("#47c78a");

var colorSet = new am4core.ColorSet();
var polygonTemplate = countriesSeries.mapPolygons.template;

// night series
var nightSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
nightSeries.ignoreBounds = true;
var night = nightSeries.mapPolygons.create();
night.fill = am4core.color("#000000");
night.fillOpacity = 0.35;
night.interactionsEnabled = false;
night.stroke = am4core.color("#000000");
night.strokeOpacity = 0;

var night2 = nightSeries.mapPolygons.create();
night2.fill = am4core.color("#000000");
night2.fillOpacity = 0.4;
night2.interactionsEnabled = false;
night2.stroke = am4core.color("#000000");
night2.strokeOpacity = 0;


// images series
var imagesSeries = mapChart.series.push(new am4maps.MapImageSeries())
var tooltip = imagesSeries.tooltip;
tooltip.label.padding(15, 15, 15, 15);
tooltip.background.cornerRadius = 25;

// sun
var sun = imagesSeries.mapImages.create();
var suncircle = sun.createChild(am4core.Circle);
suncircle.radius = 10;
suncircle.fill = am4core.color("#ffba00");
suncircle.strokeOpacity = 0;
sun.filters.push(new am4core.BlurFilter());

// graticule
var graticuleSeires = mapChart.series.push(new am4maps.GraticuleSeries());
graticuleSeires.mapLines.template.stroke = am4core.color("#ffffff");
graticuleSeires.fitExtent = false;

// add slider to chart container in order not to occupy space
var slider = mapChart.chartContainer.createChild(am4core.Slider);
slider.start = 0.5;
slider.valign = "bottom";
slider.padding(0, 30, 0, 80);
slider.background.padding(0, 30, 0, 80);
slider.marginBottom = 15;
slider.events.on("rangechanged", function () {
  updateDateNight(new Date().getTime() + (slider.start - 0.5) * 1000 * 60 * 60 * 24 * 2 * 2);
})


function updateDateNight(time) {
  var sunPosition = solarPosition(time);
  sun.latitude = sunPosition.latitude;
  sun.longitude = sunPosition.longitude;
  sun.deepInvalidate();

  night.multiPolygon = am4maps.getCircle(sunPosition.longitude + 180, -sunPosition.latitude, 91);
  night2.multiPolygon = am4maps.getCircle(sunPosition.longitude + 180, -sunPosition.latitude, 89);
}


// all sun position calculation is taken from: http://bl.ocks.org/mbostock/4597134
var offset = new Date().getTimezoneOffset() * 60 * 1000;

function solarPosition(time) {
  var centuries = (time - Date.UTC(2000, 0, 1, 12)) / 864e5 / 36525, // since J2000
    longitude = (am4core.time.round(new Date(time), "day", 1).getTime() - time - offset) / 864e5 * 360 - 180;

  return am4maps.geo.normalizePoint({ longitude: longitude - equationOfTime(centuries) * am4core.math.DEGREES, latitude: solarDeclination(centuries) * am4core.math.DEGREES });
};


// Equations based on NOAA’s Solar Calculator; all angles in Amam4charts.math.RADIANS.
// http://www.esrl.noaa.gov/gmd/grad/solcalc/

function equationOfTime(centuries) {
  var e = eccentricityEarthOrbit(centuries),
    m = solarGeometricMeanAnomaly(centuries),
    l = solarGeometricMeanLongitude(centuries),
    y = Math.tan(obliquityCorrection(centuries) / 2);

  y *= y;
  return y * Math.sin(2 * l)
    - 2 * e * Math.sin(m)
    + 4 * e * y * Math.sin(m) * Math.cos(2 * l)
    - 0.5 * y * y * Math.sin(4 * l)
    - 1.25 * e * e * Math.sin(2 * m);
}

function solarDeclination(centuries) {
  return Math.asin(Math.sin(obliquityCorrection(centuries)) * Math.sin(solarApparentLongitude(centuries)));
}

function solarApparentLongitude(centuries) {
  return solarTrueLongitude(centuries) - (0.00569 + 0.00478 * Math.sin((125.04 - 1934.136 * centuries) * am4core.math.RADIANS)) * am4core.math.RADIANS;
}

function solarTrueLongitude(centuries) {
  return solarGeometricMeanLongitude(centuries) + solarEquationOfCenter(centuries);
}

function solarGeometricMeanAnomaly(centuries) {
  return (357.52911 + centuries * (35999.05029 - 0.0001537 * centuries)) * am4core.math.RADIANS;
}

function solarGeometricMeanLongitude(centuries) {
  var l = (280.46646 + centuries * (36000.76983 + centuries * 0.0003032)) % 360;
  return (l < 0 ? l + 360 : l) / 180 * Math.PI;
}

function solarEquationOfCenter(centuries) {
  var m = solarGeometricMeanAnomaly(centuries);
  return (Math.sin(m) * (1.914602 - centuries * (0.004817 + 0.000014 * centuries))
    + Math.sin(m + m) * (0.019993 - 0.000101 * centuries)
    + Math.sin(m + m + m) * 0.000289) * am4core.math.RADIANS;
}

function obliquityCorrection(centuries) {
  return meanObliquityOfEcliptic(centuries) + 0.00256 * Math.cos((125.04 - 1934.136 * centuries) * am4core.math.RADIANS) * am4core.math.RADIANS;
}

function meanObliquityOfEcliptic(centuries) {
  return (23 + (26 + (21.448 - centuries * (46.8150 + centuries * (0.00059 - centuries * 0.001813))) / 60) / 60) * am4core.math.RADIANS;
}

function eccentricityEarthOrbit(centuries) {
  return 0.016708634 - centuries * (0.000042037 + 0.0000001267 * centuries);
}
