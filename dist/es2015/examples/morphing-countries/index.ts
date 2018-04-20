import * as amcharts4 from "@amcharts/amcharts4/core";
import * as charts from "@amcharts/amcharts4/charts";
import * as maps from "@amcharts/amcharts4/maps";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";
import DarkTheme from "@amcharts/amcharts4/themes/dark";
import worldHigh from "@amcharts/amcharts4/geodata/worldHigh";

amcharts4.useTheme(AnimatedTheme);
amcharts4.useTheme(DarkTheme);

var countryCodes = ["AF", "AO", "AR", "AM", "AU", "AT", "AZ", "BD", "BY", "BE", "BO", "BA", "BW", "BR", "BG", "KH", "CM", "CA", "CF", "TD", "CL", "CN", "CO", "CG", "CD", "CR", "CI", "HR", "CU", "CY", "CZ", "DK", "EC", "EG", "ER", "EE", "ET", "FI", "FR", "GE", "DE", "GR", "GL", "GP", "GT", "GN", "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "JM", "JP", "JO", "KZ", "KE", "KP", "KR", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LT", "LU", "MK", "MG", "MY", "ML", "MT", "MR", "MX", "MD", "MN", "ME", "MA", "MZ", "MM", "NA", "NP", "NL", "NZ", "NI", "NE", "NG", "NO", "OM", "PK", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "RO", "RU", "SA", "SN", "RS", "SK", "SI", "SO", "ZA", "SS", "ES", "SD", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TN", "TR", "TM", "UA", "AE", "GB", "US", "UY", "UZ", "VE", "VN", "YE", "ZM", "ZW"];

var chart1 = amcharts4.create("hiddenchartdiv", maps.MapChart);
chart1.geodata = worldHigh;
chart1.projection = new maps.projections.Mercator();

var polygonSeries1 = chart1.series.push(new maps.MapPolygonSeries());
polygonSeries1.useGeodata = true;
polygonSeries1.include = ["AF"];

var chart = amcharts4.create("chartdiv", maps.MapChart);
chart.geodata = worldHigh;
chart.projection = new maps.projections.Mercator();
chart.padding(0, 20, 0, 20);
chart.minZoomLevel = 0.9;
chart.zoomLevel = 0.9;
chart.maxZoomLevel = 1;

var polygonSeries = chart.series.push(new maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
polygonSeries.include = ["AF"];

var label = chart.chartContainer.createChild(amcharts4.Label);
label.x = 100;
label.y = 100;
label.fill = amcharts4.color("#ffffff");
label.fontSize = 35;
label.fontWeigth = "bold";
label.text = "Afghanistan";
label.fillOpacity = 0.6;

var slider = chart.createChild(amcharts4.Slider);
slider.padding(0,15,0,60);
slider.marginBottom = 15;

var currentIndex = -1;
var colorset = new amcharts4.ColorSet();

setInterval(() => {
	var next = slider.start + 1 / countryCodes.length;
	if (next >= 1) {
		next = 0;
	}
	slider.animate({ property: "start", to: next }, 300);
}, 2000)

slider.events.on("rangechanged", () => {
	changeCountry();
})

function changeCountry() {
	var totalCountries = countryCodes.length - 1;
	var countryIndex = Math.round(totalCountries * slider.start);

	var morphToPolygon: maps.MapPolygon;

	if (currentIndex != countryIndex) {
		polygonSeries1.data = [];
		polygonSeries1.include = [countryCodes[countryIndex]];
		polygonSeries1.validateData();
		polygonSeries1.validate();

		morphToPolygon = polygonSeries1.mapPolygons.getIndex(0);
		var countryPolygon = polygonSeries.mapPolygons.getIndex(0);

		var morpher = countryPolygon.polygon.morpher;
		var morphAnimation = morpher.morphToPolygon(morphToPolygon.polygon.points);

		var colorAnimation = countryPolygon.animate({ "property": "fill", "to": colorset.getIndex(Math.round(Math.random() * 20)) }, 1000);

		var animation = label.animate({ property: "y", to: 1000 }, 300);
		animation.events.on("animationend", () => {
			label.text = morphToPolygon.dataItem.dataContext["name"];
			label.y = -50;
			label.animate({ property: "y", to: 200 }, 300, amcharts4.ease.quadOut);
		})

		currentIndex = countryIndex;
	}
}
