import * as amcharts4 from "@amcharts/amcharts4";
import * as map from "@amcharts/amcharts4/map";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";
import worldMap from "./worldLow";


amcharts4.system.useTheme(AnimatedTheme);



let countryCodes = [
	"AFG",
	"ALB",
	"DZA",
	"AGO",
	"ARG",
	"ARM",
	"AUS",
	"AUT",
	"AZE",
	"BGD",
	"BLR",
	"BEL",
	"BLZ",
	"BEN",
	"BTN",
	"BOL",
	"BIH",
	"BWA",
	"BRA",
	"BGR",
	"BFA",
	"BDI",
	"KHM",
	"CMR",
	"CAN",
	"CAF",
	"TCD",
	"CHL",
	"CHN",
	"COL",
	"COG",
	"COD",
	"CRI",
	"CIV",
	"HRV",
	"CUB",
	"CYP",
	"CZE",
	"DNK",
	"ECU",
	"EGY",
	"SLV",
	"EST",
	"FIN",
	"FRA",
	"GUF",
	"GAB",
	"GMB",
	"GEO",
	"DEU",
	"GHA",
	"GTM"]

amcharts4.system.useTheme(AnimatedTheme);

let chart1 = amcharts4.create("hiddenchartdiv", map.MapChart);
chart1.geoJSON = worldMap;
chart1.projection = new map.projections.Mercator();

let polygonSeries1 = chart1.series.push(new map.MapPolygonSeries());
polygonSeries1.getDataFromJSON = true;
polygonSeries1.include = ["AFG"];

let chart = amcharts4.create("chartdiv", map.MapChart);
chart.geoJSON = worldMap;
chart.projection = new map.projections.Mercator();
chart.padding(0, 20, 10, 20);
chart.minZoomLevel = 0.9;
chart.zoomLevel = 0.9;

let polygonSeries = chart.series.push(new map.MapPolygonSeries());
polygonSeries.getDataFromJSON = true;
polygonSeries.include = ["AFG"];

let label = chart.chartContainer.createChild(amcharts4.Label);
label.x = 100;
label.y = 100;
label.textElement.fill = amcharts4.color("#777777");
label.textElement.fontSize = 35;
label.textElement.fontWeigth = "bold";
label.textElement.text = "Afghanistan";

let slider = chart.createChild(amcharts4.Slider);

let currentIndex = -1;

setInterval(() => {
	let next = slider.start + 1 / countryCodes.length;
	if (next >= 1) {
		next = 0;
	}
	slider.animate({ property: "start", to: next }, 300);
}, 2000)

slider.events.on("rangechanged", () => {
	changeCountry();
})

function changeCountry() {
	let totalCountries = countryCodes.length - 1;
	let countryIndex = Math.round(totalCountries * slider.start);

	let morphToPolygon: map.MapPolygon;

	if (currentIndex != countryIndex) {
		polygonSeries1.include = [countryCodes[countryIndex]];
		polygonSeries1.validateData();
		polygonSeries1.validate();

		morphToPolygon = polygonSeries1.mapPolygons.getIndex(0);
		let countryPolygon = polygonSeries.mapPolygons.getIndex(0);

		let morpher = countryPolygon.polygon.morpher;
		let morphAnimation = morpher.morphToPolygon(morphToPolygon.polygon.points);

		let animation = label.animate({ property: "y", to: 1000 }, 300);
		animation.events.on("animationend", () => {
			label.textElement.text = morphToPolygon.dataItem.dataContext.name;
			label.y = -50;
			label.animate({ property: "y", to: 200 }, 300, amcharts4.ease.quadOut);
		})


		currentIndex = countryIndex;
	}
}