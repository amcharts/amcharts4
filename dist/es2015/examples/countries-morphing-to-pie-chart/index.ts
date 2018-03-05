import * as amcharts4 from "@amcharts/amcharts4";
import * as map from "@amcharts/amcharts4/map";
import * as pie from "@amcharts/amcharts4/pie";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";
import worldMap from "./worldLow";

amcharts4.system.useTheme(AnimatedTheme);

let chart = amcharts4.create("chartdiv", map.MapChart);
chart.geoJSON = worldMap;
chart.projection = new map.projections.Mercator();

// zoomout on background click
chart.chartContainer.background.events.on("hit", () => { zoomOut() });

let colorSet = new amcharts4.ColorSet();
let morphedPolygon: map.MapPolygon;

// map polygon series (countries)
let polygonSeries = chart.series.push(new map.MapPolygonSeries());
polygonSeries.getDataFromJSON = true;
// specify which countries to include
polygonSeries.include = ["IT", "CH", "FR", "DE", "GB", "ES", "PT", "IE", "NL", "LU", "BE", "AT", "DK"]

// country area look and behavior
let polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.strokeOpacity = 1;
polygonTemplate.stroke = amcharts4.color("#ffffff");
polygonTemplate.fillOpacity = 0.5;
polygonTemplate.tooltipText = "{name}";

// desaturate filter for countries
let desaturateFilter = new amcharts4.DesaturateFilter();
desaturateFilter.saturation = 0.25;
polygonTemplate.filters.push(desaturateFilter);

// take a color from color set
polygonTemplate.adapter.add("fill", (fill, target) => {
	return colorSet.getIndex(target.dataItem.index);
})

// set fillOpacity to 1 when hovered
let hoverState = polygonTemplate.states.create("hover");
hoverState.properties.fillOpacity = 1;

// what to do when country is clicked
polygonTemplate.events.on("hit", (event) => {
	selectPolygon(event.target);
})


// Pie chart
let pieChart = chart.seriesContainer.createChild(pie.PieChart);
// Set width/heigh of a pie chart for easier positioning only
pieChart.width = 100;
pieChart.height = 100;
pieChart.visible = false;

let pieSeries = pieChart.series.push(new pie.PieSeries());
pieSeries.dataFields.value = "value";
pieSeries.dataFields.category = "category";
pieSeries.data = [{ value: 100, category: "First" }, { value: 20, category: "Second" }, { value: 10, category: "Third" }];

let dropShadowFilter = new amcharts4.DropShadowFilter();
dropShadowFilter.blur = 4;
pieSeries.filters.push(dropShadowFilter);

let sliceTemplate = pieSeries.slices.template;
sliceTemplate.fillOpacity = 1;
sliceTemplate.strokeOpacity = 0;

let activeState = sliceTemplate.states.getKey("active");
activeState.properties.shiftRadius = 0; // no need to pull on click, as country circle under the pie won't make it good

let sliceHoverState = sliceTemplate.states.getKey("hover");
sliceHoverState.properties.shiftRadius = 0; // no need to pull on click, as country circle under the pie won't make it good

// we don't need default pie chart animation, so change defaults
let hiddenState = pieSeries.hiddenState;
hiddenState.properties.startAngle = pieSeries.startAngle;
hiddenState.properties.endAngle = pieSeries.endAngle;
hiddenState.properties.opacity = 0;
hiddenState.properties.visible = false;

// series labels
let labelTemplate = pieSeries.labels.template;
labelTemplate.textElement.fill = amcharts4.color("#FFFFFF");
labelTemplate.textElement.fontSize = 10;
labelTemplate.background = new amcharts4.RoundedRectangle();
labelTemplate.background.fillOpacity = 0.9;
labelTemplate.padding(4, 9, 4, 9);
labelTemplate.background.fill = amcharts4.color("#7678a0");

// we need pie series to hide faster to avoid strange pause after country is clicked
pieSeries.hiddenState.transitionDuration = 200;

// country label
let countryLabel = chart.chartContainer.createChild(amcharts4.Label);
countryLabel.textElement.text = "Select a country";
countryLabel.textElement.fill = amcharts4.color("#7678a0");
countryLabel.textElement.fontSize = 40;

