import * as amcharts4 from "@amcharts/amcharts4";
import * as map from "@amcharts/amcharts4/map";
import * as xy from "@amcharts/amcharts4/xy";
import * as gauge from "@amcharts/amcharts4/gauge";
import AnimatedTheme from "@amcharts/amcharts4/themes/animated";
import worldMap from "./worldLow";

amcharts4.system.useTheme(AnimatedTheme);

// times of events
let startTime = new Date(2018, 0, 13, 6).getTime();
let endTime = new Date(2018, 0, 13, 11, 59).getTime();
let launchTime = new Date(2018, 0, 13, 7, 0).getTime();
let alertTime = new Date(2018, 0, 13, 8, 7).getTime();
let cancelTime = new Date(2018, 0, 13, 8, 45).getTime();

let colorSet = new amcharts4.ColorSet();

let currentTime: number;

// map chart ////////////////////////////////////////////////////////
let mapChart = amcharts4.create("mapdiv", map.MapChart);
mapChart.geoJSON = worldMap;
mapChart.projection = new map.projections.Mercator();
mapChart.deltaLongitude = 145;
mapChart.seriesContainer.draggable = false;

let polygonSeries = mapChart.series.push(new map.MapPolygonSeries());
polygonSeries.getDataFromJSON = true;
polygonSeries.exclude = ["ATA"];

let mapImageSeries = mapChart.series.push(new map.MapImageSeries());
let pyongyang = mapImageSeries.mapImages.create();
pyongyang.longitude = 125.739708;
pyongyang.latitude = 39.034333;
pyongyang.nonScaling = true;
pyongyang.tooltip = new amcharts4.Tooltip();
pyongyang.tooltip.dy = - 5;
let circle = pyongyang.createChild(amcharts4.Circle);
circle.fill = colorSet.getIndex(5);
circle.stroke = circle.fill;
circle.radius = 4;

let bomb = mapImageSeries.mapImages.create();
bomb.longitude = 125.739708;
bomb.latitude = 39.034333;
bomb.nonScaling = true;
bomb.opacity = 0;

let bombImage = bomb.createChild(amcharts4.Image);
bombImage.width = 32;
bombImage.height = 32;
bombImage.href = "bomb.png";
bombImage.verticalCenter = "middle";
bombImage.horizontalCenter = "middle";


let honolulu = mapImageSeries.mapImages.create();
honolulu.longitude = -157.887841;
honolulu.latitude = 21.368213;
honolulu.nonScaling = true;
honolulu.tooltip = new amcharts4.Tooltip();
honolulu.tooltip.dy = - 5;
let circle2 = honolulu.createChild(amcharts4.Circle);
circle2.fill = colorSet.getIndex(2);
circle2.stroke = circle2.fill;
circle2.radius = 4;

let bang = mapImageSeries.mapImages.create();
bang.longitude = -174.369249;
bang.latitude = 24.810227;
bang.nonScaling = true;
let bangImage = bang.createChild(amcharts4.Image);
bangImage.width = 50;
bangImage.height = 50;
bangImage.verticalCenter = "middle";
bangImage.horizontalCenter = "middle";
bangImage.href = "bang.png";
bang.opacity = 0;

let mapLineSeries = mapChart.series.push(new map.MapLineSeries());
let line = mapLineSeries.mapLines.create();
line.imagesToConnect = [pyongyang, bang];
line.line.strokeOpacity = 0; // it's invisible, we use it for a bomb image to follow it


zoomToHawaii();

function zoomToHawaii() {
	mapChart.zoomToMapObject(honolulu, 4.5, true, 0);
}

// clock chart //////////////////////////////////////////////////////////////////
let clock = mapChart.createChild(gauge.GaugeChart);
clock.width = 200;
clock.height = 200;
clock.align = "right";
clock.zIndex = 10;

clock.startAngle = -90;
clock.endAngle = 270;

let axis = clock.xAxes.push(new gauge.ValueAxis<gauge.AxisRendererCircular>());
axis.min = 0;
axis.max = 12;
axis.strictMinMax = true;

axis.renderer.line.strokeWidth = 1;
axis.renderer.line.strokeOpacity = 0.2;
axis.renderer.minLabelPosition = 0.05; // hides 0 label
axis.renderer.inside = true;
axis.renderer.labels.template.radius = 23;
axis.renderer.axisFills.template.disabled = true;
axis.renderer.grid.template.disabled = true;
axis.renderer.minGridDistance = 20;
axis.renderer.ticks.template.length = 4;
axis.renderer.ticks.template.strokeOpacity = 0.2;

