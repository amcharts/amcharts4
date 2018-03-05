import * as amcharts4 from "@amcharts/amcharts4";
import * as map from "@amcharts/amcharts4/map";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";
import worldMap from "./worldLow";

amcharts4.system.useTheme(AnimatedTheme);

let countryCodes = ["AF", "AO", "AR", "AM", "AU", "AT", "AZ", "BD", "BY", "BE", "BO", "BA", "BW", "BR", "BG", "KH", "CM", "CA", "CF", "TD", "CL", "CN", "CO", "CG", "CD", "CR", "CI", "HR", "CU", "CY", "CZ", "DK", "EC", "EG", "ER", "EE", "ET", "FI", "FR", "GE", "DE", "GR", "GL", "GP", "GT", "GN", "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "JM", "JP", "JO", "KZ", "KE", "KP", "KR", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LT", "LU", "MK", "MG", "MY", "ML", "MT", "MR", "MX", "MD", "MN", "ME", "MA", "MZ", "MM", "NA", "NP", "NL", "NZ", "NI", "NE", "NG", "NO", "OM", "PK", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "RO", "RU", "SA", "SN", "RS", "SK", "SI", "SO", "ZA", "SS", "ES", "SD", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TN", "TR", "TM", "UA", "AE", "GB", "US", "UY", "UZ", "VE", "VN", "YE", "ZM", "ZW"];

let chart1 = amcharts4.create("hiddenchartdiv", map.MapChart);
chart1.geoJSON = worldMap;
chart1.projection = new map.projections.Mercator();

let polygonSeries1 = chart1.series.push(new map.MapPolygonSeries());
polygonSeries1.getDataFromJSON = true;
polygonSeries1.include = ["AF"];

let chart = amcharts4.create("chartdiv", map.MapChart);
chart.geoJSON = worldMap;
chart.projection = new map.projections.Mercator();
chart.padding(0, 20, 0, 20);
chart.minZoomLevel = 0.9;
chart.zoomLevel = 0.9;

let polygonSeries = chart.series.push(new map.MapPolygonSeries());
polygonSeries.getDataFromJSON = true;
polygonSeries.include = ["AF"];

let label = chart.chartContainer.createChild(amcharts4.Label);
label.x = 100;
label.y = 100;
label.textElement.fill = amcharts4.color("#777777");
label.textElement.fontSize = 35;
label.textElement.fontWeigth = "bold";
label.textElement.text = "Afghanistan";

let slider = chart.createChild(amcharts4.Slider);
slider.paddingLeft = 60;

let currentIndex = -1;
let colorset = new amcharts4.ColorSet();

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
		polygonSeries1.data = [];
		polygonSeries1.include = [countryCodes[countryIndex]];
		polygonSeries1.validateData();
		polygonSeries1.validate();

		morphToPolygon = polygonSeries1.mapPolygons.getIndex(0);
		let countryPolygon = polygonSeries.mapPolygons.getIndex(0);

		let morpher = countryPolygon.polygon.morpher;
		let morphAnimation = morpher.morphToPolygon(morphToPolygon.polygon.points);

		let colorAnimation = countryPolygon.animate({ "property": "fill", "to": colorset.getIndex(Math.round(Math.random() * 20)) }, 1000);

		let animation = label.animate({ property: "y", to: 1000 }, 300);
		animation.events.on("animationend", () => {
			label.textElement.text = morphToPolygon.dataItem.dataContext.name;
			label.y = -50;
			label.animate({ property: "y", to: 200 }, 300, amcharts4.ease.quadOut);
		})

		currentIndex = countryIndex;
	}
}