countryLabel.hiddenState.properties.dy = 1000;
countryLabel.defaultState.properties.dy = 0;
countryLabel.valign = "middle";
countryLabel.align = "right";
countryLabel.paddingRight = 50;
countryLabel.hide(0);
countryLabel.show();

// select polygon
function selectPolygon(polygon: map.MapPolygon) {
	if (morphedPolygon != polygon) {
		let animation = pieSeries.hide();
		if (animation) {
			animation.events.on("animationend", () => {
				morphToCircle(polygon);
			})
		}
		else {
			morphToCircle(polygon);
		}
	}
}

// fade out all countries except selected
function fadeOut(exceptPolygon?: map.MapPolygon) {
	for (let i = 0; i < polygonSeries.mapPolygons.length; i++) {
		let polygon = polygonSeries.mapPolygons.getIndex(i);
		if (polygon != exceptPolygon) {
			polygon.defaultState.properties.fillOpacity = 0.5;
			polygon.animate([{ property: "fillOpacity", to: 0.5 }, { property: "strokeOpacity", to: 1 }], polygon.polygon.morpher.morphDuration);
		}
	}
}

function zoomOut() {
	if (morphedPolygon) {
		pieSeries.hide();
		morphBack();
		fadeOut();
		countryLabel.hide();
		morphedPolygon = undefined;
	}
}

function morphBack() {
	if (morphedPolygon) {
		morphedPolygon.polygon.morpher.morphBack();
		let dsf = morphedPolygon.filters.getIndex(0);
		dsf.animate({ property: "saturation", to: 0.25 }, morphedPolygon.polygon.morpher.morphDuration);
	}
}

function morphToCircle(polygon: map.MapPolygon) {
	let animationDuration = polygon.polygon.morpher.morphDuration;
	// if there is a country already morphed to circle, morph it back
	morphBack();
	// morph polygon to circle
	polygon.toFront();
	polygon.polygon.morpher.morphToSingle = true;
	let morphAnimation = polygon.polygon.morpher.morphToCircle();

	polygon.strokeOpacity = 0; // hide stroke for lines not to cross countries

	polygon.defaultState.properties.fillOpacity = 1;
	polygon.animate({ property: "fillOpacity", to: 1 }, animationDuration);

	// animate desaturate filter
	let filter = polygon.filters.getIndex(0);
	filter.animate({ property: "saturation", to: 1 }, animationDuration);

	// save currently morphed polygon
	morphedPolygon = polygon;

	// fade out all other
	fadeOut(polygon);

	// hide country label
	countryLabel.hide();

	if (morphAnimation) {
		morphAnimation.events.on("animationend", () => {
			zoomToCountry(polygon);
		})
	}
	else {
		zoomToCountry(polygon);
	}
}

function zoomToCountry(polygon: map.MapPolygon) {
	let zoomAnimation = chart.zoomToMapObject(polygon, 0.5, true);
	if (zoomAnimation) {
		zoomAnimation.events.on("animationend", () => {
			showPieChart(polygon);
		})
	}
	else {
		showPieChart(polygon);
	}
}


function showPieChart(polygon: map.MapPolygon) {
	polygon.polygon.measure();
	pieChart.radius = polygon.pixelWidth / 2 * polygon.globalScale / chart.seriesContainer.scale;
	let centerPoint = amcharts4.utils.spritePointToSvg(polygon.polygon.centerPoint, polygon.polygon);
	centerPoint = amcharts4.utils.svgPointToSprite(centerPoint, chart.seriesContainer);

	pieChart.x = centerPoint.x - 50;
	pieChart.y = centerPoint.y - 50;

	let fill: amcharts4.Color = <amcharts4.Color>polygon.fill;
	let desaturated = fill.saturate(0.3);

	for (let i = 0; i < pieSeries.dataItems.length; i++) {
		let dataItem = pieSeries.dataItems.getIndex(i);
		dataItem.value = Math.round(Math.random() * 100);
		dataItem.slice.fill = amcharts4.colors.interpolate(fill, amcharts4.color("#ffffff"), 0.2 * i);

		dataItem.label.background.fill = desaturated;
		dataItem.tick.stroke = fill;
	}

	pieSeries.show();
	pieChart.show();

	countryLabel.textElement.text = "{name}";
	countryLabel.dataItem = polygon.dataItem;
	countryLabel.textElement.fill = desaturated;
	countryLabel.show();
}