// clock hands
let hourHand = clock.hands.push(new gauge.ClockHand());
hourHand.radius = amcharts4.percent(60);
hourHand.startWidth = 5;
hourHand.endWidth = 5;
hourHand.rotationDirection = "clockWise";
hourHand.pin.radius = 5;
hourHand.zIndex = 0;

let minutesHand = clock.hands.push(new gauge.ClockHand());
minutesHand.rotationDirection = "clockWise";
minutesHand.startWidth = 2;
minutesHand.endWidth = 2;
minutesHand.radius = amcharts4.percent(78);
minutesHand.zIndex = 1;

function updateHands(date: Date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();

	// set hours
	hourHand.showValue(hours + minutes / 60, 0);
	// set minutes
	minutesHand.showValue(12 * (minutes + seconds / 60) / 60, 0);
}

/// end of clock

let exploded = false;

let honoluluTexts = [
	{ time: new Date(2018, 0, 13, 6, 7).getTime(), text: "Heh, good one!" },
	{ time: new Date(2018, 0, 13, 6, 30).getTime(), text: "Check this out!" },
	{ time: new Date(2018, 0, 13, 7, 10).getTime(), text: "Nice tits" },
	{ time: new Date(2018, 0, 13, 8, 7).getTime(), text: "Whaaaat?!?" },
	{ time: new Date(2018, 0, 13, 8, 15).getTime(), text: "OMG!!!" },
	{ time: new Date(2018, 0, 13, 8, 30).getTime(), text: "I swear I will never do this again!" },
	{ time: new Date(2018, 0, 13, 8, 46).getTime(), text: "God saved us!" },
	{ time: new Date(2018, 0, 13, 8, 55).getTime(), text: "Ok, time for porn." },
	{ time: new Date(2018, 0, 13, 9, 10).getTime(), text: "" }
];

let pyongyangTexts = [
	{ time: new Date(2018, 0, 13, 6, 5).getTime(), text: "Great comrade Kim Jong-un..." },
	{ time: new Date(2018, 0, 13, 6, 20).getTime(), text: "WHAT!?" },
	{ time: new Date(2018, 0, 13, 6, 40).getTime(), text: "Please, push this button..." },
	{ time: new Date(2018, 0, 13, 7, 0).getTime(), text: "OK." },
	{ time: new Date(2018, 0, 13, 7, 30).getTime(), text: "" },
];

// updates all elements
function setTime() {
	let time = amcharts4.time.round(new Date(startTime + (endTime - startTime) * slider.start), "minute").getTime();

	if (time != currentTime) {
		currentTime = time;

		let count = lineSeries.dataItems.length;
		if (slider) {
			for (let i = 0; i < count; i++) {
				let dataItem = lineSeries.dataItems.getIndex(i);

				if (i < slider.start * count) {
					dataItem.setWorkingValue("valueY", dataItem.valueY, 500);
				}
				else {
					dataItem.setWorkingValue("valueY", 0, 500);
				}
			}
		}
	}

	// add some drama by zooming the map
	mapChart.zoomLevel = 4.5 + slider.start;

	updateHands(new Date(time));

	let bombFlyDuration = cancelTime - launchTime;
	let bombPosition = (currentTime - launchTime) / bombFlyDuration;
	bombPosition = Math.min(1, bombPosition);
	bombPosition = Math.max(0, bombPosition);

	let oPoint = line.positionToPoint(bombPosition);
	let geoPoint = mapChart.seriesPointToGeo(oPoint);
	bomb.latitude = geoPoint.latitude;
	bomb.longitude = geoPoint.longitude;
	bomb.rotation = oPoint.rotation - 90;

	if (bombPosition > 0 && bombPosition < 1) {
		bomb.opacity = 1;
	}

	if (bombPosition >= 1 && !exploded) {
		bomb.opacity = 0;
		bang.opacity = 1;
		bang.animate({ property: "opacity", to: 0, from: 1 }, 1000);
		exploded = true;
	}

	if (exploded && bombPosition < 1) {
		exploded = false;
		bang.opacity = 0;
		bomb.opacity = 1;
	}

	for (let i = 0; i < honoluluTexts.length; i++) {
		let honoluluText = honoluluTexts[i];
		if (time > honoluluText.time) {
			honolulu.tooltipText = honoluluText.text;
		}
	}

	if (honolulu.tooltipText) {
		honolulu.showTooltip();
	}
	else {
		honolulu.hideTooltip();
	}

	for (let i = 0; i < pyongyangTexts.length; i++) {
		let pyongyangText = pyongyangTexts[i];
		if (time > pyongyangText.time) {
			pyongyang.tooltipText = pyongyangText.text;
		}
	}

	if (pyongyang.tooltipText) {
		pyongyang.showTooltip();
	}
	else {
		pyongyang.hideTooltip();
	}
}


