import * as amcharts4 from "@amcharts/amcharts4";
import * as map from "@amcharts/amcharts4/map";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";
import worldMap from "./worldLow";

let mapChart: map.MapChart;
let sun: map.MapImage;
let santa: map.MapImage;
let night: map.MapPolygon;

createMap();

function createMap() {
	mapChart = amcharts4.create("chartdiv", map.MapChart);
	mapChart.geoJSON = worldMap;
	mapChart.projection = new map.projections.Miller;
	mapChart.padding(10, 10, 10, 10);
	mapChart.background.fillOpacity = 0;
	mapChart.chartContainer.draggable = false;
	mapChart.maxZoomFactor = 1.1; //@todo not working!
	//@todo: restrict zooming


	//  mapChart.projection.deltaLongitude = -90;

	let countries = mapChart.series.push(new map.MapPolygonSeries());
	countries.getDataFromJSON = true;
	countries.mapPolygons.template.fill = amcharts4.color("#ffffff");
	countries.mapPolygons.template.fillOpacity = 0.2;
	countries.mapPolygons.template.strokeOpacity = 0.05;
	countries.mapPolygons.template.stroke = amcharts4.color("#000000");
	//countries.exclude = ["ATA"];

	let slider = mapChart.createChild(amcharts4.Slider);
	slider.start = 0;
	slider.events.on("rangechanged", () => {
		updateDateNight(new Date().getTime() + slider.start * 1000 * 60 * 60 * 24 * 2 * 2);
	})

	let imagesSeries = mapChart.series.push(new map.MapImageSeries())
	sun = imagesSeries.mapImages.create();
	let suncircle = sun.createChild(amcharts4.Circle);
	suncircle.radius = 5;
	suncircle.fill = amcharts4.color("#fff000");
	suncircle.strokeOpacity = 0;
	sun.filters.push(new amcharts4.BlurFilter());


	santa = imagesSeries.mapImages.create();
	santa.nonScaling = true;
	let santaImage = santa.createChild(amcharts4.Image);
	santaImage.horizontalCenter = "middle";
	santaImage.verticalCenter = "bottom";
	santaImage.width = 70;
	santaImage.height = 40;
	santaImage.tooltipText = "I don´t give a f**k!!!";
	santaImage.href = "santa.png";


	let nightSeries = mapChart.series.push(new map.MapPolygonSeries());
	night = nightSeries.mapPolygons.create();
	night.fill = amcharts4.color("#000000");
	night.fillOpacity = 0.5;
	night.mouseEnabled = false;
	//night.realTrajectory = true //@ttodo test and fix
	night.stroke = amcharts4.color("#000000");
	night.strokeOpacity = 0;
	let blur = night.filters.push(new amcharts4.BlurFilter());
	blur.blur = 1.1;

	updateDateNight(new Date().getTime());

	setTimeout(() => {
		mapChart.zoomToGeoPoint({ latitude: 0, longitude: 0 }, 1.1, true); //@todo: not working
	}, 1000);
}


function updateDateNight(time: number) {

	let sunPosition = solarPosition(time);

	let coordinates: amcharts4.IGeoPoint[] = [];

	for (let i = -180; i <= 180; i = i + 0.1) {

		let latitude = i;

		let longitude = sunPosition.longitude;

		let point = map.geo.normalizePoint({ longitude: longitude, latitude: latitude });

		point = mapChart.projection.rotate(point, 90, sunPosition.latitude * amcharts4.math.cos(sunPosition.longitude), sunPosition.latitude * amcharts4.math.sin(sunPosition.longitude));

		coordinates.push(point);
	}


	coordinates.sort((a, b) => {
		return a.longitude - b.longitude;
	})


	let first = coordinates[0];
	let last = coordinates[coordinates.length - 1];

	let fillTo = 89.9;
	if (sunPosition.latitude >= 0) {
		fillTo = -89.9;
	}

	coordinates.push({ longitude: last.longitude, latitude: fillTo });
	coordinates.push({ longitude: first.longitude, latitude: fillTo });
	coordinates.push({ longitude: first.longitude, latitude: first.latitude });

	sun.latitude = sunPosition.latitude;
	sun.longitude = sunPosition.longitude;

	santa.longitude = coordinates[1000].longitude;
	santa.latitude = coordinates[1000].latitude;
	santa.rotation = amcharts4.math.getAngle(mapChart.projection.convert(coordinates[1000]), mapChart.projection.convert(coordinates[1010]));


	night.multiGeoPolygon = [[coordinates]];


}


let offset = new Date().getTimezoneOffset() * 60 * 1000;

function solarPosition(time) {
	var centuries = (time - Date.UTC(2000, 0, 1, 12)) / 864e5 / 36525, // since J2000
		longitude = (amcharts4.time.round(new Date(time), "day").getTime() - time - offset) / 864e5 * 360 - 180;

	return map.geo.normalizePoint({ longitude: longitude - equationOfTime(centuries) * amcharts4.math.DEGREES, latitude: solarDeclination(centuries) * amcharts4.math.DEGREES });
};


// Equations based on NOAA’s Solar Calculator; all angles in AmCharts.math.RADIANS.
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
	return solarTrueLongitude(centuries) - (0.00569 + 0.00478 * Math.sin((125.04 - 1934.136 * centuries) * amcharts4.math.RADIANS)) * amcharts4.math.RADIANS;
}

function solarTrueLongitude(centuries) {
	return solarGeometricMeanLongitude(centuries) + solarEquationOfCenter(centuries);
}

function solarGeometricMeanAnomaly(centuries) {
	return (357.52911 + centuries * (35999.05029 - 0.0001537 * centuries)) * amcharts4.math.RADIANS;
}

function solarGeometricMeanLongitude(centuries) {
	var l = (280.46646 + centuries * (36000.76983 + centuries * 0.0003032)) % 360;
	return (l < 0 ? l + 360 : l) / 180 * Math.PI;
}

function solarEquationOfCenter(centuries) {
	var m = solarGeometricMeanAnomaly(centuries);
	return (Math.sin(m) * (1.914602 - centuries * (0.004817 + 0.000014 * centuries))
		+ Math.sin(m + m) * (0.019993 - 0.000101 * centuries)
		+ Math.sin(m + m + m) * 0.000289) * amcharts4.math.RADIANS;
}

function obliquityCorrection(centuries) {
	return meanObliquityOfEcliptic(centuries) + 0.00256 * Math.cos((125.04 - 1934.136 * centuries) * amcharts4.math.RADIANS) * amcharts4.math.RADIANS;
}

function meanObliquityOfEcliptic(centuries) {
	return (23 + (26 + (21.448 - centuries * (46.8150 + centuries * (0.00059 - centuries * 0.001813))) / 60) / 60) * amcharts4.math.RADIANS;
}

function eccentricityEarthOrbit(centuries) {
	return 0.016708634 - centuries * (0.000042037 + 0.0000001267 * centuries);
}