let chart = amcharts4.create("chartdiv", xy.XYChart);
let dateAxis = chart.xAxes.push(new xy.DateAxis());

chart.paddingRight = 30;
//dateAxis.renderer.inside = true;
dateAxis.renderer.ticks.template.disabled = true;
dateAxis.renderer.grid.template.strokeDasharray = "3,3";
dateAxis.renderer.line.disabled = true;
dateAxis.tooltip.dateFormatter.dateFormat = "YYYY-MM-dd HH:mm";

let valueAxis = chart.yAxes.push(new xy.ValueAxis());
//valueAxis.renderer.inside = true;
valueAxis.renderer.ticks.template.disabled = true;
valueAxis.min = -80;
valueAxis.max = 80;
valueAxis.renderer.minGridDistance = 20;
valueAxis.renderer.grid.template.disabled = true;
valueAxis.renderer.line.disabled = true;
valueAxis.tooltip.disabled = true;
valueAxis.strictMinMax = true;
valueAxis.renderer.minWidth = 30;

let lineSeries = chart.series.push(new xy.LineSeries());
lineSeries.dataFields.valueY = "value";
lineSeries.dataFields.dateX = "time";
lineSeries.tooltipText = "{valueY.workingValue}";
lineSeries.stroke = colorSet.getIndex(1);

let range = valueAxis.createSeriesRange(lineSeries);
range.startValue = 0;
range.endValue = - 100;
range.contents.stroke = colorSet.getIndex(3);

chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";

chart.cursor = new xy.XYCursor();
chart.cursor.behavior = "none";


chart.events.on("inited", () => {
	createSlider();
})

let slider: amcharts4.Slider;

let alertStart = dateAxis.axisRanges.create();
alertStart.startDate = new Date(alertTime);
alertStart.grid.stroke = colorSet.getIndex(5);
alertStart.grid.strokeOpacity = 1;
alertStart.grid.strokeWidth = 2;
alertStart.grid.strokeDasharray = "3,3";
alertStart.grid.id = "alert";
alertStart.label.text = "Citizens alerted";
alertStart.label.inside = true;
alertStart.label.rotation = -90;
alertStart.label.horizontalCenter = "left";

let alertCanceled = dateAxis.axisRanges.create();
alertCanceled.startDate = new Date(cancelTime);
alertCanceled.grid.stroke = colorSet.getIndex(15);
alertCanceled.grid.strokeOpacity = 1;
alertCanceled.grid.strokeWidth = 2;
alertCanceled.grid.strokeDasharray = "3,3";
alertCanceled.grid.id = "alert";
alertCanceled.label.text = "Alert canceled";
alertCanceled.label.inside = true;
alertCanceled.label.rotation = -90;
alertCanceled.label.horizontalCenter = "left";

function createSlider() {
	let container = amcharts4.create("sliderdiv", amcharts4.Container);
	container.width = amcharts4.percent(100);
	container.height = amcharts4.percent(100);
	container.padding(20, 20, 20, 20);
	slider = container.createChild(amcharts4.Slider)

	slider.events.on("rangechanged", () => {
		setTime();
	})
}

// source: https://www.pornhub.com/insights/hawaii-alert
chart.data = [{ "time": "2018-01-13 06:00", "value": 0 },
{ "time": "2018-01-13 06:01", "value": -4 },
{ "time": "2018-01-13 06:02", "value": -16 },
{ "time": "2018-01-13 06:03", "value": -5 },
{ "time": "2018-01-13 06:04", "value": 12 },
{ "time": "2018-01-13 06:05", "value": -4 },
{ "time": "2018-01-13 06:06", "value": -5 },
{ "time": "2018-01-13 06:07", "value": -8 },
{ "time": "2018-01-13 06:08", "value": -2 },
{ "time": "2018-01-13 06:09", "value": -14 },
{ "time": "2018-01-13 06:10", "value": 15 },
{ "time": "2018-01-13 06:11", "value": 0 },
{ "time": "2018-01-13 06:12", "value": -14 },
{ "time": "2018-01-13 06:13", "value": -13 },
{ "time": "2018-01-13 06:14", "value": 2 },
{ "time": "2018-01-13 06:15", "value": 10 },
{ "time": "2018-01-13 06:16", "value": 11 },
{ "time": "2018-01-13 06:17", "value": 13 },
{ "time": "2018-01-13 06:18", "value": -11 },
{ "time": "2018-01-13 06:19", "value": 0 },
{ "time": "2018-01-13 06:20", "value": -10 },
{ "time": "2018-01-13 06:21", "value": 0 },
{ "time": "2018-01-13 06:22", "value": -21 },
{ "time": "2018-01-13 06:23", "value": -9 },
{ "time": "2018-01-13 06:24", "value": -11 },
{ "time": "2018-01-13 06:25", "value": -7 },
{ "time": "2018-01-13 06:26", "value": -14 },
{ "time": "2018-01-13 06:27", "value": 0 },
{ "time": "2018-01-13 06:28", "value": -9 },
{ "time": "2018-01-13 06:29", "value": 12 },
{ "time": "2018-01-13 06:30", "value": 7 },
{ "time": "2018-01-13 06:31", "value": 10 },
{ "time": "2018-01-13 06:32", "value": 5 },
{ "time": "2018-01-13 06:33", "value": 12 },
{ "time": "2018-01-13 06:34", "value": 13 },
{ "time": "2018-01-13 06:35", "value": 10 },
{ "time": "2018-01-13 06:36", "value": -14 },
{ "time": "2018-01-13 06:37", "value": -12 },
{ "time": "2018-01-13 06:38", "value": -8 },
{ "time": "2018-01-13 06:39", "value": -13 },
{ "time": "2018-01-13 06:40", "value": -13 },
{ "time": "2018-01-13 06:41", "value": -12 },
{ "time": "2018-01-13 06:42", "value": -11 },
{ "time": "2018-01-13 06:43", "value": 9 },
{ "time": "2018-01-13 06:44", "value": 0 },
{ "time": "2018-01-13 06:45", "value": -4 },
{ "time": "2018-01-13 06:46", "value": -6 },
{ "time": "2018-01-13 06:47", "value": -7 },
{ "time": "2018-01-13 06:48", "value": -12 },
{ "time": "2018-01-13 06:49", "value": -8 },
{ "time": "2018-01-13 06:50", "value": -7 },
{ "time": "2018-01-13 06:51", "value": 9 },
{ "time": "2018-01-13 06:52", "value": 10 },
{ "time": "2018-01-13 06:53", "value": 12 },
{ "time": "2018-01-13 06:54", "value": -4 },
{ "time": "2018-01-13 06:55", "value": 3 },
{ "time": "2018-01-13 06:56", "value": 9 },
{ "time": "2018-01-13 06:57", "value": -2 },
{ "time": "2018-01-13 06:58", "value": 7 },
{ "time": "2018-01-13 06:59", "value": 5 },
{ "time": "2018-01-13 07:00", "value": 8 },
{ "time": "2018-01-13 07:01", "value": -1 },
{ "time": "2018-01-13 07:02", "value": 1 },
{ "time": "2018-01-13 07:03", "value": -6 },
{ "time": "2018-01-13 07:04", "value": 0 },
{ "time": "2018-01-13 07:05", "value": -7 },
{ "time": "2018-01-13 07:06", "value": 3 },
{ "time": "2018-01-13 07:07", "value": 7 },
{ "time": "2018-01-13 07:08", "value": 2 },
{ "time": "2018-01-13 07:09", "value": -6 },
{ "time": "2018-01-13 07:10", "value": 2 },
{ "time": "2018-01-13 07:11", "value": -3 },
{ "time": "2018-01-13 07:12", "value": -8 },
{ "time": "2018-01-13 07:13", "value": -15 },
{ "time": "2018-01-13 07:14", "value": -3 },
{ "time": "2018-01-13 07:15", "value": -17 },
{ "time": "2018-01-13 07:16", "value": -8 },
{ "time": "2018-01-13 07:17", "value": -4 },
{ "time": "2018-01-13 07:18", "value": 0 },
{ "time": "2018-01-13 07:19", "value": -6 },
{ "time": "2018-01-13 07:20", "value": -5 },
{ "time": "2018-01-13 07:21", "value": -16 },
{ "time": "2018-01-13 07:22", "value": -8 },
{ "time": "2018-01-13 07:23", "value": -23 },
{ "time": "2018-01-13 07:24", "value": -9 },
{ "time": "2018-01-13 07:25", "value": -9 },
{ "time": "2018-01-13 07:26", "value": -11 },
{ "time": "2018-01-13 07:27", "value": -12 },
{ "time": "2018-01-13 07:28", "value": -13 },
{ "time": "2018-01-13 07:29", "value": -11 },
{ "time": "2018-01-13 07:30", "value": -14 },
{ "time": "2018-01-13 07:31", "value": -10 },
{ "time": "2018-01-13 07:32", "value": -4 },
{ "time": "2018-01-13 07:33", "value": -17 },
{ "time": "2018-01-13 07:34", "value": 0 },
{ "time": "2018-01-13 07:35", "value": 12 },
{ "time": "2018-01-13 07:36", "value": -11 },
{ "time": "2018-01-13 07:37", "value": 5 },
{ "time": "2018-01-13 07:38", "value": -4 },
{ "time": "2018-01-13 07:39", "value": 4 },
{ "time": "2018-01-13 07:40", "value": 1 },
{ "time": "2018-01-13 07:41", "value": -3 },
{ "time": "2018-01-13 07:42", "value": 4 },
{ "time": "2018-01-13 07:43", "value": -1 },
{ "time": "2018-01-13 07:44", "value": 0 },
{ "time": "2018-01-13 07:45", "value": 1 },
{ "time": "2018-01-13 07:46", "value": 1 },
{ "time": "2018-01-13 07:47", "value": 0 },
{ "time": "2018-01-13 07:48", "value": -5 },
{ "time": "2018-01-13 07:49", "value": 8 },
{ "time": "2018-01-13 07:50", "value": 7 },
{ "time": "2018-01-13 07:51", "value": -1 },
{ "time": "2018-01-13 07:52", "value": 10 },
{ "time": "2018-01-13 07:53", "value": 10 },
{ "time": "2018-01-13 07:54", "value": -10 },
{ "time": "2018-01-13 07:55", "value": -6 },
{ "time": "2018-01-13 07:56", "value": 0 },
{ "time": "2018-01-13 07:57", "value": 2 },
{ "time": "2018-01-13 07:58", "value": -10 },
{ "time": "2018-01-13 07:59", "value": 0 },
{ "time": "2018-01-13 08:00", "value": -12 },
{ "time": "2018-01-13 08:01", "value": -1 },
{ "time": "2018-01-13 08:02", "value": 0 },
{ "time": "2018-01-13 08:03", "value": 0 },
{ "time": "2018-01-13 08:04", "value": 0 },
{ "time": "2018-01-13 08:05", "value": 0 },
{ "time": "2018-01-13 08:06", "value": 0 },
{ "time": "2018-01-13 08:07", "value": 0 },
{ "time": "2018-01-13 08:08", "value": -47 },
{ "time": "2018-01-13 08:09", "value": -48 },
{ "time": "2018-01-13 08:10", "value": -54 },
{ "time": "2018-01-13 08:11", "value": -60 },
{ "time": "2018-01-13 08:12", "value": -44 },
{ "time": "2018-01-13 08:13", "value": -55 },
{ "time": "2018-01-13 08:14", "value": -56 },
{ "time": "2018-01-13 08:15", "value": -62 },
{ "time": "2018-01-13 08:16", "value": -62 },
{ "time": "2018-01-13 08:17", "value": -58 },
{ "time": "2018-01-13 08:18", "value": -56 },
{ "time": "2018-01-13 08:19", "value": -63 },
{ "time": "2018-01-13 08:20", "value": -58 },
{ "time": "2018-01-13 08:21", "value": -63 },
{ "time": "2018-01-13 08:22", "value": -62 },
{ "time": "2018-01-13 08:23", "value": -77 },
{ "time": "2018-01-13 08:24", "value": -69 },
{ "time": "2018-01-13 08:25", "value": -62 },
{ "time": "2018-01-13 08:26", "value": -68 },
{ "time": "2018-01-13 08:27", "value": -68 },
{ "time": "2018-01-13 08:28", "value": -63 },
{ "time": "2018-01-13 08:29", "value": -55 },
{ "time": "2018-01-13 08:30", "value": -54 },
{ "time": "2018-01-13 08:31", "value": -58 },
{ "time": "2018-01-13 08:32", "value": -61 },
{ "time": "2018-01-13 08:33", "value": -64 },
{ "time": "2018-01-13 08:34", "value": -53 },
{ "time": "2018-01-13 08:35", "value": -52 },
{ "time": "2018-01-13 08:36", "value": -47 },
{ "time": "2018-01-13 08:37", "value": -55 },
{ "time": "2018-01-13 08:38", "value": -48 },
{ "time": "2018-01-13 08:39", "value": -47 },
{ "time": "2018-01-13 08:40", "value": -32 },
{ "time": "2018-01-13 08:41", "value": -42 },
{ "time": "2018-01-13 08:42", "value": -41 },
{ "time": "2018-01-13 08:43", "value": -34 },
{ "time": "2018-01-13 08:44", "value": -40 },
{ "time": "2018-01-13 08:45", "value": -49 },
{ "time": "2018-01-13 08:46", "value": -38 },
{ "time": "2018-01-13 08:47", "value": -33 },
{ "time": "2018-01-13 08:48", "value": -39 },
{ "time": "2018-01-13 08:49", "value": -28 },
{ "time": "2018-01-13 08:50", "value": -38 },
{ "time": "2018-01-13 08:51", "value": -39 },
{ "time": "2018-01-13 08:52", "value": -35 },
{ "time": "2018-01-13 08:53", "value": -30 },
{ "time": "2018-01-13 08:54", "value": -13 },
{ "time": "2018-01-13 08:55", "value": -15 },
{ "time": "2018-01-13 08:56", "value": -17 },
{ "time": "2018-01-13 08:57", "value": -17 },
{ "time": "2018-01-13 08:58", "value": -14 },
{ "time": "2018-01-13 08:59", "value": -5 },
{ "time": "2018-01-13 09:00", "value": 13 },
{ "time": "2018-01-13 09:01", "value": 48 },
{ "time": "2018-01-13 09:02", "value": 33 },
{ "time": "2018-01-13 09:03", "value": 32 },
{ "time": "2018-01-13 09:04", "value": 22 },
{ "time": "2018-01-13 09:05", "value": 38 },
{ "time": "2018-01-13 09:06", "value": 9 },
{ "time": "2018-01-13 09:07", "value": 28 },
{ "time": "2018-01-13 09:08", "value": 21 },
{ "time": "2018-01-13 09:09", "value": 32 },
{ "time": "2018-01-13 09:10", "value": 16 },
{ "time": "2018-01-13 09:11", "value": 22 },
{ "time": "2018-01-13 09:12", "value": 17 },
{ "time": "2018-01-13 09:13", "value": 32 },
{ "time": "2018-01-13 09:14", "value": 12 },
{ "time": "2018-01-13 09:15", "value": 11 },
{ "time": "2018-01-13 09:16", "value": 18 },
{ "time": "2018-01-13 09:17", "value": 19 },
{ "time": "2018-01-13 09:18", "value": 15 },
{ "time": "2018-01-13 09:19", "value": -7 },
{ "time": "2018-01-13 09:20", "value": 6 },
{ "time": "2018-01-13 09:21", "value": 7 },
{ "time": "2018-01-13 09:22", "value": 13 },
{ "time": "2018-01-13 09:23", "value": 14 },
{ "time": "2018-01-13 09:24", "value": 11 },
{ "time": "2018-01-13 09:25", "value": 15 },
{ "time": "2018-01-13 09:26", "value": -5 },
{ "time": "2018-01-13 09:27", "value": 6 },
{ "time": "2018-01-13 09:28", "value": 10 },
{ "time": "2018-01-13 09:29", "value": 24 },
{ "time": "2018-01-13 09:30", "value": -11 },
{ "time": "2018-01-13 09:31", "value": -8 },
{ "time": "2018-01-13 09:32", "value": -13 },
{ "time": "2018-01-13 09:33", "value": 3 },
{ "time": "2018-01-13 09:34", "value": -1 },
{ "time": "2018-01-13 09:35", "value": 6 },
{ "time": "2018-01-13 09:36", "value": 7 },
{ "time": "2018-01-13 09:37", "value": 7 },
{ "time": "2018-01-13 09:38", "value": 8 },
{ "time": "2018-01-13 09:39", "value": 10 },
{ "time": "2018-01-13 09:40", "value": -12 },
{ "time": "2018-01-13 09:41", "value": -6 },
{ "time": "2018-01-13 09:42", "value": -10 },
{ "time": "2018-01-13 09:43", "value": 2 },
{ "time": "2018-01-13 09:44", "value": -6 },
{ "time": "2018-01-13 09:45", "value": -5 },
{ "time": "2018-01-13 09:46", "value": -9 },
{ "time": "2018-01-13 09:47", "value": -12 },
{ "time": "2018-01-13 09:48", "value": -6 },
{ "time": "2018-01-13 09:49", "value": -10 },
{ "time": "2018-01-13 09:50", "value": 2 },
{ "time": "2018-01-13 09:51", "value": -6 },
{ "time": "2018-01-13 09:52", "value": -5 },
{ "time": "2018-01-13 09:53", "value": -9 },
{ "time": "2018-01-13 09:54", "value": -12 },
{ "time": "2018-01-13 09:55", "value": -6 },
{ "time": "2018-01-13 09:56", "value": -16 },
{ "time": "2018-01-13 09:57", "value": 2 },
{ "time": "2018-01-13 09:58", "value": -6 },
{ "time": "2018-01-13 09:59", "value": -5 },
{ "time": "2018-01-13 10:00", "value": -20 },
{ "time": "2018-01-13 10:01", "value": -12 },
{ "time": "2018-01-13 10:02", "value": 8 },
{ "time": "2018-01-13 10:03", "value": -10 },
{ "time": "2018-01-13 10:04", "value": -20 },
{ "time": "2018-01-13 10:05", "value": -6 },
{ "time": "2018-01-13 10:06", "value": -5 },
{ "time": "2018-01-13 10:07", "value": -9 },
{ "time": "2018-01-13 10:08", "value": -5 },
{ "time": "2018-01-13 10:09", "value": 9 },
{ "time": "2018-01-13 10:10", "value": 2 },
{ "time": "2018-01-13 10:11", "value": -8 },
{ "time": "2018-01-13 10:12", "value": 10 },
{ "time": "2018-01-13 10:13", "value": 4 },
{ "time": "2018-01-13 10:14", "value": -1 },
{ "time": "2018-01-13 10:15", "value": 3 },
{ "time": "2018-01-13 10:16", "value": -5 },
{ "time": "2018-01-13 10:17", "value": -1 },
{ "time": "2018-01-13 10:18", "value": -4 },
{ "time": "2018-01-13 10:19", "value": 0 },
{ "time": "2018-01-13 10:20", "value": 4 },
{ "time": "2018-01-13 10:21", "value": 5 },
{ "time": "2018-01-13 10:22", "value": 6 },
{ "time": "2018-01-13 10:23", "value": 20 },
{ "time": "2018-01-13 10:24", "value": 12 },
{ "time": "2018-01-13 10:25", "value": 8 },
{ "time": "2018-01-13 10:26", "value": 3 },
{ "time": "2018-01-13 10:27", "value": 2 },
{ "time": "2018-01-13 10:28", "value": 0 },
{ "time": "2018-01-13 10:29", "value": -3 },
{ "time": "2018-01-13 10:30", "value": 0 },
{ "time": "2018-01-13 10:31", "value": 4 },
{ "time": "2018-01-13 10:32", "value": 5 },
{ "time": "2018-01-13 10:33", "value": 3 },
{ "time": "2018-01-13 10:34", "value": 13 },
{ "time": "2018-01-13 10:35", "value": 16 },
{ "time": "2018-01-13 10:36", "value": 12 },
{ "time": "2018-01-13 10:37", "value": 11 },
{ "time": "2018-01-13 10:38", "value": 3 },
{ "time": "2018-01-13 10:39", "value": 13 },
{ "time": "2018-01-13 10:40", "value": 16 },
{ "time": "2018-01-13 10:41", "value": 12 },
{ "time": "2018-01-13 10:42", "value": 11 },
{ "time": "2018-01-13 10:43", "value": 3 },
{ "time": "2018-01-13 10:44", "value": 13 },
{ "time": "2018-01-13 10:45", "value": 22 },
{ "time": "2018-01-13 10:46", "value": 18 },
{ "time": "2018-01-13 10:47", "value": 22 },
{ "time": "2018-01-13 10:48", "value": 3 },
{ "time": "2018-01-13 10:49", "value": 13 },
{ "time": "2018-01-13 10:50", "value": 6 },
{ "time": "2018-01-13 10:51", "value": 12 },
{ "time": "2018-01-13 10:52", "value": 11 },
{ "time": "2018-01-13 10:53", "value": 3 },
{ "time": "2018-01-13 10:54", "value": 24 },
{ "time": "2018-01-13 10:55", "value": 2 },
{ "time": "2018-01-13 10:56", "value": -1 },
{ "time": "2018-01-13 10:57", "value": 2 },
{ "time": "2018-01-13 10:58", "value": -10 },
{ "time": "2018-01-13 10:59", "value": -5 },
{ "time": "2018-01-13 11:00", "value": -11 },
{ "time": "2018-01-13 11:01", "value": 4 },
{ "time": "2018-01-13 11:02", "value": 0 },
{ "time": "2018-01-13 11:03", "value": 5 },
{ "time": "2018-01-13 11:04", "value": -4 },
{ "time": "2018-01-13 11:05", "value": -19 },
{ "time": "2018-01-13 11:06", "value": 4 },
{ "time": "2018-01-13 11:07", "value": -1 },
{ "time": "2018-01-13 11:08", "value": 3 },
{ "time": "2018-01-13 11:09", "value": -5 },
{ "time": "2018-01-13 11:10", "value": -3 },
{ "time": "2018-01-13 11:11", "value": -10 },
{ "time": "2018-01-13 11:12", "value": -8 },
{ "time": "2018-01-13 11:13", "value": -10 },
{ "time": "2018-01-13 11:14", "value": 2 },
{ "time": "2018-01-13 11:15", "value": -10 },
{ "time": "2018-01-13 11:16", "value": 14 },
{ "time": "2018-01-13 11:17", "value": 16 },
{ "time": "2018-01-13 11:18", "value": 8 },
{ "time": "2018-01-13 11:19", "value": 12 },
{ "time": "2018-01-13 11:20", "value": 6 },
{ "time": "2018-01-13 11:21", "value": 17 },
{ "time": "2018-01-13 11:22", "value": 14 },
{ "time": "2018-01-13 11:23", "value": -15 },
{ "time": "2018-01-13 11:24", "value": -14 },
{ "time": "2018-01-13 11:25", "value": -8 },
{ "time": "2018-01-13 11:26", "value": -6 },
{ "time": "2018-01-13 11:27", "value": -3 },
{ "time": "2018-01-13 11:28", "value": -16 },
{ "time": "2018-01-13 11:29", "value": -8 },
{ "time": "2018-01-13 11:30", "value": 10 },
{ "time": "2018-01-13 11:31", "value": -8 },
{ "time": "2018-01-13 11:32", "value": -6 },
{ "time": "2018-01-13 11:33", "value": -3 },
{ "time": "2018-01-13 11:34", "value": 0 },
{ "time": "2018-01-13 11:35", "value": 4 },
{ "time": "2018-01-13 11:36", "value": -11 },
{ "time": "2018-01-13 11:37", "value": -8 },
{ "time": "2018-01-13 11:38", "value": -3 },
{ "time": "2018-01-13 11:39", "value": -2 },
{ "time": "2018-01-13 11:40", "value": -15 },
{ "time": "2018-01-13 11:41", "value": 9 },
{ "time": "2018-01-13 11:42", "value": 0 },
{ "time": "2018-01-13 11:43", "value": -1 },
{ "time": "2018-01-13 11:44", "value": -5 },
{ "time": "2018-01-13 11:45", "value": -1 },
{ "time": "2018-01-13 11:46", "value": -7 },
{ "time": "2018-01-13 11:47", "value": -4 },
{ "time": "2018-01-13 11:48", "value": -7 },
{ "time": "2018-01-13 11:49", "value": -8 },
{ "time": "2018-01-13 11:50", "value": -7 },
{ "time": "2018-01-13 11:51", "value": -6 },
{ "time": "2018-01-13 11:52", "value": -5 },
{ "time": "2018-01-13 11:53", "value": -6 },
{ "time": "2018-01-13 11:54", "value": 1 },
{ "time": "2018-01-13 11:55", "value": -3 },
{ "time": "2018-01-13 11:56", "value": 10 },
{ "time": "2018-01-13 11:57", "value": 15 },
{ "time": "2018-01-13 11:58", "value": 0 },
{ "time": "2018-01-13 11:59", "value": 0 }];